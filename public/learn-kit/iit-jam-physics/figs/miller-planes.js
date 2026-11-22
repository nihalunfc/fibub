// 7.1 Miller planes in a cubic cell. Set h, k, l (negative values move the origin to the far corner along that axis)
// and see the plane cut the cube, with its intercepts, the next parallel plane of the same family (dashed) and the
// spacing d = a/√(h² + k² + l²).
import { canvas, row, slider, readout, fmt, title, line, text } from '../../kit.js';

const corners = [];
for (const x of [0, 1]) for (const y of [0, 1]) for (const z of [0, 1]) corners.push([x, y, z]);
const edges = [];
for (const a of corners) for (const b of corners) { const d = Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]); if (d === 1 && a < b) edges.push([a, b]); }
const bar = (n) => (n < 0 ? `${-n}̅` : `${n}`);

/** Polygon where the plane n·r = c meets the unit cube, ordered round its centre. */
function cut(n, c) {
  const pts = [];
  for (const [a, b] of edges) {
    const fa = n[0] * a[0] + n[1] * a[1] + n[2] * a[2] - c, fb = n[0] * b[0] + n[1] * b[1] + n[2] * b[2] - c;
    if (fa === 0) pts.push(a);
    if ((fa < 0 && fb > 0) || (fa > 0 && fb < 0)) { const t = fa / (fa - fb); pts.push(a.map((v, i) => v + t * (b[i] - v))); }
  }
  const uniq = pts.filter((p, i) => pts.findIndex((q) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) < 1e-9) === i);
  if (uniq.length < 3) return [];
  const m = [0, 1, 2].map((i) => uniq.reduce((s, p) => s + p[i], 0) / uniq.length);
  const len = Math.hypot(...n), nn = n.map((v) => v / len);
  const u0 = Math.abs(nn[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const u = u0.map((v, i) => v - dot(u0, nn) * nn[i]);
  const w = [nn[1] * u[2] - nn[2] * u[1], nn[2] * u[0] - nn[0] * u[2], nn[0] * u[1] - nn[1] * u[0]];
  return uniq.sort((p, q) => { const dp = p.map((v, i) => v - m[i]), dq = q.map((v, i) => v - m[i]); return Math.atan2(dot(dp, w), dot(dp, u)) - Math.atan2(dot(dq, w), dot(dq, u)); });
}

export default function (host) {
  const cv = canvas(host, { aspect: 0.75, max: 420, min: 280, label: 'A cubic cell cut by the Miller plane (hkl)' });
  let h = 1, k = 1, l = 1, phi = 0.6;
  const ctl = row(host);
  const re = () => { cv.redraw(); show(); };
  slider(ctl, { label: 'h', min: -3, max: 3, step: 1, value: h, fmt: (v) => String(v), oninput: (v) => { h = v; re(); } });
  slider(ctl, { label: 'k', min: -3, max: 3, step: 1, value: k, fmt: (v) => String(v), oninput: (v) => { k = v; re(); } });
  slider(ctl, { label: 'l', min: -3, max: 3, step: 1, value: l, fmt: (v) => String(v), oninput: (v) => { l = v; re(); } });
  slider(ctl, { label: 'Turn the cube', min: 0, max: 6.28, step: 0.01, value: phi, fmt: (v) => `${Math.round(v * 180 / Math.PI)}°`, oninput: (v) => { phi = v; re(); } });
  const out = readout(host);
  const c0 = () => 1 + [h, k, l].filter((v) => v < 0).reduce((s, v) => s + v, 0);
  const show = () => {
    if (!h && !k && !l) { out.textContent = '(000) is not a plane: at least one index must be non-zero.'; return; }
    const ic = [h, k, l].map((v, i) => (v === 0 ? `∞ (parallel to ${'xyz'[i]})` : `${fmt(1 / v, 3)}a`));
    out.innerHTML = `Plane (${bar(h)}${bar(k)}${bar(l)}): intercepts ${ic.join(', ')}${[h, k, l].some((v) => v < 0) ? ' (measured from the shifted origin, the open dot)' : ''}. Spacing of the family: d = a/√(${h * h + k * k + l * l}) = <b>${fmt(1 / Math.hypot(h, k, l), 3)}a</b>. In a cubic crystal the direction [${bar(h)}${bar(k)}${bar(l)}] is normal to this plane.`;
  };
  cv.draw = (ctx, W, H, col) => {
    title(ctx, `Miller plane (${bar(h)}${bar(k)}${bar(l)})`, col);
    const el = 0.38, sc = Math.min(W, H) * 0.45, cx = W / 2, cy = H / 2 + 14;
    const P = ([x, y, z]) => {
      x -= 0.5; y -= 0.5; z -= 0.5;
      const xr = x * Math.cos(phi) - y * Math.sin(phi), yr = x * Math.sin(phi) + y * Math.cos(phi);
      return [cx + sc * xr, cy - sc * (z * Math.cos(el) - yr * Math.sin(el))];
    };
    for (const [a, b] of edges) line(ctx, [P(a), P(b)], col.muted, 1.2);
    const o = [h < 0 ? 1 : 0, k < 0 ? 1 : 0, l < 0 ? 1 : 0];
    // axes from the origin used for the intercepts
    ['x', 'y', 'z'].forEach((nm, i) => {
      const e = o.slice(); e[i] = o[i] ? -0.25 : 1.25;
      line(ctx, [P(o), P(e)], col.line, 1, [3, 3]);
      const p = P(e); text(ctx, nm, p[0] + 4, p[1], { color: col.muted, size: 11 });
    });
    const po = P(o); ctx.beginPath(); ctx.arc(po[0], po[1], 4, 0, 2 * Math.PI); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.stroke();
    if (!h && !k && !l) return;
    const n = [h, k, l], c = c0();
    for (const [cc, main] of [[c, true], [c + 1, false], [c - 1, false]]) {
      const poly = cut(n, cc);
      if (!poly.length) continue;
      const pp = poly.map(P);
      ctx.save(); ctx.beginPath(); pp.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath();
      if (main) { ctx.globalAlpha = 0.35; ctx.fillStyle = col.s[0]; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.stroke(); }
      else { ctx.setLineDash([5, 4]); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 1.2; ctx.stroke(); }
      ctx.restore();
    }
    text(ctx, 'dashed: next planes of the same family', 10, H - 12, { color: col.muted, size: 11 });
  };
  re();
}
