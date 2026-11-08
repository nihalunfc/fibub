// Mars time: Mars Sol Date, Coordinated Mars Time, local solar times and the season (Ls).
// Algorithm from Allison & McEwen (2000), Planet. Space Sci. 48, 215, as used by NASA GISS Mars24.

const rad = Math.PI / 180;
const mod = (x: number, m: number) => ((x % m) + m) % m;

/** TT − UTC in seconds: 32.184 s plus the leap seconds (37 since 2017; table back to 1972). */
const LEAPS: [number, number][] = [[Date.UTC(2017, 0, 1), 37], [Date.UTC(2015, 6, 1), 36], [Date.UTC(2012, 6, 1), 35], [Date.UTC(2009, 0, 1), 34], [Date.UTC(2006, 0, 1), 33], [Date.UTC(1999, 0, 1), 32], [Date.UTC(1997, 6, 1), 31], [Date.UTC(1996, 0, 1), 30], [Date.UTC(1994, 6, 1), 29], [Date.UTC(1993, 6, 1), 28], [Date.UTC(1992, 6, 1), 27], [Date.UTC(1991, 0, 1), 26], [Date.UTC(1990, 0, 1), 25], [Date.UTC(1988, 0, 1), 24], [Date.UTC(1985, 6, 1), 23], [Date.UTC(1983, 6, 1), 22], [Date.UTC(1982, 6, 1), 21], [Date.UTC(1981, 6, 1), 20], [Date.UTC(1980, 0, 1), 19], [Date.UTC(1979, 0, 1), 18], [Date.UTC(1978, 0, 1), 17], [Date.UTC(1977, 0, 1), 16], [Date.UTC(1976, 0, 1), 15], [Date.UTC(1975, 0, 1), 14], [Date.UTC(1974, 0, 1), 13], [Date.UTC(1973, 0, 1), 12], [Date.UTC(1972, 6, 1), 11], [Date.UTC(1972, 0, 1), 10]];
export const ttMinusUtc = (ms: number) => 32.184 + (LEAPS.find(([t]) => ms >= t)?.[1] ?? 10);

const PBS: [number, number, number][] = [[0.0071, 2.2353, 49.409], [0.0057, 2.7543, 168.173], [0.0039, 1.1177, 191.837], [0.0037, 15.7866, 21.736], [0.0021, 2.1354, 15.704], [0.002, 2.4694, 95.528], [0.0018, 32.8493, 49.095]];

export type MarsTime = {
  jdUt: number; jdTt: number; dt: number; M: number; alphaFMS: number; pbs: number; nuM: number;
  ls: number; eot: number; msd: number; mtc: number; r: number; decl: number; subsolarW: number; marsYear: number;
};

/** Mars time at a moment (milliseconds since 1970, UTC). */
export function marsTime(ms: number): MarsTime {
  const jdUt = 2440587.5 + ms / 864e5;
  const jdTt = jdUt + ttMinusUtc(ms) / 86400;
  const dt = jdTt - 2451545.0;
  const M = mod(19.3871 + 0.52402073 * dt, 360);
  const alphaFMS = mod(270.3871 + 0.524038496 * dt, 360);
  const pbs = PBS.reduce((s, [A, tau, phi]) => s + A * Math.cos(((0.985626 * dt) / tau + phi) * rad), 0);
  const nuM = (10.691 + 3.0e-7 * dt) * Math.sin(M * rad) + 0.623 * Math.sin(2 * M * rad) + 0.05 * Math.sin(3 * M * rad) + 0.005 * Math.sin(4 * M * rad) + 0.0005 * Math.sin(5 * M * rad) + pbs;
  const ls = mod(alphaFMS + nuM, 360);
  const eot = 2.861 * Math.sin(2 * ls * rad) - 0.071 * Math.sin(4 * ls * rad) + 0.002 * Math.sin(6 * ls * rad) - nuM;
  const msd = (dt - 4.5) / 1.0274912517 + 44796.0 - 0.0009626;
  const mtc = mod(24 * msd, 24);
  const r = 1.52367934 * (1.00436 - 0.09309 * Math.cos(M * rad) - 0.004336 * Math.cos(2 * M * rad) - 0.00031 * Math.cos(3 * M * rad) - 0.00003 * Math.cos(4 * M * rad));
  const decl = Math.asin(0.42565 * Math.sin(ls * rad)) / rad + 0.25 * Math.sin(ls * rad);
  const subsolarW = mod(mtc * 15 + eot + 180, 360);
  // Mars Year 1 began at Ls 0 on 1955 April 11 (Clancy et al. 2000); a Mars year is 686.9725 days.
  const marsYear = 1 + Math.round((jdTt - 2435208.5) / 686.9725 - ls / 360);
  return { jdUt, jdTt, dt, M, alphaFMS, pbs, nuM, ls, eot, msd, mtc, r, decl, subsolarW, marsYear };
}

