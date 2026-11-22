// Live problems for Three-dimensional geometry.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const sub = (a, b) => a.map((v, i) => v - b[i]);
const len = (a) => Math.hypot(...a);
const comp = (r, s) => [0, 1, 2].map((i) => pick(() => (r() * (2.3 + s) * (i + 3)) % 1, -4, 5));
const plane = (nv, d) => { const t = [[nv[0], 'x'], [nv[1], 'y'], [nv[2], 'z']].filter(([c]) => c); return t.map(([c, u], i) => `${c < 0 ? (i ? ' − ' : '−') : i ? ' + ' : ''}${Math.abs(c) === 1 ? '' : Math.abs(c)}${u}`).join('') + (d ? ` ${d < 0 ? '−' : '+'} ${Math.abs(d)}` : '') + ' = 0'; };
const nz = (v, s) => { if (!v.some((c) => c)) v[s % 3] = 1; return v; };
const sym = (p, b) => ['x', 'y', 'z'].map((u, i) => `${p[i] ? `(${u} ${p[i] < 0 ? '+' : '−'} ${Math.abs(p[i])})` : u}/${b[i] < 0 ? `(−${-b[i]})` : b[i]}`).join(' = ');

export default {
  'td-plane-dist': {
    title: 'distance from a point to a plane',
    make(r) {
      const nv = nz(comp(r, 1), 1), d = pick(r, -9, 9), P = comp(r, 4);
      const val = dot(nv, P) + d, answer = Math.abs(val) / len(nv);
      return { nv, d, P,
        q: `<p>Find the distance of the point (${P.join(', ')}) from the plane ${plane(nv, d)}. (3 decimal places)</p>`,
        answer, unit: 'units', tol: 0.002, abs: 0.002,
        hint: 'Distance = |ax₁ + by₁ + cz₁ + d| / √(a² + b² + c²).',
        solution: steps(`Put the point into the left side: ${val}.`, `√(a² + b² + c²) = √${dot(nv, nv)}.`, `Distance = |${val}|/√${dot(nv, nv)} = <b>${n(answer, 5)}</b>.`) };
    },
    // find the foot of the perpendicular and measure the gap
    verify: (x) => { const t = -(dot(x.nv, x.P) + x.d) / dot(x.nv, x.nv), F = x.P.map((v, i) => v + t * x.nv[i]); return len(sub(F, x.P)); },
  },
  'td-skew': {
    title: 'shortest distance between two skew lines',
    make(r) {
      const a1 = comp(r, 2); let a2 = comp(r, 5);
      const b1 = [pick(r, 1, 3), pick(r, -2, 3) || 1, pick(r, 1, 4)], b2 = [pick(r, -3, -1), pick(r, 1, 4), pick(r, -2, 2) || 2];
      if (len(cross(b1, b2)) === 0) b2[2] += 3; // never parallel
      const c = cross(b1, b2);
      if (dot(sub(a2, a1), c) === 0) a2 = a2.map((v, i) => v + c[i]); // keep the lines skew, not meeting
      const w = sub(a2, a1), answer = Math.abs(dot(w, c)) / len(c);
      return { a1, a2, b1, b2,
        q: `<p>Find the shortest distance between the lines ${sym(a1, b1)} and ${sym(a2, b2)}. (3 decimal places)</p>`,
        answer, unit: 'units', tol: 0.002, abs: 0.002,
        hint: 'SD = |(a₂ − a₁) · (b₁ × b₂)| / |b₁ × b₂|, where aᵢ is a point on line i and bᵢ its direction.',
        solution: steps(`a₂ − a₁ = (${w.join(', ')}).`, `b₁ × b₂ = (${c.join(', ')}), length √${dot(c, c)}.`, `(a₂ − a₁) · (b₁ × b₂) = ${dot(w, c)}.`, `SD = ${Math.abs(dot(w, c))}/√${dot(c, c)} = <b>${n(answer, 5)}</b>${answer === 0 ? ' (the lines meet)' : ''}.`) };
    },
    // solve for the two closest points (a 2 × 2 system) and measure between them
    verify: (x) => { const w = sub(x.a1, x.a2), A = dot(x.b1, x.b1), B = dot(x.b1, x.b2), C = dot(x.b2, x.b2), D = dot(x.b1, w), E = dot(x.b2, w), den = A * C - B * B, s = (B * E - C * D) / den, t = (A * E - B * D) / den; const P = x.a1.map((v, i) => v + s * x.b1[i]), Q = x.a2.map((v, i) => v + t * x.b2[i]); return len(sub(P, Q)); },
  },
  'td-planes-angle': {
    title: 'the angle between two planes',
    make(r) {
      const n1 = nz(comp(r, 3), 0), n2 = nz(comp(r, 6), 2), d1 = pick(r, -5, 5), d2 = pick(r, -5, 5);
      if (len(cross(n1, n2)) === 0) n2[(n2.findIndex((v) => v) + 1) % 3] += 2; // not parallel
      let c = Math.abs(dot(n1, n2)) / (len(n1) * len(n2)); c = Math.min(1, c);
      const answer = (Math.acos(c) * 180) / Math.PI;
      return { n1, n2,
        q: `<p>Find the acute angle between the planes ${plane(n1, d1)} and ${plane(n2, d2)}, in degrees (2 decimal places).</p>`,
        answer, unit: '°', tol: 0.001, abs: 0.02,
        hint: 'The angle between planes is the angle between their normals: cos θ = |n₁ · n₂|/(|n₁||n₂|).',
        solution: steps(`n₁ = (${n1.join(', ')}), n₂ = (${n2.join(', ')}).`, `n₁ · n₂ = ${dot(n1, n2)}; |n₁||n₂| = √${dot(n1, n1) * dot(n2, n2)}.`, `cos θ = ${n(c, 4)}, θ = <b>${n(answer, 5)}°</b>.`) };
    },
    verify: (x) => (Math.atan2(len(cross(x.n1, x.n2)), Math.abs(dot(x.n1, x.n2))) * 180) / Math.PI,
  },
};
