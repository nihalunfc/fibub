// Invoice, quote, receipt and rent receipt: the model, the sums (whole cents, no floating point drift in totals)
// and the wording. Plain TypeScript, no DOM. Drawing lives in invoicepdf.ts and the tool page.
import { CURRENCIES, currencyOf, groupDigits, moneyWords } from './numwords';

export type Mode = 'invoice' | 'quote' | 'receipt' | 'rent';
export type TaxMode = 'none' | 'one' | 'india';
export type Party = { name: string; addr: string; taxId: string; contact: string };
export type Item = { desc: string; hsn: string; qty: string; rate: string; tax: string };
export type Inv = {
  mode: Mode; cur: string; taxMode: TaxMode; taxName: string; taxRate: string; igst: boolean;
  seller: Party; buyer: Party; number: string; date: string; due: string; po: string; pay: string;
  items: Item[]; discKind: 'pct' | 'amt'; disc: string; roundOff: boolean;
  notes: string; bank: string; logo: string;
  property: string; monthly: string; from: string; to: string;
};

export const SYMBOL: Record<string, string> = { INR: 'Rs. ', USD: '$', CAD: '$', GBP: '£', EUR: '€', AUD: '$', AED: 'AED ', SAR: 'SAR ' };
export const CURRENCY_LIST = CURRENCIES.map((c) => ({ code: c.code, name: c.name }));

export const emptyParty = (): Party => ({ name: '', addr: '', taxId: '', contact: '' });
export const emptyItem = (): Item => ({ desc: '', hsn: '', qty: '1', rate: '', tax: '' });
export const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
export const emptyInv = (): Inv => ({
  mode: 'invoice', cur: 'USD', taxMode: 'none', taxName: 'Tax', taxRate: '', igst: false,
  seller: emptyParty(), buyer: emptyParty(), number: '1001', date: today(), due: '', po: '', pay: '',
  items: [emptyItem()], discKind: 'pct', disc: '', roundOff: false, notes: '', bank: '', logo: '',
  property: '', monthly: '', from: today().slice(0, 7), to: today().slice(0, 7),
});

const num = (s: string) => { const n = parseFloat(String(s).replace(/,/g, '')); return Number.isFinite(n) ? n : 0; };

/** Money text for an amount in cents, e.g. "$1,234.50" or "Rs. 12,50,000.00". */
export function fmt(cents: number, cur: string): string {
  const neg = cents < 0, a = Math.abs(cents);
  const s = `${Math.floor(a / 100)}.${String(a % 100).padStart(2, '0')}`;
  return `${neg ? '-' : ''}${SYMBOL[cur] ?? cur + ' '}${groupDigits(s, currencyOf(cur).indian ? 'indian' : 'intl')}`;
}

export type Line = { desc: string; hsn: string; qty: number; rate: number; amount: number; taxRate: number };
export type Calc = { lines: Line[]; subtotal: number; discount: number; taxes: { label: string; cents: number }[]; round: number; total: number; words: string; hasHsn: boolean };

