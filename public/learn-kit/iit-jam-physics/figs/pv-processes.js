// 5.2 The four basic processes on a P–V diagram, all starting from the same state (P₀, V₀, T₀). Choose a process and
// move the end point: the shaded area is the work done by the gas, and the readout keeps the first-law books
// Q = ΔU + W in units of P₀V₀ = nRT₀.
import { canvas, axes, line, dot, row, slider, choice, readout, fmt, title, text } from '../../kit.js';

const PROC = { isothermal: 'Isothermal', adiabatic: 'Adiabatic', isobaric: 'Isobaric', isochoric: 'Isochoric' };

export default function (host) {
  const cv = canvas(host, { aspect: 0.65, max: 400, min: 260, label: 'Pressure against volume for isothermal, adiabatic, isobaric and isochoric processes from one starting point' });
  let proc = 'isothermal', g = 5 / 3, x = 2;
  const ctl = row(host);
  choice(ctl, 'Process', Object.entries(PROC), proc, (v) => { proc = v; cv.redraw(); show(); });
  choice(ctl, 'Gas', [[5 / 3, 'Monatomic γ = 5/3'], [7 / 5, 'Diatomic γ = 7/5']], g, (v) => { g = v; cv.redraw(); show(); });
  slider(ctl, { label: 'End: V/V₀ (P/P₀ if isochoric)', min: 0.4, max: 3, step: 0.05, value: x, fmt: (v) => fmt(v, 3), oninput: (v) => { x = v; cv.redraw(); show(); } });
  const out = readout(host);
  const books = () => {
    const cvr = 1 / (g - 1); // C_V / R
    if (proc === 'isothermal') { const W = Math.log(x); return { W, dU: 0, Q: W, end: [x, 1 / x] }; }
    if (proc === 'adiabatic') { const W = (1 - Math.pow(x, 1 - g)) / (g - 1); return { W, dU: -W, Q: 0, end: [x, Math.pow(x, -g)] }; }
    if (proc === 'isobaric') { const W = x - 1; return { W, dU: cvr * W, Q: (cvr + 1) * W, end: [x, 1] }; }
    const dU = cvr * (x - 1); return { W: 0, dU, Q: dU, end: [1, x] };
  };
  const show = () => {
    const b = books(), s = (v) => (Math.abs(v) < 5e-4 ? '0' : fmt(v, 3));
    const note = { isothermal: 'T is fixed, so ΔU = 0 and all the heat becomes work.', adiabatic: 'No heat: the work comes out of the internal energy, so the gas cools as it expands.', isobaric: 'The heat goes partly into work and partly into internal energy.', isochoric: 'No volume change, no work: all the heat stays as internal energy.' }[proc];
    out.innerHTML = `W = <b>${s(b.W)}</b>, ΔU = <b>${s(b.dU)}</b>, Q = ΔU + W = <b>${s(b.Q)}</b> (units of P₀V₀). ${note} Final T/T₀ = ${fmt(b.end[0] * b.end[1], 3)}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const ax = axes(ctx, w, h, col, { x: [0, 3.2], y: [0, 3.2], xlabel: 'volume V / V₀', ylabel: 'pressure P / P₀', t: 34 });
    title(ctx, `${PROC[proc]} process from (1, 1)`, col);
    ctx.save(); ax.clip();
    const curve = (fn, a, bb) => { const p = []; for (let i = 0; i <= 200; i++) { const v = a + (bb - a) * i / 200; p.push([ax.X(v), ax.Y(fn(v))]); } return p; };
    line(ctx, curve((v) => 1 / v, 0.3, 3.2), col.line, 1.5);
    line(ctx, curve((v) => Math.pow(v, -g), 0.45, 3.2), col.line, 1.5, [5, 4]);
    line(ctx, [[ax.X(0), ax.Y(1)], [ax.X(3.2), ax.Y(1)]], col.line, 1.5);
    line(ctx, [[ax.X(1), ax.Y(0)], [ax.X(1), ax.Y(3.2)]], col.line, 1.5);
    const fn = { isothermal: (v) => 1 / v, adiabatic: (v) => Math.pow(v, -g), isobaric: () => 1 }[proc];
    const b = books();
    if (fn) {
      const lo = Math.min(1, x), hi = Math.max(1, x), path = curve(fn, lo, hi);
      ctx.beginPath(); ctx.moveTo(ax.X(lo), ax.Y(0)); path.forEach(([px, py]) => ctx.lineTo(px, py)); ctx.lineTo(ax.X(hi), ax.Y(0)); ctx.closePath();
      ctx.globalAlpha = 0.18; ctx.fillStyle = x >= 1 ? col.s[0] : col.s[3]; ctx.fill(); ctx.globalAlpha = 1;
      line(ctx, path, col.s[0], 3);
      text(ctx, x >= 1 ? 'W > 0 (the area)' : 'W < 0 (compression)', ax.X((lo + hi) / 2), ax.Y(0) - 14, { color: col.ink, size: 12, weight: 600, align: 'center', halo: col.panel });
    } else {
      line(ctx, [[ax.X(1), ax.Y(1)], [ax.X(1), ax.Y(x)]], col.s[0], 3);
      text(ctx, 'W = 0: no area under a vertical line', ax.X(1) + 10, ax.Y(0) - 14, { color: col.ink, size: 12, weight: 600, halo: col.panel });
    }
    dot(ctx, ax.X(1), ax.Y(1), 5, col.ink);
    dot(ctx, ax.X(b.end[0]), ax.Y(b.end[1]), 6, col.s[0], col.panel);
    text(ctx, 'isotherm', ax.X(2.9), ax.Y(1 / 2.9) - 10, { color: col.muted, size: 11, align: 'right', halo: col.panel });
    text(ctx, 'adiabat (steeper)', ax.X(0.62) + 6, ax.Y(Math.pow(0.62, -g)), { color: col.muted, size: 11, halo: col.panel });
    ctx.restore();
  };
  cv.redraw(); show();
}
