// Extra question shapes for superconductivity (templates scd-m31..m35). Imported by superconductivity.js.
import { choose, round, fmt } from '../_util.js';
import { msqOf, pickMcq, factMcq, oomMcq } from './_more.js';

export default [
  { id: 'scd-m31', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'magnetisation curves', format: 'graph in words',
    make(r) {
      const O = {
        t1: '$-M$ rises linearly with $H$ (complete flux expulsion) up to $H_c$, then drops abruptly to zero',
        t2: '$-M$ rises linearly up to $H_{c1}$, then falls gradually as vortices enter, reaching zero at a much higher $H_{c2}$',
        none: '$M$ stays close to zero at all fields',
        ferro: '$M$ jumps to a large positive saturation value at very small fields',
      };
      const C = choose(r, [
        ['pure lead at 2 K', 't1', 'Lead is a type I superconductor ($\\kappa = \\lambda/\\xi < 1/\\sqrt2$).'], ['pure aluminium at 0.5 K', 't1', 'Aluminium is type I, with a long coherence length.'], ['pure tin at 1 K', 't1', 'Tin is type I.'],
        ['the alloy NbTi at 4 K', 't2', 'NbTi is type II ($\\kappa \\gg 1$), with $H_{c2}$ about 10 T: the standard magnet wire.'], ['Nb$_3$Sn at 4 K', 't2', 'Strongly type II, $\\mu_0H_{c2}$ near 25 T.'], ['YBa$_2$Cu$_3$O$_7$ at 77 K', 't2', 'Cuprates are extreme type II, with $\\kappa$ of order 100.'],
        ['copper at 2 K', 'none', 'Copper does not superconduct; its tiny diamagnetism and Pauli paramagnetism nearly cancel.'],
      ]);
      const o = pickMcq(r, O[C[1]], Object.keys(O).filter((k) => k !== C[1]).map((k) => O[k]));
      return { q: `For a long cylinder of ${C[0]} in an increasing axial field $H$ (no pinning, no hysteresis), the magnetisation curve is`, ...o, sol: `${C[2]} A type I superconductor stays in the Meissner state until superconductivity is destroyed at $H_c$; a type II material admits quantised vortices between $H_{c1}$ and $H_{c2}$.`,
        trap: 'Above $H_{c1}$ a type II superconductor is still superconducting (zero resistance) although flux has entered.' };
    } },
  { id: 'scd-m32', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'BCS predictions', format: 'statements',
    make(r) {
      const M = choose(r, [['mercury', 4.15, 200, 204], ['tin', 3.72, 116, 124], ['lead', 7.19, 204, 208], ['aluminium', 1.18, 27, 27], ['niobium', 9.25, 93, 93]]);
      const Tc = M[1], gap = 3.53 * 8.617e-5 * Tc * 1e3;
      const iso = M[2] !== M[3], Tc2 = Tc * Math.sqrt(M[2] / M[3]);
      const not = r() < 0.4;
      const m = msqOf(r, [
        [`The zero-temperature gap is $2\\Delta(0) \\approx 3.53\\,k_BT_c = ${round(gap, 2)}$ meV`, true, `$3.53\\times8.617\\times10^{-5}\\text{ eV/K}\\times${Tc}$ K.`],
        [`The zero-temperature gap is $2\\Delta(0) \\approx k_BT_c = ${round(gap / 3.53, 3)}$ meV`, false, `BCS gives $3.53\\,k_BT_c = ${round(gap, 2)}$ meV.`],
        ...(iso ? [[`Replacing the isotope of mass ${M[2]} u by one of ${M[3]} u lowers $T_c$ to about $${round(Tc2, 3)}$ K`, true, `$T_c \\propto M^{-1/2}$: $${Tc}\\sqrt{${M[2]}/${M[3]}}$.`],
          [`Replacing the isotope of mass ${M[2]} u by one of ${M[3]} u lowers $T_c$ to about $${round(Tc * M[2] / M[3], 3)}$ K`, false, `The isotope effect goes as $M^{-1/2}$, giving $${round(Tc2, 3)}$ K.`]] : []),
        ['The jump in electronic heat capacity at $T_c$ is $\\Delta C \\approx 1.43\\,\\gamma T_c$', true, 'A universal BCS ratio.'],
        ['The jump in electronic heat capacity at $T_c$ equals $\\gamma T_c$ exactly', false, 'BCS gives 1.43.'],
        ['The flux quantum is $h/2e \\approx 2.07\\times10^{-15}$ Wb', true, 'The charge carriers are Cooper pairs, charge $2e$.'],
        ['The flux quantum is $h/e$', false, 'That would hold for single-electron carriers; experiment gives $h/2e$.'],
        ['Near $T_c$ the gap closes as $(1 - T/T_c)^{1/2}$', true, 'Mean-field behaviour: $\\Delta(T) \\approx 1.74\\,\\Delta(0)\\sqrt{1 - T/T_c}$.'],
      ], { not });
      return { q: `Treat ${M[0]} ($T_c = ${Tc}$ K) as a weak-coupling BCS superconductor. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'The isotope effect is $T_c \\propto M^{-1/2}$, as for a phonon frequency: the glue is lattice vibrations.' };
    } },
  { id: 'scd-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'temperature dependence', format: 'graph in words',
    make(r) {
      const O = {
        gap: 'nearly constant at low $T$, then falling steeply to zero at $T_c$ as $\\sqrt{T_c - T}$',
        para: 'falling smoothly as $1 - (T/T_c)^2$, reaching zero at $T_c$',
        div: 'nearly constant at low $T$, then growing and diverging as $T \\to T_c$',
        jump: 'exponentially small at low $T$, rising to a finite jump at $T_c$, then linear in $T$ above it',
        drop: 'zero below $T_c$, jumping to its normal value at $T_c$',
      };
      const C = choose(r, [
        ['the energy gap $\\Delta(T)$', 'gap', 'BCS gap equation: exponentially flat at low $T$, mean-field square root near $T_c$.'],
        ['the thermodynamic critical field $H_c(T)$', 'para', 'The empirical parabolic law $H_c(T) = H_c(0)[1 - (T/T_c)^2]$.'],
        ['the London penetration depth $\\lambda(T)$', 'div', 'As the superfluid density falls to zero at $T_c$, the screening length diverges; two-fluid model: $\\lambda(T) = \\lambda(0)/\\sqrt{1 - (T/T_c)^4}$.'],
        ['the electronic heat capacity $C_{es}(T)$', 'jump', 'The gap gives $e^{-\\Delta/k_BT}$ at low $T$; at $T_c$ it jumps (by $1.43\\gamma T_c$) to the normal value $\\gamma T_c$.'],
        ['the dc resistivity $\\rho(T)$', 'drop', 'Zero resistance below $T_c$; above it the normal metal value.'],
      ]);
      const o = pickMcq(r, O[C[1]], Object.keys(O).filter((k) => k !== C[1]).map((k) => O[k]));
      return { q: `In a conventional superconductor, as $T$ rises from 0 to beyond $T_c$, ${C[0]} is`, ...o, sol: C[2],
        trap: 'The gap and superfluid density vanish at $T_c$; the penetration depth, their inverse partner, diverges.' };
    } },
  { id: 'scd-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Josephson effects and flux quantisation', format: 'which is NOT',
    make(r) {
      const T = [
        ['A supercurrent $I = I_c\\sin\\varphi$ flows through a junction with no voltage across it', 'The dc Josephson effect.'],
        ['A dc voltage $V$ across a junction makes the current oscillate at $2eV/h$, about 483.6 GHz per mV', 'The ac Josephson effect, used for the volt standard.'],
        ['Flux through a thick superconducting ring is quantised in units of $h/2e$', 'The pair wavefunction must be single-valued around the ring.'],
        ['The critical current of a dc SQUID is periodic in the applied flux with period $h/2e$', 'Interference of the two junction phases.'],
        ['Microwaves of frequency $f$ produce voltage steps at $V = nhf/2e$ (Shapiro steps)', 'Phase locking of the ac Josephson oscillation.'],
      ];
      const F = [
        ['The ac Josephson frequency is about 241.8 GHz per mV', 'That is $e/h$; the pair charge doubles it to 483.6 GHz/mV.'],
        ['The flux quantum in a superconducting ring is $h/e$', 'It is $h/2e$, because the carriers are pairs.'],
        ['A dc supercurrent through a Josephson junction needs a dc voltage to drive it', 'Up to $I_c$ it flows with zero voltage.'],
        ['The critical current of a dc SQUID is periodic in flux with period $h/4e$', 'The period is one flux quantum, $h/2e$.'],
      ];
      const not = r() < 0.65;
      const o = factMcq(r, T, F, not);
      return { q: `About Josephson junctions and flux quantisation, which ONE statement is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...o,
        trap: 'Every Josephson and flux formula carries $2e$: the supercurrent is carried by Cooper pairs.' };
    } },
  { id: 'scd-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'counting flux quanta', format: 'order of magnitude',
    make(r) {
      const S = choose(r, [
        ['the Earth\'s field ($50$ μT) through a ring of area 1 cm$^2$', 5e-5 * 1e-4],
        ['a field of $1$ T through a wire of cross-section 1 mm$^2$', 1e-6],
        ['a field of $10$ mT through a square of side 10 μm', 1e-2 * 1e-10],
        ['a field of $1$ μT through a SQUID loop of area 1 mm$^2$', 1e-12],
        ['a field of $5$ T through a disc of area 1 cm$^2$', 5e-4],
      ]);
      const N = S[1] / 2.0678e-15;
      const o = oomMcq(r, N);
      return { q: `The number of flux quanta $h/2e$ in ${S[0]} is closest to`, ...o,
        sol: `$\\Phi = BA = ${fmt(S[1], 3)}$ Wb and $\\Phi_0 = h/2e = 2.07\\times10^{-15}$ Wb, so $N = ${fmt(N, 3)}$, nearest $10^{${o.k}}$. A SQUID can resolve a small fraction of one flux quantum, which makes it the most sensitive magnetometer.`,
        trap: 'One flux quantum is tiny: $2\\times10^{-15}$ Wb is a 1 μT field through a square about 45 μm on a side.' };
    } },
];
