// #958 airfoil: thin airfoil theory against SciPy quad; vortex panel method against an independent Hess-Smith
// (constant source + vortex) panel code in NumPy, 160 panels.
import { parseNaca, nacaPoints, vortexPanel, thinAirfoil, profileDrag, finiteWing, thickness } from '../../src/lib/sci/phairfoil.ts';
export default async (check) => {
  const near = (a, b, r) => Math.abs(a / b - 1) < r, rad = Math.PI / 180;
  check('airfoil: parse NACA codes', JSON.stringify(parseNaca('NACA 2412')) === JSON.stringify({ m: 0.02, p: 0.4, t: 0.12 }) && parseNaca('2012') === null && parseNaca('241') === null);
  check('airfoil: NACA 0012 maximum thickness 12 % near x = 0.3', near(2 * thickness(0.12, 0.3), 0.12, 0.002));
  const t = thinAirfoil(parseNaca('2412'));
  check('airfoil: thin airfoil 2412 zero-lift angle −2.07724° (SciPy quad)', Math.abs(t.aL0 / rad + 2.0772404) < 1e-5);
  check('airfoil: thin airfoil 2412 Cm c/4 −0.0531195 (SciPy quad)', Math.abs(t.cmc4 + 0.05311951) < 1e-6);
  check('airfoil: thin airfoil lift slope 2π per radian', near(t.cl(5 * rad) - t.cl(4 * rad), 2 * Math.PI * rad, 1e-12));
  const hs = { '0012': [0, 0.48441, 0.96646], '2412': [0.25959, 0.74337, 1.22354], '4415': [0.53521, 1.02957, 1.5189] };
  for (const [code, v] of Object.entries(hs)) {
    const { X, Y } = nacaPoints(parseNaca(code), 160);
    [0, 4, 8].forEach((d, k) => { const r = vortexPanel(X, Y, d * rad); check(`airfoil: panel Cl ${code} at ${d}° within 0.6 % of Hess-Smith ${v[k]}`, v[k] === 0 ? Math.abs(r.cl) < 1e-9 : near(r.cl, v[k], 0.006)); });
  }
  { const { X, Y } = nacaPoints(parseNaca('2412'), 160), r = vortexPanel(X, Y, 4 * rad);
    check('airfoil: lift from circulation and from pressure agree within 1 %', near(r.cl, r.clPressure, 0.01));
    check('airfoil: 2412 Cm c/4 negative, near thin theory', r.cm < -0.04 && r.cm > -0.07);
    check('airfoil: stagnation point Cp = 1 near the leading edge', Math.max(...r.cp) > 0.98 && Math.max(...r.cp) <= 1.0000001); }
  const d = profileDrag(0.12, 1e6); check('airfoil: profile drag estimate 2 Cf FF, Re 1e6 turbulent: 0.01127', d.laminar === false && near(d.cf, 0.455 / 6 ** 2.58, 1e-12) && near(d.cd, 2 * d.cf * (1 + 0.24 + 100 * 0.12 ** 4), 1e-12));
  const w = finiteWing(2 * Math.PI, 0, 5 * rad, 8, 1); check('airfoil: elliptic wing AR 8: slope 2π/(1 + 2/8)', near(w.a, (2 * Math.PI) / 1.25, 1e-12) && near(w.CDi, w.CL ** 2 / (8 * Math.PI), 1e-12));
};
