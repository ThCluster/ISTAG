import React, { useState, useMemo } from 'react';
import { Search, ArrowRight, BookOpen, GraduationCap, Sparkles, MapPin, Pickaxe, Sprout } from 'lucide-react';
import { PROGRAMS, Program, DEGREE_LEVELS } from '../data/programsData';

interface ProgramsSectionProps {
  onSelectProgramForRegistration: (program: Program) => void;
  onViewProgramDetails: (program: Program) => void;
}

export const ProgramsSection: React.FC<ProgramsSectionProps> = ({
  onSelectProgramForRegistration,
  onViewProgramDetails,
}) => {
  const [selectedDegree, setSelectedDegree] = useState<string>('Tous');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['Tous', 'Tertiaire & Gestion', 'Technologies & Digital', 'Agro-Industrie & Mines', 'Bâtiment & Tourisme', 'Cycle Supérieur'];

  const filteredPrograms = useMemo(() => {
    return PROGRAMS.filter((p) => {
      const matchesDegree =
        selectedDegree === 'Tous' ? true : p.degreeLevel === selectedDegree;

      const matchesCategory =
        selectedCategory === 'Tous' ? true : p.category === selectedCategory;

      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesDegree && matchesCategory;

      const matchesSearch =
        p.title.toLowerCase().includes(query) ||
        (p.code && p.code.toLowerCase().includes(query)) ||
        p.description.toLowerCase().includes(query) ||
        p.campuses.some((c) => c.toLowerCase().includes(query)) ||
        p.careerOutcomes.some((c) => c.toLowerCase().includes(query));

      return matchesDegree && matchesCategory && matchesSearch;
    });
  }, [selectedDegree, selectedCategory, searchQuery]);

  return (
    <section id="formations" className="py-16 sm:py-20 bg-[#F8FAF9] text-[#1F2933] border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-widest text-[#08783F] font-bold mb-3">
              02. Offre Académique & Diplômes d'État
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#1F2933] tracking-tight mb-4">
              Des formations d'élite calibrées pour l'insertion professionnelle.
            </h2>
            <p className="text-[#667085] text-xs sm:text-sm md:text-base leading-relaxed">
              Explorez nos {PROGRAMS.length} filières structurées en 3 cycles d'excellence : le Brevet de Technicien Supérieur (BTS Bac+2), la Licence Professionnelle (Bac+3) et le Master Professionnel (Bac+5), complétées par les pôles Mines et Agriculture Tropicale.
            </p>
          </div>

          {/* Search Input */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher une filière, Mines, Agro..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#08783F] focus:ring-1 focus:ring-[#08783F] transition-colors"
            />
          </div>
        </div>

        {/* Dual Filter Controls for High-Precision Navigation */}
        <div className="space-y-3 mb-8 sm:mb-10">
          {/* Degree Level Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-stone-200/60 rounded-md w-fit max-w-full">
            {DEGREE_LEVELS.map((level) => {
              const isActive = selectedDegree === level;
              return (
                <button
                  key={level}
                  onClick={() => setSelectedDegree(level)}
                  className={`px-3.5 sm:px-4 py-2 text-xs font-semibold rounded-sm transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#08783F] text-white shadow-sm'
                      : 'text-[#667085] hover:text-[#1F2933] hover:bg-stone-200'
                  }`}
                >
                  {level === 'Tous' ? `Tous les Cycles (${PROGRAMS.length})` : level}
                </button>
              );
            })}
          </div>

          {/* Category Quick Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-stone-500 font-semibold mr-1">Domaine :</span>
            {categories.map((cat) => {
              const isCatActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    isCatActive
                      ? 'bg-[#056331] text-white border-[#056331] font-semibold shadow-xs'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {cat === 'Agro-Industrie & Mines' ? '🌱 Agro-Industrie & Mines (Gagnoa)' : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Programs Grid */}
        {filteredPrograms.length === 0 ? (
          <div className="p-12 text-center bg-white border border-stone-200 rounded-sm">
            <p className="text-[#667085] text-sm">
              Aucune filière ne correspond à vos critères de recherche.
            </p>
            <button
              onClick={() => {
                setSelectedDegree('Tous');
                setSelectedCategory('Tous');
                setSearchQuery('');
              }}
              className="mt-4 text-xs font-semibold text-[#08783F] underline cursor-pointer"
            >
              Réinitialiser tous les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((prog) => {
              const isAgroOrMines = prog.id === 'bts-mgp' || prog.id === 'bts-atpv' || prog.id === 'bts-atpa';
              return (
                <div
                  key={prog.id}
                  className={`bg-white border rounded-sm p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-md group relative ${
                    isAgroOrMines ? 'border-emerald-300 ring-1 ring-emerald-200/50' : 'border-stone-200 hover:border-[#08783F]'
                  }`}
                >
                  <div>
                    {/* Unboxed Metadata Strip */}
                    <div className="flex items-center justify-between gap-2 text-xs text-[#667085] font-medium mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[#08783F] font-bold">{prog.degreeLevel}</span>
                        <span aria-hidden="true">·</span>
                        {prog.code && (
                          <>
                            <span className="font-semibold text-[#1F2933]">{prog.code}</span>
                            <span aria-hidden="true">·</span>
                          </>
                        )}
                        <span>{prog.duration}</span>
                      </div>
                      {isAgroOrMines && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-[#056331] rounded">
                          Gagnoa
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-serif font-bold text-[#1F2933] group-hover:text-[#08783F] transition-colors mb-2.5 line-clamp-2">
                      {prog.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-[#667085] leading-relaxed mb-4 line-clamp-3">
                      {prog.description}
                    </p>

                    {/* Campuses badge indicator */}
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mb-3 bg-stone-50 p-2 rounded border border-stone-100">
                      <MapPin className="w-3 h-3 text-[#08783F] shrink-0" />
                      <span className="truncate">
                        {prog.campuses.map(c => c.split('(')[0].trim()).join(' · ')}
                      </span>
                    </div>

                    {/* Key Highlights / Competence */}
                    <div className="pt-3 border-t border-stone-100 mb-4">
                      <span className="text-[11px] uppercase tracking-wider text-[#667085] font-semibold block mb-1.5">
                        Débouchés clés :
                      </span>
                      <div className="text-xs text-[#1F2933] space-y-1">
                        {prog.careerOutcomes.slice(0, 2).map((c, i) => (
                          <div key={i} className="flex items-center gap-1.5 truncate">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F5B51B] shrink-0" />
                            <span className="truncate">{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2 mt-2">
                    <button
                      onClick={() => onViewProgramDetails(prog)}
                      className="text-xs font-semibold text-[#08783F] hover:text-[#056331] transition-colors flex items-center gap-1 cursor-pointer py-1"
                    >
                      <span>Détails cursus</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#08783F]" />
                    </button>

                    <button
                      onClick={() => onSelectProgramForRegistration(prog)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#08783F] hover:bg-[#056331] rounded-sm transition-colors cursor-pointer whitespace-nowrap shadow-xs"
                    >
                      S'inscrire
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Program Summary Guide Banner */}
        <div className="mt-14 sm:mt-16 bg-[#08783F] text-white p-6 sm:p-8 rounded-sm shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs uppercase tracking-wider text-[#F5B51B] font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Accompagnement à l'Orientation ISTAG</span>
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
              Vous hésitez sur le choix de votre filière ou de votre campus ?
            </h3>
            <p className="text-xs sm:text-sm text-white/90">
              Nos conseillers d'orientation vous reçoivent sur notre campus de Gagnoa Garahio (au sein de l'Ex-Collège Les Alliances) pour un bilan personnalisé gratuit de votre projet d'études.
            </p>
          </div>

          <div className="shrink-0 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#contact"
              className="px-5 py-2.5 text-xs font-semibold text-white border border-white/30 hover:bg-white/10 rounded-sm transition-colors whitespace-nowrap"
            >
              Prendre rendez-vous
            </a>
            <button
              onClick={() => onSelectProgramForRegistration(PROGRAMS[0])}
              className="px-5 py-2.5 bg-[#F5B51B] hover:bg-[#FFC83D] text-[#1F2933] font-bold text-xs rounded-sm transition-all whitespace-nowrap cursor-pointer shadow-sm"
            >
              Candidater maintenant
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
