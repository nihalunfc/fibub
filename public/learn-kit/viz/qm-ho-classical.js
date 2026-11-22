// Quantum oscillator against its classical twin. Pick n: |ψₙ|² (filled) has n nodes and leaks past the classical turning
// points, while the classical ball (dashed curve 1/π√(2n+1−x²)) piles up at the ends. Slide n from 0 to 30 and watch
// the quantum bumps average out to the classical curve. Readout gives energy, turning points and the leaked probability.
import { canvas, axes, line, text, title, row, slider, choice, readout, loop, dot } from '../kit.js';

function psis(n, x) { // ħ=m=ω=1 eigenfunctions via recurrence
  let a = Math.pow(Math.PI, -0.25) * Math.exp(-x * x / 2), b = Math.SQRT2 * x * a;
  if (n === 0) return a; if (n === 1) return b;
  for (let k = 1; k < n; k++) { const c = Math.sqrt(2 / (k + 1)) * x * b - Math.sqrt(k / (k + 1)) * a; a = b; b = c; }
  return b;
}
export default function (host) {
  const cv = canvas(host, { aspect: 0.85, max: 460, min: 340, label: 'Quantum oscillator probability density against the classical probability' });
  let n = 6, view = 'both', t = 0;
  const ctl = row(host), ctl2 = row(host), out = readout(host);
  slider(ctl, { label: 'Level n', min: 0, max: 30, step: 1, value: n, fmt: (v) => String(v), oninput: (v) => { n = v; show(); } });
  choice(ctl2, 'Show', [['both', 'Quantum + classical'], ['q', 'Quantum only'], ['wave', 'ψ itself']], view, (v) => { view = v; cv.redraw(); });
  const anim = loop(host, (dt) => { t += dt * 1.5; cv.redraw(); });
  anim.button(ctl2);
  function show() {
    const xt = Math.sqrt(2 * n + 1); let out_ = 0; const N = 4000, X = 9;
    for (let i = 0; i < N; i++) { const x = -X + (2 * X * (i + 0.5)) / N; if (Math.abs(x) > xt) out_ += psis(n, x) ** 2 * (2 * X) / N; }
    out.innerHTML = `E<sub>${n}</sub> = (${n} + ½)ħω = <b>${n + 0.5}ħω</b> (never 0: the ground state keeps ½ħω). Classical turning points ±${xt.toFixed(2)} (in units of √(ħ/mω)). Probability found <b>outside</b> them: ${(out_ * 100).toFixed(1)}%. ${n} nodes inside.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `Oscillator n = ${n}`, col);
    const xt = Math.sqrt(2 * n + 1), XR = Math.max(5, xt + 2.5);
    const ym = n === 0 ? 0.75 : Math.max(0.5, 0.9 / Math.sqrt(xt)) ;
    const a = axes(ctx, w, h, col, { x: [-XR, XR], y: view === 'wave' ? [-ym * 1.3, ym * 1.3] : [0, ym * 1.4], l: 30, t: 44, b: 40, yt: [], xlabel: 'position x (units of √(ħ/mω))' });
    // potential (scaled to show well) as light curve with the level
    const Vs = (x) => 0.5 * x * x, Emax = n + 0.5, base = view === 'wave' ? -ym * 1.3 : 0, span = (view === 'wave' ? 2.6 * ym : 1.4 * ym);
    const mapV = (v) => base + (v / (Emax * 1.35)) * span * 0.98;
    line(ctx, Array.from({ length: 121 }, (_, i) => { const x = -XR + (i * 2 * XR) / 120; return [a.X(x), a.Y(Math.min(mapV(Vs(x)), base + span))]; }), col.line, 2);
    line(ctx, [[a.X(-XR), a.Y(mapV(Emax))], [a.X(XR), a.Y(mapV(Emax))]], col.muted, 1, [5, 4]);
    if (view === 'wave') { line(ctx, Array.from({ length: 301 }, (_, i) => { const x = -XR + (i * 2 * XR) / 300; return [a.X(x), a.Y(psis(n, x) * 0.5)]; }), col.s[0], 2); }
    else {
      ctx.beginPath(); ctx.moveTo(a.X(-XR), a.Y(0));
      for (let i = 0; i <= 300; i++) { const x = -XR + (i * 2 * XR) / 300; ctx.lineTo(a.X(x), a.Y(psis(n, x) ** 2)); }
      ctx.lineTo(a.X(XR), a.Y(0)); ctx.closePath(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.35; ctx.fill(); ctx.globalAlpha = 1;
      if (view === 'both') line(ctx, Array.from({ length: 300 }, (_, i) => { const x = -xt + 0.002 + (i * (2 * xt - 0.004)) / 299; return [a.X(x), a.Y(Math.min(ym * 1.38, 1 / (Math.PI * Math.sqrt(2 * n + 1 - x * x))))]; }), col.s[1], 2, [6, 4]);
    }
    [-xt, xt].forEach((x) => line(ctx, [[a.X(x), a.B], [a.X(x), a.T + 14]], col.muted, 1, [2, 4]));
    // classical ball
    const bx = xt * Math.cos(t); dot(ctx, a.X(bx), a.B - 7, 6, col.s[1]);
    text(ctx, view === 'both' ? '|ψ|² (blue)   classical (dashed)' : view === 'q' ? '|ψ|²' : 'ψ', a.L + 6, a.T + 6, { color: col.muted, size: 10.5 });
  };
  show();
}
