// Measuring biodiversity. Slide the number of individuals of five species in a community. Richness counts the species;
// the Shannon index H = −Σ p·ln p and Simpson's index 1 − Σp² also reward evenness. Two communities can have the same richness
// but very different diversity: try "One species dominates" against "Even".
import { canvas, row, slider, choice, button, readout, text, title } from '../kit.js';

const NAMES = ['Species A', 'Species B', 'Species C', 'Species D', 'Species E'];
const PRE = { even: [20, 20, 20, 20, 20], dom: [88, 4, 3, 3, 2], mono: [100, 0, 0, 0, 0], mid: [40, 25, 15, 12, 8] };
export default function (host) {
  let n = PRE.mid.slice();
  const cv = canvas(host, { aspect: 0.8, max: 350, min: 280, label: 'Five species with chosen numbers of individuals and their diversity indices' });
  const c = row(host), sl = [];
  choice(c, 'Community', [['even', 'Even'], ['mid', 'Typical'], ['dom', 'One species dominates'], ['mono', 'Monoculture']], 'mid', (v) => { n = PRE[v].slice(); sl.forEach((s, i) => s.set(n[i])); show(); });
  NAMES.forEach((nm, i) => sl.push(slider(row(host), { label: nm, min: 0, max: 100, step: 1, value: n[i], fmt: (v) => `${v}`, oninput: (v) => { n[i] = v; show(); } })));
  const out = readout(host);
  const calc = () => { const T = n.reduce((a, b) => a + b, 0) || 1, p = n.map((v) => v / T), S = n.filter((v) => v > 0).length, H = -p.reduce((a, q) => a + (q > 0 ? q * Math.log(q) : 0), 0), D = 1 - p.reduce((a, q) => a + q * q, 0); return { T, p, S, H, D, E: S > 1 ? H / Math.log(S) : 0 }; };
  function show() { const r = calc(); out.innerHTML = `Richness S = <b>${r.S}</b> species, ${r.T} individuals. Shannon H = <b>${r.H.toFixed(2)}</b> (maximum for ${r.S} species is ${r.S > 1 ? Math.log(r.S).toFixed(2) : '0'}). Simpson 1 − D = <b>${r.D.toFixed(2)}</b>. Evenness = <b>${r.E.toFixed(2)}</b>. More species and a more even spread give higher diversity.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const r = calc(); title(ctx, 'Share of each species', col);
    const bw = (w - 24) / 5, B = h - 56, T = 44;
    r.p.forEach((q, i) => { const x = 12 + i * bw, bh = q * (B - T); ctx.fillStyle = col.s[i]; ctx.fillRect(x + 6, B - bh, bw - 12, bh); text(ctx, `${Math.round(q * 100)}%`, x + bw / 2, B - bh - 9, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, NAMES[i].replace('Species ', 'sp. '), x + bw / 2, B + 12, { color: col.muted, size: 10, align: 'center' }); });
    ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(10, B); ctx.lineTo(w - 10, B); ctx.stroke();
    const mh = r.S > 1 ? Math.log(r.S) : 0; text(ctx, `H = ${r.H.toFixed(2)}`, 12, h - 12, { color: col.s[0], size: 13, weight: 700 }); text(ctx, `1 − D = ${r.D.toFixed(2)}`, w * 0.4, h - 12, { color: col.s[2], size: 13, weight: 700 }); text(ctx, `S = ${r.S}`, w - 12, h - 12, { color: col.ink, size: 13, weight: 700, align: 'right' });
  };
  show();
}
