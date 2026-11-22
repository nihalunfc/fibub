// Heat flow two ways. "Rod": a rod starts at 20 °C with its left end held hot; watch the heat creep along (the colour is
// temperature, the curve is T against position) until the steady straight-line profile, with Q/t = kA(T1 - T2)/L.
// Material changes how quickly (thermal diffusivity). "Cooling": Newton's law, a hot body in a cool room, T falls
// exponentially; the log plot is a straight line.
import { canvas, axes, line, dot, text, title, row, slider, choice, button, readout, loop } from '../kit.js';

const MAT = { cu: ['Copper', 400, 111], al: ['Aluminium', 235, 97], st: ['Steel', 50, 14], gl: ['Glass', 1, 0.5], wd: ['Wood', 0.15, 0.13] }; // k W/mK, alpha mm²/s
const N = 40, LEN = 0.2, AREA = 1e-4, TH = 100, TC = 20;
export default function (host) {
  let mode = 'rod', mat = 'cu', end = 'cold', T = new Array(N).fill(TC), tau = 0, kc = 0.5, tc = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'Heat flowing along a rod, or a hot body cooling in a room' });
  const ctl = row(host), c2 = row(host);
  choice(ctl, 'Show', [['rod', 'Heat in a rod'], ['cool', 'Newton cooling']], mode, (v) => { mode = v; draw2(); reset(); });
  const g = row(host);
  function draw2() { c2.style.display = mode === 'rod' ? '' : 'none'; g.style.display = mode === 'cool' ? '' : 'none'; }
  choice(c2, 'Material', Object.entries(MAT).map(([k, x]) => [k, x[0]]), mat, (v) => { mat = v; reset(); });
  choice(c2, 'Far end', [['cold', 'Kept at 20 °C'], ['ins', 'Insulated']], end, (v) => { end = v; reset(); });
  slider(g, { label: 'Cooling constant k', min: 0.1, max: 2, step: 0.05, value: kc, fmt: (v) => `${v.toFixed(2)} /min`, oninput: (v) => { kc = v; reset(); } });
  const b = row(host);
  const lp = loop(host, (dt) => {
    if (mode === 'rod') {
      const a = MAT[mat][2] * 1e-6, dx = LEN / (N - 1), real = (3 * LEN * LEN) / a / 5; // whole run about 5 s feels like 3 L²/α
      let h = dt * 3 / 5; const hs = 0.4 * (1 / (N - 1)) ** 2, n = Math.ceil(h / hs), hh = h / n;
      for (let s = 0; s < n; s++) { const U = T.slice(); for (let i = 1; i < N - 1; i++) U[i] = T[i] + (hh / (1 / (N - 1)) ** 2) * (T[i - 1] - 2 * T[i] + T[i + 1]) / 1; U[0] = TH; U[N - 1] = end === 'cold' ? TC : U[N - 2]; T = U; }
      tau += h; if (tau > 6) reset();
    } else { tc += dt * 3; if (tc > 12) tc = 0; }
    cv.redraw(); show();
  });
  lp.button(b); button(b, 'Restart', () => reset());
  const out = readout(host);
  function reset() { T = new Array(N).fill(TC); T[0] = TH; tau = 0; tc = 0; cv.redraw(); show(); }
  function show() {
    if (mode === 'cool') { out.innerHTML = `T = T<sub>room</sub> + (T₀ − T<sub>room</sub>) e<sup>−kt</sup>: now t = ${tc.toFixed(1)} min, T = <b>${(TC + 70 * Math.exp(-kc * tc)).toFixed(1)} °C</b>. Half the excess is lost every ln2/k = <b>${(Math.LN2 / kc).toFixed(2)} min</b>, no matter how hot it is; that is why the log graph is a straight line.`; return; }
    const [nm, k, a] = MAT[mat], real = (tau / 3) * (3 * LEN * LEN) / (a * 1e-6) , P = (k * AREA * (TH - TC)) / LEN;
    out.innerHTML = `<b>${nm}</b>: k = ${k} W/m K, diffusivity ${a} mm²/s. Time-lapse clock: ${real < 120 ? real.toFixed(0) + ' s' : (real / 60).toFixed(1) + ' min'} of real time. ${end === 'cold' ? `Steady rate Q/t = kA(T₁−T₂)/L = ${k} × 1 cm² × 80 K / 0.2 m = <b>${P < 1 ? P.toFixed(3) : P.toFixed(1)} W</b>; gradient 400 K/m.` : 'With the far end insulated no heat leaves, so the whole rod ends up at 100 °C.'}`;
  }
  cv.draw = (ctx, w, h, col) => {
    if (mode === 'cool') {
      title(ctx, 'Newton\'s law of cooling', col);
      const A = axes(ctx, w, h * 0.62, col, { x: [0, 12], y: [20, 90], xlabel: 'time (min)', ylabel: '°C', t: 40, b: 36, l: 40, yt: [20, 40, 60, 80] });
      const pts = []; for (let t = 0; t <= 12; t += 0.2) pts.push([A.X(t), A.Y(TC + 70 * Math.exp(-kc * t))]);
      line(ctx, pts, col.s[0], 2.5); line(ctx, [[A.X(0), A.Y(TC)], [A.X(12), A.Y(TC)]], col.muted, 1, [4, 4]);
      dot(ctx, A.X(tc), A.Y(TC + 70 * Math.exp(-kc * tc)), 6, col.s[3], col.panel);
      ctx.save(); ctx.translate(0, h * 0.64); const B = axes(ctx, w, h * 0.34, col, { x: [0, 12], y: [1, 100], ylog: true, xlabel: '', ylabel: 'T − room', t: 4, b: 18, l: 40, yt: [1, 10, 100] });
      const q = []; for (let t = 0; t <= 12; t += 0.2) { const e = 70 * Math.exp(-kc * t); if (e >= 1) q.push([B.X(t), B.Y(e)]); } line(ctx, q, col.s[1], 2); ctx.restore();
      text(ctx, 'log scale: straight', w - 12, h * 0.64 + 24, { color: col.muted, size: 10, align: 'right' });
      return;
    }
    title(ctx, `${MAT[mat][0]} rod, left end at 100 °C`, col);
    const x0 = 16, rw = w - 32, ry = 36, rh = 34, dx = rw / (N - 1);
    for (let i = 0; i < N - 1; i++) { const f = (T[i] - TC) / (TH - TC); ctx.globalAlpha = 0.08 + 0.92 * Math.max(0, Math.min(1, f)); ctx.fillStyle = col.bad; ctx.fillRect(x0 + i * dx, ry, dx + 1, rh); }
    ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(x0, ry, rw, rh);
    text(ctx, 'hot 100 °C', x0, ry + rh + 12, { color: col.bad, size: 11, weight: 600 }); text(ctx, end === 'cold' ? 'cold 20 °C' : 'insulated', x0 + rw, ry + rh + 12, { color: col.muted, size: 11, weight: 600, align: 'right' });
    ctx.save(); ctx.translate(0, ry + rh + 22);
    const A = axes(ctx, w, h - ry - rh - 22, col, { x: [0, LEN * 100], y: [0, 110], xlabel: 'position along rod (cm)', ylabel: 'T (°C)', t: 6, l: 42 });
    if (end === 'cold') line(ctx, [[A.X(0), A.Y(TH)], [A.X(LEN * 100), A.Y(TC)]], col.muted, 1.5, [5, 4]);
    line(ctx, T.map((t, i) => [A.X((i / (N - 1)) * LEN * 100), A.Y(t)]), col.s[0], 2.5);
    ctx.restore();
    if (end === 'cold') text(ctx, 'dashed: steady state (straight line)', w - 12, ry + rh + 32, { color: col.muted, size: 10, align: 'right' });
  };
  draw2(); reset();
}
