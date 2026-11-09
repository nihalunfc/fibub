// Composite laminates: ply properties from fibre and matrix (rule of mixtures: Voigt, Reuss, Halpin-Tsai), then
// classical lamination theory (CLT): reduced stiffness Q, transformed Q-bar, the A, B and D matrices, effective
// laminate moduli, ply strains and stresses under in-plane forces N and moments M, and first-ply failure by maximum
// stress and Tsai-Wu. Textbook forms (Jones, Mechanics of Composite Materials; Daniel and Ishai, Engineering
// Mechanics of Composite Materials; Halpin and Kardos 1976). Units: moduli and stresses in MPa, lengths in mm,
// N in N/mm, M in N·mm/mm. Fibres are treated as isotropic.

export type Ply = { E1: number; E2: number; G12: number; nu12: number };
export type Mat3 = number[][];
export type Fibre = { Ef: number; nuf: number; Em: number; num: number; Vf: number; Gf?: number; Gm?: number };

/** Halpin-Tsai: M/Mm = (1 + ξηVf)/(1 − ηVf), η = (Mf/Mm − 1)/(Mf/Mm + ξ). */
export function halpinTsai(Mf: number, Mm: number, Vf: number, xi: number): number {
  const r = Mf / Mm, eta = (r - 1) / (r + xi);
  return (Mm * (1 + xi * eta * Vf)) / (1 - eta * Vf);
}

/** Ply properties from fibre and matrix. E1 and ν12 always follow the rule of mixtures (Voigt); E2 and G12 follow
 *  the inverse rule (Reuss) or Halpin-Tsai with ξ = 2 for E2 and ξ = 1 for G12 (round fibres in a square array). */
export function micromechanics(f: Fibre, model: 'reuss' | 'halpin' = 'halpin', xiE = 2, xiG = 1) {
  const Vm = 1 - f.Vf, Gf = f.Gf ?? f.Ef / (2 * (1 + f.nuf)), Gm = f.Gm ?? f.Em / (2 * (1 + f.num));
  const E1 = f.Vf * f.Ef + Vm * f.Em, nu12 = f.Vf * f.nuf + Vm * f.num;
  const E2r = 1 / (f.Vf / f.Ef + Vm / f.Em), G12r = 1 / (f.Vf / Gf + Vm / Gm);
  const E2h = halpinTsai(f.Ef, f.Em, f.Vf, xiE), G12h = halpinTsai(Gf, Gm, f.Vf, xiG);
  const ply: Ply = model === 'reuss' ? { E1, E2: E2r, G12: G12r, nu12 } : { E1, E2: E2h, G12: G12h, nu12 };
  return { ply, Gf, Gm, E2reuss: E2r, G12reuss: G12r, E2halpin: E2h, G12halpin: G12h };
}

/** Reduced stiffness Q of a ply in its own axes (1 along the fibres), plane stress. */
export function reducedQ(p: Ply): Mat3 {
  const nu21 = (p.nu12 * p.E2) / p.E1, d = 1 - p.nu12 * nu21;
  return [[p.E1 / d, (p.nu12 * p.E2) / d, 0], [(p.nu12 * p.E2) / d, p.E2 / d, 0], [0, 0, p.G12]];
}

/** Transformed stiffness Q-bar for a ply at angle θ (degrees, from x towards y). */
export function qBar(Q: Mat3, deg: number): Mat3 {
  const t = (deg * Math.PI) / 180, m = Math.cos(t), n = Math.sin(t);
  const [Q11, Q12, Q22, Q66] = [Q[0][0], Q[0][1], Q[1][1], Q[2][2]];
  const m2 = m * m, n2 = n * n, m4 = m2 * m2, n4 = n2 * n2, mn = m * n;
  const b11 = Q11 * m4 + 2 * (Q12 + 2 * Q66) * m2 * n2 + Q22 * n4;
  const b22 = Q11 * n4 + 2 * (Q12 + 2 * Q66) * m2 * n2 + Q22 * m4;
  const b12 = (Q11 + Q22 - 4 * Q66) * m2 * n2 + Q12 * (m4 + n4);
  const b66 = (Q11 + Q22 - 2 * Q12 - 2 * Q66) * m2 * n2 + Q66 * (m4 + n4);
  const b16 = (Q11 - Q12 - 2 * Q66) * m2 * mn - (Q22 - Q12 - 2 * Q66) * n2 * mn;
  const b26 = (Q11 - Q12 - 2 * Q66) * n2 * mn - (Q22 - Q12 - 2 * Q66) * m2 * mn;
  return [[b11, b12, b16], [b12, b22, b26], [b16, b26, b66]];
}

