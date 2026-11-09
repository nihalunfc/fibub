// Stock solution and media recipe scaler: a recipe of components (each a final concentration or an amount per litre),
// scaled to any final volume and to an N-times concentrated stock. Solids are weighed (mass from g/L, or from molarity
// and molar mass), neat liquids are measured by volume (% v/v), and components that come from a stock are diluted
// with C1V1 = C2V2. Units are converted through four bases: g/L, mol/L, L/L and fold (X). No DOM.
import { parseFormula, molarMass } from './chem.ts';
import { num, parseTable } from './num.ts';

export type Kind = 'mass' | 'molar' | 'vol' | 'fold';
export type UnitId = 'g/L' | 'mg/L' | 'µg/L' | 'mg/mL' | 'µg/mL' | '% w/v' | 'M' | 'mM' | 'µM' | '% v/v' | 'mL/L' | 'µL/mL' | 'X';
/** Each unit and its factor to the base of its kind (g/L, mol/L, L per L, or X). */
export const UNITS: { id: UnitId; kind: Kind; f: number; help: string }[] = [
  { id: 'g/L', kind: 'mass', f: 1, help: 'grams per litre' },
  { id: 'mg/L', kind: 'mass', f: 1e-3, help: 'milligrams per litre' },
  { id: 'µg/L', kind: 'mass', f: 1e-6, help: 'micrograms per litre' },
  { id: 'mg/mL', kind: 'mass', f: 1, help: 'milligrams per millilitre (same as g/L)' },
  { id: 'µg/mL', kind: 'mass', f: 1e-3, help: 'micrograms per millilitre (same as mg/L)' },
  { id: '% w/v', kind: 'mass', f: 10, help: 'grams per 100 mL' },
  { id: 'M', kind: 'molar', f: 1, help: 'moles per litre' },
  { id: 'mM', kind: 'molar', f: 1e-3, help: 'millimoles per litre' },
  { id: 'µM', kind: 'molar', f: 1e-6, help: 'micromoles per litre' },
  { id: '% v/v', kind: 'vol', f: 1e-2, help: 'mL of liquid per 100 mL' },
  { id: 'mL/L', kind: 'vol', f: 1e-3, help: 'mL of liquid per litre' },
  { id: 'µL/mL', kind: 'vol', f: 1e-3, help: 'µL of liquid per mL (same as mL/L)' },
  { id: 'X', kind: 'fold', f: 1, help: 'times strength, as in a 10X buffer' },
];
const BY_ID = new Map(UNITS.map((u) => [u.id, u]));
export const unit = (id: UnitId) => BY_ID.get(id)!;

/** A unit as people type it in a file: "ug/ml", "μM", "w/v", "%v/v", "1x". Undefined if unknown. */
export function normUnit(s: string): UnitId | undefined {
  const t = s.trim().replace(/[μu]/g, 'µ').replace(/\s+/g, '');
  const exact = UNITS.find((u) => u.id.replace(/\s+/g, '') === t);
  if (exact) return exact.id;
  const l = t.toLowerCase();
  const map: Record<string, UnitId> = { 'g/l': 'g/L', 'mg/l': 'mg/L', 'µg/l': 'µg/L', 'mg/ml': 'mg/mL', 'µg/ml': 'µg/mL', '%w/v': '% w/v', 'w/v': '% w/v', 'w/v%': '% w/v', 'mol/l': 'M', 'mmol/l': 'mM', 'µmol/l': 'µM', '%v/v': '% v/v', 'v/v': '% v/v', 'v/v%': '% v/v', 'ml/l': 'mL/L', 'µl/ml': 'µL/mL', 'm': 'M', 'mm': 'mM', 'µm': 'µM', 'x': 'X', '×': 'X' };
  return map[l];
}

