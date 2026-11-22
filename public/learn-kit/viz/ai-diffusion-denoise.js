// How an image generator draws: it starts from pure noise and removes a little at a time. Play to watch noise turn into a
// picture (a made-up 16×16 heart); or drag "Noise level" to see the forward direction. The model's job is to guess the
// noise in the current image. Raise "Guess error" and its guesses get worse, so the result comes out wrong: this is why
// better models and more steps give cleaner pictures. Here the noise is known exactly when the error is 0.
import { canvas, text, row, slider, button, readout, loop, title, arrow } from '../kit.js';
import { rng } from '../kit.js';
import { gauss } from './_ai.js';

const S = 16, HEART = ['................', '..####....####..', '.######..######.', '.##############.', '.##############.', '.##############.', '..############..', '...##########...', '....########....', '.....######.....', '......####......', '.......##.......', '................', '................', '................', '................'];
const IMG = HEART.flat ? HEART.map((r) => [...r].map((c) => (c === '#' ? 1 : 0))).flat() : [];
const R = rng(6), EPS = IMG.map(() => gauss(R)), EPS2 = IMG.map(() => gauss(R));
export default function (host) {
  let t = 0.98, err = 0.3, steps = 12, auto = false;
  const cv = canvas(host, { aspect: 0.5, max: 300, min: 200, label: 'A noisy image, the model estimate of the clean image, and the target' });
  const ctl = row(host), ctl2 = row(host);
  const ts = slider(ctl, { label: 'Noise level', min: 0.02, max: 0.98, value: t, fmt: (v) => (v * 100).toFixed(0) + '%', oninput: (v) => { t = v; run.cur = null; show(); } });
  slider(ctl, { label: 'Guess error', min: 0, max: 1, value: err, fmt: (v) => v.toFixed(2), oninput: (v) => { err = v; run.cur = null; show(); } });
  slider(ctl2, { label: 'Denoise steps', min: 4, max: 30, step: 1, value: steps, fmt: (v) => Math.round(v), oninput: (v) => { steps = Math.round(v); } });
  const run = { cur: null, i: 0 };
  const anim = loop(host, (dt, tt) => { if (tt - (anim.l || 0) > 0.25) { anim.l = tt; if (run.cur) { run.i++; if (run.i > steps) { anim.pause(); run.cur = null; return; } const tn = 0.98 * (1 - run.i / steps); step(run.cur, tn + 0.02 * 0); t = Math.max(0.02, tn); ts.set(t); show(); } } }, { autoplay: false });
  button(ctl2, '▶ Generate from noise', () => { t = 0.98; run.i = 0; run.cur = IMG.map((_, k) => Math.sqrt(1 - t) * 0 + Math.sqrt(t) * EPS[k] + 0); run.cur = IMG.map((_, k) => Math.sqrt(1 - t) * IMG[k] + Math.sqrt(t) * EPS[k]); run.prev = t; ts.set(t); show(); anim.play(); });
  const out = readout(host);
  const epsHat = (k) => EPS[k] + err * EPS2[k];
  const x0hat = (x, tt) => x.map((v, k) => (v - Math.sqrt(tt) * epsHat(k)) / Math.sqrt(1 - tt));
  function step(x, tn) { const tp = run.prev, e = x0hat(x, tp); run.cur = e.map((v, k) => Math.sqrt(1 - tn) * v + Math.sqrt(tn) * epsHat(k)); run.prev = tn; }
  const xt = () => run.cur || IMG.map((v, k) => Math.sqrt(1 - t) * v + Math.sqrt(t) * EPS[k]);
  function show() {
    const gen = run.cur ? `Generating: step ${run.i} of ${steps}. ` : '';
    out.innerHTML = `${gen}Noise level <b>${(t * 100).toFixed(0)}%</b>. Left: the image the model sees. Middle: its best guess of the clean picture (noise removed using its guess of the noise${err ? `, off by ${err.toFixed(2)}` : ', exactly right here'}). Right: the picture we wanted. At 98% noise the picture is nearly invisible, yet a guess already shows the rough shape.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'noisy image → model guess → target', col);
    const c = Math.floor(Math.min((w - 40) / 3 / S, (h - 54) / S)), x = xt(), g = x0hat(x, Math.min(0.98, run.cur ? run.prev : t));
    [[x, 'noisy image'], [g, 'guess of clean'], [IMG, 'target']].forEach(([M, lab], p) => {
      const x0 = 10 + p * (S * c + 10);
      M.forEach((v, k) => { const px = x0 + (k % S) * c, py = 40 + Math.floor(k / S) * c; ctx.fillStyle = col.soft; ctx.fillRect(px, py, c, c); ctx.save(); ctx.globalAlpha = Math.max(0, Math.min(1, v)); ctx.fillStyle = col.s[0]; ctx.fillRect(px, py, c, c); ctx.restore(); });
      text(ctx, lab, x0 + (S * c) / 2, 40 + S * c + 12, { color: col.muted, size: 10.5, align: 'center', fit: false });
    });
  };
  show();
}
