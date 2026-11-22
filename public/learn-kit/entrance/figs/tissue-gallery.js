// Animal tissues: a gallery of epithelia and muscles. Pick a tissue: the sketch shows its cell shape and layers (on a
// basement membrane for epithelia), and the readout gives where it is found and what it does (NCERT Class 11).
import { canvas, text, row, choice, readout } from '../../kit.js';

const T = {
  squ: { name: 'Squamous', g: 'epi', where: 'walls of blood vessels, air sacs (alveoli) of lungs', job: 'a thin, flat layer for diffusion and filtration' },
  cub: { name: 'Cuboidal', g: 'epi', where: 'ducts of glands, tubular parts of nephrons (with microvilli in the PCT)', job: 'secretion and absorption' },
  col: { name: 'Columnar', g: 'epi', where: 'lining of the stomach and intestine (microvilli on the free surface)', job: 'secretion and absorption' },
  cil: { name: 'Ciliated', g: 'epi', where: 'bronchioles and fallopian tubes', job: 'cilia move mucus or eggs in one direction' },
  com: { name: 'Compound', g: 'epi', where: 'dry skin surface, moist lining of the mouth and pharynx, inner lining of salivary and pancreatic ducts', job: 'protection against chemical and mechanical stress; little secretion or absorption' },
  ske: { name: 'Skeletal', g: 'mus', where: 'attached to bones (e.g. biceps)', job: 'voluntary movement; fibres long, cylindrical, striated and multinucleate, bundled in parallel' },
  smo: { name: 'Smooth', g: 'mus', where: 'walls of blood vessels, stomach and intestine', job: 'involuntary contractions; fibres spindle-shaped (tapering at both ends), not striated, one nucleus' },
  car: { name: 'Cardiac', g: 'mus', where: 'heart only', job: 'involuntary, rhythmic pumping; branched, striated fibres joined by intercalated discs (gap junctions) so cells contract as a unit' },
};
export default function (host) {
  let cur = 'squ';
  const cv = canvas(host, { aspect: 0.5, max: 300, min: 210, label: 'Sketch of one animal tissue showing cell shape' });
  const ctl = row(host);
  choice(ctl, 'Epithelium', Object.entries(T).filter(([, t]) => t.g === 'epi').map(([k, t]) => [k, t.name]), cur, (v) => { cur = v; cv.redraw(); show(); });
  const ctl2 = row(host);
  choice(ctl2, 'Muscle', Object.entries(T).filter(([, t]) => t.g === 'mus').map(([k, t]) => [k, t.name]), cur, (v) => { cur = v; cv.redraw(); show(); });
  const out = readout(host);
  const show = () => { const t = T[cur]; out.innerHTML = `<b>${t.name} ${t.g === 'epi' ? 'epithelium' : 'muscle'}</b>. Found in: ${t.where}. Job: ${t.job}.`; };
  cv.draw = (ctx, w, h, col) => {
    const t = T[cur], L = 20, R = w - 20, base = h - 34;
    const cell = (x, y, cw, ch, nuc = true) => { ctx.fillStyle = col.soft; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.fillRect(x, y, cw, ch); ctx.strokeRect(x, y, cw, ch); if (nuc) { ctx.beginPath(); ctx.ellipse(x + cw / 2, y + ch / 2, Math.min(cw, ch) * 0.22, Math.min(cw, ch) * 0.18, 0, 0, 7); ctx.fillStyle = col.s[1]; ctx.fill(); } };
    if (t.g === 'epi') {
      ctx.fillStyle = col.s[3]; ctx.fillRect(L, base, R - L, 5);
      text(ctx, 'basement membrane', L, base + 18, { color: col.muted, size: 11 });
      const n = cur === 'squ' ? 6 : cur === 'cub' ? 9 : 12, cw = (R - L) / n;
      if (cur === 'com') {
        for (let r = 0; r < 5; r++) { const ch = r < 2 ? 22 : 14, k = 8 + r * 2, ww = (R - L) / k, y = base - (r < 2 ? (r + 1) * 22 : 44 + (r - 1) * 14); for (let i = 0; i < k; i++) cell(L + i * ww, y, ww, ch, r < 3); }
        text(ctx, 'many layers; only the bottom layer sits on the membrane', w / 2, 14, { color: col.ink, size: 11, align: 'center' });
        return;
      }
      const ch = cur === 'squ' ? 14 : cur === 'cub' ? cw : cw * 3;
      for (let i = 0; i < n; i++) cell(L + i * cw, base - ch, cw, ch);
      if (cur === 'cil') { ctx.strokeStyle = col.s[0]; ctx.lineWidth = 1.2; for (let x = L + 3; x < R; x += 5) { ctx.beginPath(); ctx.moveTo(x, base - ch); ctx.quadraticCurveTo(x + 4, base - ch - 8, x + 2, base - ch - 14); ctx.stroke(); } }
      text(ctx, 'one layer of cells, free surface up', w / 2, 14, { color: col.ink, size: 11, align: 'center' });
    } else {
      ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.fillStyle = col.soft;
      if (cur === 'ske') for (let r = 0; r < 3; r++) { const y = 30 + r * 46; ctx.fillRect(L, y, R - L, 36); ctx.strokeRect(L, y, R - L, 36); for (let x = L + 6; x < R; x += 8) { ctx.beginPath(); ctx.moveTo(x, y + 2); ctx.lineTo(x, y + 34); ctx.strokeStyle = col.line; ctx.stroke(); } ctx.strokeStyle = col.ink; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.ellipse(L + 40 + k * (R - L - 80) / 3, y + 4, 7, 3, 0, 0, 7); ctx.fillStyle = col.s[1]; ctx.fill(); ctx.fillStyle = col.soft; } }
      if (cur === 'smo') for (let r = 0; r < 4; r++) for (let i = 0; i < 4; i++) { const x = L + i * (R - L) / 4 + (r % 2) * 30, y = 34 + r * 36, len = (R - L) / 4 - 6; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + len / 2, y - 14, x + len, y); ctx.quadraticCurveTo(x + len / 2, y + 14, x, y); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.ink; ctx.stroke(); ctx.beginPath(); ctx.ellipse(x + len / 2, y, 8, 3, 0, 0, 7); ctx.fillStyle = col.s[1]; ctx.fill(); }
      if (cur === 'car') { for (let r = 0; r < 3; r++) { const y = 34 + r * 50; ctx.fillStyle = col.soft; ctx.fillRect(L, y, R - L, 26); ctx.strokeStyle = col.ink; ctx.strokeRect(L, y, R - L, 26); for (let x = L + 5; x < R; x += 7) { ctx.beginPath(); ctx.moveTo(x, y + 2); ctx.lineTo(x, y + 24); ctx.strokeStyle = col.line; ctx.stroke(); } for (let x = L + 70; x < R; x += 90) { ctx.fillStyle = col.s[0]; ctx.fillRect(x, y, 4, 26); ctx.beginPath(); ctx.ellipse(x - 35, y + 13, 7, 4, 0, 0, 7); ctx.fillStyle = col.s[1]; ctx.fill(); } if (r < 2) { ctx.strokeStyle = col.ink; ctx.beginPath(); ctx.moveTo(L + 130 + r * 60, y + 26); ctx.lineTo(L + 150 + r * 60, y + 50); ctx.moveTo(L + 160 + r * 60, y + 26); ctx.lineTo(L + 180 + r * 60, y + 50); ctx.stroke(); } } text(ctx, 'dark bars: intercalated discs; fibres branch and join', w / 2, 14, { color: col.ink, size: 11, align: 'center' }); }
      if (cur === 'ske') text(ctx, 'striped (striated), many nuclei at the edge', w / 2, 14, { color: col.ink, size: 11, align: 'center' });
      if (cur === 'smo') text(ctx, 'spindle-shaped, no stripes, one nucleus', w / 2, 14, { color: col.ink, size: 11, align: 'center' });
    }
  };
  cv.redraw(); show();
}
