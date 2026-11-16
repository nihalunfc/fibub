// Checks for the shared sound kit in src/lib/audio/ (G.711, WAV, resampling). Run with `node tests/audio.mjs`.
// G.711 is checked against every 16-bit value in the ITU-T G.711 rules' known points and, when ffmpeg is installed, byte for byte against ffmpeg.
import { linearToUlaw, ulawToLinear, linearToAlaw, alawToLinear } from '../src/lib/audio/g711.ts';
import { writeWav, readWav, readRaw, resample, toPhone, phoneFile, normalise, peakOf, wavInfo } from '../src/lib/audio/pcm.ts';
import { tone as synthTone, sweep, noise, dtmf, signal, goertzel, DTMF, beatPlan, clickTrack, tempoName } from '../src/lib/audio/synth.ts';
import { readAu, guessRaw, joinSounds } from '../src/lib/audio/pcm.ts';
import { kWeighting, measure, planGain } from '../src/lib/audio/loudness.ts';
import { yin, nearestNote } from '../src/lib/audio/pitch.ts';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.log('FAIL  ' + msg); } };

// Known points (ITU-T G.711 tables): silence and full scale.
check(linearToUlaw(0) === 0xff && ulawToLinear(0xff) === 0, 'u-law: 0 <-> 0xFF');
check(linearToUlaw(32767) === 0x80 && ulawToLinear(0x80) === 32124, 'u-law: full scale <-> 0x80 (32124)');
check(linearToUlaw(-32768) === 0x00 && ulawToLinear(0x00) === -32124, 'u-law: negative full scale <-> 0x00');
check(linearToAlaw(0) === 0xd5 && alawToLinear(0xd5) === 8, 'A-law: 0 -> 0xD5 -> +8');
check(linearToAlaw(32767) === 0xaa && alawToLinear(0xaa) === 32256, 'A-law: full scale <-> 0xAA (32256)');
// Every code decodes and encodes back to itself (except u-law negative zero 0x7F, which encodes as 0xFF).
for (let c = 0; c < 256; c++) {
  if (c !== 0x7f && linearToUlaw(ulawToLinear(c)) !== c) { check(false, `u-law round trip ${c}`); break; }
  if (linearToAlaw(alawToLinear(c)) !== c) { check(false, `A-law round trip ${c}`); break; }
}

// Byte-for-byte against ffmpeg's pcm_mulaw and pcm_alaw on every 16-bit value.
let ff = false; try { execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }); ff = true; } catch {}
if (ff) {
  const dir = mkdtempSync(tmpdir() + '/fibub-audio-'), pcm = Buffer.alloc(65536 * 2);
  for (let i = 0; i < 65536; i++) pcm.writeInt16LE(i - 32768, i * 2);
  writeFileSync(dir + '/in.raw', pcm);
  // ffmpeg rounds to the nearest level where the ITU/Sun reference (and sox) cut down, so the two may pick
  // neighbouring codes at a boundary: decoding must match exactly, encoding to within one code.
  for (const [codec, enc, dec] of [['pcm_mulaw', linearToUlaw, ulawToLinear], ['pcm_alaw', linearToAlaw, alawToLinear]]) {
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 's16le', '-ar', '8000', '-ac', '1', '-i', dir + '/in.raw', '-f', codec.slice(4), '-c:a', codec, dir + '/out.raw']);
    const ref = readFileSync(dir + '/out.raw');
    writeFileSync(dir + '/codes.raw', Buffer.from(Array.from({ length: 256 }, (_, i) => i)));
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', codec.slice(4), '-ar', '8000', '-ac', '1', '-i', dir + '/codes.raw', '-f', 's16le', dir + '/dec.raw']);
    const d = readFileSync(dir + '/dec.raw');
    let badDec = 0; for (let c = 0; c < 256; c++) if (d.readInt16LE(c * 2) !== dec(c)) badDec++;
    check(badDec === 0, `${codec}: decoding matches ffmpeg for all 256 codes (${badDec} differ)`);
    let far = 0, near = 0;
    for (let i = 0; i < 65536; i++) {
      const o = enc(i - 32768); if (o === ref[i]) continue;
      near++; const step = Math.abs(dec(o) - dec(ref[i])), x = i - 32768;
      if (Math.abs(dec(o) - x) > step || Math.abs(dec(ref[i]) - x) > step) far++;
    }
    check(far === 0 && near < 1500, `${codec}: encoding matches ffmpeg within one level (${near} boundary values differ, ${far} by more)`);
  }
  // ffmpeg reads our u-law WAV with the right header.
  const x = new Float32Array(8000).map((_, i) => 0.5 * Math.sin(2 * Math.PI * 1000 * i / 8000));
  writeFileSync(dir + '/u.wav', writeWav([x], 8000, 7));
  const probe = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_name,sample_rate,channels,duration', '-of', 'csv=p=0', dir + '/u.wav']).toString().trim();
  check(probe.startsWith('pcm_mulaw,8000,1,1.0'), `ffprobe reads the u-law WAV (${probe})`);
} else console.log('note: ffmpeg not installed, skipped the byte-for-byte G.711 check');

