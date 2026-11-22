// 10.1 Temperature, top-p and the other dials: four candidate next words after "The weather today is".
// Steps: the raw scores, chances at T = 1, sharper at T = 0.5, flatter at T = 1.5, then top-p 0.9 at T = 1
// drops the long tail and shares its chance out among the words that are left.
import { canvas, title, text, loop, calm, ease } from '../../kit.js';

const W = ['sunny', 'cloudy', 'rainy', 'purple'], S = [2, 1.5, 1, -1];
const soft = (T) => { const e = S.map((s) => Math.exp(s / T)), t = e.reduce((a, b) => a + b, 0); return e.map((v) => v / t); };
const P1 = soft(1), P05 = soft(0.5), P15 = soft(1.5);
const KEEP = P1.slice(0, 3).reduce((a, b) => a + b, 0), TOPP = [...P1.slice(0, 3).map((v) => v / KEEP), 0];
const STEPS = [
  { t: 'Scores for the next word', v: S.map((s) => (s + 1) / 3), lab: S.map((s) => `score ${s}`) },
  { t: 'T = 1: scores become chances', v: P1, lab: P1.map((p) => pc(p)) },
  { t: 'T = 0.5: the leader pulls ahead', v: P05, lab: P05.map((p) => pc(p)) },
  { t: 'T = 1.5: chances even out', v: P15, lab: P15.map((p) => pc(p)) },
  { t: 'top-p 0.9: drop the tail', v: TOPP, lab: TOPP.map((p, i) => (i === 3 ? 'cut' : pc(p))) },
];
function pc(p) { return (p < 0.01 ? (p * 100).toFixed(1) : Math.round(p * 1000) / 10) + '%'; }

export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 330, min: 230, label: 'Bar chart of the chances of four next words at different temperatures and with top-p' });
  let step = 0, prev = STEPS[0].v, k = 1;
  const anim = loop(host, (dt) => { k = Math.min(1, k + dt / 0.7); cv.redraw(); if (k >= 1) anim.pause(); }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const st = STEPS[step], e = ease(k), max = step === 0 ? 1 : Math.max(...STEPS.slice(1).flatMap((s) => s.v));
    const ty = title(ctx, st.t, col);
    text(ctx, '"The weather today is ..."', 10, ty + 6, { color: col.muted, size: 12 });
    const L = 66, R = w - 70, top = ty + 22, gap = (h - top - 12) / 4;
    W.forEach((word, i) => {
      const y = top + i * gap, bh = Math.min(24, gap - 8), v = prev[i] + (st.v[i] - prev[i]) * e;
      const cut = step === 4 && i === 3;
      text(ctx, word, 10, y + bh / 2, { color: cut ? col.muted : col.ink, size: 12.5, weight: 600 });
      ctx.fillStyle = col.soft; ctx.fillRect(L, y, R - L, bh);
      ctx.fillStyle = i === 0 ? col.s[0] : col.s[1];
      ctx.fillRect(L, y, Math.max(0, (R - L) * (v / max)), bh);
      if (cut) { ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(L, y + bh / 2); ctx.lineTo(R, y + bh / 2); ctx.stroke(); }
      text(ctx, st.lab[i], R + 6, y + bh / 2, { color: cut ? col.muted : col.ink, size: 12, weight: 600 });
    });
  };
  cv.redraw();
  return { step(i) { prev = STEPS[step].v; if (i === 1 && step === 0) prev = [0, 0, 0, 0]; step = i; k = calm() ? 1 : 0; cv.redraw(); if (k < 1) anim.play(); } };
}
