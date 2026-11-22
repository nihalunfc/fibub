// Class 12 Chemistry, Aldehydes, Ketones and Carboxylic Acids: the laboratory tests. Choose a compound, then a reagent, and see what happens in the test tube.
// Tollens (ammoniacal silver nitrate): aldehydes give a silver mirror. Fehling (Cu2+ in tartrate, alkaline): aliphatic aldehydes give a red-brown Cu2O precipitate, aromatic ones do not.
// 2,4-DNP: any aldehyde or ketone gives an orange-yellow precipitate. Iodoform (I2 + NaOH): methyl ketones and ethanal (and CH3CH(OH)- alcohols) give a yellow precipitate of CHI3.
// NaHCO3: carboxylic acids give CO2 bubbles.
import { canvas, text, title, row, choice, readout, loop } from '../../kit.js';

const C = { eth: 'ethanal', pro: 'propanone', ben: 'benzaldehyde', ac: 'ethanoic acid', pa: 'propanal', et: 'ethanol' };
const T = { tollens: 'Tollens', fehling: 'Fehling', dnp: '2,4-DNP', iodo: 'iodoform', bicarb: 'NaHCO₃' };
const R = { // [positive, what you see]
  tollens: { eth: [1, 'silver mirror'], pa: [1, 'silver mirror'], ben: [1, 'silver mirror'], pro: [0, 'no reaction: ketones are not oxidised'], ac: [0, 'no reaction'], et: [0, 'no reaction'] },
  fehling: { eth: [1, 'red-brown Cu₂O precipitate'], pa: [1, 'red-brown Cu₂O precipitate'], ben: [0, 'no precipitate: aromatic aldehydes do not reduce Fehling’s solution'], pro: [0, 'no reaction'], ac: [0, 'no reaction'], et: [0, 'no reaction'] },
  dnp: { eth: [1, 'orange-yellow precipitate'], pa: [1, 'orange-yellow precipitate'], ben: [1, 'orange-yellow precipitate'], pro: [1, 'orange-yellow precipitate'], ac: [0, 'no precipitate (no C=O of this kind)'], et: [0, 'no reaction'] },
  iodo: { eth: [1, 'yellow precipitate of CHI₃ (has CH₃CO–)'], pa: [0, 'no yellow precipitate (no CH₃CO– group)'], ben: [0, 'no reaction'], pro: [1, 'yellow precipitate of CHI₃ (CH₃CO– group)'], ac: [0, 'no reaction'], et: [1, 'yellow precipitate: oxidised to ethanal first (CH₃CH(OH)– group)'] },
  bicarb: { eth: [0, 'no bubbles'], pa: [0, 'no bubbles'], ben: [0, 'no bubbles'], pro: [0, 'no bubbles'], ac: [1, 'CO₂ bubbles (brisk fizzing)'], et: [0, 'no bubbles'] },
};
export default function (host) {
  let c = 'eth', tt = 'tollens', t = 0;
  const cv = canvas(host, { aspect: 0.74, max: 330, min: 270, label: 'A test tube showing the result of a chemical test on an aldehyde, ketone, acid or alcohol' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'compound', Object.entries(C), c, (v) => { c = v; t = 0; go(); });
  choice(ctl, 'test', Object.entries(T), tt, (v) => { tt = v; t = 0; go(); });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const go = () => { const [p, s] = R[tt][c]; ro.textContent = `${C[c]} + ${T[tt]} test: ${p ? 'positive' : 'negative'}, ${s}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const [p, s] = R[tt][c], top = title(ctx, `${C[c]} with ${T[tt]} test`, col), tx = w * 0.3, tw = 60, ty = top + 10, th = h - ty - 38, f = Math.min(1, t / 2.5);
    const liq = { tollens: col.soft, fehling: col.s[0], dnp: col.s[2], iodo: col.s[4], bicarb: col.soft }[tt];
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(tx - tw / 2, ty); ctx.lineTo(tx - tw / 2, ty + th - tw / 2); ctx.arc(tx, ty + th - tw / 2, tw / 2, Math.PI, 0, true); ctx.lineTo(tx + tw / 2, ty); ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.moveTo(tx - tw / 2 + 2, ty + th * 0.35); ctx.lineTo(tx - tw / 2 + 2, ty + th - tw / 2); ctx.arc(tx, ty + th - tw / 2, tw / 2 - 2, Math.PI, 0, true); ctx.lineTo(tx + tw / 2 - 2, ty + th * 0.35); ctx.closePath(); ctx.clip();
    ctx.globalAlpha = tt === 'tollens' || tt === 'bicarb' ? 1 : 0.4; ctx.fillStyle = liq; ctx.fillRect(tx - tw, ty + th * 0.35, tw * 2, th); ctx.globalAlpha = 1;
    if (p && tt === 'tollens') { ctx.strokeStyle = col.muted; ctx.lineWidth = 4 * f; ctx.beginPath(); ctx.arc(tx, ty + th - tw / 2, tw / 2 - 3, 0.1, Math.PI - 0.1); ctx.stroke(); ctx.fillStyle = col.muted; ctx.globalAlpha = f * 0.5; ctx.fillRect(tx - tw / 2 + 2, ty + th * 0.45, 5 * f, th * 0.4); ctx.globalAlpha = 1; }
    if (p && (tt === 'fehling' || tt === 'dnp' || tt === 'iodo')) { const pc = { fehling: col.s[3], dnp: col.s[3], iodo: col.s[2] }[tt]; for (let i = 0; i < 120 * f; i++) { const x = tx + (((i * 53) % 100) / 100 - 0.5) * (tw - 10), y = ty + th * 0.4 + ((i * 37) % 100) / 100 * (th * 0.6) * f + th * 0.35 * (1 - f); ctx.fillStyle = pc; ctx.beginPath(); ctx.arc(x, y, 2.2, 0, 7); ctx.fill(); } }
    ctx.restore();
    if (p && tt === 'bicarb') for (let i = 0; i < 9; i++) { const y = ty + th * 0.85 - ((t * 40 + i * 25) % (th * 0.55)), x = tx + 14 * Math.sin(i * 2.1 + t * 3) * (1 + i % 3) / 2; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(x, y, 3 + i % 3, 0, 7); ctx.stroke(); }
    text(ctx, p ? 'POSITIVE' : 'negative', w * 0.64, ty + 24, { color: p ? col.s[1] : col.muted, size: 15, weight: 700, align: 'center' });
    const words = s.split(' '), lines = []; let cur = ''; words.forEach((wd) => { if ((cur + ' ' + wd).length > 22) { lines.push(cur); cur = wd; } else cur = (cur ? cur + ' ' : '') + wd; }); lines.push(cur);
    lines.forEach((l, i) => text(ctx, l, w * 0.64, ty + 54 + i * 18, { color: col.ink, size: 12, align: 'center' }));
    text(ctx, { tollens: 'ammoniacal AgNO₃, warm', fehling: 'Cu²⁺ + tartrate, NaOH, heat', dnp: '2,4-dinitrophenylhydrazine', iodo: 'I₂ + NaOH, warm', bicarb: 'sodium hydrogencarbonate' }[tt], tx, ty + th + 18, { color: col.muted, size: 10.5, align: 'center' });
  };
  go();
}
