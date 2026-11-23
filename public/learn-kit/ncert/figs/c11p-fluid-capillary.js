// Class 11 Mechanical Properties of Fluids: angle of contact and capillary rise. In a narrow tube of radius r the liquid surface curves; the surface-tension pull 2 pi r S cos(theta) holds up a column of weight pi r^2 h rho g,
// so h = 2 S cos(theta) / (r rho g). Water wets glass (theta ~ 0, rises); mercury does not (theta ~ 140 degrees, is pushed DOWN). Narrower tube, bigger effect. S: water 0.073, alcohol 0.022, mercury 0.465 N/m.
import { canvas, text, title, line, arrow, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  const LQ = { water: ['water', 0.073, 0, 1000], alc: ['alcohol', 0.022, 0, 790], hg: ['mercury', 0.465, 140, 13600] };
  let q = 'water', r = 0.5;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'A narrow glass tube dipped in a liquid showing capillary rise or depression with the contact angle' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Liquid', Object.entries(LQ).map(([k, v]) => [k, v[0]]), q, (v) => { q = v; go(); });
  slider(ctl, { label: 'tube radius r (mm)', min: 0.1, max: 3, step: 0.05, value: r, fmt: (x) => x.toFixed(2) + ' mm', oninput: (x) => { r = x; go(); } });
  const hgt = () => { const [, S, th, rho] = LQ[q]; return (2 * S * Math.cos(th * Math.PI / 180)) / (r / 1000 * rho * 9.8); };
  const go = () => { const [n, S, th, rho] = LQ[q], hh = hgt(); ro.textContent = `h = 2S cosθ/(rρg) = 2 × ${S} × cos ${th}° / (${(r / 1000).toFixed(4)} × ${rho} × 9.8) = ${(hh * 100).toFixed(2)} cm ${hh >= 0 ? 'above' : 'below'} the outside level (${n}, angle of contact ${th}°).`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Capillary rise: h = 2S cosθ / (r ρ g)', col) + 16, lvl = top + (h - top) * 0.55, hh = Math.max(-0.05, Math.min(0.1, hgt())), hp = hh * (h - top) * 3.4, cx = w * 0.35, tw = 8 + r * 12;
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.25; ctx.fillRect(14, lvl, w - 28, h - lvl - 12); ctx.globalAlpha = 1; line(ctx, [[14, lvl], [cx - tw - 3, lvl]], col.s[0], 2); line(ctx, [[cx + tw + 3, lvl], [w - 14, lvl]], col.s[0], 2);
    const ly = lvl - hp; ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.45; ctx.fillRect(cx - tw, Math.min(lvl, ly), 2 * tw, Math.abs(lvl - ly) + 20); ctx.globalAlpha = 1;
    const wet = LQ[q][2] < 90, mn = wet ? 7 : -7; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(cx - tw, ly - (wet ? 0 : 0) + (wet ? -mn : -mn) * 0.0); ctx.quadraticCurveTo(cx, ly + (wet ? mn + 2 : -mn - 2) * 1.6, cx + tw, ly); ctx.stroke();
    line(ctx, [[cx - tw - 3, top], [cx - tw - 3, h - 30]], col.ink, 3); line(ctx, [[cx + tw + 3, top], [cx + tw + 3, h - 30]], col.ink, 3);
    if (Math.abs(hp) > 3) { arrow(ctx, cx + tw + 24, lvl, cx + tw + 24, ly, col.s[3], 2, 6); text(ctx, 'h = ' + (hgt() * 100).toFixed(1) + ' cm', cx + tw + 30, (lvl + ly) / 2, { color: col.s[3], size: 11.5, weight: 700 }); }
    line(ctx, [[cx + tw + 3, ly], [cx + tw + 3 + 46, ly]], col.s[3], 1, [3, 3]);
    text(ctx, 'angle of contact θ = ' + LQ[q][2] + '°', w - 12, h - 18, { color: col.ink, size: 11, weight: 700, align: 'right' });
    const ax = w * 0.72, ay = top + 26; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ax, ay - 16); ctx.lineTo(ax, ay + 30); ctx.stroke();
    const th = LQ[q][2] * Math.PI / 180; line(ctx, [[ax, ay + 30], [ax + 36 * Math.sin(th), ay + 30 - 36 * Math.cos(th)]], col.s[1], 3);
    text(ctx, 'glass wall', ax - 6, ay + 4, { color: col.muted, size: 10, align: 'right' }); text(ctx, 'liquid surface', ax - 8, ay + 50, { color: col.s[1], size: 10, weight: 700 });
  };
  go();
}
