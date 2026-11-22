// Money and country helpers for the Start a startup calculators.
import { getCountry } from './su';
export type CC = 'in' | 'ca' | 'us';
export const CUR: Record<CC, { sym: string; loc: string; code: string; name: string }> = {
  in: { sym: '₹', loc: 'en-IN', code: 'INR', name: 'India' },
  ca: { sym: 'C$', loc: 'en-CA', code: 'CAD', name: 'Canada' },
  us: { sym: '$', loc: 'en-US', code: 'USD', name: 'USA' },
};
export const money = (cc: CC, x: number, d = 0) => !Number.isFinite(x) ? '–' : `${x < 0 ? '−' : ''}${CUR[cc].sym}${Math.abs(x).toLocaleString(CUR[cc].loc, { maximumFractionDigits: d, minimumFractionDigits: d })}`;
export const pct = (x: number, d = 1) => Number.isFinite(x) ? `${(100 * x).toFixed(d)} %` : '–';
/** A figure's own country: follows the page switch; "All three" keeps the figure's own choice. */
export function followCountry(fig: HTMLElement, onChange: (cc: CC) => void, fallback: CC = 'in') {
  const sel = fig.querySelector<HTMLSelectElement>('select[name=cc]');
  const pick = (cc: string) => { const c = (['in', 'ca', 'us'].includes(cc) ? cc : sel?.value || fallback) as CC; if (sel) sel.value = c; onChange(c); };
  sel?.addEventListener('change', () => pick(sel.value));
  document.addEventListener('su-country', (e) => { const cc = (e as CustomEvent).detail; if (cc !== 'all') pick(cc); });
  const first = getCountry(); if (sel && ['in', 'ca', 'us'].includes(first)) sel.value = first;
  queueMicrotask(() => pick(getCountry()));
  return () => (sel?.value || fallback) as CC;
}
export const num = (fig: HTMLElement, name: string) => { const el = fig.querySelector<HTMLInputElement>(`[name=${name}]`); const v = Number(el?.value); return Number.isFinite(v) ? v : 0; };
export const put = (fig: HTMLElement, key: string, text: string) => { const el = fig.querySelector<HTMLElement>(`[data-${key}]`); if (el) el.textContent = text; };
export const countrySelect = `<label>Country<select name="cc"><option value="in">India (₹)</option><option value="ca">Canada (C$)</option><option value="us">USA ($)</option></select></label>`;
