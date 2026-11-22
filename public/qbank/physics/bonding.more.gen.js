// Extra question shapes for bonding (templates bd-m31..m35). Imported by bonding.js.
import { choose, round, fmt } from '../_util.js';
import { msqOf, pickMcq, factMcq, oomMcq } from './_more.js';

export default [
  { id: 'bd-m31', type: 'msq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'properties by bond type', format: 'statements',
    make(r) {
      const B = choose(r, [
        ['solid argon (van der Waals)', [
          ['The attraction between atoms falls off as $1/r^6$', true, 'Fluctuating-dipole (London) attraction.'],
          ['The cohesive energy is of order 0.1 eV per atom or less', true, 'Argon: about 0.08 eV per atom; it melts at 84 K.'],
          ['It is a good electrical conductor', false, 'Closed shells: no free electrons.'],
          ['The bonds are strongly directional', false, 'Van der Waals forces are central; the atoms pack as close-packed fcc.'],
          ['It crystallises in a close-packed structure', true, 'Non-directional forces favour close packing (fcc).'],
          ['The cohesive energy is several eV per atom', false, 'That is typical of covalent and ionic solids.'],
        ]],
        ['diamond (covalent)', [
          ['The bonds are strongly directional, with tetrahedral angles of 109.5°', true, 'sp$^3$ hybrid orbitals.'],
          ['Each atom has only four nearest neighbours, so the structure is far from close-packed', true, 'Packing fraction 0.34.'],
          ['The cohesive energy is of order 7 eV per atom', true, 'About 7.4 eV per atom.'],
          ['It conducts electricity well because the electrons are shared', false, 'All valence electrons are in filled bonding states; the gap is about 5.5 eV.'],
          ['The bonding is non-directional', false, 'Covalent bonds point along definite directions.'],
          ['It is soft because the bonds are weak', false, 'It is the hardest natural material.'],
        ]],
        ['sodium metal (metallic)', [
          ['The valence electrons are shared by the whole crystal', true, 'A sea of conduction electrons.'],
          ['It is ductile because the bonding is non-directional', true, 'Planes can slip without breaking specific bonds.'],
          ['Its cohesive energy is about 1 eV per atom', true, 'About 1.1 eV per atom.'],
          ['It is an electrical insulator at room temperature', false, 'It is an excellent conductor.'],
          ['Its bonding comes from transfer of an electron to a neighbour, forming ion pairs', false, 'That is ionic bonding.'],
          ['The bonds are strongly directional', false, 'Metallic bonding is non-directional.'],
        ]],
        ['sodium chloride (ionic)', [
          ['The cohesion comes mainly from the Coulomb (Madelung) energy of the ions', true, 'About 8 eV per ion pair in the lattice.'],
          ['It conducts poorly as a solid but well when molten', true, 'Ions can move only in the melt.'],
          ['The short-range repulsion comes from overlap of filled electron shells (Pauli principle)', true, 'Modelled as $B/r^n$ or $\\lambda e^{-r/\\rho}$.'],
          ['It is a good electrical conductor as a solid', false, 'Its electrons are tightly bound; the gap is about 9 eV.'],
          ['The attraction falls off as $1/r^6$', false, 'Coulomb attraction falls as $1/r$.'],
          ['Each ion has four nearest neighbours', false, 'Rock salt is sixfold coordinated.'],
        ]],
        ['ice (hydrogen-bonded)', [
          ['Each H atom sits between two O atoms, closer to one of them', true, 'O-H about 1.0 Å, H$\\cdots$O about 1.8 Å.'],
          ['A hydrogen bond is typically about 0.2 eV, between van der Waals and covalent strengths', true, 'About 0.2 to 0.3 eV.'],
          ['Its open tetrahedral network makes ice less dense than water', true, 'Each molecule has four hydrogen-bonded neighbours.'],
          ['Hydrogen bonds are as strong as covalent bonds', false, 'They are roughly ten times weaker.'],
          ['The bonding is purely van der Waals', false, 'The polar O-H bond gives a much stronger, directional bond.'],
          ['It is close-packed', false, 'Ice Ih is an open tetrahedral structure.'],
        ]],
      ]);
      const not = r() < 0.4;
      const m = msqOf(r, B[1], { not });
      return { q: `Which statements about ${B[0]} are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Directional bonds (covalent, hydrogen) give open structures; non-directional ones (van der Waals, metallic, ionic) pack closely.' };
    } },
  { id: 'bd-m32', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'Lennard-Jones curve', format: 'graph in words',
    make(r) {
      const O = {
        zero: 'the potential energy is zero and the force is repulsive',
        min: 'the potential has its minimum, $-\\varepsilon$, and the force is zero',
        infl: 'the curve has an inflection point, where the attractive force is greatest',
        steep: 'the potential is positive and rises very steeply (as $r^{-12}$)',
        tail: 'the potential is negative and tends to zero as $-4\\varepsilon(\\sigma/r)^6$',
      };
      const C = choose(r, [
        ['$r = \\sigma$', 'zero', '$4\\varepsilon(1 - 1) = 0$; here the slope is negative, so the force $-dV/dr$ is positive (repulsive).'],
        [`$r = 2^{1/6}\\sigma \\approx ${round(2 ** (1 / 6), 3)}\\sigma$`, 'min', 'Setting $dV/dr = 0$ gives $r^6 = 2\\sigma^6$, where $V = 4\\varepsilon(\\tfrac14 - \\tfrac12) = -\\varepsilon$.'],
        [`$r = (26/7)^{1/6}\\sigma \\approx ${round((26 / 7) ** (1 / 6), 3)}\\sigma$`, 'infl', 'Setting $d^2V/dr^2 = 0$ gives $r^6 = (26/7)\\sigma^6$; beyond the minimum the restoring force grows up to this point and then weakens.'],
        [`$r = ${choose(r, ['0.8', '0.85', '0.9'])}\\sigma$`, 'steep', 'Inside $\\sigma$ the $(\\sigma/r)^{12}$ term dominates.'],
        [`$r = ${choose(r, ['2.5', '3', '4'])}\\sigma$`, 'tail', 'At large $r$ only the attractive $r^{-6}$ term matters.'],
      ]);
      const o = pickMcq(r, O[C[1]], Object.keys(O).filter((k) => k !== C[1]).map((k) => O[k]));
      return { q: `For the Lennard-Jones potential $V(r) = 4\\varepsilon[(\\sigma/r)^{12} - (\\sigma/r)^6]$, at ${C[0]}`, ...o, sol: C[2],
        trap: 'The zero of $V$ (at $\\sigma$) is not the equilibrium separation (at $2^{1/6}\\sigma$).' };
    } },
  { id: 'bd-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Madelung constant', format: 'which is NOT',
    make(r) {
      const T = [
        [`For a 1D chain of alternating $\\pm$ ions, $\\alpha = 2\\ln 2 \\approx ${round(2 * Math.LN2, 3)}$`, '$2(1 - \\tfrac12 + \\tfrac13 - \\ldots) = 2\\ln 2$.'],
        ['For NaCl, $\\alpha \\approx 1.748$ (referred to the nearest-neighbour distance)', 'The standard rock-salt value.'],
        ['CsCl has a slightly larger Madelung constant than NaCl', '1.763 against 1.748 (both per nearest-neighbour distance).'],
        ['The lattice sum is only conditionally convergent, so the order of summation matters', 'Ewald or Evjen methods group the ions in neutral shells.'],
        ['$\\alpha$ depends only on the geometry of the structure', 'It is a pure number for each structure type.'],
      ];
      const F = [
        ['For a 1D chain of alternating $\\pm$ ions, $\\alpha = \\ln 2$', 'Each ion has neighbours on both sides, giving $2\\ln 2$.'],
        ['The lattice sum converges absolutely, so any order of summation gives the same value', 'It converges only conditionally.'],
        ['NaCl has a larger Madelung constant than CsCl', 'CsCl (8 neighbours) is slightly higher.'],
        ['The Madelung energy is repulsive and must be balanced by an attraction', 'It is attractive; the short-range overlap is the repulsion.'],
        ['$\\alpha$ for NaCl equals its coordination number, 6', 'Further shells (12 like ions at $\\sqrt2 r$, and so on) reduce it to 1.748.'],
      ];
      const not = r() < 0.65;
      const o = factMcq(r, T, F, not);
      return { q: `About the Madelung constant $\\alpha$ of ionic crystals, which ONE statement is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...o,
        trap: 'The alternating series converges only conditionally: summing all positive terms first gives nonsense.' };
    } },
  { id: 'bd-m34', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'cohesive energy', format: 'ranking',
    make(r) {
      const vdw = choose(r, [['solid neon', 0.02], ['solid argon', 0.08], ['solid krypton', 0.12], ['solid xenon', 0.16]]);
      const soft = choose(r, [['sodium', 1.11], ['potassium', 0.93], ['caesium', 0.80], ['mercury', 0.67]]);
      const mid = choose(r, [['copper', 3.49], ['aluminium', 3.39], ['iron', 4.28], ['silicon', 4.63]]);
      const hard = choose(r, [['diamond', 7.37], ['tungsten', 8.90], ['tantalum', 8.10], ['molybdenum', 6.82]]);
      const big = r() < 0.5, set = [vdw, soft, mid, hard], ans = big ? hard : vdw;
      const o = pickMcq(r, ans[0], set.filter((s) => s !== ans).map((s) => s[0]));
      return { q: `Which ONE of these solids has the ${big ? '<b>largest</b>' : '<b>smallest</b>'} cohesive energy per atom?`, ...o,
        sol: `Approximate cohesive energies per atom: ${set.map((s) => `${s[0]} ${s[1]} eV`).join(', ')}. ${big ? `Strong covalent bonding (diamond) or partly filled d bands (refractory metals) give the largest values; ${ans[0]} melts at thousands of kelvin.` : `Van der Waals bonding between closed-shell atoms is the weakest, so ${ans[0]} melts at tens of kelvin.`}`,
        trap: 'Melting points follow cohesive energy roughly: tungsten melts near 3700 K, argon at 84 K.' };
    } },
  { id: 'bd-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Coulomb energy against thermal energy', format: 'order of magnitude',
    make(r) {
      const rr = round(2.3 + 1.2 * r(), 2), T = choose(r, [[4, '4 K (liquid helium)'], [77, '77 K (liquid nitrogen)'], [300, '300 K (room temperature)'], [1000, '1000 K']]);
      const E = 14.40 / rr, kT = 8.617e-5 * T[0], x = E / kT;
      const o = oomMcq(r, x);
      return { q: `Two ions of charge $\\pm e$ sit $${rr}$ Å apart in an ionic crystal. The ratio of their Coulomb energy $e^2/4\\pi\\varepsilon_0 r$ to the thermal energy $k_BT$ at ${T[1]} is closest to`, ...o,
        sol: `$e^2/4\\pi\\varepsilon_0 = 14.40$ eV Å, so the Coulomb energy is $14.40/${rr} = ${round(E, 2)}$ eV, while $k_BT = ${fmt(kT, 3)}$ eV. The ratio is $${fmt(x, 3)}$, nearest $10^{${o.k}}$. Ionic bonds are far stronger than thermal energy, which is why ionic crystals melt only near 1000 K or above.`,
        trap: 'Use $e^2/4\\pi\\varepsilon_0 \\approx 14.4$ eV Å and $k_BT \\approx 1/40$ eV at room temperature.' };
    } },
];
