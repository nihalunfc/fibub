// Step-by-step arterial blood gas interpretation for teaching: primary disorder, expected compensation
// (Winter's formula and the usual rules of thumb), anion gap with albumin correction, delta ratio and
// osmolar gap. Units here: pCO2 mmHg, HCO3/Na/Cl/lactate/glucose/urea mmol/L, albumin g/dL, osmolality mOsm/kg.
// Plain maths, no DOM.

export interface AbgInput {
  ph: number; pco2: number; hco3: number; na: number; cl: number; alb: number;
  lactate?: number; glucose?: number; urea?: number; osm?: number;
}
/** Assumed normal values; teaching defaults, editable on the page. */
export interface AbgNormals { pco2: number; hco3: number; ag: number; agHigh: number; alb: number; osmGap: number; lactate: number }
export const NORMALS: AbgNormals = { pco2: 40, hco3: 24, ag: 12, agHigh: 16, alb: 4, osmGap: 10, lactate: 2 };

export type Tone = 'good' | 'warn' | 'bad' | '';
export interface AbgStep { title: string; text: string; tone: Tone }
export interface AbgResult {
  status: 'acidaemia' | 'alkalaemia' | 'normal pH';
  primary: string; disorders: string[]; steps: AbgStep[];
  phCalc: number; ag: number; agCorr: number; deltaRatio: number | null;
  expected: { what: string; lo: number; hi: number; mid: number } | null;
  /** Compensation verdict: ok, hi or lo (measured above or below the expected band), acute, chronic, either or between. */
  comp: string | null;
  osmCalc: number | null; osmGap: number | null;
}

const f1 = (x: number) => (Math.round(x * 10) / 10).toFixed(1);
const f2 = (x: number) => x.toFixed(2);

