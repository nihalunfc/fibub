// Seawater properties from TEOS-10 (IOC, SCOR and IAPSO 2010, The international thermodynamic equation of seawater
// 2010), as in the Gibbs SeaWater (GSW) Oceanographic Toolbox: practical salinity from conductivity (PSS-78, UNESCO 1983,
// with Hill et al. 1986 below SP = 2), potential and Conservative Temperature from the Gibbs function (Feistel 2008,
// IAPWS 2008), density, expansion coefficients and sound speed from the 75-term polynomial for specific volume
// (Roquet et al. 2015, Ocean Modelling 90, 29), depth from pressure (Saunders and Fofonoff 1976, as in GSW), and N²
// as gsw_Nsquared. Absolute Salinity is taken as Reference Salinity, SA = SR = (35.16504/35)·SP, i.e. the small
// regional anomaly δSA from the GSW atlas is not applied (it is below about 0.02 g/kg in most of the open ocean).
//
// The coefficients and the order of the calculations come from the GSW-C code (version 3.05, via GSW-Python 3.6.19),
// whose licence notice follows:
//
//   Copyright (c) 2011, SCOR/IAPSO WG127 (Scientific Committee on Oceanic Research/ International Association for the
//   Physical Sciences of the Oceans, Working Group 127). Copyright 2017-2020 Eric Firing and contributors.
//   All rights reserved.
//   Redistribution and use, in source and binary forms, without modification, is permitted provided that the
//   following conditions are met:
//   • Redistributions of source code must retain the above copyright notice, this list of conditions and the
//     following disclaimer.
//   • Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the
//     following disclaimer in the documentation and/or other materials provided with the distribution.
//   • Neither the name of SCOR/IAPSO WG127 nor the names of its contributors may be used to endorse or promote
//     products derived from this software without specific prior written permission.
//   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED
//   WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
//   PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY
//   DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
//   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
//   CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
//   OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//   The software is available from http://www.TEOS-10.org

export const SSO = 35.16504, UPS = SSO / 35, SFAC = 0.0248826675584615, OFFSET = 5.971840214030754e-1, CP0 = 3991.86795711963, T0 = 273.15;
const C3515 = 42.914, GAMMA = 2.26e-7, DB2PA = 1e4;

