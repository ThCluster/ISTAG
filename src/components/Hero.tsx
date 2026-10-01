import React from 'react';
import { ArrowRight, BookOpen, CheckCircle2, ShieldCheck, MapPin, Sparkles, PhoneCall } from 'lucide-react';
import { INSTITUTION } from '../data/institutionData';
import { Logo } from './Logo';

interface HeroProps {
  onOpenPreRegistration: () => void;
  onExplorePrograms: () => void;
  onOpenFlyer?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenPreRegistration, onExplorePrograms, onOpenFlyer }) => {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 bg-[#08783F] text-white overflow-hidden">
      {/* Background Photography with Measured Contrast Scrim - Utilise l'image de couverture PNG des étudiants ISTAG */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/istag_hero_cover.png"
          alt="Étudiants de l'ISTAG Gagnoa - Promotion officielle"
          className="w-full h-full object-cover object-top scale-102 transform motion-safe:transition-transform motion-safe:duration-10000"
          referrerPolicy="no-referrer"
        />
        {/* Gradients ensuring WCAG contrast using ISTAG signature greens */}
        <div className="absolute inset-0 bg-[#056331]/82 sm:bg-[#056331]/76" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#056331] via-[#08783F]/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#056331] via-[#056331]/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10 sm:py-12">
        <div className="max-w-3xl">
          {/* Logo badge and editorial kicker */}
          <div className="flex items-center gap-3 mb-4 sm:mb-5">
            <Logo size="md" />
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#F5B51B] font-medium tracking-wide">
              <span className="uppercase font-bold tracking-wider">ISTAG : INNOVATION — EXCELLENCE — OPPORTUNITÉ</span>
              <span aria-hidden="true" className="text-white/60">·</span>
              <span className="text-white/90">Gagnoa Garahio (Ex-Collège Les Alliances)</span>
            </div>
          </div>

          {/* Primary Main Headline */}
          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.12] mb-4 sm:mb-6 text-balance">
            L’Excellence Technologique, Managériale et Agricole à Gagnoa.
          </h1>

          {/* Subtitle / Value Proposition with flyer fees & offerings */}
          <p className="text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed font-normal mb-6 sm:mb-8 max-w-2xl">
            L'<strong className="text-white font-semibold">Institut Supérieur des Technologies Avancées (ISTAG)</strong> forme l'élite ivoirienne en <span className="text-[#F5B51B] font-semibold">Enseignement Technique (Affecté : 35 000 F)</span>, en <span className="text-white font-semibold">BTS d'État (Affecté : 85 000 F | Non Affecté : 200 000 F)</span> et en <span className="text-[#F5B51B] font-semibold">Licences & Masters (450 000 F & 800 000 F/an)</span>.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
            <button
              onClick={onOpenPreRegistration}
              className="px-6 py-3.5 bg-[#F5B51B] hover:bg-[#FFC83D] active:bg-[#e0a210] text-[#1F2933] font-bold text-xs sm:text-sm rounded-sm transition-all duration-200 shadow-lg flex items-center justify-center gap-2 cursor-pointer group whitespace-nowrap"
            >
              <span>Démarrer ma Pré-inscription</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {onOpenFlyer && (
              <button
                onClick={onOpenFlyer}
                className="px-6 py-3.5 bg-white/15 hover:bg-white/25 text-white border border-white/35 font-semibold text-xs sm:text-sm rounded-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer backdrop-blur-sm whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 text-[#F5B51B]" />
                <span>Voir le Flyer Officiel</span>
              </button>
            )}

            <button
              onClick={onExplorePrograms}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/25 font-medium text-xs sm:text-sm rounded-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer backdrop-blur-sm whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4 text-[#F5B51B]" />
              <span>Consulter nos 12 Filières BTS</span>
            </button>
          </div>

          {/* Unboxed trust markers with contacts from flyer */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-3 sm:gap-x-4 text-xs text-white/90 pt-5 sm:pt-6 border-t border-white/20">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#F5B51B]" />
              <span>Agrément officiel MESRS</span>
            </div>
            <span aria-hidden="true" className="text-white/40">·</span>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#F5B51B]" />
              <span>Gagnoa Garahio, Ex-Collège Les Alliances</span>
            </div>
            <span aria-hidden="true" className="text-white/40">·</span>
            <div className="flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-[#F5B51B]" />
              <span>07 07 48 60 50 / 01 42 89 18 84 / 05 64 21 43 73</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quantitative Stats Bar pinned cleanly inside the hero flow */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#056331] border-t border-[#08783F] py-4 sm:py-5 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 gap-6 lg:gap-8">
            {INSTITUTION.stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col border-l border-white/15 pl-4 sm:pl-5 first:border-l-0">
                <span className="text-2xl lg:text-3xl font-bold font-serif text-[#F5B51B] tabular-nums">
                  {stat.value}
                </span>
                <span className="text-xs text-white/80 mt-1 line-clamp-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
