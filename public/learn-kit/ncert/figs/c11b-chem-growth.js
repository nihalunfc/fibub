// Class 11 Biology, Chemical coordination: growth hormone from the anterior pituitary. Too little in childhood gives pituitary dwarfism (normal proportions, adult height about 120 cm);
// too much in childhood gives gigantism; too much in an adult, after the bones have stopped lengthening, gives acromegaly (thick jaw, hands and feet, normal height). Illustrative curves.
import { canvas, text, title, axes, line, row, choice, readout } from '../../kit.js';

export default function (host) {
  let k = 'dwarf';
  const D = { dwarf: ['Too little GH in childhood: pituitary dwarfism', 'Growth is slow and stops short: adult height about 120 cm, with normal body proportions and normal intelligence. Treated with GH injections.'], giant: ['Too much GH in childhood: gigantism', 'A tumour of the pituitary makes GH while the growth plates are still open: heights above 210 cm and more.'], acro: ['Too much GH in an adult: acromegaly', 'The bones can no longer grow longer, so height stays normal, but the jaw, hands, feet and nose thicken and enlarge.'] };
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Height against age for normal growth compared with too little or too much growth hormone' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Case', [['dwarf', 'Too little'], ['giant', 'Too much (child)'], ['acro', 'Too much (adult)']], k, (v) => { k = v; go(); });
  const norm = (a) => 50 + 120 * (1 - Math.exp(-a / 7)) * 1.0 + (a > 20 ? 0 : 0);
  const cur = { dwarf: (a) => 50 + 70 * (1 - Math.exp(-a / 9)), giant: (a) => 50 + 175 * (1 - Math.exp(-a / 9)), acro: (a) => 50 + 120 * (1 - Math.exp(-a / 7)) };
  const go = () => { ro.textContent = `${D[k][0]}. ${D[k][1]}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, D[k][0].split(':')[1].trim(), col), A = axes(ctx, w, h, col, { x: [0, 25], y: [40, 240], xlabel: 'age (years)', ylabel: 'height (cm)', l: 52, t: t0 + 8, b: 40, xt: [0, 5, 10, 15, 20, 25], yt: [50, 100, 150, 200] });
    const pl = (f, c, wd, dash) => { const pts = []; for (let a = 0; a <= 25; a += 0.5) pts.push([A.X(a), A.Y(f(a))]); line(ctx, pts, c, wd, dash); };
    pl(norm, col.muted, 2.5, [5, 4]); pl(cur[k], col.s[3], 3.5);
    text(ctx, 'normal', A.X(25), A.Y(norm(25)) + 12, { color: col.muted, size: 10.5, align: 'right' });
    if (k === 'acro') { text(ctx, 'after about 18 y the bones stop lengthening:', A.X(1), A.Y(225), { color: col.ink, size: 10 }); text(ctx, 'so height is normal, but bones thicken', A.X(1), A.Y(212), { color: col.ink, size: 10 }); }
  };
  go();
}
