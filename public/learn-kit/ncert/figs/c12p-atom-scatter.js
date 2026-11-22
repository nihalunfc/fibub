// Class 12 Atoms: alpha particles fired at a gold-like nucleus. Coulomb repulsion between the alpha (charge 2e) and the nucleus (charge Ze) makes each alpha
// follow a hyperbola. With kinetic energy E, in units of a = 1.44 Z / E (fm, E in MeV) the path obeys r'' = r_hat / r^2 and the impact parameter b gives the
// deflection by b = a cot(theta/2). Aim near the nucleus (small b) and the alpha bounces back; aim far and it hardly bends. In Thomson's plum-pudding atom the
// positive charge is spread over 1e-10 m, so the field is weak everywhere and the deflection is tiny: Geiger and Marsden saw large angles, so that model fails.
import { canvas, text, title, row, slider, choice, readout, line, dot } from '../../kit.js';

const ATOMS = { Au: [79, 197], Cu: [29, 64], Al: [13, 27] };
export default function (host) {
  let el = 'Au', E = 5, b0 = 20, model = 'nuc';
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'Alpha particles scattered by a nucleus, with an adjustable impact parameter' });
  const ctl = row(host);
  choice(ctl, 'Atom', [['nuc', 'Nuclear model'], ['plum', 'Plum pudding']], model, (v) => { model = v; cv.redraw(); });
  choice(ctl, 'Target', Object.keys(ATOMS).map((k) => [k, k]), el, (v) => { el = v; cv.redraw(); });
  slider(ctl, { label: 'Alpha energy', min: 3, max: 9, step: 0.5, value: E, fmt: (v) => `${v.toFixed(1)} MeV`, oninput: (v) => { E = v; cv.redraw(); } });
  slider(ctl, { label: 'Impact parameter b', min: 2, max: 65, step: 1, value: b0, fmt: (v) => `${v} fm`, oninput: (v) => { b0 = v; cv.redraw(); } });
  const out = readout(host);
  const path = (bt) => { // dimensionless integration in units of a, speed 1
    let x = -40, y = bt, vx = 1, vy = 0; const pts = [[x, y]]; let rmin = 1e9;
    for (let i = 0; i < 4000; i++) { const r = Math.hypot(x, y), dt = Math.min(0.05, 0.02 * r); const k = 1 / (r * r * r); vx += x * k * dt; vy += y * k * dt; x += vx * dt; y += vy * dt; rmin = Math.min(rmin, r); if (i % 4 === 0) pts.push([x, y]); if (Math.hypot(x, y) > 60 && x > 0) break; }
    return { pts, rmin, th: Math.atan2(vy, vx) };
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, model === 'nuc' ? 'Alpha particles meet a nucleus' : 'Thomson’s plum-pudding atom', col) + 6, [Z, A] = ATOMS[el], a = (1.44 * Z) / E, Rn = 1.2 * Math.cbrt(A);
    const cx = w * 0.5, cy = top + (h - top) / 2, sc = (w * 0.9) / 190; // pixels per fm
    ctx.save(); ctx.beginPath(); ctx.rect(0, top - 4, w, h - top + 4); ctx.clip();
    const bs = [3, 9, 22, 40, 62, -28, -50], all = [...bs, b0];
    all.forEach((b, i) => {
      const hi = i === all.length - 1, c = hi ? col.s[3] : col.s[0];
      if (model === 'nuc') { const { pts } = path(b / a); line(ctx, pts.map(([x, y]) => [cx + x * a * sc, cy - y * a * sc]), c, hi ? 3 : 1.4); }
      else { const tiny = 0.00005 * (b > 0 ? 1 : -1); line(ctx, [[0, cy - b * sc], [w, cy - b * sc - tiny * w * 40]], c, hi ? 3 : 1.4); }
    });
    if (model === 'nuc') { dot(ctx, cx, cy, Math.max(3, Rn * sc), col.s[2], col.ink); text(ctx, 'nucleus', cx + 10, cy + 14, { color: col.muted, size: 10.5 }); }
    else { ctx.fillStyle = 'rgba(200,80,80,0.12)'; ctx.beginPath(); ctx.arc(cx, cy, w * 0.42, 0, 7); ctx.fill(); ctx.strokeStyle = col.s[3]; ctx.setLineDash([4, 3]); ctx.stroke(); text(ctx, 'positive charge spread out (×10⁵ bigger than a nucleus)', cx, cy + w * 0.42 - 8, { color: col.muted, size: 10, align: 'center' }); }
    ctx.restore();
    const hit = path(b0 / a), th = Math.abs(hit.th) * 180 / Math.PI;
    out.innerHTML = model === 'nuc' ? `${el} nucleus: Z = ${Z}, radius ≈ ${Rn.toFixed(1)} fm. For b = ${b0} fm the alpha is turned through <b>θ = ${th.toFixed(1)}°</b> (b = a cot θ/2 with a = 1.44Z/E = ${a.toFixed(1)} fm), and it gets no closer than <b>${(a * (1 + Math.sqrt(1 + (b0 / a) ** 2))).toFixed(1)} fm</b>. A head-on alpha stops at r₀ = 2a = ${(2 * a).toFixed(0)} fm and turns back.` : 'With the charge spread through the whole atom, an alpha feels only a weak push and bends by less than 0.01° even in the best case. Geiger and Marsden found about 1 alpha in 8000 turned back through more than 90°. Plum pudding cannot do that; a tiny nucleus can.';
  };
  cv.redraw();
}
