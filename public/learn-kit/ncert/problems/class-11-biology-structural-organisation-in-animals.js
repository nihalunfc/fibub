// Class 11 Biology, Structural Organisation in Animals: live problems (original fibub questions). Ids start with c11b-sorg-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c11b-sorg-lining': {
    title: 'number of cells in an epithelial sheet',
    make(r) {
      const area = choose(r, [2, 4, 5, 10]), side = choose(r, [10, 20, 25, 50]);
      const per = (1000 / side) ** 2 * area;
      return { area, side, q: `<p>A flat sheet of squamous epithelium covers ${area} mm². Each flat cell is a square of side ${side} µm (1 mm = 1000 µm). How many cells does the sheet have?</p>`, answer: per, unit: 'cells', tol: 0.02,
        hint: 'Area of one cell = side × side in µm². 1 mm² = 1 000 000 µm².',
        solution: steps(`Area of the sheet = ${area} × 1 000 000 = ${n(area * 1e6)} µm².`, `Area of one cell = ${side} × ${side} = ${side * side} µm².`, `Cells = ${n(area * 1e6)} ÷ ${side * side} = <b>${n(per)}</b>.`) };
    },
    verify: (x) => (x.area * 1e6) / (x.side * x.side),
  },
  'c11b-sorg-beats': {
    title: 'heartbeats in a lifetime',
    make(r) {
      const bpm = pick(r, 60, 80, 4), yrs = choose(r, [50, 60, 70, 80]);
      const tot = bpm * 60 * 24 * 365 * yrs;
      return { bpm, yrs, q: `<p>Cardiac muscle contracts without a break. If the heart beats ${bpm} times a minute, how many times does it beat in ${yrs} years (take a year as 365 days)? Give the answer in crores (1 crore = 10 000 000).</p>`, answer: tot / 1e7, unit: 'crore beats', tol: 0.02,
        hint: 'Minutes in a year = 60 × 24 × 365.',
        solution: steps(`Minutes in ${yrs} years = ${yrs} × 365 × 24 × 60 = ${n(yrs * 365 * 24 * 60)}.`, `Beats = ${bpm} × ${n(yrs * 365 * 24 * 60)} = ${n(tot)}.`, `In crores: <b>${n(tot / 1e7)}</b>.`) };
    },
    verify: (x) => x.bpm * x.yrs * 525600 / 1e7,
  },
  'c11b-sorg-clitellum': {
    title: 'length of the earthworm clitellum',
    make(r) {
      const L = choose(r, [120, 150, 180, 200]), N = choose(r, [100, 120, 150]);
      return { L, N, q: `<p>An earthworm ${L} mm long has ${N} segments of equal length. The clitellum covers segments 14, 15 and 16. How long is the clitellum, in mm?</p>`, answer: 3 * L / N, unit: 'mm', tol: 0.02,
        hint: 'Length of one segment = body length ÷ number of segments. The clitellum is 3 segments.',
        solution: steps(`One segment = ${L} ÷ ${N} = ${n(L / N, 3)} mm.`, `Clitellum = 3 × ${n(L / N, 3)} = <b>${n(3 * L / N, 3)} mm</b>.`) };
    },
    verify: (x) => (x.L / x.N) * 16 - (x.L / x.N) * 13,
  },
  'c11b-sorg-blood': {
    title: 'red cells in the body',
    make(r) {
      const vol = choose(r, [4, 4.5, 5, 5.5]), rbc = choose(r, [4.5, 5, 5.2, 5.5]);
      const tot = rbc * 1e6 * vol * 1e6;
      return { vol, rbc, q: `<p>An adult has ${vol} litres of blood and ${rbc} million red cells in each microlitre (µL). Taking 1 litre = 10⁶ µL, how many red cells (in billions, 1 billion = 10⁹) are in all the blood?</p>`, answer: tot / 1e9, unit: 'billion cells', tol: 0.02,
        hint: 'Cells = cells per µL × number of µL.',
        solution: steps(`Blood in µL = ${vol} × 10⁶ = ${n(vol * 1e6)} µL.`, `Cells = ${rbc} × 10⁶ × ${n(vol * 1e6)} = ${n(tot)}.`, `In billions: <b>${n(tot / 1e9)}</b>.`) };
    },
    verify: (x) => (x.vol * x.rbc * 1e12) / 1e9,
  },
};
