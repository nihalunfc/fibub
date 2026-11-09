// #509 Cross-section and topographic profile. Bilinear sampling of a GeoTIFF and an ASCII grid written by Python
// (tifffile, pixel-is-area, GDAL nodata) matched scipy's RegularGridInterpolator at 300 random points to 1e-12;
// the example profile's distances, positions and elevations matched a numpy re-sampling of the same polyline;
// apparent dips matched the numpy intersection of the bed plane with the vertical section plane (1e-13 °).
import { parseAsciiGrid, demFromTiff, bilinear, step, profileFromDem, zAt, azAt, apparent, contactLine, unitBands, parsePairs, exampleDem, EXAMPLE_LINE, sectionSize, drawSection } from '../../src/lib/sci/xsection.ts';
import { writeTiff } from '../../src/lib/sci/tiff.ts';
import { num } from '../../src/lib/sci/num.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  // ASCII grid: corner and centre registration, nodata.
  const g = parseAsciiGrid('ncols 3\nnrows 2\nxllcorner 100\nyllcorner 200\ncellsize 10\nNODATA_value -9999\n1 2 3\n4 5 -9999\n');
  check('xs: ASCII grid origin is the top-left cell centre', g.x0 === 105 && g.y0 === 215 && g.w === 3 && g.h === 2 && Number.isNaN(g.z[5]));
  const gc = parseAsciiGrid('ncols 2\nnrows 2\nxllcenter 0\nyllcenter 0\ncellsize 1\n0 1\n2 3');
  check('xs: ASCII grid with cell centres', gc.x0 === 0 && gc.y0 === 1);
  check('xs: bilinear by hand', near(bilinear(gc, 0.5, 0.5), 1.5) && near(bilinear(gc, 0.25, 1), 0.25) && near(bilinear(gc, 1, 0), 3));
  check('xs: half a cell past the edge uses the edge; further is NaN', bilinear(gc, -0.4, 1) === 0 && Number.isNaN(bilinear(gc, -0.6, 1)));
  check('xs: next to a missing cell is NaN', Number.isNaN(bilinear(g, 120, 205)) && near(bilinear(g, 110, 210), 3));
  let bad = '';
  try { parseAsciiGrid('ncols 3\nnrows 2\nxllcorner 0\nyllcorner 0\ncellsize 1\n1 2 3'); } catch (e) { bad = e.message; }
  check('xs: short ASCII grid refused', bad.includes('should hold 3 × 2 = 6 values'));
  // GeoTIFF: pixel scale and tie point at the corner (pixel-is-area) and pixel-is-point.
  const tags = (rt) => new Map([[33550, { type: 12, count: 3, values: [30, 30, 0] }], [33922, { type: 12, count: 6, values: [0, 0, 0, 400000, 5000000, 0] }], [34735, { type: 3, count: 8, values: [1, 1, 0, 1, 1025, 0, 1, rt] }]]);
  const band = new Float32Array([10, 20, 30, 40, 50, 60]);
  const t1 = demFromTiff(writeTiff(3, 2, [band], tags(1)).buffer), t2 = demFromTiff(writeTiff(3, 2, [band], tags(2)).buffer);
  check('xs: GeoTIFF pixel-is-area and pixel-is-point origins', t1.x0 === 400015 && t1.y0 === 4999985 && t2.x0 === 400000 && t2.y0 === 5000000 && near(bilinear(t1, 400030, 4999970), 30));
  bad = ''; try { demFromTiff(writeTiff(2, 2, [new Float32Array(4)]).buffer); } catch (e) { bad = e.message; }
  check('xs: TIFF without georeferencing refused', bad.includes('no georeferencing'));
  // Distances and azimuths, projected and latitude-longitude.
  const s1 = step([0, 0], [3, 4], false);
  check('xs: projected step 3-4-5 and azimuth', s1.len === 5 && near(s1.az, 36.86989764584402));
  const s2 = step([10, 0], [11, 0], true);
  check('xs: one degree of longitude on the equator', near(s2.len, 6371008.8 * Math.PI / 180, 1e-12) && near(s2.az, 90));
  // Example DEM: values scipy interpolated.
  const ex = exampleDem();
  check('xs: example DEM bilinear (scipy)', near(bilinear(ex, 501234.5, 4201111.1), 480.43747062495993, 1e-9) && near(bilinear(ex, 503000, 4202000), 392.5250015258789, 1e-9) && near(bilinear(ex, 500100.7, 4200050.2), 324.5559715019628, 1e-9));
  const p = profileFromDem(ex, EXAMPLE_LINE, 25);
  check('xs: example profile (numpy)', p.d.length === 144 && near(p.d[100], 2467.134350601013) && near(p.z[100], 418.1176848809911, 1e-9) && near(p.z[143], 421.7249984741211, 1e-9) && near(p.segD[2], 3529.0432878952015));
  check('xs: azimuth by segment', near(azAt(p, 100), 79.99202019855863, 1e-9) && near(azAt(p, 2000), 109.44003482817618, 1e-9));
  check('xs: elevation between samples', near(zAt(p, (p.d[10] + p.d[11]) / 2), (p.z[10] + p.z[11]) / 2) && Number.isNaN(zAt(p, -1)));
  // Apparent dip: section along the dip direction shows the true dip; along strike, none; numpy plane intersection.
  check('xs: apparent dip special cases', near(apparent(0, 60, 90), 60) && near(apparent(0, 60, 270), -60) && Math.abs(apparent(0, 60, 0)) < 1e-12);
  check('xs: apparent dip vs plane intersection (numpy)', near(apparent(20, 30, 79.9), 26.541917603486688, 1e-12) && near(apparent(123, 47, 311), -8.488447716315102, 1e-12) && near(apparent(300, 80, 45), 79.65472995385004, 1e-12));
  // Contact line and the layer-cake fill on a flat surface.
  const flat = parsePairs([['0', '100'], ['100', '100'], ['200', '100']], num); flat.segAz = [90];
  const c = contactLine(flat, { name: 'A', d: 100, strike: 0, dip: 45 });
  check('xs: contact dips down along the section', near(c.alpha, 45) && near(c.at(150), 50) && near(c.at(50), 150));
  const u = unitBands(flat, [c.at], 0);
  check('xs: layer cake: unit above the contact east of it, unit below west', u[0].top[2] === 100 && near(u[0].bottom[2], 0) && u[0].top[0] === 100 && u[0].bottom[0] === 100 && u[1].top[0] === 100 && u[1].bottom[0] === 0 && near(u[1].top[1], 100) && near(u[1].top[2], 0));
  check('xs: typed pairs sorted, duplicates refused', parsePairs([['5', '1'], ['0', '2']], num).d.join() === '0,5' && typeof parsePairs([['1', '1'], ['1', '2']], num) === 'string');
  // The drawing honours the vertical exaggeration.
  const sz1 = sectionSize({ p: flat, ve: 1, base: 0, top: 120 }), sz3 = sectionSize({ p: flat, ve: 3, base: 0, top: 120 });
  check('xs: plot height scales with VE', near(sz3.ph, 3 * sz1.ph) && near(sz1.ph, 120 * sz1.pw / 200));
  const calls = { poly: 0, line: 0, text: 0 };
  const P = { line: () => calls.line++, poly: () => calls.poly++, circle() {}, text: () => calls.text++, measure: (s) => s.length * 6, clip() {}, unclip() {} };
  drawSection(P, { p: flat, ve: 1, base: 0, top: 120, contacts: [{ name: 'A', d: 100, strike: 0, dip: 45, line: c.at, alpha: 45 }], lowest: 'B', units: u, title: 'T', dUnit: 'm', zUnit: 'm' }, { ink: '#000', muted: '#555', grid: '#eee', fills: ['#f00', '#0f0'], line: '#00f' });
  check('xs: drawing makes two unit fills and the frame', calls.poly === 3 && calls.line > 3);
};
