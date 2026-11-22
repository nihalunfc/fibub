// Class 10 Magnetic Effects: the magnetic field of bar magnets. Field lines show the direction a free north pole would
// move: they leave a magnet at its north pole, enter at its south pole, never cross, and are closer together where the
// field is stronger. Drag the compass anywhere: its needle lines up with the field there. The lines are traced from a
// model of two point poles per magnet (B from each pole falls as 1/r^2). Try one magnet, then two magnets with
// unlike poles facing (attract: lines join them) or like poles facing (repel: lines push apart, with a neutral point).
import { canvas, text, title, line, dot, arrow, row, choice, readout } from '../../kit.js';

export default function (host) {
  let view = 'lines', setup = 'one', flip = false, comp = null;
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 280, label: 'Magnetic field lines of bar magnets with a draggable compass' });
  cv.c.style.touchAction = 'none'; cv.c.style.cursor = 'crosshair';
  const ctl = row(host);
  choice(ctl, 'Show', [['lines', 'Field lines'], ['filings', 'Iron filings'], ['none', 'Compass only']], view, (v) => { view = v; update(); });
  choice(ctl, 'Magnets', [['one', 'One magnet'], ['attract', 'Two: N faces S'], ['repel', 'Two: N faces N']], setup, (v) => { setup = v; update(); });
  choice(ctl, 'Poles', [['n', 'N on right'], ['s', 'N on left']], 'n', (v) => { flip = v === 's'; update(); });
  const out = readout(host);
  function update() {
    out.innerHTML = setup === 'one' ? 'Lines leave the <b>north</b> pole and curve round into the <b>south</b> pole. They are crowded near the poles (strong field) and spread out far away. Inside the magnet they run from S to N, so each line is a closed loop.'
      : setup === 'attract' ? 'Unlike poles facing each other: the lines run straight across the gap from one magnet into the other. The magnets <b>attract</b>.' : 'Like poles facing each other: the lines bend away and never cross. Between the poles there is a <b>neutral point</b> where the field is zero. The magnets <b>repel</b>.';
    cv.redraw();
  }
  const poles = (w, h) => {
    const cy = h * 0.5, L = Math.min(w * 0.17, 70), s = flip ? -1 : 1;
    if (setup === 'one') return { p: [[w / 2 + s * L, cy, 1], [w / 2 - s * L, cy, -1]], mags: [[w / 2, cy, L]] };
    const L2 = Math.min(w * 0.1, 44), x1 = w * 0.27, x2 = w * 0.73;
    const second = setup === 'attract' ? -1 : 1; // attract: facing poles unlike
    return { p: [[x1 + s * L2, cy, 1], [x1 - s * L2, cy, -1], [x2 - s * L2, cy, 1 * second * -1 * -1 * (setup === 'attract' ? -1 : 1) * -1 * 1], [x2 + s * L2, cy, -1 * second * -1 * -1 * (setup === 'attract' ? -1 : 1) * -1 * 1]].map((q, i) => (i < 2 ? q : q)), mags: [[x1, cy, L2], [x2, cy, L2]], L2 };
  };
  const fieldFn = (P) => (x, y) => { let bx = 0, by = 0; for (const [px, py, q] of P) { const dx = x - px, dy = y - py, r2 = dx * dx + dy * dy + 30, r = Math.sqrt(r2); bx += (q * dx) / (r2 * r); by += (q * dy) / (r2 * r); } return [bx, by]; };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Field of bar magnets: drag the compass', col);
    let { p: P, mags } = poles(w, h);
    if (setup !== 'one') { // set the second magnet's poles explicitly: attract = (S,N) facing left side, repel = N,N
      const s = flip ? -1 : 1, L2 = mags[0][2], x1 = mags[0][0], x2 = mags[1][0], cy = h * 0.5;
      const a = s, b = setup === 'attract' ? s : -s; // sign of the pole on the +x end of each magnet
      P = [[x1 + L2, cy, a], [x1 - L2, cy, -a], [x2 + L2, cy, b], [x2 - L2, cy, -b]];
    }
    const B = fieldFn(P), cy = h * 0.5;
    // magnets
    for (const [mx, , L] of mags) {
      const east = P.find((q) => Math.abs(q[0] - (mx + L)) < 1), west = P.find((q) => Math.abs(q[0] - (mx - L)) < 1);
      for (const [q, x0] of [[west, mx - L], [east, mx]]) { ctx.fillStyle = q[2] > 0 ? '#e5241d' : '#2a6df4'; ctx.fillRect(x0, cy - 11, L, 22); }
      ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(mx - L, cy - 11, 2 * L, 22);
      text(ctx, west[2] > 0 ? 'N' : 'S', mx - L / 2, cy, { color: '#fff', size: 13, weight: 700, align: 'center' }); text(ctx, east[2] > 0 ? 'N' : 'S', mx + L / 2, cy, { color: '#fff', size: 13, weight: 700, align: 'center' });
    }
    const norm = (v) => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; };
    if (view === 'lines') {
      const sources = P.filter((q) => q[2] > 0);
      for (const [sx, sy] of sources) {
        const n = 16;
        for (let k = 0; k < n; k++) {
          const a = ((k + 0.5) / n) * 2 * Math.PI; let x = sx + Math.cos(a) * 12, y = sy + Math.sin(a) * 12, pts = [[x, y]], ok = true;
          for (let i = 0; i < 700 && ok; i++) {
            const d = norm(B(x, y)); x += d[0] * 3; y += d[1] * 3; pts.push([x, y]);
            if (x < 2 || x > w - 2 || y < 36 || y > h - 4) ok = false;
            for (const [qx, qy, qq] of P) if (qq < 0 && Math.hypot(x - qx, y - qy) < 9) ok = false;
          }
          line(ctx, pts, col.s[0], 1.4);
          const m = pts[Math.floor(pts.length * 0.45)], m2 = pts[Math.floor(pts.length * 0.45) + 2] || m; if (pts.length > 12) arrow(ctx, m[0], m[1], m2[0], m2[1], col.s[0], 1.4, 6);
        }
      }
    } else if (view === 'filings') {
      ctx.save(); ctx.strokeStyle = col.ink; ctx.lineCap = 'round';
      for (let gx = 12; gx < w - 6; gx += 14) for (let gy = 44; gy < h - 8; gy += 14) {
        let inside = false; for (const [mx, , L] of mags) if (Math.abs(gx - mx) < L + 3 && Math.abs(gy - cy) < 14) inside = true; if (inside) continue;
        const b = B(gx, gy), m = Math.hypot(b[0], b[1]), d = norm(b), len = 4 + Math.min(5, m * 900); ctx.globalAlpha = Math.min(1, 0.25 + m * 1400); ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(gx - d[0] * len / 2, gy - d[1] * len / 2); ctx.lineTo(gx + d[0] * len / 2, gy + d[1] * len / 2); ctx.stroke();
      }
      ctx.restore();
    }
    // the compass
    const c = comp || [w * 0.5, h * 0.82];
    const b = B(c[0], c[1]), d = norm(b), R = 15;
    ctx.save(); ctx.translate(c[0], c[1]); ctx.fillStyle = col.panel; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, R + 4, 0, 7); ctx.fill(); ctx.stroke();
    const ang = Math.atan2(d[1], d[0]); ctx.rotate(ang);
    ctx.fillStyle = '#e5241d'; ctx.beginPath(); ctx.moveTo(R, 0); ctx.lineTo(-2, -5); ctx.lineTo(-2, 5); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#2a6df4'; ctx.beginPath(); ctx.moveTo(-R, 0); ctx.lineTo(2, -5); ctx.lineTo(2, 5); ctx.closePath(); ctx.fill(); ctx.restore();
    text(ctx, 'compass: red end points along the field', 8, h - 8, { color: col.muted, size: 10 });
  };
  const place = (e) => { const r = cv.c.getBoundingClientRect(); comp = [e.clientX - r.left, e.clientY - r.top]; cv.redraw(); };
  cv.c.addEventListener('pointerdown', (e) => { cv.c.setPointerCapture(e.pointerId); place(e); cv.c.onpointermove = place; });
  cv.c.addEventListener('pointerup', () => { cv.c.onpointermove = null; });
  update();
}
