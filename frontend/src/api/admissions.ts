// Client de l'API Django des pré-inscriptions.

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

export type PieceType = 'acte_naissance' | 'diplome' | 'piece_identite' | 'photo';

export const PIECES: { type: PieceType; label: string; hint: string }[] = [
  {
    type: 'acte_naissance',
    label: "Extrait d'acte de naissance",
    hint: "Requis pour l'immatriculation au Ministère de l'Enseignement Supérieur",
  },
  {
    type: 'diplome',
    label: 'Collation / attestation du Bac ou du dernier diplôme',
    hint: "Justificatif officiel de votre niveau d'études",
  },
  {
    type: 'piece_identite',
    label: "Carte Nationale d'Identité (CNI) ou passeport",
    hint: "Document d'identité en cours de validité",
  },
  {
    type: 'photo',
    label: "Photo d'identité récente, en couleur, sur fond blanc",
    hint: "Destinée à votre dossier et à la carte d'étudiant ISTAG",
  },
];

export const TAILLE_MAX_PIECE = 4 * 1024 * 1024; // 4 Mo, comme le serveur
export const EXTENSIONS_ACCEPTEES = '.pdf,.jpg,.jpeg,.png';

// L'hébergeur (Vercel) refuse les requêtes de plus de 4,5 Mo : toutes les pièces
// d'un dossier partent ensemble, donc leur total doit rester en dessous.
export const TAILLE_MAX_ENVOI = 4 * 1024 * 1024;

const COTE_MAX_IMAGE = 2000; // pixels : largement lisible pour un document
const SEUIL_COMPRESSION = 500 * 1024; // on ne touche pas aux petites images

/** Réduit une photo JPG/PNG (souvent 3 à 8 Mo sur un téléphone) en JPEG léger.
 *  Les PDF et les petites images sont renvoyés tels quels. */
export async function preparerFichier(file: File): Promise<File> {
  const ext = file.name.toLowerCase().split('.').pop() || '';
  if (!['jpg', 'jpeg', 'png'].includes(ext) || file.size <= SEUIL_COMPRESSION) return file;
  try {
    const image = await createImageBitmap(file);
    const echelle = Math.min(1, COTE_MAX_IMAGE / Math.max(image.width, image.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(image.width * echelle);
    canvas.height = Math.round(image.height * echelle);
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.fillStyle = '#ffffff'; // fond blanc pour les PNG transparents
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    image.close();
    const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, 'image/jpeg', 0.82));
    if (!blob || blob.size >= file.size) return file;
    const nom = file.name.replace(/\.[^.]+$/, '') + '.jpg';
    return new File([blob], nom, { type: 'image/jpeg', lastModified: Date.now() });
  } catch {
    return file; // navigateur trop ancien : on envoie l'original
  }
}

/** Vérification rapide avant envoi (le serveur revérifie de toute façon). */
export function verifierFichier(file: File): string | null {
  const ext = file.name.toLowerCase().split('.').pop() || '';
  if (!['pdf', 'jpg', 'jpeg', 'png'].includes(ext)) {
    return 'Format non accepté. Envoyez un PDF, JPG ou PNG.';
  }
  if (file.size > TAILLE_MAX_PIECE) {
    return 'Fichier trop volumineux (maximum 4 Mo).';
  }
  return null;
}

export interface PieceSuivi {
  type_piece: PieceType;
  type_label: string;
  statut: 'en_attente' | 'conforme' | 'non_conforme';
  statut_label: string;
  commentaire: string;
  date_envoi: string;
}

export interface DossierSuivi {
  numero_dossier: string;
  statut: 'recue' | 'en_examen' | 'a_completer' | 'admis' | 'inscrit' | 'rejetee';
  statut_label: string;
  message_candidat: string;
  nom: string;
  prenoms: string;
  niveau: string;
  filiere_nom: string;
  campus_nom: string;
  regime: string;
  date_creation: string;
  date_mise_a_jour: string;
  pieces: PieceSuivi[];
}

export interface PreInscriptionCreee {
  numero_dossier: string;
  date_creation: string;
}

export class ApiError extends Error {
  fieldErrors: Record<string, string>;
  constructor(message: string, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.fieldErrors = fieldErrors;
  }
}

async function appeler<T>(chemin: string, init: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${chemin}`, init);
  } catch {
    throw new ApiError(
      'Impossible de joindre le serveur ISTAG. Vérifiez votre connexion internet puis réessayez.'
    );
  }
  if (res.status === 413) {
    throw new ApiError('Documents trop volumineux. Envoyez des fichiers plus légers puis réessayez.');
  }

  const data = await res.json().catch(() => null);
  if (res.ok) return data as T;

  // Erreurs DRF : {detail} ou {champ: [messages]} ou {non_field_errors: [...]}
  const fieldErrors: Record<string, string> = {};
  let message = 'Une erreur est survenue. Veuillez réessayer.';
  if (data && typeof data === 'object') {
    for (const [champ, val] of Object.entries(data)) {
      const texte = Array.isArray(val) ? String(val[0]) : String(val);
      if (champ === 'detail' || champ === 'non_field_errors') message = texte;
      else fieldErrors[champ] = texte;
    }
    if (Object.keys(fieldErrors).length && !('detail' in data) && !('non_field_errors' in data)) {
      message = 'Certaines informations sont à corriger.';
    }
  }
  throw new ApiError(message, fieldErrors);
}

const CHAMP_PIECE: Record<PieceType, string> = {
  acte_naissance: 'piece_acte_naissance',
  diplome: 'piece_diplome',
  piece_identite: 'piece_identite',
  photo: 'piece_photo',
};

/** Nom du champ API → type de pièce (pour afficher les erreurs au bon endroit). */
export const PIECE_DU_CHAMP: Record<string, PieceType> = Object.fromEntries(
  Object.entries(CHAMP_PIECE).map(([type, champ]) => [champ, type as PieceType])
);

export function soumettrePreinscription(
  champs: Record<string, string | boolean>,
  pieces: Partial<Record<PieceType, File>>
): Promise<PreInscriptionCreee> {
  const body = new FormData();
  for (const [k, v] of Object.entries(champs)) {
    if (v === '') continue;
    body.append(k, typeof v === 'boolean' ? String(v) : v);
  }
  let total = 0;
  for (const [type, file] of Object.entries(pieces)) {
    if (!file) continue;
    total += file.size;
    body.append(CHAMP_PIECE[type as PieceType], file);
  }
  if (total > TAILLE_MAX_ENVOI) {
    return Promise.reject(
      new ApiError(
        "L'ensemble de vos documents dépasse 4 Mo. Remplacez les plus lourds par une photo " +
          'ou un scan plus léger, puis réessayez.'
      )
    );
  }
  return appeler('/api/preinscriptions/', { method: 'POST', body });
}

export function consulterDossier(numero: string, telephone: string): Promise<DossierSuivi> {
  return appeler('/api/preinscriptions/suivi/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ numero: numero.trim(), telephone: telephone.trim() }),
  });
}

export function renvoyerPiece(
  numero: string,
  telephone: string,
  type: PieceType,
  fichier: File
): Promise<DossierSuivi> {
  const body = new FormData();
  body.append('numero', numero.trim());
  body.append('telephone', telephone.trim());
  body.append('type_piece', type);
  body.append('fichier', fichier);
  return appeler('/api/preinscriptions/suivi/pieces/', { method: 'POST', body });
}
