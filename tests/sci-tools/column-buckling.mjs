// #652 column buckling. Checked against an independent Python calculation: section properties by fine grid
// integration with NumPy (agrees to 0.3 %), Euler loads by a finite-difference eigenvalue solution of
// EI w'''' + P w'' = 0 with scipy.linalg.eigh for pinned and clamped ends (agrees to 0.01 %), and the Johnson
// parabola. The example column is made up.
import * as BK from '../../src/lib/sci/eng-buckling.ts';
const rel = (a, b, t) => Number.isFinite(a) && Math.abs(a / b - 1) <= t;
export default async (check) => {
  const I = { kind: 'ibeam', d: 200, bf: 150, tf: 10, tw: 6 };
  const p = BK.sectionProps(I);
  check('buckling: I-section A, Ix, Iy (closed form 4080, 30016000, 5628240)', p.A === 4080 && rel(p.Ix, 30016000, 1e-12) && rel(p.Iy, 5628240, 1e-12) && p.axis === 'y');
  check('buckling: I-section matches grid integration (NumPy) within 0.3 %', rel(p.A, 4081.7406, 3e-3) && rel(p.Ix, 30079251.86, 3e-3) && rel(p.Iy, 5643654.07, 3e-3));
  const t = BK.sectionProps({ kind: 'tube', D: 100, t: 5 });
  check('buckling: tube A and I (closed form; grid 1492.33, 1688196)', rel(t.A, 1492.2565104551518, 1e-12) && rel(t.Ix, 1688115.1774523903, 1e-12) && rel(t.Ix, 1688195.7, 1e-3) && t.axis === 'any');
  const r = BK.sectionProps({ kind: 'rect', b: 100, h: 50 });
  check('buckling: rectangle 100 × 50: Ix = 100·50³/12, buckles about the weak axis', rel(r.Ix, 100 * 50 ** 3 / 12, 1e-12) && rel(r.rmin, 50 / Math.sqrt(12), 1e-12) && r.axis === 'x');
  const c = BK.sectionProps({ kind: 'circle', d: 40 });
  check('buckling: solid circle r = d/4', rel(c.rmin, 10, 1e-12));
  check('buckling: Euler pinned-pinned (FD eigenvalue 694352.6)', rel(BK.eulerLoad(200000, p.Iy, 1, 4000), 694352.623907801, 1e-4));
  check('buckling: Euler fixed-fixed K = 0.5 (FD eigenvalue 2777368)', rel(BK.eulerLoad(200000, p.Iy, 0.5, 4000), 2777368.2682376807, 1e-4));
  check('buckling: transition slenderness √(2π²E/fy) = 125.66 for 200 GPa, 250 MPa', rel(BK.transition(200000, 250), 125.66370614359172, 1e-12));
  const res = BK.column(I, 4000, 1, 200000, 250);
  check('buckling: example λ 107.70, Johnson σ 158.19 MPa, P 645.41 kN (Python)', rel(res.lambda, 107.69704039335467, 1e-10) && res.mode === 'johnson' && rel(res.sigma, 158.1883436783217, 1e-10) && rel(res.Pcr, 645408.4422075525, 1e-10));
  check('buckling: Johnson below Euler (Euler would be 170.18 MPa)', res.sigmaE > res.sigma && rel(res.sigmaE, 694356.2784298396 / 4080, 1e-10));
  check('buckling: K 0.5 gives σ 227.05 MPa (Python)', rel(BK.column(I, 4000, 0.5, 200000, 250).sigma, 227.04708591958044, 1e-10));
  const s = BK.column(I, 8000, 1, 200000, 250);
  check('buckling: long column is Euler', s.mode === 'euler' && rel(s.Pcr, BK.eulerLoad(200000, p.Iy, 1, 8000), 1e-12));
  const Cc = BK.transition(200000, 250), a = BK.criticalStress(Cc - 1e-9, 200000, 250).sigma, b = BK.criticalStress(Cc + 1e-9, 200000, 250).sigma;
  check('buckling: curves meet at σy/2 with the same slope', rel(a, 125, 1e-9) && rel(b, 125, 1e-9));
  check('buckling: stocky column tends to yield', rel(BK.criticalStress(0, 200000, 250).sigma, 250, 1e-12));
  {
    // Recycled-composite cantilevers (Gawryluk et al. 2025, doi:10.35784/acs_7308): E = 493 MPa, fy = 13.5 MPa, K = 2.
    const c1 = BK.column({ kind: 'rect', b: 40, h: 20 }, 150, 2, 493, 13.5);
    check('buckling: 40 × 20 mm cantilever of 150 mm, E 493 MPa: 1441.69 N, λ 51.96, Euler', rel(c1.PE, 1441.69332, 1e-7) && rel(c1.lambda, 51.9615242, 1e-7) && c1.mode === 'euler');
    const c2 = BK.column({ kind: 'rect', b: 40, h: 40 }, 150, 2, 493, 13.5), c3 = BK.column({ kind: 'rect', b: 40, h: 60 }, 150, 2, 493, 13.5);
    check('buckling: the two stocky cases sit just inside the Johnson range at λ 25.98, σ 7.179 MPa', c2.mode === 'johnson' && c3.mode === 'johnson' && rel(c2.lambda, 25.9807621, 1e-7) && rel(c2.sigma, 7.1793076, 1e-7) && rel(c3.sigma, 7.1793076, 1e-7));
    const mult = (b, h) => BK.eulerLoad(493, BK.sectionProps({ kind: 'rect', b, h }).Imin, 2, 150) / c1.PE;
    check('buckling: doubling the area gives ×8, ×2 or ×4 depending on which side grows', rel(mult(40, 40), 8, 1e-12) && rel(mult(80, 20), 2, 1e-12) && rel(mult(40 * Math.SQRT2, 20 * Math.SQRT2), 4, 1e-12));
  }
};
