// Class 11 Biology, Morphology of Flowering Plants: live problems (original fibub questions). Ids start with c11b-morph-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c11b-morph-hairs': {
    title: 'root hairs in a patch of root',
    make(r) {
      const dens = choose(r, [100, 200, 300, 400]), area = choose(r, [2, 5, 10, 20]);
      return { dens, area, q: `<p>In the maturation region of a root there are about ${dens} root hairs per square millimetre. How many root hairs are on a patch of root surface of ${area} mm²?</p>`, answer: dens * area, unit: 'root hairs', tol: 0.001,
        hint: 'Number of hairs = density × area.', solution: steps(`Hairs = ${dens} per mm² × ${area} mm².`, `= <b>${n(dens * area)}</b> root hairs: a huge surface for absorbing water.`) };
    },
    verify: (x) => { let t = 0; for (let i = 0; i < x.area; i++) t += x.dens; return t; },
  },
  'c11b-morph-whorl': {
    title: 'angle between leaves in a whorl',
    make(r) {
      const k = choose(r, [3, 4, 5, 6, 8]);
      return { k, q: `<p>A plant has a whorl of ${k} leaves at a node, spaced evenly round the stem (top view). What is the angle between two neighbouring leaves, in degrees?</p>`, answer: 360 / k, unit: '°', tol: 0.01,
        hint: 'A full turn is 360°. Divide it into equal parts.', solution: steps(`The leaves share one full turn of 360°.`, `Angle = 360 ÷ ${k} = <b>${n(360 / k)}°</b>. (Two leaves at a node, an opposite pair, are 180° apart.)`) };
    },
    verify: (x) => 2 * Math.PI / x.k * 180 / Math.PI,
  },
  'c11b-morph-parts': {
    title: 'count the floral parts',
    make(r) {
      const K = choose(r, [4, 5]), C = choose(r, [4, 5]), A = pick(r, 4, 10), G = pick(r, 1, 3);
      return { K, C, A, G, q: `<p>A flower has the formula ⊕ ⚥ K${K} C${C} A${A} G${G} (every part free). How many floral organs (sepals, petals, stamens and carpels) does it have altogether?</p>`, answer: K + C + A + G, unit: 'organs', tol: 0.001,
        hint: 'Add the number after each letter.', solution: steps(`K${K} is ${K} sepals, C${C} is ${C} petals, A${A} is ${A} stamens, G${G} is ${G} carpel${G > 1 ? 's' : ''}.`, `Total = ${K} + ${C} + ${A} + ${G} = <b>${K + C + A + G}</b>.`) };
    },
    verify: (x) => [x.K, x.C, x.A, x.G].reduce((s, v) => s + v, 0),
  },
  'c11b-morph-raceme': {
    title: 'stamens in an inflorescence',
    make(r) {
      const fl = pick(r, 10, 40, 5), st = choose(r, [6, 5, 10]);
      return { fl, st, q: `<p>A raceme of mustard-like flowers has ${fl} flowers open at once, each with ${st} stamens. How many stamens are there in the whole inflorescence?</p>`, answer: fl * st, unit: 'stamens', tol: 0.001,
        hint: 'Multiply the number of flowers by the stamens in each flower.', solution: steps(`Stamens = ${fl} × ${st}.`, `= <b>${fl * st}</b>.`) };
    },
    verify: (x) => { let t = 0; for (let i = 0; i < x.fl; i++) t += x.st; return t; },
  },
};
