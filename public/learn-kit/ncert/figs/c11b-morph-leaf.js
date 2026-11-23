// Class 11 Biology, Morphology of Flowering Plants: the leaf. Venation is the pattern of veins: reticulate (a net; dicots) or parallel (monocots). A simple leaf has one blade; a compound leaf has the blade cut into leaflets,
// pinnately along a rachis (neem) or palmately from one point (silk cotton). A leaf has a bud in its axil; a leaflet does not. Switch venation and leaf type.
import { canvas, text, title, row, choice, readout } from '../../kit.js';
import { ell, note, poly, curve } from '../c11b-lib.js';

export default function (host) {
  let ven = 'ret', typ = 'simple';
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A leaf with switchable venation (reticulate or parallel) and type (simple, pinnate or palmate)' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Venation', [['ret', 'Reticulate (net)'], ['par', 'Parallel']], ven, (v) => { ven = v; go(); });
  choice(ctl, 'Leaf type', [['simple', 'Simple'], ['pin', 'Pinnately compound'], ['pal', 'Palmately compound']], typ, (v) => { typ = v; go(); });
  const go = () => { ro.textContent = `${ven === 'ret' ? 'Reticulate venation: veins form a net (dicots: mango, peepal, rose).' : 'Parallel venation: veins run side by side (monocots: grass, wheat, banana).'} ${typ === 'simple' ? 'A simple leaf has one undivided blade.' : typ === 'pin' ? 'Pinnately compound: leaflets sit on a common axis, the rachis (neem, rose).' : 'Palmately compound: leaflets join at the tip of the petiole (silk cotton, Oxalis).'}`; cv.redraw(); };
  const blade = (ctx, col, x, y, len, wd, ang) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(wd, -len * 0.25, wd * 0.8, -len * 0.75, 0, -len); ctx.bezierCurveTo(-wd * 0.8, -len * 0.75, -wd, -len * 0.25, 0, 0); ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.45; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.4; ctx.stroke();
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -len); ctx.stroke(); ctx.lineWidth = 0.8;
    if (ven === 'ret') { for (let k = 1; k < 6; k++) for (const sg of [-1, 1]) { ctx.beginPath(); ctx.moveTo(0, -len * k / 6.5); ctx.lineTo(sg * wd * (0.75 - Math.abs(k - 3) * 0.1), -len * (k / 6.5 + 0.1)); ctx.stroke(); ctx.beginPath(); ctx.moveTo(sg * wd * 0.35, -len * (k / 6.5 + 0.04)); ctx.lineTo(sg * wd * 0.5, -len * (k / 6.5 + 0.12)); ctx.stroke(); } }
    else { for (let k = -3; k <= 3; k++) { if (!k) continue; ctx.beginPath(); ctx.moveTo(k * wd * 0.2, -len * 0.1 * (1 - 0.0)); ctx.bezierCurveTo(k * wd * 0.28, -len * 0.4, k * wd * 0.26, -len * 0.7, 0, -len * 0.97); ctx.stroke(); } }
    ctx.restore();
  };
  cv.draw = (ctx, w, h, col) => {
    const y0 = title(ctx, `${typ === 'simple' ? 'Simple' : typ === 'pin' ? 'Pinnately compound' : 'Palmately compound'} leaf, ${ven === 'ret' ? 'reticulate' : 'parallel'} veins`, col), cx = w / 2, by = h - 70;
    // stem and axil bud
    ctx.strokeStyle = col.s[3]; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(cx - 70, by + 30); ctx.lineTo(cx + 10, by + 6); ctx.stroke();
    const px = cx, py = by;
    if (typ === 'simple') { ctx.strokeStyle = col.s[1]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py - 26); ctx.stroke(); blade(ctx, col, px, py - 26, Math.min(190, h - y0 - 130), Math.min(80, w / 3.4), 0); text(ctx, 'blade (lamina)', px + 60, py - 110, { color: col.muted, size: 10.5 }); text(ctx, 'petiole', px + 8, py - 12, { color: col.muted, size: 10.5 }); }
    if (typ === 'pin') { const L = Math.min(190, h - y0 - 110); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py - L); ctx.stroke(); for (let k = 0; k < 4; k++) for (const sg of [-1, 1]) blade(ctx, col, px, py - 40 - k * (L - 60) / 3.4, 52, 18, sg * 1.2); blade(ctx, col, px, py - L, 50, 18, 0); text(ctx, 'rachis', px + 8, py - L / 2, { color: col.muted, size: 10.5 }); text(ctx, 'leaflets', px + 60, py - L * 0.75, { color: col.muted, size: 10.5 }); }
    if (typ === 'pal') { const L = 22; ctx.strokeStyle = col.s[1]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py - 50); ctx.stroke(); for (const a of [-1.0, -0.5, 0, 0.5, 1.0]) blade(ctx, col, px, py - 50, 100, 26, a); text(ctx, 'all leaflets join at one point', px, py - 170, { color: col.muted, size: 10.5, align: 'center' }); }
    ell(ctx, cx - 6, by + 8, 5, 8, col.s[3], col.ink, 1.5, 0.9); text(ctx, 'axillary bud: marks a true leaf', cx - 44, by + 40, { color: col.s[3], size: 10.5, weight: 700 });
  };
  go();
}
