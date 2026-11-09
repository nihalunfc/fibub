// #962 band structure toy models. Reference values from an independent plane-wave expansion (NumPy/SciPy eigh,
// 401 plane waves), SciPy's ellipk for the square-lattice DOS, and NumPy eigh of the 2 × 2 Bloch Hamiltonians.
import * as B from '../../src/lib/sci/phbands.ts';
export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  // Kronig-Penney: V0 0.5 eV, well 0.5 nm, barrier 0.2 nm, free mass. Plane waves give band edges
  // 0.13213, 0.78528 | 1.02735, 3.13337 | 3.29711, 7.02478 | 7.07822, 12.40686 eV.
  const kp = B.kpBands({ V0: 0.5, w: 0.5, b: 0.2, mass: 1 }, 4).flat();
  const ref = [0.13213288, 0.7852758, 1.02734845, 3.13336614, 3.29710868, 7.02478106, 7.07822485, 12.40686234];
  check('band: Kronig-Penney edges match a plane-wave expansion', kp.length === 8 && kp.every((x, i) => near(x, ref[i], 1e-5)));
  const kp2 = B.kpBands({ V0: 1, w: 0.4, b: 0.3, mass: 0.067 }, 2).flat();
  check('band: Kronig-Penney with m* = 0.067', [0.42427381, 11.57136557, 12.19112566, 46.17371659].every((x, i) => near(kp2[i], x, 1e-4)));
  check('band: Kronig-Penney with no barrier is free electrons', near(B.kpF(0.3, { V0: 0, w: 0.5, b: 0, mass: 1 }), Math.cos(Math.sqrt(0.3 / B.HB2M) * 0.5), 1e-12));
  { const f = B.kpBands({ V0: 0, w: 0.5, b: 0.2, mass: 1 }, 2); check('band: Kronig-Penney with V0 = 0 gives touching free-electron bands', f.length === 2 && f[0][0] === 0 && near(f[0][1], B.HB2M * (Math.PI / 0.7) ** 2, 1e-12) && f[1][0] === f[0][1]); }
  // Continuity at E = V0.
  { const p = { V0: 0.5, w: 0.5, b: 0.2, mass: 1 }; check('band: Kronig-Penney continuous through E = V0', near(B.kpF(0.5 - 1e-9, p), B.kpF(0.5 + 1e-9, p), 1e-6) && near(B.kpF(0.5, p), B.kpF(0.5 + 1e-9, p), 1e-6)); }
  // KP DOS integrates to the states per length in each band: 1/L per spin.
  { const p = { V0: 0.5, w: 0.5, b: 0.2, mass: 1 }, bands = B.kpBands(p, 3), d = B.kpDos(p, bands, 400); const tot = d.g.reduce((s, x) => s + x * d.de, 0); check('band: Kronig-Penney DOS holds 1/L states per band', near(tot, 3 / 0.7, 1e-6)); }
  // Tight binding against NumPy eigh.
  { const g1 = B.tbBands({ kind: 'graphene', t: 2.7, delta: 0.2 }, 0.3, 0.7), g2 = B.tbBands({ kind: 'graphene', t: 2.7, delta: 0.2 }, 1.1, -0.4); check('band: graphene bands match a 2 × 2 Hamiltonian', near(g1[1], 6.96936507, 1e-7) && near(g2[0], -5.5613338, 1e-7)); }
  { const d1 = B.tbBands({ kind: 'diatomic', t: 1.3, delta: 0.6 }, 0.4), d2 = B.tbBands({ kind: 'diatomic', t: 1.3, delta: 0.6 }, 2); check('band: diatomic chain matches a 2 × 2 Hamiltonian', near(d1[1], 2.56577204, 1e-7) && near(d2[0], -1.43646221, 1e-7)); }
  { const g = B.tbBands({ kind: 'graphene', t: 2.7, delta: 0 }, (2 * Math.PI) / 3, (2 * Math.PI) / (3 * Math.sqrt(3))); check('band: graphene gapless at K', Math.abs(g[1]) < 1e-12); }
  check('band: diatomic gap at the zone edge equals Δ', near(B.tbBands({ kind: 'diatomic', t: 1, delta: 0.8 }, Math.PI)[1] * 2, 0.8, 1e-12));
  // Square-lattice DOS: exact elliptic form vs SciPy, and the sampled histogram agrees.
  check('band: exact square DOS (SciPy ellipk)', [[0.5, 0.17606822504], [1, 0.14191075806], [2, 0.10925035897], [3.5, 0.08497718687]].every(([e, v]) => near(B.squareDosExact(e, 1), v, 1e-10)));
  { const m = { kind: 'square', t: 1, tp: 0 }, s = B.tbSamples(m, 400), d = B.dosFromSamples(s, 400 * 400, 80); const i = d.e.findIndex((e) => e > 2); const ex = B.squareDosExact(d.e[i], 1); check('band: sampled square DOS matches exact', near(d.g[i], ex, 0.01 * ex + 0.002)); const tot = d.g.reduce((a, x) => a + x * d.de, 0); check('band: DOS area is one band', near(tot, 1, 1e-9)); }
  { const s = B.tbSamples({ kind: 'chain', t: 1, tp: 0 }, 20000), d = B.dosFromSamples(s, 20000, 100); const i = d.e.findIndex((e) => e > 0); check('band: sampled chain DOS matches 1/(π√(4t² − E²))', near(d.g[i], B.chainDosExact(d.e[i], 1), 0.003)); }
  // Fermi levels: half filling of a symmetric band sits at 0; quarter filling of the chain at −√2 t.
  check('band: half-filled square lattice E_F = 0', Math.abs(B.fermiLevel(B.tbSamples({ kind: 'square', t: 1, tp: 0 }, 200), 40000, 1)) < 1e-3);
  check('band: quarter-filled chain E_F = −2t cos(π/4)', near(B.fermiLevel(B.tbSamples({ kind: 'chain', t: 1, tp: 0 }, 20000), 20000, 0.5), -Math.SQRT2, 1e-3));
  check('band: graphene half filling E_F = 0', Math.abs(B.fermiLevel(B.tbSamples({ kind: 'graphene', t: 2.7, delta: 0 }, 300), 90000, 2)) < 0.02);
  check('band: graphene v_F (t 2.7 eV, d 0.142 nm) = 8.737e5 m/s', near(B.grapheneVF(2.7, 0.142), 873730.709, 0.01));
  check('band: chain effective mass ħ²/(2ta²)', near(B.tbMass(1, 0.3), 0.4233311, 1e-6));
  { const p = B.tbPath({ kind: 'graphene', t: 1, delta: 0 }, 10); check('band: graphene path Γ K M Γ', p.ticks.map((t) => t.label).join('') === 'ΓKMΓ' && p.pts.length === 31); }
};
