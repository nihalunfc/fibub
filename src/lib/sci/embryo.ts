// Development time at different temperatures. Zebrafish: Kimmel et al. (1995), H_T = h / (0.055 T − 0.57), where h is
// the time at 28.5 °C and H_T the time at T °C (stated for about 25–33 °C). Any species: a linear degree-hours model,
// development rate ∝ (T − T_base), so hours × (T − T_base) is the same at every temperature. Plain maths, no DOM.

/** Kimmel's rate factor at T °C: hours at 28.5 °C ÷ hours at T. */
export const kimmelFactor = (T: number) => 0.055 * T - 0.57;
/** The temperature range Kimmel et al. give for the formula. */
export const KIMMEL_RANGE: [number, number] = [25, 33];
/** Kimmel's formula is itself a degree-hours model with this base temperature (°C). */
export const KIMMEL_BASE = 0.57 / 0.055;

export type Model = { kind: 'kimmel' } | { kind: 'degree'; base: number; ref: number };
/** Relative development rate at T: hours at the reference temperature that pass per hour at T. */
export function rate(m: Model, T: number): number {
  return m.kind === 'kimmel' ? kimmelFactor(T) : (T - m.base) / (m.ref - m.base);
}
/** The reference temperature of a model (28.5 °C for zebrafish). */
export const refTemp = (m: Model) => (m.kind === 'kimmel' ? 28.5 : m.ref);

/** Hours needed at temperature T to reach a stage that takes hRef hours at the reference temperature. */
export function hoursAt(m: Model, hRef: number, T: number): number {
  const r = rate(m, T);
  if (!(r > 0)) throw new Error(m.kind === 'kimmel' ? `At ${T} °C the zebrafish formula gives no development (it needs T above ${KIMMEL_BASE.toFixed(2)} °C).` : `At ${T} °C there is no development: the temperature must be above the base temperature (${m.base} °C).`);
  return hRef / r;
}
/**
 * Hours at T1 converted to the equivalent hours at T2 (the same stage). Kimmel's factor is 0.9975, not 1, at 28.5 °C;
 * as in the paper, a time at 28.5 °C is used as h directly (and a time at T gives h = H × factor), so conversions to
 * and from 28.5 °C match the published formula exactly.
 */
export function convert(m: Model, h: number, T1: number, T2: number): number {
  const R = refTemp(m), hRef = T1 === R ? h : h * rate(m, T1);
  if (!(rate(m, T1) > 0)) hoursAt(m, 1, T1);
  return T2 === R ? hRef : hoursAt(m, hRef, T2);
}

/** Equivalent hours at the reference temperature after a run of (hours, temperature) steps; below the base nothing accrues. */
export function accumulate(m: Model, steps: { hours: number; T: number }[]): number {
  const R = refTemp(m);
  return steps.reduce((s, x) => s + x.hours * (x.T === R ? 1 : Math.max(0, rate(m, x.T))), 0);
}
/** Degree-hours above the base temperature for a run of steps. */
export const degreeHours = (base: number, steps: { hours: number; T: number }[]) => steps.reduce((s, x) => s + x.hours * Math.max(0, x.T - base), 0);

export type Stage = { name: string; hRef: number };
/** "Name, hours" per line (comma, tab or semicolon before the number). */
export function parseStages(text: string): Stage[] {
  const out: Stage[] = [];
  text.replace(/\r\n?/g, '\n').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#')).forEach((l, i) => {
    const m = l.match(/^(.*?)[,;\t]\s*([\d.]+)\s*(h|hours?|hpf)?$/i);
    if (!m || !Number.isFinite(Number(m[2]))) throw new Error(`Stage line ${i + 1} ("${l}"): write a name, a comma and the hours, like "Heartbeat, 24".`);
    out.push({ name: m[1].trim() || `Stage ${i + 1}`, hRef: Number(m[2]) });
  });
  return out.sort((a, b) => a.hRef - b.hRef);
}
/** "hours, °C" per line: a temperature history. */
export function parseSteps(text: string): { hours: number; T: number }[] {
  return text.replace(/\r\n?/g, '\n').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#')).map((l, i) => {
    const m = l.match(/^([\d.]+)\s*(?:h|hours?)?\s*(?:[,;\t]|\s+at\s+|\s+)\s*(-?[\d.]+)\s*(?:°?\s*C)?$/i);
    if (!m) throw new Error(`Temperature line ${i + 1} ("${l}"): write hours and °C, like "6, 28.5".`);
    return { hours: Number(m[1]), T: Number(m[2]) };
  });
}
