// Round 4 extras for collective-model: original questions, written 2026-11-22.
import { choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const HBAR = 6.582120e-22;   // MeV s
const sig3 = (x) => +x.toPrecision(3);
const dav = (g) => { const s2 = Math.sin(3 * g * Math.PI / 180) ** 2, X = Math.sqrt(81 - 72 * s2); return (9 + X) / (9 - X); };
const SETS = { 1: '$2^+$', 2: '$0^+, 2^+, 4^+$', 3: '$0^+, 2^+, 3^+, 4^+, 6^+$' };
const WRONG = ['$0^+, 2^+, 4^+, 6^+$', '$0^+, 1^+, 2^+, 3^+, 4^+$', '$2^+, 4^+$', '$1^+, 2^+, 3^+$', '$0^+, 1^+, 2^+, 3^+, 4^+, 5^+, 6^+$', '$2^+, 4^+, 6^+$'];

export default {
  items: [
    { id: 'coll-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'vibrations',
      q: R`In a spherical even-even nucleus, the one-phonon state of quadrupole surface vibrations has spin and parity`,
      options: [R`$2^+$`, R`$0^+$`, R`$3^-$`, R`$1^-$`], answer: 0,
      sol: R`A quadrupole phonon carries angular momentum $\lambda = 2$ and parity $(-1)^\lambda = +$. Adding one to the $0^+$ ground state gives a $2^+$ state, usually the lowest excited state of a vibrational nucleus. $3^-$ belongs to an octupole phonon; $1^-$ to a dipole mode, which for the surface is just a shift of the centre of mass.`,
      trap: R`Choosing $3^-$, the octupole phonon.` },
    { id: 'coll-r4-02', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'rotational bands',
      q: R`For an ideal rotor (even-even, $K = 0$), the ratio $E(6^+)/E(2^+)$ is`,
      options: [R`$3.33$`, R`$6$`, R`$9$`, R`$7$`], answer: 3,
      sol: R`$E(I)\propto I(I + 1)$, so $E(6^+)/E(2^+) = \dfrac{6\times7}{2\times3} = \dfrac{42}{6} = 7$. ($3.33$ is the $4^+/2^+$ ratio, and $9$ would follow from $E\propto I^2$.)`,
      trap: R`Using $E\propto I^2$, which gives 9.` },
    { id: 'coll-r4-03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'vibrations',
      q: R`Two identical quadrupole phonons (each with 5 substates, $\mu = -2, \dots, 2$) are combined. Counting all $(2I + 1)$ magnetic substates of the allowed two-phonon states, the total number of two-phonon states is ______.`,
      answer: 15, tol: 0, calc: () => 6 * 5 / 2,
      sol: R`Phonons are bosons, so the two-phonon states are the symmetric combinations of $5\times5$ products: $\dfrac{5\times6}2 = 15$. The allowed spins $0^+$, $2^+$, $4^+$ give $1 + 5 + 9 = 15$, confirming that $1^+$ and $3^+$ (which would add $3 + 7 = 10$, the antisymmetric part) are excluded.`,
      trap: R`Counting $5\times5 = 25$, as if the phonons were distinguishable.` },
    { id: 'coll-r4-04', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'vibrations',
      q: R`In a harmonic quadrupole vibrator, the three-phonon multiplet (at $3\hbar\omega$) contains the spins`,
      options: [R`$0^+, 2^+, 3^+, 4^+, 6^+$`, R`$0^+, 1^+, 2^+, 3^+, 4^+, 5^+, 6^+$`, R`$0^+, 2^+, 4^+, 6^+$`, R`$2^+, 4^+, 6^+$`], answer: 0,
      sol: R`The symmetric three-boson states of $\lambda = 2$ number $\binom{5 + 2}{3} = 35$. Distributing them by total $M$ and peeling off multiplets gives $I = 6, 4, 3, 2, 0$: $13 + 9 + 7 + 5 + 1 = 35$. The quintuplet $0^+, 2^+, 3^+, 4^+, 6^+$ is the textbook vibrational pattern, though real nuclei show it only roughly.`,
      trap: R`Allowing every spin up to 6, or forgetting the unusual $3^+$.` },
    { id: 'coll-r4-05', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'high spin',
      q: R`In a rotational band the $E2$ gamma ray from spin $I$ to $I - 2$ has energy $500$ keV. Using $\hbar\omega = dE/dI \approx E_\gamma/2$ and $\hbar = 6.582\times10^{-22}$ MeV s, the nucleus rotates with angular frequency $\omega = $ ______ $\times10^{20}$ rad/s (two decimal places).`,
      answer: 3.8, tol: 0.03, unit: 'rad/s', calc: () => 0.25 / 6.582e-22 / 1e20,
      sol: R`The classical rotation frequency is $\omega = \dfrac1\hbar\dfrac{dE}{dI}$. Over a step $\Delta I = 2$, $dE/dI \approx E_\gamma/2 = 250$ keV, so $\omega = \dfrac{0.250\text{ MeV}}{6.582\times10^{-22}\text{ MeV s}} = 3.80\times10^{20}$ rad/s, about $6\times10^{19}$ turns per second. Plots of moment of inertia against $\hbar\omega$ (backbending plots) use exactly this $\hbar\omega$.`,
      trap: R`Using $\hbar\omega = E_\gamma$ (forgetting that the spin changes by 2).` },
    { id: 'coll-r4-06', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'rotational bands', format: 'statements',
      q: R`About the quantum number $K$ of an axially symmetric deformed nucleus, which statements are correct?`,
      options: [R`$K$ is the projection of the total angular momentum on the nuclear symmetry axis`, R`All members of a band built on an intrinsic state with given $K$ have $I \ge K$`, R`Every $K = 0$ band contains only even spins`, R`Gamma transitions that change $K$ by more than their multipolarity are hindered ("$K$-forbidden")`], answer: [0, 1, 3],
      sol: R`$K$ is the body-fixed projection, so a band starts at $I = K$ and continues $K, K + 1, \dots$ (for $K = 0$ in steps of 2). Whether a $K = 0$ band has even or odd spins depends on its intrinsic symmetry: ground bands have $0^+, 2^+, 4^+, \dots$ but octupole $K = 0^-$ bands have $1^-, 3^-, 5^-, \dots$, so the third statement is false. A transition of multipolarity $\lambda$ can change $K$ by at most $\lambda$ without hindrance; larger $\Delta K$ makes high-$K$ isomers.`,
      trap: R`Generalising the ground-band pattern to every $K = 0$ band.` },
    { id: 'coll-r4-07', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'shape classification',
      q: R`A deformed nucleus that is "gamma-soft" (its energy does not depend on the triaxiality $\gamma$; Wilets-Jean or O(6) limit) has $R_{4/2} = E(4^+_1)/E(2^+_1)$ close to`,
      options: [R`$3.33$`, R`$2.0$`, R`$1.0$`, R`$2.5$`], answer: 3,
      sol: R`For a $\gamma$-independent potential the ground-state levels follow $E\propto\tau(\tau + 3)$ with $\tau = 1$ for $2^+_1$ and $\tau = 2$ for $4^+_1$: $\dfrac{2\times5}{1\times4} = 2.5$. This sits between the vibrator ($2.0$) and the rigid rotor ($3.33$); Xe, Ba and Pt isotopes are typical examples.`,
      trap: R`Assuming any deformed nucleus gives $3.33$; that needs a rigid axial rotor.` },
    { id: 'coll-r4-08', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'triaxial rotor',
      q: R`In the Davydov-Filippov rigid triaxial rotor, the two lowest $2^+$ levels obey $\dfrac{E(2^+_2)}{E(2^+_1)} = \dfrac{9 + \sqrt{81 - 72\sin^23\gamma}}{9 - \sqrt{81 - 72\sin^23\gamma}}$. For $\gamma = 20^\circ$ this ratio is ______ (two decimal places).`,
      answer: 3.73, tol: 0.02, calc: () => { const X = Math.sqrt(81 - 72 * Math.sin(Math.PI / 3) ** 2); return (9 + X) / (9 - X); },
      sol: R`$3\gamma = 60^\circ$, $\sin^260^\circ = 0.75$, so $\sqrt{81 - 54} = \sqrt{27} = 5.196$. Ratio $= \dfrac{14.196}{3.804} = 3.73$. As $\gamma\to0$ the second $2^+$ (the gamma-band head) moves up without limit; at $\gamma = 30^\circ$ (maximum triaxiality) the ratio falls to its minimum, $2$.`,
      trap: R`Using $\sin^2\gamma$ instead of $\sin^23\gamma$.` },
    { id: 'coll-r4-09', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Nilsson model',
      q: R`In the Nilsson model with a PROLATE deformation, a spherical orbit of angular momentum $j$ splits into levels labelled by $\Omega = \tfrac12, \tfrac32, \dots, j$. Which component is pushed down the most?`,
      options: [R`$\Omega = j$`, R`none: all components stay degenerate`, R`$\Omega = j - 1$`, R`$\Omega = \tfrac12$`], answer: 3,
      sol: R`Small $\Omega$ means the orbit's plane contains the symmetry axis, so the nucleon spends most time near the poles of the elongated nucleus, where the mean field extends further and is more attractive: its energy drops. Large $\Omega$ ($= j$) orbits lie near the equator, where a prolate nucleus is thinner, and rise. For oblate shapes the order reverses.`,
      trap: R`Assuming the aligned (largest-$\Omega$) orbit is always lowest.` },
    { id: 'coll-r4-10', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'moments of inertia', format: 'statements',
      q: R`About pairing and the moments of inertia of deformed nuclei, which statements are correct?`,
      options: [R`Pairing correlations reduce the moment of inertia well below the rigid-body value`, R`Odd-$A$ neighbours tend to have larger moments of inertia than even-even nuclei, because the odd nucleon blocks part of the pairing`, R`At high spin the Coriolis force can break a pair, which can produce backbending`, R`Pairing raises the moment of inertia above the rigid-body value`], answer: [0, 1, 2],
      sol: R`Paired nucleons behave partly like a superfluid that does not follow the rotation, so ground-band moments of inertia are only about half the rigid value. Blocking one orbit in an odd-$A$ nucleus weakens pairing and raises the moment of inertia. The Coriolis force acts oppositely on the two members of a time-reversed pair; at a critical frequency a high-$j$ pair breaks and aligns, giving a sudden increase in the moment of inertia (backbending). The last statement has it backwards.`,
      trap: R`Thinking stronger correlations make the nucleus rotate more like a rigid body; superfluid pairing does the opposite.` },
  ],
  gens: [
    { id: 'coll-r4g1', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'triaxial rotor',
      make(r) {
        const g = choose(r, [10, 12, 15, 18, 22, 25, 28, 30]), ask = choose(r, ['two', 'three']), d = dav(g), ans = ask === 'two' ? d : 1 + d;
        return { q: R`In the Davydov-Filippov rigid triaxial rotor with $\gamma = ${g}^\circ$, $\dfrac{E(2^+_2)}{E(2^+_1)} = \dfrac{9 + \sqrt{81 - 72\sin^23\gamma}}{9 - \sqrt{81 - 72\sin^23\gamma}}$${ask === 'three' ? R` and the $3^+_1$ level satisfies $E(3^+_1) = E(2^+_1) + E(2^+_2)$` : ''}. The ratio $E(${ask === 'two' ? '2^+_2' : '3^+_1'})/E(2^+_1)$ is ______ (three significant figures).`,
          answer: sig3(ans), tol: sig3(ans * 0.005), g, ask,
          sol: R`$\sin^2${3 * g}^\circ = ${round(Math.sin(3 * g * Math.PI / 180) ** 2, 4)}$, so $\sqrt{81 - 72\sin^23\gamma} = ${round(Math.sqrt(81 - 72 * Math.sin(3 * g * Math.PI / 180) ** 2), 4)}$ and $E(2^+_2)/E(2^+_1) = ${round(d, 4)}$${ask === 'two' ? R`, i.e. $${sig3(ans)}$` : ''}${ask === 'three' ? R`; then $E(3^+_1)/E(2^+_1) = 1 + ${round(d, 4)} = ${sig3(ans)}$` : ''}.`,
          trap: R`Putting $\gamma$ instead of $3\gamma$ into the sine.` };
      },
      verify: (p) => (p.ask === 'two' ? dav(p.g) : 1 + dav(p.g)) },
    { id: 'coll-r4g2', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'high spin',
      make(r) {
        const E = choose(r, [180, 250, 320, 400, 560, 640, 750, 900]), ask = choose(r, ['hw', 'w']), hw = E / 2, ans = ask === 'hw' ? hw : hw / 1000 / HBAR / 1e20;
        return { q: R`A stretched $E2$ gamma ray ($I\to I - 2$) of a rotational band has energy $${E}$ keV. Using $\hbar\omega = dE/dI\approx E_\gamma/2$${ask === 'w' ? R` and $\hbar = 6.582\times10^{-22}$ MeV s, the angular frequency of rotation is ______ $\times10^{20}$ rad/s (three significant figures)` : ', the rotational frequency $\\hbar\\omega$ is ______ keV'}.`,
          answer: ask === 'hw' ? hw : sig3(ans), tol: ask === 'hw' ? 0.5 : sig3(ans * 0.005), E, ask,
          sol: R`$\hbar\omega\approx E_\gamma/2 = ${hw}$ keV${ask === 'w' ? R`, so $\omega = \dfrac{${hw / 1000}\text{ MeV}}{6.582\times10^{-22}\text{ MeV s}} = ${sig3(ans)}\times10^{20}$ rad/s` : ''}.`,
          trap: R`Taking $\hbar\omega = E_\gamma$; the spin changes by two units in one transition.` };
      },
      verify: (p) => (p.ask === 'hw' ? p.E / 2 : p.E / 2 / 1000 / HBAR / 1e20) },
    { id: 'coll-r4g3', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'vibrations',
      make(r) {
        const N = choose(r, [1, 2, 3]), E2 = choose(r, [450, 520, 600, 680]);
        const o = mcqOptions(r, SETS[N], [...Object.values(SETS).filter((s) => s !== SETS[N]), ...WRONG], (v) => v);
        return { q: R`A spherical even-even nucleus is a harmonic quadrupole vibrator with $E(2^+_1) = ${E2}$ keV. The ${N === 1 ? 'one' : N === 2 ? 'two' : 'three'}-phonon level(s) at about $${N * E2}$ keV have spins`, ...o, N,
          sol: R`An $N$-phonon state lies at $N\hbar\omega = ${N}\times${E2}$ keV. Phonons with $\lambda = 2$ are identical bosons, so only symmetric couplings survive: one phonon gives $2^+$; two give $0^+, 2^+, 4^+$; three give $0^+, 2^+, 3^+, 4^+, 6^+$. Here ${SETS[N]}.`,
          trap: R`Including the antisymmetric (odd) couplings, as for two different phonons.` };
      } },
  ],
};
