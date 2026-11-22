// Describe a line graph (made-up data): the line has four stretches. Tap a stretch on the chart (or its button), then pick
// the trend words that describe it. Right choices colour the stretch and build the summary sentences below.
import { canvas, text, title, axes, line, row, choice, readout } from '../kit.js';
import { box, chip } from './_lang.js';

const PTS = [[2000, 10], [2005, 45], [2010, 47], [2015, 38], [2020, 52]];
const SEG = ['rose sharply', 'levelled off', 'fell slightly', 'recovered steadily'];
const BANK = ['rose sharply', 'levelled off', 'fell slightly', 'recovered steadily', 'plunged', 'fluctuated'];
const WHY = ['10 to 45 is a big, fast rise.', '45 to 47 is almost flat.', '47 to 38 is a small drop.', '38 to 52 climbs again without a jump.', '', ''];
export default function (host) {
  let sel = 0; const done = [];
  const cv = canvas(host, { aspect: 0.65, max: 270, min: 220, label: 'A made-up line graph of internet users with four stretches' });
  const ctl = row(host), bank = box(host, 'margin:4px 0;'), sum = box(host, 'font-size:14px;line-height:1.5;margin:4px 0;'), out = readout(host);
  choice(ctl, 'Stretch', SEG.map((_, i) => [i, `${PTS[i][0]}-${String(PTS[i + 1][0]).slice(2)}`]), sel, (v) => { sel = v; cv.redraw(); });
  const sx = (W) => (x) => 54 + (x - 2000) / 20 * (W - 54 - 14);
  cv.c.addEventListener('click', (e) => { const r = cv.c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * cv.w, f = sx(cv.w); for (let i = 0; i < 4; i++) if (x >= f(PTS[i][0]) && x <= f(PTS[i + 1][0])) { sel = i; out.textContent = `Stretch ${PTS[i][0]} to ${PTS[i + 1][0]} selected. Which words describe it?`; cv.redraw(); } });
  BANK.forEach((b) => chip(bank, b, () => {
    if (done[sel] !== undefined) { out.textContent = 'That stretch is done. Pick another stretch.'; return; }
    if (b === SEG[sel]) { done[sel] = b; out.textContent = 'Yes: ' + WHY[sel]; sum.textContent = 'Number of users (millions): ' + PTS.slice(0, 4).map((p, i) => (done[i] ? `from ${p[0]} to ${PTS[i + 1][0]} it ${done[i]}` : null)).filter(Boolean).join('; ') + '.'; sel = Math.max(0, [0, 1, 2, 3].find((i) => done[i] === undefined) ?? sel); }
    else out.textContent = `"${b}" does not match ${PTS[sel][1]} to ${PTS[sel + 1][1]}. ${b === 'plunged' ? '"Plunged" means a very big, fast fall.' : b === 'fluctuated' ? '"Fluctuated" means up and down repeatedly; this stretch moves one way.' : 'Look at the size and direction of the change.'}`;
    cv.redraw();
  }));
  cv.draw = (ctx, W, H, col) => {
    title(ctx, 'Internet users (made-up data, millions)', col);
    const a = axes(ctx, W, H, col, { x: [2000, 2020], y: [0, 60], l: 40, t: 28, xt: [2000, 2005, 2010, 2015, 2020], yt: [0, 20, 40, 60], fx: String, fy: String, xlabel: 'Year' });
    for (let i = 0; i < 4; i++) {
      const p = [[a.X(PTS[i][0]), a.Y(PTS[i][1])], [a.X(PTS[i + 1][0]), a.Y(PTS[i + 1][1])]];
      if (i === sel) { ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.18; ctx.fillRect(p[0][0], a.T, p[1][0] - p[0][0], a.B - a.T); ctx.globalAlpha = 1; }
      line(ctx, p, done[i] ? col.good : col.s[0], i === sel ? 4 : 3);
      if (done[i]) text(ctx, done[i], (p[0][0] + p[1][0]) / 2, Math.min(p[0][1], p[1][1]) - 12, { color: col.good, size: 10.5, weight: 700, align: 'center' });
    }
    PTS.forEach(([x, y]) => { ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.arc(a.X(x), a.Y(y), 3.5, 0, 7); ctx.fill(); });
  };
  out.textContent = 'Tap a stretch of the line, then pick the words that describe it.'; cv.redraw();
}
