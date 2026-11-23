// Class 8 Light: refraction at a boundary. Light slows down in a denser medium and bends towards the normal; going out into air it
// bends away. Snell's law (not needed in Class 8, used here only to place the ray): sin i / sin r = n, with n = 1.33 for water and
// 1.5 for glass. From glass into air, beyond the critical angle (about 42 degrees) all light reflects back: total internal reflection.
import { canvas, text, title, line, arrow, row, slider, choice, readout } from '../../kit.js';

const MED = { water: ['air', 'water', 1.33], glass: ['air', 'glass', 1.5], out: ['glass', 'air', 1 / 1.5] };
export default function (host) {
  let ang = 40, m = 'glass';
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 280, label: 'A ray of light bending at the boundary between air and glass or water' });
  const ctl = row(host);
  choice(ctl, 'Ray goes', [['water', 'Air → water'], ['glass', 'Air → glass'], ['out', 'Glass → air']], m, (v) => { m = v; say(); });
  slider(ctl, { label: 'Angle of incidence', min: 5, max: 80, step: 1, value: ang, fmt: (v) => `${v}°`, oninput: (v) => { ang = v; say(); } });
  const out = readout(host);
  const calc = () => { const n = MED[m][2], s = Math.sin(ang * Math.PI / 180) / n; return s > 1 ? null : Math.asin(s) * 180 / Math.PI; };
  const say = () => { const r = calc(); out.innerHTML = r === null ? `<b>Total internal reflection:</b> at ${ang}° the ray cannot get out of the glass, so all of it reflects back inside. This is how optical fibres and diamonds sparkle.` : `Angle of incidence <b>${ang}°</b>, angle of refraction <b>${r.toFixed(0)}°</b>: the ray bends <b>${r < ang ? 'towards' : 'away from'}</b> the normal${m === 'out' ? ' as it leaves the denser glass' : ' because the second medium is denser'}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Refraction: light changes direction', col);
    const [a, b] = MED[m], cx = w / 2, cy = h * 0.52, L = Math.min(w * 0.4, h * 0.42), i = ang * Math.PI / 180, r = calc();
    ctx.fillStyle = col.soft; ctx.fillRect(0, cy, w, h - cy); text(ctx, a, 12, cy - 32, { color: col.muted, size: 11, weight: 700 }); text(ctx, b, 12, cy + 18, { color: col.muted, size: 11, weight: 700 });
    line(ctx, [[0, cy], [w, cy]], col.ink, 2); line(ctx, [[cx, cy - L * 1.05], [cx, cy + L * 1.05]], col.muted, 1.2, [5, 4]);
    arrow(ctx, cx - L * Math.sin(i), cy - L * Math.cos(i), cx - 1, cy - 1, col.s[1], 3, 10);
    if (r === null) arrow(ctx, cx + 1, cy - 1, cx + L * Math.sin(i), cy - L * Math.cos(i), col.s[2], 3, 10);
    else { const q = r * Math.PI / 180; arrow(ctx, cx + 1, cy + 1, cx + L * Math.sin(q), cy + L * Math.cos(q), col.s[2], 3, 10); if (a === 'glass' || true) arrow(ctx, cx + 1, cy - 1, cx + L * 0.45 * Math.sin(i), cy - L * 0.45 * Math.cos(i), col.s[3], 1.5, 6); }
    text(ctx, 'normal', cx + 6, cy - L * 1.02, { color: col.muted, size: 10.5 });
    text(ctx, 'i', cx - 28, cy - 34, { color: col.s[1], size: 12, weight: 700, align: 'center' }); text(ctx, r === null ? 'reflected' : 'r', cx + 32, r === null ? cy - 34 : cy + 40, { color: col.s[2], size: 12, weight: 700, align: 'center' });
  };
  say();
}
