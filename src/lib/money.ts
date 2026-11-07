// Currency choice and formatting for the money tools. Picks a sensible default from the
// browser's language; nothing is looked up online.
export const CURRENCIES = [
  ['USD', 'US dollar ($)'], ['CAD', 'Canadian dollar ($)'], ['INR', 'Indian rupee (₹)'], ['GBP', 'Pound sterling (£)'],
  ['EUR', 'Euro (€)'], ['AED', 'UAE dirham'], ['SAR', 'Saudi riyal'], ['QAR', 'Qatari riyal'], ['KWD', 'Kuwaiti dinar'],
  ['OMR', 'Omani rial'], ['BHD', 'Bahraini dinar'], ['AUD', 'Australian dollar ($)'], ['NZD', 'New Zealand dollar ($)'],
  ['SGD', 'Singapore dollar ($)'], ['PKR', 'Pakistani rupee'], ['LKR', 'Sri Lankan rupee'], ['BDT', 'Bangladeshi taka'],
  ['NGN', 'Nigerian naira'], ['ZAR', 'South African rand'], ['PHP', 'Philippine peso'],
] as const;

const BY_REGION: Record<string, string> = { US: 'USD', CA: 'CAD', IN: 'INR', GB: 'GBP', AE: 'AED', SA: 'SAR', QA: 'QAR', KW: 'KWD', OM: 'OMR', BH: 'BHD', AU: 'AUD', NZ: 'NZD', SG: 'SGD', PK: 'PKR', LK: 'LKR', BD: 'BDT', NG: 'NGN', ZA: 'ZAR', PH: 'PHP', IE: 'EUR', DE: 'EUR', FR: 'EUR', ES: 'EUR', IT: 'EUR', NL: 'EUR' };

export function defaultCurrency(): string {
  for (const l of navigator.languages ?? [navigator.language]) {
    const region = l.split('-')[1]?.toUpperCase();
    if (region && BY_REGION[region]) return BY_REGION[region];
  }
  return 'USD';
}

/** Formats money in the chosen currency; Indian rupees use lakh/crore grouping. */
export function money(n: number, cur: string, decimals = 0): string {
  const locale = cur === 'INR' ? 'en-IN' : undefined;
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: cur, maximumFractionDigits: decimals, minimumFractionDigits: decimals }).format(n);
  } catch { return n.toFixed(decimals); }
}

/** Reads a number typed with commas, spaces or a currency sign. */
export const num = (s: string) => { const v = parseFloat(String(s).replace(/[^\d.-]/g, '')); return Number.isFinite(v) ? v : 0; };

export const currencyOptions = (selected: string) => CURRENCIES.map(([c, n]) => `<option value="${c}"${c === selected ? ' selected' : ''}>${n}</option>`).join('');
