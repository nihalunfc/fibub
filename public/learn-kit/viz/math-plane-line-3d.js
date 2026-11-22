// A line and a plane in 3D, with the real numbers. The plane is n·r = d (n is its normal arrow) and the line is
// r = p + t·v. Slide the tilt of the line and the plane's offset: the angle between them is 90° minus the angle
// between v and n, the distance from a point to the plane is |n·P − d|/|n|, and the line is parallel when v·n = 0.
// Drag the picture to turn it.
import { canvas, row, slider, readout, text, line, dot } from '../kit.js';
import { orbit } from './_3d.js';
import { f2 } from './_math.js';

export default function (host) {
  let ang = 35, off = 1, az = 20;
  const cv = canvas(host, { aspect: 0.9, max: 400, min: 290, label: 'A line crossing a plane in 3D with its normal vector' });
  const cam = orbit(cv, { yaw: 0.7, pitch: 0.4 });
  const c = row(host), c2 = row(host);
  slider(c, { label: 'line tilt (°)', min: 0, max: 90, step: 1, value: ang, fmt: (v) => v + '°', oninput: (v) => { ang = v; re(); } });
  slider(c, { label: 'line turn (°)', min: 0, max: 360, step: 5, value: az, fmt: (v) => v + '°', oninput: (v) => { az = v; re(); } });
  slider(c2, { label: 'plane offset d', min: -1.5, max: 2, step: 0.1, value: off, fmt: (v) => f2(v, 1), oninput: (v) => { off = v; re(); } });
  const out = readout(host);
  // plane: z = off (horizontal), normal n = (0, 0, 1) so the maths is easy to read; line through P0 = (0, 0, -0.8)
  const P0 = [0, 0, -0.8], d = () => { const t = (ang * Math.PI) / 180, a = (az * Math.PI) / 180; return [Math.cos(t) * Math.cos(a), Math.cos(t) * Math.sin(a), Math.sin(t)]; };
  function re() { cv.redraw(); const v = d(), vn = v[2], phi = Math.asin(Math.min(1, Math.abs(vn))) * 180 / Math.PI;
    out.innerHTML = `Plane z = ${f2(off, 1)} (normal n = (0, 0, 1)). Line direction v = (${f2(v[0])}, ${f2(v[1])}, ${f2(v[2])}). sin(angle between line and plane) = |v·n|/(|v||n|) = <b>${f2(Math.abs(vn))}</b>, so the angle is <b>${f2(phi, 1)}°</b>. ${Math.abs(vn) < 0.01 ? 'v·n = 0: the line is <b>parallel</b> to the plane, and the distance stays ' + f2(Math.abs(P0[2] - off)) + '.' : `It meets the plane at t = (d − n·P)/(n·v) = (${f2(off)} − (${f2(P0[2])}))/${f2(vn)} = <b>${f2((off - P0[2]) / vn)}</b>.`} Distance from the start point P to the plane = |n·P − d|/|n| = ${f2(Math.abs(P0[2] - off))}.`; }
  cv.draw = (ctx, w, h, col) => {
    const sc = Math.min(w, h) * 0.16, Pj = cam.proj(w, h, sc, w / 2, h / 2 + 8), v = d(), L = 2.2;
    // plane quad with grid; axes are x right, y up in the picture so map model (x, y, z) -> view (x, z, y)
    const M = (p) => Pj([p[0], p[2], p[1]]);
    const quad = [[-L, -L], [L, -L], [L, L], [-L, L]].map(([x, y]) => M([x, y, off]));
    ctx.beginPath(); quad.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.globalAlpha = 0.18; ctx.fillStyle = col.s[0]; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 1.5; ctx.stroke();
    for (let i = -2; i <= 2; i++) { line(ctx, [M([i, -L, off]), M([i, L, off])].map((p) => [p[0], p[1]]), col.line, 1); line(ctx, [M([-L, i, off]), M([L, i, off])].map((p) => [p[0], p[1]]), col.line, 1); }
    // the line (a few units each way), and the normal arrow from the plane centre
    const E = (t) => M([P0[0] + v[0] * t, P0[1] + v[1] * t, P0[2] + v[2] * t]);
    line(ctx, [E(-1.6), E(2.4)].map((p) => [p[0], p[1]]), col.s[1], 3);
    dot(ctx, ...E(0).slice(0, 2), 5, col.ink); text(ctx, 'P', E(0)[0] + 8, E(0)[1] + 8, { color: col.ink, size: 12, weight: 700 });
    const n0 = M([0, 0, off]), n1 = M([0, 0, off + 1.1]); line(ctx, [[n0[0], n0[1]], [n1[0], n1[1]]], col.s[2], 2.5); text(ctx, 'n', n1[0] + 8, n1[1], { color: col.s[2], size: 13, weight: 700 });
    if (Math.abs(v[2]) > 0.01) { const t = (off - P0[2]) / v[2], X = E(t); dot(ctx, X[0], X[1], 6, col.s[3], col.ink); text(ctx, 'meets plane', X[0] + 10, X[1] + 4, { color: col.s[3], size: 11, weight: 700 }); }
    text(ctx, 'blue: plane · orange: line · green: normal n', 10, 14, { color: col.muted, size: 10.5 }); text(ctx, 'Drag to turn', w - 8, h - 12, { color: col.muted, size: 10, align: 'right' });
  };
  re();
}
