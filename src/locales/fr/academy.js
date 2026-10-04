// FR twin of src/locales/en/academy.js (/fr/academie). Same shape, same facts and
// sources; see the EN file for where each fact comes from. Graduate stories are a
// translation of the EN seed (Sanity's testimonials are English only).
export default {
  seo: {
    title:
      'Fabrique logicielle native IA, services et académie axée sur les affaires pour la nouvelle ère numérique',
    description:
      'Une école agréée qui enseigne l’IA et la technologie au service des affaires, avec plus de 340 diplômés déjà placés dans des emplois en technologie. Un programme full-stack de 16 semaines sans expérience préalable, et un parcours IA pour les programmeurs.',
  },
  pill: 'CodeBoxx Académie',
  title:
    'Une école agréée qui enseigne l’IA et la technologie au service des affaires. Plus de 340 diplômés, forts d’une nouvelle forme d’intelligence, déjà placés dans des emplois en technologie.',
  applyCta: 'Postuler',
  codi: {
    cta: 'Demander à Codi',
    name: 'Codi',
    role: 'Assistant aux admissions',
    active: 'En ligne',
    close: 'Fermer',
    loading: 'Connexion à Codi…',
    frameTitle: 'Discuter avec Codi, l’assistant aux admissions de CodeBoxx Académie',
    handoff: 'Prêt, ou vous préférez parler à quelqu’un?',
    apply: 'Postuler',
    call: 'Planifier un appel',
  },
  proof: {
    eyebrow: 'Placement',
    fact: 'VideoAmp a embauché sept diplômés de CodeBoxx à temps plein, à 60 000 $ avec avantages sociaux, et c’est l’entreprise qui a demandé des diplômés de CodeBoxx.',
    sourceLabel: 'Tampa Bay Business Journal Inno, semaine du 30 janvier 2026',
    sourceHref:
      'https://www.bizjournals.com/tampabay/news/2026/02/04/inno-newsletter-codeboxx.html',
  },
  director: {
    eyebrow: 'Qui la dirige',
    name: 'Brian Peret',
    role: 'Directeur de l’Académie',
    profileLabel: 'Voir sa conférence TEDx St. Pete',
    profileHref:
      '/fr/blogue/tedx-st-pete-palladium-explores-redefining-education-for-the-next-generation-with-insights-from-b/',
    linkedin: 'https://www.linkedin.com/in/brian-peret-b62636101/',
    linkedinLabel: 'LinkedIn',
  },
  offer: {
    eyebrow: 'L’offre',
    title:
      'Un programme de 16 semaines qui se termine au sein d’une vraie équipe de livraison. Le placement est le critère de sortie, pas un babillard d’emplois.',
    contrast:
      'Eux sélectionnent 50 personnes qui ont déjà bâti quelque chose, à San Francisco, en 2027. Nous partons de zéro, avec ce qui se fait de mieux en IA appliquée. Nous le faisons depuis 2018, et nous pouvons vous donner une date de départ à inscrire à votre agenda.',
  },
  programs: {
    eyebrow: 'Programmes',
    title: 'À qui ils s’adressent, quand ils ont lieu et comment postuler',
    whoLabel: 'Pour qui',
    scheduleLabel: 'Horaire',
    startsLabel: 'Prochain départ',
    tuitionLabel: 'Frais de scolarité',
    items: [
      {
        id: 'fsd',
        title: 'Développeur full-stack natif en IA',
        who: 'Les personnes qui partent de zéro. Aucune expérience en programmation requise.',
        schedule: [
          'Temps plein : 16 semaines, 35 à 40 heures par semaine.',
          'Temps partiel : 32 semaines.',
        ],
        starts: ['2026-09-14', '2026-11-09'],
        noDates: 'Prochaines dates de départ à venir.',
        tuition: '12 000 $',
        apply: 'Postuler au programme full-stack',
      },
      {
        id: 'ai',
        title: 'Technologue IA avancé',
        who: 'Les personnes qui programment déjà. Expérience en programmation et en SQL requise.',
        schedule: ['Temps plein : 12 semaines.', 'Temps partiel : 24 semaines.'],
        startsText: 'Sur demande',
        tuition: '9 800 $',
        apply: 'Postuler au programme IA',
      },
    ],
    price: {
      title: 'Frais de scolarité et dépôt',
      lines: [
        ['Développeur full-stack natif en IA', '12 000 $'],
        ['Technologue IA avancé', '9 800 $'],
      ],
      body: 'Renseignez-vous auprès des admissions sur le dépôt et le calendrier de paiement avant de vous engager.',
      cta: 'Planifier un appel',
      href: 'https://calendly.com/raina-dejute-codeboxx/30min',
    },
    riskFree: {
      title: 'Période sans risque',
      body: 'Les premiers 12 % du programme sont sans risque : si vous partez pendant cette période, votre dépôt vous est remboursé.',
    },
  },
  apply: {
    eyebrow: 'Postuler',
    title: 'L’inscription réserve votre place.',
    body: 'Choisissez votre programme et postulez. Nous vous enverrons ensuite par courriel un lien pour créer votre compte sur le portail étudiant et poursuivre votre admission.',
    portalPrompt: 'Vous avez déjà un compte sur le portail? ',
    portalLabel: 'Se connecter au portail étudiant',
    portalHref: 'https://portal.codeboxx.dev/Identity/Account/Login',
  },
  stories: {
    eyebrow: 'Diplômés',
    title: 'D’où ils viennent. Où ils sont.',
    whereIWas: 'Avant',
    whereIAm: 'Aujourd’hui',
    lead: ['Gabby C.', 'Vanessa P.'],
    seed: [
      {
        photo: '/assets/miachel.avif',
        name: 'Michael P.',
        role: 'Développeur logiciel junior',
        before:
          'Avant CodeBoxx, j’étais chargé de projet en construction CVC commerciale et industrielle. Pendant le programme, on m’a offert de racheter l’entreprise et de continuer à la faire grandir. J’ai décidé de relever le défi!',
        after:
          'Pour moi, CodeBoxx, c’est une équipe de gens passionnés par le domaine qui m’ont aidé à acquérir des connaissances que je n’avais pas, tout en m’amusant. C’est une excellente porte d’entrée dans le monde de la techno!',
      },
      {
        photo: '/assets/colby.avif',
        name: 'Cody C.',
        role: 'Développeur logiciel junior',
        before:
          'Avant CodeBoxx, je travaillais à temps plein en pastorale, à accompagner des hommes en début de rétablissement, et j’y trouvais un profond accomplissement. Mais je voulais aussi lancer une carrière qui me ferait vivre à long terme. CodeBoxx m’a ouvert cette porte et m’a mené de zéro expérience en techno à une carrière dans l’industrie.',
        after:
          'Aujourd’hui, je suis coach chez CodeBoxx : j’accompagne les nouveaux étudiants tout en poursuivant mon travail pastoral. Pour moi, CodeBoxx est bien plus qu’un programme de formation : c’est le pont entre ma vocation et ma stabilité, et un endroit où je peux redonner au suivant.',
      },
      {
        photo: '/assets/gavriel.avif',
        name: 'Gavriel R.',
        role: 'Développeur logiciel junior',
        before:
          'J’ai quitté le Royaume-Uni pour la Floride après avoir abandonné l’université. Je gérais un camion de cuisine de rue tout en étudiant à temps partiel.',
        after:
          'Je suis devenu coach spécialisé en IA, en apprentissage automatique et en science des données, et je suis maintenant ingénieur logiciel principal chez Journey Viral, une jeune entreprise en pleine croissance, où je développe des intégrations d’IA, l’infrastructure GCloud, le frontal en React et le dorsal en Python et PostgreSQL.\n\nCodeBoxx m’a offert un milieu souple et bienveillant pour perfectionner mon métier, me dépasser et repousser mes limites. J’y ai beaucoup appris sur le leadership en techno.',
      },
      {
        photo: '/assets/william.avif',
        name: 'William M.',
        role: 'Développeur logiciel junior',
        before:
          'Avant CodeBoxx, je travaillais en construction. De tout : fabriquer et réparer des palettes, malaxer, couler et finir du béton pour des tranchées et des couvercles, conduire des chariots élévateurs et des chargeuses.',
        after:
          'Aujourd’hui, je suis coach dans le même programme full-stack que j’ai suivi. J’anime un cours de littératie en IA grâce aux partenariats de CodeBoxx. Je continue d’aiguiser mes compétences en développement sur divers projets. CodeBoxx est devenu pour moi un mode de vie. Ça a complètement changé ma vie! Fini le travail manuel qui m’usait le corps et donnait peu de sens à ma vie. CodeBoxx est devenu ma deuxième famille.',
      },
      {
        photo: '/assets/gaby.avif',
        name: 'Gabby C.',
        role: 'Développeuse logicielle junior',
        before:
          'J’ai été directrice générale d’un bar à thé du centre-ville de St. Pete de 2019 à 2023. Ne voyant aucune possibilité d’avancement dans l’entreprise et épuisée par le service à la clientèle, j’ai décidé de suivre le cours de développement full-stack de CodeBoxx.',
        after:
          'Tout de suite après mon diplôme, j’ai reçu une offre d’emploi de RevStar (mon premier choix).\n\nEn 4 mois, j’ai suivi un cours de programmation de 16 semaines, je me suis réorientée vers le développement logiciel et j’ai décroché l’emploi de mes rêves!\n\nCe changement de carrière a fait de moi la personne que je suis fière d’être aujourd’hui.',
      },
      {
        photo: '/assets/tim.avif',
        name: 'Tim W.',
        role: 'Développeur logiciel junior',
        before:
          'J’ai fait des emplois physiques toute ma vie. J’ai commencé comme soudeur aux quais d’expédition tout de suite après le secondaire. Presque 10 ans et plusieurs emplois plus tard, j’ai compris que je ne pouvais pas continuer comme ça.',
        after:
          'J’ai découvert CodeBoxx et réalisé que ma passion pour la construction pouvait s’appliquer à la programmation. Aujourd’hui, je poursuis mon apprentissage comme développeur full-stack et je fais partie d’une belle communauté de programmeurs qui collaborent et grandissent ensemble.',
      },
      {
        photo: '/assets/vanessa.avif',
        name: 'Vanessa P.',
        role: 'Développeuse d’applications iOS',
        before:
          'J’ai obtenu mon diplôme en arts culinaires et j’ai fait de la pâtisserie pendant environ 10 ans. Quand j’ai voulu changer de domaine, CodeBoxx était en tête de ma liste.',
        after:
          'Mon premier placement après CodeBoxx a été chez Bond, une entreprise de mode. Aujourd’hui, je suis développeuse mobile chez eBay. J’ai maintenant plein d’options, contrairement au secteur des services. Je suis très reconnaissante d’avoir choisi CodeBoxx.',
      },
      {
        photo: '/assets/abdul.avif',
        name: 'Abdul R.',
        role: 'Développeur logiciel',
        before:
          'J’ai commencé à travailler chez McDonald’s à 16 ans. Puis je suis passé aux petits boulots de plateformes : Uber, GrubHub, DoorDash, nommez-les. J’échangeais mon temps contre de l’argent, de 8 h à minuit. Je savais que quelque chose devait changer.',
        after:
          'Je suis rendu à une autre étape de ma carrière. Et c’est le mot clé : carrière. Ce n’est plus le travail à la pointeuse d’avant. C’est une carrière dans laquelle je peux évoluer en vieillissant.',
      },
    ],
  },
  employers: {
    eyebrow: 'Employeurs',
    title: 'Partenaires de placement et employeurs',
    partnerTag: 'Partenaire de placement',
    items: [
      [
        'VideoAmp',
        'A demandé des diplômés de CodeBoxx et en a embauché sept à temps plein.',
        'partner',
      ],
      ['Industrielle Alliance', 'Embauche des diplômés de CodeBoxx.', 'partner'],
      ['Coveo', 'A embauché des diplômés de CodeBoxx.'],
      ['TD Synnex', 'A embauché des diplômés de CodeBoxx.'],
    ],
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Vos questions, nos réponses',
    items: [
      {
        q: 'Ai-je besoin d’expérience préalable?',
        a: [
          'Pas pour le programme full-stack : il part de zéro.',
          'Le parcours Technologue IA avancé exige une expérience en programmation et en SQL.',
        ],
      },
      {
        q: 'Combien de temps durent les programmes?',
        a: [
          'Full-stack : 16 semaines à temps plein, à raison de 35 à 40 heures par semaine, ou 32 semaines à temps partiel.',
          'Technologue IA avancé : 12 semaines à temps plein ou 24 semaines à temps partiel.',
        ],
      },
      {
        q: 'Combien ça coûte?',
        a: [
          'Développeur full-stack natif en IA : 12 000 $. Technologue IA avancé : 9 800 $.',
          [
            'Des paiements échelonnés et du financement local peuvent couvrir tout ou partie de ces frais; voir ',
            { label: 'Financement', href: '/fr/academie/#funding' },
            '.',
          ],
        ],
      },
      {
        q: 'Quand commence la prochaine cohorte?',
        a: [
          [
            'Les cohortes full-stack commencent à dates fixes, indiquées sous ',
            { label: 'Programmes', href: '/fr/academie/#programs' },
            '. Les cohortes Technologue IA avancé commencent sur demande.',
          ],
        ],
      },
      {
        q: 'Comment postuler?',
        a: [
          [
            'L’inscription réserve votre place. ',
            { label: 'Postulez ici', href: '/fr/academie/#apply' },
            ', puis créez votre compte sur le portail étudiant à partir du lien que nous vous envoyons par courriel pour poursuivre votre admission.',
          ],
        ],
      },
      {
        q: 'Y a-t-il une période sans risque?',
        a: [
          'Oui. Les premiers 12 % du programme sont sans risque : si vous partez pendant cette période, votre dépôt vous est remboursé.',
        ],
      },
      {
        q: 'Que font les étudiants de CodeBoxx après leur diplôme?',
        a: [
          'Pendant le programme, nous offrons un accompagnement de carrière et vous guidons dans la création de votre CV, de vos profils LinkedIn et GitHub, et dans la préparation aux entrevues, pour que vous puissiez commencer votre recherche d’emploi en toute confiance dès la fin du programme (ou même avant!).',
          'Et avec CodeBoxx pour la vie, vous avez accès à vie à une communauté d’employeurs, de coachs et d’anciens pour obtenir des stratégies de carrière, des conseils sur des projets techniques complexes et plus encore.',
        ],
      },
    ],
  },
  funding: {
    eyebrow: 'Financement',
    title: 'Comment le financer',
    items: [
      {
        title: 'MiaShare',
        body: 'Paiements échelonnés à 0 % d’intérêt, sans effet sur votre cote de crédit. Étudiants établis aux États-Unis seulement.',
        href: 'https://codeboxxtechnology.mia-share.com/apply/programs',
        cta: 'Faire une demande avec MiaShare',
      },
      {
        title: 'Desjardins',
        body: 'Financement pour les résidents du Canada.',
      },
      {
        title: 'Microcrédits Windmill',
        body: 'Prêts de carrière abordables pour les nouveaux arrivants admissibles.',
      },
      {
        title: 'CareerSource Pinellas',
        body: 'Résidents du comté de Pinellas, en Floride : le financement local de CareerSource peut couvrir tout ou partie de vos frais de scolarité.',
        href: '/fr/residents-pinellas/',
        cta: 'Résidents de Pinellas',
      },
    ],
    more: 'Voir toutes les options de financement',
    moreHref: '/fr/financement/',
  },
};
