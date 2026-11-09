// #344 osmolarity: molar masses, osmolarity, effective osmolarity and van 't Hoff pressure checked against a
// Python rewrite using IUPAC atomic weights typed in separately.
import * as O from '../../src/lib/sci/osmolar.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-4) => Math.abs(a / b - 1) <= tol;
  check('osmolarity: molar masses from formulas', near(O.formulaMass('NaCl'), 58.43977) && near(O.formulaMass('CaCl2·2H2O'), 147.008) && near(O.formulaMass('C6H12O6'), 180.156) && near(O.formulaMass('CH4N2O'), 60.056) && near(O.formulaMass('Na2HPO4'), 141.9573) && near(O.formulaMass('MgSO4'), 120.361));
  check('osmolarity: every listed solute has a formula that parses', O.SOLUTES.every((s) => O.formulaMass(s.formula) > 0));
  const nacl = O.toMmolL(0.9, 'pct', O.formulaMass('NaCl'));
  check('osmolarity: 0.9 % NaCl is 154 mmol/L', near(nacl, 154.0047148));
  const r = O.osmolarity([{ name: 'NaCl', mmolL: nacl, i: 2, phi: 0.93, penetrating: false }, { name: 'urea', mmolL: 100, i: 1, phi: 1, penetrating: true }]);
  check('osmolarity: total and effective (tonicity) osmolarity', near(r.total, 386.4487695) && near(r.effective, 286.4487695));
  check("osmolarity: van 't Hoff pressure at 37 °C", near(O.osmoticKPa(r.total, 37), 996.5472599) && near(O.osmoticKPa(r.total, 37) / O.KPA_ATM, 9.835156772) && near(O.osmoticKPa(r.total, 37) / O.KPA_MMHG, 7474.718082));
  check('osmolarity: 5 % glucose and 90 mg/dL glucose', near(O.toMmolL(5, 'pct', 180.156), 277.5372455) && near(O.toMmolL(90, 'mgdL', 180.156), 4.995670419) && O.toMmolL(0.3, 'M') === 300 && near(O.toMmolL(9, 'gL', 58.43977), 154.0047148));
  check('osmolarity: comparison with tolerance', O.compare(270, 290, 10) === 'hypo' && O.compare(295, 290, 10) === 'iso' && O.compare(386, 290, 10) === 'hyper');
};
