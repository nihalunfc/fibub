// Class 8 Ecosystems: balance between predators and prey. A simple model: rabbits grow when there is grass (logistic growth up to a
// limit K) and are eaten by foxes; foxes increase when they eat rabbits and die off otherwise. The two numbers rise and fall in step, a
// natural balance. If the foxes are hunted out, the rabbits shoot up towards K, which in real life means overgrazing and a crash. This is a
// teaching model (Lotka-Volterra with a limit), not data for any real place. Numbers are in hundreds.
import { canvas, text, title, line, axes, row, slider, readout } from '../../kit.js';

export default function (host) {
  let foxes = 10, hunt = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Rabbit and fox numbers rising and falling over time, and what happens if the foxes are removed' });
  const ctl = row(host);
  slider(ctl, { label: 'Foxes at the start', min: 2, max: 30, step: 1, value: foxes, fmt: (v) => `${v * 10}`, oninput: (v) => { foxes = v; say(); } });
  slider(ctl, { label: 'Hunt all foxes on day (0 = never)', min: 0, max: 280, step: 10, value: hunt, fmt: (v) => (v ? `day ${v}` : 'never'), oninput: (v) => { hunt = v; say(); } });
  const out = readout(host);
  const sim = () => {
    const r = 0.06, K = 400, b = 0.0035, c = 0.4, m = 0.07, dt = 0.25, Rs = [], Fs = []; let R = 120, F = foxes * 10;
    for (let i = 0; i <= 1200; i++) { const d = i * dt; if (hunt && d >= hunt) F = 0; if (i % 4 === 0) { Rs.push(R); Fs.push(F); } const dR = r * R * (1 - R / K) - b * R * F, dF = c * b * R * F - m * F; R = Math.max(1, R + dR * dt); F = Math.max(F + dF * dt, 0); }
    return [Rs, Fs];
  };
  const say = () => { const [R, F] = sim(); const mx = Math.max(...R.slice(-60)), mn = Math.min(...R.slice(-60)); out.innerHTML = hunt ? `After the foxes are hunted out, the rabbits climb to about <b>${Math.round(R[R.length - 1])}</b>, near the limit set by grass. With no foxes to keep them in check they would eat the grass bare.` : `Rabbits and foxes rise and fall together: more rabbits feed more foxes; more foxes eat more rabbits and the rabbits drop again. Rabbit numbers swing between about <b>${Math.round(mn)}</b> and <b>${Math.round(mx)}</b>.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Predators and prey', col), [R, F] = sim(), a = axes(ctx, w, h, col, { x: [0, 300], y: [0, 450], xlabel: 'days', ylabel: 'population (relative)', t: top + 14, l: 48, xt: [0, 100, 200, 300] });
    line(ctx, R.map((v, i) => [a.X(i * 1), a.Y(v)]), col.s[1], 2.8); line(ctx, F.map((v, i) => [a.X(i * 1), a.Y(Math.min(450, v * 1))]), col.s[3], 2.8);
    if (hunt) line(ctx, [[a.X(hunt), a.T], [a.X(hunt), a.B]], col.bad, 1.2, [4, 4]);
    text(ctx, 'rabbits', a.L + 8, a.T + 10, { color: col.s[1], size: 11, weight: 700 }); text(ctx, 'foxes', a.L + 8, a.T + 25, { color: col.s[3], size: 11, weight: 700 });
  };
  say();
}
