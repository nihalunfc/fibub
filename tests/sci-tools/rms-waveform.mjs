// #1416 RMS from a waveform. Checked against a NumPy script averaging v² over 10⁶ samples for each shape (peak 1):
// sine 0.707107, square 1, triangle 0.577350, sawtooth 0.577350, half-wave 0.5, full-wave 0.707107; mean |v| for a
// sine 0.636620. 325 V peak sine: mean of v² 52812.5 V², rms 229.810 V.
import * as W from '../../src/lib/sci/rms-waveform.ts';
import { n3 } from '../../src/lib/sci/em-p34.ts';
import { seeded, isRight } from '../../src/lib/sci/elec-quiz.ts';
const near = (a, b, r = 1e-6) => Math.abs(a - b) <= r * Math.abs(b) + 1e-9;

export default async (check) => {
  let ok = true;
  for (const w of ['sine', 'square', 'triangle', 'saw', 'half', 'full']) {
    const m = W.measure(w, 1, 20000), e = W.EXACT[w];
    if (!near(m.rms, e.rms, 1e-4) || Math.abs(m.mean - e.mean) > 1e-4 || !near(m.absMean, e.absMean, 1e-4)) ok = false;
  }
  check('rms: numerical slices match the exact factors for all six shapes', ok);
  check('rms: exact factors match NumPy', near(W.EXACT.sine.rms, 0.707107) && near(W.EXACT.triangle.rms, 0.57735) && near(W.EXACT.half.rms, 0.5) && near(W.EXACT.sine.absMean, 0.63662));
  const m = W.measure('sine', 325);
  check('rms: Indian mains peak 325 V gives 230 V rms', near(m.meanSq, 52812.5, 1e-9) && near(m.rms, 229.81, 1e-5));
  check('rms: shapes have peak 1', W.shape('sine', 0.25) === 1 && W.shape('triangle', 0.25) === 1 && W.shape('triangle', 0.75) === -1 && W.shape('saw', 0) === -1 && W.shape('half', 0.75) === 0 && W.shape('full', 0.75) === 1);
  let okq = true;
  for (let k = 1; k <= 60; k++) for (const q of W.questions(seeded(k))) { if (!(q.answer > 0) || !isRight(String(q.answer), q) || isRight(String(q.answer * 1.1), q)) okq = false; if (!q.steps.join(' ').includes(n3(q.answer))) okq = false; }
  check('rms: 60 seeded question sets check out', okq);
};
