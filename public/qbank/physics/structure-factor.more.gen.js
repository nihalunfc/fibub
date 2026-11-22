// Extra question shapes for structure-factor (templates sf-m31..m35). Imported by structure-factor.js.
import { int, choose, round } from '../_util.js';
import { msqOf, pickMcq, factMcq } from './_more.js';

export default [
  { id: 'sf-m31', type: 'mcq', level: 3, exams: ['gate', 'net', 'jam'], sub: 'indexing a powder pattern', format: 'match the system',
    make(r) {
      const L = {
        sc: ['simple cubic', [1, 2, 3, 4, 5, 6, 8], 'every $h^2 + k^2 + l^2$ except 7 (which no three squares can make)'],
        bcc: ['body-centred cubic', [2, 4, 6, 8, 10, 12, 14], '$h + k + l$ even, so $N = 2, 4, 6, 8, \\ldots$ (ratios 1:2:3:4:5:6:7, with no gap at 7)'],
        fcc: ['face-centred cubic', [3, 4, 8, 11, 12, 16, 19], '$h, k, l$ all odd or all even: $N = 3, 4, 8, 11, 12, \\ldots$'],
        dia: ['diamond cubic', [3, 8, 11, 16, 19, 24, 27], 'fcc rules plus the basis: all even with $h + k + l = 4n$, or all odd: $N = 3, 8, 11, 16, \\ldots$'],
      };
      const key = choose(r, Object.keys(L)), A = round(0.01 + 0.02 * r(), 4);
      const s = L[key][1].map((n) => round(n * A, 4));
      const o = pickMcq(r, L[key][0], Object.keys(L).filter((k) => k !== key).map((k) => L[k][0]));
      const rat = L[key][1].map((n) => round(n / L[key][1][0], 2));
      return { q: `A cubic powder sample with one atom type gives its first seven lines at $\\sin^2\\theta = ${s.join(',\\ ')}$. The lattice is`, ...o,
        sol: `In a cubic crystal $\\sin^2\\theta = (\\lambda/2a)^2 N$ with $N = h^2 + k^2 + l^2$. Dividing by the first value gives ratios $${rat.join(' : ')}$. ${L[key][0][0].toUpperCase() + L[key][0].slice(1)} allows ${L[key][2]}, which fits with $(\\lambda/2a)^2 = ${round(A, 4)}$.`,
        trap: 'Simple cubic and bcc both start with ratios 1:2:3; it is the missing seventh ratio (no $N = 7$) that marks simple cubic.' };
    } },
  { id: 'sf-m32', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'two-atom basis', format: 'statements',
    make(r) {
      const fA = int(r, 20, 60), fB = int(r, 5, fA - 6);
      const not = r() < 0.4;
      const m = msqOf(r, [
        [`$F_{110} = ${fA + fB}$`, true, `$h + k + l = 2$ is even: $F = f_A + f_B$.`],
        [`$F_{100} = ${fA - fB}$`, true, `$h + k + l = 1$ is odd: $F = f_A - f_B$.`],
        ['The $(100)$ reflection is absent', false, `It is only weakened, to $f_A - f_B = ${fA - fB}$; it would vanish only if $f_A = f_B$.`],
        [`$I_{110}/I_{100} = ${round(((fA + fB) / (fA - fB)) ** 2, 2)}$ (ignoring angle factors)`, true, `$I \\propto |F|^2$: $(${fA + fB}/${fA - fB})^2$.`],
        [`$I_{110}/I_{100} = ${round((fA + fB) / (fA - fB), 2)}$ (ignoring angle factors)`, false, 'Intensity goes as $|F|^2$, not $|F|$.'],
        [`$F_{111} = ${fA + fB}$`, false, `$h + k + l = 3$ is odd, so $F_{111} = f_A - f_B = ${fA - fB}$.`],
        ['The Bravais lattice is simple cubic, with a two-atom basis', true, 'CsCl is not bcc: the body centre holds a different atom.'],
        ['If the two atoms had equal form factors the pattern would look like that of a bcc crystal', true, 'Then the odd reflections vanish, as for bcc.'],
      ], { not });
      return { q: `A CsCl-type crystal has atom A at $(0, 0, 0)$ and atom B at $(\\tfrac12, \\tfrac12, \\tfrac12)$ of the cubic cell, with form factors $f_A = ${fA}$ and $f_B = ${fB}$ at the angles of interest. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'A different atom at the body centre turns bcc absences into weak "superlattice" lines, of strength $f_A - f_B$.' };
    } },
  { id: 'sf-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'angle dependence of scattering', format: 'graph in words',
    make(r) {
      const O = {
        fallZ: 'equal to the number of electrons $Z$ at zero angle, then falling smoothly as $\\sin\\theta/\\lambda$ grows',
        flat: 'essentially independent of the scattering angle',
        fast: 'falling with $\\sin\\theta/\\lambda$, much faster than the X-ray form factor of the same atom',
        gauss: 'falling as $\\exp(-2B\\sin^2\\theta/\\lambda^2)$, and faster at higher temperature',
        rise: 'rising with scattering angle',
      };
      const C = choose(r, [
        ['the X-ray atomic form factor $f$ of an atom', 'fallZ', 'The electron cloud has a size comparable with the wavelength, so waves from different parts of it interfere destructively at large angles; at $\\theta = 0$ all $Z$ electrons scatter in phase.'],
        ['the nuclear scattering length $b$ for thermal neutrons', 'flat', 'The nucleus (about $10^{-15}$ m) is a point compared with the neutron wavelength (about $10^{-10}$ m).'],
        ['the magnetic form factor for neutron scattering by an ion with unpaired 3d electrons', 'fast', 'Only the outer unpaired electrons scatter magnetically, and their cloud is wide, so its Fourier transform is narrow.'],
        ['the Debye-Waller factor $e^{-2W}$ that multiplies Bragg intensities', 'gauss', 'Thermal vibration smears each atom; $2W \\propto \\langle u^2\\rangle G^2$ grows with angle and with temperature.'],
      ]);
      const o = pickMcq(r, O[C[1]], Object.keys(O).filter((k) => k !== C[1] && !(C[1] === 'fallZ' && k === 'fast')).map((k) => O[k]));
      return { q: `As a function of scattering angle, ${C[0]} is`, ...o, sol: C[2],
        trap: 'Point-like scatterers (nuclei) give flat curves; extended scatterers (electron clouds, vibrating atoms) fall off at large angles.' };
    } },
  { id: 'sf-m34', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'structure factor basics', format: 'which is NOT',
    make(r) {
      const T = [
        ['The structure factor depends on the positions and types of the atoms in the cell', '$F_{hkl} = \\sum_j f_j e^{2\\pi i(hx_j + ky_j + lz_j)}$.'],
        ['The intensity of a reflection is proportional to $|F_{hkl}|^2$', 'Only the squared modulus is measured.'],
        ['Measured intensities lose the phase of $F_{hkl}$ (the phase problem)', 'This is why structures cannot simply be Fourier-inverted from intensities.'],
        ['Without anomalous scattering, $|F_{hkl}| = |F_{\\bar h\\bar k\\bar l}|$ (Friedel\'s law)', 'For real $f_j$, $F_{\\bar h\\bar k\\bar l} = F_{hkl}^*$.'],
        ['Lattice centring gives absences that do not depend on what the atoms are', 'They come from identical atoms at centring positions cancelling exactly.'],
      ];
      const F = [
        ['The intensity of a reflection is proportional to $|F_{hkl}|$', 'It goes as $|F|^2$.'],
        ['The structure factor is always a real number', 'Only for a centrosymmetric structure with the origin on a centre of symmetry.'],
        ['The Bragg angles of the reflections are fixed by the structure factor', 'The angles are fixed by the lattice; $F$ fixes only the intensities.'],
        ['Centring absences disappear if heavier atoms are used', 'Identical atoms cancel exactly whatever their form factor.'],
      ];
      const not = r() < 0.65;
      const o = factMcq(r, T, F, not);
      return { q: `About the X-ray structure factor $F_{hkl}$, which ONE statement is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...o,
        trap: 'Lattice gives where the spots are; basis (through $F$) gives how bright they are.' };
    } },
  { id: 'sf-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'nearly equal scatterers', format: 'limiting case',
    make(r) {
      const O = {
        sc2: 'that of a simple cubic lattice with cube edge $a/2$',
        bcc: 'that of a bcc lattice with cube edge $a$',
        dia: 'that of a diamond lattice (the all-even lines with $h + k + l = 4n + 2$, such as $(200)$, nearly vanish)',
        fcc: 'an ordinary fcc pattern in which the all-odd lines are clearly visible',
      };
      const C = choose(r, [
        ['KCl (rock-salt structure; K$^+$ and Cl$^-$ both have 18 electrons)', 'sc2', 'Rock salt has $F = 4(f_+ + f_-)$ for all-even and $4(f_+ - f_-)$ for all-odd indices. With $f_+ = f_-$ the odd lines vanish and the ions look identical on a simple cubic grid of edge $a/2$.'],
        ['RbBr (rock-salt structure; Rb$^+$ and Br$^-$ both have 36 electrons)', 'sc2', 'Isoelectronic ions: the all-odd lines $4(f_+ - f_-)$ vanish, leaving a simple cubic pattern of edge $a/2$.'],
        ['CsI (CsCl structure; Cs$^+$ and I$^-$ both have 54 electrons)', 'bcc', 'CsCl has $F = f_+ \\pm f_-$; with equal form factors the odd $h + k + l$ lines vanish, exactly as for bcc.'],
        ['GaAs (zinc-blende structure; Ga has 31 electrons, As 33)', 'dia', 'Zinc blende has $|F| = 4|f_{Ga} - f_{As}|$ for all-even indices with $h + k + l = 4n + 2$; with nearly equal form factors these lines nearly vanish, as in diamond.'],
        ['NaCl (rock-salt structure; Na$^+$ has 10 electrons, Cl$^-$ 18)', 'fcc', 'The form factors differ a lot, so the all-odd lines $4(f_{Cl} - f_{Na})$ are weak but clearly present: a normal fcc pattern.'],
      ]);
      const o = pickMcq(r, O[C[1]], Object.keys(O).filter((k) => k !== C[1]).map((k) => O[k]));
      return { q: `The X-ray powder pattern of ${C[0]}, with cube edge $a$, looks most like`, ...o, sol: C[2],
        trap: 'X-rays see electrons, so ions with the same electron count are nearly indistinguishable and the pattern takes the symmetry of a smaller or simpler lattice.' };
    } },
];
