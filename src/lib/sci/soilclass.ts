// Soil classification from lab data: the Unified Soil Classification System (USCS, the decision logic of
// ASTM D2487 written out in fibub's own words) and the AASHTO system (AASHTO M 145 logic), with the group
// index formula. Plain maths, no DOM. Sieve sizes are in mm, percentages are percent of the whole sample.

/** Sieve sizes the systems use (mm): No. 4, No. 10, No. 40, No. 200. */
export const SIEVE = { no4: 4.75, no10: 2.0, no40: 0.425, no200: 0.075 };

/** Size at which `p` percent passes, by straight-line interpolation of percent passing against log(size). NaN when the curve does not reach p. */
export function dAt(size: number[], pass: number[], p: number): number {
  const o = size.map((s, i) => [s, pass[i]]).filter((r) => r[0] > 0 && Number.isFinite(r[1])).sort((a, b) => a[0] - b[0]);
  for (let i = 0; i < o.length - 1; i++) {
    const [s1, p1] = o[i], [s2, p2] = o[i + 1];
    if (p1 === p && p2 === p) return s1;
    if ((p1 <= p && p <= p2) || (p2 <= p && p <= p1)) {
      if (p2 === p1) return s1;
      return 10 ** (Math.log10(s1) + ((p - p1) / (p2 - p1)) * (Math.log10(s2) - Math.log10(s1)));
    }
  }
  return NaN;
}

/** Percent passing a sieve of size d, interpolated on log(size). 100 above the largest sieve if that passes 100 %; NaN below the finest sieve unless it passes 0 %. */
export function passingAt(size: number[], pass: number[], d: number): number {
  const o = size.map((s, i) => [s, pass[i]]).filter((r) => r[0] > 0 && Number.isFinite(r[1])).sort((a, b) => a[0] - b[0]);
  if (!o.length) return NaN;
  const [sMin, pMin] = o[0], [sMax, pMax] = o[o.length - 1];
  if (d >= sMax) return d === sMax || pMax >= 100 ? (d === sMax ? pMax : 100) : NaN;
  if (d <= sMin) return d === sMin || pMin <= 0 ? (d === sMin ? pMin : 0) : NaN;
  for (let i = 0; i < o.length - 1; i++) {
    const [s1, p1] = o[i], [s2, p2] = o[i + 1];
    if (d >= s1 && d <= s2) return p1 + ((Math.log10(d) - Math.log10(s1)) / (Math.log10(s2) - Math.log10(s1))) * (p2 - p1);
  }
  return NaN;
}

/** Casagrande's A-line: PI = 0.73 (LL − 20), with the horizontal part at PI = 4 below LL 25.5. */
export const aLine = (LL: number) => Math.max(4, 0.73 * (LL - 20));
/** The U-line, an upper limit for natural soils: PI = 0.9 (LL − 8), vertical at LL = 16 up to PI = 7. */
export const uLine = (LL: number) => 0.9 * (LL - 8);

export type Fines = 'CL' | 'ML' | 'CL-ML' | 'CH' | 'MH' | 'OL' | 'OH';
export type Input = {
  gravel: number; sand: number; fines: number; // % of the whole sample (retained on 4.75 mm, 4.75 to 0.075 mm, passing 0.075 mm)
  d10?: number; d30?: number; d60?: number; // mm
  LL?: number; PL?: number; nonPlastic?: boolean; LLdry?: number; // LL after oven drying, for the organic test
};
export type Uscs = { symbol: string; name: string; steps: string[]; Cu: number; Cc: number; PI: number; fineGroup: Fines | null };

