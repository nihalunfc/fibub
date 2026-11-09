// #954 Langmuir probe: recovers the made-up plasma behind the example trace; matches a NumPy re-implementation.
import { analyse, exampleTrace, fitLine } from '../../src/lib/sci/phlangmuir.ts';
export default async (check) => {
  const near = (a, b, r) => Math.abs(a / b - 1) < r;
  const { V, I } = exampleTrace();
  check('langmuir: example trace has 141 points from −40 to 30 V', V.length === 141 && V[0] === -40 && V[140] === 30);
  const r = analyse(V, I, { area: 2e-6, A: 40 });
  check('langmuir: Te 2.9733 eV (NumPy), true value 3 eV within 1 %', near(r.Te, 2.973263, 1e-5) && near(r.Te, 3, 0.01));
  check('langmuir: floating potential −3.3751 V (NumPy)', Math.abs(r.Vf + 3.375133) < 1e-5);
  check('langmuir: plasma potential 11.975 V (NumPy), true 12 V', Math.abs(r.Vp - 11.975392) < 1e-5);
  check('langmuir: density from electron saturation 1.00775e16 (NumPy)', near(r.nE, 1.007754e16, 1e-5));
  check('langmuir: density from ion saturation (Bohm, 0.61) 9.9730e15 (NumPy)', near(r.nI, 9.972977e15, 1e-5));
  check('langmuir: Vp − Vf near Te ln(√(mi/2πme)/0.61) for argon', Math.abs(r.Vp - r.Vf - r.dVtheory) < 0.2);
  const m = analyse(V, I, { area: 2e-6, A: 40, ionMax: -20, teLo: 0, teHi: 9 });
  check('langmuir: manual fit ranges are used and agree within 2 %', m.ionTop === -20 && m.lo === 0 && m.hi === 9 && near(m.Te, 3, 0.02));
  { let t = ''; try { analyse(V, I.map((x) => -x), { area: 2e-6, A: 40 }); } catch (e) { t = e.message; } check('langmuir: reversed sign convention is spotted', t.includes('Switch the sign')); }
  const L = fitLine([0, 1, 2, 3], [1, 3, 5, 7]); check('langmuir: line fit', L.a === 1 && L.b === 2 && L.r2 === 1);
  let threw = ''; try { analyse(V, I.map((x) => Math.abs(x)), { area: 2e-6, A: 40 }); } catch (e) { threw = e.message; }
  check('langmuir: current that never changes sign is refused', threw.includes('never changes sign'));
};
