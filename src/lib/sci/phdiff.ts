// Diffraction by slits, gratings and circular holes: Fraunhofer (far field) and Fresnel (near field) patterns,
// as irradiance relative to the incident light. Special functions (Bessel J0, J1, Fresnel C, S) included.
// Lengths in metres inside the maths. Plain maths, no DOM.

/** Bessel J0 and J1: power series below 12, Hankel asymptotic expansion above. */
export function besselJ(n: 0 | 1, x: number): number {
  const ax = Math.abs(x);
  if (ax < 12) {
    let term = n === 0 ? 1 : x / 2, sum = term;
    const q = -(x * x) / 4;
    for (let k = 1; k < 80; k++) { term *= q / (k * (k + n)); sum += term; if (Math.abs(term) < 1e-17 * Math.abs(sum)) break; }
    return sum;
  }
  // Asymptotic: J_n(x) ≈ sqrt(2/(πx)) (P cos χ − Q sin χ), χ = x − nπ/2 − π/4.
  const mu = 4 * n * n;
  let P = 1, Q = 0, t = 1;
  for (let k = 1; k < 30; k++) {
    const nt = (t * (mu - (2 * k - 1) ** 2)) / (k * 8 * ax);
    if (Math.abs(nt) > Math.abs(t) && k > 2) break;
    t = nt;
    if (k % 2 === 1) Q += ((k - 1) / 2) % 2 === 0 ? t : -t; else P += (k / 2) % 2 === 1 ? -t : t;
    if (Math.abs(t) < 1e-17) break;
  }
  const chi = ax - (n * Math.PI) / 2 - Math.PI / 4;
  const v = Math.sqrt(2 / (Math.PI * ax)) * (P * Math.cos(chi) - Q * Math.sin(chi));
  return n === 1 && x < 0 ? -v : v;
}

/** Fresnel integrals C(x) = ∫₀ˣ cos(πt²/2) dt and S(x) = ∫₀ˣ sin(πt²/2) dt. Series below 1.5, a continued fraction (Lentz) above. */
export function fresnelCS(x: number): [number, number] {
  const ax = Math.abs(x), sg = x < 0 ? -1 : 1;
  if (ax < 1.5) {
    let C = 0, S = 0;
    const h = Math.PI / 2;
    // C = Σ (−1)^m h^(2m) x^(4m+1) / ((2m)! (4m+1)), S = Σ (−1)^m h^(2m+1) x^(4m+3) / ((2m+1)! (4m+3))
    let tc = ax, ts = h * ax ** 3;
    for (let m = 0; m < 40; m++) {
      C += tc / (4 * m + 1); S += ts / (4 * m + 3);
      tc *= (-h * h * ax ** 4) / ((2 * m + 1) * (2 * m + 2));
      ts *= (-h * h * ax ** 4) / ((2 * m + 2) * (2 * m + 3));
      if (Math.abs(tc) < 1e-18 && Math.abs(ts) < 1e-18) break;
    }
    return [sg * C, sg * S];
  }
  // Complex continued fraction for erfc, as in standard numerical libraries.
  const pix2 = Math.PI * ax * ax;
  type Z = [number, number];
  const mul = (a: Z, b: Z): Z => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
  const inv = (a: Z): Z => { const d = a[0] * a[0] + a[1] * a[1]; return [a[0] / d, -a[1] / d]; };
  let b: Z = [1, -pix2], cc: Z = [1e300, 0], d: Z = inv(b), h: Z = d, n = -1;
  for (let k = 2; k < 200; k++) {
    n += 2;
    const a = -n * (n + 1);
    b = [b[0] + 4, b[1]];
    d = inv([a * d[0] + b[0], a * d[1] + b[1]]);
    const ic = inv(cc); cc = [b[0] + a * ic[0], b[1] + a * ic[1]];
    const del = mul(cc, d);
    h = mul(h, del);
    if (Math.abs(del[0] - 1) + Math.abs(del[1]) < 1e-16) break;
  }
  h = mul(h, [ax, -ax]);
  const e: Z = [Math.cos(pix2 / 2), Math.sin(pix2 / 2)];
  const t = mul(e, h);
  const cs = mul([0.5, 0.5], [1 - t[0], -t[1]]);
  return [sg * cs[0], sg * cs[1]];
}

