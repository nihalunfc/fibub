// Class 11 Biology, Morphology of Flowering Plants: the flower and the position of the ovary. A flower has four whorls on the thalamus: calyx (sepals), corolla (petals), androecium (stamens) and gynoecium (carpels).
// Slide to add whorls one at a time. The ovary is superior (hypogynous: other whorls below it), half-inferior (perigynous: round it) or inferior (epigynous: the whorls sit above it).
import { canvas, text, title, row, choice, slider, readout } from '../../kit.js';
import { ell, rr, note, poly } from '../c11b-lib.js';

const W = ['Calyx (sepals)', 'Corolla (petals)', 'Androecium (stamens)', 'Gynoecium (carpels)'];
export default function (host) {
  let n = 4, pos = 'hyp';
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 300, label: 'Longitudinal section of a flower showing four whorls and three ovary positions' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'whorls shown', min: 1, max: 4, step: 1, value: n, fmt: (v) => v + ' of 4', oninput: (v) => { n = v; go(); } });
  choice(ctl, 'Ovary position', [['hyp', 'Superior (hypogynous)'], ['per', 'Half-inferior (perigynous)'], ['epi', 'Inferior (epigynous)']], pos, (v) => { pos = v; go(); });
  const EX = { hyp: 'Superior ovary, hypogynous flower: ovary on top, sepals, petals and stamens attached below it. Mustard, China rose, brinjal.', per: 'Half-inferior ovary, perigynous flower: the other whorls sit round the ovary on the rim of a cup. Rose, plum, peach.', epi: 'Inferior ovary, epigynous flower: the other whorls are attached above the ovary. Guava, cucumber, sunflower (ray florets).' };
  const go = () => { ro.textContent = `Showing: ${W.slice(0, n).join(', ')}. ${EX[pos]}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const y0 = title(ctx, 'Longitudinal section of a flower', col), cx = w / 2, base = y0 + 190, th = 22;
    ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.9; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx - 6, h - 36); ctx.lineTo(cx - 6, base + 10); ctx.lineTo(cx + 6, base + 10); ctx.lineTo(cx + 6, h - 36); ctx.fill(); ctx.stroke(); ctx.globalAlpha = 1;
    // thalamus shapes
    const tTop = pos === 'epi' ? base - 56 : pos === 'per' ? base - 30 : base - 8;
    if (pos === 'hyp') { rr(ctx, cx - 30, base - 8, 60, 22, 8, col.s[4], col.ink, 1.5); }
    if (pos === 'per') { ctx.beginPath(); ctx.moveTo(cx - 52, base - 36); ctx.quadraticCurveTo(cx - 40, base + 20, cx, base + 20); ctx.quadraticCurveTo(cx + 40, base + 20, cx + 52, base - 36); ctx.lineTo(cx + 40, base - 36); ctx.quadraticCurveTo(cx + 30, base, cx, base); ctx.quadraticCurveTo(cx - 30, base, cx - 40, base - 36); ctx.closePath(); ctx.fillStyle = col.s[4]; ctx.globalAlpha = 0.7; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.stroke(); }
    if (pos === 'epi') { ctx.beginPath(); ctx.moveTo(cx - 36, base - 54); ctx.lineTo(cx - 36, base + 14); ctx.lineTo(cx + 36, base + 14); ctx.lineTo(cx + 36, base - 54); ctx.closePath(); ctx.fillStyle = col.s[4]; ctx.globalAlpha = 0.55; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.stroke(); }
    // gynoecium
    const gb = pos === 'hyp' ? base - 8 : pos === 'per' ? base - 2 : base - 54, gh = pos === 'epi' ? 0 : 34;
    const ovTop = pos === 'epi' ? base - 40 : pos === 'per' ? base - 36 : base - 42;
    const carpel = () => { if (pos === 'epi') { ell(ctx, cx, base - 16, 20, 26, col.s[2], col.ink, 1.8, 0.55); [[-6, -8], [6, -8], [0, 4]].forEach(([a, b]) => ell(ctx, cx + a, base - 16 + b, 3, 3, ink(col), null, 0)); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, base - 42); ctx.lineTo(cx, base - 84); ctx.stroke(); ell(ctx, cx, base - 88, 6, 4, col.s[3], col.ink, 1.2); } else { const bb = pos === 'hyp' ? base - 8 : base - 6; ell(ctx, cx, bb - 18, 18, 22, col.s[2], col.ink, 1.8, 0.55); [[-5, -6], [5, -6], [0, 4]].forEach(([a, b]) => ell(ctx, cx + a, bb - 18 + b, 3, 3, ink(col), null, 0)); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, bb - 40); ctx.lineTo(cx, bb - 76); ctx.stroke(); ell(ctx, cx, bb - 80, 6, 4, col.s[3], col.ink, 1.2); } };
    const ink = (c) => c.ink;
    const attachY = pos === 'epi' ? base - 56 : pos === 'per' ? base - 36 : base + 2, ax = pos === 'per' ? 46 : pos === 'epi' ? 34 : 26;
    if (n >= 1) for (const sg of [-1, 1]) { ctx.save(); ctx.translate(cx + sg * ax, attachY); ctx.rotate(sg * 0.75); ell(ctx, 0, -18, 7, 20, col.s[1], col.ink, 1.4, 0.7); ctx.restore(); }
    if (n >= 2) for (const sg of [-1, 1]) { ctx.save(); ctx.translate(cx + sg * (ax + 4), attachY - 2); ctx.rotate(sg * 0.35); ell(ctx, 0, -34, 11, 34, col.s[5], col.ink, 1.4, 0.75); ctx.restore(); }
    if (n >= 3) for (const sg of [-1, 1]) { const sx = cx + sg * (ax - 10), sy = attachY - 4; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + sg * 8, sy - 44); ctx.stroke(); rr(ctx, sx + sg * 8 - 5, sy - 56, 10, 14, 4, col.s[4], col.ink, 1.3); }
    if (n >= 4) carpel();
    if (n < 4 && pos !== 'hyp') { /* thalamus is visible without the carpel */ }
    text(ctx, 'thalamus', cx + 44, h - 50, { color: col.muted, size: 10.5 });
    [['sepal', col.s[1], 0], ['petal', col.s[5], 1], ['stamen', col.s[4], 2], ['carpel', col.s[2], 3]].forEach(([nm, c, i]) => { const on = n > i; rr(ctx, 12 + i * ((w - 24) / 4), h - 20, 10, 10, 2, on ? c : col.soft, col.line); text(ctx, nm, 26 + i * ((w - 24) / 4), h - 15, { color: on ? col.ink : col.muted, size: 10.5 }); });
  };
  go();
}
