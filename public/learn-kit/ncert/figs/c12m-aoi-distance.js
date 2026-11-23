// Class 12 Maths, Application of Integrals: area under a speed–time graph is the distance. A train leaves a station,
// speeds up, cruises and brakes (speed v in m/s against time t). Play the clock: the shaded area grows and the distance
// counter equals it, because distance = ∫ v dt. The slope of the same graph would give acceleration.
import { canvas, axes, row, slider, readout, line, dot, text, title, loop } from '../../kit.js';

const v = (t) => (t < 10 ? 2 * t : t < 30 ? 20 : t < 40 ? 20 - 2 * (t - 30) : 0);
export default function (host) {
  let t = 12, g;
  const cv = canvas(host, { aspect: 0.75, max: 430, min: 280, label: 'A speed time graph of a train with the area under it growing as time passes' });
  const c = row(host), out = readout(host);
  const sl = slider(c, { label: 'time t', min: 0, max: 40, step: 0.1, value: t, fmt: (x) => x.toFixed(1) + ' s', oninput: (x) => { t = x; re(); } });
  const anim = loop(host, (dt) => { t += dt * 5; if (t > 40) t = 0; sl.set(t); re(); }, { autoplay: false }); anim.button(c);
  const dist = (T) => { let s = 0; const n = 800; for (let i = 0; i < n; i++) s += v((i + 0.5) * T / n) * T / n; return s; };
  const re = () => { cv.redraw(); out.innerHTML = `At t = ${t.toFixed(1)} s the speed is ${v(t).toFixed(1)} m/s (${(v(t) * 3.6).toFixed(0)} km/h) and the area under the graph so far is <b>${dist(t).toFixed(0)} m</b>. Total for the whole journey: 600 m.`; };
  cv.draw = (ctx, w, h, col) => {
    const tt = title(ctx, 'Area under the speed–time graph = distance travelled', col);
    g = axes(ctx, w, h, col, { x: [0, 40], y: [0, 24], l: 46, b: 34, t: tt + 4, r: 12, xlabel: 'time (s)', ylabel: 'speed (m/s)' });
    ctx.save(); g.clip(); ctx.globalAlpha = 0.3; ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.moveTo(g.X(0), g.Y(0)); for (let i = 0; i <= 120; i++) { const x = t * i / 120; ctx.lineTo(g.X(x), g.Y(v(x))); } ctx.lineTo(g.X(t), g.Y(0)); ctx.fill(); ctx.globalAlpha = 1;
    const pts = []; for (let i = 0; i <= 160; i++) { const x = 40 * i / 160; pts.push([g.X(x), g.Y(v(x))]); } line(ctx, pts, col.ink, 2.5); ctx.restore();
    dot(ctx, g.X(t), g.Y(v(t)), 5, col.s[1], col.panel); line(ctx, [[g.X(t), g.Y(0)], [g.X(t), g.Y(v(t))]], col.s[1], 1.5, [4, 3]);
    text(ctx, 'speeding up', g.X(5), g.Y(14), { color: col.muted, size: 10.5, align: 'center', halo: col.panel }); text(ctx, 'cruising', g.X(20), g.Y(22.2), { color: col.muted, size: 10.5, align: 'center' }); text(ctx, 'braking', g.X(35), g.Y(14), { color: col.muted, size: 10.5, align: 'center', halo: col.panel });
  };
  re();
}
