// #1362 Bond enthalpy estimator. ΔH = Σ broken − Σ made, checked by hand sums (independent Python) for each
// preset with the page's rounded bond values: methane −802, HCl −183, water −482, ammonia −93, ethene + H₂ −123,
// ethene + Br₂ −92, chlorination −114, 2HBr → H₂ + Br₂ +103 kJ/mol.
import * as B from '../../src/lib/sci/bond-enthalpy.ts';
export default async (check) => {
  const want = { ch4: -802, hcl: -183, h2o: -482, nh3: -93, c2h4h2: -123, c2h4br2: -92, ch3cl: -114, hbr: 103 };
  for (const r of B.REACTIONS) { const e = B.estimate(r.broken, r.made); check(`bond enthalpy: ${r.id} ΔH = ${want[r.id]} kJ/mol`, e.dH === want[r.id]); }
  const m = B.estimate({ CH: 4, O2O: 2 }, { C2O: 2, OH: 4 });
  check('bond enthalpy: methane needs 2648 in, gives 3450 out', m.broken === 2648 && m.made === 3450 && m.lines.length === 4);
  check('bond enthalpy: own values override the table', B.estimate({ HH: 1, ClCl: 1 }, { HCl: 2 }, { HCl: 432 }).dH === -185);
  check('bond enthalpy: every preset uses known bonds and balances atoms', B.REACTIONS.every((r) => [...Object.keys(r.broken), ...Object.keys(r.made)].every((k) => B.BONDS.some((b) => b.id === k))));
};
