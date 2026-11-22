// Class 10 Carbon: what ethanol and ethanoic acid do, as test-tube experiments with bubbles and colour.
// Ethanol + Na -> sodium ethoxide + H2; ethanol + hot conc. H2SO4 (443 K) -> ethene + water (dehydration);
// ethanol + ethanoic acid -> ester (sweet smell, acid catalyst); ethanoic acid + NaHCO3 -> sodium ethanoate + H2O + CO2;
// ethanoic acid + NaOH (neutralisation); ethanol and ethanoic acid are tested with litmus.
import { canvas, text, title, line, dot, row, choice, readout, loop, rng } from '../../kit.js';

const E = {
  na: { n: 'Ethanol + sodium', liq: 0, bub: 1, gas: 'H₂', eq: '2CH₃CH₂OH + 2Na → 2CH₃CH₂ONa + H₂↑', note: 'Sodium fizzes slowly in ethanol and gives hydrogen gas, which burns with a pop. Ethanol is a very weak acid; it is neutral to litmus.', solid: 'Na' },
  dehyd: { n: 'Ethanol + hot conc. H₂SO₄', liq: 1, bub: 1, gas: 'ethene', heat: 1, eq: 'CH₃CH₂OH → CH₂=CH₂ + H₂O  (conc. H₂SO₄, 443 K)', note: 'Hot concentrated sulphuric acid removes water from ethanol (dehydration), leaving ethene. The acid is not used up: it is a dehydrating agent.' },
  ester: { n: 'Ethanol + ethanoic acid', liq: 2, bub: 0, heat: 1, smell: 1, eq: 'CH₃COOH + CH₃CH₂OH ⇌ CH₃COOCH₂CH₃ + H₂O  (a few drops of conc. H₂SO₄)', note: 'An acid and an alcohol make an ester and water (esterification). Esters have a sweet, fruity smell, used in perfumes and flavours. Warming with acid speeds it up.' },
  carb: { n: 'Ethanoic acid + NaHCO₃', liq: 3, bub: 2, gas: 'CO₂', eq: 'CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂↑', note: 'Brisk fizzing: CO₂ is given off, which turns lime water milky. A weak acid still reacts with a carbonate or hydrogencarbonate, just like HCl does.' },
  naoh: { n: 'Ethanoic acid + NaOH', liq: 4, bub: 0, eq: 'CH₃COOH + NaOH → CH₃COONa + H₂O', note: 'Acid + base → salt (sodium ethanoate) + water. Neutralisation, exactly as you learnt in Acids, Bases and Salts. No gas this time.' },
  lit: { n: 'Litmus test', liq: 5, bub: 0, eq: 'CH₃COOH ⇌ CH₃COO⁻ + H⁺ (only about 1% split)', note: 'Ethanoic acid (vinegar, 5% to 8%) turns blue litmus red but is only a weak acid: it ionises only a little. Ethanol leaves litmus unchanged.' },
};
const LIQ = ['rgba(180,210,235,0.55)', 'rgba(235,225,140,0.6)', 'rgba(225,215,170,0.6)', 'rgba(200,220,235,0.55)', 'rgba(210,230,240,0.5)', 'rgba(235,120,110,0.45)'];
export default function (host) {
  let k = 'na', t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Test tube experiments with ethanol and ethanoic acid: bubbles, colour and equations' });
  const ctl = row(host);
  choice(ctl, 'Experiment', Object.entries(E).map(([v, o]) => [v, o.n.replace('Ethanol', 'Ethanol').replace(' + ', ' + ')]), k, (v) => { k = v; say(); });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const out = readout(host);
  function say() { out.innerHTML = `<b>${E[k].n}.</b> ${E[k].note}`; cv.redraw(); }
  const R = rng(5), B = Array.from({ length: 16 }, () => [R(), R(), 0.3 + R()]);
  cv.draw = (ctx, w, h, col) => {
    const e = E[k], top = title(ctx, e.n, col) + 10, tw = 74, tx = w / 2 - tw / 2, ty = top + 8, th = h - top - 74;
    ctx.fillStyle = LIQ[e.liq]; ctx.fillRect(tx, ty + th * 0.4, tw, th * 0.6 - 2);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx, ty + th - 14); ctx.arc(tx + tw / 2, ty + th - 14, tw / 2, Math.PI, 0, true); ctx.lineTo(tx + tw, ty); ctx.stroke();
    if (e.bub) B.forEach(([a, b, s], i) => { const f = e.bub === 2 ? 1.8 : 0.8, y = ((b + t * 0.4 * s * f) % 1); const X = tx + 8 + a * (tw - 16) + Math.sin(t * 3 + i) * 3, Y = ty + th * 0.95 - y * th * 0.62; dot(ctx, X, Y, 2.5 + s * 1.6, col.panel, col.muted); });
    if (e.solid) { const sx = tx + tw / 2 + Math.sin(t * 2) * 12; ctx.fillStyle = col.s[6]; ctx.fillRect(sx - 6, ty + th * 0.4 - 5 + Math.cos(t * 3) * 2, 12, 8); text(ctx, e.solid, sx, ty + th * 0.4 - 16, { color: col.ink, size: 10, weight: 700, align: 'center' }); }
    if (e.heat) { for (let i = 0; i < 3; i++) { const fx = tx + tw * (0.25 + 0.25 * i), fy = ty + th + 4 + Math.sin(t * 8 + i) * 2; ctx.fillStyle = col.s[1]; ctx.beginPath(); ctx.moveTo(fx - 6, fy + 18); ctx.quadraticCurveTo(fx, fy - 8 - Math.sin(t * 9 + i) * 3, fx + 6, fy + 18); ctx.fill(); } text(ctx, 'warm', tx + tw + 10, ty + th - 6, { color: col.s[1], size: 10.5, weight: 700 }); }
    if (e.gas) { const gx = tx + tw + 26; for (let i = 0; i < 4; i++) { const yy = ty + 4 + ((t * 18 + i * 22) % 70); dot(ctx, gx + Math.sin(t + i) * 8, ty + 28 - (yy - ty) * 0.5, 3, col.s[3]); } text(ctx, e.gas + ' ↑', gx + 24, ty + 20, { color: col.s[3], size: 12, weight: 700 }); }
    if (e.smell) { for (let i = 0; i < 3; i++) text(ctx, '~', tx + tw / 2 + (i - 1) * 16, ty - 4 - ((t * 15 + i * 9) % 30), { color: col.s[5], size: 16, weight: 700, align: 'center' }); text(ctx, 'sweet, fruity smell', tx + tw + 12, ty + 12, { color: col.s[5], size: 10.5, weight: 700 }); }
    if (k === 'lit') { ctx.fillStyle = 'rgba(214,60,60,0.8)'; ctx.fillRect(tx + tw / 2 - 5, ty - 10, 10, th * 0.45); text(ctx, 'blue litmus → red', tx + tw + 12, ty + 12, { color: col.s[7], size: 10.5, weight: 700 }); }
    if (k === 'carb') text(ctx, 'gas → lime water: milky', tx - 12, ty + 12, { color: col.s[3], size: 10.5, weight: 700, align: 'right' });
    text(ctx, e.eq, w / 2, h - 14, { color: col.s[2], size: 10.5, weight: 700, align: 'center' });
  };
  say();
}
