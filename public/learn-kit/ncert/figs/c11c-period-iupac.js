// Class 11 Chemistry, Classification of Elements: IUPAC temporary names of elements with Z above 100. The digits of Z are turned into roots,
// nil 0, un 1, bi 2, tri 3, quad 4, pent 5, hex 6, sept 7, oct 8, enn 9, and "ium" is added; the symbol takes the first letter of each root.
// (All elements up to 118 now have permanent names and symbols; the rule is still used for new ones.)
import { canvas, text, title, row, slider, readout } from '../../kit.js';

const R = ['nil', 'un', 'bi', 'tri', 'quad', 'pent', 'hex', 'sept', 'oct', 'enn'], PERM = { 101: 'Mendelevium (Md)', 104: 'Rutherfordium (Rf)', 110: 'Darmstadtium (Ds)', 112: 'Copernicium (Cn)', 113: 'Nihonium (Nh)', 114: 'Flerovium (Fl)', 115: 'Moscovium (Mc)', 116: 'Livermorium (Lv)', 117: 'Tennessine (Ts)', 118: 'Oganesson (Og)', 119: 'not yet made' };
export default function (host) {
  let Z = 118;
  const cv = canvas(host, { aspect: 0.5, max: 440, min: 230, label: 'The digits of an atomic number turned into an IUPAC systematic name' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'atomic number Z', min: 101, max: 199, step: 1, value: Z, fmt: (v) => v.toFixed(0), oninput: (v) => { Z = v; go(); } });
  const roots = () => String(Z).split('').map((d) => R[+d]);
  const name = () => { const s = roots().join(''); return (s.replace(/i$/, '') + 'ium').replace(/^./, (c) => c.toUpperCase()); };
  const sym = () => roots().map((r, i) => (i ? r[0] : r[0].toUpperCase())).join('').replace(/^(.)(.)(.)$/, '$1$2$3');
  const go = () => { ro.textContent = `Z = ${Z}: digits ${String(Z).split('').join(' · ')} → ${roots().join(' + ')} + ium = ${name()}, symbol ${roots().map((r, i) => (i ? r[0] : r[0].toUpperCase())).join('')}. ${PERM[Z] ? 'Permanent name today: ' + PERM[Z] + '.' : ''}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'name an element by its number', col) + 14, ds = String(Z).split(''), bw = Math.min(70, (w - 40) / 3), x0 = (w - 3 * bw - 16) / 2;
    ds.forEach((d, i) => { const x = x0 + i * (bw + 8); ctx.fillStyle = col.s[i]; ctx.globalAlpha = 0.25; ctx.fillRect(x, t0, bw, 40); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[i]; ctx.strokeRect(x, t0, bw, 40); text(ctx, d, x + bw / 2, t0 + 20, { color: col.ink, size: 22, weight: 700, align: 'center' }); text(ctx, R[+d], x + bw / 2, t0 + 58, { color: col.s[i], size: 14, weight: 700, align: 'center' }); });
    text(ctx, name(), w / 2, t0 + 96, { color: col.ink, size: Math.min(24, w / 12), weight: 700, align: 'center' }); text(ctx, `symbol ${roots().map((r, i) => (i ? r[0] : r[0].toUpperCase())).join('')}`, w / 2, t0 + 120, { color: col.muted, size: 13, align: 'center' });
  };
  go();
}
