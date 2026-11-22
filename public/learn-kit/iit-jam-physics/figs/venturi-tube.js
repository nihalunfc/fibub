// 2.8 Bernoulli in a Venturi tube. Water flows through a horizontal pipe with a narrow throat. Continuity makes it
// speed up in the throat; Bernoulli says its pressure must drop there, which the two open manometer columns show.
// Sliders: flow speed in the wide pipe and the ratio of the areas.
import { canvas, text, line, row, slider, readout, fmt, loop, title } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.58, max: 360, min: 250, label: 'A Venturi tube with two pressure columns' });
  let v1 = 1, k = 2, t = 0; // wide-pipe speed in m/s, area ratio A1/A2
  const ctl = row(host);
  slider(ctl, { label: 'Speed in wide pipe (m/s)', min: 0.2, max: 2, step: 0.05, value: v1, fmt: (x) => fmt(x, 3), oninput: (x) => { v1 = x; show(); cv.redraw(); } });
  slider(ctl, { label: 'Area ratio A₁/A₂', min: 1, max: 4, step: 0.1, value: k, fmt: (x) => fmt(x, 2), oninput: (x) => { k = x; show(); cv.redraw(); } });
  // tracer dots: x as a fraction of the pipe length, lane across it; each moves at the local speed (∝ 1/area)
  const dots = Array.from({ length: 44 }, (_, i) => ({ x: (i * 0.2357) % 1, lane: ((i * 0.618) % 1) * 1.6 - 0.8 }));
  let geo = null; // set in draw: { half(x px), x0, x1, h1 }
  const lp = loop(host, (dt) => {
    t += dt;
    if (geo) for (const d of dots) {
      const px = geo.x0 + d.x * (geo.x1 - geo.x0), r = geo.h1 / geo.half(px);
      d.x = (d.x + dt * 0.06 * v1 * r * r) % 1;
    }
    cv.redraw();
  });
  lp.button(ctl);
  const out = readout(host);
  const dp = () => 500 * ((k * v1) ** 2 - v1 * v1); // Pa, water
  const show = () => {
    out.innerHTML = `Throat speed v₂ = (A₁/A₂)v₁ = <b>${fmt(k * v1, 3)} m/s</b>. Pressure drop p₁ − p₂ = ½ρ(v₂² − v₁²) = <b>${fmt(dp(), 3)} Pa</b>, so the throat column stands <b>${fmt(dp() / 9800 * 100, 3)} cm</b> lower. Faster water, lower pressure.`;
  };
  cv.draw = (ctx, W, H, col) => {
    title(ctx, 'Venturi tube: pressure columns', col);
    const cy = H * 0.72, h1 = Math.min(34, H * 0.11), h2 = h1 / Math.sqrt(k); // half-heights (area ∝ height² for a round pipe)
    const x0 = 16, x1 = W - 16, a = x0 + (x1 - x0) * 0.3, b = x0 + (x1 - x0) * 0.45, c = x0 + (x1 - x0) * 0.55, d = x0 + (x1 - x0) * 0.7;
    const half = (x) => (x < a || x > d ? h1 : x < b ? h1 + (h2 - h1) * (x - a) / (b - a) : x <= c ? h2 : h2 + (h1 - h2) * (x - c) / (d - c));
    const top = [], bot = [];
    for (let x = x0; x <= x1; x += 2) { top.push([x, cy - half(x)]); bot.push([x, cy + half(x)]); }
    ctx.fillStyle = col.soft; ctx.beginPath(); top.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); bot.slice().reverse().forEach(([x, y]) => ctx.lineTo(x, y)); ctx.closePath(); ctx.fill();
    line(ctx, top, col.ink, 2); line(ctx, bot, col.ink, 2);
    geo = { half, x0, x1, h1 };
    for (const dd of dots) {
      const x = x0 + dd.x * (x1 - x0);
      ctx.beginPath(); ctx.arc(x, cy + dd.lane * half(x), 2.2, 0, Math.PI * 2); ctx.fillStyle = col.s[0]; ctx.fill();
    }
    // manometer columns
    const base = Math.max(40, dp() / 98 * 1.3); // cm of water in the wide-pipe column (the reference level is arbitrary)
    const colH = cy - 54, scale = colH / base; // px per cm of water, measured up from the pipe axis
    const hw = base * scale, ht = (base - dp() / 98) * scale;
    for (const [x, hh, lab] of [[(x0 + a) / 2, hw, 'wide'], [(b + c) / 2, Math.max(0, ht), 'throat']]) {
      const yTop = cy - half(x);
      ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.strokeRect(x - 5, cy - colH - 6, 10, yTop - (cy - colH - 6));
      ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.6; ctx.fillRect(x - 4, cy - hh, 8, Math.max(0, yTop - (cy - hh))); ctx.globalAlpha = 1;
      text(ctx, lab, x, cy + h1 + 16, { color: col.muted, size: 10.5, align: 'center' });
    }
    text(ctx, 'flow →', x0 + 4, cy + h1 + 16, { color: col.muted, size: 10.5 });
  };
  cv.redraw(); show();
}
