// School maths (Class 9/10 surface area and volume): cube, cuboid, cylinder, cone, sphere and hemisphere, their
// curved/lateral and total surface areas and volumes (with the multiple of π kept exact where there is one), the
// faces for a simple 3D picture and the pieces of each net. No DOM.

export type Solid = 'cube' | 'cuboid' | 'cylinder' | 'cone' | 'sphere' | 'hemisphere';
export type Dims = { a?: number; l?: number; b?: number; h?: number; r?: number };
export type Measure = {
  /** Lateral (cube, cuboid) or curved surface area. */
  side: number; total: number; volume: number;
  /** The same as multiples of π (side = sidePi × π …) when the shape is round; null for box shapes. */
  sidePi: number | null; totalPi: number | null; volumePi: number | null;
  slant?: number;
};

export function measure(s: Solid, d: Dims): Measure {
  const { a = 0, l = 0, b = 0, h = 0, r = 0 } = d, P = Math.PI;
  switch (s) {
    case 'cube': return { side: 4 * a * a, total: 6 * a * a, volume: a ** 3, sidePi: null, totalPi: null, volumePi: null };
    case 'cuboid': return { side: 2 * h * (l + b), total: 2 * (l * b + b * h + h * l), volume: l * b * h, sidePi: null, totalPi: null, volumePi: null };
    case 'cylinder': return pi(2 * r * h, 2 * r * (r + h), r * r * h);
    case 'cone': { const sl = Math.hypot(r, h); return { ...pi(r * sl, r * (sl + r), (r * r * h) / 3), slant: sl }; }
    case 'sphere': return pi(4 * r * r, 4 * r * r, (4 / 3) * r ** 3);
    case 'hemisphere': return pi(2 * r * r, 3 * r * r, (2 / 3) * r ** 3);
  }
  function pi(sp: number, tp: number, vp: number): Measure { return { side: sp * P, total: tp * P, volume: vp * P, sidePi: sp, totalPi: tp, volumePi: vp }; }
}

export type V3 = [number, number, number];
export type Face = { pts: V3[]; tone: number };

/** Faces of the solid (z up), centred on the origin, for drawing. `n` is the number of slices round a circle. */
export function faces(s: Solid, d: Dims, n = 28): Face[] {
  const { a = 0, l = 0, b = 0, h = 0, r = 0 } = d, out: Face[] = [];
  const box = (L: number, B: number, H: number) => {
    const x = L / 2, y = B / 2, z = H / 2;
    const c = (i: number, j: number, k: number): V3 => [i * x, j * y, k * z];
    out.push({ pts: [c(-1, -1, -1), c(1, -1, -1), c(1, 1, -1), c(-1, 1, -1)], tone: 0 });
    out.push({ pts: [c(-1, -1, 1), c(1, -1, 1), c(1, 1, 1), c(-1, 1, 1)], tone: 0 });
    out.push({ pts: [c(-1, -1, -1), c(1, -1, -1), c(1, -1, 1), c(-1, -1, 1)], tone: 1 });
    out.push({ pts: [c(-1, 1, -1), c(1, 1, -1), c(1, 1, 1), c(-1, 1, 1)], tone: 1 });
    out.push({ pts: [c(-1, -1, -1), c(-1, 1, -1), c(-1, 1, 1), c(-1, -1, 1)], tone: 2 });
    out.push({ pts: [c(1, -1, -1), c(1, 1, -1), c(1, 1, 1), c(1, -1, 1)], tone: 2 });
  };
  const ring = (rad: number, z: number): V3[] => Array.from({ length: n }, (_, i) => [rad * Math.cos((2 * Math.PI * i) / n), rad * Math.sin((2 * Math.PI * i) / n), z]);
  if (s === 'cube') box(a, a, a);
  else if (s === 'cuboid') box(l, b, h);
  else if (s === 'cylinder') {
    const lo = ring(r, -h / 2), hi = ring(r, h / 2);
    for (let i = 0; i < n; i++) { const j = (i + 1) % n; out.push({ pts: [lo[i], lo[j], hi[j], hi[i]], tone: 3 }); }
    out.push({ pts: lo, tone: 0 }, { pts: hi, tone: 0 });
  } else if (s === 'cone') {
    const lo = ring(r, -h / 2), top: V3 = [0, 0, h / 2];
    for (let i = 0; i < n; i++) out.push({ pts: [lo[i], lo[(i + 1) % n], top], tone: 3 });
    out.push({ pts: lo, tone: 0 });
  } else {
    const half = s === 'hemisphere', m = half ? 7 : 14, z0 = half ? -r / 3 : 0;
    const lat = (k: number) => (half ? (k / m) * (Math.PI / 2) : -Math.PI / 2 + (k / m) * Math.PI);
    for (let k = 0; k < m; k++) {
      const A = ring(r * Math.cos(lat(k)), r * Math.sin(lat(k)) + z0), B = ring(r * Math.cos(lat(k + 1)), r * Math.sin(lat(k + 1)) + z0);
      for (let i = 0; i < n; i++) { const j = (i + 1) % n; out.push({ pts: [A[i], A[j], B[j], B[i]], tone: 3 }); }
    }
    if (half) out.push({ pts: ring(r, z0), tone: 0 });
  }
  return out;
}

/** Rotate by yaw (about z) then pitch (about x) and project: returns screen x, y and depth (bigger = nearer). */
export function project(p: V3, yaw: number, pitch: number): [number, number, number] {
  const x1 = p[0] * Math.cos(yaw) - p[1] * Math.sin(yaw), y1 = p[0] * Math.sin(yaw) + p[1] * Math.cos(yaw), z1 = p[2];
  const y2 = y1 * Math.cos(pitch) - z1 * Math.sin(pitch), z2 = y1 * Math.sin(pitch) + z1 * Math.cos(pitch);
  return [x1, -z2, -y2];
}

/** Cone net: the curved surface unrolls into a sector of radius l (slant) with angle 360° × r / l. */
export const coneSectorAngle = (r: number, h: number) => (360 * r) / Math.hypot(r, h);

/** How many full loads of `s` fill a cylinder of the same radius and height (cone: 3; sphere in its cylinder: 1.5). */
export function loadsToFillCylinder(s: 'cone' | 'sphere' | 'hemisphere', r: number, h: number): number {
  const cyl = Math.PI * r * r * (s === 'cone' ? h : s === 'sphere' ? 2 * r : r);
  return cyl / measure(s, { r, h }).volume;
}
