// #984 adduct calculator: adduct m/z for glucose against an independent Python calculation from the NIST/AME
// monoisotopic masses and the CODATA electron mass, and the usual published values (glucose [M+Na]+ 203.0526).
import { ADDUCT_LIST, LOSSES, formulaMass, adductMz, neutralFrom, afterLoss, ppmError, matchList } from '../../src/lib/sci/mbadduct.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;
  const M = formulaMass('C6H12O6'), A = (id) => ADDUCT_LIST.find((a) => a.id === id);
  check('glucose monoisotopic mass 180.063388 (Python)', near(M, 180.06338810418, 1e-9));
  const ref = { 'M+H': 181.07066455650093, 'M+Na': 203.05260880627094, 'M+NH4': 198.09721365762093, 'M+2H': 91.03897050441094, '2M+Na': 383.1159969104509, 'M-H': 179.05611165185908, 'M+HCOO': 225.06159095545908, 'M-2H': 89.02441759976907, 'M+Cl': 215.03278936608908, 'M+K': 219.02654601067096, 'M+ACN+H': 222.09721365762093, 'M-H-H2O': 161.04554696782907 };
  for (const [id, v] of Object.entries(ref)) check(`glucose ${id} m/z ${v.toFixed(6)} (Python)`, near(adductMz(M, A(id)), v, 1e-9));
  check('all adducts invert: neutral mass back from m/z', ADDUCT_LIST.every((a) => near(neutralFrom(adductMz(M, a), a), M, 1e-9)));
  check('every adduct and loss formula parses', ADDUCT_LIST.every((a) => Number.isFinite(adductMz(100, a))) && LOSSES.every((l) => formulaMass(l.formula) > 0));
  check('water loss from [M+H]+ 163.060100 (Python)', near(afterLoss(adductMz(M, A('M+H')), 1, formulaMass('H2O')), 163.06009987247091, 1e-9));
  check('loss from a 2+ ion moves m/z by half', near(afterLoss(100, 2, 18), 91, 1e-12));
  check('ppm error', near(ppmError(181.0710, 181.0706645565), 1.8526, 1e-3));
  const cands = ADDUCT_LIST.map((a) => ({ label: a.label, mz: adductMz(M, a), z: a.z }));
  const m = matchList([203.0530, 181.0710, 300], cands, 5);
  check('matching: 203.0530 → [M+Na]+ at +1.9 ppm, 181.0710 → [M+H]+, 300 → nothing', m[0].hits[0].label === '[M+Na]+' && near(m[0].hits[0].ppm, 1.92656, 1e-4) && m[1].hits[0].label === '[M+H]+' && m[2].hits.length === 0);
  check('matching: absolute mDa floor catches small ions', matchList([91.0395], cands, 1, 1).every((r) => r.hits[0].label === '[M+2H]2+'));
  // Blog article cornus-iridoid-dimer-hresims-negative-ion-adducts: the six new iridoid dimers of
  // Shi et al. (2025), Front. Chem. 13: 1558075 (CC BY 4.0), each reported as [M-H]- in negative mode.
  const neg = A('M-H'), mzOf = (f) => adductMz(formulaMass(f), neg);
  check('iridoid dimers: [M-H]- masses for the paper\'s three formulas', near(mzOf('C34H48O20'), 775.26662, 5e-6) && near(mzOf('C40H54O23'), 901.29831, 5e-6) && near(mzOf('C33H46O19'), 745.25605, 5e-6));
  const obsSix = [['C34H48O20', 775.2666, -0.02], ['C40H54O23', 901.29828, -0.03], ['C40H54O23', 901.29816, -0.17], ['C33H46O19', 745.25659, 0.72], ['C33H46O19', 745.25513, -1.24], ['C33H46O19', 745.25549, -0.76]];
  check('iridoid dimers: all six observed ions inside 1.3 ppm of the formula', obsSix.every(([f, o, p]) => near(ppmError(o, mzOf(f)), p, 0.005)));
  check('iridoid dimers: neutral mass read back from m/z 745.25659', near(neutralFrom(745.25659, neg), 746.26387, 5e-6));
  check('iridoid dimers: only one CHNO formula within 5 ppm of m/z 745.25659', (() => {
    let n = 0, win = '';
    for (let c = 20; c <= 48; c++) for (let nn = 0; nn <= 3; nn++) for (let o = 6; o <= 32; o++) for (let h = 16; h <= 84; h++) {
      const rd = c - h / 2 + nn / 2 + 1; if (!Number.isInteger(rd) || rd < 0 || rd > 20) continue;
      const f = `C${c}H${h}${nn ? 'N' + nn : ''}O${o}`;
      if (Math.abs(ppmError(745.25659, mzOf(f))) <= 5) { n++; win = f; }
    }
    return n === 1 && win === 'C33H46O19';
  })());
};