// WAV write -> read round trips.
const tone = (f, rate, secs, a = 0.5) => new Float32Array(Math.round(rate * secs)).map((_, i) => a * Math.sin(2 * Math.PI * f * i / rate));
const t = tone(440, 44100, 0.1);
for (const fmt of [1, 6, 7]) {
  const back = readWav(writeWav([t, t], 44100, fmt).buffer);
  const err = back ? Math.max(...back.chans[1].map((v, i) => Math.abs(v - t[i]))) : 9;
  check(back && back.rate === 44100 && back.chans.length === 2 && err < (fmt === 1 ? 1e-4 : 0.02), `WAV format ${fmt} round trip (max error ${err})`);
}
{ const b24 = readWav(writeWav([t], 44100, 1, 24).buffer); const e24 = Math.max(...b24.chans[0].map((v, i) => Math.abs(v - t[i]))); check(e24 < 1e-6, `24-bit WAV round trip (${e24})`); }
check(wavInfo(new ArrayBuffer(10)) === null && readWav(new Uint8Array(64).buffer) === null, 'not a WAV: null');
check(readRaw(new Uint8Array([0x00, 0x40, 0x00, 0xc0]), 'sln').join() === '0.5,-0.5', 'raw .sln is little-endian 16-bit');

// Resampling: a 1 kHz tone keeps its level; a 6 kHz tone (above the 4 kHz phone limit) is removed, not folded to 2 kHz.
const rms = (x) => Math.sqrt(x.reduce((s, v) => s + v * v, 0) / x.length);
const mid = (x) => x.slice(200, x.length - 200);
const a = resample(tone(1000, 44100, 1), 44100, 8000, 0.9), b = resample(tone(6000, 44100, 1), 44100, 8000, 0.9);
check(a.length === 8000 && Math.abs(rms(mid(a)) - 0.5 / Math.SQRT2) < 0.005, `resample 44.1k -> 8k keeps a 1 kHz tone (rms ${rms(mid(a)).toFixed(4)})`);
check(rms(mid(b)) < 0.003, `resample removes a 6 kHz tone instead of aliasing it (rms ${rms(mid(b)).toFixed(5)})`);
const up = resample(tone(1000, 8000, 0.5), 8000, 48000);
check(up.length === 24000 && Math.abs(rms(mid(up)) - 0.5 / Math.SQRT2) < 0.005, 'resample 8k -> 48k keeps a 1 kHz tone');

