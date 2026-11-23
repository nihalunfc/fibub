// Class 11 Biology, Animal Kingdom: live problems (original fibub questions). Ids start with c11b-animalk-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c11b-animalk-legs': {
    title: 'legs on a collection of arthropods',
    make(r) {
      const ins = pick(r, 2, 12), sp = pick(r, 1, 8), pr = pick(r, 1, 6);
      return { ins, sp, pr, q: `<p>A school's biology box has ${ins} insects, ${sp} spiders and ${pr} prawns, all with the usual number of walking legs (insects 3 pairs, spiders 4 pairs, prawns 5 pairs). How many walking legs are there in total?</p>`, answer: ins * 6 + sp * 8 + pr * 10, unit: 'legs', tol: 0.001,
        hint: 'Pairs × 2 gives legs per animal. Then multiply by the number of animals.', solution: steps(`Insects: ${ins} × 6 = ${ins * 6}.`, `Spiders: ${sp} × 8 = ${sp * 8}.`, `Prawns: ${pr} × 10 = ${pr * 10}.`, `Total = <b>${ins * 6 + sp * 8 + pr * 10}</b> legs.`) };
    },
    verify: (x) => { let t = 0; for (let i = 0; i < x.ins; i++) t += 3 * 2; for (let i = 0; i < x.sp; i++) t += 4 * 2; for (let i = 0; i < x.pr; i++) t += 5 * 2; return t; },
  },
  'c11b-animalk-tubefeet': {
    title: 'tube feet of a starfish',
    make(r) {
      const rows = choose(r, [2, 2, 2]), per = pick(r, 50, 200, 10);
      return { rows, per, q: `<p>A starfish has 5 arms. Each arm has ${rows} rows of tube feet with ${per} tube feet in each row. How many tube feet does the starfish have?</p>`, answer: 5 * rows * per, unit: 'tube feet', tol: 0.001,
        hint: 'Arms × rows × feet per row.', solution: steps(`Rows in the whole animal = 5 × ${rows} = ${5 * rows}.`, `Tube feet = ${5 * rows} × ${per} = <b>${n(5 * rows * per)}</b>.`) };
    },
    verify: (x) => { let t = 0; for (let a = 0; a < 5; a++) for (let q = 0; q < x.rows; q++) t += x.per; return t; },
  },
  'c11b-animalk-eggs': {
    title: 'fish eggs that survive',
    make(r) {
      const eggs = choose(r, [100000, 250000, 500000, 1000000]), pct = choose(r, [0.1, 0.2, 0.5, 1]);
      return { eggs, pct, q: `<p>A female fish lays ${n(eggs)} eggs in the water, with external fertilisation. Only ${pct} % of the eggs grow into adult fish. How many adults is that?</p>`, answer: eggs * pct / 100, unit: 'fish', tol: 0.01,
        hint: 'Find the percentage of the number of eggs.', solution: steps(`Adults = ${pct}/100 × ${n(eggs)}.`, `= <b>${n(eggs * pct / 100)}</b> fish. A mammal that gives birth to a few well-protected young needs far fewer.`) };
    },
    verify: (x) => (x.eggs * x.pct * 10) / 1000,
  },
  'c11b-animalk-heart': {
    title: 'heartbeats in a day',
    make(r) {
      const [nm, bpm] = choose(r, [['an adult human', 72], ['a pigeon', 200], ['an elephant', 30], ['a cat', 150]]), hrs = choose(r, [1, 6, 24]);
      return { bpm, hrs, q: `<p>The heart of ${nm} beats about ${bpm} times a minute. How many times does it beat in ${hrs} hour${hrs > 1 ? 's' : ''}? (A bird or mammal has a four-chambered heart.)</p>`, answer: bpm * 60 * hrs, unit: 'beats', tol: 0.01,
        hint: 'Minutes = hours × 60. Then beats = rate × minutes.', solution: steps(`${hrs} h = ${60 * hrs} min.`, `Beats = ${bpm} × ${60 * hrs} = <b>${n(bpm * 60 * hrs)}</b>.`) };
    },
    verify: (x) => (x.bpm / 60) * (x.hrs * 3600),
  },
};
