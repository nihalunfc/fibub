// Ranking and Top N with ties. Eight products (made-up sales), two of the pairs tie. Choose how ranks are numbered (RANKX
// "skip" leaves a gap after a tie, "dense" does not) and slide N: TOPN returns ties, so Top 2 can give three products.
import { canvas, text, title, row, slider, choice, readout } from '../kit.js';
import { money } from './_biz.js';

const P = [['Tent', 950], ['Kettle', 870], ['Lamp', 870], ['Jar', 720], ['Pan', 640], ['Chair', 640], ['Tray', 410], ['Cup', 220]];
export default function (host) {
  let ties = 'skip';
  const cv = canvas(host, { aspect: 0.86, max: 400, min: 330, label: 'Products ranked by sales with the Top N highlighted' });
  const ctl = row(host);
  choice(ctl, 'Rank ties', [['skip', 'Skip (1,2,2,4)'], ['dense', 'Dense (1,2,2,3)']], ties, (v) => { ties = v; cv.redraw(); show(); });
  const N = slider(ctl, { label: 'N', min: 1, max: 8, step: 1, value: 2, fmt: (v) => 'Top ' + v, oninput: () => { cv.redraw(); show(); } });
  const out = readout(host);
  const rank = (i) => (ties === 'skip' ? 1 + P.filter((p) => p[1] > P[i][1]).length : 1 + new Set(P.filter((p) => p[1] > P[i][1]).map((p) => p[1])).size);
  const topn = () => { const th = P[N.value - 1][1]; return P.filter((p) => p[1] >= th); };
  function show() { const t = topn(); out.innerHTML = `<b>TOPN ( ${N.value}, Products, [Sales] )</b> returns <b>${t.length} products</b>${t.length > N.value ? ' (more than N, because of a tie at the cut-off)' : ''}: ${t.map((p) => p[0]).join(', ')}, together <b>${money(t.reduce((a, p) => a + p[1], 0))}</b>. RANKX gives the tied products the same rank.`; }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Sales by product, ranked', col);
    const t = topn().map((p) => p[0]), top = 36, rh = (h - top - 8) / 8, L = 92, bw = w - L - 60;
    P.forEach(([n, v], i) => {
      const y = top + i * rh, on = t.includes(n);
      text(ctx, rank(i) + '', 12, y + rh / 2 - 1, { color: col.s[1], size: 13, weight: 800, align: 'center', fit: false });
      text(ctx, n, 26, y + rh / 2 - 1, { color: col.ink, size: 11.5, weight: on ? 700 : 400, fit: false });
      ctx.globalAlpha = on ? 1 : 0.25; ctx.fillStyle = col.s[0]; ctx.fillRect(L, y + 3, (bw * v) / 950, rh - 7); ctx.globalAlpha = 1;
      text(ctx, '$' + v, L + (bw * v) / 950 + 5, y + rh / 2 - 1, { color: col.muted, size: 10.5, fit: false });
    });
  };
  show(); cv.redraw();
}
