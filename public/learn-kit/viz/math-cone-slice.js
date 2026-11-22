// Why they are called conic sections: slice a double cone with a plane. Tilt the plane with the slider (drag the
// picture to turn the view). A flat cut gives a circle, tilting gives an ellipse, a cut parallel to the side gives a
// parabola, steeper still cuts both halves and gives a hyperbola. The eccentricity e = sin(tilt) ÷ cos(cone half-angle) ties it
// together.
import { canvas, row, slider, readout, line, text } from '../kit.js';
import { orbit } from './_3d.js';
import { f2 } from './_math.js';

export default function (host) {
  let tilt = 20, off = 0.35; const half = 40; // cone half-angle in degrees
  const cv = canvas(host, { aspect: 0.9, max: 400, min: 290, label: 'A double cone cut by a tilted plane' });
  const cam = orbit(cv, { yaw: 0.6, pitch: 0.22 });
  const c = row(host);
  slider(c, { label: 'plane tilt (°)', min: 0, max: 85, step: 1, value: tilt, fmt: (v) => v + '°', oninput: (v) => { tilt = v; re(); } });
  slider(c, { label: 'plane height', min: -0.1, max: 0.9, step: 0.02, value: off, fmt: (v) => f2(v), oninput: (v) => { off = v; re(); } });
  const out = readout(host);
  // cone: x² + z² = (y tan α)²; plane: y = off·2 + tan(tilt)·x   (tilt measured from horizontal)
  const ta = Math.tan((half * Math.PI) / 180), tt = Math.tan((tilt * Math.PI) / 180), h0 = off * 2;
  const kind = () => { const g = Math.abs(tilt - (90 - half)); if (tilt < 0.5) return 'circle'; if (g < 1.2) return 'parabola'; return tilt < 90 - half ? 'ellipse' : 'hyperbola'; };
  const re = () => { cv.redraw(); const k = kind(); out.innerHTML = `Plane tilted ${tilt}° from flat, cone half-angle ${half}° (the cone's side is ${90 - half}° from flat). The cut is a <b>${k}</b>${k === 'parabola' ? ' (plane parallel to the cone\'s side, e = 1)' : k === 'circle' ? ' (plane perpendicular to the axis, e = 0)' : k === 'ellipse' ? ' (plane steeper than flat but shallower than the side: 0 < e < 1)' : ' (plane steeper than the side, cuts both nappes: e > 1)'}. Eccentricity e = sin(tilt) ÷ cos(half-angle) = sin ${tilt}° ÷ cos ${half}° = <b>${f2(Math.sin((tilt * Math.PI) / 180) / Math.cos((half * Math.PI) / 180))}</b>.`; };
  cv.draw = (ctx, w, h, col) => {
    const sc = Math.min(w, h) * 0.17, P = cam.proj(w, h, sc, w / 2, h / 2 + 6), Hc = 2.1;
    // cone rings and generators
    ctx.save(); ctx.lineWidth = 1; ctx.strokeStyle = col.muted;
    const ring = (y, a) => { const r = Math.abs(y) * ta; ctx.beginPath(); for (let i = 0; i <= 48; i++) { const t = (i / 48) * 2 * Math.PI, p = P([r * Math.cos(t), y, r * Math.sin(t)]); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.globalAlpha = a; ctx.stroke(); };
    for (const y of [-Hc, -1.4, -0.7, 0.7, 1.4, Hc]) ring(y, 0.55);
    for (let k = 0; k < 12; k++) { const t = (k / 12) * 2 * Math.PI, a = P([Hc * ta * Math.cos(t), Hc, Hc * ta * Math.sin(t)]), b = P([-Hc * ta * Math.cos(t), -Hc, -Hc * ta * Math.sin(t)]); ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); }
    ctx.restore();
    // the plane (a rectangle) and the section curve: points where plane meets cone
    const L = 2.2, pl = (x, z) => [x, h0 + tt * x, z]; const quad = [[-L, -L], [L, -L], [L, L], [-L, L]].map(([x, z]) => P(pl(x, z)));
    ctx.beginPath(); quad.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.globalAlpha = 0.14; ctx.fillStyle = col.s[1]; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[1]; ctx.lineWidth = 1.2; ctx.stroke();
    // section: solve on grid of x: z² = (h0 + tt x)² ta² − x² ; valid where >= 0
    const up = [], dn = [], up2 = [], dn2 = [];
    for (let i = 0; i <= 700; i++) { const x = -L * 2 + (4 * L * i) / 700, y = h0 + tt * x, z2 = y * y * ta * ta - x * x; if (z2 < 0 || Math.abs(y) > Hc + 0.5) continue; const z = Math.sqrt(z2), bucket = y >= 0 ? [up, dn] : [up2, dn2]; bucket[0].push(P([x, y, z])); bucket[1].push(P([x, y, -z])); }
    const draw = (pts, close) => { if (pts.length < 2) return; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.stroke(); };
    const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
    [[up, dn], [up2, dn2]].forEach(([a, b]) => { if (a.length < 2 || b.length < 2) return; const ends = dist(a[a.length - 1], b[b.length - 1]) < dist(a[0], b[0]); const path = ends ? a.concat(b.slice().reverse()) : a.slice().reverse().concat(b); if (kind() === 'ellipse' || kind() === 'circle') path.push(path[0]); draw(path); });
    text(ctx, kind().toUpperCase(), 10, h - 12, { color: col.s[0], size: 13, weight: 700 });
    text(ctx, 'Drag to turn', w - 8, h - 12, { color: col.muted, size: 10, align: 'right' });
  };
  re();
}
