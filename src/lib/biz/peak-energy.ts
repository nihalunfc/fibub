// Ontario Global Adjustment (GA) under the Industrial Conservation Initiative (ICI):
// a Class A customer pays GA by its share of the province's demand in the five highest-demand hours of the year,
// so using less power in those hours lowers next year's bill. Class B customers pay GA per kWh.
export type Equip = { name: string; kw: number | ''; pct: number | ''; how?: string };
export type Month = { kw: number | ''; kwh: number | '' };
export type PeakIn = {
  avgPeak: number | ''; peakHourKW: number | ''; useProfile: boolean; profile: Month[]; equip: Equip[];
  reliability: number | ''; alerts: number | ''; hours: number | ''; setup: number | '';
  gaPerKw: number | ''; peaks: number | ''; upper: number | ''; lower: number | ''; classB: number | ''; rebound: number | ''; price: number | '';
};
const n = (v: unknown): number | null => (v === '' || v == null || !Number.isFinite(+(v as number)) ? null : +(v as number));
const kwTxt = (v: number) => Math.round(v).toLocaleString() + ' kW';

export function estimate(x: PeakIn) {
  const warns: string[] = [];
  const prof = x.profile.map((p) => ({ kw: n(p.kw), kwh: n(p.kwh) }));
  const profKw = prof.map((p) => p.kw).filter((v): v is number => v != null && v >= 0);
  const profKwh = prof.map((p) => p.kwh).filter((v): v is number => v != null && v >= 0);
  const useProf = x.useProfile && profKw.length > 0;
  const avg = useProf ? profKw.reduce((s, v) => s + v, 0) / profKw.length : Math.max(0, n(x.avgPeak) || 0);
  if (x.useProfile && !profKw.length) warns.push('The monthly profile is switched on but empty, so the average peak demand from the box above is used.');
  if (useProf && profKw.length < 12) warns.push(`The profile has ${profKw.length} of 12 months of peak demand. The average uses only those months.`);
  let peakHr = n(x.peakHourKW);
  if (peakHr == null || peakHr < 0) { peakHr = avg; warns.push("Demand during the province's peak hours is missing, so the average peak is used."); }
  const N = Math.max(1, Math.round(n(x.peaks) || 5));
  const upper = Math.max(0, n(x.upper) ?? 1000), lower = Math.min(upper, Math.max(0, n(x.lower) ?? 500));
  const ga = Math.max(0, n(x.gaPerKw) ?? 0);
  const eq = x.equip.map((e, i) => {
    const k = Math.max(0, n(e.kw) || 0), p = Math.min(100, Math.max(0, n(e.pct) || 0));
    return { i, name: e.name || 'Unnamed', kw: k, pct: p, cut: (k * p) / 100 };
  });
  const cutRaw = eq.reduce((s, e) => s + e.cut, 0), loadSum = eq.reduce((s, e) => s + e.kw, 0);
  if (loadSum > peakHr * 1.02 && peakHr > 0) warns.push(`The equipment loads add up to ${kwTxt(loadSum)}, more than the ${kwTxt(peakHr)} you use in the peak hours. Check the kW figures.`);
  const cut = Math.min(cutRaw, peakHr);
  if (cutRaw > peakHr) warns.push('The kW cut was capped at your demand during the peak hours.');
  const rel = Math.min(100, Math.max(0, n(x.reliability) ?? 0)) / 100;
  const caught = rel * N;
  const perPeak = (cut / N) * ga;           // saving for each peak hour caught
  const saving = perPeak * caught;
  const alerts = Math.max(0, n(x.alerts) || 0), hrs = Math.max(0, n(x.hours) || 0);
  if (alerts && alerts < caught) warns.push(`You plan to act on ${alerts} alert days but expect to catch ${caught.toFixed(1)} peak hours. Catching a peak needs an alert that day, so you usually need far more alert days than peaks.`);
  const precool = (alerts * hrs * cut * Math.max(0, n(x.rebound) || 0)) / 100 * Math.max(0, n(x.price) || 0);
  const net = saving - precool;
  const setup = Math.max(0, n(x.setup) || 0);
  const payback = setup > 0 && net > 0 ? setup / net : null;
  let elig: { cls: 'good' | 'warn' | 'bad'; short: string; text: string };
  if (avg > 5000) elig = { cls: 'good', short: 'Class A (automatic)', text: 'Above 5 MW, Class A applies automatically.' };
  else if (avg > upper) elig = { cls: 'good', short: 'Can opt in to Class A', text: `Average peak of ${kwTxt(avg)} is above the ${kwTxt(upper)} threshold, so the business can opt in to Class A.` };
  else if (avg >= lower) elig = { cls: 'warn', short: 'Maybe (check sector)', text: `Average peak of ${kwTxt(avg)} is in the ${kwTxt(lower)} to ${kwTxt(upper)} band. Opting in here has been limited to some sectors; ask your utility whether you qualify.` };
  else elig = { cls: 'bad', short: 'Class B only', text: `Average peak of ${kwTxt(avg)} is below ${kwTxt(lower)}, so the business stays on Class B and pays GA per kWh. Shifting load to avoid peaks would not lower GA.` };
  const kwhEstimated = !(useProf && profKwh.length);
  const kwh = !kwhEstimated ? (profKwh.reduce((s, v) => s + v, 0) * 12) / profKwh.length : avg * 8760 * 0.55;
  const classB = kwh * Math.max(0, n(x.classB) || 0);
  const classA0 = peakHr * ga, classA1 = classA0 - saving;
  const sens = Array.from({ length: N + 1 }, (_, k) => perPeak * k);
  return { avg, peakHr, N, upper, lower, ga, eq, cut, cutRaw, loadSum, rel, caught, perPeak, saving, precool, net, setup, payback, elig, kwh, kwhEstimated, classB, classA0, classA1, sens, warns, useProf, prof };
}
