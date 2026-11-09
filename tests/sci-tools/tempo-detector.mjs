// #423 rhythm and tempo detector. The onset envelope, onsets, autocorrelation and beat tracking checked against an
// independent NumPy implementation (rfft, convolve, dot products) on two noisy click tracks at 44.1 and 22.05 kHz
// (envelope and autocorrelation to 1e-13, identical onset and beat times); click tracks at known BPMs give back
// their tempo within 0.1 BPM and their click times within 10 ms.
import * as T from '../../src/lib/sci/tempo.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const sum = (a) => a.reduce((s, v) => s + v, 0);
  const A = T.clickTrack(44100, 12, 145.5, { offbeats: true, noise: 0.02, seed: 3 }), ea = T.onsetEnvelope(A.x, 44100);
  check('tempo: 44.1 kHz envelope matches NumPy (sum, sum of squares)', ea.env.length === 1030 && ea.n === 2048 && near(sum(ea.env), 59.30575438921749, 1e-9) && near(sum(ea.env.map((v) => v * v)), 37.596672398267856, 1e-9));
  const oa = T.onsets(ea, 0.1);
  check('tempo: 57 onsets (29 beats and 28 off-beats), 6th at 1.28871 s as NumPy', oa.length === 57 && near(oa[5].t, 1.2887074829931973, 1e-12));
  const ca = T.tempoCandidates(ea, 50, 220);
  check('tempo: autocorrelation at lag 50 matches NumPy', near(ca.acf[50] / ca.acf[0], -0.1610911445620275, 1e-12));
  check('tempo: 145.5 BPM with off-beats: beat level chosen, half tempo listed second', near(ca.cands[0].bpm, 145.5, 0.1) && near(ca.cands[1].bpm, 72.75, 0.1) && T.relation(ca.cands[1].bpm, ca.cands[0].bpm) === 'half');
  const ba = T.beats(ea, ca.cands[0].bpm);
  check('tempo: 29 beats, each within 10 ms of a click (NumPy gives the same times)', ba.length === 29 && ba.every((b) => A.times.some((t) => Math.abs(t - b) < 0.01)) && near(ba[28], 11.795736961451247, 1e-12));
  const B = T.clickTrack(22050, 12, 97, { accentEvery: 3, noise: 0.01, seed: 9 }), eb = T.onsetEnvelope(B.x, 22050);
  check('tempo: 22.05 kHz envelope (1024-point frames) matches NumPy', eb.n === 1024 && near(sum(eb.env), 21.57821895913139, 1e-9) && near(sum(eb.env.map((v) => v * v)), 11.350208054948716, 1e-9));
  const ob = T.onsets(eb, 0.1), cb = T.tempoCandidates(eb, 50, 220);
  check('tempo: 97 BPM: 19 onsets as NumPy, tempo 97.01', ob.length === 19 && near(ob[5].t, 3.343673469387755, 1e-12) && near(cb.acf[50] / cb.acf[0], -0.03006611277323155, 1e-12) && near(cb.cands[0].bpm, 97, 0.05));
  for (const [bpm, o] of [[60, {}], [90, {}], [120, { accentEvery: 4 }], [174, { noise: 0.02 }], [200, {}]]) {
    const c = T.clickTrack(44100, 20, bpm, o), e = T.onsetEnvelope(c.x, 44100), on = T.onsets(e, 0.1), cand = T.tempoCandidates(e, 50, 220).cands;
    check(`tempo: click track at ${bpm} BPM: tempo within 0.1, every click found within 10 ms`, near(cand[0].bpm, bpm, 0.1) && c.times.every((t) => on.some((p) => Math.abs(p.t - t) < 0.01)));
  }
  { const c = T.clickTrack(44100, 16, 104, { accentEvery: 4, offbeats: true, noise: 0.01, seed: 5 }), e = T.onsetEnvelope(c.x, 44100), r = T.tempoCandidates(e, 60, 200).cands;
    check('tempo: off-beat clicks at 208 BPM are outside 60-200, so 104 is found; candidates stay in range', near(r[0].bpm, 104, 0.1) && r.every((x) => x.bpm >= 60 && x.bpm <= 200) && T.beats(e, r[0].bpm).length === 28); }
  check('tempo: relation names', T.relation(240, 120) === 'double' && T.relation(80, 120) === '2/3' && T.relation(40, 120) === 'third' && T.relation(130, 120) === '');
  check('tempo: autocorrelation of a constant is zero', T.autocorr(new Float64Array(10).fill(2), 3).every((v) => v === 0));
  check('tempo: silence gives no onsets or candidates', (() => { const e = T.onsetEnvelope(new Float64Array(44100), 44100); return T.onsets(e).length === 0 && T.tempoCandidates(e).cands.length === 0; })());
};
