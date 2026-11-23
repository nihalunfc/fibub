// Class 8 Ecosystems: decomposers at work. Fungi, bacteria and soil animals (earthworms, termites) break dead leaves into simple
// nutrients that go back into the soil for plants. The leaf mass left follows M = M0 x exp(-k t); k is bigger when it is warm and
// moist (decomposers thrive) and tiny when cold or dry. Rates here are illustrative, chosen so a leaf is mostly gone in about 2 months in the monsoon.
import { canvas, text, title, line, dot, row, slider, choice, readout, loop, rng } from '../../kit.js';

const K = { monsoon: 0.05, cool: 0.02, dry: 0.006 }, NM = { monsoon: 'Warm and damp (monsoon)', cool: 'Cool', dry: 'Hot and dry' };
export default function (host) {
  let day = 20, cond = 'monsoon', t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A fallen leaf shrinking over days as decomposers return nutrients to the soil' });
  const ctl = row(host);
  choice(ctl, 'Weather', [['monsoon', 'Warm & damp'], ['cool', 'Cool'], ['dry', 'Hot & dry']], cond, (v) => { cond = v; say(); });
  const sl = slider(ctl, { label: 'Days since the leaf fell', min: 0, max: 90, step: 1, value: day, fmt: (v) => `${v} days`, oninput: (v) => { day = v; say(); } });
  const an = loop(host, (dt) => { t += dt; if (an.playing) { day = (day + dt * 6) % 90; sl.set(Math.round(day)); say(); } else cv.redraw(); }, { autoplay: false }); an.button(ctl);
  const out = readout(host);
  const R = rng(14), B = []; for (let i = 0; i < 18; i++) B.push([R(), R(), R() * 6.3]);
  const left = () => Math.exp(-K[cond] * day);
  function say() { const m = left(); out.innerHTML = `${NM[cond]}, day ${Math.round(day)}: <b>${Math.round(m * 100)}%</b> of the leaf is left and <b>${Math.round((1 - m) * 100)}%</b> has become nutrients in the soil. ${cond === 'dry' ? 'Dry weather slows the decomposers, so dead leaves pile up.' : cond === 'cool' ? 'Cold slows them down.' : 'Warm, damp soil is full of active fungi and bacteria.'}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'A leaf is eaten by decomposers', col);
    const m = left(), gy = h * 0.62, cx = w * 0.34;
    ctx.fillStyle = col.line; ctx.fillRect(0, gy, w, h - gy); line(ctx, [[0, gy], [w, gy]], col.ink, 2); text(ctx, 'soil', 10, gy + 14, { color: col.muted, size: 10.5 });
    const sc = Math.sqrt(m) * Math.min(w * 0.17, h * 0.22);
    ctx.save(); ctx.translate(cx, gy - 6); ctx.fillStyle = m > 0.6 ? col.s[2] : col.warn; ctx.globalAlpha = 0.3 + 0.7 * m; ctx.beginPath(); ctx.moveTo(-sc, 0); ctx.quadraticCurveTo(0, -sc * 0.9, sc, 0); ctx.quadraticCurveTo(0, sc * 0.35, -sc, 0); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
    const nb = Math.round(3 + 15 * K[cond] / 0.05 * (m > 0.05 ? 1 : 0.2));
    for (let i = 0; i < Math.min(18, nb); i++) { const b = B[i], x = cx + (b[0] - 0.5) * (sc * 2 + 24) + 3 * Math.sin(t * 2 + b[2]), y = gy - 4 + (b[1] * 14) * 1 + 2 * Math.cos(t * 2 + b[2]); dot(ctx, x, y, 2.4, i % 3 ? col.s[3] : col.s[1]); }
    text(ctx, 'bacteria, fungi, worms', cx, gy + 28, { color: col.muted, size: 10, align: 'center' });
    // nutrient bar
    const bx = w * 0.72, bw = 34, by = 48, bh = gy - 76;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(bx, by, bw, bh); ctx.fillStyle = col.s[2]; ctx.fillRect(bx, by + bh * m, bw, bh * (1 - m)); ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.5; ctx.fillRect(bx, by, bw, bh * m); ctx.globalAlpha = 1;
    text(ctx, 'leaf left', bx + bw + 6, by + bh * m * 0.5, { color: col.ink, size: 10 }); text(ctx, 'nutrients in soil', bx + bw / 2, by + bh + 14, { color: col.s[2], size: 10, weight: 700, align: 'center' });
    for (let i = 0; i < 3; i++) { const k = (t * 0.5 + i / 3) % 1; ctx.save(); ctx.globalAlpha = (1 - m) * (1 - k); dot(ctx, cx + 30 + i * 10, gy + 6 - k * 38, 3, col.s[2]); ctx.restore(); }
  };
  say();
}