// Phone pipeline: stereo 48 kHz, 2 s -> 16,000 u-law bytes, peak at -3 dB.
const p = toPhone({ rate: 48000, chans: [tone(440, 48000, 2, 0.2), tone(440, 48000, 2, 0.2)] }, { normaliseDb: -3 });
check(p.length === 16000 && Math.abs(peakOf(p) - Math.pow(10, -3 / 20)) < 1e-4, 'toPhone: 2 s -> 16,000 samples, peak -3 dBFS');
check(phoneFile(p, 'ulaw').length === 16000 && phoneFile(p, 'sln').length === 32000, 'raw .ulaw is 1 byte and .sln 2 bytes per sample');
const w = wavInfo(phoneFile(p, 'wav-ulaw').buffer);
check(w && w.format === 7 && w.rate === 8000 && w.channels === 1 && w.bits === 8 && w.dataBytes === 16000, 'u-law WAV header: format 7, 8 kHz, mono, 8-bit');
check(normalise(new Float32Array(4), -1) === 1, 'normalise leaves silence alone');

// Synth: tone frequency and level, DTMF pairs, cadences, noise level.
const t1 = synthTone('sine', 1000, 1, 8000, 0.5);
check(Math.abs(goertzel(t1.subarray(100, 7900), 1000, 8000) - 0.5) < 0.01 && goertzel(t1.subarray(100, 7900), 1200, 8000) < 0.01, 'tone: 1 kHz sine at 0.5');
const sq = synthTone('square', 100, 1, 48000, 1);
check(Math.abs(goertzel(sq.subarray(4800, 43200), 100, 48000) - 4 / Math.PI) < 0.02 && Math.abs(goertzel(sq.subarray(4800, 43200), 300, 48000) - 4 / (3 * Math.PI)) < 0.02, 'square wave: harmonics 4/pi and 4/(3 pi)');
const d = dtmf('5#', 8000, 100, 100);
const k5 = d.subarray(40, 760), kh = d.subarray(1640, 2360);
check(d.length === 3200 && goertzel(k5, 770, 8000) > 0.3 && goertzel(k5, 1336, 8000) > 0.3 && goertzel(k5, 697, 8000) < 0.08, 'DTMF 5 = 770 + 1336 Hz');
check(DTMF['#'].join() === '941,1477' && goertzel(kh, 941, 8000) > 0.3 && goertzel(kh, 1477, 8000) > 0.3, 'DTMF # = 941 + 1477 Hz');
check(dtmf('1,1', 8000).length === 1600 + 4000 + 1600, 'DTMF: comma is a 0.5 s pause');
const busy = signal('na-busy', 2, 8000);
check(goertzel(busy.subarray(400, 3600), 480, 8000) > 0.15 && Math.max(...busy.subarray(4100, 7900).map(Math.abs)) === 0, 'busy: 480+620 Hz, 0.5 s on, 0.5 s off');
const sw = sweep(100, 1000, 2, 8000, 0.5);
check(goertzel(sw.subarray(0, 1600), 120, 8000) > goertzel(sw.subarray(14400), 120, 8000) * 5, 'sweep: starts low, ends high');
const pn = noise('pink', 1, 48000, 0.5), wn = noise('white', 1, 48000, 0.5);
check(Math.abs(peakOf(pn) - 0.5) < 1e-6 && Math.abs(peakOf(wn) - 0.5) < 1e-6, 'noise peaks at the set level');
// Metronome: 120 BPM in 3/4 with eighths -> a click every 0.25 s, accent on each bar's first click.
const bp = beatPlan(120, 3, 2, 2);
check(bp.length === 12 && bp[1].t === 0.25 && bp.map((b) => b.accent).join('') === '201010201010', 'beat plan: 120 BPM, 3/4, eighths');
const ct = clickTrack(100, 4, 1, 2, 8000);
check(ct.length === 38400 && Math.abs(ct[4800 + 10]) > 0.01 && Math.abs(ct[4800 - 10]) < 1e-6, 'click track: 8 beats at 100 BPM = 4.8 s, click at 0.6 s');
check(tempoName(120) === 'Allegro' && tempoName(72) === 'Adagio' && tempoName(210) === 'Prestissimo', 'tempo names');
// .au and raw names
const au = new Uint8Array(24 + 4), av = new DataView(au.buffer);
av.setUint32(0, 0x2e736e64); av.setUint32(4, 24); av.setUint32(8, 4); av.setUint32(12, 1); av.setUint32(16, 8000); av.setUint32(20, 1); au.set([0xff, 0x80, 0x00, 0xff], 24);
const ar = readAu(au.buffer);
check(ar && ar.rate === 8000 && ar.chans[0].length === 4 && ar.chans[0][0] === 0 && Math.abs(ar.chans[0][1] - 32124 / 32768) < 1e-9, '.au u-law header read');
check(guessRaw('a.ulaw').kind === 'ulaw' && guessRaw('b.al').kind === 'alaw' && guessRaw('c.sln16').rate === 16000 && guessRaw('d.sln').rate === 8000 && guessRaw('e.mp3') === null, 'raw file kinds from names');

