// Why Maxwell added the displacement current. A capacitor is charging. Ampère's law ∮B·dl = μ₀I_enc around a loop needs a
// surface. A flat surface through the gap is crossed by no wire, a bag-shaped surface that goes round a plate is cut by the
// wire, and the two disagree, unless the changing electric field in the gap counts as a current I_d = ε₀ dΦ_E/dt. Slide the
// loop radius r: inside the plates B grows with r, outside it falls as 1/r, with the same B either way.
import { canvas, axes, line, text, row, slider, choice, readout, loop, dot, arrow } from '../kit.js';

export default function (host) {
  let I = 2, r = 1.4, surf = 'flat', t = 0;
  const A = 0.02; // plate radius 2 cm
  const cv = canvas(host, { aspect: 1.2, max: 460, min: 380, label: 'A charging capacitor with an Ampere loop and two surfaces' });
  const ctl = row(host), c2 = row(host);
  choice(ctl, 'Surface bounded by the loop', [['flat', 'Flat (through the gap)'], ['bag', 'Bag (cut by the wire)']], surf, (v) => { surf = v; upd(); });
  slider(c2, { label: 'Loop radius r / plate radius', min: 0.2, max: 2.2, value: r, step: 0.05, fmt: (x) => x.toFixed(2), oninput: (x) => { r = x; upd(); } });
  slider(c2, { label: 'Charging current I', min: 0.5, max: 5, value: I, step: 0.5, fmt: (x) => x.toFixed(1) + ' A', oninput: (x) => { I = x; upd(); } });
  const out = readout(host);
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); }); anim.button(c2);
  const Bf = (x) => 2e-7 * I * (x <= 1 ? x : 1 / x) / A; // tesla, x = r/a
  function upd() { const inside = r < 1, ienc = inside ? I * r * r : I, how = surf === 'bag' && inside ? 'a bag around a plate is not possible inside the plates (it would hit the plate), so use the flat surface' : surf === 'flat' ? `flat surface: no wire passes through; the electric flux in the gap gives I<sub>d</sub> = ε₀dΦ<sub>E</sub>/dt = ${ienc.toFixed(2)} A` : `bag surface: the wire carries I<sub>c</sub> = ${I.toFixed(1)} A through it and there is no E-field flux, so I<sub>d</sub> = 0`;
    out.innerHTML = `Loop of radius ${(r * A * 100).toFixed(1)} cm (plates: 2 cm). With ${how}: enclosed current <b>${ienc.toFixed(2)} A</b>, so B = <b>${(Bf(r) * 1e6).toFixed(1)} µT</b>. Without the displacement term the two surfaces would give different B, which is absurd.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const cx = w / 2, Pn = 54, gap = 36, y0 = 112, R = 40, rr = r * R;
    line(ctx, [[8, y0], [cx - gap / 2, y0]], col.ink, 2.4); line(ctx, [[cx + gap / 2, y0], [w - 8, y0]], col.ink, 2.4);
    ctx.fillStyle = col.ink; ctx.fillRect(cx - gap / 2 - 3, y0 - R, 3, 2 * R); ctx.fillRect(cx + gap / 2, y0 - R, 3, 2 * R);
    const n = 1 + Math.round(5 * ((t * 0.4) % 1)); for (let k = 0; k < 7; k++) { const yy = y0 - R + 8 + k * (2 * R - 16) / 6; text(ctx, '+', cx - gap / 2 - 9, yy, { color: col.s[5], size: 11, weight: 700, align: 'center' }); text(ctx, '−', cx + gap / 2 + 9, yy, { color: col.s[0], size: 11, weight: 700, align: 'center' }); if (k % 1 === 0) arrow(ctx, cx - gap / 2 + 3, yy, cx + gap / 2 - 1, yy, col.s[2], 1.4 + 0.3 * n / 3, 5); }
    for (let k = 0; k < 3; k++) { const x = 20 + ((t * 40 + k * 60) % (cx - gap / 2 - 24)); arrow(ctx, x, y0 - 10, x + 14, y0 - 10, col.s[5], 1.6, 5); }
    text(ctx, 'E grows in the gap', 12, 16, { color: col.s[2], size: 11, weight: 700 }); text(ctx, 'wire current I', 12, y0 + 18, { color: col.s[5], size: 10.5, weight: 700 });
    // the loop seen edge-on (vertical line at x = cx, from -rr to +rr) and its surfaces
    const use = surf === 'bag' && r >= 1 ? 'bag' : 'flat';
    if (use === 'flat') { ctx.globalAlpha = 0.18; ctx.fillStyle = col.s[2]; ctx.fillRect(cx - 2, y0 - rr, 4, 2 * rr); ctx.globalAlpha = 1; }
    else { ctx.globalAlpha = 0.18; ctx.fillStyle = col.s[5]; ctx.beginPath(); ctx.moveTo(cx, y0 - rr); ctx.quadraticCurveTo(cx - gap / 2 - 60, y0 - rr * 0.7, cx - gap / 2 - 50, y0); ctx.quadraticCurveTo(cx - gap / 2 - 60, y0 + rr * 0.7, cx, y0 + rr); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[5]; ctx.lineWidth = 1.4; ctx.setLineDash([4, 3]); ctx.stroke(); ctx.setLineDash([]); }
    dot(ctx, cx, y0 - rr, 5, col.s[1], col.panel); dot(ctx, cx, y0 + rr, 5, col.s[1], col.panel); text(ctx, '⊙', cx + 12, y0 - rr, { color: col.s[1], size: 12 }); text(ctx, '⊗', cx + 12, y0 + rr, { color: col.s[1], size: 12 });
    const G = axes(ctx, w, h, col, { x: [0, 2.2], y: [0, 1.15 * Bf(1) * 1e6], xlabel: 'loop radius r / plate radius', ylabel: 'B (µT)', l: 44, t: 222, b: 34, xt: [0, 1, 2], yt: [0, Bf(1) * 1e6], fy: (v) => v.toFixed(0) });
    line(ctx, Array.from({ length: 111 }, (_, i) => [G.X(i * 0.02), G.Y(Bf(i * 0.02 + 0.001) * 1e6)]), col.s[0], 2.4); dot(ctx, G.X(r), G.Y(Bf(r) * 1e6), 5.5, col.s[5], col.panel);
    text(ctx, 'B ∝ r inside', G.X(0.3), G.Y(Bf(0.3) * 1e6) - 14, { color: col.muted, size: 10.5 }); text(ctx, 'B ∝ 1/r outside', G.X(1.55), G.Y(Bf(1.55) * 1e6) - 16, { color: col.muted, size: 10.5 });
  };
  upd();
}