/** Classify the fines (or a fine-grained soil) on the plasticity chart. */
export function finesGroup(LL: number, PI: number, nonPlastic: boolean, LLdry?: number): { g: Fines; why: string } {
  if (nonPlastic) return { g: 'ML', why: 'The fines are non-plastic, so they count as silt (ML).' };
  const organic = LLdry != null && Number.isFinite(LLdry) && LLdry > 0 && LL > 0 && LLdry / LL < 0.75;
  const above = PI >= 0.73 * (LL - 20);
  if (organic) {
    const g: Fines = LL < 50 ? 'OL' : 'OH';
    return { g, why: `LL after oven drying ÷ LL = ${round(LLdry! / LL, 2)} is below 0.75, so the fines are organic; LL ${LL < 50 ? 'below' : 'at or above'} 50 gives ${g}.` };
  }
  if (LL < 50) {
    if (PI > 7 && above) return { g: 'CL', why: `LL = ${round(LL, 1)} is below 50 and PI = ${round(PI, 1)} is above 7 and on or above the A-line (${round(0.73 * (LL - 20), 1)}), so lean clay (CL).` };
    if (PI >= 4 && PI <= 7 && above) return { g: 'CL-ML', why: `LL = ${round(LL, 1)} is below 50 and PI = ${round(PI, 1)} is between 4 and 7, on or above the A-line, so silty clay (CL-ML).` };
    return { g: 'ML', why: `LL = ${round(LL, 1)} is below 50 and PI = ${round(PI, 1)} is ${PI < 4 ? 'below 4' : `below the A-line (${round(0.73 * (LL - 20), 1)})`}, so silt (ML).` };
  }
  if (above) return { g: 'CH', why: `LL = ${round(LL, 1)} is 50 or more and PI = ${round(PI, 1)} is on or above the A-line (${round(0.73 * (LL - 20), 1)}), so fat clay (CH).` };
  return { g: 'MH', why: `LL = ${round(LL, 1)} is 50 or more and PI = ${round(PI, 1)} is below the A-line (${round(0.73 * (LL - 20), 1)}), so elastic silt (MH).` };
}

const round = (x: number, d: number) => String(+x.toFixed(d));
const FINE_NAME: Record<Fines, string> = { CL: 'lean clay', ML: 'silt', 'CL-ML': 'silty clay', CH: 'fat clay', MH: 'elastic silt', OL: 'organic clay or silt', OH: 'organic clay or silt' };
const COARSE_NAME: Record<string, string> = {
  GW: 'well-graded gravel', GP: 'poorly graded gravel', GM: 'silty gravel', GC: 'clayey gravel', 'GC-GM': 'silty, clayey gravel',
  SW: 'well-graded sand', SP: 'poorly graded sand', SM: 'silty sand', SC: 'clayey sand', 'SC-SM': 'silty, clayey sand',
  'GW-GM': 'well-graded gravel with silt', 'GW-GC': 'well-graded gravel with clay', 'GP-GM': 'poorly graded gravel with silt', 'GP-GC': 'poorly graded gravel with clay',
  'SW-SM': 'well-graded sand with silt', 'SW-SC': 'well-graded sand with clay', 'SP-SM': 'poorly graded sand with silt', 'SP-SC': 'poorly graded sand with clay',
};

