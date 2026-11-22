// Class 12 Chemistry, Haloalkanes and Haloarenes: the C-X bond in CH3-X for X = F, Cl, Br, I. Going down the group the halogen is bigger, so the bond is longer and weaker
// (bond enthalpy falls from 452 to 234 kJ/mol), which makes iodides the best leaving groups. The dipole moment is not simply ordered: charge x distance, with charge falling and distance rising.
// Data (CH3-X): bond length 139, 178, 193, 214 pm; bond enthalpy 452, 351, 293, 234 kJ/mol; dipole 1.85, 1.87, 1.81, 1.62 D (CRC Handbook).
import { canvas, text, title, line, row, slider, choice, readout } from '../../kit.js';

const X = ['F', 'Cl', 'Br', 'I'], LEN = [139, 178, 193, 214], BDE = [452, 351, 293, 234], DIP = [1.85, 1.87, 1.81, 1.62], RAD = [64, 99, 114, 133], EN = [4.0, 3.2, 3.0, 2.7];
export default function (host) {
  let k = 1, prop = 'bde';
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Bond length, bond enthalpy and dipole of the carbon-halogen bond for F, Cl, Br and I' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'halogen', min: 0, max: 3, step: 1, value: k, fmt: (v) => X[v], oninput: (v) => { k = v; go(); } });
  choice(ctl, 'chart', [['len', 'length'], ['bde', 'bond enthalpy'], ['dip', 'dipole']], prop, (v) => { prop = v; go(); });
  const go = () => { ro.textContent = `CH₃–${X[k]}: length ${LEN[k]} pm, bond enthalpy ${BDE[k]} kJ/mol, dipole ${DIP[k]} D, electronegativity of ${X[k]} = ${EN[k]} (C = 2.5). ` + (k === 3 ? 'Longest, weakest bond: iodide leaves most easily.' : k === 0 ? 'Shortest, strongest bond: fluoride leaves least easily.' : ''); cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `C–${X[k]} bond`, col), sc = (w - 60) / 340, y = top + 46, x0 = 30 + 60 * sc * 0.4;
    // molecule to scale (bond length)
    const cxp = x0 + 20, xx = cxp + LEN[k] * sc * 1.5; line(ctx, [[cxp, y], [xx, y]], col.ink, 3);
    ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(cxp, y, 17 * sc * 2.2 * 0.5 + 6, 0, 7); ctx.fill(); text(ctx, 'C', cxp, y, { color: col.panel, size: 12, weight: 700, align: 'center' });
    ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.arc(xx, y, RAD[k] * sc * 0.32 + 6, 0, 7); ctx.fill(); text(ctx, X[k], xx, y, { color: col.panel, size: 12, weight: 700, align: 'center' });
    text(ctx, 'δ+', cxp, y - 28, { color: col.s[3], size: 12, weight: 700, align: 'center' }); text(ctx, 'δ−', xx, y - 26, { color: col.s[0], size: 12, weight: 700, align: 'center' });
    text(ctx, `to scale: ${LEN[k]} pm`, (cxp + xx) / 2, y + 36, { color: col.muted, size: 10.5, align: 'center' });
    // bars
    const arr = prop === 'len' ? LEN : prop === 'bde' ? BDE : DIP, mx = prop === 'len' ? 240 : prop === 'bde' ? 500 : 2.2, unit = prop === 'len' ? 'pm' : prop === 'bde' ? 'kJ/mol' : 'D';
    const by = y + 62, bh = h - by - 34, bw = (w - 70) / 4;
    arr.forEach((v, i) => { const x = 40 + i * bw + bw * 0.15, hh = bh * v / mx; ctx.fillStyle = i === k ? col.s[0] : col.s[2]; ctx.fillRect(x, by + bh - hh, bw * 0.7, hh); text(ctx, String(v), x + bw * 0.35, by + bh - hh - 9, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, 'C–' + X[i], x + bw * 0.35, by + bh + 12, { color: i === k ? col.ink : col.muted, size: 11, weight: i === k ? 700 : 400, align: 'center' }); });
    text(ctx, unit, 12, by + 6, { color: col.muted, size: 10.5 });
  };
  go();
}
