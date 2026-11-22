// Live problems for Vectors.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = (a) => Math.hypot(...a);
const vs = (a) => { const t = [[a[0], 'i'], [a[1], 'j'], [a[2], 'k']].filter(([c]) => c !== 0); if (!t.length) return '0'; return t.map(([c, u], i) => `${c < 0 ? (i ? ' − ' : '−') : i ? ' + ' : ''}${Math.abs(c) === 1 ? '' : Math.abs(c)}<b>${u}</b>`).join(''); };
// three components from r, never the zero vector
const vec = (r, s) => { const v = [0, 1, 2].map((i) => pick(() => (r() * (3.7 + s) * (i + 2)) % 1, -4, 5)); if (!v.some((c) => c)) v[s % 3] = 2; return v; };

export default {
  'vec-angle': {
    title: 'the angle between two vectors',
    make(r) {
      const a = vec(r, 1); let b = vec(r, 2); if (len(cross(a, b)) === 0 && dot(a, b) !== 0) b = [b[0] + 1, b[1] - 2, b[2] + 1];
      const c = dot(a, b) / (len(a) * len(b)), answer = (Math.acos(Math.max(-1, Math.min(1, c))) * 180) / Math.PI;
      return { a, b,
        q: `<p>Find the angle between <b>a</b> = ${vs(a)} and <b>b</b> = ${vs(b)}, in degrees (2 decimal places).</p>`,
        answer, unit: '°', tol: 0.001, abs: 0.02,
        hint: 'cos θ = (a · b)/(|a||b|).',
        solution: steps(`a · b = ${dot(a, b)}.`, `|a| = √${dot(a, a)}, |b| = √${dot(b, b)}.`, `cos θ = ${dot(a, b)}/√${dot(a, a) * dot(b, b)} = ${n(c, 4)}, so θ = <b>${n(answer, 5)}°</b>.`) };
    },
    // from the cross product and dot product together (atan2)
    verify: (x) => (Math.atan2(len(cross(x.a, x.b)), dot(x.a, x.b)) * 180) / Math.PI,
  },
  'vec-volume': {
    title: 'volume of a parallelepiped (scalar triple product)',
    make(r) {
      const a = vec(r, 3), b = vec(r, 5), c = vec(r, 7);
      const bc = cross(b, c), stp = dot(a, bc), answer = Math.abs(stp);
      return { a, b, c,
        q: `<p>Find the volume of the parallelepiped with edges <b>a</b> = ${vs(a)}, <b>b</b> = ${vs(b)} and <b>c</b> = ${vs(c)}.</p>`,
        answer, unit: 'cubic units', tol: 0, abs: 0.4,
        hint: 'Volume = |[a b c]| = |a · (b × c)|, the 3 × 3 determinant of the components.',
        solution: steps(`b × c = ${vs(bc)}.`, `a · (b × c) = ${stp}.`, `Volume = |${stp}| = <b>${answer}</b>${answer === 0 ? ' (the vectors are coplanar)' : ''}.`) };
    },
    verify: (x) => Math.abs(dot(cross(x.a, x.b), x.c)),
  },
  'vec-proj': {
    title: 'projection of one vector on another',
    make(r) {
      const a = vec(r, 4), b = vec(r, 6);
      const answer = dot(a, b) / len(a);
      return { a, b,
        q: `<p>Find the scalar projection of <b>b</b> = ${vs(b)} on <b>a</b> = ${vs(a)} (3 decimal places).</p>`,
        answer, unit: '', tol: 0.002, abs: 0.002,
        hint: 'Projection of b on a = (a · b)/|a|: the length of b’s shadow along a (negative if the angle is obtuse).',
        solution: steps(`a · b = ${dot(a, b)}, |a| = √${dot(a, a)}.`, `Projection = ${dot(a, b)}/√${dot(a, a)} = <b>${n(answer, 5)}</b>.`) };
    },
    // |b| cos θ with θ from atan2
    verify: (x) => len(x.b) * Math.cos(Math.atan2(len(cross(x.a, x.b)), dot(x.a, x.b))),
  },
};
