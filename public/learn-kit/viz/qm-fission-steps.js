// Fission as a liquid drop, step by step. A slow neutron adds just enough energy to make U-236 wobble; the drop stretches,
// the surface tension that held it together loses to the electric repulsion of 92 protons, a neck forms and snaps, and the two
// fragments are flung apart. Then the energy tally: about 200 MeV, mostly the fragments' motion. Use the steps or the slider.
import { canvas, text, title, row, slider, readout, arrow, line, ease, loop, calm } from '../kit.js';

const STEPS = ['U-235 absorbs a slow neutron', 'U-236 wobbles (excited drop)', 'Stretches into a peanut', 'Neck thins', 'Scission: the drop splits', 'Fragments fly apart, neutrons escape', 'Where the 200 MeV goes'];
export default function (host) {
  const cv = canvas(host, { aspect: 0.85, max: 460, min: 320, label: 'A uranium nucleus absorbing a neutron, deforming and splitting in two' });
  let k = 0, s = 0, tgt = 0;
  const ctl = row(host), out = readout(host);
  const sl = slider(ctl, { label: 'Stage', min: 0, max: 6, step: 0.01, value: 0, fmt: (v) => STEPS[Math.round(v)].split(':')[0].slice(0, 22), oninput: (v) => { s = v; tgt = v; cv.redraw(); show(); } });
  const anim = loop(host, (dt) => { if (Math.abs(tgt - s) > 0.005) { s += Math.sign(tgt - s) * Math.min(Math.abs(tgt - s), dt * 1.6); sl.set(s); cv.redraw(); show(); } });
  function show() {
    const i = Math.round(s), T = ['Binding energy per nucleon is about 7.6 MeV for U, 8.5 MeV for the middle-mass fragments. Slow neutrons are enough because U-236 is even-even: the extra pairing energy lifts it above the fission barrier (about 6 MeV).', 'The excited nucleus is a charged liquid drop. It oscillates in shape; when the stretch passes a critical size the electric repulsion wins.', 'Surface energy wants a sphere; Coulomb energy wants the charges far apart. The deformation grows by itself: this is the fission barrier being crossed.', 'The two lobes are now each almost a nucleus of their own; the narrow neck is a few nucleons wide.', 'The neck snaps. At that instant the fragments are touching, about 2 R apart, so their Coulomb energy is about 170 MeV.', 'The fragments (for example Ba-141 and Kr-92) fly apart at about 1.5 cm per µs, shedding 2 to 3 prompt neutrons that can start the chain reaction.', 'Per fission: fragment motion about 168 MeV, prompt neutrons 5, prompt γ 7, β and γ from the fragments 14 (about 200 MeV in all; neutrinos carry another ~10).'][i];
    out.innerHTML = `<b>${i + 1}. ${STEPS[i]}.</b> ${T}`; }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Liquid-drop picture of fission', col);
    const cx = w / 2, cy = h * 0.42, R = Math.min(w, h) * 0.13;
    const drop = (x, y, r, sx, sy, c) => { ctx.beginPath(); ctx.ellipse(x, y, r * sx, r * sy, 0, 0, 7); ctx.fillStyle = c; ctx.globalAlpha = 0.45; ctx.fill(); ctx.globalAlpha = 1; ctx.lineWidth = 2; ctx.strokeStyle = c; ctx.stroke(); };
    const i = s;
    if (i < 1) { const f = ease(Math.min(1, i)); const nx = cx - R * 3.2 + f * R * 2.2; drop(cx, cy, R, 1, 1, col.s[0]); ctx.beginPath(); ctx.arc(nx, cy, 5, 0, 7); ctx.fillStyle = col.s[1]; ctx.fill(); text(ctx, 'n', nx, cy - 12, { color: col.s[1], size: 11, weight: 700, align: 'center' }); text(ctx, 'U-235', cx, cy + R + 16, { color: col.muted, size: 11, align: 'center' }); }
    else if (i < 2) { const f = (i - 1); const w_ = 1 + 0.12 * Math.sin(f * 6.28 * 2); drop(cx, cy, R * 1.02, w_, 2 - w_, col.s[0]); text(ctx, 'U-236*', cx, cy + R + 18, { color: col.muted, size: 11, align: 'center' }); }
    else if (i < 4.7) { const f = Math.min(1, (i - 2) / 2.7); const d = R * 0.78 * ease(f) * 1.2 + R * 0.08, r2 = R * (0.85 - 0.12 * f), neck = Math.max(0, 1 - f * 1.15);
      const nh = r2 * 0.8 * neck; ctx.beginPath(); ctx.moveTo(cx - d + r2, cy); ctx.arc(cx - d, cy, r2, 0, 7); ctx.moveTo(cx + d + r2, cy); ctx.arc(cx + d, cy, r2, 0, 7);
      if (neck > 0) ctx.rect(cx - d, cy - nh, 2 * d, 2 * nh);
      ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.55; ctx.fill(); ctx.globalAlpha = 1;
      text(ctx, i < 3.5 ? 'peanut' : 'neck', cx, cy + R * 1.6 + 6, { color: col.muted, size: 11, align: 'center' }); }
    else if (i < 6) { const f = Math.min(1, (i - 4.7) / 1.3), d = R * 1.1 + f * Math.min(w * 0.3, R * 3.4); drop(cx - d, cy, R * 0.82, 1, 1, col.s[0]); drop(cx + d, cy, R * 0.82, 1, 1, col.s[2]);
      text(ctx, 'Ba-141', cx - d, cy + R * 0.82 + 14, { color: col.muted, size: 10, align: 'center' }); text(ctx, 'Kr-92', cx + d, cy + R * 0.82 + 14, { color: col.muted, size: 10, align: 'center' });
      arrow(ctx, cx - d - R, cy, cx - d - R - 24 * f, cy, col.ink, 2); arrow(ctx, cx + d + R, cy, cx + d + R + 24 * f, cy, col.ink, 2);
      if (i > 5.2) [[-0.4, -2.2], [0.1, 2.3], [0.4, -2.4]].forEach(([dx, dy], j) => { const g = (i - 5.2) / 0.8; ctx.beginPath(); ctx.arc(cx + dx * R * 2 * g, cy + dy * R * 0.55 * g, 4, 0, 7); ctx.fillStyle = col.s[1]; ctx.fill(); }); }
    else { drop(cx - R * 2.2, cy - R * 0.7, R * 0.45, 1, 1, col.s[0]); drop(cx + R * 2.2, cy - R * 0.7, R * 0.45, 1, 1, col.s[2]); }
    // energy tally bar (always, fills in at step 6)
    const bx = 16, by = h - 62, bw = w - 32, f = ease(Math.max(0, Math.min(1, i - 5)));
    if (i < 5) return;
    const parts = [['fragments 168', 168, col.s[0]], ['neutrons 5', 5, col.s[1]], ['γ 7', 7, col.s[2]], ['β, γ later 14', 14, col.s[3]]];
    let x = bx; ctx.strokeStyle = col.line; ctx.strokeRect(bx, by, bw, 18);
    parts.forEach(([t, v, c]) => { const ww = (v / 194) * bw * f; ctx.fillStyle = c; ctx.fillRect(x, by, ww, 18); x += ww; });
    if (f > 0.8) { text(ctx, 'fragments 168 MeV', bx + 6, by + 9, { color: col.bg, size: 10, weight: 700, fit: false }); text(ctx, 'other ≈ 26 MeV', bx + bw, by + 34, { color: col.muted, size: 10, align: 'right' }); }
    text(ctx, 'energy released ≈ 200 MeV per U-235', bx, by - 8, { color: col.muted, size: 10.5 });
  };
  show();
  return { step(i) { tgt = Math.max(0, Math.min(6, i)); if (calm()) { s = tgt; sl.set(s); cv.redraw(); show(); } } };
}
