// Class 8 Pressure: air pressure falls as you climb because there is less air above you. Rounded values from the
// standard atmosphere: sea level 1013 hPa, 1.5 km 845 hPa, 3 km 701, 5.5 km 506 (half), 8.8 km (Everest) about 314.
// Drawn from p = 1013 exp(-h / 8.4 km), a good fit up to about 10 km.
import { canvas, text, title, dot, line, arrow, row, slider, readout } from '../../kit.js';

export default function (host) {
  let h0 = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A mountain with an air column above it and a pressure reading that falls with height' });
  const ctl = row(host);
  slider(ctl, { label: 'Height', min: 0, max: 9, step: 0.1, value: h0, fmt: (z) => `${z.toFixed(1)} km`, oninput: (z) => { h0 = z; upd(); } });
  const out = readout(host);
  const P = (z) => 1013 * Math.exp(-z / 8.4);
  function upd() { out.innerHTML = `At <b>${h0.toFixed(1)} km</b> the air pressure is about <b>${Math.round(P(h0))} hPa</b>, ${Math.round(P(h0) / 1013 * 100)}% of sea level. Less air above, less weight pressing down. Breathing gets harder too.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Air pressure falls with height', col);
    const gy = h - 36, top = 44, ph = gy - top;
    const mx = w * 0.12, mw = w * 0.4;
    ctx.fillStyle = col.line; ctx.beginPath(); ctx.moveTo(mx, gy); ctx.lineTo(mx + mw * 0.55, gy - ph * (9 / 10) ); ctx.lineTo(mx + mw * 1.1, gy); ctx.closePath(); ctx.fill();
    const y = gy - ph * h0 / 10;
    const px = mx + mw * 0.55 + ((9 - h0) / 9) * 0; 
    dot(ctx, mx + mw * 0.55 * (h0 / 9), y, 6, col.s[1]);
    for (let i = 0; i < 24; i++) { const yy = top + (i / 24) * ph, a = Math.exp(-(10 * (1 - (yy - top) / ph)) / 8.4); ctx.globalAlpha = 0.08 + 0.55 * a * (yy > y ? 0.3 : 1); ctx.fillStyle = col.s[0]; ctx.fillRect(w * 0.62, yy, w * 0.14, ph / 24 + 1); }
    ctx.globalAlpha = 1;
    text(ctx, 'air above', w * 0.69, top - 4, { color: col.muted, size: 10, align: 'center' });
    arrow(ctx, w * 0.69, top + 4, w * 0.69, y - 4, col.s[3], 2, 7);
    const gxl = w * 0.8; line(ctx, [[gxl, y], [gxl + (w * 0.17) * P(h0) / 1013, y]], col.s[1], 6);
    text(ctx, `${Math.round(P(h0))} hPa`, w - 10, y - 12, { color: col.s[1], size: 11.5, weight: 700, align: 'right' });
    text(ctx, `${h0.toFixed(1)} km`, mx + mw * 0.55 * (h0 / 9) + 10, y - 12, { color: col.s[1], size: 11, weight: 700 });
    line(ctx, [[10, gy], [w - 10, gy]], col.muted, 2);
  };
  upd();
}
