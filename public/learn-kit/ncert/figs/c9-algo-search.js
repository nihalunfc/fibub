// Class 9 Algorithms: linear search versus binary search. A hidden number is in the sorted list 1 to 100. Linear search checks 1, 2, 3, ...
// Binary search always checks the middle of what is left and throws away half, so 100 numbers need at most 7 guesses (2^7 = 128 > 100).
import { canvas, text, title, row, slider, choice, button, readout } from '../../kit.js';

export default function (host) {
  let secret = 63, method = 'bin', lo = 1, hi = 100, guess = 0, count = 0, done = false, tried = [];
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'A grid of the numbers 1 to 100 showing which numbers a search has ruled out' });
  const c = row(host);
  slider(c, { label: 'Hidden number', min: 1, max: 100, step: 1, value: secret, oninput: (v) => { secret = v; reset(); } });
  choice(c, 'Method', [['lin', 'Linear'], ['bin', 'Binary']], method, (v) => { method = v; reset(); });
  const c2 = row(host); button(c2, 'Next guess', () => step()); button(c2, 'Run to the end', () => { let g = 0; while (!done && g++ < 120) step(true); upd(); }); button(c2, 'Reset', () => reset());
  const out = readout(host);
  function reset() { lo = 1; hi = 100; guess = 0; count = 0; done = false; tried = []; upd(); }
  function step(quiet) {
    if (done) return;
    if (method === 'lin') { guess = guess + 1; } else { guess = Math.floor((lo + hi) / 2); }
    count++; tried.push(guess);
    if (guess === secret) done = true; else if (method === 'bin') { if (guess < secret) lo = guess + 1; else hi = guess - 1; }
    if (!quiet) upd();
  }
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, (method === 'lin' ? 'Linear' : 'Binary') + ' search: ' + count + ' guesses', col), g = Math.min((w - 24) / 10, (h - t - 40) / 10), ox = (w - g * 10) / 2;
    for (let v = 1; v <= 100; v++) {
      const x = ox + ((v - 1) % 10) * g, y = t + 12 + Math.floor((v - 1) / 10) * g, out2 = method === 'bin' ? (v < lo || v > hi) : v <= (done ? 0 : guess), was = tried.includes(v);
      ctx.save(); ctx.fillStyle = v === secret && done ? col.s[2] : was ? col.s[3] : out2 ? col.line : col.s[0]; ctx.globalAlpha = v === secret && done ? 0.9 : was ? 0.85 : out2 ? 0.5 : 0.28; ctx.fillRect(x + 1, y + 1, g - 2, g - 2); ctx.restore();
      if (g > 20) text(ctx, String(v), x + g / 2, y + g / 2, { color: out2 && !was ? col.muted : col.ink, size: 10, weight: was ? 700 : 400, align: 'center' });
    }
    text(ctx, done ? 'Found ' + secret + ' in ' + count + ' guesses' : (method === 'bin' ? 'Left to search: ' + (hi - lo + 1) + ' numbers' : 'Last checked: ' + (guess || '–')), w / 2, h - 14, { color: done ? col.s[2] : col.ink, size: 13, weight: 700, align: 'center' });
  };
  function upd() { out.innerHTML = count === 0 ? `Hidden number ${secret}. ${method === 'lin' ? 'Linear search checks 1, 2, 3 ... in order.' : 'Binary search guesses the middle and asks: too high or too low?'} Press <b>Next guess</b>.` : done ? `Found <b>${secret}</b> after <b>${count}</b> guesses. ${method === 'lin' ? 'Linear search needs up to 100 guesses.' : 'Binary search never needs more than 7 for 100 numbers.'}` : `Guess ${count}: ${guess}. ` + (method === 'bin' ? (guess < secret ? 'Too low: throw away everything up to ' + guess + '.' : 'Too high: throw away everything from ' + guess + ' up.') : 'Not it. Next.'); cv.redraw(); }
  upd();
}
