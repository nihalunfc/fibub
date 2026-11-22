// SN2 against SN1 on one carbon, in 3D. SN2: the nucleophile pushes in from the back while the leaving group leaves from the
// front in one step; the three other groups flip like an umbrella in the wind (Walden inversion). SN1: the leaving group goes
// first, leaving a flat carbocation, then the nucleophile can attack from either face (so a chiral centre racemises). Drag
// to turn, slide or play; the energy graph shows one hump (SN2) or two humps with a valley (SN1). Works as a step player.
import { canvas, text, row, slider, choice, readout, loop, title } from '../kit.js';
import { orbit } from './_3d.js';

const ease = (a) => a * a * (3 - 2 * a);
function curve(pts, t) { for (let i = 1; i < pts.length; i++) if (t <= pts[i][0]) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], u = ease((t - x0) / (x1 - x0)); return y0 + (y1 - y0) * u; } return pts[pts.length - 1][1]; }
const PRO = { sn2: [[0, 0], [0.5, 70], [1, -15]], sn1: [[0, 0], [0.22, 80], [0.5, 48], [0.75, 60], [1, -15]] };
export default function (host) {
  let mech = 'sn2', face = 1, t = 0, target = null, playing = false;
  const cv = canvas(host, { aspect: 1.0, max: 470, min: 340, label: 'A carbon undergoing substitution with the groups shown in 3D and an energy profile' });
  const cam = orbit(cv, { yaw: 0.45, pitch: 0.35 });
  const c1 = row(host), c2 = row(host);
  choice(c1, 'Mechanism', [['sn2', 'SN2 (one step)'], ['sn1', 'SN1 (two steps)']], mech, (v) => { mech = v; t = 0; target = null; sl.set(0); show(); });
  choice(c1, 'Nu attacks (SN1)', [[1, 'from the left'], [-1, 'from the right']], face, (v) => { face = v; show(); });
  const sl = slider(c2, { label: 'Progress of reaction', min: 0, max: 1, step: 0.01, value: 0, fmt: (v) => Math.round(v * 100) + '%', oninput: (v) => { t = v; target = null; playing = false; show(); } });
  loop(host, (dt) => {
    if (target !== null) { t += (target - t) * Math.min(1, dt * 3); if (Math.abs(target - t) < 0.002) { t = target; target = null; } sl.set(t); show(); }
    else if (playing) { t += dt * 0.12; if (t >= 1) { t = 1; playing = false; } sl.set(t); show(); }
  });
  const pb = document.createElement('button'); pb.type = 'button'; pb.className = 'lk-btn'; pb.textContent = '▶ Play'; pb.addEventListener('click', () => { if (t >= 1) t = 0; playing = !playing; pb.textContent = playing ? '❚❚ Pause' : '▶ Play'; });
  c2.appendChild(pb);
  const out = readout(host);
  if (host.classList.contains('lk-stage')) out.hidden = true;
  function geom() {
    const sn2 = mech === 'sn2';
    let a, nuX, lgX, nuB, lgB, nuOn = true;
    if (sn2) { a = -0.4 + 0.8 * t; nuX = -2.9 + 1.9 * t; lgX = 1.0 + 1.9 * t; nuB = t < 0.12 ? 0 : t > 0.9 ? 1 : 2; lgB = t < 0.12 ? 1 : t > 0.88 ? 0 : 2; }
    else {
      const f = face; // sign of the side the Nu comes from: 1 = left (-x), subs tilt to +x
      const lgGone = Math.min(1, t / 0.4); lgX = 1.0 + 2.2 * ease(lgGone); lgB = t < 0.08 ? 1 : t < 0.3 ? 2 : 0;
      const flat = Math.min(1, t / 0.45), att = t < 0.55 ? 0 : (t - 0.55) / 0.45;
      a = t < 0.55 ? -0.4 * (1 - ease(flat)) : f * 0.4 * ease(att);
      nuX = f * -(3.0 - 2.0 * ease(att)); nuB = t < 0.6 ? 0 : t > 0.92 ? 1 : 2; nuOn = t > 0.5;
      if (t >= 0.55) lgX = 3.2;
    }
    return { a, nuX, lgX, nuB, lgB, nuOn };
  }
  function show() {
    const sn2 = mech === 'sn2';
    const msg = sn2 ? (t < 0.12 ? 'Reactant: a tetrahedral carbon, leaving group X on the right, nucleophile Nu approaching from the back.' : t < 0.88 ? 'Transition state region: Nu and X are both partly bonded, the carbon is almost flat (five-coordinate), the other three groups lie in a plane. One step, so the rate depends on both: rate = k[RX][Nu].' : 'Product: the three groups have flipped to the other side (inversion of configuration, Walden inversion).')
      : (t < 0.1 ? 'Reactant: tetrahedral carbon bonded to X.' : t < 0.5 ? 'Step 1 (slow): X leaves with the bonding pair, leaving a carbocation. Rate = k[RX] only, nothing else is in the slow step.' : t < 0.58 ? 'The carbocation is planar (sp²) with an empty p orbital: Nu can come from either face.' : 'Step 2 (fast): Nu attacks the empty p orbital. Attack from the other face gives the mirror-image product: about equal amounts, so a chiral reactant gives a racemic mixture.');
    out.innerHTML = `<b>${sn2 ? 'SN2' : 'SN1'}</b> at ${Math.round(t * 100)}%. ${msg} ${sn2 ? 'Fastest for CH₃ > 1° > 2°; 3° is too crowded.' : 'Fastest for 3° > 2° > 1° (more stable carbocation); polar protic solvents help.'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const g = geom(), mh = h * 0.58, P = cam.proj(w, mh, Math.min(w / 6.8, mh / 2.6), w / 2, mh / 2 + 6);
    title(ctx, mech === 'sn2' ? 'SN2: backside attack, inversion' : 'SN1: carbocation, then attack', col);
    const subs = [0, 1, 2].map((j) => { const p = (j * 2 * Math.PI) / 3 + 0.5; return { p: [g.a, 0.95 * Math.cos(p), 0.95 * Math.sin(p)], c: col.s[2 + j], l: ['a', 'b', 'c'][j] }; });
    const parts = [{ p: [0, 0, 0], r: 12, c: col.muted, l: 'C', ctr: true }];
    subs.forEach((s) => parts.push({ p: s.p, r: 9, c: s.c, l: s.l, bond: 1 }));
    parts.push({ p: [g.lgX, 0, 0], r: 12, c: col.s[1], l: 'X', bond: g.lgB, lg: true });
    if (g.nuOn) parts.push({ p: [mech === 'sn2' ? g.nuX : g.nuX, 0, 0], r: 12, c: col.s[0], l: 'Nu', bond: g.nuB });
    const draws = parts.map((q) => ({ ...q, q: P(q.p) })).sort((u, v) => u.q[2] - v.q[2]);
    const c0 = P([0, 0, 0]);
    draws.forEach((d) => {
      if (d.bond) { ctx.save(); ctx.strokeStyle = col.muted; ctx.lineWidth = 3; if (d.bond === 2) ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(c0[0], c0[1]); ctx.lineTo(d.q[0], d.q[1]); ctx.stroke(); ctx.restore(); }
      ctx.beginPath(); ctx.arc(d.q[0], d.q[1], d.r + d.q[2] * 1.5, 0, 7); ctx.fillStyle = d.c; ctx.globalAlpha = d.lg && g.lgX > 2 ? 0.7 : 1; ctx.fill(); ctx.globalAlpha = 1;
      text(ctx, d.l, d.q[0], d.q[1], { color: col.bg, size: d.r > 10 ? 11 : 10, weight: 700, align: 'center', fit: false });
    });
    // energy profile
    const x0 = 36, x1 = w - 14, y1 = mh + 18, y0 = h - 26, pts = PRO[mech], Ey = (e) => y0 - ((e + 20) / 110) * (y0 - y1);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, y1 - 6); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
    text(ctx, 'energy', 6, y1 - 8, { color: col.muted, size: 10 }); text(ctx, 'progress of reaction →', x1, y0 + 12, { color: col.muted, size: 10, align: 'right' });
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.beginPath(); for (let k = 0; k <= 80; k++) { const u = k / 80, X = x0 + u * (x1 - x0), Y = Ey(curve(pts, u)); k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke();
    ctx.beginPath(); ctx.arc(x0 + t * (x1 - x0), Ey(curve(pts, t)), 6, 0, 7); ctx.fillStyle = col.s[1]; ctx.fill();
    if (mech === 'sn1') text(ctx, 'carbocation', x0 + 0.5 * (x1 - x0), Ey(48) + 14, { color: col.muted, size: 10, align: 'center' });
    else text(ctx, '[Nu···C···X]‡', x0 + 0.5 * (x1 - x0), Ey(70) - 8, { color: col.muted, size: 10, align: 'center' });
    text(ctx, 'Drag to turn', w - 8, mh - 4, { color: col.muted, size: 10, align: 'right' });
  };
  show();
  return { step(i, n) { target = n > 1 ? i / (n - 1) : 0; playing = false; } };
}
