// Class 12 Biology, Biotechnology: Principles and Processes: cutting a 10 000 bp DNA with restriction enzymes and running the pieces on an agarose gel.
// n cuts in a linear DNA give n + 1 fragments. DNA is negatively charged, so it runs toward the + electrode; smaller pieces slip through the gel pores faster
// and travel farther (distance falls roughly with log of size). A denser (higher %) gel resolves smaller pieces better.
import { canvas, text, title, line, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  const SITES = { EcoRI: [2000, 6500], HindIII: [3500, 8000] }, LEN = 10000;
  const LADDER = [10000, 8000, 6000, 5000, 4000, 3000, 2000, 1500, 1000, 500];
  let enz = 'EcoRI', pct = 1;
  const cv = canvas(host, { aspect: 1.15, max: 440, min: 330, label: 'A map of a 10 000 base pair DNA with enzyme cut sites, and an agarose gel with a size ladder, uncut DNA and the digested DNA' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Enzyme', [['EcoRI', 'EcoRI'], ['HindIII', 'HindIII'], ['both', 'Both'], ['none', 'None']], 'EcoRI', (v) => { enz = v; go(); });
  slider(ctl, { label: 'agarose', min: 0.7, max: 2, step: 0.1, value: 1, fmt: (v) => v.toFixed(1) + ' %', oninput: (v) => { pct = v; go(); } });
  const cuts = () => (enz === 'none' ? [] : enz === 'both' ? [...SITES.EcoRI, ...SITES.HindIII] : SITES[enz]).slice().sort((a, b) => a - b);
  const frags = () => { const c = [0, ...cuts(), LEN], o = []; for (let i = 1; i < c.length; i++) o.push(c[i] - c[i - 1]); return o; };
  const go = () => { const f = frags(); ro.textContent = `${cuts().length} cut${cuts().length === 1 ? '' : 's'} in a linear DNA give ${f.length} fragment${f.length === 1 ? '' : 's'}: ${f.slice().sort((a, b) => b - a).join(', ')} bp. Fragments add up to ${f.reduce((a, b) => a + b, 0)} bp.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Digest and gel', col) + 6, mx0 = 24, mx1 = w - 24, my = top + 22;
    const mapX = (b) => mx0 + (b / LEN) * (mx1 - mx0);
    line(ctx, [[mx0, my], [mx1, my]], col.ink, 5);
    cuts().forEach((c) => { const name = Object.keys(SITES).find((k) => SITES[k].includes(c)); line(ctx, [[mapX(c), my - 9], [mapX(c), my + 9]], name === 'EcoRI' ? col.s[2] : col.s[0], 3); text(ctx, name, mapX(c), my - 16, { color: name === 'EcoRI' ? col.s[2] : col.s[0], size: 10, weight: 700, align: 'center' }); });
    text(ctx, '0', mx0, my + 18, { color: col.muted, size: 10 }); text(ctx, '10 000 bp', mx1, my + 18, { color: col.muted, size: 10, align: 'right' });
    // gel
    const gy0 = my + 34, gy1 = h - 28, gx0 = 14, gx1 = w - 14;
    ctx.fillStyle = col.soft; ctx.fillRect(gx0, gy0, gx1 - gx0, gy1 - gy0);
    text(ctx, '− (wells)', gx0 + 4, gy0 - 2, { color: col.muted, size: 10 }); text(ctx, '+', gx1 - 8, gy1 + 11, { color: col.muted, size: 11, weight: 700 });
    const maxS = 22000 / (pct * pct * 0.9 + 0.1), minS = 700 / (pct * pct * 1.3) * 0.9;
    const dist = (s) => { const f = Math.log(maxS / s) / Math.log(maxS / minS); return Math.min(0.97, Math.max(0.03, f)); };
    const lanes = [['Ladder', LADDER, col.ink], ['Uncut', [LEN], col.muted], ['Digest', frags(), col.s[2]]], lw = (gx1 - gx0) / 3;
    lanes.forEach(([nm, arr, c], i) => {
      const cx = gx0 + lw * (i + 0.5);
      ctx.fillStyle = col.panel; ctx.fillRect(cx - lw * 0.3, gy0 + 2, lw * 0.6, 6);
      text(ctx, nm, cx, gy1 + 11, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
      arr.forEach((s) => { const y = gy0 + 12 + dist(s) * (gy1 - gy0 - 18); ctx.fillStyle = c; ctx.globalAlpha = 0.85; ctx.fillRect(cx - lw * 0.28, y - 2, lw * 0.56, 4); ctx.globalAlpha = 1; if (i === 0) text(ctx, String(s), cx - lw * 0.3 - 3, y, { color: col.muted, size: 9.5, align: 'right' }); if (i === 2) text(ctx, String(s), cx + lw * 0.3 + 3, y, { color: col.s[2], size: 9.5, weight: 700 }); });
    });
  };
  go();
}
