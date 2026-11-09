// Thin-film optics: reflectance and transmittance of a stack of layers on a substrate, by the characteristic
// (transfer) matrix method (Macleod, Thin-Film Optical Filters). s and p polarisation, any angle, absorbing
// layers through n − ik. Wavelengths and thicknesses in nm. Plain maths, no DOM.

export type Cx = { re: number; im: number };
const cx = (re: number, im = 0): Cx => ({ re, im });
const add = (a: Cx, b: Cx): Cx => ({ re: a.re + b.re, im: a.im + b.im });
const sub = (a: Cx, b: Cx): Cx => ({ re: a.re - b.re, im: a.im - b.im });
const mul = (a: Cx, b: Cx): Cx => ({ re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re });
const dv = (a: Cx, b: Cx): Cx => { const d = b.re * b.re + b.im * b.im; return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d }; };
const abs2 = (a: Cx) => a.re * a.re + a.im * a.im;
const csqrt = (a: Cx): Cx => { const r = Math.hypot(a.re, a.im), re = Math.sqrt((r + a.re) / 2), im = Math.sign(a.im || 1) * Math.sqrt(Math.max(0, (r - a.re) / 2)); return { re, im: a.im === 0 && a.re >= 0 ? 0 : im }; };
const ccos = (a: Cx): Cx => ({ re: Math.cos(a.re) * Math.cosh(a.im), im: -Math.sin(a.re) * Math.sinh(a.im) });
const csin = (a: Cx): Cx => ({ re: Math.sin(a.re) * Math.cosh(a.im), im: Math.cos(a.re) * Math.sinh(a.im) });

export type Layer = { n: number; k: number; d: number; name: string };
export type Stack = { n0: number; ns: number; ks: number; layers: Layer[] };
export type RT = { R: number; T: number; A: number; phaseR: number };

/** Rounded, non-dispersive refractive indices of common coating materials (visible light), for quick designs. */
export const MATERIALS: Record<string, number> = { mgf2: 1.38, sio2: 1.46, al2o3: 1.63, ta2o5: 2.1, tio2: 2.35, zns: 2.35 };

/**
 * Read layers, one per line, from the incident side to the substrate: "1.38 99.6" (index, thickness in nm),
 * "2.0 0.1 50" (n, k, thickness), "1.38 QW" or "2.35 0.5QW" (quarter waves at the design wavelength), or a
 * material name for the index ("MgF2 QW"). Several layers on one line separated by ";" form a group, and
 * "x 8" at the end repeats the group 8 times. Throws with a plain message.
 */
