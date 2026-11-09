// #667 standard atmosphere. Checked against an independent Python script that integrates the hydrostatic equation
// numerically with SciPy solve_ivp (rtol 1e-12) from the same defining constants, plus the well-known layer-boundary
// values of the 1976 standard (which follow from its definitions).
import { atmosphere, pressureAltitude, densityAltitude, fieldDensity, stdTP, geopotential, geometric, layerBases, table } from '../../src/lib/sci/eng-atmos.ts';

export default async (check) => {
  const rel = (a, b, t) => Math.abs(a / b - 1) < t;
  const sl = atmosphere(0);
  check('atmos: sea level 288.15 K, 101325 Pa, 1.225 kg/m³', sl.T === 288.15 && sl.P === 101325 && rel(sl.rho, 1.225, 1e-4));
  check('atmos: sea level speed of sound 340.294 m/s', Math.abs(sl.a - 340.294) < 1e-3);
  check('atmos: sea level viscosity 1.7894e-5 Pa·s', rel(sl.mu, 1.78938e-5, 1e-5));
  const b = layerBases();
  check('atmos: 11 km base 216.65 K, 22632.06 Pa', Math.abs(b[1].T - 216.65) < 1e-9 && Math.abs(b[1].P - 22632.06) < 0.05);
  check('atmos: 20 km base 5474.89 Pa', Math.abs(b[2].P - 5474.889) < 0.01);
  check('atmos: 32 km base 228.65 K, 868.019 Pa', Math.abs(b[3].T - 228.65) < 1e-9 && Math.abs(b[3].P - 868.0187) < 0.002);
  check('atmos: 47 km base 270.65 K, 110.906 Pa', Math.abs(b[4].T - 270.65) < 1e-9 && Math.abs(b[4].P - 110.9063) < 0.001);
  check('atmos: 51 km base 66.9389 Pa', Math.abs(b[5].P - 66.93887) < 1e-3);
  check('atmos: 71 km base 214.65 K, 3.95642 Pa', Math.abs(b[6].T - 214.65) < 1e-9 && Math.abs(b[6].P - 3.956420) < 1e-4);
  const top = atmosphere(86000);
  check('atmos: 86 km geometric = 84852 m geopotential, 0.3734 Pa', Math.abs(top.H - 84852) < 0.1 && Math.abs(top.P - 0.3734) < 1e-3);
  // SciPy numerical integration (scratch atm.py), geometric heights.
  const py = [[1000, 281.6510, 89876.3, 1.11166], [5000, 255.6755, 54048.3, 0.736428], [11000, 216.7735, 22700.0, 0.364802], [20000, 216.65, 5529.31, 0.0889099], [32000, 228.4897, 889.064, 0.0135552], [47000, 269.6841, 115.851, 0.00149652], [71000, 216.8459, 4.47956, 7.19652e-5], [-2000, 301.1541, 127783, 1.47816]];
  for (const [z, T, P, rho] of py) { const p = atmosphere(z); check(`atmos: ${z} m matches SciPy integration`, Math.abs(p.T - T) < 1e-3 && rel(p.P, P, 2e-5) && rel(p.rho, rho, 2e-5)); }
  check('atmos: 5 km speed of sound and viscosity match SciPy', Math.abs(atmosphere(5000).a - 320.54552) < 1e-4 && rel(atmosphere(5000).mu, 1.62825e-5, 1e-5));
  check('atmos: geopotential round trip', Math.abs(geometric(geopotential(54321)) - 54321) < 1e-6 && Math.abs(geopotential(11019.13) - 11000.06) < 0.01);
  check('atmos: pressure altitude of 70000 Pa = 3012.18 m (SciPy)', Math.abs(pressureAltitude(70000) - 3012.1826) < 0.01);
  check('atmos: pressure altitude inverts every layer', [-3000, 500, 15000, 25000, 40000, 49000, 60000, 80000].every((H) => Math.abs(pressureAltitude(stdTP(H).P) - H) < 1e-4));
  check('atmos: density altitude of 1.0 kg/m³ = 2064.29 m (SciPy)', Math.abs(densityAltitude(1.0) - 2064.2905) < 0.01);
  const f = fieldDensity(1500, 101000, 303.15);
  check('atmos: field 1500 m, QNH 1010, 30 °C (SciPy)', Math.abs(f.P - 84288.45) < 0.05 && Math.abs(f.pressureAlt - 1525.819) < 0.01 && Math.abs(f.densityAlt - 2379.863) < 0.01 && Math.abs(f.isaDev - 24.918) < 0.001);
  const hot = atmosphere(3000, { geopotential: true, dT: 15 });
  check('atmos: ISA +15 keeps pressure, lowers density', hot.P === stdTP(3000).P && Math.abs(hot.T - stdTP(3000).T - 15) < 1e-9 && hot.rho < atmosphere(3000, { geopotential: true }).rho);
  check('atmos: table rows and bad range', table(0, 10000, 1000).length === 11 && table(10, 0, 1).length === 0 && Number.isNaN(pressureAltitude(-1)));
};
