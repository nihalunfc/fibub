// Live problems for Excretory products and their elimination.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  'excr-reabsorbed': {
    title: 'percentage of the filtrate reabsorbed',
    make(r) {
      const gfr = pick(r, 100, 140, 5), urine = pick(r, 1, 2.5, 0.1);
      const filt = (gfr * 1440) / 1000, answer = ((filt - urine) / filt) * 100;
      return { gfr, urine,
        q: `<p>A person's glomerular filtration rate is ${gfr} mL per minute and she passes ${urine} L of urine in a day. What percentage of the filtrate is reabsorbed by the tubules?</p>`,
        answer, unit: '%', tol: 0.0005,
        hint: 'Filtrate per day = GFR × 1440 minutes. Reabsorbed = filtrate − urine; divide by the filtrate.',
        solution: steps(`Filtrate per day = ${gfr} × 1440 = ${gfr * 1440} mL = ${n(filt, 4)} L.`, `Reabsorbed = ${n(filt, 4)} − ${urine} = ${n(filt - urine, 4)} L.`, `Percentage = ${n(filt - urine, 4)} ÷ ${n(filt, 4)} × 100 = <b>${n(answer, 4)}%</b>. About 99% is normal.`) };
    },
    verify: (x) => 100 - (x.urine * 1000 * 100) / (x.gfr * 1440),
  },
  'excr-pct-flow': {
    title: 'filtrate left after the PCT',
    make(r) {
      const gfr = pick(r, 110, 130, 5), f = pick(r, 65, 80, 5);
      const answer = gfr * (1 - f / 100);
      return { gfr, f,
        q: `<p>The GFR is ${gfr} mL per minute and the proximal convoluted tubule reabsorbs ${f}% of the filtrate. How many mL of filtrate pass into the loop of Henle each minute?</p>`,
        answer, unit: 'mL/min', tol: 0.005,
        hint: 'What is not reabsorbed moves on: multiply the GFR by (100 − reabsorbed %) / 100.',
        solution: steps(`Left after the PCT = ${100 - f}% of ${gfr}.`, `= ${gfr} × ${100 - f} / 100 = <b>${n(answer, 4)} mL per minute</b>.`) };
    },
    verify: (x) => x.gfr - (x.gfr * x.f) / 100,
  },
};
