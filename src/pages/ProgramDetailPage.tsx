import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Building2, BookOpen, GraduationCap, ShieldCheck, Printer, MapPin, Share2 } from 'lucide-react';
import { Program, PROGRAMS } from '../data/programsData';
import { CAMPUSES, INSTITUTION, TUITION_SCHEDULE } from '../data/institutionData';
import { Logo } from '../components/Logo';

interface ProgramDetailPageProps {
  program: Program;
  onBackToHome: () => void;
  onSelectProgramForRegistration: (prog: Program) => void;
  onSelectOtherProgram: (prog: Program) => void;
}

export const ProgramDetailPage: React.FC<ProgramDetailPageProps> = ({
  program,
  onBackToHome,
  onSelectProgramForRegistration,
  onSelectOtherProgram,
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [program]);

  // Find related programs in the same degree level
  const relatedPrograms = PROGRAMS.filter(
    (p) => p.degreeLevel === program.degreeLevel && p.id !== program.id
  ).slice(0, 3);

  const getTuitionInfo = () => {
    if (program.degreeLevel === 'Technique & Pro') return TUITION_SCHEDULE.technique;
    if (program.degreeLevel === 'BTS') return TUITION_SCHEDULE.bts;
    if (program.degreeLevel === 'Licence Pro') return TUITION_SCHEDULE.licence;
    return TUITION_SCHEDULE.master;
  };

  const tuition = getTuitionInfo();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#1F2933] flex flex-col justify-between">
      {/* Top Header with ISTAG Deep Green */}
      <header className="sticky top-0 z-40 bg-[#08783F] text-white border-b border-[#056331] shadow-md py-3.5 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Back link */}
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white/90 hover:text-[#F5B51B] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-[#F5B51B] group-hover:-translate-x-1 transition-transform" />
            <span>Retour à l'accueil de l'ISTAG</span>
          </button>

          {/* Official Logo Brand */}
          <div className="flex items-center gap-2">
            <Logo size="sm" showText={true} lightText={true} />
          </div>

          {/* Action button: Jaune/or avec texte foncé */}
          <button
            onClick={() => onSelectProgramForRegistration(program)}
            className="px-4 py-2 bg-[#F5B51B] hover:bg-[#FFC83D] active:bg-[#e0a210] text-[#1F2933] font-bold text-xs rounded-sm transition-all shadow-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span>S'inscrire à cette filière</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="grow py-10 sm:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-xs text-[#667085] no-print">
            <button
              onClick={onBackToHome}
              className="hover:text-[#08783F] transition-colors cursor-pointer underline"
            >
              Accueil
            </button>
            <span aria-hidden="true">/</span>
            <button
              onClick={onBackToHome}
              className="hover:text-[#08783F] transition-colors cursor-pointer"
            >
              Formations
            </button>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-[#1F2933]">{program.degreeLevel}</span>
            <span aria-hidden="true">/</span>
            <span className="text-[#08783F] font-medium truncate max-w-xs">{program.title}</span>
          </nav>

          {/* Program Hero Header Banner */}
          <div className="bg-[#08783F] text-white p-8 sm:p-12 rounded-sm shadow-md mb-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#056331]/40 rounded-full blur-3xl pointer-events-none" />

            {/* Unboxed Metadata Strip */}
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-[#F5B51B] font-bold mb-4">
              <span>{program.degreeLevel}</span>
              {program.code && (
                <>
                  <span aria-hidden="true" className="text-white/60">·</span>
                  <span>Sigle d'État : {program.code}</span>
                </>
              )}
              <span aria-hidden="true" className="text-white/60">·</span>
              <span>{program.duration}</span>
              <span aria-hidden="true" className="text-white/60">·</span>
              <span>Yopougon SIDECI & Vridi</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight mb-5 leading-tight">
              {program.title} {program.code ? `(${program.code})` : ''}
            </h1>

            <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-3xl mb-8">
              {program.description}
            </p>

            {/* Header Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 no-print">
              <button
                onClick={() => onSelectProgramForRegistration(program)}
                className="px-6 py-3.5 bg-[#F5B51B] hover:bg-[#FFC83D] active:bg-[#e0a210] text-[#1F2933] font-bold text-xs sm:text-sm rounded-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <span>Démarrer ma Pré-inscription en {program.code || program.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handlePrint}
                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/25 font-medium text-xs sm:text-sm rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer backdrop-blur-sm whitespace-nowrap"
              >
                <Printer className="w-4 h-4 text-[#F5B51B]" />
                <span>Imprimer la Fiche de Formation</span>
              </button>
            </div>
          </div>

          {/* Quick Specifications Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white border border-stone-200 rounded-sm mb-12 shadow-sm text-xs">
            <div className="space-y-1">
              <span className="text-[#667085] block uppercase tracking-wider text-[10px] font-bold">
                Diplôme Délivré
              </span>
              <div className="flex items-center gap-1.5 font-bold text-[#1F2933]">
                <GraduationCap className="w-4 h-4 text-[#08783F]" />
                <span>{program.degreeLevel}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[#667085] block uppercase tracking-wider text-[10px] font-bold">
                Durée du Cycle
              </span>
              <div className="flex items-center gap-1.5 font-bold text-[#1F2933]">
                <Clock className="w-4 h-4 text-[#08783F]" />
                <span>{program.duration}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[#667085] block uppercase tracking-wider text-[10px] font-bold">
                Campus Ouverts
              </span>
              <div className="flex items-center gap-1.5 font-bold text-[#1F2933]">
                <Building2 className="w-4 h-4 text-[#08783F]" />
                <span>Gagnoa Garahio</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[#667085] block uppercase tracking-wider text-[10px] font-bold">
                Régimes Proposés
              </span>
              <div className="flex items-center gap-1.5 font-bold text-[#1F2933]">
                <BookOpen className="w-4 h-4 text-[#08783F]" />
                <span>Jour & Soir</span>
              </div>
            </div>
          </div>

          {/* Deep-Dive Content Sections */}
          <div className="space-y-10">
            {/* Section 1: Conditions d'admission */}
            <div className="bg-white border border-stone-200 p-8 rounded-sm shadow-sm">
              <h2 className="text-lg font-serif font-bold text-[#1F2933] mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#08783F]" />
                <span>Conditions d'admission & Profil requis</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#667085] leading-relaxed mb-4">
                {program.targetAudience}
              </p>
              <div className="p-4 bg-stone-50 border-l-2 border-[#08783F] rounded-r-sm text-xs text-[#667085]">
                <strong className="text-[#1F2933] block mb-1">Dépôt de candidature :</strong>
                Les admissions s'effectuent sur étude de dossier scolaire et entretien de motivation avec la commission pédagogique de l'ISTAG.
              </div>
            </div>

            {/* Section 2: Débouchés professionnels */}
            <div className="bg-white border border-stone-200 p-8 rounded-sm shadow-sm">
              <h2 className="text-lg font-serif font-bold text-[#1F2933] mb-2 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#08783F]" />
                <span>Débouchés professionnels & Métiers visés</span>
              </h2>
              <p className="text-xs text-[#667085] mb-6">
                Nos lauréats intègrent directement les entreprises ivoiriennes, multinationales et administrations publiques :
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {program.careerOutcomes.map((career, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-stone-50 border border-stone-200 rounded-sm flex items-start gap-2.5 text-xs text-[#1F2933] font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#08783F] shrink-0 mt-0.5" />
                    <span>{career}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Programme d'enseignement & Modules */}
            <div className="bg-white border border-stone-200 p-8 rounded-sm shadow-sm">
              <h2 className="text-lg font-serif font-bold text-[#1F2933] mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#08783F]" />
                <span>Programme d'enseignement & Modules fondamentaux</span>
              </h2>
              <p className="text-xs text-[#667085] mb-6">
                Cursus équilibré entre théorie fondamentale, travaux dirigés, études de cas et projets d'application réels :
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {program.modules.map((mod, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-stone-50 border border-stone-200 rounded-sm"
                  >
                    <span className="text-[10px] text-[#08783F] font-mono font-bold block mb-1">
                      Module {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-[#1F2933]">
                      {mod}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Atout Pédagogique ISTAG */}
            <div className="bg-white border border-stone-200 p-8 rounded-sm shadow-sm">
              <h2 className="text-lg font-serif font-bold text-[#1F2933] mb-3">
                L'Atout Pédagogique de l'ISTAG pour cette filière
              </h2>
              <div className="p-5 bg-[#08783F]/5 border border-[#08783F]/30 rounded-sm text-xs sm:text-sm text-[#1F2933] leading-relaxed mb-6">
                {program.keyHighlight}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-100 text-xs">
                <div>
                  <strong className="text-[#1F2933] block mb-1">Stages en entreprise</strong>
                  <span className="text-[#667085]">Immersion professionnelle garantie auprès de notre réseau de 120+ partenaires.</span>
                </div>
                <div>
                  <strong className="text-[#1F2933] block mb-1">Encadrement de mémoire</strong>
                  <span className="text-[#667085]">Suivi individuel par des enseignants et directeurs de mémoire expérimentés.</span>
                </div>
                <div>
                  <strong className="text-[#1F2933] block mb-1">Examens d'État préparés</strong>
                  <span className="text-[#667085]">Examens blancs réguliers dans les conditions réelles des épreuves officielles.</span>
                </div>
              </div>
            </div>

            {/* Section 5: Frais d'études & Tarification */}
            <div className="bg-white border border-stone-200 p-8 rounded-sm shadow-sm">
              <h2 className="text-lg font-serif font-bold text-[#1F2933] mb-4">
                Frais d'Études & Modalités de Paiement
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-xs">
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-sm">
                  <span className="text-[#667085] block mb-1">Droits d'inscription</span>
                  <span className="text-base font-bold text-[#1F2933] font-mono tabular-nums">
                    {tuition.inscription}
                  </span>
                </div>
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-sm">
                  <span className="text-[#667085] block mb-1">Scolarité annuelle</span>
                  <span className="text-base font-bold text-[#08783F] font-mono tabular-nums">
                    {tuition.scolariteAnnuelle}
                  </span>
                </div>
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-sm">
                  <span className="text-[#667085] block mb-1">Échelonnement</span>
                  <span className="text-xs font-semibold text-[#1F2933]">
                    {tuition.modalites}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-[#667085]">
                {tuition.comprend}
              </p>
            </div>

            {/* Bottom Call to Action Box */}
            <div className="bg-[#08783F] text-white p-8 sm:p-10 rounded-sm shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
              <div className="max-w-xl space-y-2">
                <span className="text-xs uppercase tracking-widest text-[#F5B51B] font-bold">
                  Candidature Session 2026–2027
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  Prêt(e) à intégrer la filière {program.title} ?
                </h3>
                <p className="text-xs sm:text-sm text-white/90">
                  Remplissez votre dossier en ligne dès maintenant pour sécuriser votre place et obtenir votre récépissé officiel ISTAG.
                </p>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => onSelectProgramForRegistration(program)}
                  className="px-6 py-3.5 bg-[#F5B51B] hover:bg-[#FFC83D] active:bg-[#e0a210] text-[#1F2933] font-bold text-xs rounded-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <span>Démarrer ma Pré-inscription</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onBackToHome}
                  className="px-4 py-3.5 text-white border border-white/30 hover:bg-white/10 font-medium text-xs rounded-sm transition-colors text-center cursor-pointer whitespace-nowrap"
                >
                  Retour Accueil
                </button>
              </div>
            </div>

            {/* Related Programs Strip */}
            {relatedPrograms.length > 0 && (
              <div className="pt-8 border-t border-stone-200 no-print">
                <h3 className="text-base font-serif font-bold text-[#1F2933] mb-4">
                  Autres filières dans le cycle {program.degreeLevel}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedPrograms.map((rel) => (
                    <button
                      key={rel.id}
                      onClick={() => onSelectOtherProgram(rel)}
                      className="p-4 bg-white border border-stone-200 hover:border-[#08783F] rounded-sm text-left transition-all group cursor-pointer shadow-2xs"
                    >
                      <span className="text-[10px] text-[#08783F] font-bold uppercase block mb-1">
                        {rel.degreeLevel} {rel.code ? `· ${rel.code}` : ''}
                      </span>
                      <h4 className="text-xs font-bold text-[#1F2933] group-hover:text-[#08783F] transition-colors line-clamp-2">
                        {rel.title}
                      </h4>
                      <span className="text-[11px] text-[#667085] mt-2 inline-flex items-center gap-1 group-hover:text-[#08783F]">
                        Voir cursus →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Standalone Quiet Footer */}
      <footer className="bg-[#056331] text-white/80 text-xs py-8 border-t border-[#08783F] no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-brand font-bold text-white text-base tracking-wide">ISTAG</span>
            <span aria-hidden="true" className="text-white/40">·</span>
            <span>{program.title} ({program.degreeLevel})</span>
          </div>

          <button
            onClick={onBackToHome}
            className="text-xs text-[#F5B51B] hover:text-[#FFC83D] cursor-pointer"
          >
            ← Revenir à la page d'accueil principale
          </button>
        </div>
      </footer>
    </div>
  );
};
