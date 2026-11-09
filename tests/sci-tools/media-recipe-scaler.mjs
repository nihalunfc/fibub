// #183 stock solution and media recipe scaler. Hand-worked C1V1 = C2V2 and mass = M × V × molar mass examples; the
// examples at several volumes and strengths were also checked against an independent Python script (pyteomics average
// masses, 48 numbers within 1e-4).
import { solveRow, scaleRecipe, exampleRows, convert, parseMolarMass, normUnit, fmtMass, fmtVol, parseRecipe, toCsv, CSV_HEAD, EXAMPLES } from '../../src/lib/sci/recipe.ts';

export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  // Weigh: 20 mM Tris (121.14 g/mol) in 500 mL = 0.01 mol = 1.2114 g.
  const tris = solveRow({ name: 'Tris', amount: 20, unit: 'mM', source: 'weigh', mw: 121.14 }, 0.5);
  check('recipe: 20 mM × 0.5 L × 121.14 g/mol = 1.2114 g', near(tris.grams, 1.2114) && near(tris.mol, 0.01));
  check('recipe: Tris formula molar mass 121.14', Math.abs(parseMolarMass('C4H11NO3').mw - 121.135) < 0.01 && parseMolarMass('C4H11NO3').formula === true);
  check('recipe: hydrate formula MgCl2·6H2O 203.30', Math.abs(parseMolarMass('MgCl2·6H2O').mw - 203.30) < 0.01);
  check('recipe: typed molar mass, bad formula, empty', parseMolarMass('58,44').mw === 58.44 && /Molar mass/.test(parseMolarMass('Xq2').error) && parseMolarMass('').mw === undefined && !!parseMolarMass('-3').error);
  // C1V1 = C2V2: 150 mM from 5 M in 500 mL: V1 = 0.15 × 0.5 / 5 = 15 mL.
  const nacl = solveRow({ name: 'NaCl', amount: 150, unit: 'mM', source: 'stock', stock: 5, stockUnit: 'M' }, 0.5);
  check('recipe: 150 mM from 5 M stock, 500 mL → 15 mL (1 in 33.3)', near(nacl.litres, 0.015) && near(nacl.fold, 5 / 0.15));
  // Same stock in g/L: 5 M NaCl = 292.2 g/L at 58.44 g/mol; needs the molar mass.
  const naclG = solveRow({ name: 'NaCl', amount: 150, unit: 'mM', source: 'stock', stock: 292.2, stockUnit: 'g/L', mw: 58.44 }, 0.5);
  check('recipe: stock in g/L reaches mM through the molar mass', near(naclG.litres, 0.015));
  check('recipe: g/L stock for a mM target without molar mass is an error', /molar mass/.test(solveRow({ name: 'x', amount: 150, unit: 'mM', source: 'stock', stock: 292.2, stockUnit: 'g/L' }, 0.5).error));
  // Ampicillin 100 µg/mL from a 100 mg/mL stock: 1000×, 1 mL per litre.
  const amp = solveRow({ name: 'amp', amount: 100, unit: 'µg/mL', source: 'stock', stock: 100, stockUnit: 'mg/mL' }, 1);
  check('recipe: 100 µg/mL from 100 mg/mL → 1 mL per L, 1000×', near(amp.litres, 0.001) && near(amp.fold, 1000) && near(amp.grams, 0.1));
  // % w/v: 0.2 % from 20 % → 10 mL per L; 1 % w/v = 10 g/L.
  check('recipe: 0.2 % w/v from 20 % w/v → 10 mL per L', near(solveRow({ name: 'g', amount: 0.2, unit: '% w/v', source: 'stock', stock: 20, stockUnit: '% w/v' }, 1).litres, 0.01));
  check('recipe: 1 % w/v weighs 10 g per L; 1 % w/v = 10 mg/mL', near(solveRow({ name: 'g', amount: 1, unit: '% w/v', source: 'weigh' }, 1).grams, 10) && near(convert(10, 'mg/mL', 'mass').v, 10));
  check('recipe: mM to mg/mL through molar mass', near(convert(1, 'M', 'mass', 58.44).v, 58.44) && near(convert(5.844, 'g/L', 'molar', 58.44).v, 0.1) && 'error' in convert(1, '% v/v', 'mass'));
  check('recipe: 1X from a 10X stock, 500 mL → 50 mL', near(solveRow({ name: 'b', amount: 1, unit: 'X', source: 'stock', stock: 10, stockUnit: 'X' }, 0.5).litres, 0.05));
  check('recipe: 10 % v/v neat glycerol, 500 mL → 50 mL', near(solveRow({ name: 'gly', amount: 10, unit: '% v/v', source: 'neat' }, 0.5).litres, 0.05));
  check('recipe: neat liquid needs a v/v unit; weigh needs mass or molar; X needs a stock', /neat liquid/.test(solveRow({ name: 'a', amount: 1, unit: 'mM', source: 'neat' }, 1).error) && /mass per litre/.test(solveRow({ name: 'a', amount: 1, unit: '% v/v', source: 'weigh' }, 1).error) && /stock/.test(solveRow({ name: 'a', amount: 1, unit: 'X', source: 'weigh' }, 1).error) && /molar mass/.test(solveRow({ name: 'a', amount: 1, unit: 'mM', source: 'weigh' }, 1).error));
  // Too dilute: 150 mM wanted from a 0.1 M stock.
  const weak = solveRow({ name: 'NaCl', amount: 150, unit: 'mM', source: 'stock', stock: 0.1, stockUnit: 'M' }, 0.5);
  check('recipe: a stock weaker than the target is flagged', /too dilute/.test(weak.error) && weak.error.includes('750 mL'));
  check('recipe: a stock just strong enough at 10× warns, at 11× fails', solveRow({ name: 'x', amount: 1, unit: 'mM', source: 'stock', stock: 10, stockUnit: 'mM' }, 1, 10).warn.length === 1 && /too dilute/.test(solveRow({ name: 'x', amount: 1, unit: 'mM', source: 'stock', stock: 10, stockUnit: 'mM' }, 1, 11).error));
  check('recipe: tiny volume warning (1 µM from 1 M in 100 µL = 0.1 µL)', /too little to pipette/.test(solveRow({ name: 'x', amount: 1, unit: 'µM', source: 'stock', stock: 1, stockUnit: 'M' }, 1e-4).warn[0] ?? ''));
  check('recipe: missing amount or stock', /amount/.test(solveRow({ name: 'x', amount: NaN, unit: 'mM', source: 'weigh', mw: 1 }, 1).error) && /stock concentration/.test(solveRow({ name: 'x', amount: 1, unit: 'mM', source: 'stock' }, 1).error));
  // The example buffer at 500 mL, then as a 5× stock: liquids 68.5 mL, then 342.5 mL.
  const b1 = scaleRecipe(exampleRows('buffer'), 0.5, 1), b5 = scaleRecipe(exampleRows('buffer'), 0.5, 5);
  check('recipe: example buffer 500 mL: Tris 1.211 g, MgCl2·6H2O 0.2033 g, liquids 68.5 mL', b1.ok && fmtMass(b1.lines[0].grams) === '1.211 g' && fmtMass(b1.lines[2].grams) === '203.3 mg' && near(b1.liquid, 0.0685) && near(b1.water, 0.4315));
  check('recipe: 5× buffer: NaCl 75 mL, glycerol 250 mL, Tween 12.5 mL, liquids 342.5 mL', b5.ok && near(b5.lines[1].litres, 0.075) && near(b5.lines[4].litres, 0.25) && near(b5.lines[5].litres, 0.0125) && near(b5.liquid, 0.3425));
  const b20 = scaleRecipe(exampleRows('buffer'), 0.25, 20);
  check('recipe: 20× buffer: glycerol over 100 % is an error', !b20.ok && /200 % v\/v/.test(b20.lines[4].error));
  const br = scaleRecipe(exampleRows('broth'), 1, 1);
  check('recipe: broth 1 L: 10 + 5 + 10 g, glucose 10 mL, ampicillin 1 mL', br.ok && near(br.grams, 25) && near(br.lines[3].litres, 0.01) && near(br.lines[4].litres, 0.001) && near(br.lines[2].mol, 10 / 58.44, 1e-4));
  const over = scaleRecipe([{ name: 'a', amount: 600, unit: 'mM', source: 'stock', stock: 1, stockUnit: 'M' }, { name: 'b', amount: 500, unit: 'mM', source: 'stock', stock: 1, stockUnit: 'M' }], 1, 1);
  check('recipe: liquids over the final volume warn', !over.ok && /more than the 1 L/.test(over.warn[0]));
  check('recipe: format masses and volumes', fmtMass(2.5) === '2.5 g' && fmtMass(0.0005) === '500 µg' && fmtMass(0.025) === '25 mg' && fmtVol(0.015) === '15 mL' && fmtVol(2.5e-7) === '0.25 µL' && fmtVol(1.5) === '1.5 L');
  check('recipe: units as people type them', normUnit('ug/ml') === 'µg/mL' && normUnit('μM') === 'µM' && normUnit('mm') === 'mM' && normUnit('M') === 'M' && normUnit('%w/v') === '% w/v' && normUnit('v/v') === '% v/v' && normUnit('10') === undefined && normUnit('x') === 'X');
  // CSV round trip of the broth example.
  const ex = EXAMPLES[1];
  const csv = toCsv([CSV_HEAD, ...ex.rows.map((r) => [r.name, r.amount, r.unit, r.source, r.stock, r.stockUnit, r.mw])]);
  const back = parseRecipe(csv);
  check('recipe: CSV round trip', back.errors.length === 0 && back.rows.length === 5 && back.rows[4].unit === 'µg/mL' && back.rows[4].stockUnit === 'mg/mL' && back.rows[3].source === 'stock' && back.rows[2].mw === 'NaCl');
  const loose = parseRecipe('Salt\t150\tmM\tstock\t5\tM\nSugar\t1\tfoo\tweigh');
  check('recipe: headerless paste and unknown unit', loose.rows.length === 1 && loose.rows[0].source === 'stock' && loose.errors[0].includes('foo'));
};
