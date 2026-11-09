// #406 Trench and grid recording sheet: grid squares, offsets, baselines, levels, and grid ↔ latitude/longitude.
// Latitudes and longitudes are checked against Vincenty's direct formula on the WGS84 ellipsoid, written separately
// in Python (no pyproj): 40 random cases up to 1 km from the origin agreed to under 0.03 mm per metre.
import { letters, squareOf, fromPeg, fromBaseline, instrumentHeight, levelFromStaff, inTrench, gridToLatLon, latLonToGrid, radii } from '../../src/lib/sci/trenchgrid.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  check('trench: column letters A, Z, AA, AZ, BA', [0, 25, 26, 51, 52].map(letters).join() === 'A,Z,AA,AZ,BA');
  const g = { e0: 1000, n0: 5000, spacing: 5, style: 'en' };
  check('trench: square by SW corner', squareOf(1013.25, 5021.8, g).label === 'E1010 N5020' && squareOf(1010, 5020, g).label === 'E1010 N5020' && squareOf(999.9, 4999, g).label === 'E995 N4995');
  check('trench: letters-and-numbers squares', squareOf(1013.25, 5021.8, { ...g, style: 'alnum' }).label === 'C5' && squareOf(998, 5001, { ...g, style: 'alnum' }).label === 'outside grid');
  check('trench: offsets from a peg', JSON.stringify(fromPeg(1012, 5021, 2.4, 1.15)) === JSON.stringify({ e: 1014.4, n: 5022.15 }));
  { const p = fromBaseline([1012, 5021], [1016, 5021], 3.1, -0.6); check('trench: baseline east, 0.6 m left is north', near(p.e, 1015.1, 1e-12) && near(p.n, 5021.6, 1e-12)); }
  { const p = fromBaseline([0, 0], [3, 4], 5, 1); check('trench: baseline 3-4-5, 1 m right', near(p.e, 3 + 0.8, 1e-12) && near(p.n, 4 - 0.6, 1e-12)); }
  check('trench: levelling HI 101.42, staff 1.87 → 99.55', near(instrumentHeight(100, 1.42), 101.42, 1e-12) && near(levelFromStaff(101.42, 1.87), 99.55, 1e-12));
  check('trench: inside the trench, edges included', inTrench(1012, 5021, { e: 1012, n: 5021, w: 4, l: 2 }) && !inTrench(1008.6, 5017.2, { e: 1012, n: 5021, w: 4, l: 2 }));
  // WGS84 radii at 45°: M = 6367381.82 m, N = 6388838.29 m.
  { const r = radii(45); check('trench: WGS84 radii of curvature at 45°', near(r.M, 6367381.82, 0.01) && near(r.N, 6388838.29, 0.01)); }
  const V = [ // [lat0, lon0, dE, dN, rot, lat, lon] from Python Vincenty direct
    [45.5, -73.6, 500, 300, 0, 45.5026990808, -73.5936024017],
    [45.5, -73.6, 500, 300, 12, 45.5017047107, -73.5929442475],
    [60.2, 24.9, -800, 650, -7.5, 60.2048459314, 24.8841672893],
    [-33.9, 151.2, 20, -15, 0, -33.9001352317, 151.2002162331],
  ];
  V.forEach(([lat0, lon0, dE, dN, rot, lat, lon], i) => {
    const G = { lat: lat0, lon: lon0, e: 1000, n: 5000, rot }, ll = gridToLatLon(1000 + dE, 5000 + dN, G), back = latLonToGrid(ll.lat, ll.lon, G);
    // 1e-8° is about 1 mm.
    check(`trench: grid to lat/long matches Vincenty, case ${i + 1}`, near(ll.lat, lat, 1e-8) && near(ll.lon, lon, 1e-8 / Math.cos(lat * Math.PI / 180)));
    check(`trench: lat/long back to grid, case ${i + 1}`, near(back.e, 1000 + dE, 1e-6) && near(back.n, 5000 + dN, 1e-6));
  });
};
