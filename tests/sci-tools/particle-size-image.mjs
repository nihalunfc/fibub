// #854 particle size from an image: maths checks. The fixture is a 160 × 120 mask (a disc, two touching discs, an
// ellipse, a ring, a disc cut by the edge and a speck) made with NumPy. Expected values come from SciPy
// (binary_fill_holes, distance_transform_edt) and scikit-image 0.26 (label, regionprops: area, centroid, perimeter,
// equivalent diameter, axis lengths, feret_diameter_max; h_maxima + watershed for the split), and for the Feret
// diameters of the outline hull from SciPy's ConvexHull with a brute-force caliper search.
import { inflateSync } from 'node:zlib';
import { particleMask, particleLabels, measure, hull, feret, dValues, bins, exampleParticles } from '../../src/lib/sci/particles.ts';
import { fillHoles, label, edt, distPeaks } from '../../src/lib/sci/micro.ts';
const REF = {"w":160,"h":120,"mask":"eNrtmssSwyAMA63//+meO02YGGSsUO3ZU7aElzERxhhjuoG4HiCuJy/o8We8IvGmO1QnPb5R62wgKbi3r4GcYL6v2XrDZmcGA1tv0Gx6MJTo3TY7jkS33yC0pEOBnOBtZNEnT/rdhlaNSZJf2aTh+GVX0GP8kk0AQoJr/We/w/2gs3+0LDDxSr94tHts2EEy579SP8b5uVKPkX/U+hHyt+JD/3r+W52TLP/2jpQJnL/oGyZjjDHGGGOMMcackK2f9x6kzU7NsPY2ukaPfqHK1qMIMn63zI9TCioqKNGqVYPCUqHd80v9n3iCILHgdxG97MesSF6+eSIWLlYF/88PzJL9deA2QX/fF85f+fVPZP+A8P478exh4/nleRe3nP+mPtO+8/PuNGXpvY9e/taQ5qUGcUsamphiTWny5Johd3+lfVPT3H/2s1/YjygY4oIR2oahi582GmOMMB9DPAtO","nFilled":3006,"n":6,"rows":[{"area":13,"cx":140.0,"cy":10.0,"perim":11.313708498984761,"d":4.068428945128219,"feretSk":5.0,"feretMax":5.0,"feretMin":3.5355339059327373,"major":4.1509961733021665,"minor":4.1509961733021665},{"area":613,"cx":30.0,"cy":30.0,"perim":90.91168824543142,"d":27.937355653723827,"feretSk":29.546573405388315,"feretMax":29.0,"feretMin":27.577164466275356,"major":27.940743636766904,"minor":27.940743636766904},{"area":811,"cx":84.66707768187423,"cy":31.842170160295932,"perim":131.1959594928933,"d":32.13405157741889,"feretSk":45.70557952810576,"feretMax":45.17742799230607,"feretMin":24.320155367134173,"major":48.587217951768636,"minor":22.98083816085423},{"area":709,"cx":110.0,"cy":85.0,"perim":98.9116882454314,"d":30.045412914740087,"feretSk":31.38470965295043,"feretMax":31.0,"feretMin":30.398000946418527,"major":30.05063897290423,"minor":30.05063897290423},{"area":615,"cx":40.0,"cy":85.0,"perim":105.25483399593904,"d":27.982893345973448,"feretSk":45.044422518220834,"feretMax":45.0,"feretMin":18.905706613989793,"major":44.07650407396342,"minor":17.770350752128067},{"area":245,"cx":153.0122448979592,"cy":100.0,"perim":59.798989873223334,"d":17.66192765414112,"feretSk":21.37755832643195,"feretMax":21.0,"feretMin":15.0,"major":20.867707696098197,"minor":15.343603632398583}],"edtMax":15.033296378372908,"edtSum":13804.104325037972,"edtAt":[14.035668847618199,9.055385138137417,15.033296378372908],"nMarkers":7,"wsAreas":[13,245,370,441,613,615,709],"pct":[10.86517829963467,27.96012449984864,31.089732246079485]};
const close = (a, b, t) => Math.abs(a - b) <= t;
export default async (check) => {
  const { w, h } = REF, m = new Uint8Array(inflateSync(Buffer.from(REF.mask, 'base64'))), R = { x0: 0, y0: 0, x1: w, y1: h };
  const f = fillHoles(m, w, h);
  check('particles: fill holes = scipy binary_fill_holes', f.reduce((s, v) => s + v, 0) === REF.nFilled);
  const d = edt(f, w, h); let mx = 0, sum = 0; for (const v of d) { mx = Math.max(mx, v); sum += v; }
  check('particles: distance transform = scipy distance_transform_edt', close(mx, REF.edtMax, 1e-5) && close(sum, REF.edtSum, 1e-2) && close(d[30 * w + 30], REF.edtAt[0], 1e-5) && close(d[85 * w + 40], REF.edtAt[1], 1e-5) && close(d[85 * w + 110], REF.edtAt[2], 1e-5));
  const L = label(f, w, h, 8), P = measure(L.lab, L.n, w, h, R);
  check(`particles: ${L.n} particles = scikit-image label`, L.n === REF.n && P.length === REF.n);
  P.forEach((p, i) => {
    const r = REF.rows[i];
    check(`particles: #${i + 1} area, centroid, perimeter, diameter, axes = regionprops`, p.area === r.area && close(p.cx, r.cx, 1e-9) && close(p.cy, r.cy, 1e-9) && close(p.perim, r.perim, 1e-9) && close(p.d, r.d, 1e-9) && close(p.major, r.major, 1e-9) && close(p.minor, r.minor, 1e-9));
    check(`particles: #${i + 1} Feret max ${p.feretMax.toFixed(3)} and min ${p.feretMin.toFixed(3)} = SciPy hull (skimage max ${r.feretSk.toFixed(3)})`, close(p.feretMax, r.feretMax, 1e-9) && close(p.feretMin, r.feretMin, 1e-9) && Math.abs(p.feretMax - r.feretSk) < 1);
  });
  { const mk = distPeaks(d, f, w, h, 2), S = particleLabels(f, w, h, 2), a = new Array(S.n + 1).fill(0); for (const v of S.lab) a[v]++;
    const areas = a.slice(1).sort((x, y) => x - y);
    check(`particles: h-maxima markers (${mk.n}) and watershed split areas ${areas} = scikit-image ${REF.wsAreas}`, mk.n === REF.nMarkers && S.n === REF.wsAreas.length && areas.every((x, i) => Math.abs(x - REF.wsAreas[i]) <= Math.max(2, 0.01 * x))); }
  { const v = dValues(P.map((p) => p.d), [0.1, 0.5, 0.9]); check('particles: D10, D50, D90 by number = numpy.percentile', v.every((x, i) => close(x, REF.pct[i], 1e-9))); }
  // By area, by hand: diameters 1, 2, 3 with areas 1, 1, 8: shares 10 %, 20 %, 100 %.
  check('particles: D by area weights the big ones', JSON.stringify(dValues([3, 1, 2], [0.1, 0.15, 0.5, 0.9], [8, 1, 1])) === '[1,2,3,3]');
  check('particles: no particles give no D values', dValues([], [0.5]).every((x) => Number.isNaN(x)));
  check('particles: histogram bins', JSON.stringify(bins([0, 1, 1.5, 2, 9.9, 10, 11], 0, 10, 5)) === '[3,1,0,0,2]');
  // Hull and calipers on a 4 × 2 rectangle turned 30°: Feret max = diagonal √20, min = 2, along either diagonal (30° ± atan(2/4)).
  { const c = Math.cos(Math.PI / 6), s = Math.sin(Math.PI / 6), pts = [[0, 0], [4, 0], [4, 2], [0, 2], [2, 1], [1, 1]].map(([x, y]) => [x * c - y * s, -(x * s + y * c)]);
    const H = hull(pts), F = feret(H); check('particles: hull drops inside points; rotated rectangle Feret', H.length === 4 && close(F.max, Math.sqrt(20), 1e-12) && close(F.min, 2, 1e-12) && [30 + (Math.atan(0.5) * 180) / Math.PI, 30 - (Math.atan(0.5) * 180) / Math.PI].some((a) => close(F.angle, a, 1e-9))); }
  // Thresholds: bright or dark particles, specks removed, holes filled only inside the area.
  { const g = new Float32Array(w * h).map((_, i) => (m[i] ? 200 : 40));
    const a = particleMask(g, w, h, R, 120, false, true, 20), b = particleMask(g.map((v) => 255 - v), w, h, R, 120, true, false, 0);
    const n = (x) => x.reduce((s, v) => s + v, 0);
    check('particles: bright mask with holes filled and the speck removed', n(a) === REF.nFilled - 13);
    check('particles: dark particles on a light background, holes kept', n(b) === m.reduce((s, v) => s + v, 0)); }
  // Edge particles: the disc cut by the image edge (and, with a smaller area, more of them).
  { check('particles: one particle touches the image edge', P.filter((p) => p.edge).length === 1 && P.find((p) => p.edge).area === 245);
    const P2 = measure(L.lab, L.n, w, h, { x0: 0, y0: 0, x1: 100, y1: 120 }); check('particles: area edge at x = 100 touches more', P2.filter((p) => p.edge).length >= 3); }
  // Made-up example: the measured diameters of separate discs (not cut by the edge) match the drawn ones.
  { const e = exampleParticles(500, 400, 60, 30, 0.3, 7), g = new Float32Array(e.w * e.h).map((_, i) => e.px[4 * i]);
    const mk = particleMask(g, e.w, e.h, { x0: 0, y0: 0, x1: e.w, y1: e.h }, 125, false, true, 10), S = particleLabels(mk, e.w, e.h, 2), Q = measure(S.lab, S.n, e.w, e.h, { x0: 0, y0: 0, x1: e.w, y1: e.h });
    let ok = 0, tot = 0;
    for (const q of e.discs) { const lone = e.discs.every((o) => o === q || Math.hypot(o.x - q.x, o.y - q.y) > o.r + q.r + 2) && q.x - q.r > 1 && q.y - q.r > 1 && q.x + q.r < e.w - 2 && q.y + q.r < e.h - 2; if (!lone) continue; tot++; const p = Q.find((p) => Math.hypot(p.cx - q.x, p.cy - q.y) < 1); if (p && Math.abs(p.d - 2 * q.r) < 1.2) ok++; }
    check(`particles: example lone discs measured to ±1.2 px (${ok} of ${tot})`, tot > 20 && ok === tot);
    check(`particles: watershed splits touching discs (${S.n} found, ${e.discs.length} drawn)`, Math.abs(S.n - e.discs.length) <= 2); }
};
