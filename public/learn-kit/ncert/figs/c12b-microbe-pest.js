// Class 12 Microbes in Human Welfare: biocontrol versus chemical pesticide. Pest numbers over 20 weeks on a crop (illustrative model): left alone the pest booms; a chemical spray kills most pests at first but also
// the natural enemies, and survivors become resistant, so the pest returns; a biocontrol agent (a ladybird or a parasite) settles into a steady cycle that keeps the pest low.
import { canvas, text, title, axes, line, row, choice, readout } from '../../kit.js';

const W = 20, DT = 0.05;
function run(mode) {
  let P = 5, Q = mode === 'bio' ? 0 : 0, out = [[0, P]], res = 0.02;
  for (let t = 0; t < W; t += DT) {
    if (mode === 'bio' && Math.abs(t - 4) < DT / 2) Q = 3;
    if (mode === 'chem' && [4, 8, 12, 16].some((s) => Math.abs(t - s) < DT / 2)) { const kill = 0.8 * (1 - res); P *= 1 - kill; res = Math.min(0.9, res + 0.2); }
    const dP = 0.9 * P * (1 - P / 100) - (mode === 'bio' ? 0.12 * P * Q : 0), dQ = mode === 'bio' ? 0.01 * P * Q - 0.4 * Q : 0;
    P = Math.max(0.2, P + dP * DT); Q = Math.max(0, Q + dQ * DT); out.push([t + DT, P]);
  }
  return out;
}
export default function (host) {
  let mode = 'all';
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'Pest numbers over 20 weeks with no control, with chemical spraying and with a biological control agent' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Show', [['all', 'All three'], ['none', 'No control'], ['chem', 'Chemical spray'], ['bio', 'Biocontrol']], mode, (v) => { mode = v; go(); });
  const go = () => { ro.textContent = { all: 'Compare the three. Pesticide gives short relief and then the pest comes back stronger; biocontrol brings the pest down and keeps it down.', none: 'No control: the pest multiplies until food limits it, at a very high number: the crop is lost.', chem: 'Chemical spray at weeks 4, 8, 12 and 16: each spray kills fewer pests, as resistant ones survive, and it also kills beneficial insects. Pollution and poisoning follow.', bio: 'A natural enemy added at week 4 (for example the ladybird that eats aphids): predator and pest rise and fall in small cycles around a low pest level. No poison is left behind.' }[mode]; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Pest numbers on a crop (illustrative)', col);
    const A = axes(ctx, w, h, col, { x: [0, W], y: [0, 100], xlabel: 'weeks', ylabel: 'pests per plant', l: 48, t: t0 + 8, b: 40, xt: [0, 5, 10, 15, 20], yt: [0, 25, 50, 75, 100] });
    const L = [['none', 'no control', col.s[3]], ['chem', 'chemical spray', col.s[2]], ['bio', 'biocontrol', col.s[0]]];
    ctx.save(); A.clip();
    L.forEach(([k, , c]) => { if (mode !== 'all' && mode !== k) return; line(ctx, run(k).map(([t, p]) => [A.X(t), A.Y(Math.min(p, 100))]), c, 3); });
    ctx.restore();
    L.forEach(([k, n, c], i) => { if (mode !== 'all' && mode !== k) return; text(ctx, n, A.L + 8, A.T + 12 + i * 14, { color: c, size: 10.5, weight: 700 }); });
  };
  go();
}
