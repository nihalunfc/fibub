// #421 tuning system and cents calculator. Pythagorean fractions and cents, quarter-comma meantone cents and the
// just-intonation reference pitches checked against an independent Python script (fractions + math); textbook facts:
// Pythagorean comma 23.46 ¢, syntonic comma 21.51 ¢, quarter-comma fifth = 5^(1/4) and pure major third 386.31 ¢.
import * as T from '../../src/lib/sci/tuning.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  check('tuning: cents of 3/2 = 701.955, 5/4 = 386.314; 100 ¢ = 2^(1/12)', near(T.cents(1.5), 701.9550008653874) && near(T.cents(1.25), 386.3137138648348) && near(T.ratioOf(100), 2 ** (1 / 12)));
  check('tuning: Pythagorean comma 23.460 ¢, syntonic comma 21.506 ¢', near(T.PYTHAGOREAN, 23.460010384649014) && near(T.SYNTONIC, 21.50628959671478));
  const py = T.degrees({ kind: 'pyth' });
  check('tuning: Pythagorean fractions E♭..G♯ match Python', py.map((d) => d.frac).join() === '1/1,2187/2048,9/8,32/27,81/64,4/3,729/512,3/2,6561/4096,27/16,16/9,243/128' && near(py[4].cents, 407.8200034615497) && near(py[11].cents, 1109.775004326937));
  check('tuning: Pythagorean wolf fifth G♯–E♭ is a comma short (678.49 ¢)', near(1200 + py[3].cents - py[8].cents, T.cents(1.5) - T.PYTHAGOREAN, 1e-9));
  const qc = T.degrees({ kind: 'meantone', frac: 0.25 });
  const pyc = [0, 76.04899926346116, 193.15685693241744, 310.2647146013737, 386.3137138648349, 503.4215715337913, 579.4705707972525, 696.5784284662087, 772.6274277296698, 889.7352853986263, 1006.8431430675826, 1082.8921423310435];
  check('tuning: quarter-comma meantone cents match Python', qc.every((d, i) => near(d.cents, pyc[i], 1e-8) && d.pc === i));
  check('tuning: quarter-comma fifth = 5^(1/4) and major third pure 5/4', near(qc[7].ratio, 5 ** 0.25, 1e-12) && near(qc[4].ratio, 1.25, 1e-12));
  check('tuning: 1/6-comma meantone fifth 698.37 ¢', near(T.degrees({ kind: 'meantone', frac: 1 / 6 })[7].cents, T.cents(1.5) - T.SYNTONIC / 6, 1e-9));
  check('tuning: meantone with 0 comma equals Pythagorean', T.degrees({ kind: 'meantone', frac: 0 }).every((d, i) => near(d.cents, py[i].cents, 1e-9)));
  const e19 = T.degrees({ kind: 'edo', n: 19 });
  check('tuning: 19-EDO has 19 steps of 63.158 ¢; step 5 is 315.79 ¢, nearest 6/5', e19.length === 19 && near(e19[1].cents, 1200 / 19) && T.nearestJust(e19[5].cents).ratio === '6/5' && near(T.nearestJust(e19[5].cents).dev, 315.7894736842105 - 315.64128700055255, 1e-9));
  check('tuning: 31-EDO step 25 approximates the harmonic seventh 7/4', T.nearestJust((1200 * 25) / 31).ratio === '7/4');
  check('tuning: with A4 = 440, C4 is 264 (just), 261.626 (12-TET), 260.741 (Pythagorean)', near(T.tonicHz({ kind: 'just' }, 0, 4, 9, 4, 440), 264) && near(T.tonicHz({ kind: 'edo', n: 12 }, 0, 4, 9, 4, 440), 261.6255653005986) && near(T.tonicHz({ kind: 'pyth' }, 0, 4, 9, 4, 440), 7040 / 27));
  check('tuning: tonic A4 from C5 = 523.25 in just intonation (C is 6/5 above A)', near(T.tonicHz({ kind: 'just' }, 9, 4, 0, 5, 523.25), 523.25 / 1.2, 1e-9));
  check('tuning: 19-EDO tonic takes its 12-TET pitch from the reference', near(T.tonicHz({ kind: 'edo', n: 19 }, 0, 4, 9, 4, 440), 261.6255653005986));
  const tb = T.table({ kind: 'just' }, 2, 293.3333333333333);
  check('tuning: just table on D: names, octave row, A = 440, F♯ −13.69 ¢ from 12-TET', tb.length === 13 && tb[0].name === 'D' && tb[12].name === 'D (octave)' && tb[7].name === 'A' && near(tb[7].hz, 440, 1e-9) && tb[4].name === 'F♯' && near(tb[4].dev12, -13.686286135165, 1e-9));
  { const t12 = T.table({ kind: 'edo', n: 12 }, 0, 261.6255653005986); check('tuning: 12-TET table has note names, zero deviation, A4 = 440', t12[9].name === 'A' && Math.abs(t12[9].hz - 440) < 1e-9 && t12.every((r) => Math.abs(r.dev12) < 1e-9) && t12[12].name === 'C (octave)'); }
  check('tuning: parseRatio reads 5/4, 3:2, 1.25 and 440 Hz; rejects junk', T.parseRatio('5/4') === 1.25 && T.parseRatio('3:2') === 1.5 && T.parseRatio('1,25') === 1.25 && T.parseRatio('440 Hz') === 440 && Number.isNaN(T.parseRatio('x')) && Number.isNaN(T.parseRatio('0')));
};
