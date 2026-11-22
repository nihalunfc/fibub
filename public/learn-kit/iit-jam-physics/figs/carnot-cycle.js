// 5.3 The Carnot cycle for a monatomic ideal gas (nR = 1, V₁ = 1, isothermal expansion ratio 2.5). Switch between
// the P–V view (log axes: isotherms have slope −1, adiabats slope −γ) and the T–S view (a rectangle). A dot runs
// round the cycle; the readout gives the heats, the work and the efficiency 1 − T_c/T_h.
import { canvas, axes, line, dot, row, slider, choice, readout, fmt, title, text, loop } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.65, max: 400, min: 260, label: 'Carnot cycle drawn on pressure-volume and temperature-entropy diagrams' });
  let Th = 600, Tc = 300, view = 'pv', ph = 0;
  const g = 5 / 3, ratio = 2.5;
  const ctl = row(host);
  choice(ctl, 'View', [['pv', 'P–V'], ['ts', 'T–S']], view, (v) => { view = v; cv.redraw(); });
  const sTc = slider(ctl, { label: 'Cold T_c', min: 150, max: 550, step: 10, value: Tc, fmt: (v) => fmt(v, 4) + ' K', oninput: (v) => { Tc = Math.min(v, Th - 50); cv.redraw(); show(); } });
  slider(ctl, { label: 'Hot T_h', min: 350, max: 1000, step: 10, value: Th, fmt: (v) => fmt(v, 4) + ' K', oninput: (v) => { Th = v; if (Tc > Th - 50) { Tc = Th - 50; sTc.set(Tc); } cv.redraw(); show(); } });
  const anim = loop(host, (dt) => { ph = (ph + dt * 0.12) % 1; cv.redraw(); });
  anim.button(ctl);
  const out = readout(host);
  const corners = () => {
    const k = Math.pow(Th / Tc, 1 / (g - 1));
    return [[1, Th], [ratio, Th], [ratio * k, Tc], [k, Tc]]; // [V, T] at states 1..4
  };
  const show = () => {
    const Qh = Th * Math.log(ratio), Qc = Tc * Math.log(ratio);
    out.innerHTML = `Q<sub>h</sub> = T<sub>h</sub>ΔS = <b>${fmt(Qh, 3)}</b>, Q<sub>c</sub> = T<sub>c</sub>ΔS = <b>${fmt(Qc, 3)}</b>, W = Q<sub>h</sub> − Q<sub>c</sub> = <b>${fmt(Qh - Qc, 3)}</b> (in units of nR × 1 K). Efficiency 1 − T<sub>c</sub>/T<sub>h</sub> = <b>${fmt(100 * (1 - Tc / Th), 3)}%</b>. The entropy taken in at T<sub>h</sub> equals the entropy given out at T<sub>c</sub>.`;
  };
  // the point on the cycle at phase t in [0, 1): four legs of equal time
  const at = (t) => {
    const c = corners(), leg = Math.min(3, Math.floor(t * 4)), s = t * 4 - leg, [V0, T0] = c[leg], [V1] = c[(leg + 1) % 4];
    const V = V0 * Math.pow(V1 / V0, s);
    const T = leg % 2 === 0 ? T0 : T0 * Math.pow(V0 / V, g - 1);
    return [V, T];
  };
  cv.draw = (ctx, w, h, col) => {
    const c = corners();
    const S = (V, T) => Math.log(V / c[0][0]) + Math.log(T / Th) / (g - 1); // S/nR measured from state 1
    const colours = [col.s[3], col.s[0], col.s[2], col.s[0]];
    const N = 60;
    if (view === 'pv') {
      const Vmax = c[2][0] * 1.4, Pmax = Th * 1.6, Pmin = (Tc / c[2][0]) * 0.6;
      const ax = axes(ctx, w, h, col, { x: [0.7, Vmax], y: [Pmin, Pmax], xlog: true, ylog: true, xlabel: 'volume V (log scale)', ylabel: 'P (log scale)', t: 34 });
      title(ctx, 'Carnot cycle on log P against log V', col);
      ctx.save(); ax.clip();
      for (let i = 0; i < 4; i++) { const pts = []; for (let j = 0; j <= N; j++) { const [V, T] = at(Math.min((i + j / N) / 4, 0.999999)); pts.push([ax.X(V), ax.Y(T / V)]); } if (i === 3) pts.push([ax.X(c[0][0]), ax.Y(c[0][1] / c[0][0])]); line(ctx, pts, colours[i], 3); }
      const [V, T] = at(ph); dot(ctx, ax.X(V), ax.Y(T / V), 6, col.ink, col.panel);
      c.forEach(([V0, T0], i) => text(ctx, String(i + 1), ax.X(V0) + 8, ax.Y(T0 / V0) - 9, { color: col.ink, size: 12, weight: 700, halo: col.panel }));
      text(ctx, 'heat in at T_h (1→2)', ax.X(Math.sqrt(ratio)), ax.Y(Th / Math.sqrt(ratio)) - 16, { color: col.s[3], size: 11, weight: 600, align: 'center', halo: col.panel });
      ctx.restore();
    } else {
      const Smax = Math.log(ratio);
      const ax = axes(ctx, w, h, col, { x: [-0.3, Smax + 0.3], y: [0, 1100], xlabel: 'entropy S/nR (from state 1)', ylabel: 'T (K)', t: 34 });
      title(ctx, 'Carnot cycle on T against S: a rectangle', col);
      ctx.save(); ax.clip();
      ctx.globalAlpha = 0.15; ctx.fillStyle = col.s[3]; ctx.fillRect(ax.X(0), ax.Y(Th), ax.X(Smax) - ax.X(0), ax.Y(Tc) - ax.Y(Th)); ctx.globalAlpha = 1;
      for (let i = 0; i < 4; i++) { const a = c[i], b = c[(i + 1) % 4]; line(ctx, [[ax.X(S(a[0], a[1])), ax.Y(a[1])], [ax.X(S(b[0], b[1])), ax.Y(b[1])]], colours[i], 3); }
      text(ctx, 'area = W', ax.X(Smax / 2), ax.Y((Th + Tc) / 2), { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel });
      text(ctx, 'area under the top line = Q_h', ax.X(Smax / 2), ax.Y(Tc / 2), { color: col.muted, size: 11, align: 'center', halo: col.panel });
      const [V, T] = at(ph); dot(ctx, ax.X(S(V, T)), ax.Y(T), 6, col.ink, col.panel);
      ctx.restore();
    }
  };
  cv.redraw(); show();
}
