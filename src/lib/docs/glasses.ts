// Glasses prescription arithmetic: plain TypeScript, no DOM. Powers are in dioptres (D), axis in degrees.
export type Eye = { sph: number | null; cyl: number | null; axis: number | null; add: number | null; prism: number | null; base: string };

/** Read a power the way it is written on paper: "-2.00", "+1.25", "−0.75", "plano", "pl", "DS" (= 0). Empty gives null, nonsense gives NaN. */
export function readNum(s: string): number | null {
  const t = s.trim().toLowerCase().replace(/[−–]/g, '-').replace(/,/g, '.').replace(/\s+/g, '');
  if (!t) return null;
  if (['plano', 'pl', 'ds', 'sph', 'balance', 'bal'].includes(t)) return 0;
  return /^[+-]?(\d+\.?\d*|\.\d+)$/.test(t) ? parseFloat(t) : NaN;
}

/** Round half away from zero to 2 decimals. */
export const round2 = (x: number) => Math.sign(x) * Math.round(Math.abs(x) * 100 + 1e-9) / 100;
/** A power with its sign and two decimals: +1.25, −2.00 (a real minus sign), +0.00 shown as 0.00. */
export function fmt(x: number, plain = false): string {
  const r = round2(x);
  if (r === 0) return plain ? '0.00' : 'plano';
  return (r < 0 ? '−' : '+') + Math.abs(r).toFixed(2);
}
/** The same, but always with digits (0.00 for zero). */
export const fmtD = (x: number) => (round2(x) === 0 ? '0.00' : fmt(x));

/** Transpose between plus and minus cylinder: SPH + CYL, −CYL, AXIS ± 90 (kept within 1 to 180). */
export function transpose(sph: number, cyl: number, axis: number): { sph: number; cyl: number; axis: number } {
  return { sph: sph + cyl, cyl: -cyl, axis: axis <= 90 ? axis + 90 : axis - 90 };
}
/** Spherical equivalent: SPH + CYL / 2. */
export const sphericalEquivalent = (sph: number, cyl: number) => sph + cyl / 2;

const quarter = (x: number) => Math.abs(x * 4 - Math.round(x * 4)) < 1e-9;
/** Problems with one eye's boxes, in plain words. */
export function checkEye(label: string, e: Eye, raw: Record<string, string>): string[] {
  const out: string[] = [];
  for (const k of ['sph', 'cyl', 'axis', 'add', 'prism'] as const) if (raw[k] && Number.isNaN(readNum(raw[k]))) out.push(`${label} ${k.toUpperCase()}: "${raw[k]}" is not a number.`);
  const ok = (x: number | null): x is number => x !== null && !Number.isNaN(x);
  if (ok(e.sph) && !quarter(e.sph)) out.push(`${label} SPH ${raw.sph} is not a multiple of 0.25. Most prescriptions go in steps of 0.25 D; check the paper.`);
  if (ok(e.cyl) && !quarter(e.cyl)) out.push(`${label} CYL ${raw.cyl} is not a multiple of 0.25. Most prescriptions go in steps of 0.25 D; check the paper.`);
  if (ok(e.add) && !quarter(e.add)) out.push(`${label} ADD ${raw.add} is not a multiple of 0.25. Most prescriptions go in steps of 0.25 D; check the paper.`);
  if (ok(e.add) && e.add < 0) out.push(`${label} ADD is normally written as a plus number.`);
  if (ok(e.sph) && Math.abs(e.sph) > 30) out.push(`${label} SPH ${raw.sph} is outside the usual range of up to 30 D. Check the paper.`);
  if (ok(e.cyl) && Math.abs(e.cyl) > 15) out.push(`${label} CYL ${raw.cyl} is outside the usual range of up to 15 D. Check the paper.`);
  if (ok(e.axis) && (!Number.isInteger(e.axis) || e.axis < 1 || e.axis > 180)) out.push(`${label} AXIS must be a whole number from 1 to 180 degrees (you typed ${raw.axis}).`);
  if (ok(e.cyl) && e.cyl !== 0 && !ok(e.axis)) out.push(`${label} has a CYL but no AXIS. They go together; check the paper for the axis.`);
  if (ok(e.axis) && !(ok(e.cyl) && e.cyl !== 0)) out.push(`${label} has an AXIS but no CYL. An axis only means something with a cylinder.`);
  if (ok(e.prism) && e.prism < 0) out.push(`${label} PRISM is written without a minus sign; the BASE says the direction.`);
  if (ok(e.prism) && e.prism !== 0 && !e.base) out.push(`${label} has PRISM but no BASE direction.`);
  return out;
}

/** Check pupillary distance entries (mm). */
export function checkPd(total: string, right: string, left: string): string[] {
  const out: string[] = [];
  const t = readNum(total), r = readNum(right), l = readNum(left);
  if (t !== null && (Number.isNaN(t) || t < 40 || t > 80)) out.push('PD: a single (total) PD is usually between 40 and 80 mm. Check the paper.');
  for (const [n, v] of [['right', r], ['left', l]] as const) if (v !== null && (Number.isNaN(v) || v < 20 || v > 45)) out.push(`PD: the ${n} PD (one eye to the centre of the nose) is usually between 20 and 45 mm. Check the paper.`);
  if ((r === null) !== (l === null)) out.push('PD: type both the right and the left PD, or use the single number.');
  return out;
}

/** One line describing the paper for an eye's SPH. Description only, not advice. */
export function describeSph(sph: number): string {
  if (round2(sph) === 0) return 'No spherical power (plano) in this eye.';
  return sph < 0
    ? 'A minus number: on this paper it is the kind of lens power used for short-sightedness (near-sightedness).'
    : 'A plus number: on this paper it is the kind of lens power used for long-sightedness (far-sightedness).';
}
