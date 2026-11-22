// Class 10 Magnetic Effects: the DC electric motor. A rectangular coil sits between the poles of a magnet. Looking along
// the axle we see the two long sides as circles: one carries current out of the page (dot), the other into it (cross).
// Fleming's left-hand rule gives an upward force on one side and a downward force on the other, a turning effect (torque)
// on the coil. The split-ring commutator reverses the current every half turn, so the torque never reverses and the
// coil keeps spinning the same way. Without the commutator the coil swings to the vertical and stops (it oscillates).
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout, loop } from '../../kit.js';

/** Draw the motor with the coil at angle th (radians, anticlockwise, 0 = coil horizontal). */
export function drawMotor(ctx, w, h, col, th, o = {}) {
  const cx = w * 0.5, cy = h * 0.46, r = Math.min(w * 0.18, h * 0.24), com = o.commutator !== false;
  // magnet poles with the field lines between them (left N, right S)
  ctx.fillStyle = '#e5241d'; ctx.fillRect(10, cy - 46, 34, 92); ctx.fillStyle = '#2a6df4'; ctx.fillRect(w - 44, cy - 46, 34, 92);
  text(ctx, 'N', 27, cy, { color: '#fff', size: 16, weight: 700, align: 'center' }); text(ctx, 'S', w - 27, cy, { color: '#fff', size: 16, weight: 700, align: 'center' });
  for (const dy of [-30, -15, 0, 15, 30]) arrow(ctx, 52, cy + dy, w - 52, cy + dy, col.s[0], 1, 6);
  text(ctx, 'field B →', 10, cy - 58, { color: col.s[0], size: 10.5, weight: 700 });
  // coil: bar through the two wire cross-sections, rotating anticlockwise (screen)
  const x1 = cx + r * Math.cos(th), y1 = cy - r * Math.sin(th), x2 = cx - r * Math.cos(th), y2 = cy + r * Math.sin(th);
  line(ctx, [[x1, y1], [x2, y2]], col.ink, 3.5); dot(ctx, cx, cy, 3, col.ink);
  // current direction in each side: with a commutator the right-hand side always carries current OUT of the page
  const cs = Math.cos(th) >= 0 ? 1 : -1, sideOut = (side) => (com ? (side === 1 ? cs > 0 : cs < 0) : side === 1);
  const mark = (x, y, outp) => { dot(ctx, x, y, 11, col.panel, col.ink); if (outp) dot(ctx, x, y, 3.2, col.ink); else { line(ctx, [[x - 5, y - 5], [x + 5, y + 5]], col.ink, 2); line(ctx, [[x - 5, y + 5], [x + 5, y - 5]], col.ink, 2); } };
  mark(x1, y1, sideOut(1)); mark(x2, y2, sideOut(2));
  // forces: current out of page, field to the right => force up (left-hand rule); into page => down
  const fl = 40, mag = (Math.abs(Math.cos(th)) > 0.05 ? 1 : 0.15);
  for (const [x, y, outp] of [[x1, y1, sideOut(1)], [x2, y2, sideOut(2)]]) { const up = outp; arrow(ctx, x, y + (up ? -14 : 14), x, y + (up ? -14 - fl * mag : 14 + fl * mag), col.s[3], 3.2, 10); }
  // split-ring commutator inset (the gap crosses the brushes when the coil is vertical)
  const ix = o.inset ? o.inset[0] : w * 0.5, iy = o.inset ? o.inset[1] : h - 38, ir = 14;
  ctx.save(); ctx.lineWidth = 6; for (const [a0, c] of [[0, col.s[1]], [Math.PI, col.s[2]]]) { ctx.strokeStyle = c; ctx.beginPath(); ctx.arc(ix, iy, ir, -th + a0 + 0.2 + Math.PI / 2 * 0, -th + a0 + Math.PI - 0.2); ctx.stroke(); } ctx.restore();
  if (com) { ctx.fillStyle = col.ink; ctx.fillRect(ix - ir - 12, iy - 2, 10, 4); ctx.fillRect(ix + ir + 2, iy - 2, 10, 4); text(ctx, 'brush', ix - ir - 8, iy + 14, { color: col.muted, size: 9.5, align: 'center' }); text(ctx, 'brush', ix + ir + 8, iy + 14, { color: col.muted, size: 9.5, align: 'center' }); text(ctx, o.inset ? 'commutator' : 'split-ring commutator', ix, iy - 24, { color: col.muted, size: 10, align: 'center' }); }
  else text(ctx, 'plain slip rings: no reversal', ix, iy - 24, { color: col.muted, size: 10, align: 'center' });
}
export default function (host) {
  let th = 0.35, om = 0, com = true, V = 5, t = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 290, label: 'End view of a DC motor coil turning between the poles of a magnet' });
  const ctl = row(host);
  choice(ctl, 'Commutator', [['on', 'Split ring'], ['off', 'None']], 'on', (v) => { com = v === 'on'; om = 0; th = 0.35; update(); });
  slider(ctl, { label: 'Current (strength of push)', min: 1, max: 10, step: 1, value: V, fmt: (v) => `${v} A`, oninput: (v) => { V = v; update(); } });
  const out = readout(host);
  function update() { out.innerHTML = com ? 'With the <b>split ring</b> the current in each side flips just as the coil passes the vertical, so the side on the right always gets the upward push and the left side the downward push. The torque keeps the same sign: the coil <b>spins</b>. More current gives a faster, stronger turn.' : 'With <b>no commutator</b> the current never reverses. Past the vertical, the forces try to turn the coil <i>backwards</i>, so it just swings to and fro and comes to rest with the coil vertical.'; }
  loop(host, (dt) => { t += dt; const n = 4; for (let k = 0; k < n; k++) { const d = dt / n, tq = (V / 5) * (com ? Math.abs(Math.cos(th)) : Math.cos(th)); om += (tq * 14 - om * (com ? 0.9 + om * 0.05 : 1.6)) * d; th += om * d; } cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'DC motor: the coil keeps turning', col);
    drawMotor(ctx, w, h, col, th, { commutator: com });
    text(ctx, `speed ≈ ${Math.abs(om * 60 / (2 * Math.PI)).toFixed(0)} turns/min (model)`, 10, h - 8, { color: col.muted, size: 10 });
  };
  update();
}
