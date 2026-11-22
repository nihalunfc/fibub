// 2.1 One motion, two frames. A puck slides from the centre of a spinning turntable with no friction. From the ground
// it goes in a straight line; from the turntable it curves away, which the rider explains with centrifugal and
// Coriolis forces. Switch the view and change the spin.
import { canvas, text, dot, line, row, choice, slider, readout, loop, fmt, title } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.75, max: 420, min: 260, label: 'A puck sliding across a spinning turntable, seen from the ground or from the turntable' });
  let view = 'ground', w = 0.8, t = 0;
  const v = 0.35; // puck speed in turntable radii per second
  const T = 1 / v; // time to reach the rim
  const ctl = row(host);
  choice(ctl, 'View', [['ground', 'From the ground'], ['table', 'From the turntable']], view, (x) => { view = x; cv.redraw(); show(); });
  slider(ctl, { label: 'Spin ω (rad/s)', min: 0, max: 2, step: 0.05, value: w, fmt: (x) => fmt(x, 2), oninput: (x) => { w = x; t = 0; cv.redraw(); show(); } });
  const out = readout(host);
  const show = () => {
    out.innerHTML = view === 'ground'
      ? 'From the ground no horizontal force acts on the puck, so it moves in a <b>straight line at constant speed</b> (Newton\'s first law). The turntable simply turns underneath it.'
      : `On the turntable the same puck <b>curves</b> ${w > 0 ? 'against the spin' : '(no spin: it goes straight)'}. A rider can only explain this with fictitious forces: the centrifugal force mω²r outward and the Coriolis force −2m <b>ω</b> × <b>v′</b>, sideways to the motion.`;
  };
  // puck position at time s, in the chosen frame (units of turntable radius)
  const pos = (s) => {
    const x = v * s;
    if (view === 'ground') return [x, 0];
    const a = -w * s; // rotate the ground position backwards by the table's angle
    return [x * Math.cos(a), x * Math.sin(a)];
  };
  cv.draw = (ctx, W, H, col) => {
    const cx = W / 2, cy = H / 2 + 8, R = Math.min(W, H) * 0.4;
    const X = (p) => cx + p[0] * R, Y = (p) => cy - p[1] * R;
    title(ctx, view === 'ground' ? 'Seen from the ground (inertial)' : 'Seen from the turntable (rotating)', col);
    // the turntable with spokes: it turns in the ground view and stands still in the turntable view
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI); ctx.fillStyle = col.soft; ctx.fill();
    ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.stroke();
    const ang = view === 'ground' ? w * t : 0;
    for (let k = 0; k < 6; k++) {
      const a = ang + (k * Math.PI) / 3;
      line(ctx, [[cx, cy], [cx + R * Math.cos(a), cy - R * Math.sin(a)]], col.line, 1.2);
    }
    dot(ctx, cx + R * Math.cos(ang), cy - R * Math.sin(ang), 5, col.s[2]);
    const pts = [];
    for (let s = 0; s <= Math.min(t, T); s += 0.02) pts.push(pos(s));
    line(ctx, pts.map((p) => [X(p), Y(p)]), col.s[0], 2.5);
    const p = pos(Math.min(t, T));
    dot(ctx, X(p), Y(p), 7, col.s[0], col.ink);
    text(ctx, 'puck', X(p) + 10, Y(p) - 10, { color: col.ink, size: 12, weight: 600, halo: col.panel });
    text(ctx, 'dot = a mark on the rim of the turntable', 8, H - 10, { color: col.muted, size: 11, base: 'bottom' });
  };
  loop(host, (dt) => { t += dt; if (t > T + 0.8) t = 0; cv.redraw(); });
  cv.redraw(); show();
}
