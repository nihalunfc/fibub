// Pitch contour tracker: YIN checked frame by frame against an independent numpy implementation of
// de Cheveigné and Kawahara (2002) on tones and an exponential glide; both methods against the true pitch.
import * as P from '../../src/lib/sci/pitch.ts';

export default async (check) => {
  const fs = 16000, near = (a, b, tol) => a != null && Math.abs(a - b) <= tol;
  const tone = (f) => Array.from({ length: 8000 }, (_, i) => 0.5 * Math.sin(2 * Math.PI * f * i / fs) + 0.2 * Math.sin(2 * Math.PI * 2 * f * i / fs + 0.3));
  const numpy = { 100: 99.99959895218348, 155.5: 155.50667887595205, 220: 220.0149169945626, 333.3: 333.3670183373817 };
  let ok = true, okA = true;
  for (const [f, ref] of Object.entries(numpy)) {
    const y = P.pitchStats(P.pitchTrack(tone(+f), fs).f0, 100), a = P.pitchStats(P.pitchTrack(tone(+f), fs, { method: 'acf' }).f0, 100);
    if (!(y && y.n === 48 && near(y.median, ref, 1e-9))) ok = false;
    if (!(a && a.n === 48 && Math.abs(a.median / +f - 1) < 1e-3)) okA = false;
  }
  check('pitch: YIN medians on four tones match numpy to 1e-9 Hz', ok);
  check('pitch: autocorrelation within 0.1 % on four tones', okA);
  const k = Math.log(2), g = Array.from({ length: 16000 }, (_, i) => 0.5 * Math.sin(2 * Math.PI * 120 * (Math.exp(k * i / fs) - 1) / k));
  const tr = P.pitchTrack(g, fs);
  check('pitch: YIN glide frames match numpy', tr.f0.length === 98 && [[0, 120.92605361034278], [30, 148.77449301861517], [60, 183.0834271386322], [97, 236.5290198210415]].every(([i, v]) => near(tr.f0[i], v, 1e-9)));
  const relMax = (t) => Math.max(...t.f0.map((f, i) => (f == null ? 1 : Math.abs(f / (120 * Math.exp(k * t.t[i])) - 1))));
  check('pitch: YIN follows a 120 to 240 Hz glide within 0.5 %', relMax(tr) < 0.005);
  check('pitch: autocorrelation follows the glide within 0.5 % (no octave errors)', relMax(P.pitchTrack(g, fs, { method: 'acf' })) < 0.005);
  // A made-up voice: a falling statement, a pause, a rising question, at 44.1 kHz (resampled to 16 kHz).
  const f0 = (t) => (t < 0.1 ? 0 : t < 1.0 ? 180 * (120 / 180) ** ((t - 0.1) / 0.9) : t < 1.25 ? 0 : t < 2.05 ? 130 * (220 / 130) ** ((t - 1.25) / 0.8) : 0);
  for (const m of ['yin', 'acf']) {
    const v = P.pitchTrack(P.synthVoice(f0, 2.15, 44100), 44100, { method: m });
    let bad = 0, falseV = 0, miss = 0;
    v.t.forEach((t, i) => { const ds = [-0.03, 0, 0.03]; if (ds.some((d) => f0(t + d) === 0) && ds.some((d) => f0(t + d) > 0)) return; /* frames across an edge */ const f = v.f0[i]; if (f0(t) > 0) { if (f == null) miss++; else if (Math.abs(f / f0(t) - 1) > 0.02) bad++; } else if (f != null) falseV++; });
    check(`pitch: ${m} on a made-up voice, every frame within 2 %, pauses unvoiced (${bad} off, ${miss} missed, ${falseV} false)`, bad === 0 && miss === 0 && falseV === 0 && v.fs === 16000);
  }
  check('pitch: no voice in noise-free silence', P.pitchTrack(new Float64Array(8000), fs).f0.every((f) => f == null));
  const sm = P.medianSmooth([100, 200, 100, null, 50, 60, 55], 3);
  check('pitch: median smoothing stays inside voiced stretches', JSON.stringify(sm) === JSON.stringify([150, 100, 150, null, 55, 55, 57.5]));
  check('pitch: semitones', near(P.semitones(200, 100), 12, 1e-12) && near(P.semitones(100 * 2 ** (1 / 12), 100), 1, 1e-12));
  const st = P.pitchStats([100, null, 200, 400], 100);
  check('pitch: summary statistics', st.n === 3 && near(st.voiced, 0.75, 1e-12) && near(st.rangeSt, 24, 1e-9) && near(st.stMean, 12, 1e-9) && near(st.median, 200, 0));
  let msg = ''; try { P.pitchTrack(tone(100), fs, { fmin: 300, fmax: 200 }); } catch (e) { msg = e.message; }
  check('pitch: impossible range explained', /lowest pitch/.test(msg));
};
