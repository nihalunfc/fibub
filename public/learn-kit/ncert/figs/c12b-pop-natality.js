// Class 12 Biology, Organisms and Populations: the four things that change a population's size in a given time: births B, deaths D, immigration I, emigration E.
// N(t+1) = N(t) + [B + I] - [D + E]. Population density is the number per unit area (or volume).
import { canvas, text, title, line, row, slider, readout } from '../../kit.js';

export default function (host) {
  let N0 = 500, B = 80, D = 40, I = 20, E = 30, A = 10;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 280, label: 'A bar chart: the starting population plus births and immigration minus deaths and emigration gives the new population' });
  const ctl = row(host), ro = readout(host);
  const mk = (label, min, max, v, set) => slider(ctl, { label, min, max, step: 5, value: v, fmt: (x) => x.toFixed(0), oninput: (x) => { set(x); go(); } });
  mk('start N', 100, 1000, 500, (x) => (N0 = x)); mk('births B', 0, 300, 80, (x) => (B = x)); mk('deaths D', 0, 300, 40, (x) => (D = x)); mk('immigration I', 0, 200, 20, (x) => (I = x)); mk('emigration E', 0, 200, 30, (x) => (E = x));
  const go = () => { const N1 = N0 + B + I - D - E; ro.textContent = `N₁ = ${N0} + (${B} + ${I}) − (${D} + ${E}) = ${N1}. ${N1 > N0 ? 'The population grew' : N1 < N0 ? 'The population shrank' : 'No change'} by ${Math.abs(N1 - N0)} (${((N1 - N0) / N0 * 100).toFixed(1)} %). On ${A} km² the density went from ${(N0 / A).toFixed(0)} to ${(N1 / A).toFixed(0)} per km². Natality ${(B / N0).toFixed(2)}, mortality ${(D / N0).toFixed(2)} per individual.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'What changes a population', col) + 8, base = h - 54, ymax = Math.max(N0 + B + I, 300) * 1.1, Y = (v) => base - (v / ymax) * (base - top - 10), bw = (w - 40) / 6;
    const items = [['N₀', 0, N0, col.s[0]], ['+B', N0, B, col.good], ['+I', N0 + B, I, col.good], ['−D', N0 + B + I - D, D, col.bad], ['−E', N0 + B + I - D - E, E, col.bad], ['N₁', 0, N0 + B + I - D - E, col.s[2]]];
    line(ctx, [[10, base], [w - 10, base]], col.muted, 1.5);
    items.forEach(([n, b, v, c], i) => { const x = 20 + i * bw + 6; ctx.fillStyle = c; ctx.globalAlpha = 0.85; ctx.fillRect(x, Y(b + v), bw - 12, Math.max(1, Y(b) - Y(b + v))); ctx.globalAlpha = 1; text(ctx, n, x + (bw - 12) / 2, base + 14, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, String(v), x + (bw - 12) / 2, Y(b + v) - 8, { color: col.ink, size: 10.5, align: 'center' }); });
    text(ctx, 'births and immigration add; deaths and emigration take away', w / 2, h - 12, { color: col.muted, size: 10.5, align: 'center' });
  };
  go();
}
