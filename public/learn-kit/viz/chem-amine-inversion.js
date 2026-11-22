// The nitrogen of an amine is not fixed: it flips through a flat state like an umbrella in the wind, thousands of millions
// of times a second (about 10¹⁰ s⁻¹ for NH₃ and simple amines), over a small energy barrier (24 kJ/mol for NH₃). That is why a
// simple amine with three different groups cannot be resolved into optical isomers, while a quaternary ammonium salt can.
// Drag the slider through the flat state or press Play; switch the nitrogen type to see which can flip.
import { canvas, axes, line, dot, text, row, slider, choice, button, readout, loop, title } from '../kit.js';
import { orbit } from './_3d.js';

const KIND = {
  nh3: ['NH₃ / simple amine', 24, 'The barrier (24 kJ/mol) is tiny compared with the energy of collisions at room temperature, so the two pyramids interconvert faster than they can be separated: no optical isomers.'],
  quat: ['Quaternary ammonium R₁R₂R₃R₄N⁺', 999, 'N holds four groups in a tetrahedron with no lone pair to flip through a plane. It cannot invert, so such a salt with four different groups is chiral and can be resolved.'],
  aziridine: ['N-chloro aziridine (ring strained)', 80, 'Ring strain makes the flat state very costly (about 80 kJ/mol), so inversion is slow and the isomers can even be separated at low temperature.'],
};
export default function (host) {
  let k = 'nh3', u = 0, going = true;
  const cv = canvas(host, { aspect: 0.95, max: 460, min: 330, label: 'A nitrogen atom with three groups inverting through a flat state with an energy curve' });
  const cam = orbit(cv, { yaw: 0.9, pitch: 0.25 });
  choice(row(host), 'Nitrogen', Object.entries(KIND).map(([id, v]) => [id, v[0].split(' ')[0] + (id === 'nh3' ? '' : '')]), k, (v) => { k = v; u = 0; set(); });
  const c = row(host);
  const sl = slider(c, { label: 'Position along the flip', min: 0, max: 1, step: 0.01, value: 0, fmt: (v) => (v < 0.02 ? 'pyramid A' : Math.abs(v - 0.5) < 0.03 ? 'flat' : v > 0.98 ? 'pyramid B' : Math.round(v * 100) + '%'), oninput: (v) => { u = v; going = false; pb.textContent = '▶ Play'; set(); } });
  const pb = button(c, '❚❚ Pause', () => { going = !going; pb.textContent = going ? '❚❚ Pause' : '▶ Play'; });
  let t = 0;
  loop(host, (dt) => { if (going && k !== 'quat') { t += dt * 0.4; u = 0.5 - 0.5 * Math.cos(t * Math.PI * 2 * 0.5); sl.set(u); } cv.redraw(); show(); });
  const out = readout(host);
  const E = (x, bar) => bar * Math.sin(Math.PI * x) ** 2;
  function show() {
    const bar = KIND[k][1], rate = bar > 500 ? 0 : 6e12 * Math.exp(-bar * 1000 / (8.314 * 298)); // pre-factor ~ kT/h
    out.innerHTML = `<b>${KIND[k][0]}</b>. ${bar > 500 ? 'No flat state is reachable.' : `Barrier ${bar} kJ/mol: inversion rate ≈ kT/h · e<sup>−Ea/RT</sup> ≈ <b>${rate.toExponential(1)} s⁻¹</b> at 298 K.`} ${KIND[k][2]}`;
  }
  function set() { show(); cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Amine nitrogen inversion', col);
    const quat = k === 'quat', mh = h * 0.58, P = cam.proj(w, mh, Math.min(w, mh) * 0.3, w / 2, mh * 0.55);
    const lift = quat ? 0 : 0.5 * Math.cos(Math.PI * u), parts = [{ p: [0, 0, 0], r: 13, c: col.s[0], l: 'N' }];
    [0, 1, 2].forEach((j) => { const a = (j * 2 * Math.PI) / 3 + 0.4; parts.push({ p: [0.95 * Math.cos(a), -lift * 0.7, 0.95 * Math.sin(a)], r: 10, c: col.s[2 + j], l: 'RST'[j], b: 1 }); });
    if (quat) parts.push({ p: [0, 0.95, 0], r: 10, c: col.s[5], l: 'U', b: 1 });
    else { const ly = lift * 1.6 + (Math.abs(lift) < 0.05 ? 0 : 0); parts.push({ p: [0, ly * 0.9 + 0.0, 0], r: 0, c: col.s[1], l: '', lone: true, ly }); }
    const c0 = P([0, 0, 0]);
    parts.map((q) => ({ ...q, q: P(q.p) })).sort((a, b) => a.q[2] - b.q[2]).forEach((d) => {
      if (d.lone) { const a = P([0, d.ly * 1.3, 0]); ctx.beginPath(); ctx.ellipse(a[0], a[1] - 4, 9, 14 + Math.abs(d.ly) * 8, 0, 0, 7); ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.5; ctx.fill(); ctx.globalAlpha = 1; text(ctx, '••', a[0], a[1] - 2, { color: col.ink, size: 13, weight: 700, align: 'center', fit: false }); return; }
      if (d.b) { ctx.strokeStyle = col.muted; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(c0[0], c0[1]); ctx.lineTo(d.q[0], d.q[1]); ctx.stroke(); }
      ctx.beginPath(); ctx.arc(d.q[0], d.q[1], d.r + d.q[2] * 1.2, 0, 7); ctx.fillStyle = d.c; ctx.fill(); text(ctx, d.l, d.q[0], d.q[1], { color: col.bg, size: 11, weight: 700, align: 'center', fit: false });
    });
    const bar = KIND[k][1], ym = bar > 500 ? 60 : Math.ceil((bar + 6) / 10) * 10, A = axes(ctx, w, h, col, { x: [0, 1], y: [0, ym], t: mh + 8, l: 44, xlabel: 'inversion coordinate', ylabel: 'E (kJ/mol)', xt: [0, 0.5, 1], fx: (v) => ['A', 'flat', 'B'][v * 2], yt: [0, ym / 2, ym] });
    const pts = []; for (let x = 0; x <= 1.001; x += 0.02) pts.push([A.X(x), A.Y(E(x, bar > 500 ? 60 : bar))]); line(ctx, pts, col.s[0], 2.5);
    dot(ctx, A.X(u), A.Y(E(u, bar > 500 ? 60 : bar)), 6, col.s[1], col.panel);
    text(ctx, bar > 500 ? 'no flat state possible' : `barrier ${bar} kJ/mol`, A.R - 4, A.T + 10, { color: col.muted, size: 10, align: 'right' });
    text(ctx, 'Drag to turn', w - 8, mh - 2, { color: col.muted, size: 10, align: 'right' });
  };
  set();
}
