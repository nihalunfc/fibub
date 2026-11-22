// Orbitals in 3D: each dot is a place the electron could be found (denser = more likely), blue where the wave
// function is positive and orange where it is negative. Pick 1s, 2s, 2p, 3p or a 3d orbital, drag to turn it, and
// switch on the nodes (surfaces where the dot density drops to zero). Radial nodes = n - l - 1, angular nodes = l.
import { canvas, text, row, choice, readout, loop, rng, title } from '../kit.js';
import { orbit, shapes, wire } from './_3d.js';

const E = Math.exp;
// unnormalised hydrogen-like wave functions (r in Bohr radii), written in x, y, z
const ORB = {
  '1s': { n: 1, l: 0, R: 5, f: (x, y, z, r) => E(-r), nodes: [] },
  '2s': { n: 2, l: 0, R: 12, f: (x, y, z, r) => (2 - r) * E(-r / 2), nodes: [{ s: 2 }] },
  '2p': { n: 2, l: 1, R: 12, f: (x, y, z, r) => z * E(-r / 2), nodes: [{ p: 'z' }] },
  '3p': { n: 3, l: 1, R: 22, f: (x, y, z, r) => (6 - r) * z * E(-r / 3), nodes: [{ s: 6 }, { p: 'z' }] },
  '3dz²': { n: 3, l: 2, R: 22, f: (x, y, z, r) => (3 * z * z - r * r) * E(-r / 3), nodes: [{ cone: 1 }] },
  '3dxy': { n: 3, l: 2, R: 22, f: (x, y, z, r) => x * y * E(-r / 3), nodes: [{ p: 'x' }, { p: 'y' }] },
  '3dx²−y²': { n: 3, l: 2, R: 22, f: (x, y, z, r) => (x * x - y * y) * E(-r / 3), nodes: [{ d: 1 }] },
};
const cache = {};
function cloud(id) {
  if (cache[id]) return cache[id];
  const o = ORB[id], R1 = rng(11), pts = [];
  let max = 0;
  const val = (x, y, z) => o.f(x, y, z, Math.hypot(x, y, z));
  for (let i = 0; i < 20000; i++) { const x = (R1() * 2 - 1) * o.R, y = (R1() * 2 - 1) * o.R, z = (R1() * 2 - 1) * o.R; max = Math.max(max, val(x, y, z) ** 2); }
  for (let t = 0; pts.length < 1100 && t < 900000; t++) {
    const x = (R1() * 2 - 1) * o.R, y = (R1() * 2 - 1) * o.R, z = (R1() * 2 - 1) * o.R, v = val(x, y, z);
    if (R1() * max < v * v) pts.push({ p: [x / o.R * 1.5, z / o.R * 1.5, y / o.R * 1.5], s: v > 0 ? 0 : 1 });
  }
  return (cache[id] = pts);
}
// note: the figure's up axis is the orbital's z, so model (x, y, z) -> screen (x, z, y)

export default function (host) {
  let id = '2p', nodes = false, spin = true;
  const cv = canvas(host, { aspect: 0.8, max: 420, min: 290, label: 'A 3D dot cloud of an atomic orbital that can be turned by dragging' });
  const cam = orbit(cv, { yaw: 0.6, pitch: 0.35 });
  const c1 = row(host), c2 = row(host);
  choice(c1, 'Orbital', Object.keys(ORB).map((k) => [k, k]), id, (v) => { id = v; show(); cv.redraw(); });
  choice(c2, 'Nodes', [[false, 'Hide'], [true, 'Show']], nodes, (v) => { nodes = v; show(); cv.redraw(); });
  const anim = loop(host, (dt) => { if (spin && !cam.dragging) { cam.yaw += dt * 0.5; cv.redraw(); } });
  anim.button(c2);
  const out = readout(host);
  function show() {
    const o = ORB[id];
    out.innerHTML = `<b>${id}</b>: n = ${o.n}, l = ${o.l}. Radial nodes = n − l − 1 = <b>${o.n - o.l - 1}</b>, angular nodes = l = <b>${o.l}</b>, total = n − 1 = <b>${o.n - 1}</b>. ${nodes ? 'Faint sheets mark the nodes: the electron is never found on them.' : 'Turn on "Nodes" to see where the electron is never found.'}`;
  }
  cv.draw = (ctx, w, h, col) => {
    const o = ORB[id], P = cam.proj(w, h, Math.min(w, h) * 0.3, w / 2, h / 2 + 8);
    cloud(id).map((q) => ({ q: P(q.p), s: q.s })).sort((a, b) => a.q[2] - b.q[2]).forEach(({ q, s }) => {
      ctx.globalAlpha = 0.35 + 0.4 * Math.max(0, Math.min(1, (q[2] + 1.5) / 3));
      ctx.beginPath(); ctx.arc(q[0], q[1], 1.9, 0, 7); ctx.fillStyle = col.s[s]; ctx.fill();
    });
    ctx.globalAlpha = 1;
    if (nodes) {
      const k = 1.5 / o.R, L = 1.05;
      for (const nd of o.nodes) {
        if (nd.s) wire(ctx, P, shapes.sphere(nd.s * k, 6), col.muted, 0.8);
        if (nd.p) {
          const sq = (f) => [[f(-L, -L), f(L, -L), f(L, L), f(-L, L), f(-L, -L)]];
          wire(ctx, P, nd.p === 'z' ? sq((a, b) => [a, 0, b]) : nd.p === 'x' ? sq((a, b) => [0, b, a]) : sq((a, b) => [a, b, 0]), col.muted, 1);
        }
        if (nd.d) wire(ctx, P, [[[-L, -L, -L], [L, -L, L], [L, L, L], [-L, L, -L], [-L, -L, -L]], [[-L, -L, L], [L, -L, -L], [L, L, -L], [-L, L, L], [-L, -L, L]]], col.muted, 1);
        if (nd.cone) {
          const a = Math.acos(1 / Math.sqrt(3)), polys = [];
          for (const sg of [1, -1]) polys.push(Array.from({ length: 41 }, (_, i) => { const t = (i / 40) * 6.283, r = 0.9; return [r * Math.sin(a) * Math.cos(t), sg * r * Math.cos(a), r * Math.sin(a) * Math.sin(t)]; }));
          wire(ctx, P, polys, col.muted, 1);
        }
      }
    }
    title(ctx, `${id} orbital`, col);
    text(ctx, 'Drag to turn', w - 8, h - 10, { color: col.muted, size: 10, align: 'right' });
    text(ctx, 'positive', 12, h - 24, { color: col.s[0], size: 11, weight: 700 });
    text(ctx, 'negative', 12, h - 10, { color: col.s[1], size: 11, weight: 700 });
  };
  show();
}
