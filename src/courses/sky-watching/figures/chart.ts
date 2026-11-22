// Shared drawing for the astronomy figures: an all-sky chart (zenith in the middle, horizon round the edge,
// north up and east on the left, as when you hold a chart over your head) and the bright stars on it.
import type { Plot } from '../../ml-foundations/figures/kit';
import { altAz } from '../../../lib/astrocourse/sky';
import { STARS, LINES, star } from '../../../lib/astrocourse/stars';

/** Alt-az to chart coordinates in a unit circle. */
export const toChart = (alt: number, az: number): [number, number] => {
  const r = (90 - alt) / 90, a = (az * Math.PI) / 180;
  return [-r * Math.sin(a), r * Math.cos(a)];
};
/** Chart coordinates back to alt-az. */
export const fromChart = (x: number, y: number) => {
  const r = Math.min(1, Math.hypot(x, y));
  return { alt: 90 - r * 90, az: ((Math.atan2(-x, y) * 180) / Math.PI + 360) % 360 };
};
/** Horizon circle, altitude rings every 30°, compass letters. */
export function chartFrame(p: Plot) {
  const c = p.ctx;
  for (const alt of [60, 30, 0]) {
    const pts: [number, number][] = [];
    for (let i = 0; i <= 96; i++) pts.push(toChart(alt, (i * 360) / 96));
    p.path(pts, { color: alt ? p.pal.grid : p.pal.line, width: alt ? 1 : 2 });
  }
  p.text(0, 1.06, 'N', { align: 'center', bold: true }).text(0, -1.06, 'S', { align: 'center', bold: true });
  p.text(-1.06, 0, 'E', { align: 'center', bold: true }).text(1.06, 0, 'W', { align: 'center', bold: true });
  c.globalAlpha = 1;
}
/** Bright stars and constellation lines for a sidereal time (hours) and latitude. Returns stars above the horizon. */
export function chartStars(p: Plot, lst: number, lat: number, labels = true) {
  const pos = new Map<string, { alt: number; xy: [number, number] }>();
  for (const [n, ra, dec] of STARS) { const { alt, az } = altAz((lst - ra) * 15, dec, lat); pos.set(n, { alt, xy: toChart(alt, az) }); }
  for (const [a, b] of LINES) { const A = pos.get(a)!, B = pos.get(b)!; if (A.alt > 0 && B.alt > 0) p.line(A.xy[0], A.xy[1], B.xy[0], B.xy[1], { color: p.pal.muted, width: 1, alpha: 0.6 }); }
  const up: string[] = [];
  for (const [n, , , m] of STARS) {
    const s = pos.get(n)!; if (s.alt <= 0) continue; up.push(n);
    p.dot(s.xy[0], s.xy[1], { r: Math.max(1.6, 4.6 - 1.1 * m), color: p.pal.ink });
    if (labels && (m < 1.0 || n === 'Polaris')) p.text(s.xy[0], s.xy[1], n, { dx: 6, size: 11, color: p.pal.muted });
  }
  return up;
}
export { star };
