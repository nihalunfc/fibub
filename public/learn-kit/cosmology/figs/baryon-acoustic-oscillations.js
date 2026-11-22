// 10.7 One lump's sound wave (after Eisenstein, Seo and White 2007). Start with a single small overdense spot of
// everything. The hot gas and light are locked together and their pressure drives a spherical sound wave outwards
// at c/√(3(1 + R)), a bit over half the speed of light; dark matter feels no pressure and stays near the middle.
// At the drag epoch (z ≈ 1060, about 380,000 years) the light lets go of the gas: the light streams away (it is
// now the CMB) and the gas shell stalls at the sound horizon, r_d ≈ 147 Mpc in today's (comoving) units. Gravity
// then mixes the two: dark matter is pulled onto the shell and gas falls into the middle, until both share the same
// profile: a big central lump plus a small bump at 147 Mpc. Curves show the share of each ingredient at each
// distance (each curve's area is 1); the bump holds about the baryon share of the mass, 16%. Widths are rounded.
import { canvas, axes, text, title, line, loop, calm, clamp, ease } from '../../kit.js';

const RD = 147;
const SQ = Math.sqrt(2 * Math.PI);
const ctr = (r, s) => (2 / (s * SQ)) * Math.exp(-(r * r) / (2 * s * s));
const shell = (r, m, s) => (1 / (s * SQ)) * Math.exp(-((r - m) ** 2) / (2 * s * s));
const final = (r) => 0.84 * ctr(r, 16) + 0.16 * shell(r, RD, 12);

export default function (host) {
  const cv = canvas(host, { aspect: 1.0, max: 520, min: 400, label: 'A sound wave moves out from a lump in the early universe, stalls at 147 megaparsecs, and leaves a bump in the matter around the lump' });
  let step = 0, t = 0;
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); }, { autoplay: false });
  const state = () => {
    const k = calm() ? 1 : ease(clamp(t / 4, 0, 1));
    const s = { dm: (r) => ctr(r, 10), gas: (r) => ctr(r, 10), light: (r) => ctr(r, 10), rs: 0, rl: 0, la: 1 };
    if (step === 1) { const rs = 4 + (RD - 4) * k; Object.assign(s, { rs, rl: rs, dm: (r) => ctr(r, 10 + 4 * k), gas: (r) => shell(r, rs, 8 + 2 * k), light: (r) => shell(r, rs, 8 + 2 * k) }); }
    if (step === 2) { const rl = RD + 160 * k; Object.assign(s, { rs: RD, rl, la: 1 - 0.6 * k, dm: (r) => ctr(r, 14), gas: (r) => shell(r, RD, 10), light: (r) => shell(r, rl, 10 + 20 * k) * (1 - 0.6 * k) }); }
    if (step >= 3) { const kk = step === 3 ? k : 1; Object.assign(s, { rs: RD, rl: 400, la: 0, dm: (r) => (1 - kk) * ctr(r, 14) + kk * final(r), gas: (r) => (1 - kk) * shell(r, RD, 10) + kk * final(r), light: () => 0 }); }
    return s;
  };
  cv.draw = (ctx, w, h, col) => {
    const s = state();
    const top = title(ctx, ['A single lump of everything', 'Pressure drives out a sound wave', 'Light lets go: the wave stalls', 'Gravity shares out the matter', 'A ruler: 147 Mpc (480 million ly)'][step], col) + 4;
    // picture: a slice through the lump
    const ph = Math.min(h * 0.38, w * 0.55), cx = w / 2, cy = top + ph / 2 + 2, sc = (ph / 2 - 4) / 200;
    ctx.save(); ctx.beginPath(); ctx.rect(10, top, w - 20, ph + 4); ctx.clip();
    const ring = (r, c, lw, al = 1) => { if (r <= 0) return; ctx.globalAlpha = al; ctx.beginPath(); ctx.arc(cx, cy, r * sc, 0, 2 * Math.PI); ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.stroke(); ctx.globalAlpha = 1; };
    if (step < 4) {
      if (s.rl > 0 && s.la > 0 && step >= 1) ring(s.rl, col.s[3], 3, s.la);
      if (s.rs > 0 && step >= 1) ring(s.rs, col.s[1], step >= 3 ? 4 : 3);
    } else ring(RD, col.s[6], 4, 0.8);
    ctx.beginPath(); ctx.arc(cx, cy, Math.max(4, 16 * sc * 2), 0, 2 * Math.PI); ctx.fillStyle = col.s[6]; ctx.fill();
    ctx.restore();
    if (step >= 2) text(ctx, '147 Mpc', cx + RD * sc * 0.72 + 6, cy - RD * sc * 0.72 - 6, { color: col.ink, size: 11, weight: 700, halo: col.panel });
    // profile
    const A = axes(ctx, w, h, col, { x: [0, 220], y: [0, 0.085], t: top + ph + 22, yt: [], xlabel: 'Distance from the lump today (Mpc)', ylabel: 'Share at each distance' });
    const curve = (f, c, lw, dash) => { const p = []; for (let i = 0; i <= 220; i++) p.push([A.X(i), A.Y(Math.min(0.09, f(i)))]); line(ctx, p, c, lw, dash); };
    ctx.save(); A.clip();
    curve(s.gas, col.s[1], 2.5);
    curve(s.dm, col.s[6], 3);
    if (step <= 2) curve(s.light, col.s[3], 2, [5, 4]);
    ctx.restore();
    line(ctx, [[A.X(RD), A.T], [A.X(RD), A.B]], col.muted, 1, [3, 3]);
    const lx = A.R - 4; let ly = A.T + 8;
    for (const [lab, c] of step >= 4 ? [['dark matter and gas, now alike', col.s[6]]] : [['dark matter', col.s[6]], ['gas (atoms)', col.s[1]], ...(step <= 2 ? [['light', col.s[3]]] : [])]) { text(ctx, '— ' + lab, lx, ly, { color: c, size: 11, weight: 700, align: 'right', halo: col.panel }); ly += 15; }
    if (step >= 4) text(ctx, 'the bump', A.X(RD) - 6, A.Y(final(RD)) - 14, { color: col.ink, size: 11, weight: 700, align: 'right', halo: col.panel });
  };
  cv.redraw();
  return { step(i) { step = i; t = 0; cv.redraw(); anim.play(); } };
}
