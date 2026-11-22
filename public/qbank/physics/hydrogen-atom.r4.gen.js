// Round 4 extras for hydrogen-atom: original questions, written 2026-11-22.
import { int, choose, round, fmt } from '../_util.js';
const R = String.raw;

const RINF = 1.0973731568e7; // m^-1
const RHC = 3.28805e15; // R_H c in Hz (hydrogen, reduced mass included)
/** Hydrogen-like ions: label, Z, nuclear mass (u). */
const IONS = [['He$^+$', 2, 4.0015], ['Li$^{2+}$', 3, 7.0144], ['Be$^{3+}$', 4, 9.0100], ['B$^{4+}$', 5, 11.0066], ['C$^{5+}$', 6, 11.9967]];
const ME_U = 5.48579909e-4;
/** <n00|z|n'10> magnitudes in units of a0. */
const ZME = { '1s-2p': 128 * Math.SQRT2 / 243, '2s-2p': 3 };

export default {
  items: [
    { id: 'qhy-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'energy levels',
      q: R`With $E_n = -13.6\ \text{eV}/n^2$, the energy of the $n = 3$ level of hydrogen is`,
      options: [R`$-1.51$ eV`, R`$-4.53$ eV`, R`$-3.40$ eV`, R`$-0.85$ eV`], answer: 0,
      sol: R`$E_3 = -13.6/9 = -1.51$ eV. ($-4.53$ divides by 3 instead of 9; $-3.40$ and $-0.85$ are $n = 2$ and $n = 4$.)`,
      trap: R`Energies go as $1/n^2$, not $1/n$.` },
    { id: 'qhy-r4-02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'expectation values',
      q: R`Using $\langle r\rangle_{nl} = \tfrac{a_0}{2}[3n^2 - l(l+1)]$, the mean radius of the hydrogen $4f$ state is ______ $a_0$.`,
      answer: 18, tol: 0, calc: () => (3 * 16 - 12) / 2,
      sol: R`$4f$: $n = 4$, $l = 3$. $\langle r\rangle = \tfrac{a_0}{2}(48 - 12) = 18a_0$. (The $4s$ state has $24a_0$: low-$l$ orbits are more eccentric and reach farther out on average.)`,
      trap: R`$f$ means $l = 3$, so $l(l+1) = 12$.` },
    { id: 'qhy-r4-03', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'spectral series',
      q: R`The shortest wavelength in the Lyman series of hydrogen (the series limit) is about`,
      options: [R`$121.6$ nm`, R`$91.2$ nm`, R`$364.6$ nm`, R`$656.3$ nm`], answer: 1,
      sol: R`The limit is the jump from $n = \infty$ to $n = 1$: $1/\lambda = R_H$, so $\lambda = 1/(1.0968\times10^7\ \text{m}^{-1}) = 91.2$ nm, corresponding to the ionisation energy 13.6 eV. $121.6$ nm is Lyman $\alpha$ ($2\to1$), $364.6$ nm the Balmer limit, $656.3$ nm Balmer $\alpha$.`,
      trap: R`The series limit is the shortest wavelength of a series, not its first line.` },
    { id: 'qhy-r4-04', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'radial probability',
      q: R`For the hydrogen $2s$ state, $R_{20} = \dfrac{1}{2\sqrt2}a_0^{-3/2}\left(2 - \dfrac{r}{a_0}\right)e^{-r/2a_0}$. The probability of finding the electron within $r < a_0$ is ______ (four decimal places).`,
      answer: 0.0343, tol: 0.0003, calc: () => 1 - 21 / (8 * Math.E),
      sol: R`With $x = r/a_0$: $P = \tfrac18\int_0^1(2 - x)^2x^2e^{-x}dx = \tfrac18\int_0^1(4x^2 - 4x^3 + x^4)e^{-x}dx$. Using $\int_0^1x^ke^{-x}dx = k!\left(1 - e^{-1}\sum_{j=0}^k\tfrac{1}{j!}\right)$: $I_2 = 2 - 5/e$, $I_3 = 6 - 16/e$, $I_4 = 24 - 65/e$. So $4I_2 - 4I_3 + I_4 = 8 - 21/e$ and $P = 1 - \dfrac{21}{8e} = 0.0343$. (For $1s$ the same probability is 0.323: the $2s$ electron spends most of its time far out, beyond its node at $2a_0$.)`,
      trap: R`Forgetting the $r^2$ in the volume element (integrating $|R|^2$ alone) gives a much larger number.` },
    { id: 'qhy-r4-05', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Rydberg atoms',
      q: R`A hydrogen atom is excited to $n = 100$, $l = 0$. Using $\langle r\rangle = \tfrac{a_0}{2}[3n^2 - l(l+1)]$, its size is of the order of`,
      options: [R`$1$ nm`, R`$50$ pm`, R`$1\ \mu$m`, R`$1$ mm`], answer: 2,
      sol: R`$\langle r\rangle = 1.5\times10^4a_0 = 1.5\times10^4\times0.0529$ nm $= 794$ nm $\approx0.8\ \mu$m, about the size of a bacterium. Such Rydberg atoms are fragile (binding energy $13.6/n^2 = 1.4$ meV) and very sensitive to fields.`,
      trap: R`Radii grow as $n^2$, not $n$: going from $n = 1$ to 100 multiplies the size by about $10^4$.` },
    { id: 'qhy-r4-06', type: 'msq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'spectral series', format: 'statements',
      q: R`Which statements about the spectral series of hydrogen are correct?`,
      options: [R`Some Balmer lines lie in the visible`, R`All Lyman lines lie in the ultraviolet`,
        R`The Paschen series limit is near 820 nm`, R`Brackett $\alpha$ ($5\to4$) has a shorter wavelength than Balmer $\alpha$`], answer: [0, 1, 2],
      sol: R`Balmer: $H_\alpha$ 656 nm, $H_\beta$ 486 nm, ... down to 365 nm. Lyman: 91 to 122 nm, all UV. Paschen limit: $1/\lambda = R_H/9$, $\lambda = 9\times91.2 = 820$ nm. Brackett $\alpha$: $1/\lambda = R_H(1/16 - 1/25)$, $\lambda = 4.05\ \mu$m, far longer than 656 nm.`,
      trap: R`Series ending on higher $n$ have smaller energy gaps and longer wavelengths.` },
    { id: 'qhy-r4-07', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'dipole matrix elements',
      q: R`A hydrogen atom is in $\psi = \tfrac{1}{\sqrt2}(\psi_{100} + \psi_{210})$, with $\psi_{100} = (\pi a_0^3)^{-1/2}e^{-r/a_0}$ and $\psi_{210} = (32\pi a_0^3)^{-1/2}\dfrac{r}{a_0}e^{-r/2a_0}\cos\theta$. The expectation value $\langle z\rangle$ is ______ $a_0$ (three decimal places).`,
      answer: 0.745, tol: 0.003, calc: () => 128 * Math.SQRT2 / 243,
      sol: R`$\langle z\rangle = \tfrac12[\langle100|z|100\rangle + \langle210|z|210\rangle + 2\langle100|z|210\rangle]$; the first two vanish by parity. $\langle100|z|210\rangle = \dfrac{1}{\pi a_0^3\sqrt{32}}\int\dfrac{r}{a_0}e^{-3r/2a_0}\,r\cos^2\theta\,r^2dr\,d\Omega$. Angular part: $4\pi/3$. Radial: $\dfrac1{a_0}\int_0^\infty r^4e^{-3r/2a_0}dr = \dfrac{24}{a_0}\left(\dfrac{2a_0}{3}\right)^5 = \dfrac{768}{243}a_0^4$. Total $= \dfrac{4}{3}\cdot\dfrac{768}{243}\cdot\dfrac{a_0}{\sqrt{32}} = \dfrac{128\sqrt2}{243}a_0 = 0.745a_0$. So $\langle z\rangle = 0.745a_0$: the mixed state has an electric dipole, which oscillates at the $1s$-$2p$ frequency in time.`,
      trap: R`Each eigenstate alone has $\langle z\rangle = 0$; the dipole comes entirely from the cross term.` },
    { id: 'qhy-r4-08', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'hydrogen-like ions', unit: 'nm',
      q: R`Lyman $\alpha$ of hydrogen is at $121.57$ nm. Ignoring the small change in reduced mass, the Lyman $\alpha$ ($2\to1$) line of the hydrogen-like ion C$^{5+}$ ($Z = 6$) is at ______ nm (three decimal places).`,
      answer: 3.377, tol: 0.003, calc: () => 121.57 / 36,
      sol: R`Hydrogen-like energies scale as $Z^2$, so every wavelength is divided by $Z^2 = 36$: $121.57/36 = 3.377$ nm, a soft X-ray. Such lines are used to diagnose hot plasmas.`,
      trap: R`Dividing by $Z$ (6) instead of $Z^2$ gives 20.3 nm.` },
    { id: 'qhy-r4-09', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'degeneracy',
      q: R`The degeneracy of $2s$ and $2p$ in non-relativistic hydrogen is special to the $1/r$ potential. Suppose instead the proton is a small uniformly charged sphere, so the potential is less attractive inside it than $-e^2/4\pi\epsilon_0r$. Then`,
      options: [R`$2p$ moves up and lies above $2s$`, R`both move up equally and stay degenerate`,
        R`the two split symmetrically, one up and one down`, R`$2s$ moves up and lies above $2p$`], answer: 3,
      sol: R`The perturbation $\delta V > 0$ acts only inside the nucleus, where only $s$ electrons have non-zero density ($R_{nl}\propto r^l$ near the origin). So $\Delta E_{2s} = \int|\psi_{2s}|^2\delta V\,d^3r > 0$, while $\Delta E_{2p}\approx0$ (smaller by a factor of order $(R/a_0)^2$). The $2s$ level rises above $2p$. (In hydrogen this finite-size shift is tiny next to the Lamb shift, but in muonic hydrogen it is large, which is how the proton radius is measured.)`,
      trap: R`A spherical perturbation keeps $l$ and $m$ good, but it need not affect each $l$ equally: it weighs each state by its density inside the nucleus.` },
    { id: 'qhy-r4-10', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'selection rules',
      q: R`In hydrogen the $2p$ level decays in about 1.6 ns, but the $2s$ level lives about 0.12 s when the atom is undisturbed. The reason is that`,
      options: [R`$2s$ lies higher than $2p$ by the Lamb shift`, R`a single-photon electric dipole decay $2s\to1s$ is forbidden ($\Delta l = 0$), so $2s$ must decay by emitting two photons`,
        R`$2s$ has no overlap with $1s$`, R`$2s$ has zero orbital angular momentum, so it cannot radiate at all`], answer: 1,
      sol: R`E1 needs $\Delta l = \pm1$ (parity change). The only level below $2s$ is $1s$ ($l = 0$), and $2s\to2p$ has negligible energy (the Lamb shift), so its rate is tiny. The fastest route is the simultaneous emission of two photons whose energies add to $E_{2s} - E_{1s}$, a second-order process with rate about 8.2 s$^{-1}$. A small electric field mixes $2s$ with $2p$ and quenches it quickly.`,
      trap: R`$2s$ can radiate, just not by a single E1 photon to $1s$.` },
    { id: 'qhy-r4-11', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'reduced mass', format: 'statements',
      q: R`Which statements about reduced-mass effects in hydrogen-like systems are correct?`,
      options: [R`Balmer lines of deuterium lie at slightly shorter wavelengths than those of hydrogen`, R`The Rydberg constant for hydrogen is $R_H = R_\infty\,\mu/m_e$`,
        R`The ground-state binding energy of positronium is half that of hydrogen`, R`The Bohr radius of positronium is half that of hydrogen`], answer: [0, 1, 2],
      sol: R`All energies scale with the reduced mass $\mu = mM/(m + M)$; lengths scale as $1/\mu$. Deuterium's heavier nucleus gives a larger $\mu$, so slightly larger energies and shorter wavelengths (the isotope shift that led to its discovery). Positronium has $\mu = m_e/2$: binding $6.8$ eV, and its "Bohr radius" is $2a_0$, twice as large.`,
      trap: R`A smaller reduced mass makes the atom bigger, not smaller.` },
    { id: 'qhy-r4-12', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'spectral series',
      q: R`Hydrogen atoms in the $n = 2$ level absorb light and are raised to $n = 4$. The wavelength absorbed is about`,
      options: [R`$656$ nm`, R`$434$ nm`, R`$486$ nm`, R`$1875$ nm`], answer: 2,
      sol: R`$\Delta E = 13.6(1/4 - 1/16) = 2.55$ eV, so $\lambda = 1240/2.55 = 486$ nm, the Balmer $\beta$ ($H_\beta$) line seen in absorption. $656$ nm is $2\leftrightarrow3$, $434$ nm $2\leftrightarrow5$, $1875$ nm $3\leftrightarrow4$.`,
      trap: R`Absorption and emission between the same two levels have the same wavelength.` },
  ],
  gens: [
    { id: 'qhy-r4g1', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'dipole matrix elements',
      make(r) {
        const pair = choose(r, ['1s-2p', '2s-2p']);
        const a = int(r, 1, 4), b = int(r, 1, 4);
        const z = 2 * a * b / (a * a + b * b) * ZME[pair];
        const [s1, s2] = pair === '1s-2p' ? ['100', '210'] : ['200', '210'];
        return { q: R`A hydrogen atom is in the normalised state $\psi = \dfrac{${a === 1 ? '' : a}\psi_{${s1}} + ${b === 1 ? '' : b}\psi_{${s2}}}{\sqrt{${a * a + b * b}}}$ (real, positive radial functions near the origin). Given $|\langle${s1}|z|${s2}\rangle| = ${pair === '1s-2p' ? R`\tfrac{128\sqrt2}{243}a_0` : '3a_0'}$, the magnitude of $\langle z\rangle$ is ______ $a_0$ (three decimal places).`,
          answer: round(z, 3), tol: 0.003, pair, a, b,
          sol: R`Diagonal terms vanish by parity ($|\psi_{nlm}|^2$ is even). Only the cross term survives: $|\langle z\rangle| = \dfrac{2\times${a}\times${b}}{${a * a + b * b}}\times${round(ZME[pair], 4)}\,a_0 = ${round(z, 3)}a_0$.`,
          trap: 'Remember the factor 2 from the two cross terms and divide by the norm.' };
      },
      verify: (p) => 2 * p.a * p.b / (p.a * p.a + p.b * p.b) * ZME[p.pair] },
    { id: 'qhy-r4g2', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'hydrogen-like ions',
      make(r) {
        const [ion, Z, M] = choose(r, IONS);
        const nl = int(r, 1, 3), nu = nl + int(r, 1, 3);
        const mu = M / (M + ME_U);
        const lam = 1 / (RINF * mu * Z * Z * (1 / nl ** 2 - 1 / nu ** 2)) * 1e9;
        return { q: R`For the hydrogen-like ion ${ion} ($Z = ${Z}$, nuclear mass $${M}$ u, electron mass $5.486\times10^{-4}$ u), the wavelength of the $${nu}\to${nl}$ line is ______ nm (four significant figures). Take $R_\infty = 1.09737\times10^7$ m$^{-1}$.`,
          answer: +lam.toPrecision(4), tol: +(lam * 0.0005).toPrecision(2), unit: 'nm', Z, M, nl, nu,
          sol: R`$R_M = R_\infty\dfrac{M}{M + m_e} = R_\infty\times${round(mu, 6)}$. $\dfrac1\lambda = R_MZ^2\left(\dfrac{1}{${nl * nl}} - \dfrac{1}{${nu * nu}}\right) = ${fmt(1 / lam * 1e9, 5)}$ m$^{-1}$, so $\lambda = ${+lam.toPrecision(4)}$ nm.`,
          trap: 'Wavelengths scale as 1/Z^2; the reduced-mass factor is a small correction of order m_e/M.' };
      },
      verify: (p) => 1 / (RINF * (p.M / (p.M + ME_U)) * p.Z * p.Z * (1 / p.nl ** 2 - 1 / p.nu ** 2)) * 1e9 },
    { id: 'qhy-r4g3', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Rydberg atoms',
      make(r) {
        const n = int(r, 40, 160), dn = choose(r, [1, 1, 2]);
        const f = RHC * (1 / n ** 2 - 1 / (n + dn) ** 2) / 1e9;
        return { q: R`Radio telescopes detect hydrogen recombination lines between very high levels. With $R_Hc = 3.28805\times10^{15}$ Hz, the frequency of the $n = ${n + dn}\to${n}$ line (called H${n}${dn === 1 ? R`$\alpha$` : R`$\beta$`}) is ______ GHz (three significant figures).`,
          answer: +f.toPrecision(3), tol: +(f * 0.005).toPrecision(2), unit: 'GHz', n, dn,
          sol: R`$\nu = R_Hc\left(\dfrac{1}{${n}^2} - \dfrac{1}{${n + dn}^2}\right) = 3.28805\times10^{15}\times${fmt(1 / n ** 2 - 1 / (n + dn) ** 2, 4)} = ${+f.toPrecision(3)}$ GHz. For large $n$ this is close to $2${dn === 1 ? '' : R`\times${dn}`}R_Hc/n^3$: the lines crowd together as $n^{-3}$.`,
          trap: 'Both terms are tiny and nearly equal; subtract carefully or use the 2 dn R_H c / n^3 approximation.' };
      },
      verify: (p) => RHC * (1 / p.n ** 2 - 1 / (p.n + p.dn) ** 2) / 1e9 },
  ],
};
