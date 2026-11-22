// Class 12 Chemistry, Haloalkanes and Haloarenes: nucleophilic substitution in chlorobenzene. Plain chlorobenzene needs 623 K and 300 atm with NaOH to give phenol. Electron-withdrawing NO2 groups
// at the ortho and para positions help: the attacking OH- makes a negatively charged intermediate whose charge sits on the ortho and para carbons, and a nitro group there takes it up (resonance).
// Conditions (textbook values): none 623 K, 300 atm; one o/p NO2 about 443 K; 2,4-dinitro 368 K; 2,4,6-trinitro 298 K (room temperature) giving picric acid.
import { canvas, text, title, row, choice, readout, loop } from '../../kit.js';

const D = {
  0: { n: 'chlorobenzene', T: 623, no: [], note: '623 K and 300 atm with NaOH, then acid: phenol.' },
  1: { n: '4-nitrochlorobenzene', T: 443, no: [3], note: 'one para NO₂: 443 K with aqueous NaOH.' },
  2: { n: '2,4-dinitrochlorobenzene', T: 368, no: [1, 3], note: 'two NO₂ (ortho and para): 368 K.' },
  3: { n: '2,4,6-trinitrochlorobenzene', T: 298, no: [1, 3, 5], note: 'three NO₂ (two ortho and one para): warm water at 298 K gives picric acid.' },
};
export default function (host) {
  let k = 0, t = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'Chlorobenzene with nitro groups, the negative charge on ortho and para carbons, and the temperature needed' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'nitro groups', [[0, 'none'], [1, 'p-NO₂'], [2, '2,4-di'], [3, '2,4,6-tri']], k, (v) => { k = v; go(); });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const go = () => { ro.textContent = `${D[k].n}: ${D[k].note} Each o/p nitro group takes up the negative charge of the intermediate, so conditions get milder.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const d = D[k], top = title(ctx, d.n, col), cx = w * 0.4, cy = top + (h - top) * 0.42, R = Math.min(w * 0.2, (h - top) * 0.22);
    const vx = (i) => cx + R * Math.sin((i * Math.PI) / 3), vy = (i) => cy - R * Math.cos((i * Math.PI) / 3);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); for (let i = 0; i <= 6; i++) i ? ctx.lineTo(vx(i % 6), vy(i % 6)) : ctx.moveTo(vx(0), vy(0)); ctx.stroke();
    ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, R * 0.55, 0, 7); ctx.stroke();
    // Cl on C0
    const out = (i, r) => [cx + (R + r) * Math.sin((i * Math.PI) / 3), cy - (R + r) * Math.cos((i * Math.PI) / 3)];
    const [clx, cly] = out(0, 28); ctx.beginPath(); ctx.moveTo(vx(0), vy(0)); ctx.lineTo(clx, cly); ctx.stroke(); ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.arc(clx, cly, 13, 0, 7); ctx.fill(); text(ctx, 'Cl', clx, cly, { color: col.panel, size: 11, weight: 700, align: 'center' });
    // charge on ortho (1,5) and para (3)
    const pulse = 0.6 + 0.4 * Math.sin(t * 3);
    [1, 5, 3].forEach((i) => { const has = d.no.includes(i); ctx.globalAlpha = 0.5 + 0.5 * pulse; ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.arc(vx(i), vy(i), 9, 0, 7); ctx.fill(); ctx.globalAlpha = 1; text(ctx, '−', vx(i), vy(i), { color: col.panel, size: 13, weight: 700, align: 'center' }); if (has) { const [nx, ny] = out(i, 32); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(vx(i), vy(i)); ctx.lineTo(nx, ny); ctx.stroke(); ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.arc(nx, ny, 14, 0, 7); ctx.fill(); text(ctx, 'NO₂', nx, ny, { color: col.panel, size: 9, weight: 700, align: 'center' }); } });
    text(ctx, 'charge of the intermediate: ortho and para carbons', cx, h - 14, { color: col.muted, size: 10.5, align: 'center' });
    // thermometer
    const tx = w - 46, ty0 = top + 20, ty1 = h - 40, f = (d.T - 280) / (640 - 280); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(tx - 9, ty0, 18, ty1 - ty0); ctx.fillStyle = col.s[0]; ctx.fillRect(tx - 7, ty1 - (ty1 - ty0) * f, 14, (ty1 - ty0) * f);
    text(ctx, d.T + ' K', tx, ty1 + 14, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, 'needed', tx, ty0 - 8, { color: col.muted, size: 10, align: 'center' });
  };
  go();
}
