// Class 8 Matter (step player): how a compound forms. Hydrogen gas (H2) and oxygen gas (O2) react: the bonds inside
// the molecules break, the atoms rearrange and join in a new ratio, and two molecules of water (H2O) appear.
// 2 H2 + O2 -> 2 H2O. The number of atoms of each kind stays the same. Schematic diagram.
import { canvas, text, title, dot, line, arrow, loop, ease, lerp, font } from '../../kit.js';

// atoms: [kind(0 = O, 1 = H), x, y] for each stage (unit coordinates)
const A = [0, 0, 1, 1, 1, 1];
const POS = [
  [[0.5, 0.3], [0.56, 0.3], [0.2, 0.62], [0.32, 0.62], [0.68, 0.62], [0.8, 0.62]],
  [[0.38, 0.28], [0.62, 0.28], [0.12, 0.64], [0.4, 0.74], [0.6, 0.74], [0.88, 0.64]],
  [[0.32, 0.46], [0.68, 0.46], [0.2, 0.6], [0.42, 0.62], [0.58, 0.62], [0.8, 0.6]],
  [[0.3, 0.45], [0.7, 0.45], [0.18, 0.62], [0.42, 0.62], [0.58, 0.62], [0.82, 0.62]],
];
const NAMES = ['Start: two gases', 'Bonds break', 'Atoms rearrange', 'Two molecules of water', 'A new substance'];
const CAP = ['Two molecules of hydrogen (H₂) and one molecule of oxygen (O₂). Each is an element.', 'The atoms in each molecule separate. Energy (a spark or heat) is needed to start this.', 'Atoms move and attach in new combinations. No atom is lost and none is made.', 'Each oxygen atom has joined two hydrogen atoms: 2 H₂O. Atom count: 2 O and 4 H before and after.', 'Water is a compound. Its properties (a liquid that puts out fire) are nothing like those of H₂ (burns) or O₂ (helps burning).'];
export default function (host) {
  let step = 0, from = 0, t = 1;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'Hydrogen and oxygen molecules breaking up and forming two water molecules' });
  loop(host, (dt) => { if (t < 1) t = Math.min(1, t + dt * 1.1); cv.redraw(); });
  const stage = (s) => POS[Math.min(3, Math.max(0, s))];
  cv.draw = (ctx, w, h, col) => {
    title(ctx, NAMES[step], col);
    const a = stage(from), b = stage(step), e = ease(t), p = a.map((q, i) => [lerp(q[0], b[i][0], e) * w, 40 + lerp(q[1], b[i][1], e) * (h - 130)]);
    const bond = (i, j) => line(ctx, [p[i], p[j]], col.muted, 4);
    if (step === 0) { bond(0, 1); bond(2, 3); bond(4, 5); }
    if (step >= 3) { bond(0, 2); bond(0, 3); bond(1, 4); bond(1, 5); }
    const pairs = step >= 3 ? [[2, 3, 0], [4, 5, 1]] : [];
    p.forEach(([x, y], i) => dot(ctx, x, y, A[i] === 0 ? 15 : 9, A[i] === 0 ? col.s[1] : col.s[0]));
    p.forEach(([x, y], i) => text(ctx, A[i] === 0 ? 'O' : 'H', x, y, { color: '#fff', size: A[i] === 0 ? 12 : 10, weight: 700, align: 'center', fit: false }));
    if (step === 1) arrow(ctx, w * 0.5, h * 0.5 + 6, w * 0.5, h * 0.5 + 6, col.s[3], 0);
    text(ctx, step === 0 ? '2 H₂  +  O₂' : step >= 3 ? '2 H₂O' : '', w / 2, h - 82, { color: col.ink, size: 14, weight: 700, align: 'center' });
    ctx.font = font(11, 400);
    const L = []; let cur = ''; CAP[step].split(' ').forEach((wd) => { const s2 = cur ? cur + ' ' + wd : wd; if (ctx.measureText(s2).width > w - 24) { L.push(cur); cur = wd; } else cur = s2; }); L.push(cur);
    L.forEach((l, i) => text(ctx, l, 12, h - 10 - (L.length - 1 - i) * 15, { color: col.ink, size: 11 }));
  };
  cv.redraw();
  return { step(i) { const n = Math.min(Math.max(0, i), 4); from = Math.min(3, step); step = n; t = 0; cv.redraw(); } };
}
