// Class 8 Pressure: pressure in a liquid grows with depth (p = rho g h), so water squirts out of a lower hole with
// more force and lands farther. Range of a jet from a hole at depth h in a tank filled to height H above the floor:
// speed v = sqrt(2 g h), fall time from height (H - h): range = 2 sqrt(h (H - h)).
import { canvas, text, title, line, row, slider, loop, readout } from '../../kit.js';

export default function (host) {
  let H = 1, t = 0;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 290, label: 'A tank with three holes at different depths and water jets of different range' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const ctl = row(host);
  slider(ctl, { label: 'Water level', min: 0.5, max: 1, step: 0.05, value: H, fmt: (z) => `${Math.round(z * 100)} cm`, oninput: (z) => { H = z; upd(); } });
  const out = readout(host);
  function upd() { out.innerHTML = 'The deeper the hole, the more water is above it, the higher the pressure and the <b>faster</b> the jet leaves (the speed numbers). The lowest hole has less height to fall, so its jet lands closer even though it is fastest.'; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Liquid pressure grows with depth', col);
    const tx = 24, tw = w * 0.34, top = 40, floor = h - 54, th = floor - top, pxH = th / 1.05;
    const surf = floor - H * pxH;
    ctx.fillStyle = col.soft; ctx.fillRect(tx, surf, tw, floor - surf);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(tx, top); ctx.lineTo(tx, floor); ctx.lineTo(tx + tw, floor); ctx.lineTo(tx + tw, top); ctx.stroke();
    line(ctx, [[10, floor], [w - 10, floor]], col.muted, 2);
    const hs = [0.2, 0.5, 0.8];
    hs.forEach((fr, i) => {
      const d = H * fr, yy = surf + d * pxH, hgt = (H - d), R = 2 * Math.sqrt(d * hgt), vx = Math.sqrt(2 * d);
      const pts = [];
      for (let s = 0; s <= 1.001; s += 0.05) { const xx = R * s, yv = hgt - hgt * s * s; pts.push([tx + tw + xx * pxH * 0.9, floor - yv * pxH]); }
      ctx.save(); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3.4; ctx.setLineDash([9, 5]); ctx.lineDashOffset = -t * 40 * vx; ctx.beginPath(); pts.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.restore();
      ctx.fillStyle = col.s[3]; ctx.fillRect(tx + tw - 2, yy - 3, 6, 6);
      text(ctx, `${Math.round(d * 100)} cm: ${(vx * 3.13).toFixed(1)} m/s`, tx + tw / 2 - 6, yy - 8, { color: col.ink, size: 10, align: 'center' });
    });
    text(ctx, 'Depth of hole: speed of the jet', w - 12, h - 12, { color: col.muted, size: 10.5, align: 'right' });
  };
  upd();
}
