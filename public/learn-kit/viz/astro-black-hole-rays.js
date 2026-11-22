// Light near a black hole (a 2D slice, distances in units of GM/c²). Rays come in from the left with different impact
// parameters b. Far away they bend a little (4GM/bc²); near 3 GM/c² they loop round (the photon sphere); inside b = 5.2 they
// are captured. The dark disc is the event horizon at 2 GM/c², where the escape speed reaches the speed of light.
import { canvas, text, row, slider, choice, readout, title, dot, line, button } from '../kit.js';

export default function (host) {
  let b = 7, fan = true, r = 6;
  const cv = canvas(host, { aspect: 0.8, max: 400, min: 300, label: 'Light rays bending around a black hole with the photon sphere and event horizon' });
  const c1 = row(host), c2 = row(host);
  slider(c1, { label: 'Impact parameter b', min: 1, max: 14, step: 0.05, value: b, fmt: (v) => `${v.toFixed(1)} GM/c²`, oninput: (v) => { b = v; show(); } });
  choice(c2, 'Show', [[true, 'A fan of rays'], [false, 'One ray']], fan, (v) => { fan = v; show(); });
  slider(c2, { label: 'Escape speed at r', min: 2.05, max: 30, value: r, log: true, fmt: (v) => `${v.toFixed(1)} GM/c²`, oninput: (v) => { r = v; show(); } });
  const out = readout(host);
  // du/dphi: u'' + u = 3 M u^2 with M = 1 (u = 1/r)
  function ray(bb) {
    let u = 0, du = 1 / bb, phi = 0, pts = [], captured = false; const dphi = 0.004;
    const f = (u, du) => [du, -u + 3 * u * u];
    for (let i = 0; i < 3000; i++) {
      pts.push([1 / Math.max(u, 1e-4) * Math.cos(Math.PI - phi), 1 / Math.max(u, 1e-4) * Math.sin(Math.PI - phi)]);
      if (u > 0.5) { captured = true; break; }
      if (u < 0 && i > 5) break;
      const k1 = f(u, du), k2 = f(u + k1[0] * dphi / 2, du + k1[1] * dphi / 2), k3 = f(u + k2[0] * dphi / 2, du + k2[1] * dphi / 2), k4 = f(u + k3[0] * dphi, du + k3[1] * dphi);
      u += dphi / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); du += dphi / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]); phi += dphi;
    }
    return { pts, captured, defl: (phi - Math.PI) * 180 / Math.PI };
  }
  function show() {
    const R = ray(b), vesc = Math.sqrt(2 / r);
    out.innerHTML = `Ray with b = ${b.toFixed(1)}: ${R.captured ? '<b>captured</b> (b is below the critical 5.2 GM/c², about 3√3)' : `bent by about <b>${R.defl.toFixed(0)}°</b> (weak-field estimate 4GM/(bc²) = ${(4 / b * 180 / Math.PI).toFixed(0)}°)`}. At r = ${r.toFixed(1)} GM/c² the escape speed is <b>${(vesc * 100).toFixed(0)}% of the speed of light</b> (v = c√(2GM/rc²)); at r = 2 it reaches 100%, the event horizon. Photon sphere r = 3.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Rays passing a black hole (side view)', col);
    const cx = w / 2, cy = h / 2 + 8, sc = Math.min(w, h) / 2 / 11, X = (x) => cx + x * sc, Y = (y) => cy - y * sc;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip();
    const draw = (bb, c, lw) => { const R = ray(bb); line(ctx, R.pts.filter((q) => Math.hypot(...q) < 60).map((q) => [X(q[0]), Y(q[1])]), c, lw); };
    if (fan) for (let k = -13; k <= 13; k += 1) { const bb = Math.abs(k) * 0.85 + 0.9; if (k === 0) continue; const R = ray(bb); line(ctx, R.pts.filter((q) => Math.hypot(...q) < 60).map((q) => [X(q[0]), (k < 0 ? 2 * cy - Y(q[1]) : Y(q[1]))]), R.captured ? col.bad : col.s[0], 1.2); }
    draw(b, col.s[1], 3);
    ctx.restore();
    ctx.beginPath(); ctx.arc(cx, cy, 2 * sc, 0, 7); ctx.fillStyle = '#000'; ctx.fill();
    ctx.setLineDash([4, 4]); ctx.strokeStyle = col.s[5]; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, 3 * sc, 0, 7); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.arc(cx, cy, r * sc, 0, 7); ctx.stroke();
    text(ctx, 'horizon r=2', cx, cy, { color: '#ccc', size: 10, align: 'center' }); text(ctx, 'photon sphere r=3', cx + 3 * sc * 0.72, cy - 3 * sc * 0.72 - 4, { color: col.s[5], size: 10 });
    text(ctx, `grey ring: escape speed radius r=${r.toFixed(1)}`, 10, h - 10, { color: col.muted, size: 10 });
    text(ctx, 'yellow ray = your b; red rays are captured', w - 10, h - 24, { color: col.muted, size: 10, align: 'right' });
  };
  show();
}
