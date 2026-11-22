// Class 12 Chemistry, Alcohols, Phenols and Ethers: classifying by the carbon that carries the -OH (or the O).
// Primary (1 degree) = the C-OH carbon is bonded to one other carbon, secondary to two, tertiary to three. Phenol has OH on an sp2 ring carbon; an ether has O between two carbon groups.
// The class decides how fast an alcohol dehydrates and what it gives on oxidation.
import { canvas, text, title, row, choice, readout } from '../../kit.js';

const L = {
  meoh: { n: 'methanol', f: 'CH₃OH', k: 'Methyl alcohol (0 carbons attached)', R: ['H', 'H', 'H'], note: 'Oxidised to methanal (HCHO) and then methanoic acid. Poisonous: even a few mL can cause blindness.' },
  etoh: { n: 'ethanol', f: 'CH₃CH₂OH', k: 'Primary (1°) alcohol', R: ['CH₃', 'H', 'H'], note: 'The C–OH carbon holds one carbon. Mild oxidation gives ethanal, strong oxidation gives ethanoic acid.' },
  ipr: { n: 'propan-2-ol', f: '(CH₃)₂CHOH', k: 'Secondary (2°) alcohol', R: ['CH₃', 'CH₃', 'H'], note: 'Two carbons on the C–OH carbon. Oxidation stops at a ketone, propanone. Used as rubbing alcohol.' },
  tbu: { n: '2-methylpropan-2-ol', f: '(CH₃)₃COH', k: 'Tertiary (3°) alcohol', R: ['CH₃', 'CH₃', 'CH₃'], note: 'Three carbons, no H on the C–OH carbon, so it is not oxidised under normal conditions. It dehydrates fastest.' },
  ph: { n: 'phenol', f: 'C₆H₅OH', k: 'Phenol: OH on an aromatic ring carbon', R: null, note: 'The OH sits on an sp² carbon of the benzene ring. Phenols are NOT alcohols: they are acidic and the ring is very reactive.' },
  et: { n: 'ethoxyethane', f: 'C₂H₅–O–C₂H₅', k: 'Ether: O between two carbon groups', R: null, note: 'No O–H bond, so no hydrogen bonding between its own molecules: low boiling point and almost unreactive.' },
};
export default function (host) {
  let k = 'etoh';
  const cv = canvas(host, { aspect: 0.62, max: 330, min: 250, label: 'The carbon that carries the OH group, with the groups attached to it, for six compounds' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'compound', Object.entries(L).map(([id, o]) => [id, o.n]), k, (v) => { k = v; go(); });
  const go = () => { const o = L[k]; ro.textContent = `${o.n} (${o.f}): ${o.k}. ${o.note}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const o = L[k], top = title(ctx, o.k, col), cx = w / 2, cy = top + (h - top) * 0.5, r = Math.min(w, h) * 0.32;
    const bond = (x, y, c, wd = 2.2) => { ctx.strokeStyle = c; ctx.lineWidth = wd; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke(); };
    const lab = (s, x, y, c, bg, sz = 13) => { ctx.font = `700 ${sz}px system-ui`; const tw = Math.max(26, ctx.measureText(s).width + 14); ctx.fillStyle = bg; ctx.strokeStyle = c; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.roundRect(x - tw / 2, y - 14, tw, 28, 8); ctx.fill(); ctx.stroke(); text(ctx, s, x, y, { color: col.ink, size: sz, weight: 700, align: 'center' }); };
    if (o.R) {
      const p = [[cx - r, cy - r * 0.2], [cx + r, cy - r * 0.2], [cx, cy + r * 0.85]], q = [cx, cy - r * 0.95];
      o.R.forEach((g, i) => { bond(p[i][0], p[i][1], col.muted); lab(g, p[i][0], p[i][1], g === 'H' ? col.line : col.s[0], g === 'H' ? col.soft : col.panel); });
      bond(q[0], q[1], col.s[3], 3); lab('OH', q[0], q[1], col.s[3], col.panel);
      ctx.fillStyle = col.panel; ctx.beginPath(); ctx.arc(cx, cy, 15, 0, 7); ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.6; ctx.stroke();
      text(ctx, 'C', cx, cy, { color: col.ink, size: 14, weight: 700, align: 'center' });
      const nC = o.R.filter((g) => g !== 'H').length;
      text(ctx, k === 'meoh' ? 'carbons attached to the C–OH carbon: 0' : `carbons attached to the C–OH carbon: ${nC}`, cx, h - 14, { color: col.s[0], size: 12, weight: 700, align: 'center' });
    } else if (k === 'ph') {
      const rr = r * 0.8, ccx = cx, ccy = cy + 10; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath();
      for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + i * Math.PI / 3; ctx[i ? 'lineTo' : 'moveTo'](ccx + rr * Math.cos(a), ccy + rr * Math.sin(a)); } ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(ccx, ccy, rr * 0.6, 0, 7); ctx.stroke();
      ctx.strokeStyle = col.s[3]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ccx, ccy - rr); ctx.lineTo(ccx, ccy - rr - 22); ctx.stroke();
      lab('OH', ccx, ccy - rr - 28, col.s[3], col.panel);
      text(ctx, 'sp² carbon of the ring', ccx + rr * 0.1, ccy - rr + 14, { color: col.muted, size: 10.5, align: 'center' });
      text(ctx, 'OH on a benzene ring carbon', cx, h - 14, { color: col.s[0], size: 12, weight: 700, align: 'center' });
    } else {
      const y = cy; ctx.strokeStyle = col.muted; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(cx - r, y); ctx.lineTo(cx + r, y); ctx.stroke();
      lab('C₂H₅', cx - r, y, col.s[0], col.panel); lab('C₂H₅', cx + r, y, col.s[0], col.panel);
      ctx.fillStyle = col.panel; ctx.beginPath(); ctx.arc(cx, y, 16, 0, 7); ctx.fill(); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.stroke();
      text(ctx, 'O', cx, y, { color: col.ink, size: 14, weight: 700, align: 'center' });
      text(ctx, 'no O–H bond: no hydrogen bonds between its own molecules', cx, h - 14, { color: col.s[0], size: 11.5, weight: 700, align: 'center' });
    }
  };
  go();
}
