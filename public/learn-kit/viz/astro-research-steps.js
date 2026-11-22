// The path of a small astronomy project, one step at a time: question, find data, read it, clean it, measure, estimate the
// uncertainty, and share. Press the steps or tap a box. Each box shows a made-up example of what you would have at that stage (the
// numbers are invented for illustration, not from a real star).
import { canvas, text, row, button, readout, title } from '../kit.js';

const S = [
  ['1 Question', 'Does the star V-Example change brightness every few days?', 'Write one question you can answer with data. Keep it small: "does it vary?", not "how do stars work?".'],
  ['2 Find data', 'Archive search: 120 images, 2020 to 2023', 'Search an open archive by position (cone search). Note the survey, filters and dates.'],
  ['3 Read it', 'FITS file: 2048×2048 pixels, header says filter V, exposure 30 s', 'Open the file in Python (astropy). Read the header before you trust the pixels.'],
  ['4 Clean it', 'Bias, dark and flat applied; sky level 312 counts', 'Calibrate the frames. Check the picture: look for trails, hot pixels and saturation.'],
  ['5 Measure', 'Star flux 18,450 counts in a 6 px circle, comparison star 21,100', 'Aperture photometry on the target and a steady comparison star. Brightness = −2.5 log₁₀(ratio).'],
  ['6 Uncertainty', 'Mean 12.35 ± 0.02 mag; changes up to 0.31 mag between nights', 'Estimate the error of each point (photon noise, background). A change must be bigger than the scatter to count.'],
  ['7 Share', 'Period search finds 4.2 days; plot + method note posted', 'Plot, say what you did and what you did not check, and share the data so others can repeat it.'],
];
export default function (host) {
  let i = 0;
  const cv = canvas(host, { aspect: 0.7, max: 360, min: 280, label: 'Seven boxes in a row showing the stages of an astronomy project' });
  const c1 = row(host);
  button(c1, '← Back', () => go(i - 1)); button(c1, 'Next →', () => go(i + 1));
  const out = readout(host);
  const go = (k) => { i = Math.max(0, Math.min(S.length - 1, k)); show(); };
  function show() { out.innerHTML = `<b>${S[i][0]}.</b> ${S[i][2]}`; cv.redraw(); }
  cv.c.addEventListener('click', (e) => { const b = cv.c.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top; if (y < 90) go(Math.min(S.length - 1, Math.floor((x / b.width) * S.length))); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'From question to result', col);
    const n = S.length, bw = (w - 20) / n, y = 40;
    S.forEach((s, k) => { const x = 10 + k * bw; ctx.fillStyle = k === i ? col.s[1] : k < i ? col.s[2] : col.soft; ctx.globalAlpha = k <= i ? 0.9 : 1; ctx.fillRect(x + 2, y, bw - 4, 44); ctx.globalAlpha = 1; text(ctx, String(k + 1), x + bw / 2, y + 22, { color: k <= i ? '#000' : col.ink, size: 15, weight: 700, align: 'center' }); });
    text(ctx, S[i][0].replace(/^\d /, ''), w / 2, y + 66, { color: col.ink, size: 14, weight: 700, align: 'center' });
    // example card
    ctx.fillStyle = col.soft; ctx.fillRect(14, y + 86, w - 28, h - y - 110); ctx.strokeStyle = col.line; ctx.strokeRect(14, y + 86, w - 28, h - y - 110);
    text(ctx, 'Example at this stage (made up):', 24, y + 104, { color: col.muted, size: 10.5 });
    const words = S[i][1].split(' '); let ln = '', yy = y + 128; const max = w - 56; ctx.font = '13px system-ui';
    words.forEach((wd) => { const t = ln ? ln + ' ' + wd : wd; if (ctx.measureText(t).width > max && ln) { text(ctx, ln, 24, yy, { color: col.ink, size: 13, fit: false }); ln = wd; yy += 19; } else ln = t; });
    text(ctx, ln, 24, yy, { color: col.ink, size: 13, fit: false });
  };
  show();
  return { step(k) { go(k); } };
}
