// Physical and orbital data for the planets, Pluto and the larger moons, with derived quantities and comparisons.
// Planets: NASA Planetary Fact Sheet (D. R. Williams, NSSDCA), metric values. Moons: JPL Solar System Dynamics,
// planetary satellite physical and mean orbital parameters. Moon counts: confirmed moons, mid-2025.

export const G = 6.6743e-11;
export type Body = {
  id: string; name: string; kind: 'planet' | 'dwarf' | 'moon'; parent?: string;
  mass: number; // kg
  radius: number; // km, equatorial for planets, mean for moons
  density?: number; // kg/m³, fact-sheet value (from the mean, not equatorial, radius)
  gravity?: number; // m/s², fact-sheet value (equator at the 1 bar level for the giants, rotation included)
  escape?: number; // km/s
  a: number; // km: from the Sun for planets, from the parent for moons
  period: number; // days, orbital (sidereal); negative = retrograde
  ecc: number; incl: number; // eccentricity; inclination to the ecliptic (planets) or parent's equator (moons), °
  rotation?: number; // hours, sidereal; negative = retrograde
  obliquity?: number; // °
  temp?: number; // °C, mean
  pressure?: number | null; // bar at the surface; null = no surface
  moons?: number; rings?: boolean; field?: boolean | null;
};

const p = (id: string, density: number, name: string, mass24: number, diam: number, gravity: number, escape: number, aMkm: number, period: number, ecc: number, incl: number, rotation: number, obliquity: number, temp: number, pressure: number | null, moons: number, rings: boolean, field: boolean | null, kind: Body['kind'] = 'planet'): Body =>
  ({ id, name, kind, density, mass: mass24 * 1e24, radius: diam / 2, gravity, escape, a: aMkm * 1e6, period, ecc, incl, rotation, obliquity, temp, pressure, moons, rings, field });
const m = (id: string, name: string, parent: string, mass: number, radius: number, aKm: number, period: number, ecc: number, incl: number, temp?: number): Body =>
  ({ id, name, kind: 'moon', parent, mass, radius, a: aKm, period, ecc, incl, temp, rotation: Math.abs(period) * 24 });

export const BODIES: Body[] = [
  p('mercury', 5429, 'Mercury', 0.330, 4879, 3.7, 4.3, 57.9, 88.0, 0.206, 7.0, 1407.6, 0.034, 167, 0, 0, false, true),
  p('venus', 5243, 'Venus', 4.87, 12104, 8.9, 10.4, 108.2, 224.7, 0.007, 3.4, -5832.5, 177.4, 464, 92, 0, false, false),
  p('earth', 5514, 'Earth', 5.97, 12756, 9.8, 11.2, 149.6, 365.2, 0.017, 0.0, 23.9, 23.4, 15, 1, 1, false, true),
  p('mars', 3934, 'Mars', 0.642, 6792, 3.7, 5.0, 228.0, 687.0, 0.094, 1.8, 24.6, 25.2, -65, 0.01, 2, false, false),
  p('jupiter', 1326, 'Jupiter', 1898, 142984, 23.1, 59.5, 778.5, 4331, 0.049, 1.3, 9.9, 3.1, -110, null, 97, true, true),
  p('saturn', 687, 'Saturn', 568, 120536, 9.0, 35.5, 1432.0, 10747, 0.052, 2.5, 10.7, 26.7, -140, null, 274, true, true),
  p('uranus', 1270, 'Uranus', 86.8, 51118, 8.7, 21.3, 2867.0, 30589, 0.047, 0.8, -17.2, 97.8, -195, null, 29, true, true),
  p('neptune', 1638, 'Neptune', 102, 49528, 11.0, 23.5, 4515.0, 59800, 0.010, 1.8, 16.1, 28.3, -200, null, 16, true, true),
  p('pluto', 1850, 'Pluto', 0.0130, 2376, 0.7, 1.3, 5906.4, 90560, 0.244, 17.2, -153.3, 122.5, -225, 0.00001, 5, false, null, 'dwarf'),
  m('moon', 'Moon', 'earth', 7.346e22, 1737.4, 384400, 27.322, 0.0549, 5.145, -20),
  m('phobos', 'Phobos', 'mars', 1.0659e16, 11.08, 9376, 0.319, 0.0151, 1.08),
  m('io', 'Io', 'jupiter', 8.932e22, 1821.6, 421800, 1.769, 0.004, 0.04, -143),
  m('europa', 'Europa', 'jupiter', 4.800e22, 1560.8, 671100, 3.551, 0.009, 0.47, -171),
  m('ganymede', 'Ganymede', 'jupiter', 1.4819e23, 2631.2, 1070400, 7.155, 0.001, 0.18, -163),
  m('callisto', 'Callisto', 'jupiter', 1.0759e23, 2410.3, 1882700, 16.69, 0.007, 0.19, -139),
  m('enceladus', 'Enceladus', 'saturn', 1.0802e20, 252.1, 238400, 1.370, 0.005, 0.0, -198),
  m('titan', 'Titan', 'saturn', 1.3452e23, 2574.7, 1221900, 15.945, 0.029, 0.33, -179),
  m('titania', 'Titania', 'uranus', 3.42e21, 788.9, 436300, 8.706, 0.001, 0.08),
  m('triton', 'Triton', 'neptune', 2.139e22, 1352.6, 354800, -5.877, 0.000, 157.3, -235),
  m('charon', 'Charon', 'pluto', 1.586e21, 606.0, 19596, 6.387, 0.000, 0.0, -220),
];

