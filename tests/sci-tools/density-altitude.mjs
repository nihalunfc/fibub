// #898 Density altitude. ISA layers checked against the ambiance package on 500 heights from −4 to 50 km (temperature
// identical, pressure and density within 2e-6), density altitude and pressure altitude against bisection on ambiance's
// atmosphere (within 1.2 cm on 300 random states), moist density against MetPy 1.7.1 density() (within 2e-5, the
// difference between the gas constants 287.05287 and 287.04749).
import { isa, pressureAltitude, densityAltitude, densityAlt, stationFromQnh, qnhFromStation, vapour, LAYERS, RHO0, FT, INHG } from '../../src/lib/sci/densalt.ts';
export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  check('density alt: sea-level standard density 1.225 kg/m³', near(RHO0, 1.225, 1e-6));
  check('density alt: ISA layer bases 226.32, 54.749, 8.6802, 1.1091 hPa', near(LAYERS[1].p, 226.32, 0.01) && near(LAYERS[2].p, 54.749, 0.001) && near(LAYERS[3].p, 8.6802, 0.0001) && near(LAYERS[4].p, 1.1091, 0.0001) && near(LAYERS[1].t, 216.65, 1e-9) && near(LAYERS[3].t, 228.65, 1e-9));
  check('density alt: ISA at 5000 ft is 5.1 °C and 843.1 hPa', near(isa(5000 * FT).t - 273.15, 5.094, 0.001) && near(isa(5000 * FT).p, 843.07, 0.01));
  check('density alt: pressure and density altitude invert the ISA (every layer)', [-1500, 0, 3000, 10999, 15000, 25000, 40000, 49000].every((h) => near(pressureAltitude(isa(h).p), h, 1e-6) && near(densityAltitude(isa(h).rho), h, 1e-6)));
  check('density alt: NWS pressure altitude formula agrees within 3 m at 553 hPa', near(pressureAltitude(553.0184), (1 - (553.0184 / 1013.25) ** 0.190284) * 145366.45 * FT, 3));
  check('density alt: QNH and station pressure round trip', near(qnhFromStation(stationFromQnh(1030, 1500), 1500), 1030, 1e-9) && near(stationFromQnh(1013.25, 0), 1013.25, 1e-9));
  const p = stationFromQnh(29.92 * INHG, 5000 * FT), r = densityAlt(p, 30, null);
  check('density alt: 5000 ft, 29.92 inHg, 30 °C dry: PA 5001 ft, DA 7802 ft (rule of thumb 7990)', near(r.pa / FT, 5001.2, 0.1) && near(r.da / FT, 7802.1, 0.1) && near(r.thumb / FT, 7990.2, 0.1) && near(r.isaDev, 24.908, 0.001));
  const m = densityAlt(p, 30, 20);
  check('density alt: humid air is lighter (dew point 20 °C adds 340 ft)', near(m.da / FT, 8142.4, 0.1) && near(m.rho, 0.95863, 1e-5) && near(m.e, 23.369, 0.001) && m.da > r.da);
  check('density alt: virtual temperature 33.2 °C', near(m.tv - 273.15, 33.21, 0.01));
  check('density alt: Bolton vapour pressure 6.112 hPa at 0 °C', near(vapour(0), 6.112, 1e-12));
  const cold = densityAlt(1013.25, -20, null);
  check('density alt: cold air at sea level gives a negative density altitude', cold.da < -1000 && near(cold.rhoPct, 113.8, 0.1));
  check('density alt: standard day density altitude equals pressure altitude', near(densityAlt(isa(2000).p, isa(2000).t - 273.15, null).da, 2000, 1e-6));
};