/** USCS group symbol and group name, with the steps that led there. */
export function uscs(x: Input): Uscs {
  const { gravel, sand, fines } = x;
  const tot = gravel + sand + fines;
  if (!(gravel >= 0 && sand >= 0 && fines >= 0) || Math.abs(tot - 100) > 0.5) throw new Error('Gravel, sand and fines must be 0 or more and add up to 100 %.');
  const np = !!x.nonPlastic;
  const LL = x.LL ?? NaN, PL = x.PL ?? NaN;
  const PI = np ? 0 : LL - PL;
  const needPlastic = fines >= 5;
  if (needPlastic && !np) {
    if (!(LL >= 0 && PL >= 0)) throw new Error('With 5 % fines or more, give the liquid and plastic limits (or tick non-plastic).');
    if (PL > LL) throw new Error('The plastic limit is above the liquid limit; check the numbers or tick non-plastic.');
  }
  const Cu = (x.d60 ?? NaN) / (x.d10 ?? NaN), Cc = (x.d30 ?? NaN) ** 2 / ((x.d10 ?? NaN) * (x.d60 ?? NaN));
  const steps: string[] = [];
  if (fines >= 50) {
    steps.push(`Fines (passing 0.075 mm) = ${round(fines, 1)} %, 50 % or more, so the soil is fine-grained.`);
    const f = finesGroup(LL, PI, np, x.LLdry);
    steps.push(f.why);
    const coarse = gravel + sand, sandy = sand >= gravel;
    let name = FINE_NAME[f.g];
    if (coarse >= 30) {
      const other = sandy ? gravel : sand;
      name = `${sandy ? 'sandy' : 'gravelly'} ${name}${other >= 15 ? ` with ${sandy ? 'gravel' : 'sand'}` : ''}`;
      steps.push(`Sand + gravel = ${round(coarse, 1)} %, 30 % or more, and ${sandy ? 'sand' : 'gravel'} is the larger part, so the name starts "${sandy ? 'sandy' : 'gravelly'}"${other >= 15 ? ` and adds "with ${sandy ? 'gravel' : 'sand'}" (${round(other, 1)} %)` : ''}.`);
    } else if (coarse >= 15) {
      name = `${name} with ${sandy ? 'sand' : 'gravel'}`;
      steps.push(`Sand + gravel = ${round(coarse, 1)} %, between 15 and 30 %, so "with ${sandy ? 'sand' : 'gravel'}" is added.`);
    }
    return { symbol: f.g, name, steps, Cu, Cc, PI, fineGroup: f.g };
  }
  steps.push(`Fines = ${round(fines, 1)} %, below 50 %, so the soil is coarse-grained.`);
  const G = gravel > sand;
  const L = G ? 'G' : 'S';
  steps.push(G ? `Gravel (${round(gravel, 1)} %) is more than sand (${round(sand, 1)} %): more than half the coarse part stays on the 4.75 mm sieve, so it is a gravel (G).` : `Sand (${round(sand, 1)} %) is at least as much as gravel (${round(gravel, 1)} %), so it is a sand (S).`);
  const grade = () => {
    if (!(Cu > 0 && Cc > 0)) throw new Error('With less than 12 % fines the grading matters: give D10, D30 and D60 (or a grading curve that reaches 10 % passing).');
    const cuMin = G ? 4 : 6, well = Cu >= cuMin && Cc >= 1 && Cc <= 3;
    steps.push(`Cu = D60/D10 = ${round(Cu, 2)} and Cc = D30²/(D10·D60) = ${round(Cc, 2)}. Well graded needs Cu ≥ ${cuMin} and 1 ≤ Cc ≤ 3, so it is ${well ? 'well graded (W)' : 'poorly graded (P)'}.`);
    return well ? 'W' : 'P';
  };
  let symbol: string, fg: Fines | null = null;
  if (fines < 5) {
    symbol = L + grade();
    steps.push(`Fines below 5 %, so a single symbol: ${symbol}.`);
  } else {
    const f = finesGroup(LL, PI, np); fg = f.g;
    steps.push(`The fines: ${f.why}`);
    const clayey = f.g === 'CL' || f.g === 'CH';
    if (fines <= 12) {
      const second = f.g === 'CL-ML' || clayey ? 'C' : 'M';
      symbol = `${L}${grade()}-${L}${second}`;
      steps.push(`Fines between 5 and 12 %, so a dual symbol: the grading, then ${second === 'C' ? 'clayey' : 'silty'} fines (${L}${second}): ${symbol}.`);
    } else {
      symbol = f.g === 'CL-ML' ? `${L}C-${L}M` : `${L}${clayey ? 'C' : 'M'}`;
      steps.push(`Fines above 12 %, so the fines name the group: ${symbol}.`);
    }
  }
  let name = COARSE_NAME[symbol];
  const other = G ? sand : gravel;
  if (other >= 15) { name += `${name.includes(' with ') ? ' and' : ' with'} ${G ? 'sand' : 'gravel'}`; steps.push(`${G ? 'Sand' : 'Gravel'} = ${round(other, 1)} %, 15 % or more, so "${G ? 'sand' : 'gravel'}" is added to the name.`); }
  return { symbol, name, steps, Cu, Cc, PI, fineGroup: fg };
}

export type AashtoIn = { p10: number; p40: number; p200: number; LL: number; PI: number; nonPlastic?: boolean };
export type Aashto = { group: string; GI: number; giRaw: number; giText: string; steps: string[]; material: string };