// Loudness (ITU-R BS.1770-4): the 48 kHz K-weighting coefficients in the standard, and its 1 kHz check signal.
const [sh, hp] = kWeighting(48000);
const near = (a, b, e = 1e-8) => a.every((v, i) => Math.abs(v - b[i]) < e);
check(near(sh.b, [1.53512485958697, -2.69169618940638, 1.19839281085285]) && near(sh.a, [1, -1.69065929318241, 0.73248077421585]), 'K-weighting shelf matches BS.1770 at 48 kHz');
check(near(hp.b, [1, -2, 1]) && near(hp.a, [1, -1.99004745483398, 0.99007225036621]), 'K-weighting high-pass matches BS.1770 at 48 kHz');
const s997 = synthTone('sine', 997, 10, 48000, 1);
const L1 = measure([s997, new Float32Array(s997.length)], 48000);
check(Math.abs(L1.integrated - -3.01) < 0.03, `0 dBFS 997 Hz sine in one channel = -3.01 LUFS (${L1.integrated.toFixed(3)})`);
const L2 = measure([synthTone('sine', 1000, 10, 44100, 0.1)], 44100);
check(Math.abs(L2.integrated - -23.0) < 0.1 && Math.abs(L2.samplePeak + 20) < 0.01, `-20 dBFS 1 kHz at 44.1 kHz = -23.0 LUFS (${L2.integrated.toFixed(3)})`);
// Gating: 10 s of tone then 10 s of near-silence measures the same as the tone alone.
const gated = new Float32Array(441000 * 2); gated.set(synthTone('sine', 1000, 10, 44100, 0.1)); for (let i = 441000; i < gated.length; i++) gated[i] = 1e-5 * Math.sin(i);
const Lg = measure([gated], 44100).integrated;
check(Math.abs(Lg - L2.integrated) < 0.15, `gating leaves out the quiet part (${Lg.toFixed(3)})`);
// Loudness range: 20 s at -20 LUFS-ish then 20 s 10 dB quieter -> about 10 LU (EBU Tech 3342 case 1 style).
const two = new Float32Array(48000 * 40); two.set(synthTone('sine', 1000, 20, 48000, 0.1)); two.set(synthTone('sine', 1000, 20, 48000, 0.1 / Math.sqrt(10)), 48000 * 20);
const L3 = measure([two, two], 48000);
check(Math.abs(L3.range - 10) < 0.5, `loudness range of a 10 dB step = 10 LU (${L3.range.toFixed(2)})`);
check(planGain(L2, -14, -1).gain.toFixed(2) === (-14 - L2.integrated).toFixed(2) && !planGain(L2, -14, -1).limitedByPeak, 'gain to -14 LUFS');
const pk = planGain({ integrated: -20, truePeak: -2 }, -14, -1);
check(pk.limitedByPeak && pk.gain === 1, 'gain held back by the true-peak limit');
// True peak: a 0.5-amplitude sine at fs/4 sampled 45 degrees off its peaks reads 0.354 per sample but peaks at 0.5 (-6.02 dBTP).
const off = new Float32Array(4800).map((_, i) => 0.5 * Math.sin(Math.PI / 2 * i + Math.PI / 4));
const Lt = measure([off], 48000);
check(Math.abs(Lt.samplePeak - 20 * Math.log10(0.5 / Math.SQRT2)) < 0.01 && Math.abs(Lt.truePeak - -6.02) < 0.15, `true peak finds the peak between samples (${Lt.truePeak.toFixed(2)} dBTP, sample ${Lt.samplePeak.toFixed(2)})`);
// Pitch: YIN finds 440 Hz and 82.41 Hz (low E string) to within 0.1 Hz; notes and cents.
const fr = synthTone('sawtooth', 440, 0.1, 48000, 0.5).subarray(2400, 2400 + 4096);
check(Math.abs(1200 * Math.log2(yin(fr, 48000).hz / 440)) < 1, `YIN: 440 Hz sawtooth within 1 cent (${yin(fr, 48000).hz.toFixed(3)})`);
const e2 = synthTone('sine', 82.41, 0.2, 48000, 0.5).subarray(960, 960 + 8192);
check(Math.abs(yin(e2, 48000).hz - 82.41) < 0.1, `YIN: low E 82.41 Hz (${yin(e2, 48000).hz.toFixed(3)})`);
check(yin(new Float32Array(4096), 48000).hz === 0, 'YIN: silence has no pitch');
const nn = nearestNote(445);
check(nn.name === 'A' && nn.octave === 4 && Math.abs(nn.cents - 19.56) < 0.05 && nearestNote(261.63).name === 'C' && nearestNote(261.63).octave === 4, `notes: 445 Hz = A4 +19.6 cents (${nn.cents.toFixed(2)})`);

