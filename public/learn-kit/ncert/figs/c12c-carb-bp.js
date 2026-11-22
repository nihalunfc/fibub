// Class 12 Chemistry, Aldehydes, Ketones and Carboxylic Acids: boiling points of compounds with almost the same molar mass (58 to 60 g/mol) and what holds their molecules together.
// Alkane: weak London forces only. Ether: weak dipole attraction. Aldehyde and ketone: strong dipole-dipole (C=O is polar). Alcohol: hydrogen bonds. Carboxylic acid: two hydrogen bonds per pair, a dimer.
// Boiling points in deg C (CRC Handbook): butane -0.5, methoxyethane 7.4, propanal 48, propanone 56, propan-1-ol 97, ethanoic acid 118.
import { canvas, text, title, row, choice, readout, loop } from '../../kit.js';

const D = [['butane', 'CH₃CH₂CH₂CH₃', -0.5, 'weak London forces only', 0], ['methoxyethane', 'CH₃OCH₂CH₃', 7.4, 'weak dipole attraction, no O–H', 1], ['propanal', 'CH₃CH₂CHO', 48, 'dipole–dipole: C=O is strongly polar, no hydrogen bonds to itself', 2], ['propanone', 'CH₃COCH₃', 56, 'dipole–dipole: strongly polar C=O', 2], ['propan-1-ol', 'CH₃CH₂CH₂OH', 97, 'hydrogen bonds (O–H···O)', 3], ['ethanoic acid', 'CH₃COOH', 118, 'two hydrogen bonds per pair: a cyclic dimer', 4]];
export default function (host) {
  let k = 5, t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 400, min: 330, label: 'Boiling points of six compounds of similar molar mass, with a picture of the forces between two molecules' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'compound', D.map((d, i) => [i, d[0]]), k, (v) => { k = v; go(); });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const go = () => { const d = D[k]; ro.textContent = `${d[0]} (${d[1]}) boils at ${d[2]} °C: ${d[3]}. Same size, very different boiling points: the force between molecules decides.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Boiling point (°C): about the same mass, different forces', col), L = 36, R = w - 12, T = top + 8, B = h * 0.54, Y = (v) => B - (v + 20) / 150 * (B - T), bw = (R - L) / 6;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; for (const v of [0, 50, 100]) { ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(R, Y(v)); ctx.stroke(); text(ctx, String(v), L - 4, Y(v), { color: col.muted, size: 9.5, align: 'right' }); }
    D.forEach((d, i) => { const x = L + bw * i + bw * 0.12; ctx.fillStyle = i === k ? col.s[3] : col.s[0]; ctx.globalAlpha = i === k ? 1 : 0.55; ctx.fillRect(x, Y(Math.max(d[2], 0)), bw * 0.76, Math.abs(Y(d[2]) - Y(0))); ctx.globalAlpha = 1; text(ctx, String(d[2]), x + bw * 0.38, Y(Math.max(d[2], 0)) - 8, { color: col.ink, size: 10, align: 'center' }); text(ctx, d[0].length > 9 ? d[0].slice(0, 8) + '.' : d[0], x + bw * 0.38, B + 12, { color: i === k ? col.ink : col.muted, size: 9, weight: i === k ? 700 : 400, align: 'center' }); });
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(L, Y(0)); ctx.lineTo(R, Y(0)); ctx.stroke();
    // two molecules and their force
    const cy = B + 82, a = D[k][4], mx = w / 2, dx = Math.min(70, w * 0.2), wob = 3 * Math.sin(t * 3);
    const mol = (x, y, kind) => { ctx.fillStyle = col.soft; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.roundRect(x - 26, y - 18, 52, 36, 14); ctx.fill(); ctx.stroke(); if (kind) { ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.arc(x + 12, y, 6, 0, 7); ctx.fill(); text(ctx, 'δ−', x + 12, y - 12, { color: col.s[3], size: 9, align: 'center' }); ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.arc(x - 12, y, 5, 0, 7); ctx.fill(); text(ctx, 'δ+', x - 12, y - 12, { color: col.s[0], size: 9, align: 'center' }); } };
    mol(mx - dx, cy + wob * 0.5, a >= 1 && a !== 0); mol(mx + dx, cy - wob * 0.5, a >= 1);
    ctx.save(); ctx.lineWidth = 2; ctx.strokeStyle = a === 0 ? col.muted : col.s[1]; if (a >= 3) { ctx.setLineDash([]); ctx.lineWidth = 3; } else ctx.setLineDash([4, 4]);
    const n = a === 4 ? 2 : 1; for (let j = 0; j < n; j++) { const off = (j - (n - 1) / 2) * 14; ctx.beginPath(); ctx.moveTo(mx - dx + 26, cy + off); ctx.lineTo(mx + dx - 26, cy + off); ctx.stroke(); }
    ctx.restore();
    text(ctx, ['London forces (weakest)', 'weak dipole attraction', 'strong dipole–dipole', 'hydrogen bond (strong)', 'two hydrogen bonds: dimer (strongest)'][a], mx, cy + 40, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
    text(ctx, D[k][1], mx, cy + 58, { color: col.muted, size: 11, align: 'center' });
  };
  go();
}
