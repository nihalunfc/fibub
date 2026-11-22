// Extra question shapes for raman (templates rmn-m31..m35). Imported by raman.js.
import { int, choose, round } from '../_util.js';
import { msqOf, pickMcq, factMcq } from './_more.js';

export default [
  { id: 'rmn-m31', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'IR and Raman activity', format: 'classification',
    make(r) {
      const O = { both: 'both infrared and Raman active', ir: 'infrared active only', ra: 'Raman active only', none: 'neither (a silent mode)' };
      const M = choose(r, [
        ['the symmetric stretch of CO$_2$', 'ra', 'Centrosymmetric and totally symmetric: no dipole change, but the polarisability changes. Mutual exclusion applies.'],
        ['the antisymmetric stretch of CO$_2$', 'ir', 'It changes the dipole, and in a centrosymmetric molecule an IR-active (u) mode is Raman-inactive.'],
        ['the bending mode of CO$_2$', 'ir', 'A u mode of a centrosymmetric molecule: IR only.'],
        ['the stretch of N$_2$', 'ra', 'No dipole change; the polarisability changes along the bond.'],
        ['the stretch of HCl', 'both', 'No centre of symmetry: the stretch changes both the dipole and the polarisability.'],
        ['the symmetric stretch of H$_2$O', 'both', 'H$_2$O has no centre of symmetry; the $A_1$ mode is active in both.'],
        ['the symmetric (breathing) stretch of CH$_4$', 'ra', 'The totally symmetric $A_1$ mode of a tetrahedral molecule changes only the polarisability.'],
        ['the $T_{2u}$ bending mode of SF$_6$', 'none', 'It is neither a dipole-like ($T_{1u}$) nor a polarisability-like (g) mode: silent.'],
      ]);
      const o = pickMcq(r, O[M[1]], Object.keys(O).filter((k) => k !== M[1]).map((k) => O[k]));
      return { q: `The vibration ${M[0]} is`, ...o, sol: `${M[2]} IR activity needs a changing dipole moment; Raman activity needs a changing polarisability. In molecules with a centre of symmetry no mode is both (rule of mutual exclusion).`,
        trap: 'Mutual exclusion says "not both" for centrosymmetric molecules; it does not say every mode is one or the other (silent modes exist).' };
    } },
  { id: 'rmn-m32', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'rotational Raman', format: 'statements',
    make(r) {
      const B = round(0.5 + 2.5 * r(), 2), J = int(r, 1, 4);
      const not = r() < 0.4;
      const m = msqOf(r, [
        ['The selection rule is $\\Delta J = 0, \\pm2$', true, 'The polarisability is a rank-2 tensor.'],
        [`The first Stokes line is shifted by $6B = ${round(6 * B, 2)}$ cm$^{-1}$`, true, 'S(0): $J = 0 \\to 2$, shift $B(4J + 6) = 6B$.'],
        [`The S(${J}) line is shifted by $${round(B * (4 * J + 6), 2)}$ cm$^{-1}$`, true, `$B(4J + 6) = ${B}\\times${4 * J + 6}$.`],
        [`Successive lines are spaced by $${round(4 * B, 2)}$ cm$^{-1}$`, true, 'The spacing is $4B$.'],
        [`Successive lines are spaced by $${round(2 * B, 2)}$ cm$^{-1}$`, false, 'That is the microwave spacing; in rotational Raman it is $4B$.'],
        ['Homonuclear molecules such as N$_2$ show a rotational Raman spectrum', true, 'Only an anisotropic polarisability is needed, not a dipole.'],
        ['A permanent dipole moment is required', false, 'Raman needs a polarisability anisotropy instead.'],
        ['Spherical tops such as CH$_4$ show a strong pure rotational Raman spectrum', false, 'Their polarisability is isotropic, so rotation does not modulate it.'],
      ], { not });
      return { q: `A linear molecule with $B = ${B}$ cm$^{-1}$ is studied by rotational Raman scattering. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'First line at $6B$, spacing $4B$: compare microwave lines at $2B$ with spacing $2B$.' };
    } },
  { id: 'rmn-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'choosing a technique', format: 'match the system',
    make(r) {
      const C = choose(r, [
        ['the vibrational frequency of N$_2$', 'vibrational Raman scattering', ['infrared absorption', 'microwave absorption', 'pure rotational Raman scattering'], 'N$_2$ has no dipole, so its stretch is IR-inactive, but it changes the polarisability.'],
        ['the bond length of N$_2$', 'pure rotational Raman scattering', ['microwave absorption', 'infrared absorption by the fundamental band', 'electron spin resonance'], 'No dipole means no microwave spectrum and no IR band; rotational Raman gives $B$ and hence $r$.'],
        ['the bond length of CH$_4$', 'the rotational structure of an infrared vibration-rotation band', ['pure rotational Raman scattering', 'microwave absorption', 'electron spin resonance'], 'A spherical top has neither a dipole (no microwave) nor an anisotropic polarisability (no rotational Raman); but its IR-active $T_2$ bands show rotational structure.'],
        ['the antisymmetric stretch frequency of CO$_2$', 'infrared absorption', ['vibrational Raman scattering', 'microwave absorption', 'pure rotational Raman scattering'], 'It is IR-active and, by mutual exclusion, Raman-inactive.'],
        ['the bond length of HCl', 'microwave absorption', ['vibrational Raman scattering of the Q branch', 'electron spin resonance', 'nuclear magnetic resonance'], 'HCl is polar, so its pure rotational spectrum gives $B$ directly.'],
      ]);
      const o = pickMcq(r, C[1], C[2]);
      return { q: `Which ONE technique can measure ${C[0]} directly?`, ...o, sol: C[3],
        trap: 'Microwave spectroscopy needs a permanent dipole; rotational Raman needs an anisotropic polarisability.' };
    } },
  { id: 'rmn-m34', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'Raman basics', format: 'which is NOT',
    make(r) {
      const T = [
        ['The Raman shift does not depend on the laser wavelength', 'It equals a molecular energy difference.'],
        ['The scattered intensity grows roughly as the fourth power of the laser frequency', 'Dipole radiation from the induced moment goes as $\\omega^4$.'],
        ['A Raman-active vibration must change the polarisability', 'The gross selection rule.'],
        ['At room temperature Stokes lines are stronger than anti-Stokes lines', 'Anti-Stokes needs molecules already excited, with Boltzmann population $e^{-h\\nu/kT}$.'],
        ['Raman lines appear on both sides of the laser line', 'Stokes (lower frequency) and anti-Stokes (higher frequency).'],
      ];
      const F = [
        ['Doubling the laser frequency doubles the Raman shift', 'The shift is fixed by the molecule.'],
        ['A Raman-active vibration must change the dipole moment', 'That is the infrared rule.'],
        ['At room temperature anti-Stokes lines are stronger than Stokes lines', 'Fewer molecules start in the excited level.'],
        ['The laser must be tuned to an absorption line of the molecule', 'Ordinary Raman scattering works far from resonance.'],
      ];
      const not = r() < 0.65;
      const o = factMcq(r, T, F, not);
      return { q: `About Raman scattering, which ONE statement is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...o,
        trap: 'The shift is a molecular property; the laser only sets where on the spectrum the lines appear and how bright they are.' };
    } },
  { id: 'rmn-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'assigning rotational Raman lines', format: 'which transition',
    make(r) {
      const B = round(0.5 + 2.5 * r(), 2), J = int(r, 1, 6), X = round(B * (4 * J + 6), 2);
      const lab = (a, d = 2) => `$J = ${a} \\to ${a + d}$`;
      const jm = Math.round(X / (2 * B) - 1);
      const o = pickMcq(r, lab(J), [lab(J + 1), lab(J - 1), lab(jm, 1), lab(J + 2), lab(Math.round((X / B - 6) / 2))]);
      return { q: `A linear molecule with $B = ${B}$ cm$^{-1}$ shows a Stokes rotational Raman line at a shift of $${X}$ cm$^{-1}$. Which transition produces it?`, ...o,
        sol: `Rotational Raman S lines ($\\Delta J = +2$) have shifts $B(4J + 6)$. Setting $${B}(4J + 6) = ${X}$ gives $4J + 6 = ${4 * J + 6}$, so $J = ${J}$: the line is S(${J}), $J = ${J} \\to ${J + 2}$.`,
        trap: 'Treating it like a microwave line ($2B(J+1)$, $\\Delta J = 1$) gives the wrong assignment.' };
    } },
];
