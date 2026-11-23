// Class 9 Maths, I'm Up and Down, and Round and Round: live problems (original fibub questions). Ids start with c9m-rot-.
import { pick, choose, n, steps } from './_util.js';

const two = (v) => String(v).padStart(2, '0');
export default {
  'c9m-rot-turn': {
    title: 'fraction of a turn in degrees',
    make(r) {
      const q = choose(r, [3, 4, 5, 6, 8, 9, 10, 12]), p = pick(r, 1, q - 1);
      const answer = (p * 360) / q;
      return { p, den: q, q: `<p>A merry-go-round turns through <b>${p}/${q}</b> of a full turn. Through how many degrees has it turned?</p>`, answer, unit: '°', tol: 0.002,
        hint: 'A full turn is 360°. Take the fraction of 360.',
        solution: steps('One full turn is 360°.', `${p}/${q} of 360 = ${p} × (360 ÷ ${q}) = ${p} × ${n(360 / q, 5)}.`, `The angle is <b>${n(answer, 5)}°</b>.`) };
    },
    verify(x) { return 360 * (x.p / x.den); },
  },
  'c9m-rot-clock': {
    title: 'angle between clock hands',
    make(r) {
      const h = pick(r, 1, 11), m = pick(r, 0, 59);
      const d = Math.abs(30 * h - 5.5 * m), answer = Math.min(d, 360 - d);
      return { h, m, q: `<p>Find the angle between the hour hand and the minute hand of a clock at <b>${h}:${two(m)}</b>. Give the smaller angle.</p>`, answer, unit: '°', tol: 0.002, abs: 0.01,
        hint: 'Minute hand: 6° per minute. Hour hand: 30° per hour plus 0.5° per minute. Subtract; if the result is over 180°, take 360° minus it.',
        solution: steps(`Minute hand: ${m} × 6 = ${m * 6}° from the 12.`, `Hour hand: ${h} × 30 + ${m} × 0.5 = ${h * 30 + m * 0.5}° from the 12.`, `Difference = ${Math.abs(h * 30 + m * 0.5 - m * 6)}°${Math.abs(h * 30 + m * 0.5 - m * 6) > 180 ? `, which is more than 180°, so the smaller angle is 360 − ${Math.abs(h * 30 + m * 0.5 - m * 6)} = ` : ', so the angle is '}<b>${n(answer, 5)}°</b>.`) };
    },
    verify(x) { const tot = x.h * 60 + x.m, hour = (tot * 0.5) % 360, min = (x.m * 6) % 360, d = (((hour - min) % 360) + 360) % 360; return d > 180 ? 360 - d : d; },
  },
  'c9m-rot-coterm': {
    title: 'same position after full turns',
    make(r) {
      const k = pick(r, 1, 3), base = pick(r, 10, 350, 5), sign = choose(r, [1, -1]);
      const a = sign * (base + 360 * k) * (sign < 0 ? 1 : 1), answer = ((a % 360) + 360) % 360;
      const fmt = a < 0 ? '−' + Math.abs(a) : String(a);
      return { a, q: `<p>An arm is turned through <b>${fmt}°</b> (negative means clockwise). It ends in the same position as an arm turned anticlockwise through how many degrees between 0° and 360°?</p>`, answer, unit: '°', tol: 0, abs: 0.5,
        hint: 'Add or subtract whole turns of 360° until the angle is between 0° and 360°.',
        solution: steps('Adding or subtracting 360° (a full turn) never changes where the arm points.', a < 0 ? `${fmt} + ${(k + 1)} × 360 = ${a + 360 * (k + 1)}.` : `${a} − ${k} × 360 = ${a - 360 * k}.`, `The equivalent angle is <b>${answer}°</b>.`) };
    },
    verify(x) { let v = x.a; while (v < 0) v += 360; while (v >= 360) v -= 360; return v; },
  },
  'c9m-rot-ferris': {
    title: 'height on a Ferris wheel',
    make(r) {
      const R = pick(r, 10, 30), th = choose(r, [60, 90, 120, 180, 240, 270, 300]);
      const answer = R * (1 - Math.cos((th * Math.PI) / 180)), c = +Math.cos((th * Math.PI) / 180).toFixed(3) + 0;
      return { R, th, q: `<p>A Ferris wheel of radius <b>${R} m</b> has its lowest point on the ground. A rider boards at the bottom and the wheel turns through <b>${th}°</b>. How high above the ground is the rider? (Use cos ${th}° = ${n(c, 3)}.)</p>`, answer, unit: 'm', tol: 0.005, abs: 0.01,
        hint: 'The centre is R above the ground. The rider’s height above the ground is R − R cos θ, measured from the bottom.',
        solution: steps(`The centre is ${R} m above the ground.`, `After ${th}° from the bottom, the height is R(1 − cos ${th}°) = ${R} × (1 − ${c < 0 ? `(${n(c, 3)})` : n(c, 3)}).`, `Height = <b>${n(answer, 4)} m</b>.`) };
    },
    verify(x) { return x.R + x.R * Math.sin(((x.th - 90) * Math.PI) / 180); },
  },
  'c9m-rot-period': {
    title: 'period of a repeating motion',
    make(r) {
      const k = pick(r, 2, 9), t = pick(r, 10, 60, 2);
      const answer = t / k;
      return { k, t, q: `<p>A wheel at a fair makes <b>${k} complete turns</b> in <b>${t} seconds</b>. What is its period (time for one turn)?</p>`, answer, unit: 's', tol: 0.002,
        hint: 'Period = total time ÷ number of turns.',
        solution: steps(`${k} turns take ${t} s.`, `One turn takes ${t} ÷ ${k}.`, `Period = <b>${n(answer, 4)} s</b>.`) };
    },
    verify(x) { return 1 / (x.k / x.t); },
  },
  'c9m-rot-speed': {
    title: 'turning speed in degrees per second',
    make(r) {
      const rpm = pick(r, 6, 120, 6);
      const answer = (rpm * 360) / 60;
      return { rpm, q: `<p>A fan blade turns at <b>${rpm} turns per minute</b>. Through how many degrees does it turn each second?</p>`, answer, unit: '° per s', tol: 0.002,
        hint: 'One turn is 360°, and a minute has 60 seconds.',
        solution: steps(`In 1 minute it turns ${rpm} × 360 = ${rpm * 360}°.`, `Per second: ${rpm * 360} ÷ 60.`, `<b>${n(answer, 4)}° per second</b>.`) };
    },
    verify(x) { return 360 / (60 / x.rpm); },
  },
};
