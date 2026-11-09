// The model behind the HACCP plan builder: a product description, the process flow, hazards per step, the
// generic CCP decision questions (written in fibub's own words after the widely taught Codex decision tree),
// and the details for each critical control point. Turns a plan into tables for CSV, PDF and Word. No DOM.

export type Answer = '' | 'yes' | 'no';
export type HazardType = 'B' | 'C' | 'P';
export const HAZARD_TYPES: Record<HazardType, string> = { B: 'Biological', C: 'Chemical', P: 'Physical' };

export type QKey = 'q1' | 'q1b' | 'q2' | 'q3' | 'q4';
export const QUESTIONS: Record<QKey, string> = {
  q1: 'Is there a control measure for this hazard, at this step or a later one?',
  q1b: 'Does food safety need this hazard controlled at this step?',
  q2: 'Is this step made specifically to remove the hazard or bring it down to a safe level?',
  q3: 'Could the hazard get in here, or grow, to a level that is not safe?',
  q4: 'Will a later step remove the hazard or bring it down to a safe level?',
};

export const CCP_FIELDS = [
  { id: 'limit', name: 'Critical limit', hint: 'The measurable value that separates safe from unsafe, from your validation.' },
  { id: 'monitoring', name: 'Monitoring', hint: 'What is checked, how, how often and by whom.' },
  { id: 'corrective', name: 'Corrective action', hint: 'What happens to the product and the process when the limit is missed.' },
  { id: 'verification', name: 'Verification', hint: 'How you confirm the control works (checks, calibration, reviews).' },
  { id: 'records', name: 'Records', hint: 'Which logs are kept, and for how long.' },
] as const;
export type CcpField = (typeof CCP_FIELDS)[number]['id'];

export type Hazard = { step: string; type: HazardType; hazard: string; control: string } & Record<QKey, Answer> & Record<CcpField, string>;

export const PRODUCT_FIELDS = [
  { id: 'name', name: 'Product name' },
  { id: 'description', name: 'Description and ingredients' },
  { id: 'use', name: 'Intended use and consumers' },
  { id: 'packaging', name: 'Packaging' },
  { id: 'storage', name: 'Storage and distribution' },
  { id: 'shelfLife', name: 'Shelf life' },
  { id: 'allergens', name: 'Allergens' },
  { id: 'team', name: 'HACCP team (roles)' },
] as const;
export type ProductField = (typeof PRODUCT_FIELDS)[number]['id'];

export type Plan = { product: Record<ProductField, string>; steps: string[]; hazards: Hazard[] };

export const emptyHazard = (step = ''): Hazard => ({ step, type: 'B', hazard: '', control: '', q1: '', q1b: '', q2: '', q3: '', q4: '', limit: '', monitoring: '', corrective: '', verification: '', records: '' });
export const emptyPlan = (): Plan => ({ product: Object.fromEntries(PRODUCT_FIELDS.map((f) => [f.id, ''])) as Plan['product'], steps: [], hazards: [] });

export type Decision = { result: 'ccp' | 'not' | 'modify' | 'pending'; asked: QKey[]; text: string };

/** Walks the decision questions for one hazard: which have been asked so far, and the outcome once answered. */
export function decide(h: Pick<Hazard, QKey>): Decision {
  const asked: QKey[] = ['q1'];
  const pending = (): Decision => ({ result: 'pending', asked, text: 'Answer the questions' });
  if (!h.q1) return pending();
  if (h.q1 === 'no') {
    asked.push('q1b');
    if (!h.q1b) return pending();
    return h.q1b === 'yes'
      ? { result: 'modify', asked, text: 'Change the step, process or product to add a control, then ask again' }
      : { result: 'not', asked, text: 'Not a CCP' };
  }
  asked.push('q2');
  if (!h.q2) return pending();
  if (h.q2 === 'yes') return { result: 'ccp', asked, text: 'CCP' };
  asked.push('q3');
  if (!h.q3) return pending();
  if (h.q3 === 'no') return { result: 'not', asked, text: 'Not a CCP' };
  asked.push('q4');
  if (!h.q4) return pending();
  return h.q4 === 'yes' ? { result: 'not', asked, text: 'Not a CCP (a later step controls it)' } : { result: 'ccp', asked, text: 'CCP' };
}

