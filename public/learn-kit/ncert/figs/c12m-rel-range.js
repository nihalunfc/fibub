// Class 12 Maths, Functions: domain, codomain and range for f(x) = x². Pick the domain and the codomain; the curve shows where outputs land.
// The range is what is actually hit; f is onto exactly when the range fills the codomain. One-one depends on the domain only.
import { canvas, text, title, row, choice, axes, line } from '../../kit.js';

const DOM = { all: ['ℝ', -3, 3, false], pos: ['[0, ∞)', 0, 3, true], mid: ['[−2, 2]', -2, 2, false] };
const COD = { r: ['ℝ', -5, 9], nn: ['[0, ∞)', 0, 9], b4: ['[0, 4]', 0, 4] };
export default function (host) {
  let dk = 'all', ck = 'r';
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'The graph of x squared with its domain on the x axis, range and codomain on the y axis' });
  cv.draw = (ctx, w, h, col) => {
    const [dn, d0, d1, oo] = DOM[dk], [cn, c0, c1] = COD[ck], top = title(ctx, `f(x) = x², domain ${dn}, codomain ${cn}`, col);
    const a = axes(ctx, w, h - 84, col, { x: [-3, 3], y: [-5, 9], l: 34, b: 22, t: top + 2, r: 30 });
    ctx.save(); a.clip(); const pts = []; for (let x = d0; x <= d1 + 1e-9; x += 0.05) pts.push([a.X(x), a.Y(x * x)]); line(ctx, pts, col.s[0], 3); ctx.restore();
    const lo = Math.min(...[d0, d1].map((v) => v * v), d0 <= 0 && d1 >= 0 ? 0 : 99), hi = Math.max(d0 * d0, d1 * d1);
    ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.35; ctx.fillRect(a.R + 4, a.Y(c1), 8, a.Y(c0) - a.Y(c1)); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[3]; ctx.lineWidth = 1.5; ctx.strokeRect(a.R + 4, a.Y(c1), 8, a.Y(c0) - a.Y(c1));
    ctx.fillStyle = col.s[0]; ctx.fillRect(a.R + 14, a.Y(Math.min(hi, 9)), 8, a.Y(lo) - a.Y(Math.min(hi, 9)));
    ctx.fillStyle = col.s[2]; ctx.fillRect(a.X(d0), a.B + 1, a.X(d1) - a.X(d0), 5);
    const onto = c0 >= lo - 1e-9 && c1 <= hi + 1e-9 || (oo && c1 === 9 && c0 >= 0), one = dk === 'pos';
    text(ctx, `range = [${+lo.toFixed(0)}, ${oo || dk === 'all' ? '∞)' : hi + ']'}`, 10, h - 66, { color: col.s[0], size: 12, weight: 700 });
    text(ctx, `${onto ? '✓ onto' : '✗ not onto'}: ${onto ? 'every codomain value is hit' : 'part of the codomain is never hit'}`, 10, h - 48, { color: onto ? col.good : col.bad, size: 12, weight: 700 });
    text(ctx, `${one ? '✓ one-one' : '✗ not one-one'} on this domain`, 10, h - 30, { color: one ? col.good : col.bad, size: 12, weight: 700 });
    text(ctx, 'blue bar: range · amber bar: codomain', 10, h - 12, { color: col.muted, size: 10.5 });
  };
  const r = row(host);
  choice(r, 'Domain', Object.entries(DOM).map(([k, v]) => [k, v[0]]), dk, (v) => { dk = v; cv.redraw(); });
  choice(r, 'Codomain', Object.entries(COD).map(([k, v]) => [k, v[0]]), ck, (v) => { ck = v; cv.redraw(); });
  cv.redraw();
}
