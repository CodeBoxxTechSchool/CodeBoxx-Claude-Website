// FR twin of src/locales/en/aiDoneRight.js — see that file for sources. The
// standard itself (the PDF) is published in English only; quoted wording is
// translated here and flagged as such.
export default {
  seo: {
    title: '#AIDoneRight — Une norme d’intelligence artificielle centrée sur l’humain',
    description:
      'AI Done Right 2.0 est une norme ouverte, centrée sur l’humain, pour utiliser l’IA avec un but et une responsabilité clairs : 13 engagements vérifiables, un engagement public et des lignes rouges. Lisez-la et téléchargez la norme complète.',
  },
  pdf: {
    href: '/docs/AI-Done-Right-v2.0.pdf',
    file: 'AI-Done-Right-v2.0.pdf',
    meta: 'PDF · 59 pages · en anglais',
  },
  hero: {
    tag: '#AIDoneRight',
    title: 'L’intelligence artificielle, avec un humain qui en répond.',
    lede: 'AI Done Right est une norme ouverte pour utiliser l’IA avec un but clair, une personne nommée qui en est responsable, et des preuves que n’importe qui à l’extérieur de l’entreprise peut vérifier. Elle a été écrite pour toutes celles et ceux qui ont de bonnes raisons de s’inquiéter de l’IA, et qui veulent plus que des promesses.',
    download: 'Télécharger la norme',
    explore: 'La lire en langage clair',
    status:
      'Version 2.0, « The Verifiable Edition » · Publiée le 13 août 2026 · Proposée pour consultation publique',
  },
  worry: {
    eyebrow: 'Si l’IA vous inquiète',
    title: 'C’est que vous êtes attentif.',
    body: 'Le scepticisme envers l’IA n’est pas de l’ignorance. C’est une réaction raisonnable à ce que les gens ont vu. AI Done Right part des mêmes constats que les sceptiques, et en fait des règles.',
    stats: [
      [
        '39 %',
        'des Américains disent que l’IA fait plus de mal que de bien, contre 31 % auparavant.',
        'Sondage publié en juillet 2026',
      ],
      [
        '27 %',
        'font au moins un peu confiance aux entreprises pour utiliser l’IA de façon responsable.',
        'Même sondage, contre 31 % auparavant',
      ],
      [
        '84 %',
        'des DSI n’avaient aucun processus formel pour vérifier l’exactitude de leur IA.',
        'Gartner, octobre 2025',
      ],
      [
        '1 800+',
        'causes judiciaires dans le monde impliquaient des citations juridiques inventées par l’IA.',
        'Répertoire universitaire, août 2026',
      ],
    ],
    source:
      'Chiffres tels que cités dans AI Done Right 2.0, partie 1, avec les attributions qu’elle donne.',
  },
  idea: {
    eyebrow: 'L’idée en une phrase',
    quote: 'Un principe que l’on ne peut pas prouver n’est qu’une préférence.',
    body: [
      'La première version d’AI Done Right, en 2025, était un engagement : une liste de bonnes intentions. Un engagement ne se vérifie pas, donc il ne peut pas échouer.',
      'La version 2.0 conserve chacun de ces engagements et y rattache un document qui le prouve : qui est responsable, ce que l’IA a le droit de faire, d’où elle vient, ce qu’elle conserve et comment on l’arrête. Le fond moral n’a pas changé. Ce qui est nouveau, c’est que quelqu’un d’extérieur à l’entreprise peut vérifier.',
    ],
  },
  fears: {
    eyebrow: 'Partez de votre inquiétude',
    title: 'Qu’est-ce qui vous inquiète le plus?',
    lede: 'Choisissez une inquiétude pour voir quelles parties de la norme y répondent.',
    all: 'Afficher les 13',
    items: {
      nobody: ['Personne n’est responsable quand l’IA se trompe', [1, 13]],
      stop: ['Personne ne peut l’arrêter', [8, 10]],
      data: ['Mes données entraînent l’IA de quelqu’un d’autre', [5, 7, 6]],
      madeup: ['L’IA invente des choses', [12, 2]],
      bot: ['Je ne saurai pas que je parle à une machine', [11, 3]],
      unfair: ['Elle traitera les gens injustement', [3]],
      hidden: ['Les entreprises ne savent même pas quelle IA elles utilisent', [4]],
      hack: ['On peut la tromper ou la pirater', [9, 8]],
    },
  },
  articles: {
    eyebrow: 'Les treize engagements',
    title: 'Quatre questions auxquelles tout système d’IA doit répondre.',
    lede: 'La norme regroupe ses 13 articles sous quatre questions simples. Chaque article énonce une conviction, les règles qui en découlent et les preuves qui la démontrent.',
    pillarLabel: 'Groupe',
    principleLabel: 'Dans les mots de la norme (traduction)',
    meansLabel: 'Ce que cela veut dire pour les gens',
    pillars: {
      accountability: ['Responsabilité', 'Qui en répond?'],
      provenance: ['Provenance', 'D’où vient-elle?'],
      control: ['Contrôle', 'Que peut-elle faire?'],
      trust: ['Confiance', 'Comment le prouve-t-on?'],
    },
    list: [
      {
        n: 1,
        pillar: 'accountability',
        title: 'Responsabilité humaine',
        principle:
          'Aucun système d’IA n’est jamais aux commandes. Il y a toujours un humain, une équipe ou une institution clairement identifiés, responsables des résultats, des décisions et des préjudices.',
        means:
          'Chaque système d’IA a une personne nommée qui en répond, et qui a le pouvoir de l’arrêter.',
      },
      {
        n: 2,
        pillar: 'accountability',
        title: 'But déclaré et valeur',
        principle:
          'Nous ne livrons pas parce que nous le pouvons. Nous livrons quand nous comprenons pourquoi nous le devrions, et nous disons d’avance à quoi le système ne doit pas servir.',
        means:
          'Avant de le bâtir, l’entreprise écrit à quoi sert l’IA, à quoi elle ne doit jamais servir, et quel résultat l’amènerait à l’arrêter.',
      },
      {
        n: 3,
        pillar: 'accountability',
        title: 'Dignité humaine et impact équitable',
        principle:
          'Si un raccourci est contraire à l’éthique, ce n’est pas un raccourci. C’est une responsabilité.',
        means:
          'Pas d’IA qui se fait passer pour un humain, pas d’interfaces manipulatrices, des tests d’équité entre les groupes, et une vraie personne à qui faire appel quand une décision vous touche.',
      },
      {
        n: 4,
        pillar: 'accountability',
        title: 'Inventaire et nomenclature',
        principle: 'On ne peut pas gouverner ce que l’on n’a pas recensé.',
        means:
          'L’entreprise tient la liste complète de chaque système d’IA qu’elle exploite et de ses composantes. Rien n’atteint la clientèle sans y figurer.',
      },
      {
        n: 5,
        pillar: 'provenance',
        title: 'Provenance des données et droits',
        principle:
          'Nous n’utilisons pas de données que nous n’avons pas le droit d’utiliser, et nous ne faisons pas des données de nos clients le modèle de quelqu’un d’autre.',
        means:
          'Vos données ne servent pas à entraîner une IA sans votre permission écrite et distincte, et l’entreprise sait d’où viennent ses modèles.',
      },
      {
        n: 6,
        pillar: 'provenance',
        title: 'Garde, conservation et archives',
        principle:
          'Les requêtes et les réponses sont des archives. Nous décidons avant qu’on nous les demande.',
        means:
          'L’entreprise sait exactement ce que l’IA conserve, combien de temps et qui peut le lire, au lieu de s’en remettre au réglage par défaut d’un fournisseur.',
      },
      {
        n: 7,
        pillar: 'provenance',
        title: 'Chaîne d’approvisionnement',
        principle: 'Les obligations que nous acceptons, nous les imposons.',
        means:
          'Chaque entreprise externe qui touche à vos données par l’IA est nommée, liée par contrat et vérifiée, pas seulement « pour améliorer ses services ».',
      },
      {
        n: 8,
        pillar: 'control',
        title: 'Autonomie encadrée',
        principle:
          'Un système d’IA ne peut agir que dans des limites fixées d’avance par un humain, et on peut toujours l’arrêter. Pouvoir n’est pas permission.',
        means:
          'L’IA ne peut rien envoyer, supprimer, payer, publier ou modifier d’important sans l’approbation d’un humain, et il existe un moyen testé de l’arrêter.',
      },
      {
        n: 9,
        pillar: 'control',
        title: 'Sécurité dès la conception',
        principle: 'La sécurité fait partie de la sûreté.',
        means:
          'Les systèmes sont conçus en supposant que l’IA peut être trompée, pour que rien d’important ne casse quand elle l’est.',
      },
      {
        n: 10,
        pillar: 'control',
        title: 'Maîtrise des coûts',
        principle:
          'Un système d’IA qui peut dépenser sans limite est un risque de disponibilité et un risque financier.',
        means:
          'Des limites automatiques stoppent les dépenses et les boucles incontrôlées avant que quelqu’un ait à s’en apercevoir.',
      },
      {
        n: 11,
        pillar: 'trust',
        title: 'Transparence et divulgation',
        principle:
          'L’IA ne devrait pas être une boîte noire à laquelle on demande simplement de faire confiance.',
        means:
          'On vous dit quand vous avez affaire à une IA, les contenus générés sont marqués, et les limites sont divulguées d’emblée.',
      },
      {
        n: 12,
        pillar: 'trust',
        title: 'Évaluation et surveillance',
        principle:
          'Des modèles puissants ne remplacent pas la rigueur d’ingénierie. Le déploiement est le début de la responsabilité.',
        means:
          'L’exactitude est mesurée régulièrement après le lancement, et les faits, chiffres et citations sont vérifiés par une personne avant de vous parvenir.',
      },
      {
        n: 13,
        pillar: 'trust',
        title: 'Assurance indépendante',
        principle:
          'Nous sommes prêts à être vérifiés. Une conformité que nous seuls pouvons vérifier n’est pas une conformité; c’est de la confiance en soi.',
        means:
          'Les preuves sont conservées, et montrées à des gens qui ne travaillent pas pour l’entreprise.',
      },
    ],
  },
  pledge: {
    eyebrow: 'L’engagement',
    title: 'Ce qu’affirment publiquement les responsables d’un système labellisé.',
    lines: [
      'Nous savons exactement à quoi sert cette IA, à quoi elle ne doit jamais servir, et qui en est responsable, nommément.',
      'Nous savons d’où viennent ses modèles, sur quoi ils ont été entraînés et sur quelle base légale, et les données de nos clients n’y sont pas.',
      'Nous connaissons chaque système qu’elle peut atteindre et chaque action qu’elle peut poser, parce que nous les avons recensés, et elle ne peut poser aucune action importante sans un humain.',
      'Nous pouvons l’arrêter, nous avons testé que nous pouvons l’arrêter, et nous savons combien de temps cela prend.',
      'Nous savons ce qu’elle conserve, combien de temps, qui peut le lire, et comment nous le produisons quand on l’exige.',
      'Nous mesurons si elle est toujours exacte, nous consignons ce que nous mesurons, et nous avons convenu d’avance du résultat qui nous ferait l’arrêter.',
      'Nous disons aux gens qu’ils lui parlent, nous marquons ce qu’elle génère, et nous ne nous cachons pas derrière un avertissement.',
      'Nous avons écrit ce que nous ne savons pas encore faire, avec une date.',
      'Et nous avons montré tout cela à quelqu’un qui ne travaille pas pour nous.',
    ],
    close:
      'AI Done Right demande de la responsabilité, pas la perfection. C’est la promesse que derrière chaque système portant ce label, il y a des humains qui tiennent assez à leur travail pour s’en porter garants.',
  },
  redlines: {
    eyebrow: 'Les lignes rouges',
    title: 'Une seule de ces situations exclut le label #AIDoneRight.',
    lede: 'Peu importe la qualité du reste.',
    items: [
      'Entraîner une IA sur les données des clients sans leur permission expresse et distincte.',
      'Une IA capable de poser une action irréversible ou publique sans l’approbation d’un humain.',
      'Aucun moyen testé d’arrêter le système.',
      'Revendiquer une certification que l’organisation ne détient pas.',
      'Présenter une IA comme un être humain, ou comme un acteur distinct de l’entreprise.',
      'Savoir qu’un système traite injustement un groupe protégé, et ne rien faire.',
      'Ne pas savoir combien de temps le système conserve ce que les gens y saisissent.',
    ],
  },
  ladder: {
    eyebrow: 'L’honnêteté plutôt que la perfection',
    title: 'La norme récompense la franchise sur les lacunes.',
    lede: 'Chaque engagement est évalué sur quatre niveaux. Le label exige au moins le niveau 2 partout, et le niveau 3 sur les quatre engagements les plus critiques. La plupart des organisations ne s’y qualifieront pas dès le départ, et la norme dit que la bonne réponse est de publier l’écart plutôt que de faire semblant.',
    levels: [
      [
        'N3',
        'Gouverné',
        'Imposé par un contrôle technique, vérifié automatiquement et revu de façon indépendante.',
      ],
      [
        'N2',
        'Géré',
        'Documenté et appliqué avec constance, mais dépendant du respect du processus par les gens.',
      ],
      [
        'N1',
        'Documenté',
        'Une politique existe, mais elle est appliquée inégalement et les preuves sont reconstituées sur demande.',
      ],
      ['N0', 'Improvisé', 'Aucune position établie. La réponse viendrait de mémoire.'],
    ],
    quote:
      'Une organisation qui se note à la baisse à deux endroits et à la hausse à dix est crue. Une organisation qui se note au plus haut partout est réexaminée.',
  },
  press: {
    eyebrow: 'Pour les journalistes',
    title: 'Les faits, au même endroit.',
    facts: [
      [
        'Ce que c’est',
        'Une norme ouverte et volontaire pour une IA dont des humains répondent, dans les produits et plateformes numériques : 13 articles, une échelle de conformité à quatre niveaux et un label public.',
      ],
      [
        'Auteur',
        'Nicolas Genest, fondateur et président-directeur général de CodeBoxx Technology Corporation.',
      ],
      [
        'Version et statut',
        'Version 2.0, « The Verifiable Edition », publiée le 13 août 2026 comme ébauche soumise à consultation. Elle remplace la version 1.0 (2025).',
      ],
      [
        'Pour qui',
        'Toute organisation qui conçoit ou utilise une IA ayant un effet sur des personnes, et les agents d’IA qui écrivent désormais des logiciels en son nom.',
      ],
      [
        'Lien avec la loi',
        'Ce n’est ni une loi ni une certification. Elle se rattache à ISO/IEC 42001, au cadre de gestion des risques de l’IA du NIST, à la loi européenne sur l’IA et aux listes de menaces OWASP, et interdit expressément de présenter ce rattachement comme une certification.',
      ],
      ['Coût', 'Gratuite à lire, à adopter et à transformer en politique d’entreprise.'],
      ['Mot-clic', '#AIDoneRight'],
    ],
    quotesTitle: 'Citations tirées de la norme (traduction)',
    quotes: [
      'Un principe que l’on ne peut pas prouver n’est qu’une préférence.',
      'La responsabilité ne peut pas être déléguée à un modèle.',
      'Pouvoir n’est pas permission.',
      'Un label auquel rien ne peut échouer n’est qu’une décoration.',
      'Une éthique qui ne peut pas être vérifiée ne protège personne d’autre que ceux qui la professent.',
    ],
    contact: 'Demandes des médias',
    contactEmail: 'info@codeboxx.com',
  },
  adopt: {
    eyebrow: 'L’adopter',
    title: 'Quatre-vingt-dix jours pour passer des bonnes intentions aux preuves.',
    lede: 'La norme se termine par un plan concret pour toute organisation qui part de zéro.',
    phases: [
      [
        'Jours 1 à 15',
        'Établir les faits',
        'Recenser chaque système d’IA réellement utilisé, ce qu’il conserve et combien de temps, et chaque accès qu’il détient.',
      ],
      [
        'Jours 16 à 45',
        'Combler les écarts urgents',
        'Écrire et tester le bouton d’arrêt, exiger une approbation humaine pour les actions risquées, et nommer un responsable pour chaque système.',
      ],
      [
        'Jours 46 à 75',
        'Prendre l’habitude des preuves',
        'Mesurer l’exactitude, recenser chaque fournisseur externe et mener un premier test de manipulation de l’IA.',
      ],
      [
        'Jours 76 à 90',
        'Rendre le tout vérifiable',
        'S’évaluer honnêtement sur les 13 engagements, et faire contester les notes par une personne indépendante.',
      ],
    ],
  },
  cta: {
    eyebrow: '#AIDoneRight',
    title: 'Exigez une norme pour l’IA. Commencez par celle-ci.',
    body: 'Lisez-la, utilisez-la, débattez-en. La version 2.0 est proposée à la consultation publique, parce qu’une norme de responsabilité doit elle-même rendre des comptes.',
    download: 'Télécharger AI Done Right 2.0',
    shareLabel: 'Partager',
    shareText:
      'AI Done Right 2.0 : une norme ouverte, centrée sur l’humain, pour une IA responsable. #AIDoneRight',
  },
};
