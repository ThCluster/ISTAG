import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock, Loader2, MessageSquare, Upload } from 'lucide-react';
import {
  ApiError,
  consulterDossier,
  DossierSuivi,
  EXTENSIONS_ACCEPTEES,
  PIECES,
  PieceType,
  renvoyerPiece,
  verifierFichier,
} from '../api/admissions';
import { INSTITUTION } from '../data/institutionData';

const COULEUR_STATUT: Record<DossierSuivi['statut'], string> = {
  recue: 'bg-blue-100 text-blue-800 border-blue-200',
  en_examen: 'bg-amber-100 text-amber-800 border-amber-200',
  a_completer: 'bg-orange-100 text-orange-800 border-orange-300',
  admis: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  inscrit: 'bg-emerald-200 text-emerald-900 border-emerald-300',
  rejetee: 'bg-red-100 text-red-800 border-red-200',
};

interface DossierTrackingProps {
  /** 'dark' : sur fond vert (page d'accueil) — 'light' : sur fond blanc. */
  variant?: 'light' | 'dark';
}

export const DossierTracking: React.FC<DossierTrackingProps> = ({ variant = 'light' }) => {
  const [numero, setNumero] = useState('');
  const [telephone, setTelephone] = useState('');
  const [dossier, setDossier] = useState<DossierSuivi | null>(null);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const [envoiEnCours, setEnvoiEnCours] = useState<PieceType | null>(null);
  const [erreursPieces, setErreursPieces] = useState<Partial<Record<PieceType, string>>>({});
  const [pieceRenvoyee, setPieceRenvoyee] = useState<PieceType | null>(null);

  const dark = variant === 'dark';

  const rechercher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!numero.trim() || !telephone.trim()) {
      setErreur('Renseignez le numéro de dossier et le téléphone utilisé lors de la pré-inscription.');
      return;
    }
    setChargement(true);
    setErreur(null);
    setDossier(null);
    setPieceRenvoyee(null);
    try {
      setDossier(await consulterDossier(numero, telephone));
    } catch (err) {
      setErreur(err instanceof ApiError ? err.message : 'Une erreur est survenue.');
    } finally {
      setChargement(false);
    }
  };

  const envoyerPiece = async (type: PieceType, file: File | undefined) => {
    if (!file || !dossier) return;
    const probleme = verifierFichier(file);
    if (probleme) {
      setErreursPieces({ ...erreursPieces, [type]: probleme });
      return;
    }
    setEnvoiEnCours(type);
    setErreursPieces({ ...erreursPieces, [type]: undefined });
    try {
      setDossier(await renvoyerPiece(dossier.numero_dossier, telephone, type, file));
      setPieceRenvoyee(type);
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.fieldErrors.fichier || err.message
          : "L'envoi a échoué.";
      setErreursPieces({ ...erreursPieces, [type]: msg });
    } finally {
      setEnvoiEnCours(null);
    }
  };

  const dossierClos = dossier && (dossier.statut === 'inscrit' || dossier.statut === 'rejetee');

  const inputClass = dark
    ? 'px-3 py-2 text-xs bg-white text-[#1F2933] border border-transparent rounded-sm focus:outline-none focus:ring-1 focus:ring-[#F5B51B]'
    : 'px-4 py-3 text-sm bg-stone-50 border border-stone-300 rounded-sm focus:outline-none focus:border-[#08783F] focus:ring-1 focus:ring-[#08783F]';

  return (
    <div className="space-y-4">
      <form onSubmit={rechercher} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="N° de dossier (ISTAG-2026-0001)"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          className={`${inputClass} grow min-w-0 font-mono uppercase`}
        />
        <input
          type="tel"
          placeholder="Téléphone utilisé"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          className={`${inputClass} sm:w-44`}
        />
        <button
          type="submit"
          disabled={chargement}
          className={
            dark
              ? 'px-4 py-2 bg-[#F5B51B] hover:bg-[#FFC83D] text-[#1F2933] font-bold text-xs rounded-sm transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-1.5'
              : 'px-6 py-3 bg-[#08783F] hover:bg-[#056331] text-white font-bold text-xs rounded-sm transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-1.5'
          }
        >
          {chargement && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          <span>Vérifier</span>
        </button>
      </form>

      {erreur && (
        <div
          className={`p-3 rounded-sm text-xs ${
            dark ? 'bg-white/15 border border-white/25 text-white' : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {erreur}
          <span className="block mt-1 opacity-80">
            Besoin d'aide ? Appelez la scolarité au {INSTITUTION.contact.admissionsPhone}.
          </span>
        </div>
      )}

      {dossier && (
        <div className="bg-white text-[#1F2933] border border-stone-200 rounded-sm p-5 space-y-4 text-xs shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <span className="font-mono font-bold text-[#08783F] text-sm block">{dossier.numero_dossier}</span>
              <span className="text-[#667085]">
                {dossier.nom.toUpperCase()} {dossier.prenoms} · {dossier.filiere_nom} ({dossier.niveau})
              </span>
            </div>
            <span className={`px-2.5 py-1 border rounded-sm font-bold ${COULEUR_STATUT[dossier.statut]}`}>
              {dossier.statut_label}
            </span>
          </div>

          {dossier.message_candidat && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-sm flex gap-2">
              <MessageSquare className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-amber-900 mb-0.5">Message de la scolarité</strong>
                <p className="text-amber-900 whitespace-pre-line">{dossier.message_candidat}</p>
              </div>
            </div>
          )}

          <div>
            <strong className="block text-[#08783F] uppercase tracking-wider mb-2">Pièces justificatives</strong>
            <ul className="divide-y divide-stone-100 border border-stone-200 rounded-sm">
              {PIECES.map(({ type, label }) => {
                const piece = dossier.pieces.find((p) => p.type_piece === type);
                const peutEnvoyer = !dossierClos && (!piece || piece.statut === 'non_conforme');
                return (
                  <li key={type} className="p-3 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-medium">{label}</span>
                      {!piece && <span className="text-[#667085] shrink-0">Non fournie</span>}
                      {piece?.statut === 'en_attente' && (
                        <span className="flex items-center gap-1 text-amber-700 shrink-0">
                          <Clock className="w-3.5 h-3.5" /> En vérification
                        </span>
                      )}
                      {piece?.statut === 'conforme' && (
                        <span className="flex items-center gap-1 text-[#08783F] font-semibold shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Conforme
                        </span>
                      )}
                      {piece?.statut === 'non_conforme' && (
                        <span className="flex items-center gap-1 text-red-700 font-semibold shrink-0">
                          <AlertTriangle className="w-3.5 h-3.5" /> À renvoyer
                        </span>
                      )}
                    </div>

                    {piece?.statut === 'non_conforme' && piece.commentaire && (
                      <p className="text-red-700">Motif : {piece.commentaire}</p>
                    )}
                    {pieceRenvoyee === type && piece?.statut === 'en_attente' && (
                      <p className="text-[#08783F]">Nouveau document reçu, merci ! La scolarité va le vérifier.</p>
                    )}

                    {peutEnvoyer && (
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#08783F] text-[#08783F] rounded-sm font-semibold cursor-pointer hover:bg-[#08783F]/5">
                        {envoiEnCours === type ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>{piece ? 'Envoyer un nouveau document' : 'Envoyer ce document'}</span>
                        <input
                          type="file"
                          accept={EXTENSIONS_ACCEPTEES}
                          className="sr-only"
                          disabled={envoiEnCours !== null}
                          onChange={(e) => {
                            envoyerPiece(type, e.target.files?.[0]);
                            e.target.value = '';
                          }}
                        />
                      </label>
                    )}
                    {erreursPieces[type] && <p className="text-red-600">{erreursPieces[type]}</p>}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
