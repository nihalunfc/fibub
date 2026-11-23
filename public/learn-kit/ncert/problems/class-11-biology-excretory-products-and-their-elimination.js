// Class 11 Biology, Excretory Products and their Elimination: live problems (original fibub questions). Ids start with c11b-excr-.
import { choose, n, steps } from './_util.js';

export default {
  'c11b-excr-gfr': {
    title: 'net filtration pressure',
    make(r) {
      const g = choose(r, [50, 55, 60, 65, 70]), b = choose(r, [25, 28, 30, 32]), c = choose(r, [10, 12, 15, 18]);
      return { g, b, c, q: `<p>In a glomerulus the blood pressure is ${g} mm Hg. The blood proteins pull water back with an osmotic pressure of ${b} mm Hg and the fluid in the Bowman's capsule pushes back with ${c} mm Hg. What is the net filtration pressure?</p>`, answer: g - b - c, unit: 'mm Hg', tol: 0.01, abs: 0.1,
        hint: 'Pressure pushing out minus the two pressures pushing back.',
        solution: steps(`Out: ${g} mm Hg. Back: ${b} + ${c} = ${b + c} mm Hg.`, `Net = ${g} − ${b + c} = <b>${g - b - c} mm Hg</b>.`) };
    },
    verify: (x) => (x.g - x.c) - x.b,
  },
  'c11b-excr-daily': {
    title: 'share of the filtrate reabsorbed',
    make(r) {
      const gfr = choose(r, [100, 110, 120, 125, 130]), u = choose(r, [1.0, 1.5, 2.0, 2.5]), fil = gfr * 1.44;
      return { gfr, u, q: `<p>A person has a GFR of ${gfr} mL per minute and passes ${u} litres of urine in a day. What percentage of the filtered water is reabsorbed? (1 day = 1440 minutes)</p>`, answer: (fil - u) / fil * 100, unit: '%', tol: 0.01,
        hint: 'Litres filtered in a day = GFR in mL per minute × 1440 ÷ 1000. Reabsorbed = filtered − urine.',
        solution: steps(`Filtered per day = ${gfr} × 1440 = ${n(gfr * 1440)} mL = ${n(fil)} L.`, `Reabsorbed = ${n(fil)} − ${u} = ${n(fil - u)} L.`, `Percentage = ${n(fil - u)} ÷ ${n(fil)} × 100 = <b>${n((fil - u) / fil * 100)} %</b>.`) };
    },
    verify: (x) => 100 - x.u * 1000 / (x.gfr * 1440) * 100,
  },
  'c11b-excr-reabs': {
    title: 'filtrate reaching the loop of Henle',
    make(r) {
      const f = choose(r, [160, 170, 180, 190]), p = choose(r, [65, 67, 70]);
      return { f, p, q: `<p>A kidney filters ${f} litres of fluid in a day, and the proximal convoluted tubule reabsorbs ${p} % of it. How many litres of filtrate enter the loop of Henle?</p>`, answer: f * (1 - p / 100), unit: 'L', tol: 0.01,
        hint: 'What fraction remains after ' + p + ' % is taken back?',
        solution: steps(`Reabsorbed in the PCT = ${p} % of ${f} = ${n(f * p / 100)} L.`, `Entering the loop = ${f} − ${n(f * p / 100)} = <b>${n(f * (1 - p / 100))} L</b>.`) };
    },
    verify: (x) => x.f - x.f * x.p / 100,
  },
  'c11b-excr-urinevol': {
    title: 'urine volume from its concentration',
    make(r) {
      const load = choose(r, [600, 700, 800, 900]), osm = choose(r, [100, 200, 300, 400, 600, 800, 1200]);
      return { load, osm, q: `<p>The body must remove ${load} mOsm of solutes a day. If the urine has a concentration of ${osm} mOsm per litre, what volume of urine must be made in a day?</p>`, answer: load / osm, unit: 'L', tol: 0.01,
        hint: 'Volume = amount of solute ÷ concentration.',
        solution: steps(`Volume = ${load} mOsm ÷ ${osm} mOsm/L = <b>${n(load / osm)} L</b>.`, 'More concentrated urine means less water is lost: this is why ADH saves water.') };
    },
    verify: (x) => 1 / (x.osm / x.load),
  },
};
