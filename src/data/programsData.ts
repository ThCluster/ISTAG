export interface Program {
  id: string;
  code?: string;
  title: string;
  degreeLevel: 'BTS' | 'Technique & Pro' | 'Licence Pro' | 'Master Pro';
  category?: 'Tertiaire & Gestion' | 'Technologies & Digital' | 'Agro-Industrie & Mines' | 'Bâtiment & Tourisme' | 'Cycle Supérieur';
  duration: string;
  campuses: string[];
  schedule: string[];
  description: string;
  careerOutcomes: string[];
  targetAudience: string;
  modules: string[];
  keyHighlight: string;
}

export const PROGRAMS: Program[] = [
  // ==========================================
  // --- 1. ENSEIGNEMENT TECHNIQUE & PROFESSIONNEL ---
  // ==========================================
  {
    id: 'tech-bac-g1',
    code: 'BAC G1',
    title: 'BAC G1 — Secrétariat & Techniques Administratives',
    degreeLevel: 'Technique & Pro',
    category: 'Tertiaire & Gestion',
    duration: '3 ans (Secondaire Technique)',
    campuses: ['Gagnoa Garahio (Ex-Collège Les Alliances)'],
    schedule: ['Cours du jour'],
    description: "Formation de l'enseignement technique préparant au Baccalauréat G1 en techniques administratives, rédaction professionnelle, sténodactylo et bureautique.",
    careerOutcomes: [
      "Poursuite d'études en BTS Assistanat de Direction, RH ou Gestion",
      "Secrétaire Administrative Junior",
      "Opératrice de Saisie et d'Accueil",
      "Assistante Bureautique"
    ],
    targetAudience: "Élèves de niveau 3ème orientés ou titulaires du BEPC.",
    modules: [
      "Communication Écrite et Correspondance Professionnelle",
      "Bureautique Appliquée (Word, Excel, PowerPoint)",
      "Organisation Administrative et Classement",
      "Économie et Droit"
    ],
    keyHighlight: "Frais d'inscription officiel du flyer : Affecté 35 000 FCFA."
  },
  {
    id: 'tech-bac-g2',
    code: 'BAC G2',
    title: 'BAC G2 — Comptabilité & Gestion des Entreprises',
    degreeLevel: 'Technique & Pro',
    category: 'Tertiaire & Gestion',
    duration: '3 ans (Secondaire Technique)',
    campuses: ['Gagnoa Garahio (Ex-Collège Les Alliances)'],
    schedule: ['Cours du jour'],
    description: "Formation technique de référence formant aux fondamentaux de la comptabilité générale, des calculs financiers, du droit commercial et de la gestion.",
    careerOutcomes: [
      "Poursuite d'études en BTS FCGE, GEC ou Logistique",
      "Aide-Comptable en Entreprise ou Cabinet",
      "Assistant(e) de Gestion PME",
      "Commis Comptable"
    ],
    targetAudience: "Élèves de niveau 3ème orientés ou titulaires du BEPC.",
    modules: [
      "Comptabilité Générale et Traitement des Pièces",
      "Mathématiques Financières et Statistiques",
      "Économie Générale et Droit",
      "Informatique et Tableur Comptable"
    ],
    keyHighlight: "Frais d'inscription officiel du flyer : Affecté 35 000 FCFA."
  },
  {
    id: 'tech-bac-f2',
    code: 'BAC F2',
    title: 'BAC F2 — Électronique Industrielle',
    degreeLevel: 'Technique & Pro',
    category: 'Technologies & Digital',
    duration: '3 ans (Secondaire Technique)',
    campuses: ['Gagnoa Garahio (Ex-Collège Les Alliances)'],
    schedule: ['Cours du jour'],
    description: "Filière industrielle de référence préparant au Baccalauréat F2 en circuits électroniques, télécommunications, automatisme et maintenance d'équipements.",
    careerOutcomes: [
      "Poursuite en BTS SEI, RIT ou IDA",
      "Monteur-Câbleur en Électronique",
      "Technicien de Maintenance Premier Niveau",
      "Opérateur sur Ligne de Production"
    ],
    targetAudience: "Élèves de niveau 3ème avec fort intérêt technique et mathématique.",
    modules: [
      "Électronique Analogique et Numérique",
      "Mesures Électriques et Laboratoire",
      "Schémas Électroniques et Dessin Technique",
      "Physique Appliquée et Informatique Industrielle"
    ],
    keyHighlight: "Frais d'inscription officiel du flyer : Affecté 35 000 FCFA."
  },
  {
    id: 'tech-bep-compta',
    code: 'BEP Compta',
    title: 'BEP Comptabilité',
    degreeLevel: 'Technique & Pro',
    category: 'Tertiaire & Gestion',
    duration: '2 ans (Cycle Professionnel Court)',
    campuses: ['Gagnoa Garahio (Ex-Collège Les Alliances)'],
    schedule: ['Cours du jour'],
    description: "Formation professionnelle rapide certifiante axée sur l'enregistrement des écritures comptables de base, la facturation et le classement documentaire.",
    careerOutcomes: [
      "Agent Comptable",
      "Aide Magasinier / Facturation",
      "Passerelle vers le Baccalauréat G2"
    ],
    targetAudience: "Élèves issus de la classe de 3ème.",
    modules: [
      "Tenue des Journaux Comptables",
      "Facturation et Règlements",
      "Bureautique et Traitement de Texte",
      "Relations Clients-Fournisseurs"
    ],
    keyHighlight: "Frais d'inscription officiel du flyer : Affecté 35 000 FCFA."
  },
  {
    id: 'tech-bt-sms',
    code: 'BT SMS',
    title: 'BT Sciences Médico-Sociales',
    degreeLevel: 'Technique & Pro',
    category: 'Tertiaire & Gestion',
    duration: '3 ans (Brevet de Technicien)',
    campuses: ['Gagnoa Garahio (Ex-Collège Les Alliances)'],
    schedule: ['Cours du jour'],
    description: "Formation professionnelle technique spécialisée dans la gestion administrative des structures sanitaires, cliniques privées, centres médico-sociaux et ONG humanitaires.",
    careerOutcomes: [
      "Secrétaire Médicale en Clinique / Hôpital",
      "Assistant(e) Médico-Social(e)",
      "Gestionnaire des Dossiers Patients",
      "Agent d'Accueil et d'Admission Hospitalière"
    ],
    targetAudience: "Titulaires du BEPC ou niveau 3ème.",
    modules: [
      "Terminologie Médicale et Vocabulaire Sanitaire",
      "Organisation des Services Hospitaliers",
      "Bureautique et Gestion des Archives Médicales",
      "Hygiène Hospitalière, Éthique et Déontologie"
    ],
    keyHighlight: "Frais d'inscription officiel du flyer : Affecté 35 000 FCFA."
  },

  // ==========================================
  // --- 2. BTS : NOS FILIÈRES (12 FILIÈRES OFFICIELLES) ---
  // ==========================================
  {
    id: 'bts-fcge',
    code: 'FCGE',
    title: 'BTS Finance Comptabilité et Gestion des Entreprises',
    degreeLevel: 'BTS',
    category: 'Tertiaire & Gestion',
    duration: '2 ans (Bac+2)',
    campuses: ['Gagnoa Garahio (Ex-Collège Les Alliances)'],
    schedule: ['Cours du jour', 'Cours du soir'],
    description: "Filière reine de la gestion d'entreprise axée sur l'analyse financière, la maîtrise fiscale ivoirienne (SYSCOHADA révisé), l'audit comptable et le contrôle budgétaire.",
    careerOutcomes: [
      "Comptable d'Entreprise",
      "Gestionnaire de Trésorerie Junior",
      "Assistant(e) Contrôleur de Gestion",
      "Collaborateur(trice) en Cabinet d'Expertise Comptable",
      "Agent Financier en Établissement Bancaire"
    ],
    targetAudience: "Titulaires du Baccalauréat séries G2, B, D, C ou équivalent.",
    modules: [
      "Comptabilité Générale et Approfondie (SYSCOHADA Révisé)",
      "Fiscalité des Entreprises en Côte d'Ivoire",
      "Mathématiques Financières & Statistiques Appliquées",
      "Analyse Financière et Gestion Budgétaire",
      "Logiciels Comptables Professionnels (Sage Saari, etc.)",
      "Droit des Sociétés et Droit Commercial OHADA"
    ],
    keyHighlight: "Frais d'inscription flyer : Affecté 85 000 FCFA | Non Affecté 200 000 FCFA."
  },
  {
    id: 'bts-gec',
    code: 'GEC',
    title: 'BTS Gestion Commerciale',
    degreeLevel: 'BTS',
    category: 'Tertiaire & Gestion',
    duration: '2 ans (Bac+2)',
    campuses: ['Gagnoa Garahio (Ex-Collège Les Alliances)'],
    schedule: ['Cours du jour', 'Cours du soir'],
    description: "Programme dynamique développant la force de négociation commerciale, la mercatique opérationnelle, les techniques de vente B2B/B2C et la gestion de la relation client.",
    careerOutcomes: [
      "Attaché(e) Commercial(e) Grands Comptes",
      "Chef(fe) de Rayon en Grande Distribution",
      "Conseiller(ère) Clientèle & Chargé(e) de Ventes",
      "Assistant(e) Chef de Produit",
      "Responsable de Point de Vente"
    ],
    targetAudience: "Titulaires du Baccalauréat toutes séries (A, B, C, D, G2) ou équivalent.",
    modules: [
      "Techniques de Négociation Commerciale & Vente Stratégique",
      "Marketing Fondamental et Marketing Opérationnel",
      "Prospection Commerciale & Gestion de la Relation Client (CRM)",
      "Commerce International et Douanes",
      "Droit de la Consommation et de la Distribution"
    ],
    keyHighlight: "Frais d'inscription flyer : Affecté 85 000 FCFA | Non Affecté 200 000 FCFA."
  },
  {
    id: 'bts-rhc',
    code: 'RHCOM',
    title: 'BTS Ressources Humaines et Communications',
    degreeLevel: 'BTS',
    category: 'Tertiaire & Gestion',
    duration: '2 ans (Bac+2)',
    campuses: ['Gagnoa Garahio (Ex-Collège Les Alliances)'],
    schedule: ['Cours du jour', 'Cours du soir'],
    description: "Formation complète aux techniques de gestion des ressources humaines, gestion de la paie, recrutement, droit du travail ivoirien et communication d'entreprise.",
    careerOutcomes: [
      "Assistant(e) Ressources Humaines",
      "Chargé(e) de Recrutement et de Formation",
      "Gestionnaire de Paie et Déclarations Sociales (CNPS)",
      "Chargé(e) de Communication Interne et Événementielle"
    ],
    targetAudience: "Titulaires du Baccalauréat toutes séries (A, B, D, G2) ou équivalent.",
    modules: [
      "Gestion Prévisionnelle des Emplois et Compétences (GPEC)",
      "Droit Social et Droit du Travail Ivoirien",
      "Processus de Recrutement et Évaluation des Talents",
      "Administration de la Paie et Déclarations Sociales (CNPS)",
      "Communication d'Entreprise et Relations Publiques"
    ],
    keyHighlight: "Frais d'inscription flyer : Affecté 85 000 FCFA | Non Affecté 200 000 FCFA."
  },
  {
    id: 'bts-ad',
    code: 'AD',
    title: 'BTS Assistanat de Direction',
    degreeLevel: 'BTS',
    category: 'Tertiaire & Gestion',
    duration: '2 ans (Bac+2)',
    campuses: ['Gagnoa Garahio (Ex-Collège Les Alliances)'],
    schedule: ['Cours du jour', 'Cours du soir'],
    description: "Formation de haut niveau préparant les futurs collaborateurs directs de la haute direction, managers de cabinets et coordinateurs d'équipes pluridisciplinaires.",
    careerOutcomes: [
      "Assistant(e) de Direction Générale",
      "Secrétaire Particulier(ère) de Cadre Dirigeant",
      "Office Manager",
      "Chargé(e) des Relations Publiques et du Protocole"
    ],
    targetAudience: "Titulaires du Baccalauréat toutes séries (A1, A2, B, G1, G2, D, C).",
    modules: [
      "Organisation et Gestion Administrative",
      "Communication d'Entreprise & Correspondance Administrative",
      "Pratique des Outils Bureautiques Avancés",
      "Gestion Documentaire, Archivage et GED",
      "Anglais des Affaires et Protocole"
    ],
    keyHighlight: "Frais d'inscription flyer : Affecté 85 000 FCFA | Non Affecté 200 000 FCFA."
  },
  {
    id: 'bts-lt',
    code: 'LT',
    title: 'BTS Logistique',
    degreeLevel: 'BTS',
    category: 'Tertiaire & Gestion',
    duration: '2 ans (Bac+2)',
    campuses: ['Gagnoa Garahio (Ex-Collège Les Alliances)'],
    schedule: ['Cours du jour', 'Cours du soir'],
    description: "Préparation opérationnelle aux métiers de la supply chain, de la gestion des stocks, du transport multimodal, des expéditions de matières premières et du transit douanier.",
    careerOutcomes: [
      "Agent d'Exploitation Transport & Fret",
      "Assistant Déclarant en Douane",
      "Gestionnaire de Stocks et d'Entrepôt",
      "Coordinateur de Flotte de Véhicules"
    ],
    targetAudience: "Titulaires du Baccalauréat toutes séries (A, B, C, D, G2).",
    modules: [
      "Organisation des Transports et Fret",
      "Procédures Douanières et Transit National/Régional",
      "Gestion Rationnelle des Stocks et Magasinage",
      "Économie des Transports et Incoterms"
    ],
    keyHighlight: "Frais d'inscription flyer : Affecté 85 000 FCFA | Non Affecté 200 000 FCFA."
  },
  {
    id: 'bts-ida',
    code: 'IDA',
    title: "BTS Informatique Développeur d'Application",
    degreeLevel: 'BTS',
    category: 'Technologies & Digital',
    duration: '2 ans (Bac+2)',
    campuses: ['Gagnoa Garahio (Ex-Collège Les Alliances)'],
    schedule: ['Cours du jour', 'Cours du soir'],
    description: "Cursus technique d'excellence formant les concepteurs de logiciels, développeurs web et mobile, administrateurs de bases de données et spécialistes du numérique.",
    careerOutcomes: [
      "Développeur Web & Mobile (Full Stack)",
      "Concepteur d'Applications d'Entreprise",
      "Gestionnaire de Bases de Données (SQL / NoSQL)",
      "Intégrateur Web & API"
    ],
    targetAudience: "Titulaires du Baccalauréat séries C, D, E, F2 ou Bac toutes séries avec forte affinité logique.",
    modules: [
      "Algorithmique Avancée et Programmation (Java, Python, JS)",
      "Développement Web & Frameworks Modernes (React, Node.js)",
      "Bases de Données Relationnelles & Modélisation",
      "Développement Mobile Android/iOS",
      "Sécurité Applicative et Déploiement"
    ],
    keyHighlight: "Frais d'inscription flyer : Affecté 85 000 FCFA | Non Affecté 200 000 FCFA."
  },
  {
    id: 'bts-rit',
    code: 'RIT',
    title: 'BTS Réseaux Informatiques et Télécommunications',
    degreeLevel: 'BTS',
    category: 'Technologies & Digital',
    duration: '2 ans (Bac+2)',
    campuses: ['Gagnoa Garahio (Ex-Collège Les Alliances)'],
    schedule: ['Cours du jour', 'Cours du soir'],
    description: "Formation de pointe axée sur l'administration réseau, la cybersécurité des systèmes, le déploiement fibre optique et les technologies télécoms mobiles.",
    careerOutcomes: [
      "Administrateur Réseaux & Systèmes Junior",
      "Technicien Supérieur Télécoms & Fibre Optique",
      "Technicien Support & Maintenance Réseau",
      "Installateur d'Équipements Réseau & VoIP"
    ],
    targetAudience: "Titulaires du Bac séries C, D, E, F2, F3 ou équivalent.",
    modules: [
      "Architecture Réseaux LAN/WAN & Protocoles TCP/IP",
      "Téléphonie sur IP (VoIP) et Télécoms Mobiles",
      "Câblage Structuré et Déploiement Fibre Optique",
      "Administration Serveurs Linux & Windows",
      "Sécurité Réseaux et Pare-feu"
    ],
    keyHighlight: "Frais d'inscription flyer : Affecté 85 000 FCFA | Non Affecté 200 000 FCFA."
  },
  {
    id: 'bts-sei',
    code: 'SEI',
    title: 'BTS Systèmes Électroniques et Informatiques',
    degreeLevel: 'BTS',
    category: 'Technologies & Digital',
    duration: '2 ans (Bac+2)',
    campuses: ['Gagnoa Garahio (Ex-Collège Les Alliances)'],
    schedule: ['Cours du jour', 'Cours du soir'],
    description: "Formation technique polyvalente formant aux architectures électroniques embarquées, aux automatismes industriels, aux capteurs et à la maintenance préventive/curative.",
    careerOutcomes: [
      "Technicien Supérieur en Maintenance Électronique",
      "Technicien en Automatisme et Informatique Industrielle",
      "Installateur de Systèmes Électroniques Industriels",
      "Responsable Service Après-Vente Matériel de Pointe"
    ],
    targetAudience: "Titulaires du Baccalauréat séries F2, C, D, E ou équivalent technique.",
    modules: [
      "Électronique Analogique et Numérique Avancée",
      "Microcontrôleurs et Systèmes Embarqués",
      "Automatisme Industriel et Supervision",
      "Maintenance et Diagnostic de Pannes Électroniques",
      "Sécurité Électrique et Normes Industrielles"
    ],
    keyHighlight: "Frais d'inscription flyer : Affecté 85 000 FCFA | Non Affecté 200 000 FCFA."
  },
  {
    id: 'bts-atpa',
    code: 'ATPA',
    title: 'BTS Agriculture Tropicale — Option Animale',
    degreeLevel: 'BTS',
    category: 'Agro-Industrie & Mines',
    duration: '2 ans (Bac+2)',
    campuses: ['Gagnoa Garahio (Ex-Collège Les Alliances)'],
    schedule: ['Cours du jour', 'Cours du soir'],
    description: "Cursus technique formant les spécialistes de l'élevage tropical (aviculture, porciculture, ruminants, pisciculture/aquaculture), de la nutrition et de la gestion de fermes modernes.",
    careerOutcomes: [
      "Chef d'Élevage et Superviseur Zootechnique",
      "Conseiller Technique en Nutrition et Santé Animale",
      "Gestionnaire de Ferme Avicole / Porcine / Bovine",
      "Technicien en Aquaculture et Pisciculture",
      "Promoteur d'Entreprise Agro-pastorale"
    ],
    targetAudience: "Titulaires du Baccalauréat séries D, C, A, Bac Agricole ou équivalent.",
    modules: [
      "Zootechnie Générale et Conduite des Élevages",
      "Alimentation, Formulation Rations et Nutrition Animale",
      "Santé, Hygiène Animale et Prophylaxie en Milieu Tropical",
      "Bâtiments d'Élevage et Biosécurité",
      "Gestion Technico-Économique d'une Exploitation Pastorale"
    ],
    keyHighlight: "Frais d'inscription flyer : Affecté 85 000 FCFA | Non Affecté 200 000 FCFA."
  },
  {
    id: 'bts-atpv',
    code: 'ATPV',
    title: 'BTS Agriculture Tropicale — Option Végétale',
    degreeLevel: 'BTS',
    category: 'Agro-Industrie & Mines',
    duration: '2 ans (Bac+2)',
    campuses: ['Gagnoa Garahio (Ex-Collège Les Alliances)'],
    schedule: ['Cours du jour', 'Cours du soir'],
    description: "Formation de terrain axée sur la conduite des cultures pérennes (cacao, café, hévéa, palmier) et vivrières, la protection phytosanitaire et la gestion d'exploitations agricoles du Gôh.",
    careerOutcomes: [
      "Gestionnaire et Chef d'Exploitation Agricole",
      "Conseiller Agricole en Coopérative et Agro-industrie",
      "Superviseur de Plantations Industrielles",
      "Technicien en Expérimentation Agronomique",
      "Entrepreneur en Agro-business et Maraîchage"
    ],
    targetAudience: "Titulaires du Baccalauréat séries D, C, A, Bac Agricole ou équivalent.",
    modules: [
      "Agronomie Générale et Sciences du Sol (Pédologie)",
      "Protection Phytosanitaire et Traitements des Cultures",
      "Itinéraires Techniques des Cultures Pérennes et Vivrières",
      "Machinisme Agricole, Irrigation et Gestion de l'Eau",
      "Gestion Technico-Économique d'Entreprise Agricole"
    ],
    keyHighlight: "Frais d'inscription flyer : Affecté 85 000 FCFA | Non Affecté 200 000 FCFA."
  },
  {
    id: 'bts-genie-civil',
    code: 'GCB',
    title: 'BTS Génie Civil — Option Bâtiment',
    degreeLevel: 'BTS',
    category: 'Bâtiment & Tourisme',
    duration: '2 ans (Bac+2)',
    campuses: ['Gagnoa Garahio (Ex-Collège Les Alliances)'],
    schedule: ['Cours du jour', 'Cours du soir'],
    description: "Formation technique formant les conducteurs de travaux, chefs de chantier et dessinateurs-projeteurs pour la conception, le calcul et le suivi d'exécution des chantiers de construction.",
    careerOutcomes: [
      "Conducteur de Travaux Bâtiment",
      "Chef de Chantier BTP",
      "Dessinateur-Projeteur en Bureau d'Études (AutoCAD)",
      "Technicien Métreur / Vérificateur",
      "Contrôleur Technique de Travaux"
    ],
    targetAudience: "Titulaires du Baccalauréat séries F4, C, D, E ou équivalent scientifique/technique.",
    modules: [
      "Résistance des Matériaux (RDM) et Béton Armé",
      "Topographie, Implantation et Dessin Assisté par Ordinateur (DAO)",
      "Organisation, Gestion et Sécurité de Chantier",
      "Technologie de Construction et Mécanique des Sols",
      "Métré, Devis et Étude de Prix"
    ],
    keyHighlight: "Frais d'inscription flyer : Affecté 85 000 FCFA | Non Affecté 200 000 FCFA."
  },
  {
    id: 'bts-tourisme-hotellerie',
    code: 'TH',
    title: 'BTS Touristique et Hôtellerie',
    degreeLevel: 'BTS',
    category: 'Bâtiment & Tourisme',
    duration: '2 ans (Bac+2)',
    campuses: ['Gagnoa Garahio (Ex-Collège Les Alliances)'],
    schedule: ['Cours du jour', 'Cours du soir'],
    description: "Préparation complète au management hôtelier, à l'accueil d'excellence, à la gestion d'établissements touristiques et à la commercialisation de produits de loisirs et séjours.",
    careerOutcomes: [
      "Gestionnaire d'Établissement Hôtelier",
      "Responsable Hébergement et Réception",
      "Conseiller en Voyages et Produits Touristiques",
      "Coordinateur d'Événements et Congrès Touristiques",
      "Promoteur du Tourisme Régional"
    ],
    targetAudience: "Titulaires du Baccalauréat toutes séries (A, B, G1, G2, D) ou équivalent.",
    modules: [
      "Management et Économie de l'Hôtellerie",
      "Techniques d'Accueil, Réservation et Réception",
      "Marketing Touristique et Promotion des Destinations",
      "Législation Hôtelière et Droit du Tourisme",
      "Anglais Professionnel Hôtelier et Restauration"
    ],
    keyHighlight: "Frais d'inscription flyer : Affecté 85 000 FCFA | Non Affecté 200 000 FCFA."
  },
  {
    id: 'bts-mgp',
    code: 'MGP',
    title: 'BTS Mines, Géologie et Pétrole',
    degreeLevel: 'BTS',
    category: 'Agro-Industrie & Mines',
    duration: '2 ans (Bac+2)',
    campuses: ['Gagnoa Garahio (Ex-Collège Les Alliances)'],
    schedule: ['Cours du jour', 'Cours du soir'],
    description: "Filière technique d'avenir formant les techniciens supérieurs spécialisés dans la prospection minière, la cartographie géologique, l'exploitation des gisements et la gestion environnementale des sites extractifs.",
    careerOutcomes: [
      "Technicien Supérieur Géologue Prospecteur",
      "Contrôleur d'Exploitation Minière et Carrières",
      "Technicien d'Échantillonnage et de Forage",
      "Superviseur Sécurité et Environnement Minier (QHSE)"
    ],
    targetAudience: "Titulaires du Baccalauréat séries C, D, E, F4 ou équivalent.",
    modules: [
      "Géologie Générale, Structurale et Pétrographie",
      "Techniques de Prospection Minière et Géophysique",
      "Topographie Minière, Cartographie et SIG",
      "Techniques de Forage et Traitement des Minerais",
      "Sécurité Industrielle et Protection de l'Environnement"
    ],
    keyHighlight: "Frais d'inscription flyer : Affecté 85 000 FCFA | Non Affecté 200 000 FCFA."
  },

  // ==========================================
  // --- 3. LICENCE & MASTER (8 FILIÈRES OFFICIELLES DU FLYER) ---
  // ==========================================
  {
    id: 'licence-finance-compta',
    title: 'Licence Professionnelle — Finance Comptabilité',
    degreeLevel: 'Licence Pro',
    category: 'Cycle Supérieur',
    duration: '1 an après Bac+2 (Bac+3)',
    campuses: ['Gagnoa Garahio (Ex-Collège Les Alliances)'],
    schedule: ['Cours du jour', 'Cours du soir'],
    description: "Approfondissement des techniques comptables internationales, de l'audit financier, de la gestion de trésorerie et de la conformité fiscale.",
    careerOutcomes: [
      "Comptable Confirmé",
      "Assistant Auditeur Financier",
      "Contrôleur de Gestion Junior",
      "Responsable Comptable PME"
    ],
    targetAudience: "Titulaires d'un BTS FCGE ou Bac+2 en sciences économiques et gestion.",
    modules: [
      "Comptabilité Approfondie et Normes SYSCOHADA/IFRS",
      "Fiscalité des Entreprises et Contentieux",
      "Audit Financier et Contrôle Interne",
      "Gestion Budgétaire et Analyse Financière"
    ],
    keyHighlight: "Frais d'inscription officiel du flyer : 450 000 FCFA / AN."
  },
  {
    id: 'licence-banque-assurance',
    title: 'Licence Professionnelle — Banque et Assurance',
    degreeLevel: 'Licence Pro',
    category: 'Cycle Supérieur',
    duration: '1 an après Bac+2 (Bac+3)',
    campuses: ['Gagnoa Garahio (Ex-Collège Les Alliances)'],
    schedule: ['Cours du jour', 'Cours du soir'],
    description: "Acquisition des compétences techniques dans l'intermédiation financière, l'analyse du risque de crédit, l'ingénierie assurantielle et la conformité bancaire UEMOA.",
    careerOutcomes: [
      "Chargé(e) de Clientèle Professionnels et PME",
      "Souscripteur(trice) en Assurance",
      "Analyste Risques Crédit",
      "Conseiller en Épargne et Placements"
    ],
    targetAudience: "Titulaires d'un BTS (FCGE, GEC) ou Bac+2 en Économie/Gestion.",
    modules: [
      "Techniques Bancaires et Marchés de Capitaux",
      "Droit des Assurances et Gestion des Sinistres",
      "Analyse Financière et Risque Client",
      "Marketing des Produits Bancaires et Assurantiels"
    ],
    keyHighlight: "Frais d'inscription officiel du flyer : 450 000 FCFA / AN."
  },
  {
    id: 'licence-grh',
    title: 'Licence Professionnelle — Gestion des Ressources Humaines',
    degreeLevel: 'Licence Pro',
    category: 'Cycle Supérieur',
    duration: '1 an après Bac+2 (Bac+3)',
    campuses: ['Gagnoa Garahio (Ex-Collège Les Alliances)'],
    schedule: ['Cours du jour', 'Cours du soir'],
    description: "Perfectionnement au management stratégique du capital humain, aux négociations sociales, au droit du travail et aux politiques de rémunération.",
    careerOutcomes: [
      "Responsable des Ressources Humaines Junior",
      "Chargé(e) de Recrutement et Gestion des Talents",
      "Gestionnaire Paie et Administration du Personnel",
      "Consultant(e) Junior RH"
    ],
    targetAudience: "Titulaires d'un BTS RHCOM, AD, FCGE ou Bac+2 équivalent.",
    modules: [
      "Politiques de Rémunération et SIRH",
      "Droit du Travail Avancé et Relations Professionnelles",
      "Ingénierie de Formation et GPEC",
      "Audit Social et Climat d'Entreprise"
    ],
    keyHighlight: "Frais d'inscription officiel du flyer : 450 000 FCFA / AN."
  },
  {
    id: 'licence-gestion-projets',
    title: 'Licence Professionnelle — Gestion des Projets',
    degreeLevel: 'Licence Pro',
    category: 'Cycle Supérieur',
    duration: '1 an après Bac+2 (Bac+3)',
    campuses: ['Gagnoa Garahio (Ex-Collège Les Alliances)'],
    schedule: ['Cours du jour', 'Cours du soir'],
    description: "Apprentissage des outils méthodologiques et informatiques de pilotage, de planification et d'évaluation financière des projets de développement et d'entreprise.",
    careerOutcomes: [
      "Assistant Chef de Projet",
      "Chargé de Suivi-Évaluation en ONG / Institution",
      "Coordinateur d'Opérations",
      "Planificateur Budgétaire de Projet"
    ],
    targetAudience: "Titulaires d'un BTS ou Bac+2 toutes filières techniques ou de gestion.",
    modules: [
      "Méthodologie de Montage de Projets (Cadre Logique)",
      "Planification et Outils Numériques (MS Project)",
      "Suivi et Évaluation des Projets",
      "Gestion Financière et Budgets de Projets"
    ],
    keyHighlight: "Frais d'inscription officiel du flyer : 450 000 FCFA / AN."
  },
  {
    id: 'licence-genie-logiciel',
    title: 'Licence Professionnelle — Informatique (Option Génie Logiciel)',
    degreeLevel: 'Licence Pro',
    category: 'Cycle Supérieur',
    duration: '1 an après Bac+2 (Bac+3)',
    campuses: ['Gagnoa Garahio (Ex-Collège Les Alliances)'],
    schedule: ['Cours du jour', 'Cours du soir'],
    description: "Cursus supérieur formant les concepteurs d'architectures logicielles, développeurs Full Stack, gestionnaires de bases de données et administrateurs d'API.",
    careerOutcomes: [
      "Ingénieur Logiciel Junior",
      "Développeur Full Stack Web & Mobile",
      "Administrateur de Bases de Données",
      "Chef de Projet Digital"
    ],
    targetAudience: "Titulaires d'un BTS IDA, RIT, SEI ou Bac+2 informatique.",
    modules: [
      "Conception et Architectures Logicielles Avancées",
      "Développement Web et Mobile Moderne",
      "Bases de Données Relationnelles et NoSQL",
      "Cybersécurité et Qualité Logicielle"
    ],
    keyHighlight: "Frais d'inscription officiel du flyer : 450 000 FCFA / AN."
  },
  {
    id: 'licence-transport-logistique',
    title: 'Licence Professionnelle — Transport & Logistique',
    degreeLevel: 'Licence Pro',
    category: 'Cycle Supérieur',
    duration: '1 an après Bac+2 (Bac+3)',
    campuses: ['Gagnoa Garahio (Ex-Collège Les Alliances)'],
    schedule: ['Cours du jour', 'Cours du soir'],
    description: "Formation de haut niveau axée sur la chaîne logistique intégrée (Supply Chain Management), les corridors de transit régionaux et le commerce international.",
    careerOutcomes: [
      "Responsable Supply Chain Junior",
      "Déclarant en Douane Agréé",
      "Gestionnaire de Plateforme Logistique",
      "Responsable Fret et Affrètement"
    ],
    targetAudience: "Titulaires d'un BTS Logistique, GEC, FCGE ou Bac+2.",
    modules: [
      "Supply Chain Management et Optimisation des Flux",
      "Droit Maritime, Aérien et Terrestre UEMOA",
      "Systèmes d'Information Logistiques (WMS/TMS)",
      "Gestion des Risques et Assurances Transport"
    ],
    keyHighlight: "Frais d'inscription officiel du flyer : 450 000 FCFA / AN."
  },
  {
    id: 'licence-audit-controle',
    title: 'Licence Professionnelle — Audit et Contrôle',
    degreeLevel: 'Licence Pro',
    category: 'Cycle Supérieur',
    duration: '1 an après Bac+2 (Bac+3)',
    campuses: ['Gagnoa Garahio (Ex-Collège Les Alliances)'],
    schedule: ['Cours du jour', 'Cours du soir'],
    description: "Cursus technique formant aux missions d'audit interne, à l'analyse de conformité, au contrôle de gestion et à l'élaboration des tableaux de bord financiers.",
    careerOutcomes: [
      "Auditeur Interne Junior",
      "Contrôleur de Gestion Opérationnel",
      "Assistant Commissaire aux Comptes",
      "Analyste Financier d'Entreprise"
    ],
    targetAudience: "Titulaires d'un BTS FCGE ou Bac+2 en Finance/Comptabilité.",
    modules: [
      "Normes Internationales d'Audit (ISA)",
      "Contrôle de Gestion et Comptabilité Analytique",
      "Audit des Procédures et Contrôle Interne",
      "Diagnostic Financier Approfondi"
    ],
    keyHighlight: "Frais d'inscription officiel du flyer : 450 000 FCFA / AN."
  },
  {
    id: 'licence-marketing-com',
    title: 'Licence Professionnelle — Marketing, Management et Communication',
    degreeLevel: 'Licence Pro',
    category: 'Cycle Supérieur',
    duration: '1 an après Bac+2 (Bac+3)',
    campuses: ['Gagnoa Garahio (Ex-Collège Les Alliances)'],
    schedule: ['Cours du jour', 'Cours du soir'],
    description: "Formation managériale préparant aux stratégies de marque, à la communication digitale 360°, aux études de marché et à la direction des ventes.",
    careerOutcomes: [
      "Responsable Marketing et Communication",
      "Chef de Produit / Brand Manager",
      "Chef de Publicité en Agence",
      "Responsable Stratégie Digitale"
    ],
    targetAudience: "Titulaires d'un BTS (GEC, RHCOM, AD) ou Bac+2 universitaire.",
    modules: [
      "Marketing Stratégique et Marketing Digital",
      "Communication Événementielle et Relations Médias",
      "Management des Équipes Commerciales",
      "Études de Marché et Comportement Consommateur"
    ],
    keyHighlight: "Frais d'inscription officiel du flyer : 450 000 FCFA / AN."
  },

  // ==========================================
  // --- 4. MASTERS PROFESSIONNELS (BAC+5) ---
  // ==========================================
  {
    id: 'master-audit-controle',
    title: 'Master Professionnel — Audit et Contrôle de Gestion',
    degreeLevel: 'Master Pro',
    category: 'Cycle Supérieur',
    duration: '2 ans après Bac+3 (Bac+5)',
    campuses: ['Gagnoa Garahio (Ex-Collège Les Alliances)'],
    schedule: ['Cours du soir & Samedi (Spécial Cadres & Professionnels)'],
    description: "Programme d'élite formant les directeurs financiers adjoints, auditeurs de grands cabinets et garants de la conformité comptable et financière des organisations.",
    careerOutcomes: [
      "Directeur Administratif et Financier (DAF)",
      "Auditeur Senior en Cabinet International",
      "Directeur du Contrôle de Gestion",
      "Consultant en Stratégie Financière"
    ],
    targetAudience: "Titulaires d'une Licence en Finance/Comptabilité ou équivalent Bac+3.",
    modules: [
      "Normes IFRS et Consolidation des Comptes",
      "Audit des Systèmes d'Information et Fraude",
      "Ingénierie Financière et Choix d'Investissement",
      "Gouvernance d'Entreprise et Gestion des Risques"
    ],
    keyHighlight: "Frais d'inscription officiel du flyer : 800 000 FCFA / AN."
  },
  {
    id: 'master-management-projets',
    title: 'Master Professionnel — Gestion des Projets & Stratégie',
    degreeLevel: 'Master Pro',
    category: 'Cycle Supérieur',
    duration: '2 ans après Bac+3 (Bac+5)',
    campuses: ['Gagnoa Garahio (Ex-Collège Les Alliances)'],
    schedule: ['Cours du soir & Samedi (Spécial Cadres)'],
    description: "Formation de haut niveau pour piloter des portefeuilles de projets complexes, maîtriser les standards internationaux (PMI/Scrum) et diriger les équipes pluridisciplinaires.",
    careerOutcomes: [
      "Directeur de Projet / Directeur PMO",
      "Chef de Mission de Développement",
      "Consultant Senior en Organisation",
      "Coordinateur de Programmes Régionaux"
    ],
    targetAudience: "Titulaires d'une Licence Professionnelle ou Bac+3 toutes disciplines.",
    modules: [
      "Management Stratégique de Projets (PMBOK/Agile)",
      "Pilotage Budgétaire et Rentabilité des Projets",
      "Leadership, Négociation et Conduite du Changement",
      "Management des Risques et Conformité"
    ],
    keyHighlight: "Frais d'inscription officiel du flyer : 800 000 FCFA / AN."
  },
  {
    id: 'master-genie-logiciel',
    title: 'Master Professionnel — Informatique & Génie Logiciel',
    degreeLevel: 'Master Pro',
    category: 'Cycle Supérieur',
    duration: '2 ans après Bac+3 (Bac+5)',
    campuses: ['Gagnoa Garahio (Ex-Collège Les Alliances)'],
    schedule: ['Cours du soir & Samedi'],
    description: "Cursus technologique approfondi couvrant les architectures distribuées, le DevOps, la sécurité des systèmes d'information et la direction de projets informatiques.",
    careerOutcomes: [
      "Architecte Logiciel et Systèmes Cloud",
      "Directeur des Systèmes d'Information (DSI) adjoint",
      "Lead Developer & Responsable Ingénierie",
      "Expert en Cybersécurité et Données"
    ],
    targetAudience: "Titulaires d'une Licence en Informatique ou Génie Logiciel.",
    modules: [
      "Architectures Microservices et Déploiement Cloud",
      "DevOps, CI/CD et Sécurité Logicielle",
      "Big Data, Gouvernance des Données et IA",
      "Management de Projets Informatiques Complexes"
    ],
    keyHighlight: "Frais d'inscription officiel du flyer : 800 000 FCFA / AN."
  },
  {
    id: 'master-marketing-management',
    title: 'Master Professionnel — Marketing, Management et Communication',
    degreeLevel: 'Master Pro',
    category: 'Cycle Supérieur',
    duration: '2 ans après Bac+3 (Bac+5)',
    campuses: ['Gagnoa Garahio (Ex-Collège Les Alliances)'],
    schedule: ['Cours du soir & Samedi'],
    description: "Formation exécutive axée sur le leadership commercial, les stratégies de croissance d'entreprise, la communication corporate et la transformation digitale.",
    careerOutcomes: [
      "Directeur Marketing & Commercial",
      "Directeur de la Communication",
      "Directeur de Marque / Directeur d'Agence",
      "Consultant en Stratégie d'Entreprise"
    ],
    targetAudience: "Titulaires d'une Licence en Marketing, Communication, Gestion ou Économie.",
    modules: [
      "Stratégie de Développement Commercial et Omnicanal",
      "Communication de Crise et Relations Institutionnelles",
      "Business Intelligence et Analyse Prédictive",
      "Leadership et Management du Changement"
    ],
    keyHighlight: "Frais d'inscription officiel du flyer : 800 000 FCFA / AN."
  }
];

export const DEGREE_LEVELS = ['Tous', 'BTS', 'Technique & Pro', 'Licence Pro', 'Master Pro'] as const;
