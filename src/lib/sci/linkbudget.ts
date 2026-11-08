// Radio link budget: free-space loss, antenna gain, carrier-to-noise density, Eb/N0 and margin.
import { normInv } from './stats.ts';

export const C = 2.99792458e8, K_DB = -228.5991, R_EARTH_KM = 6371;
const db = (x: number) => 10 * Math.log10(x);

/** Free-space path loss (dB) over d metres at f hertz. */
export const fspl = (d: number, f: number) => 20 * Math.log10((4 * Math.PI * d * f) / C);
/** Gain (dBi) of a dish of diameter D (m) and aperture efficiency eta at f hertz. */
export const dishGain = (D: number, f: number, eta = 0.55) => db(eta * ((Math.PI * D * f) / C) ** 2);
/** Half-power beamwidth (degrees) of a dish, about 70 λ/D. */
export const beamwidth = (D: number, f: number) => (70 * C) / f / D;
/** Slant range (m) to a satellite at altitude h (km) seen at elevation el (degrees). */
export function slantRange(hKm: number, elDeg: number, re = R_EARTH_KM) {
  const e = (elDeg * Math.PI) / 180, r = re + hKm;
  return (Math.sqrt(r * r - (re * Math.cos(e)) ** 2) - re * Math.sin(e)) * 1000;
}

/** Eb/N0 (dB) needed for a bit error rate, for common modulations. */
export function requiredEbN0(mod: string, ber: number) {
  if (mod === 'bpsk') { const q = -normInv(ber); return db((q * q) / 2); } // Pb = Q(√(2 Eb/N0)); QPSK is the same per bit
  if (mod === 'fsk') return db(2 * Math.log(1 / (2 * ber))); // non-coherent binary FSK: Pb = ½ exp(−Eb/2N0)
  if (mod === 'cfsk') { const q = -normInv(ber); return db(q * q); } // coherent binary FSK: Pb = Q(√(Eb/N0))
  throw new Error('Unknown modulation');
}

export type Link = {
  f: number; d: number; ptW: number; gt: number; lt: number; gr: number; lr: number; tsys: number;
  latm: number; lpol: number; lpoint: number; rate: number; req: number; impl: number;
};
export function budget(l: Link) {
  if (!(l.f > 0 && l.d > 0 && l.ptW > 0 && l.tsys > 0 && l.rate > 0)) throw new Error('Frequency, distance, power, system temperature and data rate must be above zero');
  const pt = db(l.ptW), eirp = pt + l.gt - l.lt, path = fspl(l.d, l.f), gOverT = l.gr - l.lr - db(l.tsys);
  const prx = eirp - path - l.latm - l.lpol - l.lpoint + l.gr - l.lr;
  const cn0 = eirp - path - l.latm - l.lpol - l.lpoint + gOverT - K_DB;
  const ebn0 = cn0 - db(l.rate), margin = ebn0 - l.req - l.impl;
  return { pt, eirp, path, gOverT, prx, prxDbm: prx + 30, cn0, ebn0, margin, maxRate: 10 ** ((cn0 - l.req - l.impl) / 10) };
}
