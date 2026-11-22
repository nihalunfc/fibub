// Extra question shapes for lasers (templates lsr-m31..m35). Imported by lasers.js.
import { int, choose, round, fmt } from '../_util.js';
import { msqOf, pickMcq, factMcq, oomMcq } from './_more.js';

export default [
  { id: 'lsr-m31', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'pumping schemes', format: 'match the system',
    make(r) {
      const O = { three: 'a three-level laser (the lower laser level is the ground state)', four: 'a four-level laser (the lower laser level empties quickly and is nearly empty)', quasi: 'a quasi-three-level laser (the lower laser level is thermally populated)', two: 'impossible as a steady-state laser (two levels only)' };
      const C = choose(r, [
        ['the ruby laser (694 nm)', 'three', 'Cr$^{3+}$ lases to its ground state, so more than half the ions must be pumped to reach inversion.'],
        ['the Nd:YAG laser (1064 nm)', 'four', 'The lower level lies about 0.25 eV above the ground state and empties in nanoseconds.'],
        ['the helium-neon laser (633 nm)', 'four', 'The neon lower laser level drains quickly, via the 1s levels, to the ground state.'],
        ['the erbium-doped fibre amplifier (1550 nm)', 'quasi', 'The lower level is a Stark component of the ground manifold, partly populated at room temperature.'],
        ['the Yb:YAG laser (1030 nm)', 'quasi', 'The lower laser level is only about 0.07 eV above the ground level and is thermally populated.'],
        ['a medium with just two levels, pumped optically', 'two', 'With two levels, optical pumping can at best equalise the populations; stimulated emission balances absorption, so no inversion.'],
      ]);
      const o = pickMcq(r, O[C[1]], Object.keys(O).filter((k) => k !== C[1]).map((k) => O[k]));
      return { q: `Which description fits ${C[0]}?`, ...o, sol: C[2],
        trap: 'Ruby was the first laser even though it is three-level and needs very strong pumping.' };
    } },
  { id: 'lsr-m32', type: 'msq', level: 3, exams: ['gate', 'net', 'jam'], sub: 'Einstein coefficients', format: 'statements',
    make(r) {
      const f = int(r, 2, 3);
      const not = r() < 0.4;
      const m = msqOf(r, [
        ['$A_{21}/B_{21} \\propto \\nu^3$', true, '$A_{21}/B_{21} = 8\\pi h\\nu^3/c^3$ (with $B$ per unit frequency).'],
        [`If the transition frequency is multiplied by ${f} at fixed $B_{21}$, $A_{21}$ is multiplied by ${f ** 3}`, true, `$A \\propto \\nu^3B$: $${f}^3 = ${f ** 3}$.`],
        [`If the transition frequency is multiplied by ${f} at fixed $B_{21}$, $A_{21}$ is multiplied by ${f}`, false, `It is $${f}^3 = ${f ** 3}$.`],
        ['$g_1B_{12} = g_2B_{21}$', true, 'Detailed balance with Planck radiation.'],
        ['A stimulated photon has the same frequency, direction, phase and polarisation as the stimulating one', true, 'It is emitted into the same mode.'],
        ['In thermal equilibrium the upper level is less populated than the lower one (per state)', true, 'Boltzmann factor $e^{-h\\nu/kT} < 1$.'],
        ['The spontaneous emission rate depends on the intensity of the surrounding radiation', false, 'Spontaneous emission occurs at rate $A_{21}$ regardless of the radiation field.'],
        ['Steady optical pumping of a two-level system can produce population inversion', false, 'At most it equalises the populations.'],
      ], { not });
      return { q: `Which statements about Einstein coefficients and laser physics are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'The $\\nu^3$ factor is why X-ray lasers are so hard: spontaneous emission empties the upper level very fast.' };
    } },
  { id: 'lsr-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'laser threshold', format: 'graph in words',
    make(r) {
      const O = { out: 'nearly zero below threshold, then rising linearly with pump power', clamp: 'rising with pump power below threshold, then staying fixed (clamped) at its threshold value', lin: 'rising linearly at all pump powers with no change at threshold', fall: 'rising below threshold and then falling back to zero above it' };
      const C = choose(r, [
        ['the laser output power', 'out', 'Below threshold the cavity loss exceeds the gain; above it, every extra pump photon (times the efficiency) is converted to laser output.'],
        ['the population inversion in the gain medium', 'clamp', 'Above threshold the gain must equal the loss exactly, so the inversion is pinned at its threshold value; extra pumping goes into stimulated emission.'],
        ['the round-trip gain', 'clamp', 'Steady oscillation requires gain = loss; it cannot rise further.'],
        ['the spontaneous emission (fluorescence) seen from the side of the gain medium', 'clamp', 'It is proportional to the upper-level population, which is clamped with the inversion.'],
      ]);
      const o = pickMcq(r, O[C[1]], Object.keys(O).filter((k) => k !== C[1]).map((k) => O[k]));
      return { q: `As the pump power of a continuous laser is increased through threshold, how does ${C[0]} behave?`, ...o, sol: C[2],
        trap: 'Gain clamping: above threshold, more pumping gives more output, not more inversion.' };
    } },
  { id: 'lsr-m34', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'properties of laser light', format: 'which is NOT',
    make(r) {
      const T = [
        ['It can be highly monochromatic', 'Only modes inside the narrow cavity resonances oscillate.'],
        ['It has a long coherence length compared with thermal light', 'Narrow linewidth means long coherence time.'],
        ['A single-mode beam above threshold has a Poisson photon-number distribution', 'It is close to a coherent state.'],
        ['A Gaussian beam diverges at an angle of order $\\lambda/\\pi w_0$', 'Diffraction from the beam waist $w_0$.'],
      ];
      const F = [
        ['Above threshold its photon number follows a thermal (Bose-Einstein) distribution', 'That describes thermal light, with much larger fluctuations.'],
        ['It is always unpolarised', 'Many lasers are linearly polarised (Brewster windows, anisotropic crystals).'],
        ['Its coherence length is shorter than that of an LED', 'LEDs have broad spectra and short coherence lengths.'],
        ['A perfect laser beam can be made exactly parallel, with zero divergence', 'Diffraction sets a minimum divergence for any finite beam.'],
      ];
      const not = r() < 0.65;
      const o = factMcq(r, T, F, not);
      return { q: `Which ONE statement about laser light is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...o,
        trap: 'Even a perfect laser diffracts; the Gaussian beam is simply the least divergent beam of a given waist.' };
    } },
  { id: 'lsr-m35', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'longitudinal modes', format: 'order of magnitude',
    make(r) {
      const S = choose(r, [['a helium-neon laser', 1.5e9, [0.2, 0.3, 0.5]], ['an Nd:YAG laser', 1.2e11, [0.1, 0.3, 0.5]], ['a Ti:sapphire laser', 1e14, [1, 1.5, 2]], ['a CO$_2$ laser at low pressure', 6e7, [1, 2, 3]], ['a dye laser', 5e13, [0.5, 1, 1.5]]]);
      const L = choose(r, S[2]), fsr = 3e8 / (2 * L), N = S[1] / fsr;
      const o = oomMcq(r, N);
      return { q: `For ${S[0]} with a gain bandwidth of about $${fmt(S[1], 2)}$ Hz in a cavity $${L}$ m long ($n = 1$), the number of longitudinal modes that fit inside the gain bandwidth is closest to`, ...o,
        sol: `The mode spacing is $c/2L = ${fmt(fsr, 3)}$ Hz, so about $${fmt(S[1], 2)}/${fmt(fsr, 3)} = ${fmt(N, 2)}$ modes, nearest $10^{${o.k}}$. ${N > 1e4 ? 'Such a huge number of locked modes is what allows femtosecond pulses.' : N < 2 ? 'Fewer than one or two modes: the laser runs naturally single-mode.' : ''}`,
        trap: 'The mode spacing is $c/2L$, not $c/L$: the light makes a round trip.' };
    } },
];
