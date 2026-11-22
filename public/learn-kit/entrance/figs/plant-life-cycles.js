// Plant kingdom: alternation of generations. Pick a plant group: the circle shows the haploid (n) and diploid (2n)
// parts of its life cycle, where meiosis and fertilisation happen, and which generation is the main, free-living plant.
import { canvas, text, row, choice, readout, arrow } from '../../kit.js';

// share: fraction of the circle that is 2n (a picture of which phase dominates, not a measurement)
const G = {
  volvox: { name: 'Volvox, Spirogyra', pat: 'Haplontic', share: 0.12, dom: 'the haploid (n) plant; the only 2n cell is the zygote, which undergoes meiosis', ex: 'most algae such as Volvox, Spirogyra and some Chlamydomonas' },
  bryo: { name: 'Bryophytes', pat: 'Haplo-diplontic', share: 0.35, dom: 'the haploid gametophyte (the moss or liverwort plant); the 2n sporophyte stays attached to it and depends on it', ex: 'mosses (Funaria, Sphagnum) and liverworts (Marchantia)' },
  pterido: { name: 'Pteridophytes', pat: 'Haplo-diplontic', share: 0.72, dom: 'the diploid sporophyte (the fern plant); the small gametophyte (prothallus) lives on its own for a short time', ex: 'ferns (Pteris, Dryopteris), Selaginella, Equisetum' },
  gymno: { name: 'Gymnosperms', pat: 'Diplontic', share: 0.9, dom: 'the diploid sporophyte; the gametophytes are a few cells kept inside the ovule or pollen grain', ex: 'Pinus, Cycas, Ginkgo' },
  angio: { name: 'Angiosperms', pat: 'Diplontic', share: 0.93, dom: 'the diploid sporophyte; the female gametophyte is the 7-celled embryo sac, the male one the pollen grain', ex: 'all flowering plants' },
  fucus: { name: 'Fucus', pat: 'Diplontic', share: 0.92, dom: 'the diploid plant; meiosis forms gametes directly', ex: 'the brown alga Fucus (an alga that breaks the usual algal pattern)' },
};
export default function (host) {
  let cur = 'bryo';
  const cv = canvas(host, { aspect: 0.62, max: 360, min: 260, label: 'Life cycle circle with haploid and diploid phases for one plant group' });
  const ctl = row(host);
  choice(ctl, 'Group', Object.entries(G).map(([k, g]) => [k, g.name]), cur, (v) => { cur = v; cv.redraw(); show(); });
  const out = readout(host);
  const show = () => { const g = G[cur]; out.innerHTML = `<b>${g.pat}</b>. Main plant: ${g.dom}. Examples: ${g.ex}.`; };
  cv.draw = (ctx, w, h, col) => {
    const g = G[cur], cx = w / 2, cy = h / 2 + 4, r = Math.min(w, h) * 0.34;
    // 2n arc runs clockwise from fertilisation (top) to meiosis
    const f = -Math.PI / 2, m = f + g.share * 2 * Math.PI;
    ctx.lineWidth = 14; ctx.lineCap = 'butt';
    ctx.strokeStyle = col.s[1]; ctx.beginPath(); ctx.arc(cx, cy, r, f, m); ctx.stroke();
    ctx.strokeStyle = col.s[2]; ctx.beginPath(); ctx.arc(cx, cy, r, m, f + 2 * Math.PI); ctx.stroke();
    const at = (a, k = 1) => [cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k];
    const [fx, fy] = at(f), [mx, my] = at(m);
    ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(fx, fy, 6, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(mx, my, 6, 0, 7); ctx.fill();
    text(ctx, 'fertilisation (n + n → 2n)', fx, fy - 18, { color: col.ink, size: 11, weight: 600, align: 'center' });
    const [mlx, mly] = at(m, 1.28);
    text(ctx, 'meiosis (2n → n)', mlx, mly, { color: col.ink, size: 11, weight: 600, align: 'center' });
    const mid2 = (f + m) / 2, midn = (m + f + 2 * Math.PI) / 2;
    const [ax, ay] = at(mid2, 0.55), [bx, by] = at(midn, 0.55);
    text(ctx, g.share < 0.2 ? '2n zygote' : '2n sporophyte', ax, ay, { color: col.s[1], size: 12, weight: 700, align: 'center' });
    text(ctx, g.share > 0.85 ? 'n gametophyte (tiny)' : 'n gametophyte', bx, by, { color: col.s[2], size: 12, weight: 700, align: 'center' });
    const [p0x, p0y] = at(f + 0.25, 1.12), [p1x, p1y] = at(f + 0.45, 1.12);
    arrow(ctx, p0x, p0y, p1x, p1y, col.muted, 1.5, 7);
    text(ctx, g.pat, cx, cy, { color: col.ink, size: 13, weight: 700, align: 'center' });
  };
  cv.redraw(); show();
}
