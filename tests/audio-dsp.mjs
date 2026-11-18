// Checks for the STFT, stem separation and repair maths in src/lib/audio/ (stft.ts, separate.ts, repair.ts).
// Run with `node tests/audio-dsp.mjs`.
import { stft, istft, chunked } from '../src/lib/audio/stft.ts';
import { separate, remainder, harmonicMask, medianFilters } from '../src/lib/audio/separate.ts';
import { removeHum, detectHum, declick, declip, quietest, noiseProfile, denoise } from '../src/lib/audio/repair.ts';

let fails = 0;
const check = (ok, msg) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`); if (!ok) fails++; };
const rate = 44100;
const sine = (f, secs, amp = 0.5, ph = 0) => Float32Array.from({ length: Math.round(secs * rate) }, (_, i) => amp * Math.sin((2 * Math.PI * f * i) / rate + ph));
let seed = 7; const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
const energy = (x, a = 0, z = x.length) => { let e = 0; for (let i = a; i < z; i++) e += x[i] * x[i]; return e; };
const rmsDb = (x, a, z) => 10 * Math.log10(energy(x, a, z) / (z - a));

// 1. STFT round trip (stereo pair in one FFT, and mono), and the chunked driver.
{
  const a = Float32Array.from({ length: 30001 }, () => rnd() * 0.5), b = sine(1234.5, 30001 / rate);
  for (const n of [1024, 2048]) {
    const [y1, y2] = istft(stft([a, b], n, n / 4), a.length);
    let e = 0; for (let i = 0; i < a.length; i++) e = Math.max(e, Math.abs(y1[i] - a[i]), Math.abs(y2[i] - b[i]));
    check(e < 1e-4, `stft: stereo round trip, n=${n}, max error ${e.toExponential(2)}`);
  }
  const [m] = istft(stft([a], 2048, 512), a.length);
  let e = 0; for (let i = 0; i < a.length; i++) e = Math.max(e, Math.abs(m[i] - a[i]));
  check(e < 1e-4, `stft: mono round trip, max error ${e.toExponential(2)}`);
  const [c] = chunked([a], (p) => istft(stft(p, 1024, 256), p[0].length), { core: 7000, margin: 2048, fade: 1024 });
  e = 0; for (let i = 0; i < a.length; i++) e = Math.max(e, Math.abs(c[i] - a[i]));
  check(e < 1e-4, `stft: chunked round trip, max error ${e.toExponential(2)}`);
}

// 2. HPSS: a steady sine goes mostly to harmonic, clicks mostly to percussive.
{
  const secs = 3, s = sine(440, secs, 0.3), clicks = new Float32Array(s.length);
  for (let t = 0.25; t < secs; t += 0.25) { const i = Math.round(t * rate); for (let k = 0; k < 30; k++) clicks[i + k] = (k % 2 ? -1 : 1) * 0.8 * Math.exp(-k / 6); }
  const drumsOfSine = separate([s], rate, 'drums')[0], drumsOfClicks = separate([clicks], rate, 'drums')[0];
  const sineToPerc = energy(drumsOfSine) / energy(s), clicksToPerc = energy(drumsOfClicks) / energy(clicks);
  check(sineToPerc < 0.05, `hpss: steady 440 Hz sine, ${(100 * sineToPerc).toFixed(1)} % ends up in drums (< 5 %)`);
  check(clicksToPerc > 0.7, `hpss: clicks, ${(100 * clicksToPerc).toFixed(1)} % end up in drums (> 70 %)`);
  const mix = [s.map((v, i) => v + clicks[i])], d = separate(mix, rate, 'drums'), r = remainder(mix, d);
  let e = 0; for (let i = 0; i < s.length; i++) e = Math.max(e, Math.abs(d[0][i] + r[0][i] - mix[0][i]));
  check(e < 1e-6, 'hpss: the two stems add back to the mix');
  const { harm } = medianFilters(Float32Array.from([1, 9, 2, 8, 3, 7, 4]), 7, 1, 3, 1);
  check(harm.join() === '5,2,8,3,7,4,5.5', `median filter by hand: ${harm.join()}`);
}

// 3. Vocals: a centred melody goes to vocals, a hard-left melody stays in the instrumental.
{
  const secs = 3, c = sine(660, secs, 0.3), l = sine(523.25, secs, 0.3);
  const L = c.map((v, i) => v + l[i]), R = c.slice();
  const [vl, vr] = separate([L, R], rate, 'vocals');
  // Project the vocal stem onto each melody by correlation.
  const dot = (x, y) => { let s = 0; for (let i = 0; i < x.length; i++) s += x[i] * y[i]; return s; };
  const centreIn = dot(vr, c) / dot(c, c), leftIn = dot(vl, l) / dot(l, l);
  check(centreIn > 0.8 && leftIn < 0.1, `vocals: centred 660 Hz kept ${(100 * centreIn).toFixed(0)} %, hard-left 523 Hz leaked ${(100 * leftIn).toFixed(0)} %`);
}

// 4. Hum notches: 50 Hz + harmonics down > 30 dB, a 1 kHz tone changes < 0.5 dB.
{
  const secs = 4, n = secs * rate;
  const hum = new Float32Array(n);
  for (let h = 1; h <= 6; h++) { const s = sine(50 * h, secs, 0.1 / h, h); for (let i = 0; i < n; i++) hum[i] += s[i]; }
  const tone = sine(1000, secs, 0.3);
  const [hOut] = removeHum([hum], rate, 50, 8), [tOut] = removeHum([tone], rate, 50, 8);
  const a = rate, z = n - rate;
  const humDrop = rmsDb(hum, a, z) - rmsDb(hOut, a, z), toneChange = Math.abs(rmsDb(tOut, a, z) - rmsDb(tone, a, z));
  check(humDrop > 30, `hum: 50 Hz + 5 harmonics down by ${humDrop.toFixed(1)} dB (> 30)`);
  check(toneChange < 0.5, `hum: 1 kHz tone changes by ${toneChange.toFixed(3)} dB (< 0.5)`);
  const noisy = tone.map((v, i) => v * 0.2 + hum[i] * 0.5 + rnd() * 0.01);
  check(detectHum([noisy], rate).hz === 50, `hum: detects 50 Hz (${JSON.stringify(detectHum([noisy], rate))})`);
  const s180 = sine(180, secs, 0.02), h60 = sine(60, secs, 0.05).map((v, i) => v + s180[i] + rnd() * 0.01);
  check(detectHum([h60], rate).hz === 60, 'hum: detects 60 Hz');
  check(detectHum([Float32Array.from({ length: n }, () => rnd() * 0.1)], rate).hz === null, 'hum: no hum in white noise');
}

// 5. Clicks: inserted spikes are repaired.
{
  const clean = sine(440, 2, 0.4).map((v, i) => v + 0.25 * Math.sin((2 * Math.PI * 1300 * i) / rate) + rnd() * 0.002);
  const hit = clean.slice(), at = [];
  for (let k = 1; k <= 20; k++) { const i = Math.round(k * 0.09 * rate) + 37; at.push(i); hit[i] += k % 2 ? 0.7 : -0.6; hit[i + 1] += k % 2 ? -0.3 : 0.4; }
  const { out, clicks } = declick(hit, rate);
  let worstBefore = 0, worstAfter = 0;
  for (const i of at) for (let j = i - 3; j < i + 6; j++) { worstBefore = Math.max(worstBefore, Math.abs(hit[j] - clean[j])); worstAfter = Math.max(worstAfter, Math.abs(out[j] - clean[j])); }
  check(clicks >= 18 && clicks <= 24 && worstAfter < 0.05, `declick: ${clicks} clicks found, worst error ${worstBefore.toFixed(2)} → ${worstAfter.toFixed(4)}`);
  const { clicks: none } = declick(clean, rate);
  check(none <= 1, `declick: clean sound left alone (${none} found)`);
}

// 6. Clipping repair, noise reduction.
{
  const s = sine(200, 0.5, 1.5).map((v) => Math.max(-1, Math.min(1, v)));
  const { runs, gain, chans } = declip([s]);
  let pk = 0; for (const v of chans[0]) pk = Math.max(pk, Math.abs(v));
  check(runs >= 190 && runs <= 210 && Math.abs(pk - 0.98) < 1e-6 && gain < 0.98, `declip: ${runs} clipped runs redrawn (≈ 200), peak ${pk.toFixed(3)}`);
  const secs = 6, tone = sine(1000, secs, 0.3), noise = Float32Array.from({ length: secs * rate }, () => rnd() * 0.03);
  for (let i = 0; i < rate; i++) tone[i] = 0; // first second: noise only
  const mix = tone.map((v, i) => v + noise[i]);
  const q = quietest([mix], rate);
  check(q + rate / 2 <= rate, `noise: quietest 0.5 s starts at ${(q / rate).toFixed(2)} s (inside the first second)`);
  const prof = noiseProfile([mix], q, q + rate / 2), [d] = denoise([mix], rate, prof, { reduceDb: 24 });
  const noiseDrop = rmsDb(mix, 2048, rate - 2048) - rmsDb(d, 2048, rate - 2048);
  const toneChange = Math.abs(rmsDb(d, 2 * rate, 5 * rate) - rmsDb(tone, 2 * rate, 5 * rate));
  check(noiseDrop > 15 && toneChange < 1, `noise: background down ${noiseDrop.toFixed(1)} dB, tone changes ${toneChange.toFixed(2)} dB`);
}

if (fails) { console.log(`${fails} audio-dsp check(s) failed`); process.exit(1); }
console.log('audio-dsp: all checks pass');
