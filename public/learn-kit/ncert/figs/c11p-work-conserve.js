// Class 11 Work, Energy and Power: conservation of mechanical energy on a roller-coaster. Without friction KE + PE stays constant (the cart reaches the same height
// on the far hill, whatever its mass). With friction the lost mechanical energy becomes heat. The cart obeys (1+h'^2) x'' + h' h'' x'^2 = -g h' - c(1+h'^2) x'.
import { canvas, line, text, title, row, slider, button, choice, readout, loop } from '../../kit.js';

export default function (host) {
  const g = 9.8, H = (x) => 2.5 + 2 * Math.cos(0.55 * x), H1 = (x) => -1.1 * Math.sin(0.55 * x), H2 = (x) => -0.605 * Math.cos(0.55 * x);
  let mass = 50, fr = 0, x, v, E0, run = true;
  const reset = () => { x = 0.25; v = 0; E0 = g * H(x); };
  reset();
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A cart on a roller-coaster track with bars for kinetic, potential and heat energy' });
  const ctl = row(host);
  slider(ctl, { label: 'Cart mass', min: 20, max: 200, step: 10, value: 50, fmt: (v) => v + ' kg', oninput: (m) => { mass = m; cv.redraw(); } });
  choice(ctl, 'Track', [[0, 'Smooth'], [0.15, 'Rough']], 0, (c) => { fr = c; reset(); });
  const b2 = row(host); button(b2, 'Restart', () => { reset(); });
  const lp = loop(host, (dt) => {
    for (let i = 0; i < 40; i++) {
      const d = dt / 40, hp = H1(x), hpp = H2(x);
      const a = (-g * hp - hp * hpp * v * v) / (1 + hp * hp) - fr * v;
      v += a * d; x += v * d;
      if (x < 0) { x = 0; v = Math.abs(v) * 0.2; } if (x > 11.4) { x = 11.4; v = -Math.abs(v) * 0.2; }
    }
    cv.redraw();
  });
  lp.button(b2);
  const ro = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Energy changes form, the total stays', col);
    const gx = (X) => 14 + X / 11.4 * (w - 28), gy0 = top + 150, hs = 24, gy = (Y) => gy0 - Y * hs;
    ctx.beginPath(); ctx.moveTo(gx(0), gy0 + 14); for (let i = 0; i <= 120; i++) { const X = 11.4 * i / 120; ctx.lineTo(gx(X), gy(H(X)) + 0); } ctx.lineTo(gx(11.4), gy0 + 14); ctx.closePath();
    ctx.fillStyle = col.soft; ctx.fill();
    const pts = []; for (let i = 0; i <= 120; i++) { const X = 11.4 * i / 120; pts.push([gx(X), gy(H(X))]); } line(ctx, pts, col.muted, 2.5);
    const hh = H(x), sl = Math.atan(H1(x) * hs / ((w - 28) / 11.4)), cx = gx(x), cy = gy(hh);
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(sl); ctx.fillStyle = col.s[0]; ctx.fillRect(-11, -12, 22, 10); ctx.restore();
    line(ctx, [[gx(x), gy(hh)], [gx(x), gy(0)]], col.s[2], 1, [3, 3]);
    line(ctx, [[10, gy(0)], [w - 10, gy(0)]], col.line, 1, [4, 4]); text(ctx, 'h = 0', w - 10, gy(0) + 8, { color: col.muted, size: 10, align: 'right' });
    const PE = mass * g * hh, tot = mass * g * H(0.25), KE = Math.max(0, mass * (g * (E0 / g - hh) ) - 0), Q = Math.max(0, tot - PE - 0.5 * mass * v * v * (1 + H1(x) ** 2));
    const ke = 0.5 * mass * v * v * (1 + H1(x) ** 2), by = gy0 + 36, bw = w - 40, S = bw / (mass * g * 4.5 * 1.02);
    const bars = [['PE', PE, col.s[0]], ['KE', ke, col.s[2]], ['heat', Q, col.s[3]]]; let cx0 = 20;
    bars.forEach(([n, val, c], i) => { ctx.fillStyle = c; ctx.fillRect(cx0, by, val * S, 16); cx0 += val * S; });
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(20, by, bw, 16);
    let lx = 20; bars.forEach(([n, , c], i) => { ctx.fillStyle = c; ctx.fillRect(lx, by + 26, 12, 12); text(ctx, n === 'PE' ? 'potential' : n === 'KE' ? 'kinetic' : 'heat', lx + 16, by + 32, { color: col.ink, size: 11 }); lx += 84; });
    ro.textContent = `PE ${Math.round(PE)} J + KE ${Math.round(ke)} J + heat ${Math.round(Q)} J = ${Math.round(PE + ke + Q)} J. ${fr ? 'Friction turns mechanical energy into heat, so each swing is lower.' : 'No friction: it climbs back to the same height. Try a heavier cart; the motion does not change.'}`;
  };
  cv.redraw();
}
