// Class 8 Matter: sort by looking at the particles. An ELEMENT has only one kind of atom. A COMPOUND has one kind of
// molecule made of different atoms joined in a fixed ratio. A MIXTURE has two or more different substances just
// jumbled together (any proportion). Each picture is a made-up diagram; atoms are coloured circles.
import { canvas, text, title, dot, line, row, button, readout } from '../../kit.js';

const CASES = [
  { name: 'Oxygen gas', ans: 'element', units: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]], why: 'Every atom is the same kind (oxygen). The atoms come in pairs, but a pair of identical atoms is still an element.' },
  { name: 'Water', ans: 'compound', units: [[0, 1, 1], [0, 1, 1], [0, 1, 1], [0, 1, 1], [0, 1, 1], [0, 1, 1]], why: 'Every molecule is identical and has two kinds of atoms joined in a fixed ratio (1 oxygen : 2 hydrogen).' },
  { name: 'Air (simplified)', ans: 'mixture', units: [[0, 0], [2, 2], [0, 0], [2, 2], [0, 0], [3, 3, 3], [2, 2], [0, 0]], why: 'Different kinds of molecules (nitrogen, oxygen, ...) are just mixed, in no fixed ratio.' },
  { name: 'Copper wire', ans: 'element', units: [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1]], why: 'Only copper atoms are present.' },
  { name: 'Carbon dioxide', ans: 'compound', units: [[0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0]], why: 'All molecules are the same: one carbon atom joined to two oxygen atoms.' },
  { name: 'Salt dissolved in water', ans: 'mixture', units: [[0, 1, 1], [0, 1, 1], [2, 3], [0, 1, 1], [0, 1, 1], [2, 3], [0, 1, 1]], why: 'Water molecules and salt particles are mixed together; the amount of salt can be changed.' },
];
const COL = (col) => [col.s[1], col.s[0], col.s[2], col.s[3]];
export default function (host) {
  let k = 0, score = 0, answered = false, tried = 0;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 270, label: 'Particle picture of a substance to be sorted as element, compound or mixture' });
  const ctl = row(host);
  ['element', 'compound', 'mixture'].forEach((a) => button(ctl, a[0].toUpperCase() + a.slice(1), () => {
    if (answered) return; answered = true; tried++;
    const ok = a === CASES[k].ans; if (ok) score++;
    out.innerHTML = (ok ? '<b>Correct.</b> ' : `<b>Not quite: it is a ${CASES[k].ans}.</b> `) + CASES[k].why;
  }));
  button(ctl, 'Next picture', () => { k = (k + 1) % CASES.length; answered = false; out.textContent = 'Look at the particles. How many kinds of atom, and are they joined?'; cv.redraw(); });
  const out = readout(host);
  out.textContent = 'Look at the particles. How many kinds of atom, and are they joined?';
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `What is this? ${CASES[k].name}`, col);
    const C = COL(col), bx = 14, by = 42, bw = w - 28, bh = h - 78; ctx.strokeStyle = col.line; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh);
    const cols = 4, cw = bw / cols, rh = bh / Math.ceil(CASES[k].units.length / cols);
    CASES[k].units.forEach((u, i) => { const cx = bx + (i % cols) * cw + cw / 2 + ((i * 7) % 5 - 2) * 3, cy = by + Math.floor(i / cols) * rh + rh / 2 + ((i * 3) % 5 - 2) * 3, r = 9; const pts = u.map((_, j) => [cx + (j - (u.length - 1) / 2) * r * 1.5, cy + (u.length === 3 && j === 1 ? -r * 0.9 : 0)]); if (pts.length > 1) line(ctx, pts, col.muted, 3); u.forEach((c, j) => dot(ctx, pts[j][0], pts[j][1], c === 0 && u.length > 2 && j === 1 ? r : r * (c === 1 && u.length === 3 ? 0.7 : 1), C[c])); });
    text(ctx, `score ${score}/${tried}`, w - 14, h - 14, { color: col.muted, size: 11, align: 'right' });
  };
}
