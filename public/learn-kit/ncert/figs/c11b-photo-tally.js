// Class 11 Biology, Photosynthesis: the cost of making sugar. Each CO2 fixed in the Calvin cycle needs 3 ATP and 2 NADPH (C3 plants), or 5 ATP and 2 NADPH in a C4 plant,
// which spends 2 extra ATP per CO2 on the C4 shuttle. Six CO2 make one glucose.
import { canvas, text, title, axes, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let n = 6, type = 'c3';
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'Bar chart of ATP and NADPH used and glucose made for a chosen number of CO2 molecules fixed, for C3 and C4 plants' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Plant', [['c3', 'C3 (Calvin only)'], ['c4', 'C4 (with shuttle)']], type, (v) => { type = v; go(); });
  slider(ctl, { label: 'CO₂ fixed', min: 1, max: 24, step: 1, value: n, fmt: (v) => String(Math.round(v)), oninput: (v) => { n = Math.round(v); go(); } });
  const atp = () => n * (type === 'c3' ? 3 : 5), nadph = () => 2 * n;
  const go = () => {
    ro.textContent = `${n} CO₂ → ${n} turns of the cycle → ${atp()} ATP + ${nadph()} NADPH used → ${(n / 6).toFixed(2).replace(/\.00$/, '')} glucose (6 carbons each). Per glucose: ${type === 'c3' ? '18' : '30'} ATP and 12 NADPH. ${type === 'c4' ? 'The 2 extra ATP per CO₂ pay for pumping CO₂ into the bundle sheath, which almost stops photorespiration.' : ''}`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, `${n} CO₂ fixed: what does it cost?`, col), mx = Math.max(60, atp() + 4);
    const A = axes(ctx, w, h, col, { x: [0, 4], y: [0, mx], xlabel: '', ylabel: 'molecules', l: 48, t: t0 + 10, b: 52, xt: [], yt: [0, Math.round(mx / 2), Math.round(mx)] });
    const bars = [['CO₂', n, col.s[2]], ['ATP', atp(), col.s[3]], ['NADPH', nadph(), col.s[1]], ['glucose', n / 6, col.s[0]]], bw = (A.R - A.L) / 4;
    bars.forEach(([nm, v, c], i) => { const x = A.L + i * bw + bw * 0.2, y = A.Y(v); ctx.fillStyle = c; ctx.fillRect(x, y, bw * 0.6, A.B - y); text(ctx, nm, x + bw * 0.3, A.B + 14, { color: col.ink, size: 11, weight: 600, align: 'center' }); text(ctx, String(+v.toFixed(2)), x + bw * 0.3, y - 9, { color: col.ink, size: 11, weight: 700, align: 'center' }); });
  };
  go();
}
