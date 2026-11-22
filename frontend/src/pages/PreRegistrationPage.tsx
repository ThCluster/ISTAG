import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Printer, ArrowRight, ShieldCheck, PhoneCall, Search, MessageSquare, Upload, Loader2, FileText, X } from 'lucide-react';
import { PROGRAMS, Program } from '../data/programsData';
import { CAMPUSES, INSTITUTION } from '../data/institutionData';
import { Logo } from '../components/Logo';
import { DossierTracking } from '../components/DossierTracking';
import {
  ApiError,
  EXTENSIONS_ACCEPTEES,
  PIECE_DU_CHAMP,
  PIECES,
  PieceType,
  soumettrePreinscription,
  verifierFichier,
} from '../api/admissions';

// Champ de l'API → [champ du formulaire, étape] pour afficher les erreurs du serveur au bon endroit.
const CHAMP_API_VERS_FORM: Record<string, [string, number]> = {
  niveau: ['programId', 1], filiere_id: ['programId', 1], filiere_nom: ['programId', 1],
  campus_id: ['campusId', 1], campus_nom: ['campusId', 1], regime: ['campusId', 1],
  nom: ['lastName', 2], prenoms: ['firstNames', 2], date_naissance: ['birthDate', 2],
  genre: ['gender', 2], nationalite: ['nationality', 2], telephone: ['phone', 2],
  whatsapp: ['whatsapp', 2], email: ['email', 2], ville_residence: ['residenceCity', 2],
  dernier_diplome: ['lastDegree', 3], serie: ['bacSeries', 3], mention: ['mention', 3],
  etablissement_origine: ['lastSchool', 3], annee_obtention: ['graduationYear', 3],
  consentement: ['consentement', 4],
};

const formaterTaille = (octets: number) =>
  octets < 1024 * 1024 ? `${Math.round(octets / 1024)} Ko` : `${(octets / (1024 * 1024)).toFixed(1)} Mo`;

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
  consentement: boolean;
  siteWeb: string; // champ piège anti-robots, reste vide pour un humain
}

const diplomeEnCours = (mention: string) => mention.toLowerCase().startsWith('en cours');

