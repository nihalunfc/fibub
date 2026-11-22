// Where radiation comes from: a kink in the field lines (a step player; or slide the time). A charge sits still, then is given a
// quick push and moves on at speed β c. News of the push spreads outward at c. Inside the shell (radius ct) the field lines
// point away from the charge's new position; outside, they still point away from where it would have been. The shell joins the two
// with a sideways kink: a transverse field E⊥ = E_r × (a t sinθ)/c, which falls only as 1/r. That is the radiation field.
import { canvas, text, row, slider, readout, loop, dot, arrow, line } from '../kit.js';

const TXT = ['Charge at rest: radial lines, straight out, field ∝ 1/r².', 'The push happens at t = 0. News has only just left.', 'Later: a thin shell of radius ct has spread out. Inside it the lines come from the charge\'s new position, outside from the old.', 'Later still: the kink has grown. At θ = 90° it is the largest, along the direction of motion there is no kink.', 'The kink is a sideways field E⊥ = qa sinθ/(4πε₀c²r): it carries energy away to infinity.'];
export default function (host) {
  let b = 0.2, T = 0.55, stage = 2;
  const cv = canvas(host, { aspect: 0.9, max: 420, min: 320, label: 'Electric field lines of a charge given a sudden push, showing the radiation kink' });
  const ctl = row(host);
  const sT = slider(ctl, { label: 'Time since the push', min: 0, max: 1, value: T, step: 0.01, fmt: (x) => x.toFixed(2), oninput: (x) => { T = x; upd(); } });
  slider(ctl, { label: 'Speed after push β', min: 0.05, max: 0.4, value: b, step: 0.01, fmt: (x) => x.toFixed(2) + ' c', oninput: (x) => { b = x; upd(); } });
  const out = readout(host);
  const anim = loop(host, (dt) => { T = (T + dt * 0.18) % 1.0; sT.set(T); cv.redraw(); upd2(); }, { autoplay: false }); anim.button(ctl);
  function upd2() { const r = T * 150; out.innerHTML = `${TXT[stage]} Shell radius ct = ${r.toFixed(0)} units. At θ = 90°: E⊥/E<sub>r</sub> = a t sinθ/c = βt/τ ≈ <b>${(T > 0.02 ? b * T * 150 / 10 : 0).toFixed(1)}</b> (push lasted τ = 10 units). Radiation field falls as 1/r, the Coulomb field as 1/r².`; }
  function upd() { upd2(); cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const cx = w * 0.4, cy = h * 0.5, R = T * Math.min(w * 0.55, h * 0.45), tau = 10 * (Math.min(w * 0.55, h * 0.45) / 150), Rin = Math.max(0, R - tau), xc = b * Math.max(0, R - tau * 0.5), N = 20;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.3;
    for (let k = 0; k < N; k++) { const a = (k + 0.5) / N * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a), far = Math.hypot(w, h);
      if (R < 3) { line(ctx, [[cx, cy], [cx + ca * far, cy + sa * far]], col.ink, 1.3); continue; }
      // inner segment from the new position P=(xc,0) in direction a until it meets the circle radius Rin about O
      const P = [cx + xc, cy]; let tin = 0; { const bq = (xc * ca), c0 = xc * xc - Rin * Rin; const disc = bq * bq - c0; tin = disc > 0 ? -bq + Math.sqrt(disc) : 0; }
      const S1 = [P[0] + ca * tin, P[1] + sa * tin], S2 = [cx + ca * R, cy + sa * R];
      ctx.beginPath(); ctx.moveTo(P[0], P[1]); ctx.lineTo(S1[0], S1[1]); ctx.lineTo(S2[0], S2[1]); ctx.lineTo(cx + ca * far, cy + sa * far); ctx.stroke(); }
    ctx.strokeStyle = col.s[5]; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke(); ctx.setLineDash([]);
    if (R > 8) text(ctx, 'shell r = ct', cx + R * 0.7 + 4, cy - R * 0.7 - 2, { color: col.s[5], size: 10.5, weight: 700 });
    dot(ctx, cx, cy, 3.5, col.muted); dot(ctx, cx + xc, cy, 6, col.s[5], col.panel); text(ctx, 'q', cx + xc + 10, cy - 10, { color: col.s[5], size: 12, weight: 700 });
    if (stage >= 3 && R > 30) { const a = Math.PI / 2 * 0.98, px = cx + Math.cos(a) * R, py = cy - Math.sin(a) * R; arrow(ctx, px + 16, py + 22, px + 16 + 28, py + 22, col.s[2], 2.2, 7); text(ctx, 'E⊥', px + 50, py + 22, { color: col.s[2], size: 11, weight: 700 }); }
    text(ctx, TXT[stage].split(':')[0].slice(0, 46), 10, 16, { color: col.ink, size: 11, weight: 700 });
  };
  upd();
  return { step(i, n) { stage = Math.max(0, Math.min(4, Math.round(i * 4 / Math.max(1, n - 1)))); T = [0, 0.15, 0.4, 0.75, 0.85][stage]; sT.set(T); anim.pause(); upd(); } };
}
