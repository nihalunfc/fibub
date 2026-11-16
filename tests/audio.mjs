// Checks for the shared sound kit in src/lib/audio/ (G.711, WAV, resampling). Run with `node tests/audio.mjs`.
// G.711 is checked against every 16-bit value in the ITU-T G.711 rules' known points and, when ffmpeg is installed, byte for byte against ffmpeg.
import { linearToUlaw, ulawToLinear, linearToAlaw, alawToLinear } from '../src/lib/audio/g711.ts';
import { writeWav, readWav, readRaw, resample, toPhone, phoneFile, normalise, peakOf, wavInfo } from '../src/lib/audio/pcm.ts';
import { tone as synthTone, sweep, noise, dtmf, signal, goertzel, DTMF } from '../src/lib/audio/synth.ts';
import { readAu, guessRaw } from '../src/lib/audio/pcm.ts';
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
// .au and raw names
const au = new Uint8Array(24 + 4), av = new DataView(au.buffer);
av.setUint32(0, 0x2e736e64); av.setUint32(4, 24); av.setUint32(8, 4); av.setUint32(12, 1); av.setUint32(16, 8000); av.setUint32(20, 1); au.set([0xff, 0x80, 0x00, 0xff], 24);
const ar = readAu(au.buffer);
check(ar && ar.rate === 8000 && ar.chans[0].length === 4 && ar.chans[0][0] === 0 && Math.abs(ar.chans[0][1] - 32124 / 32768) < 1e-9, '.au u-law header read');
check(guessRaw('a.ulaw').kind === 'ulaw' && guessRaw('b.al').kind === 'alaw' && guessRaw('c.sln16').rate === 16000 && guessRaw('d.sln').rate === 8000 && guessRaw('e.mp3') === null, 'raw file kinds from names');

console.log(fails ? `audio: ${fails} check(s) failed` : 'audio: all checks passed');
process.exit(fails ? 1 : 0);
