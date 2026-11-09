// #348 Spike train analyser: checked against an independent NumPy 2.5 calculation (np.diff, np.var, np.histogram).
import * as K from '../../src/lib/sci/spikes.ts';
import { rng } from '../../src/lib/sci/spectro.ts';
export default async (check) => {
  const rel = (a, b, t = 1e-12) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const tr = K.exampleTrains(), s = K.summarise(tr, 0, 2);
  check('spikes: mean rate, SD, mean and variance of counts = numpy', rel(s.meanRate, 12.7) && rel(s.sdRate, 2.4836306192007656) && rel(s.meanCount, 25.4) && rel(s.varCount, 24.673684210526314));
  check('spikes: Fano factor 0.97140 and pooled CV 1.62874 = numpy', rel(s.fano, 0.9714048901782014) && rel(s.cvPooled, 1.6287401178350271) && s.isiAll.length === 488 && s.refractoryViolations === 0);
  check('spikes: trial 1: 25 spikes, mean ISI, CV = numpy', s.trains[0].n === 25 && rel(s.trains[0].meanIsi, 0.07784166666666666) && rel(s.trains[0].cv, 1.4797775280653929));
  const p = K.psth(tr, 0, 2, 0.05);
  check('spikes: PSTH counts = np.histogram (40 bins)', p.counts.join(',') === '8,8,7,4,4,2,8,4,6,3,39,46,31,32,31,41,33,42,35,37,5,5,5,3,3,4,6,6,4,3,4,6,1,5,2,4,5,5,5,6' && p.rate[10] === 39);
  const a = K.autocorrelogram(tr, 0.05, 0.002);
  check('spikes: autocorrelogram = np.histogram of all pair differences, dead time empty', a.counts.join(',') === '30,27,25,24,24,29,30,27,21,23,29,24,31,26,26,28,31,29,17,26,28,26,29,16,0,0,12,32,27,28,26,17,29,31,28,26,26,31,24,29,23,21,27,30,29,24,24,25,27,30' && a.spikes === 508);
  check('spikes: ISI histogram = numpy', K.histogram(s.isiAll, 0, 0.5, 0.01).counts.join(',') === '94,95,66,40,32,28,17,17,8,7,6,7,5,1,5,6,3,4,3,1,3,1,1,4,0,3,1,4,2,0,0,0,2,1,1,3,2,0,0,0,1,1,0,3,1,2,0,1,1,1');
  const w = K.summarise(tr, 0.5, 1.0);
  check('spikes: stimulus window 0.5–1 s: rate 36.8, Fano 0.6773, CV 0.8629 = numpy', rel(w.meanRate, 36.8) && rel(w.fano, 0.6773455377574371) && rel(w.cvPooled, 0.8628582066842774));
  // A long Poisson train has CV ≈ 1 and counts with Fano ≈ 1.
  { const r = rng(5), trains = []; for (let k = 0; k < 200; k++) { const t = []; let x = 0; while ((x += -Math.log(1 - r()) / 20) < 10) t.push(x); trains.push({ name: '', t }); } const q = K.summarise(trains, 0, 10); check(`spikes: Poisson CV ≈ 1 (${q.cvPooled.toFixed(3)}), Fano ≈ 1 (${q.fano.toFixed(3)})`, Math.abs(q.cvPooled - 1) < 0.03 && Math.abs(q.fano - 1) < 0.25); }
  // numpy edge rule: the last bin includes its right edge.
  check('spikes: histogram right edge included, outside ignored', K.histogram([0, 0.1, 0.2, 1, 1.0001, -0.1], 0, 1, 0.5).counts.join() === '3,1');
  // Reading.
  check('spikes: one train per line, labels, ms', JSON.stringify(K.parseTrains('Cell A: 10 20, 35\n5;15', 'lines', 'ms')) === JSON.stringify([{ name: 'Cell A', t: [0.01, 0.02, 0.035] }, { name: 'Train 2', t: [0.005, 0.015] }]));
  check('spikes: label, time pairs with header', JSON.stringify(K.parseTrains('trial,time\n1,0.5\n2,0.1\n1,0.2', 'pairs')) === JSON.stringify([{ name: 'Train 1', t: [0.2, 0.5] }, { name: 'Train 2', t: [0.1] }]));
  check('spikes: one column per train, blanks skipped', JSON.stringify(K.parseTrains('a\tb\n0.1\t0.3\n0.2\t\n0.4\t', 'columns')) === JSON.stringify([{ name: 'a', t: [0.1, 0.2, 0.4] }, { name: 'b', t: [0.3] }]));
  let m = ''; try { K.parseTrains('0.1 x', 'lines'); } catch (e) { m = e.message; } check('spikes: bad number refused', m.includes('"x" is not a number'));
};
