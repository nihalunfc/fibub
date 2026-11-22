// Class 12 Biology, Biodiversity and Conservation: "the evil quartet", the four main causes of biodiversity loss: habitat loss and fragmentation, over-exploitation,
// alien species invasions and co-extinctions. A simple illustrative model: habitat loss removes species following the species-area law (S ~ A^0.25), the other three remove
// a fraction of the species that are left. The sliders are scenarios, not measured data.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let hab = 40, ov = 10, al = 10, co = 10;
  const cv = canvas(host, { aspect: 0.74, max: 440, min: 280, label: 'A bar showing the share of species that remain after habitat loss, over-exploitation, alien species and co-extinction' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'habitat lost', min: 0, max: 95, step: 5, value: 40, fmt: (v) => v + ' %', oninput: (v) => { hab = v; go(); } });
  slider(ctl, { label: 'over-exploitation', min: 0, max: 50, step: 5, value: 10, fmt: (v) => v + ' %', oninput: (v) => { ov = v; go(); } });
  slider(ctl, { label: 'alien invasion', min: 0, max: 50, step: 5, value: 10, fmt: (v) => v + ' %', oninput: (v) => { al = v; go(); } });
  slider(ctl, { label: 'dependent species lost', min: 0, max: 50, step: 5, value: 10, fmt: (v) => v + ' %', oninput: (v) => { co = v; go(); } });
  const steps = () => { const s0 = 100, s1 = s0 * Math.pow(1 - hab / 100, 0.25), s2 = s1 * (1 - ov / 100), s3 = s2 * (1 - al / 100), s4 = s3 * (1 - co / 100); return [s0, s1, s2, s3, s4]; };
  const go = () => { const s = steps(); ro.textContent = `Of 100 species, about ${s[4].toFixed(0)} are left (${(100 - s[4]).toFixed(0)} lost). Habitat loss alone costs ${(s[0] - s[1]).toFixed(0)}, over-exploitation ${(s[1] - s[2]).toFixed(0)}, alien species ${(s[2] - s[3]).toFixed(0)} and co-extinction ${(s[3] - s[4]).toFixed(0)}. Habitat loss is usually the biggest: that is why protecting habitats matters most.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'The evil quartet', col) + 10, s = steps(), bw = (w - 40) / 5, base = h - 54, Y = (v) => base - (v / 100) * (base - top - 14);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(14, base); ctx.lineTo(w - 14, base); ctx.stroke();
    const items = [['start', 0, s[0], col.s[0]], ['habitat', s[1], s[0] - s[1], col.bad], ['harvest', s[2], s[1] - s[2], col.warn], ['aliens', s[3], s[2] - s[3], col.s[4]], ['co-extinct', s[4], s[3] - s[4], col.s[2]]];
    items.forEach(([n, b, v, c], i) => { const x = 20 + i * bw + 4; ctx.fillStyle = c; ctx.globalAlpha = 0.85; ctx.fillRect(x, Y(b + v), bw - 8, Math.max(1, Y(b) - Y(b + v))); ctx.globalAlpha = 1; text(ctx, i === 0 ? '100' : '−' + v.toFixed(0), x + (bw - 8) / 2, Y(b + v) - 8, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, n, x + (bw - 8) / 2, base + 14, { color: col.ink, size: 10, weight: 700, align: 'center' }); });
    ctx.fillStyle = col.good; ctx.globalAlpha = 0.25; ctx.fillRect(14, Y(s[4]), w - 28, 2); ctx.globalAlpha = 1; text(ctx, `${s[4].toFixed(0)} left`, w - 16, Y(s[4]) + 16, { color: col.good, size: 11, weight: 800, align: 'right' });
    text(ctx, 'illustrative scenario, not field data', w / 2, h - 10, { color: col.muted, size: 10, align: 'center' });
  };
  go();
}
