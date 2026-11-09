// #932 Lens ray tracer: exact 3-D rays checked against an independent NumPy tracer (centre-based sphere
// intersection, angle-form Snell's law) and paraxial results against the thick-lens lensmaker's equation.
import { parseSurfaces, paraxial, traceRay, rayFor, spot, lsa, chiefHeight, bestFocus, lastVertex, pupilGrid } from '../../src/lib/sci/phrays.ts';
export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  const pc = { n0: 1, surfaces: parseSurfaces('51.7 5 1.517 12.5\ninf 95 1 12.5') };
  const fl = { n0: 1, surfaces: parseSurfaces('flat 5 1.517 12.5\n-51.7 95 1 12.5') };
  check('rays: parse two surfaces, flat radius', pc.surfaces.length === 2 && pc.surfaces[1].c === 0 && fl.surfaces[0].c === 0);
  const p1 = paraxial(pc, Infinity, 10, 5), p2 = paraxial(fl, Infinity, 10, 5);
  check('rays: plano-convex EFL = R/(n−1)', near(p1.efl, 51.7 / 0.517, 1e-9) && near(p2.efl, 100, 1e-9));
  check('rays: paraxial focus vs NumPy (curved side first)', near(lastVertex(pc) + p1.bfl, 101.7040210941564, 1e-6));
  check('rays: paraxial focus vs NumPy (flat side first)', near(lastVertex(fl) + p2.bfl, 104.99999999956945, 1e-6));
  const z1 = lastVertex(pc) + p1.imageDist, z2 = lastVertex(fl) + p2.imageDist;
  check('rays: LSA at h 10, 7, 5 vs NumPy (curved first)', near(lsa(pc, Infinity, 10, z1), -1.0984681060862584, 1e-6) && near(lsa(pc, Infinity, 7, z1), -0.5351678608878103, 1e-6) && near(lsa(pc, Infinity, 5, z1), -0.272317762890637, 1e-6));
  check('rays: LSA at h 10 vs NumPy (flat first, 4× worse)', near(lsa(fl, Infinity, 10, z2), -4.379561573693707, 1e-6));
  const ref = [[0, 0, 0, 8.7482443311067], [0, 10, 0, 8.454544282596618], [0, -10, 0, 8.960917527715074], [10, 0, -0.17596052131851359, 8.734690848619923], [3, -7, -0.03281271016752996, 8.870520138278142]];
  check('rays: five 5° rays (meridional and skew) vs NumPy', ref.every(([px, py, x, y]) => { const r = rayFor(Infinity, 5, px, py), h = traceRay(pc, r.start, r.dir, z1); return h.ok && near(h.end[0], x, 1e-6) && near(h.end[1], y, 1e-6); }));
  const ref2 = [[10, 0, -0.5147860340630217, 8.868341942853942], [3, -7, -0.14831482193117607, 9.208926515968928]];
  check('rays: skew rays vs NumPy (flat first)', ref2.every(([px, py, x, y]) => { const r = rayFor(Infinity, 5, px, py), h = traceRay(fl, r.start, r.dir, z2); return h.ok && near(h.end[0], x, 1e-6) && near(h.end[1], y, 1e-6); }));
  // Thick biconvex lens: lensmaker's equation and finite object.
  const bc = { n0: 1, surfaces: parseSurfaces('60 8 1.6 30\n-80 50 1 30') };
  const pb = paraxial(bc, Infinity, 5, 0);
  check('rays: thick-lens lensmaker EFL 58.394 mm', near(pb.efl, 58.3941605839416, 1e-9));
  check('rays: thick-lens BFL vs NumPy', near(pb.bfl, 55.47445255454599, 1e-6));
  const pf = paraxial(bc, 300, 5, 3), zf = 8 + pf.imageDist;
  check('rays: finite object image plane vs NumPy', near(zf, 77.46107784430887, 1e-6));
  check('rays: finite object chief ray vs NumPy', near(chiefHeight(bc, 300, 3, zf), 3.765102002953317, 1e-6));
  { const r = rayFor(300, 3, 4, 6), h = traceRay(bc, r.start, r.dir, zf); check('rays: finite object skew ray vs NumPy', near(h.end[0], -0.07268719229749276, 1e-6) && near(h.end[1], 3.65211658007855, 1e-6)); }
  { const tiny = paraxial(bc, 300, 5, 0.01), hObj = -300 * Math.tan(0.01 * Math.PI / 180); check('rays: paraxial magnification matches a near-axis real chief ray', near(chiefHeight(bc, 300, 0.01, zf) / hObj, tiny.mag, 1e-5) && tiny.mag < 0); }
  check('rays: paraxial chief height ≈ f tan θ at infinity', near(paraxial(pc, Infinity, 10, 0.01).chiefH, 100 * Math.tan(0.01 * Math.PI / 180), 1e-7));
  check('rays: Petzval sum of a thin-ish lens ≈ 1/(n f)', near(p1.petzval, 1 / (1.517 * 100), 1e-12));
  check('rays: hexapolar pupil grid 1 + 6 + 12 + 18', pupilGrid(10, 3).length === 37 && Math.max(...pupilGrid(10, 3).map(([x, y]) => Math.hypot(x, y))) <= 10 + 1e-12);
  const s0 = spot(pc, Infinity, 0, 10, z1);
  check('rays: on-axis spot centred, no rays lost', near(s0.cx, 0, 1e-12) && near(s0.cy, 0, 1e-12) && s0.lost === 0 && s0.total === 217);
  check('rays: on-axis geometric radius = transverse SA of the rim ray', near(s0.geo, Math.abs(traceRay(pc, ...Object.values(rayFor(Infinity, 0, 0, 10)), z1).end[1]), 1e-12));
  const bf = bestFocus(pc, Infinity, 0, 10, z1, 3);
  check('rays: best focus is inside the paraxial focus with a smaller spot', bf.dz < 0 && bf.dz > -1.1 && bf.rms < s0.rms / 2);
  { const c = spot({ n0: 1, surfaces: parseSurfaces('51.7 5 1.517 6\ninf 95 1 12.5') }, Infinity, 0, 10, z1); check('rays: semi-diameter clips rays', c.lost > 0 && c.lost < c.total); }
  { const t = traceRay({ n0: 1, surfaces: parseSurfaces('10 5 1.5') }, [0, 11, -1], [0, 0, 1], 50); check('rays: a ray outside the sphere reports a miss', !t.ok && t.why === 'misses surface 1'); }
  let msg = ''; try { parseSurfaces('50 5'); } catch (e) { msg = e.message; }
  check('rays: missing index message', msg.includes('refractive index'));
  msg = ''; try { parseSurfaces('abc 5 1.5'); } catch (e) { msg = e.message; }
  check('rays: bad radius message', msg.includes('is not a radius'));
};
