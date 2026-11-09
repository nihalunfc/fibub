// Magnetic field of coaxial circular coils (Biot-Savart, exact, with complete elliptic integrals),
// for Helmholtz, anti-Helmholtz, Maxwell and custom coil sets. SI units: metres, amperes, tesla. No DOM.

export const MU0 = 1.25663706127e-6; // vacuum permeability, CODATA 2022 (≈ 4π × 10⁻⁷ H/m)

/** Complete elliptic integrals K(m) and E(m), parameter m = k², by the arithmetic-geometric mean. */
export function ellipKE(m: number): { K: number; E: number } {
  if (m >= 1) return { K: Infinity, E: 1 };
  let a = 1, b = Math.sqrt(1 - m), c = Math.sqrt(m), sum = 0.5 * c * c, p = 0.5;
  for (let i = 0; i < 40 && Math.abs(c) > 1e-16; i++) {
    const an = (a + b) / 2, bn = Math.sqrt(a * b);
    c = (a - b) / 2; p *= 2; sum += p * c * c; a = an; b = bn;
  }
  const K = Math.PI / (2 * a);
  return { K, E: K * (1 - sum) };
}

/** Field (Br, Bz) in tesla at radius r and height z from the centre of one loop of radius a carrying NI ampere-turns. */
export function loopField(a: number, NI: number, r: number, z: number): { br: number; bz: number } {
  r = Math.abs(r);
  const s = (a + r) * (a + r) + z * z, d = (a - r) * (a - r) + z * z;
  if (d === 0) return { br: NaN, bz: NaN };
  const m = (4 * a * r) / s, { K, E } = ellipKE(m), c = (MU0 * NI) / (2 * Math.PI * Math.sqrt(s));
  const bz = c * (K + ((a * a - r * r - z * z) / d) * E);
  // On the axis Br is zero; near it use the small-r limit to avoid 0/0.
  const br = r < 1e-9 * a ? 0 : ((c * z) / r) * (-K + ((a * a + r * r + z * z) / d) * E);
  return { br, bz };
}

/** One coil: mean radius R, centre position z, turns N, current I (A, sign gives direction), winding width w (axial) and depth d (radial), both may be 0. */
export type Coil = { R: number; z: number; N: number; I: number; w: number; d: number };
type Loop = { a: number; z: number; NI: number };

/** Split coils with a winding cross-section into a grid of thin loops (n × n per coil, ampere-turns shared equally). */
export function loops(coils: Coil[], n = 5): Loop[] {
  const out: Loop[] = [];
  for (const c of coils) {
    const nz = c.w > 0 ? n : 1, nr = c.d > 0 ? n : 1;
    for (let i = 0; i < nz; i++) for (let j = 0; j < nr; j++) {
      const z = c.z + (nz > 1 ? ((i + 0.5) / nz - 0.5) * c.w : 0), a = c.R + (nr > 1 ? ((j + 0.5) / nr - 0.5) * c.d : 0);
      out.push({ a, z, NI: (c.N * c.I) / (nz * nr) });
    }
  }
  return out;
}

export function fieldAt(L: Loop[], r: number, z: number): { br: number; bz: number; b: number } {
  let br = 0, bz = 0;
  for (const l of L) { const f = loopField(l.a, l.NI, r, z - l.z); br += f.br; bz += f.bz; }
  return { br, bz, b: Math.hypot(br, bz) };
}

/** On-axis field of a thin loop, μ0 NI a² / (2 (a² + z²)^1.5), for checks. */
export const axisLoop = (a: number, NI: number, z: number) => (MU0 * NI * a * a) / (2 * Math.pow(a * a + z * z, 1.5));

export type Preset = 'single' | 'helmholtz' | 'anti' | 'maxwell';
/** Standard coil sets for radius R, N turns and current I. Maxwell: outer coils radius R√(4/7) at ±R√(3/7) with 49/64 of the centre coil's ampere-turns. */
export function preset(p: Preset, R: number, N: number, I: number): Coil[] {
  const c = (r: number, z: number, n: number, i: number): Coil => ({ R: r, z, N: n, I: i, w: 0, d: 0 });
  if (p === 'single') return [c(R, 0, N, I)];
  if (p === 'helmholtz') return [c(R, -R / 2, N, I), c(R, R / 2, N, I)];
  if (p === 'anti') return [c(R, (-Math.sqrt(3) * R) / 2, N, -I), c(R, (Math.sqrt(3) * R) / 2, N, I)];
  const ro = R * Math.sqrt(4 / 7), zo = R * Math.sqrt(3 / 7);
  return [c(ro, -zo, (N * 49) / 64, I), c(R, 0, N, I), c(ro, zo, (N * 49) / 64, I)];
}

/** Helmholtz centre field (4/5)^1.5 μ0 N I / R. */
export const helmholtzCentre = (R: number, N: number, I: number) => Math.pow(0.8, 1.5) * MU0 * N * I / R;

/**
 * Half-length of the stretch of axis around z0 where Bz stays within `tol` (fraction) of its value at z0,
 * searched outwards in steps of `step`, up to `zmax`.
 */
export function uniformLength(L: Loop[], z0: number, tol: number, step: number, zmax: number): number {
  const b0 = fieldAt(L, 0, z0).bz;
  let last = 0;
  for (let s = step; s <= zmax; s += step) {
    const ok = Math.abs(fieldAt(L, 0, z0 + s).bz / b0 - 1) <= tol && Math.abs(fieldAt(L, 0, z0 - s).bz / b0 - 1) <= tol;
    if (!ok) break;
    last = s;
  }
  return last;
}

/**
 * Radius of the largest sphere around (0, z0) inside which |B − B(z0)| / |B(z0)| stays within `tol`
 * (vector difference, checked on 24 directions in the r–z half-plane per radius).
 */
export function uniformSphere(L: Loop[], z0: number, tol: number, step: number, rmax: number): number {
  const c = fieldAt(L, 0, z0), b0 = Math.hypot(c.br, c.bz);
  let last = 0;
  for (let s = step; s <= rmax; s += step) {
    let ok = true;
    for (let k = 0; k <= 24 && ok; k++) {
      const t = (k / 24) * Math.PI, f = fieldAt(L, s * Math.sin(t), z0 + s * Math.cos(t));
      ok = Math.hypot(f.br - c.br, f.bz - c.bz) / b0 <= tol;
    }
    if (!ok) break;
    last = s;
  }
  return last;
}

/** dBz/dz on the axis at z, by central differences (T/m). */
export function gradient(L: Loop[], z: number, h: number): number {
  return (fieldAt(L, 0, z + h).bz - fieldAt(L, 0, z - h).bz) / (2 * h);
}

/** Total wire length (m): each turn is one circumference of its coil's mean radius. */
export const wireLength = (coils: Coil[]) => coils.reduce((s, c) => s + Math.abs(c.N) * 2 * Math.PI * c.R, 0);

/** Half-length of the stretch of axis around z0 where dBz/dz stays within `tol` (fraction) of its value at z0 (for gradient coils). */
export function gradientUniformLength(L: Loop[], z0: number, tol: number, step: number, zmax: number): number {
  const h = step / 4, g0 = gradient(L, z0, h);
  let last = 0;
  for (let s = step; s <= zmax; s += step) {
    if (!(Math.abs(gradient(L, z0 + s, h) / g0 - 1) <= tol && Math.abs(gradient(L, z0 - s, h) / g0 - 1) <= tol)) break;
    last = s;
  }
  return last;
}
