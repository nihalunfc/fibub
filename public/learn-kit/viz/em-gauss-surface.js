// Gauss's law with a surface you can resize. Drag the charges in or out of the sphere (side view) and change its
// radius. The flux through the sphere is worked out numerically by adding E·dA over 7000 patches of the surface, and
// compared with Q_enclosed/ε0. Charges outside add field lines in on one side and out on the other: zero net flux.
import { canvas, text, row, slider, readout, dot, fmt } from '../kit.js';

export default function (host) {
  let R = 1, Q = [{ x: -0.35, y: 0.2, q: 3 }, { x: 0.5, y: -0.3, q: -2 }, { x: 1.7, y: 0.4, q: 2 }], drag = -1;
  const cv = canvas(host, { aspect: 0.7, max: 380, min: 270, label: 'A sphere around charges and the flux through it' });
  cv.c.style.touchAction = 'none';
  const ctl = row(host);
  slider(ctl, { label: 'Sphere radius', min: 0.3, max: 2.4, value: R, step: 0.02, fmt: (v) => v.toFixed(2), oninput: (v) => { R = v; upd(); } });
  const out = readout(host);
  const sc = () => Math.min(cv.w / 5.2, cv.h / 3.2);
  const pos = (e) => { const b = cv.c.getBoundingClientRect(); return [(e.clientX - b.left - cv.w / 2) / sc(), -(e.clientY - b.top - cv.h / 2) / sc()]; };
  cv.c.addEventListener('pointerdown', (e) => { const [x, y] = pos(e); drag = -1; let b = 0.35; Q.forEach((c, i) => { const d = Math.hypot(c.x - x, c.y - y); if (d < b) { b = d; drag = i; } }); if (drag >= 0) cv.c.setPointerCapture(e.pointerId); });
  cv.c.addEventListener('pointermove', (e) => { if (drag < 0) return; const [x, y] = pos(e); Q[drag].x = Math.max(-2.5, Math.min(2.5, x)); Q[drag].y = Math.max(-1.5, Math.min(1.5, y)); upd(); });
  cv.c.addEventListener('pointerup', () => { drag = -1; });
  const flux = () => { // charges lie in the plane z = 0; Φ·ε0 = Σ q ∮ (d·n)/(4π d³) dA over the sphere
    let s = 0; const NT = 50, NP = 100;
    for (let i = 0; i < NT; i++) { const th = (i + 0.5) / NT * Math.PI, st = Math.sin(th), ct = Math.cos(th);
      for (let j = 0; j < NP; j++) { const ph = (j + 0.5) / NP * 2 * Math.PI, nx = st * Math.cos(ph), ny = ct, nz = st * Math.sin(ph), dA = R * R * st * (Math.PI / NT) * (2 * Math.PI / NP);
        for (const c of Q) { const dx = R * nx - c.x, dy = R * ny - c.y, dz = R * nz, d = Math.sqrt(dx * dx + dy * dy + dz * dz); s += c.q * (dx * nx + dy * ny + dz * nz) / (4 * Math.PI * d * d * d) * dA; } } }
    return s;
  };
  function upd() {
    const inside = Q.filter((c) => Math.hypot(c.x, c.y) < R), enc = inside.reduce((s, c) => s + c.q, 0), f = flux();
    out.innerHTML = `Charges inside: ${inside.length ? inside.map((c) => (c.q > 0 ? '+' : '') + c.q).join(', ') : 'none'} → Q<sub>enc</sub> = <b>${enc}</b>. Flux worked out from the field on the surface: <b>${f.toFixed(2)}</b> (in units of q/ε₀). They match, whatever the shape of the charges inside, and whatever is outside.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const s = sc(), X = (x) => w / 2 + x * s, Y = (y) => h / 2 - y * s;
    ctx.beginPath(); ctx.arc(X(0), Y(0), R * s, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2.5; ctx.stroke();
    // sign of E·n around the circle (little ticks: red out, blue in)
    for (let k = 0; k < 48; k++) { const a = k / 48 * Math.PI * 2, nx = Math.cos(a), ny = Math.sin(a); let en = 0;
      for (const c of Q) { const dx = R * nx - c.x, dy = R * ny - c.y, d3 = Math.pow(dx * dx + dy * dy, 1.5) + 1e-6; en += c.q * (dx * nx + dy * ny) / d3; }
      const L = Math.min(18, Math.abs(en) * 22 + 2); ctx.strokeStyle = en > 0 ? col.s[5] : col.s[0]; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(X(R * nx), Y(R * ny)); ctx.lineTo(X(R * nx) + nx * L * (en > 0 ? 1 : -1), Y(R * ny) - ny * L * (en > 0 ? 1 : -1)); ctx.stroke(); }
    Q.forEach((c) => { const r = 8 + Math.abs(c.q) * 1.5; dot(ctx, X(c.x), Y(c.y), r, c.q > 0 ? col.s[5] : col.s[0], col.panel); text(ctx, (c.q > 0 ? '+' : '−') + Math.abs(c.q), X(c.x), Y(c.y), { color: '#fff', size: 11, weight: 700, align: 'center' }); });
    text(ctx, 'Ticks: field out (red) or in (blue) through the surface', 10, h - 10, { color: col.muted, size: 10.5 });
    text(ctx, 'Drag charges', 10, 16, { color: col.muted, size: 11 });
  };
  upd();
}
