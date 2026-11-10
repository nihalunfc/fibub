// Cyclone builder (Learn #1223): air rushing into a low over a warm sea, turned by the Earth's spin (the Coriolis
// effect). Plain TypeScript, no DOM. Seen from above, x east and y north, in a box from −1 to 1.
// Each parcel feels a pull toward the low, the Coriolis turn a = (f v, −f u) (to the right in the north, to the left
// in the south) and friction. The Coriolis parameter is f = 2Ω sin(latitude).
// The storm's growth is a teaching rule: it only grows when the sea is warm enough, the latitude is far enough from
// the equator and the spin is switched on.

export const OMEGA = 7.2921159e-5; // rad/s, Earth's rotation rate (sidereal day)
/** Coriolis parameter (1/s) at a latitude in degrees. */
export const coriolis = (lat: number) => 2 * OMEGA * Math.sin((lat * Math.PI) / 180);
/** Which way moving air is turned. */
export const turn = (lat: number) => (Math.abs(lat) < 1e-9 ? 'none' : lat > 0 ? 'right' : 'left');
/** Which way a cyclone spins, seen from above. */
export const spinWay = (lat: number) => (Math.abs(lat) < 1e-9 ? 'none' : lat > 0 ? 'anticlockwise' : 'clockwise');

/** Commonly quoted rule of thumb: tropical cyclones need a sea at least about 26.5 °C. */
export const SST_MIN = 26.5;
/** Cyclones almost never form within about 5° of the equator, where the Coriolis effect is too weak. */
export const LAT_MIN = 5;

export type Why = { grows: boolean; reasons: string[] };
export function conditions(sst: number, lat: number, spinOn: boolean): Why {
  const reasons: string[] = [];
  if (sst < SST_MIN) reasons.push(`The sea is too cool (${sst} °C). Below about ${SST_MIN} °C there is not enough warm, moist air rising to feed a storm.`);
  if (!spinOn) reasons.push('The Earth\'s spin is switched off, so the wind rushes straight into the low and fills it up.');
  else if (Math.abs(lat) < LAT_MIN) reasons.push(`It is too close to the equator (${Math.abs(lat)}°). The Coriolis effect is almost zero there, so the wind barely turns and fills the low.`);
  return { grows: reasons.length === 0, reasons };
}

export type Parcel = { x: number; y: number; u: number; v: number; age: number };
export type Storm = { ps: Parcel[]; S: number; t: number; rises: number };
const spawn = (rnd: () => number): Parcel => { const a = rnd() * 2 * Math.PI, r = 0.8 + 0.18 * rnd(); return { x: r * Math.cos(a), y: r * Math.sin(a), u: 0, v: 0, age: 0 }; };
export function makeStorm(n: number, rnd: () => number): Storm {
  return { ps: Array.from({ length: n }, () => spawn(rnd)), S: 0.05, t: 0, rises: 0 };
}

/** Turning strength in the picture: f scaled so that 30° gives 2.4 per second (teaching scale). */
export const fScaled = (lat: number, spinOn: boolean) => (spinOn ? (2.4 * coriolis(lat)) / coriolis(30) : 0);

