// Class 9 Atomic Foundations of Matter (step player): Dalton's atomic theory in five pictures. 1) matter is made of
// atoms; 2) atoms of one element are identical; 3) atoms of different elements differ; 4) atoms join in simple
// whole-number ratios to make compounds (this explains constant proportions); 5) atoms are only rearranged in
// a reaction, never made or destroyed (this explains conservation of mass). Later knowledge: atoms are divisible and isotopes exist.
import { canvas, text, title, dot, loop, ease } from '../../kit.js';

const TXT = ['All matter is made of tiny particles called atoms.', 'Atoms of the same element are alike in mass and properties.', 'Atoms of different elements have different masses and properties.', 'Atoms combine in small whole-number ratios to form compounds: water is always 2 H : 1 O.', 'In a reaction atoms are rearranged: none is created or destroyed, so mass is conserved.'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 300, label: 'Five pictures of Dalton’s atomic theory with atoms of different elements joining and rearranging' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Dalton’s theory ' + (step + 1) + ' of 5', col);
    const at = (x, y, r, c, s) => { dot(ctx, x, y, r, c, col.ink); if (s) text(ctx, s, x, y, { color: col.panel, size: r * 0.9, weight: 700, align: 'center', fit: false }); };
    const mid = h * 0.45;
    if (step === 0) { for (let i = 0; i < 30; i++) { const x = 20 + ((i * 53) % (w - 40)), y = 46 + ((i * 37 + Math.sin(t + i) * 6) % (mid * 1.4)); at(x + Math.sin(t * 1.3 + i) * 4, y, 7, col.s[i % 3], ''); } text(ctx, 'a drop of water, enlarged a billion times…', w / 2, mid * 1.6 + 30, { color: col.muted, size: 10.5, align: 'center' }); }
    if (step === 1) { for (let i = 0; i < 12; i++) at(30 + (i % 6) * ((w - 60) / 5), mid - 24 + Math.floor(i / 6) * 40, 11, col.s[1], 'O'); text(ctx, 'every oxygen atom: same mass', w / 2, mid + 64, { color: col.ink, size: 11.5, align: 'center', weight: 700 }); }
    if (step === 2) { const els = [['H', 7, col.s[0]], ['C', 10, col.muted], ['O', 12, col.s[1]], ['Na', 15, col.s[3]]]; els.forEach(([s, r, c], i) => { const x = w * (0.15 + i * 0.23); at(x, mid, r + 6, c, s); text(ctx, ['1', '12', '16', '23'][i] + ' u', x, mid + 38, { color: col.ink, size: 11, align: 'center', weight: 700 }); }); text(ctx, 'different elements: different masses', w / 2, mid + 66, { color: col.muted, size: 11, align: 'center' }); }
    if (step === 3) { for (let k = 0; k < 3; k++) { const cx = w * (0.2 + k * 0.3), cy = mid + Math.sin(t * 2 + k) * 4; at(cx - 18, cy + 14, 9, col.s[0], 'H'); at(cx + 18, cy + 14, 9, col.s[0], 'H'); at(cx, cy - 4, 13, col.s[1], 'O'); } text(ctx, 'H₂O  H₂O  H₂O: always 2 H and 1 O', w / 2, mid + 56, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, 'so mass ratio H : O is always 2 : 16 = 1 : 8', w / 2, mid + 74, { color: col.s[3], size: 11, align: 'center' }); }
    if (step === 4) {
      const f = ease(Math.min(1, (t % 4.5) / 2.2)), L = w * 0.2, Rr = w * 0.72, y = mid - 10;
      // before: H2 H2 O2 (left); after: H2O H2O (right). Atoms slide to their new partners.
      const H0 = [[L - 14, y - 34], [L + 14, y - 34], [L - 14, y + 4], [L + 14, y + 4]], O0 = [[L - 14, y + 50], [L + 14, y + 50]];
      const H1 = [[Rr - 30, y - 20], [Rr - 6, y - 20], [Rr + 6, y + 40], [Rr + 30, y + 40]], O1 = [[Rr - 18, y - 4], [Rr + 18, y + 56]];
      H0.forEach((p, i) => at(p[0] + (H1[i][0] - p[0]) * f, p[1] + (H1[i][1] - p[1]) * f, 8, col.s[0], 'H'));
      O0.forEach((p, i) => at(p[0] + (O1[i][0] - p[0]) * f, p[1] + (O1[i][1] - p[1]) * f, 11, col.s[1], 'O'));
      text(ctx, '2 H₂ + O₂', L, 50, { color: col.muted, size: 11, align: 'center' }); text(ctx, '2 H₂O', Rr, 50, { color: col.muted, size: 11, align: 'center' });
      text(ctx, '4 H + 2 O  →  4 H + 2 O', w / 2, mid + 90, { color: col.ink, size: 11.5, align: 'center', weight: 700 });
    }
    const wds = TXT[step].split(' '), L = []; let cur = ''; wds.forEach((wd) => { if ((cur + ' ' + wd).trim().length > w / 6.3) { L.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); }); L.push(cur);
    L.forEach((l, i) => text(ctx, l, w / 2, h - 12 - (L.length - 1 - i) * 15, { color: col.ink, size: 11, align: 'center' }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); t = 0; cv.redraw(); } };
}
