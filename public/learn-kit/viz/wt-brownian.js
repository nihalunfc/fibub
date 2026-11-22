// Brownian motion up close. A pollen grain (big dot) is hit from all sides by tiny invisible molecules, so it jiggles in
// a random walk. Many grains start together at the centre; the cloud spreads and the average of r² grows in a straight line
// with time, <r²> = 4Dt in two dimensions: the signature of diffusion. Raise the temperature (kicks) and the line gets steeper.
import { canvas, axes, line, dot, text, title, row, slider, button, readout, loop, rng } from '../kit.js';

const NP = 60;
export default function (host) {
  let kick = 1, t = 0, R = rng(21), P = [], hist = [[0, 0]], trail = [];
  const g = () => { let s = 0; for (let i = 0; i < 4; i++) s += R(); return (s - 2) * 1.73; };
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 300, label: 'Pollen grains random walking outward with the mean square displacement growing linearly' });
  const ctl = row(host);
  slider(ctl, { label: 'Kick strength (∝ √T)', min: 0.3, max: 2, step: 0.05, value: kick, fmt: (v) => v.toFixed(2), oninput: (v) => { kick = v; reset(); } });
  const c2 = row(host); const lp = loop(host, (dt) => { step(dt); cv.redraw(); show(); }); lp.button(c2); button(c2, 'Restart', () => reset());
  const out = readout(host);
  function reset() { R = rng(21); P = Array.from({ length: NP }, () => ({ x: 0, y: 0 })); trail = []; t = 0; hist = [[0, 0]]; cv.redraw(); show(); }
  let acc = 0;
  function step(dt) {
    acc += dt; while (acc > 0.05) { acc -= 0.05; t += 0.05; P.forEach((p, i) => { p.x += g() * kick * 0.3; p.y += g() * kick * 0.3; if (i === 0) { trail.push([p.x, p.y]); if (trail.length > 400) trail.shift(); } }); const m = P.reduce((s, p) => s + p.x * p.x + p.y * p.y, 0) / NP; if (hist.length < 400) hist.push([t, m]); }
    if (t > 18) reset();
  }
  const msd = () => P.reduce((s, p) => s + p.x * p.x + p.y * p.y, 0) / NP;
  function show() { const m = msd(), D = t > 0 ? m / (4 * t) : 0; out.innerHTML = `After t = ${t.toFixed(1)}: mean square displacement <b>⟨r²⟩ = ${m.toFixed(1)}</b>, so D = ⟨r²⟩/4t ≈ <b>${D.toFixed(2)}</b> (theory for this kick: ${(0.9 * kick * kick).toFixed(2)}). Typical distance ∝ √t, not t: after four times as long a grain is only twice as far. ⟨r²⟩ ∝ t is the signature of a random walk. Einstein: D = kT/(6πηa).`; }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `${NP} grains from the centre`, col);
    const pw = Math.min(h * 0.5, w * 0.55), cx = pw / 2 + 8, cy = 40 + pw / 2, sc = pw / 2 / 14;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(8, 40, pw, pw); ctx.beginPath(); ctx.moveTo(cx, 40); ctx.lineTo(cx, 40 + pw); ctx.moveTo(8, cy); ctx.lineTo(8 + pw, cy); ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.rect(8, 40, pw, pw); ctx.clip();
    line(ctx, trail.map(([x, y]) => [cx + x * sc, cy + y * sc]), col.s[3], 1.5);
    P.forEach((p, i) => dot(ctx, cx + p.x * sc, cy + p.y * sc, i ? 2.6 : 4.5, i ? col.s[0] : col.s[3]));
    ctx.restore();
    ctx.save(); ctx.translate(pw + 14, 28); const A = axes(ctx, w - pw - 20, h - 28, col, { x: [0, 18], y: [0, Math.max(60, msd() * 1.2)], xlabel: 'time', ylabel: '⟨r²⟩', l: 34, t: 8, b: 32, fx: (v) => v.toFixed(0), fy: (v) => v.toFixed(0) });
    line(ctx, hist.map(([a, b]) => [A.X(a), A.Y(b)]), col.s[1], 2.5);
    if (t > 0.5) line(ctx, [[A.X(0), A.Y(0)], [A.X(18), A.Y((msd() / t) * 18)]], col.muted, 1, [4, 4]);
    ctx.restore();
  };
  reset();
}
