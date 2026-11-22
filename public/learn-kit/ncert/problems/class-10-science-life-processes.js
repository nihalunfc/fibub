// Class 10 Science, Life Processes: live problems (original fibub questions). Ids start with c10s-life-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c10s-life-breath': {
    title: 'air breathed in a day',
    make(r) {
      const rate = pick(r, 12, 20), v = choose(r, [400, 450, 500, 550, 600]);
      return { rate, v, q: `<p>At rest a person takes ${rate} breaths a minute and moves ${v} mL of air in each breath. How many litres of air do they breathe in during one hour?</p>`, answer: (rate * v * 60) / 1000, unit: 'L', tol: 0.01,
        hint: 'Volume per minute = breaths per minute × volume per breath. Then multiply by 60 minutes and convert mL to L.',
        solution: steps(`Per minute: ${rate} × ${v} mL = ${rate * v} mL = ${n(rate * v / 1000)} L.`, `In 60 minutes: ${n(rate * v / 1000)} × 60 = <b>${n(rate * v * 60 / 1000)} L</b>.`) };
    },
    verify: (x) => (x.v / 1000) * (x.rate * 60),
  },
  'c10s-life-cardiac': {
    title: 'cardiac output',
    make(r) {
      const hr = pick(r, 56, 110, 2), sv = pick(r, 60, 90, 5);
      return { hr, sv, q: `<p>A heart beats ${hr} times a minute and pumps ${sv} mL of blood from the left ventricle at each beat (the stroke volume). What is the cardiac output in litres per minute?</p>`, answer: (hr * sv) / 1000, unit: 'L/min', tol: 0.01,
        hint: 'Cardiac output = heart rate × stroke volume. Change mL to L at the end.',
        solution: steps(`Output = ${hr} × ${sv} mL = ${hr * sv} mL per minute.`, `= <b>${n(hr * sv / 1000)} L/min</b>.`) };
    },
    verify: (x) => ((x.sv / 1000) * x.hr * 60) / 60,
  },
  'c10s-life-bubbles': {
    title: 'photosynthesis rate from bubbles',
    make(r) {
      const d1 = pick(r, 10, 30, 5), k = choose(r, [1.5, 2, 2.5, 3]), d2 = d1 * k, b1 = pick(r, 40, 100, 10);
      return { d1, d2, b1, q: `<p>A pond weed (Hydrilla) under a lamp ${d1} cm away gives ${b1} bubbles of oxygen per minute. The lamp is moved to ${d2} cm. Light intensity falls as 1/(distance)². Assuming the rate of photosynthesis is proportional to the light intensity, how many bubbles per minute are expected now?</p>`, answer: b1 * (d1 / d2) ** 2, unit: 'bubbles/min', tol: 0.02,
        hint: 'Intensity ∝ 1/d². If the distance is k times bigger, the intensity is 1/k² as much.',
        solution: steps(`Distance ratio = ${d2} ÷ ${d1} = ${n(d2 / d1)}.`, `Intensity falls to 1/${n((d2 / d1) ** 2)} of the first.`, `Bubbles = ${b1} ÷ ${n((d2 / d1) ** 2)} = <b>${n(b1 * (d1 / d2) ** 2)} per minute</b>.`) };
    },
    verify: (x) => x.b1 * (1 / (x.d2 * x.d2)) / (1 / (x.d1 * x.d1)),
  },
  'c10s-life-kidney': {
    title: 'water reabsorbed by the kidneys',
    make(r) {
      const gfr = pick(r, 110, 130, 5), u = pick(r, 1, 2.5, 0.5);
      return { gfr, u, q: `<p>The kidneys filter blood at ${gfr} mL of fluid per minute. In a day a person makes ${u} L of urine. How many litres of the filtered water are reabsorbed into the blood in a day?</p>`, answer: (gfr * 1440) / 1000 - u, unit: 'L', tol: 0.01,
        hint: 'There are 24 × 60 = 1440 minutes in a day. Filtered − urine = reabsorbed.',
        solution: steps(`Filtered in a day = ${gfr} × 1440 = ${n(gfr * 1440)} mL = ${n(gfr * 1.44)} L.`, `Reabsorbed = ${n(gfr * 1.44)} − ${u} = <b>${n(gfr * 1.44 - u)} L</b> (more than 99% of it).`) };
    },
    verify: (x) => x.gfr * 1.44 * (1 - x.u / (x.gfr * 1.44)),
  },
  'c10s-life-atp': {
    title: 'glucose needed with and without oxygen',
    make(r) {
      const N = pick(r, 60, 600, 30);
      return { N, q: `<p>A muscle cell needs ${N} million molecules of ATP. Aerobic respiration makes about 30 ATP per glucose and anaerobic respiration (to lactic acid) about 2. How many million more glucose molecules are used if the cell has to work without oxygen?</p>`, answer: N / 2 - N / 30, unit: 'million', tol: 0.01,
        hint: 'Glucose needed = ATP needed ÷ ATP per glucose. Do it for both and subtract.',
        solution: steps(`Aerobic: ${N} ÷ 30 = ${n(N / 30)} million glucose.`, `Anaerobic: ${N} ÷ 2 = ${n(N / 2)} million glucose.`, `Difference = <b>${n(N / 2 - N / 30)} million</b>: 15 times as much glucose for the same energy.`) };
    },
    verify: (x) => (x.N / 30) * (30 / 2 - 1),
  },
  'c10s-life-water': {
    title: 'water lost by a plant',
    make(r) {
      const W = pick(r, 200, 800, 50), p = choose(r, [97, 98, 99]);
      return { W, p, q: `<p>A maize plant absorbs ${W} mL of water through its roots in a day. About ${p}% of it is lost by transpiration. How many mL does the plant keep for its own use (photosynthesis, growth, cells)?</p>`, answer: W * (100 - p) / 100, unit: 'mL', tol: 0.01,
        hint: 'Kept = 100% minus the percent lost.',
        solution: steps(`Lost = ${p}% of ${W} = ${n(W * p / 100)} mL.`, `Kept = ${W} − ${n(W * p / 100)} = <b>${n(W * (100 - p) / 100)} mL</b>.`) };
    },
    verify: (x) => x.W - (x.W * x.p) / 100,
  },
};
