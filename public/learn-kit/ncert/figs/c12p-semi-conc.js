// Class 12 Semiconductors: law of mass action in a doped crystal, n * p = ni^2. Silicon at room temperature has ni = 1.5e16 per m^3. Adding Nd donors per m^3 makes
// n close to Nd and pushes the hole count down to ni^2/n. The bars are on a log scale (each gridline is a factor of 100). Switch to acceptors for the p-type case.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let N = 22, kind = 'n';
  const ni = 1.5e16;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'Electron and hole concentrations in doped silicon on a log scale' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Dopant', [['n', 'Donors (n-type)'], ['p', 'Acceptors (p-type)']], kind, (v) => { kind = v; go(); });
  slider(ctl, { label: 'doping per m³', min: 16, max: 26, step: 0.5, value: N, fmt: (v) => '10^' + v, oninput: (v) => { N = v; go(); } });
  const calc = () => { const D = 10 ** N, m = D / 2 + Math.sqrt((D / 2) ** 2 + ni * ni), mi = ni * ni / m; return kind === 'n' ? { n: m, p: mi } : { n: mi, p: m }; };
  const sci = (v) => { const e = Math.floor(Math.log10(v)); return `${(v / 10 ** e).toFixed(1)}×10^${e}`; };
  const go = () => { const { n, p } = calc(); ro.textContent = `Doping 10^${N} per m³:  n = ${sci(n)},  p = ${sci(p)} per m³.  n × p = ${sci(n * p)} = nᵢ² (${sci(ni * ni)}) always.  ${kind === 'n' ? 'Electrons are the majority.' : 'Holes are the majority.'} At light doping both are about nᵢ.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Carriers per m³ (log scale)', col), { n, p } = calc(), L = 48, B = h - 70, T = top + 16, lo = 4, hi = 28, Y = (v) => B - (Math.log10(v) - lo) / (hi - lo) * (B - T);
    for (let e = lo; e <= hi; e += 4) { ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(L, Y(10 ** e)); ctx.lineTo(w - 12, Y(10 ** e)); ctx.stroke(); text(ctx, `10^${e}`, L - 5, Y(10 ** e), { color: col.muted, size: 10.5, align: 'right' }); }
    ctx.strokeStyle = col.s[2]; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(L, Y(ni)); ctx.lineTo(w - 12, Y(ni)); ctx.stroke(); ctx.setLineDash([]); text(ctx, 'nᵢ = 1.5×10¹⁶', w - 14, Y(ni) - 9, { color: col.s[2], size: 10.5, align: 'right' });
    const bw = (w - L - 30) / 4;
    [[n, 'electrons n', col.s[0], 0.35], [p, 'holes p', col.s[3], 1.65]].forEach(([v, lab, c, f]) => { const x = L + bw * f; ctx.fillStyle = c; ctx.fillRect(x, Y(v), bw, B - Y(v)); text(ctx, sci(v), x + bw / 2, Math.max(T + 8, Y(v) - 9), { color: col.ink, size: 10.5, weight: 700, align: 'center' }); text(ctx, lab, x + bw / 2, B + 14, { color: col.ink, size: 11.5, weight: 700, align: 'center' }); });
    text(ctx, 'majority ≫ minority', L + bw * 3.1, T + 10, { color: col.muted, size: 11, align: 'center' });
    text(ctx, 'n × p = nᵢ² (the product is fixed)', w / 2, h - 18, { color: col.s[7], size: 12, weight: 700, align: 'center' });
  };
  go();
}
