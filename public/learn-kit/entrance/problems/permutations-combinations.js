// Live problems for Permutations and combinations.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const fact = (k) => { let f = 1; for (let i = 2; i <= k; i++) f *= i; return f; };
const C = (a, b) => (b < 0 || b > a ? 0 : Math.round(fact(a) / (fact(b) * fact(a - b))));
const counts = (w) => { const m = {}; for (const ch of w) m[ch] = (m[ch] || 0) + 1; return m; };

export default {
  'pc-word': {
    title: 'arrangements of a word with repeated letters',
    make(r) {
      const words = ['BANANA', 'PEPPER', 'COMMITTEE', 'STATISTICS', 'ALGEBRA', 'CALCULUS', 'ASSESSMENT', 'TOMATO', 'PARALLEL', 'BALLOON'];
      const word = words[Math.floor(r() * words.length)], m = counts(word), reps = Object.entries(m).filter(([, c]) => c > 1);
      const answer = fact(word.length) / Object.values(m).reduce((p, c) => p * fact(c), 1);
      return { word,
        q: `<p>In how many different ways can the letters of the word ${word} be arranged?</p>`,
        answer, unit: 'ways', tol: 0, abs: 0.5,
        hint: 'n letters in which one letter repeats p times, another q times, …: n!/(p! q! …). Swapping identical letters gives nothing new.',
        solution: steps(`${word} has ${word.length} letters; repeated: ${reps.map(([ch, c]) => `${ch} × ${c}`).join(', ')}.`, `Arrangements = ${word.length}!/(${reps.map(([, c]) => c + '!').join(' ')}) = ${fact(word.length).toLocaleString('en-IN')}/${reps.reduce((p, [, c]) => p * fact(c), 1)} = <b>${answer.toLocaleString('en-IN')}</b>.`) };
    },
    // place the letters one kind at a time: choose positions for each kind from those still free
    verify: (x) => { let left = x.word.length, ways = 1; for (const c of Object.values(counts(x.word))) { ways *= C(left, c); left -= c; } return ways; },
  },
  'pc-committee': {
    title: 'a committee with "at least" a number of women',
    make(r) {
      const men = pick(r, 4, 9), women = pick(r, 3, 7), k = pick(r, 3, Math.min(6, men + 1)), j = pick(r, 1, Math.min(2, women));
      let answer = 0; const parts = [];
      for (let w = j; w <= Math.min(k, women); w++) { const t = C(women, w) * C(men, k - w); answer += t; parts.push(`${women}C${w} × ${men}C${k - w} = ${t}`); }
      return { men, women, k, j,
        q: `<p>A committee of ${k} is to be chosen from ${men} men and ${women} women. In how many ways can this be done if it must contain at least ${j} wom${j === 1 ? 'a' : 'e'}n?</p>`,
        answer, unit: 'ways', tol: 0, abs: 0.5,
        hint: '"At least" means add up the cases: exactly j women, exactly j + 1, … Or take all committees and subtract the ones with too few women.',
        solution: steps(...parts.map((p, i) => `${j + i} wom${j + i === 1 ? 'a' : 'e'}n: ${p}.`), `Total = <b>${answer}</b>.`) };
    },
    verify: (x) => { let bad = 0; for (let w = 0; w < x.j; w++) bad += C(x.women, w) * C(x.men, x.k - w); return C(x.men + x.women, x.k) - bad; },
  },
  'pc-stars': {
    title: 'positive integer solutions by stars and bars',
    make(r) {
      const k = pick(r, 3, 5), low = pick(r, 0, 2), N = pick(r, k * low + 2, k * low + 14);
      const answer = C(N - k * low + k - 1, k - 1);
      return { k, low, N,
        q: `<p>How many solutions does x₁ + … + x<sub>${k}</sub> = ${N} have in integers with every x<sub>i</sub> ≥ ${low}?</p>`,
        answer, unit: 'solutions', tol: 0, abs: 0.5,
        hint: `First give each variable its minimum ${low}. Then share out the rest freely: m identical items into k boxes (empty allowed) in C(m + k − 1, k − 1) ways.`,
        solution: steps(`Put y<sub>i</sub> = x<sub>i</sub> − ${low} ≥ 0. Then y₁ + … + y<sub>${k}</sub> = ${N} − ${k * low} = ${N - k * low}.`, `Stars and bars: ${N - k * low} stars and ${k - 1} bars in a row: C(${N - k * low + k - 1}, ${k - 1}).`, `= <b>${answer}</b>.`) };
    },
    verify: (x) => { // count by dynamic programming
      let ways = new Array(x.N + 1).fill(0); ways[0] = 1;
      for (let i = 0; i < x.k; i++) { const nx = new Array(x.N + 1).fill(0); for (let s = 0; s <= x.N; s++) if (ways[s]) for (let v = x.low; s + v <= x.N; v++) nx[s + v] += ways[s]; ways = nx; }
      return ways[x.N];
    },
  },
};
