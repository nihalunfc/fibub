// Class 12 Chemistry, d- and f-block: lanthanoids (4f filling) against actinoids (5f filling): configuration and oxidation states.
// Lanthanoids are almost always +3 (with +2 for Eu, Yb that give a half-full or full 4f, and +4 for Ce, Tb). The 5f orbitals reach out further and are close to 6d and 7s,
// so the actinoids show a wide range of states, up to +7 for Np and Pu.
import { canvas, text, title, axes, dot, row, slider, choice, readout } from '../../kit.js';

const LN = [['La', '5d¹ 6s²', [3], []], ['Ce', '4f¹ 5d¹ 6s²', [3], [4]], ['Pr', '4f³ 6s²', [3], [4]], ['Nd', '4f⁴ 6s²', [3], [2]], ['Pm', '4f⁵ 6s²', [3], []], ['Sm', '4f⁶ 6s²', [3], [2]], ['Eu', '4f⁷ 6s²', [3], [2]], ['Gd', '4f⁷ 5d¹ 6s²', [3], []], ['Tb', '4f⁹ 6s²', [3], [4]], ['Dy', '4f¹⁰ 6s²', [3], [4]], ['Ho', '4f¹¹ 6s²', [3], []], ['Er', '4f¹² 6s²', [3], []], ['Tm', '4f¹³ 6s²', [3], [2]], ['Yb', '4f¹⁴ 6s²', [3], [2]], ['Lu', '4f¹⁴ 5d¹ 6s²', [3], []]];
const AN = [['Ac', '6d¹ 7s²', [3], []], ['Th', '6d² 7s²', [4], [3]], ['Pa', '5f² 6d¹ 7s²', [5, 4], [3]], ['U', '5f³ 6d¹ 7s²', [6, 4], [3, 5]], ['Np', '5f⁴ 6d¹ 7s²', [5, 6], [3, 4, 7]], ['Pu', '5f⁶ 7s²', [4, 6], [3, 5, 7]], ['Am', '5f⁷ 7s²', [3], [4, 5, 6]], ['Cm', '5f⁷ 6d¹ 7s²', [3], [4]], ['Bk', '5f⁹ 7s²', [3], [4]], ['Cf', '5f¹⁰ 7s²', [3], [2]], ['Es', '5f¹¹ 7s²', [3], [2]], ['Fm', '5f¹² 7s²', [3], [2]], ['Md', '5f¹³ 7s²', [3], [2]], ['No', '5f¹⁴ 7s²', [2], [3]], ['Lr', '5f¹⁴ 6d¹ 7s²', [3], []]];

export default function (host) {
  let k = 6, ser = 'ln';
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Oxidation states of the lanthanoids and the actinoids' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'series', [['ln', 'lanthanoids'], ['an', 'actinoids']], ser, (v) => { ser = v; sl.set(k); go(); });
  const sl = slider(ctl, { label: 'element', min: 0, max: 14, step: 1, value: k, fmt: (v) => (ser === 'ln' ? LN : AN)[v][0], oninput: (v) => { k = v; go(); } });
  const go = () => {
    const [n, c, st, rare] = (ser === 'ln' ? LN : AN)[k];
    ro.textContent = `${n}: [${ser === 'ln' ? 'Xe' : 'Rn'}] ${c}. Common: ${st.map((x) => '+' + x).join(', ')}` + (rare.length ? `; less common: ${rare.map((x) => '+' + x).join(', ')}` : '') + (ser === 'ln' ? '. Almost always +3.' : '. A wider range than the lanthanoids.');
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const D = ser === 'ln' ? LN : AN;
    title(ctx, ser === 'ln' ? 'Lanthanoids: La to Lu' : 'Actinoids: Ac to Lr', col);
    const A = axes(ctx, w, h, col, { x: [-0.5, 14.5], y: [1.5, 7.5], xt: [], yt: [2, 3, 4, 5, 6, 7], fy: (v) => '+' + v, ylabel: 'oxidation state', l: 44, t: 32, b: 34 });
    ctx.fillStyle = col.soft; ctx.globalAlpha = 0.7; ctx.fillRect(A.X(k - 0.5), A.T, A.X(1) - A.X(0), A.B - A.T); ctx.globalAlpha = 1;
    D.forEach(([n, , c, r], i) => {
      text(ctx, n, A.X(i), A.B + 14, { color: i === k ? col.ink : col.muted, size: 10, weight: i === k ? 700 : 400, align: 'center' });
      c.forEach((s) => dot(ctx, A.X(i), A.Y(s), 5, i === k ? col.s[0] : col.s[2], col.panel));
      r.forEach((s) => { ctx.strokeStyle = col.s[2]; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(A.X(i), A.Y(s), 4.5, 0, 7); ctx.stroke(); });
    });
  };
  go();
}
