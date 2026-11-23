// Class 8 Particles: the force of attraction between particles. It is strong when they are close and weak when they
// are far apart (drawn as a rough inverse-power falloff). That is why a solid keeps its shape, a liquid holds
// together but flows, and a gas spreads out. Slide the spacing to see which state it matches.
import { canvas, text, title, dot, arrow, row, slider, readout } from '../../kit.js';

export default function (host) {
  let d = 1.2;
  const cv = canvas(host, { aspect: 0.52, max: 440, min: 240, label: 'Two particles with attraction arrows that get shorter as they move apart' });
  const ctl = row(host);
  slider(ctl, { label: 'Spacing between particles', min: 1, max: 8, step: 0.1, value: d, fmt: (z) => z.toFixed(1), oninput: (z) => { d = z; upd(); } });
  const out = readout(host);
  const F = () => 100 / Math.pow(d, 3);
  const st = () => (d < 1.5 ? 'solid' : d < 3 ? 'liquid' : 'gas');
  function upd() { out.innerHTML = `Spacing ${d.toFixed(1)}: attraction <b>${F().toFixed(0)}</b> units: typical of a <b>${st()}</b>. ${st() === 'solid' ? 'Strong pull holds the particles in place.' : st() === 'liquid' ? 'Enough pull to stay together, but they can slide.' : 'Too weak to hold them: they fly apart.'}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Pull between particles', col);
    const cy = h * 0.42, gap = 20 + (d - 1) * (w - 150) / 7, cx = w / 2, x0 = cx - gap / 2 - 14, x1 = cx + gap / 2 + 14;
    dot(ctx, x0, cy, 14, col.s[0]); dot(ctx, x1, cy, 14, col.s[0]);
    const len = Math.min(w * 0.22, 5 + F() * 0.5);
    arrow(ctx, x0, cy - 28, x0 + len, cy - 28, col.s[3], 4, 9); arrow(ctx, x1, cy - 28, x1 - len, cy - 28, col.s[3], 4, 9); text(ctx, 'pull', cx, cy - 44, { color: col.s[3], size: 10.5, weight: 700, align: 'center' });
    const by = h - 40, seg = (w - 28) / 3; [['solid', col.s[0]], ['liquid', col.s[2]], ['gas', col.s[1]]].forEach(([n, c], i) => { ctx.globalAlpha = st() === n ? 1 : 0.3; ctx.fillStyle = c; ctx.fillRect(14 + i * seg, by, seg - 4, 22); ctx.globalAlpha = 1; text(ctx, n, 14 + i * seg + seg / 2 - 2, by + 11, { color: '#fff', size: 11, weight: 700, align: 'center' }); });
  };
  upd();
}
