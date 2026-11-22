// 1.3 Where the Jacobian comes from. A small cell in polar, cylindrical or spherical coordinates, drawn enlarged:
// its edges are dr, r dθ and (in 3D) dz or r sin θ dφ, so its area or volume is the product. Move r and θ to see
// the cell grow with r and shrink towards the poles (sin θ).
import { canvas, line, text, row, slider, choice, readout, fmt, title } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 430, min: 260, label: 'An enlarged area or volume element in polar, cylindrical or spherical coordinates with its edge lengths' });
  let sys = 'sph', r = 1.6, th = 55;
  const d = 0.32; // size of the drawn steps (radians and units), large so the cell is visible
  const ctl = row(host);
  choice(ctl, 'Coordinates', [['pol', 'Polar'], ['cyl', 'Cylindrical'], ['sph', 'Spherical']], sys, (v) => { sys = v; cv.redraw(); show(); });
  slider(ctl, { label: 'r (or s)', min: 0.5, max: 2.2, step: 0.05, value: r, fmt: (v) => fmt(v, 3), oninput: (v) => { r = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'θ', min: 5, max: 170, step: 1, value: th, fmt: (v) => v + '°', oninput: (v) => { th = v; cv.redraw(); show(); } });
  const out = readout(host);
  const show = () => {
    const t = (th * Math.PI) / 180;
    out.innerHTML = sys === 'pol'
      ? `Polar: edges dr and r dθ, so dA = r dr dθ. At r = ${fmt(r, 3)} the arc edge is ${fmt(r, 3)} times dθ: cells far from the centre are bigger. θ only says where the cell is.`
      : sys === 'cyl'
        ? `Cylindrical: edges ds, s dφ and dz, so dV = s ds dφ dz. At s = ${fmt(r, 3)} the cell is ${fmt(r, 3)} times bigger than ds dφ dz.`
        : `Spherical: edges dr, r dθ and r sin θ dφ, so dV = r² sin θ dr dθ dφ. Here r² sin θ = ${fmt(r * r * Math.sin(t), 4)}. Near the poles sin θ → 0 and the cells pinch to slivers; at the equator (θ = 90°) they are largest.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const S = Math.min(w, h) / 5.6, cx = w * 0.45, cy = h * 0.6;
    // oblique view: x to the lower left, y to the right, z up
    const Pj = (x, y, z) => [cx + S * (y - 0.45 * x), cy - S * (z - 0.3 * x)];
    const t = (th * Math.PI) / 180, ph0 = 0.35;
    if (sys === 'pol') {
      title(ctx, 'Polar area element: dA = r dr dθ', col);
      const P2 = (x, y) => [cx + S * x * 0.95, cy + S * 0.4 - S * y * 0.95];
      line(ctx, [P2(-0.4, 0), P2(2.8, 0)], col.line, 1); line(ctx, [P2(0, -0.4), P2(0, 2.8)], col.line, 1);
      const arc = (rad, a0, a1) => { const p = []; for (let k = 0; k <= 30; k++) { const a = a0 + ((a1 - a0) * k) / 30; p.push(P2(rad * Math.cos(a), rad * Math.sin(a))); } return p; };
      const a0 = Math.min(t, 1.2), a1 = a0 + d;
      line(ctx, arc(r, 0, Math.PI / 2), col.muted, 1, [3, 3]);
      const cell = [...arc(r, a0, a1), ...arc(r + d, a1, a0)];
      ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = col.s[0]; ctx.beginPath(); cell.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill(); ctx.restore();
      line(ctx, [...cell, cell[0]], col.s[0], 2);
      line(ctx, [P2(0, 0), P2(r * Math.cos(a0), r * Math.sin(a0))], col.muted, 1.2, [4, 3]);
      line(ctx, [P2(0, 0), P2(r * Math.cos(a1), r * Math.sin(a1))], col.muted, 1.2, [4, 3]);
      const mid = (a0 + a1) / 2;
      text(ctx, 'r dθ', ...P2((r - 0.12) * Math.cos(mid), (r - 0.12) * Math.sin(mid)), { color: col.s[2], size: 13, weight: 700, align: 'right', halo: col.panel });
      text(ctx, 'dr', ...P2((r + d / 2) * Math.cos(a1) - 0.05, (r + d / 2) * Math.sin(a1) + 0.12), { color: col.s[4], size: 13, weight: 700, halo: col.panel });
      text(ctx, 'dθ', ...P2(0.35 * Math.cos(mid), 0.35 * Math.sin(mid)), { color: col.muted, size: 11, halo: col.panel });
      return;
    }
    // axes
    line(ctx, [Pj(0, 0, 0), Pj(2.6, 0, 0)], col.line, 1); line(ctx, [Pj(0, 0, 0), Pj(0, 2.8, 0)], col.line, 1); line(ctx, [Pj(0, 0, 0), Pj(0, 0, 2.6)], col.line, 1);
    text(ctx, 'x', ...Pj(2.75, 0, 0), { color: col.muted, size: 11 }); text(ctx, 'y', ...Pj(0, 2.95, 0), { color: col.muted, size: 11 }); text(ctx, 'z', ...Pj(0, 0, 2.75), { color: col.muted, size: 11 });
    const edge = (f, a, b, c, wdt = 2) => { const p = []; for (let k = 0; k <= 16; k++) p.push(Pj(...f(a + ((b - a) * k) / 16))); line(ctx, p, c, wdt); };
    if (sys === 'cyl') {
      title(ctx, 'Cylindrical volume element: dV = s ds dφ dz', col);
      const z0 = 0.9, s0 = r, s1 = r + d, p0 = ph0, p1 = ph0 + d, z1 = z0 + d;
      const C = (s, p, z) => [s * Math.cos(p), s * Math.sin(p), z];
      edge((p) => C(s0, p, 0), 0, Math.PI / 2, col.muted, 1);
      for (const z of [z0, z1]) { edge((p) => C(s0, p, z), p0, p1, col.s[2]); edge((p) => C(s1, p, z), p0, p1, col.s[2]); edge((s) => C(s, p0, z), s0, s1, col.s[4]); edge((s) => C(s, p1, z), s0, s1, col.s[4]); }
      for (const [s, p] of [[s0, p0], [s0, p1], [s1, p0], [s1, p1]]) edge((z) => C(s, p, z), z0, z1, col.s[5]);
      line(ctx, [Pj(...C(s0, p0, 0)), Pj(...C(s0, p0, z0))], col.muted, 1, [3, 3]);
      text(ctx, 's dφ', ...Pj(...C(s1 + 0.15, (p0 + p1) / 2, z1 + 0.1)), { color: col.s[2], size: 13, weight: 700, halo: col.panel });
      text(ctx, 'ds', ...Pj(...C((s0 + s1) / 2, p0 - 0.12, z0 - 0.12)), { color: col.s[4], size: 13, weight: 700, halo: col.panel });
      text(ctx, 'dz', ...Pj(...C(s1 + 0.12, p1 + 0.05, (z0 + z1) / 2)), { color: col.s[5], size: 13, weight: 700, halo: col.panel });
      return;
    }
    title(ctx, 'Spherical volume element: dV = r² sin θ dr dθ dφ', col);
    const Sp = (rr, tt, pp) => [rr * Math.sin(tt) * Math.cos(pp), rr * Math.sin(tt) * Math.sin(pp), rr * Math.cos(tt)];
    edge((tt) => Sp(r, tt, ph0), 0, Math.PI, col.muted, 1);
    edge((pp) => Sp(r, t, pp), 0, 2 * Math.PI, col.muted, 1);
    const t0 = Math.max(0.02, Math.min(Math.PI - d - 0.02, t)), t1 = t0 + d, p0 = ph0, p1 = ph0 + d, r0 = r, r1 = r + d;
    for (const rr of [r0, r1]) {
      edge((tt) => Sp(rr, tt, p0), t0, t1, col.s[2]); edge((tt) => Sp(rr, tt, p1), t0, t1, col.s[2]);
      edge((pp) => Sp(rr, t0, pp), p0, p1, col.s[5]); edge((pp) => Sp(rr, t1, pp), p0, p1, col.s[5]);
    }
    for (const [tt, pp] of [[t0, p0], [t0, p1], [t1, p0], [t1, p1]]) edge((rr) => Sp(rr, tt, pp), r0, r1, col.s[4]);
    line(ctx, [Pj(0, 0, 0), Pj(...Sp(r0, t0, p0))], col.muted, 1, [3, 3]);
    text(ctx, 'r dθ', ...Pj(...Sp(r1 + 0.18, (t0 + t1) / 2, p1)), { color: col.s[2], size: 13, weight: 700, halo: col.panel });
    text(ctx, 'r sin θ dφ', ...Pj(...Sp(r1 + 0.1, t0 - 0.12, (p0 + p1) / 2)), { color: col.s[5], size: 13, weight: 700, halo: col.panel });
    text(ctx, 'dr', ...Pj(...Sp((r0 + r1) / 2, t1 + 0.12, p0)), { color: col.s[4], size: 13, weight: 700, halo: col.panel });
  };
  cv.redraw(); show();
}
