// #507 Ocean currents. Checked against independent NumPy versions on 300 random cases (f against gsw.f, stress,
// transport as −iτ/(ρf), Ekman depth, V0 = √2πτ/(DρF), the spiral against the complex solution of the Ekman
// equations, the spiral integrated with scipy.quad equal to the Ekman transport, coastal transport, curl and
// pumping, geostrophic u and v, three Rossby radii) and 100 random two-station sections (thermal wind with
// scipy cumulative_trapezoid from the reference level, dynamic height): 8,100 checks, 0 failed.
import { coriolis, windStress, ekman, spiralAt, coastal, ekmanPumping, geostrophicSSH, thermalWind, rossby, readSection, vecTo, SECTION_EXAMPLE } from '../../src/lib/sci/oceancurrents.ts';

export default async (check) => {
  const close = (a, b, t) => Math.abs(a - b) <= t;
  check('f at 45° N = 1.031 × 10⁻⁴ s⁻¹, negative in the south, 0 at the equator', close(coriolis(45), 1.0313e-4, 1e-8) && close(coriolis(-45), -1.0313e-4, 1e-8) && coriolis(0) === 0);
  check('stress: 1.22 × 0.0013 × 10² = 0.1586 N/m²', close(windStress(10, 1.22, 1.3e-3), 0.1586, 1e-12));
  const e = ekman(40, 10, 0, 1.22, 1.3e-3, 1025, 0.01);
  check('Ekman: northerly wind at 40° N moves water west (90° right)', close(e.Mbearing, 270, 1e-9) && close(e.M, 0.1586 / (1025 * coriolis(40)), 1e-12));
  check('Ekman: M = 1.65 m²/s', close(e.M, 1.6505, 1e-4));
  check('Ekman depth π√(2A/|f|) = 45.9 m', close(e.depth, 45.887, 1e-3));
  check('surface current 0.160 m/s at 45° right of the wind (bearing 225°)', close(e.V0, 0.15981, 1e-5) && e.V0bearing === 225);
  check('empirical (Pond and Pickard): 0.158 m/s and 53.6 m', close(e.V0emp, 0.15841, 1e-5) && close(e.depthEmp, 53.633, 1e-3));
  const s0 = spiralAt(e, 180, 0), sD = spiralAt(e, 180, e.depth);
  check('spiral: at the Ekman depth the current is e^−π = 4.3 % and points against the surface current', close(sD.speed / s0.speed, Math.exp(-Math.PI), 1e-12) && close(sD.bearing, 45, 1e-9));
  const es = ekman(-40, 10, 0, 1.22, 1.3e-3, 1025, 0.01);
  check('southern hemisphere: transport to the left (east), surface 45° left', close(es.Mbearing, 90, 1e-9) && es.V0bearing === 135 && es.side === -1);
  const c = coastal(e, 270, 20000);
  check('coast with the sea to the west: offshore transport, upwelling 8.25 × 10⁻⁵ m/s (7.1 m/day)', c.upwelling && close(c.w, 8.2527e-5, 1e-8) && close(c.w * 86400, 7.13, 0.01));
  check('coast with the sea to the east: onshore, downwelling', !coastal(e, 90, 20000).upwelling && close(coastal(e, 90, 20000).w, -8.2527e-5, 1e-8));
  const p = ekmanPumping(40, vecTo(windStress(5, 1.22, 1.3e-3), 180), vecTo(windStress(10, 1.22, 1.3e-3), 180), 270, 50000, 1025);
  check('curl: wind stronger offshore of a west-facing coast gives positive curl and upwelling', close(p.curl, (0.1586 - 0.03965) / 50000, 1e-15) && p.w > 0 && close(p.w, 2.4758e-5, 1e-9));
  const g = geostrophicSSH(40, 0.5, 100000, 0, 0);
  check('geostrophy: η up 0.5 m over 100 km eastward → 0.52 m/s northward (high on the right)', close(g.v, 0.52322, 1e-5) && g.bearing === 0 && Math.abs(g.u) < 1e-15);
  const r = rossby(40, 4000, 500, 2, 1025, 0.005);
  check('Rossby radii: barotropic 2,113 km, two-layer 30.9 km, NH/π|f| 67.9 km', close(r.barotropic / 1000, 2113.07, 0.01) && close(r.twoLayer / 1000, 30.869, 0.001) && close(r.fromN / 1000, 67.909, 0.001) && close(r.gPrime, 0.0191415, 1e-6));
  check('Rossby: two-layer undefined when the upper layer fills the depth', Number.isNaN(rossby(40, 400, 500, 2, 1025, 0).twoLayer));
  const sec = readSection(SECTION_EXAMPLE);
  check('section: example reads 7 rows, header skipped', sec.rows.length === 7 && sec.errors.length === 0);
  const tw = thermalWind(sec.rows, 40, 50000, 'density', 1000, 0, 1025);
  check('thermal wind: 0 at 1000 m, −0.541 m/s at the surface (to the right of A→B)', tw[6].v === 0 && close(tw[0].v, -0.54109, 1e-5));
  // Hand-worked: from 800 to 1000 m, mean Δρ = (0.05 + 0)/2 = 0.025 over 200 m → Δv = g·5/(ρ₀ f L).
  check('thermal wind: 800 m by hand', close(tw[5].v, -(9.81 * 5) / (1025 * coriolis(40) * 50000), 1e-12));
  const tw2 = thermalWind(sec.rows, 40, 50000, 'density', 1000, 0.1, 1025);
  check('reference velocity shifts the profile', close(tw2[0].v - tw[0].v, 0.1, 1e-12));
  const dyn = thermalWind([{ depth: 0, a: 1.2, b: 1.0 }, { depth: 500, a: 0, b: 0 }], 40, 50000, 'dynamic', 500, 0, 1025);
  check('dynamic height: ΔD = −0.2 dyn m → v = −2/(f L)', close(dyn[0].v, -2 / (coriolis(40) * 50000), 1e-12) && dyn[1].v === 0);
  const bad = readSection('depth,a,b\n0,1,2\n-5,1,2\n10,x,2\n0,3,3');
  check('section: negative depth, bad numbers and repeated depths explained', bad.errors.length === 3 && bad.errors[0].includes('positive downwards') && bad.errors[1].includes('three numbers') && bad.errors[2].includes('only once'));
};
