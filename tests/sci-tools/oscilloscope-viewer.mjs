// #979 Oscilloscope CSV viewer. Noise-free traces are checked against theory (RC rise time τ ln 9, the RC phase lag
// atan(ωτ), the delay τ ln 2); the noisy example against an independent numpy implementation written for these tests.
import * as S from '../../src/lib/sci/phscope.ts';
export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  { const e = S.exampleCapture(4000, 1e-6, 10e-6, 45, 0), m = S.measure(e.t, e.c1), m2 = S.measure(e.t, e.c2), p = S.phase(e.t, e.c1, e.c2, m.freq, m.up, m2.up);
    check('scope: noise-free frequency and duty cycle', near(m.freq, 1000, 1e-9) && near(m.duty, 0.5, 1e-9) && near(m2.freq, 1000, 1e-9));
    check('scope: RC rise and fall time = τ ln 9', near(m.rise, 10e-6 * Math.log(9), 0.02e-6) && near(m.fall, 10e-6 * Math.log(9), 0.02e-6));
    check('scope: fundamental phase = 45° − atan(ωτ)', near(p.dft, 45 - Math.atan(2 * Math.PI * 1000 * 1e-5) * 180 / Math.PI, 0.01) && p.periods === 3);
    check('scope: edge phase = 45° − 360 f τ ln 2', near(p.edge, 45 - 360 * 1000 * 10e-6 * Math.LN2, 0.01));
    check('scope: sine RMS = amplitude/√2', near(m2.acRms, Math.SQRT1_2, 1e-9) && near(m2.top, 1, 1e-6) && near(m2.base, -1, 1e-6)); }
  { const e = S.exampleCapture(), m = S.measure(e.t, e.c1), m2 = S.measure(e.t, e.c2), p = S.phase(e.t, e.c1, e.c2, m.freq, m.up, m2.up);
    check('scope: noisy example matches numpy', near(m.freq, 999.9919626789739, 1e-9) && near(m.rise, 2.1887703117960677e-05, 1e-15) && near(m.fall, 2.1838067931819664e-05, 1e-15) && near(m2.freq, 1000.026197184194, 1e-9));
    check('scope: noisy levels and phase match numpy', near(m.base, 0.006705433302612672, 1e-12) && near(m.top, 3.2959696400472587, 1e-12) && near(p.dft, 41.39181762601231, 1e-9) && near(m2.acRms, 0.7071486198512376, 1e-12)); }
  { const csv = 'Model,DS1104\nRecord Length,5\n\nTime,CH1,CH2\n0,0,1\n0.001,1,0\n0.002,0,1\n0.003,1,0\n0.004,0,1\n';
    const s = S.parseScope(csv); check('scope: metadata lines skipped, header and time column found', s.timeFromColumn && s.channels.length === 2 && s.channels[0].name === 'CH1' && s.t.length === 5 && near(s.dt, 0.001, 1e-15) && s.skipped === 3); }
  { const s = S.parseScope('1\n2\n3\n4\n5\n', 0.5); check('scope: one column with a sample interval', !s.timeFromColumn && s.channels.length === 1 && s.t[4] === 2); }
  check('scope: no time and no interval refused', (() => { try { S.parseScope('3\n1\n2\n5\n'); return false; } catch (e) { return /sample interval/.test(e.message); } })());
  { const t = [0, 1, 2, 3, 4, 5, 6], y = [0, 0, 2, 2, 0, 0, 2]; check('scope: crossings with interpolation', S.crossings(t, y, 1, 0.1, 1).join() === '1.5,5.5' && S.crossings(t, y, 1, 0.1, -1).join() === '3.5'); }
};
