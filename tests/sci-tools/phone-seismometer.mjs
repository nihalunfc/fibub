// #885 phone seismometer: resampling of uneven readings against numpy.interp, gravity removal (detrend, Tukey taper,
// Butterworth highpass or bandpass, zero phase) against SciPy 1.18 sosfiltfilt, PGA, horizontal and 3-D peaks, and
// the amplitude-spectrum peak bin against NumPy's rfft (chk885.py), all on the page's made-up demo recording.
import { demo, uniform, analyse, parseRecording, interp, rateOf, jitter, feel, G0 } from '../../src/lib/sci/phoneseis.ts';
import { readSac, writeSac } from '../../src/lib/sci/seisio.ts';

const EXP = {"rate": 62.5287632310863, "fs": 63, "n": 1890, "idx": [0, 100, 517, 1300, 1889], "U": {"x": [0.11953987480141222, 0.11850025513117593, 0.12136683985710174, 0.12096483105675784, 0.121397452814164], "y": [-0.0792502510547638, -0.07930776007891538, -0.08038770782060385, -0.07939143823577856, -0.07942763672266855], "z": [9.788738543987273, 9.790606431265363, 9.79135503206002, 9.788950670823654, 9.789038430262924]}, "hp05": {"pga_x": 0.18821175481036984, "ipga_x": 1328, "kdom_x": 101, "fbin_x": 3.10693359375, "pga_y": 0.09402199327589271, "ipga_y": 1327, "kdom_y": 390, "fbin_y": 11.9970703125, "pga_z": 0.31396409171738704, "ipga_z": 1327, "kdom_z": 103, "fbin_z": 3.16845703125, "vec": 0.37759877161246586, "hor": 0.21033553452763312, "samp": {"x": [-0.0015936784088834415, 0.0013339474969318629, -0.007417996265701385], "y": [0.0007407277924670739, -0.00021296119512930693, -0.0036416565282006617], "z": [0.0005928858797785609, 0.0013589344451217416, -0.01480047860777901]}}, "bp": {"pga_x": 0.17623975325345229, "ipga_x": 1328, "kdom_x": 101, "fbin_x": 3.10693359375, "pga_y": 0.08811118348844996, "ipga_y": 1328, "kdom_y": 390, "fbin_y": 11.9970703125, "pga_z": 0.29324844662572647, "ipga_z": 1328, "kdom_z": 103, "fbin_z": 3.16845703125, "vec": 0.3532968761975891, "hor": 0.19703814677004308, "samp": {"x": [-0.0010906521013731715, 0.0012140831508117358, -0.005147130427996499], "y": [0.001358668873673289, -0.00021990791676827868, -0.0021064909143115366], "z": [0.0007374001347143635, 0.0011178884645136858, -0.01074402000915861]}}};
const close = (a, b, tol) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));

export default async (check) => {
  const d = demo();
  check(`phone-seis: demo rate matches (${rateOf(d.t).toFixed(3)} readings/s)`, close(rateOf(d.t), EXP.rate, 1e-12));
  const r = uniform(d.t, d.x, d.y, d.z);
  check('phone-seis: even record (rate, length) and values match numpy.interp', r.fs === EXP.fs && r.x.length === EXP.n && ['x', 'y', 'z'].every((k) => EXP.idx.every((i, j) => close(r[k][i], EXP.U[k][j], 1e-12))));
  for (const [name, o] of [['hp05', { hp: 0.5, order: 2 }], ['bp', { hp: 1, lp: 20, order: 4 }]]) {
    const a = analyse(r, o), E = EXP[name];
    check(`phone-seis: ${name} cleaned samples match SciPy sosfiltfilt (1e-10)`, ['x', 'y', 'z'].every((k) => [100, 517, 1300].every((i, j) => Math.abs(a.comps[k][i] - E.samp[k][j]) < 1e-10)));
    check(`phone-seis: ${name} PGA per component and where (vs NumPy)`, a.per.every((p) => close(p.pga.a, E['pga_' + p.k], 1e-10) && p.pga.i === E['ipga_' + p.k]));
    check(`phone-seis: ${name} 3-D and horizontal peaks`, close(a.vec.a, E.vec, 1e-10) && close(a.hor.a, E.hor, 1e-10));
    check(`phone-seis: ${name} dominant frequency within one bin of NumPy's peak bin`, a.per.every((p) => Math.abs(p.dom.f - E['fbin_' + p.k]) <= p.sp.f[1]));
  }
  { const a = analyse(r, { hp: 0.5, order: 2 }); check(`phone-seis: demo dominant frequencies: door 3.2 Hz on z (${a.per[2].dom.f.toFixed(2)}), lorry 12 Hz on y (${a.per[1].dom.f.toFixed(2)})`, Math.abs(a.per[2].dom.f - 3.2) < 0.1 && Math.abs(a.per[1].dom.f - 12) < 0.05); }
  check('phone-seis: interp holds the ends and is linear between', (() => { const v = interp([0, 1, 3], [0, 10, 30], -1, 2, 10); return v[0] === 0 && v[3] === 5 && v[5] === 15 && v[9] === 30; })());
  { const j = jitter([0, 0.01, 0.03, 0.04]); check('phone-seis: jitter of the intervals', close(j.mean, 0.04 / 3, 1e-12) && close(j.max, 0.02, 1e-12)); }
  // Text recordings.
  const txt = 'time_ms\tx\ty\tz\n' + d.t.slice(0, 200).map((t, i) => `${t * 1000}\t${d.x[i]}\t${d.y[i]}\t${d.z[i]}`).join('\n');
  { const p = parseRecording(txt); check('phone-seis: CSV with a time column in ms read', p.t.length === 200 && close(p.t[199], d.t[199], 1e-12) && p.timed); }
  { const p = parseRecording('1 2 3\n'.repeat(50), 25); check('phone-seis: three columns with a given rate', p.t.length === 50 && close(p.t[49], 49 / 25, 1e-12) && !p.timed); }
  { let e = ''; try { parseRecording('1 2 3\n'.repeat(50)); } catch (er) { e = er.message; } check('phone-seis: three columns without a rate refused', e.includes('sampling rate')); }
  { let e = ''; try { uniform([0, 1, 1, 2, 3, 4, 5, 6], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0]); } catch (er) { e = er.message; } check('phone-seis: times that do not increase refused', e.includes('reading 3')); }
  // SAC export of the cleaned vertical, read back.
  { const a = analyse(r, { hp: 0.5, order: 2 }); const s = readSac(writeSac({ net: '', sta: 'PHONE', loc: '', cha: 'HNZ', start: Date.UTC(2026, 10, 9), fs: r.fs, data: a.comps.z }));
    check('phone-seis: SAC export round trip (float32)', s.fs === 63 && s.data.length === EXP.n && s.data.every((v, i) => v === Math.fround(a.comps.z[i]))); }
  check('phone-seis: shaking words scale with PGA', feel(0.0001).includes('not felt') && feel(0.32 / G0).includes('strong'));
};
