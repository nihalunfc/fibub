// #1046 Phasor diagram and LCR. Checked against an independent NumPy script using complex impedance
// Z = R + j(ωL − 1/ωC) (R 20 Ω, L 0.1 H, C 10 µF, 10 V: at 50 Hz |Z| = 287.590 Ω, I = 34.772 mA, φ = −86.012°,
// P = 24.181 mW; f₀ = 159.155 Hz, Q = 5) and a brute-force scan for the half-power frequencies (144.03 and
// 175.86 Hz, bandwidth 31.83 Hz).
import * as L from '../../src/lib/sci/lcr-phasors.ts';
import { seeded, isRight } from '../../src/lib/sci/elec-quiz.ts';
const near = (a, b, r = 1e-9) => Math.abs(a - b) <= r * Math.abs(b) + 1e-15;

export default async (check) => {
  const s = L.lcr(20, 0.1, 10e-6, 50, 10);
  check('lcr: reactances at 50 Hz', near(s.XL, 31.415926535897935) && near(s.XC, 318.30988618379064));
  check('lcr: impedance, current, phase match complex numbers', near(s.Z, 287.5902364171056) && near(s.I, 0.03477169504981571) && near((s.phi * 180) / Math.PI, -86.01223851483479));
  check('lcr: power factor and power', near(s.pf, 0.06954339009963137) && near(s.P, 0.02418141553274755, 1e-8));
  check('lcr: resonance f0 and Q', near(s.f0, 159.15494309189532) && near(s.Q, 5));
  const r = L.lcr(20, 0.1, 10e-6, s.f0, 10);
  check('lcr: at resonance Z = R, I = V/R, pf 1, V_L = V_C = Q V', near(r.Z, 20, 1e-12) && near(r.I, 0.5, 1e-12) && near(r.pf, 1, 1e-12) && near(r.VL, 50, 1e-9) && near(r.VC, 50, 1e-9));
  const [f1, f2] = L.halfPower(20, 0.1, 10e-6);
  check('lcr: half-power points match the scan and give f0/Q', Math.abs(f1 - 144.0333) < 0.001 && Math.abs(f2 - 175.864) < 0.001 && near(f2 - f1, s.bw, 1e-9) && near(f1 * f2, s.f0 * s.f0, 1e-9));
  check('lcr: current at half-power is peak/√2', near(L.currentAt(20, 0.1, 10e-6, 10, f1), 0.5 / Math.SQRT2, 1e-9));
  check('lcr: phasors add up: V² = V_R² + (V_L − V_C)²', near(Math.hypot(s.VR, s.VL - s.VC), 10, 1e-12));
  let ok = true;
  for (let k = 1; k <= 40; k++) {
    const qs = L.questions(seeded(k));
    for (const q of qs) { if (!(q.answer > 0) || !isRight(String(q.answer), q) || isRight(String(q.answer * 1.1), q)) ok = false; if (!q.steps.join(' ').includes(String(Number(q.answer.toPrecision(3))))) ok = false; }
    const [mH, f] = qs[0].text.match(/a ([\d.]+) mH inductor at ([\d.]+) Hz/).slice(1).map(Number);
    if (!near(qs[0].answer, 2 * Math.PI * f * mH / 1000, 1e-12)) ok = false;
  }
  check('lcr: 40 seeded question sets check out', ok);
};
