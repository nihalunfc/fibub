// Echoes and SONAR: sound goes out and comes back, so distance = speed × time ÷ 2. Speed of sound in dry air from
// the ideal-gas rule v = 331.3·√(1 + T/273.15) m/s; the ear keeps a sound for about 0.1 s, so a separate echo needs
// the reflector at least v × 0.1 ÷ 2 away. Plain TypeScript, no DOM.

/** Speed of sound in dry air (m/s) at T °C. */
export const airSpeed = (T: number) => 331.3 * Math.sqrt(1 + T / 273.15);
/** Time for an echo to come back from a reflector d metres away. */
export const echoTime = (d: number, v: number) => (2 * d) / v;
/** Distance of a reflector from the echo time. */
export const distance = (t: number, v: number) => (v * t) / 2;
/** Shortest distance for a separate echo, with the ear's "persistence" time (school value 0.1 s). */
export const minEcho = (v: number, persist = 0.1) => (v * persist) / 2;
/** Typical speed of sound in sea water used in school problems (m/s); real values are about 1 450 to 1 550. */
export const SEA = 1500;
