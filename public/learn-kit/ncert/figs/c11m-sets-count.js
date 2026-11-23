// Class 11 Maths, Sets: the counting rule n(A ∪ B) = n(A) + n(B) − n(A ∩ B). Adding n(A) and n(B) counts the overlap twice, so one copy is taken away.
// Drag the three sliders (people in A only, in both, in B only) and see each count and the group of people who like neither.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let a = 20, both = 10, b = 15; const TOT = 60;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 290, label: 'A Venn diagram of a class of 60 students with counts in each region and the inclusion-exclusion sum' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Chai (A) and coffee (B) in a class of 60', col), nA = a + both, nB = b + both, uni = a + b + both, none = TOT - uni;
    const R = Math.min(w * 0.22, 80), cy = top + 32 + R, d = R * 1.15, cA = w / 2 - d / 2, cB = w / 2 + d / 2;
    ctx.strokeStyle = col.muted; ctx.strokeRect(6, top + 4, w - 12, 2 * R + 56);
    ctx.globalAlpha = 0.28; ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.arc(cA, cy, R, 0, 7); ctx.fill(); ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.arc(cB, cy, R, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
    ctx.lineWidth = 2; ctx.strokeStyle = col.s[0]; ctx.beginPath(); ctx.arc(cA, cy, R, 0, 7); ctx.stroke(); ctx.strokeStyle = col.s[2]; ctx.beginPath(); ctx.arc(cB, cy, R, 0, 7); ctx.stroke();
    const lab = (s, x, c) => text(ctx, String(s), x, cy, { color: c, size: 20, weight: 800, align: 'center' });
    lab(a, (cA - R + cB - R) / 2 + 0, col.ink); lab(both, (cA + cB) / 2, col.ink); lab(b, (cA + R + cB + R) / 2, col.ink);
    text(ctx, 'only A', (cA - R + cB - R) / 2, cy + 18, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, 'both', (cA + cB) / 2, cy + 18, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, 'only B', (cA + R + cB + R) / 2, cy + 18, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, `neither: ${none}`, w - 16, top + 18, { color: col.ink, size: 13, weight: 700, align: 'right' });
    const y = cy + R + 46;
    text(ctx, `n(A) + n(B) = ${nA} + ${nB} = ${nA + nB}`, 12, y, { color: col.ink, size: 13, weight: 600 });
    text(ctx, `the ${both} in the overlap were counted twice`, 12, y + 20, { color: col.bad, size: 12, weight: 600 });
    text(ctx, `n(A ∪ B) = ${nA + nB} − ${both} = ${uni}`, 12, y + 42, { color: col.s[0], size: 14, weight: 800 });
    out.innerHTML = none < 0 ? '<b>Too many students: the groups add to more than 60.</b>' : `Of 60 students, <b>${uni}</b> like at least one drink and <b>${none}</b> like neither (60 − ${uni}).`;
  };
  const r = row(host), ch = () => { if (a + b + both > TOT) { /* readout warns */ } cv.redraw(); };
  slider(r, { label: 'Only chai', min: 0, max: 30, step: 1, value: a, fmt: (v) => v, oninput: (v) => { a = v; ch(); } });
  slider(r, { label: 'Both', min: 0, max: 20, step: 1, value: both, fmt: (v) => v, oninput: (v) => { both = v; ch(); } });
  slider(r, { label: 'Only coffee', min: 0, max: 30, step: 1, value: b, fmt: (v) => v, oninput: (v) => { b = v; ch(); } });
  cv.redraw();
}
