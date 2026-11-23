// Class 11 Motion in a Straight Line: stopping distance. Before the brakes act the car keeps going at speed v for the driver's reaction time t_r (distance v t_r);
// then it brakes with constant deceleration a, covering v^2/(2a). Total = v t_r + v^2/(2a). Doubling speed makes the braking part four times longer.
import { canvas, text, title, line, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let kmh = 60, tr = 1, mu = 7;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 270, label: 'A bar showing reaction distance plus braking distance against an obstacle' });
  const ctl = row(host), out = readout(host);
  slider(ctl, { label: 'Speed (km/h)', min: 20, max: 120, step: 5, value: kmh, fmt: (v) => v + ' km/h', oninput: (v) => { kmh = v; go(); } });
  slider(ctl, { label: 'Reaction time (s)', min: 0.2, max: 2.5, step: 0.1, value: tr, fmt: (v) => v.toFixed(1) + ' s', oninput: (v) => { tr = v; go(); } });
  choice(ctl, 'Road', [[7, 'Dry'], [4, 'Wet'], [1.5, 'Icy']], mu, (v) => { mu = v; go(); });
  const OB = 50;
  const d = () => { const v = kmh / 3.6; return { v, r: v * tr, b: (v * v) / (2 * mu) }; };
  function go() { const { v, r, b } = d(); out.innerHTML = `${kmh} km/h = ${v.toFixed(1)} m/s. Reaction distance = v·t = <b>${r.toFixed(1)} m</b>; braking distance = v²/2a = <b>${b.toFixed(1)} m</b>; stopping distance = <b>${(r + b).toFixed(1)} m</b>. ${r + b > OB ? 'It hits the obstacle ' + OB + ' m ahead.' : 'It stops ' + (OB - r - b).toFixed(1) + ' m short of the obstacle.'}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Stopping distance = reaction + braking', col);
    const { r, b } = d(), tot = r + b, MAX = Math.max(OB + 15, tot + 8), L = 20, W = w - 40, X = (m) => L + (m / MAX) * W, y = h * 0.45;
    line(ctx, [[L, y + 30], [L + W, y + 30]], col.muted, 2);
    ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.9; ctx.fillRect(L, y - 8, X(r) - L, 24); ctx.fillStyle = col.s[0]; ctx.fillRect(X(r), y - 8, X(tot) - X(r), 24); ctx.globalAlpha = 1;
    ctx.fillStyle = col.ink; ctx.fillRect(L - 18, y - 2, 18, 12);
    if (X(r) - L > 52) text(ctx, 'reaction', L + (X(r) - L) / 2, y + 4, { size: 10.5, weight: 700, color: col.panel, align: 'center' }); if (X(tot) - X(r) > 46) text(ctx, 'braking', (X(r) + X(tot)) / 2, y + 4, { size: 10.5, weight: 700, color: col.panel, align: 'center' });
    ctx.fillStyle = tot > OB ? col.s[3] : col.s[2]; ctx.fillRect(X(OB) - 5, y - 20, 10, 50); text(ctx, tot > OB ? 'child crossing: HIT' : 'child crossing: safe', X(OB), y - 32, { size: 11, weight: 700, color: tot > OB ? col.s[3] : col.s[2], align: 'center' });
    for (let m = 0; m <= MAX; m += MAX > 120 ? 30 : 20) { line(ctx, [[X(m), y + 30], [X(m), y + 36]], col.muted, 1); text(ctx, m + ' m', X(m), y + 48, { size: 10, color: col.muted, align: 'center' }); }
    text(ctx, `stopping distance ${tot.toFixed(1)} m`, w / 2, h - 18, { size: 13, weight: 700, color: col.ink, align: 'center' });
  };
  go();
}
