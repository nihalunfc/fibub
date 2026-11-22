// Class 10 Heredity: sex determination in humans. Women have two X chromosomes (XX), men have X and Y (XY). Every egg carries
// an X. A sperm carries X or Y with equal chance, so the father's sperm decides the baby's sex: X gives a girl, Y a boy. The
// probability for each child is 1/2, but in a small number of children the tally can be far from half.
import { canvas, text, title, line, dot, row, button, readout, rng } from '../../kit.js';

export default function (host) {
  let boys = 0, girls = 0, last = null, seed = 3;
  const R = rng(99);
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'XX mother and XY father, their children and a tally of boys and girls' });
  const ctl = row(host);
  button(ctl, 'One child', () => add(1)); button(ctl, '20 children', () => add(20)); button(ctl, '200 children', () => add(200)); button(ctl, 'Reset', () => { boys = girls = 0; last = null; say(); });
  const out = readout(host);
  function add(n) { for (let i = 0; i < n; i++) { const y = R() < 0.5; y ? boys++ : girls++; last = y ? 'XY' : 'XX'; } say(); }
  function say() { const N = boys + girls; out.textContent = N ? `${N} children: ${boys} boys and ${girls} girls (${Math.round((boys / N) * 100)}% boys). The chance of a boy is 1/2 each time. A sperm carrying Y gives a boy; one carrying X gives a girl.` : 'Press a button to have children. The egg always has an X. Whether the sperm has X or Y decides the sex.'; cv.redraw(); }
  const chr = (ctx, col, x, y, k, a = 1) => { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = k === 'X' ? col.s[1] : col.s[0]; ctx.beginPath(); ctx.roundRect(x - 7, y - (k === 'X' ? 15 : 10), 14, k === 'X' ? 30 : 20, 7); ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.2; ctx.stroke(); text(ctx, k, x, y, { color: col.panel, size: 11, weight: 700, align: 'center' }); ctx.restore(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Who decides the baby\'s sex?', col) + 12, cs = 54, gx = w / 2 - cs + 20, gy = top + 54;
    text(ctx, 'Father XY: sperm', gx + cs, top + 6, { color: col.muted, size: 10, align: 'center' }); text(ctx, 'Mother XX: eggs', gx - 56, gy - 8, { color: col.muted, size: 10, align: 'center' });
    ['X', 'Y'].forEach((k, i) => chr(ctx, col, gx + cs * i + cs / 2, top + 30, k)); [0, 1].forEach((i) => chr(ctx, col, gx - 20, gy + cs * i + cs / 2, 'X'));
    ['XX', 'XY', 'XX', 'XY'].forEach((g, i) => { const r = Math.floor(i / 2), c = i % 2, x = gx + c * cs, y = gy + r * cs; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x, y, cs, cs); ctx.save(); ctx.globalAlpha = last === g ? 0.4 : 0.18; ctx.fillStyle = g === 'XX' ? col.s[4] : col.s[0]; ctx.fillRect(x, y, cs, cs); ctx.restore(); text(ctx, g, x + cs / 2, y + cs * 0.4, { color: col.ink, size: 15, weight: 700, align: 'center' }); text(ctx, g === 'XX' ? 'girl' : 'boy', x + cs / 2, y + cs * 0.74, { color: col.muted, size: 10.5, align: 'center' }); });
    const by = gy + 2 * cs + 34, N = Math.max(1, boys + girls), bw = w - 60; text(ctx, 'tally', 12, by - 14, { color: col.muted, size: 10 });
    ctx.fillStyle = col.s[0]; ctx.fillRect(30, by, bw * boys / N, 16); ctx.fillStyle = col.s[4]; ctx.fillRect(30 + bw * boys / N, by, bw * girls / N, 16); line(ctx, [[30 + bw / 2, by - 4], [30 + bw / 2, by + 20]], col.ink, 1.5, [3, 2]);
    text(ctx, `boys ${boys}`, 30, by + 32, { color: col.ink, size: 11, weight: 700 }); text(ctx, `girls ${girls}`, 30 + bw, by + 32, { color: col.ink, size: 11, weight: 700, align: 'right' });
  };
  say();
}
