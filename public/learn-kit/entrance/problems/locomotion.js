// Live problems for Locomotion and movement.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const PARTS = [
  ['one fore limb', 30], ['one hind limb', 30], ['the pectoral girdle (both sides)', 4], ['the pelvic girdle (both sides)', 2],
  ['the skull (cranial + facial)', 22], ['the vertebral column', 26], ['the ribs', 24], ['the sternum', 1], ['the hyoid', 1], ['the ear ossicles (both ears)', 6],
];

export default {
  'loco-sarcomere': {
    title: 'band lengths in a contracting sarcomere',
    make(r) {
      const A = 1.6, actin = 1.0, L = pick(r, 2.4, 2.8, 0.05), d = pick(r, 0.1, +(L - 2.0).toFixed(2), 0.05), askH = r() < 0.5;
      const L2 = +(L - d).toFixed(3), answer = +(askH ? L2 - 2 * actin : L2 - A).toFixed(3);
      return { L, d, askH, A, actin,
        q: `<p>A sarcomere is ${L} µm long at rest. Its thick (myosin) filaments are ${A} µm long and each set of thin (actin) filaments reaches ${actin} µm in from its Z line. The sarcomere shortens by ${d} µm. What is the length of the ${askH ? 'H zone' : 'I band (one whole I band, Z line in the middle)'} now?</p>`,
        answer, unit: 'µm', tol: 0.005, abs: 0.005,
        hint: askH ? 'The H zone is the middle part of the A band with no actin: sarcomere length − 2 × actin length.' : 'The A band (myosin length) never changes, so the I band = sarcomere length − A band.',
        solution: steps(`New sarcomere length = ${L} − ${d} = ${n(L2)} µm.`, askH ? `H zone = ${n(L2)} − 2 × ${actin} = <b>${n(answer)} µm</b>.` : `I band = ${n(L2)} − ${A} = <b>${n(answer)} µm</b>.`, 'The A band stays 1.6 µm; filaments slide, they do not shorten.') };
    },
    verify: (x) => (x.askH ? (x.L - 2 * x.actin) - x.d : (x.L - x.A) - x.d),
  },
  'loco-bone-count': {
    title: 'counting bones in parts of the human skeleton',
    make(r) {
      const pool = PARTS.map((_, i) => i), idx = [];
      for (let k = 0; k < 3; k++) idx.push(pool.splice(Math.floor(r() * pool.length), 1)[0]);
      const answer = idx.reduce((s, i) => s + PARTS[i][1], 0);
      return { idx,
        q: `<p>How many bones are there in ${idx.map((i) => PARTS[i][0]).join(', ').replace(/, ([^,]*)$/, ' and $1')} of an adult human, taken together?</p>`,
        answer, unit: 'bones', tol: 0,
        hint: 'Limb 30 each (1 + 2 + 8 or 7 + 5 + 14, with the patella in the leg); pectoral girdle 2 per side, pelvic 1 per side; skull 22; vertebrae 26; ribs 12 pairs; sternum 1; hyoid 1; ossicles 3 per ear.',
        solution: steps(...idx.map((i) => `${PARTS[i][0]}: ${PARTS[i][1]}`), `Total = <b>${answer}</b>.`) };
    },
    // start from the whole skeleton (206, with two of each limb) and take away everything not asked for
    verify: (x) => 206 - PARTS.reduce((s, [, v], i) => s + v * ((i < 2 ? 2 : 1) - (x.idx.includes(i) ? 1 : 0)), 0),
  },
};
