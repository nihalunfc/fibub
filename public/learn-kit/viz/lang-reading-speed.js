// Reading pace: a made-up passage with a moving highlighter. Set the words per minute and press Play; the readout shows how
// long a passage of 700 or 900 words would take at that speed. Most adults read about 200 to 250 words a minute in a second
// language; the timed papers expect you to find answers by skimming and scanning, not by reading every word slowly.
import { canvas, text, title, row, slider, readout, loop, button } from '../kit.js';
import { wrap } from './_lang.js';

const TXT = 'Tea reached Europe from China in the seventeenth century and quickly became fashionable. At first it was very expensive, so only wealthy families could buy it. Later, ships carried larger loads, prices fell, and ordinary people began to drink it every day. Today, tea is the second most consumed drink in the world after water.';
const WORDS = TXT.split(' ');
export default function (host) {
  let wpm = 200, pos = 0;
  const cv = canvas(host, { aspect: 0.75, max: 290, min: 240, label: 'A passage with a highlighter moving at a chosen reading speed' });
  const ctl = row(host), out = readout(host);
  slider(ctl, { label: 'Speed', min: 80, max: 600, step: 10, value: wpm, fmt: (v) => Math.round(v) + ' words/min', oninput: (v) => { wpm = v; upd(); } });
  const anim = loop(host, (dt) => { pos += dt * wpm / 60; if (pos >= WORDS.length + 3) pos = 0; cv.redraw(); });
  anim.button(ctl); button(ctl, 'Restart', () => { pos = 0; cv.redraw(); });
  const upd = () => { out.textContent = `At ${Math.round(wpm)} words a minute: 700 words take ${(700 / wpm).toFixed(1)} min, 900 words take ${(900 / wpm).toFixed(1)} min, and three passages of 800 words take ${(2400 / wpm).toFixed(0)} min. Compare with the 60 minutes you have for the whole Reading paper.`; };
  cv.draw = (ctx, W, H, col) => {
    title(ctx, 'Reading at ' + Math.round(wpm) + ' words a minute', col);
    const cur = Math.floor(pos);
    wrap(ctx, TXT, 14, 58, W - 28, 24, { color: col.ink, size: 15, style: (w, i) => (i === cur ? { bg: col.s[1], weight: 700 } : i < cur ? { color: col.muted } : null) });
    ctx.fillStyle = col.line; ctx.fillRect(14, H - 22, W - 28, 8); ctx.fillStyle = col.s[0]; ctx.fillRect(14, H - 22, (W - 28) * Math.min(1, cur / WORDS.length), 8);
    text(ctx, `${cur} / ${WORDS.length} words`, 14, H - 32, { color: col.muted, size: 11 });
  };
  upd(); cv.redraw();
}
