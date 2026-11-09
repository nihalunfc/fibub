// #936 Polarisation: Jones chains and Mueller matrices checked against an independent NumPy implementation
// (Mueller from A (J ⊗ J*) A⁻¹, a different route from the trace formula used in the tool), plus Malus's law.
import { parseElements, propagate, propagateJones, stokesOf, stokesFrom, jonesFrom, describe, muellerOf, jRetarder, jPolariser, systemMueller, mapply } from '../../src/lib/sci/phpol.ts';
export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  const nearV = (a, b, tol = 1e-12) => a.length === b.length && a.every((x, i) => near(x, b[i], tol));
  const els = parseElements('hwp 22.5\nqwp 0\npolariser 30');
  check('pol: parse three elements', els.length === 3 && els[0].a === 180 && els[1].a === 90 && els[2].kind === 'polariser');
  const S = propagate([1, 1, 0, 0], els);
  check('pol: H → HWP 22.5° → +45° (NumPy)', nearV(S[1], [1, 0, 1, 0]));
  check('pol: → QWP 0° → circular S3 = +1 (NumPy)', nearV(S[2], [1, 0, 0, 1]));
  check('pol: → polariser 30° → 0.5, linear at 30° (NumPy)', nearV(S[3], [0.5, 0.2500000000000001, 0.4330127018922193, 0]) && describe(S[3]).kind === 'linear at 30°');
  const J = propagateJones(jonesFrom(0, 0), els);
  check('pol: Jones and Mueller routes agree', J.every((v, i) => nearV(stokesOf(v), S[i])));
  check('pol: jonesFrom matches stokesFrom (ψ 20°, χ 10°)', nearV(stokesOf(jonesFrom(20, 10)), [1, 0.7198463103929543, 0.6040227735550536, 0.3420201433256687]) && nearV(stokesFrom(20, 10), stokesOf(jonesFrom(20, 10))));
  const e2 = parseElements('retarder 60 30\nrotator 25\npartial 0.9 0.2 10');
  check('pol: elliptical input through retarder, rotator, partial polariser (NumPy)', nearV(propagate(stokesFrom(20, 10), e2)[3], [0.7099132623016804, 0.43689732867458764, 0.5576954377011725, -0.045534195459254474]));
  const e3 = parseElements('retarder 60 30\nrotator 25\npartial 0.9 0.2 10\ndepolariser 0.5');
  check('pol: 60 % polarised input with a depolariser (NumPy Mueller)', nearV(propagate(stokesFrom(20, 10, 0.6), e3)[4], [0.6459479573810082, 0.19684768205738984, 0.19125004134314855, -0.013660258637776332]));
  check('pol: Jones chain refuses a depolariser', propagateJones(jonesFrom(0, 0), e3) === null);
  check('pol: Mueller of retarder 60° at 30° (NumPy)', muellerOf(jRetarder(60, 30)).flat().every((v, i) => near(v, [1, 0, 0, 0, 0, 0.625, 0.21650635094610968, 0.75, 0, 0.21650635094610965, 0.875, -0.4330127018922194, 0, -0.75, 0.4330127018922194, 0.5][i], 1e-12)));
  check('pol: Mueller of polariser at 30° (NumPy)', muellerOf(jPolariser(30)).flat().every((v, i) => near(v, [0.5, 0.25, 0.4330127018922193, 0, 0.25, 0.125, 0.2165063509461097, 0, 0.4330127018922193, 0.2165063509461097, 0.375, 0, 0, 0, 0, 0][i], 1e-12)));
  check('pol: Malus: unpolarised through 0° then 60° polarisers = 1/8', near(propagate([1, 0, 0, 0], parseElements('polariser 0\npolariser 60'))[2][0], 0.125, 1e-14));
  check('pol: crossed polarisers block, a 45° polariser between passes 1/8', near(propagate([1, 0, 0, 0], parseElements('pol 0\npol 90'))[2][0], 0, 1e-15) && near(propagate([1, 0, 0, 0], parseElements('pol 0\npol 45\npol 90'))[3][0], 0.125, 1e-14));
  check('pol: system Mueller equals the chain', nearV(mapply(systemMueller(e3), stokesFrom(20, 10, 0.6)), propagate(stokesFrom(20, 10, 0.6), e3)[4]));
  { const d = describe(stokesFrom(-30, 0, 0.6)); check('pol: describe partly polarised linear', near(d.dop, 0.6, 1e-12) && near(d.psi, -30, 1e-9) && d.kind === 'partly polarised (60 %), linear at −30°'); }
  { const d = describe(stokesFrom(10, -45)); check('pol: describe left circular', d.kind === 'left-handed circular' && near(d.chi, -45, 1e-9)); }
  { const d = describe(stokesFrom(15, 20)); check('pol: describe right elliptical', d.kind === 'right-handed elliptical, axis at 15°'); }
  check('pol: unpolarised stays unpolarised through a waveplate', describe(propagate([1, 0, 0, 0], parseElements('qwp 30'))[1]).kind === 'unpolarised');
  let msg = ''; try { parseElements('mirror 3'); } catch (e) { msg = e.message; }
  check('pol: unknown element message', msg.includes('is not an element'));
  msg = ''; try { parseElements('retarder 60'); } catch (e) { msg = e.message; }
  check('pol: missing angle message', msg.includes('retarder 60 30'));
};
