// Class 9 Sound: echo or reverberation? A clap in front of a wall comes back after t = 2d / v. The ear holds a sound
// for about 0.1 s. If the reflection comes back after 0.1 s or more you hear a separate echo (d at least about 17 m in
// air). If it comes back sooner it merges with the original and the sound seems to last longer: reverberation. In a
// big hall sound bounces many times; soft surfaces (curtains, carpets, people) absorb it, so the bounces die away fast.
import { canvas, text, title, line, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let d = 10, soft = 0, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 420, min: 300, label: 'A timeline of a clap and its reflections showing echo versus reverberation' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const ctl = row(host);
  slider(ctl, { label: 'Distance to wall', min: 2, max: 60, step: 1, value: d, fmt: (v) => `${v} m`, oninput: (v) => { d = v; upd(); } });
  choice(ctl, 'Wall', [[0, 'Hard (bare)'], [1, 'Soft (curtains)']], 0, (v) => { soft = v; upd(); });
  const out = readout(host);
  const gap = () => 2 * d / 343;
  function upd() {
    const g = gap();
    out.innerHTML = `Delay = 2d ÷ v = 2 × ${d} ÷ 343 = <b>${g.toFixed(3)} s</b>. ` + (g >= 0.1 ? 'That is 0.1 s or more: you hear a separate <b>echo</b>.' : 'That is less than 0.1 s: the reflection blends with the original sound, so it seems to last longer: <b>reverberation</b>.') + (soft ? ' Soft surfaces soak up sound, so the repeats are weak.' : ' Hard surfaces reflect almost everything, so the repeats are strong.');
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Echo or reverberation?', col);
    const x0 = 16, L = w - 32, base = h * 0.62, Tmax = 0.5, X = (s) => x0 + L * s / Tmax, H = h * 0.34;
    line(ctx, [[x0, base], [x0 + L, base]], col.muted, 1.5);
    // 0.1 s persistence band
    ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = col.s[3]; ctx.fillRect(X(0), base - H - 6, X(0.1) - X(0), H + 6); ctx.restore();
    text(ctx, 'shaded: the ear still holds the first sound (0.1 s)', x0, base - H - 16, { color: col.s[3], size: 10 });
    const r = soft ? 0.3 : 0.75, g = gap();
    for (let k = 0; k < 8; k++) {
      const s = k * g, a = Math.pow(r, k); if (s > Tmax - 0.01) break;
      const bw = Math.max(3, X(0.012) - X(0)), hh = H * a;
      ctx.fillStyle = k === 0 ? col.s[1] : (g >= 0.1 ? col.s[0] : col.s[2]);
      ctx.fillRect(X(s) - bw / 2, base - hh, bw, hh);
      if (k === 0) text(ctx, 'clap', X(s) + 4, base - 6, { color: col.ink, size: 10 });
      if (k === 1 && g >= 0.12) text(ctx, 'echo', X(s), base - hh - 8, { color: col.ink, size: 10, align: 'center' });
    }
    for (let i = 0; i <= 5; i++) { const s = i * 0.1; line(ctx, [[X(s), base], [X(s), base + 4]], col.muted, 1); if (i % 1 === 0 && i > 0) text(ctx, `${s.toFixed(1)}`, X(s), base + 22, { color: col.muted, size: 10, align: 'center' }); }
    text(ctx, 'time after the clap (s)', x0 + L, base + 38, { color: col.muted, size: 10, align: 'right' });
    const echo = g >= 0.1;
    text(ctx, echo ? 'Separate echo' : 'Reverberation (sound blurs)', w / 2, h - 18, { color: echo ? col.good : col.s[0], size: 13, weight: 700, align: 'center' });
  };
  upd();
}
