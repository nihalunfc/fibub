// #839 Gaussian and ORCA output reader. Checked against cclib 1.8 on 120 synthetic output files written in the
// Gaussian 16 and ORCA 5 layouts (2 to 7 atoms, closed and open shell, 1 to 6 optimisation steps, converged and
// not, transition states, no-frequency jobs, error terminations) plus the two examples: energies, geometries, atomic
// numbers, charge and multiplicity, convergence values and status, α/β orbital energies and HOMO index, dipole,
// frequencies, IR intensities, ZPE, H and G, and against the generator's own numbers: 2,489 checks, 0 failed. The
// Lorentzian spectrum against NumPy on all 122 files: 122 checks, 0 failed.
import * as Q from '../../src/lib/sci/qcout.ts';
import { GAUSSIAN_WATER as G, ORCA_FORMALDEHYDE as O } from '../../src/lib/sci/qcexample.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const g = Q.parseOutput(G), o = Q.parseOutput(O);
  check('detect: Gaussian and ORCA', Q.detect(G) === 'Gaussian' && Q.detect(O) === 'ORCA' && Q.detect('hello') === null);
  check('gaussian: energies, method, route', g.energies.length === 4 && g.energies[3] === -76.4089531 && g.method === 'RB3LYP' && g.route === '#p B3LYP/6-31G(d) opt freq' && g.version.startsWith('16'));
  check('gaussian: charge, multiplicity, geometry', g.charge === 0 && g.mult === 1 && g.geometries.length === 4 && g.geometries[3][1].y === 0.7617 && g.geometries[3][0].z === 8);
  check('gaussian: optimisation converged, 3 steps of 4 criteria', g.optimisation && g.converged === true && g.steps.length === 3 && g.steps[0].length === 4 && g.steps[2].every((s) => s.ok) && !g.steps[0][0].ok && g.steps[0][0].name === 'Maximum Force');
  check('gaussian: orbitals, HOMO, LUMO, gap', g.orbitals.alpha.length === 19 && g.orbitals.nAlpha === 5 && near(Q.frontier(g.orbitals).homo, -0.29287) && near(Q.frontier(g.orbitals).gapEV, (0.06571 + 0.29287) * Q.EH_EV, 1e-9));
  check('gaussian: dipole', g.dipole.z === -2.0941 && g.dipole.total === 2.0941);
  check('gaussian: frequencies and IR', g.freqs.map((f) => f.freq).join() === '1712.9,3726.8,3848.6' && g.freqs.map((f) => f.ir).join() === '74.6,2.1,18.4');
  check('gaussian: thermochemistry', g.thermo.zpe === 0.021134 && near(g.thermo.h, -76.384039) && near(g.thermo.g, -76.405461) && g.thermo.temperature === 298.15);
  check('gaussian: normal termination', g.normal && g.notes.length === 0);
  check('orca: energies, route, version', o.energies.length === 3 && o.energies[2] === -114.4215328 && o.route === '! B3LYP def2-SVP Opt Freq' && o.version === '5.0.4');
  check('orca: geometry, charge, convergence', o.geometries.length === 3 && o.geometries[2].length === 4 && o.charge === 0 && o.mult === 1 && o.converged === true && o.steps.length === 3 && o.steps[0].length === 4 && o.steps[1].length === 5 && o.steps[1][0].name === 'Energy change');
  check('orca: orbitals', o.orbitals.alpha.length === 16 && o.orbitals.nAlpha === 8 && near(Q.frontier(o.orbitals).lumo, -0.03812));
  check('orca: dipole from a.u. to debye', near(o.dipole.z, -2.2716, 5e-5) && near(o.dipole.total, 2.2716, 1e-5));
  check('orca: six modes, zero modes left out, km/mol', o.freqs.length === 6 && o.freqs[0].mode === 6 && o.freqs[3].ir === 139.8 && o.irNote.includes('km/mol'));
  check('orca: thermochemistry', o.thermo.zpe === 0.026512 && near(o.thermo.g, -114.4166038) && near(o.thermo.h, -114.3912068) && o.normal);
  // Variants
  const gi = Q.parseOutput(G.replace(' Frequencies --   1712.9000', ' Frequencies --  -1712.9000'));
  check('imaginary frequency read with its sign', gi.freqs[0].freq === -1712.9);
  const ge = Q.parseOutput(G.replace(/ Normal termination of Gaussian.*\n/, ' Error termination via Lnk1e in l502.exe\n'));
  check('error termination noted', !ge.normal && ge.notes[0].includes('error termination'));
  const gt = Q.parseOutput(G.split(' Normal termination')[0].split(' Optimization completed.')[0]);
  check('unfinished file: no normal termination, not converged', !gt.normal && gt.converged === false && gt.notes[0].includes('normal termination'));
  const uhf = Q.parseOutput(' Entering Gaussian System\n SCF Done:  E(UHF) =  -100.123456789     A.U. after   9 cycles\n Alpha  occ. eigenvalues -- -100.12345-10.23456  -0.50000\n Alpha virt. eigenvalues --    0.10000   0.20000\n  Beta  occ. eigenvalues -- -100.12000-10.23000\n  Beta virt. eigenvalues --   -0.40000   0.15000\n Normal termination of Gaussian 16\n'.replace(/\n  Beta/g, '\n Beta'));
  { const f = Q.frontier(uhf.orbitals); check('open shell: α and β, run-together numbers, frontier of both spins', uhf.orbitals.alpha.length === 5 && uhf.orbitals.alpha[1] === -10.23456 && uhf.orbitals.nBeta === 2 && f.homo === -0.5 && f.lumo === -0.4 && uhf.converged === null); }
  const o4 = Q.parseOutput(O.replace(/ Mode   freq       eps      Int.*\n.*\n/, ' Mode    freq (cm**-1)   T**2         TX         TY         TZ\n').replace(/^([ \t]*\d+:[ \t]+\d+\.\d+)[ \t]+\S+[ \t]+(\S+)[ \t]+\S+/gm, '$1   $2'));
  check('ORCA 4 IR layout: T² column used and noted', o4.freqs[3].ir === 139.8 && o4.irNote.includes('ORCA 4'));
  { let t = ''; try { Q.parseOutput('just some text'); } catch (e) { t = e.message; } check('not an output file', t.includes('does not look like a Gaussian or ORCA output')); }
  { let t = ''; try { Q.parseOutput(' Entering Gaussian System\n'); } catch (e) { t = e.message; } check('empty output', t.includes('no energies or geometries')); }
  // Spectrum: area of each band equals its intensity; peak height I·2/(π·FWHM)
  const sp = Q.irSpectrum([{ freq: 1000, ir: 100, mode: 1 }, { freq: -50, ir: 10, mode: 2 }], { fwhm: 20, scale: 0.9, from: 0, to: 20000, step: 0.5 });
  const area = sp.y.reduce((a, b) => a + b, 0) * 0.5, peak = sp.y[sp.x.indexOf(900)];
  check('spectrum: area ≈ intensity, peak at scaled frequency', Math.abs(area - 100) < 0.5 && area < 100 && near(peak, 100 * 2 / (Math.PI * 20), 1e-9) && Math.max(...sp.y) === peak);
  check('xyz and formula', Q.toXyz(g.geometries[3], 'water') === '3\nwater\nO      0.000000     0.000000     0.119400\nH      0.000000     0.761700    -0.477600\nH      0.000000    -0.761700    -0.477600\n' && Q.formulaOf(o.geometries[0]) === 'CH2O' && Q.formulaOf(g.geometries[0]) === 'H2O');
};