/** A stacking sequence such as "[0/±45/90]s", "0,45,-45,90", "0_2/90_2/s" or "[0/90]2s" as a list of angles. */
export function parseStack(text: string): number[] | string {
  let t = text.replace(/[−–]/g, '-').replace(/\s+/g, '').replace(/^\[/, '');
  let sym = false, rep = 1;
  const br = t.match(/\](\d*)(s?)$/i);
  if (br) { rep = br[1] ? Number(br[1]) : 1; sym = !!br[2]; t = t.slice(0, t.length - br[0].length); }
  else if (/s$/i.test(t)) { sym = true; t = t.slice(0, -1); }
  t = t.replace(/[\/,;]$/, '');
  if (rep < 1 || rep > 50) return 'The repeat number after ] must be 1 to 50.';
  if (!t) return 'Type the ply angles, for example [0/±45/90]s.';
  const out: number[] = [];
  for (const tok of t.split(/[\/,;]/)) {
    if (!tok) continue;
    const m = tok.match(/^(±|\+-|∓|-\+)?([+-]?\d+(?:\.\d+)?)(?:_(\d+)|([₀-₉]+))?(?:°)?$/);
    if (!m) return `"${tok}" is not a ply angle. Use numbers such as 0, 45, -45, ±45, 0_2.`;
    const a = Number(m[2]), k = m[3] ? Number(m[3]) : m[4] ? Number([...m[4]].map((c) => c.charCodeAt(0) - 0x2080).join('')) : 1;
    if (Math.abs(a) > 180) return `Angle ${a} is outside −180 to 180 degrees.`;
    for (let i = 0; i < k; i++) {
      if (m[1] === '±' || m[1] === '+-') out.push(a, -a);
      else if (m[1] === '∓' || m[1] === '-+') out.push(-a, a);
      else out.push(a);
    }
  }
  if (rep > 1) { const base = out.slice(); for (let i = 1; i < rep; i++) out.push(...base); }
  if (sym) out.push(...out.slice().reverse());
  if (!out.length) return 'Type the ply angles, for example [0/±45/90]s.';
  if (out.length > 200) return 'Up to 200 plies.';
  return out;
}

export type Laminate = { angles: number[]; t: number[]; z: number[]; h: number; A: Mat3; B: Mat3; D: Mat3; ABD: number[][]; abd: number[][]; Qb: Mat3[]; Q: Mat3 };

/** Plies listed from z = −h/2 upwards; t is one thickness for every ply or one per ply (mm). */
export function laminate(ply: Ply, angles: number[], t: number | number[]): Laminate {
  const ts = Array.isArray(t) ? t : angles.map(() => t), h = ts.reduce((s, x) => s + x, 0);
  const z = [-h / 2]; for (const x of ts) z.push(z[z.length - 1] + x);
  const Q = reducedQ(ply), Qb = angles.map((a) => qBar(Q, a));
  const A = zero3(), B = zero3(), D = zero3();
  Qb.forEach((q, k) => {
    const z0 = z[k], z1 = z[k + 1];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      A[i][j] += q[i][j] * (z1 - z0); B[i][j] += (q[i][j] * (z1 * z1 - z0 * z0)) / 2; D[i][j] += (q[i][j] * (z1 ** 3 - z0 ** 3)) / 3;
    }
  });
  const ABD = [0, 1, 2].map((i) => [...A[i], ...B[i]]).concat([0, 1, 2].map((i) => [...B[i], ...D[i]]));
  return { angles, t: ts, z, h, A, B, D, ABD, abd: invert(ABD), Qb, Q };
}

/** Effective in-plane and bending moduli from the inverse of the full ABD matrix (with B coupling held free). */
export function effective(L: Laminate) {
  const a = L.abd, h = L.h;
  return {
    Ex: 1 / (h * a[0][0]), Ey: 1 / (h * a[1][1]), Gxy: 1 / (h * a[2][2]), nuxy: -a[0][1] / a[0][0], nuyx: -a[0][1] / a[1][1],
    Efx: 12 / (h ** 3 * a[3][3]), Efy: 12 / (h ** 3 * a[4][4]), Gfxy: 12 / (h ** 3 * a[5][5]),
    etaxs: a[0][2] / a[0][0],
  };
}

export type Strengths = { Xt: number; Xc: number; Yt: number; Yc: number; S: number; F12star?: number };
export type PlyPoint = { ply: number; angle: number; pos: 'bottom' | 'top'; z: number; eps: number[]; sig: number[]; eps12: number[]; sig12: number[]; msFI: number; msMode: string; msR: number; twR: number };

/** Global strains and stresses at the bottom and top of every ply, in laminate (x, y) and ply (1, 2) axes, with
 *  failure checks. N = [Nx, Ny, Nxy], M = [Mx, My, Mxy]. */
export function plyResults(L: Laminate, N: number[], M: number[], s: Strengths) {
  const load = [...N, ...M], def = L.abd.map((r) => r.reduce((acc, x, j) => acc + x * load[j], 0));
  const e0 = def.slice(0, 3), k = def.slice(3);
  const pts: PlyPoint[] = [];
  L.angles.forEach((ang, i) => {
    for (const pos of ['bottom', 'top'] as const) {
      const z = pos === 'bottom' ? L.z[i] : L.z[i + 1];
      const eps = [0, 1, 2].map((j) => e0[j] + z * k[j]);
      const sig = L.Qb[i].map((r) => r[0] * eps[0] + r[1] * eps[1] + r[2] * eps[2]);
      const eps12 = toPlyStrain(eps, ang), sig12 = toPlyStress(sig, ang);
      const ms = maxStress(sig12, s), tw = tsaiWu(sig12, s);
      pts.push({ ply: i + 1, angle: ang, pos, z, eps, sig, eps12, sig12, msFI: ms.fi, msMode: ms.mode, msR: ms.fi > 0 ? 1 / ms.fi : Infinity, twR: tw });
    }
  });
  const minBy = (f: (p: PlyPoint) => number) => pts.reduce((b, p) => (f(p) < f(b) ? p : b), pts[0]);
  const ms = minBy((p) => p.msR), tw = minBy((p) => p.twR);
  return { e0, k, pts, firstMS: ms, firstTW: tw };
}

