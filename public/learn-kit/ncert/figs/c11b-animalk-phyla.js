// Class 11 Biology, Animal Kingdom: the eleven animal phyla in the NCERT order, from the simplest (Porifera) to the most complex (Chordata). Slide through them to see a sketch and the key facts:
// level of organisation (cellular, tissue, organ, organ system), symmetry, body cavity and a defining feature.
import { canvas, text, title, row, slider, readout, loop } from '../../kit.js';
import { ell, rr, note, poly, curve } from '../c11b-lib.js';

const P = [
  ['Porifera', 'pore bearers (sponges)', 'cellular', 'asymmetric', 'none', 'Pores and canals with flagellated collar cells; water flows in, food is filtered. Spongilla, Sycon.'],
  ['Cnidaria', 'stinging animals', 'tissue', 'radial', 'none (gut only)', 'Stinging cells (cnidoblasts); polyp and medusa forms. Hydra, jellyfish, corals.'],
  ['Ctenophora', 'comb jellies', 'tissue', 'radial', 'none', 'Eight rows of comb plates for swimming; bioluminescent. Pleurobrachia.'],
  ['Platyhelminthes', 'flatworms', 'organ', 'bilateral', 'none (acoelomate)', 'Flat body, flame cells for excretion; many are parasites. Tapeworm, liver fluke.'],
  ['Aschelminthes', 'roundworms', 'organ system', 'bilateral', 'pseudocoelom', 'Round, unsegmented, complete gut. Ascaris, Wuchereria (filaria).'],
  ['Annelida', 'segmented worms', 'organ system', 'bilateral', 'true coelom', 'Body in rings (metameric segmentation); closed blood system. Earthworm, leech.'],
  ['Arthropoda', 'jointed-leg animals', 'organ system', 'bilateral', 'true coelom (haemocoel)', 'Jointed legs, chitin exoskeleton; the largest phylum. Insects, prawn, spider.'],
  ['Mollusca', 'soft-bodied animals', 'organ system', 'bilateral', 'true coelom', 'Soft body in a shell (mostly), muscular foot, mantle, radula. Snail, Pila, octopus.'],
  ['Echinodermata', 'spiny-skinned', 'organ system', 'radial adult', 'true coelom', 'Spiny skin, water vascular system with tube feet; all marine. Starfish, sea urchin.'],
  ['Hemichordata', 'half-chordates', 'organ system', 'bilateral', 'true coelom', 'Worm-like with proboscis, collar and trunk; gill slits. Balanoglossus.'],
  ['Chordata', 'animals with a notochord', 'organ system', 'bilateral', 'true coelom', 'Notochord, dorsal hollow nerve cord, pharyngeal gill slits at some stage. Fish to humans.'],
];
export default function (host) {
  let i = 0, t = 0;
  const cv = canvas(host, { aspect: 0.9, max: 400, min: 300, label: 'Sketch and key facts for each of the eleven animal phyla' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'phylum', min: 0, max: 10, step: 1, value: 0, fmt: (v) => `${v + 1}. ${P[v][0]}`, oninput: (v) => { i = v; go(); } });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const go = () => { ro.textContent = P[i][5]; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const y0 = title(ctx, `${P[i][0]}: ${P[i][1]}`, col), cx = w / 2, cy = y0 + 76, s = Math.min(1.2, w / 300), wob = Math.sin(t * 2);
    ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s);
    const c0 = col.s[0], c1 = col.s[1], c3 = col.s[3], ink = col.ink;
    if (i === 0) { poly(ctx, [[-24, 40], [-30, -10], [-18, -34], [18, -34], [30, -10], [24, 40]], c0, ink, 1.8, 0.45); ell(ctx, 0, -34, 18, 5, col.panel, ink, 1.5); for (let k = 0; k < 6; k++) ell(ctx, -20 + (k % 2) * 36 - (k > 3 ? 4 : 0), -6 + Math.floor(k / 2) * 18, 3, 3, col.panel, ink, 1); for (let k = 0; k < 4; k++) { const yy = 30 - ((t * 20 + k * 20) % 80); ctx.strokeStyle = c1; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-44, 20 + k * 6 - 0); ctx.lineTo(-30, 14 + k * 6); ctx.stroke(); } text(ctx, 'water in through pores', -44, 50, { color: c1, size: 10, align: 'left' }); }
    if (i === 1) { ell(ctx, 0, 0, 26, 30, c0, ink, 1.8, 0.4); for (let k = 0; k < 7; k++) { const a = -2.6 + k * 0.45; ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 20, 28 + Math.sin(a) * 4 + 6); ctx.quadraticCurveTo(Math.cos(a) * 34 + 6 * wob, 52, Math.cos(a) * 40 + 8 * wob, 68); ctx.stroke(); } rr(ctx, -12, -38, 24, 8, 3, c3, ink, 1); text(ctx, 'tentacles with stinging cells', 0, 86, { color: col.muted, size: 10, align: 'center' }); }
    if (i === 2) { ell(ctx, 0, 0, 30, 42, c0, ink, 1.8, 0.3); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4 + Math.PI / 8, x = Math.cos(a) * 28, y = Math.sin(a) * 40; ctx.strokeStyle = [c1, c3][(Math.floor(t * 4) + k) % 2]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x * 0.55, y * 0.45); ctx.lineTo(x, y); ctx.stroke(); } text(ctx, '8 rows of comb plates', 0, 66, { color: col.muted, size: 10, align: 'center' }); }
    if (i === 3) { curve(ctx, [[-60, 0], [-30, -16], [0, -10], [30, -18], [60, 0], [30, 18], [0, 10], [-30, 18], [-60, 0]], ink, 1.8, c0, 0.45); ell(ctx, -52, 0, 3, 3, ink, null, 0); ell(ctx, -52 + 0, 0, 0, 0, ink); text(ctx, 'flat, ribbon-like', 0, 38, { color: col.muted, size: 10, align: 'center' }); }
    if (i === 4) { ctx.strokeStyle = c0; ctx.lineWidth = 11; ctx.lineCap = 'round'; ctx.beginPath(); for (let u = -60; u <= 60; u += 4) { const y = 14 * Math.sin(u * 0.09 + t * 3); u === -60 ? ctx.moveTo(u, y) : ctx.lineTo(u, y); } ctx.stroke(); ctx.strokeStyle = col.panel; ctx.lineWidth = 3; ctx.stroke(); text(ctx, 'round, unsegmented, tapering', 0, 38, { color: col.muted, size: 10, align: 'center' }); }
    if (i === 5) { for (let k = 0; k < 10; k++) rr(ctx, -64 + k * 13, -9 + 3 * Math.sin(k * 0.6 + t * 2), 12, 18, 6, k === 3 ? c3 : c0, ink, 1.2); text(ctx, 'ring-like segments', 0, 30, { color: col.muted, size: 10, align: 'center' }); }
    if (i === 6) { ell(ctx, -34, 0, 15, 11, c0, ink, 1.6, 0.6); ell(ctx, -6, 0, 17, 13, c0, ink, 1.6, 0.5); ell(ctx, 30, 0, 22, 14, c0, ink, 1.6, 0.4); ctx.strokeStyle = ink; ctx.lineWidth = 1.6; for (let k = 0; k < 3; k++) { const x = -12 + k * 12; ctx.beginPath(); ctx.moveTo(x, 12); ctx.lineTo(x - 6, 22); ctx.lineTo(x - 12, 40); ctx.moveTo(x, -12); ctx.lineTo(x - 6, -22); ctx.lineTo(x - 12, -40); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(-46, -6); ctx.lineTo(-64, -22); ctx.moveTo(-46, 6); ctx.lineTo(-64, 22); ctx.stroke(); text(ctx, 'jointed legs and antennae', 0, 58, { color: col.muted, size: 10, align: 'center' }); }
    if (i === 7) { ctx.beginPath(); ctx.arc(10, -6, 32, Math.PI, 0); ctx.lineTo(42, 14); ctx.lineTo(-22, 14); ctx.closePath(); ctx.fillStyle = c3; ctx.globalAlpha = 0.5; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = ink; ctx.lineWidth = 1.8; ctx.stroke(); ctx.beginPath(); ctx.arc(10, -6, 16, Math.PI, 0); ctx.stroke(); rr(ctx, -46, 14, 100, 12, 6, c0, ink, 1.5); ctx.strokeStyle = ink; ctx.beginPath(); ctx.moveTo(-40, 14); ctx.lineTo(-52, -10); ctx.moveTo(-44, 14); ctx.lineTo(-62, -4); ctx.stroke(); text(ctx, 'shell, foot, tentacles', 4, 46, { color: col.muted, size: 10, align: 'center' }); }
    if (i === 8) { for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + k * 2 * Math.PI / 5; poly(ctx, [[Math.cos(a - 0.35) * 10, Math.sin(a - 0.35) * 10], [Math.cos(a) * 52, Math.sin(a) * 52], [Math.cos(a + 0.35) * 10, Math.sin(a + 0.35) * 10]], c3, ink, 1.5, 0.55); for (let u = 1; u < 4; u++) ell(ctx, Math.cos(a) * u * 12 + 3, Math.sin(a) * u * 12, 1.8, 1.8, ink, null, 0); } ell(ctx, 0, 0, 9, 9, c0, ink, 1.5, 0.7); text(ctx, 'five arms (radial), tube feet', 0, 68, { color: col.muted, size: 10, align: 'center' }); }
    if (i === 9) { ell(ctx, -46, 0, 14, 12, c3, ink, 1.6, 0.6); rr(ctx, -34, -9, 14, 18, 4, c1, ink, 1.4); rr(ctx, -18, -8, 70, 16, 8, c0, ink, 1.6); for (let k = 0; k < 4; k++) { ctx.strokeStyle = ink; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-10 + k * 8, -8); ctx.lineTo(-10 + k * 8, -2); ctx.stroke(); } text(ctx, 'proboscis · collar · trunk', 0, 30, { color: col.muted, size: 10, align: 'center' }); }
    if (i === 10) { ctx.beginPath(); ctx.moveTo(-56, 0); ctx.quadraticCurveTo(-30, -24, 20, -12); ctx.lineTo(56, -16); ctx.lineTo(56, 16); ctx.lineTo(20, 12); ctx.quadraticCurveTo(-30, 24, -56, 0); ctx.closePath(); ctx.fillStyle = c0; ctx.globalAlpha = 0.35; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = ink; ctx.lineWidth = 1.8; ctx.stroke(); ctx.strokeStyle = c3; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-48, -2); ctx.lineTo(52, -2); ctx.stroke(); ctx.strokeStyle = c1; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-48, -10); ctx.lineTo(48, -10); ctx.stroke(); text(ctx, 'notochord', 56, -2, { color: c3, size: 10, weight: 700 }); text(ctx, 'nerve cord (dorsal)', 56, -14, { color: c1, size: 10, weight: 700 }); for (let k = 0; k < 3; k++) { ctx.strokeStyle = ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-34 + k * 7, 6); ctx.lineTo(-34 + k * 7, 14); ctx.stroke(); } }
    ctx.restore();
    const y1 = y0 + 168, rows = [['Level of organisation', P[i][2]], ['Symmetry', P[i][3]], ['Body cavity', P[i][4]]];
    rows.forEach(([a, b], k) => { const y = y1 + k * 30; rr(ctx, 10, y, w - 20, 25, 6, col.soft, col.line); text(ctx, a, 18, y + 13, { color: col.muted, size: 11, weight: 700 }); text(ctx, b, w - 18, y + 13, { color: col.ink, size: 11.5, weight: 600, align: 'right' }); });
    text(ctx, `phylum ${i + 1} of 11: simple to complex`, w / 2, h - 12, { color: col.muted, size: 10.5, align: 'center' });
  };
  go();
}
