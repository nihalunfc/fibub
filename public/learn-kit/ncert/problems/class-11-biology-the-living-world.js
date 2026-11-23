// Class 11 Biology, The Living World: live problems (original fibub questions). Ids start with c11b-living-.
import { pick, choose, n, steps } from './_util.js';

const RANKS = ['Kingdom', 'Phylum', 'Class', 'Order', 'Family', 'Genus', 'Species'];
const NAMES = [['Mammalia', 'class'], ['Chordata', 'phylum'], ['Felidae', 'family'], ['Carnivora', 'order'], ['Panthera', 'genus'], ['Animalia', 'kingdom'], ['Solanaceae', 'family'], ['Primata', 'order'], ['indica', 'species'], ['Insecta', 'class']];

export default {
  'c11b-living-genus': {
    title: 'species in a family',
    make(r) {
      const genera = pick(r, 2, 6), per = pick(r, 3, 9);
      return { genera, per, q: `<p>A plant family in a Kerala forest has ${genera} genera. Each genus has ${per} species. How many species does the family have?</p>`, answer: genera * per, unit: '', tol: 0.001,
        hint: 'Every genus has the same number of species, so multiply.', solution: steps(`Species = genera × species per genus.`, `${genera} × ${per} = <b>${genera * per}</b>.`) };
    },
    verify: (x) => { let s = 0; for (let i = 0; i < x.genera; i++) s += x.per; return s; },
  },
  'c11b-living-rank': {
    title: 'which rank is it?',
    make(r) {
      const [nm, rk] = choose(r, NAMES), pos = RANKS.map((x) => x.toLowerCase()).indexOf(rk) + 1;
      return { nm, rk, pos, q: `<p>Counting from the largest group (Kingdom = 1) to the smallest (Species = 7), which number is the rank at which <b>${nm}</b> sits? (Kingdom, Phylum, Class, Order, Family, Genus, Species.)</p>`, answer: pos, unit: '', tol: 0.001,
        hint: `${nm} is a ${rk}. Count its place in Kingdom, Phylum, Class, Order, Family, Genus, Species.`, solution: steps(`${nm} is a ${rk}.`, `Order of ranks: 1 Kingdom, 2 Phylum, 3 Class, 4 Order, 5 Family, 6 Genus, 7 Species.`, `So the number is <b>${pos}</b>.`) };
    },
    verify: (x) => RANKS.length - RANKS.map((s) => s.toLowerCase()).reverse().indexOf(x.rk),
  },
  'c11b-living-couplets': {
    title: 'questions in a key',
    make(r) {
      const orgs = pick(r, 4, 20);
      return { orgs, q: `<p>You build a dichotomous key for ${orgs} different plants from your school garden. Every question splits a group into exactly two. What is the smallest number of questions (couplets) the whole key must contain so that each plant ends alone?</p>`, answer: orgs - 1, unit: '', tol: 0.001,
        hint: 'Each couplet turns one group into two groups. Start with 1 group and finish with as many groups as plants.', solution: steps(`Start with 1 group. Every couplet adds one group (one splits into two).`, `To reach ${orgs} groups you need ${orgs} − 1 = <b>${orgs - 1}</b> couplets.`) };
    },
    verify: (x) => { let g = 1, c = 0; while (g < x.orgs) { g++; c++; } return c; },
  },
  'c11b-living-cells': {
    title: 'cell doubling',
    make(r) {
      const mins = choose(r, [20, 30, 60]), hours = choose(r, [2, 3, 4]), div = hours * 60 / mins;
      return { mins, hours, div, q: `<p>A bacterial cell divides into two every ${mins} minutes. Starting from one cell and with plenty of food, how many cells are there after ${hours} hours?</p>`, answer: 2 ** div, unit: 'cells', tol: 0.001,
        hint: 'Count how many divisions fit in the time. Each division doubles the number.', solution: steps(`Divisions = ${hours} × 60 ÷ ${mins} = ${div}.`, `Cells = 2<sup>${div}</sup> = <b>${n(2 ** div)}</b>.`) };
    },
    verify: (x) => { let c = 1; for (let t = x.mins; t <= x.hours * 60; t += x.mins) c *= 2; return c; },
  },
  'c11b-living-insects': {
    title: 'share of insects',
    make(r) {
      const total = choose(r, [1700000, 1800000, 2000000]), pct = choose(r, [45, 50, 55, 60]);
      return { total, pct, q: `<p>About ${n(total)} species have been named, and ${pct} % of them are insects. About how many named insect species is that?</p>`, answer: total * pct / 100, unit: 'species', tol: 0.01,
        hint: 'Find pct per cent of the total.', solution: steps(`Insects = ${pct}/100 × ${n(total)}.`, `= <b>${n(total * pct / 100)}</b> species.`) };
    },
    verify: (x) => (x.total / 100) * x.pct,
  },
};
