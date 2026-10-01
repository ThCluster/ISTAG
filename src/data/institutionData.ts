export interface CampusInfo {
  id: string;
  name: string;
  type: string;
  location: string;
  district: string;
  address: string;
  phone: string;
  email: string;
  image: string;
  description: string;
  keyAssets: string[];
  accessGuide: string;
}

export const INSTITUTION = {
  name: "Institut Supérieur des Technologies Avancées",
  shortName: "ISTAG",
  instituteName: "Institut Supérieur des Technologies Avancées",
  instituteAcronym: "ISTAG",
  legalStatus: "Société à Responsabilité Limitée (SARL)",
  constitutionDate: "Août 2018",
  foundingYear: "2017",
  historyDetails: "Fondé par des universitaires et des cadres dirigeants du secteur productif ivoirien, l'Institut Supérieur des Technologies Avancées (ISTAG) est un établissement privé d'enseignement supérieur agréé par le Ministère de l'Enseignement Supérieur et de la Recherche Scientifique (MESRS) de Côte d'Ivoire. Établi à Gagnoa au quartier Garahio (au sein de l'Ex-Collège Les Alliances), l'ISTAG propose des cursus en Enseignement Technique & Professionnel, des BTS d'État, ainsi que des Licences et Masters Professionnels.",
  positioning: "Établissement d'enseignement supérieur technique et professionnel agréé MESRS à Gagnoa (Quartier Garahio — Ex-Collège Les Alliances).",
  accreditation: "Agrément officiel du Ministère de l'Enseignement Supérieur et de la Recherche Scientifique (MESRS)",
  motto: "INNOVATION — EXCELLENCE — OPPORTUNITÉ",
  secondaryMotto: "Rigueur — Compétence — Insertion Professionnelle",
  contact: {
    generalPhone: "+225 07 07 48 60 50",
    phone2: "+225 01 42 89 18 84",
    phone3: "+225 05 64 21 43 73",
    whatsapp: "+225 07 07 48 60 50",
    admissionsPhone: "+225 07 07 48 60 50",
    generalEmail: "istag225@gmail.com",
    admissionsEmail: "istag225@gmail.com",
    location: "Gagnoa Garahio, Ex-Collège Les Alliances",
    workingHours: "Du Lundi au Vendredi : 07h30 – 18h00 | Samedi : 08h00 – 13h00"
  },
  stats: [
    { value: "95%", label: "Taux d'insertion professionnelle sous 6 mois" },
    { value: "12", label: "Filières BTS d'État & Formations Supérieures" },
    { value: "Garahio", label: "Campus à Gagnoa (Ex-Collège Les Alliances)" },
    { value: "35 000 F", label: "Frais d'inscription Enseignement Technique (Affecté)" }
  ]
};

export const CAMPUSES: CampusInfo[] = [
  {
    id: 'campus-gagnoa',
    name: "Campus ISTAG — Gagnoa Garahio",
    type: "Campus Principal & Pôle Technologique, Minier, Agricole et Managérial",
    location: "Gagnoa, Région du Gôh",
    district: "Quartier Garahio (au sein de l'Ex-Collège Les Alliances)",
    address: "Quartier Garahio, Enceinte de l'Ex-Collège Les Alliances, Gagnoa, Côte d'Ivoire",
    phone: "(225) 07 07 48 60 50 / 01 42 89 18 84 / 05 64 21 43 73",
    email: "istag225@gmail.com",
    image: "/src/assets/images/istag_campus_gagnoa_1790603788172.jpg",
    description: "Implanté à Gagnoa dans le dynamique quartier Garahio sur le site étendu et spacieux de l'Ex-Collège Les Alliances, l'ISTAG déploie des infrastructures adaptées à l'Enseignement Technique & Professionnel, aux filières BTS d'État (Mines, Agriculture Tropicale, Informatique, Bâtiment, Hôtellerie, Gestion) et aux cycles Licences et Masters.",
    keyAssets: [
      "Cadre académique réputé et spacieux à l'Ex-Collège Les Alliances",
      "Pôle d'excellence en Mines, Géologie et Pétrole",
      "Pôle agronomique en Agriculture Tropicale (Végétale & Animale)",
      "Pôle Génie Civil (Option Bâtiment) & Tourisme et Hôtellerie",
      "Laboratoires informatiques et réseau de télécommunication",
      "Secrétariat académique et guichet d'inscription permanent sur place"
    ],
    accessGuide: "Idéalement situé au quartier Garahio à Gagnoa, au sein de l'enceinte réputée de l'Ex-Collège Les Alliances."
  }
];

