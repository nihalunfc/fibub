// 2.7 The stress-strain curve. A sketch (not data for a real alloy) of a ductile metal and a brittle solid pulled to
// breaking. Move the strain slider to load the sample; let go and the unloading line shows the permanent set that
// is left once you pass the elastic limit. Regions: Hooke's law, plastic flow, necking, fracture.
import { canvas, axes, line, dot, text, row, slider, readout, fmt, title, choice } from '../../kit.js';

// ductile curve (strain in %, stress in arbitrary units up to 1): linear to 0.25%, yield, hardening to a peak, necking
const ductile = (e) => {
  if (e <= 0.25) return e / 0.25 * 0.6;             // Hooke's law, slope = Young's modulus
  if (e <= 2) return 0.6 + 0.08 * (e - 0.25) / 1.75; // yield plateau
  if (e <= 14) return 0.68 + 0.32 * Math.sin((e - 2) / 12 * Math.PI / 2); // strain hardening to the ultimate strength
  return 1 - 0.35 * ((e - 14) / 6) ** 1.6;          // necking until fracture at 20%
};
const brittle = (e) => e / 0.4 * 0.85; // straight line to fracture at 0.4%

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 400, min: 260, label: 'Stress against strain for a ductile metal and a brittle solid' });
  let kind = 'ductile', e = 0.15;
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Strain (%)', min: 0, max: 20, step: 0.05, value: e, fmt: (x) => fmt(x, 3) + '%', oninput: (x) => { e = x; cv.redraw(); show(); } });
  choice(ctl, 'Material', [['ductile', 'Ductile metal'], ['brittle', 'Brittle solid']], kind, (v) => { kind = v; if (v === 'brittle' && e > 0.4) { e = 0.3; sl.set(e); } cv.redraw(); show(); });
  const out = readout(host);
  const maxE = () => (kind === 'ductile' ? 20 : 0.4);
  const stress = (x) => (kind === 'ductile' ? ductile(x) : brittle(x));
  const set = () => (kind === 'ductile' && e > 0.25 ? e - stress(e) / 0.6 * 0.25 : 0); // permanent strain after unloading
  const show = () => {
    const broken = e >= maxE();
    let where;
    if (broken) where = 'it has <b>broken</b>';
    else if (kind === 'brittle') where = 'still elastic: it would spring back fully, and it will snap with almost no warning';
    else if (e <= 0.25) where = 'in the <b>Hooke\'s law region</b>: unload and it returns to its original length';
    else if (e <= 2) where = '<b>yielding</b>: planes of atoms start to slip past each other';
    else if (e <= 14) where = '<b>strain hardening</b>: it gets stronger as it deforms';
    else where = '<b>necking</b>: one spot thins and the load it carries falls';
    out.innerHTML = `At ${fmt(e, 3)}% strain the sample is ${where}.${!broken && set() > 0 ? ` Let go now and it keeps a permanent stretch of about <b>${fmt(set(), 3)}%</b>.` : ''}`;
  };
  cv.draw = (ctx, W, H, col) => {
    title(ctx, kind === 'ductile' ? 'Ductile metal (sketch)' : 'Brittle solid (sketch)', col);
    const xm = kind === 'ductile' ? 20 : 0.5;
    const ax = axes(ctx, W, H, col, { x: [0, xm], y: [0, 1.1], xlabel: 'strain (%)', ylabel: 'stress', t: 40, fy: () => '' });
    ctx.save(); ax.clip();
    const pts = [];
    for (let x = 0; x <= maxE(); x += maxE() / 400) pts.push([ax.X(x), ax.Y(stress(x))]);
    line(ctx, pts, col.s[0], 2.5);
    const ee = Math.min(e, maxE());
    if (set() > 0 && e < maxE()) line(ctx, [[ax.X(ee), ax.Y(stress(ee))], [ax.X(set()), ax.Y(0)]], col.s[2], 2, [6, 4]);
    ctx.restore();
    if (e < maxE()) dot(ctx, ax.X(ee), ax.Y(stress(ee)), 6, col.s[3], col.panel);
    else text(ctx, '✕ fracture', ax.X(maxE()), ax.Y(stress(maxE())) - 10, { color: col.bad || col.ink, size: 12, weight: 700, align: 'right', base: 'bottom' });
    if (kind === 'ductile') {
      text(ctx, 'elastic limit', ax.X(0.25) + 6, ax.Y(0.6) + 14, { color: col.muted, size: 10.5 });
      text(ctx, 'ultimate strength', ax.X(14), ax.Y(1) - 10, { color: col.muted, size: 10.5, align: 'center', base: 'bottom' });
      text(ctx, 'necking', ax.X(17.5), ax.Y(0.8) - 12, { color: col.muted, size: 10.5, align: 'center', base: 'bottom' });
      if (set() > 0 && e < maxE()) text(ctx, 'unloading: parallel to the Hooke line', ax.X(set()) + 6, ax.Y(0.08), { color: col.s[2], size: 10.5 });
    } else {
      text(ctx, 'straight line almost to the break', ax.X(0.05), ax.Y(0.95), { color: col.muted, size: 10.5 });
    }
  };
  cv.redraw(); show();
}
