// Home battery storage sizing: an hour-by-hour (or finer) energy balance of load, solar and a battery,
// swept over battery sizes, with self-consumption, grid import and export, cycles and backup time.
// Plain TypeScript, no DOM. The template profiles are made up for fibub and labelled as such.
import { num, parseTable } from './num.ts';

export type Battery = {
  cap: number; // usable capacity, kWh
  power: number; // largest charge or discharge power, kW
  rte: number; // round-trip efficiency, 0..1 (split evenly between charging and discharging)
  reserve: number; // share of capacity held back for backup, 0..1
  start?: number; // starting state of charge as a share of capacity (default: the reserve)
};
export type SimResult = {
  load: number; solar: number; imp: number; exp: number; charged: number; discharged: number; lost: number;
  selfConsumption: number; selfSufficiency: number; cycles: number; minSoc: number; endSoc: number;
  soc?: Float64Array; gridImp?: Float64Array; gridExp?: Float64Array;
};

/**
 * Simulate the battery over the profile. load and solar are average powers (kW) over each step of dt hours.
 * Solar first serves the load; any surplus charges the battery, then is exported. A shortfall is met from the
 * battery (down to the reserve), then imported. Losses are split as sqrt(rte) on the way in and on the way out.
 */
export function simulate(load: ArrayLike<number>, solar: ArrayLike<number>, b: Battery, dt = 1, keep = false): SimResult {
  const n = load.length, ec = Math.sqrt(b.rte), ed = Math.sqrt(b.rte), lo = b.cap * b.reserve, emax = b.power * dt;
  let soc = Math.min(b.cap, Math.max(lo, (b.start ?? b.reserve) * b.cap));
  let L = 0, S = 0, imp = 0, exp = 0, ch = 0, dis = 0, minSoc = soc;
  const socA = keep ? new Float64Array(n) : undefined, iA = keep ? new Float64Array(n) : undefined, eA = keep ? new Float64Array(n) : undefined;
  for (let t = 0; t < n; t++) {
    const l = load[t] * dt, s = solar[t] * dt, net = s - l;
    L += l; S += s;
    let gi = 0, ge = 0;
    if (net >= 0) {
      const c = b.cap > 0 ? Math.min(net, emax, (b.cap - soc) / ec) : 0; // energy taken from the surplus
      soc += c * ec; ch += c; ge = net - c;
    } else {
      const need = -net, d = b.cap > 0 ? Math.min(need, emax, Math.max(0, soc - lo) * ed) : 0; // energy delivered
      soc -= d / ed; dis += d; gi = need - d;
    }
    imp += gi; exp += ge;
    if (soc < minSoc) minSoc = soc;
    if (keep) { socA![t] = soc; iA![t] = gi / dt; eA![t] = ge / dt; }
  }
  return {
    load: L, solar: S, imp, exp, charged: ch, discharged: dis, lost: ch - dis - (soc - Math.min(b.cap, Math.max(lo, (b.start ?? b.reserve) * b.cap))),
    selfConsumption: S > 0 ? (S - exp) / S : 0, selfSufficiency: L > 0 ? (L - imp) / L : 0,
    cycles: b.cap > 0 ? dis / b.cap : 0, minSoc, endSoc: soc, soc: socA, gridImp: iA, gridExp: eA,
  };
}

/** Hours a full battery, the reserve, or the lowest charge seen can run a constant critical load (kW). */
export function backupHours(b: Battery, critical: number, minSoc: number) {
  const ed = Math.sqrt(b.rte), h = (e: number) => (critical > 0 ? (e * ed) / critical : Infinity);
  return { full: h(b.cap), reserve: h(b.cap * b.reserve), worst: h(minSoc), powerOk: critical <= b.power };
}

export type SweepRow = { cap: number; power: number; r: SimResult; saved: number; perKwh: number };
/** Simulate a range of sizes. Power scales with capacity at the chosen battery's ratio (kW per kWh). */
export function sweep(load: ArrayLike<number>, solar: ArrayLike<number>, b: Battery, caps: number[], dt = 1): SweepRow[] {
  const ratio = b.cap > 0 ? b.power / b.cap : 0.5;
  const base = simulate(load, solar, { ...b, cap: 0, power: 0 }, dt);
  let prev = base.imp, prevCap = 0;
  return caps.map((cap) => {
    const r = simulate(load, solar, { ...b, cap, power: cap * ratio }, dt);
    const row = { cap, power: cap * ratio, r, saved: base.imp - r.imp, perKwh: cap > prevCap ? (prev - r.imp) / (cap - prevCap) : 0 };
    prev = r.imp; prevCap = cap;
    return row;
  });
}
/** The smallest size that gives at least `share` of the largest import saving in the sweep. */
export function recommend(rows: SweepRow[], share = 0.9): SweepRow | null {
  const best = Math.max(0, ...rows.map((r) => r.saved));
  if (!(best > 0)) return null;
  return rows.find((r) => r.saved >= share * best - 1e-9) ?? null;
}

