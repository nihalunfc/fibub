// Live problems for Ecosystem.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

const cap = (s) => s[0].toUpperCase() + s.slice(1);
const LEVELS = ['producers', 'primary consumers (herbivores)', 'secondary consumers', 'tertiary consumers'];
export default {
  'eco-ten': {
    title: 'energy at a trophic level by the 10 per cent law',
    make(r) {
      const fromTop = r() < 0.3;
      const E = pick(r, 1, 99) * (fromTop ? 10 : 1000), k = pick(r, 1, 3);
      const answer = fromTop ? E * 10 ** k : E / 10 ** k;
      return { E, k, fromTop,
        q: fromTop
          ? `<p>By the 10 per cent law, ${LEVELS[k]} in a food chain receive ${n(E)} J. How much energy was fixed by the producers?</p>`
          : `<p>Producers in a food chain fix ${n(E)} J of energy. By the 10 per cent law, how much energy reaches the ${LEVELS[k]}?</p>`,
        answer, unit: 'J', tol: 0.001,
        hint: 'Only about 10% of the energy at one trophic level passes to the next. Count the steps between the two levels.',
        solution: fromTop
          ? steps(`${cap(LEVELS[k])} are ${k} step${k > 1 ? 's' : ''} above producers.`, `Going down, multiply by 10 each step: ${n(E)} × 10<sup>${k}</sup> = <b>${n(answer)} J</b>.`)
          : steps(`${cap(LEVELS[k])} are ${k} step${k > 1 ? 's' : ''} above producers.`, `${n(E)} × (0.1)<sup>${k}</sup> = <b>${n(answer)} J</b>.`) };
    },
    verify: (x) => (x.fromTop ? x.E * Math.pow(0.1, -x.k) : x.E * Math.pow(0.1, x.k)),
  },
  'eco-npp': {
    title: 'net primary productivity',
    make(r) {
      const gpp = pick(r, 2000, 30000, 500), rp = pick(r, 20, 70, 5), R = gpp * rp / 100, askGpp = r() < 0.3;
      const npp = gpp - R, answer = askGpp ? gpp : npp;
      return { gpp, R, npp, askGpp,
        q: askGpp
          ? `<p>A grassland has a net primary productivity of ${n(npp, 6)} kcal m⁻² yr⁻¹, and its plants use ${n(R, 6)} kcal m⁻² yr⁻¹ in respiration. What is its gross primary productivity?</p>`
          : `<p>A forest has a gross primary productivity of ${n(gpp, 6)} kcal m⁻² yr⁻¹, and its plants use ${rp}% of it in respiration. What is its net primary productivity?</p>`,
        answer, unit: 'kcal m⁻² yr⁻¹', tol: 0.001,
        hint: 'NPP = GPP − R, where R is the energy the plants use up in respiration. NPP is what is left for consumers and decomposers.',
        solution: askGpp
          ? steps(`GPP = NPP + R.`, `= ${n(npp, 6)} + ${n(R, 6)} = <b>${n(gpp, 6)}</b>.`)
          : steps(`R = ${rp}% of ${n(gpp, 6)} = ${n(R, 6)}.`, `NPP = ${n(gpp, 6)} − ${n(R, 6)} = <b>${n(npp, 6)}</b>.`) };
    },
    verify: (x) => (x.askGpp ? x.npp + x.R : x.gpp * (1 - x.R / x.gpp)),
  },
};
