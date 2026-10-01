import React, { useState } from 'react';
import { TUITION_SCHEDULE } from '../data/institutionData';
import { Calculator, CheckCircle2, Sparkles, HelpCircle, ShieldCheck } from 'lucide-react';

export const TuitionSection: React.FC = () => {
  const [selectedCycle, setSelectedCycle] = useState<'technique' | 'bts-affecte' | 'bts-non-affecte' | 'licence' | 'master'>('bts-affecte');
  const [installmentsCount, setInstallmentsCount] = useState<number>(6);

  const getCycleData = () => {
    switch (selectedCycle) {
      case 'technique':
        return {
          title: 'Enseignement Technique & Professionnel (Affecté)',
          level: 'Secondaire Technique',
          frais: 35000,
          label: 'Frais d\'inscription officiel',
          desc: 'BAC G1, BAC G2, BAC F2, BEP Comptabilité, BT Sciences Médico-Sociales',
          included: 'Inscription annuelle, cartes et accès aux salles et ateliers pratiques.'
        };
      case 'bts-affecte':
        return {
          title: 'BTS d\'État — Candidat Affecté par l\'État',
          level: 'Bac+2',
          frais: 85000,
          label: 'Frais d\'inscription officiel',
          desc: '12 Filières BTS (Agro, Mines, Informatique, Bâtiment, Hôtellerie, Gestion)',
          included: 'Inscription officielle, encadrement intensif à l\'examen national, laboratoires informatiques.'
        };
      case 'bts-non-affecte':
        return {
          title: 'BTS d\'État — Candidat Non Affecté',
          level: 'Bac+2',
          frais: 200000,
          label: 'Frais d\'inscription officiel',
          desc: '12 Filières BTS (Agro, Mines, Informatique, Bâtiment, Hôtellerie, Gestion)',
          included: 'Inscription officielle, encadrement académique, travaux pratiques et préparation aux épreuves d\'État.'
        };
      case 'licence':
        return {
          title: 'Licence Professionnelle (Bac+3)',
          level: 'Bac+3',
          frais: 450000,
          label: 'Frais d\'inscription & scolarité annuelle',
          desc: '8 Spécialités (Finance, Banque, GRH, Projets, Génie Logiciel, Transport, Audit, Marketing)',
          included: 'Cours magistraux, séminaires professionnels, encadrement du projet de fin d\'études.'
        };
      case 'master':
        return {
          title: 'Master Professionnel (Bac+5)',
          level: 'Bac+5',
          frais: 800000,
          label: 'Frais d\'inscription & scolarité annuelle',
          desc: '8 Spécialités exécutives en Cours du Soir & Samedi',
          included: 'Modules de haut niveau, études de cas industriels, encadrement de thèse professionnelle.'
        };
    }
  };

  const currentData = getCycleData();
  const monthlyInstallment = Math.round(currentData.frais / installmentsCount);

  return (
    <section id="scolarite" className="py-20 bg-[#F8FAF9] text-[#1F2933] border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs uppercase tracking-widest text-[#08783F] font-bold mb-3">
            06. Frais d'Études & Modalités Officielles
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1F2933] tracking-tight mb-4">
            Tarifs officiels transparents issus du dépliant ISTAG.
          </h2>
          <p className="text-[#667085] text-sm sm:text-base leading-relaxed">
            Consultez les frais d'inscription officiels affichés sur le flyer de l'ISTAG Gagnoa (Ex-Collège Les Alliances) pour chaque filière et cycle d'études.
          </p>
        </div>

        {/* 4 Cycle Cards from Flyer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Card 1: Technique & Pro */}
          <div
            onClick={() => {
              setSelectedCycle('technique');
              setInstallmentsCount(3);
            }}
            className={`bg-white border rounded-sm p-6 flex flex-col justify-between transition-all cursor-pointer ${
              selectedCycle === 'technique'
                ? 'border-[#08783F] shadow-md ring-2 ring-[#08783F]'
                : 'border-stone-200 hover:border-stone-300'
            }`}
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                Technique & Pro
              </span>
              <h3 className="font-serif font-bold text-lg text-[#1F2933] mt-2 mb-1">
                Enseignement Technique
              </h3>
              <p className="text-xs text-stone-500 mb-4">
                BAC G1, G2, F2, BEP Compta, BT SMS
              </p>

              <div className="p-3 bg-amber-50/80 rounded border border-amber-200 mb-3 text-center">
                <span className="text-[10px] uppercase font-bold text-stone-500 block">Frais Inscription</span>
                <span className="text-xl font-bold text-[#08783F] tabular-nums font-mono">
                  35 000 FCFA
                </span>
                <span className="text-[11px] text-stone-600 block mt-0.5">Élèves Affectés de l'État</span>
              </div>
            </div>

            <button
              className={`w-full py-2 text-xs font-semibold rounded-sm transition-colors cursor-pointer ${
                selectedCycle === 'technique' ? 'bg-[#08783F] text-white' : 'bg-stone-100 text-stone-800'
              }`}
            >
              Simuler
            </button>
          </div>

          {/* Card 2: BTS Affecté & Non Affecté */}
          <div
            onClick={() => {
              setSelectedCycle('bts-affecte');
              setInstallmentsCount(6);
            }}
            className={`bg-white border rounded-sm p-6 flex flex-col justify-between transition-all cursor-pointer ${
              selectedCycle === 'bts-affecte' || selectedCycle === 'bts-non-affecte'
                ? 'border-[#08783F] shadow-md ring-2 ring-[#08783F]'
                : 'border-stone-200 hover:border-stone-300'
            }`}
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#056331] bg-emerald-100 px-2 py-0.5 rounded">
                BTS d'État (12 Filières)
              </span>
              <h3 className="font-serif font-bold text-lg text-[#1F2933] mt-2 mb-1">
                Filières BTS (Bac+2)
              </h3>
              <p className="text-xs text-stone-500 mb-4">
                Agro, Mines, Informatique, BTP, etc.
              </p>

              <div className="p-3 bg-emerald-50/80 rounded border border-emerald-200 mb-3 text-center space-y-1">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Affecté par l'État</span>
                  <span className="text-lg font-bold text-[#08783F] tabular-nums font-mono">
                    85 000 FCFA
                  </span>
                </div>
                <div className="pt-1 border-t border-emerald-200">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Non Affecté</span>
                  <span className="text-sm font-bold text-stone-800 tabular-nums font-mono">
                    200 000 FCFA
                  </span>
                </div>
              </div>
            </div>

            <button
              className={`w-full py-2 text-xs font-semibold rounded-sm transition-colors cursor-pointer ${
                selectedCycle === 'bts-affecte' || selectedCycle === 'bts-non-affecte' ? 'bg-[#08783F] text-white' : 'bg-stone-100 text-stone-800'
              }`}
            >
              Simuler BTS
            </button>
          </div>

          {/* Card 3: Licence Pro */}
          <div
            onClick={() => {
              setSelectedCycle('licence');
              setInstallmentsCount(6);
            }}
            className={`bg-white border rounded-sm p-6 flex flex-col justify-between transition-all cursor-pointer ${
              selectedCycle === 'licence'
                ? 'border-[#08783F] shadow-md ring-2 ring-[#08783F]'
                : 'border-stone-200 hover:border-stone-300'
            }`}
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                Licence Pro (Bac+3)
              </span>
              <h3 className="font-serif font-bold text-lg text-[#1F2933] mt-2 mb-1">
                Licence Professionnelle
              </h3>
              <p className="text-xs text-stone-500 mb-4">
                8 Spécialisations de Management & IT
              </p>

              <div className="p-3 bg-blue-50/80 rounded border border-blue-200 mb-3 text-center">
                <span className="text-[10px] uppercase font-bold text-stone-500 block">Frais Annuel</span>
                <span className="text-xl font-bold text-blue-900 tabular-nums font-mono">
                  450 000 FCFA
                </span>
                <span className="text-[11px] text-stone-600 block mt-0.5">Par an (Échelonné)</span>
              </div>
            </div>

            <button
              className={`w-full py-2 text-xs font-semibold rounded-sm transition-colors cursor-pointer ${
                selectedCycle === 'licence' ? 'bg-[#08783F] text-white' : 'bg-stone-100 text-stone-800'
              }`}
            >
              Simuler Licence
            </button>
          </div>

          {/* Card 4: Master Pro */}
          <div
            onClick={() => {
              setSelectedCycle('master');
              setInstallmentsCount(8);
            }}
            className={`bg-white border rounded-sm p-6 flex flex-col justify-between transition-all cursor-pointer ${
              selectedCycle === 'master'
                ? 'border-[#08783F] shadow-md ring-2 ring-[#08783F]'
                : 'border-stone-200 hover:border-stone-300'
            }`}
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                Master Pro (Bac+5)
              </span>
              <h3 className="font-serif font-bold text-lg text-[#1F2933] mt-2 mb-1">
                Master Professionnel
              </h3>
              <p className="text-xs text-stone-500 mb-4">
                Audit, Projets, Génie Logiciel, Marketing
              </p>

              <div className="p-3 bg-purple-50/80 rounded border border-purple-200 mb-3 text-center">
                <span className="text-[10px] uppercase font-bold text-stone-500 block">Frais Annuel</span>
                <span className="text-xl font-bold text-purple-900 tabular-nums font-mono">
                  800 000 FCFA
                </span>
                <span className="text-[11px] text-stone-600 block mt-0.5">Par an (Cours du Soir)</span>
              </div>
            </div>

            <button
              className={`w-full py-2 text-xs font-semibold rounded-sm transition-colors cursor-pointer ${
                selectedCycle === 'master' ? 'bg-[#08783F] text-white' : 'bg-stone-100 text-stone-800'
              }`}
            >
              Simuler Master
            </button>
          </div>
        </div>

        {/* Interactive Payment Estimator */}
        <div className="bg-white border border-stone-200 p-6 sm:p-10 rounded-sm shadow-sm">
          <div className="flex flex-col lg:flex-row gap-10 items-start justify-between">
            {/* Left Controller */}
            <div className="w-full lg:w-1/2 space-y-6">
              <div className="flex items-center gap-2 text-xs font-bold text-[#08783F] uppercase tracking-wider">
                <Calculator className="w-4 h-4" />
                <span>Simulateur d'Échéancier Personnalisé</span>
              </div>

              <div>
                <h3 className="text-xl font-serif font-bold text-[#1F2933]">
                  {currentData.title}
                </h3>
                <p className="text-xs text-[#667085] mt-1">
                  {currentData.desc}
                </p>
              </div>

              {/* Installments Slider */}
              <div className="space-y-3 pt-4 border-t border-stone-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#1F2933]">
                    Nombre d'échéances souhaitées :
                  </span>
                  <span className="font-bold text-[#08783F] font-mono text-sm">
                    {installmentsCount} versements
                  </span>
                </div>

                <input
                  type="range"
                  min="2"
                  max="10"
                  step="1"
                  value={installmentsCount}
                  onChange={(e) => setInstallmentsCount(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#08783F]"
                />

                <div className="flex justify-between text-[11px] text-stone-600">
                  <span>2 versements</span>
                  <span>10 versements</span>
                </div>
              </div>

              <div className="text-xs text-[#667085] space-y-2 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#08783F] shrink-0" />
                  <span>Aucun frais de dossier caché ni pénalité de fractionnement.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#08783F] shrink-0" />
                  <span>Possibilité de règlement par Mobile Money (Wave, Orange, MTN, Moov).</span>
                </div>
              </div>
            </div>

            {/* Right Summary Display */}
            <div className="w-full lg:w-1/2 bg-[#056331] text-white p-6 sm:p-8 rounded-sm space-y-6">
              <span className="text-xs font-bold text-[#F5B51B] uppercase tracking-wider block">
                Estimation Mensuelle
              </span>

              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-serif font-bold text-white tabular-nums font-mono">
                  {monthlyInstallment.toLocaleString()} FCFA
                </div>
                <div className="text-xs text-white/80">
                  Par versement (sur {installmentsCount} tranches)
                </div>
              </div>

              <div className="pt-4 border-t border-white/20 space-y-2 text-xs text-white/90">
                <div className="flex justify-between">
                  <span>Montant de référence :</span>
                  <span className="font-bold font-mono text-[#F5B51B]">
                    {currentData.frais.toLocaleString()} FCFA
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Régime :</span>
                  <span>{currentData.label}</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="#admissions"
                  className="block w-full py-3 bg-[#F5B51B] hover:bg-[#FFC83D] text-[#1F2933] font-bold text-xs uppercase tracking-wider text-center rounded-sm transition-colors"
                >
                  Entamer ma Pré-inscription en Ligne
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
