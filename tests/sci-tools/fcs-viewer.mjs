// #192 flow cytometry FCS viewer. Test files are built here byte by byte (not with the page's own writer), so the
// reader is checked against an independent layout. Reference values come from FlowIO 1.4 (an independent Python FCS
// reader) plus NumPy (matrix inverse, arcsinh, histogram2d, quantile, median) and matplotlib.path (point in polygon),
// run on the same files; the 'A' and mixed byte order files are checked by hand.
import { parseFcs, parseText, invert, compensate, fwd, inv, transform, autoRange, autoRangeFor, axisTicks, hist1d, hist2d, inPoly, gateMasks, gateStats, gateOrder, medianMean, quadrants, writeFcs, exampleFcs, exampleGates } from '../../src/lib/sci/fcs.ts';

/** A tiny FCS builder: header + TEXT (+ optional supplemental TEXT) + DATA, with the data bytes given. */
export function build({ version = 'FCS3.1', delim = '|', kw, data, dataInHeader = true, stext = null }) {
  const enc = (s) => Uint8Array.from(Buffer.from(s, 'utf8'));
  const esc = (s) => s.split(delim).join(delim + delim);
  const mk = (extra) => enc(delim + [...Object.entries(kw), ...Object.entries(extra)].map(([k, v]) => `${esc(k)}${delim}${esc(v)}${delim}`).join(''));
  const st = stext ? enc(delim + Object.entries(stext).map(([k, v]) => `${k}${delim}${v}${delim}`).join('')) : null;
  let t = mk({ $BEGINDATA: '0', $ENDDATA: '0', $BEGINSTEXT: '0', $ENDSTEXT: '0' });
  for (let k = 0; k < 6; k++) {
    const ss = 256 + t.length + 10, se = st ? ss + st.length - 1 : 0, ds = st ? se + 1 + 10 : 256 + t.length + 10, de = ds + data.length - 1;
    const t2 = mk({ $BEGINDATA: String(ds), $ENDDATA: String(de), $BEGINSTEXT: st ? String(ss) : '0', $ENDSTEXT: String(se) });
    const same = t2.length === t.length; t = t2; if (same) break;
  }
  const ss = 256 + t.length + 10, se = st ? ss + st.length - 1 : 0, ds = st ? se + 1 + 10 : 256 + t.length + 10, de = ds + data.length - 1;
  const head = (version + '    ' + [256, 256 + t.length - 1, dataInHeader ? ds : 0, dataInHeader ? de : 0, 0, 0].map((v) => String(v).padStart(8, ' ')).join('')).padEnd(256, ' ');
  const out = new Uint8Array(de + 1); out.set(enc(head), 0); out.set(t, 256); if (st) out.set(st, ss); out.set(data, ds);
  return out;
}
const lcg = (seed) => () => (seed = (Math.imul(seed, 1103515245) + 12345) >>> 0);

