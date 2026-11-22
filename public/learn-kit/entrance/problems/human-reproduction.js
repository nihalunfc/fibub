// Live problems for Human reproduction.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

// cells -> sperm per cell
const SPERM = [
  ['primary spermatocytes', 4, 'each primary spermatocyte (2n) does meiosis I and II and gives four spermatids, so four sperm'],
  ['secondary spermatocytes', 2, 'each secondary spermatocyte (n) only does meiosis II, giving two spermatids'],
  ['spermatids', 1, 'a spermatid only changes shape (spermiogenesis) into one sperm; no division'],
];
const OVA = [
  ['primary oocytes', 1, 'each primary oocyte gives only one ovum; the other products are polar bodies'],
  ['secondary oocytes', 1, 'a secondary oocyte finishes meiosis II (after a sperm enters) and gives one ovum and a polar body'],
];

export default {
  'hrp-gametes': {
    title: 'gametes from a number of cells',
    make(r) {
      const male = r() < 0.65, list = male ? SPERM : OVA, [cell, f, why] = list[Math.floor(r() * list.length)];
      const cells = pick(r, 20, 500, 5), answer = cells * f;
      return { cells, f,
        q: `<p>How many ${male ? 'sperm' : 'ova'} can form from ${cells} ${cell}, if every cell completes development?</p>`,
        answer, unit: male ? 'sperm' : 'ova', tol: 0, abs: 0.5,
        hint: 'Spermatogenesis keeps all four products of meiosis; oogenesis keeps one and puts the rest into polar bodies.',
        solution: steps(`Here ${why}.`, `${cells} × ${f} = <b>${answer}</b>.`) };
    },
    verify: (x) => x.f * x.cells,
  },
  'hrp-ovulation': {
    title: 'day of ovulation in a cycle',
    make(r) {
      const L = pick(r, 24, 36), answer = L - 14;
      return { L,
        q: `<p>A woman has a regular menstrual cycle of ${L} days, counting day 1 as the first day of bleeding. On about which day does ovulation happen?</p>`,
        answer, unit: 'day', tol: 0, abs: 0.5,
        hint: 'The luteal phase (corpus luteum lifespan) is fairly fixed at about 14 days. The follicular phase takes up whatever is left.',
        solution: steps(`Luteal phase ≈ 14 days, ending when the next period starts on day ${L + 1}.`, `Ovulation ≈ ${L} − 14 = day <b>${answer}</b>.`, `So the follicular phase here is about ${answer - 1} days, including the menstrual days.`) };
    },
    verify: (x) => x.L - 14,
  },
};
