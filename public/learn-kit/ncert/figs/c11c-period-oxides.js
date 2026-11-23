// Class 11 Chemistry, Classification of Elements: oxides of the period 3 elements. Across the period the oxides change from basic (ionic, metal) to amphoteric (Al2O3)
// to acidic (covalent, non-metal). Slide along the period: the bar shows ionic to covalent character and the box the reaction with water.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

const O = [['Na', 'Na₂O', 'basic', 'Na₂O + H₂O → 2NaOH (strong base)', 'pH about 14', 0], ['Mg', 'MgO', 'basic', 'MgO + H₂O → Mg(OH)₂ (weak base, slightly soluble)', 'pH about 10', 0.12], ['Al', 'Al₂O₃', 'amphoteric', 'does not dissolve in water; reacts with both acids and bases', 'neutral', 0.35], ['Si', 'SiO₂', 'weakly acidic', 'insoluble; reacts with hot NaOH to give silicate', 'neutral', 0.55], ['P', 'P₄O₁₀', 'acidic', 'P₄O₁₀ + 6H₂O → 4H₃PO₄', 'pH about 1', 0.75], ['S', 'SO₃', 'strongly acidic', 'SO₃ + H₂O → H₂SO₄', 'pH about 0', 0.88], ['Cl', 'Cl₂O₇', 'strongly acidic', 'Cl₂O₇ + H₂O → 2HClO₄ (very strong acid)', 'pH about 0', 1]];
export default function (host) {
  let g = 0;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 260, label: 'Period 3 oxides from basic to acidic with ionic and covalent character' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'element of period 3 (Na to Cl)', min: 0, max: 6, step: 1, value: g, fmt: (v) => O[v][0], oninput: (v) => { g = v; go(); } });
  const go = () => { const o = O[g]; ro.textContent = `${o[1]} is ${o[2]}: ${o[3]}. Metal oxides are basic; non-metal oxides are acidic; the oxide of aluminium (and zinc, tin, lead) is amphoteric.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'oxides across period 3', col) + 12, bw = (w - 16) / 7, y = t0 + 6;
    O.forEach((o, i) => { const x = 8 + i * bw; ctx.fillStyle = `hsl(${i < 2 ? 220 : i === 2 ? 130 : 20},70%,${88 - o[5] * 0}%)`; ctx.globalAlpha = i === g ? 0.9 : 0.35; ctx.fillRect(x + 1, y, bw - 2, 52); ctx.globalAlpha = 1; if (i === g) { ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(x + 1, y, bw - 2, 52); } text(ctx, o[0], x + bw / 2, y + 16, { color: col.ink, size: 13, weight: 700, align: 'center' }); text(ctx, o[1], x + bw / 2, y + 38, { color: col.ink, size: bw < 46 ? 10 : 11, align: 'center', fit: false }); });
    const by = y + 74; text(ctx, 'ionic', 8, by - 8, { color: col.muted, size: 10.5 }); text(ctx, 'covalent', w - 8, by - 8, { color: col.muted, size: 10.5, align: 'right' }); ctx.fillStyle = col.line; ctx.fillRect(8, by, w - 16, 8); const px = 8 + (w - 16) * O[g][5]; ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.arc(px, by + 4, 8, 0, 7); ctx.fill();
    const cy = by + 42; text(ctx, 'basic ← → acidic', w / 2, cy, { color: col.muted, size: 10.5, align: 'center' }); const grad = ctx.createLinearGradient(8, 0, w - 8, 0); grad.addColorStop(0, 'hsl(220,80%,55%)'); grad.addColorStop(0.45, 'hsl(130,55%,55%)'); grad.addColorStop(1, 'hsl(0,80%,55%)'); ctx.fillStyle = grad; ctx.fillRect(8, cy + 8, w - 16, 10); const ax = 8 + (w - 16) * [0.03, 0.2, 0.45, 0.58, 0.8, 0.92, 0.98][g]; ctx.fillStyle = col.ink; ctx.beginPath(); ctx.moveTo(ax, cy + 20); ctx.lineTo(ax - 6, cy + 32); ctx.lineTo(ax + 6, cy + 32); ctx.fill();
    text(ctx, O[g][2], w / 2, cy + 52, { color: col.ink, size: 15, weight: 700, align: 'center' }); text(ctx, O[g][4], w / 2, cy + 74, { color: col.s[2], size: 12, weight: 700, align: 'center' });
  };
  go();
}