/** AASHTO group (left-to-right elimination) and group index. */
export function aashto(x: AashtoIn): Aashto {
  const { p10, p40, p200 } = x, np = !!x.nonPlastic;
  const LL = np ? 0 : x.LL, PI = np ? 0 : x.PI;
  if (![p10, p40, p200].every((v) => v >= 0 && v <= 100)) throw new Error('Percent passing 2 mm, 0.425 mm and 0.075 mm must be between 0 and 100.');
  if (!(p10 >= p40 && p40 >= p200)) throw new Error('Percent passing must fall as the sieve gets finer (2 mm ≥ 0.425 mm ≥ 0.075 mm).');
  if (!np && !(LL >= 0 && PI >= 0)) throw new Error('Give LL and PI (or tick non-plastic) for the AASHTO group.');
  const steps: string[] = [];
  let group = '';
  const F = p200;
  if (F <= 35) {
    steps.push(`Passing 0.075 mm = ${round(F, 1)} %, 35 % or less: granular material (A-1, A-3 or A-2).`);
    if (p10 <= 50 && p40 <= 30 && F <= 15 && PI <= 6) { group = 'A-1-a'; steps.push('2 mm ≤ 50 %, 0.425 mm ≤ 30 %, 0.075 mm ≤ 15 % and PI ≤ 6: A-1-a.'); }
    else if (p40 <= 50 && F <= 25 && PI <= 6) { group = 'A-1-b'; steps.push('Not A-1-a; 0.425 mm ≤ 50 %, 0.075 mm ≤ 25 % and PI ≤ 6: A-1-b.'); }
    else if (p40 > 50 && F <= 10 && (np || PI <= 0)) { group = 'A-3'; steps.push('Not A-1; more than 50 % passes 0.425 mm, 0.075 mm ≤ 10 % and non-plastic: A-3 (fine sand).'); }
    else {
      const hiLL = LL > 40, hiPI = PI > 10;
      group = hiPI ? (hiLL ? 'A-2-7' : 'A-2-6') : (hiLL ? 'A-2-5' : 'A-2-4');
      steps.push(`Not A-1 or A-3, so A-2. LL = ${round(LL, 1)} (${hiLL ? 'above' : 'at most'} 40) and PI = ${round(PI, 1)} (${hiPI ? 'above' : 'at most'} 10): ${group}.`);
    }
  } else {
    steps.push(`Passing 0.075 mm = ${round(F, 1)} %, more than 35 %: silt-clay material (A-4 to A-7).`);
    const hiLL = LL > 40, hiPI = PI > 10;
    if (!hiPI) group = hiLL ? 'A-5' : 'A-4';
    else if (!hiLL) group = 'A-6';
    else group = PI <= LL - 30 ? 'A-7-5' : 'A-7-6';
    steps.push(`LL = ${round(LL, 1)} (${hiLL ? 'above' : 'at most'} 40) and PI = ${round(PI, 1)} (${hiPI ? 'above' : 'at most'} 10): ${group.slice(0, 3)}.` + (group.startsWith('A-7') ? ` PI ${PI <= LL - 30 ? '≤' : '>'} LL − 30 = ${round(LL - 30, 1)}, so ${group}.` : ''));
  }
  const gi = groupIndex(F, LL, PI, group);
  const material = /^A-(1|3|2-4|2-5)/.test(group) ? 'stone, gravel and sand; usually excellent to good as subgrade' : /^A-2/.test(group) ? 'silty or clayey gravel and sand' : /^A-(4|5)/.test(group) ? 'silty soils; fair to poor as subgrade' : 'clayey soils; fair to poor as subgrade';
  return { group, GI: gi.GI, giRaw: gi.raw, giText: gi.text, steps, material };
}

/** AASHTO group index GI = (F − 35)[0.2 + 0.005(LL − 40)] + 0.01(F − 15)(PI − 10), negative → 0, rounded; only the PI term for A-2-6 and A-2-7; 0 for A-1, A-3, A-2-4 and A-2-5. */
export function groupIndex(F: number, LL: number, PI: number, group: string): { GI: number; raw: number; text: string } {
  if (/^A-(1|3)/.test(group) || group === 'A-2-4' || group === 'A-2-5') return { GI: 0, raw: 0, text: `GI is 0 for ${group}.` };
  const t2 = 0.01 * (F - 15) * (PI - 10);
  if (group === 'A-2-6' || group === 'A-2-7') {
    const GI = Math.max(0, Math.round(t2));
    return { GI, raw: t2, text: `For A-2-6 and A-2-7 only the PI part counts: GI = 0.01(F − 15)(PI − 10) = 0.01 × (${round(F, 1)} − 15) × (${round(PI, 1)} − 10) = ${round(t2, 2)}${t2 < 0 ? ', below 0 so 0' : ''}, reported as ${GI}.` };
  }
  const t1 = (F - 35) * (0.2 + 0.005 * (LL - 40)), raw = t1 + t2, GI = Math.max(0, Math.round(raw));
  return { GI, raw, text: `GI = (F − 35)[0.2 + 0.005(LL − 40)] + 0.01(F − 15)(PI − 10) = (${round(F, 1)} − 35)[0.2 + 0.005(${round(LL, 1)} − 40)] + 0.01(${round(F, 1)} − 15)(${round(PI, 1)} − 10) = ${round(t1, 2)} + ${round(t2, 2)} = ${round(raw, 2)}${raw < 0 ? ', below 0 so 0' : ''}, reported as ${GI}.` };
}

/** Everything from a grading curve: fractions, D-sizes and AASHTO sieves. */
export function fromCurve(size: number[], pass: number[]) {
  const p4 = passingAt(size, pass, SIEVE.no4), p10 = passingAt(size, pass, SIEVE.no10), p40 = passingAt(size, pass, SIEVE.no40), p200 = passingAt(size, pass, SIEVE.no200);
  return { p4, p10, p40, p200, gravel: 100 - p4, sand: p4 - p200, fines: p200, d10: dAt(size, pass, 10), d30: dAt(size, pass, 30), d60: dAt(size, pass, 60) };
}
