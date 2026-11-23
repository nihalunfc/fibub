// Class 8 Number Play: Kaprekar's routine. Take a 4-digit number (not all digits the same), arrange its digits largest-first and
// smallest-first, subtract, and repeat. Almost every start falls into 6174 within 7 steps, and 6174 maps to itself.
import { canvas, text, title, row, slider, button, readout } from '../../kit.js';

export default function (host) {
  let N = 3524, hist = [N];
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'Kaprekar routine steps from a four digit number down to 6174' });
  const ctl = row(host);
  slider(ctl, { label: 'Start', min: 1000, max: 9999, step: 1, value: N, fmt: (v) => String(Math.round(v)), oninput: (v) => { N = Math.round(v); hist = [N]; upd(); } });
  button(ctl, 'Step', () => step());
  button(ctl, 'Run to the end', () => { for (let i = 0; i < 9 && !done(); i++) step(true); upd(); });
  button(ctl, 'Reset', () => { hist = [N]; upd(); });
  const out = readout(host);
  const pad = (n) => String(n).padStart(4, '0');
  const parts = (n) => { const ds = pad(n).split('').sort(); return [+ds.slice().reverse().join(''), +ds.join('')]; };
  const same = (n) => new Set(pad(n)).size === 1;
  const done = () => same(hist[0]) || hist[hist.length - 1] === 6174 || hist.length > 9;
  function step(q) { if (done()) return; const [hi, lo] = parts(hist[hist.length - 1]); hist.push(hi - lo); if (!q) upd(); }
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, "Kaprekar's routine", col);
    if (same(hist[0])) { text(ctx, 'All four digits are the same:', w / 2, h / 2 - 10, { color: col.s[3], size: 14, weight: 700, align: 'center' }); text(ctx, 'the answer is 0000. Pick another start.', w / 2, h / 2 + 12, { color: col.muted, size: 13, align: 'center' }); return; }
    let y = t + 20; const lh = Math.min(30, (h - t - 50) / 9);
    text(ctx, 'start: ' + pad(hist[0]), 16, y, { color: col.ink, size: 15, weight: 700 }); y += lh;
    for (let i = 1; i < hist.length; i++) {
      const [hi, lo] = parts(hist[i - 1]), r = hist[i];
      text(ctx, 'step ' + i + ':  ' + pad(hi) + ' − ' + pad(lo) + ' = ', 16, y, { color: col.muted, size: 14 });
      text(ctx, pad(r), w - 16, y, { color: r === 6174 ? col.s[2] : col.ink, size: 16, weight: 700, align: 'right' }); y += lh;
    }
    if (hist[hist.length - 1] === 6174) text(ctx, '6174 reached. One more step gives 6174 again.', w / 2, h - 18, { color: col.s[2], size: 13, weight: 700, align: 'center' });
  };
  function upd() { const l = hist[hist.length - 1]; out.textContent = l === 6174 ? `Reached 6174 in ${hist.length - 1} step(s). Try other starts: it always lands here.` : `Press Step to subtract the smallest arrangement from the largest. Steps so far: ${hist.length - 1}.`; cv.redraw(); }
  upd();
}
