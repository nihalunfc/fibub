// Class 11 Maths, Probability: tossing n coins gives 2^n equally likely outcomes. "At least one head" is every outcome except the single one with no heads, so P = 1 - 1/2^n:
// counting the complement is often much shorter than counting the event itself.
import { canvas, text, title, row, slider, readout, choice } from '../../kit.js';

const EV = { one: ['At least one head', (s) => s.includes('H')], two: ['Exactly two heads', (s) => (s.match(/H/g) || []).length === 2], same: ['All the same', (s) => /^(H+|T+)$/.test(s)] };
export default function (host) {
  let n = 3, k = 'one';
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 270, label: 'All the outcomes of tossing n coins with those in the chosen event highlighted' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'number of coins n', min: 1, max: 5, step: 1, value: n, fmt: String, oninput: (v) => { n = v; cv.redraw(); } });
  choice(ctl, 'Event', Object.entries(EV).map(([i, v]) => [i, v[0]]), k, (v) => { k = v; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `${n} coin${n > 1 ? 's' : ''}: ${2 ** n} equally likely outcomes`, col), N = 2 ** n, cols = n <= 2 ? 4 : n === 3 ? 4 : n === 4 ? 4 : 8, rows = Math.ceil(N / cols);
    const cw = (w - 24) / cols, ch = Math.min(cw * 0.62, (h - top - 40) / rows - 4); let cnt = 0;
    for (let i = 0; i < N; i++) {
      const s = [...Array(n)].map((_, j) => ((i >> (n - 1 - j)) & 1 ? 'T' : 'H')).join(''), inE = EV[k][1](s); if (inE) cnt++;
      const c = i % cols, r = Math.floor(i / cols), x = 12 + c * cw, y = top + 12 + r * (ch + 4);
      ctx.fillStyle = inE ? col.s[0] : col.soft; ctx.globalAlpha = inE ? 0.85 : 1; ctx.beginPath(); ctx.roundRect(x + 2, y, cw - 4, ch, 6); ctx.fill(); ctx.globalAlpha = 1;
      text(ctx, s, x + cw / 2, y + ch / 2, { color: inE ? col.panel : col.muted, size: Math.min(15, ch * 0.5), weight: 700, align: 'center' });
    }
    const comp = N - cnt;
    ro.innerHTML = `<b>${EV[k][0]}</b>: ${cnt} of ${N} outcomes, so P = <b>${cnt}/${N} = ${+(cnt / N).toFixed(4)}</b>. The other ${comp} outcome${comp === 1 ? ' makes' : 's make'} the complement: ${cnt} + ${comp} = ${N}, so P(E) = 1 − ${comp}/${N}.${k === 'one' ? ` Only <b>${'T'.repeat(n)}</b> has no head, so P(at least one head) = 1 − 1/${N}.` : ''}`;
  };
  cv.redraw();
}
