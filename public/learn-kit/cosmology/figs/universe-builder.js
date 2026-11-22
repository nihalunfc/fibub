// 5.10 Build your own universe. Choose how much matter and dark energy it holds and how fast it expands today;
// the Friedmann equation (phys.js) gives its whole history: when it began, whether it ends in a Big Crunch or
// grows forever, its shape and whether it is speeding up now. Presets jump to the classic models.
import { canvas, axes, text, title, line, dot, row, slider, choice, readout } from '../../kit.js';
import { scaleHistory, q0 } from '../phys.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 420, min: 300, label: 'The history of a universe you build, its size against time' });
  let Om = 0.31, OL = 0.69, H0 = 67.7;
  const ctl = row(host);
  const sm = slider(ctl, { label: 'Matter Ωm', min: 0, max: 3, step: 0.01, value: Om, fmt: (v) => v.toFixed(2), oninput: (v) => { Om = v; upd(); } });
  const sl = slider(ctl, { label: 'Dark energy ΩΛ', min: -0.5, max: 2, step: 0.01, value: OL, fmt: (v) => v.toFixed(2), oninput: (v) => { OL = v; upd(); } });
  const sh = slider(ctl, { label: 'Hubble constant H₀', min: 50, max: 90, step: 0.5, value: H0, fmt: (v) => `${v} km/s/Mpc`, oninput: (v) => { H0 = v; upd(); } });
  const ctl2 = row(host);
  choice(ctl2, 'Presets', [['ours', 'Ours (ΛCDM)'], ['eds', 'Matter only'], ['closed', 'Big Crunch'], ['ds', 'Dark energy only']], 'ours', (k) => {
    const pr = { ours: [0.31, 0.69], eds: [1, 0], closed: [2.5, 0], ds: [0.01, 1] }[k];
    Om = pr[0]; OL = pr[1]; sm.set(Om); sl.set(OL); upd();
  });
  const out = readout(host);
  let hist = [];
  const upd = () => { hist = scaleHistory({ H0, Om, OL }, { tPast: 40, tFuture: 60, aMax: 5 }); show(); cv.redraw(); };
  const show = () => {
    const Ok = 1 - Om - OL, start = hist[0], end = hist[hist.length - 1], q = q0({ Om, OL });
    const begin = start.a < 0.01 ? `began with a Big Bang <b>${(-start.t).toFixed(1)} billion years ago</b>` : 'had <b>no Big Bang</b> in the last 40 billion years (it shrank to a minimum size and bounced, or has no beginning)';
    const fate = end.a < 0.01 ? `ends in a <b>Big Crunch ${end.t.toFixed(0)} billion years from now</b>` : q < 0 || OL > 0 ? '<b>grows forever</b>, faster and faster' : '<b>grows forever</b>, ever more slowly';
    const shape = Math.abs(Ok) < 0.005 ? '<b>flat</b>' : Ok < 0 ? '<b>closed</b> (curved like a ball)' : '<b>open</b> (curved like a saddle)';
    out.innerHTML = `This universe ${begin} and ${fate}. Its space is ${shape} (Ωk = ${Ok.toFixed(2)}), and today it is ${q < 0 ? '<b>speeding up</b>' : '<b>slowing down</b>'} (q₀ = ${q.toFixed(2)}).`;
  };
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [-40, 60], y: [0, 4], t: 40, xlabel: 'Time from today (billion years)', ylabel: 'Size a (today = 1)' });
    ctx.save(); A.clip();
    line(ctx, hist.map(({ t, a }) => [A.X(t), A.Y(a)]), col.s[0], 2.8);
    const s = hist[0], e = hist[hist.length - 1];
    if (s.a < 0.01) dot(ctx, A.X(s.t), A.Y(0), 6, col.s[3], col.panel);
    if (e.a < 0.01) dot(ctx, A.X(e.t), A.Y(0), 6, col.s[3], col.panel);
    ctx.restore();
    dot(ctx, A.X(0), A.Y(1), 5, col.ink, col.panel);
    text(ctx, 'today', A.X(0) + 8, A.Y(1) + 12, { color: col.ink, size: 11.5, weight: 600, halo: col.panel });
    if (s.a < 0.01) text(ctx, 'Big Bang', A.X(s.t), A.Y(0) - 12, { color: col.ink, size: 11.5, weight: 700, align: 'center', halo: col.panel });
    if (e.a < 0.01) text(ctx, 'Big Crunch', A.X(e.t), A.Y(0) - 12, { color: col.ink, size: 11.5, weight: 700, align: 'center', halo: col.panel });
    title(ctx, 'Your universe, from start to finish', col);
  };
  upd();
}
