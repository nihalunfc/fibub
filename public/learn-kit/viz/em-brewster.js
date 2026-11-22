// Polarisation by reflection and Malus's law. "Reflection": unpolarised light (dots = polarised ⊥ to the page, bars = in the
// page) meets glass. The reflected ray keeps more of the dots. At Brewster's angle tanθB = n₂/n₁ the in-page part is not
// reflected at all, and the reflected and refracted rays are at 90°. "Polaroids": each polaroid passes the component along its
// axis, I = I₀cos²θ; try crossed polaroids, then add a third in between at 45° and light gets through.
import { canvas, text, row, slider, choice, readout, line, arrow } from '../kit.js';

export default function (host) {
  let mode = 'refl', th = 40, n2 = 1.5, p2 = 90, p3 = 45, use3 = true;
  const cv = canvas(host, { aspect: 0.8, max: 380, min: 280, label: 'Reflection at Brewster angle and light through crossed polaroids' });
  const ctl = row(host), c2 = row(host);
  choice(ctl, 'Show', [['refl', 'Reflection (Brewster)'], ['pol', 'Polaroids (Malus)']], mode, (v) => { mode = v; mk(); upd(); });
  function mk() { c2.innerHTML = '';
    if (mode === 'refl') { slider(c2, { label: 'Angle of incidence', min: 0, max: 89, value: th, step: 1, fmt: (x) => x + '°', oninput: (x) => { th = x; upd(); } }); slider(c2, { label: 'Glass index n', min: 1.2, max: 2.4, value: n2, step: 0.05, fmt: (x) => x.toFixed(2), oninput: (x) => { n2 = x; upd(); } }); }
    else { slider(c2, { label: '2nd polaroid axis', min: 0, max: 180, value: p2, step: 5, fmt: (x) => x + '°', oninput: (x) => { p2 = x; upd(); } }); choice(c2, 'Middle polaroid', [[true, 'Add at angle'], [false, 'Remove']], use3, (v) => { use3 = v; upd(); }); slider(c2, { label: 'Middle axis', min: 0, max: 90, value: p3, step: 5, fmt: (x) => x + '°', oninput: (x) => { p3 = x; upd(); } }); } }
  const out = readout(host);
  const R = Math.PI / 180;
  const rr = () => { const ti = th * R, s = Math.sin(ti) / n2, tt = Math.asin(s), ci = Math.cos(ti), ct = Math.cos(tt), rs = (ci - n2 * ct) / (ci + n2 * ct), rp = (ct - n2 * ci) / (ct + n2 * ci); return { rs: rs * rs, rp: rp * rp, tt }; };
  const chain = () => { const angs = use3 ? [0, p3, p2] : [0, p2]; let I = 0.5, s = [0.5]; for (let i = 1; i < angs.length; i++) { I *= Math.cos((angs[i] - angs[i - 1]) * R) ** 2; s.push(I); } return { angs, s }; };
  function upd() {
    if (mode === 'refl') { const r = rr(), tb = Math.atan(n2) / R; out.innerHTML = `Brewster angle θB = atan(n) = <b>${tb.toFixed(1)}°</b>. At ${th}°: reflected share of ⊥ (dots) ${(r.rs * 100).toFixed(1)}%, of in-page (bars) ${(r.rp * 100).toFixed(2)}%. ${Math.abs(th - tb) < 1.2 ? '<b>At Brewster: reflected light is completely polarised</b> (dots only), and θ + θ₂ = 90°. This is how polarising sunglasses cut glare from water and roads.' : 'Move to the Brewster angle and the bars vanish from the reflected ray.'}`; }
    else { const c = chain(); out.innerHTML = `After the first polaroid: ${(c.s[0] * 100).toFixed(0)}% of the unpolarised beam (I₀/2), polarised along 0°. ${c.angs.slice(1).map((a, i) => `After the ${use3 && i === 0 ? 'middle' : 'last'} one at ${a}°: ${(c.s[i + 1] * 100).toFixed(1)}%`).join('; ')}. Each step multiplies by cos² of the angle <i>between neighbours</i>. Crossed polaroids pass nothing; a 45° sheet in between passes 12.5% of I₀.`; }
    cv.redraw(); }
  const pol = (ctx, x, y, ang, a, col, c) => { ctx.save(); ctx.translate(x, y); ctx.rotate(-ang * R); ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -a); ctx.lineTo(0, a); ctx.stroke(); ctx.restore(); };
  cv.draw = (ctx, w, h, col) => {
    if (mode === 'refl') {
      const cy = h * 0.55, cx = w / 2, L = Math.min(w, h) * 0.4, a1 = th * R, r = rr();
      ctx.globalAlpha = 0.12; ctx.fillStyle = col.s[4]; ctx.fillRect(0, cy, w, h - cy); ctx.globalAlpha = 1; line(ctx, [[0, cy], [w, cy]], col.ink, 1.6); line(ctx, [[cx, cy - L], [cx, cy + L]], col.muted, 1, [4, 4]);
      const pt = (a, dd) => [cx + Math.sin(a) * dd, cy - Math.cos(a) * dd], mark = (p, a, ns, nbar, c) => { for (let k = 0; k < ns; k++) { const q = [p[0] + (Math.cos(a) * 0), p[1]]; } };
      const syms = (A, B, a, nd, nb, c) => { for (let k = 1; k <= 4; k++) { const f = 0.2 + k * 0.17, p = [A[0] + (B[0] - A[0]) * f, A[1] + (B[1] - A[1]) * f]; if (nd >= k * 0.99 - 0.5) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(p[0], p[1], 3, 0, 7); ctx.fill(); } if (nb >= k - 0.5) { ctx.strokeStyle = c; ctx.lineWidth = 2; const nx = Math.cos(a), ny = Math.sin(a); ctx.beginPath(); ctx.moveTo(p[0] - nx * 5, p[1] - ny * 5); ctx.lineTo(p[0] + nx * 5, p[1] + ny * 5); ctx.stroke(); } } };
      line(ctx, [pt(-a1, L), [cx, cy]], col.s[6], 3); syms(pt(-a1, L), [cx, cy], 0, 4, 4, col.s[5]); 
      const w1 = 1 + 6 * (r.rs + r.rp) / 2; line(ctx, [[cx, cy], pt(a1, L)], col.s[1], w1); syms([cx, cy], pt(a1, L), 0, 4 * Math.min(1, r.rs * 3 + 0.2), 4 * Math.min(1, r.rp * 3), col.s[1]);
      const tt = r.tt; line(ctx, [[cx, cy], [cx + Math.sin(tt) * L, cy + Math.cos(tt) * L]], col.s[2], 1 + 6 * (1 - (r.rs + r.rp) / 2)); syms([cx, cy], [cx + Math.sin(tt) * L, cy + Math.cos(tt) * L], 0, 4, 4, col.s[2]);
      text(ctx, '● ⊥ to page   | in the page', 10, 16, { color: col.ink, size: 11.5, weight: 700 }); text(ctx, `θ = ${th}°   Brewster ${(Math.atan(n2) / R).toFixed(1)}°`, 10, h - 10, { color: col.muted, size: 11 });
      if (Math.abs(th - Math.atan(n2) / R) < 1.5) text(ctx, 'reflected: dots only', cx + 20, cy - L - 2 + 12, { color: col.s[1], size: 11, weight: 700 });
    } else {
      const c = chain(), n = c.angs.length, cy = h * 0.3, x0 = 40, dx = (w - 80) / n, bar = h - 110;
      ctx.fillStyle = col.s[6]; ctx.globalAlpha = 0.4; ctx.fillRect(4, cy - 6, 30, 12); ctx.globalAlpha = 1; text(ctx, 'light', 6, cy + 20, { color: col.muted, size: 10 });
      c.angs.forEach((a, i) => { const x = x0 + dx * (i + 0.5); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, cy, 26, 0, 7); ctx.stroke(); pol(ctx, x, cy, a, 24, col, col.s[5]); for (let k = -2; k <= 2; k++) { ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); const px = x + k * 8 * Math.cos(-a * R), py = cy + k * 8 * Math.sin(-a * R); ctx.moveTo(px - 12 * Math.sin(a * R), py - 12 * Math.cos(a * R) * -1 * 0); ctx.lineTo(px, py); ctx.stroke(); } text(ctx, `${a}°`, x, cy + 40, { color: col.ink, size: 11, weight: 700, align: 'center' }); const bw = Math.max(1, c.s[i] * 2 * (h - 190)); ctx.fillStyle = col.s[1]; ctx.fillRect(x - 12, h - 20 - bw * 1, 24, bw); text(ctx, (c.s[i] * 100).toFixed(0) + '%', x, h - 24 - bw, { color: col.ink, size: 10.5, align: 'center' }); });
      text(ctx, 'Transmitted intensity after each polaroid (bars)', 10, 16, { color: col.ink, size: 11.5, weight: 700 });
    }
  };
  mk(); upd();
}
