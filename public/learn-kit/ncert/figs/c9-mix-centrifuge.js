// Class 9 Mixtures: centrifugation. A top-down view of a centrifuge rotor with two tubes of milk (fat droplets in
// water, a colloid). Spinning makes a large outward force; denser particles move outward faster, lighter ones stay
// near the centre. Skim: in a spinning tube the heavier skim milk goes to the outer end and the lighter cream gathers
// at the inner end. The relative centrifugal force is RCF = 1.118 x 10^-5 x r x rpm^2 (r in cm), shown in the readout.
import { canvas, text, title, dot, line, row, slider, button, readout, loop, rng } from '../../kit.js';

export default function (host) {
  let rpm = 3000, run = false, s = 0, ang = 0, R = rng(2), P = [];
  for (let i = 0; i < 80; i++) P.push({ u: R(), v: R(), fat: R() < 0.25 });
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'A centrifuge spinning two tubes of milk so cream gathers near the centre and skim milk at the outer end' });
  const ctl = row(host);
  slider(ctl, { label: 'Speed (rpm)', min: 500, max: 5000, step: 100, value: rpm, fmt: (v) => v + ' rpm', oninput: (v) => { rpm = v; } });
  button(ctl, 'Start / stop', () => { run = !run; });
  button(ctl, 'Reset (remix)', () => { s = 0; run = false; });
  const out = readout(host);
  loop(host, (dt) => { if (run) { s = Math.min(1, s + dt * (rpm / 5000) * 0.22); ang += dt * rpm / 60 * 0.4; } const rc = 1.118e-5 * 10 * rpm * rpm; out.innerHTML = `At ${rpm} rpm with the tubes 10 cm from the axis, the pull is about <b>${Math.round(rc).toLocaleString('en-IN')} × g</b> (RCF = 1.118×10⁻⁵ × r × rpm²). ` + (s < 0.05 ? 'The milk is a uniform white liquid. Press Start.' : s < 0.98 ? 'Fat droplets are being left behind near the centre while heavier watery milk is thrown outward.' : 'Separated: <b>cream</b> (light fat) near the axis and <b>skim milk</b> at the outer end. Dairies use this to make cream and butter.'); cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Centrifuge: spin to separate', col);
    const cx = w / 2, cy = h * 0.54, Rr = Math.min(w, h) * 0.35;
    ctx.beginPath(); ctx.arc(cx, cy, Rr + 14, 0, 7); ctx.strokeStyle = col.line; ctx.lineWidth = 3; ctx.stroke();
    dot(ctx, cx, cy, 8, col.ink);
    [0, Math.PI].forEach((o) => {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang + o);
      const t0 = 12, tl = Rr - 10, tw = 26;
      ctx.fillStyle = col.panel; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(t0, -tw / 2, tl, tw, [2, 12, 12, 2]); ctx.fill(); ctx.stroke();
      ctx.save(); ctx.beginPath(); ctx.roundRect(t0, -tw / 2, tl, tw, [2, 12, 12, 2]); ctx.clip();
      P.forEach((p) => { const x0 = t0 + 4 + p.u * (tl - 8), x1 = p.fat ? t0 + 6 + p.u * tl * 0.2 : t0 + tl * 0.25 + 4 + p.u * (tl * 0.75 - 8); const x = x0 + (x1 - x0) * s, y = -tw / 2 + 4 + p.v * (tw - 8); dot(ctx, x, y, p.fat ? 2.6 : 1.3, p.fat ? col.s[2] : col.s[4]); });
      ctx.restore(); ctx.restore();
    });
    if (s > 0.98) { text(ctx, 'cream', cx + Rr * 0.25, cy - 30, { color: col.s[2], size: 10.5, weight: 700 }); text(ctx, 'skim milk', cx + Rr * 0.7, cy - 30, { color: col.s[0], size: 10.5, weight: 700 }); }
    text(ctx, 'top view of the rotor', cx, h - 12, { color: col.muted, size: 10, align: 'center' });
  };
}
