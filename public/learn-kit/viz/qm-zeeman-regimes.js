// From weak to strong field: the six levels of a p electron (l = 1, s = ½) with spin-orbit coupling ζ in a growing field.
// At small B they split by g_J m_j μ_B B (anomalous Zeeman); at large B spin-orbit loses to the field and the levels bunch
// into Paschen-Back lines m_l + 2m_s. Drag B, switch atom, and watch ²P₃/₂ and ²P₁/₂ lines bend (levels with the same m_j never cross).
import { canvas, axes, line, text, title, row, slider, choice, readout, dot } from '../kit.js';

const ATOM = { H: ['Hydrogen 2p (ζ = 0.243 cm⁻¹)', 0.2433], Na: ['Sodium 3p (ζ = 11.5 cm⁻¹)', 11.46] };
const MUB = 0.46686; // cm⁻¹ per tesla
export default function (host) {
  const cv = canvas(host, { aspect: 0.95, max: 480, min: 360, label: 'Energy levels of a p electron against magnetic field, from weak field to Paschen-Back' });
  let at = 'H', x = 0.5;
  const ctl = row(host), out = readout(host);
  choice(ctl, 'Atom', Object.keys(ATOM).map((k) => [k, ATOM[k][0]]), at, (v) => { at = v; show(); });
  slider(ctl, { label: 'Field b = μ_B B / ζ', min: 0, max: 4, step: 0.02, value: x, fmt: (v) => v.toFixed(2), oninput: (v) => { x = v; show(); } });
  // energies in units of ζ at b: returns list of {mj, E}
  const lev = (b) => {
    const e2 = (d1, d2, off) => { const m = (d1 + d2) / 2, r = Math.sqrt(((d1 - d2) / 2) ** 2 + off * off); return [m + r, m - r]; };
    const o = Math.SQRT1_2, out_ = [{ mj: 1.5, E: 0.5 + 2 * b, ml: 1, ms: 0.5 }, { mj: -1.5, E: 0.5 - 2 * b, ml: -1, ms: -0.5 }];
    e2(-0.5, b, o).forEach((E, i) => out_.push({ mj: 0.5, E, up: i === 0 }));
    e2(-0.5, -b, o).forEach((E, i) => out_.push({ mj: -0.5, E, up: i === 0 }));
    return out_;
  };
  const MJC = { '1.5': 0, '0.5': 1, '-0.5': 2, '-1.5': 3 };
  function show() {
    const ζ = ATOM[at][1], B = (x * ζ) / MUB, L = lev(x);
    out.innerHTML = `b = ${x.toFixed(2)} means B = <b>${B < 1 ? B.toFixed(2) : B.toFixed(1)} T</b> for ${at === 'H' ? 'hydrogen' : 'sodium'}. Weak-field slopes: ²P₃/₂ has g = 4/3 (m_j = ±3/2 → ±2 μ_BB, ±½ → ±⅔ μ_BB); ²P₁/₂ has g = 2/3 (±⅓ μ_BB). Strong field: E → ζ m_l m_s + μ_B B (m_l + 2m_s) with values +2, +1, 0, 0, −1, −2 in μ_BB. At b = ${x.toFixed(1)} the top line is at ${L[0].E.toFixed(2)} ζ.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Zeeman → Paschen-Back (p electron)', col);
    const a = axes(ctx, w, h, col, { x: [0, 4], y: [-8, 9], l: 40, t: 44, b: 40, xlabel: 'field b = μ_B B / ζ  (spin-orbit unit)', ylabel: 'energy (units of ζ)', xt: [0, 1, 2, 3, 4], yt: [-6, -3, 0, 3, 6] });
    const colr = [col.s[0], col.s[1], col.s[2], col.s[3]];
    const trace = (pick) => { const pts = []; for (let b = 0; b <= 4.001; b += 0.04) pts.push([a.X(b), a.Y(pick(b))]); return pts; };
    for (let k = 0; k < 6; k++) {
      const mj = [1.5, 0.5, 0.5, -0.5, -0.5, -1.5][k];
      line(ctx, trace((b) => { const L = lev(b); const same = L.filter((q) => q.mj === mj); return k === 1 ? same[0].E : k === 2 ? same[1].E : k === 3 ? L.filter((q) => q.mj === -0.5)[0].E : k === 4 ? L.filter((q) => q.mj === -0.5)[1].E : same[0].E; }), colr[MJC[String(mj)]], 2);
    }
    line(ctx, [[a.X(x), a.T], [a.X(x), a.B]], col.ink, 1.2, [4, 4]);
    lev(x).forEach((q) => dot(ctx, a.X(x), a.Y(q.E), 4, colr[MJC[String(q.mj)]]));
    [['m_j = +3/2', 0], ['+½', 1], ['−½', 2], ['−3/2', 3]].forEach(([t, i]) => { text(ctx, t, a.R - 4, a.T + 8 + i * 14, { color: colr[i], size: 10.5, weight: 700, align: 'right' }); });
    text(ctx, 'weak field', a.X(0.04), a.B - 8, { color: col.muted, size: 10 }); text(ctx, 'Paschen-Back (strong field)', a.X(2.2), a.B - 8, { color: col.muted, size: 10, align: 'center' });
    text(ctx, '²P₃/₂', a.X(0.05), a.Y(0.5) - 10, { color: col.muted, size: 10 }); text(ctx, '²P₁/₂', a.X(0.05), a.Y(-1) + 12, { color: col.muted, size: 10 });
  };
  show();
}
