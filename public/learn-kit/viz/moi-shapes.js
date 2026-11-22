// Moment of inertia, shape by shape: pick a body (ring, disc, rod, solid or hollow sphere, cylinder, plate) and an
// axis; the body spins about that axis in 3D (drag to turn the view). Each dot is a bit of mass, drawn bigger and
// darker the farther it is from the axis, because it counts r² times. The readout compares the textbook formula with
// the value worked out from the dots themselves, and "Same push" spins every choice up with the same torque, so a
// bigger I visibly speeds up more slowly (α = τ/I).
import { canvas, text, row, choice, readout, loop, button, rng, title } from '../kit.js';
import { orbit, shapes, wire, rotAbout } from './_3d.js';

const R1 = rng(7);
const cloud = (n, f) => { const out = []; while (out.length < n) { const p = f(); if (p) out.push(p); } return out; };
const u = () => R1() * 2 - 1;
// Point clouds (mass elements) in model units, radius 1 (rod length 2)
const CLOUDS = {
  ring: () => cloud(260, () => { const t = R1() * 2 * Math.PI; return [Math.cos(t), 0, Math.sin(t)]; }),
  disc: () => cloud(420, () => { const x = u(), z = u(); return x * x + z * z <= 1 ? [x, 0, z] : null; }),
  rod: () => cloud(160, () => [u(), 0, 0]),
  sphere: () => cloud(520, () => { const p = [u(), u(), u()]; return p[0] ** 2 + p[1] ** 2 + p[2] ** 2 <= 1 ? p : null; }),
  shell: () => cloud(420, () => { const p = [u(), u(), u()], r = Math.hypot(...p); return r > 0.2 && r <= 1 ? p.map((v) => v / r) : null; }),
  cylinder: () => cloud(520, () => { const x = u(), z = u(); return x * x + z * z <= 1 ? [x, u() * 0.9, z] : null; }),
  plate: () => cloud(420, () => [u() * 1.1, 0, u() * 0.75]),
};
const Y = [0, 1, 0], X = [1, 0, 0], Z = [0, 0, 1], O = [0, 0, 0];
// k = I ÷ (M × size²); size is R (or L for the rod, a and b for the plate, where k is written out)
const SHAPES = {
  ring: { name: 'Ring', wire: () => shapes.ring(1), axes: [
    { name: 'Centre, ⊥ plane', f: 'I = MR²', k: 1, o: O, u: Y },
    { name: 'Diameter', f: 'I = ½MR²', k: 1 / 2, o: O, u: X },
    { name: 'Tangent in plane', f: 'I = 3⁄2 MR²', k: 3 / 2, o: [0, 0, 1], u: X },
    { name: 'Rim, ⊥ plane', f: 'I = 2MR²', k: 2, o: [1, 0, 0], u: Y },
  ] },
  disc: { name: 'Disc', wire: () => shapes.disc(1), axes: [
    { name: 'Centre, ⊥ plane', f: 'I = ½MR²', k: 1 / 2, o: O, u: Y },
    { name: 'Diameter', f: 'I = ¼MR²', k: 1 / 4, o: O, u: X },
    { name: 'Tangent in plane', f: 'I = 5⁄4 MR²', k: 5 / 4, o: [0, 0, 1], u: X },
    { name: 'Rim, ⊥ plane', f: 'I = 3⁄2 MR²', k: 3 / 2, o: [1, 0, 0], u: Y },
  ] },
  rod: { name: 'Thin rod', wire: () => shapes.rod(2), unit: 'L', axes: [
    { name: 'Centre, ⊥ rod', f: 'I = ML²⁄12', k: 1 / 12, o: O, u: Y, s: 4 },
    { name: 'End, ⊥ rod', f: 'I = ML²⁄3', k: 1 / 3, o: [-1, 0, 0], u: Y, s: 4 },
    { name: 'Along the rod', f: 'I ≈ 0 (thin)', k: 0, o: O, u: X, s: 4 },
  ] },
  sphere: { name: 'Solid sphere', wire: () => shapes.sphere(1, 6), axes: [
    { name: 'Diameter', f: 'I = 2⁄5 MR²', k: 2 / 5, o: O, u: Y },
    { name: 'Tangent', f: 'I = 7⁄5 MR²', k: 7 / 5, o: [1, 0, 0], u: Y },
  ] },
  shell: { name: 'Hollow sphere', wire: () => shapes.sphere(1, 6), axes: [
    { name: 'Diameter', f: 'I = 2⁄3 MR²', k: 2 / 3, o: O, u: Y },
    { name: 'Tangent', f: 'I = 5⁄3 MR²', k: 5 / 3, o: [1, 0, 0], u: Y },
  ] },
  cylinder: { name: 'Solid cylinder', wire: () => shapes.cylinder(1, 1.8), axes: [
    { name: 'Own axis', f: 'I = ½MR²', k: 1 / 2, o: O, u: Y },
    { name: 'Centre, ⊥ axis', f: 'I = M(R²⁄4 + H²⁄12)', k: 1 / 4 + 1.8 ** 2 / 12, o: O, u: X, note: 'here H = 1.8R' },
  ] },
  plate: { name: 'Rectangular plate', wire: () => shapes.plate(2.2, 1.5), unit: 'plate', axes: [
    { name: 'Centre, ⊥ plate', f: 'I = M(a² + b²)⁄12', k: null, o: O, u: Y },
    { name: 'Centre, ∥ side b', f: 'I = Ma²⁄12', k: null, o: O, u: Z },
    { name: 'Edge b', f: 'I = Ma²⁄3', k: null, o: [-1.1, 0, 0], u: Z },
  ] },
};
const IDS = Object.keys(SHAPES);
const PTS = Object.fromEntries(IDS.map((id) => [id, CLOUDS[id]()]));

