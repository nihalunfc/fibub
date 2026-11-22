// Current electricity: a cell of emf E and internal resistance r driving a load R. The curve shows the power in the
// load against R; it peaks when R = r (maximum power transfer), where the efficiency is only 50%.
import { canvas, axes, line, dot, row, slider, readout, text, fmt } from '../../kit.js';

export default function (host) {
  let E = 12, r = 2, R = 4;
  const cv = canvas(host, { aspect: 0.6, max: 360, min: 240, label: 'Power delivered to a load resistor against its resistance' });
  const ctl = row(host);
  slider(ctl, { label: 'emf E', min: 1.5, max: 24, step: 0.5, value: E, fmt: (v) => `${v} V`, oninput: (v) => { E = v; upd(); } });
  slider(ctl, { label: 'Internal r', min: 0.5, max: 5, step: 0.5, value: r, fmt: (v) => `${v} Ω`, oninput: (v) => { r = v; upd(); } });
  slider(ctl, { label: 'Load R', min: 0, max: 20, step: 0.25, value: R, fmt: (v) => `${v} Ω`, oninput: (v) => { R = v; upd(); } });
  const out = readout(host);
  const P = (x) => (E * E * x) / ((x + r) ** 2);
  const upd = () => {
    cv.redraw();
    const I = E / (R + r), V = I * R;
    out.innerHTML = `I = E/(R + r) = <b>${fmt(I, 3)} A</b> · terminal voltage V = E − Ir = ${fmt(V, 3)} V · power in R = <b>${fmt(I * V, 3)} W</b> · efficiency = ${R + r ? Math.round((100 * R) / (R + r)) : 0}%${Math.abs(R - r) < 0.13 ? ' · <b>R = r: maximum power</b>' : ''}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const Pmax = (E * E) / (4 * r);
    const { X, Y } = axes(ctx, w, h, col, { x: [0, 20], y: [0, Pmax * 1.2], xlabel: 'load resistance R (Ω)', ylabel: 'power in R (W)', t: 28 });
    const pts = Array.from({ length: 201 }, (_, i) => { const x = i / 10; return [X(x), Y(P(x))]; });
    line(ctx, pts, col.s[0], 2.5);
    line(ctx, [[X(r), Y(0)], [X(r), Y(Pmax)]], col.muted, 1, [4, 4]);
    text(ctx, `R = r: P max = E²/4r = ${fmt(Pmax, 3)} W`, X(r) + 6, Y(Pmax) - 10, { color: col.muted, size: 11, halo: col.panel });
    dot(ctx, X(R), Y(P(R)), 6, col.s[3], col.panel);
    text(ctx, 'Short circuit: P = 0', X(0) + 6, Y(0) - 10, { color: col.muted, size: 10, halo: col.panel });
  };
  upd();
}
