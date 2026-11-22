// 11.3 Quantum jitter freezes into ripples. Drawn on a map that stretches with space (comoving), so each wave keeps
// its width while the horizon, the comoving Hubble distance c/(aH), shrinks during inflation (a grows as e^(Ht),
// H stays nearly fixed). Inside the horizon a wave of the inflaton field jitters (quantum fluctuations, random
// size and timing). Once the horizon shrinks below its wavelength, opposite ends can no longer affect each other and
// the wave freezes at whatever size it had: biggest waves first. The frozen waves add up to the pattern of slightly
// denser and thinner places (bottom row) that later becomes the CMB spots and the galaxies. Each wave gets the same
// typical size, as in a scale-invariant spectrum.
import { canvas, text, title, line, rng, loop, row, button, readout, calm } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 1.0, max: 520, min: 400, label: 'Waves of quantum jitter freezing one by one as the horizon shrinks past them during inflation' });
  const NW = 6, R0 = 1.6, RATE = 0.55, TEND = 8;
  const lam = Array.from({ length: NW }, (_, i) => 1 / 1.8 ** i);
  const tExit = lam.map((l) => Math.log(R0 / l) / RATE);
  let modes = [], t = 0;
  const reset = (seed) => {
    const r = rng(seed);
    modes = lam.map((l, i) => ({ amp: 0.55 + 0.45 * r(), ph: r() * 6.283, x0: r(), w: 2.2 / Math.sqrt(l), sgn: r() < 0.5 ? -1 : 1, i }));
    t = 0;
  };
  reset(7);
  let seed = 7;
  const valAt = (m, tt) => m.sgn * m.amp * Math.cos(m.w * Math.min(tt, tExit[m.i]) + m.ph);
  const anim = loop(host, (dt) => { t = Math.min(TEND, t + dt); if (t >= TEND) anim.pause(); cv.redraw(); show(); });
  const ctl = row(host);
  anim.button(ctl);
  button(ctl, '↺ New jitter', () => { seed += 1; reset(seed); anim.play(); cv.redraw(); show(); });
  const out = readout(host);
  if (calm()) t = TEND;
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Quantum jitter freezes into ripples', col);
    const L = 74, Rr = w - 10, W = Rr - L;
    const RH = R0 * Math.exp(-RATE * t);
    // the horizon bar
    const yb = top + 16, hw = Math.min(W, RH * W);
    ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.25; ctx.fillRect(L, yb - 6, hw, 12); ctx.globalAlpha = 1;
    line(ctx, [[L, yb], [L + hw, yb]], col.s[1], 2.5);
    text(ctx, 'horizon', 8, yb, { color: col.s[1], size: 11, weight: 700 });
    text(ctx, RH > 1 ? 'horizon: wider than the picture, shrinking' : 'a wave freezes when it is longer than this', L + 2, yb + 15, { color: col.muted, size: 10.5 });
    const rowsTop = yb + 30, rowH = (h - rowsTop - 64) / NW;
    for (const m of modes) {
      const cy = rowsTop + rowH * (m.i + 0.5), frozen = t >= tExit[m.i];
      const v = valAt(m, t), A = rowH * 0.38 * v, pts = [];
      for (let x = 0; x <= W; x += 2) pts.push([L + x, cy - A * Math.sin((2 * Math.PI * (x / W + m.x0)) / lam[m.i])]);
      line(ctx, [[L, cy], [Rr, cy]], col.line, 1);
      line(ctx, pts, frozen ? col.s[0] : col.muted, frozen ? 2.2 : 1.6);
      text(ctx, frozen ? 'frozen' : 'jitters', 8, cy, { color: frozen ? col.s[0] : col.muted, size: 11, weight: frozen ? 700 : 400 });
    }
    // the sum of frozen waves: the seed pattern
    const ys = h - 30, pts = [];
    const frozenModes = modes.filter((m) => t >= tExit[m.i]);
    for (let x = 0; x <= W; x += 2) {
      let s = 0; for (const m of frozenModes) s += valAt(m, t) * Math.sin((2 * Math.PI * (x / W + m.x0)) / lam[m.i]);
      pts.push([L + x, ys - s * 10]);
    }
    line(ctx, [[L, ys], [Rr, ys]], col.line, 1);
    line(ctx, pts, col.s[3], 2.4);
    text(ctx, 'all frozen', 8, ys - 7, { color: col.s[3], size: 11, weight: 700 });
    text(ctx, 'waves added', 8, ys + 8, { color: col.s[3], size: 11, weight: 700 });
  };
  const show = () => {
    const nF = tExit.filter((x) => t >= x).length;
    out.innerHTML = nF === 0 ? 'Every wave is smaller than the horizon, so each one jitters at random, like the zero-point jitter of any quantum field.'
      : nF < NW ? `<b>${nF}</b> of ${NW} waves have grown bigger than the horizon and frozen, biggest first. The rest still jitter.`
      : 'All the waves have frozen. Their sum (bottom) is a fixed pattern of slightly denser and thinner places: the seeds of the CMB spots and of every galaxy.';
  };
  cv.redraw(); show();
}