const byId = new Map(BODIES.map((b) => [b.id, b]));
export const body = (id: string) => byId.get(id);

/** Derived values: volume, density, gravity and escape speed (fact-sheet values for planets where given). */
export function derived(b: Body) {
  const R = b.radius * 1000, vol = (4 / 3) * Math.PI * R ** 3;
  return {
    density: b.density ?? b.mass / vol, // kg/m³
    volume: vol / 1e9, // km³
    gravity: b.gravity ?? (G * b.mass) / (R * R),
    escape: b.escape ?? Math.sqrt((2 * G * b.mass) / R) / 1000,
    orbitalSpeed: (2 * Math.PI * b.a) / (Math.abs(b.period) * 86400), // km/s, mean
    dayHours: b.rotation,
  };
}

export type Quantity = { id: string; label: string; unit: string; get: (b: Body) => number | undefined; log: boolean };
export const QUANTITIES: Quantity[] = [
  { id: 'radius', label: 'Radius', unit: 'km', get: (b) => b.radius, log: true },
  { id: 'mass', label: 'Mass', unit: 'kg', get: (b) => b.mass, log: true },
  { id: 'density', label: 'Density', unit: 'kg/m³', get: (b) => derived(b).density, log: false },
  { id: 'gravity', label: 'Surface gravity', unit: 'm/s²', get: (b) => derived(b).gravity, log: true },
  { id: 'escape', label: 'Escape speed', unit: 'km/s', get: (b) => derived(b).escape, log: true },
  { id: 'a', label: 'Orbit size (semi-major axis)', unit: 'km', get: (b) => b.a, log: true },
  { id: 'period', label: 'Orbital period', unit: 'days', get: (b) => Math.abs(b.period), log: true },
  { id: 'speed', label: 'Mean orbital speed', unit: 'km/s', get: (b) => derived(b).orbitalSpeed, log: true },
  { id: 'ecc', label: 'Eccentricity', unit: '', get: (b) => b.ecc, log: false },
  { id: 'rotation', label: 'Rotation period', unit: 'hours', get: (b) => (b.rotation === undefined ? undefined : Math.abs(b.rotation)), log: true },
  { id: 'obliquity', label: 'Axial tilt', unit: '°', get: (b) => b.obliquity, log: false },
  { id: 'temp', label: 'Mean temperature', unit: '°C', get: (b) => b.temp, log: false },
];

/** Weight (in kilograms-force, as a bathroom scale shows) on body b for a mass that weighs `kg` on Earth. */
export const weightOn = (b: Body, kg: number) => (kg * derived(b).gravity) / derived(byId.get('earth')!).gravity;

/** Kepler's third law check: P² / a³ for planets in years and AU (1 for the Sun's family), or the parent's mass from a moon. */
export function parentMassFromOrbit(b: Body) {
  const a = b.a * 1000, P = Math.abs(b.period) * 86400;
  return (4 * Math.PI * Math.PI * a ** 3) / (G * P * P);
}

/** Light travel time from the Sun (planets) in minutes, using the semi-major axis. */
export const lightMinutes = (b: Body) => (b.kind === 'moon' ? NaN : b.a / 299792.458 / 60);
