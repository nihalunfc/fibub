// Electrons through two slits, one at a time: each hit is a single dot at a random place, yet the pile of dots builds
// the fringe pattern I ∝ cos²(πdy/λL) × single-slit envelope. Try: slow the rate and watch single dots, change the
// slit gap d and wavelength λ (fringe spacing λL/d), then switch on "watch which slit" and the fringes vanish.
import { canvas, axes, line, text, title, row, slider, choice, button, readout, loop, rng, dot } from '../kit.js';

const L = 0.5, A = 0.25, Y = 40; // screen distance (m), slit width (µm), screen half-window (µm)
export default function (host) {
  const R = rng(11);
  const cv = canvas(host, { aspect: 0.95, max: 500, min: 380, label: 'Electrons arriving one by one on a screen behind two slits and building up fringes' });
  let d = 1.2, lam = 10, watch = false, rate = 6, hits = [], acc = 0, ph = 0;
  const ctl = row(host), ctl2 = row(host), out = readout(host);
  slider(ctl, { label: 'Slit gap d', min: 0.6, max: 3, step: 0.05, value: d, fmt: (v) => v.toFixed(2) + ' µm', oninput: (v) => { d = v; hits = []; } });
  slider(ctl, { label: 'Wavelength λ', min: 4, max: 20, step: 0.5, value: lam, fmt: (v) => v.toFixed(1) + ' pm', oninput: (v) => { lam = v; hits = []; } });
  choice(ctl2, 'Detector at slits', [[false, 'Off'], [true, 'Watch which slit']], watch, (v) => { watch = v; hits = []; });
  slider(ctl2, { label: 'Rate', min: 1, max: 60, step: 1, value: rate, fmt: (v) => v + '/s', oninput: (v) => (rate = v) });
  const sinc = (u) => (Math.abs(u) < 1e-6 ? 1 : Math.sin(u) / u);
  const lamL = () => lam * L; // λL in µm² when λ is in pm, so the fringe spacing λL/d is in µm
  const I = (y) => {
    const k = Math.PI * y / lamL();
    const env = sinc(k * A) ** 2;
    return watch ? env : env * Math.cos(k * d) ** 2;
  };
  const draw1 = () => { // rejection sample
    for (let i = 0; i < 400; i++) { const y = (R() * 2 - 1) * Y; if (R() < I(y)) return y; }
    return 0;
  };
  const anim = loop(host, (dt) => {
    ph += dt; acc += dt * rate;
    while (acc >= 1) { acc -= 1; hits.push(draw1()); if (hits.length > 6000) hits.shift(); }
    cv.redraw(); show();
  });
  anim.button(ctl2);
  button(ctl2, 'Clear screen', () => { hits = []; cv.redraw(); show(); });
  button(ctl2, '+200 electrons', () => { for (let i = 0; i < 200; i++) hits.push(draw1()); cv.redraw(); show(); });
  const show = () => {
    const V = (1.226e-9 / (lam * 1e-12)) ** 2;
    out.innerHTML = `<b>${hits.length}</b> electrons so far. λ = h/p = ${lam.toFixed(1)} pm needs about <b>${Math.round(V).toLocaleString()} V</b>. Fringe spacing Δy = λL/d = <b>${(lamL() / d).toFixed(2)} µm</b> (L = 0.5 m). ${watch ? 'Which-slit information destroys the interference: two blobs add, not waves.' : 'Each electron goes through both slits as a wave and lands as one dot.'}`;
  };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Electron double slit', col);
    const top = 34, ph0 = Math.round(h * 0.34), sx = w * 0.42, ex = w * 0.92;
    // schematic
    const cy = top + ph0 / 2, sep = Math.min(ph0 * 0.3, 8 + d * 11);
    ctx.fillStyle = col.muted; ctx.fillRect(sx - 2, top, 4, cy - sep - 3 - top); ctx.fillRect(sx - 2, cy - sep + 3, 4, 2 * sep - 6); ctx.fillRect(sx - 2, cy + sep + 3, 4, top + ph0 - cy - sep - 3);
    ctx.fillStyle = col.s[0]; ctx.fillRect(14, cy - 7, 18, 14); text(ctx, 'gun', 14, cy + 20, { color: col.muted, size: 10 });
    line(ctx, [[32, cy], [sx, cy]], col.s[0], 1.5, [4, 4]);
    for (const sg of [-1, 1]) for (let k = 0; k < 4; k++) {
      const r = ((ph * 18 + k * 26) % 104) + 4;
      ctx.beginPath(); ctx.arc(sx, cy + sg * sep, r, -1.2, 1.2); ctx.globalAlpha = (1 - r / 108) * 0.6; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 1.2; ctx.stroke(); ctx.globalAlpha = 1;
    }
    ctx.fillStyle = col.ink; ctx.fillRect(ex, top, 3, ph0);
    text(ctx, 'screen', ex - 4, top + ph0 + 10, { color: col.muted, size: 10, align: 'right' });
    if (hits.length) { const lh = hits.slice(-60); lh.forEach((y, i) => dot(ctx, ex - 8, top + ph0 / 2 + (y / Y) * (ph0 / 2) * 0.9, 1.6, col.s[1])); }
    // bottom plot: position along the screen
    const a = axes(ctx, w, h - 6, col, { x: [-Y, Y], y: [0, 1], l: 40, t: top + ph0 + 18, b: 40, xlabel: 'position y along the screen (µm)', ylabel: 'hits (scaled)', yt: [], fx: (v) => v });
    const nb = 80, bins = new Array(nb).fill(0);
    hits.forEach((y) => { const b = Math.floor(((y + Y) / (2 * Y)) * nb); if (b >= 0 && b < nb) bins[b]++; });
    const mx = Math.max(4, ...bins);
    bins.forEach((c, b) => { const x0 = a.X(-Y + (b * 2 * Y) / nb), x1 = a.X(-Y + ((b + 1) * 2 * Y) / nb); ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.75; ctx.fillRect(x0 + 0.5, a.Y(c / mx * 0.95), x1 - x0 - 1, a.B - a.Y(c / mx * 0.95)); }); ctx.globalAlpha = 1;
    const pts = []; for (let i = 0; i <= 300; i++) { const y = -Y + (i / 300) * 2 * Y; pts.push([a.X(y), a.Y(I(y) * 0.95)]); }
    line(ctx, pts, col.s[0], 1.6);
    text(ctx, 'quantum prediction', a.L + 6, a.T + 8, { color: col.s[0], size: 10.5, weight: 600 });
  };
  show();
}
