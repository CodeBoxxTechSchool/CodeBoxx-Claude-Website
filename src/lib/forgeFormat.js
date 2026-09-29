// Number formatting for the Forge "Dive Deeper" islands, EN and FR conventions:
// "$6.5M" / "6,5 M$", "$335K" / "335 k$", "5.2×" / "5,2×", "82%" / "82 %".

const dec = (n, digits, lang, keepZero = false) => {
  const s = keepZero ? n.toFixed(digits) : n.toFixed(digits).replace(/\.0+$/, '');
  return lang === 'fr' ? s.replace('.', ',') : s;
};

export function money(n, lang) {
  const abs = Math.abs(n);
  let num;
  let unitEn;
  let unitFr;
  if (abs >= 1e6) {
    num = dec(n / 1e6, abs >= 1e8 ? 0 : 1, lang, true);
    unitEn = 'M';
    unitFr = ' M$';
  } else if (abs >= 1e3) {
    num = dec(n / 1e3, abs >= 1e4 ? 0 : 1, lang);
    unitEn = 'K';
    unitFr = ' k$';
  } else {
    num = String(Math.round(n));
    unitEn = '';
    unitFr = ' $';
  }
  return lang === 'fr' ? num + unitFr : '$' + num + unitEn;
}

export function moneyFull(n, lang) {
  const s = Math.round(n).toLocaleString(lang === 'fr' ? 'fr-CA' : 'en-US');
  return lang === 'fr' ? s + ' $' : '$' + s;
}

export const times = (x, lang) => dec(Number(x), 1, lang) + '×';

export const percent = (s, lang) => (lang === 'fr' ? String(s).replace('%', ' %') : String(s));

export const pct = (ratio, lang) => percent(Math.round(ratio * 100) + '%', lang);

export const months = (n, lang) => dec(n, n < 10 ? 1 : 0, lang);
