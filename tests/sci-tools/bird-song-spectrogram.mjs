// #318 Bird song spectrogram: STFT checked against scipy.signal.spectrogram 1.18 (detrend=False, scaling='density').
import { exampleSong, spectrogram, analyseSelection, encodeWav16, parseWav, toMono, fft } from '../../src/lib/sci/spectro.ts';
export default async (check) => {
  const rel = (a, b, t = 1e-5) => Math.abs(a - b) <= t * Math.abs(b);
  const { x } = exampleSong();
  const S = spectrogram(x, 22050, 512, 384, 'hann');
  check('spectro: frames and bins as scipy (341 × 257)', S.frames === 341 && S.bins === 257 && rel(S.t[0], 0.011609977324263039, 1e-12) && rel(S.t[10], 0.06965986394557823, 1e-12));
  const ref = [[0, 0, 1.1900918237246897e-09], [10, 50, 5.854037957367574e-10], [20, 93, 2.1184377509169554e-09], [100, 116, 5.336845101832252e-10], [200, 256, 2.0738831099339184e-10], [250, 10, 3.504463824304028e-10]];
  check('spectro: hann PSD values match scipy (DC, Nyquist, middle bins)', ref.every(([k, j, v]) => rel(S.psd[k * S.bins + j], v)));
  const H = spectrogram(x, 22050, 1024, 512, 'hamming');
  check('spectro: hamming, 50 % overlap matches scipy', [[5, 200, 9.41305511386239e-10], [30, 185, 9.670625075180976e-09], [40, 0, 2.3089618534232132e-10]].every(([k, j, v]) => rel(H.psd[k * H.bins + j], v)));
  const B = spectrogram(x, 22050, 256, 0, 'blackman');
  check('spectro: blackman, no overlap matches scipy', [[12, 50, 6.165381917850517e-10], [100, 46, 1.5497035435161597e-09]].every(([k, j, v]) => rel(B.psd[k * B.bins + j], v)));
  // Parseval: a sine of amplitude A has power A²/2; the PSD summed × df over one frame gives it (hann, tone on a bin).
  { const fs = 8000, N = 1024, y = Float32Array.from({ length: 8192 }, (_, i) => 0.8 * Math.sin(2 * Math.PI * 1000 * i / fs)); const T = spectrogram(y, fs, N, 0, 'hann'); let s = 0; for (let j = 0; j < T.bins; j++) s += T.psd[3 * T.bins + j] * fs / N; check('spectro: power of a sine = A²/2 (Parseval)', Math.abs(s - 0.32) < 1e-4); }
  // FFT of an impulse is flat.
  { const re = new Float64Array(8), im = new Float64Array(8); re[0] = 1; fft(re, im); check('spectro: FFT of an impulse is all ones', [...re].every((v) => Math.abs(v - 1) < 1e-12) && [...im].every((v) => Math.abs(v) < 1e-12)); }
  // Peak frequency of an off-bin tone, refined by the parabola.
  { const fs = 22050, y = Float32Array.from({ length: 22050 }, (_, i) => Math.sin(2 * Math.PI * 3010 * i / fs)); const T = spectrogram(y, fs, 1024, 512, 'hann'); const s = analyseSelection(T, 0, 1, 1000, 6000, { bwDb: 6 }); check(`spectro: off-bin tone 3010 Hz peak within 2 Hz (${s.peakHz.toFixed(1)})`, Math.abs(s.peakHz - 3010) < 2); check(`spectro: hann main lobe −6 dB width ≈ 2 bins (${s.bandwidth.toFixed(1)} Hz)`, s.bandwidth > 30 && s.bandwidth < 50); }
  // Notes of the example: 4 whistles then 6 trill notes; start times within one window of the truth.
  const sel = analyseSelection(S, 0, 2, 1000, 8000, { bwDb: 10, noteDb: 20, minNote: 0.01, minGap: 0.01 });
  const truth = exampleSong().notes;
  check('spectro: 10 notes found in the example', sel.notes.length === 10);
  check('spectro: note starts within 25 ms of the truth', sel.notes.every((n, i) => Math.abs(n.start - truth[i].start) < 0.025));
  check('spectro: whistle durations 0.1625 s (0.15 s smeared by the window), trill 0.0464 s', sel.notes.slice(0, 4).every((n) => Math.abs(n.dur - 0.1625) < 1e-3) && sel.notes.slice(4).every((n) => Math.abs(n.dur - 0.0464) < 1e-3));
  check('spectro: whistles fall from about 5 to 3 kHz, trill at 4 kHz', sel.notes[0].startHz > 4800 && sel.notes[0].endHz < 3200 && Math.abs(sel.notes[5].peakHz - 4000) < 30);
  // Short notes and gaps.
  check('spectro: minimum note length drops the trill', analyseSelection(S, 0, 2, 1000, 8000, { minNote: 0.1 }).notes.length === 4);
  check('spectro: a 40 ms gap rule merges the trill into one note', analyseSelection(S, 0, 2, 1000, 8000, { minGap: 0.04 }).notes.length === 5);
  check('spectro: empty selection gives null', analyseSelection(S, 5, 6, 0, 8000) === null);
  // WAV: 16-bit round trip, 24-bit, float, stereo to mono, errors.
  { const w = parseWav(encodeWav16([0, 0.5, -0.5, 1], 16000)); check('spectro: 16-bit WAV round trip', w.fs === 16000 && w.channels.length === 1 && Math.abs(w.channels[0][1] - 0.5) < 1e-4 && Math.abs(w.channels[0][2] + 0.5) < 1e-4); }
  { const mk = (fmt, ch, bits, bytes) => { const n = bytes.length, b = new Uint8Array(44 + n), dv = new DataView(b.buffer); const w = (o, s) => { for (let i = 0; i < 4; i++) b[o + i] = s.charCodeAt(i); }; w(0, 'RIFF'); dv.setUint32(4, 36 + n, true); w(8, 'WAVE'); w(12, 'fmt '); dv.setUint32(16, 16, true); dv.setUint16(20, fmt, true); dv.setUint16(22, ch, true); dv.setUint32(24, 48000, true); dv.setUint32(28, 48000 * ch * bits / 8, true); dv.setUint16(32, ch * bits / 8, true); dv.setUint16(34, bits, true); w(36, 'data'); dv.setUint32(40, n, true); b.set(bytes, 44); return b; };
    const w24 = parseWav(mk(1, 1, 24, [0x00, 0x00, 0x40, 0x00, 0x00, 0xc0])); check('spectro: 24-bit WAV (+0.5, −0.5)', w24.channels[0][0] === 0.5 && w24.channels[0][1] === -0.5);
    const fb = new Uint8Array(new Float32Array([0.25, -0.75]).buffer); const wf = parseWav(mk(3, 2, 32, [...fb])); check('spectro: stereo float WAV to mono', wf.channels.length === 2 && toMono(wf.channels)[0] === -0.25);
    let msg = ''; try { parseWav(mk(2, 1, 4, [1, 2])); } catch (e) { msg = e.message; } check('spectro: compressed WAV refused', msg.includes('compressed'));
    msg = ''; try { parseWav(new TextEncoder().encode('ID3 not a wav file')); } catch (e) { msg = e.message; } check('spectro: MP3 refused with advice', msg.includes('not a WAV'));
  }
};
