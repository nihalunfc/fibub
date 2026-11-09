// #938 room acoustics: modes and Sabine/Eyring, checked against an independent NumPy implementation
// (itertools mode search; ISO 9613-1 absorption formula written separately; the formula itself was checked
// privately against the standard's printed attenuation values).
import { roomModes, modeCount, reverb, criticalDistance } from '../../src/lib/sci/phroom.ts';
import { airAbsorption, soundSpeed, mFromAlpha } from '../../src/lib/sci/phair.ts';
export default async (check) => {
  const near = (a, b, rel = 1e-9) => Math.abs(a - b) <= rel * Math.max(1, Math.abs(b));
  for (const [f, t, rh, p, a] of [[1000, 20, 50, 101.325, 0.004664731873821476], [4000, 20, 50, 101.325, 0.029665528426392612], [125, 0, 30, 101.325, 0.0004655122890889773], [8000, 30, 90, 90, 0.054918064720468486], [500, -10, 60, 101.325, 0.00321293403207802], [2000, 15, 10, 101.325, 0.04939031782148015]])
    check(`air absorption ISO 9613-1 formula ${f} Hz ${t} °C ${rh} % ${p} kPa`, near(airAbsorption(f, t, rh, p).alpha, a, 1e-9));
  check('speed of sound 20 °C 343.2 m/s', near(soundSpeed(20), 343.2146, 1e-5));
  check('m from α: 4.343 dB per neper of intensity', near(mFromAlpha(4.3429448), 1, 1e-6));
  const c = soundSpeed(20), { modes } = roomModes(5, 4, 2.5, c, 200);
  check('room modes: 65 modes to 200 Hz in 5 × 4 × 2.5 m (NumPy)', modes.length === 65);
  check('room modes: 11 axial, 32 tangential, 22 oblique', modes.filter((m) => m.type === 'axial').length === 11 && modes.filter((m) => m.type === 'tangential').length === 32 && modes.filter((m) => m.type === 'oblique').length === 22);
  check('room modes: first is (1,0,0) at 34.32 Hz', modes[0].n.join() === '1,0,0' && near(modes[0].f, 34.321462268256795, 1e-12));
  check('room modes: (1,1,0) at 54.94 Hz', near(modes[2].f, 54.94114672850302, 1e-12) && modes[2].type === 'tangential');
  check('room modes: limit keeps the lowest', roomModes(5, 4, 2.5, c, 200, 10).modes.length === 10 && roomModes(5, 4, 2.5, c, 200, 10).cut);
  check('smoothed mode count close to the real count at 200 Hz', Math.abs(modeCount(5, 4, 2.5, c, 200) - 65) < 8);
  const al = { floor: [0.02, 0.03, 0.04, 0.05, 0.05, 0.05], ceil: [0.15, 0.25, 0.4, 0.55, 0.6, 0.6], wall: [0.1, 0.08, 0.06, 0.05, 0.05, 0.05] };
  const r = reverb(5, 4, 2.5, [{ name: 'f', area: 20, alpha: al.floor }, { name: 'c', area: 20, alpha: al.ceil }, { name: 'e', area: 20, alpha: al.wall }, { name: 's', area: 25, alpha: al.wall }], [1, 2, 3, 3.5, 4, 4], 20, 50);
  const ref = [[125, 8.9, 0.9025140594071427, 0.8544974284504832], [250, 11.2, 0.7149580587515005, 0.6669870099595432], [500, 14.5, 0.550448147679091, 0.5024150140528635], [1000, 17.75, 0.44813442798409536, 0.4000378731304513], [2000, 19.25, 0.4085524269551321, 0.36129779742877655], [4000, 19.25, 0.39050232797150825, 0.347109195674706]];
  ref.forEach(([f, A, s, e], i) => check(`reverb ${f} Hz: A ${A} m², Sabine ${s.toFixed(3)} s, Eyring ${e.toFixed(3)} s (NumPy)`, near(r.bands[i].A, A, 1e-12) && near(r.bands[i].sabine, s, 1e-9) && near(r.bands[i].eyring, e, 1e-9)));
  check('Sabine constant 0.161 at 20 °C', Math.abs(r.k - 0.161) < 0.0005);
  check('mean free path 4V/S', near(r.mfp, 200 / 85, 1e-12));
  check('Eyring ≤ Sabine always', r.bands.every((b) => b.eyring < b.sabine));
  check('Eyring = Sabine for small α (limit)', (() => { const q = reverb(5, 4, 2.5, [{ name: 'a', area: 85, alpha: [1e-4, 1e-4, 1e-4, 1e-4, 1e-4, 1e-4] }], [0, 0, 0, 0, 0, 0], 20, 50, 101.325, false); return Math.abs(q.bands[0].eyring / q.bands[0].sabine - 1) < 1e-4; })());
  check('critical distance √(QR/16π)', near(criticalDistance(16 * Math.PI, 2), Math.SQRT2, 1e-12));
};
