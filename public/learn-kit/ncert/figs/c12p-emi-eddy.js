// Class 12 Electromagnetic Induction: eddy currents. A metal plate swinging through a magnetic field has swirling currents induced in it; by Lenz's law these
// oppose the motion, so a solid plate is braked hard. Cutting slots in the plate breaks up the loops, the currents are weak, and it swings almost freely.
// Used in induction cooktops, electromagnetic brakes and damping of meters, and (laminated cores) avoided in transformers.
import { canvas, text, title, row, button, choice, readout, line, dot, arrow, loop } from '../../kit.js';
import { bgrid, rad } from '../c12p-mmlib.js';

export default function (host) {
  let kind = 'solid', th = 38, w1 = 0, fieldOn = true;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'A metal plate pendulum swinging through a magnetic field' });
  const ctl = row(host);
  choice(ctl, 'Plate', [['solid', 'Solid plate'], ['slots', 'Plate with slots'], ['none', 'No magnet']], kind, (x) => { kind = x; th = 38; w1 = 0; });
  button(ctl, 'Release again', () => { th = 38; w1 = 0; });
  const out = readout(host);
  let tt = 0;
  loop(host, (dt) => { tt += dt; const damp = kind === 'solid' ? 1.4 : kind === 'slots' ? 0.12 : 0.03; for (let k = 0; k < 6; k++) { const d = dt / 6, inB = Math.abs(th) < 22 && kind !== 'none'; w1 += (-9 * Math.sin(rad(th)) - (inB ? damp : 0.03) * w1) * d; th += (w1 * d * 180) / Math.PI; } cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, kind === 'solid' ? 'Solid plate: big eddy currents, strong braking' : kind === 'slots' ? 'Slotted plate: loops are broken, weak braking' : 'No magnet: it swings freely', col);
    const px = w / 2, py = top + 8, Lp = Math.min(h - top - 80, 190), a = rad(th), bx = px + Math.sin(a) * Lp, by = py + Math.cos(a) * Lp;
    if (kind !== 'none') { ctx.fillStyle = col.soft; ctx.fillRect(px - 48, py + Lp - 40, 96, 80); bgrid(ctx, px - 48, py + Lp - 40, px + 48, py + Lp + 40, true, col.s[0], 26, 4); text(ctx, 'B into page', px, py + Lp + 52, { color: col.s[0], size: 10.5, align: 'center' }); }
    line(ctx, [[px, py], [bx, by]], col.ink, 2); dot(ctx, px, py, 4, col.ink);
    ctx.save(); ctx.translate(bx, by); ctx.rotate(-a); ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.85; ctx.fillRect(-26, 0, 52, 46); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(-26, 0, 52, 46);
    if (kind === 'slots') { ctx.strokeStyle = col.panel; ctx.lineWidth = 3; for (const x of [-16, -6, 4, 14]) { ctx.beginPath(); ctx.moveTo(x, 8); ctx.lineTo(x, 46); ctx.stroke(); } }
    const inB = Math.abs(th) < 22 && kind !== 'none', speed = Math.min(1, Math.abs(w1) / 2.5);
    if (inB && speed > 0.05) { const big = kind === 'solid'; ctx.strokeStyle = col.s[3]; ctx.lineWidth = 1 + 2 * speed; const dirc = w1 > 0 ? 1 : -1; const loops = big ? [[0, 24, 18]] : [[-16, 30, 5], [-6, 30, 5], [4, 30, 5], [14, 30, 5]]; for (const [cx2, cy2, r2] of loops) { ctx.beginPath(); ctx.arc(cx2, cy2, r2 * (big ? 1 : 1), 0, 5.2); ctx.stroke(); arrow(ctx, cx2 + dirc * r2, cy2, cx2 + dirc * r2, cy2 + 0.01, col.s[3], 1, 6); } }
    ctx.restore();
    const sp = Math.abs(w1);
    out.innerHTML = kind === 'none' ? 'Without the magnet there is nothing to induce currents, so the plate swings for a long time.' : kind === 'solid' ? 'As the plate enters or leaves the field its flux changes, and swirling <b>eddy currents</b> flow in the metal. By Lenz’s law they oppose the motion: the plate is braked and stops quickly. The energy turns into heat in the plate.' : 'The slots cut the metal into narrow strips, so the big eddy loops cannot form. Little current, little braking: it swings on. This is why transformer cores are made of thin insulated sheets (laminations).';
  };
  cv.redraw();
}
