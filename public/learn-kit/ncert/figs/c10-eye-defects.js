// Class 10 Human Eye: defects of vision and how spectacle lenses correct them. The eye is modelled as one thin lens
// (relaxed power 41.7 D, up to 45.7 D when focusing on a 25 cm object) at a fixed distance from the retina.
// Myopia (short-sight): eyeball too long, so a far object's image forms IN FRONT of the retina; a concave lens fixes it.
// Hypermetropia (long-sight): eyeball too short, near objects focus BEHIND the retina; a convex lens fixes it.
// Presbyopia: with age the lens cannot bulge enough, so near objects are blurred; convex (bifocal) lenses help.
// Thin lenses in contact add their powers: P_total = P_eye + P_spectacle; image distance from 1/v = P/100 - 1/u (cm).
import { canvas, text, title, line, dot, row, slider, choice, readout } from '../../kit.js';

const MODES = {
  normal: { name: 'Normal eye', L: 2.4, PM: 100 / 2.4 + 4, Pc: 0 },
  myopia: { name: 'Myopia (short-sight)', L: 2.55, PM: 100 / 2.55 + 4.6, Pc: -2.5 },
  hyper: { name: 'Hypermetropia (long-sight)', L: 2.25, PM: 100 / 2.4 + 4, Pc: 2.7 },
  presby: { name: 'Presbyopia (old age)', L: 2.4, PM: 100 / 2.4 + 1, Pc: 3 },
};
export default function (host) {
  let mode = 'myopia', obj = 'far', fix = false;
  const cv = canvas(host, { aspect: 0.68, max: 440, min: 280, label: 'Rays focusing in front of or behind the retina in a defective eye, and the spectacle lens that corrects it' });
  const ctl = row(host);
  choice(ctl, 'Eye', [['normal', 'Normal'], ['myopia', 'Myopia'], ['hyper', 'Hypermetropia'], ['presby', 'Presbyopia']], mode, (v) => { mode = v; update(); });
  choice(ctl, 'Looking at', [['far', 'A far object'], ['near', 'A book at 25 cm']], obj, (v) => { obj = v; update(); });
  choice(ctl, 'Spectacles', [['off', 'Off'], ['on', 'On']], 'off', (v) => { fix = v === 'on'; update(); });
  const out = readout(host);
  const solve = () => {
    const M = MODES[mode], d = obj === 'far' ? Infinity : 25, Pc = fix ? M.Pc : 0, Pr = 100 / 2.4;
    const need = 100 / M.L + (d === Infinity ? 0 : 100 / d) - Pc;   // eye-lens power needed to focus on the retina
    const Pe = Math.max(Pr, Math.min(M.PM, need)), P = Pe + Pc;
    const inv = P / 100 - (d === Infinity ? 0 : 1 / d), v = 1 / inv, gap = v - M.L; // cm: negative = in front of the retina
    return { M, d, Pc, Pe, P, v, gap, sharp: Math.abs(gap) < 0.03 };
  };
  function update() {
    const r = solve(), mm = Math.abs(r.gap * 10).toFixed(1);
    out.innerHTML = `<b>${r.M.name}</b>, ${obj === 'far' ? 'distant object' : 'book at 25 cm'}${fix ? `, spectacles <b>${r.Pc > 0 ? '+' : ''}${r.Pc} D ${r.Pc > 0 ? '(convex)' : r.Pc < 0 ? '(concave)' : '(none needed)'}` + '</b>' : ', no spectacles'}: ` +
      (r.sharp ? '<b>image on the retina: clear.</b>' : `image falls <b>${mm} mm ${r.gap < 0 ? 'in front of' : 'behind'} the retina</b>: blurred.`) +
      (!fix && !r.sharp ? ` Switch the spectacles on to correct it.` : '');
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const r = solve(), M = r.M, s = Math.min(70, (w - 130) / 2.8), lx = 96, rx = lx + M.L * s, cy = h * 0.5, hh = h * 0.27;
    title(ctx, M.name + (fix ? ' with spectacles' : ''), col);
    ctx.save(); ctx.strokeStyle = col.ink; ctx.fillStyle = col.soft; ctx.globalAlpha = 0.45; ctx.beginPath(); ctx.ellipse((lx + rx) / 2, cy, (rx - lx) / 2 + 14, hh * 0.8, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 1; ctx.lineWidth = 2; ctx.stroke();
    ctx.strokeStyle = col.s[3]; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse((lx + rx) / 2, cy, (rx - lx) / 2 + 14, hh * 0.8, 0, -0.75, 0.75); ctx.stroke(); ctx.restore();
    // eye lens (thicker with power)
    const th = 4 + (r.Pe - 41.7) * 1.6;
    ctx.save(); ctx.fillStyle = col.panel; ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(lx, cy - hh * 0.5); ctx.quadraticCurveTo(lx - th, cy, lx, cy + hh * 0.5); ctx.quadraticCurveTo(lx + th, cy, lx, cy - hh * 0.5); ctx.fill(); ctx.stroke(); ctx.restore();
    // spectacle lens
    if (fix && r.Pc !== 0) {
      const sx = lx - 26, conv = r.Pc > 0, b = conv ? 9 : -6, e = conv ? 1 : 7;
      ctx.save(); ctx.fillStyle = col.soft; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(sx - e, cy - hh * 0.8); ctx.quadraticCurveTo(sx - e - b, cy, sx - e, cy + hh * 0.8); ctx.lineTo(sx + e, cy + hh * 0.8); ctx.quadraticCurveTo(sx + e + b, cy, sx + e, cy - hh * 0.8); ctx.closePath(); ctx.globalAlpha = 0.7; ctx.fill(); ctx.globalAlpha = 1; ctx.stroke(); ctx.restore();
      text(ctx, conv ? 'convex lens' : 'concave lens', sx, cy - hh * 0.8 - 8, { color: col.s[0], size: 11, weight: 700, align: 'center' });
    }
    // rays
    const near = r.d !== Infinity;
    for (const y of [-0.45, 0.45]) {
      const yp = y * s, sl0 = near ? y / r.d : 0, x0 = 4;      // incoming slope (cm per cm); heights in cm
      const y0 = y - sl0 * ((lx - x0) / s);                      // ray height at the left edge (heads for the lens)
      line(ctx, [[x0, cy + y0 * s], [lx, cy + yp]], col.s[0], 1.6);
      const sl1 = sl0 - (y * r.P) / 100, xe = Math.min(w - 8, lx + Math.min(r.v, 3.4) * s * (r.v < 0 ? 1 : 1)), xEnd = Math.max(rx, xe);
      line(ctx, [[lx, cy + yp], [Math.min(w - 8, xEnd + 12), cy + yp + sl1 * (Math.min(w - 8, xEnd + 12) - lx)]], col.s[0], 1.6);
    }
    // where the image forms
    const ix = lx + r.v * s; if (Number.isFinite(ix) && ix > lx && ix < w - 6) dot(ctx, ix, cy, 5, r.sharp ? col.s[3] : col.s[1], col.panel);
    const blur = Math.min(hh * 0.7, Math.abs(r.gap) * s * 0.45 + 2);
    ctx.save(); ctx.strokeStyle = r.sharp ? col.s[3] : col.s[1]; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(rx, cy - blur); ctx.lineTo(rx, cy + blur); ctx.stroke(); ctx.restore();
    text(ctx, r.sharp ? 'clear image' : r.gap < 0 ? 'focus in front of retina' : 'focus behind retina', w - 8, h - 14, { color: r.sharp ? col.s[3] : col.s[1], size: 11.5, weight: 700, align: 'right', halo: col.panel });
    text(ctx, near ? 'light from a near object spreads out' : 'parallel rays from far away', 8, h - 14, { color: col.muted, size: 10.5 });
    text(ctx, 'retina', rx + 4, cy - hh * 0.8 - 4, { color: col.muted, size: 10.5 });
  };
  update();
}
