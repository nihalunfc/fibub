// Class 9 Surface Area and Volume (animation): a cone and a cylinder with the SAME radius and the SAME height. Pour the cone full of
// water into the cylinder: it takes exactly three cones to fill the cylinder, so the volume of a cone is 1/3 x pi r^2 h.
// The water level in the cone falls quickly at first, because the cone is wide at the top (volume goes with the cube of the depth).
import { canvas, text, title, row, readout, loop, ease } from '../../kit.js';
import { poly, ell, seg } from './c9-vol-lib.js';

export default function (host) {
  let t = 0;
  const cv = canvas(host, { aspect: 0.88, max: 440, min: 300, label: 'A cone of water poured three times into a cylinder with the same base and height' });
  const ctl = row(host);
  const out = readout(host);
  const CYC = 2.4, TOT = CYC * 3 + 1.6;
  const state = () => { const tt = Math.min(t, TOT - 0.0001), n = Math.min(2, Math.floor(tt / CYC)), ph = tt >= 3 * CYC ? 1 : (tt - n * CYC) / CYC, p = tt >= 3 * CYC ? 1 : ease(Math.min(1, Math.max(0, (ph - 0.25) / 0.6))); return { n: tt >= 3 * CYC ? 3 : n, ph, p, done: tt >= 3 * CYC }; };
  const anim = loop(host, (dt) => { t = (t + dt) % (TOT + 1); upd(); });
  anim.button(ctl);
  const upd = () => { const s = state(); out.innerHTML = s.done ? 'The cylinder is exactly full after <b>3 cones</b>: cylinder = 3 × cone, so cone = <b>⅓ πr²h</b>.' : `Pouring cone number <b>${s.n + 1}</b> of 3. The cylinder is ${s.n}/3 full before this pour. Same radius, same height.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Cone → cylinder: three pours', col), R = Math.min(w * 0.17, 62), H = Math.min(h * 0.46, 150), by = h - 24, cyx = w * 0.7, cox = w * 0.3, ty = by - H;
    const s = state();
    // cone (apex down) drawn at the top, tilting is skipped: it sits above ground and drains
    const coneTop = top + 18, coneBot = coneTop + H;
    const vf = s.done ? 0 : 1 - s.p; // fraction of water left in the cone
    const lvl = Math.cbrt(vf) * H; // depth of water from the apex
    poly(ctx, [[cox - R, coneTop], [cox + R, coneTop], [cox, coneBot]], null, col.s[0], 0, 3);
    if (vf > 0.001) { const hw = R * (lvl / H); poly(ctx, [[cox - hw, coneBot - lvl], [cox + hw, coneBot - lvl], [cox, coneBot]], col.s[1], null, 0.6); }
    text(ctx, 'cone', cox, coneBot + 14, { color: col.ink, size: 12, weight: 700, align: 'center' });
    // cylinder on the ground
    const fill = (s.done ? 3 : s.n + (1 - vf)) / 3;
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cyx - R, ty); ctx.lineTo(cyx - R, by); ctx.lineTo(cyx + R, by); ctx.lineTo(cyx + R, ty); ctx.stroke();
    ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.6; ctx.fillRect(cyx - R + 1.5, by - H * fill, 2 * R - 3, H * fill); ctx.globalAlpha = 1;
    [1, 2].forEach((i) => seg(ctx, cyx - R, by - (H * i) / 3, cyx + R, by - (H * i) / 3, col.muted, 1, [3, 4]));
    text(ctx, 'cylinder', cyx, by + 12, { color: col.ink, size: 12, weight: 700, align: 'center' });
    text(ctx, s.done ? '3 / 3' : `${s.n} / 3`, cyx + R + 4, by - H / 2, { color: col.ink, size: 11, weight: 700, align: 'left', fit: true });
    if (!s.done && s.ph > 0.25 && s.ph < 0.85 && vf > 0.001) { ctx.strokeStyle = col.s[1]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cox, coneBot); ctx.bezierCurveTo(cox + 20, coneBot + 20, cyx - 10, ty - 14, cyx, by - H * fill); ctx.stroke(); }
  };
  upd();
}
