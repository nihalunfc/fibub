// Checks for the music kit in src/lib/music/ (theory.ts and analyse.ts). Run with `node tests/music.mjs`.
// Test audio is made here (clicks and synth chords); no audio files are committed.
import * as T from '../src/lib/music/theory.ts';
import { analyseTrack, onsetEnvelope, estimateTempo, onsetTimes, decimate } from '../src/lib/music/analyse.ts';
import { clickTrack } from '../src/lib/audio/synth.ts';

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.log('FAIL  ' + msg); } };

// ---- Theory ----
// The wheel as DJs print it (8B = C major, 8A = A minor; one step = a fifth).
const WHEEL = { '1B': 'B', '2B': 'F#', '3B': 'Db', '4B': 'Ab', '5B': 'Eb', '6B': 'Bb', '7B': 'F', '8B': 'C', '9B': 'G', '10B': 'D', '11B': 'A', '12B': 'E',
  '1A': 'G#m', '2A': 'Ebm', '3A': 'Bbm', '4A': 'Fm', '5A': 'Cm', '6A': 'Gm', '7A': 'Dm', '8A': 'Am', '9A': 'Em', '10A': 'Bm', '11A': 'F#m', '12A': 'C#m' };
for (const [code, name] of Object.entries(WHEEL)) {
  const k = T.parseKey(code), k2 = T.parseKey(name);
  check(k && k2 && T.keyEq(k, k2) && T.camelot(k) === code && T.keyName(k, 'short', true) === name, `wheel ${code} = ${name} (${k && T.keyName(k, 'short', true)})`);
  const ok = T.openKey(k), back = T.parseKey(ok);
  check(T.keyEq(back, k), `open key round trip ${code} -> ${ok}`);
}
check(T.openKey(T.parseKey('C')) === '1d' && T.openKey(T.parseKey('Am')) === '1m' && T.openKey(T.parseKey('G')) === '2d' && T.openKey(T.parseKey('F')) === '12d', 'open key: C 1d, Am 1m, G 2d, F 12d');
check(T.camelot(T.parseKey('E♭ minor')) === '2A' && T.camelot(T.parseKey('F♯ major')) === '2B' && T.camelot(T.parseKey('bbm')) === '3A', 'key names with signs and lowercase');

const C = (a, b) => T.compatibility(T.parseKey(a), T.parseKey(b));
check(C('8A', '8A').tier === 'perfect' && C('8A', '8A').score === 100, 'same key is perfect');
check(C('8A', '9A').score === 90 && C('8A', '7A').score === 90 && C('8A', '8B').label === 'Relative major', '±1 and relative are perfect');
check(C('8A', '9B').label === 'Diagonal step' && C('8B', '7A').label === 'Diagonal step', 'diagonal steps');
check(C('8A', '10A').label.startsWith('Energy boost') && C('12B', '2B').label.startsWith('Energy boost'), '+2 energy boost (wraps 12 -> 2)');
check(C('8B', '3B').label.includes('up a semitone') && T.keyName(T.parseKey('3B')) === 'D♭ major', '+7 = up a semitone (C -> D♭)');
check(C('8A', '2A').tier === 'risky' && C('8A', '2A').score < 50, 'tritone away is risky');
check(T.compatibleKeys(T.parseKey('8A')).length === 9, 'nine keys score 50+ from 8A');

check(T.transposeChord('F#m7/C#', 2) === 'G#m7/D#', 'F#m7/C# up 2 = G#m7/D#');
check(T.transposeChord('F#m7/C#', 2, T.parseKey('Eb')) === 'Abm7/Eb', 'spelled by key E♭: Abm7/Eb');
check(T.transposeChord('Bbmaj7', 2) === 'Cmaj7' && T.transposeChord('Bb', 1) === 'B' && T.transposeChord('Eb', 1) === 'E', 'flat chords');
check(T.transposeChord('C', -1) === 'B' && T.transposeChord('Dm7b5', 5) === 'Gm7b5' && T.transposeChord('H', 1) === null, 'more chords');
check(T.transposeText('Am F C G/B', 3, T.parseKey('Cm')) === 'Cm Ab Eb Bb/D', 'transpose a line into C minor');
check(T.diatonicChords(T.parseKey('C')).map((d) => d.roman + d.symbol).join(' ') === 'IC iiDm iiiEm IVF VG viAm vii°Bdim', 'C major triads');
check(T.diatonicChords(T.parseKey('Am'), true, true).map((d) => d.roman).join(' ') === 'i7 iiø7 III7 iv7 V7 VI7 VII7', 'A minor sevenths with harmonic V7');
check(T.chordPcs('G7').join() === '7,11,2,5' && T.chordPcs('Cadd9').join() === '0,4,7,2', 'chord notes');
check(T.scalePcs(9, 'blues').join() === '9,0,2,3,4,7', 'A blues scale');
check(Math.abs(T.midiToFreq(60) - 261.6256) < 1e-3 && Math.abs(T.midiToFreq(69, 432) - 432) < 1e-9 && T.parseMidi('B#3') === 60 && T.midiName(61, true) === 'Db4', 'MIDI and frequency');
check(Math.abs(T.tempoSemitones(120, 126) - 0.8447) < 1e-3 && Math.abs(T.tempoSemitones(128, 64) + 12) < 1e-9, '12·log2(new/old)');
check(T.camelot(T.keyAfterTempo(T.parseKey('Am'), 120, 127.2).key) === '3A', 'A minor sped 6% plays as B♭ minor (3A)');