export function parseLayers(text: string, design: number): Layer[] {
  const out: Layer[] = [];
  text.split(/\r?\n/).forEach((raw, i) => {
    let line = raw.replace(/#.*$/, '').trim();
    if (!line) return;
    let rep = 1;
    const m = line.match(/\s[x×]\s*(\d+)\s*$/i);
    if (m) { rep = Number(m[1]); line = line.slice(0, m.index).trim().replace(/;$/, ''); }
    if (!(rep >= 1 && rep <= 200)) throw new Error(`Line ${i + 1}: repeat between 1 and 200 times.`);
    const group: Layer[] = line.split(';').map((part) => {
      const p = part.trim().split(/[\s,\t]+/).filter(Boolean);
      if (!p.length) throw new Error(`Line ${i + 1}: an empty layer.`);
      const name = p[0];
      const nm = MATERIALS[name.toLowerCase().replace(/[₂₃₅]/g, (c) => ({ '₂': '2', '₃': '3', '₅': '5' })[c]!)];
      const n = nm ?? Number(name.replace(',', '.'));
      if (!(n > 0 && n < 20)) throw new Error(`Line ${i + 1}: "${name}" is not a refractive index or a known material (${Object.keys(MATERIALS).join(', ')}).`);
      let k = 0, tk = p[1];
      if (p.length >= 3) { k = Number(p[1]); tk = p[2]; }
      if (!(k >= 0 && k < 20)) throw new Error(`Line ${i + 1}: the extinction coefficient k must be 0 or more.`);
      if (tk === undefined) throw new Error(`Line ${i + 1}: give a thickness in nm or in quarter waves, e.g. "${name} 100" or "${name} QW".`);
      let d: number;
      const qw = tk.match(/^(\d*\.?\d*)\s*qw$/i);
      if (qw) d = (Number(qw[1] || 1) * design) / (4 * n);
      else d = Number(tk);
      if (!(d >= 0 && d < 1e6)) throw new Error(`Line ${i + 1}: "${tk}" is not a thickness (nm) or quarter waves (QW, 2QW, 0.5QW).`);
      return { n, k, d, name: nm ? name : `n = ${n}` };
    });
    for (let r = 0; r < rep; r++) out.push(...group.map((g) => ({ ...g })));
  });
  if (out.length > 1000) throw new Error('Up to 1,000 layers.');
  return out;
}

/** Reflectance, transmittance and absorptance of a stack at wavelength lam (nm) and incidence angle (degrees) in the incident medium. */
export function rt(st: Stack, lam: number, angleDeg: number, pol: 's' | 'p'): RT {
  const n0 = st.n0, s0 = n0 * Math.sin((angleDeg * Math.PI) / 180);
  const cosIn = (N: Cx) => csqrt(sub(cx(1), mul(dv(cx(s0), N), dv(cx(s0), N))));
  // Admittance (in units of free-space admittance) of a medium of complex index N at this angle.
  const adm = (N: Cx, c: Cx) => (pol === 's' ? mul(N, c) : dv(N, c));
  const eta0 = adm(cx(n0), cx(Math.cos((angleDeg * Math.PI) / 180)));
  const Ns = cx(st.ns, -st.ks), etaS = adm(Ns, fixBranch(cosIn(Ns), Ns));
  // [B; C] = M1 M2 ... [1; etaS]
  let B: Cx = cx(1), C: Cx = etaS;
  for (let j = st.layers.length - 1; j >= 0; j--) {
    const L = st.layers[j], N = cx(L.n, -L.k), c = fixBranch(cosIn(N), N), eta = adm(N, c);
    const delta = mul(cx((2 * Math.PI * L.d) / lam), mul(N, c));
    const cd = ccos(delta), sd = csin(delta), i = cx(0, 1);
    const B2 = add(mul(cd, B), mul(dv(mul(i, sd), eta), C));
    const C2 = add(mul(mul(i, mul(eta, sd)), B), mul(cd, C));
    B = B2; C = C2;
  }
  const den = add(mul(eta0, B), C);
  const r = dv(sub(mul(eta0, B), C), den);
  const R = abs2(r), T = (4 * eta0.re * etaS.re) / abs2(den);
  return { R, T, A: Math.max(0, 1 - R - T), phaseR: Math.atan2(r.im, r.re) };
}
/** Choose the root of cos θ that decays into an absorbing medium (Im(N cos θ) ≤ 0 with the n − ik convention). */
function fixBranch(c: Cx, N: Cx): Cx { const p = mul(N, c); return p.im > 1e-15 || (Math.abs(p.im) <= 1e-15 && p.re < 0) ? { re: -c.re, im: -c.im } : c; }

/** Average of s and p (unpolarised light). */
export function rtAvg(st: Stack, lam: number, angleDeg: number): RT & { Rs: number; Rp: number; Ts: number; Tp: number } {
  const s = rt(st, lam, angleDeg, 's'), p = rt(st, lam, angleDeg, 'p');
  return { R: (s.R + p.R) / 2, T: (s.T + p.T) / 2, A: (s.A + p.A) / 2, phaseR: NaN, Rs: s.R, Rp: p.R, Ts: s.T, Tp: p.T };
}

/** Single quarter-wave layer reflectance at normal incidence, for checking: ((n0 ns − n1²)/(n0 ns + n1²))². */
export const quarterWaveR = (n0: number, n1: number, ns: number) => ((n0 * ns - n1 * n1) / (n0 * ns + n1 * n1)) ** 2;
/** Bare surface reflectance at normal incidence. */
export const bareR = (n0: number, ns: number) => ((n0 - ns) / (n0 + ns)) ** 2;
