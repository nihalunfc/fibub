// Shared helpers for the Statistics for analysts figures, on top of the ML foundations canvas kit
// (Plot, live, slider, drag; fibub.com watermark; light, dark and red night mode).
export { Plot, live, slider, drag, fmt, ticks } from '../../ml-foundations/figures/kit';
import type { Plot } from '../../ml-foundations/figures/kit';

/** Bars for a discrete distribution: probs[k] at x = k (from first), highlighted where hi(k) is true. */
export function bars(p: Plot, probs: number[], first = 0, hi: (k: number) => boolean = () => false) {
  probs.forEach((v, i) => {
    const k = first + i, on = hi(k);
    if (v > 0) p.rect(k - 0.4, 0, 0.8, v, { fill: on ? p.pal.accent2 : p.pal.accent, alpha: on ? 0.9 : 0.55 });
  });
}
/** Shade the area under f between a and b. */
export function area(p: Plot, f: (x: number) => number, a: number, b: number, color?: string, alpha = 0.3) {
  const lo = Math.max(a, p.x0), hi = Math.min(b, p.x1);
  if (hi <= lo) return;
  const n = 120, pts: [number, number][] = [[lo, 0]];
  for (let i = 0; i <= n; i++) { const x = lo + ((hi - lo) * i) / n; pts.push([x, Math.min(f(x), p.y1)]); }
  pts.push([hi, 0]);
  p.poly(pts, { fill: color ?? p.pal.accent, alpha });
}
/** Set a [data-x] readout inside a figure. */
export const put = (fig: HTMLElement, key: string, text: string) => { const el = fig.querySelector<HTMLElement>(`[data-${key}]`); if (el) el.textContent = text; };
export const pct = (x: number, d = 1) => `${(100 * x).toFixed(d)} %`;
