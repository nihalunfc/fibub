// Round 4 extras for time-dependent-perturbation: original questions, written 2026-11-22.
import { int, choose, round } from '../_util.js';
const R = String.raw;
const zeno = (N) => Math.cos(Math.PI / (2 * N)) ** (2 * N);
const overlap1s = (a, b) => (4 * a * b / (a + b) ** 2) ** 3;

export default {
  items: [
    { id: 'qtd-r4-01', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'golden rule',
      q: R`A constant perturbation is switched on at $t = 0$. After a long time $t$, first-order theory says the system has gone mainly into final states with`,
      options: [R`$E_f \approx E_i$, within about $h/t$`, R`the highest available energies`, R`$E_f = E_i + \hbar\omega$ for some fixed $\omega$`, R`any energy, all equally likely`], answer: 0,
      sol: R`$P_{i\to f} = \dfrac{4|V_{fi}|^2}{\hbar^2}\dfrac{\sin^2(\omega_{fi}t/2)}{\omega_{fi}^2}$ has a central peak at $\omega_{fi} = 0$ of width about $2\pi/t$. So at long times only states with $|E_f - E_i| \lesssim h/t$ are reached: energy is conserved. A harmonic perturbation at $\omega$ would instead select $E_f = E_i \pm \hbar\omega$.`,
      trap: R`A constant perturbation supplies no energy quantum; that needs time dependence.` },
    { id: 'qtd-r4-02', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'selection rules',
      q: R`The electric dipole approximation for an atom in a light wave is justified when`,
      options: [R`the light is weak`, R`the atom is in its ground state`, R`the wavelength is much longer than the atom, so $e^{i\vec k\cdot\vec r} \approx 1$ across it`, R`the photon energy is much less than $kT$`], answer: 2,
      sol: R`The field is $\propto e^{i(\vec k\cdot\vec r - \omega t)}$. For visible light $\lambda \approx 500$ nm while the atom is about $0.1$ nm, so $kr \sim 10^{-3}$ and the field is uniform over the atom. Keeping only the leading term gives $V = -\vec d\cdot\vec E$. The next terms ($i\vec k\cdot\vec r$) give magnetic dipole and electric quadrupole transitions, slower by about $(kr)^2$.`,
      trap: R`Weak light is needed for first-order perturbation theory, a separate approximation.` },
    { id: 'qtd-r4-03', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'Einstein coefficients',
      q: R`A two-level atom (equal degeneracies) is pumped only by very intense incoherent broadband light at its transition frequency. The largest steady fraction of atoms that can be in the upper level is`,
      options: [R`1`, R`1/2`, R`1/e`, R`2/3`], answer: 1,
      sol: R`With $B_{12} = B_{21} = B$: $\dfrac{dN_2}{dt} = B\rho(N_1 - N_2) - AN_2$. In steady state $\dfrac{N_2}{N_1} = \dfrac{B\rho}{B\rho + A} < 1$, which tends to 1 as $\rho \to \infty$. So $N_2 \to N/2$: absorption and stimulated emission balance. Population inversion needs three or four levels.`,
      trap: R`Strong pumping drives stimulated emission as hard as absorption; it cannot invert two levels.` },
    { id: 'qtd-r4-04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'rabi',
      q: R`In Ramsey's method, an atom gets a short resonant $\pi/2$ pulse, evolves freely for $T = 1.0$ ms, then gets a second $\pi/2$ pulse. As the drive detuning $\delta/2\pi$ is scanned, the final upper-state probability oscillates with period ______ Hz.`,
      answer: 1000, tol: 5, unit: 'Hz', calc: () => 1 / 1.0e-3,
      sol: R`During the free evolution the atom's superposition gains a phase $\delta T$ relative to the drive. The second pulse turns this phase into population: $P = \cos^2(\delta T/2)$ (for short pulses). One fringe corresponds to $\delta T = 2\pi$, i.e. $\delta/2\pi = 1/T = 1000$ Hz. Longer free times give narrower fringes, which is how atomic clocks reach their precision.`,
      trap: R`Answering $1/2T$ from the half-width, or $2\pi/T$ in angular units.` },
    { id: 'qtd-r4-05', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'harmonic perturbation',
      q: R`An oscillator (frequency $\omega$) in its ground state feels a constant force $F_0$ (perturbation $-F_0x$) switched on at $t = 0$ and off at exactly $t = 2\pi/\omega$. Afterwards the oscillator is`,
      options: [R`in $|1\rangle$ with probability 1`, R`in a coherent state whose $|\alpha|^2$ grows as $F_0^2$`, R`in a thermal state`, R`back in its ground state`], answer: 3,
      sol: R`First order: $c_1 = \dfrac{i}{\hbar}F_0\sqrt{\dfrac{\hbar}{2m\omega}}\int_0^Te^{i\omega t}dt$, and the integral over one full period is zero. Exactly, a forced oscillator ends in a coherent state with $\alpha \propto \int F(t)e^{i\omega t}dt$, which also vanishes: the push and the pull cancel. Classically too, a constant force acting for one period leaves no oscillation behind.`,
      trap: R`The transition probability depends on the Fourier component of the force at $\omega$, not on how long or how hard it pushes.` },
    { id: 'qtd-r4-06', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'selection rules', format: 'statements',
      q: R`About the 21 cm line of atomic hydrogen, which statements are correct?`,
      options: [R`It is a magnetic dipole transition between the two hyperfine levels of the $1s$ state`, R`Its spontaneous rate is tiny mainly because the rate scales as $\omega^3$ and $\omega$ is very small`, R`As an electric dipole transition it is forbidden, since both levels have $l = 0$`, R`The upper level lives about 1 ns`], answer: [0, 1, 2],
      sol: R`The line comes from flipping the electron spin relative to the proton's ($F = 1 \to 0$), a magnetic dipole ($\Delta l = 0$) transition; E1 needs $\Delta l = \pm1$. At $1.42$ GHz the $\omega^3$ factor and the weak magnetic coupling give a lifetime of about $10^7$ years, not nanoseconds. It is still seen everywhere in astronomy because there is so much hydrogen.`,
      trap: R`A 1 ns lifetime belongs to strong optical E1 lines such as $2p \to 1s$.` },
    { id: 'qtd-r4-07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'measurement and evolution',
      q: R`A resonant drive would carry a two-level atom from $|1\rangle$ to $|2\rangle$ in a time $\tau$ (a $\pi$ pulse). Instead, the state is measured 10 times, at $\tau/10, 2\tau/10, \dots, \tau$. The probability that every measurement finds the atom still in $|1\rangle$ is ______ (three decimal places).`,
      answer: 0.781, tol: 0.003, calc: () => zeno(10),
      sol: R`Between measurements the amplitude rotates by angle $\theta = \pi/2\times\tfrac1{10}$ (a full $\pi$ pulse turns $\cos(\Omega t/2)$ from 1 to 0). Each measurement finds $|1\rangle$ with probability $\cos^2(\pi/20)$ and resets the state. So $P = [\cos^2(\pi/20)]^{10} = (0.9755)^{10} = 0.781$. Without measurements the atom would surely be in $|2\rangle$. More frequent measurements freeze it further: the quantum Zeno effect.`,
      trap: R`Using $\cos^2(\pi/10)$ per step mixes up the Rabi angle $\Omega t$ with the amplitude angle $\Omega t/2$.` },
    { id: 'qtd-r4-08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'sudden approximation',
      q: R`A tritium atom in its ground state beta-decays, suddenly turning the nucleus into $^3$He ($Z$: $1 \to 2$). The probability that the electron ends up in the $1s$ state of He$^+$ is ______ (three decimal places). Use $\langle 1s_{Z_1}|1s_{Z_2}\rangle = \left(\dfrac{2\sqrt{Z_1Z_2}}{Z_1 + Z_2}\right)^3$.`,
      answer: 0.702, tol: 0.002, calc: () => overlap1s(1, 2),
      sol: R`The decay electron leaves in about $10^{-18}$ s, far quicker than the atomic period, so the bound electron's wavefunction is unchanged. Probability $= |\langle 1s_{Z=2}|1s_{Z=1}\rangle|^2 = \left(\dfrac{2\sqrt2}{3}\right)^6 = \left(\dfrac89\right)^3 = 0.702$. The remaining 30% goes to excited or ionised states of He$^+$.`,
      trap: R`Forgetting to square the overlap gives 0.838.` },
    { id: 'qtd-r4-09', type: 'mcq', level: 5, exams: ['net', 'gate'], sub: 'golden rule',
      q: R`A state $|\psi\rangle$ that is not an eigenstate of $H$ evolves freely. At very short times its survival probability $|\langle\psi|e^{-iHt/\hbar}|\psi\rangle|^2$`,
      options: [R`falls exponentially from the start, as $e^{-\Gamma t/\hbar}$`, R`falls quadratically, as $1 - (\Delta H)^2t^2/\hbar^2$`, R`stays exactly 1 until a finite time`, R`decreases linearly, as $1 - \Gamma t/\hbar$`], answer: 1,
      sol: R`Expand: $\langle\psi|e^{-iHt/\hbar}|\psi\rangle = 1 - \dfrac{i\langle H\rangle t}{\hbar} - \dfrac{\langle H^2\rangle t^2}{2\hbar^2} + \dots$, whose squared modulus is $1 - \dfrac{(\langle H^2\rangle - \langle H\rangle^2)t^2}{\hbar^2} + O(t^3)$. The slope at $t = 0$ is zero. The exponential decay of the golden rule only sets in after times longer than the inverse bandwidth of the continuum; the quadratic start is what makes the Zeno effect possible.`,
      trap: R`Assuming exponential decay holds from $t = 0$; no finite-energy-spread state decays linearly at the start.` },
    { id: 'qtd-r4-10', type: 'msq', level: 5, exams: ['net', 'gate'], sub: 'adiabatic theorem', format: 'statements',
      q: R`A system follows an eigenstate adiabatically while the parameters of $H$ go slowly around a closed loop. Which statements about the geometric (Berry) phase are correct?`,
      options: [R`For a spin-$\tfrac12$ aligned with a field whose direction traces a loop of solid angle $\Omega$, it is $\mp\Omega/2$`, R`It depends on how fast the loop is traversed, as long as it is adiabatic`, R`For a closed loop it cannot be removed by re-phasing the eigenstates`, R`If $H$ is real all along the loop, it can only be $0$ or $\pi$`], answer: [0, 2, 3],
      sol: R`The total phase is the dynamical part $-\tfrac1\hbar\int E\,dt$ (which does depend on speed) plus $\gamma = i\oint\langle n|\nabla n\rangle\cdot d\vec R$, which depends only on the path. For a spin-$\tfrac12$, $\gamma = \mp\tfrac12\Omega$ (half the solid angle, sign by spin direction). Re-phasing $|n\rangle \to e^{i\chi}|n\rangle$ changes $\gamma$ by $\oint\nabla\chi\cdot d\vec R$, a multiple of $2\pi$ for a closed loop. With real eigenvectors the only freedom is a sign, so $\gamma = 0$ or $\pi$.`,
      trap: R`Speed changes the dynamical phase, not the geometric one.` },
    { id: 'qtd-r4-11', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'spontaneous emission',
      q: R`For atoms in isotropic, unpolarised radiation, the absorption rate contains $|\langle f|\hat\epsilon\cdot\vec r|i\rangle|^2$ averaged over all directions of the polarisation $\hat\epsilon$. This average equals`,
      options: [R`$|\langle f|\vec r|i\rangle|^2$`, R`$\tfrac12|\langle f|\vec r|i\rangle|^2$`, R`$\tfrac23|\langle f|\vec r|i\rangle|^2$`, R`$\tfrac13|\langle f|\vec r|i\rangle|^2$`], answer: 3,
      sol: R`$|\hat\epsilon\cdot\vec r_{fi}|^2 = |\vec r_{fi}|^2\cos^2\theta$ for a real vector (and the same argument works component by component), and the average of $\cos^2\theta$ over all directions is $\tfrac13$. This $\tfrac13$ appears in the Einstein $B$ coefficient, $B = \dfrac{\pi e^2|\vec r_{fi}|^2}{3\varepsilon_0\hbar^2}$.`,
      trap: R`$\tfrac12$ is the average of $\cos^2$ over a circle, not over a sphere.` },
    { id: 'qtd-r4-12', type: 'nat', level: 2, exams: ['gate', 'net', 'jam'], sub: 'spontaneous emission',
      q: R`An excited level can decay by two channels whose separate lifetimes would be $5.0$ ns and $20$ ns. The fraction of decays that go through the first channel is ______ (two decimal places).`,
      answer: 0.8, tol: 0.01, calc: () => (1 / 5) / (1 / 5 + 1 / 20),
      sol: R`Rates add: $\Gamma_1 = 1/5 = 0.20$ ns$^{-1}$ and $\Gamma_2 = 1/20 = 0.05$ ns$^{-1}$. The branching ratio is $\Gamma_1/(\Gamma_1 + \Gamma_2) = 0.20/0.25 = 0.80$. The actual lifetime is $1/0.25 = 4.0$ ns, shorter than either alone.`,
      trap: R`Splitting by lifetimes ($5/25 = 0.2$) inverts the answer: the faster channel wins.` },
  ],
  gens: [
    { id: 'qtd-r4g1', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'measurement and evolution',
      make(r) {
        const N = int(r, 2, 20), ans = zeno(N);
        return { q: R`A resonant $\pi$ pulse of length $\tau$ would move a two-level atom from $|1\rangle$ to $|2\rangle$. Instead the atom is measured $${N}$ times, equally spaced, the last at $\tau$. The probability that every measurement finds it in $|1\rangle$ is ______ (three decimal places).`,
          answer: round(ans, 3), tol: 0.003, N,
          sol: R`Between measurements the amplitude angle advances by $\dfrac{\pi}{2\times${N}}$, so each measurement finds $|1\rangle$ with probability $\cos^2\dfrac{\pi}{${2 * N}}$ and resets the state. Overall $P = \left[\cos^2\dfrac{\pi}{${2 * N}}\right]^{${N}} = ${round(ans, 3)}$. As $N \to \infty$, $P \approx 1 - \pi^2/4N \to 1$: the Zeno effect.`,
          trap: R`The amplitude angle is half the Rabi angle: a $\pi$ pulse turns the amplitude by $\pi/2$.` };
      },
      verify: (p) => zeno(p.N) },
    { id: 'qtd-r4g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'sudden approximation',
      make(r) {
        const Z1 = int(r, 1, 9), Z2 = Z1 === 1 ? 2 : Z1 + choose(r, [1, -1]);
        const ans = overlap1s(Z1, Z2);
        return { q: R`A hydrogen-like ion with nuclear charge $Z = ${Z1}$ and its electron in $1s$ undergoes a nuclear decay that suddenly changes the charge to $Z = ${Z2}$. The probability that the electron is found in the new $1s$ state is ______ (three decimal places). Use $\langle 1s_{Z_1}|1s_{Z_2}\rangle = \left(\dfrac{2\sqrt{Z_1Z_2}}{Z_1 + Z_2}\right)^3$.`,
          answer: round(ans, 3), tol: 0.002, Z1, Z2,
          sol: R`Sudden approximation: the wavefunction is unchanged, so $P = |\langle 1s_{${Z2}}|1s_{${Z1}}\rangle|^2 = \left(\dfrac{4\times${Z1}\times${Z2}}{${(Z1 + Z2) ** 2}}\right)^3 = ${round(ans, 3)}$. The larger $Z$, the smaller the relative change, and the closer to 1.`,
          trap: R`The given overlap is an amplitude; square it.` };
      },
      verify: (p) => overlap1s(p.Z1, p.Z2) },
    { id: 'qtd-r4g3', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'harmonic perturbation',
      make(r) {
        const g = choose(r, [0.001, 0.002, 0.005, 0.01, 0.02]);
        const [wt, tex] = choose(r, [[Math.PI / 3, '\\pi/3'], [Math.PI / 2, '\\pi/2'], [2 * Math.PI / 3, '2\\pi/3'], [Math.PI, '\\pi'], [4 * Math.PI / 3, '4\\pi/3'], [3 * Math.PI / 2, '3\\pi/2']]);
        const ans = 4 * g * Math.sin(wt / 2) ** 2;
        return { q: R`An oscillator in its ground state feels a constant force $F_0$ (perturbation $-F_0x$) for a time $T$ with $\omega T = ${tex}$. With $F_0^2/(2m\hbar\omega^3) = ${g}$, the first-order probability of ending in $|1\rangle$ is ______ (three significant figures).`,
          answer: +ans.toPrecision(3), tol: +(ans * 0.01).toPrecision(2), g, wt,
          sol: R`$c_1 = \dfrac{i}{\hbar}F_0\sqrt{\dfrac{\hbar}{2m\omega}}\dfrac{e^{i\omega T} - 1}{i\omega}$, so $|c_1|^2 = \dfrac{F_0^2}{2m\hbar\omega^3}|e^{i\omega T} - 1|^2 = ${g}\times4\sin^2\dfrac{\omega T}{2}$. With $\omega T = ${tex}$: $P = ${+ans.toPrecision(3)}$. It is largest for $\omega T = \pi$ and zero for a whole period.`,
          trap: R`Forgetting the factor $|e^{i\omega T} - 1|^2 = 4\sin^2(\omega T/2)$.` };
      },
      verify: (p) => 4 * p.g * Math.sin(p.wt / 2) ** 2 },
  ],
};
