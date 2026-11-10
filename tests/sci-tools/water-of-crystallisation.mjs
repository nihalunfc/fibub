// #1295 Water of crystallisation. Checked against Python: CuSO₄·5H₂O has M = 249.5 g/mol with school masses;
// 2.495 g of it leaves 1.595 g of CuSO₄, so x = (0.9/18)/(1.595/159.5) = 5. Washing soda Na₂CO₃·10H₂O is 286.
import { HYDRATES, molarMass, split, xFromMasses } from '../../src/lib/sci/hydrate-school.ts';
export default async (check) => {
  const H = Object.fromEntries(HYDRATES.map((h) => [h.id, h]));
  check('hydrate: CuSO₄ 159.5, CuSO₄·5H₂O 249.5', molarMass(H.cuso4.parts) === 159.5 && split(H.cuso4, 1).Mh === 249.5);
  check('hydrate: Na₂CO₃·10H₂O 286, FeSO₄·7H₂O 278, CaSO₄·2H₂O 172, CoCl₂·6H₂O 238', split(H.na2co3, 1).Mh === 286 && split(H.feso4, 1).Mh === 278 && split(H.caso4, 1).Mh === 172 && split(H.cocl2, 1).Mh === 238);
  const s = split(H.cuso4, 2.495);
  check('hydrate: 2.495 g of blue vitriol holds 0.9 g water', Math.abs(s.water - 0.9) < 1e-12 && Math.abs(s.salt - 1.595) < 1e-12);
  const r = xFromMasses(H.cuso4, 20, 22.495, 21.595);
  check('hydrate: weighings 20.000 / 22.495 / 21.595 g give x = 5 (Python)', Math.abs(r.x - 5) < 1e-9 && Math.abs(r.pct - 36.07) < 0.01);
  let ok = true;
  for (const h of HYDRATES) for (const m of [0.5, 2, 7.3]) { const sp = split(h, m); const back = xFromMasses(h, 10, 10 + m, 10 + sp.salt); if (Math.abs(back.x - h.x) > 1e-9) ok = false; }
  check('hydrate: every salt: heating to constant mass gives back its x', ok);
};