export const PreRegistrationPage: React.FC<PreRegistrationPageProps> = ({
  initialProgram,
  onBackToHome,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [registrationCode, setRegistrationCode] = useState<string>('');
  const [submittedAt, setSubmittedAt] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'new' | 'check'>('new');
  const [files, setFiles] = useState<Partial<Record<PieceType, File>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const initialFormData = (): RegistrationFormData => ({
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
    consentement: false,
    siteWeb: '',
  });

  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData);

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
    } else if (step === 4) {
      for (const { type } of PIECES) {
        const optionnel = type === 'diplome' && diplomeEnCours(formData.mention);
        if (!files[type] && !optionnel) newErrors[`piece_${type}`] = 'Ce document est obligatoire.';
      }
      if (!formData.consentement) {
        newErrors.consentement = 'Vous devez accepter pour envoyer votre dossier.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (type: PieceType, file: File | undefined) => {
    const key = `piece_${type}`;
    if (!file) return;
    const probleme = verifierFichier(file);
    if (probleme) {
      setErrors({ ...errors, [key]: probleme });
      return;
    }
    setFiles({ ...files, [type]: file });
    const { [key]: _, ...reste } = errors;
    setErrors(reste);
  };

  const removeFile = (type: PieceType) => {
    const { [type]: _, ...reste } = files;
    setFiles(reste);
  };

  const submitRegistration = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const result = await soumettrePreinscription(
        {
          niveau: formData.degreeLevel,
          filiere_id: formData.programId,
          filiere_nom: selectedProgramObj.title,
          campus_id: formData.campusId,
          campus_nom: selectedCampusObj.name,
          regime: formData.scheduleType,
          nom: formData.lastName.trim(),
          prenoms: formData.firstNames.trim(),
          date_naissance: formData.birthDate,
          genre: formData.gender,
          nationalite: formData.nationality,
          telephone: formData.phone.trim(),
          whatsapp: formData.whatsapp.trim(),
          email: formData.email.trim(),
          ville_residence: formData.residenceCity,
          dernier_diplome: formData.lastDegree,
          serie: formData.bacSeries,
          etablissement_origine: formData.lastSchool.trim(),
          annee_obtention: formData.graduationYear.trim(),
          mention: formData.mention,
          consentement: formData.consentement,
          site_web: formData.siteWeb,
        },
        files
      );
      setRegistrationCode(result.numero_dossier);
      setSubmittedAt(
        new Date(result.date_creation).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
      setSubmissionSuccess(true);
    } catch (err) {
      if (!(err instanceof ApiError)) {
        setSubmitError('Une erreur inattendue est survenue. Veuillez réessayer.');
        return;
      }
      // Replace les erreurs du serveur sur les bons champs et revient à la première étape concernée.
      const newErrors: { [key: string]: string } = {};
      const details: string[] = [];
      let firstStep = 5;
      for (const [champ, msg] of Object.entries(err.fieldErrors)) {
        const piece = PIECE_DU_CHAMP[champ];
        if (piece) {
          newErrors[`piece_${piece}`] = msg;
          firstStep = Math.min(firstStep, 4);
        } else if (CHAMP_API_VERS_FORM[champ]) {
          const [cle, etape] = CHAMP_API_VERS_FORM[champ];
          newErrors[cle] = msg;
          firstStep = Math.min(firstStep, etape);
        }
        details.push(msg);
      }
      setErrors(newErrors);
      if (firstStep < 5) setCurrentStep(firstStep);
      setSubmitError(details.length ? `${err.message} ${details.join(' ')}` : err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (isSubmitting || !validateStep(currentStep)) return;
    if (currentStep < 4) {
      setSubmitError(null);
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else {
      submitRegistration();
    }
  };

  const startNewRegistration = () => {
    setFormData(initialFormData());
    setFiles({});
    setErrors({});
    setSubmitError(null);
    setSubmissionSuccess(false);
    setCurrentStep(1);
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
                Saisissez le numéro inscrit sur votre récépissé (ex : <span className="font-mono font-semibold text-[#08783F]">ISTAG-2026-0001</span>) et le téléphone indiqué lors de la pré-inscription. Si la scolarité a signalé un document non conforme, vous pourrez le renvoyer ici.
              </p>

              <DossierTracking variant="light" />

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
                        1. Vos pièces justificatives ont été transmises en ligne :{' '}
                        <strong className="text-[#1F2933]">
                          {PIECES.filter(({ type }) => files[type]).map(({ label }) => label).join(' · ')}
                        </strong>
                        . La scolarité les vérifie et vous contactera au <strong>{formData.phone}</strong> si un document doit être corrigé.
                      </p>
                      <p className="text-[#667085] leading-relaxed">
                        2. Suivez votre dossier en ligne (rubrique « Consulter mon Dossier ») avec votre numéro <strong className="font-mono">{registrationCode}</strong> et votre téléphone. Vous pourrez y renvoyer un document signalé non conforme.
                      </p>
                      <p className="text-[#667085] leading-relaxed">
                        3. Une fois votre dossier validé, présentez ce récépissé et les originaux de vos pièces au guichet de la scolarité du <strong>{selectedCampusObj.name}</strong> ({selectedCampusObj.district}), puis réglez les frais d'inscription pour recevoir votre carte d'étudiant.
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
                      onClick={startNewRegistration}
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
                        {currentStep === 4 && '4. Envoi des Pièces Justificatives'}
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
                        <div className="p-4 bg-stone-50 border border-stone-200 rounded-sm text-xs text-[#667085] flex items-start gap-2">
                          <FileText className="w-4 h-4 text-[#08783F] shrink-0 mt-0.5" />
                          <p>
                            Joignez une photo nette ou un scan de chaque document (<strong>PDF, JPG ou PNG, 5 Mo maximum</strong>).
                            La scolarité les vérifie et vous contacte si l'un d'eux doit être corrigé : vous évitez ainsi un déplacement inutile.
                          </p>
                        </div>

                        <div className="space-y-3">
                          {PIECES.map(({ type, label, hint }) => {
                            const file = files[type];
                            const optionnel = type === 'diplome' && diplomeEnCours(formData.mention);
                            const erreur = errors[`piece_${type}`];
                            return (
                              <div
                                key={type}
                                className={`p-4 border rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                  erreur
                                    ? 'border-red-300 bg-red-50/40'
                                    : file
                                    ? 'border-[#08783F]/40 bg-[#08783F]/5'
                                    : 'border-stone-200 bg-white'
                                }`}
                              >
                                <div className="min-w-0">
                                  <span className="text-xs font-bold text-[#1F2933] block">
                                    {label} {optionnel ? <span className="font-normal text-[#667085]">(facultatif — diplôme en cours)</span> : '*'}
                                  </span>
                                  <span className="text-[11px] text-[#667085] block">{hint}</span>
                                  {file && (
                                    <span className="mt-1 text-[11px] text-[#08783F] font-medium flex items-center gap-1 min-w-0">
                                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                      <span className="truncate">{file.name}</span>
                                      <span className="shrink-0 text-[#667085]">({formaterTaille(file.size)})</span>
                                    </span>
                                  )}
                                  {erreur && <p className="text-red-600 text-xs mt-1">{erreur}</p>}
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  {file && (
                                    <button
                                      type="button"
                                      onClick={() => removeFile(type)}
                                      className="p-2 text-[#667085] hover:text-red-600 cursor-pointer"
                                      aria-label={`Retirer ${label}`}
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  )}
                                  <label className="px-4 py-2 border border-[#08783F] text-[#08783F] text-xs font-bold rounded-sm cursor-pointer hover:bg-[#08783F]/5 flex items-center gap-1.5">
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>{file ? 'Changer' : 'Choisir un fichier'}</span>
                                    <input
                                      type="file"
                                      accept={EXTENSIONS_ACCEPTEES}
                                      className="sr-only"
                                      onChange={(e) => {
                                        handleFileChange(type, e.target.files?.[0]);
                                        e.target.value = '';
                                      }}
                                    />
                                  </label>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Champ piège anti-robots : invisible et ignoré par les humains */}
                        <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
                          <label>
                            Site web
                            <input
                              type="text"
                              tabIndex={-1}
                              autoComplete="off"
                              value={formData.siteWeb}
                              onChange={(e) => setFormData({ ...formData, siteWeb: e.target.value })}
                            />
                          </label>
                        </div>

                        <div>
                          <label className="flex items-start gap-3 cursor-pointer text-xs text-[#1F2933]">
                            <input
                              type="checkbox"
                              checked={formData.consentement}
                              onChange={(e) => setFormData({ ...formData, consentement: e.target.checked })}
                              className="mt-0.5 accent-[#08783F]"
                            />
                            <span>
                              J'atteste l'exactitude des informations fournies et j'accepte que l'ISTAG conserve et utilise
                              mes données et documents uniquement pour le traitement de ma candidature. *
                            </span>
                          </label>
                          {errors.consentement && (
                            <p className="text-red-600 text-xs mt-1">{errors.consentement}</p>
                          )}
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

                    {submitError && (
                      <div role="alert" className="mt-6 p-3 bg-red-50 border border-red-200 rounded-sm text-xs text-red-800">
                        {submitError}
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
                        disabled={isSubmitting}
                        className="px-7 py-3 bg-[#08783F] hover:bg-[#056331] text-white font-bold text-xs rounded-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-wait"
                      >
                        <span>
                          {currentStep < 4
                            ? 'Continuer'
                            : isSubmitting
                            ? 'Envoi du dossier en cours…'
                            : 'Envoyer mon dossier et obtenir mon récépissé'}
                        </span>
                        {isSubmitting ? (
                          <Loader2 className="w-3.5 h-3.5 text-[#F5B51B] animate-spin" />
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5 text-[#F5B51B]" />
                        )}
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
                href={INSTITUTION.contact.whatsappUrl}
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