/** Local mean and true solar time in hours at a longitude given in degrees EAST (the planetocentric convention used today). */
export function localSolar(t: MarsTime, lonEast: number) {
  const lmst = mod(t.mtc + (lonEast * 24) / 360, 24);
  return { lmst, ltst: mod(lmst + (t.eot * 24) / 360, 24) };
}

/** The local Mars Sol Date at a longitude (east): the whole part counts local midnights. */
export const localMsd = (t: MarsTime, lonEast: number) => t.msd + lonEast / 360;

/** The moment (ms since 1970, UTC) of a given MSD, found by iteration (TT − UTC depends on the date). */
export function msdToMs(msd: number) {
  let ms = Date.UTC(2000, 0, 6);
  for (let i = 0; i < 4; i++) {
    const dt = (msd - 44796.0 + 0.0009626) * 1.0274912517 + 4.5; // days since J2000 in TT
    ms = (dt + 2451545.0 - 2440587.5) * 864e5 - ttMinusUtc(ms) * 1000;
  }
  return ms;
}

export type Mission = { id: string; name: string; site: string; lonEast: number; landing: number };
// Landing moments (UTC) and site longitudes (planetocentric east). Sol 0 is the landing sol, as these missions count.
export const MISSIONS: Mission[] = [
  { id: 'perseverance', name: 'Perseverance', site: 'Jezero crater', lonEast: 77.4509, landing: Date.UTC(2021, 1, 18, 20, 55) },
  { id: 'curiosity', name: 'Curiosity', site: 'Gale crater', lonEast: 137.4417, landing: Date.UTC(2012, 7, 6, 5, 17, 57) },
  { id: 'insight', name: 'InSight (ended 2022)', site: 'Elysium Planitia', lonEast: 135.6234, landing: Date.UTC(2018, 10, 26, 19, 52, 59) },
];
/** The mission sol for a moment: local sols since the landing sol. */
export function missionSol(m: Mission, ms: number) {
  return Math.floor(localMsd(marsTime(ms), m.lonEast)) - Math.floor(localMsd(marsTime(m.landing), m.lonEast));
}
/** The start (local midnight, LMST 00:00) of mission sol n, in ms since 1970 UTC. */
export function solStart(m: Mission, n: number) {
  const day0 = Math.floor(localMsd(marsTime(m.landing), m.lonEast));
  return msdToMs(day0 + n - m.lonEast / 360);
}

export function season(ls: number) {
  const north = ['spring', 'summer', 'autumn', 'winter'][Math.floor(mod(ls, 360) / 90)];
  const south = ['autumn', 'winter', 'spring', 'summer'][Math.floor(mod(ls, 360) / 90)];
  return { north, south };
}

/** The moment (ms since 1970, UTC) when Mars reaches solar longitude `ls` (degrees) in Mars Year `my`. */
export function lsTime(my: number, ls: number) {
  let ms = (2435208.5 + (my - 1 + ls / 360) * 686.9725 - 2440587.5) * 864e5;
  for (let i = 0; i < 12; i++) {
    const t = marsTime(ms), d = (((ls - t.ls + 540) % 360) - 180);
    // Ls advances 0.44° to 0.64° a day; the mean rate converges in a few steps.
    ms += (d / 0.524) * 864e5;
    if (Math.abs(d) < 1e-7) break;
  }
  return ms;
}
