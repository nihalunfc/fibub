// Class 11 Biology, Breathing and Exchange of Gases: live problems (original fibub questions). Ids start with c11b-breath-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c11b-breath-vc': {
    title: 'vital capacity from lung volumes',
    make(r) {
      const tv = pick(r, 400, 600, 50), irv = pick(r, 2400, 3200, 100), erv = pick(r, 900, 1200, 100), rv = pick(r, 1000, 1300, 100);
      return { tv, irv, erv, rv, q: `<p>A spirometer shows tidal volume ${tv} mL, inspiratory reserve volume ${irv} mL, expiratory reserve volume ${erv} mL and residual volume ${rv} mL. Find the <b>total lung capacity</b>.</p>`, answer: tv + irv + erv + rv, unit: 'mL', tol: 0.01,
        hint: 'Vital capacity = TV + IRV + ERV. TLC = VC + RV.',
        solution: steps(`VC = ${tv} + ${irv} + ${erv} = ${tv + irv + erv} mL.`, `TLC = ${tv + irv + erv} + ${rv} = <b>${n(tv + irv + erv + rv)} mL</b>.`) };
    },
    verify: (x) => (x.irv + x.tv) + (x.erv + x.rv),
  },
  'c11b-breath-alveolar': {
    title: 'alveolar ventilation',
    make(r) {
      const rate = pick(r, 10, 30, 2), tv = pick(r, 250, 700, 50);
      return { rate, tv, q: `<p>A person breathes ${rate} times a minute with a tidal volume of ${tv} mL. The dead space is 150 mL. How much air reaches the alveoli each minute, in litres?</p>`, answer: rate * (tv - 150) / 1000, unit: 'L/min', tol: 0.01,
        hint: 'Alveolar ventilation = rate × (tidal volume − dead space).',
        solution: steps(`Air reaching the alveoli per breath = ${tv} − 150 = ${tv - 150} mL.`, `Per minute = ${rate} × ${tv - 150} = ${n(rate * (tv - 150))} mL = <b>${n(rate * (tv - 150) / 1000)} L</b>.`) };
    },
    verify: (x) => (x.rate * x.tv - x.rate * 150) / 1000,
  },
  'c11b-breath-o2supply': {
    title: 'oxygen delivered by the blood',
    make(r) {
      const co = pick(r, 4, 8, 1), per = choose(r, [4, 5, 6]);
      return { co, per, q: `<p>The heart pumps ${co} litres of blood per minute and every 100 mL of blood gives up ${per} mL of O₂ in the tissues. How many mL of O₂ do the tissues receive per minute?</p>`, answer: co * 10 * per, unit: 'mL/min', tol: 0.01,
        hint: '1 litre = 10 lots of 100 mL.',
        solution: steps(`${co} L = ${co * 10} lots of 100 mL.`, `O₂ = ${co * 10} × ${per} = <b>${co * 10 * per} mL per minute</b>.`) };
    },
    verify: (x) => (x.co * 1000 / 100) * x.per,
  },
  'c11b-breath-partial': {
    title: 'partial pressure of oxygen',
    make(r) {
      const P = choose(r, [760, 700, 600, 500, 380]), f = choose(r, [0.21, 0.21, 0.19]);
      return { P, f, q: `<p>Air contains ${Math.round(f * 100)} % oxygen. At a place where the air pressure is ${P} mm Hg (on a mountain), what is the partial pressure of oxygen?</p>`, answer: P * f, unit: 'mm Hg', tol: 0.01,
        hint: 'Partial pressure = fraction × total pressure.',
        solution: steps(`pO₂ = ${f} × ${P} = <b>${n(P * f)} mm Hg</b>.`, 'At altitude the air is thinner and pO₂ falls, which is why breathing is harder on a mountain.') };
    },
    verify: (x) => (x.f * 100) * x.P / 100,
  },
};
