// Class 12 Chemistry, Biomolecules: how an enzyme works (lock-and-key / induced fit) and how its rate depends on substrate and on an inhibitor.
// Substrates (S) fit the active site of the enzyme (E), form ES, and leave as product (P). Rate v = Vmax [S] / (Km + [S]) (Michaelis-Menten): the rate levels off when every enzyme is busy (saturation).
// A competitive inhibitor looks like the substrate, blocks the active site and raises the apparent Km (here Km x 3) without changing Vmax: a lot of substrate beats it. Values are illustrative (Vmax = 100, Km = 2 mM).
import { canvas, text, title, axes, line, dot, row, choice, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let inh = 0, S = 2, t = 0;
  const cv = canvas(host, { aspect: 1.1, max: 440, min: 340, label: 'An enzyme active site binding substrate molecules, with a rate against substrate curve and an inhibitor option' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'inhibitor', [[0, 'none'], [1, 'competitive inhibitor']], inh, (v) => { inh = v; go(); });
  slider(ctl, { label: 'substrate [S] (mM)', min: 0.1, max: 20, value: S, log: true, fmt: (v) => v.toFixed(1), oninput: (v) => { S = v; go(); } });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const Km = () => (inh ? 6 : 2), rate = (s) => 100 * s / (Km() + s);
  const go = () => { ro.textContent = `[S] = ${S.toFixed(1)} mM, K_m = ${Km()} mM: rate = ${rate(S).toFixed(0)} % of the maximum. ${S > 5 * Km() ? 'Nearly every enzyme is busy: more substrate hardly helps (saturation).' : S < Km() / 2 ? 'Few enzymes are working: the rate is almost proportional to [S].' : 'In between.'} ${inh ? 'The inhibitor shares the active site, so more substrate is needed to reach the same rate.' : ''}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Enzyme and substrate', col), ph = h * 0.4, ex = w * 0.26, ey = top + ph * 0.55, rs = Math.min(w * 0.12, 44);
    // enzyme body with a notch (active site)
    ctx.fillStyle = col.soft; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(ex, ey, rs, 0, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = col.panel; ctx.beginPath(); ctx.moveTo(ex + rs * 0.2, ey - rs * 1.02); ctx.lineTo(ex + rs * 1.05, ey - rs * 0.38); ctx.lineTo(ex + rs * 1.05, ey + rs * 0.38); ctx.lineTo(ex + rs * 0.2, ey + rs * 1.02); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = col.s[0]; ctx.beginPath(); ctx.moveTo(ex + rs * 0.5, ey - rs * 0.6); ctx.lineTo(ex + rs * 0.3, ey); ctx.lineTo(ex + rs * 0.5, ey + rs * 0.6); ctx.stroke();
    text(ctx, 'enzyme', ex - rs * 0.4, ey, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, 'active site', ex + rs * 0.9, ey + rs * 1.3, { color: col.muted, size: 10, align: 'center' });
    // moving substrates
    const n = Math.max(1, Math.round(Math.min(S, 20) / 2.5)), sx0 = ex + rs * 1.2;
    for (let i = 0; i < n + 1; i++) { const ph2 = ((t * 0.25 * (0.6 + 0.2 * (i % 3)) + i * 0.37) % 1), x = w - 16 - ph2 * (w - 16 - sx0 - rs * 0.3), y = ey + (i % 3 - 1) * rs * 0.8 * (1 - (ph2 < 0.2 ? 0 : 0)); const isI = inh && i % 2 === 1, bound = ph2 > 0.94; ctx.fillStyle = isI ? col.s[2] : col.s[3]; ctx.beginPath(); if (isI) ctx.rect(x - 6, y - 6, 12, 12); else ctx.arc(x, y, 6, 0, 7); ctx.fill(); }
    if (inh) text(ctx, '● substrate   ■ inhibitor (looks like substrate)', w / 2, top + ph + 2, { color: col.muted, size: 10, align: 'center' });
    // rate curve
    const A = axes(ctx, w, h, col, { x: [0, 20], y: [0, 110], xlabel: 'substrate concentration [S] (mM)', ylabel: 'rate (% of max)', l: 46, t: top + ph + 14, b: 38, fx: (v) => String(v) });
    const pts = []; for (let i = 0; i <= 100; i++) { const s = i / 5; pts.push([A.X(s), A.Y(rate(s))]); }
    ctx.save(); A.clip(); line(ctx, pts, inh ? col.s[2] : col.s[0], 3); ctx.restore();
    if (inh) { const p0 = []; for (let i = 0; i <= 100; i++) { const s = i / 5; p0.push([A.X(s), A.Y(100 * s / (2 + s))]); } ctx.save(); A.clip(); ctx.globalAlpha = 0.4; line(ctx, p0, col.s[0], 2, [4, 3]); ctx.restore(); }
    ctx.save(); ctx.setLineDash([4, 3]); ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(A.L, A.Y(100)); ctx.lineTo(A.R, A.Y(100)); ctx.stroke(); ctx.restore(); text(ctx, 'Vmax', A.R - 4, A.Y(100) - 8, { color: col.muted, size: 10, align: 'right' });
    dot(ctx, A.X(Math.min(S, 20)), A.Y(rate(S)), 6.5, col.s[3], col.panel);
  };
  go();
}
