// #809 poster layout: maths checks. Expected numbers were worked out separately in Python (plain arithmetic and
// math.tan) for an A0 portrait poster, 3 columns, 25 mm margins, 20 mm gutters, 150 mm title and 60 mm footer.
import { PAPERS, layout, capHeight, fontPt, readableAt, charsPerLine, textGuide, ROLES, posterSvg } from '../../src/lib/sci/poster.ts';
const close = (a, b, t) => Math.abs(a - b) <= t;
export default async (check) => {
  const a0 = PAPERS.find((p) => p.id === 'a0'), p36 = PAPERS.find((p) => p.id === '36x48');
  check('poster: A0 is 841 × 1189 mm, A sizes halve', a0.w === 841 && a0.h === 1189 && PAPERS.find((p) => p.id === 'a1').w === 594 && close(841 * 1189, 1e6, 1e3));
  check('poster: 36 × 48 in is 914.4 × 1219.2 mm', close(p36.w, 914.4, 1e-9) && close(p36.h, 1219.2, 1e-9));
  const L = layout({ w: 841, h: 1189, landscape: false, cols: 3, margin: 25, gutter: 20, title: 150, footer: 60 });
  check('poster: column width 250.33 mm and height 889 mm', close(L.colW, 250.3333333, 1e-6) && close(L.columns[0].h, 889, 1e-9));
  check('poster: column positions 25, 295.33, 565.67 mm; top at 195 mm', [25, 295.3333333, 565.6666667].every((x, i) => close(L.columns[i].x, x, 1e-6)) && L.columns.every((c) => c.y === 195));
  check('poster: footer band sits on the bottom margin', close(L.footer.y + L.footer.h, 1189 - 25, 1e-9) && close(L.columns[0].y + L.columns[0].h + 20, L.footer.y, 1e-9));
  check('poster: column area 667 639 mm²', close(L.area, 667639, 1e-6));
  { const l = layout({ w: 841, h: 1189, landscape: true, cols: 4, margin: 25, gutter: 20, title: 0, footer: 0 }); check('poster: landscape swaps sides, no bands', l.W === 1189 && l.H === 841 && l.title === null && l.columns[0].y === 25 && close(l.columns[0].h, 791, 1e-9)); }
  check('poster: too many columns message', String(layout({ w: 420, h: 594, landscape: false, cols: 8, margin: 100, gutter: 30, title: 0, footer: 0 })).includes('under 10 mm'));
  check('poster: bands too tall message', String(layout({ w: 420, h: 594, landscape: false, cols: 2, margin: 20, gutter: 10, title: 400, footer: 200 })).includes('no room'));
  check('poster: bad column count', String(layout({ w: 420, h: 594, landscape: false, cols: 0, margin: 20, gutter: 10, title: 0, footer: 0 })).startsWith('Choose 1 to 8'));
  // Text sizes: capitals spanning 3 × 5 arcmin.
  check('poster: capital height at 1.5 m is 6.545 mm', close(capHeight(1.5, 3), 6.545026, 1e-5));
  check('poster: font sizes 88.35, 53.01, 26.50, 17.67 pt at 5, 3, 1.5, 1 m', [[5, 88.346811], [3, 53.008086], [1.5, 26.504043], [1, 17.669362]].every(([d, p]) => close(fontPt(d, 3), p, 1e-5)));
  check('poster: 28 pt is readable to 1.585 m', close(readableAt(28, 3), 1.584664, 1e-5) && close(readableAt(fontPt(2.2, 3), 3), 2.2, 1e-12));
  check('poster: about 50 characters per line at 28 pt in a 250 mm column', charsPerLine(250.3333, 28) === 50);
  { const g = textGuide(ROLES, 3, L.colW); check('poster: guide rounds up to even points (90, 54, 28, 18)', g.map((r) => r.round).join() === '90,54,28,18'); }
  check('poster: comfort scales size linearly for small angles', close(fontPt(1.5, 6) / fontPt(1.5, 3), 2, 1e-4));
  { const svg = posterSvg(L, textGuide(ROLES, 3, L.colW), 'A0 & co');
    check('poster: SVG is true size with every guide', svg.startsWith('<svg') && svg.includes('width="841mm" height="1189mm" viewBox="0 0 841 1189"') && svg.includes('id="column-3" x="565.7"') && svg.includes('id="title-band"') && svg.includes('id="footer-band"') && svg.includes('A0 &amp; co') && svg.trim().endsWith('</svg>')); }
};
