// A charge in crossed electric and magnetic fields (E up the page, B out of the page). Released from rest it traces a
// cycloid and drifts sideways at E/B, whatever its charge or mass. Give it a start speed equal to E/B and it goes
// straight (a velocity selector); any other speed wiggles about that straight line. Flip the sign of the charge: the
// drift stays the same way, the loops turn the other way.
import { canvas, text, row, slider, choice, button, readout, loop, arrow, line, dot } from '../kit.js';

export default function (host) {
  let E = 1.5, B = 1.5, v0 = 0, sg = 1, st, trail = [];
  const cv = canvas(host, { aspect: 0.62, max: 340, min: 240, label: 'Path of a charge in perpendicular electric and magnetic fields' });
  const ctl = row(host), c2 = row(host);
  choice(ctl, 'Charge', [[1, 'Positive'], [-1, 'Negative']], sg, (x) => { sg = x; reset(); });
  button(ctl, 'Start speed = E/B', () => { v0 = E / B; sv.set(v0); reset(); });
  const sE = slider(c2, { label: 'E', min: 0.5, max: 3, value: E, step: 0.1, fmt: (x) => x.toFixed(1), oninput: (x) => { E = x; reset(); } });
  slider(c2, { label: 'B', min: 0.8, max: 3, value: B, step: 0.1, fmt: (x) => x.toFixed(1), oninput: (x) => { B = x; reset(); } });
  const sv = slider(c2, { label: 'Start speed v₀', min: 0, max: 5, value: v0, step: 0.1, fmt: (x) => x.toFixed(1), oninput: (x) => { v0 = x; reset(); } });
  const out = readout(host);
  const anim = loop(host, (dt) => { step(dt * 1.4); cv.redraw(); }); anim.button(ctl);
  function reset() { st = { x: 0, y: 0, vx: v0, vy: 0, t: 0 }; trail = [[0, 0]]; upd(); cv.redraw(); }
  function step(dt) { const vd = E / B, n = 8, h = dt / n; for (let i = 0; i < n; i++) { let ux = st.vx - vd, uy = st.vy; const f = -sg * B * h, c = Math.cos(f), s = Math.sin(f); [ux, uy] = [ux * c - uy * s, ux * s + uy * c]; st.vx = vd + ux; st.vy = uy; st.x += st.vx * h; st.y += st.vy * h; }
    trail.push([st.x, st.y]); if (trail.length > 700) trail.shift(); if (st.x * 30 > cv.w - 40) reset(); }
  function upd() { const vd = E / B, rr = Math.hypot(v0 - vd, 0) / B; out.innerHTML = `Drift speed E/B = <b>${vd.toFixed(2)}</b> (does not depend on the charge or its sign). Start speed ${v0.toFixed(1)}: ${Math.abs(v0 - vd) < 0.06 ? '<b>straight line, the selector passes this speed</b>' : `circling radius |v₀ − E/B|/B (in the drifting frame) = <b>${rr.toFixed(2)}</b>`}. Speeds other than E/B are bent out.`; }
  cv.draw = (ctx, w, h, col) => {
    const s = 30, ox = 24, oy = h / 2;
    for (let x = 18; x < w; x += 30) for (let y = 14; y < h; y += 30) { dot(ctx, x, y, 1.6, col.line); }
    for (let y = 22; y < h; y += 52) arrow(ctx, w - 24, y + 14, w - 24, y - 4, col.s[5], 2, 7);
    text(ctx, 'E', w - 14, h / 2 + 4, { color: col.s[5], size: 12, weight: 700, align: 'center' }); text(ctx, '⊙ B out of page', 10, h - 10, { color: col.muted, size: 11 });
    line(ctx, trail.map(([x, y]) => [ox + x * s, oy - y * s]), col.s[sg > 0 ? 5 : 0], 2);
    dot(ctx, ox + st.x * s, oy - st.y * s, 6, col.s[sg > 0 ? 5 : 0], col.panel);
    arrow(ctx, 10, 30, 10 + Math.min(70, Math.max(2, Math.abs(st.vx) * 14)) * Math.sign(st.vx || 1), 30, col.ink, 1.8, 6); text(ctx, 'velocity', 14, 44, { color: col.ink, size: 10 });
  };
  reset();
}
