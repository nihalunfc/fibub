// Class 9 Propositions: "If P then Q" and its converse "If Q then P", shown as a Venn picture. If every P is inside Q the statement
// is true; its converse asks whether every Q is inside P. Usually it is not: the converse of a true statement can be false.
import { canvas, text, title, row, choice, readout } from '../../kit.js';

const L = {
  six: { p: 'a multiple of 6', q: 'a multiple of 3', iff: false, ex: '9 (3 × 3, but not a multiple of 6)', P: 'a number is a multiple of 6', Q: 'a number is a multiple of 3', pp: 'it is a multiple of 6', qq: 'it is a multiple of 3' },
  sq: { p: 'a square', q: 'a rectangle', iff: false, ex: 'a 4 × 2 rectangle', P: 'a shape is a square', Q: 'a shape is a rectangle', pp: 'it is a square', qq: 'it is a rectangle' },
  eq: { p: 'an equilateral triangle', q: 'an isosceles triangle', iff: false, ex: 'a triangle with sides 5, 5, 8', P: 'a triangle is equilateral', Q: 'a triangle is isosceles', pp: 'it is equilateral', qq: 'it is isosceles' },
  lin: { p: 'x + 3 = 7', q: 'x = 4', iff: true, ex: '', P: 'x + 3 = 7', Q: 'x = 4', pp: 'x + 3 = 7', qq: 'x = 4' },
  rain: { p: 'it is raining here', q: 'the road is wet', iff: false, ex: 'a road wet from a tanker washing it', P: 'it is raining here', Q: 'the road here is wet', pp: 'it is raining', qq: 'the road is wet' },
};
export default function (host) {
  let k = 'six', mode = 'orig';
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 280, label: 'A Venn picture of an if-then statement and its converse' });
  const c1 = row(host); choice(c1, 'Statement', [['six', '×6 → ×3'], ['sq', 'square'], ['eq', 'equilateral'], ['lin', 'x + 3 = 7'], ['rain', 'rain']], k, (v) => { k = v; upd(); });
  const c2 = row(host); choice(c2, 'Read it as', [['orig', 'Original: if P then Q'], ['conv', 'Converse: if Q then P']], mode, (v) => { mode = v; upd(); });
  const out = readout(host);
  const verdict = () => { const d = L[k]; return mode === 'orig' ? true : d.iff; };
  cv.draw = (ctx, w, h, col) => {
    const d = L[k], t = title(ctx, mode === 'orig' ? 'If P then Q' : 'Converse: if Q then P', col);
    const cx = w / 2, cy = t + (h - t - 44) / 2 + 6, R = Math.min(w * 0.42, (h - t - 60) / 2), r = d.iff ? R : R * 0.55;
    const ring = (x, y, rr, c, a, lw) => { ctx.save(); ctx.beginPath(); ctx.arc(x, y, rr, 0, Math.PI * 2); ctx.globalAlpha = a; ctx.fillStyle = c; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.stroke(); ctx.restore(); };
    const px = cx - (d.iff ? 0 : R * 0.2), py = cy;
    ring(cx, cy, R, col.s[0], mode === 'conv' ? 0.28 : 0.08, 2);
    ring(px, py, r, col.s[3], mode === 'orig' ? 0.45 : 0.15, 2);
    text(ctx, 'Q: ' + d.q, cx, cy - R - 8, { color: col.s[0], size: 11, weight: 700, align: 'center' });
    text(ctx, 'P: ' + d.p, px, py, { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel });
    if (mode === 'conv' && !d.iff) { const bx = cx + R * 0.55, by = cy + R * 0.2; ctx.save(); ctx.fillStyle = col.s[6]; ctx.beginPath(); ctx.arc(bx, by, 6, 0, 7); ctx.fill(); ctx.restore(); text(ctx, 'a Q that is not P', bx, by + 18, { color: col.s[6], size: 11, weight: 700, align: 'center' }); }
    const ok = verdict();
    text(ctx, mode === 'orig' ? 'Every P is inside Q: TRUE' : (ok ? 'Every Q is also inside P: TRUE' : 'Not every Q is inside P: FALSE'), w / 2, h - 14, { color: ok ? col.s[2] : col.s[6], size: 14, weight: 700, align: 'center' });
  };
  function upd() {
    const d = L[k], ok = verdict();
    out.innerHTML = mode === 'orig'
      ? `<b>If</b> ${d.P}<b>, then</b> ${d.qq}. True: P sits inside Q.`
      : (ok ? `Converse: <b>if</b> ${d.Q}<b>, then</b> ${d.pp}. True as well, so P and Q describe exactly the same thing (written “P if and only if Q”).` : `Converse: <b>if</b> ${d.Q}<b>, then</b> ${d.pp}. <b>False.</b> Counterexample: ${d.ex}.`);
    cv.redraw();
  }
  upd();
}
