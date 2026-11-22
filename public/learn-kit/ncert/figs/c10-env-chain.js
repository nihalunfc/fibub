// Class 10 Our Environment: a food chain and the 10 per cent law. Energy enters as sunlight and is fixed by producers
// (first trophic level). At each step only about 10 per cent of the energy passes to the next trophic level; the rest is used for
// life processes or lost as heat. So food chains are short (usually 3 or 4 steps, rarely 5). Choose the length of the chain
// and the energy fixed by the producers.
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout, loop } from '../../kit.js';

const CH = {
  3: ['grass', 'deer', 'tiger'], 4: ['grass', 'grasshopper', 'frog', 'snake'], 5: ['algae', 'water flea', 'small fish', 'big fish', 'fish eagle'],
};
const ROLE = ['producer', 'herbivore', 'carnivore', 'carnivore', 'top carnivore'];
export default function (host) {
  let L = 4, E = 10000, t = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'A food chain with the energy at each trophic level falling to 10 per cent of the level before' });
  const ctl = row(host);
  choice(ctl, 'Chain', [[3, '3 levels'], [4, '4 levels'], [5, '5 levels']], L, (v) => { L = v; say(); });
  slider(ctl, { label: 'Energy fixed by producers', min: 100, max: 100000, value: E, log: true, fmt: (v) => Math.round(v).toLocaleString('en-IN') + ' J', oninput: (v) => { E = v; say(); } });
  const out = readout(host);
  loop(host, (dt) => { t += dt; cv.redraw(); }).button(ctl);
  const fmt = (v) => (v >= 10 ? Math.round(v).toLocaleString('en-IN') : v >= 1 ? v.toFixed(1) : v.toFixed(2));
  function say() { const top = E * Math.pow(0.1, L - 1); out.textContent = `Producers fix ${Math.round(E).toLocaleString('en-IN')} J. The ${CH[L][L - 1]} at the top gets only ${fmt(top)} J, which is ${(top / E * 100).toPrecision(2).replace(/\.0+$/, '')} per cent. The rest was used by the organisms below or lost as heat.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Energy flow along a food chain', col) + 10, n = L, H = h - top - 40, rowH = H / n, mx = E;
    dot(ctx, 28, top + 12, 11, col.s[3], col.ink); text(ctx, 'Sun', 28, top + 30, { color: col.muted, size: 10, align: 'center' });
    for (let i = 0; i < n; i++) {
      const e = E * Math.pow(0.1, i), y = top + 40 + i * rowH * 0.9, bw = Math.max(3, (Math.log10(e) - Math.log10(E * Math.pow(0.1, 4)) + 0.3) / 4.6 * (w * 0.5));
      // bar for energy (log scale so every level stays visible)
      ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.85; ctx.fillRect(w * 0.42, y - 10, bw * 0.9, 20); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(w * 0.42, y - 10, bw * 0.9, 20);
      text(ctx, fmt(e) + ' J', w * 0.42 + bw * 0.9 + 6, y, { color: col.ink, size: 10.5, weight: 700 });
      dot(ctx, 36, y, 13, i === 0 ? col.s[2] : col.s[1], col.ink); text(ctx, String(i + 1), 36, y, { color: col.panel, size: 11, weight: 700, align: 'center' });
      text(ctx, CH[n][i], 56, y - 4, { color: col.ink, size: 11, weight: 700 }); text(ctx, ROLE[i === n - 1 && i > 0 ? (n === 3 ? 2 : 4) : i === 0 ? 0 : Math.min(i, 2) ] , 56, y + 9, { color: col.muted, size: 9.5 });
      if (i < n - 1) { arrow(ctx, 36, y + 14, 36, y + rowH * 0.9 - 14, col.ink, 1.6, 6); const k = (t * 0.4 + i * 0.3) % 1; dot(ctx, 36 + 2, y + 14 + k * (rowH * 0.9 - 28), 3, col.s[3], col.ink);
        // heat lost
        text(ctx, '90% lost as heat', w * 0.42, y + rowH * 0.45, { color: col.muted, size: 9.5 }); for (let j = 0; j < 3; j++) { const kk = (t * 0.5 + j / 3 + i * 0.2) % 1; ctx.save(); ctx.globalAlpha = 1 - kk; line(ctx, [[w * 0.8 + j * 9, y + rowH * 0.5 - kk * 18], [w * 0.8 + j * 9 + 3, y + rowH * 0.5 - kk * 18 - 5]], col.bad || col.ink, 2); ctx.restore(); } }
    }
    text(ctx, 'bar length: log scale, so each level is 10 times shorter', w / 2, h - 10, { color: col.muted, size: 9.5, align: 'center' });
  };
  say();
}
