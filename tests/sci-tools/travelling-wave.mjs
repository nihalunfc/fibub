// #1063 travelling-wave: checked against Python (math) and the textbook identities for standing waves and beats.
import { waveNumber, angularFreq, waveSpeed, waveY, particleV, beatFreq, beatsY, beatsEnvelope, nodes } from '../../src/lib/sci/learnwave.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  check('wave: k for λ = 2 m is π', near(waveNumber(2), Math.PI));
  check('wave: ω for T = 0.5 s is 4π', near(angularFreq(0.5), 4 * Math.PI));
  check('wave: v = ω/k = λ/T', near(waveSpeed(waveNumber(2), angularFreq(0.5)), 4));
  check('wave: y(0.3, 0.1) for A 5, λ 2, T 1 = 5 sin(0.3π − 0.2π) = 1.54508', near(waveY(0.3, 0.1, 5, Math.PI, 2 * Math.PI), 1.5450849718747373));
  check('wave: dir −1 is kx + ωt', near(waveY(0.3, 0.1, 5, Math.PI, 2 * Math.PI, -1), 5 * Math.sin(0.5 * Math.PI)));
  // Particle velocity by finite difference
  const h = 1e-6, dv = (waveY(0.7, 0.2 + h, 2, 3, 5) - waveY(0.7, 0.2 - h, 2, 3, 5)) / (2 * h);
  check('wave: particle velocity = ∂y/∂t', near(particleV(0.7, 0.2, 2, 3, 5), dv, 1e-6));
  // The crest moves at v: y(x + vΔt, t + Δt) = y(x, t)
  check('wave: the shape moves at v', near(waveY(0.4 + 4 * 0.13, 0.13, 1, Math.PI, 4 * Math.PI), waveY(0.4, 0, 1, Math.PI, 4 * Math.PI)));
  // Standing wave identity: sin(kx − ωt) + sin(kx + ωt) = 2 sin kx cos ωt
  let ok = true; for (const [x, t] of [[0.1, 0.2], [0.77, 1.3], [1.5, 0.05]]) ok &&= near(waveY(x, t, 1, 2, 3, 1) + waveY(x, t, 1, 2, 3, -1), 2 * Math.sin(2 * x) * Math.cos(3 * t));
  check('wave: two opposite waves make 2A sin kx cos ωt', ok);
  check('wave: nodes every λ/2', JSON.stringify(nodes(2, 4)) === JSON.stringify([0, 1, 2, 3, 4]));
  check('wave: beats 440 and 444 Hz = 4 Hz', beatFreq(440, 444) === 4);
  // Beats identity: sin a + sin b = 2 sin((a+b)/2) cos((a−b)/2); |y| ≤ envelope
  ok = true; for (let i = 0; i < 2000; i++) { const t = i / 2000; ok &&= Math.abs(beatsY(t, 1, 440, 444)) <= beatsEnvelope(t, 1, 440, 444) + 1e-9; }
  check('wave: beats stay inside the envelope 2A|cos π(f1 − f2)t|', ok);
  check('wave: envelope is zero at t = 1/(2Δf)', near(beatsEnvelope(0.125, 1, 440, 444), 0, 1e-9));
};
