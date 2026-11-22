// 1.10 Fourier partial sums. Pick a wave and the number of harmonics N: the partial sum closes in on the wave. At a
// jump (square wave, sawtooth) it overshoots by about 9% of the jump however large N is (Gibbs); the continuous
// triangle wave converges smoothly. The readout measures the overshoot and the share of power captured.
import { canvas, axes, line, row, slider, choice, readout, fmt, title } from '../../kit.js';

const PI = Math.PI;
const WAVES = {
  square: { name: 'Square', f: (x) => (Math.sin(x) >= 0 ? 1 : -1), b: (n) => (n % 2 ? 4 / (n * PI) : 0), a: () => 0, jump: 2, ms: 1, coef: 'bₙ = 4/(nπ), odd n only' },
  saw: { name: 'Sawtooth', f: (x) => { const y = ((x + PI) % (2 * PI) + 2 * PI) % (2 * PI) - PI; return y; }, b: (n) => (2 * (n % 2 ? 1 : -1)) / n, a: () => 0, jump: 2 * PI, ms: (PI * PI) / 3, coef: 'bₙ = 2(−1)ⁿ⁺¹/n' },
  tri: { name: 'Triangle (|x|)', f: (x) => Math.abs(((x + PI) % (2 * PI) + 2 * PI) % (2 * PI) - PI), b: () => 0, a: (n) => (n % 2 ? -4 / (PI * n * n) : 0), a0: PI / 2, jump: 0, ms: (PI * PI) / 3, coef: 'aₙ = −4/(πn²), odd n only' },
};

export default function (host) {
  const cv = canvas(host, { aspect: 0.55, max: 400, min: 230, label: 'A periodic wave and the sum of its first N Fourier harmonics' });
  let key = 'square', N = 7;
  const ctl = row(host);
  choice(ctl, 'Wave', Object.entries(WAVES).map(([k, v]) => [k, v.name]), key, (v) => { key = v; cv.redraw(); show(); });
  slider(ctl, { label: 'Harmonics N', min: 1, max: 60, step: 1, value: N, fmt: (v) => String(v), oninput: (v) => { N = v; cv.redraw(); show(); } });
  const out = readout(host);
  const S = (x) => { const W = WAVES[key]; let s = W.a0 || 0; for (let n = 1; n <= N; n++) s += W.a(n) * Math.cos(n * x) + W.b(n) * Math.sin(n * x); return s; };
  const show = () => {
    const W = WAVES[key];
    let pw = (W.a0 || 0) ** 2; for (let n = 1; n <= N; n++) pw += (W.a(n) ** 2 + W.b(n) ** 2) / 2;
    let txt = `${W.name} wave: ${W.coef}. The first ${N} harmonics carry ${fmt((100 * pw) / W.ms, 4)}% of the mean-square power (Parseval).`;
    if (W.jump) {
      let mx = -Infinity; const lo = key === 'square' ? 0 : PI * 0.5, hi = key === 'square' ? PI / 2 : PI;
      for (let i = 0; i <= 3000; i++) mx = Math.max(mx, S(lo + ((hi - lo) * i) / 3000));
      const top = key === 'square' ? 1 : PI;
      txt += ` Overshoot next to the jump: ${fmt(mx - top, 3)}, which is ${fmt((100 * (mx - top)) / W.jump, 3)}% of the jump. Raise N: the overshoot gets narrower but stays near 9% (Gibbs).`;
    } else txt += ' The wave has no jumps, so there is no Gibbs overshoot: the error shrinks everywhere at once.';
    out.innerHTML = txt;
  };
  cv.draw = (ctx, w, h, col) => {
    const W = WAVES[key];
    const yr = key === 'square' ? [-1.5, 1.5] : key === 'saw' ? [-4.2, 4.2] : [-0.6, 3.8];
    const A = axes(ctx, w, h, col, { x: [-2 * PI, 2 * PI], y: yr, xt: [-2 * PI, -PI, 0, PI, 2 * PI], fx: (v) => ({ [-2 * PI]: '−2π', [-PI]: '−π', 0: '0', [PI]: 'π', [2 * PI]: '2π' }[v] ?? ''), xlabel: 'x', t: 34 });
    title(ctx, `${W.name} wave (grey) and its first ${N} harmonics (colour)`, col);
    ctx.save(); A.clip();
    const n = 900; let seg = [], prev = null;
    for (let i = 0; i <= n; i++) {
      const x = -2 * PI + (4 * PI * i) / n, y = W.f(x);
      if (prev !== null && Math.abs(y - prev) > 0.5 * (W.jump || 99)) { line(ctx, seg, col.muted, 3); seg = []; }
      seg.push([A.X(x), A.Y(y)]); prev = y;
    }
    line(ctx, seg, col.muted, 3);
    const pts = []; for (let i = 0; i <= 1400; i++) { const x = -2 * PI + (4 * PI * i) / 1400; pts.push([A.X(x), A.Y(S(x))]); }
    line(ctx, pts, col.s[0], 2);
    ctx.restore();
  };
  cv.redraw(); show();
}
