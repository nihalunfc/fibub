// #621 circuit simulator. Checked against an independent NumPy nodal solve (DC bridge), the analytic transfer
// functions of the RC and series RLC circuits (AC), and SciPy solve_ivp (rtol 1e-11) on the same circuits'
// differential equations with the same PULSE/SIN sources (transient).
import * as C from '../../src/lib/sci/eng-circuit.ts';
export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  check('circuit: SPICE values', C.parseValue('4.7k') === 4700 && near(C.parseValue('1meg'), 1e6, 1e-6) && near(C.parseValue('2.2uF'), 2.2e-6, 1e-18) && near(C.parseValue('10m'), 0.01, 1e-15) && near(C.parseValue('100nH'), 1e-7, 1e-20) && C.parseValue('3e3') === 3000 && Number.isNaN(C.parseValue('abc')));
  check('circuit: eng format', C.eng(1500, 'Ω') === '1.5 kΩ' && C.eng(1e-6, 'F') === '1 µF' && C.eng(159.155, 'Hz') === '159.2 Hz');
  const d = C.parseNetlist(C.EXAMPLES.divider.text), op = C.dcOp(d);
  check('circuit: DC bridge node voltages vs NumPy', near(op.v.a, 4.105613784443176, 1e-9) && near(op.v.b, 5.955730760803241, 1e-9));
  check('circuit: DC source current vs NumPy', near(op.elems.find((e) => e.name === 'V1').i, -0.0016783017449669706, 1e-12));
  { const pin = op.elems.reduce((s, e) => s + e.p, 0); check('circuit: powers add up to zero (Tellegen)', Math.abs(pin) < 1e-12); }
  const rc = C.parseNetlist(C.EXAMPLES.rc.text), ac = C.acSweep(rc, [10, 159.155, 1000]), b = C.bode(ac, 'out');
  check('circuit: RC Bode vs 1/(1+jωRC)', near(b.db[0], -0.017111504344580936, 1e-9) && near(b.db[1], -3.010301509521259, 1e-9) && near(b.db[2], -16.072235265805517, 1e-9) && near(b.phase[1], -45.00001024345701, 1e-7) && near(b.phase[2], -80.95693892096232, 1e-7));
  const rlc = C.parseNetlist(C.EXAMPLES.rlc.text), ac2 = C.acSweep(rlc, C.logFreqs(100, 1e5, 50)), b2 = C.bode(ac2, 'out'), x = C.crossings(ac2.f, b2.db, -3.0103);
  check('circuit: RLC −3 dB band edges vs analytic', x.length === 2 && Math.abs(x[0] / 1513.9601543154847 - 1) < 2e-3 && Math.abs(x[1] / 1673.11509740738 - 1) < 2e-3);
  { const pk = C.refinePeak(rlc, 'out', 1500, 1700); check('circuit: refined peak at 1/(2π√LC)', Math.abs(pk.f / 1591.5494309189535 - 1) < 1e-6 && Math.abs(pk.db) < 1e-9); }
  { const y = C.crossings(ac2.f, b2.db, -3.0102999566398, rlc, 'out'); check('circuit: refined −3 dB edges vs analytic', Math.abs(y[0] / 1513.9601543154847 - 1) < 1e-6 && Math.abs(y[1] / 1673.11509740738 - 1) < 1e-6); }
  { const s = C.acSweep(rlc, [1 / (2 * Math.PI * Math.sqrt(10e-3 * 1e-6))]); check('circuit: RLC is 0 dB at resonance', near(C.bode(s, 'out').db[0], 0, 1e-9)); }
  const t2 = C.transient(rlc, 1e-6, 5e-3, 'trap'), ref = [-0.07503713, -0.03214893, 0.03316943, -0.00268734];
  check('circuit: RLC step (trapezoidal) vs SciPy', [500, 1000, 2000, 5000].every((k, i) => near(t2.v.out[k], ref[i], 2e-5)));
  const t2b = C.transient(rlc, 1e-6, 5e-3, 'be');
  check('circuit: RLC step (backward Euler) close to SciPy, more damped', [500, 1000, 2000, 5000].every((k, i) => near(t2b.v.out[k], ref[i], 4e-3)) && Math.abs(t2b.v.out[5000]) < Math.abs(t2.v.out[5000]));
  check('circuit: inductor current is the loop current', near(t2.i.L1[1000], t2.v.out[1000] / 10, 1e-12));
  const t1 = C.transient(rc, 1e-7, 2e-3, 'trap');
  check('circuit: RC step vs SciPy', near(t1.v.out[10000], 0.63193656, 1e-4) && near(t1.v.out[20000], 0.86459703, 1e-4));
  check('circuit: capacitor current C dv/dt', near(t1.i.C1[10000], t1.i.R1[10000], 1e-9));
  const rl = C.parseNetlist(C.EXAMPLES.rl.text), t3 = C.transient(rl, 2e-6, 5e-3, 'trap');
  check('circuit: RL with a sine source vs SciPy', [500, 1250, 2500].every((k, i) => near(t3.v.out[k], [0.45045679, -0.45047724, 0.45047724][i], 2e-5)));
  const lad = C.transient(C.parseNetlist(C.EXAMPLES.lc.text), 1e-6, 8e-3, 'trap');
  check('circuit: two-stage ladder vs SciPy', near(lad.v.out[500], 0.29101347, 3e-3) && near(lad.v.out[2000], 2.61459787, 3e-3) && near(lad.v.out[8000], 4.93807369, 3e-3));
  check('circuit: sources', C.srcAt({ dc: 0, acMag: 0, acPhase: 0, tran: { kind: 'pulse', p: [0, 5, 1, 1, 1, 2, 10] } }, 1.5) === 2.5 && C.srcAt({ dc: 0, acMag: 0, acPhase: 0, tran: { kind: 'pwl', p: [0, 0, 2, 4] } }, 1) === 2 && near(C.srcAt({ dc: 0, acMag: 0, acPhase: 0, tran: { kind: 'sin', p: [1, 2, 1] } }, 0.25), 3, 1e-12));
  let e1 = ''; try { C.dcOp(C.parseNetlist('V1 a 0 5\nV2 a 0 3\nR1 a 0 1k')); } catch (e) { e1 = e.message; }
  check('circuit: loop of voltage sources is reported', e1.includes('V2') && e1.includes('loop'));
  let e2 = ''; try { C.parseNetlist('Q1 a b c model'); } catch (e) { e2 = e.message; }
  check('circuit: unknown part is reported', e2.startsWith('Line 1') && e2.includes('R, C, L, V or I'));
  { const f = C.dcOp(C.parseNetlist('V1 in 0 5\nC1 in a 1u\nC2 a 0 1u\nR1 in 0 1k')); check('circuit: capacitor-only node gets a GMIN leak', near(f.v.a, 0, 1e-9) && f.notes[0].includes('a')); }
  { const s = C.transient(C.parseNetlist('I1 0 a PULSE(0 1m 0 1n 1n 1 2)\nC1 a 0 1u\nR1 a 0 1meg'), 1e-5, 1e-3); check('circuit: current into a capacitor ramps (I/C)', near(s.v.a[100] - s.v.a[50], 0.5, 1e-3)); }
};
