// #888 DEM terrain. References: independent numpy code of Horn's slope, ArcGIS aspect and hillshade, and
// Zevenbergen-Thorne curvature (ArcGIS formulas), with missing neighbours replaced by the centre cell. Wider checks
// (scratch scripts): 120 x 100 grids (projected LZW GeoTIFF with gaps, tiled Deflate int16 geographic GeoTIFF at 60 N,
// ASCII grid) agreed with numpy to float32 precision for all 7 layers, and slope, aspect and curvature with
// xarray-spatial 0.10.20 on all 11,528 interior cells; exports read back in rasterio 1.5 (GDAL 3.12) with the same
// transform and CRS. The small GeoTIFF below was written by rasterio.
import { derive, readAsc, gridFromTiff, rowSizes, stats, classShares, aspectShares, toAsc, geoTagsFor, exampleGrid } from '../../src/lib/sci/dem.ts';
import { writeTiff, readTiff } from '../../src/lib/sci/tiff.ts';

const Z = [100.0, 105.4, 103.8, 101.9, 108.4, 107.1, 100.5, 113.7, 102.1, 104.0, 115.9, 117.9, 100.8, 95.6, 105.8, 114.6, null, 111.3, 84.8, 92.7, 91.3, 107.1, 101.9, 117.2, 101.3, 101.5, 85.9, 104.7, 111.6, 115.9];
const REF = {"slope": [9.639773, 4.072911, 6.255746, 9.685321, 10.321368, 9.529429, 9.649028, 6.425007, 2.418853, 12.521715, 13.752161, 7.01225, 14.806215, 19.834305, 18.366517, 15.561852, null, 4.724061, 15.259808, 2.366614, 21.143141, 19.233613, 10.716316, 12.787494, 12.091202, 15.077123, 13.144678, 21.38878, 12.559392, 8.660572], "slopepct": [16.985145, 7.120569, 10.96193, 17.066945, 18.211608, 16.787067, 17.001765, 11.260995, 4.224205, 22.209232, 24.473841, 12.300159, 26.432745, 36.069865, 33.20068, 27.848743, null, 8.263776, 27.281521, 4.132871, 38.673319, 34.889477, 18.92469, 22.696489, 21.422083, 26.93924, 23.352944, 39.166982, 22.278244, 15.231731], "aspect": [295.641006, 306.145692, 72.205547, 302.619243, 303.493738, 25.114835, 256.045491, 221.7603, 35.242037, 301.184975, 310.671125, 316.688316, 172.391033, 198.277974, 233.496825, 250.491491, null, 201.286405, 277.265032, 203.153082, 235.508645, 239.705145, 291.871685, 274.548757, 13.841636, 34.31683, 213.826162, 278.368014, 294.249733, 291.976038], "hillshade": [206.252922, 192.511057, 170.255791, 207.371862, 209.051589, 187.977599, 193.347683, 178.039426, 181.441358, 213.985824, 217.885233, 200.966747, 137.714948, 142.105292, 179.521915, 194.521248, null, 173.727546, 211.486622, 177.387674, 180.035978, 185.325808, 208.001214, 206.209554, 195.854329, 182.799979, 167.641657, 220.664104, 212.663367, 203.244925], "curv": [-1.43, 0.422, 0.347, -2.436, 0.75, -2.053, -3.268, 10.424, -4.239, -3.86, 3.675, 3.284, 3.908, -6.282, 3.262, 5.096, null, -2.0, -7.175, 0.453, -5.756, 4.434, -6.677, 4.977, 2.59, 5.358, -9.464, 2.591, 2.202, 0.867], "profile": [-1.443997, -0.637594, 0.428313, -2.337087, -0.536802, -1.826417, -3.244782, 4.326519, -2.947187, -1.793719, 2.584027, 2.604008, 3.158814, -2.413415, 1.697133, 2.334757, null, -2.0, -2.013044, 1.845905, -3.521821, 4.24675, -4.49926, 3.551493, 2.626355, 3.26482, -4.293584, 2.877605, 1.415373, 0.684205], "plan": [-0.013997, -1.059594, 0.081313, 0.098913, -1.286802, 0.226583, 0.023218, -6.097481, 1.291813, 2.066281, -1.090973, -0.679992, -0.749186, 3.868585, -1.564867, -2.761243, null, 0.0, 5.161956, 1.392905, 2.234179, -0.18725, 2.17774, -1.425507, 0.036355, -2.09318, 5.170416, 0.286605, -0.786627, -0.182795]};
const GEO = {"slope": [6.033684, 8.173867, 4.291178, 10.437224], "aspect": [278.074892, 192.235772, 320.668335, 229.84861], "hillshade": [194.464928, 164.606513, 193.232678, 180.089734], "curv": [-0.405264, 0.092669, 0.244218, -0.208217]};
const GEO_DX = [65.69473928574565, 92.6099668737747];
export const TIF = 'SUkqAAgAAAATAAABAwABAAAAFAAAAAEBAwABAAAAEAAAAAIBAwABAAAAEAAAAAMBAwABAAAACAAAAAYBAwABAAAAAQAAABUBAwABAAAAAQAAABwBAwABAAAAAQAAAD0BAwABAAAAAgAAAEIBAwABAAAAEAAAAEMBAwABAAAAEAAAAEQBBAACAAAA8gAAAEUBAwACAAAAgQB2AFMBAwABAAAAAgAAAA6DDAADAAAA+gAAAIKEDAAGAAAAEgEAAK+HAwAgAAAAQgEAALCHDAACAAAAggEAALGHAgAIAAAAkgEAAIGkAgAGAAAAmgEAAAAAAACgAQAAIQIAAGjblKKBTks/aNuUooFOSz8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABxA4XoUrkeBRkAAAAAAAAAAAAEAAQAAAAcAAAQAAAEAAgABBAAAAQABAAAIAAABAOYQAQixhwcAAAAGCAAAAQCOIwkIsIcBAAEACwiwhwEAAACIbXSWHaRyQAAAAECmVFhBV0dTIDg0fAAtOTk5OQB4nI3QPQqDQBiE4UlWIZAQ8acM6ZPUqa0E72bt0bzK7qKuIywiIupn/fAWM6VKkSJGhDtuCAE4trQ01NS0LFS28ACXleeTP/HwDgzeNTUNLf/e66b6bvcfoX+pDAmShTt2sxtGQh8I3l+P3Z70vX+c0IfCv7Gw/y34T9g/Agl16el4nMti/vufgYGFYeofBqwgAyzPzDADh3wS8x+w/nk45COg8itwyPtA5bfgkLeDuu8gDnlDqPw5HPJqUPmbOOTlofY/xCEvBdX/FIe8NDR8nuI0H6L/AQ55Daj+GzjkjaH6z+CQd4DK78ch7wuV34RDHgCjoD/h';
const near = (a, b, t) => (a === null || b === null || Number.isNaN(a) || Number.isNaN(b) ? (a === null || Number.isNaN(a)) && (b === null || Number.isNaN(b)) : Math.abs(a - b) <= t);