// ---- Analysis ----
// Click track at 128 BPM, 64 beats, 44.1 kHz.
const RATE = 44100;
const clicks = clickTrack(128, 4, 1, 16, RATE);
let t0 = Date.now();
const a1 = analyseTrack([clicks], RATE);
check(Math.abs(a1.bpm - 128) <= 0.5, `click track 128 BPM -> ${a1.bpm}`);
check(a1.altBpm === 64 || a1.altBpm === 256, `half/double alternative (${a1.altBpm})`);
check(a1.firstBeat < 0.03, `first beat at 0 s (${a1.firstBeat.toFixed(3)})`);
check(Math.abs(a1.onsets.length - 64) <= 1 && Math.abs(a1.onsets[10] - 10 * 60 / 128) < 0.02, `64 onsets, 11th at 4.6875 s (${a1.onsets.length}, ${a1.onsets[10]?.toFixed(3)})`);
// Other tempos (48 kHz), including one with a fraction.
for (const bpm of [92, 140.5, 174]) {
  const x = clickTrack(bpm, 4, 1, 24, 48000), d = decimate(x, 48000), t = estimateTempo(onsetEnvelope(d.x, d.rate));
  check(Math.abs(t.bpm - bpm) <= 0.3, `click track ${bpm} BPM -> ${t.bpm} (alt ${t.alt}, conf ${t.confidence})`);
}

// Synth chords: each note a few harmonics (1, 1/2, 1/3), plus a bass root.
const synth = (chords, secs, rate = RATE) => {
  const n = Math.round(chords.length * secs * rate), out = new Float32Array(n);
  chords.forEach((midis, ci) => {
    const s0 = Math.round(ci * secs * rate), len = Math.round(secs * rate);
    for (const m of midis) {
      const f = 440 * 2 ** ((m - 69) / 12);
      for (let h = 1; h <= 3; h++) for (let i = 0; i < len; i++) {
        const t = i / rate, env = Math.min(1, i / (0.01 * rate)) * Math.exp(-t * 0.8);
        out[s0 + i] += (0.08 / h) * env * Math.sin(2 * Math.PI * f * h * t);
      }
    }
  });
  return out;
};
// A minor: Am - Dm - E - Am - F - Dm - E - Am (bass roots an octave below).
const AM = [[45, 57, 60, 64], [50, 62, 65, 69], [40, 56, 59, 64], [45, 57, 60, 64], [41, 57, 60, 65], [50, 62, 65, 69], [40, 56, 59, 64], [45, 57, 60, 64]];
const a2 = analyseTrack([synth(AM, 2)], RATE);
check(a2.key && T.keyName(a2.key.key) === 'A minor' && a2.key.camelot === '8A', `A minor progression -> ${a2.key && T.keyName(a2.key.key)} ${a2.key?.camelot} (conf ${a2.key?.confidence}, runner-up ${a2.key && T.keyName(a2.key.runnerUp.key)})`);
// C major scale over a C drone: C D E F G A B C, each 0.5 s, with C2 + C3 + G3 held.
const CM = [60, 62, 64, 65, 67, 69, 71, 72, 71, 69, 67, 65, 64, 62, 60, 64, 67, 72].map((m) => [36, 48, 55, m]);
const a3 = analyseTrack([synth(CM, 0.5)], RATE);
check(a3.key && T.keyName(a3.key.key) === 'C major' && a3.key.camelot === '8B', `C major scale -> ${a3.key && T.keyName(a3.key.key)} (conf ${a3.key?.confidence})`);
// Loudness and energy: a quiet copy rates lower than a loud one.
const loud = synth(AM, 2), quiet = loud.map((v) => v * 0.1);
const eL = analyseTrack([loud], RATE).energy, eQ = analyseTrack([quiet], RATE).energy;
check(eL > eQ && eL >= 1 && eL <= 10 && eQ >= 1, `energy: louder copy rates higher (${eL} vs ${eQ})`);

// Speed: 7 minutes of stereo 44.1 kHz in well under 10 s here.
const long = new Float32Array(RATE * 420); for (let i = 0; i < long.length; i += clicks.length) long.set(clicks.subarray(0, Math.min(clicks.length, long.length - i)), i);
t0 = Date.now(); const a4 = analyseTrack([long, long], RATE); const ms = Date.now() - t0;
check(ms < 10000 && Math.abs(a4.bpm - 128) <= 0.5, `7-minute stereo track in ${ms} ms, ${a4.bpm} BPM`);

console.log(fails ? `music: ${fails} failed` : 'music: all checks passed');
process.exit(fails ? 1 : 0);