export function interpretAbg(x: AbgInput, N: AbgNormals = NORMALS): AbgResult {
  const need: [number, string, number, number][] = [[x.ph, 'pH', 6.5, 8], [x.pco2, 'pCO2 (mmHg)', 5, 200], [x.hco3, 'HCO3', 1, 80], [x.na, 'sodium', 90, 200], [x.cl, 'chloride', 50, 160], [x.alb, 'albumin (g/dL)', 0.5, 7]];
  for (const [v, name, lo, hi] of need) if (!(v >= lo && v <= hi)) throw new Error(`Enter ${name} between ${lo} and ${hi}.`);
  const steps: AbgStep[] = [], disorders: string[] = [];
  const pLo = N.pco2 - 5, pHi = N.pco2 + 5, bLo = N.hco3 - 2, bHi = N.hco3 + 2;

  // 1. Do the numbers agree? Henderson-Hasselbalch with pK 6.1 and CO2 solubility 0.03 mmol/L per mmHg.
  const phCalc = 6.1 + Math.log10(x.hco3 / (0.03 * x.pco2));
  const off = Math.abs(phCalc - x.ph) > 0.05;
  steps.push({ title: 'Check the numbers agree', text: `Henderson-Hasselbalch: 6.1 + log10(${x.hco3} ÷ (0.03 × ${x.pco2})) = ${f2(phCalc)}, against a measured pH of ${f2(x.ph)}. ${off ? 'They differ by more than 0.05: check the values or the units before going on.' : 'They agree within 0.05.'}`, tone: off ? 'warn' : 'good' });

  // 2. Acidaemia or alkalaemia.
  const status = x.ph < 7.35 ? 'acidaemia' : x.ph > 7.45 ? 'alkalaemia' : 'normal pH';
  steps.push({ title: 'pH', text: `pH ${f2(x.ph)}: ${status === 'normal pH' ? 'within 7.35 to 7.45' : status}.`, tone: status === 'normal pH' ? 'good' : 'bad' });

  // 3. Primary disorder.
  const hiC = x.pco2 > pHi, loC = x.pco2 < pLo, hiB = x.hco3 > bHi, loB = x.hco3 < bLo;
  let primary = '', mixedPrimary = false;
  if (status === 'acidaemia') {
    if (loB && hiC) { primary = 'Mixed metabolic and respiratory acidosis'; mixedPrimary = true; }
    else if (loB) primary = 'Metabolic acidosis';
    else if (hiC) primary = 'Respiratory acidosis';
  } else if (status === 'alkalaemia') {
    if (hiB && loC) { primary = 'Mixed metabolic and respiratory alkalosis'; mixedPrimary = true; }
    else if (hiB) primary = 'Metabolic alkalosis';
    else if (loC) primary = 'Respiratory alkalosis';
  } else {
    if (hiC && hiB) primary = x.ph < 7.4 ? 'Respiratory acidosis' : 'Metabolic alkalosis';
    else if (loC && loB) primary = x.ph < 7.4 ? 'Metabolic acidosis' : 'Respiratory alkalosis';
  }
  const ranges = `pCO2 ${pLo} to ${pHi} mmHg, HCO3 ${bLo} to ${bHi} mmol/L`;
  if (primary) {
    if (mixedPrimary) disorders.push('Metabolic ' + (status === 'acidaemia' ? 'acidosis' : 'alkalosis'), 'Respiratory ' + (status === 'acidaemia' ? 'acidosis' : 'alkalosis'));
    else disorders.push(primary);
    const why = mixedPrimary ? 'pCO2 and HCO3 both move the pH the same way, so both are primary.'
      : primary.startsWith('Metabolic') ? `HCO3 ${x.hco3} is ${loB ? 'low' : 'high'} and explains the pH.` : `pCO2 ${x.pco2} is ${hiC ? 'high' : 'low'} and explains the pH.`;
    steps.push({ title: 'Primary disorder', text: `${primary}. ${why}${status === 'normal pH' ? ' The pH is normal while both values are abnormal: either full compensation (rare) or two opposite disorders; the side of 7.40 the pH lies on suggests the primary one.' : ''} (Assumed ranges: ${ranges}.)`, tone: 'bad' });
  } else if (status !== 'normal pH') {
    steps.push({ title: 'Primary disorder', text: `The pH is abnormal but pCO2 and HCO3 are within ${ranges}. Check the values.`, tone: 'warn' });
  } else if (hiC || loC || hiB || loB) {
    steps.push({ title: 'Primary disorder', text: `pH is normal and only one of pCO2 or HCO3 is outside ${ranges}. That does not fit a single disorder: check the values, or think of two opposing processes.`, tone: 'warn' });
  } else {
    steps.push({ title: 'Primary disorder', text: `pH, pCO2 and HCO3 are all within the assumed ranges (${ranges}).`, tone: 'good' });
  }

  // 4. Expected compensation.
  let expected: AbgResult['expected'] = null, comp: string | null = null;
  const band = (lo: number, hi: number) => `${f1(lo)} to ${f1(hi)}`;
  if (!mixedPrimary && primary === 'Metabolic acidosis') {
    const mid = 1.5 * x.hco3 + 8; expected = { what: 'pCO2', lo: mid - 2, hi: mid + 2, mid };
    let t = `Winter's formula: expected pCO2 = 1.5 × ${x.hco3} + 8 ± 2 = ${band(mid - 2, mid + 2)} mmHg. Measured ${x.pco2}: `;
    comp = x.pco2 > mid + 2 ? 'hi' : x.pco2 < mid - 2 ? 'lo' : 'ok';
    if (x.pco2 > mid + 2) { t += 'higher, so there is also a respiratory acidosis.'; disorders.push('Respiratory acidosis (additional)'); }
    else if (x.pco2 < mid - 2) { t += 'lower, so there is also a respiratory alkalosis.'; disorders.push('Respiratory alkalosis (additional)'); }
    else t += 'within the range: appropriate respiratory compensation.';
    steps.push({ title: 'Expected compensation', text: t, tone: x.pco2 > mid + 2 || x.pco2 < mid - 2 ? 'bad' : 'good' });
  } else if (!mixedPrimary && primary === 'Metabolic alkalosis') {
    const mid = N.pco2 + 0.7 * (x.hco3 - N.hco3); expected = { what: 'pCO2', lo: mid - 5, hi: mid + 5, mid };
    let t = `Expected pCO2 = ${N.pco2} + 0.7 × (${x.hco3} − ${N.hco3}) ± 5 = ${band(mid - 5, mid + 5)} mmHg. Measured ${x.pco2}: `;
    comp = x.pco2 > mid + 5 ? 'hi' : x.pco2 < mid - 5 ? 'lo' : 'ok';
    if (x.pco2 > mid + 5) { t += 'higher, so there is also a respiratory acidosis.'; disorders.push('Respiratory acidosis (additional)'); }
    else if (x.pco2 < mid - 5) { t += 'lower, so there is also a respiratory alkalosis.'; disorders.push('Respiratory alkalosis (additional)'); }
    else t += 'within the range: appropriate respiratory compensation.';
    steps.push({ title: 'Expected compensation', text: t, tone: x.pco2 > mid + 5 || x.pco2 < mid - 5 ? 'bad' : 'good' });
  } else if (!mixedPrimary && (primary === 'Respiratory acidosis' || primary === 'Respiratory alkalosis')) {
    const acid = primary === 'Respiratory acidosis', d = Math.abs(x.pco2 - N.pco2), sgn = acid ? 1 : -1;
    const kA = acid ? 1 : 2, kC = acid ? 3.5 : 5;
    const acute = N.hco3 + (sgn * kA * d) / 10, chronic = N.hco3 + (sgn * kC * d) / 10;
    const lo = Math.min(acute, chronic) - 2, hi = Math.max(acute, chronic) + 2;
    expected = { what: 'HCO3', lo, hi, mid: (acute + chronic) / 2 };
    let t = `pCO2 is ${f1(d)} mmHg ${acid ? 'above' : 'below'} ${N.pco2}. HCO3 should ${acid ? 'rise' : 'fall'} by about ${kA} per 10 mmHg if acute (expected ${f1(acute)}) and ${kC} per 10 if chronic (expected ${f1(chronic)}), each ± 2. Measured ${x.hco3}: `;
    const nearA = Math.abs(x.hco3 - acute) <= 2, nearC = Math.abs(x.hco3 - chronic) <= 2;
    let tone: Tone = 'good';
    comp = nearA && nearC ? 'either' : nearA ? 'acute' : nearC ? 'chronic' : x.hco3 > lo && x.hco3 < hi ? 'between' : x.hco3 >= hi ? 'hi' : 'lo';
    if (nearA && nearC) t += 'fits either; the change is too small to tell acute from chronic.';
    else if (nearA) { t += 'fits an acute (uncompensated) change.'; disorders[disorders.length - 1] += ', acute'; }
    else if (nearC) { t += 'fits a chronic (compensated) change.'; disorders[disorders.length - 1] += ', chronic'; }
    else if (x.hco3 > lo && x.hco3 < hi) { t += 'between the two: partly compensated, or acute on chronic.'; disorders[disorders.length - 1] += ', acute on chronic or partly compensated'; }
    else if (x.hco3 >= hi) { t += 'higher than either, so there is also a metabolic alkalosis.'; disorders.push('Metabolic alkalosis (additional)'); tone = 'bad'; }
    else { t += 'lower than either, so there is also a metabolic acidosis.'; disorders.push('Metabolic acidosis (additional)'); tone = 'bad'; }
    steps.push({ title: 'Expected compensation', text: t, tone });
  } else if (mixedPrimary) {
    steps.push({ title: 'Expected compensation', text: 'Not applicable: both systems push the pH the same way, so neither is compensating.', tone: 'bad' });
  }

  // 5. Anion gap, corrected for albumin (Figge et al. 1998: 2.5 per g/dL).
  const ag = x.na - x.cl - x.hco3, agCorr = ag + 2.5 * (N.alb - x.alb), high = agCorr > N.agHigh;
  steps.push({ title: 'Anion gap', text: `AG = Na − (Cl + HCO3) = ${x.na} − (${x.cl} + ${x.hco3}) = ${f1(ag)} mmol/L. Corrected for albumin: ${f1(ag)} + 2.5 × (${N.alb} − ${x.alb}) = ${f1(agCorr)}. ${high ? `Above ${N.agHigh}: a high anion gap metabolic acidosis is present.` : agCorr < N.ag - 6 ? 'Unusually low: check the values (low albumin is already allowed for).' : `Not raised (${N.agHigh} or less).`}`, tone: high ? 'bad' : 'good' });
  const metAcid = disorders.some((d) => d.startsWith('Metabolic acidosis'));
  if (high) {
    const k = disorders.findIndex((d) => d.startsWith('Metabolic acidosis'));
    if (k >= 0) disorders[k] = disorders[k].replace('Metabolic acidosis', 'High anion gap metabolic acidosis');
    else disorders.push('High anion gap metabolic acidosis');
  } else if (metAcid) {
    const k = disorders.findIndex((d) => d.startsWith('Metabolic acidosis'));
    disorders[k] = disorders[k].replace('Metabolic acidosis', 'Normal anion gap (hyperchloraemic) metabolic acidosis');
  }

  // 6. Delta ratio when the gap is high.
  let deltaRatio: number | null = null;
  if (high) {
    const dAg = agCorr - N.ag, dB = N.hco3 - x.hco3;
    if (dB > 0) {
      deltaRatio = dAg / dB;
      let t = `Delta ratio = (AG − ${N.ag}) ÷ (${N.hco3} − HCO3) = ${f1(dAg)} ÷ ${f1(dB)} = ${f2(deltaRatio)}. `;
      if (deltaRatio < 0.4) { t += 'Under 0.4: mainly a normal anion gap (hyperchloraemic) acidosis.'; addOnce(disorders, 'Normal anion gap metabolic acidosis (additional)'); }
      else if (deltaRatio < 0.8) { t += '0.4 to 0.8: high and normal anion gap acidoses together.'; addOnce(disorders, 'Normal anion gap metabolic acidosis (additional)'); }
      else if (deltaRatio <= 2) t += '0.8 to 2: a pure high anion gap acidosis (lactic acidosis often 1.6 or so, ketoacidosis nearer 1).';
      else { t += 'Above 2: HCO3 is higher than the gap explains, so a metabolic alkalosis (or a compensated chronic respiratory acidosis) is also present.'; if (!disorders.some((d) => d.startsWith('Metabolic alkalosis')) && !disorders.some((d) => d.includes('Respiratory acidosis, chronic'))) disorders.push('Metabolic alkalosis (additional)'); }
      steps.push({ title: 'Delta ratio', text: t, tone: deltaRatio >= 0.8 && deltaRatio <= 2 ? '' : 'bad' });
    } else {
      steps.push({ title: 'Delta ratio', text: `The gap is high but HCO3 (${x.hco3}) is not below ${N.hco3}: a high anion gap acidosis hidden by a metabolic alkalosis.`, tone: 'bad' });
      if (!disorders.some((d) => d.startsWith('Metabolic alkalosis'))) disorders.push('Metabolic alkalosis (additional)');
    }
  }

  // 7. Lactate.
  if (x.lactate !== undefined) {
    if (!(x.lactate >= 0 && x.lactate <= 40)) throw new Error('Enter lactate between 0 and 40 mmol/L.');
    const raised = x.lactate > N.lactate;
    let t = `Lactate ${x.lactate} mmol/L: ${raised ? `above ${N.lactate}, so lactic acidosis likely contributes.` : `not above ${N.lactate}.`}`;
    if (high) { const rest = agCorr - N.ag - x.lactate; t += rest > 4 ? ` About ${f1(rest)} mmol/L of the raised gap is not lactate: think of ketones, kidney failure or toxins.` : ' Lactate explains most of the raised gap.'; }
    steps.push({ title: 'Lactate', text: t, tone: raised ? 'bad' : 'good' });
  }

  // 8. Osmolar gap.
  let osmCalc: number | null = null, osmGap: number | null = null;
  if (x.osm !== undefined || x.glucose !== undefined || x.urea !== undefined) {
    if (x.glucose === undefined || x.urea === undefined) throw new Error('For the osmolality, enter glucose and urea too.');
    if (!(x.glucose >= 0 && x.glucose <= 150)) throw new Error('Enter glucose between 0 and 150 mmol/L (0 and 2700 mg/dL).');
    if (!(x.urea >= 0 && x.urea <= 150)) throw new Error('Enter urea between 0 and 150 mmol/L.');
    osmCalc = 2 * x.na + x.glucose + x.urea;
    let t = `Calculated osmolality = 2 × Na + glucose + urea = 2 × ${x.na} + ${x.glucose} + ${x.urea} = ${f1(osmCalc)} mOsm/kg.`;
    let tone: Tone = '';
    if (x.osm !== undefined) {
      if (!(x.osm >= 200 && x.osm <= 500)) throw new Error('Enter measured osmolality between 200 and 500 mOsm/kg.');
      osmGap = x.osm - osmCalc;
      const raised = osmGap > N.osmGap;
      t += ` Osmolar gap = ${x.osm} − ${f1(osmCalc)} = ${f1(osmGap)}. ${raised ? `Above ${N.osmGap}: unmeasured osmoles (for example a toxic alcohol${high ? ', which fits the high anion gap' : ''}).` : `Not raised (${N.osmGap} or less).`}`;
      tone = raised ? 'bad' : 'good';
      if (raised) disorders.push('Raised osmolar gap');
    } else t += ' Enter the measured osmolality to get the gap.';
    steps.push({ title: 'Osmolar gap', text: t, tone });
  }

  if (!disorders.length) disorders.push('No acid-base disorder found');
  return { status, primary: primary || (status === 'normal pH' && !(hiC || loC || hiB || loB) ? 'None' : 'Unclear'), disorders, steps, phCalc, ag, agCorr, deltaRatio, expected, comp, osmCalc, osmGap };
}
function addOnce(list: string[], s: string) { if (!list.includes(s)) list.push(s); }
