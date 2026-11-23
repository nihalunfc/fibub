// Class 8 Science, Electricity: Oersted's discovery (1820). A current in a wire makes a magnetic field round it, so a
// compass needle beside the wire turns. The needle lines up with the sum of Earth's field (north) and the wire's field
// (sideways): angle = arctan(B_wire / B_earth). Field of a long wire B = 2e-7 x I / d (tesla) with the needle 2 cm away;
// Earth's field about 4e-5 T. Reversing the current reverses the turn. This is the magnetic effect of current.
import { canvas, text, title, line, dot, arrow, row, slider, button, readout } from '../../kit.js';

export default function (host) {
  let I = 5, dir = 1, on = true;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'A wire carrying current above a compass needle that turns' });
  const ctl = row(host);
  const bo = button(ctl, 'Current: ON', () => { on = !on; bo.textContent = 'Current: ' + (on ? 'ON' : 'OFF'); upd(); });
  button(ctl, 'Reverse the current', () => { dir = -dir; upd(); });
  slider(ctl, { label: 'Current', min: 1, max: 20, step: 1, value: I, fmt: (v) => `${v} A`, oninput: (v) => { I = v; upd(); } });
  const out = readout(host);
  const ang = () => (on ? dir * Math.atan((2e-7 * I / 0.02) / 4e-5) : 0);
  function upd() { const a = ang() * 180 / Math.PI; out.innerHTML = !on ? 'No current: the needle points north, along Earth\'s field.' : `The needle turns <b>${Math.abs(a).toFixed(0)}°</b> to the ${a > 0 ? 'east' : 'west'}. More current, more turn. Reverse the current and it turns the other way.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Current makes a magnet-like effect', col);
    const cx = w / 2, cy = h * 0.55, wy = cy - 62;
    // wire running left to right above needle (needle under wire, wire along north-south: drawn as vertical in plan view)
    line(ctx, [[cx - 80, cy], [cx - 80, cy - 10]], col.ink, 1);
    ctx.fillStyle = col.soft; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, 52, 0, 7); ctx.fill(); ctx.stroke();
    text(ctx, 'N', cx, cy - 62, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, 'S', cx, cy + 64, { color: col.ink, size: 11, weight: 700, align: 'center' });
    text(ctx, 'W', cx - 64, cy, { color: col.muted, size: 11, align: 'center' }); text(ctx, 'E', cx + 64, cy, { color: col.muted, size: 11, align: 'center' });
    // wire in plan view runs North-South just above the needle; draw as thick line along N-S through centre
    line(ctx, [[cx, cy - 92], [cx, cy + 92]], col.s[1], 6);
    if (on) { arrow(ctx, cx, dir > 0 ? cy + 70 : cy - 70, cx, dir > 0 ? cy - 86 : cy + 86, col.bad, 2.5, 9); text(ctx, `${I} A`, cx + 22, cy - 82, { color: col.bad, size: 11, weight: 700 }); }
    const a = ang(); ctx.save(); ctx.translate(cx, cy); ctx.rotate(a);
    ctx.fillStyle = col.bad; ctx.beginPath(); ctx.moveTo(0, -42); ctx.lineTo(-7, 0); ctx.lineTo(7, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.moveTo(0, 42); ctx.lineTo(-7, 0); ctx.lineTo(7, 0); ctx.closePath(); ctx.fill(); ctx.restore();
    dot(ctx, cx, cy, 3, col.ink);
    text(ctx, 'wire (seen from above) with compass underneath', w / 2, h - 14, { color: col.muted, size: 10.5, align: 'center' });
  };
  upd();
}