export function calc(inv: Inv): Calc {
  const defRate = inv.taxMode === 'none' ? 0 : num(inv.taxRate);
  const lines: Line[] = inv.items
    .filter((it) => it.desc.trim() || num(it.rate))
    .map((it) => {
      const qty = num(it.qty), rate = num(it.rate);
      return { desc: it.desc.trim(), hsn: it.hsn.trim(), qty, rate, amount: Math.round(qty * rate * 100 + 1e-7), taxRate: inv.taxMode === 'none' ? 0 : it.tax.trim() === '' ? defRate : num(it.tax) };
    });
  const subtotal = lines.reduce((a, l) => a + l.amount, 0);
  let discount = inv.discKind === 'pct' ? Math.round(subtotal * Math.min(100, num(inv.disc)) / 100) : Math.round(num(inv.disc) * 100);
  discount = Math.max(0, Math.min(subtotal, discount));
  // Share the discount over the lines so tax is worked out on what is really charged.
  let left = discount;
  const nets = lines.map((l, i) => {
    const d = i === lines.length - 1 ? left : Math.round(subtotal ? (discount * l.amount) / subtotal : 0);
    left -= d;
    return l.amount - d;
  });
  const byRate = new Map<number, number>();
  lines.forEach((l, i) => byRate.set(l.taxRate, (byRate.get(l.taxRate) ?? 0) + nets[i]));
  const taxMap = new Map<string, number>();
  const add = (label: string, c: number) => taxMap.set(label, (taxMap.get(label) ?? 0) + c);
  const pct = (r: number) => String(+r.toFixed(3));
  [...byRate.entries()].sort((a, b) => a[0] - b[0]).forEach(([r, net]) => {
    if (!r || inv.taxMode === 'none') return;
    if (inv.taxMode === 'one') add(`${inv.taxName.trim() || 'Tax'} ${pct(r)}%`, Math.round((net * r) / 100));
    else if (inv.igst) add(`IGST ${pct(r)}%`, Math.round((net * r) / 100));
    else { const half = Math.round((net * r) / 200); add(`CGST ${pct(r / 2)}%`, half); add(`SGST ${pct(r / 2)}%`, half); }
  });
  const taxes = [...taxMap.entries()].map(([label, cents]) => ({ label, cents }));
  const pre = subtotal - discount + taxes.reduce((a, t) => a + t.cents, 0);
  const round = inv.roundOff ? Math.round(pre / 100) * 100 - pre : 0;
  const total = pre + round;
  const c = currencyOf(inv.cur);
  const words = total > 0 ? moneyWords(`${Math.floor(total / 100)}.${String(total % 100).padStart(2, '0')}`, c.code, c.indian ? 'indian' : 'intl') : '';
  return { lines, subtotal, discount, taxes, round, total, words, hasHsn: lines.some((l) => l.hsn) };
}

export const TITLE: Record<Mode, string> = { invoice: 'Invoice', quote: 'Quotation', receipt: 'Receipt', rent: 'Rent receipt' };
export function docTitle(inv: Inv): string {
  if (inv.mode === 'invoice' && inv.taxMode === 'india' && inv.seller.taxId.trim()) return 'Tax invoice';
  return TITLE[inv.mode];
}

/** The months from "2025-04" to "2026-03" (at most 36), as labels like "April 2025". */
export function monthsBetween(from: string, to: string): string[] {
  const f = /^(\d{4})-(\d{2})$/.exec(from), t = /^(\d{4})-(\d{2})$/.exec(to);
  if (!f || !t) return [];
  let y = +f[1], m = +f[2];
  const ey = +t[1], em = +t[2], out: string[] = [];
  const names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  while ((y < ey || (y === ey && m <= em)) && out.length < 36) { out.push(`${names[m - 1]} ${y}`); if (++m > 12) { m = 1; y++; } }
  return out;
}

export type Rent = { month: string; amountText: string; words: string; sentence: string };
export function rentReceipts(inv: Inv): Rent[] {
  const cents = Math.round(num(inv.monthly) * 100);
  if (cents <= 0) return [];
  const c = currencyOf(inv.cur);
  const words = moneyWords(`${Math.floor(cents / 100)}.${String(cents % 100).padStart(2, '0')}`, c.code, c.indian ? 'indian' : 'intl');
  const tenant = inv.buyer.name.trim() || '__________', prop = inv.property.trim() || '__________';
  return monthsBetween(inv.from, inv.to).map((month) => ({
    month, amountText: fmt(cents, inv.cur), words,
    sentence: `Received ${fmt(cents, inv.cur)} (${words}) from ${tenant} as rent for the property at ${prop} for the month of ${month}${inv.pay.trim() ? `, paid by ${inv.pay.trim()}` : ''}.`,
  }));
}