/** A concentration in the base of `to` (g/L, mol/L, L/L or X). Mass and molar convert through the molar mass. */
export function convert(value: number, from: UnitId, to: Kind, mw?: number): { v: number } | { error: string } {
  const u = unit(from), base = value * u.f;
  if (u.kind === to) return { v: base };
  if ((u.kind === 'mass' && to === 'molar') || (u.kind === 'molar' && to === 'mass')) {
    if (!(mw && mw > 0)) return { error: `To go between ${u.kind === 'mass' ? 'a mass and a molar' : 'a molar and a mass'} concentration, type the molar mass (or formula).` };
    return { v: u.kind === 'mass' ? base / mw : base * mw };
  }
  const name = { mass: 'a mass per volume', molar: 'a molarity', vol: 'a volume per volume', fold: 'an X strength' };
  return { error: `${name[u.kind][0].toUpperCase() + name[u.kind].slice(1)} (${from}) cannot be turned into ${name[to]} here.` };
}

/** A molar mass typed as a number ("58.44") or a formula ("NaCl", "MgCl2·6H2O"). Empty gives undefined. */
export function parseMolarMass(text: string): { mw?: number; formula?: boolean; error?: string } {
  const t = text.trim();
  if (!t) return {};
  const n = num(t);
  if (Number.isFinite(n)) return n > 0 ? { mw: n } : { error: 'A molar mass must be above 0.' };
  try { const m = molarMass(parseFormula(t)); return m > 0 ? { mw: m, formula: true } : { error: `"${t}" has no mass.` }; } catch (e) { return { error: `Molar mass: ${(e as Error).message}` }; }
}

export type Source = 'weigh' | 'neat' | 'stock';
export type Row = { name: string; amount: number; unit: UnitId; source: Source; stock?: number; stockUnit?: UnitId; mw?: number };
export type Line = {
  row: Row;
  /** Concentration wanted in the made-up solution, in the base of the row's unit kind (already times N). */
  target: number; kind: Kind;
  grams?: number; litres?: number; mol?: number;
  /** For stocks: how many times stronger the stock is than the target. */
  fold?: number;
  error?: string; warn: string[];
};

/** One component, for V litres of an N-times concentrated solution. */
export function solveRow(row: Row, V: number, N = 1): Line {
  const u = unit(row.unit), target = row.amount * u.f * N;
  const line: Line = { row, target, kind: u.kind, warn: [] };
  const fail = (m: string) => ({ ...line, error: m });
  if (!(row.amount > 0)) return fail('Type an amount above 0.');
  if (row.source === 'weigh') {
    if (u.kind === 'mass') { line.grams = target * V; if (row.mw && row.mw > 0) line.mol = line.grams / row.mw; return line; }
    if (u.kind === 'molar') {
      if (!(row.mw && row.mw > 0)) return fail('Type the molar mass (or formula) to weigh a molarity.');
      line.mol = target * V; line.grams = line.mol * row.mw; return line;
    }
    return fail(u.kind === 'vol' ? 'To weigh it, give the amount as a mass per litre or a molarity; for a liquid measured by volume choose "Neat" under Added as.' : 'An X strength only works with a stock: choose "Stock" under Added as.');
  }
  if (row.source === 'neat') {
    if (u.kind !== 'vol') return fail('A neat liquid is measured by volume: give the amount in % v/v, mL/L or µL/mL, or weigh it instead.');
    if (target > 1 + 1e-12) return fail(`At ${N}× this is ${sig4(target * 100)} % v/v, more than the pure liquid: lower the strength.`);
    line.litres = target * V; line.fold = 1 / target;
    if (target > 1 - 1e-12) line.warn.push('This is the pure liquid with nothing else: lower the strength.');
    return line;
  }
  if (!(row.stock && row.stock > 0) || !row.stockUnit) return fail('Type the stock concentration.');
  const s = convert(row.stock, row.stockUnit, u.kind, row.mw);
  if ('error' in s) return fail(s.error);
  if (u.kind === 'vol' && s.v > 1 + 1e-12) return fail('A stock cannot be stronger than 100 % v/v.');
  line.fold = s.v / target; line.litres = (target * V) / s.v;
  if (u.kind === 'molar') line.mol = target * V;
  if (u.kind === 'mass') { line.grams = target * V; if (row.mw && row.mw > 0) line.mol = line.grams / row.mw; }
  if (line.fold < 1 - 1e-9) return fail(`The stock (${row.stock} ${row.stockUnit}) is too dilute to reach ${sig4(row.amount * N)} ${row.unit}${N !== 1 ? ` (the ${N}× strength)` : ''}: it would need ${fmtVol(line.litres)}, more than the ${fmtVol(V)} you are making. Use a stronger stock or weigh it.`);
  if (line.fold < 1 + 1e-9) line.warn.push('The stock is exactly the strength you want: the whole volume is stock, with no room for anything else.');
  if (line.litres < 0.5e-6) line.warn.push(`Only ${fmtVol(line.litres)}: too little to pipette well. Dilute the stock first or make a bigger volume.`);
  return line;
}

