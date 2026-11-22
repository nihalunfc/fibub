// Rutherford scattering: a beam of α particles aimed at a nucleus. Each one is deflected by the 1/r² repulsion; the closer it is
// aimed (small impact parameter b) the bigger the angle, b = (d/2) cot(θ/2). Move b to see one path, change the target (gold is heavy
// and strong, aluminium weaker) and energy, and notice that only head-on tosses bounce straight back: the nucleus is tiny and heavy.
import { canvas, axes, line, text, title, row, slider, choice, readout, loop, dot } from '../kit.js';

const TG = { Au: ['Gold', 79], Cu: ['Copper', 29], Al: ['Aluminium', 13] };
export default function (host) {
  const cv = canvas(host, { aspect: 0.95, max: 480, min: 360, label: 'Alpha particle trajectories bent by a nucleus' });
  let tg = 'Au', E = 5, b = 0.35, ph = 0, beam = true;
  const ctl = row(host), ctl2 = row(host), out = readout(host);
  choice(ctl, 'Target', Object.keys(TG).map((k) => [k, TG[k][0]]), tg, (v) => { tg = v; show(); });
  slider(ctl, { label: 'α energy', min: 2, max: 10, step: 0.5, value: E, fmt: (v) => v + ' MeV', oninput: (v) => { E = v; show(); } });
  slider(ctl2, { label: 'Impact parameter b / d', min: 0.02, max: 2, step: 0.01, value: b, fmt: (v) => v.toFixed(2), oninput: (v) => { b = v; show(); } });
  choice(ctl2, 'Beam', [[true, 'Whole beam'], [false, 'One α']], beam, (v) => { beam = v; show(); });
  const anim = loop(host, (dt) => { ph = (ph + dt * 0.35) % 1; cv.redraw(); });
  anim.button(ctl2);
  const d0 = () => (1.44 * 2 * TG[tg][1]) / E; // fm: head-on distance of closest approach
  const theta = (bb) => 2 * Math.atan(1 / (2 * bb)); // rad, bb in units of d0 (exact: tan(θ/2) = d0/(2b))
  function path(bb) { // integrate in units d0 = 1: a = (1/2) r̂/r² with unit speed
    const pts = []; let x = -6, y = bb, vx = 1, vy = 0; const dt = 0.01;
    for (let i = 0; i < 2600; i++) { const r = Math.hypot(x, y), a = 0.5 / (r * r * r), s = Math.min(1, r / 0.4) ; vx += a * x * dt; vy += a * y * dt; x += vx * dt; y += vy * dt; if (i % 6 === 0) pts.push([x, y]); if (Math.hypot(x, y) > 7) break; }
    return pts;
  }
  function show() {
    const th = (theta(b) * 180) / Math.PI, d = d0(), rmin = (d / 2) * (1 + 1 / Math.sin(theta(b) / 2));
    out.innerHTML = `d = Z₁Z₂e²/(4πε₀E) = <b>${d.toFixed(1)} fm</b> (nuclear radius ~${(1.2 * Math.cbrt(197)).toFixed(0)} fm for gold). b = ${(b * d).toFixed(1)} fm → <b>θ = ${th.toFixed(1)}°</b>, closest approach ${rmin.toFixed(1)} fm. ${th > 170 ? 'Almost straight back: the 1909 surprise (Geiger and Marsden saw about 1 in 8000 bounce back).' : th < 20 ? 'A far-off miss barely bends.' : ''} The count at angle θ goes as 1/sin⁴(θ/2).`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'α particles passing a nucleus', col);
    const cx = w * 0.45, cy = h * 0.36, sc = Math.min(w * 0.13, h * 0.12), clipB = h * 0.7;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 28, w, clipB - 28); ctx.clip();
    const bs = beam ? [-1.6, -1.1, -0.75, -0.5, -0.3, -0.15, 0.15, 0.3, 0.5, 0.75, 1.1, 1.6] : [];
    const draw = (bb, hl) => { const sg = Math.sign(bb) || 1, p = path(Math.abs(bb)).map(([x, y]) => [cx + x * sc, cy - sg * y * sc]); line(ctx, p, hl ? col.s[1] : col.s[0], hl ? 3 : 1.2); return p; };
    bs.forEach((q) => draw(q, false));
    const p = draw(b, true), k = Math.min(p.length - 1, Math.floor(ph * (p.length - 1))); dot(ctx, p[k][0], p[k][1], 5, col.s[1]);
    dot(ctx, cx, cy, 7, col.s[2]); text(ctx, 'nucleus', cx + 10, cy + 6, { color: col.s[2], size: 10, weight: 600 });
    line(ctx, [[cx - 6 * sc, cy - b * sc], [cx, cy - b * sc]], col.muted, 1, [3, 3]); text(ctx, 'b', cx - 6 * sc + 4, cy - b * sc - 8, { color: col.muted, size: 11, weight: 700 });
    ctx.restore();
    const a = axes(ctx, w, h, col, { x: [10, 180], y: [0.5, 30000], ylog: true, l: 44, t: clipB + 10, b: 38, yt: [1, 100, 10000], xt: [30, 90, 150], xlabel: 'scattering angle θ (°)', ylabel: 'N(θ)', fy: (v) => (v >= 1000 ? v / 1000 + 'k' : v) });
    line(ctx, Array.from({ length: 80 }, (_, i) => { const t = 10 + (i / 79) * 170; return [a.X(t), a.Y(1 / Math.sin(t * Math.PI / 360) ** 4 * 0.9 / 1)]; }), col.s[2], 2);
    const tb = (theta(b) * 180) / Math.PI; dot(ctx, a.X(Math.max(10, tb)), a.Y(0.9 / Math.sin(Math.max(10, tb) * Math.PI / 360) ** 4), 5, col.s[1]);
    text(ctx, '1/sin⁴(θ/2)', a.R - 4, a.T + 8, { color: col.s[2], size: 10, weight: 600, align: 'right' });
  };
  show();
}
