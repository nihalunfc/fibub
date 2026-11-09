// Doppler shifts for sound (moving source, moving listener, wind), echoes from a moving reflector, light
// (special relativity), a source passing by, the inverse problems, and beats between two tones. No DOM.

export const C_LIGHT = 299792458;

/**
 * Frequency heard from a source of frequency f, all motion along the line between them.
 * vs: source speed towards the listener (negative = away); vo: listener speed towards the source; u: wind speed
 * blowing from the source towards the listener. NaN when the source is at or above the speed of sound.
 */
export function soundDoppler(f: number, c: number, vs: number, vo: number, u = 0) {
  const den = c + u - vs;
  if (den <= 0) return NaN;
  return (f * (c + u + vo)) / den;
}

/** Echo from a reflector approaching at v (negative = receding), with source and receiver at rest: f (c + v)/(c − v). */
export const echoDoppler = (f: number, c: number, v: number) => (v >= c ? NaN : (f * (c + v)) / (c - v));

/** Speed of a reflector from the echo frequency (positive = approaching): v = c (f2 − f)/(f2 + f). */
export const echoSpeed = (f: number, f2: number, c: number) => (c * (f2 - f)) / (f2 + f);

/** Source speed towards a listener at rest, from the frequency heard: vs = c (1 − f/f′) (wind u included in c). */
export const sourceSpeed = (f: number, heard: number, c: number, u = 0) => (c + u) * (1 - f / heard);

/** Relativistic Doppler along the line of sight, v positive when approaching: f′ = f √((1 + β)/(1 − β)). */
export const lightDoppler = (f: number, v: number) => { const b = v / C_LIGHT; return Math.abs(b) >= 1 ? NaN : f * Math.sqrt((1 + b) / (1 - b)); };

/** Approach speed (m/s, negative = receding) from the ratio f′/f for light: β = (r² − 1)/(r² + 1). */
export const lightSpeed = (ratio: number) => (C_LIGHT * (ratio * ratio - 1)) / (ratio * ratio + 1);

/** Redshift z = f/f′ − 1 (positive when receding). */
export const redshiftOf = (f: number, heard: number) => f / heard - 1;

/**
 * A source moving in a straight line at speed v past a listener at rest, closest distance d. Returns the frequency
 * heard against the listener's time (t = 0 when the sound emitted at closest approach arrives), from emission times
 * spread over ±span seconds. Needs v < c.
 */
export function passBy(f: number, c: number, v: number, d: number, span: number, n = 241) {
  const out: { t: number; f: number }[] = [];
  const t0 = d / c;
  for (let i = 0; i < n; i++) {
    const te = -span + (2 * span * i) / (n - 1), x = v * te, r = Math.hypot(x, d);
    const cosT = -x / r; // angle between the velocity and the direction from source to listener
    out.push({ t: te + r / c - t0, f: (f * c) / (c - v * cosT) });
  }
  return out;
}

/** Frequency heard at listener time t in the pass-by of passBy(), solving for the emission time exactly (v < c). */
export function heardAt(f: number, c: number, v: number, d: number, t: number) {
  const T = t + d / c, a = c * c - v * v, b = c * c * T, disc = b * b - a * (c * c * T * T - d * d);
  const te = (b - Math.sqrt(Math.max(0, disc))) / a, x = v * te, r = Math.hypot(x, d);
  return (f * c) / (c - v * (-x / r));
}

/** Mach number and the half-angle of the Mach cone (degrees, NaN below Mach 1). */
export function mach(v: number, c: number) {
  const M = Math.abs(v) / c;
  return { M, angle: M >= 1 ? (Math.asin(1 / M) * 180) / Math.PI : NaN };
}

/** Beats between two tones: beat frequency, beat period and the average (perceived) pitch. */
export function beats(f1: number, f2: number) {
  const fb = Math.abs(f1 - f2);
  return { fb, period: fb > 0 ? 1 / fb : Infinity, mean: (f1 + f2) / 2 };
}

/** Speed of sound in air (m/s) at θ °C, rounded formula 331.3 √(1 + θ/273.15). */
export const airSpeed = (tC: number) => 331.3 * Math.sqrt(1 + tC / 273.15);