/** A tidy list of sizes from 0 to max (kWh). */
export function sizeSteps(max: number): number[] {
  const step = max <= 6 ? 0.5 : max <= 15 ? 1 : max <= 40 ? 2 : max <= 100 ? 5 : 10;
  const out: number[] = [];
  for (let c = 0; c <= max + 1e-9; c += step) out.push(+c.toFixed(6));
  return out;
}

// ---------- Profiles ----------
/** Made-up shape of a household's daily use (share of the day's energy in each hour): low at night, peaks morning and evening. */
export const LOAD_SHAPE = [2.6, 2.3, 2.2, 2.2, 2.3, 2.8, 4.0, 5.2, 4.9, 4.0, 3.6, 3.5, 3.6, 3.5, 3.4, 3.6, 4.3, 5.8, 7.2, 7.6, 6.9, 5.6, 4.2, 3.2].map((x, _, a) => x / a.reduce((s, y) => s + y, 0));

/** A small seeded random number source (so the template is the same every time). */
function rng(seed: number) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }

export type Template = { days: number; dailyLoad: number; kwp: number; yieldPerKwp: number; swing: number; south?: boolean };
/**
 * Made-up hourly load and solar for `days` days starting 1 January. Solar is a sine-shaped day whose length and size
 * follow the season (largest near day 172, or day 355 for the southern hemisphere) with a random cloudiness each day,
 * scaled so the yearly average is yieldPerKwp kWh per kWp per day. Load follows LOAD_SHAPE, a little higher in winter.
 */
export function template(t: Template): { load: Float64Array; solar: Float64Array } {
  const n = t.days * 24, load = new Float64Array(n), solar = new Float64Array(n), r = rng(20261109);
  const peakDay = t.south ? 355 : 172, sw = Math.min(0.9, Math.max(0, t.swing));
  const raw = new Float64Array(n);
  let rawSum = 0;
  for (let d = 0; d < t.days; d++) {
    const season = Math.cos((2 * Math.PI * (d - peakDay)) / 365); // +1 midsummer, −1 midwinter
    const len = 12 + 3.5 * sw * season, rise = 12.5 - len / 2, size = 1 + sw * season, cloud = 0.35 + 0.65 * Math.pow(r(), 0.6);
    const lf = (1 - 0.12 * season) * (0.85 + 0.3 * r());
    for (let h = 0; h < 24; h++) {
      load[d * 24 + h] = t.dailyLoad * lf * LOAD_SHAPE[h];
      // Average of the sine over the hour, sampled at 4 points.
      let s = 0;
      for (let k = 0; k < 4; k++) { const x = (h + (k + 0.5) / 4 - rise) / len; s += x > 0 && x < 1 ? Math.sin(Math.PI * x) : 0; }
      raw[d * 24 + h] = (s / 4) * size * cloud; rawSum += raw[d * 24 + h];
    }
  }
  // Scale solar so the average is yieldPerKwp × kWp per day over a full year of this shape.
  const target = t.kwp * t.yieldPerKwp * t.days, k = rawSum > 0 ? target / rawSum : 0;
  for (let i = 0; i < n; i++) solar[i] = raw[i] * k;
  return { load, solar };
}

/** Two columns of pasted data: load (kW) and solar (kW). Picks columns named load/solar (or pv), else the last two numeric columns. */
export function parseProfile(text: string): { load: number[]; solar: number[]; note: string } {
  const rows = parseTable(text);
  if (!rows.length) throw new Error('Paste two columns: load (kW) and solar (kW), one row per time step.');
  const head = rows[0].some((c) => c && Number.isNaN(num(c)));
  const names = head ? rows[0].map((c) => c.toLowerCase()) : [];
  const body = head ? rows.slice(1) : rows;
  const width = Math.max(...body.map((r) => r.length));
  let li = names.findIndex((c) => /load|demand|use|consum/.test(c)), si = names.findIndex((c) => /solar|pv|gen/.test(c));
  if (li < 0 || si < 0) {
    const numeric = Array.from({ length: width }, (_, i) => i).filter((i) => body.filter((r) => Number.isFinite(num(r[i]))).length >= body.length * 0.9);
    if (numeric.length < 2) throw new Error('Need two columns of numbers: load (kW) and solar (kW).');
    [li, si] = numeric.slice(-2);
  }
  const load: number[] = [], solar: number[] = [];
  body.forEach((r, k) => {
    const l = num(r[li]), s = num(r[si]);
    if (!Number.isFinite(l) || !Number.isFinite(s)) throw new Error(`Row ${k + 1 + (head ? 1 : 0)}: load and solar must be numbers.`);
    if (l < 0 || s < 0) throw new Error(`Row ${k + 1 + (head ? 1 : 0)}: load and solar cannot be negative.`);
    load.push(l); solar.push(s);
  });
  if (load.length < 24) throw new Error('Give at least 24 rows (one day of hours).');
  return { load, solar, note: head ? `Using columns "${rows[0][li]}" (load) and "${rows[0][si]}" (solar).` : `Using column ${li + 1} as load and column ${si + 1} as solar.` };
}
