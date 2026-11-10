// Numbers in words: international (thousand, million, billion) and Indian (thousand, lakh, crore),
// cheque-style amounts for a few currencies, and digit grouping. Plain TypeScript, no DOM.
// Works on digit strings so big amounts never lose digits. Up to 15 digits before the point.

export type System = 'intl' | 'indian';

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const BIG = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

export const MAX_DIGITS = 15;

/** 0 to 999 in words (empty for 0). */
function below1000(n: number): string {
  const parts: string[] = [];
  if (n >= 100) { parts.push(`${ONES[Math.floor(n / 100)]} Hundred`); n %= 100; }
  if (n >= 20) { parts.push(TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : '')); }
  else if (n > 0) parts.push(ONES[n]);
  return parts.join(' ');
}

/** Whole number (digits only) in words. */
export function intWords(digits: string, system: System = 'intl'): string {
  const d = digits.replace(/^0+(?=\d)/, '');
  if (!/^\d+$/.test(d)) return '';
  if (d.length > MAX_DIGITS) return '';
  if (/^0+$/.test(d)) return 'Zero';
  const out: string[] = [];
  if (system === 'intl') {
    const groups: number[] = [];
    for (let i = d.length; i > 0; i -= 3) groups.unshift(+d.slice(Math.max(0, i - 3), i));
    groups.forEach((g, i) => { if (g) out.push(`${below1000(g)}${BIG[groups.length - 1 - i] ? ' ' + BIG[groups.length - 1 - i] : ''}`); });
  } else {
    const last3 = +d.slice(-3), rest = d.slice(0, -3);
    const th = rest ? +rest.slice(-2) : 0, rest2 = rest.slice(0, -2);
    const lakh = rest2 ? +rest2.slice(-2) : 0, crore = rest2.slice(0, -2);
    if (crore) out.push(`${intWords(crore, 'indian')} Crore`);
    if (lakh) out.push(`${below1000(lakh)} Lakh`);
    if (th) out.push(`${below1000(th)} Thousand`);
    if (last3) out.push(below1000(last3));
  }
  return out.join(' ');
}

/** Digit after digit, for the part after the point: "4 5" -> "Four Five". */
export function digitWords(digits: string): string {
  return [...digits].map((c) => (c === '0' ? 'Zero' : ONES[+c])).join(' ');
}

export type Amount = { int: string; frac: string; negative: boolean };

/** Reads "1,25,50,000.5", "1 234,5" is not guessed: commas and spaces are group marks, the point is the decimal point. */
export function parseAmount(raw: string): Amount | null {
  let s = raw.trim().replace(/[,\s_']/g, '');
  let negative = false;
  if (s.startsWith('-')) { negative = true; s = s.slice(1); } else if (s.startsWith('+')) s = s.slice(1);
  if (!/^\d*\.?\d*$/.test(s) || !/\d/.test(s)) return null;
  const [i = '', f = ''] = s.split('.');
  const int = i.replace(/^0+(?=\d)/, '') || '0';
  if (int.length > MAX_DIGITS) return null;
  return { int, frac: f, negative };
}

/** Round to two decimals (half up) on the digits, so nothing goes through floating point. */
export function toCents(a: Amount): { int: string; cents: number } {
  const f3 = (a.frac + '000').slice(0, 3);
  let total = BigInt(a.int + f3.slice(0, 2)) + (+f3[2] >= 5 ? 1n : 0n);
  const s = total.toString().padStart(3, '0');
  return { int: s.slice(0, -2).replace(/^0+(?=\d)/, '') || '0', cents: +s.slice(-2) };
}

export type Currency = { code: string; name: string; major: string; majors: string; minor: string; minors: string; style: 'cheque' | 'only'; indian: boolean };
export const CURRENCIES: Currency[] = [
  { code: 'INR', name: 'Indian rupee (INR)', major: 'Rupee', majors: 'Rupees', minor: 'Paisa', minors: 'Paise', style: 'only', indian: true },
  { code: 'USD', name: 'US dollar (USD)', major: 'Dollar', majors: 'Dollars', minor: 'Cent', minors: 'Cents', style: 'cheque', indian: false },
  { code: 'CAD', name: 'Canadian dollar (CAD)', major: 'Dollar', majors: 'Dollars', minor: 'Cent', minors: 'Cents', style: 'cheque', indian: false },
  { code: 'GBP', name: 'British pound (GBP)', major: 'Pound', majors: 'Pounds', minor: 'Penny', minors: 'Pence', style: 'cheque', indian: false },
  { code: 'AED', name: 'UAE dirham (AED)', major: 'Dirham', majors: 'Dirhams', minor: 'Fils', minors: 'Fils', style: 'only', indian: false },
  { code: 'EUR', name: 'Euro (EUR)', major: 'Euro', majors: 'Euros', minor: 'Cent', minors: 'Cents', style: 'cheque', indian: false },
  { code: 'AUD', name: 'Australian dollar (AUD)', major: 'Dollar', majors: 'Dollars', minor: 'Cent', minors: 'Cents', style: 'cheque', indian: false },
  { code: 'SAR', name: 'Saudi riyal (SAR)', major: 'Riyal', majors: 'Riyals', minor: 'Halala', minors: 'Halalas', style: 'only', indian: false },
];
export const currencyOf = (code: string) => CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[1];

/**
 * An amount of money in words.
 * "cheque" style (dollars, pounds): "One Thousand Two Hundred Thirty-Four Dollars and 50/100".
 * "only" style (rupees, dirhams, riyals): "Rupees One Thousand ... and Fifty Paise Only".
 * Pass style to override the currency's usual one.
 */
export function moneyWords(raw: string, code: string, system: System, style?: 'cheque' | 'only'): string {
  const a = parseAmount(raw);
  if (!a) return '';
  const c = currencyOf(code);
  const { int, cents } = toCents(a);
  const st = style ?? c.style;
  const words = intWords(int, system);
  if (!words) return '';
  const unit = int === '1' ? c.major : c.majors;
  const neg = a.negative && (int !== '0' || cents) ? 'Minus ' : '';
  if (st === 'cheque') return `${neg}${words} ${unit} and ${String(cents).padStart(2, '0')}/100`;
  const minor = cents ? ` and ${intWords(String(cents), 'intl')} ${cents === 1 ? c.minor : c.minors}` : '';
  if (int === '0' && cents) return `${neg}${c.majors} ${intWords(String(cents), 'intl')} ${cents === 1 ? c.minor : c.minors} Only`;
  return `${neg}${c.majors} ${words}${minor} Only`;
}

/** Plain number in words, with the decimals read digit by digit: "12.05" -> "Twelve point Zero Five". */
export function plainWords(raw: string, system: System): string {
  const a = parseAmount(raw);
  if (!a) return '';
  const w = intWords(a.int, system);
  if (!w) return '';
  return `${a.negative && (a.int !== '0' || /[1-9]/.test(a.frac)) ? 'Minus ' : ''}${w}${a.frac ? ` point ${digitWords(a.frac)}` : ''}`;
}

/** Group digits the Indian way (12,34,56,789) or the international way (123,456,789). */
export function groupDigits(raw: string, system: System): string {
  const a = parseAmount(raw);
  if (!a) return '';
  const i = a.int;
  let g: string;
  if (system === 'intl' || i.length <= 3) g = i.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  else g = i.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + i.slice(-3);
  return `${a.negative ? '-' : ''}${g}${raw.includes('.') ? '.' + a.frac : ''}`;
}
