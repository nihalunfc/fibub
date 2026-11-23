// Class 11 Biology, Photosynthesis: absorption spectra of chlorophyll a, chlorophyll b and carotenoids, and the action spectrum of photosynthesis.
// Chlorophylls absorb mostly blue-violet (about 430-450 nm) and red (about 640-680 nm) and reflect green; the action spectrum follows the total absorption.
import { canvas, text, title, axes, line, dot, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let wl = 660, show = 'all';
  const g = (x, m, s) => Math.exp(-((x - m) ** 2) / (2 * s * s));
  const P = { a: (x) => 0.95 * g(x, 430, 16) + 1.0 * g(x, 662, 16) + 0.15 * g(x, 580, 40), b: (x) => 0.8 * g(x, 453, 15) + 0.55 * g(x, 642, 14) + 0.1 * g(x, 560, 40), c: (x) => 0.6 * g(x, 450, 22) + 0.55 * g(x, 482, 18) + 0.12 * g(x, 410, 20) };
  const total = (x) => Math.min(1, 0.5 * P.a(x) + 0.25 * P.b(x) + 0.25 * P.c(x) + 0.05);
  const hue = (x) => { const h = x < 440 ? 270 : x < 490 ? 270 - (x - 440) * 3.2 : x < 510 ? 200 - (x - 490) * 4 : x < 580 ? 120 - (x - 510) * 1.0 : 60 - (x - 580) * 0.5; return `hsl(${Math.max(0, h)}, 90%, 50%)`; };
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'Absorption spectra of chlorophyll a, chlorophyll b and carotenoids and the action spectrum of photosynthesis across 400 to 700 nanometres' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Show', [['all', 'All'], ['a', 'Chlorophyll a'], ['b', 'Chlorophyll b'], ['c', 'Carotenoids']], show, (v) => { show = v; go(); });
  slider(ctl, { label: 'Wavelength', min: 400, max: 700, step: 1, value: wl, fmt: (v) => Math.round(v) + ' nm', oninput: (v) => { wl = v; go(); } });
  const go = () => {
    const t = total(wl), nm = wl < 450 ? 'violet-blue' : wl < 495 ? 'blue' : wl < 570 ? 'green' : wl < 590 ? 'yellow' : wl < 620 ? 'orange' : 'red';
    ro.textContent = `At ${Math.round(wl)} nm (${nm} light): chlorophyll a ${(P.a(wl) * 100).toFixed(0)} %, chlorophyll b ${(P.b(wl) * 100).toFixed(0)} %, carotenoids ${(P.c(wl) * 100).toFixed(0)} % of their best absorption. Photosynthesis runs at about ${(t * 100).toFixed(0)} % of its maximum here. ${t < 0.25 ? 'Little is absorbed, so this light is mostly reflected and gives the leaf its colour.' : 'A lot is absorbed here.'}`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Which colours does a leaf use?', col);
    const A = axes(ctx, w, h, col, { x: [400, 700], y: [0, 1.05], xlabel: 'wavelength (nm)', ylabel: 'absorption (relative)', l: 54, t: t0 + 28, b: 50, xt: [400, 450, 500, 550, 600, 650, 700], yt: [0, 0.5, 1] });
    for (let x = 400; x < 700; x += 4) { ctx.fillStyle = hue(x); ctx.fillRect(A.X(x), A.B + 18 - 18, A.X(x + 4) - A.X(x) + 1, 5); }
    const draw = (f, c, wd, dash) => { const pts = []; for (let x = 400; x <= 700; x += 5) pts.push([A.X(x), A.Y(f(x))]); line(ctx, pts, c, wd, dash); };
    if (show === 'all' || show === 'a') draw(P.a, col.s[1], 2.5);
    if (show === 'all' || show === 'b') draw(P.b, col.s[0], 2.5);
    if (show === 'all' || show === 'c') draw(P.c, col.s[3], 2.5);
    draw(total, col.ink, 2, [5, 4]);
    line(ctx, [[A.X(wl), A.T], [A.X(wl), A.B]], col.muted, 1.5);
    dot(ctx, A.X(wl), A.Y(total(wl)), 4.5, col.ink, col.bg);
    const ly = t0 + 16; [['chl a', col.s[1]], ['chl b', col.s[0]], ['carotenoids', col.s[3]], ['action', col.ink]].reduce((x, [n, c]) => { text(ctx, '— ' + n, x, ly + 6, { color: c, size: 10, weight: 700 }); return x + 14 + n.length * 6.2; }, 58);
  };
  go();
}
