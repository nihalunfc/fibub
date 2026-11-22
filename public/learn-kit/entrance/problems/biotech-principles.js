// Live problems for Biotechnology: principles and processes.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  'btp-pcr': {
    title: 'DNA copies after PCR cycles',
    make(r) {
      const m = pick(r, 1, 20), c = pick(r, 3, 12), answer = m * 2 ** c;
      return { m, c,
        q: `<p>A PCR starts with ${m} double-stranded cop${m > 1 ? "ies" : "y"} of a target DNA. Assuming every cycle doubles the DNA perfectly, how many copies are there after ${c} cycles?</p>`,
        answer, unit: 'copies', tol: 0, abs: 0.5,
        hint: 'Each cycle (denature, anneal, extend) doubles the number of copies, so after n cycles there are start × 2ⁿ.',
        solution: steps(`2<sup>${c}</sup> = ${2 ** c}.`, `${m} × ${2 ** c} = <b>${n(answer, 8)}</b>.`) };
    },
    verify: (x) => { let v = x.m; for (let i = 0; i < x.c; i++) v += v; return v; },
  },
  'btp-site': {
    title: 'expected cuts by a restriction enzyme',
    make(r) {
      const k = [4, 6, 8][Math.floor(r() * 3)], Ls = k === 8 ? [4.6e6, 1e6, 3e6] : [4.6e6, 50000, 1e6, 262144], L = Ls[Math.floor(r() * Ls.length)];
      const every = 4 ** k, answer = L / every;
      return { k, L,
        q: `<p>A restriction enzyme recognises ${k === 8 ? 'an' : 'a'} ${k}-base-pair sequence. If the four bases are equally common and random, about how many times would it cut a ${n(L, 7)} bp DNA?</p>`,
        answer, unit: 'cuts', tol: 0.01,
        hint: 'Each position matches one base with chance 1/4, so a k-base site turns up once in every 4ᵏ base pairs on average.',
        solution: steps(`A ${k}-bp site appears once every 4<sup>${k}</sup> = ${n(every, 6)} bp.`, `Expected cuts = ${n(L, 7)} ÷ ${n(every, 6)} = <b>${n(answer)}</b>.`) };
    },
    verify: (x) => x.L * Math.pow(0.25, x.k),
  },
  'btp-fragments': {
    title: 'fragments from cutting linear or circular DNA',
    make(r) {
      const sites = pick(r, 1, 9), circ = r() < 0.5, answer = circ ? sites : sites + 1;
      return { sites, circ,
        q: `<p>A ${circ ? 'circular plasmid' : 'linear DNA molecule'} has ${sites} site${sites > 1 ? 's' : ''} for EcoRI. After complete digestion, how many fragments are there?</p>`,
        answer, unit: 'fragments', tol: 0, abs: 0.5,
        hint: 'Draw it. A cut in a line makes one more piece each time; the first cut in a circle only opens it into a line.',
        solution: steps(circ ? `A circle with ${sites} cut${sites > 1 ? 's' : ''} gives ${sites} piece${sites > 1 ? 's' : ''} (each cut joins up with the next around the ring).` : `A line with ${sites} cut${sites > 1 ? 's' : ''} gives ${sites} + 1 pieces.`, `Answer: <b>${answer}</b>.`) };
    },
    verify: (x) => (x.circ ? x.sites : x.sites + 1),
  },
};
