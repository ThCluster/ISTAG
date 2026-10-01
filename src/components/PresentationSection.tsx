import React from 'react';
import { INSTITUTION } from '../data/institutionData';
import { Target, Award, Users, Briefcase, ShieldCheck, CheckCircle2, MapPin } from 'lucide-react';
import { Logo } from './Logo';

export const PresentationSection: React.FC = () => {
  return (
    <section id="presentation" className="py-16 sm:py-20 bg-[#F8FAF9] text-[#1F2933]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-14">
          <div className="text-xs uppercase tracking-widest text-[#08783F] font-bold mb-3">
            01. Institution & Identité
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#1F2933] tracking-tight mb-4 text-balance">
            Une grande école ivoirienne d'enseignement supérieur bâtie sur l'exigence et le pragmatisme.
          </h2>
          <p className="text-[#667085] text-xs sm:text-sm md:text-base leading-relaxed">
            Agréé par le <strong className="text-[#08783F]">Ministère de l'Enseignement Supérieur et de la Recherche Scientifique (MESRS)</strong>, l'<strong className="text-[#1F2933]">Institut Supérieur des Technologies Avancées (ISTAG)</strong> forme à Gagnoa des techniciens supérieurs et cadres opérationnels hautement qualifiés dans les secteurs minier, agricole tropical, des technologies numériques et du management d'entreprise.
          </p>
        </div>

        {/* Official Identity & Accreditation Box */}
        <div className="bg-white border border-stone-200 p-6 sm:p-8 md:p-10 rounded-sm shadow-sm relative overflow-hidden mb-12">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#08783F]" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <Logo size="lg" />
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#1F2933]">
                    {INSTITUTION.name} ({INSTITUTION.shortName})
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#08783F] font-semibold mt-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#08783F]" />
                      Agrément officiel MESRS
                    </span>
                    <span aria-hidden="true" className="text-stone-300">·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#08783F]" />
                      Gagnoa, Quartier Garahio (Ex-Collège Les Alliances)
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                Fondé par des universitaires et des cadres dirigeants du secteur productif ivoirien, l'ISTAG prépare aux diplômes d'État du Brevet de Technicien Supérieur (BTS) et aux certifications professionnelles. L'institut privilégie l'apprentissage par la pratique, l'expérimentation concrète et la maîtrise rigoureuse des standards professionnels attendus par les entreprises.
              </p>

              <div className="pt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-stone-600 border-t border-stone-100">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#08783F]" />
                  <span>Devise : <strong>{INSTITUTION.motto}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#08783F]" />
                  <span>Statut : <strong>{INSTITUTION.legalStatus}</strong></span>
                </div>
              </div>
            </div>

            {/* Key Statistics Grid */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-3.5 bg-stone-50 p-5 rounded-sm border border-stone-200">
              {INSTITUTION.stats.map((stat, idx) => (
                <div key={idx} className="p-3 bg-white border border-stone-200 rounded-sm">
                  <div className="text-xl sm:text-2xl font-serif font-bold text-[#08783F]">
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-[#667085] mt-1 leading-snug">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Pillars of Pedagogical Success */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          <div className="p-5 bg-white border border-stone-200 rounded-sm shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-sm bg-[#08783F] text-[#F5B51B] flex items-center justify-center mb-3">
              <Briefcase className="w-5 h-5" />
            </div>
            <h4 className="text-base font-serif font-bold text-[#1F2933]">
              Immersion Professionnelle
            </h4>
            <p className="text-xs text-[#667085] leading-relaxed">
              Stages garantis, visites régulières d'entreprises, de chantiers miniers et d'exploitations agricoles du Gôh.
            </p>
          </div>

          <div className="p-5 bg-white border border-stone-200 rounded-sm shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-sm bg-[#08783F] text-[#F5B51B] flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-base font-serif font-bold text-[#1F2933]">
              Enseignants Praticiens
            </h4>
            <p className="text-xs text-[#667085] leading-relaxed">
              Corps professoral d'exception composé d'ingénieurs, d'experts du secteur privé et d'universitaires chevronnés.
            </p>
          </div>

          <div className="p-5 bg-white border border-stone-200 rounded-sm shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-sm bg-[#08783F] text-[#F5B51B] flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-base font-serif font-bold text-[#1F2933]">
              Diplômes d'État Homologués
            </h4>
            <p className="text-xs text-[#667085] leading-relaxed">
              Préparation intensive au Brevet de Technicien Supérieur (BTS) avec un taux de réussite exemplaire aux examens d'État.
            </p>
          </div>

          <div className="p-5 bg-white border border-stone-200 rounded-sm shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-sm bg-[#08783F] text-[#F5B51B] flex items-center justify-center mb-3">
              <Target className="w-5 h-5" />
            </div>
            <h4 className="text-base font-serif font-bold text-[#1F2933]">
              Flexibilité des Horaires
            </h4>
            <p className="text-xs text-[#667085] leading-relaxed">
              Cursus complets en Cours du Jour pour les bacheliers et Cours du Soir pour les professionnels en activité.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
