// Tiny helpers for the household cost tools' pages (browser side).
export const fmt = (v: number, d = 2) => (isFinite(v) ? v : 0).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
/** Number from the input with data-k=k inside root (blank or bad text gives 0). */
export const num = (root: HTMLElement, k: string) => { const v = parseFloat((root.querySelector(`[data-k="${k}"]`) as HTMLInputElement).value); return isFinite(v) ? v : 0; };
export const val = (root: HTMLElement, k: string) => (root.querySelector(`[data-k="${k}"]`) as HTMLInputElement).value;
export const on = (root: HTMLElement, k: string) => (root.querySelector(`[data-k="${k}"]`) as HTMLInputElement).checked;
export const rowsHtml = (rows: [string, string][]) => rows.map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join('');
export const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);
