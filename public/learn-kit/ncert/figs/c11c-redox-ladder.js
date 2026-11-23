// Class 11 Chemistry, Redox Reactions: oxidation-state ladders. Each element has a lowest and highest oxidation number. An atom at the top rung can
// only be reduced (it is only an oxidising agent), one at the bottom rung can only be oxidised (only a reducing agent), and one in the middle can go
// either way. If a middle species is unstable it may disproportionate: Cl2 + 2OH- -> Cl- + ClO- + H2O (0 goes to -1 and +1).
import { canvas, text, title, arrow, choice, readout, row } from '../../kit.js';

const L = {
  Cl: [[-1, 'Cl⁻'], [0, 'Cl₂'], [1, 'ClO⁻'], [3, 'ClO₂⁻'], [5, 'ClO₃⁻'], [7, 'ClO₄⁻']],
  S: [[-2, 'H₂S'], [0, 'S'], [4, 'SO₂'], [6, 'SO₄²⁻']],
  N: [[-3, 'NH₃'], [0, 'N₂'], [2, 'NO'], [4, 'NO₂'], [5, 'NO₃⁻']],
  Mn: [[0, 'Mn'], [2, 'Mn²⁺'], [4, 'MnO₂'], [6, 'MnO₄²⁻'], [7, 'MnO₄⁻']],
};
export default function (host) {
  let el = 'Cl', sel = 1;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'Ladder of oxidation numbers for an element showing which species can be oxidised or reduced' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'element', Object.keys(L).map((k) => [k, k]), el, (v) => { el = v; sel = Math.min(1, L[el].length - 1); go(); });
  const geom = (w, h) => { const top = 74, bot = h - 54, n = L[el].length; return { top, bot, n, y: (i) => bot - (i / (n - 1)) * (bot - top) }; };
  cv.c.addEventListener('click', (e) => { const b = cv.c.getBoundingClientRect(), y = e.clientY - b.top, g = geom(cv.w, cv.h); let best = 0; L[el].forEach((_, i) => { if (Math.abs(g.y(i) - y) < Math.abs(g.y(best) - y)) best = i; }); sel = best; go(); });
  const go = () => {
    const [n, f] = L[el][sel], last = L[el].length - 1;
    ro.textContent = `${f} (${el} is ${n > 0 ? '+' : ''}${n}): ` + (sel === 0 ? 'lowest state, so it can only be oxidised: a reducing agent.' : sel === last ? 'highest state, so it can only be reduced: an oxidising agent.' : 'in the middle: can be oxidised (up) or reduced (down). Tap any rung to try another.');
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `Oxidation states of ${el} (tap a rung)`, col);
    const g = geom(w, h), cx = w * 0.42, bw = Math.min(150, w * 0.4);
    ctx.strokeStyle = col.line; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, g.top - 10); ctx.lineTo(cx, g.bot + 10); ctx.stroke();
    text(ctx, '▲ more oxidised', cx, g.top - 26, { color: col.s[3], size: 10, align: 'center' }); text(ctx, '▼ more reduced', cx, g.bot + 26, { color: col.s[0], size: 10, align: 'center' });
    L[el].forEach(([n, f], i) => {
      const y = g.y(i), on = i === sel;
      ctx.fillStyle = on ? col.soft : col.panel; ctx.fillRect(cx - bw / 2, y - 14, bw, 28); ctx.strokeStyle = on ? col.s[2] : col.line; ctx.lineWidth = on ? 3 : 1.2; ctx.strokeRect(cx - bw / 2, y - 14, bw, 28);
      text(ctx, f, cx, y, { color: col.ink, size: 13, weight: 700, align: 'center' });
      text(ctx, (n > 0 ? '+' : '') + n, cx - bw / 2 - 8, y, { color: col.muted, size: 12, weight: 700, align: 'right' });
    });
    const y = g.y(sel), last = L[el].length - 1, ax = cx + bw / 2 + 24;
    if (sel < last) { arrow(ctx, ax, y - 4, ax, y - 34, col.s[3], 3, 10); text(ctx, 'oxidised: loses e⁻', ax + 10, y - 24, { color: col.s[3], size: 10.5, weight: 700 }); }
    if (sel > 0) { arrow(ctx, ax, y + 4, ax, y + 34, col.s[0], 3, 10); text(ctx, 'reduced: gains e⁻', ax + 10, y + 24, { color: col.s[0], size: 10.5, weight: 700 }); }
    const kind = sel === 0 ? 'reducing agent only' : sel === last ? 'oxidising agent only' : 'can be both';
    text(ctx, kind, cx, h - 12, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
  };
  go();
}
