// Checks for the device test kit (src/lib/device/core.ts), used by #T1051-#T1063. Run with `node tests/device.mjs`.
import * as d from '../src/lib/device/core.ts';
let fails = 0;
const check = (ok, msg) => { console.log(`${ok ? 'PASS' : 'FAIL'}  device: ${msg}`); if (!ok) fails++; };
const near = (a, b, e = 1e-6) => Math.abs(a - b) <= e;

// A full-scale sine has RMS 1/√2 (-3.01 dBFS) and peak 1 (0 dBFS).
const sine = Float32Array.from({ length: 4800 }, (_, i) => Math.sin((2 * Math.PI * 1000 * i) / 48000));
check(near(d.rms(sine), Math.SQRT1_2, 1e-4), `sine RMS is 0.7071 (${d.rms(sine).toFixed(4)})`);
check(near(d.dbfs(d.rms(sine)), -3.0103, 1e-3) && d.dbfs(d.peak(sine)) > -0.001, 'sine is -3.01 dBFS RMS, 0 dBFS peak');
check(d.dbfs(0) === -100 && d.dbfs(0.5) < -6 && d.dbfs(0.5) > -6.03, 'silence is the floor; half scale is -6.02 dB');
check(d.meterPos(-60) === 0 && d.meterPos(0) === 1 && d.meterPos(-30) === 0.5, 'meter runs from -60 to 0 dB');
check(['none', 'quiet', 'good', 'loud', 'clip'].join() === [-90, -45, -20, -3, 0].map((x) => d.micVerdict(x).level).join(), 'mic verdict bands');

// 60 Hz frames with one dropped frame still read as 60 Hz.
const t60 = []; for (let i = 0, t = 0; i < 120; i++) { t += i === 50 ? 33.4 : 16.667; t60.push(t); }
check(d.nearestHz(d.rateFromTimes(t60)) === 60, `60 Hz screen with a dropped frame (${d.rateFromTimes(t60).toFixed(1)})`);
check(d.nearestHz(143.2) === 144 && d.nearestHz(119.6) === 120 && d.nearestHz(95) === 95, 'refresh rounds to common panel rates only when close');
const t1k = Array.from({ length: 500 }, (_, i) => i * 1.0);
check(d.pollingRate(t1k).likely === 1000 && d.pollingRate([1, 2]).hz === 0, 'mouse moving every 1 ms is a 1000 Hz mouse');
check(d.pollingRate(Array.from({ length: 200 }, (_, i) => i * 8)).likely === 125, '8 ms apart is 125 Hz');
check(d.median([3, 1, 2]) === 2 && d.median([4, 1, 2, 3]) === 2.5 && d.median([]) === 0, 'median');

const ev = [['A', 1], ['S', 1], ['D', 1], ['S', 0], ['F', 1], ['G', 1], ['A', 0]].map(([code, down]) => ({ code, down: !!down }));
check(d.rollover(ev) === 4, 'rollover counts most keys held at once (4)');
check(d.stickDrift(0.03, 0.04).r === 0.05 && !d.stickDrift(0.03, 0.04).drifting && d.stickDrift(0.12, 0).drifting, 'stick drift against a 0.1 dead zone');

check(near(d.batteryEta({ level: 0.5, t: 0 }, { level: 0.49, t: 60000 }, false), 49), 'battery: 1% a minute from 49% is 49 min left');
check(near(d.batteryEta({ level: 0.5, t: 0 }, { level: 0.52, t: 120000 }, true), 48), 'battery: charging 1% a minute from 52% is 48 min to full');
check(d.batteryEta({ level: 0.5, t: 0 }, { level: 0.5, t: 60000 }, false) === null, 'battery: no change gives no estimate');

const flat = d.tiltFromGravity(0, 0, 9.81), side = d.tiltFromGravity(9.81, 0, 0);
check(near(flat.x, 0) && near(flat.y, 0) && near(side.x, 90), 'tilt: flat is 0°, on its side is 90°');
check(d.headingFromAlpha(90) === 270 && d.compassPoint(270) === 'W' && d.compassPoint(359) === 'N' && d.compassPoint(44) === 'NE', 'compass heading and points');

check(d.noteName(60) === 'C4' && d.noteName(69) === 'A4' && d.noteName(21) === 'A0', 'MIDI note names (60 = C4, 69 = A4)');
check(d.midiMessage([0x90, 60, 100]).text === 'Note on C4 (60), velocity 100' && d.midiMessage([0x91, 60, 0]).kind === 'note-off' && d.midiMessage([0x91, 60, 0]).ch === 2, 'MIDI note on, and note on with velocity 0 is note off');
check(d.midiMessage([0xe0, 0, 64]).text === 'Pitch bend 0' && d.midiMessage([0xb0, 7, 127]).text === 'Control 7 = 127', 'MIDI pitch bend centre and control change');

check(d.resolutionName(1920, 1080) === '1080p (Full HD)' && d.resolutionName(1280, 720) === '720p (HD)' && d.resolutionName(3840, 2160) === '4K (2160p)', 'camera resolution names');
check(d.aspect(1920, 1080) === '16:9' && d.aspect(640, 480) === '4:3' && d.aspect(2560, 1600) === '16:10' && d.aspect(1170, 2532) === '9:19.5', `aspect ratios (${d.aspect(1170, 2532)})`);
check(Math.round(d.ppi(1920, 1080, 15.6)) === 141 && Math.round(d.ppi(2532, 1170, 6.1)) === 457, 'pixels per inch: 15.6" 1080p laptop 141, iPhone 13 457');

const g = d.gridCoverage([{ x: 0.1, y: 0.1 }, { x: 0.9, y: 0.9 }, { x: 1, y: 1 }], 2, 2);
check(g.share === 0.5 && g.hit[0] && g.hit[3] && !g.hit[1], 'touch grid coverage (edges count in the last cell)');
check(d.parsePattern('200, 100 ,x, 300;-5 20000').join() === '200,100,300,10000' && d.patternLength([200, 100]) === 300, 'vibration pattern parsing');

if (fails) { console.log(`${fails} device check(s) failed`); process.exit(1); }
console.log('device: all checks passed');
