// Currency converter maths. Plain TypeScript, no DOM. Rates are "units of each currency per US dollar".
import { saneFx, FALLBACK } from '../collect/prices';

export type Fx = Record<string, number>;

/** Mid-market rate: 1 unit of `a` = this many `b`. Unknown currencies count as 1 per dollar. */
export const midRate = (fx: Fx, a: string, b: string) => (fx[b] ?? 1) / (fx[a] ?? 1);

/** A typed amount made safe: negative, blank or non-numeric is 0; above 1e15 is flagged. */
export function cleanAmount(raw: string | number): { value: number; problem: '' | 'negative' | 'huge' | 'blank' } {
  const s = String(raw ?? '').trim();
  if (s === '') return { value: 0, problem: 'blank' };
  const v = typeof raw === 'number' ? raw : parseFloat(s.replace(/,/g, ''));
  if (!Number.isFinite(v)) return { value: 0, problem: 'blank' };
  if (v < 0) return { value: 0, problem: 'negative' };
  if (v > 1e15) return { value: 0, problem: 'huge' };
  return { value: v, problem: '' };
}

/** What a bank or transfer offer gives: rate `their` (1 From = this many To), a fixed fee and a percent fee, both in From. */
export function bankOffer(amount: number, mid: number, their: number, fee = 0, feePct = 0) {
  const fair = amount * mid;
  const got = Math.max(0, amount - fee - (amount * feePct) / 100) * their;
  const lost = fair - got;
  return { fair, got, lost, lostPct: fair > 0 ? (lost / fair) * 100 : 0, rateGap: mid > 0 ? (1 - their / mid) * 100 : 0 };
}

/** A rate worked out from a markup: mid-market rate made `markupPct` % worse. */
export const rateFromMarkup = (mid: number, markupPct: number) => mid * (1 - Math.min(100, Math.max(0, markupPct)) / 100);

/** How much to send (in From) so that `receive` (in To) arrives, at their rate with a fixed fee and a percent fee. NaN if impossible. */
export function amountToSend(receive: number, their: number, fee = 0, feePct = 0) {
  if (!(their > 0) || feePct >= 100) return NaN;
  return (receive / their + fee) / (1 - feePct / 100);
}

/** Groups of currencies for the "show in the table" choice. */
export const GROUPS: Record<string, string[]> = {
  popular: ['usd', 'cad', 'inr', 'gbp', 'eur', 'aed', 'aud'],
  gulf: ['aed', 'sar', 'qar', 'kwd', 'omr', 'bhd'],
  south_asia: ['inr', 'pkr', 'lkr', 'bdt', 'npr'],
  all: [],
};

/** Reads rates kept from an earlier visit; returns null unless they are a recent-looking date and sane numbers. */
export function parseSavedRates(json: string | null): { date: string; fx: Fx } | null {
  try {
    const d = JSON.parse(json || 'null');
    if (!d || typeof d.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(d.date)) return null;
    const fx = saneFx(d.fx);
    if (!(fx.inr > 0) || !(fx.cad > 0)) return null;
    return { date: d.date, fx: { ...FALLBACK.fx, ...fx, usd: 1 } };
  } catch { return null; }
}
