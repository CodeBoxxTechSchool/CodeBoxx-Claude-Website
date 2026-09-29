// FR twin of src/locales/en/forgeDeep.js — see that file for the rationale.
export default {
  seo: {
    title: 'Approfondir — L’usine logicielle IA-native, en chiffres',
    description:
      'Sept plateformes livrées par l’usine logicielle CodeBoxx : 5,2× plus vite et 78 % moins cher qu’une équipe traditionnelle, 14,9 M$ économisés. Bâtissez l’analyse de rentabilité de votre CrewKit Forge 20.',
  },
  back: '← CrewKit Forge 20',
  hero: {
    pill: 'Approfondir · Les preuves',
    title: 'L’usine a déjà livré. Voici les reçus.',
    lede: 'Avant d’être un appareil, l’usine logicielle IA-native de CodeBoxx a livré de vraies plateformes pour de vrais clients. Sept d’entre elles, projet par projet, comparées à ce que le même travail coûtait à une équipe traditionnelle en 2022.',
    stats: [
      ['5,2×', 'plus vite', 'Moyenne des quatre études de référence'],
      ['78 %', 'moins cher', 'Qu’une équipe traditionnelle, mêmes études'],
      ['14,9 M$', 'économisés', 'Sur l’ensemble des sept plateformes'],
    ],
    cta: 'Bâtir votre analyse de rentabilité',
  },
  evidence: {
    eyebrow: 'Ce que l’usine a fait économiser',
    title: 'Sept plateformes, un même constat.',
    lede: 'Chaque barre représente ce que le travail aurait coûté, ou duré, avec une équipe traditionnelle en 2022. La partie bleue est ce dont l’usine a réellement eu besoin. Sélectionnez une plateforme pour voir ce qui a été construit.',
    metricLabel: 'Comparer',
    metrics: { cost: 'Coût de construction', time: 'Délai de livraison' },
    filterLabel: 'Afficher',
    filters: {
      all: 'Les sept',
      benchmark: 'Études de référence',
      additional: 'Preuves additionnelles',
    },
    legend: { traditional: 'Équipe traditionnelle, 2022', factory: 'Usine CodeBoxx' },
    tableToggle: 'Voir en tableau',
    chartToggle: 'Voir en graphique',
    table: {
      platform: 'Plateforme',
      tradTime: 'Délai traditionnel',
      factTime: 'Délai usine',
      tradCost: 'Coût traditionnel',
      factCost: 'Coût usine',
      gain: 'Plus vite / moins cher',
    },
    months: 'mois',
    days: 'jours',
    faster: 'plus vite',
    cheaper: 'moins cher',
    groups: { benchmark: 'Étude de référence', additional: 'Preuve additionnelle' },
    detail: {
      need: 'Le besoin',
      delivered: 'Ce que l’usine a livré',
      stack: 'Technologies',
      basis: 'Base',
    },
    totals: {
      title: 'Sur les sept plateformes',
      traditional: 'Coût traditionnel',
      factory: 'Livré par l’usine',
      saved: 'Économisés',
      reduction: 'de réduction des coûts',
      calendar: 'Calendrier cumulé',
    },
    note: 'Montants dans la devise de chaque projet (CAD, ou USD pour deux d’entre eux), présentés à parité. Les fourchettes utilisent leur point milieu.',
  },
  cases: {
    travel: {
      name: 'Plateforme d’opérations pour agence de voyages',
      kind: 'Plateforme de réservation et de personnalisation de voyages',
      need: 'Un modèle de réservation assisté par agent et des outils de voyagiste traditionnels, sans achat direct en ligne ni personnalisation du séjour.',
      delivered: [
        'Site de réservation client pour forfaits vol + hôtel',
        'Module de personnalisation : durée, hôtel, activités, location de véhicule',
        'Couche back-end d’inventaire, de tarification et de traitement des réservations',
        'Trois phases additionnelles livrées au cours des 12 mois suivants',
      ],
      basis:
        'Délai des deux premières phases; coût du mandat complet. Comparaison traditionnelle estimée.',
    },
    construction: {
      name: 'Plateforme de gestion de projets de construction',
      kind: 'Hub intégré de gestion de projets pour un groupe de construction',
      need: 'Des opérations réparties entre six outils distincts, sans tableau de bord par projet ni gestion de tâches unifiée.',
      delivered: [
        'Lac de données et intégrations aux outils existants, Microsoft Graph, contrôle d’accès par rôles',
        'Gestion de tâches Kanban et liste, centre de courriels transactionnels, tableau de bord budgétaire',
        'Validation d’équipement et billetterie interne',
        'Un agent conversationnel IA doté de son propre serveur MCP',
      ],
      basis:
        'Contrat à prix fixe réel plus contingence utilisée. Comparaison traditionnelle estimée.',
    },
    warehouse: {
      name: 'Système de gestion d’entrepôt spécialisé',
      kind: 'WMS sur mesure pour une place de marché d’objets de collection, conçu pour environ un milliard d’articles',
      need: 'Un système d’entrepôt pour un inventaire qu’aucun WMS du marché n’a été conçu pour gérer.',
      delivered: [
        'Configurateur d’emplacements, moteur de tâches et registre d’appareils',
        'Authentification unique et MFA d’entreprise, contrôle d’accès par rôles',
        'Fichier maître des articles synchronisé avec le catalogue de la place de marché',
        'Réception, rangement, inventaire, prélèvement optimisé, emballage et expédition',
      ],
      basis:
        'Plafond réel du bon de commande. Un grand fournisseur de WMS a soumissionné environ 5,5 M$ US et plus de 18 mois pour la même portée.',
    },
    camp: {
      name: 'Plateforme de gestion de camp de jour',
      kind: 'Inscriptions, dossiers de santé, rôles du personnel et paiements pour un camp de jour',
      need: 'Les inscriptions, dossiers de santé, rôles du personnel, paiements et communications aux parents vivaient dans des tableurs et des courriels.',
      delivered: [
        'Portail avec profils d’enfants liés aux dossiers de santé et à l’historique des échanges',
        'Hiérarchie de rôles pour animateurs responsables et de soutien',
        'SMS validés et rappels de paiement par QuickBooks',
        'Suivi en temps réel des inscriptions et des places, jusqu’à 150 enfants',
      ],
      basis:
        'Réel. Des spécifications à la première transaction en 3 jours, contre 6 à 9 mois et 15 à 30 k$ pour une agence en 2022.',
    },
    memory: {
      name: 'Agent IA de préservation de souvenirs',
      kind: 'Agent IA et applications multiplateformes pour préserver des souvenirs personnels',
      need: 'Un compagnon IA qui fonctionne sur ordinateur et mobile sans livrer de clés d’API sur les appareils.',
      delivered: [
        'Moteur d’agent agnostique au modèle, avec un serveur MCP exposant 10 catégories d’outils',
        'Applications de bureau macOS et Windows : messagerie, système de design, authentification',
        'Refonte visuelle complète de l’application mobile',
        'Inférence sur l’appareil avec un modèle Gemma local',
      ],
      basis:
        'Coût réel de l’usine avec 3 ressources IA-natives. Traditionnel : 75 mois-personnes estimés.',
    },
    military: {
      name: 'Application d’avantages militaires',
      kind: 'Application iOS native et web de calcul des avantages militaires',
      need: 'Quitter un back-end hébergé, livrer une application iOS native et la monétiser de bout en bout.',
      delivered: [
        'Migration vers PostgreSQL auto-hébergé avec authentification JWT sur mesure',
        'Application iOS native en Swift avec calculateurs financiers, TSP et VA',
        'Données de rabais : 1 831 fiches de parcs d’État, 194 bureaux d’anciens combattants et plus',
        'Abonnements unifiés entre l’App Store et le web',
      ],
      basis:
        '607 commits par 3 contributeurs, documentés par affidavit. Traditionnel : 41 mois-personnes estimés.',
    },
    catalog: {
      name: 'Catalog Crafter',
      kind: 'SaaS multi-locataire de catalogues produits, produit de CodeBoxx',
      need: 'Mener un nouveau produit SaaS de l’idée à son premier client partenaire de conception.',
      delivered: [
        'SaaS multi-locataire à trois paliers : Starter, Professional, Enterprise',
        'Moteur de gabarits de catalogue réutilisable et expérience utilisateur commune',
        'Stockage et sauvegardes compatibles S3, domaines personnalisés',
        'Premier déploiement chez un partenaire de conception',
      ],
      basis:
        'Produit interne : 6 mois-personnes réels contre 108 estimés, mesurés jusqu’au premier client.',
    },
  },
  method: {
    eyebrow: 'Comment lire ces chiffres',
    title: 'Ce qui est mesuré, et ce qui est estimé.',
    items: [
      [
        'Réel',
        'Montants facturés, dates, effectifs, commits et portée livrée, tirés des contrats, bons de commande, rapports de livraison et affidavits.',
      ],
      [
        'Estimé',
        'L’équipe, le délai et le coût traditionnels de 2022, fondés sur les taux journaliers et les cycles observés sur des mandats comparables de 2019 à 2023. Exception : pour le système d’entrepôt, la comparaison est une vraie soumission de fournisseur.',
      ],
      [
        'Référence ou additionnelle',
        'Le 5,2× et le 78 % font la moyenne des quatre études de référence seulement. Les autres plateformes sont des preuves additionnelles, non comptées dans cette moyenne.',
      ],
    ],
  },
  builder: {
    eyebrow: 'Votre analyse de rentabilité',
    title: 'Faites passer votre propre feuille de route par l’usine.',
    lede: 'Décrivez un projet comme vous le doteriez aujourd’hui. L’outil applique les gains que l’usine a réellement démontrés et les traduit en chiffres à présenter à votre direction.',
    inputs: {
      team: 'Taille de l’équipe traditionnelle',
      teamUnitSingular: 'personne',
      teamUnitPlural: 'personnes',
      rate: 'Coût complet par personne, par mois',
      months: 'Durée prévue avec cette équipe',
      monthsUnit: 'mois',
      value: 'Valeur de la mise en service, par mois',
      valueHint: 'Revenus gagnés ou coûts évités une fois livré. Laissez à 0 pour l’ignorer.',
      projects: 'Projets semblables par année',
    },
    scenarioLabel: 'Appliquer les gains de',
    scenarios: {
      conservative: [
        'Prudent',
        'Notre étude de référence la plus faible : 2,0× plus vite, 62 % moins cher',
      ],
      benchmark: [
        'Référence',
        'Moyenne du mémo d’investissement : 5,2× plus vite, 78 % moins cher',
      ],
      portfolio: [
        'Portefeuille de sept plateformes',
        'Les sept combinées : 4,3× plus vite, 79 % moins cher',
      ],
    },
    results: {
      traditional: 'Équipe traditionnelle',
      factory: 'Avec l’usine',
      cost: 'Coût de construction',
      time: 'Délai de livraison',
      saved: 'Coût de construction économisé',
      monthsSaved: 'Mois gagnés sur la mise en marché',
      earlyValue: 'Valeur d’une livraison plus hâtive',
      perYear: 'Par année, à ce rythme',
      monthsUnit: 'mois',
    },
    summaryTitle: 'Votre analyse de rentabilité',
    summary:
      'Une équipe de {team} {teamUnit} pendant {months} mois coûte environ {tradCost}. En appliquant les résultats « {scenario} », l’usine livre la même portée en environ {factMonths} mois pour environ {factCost} : {saved} économisés et {monthsSaved} mois gagnés sur la mise en marché{valuePart}. À {projects} projet(s) par année, cela représente {yearSaved} de coûts de construction évités chaque année.',
    summaryValue: ', soit environ {earlyValue} de valeur livrée plus tôt',
    copy: 'Copier l’analyse',
    copied: 'Copiée dans le presse-papiers',
    print: 'Imprimer ou enregistrer en PDF',
    disclaimer:
      'Les projections appliquent des multiples obtenus par l’usine lors de livraisons passées. Elles ne constituent ni une soumission ni une garantie; vos résultats dépendent de la portée et du contexte. Le prix de l’appareil est établi dans votre configuration.',
  },
  bridge: {
    eyebrow: 'Des preuves à vos locaux',
    title: 'La même usine, dans un mètre cube qui vous appartient.',
    body: 'Chaque résultat de cette page vient de CrewKit orchestrant une livraison IA-native. Le CrewKit Forge 20 installe cette usine chez vous : local d’abord, entièrement à vous, gouvernée, avec votre code et vos données qui restent dans l’édifice.',
    primary: 'Réservez votre usine',
    secondary: 'Retour au CrewKit Forge 20',
  },
};
