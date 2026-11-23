// Class 11 Kinetic Theory (step player): mean free path. A molecule of diameter d moving at speed v sweeps a cylinder of cross-section pi d^2.
// It collides with every molecule whose centre lies in that cylinder: n pi d^2 v t collisions in time t (n = molecules per m^3). The free path is the length
// per collision, 1 / (n pi d^2); other molecules move too, which multiplies the collision rate by sqrt 2: lambda = 1 / (sqrt2 pi d^2 n).
// The picture is a 2D cartoon: dot size follows d and the number of dots follows n; the readout uses real 3D numbers.
import { canvas, text, title, line, loop, rng, row, slider, readout } from '../../kit.js';

export default function (host) {
  let step = 0, d = 0.3, nrel = 1;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'A molecule zigzagging between collisions in a crowd of other molecules' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'diameter d (nm)', min: 0.15, max: 0.6, step: 0.05, value: d, fmt: (v) => v.toFixed(2), oninput: (v) => { d = v; setup(); } });
  slider(ctl, { label: 'density n (× 2.7×10²⁵ per m³)', min: 0.25, max: 2, step: 0.25, value: nrel, fmt: (v) => v.toFixed(2), oninput: (v) => { nrel = v; setup(); } });
  let dots = [], p = { x: 20, y: 100, a: 0.3 }, trail = [], seg = 0, last = 0, lastFree = 0;
  const geo = () => ({ bx: 14, by: 30, bw: cv.w ? cv.w - 28 : 300, bh: (cv.h || 240) - 100 });
  function setup() {
    const R = rng(11), n = Math.round(22 * nrel), g = geo(); dots = [];
    for (let i = 0; i < n; i++) dots.push([R() * g.bw, R() * g.bh]);
    p = { x: 4, y: g.bh / 2, a: 0.25 }; trail = [[p.x, p.y]]; seg = 0; lastFree = 0;
    const lam = 1 / (Math.SQRT2 * Math.PI * (d * 1e-9) ** 2 * 2.7e25 * nrel);
    ro.innerHTML = `λ = 1 / (√2 π d² n) = <b>${(lam * 1e9).toFixed(0)} nm</b> (about ${(lam / (d * 1e-9)).toFixed(0)} molecule diameters). For air at STP it is about 70 nm, thousands of times the molecule size.`;
    cv.redraw();
  }
  const rad = () => 2 + d * 14;
  const anim = loop(host, (dt) => {
    const g = geo(), sp = 70 * dt; p.x += Math.cos(p.a) * sp; p.y += Math.sin(p.a) * sp; seg += sp;
    if (p.x > g.bw - 3 || p.x < 3) { p.a = Math.PI - p.a; p.x = Math.min(g.bw - 3, Math.max(3, p.x)); trail.push([p.x, p.y]); }
    if (p.y > g.bh - 3 || p.y < 3) { p.a = -p.a; p.y = Math.min(g.bh - 3, Math.max(3, p.y)); trail.push([p.x, p.y]); }
    for (const [x, y] of dots) { if (Math.hypot(x - p.x, y - p.y) < 2 * rad() * 0.9 && seg > 6) { p.a += 1.4 + Math.random() * 3.4; trail.push([p.x, p.y]); lastFree = seg; seg = 0; break; } }
    if (trail.length > 14) trail.shift();
    cv.redraw();
  });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, ['A molecule meets others now and then', 'Collision if a centre is within d', 'Swept cylinder: volume π d² v t', 'λ = 1 / (√2 π d² n)'][step], col);
    const g = { bx: 14, by: 30, bw: w - 28, bh: h - 100 }; cv.w = w; cv.h = h;
    ctx.fillStyle = col.soft; ctx.fillRect(g.bx, g.by, g.bw, g.bh); ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.strokeRect(g.bx, g.by, g.bw, g.bh);
    ctx.save(); ctx.beginPath(); ctx.rect(g.bx, g.by, g.bw, g.bh); ctx.clip(); ctx.translate(g.bx, g.by);
    const r = rad();
    for (const [x, y] of dots) { ctx.fillStyle = col.muted; ctx.globalAlpha = 0.55; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.globalAlpha = 1; }
    if (step >= 1) { const ex = p.x + Math.cos(p.a) * 60, ey = p.y + Math.sin(p.a) * 60; ctx.save(); ctx.strokeStyle = col.s[3]; ctx.globalAlpha = 0.28; ctx.lineWidth = 4 * r; ctx.lineCap = 'butt'; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(ex, ey); ctx.stroke(); ctx.restore(); }
    line(ctx, trail.concat([[p.x, p.y]]), col.s[0], 1.5);
    ctx.fillStyle = col.s[1]; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 7); ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.stroke();
    ctx.restore();
    const T = ['Path = straight lines joined at collisions. Average length λ.', 'Hits happen when another centre lies within d of the path: a tube of radius d.', 'In time t: collisions = n × π d² v t. Free path = v t / collisions = 1 / (n π d²).', 'Others move too: relative speed is √2 times larger, so λ = 1 / (√2 π d² n).'][step];
    const words = T.split(' '); let l1 = '', l2 = ''; for (const wd of words) { if ((l1 + wd).length < Math.max(30, w / 7.4) && !l2) l1 += wd + ' '; else l2 += wd + ' '; }
    text(ctx, l1.trim(), w / 2, h - 36, { color: col.ink, size: 11.5, weight: 700, align: 'center' }); text(ctx, l2.trim(), w / 2, h - 16, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
  };
  setup();
  return { step(i) { step = Math.min(i, 3); cv.redraw(); } };
}
