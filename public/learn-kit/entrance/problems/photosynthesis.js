// Live problems for Photosynthesis in higher plants.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  'phs-atp-cost': {
    title: 'ATP and NADPH needed to make glucose in C3 and C4 plants',
    make(r) {
      const glu = pick(r, 1, 12), c4 = r() < 0.5;
      const co2 = 6 * glu, perAtp = c4 ? 5 : 3, answer = co2 * perAtp, nadph = co2 * 2;
      return { glu, c4,
        q: `<p>A ${c4 ? 'C4 plant (maize)' : 'C3 plant (wheat)'} makes ${glu} molecule${glu > 1 ? 's' : ''} of glucose. How many ATP molecules does it use in all${c4 ? ', counting the C4 cycle and the Calvin cycle' : ' in the Calvin cycle'}?</p>`,
        answer, unit: 'ATP', tol: 0,
        hint: `One glucose needs 6 CO<sub>2</sub>. Each CO<sub>2</sub> costs 3 ATP and 2 NADPH in the Calvin cycle${c4 ? ', plus 2 ATP in the C4 cycle to regenerate PEP' : ''}.`,
        solution: steps(`CO<sub>2</sub> fixed = 6 × ${glu} = ${co2}.`, c4 ? `ATP per CO<sub>2</sub> = 3 (Calvin) + 2 (regenerating PEP) = 5.` : `ATP per CO<sub>2</sub> = 3 (2 for reducing PGA, 1 for regenerating RuBP).`, `ATP = ${co2} × ${perAtp} = <b>${answer}</b>. (NADPH = ${co2} × 2 = ${nadph}, the same in C3 and C4.)`) };
    },
    verify: (x) => x.glu * (x.c4 ? 30 : 18),
  },
  'phs-water-split': {
    title: 'water split, electrons and NADPH in the light reaction',
    make(r) {
      const o2 = pick(r, 2, 30);
      const water = 2 * o2, e = 4 * o2, answer = e / 2;
      return { o2,
        q: `<p>In non-cyclic photophosphorylation a chloroplast releases ${o2} molecules of O<sub>2</sub>. How many NADPH can be formed from the electrons released by splitting water?</p>`,
        answer, unit: 'NADPH', tol: 0,
        hint: '2H<sub>2</sub>O → 4H<sup>+</sup> + O<sub>2</sub> + 4e<sup>−</sup>. Reducing one NADP<sup>+</sup> to NADPH needs 2 electrons.',
        solution: steps(`Each O<sub>2</sub> comes from 2 H<sub>2</sub>O and frees 4 electrons.`, `Water split = 2 × ${o2} = ${water}; electrons = 4 × ${o2} = ${e}.`, `NADPH = ${e} ÷ 2 = <b>${answer}</b>.`) };
    },
    verify: (x) => x.o2 * 2,
  },
};