/** Hazards in flow order, with their decision and a CCP number (CCP 1, 2, ... in step order). */
export function analysePlan(p: Plan): { h: Hazard; i: number; d: Decision; ccp: number | null; stepNo: number }[] {
  const order = (s: string) => { const k = p.steps.indexOf(s); return k < 0 ? Infinity : k; };
  const list = p.hazards.map((h, i) => ({ h, i, d: decide(h), ccp: null as number | null, stepNo: order(h.step) + 1 }));
  list.sort((a, b) => order(a.h.step) - order(b.h.step) || a.i - b.i);
  let n = 0;
  for (const x of list) if (x.d.result === 'ccp') x.ccp = ++n;
  return list;
}

/** Problems worth showing before printing: hazards on steps no longer in the flow, CCPs with empty details. */
export function problems(p: Plan): string[] {
  const out: string[] = [];
  const a = analysePlan(p);
  for (const x of a) {
    const label = x.h.hazard || `hazard ${x.i + 1}`;
    if (!p.steps.includes(x.h.step)) out.push(`"${label}" is on a step that is not in the flow (${x.h.step || 'none chosen'}).`);
    if (!x.h.hazard.trim()) out.push(`Hazard ${x.i + 1} has no description.`);
    if (x.ccp) { const miss = CCP_FIELDS.filter((f) => !x.h[f.id].trim()).map((f) => f.name.toLowerCase()); if (miss.length) out.push(`CCP ${x.ccp} (${label}) has no ${miss.join(', ')}.`); }
    if (x.d.result === 'modify') out.push(`"${label}" needs a control measure added before the plan is complete.`);
  }
  return out;
}

const clip = (s: unknown, n = 4000) => (typeof s === 'string' ? s.slice(0, n) : '');
const ans = (s: unknown): Answer => (s === 'yes' || s === 'no' ? s : '');
/** A plan read back from saved JSON (this browser only), keeping only known fields as plain text. */
export function fromJSON(text: string | null): Plan | null {
  if (!text) return null;
  let o: unknown;
  try { o = JSON.parse(text); } catch { return null; }
  if (!o || typeof o !== 'object') return null;
  const r = o as Record<string, unknown>, p = emptyPlan();
  const prod = (r.product ?? {}) as Record<string, unknown>;
  for (const f of PRODUCT_FIELDS) p.product[f.id] = clip(prod[f.id]);
  p.steps = Array.isArray(r.steps) ? r.steps.map((s) => clip(s, 200)).filter(Boolean).slice(0, 200) : [];
  p.hazards = Array.isArray(r.hazards) ? r.hazards.slice(0, 500).map((x) => {
    const y = (x ?? {}) as Record<string, unknown>, h = emptyHazard(clip(y.step, 200));
    h.type = y.type === 'C' || y.type === 'P' ? y.type : 'B';
    h.hazard = clip(y.hazard); h.control = clip(y.control);
    for (const k of Object.keys(QUESTIONS) as QKey[]) h[k] = ans(y[k]);
    for (const f of CCP_FIELDS) h[f.id] = clip(y[f.id]);
    return h;
  }) : [];
  return p;
}

/** Steps from a text box: one per line, numbering like "1." or "3)" taken off, blank lines and repeats dropped. */
export function readSteps(text: string): string[] {
  const out: string[] = [];
  for (const l of text.split(/\r?\n/)) { const s = l.replace(/^\s*\d+\s*[.)-]?\s*/, '').trim().slice(0, 200); if (s && !out.includes(s)) out.push(s); }
  return out;
}

