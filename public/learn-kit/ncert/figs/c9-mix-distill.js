// Class 9 Mixtures (step player): simple distillation of salt water (or ink, or copper sulphate solution). The
// solution is heated to its boiling point; only the solvent (water) turns to vapour, because the dissolved solid is not
// volatile. The vapour passes into a water-cooled condenser, turns back to liquid (condenses) and drips into a
// receiver as the pure distillate. The thermometer stays near 100 C while water boils. Used to make distilled water.
import { canvas, text, title, dot, line, loop } from '../../kit.js';

const CAP = ['Set up: a flask of salt water with a thermometer in the neck, a slanting condenser with cold water running through its jacket, and a receiving beaker.', 'Heat the flask. The water gets hot and starts to boil at about 100 °C. The salt stays behind because it does not vaporise.', 'Water vapour rises into the neck and moves into the condenser. The thermometer stays steady near the boiling point of water.', 'The cold jacket cools the vapour, so it condenses back into drops of liquid water.', 'The drops run into the beaker: the distillate is pure water. Salt is left as a solid in the flask.'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 300, label: 'Simple distillation apparatus with a flask, a condenser and a receiver showing vapour rising and drops collecting' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, ['Apparatus', 'Heat the solution', 'Vapour rises', 'Condensation', 'Distillate collected'][step], col);
    const fx = w * 0.2, fy = h * 0.42, fr = Math.min(w, h) * 0.13;
    const nx = fx + 6, ny = fy - fr * 2.0;
    // flame / heater
    if (step >= 1) { for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(fx - 12 + i * 12, fy + fr + 24); ctx.quadraticCurveTo(fx - 12 + i * 12 + 4 * Math.sin(t * 9 + i), fy + fr + 8, fx - 12 + i * 12, fy + fr + 12 - 6 * Math.abs(Math.sin(t * 7 + i))); ctx.strokeStyle = col.bad; ctx.lineWidth = 3; ctx.stroke(); } }
    ctx.fillStyle = col.ink; ctx.fillRect(fx - 24, fy + fr + 24, 48, 5);
    // flask
    ctx.beginPath(); ctx.arc(fx, fy, fr, 0, 7); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.arc(fx, fy, fr - 1, 0, 7); ctx.clip(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.35; ctx.fillRect(fx - fr, fy - fr * 0.1, fr * 2, fr * 1.2); ctx.globalAlpha = 1; ctx.restore();
    const salt = step >= 4 ? 7 : 4; for (let i = 0; i < salt; i++) dot(ctx, fx - fr * 0.5 + (i % 4) * (fr * 0.3), fy + fr * 0.7 - Math.floor(i / 4) * 5, 2.2, col.s[2]);
    line(ctx, [[fx - 8, fy - fr + 3], [fx - 8, fy - fr - 22], [fx + 8, fy - fr - 22], [fx + 8, fy - fr + 3]], col.ink, 2.5);
    // thermometer
    line(ctx, [[fx, fy - fr - 38], [fx, fy - fr * 0.3]], col.bad, 3); text(ctx, step >= 1 ? (step === 1 ? '↗ 100 °C' : '100 °C') : '25 °C', fx + 10, fy - fr - 34, { color: col.bad, size: 10.5, weight: 700 });
    // condenser
    const cx0 = fx + 10, cy0 = fy - fr - 22, cx1 = w * 0.74, cy1 = h * 0.6;
    line(ctx, [[cx0, cy0], [cx0 + 20, cy0 - 0], [w * 0.38, cy0 + 14]], col.ink, 2.5);
    ctx.save(); const ang = Math.atan2(cy1 - (cy0 + 14), cx1 - w * 0.38); ctx.translate(w * 0.38, cy0 + 14); ctx.rotate(ang); const L = Math.hypot(cx1 - w * 0.38, cy1 - (cy0 + 14));
    ctx.fillStyle = col.soft; ctx.fillRect(0, -11, L, 22); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(0, -11, L, 22);
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(L, 0); ctx.stroke(); ctx.restore();
    text(ctx, 'cold water in', cx1 - 4, cy1 + 24, { color: col.s[0], size: 10, align: 'right' }); text(ctx, 'condenser', w * 0.42, cy0 + 70, { color: col.muted, size: 10, align: 'center' });
    // receiver
    const rx = cx1 + 12, ry = cy1 + 34; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(rx, ry, 54, 44); const filled = step >= 4 ? 0.7 : step === 3 ? 0.2 + 0.2 * ((t * 0.3) % 1) : 0;
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.5; ctx.fillRect(rx + 1, ry + 43 - 40 * filled, 52, 40 * filled); ctx.globalAlpha = 1; text(ctx, 'pure water', rx + 27, ry + 58, { color: col.s[0], size: 10, weight: 700, align: 'center' });
    // vapour dots
    if (step >= 2) for (let i = 0; i < 8; i++) { const p = ((t * 0.35 + i / 8) % 1); let x, y; if (p < 0.4) { x = fx + 4 + (p / 0.4) * (w * 0.38 - fx - 4); y = fy - fr - 12 + (p / 0.4) * 4 - Math.sin(p * 20) * 2; } else { const q = (p - 0.4) / 0.6; x = w * 0.38 + q * (cx1 - w * 0.38); y = cy0 + 14 + q * (cy1 - cy0 - 14); } if (step >= 3 && p > 0.7) continue; dot(ctx, x, y, 2.4, col.s[3]); }
    if (step === 1) for (let i = 0; i < 6; i++) { const p = ((t * 0.7 + i / 6) % 1); dot(ctx, fx - fr * 0.5 + ((i * 37) % 100) / 100 * fr, fy + fr * 0.5 - p * fr * 1.0, 2.4 + p, col.panel, col.s[0]); }
    if (step >= 3) for (let i = 0; i < 3; i++) { const p = ((t * 0.6 + i / 3) % 1); dot(ctx, cx1 - 2 + p * 6, cy1 + 12 + p * 24, 3, col.s[0]); }
    const Ls = []; let cur = ''; ctx.font = '11px system-ui'; CAP[step].split(' ').forEach((wd) => { if (ctx.measureText((cur + ' ' + wd).trim()).width > w - 24 && cur) { Ls.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); }); Ls.push(cur);
    Ls.forEach((l, i) => text(ctx, l, w / 2, h - 12 - (Ls.length - 1 - i) * 14, { color: col.ink, size: 11, align: 'center' }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); t = 0; cv.redraw(); } };
}
