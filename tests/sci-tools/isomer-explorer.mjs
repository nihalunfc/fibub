// #1106 Isomer explorer. Isomer counts checked against the well-known values (alkanes C4 to C7: 2, 3, 5, 9; open-
// chain C4H8 3 and C5H10 5; alcohols + ethers C2 to C5: 2, 3, 7, 14; aldehydes + ketones C3 to C5: 2, 3, 7; acids +
// esters C2 to C4: 2, 3, 6); every name checked against the standard IUPAC name of that compound; cis–trans and
// chiral flags against the textbook examples (but-2-ene, pent-2-ene; butan-2-ol, 3-methylhexane).
import { FORMULAS, isomersOf, relation } from '../../src/lib/sci/isomers.ts';

export default async (check) => {
  const by = Object.fromEntries(FORMULAS.map((f) => [f.id, isomersOf(f)]));
  const counts = { C4H10: 2, C5H12: 3, C6H14: 5, C7H16: 9, C4H8: 3, C5H10: 5, C2H6O: 2, C3H8O: 3, C4H10O: 7, C5H12O: 14, C3H6O: 2, C4H8O: 3, C5H10O: 7, C2H4O2: 2, C3H6O2: 3, C4H8O2: 6 };
  check('isomers: counts for 16 formulas', Object.entries(counts).every(([k, n]) => by[k] && by[k].length === n) && FORMULAS.length === 16);
  const names = (k) => by[k].map((x) => x.name).sort().join('|');
  check('isomers: C6H14 names', names('C6H14') === '2,2-dimethylbutane|2,3-dimethylbutane|2-methylpentane|3-methylpentane|hexane');
  check('isomers: C7H16 names', names('C7H16') === '2,2,3-trimethylbutane|2,2-dimethylpentane|2,3-dimethylpentane|2,4-dimethylpentane|2-methylhexane|3,3-dimethylpentane|3-ethylpentane|3-methylhexane|heptane');
  check('isomers: C4H10O names', names('C4H10O') === '1-methoxypropane|2-methoxypropane|2-methylpropan-1-ol|2-methylpropan-2-ol|butan-1-ol|butan-2-ol|ethoxyethane');
  check('isomers: C5H12O ethers', by.C5H12O.filter((x) => x.family === 'ether').map((x) => x.name).sort().join('|') === '1-ethoxypropane|1-methoxy-2-methylpropane|1-methoxybutane|2-ethoxypropane|2-methoxy-2-methylpropane|2-methoxybutane');
  check('isomers: C5H10O names', names('C5H10O') === '2,2-dimethylpropanal|2-methylbutanal|3-methylbutan-2-one|3-methylbutanal|pentan-2-one|pentan-3-one|pentanal');
  check('isomers: C4H8O2 names', names('C4H8O2') === '1-methylethyl methanoate|2-methylpropanoic acid|butanoic acid|ethyl ethanoate|methyl propanoate|propyl methanoate');
  check('isomers: C5H10 names', names('C5H10') === '2-methylbut-1-ene|2-methylbut-2-ene|3-methylbut-1-ene|pent-1-ene|pent-2-ene');
  check('isomers: C2H6O and C3H6O', names('C2H6O') === 'ethanol|methoxymethane' && names('C3H6O') === 'propanal|propanone');
  const all = Object.values(by).flat(), get = (n) => all.find((x) => x.name === n);
  check('isomers: cis–trans only for but-2-ene and pent-2-ene', all.filter((x) => x.cisTrans).map((x) => x.name).sort().join() === 'but-2-ene,pent-2-ene');
  check('isomers: chiral carbons', get('butan-2-ol').chiral === 1 && get('3-methylhexane').chiral === 1 && get('2,3-dimethylpentane').chiral === 1 && get('butan-1-ol').chiral === 0 && get('2-methylbutanal').chiral === 1 && get('pentan-3-ol').chiral === 0);
  const rel = (a, b) => relation(get(a), get(b)).kind;
  check('isomers: relations', rel('butan-1-ol', 'ethoxyethane') === 'functional' && rel('ethoxyethane', '1-methoxypropane') === 'metamers' && rel('butan-1-ol', 'butan-2-ol') === 'position'
    && rel('butan-1-ol', '2-methylpropan-1-ol') === 'chain' && rel('1-methoxypropane', '2-methoxypropane') === 'position' && rel('propanal', 'propanone') === 'functional'
    && rel('ethyl ethanoate', 'methyl propanoate') === 'metamers' && rel('pentane', '2-methylbutane') === 'chain' && rel('but-1-ene', 'but-2-ene') === 'position' && rel('1-methoxybutane', '2-methoxy-2-methylpropane') === 'chain');
  check('isomers: condensed formulas', get('ethanol').condensed === 'CH₃–CH₂–OH' && get('propanone').condensed === 'CH₃–C(=O)–CH₃' && get('2,2-dimethylpropane').condensed === 'CH₃–C(CH₃)₂–CH₃' && get('but-1-ene').condensed === 'CH₂=CH–CH₂–CH₃' && get('ethanoic acid').condensed === 'CH₃–COOH');
};
