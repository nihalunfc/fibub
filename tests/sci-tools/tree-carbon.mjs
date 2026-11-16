// Tree carbon (src/lib/sci/treecarbon.ts). Reference values worked out by hand in Python (plain arithmetic, no fibub
// code): Chave et al. (2014) pantropical equation AGB = 0.0673 (ρ D² H)^0.976, the silver oak AGB equation of
// Uttaruk et al. (2026, Forests 17: 100), AGB = 0.1609 (D² H)^0.7846, and CO₂ = C × 44.0095 / 12.011.
import { agb, stock, forest } from '../../src/lib/sci/treecarbon.ts';
export default async (check) => {
  const rel = (a, b, t = 1e-9) => Math.abs(a / b - 1) < t;
  check('tree carbon: Chave 2014, ρ 0.6, D 30 cm, H 25 m gives 723.137 kg', rel(agb({ form: 'rdh', a: 0.0673, b: 0.976, rho: 0.6 }, 30, 25), 723.1373980850495));
  check('tree carbon: a·D^b form, 0.1 × 30^2.4 = 350.825 kg', rel(agb({ form: 'd', a: 0.1, b: 2.4, rho: 1 }, 30, 0), 350.82538568245695));
  const so = { form: 'rdh', a: 0.1609, b: 0.7846, rho: 1 }, s = stock(agb(so, 36.8, 19), 0.2, 0.47135);
  check('tree carbon: silver oak D 36.8 cm, H 19 m: AGB 464.509, total 557.411, C 262.736, CO2 962.690 kg', rel(s.agb, 464.5094101521825) && rel(s.total, 557.411292182619) && rel(s.c, 262.73581257027746) && rel(s.co2, 962.6901792782973));
  const g = forest([{ id: 'x', D: 20, H: 15 }], { form: 'rdh', a: 0.0673, b: 0.976, rho: 0.6 }, 0.25, 0.47, { g: 1 });
  check('tree carbon: 1 cm a year of DBH growth on a 20 cm, 15 m tree adds 42.815 kg CO2', rel(g.perYear, 42.815242997340874, 1e-8));
};
