// Class 9 Work and Energy: energy changes form but is never lost (conservation of energy). Pick a device and watch
// energy flow along its chain of conversions, with the useful share and the share spilled as heat. Approximate
// real-world efficiencies, rounded: hydro power ~90%, filament bulb ~5% light, LED ~40%, cycle dynamo light ~ 15%.
import { canvas, text, title, line, arrow, row, choice, readout, loop } from '../../kit.js';

const DEV = {
  hydro: { name: 'Hydro dam', chain: ['water at height (PE)', 'moving water (KE)', 'turbine spins (KE)', 'electricity'], eff: 0.9, note: 'Almost all of the water’s energy becomes electricity (about 90% in a good dam); the rest is heat and sound.' },
  bulb: { name: 'Filament bulb', chain: ['electricity', 'hot filament (heat)', 'light'], eff: 0.05, note: 'Only about 5% of the energy becomes light. The rest is heat, which is why a bulb is too hot to touch.' },
  led: { name: 'LED lamp', chain: ['electricity', 'light'], eff: 0.4, note: 'An LED turns a much larger share into light, so it gives the same light for far less energy.' },
  cycle: { name: 'Cyclist and dynamo', chain: ['food (chemical)', 'muscles (KE)', 'dynamo spins', 'light'], eff: 0.04, note: 'Chemical energy from food is turned to movement, then electricity, then light. At each step some is spilled as heat.' },
};
export default function (host) {
  let k = 'hydro', t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'An energy chain for a chosen device showing useful energy and wasted heat' });
  const ctl = row(host);
  choice(ctl, 'Device', Object.entries(DEV).map(([v, d]) => [v, d.name]), k, (v) => { k = v; upd(); });
  const out = readout(host);
  function upd() { const d = DEV[k]; out.innerHTML = `Of 100 J put in, about <b>${(d.eff * 100).toFixed(0)} J</b> comes out as the useful form and <b>${(100 - d.eff * 100).toFixed(0)} J</b> spreads out as heat. Total = 100 J: nothing disappears. ${d.note}`; cv.redraw(); }
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const d = DEV[k], n = d.chain.length; title(ctx, d.name + ': 100 J in', col);
    const bw = Math.min(110, (w - 20) / n - 14), gap = (w - 20 - bw * n) / Math.max(1, n - 1), y = 56;
    const flow = (i) => d.eff ** (i / Math.max(1, n - 1));
    for (let i = 0; i < n; i++) {
      const x = 10 + i * (bw + gap), keep = flow(i);
      ctx.fillStyle = col.soft; ctx.fillRect(x, y, bw, 52); ctx.strokeStyle = i === n - 1 ? col.s[2] : col.ink; ctx.lineWidth = 2; ctx.strokeRect(x, y, bw, 52);
      const words = d.chain[i].split(' '); let l1 = words[0], l2 = words.slice(1).join(' '); if (words.length > 2 || l1.length + l2.length < 12) { l1 = words.slice(0, Math.ceil(words.length / 2)).join(' '); l2 = words.slice(Math.ceil(words.length / 2)).join(' '); }
      text(ctx, l1, x + bw / 2, y + 20, { color: col.ink, size: 9.5, weight: 700, align: 'center', fit: false }); if (l2) text(ctx, l2, x + bw / 2, y + 35, { color: col.ink, size: 9.5, fit: false, weight: 700, align: 'center' });
      text(ctx, `${(keep * 100).toFixed(keep < 0.1 ? 1 : 0)} J`, x + bw / 2, y + 70, { color: col.s[2], size: 11.5, weight: 700, align: 'center' });
      if (i < n - 1) { arrow(ctx, x + bw + 2, y + 26, x + bw + gap - 2, y + 26, col.s[3], 2); if (gap > 14) for (let q = 0; q < 2; q++) { const f = ((t * 0.6 + q / 2) % 1); ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.arc(x + bw + f * gap, y + 26, 3, 0, 7); ctx.fill(); } }
      // heat spill downward
      if (i < n - 1) { const spill = (keep - flow(i + 1)) * 100, hh = Math.min(70, spill * 0.9 + 4); ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.6; ctx.fillRect(x + bw / 2 - 5, y + 82, 10, hh); ctx.globalAlpha = 1; text(ctx, `${spill.toFixed(spill < 10 ? 1 : 0)} J heat`, x + bw / 2, y + 90 + hh + 8, { color: col.s[1], size: 10, align: 'center' }); }
    }
    // totals bar
    const by = h - 32, tw = w - 28; ctx.fillStyle = col.s[1]; ctx.fillRect(14, by, tw, 14); ctx.fillStyle = col.s[2]; ctx.fillRect(14, by, tw * d.eff, 14);
    text(ctx, `useful ${(d.eff * 100).toFixed(0)} J | heat ${(100 - d.eff * 100).toFixed(0)} J  (sum 100 J)`, w / 2, by - 8, { color: col.ink, size: 11, weight: 700, align: 'center' });
  };
  upd();
}
