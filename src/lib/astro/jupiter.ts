// Jupiter's Galilean moons as seen from Earth: positions east and west of the planet, and their
// transits, shadow transits, occultations and eclipses.
import * as A from 'astronomy-engine';

export const MOONS = ['Io', 'Europa', 'Ganymede', 'Callisto'] as const;
export type MoonName = typeof MOONS[number];
const KEYS = ['io', 'europa', 'ganymede', 'callisto'] as const;
const RJ_AU = 71492 / 149597870.7; // equatorial radius
const C_AU_DAY = 173.1446326846693;

type V = { x: number; y: number; z: number };
const dot = (a: V, b: V) => a.x * b.x + a.y * b.y + a.z * b.z;
const len = (a: V) => Math.sqrt(dot(a, a));
const scale = (a: V, k: number): V => ({ x: a.x * k, y: a.y * k, z: a.z * k });
const sub = (a: V, b: V): V => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
const unit = (a: V) => scale(a, 1 / len(a));
const cross = (a: V, b: V): V => ({ x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x });

export type MoonState = {
  name: MoonName;
  /** Offsets on the sky from Jupiter's centre in Jupiter radii: east (left in a normal view, positive) and north. */
  east: number; north: number;
  /** Positive when the moon is farther from us than Jupiter's centre. */
  behind: boolean;
  transit: boolean; occulted: boolean; shadow: boolean; eclipsed: boolean;
  /** Where the shadow falls on the disc, if it does (Jupiter radii). */
  shadowEast: number | null; shadowNorth: number | null;
};

/** The four moons as seen from Earth at time t (light-time corrected). Also Jupiter's apparent radius in arcseconds. */
export function moonsAt(t: Date) {
  const g = A.GeoVector(A.Body.Jupiter, t, true), dist = len(g), n = unit(g);
  const tj = new Date(t.getTime() - (dist / C_AU_DAY) * 864e5);
  const jm = A.JupiterMoons(tj), hj = A.HelioVector(A.Body.Jupiter, tj), u = unit(hj); // u: sunlight direction at Jupiter
  const east = unit(cross({ x: 0, y: 0, z: 1 }, n)), north = cross(n, east);
  const moons: MoonState[] = KEYS.map((k, i) => {
    const r: V = jm[k]; // relative to Jupiter, EQJ, AU
    const e = dot(r, east) / RJ_AU, no = dot(r, north) / RJ_AU, depth = dot(r, n), sky = Math.hypot(e, no);
    // Shadow: the line from the moon away from the Sun meets the planet when the moon is on the sunward side.
    const along = dot(r, u), perp = len(sub(r, scale(u, along))) / RJ_AU;
    let shadow = false, se: number | null = null, sn: number | null = null;
    if (along < 0 && perp < 1) {
      const tHit = -along - Math.sqrt(Math.max(0, 1 - perp * perp)) * RJ_AU, p = { x: r.x + u.x * tHit, y: r.y + u.y * tHit, z: r.z + u.z * tHit };
      if (dot(p, n) < 0) { shadow = true; se = dot(p, east) / RJ_AU; sn = dot(p, north) / RJ_AU; }
    }
    return { name: MOONS[i], east: e, north: no, behind: depth > 0, transit: sky < 1 && depth < 0, occulted: sky < 1 && depth > 0, shadow, eclipsed: along > 0 && perp < 1, shadowEast: se, shadowNorth: sn };
  });
  return { moons, radiusArcsec: (RJ_AU / dist) * 206264.806, distAU: dist };
}

export type JovEvent = { moon: MoonName; kind: 'Transit' | 'Shadow transit' | 'Occultation' | 'Eclipse'; start: Date | null; end: Date | null };
const FLAGS: [keyof MoonState, JovEvent['kind']][] = [['transit', 'Transit'], ['shadow', 'Shadow transit'], ['occulted', 'Occultation'], ['eclipsed', 'Eclipse']];

/** Every event between two moments, each start and end refined to about 10 seconds. */
export function events(from: number, to: number, stepMin = 4): JovEvent[] {
  const out: JovEvent[] = [], open = new Map<string, JovEvent>();
  const flag = (t: number, m: number, f: keyof MoonState) => moonsAt(new Date(t)).moons[m][f] as boolean;
  const refine = (a: number, b: number, m: number, f: keyof MoonState, was: boolean) => { while (b - a > 10e3) { const c = (a + b) / 2; if (flag(c, m, f) === was) a = c; else b = c; } return new Date((a + b) / 2); };
  let prev = moonsAt(new Date(from)).moons, tp = from;
  prev.forEach((s, m) => FLAGS.forEach(([f, kind]) => { if (s[f]) open.set(`${m}${f}`, { moon: s.name, kind, start: null, end: null }); }));
  for (let t = from + stepMin * 60e3; t <= to; t += stepMin * 60e3) {
    const cur = moonsAt(new Date(t)).moons;
    cur.forEach((s, m) => FLAGS.forEach(([f, kind]) => {
      const was = prev[m][f] as boolean, now = s[f] as boolean, key = `${m}${f}`;
      if (!was && now) open.set(key, { moon: s.name, kind, start: refine(tp, t, m, f, false), end: null });
      if (was && !now) { const ev = open.get(key) ?? { moon: s.name, kind, start: null, end: null }; ev.end = refine(tp, t, m, f, true); out.push(ev); open.delete(key); }
    }));
    prev = cur; tp = t;
  }
  for (const ev of open.values()) out.push(ev);
  return out.sort((a, b) => ((a.start ?? a.end)!.getTime() - (b.start ?? b.end)!.getTime()));
}