/** Stress in ply axes from laminate axes, ply at angle θ. */
export function toPlyStress(s: number[], deg: number): number[] {
  const t = (deg * Math.PI) / 180, m = Math.cos(t), n = Math.sin(t);
  return [m * m * s[0] + n * n * s[1] + 2 * m * n * s[2], n * n * s[0] + m * m * s[1] - 2 * m * n * s[2], -m * n * s[0] + m * n * s[1] + (m * m - n * n) * s[2]];
}
/** Engineering strain (εx, εy, γxy) in ply axes. */
export function toPlyStrain(e: number[], deg: number): number[] {
  const t = (deg * Math.PI) / 180, m = Math.cos(t), n = Math.sin(t);
  return [m * m * e[0] + n * n * e[1] + m * n * e[2], n * n * e[0] + m * m * e[1] - m * n * e[2], -2 * m * n * e[0] + 2 * m * n * e[1] + (m * m - n * n) * e[2]];
}

/** Maximum stress criterion: the largest of σ1/X, σ2/Y, |τ12|/S (X, Y tension or compression by sign). */
export function maxStress(s12: number[], s: Strengths): { fi: number; mode: string } {
  const c = [
    [s12[0] >= 0 ? s12[0] / s.Xt : -s12[0] / s.Xc, s12[0] >= 0 ? 'fibre tension' : 'fibre compression'],
    [s12[1] >= 0 ? s12[1] / s.Yt : -s12[1] / s.Yc, s12[1] >= 0 ? 'transverse tension' : 'transverse compression'],
    [Math.abs(s12[2]) / s.S, 'in-plane shear'],
  ] as [number, string][];
  const b = c.reduce((x, y) => (y[0] > x[0] ? y : x));
  return { fi: b[0], mode: b[1] };
}

/** Tsai-Wu strength ratio R: the factor on the load that brings the Tsai-Wu index to 1 (a R² + b R = 1).
 *  F12 = F12* √(F11 F22), F12* = −0.5 by default. */
export function tsaiWu(s12: number[], s: Strengths): number {
  const F1 = 1 / s.Xt - 1 / s.Xc, F2 = 1 / s.Yt - 1 / s.Yc, F11 = 1 / (s.Xt * s.Xc), F22 = 1 / (s.Yt * s.Yc), F66 = 1 / (s.S * s.S);
  const F12 = (s.F12star ?? -0.5) * Math.sqrt(F11 * F22);
  const [a1, a2, a6] = s12;
  const a = F11 * a1 * a1 + F22 * a2 * a2 + F66 * a6 * a6 + 2 * F12 * a1 * a2, b = F1 * a1 + F2 * a2;
  if (a <= 1e-300) return b > 0 ? 1 / b : Infinity;
  return (-b + Math.sqrt(b * b + 4 * a)) / (2 * a);
}
/** The Tsai-Wu index F1σ1 + F2σ2 + F11σ1² + F22σ2² + F66τ12² + 2F12σ1σ2 (failure at 1). */
export function tsaiWuIndex(s12: number[], s: Strengths): number {
  const F1 = 1 / s.Xt - 1 / s.Xc, F2 = 1 / s.Yt - 1 / s.Yc, F11 = 1 / (s.Xt * s.Xc), F22 = 1 / (s.Yt * s.Yc), F66 = 1 / (s.S * s.S);
  const F12 = (s.F12star ?? -0.5) * Math.sqrt(F11 * F22), [a1, a2, a6] = s12;
  return F1 * a1 + F2 * a2 + F11 * a1 * a1 + F22 * a2 * a2 + F66 * a6 * a6 + 2 * F12 * a1 * a2;
}

const zero3 = (): Mat3 => [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

/** Inverse of a square matrix by Gauss-Jordan with partial pivoting; throws if singular. */
export function invert(M: number[][]): number[][] {
  const n = M.length, a = M.map((r, i) => [...r, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
  const scale = Math.max(...M.flat().map(Math.abs)) || 1;
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(a[r][c]) > Math.abs(a[p][c])) p = r;
    if (Math.abs(a[p][c]) < scale * 1e-13) throw new Error('singular');
    [a[c], a[p]] = [a[p], a[c]];
    const d = a[c][c]; for (let j = 0; j < 2 * n; j++) a[c][j] /= d;
    for (let r = 0; r < n; r++) if (r !== c) { const f = a[r][c]; if (f) for (let j = 0; j < 2 * n; j++) a[r][j] -= f * a[c][j]; }
  }
  return a.map((r) => r.slice(n));
}
