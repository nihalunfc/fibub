// Class 11 Biology, Plant Kingdom: fern life cycle (a pteridophyte). The big fern is the sporophyte (2n); sori on the leaf underside hold sporangia where meiosis makes haploid spores.
// A spore grows into a small, free-living, heart-shaped gametophyte (prothallus) with antheridia and archegonia. Water carries the antherozoid to the egg; the zygote grows into a new fern. Step player (6 steps).
import { canvas, text, title } from '../../kit.js';
import { rr, ell, note, poly } from '../c11b-lib.js';

const T = ['1. Sporophyte with sori (2n)', '2. Spores by meiosis (n)', '3. Prothallus (n)', '4. Antheridia and archegonia', '5. Fertilisation in water', '6. New sporophyte (2n)'];
const N = ['The fern plant (sporophyte) is the large, familiar body, with true roots, stem and leaves. Brown dots (sori) on the leaf underside hold sporangia.', 'Spore mother cells in the sporangia divide by meiosis to give haploid spores. The sporangium dries, opens and flings them out.', 'A spore on damp ground grows into a small, green, heart-shaped prothallus: the free-living gametophyte.', 'On the underside the prothallus makes antheridia (male, make antherozoids) and archegonia (female, each holds an egg).', 'In a film of water the antherozoids swim to the archegonium and fertilise the egg. Water is needed, as in mosses.', 'The zygote (2n) grows into a young sporophyte that is at first fed by the prothallus, then becomes a fern of its own.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 300, label: 'Steps of the fern life cycle from sporophyte to prothallus and new fern' });
  const frond = (ctx, x, y, sc, col, sori) => { ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(0, 50); ctx.quadraticCurveTo(-4, 0, 14, -50); ctx.stroke(); for (let k = 0; k < 7; k++) { const yy = 40 - k * 13, xx = -1 + k * 2.2, L = 22 - k * 1.8; ell(ctx, xx - L / 2, yy, L / 2, 3.5, col.s[1], col.ink, 0.8, 0.7); ell(ctx, xx + L / 2 + 2, yy - 2, L / 2, 3.5, col.s[1], col.ink, 0.8, 0.7); if (sori) { ell(ctx, xx - L / 2, yy + 3, 1.6, 1.6, col.s[4], null, 0); ell(ctx, xx + L / 2 + 2, yy + 1, 1.6, 1.6, col.s[4], null, 0); } } ctx.restore(); };
  const prothallus = (ctx, x, y, sc, col) => { ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.beginPath(); ctx.moveTo(0, 8); ctx.bezierCurveTo(-30, -20, -30, 10, 0, 28); ctx.bezierCurveTo(30, 10, 30, -20, 0, 8); ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.6; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.4; ctx.stroke(); ctx.restore(); };
  cv.draw = (ctx, w, h, col) => {
    const y0 = title(ctx, T[s], col), cx = w / 2, gy = y0 + 160;
    ctx.fillStyle = col.s[4]; ctx.globalAlpha = 0.3; ctx.fillRect(10, gy, w - 20, 24); ctx.globalAlpha = 1;
    if (s === 0) { frond(ctx, cx, gy - 52, 1.7, col, true); text(ctx, 'sori (brown dots)', cx + 56, gy - 70, { color: col.s[4], size: 10.5, weight: 700 }); text(ctx, 'sporophyte (2n)', cx - 56, gy - 128, { color: col.s[3], size: 11, weight: 700, align: 'right' }); }
    if (s === 1) { rr(ctx, cx - 40, gy - 100, 80, 70, 10, col.soft, col.ink, 1.5); text(ctx, 'sporangium', cx, gy - 108, { color: col.muted, size: 10.5, align: 'center' }); [[-20, -75], [8, -82], [-6, -56], [22, -62]].forEach(([a, b]) => ell(ctx, cx + a, gy + b, 6, 6, col.s[0], col.ink, 1, 0.8)); text(ctx, 'meiosis → spores (n)', cx, gy - 20, { color: col.s[0], size: 11, weight: 700, align: 'center' }); for (let k = 0; k < 6; k++) ell(ctx, cx - 70 + k * 28, gy - 20 + (k % 2) * 6 - 16 + 0, 0, 0, col.panel); }
    if (s === 2) { ell(ctx, cx - 70, gy - 8, 5, 5, col.s[0], col.ink, 1.2); text(ctx, 'spore', cx - 70, gy - 22, { color: col.muted, size: 10, align: 'center' }); prothallus(ctx, cx + 20, gy - 40, 2.2, col); text(ctx, 'prothallus (gametophyte, n)', cx + 20, gy - 118, { color: col.s[1], size: 11, weight: 700, align: 'center' }); }
    if (s >= 3) { prothallus(ctx, cx, gy - 36, s === 5 ? 1.6 : 2.6, col); if (s <= 4) { ell(ctx, cx - 24, gy - 18, 5, 5, col.s[0], col.ink, 1); text(ctx, 'antheridia', cx - 34, gy - 28, { color: col.s[0], size: 10.5, align: 'right' }); ell(ctx, cx + 14, gy - 4, 4, 7, col.s[3], col.ink, 1); text(ctx, 'archegonia', cx + 26, gy - 2, { color: col.s[3], size: 10.5 }); } }
    if (s === 4) { for (let k = 0; k < 6; k++) { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.6; ctx.beginPath(); ctx.arc(cx - 40 + k * 8, gy - 6 + (k % 2) * 4, 2.2, 0, 7); ctx.fill(); ctx.globalAlpha = 1; } text(ctx, 'water film', cx - 10, gy + 18, { color: col.s[0], size: 10.5, align: 'center', weight: 700 }); }
    if (s === 5) { frond(ctx, cx + 4, gy - 52, 0.7, col, false); text(ctx, 'young sporophyte (2n)', cx + 4, gy - 104, { color: col.s[3], size: 11, weight: 700, align: 'center' }); text(ctx, 'prothallus feeds it first', cx, gy + 40, { color: col.muted, size: 10.5, align: 'center' }); }
    note(ctx, N[s], 12, h - 66, w - 24, col, { size: 10.5 });
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
