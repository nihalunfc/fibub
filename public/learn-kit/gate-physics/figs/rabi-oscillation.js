// 4.10 Time-dependent perturbation theory. Left choice "in time": the exact two-level (Rabi) probability
// (Ω²/W²) sin²(Wt/2), W = √(Ω² + Δ²), against first-order perturbation theory, which grows without limit on
// resonance. "Line shape": probability against detuning after a fixed pulse; for a weak pulse it is the
// sin²/Δ² function whose area grows linearly with t, the heart of Fermi's golden rule.
import { canvas, axes, line, row, choice, slider, readout, fmt } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 280, label: 'Rabi oscillation in time, or transition probability against detuning' });
  let mode = 'time', D = 0, A = 0.6; // D = Δ/Ω, A = pulse area Ωt (line-shape mode)
  const ctl = row(host), srow = document.createElement('div');
  const out = readout(host);
  const P = (d, wt) => { const W = Math.sqrt(1 + d * d); return Math.sin(W * wt / 2) ** 2 / (W * W); }; // Ω = 1
  const P1 = (d, wt) => (Math.abs(d) < 1e-9 ? (wt / 2) ** 2 : Math.sin(d * wt / 2) ** 2 / (d * d));
  const build = () => {
    srow.innerHTML = '';
    if (mode === 'time') slider(srow, { label: 'detuning Δ/Ω', min: 0, max: 3, step: 0.05, value: D, fmt: (v) => fmt(v, 2), oninput: (v) => { D = v; show(); } });
    else slider(srow, { label: 'pulse area Ωt', min: 0.2, max: 3.14, step: 0.02, value: A, fmt: (v) => fmt(v, 3), oninput: (v) => { A = v; show(); } });
  };
  choice(ctl, 'Show', [['time', 'in time'], ['shape', 'line shape']], mode, (v) => { mode = v; build(); show(); });
  ctl.appendChild(srow);
  const show = () => {
    if (mode === 'time') {
      const W = Math.sqrt(1 + D * D);
      out.innerHTML = `Δ = ${fmt(D, 2)}Ω: oscillates at W = ${fmt(W, 3)}Ω with maximum Ω²/W² = <b>${fmt(1 / (W * W), 3)}</b>; a full π pulse (Ωt = π) needs Δ = 0. First order agrees only while P ≪ 1.`;
    } else {
      out.innerHTML = `Ωt = ${fmt(A, 3)}: peak ${fmt(P(0, A), 3)} (first order ${fmt(P1(0, A), 3)}). First zeros at Δt = ±2π, so the width shrinks as 1/t while the area grows as t: a constant rate once the final states form a continuum.`;
    }
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    if (mode === 'time') {
      const T = 4 * Math.PI;
      const ax = axes(ctx, w, h, col, { x: [0, T / (2 * Math.PI)], y: [0, 1.05], xlabel: 'time t (units of 2π/Ω)', ylabel: 'P(upper)' });
      ctx.save(); ax.clip();
      const ex = [], fo = [];
      for (let i = 0; i <= 500; i++) { const t = T * i / 500; ex.push([ax.X(t / (2 * Math.PI)), ax.Y(P(D, t))]); fo.push([ax.X(t / (2 * Math.PI)), ax.Y(Math.min(1.2, P1(D, t)))]); }
      line(ctx, fo, col.s[2], 1.6, [4, 4]);
      line(ctx, ex, col.s[0], 2.6);
      ctx.restore();
    } else {
      const ax = axes(ctx, w, h, col, { x: [-30 / A, 30 / A].map((v) => Math.max(-40, Math.min(40, v))), y: [0, Math.max(0.05, P1(0, A) * 1.1)], xlabel: 'detuning Δ/Ω', ylabel: 'P(upper) after the pulse', fy: (v) => fmt(v, 2) });
      ctx.save(); ax.clip();
      const lim = Math.min(40, 30 / A), ex = [], fo = [];
      for (let i = 0; i <= 800; i++) { const d = -lim + 2 * lim * i / 800; ex.push([ax.X(d), ax.Y(P(d, A))]); fo.push([ax.X(d), ax.Y(P1(d, A))]); }
      line(ctx, fo, col.s[2], 1.6, [4, 4]);
      line(ctx, ex, col.s[0], 2.6);
      ctx.restore();
    }
    ctx.font = '11px system-ui'; ctx.fillStyle = col.muted;
    ctx.fillText('solid: exact two-level · dashed: first order', 60, h - 50);
  };
  build(); show();
}
