// Class 10 How do Organisms Reproduce? Variation: every copy of the DNA is almost exact, but now and then a small error
// gives the copy a slightly different trait. Here the trait is heat tolerance (0 to 1). When a heat wave comes, only
// organisms above 0.6 survive. With no copying errors all individuals are identical and a single heat wave wipes out
// the whole population; with some errors a few individuals are different, so some survive and the species continues.
import { canvas, text, title, dot, row, slider, button, readout, rng, clamp } from '../../kit.js';

export default function (host) {
  const R = rng(11), COLS = 8, CAP = 32, LIMIT = 0.6;
  let pop = Array(8).fill(0.5), gen = 0, dead = [], flash = 0, p = 0.3;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 290, label: 'A population of organisms, each shaded by heat tolerance, copying and facing a heat wave' });
  const ctl = row(host);
  slider(ctl, { label: 'Copying errors', min: 0, max: 0.8, step: 0.05, value: p, fmt: (v) => Math.round(v * 100) + '%', oninput: (v) => { p = v; } });
  button(ctl, 'Make copies', () => { copyGen(); });
  button(ctl, 'Heat wave', () => { heatWave(); });
  button(ctl, 'Reset', () => { pop = Array(8).fill(0.5); gen = 0; dead = []; flash = 0; say('Eight identical organisms. Press “Make copies” a few times, then send a heat wave.'); });
  const out = readout(host);
  function copyGen() {
    const kids = [];
    pop.forEach((v) => { kids.push(v); kids.push(R() < p ? clamp(v + (R() - 0.5) * 0.5, 0, 1) : v); });
    while (kids.length > CAP) kids.splice(Math.floor(R() * kids.length), 1);
    pop = kids; gen++; dead = [];
    const tough = pop.filter((v) => v >= LIMIT).length;
    say(`Generation ${gen}: ${pop.length} organisms, ${tough} of them able to survive a heat wave.`);
  }
  function heatWave() {
    const before = pop.length; dead = pop.filter((v) => v < LIMIT); pop = pop.filter((v) => v >= LIMIT); flash = 1;
    say(pop.length ? `Heat wave! ${before - pop.length} of ${before} died. The ${pop.length} survivors pass on their heat tolerance, so the species continues.` : 'Heat wave! Every organism was identical and none could cope: the whole population is gone. Reset and try again with some copying errors.');
    if (!pop.length) { pop = []; }
  }
  function say(s) { out.textContent = s; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Variation from small copying errors', col) + 10, cs = w / COLS, r = cs * 0.32;
    if (flash > 0) { ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.12 * flash; ctx.fillRect(0, top - 6, w, h); ctx.globalAlpha = 1; flash = Math.max(0, flash - 0.01); if (flash > 0) setTimeout(() => cv.redraw(), 30); }
    pop.forEach((v, i) => {
      const x = cs * (i % COLS + 0.5), y = top + 12 + cs * (Math.floor(i / COLS) + 0.5);
      ctx.save(); ctx.globalAlpha = 0.12 + 0.88 * v; dot(ctx, x, y, r, col.s[2]); ctx.restore();
      ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.strokeStyle = v >= LIMIT ? col.ink : col.muted; ctx.lineWidth = v >= LIMIT ? 2.2 : 1; ctx.stroke();
    });
    dead.slice(0, 16).forEach((v, i) => text(ctx, '✕', w - 14 - (i % 8) * 14, h - 50 - Math.floor(i / 8) * 14, { color: col.muted, size: 12, align: 'center' }));
    if (dead.length) text(ctx, 'died in the heat wave', w - 8, h - 82, { color: col.muted, size: 10, align: 'right' });
    text(ctx, 'Darker fill = more heat tolerance. Thick outline = survives the heat wave (above 0.6).', w / 2, h - 12, { color: col.muted, size: 10, align: 'center' });
    text(ctx, `Generation ${gen}`, 10, h - 36, { color: col.ink, size: 11.5, weight: 700 });
  };
  say('Eight identical organisms. Press “Make copies” a few times, then send a heat wave.');
}
