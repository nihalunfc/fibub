// F0 (sterilisation lethality) from a temperature log, and D-value arithmetic for one organism.
// Each reading gives a lethal rate L = 10^((T − Tref) / z): one minute at Tref counts as one minute, one minute
// z degrees hotter as ten. F0 is the time integral of L in minutes (trapezoids between readings by default, or
// each reading held until the next). A D-value at one temperature moves to another with the same z:
// D_T = D_ref · 10^((T_ref − T) / z); the log reduction over a cycle is F (worked out with the organism's own z
// and its D temperature) ÷ D_ref. Times are in minutes and temperatures in °C throughout. No DOM.

export type Method = 'trap' | 'left';
export type Opts = { tref: number; z: number; method?: Method };
export type Log = { t: number[]; names: string[]; temps: number[][]; clock: boolean; errors: string[] };
export type Probe = {
  name: string;
  /** Cumulative lethality (minutes at Tref) at each reading. */
  cum: number[];
  f0: number;
  peak: number; peakAt: number;
  /** Minutes at or above the hold temperature (straight lines between readings), first and last time there. */
  above: number; firstAbove: number; lastAbove: number;
  /** Lethality gathered while at or above the hold temperature. */
  f0Above: number;
};
export type Result = { probes: Probe[]; cold: number; tref: number; z: number; holdFrom: number; dtMedian: number; dtMax: number; warn: string[] };

export const lethalRate = (T: number, tref: number, z: number) => 10 ** ((T - tref) / z);
export const fToC = (f: number) => ((f - 32) * 5) / 9;

/** Running total of lethality (minutes at tref) at each reading. */
export function cumulativeF(t: number[], T: number[], o: Opts): number[] {
  const L = T.map((x) => lethalRate(x, o.tref, o.z));
  const out = [0];
  for (let i = 1; i < t.length; i++) {
    const dt = t[i] - t[i - 1];
    out.push(out[i - 1] + (o.method === 'left' ? L[i - 1] * dt : ((L[i - 1] + L[i]) / 2) * dt));
  }
  return out;
}
export const totalF = (t: number[], T: number[], o: Opts) => cumulativeF(t, T, o)[t.length - 1] ?? 0;

/** Minutes at or above `level`, with straight lines between readings; also the first and last time there. */
export function timeAbove(t: number[], T: number[], level: number): { above: number; first: number; last: number } {
  let above = 0, first = NaN, last = NaN;
  const mark = (a: number, b: number) => { if (Number.isNaN(first)) first = a; last = b; };
  for (let i = 1; i < t.length; i++) {
    const a = T[i - 1] - level, b = T[i] - level, t0 = t[i - 1], t1 = t[i];
    if (a >= 0 && b >= 0) { above += t1 - t0; mark(t0, t1); }
    else if (a >= 0 && b < 0) { const x = t0 + ((t1 - t0) * a) / (a - b); above += x - t0; mark(t0, x); }
    else if (a < 0 && b >= 0) { const x = t0 + ((t1 - t0) * -a) / (b - a); above += t1 - x; mark(x, t1); }
  }
  if (t.length === 1 && T[0] >= level) { first = last = t[0]; }
  return { above, first, last };
}

/** Lethality gathered only while the temperature is at or above `level` (same method; partial steps cut at the crossing). */
function fAbove(t: number[], T: number[], level: number, o: Opts): number {
  let s = 0;
  const L = (x: number) => lethalRate(x, o.tref, o.z);
  for (let i = 1; i < t.length; i++) {
    const a = T[i - 1], b = T[i], t0 = t[i - 1], t1 = t[i];
    if (o.method === 'left') { if (a >= level) s += L(a) * (t1 - t0); continue; }
    if (a >= level && b >= level) s += ((L(a) + L(b)) / 2) * (t1 - t0);
    else if (a >= level && b < level) { const x = t0 + ((t1 - t0) * (a - level)) / (a - b); s += ((L(a) + L(level)) / 2) * (x - t0); }
    else if (a < level && b >= level) { const x = t0 + ((t1 - t0) * (level - a)) / (b - a); s += ((L(level) + L(b)) / 2) * (t1 - x); }
  }
  return s;
}