// perpendicular distance² of p from the line (o, u)
const r2 = (p, o, u) => { const v = [p[0] - o[0], p[1] - o[1], p[2] - o[2]], d = v[0] * u[0] + v[1] * u[1] + v[2] * u[2]; return v[0] ** 2 + v[1] ** 2 + v[2] ** 2 - d * d; };

export default function (host) {
  let shape = 'disc', ax = 0, ang = 0, omega = 1.6, mode = 'steady', tPush = 0;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 300, label: 'A body spinning about a chosen axis, with its moment of inertia' });
  const cam = orbit(cv, { yaw: 0.55, pitch: 0.42 });
  const ctl = row(host), axRow = row(host);
  choice(ctl, 'Body', IDS.map((id) => [id, SHAPES[id].name]), shape, (v) => { shape = v; ax = 0; makeAxes(); reset(); });
  let axGroup = null;
  const makeAxes = () => {
    axRow.innerHTML = '';
    axGroup = choice(axRow, 'Axis', SHAPES[shape].axes.map((a, i) => [i, a.name]), ax, (v) => { ax = v; reset(); });
  };
  makeAxes();
  const ctl2 = row(host);
  choice(ctl2, 'Spin', [['steady', 'Steady'], ['push', 'Same push (equal torque)']], mode, (v) => { mode = v; reset(); });
  const anim = loop(host, (dt) => {
    const A = SHAPES[shape].axes[ax], I = Imeasured(A);
    if (mode === 'push') { tPush += dt; if (tPush > 5) tPush = 0; omega = Math.min(9, (0.5 / Math.max(I, 0.02)) * tPush); } else omega = 1.6;
    ang += omega * dt; cv.redraw(); if (mode === 'push') show();
  });
  anim.button(ctl2);
  button(ctl2, 'Restart', () => reset());
  const out = readout(host);
  function reset() { ang = 0; tPush = 0; cv.redraw(); show(); }
  // I per unit mass from the dots (in model units: R = 1, rod L = 2, so convert)
  function Imeasured(A) { const P = PTS[shape]; return P.reduce((s, p) => s + r2(p, A.o, A.u), 0) / P.length; }
  function show() {
    const S = SHAPES[shape], A = S.axes[ax], I = Imeasured(A);
    let meas;
    if (S.unit === 'L') meas = `${(I / 4).toFixed(3)} ML² from the dots (formula ${A.k === 0 ? '0' : A.k.toFixed(3)} ML²)`;
    else if (S.unit === 'plate') meas = `${I.toFixed(3)} M (with a = 2.2, b = 1.5: formula ${[((2.2 ** 2 + 1.5 ** 2) / 12), 2.2 ** 2 / 12, 2.2 ** 2 / 3][ax].toFixed(3)} M)`;
    else meas = `${I.toFixed(3)} MR² from the dots (formula ${A.k.toFixed(3)} MR²)`;
    const push = mode === 'push' ? ` Same torque on every body: α = τ/I, so it is spinning at ω = ${omega.toFixed(2)} rad/s after ${tPush.toFixed(1)} s.` : '';
    out.innerHTML = `<b>${S.name}, axis: ${A.name}.</b> ${A.f}${A.note ? ` (${A.note})` : ''}. Measured: ${meas}.${push} Bigger dots are farther from the axis and count r² times.`;
  }
  cv.draw = (ctx, w, h, col) => {
    const S = SHAPES[shape], A = S.axes[ax], sc = Math.min(w, h) * (A.s ? 0.22 : 0.27);
    const P = cam.proj(w, h, sc, w / 2, h / 2 + 10);
    const spin = (p) => rotAbout(p, A.o, A.u, ang);
    // the axis
    const a0 = A.o.map((v, i) => v - A.u[i] * 1.6), a1 = A.o.map((v, i) => v + A.u[i] * 1.6);
    const [x0, y0] = P(a0), [x1, y1] = P(a1);
    ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.restore();
    const [lx, ly] = y0 > y1 ? [x0, y0] : [x1, y1];
    text(ctx, 'axis', lx + 5, ly - 6, { color: col.s[1], size: 11, weight: 600 });
    // the body (wireframe), then mass dots sorted back to front
    wire(ctx, P, S.wire().map((poly) => poly.map(spin)), col.muted, 1.3);
    const pts = PTS[shape], rmax = Math.max(...pts.map((p) => r2(p, A.o, A.u))) || 1;
    pts.map((p) => ({ q: P(spin(p)), f: r2(p, A.o, A.u) / rmax })).sort((a, b) => a.q[2] - b.q[2]).forEach(({ q, f }) => {
      ctx.globalAlpha = 0.3 + 0.7 * f;
      ctx.beginPath(); ctx.arc(q[0], q[1], 1.4 + 2.6 * f, 0, Math.PI * 2); ctx.fillStyle = col.s[0]; ctx.fill();
    });
    ctx.globalAlpha = 1;
    title(ctx, `${S.name}: ${A.f}`, col);
    // small bar chart of I for every axis of this body
    const bars = S.axes.map((a) => Imeasured(a)), bmax = Math.max(...bars) || 1, bx = 10, bw = Math.min(150, w * 0.32);
    S.axes.forEach((a, i) => {
      const y = h - 14 - (S.axes.length - 1 - i) * 15;
      ctx.fillStyle = i === ax ? col.s[0] : col.line; ctx.fillRect(bx, y - 5, (bw * bars[i]) / bmax, 9);
      text(ctx, a.name, bx + bw + 6, y, { color: i === ax ? col.ink : col.muted, size: 10, weight: i === ax ? 700 : 400, fit: false });
    });
    text(ctx, 'Drag to turn', w - 8, h - 10, { color: col.muted, size: 10, align: 'right' });
  };
  reset();
}
