// 1.4 Two pictures of the same sky. Sun-centred: Earth (inner, faster) overtakes Mars, so Mars seems to drift
// backwards for a while. Earth-centred (Ptolemy): Mars rides a small circle (epicycle) whose centre moves on a
// big circle (deferent). The epicycle is exactly Earth's own orbit seen in reverse, so both pictures give the
// identical loop on the sky. The sky alone could not decide between them; Galileo's telescope did.
import { canvas, text, line, dot, row, loop, button, choice } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.85, max: 560, min: 380, label: 'Mars seen from Earth in a Sun-centred and an Earth-centred picture, and the loop it draws on the sky' });
  const ctl = row(host);
  let t = 0.62; // years; starts a little before opposition
  const track = [];
  const lon = (tt) => {
    const e = 2 * Math.PI * tt, m = (2 * Math.PI * tt) / 1.881 + 0.9;
    const ex = Math.cos(e), ey = Math.sin(e), mx = 1.524 * Math.cos(m), my = 1.524 * Math.sin(m);
    return { ex, ey, mx, my, l: Math.atan2(my - ey, mx - ex) };
  };
  const anim = loop(host, (dt) => { t += dt * 0.12; const p = lon(t); track.push([t, p.l]); if (track.length > 2400) track.shift(); cv.redraw(); });
  anim.button(ctl);
  button(ctl, '↺ Restart', () => { t = 0.62; track.length = 0; cv.redraw(); });
  let mode = 'sun';
  choice(ctl, 'Picture', [['sun', 'Sun-centred'], ['earth', 'Earth-centred']], mode, (v) => { mode = v; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = h * 0.62, cx = w / 2, cy = top / 2 + 4, s = Math.min(w, top) / 3.6;
    const p = lon(t);

    if (mode === 'sun') {
      for (const r of [1, 1.524]) { ctx.beginPath(); ctx.arc(cx, cy, r * s, 0, Math.PI * 2); ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.stroke(); }
      dot(ctx, cx, cy, 7, col.s[3]);
      const E = [cx + p.ex * s, cy - p.ey * s], M = [cx + p.mx * s, cy - p.my * s];
      const dx = M[0] - E[0], dy = M[1] - E[1], dl = Math.hypot(dx, dy);
      line(ctx, [E, [E[0] + dx / dl * s * 3, E[1] + dy / dl * s * 3]], col.muted, 1, [4, 4]);
      dot(ctx, E[0], E[1], 5, col.s[0]);
      dot(ctx, M[0], M[1], 4.5, col.s[1]);
      text(ctx, 'Earth', E[0] + 8, E[1] + 10, { color: col.ink, size: 11, weight: 600, halo: col.panel });
      text(ctx, 'Mars', M[0] + 8, M[1] - 10, { color: col.ink, size: 11, weight: 600, halo: col.panel });
      text(ctx, 'Sun', cx + 10, cy, { color: col.muted, size: 11, halo: col.panel });
    } else {
      // Earth fixed in the middle. Deferent: the epicycle's centre goes round at Mars's pace (radius 1.524).
      // Epicycle: radius 1, turning once a year, opposite to Earth's position around the Sun.
      const k = s * 0.7;
      const C = [cx + p.mx * k, cy - p.my * k], M = [cx + (p.mx - p.ex) * k, cy - (p.my - p.ey) * k], S = [cx - p.ex * k, cy + p.ey * k];
      ctx.beginPath(); ctx.arc(cx, cy, 1.524 * k, 0, Math.PI * 2); ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); ctx.arc(C[0], C[1], k, 0, Math.PI * 2); ctx.strokeStyle = col.s[1]; ctx.setLineDash([3, 3]); ctx.stroke(); ctx.setLineDash([]);
      line(ctx, [[cx, cy], C], col.line, 1);
      line(ctx, [C, M], col.s[1], 1);
      const dx = M[0] - cx, dy = M[1] - cy, dl = Math.hypot(dx, dy);
      line(ctx, [[cx, cy], [cx + dx / dl * s * 3, cy + dy / dl * s * 3]], col.muted, 1, [4, 4]);
      dot(ctx, S[0], S[1], 6, col.s[3]);
      dot(ctx, cx, cy, 6, col.s[0]);
      dot(ctx, M[0], M[1], 4.5, col.s[1]);
      text(ctx, 'Earth (fixed)', cx + 8, cy + 12, { color: col.ink, size: 11, weight: 600, halo: col.panel });
      text(ctx, 'Mars on its epicycle', M[0] + 8, M[1] - 10, { color: col.ink, size: 11, weight: 600, halo: col.panel });
      text(ctx, 'Sun', S[0] + 9, S[1], { color: col.muted, size: 11, halo: col.panel });
    }
    // sky strip
    const y0 = top + 10, y1 = h - 26;
    ctx.fillStyle = col.soft; ctx.fillRect(10, y0, w - 20, y1 - y0);
    text(ctx, 'Where Mars appears among the stars (time runs downward)', 14, y0 + 10, { color: col.ink, size: 11.5, weight: 600 });
    // map longitude relative to the current one: window of ±70°
    if (track.length > 1) {
      const lNow = track[track.length - 1][1], t0 = track[0][0], tNow = track[track.length - 1][0];
      const span = Math.max(0.8, tNow - t0);
      const pts = track.map(([tt, l]) => {
        let d = l - lNow; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
        // sky longitude increases to the left (east is left when facing south)
        return [w / 2 - (d / (Math.PI * 0.45)) * (w / 2 - 20), y0 + 22 + ((tt - (tNow - span)) / span) * (y1 - y0 - 30)];
      }).filter(([x]) => x > 12 && x < w - 12);
      line(ctx, pts, col.s[1], 2);
      const last = pts[pts.length - 1];
      if (last) dot(ctx, last[0], last[1], 4, col.s[1]);
    }
    text(ctx, '← east', 16, y1 - 10, { color: col.muted, size: 11 });
    text(ctx, 'west →', w - 16, y1 - 10, { color: col.muted, size: 11, align: 'right' });
    // is Mars going backwards right now?
    if (track.length > 3) {
      const a = track[track.length - 1][1], b = track[track.length - 4][1];
      let d = a - b; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
      text(ctx, d < 0 ? 'Mars is moving backwards (retrograde): Earth is overtaking it' : 'Mars moves eastward among the stars, as usual', w / 2, y1 + 12, { color: d < 0 ? col.s[1] : col.muted, size: 11.5, weight: 600, align: 'center' });
    }
  };
  cv.redraw();
}
