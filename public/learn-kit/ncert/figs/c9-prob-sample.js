// Class 9 Probability: the sample space is the list of all equally likely outcomes. For two coins there are 4
// outcomes and for two dice 36. An event is a group of those outcomes; its probability is
// (outcomes in the event) / (all outcomes). Pick an event and see its cells light up.
import { canvas, text, title, row, choice, readout } from '../../kit.js';

const MODES = {
  coins: { name: 'Two coins', n: 2, ev: { two: ['Two heads', (i, j) => i === 0 && j === 0], one: ['Exactly one head', (i, j) => i !== j], some: ['At least one head', (i, j) => i === 0 || j === 0], same: ['Both the same', (i, j) => i === j] } },
  dice: { name: 'Two dice', n: 6, ev: { seven: ['Sum is 7', (i, j) => i + j + 2 === 7], big: ['Sum is 10 or more', (i, j) => i + j + 2 >= 10], dbl: ['A double', (i, j) => i === j], even: ['Sum is even', (i, j) => (i + j) % 2 === 0], six: ['At least one 6', (i, j) => i === 5 || j === 5] } },
};
export default function (host) {
  let m = 'dice', e = 'seven';
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 290, label: 'A grid of all outcomes of two coins or two dice with the favourable ones highlighted' });
  const ctl = row(host);
  const mc = choice(ctl, 'Experiment', Object.entries(MODES).map(([k, d]) => [k, d.name]), m, (v) => { m = v; e = Object.keys(MODES[m].ev)[0]; build(); sync(); });
  const c2 = row(host);
  const out = readout(host);
  function build() { c2.innerHTML = ''; choice(c2, 'Event', Object.entries(MODES[m].ev).map(([k, d]) => [k, d[0]]), e, (v) => { e = v; sync(); }); }
  function count() { const d = MODES[m], f = d.ev[e][1]; let c = 0; for (let i = 0; i < d.n; i++) for (let j = 0; j < d.n; j++) if (f(i, j)) c++; return [c, d.n * d.n]; }
  function sync() { const [c, t] = count(); out.innerHTML = `Event “${MODES[m].ev[e][0]}”: <b>${c}</b> favourable outcomes out of <b>${t}</b> equally likely, so P = ${c}/${t} = <b>${(c / t).toFixed(3)}</b>.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const d = MODES[m], top = title(ctx, 'All outcomes: ' + d.n * d.n + ' of them', col), N = d.n, s = Math.min((w - 70) / N, (h - top - 60) / N, 48), ox = (w - s * N) / 2 + 12, oy = top + 40, f = d.ev[e][1];
    const lab = (v) => (m === 'coins' ? ['H', 'T'][v] : String(v + 1));
    text(ctx, m === 'coins' ? 'coin 2 →' : 'second die →', ox + (s * N) / 2, oy - 18, { color: col.muted, size: 11, align: 'center' });
    for (let i = 0; i < N; i++) { text(ctx, lab(i), ox + (i + 0.5) * s, oy - 6, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, lab(i), ox - 10, oy + (i + 0.5) * s, { color: col.ink, size: 11, weight: 700, align: 'center' }); }
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) { const on = f(i, j); ctx.fillStyle = on ? col.s[2] : col.soft; ctx.globalAlpha = on ? 0.8 : 1; ctx.fillRect(ox + j * s + 1, oy + i * s + 1, s - 2, s - 2); ctx.globalAlpha = 1; if (s >= 26) text(ctx, m === 'coins' ? lab(i) + lab(j) : (i + 1) + ',' + (j + 1), ox + (j + 0.5) * s, oy + (i + 0.5) * s, { color: on ? col.ink : col.muted, size: s >= 40 ? 12 : 9, weight: on ? 700 : 400, align: 'center' }); }
    text(ctx, 'first ' + (m === 'coins' ? 'coin' : 'die') + ' ↓', ox - 14, oy + N * s + 14, { color: col.muted, size: 11 });
    const [c, t] = count();
    text(ctx, 'P = ' + c + '/' + t, w / 2, h - 14, { color: col.s[3], size: 15, weight: 700, align: 'center' });
  };
  build(); sync();
}
