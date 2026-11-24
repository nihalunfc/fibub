// #T70 Spectral line identifier. The air/vacuum conversion, the three-line redshift and the simulated-spectrum checks
// live in tests/sci.mjs; the cases below pin the numbers published in
// src/blog/discoveries/ghz2-redshift-12-34-uv-line-identification-jwst.md: the ultraviolet lines of a galaxy at
// redshift 12.34, the one spurious redshift two lines allow, and how a third line removes it.
import { SPEC_LINES, restIn, identify, findRedshift } from '../../src/lib/sci/speclines.ts';
const SETS = ['quasar', 'nebular', 'stellar'], Z = 12.34;
const rest = (name) => restIn(SPEC_LINES.find((l) => l.name === name && l.set === 'quasar'), 'vac');
const cands = (obs, tol) => findRedshift(obs, SETS, -0.01, 13, 4e-4 + tol / 6000, 'vac');
export default async (check) => {
  const civ = rest('C IV') * (1 + Z), ciii = rest('C III]') * (1 + Z), lya = rest('Lyman α') * (1 + Z);
  check('spectral lines: at z = 12.34 C IV lands at 20664.5 A, C III] at 25462.5 A and Lyman alpha at 16217.0 A',
    Math.abs(civ - 20664.5) < 0.1 && Math.abs(ciii - 25462.5) < 0.1 && Math.abs(lya - 16217.0) < 0.1);
  const at = identify([civ, ciii], Z, 20, SETS, 'vac');
  check('spectral lines: both are identified at z = 12.34 with no rival within 20 A and no velocity offset',
    at[0].matches.length === 1 && at[0].matches[0].line.name === 'C IV' && Math.abs(at[0].matches[0].kms) < 1e-6 &&
    at[1].matches.length === 1 && at[1].matches[0].line.name === 'C III]' && Math.abs(at[1].matches[0].kms) < 1e-6);
  const loose = cands([civ, ciii], 20), tight = cands([civ, ciii], 10);
  check('spectral lines: two lines and a 20 A window allow a spurious z = 4.244, which a 10 A window removes',
    loose.length === 2 && loose.some((c) => Math.abs(c.z - 4.244) < 1e-3) && loose.some((c) => Math.abs(c.z - Z) < 1e-3) &&
    tight.length === 1 && Math.abs(tight[0].z - Z) < 1e-3);
  check('spectral lines: the spurious redshift identifies nothing when it is tested',
    identify([civ, ciii], 4.244, 20, SETS, 'vac').every((r) => r.matches.length === 0));
  const three = cands([lya, civ, ciii], 20);
  check('spectral lines: adding Lyman alpha makes z = 12.34 the only candidate with three lines',
    Math.abs(three[0].z - Z) < 1e-3 && three[0].n === 3 && three.slice(1).every((c) => c.n === 2));
};
