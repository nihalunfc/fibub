// Class 12 Magnetism and Matter: the hysteresis (B–H) loop of a ferromagnet. Take H up, down, and up again: B lags behind H. Where H falls back to zero some B stays
// (retentivity Br); a reverse H of size Hc (coercivity) is needed to bring B to zero. The loop's area is the energy lost as heat per cycle per m³.
// Soft iron: narrow loop (transformer cores, electromagnets). Steel: wide loop (permanent magnets).
import { canvas, text, title, row, slider, choice, readout, axes, line, dot, loop } from '../../kit.js';

export default function (host) {
  let kind = 'soft', peak = 100, t = 0, B = 0, hPrev = 0, trail = [];
  const P = { soft: { Bs: 1.6, Hc: 80, wd: 120, view: 800, name: 'Soft iron' }, steel: { Bs: 1.2, Hc: 4000, wd: 2500, view: 15000, name: 'Steel' } };
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'A hysteresis loop traced as the applied field cycles' });
  const ctl = row(host);
  choice(ctl, 'Material', [['soft', 'Soft iron'], ['steel', 'Steel']], kind, (x) => { kind = x; trail = []; B = 0; });
  slider(ctl, { label: 'Peak of the cycle', min: 20, max: 100, step: 5, value: peak, fmt: (x) => `${x}%`, oninput: (x) => { peak = x; trail = []; } });
  const out = readout(host);
  const branch = (H, up) => { const p = P[kind]; return p.Bs * Math.tanh((H - (up ? 1 : -1) * p.Hc) / p.wd); };
  loop(host, (dt) => {
    t += dt; const p = P[kind], Hm = (p.view * 0.9 * peak) / 100, H = Hm * Math.sin(t * 1.1), up = H > hPrev; const target = branch(H, up);
    B += (target - B) * Math.min(1, 0.25 + Math.abs(H - hPrev) / p.view * 6); hPrev = H; trail.push([H, B]); if (trail.length > 260) trail.shift(); cv.redraw();
  });
  cv.draw = (ctx, w, h, col) => {
    const p = P[kind], top = title(ctx, `${p.name}: B lags behind H`, col);
    const g = axes(ctx, w, h, col, { x: [-p.view, p.view], y: [-1.9, 1.9], t: top + 6, b: 38, l: 52, r: 14, xt: [-p.view, -p.view / 2, 0, p.view / 2, p.view], yt: [-1.5, -1, -0.5, 0, 0.5, 1, 1.5], fx: (v) => (Math.abs(v) >= 1000 ? v / 1000 + 'k' : v), fy: (v) => v, xlabel: 'applied H (A/m)' });
    text(ctx, 'B (tesla)', g.L + 6, g.T + 8, { color: col.muted, size: 10.5 });
    ctx.save(); ctx.beginPath(); ctx.rect(g.L, g.T, g.R - g.L, g.B - g.T); ctx.clip();
    for (const up of [true, false]) { ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.beginPath(); for (let k = 0; k <= 100; k++) { const H = -p.view + (k * 2 * p.view) / 100, X = g.X(H), Y = g.Y(branch(H, up)); k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke(); }
    ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2.5; ctx.beginPath(); trail.forEach(([H, b], i) => (i ? ctx.lineTo(g.X(H), g.Y(b)) : ctx.moveTo(g.X(H), g.Y(b)))); ctx.stroke(); ctx.restore();
    const last = trail.at(-1) || [0, 0]; dot(ctx, g.X(last[0]), g.Y(last[1]), 6, col.s[3], col.ink);
    const Br = branch(0, false), area = (() => { let a = 0; for (let k = 0; k < 400; k++) { const H = -p.view + (k * 2 * p.view) / 400; a += (branch(H, true) - branch(H, false)) * (2 * p.view / 400) * -1; } return Math.abs(a); })();
    dot(ctx, g.X(0), g.Y(Br), 4, col.s[2]); text(ctx, 'Br', g.X(0) + 6, g.Y(Br) - 8, { color: col.s[2], size: 11, weight: 700 });
    dot(ctx, g.X(-p.Hc), g.Y(0), 4, col.s[2]); text(ctx, '−Hc', g.X(-p.Hc) - 4, g.Y(0) + 14, { color: col.s[2], size: 11, weight: 700, align: 'right' });
    out.innerHTML = `${p.name}: retentivity Br ≈ <b>${Br.toFixed(2)} T</b>, coercivity Hc ≈ <b>${p.Hc} A/m</b>, loop area ≈ <b>${Math.round(area).toLocaleString('en-IN')} J/m³</b> lost as heat per cycle. ${kind === 'soft' ? 'Narrow loop: little loss, and it demagnetises easily, so it suits transformer cores and electromagnets.' : 'Wide loop: strong B stays after H is removed and is hard to wipe out, so it suits permanent magnets.'}`;
  };
  cv.redraw();
}
