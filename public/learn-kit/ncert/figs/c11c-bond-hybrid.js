// Class 11 Chemistry, Chemical Bonding: hybridisation as mixing. Drag "mix" from 0 to 1: the s orbital and the chosen number of p orbitals (1, 2 or 3) slide to one common energy and become the same number of equal hybrid orbitals.
// The new energy is the weighted average (1 s + k p) / (1 + k). Orbitals not used stay as plain p. One electron sits in each box (carbon after promotion).
// sp: 2 hybrids, linear 180 deg (BeCl2, C2H2). sp2: 3 hybrids, 120 deg (BF3, C2H4). sp3: 4 hybrids, 109.5 deg (CH4).
import { canvas, text, title, row, slider, choice, readout, ease } from '../../kit.js';

const INFO = { 1: ['sp', 'linear, 180°', 'BeCl₂, C₂H₂ (the C of a triple bond)'], 2: ['sp²', 'trigonal planar, 120°', 'BF₃, C₂H₄ (the C of a double bond)'], 3: ['sp³', 'tetrahedral, 109.5°', 'CH₄, C₂H₆ (and N, O in NH₃, H₂O)'] };
export default function (host) {
  let k = 3, mix = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 320, label: 'Energy diagram of an s orbital and p orbitals mixing into hybrid orbitals' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'mix s with', [[1, '1 p (sp)'], [2, '2 p (sp²)'], [3, '3 p (sp³)']], k, (v) => { k = v; go(); });
  slider(ctl, { label: 'mixing', min: 0, max: 1, step: 0.01, value: mix, fmt: (v) => (v < 0.02 ? 'before' : v > 0.98 ? 'after' : (v * 100).toFixed(0) + ' %'), oninput: (v) => { mix = v; go(); } });
  const go = () => { const i = INFO[k]; ro.textContent = mix > 0.98 ? `${i[0]}: ${k + 1} equal hybrid orbitals${k < 3 ? ' + ' + (3 - k) + ' pure p' : ''}. Shape ${i[1]}. Seen in ${i[2]}.` : `Slide mixing to 100 %: one s and ${k} p orbital${k > 1 ? 's' : ''} will become ${k + 1} equal ${i[0]} hybrids.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, `Mixing s with ${k} p orbital${k > 1 ? 's' : ''} gives ${INFO[k][0]}`, col);
    const yS = h * 0.72, yP = t0 + 34, yH = (yS + k * yP) / (k + 1), m = ease(mix), bw = Math.min(50, (w - 60) / 4 - 8), gap = 8, x0 = (w - (4 * bw + 3 * gap)) / 2;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(18, t0 + 6); ctx.lineTo(18, h - 40); ctx.stroke(); text(ctx, 'energy', 22, t0 + 14, { color: col.muted, size: 10 });
    for (let i = 0; i < 4; i++) {
      const used = i <= k, y0 = i === 0 ? yS : yP, y = used ? y0 + (yH - y0) * m : y0, x = x0 + i * (bw + gap);
      ctx.strokeStyle = used && m > 0.5 ? col.s[2] : col.ink; ctx.lineWidth = 2; ctx.strokeRect(x, y - 14, bw, 28);
      const up = (cx, cy) => { ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, cy + 8); ctx.lineTo(cx, cy - 8); ctx.moveTo(cx - 4, cy - 3); ctx.lineTo(cx, cy - 8); ctx.lineTo(cx + 4, cy - 3); ctx.stroke(); };
      up(x + bw / 2, y);
      const nm = used && m > 0.5 ? INFO[k][0] : i === 0 ? '2s' : '2p';
      text(ctx, nm, x + bw / 2, y + 26, { color: used && m > 0.5 ? col.s[2] : col.muted, size: 11, weight: 700, align: 'center' });
    }
    text(ctx, 'average', 24, yH - 9, { color: col.muted, size: 10 });
    ctx.setLineDash([3, 4]); ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(x0 - 6, yH); ctx.lineTo(x0 + 4 * bw + 3 * gap + 6, yH); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, mix > 0.98 ? `${k + 1} hybrids + ${3 - k} p left over (used for π bonds)`.replace(' + 0 p left over (used for π bonds)', ', no p left') : 'before mixing: s is lower than p', w / 2, h - 16, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
  };
  go();
}
