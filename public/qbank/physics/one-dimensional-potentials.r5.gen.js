// Round 5 extras for one-dimensional-potentials: original questions, written 2026-11-22.
import { choose, round } from '../_util.js';
const R = String.raw;
const E1NM = 0.37603; // ground energy of an electron in a 1 nm infinite well, eV

// Probability for state n of an infinite well (0, L) to lie between fractions u1 and u2 of the width.
const boxProb = (n, u1, u2) => (u2 - u1) - (Math.sin(2 * n * Math.PI * u2) - Math.sin(2 * n * Math.PI * u1)) / (2 * n * Math.PI);
// Probability to stay in the ground state when a box (0, L) suddenly widens to (0, cL).
const expandProb = (c) => ((2 * Math.sin(Math.PI / c) / Math.PI) * c * c / ((c * c - 1) * Math.sqrt(c))) ** 2;

export default {
  items: [
    { id: 'q1d-r5-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'shape of wavefunctions',
      q: R`In a classically forbidden region ($E < V$), a real stationary wavefunction $\psi(x)$`,
      options: [R`always curves towards the $x$-axis, like a sine wave`, R`is a straight line`, R`curves away from the $x$-axis, like an exponential`, R`must be zero`], answer: 2,
      sol: R`The Schrödinger equation gives $\psi'' = \dfrac{2m}{\hbar^2}(V - E)\psi$. With $V > E$, $\psi''$ has the same sign as $\psi$: where $\psi > 0$ it bends upward, where $\psi < 0$ it bends downward, always away from the axis. Such curves grow or decay like exponentials. In allowed regions the sign is reversed and $\psi$ bends back towards the axis, giving oscillations.`,
      trap: R`Thinking the wavefunction must vanish where the particle "cannot be" classically; it only decays there.` },
    { id: 'q1d-r5-02', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'delta potentials',
      q: R`A particle is bound in the delta well $V = -\alpha\delta(x)$. If the particle is replaced by one of twice the mass (same $\alpha$), its binding energy`,
      options: [R`doubles, and the decay length halves`, R`halves, and the decay length doubles`, R`is unchanged`, R`becomes four times larger`], answer: 0,
      sol: R`The bound state is $\psi \propto e^{-\kappa|x|}$ with $\kappa = m\alpha/\hbar^2$ (from the jump $\Delta\psi' = -\tfrac{2m\alpha}{\hbar^2}\psi(0)$) and $E = -\dfrac{\hbar^2\kappa^2}{2m} = -\dfrac{m\alpha^2}{2\hbar^2}$. Doubling $m$ doubles $|E|$ and doubles $\kappa$, so the decay length $1/\kappa$ halves: a heavier particle is bound more tightly.`,
      trap: R`Using $E = -\hbar^2\kappa^2/2m$ with $\kappa$ held fixed, which suggests the binding energy halves.` },
    { id: 'q1d-r5-03', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'infinite well',
      q: R`A particle is in the first excited state ($n = 2$) of an infinite well $0 < x < L$. The probability of finding it in the middle third, $L/3 < x < 2L/3$, is ______ (three decimal places).`,
      answer: 0.196, tol: 0.002, calc: () => boxProb(2, 1 / 3, 2 / 3),
      sol: R`$P = \dfrac{2}{L}\int_{L/3}^{2L/3}\sin^2\dfrac{2\pi x}{L}dx = \left[u - \dfrac{\sin4\pi u}{4\pi}\right]_{1/3}^{2/3}$ with $u = x/L$. This is $\dfrac13 - \dfrac{\sin(8\pi/3) - \sin(4\pi/3)}{4\pi} = 0.3333 - \dfrac{0.866 + 0.866}{12.566} = 0.3333 - 0.1378 = 0.196$. The node of $\psi_2$ sits at the centre, so the middle third holds less than the classical $1/3$.`,
      trap: R`Answering $1/3$ (the classical value) ignores the node at $x = L/2$.` },
    { id: 'q1d-r5-04', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'sudden change',
      q: R`A particle is in the ground state of an infinite well $0 < x < L$ when the right wall is suddenly moved to $x = 2L$. Which statements are correct just after the change?`,
      options: [R`The mean energy equals the old ground energy, four times the new ground energy`, R`The probability of finding the particle in the new $n = 2$ state is $1/2$`, R`The probability of finding it in the new ground state is more than $1/2$`, R`The wavefunction instantly spreads over $0 < x < 2L$`], answer: [0, 1],
      sol: R`In a sudden change the wavefunction has no time to change, so it is still $\sqrt{2/L}\sin(\pi x/L)$ on $(0, L)$ and zero beyond; the last statement is false. The energy expectation is computed from this same function, so it is the old $E_1 = \pi^2\hbar^2/2mL^2$, which equals $4E_1'$ with $E_1' = \pi^2\hbar^2/2m(2L)^2$. The new $n = 2$ state is $\sqrt{1/L}\sin(\pi x/L)$, the same shape on $(0, L)$: overlap $= \sqrt{2}/L\cdot L/2 = 1/\sqrt2$, probability $1/2$. The new ground state gives $|c_1|^2 = 32/9\pi^2 = 0.36$, less than $1/2$.`,
      trap: R`Expecting the particle to stay mostly in the ground state; the old ground state looks much more like the new first excited state.` },
    { id: 'q1d-r5-05', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'sudden change',
      q: R`A particle is in the ground state of an infinite well $0 < x < L$ when the well suddenly widens to $0 < x < 2L$. The probability that an energy measurement then finds the new ground state is ______ (three decimal places).`,
      answer: 0.360, tol: 0.002, calc: () => 32 / (9 * Math.PI ** 2),
      sol: R`$c_1 = \int_0^L\sqrt{\dfrac2L}\sin\dfrac{\pi x}{L}\sqrt{\dfrac1L}\sin\dfrac{\pi x}{2L}dx$. Using $\sin A\sin B = \tfrac12[\cos(A - B) - \cos(A + B)]$: $\int_0^L = \tfrac12\left[\dfrac{2L}{\pi} + \dfrac{2L}{3\pi}\right] = \dfrac{4L}{3\pi}$. So $c_1 = \dfrac{\sqrt2}{L}\cdot\dfrac{4L}{3\pi} = \dfrac{4\sqrt2}{3\pi} = 0.600$ and $|c_1|^2 = \dfrac{32}{9\pi^2} = 0.360$.`,
      trap: R`Normalising the new state as $\sqrt{2/L}$ instead of $\sqrt{2/2L}$ gives an impossible probability above 0.7.` },
    { id: 'q1d-r5-06', type: 'nat', level: 4, exams: ['gate', 'net', 'jam'], sub: 'infinite well',
      q: R`A particle in an infinite well $0 < x < L$ is prepared in $\psi(x) = Ax(L - x)$. The probability that an energy measurement gives the ground energy $E_1$ is ______ (four decimal places).`,
      answer: 0.9986, tol: 0.0002, calc: () => 960 / Math.PI ** 6,
      sol: R`Normalisation: $A^2\int_0^Lx^2(L - x)^2dx = A^2L^5/30 = 1$, so $A = \sqrt{30/L^5}$. Then $c_1 = \sqrt{\dfrac{2}{L}}A\int_0^Lx(L - x)\sin\dfrac{\pi x}{L}dx = \sqrt{\dfrac{60}{L^6}}\cdot\dfrac{4L^3}{\pi^3} = \dfrac{4\sqrt{60}}{\pi^3}$. So $|c_1|^2 = \dfrac{960}{\pi^6} = \dfrac{960}{961.39} = 0.9986$. The parabola is almost the sine; only odd $n$ contribute (even $n$ are odd about the centre), and $n = 3$ takes nearly all the remaining $0.14\%$.`,
      trap: R`Forgetting the $\sqrt{2/L}$ of the eigenfunction, which gives $|c_1|^2 > 1$.` },
    { id: 'q1d-r5-07', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'bound states',
      q: R`An asymmetric well has $V = V_1$ for $x < 0$, $V = 0$ for $0 < x < a$ and $V = V_2$ for $x > a$, with $V_1 > V_2 > 0$. Which statement is correct?`,
      options: [R`It always has at least one bound state, however shallow, as every 1D attractive well does`, R`It never has a bound state, because the two sides differ`, R`It has exactly one bound state for any $a$ and $V_2$`, R`It has a bound state only if $V_2a^2$ is large enough`], answer: 3,
      sol: R`The "always one bound state" theorem in 1D needs the potential to tend to the same value on both sides. Here the lower edge is $V_2$, so a bound state needs $E < V_2$, and the higher side acts partly like a wall. In the limit $V_1 \to \infty$ the problem is the half well, whose first state appears only when $a\sqrt{2mV_2}/\hbar > \pi/2$. For finite $V_1 > V_2$ the threshold is lower but still nonzero, so a shallow or narrow asymmetric well has no bound state.`,
      trap: R`Applying the symmetric-well theorem to a well whose two sides end at different heights.` },
    { id: 'q1d-r5-08', type: 'msq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'steps',
      q: R`Particles with $E > V_0$ come from the left and meet a step up of height $V_0$, with wavenumbers $k_1$ (left) and $k_2$ (right). The transmitted wave has amplitude $C$ and the incident wave $A$. Which statements are correct?`,
      options: [R`The transmitted wave has a longer de Broglie wavelength than the incident one`, R`Some particles are reflected although $E > V_0$`, R`The transmission coefficient is $|C|^2/|A|^2$`, R`$T = \dfrac{k_2}{k_1}\dfrac{|C|^2}{|A|^2}$ and $R + T = 1$`], answer: [0, 1, 3],
      sol: R`On the right the kinetic energy is $E - V_0 < E$, so $k_2 < k_1$ and the wavelength is longer. A sudden change of $k$ reflects part of the wave even above the step, a purely quantum effect. Transmission compares probability currents, $j = \hbar k|{\rm amplitude}|^2/m$, so $T = (k_2/k_1)|C/A|^2$, not $|C/A|^2$; with this definition $R + T = 1$. In fact $C/A = 2k_1/(k_1 + k_2) > 1$, so $|C/A|^2$ alone can exceed 1.`,
      trap: R`Taking $|C/A|^2$ as the transmission; it ignores that the particles move more slowly beyond the step.` },
    { id: 'q1d-r5-09', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'parity',
      q: R`A particle is in an infinite well $-L/2 < x < L/2$, in an equal superposition of two energy eigenstates $\psi_m$ and $\psi_n$ ($\psi_1$ is the ground state). For which pair does $\langle x\rangle$ oscillate in time?`,
      options: [R`$\psi_1$ and $\psi_3$`, R`$\psi_1$ and $\psi_4$`, R`$\psi_2$ and $\psi_4$`, R`$\psi_3$ and $\psi_5$`], answer: 1,
      sol: R`For $(\psi_m e^{-iE_mt/\hbar} + \psi_n e^{-iE_nt/\hbar})/\sqrt2$, $\langle x\rangle = \tfrac12(\langle m|x|m\rangle + \langle n|x|n\rangle) + \langle m|x|n\rangle\cos\dfrac{(E_n - E_m)t}{\hbar}$. In a well centred at the origin the states alternate in parity: odd $n$ are even functions, even $n$ are odd functions. The diagonal terms vanish, and $\langle m|x|n\rangle$ is nonzero only when the two states have opposite parity. Only $\psi_1$ (even) with $\psi_4$ (odd) qualifies.`,
      trap: R`Expecting any superposition to slosh; states of the same parity give a symmetric density at every time.` },
    { id: 'q1d-r5-10', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'steps',
      q: R`Particles with $E = V_0/4$ meet a step of height $V_0$ and are totally reflected. The reflected amplitude is $B = Ae^{i\phi}$. The size of the phase, $|\phi|$, is ______ degrees.`,
      answer: 120, tol: 1, unit: 'degrees', calc: () => 2 * Math.atan(Math.sqrt(3)) * 180 / Math.PI,
      sol: R`Left: $\psi = Ae^{ikx} + Be^{-ikx}$; right: $\psi = Ce^{-\kappa x}$. Matching $\psi$ and $\psi'$ at $x = 0$: $A + B = C$ and $ik(A - B) = -\kappa C$, so $\dfrac{B}{A} = \dfrac{k - i\kappa}{k + i\kappa}$, a pure phase $\phi = -2\arctan(\kappa/k)$. Here $\kappa/k = \sqrt{(V_0 - E)/E} = \sqrt3$, so $\arctan\sqrt3 = 60^\circ$ and $|\phi| = 120^\circ$. The phase means the wave reflects as if from a wall a little inside the step, by about the penetration depth.`,
      trap: R`Taking the phase as $\arctan(\kappa/k)$ alone; numerator and denominator each contribute, so it is twice that.` },
  ],
  gens: [
    { id: 'q1d-r5g1', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'infinite well',
      make(r) {
        const n = choose(r, [1, 2, 3, 4]);
        const [u1, u2, t1, t2] = choose(r, [[0, 0.25, '0', 'L/4'], [0, 1 / 3, '0', 'L/3'], [0.25, 0.75, 'L/4', '3L/4'], [0, 1 / 6, '0', 'L/6'], [1 / 3, 1 / 2, 'L/3', 'L/2'], [0.25, 0.5, 'L/4', 'L/2']]);
        const P = boxProb(n, u1, u2);
        return { q: R`A particle is in the state $n = ${n}$ of an infinite well $0 < x < L$. The probability of finding it between $x = ${t1}$ and $x = ${t2}$ is ______ (three decimal places).`,
          answer: round(P, 3), tol: 0.002, n, u1, u2,
          sol: R`With $u = x/L$: $P = 2\int\sin^2(${n}\pi u)\,du = \left[u - \dfrac{\sin(${2 * n}\pi u)}{${2 * n}\pi}\right]_{${round(u1, 4)}}^{${round(u2, 4)}}$. The plain length fraction is $${round(u2 - u1, 4)}$ and the correction is $${round(P - (u2 - u1), 4)}$, so $P = ${round(P, 3)}$. The correction shrinks as $n$ grows: at high $n$ the probability approaches the classical, uniform value.`,
          trap: R`Using the classical answer (the length fraction) or forgetting the factor $2/L$ in $|\psi|^2$.` };
      },
      verify: (p) => boxProb(p.n, p.u1, p.u2) },
    { id: 'q1d-r5g2', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'infinite well',
      make(r) {
        const L = choose(r, [0.5, 1, 1.5, 2, 3, 4, 5]), Emax = choose(r, [0.5, 1, 2, 3, 5, 10]);
        const E1 = E1NM / (L * L), N = Math.floor(Math.sqrt(Emax / E1) + 1e-9);
        return { q: R`An electron is in an infinite well $${L}$ nm wide. How many of its energy levels lie below $${Emax}$ eV? Use $E_1 = ${round(E1NM, 4)}/L^2$ eV with $L$ in nm.`,
          answer: N, tol: 0, L, Emax,
          sol: R`$E_n = n^2E_1$ with $E_1 = ${round(E1NM, 4)}/${L}^2 = ${round(E1, 4)}$ eV. A level lies below $${Emax}$ eV when $n < \sqrt{${Emax}/${round(E1, 4)}} = ${round(Math.sqrt(Emax / E1), 3)}$, so $n = 1$ to $${N}$: ${N} level${N === 1 ? '' : 's'}${N === 0 ? ' (none)' : ''}.`,
          trap: R`Dividing the energy by $E_1$ without the square root; levels grow as $n^2$, not $n$.` };
      },
      verify: (p) => Math.floor(Math.sqrt(p.Emax * p.L * p.L / E1NM) + 1e-9) },
    { id: 'q1d-r5g3', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'sudden change',
      make(r) {
        const c = choose(r, [1.5, 3, 4, 5]);
        const P = expandProb(c);
        return { q: R`A particle is in the ground state of an infinite well $0 < x < L$ when the right wall suddenly moves to $x = ${c}L$. The probability of finding it in the new ground state is ______ (three decimal places).`,
          answer: round(P, 3), tol: 0.002, c,
          sol: R`$c_1 = \int_0^L\sqrt{\dfrac2L}\sin\dfrac{\pi x}{L}\sqrt{\dfrac{2}{${c}L}}\sin\dfrac{\pi x}{${c}L}dx$. With $u = x/L$ and $\sin A\sin B = \tfrac12[\cos(A - B) - \cos(A + B)]$ this gives $c_1 = \dfrac{2\sin(\pi/${c})}{\pi}\cdot\dfrac{${c}^2}{(${c}^2 - 1)\sqrt{${c}}} = ${round(Math.sqrt(P), 4)}$, so $|c_1|^2 = ${round(P, 3)}$. The wider the new box, the less the old state resembles its ground state.`,
          trap: R`Normalising the new state with $\sqrt{2/L}$ rather than $\sqrt{2/${c}L}$.` };
      },
      verify: (p) => expandProb(p.c) },
  ],
};
