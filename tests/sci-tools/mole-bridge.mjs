// #1085 Mole bridge. Molar volumes against the CODATA/NIST values (22.413 969 54 L at 101.325 kPa, 22.710 954 64 L
// at 100 kPa); conversions against hand sums; empirical formulas against standard worked examples (glucose CH2O/C6H12O6,
// Fe2O3, P2O5, CH2, Al2O3); limiting reactant against hand-worked cases.
import * as M from '../../src/lib/sci/molebridge.ts';
const close = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
export default async (check) => {
  check('mole: molar volumes equal CODATA (NIST) values', close(M.VM.atm, 22.41396954, 1e-9) && close(M.VM.bar, 22.71095464, 1e-9));
  { const a = M.bridge('g', 36, 18, 22.4); check('mole: 36 g of water is 2 mol, 1.2044e24 molecules, 44.8 L', close(a.mol, 2) && close(a.N, 1.204428152e24) && close(a.L, 44.8)); }
  { const a = M.bridge('L', 11.35, 44, 22.7); check('mole: 11.35 L of CO2 at 1 bar is 0.5 mol, 22 g', close(a.mol, 0.5) && close(a.g, 22)); }
  { const a = M.bridge('N', 3.011e23, 32, 22.4); check('mole: 3.011e23 particles is 0.5 mol', close(a.mol, 0.5, 1e-4)); }
  check('mole: school molar masses H2O 18, NaCl 58.5, C6H12O6 180; IUPAC H2O 18.015', M.molar('H2O', true).M === 18 && M.molar('NaCl', true).M === 58.5 && M.molar('C6H12O6', true).M === 180 && Math.abs(M.molar('H2O', false).M - 18.015) < 1e-3);
  check('mole: an element without a rounded value falls back to IUPAC', !M.molar('Li2O', true).rows[0].school && Math.abs(M.molar('Li2O', true).rows[0].mass - 6.94) < 1e-9);
  { const e = M.empirical([{ symbol: 'C', pct: 40 }, { symbol: 'H', pct: 6.7 }, { symbol: 'O', pct: 53.3 }]); check('mole: glucose percentages give CH2O and with 180 g/mol C6H12O6', e.formula === 'CH2O' && M.molecular(e, 180).formula === 'C6H12O6' && M.molecular(e, 60).formula === 'C2H4O2'); }
  check('mole: Fe 69.9 % O 30.1 % is Fe2O3 (needs ×2)', M.empirical([{ symbol: 'Fe', pct: 69.9 }, { symbol: 'O', pct: 30.1 }]).formula === 'Fe2O3' && M.empirical([{ symbol: 'Fe', pct: 69.9 }, { symbol: 'O', pct: 30.1 }]).factor === 2);
  check('mole: P 43.6 % O 56.4 % is P2O5; C 85.6 % H 14.4 % is CH2; Al 52.9 % O 47.1 % is Al2O3', M.empirical([{ symbol: 'P', pct: 43.6 }, { symbol: 'O', pct: 56.4 }]).formula === 'P2O5' && M.empirical([{ symbol: 'C', pct: 85.6 }, { symbol: 'H', pct: 14.4 }]).formula === 'CH2' && M.empirical([{ symbol: 'Al', pct: 52.9 }, { symbol: 'O', pct: 47.1 }]).formula === 'Al2O3');
  let bad = 0; for (const items of [[{ symbol: 'C', pct: 50 }], [{ symbol: 'Xx', pct: 50 }, { symbol: 'O', pct: 50 }], [{ symbol: 'C', pct: 50 }, { symbol: 'C', pct: 50 }], [{ symbol: 'C', pct: 0 }, { symbol: 'O', pct: 50 }]]) { try { M.empirical(items); } catch { bad++; } }
  check('mole: bad empirical inputs refused', bad === 4);
  { let t = false; try { M.molecular(M.empirical([{ symbol: 'C', pct: 40 }, { symbol: 'H', pct: 6.7 }, { symbol: 'O', pct: 53.3 }]), 100); } catch { t = true; } check('mole: molar mass that is not a multiple is refused', t); }
  { const L = M.limiting(M.REACTIONS[0], 5, 2); check('mole: 5 mol H2 + 2 mol O2: O2 limits, 4 mol water, 1 mol H2 left', L.lim === 'b' && close(L.products[0].mol, 4) && close(L.leftA, 1) && close(L.leftB, 0)); }
  { const L = M.limiting(M.REACTIONS[1], 1, 3); check('mole: N2 + 3H2 in 1:3 run out together, 2 mol NH3', L.lim === 'both' && close(L.products[0].mol, 2)); }
  { const L = M.limiting(M.REACTIONS[3], 2, 3); check('mole: 2 CH4 + 3 O2: O2 limits, 1.5 CO2, 3 H2O, 0.5 CH4 left', L.lim === 'b' && close(L.products[0].mol, 1.5) && close(L.products[1].mol, 3) && close(L.leftA, 0.5)); }
};
