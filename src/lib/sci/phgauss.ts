// Gaussian beam propagation with the complex beam parameter q and ABCD matrices: free space, thin lenses and
// curved mirrors (unfolded onto a straight rail). Lengths in mm, wavelength in nm. M² (beam quality) is handled
// with the "embedded Gaussian": every formula uses M²·λ in place of λ. Plain maths, no DOM.

export type Element = { kind: 'lens' | 'mirror'; z: number; f: number; label: string; value: number };
export type Beam = { w0: number; zw: number; zR: number; theta: number };
export type Segment = Beam & { from: number; to: number; wIn: number; wOut: number };
type C = { re: number; im: number };
const div = (a: C, b: C): C => { const d = b.re * b.re + b.im * b.im; return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d }; };

/** M²·λ in mm. */
export const lamEff = (lambdaNm: number, m2 = 1) => lambdaNm * 1e-6 * m2;
/** Rayleigh range (mm) of a waist w0 (mm). */
export const rayleigh = (w0: number, lambdaNm: number, m2 = 1) => (Math.PI * w0 * w0) / lamEff(lambdaNm, m2);
/** Far-field half-angle divergence (rad) of a waist w0 (mm). */
export const divergence = (w0: number, lambdaNm: number, m2 = 1) => lamEff(lambdaNm, m2) / (Math.PI * w0);
/** Beam radius (1/e² intensity, mm) at distance dz from the waist. */
export const radiusAt = (b: Beam, z: number) => b.w0 * Math.sqrt(1 + ((z - b.zw) / b.zR) ** 2);
/** Wavefront radius of curvature (mm) at z; Infinity at the waist. */
export const curvatureAt = (b: Beam, z: number) => { const d = z - b.zw; return d === 0 ? Infinity : d * (1 + (b.zR / d) ** 2); };
/** Gouy phase (rad) at z, relative to the waist. */
export const gouyAt = (b: Beam, z: number) => Math.atan((z - b.zw) / b.zR);

/** Read rail elements, one per line: "lens 200 100" (position, focal length) or "mirror 400 500" (position, radius;
 * concave positive, so f = R/2). A trailing word is kept as a label. Throws with a plain message. */
export function parseElements(text: string): Element[] {
  const out: Element[] = [];
  text.split(/\r?\n/).forEach((raw, i) => {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) return;
    const p = line.split(/[\s,;\t]+/);
    const kind = p[0].toLowerCase();
    const k = kind.startsWith('l') ? 'lens' : kind.startsWith('m') ? 'mirror' : '';
    const z = Number(p[1]?.replace('−', '-')), v = Number(p[2]?.replace('−', '-'));
    if (!k) throw new Error(`Line ${i + 1}: start with "lens" or "mirror" (got "${p[0]}").`);
    if (!Number.isFinite(z) || !Number.isFinite(v) || v === 0) throw new Error(`Line ${i + 1}: give the position and a non-zero ${k === 'lens' ? 'focal length' : 'radius of curvature'}, e.g. "${k} 200 ${k === 'lens' ? '100' : '500'}".`);
    out.push({ kind: k, z, value: v, f: k === 'lens' ? v : v / 2, label: p.slice(3).join(' ') || `${k === 'lens' ? 'Lens' : 'Mirror'} ${out.length + 1}` });
  });
  return out.sort((a, b) => a.z - b.z);
}

/** The beam after a thin lens of focal length f placed at zl, given the beam before it. */
export function throughLens(b: Beam, zl: number, f: number): Beam {
  const q: C = { re: zl - b.zw, im: b.zR };
  const inv = div({ re: 1, im: 0 }, q);
  const q2 = div({ re: 1, im: 0 }, { re: inv.re - 1 / f, im: inv.im });
  const zR = q2.im, zw = zl - q2.re, w0 = b.w0 * Math.sqrt(zR / b.zR);
  return { w0, zw, zR, theta: (b.theta * b.w0) / w0 };
}

/** Propagate a beam (waist w0 at zw) along a rail with elements, from z = 0 to zEnd. One segment per gap. */
export function propagate(w0: number, zw: number, lambdaNm: number, m2: number, els: Element[], zEnd: number): Segment[] {
  let b: Beam = { w0, zw, zR: rayleigh(w0, lambdaNm, m2), theta: divergence(w0, lambdaNm, m2) };
  const segs: Segment[] = [];
  let from = 0;
  for (const e of els) {
    if (e.z < 0 || e.z > zEnd) continue;
    segs.push({ ...b, from, to: e.z, wIn: radiusAt(b, from), wOut: radiusAt(b, e.z) });
    b = throughLens(b, e.z, e.f);
    from = e.z;
  }
  segs.push({ ...b, from, to: zEnd, wIn: radiusAt(b, from), wOut: radiusAt(b, zEnd) });
  return segs;
}

/** The overall ABCD matrix from z = 0 to zEnd (thin lenses and mirrors as lenses, free space between). */
export function systemMatrix(els: Element[], zEnd: number): [number, number, number, number] {
  let M: [number, number, number, number] = [1, 0, 0, 1];
  const mul = (a: number[], m: number[]): [number, number, number, number] => [a[0] * m[0] + a[1] * m[2], a[0] * m[1] + a[1] * m[3], a[2] * m[0] + a[3] * m[2], a[2] * m[1] + a[3] * m[3]];
  let z = 0;
  for (const e of els) {
    if (e.z < 0 || e.z > zEnd) continue;
    M = mul([1, e.z - z, 0, 1], M);
    M = mul([1, 0, -1 / e.f, 1], M);
    z = e.z;
  }
  return mul([1, zEnd - z, 0, 1], M);
}

/** Beam at any z along the rail, from the segments. */
export function beamAt(segs: Segment[], z: number): Beam {
  for (const s of segs) if (z <= s.to) return s;
  return segs[segs.length - 1];
}

/** Gaussian-optics imaging of a waist by one thin lens (Self 1983): s = waist distance before the lens. */
export function selfImage(s: number, f: number, zR: number): { s2: number; m: number } {
  const x = s / f - 1, r = zR / f;
  return { s2: f * (1 + x / (x * x + r * r)), m: 1 / Math.sqrt(x * x + r * r) };
}
