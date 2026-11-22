// Round 5 extras for hydrogen-atom: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;

const LAM_INF = 121.5023; // Lyman alpha (nm) for infinite nuclear mass, Z = 1
const SH = 'spdfgh';
/** Probability of finding the electron beyond r = x a0 for 1s and 2p. */
const beyond = (st, x) => (st === '1s' ? Math.exp(-2 * x) * (1 + 2 * x + 2 * x * x) : Math.exp(-x) * (1 + x + x * x / 2 + x ** 3 / 6 + x ** 4 / 24));

export default {
  items: [
    { id: 'qhy-r5-01', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'reduced mass', unit: 'nm',
      q: R`Positronium is a bound electron and positron. Hydrogen's Lyman $\alpha$ line is at $121.57$ nm. Treating both as hydrogen-like and ignoring hydrogen's own tiny reduced-mass correction, positronium's $n = 2\to1$ line is at ______ nm (one decimal place).`,
      answer: 243.1, tol: 0.3, calc: () => 2 * 121.57,
      sol: R`Energies scale with the reduced mass. For positronium $\mu = m_e m_e/(2m_e) = m_e/2$, so all its levels are half as deep and every wavelength doubles: $2\times121.57 = 243.1$ nm (measured: 243.0 nm, since hydrogen itself has $\mu = 0.99946\,m_e$).`,
      trap: R`The positron is not a heavy nucleus: the reduced mass halves, it does not stay $m_e$.` },
    { id: 'qhy-r5-02', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'hydrogen-like ions',
      q: R`A hydrogen-like ion emits its $n = 2\to1$ line at $13.5$ nm. Hydrogen's is at $121.6$ nm. Ignoring reduced-mass differences, the nuclear charge is $Z = $ ______.`,
      answer: 3, tol: 0, calc: () => Math.round(Math.sqrt(121.6 / 13.5)),
      sol: R`All energies scale as $Z^2$, so wavelengths scale as $1/Z^2$: $Z^2 = 121.6/13.5 = 9.0$, so $Z = 3$ (Li$^{2+}$).`,
      trap: R`Wavelength goes as $1/Z^2$, not $1/Z$: $Z = 9$ would be wrong.` },
    { id: 'qhy-r5-03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'expectation values',
      q: R`For hydrogen, $\left\langle\dfrac{1}{r^2}\right\rangle_{nl} = \dfrac{1}{n^3(l + \tfrac12)a_0^2}$. The ratio $\langle1/r^2\rangle_{2s}/\langle1/r^2\rangle_{2p}$ is ______.`,
      answer: 3, tol: 0.001, calc: () => 1.5 / 0.5,
      sol: R`Same $n$, so the ratio is $\dfrac{l_{2p} + \tfrac12}{l_{2s} + \tfrac12} = \dfrac{1.5}{0.5} = 3$. The $2s$ electron comes much closer to the nucleus (it penetrates), even though its mean radius ($6a_0$) is larger than that of $2p$ ($5a_0$).`,
      trap: R`A larger $\langle r\rangle$ does not mean a smaller $\langle1/r^2\rangle$: the inner lobe of $2s$ dominates $1/r^2$.` },
    { id: 'qhy-r5-04', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'radial probability',
      q: R`For the hydrogen $2p$ state, $P(r)\propto r^4e^{-r/a_0}$. The probability that the electron is farther than $4a_0$ from the nucleus is ______ (three decimal places).`,
      answer: 0.629, tol: 0.002, calc: () => beyond('2p', 4),
      sol: R`$\int_R^\infty x^4e^{-x}dx/\int_0^\infty x^4e^{-x}dx = e^{-X}\left(1 + X + \tfrac{X^2}{2} + \tfrac{X^3}{6} + \tfrac{X^4}{24}\right)$ with $X = R/a_0 = 4$: $e^{-4}(1 + 4 + 8 + 10.667 + 10.667) = 0.01832\times34.33 = 0.629$. The most probable radius is exactly $4a_0$, yet more than half the probability lies outside it, because the distribution has a long tail.`,
      trap: R`The most probable radius is not the median: $P(r)$ is skewed to large $r$.` },
    { id: 'qhy-r5-05', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'matrix elements',
      q: R`With $\psi_{100} = \dfrac{e^{-r/a_0}}{\sqrt{\pi a_0^3}}$ and $\psi_{210} = \dfrac{r\cos\theta\,e^{-r/2a_0}}{\sqrt{32\pi a_0^5}}$, the dipole matrix element $\langle\psi_{210}|z|\psi_{100}\rangle = k\,a_0$ with $k = $ ______ (three decimal places).`,
      answer: 0.745, tol: 0.002, calc: () => 128 * Math.SQRT2 / 243,
      sol: R`$z = r\cos\theta$. Angular part: $\int\cos^2\theta\,d\Omega = 4\pi/3$. Radial part: $\int_0^\infty r^4e^{-3r/2a_0}dr = 4!\,(2a_0/3)^5 = 24\times\tfrac{32}{243}a_0^5$. Prefactor $1/\sqrt{32\pi^2a_0^8}$. So $k = \dfrac{1}{\sqrt{32}\,\pi}\cdot\dfrac{4\pi}{3}\cdot\dfrac{768}{243} = \dfrac{128\sqrt2}{243} = 0.745$. This element sets the strength of Lyman $\alpha$.`,
      trap: R`Using $e^{-r/a_0}$ in both factors (wrong exponent $3/2$) changes the radial integral.` },
    { id: 'qhy-r5-06', type: 'msq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'hydrogen-like ions', format: 'statements',
      q: R`For a hydrogen-like ion of nuclear charge $Z$ (fixed $n$, $l$), which scalings are correct?`,
      options: [R`$\langle r\rangle\propto1/Z$`, R`$E_n\propto Z^2$`, R`$|\psi_{n00}(0)|^2\propto Z^3$`, R`$\langle1/r^3\rangle\propto Z^2$`], answer: [0, 1, 2],
      sol: R`The only length is $a_0/Z$. So $\langle r\rangle\propto a_0/Z$, a density (per volume) at the nucleus $\propto(Z/a_0)^3$, and $\langle r^{-3}\rangle\propto(Z/a_0)^3$, not $Z^2$. Energy $= -Z^2e^2/(8\pi\varepsilon_0a_0n^2)\propto Z^2$. ($Z^3$ from $\langle r^{-3}\rangle$ times $Z$ in the potential gives the $Z^4$ of fine structure.)`,
      trap: R`Each power of $1/r$ brings one power of $Z$.` },
    { id: 'qhy-r5-07', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'probability current',
      q: R`For the hydrogen state $\psi_{211}\propto r\sin\theta\,e^{i\phi}e^{-r/2a_0}$, the probability current density $\vec j = \dfrac{\hbar}{m}\text{Im}(\psi^*\nabla\psi)$ is`,
      options: [R`zero everywhere, because the state is stationary`, R`directed radially outward`, R`directed along the $z$ axis`, R`directed around the $z$ axis (along $\hat\phi$), with $j_\phi = \hbar|\psi|^2/(mr\sin\theta)$`], answer: 3,
      sol: R`Only the phase $e^{i\phi}$ is complex. $\nabla$ in the $\hat\phi$ direction gives $\dfrac{1}{r\sin\theta}\partial_\phi\psi = \dfrac{i}{r\sin\theta}\psi$, so $\text{Im}(\psi^*\nabla\psi) = \dfrac{|\psi|^2}{r\sin\theta}\hat\phi$. The radial and $\theta$ parts are real and give no current. Stationary means $|\psi|^2$ does not change, not that $\vec j = 0$: a steady circulating current has zero divergence. It is the probability flow behind the orbital magnetic moment $-\mu_B$.`,
      trap: R`Stationary states can carry steady currents; only real wave functions (like $m = 0$) have $\vec j = 0$.` },
    { id: 'qhy-r5-08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'virial theorem',
      q: R`For the He$^+$ ion ($Z = 2$) in any state with $n = 3$, $\langle p^2\rangle = k\,\hbar^2/a_0^2$ with $k = $ ______ (two decimal places; ignore the reduced-mass correction).`,
      answer: 0.44, tol: 0.01, calc: () => 4 / 9,
      sol: R`The virial theorem for a $1/r$ potential gives $\langle T\rangle = -E_n = \dfrac{Z^2\hbar^2}{2ma_0^2n^2}$. Then $\langle p^2\rangle = 2m\langle T\rangle = \dfrac{Z^2}{n^2}\dfrac{\hbar^2}{a_0^2} = \dfrac49\dfrac{\hbar^2}{a_0^2} = 0.44\,\dfrac{\hbar^2}{a_0^2}$, the same for every $l$ in that shell.`,
      trap: R`$\langle p^2\rangle$ scales as $Z^2$, like the energy, not as $Z$.` },
    { id: 'qhy-r5-09', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'radial probability', format: 'not',
      q: R`Which statement about hydrogen's wave functions is NOT correct?`,
      options: [R`The $1s$ radial probability density $r^2|R_{10}|^2$ peaks at $r = a_0$`, R`The most probable radius of the $2p$ state is $2a_0$`,
        R`For $1s$, the probability density per unit volume $|\psi|^2$ is largest at the nucleus`, R`Every $s$ state has non-zero density at the nucleus`], answer: 1,
      sol: R`$2p$: $P(r)\propto r^4e^{-r/a_0}$, maximum where $4/r = 1/a_0$, at $r = 4a_0$ (in general $n^2a_0$ for $l = n - 1$). The rest are correct: $r^2e^{-2r/a_0}$ peaks at $a_0$; $|\psi_{100}|^2\propto e^{-2r/a_0}$ is largest at $r = 0$; $R_{n0}(0)\ne0$ for all $s$ states, while $R_{nl}\propto r^l$ vanishes there for $l>0$.`,
      trap: R`$2a_0$ is the Bohr radius of the $n = 2$ orbit scaled by $n$ instead of $n^2$.` },
    { id: 'qhy-r5-10', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'accidental degeneracy',
      q: R`A small extra term $\beta/r^2$ ($\beta > 0$) is added to the hydrogen Coulomb potential. The radial equation can still be solved exactly by writing $l'(l' + 1) = l(l + 1) + 2m\beta/\hbar^2$. What happens to the spectrum?`,
      options: [R`Nothing: the energies still depend only on $n$`, R`Each level splits into $2l + 1$ components labelled by $m$`,
        R`Levels with the same $n$ but different $l$ split, with higher $l$ shifted less; the $m$ degeneracy remains`, R`The bound states disappear`], answer: 2,
      sol: R`The energies become $E = -\dfrac{R_\infty hc}{(n_r + l' + 1)^2}$ with $l'$ no longer an integer, so states with the same $n = n_r + l + 1$ but different $l$ separate (the "accidental" Coulomb degeneracy, tied to the Runge-Lenz vector, is lost). $l' - l\approx\dfrac{m\beta}{\hbar^2(l + 1/2)}$ shrinks as $l$ grows, so high-$l$ levels move least. The potential is still central, so the $2l + 1$ $m$ states stay degenerate. This is a model for the quantum defects of alkali atoms.`,
      trap: R`Splitting in $m$ needs a preferred direction (a field); a central perturbation can only split $l$.` },
  ],
  gens: [
    { id: 'qhy-r5g1', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'radial probability',
      make(r) {
        const st = choose(r, ['1s', '2p']), x = pick(r, 0.5, st === '1s' ? 3 : 8, 0.5);
        const p = beyond(st, x), v = round(p, 4);
        return { q: R`For hydrogen in the ${st} state, the probability of finding the electron farther than $${x}\,a_0$ from the nucleus is ______ (four decimal places).`,
          answer: v, tol: Math.max(0.0005, round(p * 0.01, 5)), st, x,
          sol: R`${st === '1s' ? R`$P(r)\propto r^2e^{-2r/a_0}$, so $P(r > R) = e^{-2X}(1 + 2X + 2X^2)$` : R`$P(r)\propto r^4e^{-r/a_0}$, so $P(r > R) = e^{-X}(1 + X + X^2/2 + X^3/6 + X^4/24)$`} with $X = ${x}$: $${v}$.`,
          trap: 'Integrate the radial density r^2|R|^2, not |psi|^2 alone.' };
      },
      verify: (p) => beyond(p.st, p.x) },
    { id: 'qhy-r5g2', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'reduced mass',
      make(r) {
        const [name, Z, mu] = choose(r, [['positronium', 1, 0.5], ['muonium ($\\mu^+e^-$)', 1, 0.995187], ['ordinary hydrogen', 1, 0.999456], ['muonic hydrogen ($p\\mu^-$)', 1, 185.841], ['the He$^+$ ion', 2, 0.999863], ['the Li$^{2+}$ ion', 3, 0.999921], ['muonic helium-4 ion ($^4$He$\\,\\mu^-$)', 2, 201.08]]);
        const lam = LAM_INF / (mu * Z * Z), v = +lam.toPrecision(4);
        return { q: R`For infinite nuclear mass and $Z = 1$, the $n = 2\to1$ line would be at $121.502$ nm. For ${name} (nuclear charge $Z = ${Z}$, reduced mass $\mu = ${mu}\,m_e$) it is at ______ nm (four significant figures).`,
          answer: v, tol: +(v * 0.001).toPrecision(2), unit: 'nm', Z, mu,
          sol: R`Energies scale as $\mu Z^2$, so wavelengths scale as $1/(\mu Z^2)$: $\lambda = 121.502/(${mu}\times${Z * Z}) = ${v}$ nm.`,
          trap: 'Use the reduced mass in units of the electron mass, and Z squared.' };
      },
      verify: (p) => LAM_INF / (p.mu * p.Z * p.Z) },
    { id: 'qhy-r5g3', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'expectation values',
      make(r) {
        const n = int(r, 1, 5), l = int(r, 0, n - 1), Z = int(r, 1, 4);
        const val = Z * Z / (n ** 3 * (l + 0.5)), v = +val.toPrecision(3);
        return { q: R`For a hydrogen-like ion with $Z = ${Z}$ in the $${n}${SH[l]}$ state, $\langle1/r^2\rangle = k/a_0^2$ with $k = $ ______ (three significant figures). Use $\left\langle\dfrac1{r^2}\right\rangle = \dfrac{Z^2}{n^3(l + \tfrac12)a_0^2}$.`,
          answer: v, tol: +(v * 0.01).toPrecision(2), n, l, Z,
          sol: R`$k = \dfrac{${Z * Z}}{${n ** 3}\times${l + 0.5}} = ${v}$.`,
          trap: 'Two powers of 1/r bring Z squared.' };
      },
      verify: (p) => p.Z * p.Z / (p.n ** 3 * (p.l + 0.5)) },
  ],
};