export default async (check) => {
  const g = { w: 6, h: 5, z: Float32Array.from(Z, (v) => (v === null ? NaN : v)), dx: 20, dy: 25, x0: 0, y0: 125, unit: 'm', notes: [] };
  for (const [k, tol] of [['slope', 1e-4], ['slopepct', 1e-4], ['aspect', 1e-3], ['hillshade', 1e-3], ['curv', 1e-5], ['profile', 1e-5], ['plan', 1e-5]]) {
    const a = derive(g, k, { az: 315, alt: 45 });
    check(`dem: ${k} on a 6 x 5 grid with a gap (20 x 25 m cells) as numpy`, REF[k].every((v, i) => near(a[i], v, tol)));
  }
  // Geographic GeoTIFF (rasterio, Deflate + predictor 2, tiled, no-data -9999)
  const b = Buffer.from(TIF, 'base64'), G = gridFromTiff(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
  check('dem: geographic GeoTIFF read (degrees, no data)', G.unit === 'deg' && G.w === 20 && G.h === 16 && Number.isNaN(G.z[3 * 20 + 3]) && G.z[0] === 840);
  const { dxm, dym } = rowSizes(G);
  check('dem: cell size in metres at 45° N from the WGS 84 radii', Math.abs(dxm[0] - GEO_DX[0]) < 1e-6 && Math.abs(dym[0] - GEO_DX[1]) < 1e-6);
  const cells = [[0, 0], [5, 7], [15, 19], [3, 4]];
  for (const [k, tol] of [['slope', 1e-4], ['aspect', 1e-3], ['hillshade', 1e-3], ['curv', 1e-5]]) {
    const a = derive(G, k);
    check(`dem: ${k} on the degree grid as numpy`, cells.every(([r, c], i) => near(a[r * 20 + c], GEO[k][i], tol)));
  }
  // Simple planes: slope and aspect by hand
  const plane = (fx, fy) => { const z = new Float32Array(25); for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) z[r * 5 + c] = fx * c * 10 - fy * r * 10; return { w: 5, h: 5, z, dx: 10, dy: 10, x0: 0, y0: 50, unit: 'm', notes: [] }; };
  const p1 = plane(1, 0), s1 = derive(p1, 'slope')[12], a1 = derive(p1, 'aspect')[12];
  check('dem: plane rising to the east: 45°, facing west (270°)', Math.abs(s1 - 45) < 1e-5 && Math.abs(a1 - 270) < 1e-4);
  const p2 = plane(0, -0.5), a2 = derive(p2, 'aspect')[12], pc = derive(p2, 'slopepct')[12];
  check('dem: plane falling to the south... facing north (0°), 50 %', (Math.abs(a2) < 1e-4 || Math.abs(a2 - 360) < 1e-4) && Math.abs(pc - 50) < 1e-4);
  check('dem: flat ground has no aspect, hillshade = 255 × sin(altitude)', Number.isNaN(derive(plane(0, 0), 'aspect')[12]) && Math.abs(derive(plane(0, 0), 'hillshade', { alt: 30 })[12] - 127.5) < 1e-3);
  check('dem: feet to metres (z factor) makes slopes gentler', Math.abs(derive(p1, 'slope', { zf: 0.3048 })[12] - Math.atan(0.3048) * 180 / Math.PI) < 1e-4);
  // ASCII grid: corner and centre forms, no data, dx/dy
  const asc = readAsc('ncols 3\nnrows 2\nxllcenter 105\nyllcenter 205\ncellsize 10\nNODATA_value -9999\n1 2 3\n4 -9999 6\n');
  check('dem: ASCII grid read (centre form, no data)', asc.x0 === 100 && asc.y0 === 220 && Number.isNaN(asc.z[4]) && asc.z[5] === 6);
  let short = ''; try { readAsc('ncols 3\nnrows 2\ncellsize 1\n1 2 3\n'); } catch (e) { short = e.message; }
  check('dem: ASCII grid too short explained', /should hold 6 values/.test(short));
  const back = readAsc(toAsc(G, G.z));
  check('dem: ASCII grid round trip with dx and dy', back.w === 20 && back.dx === G.dx && Math.abs(back.y0 - G.y0) < 1e-9 && back.unit === 'deg' && Number.isNaN(back.z[63]) && back.z[0] === 840);
  const t = readTiff(writeTiff(G.w, G.h, [derive(G, 'slope')], geoTagsFor(G), true).buffer);
  check('dem: GeoTIFF export keeps georeferencing', t.geo.model === 2 && t.geo.epsg === 4326 && Math.abs(t.geo.scale[0] - G.dx) < 1e-12 && Math.abs(t.geo.tie[3] - G.y0) < 1e-9);
  // Statistics and classes on the example
  const E = exampleGrid(), S = derive(E, 'slope'), st = stats(S), cls = classShares(S, E, [0, 2, 5, 10, 15, 30, 45, 90.0001]), asp = aspectShares(derive(E, 'aspect'), E);
  check('dem: example mean slope and relief', Math.abs(st.mean - 12.75115) < 1e-4 && Math.abs(stats(E.z).max - stats(E.z).min - 510.4) < 1e-3);
  check('dem: slope classes and aspect shares add to 100 %', Math.abs(cls.reduce((s, c) => s + c.share, 0) - 1) < 1e-12 && Math.abs(cls.reduce((s, c) => s + c.area, 0) - 4.8e6) < 1e-3 && Math.abs(asp.reduce((s, x) => s + x, 0) - 1) < 1e-12);
};
