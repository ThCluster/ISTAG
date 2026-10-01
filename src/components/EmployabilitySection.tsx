import React from 'react';
import { Briefcase, Building, GraduationCap, Award, Compass, TrendingUp, Handshake } from 'lucide-react';

export const EmployabilitySection: React.FC = () => {
  return (
    <section id="employabilite" className="py-20 bg-[#F8FAF9] text-[#1F2933] border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="text-xs uppercase tracking-widest text-[#08783F] font-bold mb-3">
            03. Pédagogie & Insertion Professionnelle
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1F2933] tracking-tight mb-4 text-balance">
            Une formation conçue avec et pour les entreprises.
          </h2>
          <p className="text-[#667085] text-sm sm:text-base leading-relaxed">
            À l'ISTAG, nous rejetons l'enseignement purement abstrait. Notre modèle conjugue la rigueur académique d'État aux pratiques réelles du monde productif. Chaque cours est pensé pour transformer un étudiant en collaborateur compétent, autonome et immédiatement productif.
          </p>
        </div>

        {/* 3 Pillars of Professionalization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white border border-stone-200 hover:border-[#08783F] p-8 rounded-sm shadow-sm transition-all relative">
            <div className="w-12 h-12 rounded-sm bg-[#08783F] text-[#F5B51B] flex items-center justify-center mb-6">
              <Handshake className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#1F2933] mb-3">
              Stages & Immersion Garantie
            </h3>
            <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
              Grâce à nos partenariats avec les entreprises industrielles, minières, coopératives agricoles et sociétés de services, nous accompagnons chaque étudiant dans la recherche et l'obtention de son stage professionnel d'immersion et de fin de cycle.
            </p>
          </div>

          <div className="bg-white border border-stone-200 hover:border-[#08783F] p-8 rounded-sm shadow-sm transition-all relative">
            <div className="w-12 h-12 rounded-sm bg-[#08783F] text-[#F5B51B] flex items-center justify-center mb-6">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#1F2933] mb-3">
              Projets Tutorés & Cas Réels
            </h3>
            <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
              Tout au long de l'année, les étudiants résolvent des problématiques authentiques soumises par des entreprises locales : mise en place d'un système ERP, audit comptable blanc, élaboration de plans de communication 360°, ou réorganisation de stocks d'entrepôt.
            </p>
          </div>

          <div className="bg-white border border-stone-200 hover:border-[#08783F] p-8 rounded-sm shadow-sm transition-all relative">
            <div className="w-12 h-12 rounded-sm bg-[#08783F] text-[#F5B51B] flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#1F2933] mb-3">
              Coaching Carrière & Soft Skills
            </h3>
            <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
              Au-delà de l'expertise technique, nos auditeurs bénéficient d'ateliers de prise de parole en public, de rédaction de CV aux normes internationales, de simulations d'entretiens d'embauche et de maîtrise de l'anglais professionnel des affaires.
            </p>
          </div>
        </div>

        {/* Corporate Ecosystem Strip */}
        <div className="bg-white border border-stone-200 p-8 rounded-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-200">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#08783F] font-bold block mb-1">
                Écosystème Partenaire
              </span>
              <h4 className="text-xl font-serif font-bold text-[#1F2933]">
                Des débouchés concrets dans tous les secteurs clés de l'économie ivoirienne
              </h4>
            </div>
            <span className="text-xs text-[#667085] max-w-xs">
              Secteurs bancaires, télécoms, logistique portuaire, distribution et services numériques.
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 text-center">
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-sm">
              <span className="block text-sm font-bold text-[#1F2933] mb-1 font-serif">Logistique & Portuaire</span>
              <span className="text-[11px] text-[#667085]">Transitaires, armateurs, terminaux à conteneurs de Vridi</span>
            </div>
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-sm">
              <span className="block text-sm font-bold text-[#1F2933] mb-1 font-serif">Banque & Finance</span>
              <span className="text-[11px] text-[#667085]">Établissements bancaires, microfinance, compagnies d'assurances</span>
            </div>
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-sm">
              <span className="block text-sm font-bold text-[#1F2933] mb-1 font-serif">Informatique & Télécoms</span>
              <span className="text-[11px] text-[#667085]">ESN, startups fintech, opérateurs télécoms, éditeurs de logiciels</span>
            </div>
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-sm">
              <span className="block text-sm font-bold text-[#1F2933] mb-1 font-serif">Industrie & Commerce</span>
              <span className="text-[11px] text-[#667085]">Agro-industrie, grande distribution, cabinets de conseil RH</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
