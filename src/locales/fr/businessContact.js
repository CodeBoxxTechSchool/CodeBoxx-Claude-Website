// Le formulaire de contact pour les entreprises sur /fr/solutions et /fr/etudes-de-cas
// (BusinessContact.jsx); même structure que src/locales/en/businessContact.js.
export default {
  eyebrow: 'Nous joindre',
  title: 'Dites-nous ce dont votre entreprise a besoin.',
  lede: 'Un problème à régler, un projet à bâtir, une soumission, la fabrique logicielle, des ingénieurs pour votre équipe ou de la formation intégrée à la livraison. Un seul formulaire, et une personne vous répond en un jour ouvrable.',
  autonomy: {
    title: 'Une livraison qui vous rend autonomes.',
    body: 'Nous intégrons la formation en entreprise et le coaching à la livraison de nos solutions. Vos équipes apprennent les outils et le code pendant que nous bâtissons, pour que vos partenaires et vos équipes puissent l’exploiter seuls lors de la passation.',
  },
  topicLabel: 'Comment pouvons-nous vous aider ?',
  topics: [
    {
      value: 'issue',
      label: 'Signaler un problème',
      hint: 'Quelque chose est brisé ou vous bloque.',
      placeholder: 'Que se passe-t-il, depuis quand, et quel système est touché ?',
    },
    {
      value: 'project',
      label: 'Démarrer un projet',
      hint: 'Un produit, une plateforme ou un agent à bâtir.',
      placeholder: 'Que voulez-vous bâtir, pour qui, et pour quand ?',
    },
    {
      value: 'quote',
      label: 'Demander une soumission',
      hint: 'Portée, échéancier et budget.',
      placeholder: 'Que doit couvrir la soumission, et y a-t-il une échéance ou un budget ?',
    },
    {
      value: 'factory',
      label: 'La fabrique logicielle',
      hint: 'Le CrewKit Forge 20, à vous et sur place.',
      placeholder: 'Combien de chantiers ferait-elle rouler, et où ?',
    },
    {
      value: 'staffing',
      label: 'Renfort d’équipe',
      hint: 'Des ingénieurs natifs IA qui se joignent à votre équipe.',
      placeholder: 'Quels rôles, combien de personnes, pour combien de temps, et sur quelle pile ?',
    },
    {
      value: 'training',
      label: 'Formation et coaching',
      hint: 'Intégrés à la livraison, pour atteindre l’autonomie.',
      placeholder: 'Quelles équipes et quels outils, et à quoi ressemble l’autonomie pour vous ?',
    },
  ],
  companyPlaceholder: 'Entreprise',
  messageLabel: 'Dites-nous-en plus',
  submit: 'Envoyer',
  formTitle: 'Joindre CodeBoxx',
};
