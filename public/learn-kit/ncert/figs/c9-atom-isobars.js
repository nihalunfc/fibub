// Class 9 Journey Inside the Atom: isobars. Isobars are atoms of DIFFERENT elements (different atomic number Z) that
// have the SAME mass number A. Argon-40, potassium-40 and calcium-40 all have A = 40 but 18, 19 and 20 protons.
// Compare with isotopes: same Z, different A. Click through the sets to see numbers of p, n, e and the symbol notation.
import { canvas, text, title, dot, row, choice, readout } from '../../kit.js';

const SETS = { a: { A: 40, list: [['Ar', 18], ['K', 19], ['Ca', 20]] }, b: { A: 14, list: [['C', 6], ['N', 7]] }, c: { A: 30, list: [['Si', 14], ['P', 15], ['S', 16]] } };
export default function (host) {
  let s = 'a';
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 290, label: 'Isobars with the same mass number and different atomic numbers' });
  const ctl = row(host);
  choice(ctl, 'Set', [['a', 'A = 40'], ['b', 'A = 14'], ['c', 'A = 30']], s, (v) => { s = v; upd(); });
  const out = readout(host);
  function upd() { const d = SETS[s]; out.innerHTML = `All have A = ${d.A}, but different Z: so they are <b>different elements</b> (different chemistry) with different neutron counts. Isotopes are the opposite: same Z, different A.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const d = SETS[s], n = d.list.length; title(ctx, `Isobars: same mass number, A = ${d.A}`, col);
    const cw = w / n;
    d.list.forEach(([sym, Z], i) => {
      const cx = cw * (i + 0.5), cy = h * 0.4, r = Math.min(cw * 0.36, 48), neu = d.A - Z;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.s[i % 5]; ctx.lineWidth = 2; ctx.stroke();
      text(ctx, sym, cx, cy, { color: col.ink, size: 22, weight: 700, align: 'center', fit: false });
      text(ctx, `${d.A}`, cx - r * 0.5, cy - r * 0.5, { color: col.s[3], size: 12, weight: 700, align: 'center' });
      text(ctx, `${Z}`, cx - r * 0.5, cy + r * 0.5, { color: col.s[1], size: 12, weight: 700, align: 'center' });
      text(ctx, `${Z} protons`, cx, cy + r + 18, { color: col.s[1], size: 11, weight: 700, align: 'center' });
      text(ctx, `${neu} neutrons`, cx, cy + r + 34, { color: col.muted, size: 11, align: 'center' });
      text(ctx, `${Z} electrons`, cx, cy + r + 50, { color: col.s[2], size: 11, align: 'center' });
    });
    text(ctx, 'top number = A (mass number) · bottom number = Z (atomic number)', w / 2, h - 10, { color: col.muted, size: 10, align: 'center' });
  };
  upd();
}
