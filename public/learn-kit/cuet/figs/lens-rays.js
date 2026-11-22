// 6.6 A convex lens: drag the object and watch the two principal rays find the image (real and inverted, or virtual).
import { canvas, line, text, arrow, row, slider, readout } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.5, max: 300, min: 200, label: 'Ray diagram for a convex lens with a movable object' });
  const f = 10; let u = 25;
  const ctl = row(host);
  slider(ctl, { label: 'Object distance', min: 4, max: 40, step: 1, value: u, fmt: (v) => `${v} cm`, oninput: (v) => { u = v; go(); } });
  const out = readout(host);
  const go = () => {
    cv.redraw();
    if (u === f) { out.innerHTML = 'Object at the focus: the rays leave parallel, so the image is at infinity.'; return; }
    const v = (u * f) / (u - f), m = -v / u;
    out.innerHTML = v > 0
      ? `Image ${v.toFixed(1)} cm behind the lens, <b>real and inverted</b>, ${Math.abs(m) > 1 ? 'magnified' : Math.abs(m) < 1 ? 'smaller' : 'same size'} (m = ${m.toFixed(2)}). A projector and the eye work like this.`
      : `Image ${(-v).toFixed(1)} cm on the same side as the object, <b>virtual, upright and magnified</b> (m = ${m.toFixed(2)}). This is a magnifying glass.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const cx = w / 2, cy = h * 0.55, s = (w * 0.45) / 40, oh = h * 0.22;
    const X = (d) => cx + d * s;
    line(ctx, [[0, cy], [w, cy]], col.line, 1);
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(cx, cy, 6, h * 0.42, 0, 0, 7); ctx.stroke();
    for (const d of [-f, f]) { ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(X(d), cy, 3, 0, 7); ctx.fill(); text(ctx, 'F', X(d), cy + 12, { color: col.muted, size: 11, align: 'center' }); }
    const ox = X(-u); arrow(ctx, ox, cy, ox, cy - oh, col.s[2], 3);
    text(ctx, 'object', ox, cy + 12, { color: col.s[2], size: 11, align: 'center' });
    // ray 1: parallel, then through F on the far side; ray 2: straight through the centre
    const ray = col.s[3];
    line(ctx, [[ox, cy - oh], [cx, cy - oh]], ray, 1.6);
    const slope1 = oh / (f * s); line(ctx, [[cx, cy - oh], [w, cy - oh + slope1 * (w - cx)]], ray, 1.6);
    const slope2 = oh / (u * s); line(ctx, [[ox, cy - oh], [w, cy - oh + slope2 * (w - ox)]], ray, 1.6);
    if (u === f) return;
    const v = (u * f) / (u - f), ih = -oh * (v / u);
    if (v > 0 && X(v) < w) { arrow(ctx, X(v), cy, X(v), cy - ih, col.s[1], 3); text(ctx, 'image', X(v), cy + 12, { color: col.s[1], size: 11, align: 'center' }); }
    if (v < 0) {
      line(ctx, [[cx, cy - oh], [X(v), cy - ih]], ray, 1, [4, 4]); line(ctx, [[ox, cy - oh], [X(v), cy - ih]], ray, 1, [4, 4]);
      if (X(v) > 0) { arrow(ctx, X(v), cy, X(v), cy - ih, col.s[1], 2); text(ctx, 'virtual image', X(v), cy + 12, { color: col.s[1], size: 11, align: 'center' }); }
    }
  };
  go();
}
