// Build a wave from circles. A square wave is a sum of odd sine waves, sin x + (1/3) sin 3x + (1/5) sin 5x + …, and a
// sawtooth uses every harmonic. Slide the number of terms and watch the sum square up. Each term is one rotating arm
// (the circles on the left): the tip of the last arm draws the wave on the right. Near the jump the sum overshoots by
// about 9% however many terms you add (the Gibbs effect).
import { canvas, axes, row, slider, choice, readout, loop, dot, line, text } from '../kit.js';
import { f2 } from './_math.js';

export default function (host) {
  let N = 3, shape = 'square', t = 0;
  const cv = canvas(host, { aspect: 0.6, max: 380, min: 250, label: 'Rotating arms adding up to a square or sawtooth wave' });
  const c = row(host), c2 = row(host);
  choice(c, 'Wave', [['square', 'Square'], ['saw', 'Sawtooth'], ['tri', 'Triangle']], shape, (v) => { shape = v; re(); });
  const anim = loop(host, (dt) => { t += dt * 1.2; re(); }); anim.button(c);
  slider(c2, { label: 'terms', min: 1, max: 25, step: 1, value: N, fmt: (v) => v, oninput: (v) => { N = v; re(); } });
  const out = readout(host);
  // list of [harmonic number, amplitude, phase offset for sin]
  const terms = () => { const L = []; for (let k = 1, c2n = 0; c2n < N; k++) { if (shape === 'square') { if (k % 2) { L.push([k, 4 / (Math.PI * k)]); c2n++; } } else if (shape === 'saw') { L.push([k, (2 / (Math.PI * k)) * (k % 2 ? 1 : -1)]); c2n++; } else if (k % 2) { L.push([k, ((8 / (Math.PI ** 2 * k * k)) * ((k - 1) / 2 % 2 ? -1 : 1))]); c2n++; } } return L; };
  const wave = (x) => terms().reduce((s, [k, a]) => s + a * Math.sin(k * x), 0);
  const target = (x) => { const u = ((x % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI); return shape === 'square' ? (u < Math.PI ? 1 : -1) : shape === 'saw' ? (u < Math.PI ? u / Math.PI : u / Math.PI - 2) : (u < Math.PI / 2 ? (2 * u) / Math.PI : u < (3 * Math.PI) / 2 ? 2 - (2 * u) / Math.PI : (2 * u) / Math.PI - 4); };
  function re() { cv.redraw(); const T = terms(); let mx = -9; for (let x = 0; x < 6.3; x += 0.01) mx = Math.max(mx, wave(x)); out.innerHTML = `${N} term${N > 1 ? 's' : ''}: ${T.slice(0, 4).map(([k, a]) => `${f2(Math.abs(a), 3)} sin ${k}x`).join(' + ')}${T.length > 4 ? ' + …' : ''}. Peak of the sum = <b>${f2(mx, 3)}</b> (target 1). ${shape !== 'tri' && N > 6 ? 'The overshoot near the jump does not go away: it is about 9% of the jump size (Gibbs).' : shape === 'tri' ? 'The triangle has no jump, so its terms shrink as 1/k² and few terms are enough.' : 'Few terms give a rough hump; more terms give straighter sides.'}`; }
  cv.draw = (ctx, w, h, col) => {
    const T = terms(), cx = Math.min(w * 0.2, 80) + 10, cy = h / 2, sc = (Math.min(w * 0.2, 80)) / (shape === 'tri' ? 1.2 : 1.3), gx0 = cx + Math.min(w * 0.2, 80) + 40;
    let px = cx, py = cy;
    T.forEach(([k, a]) => { const r = Math.abs(a) * sc, ang = k * t + (a < 0 ? Math.PI : 0); ctx.beginPath(); ctx.arc(px, py, r, 0, 7); ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.stroke(); const qx = px + r * Math.cos(ang), qy = py - r * Math.sin(ang); line(ctx, [[px, py], [qx, qy]], col.s[0], 1.5); px = qx; py = qy; });
    dot(ctx, px, py, 4, col.s[1], col.ink);
    line(ctx, [[px, py], [gx0, py]], col.muted, 1, [3, 3]);
    const W = w - gx0 - 8, X = (s) => gx0 + (s / (4 * Math.PI)) * W, Y = (v) => cy - v * sc;
    line(ctx, [[gx0, cy], [gx0 + W, cy]], col.line, 1);
    const pts = [], tg = []; for (let i = 0; i <= 240; i++) { const s = (4 * Math.PI * i) / 240; pts.push([X(s), Y(wave(t - s))]); tg.push([X(s), Y(target(t - s))]); }
    line(ctx, tg, col.muted, 1.5, [4, 3]); line(ctx, pts, col.s[1], 2.5); dot(ctx, gx0, Y(wave(t)), 4, col.s[1], col.ink);
    text(ctx, 'arms (one per term)', cx, h - 12, { color: col.muted, size: 10, align: 'center' }); text(ctx, 'dashed: the ideal wave', gx0 + W / 2, h - 12, { color: col.muted, size: 10, align: 'center' });
  };
  re();
}
