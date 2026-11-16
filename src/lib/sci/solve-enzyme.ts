// "Solve my numbers" for the enzyme activity lab: rate of reaction from a time (rate = amount ÷ time, or 1 ÷ time),
// the effect of temperature with a Q10 (new rate, or Q10 from two rates), the Michaelis-Menten equation
// v = Vmax [S] / (Km + [S]) for v or [S], and the same with a competitive or non-competitive inhibitor.
// Plain maths, no DOM. Engine: src/lib/learn/solvecore-b.ts.
import { sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';

const TIME: [string, number][] = [['s', 1], ['min', 60], ['h', 3600]];
const TIP_RATE = 'Common mistake: a shorter time means a faster rate. Rate = 1 ÷ time, so the enzyme that finishes in 2 minutes is twice as fast as the one that takes 4 minutes.';
const TIP_Q10 = 'Q10 is the factor the rate grows by for every 10 °C rise, and about 2 is typical for enzymes. It only works below the temperature where the enzyme starts to denature (above about 40 °C for many human enzymes), where the rate falls instead.';
const TIP_MM = 'Common mistake: mixing units. [S], Km and Ki must be in the same unit (all mM, say). Km is the [S] that gives half of Vmax, and v can never go above Vmax.';
const bad = (x: unknown): x is SOut => typeof x === 'object' && x !== null && 'error' in x;

function mmInputs(i: Record<string, SIn>) {
  const vmax = i.vmax.v, km = i.km.v;
  if (!(vmax > 0)) return { error: 'Vmax must be more than 0.' } as SOut;
  if (!(km > 0)) return { error: 'Km must be more than 0.' } as SOut;
  return { vmax, km };
}

export function enzSolve(i: Record<string, SIn>, c: { find: string; ch: Record<string, string> }): SOut {
  const f = c.find;
  if (f === 'rate') {
    const t = i.t, amt = i.amt && !i.amt.blank ? i.amt.v : null;
    if (!(t.v > 0)) return { error: 'The time must be more than 0. A reaction cannot finish in no time at all.' };
    if (amt !== null && amt < 0) return { error: 'The amount cannot be negative.' };
    const r = (amt ?? 1) / t.typed;
    if (amt === null) return { answer: `The relative rate is ${sf(r)} per ${t.u} (1 ÷ ${sf(t.typed)} ${t.u}).`, lines: ['Relative rate = 1 ÷ time taken (for example the time until the starch spot stops turning blue-black).', `Rate = 1 ÷ ${sf(t.typed)} ${t.u} = ${sf(r)} per ${t.u}`, t.u !== 'min' ? `In minutes: ${sf(1 / (t.v / 60))} per min.` : 'Half the time means double the rate.'], tip: TIP_RATE };
    return { answer: `The rate is ${sf(r)} (amount units) per ${t.u}.`, lines: ['Rate of reaction = amount of substrate used (or product made) ÷ time taken', `Rate = ${sf(amt)} ÷ ${sf(t.typed)} ${t.u} = ${sf(r)} per ${t.u}`, 'The unit of the answer is the unit of the amount, per the unit of time.'], tip: TIP_RATE };
  }
  if (f === 'q10' || f === 'q10v') {
    const t1 = i.t1.typed, t2 = i.t2.typed;
    if (t1 === t2) return { error: 'The two temperatures are the same, so there is no change to work out. Type two different temperatures.' };
    if (t1 < -273.15 || t2 < -273.15) return { error: 'A temperature cannot be below −273.15 °C (absolute zero).' };
    if (f === 'q10') {
      const r1 = i.r1.v, q = i.q && !i.q.blank ? i.q.v : 2;
      if (!(r1 >= 0)) return { error: 'The rate cannot be negative.' };
      if (!(q > 0)) return { error: 'Q10 must be more than 0 (a typical value is 2).' };
      const k = (t2 - t1) / 10, r2 = r1 * q ** k;
      return { answer: `At ${sf(t2)} °C the rate is about ${sf(r2)}, which is ${sf(q ** k)} times the rate at ${sf(t1)} °C.`, lines: ['Formula: R2 = R1 × Q10^((T2 − T1) ÷ 10)', `(T2 − T1) ÷ 10 = (${sf(t2)} − ${sf(t1)}) ÷ 10 = ${sf(k)}`, `R2 = ${sf(r1)} × ${sf(q)}^${sf(k)} = ${sf(r1)} × ${sf(q ** k)} = ${sf(r2)}`, q === 2 && !(i.q && !i.q.blank) ? 'Q10 left blank, so 2 was used (the rate doubles every 10 °C).' : `Q10 = ${sf(q)}.`], tip: TIP_Q10 };
    }
    const r1 = i.r1.v, r2 = i.r2.v;
    if (!(r1 > 0) || !(r2 > 0)) return { error: 'Both rates must be more than 0 to work out Q10.' };
    const q = (r2 / r1) ** (10 / (t2 - t1));
    return { answer: `Q10 is about ${sf(q)}.`, lines: ['Formula: Q10 = (R2 ÷ R1)^(10 ÷ (T2 − T1))', `R2 ÷ R1 = ${sf(r2)} ÷ ${sf(r1)} = ${sf(r2 / r1)}`, `Q10 = ${sf(r2 / r1)}^(10 ÷ ${sf(t2 - t1)}) = ${sf(q)}`, q > 1 ? `Q10 above 1 means the rate rises with temperature (2 means it doubles every 10 °C).` : 'Q10 below 1 means the rate fell: the enzyme may have started to denature.'], tip: TIP_Q10 };
  }
  const m = mmInputs(i); if (bad(m)) return m;
  const { vmax, km } = m;
  if (f === 'mmv') {
    const s = i.s.v;
    if (!(s >= 0)) return { error: 'The substrate concentration cannot be negative.' };
    const v = (vmax * s) / (km + s);
    return { answer: `The rate is v = ${sf(v)} (${sf((v / vmax) * 100, 3)}% of Vmax).`, lines: ['Michaelis-Menten equation: v = Vmax [S] ÷ (Km + [S])', `v = ${sf(vmax)} × ${sf(s)} ÷ (${sf(km)} + ${sf(s)}) = ${sf(vmax * s)} ÷ ${sf(km + s)} = ${sf(v)}`, s === km ? 'When [S] = Km the rate is exactly half of Vmax.' : s > 10 * km ? 'With [S] far above Km nearly every active site is busy, so v is close to Vmax.' : `Check: v is below Vmax (${sf(vmax)}), as it must be.`], tip: TIP_MM };
  }
  if (f === 'mms') {
    const v = i.v.v;
    if (!(v >= 0)) return { error: 'The rate cannot be negative.' };
    if (v >= vmax) return { error: `The rate ${sf(v)} must be below Vmax (${sf(vmax)}): an enzyme cannot go faster than Vmax, however much substrate there is. Check the numbers.` };
    const s = (km * v) / (vmax - v);
    return { answer: `The substrate concentration is [S] = ${sf(s)} (same unit as Km).`, lines: ['Rearrange v = Vmax [S] ÷ (Km + [S]) to [S] = Km v ÷ (Vmax − v)', `[S] = ${sf(km)} × ${sf(v)} ÷ (${sf(vmax)} − ${sf(v)}) = ${sf(km * v)} ÷ ${sf(vmax - v)} = ${sf(s)}`, `Check: v ÷ Vmax = ${sf(v / vmax, 3)}`], tip: TIP_MM };
  }
  // inh: Michaelis-Menten with an inhibitor
  const s = i.s.v, I = i.I.v, Ki = i.Ki.v, type = c.ch.type ?? 'comp';
  if (!(s >= 0) || !(I >= 0)) return { error: 'The concentrations cannot be negative.' };
  if (!(Ki > 0)) return { error: 'Ki must be more than 0.' };
  const a = 1 + I / Ki, v0 = (vmax * s) / (km + s);
  const kmApp = type === 'comp' ? km * a : km, vApp = type === 'comp' ? vmax : vmax / a, v = (vApp * s) / (kmApp + s);
  return {
    answer: `With the ${type === 'comp' ? 'competitive' : 'non-competitive'} inhibitor the rate is v = ${sf(v)} (without it, ${sf(v0)}: ${sf((1 - v / v0) * 100, 3)}% lower).`,
    lines: [`Factor α = 1 + [I] ÷ Ki = 1 + ${sf(I)} ÷ ${sf(Ki)} = ${sf(a)}`, type === 'comp' ? `Competitive: Km rises to Km × α = ${sf(km)} × ${sf(a)} = ${sf(kmApp)}; Vmax stays ${sf(vmax)}. Enough substrate can still win.` : `Non-competitive: Vmax falls to Vmax ÷ α = ${sf(vmax)} ÷ ${sf(a)} = ${sf(vApp)}; Km stays ${sf(km)}. More substrate does not help.`, `v = Vmax' [S] ÷ (Km' + [S]) = ${sf(vApp)} × ${sf(s)} ÷ (${sf(kmApp)} + ${sf(s)}) = ${sf(v)}`],
    tip: 'A competitive inhibitor changes Km but not Vmax; a non-competitive one changes Vmax but not Km. High substrate can overcome only the competitive kind.',
  };
}

export const ENZ_SPEC: SSpec = {
  id: 'enz',
  finds: [['rate', 'Rate of reaction (from a time)'], ['q10', 'Rate at a new temperature (Q10)'], ['q10v', 'Q10 from two rates'], ['mmv', 'Rate v from substrate [S] (Michaelis-Menten)'], ['mms', 'Substrate [S] for a given rate'], ['inh', 'Rate with an inhibitor']],
  fields: [
    { k: 't', label: 'Time taken', units: TIME, ph: 'e.g. 4', show: (c) => c.find === 'rate' },
    { k: 'amt', label: 'Amount used or made (optional)', optional: true, ph: 'blank means rate = 1 ÷ time', show: (c) => c.find === 'rate' },
    { k: 'r1', label: 'Rate at the first temperature', ph: 'e.g. 0.25', show: (c) => c.find === 'q10' || c.find === 'q10v' },
    { k: 'r2', label: 'Rate at the second temperature', ph: 'e.g. 0.5', show: (c) => c.find === 'q10v' },
    { k: 't1', label: 'First temperature (°C)', neg: true, ph: 'e.g. 20', show: (c) => c.find === 'q10' || c.find === 'q10v' },
    { k: 't2', label: 'Second temperature (°C)', neg: true, ph: 'e.g. 30', show: (c) => c.find === 'q10' || c.find === 'q10v' },
    { k: 'q', label: 'Q10 (optional, blank means 2)', optional: true, ph: 'e.g. 2', show: (c) => c.find === 'q10' },
    { k: 'vmax', label: 'Vmax (top rate)', ph: 'e.g. 100', show: (c) => ['mmv', 'mms', 'inh'].includes(c.find) },
    { k: 'km', label: 'Km (same unit as [S])', ph: 'e.g. 2', show: (c) => ['mmv', 'mms', 'inh'].includes(c.find) },
    { k: 's', label: 'Substrate [S]', ph: 'e.g. 10', show: (c) => c.find === 'mmv' || c.find === 'inh' },
    { k: 'v', label: 'Rate v', ph: 'e.g. 60', show: (c) => c.find === 'mms' },
    { k: 'type', label: 'Kind of inhibitor', kind: 'choice', options: [['comp', 'Competitive'], ['non', 'Non-competitive']], def: 'comp', show: (c) => c.find === 'inh' },
    { k: 'I', label: 'Inhibitor [I]', ph: 'e.g. 4', show: (c) => c.find === 'inh' },
    { k: 'Ki', label: 'Ki (same unit as [I])', ph: 'e.g. 2', show: (c) => c.find === 'inh' },
  ],
  presets: [
    { name: 'The starch spot clears in 4 minutes', find: 'rate', vals: { t: ['4', 'min'] } },
    { name: '12 mg of starch digested in 90 seconds', find: 'rate', vals: { t: ['90', 's'], amt: '12' } },
    { name: 'Rate 0.25 at 20 °C: what at 30 °C? (Q10 = 2)', find: 'q10', vals: { r1: '0.25', t1: '20', t2: '30' } },
    { name: 'Rate goes from 0.8 to 2.4 between 15 and 35 °C: find Q10', find: 'q10v', vals: { r1: '0.8', r2: '2.4', t1: '15', t2: '35' } },
    { name: 'Vmax 100, Km 2, [S] = 10: find v', find: 'mmv', vals: { vmax: '100', km: '2', s: '10' } },
    { name: 'Vmax 100, Km 2: what [S] gives v = 60?', find: 'mms', vals: { vmax: '100', km: '2', v: '60' } },
    { name: 'Competitive inhibitor [I] = 4, Ki = 2', find: 'inh', vals: { vmax: '100', km: '2', s: '10', I: '4', Ki: '2' }, ch: { type: 'comp' } },
  ],
  solve: (i, c) => enzSolve(i, c),
};
