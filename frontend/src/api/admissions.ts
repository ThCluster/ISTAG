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

export const TAILLE_MAX_PIECE = 5 * 1024 * 1024; // 5 Mo, comme le serveur
export const EXTENSIONS_ACCEPTEES = '.pdf,.jpg,.jpeg,.png';

/** Vérification rapide avant envoi (le serveur revérifie de toute façon). */
export function verifierFichier(file: File): string | null {
  const ext = file.name.toLowerCase().split('.').pop() || '';
  if (!['pdf', 'jpg', 'jpeg', 'png'].includes(ext)) {
    return 'Format non accepté. Envoyez un PDF, JPG ou PNG.';
  }
  if (file.size > TAILLE_MAX_PIECE) {
    return 'Fichier trop volumineux (maximum 5 Mo).';
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
  for (const [type, file] of Object.entries(pieces)) {
    if (file) body.append(CHAMP_PIECE[type as PieceType], file);
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