/** Move the storm on by dt seconds. */
export function stepStorm(st: Storm, dt: number, sst: number, lat: number, spinOn: boolean, rnd: () => number) {
  const n = Math.max(1, Math.ceil(dt / 0.01)), h = dt / n, f = fScaled(lat, spinOn), k = 0.5;
  const ok = conditions(sst, lat, spinOn).grows, rate = 0.25 * Math.min(1.5, Math.max(0.2, (sst - SST_MIN + 1) / 3));
  for (let s = 0; s < n; s++) {
    st.S += ok ? rate * st.S * (1 - st.S) * h : -0.25 * st.S * h;
    st.S = Math.max(0.02, Math.min(1, st.S));
    const pull = 0.6 + 2.4 * st.S;
    for (let i = 0; i < st.ps.length; i++) {
      const p = st.ps[i], r2 = p.x * p.x + p.y * p.y, g = (pull * Math.sqrt(r2)) / (r2 + 0.04);
      const r = Math.sqrt(r2) || 1e-9, ax = (-g * p.x) / r + f * p.v - k * p.u, ay = (-g * p.y) / r - f * p.u - k * p.v;
      p.u += ax * h; p.v += ay * h; p.x += p.u * h; p.y += p.v * h; p.age += h;
      // air reaching the middle rises (in the eye wall) and fresh air comes in from the edge
      if (r2 < 0.012 || r2 > 1.6 || p.age > 25) { st.ps[i] = spawn(rnd); if (r2 < 0.012) st.rises++; }
    }
    st.t += h;
  }
}
/** Average spin of the parcels, (x v − y u)/r: positive = anticlockwise seen from above. */
export function spin(st: Storm) {
  let s = 0, n = 0;
  for (const p of st.ps) { const r = Math.hypot(p.x, p.y); if (r > 0.05 && r < 0.9) { s += (p.x * p.v - p.y * p.u) / r; n++; } }
  return n ? s / n : 0;
}
/** Average inward speed of the parcels (positive = toward the middle). */
export function inflow(st: Storm) {
  let s = 0, n = 0;
  for (const p of st.ps) { const r = Math.hypot(p.x, p.y); if (r > 0.05 && r < 0.9) { s += -(p.x * p.u + p.y * p.v) / r; n++; } }
  return n ? s / n : 0;
}
/** Words for the storm strength 0..1 (not an official scale). */
export const stage = (S: number) => (S < 0.15 ? 'a weak low' : S < 0.45 ? 'a growing storm' : S < 0.8 ? 'a cyclone' : 'a strong cyclone');

export type Q = { q: string; ans: number; unit?: string; tol?: number; abs?: number; choices?: string[]; work: string };
/** Fresh "Check yourself" questions; lvl '8' or '11'. */
export function questions(lvl: string, rnd: () => number = Math.random): Q[] {
  const ri = (lo: number, hi: number) => lo + Math.floor(rnd() * (hi - lo + 1));
  const north = rnd() < 0.5;
  const out: Q[] = [
    { q: `Seen from above, which way does a cyclone in the ${north ? 'northern' : 'southern'} hemisphere spin?`, ans: north ? 1 : 0, choices: ['Clockwise', 'Anticlockwise', 'It does not spin'], work: north ? 'In the north the Coriolis effect turns moving air to the right. Air rushing in toward the low keeps turning right, so it circles anticlockwise.' : 'In the south the Coriolis effect turns moving air to the left, so air rushing in toward the low circles clockwise.' },
    { q: 'Why do cyclones form over warm seas and not over land?', ans: 2, choices: ['Land is too heavy', 'The Sun does not shine on land', 'Warm sea water gives off moist air whose heat feeds the storm', 'Wind cannot blow over land'], work: 'Warm water evaporates into the air. When that moist air rises and its vapour turns back into water, it gives out heat, which keeps the air rising and the pressure low. Over land the supply of moisture stops and the storm weakens.' },
    { q: 'Why do cyclones almost never form right on the equator?', ans: 0, choices: ['The Coriolis effect is almost zero there', 'The sea is too cold there', 'There is no wind there', 'The air pressure is too high there'], work: 'The Coriolis effect is 2Ω sin(latitude), which is zero at the equator. Without it the inflowing air does not turn, so it fills the low instead of spinning round it.' },
  ];
  if (lvl === '11') {
    const lat = ri(5, 40);
    out.push({ q: `Work out the Coriolis parameter f = 2Ω sin φ at ${lat}° latitude, in units of 10⁻⁵ per second. (Ω = 7.29 × 10⁻⁵ rad/s)`, ans: (2 * 7.29e-5 * Math.sin((lat * Math.PI) / 180)) * 1e5, unit: '× 10⁻⁵ s⁻¹', work: `f = 2 × 7.29 × 10⁻⁵ × sin ${lat}° = 2 × 7.29 × 10⁻⁵ × ${Math.sin((lat * Math.PI) / 180).toFixed(4)} = ${(2 * 7.29 * Math.sin((lat * Math.PI) / 180)).toFixed(3)} × 10⁻⁵ s⁻¹.` });
  }
  return out;
}
