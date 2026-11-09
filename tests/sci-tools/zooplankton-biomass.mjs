// #333 Zooplankton biomass. References from an independent pandas script (Python, scratch): volume from the net,
// densities, a merge of lengths with each taxon's equation, group means of individual mass, biomass and totals.
// Made-up sample and illustrative (made-up) length-weight equations.
import { analyse, netVolume, massOf, readFraction } from '../../src/lib/sci/zooplankton.ts';
const rel = (a, b, tol) => Math.abs(a / b - 1) < tol;
export default async (check) => {
  const V = netVolume(0.5, 10, 0.9);
  check('zooplankton: volume filtered 1.7671 m³ (0.5 m net, 10 m, 90 %)', rel(V, 1.7671458676442586, 1e-14));
  const taxa = [{ taxon: 'Calanoid copepods', count: 212, a: -15.8, b: 2.6 }, { taxon: 'Cladocerans', count: 57, a: -15.4, b: 2.5 }, { taxon: 'Rotifers', count: 340, a: -13.0, b: 2.0 }, { taxon: 'Nauplii', count: 96, a: -14.0, b: 2.2 }];
  const lens = [...[820, 760, 910, 700, 880, 790].map((length) => ({ taxon: 'Calanoid copepods', length })), ...[1150, 1320, 980, 1240, 1100].map((length) => ({ taxon: 'cladocerans ', length })), ...[150, 170, 140, 160].map((length) => ({ taxon: 'Rotifers', length })), { taxon: 'Ostracods', length: 600 }];
  const r = analyse(taxa, lens, V, readFraction('1/8'), 'ln');
  const ref = [[959.7396746092604, 6, 810, 5.093657469620335, 4888.585162464449], [258.04321439965963, 5, 1158, 9.534677281550854, 2460.3587739947907], [1539.2051385242855, 4, 155, 0.054586955178592446, 84.02052190728435]];
  check('zooplankton: densities, mean length, mean mass and biomass per taxon match pandas', ref.every((x, i) => rel(r.rows[i].density, x[0], 1e-12) && r.rows[i].nMeasured === x[1] && rel(r.rows[i].meanLength, x[2], 1e-12) && rel(r.rows[i].meanMass, x[3], 1e-12) && rel(r.rows[i].biomass, x[4], 1e-12)));
  check('zooplankton: totals match pandas (3191.59 ind m⁻³, 7432.96 µg m⁻³)', rel(r.totalDensity, 3191.587125469474, 1e-12) && rel(r.totalBiomass, 7432.964458366524, 1e-12));
  check('zooplankton: taxa without lengths and lengths without a taxon are reported', r.missingMass.join() === 'Nauplii' && r.orphans.join() === 'Ostracods' && Number.isNaN(r.rows[3].biomass));
  check('zooplankton: equation forms', rel(massOf(1000, -2, 2.5, 'log10'), 316227.7660168379, 1e-12) && rel(massOf(1000, 0.02, 2.5, 'power'), 632455.5320336758, 1e-12));
  check('zooplankton: subsample fractions', readFraction('1/16') === 0.0625 && readFraction('6.25 %') === 0.0625 && readFraction('0.5') === 0.5 && Number.isNaN(readFraction('half')));
  check('zooplankton: mean mass is not mass at mean length', r.rows[0].massAtMeanLength < r.rows[0].meanMass);
};
