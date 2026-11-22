// Class 10 Life Processes (step player): the journey of a meal along the alimentary canal. Mouth: salivary amylase starts
// starch -> sugar. Oesophagus: peristalsis pushes the food down. Stomach: HCl (pH about 2) and pepsin start protein
// digestion; mucus protects the wall. Small intestine: bile emulsifies fats, pancreatic and intestinal enzymes finish
// carbohydrates, proteins and fats; villi absorb. Large intestine absorbs water; undigested waste leaves.
import { canvas, text, title, line, dot, loop, clamp } from '../../kit.js';

const S = [
  { n: 'Mouth', x: 0.22, y: 0.1, e: 'Teeth chew; saliva wets the food. Salivary amylase turns starch into sugar (maltose).', tag: 'starch → sugar' },
  { n: 'Oesophagus', x: 0.22, y: 0.28, e: 'No digestion here. Muscles squeeze in waves (peristalsis) and push the food down.', tag: 'peristalsis' },
  { n: 'Stomach', x: 0.56, y: 0.4, e: 'Churns the food with gastric juice: hydrochloric acid (kills germs, makes the pH right) and the enzyme pepsin, which starts digesting proteins. Mucus protects the wall.', tag: 'protein → peptides' },
  { n: 'Small intestine: first part', x: 0.4, y: 0.58, e: 'Bile from the liver makes fat into tiny droplets (emulsification). Pancreatic juice: trypsin (proteins), lipase (fats), amylase (starch).', tag: 'fats, proteins, starch' },
  { n: 'Small intestine: absorption', x: 0.62, y: 0.66, e: 'Intestinal juice finishes the job: glucose, amino acids and fatty acids. Finger-like villi with blood vessels absorb them into the blood.', tag: 'absorption' },
  { n: 'Large intestine', x: 0.5, y: 0.8, e: 'Absorbs water and salts from the undigested food. The rest is stored in the rectum.', tag: 'water absorbed' },
  { n: 'Anus', x: 0.45, y: 0.93, e: 'Undigested waste leaves the body (egestion).', tag: 'egestion' },
];
const PATH = [[0.22, 0.06], [0.22, 0.3], [0.5, 0.3], [0.62, 0.4], [0.5, 0.48], [0.3, 0.52], [0.7, 0.54], [0.3, 0.6], [0.7, 0.64], [0.3, 0.7], [0.7, 0.74], [0.8, 0.8], [0.2, 0.84], [0.2, 0.9], [0.45, 0.96]];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 1.05, max: 440, min: 290, label: 'A meal travelling along the gut with the enzymes and juices at each stage' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, S[step].n + ': ' + S[step].tag, col) + 4, ph = h - top - 56, X = (f) => f * w, Y = (f) => top + f * ph;
    // tube
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = col.s[1]; ctx.globalAlpha = 0.25; ctx.lineWidth = 16; ctx.beginPath(); PATH.forEach(([a, b], i) => (i ? ctx.lineTo(X(a), Y(b)) : ctx.moveTo(X(a), Y(b)))); ctx.stroke();
    ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.2; ctx.beginPath(); PATH.forEach(([a, b], i) => (i ? ctx.lineTo(X(a), Y(b)) : ctx.moveTo(X(a), Y(b)))); ctx.stroke(); ctx.restore();
    // stomach bulb
    ctx.save(); ctx.globalAlpha = step === 2 ? 0.55 : 0.2; ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.ellipse(X(0.56), Y(0.37), w * 0.13, ph * 0.08, 0.5, 0, 7); ctx.fill(); ctx.restore();
    // liver / pancreas hints
    ctx.fillStyle = col.s[5]; ctx.globalAlpha = step === 3 ? 0.6 : 0.2; ctx.fillRect(X(0.74), Y(0.44), w * 0.17, ph * 0.07); ctx.globalAlpha = 1;
    text(ctx, 'liver (bile)', X(0.82), Y(0.41), { color: col.muted, size: 9.5, align: 'center' });
    ctx.fillStyle = col.s[4]; ctx.globalAlpha = step === 3 ? 0.6 : 0.2; ctx.fillRect(X(0.74), Y(0.56), w * 0.17, ph * 0.05); ctx.globalAlpha = 1;
    text(ctx, 'pancreas', X(0.82), Y(0.64), { color: col.muted, size: 9.5, align: 'center' });
    // food blob follows the step
    const s = S[step], f = (step + 0.5) / S.length;
    const P = PATH, idx = Math.min(P.length - 2, Math.floor(f * (P.length - 1))), u = f * (P.length - 1) - idx;
    const bx = (P[idx][0] + (P[idx + 1][0] - P[idx][0]) * u), by = (P[idx][1] + (P[idx + 1][1] - P[idx][1]) * u);
    const pr = 5 + Math.sin(t * 4) * 1.2, jx = Math.sin(t * 5) * 2;
    ctx.fillStyle = col.s[1]; ctx.beginPath(); ctx.arc(X(s.x) + jx, Y(s.y), pr + 3, 0, 7); ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.stroke();
    const SH = ['Mouth', 'Oesophagus', 'Stomach', 'Duodenum', 'Small intestine', 'Large intestine', 'Anus'];
    S.forEach((o, i) => { if (i === step) return; dot(ctx, X(o.x), Y(o.y), 3, col.muted); text(ctx, SH[i], X(o.x) + (o.x < 0.4 ? 8 : -8), Y(o.y) + (i === 3 ? -9 : 0), { color: col.muted, size: 9.5, align: o.x < 0.4 ? 'left' : 'right', halo: col.panel }); });
    // enzyme labels
    const lab = ['salivary amylase', 'peristalsis ↓', 'HCl + pepsin', 'bile · lipase · trypsin', 'villi absorb', 'water absorbed', 'waste out'][step];
    text(ctx, lab, X(s.x) + (s.x > 0.5 ? -14 : 14), Y(s.y) - 14, { color: col.s[7], size: 11, weight: 700, align: s.x > 0.5 ? 'right' : 'left', halo: col.panel });
    const words = s.e.split(' '); let l1 = '', l2 = '', l3 = ''; words.forEach((wd) => { if ((l1 + ' ' + wd).length < w / 6.1 && !l2) l1 = (l1 + ' ' + wd).trim(); else if ((l2 + ' ' + wd).length < w / 6.1 && !l3) l2 = (l2 + ' ' + wd).trim(); else l3 = (l3 + ' ' + wd).trim(); });
    [l1, l2, l3].forEach((l, i) => l && text(ctx, l, w / 2, h - 46 + i * 14, { color: col.ink, size: 10.5, align: 'center' }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, S.length - 1); cv.redraw(); } };
}
