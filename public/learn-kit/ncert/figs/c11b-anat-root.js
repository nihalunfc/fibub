// Class 11 Anatomy: transverse section of a root. The xylem forms a star whose arms alternate with phloem patches (radial bundles). Dicot roots have 2 to 4 xylem arms
// (di-, tri-, tetrarch) and a small or no pith; monocot roots have more than 6 (polyarch) and a large pith. Slide the number of arms.
import { canvas, text, title, row, slider, button, readout } from '../../kit.js';
import { ellipse, footer } from '../c11b-ex-util.js';

export default function (host) {
  let n = 4;
  const NAME = { 2: 'diarch', 3: 'triarch', 4: 'tetrarch', 5: 'pentarch', 6: 'hexarch', 7: 'polyarch', 8: 'polyarch', 9: 'polyarch', 10: 'polyarch', 11: 'polyarch', 12: 'polyarch' };
  const cv = canvas(host, { aspect: 1.05, max: 440, min: 300, label: 'Cross-section of a root showing a star-shaped xylem with a chosen number of arms alternating with phloem' });
  const ctl = row(host), ro = readout(host);
  button(ctl, 'Dicot root (4)', () => { sl.set(4); n = 4; go(); }); button(ctl, 'Monocot root (8)', () => { sl.set(8); n = 8; go(); });
  const sl = slider(ctl, { label: 'Xylem arms', min: 2, max: 12, step: 1, value: n, fmt: (v) => String(Math.round(v)), oninput: (v) => { n = Math.round(v); go(); } });
  const go = () => { ro.textContent = `${n} xylem arms and ${n} phloem patches alternate: the root is ${NAME[n]}. ${n <= 4 ? 'This is the dicot pattern (2 to 4 arms), with only a small pith.' : n <= 6 ? 'Between the two patterns.' : 'More than 6 arms (polyarch) with a large pith: the monocot pattern.'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, `Root cross-section: ${NAME[n]}`, col);
    const fy = footer(ctx, w, h, col, 'Epidermis with root hairs, cortex, endodermis (Casparian strip), pericycle, then the stele. Lateral roots arise from the pericycle.');
    const cx = w / 2, cy = (t0 + fy) / 2 + 2, R = Math.min(w / 2 - 14, (fy - t0) / 2 - 6);
    ellipse(ctx, cx, cy, R, R, col.soft, col.ink, 2);
    for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2; ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); ctx.lineTo(cx + Math.cos(a) * (R + 9), cy + Math.sin(a) * (R + 9)); ctx.stroke(); }
    ellipse(ctx, cx, cy, R * 0.58, R * 0.58, col.panel, col.s[4], 3);      // endodermis
    ellipse(ctx, cx, cy, R * 0.5, R * 0.5, null, col.s[2], 1.2);           // pericycle
    const pith = n <= 4 ? 0.1 : n <= 6 ? 0.25 : 0.36;
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2 - Math.PI / 2, b = a + Math.PI / n;
      const rr = R * 0.46, w2 = 0.55 * Math.PI / n;
      ctx.save(); ctx.fillStyle = col.s[0]; ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a - w2 * 0.25) * R * (pith + 0.02), cy + Math.sin(a - w2 * 0.25) * R * (pith + 0.02));
      ctx.lineTo(cx + Math.cos(a - w2) * rr, cy + Math.sin(a - w2) * rr); ctx.lineTo(cx + Math.cos(a + w2) * rr, cy + Math.sin(a + w2) * rr);
      ctx.lineTo(cx + Math.cos(a + w2 * 0.25) * R * (pith + 0.02), cy + Math.sin(a + w2 * 0.25) * R * (pith + 0.02)); ctx.closePath(); ctx.fill(); ctx.restore();
      ellipse(ctx, cx + Math.cos(b) * R * 0.4, cy + Math.sin(b) * R * 0.4, Math.max(4, R * 0.55 / n + 1), Math.max(4, R * 0.55 / n + 1), col.s[2], col.ink, 0.8);
    }
    ellipse(ctx, cx, cy, R * pith, R * pith, col.panel, col.line, 1);
    text(ctx, 'pith', cx, cy, { color: col.muted, size: pith > 0.2 ? 10.5 : 8, align: 'center', fit: false });
    const lx = 12, ly = t0 + 8; [[col.s[2], 'phloem'], [col.s[0], 'xylem'], [col.s[4], 'endodermis']].forEach(([c, s], i) => { ctx.fillStyle = c; ctx.fillRect(lx, ly + i * 15, 9, 9); text(ctx, s, lx + 13, ly + 5 + i * 15, { color: col.ink, size: 10 }); });
  };
  go();
}
