// Class 10 Magnetic Effects: the field of a circular loop and of a solenoid. Cut the coil along its axis: each turn shows
// as a pair of wires, current OUT of the page at the top (dot) and INTO it at the bottom (cross). Every wire makes
// circular field lines; inside the coil they all point the same way and add up. The field of a loop is strongest at its
// centre; a solenoid (many turns) has a strong, nearly uniform field inside, like a bar magnet's, with the N pole at the
// end the field comes out of. Field lines are traced from the sum of the straight-wire fields (B ~ 1/r each).
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let kind = 'solenoid', turns = 6, rev = false, core = false, comp = null; const cache = {};
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 280, label: 'Magnetic field lines of a circular loop and of a solenoid' });
  cv.c.style.touchAction = 'none'; cv.c.style.cursor = 'crosshair';
  const ctl = row(host);
  choice(ctl, 'Coil', [['loop', 'Circular loop'], ['solenoid', 'Solenoid']], kind, (v) => { kind = v; wt.style.display = v === 'solenoid' ? '' : 'none'; update(); });
  choice(ctl, 'Current', [['f', 'One way'], ['r', 'Reversed']], 'f', (v) => { rev = v === 'r'; update(); });
  slider(ctl, { label: 'Number of turns', min: 3, max: 12, step: 1, value: turns, fmt: (v) => `${v}`, oninput: (v) => { turns = v; update(); } });
  const wt = ctl.lastElementChild;
  choice(ctl, 'Iron core', [['off', 'Off'], ['on', 'On']], 'off', (v) => { core = v === 'on'; update(); });
  const out = readout(host);
  function update() {
    out.innerHTML = (kind === 'loop' ? 'A single loop: the field lines are circles near the wire and almost straight at the <b>centre</b>, where the contributions of all parts of the loop point the same way.' : `A solenoid of ${turns} turns: the lines inside are <b>parallel, equally spaced and strong</b> (uniform field); outside they spread out like a bar magnet’s.`) +
      ` The <b>N pole</b> is the end the lines come out of: the ${rev ? 'left' : 'right'} end here (right-hand rule: curl the fingers with the current, the thumb points to N).` + (core && kind === 'solenoid' ? ' With a <b>soft iron core</b> the field becomes hundreds of times stronger: that is an <b>electromagnet</b>.' : '');
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, kind === 'loop' ? 'Field of a circular loop (side cut)' : 'Field of a solenoid (side cut)', col);
    const cx = w / 2, cy = h * 0.52, Rc = Math.min(h * 0.2, 56), n = kind === 'loop' ? 1 : turns, sp = Math.min(22, (w * 0.5) / Math.max(1, n)), s = rev ? -1 : 1;
    const wires = []; for (let i = 0; i < n; i++) { const x = cx + (i - (n - 1) / 2) * sp; wires.push([x, cy - Rc, s], [x, cy + Rc, -s]); }
    // real 3-D field of the rings (Biot-Savart summed over 40 pieces per ring), evaluated in the cutting plane
    const NS = 40, CP = [], SP = []; for (let k = 0; k < NS; k++) { CP.push(Math.cos((2 * Math.PI * k) / NS)); SP.push(Math.sin((2 * Math.PI * k) / NS)); }
    const xs = wires.filter((_, i) => i % 2 === 0).map((q) => q[0]);
    const B = (x, yc) => {
      const yp = cy - yc, sg = yp >= 0 ? 1 : -1, rho = Math.abs(yp); let bx = 0, by = 0;
      for (const x0 of xs) for (let k = 0; k < NS; k++) { const rx = x - x0, ry = rho - Rc * CP[k], rz = -Rc * SP[k], r2 = rx * rx + ry * ry + rz * rz + 30, r3 = r2 * Math.sqrt(r2); bx += (-SP[k] * rz - CP[k] * ry) / r3; by += (CP[k] * rx) / r3; }
      return [s * bx, -s * sg * by];
    };
    const norm = (v) => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; };
    if (core && kind === 'solenoid') { ctx.save(); ctx.fillStyle = col.muted; ctx.globalAlpha = 0.35; ctx.fillRect(wires[0][0] - 6, cy - Rc + 5, wires[wires.length - 2][0] - wires[0][0] + 12, 2 * Rc - 10); ctx.restore(); text(ctx, 'soft iron', cx, cy, { color: col.ink, size: 10.5, weight: 700, align: 'center', halo: col.panel }); }
    const key = [kind, turns, rev, core, w, h].join('|');
    if (cache.key !== key) {
      cache.key = key; cache.lines = [];
      const seeds = core && kind === 'solenoid' ? 7 : 5;
      for (let k = 0; k < seeds; k++) {
        const y0 = cy + ((k - (seeds - 1) / 2) / ((seeds - 1) / 2 || 1)) * Rc * 0.5, trace = (dir) => { let x = cx, y = y0; const pts = [[x, y]]; for (let i = 0; i < 1100; i++) { const d = norm(B(x, y)); x += dir * d[0] * 3.5; y += dir * d[1] * 3.5; pts.push([x, y]); if (x < 2 || x > w - 2 || y < 34 || y > h - 4) break; if (wires.some(([wx, wy]) => Math.hypot(x - wx, y - wy) < 6)) break; if (i > 60 && Math.hypot(x - cx, y - y0) < 5) break; } return pts; };
        cache.lines.push(trace(-1).reverse().concat(trace(1)));
      }
    }
    for (const all of cache.lines) { line(ctx, all, col.s[0], 1.4); for (const f of [0.3, 0.75]) { const m = all[Math.floor(all.length * f)], m2 = all[Math.floor(all.length * f) + 2] || m; if (all.length > 14) arrow(ctx, m[0], m[1], m2[0], m2[1], col.s[0], 1.4, 6); } }
    for (const [wx, wy, c] of wires) { dot(ctx, wx, wy, 6.5, col.panel, col.ink); if (c > 0) dot(ctx, wx, wy, 2.2, col.ink); else { line(ctx, [[wx - 3.5, wy - 3.5], [wx + 3.5, wy + 3.5]], col.ink, 1.6); line(ctx, [[wx - 3.5, wy + 3.5], [wx + 3.5, wy - 3.5]], col.ink, 1.6); } }
    text(ctx, 'wire out of page ⊙', 8, cy - Rc - 14, { color: col.muted, size: 10 }); text(ctx, 'wire into page ⊗', 8, cy + Rc + 16, { color: col.muted, size: 10 });
    // poles at the ends
    const xl = wires[0][0] - 30, xr = wires[wires.length - 2][0] + 30; text(ctx, s > 0 ? 'S' : 'N', xl, cy, { color: s > 0 ? '#2a6df4' : '#e5241d', size: 18, weight: 700, align: 'center' }); text(ctx, s > 0 ? 'N' : 'S', xr, cy, { color: s > 0 ? '#e5241d' : '#2a6df4', size: 18, weight: 700, align: 'center' });
    // compass
    const c = comp || [cx, cy + Rc + 46 > h - 24 ? h - 24 : cy + Rc + 46], bb = B(c[0], c[1]), d = norm(bb);
    ctx.save(); ctx.translate(c[0], c[1]); ctx.fillStyle = col.panel; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 14, 0, 7); ctx.fill(); ctx.stroke(); ctx.rotate(Math.atan2(d[1], d[0]));
    ctx.fillStyle = '#e5241d'; ctx.beginPath(); ctx.moveTo(11, 0); ctx.lineTo(-2, -4); ctx.lineTo(-2, 4); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#2a6df4'; ctx.beginPath(); ctx.moveTo(-11, 0); ctx.lineTo(2, -4); ctx.lineTo(2, 4); ctx.closePath(); ctx.fill(); ctx.restore();
  };
  const place = (e) => { const r = cv.c.getBoundingClientRect(); comp = [e.clientX - r.left, e.clientY - r.top]; cv.redraw(); };
  cv.c.addEventListener('pointerdown', (e) => { cv.c.setPointerCapture(e.pointerId); place(e); cv.c.onpointermove = place; });
  cv.c.addEventListener('pointerup', () => { cv.c.onpointermove = null; });
  update();
}
