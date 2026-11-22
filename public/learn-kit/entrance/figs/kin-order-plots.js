// Integrated rate laws for zero, first and second order (one reactant, [A]0 = 1 M). Choose what to plot on the
// y-axis: only the right choice for each order gives a straight line ([A] for zero, ln[A] for first, 1/[A] for second).
import { canvas, axes, line, dot, text, row, slider, choice, readout, fmt } from '../../kit.js';

const A0 = 1;
const ORD = {
  0: { name: 'Zero', A: (k, t) => Math.max(0, A0 - k * t), half: (k) => A0 / (2 * k), unit: 'mol L⁻¹ s⁻¹', hf: 't½ = [A]₀/2k (shrinks as [A]₀ falls)' },
  1: { name: 'First', A: (k, t) => A0 * Math.exp(-k * t), half: (k) => Math.LN2 / k, unit: 's⁻¹', hf: 't½ = 0.693/k (the same every time)' },
  2: { name: 'Second', A: (k, t) => A0 / (1 + k * A0 * t), half: (k) => 1 / (k * A0), unit: 'L mol⁻¹ s⁻¹', hf: 't½ = 1/(k[A]₀) (doubles each time)' },
};
const VIEWS = { c: ['[A]', (a) => a], ln: ['ln [A]', (a) => Math.log(a)], inv: ['1/[A]', (a) => 1 / a] };
export default function (host) {
  let ord = '1', view = 'c', k = 0.1;
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 260, label: 'Concentration against time for zero, first and second order reactions' });
  const ctl = row(host);
  choice(ctl, 'Order', Object.entries(ORD).map(([o, s]) => [o, s.name]), ord, (v) => { ord = v; upd(); });
  choice(ctl, 'Plot', Object.entries(VIEWS).map(([v, s]) => [v, s[0]]), view, (v) => { view = v; upd(); });
  slider(ctl, { label: 'k', min: 0.02, max: 0.3, step: 0.01, value: k, fmt: (v) => v.toFixed(2), oninput: (v) => { k = v; upd(); } });
  const out = readout(host);
  const upd = () => { cv.redraw(); show(); };
  const straight = () => (ord === '0' && view === 'c') || (ord === '1' && view === 'ln') || (ord === '2' && view === 'inv');
  const show = () => {
    const o = ORD[ord], t1 = o.half(k);
    out.innerHTML = `${o.name} order, k = ${k.toFixed(2)} ${o.unit}. First half-life ${fmt(t1)} s; ${o.hf}. ${straight() ? '<b>Straight line</b>: this plot proves the order.' : 'Curved: try another y-axis to find the straight line.'}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const o = ORD[ord], T = 40, N = 160, f = VIEWS[view][1];
    const pts = [];
    for (let i = 0; i <= N; i++) { const t = (T * i) / N, a = o.A(k, t); if (a > 1e-3) pts.push([t, f(a)]); }
    const ys = pts.map((p) => p[1]);
    let lo = Math.min(...ys), hi = Math.max(...ys); if (hi - lo < 0.1) hi = lo + 0.1; const pad = (hi - lo) * 0.1;
    if (view === 'c') { lo = 0; hi = 1.1; }
    const { X, Y } = axes(ctx, w, h, col, { x: [0, T], y: [view === 'c' ? 0 : lo - pad, hi + (view === 'c' ? 0 : pad)], xlabel: 'time t (s)', ylabel: VIEWS[view][0], t: 28 });
    line(ctx, pts.map(([t, y]) => [X(t), Y(y)]), straight() ? col.good || col.s[0] : col.s[0], 2.5);
    // half-life marks on the [A] plot
    if (view === 'c') {
      let t = 0, a = A0;
      for (let i = 0; i < 4; i++) {
        const th = ord === '0' ? a / (2 * k) : ord === '1' ? Math.LN2 / k : 1 / (k * a);
        t += th; a /= 2; if (t > T) break;
        line(ctx, [[X(t), Y(0)], [X(t), Y(a)]], col.muted, 1, [3, 3]);
        dot(ctx, X(t), Y(a), 4, col.s[1]);
        text(ctx, `${fmt(a, 2)} M`, X(t) + 4, Y(a) - 10, { color: col.s[1], size: 10 });
      }
    }
    text(ctx, `${o.name} order: plot of ${VIEWS[view][0]}`, 10, 14, { color: col.ink, size: 12, weight: 700 });
  };
  upd();
}