export function analyse(log: Pick<Log, 't' | 'names' | 'temps'>, o: Opts, holdFrom: number): Result {
  const { t } = log;
  if (!(o.z > 0)) throw new Error('The z-value must be above 0.');
  if (!Number.isFinite(o.tref)) throw new Error('Type a reference temperature.');
  if (t.length < 2) throw new Error('The log needs at least two readings.');
  const dts = t.slice(1).map((x, i) => x - t[i]);
  if (dts.some((d) => !(d > 0))) throw new Error('Times must go up from one reading to the next.');
  const sorted = [...dts].sort((a, b) => a - b), dtMedian = sorted[Math.floor((sorted.length - 1) / 2)], dtMax = sorted[sorted.length - 1];
  const probes: Probe[] = log.temps.map((T, k) => {
    const cum = cumulativeF(t, T, o);
    let pi = 0; T.forEach((x, i) => { if (x > T[pi]) pi = i; });
    const ab = timeAbove(t, T, holdFrom);
    return { name: log.names[k], cum, f0: cum[cum.length - 1], peak: T[pi], peakAt: t[pi], above: ab.above, firstAbove: ab.first, lastAbove: ab.last, f0Above: fAbove(t, T, holdFrom, o) };
  });
  let cold = 0; probes.forEach((p, i) => { if (p.f0 < probes[cold].f0) cold = i; });
  const warn: string[] = [];
  if (dtMax > 5 * dtMedian && dtMax > 0.5) warn.push(`There is a gap of ${+dtMax.toPrecision(3)} minutes between two readings (most are ${+dtMedian.toPrecision(3)} min apart). F0 across a gap is only a straight-line guess.`);
  if (dtMedian > 1) warn.push(`Readings are ${+dtMedian.toPrecision(3)} minutes apart. One reading a minute or more often gives a more exact F0.`);
  probes.forEach((p) => { if (p.peak < holdFrom) warn.push(`${p.name} never reached ${+holdFrom.toPrecision(5)} °C (highest ${+p.peak.toFixed(2)} °C).`); });
  return { probes, cold, tref: o.tref, z: o.z, holdFrom, dtMedian, dtMax, warn };
}

/** Minutes at temperature T that give the same lethality F (minutes at tref). */
export const equivalentTime = (F: number, tref: number, z: number, T: number) => F / lethalRate(T, tref, z);

/** D-value at temperature T from a D-value measured at dTemp. */
export const dAt = (dRef: number, dTemp: number, z: number, T: number) => dRef * 10 ** ((dTemp - T) / z);

/** Log reduction of one organism over a log: its own lethality (its z, minutes at its D temperature) ÷ its D. */
export function organismKill(t: number[], T: number[], dRef: number, dTemp: number, z: number, method: Method = 'trap'): { F: number; lr: number } {
  if (!(dRef > 0)) throw new Error('The D-value must be above 0.');
  if (!(z > 0)) throw new Error("The organism's z-value must be above 0.");
  const F = totalF(t, T, { tref: dTemp, z, method });
  return { F, lr: F / dRef };
}

/** Log reduction needed to go from n0 organisms per item to a sterility assurance level (e.g. 1e-6). */
export function neededLR(n0: number, sal: number): number {
  if (!(n0 > 0)) throw new Error('The starting number of organisms must be above 0.');
  if (!(sal > 0)) throw new Error('The sterility assurance level must be above 0, such as 1e-6.');
  return Math.log10(n0) - Math.log10(sal);
}

/** Minutes at temperature T for a log reduction lr. */
export const timeFor = (lr: number, dRef: number, dTemp: number, z: number, T: number) => lr * dAt(dRef, dTemp, z, T);

/** Organisms left per item after lr logs from n0 (also the chance that one survives, when below 1). */
export const survivors = (n0: number, lr: number) => n0 * 10 ** -lr;

