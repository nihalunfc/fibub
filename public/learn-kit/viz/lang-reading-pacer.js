// Time budget for each paper. Pick a paper and press Play: the clock runs at one minute per second, and the bar shows which
// part you should be on. Use it to learn the pace before you try a timed paper. Times are the standard IELTS timings.
import { canvas, text, title, row, choice, readout, loop, button } from '../kit.js';

const P = {
  read: { name: 'Reading (Academic): 60 min, 40 questions', segs: [['Passage 1', 17, 'q1-13'], ['Passage 2', 20, 'q14-26'], ['Passage 3', 23, 'q27-40; keep the last 2 min to check']], tip: 'There is no extra time to copy answers, so write them on the answer sheet as you go.' },
  write: { name: 'Writing: 60 min, 2 tasks', segs: [['Task 1: plan 3, write 15, check 2', 20, 'at least 150 words'], ['Task 2: plan 5, write 30, check 5', 40, 'at least 250 words']], tip: 'Task 2 counts for twice as much as Task 1, so do not spend more than 20 minutes on Task 1.' },
  listen: { name: 'Listening: about 30 min, 40 questions', segs: [['Section 1', 7.5, 'q1-10'], ['Section 2', 7.5, 'q11-20'], ['Section 3', 7.5, 'q21-30'], ['Section 4', 7.5, 'q31-40']], tip: 'The recording plays once. On paper you get 10 extra minutes to copy answers; on computer you get 2 minutes to check.' },
};
export default function (host) {
  let k = 'read', t = 0;
  const cv = canvas(host, { aspect: 0.5, max: 230, min: 190, label: 'A timeline of the paper with a moving clock' });
  const ctl = row(host), out = readout(host);
  choice(ctl, 'Paper', [['read', 'Reading'], ['write', 'Writing'], ['listen', 'Listening']], k, (v) => { k = v; t = 0; cv.redraw(); upd(); });
  const anim = loop(host, (dt) => { const T = total(); t = Math.min(T, t + dt * 1.5); if (t >= T) anim.pause(); cv.redraw(); upd(); }, { autoplay: false });
  anim.button(ctl); button(ctl, 'Reset', () => { t = 0; cv.redraw(); upd(); });
  const total = () => P[k].segs.reduce((a, s) => a + s[1], 0);
  const where = () => { let a = 0; for (const s of P[k].segs) { if (t < a + s[1] || s === P[k].segs.at(-1)) return [s, a]; a += s[1]; } };
  const upd = () => { const [s, a] = where(); out.textContent = `${Math.floor(t)} min gone. You should be on: ${s[0]} (${s[2]}), ${Math.max(0, Math.ceil(a + s[1] - t))} min left in this part. ${P[k].tip}`; };
  cv.draw = (ctx, W, H, col) => {
    title(ctx, P[k].name, col);
    const T = total(), x0 = 12, bw = W - 24, y = 70; let a = 0;
    P[k].segs.forEach((s, i) => { const x = x0 + bw * a / T, w = bw * s[1] / T; ctx.fillStyle = col.s[i]; ctx.globalAlpha = t >= a + s[1] ? 0.9 : t >= a ? 0.55 : 0.2; ctx.fillRect(x, y, w - 2, 46); ctx.globalAlpha = 1; text(ctx, s[0], x + w / 2, y + 23, { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel }); text(ctx, s[1] + ' min', x + w / 2, y + 62, { color: col.muted, size: 11, align: 'center' }); a += s[1]; });
    const nx = x0 + bw * t / T; ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(nx, y - 12); ctx.lineTo(nx, y + 52); ctx.stroke();
    text(ctx, Math.floor(t) + ' min', Math.min(W - 30, Math.max(30, nx)), y - 20, { color: col.ink, size: 12, weight: 700, align: 'center' });
  };
  cv.redraw(); upd();
}
