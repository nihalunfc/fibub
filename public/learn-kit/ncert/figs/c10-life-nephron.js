// Class 10 Life Processes (step player): the nephron, the filtering unit of the kidney. Each kidney has about a million.
// Blood plasma is filtered at the glomerulus into the Bowman's capsule (about 125 mL/min, 180 L a day). Useful things
// (glucose, amino acids, salts, most water) are reabsorbed in the tubule. What is left (urea, extra salts, about 1.5 L of
// water a day) is urine. Bars show the volume left in the tubule at each stage; values are typical for an adult.
import { canvas, text, title, line, dot, loop } from '../../kit.js';

const L = [180, 180, 45, 1.5, 1.5];
const N = ['Blood arrives with urea', 'Filtration in the glomerulus', 'Selective reabsorption', 'Water balance (collecting duct)', 'Urine leaves'];
const C = ['A renal artery carries blood containing urea, a waste made from the breakdown of proteins in the liver, into the kidney.', 'Under pressure the glomerulus (a ball of capillaries) pushes water, glucose, salts and urea into the Bowman’s capsule: 180 litres a day. Blood cells and big proteins stay in the blood.', 'The tubule takes back the useful things: all the glucose and amino acids, most salts and about three-quarters of the water. Urea stays.', 'The collecting duct takes back more water if you are thirsty (the hormone ADH controls this); little if you drank a lot. Finally the volume is only about 1.5 L.', 'Urine (urea, extra salts, water) flows by the ureter to the bladder, is stored, and leaves through the urethra.'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 290, label: 'A nephron filtering blood: filtration, reabsorption and urine with volumes' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, N[step], col) + 6, bx = w * 0.06, by = top + 10, tw = w * 0.56, th = h - top - 96;
    // capillary ball + capsule
    const gx = bx + 38, gy = by + 28;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(gx, gy, 26, 0.2, 6.1); ctx.stroke(); text(ctx, 'capsule', gx, gy - 34, { color: col.muted, size: 9.5, align: 'center' });
    ctx.strokeStyle = col.s[7]; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(gx - 4, gy, 12, 0, 7); ctx.stroke(); text(ctx, 'blood', gx - 4, gy, { color: col.s[7], size: 8, weight: 700, align: 'center', fit: false });
    // tubule path
    const P = [[gx + 26, gy], [gx + 26, gy + 30], [bx + 200 * w / 440, by + 70], [bx + 200 * w / 440, by + th * 0.6], [bx + 90 * w / 440, by + th * 0.45], [bx + 130 * w / 440, by + th - 8], [w * 0.62, by + th - 8]];
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = col.s[0]; ctx.globalAlpha = 0.3; ctx.lineWidth = 14; ctx.beginPath(); P.forEach(([a, b], i) => (i ? ctx.lineTo(a, b) : ctx.moveTo(a, b))); ctx.stroke(); ctx.globalAlpha = 1; ctx.lineWidth = 1.3; ctx.strokeStyle = col.ink; ctx.stroke(); ctx.restore();
    // particles
    const lvl = step; const nW = [0, 1, 1, 1, 1][step] * [0, 12, 12, 8, 3][step];
    if (step >= 1) for (let i = 0; i < 10; i++) { const f = ((t * 0.12 + i / 10) % 1) * (P.length - 1), idx = Math.min(P.length - 2, Math.floor(f)), u = f - idx; const x = P[idx][0] + (P[idx + 1][0] - P[idx][0]) * u, y = P[idx][1] + (P[idx + 1][1] - P[idx][1]) * u; const urea = i % 3 === 0; const gone = !urea && ((step >= 2 && f > 2 && i % 4 !== 0) || (step >= 3 && f > 4 && i % 2 === 0)); if (gone) { dot(ctx, x + 14 + (f - 2) * 3, y, 3, col.s[2]); continue; } dot(ctx, x, y, urea ? 4.5 : 3.6, urea ? col.s[1] : col.s[0]); }
    if (step === 0) for (let i = 0; i < 6; i++) { const f = ((t * 0.3 + i / 6) % 1); dot(ctx, gx - 40 + f * 40, gy + 30 - f * 30, 3.5, i % 2 ? col.s[1] : col.s[7]); }
    // labels
    const lb = [['', ''], ['', 'glomerulus: filtration'], ['tubule: reabsorption', ''], ['collecting duct', ''], ['to ureter', '']];
    text(ctx, 'proximal tubule', bx + 6, by + th * 0.45 + 6, { color: col.muted, size: 9.5 }); text(ctx, 'loop of Henle', bx + 6, by + th * 0.9 - 4, { color: col.muted, size: 9.5 }); text(ctx, 'collecting duct →', w * 0.4, by + th + 8, { color: col.muted, size: 9.5 });
    // volume bar
    const vx = w * 0.7, vw = w * 0.24, vh = th, v = L[step];
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(vx, by, vw, vh); const frac = Math.log10(v + 1) / Math.log10(181); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.5; ctx.fillRect(vx, by + vh * (1 - frac), vw, vh * frac); ctx.globalAlpha = 1;
    text(ctx, 'volume in the tubule', vx + vw / 2, by - 4, { color: col.muted, size: 9, align: 'center' }); text(ctx, v + ' L/day', vx + vw / 2, by + vh * (1 - frac) - 8, { color: col.ink, size: 11, weight: 700, align: 'center' });
    text(ctx, '● urea  ● water, glucose, salts', w / 2, by + th + 24, { color: col.muted, size: 9.5, align: 'center' });
    const words = C[step].split(' '); let ls = ['', '', '']; let k = 0; words.forEach((wd) => { if ((ls[k] + ' ' + wd).length > w / 5.9 && k < 2) k++; ls[k] = (ls[k] + ' ' + wd).trim(); });
    ls.forEach((l, i) => l && text(ctx, l, w / 2, h - 36 + i * 13, { color: col.ink, size: 10, align: 'center' }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
