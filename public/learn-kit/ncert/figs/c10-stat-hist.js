// Class 10 Statistics: from raw numbers to a frequency table and a histogram. Press Play and watch each observation
// drop into its class; the bar for a class is as tall as its frequency f. Switch on "class marks" to see the middle
// value x = (lower + upper) / 2 of each class, the single number that stands for the whole class in grouped data.
import { canvas, text, title, row, button, choice, readout, loop, rng } from '../../kit.js';

const DS = {
  runs: { name: 'Runs scored by 40 batters', lo: 0, w: 20, f: [5, 9, 14, 8, 4], what: 'runs' },
  time: { name: 'Minutes 36 students take to reach school', lo: 0, w: 10, f: [4, 9, 12, 7, 4], what: 'minutes' },
  cash: { name: 'Pocket money (₹ per week) of 30 students', lo: 50, w: 50, f: [3, 6, 9, 8, 4], what: '₹' },
};

export default function (host) {
  let key = 'runs', marks = true, k = 0, order = [];
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'A histogram built from a frequency table, with class marks' });
  const ctl = row(host);
  const mk = () => {
    const d = DS[key], r = rng(7), a = [];
    d.f.forEach((c, i) => { for (let j = 0; j < c; j++) a.push(i); });
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    order = a; k = 0;
  };
  choice(ctl, 'Data', [['runs', 'Runs'], ['time', 'School trip'], ['cash', 'Pocket money']], key, (v) => { key = v; mk(); anim.play(); say(); cv.redraw(); });
  choice(ctl, 'Class marks', [[true, 'Show'], [false, 'Hide']], marks, (v) => { marks = v; cv.redraw(); });
  const anim = loop(host, (dt) => { if (k < order.length) { k = Math.min(order.length, k + dt * 9); cv.redraw(); } else anim.pause(); }, {});
  anim.button(ctl);
  button(ctl, 'Restart', () => { mk(); anim.play(); say(); cv.redraw(); });
  const out = readout(host);
  function say() {
    const d = DS[key];
    out.innerHTML = `${d.name}: ${order.length} observations in ${d.f.length} classes of width ${d.w}. Each class is written lower–upper, and its class mark is the middle value.`;
  }
  cv.draw = (ctx, w, h, col) => {
    const d = DS[key], nC = d.f.length, top = title(ctx, d.name, col);
    const L = 30, R = w - 12, bw = (R - L) / nC, B = h - 74, T = top + 16, fmax = Math.max(...d.f) + 1, u = (B - T) / fmax;
    const cnt = d.f.map(() => 0); for (let i = 0; i < Math.floor(k); i++) cnt[order[i]]++;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1;
    for (let g = 0; g <= fmax; g += 2) { const y = B - g * u; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(R, y); ctx.stroke(); text(ctx, String(g), L - 6, y, { color: col.muted, size: 10, align: 'right' }); }
    d.f.forEach((f, i) => {
      const x = L + i * bw, hgt = cnt[i] * u;
      ctx.fillStyle = col.s[i % 2 ? 1 : 0]; ctx.globalAlpha = 0.8; ctx.fillRect(x, B - hgt, bw, hgt); ctx.globalAlpha = 1;
      ctx.strokeStyle = col.panel; ctx.lineWidth = 1; for (let j = 1; j < cnt[i]; j++) { ctx.beginPath(); ctx.moveTo(x, B - j * u); ctx.lineTo(x + bw, B - j * u); ctx.stroke(); }
      ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x, B - hgt, bw, hgt);
      if (cnt[i]) text(ctx, 'f = ' + cnt[i], x + bw / 2, B - hgt - 9, { color: col.ink, size: 11, weight: 700, align: 'center' });
      const lo = d.lo + i * d.w, hi = lo + d.w;
      text(ctx, lo + '–' + hi, x + bw / 2, B + 12, { color: col.ink, size: 11, align: 'center' });
      if (marks) {
        ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.moveTo(x + bw / 2, B + 24); ctx.lineTo(x + bw / 2 - 4, B + 31); ctx.lineTo(x + bw / 2 + 4, B + 31); ctx.fill();
        text(ctx, 'x = ' + (lo + hi) / 2, x + bw / 2, B + 44, { color: col.s[3], size: 11, weight: 700, align: 'center' });
      }
    });
    text(ctx, 'class interval (' + d.what + ')', w / 2, h - 10, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, 'counted ' + Math.floor(k) + ' of ' + order.length, R, top + 4, { color: col.muted, size: 10.5, align: 'right' });
  };
  mk(); say(); cv.redraw();
}
