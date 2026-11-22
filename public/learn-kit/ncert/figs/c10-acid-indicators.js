// Class 10 Acids, Bases and Salts: indicators change colour with the kind of solution.
// Litmus: blue paper turns red in acid, red paper turns blue in base. Phenolphthalein: colourless in acid, pink in base.
// Methyl orange: red in acid, yellow in base. Turmeric: yellow in acid and neutral, red-brown in base. Colour is a
// function of the solution's pH; drops fall in and the colour fades from the old one to the new one.
import { canvas, text, title, row, choice, readout, loop, clamp, lerp } from '../../kit.js';

const SOL = { hcl: ['HCl (dilute)', 1], vin: ['Vinegar', 2.9], wat: ['Water', 7], soap: ['Soap solution', 10], naoh: ['NaOH (dilute)', 13] };
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, f) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], f))).join(',')})`; };
const IND = {
  lit: { name: 'Litmus', col: () => null },
  php: { name: 'Phenolphthalein', col: (p) => mix('#f4f4f4', '#d6277a', clamp((p - 8.2) / 1.6, 0, 1)) },
  mo: { name: 'Methyl orange', col: (p) => (p < 3.1 ? '#d8352a' : p < 4.4 ? mix('#d8352a', '#f2c230', (p - 3.1) / 1.3) : '#f2c230') },
  tur: { name: 'Turmeric', col: (p) => mix('#f0c419', '#a8381b', clamp((p - 8.2) / 1.6, 0, 1)) },
};
export default function (host) {
  let s = 'hcl', ind = 'lit', t = 0;
  const cv = canvas(host, { aspect: 0.68, max: 440, min: 290, label: 'Indicators changing colour in acid, water and base solutions' });
  const ctl = row(host);
  choice(ctl, 'Solution', Object.entries(SOL).map(([k, v]) => [k, v[0]]), s, (v) => { s = v; t = 0; say(); });
  choice(ctl, 'Indicator', Object.entries(IND).map(([k, v]) => [k, v.name]), ind, (v) => { ind = v; t = 0; say(); });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const out = readout(host);
  const nature = () => (SOL[s][1] < 6.5 ? 'an acid' : SOL[s][1] > 7.5 ? 'a base' : 'neutral');
  function say() {
    const p = SOL[s][1];
    out.innerHTML = ind === 'lit' ? `${SOL[s][0]} is ${nature()}: <b>${p < 6.5 ? 'blue litmus turns red; red stays red' : p > 7.5 ? 'red litmus turns blue; blue stays blue' : 'neither paper changes'}</b>.`
      : `${IND[ind].name} in ${SOL[s][0]} (${nature()}): the colour shows the solution is ${nature()}. Indicators tell you only acid, base or neutral, not the exact pH (use universal indicator or a pH meter for that).`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const p = SOL[s][1], f = clamp(t / 1.2, 0, 1);
    const top = title(ctx, `${IND[ind].name} in ${SOL[s][0]}`, col) + 10;
    const bw = Math.min(110, w * 0.34), bx = w * 0.3 - bw / 2, by = top + 30, bh = h - by - 24;
    const old = IND[ind].col(7);
    if (ind === 'lit') {
      ctx.fillStyle = col.soft; ctx.fillRect(bx, by + bh * 0.3, bw, bh * 0.7); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by); ctx.stroke();
      [[bx + bw * 0.3, '#2f5fc4', '#d8352a', 'blue'], [bx + bw * 0.7, '#d8352a', '#2f5fc4', 'red']].forEach(([x, c0, c1, lab], i) => {
        const to = i === 0 ? (p < 6.5 ? c1 : c0) : (p > 7.5 ? c1 : c0), dip = clamp((t - 0.2) / 0.5, 0, 1), y0 = by - 20 + dip * (bh * 0.45), c = mix(c0, to, clamp((t - 0.7) / 0.8, 0, 1));
        ctx.fillStyle = mix(c0, c0, 0); ctx.fillRect(x - 7, y0, 14, bh * 0.6); ctx.fillStyle = c; ctx.fillRect(x - 7, y0 + bh * 0.6 - Math.min(bh * 0.6, dip * bh * 0.45 + 2), 14, Math.min(bh * 0.6, dip * bh * 0.45 + 2));
        ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(x - 7, y0, 14, bh * 0.6); text(ctx, lab, x, by - 28, { color: col.muted, size: 9.5, align: 'center' });
      });
    } else {
      const c = mix('#f8f8f8', '#f8f8f8', 0), newc = IND[ind].col(p);
      const dropY = by - 20 + clamp(t / 0.5, 0, 1) * 40;
      ctx.fillStyle = t < 0.5 ? col.soft : (t < 1.7 ? col.soft : col.soft); ctx.fillRect(bx, by + bh * 0.3, bw, bh * 0.7);
      ctx.save(); ctx.globalAlpha = 0.9 * clamp((t - 0.4) / 1, 0, 1); ctx.fillStyle = newc; ctx.fillRect(bx, by + bh * 0.3, bw, bh * 0.7); ctx.restore();
      ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by); ctx.stroke();
      if (t < 0.5) { ctx.fillStyle = IND[ind].col(14) === '#' ? col.ink : mix('#d6277a', '#d6277a', 0); ctx.beginPath(); ctx.arc(bx + bw / 2, dropY, 4, 0, 7); ctx.fill(); }
      text(ctx, 'a few drops of indicator', bx + bw / 2, by - 22, { color: col.muted, size: 10, align: 'center' });
    }
    // colour key on the right
    const kx = w * 0.58, kw = w * 0.36, ky = top + 22;
    text(ctx, 'pH 0 → 14', kx, ky, { color: col.muted, size: 10.5 });
    for (let i = 0; i < kw; i++) { const pp = (i / kw) * 14; ctx.fillStyle = ind === 'lit' ? (pp < 5 ? '#d8352a' : pp > 8 ? '#2f5fc4' : '#8a4fa5') : IND[ind].col(pp); ctx.fillRect(kx + i, ky + 10, 1.2, 28); }
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(kx, ky + 10, kw, 28);
    const mx = kx + (p / 14) * kw; ctx.beginPath(); ctx.moveTo(mx, ky + 44); ctx.lineTo(mx - 5, ky + 54); ctx.lineTo(mx + 5, ky + 54); ctx.fillStyle = col.ink; ctx.fill();
    text(ctx, `pH ${p}`, mx, ky + 66, { color: col.ink, size: 11, weight: 700, align: 'center' });
    text(ctx, ind === 'lit' ? 'red below 5, blue above 8' : ind === 'php' ? 'colourless below 8.2, pink above' : ind === 'mo' ? 'red below 3.1, yellow above 4.4' : 'yellow, turns red-brown in base', kx, ky + 92, { color: col.muted, size: 10 });
  };
  say();
}
