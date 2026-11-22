// Class 10 Maths, Some Applications of Trigonometry: live problems (original fibub questions). Ids start with c10m-hd-.
import { pick, choose, n, steps } from './_util.js';

const R = Math.PI / 180, S3 = Math.sqrt(3), TAN = { 30: 1 / S3, 45: 1, 60: S3 }, TX = { 30: '1/√3', 45: '1', 60: '√3' };
export default {
  'c10m-hd-tower': {
    title: 'height of a tower from the angle of elevation',
    make(r) {
      const th = choose(r, [30, 45, 60]), d = th === 30 ? choose(r, [12, 15, 18, 24, 30, 36, 45]) : th === 45 ? pick(r, 10, 60, 5) : choose(r, [10, 15, 20, 30, 40]), e = choose(r, [0, 1.5, 1.6, 1.2]);
      const H = d * TAN[th] + e;
      return { th, d, e, q: `<p>The angle of elevation of the top of a tower from a point ${d} m from its foot, on level ground, is ${th}°.${e ? ` The observer’s eyes are ${e} m above the ground.` : ''} Find the height of the tower in metres (2 decimal places).</p>`, answer: H, unit: 'm', tol: 0.002,
        hint: `Use tan ${th}° = (height above the eye) / ${d}.${e ? ' Then add the eye height.' : ''}`, solution: steps(`tan ${th}° = ${TX[th]} = x / ${d}, so x = ${d} × ${TX[th]} = ${n(d * TAN[th], 4)} m.`, e ? `Tower = x + eye height = ${n(d * TAN[th], 4)} + ${e} = <b>${n(H, 4)} m</b>.` : `Tower = <b>${n(H, 4)} m</b>.`) };
    },
    verify: (x) => { const hyp = x.d / Math.cos(x.th * R); return Math.sqrt(hyp * hyp - x.d * x.d) + x.e; },
  },
  'c10m-hd-ladder': {
    title: 'how high a ladder reaches',
    make(r) {
      const L = pick(r, 4, 20, 2), th = choose(r, [30, 45, 60]), v = Math.sin(th * R), ask = choose(r, ['height', 'foot']);
      const ans = ask === 'height' ? L * v : L * Math.cos(th * R);
      return { L, th, ask, q: `<p>A ladder ${L} m long leans against a vertical wall and makes an angle of ${th}° with the ground. How ${ask === 'height' ? 'high up the wall does it reach' : 'far from the wall is its foot'}, in metres (2 decimal places)?</p>`, answer: ans, unit: 'm', tol: 0.002,
        hint: ask === 'height' ? 'The wall height is opposite the angle and the ladder is the hypotenuse: use sin.' : 'The foot distance is adjacent to the angle and the ladder is the hypotenuse: use cos.', solution: steps(ask === 'height' ? `Height = ${L} × sin ${th}°.` : `Distance = ${L} × cos ${th}°.`, `= <b>${n(ans, 4)} m</b>.`) };
    },
    verify: (x) => { const hgt = Math.sqrt(x.L * x.L - (x.L * Math.cos(x.th * R)) ** 2), ft = Math.sqrt(x.L * x.L - (x.L * Math.sin(x.th * R)) ** 2); return x.ask === 'height' ? hgt : ft; },
  },
  'c10m-hd-shadow': {
    title: 'the length of a shadow',
    make(r) {
      const th = choose(r, [30, 45, 60]), H = th === 60 ? choose(r, [6, 9, 12, 15, 18]) : pick(r, 5, 30, 1);
      return { th, H, q: `<p>A vertical pole ${H} m tall casts a shadow on level ground when the sun’s altitude (angle of elevation) is ${th}°. How long is the shadow, in metres (2 decimal places)?</p>`, answer: H / TAN[th], unit: 'm', tol: 0.002,
        hint: 'The pole is opposite the sun’s angle and the shadow is adjacent: tan θ = pole / shadow.', solution: steps(`tan ${th}° = ${H} / shadow, so shadow = ${H} / tan ${th}°.`, `= ${H} ÷ (${TX[th]}) = <b>${n(H / TAN[th], 4)} m</b>.`) };
    },
    verify: (x) => { const sh = x.H / Math.tan(x.th * R); return Math.hypot(x.H, sh) * Math.cos(x.th * R); },
  },
  'c10m-hd-depression': {
    title: 'the boat seen from a lighthouse',
    make(r) {
      const th = choose(r, [30, 45, 60]), H = th === 30 ? choose(r, [20, 30, 40, 50, 60, 100]) : pick(r, 20, 100, 10);
      return { th, H, q: `<p>From the top of a lighthouse ${H} m above sea level, the angle of depression of a boat is ${th}°. How far is the boat from the foot of the lighthouse, in metres (2 decimal places)?</p>`, answer: H / TAN[th], unit: 'm', tol: 0.002,
        hint: 'The angle of depression equals the angle of elevation of the lighthouse top from the boat. Then tan θ = H / distance.', solution: steps(`From the boat, the angle of elevation of the top is also ${th}° (alternate angles).`, `tan ${th}° = ${H} / d, so d = ${H} / ${TX[th]} = <b>${n(H / TAN[th], 4)} m</b>.`) };
    },
    verify: (x) => x.H * Math.cos(x.th * R) / Math.sin(x.th * R),
  },
  'c10m-hd-walk': {
    title: 'two angles of elevation',
    make(r) {
      const pair = choose(r, [[30, 60], [30, 45], [45, 60]]), d = pick(r, 10, 60, 10), cot = (a) => 1 / TAN[a], h = d / (cot(pair[0]) - cot(pair[1]));
      return { pair, d, q: `<p>A boy walks ${d} m straight towards the foot of a tower on level ground. The angle of elevation of the top of the tower changes from ${pair[0]}° to ${pair[1]}° (ignore the boy’s height). Find the height of the tower in metres (2 decimal places).</p>`, answer: h, unit: 'm', tol: 0.002,
        hint: `Let the tower be h and the nearer distance x. Then h = x tan ${pair[1]}° and h = (x + ${d}) tan ${pair[0]}°.`, solution: steps(`x = h / tan ${pair[1]}° and x + ${d} = h / tan ${pair[0]}°.`, `Subtract: ${d} = h (cot ${pair[0]}° − cot ${pair[1]}°).`, `h = ${d} / (${n(cot(pair[0]), 4)} − ${n(cot(pair[1]), 4)}) = <b>${n(h, 4)} m</b>.`) };
    },
    verify: (x) => { const [a, b] = x.pair; let lo = 0, hi = 1000; const f = (hh) => hh / Math.tan(a * R) - hh / Math.tan(b * R) - x.d; for (let i = 0; i < 100; i++) { const mid = (lo + hi) / 2; if (f(mid) < 0) lo = mid; else hi = mid; } return (lo + hi) / 2; },
  },
  'c10m-hd-both': {
    title: 'a tower seen from a building',
    make(r) {
      const b = pick(r, 10, 40, 5), al = choose(r, [30, 60]), T = b + b * TAN[al];
      return { b, al, q: `<p>From the top of a ${b} m building, the angle of depression of the foot of a tower is 45° and the angle of elevation of its top is ${al}°. Find the height of the tower in metres (2 decimal places).</p>`, answer: T, unit: 'm', tol: 0.002,
        hint: 'Depression 45° gives the distance between building and tower (tan 45° = 1). Then use the angle of elevation for the part of the tower above the building top.', solution: steps(`tan 45° = ${b} / d, so d = ${b} m.`, `Part of the tower above the building = d tan ${al}° = ${n(b * TAN[al], 4)} m.`, `Tower = ${b} + ${n(b * TAN[al], 4)} = <b>${n(T, 4)} m</b>.`) };
    },
    verify: (x) => { const d = x.b / Math.tan(45 * R); return x.b + Math.sqrt((d / Math.cos(x.al * R)) ** 2 - d * d); },
  },
  'c10m-hd-kite': {
    title: 'height of a kite above the ground',
    make(r) {
      const L = pick(r, 20, 120, 10), th = choose(r, [30, 45, 60]), h0 = choose(r, [1, 1.2, 1.5]);
      return { L, th, h0, q: `<p>A kite flies on a straight taut string of ${L} m, inclined at ${th}° to the horizontal. The hand holding the string is ${h0} m above the ground. How high is the kite above the ground, in metres (2 decimal places)?</p>`, answer: L * Math.sin(th * R) + h0, unit: 'm', tol: 0.002,
        hint: 'The string is the hypotenuse and the kite’s height above the hand is opposite the angle: sin. Then add the hand’s height.', solution: steps(`Height above the hand = ${L} × sin ${th}° = ${n(L * Math.sin(th * R), 4)} m.`, `Height above ground = ${n(L * Math.sin(th * R), 4)} + ${h0} = <b>${n(L * Math.sin(th * R) + h0, 4)} m</b>.`) };
    },
    verify: (x) => Math.sqrt(x.L * x.L - (x.L * Math.cos(x.th * R)) ** 2) + x.h0,
  },
};
