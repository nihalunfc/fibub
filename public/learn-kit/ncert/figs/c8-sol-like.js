// Class 8 Solutions: "like dissolves like". Water is a polar solvent: it dissolves salt, sugar and other substances with charged
// or polar particles. Oils and wax are non-polar: they dissolve in non-polar solvents such as kerosene or petrol, not in water.
// Choose a solute and a solvent and see whether the particles mix (mix) or stay apart.
import { canvas, text, title, dot, row, choice, readout, loop, rng } from '../../kit.js';

const OK = { 'salt|water': 1, 'sugar|water': 1, 'oil|water': 0, 'wax|water': 0, 'salt|kero': 0, 'sugar|kero': 0, 'oil|kero': 1, 'wax|kero': 1 };
const NAME = { salt: 'common salt', sugar: 'sugar', oil: 'cooking oil', wax: 'candle wax', water: 'water', kero: 'kerosene' };
export default function (host) {
  let a = 'salt', b = 'water', t = 0, mix = 0;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 270, label: 'Whether a chosen solute dissolves in water or in kerosene' });
  const ctl = row(host);
  choice(ctl, 'Solute', [['salt', 'Salt'], ['sugar', 'Sugar'], ['oil', 'Oil'], ['wax', 'Wax']], a, (v) => { a = v; mix = 0; say(); });
  choice(ctl, 'Solvent', [['water', 'Water'], ['kero', 'Kerosene']], b, (v) => { b = v; mix = 0; say(); });
  const out = readout(host);
  const R = rng(8), P = []; for (let i = 0; i < 36; i++) P.push([R(), R(), R() * 6.3, R() * 6.3]);
  loop(host, (dt) => { t += dt; const want = OK[a + '|' + b] ? 1 : 0; mix += (want - mix) * Math.min(1, dt * 0.8); cv.redraw(); });
  function say() { const y = OK[a + '|' + b]; out.innerHTML = `<b>${NAME[a][0].toUpperCase() + NAME[a].slice(1)} in ${NAME[b]}: ${y ? 'dissolves' : 'does not dissolve'}.</b> ${b === 'water' ? 'Water is a polar solvent: it likes salt, sugar and similar substances.' : 'Kerosene is a non-polar solvent: it likes oils and wax.'} ${y ? '' : 'The particles prefer their own kind, so they clump together and stay apart.'}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `${NAME[a]} in ${NAME[b]}`, col);
    const bx = w * 0.15, bw = w * 0.7, by = 44, bh = h - 66, ty = by + 14;
    ctx.fillStyle = b === 'water' ? col.soft : col.line; ctx.fillRect(bx, ty, bw, bh - 14);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by); ctx.stroke();
    P.forEach((p, i) => {
      const hx = bx + 10 + (bw - 20) * p[0], hy = ty + 10 + (bh - 34) * p[1];
      const cx = bx + bw / 2 + 16 * Math.cos(i), cy = ty + 26 + 16 * Math.sin(i * 1.7) + (b === 'kero' && a !== 'oil' && a !== 'wax' ? bh - 70 : 0);
      const x = cx + (hx - cx) * mix + 3 * Math.sin(p[2] + t * 1.3), y = cy + (hy - cy) * mix + 3 * Math.sin(p[3] + t * 1.1);
      dot(ctx, x, y, 3.6, col.s[a === 'oil' || a === 'wax' ? 3 : 1]);
    });
    text(ctx, OK[a + '|' + b] ? 'mixed evenly' : 'stay apart', bx + bw / 2, by + bh - 10, { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.soft });
  };
  say();
}
