// #1456 recombinant insulin. Sticky ends of EcoRI, BamHI and HindIII and the blunt SmaI cut, checked
// against the standard recognition sequences (REBASE); base-pair counts and plate selection by hand.
import * as I from '../../src/lib/sci/insulin-r.ts';
export default async (check) => {
  check('insulin: EcoRI leaves 5′ AATT', I.overhang('EcoRI').seq === 'AATT' && I.overhang('EcoRI').kind === '5′');
  check('insulin: BamHI leaves 5′ GATC; HindIII 5′ AGCT', I.overhang('BamHI').seq === 'GATC' && I.overhang('HindIII').seq === 'AGCT');
  check('insulin: SmaI is blunt', I.overhang('SmaI').kind === 'blunt');
  check('insulin: same enzyme ends join, different sticky ends do not', I.compatible('EcoRI', 'EcoRI') && I.compatible('BamHI', 'BamHI') && !I.compatible('EcoRI', 'BamHI') && !I.compatible('HindIII', 'EcoRI'));
  check('insulin: blunt joins blunt only', I.compatible('SmaI', 'SmaI') && !I.compatible('SmaI', 'EcoRI'));
  check('insulin: reverse complement', I.revcomp('GAATTC') === 'GAATTC' && I.revcomp('AGT') === 'ACT');
  check('insulin: 69 bp for chain A, 96 bp for chain B (with start and stop)', I.codingBp(21) === 69 && I.codingBp(30) === 96 && I.codingBp(21, false) === 66);
  check('insulin: plate selection', I.grows('recombinant', 'amp') && !I.grows('recombinant', 'tet') && I.grows('plasmid', 'tet') && !I.grows('none', 'amp') && I.grows('none', 'plain'));
};
