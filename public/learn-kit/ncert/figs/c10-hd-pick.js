// Class 10 Applications of Trigonometry: choosing the ratio. Each story gives two sides of a right triangle (one given, one wanted).
// Pick sin when the sides are opposite and hypotenuse, cos for adjacent and hypotenuse, tan for opposite and adjacent (SOH-CAH-TOA).
import { canvas, axes, text, title, line, dot, arrow, row, slider, button, choice, readout, loop } from '../../kit.js';

const D = Math.PI / 180, f3 = (v) => (Math.abs(v) < 5e-10 ? '0' : String(+v.toFixed(3)));
const arcAt = (ctx, x, y, r, a0, a1, color, wd = 2) => { ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = wd; ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.stroke(); ctx.restore(); };
const rmark = (ctx, x, y, dx, dy, col, s = 9) => line(ctx, [[x + dx * s, y], [x + dx * s, y + dy * s], [x, y + dy * s]], col, 1.3);
const wrap = (ctx, s, w, y, col, size = 12) => { const words = s.split(' '); let a = '', ls = []; for (const wd of words) { if ((a + ' ' + wd).length > Math.floor(w / (size * 0.53)) && a) { ls.push(a); a = wd; } else a = a ? a + ' ' + wd : wd; } ls.push(a); ls.forEach((l, i) => text(ctx, l, w / 2, y - (ls.length - 1 - i) * (size + 4), { color: col.ink, size, align: 'center', halo: col.panel })); };
const lab = (ctx, s, x, y, tone, col, al = 'center', size = 12) => text(ctx, s, x, y, { color: tone, size, weight: 700, align: al, halo: col && col.panel });
const person = (ctx, x, y, hgt, color) => { ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2; ctx.lineCap = 'round'; const hd = hgt * 0.16; ctx.beginPath(); ctx.arc(x, y - hgt + hd, hd, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(x, y - hgt + 2 * hd); ctx.lineTo(x, y - hgt * 0.38); ctx.moveTo(x, y - hgt * 0.38); ctx.lineTo(x - hgt * 0.16, y); ctx.moveTo(x, y - hgt * 0.38); ctx.lineTo(x + hgt * 0.16, y); ctx.moveTo(x - hgt * 0.2, y - hgt * 0.62); ctx.lineTo(x + hgt * 0.2, y - hgt * 0.62); ctx.stroke(); ctx.restore(); };
const ground = (ctx, w, y, col) => { line(ctx, [[6, y], [w - 6, y]], col.muted, 2); ctx.save(); ctx.strokeStyle = col.line; ctx.lineWidth = 1; for (let x = 10; x < w - 10; x += 12) { ctx.beginPath(); ctx.moveTo(x, y + 1); ctx.lineTo(x - 5, y + 7); ctx.stroke(); } ctx.restore(); };
const deg = (v) => Math.round(v) + '°';
const m1 = (v) => (+v.toFixed(1)).toString();

const S = [['A 6 m ladder leans at 60° to the ground. How high up the wall does it reach?', 'o', 'h', 'The wall height is opposite the angle at the ground and the ladder is the hypotenuse: opposite and hypotenuse, so sin.'], ['You stand 25 m from a tower and see its top at 30° above the horizontal. How tall is it above your eye?', 'o', 'a', 'Height above the eye is opposite the angle and the 25 m is adjacent: opposite and adjacent, so tan.'], ['A kite string is 50 m long and makes 40° with the ground. How high is the kite?', 'o', 'h', 'The height is opposite, the string is the hypotenuse: sin.'], ['A pole 8 m tall has a shadow 8 m long. What is the sun’s angle? (Which ratio do you use?)', 'o', 'a', 'Pole is opposite the sun’s angle and the shadow is adjacent: tan.'], ['A ladder makes 70° with the ground and its foot is 2 m from the wall. How long is the ladder?', 'a', 'h', 'The foot distance is adjacent to the angle and the ladder is the hypotenuse: cos.'], ['From a 20 m cliff you see a boat 20 m from its base. What is the angle of depression? (Which ratio?)', 'o', 'a', 'Cliff height is opposite the angle at the boat and the distance is adjacent: tan.'], ['A ramp 10 m long rises at 20° to the ground. How far along the ground does it run?', 'a', 'h', 'The ground distance is adjacent to the angle and the ramp is the hypotenuse: cos.'], ['A 12 m flagpole is seen at 45° elevation. How far away is the observer? (ignore eye height)', 'o', 'a', 'The pole is opposite and the distance is adjacent: tan (and tan 45° = 1, so the distance is 12 m).']];
const R = { 'oh': 'sin', 'ah': 'cos', 'oa': 'tan' };
export default function (host) {
  let i = 0, ok = 0, tot = 0, got = null;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 310, label: 'A right triangle quiz where you pick sine cosine or tangent for each situation' });
  const ctl = row(host);
  const ch = choice(ctl, 'Which ratio?', [['sin', 'sin'], ['cos', 'cos'], ['tan', 'tan']], '', (v) => { if (got) return; got = v; tot++; if (v === R[S[i][1] + S[i][2]]) ok++; upd(); });
  button(ctl, 'Next story', () => { i = (i + 1) % S.length; got = null; upd(); });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Given side and wanted side: which ratio?', col), x0 = 36, y0 = h - 34, W = w - 90, Ht = Math.max(80, h - t - 100), a = [x0, y0], c = [x0 + W, y0], b = [x0 + W, y0 - Ht];
    wrap(ctx, S[i][0], w, t + 28, col, 12);
    const k = S[i], wanted = k[1], given = k[2], role = (r) => (got ? (r === k[1] ? col.s[1] : r === k[2] ? col.s[0] : col.line) : col.ink);
    const stroke = (p, q, c0, wd) => line(ctx, [p, q], c0, wd);
    stroke(a, c, k[1] === 'a' || k[2] === 'a' ? col.s[k[2] === 'a' ? 0 : 1] : col.muted, 4); stroke(c, b, k[1] === 'o' || k[2] === 'o' ? col.s[k[2] === 'o' ? 0 : 1] : col.muted, 4); stroke(a, b, k[1] === 'h' || k[2] === 'h' ? col.s[k[2] === 'h' ? 0 : 1] : col.muted, 4);
    rmark(ctx, c[0], c[1], -1, -1, col.ink); arcAt(ctx, a[0], a[1], 30, -Math.atan2(Ht, W), 0, col.ink, 2); lab(ctx, 'θ', a[0] + 38, a[1] - 8, col.ink, col, 'left', 13);
    const tag = (r, p, q, dx, dy) => { const gv = r === k[2], wn = r === k[1], tx = r === 'a' ? 'adjacent' : r === 'o' ? 'opposite' : 'hypotenuse'; lab(ctx, `${gv ? 'given' : wn ? 'wanted' : ''}`, (p[0] + q[0]) / 2 + dx, (p[1] + q[1]) / 2 + dy + (got ? 14 : 0), gv ? col.s[0] : col.s[1], col, 'center', 12); if (got || (!gv && !wn)) lab(ctx, tx, (p[0] + q[0]) / 2 + dx, (p[1] + q[1]) / 2 + dy, col.muted, col, 'center', 11); };
    tag('a', a, c, 0, 18); tag('o', c, b, 30, 0); tag('h', a, b, -34, -10);
  };
  function upd() { const k = S[i], ans = R[k[1] + k[2]]; out.innerHTML = got ? (got === ans ? `<b>Yes: ${ans}.</b> ` : `<b>Not quite; it is ${ans}.</b> `) + k[3] + ` &nbsp; Score ${ok}/${tot}.` : `Look at the blue (given) and orange (wanted) sides, then choose. Score ${ok}/${tot}.`; cv.redraw(); }
  upd();
}
