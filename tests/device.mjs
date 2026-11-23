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

// Live trackers (src/lib/device/track.ts): #T1075-#T1079.
import * as tk from '../src/lib/device/track.ts';
check(near(tk.toUnit(10, 'kmh'), 36) && near(tk.toUnit(10, 'mph'), 22.369, 1e-3) && near(tk.toUnit(10, 'kn'), 19.438, 1e-3), 'speed units: 10 m/s is 36 km/h, 22.37 mph, 19.44 knots');
// One degree of latitude is 111.195 km on the 6371.0088 km sphere; due east bearing is 90.
check(near(tk.haversine({ lat: 0, lon: 0 }, { lat: 1, lon: 0 }), 111195.1, 1) && near(tk.bearing({ lat: 0, lon: 0 }, { lat: 0, lon: 1 }), 90, 1e-9), 'haversine 1° of latitude = 111.195 km; bearing east = 90°');
{
  // A car at 20 m/s due north for 10 s, one fix a second, no browser speed: distance from positions.
  const s = tk.newSpeed(), step = 20 / 111195.08; let ok = true;
  for (let i = 0; i <= 10; i++) ok = tk.addGps(s, { t: i * 1000, lat: i * step, lon: 0, acc: 5, alt: 100 + i }) && ok;
  check(ok && near(s.dist, 200, 0.5) && near(s.speed, 20, 0.05) && near(tk.avgMoving(s), 20, 0.05) && near(s.heading, 0, 0.01), `speed from positions: 200 m in 10 s is 20 m/s heading north (${s.dist.toFixed(1)} m)`);
  check(s.altMin === 100 && s.altMax === 110 && near(s.climb, 9, 1e-9), `altitude range 100-110 m, climb counts 3 m steps (${s.climb})`);
  check(!tk.addGps(s, { t: 11000, lat: 1, lon: 0, acc: 200 }) && s.skipped === 1, 'a fix with 200 m accuracy is skipped');
  const p = tk.newSpeed();
  tk.addGps(p, { t: 0, lat: 0, lon: 0, acc: 10, speed: 0.2 }); tk.addGps(p, { t: 1000, lat: 2e-5, lon: 0, acc: 10, speed: 0.3 });
  check(p.speed === 0 && p.dist === 0 && p.max === 0, 'standing still with GPS drift reads 0 and adds no distance');
  const q = tk.newSpeed(); tk.addGps(q, { t: 0, lat: 0, lon: 0, acc: 5, speed: 27.78 });
  check(near(tk.toUnit(q.max, 'kmh'), 100, 0.01), 'browser (Doppler) speed is used when given: 27.78 m/s = 100 km/h');
}
{
  // Flat phone, top forward: 0.3 g braking is -0.3 g forward; 0.5 g to the right is +0.5 right.
  const fr = tk.makeFrame([0, 0, 9.80665], 'flat');
  const br = tk.carG([0, -0.3 * 9.80665, 9.80665], fr), rt = tk.carG([0.5 * 9.80665, 0, 9.80665], fr);
  check(near(br.fwd, -0.3) && near(br.right, 0) && near(rt.right, 0.5) && near(rt.total, 0.5), `g-force flat: braking -0.30 g, right turn +0.50 g (${br.fwd.toFixed(2)}, ${rt.right.toFixed(2)})`);
  // Upright in a holder (gravity along +y), back of the phone faces forward: speeding up pushes the reading along -z.
  const up = tk.makeFrame([0, 9.80665, 0], 'upright'), acc = tk.carG([0, 9.80665, -0.2 * 9.80665], up);
  check(near(acc.fwd, 0.2) && near(acc.up, 0) && near(tk.carG([0, 1.5 * 9.80665, 0], up).up, 0.5), 'g-force upright: speeding up +0.20 g, a bump +0.5 g up');
}
{
  // A made-up walk: 2 steps a second (120 a minute) for 20 s at 50 Hz, a 3 m/s² bounce on gravity with a little noise.
  const sc = tk.makeStepCounter(); let rnd = 1;
  const noise = () => { rnd = (rnd * 16807) % 2147483647; return (rnd / 2147483647 - 0.5) * 0.4; };
  for (let i = 0; i < 1000; i++) { const t = i * 20; sc.push(t, 9.81 + 3 * Math.sin(2 * Math.PI * 2 * (t / 1000)) + noise()); }
  const n = sc.steps.length, cad = tk.cadence(sc.steps, 20000);
  check(n >= 37 && n <= 40 && near(cad, 120, 3), `step counter: 20 s at 2 steps/s gives ~39 steps (${n}) at ~120 a minute (${cad.toFixed(1)})`);
  const still = tk.makeStepCounter(); for (let i = 0; i < 500; i++) still.push(i * 20, 9.81 + noise());
  check(still.steps.length === 0, 'step counter: a phone lying still counts no steps');
  check(near(tk.stepLength(1.75), 0.7245), 'step length 0.414 × height walking');
}
{
  const dv = (bytes) => new DataView(Uint8Array.from(bytes).buffer);
  check(tk.parseHeartRate(dv([0, 72])).bpm === 72 && tk.parseHeartRate(dv([1, 0x2c, 0x01])).bpm === 300, 'heart rate: uint8 72 bpm and uint16 300');
  check(tk.parseCyclingPower(dv([0, 0, 0xfa, 0])).watts === 250, 'cycling power 250 W');
  // Indoor bike: flags 0x0044 (cadence + power), speed 32.50 km/h, cadence 90 rpm (180 half-rpm), power 210 W.
  const b = tk.parseIndoorBike(dv([0x44, 0x00, 0xb2, 0x0c, 0xb4, 0x00, 0xd2, 0x00]));
  check(b.speed === 32.5 && b.cadence === 90 && b.watts === 210, `indoor bike: 32.5 km/h, 90 rpm, 210 W (${JSON.stringify(b)})`);
  // Rower: flags 0x002C (distance, pace, power), stroke rate 26/min (52), 120 strokes, 1500 m, pace 115 s, 180 W.
  const r = tk.parseRower(dv([0x2c, 0x00, 52, 120, 0, 0xdc, 0x05, 0, 115, 0, 180, 0]));
  check(r.strokeRate === 26 && r.strokes === 120 && r.distance === 1500 && r.pace === 115 && r.watts === 180 && tk.fmtPace500(115) === '1:55', `rower: 26 spm, 120 strokes, 1500 m, 1:55 /500 m, 180 W (${JSON.stringify(r)})`);
  check(tk.fmtClock(3725) === '1:02:05' && tk.fmtClock(65) === '1:05', 'clock format');
}

if (fails) { console.log(`${fails} device check(s) failed`); process.exit(1); }
console.log('device: all checks passed');
