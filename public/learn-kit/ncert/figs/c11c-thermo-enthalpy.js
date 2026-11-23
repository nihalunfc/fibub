// Class 11 Chemistry, Thermodynamics: enthalpy change as the height difference between reactants and products. Choose a real reaction or set your own delta H.
// Exothermic (delta H < 0): products lower, heat flows out, the surroundings warm up. Endothermic (delta H > 0): products higher, heat flows in, the surroundings cool.
// Values (kJ per mole of reaction at 298 K): CH4 burning -890, CaO + H2O -65, NaOH dissolving -44.5, NH4NO3 dissolving +25.7, ice melting +6.0 (CRC Handbook, NIST webbook).
import { canvas, text, title, row, slider, choice, readout, arrow } from '../../kit.js';

const EX = { ch4: ['CH₄ burning', -890], cao: ['CaO + water (quicklime)', -65], naoh: ['NaOH dissolving', -44.5], nh4: ['NH₄NO₃ dissolving (cold pack)', 25.7], ice: ['ice melting', 6.0] };
export default function (host) {
  let dH = -890, key = 'ch4';
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 320, label: 'Enthalpy diagram of reactants and products showing exothermic and endothermic change' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'reaction', Object.entries(EX).map(([k, v]) => [k, v[0]]), key, (v) => { key = v; dH = EX[v][1]; sl.set(dH); go(); });
  const sl = slider(ctl, { label: 'or set ΔH (kJ/mol)', min: -900, max: 900, step: 5, value: dH, fmt: (v) => (v > 0 ? '+' : '') + v.toFixed(0), oninput: (v) => { dH = v; go(); } });
  const go = () => { ro.textContent = `ΔH = ${dH > 0 ? '+' : ''}${dH} kJ/mol: ${dH < 0 ? 'EXOTHERMIC. Heat flows out to the surroundings, which get warmer.' : dH > 0 ? 'ENDOTHERMIC. Heat flows in from the surroundings, which get colder.' : 'No heat change.'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'ΔH = H(products) − H(reactants)', col), T = t0 + 28, B = h - 40, mid = (T + B) / 2, sc = (B - T) * 0.45 / 900;
    const yR = mid + dH * sc / 2, yP = mid - dH * sc / 2;
    const bar = (x, y, lab, c) => { ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 90, y); ctx.stroke(); text(ctx, lab, x + 45, y + (y > mid ? 16 : -14), { color: c, size: 12, weight: 700, align: 'center' }); };
    const xR = w * 0.12, xP = w * 0.58;
    bar(xR, yR, 'reactants', col.s[0]); bar(xP, yP, 'products', col.s[2]);
    ctx.setLineDash([4, 4]); ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(xR + 90, yR); ctx.lineTo(xP, yR); ctx.moveTo(xR + 90, yP); ctx.lineTo(xP, yP); ctx.stroke(); ctx.setLineDash([]);
    const ax = (xR + 90 + xP) / 2;
    if (Math.abs(dH) > 2) arrow(ctx, ax, yR, ax, yP, dH < 0 ? col.bad : col.s[1], 3, 10);
    text(ctx, 'ΔH = ' + (dH > 0 ? '+' : '') + dH + ' kJ/mol', w / 2, T + 6, { color: dH < 0 ? col.bad : col.s[1], size: 13, weight: 700, align: 'center' });
    text(ctx, 'enthalpy H', 10, T - 8, { color: col.muted, size: 10.5 });
    const warm = dH < 0, lab = dH === 0 ? 'no change' : warm ? 'heat OUT: surroundings warmer' : 'heat IN: surroundings colder';
    text(ctx, lab, w / 2, h - 14, { color: warm ? col.bad : col.s[1], size: 12.5, weight: 700, align: 'center' });
  };
  go();
}
