// Class 11 Biology, Biological Classification: bacteria by shape (coccus, bacillus, vibrio, spirillum) and the Gram stain. Gram-positive bacteria have a thick peptidoglycan wall that keeps the violet dye;
// Gram-negative bacteria have a thin wall under an outer membrane, lose the violet in the alcohol wash and take up the pink counterstain. Pick a shape and a Gram result.
import { canvas, text, title, row, choice, loop } from '../../kit.js';
import { rr, ell, note } from '../c11b-lib.js';

export default function (host) {
  let shape = 'bacillus', gram = 'pos', t = 0;
  const cv = canvas(host, { aspect: 1, max: 440, min: 300, label: 'Bacterial shapes and the Gram stain with the cell wall layers' });
  const ctl = row(host);
  choice(ctl, 'Shape', [['coccus', 'Coccus (sphere)'], ['bacillus', 'Bacillus (rod)'], ['vibrio', 'Vibrio (comma)'], ['spirillum', 'Spirillum (spiral)']], shape, (v) => { shape = v; cv.redraw(); });
  choice(ctl, 'Gram stain', [['pos', 'Gram-positive'], ['neg', 'Gram-negative']], gram, (v) => { gram = v; cv.redraw(); });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const y0 = title(ctx, `${gram === 'pos' ? 'Gram-positive (keeps the violet dye)' : 'Gram-negative (takes the pink stain)'}: ${shape}`, col), c = gram === 'pos' ? col.s[0] : col.s[3];
    rr(ctx, 10, y0 + 6, w - 20, 120, 10, col.soft, col.line);
    for (let k = 0; k < 6; k++) {
      const x = 40 + (k % 3) * ((w - 80) / 2.4) + 20 * Math.sin(t * 0.8 + k), y = y0 + 40 + Math.floor(k / 3) * 52 + 6 * Math.cos(t * 0.9 + k * 2), a = Math.sin(t * 0.5 + k) * 0.5;
      ctx.save(); ctx.translate(x, y); ctx.rotate(a);
      if (shape === 'coccus') ell(ctx, 0, 0, 9, 9, c, col.ink, 1, 0.8);
      else if (shape === 'bacillus') { ctx.fillStyle = c; ctx.globalAlpha = 0.8; ctx.beginPath(); ctx.roundRect(-16, -6, 32, 12, 6); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.stroke(); }
      else if (shape === 'vibrio') { ctx.strokeStyle = c; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, 8, 14, Math.PI * 1.2, Math.PI * 1.85); ctx.stroke(); }
      else { ctx.strokeStyle = c; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); for (let u = -18; u <= 18; u += 2) { const yy = 6 * Math.sin(u * 0.5 + t * 4); u === -18 ? ctx.moveTo(u, yy) : ctx.lineTo(u, yy); } ctx.stroke(); }
      ctx.restore();
    }
    // cell envelope
    const ey = y0 + 150, ew = w - 80;
    text(ctx, 'Cell envelope (zoomed)', w / 2, ey - 8, { color: col.muted, size: 11, weight: 700, align: 'center' });
    const layers = gram === 'pos' ? [['thick peptidoglycan wall', 44, c], ['plasma membrane', 16, col.s[4]]] : [['outer membrane', 16, col.s[2]], ['thin peptidoglycan wall', 16, c], ['plasma membrane', 16, col.s[4]]];
    let yy = ey + 6;
    layers.forEach(([nm, th, cc]) => { ctx.fillStyle = cc; ctx.globalAlpha = 0.85; ctx.fillRect(30, yy, ew, th); ctx.globalAlpha = 1; text(ctx, nm, w / 2, yy + th / 2, { color: th > 20 ? col.panel : col.ink, size: 10.5, weight: 700, align: 'center' }); yy += th + 3; });
    note(ctx, gram === 'pos' ? 'The thick wall traps the violet dye after the alcohol wash.' : 'The thin wall cannot hold the violet; the pink counterstain shows instead.', 12, h - 40, w - 24, col, { size: 11 });
  };
}