export type Table = { head: string[]; rows: string[][] };
/** The plan as tables: hazard analysis (every hazard) and the HACCP plan (CCPs only). */
export function planTables(p: Plan): { hazards: Table; ccps: Table } {
  const a = analysePlan(p);
  return {
    hazards: { head: ['Step', 'Type', 'Hazard', 'Control measure', 'Decision', 'CCP'], rows: a.map((x) => [`${Number.isFinite(x.stepNo) ? x.stepNo + '. ' : ''}${x.h.step}`, HAZARD_TYPES[x.h.type], x.h.hazard, x.h.control, x.d.text, x.ccp ? `CCP ${x.ccp}` : '']) },
    ccps: { head: ['CCP', 'Step', 'Hazard', ...CCP_FIELDS.map((f) => f.name)], rows: a.filter((x) => x.ccp).map((x) => [`CCP ${x.ccp} (${x.h.type})`, x.h.step, x.h.hazard, ...CCP_FIELDS.map((f) => x.h[f.id])]) },
  };
}

/** Rows for a CSV file of the whole plan (product, flow, hazard analysis, CCPs), separated by blank rows. */
export function planCsvRows(p: Plan): string[][] {
  const t = planTables(p);
  return [['Product'], ...PRODUCT_FIELDS.map((f) => [f.name, p.product[f.id]]), [], ['Process flow'], ...p.steps.map((s, i) => [String(i + 1), s]), [],
    ['Hazard analysis'], t.hazards.head, ...t.hazards.rows, [], ['HACCP plan'], t.ccps.head, ...t.ccps.rows];
}

/** A made-up example to show how the template is filled in. Values in square brackets are for the user's own validated figures. */
export function examplePlan(): Plan {
  const p = emptyPlan();
  Object.assign(p.product, {
    name: 'Example: chilled cooked chicken and pasta salad',
    description: 'Cooked chicken pieces, cooked pasta, mayonnaise dressing and chopped vegetables in a sealed tub.',
    use: 'Eaten cold without further cooking by the general public.',
    packaging: 'Plastic tub with a sealed film lid.',
    storage: 'Kept chilled from packing to sale.',
    shelfLife: '[your tested shelf life] days, chilled',
    allergens: 'Egg (mayonnaise), wheat (pasta), mustard',
    team: 'Production manager, quality lead, head cook',
  });
  p.steps = ['Receive raw chicken', 'Chilled storage', 'Cook chicken', 'Cool', 'Mix with pasta and dressing', 'Pack and seal', 'Chilled dispatch'];
  const h = (step: string, type: HazardType, hazard: string, control: string, q: Partial<Record<QKey, Answer>>, ccp: Partial<Record<CcpField, string>> = {}): Hazard => ({ ...emptyHazard(step), type, hazard, control, ...q, ...ccp });
  p.hazards = [
    h('Receive raw chicken', 'B', 'Pathogens present on raw chicken', 'Approved supplier; cooking later', { q1: 'yes', q2: 'no', q3: 'yes', q4: 'yes' }),
    h('Cook chicken', 'B', 'Pathogens survive cooking', 'Cooking to a set core temperature and time', { q1: 'yes', q2: 'yes' }, {
      limit: 'Core temperature at least [your validated temperature] for [your validated time]',
      monitoring: 'Probe the thickest piece of every batch; cook records it on the cooking log',
      corrective: 'Keep cooking until the limit is met; hold and assess any batch that left early',
      verification: 'Probe thermometer checked [how often]; supervisor reviews logs daily',
      records: 'Cooking log, thermometer check log, kept for [your retention period]',
    }),
    h('Cool', 'B', 'Spore-forming bacteria grow during slow cooling', 'Blast chiller with a set time to reach a set temperature', { q1: 'yes', q2: 'yes' }, {
      limit: 'Below [your validated temperature] within [your validated time]',
      monitoring: 'Probe at the end of the cooling time for each batch',
    }),
    h('Mix with pasta and dressing', 'P', 'Pieces of hard plastic from worn utensils', 'Utensil checks at start and end of shift', { q1: 'yes', q2: 'no', q3: 'no' }),
    h('Mix with pasta and dressing', 'C', 'Undeclared allergen from another product', 'Separate equipment and cleaning between products', { q1: 'yes', q2: 'no', q3: 'yes', q4: 'no' }),
  ];
  return p;
}
