// Pollination to double fertilisation as a step player: pollen lands on the stigma, the pollen tube carries two male gametes
// down the style, one fuses with the egg (syngamy, 2n zygote) and one with the two polar nuclei (triple fusion, 3n endosperm).
// Only flowering plants do this; afterwards the ovule becomes the seed and the ovary the fruit.
import { text, title } from '../kit.js';
import { stepper, mix, wrap } from './_bio-kit.js';

const NAMES = ['1. Pollen lands on the stigma', '2. Pollen tube grows down the style', '3. Tube enters the embryo sac', '4. Syngamy (gamete + egg)', '5. Triple fusion (gamete + 2 polar nuclei)', '6. After fertilisation'];
const TXT = ['The pollen grain germinates; its generative cell divides to give 2 male gametes, the tube cell guides the way.', 'The pollen tube grows through the style toward the ovule, carrying both male gametes.', 'The tube reaches the micropyle and bursts in a synergid, releasing both male gametes into the embryo sac.', 'Male gamete 1 (n) + egg (n) gives the zygote (2n): the future embryo.', 'Male gamete 2 (n) + two polar nuclei (n + n) gives the primary endosperm nucleus (3n): the future food store.', 'Zygote becomes the embryo, PEN becomes endosperm, ovule becomes the seed, ovary becomes the fruit.'];

export default function (host) {
  return stepper(host, { aspect: 1.15, max: 470, min: 380, stages: 6, label: 'Pollen tube growth and double fertilisation in a flowering plant' }, (ctx, w, h, col, st, k, t, pv) => {
    title(ctx, NAMES[st], col);
    const cx = w * 0.4, sTop = 62, ovY = h * 0.6, mic = [cx, ovY - 34];
    // pistil: stigma, style, ovary
    ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.15; ctx.beginPath(); ctx.moveTo(cx - 8, sTop + 14); ctx.lineTo(cx - 8, ovY - 60); ctx.lineTo(cx - 60, ovY - 40); ctx.quadraticCurveTo(cx - 90, ovY + 50, cx, ovY + 80); ctx.quadraticCurveTo(cx + 90, ovY + 50, cx + 60, ovY - 40); ctx.lineTo(cx + 8, ovY - 60); ctx.lineTo(cx + 8, sTop + 14); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.ellipse(cx, sTop + 8, 18, 8, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
    text(ctx, 'stigma', cx + 24, sTop + 6, { color: col.s[1], size: 10.5, weight: 700 }); text(ctx, 'style', cx + 14, (sTop + ovY) / 2 - 20, { color: col.s[3], size: 10.5, weight: 700 }); text(ctx, 'ovary', cx - 76, ovY + 62, { color: col.s[3], size: 10.5, weight: 700, fit: false });
    // ovule with embryo sac (bigger than life for clarity)
    ctx.beginPath(); ctx.ellipse(cx, ovY + 8, 50, 62, 0, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.stroke(); text(ctx, 'ovule', cx + 54, ovY - 10, { color: col.muted, size: 10, fit: false });
    ctx.beginPath(); ctx.ellipse(cx, ovY + 12, 30, 44, 0, 0, 7); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = col.s[2]; ctx.stroke(); text(ctx, 'embryo sac', cx + 64, ovY + 42, { color: col.s[2], size: 10, weight: 700, fit: true });
    const nuc = (x, y, r, c, lab, al = 1) => { ctx.globalAlpha = al; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = c; ctx.fill(); ctx.globalAlpha = 1; if (lab) text(ctx, lab, x + r + 4, y, { color: col.ink, size: 9.5, weight: 700, fit: false }); };
    const fusedA = st >= 3 ? 1 : 0, fusedB = st >= 4 ? 1 : 0;
    // egg and synergids (micropylar end, top), polar nuclei in centre, antipodals at the bottom
    const egg = [cx, ovY - 8];
    if (fusedA) nuc(egg[0], egg[1], mix(5, 8, st === 3 ? k : 1), col.s[5], st >= 3 ? (st === 3 ? 'zygote 2n' : 'zygote 2n') : '');
    else nuc(egg[0], egg[1], 6, col.s[2], 'egg n');
    nuc(cx - 14, ovY - 22, 4, col.s[2], '', 0.7); nuc(cx + 14, ovY - 22, 4, col.s[2], '', 0.7);
    const pn = mix(0, 1, fusedB ? (st === 4 ? k : 1) : 0);
    if (!fusedB) { nuc(cx - 6, ovY + 14, 4.5, col.s[0], ''); nuc(cx + 6, ovY + 20, 4.5, col.s[0], 'polar nuclei n + n'); } else nuc(cx, mix(ovY + 17, ovY + 17, pn), 8, col.s[3], 'PEN 3n');
    for (let i = 0; i < 3; i++) nuc(cx - 14 + i * 14, ovY + 46, 3.5, col.s[7], '', 0.7);
    text(ctx, 'antipodals', cx + 28, ovY + 50, { color: col.muted, size: 9, fit: false });
    // pollen grain and tube
    const grow = st === 0 ? 0 : st === 1 ? mix(0.05, 1, k) : 1, tubeEnd = mix(sTop + 8, mic[1] + 6, st === 0 && pv === 0 ? 0 : grow);
    if (st >= 1 || (st === 0)) { nuc(cx + 2, sTop - 8, 8, col.s[1], st === 0 ? 'pollen grain' : ''); }
    if (st >= 1) { ctx.strokeStyle = col.s[1]; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx, sTop + 8); ctx.lineTo(cx, tubeEnd); ctx.stroke(); }
    // male gametes ride in the tube then go to their targets
    const g1 = [mix(cx - 2, egg[0] - (st >= 3 ? 0 : 5), st >= 3 ? 1 : 0), 0], tubeY = (f) => mix(sTop + 10, mic[1], f);
    const place = (idx) => { if (st === 0) return null; if (st === 1) return [cx + (idx ? 4 : -4), tubeY(grow) - 4 - idx * 8]; if (st === 2) return [cx + (idx ? 8 : -8), mic[1] + 6 + k * 8]; if (st === 3) return idx === 0 ? [mix(cx - 8, egg[0], k), mix(mic[1] + 14, egg[1], k)] : [cx + 8, mic[1] + 14 - (0)]; if (st === 4) return idx === 1 ? [mix(cx + 8, cx, k), mix(mic[1] + 14, ovY + 17, k)] : null; return null; };
    [0, 1].forEach((i) => { const p = place(i); if (p && !(st === 3 && i === 0 && k > 0.9) && !(st === 4 && i === 1 && k > 0.9)) nuc(p[0], p[1], 4.5, col.bad, st <= 2 && i === 1 ? 'male gametes' : ''); });
    if (st === 5) { text(ctx, 'seed', cx, ovY + 100, { color: col.s[3], size: 12, weight: 700, align: 'center' }); }
    wrap(ctx, TXT[st], w / 2, h - 44, w - 24, { color: col.ink, size: 11 });
  });
}
