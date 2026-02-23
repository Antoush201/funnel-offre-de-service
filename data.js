export const QUESTIONS = [
  {
    n: 'Question 1 sur 5',
    t: 'Combien de transactions fais-tu par année?',
    opts: ['Moins de 20 transactions', 'Entre 20 et 50 transactions', 'Plus de 50 transactions'],
    s: [0, 1, 2],
  },
  {
    n: 'Question 2 sur 5',
    t: "Combien d'heures par semaine tu as pour apprendre et configurer ton CRM?",
    opts: ["Moins de 2 heures — mon agenda est plein", 'Entre 2 et 5 heures', "5 heures et plus — je peux m'investir"],
    s: [2, 1, 0],
  },
  {
    n: 'Question 3 sur 5',
    t: 'Comment tu te décrirais avec les outils numériques?',
    opts: ["Débutant — j'ai besoin d'être guidé", 'Intermédiaire — je me débrouille', "À l'aise — j'apprends rapidement"],
    s: [2, 1, 0],
  },
  {
    n: 'Question 4 sur 5',
    t: "Tu préfères qu'on s'occupe de tout ou apprendre à gérer toi-même?",
    opts: ["Qu'on s'occupe de tout — je veux juste utiliser", 'Un mix — accompagné au début, autonome après', 'Je veux maîtriser le système moi-même'],
    s: [2, 1, 0],
  },
  {
    n: 'Question 5 sur 5',
    t: 'Dans combien de temps tu veux être pleinement opérationnel?',
    opts: ['Le plus vite possible — cette semaine', 'Dans les prochaines semaines', "Je suis pas pressé — je veux bien faire les choses"],
    s: [2, 1, 0],
  },
]

export const PLANS = {
  essentiel: {
    name: 'OLA Essentiel',
    price: '1 500$',
    note: 'installation · + 197$/mois',
    feats: [
      '5 appels de configuration accompagnée',
      'Connexions et intégrations guidées',
      'Priorisation des automatisations pertinentes pour vous',
      'Pipelines personnalisés à votre réalité',
      'Automatisations Centris & ImmoContact',
      'Intégration DuProprio',
      "Accès à l'OLA Academy (vidéos de formation)",
      'Support par message',
      'Application mobile incluse',
      'Automatisations construites selon vos besoins',
      'Gestion contacts, tâches, notes, etc.',
    ],
    tag: 'Idéal pour devenir autonome et maîtriser votre système.',
  },
  signature: {
    name: 'OLA Signature',
    price: '3 000$',
    note: 'installation · + 297$/mois',
    feats: [
      "Configuration complète du système par l'équipe OLA",
      'Automatisations avancées sur mesure',
      "Automatisations de demandes d'informations avancées (axé sur la conversion)",
      'Automatisations de visites liées à ImmoContact',
      "Accès à l'outil de prospection DuProprio",
      'Pipelines & séquences de suivi bâtis pour toi',
      'Support prioritaire — réponse rapide',
      'Gestion des conditions & calendrier de transaction',
      'Accès à OLA Studio',
    ],
    tag: "On s'occupe de tout. Tu te concentres sur les clients.",
  },
  elite: {
    name: 'OLA Élite',
    price: '5 000$',
    note: 'installation · + 497$/mois',
    feats: [
      'Tout ce qui est dans OLA Signature',
      'Landing page complète personnalisée',
      "Centralisation complète de tous vos systèmes d'acquisition",
      'Permissions & rôles avancés',
      'Accompagnement stratégique dédié',
      'Accès prioritaire aux nouvelles fonctions',
      'Support immédiat',
      'Onboarding équipe complet',
    ],
    tag: "Pour les équipes qui dominent leur marché.",
  },
}

export const SUBS = {
  essentiel: "Basé sur vos réponses, vous avez le profil idéal pour OLA Essentiel — autonomie, formation et support inclus pour démarrer en confiance.",
  signature: "Basé sur vos réponses, votre réalité correspond parfaitement à OLA Signature — on configure tout pour vous, vous vous concentrez sur vos clients.",
  elite: "OLA Élite est conçu pour les équipes à fort volume qui veulent dominer leur marché.",
}

export const GHL_WEBHOOK = 'https://services.leadconnectorhq.com/hooks/DL5vmvAkiRP13UUTG58Q/webhook-trigger/9f01410e-e220-44a7-8b0b-1fcbb777f097'