// Joining: 1 s mono 8 kHz + 0.5 s stereo 16 kHz with a 0.25 s gap -> stereo 16 kHz, 1.75 s; crossfade 0.2 s -> 1.3 s.
{
  const a = { rate: 8000, chans: [new Float32Array(8000).fill(0.5)] }, b = { rate: 16000, chans: [new Float32Array(8000).fill(-0.5), new Float32Array(8000).fill(-0.25)] };
  const j = joinSounds([a, b], 0.25);
  check(j.rate === 16000 && j.chans.length === 2 && j.chans[0].length === 28000 && j.chans[1][18000] === 0 && j.chans[1][27000] === -0.25 && Math.abs(j.chans[0][8000] - 0.5) < 0.01, 'join: rates and channels matched, gap of silence');
  const x = joinSounds([a, b], 0, 0.2);
  check(x.chans[0].length === 20800 && Math.abs(x.chans[0][16000 - 3200 + 1600]) < 0.01 && x.chans[0][20000] === -0.5, 'join: crossfade overlaps the ends');
}
// MP3 (LAME via lamejs): a 3 s stereo tone at 192 kbps; ffprobe reads it back when installed.
{
  const { encodeAs, estimateBytes } = await import('../src/lib/audio/encode.ts');
  const r = 44100, l = new Float32Array(r * 3).map((_, i) => 0.5 * Math.sin(2 * Math.PI * 440 * i / r));
  const mp3 = await encodeAs({ rate: r, chans: [l, l] }, 'mp3-192');
  check(Math.abs(mp3.length - estimateBytes(3, r, 2, 'mp3-192')) < 3000 && mp3[0] === 0xff && (mp3[1] & 0xe0) === 0xe0, `MP3: 3 s at 192 kbps is about 72 KB and starts with a frame header (${mp3.length})`);
  if (ff) {
    const d = mkdtempSync(tmpdir() + '/fibub-mp3-'); writeFileSync(d + '/t.mp3', mp3);
    const p = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_name,sample_rate,channels,bit_rate', '-of', 'csv=p=0', d + '/t.mp3']).toString().trim();
    check(p === 'mp3,44100,2,192000', `ffprobe reads the MP3 (${p})`);
  }
}

console.log(fails ? `audio: ${fails} check(s) failed` : 'audio: all checks passed');
process.exit(fails ? 1 : 0);
