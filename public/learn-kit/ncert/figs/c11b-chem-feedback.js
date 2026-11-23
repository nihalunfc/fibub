// Class 11 Biology, Chemical coordination: negative feedback in the thyroid axis. The hypothalamus (TRH) tells the pituitary to release TSH; TSH makes the thyroid release thyroxine (T4);
// T4 in the blood tells the pituitary to make less TSH. Little iodine means little T4, so TSH stays high and the thyroid swells (goitre). With feedback off the loop cannot correct itself.
import { canvas, text, title, line, row, slider, choice, readout, loop, arrow } from '../../kit.js';

export default function (host) {
  let iod = 0.7, fb = true, tsh = 0.5, t4 = 0.5;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'The thyroid feedback loop with TSH, thyroxine and gland size changing with iodine in the diet and the feedback switched on or off' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'Iodine in diet', min: 0.05, max: 1, step: 0.01, value: iod, fmt: (v) => (v < 0.3 ? 'low' : v < 0.6 ? 'some' : 'plenty'), oninput: (v) => { iod = v; } });
  choice(ctl, 'Feedback', [[true, 'On'], [false, 'Off']], fb, (v) => { fb = v; });
  loop(host, (dt) => { const target = fb ? Math.min(1, Math.max(0, 1.2 - t4)) : 0.6; tsh += (target - tsh) * dt * 1.5; t4 += (Math.min(1, 2 * iod * tsh) - t4) * dt * 1.5; go(); });
  const go = () => { ro.textContent = `T4 ${(t4 * 100).toFixed(0)} %, TSH ${(tsh * 100).toFixed(0)} %. ` + (fb ? (iod < 0.3 ? 'Low iodine: not enough T4 can be made, so TSH stays high and the thyroid swells: simple goitre.' : 'Feedback holds T4 near normal: if it rises, TSH falls; if it falls, TSH rises.') : 'No feedback: TSH is stuck, so T4 just follows the iodine supply and nothing corrects it.'); cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Thyroid feedback loop', col), bx = 24, bw = w - 48, bh = 34, y = [t0 + 8, t0 + 62, t0 + 116];
    [['Hypothalamus: TRH', col.s[0]], ['Pituitary: TSH', col.s[2]], ['Thyroid: T4 and T3', col.s[3]]].forEach(([n, c], i) => { ctx.fillStyle = c; ctx.globalAlpha = 0.85; ctx.fillRect(bx, y[i], bw * 0.62, bh); ctx.globalAlpha = 1; text(ctx, n, bx + 8, y[i] + bh / 2, { color: col.bg, size: 11, weight: 700 }); });
    arrow(ctx, bx + bw * 0.31, y[0] + bh, bx + bw * 0.31, y[1], col.ink, 2, 6); arrow(ctx, bx + bw * 0.31, y[1] + bh, bx + bw * 0.31, y[2], col.ink, 2, 6);
    // thyroid gland size
    const sz = 14 + 20 * tsh; ctx.beginPath(); ctx.ellipse(bx + bw * 0.82, y[2] + bh / 2, sz, sz * 0.7, 0, 0, 7); ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.6; ctx.fill(); ctx.globalAlpha = 1; text(ctx, tsh > 0.85 && fb ? 'goitre' : 'thyroid', bx + bw * 0.82, y[2] + bh / 2 + sz * 0.7 + 12, { color: col.muted, size: 10, align: 'center' });
    // feedback arrow
    line(ctx, [[bx + bw * 0.62, y[2] + bh / 2], [bx + bw * 0.66, y[2] + bh / 2], [bx + bw * 0.66, y[1] + bh / 2], [bx + bw * 0.62, y[1] + bh / 2]], fb ? col.s[3] : col.line, 2.5, fb ? undefined : [4, 4]); text(ctx, fb ? '− feedback' : 'broken', bx + bw * 0.67, y[1] + bh + 8, { color: fb ? col.s[3] : col.muted, size: 10, weight: 700 });
    // level bars
    const by = y[2] + bh + 34;
    [['TSH', tsh, col.s[2]], ['T4', t4, col.s[3]]].forEach(([n, v, c], i) => { const yy = by + i * 32; text(ctx, n, bx, yy + 9, { color: col.ink, size: 11, weight: 700 }); ctx.fillStyle = col.line; ctx.fillRect(bx + 36, yy, bw - 36, 18); ctx.fillStyle = c; ctx.fillRect(bx + 36, yy, (bw - 36) * v, 18); });
  };
  go();
}
