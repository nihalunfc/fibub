// Ray paths through a compound microscope and an astronomical telescope, drawn with exact paraxial rays through ideal thin
// lenses (heights are stretched). Microscope: the objective makes a big real image just inside the eyepiece's focus, the
// eyepiece magnifies it to a virtual image at 25 cm: m = (v₀/u₀)(1 + D/f_e). Telescope: the objective's image sits at its
// focus, which is also the eyepiece's focus, so the beam leaves parallel, with angular magnification M = f₀/f_e.
import { canvas, text, row, slider, choice, readout, line, arrow } from '../kit.js';

export default function (host) {
  let kind = 'mic', fo = 2, fe = 5, uo = 2.6;
  const cv = canvas(host, { aspect: 0.62, max: 340, min: 240, label: 'Ray paths through a compound microscope and an astronomical telescope' });
  const ctl = row(host), c2 = row(host);
  choice(ctl, 'Instrument', [['mic', 'Compound microscope'], ['tel', 'Astronomical telescope']], kind, (v) => { kind = v; mk(); upd(); });
  function mk() { c2.innerHTML = '';
    if (kind === 'mic') { fo = 2; fe = 5; uo = 2.6; slider(c2, { label: 'Objective f₀', min: 1, max: 3, value: fo, step: 0.1, fmt: (x) => x.toFixed(1) + ' cm', oninput: (x) => { fo = x; if (uo < fo * 1.05) uo = fo * 1.05; upd(); } }); slider(c2, { label: 'Eyepiece fₑ', min: 3, max: 8, value: fe, step: 0.5, fmt: (x) => x.toFixed(1) + ' cm', oninput: (x) => { fe = x; upd(); } }); slider(c2, { label: 'Object distance u₀', min: 1.05, max: 1.8, value: uo / fo, step: 0.01, fmt: (x) => (x * fo).toFixed(2) + ' cm', oninput: (x) => { uo = x * fo; upd(); } }); }
    else { fo = 3; fe = 10; slider(c2, { label: 'Objective f₀', min: 20, max: 60, value: 30, step: 2, fmt: (x) => x + ' cm', oninput: (x) => { fo = x / 10; upd(); } }); slider(c2, { label: 'Eyepiece fₑ', min: 5, max: 15, value: 10, step: 0.5, fmt: (x) => x.toFixed(1) + ' cm', oninput: (x) => { fe = x; upd(); } }); } }
  const out = readout(host);
  const D = 25;
  function upd() {
    if (kind === 'mic') { const vo = uo * fo / (uo - fo), ue = 1 / (1 / fe + 1 / D), m = (vo / uo) * (1 + D / fe); out.innerHTML = `Objective: object at ${uo.toFixed(2)} cm (just beyond f₀), real image at v₀ = ${vo.toFixed(1)} cm, magnification ${(vo / uo).toFixed(1)}. Eyepiece acts as a magnifying glass on that image (placed ${ue.toFixed(2)} cm from it) and gives a virtual image at 25 cm: ×${(1 + D / fe).toFixed(1)}. Total m = <b>${m.toFixed(0)}</b>. Tube length ≈ ${(vo + ue).toFixed(1)} cm.`; }
    else out.innerHTML = `Telescope: objective f₀ = ${(fo * 10).toFixed(0)} cm, eyepiece fₑ = ${fe} cm, separated by f₀ + fₑ = ${(fo * 10 + fe).toFixed(0)} cm (normal adjustment). Angular magnification M = f₀/fₑ = <b>${(fo * 10 / fe).toFixed(1)}</b>: the image is inverted and the final beam is parallel, so the eye is relaxed.`; cv.redraw(); }
  const trace = (ctx, X, Y, col, rays, lenses, x0, x1, c) => { rays.forEach(([x, y, m]) => { const pts = [[x, y]]; const sorted = lenses.filter((L) => L.x > x).sort((a, b) => a.x - b.x); let cx = x, cy = y, cm = m; for (const L of sorted) { cy += cm * (L.x - cx); cx = L.x; pts.push([cx, cy]); cm -= cy / L.f; } cy += cm * (x1 - cx); pts.push([x1, cy]); line(ctx, pts.map(([a, b]) => [X(a), Y(b)]), c, 1.5); }); };
  cv.draw = (ctx, w, h, col) => {
    const cy = h / 2;
    if (kind === 'mic') {
      const vo = uo * fo / (uo - fo), ue = 1 / (1 / fe + 1 / D), xe = vo + ue, xmin = -uo - 0.3, xmax = xe + 4, X = (x) => 10 + (x - xmin) / (xmax - xmin) * (w - 20), sc = (w - 20) / (xmax - xmin), ys = Math.min(2.2, 70 / (Math.max(0.2, uo * 0.06) * sc + 1) / 8), Y = (y) => cy - y * sc * 5;
      const lenses = [{ x: 0, f: fo }, { x: xe, f: fe }], ho = 0.12; line(ctx, [[0, cy], [w, cy]], col.line, 1);
      lenses.forEach((L, i) => { line(ctx, [[X(L.x), cy - 62], [X(L.x), cy + 62]], col.ink, 2.4); text(ctx, i ? 'eyepiece' : 'objective', X(L.x), cy + 74, { color: col.ink, size: 10.5, align: 'center' }); });
      arrow(ctx, X(-uo), cy, X(-uo), Y(ho), col.s[0], 3, 7);
      const angs = [-0.35, 0, 0.35]; const rays = angs.map((a) => [-uo, ho, (a * 0.35 + 0.0) * 1 + 0]);
      // aim three rays from the tip so they pass through the objective at heights −0.25..0.25 × (something)
      const hs = [-0.25, 0.05, 0.3]; const R = hs.map((hh) => [-uo, ho, (hh - ho) / uo]);
      trace(ctx, X, Y, col, R, lenses, -uo, xmax, col.s[5]);
      // intermediate image
      const hi = -ho * vo / uo; arrow(ctx, X(vo), cy, X(vo), Y(hi), col.s[3], 2.5, 6); text(ctx, 'I₁', X(vo), Y(hi) + 12, { color: col.s[3], size: 10.5, weight: 700, align: 'center' });
      // virtual final image: back-trace from eyepiece
      text(ctx, 'Rays spread: virtual image 25 cm to the left', 10, 16, { color: col.s[1], size: 10.5, weight: 600 });
      [[fo, 0], [-fo, 0], [xe + fe, 1], [xe - fe, 1]].forEach(([dx, i]) => { const x = i ? dx : dx; line(ctx, [[X(x), cy - 3], [X(x), cy + 3]], col.muted, 1.2); });
      text(ctx, 'ticks: focal points', 10, h - 10, { color: col.muted, size: 10 });
    } else {
      const F0 = fo * 10, xe = F0 + fe, sc = (w - 30) / (xe + 20), X = (x) => 10 + x * sc, Y = (y) => cy - y * 2.4;
      const lenses = [{ x: 0, f: F0 }, { x: xe, f: fe }]; line(ctx, [[0, cy], [w, cy]], col.line, 1);
      lenses.forEach((L, i) => { line(ctx, [[X(L.x), cy - 60], [X(L.x), cy + 60]], col.ink, 2.4); text(ctx, i ? 'eyepiece' : 'objective', X(L.x), cy + 74, { color: col.ink, size: 10.5, align: 'center' }); });
      const al = 0.07; [[0, col.s[0], 0], [al, col.s[5], al]].forEach(([a, c]) => [-18, 0, 18].forEach((hh) => { const L2 = trace(ctx, X, Y, col, [[-10, hh - a * 10 * 0, -a]], lenses, -10, xe + 20, c); }));
      line(ctx, [[X(F0), cy - 40], [X(F0), cy + 40]], col.muted, 1, [3, 3]); text(ctx, 'intermediate image at f₀', X(F0), cy - 46, { color: col.muted, size: 10, align: 'center' });
      text(ctx, `Angular magnification f₀/fₑ = ${(F0 / fe).toFixed(1)}`, 10, 16, { color: col.ink, size: 12, weight: 700 });
    }
  };
  mk(); upd();
}
