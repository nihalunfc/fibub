// Class 12 Biology, Principles of Inheritance and Variation: linkage and recombination. Two genes A and B on one chromosome pair of a dihybrid AB/ab. Without
// crossing over only the parental gametes AB and ab form. A crossover between the genes swaps the pieces and makes recombinant gametes Ab and aB. The farther
// apart the genes, the more likely a crossover falls between them: recombination frequency (%) is a measure of distance (1 % = 1 map unit, a centimorgan).
// Morgan's Drosophila: yellow body and white eye 1.3 % recombination (close); white eye and miniature wing 37.2 % (far).
import { canvas, text, title, line, row, slider, button, readout, loop, clamp, ease } from '../../kit.js';

export default function (host) {
  let dist = 20, co = 0, anim = false;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'Two homologous chromosomes with genes A and B, a crossover that swaps the ends, and bars of parental and recombinant gametes' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'distance between genes (map units)', min: 1, max: 50, step: 1, value: dist, fmt: (v) => `${Math.round(v)}`, oninput: (v) => { dist = Math.round(v); go(); } });
  button(ctl, 'Show a crossover', () => { co = 0; anim = true; });
  loop(host, (dt) => { if (anim) { co = clamp(co + dt * 0.6, 0, 1); if (co >= 1) anim = false; cv.redraw(); } });
  const go = () => { const r = dist; ro.textContent = `Genes ${dist} map units apart: recombination frequency about ${r} %. Out of 1000 gametes, about ${Math.round(10 * (100 - r))} are parental (AB, ab) and ${10 * r} recombinant (Ab, aB). ${r >= 50 ? 'At 50 % the genes behave as if on different chromosomes.' : r <= 2 ? 'Very tightly linked: recombinants are rare.' : ''}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Crossing over between linked genes', col) + 8, L = 20, R = w - 20, gx = (f) => L + (R - L) * f, ya = top + 20, yb = top + 52, e = ease(co);
    const pa = 0.15, pb = 0.15 + 0.7 * dist / 50;
    const mid = (pa + pb) / 2;
    const bar = (y, c1, c2, swap) => { const x1 = gx(0), x2 = gx(1), xm = gx(mid); ctx.lineCap = 'round'; line(ctx, [[x1, y], [xm, y]], swap ? c2 : c1, 11); line(ctx, [[xm, y], [x2, y]], swap ? c2 : c1, 11); };
    const draw = (y, cL, cR) => { const xm = gx(mid); line(ctx, [[gx(0), y], [xm, y]], cL, 11); line(ctx, [[xm, y], [gx(1), y]], cR, 11); };
    const half = e > 0.5;
    draw(ya, col.s[0], half ? col.s[3] : col.s[0]); draw(yb, col.s[3], half ? col.s[0] : col.s[3]);
    for (const y of [ya, yb]) { const lab = y === ya ? ['A', 'B', 'a', 'b'] : ['a', 'b']; }
    text(ctx, 'A', gx(pa), ya - 14, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, half ? 'b' : 'B', gx(pb), ya - 14, { color: col.ink, size: 12, weight: 700, align: 'center' });
    text(ctx, 'a', gx(pa), yb + 18, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, half ? 'B' : 'b', gx(pb), yb + 18, { color: col.ink, size: 12, weight: 700, align: 'center' });
    if (e > 0.05) { const xm = gx(mid); line(ctx, [[xm - 8, ya], [xm + 8, yb]], col.ink, 2); line(ctx, [[xm + 8, ya], [xm - 8, yb]], col.ink, 2); text(ctx, 'crossover', xm, (ya + yb) / 2 + 22 > yb + 30 ? yb + 30 : (ya + yb) / 2 + 2, { color: col.bad, size: 10, weight: 700, align: 'center', fit: false, halo: col.panel }); }
    const bt = yb + 56, base = h - 34, bw = (w - 60) / 4, par = (100 - dist) / 2, rec = dist / 2, mx = 50;
    [['AB', par, 0], ['ab', par, 0], ['Ab', rec, 1], ['aB', rec, 1]].forEach(([k, v, r], i) => { const x = 30 + i * bw, hh = (base - bt) * v / mx; ctx.fillStyle = r ? col.s[3] : col.s[0]; ctx.fillRect(x + 10, base - hh, bw - 20, hh); text(ctx, `${Math.round(v * 10)}`, x + bw / 2, base - hh - 8, { color: col.ink, size: 10.5, weight: 700, align: 'center' }); text(ctx, k, x + bw / 2, base + 12, { color: col.ink, size: 11.5, weight: 700, align: 'center' }); });
    text(ctx, 'gametes out of 1000: parental (blue) and recombinant (orange)', w / 2, bt - 6, { color: col.muted, size: 10, align: 'center' });
  };
  go();
}
