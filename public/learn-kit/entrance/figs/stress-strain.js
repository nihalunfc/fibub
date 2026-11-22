// Elasticity: a stress-strain curve. Pull a wire step by step; up to the proportional limit the line is straight
// (Hooke's law, slope = Young's modulus), past the elastic limit it no longer returns to zero when the load is
// removed (a permanent set), and past the ultimate stress it necks and breaks. Rubber returns along a lower path
// (hysteresis): the area between the loops is heat.
import { canvas, axes, line, dot, text, row, slider, choice, readout } from '../../kit.js';

// piecewise curves: strain in %, stress in MPa
const MATS = {
  ductile: { name: 'Ductile metal', x: [0, 32], y: [0, 500], pts: [[0, 0], [2, 300], [2.8, 320], [4, 315], [10, 400], [20, 460], [26, 440], [30, 380]], P: 2, E: 2.8, U: 20, F: 30, Y: '200 GPa (steel)', lab: 'strain (not to scale)' },
  brittle: { name: 'Brittle (glass, cast iron)', x: [0, 1], y: [0, 500], pts: [[0, 0], [0.5, 350], [0.6, 410]], P: 0.5, E: 0.5, U: 0.6, F: 0.6, Y: '70 GPa (glass)', lab: 'strain (%)' },
  rubber: { name: 'Rubber', x: [0, 600], y: [0, 10], pts: [[0, 0], [50, 1], [200, 1.8], [400, 3.5], [550, 8]], P: 50, E: 550, U: 550, F: 550, Y: 'about 2 MPa', lab: 'strain (%)' },
};
const at = (pts, x) => { for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) { const [a, b] = pts[i - 1], [c, d] = pts[i]; return b + ((d - b) * (x - a)) / (c - a); } return pts[pts.length - 1][1]; };
export default function (host) {
  let key = 'ductile', frac = 0.3;
  const cv = canvas(host, { aspect: 0.66, max: 400, min: 260, label: 'A stress against strain graph with the proportional limit, elastic limit, ultimate stress and fracture marked' });
  const ctl = row(host);
  let sl;
  choice(ctl, 'Material', Object.entries(MATS).map(([k, m]) => [k, m.name]), key, (k) => { key = k; cv.redraw(); show(); });
  sl = slider(ctl, { label: 'Pull (strain)', min: 0, max: 1, step: 0.005, value: frac, fmt: (v) => `${Math.round(v * 100)}%`, oninput: (v) => { frac = v; cv.redraw(); show(); } });
  const out = readout(host);
  const now = () => { const m = MATS[key]; return Math.min(m.F, m.F * frac); };
  const show = () => {
    const m = MATS[key], x = now(), s = at(m.pts, x);
    let msg;
    if (frac >= 0.999 && key !== 'rubber') msg = '<b>Fracture.</b> The wire breaks.';
    else if (x <= m.P) msg = `In the straight part: stress ∝ strain (Hooke's law). Young's modulus = slope, ${m.Y}. Remove the load and it returns to its length.`;
    else if (x <= m.E) msg = key === 'rubber' ? 'Rubber stays elastic to huge strains, but the curve is not straight. Unloading follows a lower curve: the loop area is energy turned into heat (hysteresis).' : 'Past the proportional limit but still elastic: it returns to its length when unloaded.';
    else if (x <= m.U) msg = `Plastic region: unload now and it comes back along a line parallel to the first, leaving a permanent strain (a permanent set).`;
    else msg = 'Past the ultimate (tensile) stress: the wire narrows at one spot (necking) and breaks even under a smaller load.';
    out.innerHTML = `${key === 'ductile' ? '' : `Strain ${x.toFixed(x < 1 ? 2 : 1)}%, `}Stress ${s.toFixed(s < 10 ? 1 : 0)} MPa. ${msg}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const m = MATS[key], x = now();
    const { X, Y, clip } = axes(ctx, w, h, col, { x: m.x, y: m.y, fx: key === 'ductile' ? () => '' : undefined, xlabel: m.lab, ylabel: 'stress (MPa)', t: 26 });
    ctx.save(); clip();
    const N = 200, full = Array.from({ length: N + 1 }, (_, i) => { const xi = (m.F * i) / N; return [X(xi), Y(at(m.pts, xi))]; });
    line(ctx, full, col.line, 2);
    const done = full.filter((_, i) => (m.F * i) / N <= x); done.push([X(x), Y(at(m.pts, x))]);
    line(ctx, done, col.s[0], 3);
    const slope = m.pts[1][1] / m.pts[1][0], s = at(m.pts, x);
    if (key === 'rubber' && x > 0) { // unloading path below
      const back = Array.from({ length: 41 }, (_, i) => { const xi = (x * i) / 40; return [X(xi), Y(s * Math.pow(xi / x, 2.2))]; });
      line(ctx, back, col.s[2], 2, [6, 4]);
    } else if (x > m.E && frac < 0.999) line(ctx, [[X(x), Y(s)], [X(x - s / slope), Y(0)]], col.s[2], 2, [6, 4]);
    ctx.restore();
    const mark = (xx, lab, dy) => { const yy = at(m.pts, xx); dot(ctx, X(xx), Y(yy), 4, col.s[1]); text(ctx, lab, X(xx) + 6, Y(yy) + dy, { color: col.s[1], size: 11, weight: 600 }); };
    if (key === 'ductile') { mark(m.P, 'P: proportional limit', 12); mark(m.E, 'E: elastic limit / yield', -12); mark(m.U, 'U: ultimate stress', -12); mark(m.F, 'F: fracture', 12); }
    else if (key === 'brittle') { mark(m.P, 'elastic almost to the end', 12); mark(m.F, 'breaks suddenly', -12); }
    else mark(m.F * 0.999, 'elastic, but not linear', 12);
  };
  cv.redraw(); show();
}
