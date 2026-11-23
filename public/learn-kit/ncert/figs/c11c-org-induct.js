// Class 11 Chemistry, Organic Chemistry basics: the inductive effect. An electronegative group (-F, -Cl, -NO2) pulls the sigma electrons of the chain toward itself (-I effect):
// the carbon next to it gets a partial positive charge, the next a smaller one, and the pull dies out after about three bonds. Alkyl groups push electrons (+I).
// It shows in acid strength: a stronger pull stabilises the carboxylate anion, so pKa is lower. pKa (water, 298 K): CH3COOH 4.76, FCH2COOH 2.59, ClCH2COOH 2.86, O2NCH2COOH 1.68,
// propanoic 4.87; butanoic 4.82; 2-chloro 2.86, 3-chloro 4.06, 4-chloro 4.52 (CRC Handbook / Dippy 1939 style data).
import { canvas, text, title, arrow, choice, readout, row } from '../../kit.js';

const SUB = { H: ['H (reference)', 4.76, 0], CH3: ['CH₃ (+I, pushes)', 4.87, -0.4], Cl: ['Cl (−I)', 2.86, 1], F: ['F (−I, stronger)', 2.59, 1.25], NO2: ['NO₂ (−I, strongest)', 1.68, 1.6] };
const POS = [['2', 2.86], ['3', 4.06], ['4', 4.52]];
export default function (host) {
  let mode = 'sub', s = 'Cl', pos = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 320, label: 'Inductive effect along a carbon chain and its effect on the pKa of the acid' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'show', [['sub', 'which group X (in X–CH₂COOH)'], ['pos', 'where is Cl (in butanoic acid)']], mode, (v) => { mode = v; go(); });
  choice(ctl, 'group X', Object.keys(SUB).map((k) => [k, k === 'NO2' ? 'NO₂' : k === 'CH3' ? 'CH₃' : k]), s, (v) => { s = v; go(); });
  choice(ctl, 'Cl on carbon', POS.map(([k], i) => [i, 'C' + k]), pos, (v) => { pos = v; go(); });
  const go = () => { ro.textContent = mode === 'sub' ? `${SUB[s][0]}: pKa of X–CH₂COOH = ${SUB[s][1]}. A lower pKa means a stronger acid because the anion is better stabilised.` : `Cl on carbon ${POS[pos][0]} of butanoic acid: pKa = ${POS[pos][1]} (butanoic acid itself 4.82). The effect fades with every bond between Cl and the COOH.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Inductive effect: the pull fades along the chain', col);
    const sub = mode === 'sub', y = 100, nm = (x) => (x === 'NO2' ? 'NO₂' : x === 'CH3' ? 'CH₃' : x);
    const xs = sub ? [w * 0.2, w * 0.5, w * 0.8] : [w * 0.14, w * 0.38, w * 0.62, w * 0.86];
    const names = sub ? [nm(s), 'CH₂', 'COOH'] : ['C4', 'C3', 'C2', 'C1'];
    const bearer = sub ? 0 : 3 - (pos + 1) + 0; // index of the carbon bearing the group: C2 -> 2, C3 -> 1, C4 -> 0
    const pull = sub ? SUB[s][2] : 1;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(xs[0], y); xs.forEach((x, i) => i && ctx.lineTo(x, y)); ctx.stroke();
    xs.forEach((x, i) => {
      ctx.beginPath(); ctx.arc(x, y, 19, 0, 7); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.stroke();
      text(ctx, names[i], x, y, { color: col.ink, size: names[i].length > 3 ? 10 : 12, weight: 700, align: 'center' });
      const dist = sub ? i : i - bearer;
      if (!sub && i === bearer) text(ctx, 'Cl', x, y - 34, { color: col.s[0], size: 14, weight: 700, align: 'center' });
      if (sub ? i > 0 : i > bearer) { const k = pull * Math.pow(0.45, dist - 1); if (Math.abs(k) > 0.02) text(ctx, k > 0 ? 'δ+' : 'δ−', x, y - 36, { color: k > 0 ? col.s[3] : col.s[0], size: 10 + 14 * Math.min(1.2, Math.abs(k)), weight: 700, align: 'center' }); }
    });
    if (!sub) text(ctx, 'C1 is the carbon of COOH', w / 2, y + 40, { color: col.muted, size: 10, align: 'center' });
    else text(ctx, 'X pulls electrons toward itself; the effect weakens at each bond', w / 2, y + 40, { color: col.muted, size: 10, align: 'center' });
    // pKa bar
    const bw = w - 60, by = h - 78, pk = mode === 'sub' ? SUB[s][1] : POS[pos][1], ref = mode === 'sub' ? 4.76 : 4.82;
    text(ctx, 'acid strength: pKa (lower = stronger acid)', 30, by - 24, { color: col.muted, size: 10.5 });
    ctx.fillStyle = col.line; ctx.fillRect(30, by, bw, 16); ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.8; ctx.fillRect(30, by, bw * (pk / 5.2), 16); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(30 + bw * ref / 5.2, by - 5); ctx.lineTo(30 + bw * ref / 5.2, by + 21); ctx.stroke();
    text(ctx, 'pKa = ' + pk, 30 + bw * pk / 5.2 - 4, by + 8, { color: col.ink, size: 11, weight: 700, align: pk > 2.5 ? 'right' : 'left' });
    text(ctx, 'black line: unsubstituted acid (' + ref + ')', 30, by + 34, { color: col.muted, size: 10 });
  };
  go();
}
