// Class 12 Chemistry, Biomolecules: how open-chain glucose closes into a six-membered ring (step player).
// The C5-OH adds to the aldehyde C=O (C1) to make a cyclic hemiacetal (pyranose ring). The new OH on C1 can point down (alpha) or up (beta); the two forms are anomers and interconvert through the open chain (mutarotation).
// At equilibrium in water about 36 % alpha, 64 % beta and under 0.02 % open chain. Haworth drawing: OH on C2 down, C3 up, C4 down, CH2OH on C5 up (D-glucose).
import { canvas, text, title, loop, ease, lerp } from '../../kit.js';

const TT = ['D-glucose: the open chain', 'The chain curls round', 'C5–OH attacks the aldehyde carbon', 'Two ring forms: α and β', 'Mutarotation: they interconvert'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 400, min: 320, label: 'Glucose closing from the open chain to the six-membered ring, with alpha and beta anomers' });
  loop(host, (dt) => { t = Math.min(1, t + dt * 0.7); cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col), e = step === 1 ? ease(t) : step === 0 ? 0 : 1, cx = w * 0.56, cy = top + (h - top - 58) * 0.5 + 8, R = Math.min(w * 0.2, 62);
    const dy = (h - top - 110) / 5, chain = (i) => [w * 0.2, top + 26 + i * dy];
    const ang = (k) => (-90 + 60 * k) * Math.PI / 180, ring = (k) => [cx + R * Math.cos(ang(k)), cy + R * Math.sin(ang(k))];
    const P = [0, 1, 2, 3, 4].map((i) => { const a = chain(i), b = ring(i + 1); return [lerp(a[0], b[0], e), lerp(a[1], b[1], e)]; });
    const Oc = chain(4), Or = ring(0), O = [lerp(Oc[0] + 34, Or[0], e), lerp(Oc[1], Or[1], e)];
    const C6 = [lerp(chain(5)[0], P[4][0] - 6, e), lerp(chain(5)[1], P[4][1] - 34, e)];
    const ln = (a, b, c = col.ink, wd = 2.4, dash) => { ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = wd; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore(); };
    for (let i = 0; i < 4; i++) ln(P[i], P[i + 1]);
    ln(P[4], C6); const closed = step >= 2; ln(P[4], O, closed ? col.ink : col.muted, 2.4, closed ? null : [4, 3]); if (closed) ln(O, P[0], col.s[1], 3);
    const dot = (p, label, c = col.ink, r = 12) => { ctx.fillStyle = col.panel; ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, 7); ctx.fill(); text(ctx, label, p[0], p[1], { color: c, size: 11.5, weight: 700, align: 'center' }); };
    P.forEach((p, i) => dot(p, 'C' + (i + 1), step === 0 && i === 0 ? col.s[3] : col.ink)); dot(O, 'O', col.s[3]); text(ctx, 'C6', C6[0], C6[1], { color: col.ink, size: 11.5, weight: 700, align: 'center', halo: col.panel });
    const lab = (s, p, dx, dy2, c = col.muted) => text(ctx, s, p[0] + dx, p[1] + dy2, { color: c, size: 10.5, weight: 700, align: 'center', halo: col.panel });
    if (e < 0.5) { lab('=O (CHO)', P[0], 38, 0, col.s[3]); lab('OH', P[1], 22, 0); lab('OH', P[2], -22, 0); lab('OH', P[3], 22, 0); lab('(C5)OH', Oc, 0, 0, col.s[3]); lab('CH₂OH', C6, 30, 0); }
    else { lab('OH', P[1], 18, 14); lab('OH', P[2], -10, 16); lab('OH', P[3], -10, 16); lab('CH₂OH', C6, 0, -14); }
    if (step >= 3) { lab('OH (β, up)', P[0], 34, -24, col.s[1]); lab('OH (α, down)', P[0], 44, 24, col.s[3]); }
    if (step === 2) lab('new bond', [(O[0] + P[0][0]) / 2, (O[1] + P[0][1]) / 2], 34, -8, col.s[1]);
    const N = (a, b) => { text(ctx, a, w / 2, h - 40, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, b, w / 2, h - 22, { color: col.muted, size: 11, align: 'center' }); };
    if (step === 0) N('Six carbons: C1 is an aldehyde (CHO), C2 to C5 carry OH, C6 is CH₂OH.', 'In water most of the time it is NOT in this form.');
    if (step === 1) N('Bond rotations bring the C5 hydroxyl close to C1.', 'Rotating about single bonds is free; no bond has yet broken.');
    if (step === 2) N('The O of C5–OH adds to C1=O: a hemiacetal forms and the ring closes.', 'A six-membered ring (5 C + 1 O) is called a pyranose.');
    if (step === 3) N('The C1 carbon now has a new OH: down (α) or up (β).', 'These two forms are anomers; C1 is the anomeric carbon.');
    if (step === 4) { N('Each ring can open and close again, so α ⇌ open chain ⇌ β.', 'At equilibrium: 36 % α, 64 % β, under 0.02 % open chain. This is mutarotation.'); const bx = w * 0.12, by = h - 62; [['α 36 %', 0.36, col.s[3]], ['β 64 %', 0.64, col.s[1]]].forEach(([s, f, c], i) => { ctx.fillStyle = c; ctx.fillRect(bx + (i ? w * 0.76 * 0.36 : 0), by, w * 0.76 * f, 8); }); text(ctx, 'α', bx + w * 0.76 * 0.18, by - 7, { color: col.s[3], size: 10.5, weight: 700, align: 'center' }); text(ctx, 'β', bx + w * 0.76 * 0.68, by - 7, { color: col.s[1], size: 10.5, weight: 700, align: 'center' }); }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); t = 0; cv.redraw(); } };
}
