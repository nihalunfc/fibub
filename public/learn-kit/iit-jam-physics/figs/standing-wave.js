// 3.4 Travelling and standing waves. "Travelling" shows one wave moving right with a marked crest and a marked bit of
// string (the string only moves up and down). "Standing" adds the wave reflected from a fixed end: the sum has nodes
// that never move. The amplitude slider of the reflected wave shows a partial standing wave (no true nodes).
import { canvas, axes, line, dot, text, title, row, slider, choice, readout, loop, fmt } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.55, max: 360, min: 240, label: 'A travelling wave, its reflection and their sum on a string' });
  let mode = 'stand', rAmp = 1, t = 0;
  const k = 2 * Math.PI, w = 2 * Math.PI * 0.5; // wavelength 1, period 2 s
  const ctl = row(host);
  choice(ctl, 'Show', [['trav', 'Travelling wave'], ['stand', 'Wave + reflection']], mode, (v) => { mode = v; cv.redraw(); show(); });
  slider(ctl, { label: 'Reflected amplitude', min: 0, max: 1, step: 0.05, value: 1, fmt: (v) => fmt(v, 2), oninput: (v) => { rAmp = v; cv.redraw(); show(); } });
  const out = readout(host);
  const show = () => {
    out.innerHTML = mode === 'trav' ? 'One wave, y = A sin(kx − ωt): the crest (blue dot) moves right at v = ω/k, while each bit of string (orange dot) only moves up and down.'
      : rAmp > 0.98 ? 'Equal waves running opposite ways: y = 2A sin kx cos ωt. The <b>nodes</b> (grey marks, λ/2 apart) never move; all points between two nodes move in step.'
      : `Unequal waves (reflected amplitude ${fmt(rAmp, 2)}): the amplitude swings between ${fmt(1 + rAmp, 2)}A and ${fmt(1 - rAmp, 2)}A along the string, there are no true nodes, and net energy flows to the right.`;
  };
  cv.draw = (ctx, W, h, col) => {
    title(ctx, mode === 'trav' ? 'A travelling wave' : 'Incident + reflected = standing wave', col);
    const ax = axes(ctx, W, h, col, { x: [-2, 0], y: [-2.2, 2.2], t: 36, xlabel: 'position x (wavelengths), fixed end at x = 0', ylabel: 'y', yt: [-2, 0, 2], fx: (v) => fmt(v, 2) });
    ctx.save(); ax.clip();
    const N = 400, inc = [], ref = [], sum = [];
    for (let i = 0; i <= N; i++) {
      const x = -2 + (2 * i) / N, a = Math.sin(k * x - w * t), b = -rAmp * Math.sin(-k * x - w * t);
      inc.push([ax.X(x), ax.Y(a)]); ref.push([ax.X(x), ax.Y(b)]); sum.push([ax.X(x), ax.Y(a + b)]);
    }
    if (mode === 'trav') {
      line(ctx, inc, col.s[0], 2.5);
      const xc = ((((w * t) / k + 0.25) % 1) + 1) % 1 - 2; // a crest position, moving right
      for (let c = xc; c <= 0; c += 1) dot(ctx, ax.X(c), ax.Y(1), 5, col.s[0]);
      const xs = -1.2; dot(ctx, ax.X(xs), ax.Y(Math.sin(k * xs - w * t)), 6, col.s[3]);
    } else {
      line(ctx, inc, col.s[0], 1.2, [5, 4]); line(ctx, ref, col.s[2], 1.2, [5, 4]); line(ctx, sum, col.ink, 2.5);
      if (rAmp > 0.98) for (let n = 0; n <= 4; n++) { const x = -n / 2; line(ctx, [[ax.X(x), ax.Y(-0.25)], [ax.X(x), ax.Y(0.25)]], col.muted, 3); }
    }
    ctx.restore();
    if (mode !== 'trav') { text(ctx, 'incident', ax.L + 6, ax.T + 8, { color: col.s[0], size: 11, weight: 700 }); text(ctx, 'reflected', ax.L + 66, ax.T + 8, { color: col.s[2], size: 11, weight: 700 }); text(ctx, 'sum', ax.L + 134, ax.T + 8, { color: col.ink, size: 11, weight: 700 }); }
  };
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); });
  anim.button(ctl);
  cv.redraw(); show();
}
