// Class 11 Chemistry, Hydrocarbons: boiling points of alkanes. Boiling point rises with chain length (more surface contact, stronger London forces) and falls with branching (a compact molecule touches its neighbours less).
// Data (K, 1 atm): n-alkanes C1-C10: 111.7, 184.6, 231.1, 272.7, 309.2, 341.9, 371.6, 398.8, 423.9, 447.3 (NIST Chemistry WebBook). Branched: isobutane 261.4; isopentane 301.0, neopentane 282.7;
// 2-methylpentane 333.4, 2,2-dimethylbutane 322.9.
import { canvas, text, title, axes, line, dot, slider, choice, readout, row } from '../../kit.js';

const BP = [111.7, 184.6, 231.1, 272.7, 309.2, 341.9, 371.6, 398.8, 423.9, 447.3];
const NAME = ['methane', 'ethane', 'propane', 'butane', 'pentane', 'hexane', 'heptane', 'octane', 'nonane', 'decane'];
const BR = { 4: [['isobutane', 261.4]], 5: [['isopentane', 301.0], ['neopentane', 282.7]], 6: [['2-methylpentane', 333.4], ['2,2-dimethylbutane', 322.9]] };
export default function (host) {
  let n = 5, show = 'n';
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 290, label: 'Boiling points of straight-chain and branched alkanes against the number of carbon atoms' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'carbon atoms', min: 1, max: 10, step: 1, value: n, fmt: (v) => String(v), oninput: (v) => { n = v; go(); } });
  choice(ctl, 'show', [['n', 'straight chain only'], ['b', 'also branched isomers']], show, (v) => { show = v; go(); });
  const go = () => {
    const state = BP[n - 1] < 298 ? (BP[n - 1] < 273 ? 'a gas' : 'a gas just above 0 °C') : 'a liquid';
    const b = BR[n]; ro.textContent = `${NAME[n - 1]} (C${n}H${2 * n + 2}) boils at ${BP[n - 1]} K (${(BP[n - 1] - 273.15).toFixed(0)} °C): at room temperature it is ${state}.` + (show === 'b' && b ? ' Branched isomers: ' + b.map(([a, v]) => `${a} ${v} K`).join(', ') + ': lower, because the molecule is rounder and touches its neighbours less.' : '');
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Boiling point of alkanes (K)', col);
    const a = axes(ctx, w, h, col, { x: [0, 11], y: [50, 480], xlabel: 'carbon atoms in the chain', ylabel: 'boiling point (K)', l: 52, r: 14, t: 40, b: 40 });
    const X = a.X, Y = a.Y;
    line(ctx, BP.map((v, i) => [X(i + 1), Y(v)]), col.s[3], 2.5);
    BP.forEach((v, i) => dot(ctx, X(i + 1), Y(v), i + 1 === n ? 6 : 3.5, i + 1 === n ? col.s[3] : col.panel, col.s[3]));
    ctx.strokeStyle = col.muted; ctx.setLineDash([4, 4]); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.L, Y(298)); ctx.lineTo(a.R, Y(298)); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'room temp (298 K)', w - 16, Y(298) - 8, { color: col.muted, size: 10, align: 'right' });
    if (show === 'b') Object.entries(BR).forEach(([k, arr]) => arr.forEach(([nm, v]) => dot(ctx, X(+k), Y(v), +k === n ? 6 : 4, col.s[0], col.panel)));
    if (show === 'b') text(ctx, '● branched isomers', 60, 52, { color: col.s[0], size: 10.5, weight: 700 });
  };
  go();
}
