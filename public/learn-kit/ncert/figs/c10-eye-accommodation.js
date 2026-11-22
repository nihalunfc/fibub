// Class 10 Human Eye: power of accommodation. The retina is a fixed distance (about 2.4 cm) behind the eye lens, so for a
// sharp image the lens must change its focal length with the object distance. Far object: ciliary muscles relax, the lens
// is thin (long f). Near object: the muscles contract, the lens bulges (short f). The lens can only bulge so much, so
// anything closer than the near point (about 25 cm for a young adult) cannot be focused. Model: 1/v - 1/u = 1/f with
// v = 2.4 cm, so the power needed is P = 100/2.4 + 100/d dioptres (d in cm), limited to a maximum of about 45.7 D.
import { canvas, text, title, line, dot, arrow, row, slider, readout } from '../../kit.js';

const L = 2.4, PR = 100 / L, PM = PR + 4;
export default function (host) {
  let d = 100;
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 280, label: 'The eye lens becoming thinner or thicker as the object moves nearer or farther' });
  cv.c.style.touchAction = 'pan-y';
  const ctl = row(host);
  slider(ctl, { label: 'Object distance', min: 8, max: 1000, log: true, value: d, fmt: (v) => (v > 700 ? 'very far' : v >= 100 ? `${(v / 100).toFixed(1)} m` : `${v.toFixed(0)} cm`), oninput: (v) => { d = v; update(); } });
  const out = readout(host);
  const need = () => PR + 100 / d, P = () => Math.min(PM, need());
  function update() {
    const n = need(), ok = n <= PM + 0.01, f = 100 / P();
    out.innerHTML = ok ? `Object at ${d >= 700 ? '∞ (very far)' : d >= 100 ? (d / 100).toFixed(1) + ' m' : d.toFixed(0) + ' cm'}: lens power needed = <b>${n.toFixed(1)} D</b> (f = ${f.toFixed(2)} cm). Ciliary muscles <b>${n - PR < 0.5 ? 'relaxed' : 'contracted'}</b>; the image lands on the retina.`
      : `Too close! Power needed ${n.toFixed(1)} D, but the lens can only reach <b>${PM.toFixed(1)} D</b>. The image falls behind the retina and looks blurred. The nearest point of clear vision is the <b>near point, about 25 cm</b>.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Accommodation: the lens changes its shape', col);
    const s = Math.min(70, (w - 120) / (L + 1.4)), lx = 60, rx = lx + L * s, cy = h * 0.5, hh = h * 0.28, p = P(), f = 100 / p, ok = need() <= PM + 0.01;
    // eyeball
    ctx.save(); ctx.strokeStyle = col.ink; ctx.fillStyle = col.soft; ctx.globalAlpha = 0.45; ctx.beginPath(); ctx.ellipse((lx + rx) / 2, cy, (rx - lx) / 2 + 14, hh * 0.78, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 1; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
    ctx.save(); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse((lx + rx) / 2, cy, (rx - lx) / 2 + 14, hh * 0.78, 0, -0.7, 0.7); ctx.stroke(); ctx.restore();
    // the lens: thicker when the power is higher
    const th = 5 + ((p - PR) / 4) * 8 + 2;
    ctx.save(); ctx.fillStyle = col.panel; ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(lx, cy - hh * 0.46); ctx.quadraticCurveTo(lx - th, cy, lx, cy + hh * 0.46); ctx.quadraticCurveTo(lx + th, cy, lx, cy - hh * 0.46); ctx.fill(); ctx.stroke(); ctx.restore();
    // ciliary muscles: pull the lens thin when relaxed
    ctx.save(); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 3 + (p - PR); for (const g of [-1, 1]) { ctx.beginPath(); ctx.moveTo(lx, cy + g * hh * 0.46); ctx.lineTo(lx + 8 - (p - PR) * 2, cy + g * hh * 0.7); ctx.stroke(); } ctx.restore();
    text(ctx, p - PR < 0.5 ? 'muscles relaxed: thin lens' : 'muscles contracted: thick lens', lx + 6, cy - hh * 0.95, { color: col.s[1], size: 11, weight: 700 });
    // rays from an object point on the axis
    const hs = [-hh * 0.34, 0, hh * 0.34], vimg = 1 / (p / 100 - 1 / d);
    for (const y of hs) {
      const spread = y * (1 + 6 / d); // very slight divergence for near objects
      const x0 = 6, y0 = cy + spread * (1 + (lx - x0) / (Math.max(d, 8) * s * 0.4));
      if (y === 0) { line(ctx, [[x0, cy], [lx, cy], [rx + 20, cy]], col.s[2], 1.4); continue; }
      const sl = (cy + y - (cy)) * 0; // keep tidy
      const yl = cy + y, slope = -y / (vimg * s); // after lens: heads to the image point on the axis
      line(ctx, [[x0, y0], [lx, yl]], col.s[0], 1.5); const xe = Math.min(w - 8, lx + vimg * s * (ok ? 1 : 1.25)); line(ctx, [[lx, yl], [xe, yl + slope * (xe - lx)]], col.s[0], 1.5);
    }
    dot(ctx, lx + vimg * s, cy, 4, ok ? col.s[3] : col.bad || col.s[1], col.panel);
    if (!ok) { ctx.save(); ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.ellipse(rx, cy, 3, Math.min(hh * 0.5, Math.abs(vimg * s - L * s) * 0.5), 0, 0, 7); ctx.fill(); ctx.restore(); text(ctx, 'blurred: focus is behind the retina', w - 8, h - 30, { color: col.s[1], size: 11, weight: 700, align: 'right', halo: col.panel }); }
    else text(ctx, 'sharp: focus is on the retina', w - 8, h - 30, { color: col.s[3], size: 11, weight: 700, align: 'right', halo: col.panel });
    text(ctx, 'retina', rx + 6, cy - hh * 0.78 - 4, { color: col.muted, size: 10.5 });
    // power bar
    const bx = 10, bw = w - 20, by = h - 12; line(ctx, [[bx, by], [bx + bw, by]], col.line, 6); const q = (v) => bx + ((v - PR) / (PM + 1 - PR)) * bw; line(ctx, [[bx, by], [Math.max(bx, Math.min(bx + bw, q(need())))]].map((a) => (a.length === 2 ? a : [a[0], by])).concat([[Math.max(bx, Math.min(bx + bw, q(need()))), by]]), ok ? col.s[0] : col.s[1], 6);
    text(ctx, `power ${p.toFixed(1)} D (max ${PM.toFixed(1)} D)`, bx, by - 12, { color: col.muted, size: 10 });
  };
  update();
}
