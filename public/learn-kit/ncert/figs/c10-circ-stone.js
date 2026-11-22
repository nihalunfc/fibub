// Class 10 Circles: a stone whirled on a string moves in a circle. The string always points to the centre (the radius). The
// moment you let go, the stone flies off in a straight line along the TANGENT at that point, perpendicular to the string.
// This is the same as a wet bicycle wheel throwing mud sparks off along tangents, or a cricket hammer thrown from a circle.
import { canvas, text, title, line, dot, arrow, row, button, readout, loop } from '../../kit.js';

export default function (host) {
  let th = 0, rel = false, pos = null, vel = null, rp = null, tr = [];
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'A stone whirling on a string, released so that it flies off along the tangent' });
  const ctl = row(host);
  button(ctl, 'Let go of the string', () => { if (rel) return; rel = true; const R = cv.R || 80; pos = [Math.cos(th), -Math.sin(th)]; vel = [-Math.sin(th), -Math.cos(th)]; rp = pos.slice(); void R; say(); });
  button(ctl, 'Whirl again', () => { rel = false; tr = []; say(); });
  const out = readout(host);
  function say() { out.innerHTML = rel ? 'The string is gone, so nothing pulls the stone towards the centre. It moves in a <b>straight line along the tangent</b>, at 90° to the radius where it was released.' : 'The string pulls the stone inward all the time, bending its path into a circle. Press <b>Let go</b> at any moment.'; }
  const anim = loop(host, (dt) => {
    if (!rel) { th += dt * 2.2; tr.push(th); if (tr.length > 40) tr.shift(); } else { pos = [pos[0] + vel[0] * dt * 1.6, pos[1] + vel[1] * dt * 1.6]; if (Math.hypot(pos[0], pos[1]) > 3.6) { rel = false; tr = []; say(); } }
    cv.redraw();
  });
  void anim;
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Let go: the stone flies off along the tangent', col);
    const R = Math.min(w * 0.26, (h - 70) * 0.36), cx = w / 2, cy = h / 2 + 8; cv.R = R;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.setLineDash([4, 5]); ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.stroke(); ctx.setLineDash([]);
    dot(ctx, cx, cy, 5, col.ink); text(ctx, 'hand', cx + 9, cy + 13, { color: col.muted, size: 11 });
    if (!rel) {
      const sx = cx + Math.cos(th) * R, sy = cy - Math.sin(th) * R;
      line(ctx, [[cx, cy], [sx, sy]], col.s[0], 2.5); arrow(ctx, sx, sy, sx - Math.sin(th) * 34, sy - Math.cos(th) * 34, col.s[2], 2.5, 9);
      dot(ctx, sx, sy, 9, col.s[3], col.ink);
      text(ctx, 'velocity (tangent)', sx - Math.sin(th) * 40, sy - Math.cos(th) * 40 + 12, { color: col.s[2], size: 10.5, weight: 700, align: 'center', halo: col.panel });
    } else {
      const rx = cx + rp[0] * R, ry = cy + rp[1] * R, sx = cx + pos[0] * R, sy = cy + pos[1] * R;
      line(ctx, [[cx, cy], [rx, ry]], col.s[0], 2, [5, 4]); line(ctx, [[rx - vel[0] * R, ry - vel[1] * R], [sx, sy]], col.s[2], 2.5);
      const m = 10, u = [rp[0], rp[1]], v = [vel[0], vel[1]]; line(ctx, [[rx - u[0] * m, ry - u[1] * m], [rx - u[0] * m + v[0] * m, ry - u[1] * m + v[1] * m], [rx + v[0] * m, ry + v[1] * m]], col.ink, 1.5);
      dot(ctx, sx, sy, 9, col.s[3], col.ink); text(ctx, 'tangent', rx + v[0] * R * 0.8 + 6, ry + v[1] * R * 0.8 - 12, { color: col.s[2], size: 11, weight: 700, halo: col.panel });
    }
  };
  say(); cv.redraw();
}
