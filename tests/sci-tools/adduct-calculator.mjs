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
};