export type Aperture = { kind: 'slit' | 'double' | 'grating' | 'circle'; a: number; d: number; N: number };
/** Number of slits and their centres (m) for slit-type apertures. */
export function slitCentres(ap: Aperture): number[] {
  const N = ap.kind === 'slit' ? 1 : ap.kind === 'double' ? 2 : Math.max(1, Math.round(ap.N));
  return Array.from({ length: N }, (_, i) => (i - (N - 1) / 2) * ap.d);
}

/** Fraunhofer irradiance (relative to the incident) at screen position x (m) at distance z (m), wavelength lam (m). */
export function fraunhofer(ap: Aperture, lam: number, z: number, x: number): number {
  const s = x / Math.hypot(x, z);
  if (ap.kind === 'circle') {
    const R = ap.a / 2, u = (2 * Math.PI * R * s) / lam, peak = (Math.PI * R * R / (lam * z)) ** 2;
    const air = Math.abs(u) < 1e-8 ? 1 : (2 * besselJ(1, u)) / u;
    return peak * air * air;
  }
  const b = (Math.PI * ap.a * s) / lam, sinc = Math.abs(b) < 1e-12 ? 1 : Math.sin(b) / b;
  const N = slitCentres(ap).length;
  let arr = N;
  if (N > 1) { const g = (Math.PI * ap.d * s) / lam, sg = Math.sin(g); arr = Math.abs(sg) < 1e-12 ? N : Math.sin(N * g) / sg; }
  return ((ap.a * ap.a) / (lam * z)) * sinc * sinc * arr * arr;
}

/** Fresnel (paraxial near-field) irradiance relative to the incident, for long slits (1-D) at screen position x. */
export function fresnelSlits(ap: Aperture, lam: number, z: number, x: number): number {
  const k = Math.sqrt(2 / (lam * z));
  let re = 0, im = 0;
  for (const c of slitCentres(ap)) {
    const [C1, S1] = fresnelCS(k * (c - ap.a / 2 - x)), [C2, S2] = fresnelCS(k * (c + ap.a / 2 - x));
    re += C2 - C1; im += S2 - S1;
  }
  return (re * re + im * im) / 2;
}

/** Fresnel irradiance of a circular hole of diameter D at radius r on the screen, by numerical integration (Simpson). */
export function fresnelCircle(D: number, lam: number, z: number, r: number): number {
  const R = D / 2, lz = lam * z;
  const zones = (R * R) / lz, osc = (r * R) / lz;
  const n = 2 * Math.min(20000, Math.ceil(30 * (zones + osc) + 200));
  let re = 0, im = 0;
  for (let i = 0; i <= n; i++) {
    const rho = (R * i) / n, w = i === 0 || i === n ? 1 : i % 2 ? 4 : 2;
    const j = besselJ(0, (2 * Math.PI * r * rho) / lz) * rho * w, ph = (Math.PI * rho * rho) / lz;
    re += j * Math.cos(ph); im += j * Math.sin(ph);
  }
  const f = ((2 * Math.PI) / lz) * (R / n / 3);
  return f * f * (re * re + im * im);
}

/** Closed form for the circular hole on the axis: 4 sin²(π R² / (2 λ z)). */
export const circleOnAxis = (D: number, lam: number, z: number) => 4 * Math.sin((Math.PI * (D / 2) ** 2) / (2 * lam * z)) ** 2;

/** Fresnel number of the aperture: (half-width)² / (λ z). Below about 0.1 the far-field (Fraunhofer) pattern applies. */
export function fresnelNumber(ap: Aperture, lam: number, z: number): number {
  const c = slitCentres(ap);
  const half = ap.kind === 'circle' ? ap.a / 2 : (c[c.length - 1] - c[0] + ap.a) / 2;
  return (half * half) / (lam * z);
}

/** Irradiance in either regime. */
export function irradiance(ap: Aperture, lam: number, z: number, x: number, regime: 'far' | 'near'): number {
  if (regime === 'far') return fraunhofer(ap, lam, z, x);
  return ap.kind === 'circle' ? fresnelCircle(ap.a, lam, z, Math.abs(x)) : fresnelSlits(ap, lam, z, x);
}

/** First zero of J1 (3.8317...) used for the Airy radius 1.22 λ/D. */
export const J1_ZERO = 3.8317059702075125;
