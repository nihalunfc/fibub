// #1128 Nerve impulse. The spike comes from fibub's Hodgkin-Huxley code (hhsim.ts); here its peak and sodium
// current for a 1 ms pulse were checked against a separate Python RK4 version (6 µA/cm²: no spike, peak −59.89 mV;
// 7: spike, peak 34.98 mV, largest inward Na⁺ current −746.5 µA/cm²; 10: peak 39.07 mV, −787.7). Speeds follow
// the rules of thumb v ≈ √d (unmyelinated) and v ≈ 6d (myelinated, Hursh 1939); reaction-time stats by hand.
import { simulate } from '../../src/lib/sci/hhsim.ts';
import { speed, travelMs, position, ionCurrents, stats } from '../../src/lib/sci/nerve.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const pulse = (amp) => simulate({ kind: 'step', amp, start: 1, dur: 1 }, 20, undefined, 0.01, 1);
  const py = [[6, -59.8873752, -6.07466], [7, 34.9771698, -746.46919], [10, 39.0724069, -787.67785]];
  check('nerve: spike peak and Na current match Python', py.every(([a, peak, ina]) => { const r = pulse(a), c = ionCurrents(r); return near(r.peak, peak, 1e-4) && near(Math.min(...c.iNa), ina, 0.05); }));
  check('nerve: all or none', pulse(6).spikes.length === 0 && pulse(7).spikes.length === 1 && pulse(20).spikes.length === 1);
  const r = pulse(10), c = ionCurrents(r);
  check('nerve: Na channels open before K channels', c.gNa.indexOf(Math.max(...c.gNa)) + 30 < c.gK.indexOf(Math.max(...c.gK)) && Math.max(...c.iK) > 0 && Math.min(...c.iNa) < 0);
  check('nerve: at rest the currents nearly cancel', Math.abs(c.iNa[0] + c.iK[0] + 0.3 * (r.V[0] + 54.387)) < 0.01);
  check('nerve: speeds', near(speed(1, false), 1) && near(speed(4, false), 2) && near(speed(10, true), 60));
  check('nerve: travel time', near(travelMs(1, 60), 1000 / 60) && near(travelMs(0.1, 1), 100));
  check('nerve: smooth vs node-to-node', near(position(5, 1, false), 0.005) && near(position(0.0249, 60, true), 0.001) && near(position(0.05, 60, true), 0.003) && position(-1, 5, false) === 0);
  const s = stats([250, 200, 300, 220]);
  check('nerve: reaction-time stats', s.n === 4 && near(s.mean, 242.5) && near(s.median, 235) && s.best === 200 && Number.isNaN(stats([]).mean) && stats([5, 1, 3]).median === 3);
};
