// #861 AFM roughness: levelling, areal and profile parameters, line profiles, step heights and histogram checked
// against an independent NumPy/SciPy script (numpy.linalg.lstsq surface fits, scipy.stats skew/kurtosis,
// scipy.ndimage.map_coordinates bilinear profiles, numpy.histogram) on the made-up example surface; the PNG reader
// against PNGs written in Python with every row filter (0 to 4) and checked with Pillow.
import { exampleSurface, levelPoly, flattenLines, areal, rowsMean, profileParams, lineProfile, stepHeight, regionValues, histogram, decodePng, fromMatrix, fromXYZ, numberRows, readHeader, afmhot } from '../../src/lib/sci/afm.ts';

const inflate = async (d) => new Uint8Array(await new Response(new Blob([d]).stream().pipeThrough(new DecompressionStream('deflate'))).arrayBuffer());
const b64 = (s) => new Uint8Array(Buffer.from(s, 'base64'));

export default async (check) => {
  const rel = (a, b, tol) => Math.abs(a - b) <= tol * Math.max(1e-9, Math.abs(b));
  const same = (a, b, tol = 1e-8) => Object.keys(b).every((k) => rel(a[k], b[k], tol));
  const s = exampleSurface(), RA = { x0: 5, y0: 5, x1: 70, y1: 122 }, RB = { x0: 95, y0: 5, x1: 122, y1: 122 };
  const L1A = { ...s, z: levelPoly(s, 1, RA).z }, L2 = { ...s, z: levelPoly(s, 2).z }, L3A = { ...s, z: levelPoly(s, 3, RA).z };
  check('afm: plane fitted to region A, areal parameters match numpy/scipy', same(areal(L1A.z), {"Sa": 8.612061068479605, "Sq": 9.308254863397805, "Ssk": 0.8048464241025526, "Sku": 1.6659624205887582, "Sp": 15.95328694083652, "Sv": 8.266291619520317, "Sz": 24.219578560356837}));
  check('afm: 2nd-order surface over the whole image matches numpy', same(areal(L2.z), {"Sa": 3.058396823018591, "Sq": 4.236487658263433, "Ssk": 0.46811597355438916, "Sku": 3.390362043096367, "Sz": 22.421566307524984}));
  check('afm: 3rd-order surface fitted to region A matches numpy', same(areal(L3A.z), {"Sa": 10.247094600526463, "Sq": 11.124846695801095, "Sz": 31.752046850783522}));
  check('afm: mean row parameters (Ra, Rq, Rsk, Rku, Rt, Rz) match numpy', same(rowsMean(L1A), {"Ra": 4.772151100683641, "Rq": 5.557231412581994, "Rsk": -0.3807756000740106, "Rku": 1.973335563537577, "Rt": 20.026492428891203, "Rz": 8.252795169274709}));
  check('afm: diagonal line profile parameters match scipy map_coordinates', same(profileParams(lineProfile(L1A, 3.5, 10.2, 120.7, 100.9).z), {"Ra": 4.774883959494694, "Rq": 5.590934476568179, "Rsk": -0.3123973958252981, "Rku": 1.989453218792138, "Rt": 20.39576285282069, "Rz": 7.9468128671408635}));
  { const lp = lineProfile(s, 3.5, 10.2, 120.7, 100.9); check('afm: profile length and sample count', lp.z.length === 150 && rel(lp.dist[149], 5.83452479499052, 1e-12) && rel(lp.z[50], 51.883932750777, 1e-12)); }
  { const st = stepHeight(L1A, RA, RB); check('afm: step height and region SDs match numpy', rel(st.step, 20.0929649342224, 1e-9) && rel(st.A.sd, 0.5738329476528268, 1e-9) && rel(st.B.sd, 0.5690056566951242, 1e-9));
    check('afm: step height within 0.2 nm of the made-up 20 nm', Math.abs(st.step - 20) < 0.2); }
  check('afm: region A roughness (Sq) matches numpy and the made-up 0.6 nm', rel(areal(regionValues(L1A, RA)).Sq, 0.5737961056286064, 1e-9) && Math.abs(areal(regionValues(L1A, RA)).Sq - 0.6) < 0.05);
  check('afm: line-by-line flattening (orders 0, 1, 2) matches numpy polyfit', same(areal(flattenLines(s, 0)), {"Sa": 11.177334152221736, "Sq": 12.246068398533348}) && same(areal(flattenLines(s, 1)), {"Sa": 4.772151100683645, "Sq": 5.5583301392907725, "Ssk": -0.3803386909027982, "Sku": 1.97473428302121}) && same(areal(flattenLines(s, 2)), {"Sa": 3.053553824225887, "Sq": 4.231679939453701}));
  check('afm: histogram counts equal numpy.histogram', JSON.stringify(histogram(L1A.z, 40).count) === '[64,903,3240,4474,2134,420,28,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,40,326,1366,2031,1061,260,34]');
  // Exact cases: a pure plane levels to zero; a sine profile has Ra = 2A/π, Rq = A/√2, Rku = 1.5.
  { const p = { nx: 20, ny: 10, z: new Float64Array(200).map((_, k) => 3 + 0.5 * (k % 20) - 0.2 * Math.floor(k / 20)), dx: 1, dy: 1 }; check('afm: a tilted plane levels to zero', areal(levelPoly(p, 1).z).Sq < 1e-12); }
  { const wave = Array.from({ length: 1001 }, (_, i) => 2 * Math.cos((2 * Math.PI * 10 * i) / 1000)), pp = profileParams(wave); check('afm: cosine wave Ra = 2A/π, Rq = A/√2, Rku = 1.5', rel(pp.Ra, 4 / Math.PI, 2e-3) && rel(pp.Rq, Math.SQRT2, 2e-3) && rel(pp.Rku, 1.5, 2e-3) && Math.abs(pp.Rsk) < 3e-3 && rel(pp.Rz, 4, 1e-3)); }
  // PNG reader: 16-bit grey and 8-bit RGB, with every row filter.
  { const g = await decodePng(b64('iVBORw0KGgoAAAANSUhEUgAAAAkAAAAHEAAAAACvYOT/AAAAkElEQVR4nAGFAHr/APHloAavJuWvlArGk9VqOacONwFM1/wjl6cKABi4fplTSk9qq2YC0qUv0PJiZPJWGshU5vMgmTGCA2KyBorc9S7DF2gY72GMLzflQwRCVewCuCOm33qowMRW7Fussn4AnM8dXQs/cdsJIiQ9g8/4Y3dZAc72HNXoA89Gz+sTnsGNOwni61TLP4Nc9ECWAAAAAElFTkSuQmCC'), inflate); check('afm: 16-bit grey PNG decodes exactly (filters 0–4)', g.w === 9 && g.h === 7 && g.bits === 16 && JSON.stringify([...g.v]) === '[61925,40966,44838,58799,37898,50835,54634,14759,3639,19671,18682,57249,59809,345,32754,53820,8614,52236,7804,30666,53507,19859,22387,18246,47151,16703,64910,29168,31335,33066,38177,36274,33387,65241,52931,51947,45893,40775,22349,64812,30554,14110,55383,10499,56193,40143,7517,2879,29147,2338,9277,33743,63587,30553,52982,60107,53966,41236,28927,33693,17450,32563,24862]'); }
  { const g = await decodePng(b64('iVBORw0KGgoAAAANSUhEUgAAAAUAAAAGCAIAAACEmcMcAAAAa0lEQVR4nAFgAJ//AD/+Axgx+LHhM7hefQCe1AGpJ4ib0Fnriw+pM7MyCNYCbhcCdoq7sC1szOR4BezqA44z9H34ZuTZ/XXnQOwU9QQKOnTOmr98Na4TDJYLzWAA8zcBqwNMf98XqYgh2Nh7faotQe3ylfQAAAAASUVORK5CYII='), inflate); check('afm: 8-bit RGB PNG decodes (first channel)', g.w === 5 && g.h === 6 && g.colour && JSON.stringify([...g.v]) === '[63,24,177,184,0,169,68,47,216,10,23,186,223,164,15,153,38,102,250,112,163,244,112,13,24,243,171,127,169,216]'); }
  // Text readers.
  check('afm: Gwyddion-style header', JSON.stringify(readHeader('# Channel: Height\n# Width: 5.000 µm\n# Height: 2500 nm\n# Value units: m\n1 2 3')) === JSON.stringify({ width: 5, height: 2.5, zScale: 1e9 }));
  { const m = fromMatrix(numberRows('# c\n1 2 3\n4,5,6\n7;8;9')); check('afm: matrix reader', m.nx === 3 && m.ny === 3 && m.z[5] === 6); }
  { const pts = []; for (const y of [0, 0.5, 1]) for (const x of [0, 2, 4, 6]) pts.push([x, y, x * 10 + y]); pts.reverse(); const g = fromXYZ(pts); check('afm: XYZ grid in any order', g.nx === 4 && g.ny === 3 && g.dx === 2 && g.dy === 0.5 && g.z[1 * 4 + 2] === 40.5); }
  let msg = ''; try { fromMatrix([[1, 2, 3], [1, 2], [1, 2, 3]]); } catch (e) { msg = e.message; }
  check('afm: ragged matrix is an error', msg.includes('Row 2'));
  check('afm: afmhot ends', afmhot(0).join() === '0,0,0' && afmhot(1).join() === '255,255,255' && afmhot(0.5).join() === '255,128,0');
};
