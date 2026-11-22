// Class 10 Carbon (step player): covalent bonds by sharing electrons. Carbon (4 outer electrons) cannot easily lose or
// gain 4, so it shares. H2 (one shared pair), O2 (two pairs, double bond), N2 (three pairs, triple bond), CH4 (four
// single bonds). Every atom ends with a full outer shell: 2 for hydrogen, 8 for the others. Shared pairs are drawn
// between the atoms and pulse; lone pairs sit on the outer side.
import { canvas, text, title, line, dot, loop } from '../../kit.js';

const M = [
  { name: 'Carbon alone: 4 outer electrons', atoms: [['C', 0.5, 0.5, 4]], bonds: [], cap: 'To get a full shell of 8 it must gain 4 or lose 4 electrons. Both cost far too much energy, so carbon shares.', eq: 'C has 4 electrons in its outer shell' },
  { name: 'Hydrogen, H₂: one shared pair', atoms: [['H', 0.33, 0.5, 1], ['H', 0.67, 0.5, 1]], bonds: [[0, 1, 1]], cap: 'Each H gives one electron to the shared pair. Both now count 2 electrons: a full shell. One pair = one single bond.', eq: 'H : H  =  H–H' },
  { name: 'Oxygen, O₂: two shared pairs', atoms: [['O', 0.3, 0.5, 6], ['O', 0.7, 0.5, 6]], bonds: [[0, 1, 2]], lone: [2, 2], cap: 'Each O has 6 outer electrons and needs 2 more. Sharing two pairs gives each atom 8. A double bond.', eq: 'O = O' },
  { name: 'Nitrogen, N₂: three shared pairs', atoms: [['N', 0.3, 0.5, 5], ['N', 0.7, 0.5, 5]], bonds: [[0, 1, 3]], lone: [1, 1], cap: 'Each N has 5 outer electrons and needs 3 more. Three shared pairs: a triple bond, very strong, which is why N₂ in air is so unreactive.', eq: 'N ≡ N' },
  { name: 'Methane, CH₄: four single bonds', atoms: [['C', 0.5, 0.5, 4], ['H', 0.5, 0.18, 1], ['H', 0.5, 0.82, 1], ['H', 0.2, 0.5, 1], ['H', 0.8, 0.5, 1]], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]], cap: 'Carbon shares one pair with each of four H atoms: C counts 8, each H counts 2. Four bonds is carbon’s valency.', eq: 'CH₄' },
];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Atoms sharing electrons to form covalent bonds in H2, O2, N2 and CH4' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const ci = { C: 4, H: 7, O: 1, N: 0 };
  cv.draw = (ctx, w, h, col) => {
    const m = M[step], top = title(ctx, m.name, col) + 6, ph = h - top - 56;
    const P = m.atoms.map(([s, fx, fy]) => [fx * w, top + 10 + fy * ph]);
    const R = (s) => (s === 'H' ? w * 0.06 : w * 0.085);
    m.bonds.forEach(([a, b, o]) => {
      const [x0, y0] = P[a], [x1, y1] = P[b], dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
      for (let k = 0; k < o; k++) {
        const off = (k - (o - 1) / 2) * 9;
        line(ctx, [[x0 + nx * off + ux * R(m.atoms[a][0]), y0 + ny * off + uy * R(m.atoms[a][0])], [x1 + nx * off - ux * R(m.atoms[b][0]), y1 + ny * off - uy * R(m.atoms[b][0])]], col.line, 1.5);
        const mx = (x0 + x1) / 2 + nx * off, my = (y0 + y1) / 2 + ny * off, pr = 3.2 + Math.sin(t * 4 + k) * 0.7;
        dot(ctx, mx - ux * 5, my - uy * 5, pr, col.s[1]); dot(ctx, mx + ux * 5, my + uy * 5, pr, col.s[7]);
      }
    });
    m.atoms.forEach(([s, , , ve], i) => {
      const [x, y] = P[i], r = R(s);
      dot(ctx, x, y, r, col.soft, col.s[ci[s]]);
      text(ctx, s, x, y, { color: col.ink, size: 15, weight: 700, align: 'center', fit: false });
      if (step === 0) { for (let k = 0; k < 4; k++) { const a = Math.PI / 4 + k * Math.PI / 2 + Math.sin(t * 2 + k) * 0.08; dot(ctx, x + Math.cos(a) * (r + 12), y + Math.sin(a) * (r + 12), 4.5, col.s[7]); } }
      const lp = m.lone ? m.lone[i] : 0, out = Math.atan2(y - top - 10 - ph / 2, x - w / 2) + (x < w / 2 ? 0 : 0);
      const base = x < w / 2 ? Math.PI : 0;
      for (let k = 0; k < lp; k++) {
        const a = base + (lp === 1 ? 0 : (k - 0.5) * 1.5) + (x < w / 2 ? 0 : 0);
        const cx = x + Math.cos(a) * (r + 11), cy = y + Math.sin(a) * (r + 11), tx = -Math.sin(a) * 4, ty = Math.cos(a) * 4;
        dot(ctx, cx + tx, cy + ty, 2.6, col.muted); dot(ctx, cx - tx, cy - ty, 2.6, col.muted);
      }
    });
    if (step > 0) text(ctx, 'orange and red dots: the shared electrons, one from each atom · grey: lone pairs', w / 2, h - 52, { color: col.muted, size: 10, align: 'center' });
    text(ctx, m.eq, w / 2, h - 34, { color: col.s[2], size: 13, weight: 700, align: 'center' });
    const words = m.cap.split(' '); let l1 = '', l2 = '';
    words.forEach((wd) => { if ((l1 + ' ' + wd).length < w / 6.2 && !l2) l1 = (l1 + ' ' + wd).trim(); else l2 = (l2 + ' ' + wd).trim(); });
    text(ctx, l1, w / 2, h - 18, { color: col.ink, size: 10.5, align: 'center' });
    if (l2) text(ctx, l2, w / 2, h - 5, { color: col.ink, size: 10.5, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, M.length - 1); cv.redraw(); } };
}
