// #195 CFU counter. Reference values from an independent Python script (exact Poisson intervals by bisection on the
// Poisson CDF, chi-square tails from closed forms, weighted means by hand, connected components by a NumPy flood fill,
// exact distance maps by brute force on random images), plus textbook Poisson limits (0 → 3.689, 1 → 0.0253–5.572)
// and plates drawn with a known number of colonies.
import { parseDilution, parseVolume, parsePlates, cfu, poissonCI, chi2Sf, gammaP, gammaPinv, label, distanceMap, circleFrom3, detectColonies, examplePlate, tapEdit, roundSig, EXAMPLE_PLATES } from '../../src/lib/sci/cfu.ts';

const CI = [[0, 0.9, 0.0, 2.995732273554], [0, 0.95, 0.0, 3.688879454114], [0, 0.99, 0.0, 5.298317366548], [1, 0.9, 0.051293294388, 4.743864518391], [1, 0.95, 0.025317807984, 5.571643390939], [1, 0.99, 0.005012541824, 7.43012950028], [2, 0.9, 0.355361510699, 6.295793621872], [2, 0.95, 0.242209278544, 7.224687667724], [2, 0.99, 0.103494546748, 9.273792089256], [5, 0.9, 1.97014956806, 10.513034908742], [5, 0.95, 1.623486390118, 11.668332079323], [5, 0.99, 1.077928240652, 14.149759411023], [10, 0.9, 5.425405697091, 16.962219235722], [10, 0.95, 4.795388696132, 18.390356042018], [10, 0.99, 3.716922131467, 21.397827499654], [17, 0.9, 10.832140356276, 25.499230082855], [17, 0.95, 9.903126469607, 27.218646815907], [17, 0.99, 8.250636237772, 30.790589557379], [30, 0.9, 21.593979226995, 40.69050759445], [30, 0.95, 20.240874021421, 42.826865394808], [30, 0.99, 17.76724553937, 47.209326473937], [142, 0.9, 122.984062117664, 163.22148721052], [142, 0.95, 119.605416066804, 167.370075929003], [142, 0.99, 113.18446155619, 175.677211365569], [297, 0.9, 269.23289960161, 326.95162348028], [297, 0.95, 264.179487190005, 332.771193585285], [297, 0.99, 254.488078603386, 344.341841072198], [1000, 0.9, 948.559849383587, 1053.603122133303], [1000, 0.95, 938.973018407665, 1063.952136016304], [1000, 0.99, 920.424046163357, 1084.372868064389]] ;
const CHI = [[0.569023569023569, 1, 0.4506471851015579], [3.84, 1, 0.05004352124870509], [5.99, 2, 0.05003662708658628], [7.81, 3, 0.050106056350005944], [2.0, 4, 0.7357588823428847], [11.07, 5, 0.05000961862240548], [0.1, 1, 0.7518296340458492], [20, 3, 0.00016974243555282646]] ;
const CASES = [[[[1e-05, 0.1, 155], [1e-05, 0.1, 142]], 148499999.99999997, 132089743.5950025, 166385596.7926427, 0.5690235690235691, 0.45064718510155777], [[[1e-05, 0.1, 155], [1e-05, 0.1, 142], [1e-06, 0.1, 17]], 149523809.52380952, 133440944.61613983, 167011030.30227455, 0.859554140127389, 0.650654128839992], [[[0.001, 0.1, 250], [0.0001, 0.1, 30]], 2545454.5454545454, 2256006.4395847237, 2861742.204885884, 0.8928571428571425, 0.3447042220069577], [[[0.01, 1.0, 45], [0.01, 1.0, 61], [0.001, 1.0, 9]], 5476.190476190476, 4521.156869573586, 6573.337315187643, 4.718260869565217, 0.0945023634461885], [[[1e-06, 0.05, 88], [1e-06, 0.1, 160], [1e-07, 0.1, 14]], 1637500000.0, 1445204498.6119912, 1848259828.3624747, 0.8885496183206107, 0.641289164473197]] ;
const IMGS = [[37, 29, "1a380d81d5820b0155219062b040a486cc00220b9086107eac14792442344a0e9bd908263004080246c55c8bb2a0728d8034a8805281116800010201c011500c8a22f1c064f75a111380283e42cd54c880947f49888c361049109ce611547e3a0b125d2041000c3cb2995d11ef963f6e182c32543320c15138a0a90d050b9f14506de62044100", 40, [30, 32, 141], 393.79899, 1.414213562, 402.0], [48, 36, "5495c5a5651082e383146034532c44d747206c2761a1ab0ca09ba48414c508c2b051735b94980ce2368209d85a0bb47e16e501786d878c678cc43fd8a680a703bd847ef200be275112396b3c327755300fb70b65586bd244caf4d23e4d28162c484892089fd6249082044cb090d2615e0082f63701c502eb5d1e99760b6712252486023c219aa140994714812ef4c48c47d280456ec219aa92ab758366415a01f6c657860531886394f53088422926a8c0db8330252308a3b80ab8c141037e818d2e3834f0d19d8f23057d80d4200244bd3ae99801a24e68", 34, [139, 222, 262], 739.076688, 2.236067977, 762.0], [59, 43, "32fd14d636006bf66d9dc95c734bf603e516d20bca9d4dd8e50a171addfb4c0716c4db9519dd2b6cd2d8fb45b6da33f7d872382a4a27c85c8efd24bf9b4d276b9f7a90ce81542c05031c9aa446e10d858cb4bcc459c96db12baea7cdf6f7ba6e1038fce58e286620632b7e8b37c8ac34fc6a7ff574f5af2574dc2507753fe7f5fb89366557ea1d52f7211674aff9363cf2472867f12e96b5ba09e4e476bf507b5ecfd3ed6d4a580f8ed7b417ef5aeace8faf1953feb77a6f5f2ead3f18dacaea62df43e27ba87d8d60ef9fe92f6c563fd6d95a57c27ea5ac54e9744cd206806a8d92250dd0619ffe7439faf66eb95546e7f5b6acb87a0aa478ce954a045d6d55862a5d7faf70ab39d8c6038718cf9d9649874e2a84620e0cb525ee1498a17905b7b6ff7c42165d78b6bfe23d1b06b54f064c7aa384222c99393f200e700", 8, [6, 12, 1307], 1395.142706, 2.236067977, 1480.0], [70, 50, "1abe55fe1ffeef763f2caea3dd2f8a92ad68ff76a38cffe3c89e7dcbfbfe6bd1e67d63dfaef95eeed963d2b47ca0751588fcc4dd7a7ae31b4ffb0b33ac7d3e6c5f9b6c7fcb8a38a6ed79cfe1fe3037c6e52de77594bef71c202c0625baacdf4bd59d1bcbee79fa71954213db4f0b4a8ddaf68ef7ebb75bd5a0a965aa69da66b73a5434e1fc25ebb974fc64fa552eb2ab45fd82fd1ca1712e2dcaa7ee68ac3c68a55d296e64daaab6de243d19e93c4df8699b16d43d52773404ec131f36c37f589fff470fdfbff6ed9b5591199f6cb3ef002df8dc55ef673c6e8f9cab2ddff17cadec639bf963dcdbcdf5dc361715fc769749bd04bc85276fdce34612dd77bebdcd7e56e85f3fb2f3b65a5e467a78696178b59f3ac3afeb8aa5feb7dbd63abd73f960531ae03f5fd35f3b9693fe0ee5d7ecfceb755b9e3bd723f7bb0901f95e9a681be1a8cbb25cda3ebb4d0ad01fffb5e8bc9ee970efeb8a8f7ea04757f4becb3a8fdf02aa8535b30b991434a59578d45d73eecf47153c4877fa7b5a1f03bd0f5de4d5b0c1be7fae9eaaf9e91f76bf81693e7d5fed6bfac662f9bedaea89775fd6e51a2eec3eeafebdf9f77d157ef84b6a0170ea087", 2, [1, 2026], 2144.437266, 3.0, 2334.0]] ;

