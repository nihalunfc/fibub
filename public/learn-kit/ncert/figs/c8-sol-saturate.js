// Class 8 Solutions: saturation. 100 g of water can dissolve only so much sugar; after that, extra sugar just sits at the
// bottom. Solubility rises with temperature (sugar in water, g per 100 g water: 0 C 179, 20 C 204, 40 C 238, 60 C 287,
// 80 C 362, 100 C 487; CRC Handbook style values). Each spoon here is 20 g.
import { canvas, text, title, dot, row, slider, button, readout, loop, rng } from '../../kit.js';

const PTS = [[0, 179], [20, 204], [40, 238], [60, 287], [80, 362], [100, 487]];
const S = (T) => { for (let i = 1; i < PTS.length; i++) if (T <= PTS[i][0]) { const [a, b] = PTS[i - 1], [c, d] = PTS[i]; return b + (d - b) * (T - a) / (c - a); } return 487; };
export default function (host) {
  let T = 20, spoons = 0, t = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 310, label: 'A beaker of water with sugar added until it stops dissolving' });
  const ctl = row(host);
  button(ctl, 'Add 1 spoon (20 g)', () => { spoons = Math.min(30, spoons + 1); say(); });
  button(ctl, 'Empty the beaker', () => { spoons = 0; say(); });
  slider(ctl, { label: 'Temperature', min: 0, max: 100, step: 5, value: T, fmt: (v) => `${v} °C`, oninput: (v) => { T = v; say(); } });
  const out = readout(host);
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const R = rng(3), P = []; for (let i = 0; i < 160; i++) P.push([R(), R(), R() * 6.3, R() * 6.3]);
  const calc = () => { const cap = S(T), added = spoons * 20, dis = Math.min(added, cap); return { cap, added, dis, left: added - dis }; };
  function say() { const c = calc(); out.innerHTML = `At ${T} °C, 100 g of water can hold up to <b>${Math.round(c.cap)} g</b> of sugar. You added ${c.added} g: <b>${Math.round(c.dis)} g dissolved</b>, ${Math.round(c.left)} g left undissolved. The solution is <b>${c.left > 0 || Math.abs(c.dis - c.cap) < 1 ? 'saturated' : 'unsaturated'}</b>.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'How much sugar will 100 g of water hold?', col);
    const c = calc(), bx = w * 0.08, bw = w * 0.5, by = 48, bh = h - 72, wy = by + 20;
    ctx.fillStyle = col.soft; ctx.fillRect(bx, wy, bw, by + bh - wy);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by); ctx.stroke();
    const nDis = Math.round(c.dis / 487 * 160);
    for (let i = 0; i < nDis; i++) { const p = P[i]; dot(ctx, bx + 8 + (bw - 16) * p[0] + 4 * Math.sin(p[2] + t * 1.2), wy + 8 + (by + bh - wy - 30) * p[1] + 4 * Math.sin(p[3] + t), 2.2, col.s[1]); }
    const ph = Math.min(52, c.left / 4); ctx.fillStyle = col.ink; ctx.globalAlpha = 0.75;
    for (let i = 0; i < Math.round(c.left / 3); i++) { const p = P[(i * 7) % 160]; const row = Math.floor(i / 16); ctx.fillRect(bx + 4 + ((i % 16) / 16) * (bw - 10), by + bh - 5 - row * 4 - (p[0] * 2), 4, 4); }
    ctx.globalAlpha = 1;
    // gauge
    const gx = w * 0.68, gw = 26, gy = by, gh = bh;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(gx, gy, gw, gh);
    const sc = gh / 520;
    ctx.fillStyle = col.s[1]; ctx.fillRect(gx, gy + gh - c.dis * sc, gw, c.dis * sc);
    if (c.left > 0) { ctx.fillStyle = col.muted; ctx.fillRect(gx, gy + gh - c.added * sc, gw, c.left * sc); }
    ctx.strokeStyle = col.good; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(gx - 6, gy + gh - c.cap * sc); ctx.lineTo(gx + gw + 6, gy + gh - c.cap * sc); ctx.stroke();
    text(ctx, 'limit', gx + gw + 8, Math.max(gy + 8, gy + gh - c.cap * sc - 9), { color: col.good, size: 10.5, weight: 700 });
    text(ctx, 'sugar (g)', gx + gw / 2, gy + gh + 11, { color: col.muted, size: 10, align: 'center' });
  };
  say();
}