/** The test files. Each value is made from a simple integer recipe so that Python can rebuild it too. */
export function fixtures() {
  const F = {};
  { // FCS 2.0, 16-bit integers, big-endian, "/" as delimiter with an escaped "//", 10-bit data with junk in the top bits, one log-amplified channel.
    const n = 50, b = new DataView(new ArrayBuffer(n * 6));
    for (let i = 0; i < n; i++) { b.setUint16(i * 6, ((i * 37) % 1024) | ((i % 3) << 12), false); b.setUint16(i * 6 + 2, (i * 19) % 1024, false); b.setUint16(i * 6 + 4, i * 1000, false); }
    F.int16be = build({ version: 'FCS2.0', delim: '/', data: new Uint8Array(b.buffer), kw: { $BYTEORD: '4,3,2,1', $DATATYPE: 'I', $MODE: 'L', $NEXTDATA: '0', $PAR: '3', $TOT: String(n), $P1B: '16', $P1R: '1024', $P1N: 'FL1', $P1E: '0,0', $P2B: '16', $P2R: '1024', $P2N: 'FL2 LOG', $P2E: '4,0', $P3B: '16', $P3R: '65536', $P3N: 'TIME', $SRC: 'tube A/B' } });
  }
  { // FCS 3.0, 64-bit floats, big-endian, data offsets only in TEXT, a supplemental TEXT segment.
    const n = 40, b = new DataView(new ArrayBuffer(n * 16));
    for (let i = 0; i < n; i++) { b.setFloat64(i * 16, i * 1.5 - 7.25, false); b.setFloat64(i * 16 + 8, Math.sqrt(i) * 1000.125, false); }
    F.doublebe = build({ version: 'FCS3.0', dataInHeader: false, data: new Uint8Array(b.buffer), stext: { EXTRA: 'from supplemental text' }, kw: { $BYTEORD: '4,3,2,1', $DATATYPE: 'D', $MODE: 'L', $NEXTDATA: '0', $PAR: '2', $TOT: String(n), $P1B: '64', $P1R: '1000', $P1N: 'X', $P1E: '0,0', $P2B: '64', $P2R: '1000', $P2N: 'Y', $P2S: 'CD-made-up', $P2E: '0,0', $BEGINANALYSIS: '0', $ENDANALYSIS: '0' } });
  }
  { // FCS 3.1, integers of 8, 16 and 32 bits in one event, little-endian; 32-bit values above 2^31.
    const n = 30, r = lcg(7), b = new DataView(new ArrayBuffer(n * 7));
    for (let i = 0; i < n; i++) { b.setUint8(i * 7, r() % 256); b.setUint16(i * 7 + 1, r() % 65536, true); b.setUint32(i * 7 + 3, r(), true); }
    F.intmixed = build({ data: new Uint8Array(b.buffer), kw: { $BYTEORD: '1,2,3,4', $DATATYPE: 'I', $MODE: 'L', $NEXTDATA: '0', $PAR: '3', $TOT: String(n), $P1B: '8', $P1R: '256', $P1N: 'A8', $P1E: '0,0', $P2B: '16', $P2R: '65536', $P2N: 'B16', $P2E: '0,0', $P3B: '32', $P3R: '4294967296', $P3N: 'C32', $P3E: '0,0', $BEGINANALYSIS: '0', $ENDANALYSIS: '0' } });
  }
  { // FCS 3.1, 32-bit floats, little-endian, form feed as delimiter, a 3 × 3 $SPILLOVER listing the channels out of order.
    const n = 200, r = lcg(11), b = new DataView(new ArrayBuffer(n * 16));
    for (let i = 0; i < n; i++) { b.setFloat32(i * 16, (r() % 100000) / 10 - 500, true); b.setFloat32(i * 16 + 4, (r() % 50000) / 10 - 300, true); b.setFloat32(i * 16 + 8, (r() % 80000) / 10 - 400, true); b.setFloat32(i * 16 + 12, i * 0.5, true); }
    F.spill = build({ delim: '\f', data: new Uint8Array(b.buffer), kw: { $BYTEORD: '1,2,3,4', $DATATYPE: 'F', $MODE: 'L', $NEXTDATA: '0', $PAR: '4', $TOT: String(n), $P1B: '32', $P1R: '262144', $P1N: 'FITC-A', $P1E: '0,0', $P2B: '32', $P2R: '262144', $P2N: 'PE-A', $P2E: '0,0', $P3B: '32', $P3R: '262144', $P3N: 'APC-A', $P3E: '0,0', $P4B: '32', $P4R: '262144', $P4N: 'Time', $P4E: '0,0', $SPILLOVER: '3,APC-A,FITC-A,PE-A,1,0.01,0.12,0.03,1,0.2,0.005,0.08,1', $BEGINANALYSIS: '0', $ENDANALYSIS: '0' } });
  }
  { // FCS 2.0 ASCII, fixed width (5 characters per value).
    const vals = [[12, 30001], [7, 2], [99999, 0], [450, 123]];
    F.ascii = build({ version: 'FCS2.0', data: Uint8Array.from(Buffer.from(vals.map((r) => r.map((v) => String(v).padStart(5, '0')).join('')).join(''))), kw: { $BYTEORD: '1,2,3,4', $DATATYPE: 'A', $MODE: 'L', $PAR: '2', $TOT: '4', $P1B: '5', $P1R: '100000', $P1N: 'P', $P2B: '5', $P2R: '100000', $P2N: 'Q' } });
  }
  { // FCS 2.0, 32-bit integers in the mixed byte order 3,4,1,2: bytes stored as (b2, b3, b0, b1) of a little-endian word.
    const vals = [0x01020304, 0xA0B0C0D0, 1000000], d = [];
    for (const v of vals) { const le = [v & 255, (v >>> 8) & 255, (v >>> 16) & 255, v >>> 24]; d.push(le[2], le[3], le[0], le[1]); }
    F.mixed = build({ version: 'FCS2.0', data: Uint8Array.from(d), kw: { $BYTEORD: '3,4,1,2', $DATATYPE: 'I', $MODE: 'L', $PAR: '1', $TOT: '3', $P1B: '32', $P1R: '4294967296', $P1N: 'W' } });
  }
  return F;
}