// ---------- Reading a log ----------
const CLOCK = /^(?:(\d{4})-(\d\d)-(\d\d)[T ])?(\d{1,2}):(\d\d)(?::(\d\d(?:\.\d+)?))?$/;
/** Minutes from a clock time "hh:mm[:ss]" or a date-time "YYYY-MM-DD hh:mm[:ss]"; NaN if neither. */
export function clockMinutes(s: string): number {
  const m = CLOCK.exec(s.trim());
  if (!m) return NaN;
  const h = +m[4], mi = +m[5], se = m[6] ? +m[6] : 0;
  if (h > 23 || mi > 59 || se >= 60) return NaN;
  const day = m[1] ? Date.UTC(+m[1], +m[2] - 1, +m[3]) / 60000 : 0;
  return day + h * 60 + mi + se / 60;
}

const UNIT = { min: 1, s: 1 / 60, h: 60 } as const;
/**
 * A pasted log: the first column is the time (numbers in `unit`, or clock times), each further column one
 * probe's temperature. A first row that is not numeric names the probes. Times are returned in minutes from
 * the first reading; clock times that go back (past midnight) move on a day.
 */
export function parseLog(rows: string[][], num: (s: string) => number, unit: keyof typeof UNIT = 'min', degF = false): Log {
  const errors: string[] = [];
  if (!rows.length) return { t: [], names: [], temps: [], clock: false, errors: ['The log is empty.'] };
  const isTime = (s: string) => Number.isFinite(num(s)) || Number.isFinite(clockMinutes(s));
  const head = !isTime(rows[0][0] ?? '') || rows[0].slice(1).some((c) => c !== '' && !Number.isFinite(num(c)));
  const body = head ? rows.slice(1) : rows;
  const width = Math.max(2, ...body.map((r) => r.length));
  const names = Array.from({ length: width - 1 }, (_, k) => (head && rows[0][k + 1]?.trim()) || (width === 2 ? 'Probe' : `Probe ${k + 1}`));
  const clock = body.some((r) => (r[0] ?? '').includes(':'));
  const t: number[] = [], temps: number[][] = names.map(() => []);
  let prev = NaN, shift = 0;
  body.forEach((r, i) => {
    const line = i + 1 + (head ? 1 : 0);
    let x = clock ? clockMinutes(r[0] ?? '') : num(r[0]) * UNIT[unit];
    const T = names.map((_, k) => num(r[k + 1] ?? ''));
    if (!Number.isFinite(x)) { errors.push(`Line ${line}: "${r[0] ?? ''}" is not a time.`); return; }
    if (T.some((v) => !Number.isFinite(v))) { errors.push(`Line ${line}: every probe needs a temperature.`); return; }
    if (clock) { x += shift; if (Number.isFinite(prev) && x < prev - 720) { shift += 1440; x += 1440; } }
    prev = x;
    t.push(x); T.forEach((v, k) => temps[k].push(degF ? fToC(v) : v));
  });
  const t0 = t[0] ?? 0;
  return { t: t.map((x) => x - t0), names, temps, clock, errors };
}

/** A made-up autoclave cycle (minutes, °C): a chamber probe and a slower probe in the centre of the load. */
export const EXAMPLE_CSV = `Minutes,Chamber,Load centre
0,22.0,22.0
1,49.5,41.3
2,69.6,57.2
3,84.3,70.1
4,95.1,80.7
5,102.9,89.4
6,108.7,96.5
7,112.9,102.4
8,116.0,107.1
9,118.3,111.0
10,119.9,114.2
11,121.1,116.9
12,122.0,119.0
13,121.8,119.6
14,121.5,120.3
15,121.9,120.6
16,122.1,120.7
17,121.6,121.2
18,121.6,121.1
19,122.0,121.2
20,122.0,121.5
21,121.5,121.2
22,121.7,121.5
23,122.1,121.5
24,121.8,121.3
25,121.5,121.6
26,121.9,121.5
27,122.1,121.4
28,121.7,121.6
29,121.6,121.4
30,122.0,121.5
31,122.0,121.6
32,121.5,121.4
33,110.6,113.5
34,101.4,106.6
35,93.9,100.7
36,87.8,95.5
37,82.7,91.1
38,78.6,87.2
39,75.2,83.9
40,72.5,80.9
41,70.2,78.4
42,68.4,76.2
43,66.8,74.3
44,65.6,72.7
45,64.6,71.3
`;
