// Live problems for Biodiversity and conservation.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  'bdv-species-area': {
    title: 'species from the species-area relationship',
    make(r) {
      const C = pick(r, 5, 50), Z = pick(r, 0.1, 0.3, 0.05), e = pick(r, 1, 5), A = 10 ** e;
      const answer = C * Math.pow(A, Z);
      return { C, Z, A,
        q: `<p>For a group of islands, the species-area relationship is S = C·A<sup>Z</sup> with C = ${C} and Z = ${Z}. About how many species would an island of ${n(A, 6)} km² hold?</p>`,
        answer, unit: 'species', tol: 0.01,
        hint: 'Take logs: log S = log C + Z log A. Since A is a power of 10, log A is easy.',
        solution: steps(`log A = ${e}, so Z log A = ${Z} × ${e} = ${n(Z * e, 4)}.`, `A<sup>Z</sup> = 10<sup>${n(Z * e, 4)}</sup> = ${n(Math.pow(A, Z), 4)}.`, `S = ${C} × ${n(Math.pow(A, Z), 4)} ≈ <b>${n(answer)}</b>.`) };
    },
    verify: (x) => Math.pow(10, Math.log10(x.C) + x.Z * Math.log10(x.A)),
  },
  'bdv-area-ratio': {
    title: 'how species change when area changes',
    make(r) {
      const Z = pick(r, 0.1, 0.3, 0.05), k = [2, 4, 8, 10, 100][Math.floor(r() * 5)], S1 = pick(r, 20, 400, 10);
      const answer = S1 * Math.pow(k, Z);
      return { Z, k, S1,
        q: `<p>A forest patch holds ${S1} species of birds. If Z = ${Z} for this region, about how many species would a patch ${k} times larger hold?</p>`,
        answer, unit: 'species', tol: 0.01,
        hint: 'From S = C·A<sup>Z</sup>, S₂/S₁ = (A₂/A₁)<sup>Z</sup>; C cancels.',
        solution: steps(`S₂/S₁ = ${k}<sup>${Z}</sup> = ${n(Math.pow(k, Z), 4)}.`, `S₂ = ${S1} × ${n(Math.pow(k, Z), 4)} ≈ <b>${n(answer)}</b>.`, 'Read the other way, this is why cutting a habitat into a smaller area loses species.') };
    },
    verify: (x) => Math.exp(Math.log(x.S1) + x.Z * Math.log(x.k)),
  },
};
