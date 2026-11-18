// Checks for the mastering chain (src/lib/audio/master.ts) and stereo checks (src/lib/audio/stereo.ts).
// Run with `node --experimental-strip-types tests/audio-master.mjs` (Node 22.6+; plain `node` on Node 23.6+).
import { lowShelf, highShelf, peaking, biquadDb, compCurve, limit, hitTarget, integratedLufs, width, tpdf, truePeakDb } from '../src/lib/audio/master.ts';
import { correlation, monoLoss, bandCorrelation, balanceDb, midSide, flagged, correlationTrack, averageSpectrum } from '../src/lib/audio/stereo.ts';
import { measure } from '../src/lib/audio/loudness.ts';
import { LoudnessMeter } from '../src/lib/audio/livemeter.ts';

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.log('FAIL  ' + msg); } };
const near = (a, b, t) => Math.abs(a - b) <= t;
const rate = 48000;
const sine = (f, secs, amp, ph = 0) => { const x = new Float32Array(Math.round(secs * rate)); for (let i = 0; i < x.length; i++) x[i] = amp * Math.sin((2 * Math.PI * f * i) / rate + ph); return x; };
let seed = 7; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 - 0.5; };
const noise = (secs, amp) => Float32Array.from({ length: Math.round(secs * rate) }, () => amp * rnd() * 2);

// RBJ cookbook filters: gain at the corner/centre and far away.
check(near(biquadDb(peaking(1000, 6, 1, rate), 1000, rate), 6, 0.01), 'peaking +6 dB at 1 kHz is +6 dB at 1 kHz');
check(near(biquadDb(peaking(1000, 6, 1, rate), 20, rate), 0, 0.05), 'peaking is flat far below');
check(near(biquadDb(lowShelf(100, 6, rate), 10, rate), 6, 0.1) && near(biquadDb(lowShelf(100, 6, rate), 100, rate), 3, 0.05) && near(biquadDb(lowShelf(100, 6, rate), 10000, rate), 0, 0.05), 'low shelf +6: +6 deep, +3 at the corner, 0 high');
check(near(biquadDb(highShelf(8000, -4, rate), 20000, rate), -4, 0.3) && near(biquadDb(highShelf(8000, -4, rate), 8000, rate), -2, 0.05), 'high shelf -4: -2 at the corner, about -4 above');

// Compressor curve: 4:1 at -20 dB threshold, input -8 dB (12 over) gives 9 dB reduction; below the knee none.
check(near(compCurve(-8, { thresholdDb: -20, ratio: 4, attackMs: 10, releaseMs: 100, makeupDb: 0 }), 9, 1e-9), 'compressor 4:1, 12 dB over -> 9 dB reduction');
check(compCurve(-30, { thresholdDb: -20, ratio: 4, attackMs: 10, releaseMs: 100, makeupDb: 0 }) === 0, 'compressor: nothing below the knee');

// Limiter on a hot signal: drum-like bursts plus a 0.25-of-rate sine pushed +12 dB (inter-sample peaks), ceiling -1 dBTP.
const hot = (() => {
  const n = 6 * rate, L = new Float32Array(n), R = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / rate, hit = Math.exp(-((t % 0.5) * 30)) * Math.sin(2 * Math.PI * 60 * t);
    L[i] = 0.5 * hit + 0.3 * Math.sin(2 * Math.PI * 11025 * t + 0.7) + 0.05 * rnd();
    R[i] = 0.5 * hit + 0.3 * Math.sin(2 * Math.PI * 9000 * t) + 0.05 * rnd();
  }
  return [L, R];
})();
const lim = limit(hot, rate, { ceilingDb: -1 }, 12);
const tpLim = measure(lim.chans, rate).truePeak, tpOwn = truePeakDb(lim.chans);
check(tpLim <= -1 + 1e-6 && tpOwn <= -1 + 1e-6, `limiter: true peak at or under -1 dBTP (loudness.ts ${tpLim.toFixed(3)}, own ${tpOwn.toFixed(3)})`);
check(lim.maxGrDb > 3, `limiter: it actually worked (max reduction ${lim.maxGrDb.toFixed(1)} dB)`);
check(limit(hot, rate, { ceilingDb: 0 }, -20).maxGrDb === 0, 'limiter: no reduction when well under the ceiling');

// Target solver: -9 LUFS (loud) and -14 LUFS, both within 0.2 LU, true peak under the ceiling.
for (const [target, ceil] of [[-14, -1], [-9, -0.3], [-23, -1]]) {
  const r = hitTarget(hot, rate, target, { ceilingDb: ceil });
  const m = measure(r.chans, rate);
  check(near(m.integrated, target, 0.2) && m.truePeak <= ceil + 1e-6 && r.reached, `solver ${target} LUFS / ${ceil} dBTP: got ${m.integrated.toFixed(2)} LUFS, ${m.truePeak.toFixed(2)} dBTP in ${r.iterations} steps`);
}
// Fast integrated loudness matches loudness.ts: -20 dBFS 1 kHz mono sine = -23.0 LUFS.
const s1 = sine(1000, 10, 0.1);
check(near(integratedLufs([s1], rate), measure([s1], rate).integrated, 0.01) && near(integratedLufs([s1], rate), -23, 0.05), 'integratedLufs matches measure() (-23.0)');

