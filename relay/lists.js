// The portal's country codes (wwwroot/json/countries.json). Kept in sync with src/data/countries.js
// by relay/test/drift.test.js.
export const COUNTRY_CODES = new Set(
  `
  AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ
  BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR
  CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR
  GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU
  ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ
  LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ
  MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF
  PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI
  SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR
  TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS XK YE YT ZA ZM ZW
  `
    .trim()
    .split(/\s+/)
);

// The drawer's "How did you hear about us?" options, [English, French], in the order of
// heardAbout in src/locales/{en,fr}/home.js. The portal gets the English label either way.
const HEARD_ABOUT_PAIRS = [
  ['Google / Search Engine', 'Google / Moteur de recherche'],
  ['TV', 'Télévision'],
  ['Radio Ads', 'Publicités radio'],
  ['Spotify', 'Spotify'],
  ['SkillPointe', 'SkillPointe'],
  ['Facebook', 'Facebook'],
  ['Instagram', 'Instagram'],
  ['LinkedIn', 'LinkedIn'],
  ['Youtube', 'Youtube'],
  ['TikTok', 'TikTok'],
  ['Barbershop Book Club', 'Barbershop Book Club'],
  ['Empact Solutions', 'Empact Solutions'],
  ['Referred By a Friend', 'Recommandé par un ami'],
];

export const HEARD_ABOUT = new Map(
  HEARD_ABOUT_PAIRS.flatMap(([en, fr]) => [
    [en, en],
    [fr, en],
  ])
);

// The pitch drawer's project types, the values of pitchDrawer.projectKinds in
// src/locales/{en,fr}/ventures.js.
export const PROJECT_TYPES = new Set(['native-app', 'web-app', 'web-project', 'other']);

// The business contact form's topics (/solutions, /case-studies), the values of topics in
// src/locales/{en,fr}/businessContact.js.
export const CONTACT_TOPICS = new Set([
  'issue',
  'project',
  'quote',
  'factory',
  'staffing',
  'training',
]);
