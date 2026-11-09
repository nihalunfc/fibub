// #501 lab unit converter: factors checked against molar masses computed independently in Python (IUPAC weights).
import { ANALYTES, byId, molar, factor, convert, convertList, ifccFromNgsp, ngspFromIfcc, fmt } from '../../src/lib/sci/labunits.ts';
export default async (check) => {
  const near = (a, b, r = 1e-4) => Math.abs(a - b) <= r * Math.abs(b);
  const ref = { glucose: [180.156, 0.0555074491], chol: [386.664, 0.0258622473], hdl: [386.664, 0.0258622473], ldl: [386.664, 0.0258622473], tg: [885.453, 0.0112936542], creat: [113.12, 88.4016973], urea: [60.056, 0.1665112562], bun: [28.014, 0.356964375], urate: [168.112, 59.4841534], ca: [40.078, 0.2495134488], mg: [24.305, 0.4114379757], phos: [30.9738, 0.3228539045], bili: [584.673, 17.1035776] };
  for (const [id, [M, f]] of Object.entries(ref)) {
    const a = byId(id);
    check(`lab units: ${id} molar mass ${M}`, near(molar(a), M, 2e-5));
    check(`lab units: ${id} factor mg/dL → ${a.units[1]} = ${f}`, near(factor(a, 'mg/dL', a.units[1]), f, 2e-5));
    check(`lab units: ${id} round trip`, near(convert(a, convert(a, 123.4, 'mg/dL', a.units[1]), a.units[1], 'mg/dL'), 123.4, 1e-12));
  }
  check('lab units: every analyte listed has a factor or the HbA1c equation', ANALYTES.length === 14);
  check('lab units: glucose 100 mg/dL = 5.551 mmol/L', fmt(convert(byId('glucose'), 100, 'mg/dL', 'mmol/L'), null) === '5.551');
  check('lab units: cholesterol 200 mg/dL = 5.172 mmol/L', fmt(convert(byId('chol'), 200, 'mg/dL', 'mmol/L'), null) === '5.172');
  check('lab units: triglycerides 150 mg/dL = 1.694 mmol/L', near(convert(byId('tg'), 150, 'mg/dL', 'mmol/L'), 1.69404813));
  check('lab units: uric acid 6 mg/dL = 356.9 µmol/L', near(convert(byId('urate'), 6, 'mg/dL', 'µmol/L'), 356.904921));
  check('lab units: BUN 14 mg/dL = 4.998 mmol/L urea', near(convert(byId('bun'), 14, 'mg/dL', 'mmol/L'), 4.99750125));
  check('lab units: calcium 10 mg/dL = 4.990 mEq/L', near(convert(byId('ca'), 10, 'mg/dL', 'mEq/L'), 4.99026898));
  check('lab units: glucose g/L ↔ mg/dL', near(convert(byId('glucose'), 1, 'g/L', 'mg/dL'), 100, 1e-12));
  check('lab units: creatinine µmol/L ↔ mmol/L', near(convert(byId('creat'), 88.4, 'µmol/L', 'mmol/L'), 0.0884, 1e-12));
  // HbA1c: IFCC-NGSP master equation, Python: 5 → 31.13, 6.5 → 47.53, 7 → 52.995, 8 → 63.93, 10 → 85.79.
  for (const [p, i] of [[5, 31.13248798], [6.5, 47.52951465], [7, 52.99519021], [8, 63.92654132], [10, 85.78924355]]) check(`lab units: HbA1c ${p} % = ${i} mmol/mol`, near(ifccFromNgsp(p), i, 1e-8) && near(convert(byId('hba1c'), p, '%', 'mmol/mol'), i, 1e-8));
  for (const [i, p] of [[31, 4.98788], [48, 6.54304], [86, 10.01928]]) check(`lab units: HbA1c ${i} mmol/mol = ${p} %`, near(ngspFromIfcc(i), p, 1e-9));
  const rows = convertList('90\n126 mg/dL\n<20\n5,5\nabc\n-3\n\n180\t fasting', byId('glucose'), 'mg/dL', 'mmol/L');
  check('lab units: list keeps every non-blank line', rows.length === 7);
  check('lab units: list reads units, < signs and decimal commas', rows[1].value === 126 && rows[2].prefix === '<' && rows[2].value === 20 && rows[3].value === 5.5 && rows[6].value === 180);
  check('lab units: list flags text and negatives', rows[4].error === 'not a number' && rows[5].error === 'below zero');
  check('lab units: fmt decimals', fmt(5.5507, 1) === '5.6' && fmt(88.4017, null) === '88.40' && fmt(0.012345, null) === '0.01235');
};
