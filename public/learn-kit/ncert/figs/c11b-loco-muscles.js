// Class 11 Biology, Locomotion: the three kinds of muscle compared. Skeletal muscle: long striped multinucleate fibres, voluntary, fastest. Smooth muscle: spindle cells with one nucleus, no stripes, involuntary.
// Cardiac muscle: striped, branched cells joined by intercalated discs, involuntary, never tires.
import { canvas, text, title, line, row, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let k = 'skeletal', t = 0;
  const D = { skeletal: ['Skeletal muscle', 'attached to bones (biceps, thigh)', 'striated: yes · nuclei: many per fibre · control: voluntary · speed: fast, tires'], smooth: ['Smooth muscle', 'walls of gut, blood vessels, bladder, uterus', 'striated: no · nucleus: one per spindle cell · control: involuntary · speed: slow, steady'], cardiac: ['Cardiac muscle', 'wall of the heart only', 'striated: yes · nucleus: one or two per cell · control: involuntary · speed: rhythmic, never tires'] };
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 290, label: 'A drawing of skeletal, smooth or cardiac muscle cells with their nuclei and features' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Muscle', [['skeletal', 'Skeletal'], ['smooth', 'Smooth'], ['cardiac', 'Cardiac']], k, (v) => { k = v; go(); });
  const anim = loop(host, (dt, tt) => { t = tt; cv.redraw(); }); anim.button(ctl);
  const go = () => { ro.textContent = `${D[k][0]}: ${D[k][1]}. ${D[k][2]}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, D[k][0], col), sq = 1 + 0.06 * Math.sin(t * 3), cy = t0 + (h - t0) * 0.45;
    const nuc = (x, y) => { ctx.beginPath(); ctx.ellipse(x, y, 7, 4, 0, 0, 7); ctx.fillStyle = col.ink; ctx.fill(); };
    if (k === 'skeletal') { for (let r = 0; r < 3; r++) { const y = cy - 40 + r * 40; ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.55; ctx.fillRect(20, y - 13, w - 40, 26); ctx.globalAlpha = 1; for (let x = 28; x < w - 30; x += 12 * sq) line(ctx, [[x, y - 13], [x, y + 13]], col.bg, 2); [60, 140, 220, 300].forEach((x, i) => x < w - 40 && nuc(x + r * 17, y - 9 + (i % 2) * 18)); } text(ctx, 'stripes (striations) · many nuclei at the edge', w / 2, cy + 82, { color: col.muted, size: 10.5, align: 'center' }); }
    if (k === 'smooth') { for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) { const x = 40 + c * ((w - 80) / 2.4) + r * 22, y = cy - 44 + r * 40, L = 80 * (1 + 0.06 * Math.sin(t * 2)), x0 = x - L / 2; ctx.beginPath(); ctx.moveTo(x0, y); ctx.quadraticCurveTo(x, y - 14, x + L / 2, y); ctx.quadraticCurveTo(x, y + 14, x0, y); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.6; ctx.fill(); ctx.globalAlpha = 1; nuc(x, y); } text(ctx, 'spindle cells · no stripes · one nucleus each', w / 2, cy + 82, { color: col.muted, size: 10.5, align: 'center' }); }
    if (k === 'cardiac') { const xs = [24, w * 0.36, w * 0.66]; for (let r = 0; r < 3; r++) { const y = cy - 40 + r * 40; xs.forEach((x, i) => { const x1 = i < 2 ? xs[i + 1] - 6 : w - 24; ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.55; ctx.fillRect(x, y - 13, x1 - x, 26); ctx.globalAlpha = 1; for (let xx = x + 6; xx < x1; xx += 12 * sq) line(ctx, [[xx, y - 13], [xx, y + 13]], col.bg, 2); nuc((x + x1) / 2, y); if (i < 2) line(ctx, [[x1 + 3, y - 15], [x1 + 3, y + 15]], col.ink, 4); if (r < 2 && i === 1) line(ctx, [[x + 30, y + 13], [x + 40, y + 27]], col.s[2], 6); }); } text(ctx, 'stripes · cells joined by dark intercalated discs', w / 2, cy + 82, { color: col.muted, size: 10.5, align: 'center' }); }
  };
  go();
}
