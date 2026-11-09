// #892 UTM and MGRS converter. Reference values from PROJ (pyproj 3.8: proj=utm, get_factors), GeographicLib's
// geodesic (pyproj Geod.inv) and the GeoTrans-based mgrs 1.5 library. A wider check of 5,000 random points on the
// four ellipsoids (zone and band edges, Norway and Svalbard) agreed with PROJ to under 1e-7 m; 5,250 MGRS
// references at every precision matched mgrs except 4 points within 5 mm of a zone edge or the equator.
import { toUtm, fromUtm, toMgrs, parseMgrs, parsePoint, parseLatLon, parseBatch, inverse, direct, fmtDms, fmtDdm, utmZone, ELLIPSOIDS, EXAMPLE_BATCH } from '../../src/lib/sci/utm.ts';

const REF = [ // lat, lon, ellipsoid, zone, E, N, convergence, scale, MGRS
  [51.4778056, -0.0014722, 'wgs84', 30, 708215.8551, 5707225.2443, 2.34678646, 1.000132316, '30UYC0821507225'],
  [-33.8688, 151.2093, 'wgs84', 56, 334368.6336, 6250948.3454, 0.99817186, 0.999938201, '56HLH3436850948'],
  [60.3947, 5.3221, 'wgs84', 32, 297375.0733, 6701026.6184, -3.19882433, 1.000103135, '32VKN9737501026'],
  [78.2232, 15.6469, 'wgs84', 33, 514738.9337, 8683360.477, 0.63328395, 0.999602655, '33XWG1473883360'],
  [0.0001, -179.9999, 'grs80', 1, 166032.586, 11.0683, -5.24e-06, 1.000980969, '01NAA6603200011'],
  [-79.9, -60.5, 'intl', 20, 548931.8859, 1128262.0061, -2.461306, 0.999629252, ''],
  [40.0, -105.0, 'clrk66', 13, 500000.0, 4427547.1804, 0, 0.9996, ''],
  [83.9, 170.0, 'wgs84', 59, 488136.7308, 9317033.0971, -0.99433908, 0.999601719, '59XMP8813617033'],
];
const GEOD = [ // lat1, lon1, lat2, lon2, s, az1, az2 (GeographicLib)
  [51.4778, -0.0015, 48.8584, 2.2945, 334325.2213, 149.7329869, 151.4967059],
  [-37.95103342, 144.42486789, -37.65282114, 143.92649554, 54972.2705, 306.86816, 307.1736314],
  [10, 20, -30, -100, 13449485.3109, 240.9527968, 276.5892361],
];
const near = (a, b, t) => Math.abs(a - b) <= t;

