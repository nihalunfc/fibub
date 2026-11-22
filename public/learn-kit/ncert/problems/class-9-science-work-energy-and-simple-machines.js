// Class 9 Science, Chapter 7 Work, Energy, and Simple Machines: live problems (original fibub questions). Ids start with c9s-work-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c9s-work-angle': {
    title: 'work done by a force at an angle',
    make(r) {
      const F = pick(r, 20, 100, 10), s = pick(r, 2, 20, 2), deg = choose(r, [0, 30, 45, 60]);
      const answer = F * s * Math.cos((deg * Math.PI) / 180);
      return { F, s, deg, q: `<p>A child pulls a sled with a rope that makes ${deg}° with the ground. The pull is ${F} N and the sled moves ${s} m along the ground. How much work does the pull do?</p>`, answer, unit: 'J', tol: 0.01,
        hint: 'Only the part of the force along the motion works: W = F s cos θ.',
        solution: steps(`W = F s cos θ = ${F} × ${s} × cos ${deg}°.`, `cos ${deg}° = ${n(Math.cos((deg * Math.PI) / 180), 4)}, so W = <b>${n(answer)} J</b>.`) };
    },
    verify: (x) => (x.F * Math.cos((x.deg * Math.PI) / 180)) * x.s,
  },
  'c9s-work-ke': {
    title: 'kinetic energy of a moving object',
    make(r) {
      const m = choose(r, [0.16, 0.5, 2, 5, 60, 1000]), v = pick(r, 2, 30, 2), answer = 0.5 * m * v * v;
      return { m, v, q: `<p>An object of mass ${n(m)} kg moves at ${v} m/s. Find its kinetic energy.</p>`, answer, unit: 'J', tol: 0.01,
        hint: 'KE = ½ m v². Square the speed first.',
        solution: steps(`KE = ½ m v² = ½ × ${n(m)} × ${v}².`, `KE = <b>${n(answer)} J</b>.`) };
    },
    verify: (x) => (x.m * x.v * x.v) / 2,
  },
  'c9s-work-pe': {
    title: 'potential energy and the speed at the bottom',
    make(r) {
      const m = pick(r, 1, 20), h = pick(r, 2, 40, 2), g = 10, answer = Math.sqrt(2 * g * h);
      return { m, h, q: `<p>A ${m} kg stone is dropped from a height of ${h} m (take g = 10 m/s², ignore air). With what speed does it reach the ground?</p>`, answer, unit: 'm/s', tol: 0.01,
        hint: 'All the potential energy m g h becomes kinetic energy ½ m v². The mass cancels.',
        solution: steps(`PE at the top = m g h = ${m} × 10 × ${h} = ${m * g * h} J.`, `At the bottom ½ m v² = ${m * g * h} J, so v² = ${2 * g * h}.`, `v = <b>${n(answer)} m/s</b>.`) };
    },
    verify: (x) => Math.sqrt((2 * x.m * 10 * x.h) / x.m),
  },
  'c9s-work-power': {
    title: 'power of a lift or a pump',
    make(r) {
      const m = pick(r, 50, 500, 50), h = pick(r, 5, 40, 5), t = pick(r, 10, 60, 10), g = 10, answer = (m * g * h) / t;
      return { m, h, t, q: `<p>A motor raises a ${m} kg load through ${h} m in ${t} s. Find its power in watts (g = 10 m/s²).</p>`, answer, unit: 'W', tol: 0.01,
        hint: 'Work = m g h, and power = work ÷ time.',
        solution: steps(`W = m g h = ${m} × 10 × ${h} = ${m * g * h} J.`, `P = W/t = ${m * g * h} ÷ ${t} = <b>${n(answer)} W</b>.`) };
    },
    verify: (x) => x.m * 10 * (x.h / x.t),
  },
  'c9s-work-lever': {
    title: 'effort needed on a lever',
    make(r) {
      const L = pick(r, 40, 200, 20), la = pick(r, 10, 40, 10), ea = pick(r, 50, 200, 10), answer = (L * la) / ea;
      return { L, la, ea, q: `<p>A crowbar is used to lift a ${L} N load. The load is ${la} cm from the fulcrum and you push ${ea} cm from the fulcrum. What effort balances the load?</p>`, answer, unit: 'N', tol: 0.01,
        hint: 'Balance: effort × effort arm = load × load arm.',
        solution: steps(`E × ${ea} = ${L} × ${la}.`, `E = ${L * la} ÷ ${ea} = <b>${n(answer)} N</b>. Mechanical advantage = ${n(ea / la)}.`) };
    },
    verify: (x) => x.L / (x.ea / x.la),
  },
  'c9s-work-kwh': {
    title: 'energy in kilowatt hours and the bill',
    make(r) {
      const P = choose(r, [40, 60, 100, 750, 1000, 1500, 2000]), hrs = pick(r, 2, 10), d = choose(r, [10, 15, 30]), rate = choose(r, [5, 6, 7, 8]);
      const answer = (P / 1000) * hrs * d * rate;
      return { P, hrs, d, rate, q: `<p>An appliance of ${P} W runs ${hrs} hours a day for ${d} days. Electricity costs ₹${rate} per unit. What is the cost in rupees?</p>`, answer, unit: '₹', tol: 0.01,
        hint: 'Units = kW × hours. Then multiply by the rate.',
        solution: steps(`Energy = ${P / 1000} kW × ${hrs} h × ${d} days = ${n((P / 1000) * hrs * d)} kWh (units).`, `Cost = ${n((P / 1000) * hrs * d)} × ${rate} = <b>₹${n(answer)}</b>.`) };
    },
    verify: (x) => (x.P * x.hrs * x.d * x.rate) / 1000,
  },
};
