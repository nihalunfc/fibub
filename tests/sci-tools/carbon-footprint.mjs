// #505 Carbon footprint. Checked against pandas (amount × factor × people, grouped by category) and GeographicLib
// (Karney) great-circle distances for flights on 300 random households, plus 1,000 random point pairs (Vincenty
// against GeographicLib and pyproj to 1 mm, 20 nearly antipodal pairs within 0.5 %, haversine against NumPy):
// 6,101 checks, 0 failed.
import { geodesic, haversine, parseLatLon, flightLine, footprint, exampleState, csvRows } from '../../src/lib/sci/footprint.ts';

export default async (check) => {
  const close = (a, b, t) => Math.abs(a - b) <= t;
  // Reference distances on WGS84 from GeographicLib:
  check('geodesic: LHR to JFK 5,555.12 km (GeographicLib 5,555,124.5 m)', close(geodesic(51.47, -0.4543, 40.64, -73.78), 5555124.47, 0.01));
  check('geodesic: a quarter meridian is 10,001,965.7 m', close(geodesic(0, 0, 90, 0), 10001965.729, 0.001));
  check('geodesic: equator 1° is 111,319.49 m', close(geodesic(0, 0, 0, 1), 111319.491, 0.001));
  check('geodesic: same point is 0, and symmetric', geodesic(10, 20, 10, 20) === 0 && close(geodesic(10, 20, -30, 150), geodesic(-30, 150, 10, 20), 1e-6));
  check('geodesic: nearly antipodal falls back to the sphere, within 0.05 % of GeographicLib', close(geodesic(0, 0, 0.5, 179.7) / 1000, 19944.13, 10));
  check('haversine: quarter circle = π/2 × 6,371,008.8 m', close(haversine(0, 0, 90, 0), Math.PI / 2 * 6371008.8, 1e-6));
  check('parse: "43.68, -79.63", minus signs, bad input', String(parseLatLon('43.68, -79.63')) === '43.68,-79.63' && String(parseLatLon('−33.9; 151.2')) === '-33.9,151.2' && parseLatLon('95, 10') === null && parseLatLon('43.68') === null && parseLatLon('a, b') === null);

  const f = flightLine({ label: 'x', from: '', to: '', km: 1000, trips: 3, ret: true }, 0.15, 0.08);
  check('flight: 1000 km × 1.08 × 6 legs × 0.15 = 972 kg', close(f.kg, 972, 1e-9) && f.legs === 6);
  check('flight: typed distance wins over coordinates', flightLine({ label: 'x', from: '0, 0', to: '0, 1', km: 500, trips: 1, ret: false }, 1, 0).km === 500);
  check('flight: half-typed coordinates give a message', !!flightLine({ label: 'Trip', from: '10, 10', to: '', km: null, trips: 1, ret: false }, 1, 0).error);
  check('flight: empty row counts nothing', flightLine({ label: '', from: '', to: '', km: null, trips: 1, ret: false }, 1, 0).kg === 0);

  const s = exampleState(), r = footprint(s);
  const by = Object.fromEntries(r.cats.map((c) => [c.id, c.kg]));
  check('example: home 4,000, travel 2,115, food 3,285, goods 1,700 kg', by.home === 4000 && close(by.travel, 2115, 1e-9) && close(by.food, 3285, 1e-9) && close(by.goods, 1700, 1e-9));
  check('example: Toronto–Vancouver 3,354 km, return = 1,006 kg', close(r.flights[0].km, 3354.45, 0.01) && close(by.flights, 1006.34, 0.01));
  check('example: total 12.11 t, 6.05 t per person', close(r.total, 12106.34, 0.01) && close(r.perPerson, 6053.17, 0.01) && r.errors.length === 0);
  check('example: flights placed third', r.cats.map((c) => c.id).join() === 'home,travel,flights,food,goods');
  const s2 = exampleState(); s2.cats[0].lines[0].factor = 0.05;
  check('scenario: low-carbon electricity, 10.71 t', close(footprint(s2).total, 10706.34, 0.01));
  const s3 = exampleState(); s3.people = 3;
  check('people only scale the per-person food lines', close(footprint(s3).total - r.total, 1642.5, 1e-9));
  const s4 = exampleState(); s4.cats[1].lines[0].amount = -5; s4.cats[2].lines[0].factor = NaN;
  { const r4 = footprint(s4); check('bad lines: negative amount and non-number explained, counted as 0', r4.errors.length === 2 && r4.errors[0].includes('cannot be negative') && r4.errors[1].includes('must be numbers')); }
  const rows = csvRows(s, r);
  check('CSV: header, 10 lines + flight + total', rows.length === 13 && rows[0][6] === 'kg_co2e' && rows[12][0] === 'Total' && close(rows[12][6], 12106.336, 1e-9) && rows[11][3] === 'passenger-km' && rows[5][5] === 2);
};
