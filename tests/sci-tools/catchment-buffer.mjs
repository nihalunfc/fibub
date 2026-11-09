// #760 Catchment buffers: haversine distances, nearest facility, coverage, catchments and walkability, checked
// against an independent Python implementation (own haversine, brute-force distance matrix in NumPy) on the
// made-up town in tests/fixtures/catchment-buffer-*.csv.
import { readFileSync } from 'node:fs';
import { haversine, nearest, coverage, wQuantile, catchments, walkScores, polygonCentroid, geojsonPlaces } from '../../src/lib/sci/catchment.ts';

export default async (check) => {
  const read = (n) => readFileSync(new URL(`../fixtures/catchment-buffer-${n}.csv`, import.meta.url), 'utf8').trim().split('\n').slice(1).map((l) => l.split(','));
  const F = read('facilities').map(([name, lat, lon]) => ({ name, lat: +lat, lon: +lon }));
  const P = read('people').map(([name, lat, lon, w]) => ({ name, lat: +lat, lon: +lon, w: +w }));
  const A = read('amenities').map(([type, lat, lon]) => ({ type, lat: +lat, lon: +lon }));
  const rel = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  check('catchment: haversine London to New York matches Python', rel(haversine(51.5007, -0.1246, 40.6892, -74.0445), 5574848.157146156, 1e-12));
  check('catchment: haversine one degree of longitude on the equator = R × π/180', rel(haversine(0, 0, 0, 1), 111195.0802335329, 1e-12) && rel(haversine(0, 0, 0, 1), 6371008.8 * Math.PI / 180, 1e-12));
  check('catchment: haversine Sydney to Tokyo matches Python', rel(haversine(-33.8568, 151.2153, 35.6586, 139.7454), 7821171.941028586, 1e-12));
  check('catchment: zero and antipodal distances', haversine(10, 20, 10, 20) === 0 && rel(haversine(0, 0, 0, 180), Math.PI * 6371008.8, 1e-12));
  const near = nearest(P, F);
  check('catchment: nearest facility of the first 5 blocks matches NumPy', [[2164.5176880258355, 2], [1114.4322327730097, 3], [1030.1182534498178, 1], [2345.0428491068105, 0], [1376.2013143972017, 3]].every(([dd, i], k) => rel(near[k].d, dd, 1e-12) && near[k].i === i));
  const brute = P.map((p) => Math.min(...F.map((f) => haversine(p.lat, p.lon, f.lat, f.lon))));
  check('catchment: sorted search equals checking every facility', near.every((n, k) => n.d === brute[k]));
  const w = P.map((p) => p.w), dd = near.map((n) => n.d), cov = coverage(dd, w, [500, 1000, 1500, 2000]);
  check('catchment: share of population within 500/1000/1500/2000 m matches NumPy', cov.every((c, i) => rel(c.share, [0.1485127478753541, 0.41260623229461757, 0.66671388101983, 0.7899433427762039][i], 1e-12) && c.pop === [2097.0, 5826.0, 9414.0, 11154.0][i]));
  const wm = dd.reduce((s, x, i) => s + x * w[i], 0) / w.reduce((s, x) => s + x, 0);
  check('catchment: population-weighted mean, median and 90th percentile match NumPy', rel(wm, 1307.1562392057308, 1e-12) && rel(wQuantile(dd, w, 0.5), 1210.7207293205552, 1e-12) && rel(wQuantile(dd, w, 0.9), 2415.2030526703106, 1e-12));
  const ca = catchments(P, F, 1000, near);
  check('catchment: population within 1 km of each facility matches NumPy', ca.every((c, k) => c.within === [2040.0, 1956.0, 1531.0, 822.0][k]));
  check('catchment: population served (nearest) by each facility matches NumPy and adds to the total', ca.every((c, k) => c.served === [4317.0, 2626.0, 4174.0, 3003.0][k]) && ca.reduce((s, c) => s + c.served, 0) === w.reduce((s, x) => s + x, 0));
  const ws = walkScores(P, A, ['grocery', 'school', 'park'], 800);
  check('catchment: walkability scores and counts of the first 5 blocks match Python', ws.slice(0, 5).every((s, i) => rel(s.score, [0.0, 66.66666666666667, 33.333333333333336, 0.0, 0.0][i]) && s.count === [0, 2, 1, 0, 0][i]));
  check('catchment: population-weighted walkability matches Python', rel(ws.reduce((s, x, i) => s + x.score * w[i], 0) / w.reduce((s, x) => s + x, 0), 39.938621340887636, 1e-12));
  // Polygons: a 0.01° square, the same with a hole in one corner, and a two-part multipolygon.
  const sq = [[[10, 50], [10.01, 50], [10.01, 50.01], [10, 50.01], [10, 50]]];
  const c1 = polygonCentroid(sq);
  check('catchment: centroid of a small square is its middle', Math.abs(c1.lat - 50.005) < 1e-9 && Math.abs(c1.lon - 10.005) < 1e-9 && rel(c1.area, (0.01 * Math.PI / 180 * 6371008.8) ** 2 * Math.cos(50 * Math.PI / 180), 1e-12));
  const holed = polygonCentroid([sq[0], [[10, 50], [10, 50.005], [10.005, 50.005], [10.005, 50], [10, 50]]]);
  check('catchment: a hole moves the centroid away and removes a quarter of the area', holed.lat > 50.005 && holed.lon > 10.005 && rel(holed.area, c1.area * 0.75, 1e-12) && Math.abs(holed.lat - (50 + 0.01 * 7 / 12)) < 1e-7);
  const g = geojsonPlaces({ type: 'FeatureCollection', features: [
    { type: 'Feature', properties: { pop: 100, name: 'A' }, geometry: { type: 'Polygon', coordinates: sq } },
    { type: 'Feature', properties: { pop: 50 }, geometry: { type: 'Point', coordinates: [10.2, 50.1] } },
    { type: 'Feature', properties: { pop: 'x' }, geometry: { type: 'Point', coordinates: [10.2, 50.1] } },
    { type: 'Feature', properties: { pop: 10 }, geometry: { type: 'LineString', coordinates: [[0, 0], [1, 1]] } },
  ] }, 'pop', 'name');
  check('catchment: GeoJSON polygons become weighted centroids; bad rows are skipped', g.places.length === 2 && g.polygons === 1 && g.skipped === 2 && g.places[0].w === 100 && g.places[0].name === 'A' && Math.abs(g.places[0].lat - 50.005) < 1e-9);
};