export type Scaled = { lines: Line[]; liquid: number; water: number; grams: number; ok: boolean; warn: string[] };

/** The whole recipe for V litres at N times strength. */
export function scaleRecipe(rows: Row[], V: number, N = 1): Scaled {
  const lines = rows.map((r) => solveRow(r, V, N));
  const good = lines.filter((l) => !l.error);
  const liquid = good.reduce((s, l) => s + (l.litres ?? 0), 0);
  const grams = good.filter((l) => l.row.source === 'weigh').reduce((s, l) => s + (l.grams ?? 0), 0);
  const warn: string[] = [];
  if (liquid > V * (1 + 1e-9)) warn.push(`The liquids add up to ${fmtVol(liquid)}, more than the ${fmtVol(V)} you are making. Use stronger stocks${N > 1 ? ' or a lower strength' : ''}.`);
  else if (liquid > 0.9 * V && good.some((l) => l.row.source === 'weigh')) warn.push(`The liquids already take ${Math.round((100 * liquid) / V)} % of the volume, which leaves little room to dissolve the solids.`);
  if (grams / V > 300) warn.push(`That is ${sig4(grams / V)} g of solids per litre: check that everything will dissolve at this strength.`);
  return { lines, liquid, water: V - liquid, grams, ok: lines.every((l) => !l.error) && liquid <= V * (1 + 1e-9), warn };
}

/** Four significant figures without trailing zeros: 2.5, 1.211, 12350. */
export const sig4 = (x: number) => String(Number(x.toPrecision(4)));
/** A mass as text with a sensible unit: "2.423 g", "500 mg", "25 µg". */
export function fmtMass(g: number): string {
  const a = Math.abs(g);
  if (a >= 1000) return `${sig4(g / 1000)} kg`;
  if (a >= 1 || a === 0) return `${sig4(g)} g`;
  if (a >= 1e-3) return `${sig4(g * 1e3)} mg`;
  return `${sig4(g * 1e6)} µg`;
}
/** A volume (litres in) as text: "1.5 L", "30 mL", "250 µL". */
export function fmtVol(L: number): string {
  const a = Math.abs(L);
  if (a >= 1 || a === 0) return `${sig4(L)} L`;
  if (a >= 1e-3) return `${sig4(L * 1e3)} mL`;
  return `${sig4(L * 1e6)} µL`;
}
/** Litres from a volume and its unit. */
export const litres = (v: number, u: 'L' | 'mL' | 'µL') => v * (u === 'L' ? 1 : u === 'mL' ? 1e-3 : 1e-6);

export const CSV_HEAD = ['component', 'amount', 'unit', 'source', 'stock', 'stock_unit', 'molar_mass'];