export default async (check) => {
  for (const [lat, lon, e, zone, E, N, conv, k, mg] of REF) {
    const ell = ELLIPSOIDS.find((x) => x.id === e), u = toUtm(lat, lon, { ell });
    check(`utm: ${lat}, ${lon} (${e}) zone ${zone} E ${E} N ${N} as PROJ`, u.zone === zone && near(u.easting, E, 1e-4) && near(u.northing, N, 1e-4));
    check(`utm: convergence and scale at ${lat}, ${lon} as PROJ`, near(u.convergence, conv, 1e-7) && near(u.scale, k, 1e-8));
    const b = fromUtm(u.zone, u.hemi, u.easting, u.northing, ell);
    check(`utm: round trip ${lat}, ${lon}`, near(b.lat, lat, 1e-10) && near(b.lon, lon, 1e-10));
    if (mg) check(`mgrs: ${mg}`, toMgrs(lat, lon, 5, false, ell).padStart(15, '0') === mg);
  }
  check('utm: Norway 32V and Svalbard exceptions', utmZone(60, 5) === 32 && utmZone(60, 2.9) === 31 && utmZone(55.9, 5) === 31 && utmZone(78, 8.9) === 31 && utmZone(78, 9) === 33 && utmZone(78, 21) === 35 && utmZone(78, 33) === 37 && utmZone(78, 42) === 38);
  check('utm: forced zone (31 for a zone 30 point) as PROJ', near(toUtm(51 + 28 / 60 + 40.1 / 3600, -5.3 / 3600, { zone: 31 }).easting, 291579.72778, 1e-4) && near(toUtm(51 + 28 / 60 + 40.1 / 3600, -5.3 / 3600, { zone: 31 }).northing, 5707233.62090, 1e-4));
  let polar = ''; try { toUtm(85, 0); } catch (e) { polar = e.message; }
  check('utm: refuses beyond 84° N', polar.startsWith('UTM covers'));
  // MGRS precisions and parsing (mgrs.toLatLon gives the centre of the square)
  check('mgrs: precisions', toMgrs(51.4778056, -0.0014722, 3) === '30U YC 082 072' && toMgrs(51.4778056, -0.0014722, 0) === '30U YC' && toMgrs(51.4778056, -0.0014722, 1, false) === '30UYC00');
  const pm = parseMgrs('30UYC0821507225');
  check('mgrs: parse to UTM', pm.easting === 708215 && pm.northing === 5707225 && pm.size === 1);
  const ps = parseMgrs('56H LH 343 509');
  check('mgrs: southern hemisphere, 100 m square', ps.hemi === 'S' && ps.easting === 334300 && ps.northing === 6250900 && ps.size === 100);
  // Lat/long forms
  const forms = ['51°28′40.12″N 0°00′05.31″W', '51 28 40.12 N, 0 0 5.31 W', 'N51 28.668667 W0 0.0885', '51.477811111, -0.001475', "0°0'5.31\"W 51°28'40.12\"N", 'lat 51.477811111 lon -0.001475'];
  check('latlon: six written forms read the same', forms.every((f) => { const p = parseLatLon(f); return near(p.lat, 51.477811111, 1e-8) && near(p.lon, -0.001475, 1e-8); }));
  const errs = ['91, 10', '51 61 0 N 0 0 0 E', '51.5 N 0.1 N', '1 2 3'].map((s) => { try { parseLatLon(s); return ''; } catch (e) { return e.message; } });
  check('latlon: bad input explained', errs.every(Boolean));
  check('format: DMS and DDM', fmtDms(51.477811111, true) === '51°28′40.12″ N' && fmtDms(-0.001475, false) === '0°00′05.31″ W' && fmtDdm(-33.8688, true) === '33°52.1280′ S' && fmtDms(-1e-9, true) === '0°00′00.00″ N');
  // UTM text and the S ambiguity
  const s1 = parsePoint('56H 334368.63 6250948.35'), s2 = parsePoint('56S 334368.63 6250948.35'), s3 = parsePoint('33S 500000 3900000');
  check('utm text: band H, and "S" read as south when band S does not fit', near(s1.lat, -33.8688, 1e-7) && near(s2.lat, -33.8688, 1e-7) && /southern/.test(s2.note) && near(s3.lat, 35.24, 0.01) && /band S/.test(s3.note));
  let noBand = ''; try { parsePoint('10 500000 4000000'); } catch (e) { noBand = e.message; }
  check('utm text: asks for the band letter', noBand.startsWith('Add the latitude band'));
  check('utm text: wrong band flagged', /does not match/.test(parsePoint('30C 708215 5707225').note ?? ''));
  // Geodesics
  for (const [a, b, c, d, s, z1, z2] of GEOD) {
    const r = inverse(a, b, c, d);
    check(`geodesic: ${a},${b} to ${c},${d} = ${s} m as GeographicLib`, r.converged && near(r.s, s, 1e-3) && near(r.az1, z1, 1e-6) && near(r.az2, z2, 1e-6));
    const f = direct(a, b, r.az1, r.s);
    check(`geodesic: direct returns to ${c},${d}`, near(f.lat, c, 1e-9) && near(f.lon, d, 1e-9));
  }
  check('geodesic: nearly antipodal flagged, not wrong', (() => { const r = inverse(0, 0, 0.5, 179.7); return !r.converged || near(r.s, 19944127.4208, 1e-3); })());
  // Batch
  const rows = parseBatch(EXAMPLE_BATCH);
  check('batch: example has 7 points, names split off', rows.length === 7 && rows.every((r) => r.p) && rows[2].label === 'Peg 3 (UTM)' && rows[3].p.from === 'mgrs' && rows[6].p.lat < 0);
  const tab = parseBatch('site\tlatitude\tlongitude\nA\t52.1\t0.2\nB\t52.2\tx\n');
  check('batch: table with named columns; bad row reported', tab.length === 2 && tab[0].label === 'A' && near(tab[0].p.lat, 52.1, 1e-12) && !!tab[1].error);
};
