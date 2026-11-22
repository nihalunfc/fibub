// Class 10 Acids, Bases and Salts: make a salt. Pick an acid and a base: the H+ of the acid and the OH- of the base
// join to make water, and the leftover ions (the base's metal and the acid's anion) form the salt. The strength of the
// acid and base decides whether the salt solution is neutral, acidic or basic (about pH 7, below 7 or above 7).
import { canvas, text, title, line, dot, row, choice, readout, loop, ease, lerp, clamp } from '../../kit.js';

const ACID = { hcl: { n: 'HCl', f: 'HCl', a: 1, an: 'Cl', an_n: 'chloride', strong: true }, h2so4: { n: 'H₂SO₄', f: 'H₂SO₄', a: 2, an: 'SO₄', an_n: 'sulphate', strong: true }, hno3: { n: 'HNO₃', f: 'HNO₃', a: 1, an: 'NO₃', an_n: 'nitrate', strong: true }, ch3: { n: 'CH₃COOH', f: 'CH₃COOH', a: 1, an: 'CH₃COO', an_n: 'ethanoate', strong: false } };
const BASE = { naoh: { n: 'NaOH', b: 1, ca: 'Na', ca_n: 'sodium', strong: true }, koh: { n: 'KOH', b: 1, ca: 'K', ca_n: 'potassium', strong: true }, caoh: { n: 'Ca(OH)₂', b: 2, ca: 'Ca', ca_n: 'calcium', strong: true }, nh4oh: { n: 'NH₄OH', b: 1, ca: 'NH₄', ca_n: 'ammonium', strong: false } };
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const sub = (n) => (n === 1 ? '' : String.fromCharCode(0x2080 + n));
const grp = (f, n) => (n === 1 ? f : /[A-Z].*[A-Z]|\d|[₀-₉]/.test(f) ? `(${f})${sub(n)}` : `${f}${sub(n)}`);
const co = (n) => (n === 1 ? '' : n);
export default function (host) {
  let ac = 'hcl', bs = 'naoh', p = 0, t = 0;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 300, label: 'An acid and a base reacting to give a salt and water' });
  const ctl = row(host);
  choice(ctl, 'Acid', Object.entries(ACID).map(([k, v]) => [k, v.n]), ac, (v) => { ac = v; t = 0; say(); });
  choice(ctl, 'Base', Object.entries(BASE).map(([k, v]) => [k, v.n]), bs, (v) => { bs = v; t = 0; say(); });
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); }); anim.button(ctl);
  const out = readout(host);
  const calc = () => {
    const A = ACID[ac], B = BASE[bs], g = gcd(A.a, B.b), L = (A.a * B.b) / g, nA = L / A.a, nB = L / B.b;
    const salt = grp(B.ca, A.a / g) + grp(A.an, B.b / g), cls = A.strong && B.strong ? 'neutral' : A.strong ? 'acidic' : B.strong ? 'basic' : 'nearly neutral';
    const eq = `${co(nA)}${A.f} + ${co(nB)}${B.n} → ${salt} + ${co(L)}H₂O`;
    return { A, B, salt, cls, eq, L };
  };
  function say() {
    const { A, B, salt, cls, eq } = calc();
    out.innerHTML = `<b>${eq}</b><br>Salt: ${B.ca_n} ${A.an_n} (${salt}). From a ${A.strong ? 'strong' : 'weak'} acid and a ${B.strong ? 'strong' : 'weak'} base, so its solution is <b>${cls}</b> (${cls === 'neutral' ? 'pH about 7' : cls === 'acidic' ? 'pH below 7' : cls === 'basic' ? 'pH above 7' : 'pH close to 7'}).`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const { A, B, salt, cls, L } = calc();
    const top = title(ctx, `${A.n} + ${B.n}`, col) + 8, c = (t % 7) / 7, e = ease(clamp((c - 0.2) / 0.45, 0, 1));
    const mid = h * 0.52, Hs = [], OH = [];
    for (let i = 0; i < L; i++) { Hs.push([lerp(w * 0.12, w * 0.5, e), top + 34 + i * 34 + (1 - e) * 0]); OH.push([lerp(w * 0.88, w * 0.5, e), top + 34 + i * 34]); }
    // anions left, cations right, H+ and OH- travel to the middle and make water
    const nAn = B.b / gcd(A.a, B.b) * (L / A.a) / (L / A.a), cat = B.ca, an = A.an;
    for (let i = 0; i < L; i++) {
      const y = top + 34 + i * 40;
      const hx = lerp(w * 0.16, w * 0.46, e), ox = lerp(w * 0.84, w * 0.54, e);
      if (e < 0.98) { dot(ctx, hx, y, 9, col.s[7]); text(ctx, 'H⁺', hx, y, { color: '#fff', size: 9, weight: 700, align: 'center' }); dot(ctx, ox, y, 9, col.s[0]); text(ctx, 'OH⁻', ox, y, { color: '#fff', size: 8, weight: 700, align: 'center' }); }
      else { dot(ctx, w * 0.5, y, 11, col.s[0]); text(ctx, 'H₂O', w * 0.5, y, { color: '#fff', size: 8, weight: 700, align: 'center' }); }
    }
    // spectator ions: anions (from acid) left column, cations right, drawn as a salt block when joined
    const cx = w * 0.5, sy = top + 34 + L * 40 + 14, join = clamp((c - 0.7) / 0.2, 0, 1);
    const an_x = lerp(w * 0.2, cx - 18, join), ca_x = lerp(w * 0.8, cx + 18, join);
    dot(ctx, an_x, sy, 17, col.s[2]); text(ctx, `${co(B.b / gcd(A.a, B.b))}${A.an}`, an_x, sy, { color: '#fff', size: 9, weight: 700, align: 'center', fit: false });
    dot(ctx, ca_x, sy, 17, col.s[3]); text(ctx, `${co(A.a / gcd(A.a, B.b))}${B.ca}`, ca_x, sy, { color: '#111', size: 9, weight: 700, align: 'center', fit: false });
    if (join > 0.95) { ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(cx - 40, sy - 22, 80, 44); text(ctx, salt, cx, sy + 30, { color: col.s[2], size: 13, weight: 700, align: 'center' }); }
    text(ctx, 'from the acid', w * 0.2, sy + 24, { color: col.muted, size: 9.5, align: 'center' }); text(ctx, 'from the base', w * 0.8, sy + 24, { color: col.muted, size: 9.5, align: 'center' });
    // pH of salt strip
    const bx = 16, bw = w - 32, by = h - 34, f = cls === 'neutral' ? 0.5 : cls === 'acidic' ? 0.2 : cls === 'basic' ? 0.82 : 0.5;
    ctx.fillStyle = col.soft; ctx.fillRect(bx, by, bw, 10); ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(bx, by, bw, 10);
    ctx.beginPath(); ctx.moveTo(bx + f * bw, by - 2); ctx.lineTo(bx + f * bw - 5, by - 11); ctx.lineTo(bx + f * bw + 5, by - 11); ctx.fillStyle = col.ink; ctx.fill();
    text(ctx, 'acidic', bx, by + 20, { color: col.muted, size: 10 }); text(ctx, 'pH 7', bx + bw / 2, by + 20, { color: col.muted, size: 10, align: 'center' }); text(ctx, 'basic', bx + bw, by + 20, { color: col.muted, size: 10, align: 'right' });
  };
  say();
}
