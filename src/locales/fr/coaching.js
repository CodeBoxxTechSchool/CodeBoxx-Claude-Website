// /fr/vibe-coaching : Vibe Coaching, une séance en direct de 30 minutes avec un coach CodeBoxx,
// payée avec Stripe (CoachingPage.astro, CoachingBooking.jsx; coaching.js du relais; CLP-1499).
export default {
  seo: {
    title: 'Vibe Coaching : séances de 30 minutes en direct | CodeBoxx',
    description:
      'Du coaching individuel en direct pour le codage agentique et le vibe coding avec un coach CodeBoxx : Claude Code, Codex, Cursor, Lovable. 200 $ US pour 30 minutes sur Zoom, remboursé si aucun coaching n’a lieu.',
  },
  hero: {
    eyebrow: 'Vibe Coaching',
    title: 'Du coaching en direct pour le codage agentique et le vibe coding.',
    lede: 'Connectez-vous maintenant, en direct avec un coach. Partagez votre écran et avancez pas à pas avec Claude Code ou Codex, ou prenez en main Cursor, Lovable et AI Studio.',
  },
  offer: {
    price: '200 $ US',
    unit: 'pour une séance de 30 minutes',
    items: [
      'En tête-à-tête sur Zoom avec un coach CodeBoxx',
      'Partage d’écran et aide en direct sur votre propre projet',
      'Valide 24 heures après le paiement',
      'Remboursé en totalité, automatiquement, si aucun coaching n’a lieu',
    ],
  },
  steps: {
    title: 'Comment ça marche',
    items: [
      [
        'Payez en toute sécurité',
        'Paiement Stripe, par carte ou portefeuille. Codes promotionnels acceptés.',
      ],
      [
        'Entrez dans la salle d’attente',
        'Dès le paiement, vous êtes dans la file : aucun formulaire à remplir de nouveau.',
      ],
      [
        'Codez avec votre coach',
        'À votre tour, votre coach ouvre l’appel Zoom. Apportez votre projet.',
      ],
    ],
  },
  availability: {
    loading: 'Vérification de la disponibilité des coachs…',
    now: 'Un coach est disponible maintenant',
    until: 'jusqu’à {time}',
    next: 'Prochaines heures de coaching : {start} à {end}',
    none: 'Aucune heure de coaching n’est encore affichée. Votre séance reste valide 24 heures et est remboursée en totalité si aucun coach ne la prend.',
  },
  form: {
    title: 'Réservez votre séance',
    name: 'Nom complet',
    email: 'Courriel',
    phone: 'Téléphone (facultatif)',
    pay: 'Payer 200 $ US et entrer dans la file',
    paying: 'Ouverture du paiement sécurisé…',
    note: 'Paiement par Stripe : vos données de carte n’arrivent jamais chez CodeBoxx. Vous avez un code promotionnel? Entrez-le au paiement.',
    invalid: 'Veuillez entrer votre nom et un courriel valide.',
    unavailable:
      'La réservation en ligne n’est pas encore ouverte. Écrivez-nous et nous organiserons votre séance.',
    error: 'Une erreur est survenue. Veuillez réessayer.',
    contact: 'Nous écrire',
    canceled: 'Paiement annulé : rien n’a été facturé.',
  },
  back: {
    checking: 'Paiement reçu. Nous vous amenons à la salle d’attente de votre coach…',
    failed:
      'Votre paiement est passé, mais votre salle d’attente ne s’est pas ouverte automatiquement.',
    fallback: 'Enregistrez-vous avec le nom et le courriel utilisés pour payer :',
    link: 'Ouvrir la page d’enregistrement',
    refund:
      'Si aucun coaching n’a lieu dans les 24 heures, vous êtes remboursé en totalité automatiquement.',
  },
};
