import React, { useState } from 'react';
import {
  X,
  MapPin,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  Sparkles,
  Share2,
  GraduationCap,
  Pickaxe,
  Sprout,
  Laptop,
  Briefcase,
  Printer,
  Building,
  Plane,
  Radio,
  BookOpen
} from 'lucide-react';
import { Logo } from './Logo';

interface FlyerShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPreRegistration?: (programId?: string) => void;
}

export const FlyerShowcaseModal: React.FC<FlyerShowcaseModalProps> = ({
  isOpen,
  onClose,
  onOpenPreRegistration
}) => {
  const [activeTab, setActiveTab] = useState<'flyer' | 'technique' | 'bts' | 'superieur' | 'contacts'>('flyer');

  if (!isOpen) return null;

  const btsFilieres = [
    { code: 'FCGE', name: 'BTS Finance comptabilité et Gestion des Entreprises', cat: 'Tertiaire', icon: Briefcase },
    { code: 'GEC', name: 'BTS Gestion Commerciale', cat: 'Commerce', icon: Briefcase },
    { code: 'RHCOM', name: 'BTS Ressources Humaines et Communications', cat: 'Management', icon: Briefcase },
    { code: 'AD', name: 'BTS Assistanat de Direction', cat: 'Secrétariat', icon: Briefcase },
    { code: 'LT', name: 'BTS Logistique', cat: 'Transport', icon: Briefcase },
    { code: 'IDA', name: "BTS Informatique Développeur d'Application", cat: 'Digital', icon: Laptop },
    { code: 'RIT', name: 'BTS Réseaux Informatiques et Télécommunications', cat: 'Réseaux', icon: Laptop },
    { code: 'SEI', name: 'BTS Systèmes Électroniques et Informatiques', cat: 'Industrie', icon: Radio },
    { code: 'ATPA', name: 'BTS Agriculture Tropicale (Option Animale)', cat: 'Agro', icon: Sprout },
    { code: 'ATPV', name: 'BTS Agriculture Tropicale (Option Végétale)', cat: 'Agro', icon: Sprout },
    { code: 'GCB', name: 'BTS Génie Civil (Option Bâtiment)', cat: 'BTP', icon: Building },
    { code: 'TH', name: 'BTS Touristique et Hôtellerie', cat: 'Tourisme', icon: Plane }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ISTAG - Dépliant Officiel & Rentrée',
          text: 'Découvrez le flyer officiel de l\'ISTAG Gagnoa (Ex-Collège Alliance) : Enseignement Technique, 12 BTS d\'État, Licences & Masters !',
          url: window.location.href
        });
      } catch {
        // Ignored
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden border border-stone-200 my-auto print:shadow-none print:border-none">
        
        {/* Top Header Controls (Hidden during print) */}
        <div className="bg-[#056331] text-white px-4 py-3 sm:px-6 flex items-center justify-between border-b border-[#08783F] print:hidden">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F5B51B] text-[#056331]">
              Flyer Officiel
            </span>
            <span className="text-xs sm:text-sm font-medium tracking-wide">
              ISTAG Gagnoa Garahio — Ex-Collège Les Alliances
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="Imprimer le dépliant"
              className="p-1.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              title="Partager"
              className="p-1.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Fermer"
              className="p-1.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation for fast exploration on mobile / tablet */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-4 sm:px-6 overflow-x-auto no-scrollbar print:hidden">
          <button
            onClick={() => setActiveTab('flyer')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'flyer'
                ? 'border-[#08783F] text-[#08783F] bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Vue Synthétique Flyer
          </button>
          <button
            onClick={() => setActiveTab('technique')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'technique'
                ? 'border-[#08783F] text-[#08783F] bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Technique & Pro (35 000 F)
          </button>
          <button
            onClick={() => setActiveTab('bts')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'bts'
                ? 'border-[#08783F] text-[#08783F] bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            BTS : 12 Filières
          </button>
          <button
            onClick={() => setActiveTab('superieur')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'superieur'
                ? 'border-[#08783F] text-[#08783F] bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Licence & Master
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'contacts'
                ? 'border-[#08783F] text-[#08783F] bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Contacts & Accès
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-8 max-h-[75vh] overflow-y-auto">
          {/* TAB 1: SYNTHETIC FLYER VIEW */}
          {activeTab === 'flyer' && (
            <div className="space-y-6">
              {/* Institution Header from Flyer */}
              <div className="text-center border-b border-stone-200 pb-5">
                <div className="flex justify-center mb-3">
                  <Logo className="h-14 sm:h-16 w-auto" />
                </div>
                <h1 className="text-xl sm:text-2xl font-serif font-black text-[#1F2933] uppercase tracking-wide">
                  INSTITUT SUPERIEUR DES TECHNOLOGIES AVANCEES
                </h1>
                <div className="mt-2 inline-flex items-center gap-2 px-3.5 py-1 bg-amber-50 border border-amber-300 rounded text-xs font-bold text-amber-900">
                  <Sparkles className="w-3.5 h-3.5 text-[#F5B51B]" />
                  <span>ISTAG : INNOVATION — EXCELLENCE — OPPORTUNITÉ</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 mt-3 text-xs text-stone-700">
                  <span className="font-semibold text-[#08783F]">Tel: (225) 07 07 48 60 50 / 01 42 89 18 84 / 05 64 21 43 73</span>
                  <span className="text-stone-300">·</span>
                  <span className="font-semibold text-stone-800">Email: istag225@gmail.com</span>
                </div>
              </div>

              {/* 3 Main Sections of Flyer in Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Enseignement Technique */}
                <div className="bg-amber-50/70 border-2 border-amber-300 rounded-sm p-5 space-y-3">
                  <div className="border-b border-amber-200 pb-2">
                    <span className="text-[11px] font-bold uppercase text-amber-800 tracking-wider block">Cycle Secondaire</span>
                    <h3 className="font-serif font-bold text-base text-[#1F2933]">
                      ENSEIGNEMENT TECHNIQUE & PROFESSIONNEL
                    </h3>
                  </div>
                  <ul className="space-y-1.5 text-xs text-stone-800">
                    <li className="font-medium">• BAC G1 (Secrétariat)</li>
                    <li className="font-medium">• BAC G2 (Comptabilité)</li>
                    <li className="font-medium">• BAC F2 (Électronique)</li>
                    <li className="font-medium">• BEP Comptabilité</li>
                    <li className="font-medium">• BT Sciences Médico-Sociales</li>
                  </ul>
                  <div className="pt-3 border-t border-amber-200 text-center bg-white p-2.5 rounded border border-amber-200">
                    <span className="text-[11px] uppercase font-bold text-stone-500 block">Frais Inscription</span>
                    <span className="text-lg font-bold text-[#08783F]">AFFECTÉ : 35.000 F</span>
                  </div>
                </div>

                {/* 2. BTS : Nos Filières */}
                <div className="bg-emerald-50/70 border-2 border-[#08783F] rounded-sm p-5 space-y-3">
                  <div className="border-b border-emerald-200 pb-2">
                    <span className="text-[11px] font-bold uppercase text-[#056331] tracking-wider block">Diplôme d'État (Bac+2)</span>
                    <h3 className="font-serif font-bold text-base text-[#1F2933]">
                      BTS : NOS 12 FILIÈRES
                    </h3>
                  </div>
                  <ul className="space-y-1 text-xs text-stone-800 max-h-48 overflow-y-auto pr-1">
                    <li>✔ BTS Finance comptabilité (FCGE)</li>
                    <li>✔ BTS Gestion Commerciale</li>
                    <li>✔ BTS RH et Communications</li>
                    <li>✔ BTS Assistanat de Direction</li>
                    <li>✔ BTS Logistique</li>
                    <li>✔ BTS Informatique Développeur (IDA)</li>
                    <li>✔ BTS Réseaux Télécoms (RIT)</li>
                    <li>✔ BTS Systèmes Électroniques (SEI)</li>
                    <li>✔ BTS Agriculture (Option Animale)</li>
                    <li>✔ BTS Agriculture (Option Végétale)</li>
                    <li>✔ BTS Génie Civil (Option Bâtiment)</li>
                    <li>✔ BTS Touristique et Hôtellerie</li>
                  </ul>
                  <div className="pt-2 border-t border-emerald-200 bg-white p-2.5 rounded border border-emerald-200 text-center">
                    <span className="text-[11px] uppercase font-bold text-stone-500 block">Frais Inscription BTS</span>
                    <div className="text-xs font-bold text-[#056331]">
                      AFFECTÉ : <strong className="text-sm text-[#08783F]">85.000 F</strong>
                    </div>
                    <div className="text-xs font-bold text-stone-700">
                      NON AFFECTÉ : <strong className="text-sm text-stone-900">200.000 F</strong>
                    </div>
                  </div>
                </div>

                {/* 3. Licence & Master */}
                <div className="bg-blue-50/70 border-2 border-blue-300 rounded-sm p-5 space-y-3">
                  <div className="border-b border-blue-200 pb-2">
                    <span className="text-[11px] font-bold uppercase text-blue-800 tracking-wider block">Cycle Supérieur</span>
                    <h3 className="font-serif font-bold text-base text-[#1F2933]">
                      LICENCE & MASTER
                    </h3>
                  </div>
                  <ul className="space-y-1 text-xs text-stone-800">
                    <li>✔ Finance Comptabilité</li>
                    <li>✔ Banque et Assurance</li>
                    <li>✔ Gestion des Ressources Humaines</li>
                    <li>✔ Gestion des Projets</li>
                    <li>✔ Informatique (Génie Logiciel)</li>
                    <li>✔ Transport & Logistique</li>
                    <li>✔ Audit et Contrôle</li>
                    <li>✔ Marketing, Management & Com</li>
                  </ul>
                  <div className="pt-2 border-t border-blue-200 bg-white p-2.5 rounded border border-blue-200 text-center">
                    <span className="text-[11px] uppercase font-bold text-stone-500 block">Frais Inscription / An</span>
                    <div className="text-xs font-bold text-blue-900">
                      LICENCE : <strong className="text-sm text-blue-700">450.000 F / AN</strong>
                    </div>
                    <div className="text-xs font-bold text-stone-900">
                      MASTER : <strong className="text-sm text-stone-900">800.000 F / AN</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Location Banner from Flyer */}
              <div className="p-4 bg-[#F5B51B] text-[#1F2933] rounded-sm font-bold text-center text-sm sm:text-base border border-amber-400 flex flex-col sm:flex-row items-center justify-center gap-2">
                <MapPin className="w-5 h-5 text-[#056331]" />
                <span>📍 GAGNOA GARAHIO, EX COLLEGE ALLIANCE</span>
              </div>
            </div>
          )}

          {/* TAB 2: TECHNIQUE & PRO */}
          {activeTab === 'technique' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-300 rounded text-xs space-y-1">
                <span className="font-bold text-amber-900 text-sm">ENSEIGNEMENT TECHNIQUE & PROFESSIONNEL</span>
                <p className="text-stone-700">
                  Préparation aux diplômes d'État du secondaire technique avec un encadrement rigoureux et des enseignants certifiés.
                </p>
                <div className="pt-2 font-bold text-[#08783F]">
                  Frais d'inscription officiel pour les élèves affectés : <strong>35.000 FCFA</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-white border border-stone-200 rounded">
                  <span className="text-xs font-bold text-[#08783F]">BAC G1</span>
                  <h4 className="font-serif font-bold text-sm text-[#1F2933]">Secrétariat & Bureautique</h4>
                  <p className="text-xs text-stone-500 mt-1">Techniques administratives, rédaction, sténodactylo et outils bureautiques.</p>
                </div>

                <div className="p-3.5 bg-white border border-stone-200 rounded">
                  <span className="text-xs font-bold text-[#08783F]">BAC G2</span>
                  <h4 className="font-serif font-bold text-sm text-[#1F2933]">Comptabilité & Gestion</h4>
                  <p className="text-xs text-stone-500 mt-1">Comptabilité générale, mathématiques financières, droit et fiscalité de base.</p>
                </div>

                <div className="p-3.5 bg-white border border-stone-200 rounded">
                  <span className="text-xs font-bold text-[#08783F]">BAC F2</span>
                  <h4 className="font-serif font-bold text-sm text-[#1F2933]">Électronique</h4>
                  <p className="text-xs text-stone-500 mt-1">Circuits analogiques et numériques, mesures électriques et automatisme.</p>
                </div>

                <div className="p-3.5 bg-white border border-stone-200 rounded">
                  <span className="text-xs font-bold text-[#08783F]">BEP Comptabilité</span>
                  <h4 className="font-serif font-bold text-sm text-[#1F2933]">Brevet d'Études Professionnelles</h4>
                  <p className="text-xs text-stone-500 mt-1">Cycle court professionnel d'aide-comptable et tenue de livres.</p>
                </div>

                <div className="p-3.5 bg-white border border-stone-200 rounded sm:col-span-2">
                  <span className="text-xs font-bold text-[#08783F]">BT SMS</span>
                  <h4 className="font-serif font-bold text-sm text-[#1F2933]">BT Sciences Médico-Sociales</h4>
                  <p className="text-xs text-stone-500 mt-1">Secrétariat médical, assistance en clinique, gestion de dossiers médicaux et accueil hospitalier.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BTS 12 FILIERES */}
          {activeTab === 'bts' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded text-xs space-y-1">
                <span className="font-bold text-[#056331] text-sm">BTS : NOS 12 FILIÈRES D'ÉTAT</span>
                <p className="text-stone-700">
                  Préparation intensive au Brevet de Technicien Supérieur avec des taux d'admissibilité élevés.
                </p>
                <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold">
                  <span className="text-[#08783F]">AFFECTÉ : 85.000 FCFA</span>
                  <span className="text-stone-800">NON AFFECTÉ : 200.000 FCFA</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {btsFilieres.map((f, idx) => {
                  const Icon = f.icon;
                  return (
                    <div key={idx} className="p-3 bg-white border border-stone-200 rounded flex items-start gap-3">
                      <div className="w-8 h-8 rounded bg-[#08783F]/10 text-[#08783F] flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#08783F]">{f.code}</span>
                        <h4 className="text-xs font-bold text-[#1F2933]">{f.name}</h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: LICENCE & MASTER */}
          {activeTab === 'superieur' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-300 rounded text-xs space-y-1">
                <span className="font-bold text-blue-900 text-sm">CYCLES SUPÉRIEURS : LICENCES & MASTERS</span>
                <p className="text-stone-700">
                  Cours du jour et cours du soir pour auditeurs et cadres en activité.
                </p>
                <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold">
                  <span className="text-blue-800">LICENCE : 450.000 FCFA / AN</span>
                  <span className="text-stone-900">MASTER : 800.000 FCFA / AN</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  "Finance Comptabilité",
                  "Banque et Assurance",
                  "Gestion des Ressources Humaines",
                  "Gestion des Projets",
                  "Informatique (Option Génie logiciel)",
                  "Transport & Logistique",
                  "Audit et Contrôle",
                  "Marketing, management et communication"
                ].map((spec, idx) => (
                  <div key={idx} className="p-3 bg-white border border-stone-200 rounded flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#08783F] shrink-0" />
                    <span className="font-semibold text-stone-800">{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CONTACTS */}
          {activeTab === 'contacts' && (
            <div className="space-y-4">
              <div className="p-5 bg-stone-50 border border-stone-200 rounded-sm space-y-3">
                <h3 className="font-serif font-bold text-base text-[#1F2933]">
                  Coordonnées Officielles ISTAG Gagnoa
                </h3>
                <div className="space-y-2 text-xs text-stone-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#08783F] shrink-0" />
                    <span><strong>Localisation :</strong> GAGNOA GARAHIO, EX COLLEGE ALLIANCE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#08783F] shrink-0" />
                    <span><strong>Téléphones :</strong> (225) 07 07 48 60 50 / 01 42 89 18 84 / 05 64 21 43 73</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#08783F] shrink-0" />
                    <span><strong>Email :</strong> istag225@gmail.com</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200 flex flex-wrap gap-3">
                  <a
                    href="tel:+2250707486050"
                    className="px-4 py-2 bg-[#08783F] text-white rounded text-xs font-bold flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Appeler (07 07 48 60 50)
                  </a>
                  <a
                    href="https://wa.me/2250707486050"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#25D366] text-white rounded text-xs font-bold flex items-center gap-1.5"
                  >
                    WhatsApp direct
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <div className="text-xs text-stone-500 text-center sm:text-left">
            Inscriptions ouvertes à Gagnoa Garahio · Affectés de l'État & Non Affectés
          </div>
          <button
            onClick={() => {
              onClose();
              if (onOpenPreRegistration) onOpenPreRegistration();
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#F5B51B] hover:bg-[#FFC83D] text-[#1F2933] font-bold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
          >
            Faire ma Pré-inscription en ligne
          </button>
        </div>
      </div>
    </div>
  );
};
