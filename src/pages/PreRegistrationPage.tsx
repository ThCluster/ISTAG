import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Printer, ArrowRight, ShieldCheck, PhoneCall, Building2, User, GraduationCap, FileText, Search, Sparkles, MessageSquare } from 'lucide-react';
import { PROGRAMS, Program } from '../data/programsData';
import { CAMPUSES, INSTITUTION } from '../data/institutionData';
import { Logo } from '../components/Logo';

interface PreRegistrationPageProps {
  initialProgram?: Program | null;
  onBackToHome: () => void;
}

interface RegistrationFormData {
  degreeLevel: string;
  programId: string;
  campusId: string;
  scheduleType: string;
  lastName: string;
  firstNames: string;
  birthDate: string;
  gender: string;
  nationality: string;
  phone: string;
  whatsapp: string;
  email: string;
  residenceCity: string;
  lastDegree: string;
  bacSeries: string;
  lastSchool: string;
  graduationYear: string;
  mention: string;
  hasBirthCert: boolean;
  hasDiplomaCopy: boolean;
  hasIdCard: boolean;
  hasPhotos: boolean;
}

export const PreRegistrationPage: React.FC<PreRegistrationPageProps> = ({
  initialProgram,
  onBackToHome,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [registrationCode, setRegistrationCode] = useState<string>('');
  const [submittedAt, setSubmittedAt] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'new' | 'check'>('new');
  const [trackingInput, setTrackingInput] = useState('');
  const [trackingResult, setTrackingResult] = useState<string | null>(null);

  const [formData, setFormData] = useState<RegistrationFormData>({
    degreeLevel: initialProgram ? initialProgram.degreeLevel : 'BTS',
    programId: initialProgram ? initialProgram.id : 'bts-mgp',
    campusId: 'campus-gagnoa',
    scheduleType: 'Cours du jour',
    lastName: '',
    firstNames: '',
    birthDate: '',
    gender: 'Masculin',
    nationality: 'Ivoirienne',
    phone: '',
    whatsapp: '',
    email: '',
    residenceCity: 'Gagnoa',
    lastDegree: 'Baccalauréat',
    bacSeries: 'Série D',
    lastSchool: '',
    graduationYear: '2026',
    mention: 'Passable',
    hasBirthCert: true,
    hasDiplomaCopy: true,
    hasIdCard: true,
    hasPhotos: true,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [submissionSuccess, currentStep]);

  const availablePrograms = PROGRAMS.filter(
    (p) => p.degreeLevel === formData.degreeLevel
  );

  const selectedProgramObj =
    PROGRAMS.find((p) => p.id === formData.programId) || PROGRAMS[0];

  const selectedCampusObj =
    CAMPUSES.find((c) => c.id === formData.campusId) || CAMPUSES[0];

  const handleLevelChange = (lvl: 'BTS' | 'Licence Pro' | 'Master Pro') => {
    const progsInLevel = PROGRAMS.filter((p) => p.degreeLevel === lvl);
    setFormData({
      ...formData,
      degreeLevel: lvl,
      programId: progsInLevel.length > 0 ? progsInLevel[0].id : '',
    });
  };

  const validateStep = (step: number) => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.programId) newErrors.programId = 'Veuillez sélectionner une filière.';
      if (!formData.campusId) newErrors.campusId = 'Veuillez sélectionner un campus.';
    } else if (step === 2) {
      if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est obligatoire.';
      if (!formData.firstNames.trim()) newErrors.firstNames = 'Les prénoms sont obligatoires.';
      if (!formData.phone.trim()) newErrors.phone = 'Le numéro de téléphone est requis.';
      if (formData.email && !formData.email.includes('@')) {
        newErrors.email = 'Veuillez renseigner un email valide.';
      }
    } else if (step === 3) {
      if (!formData.lastSchool.trim()) newErrors.lastSchool = "L'établissement d'origine est requis.";
      if (!formData.graduationYear.trim()) newErrors.graduationYear = "L'année d'obtention est requise.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 120, behavior: 'smooth' });
      } else {
        // Generate registration dossier code
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const code = `ISTAG-2026-${randomNum}`;
        const dateStr = new Date().toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        setRegistrationCode(code);
        setSubmittedAt(dateStr);
        setSubmissionSuccess(true);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;

    if (trackingInput.toUpperCase().startsWith('ISTAG-')) {
      setTrackingResult(
        `Dossier ${trackingInput.toUpperCase()} : Pré-inscription validée et enregistrée auprès du secrétariat de l'ISTAG. Statut : En attente du dépôt des pièces physiques à la scolarité.`
      );
    } else {
      setTrackingResult(
        `Le format saisi est non reconnu. Les numéros officiels de pré-inscription sont au format ISTAG-2026-XXXX. En cas de doute, appelez le ${INSTITUTION.contact.admissionsPhone}.`
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#1F2933] flex flex-col justify-between">
      {/* Standalone Top Bar with ISTAG primary green */}
      <header className="sticky top-0 z-40 bg-[#08783F] text-white border-b border-[#056331] shadow-md py-3.5 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Back to Home Link */}
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white/90 hover:text-[#F5B51B] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-[#F5B51B] group-hover:-translate-x-1 transition-transform" />
            <span>Retour à l'accueil de l'ISTAG</span>
          </button>

          {/* Logo Branding */}
          <div className="flex items-center gap-2">
            <Logo size="sm" showText={true} lightText={true} />
          </div>

          {/* Assistance hotline */}
          <div className="flex items-center gap-3">
            <a
              href={`tel:${INSTITUTION.contact.admissionsPhone.replace(/\s+/g, '')}`}
              className="hidden md:flex items-center gap-1.5 text-xs text-white/90 hover:text-white"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#F5B51B]" />
              <span className="tabular-nums font-mono font-medium">{INSTITUTION.contact.admissionsPhone}</span>
            </a>
            <span className="text-[11px] uppercase tracking-wider text-[#F5B51B] font-bold border border-[#F5B51B]/40 bg-[#056331] px-2.5 py-1 rounded-sm">
              Session 2026–2027
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="grow py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb and Page Kicker */}
          <div className="mb-8 no-print">
            <div className="flex items-center gap-2 text-xs text-[#667085] mb-2">
              <button
                onClick={onBackToHome}
                className="hover:text-[#08783F] transition-colors cursor-pointer underline"
              >
                Accueil
              </button>
              <span aria-hidden="true">/</span>
              <span className="text-[#08783F] font-semibold">Inscription & Pré-inscription</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#1F2933] tracking-tight">
                  Portail Officiel de Pré-inscription
                </h1>
                <p className="text-[#667085] text-xs sm:text-sm mt-1.5">
                  Formulaire d'admission pour les cycles BTS, Licence Professionnelle et Master Professionnel — ISTAG.
                </p>
              </div>

              {/* Mode switch: New application vs Check existing */}
              {!submissionSuccess && (
                <div className="flex items-center p-1 bg-stone-200/70 rounded-sm text-xs font-semibold shrink-0">
                  <button
                    onClick={() => setActiveTab('new')}
                    className={`px-3.5 py-1.5 rounded-sm transition-all cursor-pointer ${
                      activeTab === 'new'
                        ? 'bg-[#08783F] text-white shadow-sm'
                        : 'text-[#1F2933] hover:text-[#08783F]'
                    }`}
                  >
                    Nouvelle Candidature
                  </button>
                  <button
                    onClick={() => setActiveTab('check')}
                    className={`px-3.5 py-1.5 rounded-sm transition-all cursor-pointer ${
                      activeTab === 'check'
                        ? 'bg-[#08783F] text-white shadow-sm'
                        : 'text-[#1F2933] hover:text-[#08783F]'
                    }`}
                  >
                    Consulter mon Dossier
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* TAB 2: Check Existing Application */}
          {activeTab === 'check' && !submissionSuccess && (
            <div className="bg-white border border-stone-200 rounded-sm p-8 shadow-sm space-y-6 no-print">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#08783F] font-bold">
                <Search className="w-4 h-4 text-[#08783F]" />
                <span>Vérification de Statut de Dossier</span>
              </div>
              <h2 className="text-xl font-serif font-bold text-[#1F2933]">
                Retrouvez les informations de votre pré-inscription
              </h2>
              <p className="text-xs sm:text-sm text-[#667085]">
                Saisissez le numéro de dossier qui vous a été délivré lors de votre enregistrement en ligne (ex: <span className="font-mono font-semibold text-[#08783F]">ISTAG-2026-4821</span>) :
              </p>

              <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Numéro de dossier ISTAG"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  className="grow px-4 py-3 text-sm bg-stone-50 border border-stone-300 rounded-sm focus:outline-none focus:border-[#08783F] focus:ring-1 focus:ring-[#08783F] font-mono uppercase"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#08783F] hover:bg-[#056331] text-white font-bold text-xs rounded-sm transition-colors cursor-pointer"
                >
                  Vérifier le statut
                </button>
              </form>

              {trackingResult && (
                <div className="p-4 bg-stone-50 border border-stone-300 rounded-sm text-xs text-[#1F2933] space-y-2">
                  <span className="font-bold text-[#08783F] block">Résultat de la recherche :</span>
                  <p className="text-[#667085]">{trackingResult}</p>
                </div>
              )}

              <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#667085] gap-3">
                <span>Vous n'avez pas encore rempli de formulaire ?</span>
                <button
                  onClick={() => setActiveTab('new')}
                  className="text-[#08783F] font-bold underline cursor-pointer"
                >
                  Commencer une nouvelle pré-inscription →
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: New Application Form OR Submission Success View */}
          {activeTab === 'new' && (
            <>
              {submissionSuccess ? (
                /* OFFICIAL RECEIPT VIEW */
                <div className="space-y-6">
                  {/* Print / Top Action Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-sm no-print">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-[#08783F] shrink-0" />
                      <div>
                        <h2 className="font-serif font-bold text-sm sm:text-base text-[#056331]">
                          Pré-inscription enregistrée avec succès !
                        </h2>
                        <p className="text-xs text-[#056331]">
                          Votre dossier est désormais archivé sous le numéro{' '}
                          <strong className="font-mono text-[#056331]">{registrationCode}</strong>.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={handlePrint}
                        className="w-full sm:w-auto px-5 py-2.5 bg-[#08783F] hover:bg-[#056331] text-white font-bold text-xs rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      >
                        <Printer className="w-4 h-4 text-[#F5B51B]" />
                        <span>Imprimer le Récépissé</span>
                      </button>
                    </div>
                  </div>

                  {/* The Document Receipt */}
                  <div className="p-8 sm:p-12 border-2 border-[#08783F] bg-white rounded-sm shadow-md text-[#1F2933]">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-[#08783F] pb-6 gap-4">
                      <div className="flex items-center gap-3">
                        <Logo size="lg" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-brand font-bold text-2xl text-[#08783F] leading-tight">
                              ISTAG
                            </h3>
                            <span className="text-xs font-bold text-[#F5B51B] uppercase bg-[#056331] px-1.5 py-0.5 rounded border border-[#F5B51B]/40">
                              GAGNOA
                            </span>
                          </div>
                          <p className="text-xs text-[#056331] font-bold uppercase tracking-wider">
                            Institut Supérieur des Technologies Avancées
                          </p>
                          <p className="text-[11px] text-[#667085]">
                            Établissement d'Enseignement Supérieur Technique et Professionnel · SARL constituée en août 2018 · Agrément MESRS
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-200">
                        <span className="text-xs uppercase tracking-wider text-[#667085] block">
                          Numéro de Dossier Officiel
                        </span>
                        <span className="font-mono text-2xl font-bold text-[#08783F] tracking-wider block">
                          {registrationCode}
                        </span>
                        <span className="text-xs text-[#667085]">
                          Délivré le {submittedAt}
                        </span>
                      </div>
                    </div>

                    {/* Candidate & Curriculum Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 text-xs sm:text-sm">
                      <div className="space-y-2.5 border-r-0 md:border-r border-stone-200 pr-0 md:pr-6">
                        <h4 className="font-bold text-[#08783F] uppercase text-xs tracking-wider border-b border-stone-200 pb-1 mb-3">
                          1. Identité du Candidat
                        </h4>
                        <p>
                          <strong className="text-[#1F2933]">Nom & Prénoms :</strong>{' '}
                          {formData.lastName.toUpperCase()} {formData.firstNames}
                        </p>
                        <p>
                          <strong className="text-[#1F2933]">Date de naissance :</strong>{' '}
                          {formData.birthDate || 'Non spécifiée'} ({formData.gender})
                        </p>
                        <p>
                          <strong className="text-[#1F2933]">Nationalité :</strong>{' '}
                          {formData.nationality}
                        </p>
                        <p>
                          <strong className="text-[#1F2933]">Téléphone d'appel :</strong>{' '}
                          {formData.phone}
                        </p>
                        <p>
                          <strong className="text-[#1F2933]">WhatsApp :</strong>{' '}
                          {formData.whatsapp || formData.phone}
                        </p>
                        <p>
                          <strong className="text-[#1F2933]">Adresse Email :</strong>{' '}
                          {formData.email}
                        </p>
                        <p>
                          <strong className="text-[#1F2933]">Lieu de résidence :</strong>{' '}
                          {formData.residenceCity}
                        </p>
                      </div>

                      <div className="space-y-2.5">
                        <h4 className="font-bold text-[#08783F] uppercase text-xs tracking-wider border-b border-stone-200 pb-1 mb-3">
                          2. Formation Retenue & Campus
                        </h4>
                        <p>
                          <strong className="text-[#1F2933]">Niveau de Diplôme :</strong>{' '}
                          {formData.degreeLevel}
                        </p>
                        <p>
                          <strong className="text-[#1F2933]">Filière spécialisée :</strong>{' '}
                          <span className="font-bold text-[#08783F]">
                            {selectedProgramObj.title} {selectedProgramObj.code ? `(${selectedProgramObj.code})` : ''}
                          </span>
                        </p>
                        <p>
                          <strong className="text-[#1F2933]">Campus choisi :</strong>{' '}
                          {selectedCampusObj.name}
                        </p>
                        <p>
                          <strong className="text-[#1F2933]">Régime horaire :</strong>{' '}
                          {formData.scheduleType}
                        </p>
                        <p>
                          <strong className="text-[#1F2933]">Diplôme antérieur :</strong>{' '}
                          {formData.lastDegree} ({formData.bacSeries}), {formData.graduationYear}
                        </p>
                        <p>
                          <strong className="text-[#1F2933]">Établissement d'origine :</strong>{' '}
                          {formData.lastSchool}
                        </p>
                      </div>
                    </div>

                    {/* Notice for Physical Submission */}
                    <div className="p-5 bg-stone-50 border border-stone-300 rounded-sm text-xs space-y-2">
                      <strong className="text-[#08783F] uppercase tracking-wide block font-serif text-sm">
                        Modalités pour valider définitivement votre admission :
                      </strong>
                      <p className="text-[#667085] leading-relaxed">
                        1. Présentez ce document imprimé au guichet de la scolarité du <strong>{selectedCampusObj.name}</strong> ({selectedCampusObj.district}).
                      </p>
                      <p className="text-[#667085] leading-relaxed">
                        2. Pièces requises à joindre : Extrait d'acte de naissance, 2 copies certifiées du diplôme ou collations du BAC, 4 photos d'identité couleur, copie de la CNI/Passeport.
                      </p>
                      <p className="text-[#667085] leading-relaxed">
                        3. Règlement des frais d'inscription pour l'émission de la carte d'étudiant et l'attribution définitive de votre place.
                      </p>
                    </div>

                    {/* Signatures */}
                    <div className="pt-8 mt-8 border-t border-stone-200 flex justify-between items-end text-xs text-[#667085]">
                      <div>
                        <p className="font-semibold text-[#1F2933]">Cachet & Visa de la Scolarité ISTAG</p>
                        <div className="mt-12 border-b border-stone-400 w-44" />
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#1F2933]">Signature de l'étudiant(e)</p>
                        <div className="mt-12 border-b border-stone-400 w-44 ml-auto" />
                      </div>
                    </div>
                  </div>

                  {/* Return buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200 no-print">
                    <button
                      onClick={() => {
                        setSubmissionSuccess(false);
                        setCurrentStep(1);
                      }}
                      className="text-xs font-semibold text-[#667085] hover:text-[#08783F] cursor-pointer underline"
                    >
                      Effectuer une autre pré-inscription
                    </button>

                    <button
                      onClick={onBackToHome}
                      className="px-6 py-3 bg-[#08783F] hover:bg-[#056331] text-white font-bold text-xs rounded-sm transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-[#F5B51B]" />
                      <span>Retourner au site principal ISTAG</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* MULTI-STEP FORM CARD */
                <div className="bg-white border border-stone-200 rounded-sm shadow-sm overflow-hidden">
                  {/* Step Progress Header with Primary Green */}
                  <div className="bg-[#08783F] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-[#F5B51B] font-bold mb-1">
                        Étape {currentStep} sur 4
                      </div>
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                        {currentStep === 1 && '1. Choix du Diplôme, de la Filière & du Campus'}
                        {currentStep === 2 && '2. Identité & Coordonnées du Candidat'}
                        {currentStep === 3 && '3. Cursus Antérieur & Établissement d\'Origine'}
                        {currentStep === 4 && '4. Checklist des Pièces Justificatives'}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-white/90">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`w-7 h-7 rounded-sm flex items-center justify-center font-bold text-xs ${
                            step === currentStep
                              ? 'bg-[#F5B51B] text-[#1F2933]'
                              : step < currentStep
                              ? 'bg-white/20 text-white'
                              : 'bg-white/10 text-white/50'
                          }`}
                        >
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Form Body */}
                  <div className="p-6 sm:p-8">
                    {/* STEP 1: Academic Choice */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-xs font-bold text-[#1F2933] uppercase tracking-wider mb-2">
                            Cycle d'Enseignement
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            {(['BTS', 'Licence Pro', 'Master Pro'] as const).map((lvl) => (
                              <button
                                key={lvl}
                                type="button"
                                onClick={() => handleLevelChange(lvl)}
                                className={`p-3.5 text-center rounded-sm border text-xs font-semibold transition-all cursor-pointer ${
                                  formData.degreeLevel === lvl
                                    ? 'bg-[#08783F] text-white border-[#08783F] shadow-sm'
                                    : 'bg-white text-[#1F2933] border-stone-300 hover:bg-stone-50'
                                }`}
                              >
                                {lvl}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1F2933] uppercase tracking-wider mb-2">
                            Filière Spécialisée
                          </label>
                          <select
                            value={formData.programId}
                            onChange={(e) =>
                              setFormData({ ...formData, programId: e.target.value })
                            }
                            className="w-full p-3.5 text-xs bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#08783F] focus:ring-1 focus:ring-[#08783F]"
                          >
                            {availablePrograms.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.code ? `[${p.code}] ` : ''}{p.title} — {p.duration}
                              </option>
                            ))}
                          </select>
                          {errors.programId && (
                            <p className="text-red-600 text-xs mt-1">{errors.programId}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1F2933] uppercase tracking-wider mb-2">
                            Campus d'Affectation
                          </label>
                          <div className="grid grid-cols-1 gap-3">
                            {CAMPUSES.map((c) => (
                              <label
                                key={c.id}
                                className={`p-4 border rounded-sm cursor-pointer flex flex-col justify-between transition-all ${
                                  formData.campusId === c.id
                                    ? 'border-[#08783F] bg-[#08783F]/5 ring-1 ring-[#08783F]'
                                    : 'border-stone-300 bg-white hover:bg-stone-50'
                                }`}
                              >
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <input
                                      type="radio"
                                      name="campus"
                                      checked={formData.campusId === c.id}
                                      onChange={() =>
                                        setFormData({ ...formData, campusId: c.id })
                                      }
                                      className="accent-[#08783F]"
                                    />
                                    <strong className="text-xs text-[#1F2933]">{c.name}</strong>
                                  </div>
                                  <p className="text-[11px] text-[#667085] pl-5">{c.address}</p>
                                </div>
                                <span className="mt-2 text-[10px] font-bold text-[#056331] bg-emerald-100 px-2 py-0.5 rounded self-start">
                                  Site Principal — Garahio (Ex-Collège Les Alliances)
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1F2933] uppercase tracking-wider mb-2">
                            Régime Horaire
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {['Cours du jour', 'Cours du soir'].map((sch) => (
                              <label
                                key={sch}
                                className={`p-3.5 border rounded-sm cursor-pointer flex items-center gap-2 text-xs font-medium transition-all ${
                                  formData.scheduleType === sch
                                    ? 'border-[#08783F] bg-[#08783F]/5 text-[#08783F]'
                                    : 'border-stone-300 text-[#1F2933] hover:bg-stone-50'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="schedule"
                                  checked={formData.scheduleType === sch}
                                  onChange={() =>
                                    setFormData({ ...formData, scheduleType: sch })
                                  }
                                  className="accent-[#08783F]"
                                />
                                <span>{sch}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: Candidate identity */}
                    {currentStep === 2 && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-[#1F2933] mb-1">
                              Nom de famille *
                            </label>
                            <input
                              type="text"
                              placeholder="Ex: KOUASSI"
                              value={formData.lastName}
                              onChange={(e) =>
                                setFormData({ ...formData, lastName: e.target.value })
                              }
                              className="w-full p-3 text-xs bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#08783F]"
                            />
                            {errors.lastName && (
                              <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#1F2933] mb-1">
                              Prénoms complets *
                            </label>
                            <input
                              type="text"
                              placeholder="Ex: Jean-Marc"
                              value={formData.firstNames}
                              onChange={(e) =>
                                setFormData({ ...formData, firstNames: e.target.value })
                              }
                              className="w-full p-3 text-xs bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#08783F]"
                            />
                            {errors.firstNames && (
                              <p className="text-red-600 text-xs mt-1">{errors.firstNames}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-[#1F2933] mb-1">
                              Date de naissance
                            </label>
                            <input
                              type="date"
                              value={formData.birthDate}
                              onChange={(e) =>
                                setFormData({ ...formData, birthDate: e.target.value })
                              }
                              className="w-full p-3 text-xs bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#08783F]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#1F2933] mb-1">
                              Genre
                            </label>
                            <select
                              value={formData.gender}
                              onChange={(e) =>
                                setFormData({ ...formData, gender: e.target.value })
                              }
                              className="w-full p-3 text-xs bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#08783F]"
                            >
                              <option value="Masculin">Masculin</option>
                              <option value="Féminin">Féminin</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#1F2933] mb-1">
                              Nationalité
                            </label>
                            <input
                              type="text"
                              value={formData.nationality}
                              onChange={(e) =>
                                setFormData({ ...formData, nationality: e.target.value })
                              }
                              className="w-full p-3 text-xs bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#08783F]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-[#1F2933] mb-1">
                              Téléphone appel *
                            </label>
                            <input
                              type="tel"
                              placeholder="+225 07 ..."
                              value={formData.phone}
                              onChange={(e) =>
                                setFormData({ ...formData, phone: e.target.value })
                              }
                              className="w-full p-3 text-xs bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#08783F]"
                            />
                            {errors.phone && (
                              <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#1F2933] mb-1">
                              Numéro WhatsApp
                            </label>
                            <input
                              type="tel"
                              placeholder="+225 05 ..."
                              value={formData.whatsapp}
                              onChange={(e) =>
                                setFormData({ ...formData, whatsapp: e.target.value })
                              }
                              className="w-full p-3 text-xs bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#08783F]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-[#1F2933] mb-1">
                              Adresse Email
                            </label>
                            <input
                              type="email"
                              placeholder="candidat@email.ci"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                              }
                              className="w-full p-3 text-xs bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#08783F]"
                            />
                            {errors.email && (
                              <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#1F2933] mb-1">
                              Commune / Ville de résidence
                            </label>
                            <input
                              type="text"
                              placeholder="Ex: Yopougon, Port-Bouët, Koumassi..."
                              value={formData.residenceCity}
                              onChange={(e) =>
                                setFormData({ ...formData, residenceCity: e.target.value })
                              }
                              className="w-full p-3 text-xs bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#08783F]"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: Prior Academic background */}
                    {currentStep === 3 && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-[#1F2933] mb-1">
                              Dernier Diplôme obtenu
                            </label>
                            <select
                              value={formData.lastDegree}
                              onChange={(e) =>
                                setFormData({ ...formData, lastDegree: e.target.value })
                              }
                              className="w-full p-3 text-xs bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#08783F]"
                            >
                              <option value="Baccalauréat">Baccalauréat</option>
                              <option value="Brevet de Technicien (BT)">Brevet de Technicien (BT)</option>
                              <option value="BTS (Bac+2)">BTS (Bac+2)</option>
                              <option value="DUT (Bac+2)">DUT (Bac+2)</option>
                              <option value="Licence (Bac+3)">Licence (Bac+3)</option>
                              <option value="Autre titre équivalent">Autre titre équivalent</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#1F2933] mb-1">
                              Série ou Spécialité
                            </label>
                            <input
                              type="text"
                              placeholder="Ex: Série G2, D, A2, C, Informatique..."
                              value={formData.bacSeries}
                              onChange={(e) =>
                                setFormData({ ...formData, bacSeries: e.target.value })
                              }
                              className="w-full p-3 text-xs bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#08783F]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#1F2933] mb-1">
                              Établissement / Lycée d'origine *
                            </label>
                            <input
                              type="text"
                              placeholder="Ex: Lycée Technique d'Abidjan, Collège Moderne..."
                              value={formData.lastSchool}
                              onChange={(e) =>
                                setFormData({ ...formData, lastSchool: e.target.value })
                              }
                              className="w-full p-3 text-xs bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#08783F]"
                            />
                            {errors.lastSchool && (
                              <p className="text-red-600 text-xs mt-1">{errors.lastSchool}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#1F2933] mb-1">
                              Année d'obtention *
                            </label>
                            <input
                              type="text"
                              placeholder="Ex: 2026, 2025, 2024..."
                              value={formData.graduationYear}
                              onChange={(e) =>
                                setFormData({ ...formData, graduationYear: e.target.value })
                              }
                              className="w-full p-3 text-xs bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#08783F]"
                            />
                            {errors.graduationYear && (
                              <p className="text-red-600 text-xs mt-1">{errors.graduationYear}</p>
                            )}
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-[#1F2933] mb-1">
                              Mention ou Décision du Jury
                            </label>
                            <select
                              value={formData.mention}
                              onChange={(e) =>
                                setFormData({ ...formData, mention: e.target.value })
                              }
                              className="w-full p-3 text-xs bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#08783F]"
                            >
                              <option value="Passable">Passable</option>
                              <option value="Assez-Bien">Assez-Bien</option>
                              <option value="Bien">Bien</option>
                              <option value="Très-Bien">Très-Bien</option>
                              <option value="En cours d'obtention">En cours d'obtention (Session en cours)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 4: Documents checklist */}
                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <div className="space-y-3 bg-stone-50 p-5 border border-stone-200 rounded-sm">
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.hasBirthCert}
                              onChange={(e) =>
                                setFormData({ ...formData, hasBirthCert: e.target.checked })
                              }
                              className="mt-1 accent-[#08783F]"
                            />
                            <div>
                              <span className="text-xs font-bold text-[#1F2933] block">
                                Extrait d'acte de naissance (Original ou copie légalisée)
                              </span>
                              <span className="text-[11px] text-[#667085]">
                                Requis pour l'immatriculation au Ministère de l'Enseignement Supérieur
                              </span>
                            </div>
                          </label>

                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.hasDiplomaCopy}
                              onChange={(e) =>
                                setFormData({ ...formData, hasDiplomaCopy: e.target.checked })
                              }
                              className="mt-1 accent-[#08783F]"
                            />
                            <div>
                              <span className="text-xs font-bold text-[#1F2933] block">
                                Copie légalisée de la Collation / Attestation du Bac ou diplôme précédent
                              </span>
                              <span className="text-[11px] text-[#667085]">
                                Justificatif officiel de votre niveau d'études
                              </span>
                            </div>
                          </label>

                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.hasIdCard}
                              onChange={(e) =>
                                setFormData({ ...formData, hasIdCard: e.target.checked })
                              }
                              className="mt-1 accent-[#08783F]"
                            />
                            <div>
                              <span className="text-xs font-bold text-[#1F2933] block">
                                Copie de la Carte Nationale d'Identité (CNI) ou Passeport
                              </span>
                              <span className="text-[11px] text-[#667085]">
                                Document d'identité en cours de validité
                              </span>
                            </div>
                          </label>

                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.hasPhotos}
                              onChange={(e) =>
                                setFormData({ ...formData, hasPhotos: e.target.checked })
                              }
                              className="mt-1 accent-[#08783F]"
                            />
                            <div>
                              <span className="text-xs font-bold text-[#1F2933] block">
                                4 Photos d'identité récentes couleur sur fond blanc
                              </span>
                              <span className="text-[11px] text-[#667085]">
                                Destinées à votre dossier physique et à la carte d'étudiant ISTAG
                              </span>
                            </div>
                          </label>
                        </div>

                        {/* Recap box */}
                        <div className="p-4 bg-[#08783F]/5 border border-[#08783F]/30 rounded-sm text-xs space-y-1">
                          <span className="font-bold text-[#08783F] block">
                            Récapitulatif final de votre candidature :
                          </span>
                          <p className="text-[#1F2933]">
                            <strong>Candidat :</strong> {formData.lastName.toUpperCase()} {formData.firstNames} ({formData.phone})
                          </p>
                          <p className="text-[#1F2933]">
                            <strong>Programme :</strong> {selectedProgramObj.title} ({formData.degreeLevel}) · {formData.scheduleType}
                          </p>
                          <p className="text-[#1F2933]">
                            <strong>Campus retenu :</strong> {selectedCampusObj.name}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Step Navigation Controls */}
                    <div className="flex items-center justify-between pt-6 mt-6 border-t border-stone-200">
                      {currentStep > 1 ? (
                        <button
                          type="button"
                          onClick={handlePrev}
                          className="px-5 py-2.5 text-xs font-medium text-[#1F2933] hover:text-[#08783F] border border-stone-300 rounded-sm hover:bg-stone-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Précédent</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={onBackToHome}
                          className="text-xs font-medium text-[#667085] hover:text-[#08783F] transition-colors cursor-pointer"
                        >
                          Annuler et retourner au site
                        </button>
                      )}

                      {/* Primary Button: Vert avec texte blanc */}
                      <button
                        type="button"
                        onClick={handleNext}
                        className="px-7 py-3 bg-[#08783F] hover:bg-[#056331] text-white font-bold text-xs rounded-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                      >
                        <span>{currentStep === 4 ? 'Valider et Obtenir mon Récépissé' : 'Continuer'}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#F5B51B]" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Quick Help Card */}
          <div className="mt-10 bg-white border border-stone-200 p-6 rounded-sm shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#667085] no-print">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-[#08783F] text-[#F5B51B] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-[#1F2933] block text-sm font-serif">
                  Besoin d'aide pour votre orientation ou votre dossier ?
                </strong>
                <span>
                  Nos conseillers vous accueillent au Siège de Yopougon SIDECI et à la Succursale de Vridi.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href={`https://wa.me/2250707421819`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#08783F] hover:bg-[#056331] text-white rounded-sm font-bold transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#F5B51B]" />
                <span>WhatsApp Admissions</span>
              </a>
              <button
                onClick={onBackToHome}
                className="px-4 py-2 border border-stone-300 text-[#1F2933] rounded-sm hover:bg-stone-50 transition-colors cursor-pointer"
              >
                Retour Accueil
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Standalone Quiet Footer */}
      <footer className="bg-[#056331] text-white/80 text-xs py-8 border-t border-[#08783F] no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-brand font-bold text-white text-base tracking-wide">ISTAG</span>
            <span aria-hidden="true" className="text-white/40">·</span>
            <span>Portail des Admissions & Pré-inscriptions</span>
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
