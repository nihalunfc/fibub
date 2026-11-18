// Checks for src/lib/audio/psola.ts (pitch shift that keeps the length) and src/lib/music/tune.ts (notes and
// correction for the pitch editor, #T1019). Run with `node tests/audio-psola.mjs`. Test sounds are made here.
import { pitchTrack, pitchMarks, psola, shiftCents } from '../src/lib/audio/psola.ts';
import { yin } from '../src/lib/audio/pitch.ts';
import { splitNotes, snapTarget, correction, detectKey } from '../src/lib/music/tune.ts';

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.log('FAIL  ' + msg); } else console.log('pass  ' + msg); };
const rate = 44100;
// A voiced tone: a pulse-like wave with 8 falling harmonics, like a sung vowel.
const voiced = (hzAt, secs) => {
  const n = Math.round(secs * rate), x = new Float32Array(n); let ph = 0;
  for (let i = 0; i < n; i++) { ph += (2 * Math.PI * hzAt(i / rate)) / rate; let v = 0; for (let h = 1; h <= 8; h++) v += Math.sin(h * ph) / h; x[i] = 0.25 * v; }
  return x;
};
const pitchOf = (x, t) => { const a = Math.round(t * rate); return yin(x.subarray(a, a + 4096), rate, 60, 1000).hz; };

// 220 Hz up 100 cents = 220 × 2^(1/12) = 233.08 Hz; length unchanged.
const x = voiced(() => 220, 1);
const up = shiftCents(x, rate, 100);
const f = pitchOf(up, 0.5);
check(Math.abs(f - 233.08) <= 1 && Math.abs(up.length / x.length - 1) <= 0.01, `220 Hz +100 cents measures 233.1 Hz ±1 (${f.toFixed(2)} Hz), length ${up.length} of ${x.length}`);
// Down 200 cents: 220 × 2^(-2/12) = 196.00 Hz.
const dn = shiftCents(x, rate, -200);
check(Math.abs(pitchOf(dn, 0.5) - 196.0) <= 1, `220 Hz -200 cents measures 196.0 Hz ±1 (${pitchOf(dn, 0.5).toFixed(2)})`);
// No shift: the sound comes back almost unchanged (RMS difference under 2% of the signal).
const same = shiftCents(x, rate, 0);
let d = 0, s = 0; for (let i = 2000; i < x.length - 2000; i++) { d += (same[i] - x[i]) ** 2; s += x[i] ** 2; }
check(Math.sqrt(d / s) < 0.02, `0 cents leaves the tone as it was (difference ${(100 * Math.sqrt(d / s)).toFixed(2)}%)`);
// Level kept: RMS after +100 cents within 1 dB.
let su = 0; for (let i = 2000; i < x.length - 2000; i++) su += up[i] ** 2;
check(Math.abs(10 * Math.log10(su / s)) < 1, `+100 cents keeps the level (${(10 * Math.log10(su / s)).toFixed(2)} dB)`);
// A shift that changes over time: first half +0, second half +300 cents (220 -> 261.63 Hz).
const tr = pitchTrack(x, rate);
const half = psola(x, rate, pitchMarks(x, rate, tr), (t) => (t < 0.5 ? 1 : 2 ** (3 / 12)));
check(Math.abs(pitchOf(half, 0.2) - 220) <= 1 && Math.abs(pitchOf(half, 0.75) - 261.63) <= 1.5, `time-varying shift: 220 then 261.6 Hz (${pitchOf(half, 0.2).toFixed(1)}, ${pitchOf(half, 0.75).toFixed(1)})`);

// ---- Notes and correction ----
// A3 sung 30 cents sharp for 0.5 s, silence 0.1 s, then C#4 sung 40 cents flat for 0.5 s (10 ms frames).
const hop = 0.01, A3s = 220 * 2 ** (30 / 1200), Cs4f = 277.18 * 2 ** (-40 / 1200);
const f0 = new Float32Array(110); for (let i = 0; i < 50; i++) f0[i] = A3s; for (let i = 60; i < 110; i++) f0[i] = Cs4f;
const notes = splitNotes(f0, hop);
check(notes.length === 2 && Math.abs(notes[0].midi - 57.3) < 0.01 && Math.abs(notes[1].midi - 60.6) < 0.01, `two notes found: ${notes.map((n) => n.midi.toFixed(2)).join(', ')} (57.30 and 60.60)`);
// In A major (tonic 9) both snap to the nearest scale note: A3 (57) and C#4 (61).
notes.forEach((n) => (n.target = snapTarget(n.midi, 9, [0, 2, 4, 5, 7, 9, 11])));
check(notes[0].target === 57 && notes[1].target === 61, `A major snaps to 57 and 61 (${notes.map((n) => n.target)})`);
// In C major the second note (60.6) goes to C4 (60) since C# is not in the scale... 60.6 is nearer 61 but 61 is out, so 60.
check(snapTarget(60.6, 0, [0, 2, 4, 5, 7, 9, 11]) === 60, `C major sends 60.6 to 60 (${snapTarget(60.6, 0, [0, 2, 4, 5, 7, 9, 11])})`);
// 100% strength, 0 ms retune: -30 cents on the first note, +40 on the second; 50% halves it.
const c100 = correction(f0, hop, notes, { strength: 1, retuneMs: 0, keepVibrato: true });
const c50 = correction(f0, hop, notes, { strength: 0.5, retuneMs: 0, keepVibrato: true });
check(Math.abs(c100[25] + 30) < 0.1 && Math.abs(c100[80] - 40) < 0.1 && Math.abs(c50[80] - 20) < 0.1 && c100[55] === 0, `correction -30 / +40 cents, 50% gives +20 (${c100[25].toFixed(1)}, ${c100[80].toFixed(1)}, ${c50[80].toFixed(1)})`);
// Retune time 50 ms: 50 ms into the note the correction has come about 63% of the way (one time constant).
const cs = correction(f0, hop, notes, { strength: 1, retuneMs: 50, keepVibrato: true });
check(Math.abs(cs[4] / -30 - 0.632) < 0.01 && Math.abs(cs[45] + 30) < 0.5, `retune 50 ms: ${(cs[4] / -30 * 100).toFixed(1)}% after 5 frames (50 ms), full by 450 ms`);
// Key detection from the notes of an A minor arpeggio and scale.
const am = [57, 60, 64, 57, 59, 60, 62, 64, 65, 64, 62, 60, 59, 57, 64, 57].map((m, i) => ({ a: i * 10, b: i * 10 + 9, midi: m, target: m, manual: false }));
const k = detectKey(am);
check(k && k.tonic === 9 && k.mode === 'minor', `detect key of an A minor tune: ${k && k.tonic + ' ' + k.mode}`);

console.log(fails ? `${fails} FAILED` : 'All psola checks passed');
process.exit(fails ? 1 : 0);
