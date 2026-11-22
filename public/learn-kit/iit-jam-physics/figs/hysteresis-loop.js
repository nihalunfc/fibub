// 4.6 A B-H hysteresis loop. H is swept back and forth sinusoidally; B follows the rising branch
// B = Bs tanh((H − Hc)/w) while H increases and the falling branch Bs tanh((H + Hc)/w) while it decreases (a simple
// model of a ferromagnet driven to saturation). Sliders set the coercivity (soft to hard material) and the sweep
// amplitude. The readout gives remanence, coercivity and the loop area = energy lost per cycle per unit volume.
// Units: H in units of a reference field H₁, B in units of the saturation field Bs.
import { canvas, axes, line, dot, text, row, slider, readout, fmt, loop } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.8, max: 460, min: 300, label: 'A hysteresis loop of B against H, traced by a moving point, with remanence and coercivity marked' });
  let Hc = 1, A = 4, ph = 0;
  const wdt = 0.8;
  const up = (H) => Math.tanh((H - Hc) / wdt), down = (H) => Math.tanh((H + Hc) / wdt);
  const ctl = row(host);
  slider(ctl, { label: 'Coercivity Hc', min: 0.1, max: 2.5, step: 0.05, value: Hc, fmt: (v) => fmt(v, 2) + ' H₁', oninput: (v) => { Hc = v; cv.redraw(); say(); } });
  slider(ctl, { label: 'Sweep amplitude', min: 2, max: 6, step: 0.1, value: A, fmt: (v) => fmt(v, 2) + ' H₁', oninput: (v) => { A = v; cv.redraw(); say(); } });
  const anim = loop(host, (dt) => { ph += dt * 0.9; cv.redraw(); });
  anim.button(ctl);
  const out = readout(host);
  const area = () => { // ∮ H dB = ∫ (B_down − B_up) dH over [−A, A]
    let s = 0; const n = 600, dh = 2 * A / n;
    for (let i = 0; i < n; i++) { const H = -A + (i + 0.5) * dh; s += (down(H) - up(H)) * dh; }
    return s;
  };
  function say() {
    const Br = down(0);
    out.innerHTML = `Remanence (B left when H returns to 0): <b>${fmt(Br, 3)}</b> Bs. Coercivity (reverse H needed to bring B to 0): <b>${fmt(Hc, 3)}</b> H₁. Loop area = heat per cycle per unit volume = <b>${fmt(area(), 3)}</b> Bs·H₁. ` +
      (Hc < 0.4 ? 'A thin loop: a soft material for transformer cores.' : Hc > 1.6 ? 'A wide loop: a hard material for permanent magnets.' : 'Drag the coercivity down for a transformer core, up for a permanent magnet.');
  }

  cv.draw = (ctx, w, h, col) => {
    const g = axes(ctx, w, h, col, { x: [-6, 6], y: [-1.2, 1.2], xlabel: 'H (applied, from free current)', ylabel: 'B / Bs', yt: [-1, -0.5, 0, 0.5, 1] });
    line(ctx, [[g.X(0), g.T], [g.X(0), g.B]], col.muted, 1);
    line(ctx, [[g.L, g.Y(0)], [g.R, g.Y(0)]], col.muted, 1);
    const n = 200, U = [], D = [];
    for (let i = 0; i <= n; i++) { const H = -A + 2 * A * i / n; U.push([g.X(H), g.Y(up(H))]); D.push([g.X(H), g.Y(down(H))]); }
    // shade the loop
    ctx.save(); ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.15; ctx.beginPath();
    U.forEach(([a, b], i) => (i ? ctx.lineTo(a, b) : ctx.moveTo(a, b))); D.slice().reverse().forEach(([a, b]) => ctx.lineTo(a, b)); ctx.closePath(); ctx.fill(); ctx.restore();
    line(ctx, U, col.s[0], 2.5); line(ctx, D, col.s[1], 2.5);
    const Br = down(0);
    dot(ctx, g.X(0), g.Y(Br), 4, col.ink); text(ctx, 'remanence', g.X(0) + 6, g.Y(Br) - 10, { color: col.ink, size: 11 });
    dot(ctx, g.X(-Hc), g.Y(0), 4, col.ink); text(ctx, '−Hc', g.X(-Hc) - 6, g.Y(0) + 12, { color: col.ink, size: 11, align: 'right' });
    // moving point
    const H = A * Math.sin(ph), rising = Math.cos(ph) > 0;
    const B = rising ? up(H) : down(H);
    dot(ctx, g.X(H), g.Y(B), 6, col.s[3]);
    text(ctx, rising ? 'H rising →' : '← H falling', g.L + 8, g.T + 8, { color: col.s[3], size: 11, weight: 700 });
  };
  cv.redraw(); say();
}
