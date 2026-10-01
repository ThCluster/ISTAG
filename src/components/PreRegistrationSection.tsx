import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, FileCheck, Search, HelpCircle, PhoneCall } from 'lucide-react';
import { INSTITUTION } from '../data/institutionData';
import { Program, PROGRAMS } from '../data/programsData';

interface PreRegistrationSectionProps {
  onOpenPreRegistration: (selectedProgram?: Program) => void;
}

export const PreRegistrationSection: React.FC<PreRegistrationSectionProps> = ({
  onOpenPreRegistration,
}) => {
  const [trackingCode, setTrackingCode] = useState('');
  const [trackingResult, setTrackingResult] = useState<string | null>(null);

  const handleTrackDossier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;

    if (trackingCode.toUpperCase().startsWith('ISTAG-')) {
      setTrackingResult(
        `Dossier ${trackingCode.toUpperCase()} : Pré-inscription bien enregistrée dans la base de l'ISTAG. Vous êtes attendu(e) au guichet scolarité du campus choisi muni de vos pièces justificatives.`
      );
    } else {
      setTrackingResult(
        `Le format du numéro de dossier doit être de type ISTAG-2026-XXXX. Pour tout renseignement, contactez la scolarité au ${INSTITUTION.contact.admissionsPhone}.`
      );
    }
  };

  return (
    <section id="admissions" className="py-20 bg-[#056331] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Admissions Process Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs uppercase tracking-widest text-[#F5B51B] font-bold">
              05. Parcours d'Admission & Pré-inscription 2026–2027
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight leading-tight text-balance">
              Sécurisez votre place dans la promotion d'élite de l'ISTAG.
            </h2>
            <p className="text-white/85 text-sm sm:text-base leading-relaxed">
              Pour garantir la qualité de l'encadrement pédagogique et la disponibilité des postes en laboratoire informatique, les effectifs par filière sont strictement limités. Effectuez votre démarche de pré-inscription dès maintenant en 3 minutes.
            </p>

            {/* 3 Step Flow */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4 p-4 bg-white/10 border border-white/15 rounded-sm">
                <div className="w-8 h-8 rounded-sm bg-[#F5B51B] text-[#1F2933] font-bold text-sm flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    Pré-inscription en ligne & Choix du Campus
                  </h4>
                  <p className="text-xs text-white/80 mt-0.5">
                    Sélectionnez votre cycle d'études (BTS d'État, Formations Métiers), votre filière et bloquez votre place au campus de Gagnoa Garahio.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/10 border border-white/15 rounded-sm">
                <div className="w-8 h-8 rounded-sm bg-[#F5B51B] text-[#1F2933] font-bold text-sm flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    Émission instantanée de votre Récépissé Numérique
                  </h4>
                  <p className="text-xs text-white/80 mt-0.5">
                    Téléchargez ou imprimez votre récépissé muni de votre numéro de dossier officiel ISTAG pour bloquer votre priorité d'admission.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/10 border border-white/15 rounded-sm">
                <div className="w-8 h-8 rounded-sm bg-[#F5B51B] text-[#1F2933] font-bold text-sm flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    Entretien d'Orientation & Dépôt des Pièces
                  </h4>
                  <p className="text-xs text-white/80 mt-0.5">
                    Rendez-vous à la scolarité du campus pour finaliser votre dossier physique et recevoir votre carte d'étudiant.
                  </p>
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                onClick={() => onOpenPreRegistration()}
                className="px-8 py-4 bg-[#F5B51B] hover:bg-[#FFC83D] active:bg-[#e0a210] text-[#1F2933] font-bold text-sm rounded-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Accéder à la Page d'Inscription en Ligne</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Portal Card & Track Status */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Card */}
            <div className="bg-white text-[#1F2933] p-8 rounded-sm shadow-xl border border-stone-200 relative">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#08783F]" />
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#08783F] mb-2">
                <FileCheck className="w-4 h-4 text-[#08783F]" />
                <span>Candidatures Ouvertes</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-[#1F2933] mb-2">
                Campagne de Recrutement 2026–2027
              </h3>
              <p className="text-xs text-[#667085] mb-6 leading-relaxed">
                Rentrée officielle pour les filières BTS & Licences : <strong>Octobre 2026</strong>. Rentrée Masters Professionnels : <strong>Novembre 2026</strong>.
              </p>

              <div className="space-y-3 mb-6 text-xs text-[#1F2933]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#08783F] shrink-0" />
                  <span>Validation du dossier sous 48h ouvrées</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#08783F] shrink-0" />
                  <span>Échelonnement des frais de scolarité possible</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#08783F] shrink-0" />
                  <span>Assistance téléphonique dédiée à l'orientation</span>
                </div>
              </div>

              {/* Bouton principal vert avec texte blanc */}
              <button
                onClick={() => onOpenPreRegistration()}
                className="w-full py-3.5 bg-[#08783F] hover:bg-[#056331] text-white font-bold text-xs rounded-sm transition-colors text-center cursor-pointer shadow-sm"
              >
                Commencer ma pré-inscription
              </button>
            </div>

            {/* Existing File Tracking Box */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 p-6 rounded-sm text-xs">
              <div className="flex items-center gap-2 font-semibold text-white mb-2">
                <Search className="w-4 h-4 text-[#F5B51B]" />
                <span>Vous avez déjà un numéro de dossier ?</span>
              </div>
              <p className="text-white/80 mb-3">
                Entrez votre code (ex: <span className="font-mono text-[#F5B51B]">ISTAG-2026-4912</span>) pour vérifier l'état de votre dossier :
              </p>

              <form onSubmit={handleTrackDossier} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Code de dossier ISTAG"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  className="grow px-3 py-2 text-xs bg-white text-[#1F2933] border border-transparent rounded-sm focus:outline-none focus:ring-1 focus:ring-[#F5B51B]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#F5B51B] hover:bg-[#FFC83D] text-[#1F2933] font-bold rounded-sm transition-colors cursor-pointer"
                >
                  Vérifier
                </button>
              </form>

              {trackingResult && (
                <div className="mt-3 p-3 bg-white/15 border border-white/25 rounded-sm text-white text-xs">
                  {trackingResult}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
