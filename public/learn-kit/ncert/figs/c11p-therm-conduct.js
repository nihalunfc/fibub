// Class 11 Thermal Properties of Matter: conduction through a slab and through two slabs in series. Steady state: heat current H = k A (T_hot - T_cold)/d. Thermal resistance of each layer R = d/(kA). For two layers
// H = (T_hot - T_cold) / (R1 + R2) and the temperature drops across each layer in proportion to its R, so the poor conductor takes most of the drop. k (W/m K): copper 400, steel 50, brick 0.7, glass wool 0.04, wood 0.15.
import { canvas, text, title, line, dot, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  const K = { cu: ['copper', 400], steel: ['steel', 50], brick: ['brick', 0.7], wood: ['wood', 0.15], wool: ['glass wool', 0.04] };
  let a = 'brick', b = 'wool', d1 = 20, d2 = 10, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Heat flowing through two layers of different materials with the temperature profile across them' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Layer 1', Object.entries(K).map(([k, v]) => [k, v[0]]), a, (v) => { a = v; go(); });
  choice(ctl, 'Layer 2', Object.entries(K).map(([k, v]) => [k, v[0]]), b, (v) => { b = v; go(); });
  slider(ctl, { label: 'thickness 1 (cm)', min: 5, max: 40, step: 5, value: d1, fmt: (v) => v + ' cm', oninput: (v) => { d1 = v; go(); } });
  slider(ctl, { label: 'thickness 2 (cm)', min: 5, max: 40, step: 5, value: d2, fmt: (v) => v + ' cm', oninput: (v) => { d2 = v; go(); } });
  const Th = 100, Tc = 0, calc = () => { const R1 = d1 / 100 / K[a][1], R2 = d2 / 100 / K[b][1], H = (Th - Tc) / (R1 + R2), Ti = Th - H * R1; return { R1, R2, H, Ti }; };
  const go = () => { const c = calc(); ro.textContent = `Per square metre: H = ΔT/(R₁ + R₂) = 100 / (${c.R1.toPrecision(2)} + ${c.R2.toPrecision(2)}) = ${c.H.toPrecision(3)} W. The junction sits at ${c.Ti.toFixed(1)} °C: the poorer conductor takes most of the temperature drop.`; cv.redraw(); };
  const dots = Array.from({ length: 16 }, (_, i) => ({ u: i / 16, r: ((i * 7) % 5) / 5 }));
  loop(host, (dt) => { const c = calc(); for (const p of dots) { p.u = (p.u + dt * Math.min(0.9, 0.05 + Math.log10(1 + c.H) * 0.12)) % 1; } t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Heat conducted through two layers', col) + 8, c = calc(), x0 = 24, x1 = w - 24, tot = d1 + d2, xm = x0 + (x1 - x0) * d1 / tot, y0 = top + 6, y1 = top + (h - top) * 0.48;
    const cs = { cu: col.s[2], steel: col.muted, brick: col.s[1], wood: col.s[4], wool: col.s[3] };
    ctx.fillStyle = cs[a]; ctx.globalAlpha = 0.55; ctx.fillRect(x0, y0, xm - x0, y1 - y0); ctx.fillStyle = cs[b]; ctx.fillRect(xm, y0, x1 - xm, y1 - y0); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, x1 - x0, y1 - y0); line(ctx, [[xm, y0], [xm, y1]], col.ink, 2);
    text(ctx, K[a][0], (x0 + xm) / 2, y0 + 12, { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel }); text(ctx, K[b][0], (xm + x1) / 2, y0 + 12, { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel });
    for (const p of dots) dot(ctx, x0 + p.u * (x1 - x0), y0 + 24 + p.r * (y1 - y0 - 34), 3, col.s[7] ?? col.ink);
    text(ctx, '100 °C', x0, y1 + 12, { color: col.s[1], size: 11, weight: 700 }); text(ctx, '0 °C', x1, y1 + 12, { color: col.s[0], size: 11, weight: 700, align: 'right' });
    const gy0 = y1 + 28, gy1 = h - 18, Y = (T) => gy1 - (T / 100) * (gy1 - gy0 - 4), pts = [[x0, Y(Th)], [xm, Y(c.Ti)], [x1, Y(Tc)]];
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(x0, gy0, x1 - x0, gy1 - gy0); line(ctx, pts, col.s[1], 3); dot(ctx, xm, Y(c.Ti), 5, col.s[3], col.panel);
    text(ctx, c.Ti.toFixed(0) + ' °C', xm + 6, Y(c.Ti) - 10, { color: col.s[3], size: 11, weight: 700 });
  };
  go();
}
