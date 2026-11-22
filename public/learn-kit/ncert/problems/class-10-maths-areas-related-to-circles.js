// Class 10 Maths, Areas Related to Circles: live problems (original fibub questions). Ids start with c10m-arc-. Uses π = 22/7.
import { pick, choose, n, steps } from './_util.js';
const PI = 22 / 7;

export default {
  'c10m-arc-sector': {
    title: 'area of a sector',
    make(r) {
      const rad = choose(r, [7, 14, 21, 28]), th = choose(r, [30, 45, 60, 90, 120, 180]);
      return { rad, th, q: `<p>Find the area of a sector of angle ${th}° in a circle of radius ${rad} cm. Use π = 22/7. Answer in cm².</p>`, answer: (th / 360) * PI * rad * rad, unit: 'cm²', tol: 0.005,
        hint: 'A sector is the fraction θ/360 of the circle. Area = θ/360 × πr².',
        solution: steps(`Fraction of the circle = ${th}/360.`, `Area = ${th}/360 × 22/7 × ${rad}² = ${th}/360 × ${n(PI * rad * rad)}.`, `Area = <b>${n((th / 360) * PI * rad * rad)} cm²</b>.`) };
    },
    verify: (x) => (x.th * 22 * x.rad * x.rad) / (360 * 7),
  },
  'c10m-arc-arc': {
    title: 'length of an arc',
    make(r) {
      const rad = choose(r, [7, 14, 21, 35]), th = choose(r, [36, 45, 60, 72, 90, 120, 150]);
      return { rad, th, q: `<p>Find the length of the arc of a circle of radius ${rad} cm that subtends an angle of ${th}° at the centre. Use π = 22/7. Answer in cm.</p>`, answer: (th / 360) * 2 * PI * rad, unit: 'cm', tol: 0.005,
        hint: 'Arc length = θ/360 × 2πr.',
        solution: steps(`The whole circumference is 2πr = 2 × 22/7 × ${rad} = ${n(2 * PI * rad)} cm.`, `The arc is ${th}/360 of it.`, `Arc = <b>${n((th / 360) * 2 * PI * rad)} cm</b>.`) };
    },
    verify: (x) => (x.th / 360) * 2 * (22 / 7) * x.rad,
  },
  'c10m-arc-angle': {
    title: 'find the angle of a sector',
    make(r) {
      const rad = choose(r, [7, 14, 21]), th = choose(r, [30, 40, 60, 90, 120, 150, 180]), A = (th / 360) * PI * rad * rad;
      return { rad, A, q: `<p>A sector of a circle of radius ${rad} cm has area ${n(A)} cm². Find its angle in degrees. Use π = 22/7.</p>`, answer: th, unit: '°', tol: 0.005,
        hint: 'Area of sector = θ/360 × πr². Solve for θ.',
        solution: steps(`${n(A)} = θ/360 × 22/7 × ${rad}² = θ/360 × ${n(PI * rad * rad)}.`, `θ = 360 × ${n(A)} ÷ ${n(PI * rad * rad)}.`, `θ = <b>${th}°</b>.`) };
    },
    verify: (x) => (x.A * 360) / (PI * x.rad * x.rad),
  },
  'c10m-arc-segment': {
    title: 'area of a minor segment',
    make(r) {
      const rad = choose(r, [7, 14, 21]), th = choose(r, [60, 90, 120]);
      const tri = 0.5 * rad * rad * Math.sin((th * Math.PI) / 180), sec = (th / 360) * PI * rad * rad;
      return { rad, th, q: `<p>A chord of a circle of radius ${rad} cm subtends ${th}° at the centre. Find the area of the minor segment in cm². Use π = 22/7 (and √3 = 1.732 where needed).</p>`, answer: sec - tri, unit: 'cm²', tol: 0.01,
        hint: 'Segment = sector − triangle. The triangle has area ½r² sin θ: ½r² for 90°, and (√3/4)r² for 60° and 120°.',
        solution: steps(`Sector = ${th}/360 × 22/7 × ${rad}² = ${n(sec)} cm².`, `Triangle OAB = ½ r² sin ${th}° = ${n(tri)} cm².`, `Segment = ${n(sec)} − ${n(tri)} = <b>${n(sec - tri)} cm²</b>.`) };
    },
    verify: (x) => { const t = x.th === 90 ? 0.5 * x.rad * x.rad : (Math.sqrt(3) / 4) * x.rad * x.rad; return (x.th * 22 * x.rad * x.rad) / (360 * 7) - t; },
  },
  'c10m-arc-clock': {
    title: 'area swept by a clock hand',
    make(r) {
      const len = choose(r, [7, 14, 21]), min = choose(r, [5, 10, 15, 20, 30, 40]);
      return { len, min, q: `<p>The minute hand of a clock is ${len} cm long. Find the area it sweeps in ${min} minutes. Use π = 22/7. Answer in cm².</p>`, answer: (min / 60) * PI * len * len, unit: 'cm²', tol: 0.005,
        hint: 'The minute hand turns 6° every minute, so in t minutes it turns 6t°. Then use θ/360 × πr².',
        solution: steps(`Angle turned = 6 × ${min} = ${6 * min}°.`, `Area = ${6 * min}/360 × 22/7 × ${len}² = ${min}/60 × ${n(PI * len * len)}.`, `Area = <b>${n((min / 60) * PI * len * len)} cm²</b>.`) };
    },
    verify: (x) => (6 * x.min * (22 / 7) * x.len * x.len) / 360,
  },
  'c10m-arc-track': {
    title: 'a running track',
    make(r) {
      const L = pick(r, 40, 100, 10), rad = choose(r, [7, 14, 21]);
      return { L, rad, q: `<p>A running track has two straight sides of ${L} m each, joined by semicircular ends of radius ${rad} m. Find the length of one lap along the inside edge in metres. Use π = 22/7.</p>`, answer: 2 * L + 2 * PI * rad, unit: 'm', tol: 0.005,
        hint: 'The two semicircles together make one full circle of radius r.',
        solution: steps(`Two straights: 2 × ${L} = ${2 * L} m.`, `Two semicircles make one circle: 2πr = 2 × 22/7 × ${rad} = ${n(2 * PI * rad)} m.`, `Lap = <b>${n(2 * L + 2 * PI * rad)} m</b>.`) };
    },
    verify: (x) => x.L + x.L + (44 * x.rad) / 7,
  },
  'c10m-arc-ring': {
    title: 'the area of a circular path',
    make(r) {
      const rad = choose(r, [7, 14, 21, 28]), w = choose(r, [1, 2, 3.5, 7]);
      return { rad, w, q: `<p>A circular park has radius ${rad} m. A path ${n(w)} m wide runs all round it outside. Find the area of the path in m². Use π = 22/7.</p>`, answer: PI * ((rad + w) ** 2 - rad * rad), unit: 'm²', tol: 0.005,
        hint: 'Path area = area of the bigger circle (radius r + w) − area of the park.',
        solution: steps(`Outer radius = ${rad} + ${n(w)} = ${n(rad + w)} m.`, `Area = 22/7 × (${n(rad + w)}² − ${rad}²) = 22/7 × ${n((rad + w) ** 2 - rad * rad)}.`, `Area = <b>${n(PI * ((rad + w) ** 2 - rad * rad))} m²</b>.`) };
    },
    verify: (x) => (22 / 7) * x.w * (2 * x.rad + x.w),
  },
};
