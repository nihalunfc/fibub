// Class 11 Mechanical Properties of Fluids: pressure in a liquid grows with depth, P = P0 + rho g h (gauge pressure rho g h). A diver (drag the depth slider) feels the same pressure in every direction at a given depth,
// whatever the shape of the container. The dam wall is drawn thicker at the bottom because the push is larger there. Densities: water 1000, sea water 1025, mercury 13600 kg/m3, g = 9.8.
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let h = 10, liq = 'water';
  const L = { water: ['fresh water', 1000, 0], sea: ['sea water', 1025, 1], oil: ['mercury', 13600, 3] };
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A liquid tank with a probe at adjustable depth and a graph of pressure against depth' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Liquid', Object.entries(L).map(([k, v]) => [k, v[0]]), liq, (v) => { liq = v; if (v === 'oil') { h = Math.min(h, 1); sl.set(h); } go(); });
  const sl = slider(ctl, { label: 'depth h (m)', min: 0, max: 20, step: 0.5, value: h, fmt: (v) => v.toFixed(1) + ' m', oninput: (v) => { h = liq === 'oil' ? Math.min(v, 1.5) : v; go(); } });
  const go = () => { const rho = L[liq][1], g = rho * 9.8 * h, tot = g + 101325; ro.textContent = `At ${h.toFixed(1)} m in ${L[liq][0]}: gauge pressure ρgh = ${(g / 1000).toFixed(1)} kPa, total P = P₀ + ρgh = ${(tot / 1000).toFixed(1)} kPa (${(tot / 101325).toFixed(2)} atmospheres).`; cv.redraw(); };
  cv.draw = (ctx, w, h2, col) => {
    const top = title(ctx, 'Pressure grows with depth: P = P₀ + ρgh', col) + 14, x0 = 16, x1 = w * 0.52, y0 = top + 14, y1 = h2 - 20, hmax = liq === 'oil' ? 1.5 : 20;
    ctx.fillStyle = col.soft; ctx.fillRect(x0, y0, x1 - x0, y1 - y0); line(ctx, [[x0, y0], [x1, y0]], col.s[0], 2);
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.18; ctx.fillRect(x0, y0, x1 - x0, y1 - y0); ctx.globalAlpha = 1;
    line(ctx, [[x0, y0], [x0, y1], [x1, y1], [x1, y0]], col.ink, 2);
    const py = y0 + (h / hmax) * (y1 - y0 - 6), px = (x0 + x1) / 2;
    for (const a of [0, 1, 2, 3, 4, 5, 6, 7]) { const an = a * Math.PI / 4, len = 8 + 22 * (h / hmax); arrow(ctx, px + Math.cos(an) * (len + 8), py + Math.sin(an) * (len + 8), px + Math.cos(an) * 9, py + Math.sin(an) * 9, col.s[1], 1.5, 5); }
    dot(ctx, px, py, 6, col.s[3], col.panel); text(ctx, 'same push in every direction', px, y1 + 10, { color: col.muted, size: 10.5, align: 'center' });
    line(ctx, [[x0, py], [x1, py]], col.s[3], 1, [3, 3]); text(ctx, 'h', x1 - 8, (y0 + py) / 2, { color: col.s[3], size: 11, weight: 700 }); arrow(ctx, x1 - 14, y0 + 2, x1 - 14, py - 2, col.s[3], 1.5, 5);
    const A = (() => { const gx = w * 0.62, gr = w - 14, gt = y0, gb = y1 - 22; return { gx, gr, gt, gb }; })();
    const pmax = 101325 + L[liq][1] * 9.8 * hmax, X = (p) => A.gx + (p / pmax) * (A.gr - A.gx), Y = (d) => A.gt + (d / hmax) * (A.gb - A.gt);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(A.gx, A.gt); ctx.lineTo(A.gx, A.gb); ctx.lineTo(A.gr, A.gb); ctx.stroke();
    line(ctx, [[X(101325), Y(0)], [X(pmax), Y(hmax)]], col.s[0], 3); const pc = 101325 + L[liq][1] * 9.8 * h; dot(ctx, X(pc), Y(h), 5, col.s[3], col.panel);
    line(ctx, [[A.gx, Y(h)], [X(pc), Y(h)]], col.s[3], 1, [3, 3]);
    text(ctx, 'P', A.gr, A.gb + 12, { color: col.ink, size: 11, weight: 700, align: 'right' }); text(ctx, 'depth ↓', A.gx + 4, A.gt - 6, { color: col.ink, size: 10.5 });
    text(ctx, 'P₀ at surface', A.gx + 6, A.gt + 8 + 12, { color: col.muted, size: 10 });
  };
  go();
}