export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  // Dilutions and volumes as people write them.
  const forms = ['1e-5', '10^-5', '10⁻⁵', '1:100000', '1/100000', '0.00001', '100000', '-5', '1:10^5', '1 : 100 000'];
  check('cfu: ten ways of writing a 10⁻⁵ dilution all read as 1e-5', forms.every((f) => parseDilution(f) === 1e-5));
  check('cfu: 2×10^-3, 1:10 and 0.5 read as 0.002, 0.1 and 0.5; "abc", 0 and −0.1 are refused', parseDilution('2×10^-3') === 0.002 && parseDilution('1:10') === 0.1 && parseDilution('0.5') === 0.5 && [parseDilution('abc'), parseDilution('0'), parseDilution('-0.1')].every(Number.isNaN));
  check('cfu: volumes 0.1, "0.1 mL", "100 µL" and "100ul" are all 0.1 mL', [parseVolume('0.1'), parseVolume('0.1 mL'), parseVolume('100 µL'), parseVolume('100ul')].every((v) => near(v, 0.1, 1e-15)) && Number.isNaN(parseVolume('-1')));
  const ex = parsePlates(EXAMPLE_PLATES);
  check('cfu: example table parses (3 plates, the comment skipped, TNTC kept)', ex.plates.length === 3 && !ex.errors.length && ex.plates[0].tntc && ex.plates[1].count === 155 && ex.plates[2].name === '10⁻⁶ plate');
  const bad = parsePlates('dilution, mL, colonies\n1e-5, 0.1, 12.5\nfoo, 0.1, 3\n1e-5, , 3\n1e-6\t0.1\t40');
  check('cfu: a header line is skipped and bad rows get plain messages', bad.plates.length === 1 && bad.errors.length === 3 && bad.errors[0].includes('whole number') && bad.errors[1].includes('not a dilution') && bad.errors[2].includes('volume'));
  // Exact Poisson limits.
  check('cfu: textbook Poisson limits (0 → 0 to 3.689; 1 → 0.0253 to 5.572; 10 → 4.795 to 18.39)', near(poissonCI(0)[1], 3.68888, 1e-5) && near(poissonCI(1)[0], 0.025318, 1e-4) && near(poissonCI(1)[1], 5.57164, 1e-5) && near(poissonCI(10)[0], 4.79539, 1e-5) && near(poissonCI(10)[1], 18.3904, 1e-5));
  check(`cfu: ${CI.length} exact Poisson intervals (counts 0 to 1000, 90/95/99 %) match the Python bisection`, CI.every(([k, c, lo, hi]) => near(poissonCI(k, c)[0], lo, 1e-9) && near(poissonCI(k, c)[1], hi, 1e-9)));
  check('cfu: chi-square tail matches the closed forms (8 values, df 1 to 5)', CHI.every(([x, d, p]) => near(chi2Sf(x, d), p, 1e-10)));
  check('cfu: incomplete gamma and its inverse round-trip', [0.5, 1, 3.5, 40, 300].every((a) => [0.001, 0.3, 0.975].every((p) => near(gammaP(a, gammaPinv(a, p)), p, 1e-10))));
  // Weighted mean, interval and agreement test on worked cases.
  let ok = true;
  for (const [ps, N, lo, hi, chi, p] of CASES) {
    const r = cfu(ps.map(([dil, vol, count], i) => ({ name: `P${i}`, dil, vol, count, tntc: false, line: i + 1 })), { lo: 1, hi: 1e9 });
    ok = ok && near(r.est, N, 1e-12) && near(r.ci[0], lo, 1e-8) && near(r.ci[1], hi, 1e-8) && near(r.dispersion.chi2, chi, 1e-10) && near(r.dispersion.p, p, 1e-9);
  }
  check(`cfu: ${CASES.length} worked cases (CFU = ΣC / Σ V·d, 95 % interval, chi-square and p) match Python`, ok);
  // The page's example: three plates plus the photo plate (142 colonies, 10⁻⁵, 0.1 mL).
  const all = [...ex.plates, { name: 'Photo', dil: 1e-5, vol: 0.1, count: 142, tntc: false, line: 0, photo: true }];
  const R = cfu(all, { lo: 30, hi: 300 });
  check('cfu: example → 1.485 × 10⁸ CFU/mL (95 % 1.321 to 1.664 × 10⁸) from the two 10⁻⁵ plates', near(R.est, 1.485e8, 1e-12) && near(R.ci[0], 132089743.5950025, 1e-8) && near(R.ci[1], 166385596.7926427, 1e-8) && R.plates.map((p) => p.status).join() === 'tntc,countable,low,countable' && R.total === 297 && roundSig(R.est, 2) === 1.5e8);
  check('cfu: 155 colonies on 10⁻⁶ mL rounds to 1.6 × 10⁸ (not 1.5 × 10⁸ from floating-point 154999999.99999997)', roundSig(155 / (0.1 * 1e-5), 2) === 1.6e8 && roundSig(1.449e8, 2) === 1.4e8);
  const R2 = cfu(all, { lo: 10, hi: 300, conf: 0.95 });
  check('cfu: range 10 to 300 also uses the 10⁻⁶ plate (1.495 × 10⁸)', near(R2.est, 149523809.52380952, 1e-12) && R2.plates.filter((p) => p.used).length === 3);
  const pl = (rows) => rows.map(([dil, vol, count], i) => ({ name: `P${i}`, dil, vol, count, tntc: count === 'T', line: i + 1, ...(count === 'T' ? { count: NaN } : {}) }));
  const low = cfu(pl([[1e-1, 0.1, 12], [1e-2, 0.1, 1]]), { lo: 30, hi: 300 });
  check('cfu: all plates below the range → estimate from the most concentrated plate (12 → 1200 CFU/mL)', low.basis === 'below' && near(low.est, 1200) && low.plates[0].used && !low.plates[1].used);
  const high = cfu(pl([[1e-3, 0.1, 'T'], [1e-4, 0.1, 420], [1e-4, 0.1, 380]]), { lo: 30, hi: 300 });
  check('cfu: all plates above the range → estimate from the most diluted plates, pooled (4 × 10⁷)', high.basis === 'above' && near(high.est, 4e7) && high.plates.filter((p) => p.used).length === 2);
  const zero = cfu(pl([[1, 1, 0]]), { lo: 30, hi: 300 });
  check('cfu: no colonies on 1 mL of neat sample → 0, with an upper limit of 3.69 CFU/mL', zero.basis === 'below' && zero.est === 0 && near(zero.ci[1], 3.688879454114, 1e-9));
  check('cfu: only TNTC plates → no result', cfu(pl([[1e-2, 0.1, 'T']]), { lo: 30, hi: 300 }).basis === 'none');
  const disagree = cfu(pl([[1e-5, 0.1, 60], [1e-5, 0.1, 200]]), { lo: 30, hi: 300 });
  check('cfu: plates that disagree (60 and 200 on the same dilution) fail the agreement test (p < 0.001)', disagree.dispersion.p < 1e-3 && disagree.dispersion.df === 1);
  // Image helpers against NumPy / brute force.
  const unhex = (hx, n) => { const b = new Uint8Array(n); for (let i = 0; i < n; i++) b[i] = (parseInt(hx[i >> 2], 16) >> (3 - (i & 3))) & 1; return b; };
  let okL = true, okD = true;
  for (const [w, h, hx, n, big3, sum, max, sum2] of IMGS) {
    const bin = unhex(hx, w * h), L = label(bin, w, h);
    const sizes = new Array(L.n + 1).fill(0); for (const v of L.lab) if (v) sizes[v]++;
    const s = sizes.slice(1).sort((a, b) => a - b);
    okL = okL && L.n === n && s.slice(-3).join() === big3.join();
    const e = distanceMap(bin, w, h); let t = 0, m = 0, t2 = 0; for (const v of e) { t += v; t2 += v * v; m = Math.max(m, v); }
    okD = okD && near(t, sum, 1e-6) && near(m, max, 1e-6) && near(t2, sum2, 1e-6);
  }
  check('cfu: connected groups (8 neighbours) match a NumPy flood fill on 4 random images', okL);
  check('cfu: distance map matches brute-force Euclidean distances on 4 random images', okD);
  const c3 = circleFrom3({ x: 10, y: 50 }, { x: 50, y: 10 }, { x: 90, y: 50 }), c4 = circleFrom3({ x: 0, y: 0 }, { x: 6, y: 0 }, { x: 0, y: 8 });
  check('cfu: circle through three rim points (centre 50, 50, radius 40; right triangle → radius 5)', near(c3.cx, 50) && near(c3.cy, 50) && near(c3.r, 40) && near(c4.r, 5) && circleFrom3({ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }) === null);
  // Colonies on drawn plates with known counts.
  const E = examplePlate(), D = detectColonies(E.px, E.w, E.h, E.circle);
  const hit = E.discs.every((d) => D.points.some((p) => Math.hypot(p.x - d.x, p.y - d.y) < d.r + 1));
  check(`cfu: example plate has 142 colonies (11 touching pairs); found ${D.points.length}, every colony marked`, E.count === 142 && D.points.length === 142 && hit && D.lighter && D.blobs.filter((b) => b.n === 2).length === 11);
  check('cfu: without splitting, the 11 touching pairs count as one each (131)', detectColonies(E.px, E.w, E.h, E.circle, { split: false }).points.length === 131);
  const inv = E.px.map((v, i) => (i % 4 === 3 ? v : 255 - v)), Di = detectColonies(inv, E.w, E.h, E.circle);
  check('cfu: dark colonies on light agar (the photo inverted) are found the same way (142, auto picks darker)', Di.points.length === 142 && !Di.lighter);
  let okS = true; const got = [];
  for (const [s, p, seed] of [[60, 5, 1], [250, 20, 2], [200, 30, 3], [20, 0, 4], [0, 0, 5]]) { const e = examplePlate(s, p, seed), d = detectColonies(e.px, e.w, e.h, e.circle); got.push(`${d.points.length}/${e.count}`); okS = okS && d.points.length === e.count; }
  check(`cfu: five more drawn plates (0 to 290 colonies) counted exactly (${got.join(', ')})`, okS);
  // A softer photo: 3×3 blur.
  const bl = new Uint8ClampedArray(E.px.length);
  for (let y = 0; y < E.h; y++) for (let x = 0; x < E.w; x++) for (let k = 0; k < 4; k++) { let t = 0, c = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < E.w && Y < E.h) { t += E.px[4 * (Y * E.w + X) + k]; c++; } } bl[4 * (y * E.w + x) + k] = t / c; }
  const Db = detectColonies(bl, E.w, E.h, E.circle);
  check(`cfu: a slightly blurred photo still gives 142 ± 2 (${Db.points.length})`, Math.abs(Db.points.length - 142) <= 2);
  const big = detectColonies(E.px, E.w, E.h, E.circle, { minMm: 1.5 });
  check('cfu: a larger smallest-colony size leaves the small ones out and says how many', big.points.length < 142 && big.tooSmall > 0 && big.points.length + big.tooSmall >= 131);
  check('cfu: a typed threshold is used instead of the automatic one', detectColonies(E.px, E.w, E.h, E.circle, { threshold: 30 }).threshold === 30 && D.threshold === D.autoThreshold);
  const t1 = tapEdit(D.points, 5, 5, 6), t2 = tapEdit(t1.points, 6, 6, 6);
  check('cfu: a tap away from colonies adds one; a tap on it removes it again', t1.added && t1.points.length === 143 && !t2.added && t2.points.length === 142);
};
