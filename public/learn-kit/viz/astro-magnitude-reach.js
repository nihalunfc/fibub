// How far away could you still see a star? Pick a real star (its absolute magnitude M is its brightness at 10 parsecs) and slide
// its distance. Apparent magnitude m = M + 5 log10(d/10) falls with distance (a bigger number is fainter); the dashed lines are the
// faintest stars the naked eye, binoculars and an 8-inch telescope show. Where the curve crosses a line is that tool's reach.
import { canvas, text, row, slider, choice, readout, axes, line, dot, title } from '../kit.js';

const STAR = { sun: ['Sun', 4.83], vega: ['Vega', 0.58], sirius: ['Sirius A', 1.43], betel: ['Betelgeuse', -5.85], deneb: ['Deneb', -8.4], prox: ['Proxima Cen.', 15.5] };
const LIM = [['naked eye', 6, 2], ['binoculars', 9.5, 3], ['8-inch scope', 14, 4]];
export default function (host) {
  let id = 'sun', d = 10;
  const cv = canvas(host, { aspect: 0.8, max: 400, min: 290, label: 'Apparent magnitude of a star against its distance with the naked eye, binoculars and telescope limits' });
  const c1 = row(host);
  choice(c1, 'Star', Object.entries(STAR).map(([k, v]) => [k, v[0]]), id, (v) => { id = v; show(); });
  slider(row(host), { label: 'Distance', min: 1, max: 10000, value: d, log: true, fmt: (v) => `${v < 100 ? v.toFixed(1) : Math.round(v)} pc`, oninput: (v) => { d = v; show(); } });
  const out = readout(host);
  const m = (M, dd) => M + 5 * Math.log10(dd / 10);
  function show() {
    const [name, M] = STAR[id], mm = m(M, d);
    const reach = (l) => 10 * Math.pow(10, (l - M) / 5);
    out.innerHTML = `${name} has M = ${M}. At ${d < 100 ? d.toFixed(1) : Math.round(d)} pc (${(d * 3.2616).toFixed(d < 100 ? 1 : 0)} light-years) it shines at <b>m = ${mm.toFixed(1)}</b>, ${mm < 6 ? 'so the naked eye sees it' : mm < 9.5 ? 'visible in binoculars only' : mm < 14 ? 'visible in a telescope only' : 'beyond an 8-inch telescope'}. Reach: naked eye <b>${fm(reach(6))}</b>, binoculars ${fm(reach(9.5))}, 8-inch ${fm(reach(14))}. Every 5 magnitudes is 100× in brightness.`;
    cv.redraw();
  }
  const fm = (p) => (p < 10 ? p.toFixed(1) : p < 1000 ? Math.round(p) : (p / 1000).toFixed(p < 1e4 ? 1 : 0) + 'k') + ' pc';
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `Apparent magnitude of ${STAR[id][0]} with distance`, col);
    const M = STAR[id][1], A = axes(ctx, w, h, col, { x: [1, 10000], y: [24, -12], xlog: true, xlabel: 'distance (parsecs, log scale)', ylabel: 'apparent magnitude m (fainter ↓)', t: 40, l: 46, fx: (v) => (v >= 1000 ? v / 1000 + 'k' : v) });
    ctx.save(); A.clip();
    LIM.forEach(([n, v, c]) => { ctx.setLineDash([5, 4]); ctx.strokeStyle = col.s[c - 1]; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(A.L, A.Y(v)); ctx.lineTo(A.R, A.Y(v)); ctx.stroke(); });
    ctx.setLineDash([]); ctx.restore();
    LIM.forEach(([n, v, c]) => text(ctx, `${n} (${v})`, A.L + 6, A.Y(v) - 8, { color: col.s[c - 1], size: 10.5, weight: 600 }));
    const pts = []; for (let i = 0; i <= 80; i++) { const dd = Math.pow(10, (i / 80) * 4); pts.push([A.X(dd), A.Y(m(M, dd))]); }
    ctx.save(); A.clip(); line(ctx, pts, col.ink, 2.5); ctx.restore();
    const mm = m(M, d); dot(ctx, A.X(d), A.Y(Math.max(-12, Math.min(24, mm))), 6, mm < 6 ? col.good : col.bad, col.panel);
  };
  show();
}