export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const F = fixtures();
  const sums = (f) => f.data.map((a) => { let s = 0, w = 0; a.forEach((v, i) => { s += v; w += i * v; }); return [s, w]; });
  const same = (got, want, tol = 1e-12) => got.length === want.length && got.every((g, c) => near(g[0], want[c][0], tol) && near(g[1], want[c][1], tol));
  // Values from FlowIO (as_array, preprocess=True: bit masks from $PnR and $PnE log amplification) on the same bytes.
  const A = parseFcs(F.int16be);
  check('fcs: FCS 2.0 16-bit big-endian integers, 10-bit mask and $P2E 4,0 log decades match FlowIO', A.version === 'FCS2.0' && A.events === 50 && A.byteOrder === 'big-endian' && same(sums(A), [[22797, 628397], [27573.121788616332, 1203399.922990393], [1225000, 40425000]]) && A.data[0][3] === (3 * 37) % 1024 && A.data[0][1] === 37);
  check('fcs: "/" delimiter with an escaped "//" in a value ($SRC tube A/B), channel names', A.text.$SRC === 'tube A/B' && A.channels.map((c) => c.n).join() === 'FL1,FL2 LOG,TIME' && A.channels[1].amp.join() === '4,1');
  check('fcs: log channel by hand (value 19 → 10^(4 × 19 / 1024) = 1.18629)', near(A.data[1][1], 10 ** (4 * 19 / 1024)) && A.data[1][0] === 1);
  const B = parseFcs(F.doublebe);
  check('fcs: FCS 3.0 64-bit big-endian floats, data offsets only in TEXT, match FlowIO', B.events === 40 && B.datatype === 'D' && same(sums(B), [[880, 25155], [165311.89408824936, 3922479.6335537126]]) && B.data[0][0] === -7.25);
  check('fcs: supplemental TEXT keyword read ($BEGINSTEXT)', B.text.EXTRA === 'from supplemental text' && B.channels[1].s === 'CD-made-up');
  const C = parseFcs(F.intmixed);
  check('fcs: 8, 16 and 32-bit unsigned integers in one event match FlowIO (32-bit values above 2^31)', same(sums(C), [[3893, 59141], [942143, 14732796], [65687638913, 955772792103]]) && C.data[2][29] === 3925450565);
  const Sf = parseFcs(F.spill);
  check('fcs: 32-bit little-endian floats with a form-feed delimiter match FlowIO', Sf.events === 200 && same(sums(Sf), [[877421.1964111328, 88166768.6986618], [438724.4002122879, 42995375.20658302], [686574.8006629944, 69178299.7646141], [9950, 1323350]]));
  check('fcs: $SPILLOVER read with its channels out of order (APC-A, FITC-A, PE-A → 2, 0, 1)', Sf.spill && Sf.spill.idx.join() === '2,0,1' && Sf.spill.m[1][2] === 0.2);
  const Si = invert(Sf.spill.m), npInv = [[1.0006121631323228, -0.0004067529118424082, -0.11999210899351025], [-0.02948958610857455, 1.0162721502382555, -0.19971567971462215], [-0.0026438939269756495, -0.08129973825450122, 1.0165772149221373]];
  check('fcs: matrix inverse matches numpy.linalg.inv', Si.every((r, i) => r.every((v, j) => near(v, npInv[i][j], 1e-13))));
  const Sc = compensate(Sf.data, Sf.spill);
  check('fcs: compensation (raw row × inverse spillover) matches NumPy on all 200 events', same(sums({ data: Sc }), [[855751.2807388753, 86077780.3796331], [188378.8999355748, 17798982.557804067], [659960.3677411503, 66506971.440436095], [9950, 1323350]], 1e-11)
    && near(Sc[1][0], -424.5962144181768, 1e-12) && near(Sc[2][123], 2965.0563969665, 1e-12) && Sc[3] === Sf.data[3]);
  check('fcs: a singular spillover matrix is refused', invert([[1, 2], [2, 4]]) === null);
  // Hand-checked files (FlowIO reads neither ASCII data nor the 3,4,1,2 byte order).
  const D = parseFcs(F.ascii);
  check('fcs: FCS 2.0 ASCII fixed-width values (by hand)', D.datatype === 'A' && D.events === 4 && [...D.data[0]].join() === '12,7,99999,450' && [...D.data[1]].join() === '30001,2,0,123');
  const M = parseFcs(F.mixed);
  check('fcs: 32-bit integers in byte order 3,4,1,2 (by hand: 0x01020304, 0xA0B0C0D0, 1000000)', [...M.data[0]].join() === '16909060,2695938256,1000000');
  // Bad files.
  const err = (b) => { try { parseFcs(b); return ''; } catch (e) { return e.message; } };
  check('fcs: not an FCS file', err(Uint8Array.from(Buffer.from('%PDF-1.7' + ' '.repeat(80)))).startsWith('This is not an FCS file'));
  check('fcs: a file cut short is reported', err(F.spill.subarray(0, F.spill.length - 100)).startsWith('The file is cut short'));
  const histo = build({ data: new Uint8Array(8), kw: { $BYTEORD: '1,2,3,4', $DATATYPE: 'I', $MODE: 'C', $PAR: '1', $TOT: '2', $P1B: '32', $P1R: '1024', $P1N: 'H' } });
  check('fcs: histogram-mode files ($MODE C) are refused', err(histo).includes('list-mode'));
  check('fcs: too many events for the page', err(F.spill).length === 0 && (() => { try { parseFcs(F.spill, { maxEvents: 100 }); return false; } catch (e) { return e.message.includes('Up to 100'); } })());
  check('fcs: TEXT with a doubled delimiter inside a value', JSON.stringify(parseText(Uint8Array.from(Buffer.from('|$A|x||y|$b|2|')))) === '{"$A":"x|y","$B":"2"}');

  // Scales and ticks.
  const as = { kind: 'asinh', cof: 150 }, lg = { kind: 'log', cof: 150 }, ln = { kind: 'lin', cof: 150 };
  check('fcs: arcsinh scale asinh(x / cofactor) and back (asinh(1500/150) = 2.998223)', near(fwd(as, 1500), 2.99822295029797) && near(inv(as, fwd(as, -333)), -333) && fwd(lg, 0) === -Infinity && near(fwd(lg, 1000), 3) && fwd(ln, -5) === -5);
  const tk = axisTicks(as, fwd(as, -1000), fwd(as, 262144)).filter((t) => t.label).map((t) => t.label).join(' ');
  check(`fcs: arcsinh axis labels 0 and powers of ten, crowded ones dropped (${tk})`, tk === '−10³ 0 10³ 10⁴ 10⁵');
  check('fcs: linear axis labels in thousands', axisTicks(ln, 0, 262144).map((t) => t.label).join(' ') === '0 50k 100k 150k 200k 250k');
  check('fcs: log axis labels per decade with minor ticks', axisTicks(lg, 1, 5).filter((t) => t.major).map((t) => t.label).join(' ') === '10 10² 10³ 10⁴ 10⁵' && axisTicks(lg, 1, 5).length === 5 + 8 * 4);

  // Polygon test by hand: a U-shaped (concave) polygon.
  const U = [[0, 0], [3, 0], [3, 3], [2, 3], [2, 1], [1, 1], [1, 3], [0, 3]];
  check('fcs: point in a concave polygon (by hand)', inPoly(0.5, 2, U) && inPoly(2.5, 2, U) && !inPoly(1.5, 2, U) && inPoly(1.5, 0.5, U) && !inPoly(4, 1, U));
  check('fcs: gates in tree order (each followed by the gates inside it), orphans dropped', gateOrder([{ id: 'b', parent: 'a' }, { id: 'a', parent: null }, { id: 'c', parent: 'zz' }, { id: 'd', parent: null }, { id: 'e', parent: 'b' }, { id: 'f', parent: 'a' }]).map((g) => g.id).join() === 'a,b,e,f,d');

  // The made-up example, written by the page's writer, read back by FlowIO and gated with NumPy and matplotlib.path.
  const ex = parseFcs(exampleFcs());
  check('fcs: example: 20,000 events, 4 channels, $SPILLOVER 2 × 2 (FlowIO reads the same file)', ex.events === 20000 && ex.channels.map((c) => c.n).join() === 'FSC-A,SSC-A,FITC-A,PE-A' && ex.spill.idx.join() === '2,3' && ex.text.$CYT === 'fibub made-up example');
  for (const [name, d, want, med, mean] of [
    ['raw', ex.data, [17540, 6144, 4979], [89909.9140625, 42050.2109375, 8709.2099609375, 1746.609375], [89983.12947818337, 42138.11379434249, 9237.462079013105, 3320.1472520646284]],
    ['compensated', compensate(ex.data, ex.spill), [17540, 6144, 1754], [89760.4375, 41998.37109375, 7815.268520404965, 5117.519979371709], [90053.3470237671, 41927.99405711053, 8409.034851894914, 5392.413536107003]],
  ]) {
    const cache = new Map(), tv = (c, s) => { const k = c + '/' + s.kind; if (!cache.has(k)) cache.set(k, transform(d[c], s)); return cache.get(k); };
    const G = exampleGates(), m = gateMasks(G, ex.events, tv), st = gateStats(G, m, ex.events);
    check(`fcs: example gates, ${name}: Cells ${want[0]}, A+ ${want[1]}, A+ B+ ${want[2]} events, as NumPy + matplotlib.path`, st.map((s) => s.count).join() === want.join() && st[2].parent === 'Marker A+' && st[2].depth === 2);
    check(`fcs: example percentages, ${name} (A+ ${st[1].ofParent.toFixed(2)} % of Cells, A+ B+ ${st[2].ofParent.toFixed(2)} % of A+)`, near(st[1].ofParent, 35.028506271379705) && near(st[2].ofParent, name === 'raw' ? 81.03841145833333 : 28.548177083333332) && near(st[2].ofAll, name === 'raw' ? 24.895 : 8.77));
    const mm = d.map((a) => medianMean(a, m.get('g3')));
    check(`fcs: medians and means in A+ B+, ${name}, match numpy.median and mean`, mm.every((v, c) => near(v.median, med[c], 1e-12) && near(v.mean, mean[c], 1e-12)));
    const fx = tv(2, as), pe = tv(3, as), cells = m.get('g1');
    const H = hist2d(fx, pe, cells, 64, 48, [-2, 6.5], [-2, 6]);
    let tot = 0, mx = 0, at = -1, nz = 0; H.forEach((v, i) => { tot += v; if (v > mx) { mx = v; at = i; } if (v) nz++; });
    const ref = name === 'raw' ? [330, 49, 28, 29, 28, 1004] : [61, 49, 15, 21, 17, 1263];
    check(`fcs: 2D density bins, ${name}, match numpy.histogram2d (max ${mx}, ${nz} filled bins)`, tot === 17540 && mx === ref[0] && at === ref[2] * 64 + ref[1] && H[10 * 64 + 10] === ref[3] && H[40 * 64 + 50] === ref[4] && nz === ref[5]);
    const h1 = hist1d(fx, null, 100, -2, 6.5);
    check(`fcs: histogram bins, ${name}, match numpy.histogram`, Math.max(...h1) === (name === 'raw' ? 589 : 598) && h1.indexOf(Math.max(...h1)) === 32 && h1[0] === 3 && h1[99] === 0);
    const r = autoRange(pe), rr = name === 'raw' ? [-1.9758693065521784, 5.4707332941905635] : [-2.0129288880014933, 5.40781196878499];
    check(`fcs: axis range from the 0.1 and 99.9 percentiles (numpy.quantile, lower), ${name}`, near(r[0], rr[0], 1e-12) && near(r[1], rr[1], 1e-12));
    if (name === 'compensated') {
      const qs = quadrants(fwd(as, 1500), fwd(as, 1000)).map((pts, i) => ({ id: 'q' + i, name: 'Q' + (i + 1), parent: 'g1', kind: 'rect', x: 2, y: 3, sx: as, sy: as, pts }));
      const qm = gateMasks([G[0], ...qs], ex.events, tv);
      check('fcs: quadrants in Cells (2649, 1754, 4390, 8747) match NumPy', qs.map((q) => gateStats([G[0], ...qs], qm, ex.events).find((s) => s.id === q.id).count).join() === '2649,1754,4390,8747');
    }
  }
  check('fcs: linear axis starts at 0 for all-positive data (FSC-A: 0 to 138168.7)', (() => { const [lo, hi] = autoRangeFor(ex.data[0], ex.data[0], ln); return lo === 0 && near(hi, 138168.70390625, 1e-12); })());
  // Writer round trip with a "|" inside a value.
  const w = parseFcs(writeFcs({ names: ['A|1', 'B'], data: [[1.5, -2, 3e5], [0, 1, 2]], text: { $SRC: 'x|y' } }));
  check('fcs: written FCS 3.1 file reads back (escaped delimiter, float32 values)', w.version === 'FCS3.1' && w.channels[0].n === 'A|1' && w.text.$SRC === 'x|y' && [...w.data[0]].join() === '1.5,-2,300000' && w.events === 3);
};
