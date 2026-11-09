// #963 Brillouin zone viewer. Reference values from SciPy's Voronoi and ConvexHull (Qhull) applied to the
// reciprocal lattice points, an independent construction of the Wigner-Seitz cell.
import * as Z from '../../src/lib/sci/phbz.ts';
export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const cell3 = (k, p) => { const A = Z.primitive(k, p), r = Z.reciprocal(A); return { ...Z.wsCell3(r.B), B: r.B, vol: r.vol }; };
  // Vertex and face counts and volume against Qhull: sc cube, fcc truncated octahedron, bcc rhombic dodecahedron,
  // hexagonal prism, and a general triclinic cell (a 4, b 5, c 6 Å; 80°, 95°, 105°).
  const ref = { sc: [{ a: 4 }, 8, 6, 12, 3.8757845850374775], fcc: [{ a: 4 }, 24, 14, 36, 15.50313834014991], bcc: [{ a: 4 }, 14, 12, 24, 7.751569170074955], hex: [{ a: 4, c: 6.5 }, 12, 8, 18, 2.754074182759865], tric: [{ a: 4, b: 5, c: 6, alpha: 80, beta: 95, gamma: 105 }, 24, 14, 36, 2.1751596952940164] };
  for (const [k, [p, nv, nf, ne, vol]] of Object.entries(ref)) {
    const C = cell3(k, p);
    check(`bz: ${k} zone has ${nv} vertices, ${nf} faces, ${ne} edges`, C.vertices.length === nv && C.faces.length === nf && C.edges.length === ne);
    check(`bz: ${k} zone volume matches Qhull and (2π)³/V`, near(C.volume, vol, 1e-9) && near(C.volume, (2 * Math.PI) ** 3 / C.vol, 1e-9));
  }
  // 2D against SciPy Voronoi.
  for (const [k, p, n, area, r] of [['oblique', { a: 3, b: 4, gamma: 70 }, 6, 3.5010045422565774, 1.214904], ['hex2', { a: 4 }, 6, 2.849109378882029, 1.047198], ['crect', { a: 5, b: 6 }, 6, 2.6318945069571615, 1.064651], ['square', { a: 2 }, 4, Math.PI ** 2, Math.PI / Math.SQRT2]]) {
    const A = Z.primitive(k, p), { B } = Z.reciprocal(A), C = Z.wsCell2(B[0], B[1]);
    check(`bz: 2D ${k} zone matches SciPy Voronoi`, C.vertices.length === n && near(C.area, area, 1e-9) && C.vertices.every((v) => Math.abs(Math.hypot(v[0], v[1]) - r) < 2e-6));
  }
  // Reciprocal vectors: aᵢ·bⱼ = 2π δᵢⱼ, and the crystallographers' convention without 2π.
  { const A = Z.primitive('tric', { a: 4, b: 5, c: 6, alpha: 80, beta: 95, gamma: 105 }), { B } = Z.reciprocal(A); check('bz: aᵢ·bⱼ = 2π δᵢⱼ', A.every((a, i) => B.every((b, j) => Math.abs(Z.dot(a, b) - (i === j ? 2 * Math.PI : 0)) < 1e-12))); const c = Z.reciprocal(A, 1).B; check('bz: crystallographic reciprocal without 2π', near(Z.norm(c[0]) * 2 * Math.PI, Z.norm(B[0]), 1e-12)); }
  // fcc: |X| = 2π/a, |L| = √3 π/a, |K| = 3√2 π/(2a), |W| = √5 π/a; and every labelled point lies on the zone surface.
  { const A = Z.primitive('fcc', { a: 1 }), { B } = Z.reciprocal(A), hs = Object.fromEntries(Z.highSym('fcc').map(([n, f]) => [n, Z.norm(Z.toCart(B, f))])); check('bz: fcc high-symmetry distances', near(hs.X, 2 * Math.PI, 1e-12) && near(hs.L, Math.sqrt(3) * Math.PI, 1e-12) && near(hs.K, (3 * Math.SQRT2 * Math.PI) / 2, 1e-12) && near(hs.W, Math.sqrt(5) * Math.PI, 1e-12)); }
  for (const [k, p] of [['sc', { a: 3 }], ['fcc', { a: 3 }], ['bcc', { a: 3 }], ['hex', { a: 3, c: 5 }], ['tet', { a: 3, c: 5 }], ['orth', { a: 3, b: 4, c: 5 }], ['square', { a: 3 }], ['rect', { a: 3, b: 4 }], ['hex2', { a: 3 }]]) {
    const A = Z.primitive(k, p), { B } = Z.reciprocal(A), G = Z.relevant(Z.IS2D(k) ? [B[0], B[1]] : B, 3);
    check(`bz: ${k} labelled points sit on the zone surface`, Z.highSym(k).every(([n, f]) => (n === 'Γ' ? Z.zoneRatio(G, Z.toCart(B, f)) === 0 : Math.abs(Z.zoneRatio(G, Z.toCart(B, f)) - 1) < 1e-9)));
  }
  // Hexagonal 2D: |K| = 4π/(3a), |M| = 2π/(√3 a); bcc |H| = 2π/a, |N| = √2 π/a, |P| = √3 π/a.
  { const { B } = Z.reciprocal(Z.primitive('hex2', { a: 1 })), h = Object.fromEntries(Z.highSym('hex2').map(([n, f]) => [n, Z.norm(Z.toCart(B, f))])); check('bz: 2D hexagonal K and M', near(h.K, (4 * Math.PI) / 3, 1e-12) && near(h.M, (2 * Math.PI) / Math.sqrt(3), 1e-12)); }
  { const { B } = Z.reciprocal(Z.primitive('bcc', { a: 1 })), h = Object.fromEntries(Z.highSym('bcc').map(([n, f]) => [n, Z.norm(Z.toCart(B, f))])); check('bz: bcc H, N, P', near(h.H, 2 * Math.PI, 1e-12) && near(h.N, Math.SQRT2 * Math.PI, 1e-12) && near(h.P, Math.sqrt(3) * Math.PI, 1e-12)); }
  { const A = Z.primitive('oblique', { a: 3, b: 4, gamma: 105 }), { B } = Z.reciprocal(A); check('bz: oblique lattice has 6 Voronoi-relevant vectors', Z.relevant([B[0], B[1]], 4).length === 6); }
  check('bz: fcc reciprocal has 14 relevant vectors, sc 6', Z.relevant(Z.reciprocal(Z.primitive('fcc', { a: 4 })).B, 3).length === 14 && Z.relevant(Z.reciprocal(Z.primitive('sc', { a: 4 })).B, 3).length === 6);
  check('bz: impossible triclinic angles are caught', !Z.tricValid(30, 30, 90) && Z.tricValid(80, 95, 105));
};
