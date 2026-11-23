// Class 8 Number Play: divisibility tests worked digit by digit. For 3 and 9 the digits are added (a running sum), for 11
// they are added with alternating signs, for 4 and 5 only the last digits matter. Maths: 10 leaves remainder 1 when divided by 3 or 9,
// and remainder -1 when divided by 11, so every digit only counts once (or with its sign).
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let N = 4728, rule = 3;
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 270, label: 'The digits of a number with a running sum that shows whether it divides by 3, 4, 5, 9 or 11' });
  const ctl = row(host);
  slider(ctl, { label: 'Number', min: 100, max: 99999, step: 1, value: N, fmt: (v) => String(Math.round(v)), oninput: (v) => { N = Math.round(v); upd(); } });
  choice(ctl, 'Test for', [[3, '3'], [9, '9'], [11, '11'], [4, '4'], [5, '5']], rule, (v) => { rule = v; upd(); });
  const out = readout(host);
  const verdict = () => {
    const ds = String(N).split('').map(Number), k = ds.length;
    if (rule === 3 || rule === 9) { const s = ds.reduce((a, b) => a + b, 0); return { s, ok: s % rule === 0, run: ds.map((_, i) => ds.slice(0, i + 1).reduce((a, b) => a + b, 0)), what: 'digit sum ' + s }; }
    if (rule === 11) { const t = ds.map((d, i) => ((k - 1 - i) % 2 ? -d : d)); const s = t.reduce((a, b) => a + b, 0); return { s, ok: ((s % 11) + 11) % 11 === 0, run: t.map((_, i) => t.slice(0, i + 1).reduce((a, b) => a + b, 0)), what: 'alternating sum ' + s, t }; }
    if (rule === 4) { const l = N % 100; return { s: l, ok: l % 4 === 0, what: 'last two digits ' + String(l).padStart(2, '0') }; }
    const l = N % 10; return { s: l, ok: l % 5 === 0, what: 'last digit ' + l };
  };
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Is ' + N + ' divisible by ' + rule + '?', col), ds = String(N).split('').map(Number), k = ds.length, v = verdict();
    const bw = Math.min(56, (w - 24) / k), x0 = (w - bw * k) / 2, y0 = t + 26;
    ds.forEach((d, i) => {
      const x = x0 + i * bw, last = k - 1 - i, hi = (rule === 4 && last < 2) || (rule === 5 && last < 1) || rule === 3 || rule === 9 || rule === 11;
      ctx.save(); ctx.globalAlpha = hi ? 0.35 : 0.08; ctx.fillStyle = rule === 11 ? (last % 2 ? col.s[3] : col.s[0]) : col.s[0]; ctx.fillRect(x + 2, y0, bw - 4, bw * 0.9); ctx.restore();
      ctx.strokeStyle = col.ink; ctx.lineWidth = 1.2; ctx.strokeRect(x + 2, y0, bw - 4, bw * 0.9);
      text(ctx, String(d), x + bw / 2, y0 + bw * 0.45, { color: col.ink, size: Math.min(24, bw * 0.55), weight: 700, align: 'center' });
      if (rule === 11) text(ctx, last % 2 ? '−' : '+', x + bw / 2, y0 - 8, { color: last % 2 ? col.s[3] : col.s[0], size: 15, weight: 700, align: 'center' });
      if (v.run) text(ctx, String(v.run[i]), x + bw / 2, y0 + bw * 0.9 + 22, { color: col.s[2], size: Math.min(18, bw * 0.45), weight: 700, align: 'center' });
    });
    if (v.run) text(ctx, 'running total ↓', w / 2, y0 + bw * 0.9 + 46, { color: col.muted, size: 11, align: 'center' });
    const y = h - 58;
    text(ctx, v.what, w / 2, y, { color: col.ink, size: 15, weight: 700, align: 'center' });
    text(ctx, v.ok ? 'Yes: ' + N + ' is divisible by ' + rule : 'No: ' + N + ' is not divisible by ' + rule, w / 2, y + 26, { color: v.ok ? col.s[2] : col.s[3], size: 15, weight: 700, align: 'center' });
  };
  function upd() { const v = verdict(); out.innerHTML = `Check by dividing: ${N} ÷ ${rule} leaves remainder <b>${N % rule}</b>. The rule says ${v.ok ? 'divisible' : 'not divisible'}: they agree.`; cv.redraw(); }
  upd();
}
