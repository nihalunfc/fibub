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
  // Sayyari et al. (2024), Sci Rep 14: 14736: the two fish sperm solutions, and 16 % (vol) methanol in a freezing mix.
  {
    const rows = (comp, phiOf, scale = 1) => comp.map(([id, mM]) => ({ name: id, mmolL: mM * scale, i: O.solute(id).i, phi: phiOf(id), penetrating: !!O.solute(id).penetrating }));
    const hbss = [['NaCl', 137], ['KCl', 5.4], ['CaCl2', 1.3], ['MgSO4', 1.0], ['Na2HPO4', 0.25], ['KH2PO4', 0.44], ['NaHCO3', 4.2], ['glucose', 5.55]];
    const kur = [['NaCl', 180], ['KCl', 2.68], ['CaCl2', 1.36], ['NaHCO3', 2.38]];
    const salt = (id) => (id === 'glucose' ? 1 : 0.93);
    check('osmolarity: medaka HBSS recipe is 306.3 mOsm/L ideal, 285.2 at phi 0.93', near(O.osmolarity(rows(hbss, () => 1)).total, 306.28) && near(O.osmolarity(rows(hbss, salt)).total, 285.2289));
    check('osmolarity: the Kurokura recipe labelled 300 is 374.2 mOsm/L ideal, 348.0 at phi 0.93', near(O.osmolarity(rows(kur, () => 1)).total, 374.22, 1e-4) && near(O.osmolarity(rows(kur, salt)).total, 348.0246, 1e-4));
    const meth = (16 * 10 * 0.7918 * 1000) / O.formulaMass('CH4O');
    const mix = O.osmolarity([...rows(hbss, salt, 0.84), { name: 'Sucrose', mmolL: 126 * 0.84, i: 1, phi: 1, penetrating: false }, { name: 'Methanol', mmolL: meth, i: 1, phi: 1, penetrating: true }]);
    check('osmolarity: 16 % (vol) methanol is 3954 mmol/L and lifts the total to ~4299 while tonicity stays ~345', near(meth, 3953.8106) && near(mix.total, 4299.2429) && near(mix.effective, 345.4323));
  }
  check('osmolarity: comparison with tolerance', O.compare(270, 290, 10) === 'hypo' && O.compare(295, 290, 10) === 'iso' && O.compare(386, 290, 10) === 'hyper');
};
