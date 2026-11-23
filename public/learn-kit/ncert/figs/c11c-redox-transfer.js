// Class 11 Chemistry, Redox Reactions: electron transfer in displacement reactions. Pick a metal and a metal-ion solution. If the metal sits higher
// in the reactivity (electrochemical) series than the ion's metal, its atoms lose electrons (oxidation, reducing agent) and the ion gains them (reduction,
// oxidising agent): Zn + Cu2+ -> Zn2+ + Cu. Reaction happens when E0(ion/metal) > E0(metal ion/metal) [E0 in volts, 298 K].
import { canvas, text, title, arrow, choice, readout, row, loop } from '../../kit.js';

const E = { Mg: -2.37, Zn: -0.76, Fe: -0.44, Cu: 0.34, Ag: 0.80 }, CH = { Mg: 2, Zn: 2, Fe: 2, Cu: 2, Ag: 1 };
const sup = (n) => (n === 1 ? '⁺' : '²⁺');
export default function (host) {
  let m = 'Zn', ion = 'Cu', t = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'Electrons moving from a metal atom to a metal ion in a displacement reaction' });
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'metal strip', [['Mg', 'Mg'], ['Zn', 'Zn'], ['Fe', 'Fe'], ['Cu', 'Cu'], ['Ag', 'Ag']], m, (v) => { m = v; go(); });
  choice(ctl, 'in solution of', [['Zn', 'Zn²⁺'], ['Fe', 'Fe²⁺'], ['Cu', 'Cu²⁺'], ['Ag', 'Ag⁺']], ion, (v) => { ion = v; go(); });
  anim.button(ctl);
  const works = () => m !== ion && E[ion] > E[m];
  const go = () => {
    if (m === ion) ro.textContent = 'Same metal on both sides: nothing to see.';
    else if (works()) { const ne = Math.min(2, CH[m] * 2) && 2; ro.textContent = `${m} is higher in the series (E° ${E[m]} V) than ${ion} (E° ${E[ion]} V): ${m} → ${m}${sup(CH[m])} + ${CH[m]}e⁻ (oxidation); ${ion}${sup(CH[ion])} + ${CH[ion]}e⁻ → ${ion} (reduction). Voltage if made into a cell: ${(E[ion] - E[m]).toFixed(2)} V.`; }
    else ro.textContent = `${m} is lower than ${ion} in the series (E° ${E[m]} V against ${E[ion]} V), so ${m} cannot push electrons onto ${ion}${sup(CH[ion])}: no reaction.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `${m} strip in ${ion}${sup(CH[ion])} solution`, col) + 10, go2 = works(), bx = w * 0.2, ix = w * 0.8, by = top + 70, r = 26;
    // beaker
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.12; ctx.fillRect(10, top, w - 20, 170); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(10, top, w - 20, 170);
    const atom = (x, y, lab, fill, ring) => { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = fill; ctx.globalAlpha = 0.85; ctx.fill(); ctx.globalAlpha = 1; ctx.lineWidth = 2; ctx.strokeStyle = ring; ctx.stroke(); text(ctx, lab, x, y, { color: col.ink, size: 12, weight: 700, align: 'center' }); };
    const ph = go2 ? ((t * 0.35) % 1) : 0;
    const left = go2 && ph > 0.55 ? `${m}${sup(CH[m])}` : m, right = go2 && ph > 0.55 ? ion : `${ion}${sup(CH[ion])}`;
    atom(bx, by, left, go2 && ph > 0.55 ? col.panel : col.s[2], col.s[3]); atom(ix, by, right, go2 && ph > 0.55 ? col.s[2] : col.panel, col.s[0]);
    if (go2) { for (let i = 0; i < 3; i++) { const u = Math.min(1, Math.max(0, (ph * 1.6 - i * 0.12))); if (u <= 0 || ph > 0.62) continue; const x = bx + r + u * (ix - bx - 2 * r), y = by - 4 - Math.sin(u * Math.PI) * 26; ctx.beginPath(); ctx.arc(x, y, 4.5, 0, 7); ctx.fillStyle = col.s[4]; ctx.fill(); } text(ctx, 'e⁻', w / 2, by - 40, { color: col.s[4], size: 12, weight: 700, align: 'center' }); }
    else if (m !== ion) { arrow(ctx, bx + r + 6, by, w / 2 - 14, by, col.line, 2); text(ctx, '✕', w / 2, by, { color: col.s[3], size: 18, weight: 700, align: 'center' }); }
    text(ctx, go2 ? 'loses e⁻: oxidised' : 'would lose e⁻', bx, by + 44, { color: col.s[3], size: 10.5, weight: 700, align: 'center' });
    text(ctx, go2 ? 'gains e⁻: reduced' : 'would gain e⁻', ix, by + 44, { color: col.s[0], size: 10.5, weight: 700, align: 'center' });
    text(ctx, `ox. no. ${go2 && ph > 0.55 ? '+' + CH[m] : '0'}`, bx, by + 62, { color: col.muted, size: 10, align: 'center' });
    text(ctx, `ox. no. ${go2 && ph > 0.55 ? '0' : '+' + CH[ion]}`, ix, by + 62, { color: col.muted, size: 10, align: 'center' });
    // series ladder
    const ly = top + 190, order = ['Mg', 'Zn', 'Fe', 'Cu', 'Ag'], lw = (w - 40) / 5;
    text(ctx, 'reducing power falls  →', 12, ly - 4, { color: col.muted, size: 10 });
    order.forEach((s, i) => { const x = 20 + i * lw, on = s === m || s === ion; ctx.fillStyle = on ? col.soft : col.panel; ctx.fillRect(x, ly + 6, lw - 4, 30); ctx.strokeStyle = s === m ? col.s[3] : s === ion ? col.s[0] : col.line; ctx.lineWidth = on ? 2.5 : 1; ctx.strokeRect(x, ly + 6, lw - 4, 30); text(ctx, s, x + (lw - 4) / 2, ly + 17, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, E[s] + ' V', x + (lw - 4) / 2, ly + 30, { color: col.muted, size: 9.5, align: 'center' }); });
    text(ctx, go2 ? 'The higher metal (left) pushes electrons onto the lower one’s ion.' : m === ion ? '' : 'A lower metal cannot reduce the ion of a higher one.', w / 2, ly + 56, { color: col.ink, size: 11, align: 'center' });
  };
  go();
}
