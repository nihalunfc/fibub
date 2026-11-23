// Class 8 A Story of Numbers: the same number in different bases. In base b you group counters in bundles of b, then bundles
// of b x b, and so on; the digits are how many of each bundle are left. Pick base 2, 5, 8 or 10 and slide the number.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let n = 45, b = 2;
  const cv = canvas(host, { aspect: 0.6, max: 440, min: 250, label: 'A number written in a chosen base with each place value shown' });
  const out = readout(host); const ctl = row(host);
  choice(ctl, 'Base', [[2, '2'], [5, '5'], [8, '8'], [10, '10']], b, (v) => { b = v; sync(); });
  slider(ctl, { label: 'Number', min: 0, max: 255, step: 1, value: n, fmt: (v) => Math.round(v), oninput: (v) => { n = Math.round(v); sync(); } });
  const digs = () => { const o = []; let m = n; do { o.unshift(m % b); m = Math.floor(m / b); } while (m > 0); return o; };
  function sync() { const d = digs(), k = d.length; out.innerHTML = `<b>${n}</b> in base ${b} is <b>${d.join('')}<sub>${b}</sub></b> = ${d.map((x, i) => `${x}×${b}<sup>${k - 1 - i}</sup>`).join(' + ')} = ${n}.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `${n} in base ${b}`, col), d = digs(), k = d.length, cw = Math.min(56, (w - 20) / k), x0 = (w - cw * k) / 2;
    d.forEach((x, i) => {
      const p = k - 1 - i, cx = x0 + i * cw;
      ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.strokeRect(cx + 2, top + 30, cw - 4, 40);
      text(ctx, String(x), cx + cw / 2, top + 50, { color: col.ink, size: 22, weight: 700, align: 'center' });
      text(ctx, `${b}^${p}`, cx + cw / 2, top + 14 + 0, { color: col.muted, size: 10.5, align: 'center' });
      text(ctx, `= ${b ** p}`, cx + cw / 2, top + 84, { color: col.muted, size: 10.5, align: 'center' });
      const sz = Math.max(3, Math.min(8, (cw - 8) / 5, 80 / Math.max(1, Math.ceil(x / 3))));
      for (let j = 0; j < x; j++) { ctx.fillStyle = col.s[p % 6]; ctx.beginPath(); ctx.arc(cx + cw / 2 - sz * 1.2 + (j % 3) * sz * 1.2, top + 104 + Math.floor(j / 3) * sz * 2.1, sz * 0.9, 0, 7); ctx.fill(); }
    });
    text(ctx, 'dots = how many bundles of that size are in the number', w / 2, h - 12, { color: col.muted, size: 10.5, align: 'center' });
  };
  sync();
}