// ---------- PSS-78 ----------
const A = [0.008, -0.1692, 25.3851, 14.0941, -7.0261, 2.7081], B = [0.0005, -0.0056, -0.0066, -0.0375, 0.0636, -0.0144];
const Cc = [0.6766097, 2.00564e-2, 1.104259e-4, -6.9698e-7, 1.0031e-9], D = [3.426e-2, 4.464e-4, 4.215e-1, -3.107e-3], E = [2.07e-5, -6.37e-10, 3.989e-15], K = 0.0162;
const poly5 = (c: number[], x: number) => c[0] + (c[1] + (c[2] + (c[3] + (c[4] + c[5] * x) * x) * x) * x) * x;
const dpoly5 = (c: number[], x: number) => c[1] + (2 * c[2] + (3 * c[3] + (4 * c[4] + 5 * c[5] * x) * x) * x) * x;
function hillRatioAtSP2(t: number) {
  const t68 = t * 1.00024, ft68 = (t68 - 15) / (1 + K * (t68 - 15));
  const G = [2.641463563366498e-1, 2.007883247811176e-4, -4.107694432853053e-6, 8.401670882091225e-8, -1.71139202198921e-9, 3.37419389337738e-11, -5.923731174730784e-13, 8.057771569962299e-15, -7.054313817447962e-17, 2.859992717347235e-19];
  let rtx0 = 0; for (let i = 9; i >= 0; i--) rtx0 = G[i] + t68 * rtx0;
  const spAt = (r: number) => poly5(A, r) + ft68 * poly5(B, r), dAt = (r: number) => dpoly5(A, r) + ft68 * dpoly5(B, r);
  const spEst = spAt(rtx0);
  let rtx = rtx0 - (spEst - 2) / dAt(rtx0);
  rtx = rtx0 - (spEst - 2) / dAt(0.5 * (rtx + rtx0));
  const x = 400 * rtx * rtx, sq = 10 * rtx;
  return 2 / (2 - A[0] / (1 + x * (1.5 + x)) - (B[0] * ft68) / (1 + sq * (1 + sq * (1 + sq))));
}
/** Practical salinity from conductivity C (mS/cm), in-situ temperature t (°C, ITS-90) and sea pressure p (dbar). NaN if below zero. */
export function spFromC(C: number, t: number, p: number): number {
  const t68 = t * 1.00024, ft68 = (t68 - 15) / (1 + K * (t68 - 15)), r = C / C3515;
  const rtLc = Cc[0] + (Cc[1] + (Cc[2] + (Cc[3] + Cc[4] * t68) * t68) * t68) * t68;
  const rp = 1 + (p * (E[0] + E[1] * p + E[2] * p * p)) / (1 + D[0] * t68 + D[1] * t68 * t68 + (D[2] + D[3] * t68) * r);
  const rt = r / (rp * rtLc);
  if (!(rt >= 0)) return NaN;
  const rtx = Math.sqrt(rt);
  let sp = poly5(A, rtx) + ft68 * poly5(B, rtx);
  if (sp < 2) {
    const x = 400 * rt, sq = 10 * rtx;
    sp = hillRatioAtSP2(t) * (sp - A[0] / (1 + x * (1.5 + x)) - (B[0] * ft68) / (1 + sq * (1 + sq * (1 + sq))));
  }
  return sp < 0 ? NaN : sp;
}
/** Conductivity (mS/cm) from practical salinity, by inverting spFromC (Newton with a bracket). */
export function cFromSp(SP: number, t: number, p: number): number {
  let lo = 0, hi = 120;
  for (let i = 0; i < 200 && hi - lo > 1e-13; i++) { const m = (lo + hi) / 2, s = spFromC(m, t, p); if (!(s >= SP) || Number.isNaN(s)) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
/** Reference Salinity (g/kg), used here as Absolute Salinity. */
export const srFromSp = (SP: number) => SP * UPS;

// ---------- Gibbs function pieces (potential and Conservative Temperature) ----------
function entropyPart(SA: number, t: number, p: number) {
  const x2 = SFAC * SA, x = Math.sqrt(x2), y = t * 0.025, z = p * 1e-4;
  const g03 = z*(-270.983805184062 + z*(776.153611613101 + z*(-196.51255088122 + (28.9796526294175 - 2.13290083518327*z)*z))) + y*(-24715.571866078 + z*(2910.0729080936 + z*(-1513.116771538718 + z*(546.959324647056 + z*(-111.1208127634436 + 8.68841343834394*z)))) + y*(2210.2236124548363 + z*(-2017.52334943521 + z*(1498.081172457456 + z*(-718.6359919632359 + (146.4037555781616 - 4.9892131862671505*z)*z))) + y*(-592.743745734632 + z*(1591.873781627888 + z*(-1207.261522487504 + (608.785486935364 - 105.4993508931208*z)*z)) + y*(290.12956292128547 + z*(-973.091553087975 + z*(602.603274510125 + z*(-276.361526170076 + 32.40953340386105*z))) + y*(-113.90630790850321 + y*(21.35571525415769 - 67.41756835751434*z) + z*(381.06836198507096 + z*(-133.7383902842754 + 49.023632509086724*z)))))));
  const g08 = x2*(z*(729.116529735046 + z*(-343.956902961561 + z*(124.687671116248 + z*(-31.656964386073 + 7.04658803315449*z)))) + x*( x*(y*(-137.1145018408982 + y*(148.10030845687618 + y*(-68.5590309679152 + 12.4848504784754*y))) - 22.6683558512829*z) + z*(-175.292041186547 + (83.1923927801819 - 29.483064349429*z)*z) + y*(-86.1329351956084 + z*(766.116132004952 + z*(-108.3834525034224 + 51.2796974779828*z)) + y*(-30.0682112585625 - 1380.9597954037708*z + y*(3.50240264723578 + 938.26075044542*z)))) + y*(1760.062705994408 + y*(-675.802947790203 + y*(365.7041791005036 + y*(-108.30162043765552 + 12.78101825083098*y) + z*(-1190.914967948748 + (298.904564555024 - 145.9491676006352*z)*z)) + z*(2082.7344423998043 + z*(-614.668925894709 + (340.685093521782 - 33.3848202979239*z)*z))) + z*(-1721.528607567954 + z*(674.819060538734 + z*(-356.629112415276 + (88.4080716616 - 15.84003094423364*z)*z)))));
  return -(g03 + g08) * 0.025;
}
function entropyPartZeroP(SA: number, pt0: number) {
  const x2 = SFAC * SA, x = Math.sqrt(x2), y = pt0 * 0.025;
  const g03 = y*(-24715.571866078 + y*(2210.2236124548363 + y*(-592.743745734632 + y*(290.12956292128547 + y*(-113.90630790850321 + y*21.35571525415769)))));
  const g08 = x2*(x*(x*(y*(-137.1145018408982 + y*(148.10030845687618 + y*(-68.5590309679152 + 12.4848504784754*y)))) + y*(-86.1329351956084 + y*(-30.0682112585625 + y*3.50240264723578))) + y*(1760.062705994408 + y*(-675.802947790203 + y*(365.7041791005036 + y*(-108.30162043765552 + 12.78101825083098*y)))));
  return -(g03 + g08) * 0.025;
}
function gibbsPt0Pt0(SA: number, pt0: number) {
  const x2 = SFAC * SA, x = Math.sqrt(x2), y = pt0 * 0.025;
  const g03 = -24715.571866078 + y*(4420.4472249096725 + y*(-1778.231237203896 + y*(1160.5182516851419 + y*(-569.531539542516 + y*128.13429152494615))));
  const g08 = x2*(1760.062705994408 + x*(-86.1329351956084 + x*(-137.1145018408982 + y*(296.20061691375236 + y*(-205.67709290374563 + 49.9394019139016*y))) + y*(-60.136422517125 + y*10.50720794170734)) + y*(-1351.605895580406 + y*(1097.1125373015109 + y*(-433.20648175062206 + 63.905091254154904*y))));
  return (g03 + g08) * 0.000625;
}
/** Potential temperature (°C) referenced to 0 dbar, from in-situ temperature. */
export function pt0FromT(SA: number, t: number, p: number): number {
  const s1 = SA / UPS;
  let pt0 = t+p*( 8.65483913395442e-6 - s1 * 1.41636299744881e-6 - p * 7.38286467135737e-9 + t *(-8.38241357039698e-6 + s1 * 2.83933368585534e-8 + t * 1.77803965218656e-8 + p * 1.71155619208233e-10));
  let dEdT = CP0 / ((T0 + pt0) * (1 - 0.05 * (1 - SA / SSO)));
  const trueE = entropyPart(SA, t, p);
  for (let it = 0; it < 2; it++) {
    const old = pt0, dE = entropyPartZeroP(SA, old) - trueE;
    pt0 = old - dE / dEdT;
    dEdT = -gibbsPt0Pt0(SA, 0.5 * (pt0 + old));
    pt0 = old - dE / dEdT;
  }
  return pt0;
}
/** Conservative Temperature (°C) from potential temperature (ref. 0 dbar). */
export function ctFromPt(SA: number, pt: number): number {
  const x2 = SFAC * SA, x = Math.sqrt(x2), y = pt * 0.025;
  const potEnthalpy = 61.01362420681071 + y*(168776.46138048015 + y*(-2735.2785605119625 + y*(2574.2164453821433 + y*(-1536.6644434977543 + y*(545.7340497931629 + (-50.91091728474331 - 18.30489878927802*y)*y))))) + x2*(268.5520265845071 + y*(-12019.028203559312 + y*(3734.858026725145 + y*(-2046.7671145057618 + y*(465.28655623826234 + (-0.6370820302376359 - 10.650848542359153*y)*y)))) + x*(937.2099110620707 + y*(588.1802812170108+ y*(248.39476522971285 + (-3.871557904936333- 2.6268019854268356*y)*y)) + x*(-1687.914374187449 + x*(246.9598888781377 + x*(123.59576582457964 - 48.5891069025409*x)) + y*(936.3206544460336 + y*(-942.7827304544439 + y*(369.4389437509002 + (-33.83664947895248 - 9.987880382780322*y)*y))))));
  return potEnthalpy / CP0;
}
export const ctFromT = (SA: number, t: number, p: number) => ctFromPt(SA, pt0FromT(SA, t, p));

// ---------- 75-term specific volume (Roquet et al. 2015) ----------
/** [power of ys, power of xs, power of z, coefficient]; ys = CT/40, xs = √(SFAC·SA + OFFSET), z = p/10⁴. */
const V: [number, number, number, number][] = [[0,0,0,1.0769995862e-3], [0,0,1,-6.0799143809e-5], [0,0,2,9.9856169219e-6], [0,0,3,-1.1309361437e-6], [0,0,4,1.0531153080e-7], [0,0,5,-1.2647261286e-8], [0,0,6,1.9613503930e-9], [0,1,0,-3.1038981976e-4], [0,1,1,2.4262468747e-5], [0,1,2,-5.8484432984e-7], [0,1,3,3.6310188515e-7], [0,1,4,-1.1147125423e-7], [0,2,0,6.6928067038e-4], [0,2,1,-3.4792460974e-5], [0,2,2,-4.8122251597e-6], [0,2,3,1.6746303780e-8], [0,3,0,-8.5047933937e-4], [0,3,1,3.7470777305e-5], [0,3,2,4.9263106998e-6], [0,4,0,5.8086069943e-4], [0,4,1,-1.7322218612e-5], [0,4,2,-1.7811974727e-6], [0,5,0,-2.1092370507e-4], [0,5,1,3.0927427253e-6], [0,6,0,3.1932457305e-5], [1,0,0,-1.5649734675e-5], [1,0,1,1.8505765429e-5], [1,0,2,-1.1736386731e-6], [1,0,3,-3.6527006553e-7], [1,0,4,3.1454099902e-7], [1,1,0,3.5009599764e-5], [1,1,1,-9.5677088156e-6], [1,1,2,-5.5699154557e-6], [1,1,3,-2.7295696237e-7], [1,2,0,-4.3592678561e-5], [1,2,1,1.1100834765e-5], [1,2,2,5.4620748834e-6], [1,3,0,3.4532461828e-5], [1,3,1,-9.8447117844e-6], [1,3,2,-1.3544185627e-6], [1,4,0,-1.1959409788e-5], [1,4,1,2.5909225260e-6], [1,5,0,1.3864594581e-6], [2,0,0,2.7762106484e-5], [2,0,1,-1.1716606853e-5], [2,0,2,2.1305028740e-6], [2,0,3,2.8695905159e-7], [2,1,0,-3.7435842344e-5], [2,1,1,-2.3678308361e-7], [2,1,2,3.9137387080e-7], [2,2,0,3.5907822760e-5], [2,2,1,2.9283346295e-6], [2,2,2,-6.5731104067e-7], [2,3,0,-1.8698584187e-5], [2,3,1,-4.8826139200e-7], [2,4,0,3.8595339244e-6], [3,0,0,-1.6521159259e-5], [3,0,1,7.9279656173e-6], [3,0,2,-4.6132540037e-7], [3,1,0,2.4141479483e-5], [3,1,1,-3.4558773655e-6], [3,1,2,7.7618888092e-9], [3,2,0,-1.4353633048e-5], [3,2,1,3.1655306078e-7], [3,3,0,2.2863324556e-6], [4,0,0,6.9111322702e-6], [4,0,1,-3.4102187482e-6], [4,0,2,-6.3352916514e-8], [4,1,0,-8.7595873154e-6], [4,1,1,1.2956717783e-6], [4,2,0,4.3703680598e-6], [5,0,0,-8.0539615540e-7], [5,0,1,5.0736766814e-7], [5,1,0,-3.3052758900e-7], [6,0,0,2.0543094268e-7]];
/** Specific volume (m³/kg) and its derivatives with respect to SA (g/kg), CT (°C) and p (dbar). */
export function specvolAll(SA: number, CT: number, p: number) {
  const xs = Math.sqrt(SFAC * SA + OFFSET), ys = CT * 0.025, z = p * 1e-4;
  let v = 0, vx = 0, vy = 0, vz = 0;
  for (const [i, j, k, c] of V) {
    const yi = ys ** i, xj = xs ** j, zk = z ** k;
    v += c * yi * xj * zk;
    if (j) vx += c * j * yi * xs ** (j - 1) * zk;
    if (i) vy += c * i * ys ** (i - 1) * xj * zk;
    if (k) vz += c * k * yi * xj * z ** (k - 1);
  }
  return { v, vSA: (vx * SFAC) / (2 * xs), vCT: vy * 0.025, vP: vz * 1e-4 };
}
export const specvol = (SA: number, CT: number, p: number) => specvolAll(SA, CT, p).v;
export const rho = (SA: number, CT: number, p: number) => 1 / specvol(SA, CT, p);
export const sigma0 = (SA: number, CT: number) => 1 / specvol(SA, CT, 0) - 1000;
/** Thermal expansion α (1/K) and saline contraction β (kg/g), both at constant pressure. */
export function alphaBeta(SA: number, CT: number, p: number) { const s = specvolAll(SA, CT, p); return { alpha: s.vCT / s.v, beta: -s.vSA / s.v }; }
/** Speed of sound (m/s). */
export function soundSpeed(SA: number, CT: number, p: number) { const s = specvolAll(SA, CT, p); return s.v * Math.sqrt(DB2PA / -s.vP); }

// ---------- gravity, depth, stability ----------
const H006 = -2.107876881e-9, H007 = 2.8019291329e-10;
function enthalpySso0(p: number) {
  const z = p * 1e-4;
  return z * (9.72661385484387e-4 + z * (-2.252956605630465e-5 + z * (2.376909655387404e-6 + z * (-1.664294869986011e-7 + z * (-5.988108894465758e-9 + z * (H006 + H007 * z)))))) * DB2PA * 1e4;
}
/** Height z (m, negative below the sea surface) from sea pressure (dbar) and latitude (°). */
export function zFromP(p: number, lat: number): number {
  const x = Math.sin((lat * Math.PI) / 180), s2 = x * x, b = 9.780327 * (1 + (5.2792e-3 + 2.32e-5 * s2) * s2), a = -0.5 * GAMMA * b, c = enthalpySso0(p);
  return (-2 * c) / (b + Math.sqrt(b * b - 4 * a * c));
}
export function grav(lat: number, p: number): number {
  const x = Math.sin((lat * Math.PI) / 180), s2 = x * x;
  return 9.780327 * (1 + (5.2792e-3 + 2.32e-5 * s2) * s2) * (1 - GAMMA * zFromP(p, lat));
}
/** Buoyancy frequency squared N² (1/s²) between neighbouring levels, at the mid pressures (gsw_Nsquared). */
export function nSquared(SA: number[], CT: number[], p: number[], lat: number) {
  const n2: number[] = [], pMid: number[] = [];
  for (let k = 0; k < p.length - 1; k++) {
    const g = 0.5 * (grav(lat, p[k]) + grav(lat, p[k + 1])), sm = 0.5 * (SA[k] + SA[k + 1]), cm = 0.5 * (CT[k] + CT[k + 1]), pm = 0.5 * (p[k] + p[k + 1]);
    const r = rho(sm, cm, pm), ab = alphaBeta(sm, cm, pm);
    n2.push(g * g * (r / (DB2PA * (p[k + 1] - p[k]))) * (ab.beta * (SA[k + 1] - SA[k]) - ab.alpha * (CT[k + 1] - CT[k])));
    pMid.push(pm);
  }
  return { n2, pMid };
}

/**
 * Mixed layer depth by a threshold (de Boyer Montégut et al. 2004): the first pressure below the reference level
 * where σ0 exceeds its reference value by `dSigma` (kg/m³) or where θ differs by more than `dTemp` (°C), linearly
 * interpolated. Returns NaN if the threshold is never crossed.
 */
export function mixedLayer(p: number[], value: number[], pRef: number, threshold: number, kind: 'density' | 'temperature'): number {
  // Reference value: interpolated at pRef (or the first level below it).
  let i0 = p.findIndex((x) => x >= pRef);
  if (i0 < 0) return NaN;
  const ref = i0 > 0 && p[i0] !== pRef ? value[i0 - 1] + ((value[i0] - value[i0 - 1]) * (pRef - p[i0 - 1])) / (p[i0] - p[i0 - 1]) : value[i0];
  const crossed = (x: number) => (kind === 'density' ? x - ref >= threshold : Math.abs(x - ref) >= threshold);
  const d = (x: number) => (kind === 'density' ? x - ref : Math.abs(x - ref));
  for (let i = i0 + 1; i < p.length; i++) {
    if (crossed(value[i])) { const a = d(value[i - 1]), b = d(value[i]); const f = b === a ? 1 : (threshold - a) / (b - a); return p[i - 1] + Math.min(1, Math.max(0, f)) * (p[i] - p[i - 1]); }
  }
  return NaN;
}

export type Level = { p: number; t: number; SP: number; SA: number; CT: number; pt: number; rho: number; sigma0: number; c: number; z: number; alpha: number; beta: number };
/** Everything for one sample: salinity from conductivity (mS/cm) when SP is not given. */
export function properties(t: number, p: number, lat: number, s: { SP?: number; C?: number }): Level {
  const SP = s.SP ?? spFromC(s.C!, t, p);
  const SA = srFromSp(SP), CT = ctFromT(SA, t, p), ab = alphaBeta(SA, CT, p);
  return { p, t, SP, SA, CT, pt: pt0FromT(SA, t, p), rho: rho(SA, CT, p), sigma0: sigma0(SA, CT), c: soundSpeed(SA, CT, p), z: zFromP(p, lat), alpha: ab.alpha, beta: ab.beta };
}