export const TUITION_SCHEDULE = {
  technique: {
    title: "Enseignement Technique & Professionnel",
    filieres: ["BAC G1", "BAC G2", "BAC F2", "BEP Comptabilité", "BT Sciences Médico-Sociales"],
    inscription: "35 000 FCFA (Affecté)",
    scolariteAnnuelle: "Pris en charge par l'État (Affectés)",
    fraisInscriptionAffecte: "35 000 FCFA",
    modalites: "Frais officiels d'inscription pour les élèves affectés par l'État de Côte d'Ivoire.",
    comprend: "Inscription annuelle, dossiers administratifs, accès aux salles et ateliers pratiques."
  },
  bts: {
    title: "BTS : Nos Filières",
    inscription: "Affecté : 85 000 FCFA | Non Affecté : 200 000 FCFA",
    scolariteAnnuelle: "Selon statut d'affectation",
    fraisInscriptionAffecte: "85 000 FCFA",
    fraisInscriptionNonAffecte: "200 000 FCFA",
    modalites: "Frais officiels d'inscription (Affecté : 85 000 FCFA | Non Affecté : 200 000 FCFA).",
    comprend: "Dossier d'inscription, encadrement aux examens d'État du BTS, laboratoires informatiques, sorties de terrain."
  },
  licence: {
    title: "Licence Professionnelle",
    inscription: "450 000 FCFA / an",
    scolariteAnnuelle: "450 000 FCFA / an",
    fraisAnnuel: "450 000 FCFA / an",
    modalites: "Paiement annuel échelonné (450 000 FCFA / an).",
    comprend: "Cours magistraux, séminaires professionnels, encadrement de stage et soutenance."
  },
  master: {
    title: "Master Professionnel",
    inscription: "800 000 FCFA / an",
    scolariteAnnuelle: "800 000 FCFA / an",
    fraisAnnuel: "800 000 FCFA / an",
    modalites: "Paiement annuel échelonné (800 000 FCFA / an).",
    comprend: "Enseignement dispensé par des experts, études de cas sectoriels, direction de thèse professionnelle."
  }
};

export const FAQ_ITEMS = [
  {
    question: "Où se situe exactement le Campus ISTAG de Gagnoa ?",
    answer: "Le campus de l'ISTAG est implanté à Gagnoa au quartier Garahio, dans l'enceinte de l'Ex-Collège Les Alliances. Le site dispose de salles de cours spacieuses, de laboratoires informatiques, et d'un guichet d'accueil ouvert tous les jours ouvrables."
  },
  {
    question: "Quels sont les frais d'inscription officiels selon le flyer ?",
    answer: "Selon le flyer officiel de l'ISTAG : Enseignement Technique & Professionnel (Affecté) : 35 000 FCFA ; BTS (Affecté) : 85 000 FCFA ; BTS (Non Affecté) : 200 000 FCFA ; Licence Professionnelle : 450 000 FCFA / an ; Master Professionnel : 800 000 FCFA / an."
  },
  {
    question: "Quelles sont les filières BTS proposées à l'ISTAG Gagnoa ?",
    answer: "L'ISTAG propose 12 filières BTS : Finance Comptabilité et Gestion des Entreprises (FCGE), Gestion Commerciale, Ressources Humaines et Communications, Assistanat de Direction, Logistique, Informatique Développeur d'Application (IDA), Réseaux Informatiques et Télécommunications (RIT), Systèmes Électroniques et Informatiques (SEI), Agriculture Tropicale Option Animale, Agriculture Tropicale Option Végétale, Génie Civil Option Bâtiment, et Touristique et Hôtellerie."
  },
  {
    question: "Quelles sont les séries de l'Enseignement Technique & Professionnel ?",
    answer: "L'ISTAG prépare aux diplômes techniques : BAC G1, BAC G2, BAC F2, BEP Comptabilité, et BT Sciences Médico-Sociales."
  },
  {
    question: "Quelles sont les spécialités de Licences et Masters ?",
    answer: "Les cycles Licences et Masters couvrent : Finance Comptabilité, Banque et Assurance, Gestion des Ressources Humaines, Gestion des Projets, Informatique (Option Génie Logiciel), Transport & Logistique, Audit et Contrôle, Marketing, Management et Communication."
  },
  {
    question: "Comment contacter l'ISTAG à Gagnoa ?",
    answer: "Vous pouvez joindre l'ISTAG par téléphone aux numéros (225) 07 07 48 60 50, 01 42 89 18 84 ou 05 64 21 43 73, par WhatsApp au 07 07 48 60 50, ou par email à istag225@gmail.com."
  }
];