// Stereo: identical L/R = +1, inverted = -1, unrelated noise about 0.
const a = noise(4, 0.3), inv = a.map((v) => -v), b = noise(4, 0.3);
check(near(correlation(a, a), 1, 1e-9), 'correlation identical = +1');
check(near(correlation(a, inv), -1, 1e-9), 'correlation inverted = -1');
check(Math.abs(correlation(a, b)) < 0.05, `correlation unrelated noise about 0 (${correlation(a, b).toFixed(3)})`);
check(monoLoss(a, a, rate).lossDb === 0, 'mono loss identical = 0 dB');
check(monoLoss(a, inv, rate).lossDb === Infinity && !isFinite(monoLoss(a, inv, rate).mono), 'mono loss inverted = silence (Infinity)');
check(near(monoLoss(a, b, rate).lossDb, 3, 0.3), `mono loss of unrelated channels about 3 dB (${monoLoss(a, b, rate).lossDb.toFixed(2)})`);
check(near(balanceDb(a, a.map((v) => v / 2)), 6.02, 0.01), 'balance: right at half level -> left +6.0 dB');
check(midSide(a, a).sideDb === -Infinity && midSide(a, inv).midDb === -Infinity, 'mid/side: identical has no side, inverted no mid');
// Per band: low identical, high inverted.
const lo = sine(100, 2, 0.3), hi = sine(10000, 2, 0.3), Lb = lo.map((v, i) => v + hi[i]), Rb = lo.map((v, i) => v - hi[i]);
const bc = bandCorrelation(Lb, Rb, rate);
check(bc.low > 0.95 && bc.high < -0.95, `bands: low ${bc.low.toFixed(2)} (+1), high ${bc.high.toFixed(2)} (-1)`);
// Flagged: one second of inverted audio in the middle of 3 s.
const L3 = noise(3, 0.3), R3 = L3.map((v, i) => (i >= rate && i < 2 * rate ? -v : v));
const fl = flagged(correlationTrack(L3, R3, rate, 100), 100);
check(fl.length === 1 && near(fl[0].start, 1, 0.01) && near(fl[0].end, 2, 0.01), `flagged 1.0-2.0 s (${JSON.stringify(fl)})`);
// Width 0 makes mono; 1 leaves alone.
const w0 = width([a, b], 0);
check(near(correlation(w0[0], w0[1]), 1, 1e-6) && width([a, b], 1)[0] === a, 'width 0 = mono, 1 = unchanged');
// TPDF dither: noise within +-1 LSB, mean about 0.
const d = tpdf([new Float32Array(100000)], 16)[0]; let mx = 0, mean = 0; for (const v of d) { mx = Math.max(mx, Math.abs(v)); mean += v; }
check(mx <= 1 / 32768 + 1e-12 && Math.abs(mean / d.length) < 1e-6 && mx > 0.5 / 32768, 'TPDF dither within +-1 LSB, mean 0');
// Spectrum: a 1 kHz sine peaks near 1 kHz.
const sp = averageSpectrum([sine(1000, 2, 0.5)], rate); const top = sp.f[sp.db.indexOf(Math.max(...sp.db))];
check(near(top, 1000, 80), `spectrum peak at ${top.toFixed(0)} Hz`);


// Streaming meter: fed in odd-sized chunks it agrees with the whole-file measure.
{
  const s = sine(1000, 10, 0.1), m = new LoudnessMeter(rate, 1);
  for (let i = 0; i < s.length; i += 1000) m.push([s.subarray(i, i + 1000)]);
  check(near(m.integrated(), -23, 0.05) && near(m.momentary, -23, 0.05) && near(m.shortTerm, -23, 0.05) && near(m.truePeakDb(), -20, 0.01), `live meter: -20 dBFS 1 kHz = -23.0 LUFS (${m.integrated().toFixed(2)}, M ${m.momentary.toFixed(2)}, S ${m.shortTerm.toFixed(2)}, TP ${m.truePeakDb().toFixed(2)})`);
  const mm = new LoudnessMeter(rate, 2);
  for (let i = 0; i < hot[0].length; i += 777) mm.push([hot[0].subarray(i, i + 777), hot[1].subarray(i, i + 777)]);
  const ref = measure(hot, rate);
  check(near(mm.integrated(), ref.integrated, 0.05) && near(mm.truePeakDb(), ref.truePeak, 0.05) && near(mm.maxShortTerm, ref.maxShortTerm, 0.05) && near(mm.range(), ref.range, 0.1), `live meter matches measure() on a stereo mix (I ${mm.integrated().toFixed(2)}/${ref.integrated.toFixed(2)}, TP ${mm.truePeakDb().toFixed(2)}/${ref.truePeak.toFixed(2)}, LRA ${mm.range().toFixed(2)}/${ref.range.toFixed(2)})`);
  mm.reset(); check(mm.integrated() === -Infinity && mm.peak === 0, 'live meter: reset clears');
}

console.log(fails ? `${fails} FAILED` : 'audio-master: all checks passed');
process.exit(fails ? 1 : 0);