/** A recipe read back from a CSV or pasted table (headers as in CSV_HEAD, or the first seven columns in that order). */
export function parseRecipe(text: string): { rows: { name: string; amount: string; unit: UnitId; source: Source; stock: string; stockUnit: UnitId; mw: string }[]; errors: string[] } {
  const t = parseTable(text);
  const errors: string[] = [];
  if (!t.length) return { rows: [], errors: ['The file has no rows.'] };
  const h = t[0].map((c) => c.toLowerCase().replace(/[^a-z]/g, ''));
  const head = h.includes('component') || h.includes('amount');
  const col = (name: string, i: number) => (head ? h.indexOf(name.replace(/[^a-z]/g, '')) : i);
  const ix = CSV_HEAD.map(col);
  const rows = [];
  for (const [n, r] of (head ? t.slice(1) : t).entries()) {
    const get = (k: number) => (ix[k] >= 0 ? (r[ix[k]] ?? '').trim() : '');
    const line = n + (head ? 2 : 1);
    const name = get(0); if (!name && !get(1)) continue;
    const u = normUnit(get(2));
    if (!u) { errors.push(`Row ${line}: unknown unit "${get(2)}".`); continue; }
    const src = get(3).toLowerCase();
    let source: Source = get(4) ? 'stock' : 'weigh';
    if (/^(stock|from)/.test(src)) source = 'stock';
    else if (/^(neat|liquid)/.test(src)) source = 'neat';
    else if (/^(weigh|solid)/.test(src)) source = 'weigh';
    else if (src) errors.push(`Row ${line}: source "${get(3)}" not known (weigh, neat or stock); read as ${source}.`);
    const su = normUnit(get(5)) ?? u;
    rows.push({ name: name || `Component ${line}`, amount: get(1), unit: u, source, stock: get(4), stockUnit: su, mw: get(6) });
  }
  if (!rows.length && !errors.length) errors.push('No components found.');
  return { rows, errors };
}

/** CSV text with quotes where needed. */
export const toCsv = (rows: string[][]) => rows.map((r) => r.map((c) => (/[",\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(',')).join('\n') + '\n';

/** The two examples on the page. Both are made up with plain round amounts; they are not anyone's published recipe. */
export const EXAMPLES: { id: string; name: string; volume: number; volUnit: 'L' | 'mL' | 'µL'; rows: { name: string; amount: string; unit: UnitId; source: Source; stock: string; stockUnit: UnitId; mw: string }[] }[] = [
  { id: 'buffer', name: 'Example wash buffer', volume: 500, volUnit: 'mL', rows: [
    { name: 'Tris base', amount: '20', unit: 'mM', source: 'weigh', stock: '', stockUnit: 'mM', mw: 'C4H11NO3' },
    { name: 'Sodium chloride', amount: '150', unit: 'mM', source: 'stock', stock: '5', stockUnit: 'M', mw: 'NaCl' },
    { name: 'Magnesium chloride hexahydrate', amount: '2', unit: 'mM', source: 'weigh', stock: '', stockUnit: 'mM', mw: 'MgCl2·6H2O' },
    { name: 'EDTA', amount: '1', unit: 'mM', source: 'stock', stock: '0.5', stockUnit: 'M', mw: '' },
    { name: 'Glycerol', amount: '10', unit: '% v/v', source: 'neat', stock: '', stockUnit: '% v/v', mw: '' },
    { name: 'Tween 20', amount: '0.05', unit: '% v/v', source: 'stock', stock: '10', stockUnit: '% v/v', mw: '' },
  ] },
  { id: 'broth', name: 'Simple bacterial broth', volume: 1, volUnit: 'L', rows: [
    { name: 'Tryptone', amount: '10', unit: 'g/L', source: 'weigh', stock: '', stockUnit: 'g/L', mw: '' },
    { name: 'Yeast extract', amount: '5', unit: 'g/L', source: 'weigh', stock: '', stockUnit: 'g/L', mw: '' },
    { name: 'Sodium chloride', amount: '10', unit: 'g/L', source: 'weigh', stock: '', stockUnit: 'g/L', mw: 'NaCl' },
    { name: 'Glucose', amount: '0.2', unit: '% w/v', source: 'stock', stock: '20', stockUnit: '% w/v', mw: 'C6H12O6' },
    { name: 'Ampicillin (after cooling)', amount: '100', unit: 'µg/mL', source: 'stock', stock: '100', stockUnit: 'mg/mL', mw: '' },
  ] },
];

/** An example's rows as numbers, ready for scaleRecipe. */
export const exampleRows = (id: string): Row[] => EXAMPLES.find((e) => e.id === id)!.rows.map((r) => ({ name: r.name, amount: num(r.amount), unit: r.unit, source: r.source, stock: num(r.stock), stockUnit: r.stockUnit, mw: parseMolarMass(r.mw).mw }));
