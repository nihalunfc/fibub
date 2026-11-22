// Round 5 extras for electronic-spectra: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;

const ME = 9.1093837015e-31, H = 6.62607015e-34, CL = 2.99792458e8;
/** Free-electron (particle in a box) absorption wavelength in nm for N pi electrons in a box of length L nm. */
const boxNm = (N, L) => 8 * ME * CL * (L * 1e-9) ** 2 / (H * (N + 1)) * 1e9;

export default {
  items: [
    { id: 'els-r5-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'units',
      q: R`An electronic absorption band is at $20\,000$ cm$^{-1}$. In wavelength and photon energy this is`,
      options: [R`$200$ nm and $6.2$ eV`, R`$500$ nm and $2.48$ eV`, R`$5\ \mu$m and $0.248$ eV`, R`$500$ nm and $4.96$ eV`], answer: 1,
      sol: R`$\lambda = 1/\tilde\nu = 1/20\,000$ cm $= 5\times10^{-5}$ cm $= 500$ nm. $E = hc\tilde\nu$; using $1$ eV $\leftrightarrow8065.5$ cm$^{-1}$: $20\,000/8065.5 = 2.48$ eV. Green light, typical of an electronic transition in a dye.`,
      trap: R`$1$ eV is about $8066$ cm$^{-1}$; dividing by $4033$ (half) gives the wrong energy.` },
    { id: 'els-r5-02', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Beer-Lambert law', unit: '%',
      q: R`A dye with molar absorption coefficient $\varepsilon = 2.0\times10^4$ L mol$^{-1}$ cm$^{-1}$ at its peak is dissolved at $2.5\times10^{-5}$ mol/L in a $1.0$ cm cell. The percentage of light transmitted at the peak is ______ % (one decimal place).`,
      answer: 31.6, tol: 0.2, calc: () => 100 * 10 ** -(2e4 * 2.5e-5 * 1),
      sol: R`Absorbance $A = \varepsilon cl = 2.0\times10^4\times2.5\times10^{-5}\times1.0 = 0.50$. Transmittance $T = 10^{-A} = 10^{-0.5} = 0.316$, so 31.6% gets through.`,
      trap: R`The Beer-Lambert law with $\varepsilon$ uses base 10: $e^{-0.5} = 60.7\%$ is wrong here.` },
    { id: 'els-r5-03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'predissociation', unit: 'ps',
      q: R`Rotational lines in one vibrational band of an electronic spectrum are broadened by predissociation to a width (FWHM) of $0.50$ cm$^{-1}$, much more than the instrument width. The lifetime of the upper level is ______ ps (one decimal place).`,
      answer: 10.6, tol: 0.1, calc: () => 1 / (2 * Math.PI * 2.998e10 * 0.5) * 1e12,
      sol: R`A level decaying with lifetime $\tau$ gives a Lorentzian of width $\Delta\nu = 1/(2\pi\tau)$. In wavenumbers $\Delta\tilde\nu = 1/(2\pi c\tau)$, so $\tau = \dfrac{1}{2\pi\times2.998\times10^{10}\ \text{cm/s}\times0.50\ \text{cm}^{-1}} = 1.06\times10^{-11}$ s $= 10.6$ ps. The molecule falls apart through a crossing repulsive curve within a few hundred vibrations.`,
      trap: R`Leaving out the $2\pi$ gives 66.7 ps.` },
    { id: 'els-r5-04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'spin-orbit in molecules',
      q: R`The NO ground state is split into $X\,^2\Pi_{1/2}$ (lower) and $^2\Pi_{3/2}$, $123$ cm$^{-1}$ higher; both components have the same degeneracy. At $300$ K ($kT/hc = 208.5$ cm$^{-1}$) the ratio of molecules in $^2\Pi_{3/2}$ to those in $^2\Pi_{1/2}$ is ______ (two decimal places).`,
      answer: 0.55, tol: 0.01, calc: () => Math.exp(-123 / 208.5),
      sol: R`Equal degeneracies, so $N_{3/2}/N_{1/2} = e^{-123/208.5} = e^{-0.590} = 0.55$. Because both components are well populated at room temperature, NO spectra show two overlapping sub-bands. At 77 K the ratio drops to about 0.10.`,
      trap: R`Adding extra degeneracy factors (2 and 4 as for atomic $j$ levels) does not apply: each $\Omega$ component of a $^2\Pi$ state has 2 states (before rotation).` },
    { id: 'els-r5-05', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'Jablonski diagram',
      q: R`Naphthalene dissolved in a solvent containing iodine atoms (for example ethyl iodide) shows much stronger phosphorescence and weaker fluorescence than in hexane. The reason is that`,
      options: [R`the heavy atoms increase spin-orbit coupling, speeding up the singlet-triplet crossings`, R`iodine absorbs the fluorescence`,
        R`the solvent raises the triplet above the singlet`, R`iodine makes naphthalene's absorption stronger`], answer: 0,
      sol: R`Fluorescence is $S_1\to S_0$; phosphorescence needs intersystem crossing $S_1\to T_1$ and then the spin-forbidden $T_1\to S_0$. Both spin flips need spin-orbit coupling, which grows steeply with nuclear charge ($\sim Z^4$). Nearby iodine atoms mix singlet and triplet character, so more molecules cross to $T_1$ (less fluorescence) and $T_1$ emits faster (more phosphorescence): the external heavy-atom effect.`,
      trap: R`The energy order of $S_1$ and $T_1$ does not change; only the coupling between them does.` },
    { id: 'els-r5-06', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'oscillator strength',
      q: R`An absorption band has peak $\varepsilon_\text{max} = 2.0\times10^4$ L mol$^{-1}$ cm$^{-1}$ and a Gaussian shape of full width $4000$ cm$^{-1}$, so $\int\varepsilon\,d\tilde\nu = 1.0645\,\varepsilon_\text{max}\Delta\tilde\nu$. With $f = 4.32\times10^{-9}\int\varepsilon\,d\tilde\nu$ (in those units), the oscillator strength is ______ (two decimal places).`,
      answer: 0.37, tol: 0.01, calc: () => 4.32e-9 * 1.0645 * 2e4 * 4000,
      sol: R`Area $= 1.0645\times2.0\times10^4\times4000 = 8.52\times10^7$ L mol$^{-1}$ cm$^{-2}$. $f = 4.32\times10^{-9}\times8.52\times10^7 = 0.37$. A strongly allowed $\pi\to\pi^*$ band has $f$ of order 0.1 to 1; spin-forbidden bands have $f\sim10^{-5}$ or less.`,
      trap: R`Using only $\varepsilon_\text{max}$ without the width gives a meaningless $10^{-4}$.` },
    { id: 'els-r5-07', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'free-electron model', unit: 'nm',
      q: R`In the free-electron model, the 6 $\pi$ electrons of hexatriene fill the lowest three levels of a one-dimensional box of length $L = 0.73$ nm. The first absorption ($n = 3\to4$) is at $\lambda = \dfrac{8mcL^2}{h(N + 1)}$ with $N = 6$. This gives $\lambda = $ ______ nm (to the nearest nm).`,
      answer: 251, tol: 2, calc: () => boxNm(6, 0.73),
      sol: R`$E_n = n^2h^2/(8mL^2)$; the gap from $n = N/2$ to $N/2 + 1$ is $(N + 1)h^2/(8mL^2)$, so $\lambda = 8mcL^2/(h(N + 1))$. Numbers: $8\times9.109\times10^{-31}\times2.998\times10^8\times(0.73\times10^{-9})^2 = 1.164\times10^{-39}$; divided by $6.626\times10^{-34}\times7 = 4.638\times10^{-33}$: $\lambda = 2.51\times10^{-7}$ m $= 251$ nm (measured: about 258 nm). Longer chains absorb at longer wavelengths, which is why carotene is coloured.`,
      trap: R`The jump is from $n = 3$ to $n = 4$ (factor $N + 1 = 7$), not from $n = 1$ to $n = 2$.` },
    { id: 'els-r5-08', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'rotational structure',
      q: R`In a $^1\Pi\leftarrow{}^1\Sigma^+$ absorption band of a diatomic molecule (P, Q and R branches), which of these lines is missing?`,
      options: [R`$R(0)$`, R`$Q(1)$`, R`$P(1)$`, R`$P(2)$`], answer: 2,
      sol: R`In a $^1\Pi$ state $J\ge\Lambda = 1$, so $J' = 0$ does not exist. $P(1)$ would go from $J'' = 1$ to $J' = 0$: missing. $R(0)$ ends on $J' = 1$, $Q(1)$ on $J' = 1$, $P(2)$ on $J' = 1$: all present. Missing first lines like this let spectroscopists find $\Lambda$ of the upper state.`,
      trap: R`$Q(0)$ is also missing, but it is not offered; $R(0)$ ends on $J' = 1$, which exists.` },
    { id: 'els-r5-09', type: 'msq', level: 4, exams: ['jam', 'gate', 'net'], sub: 'time scales', format: 'statements',
      q: R`For a typical organic molecule in solution, which statements about the time scales of photophysical steps are correct?`,
      options: [R`Vibrational relaxation and internal conversion from higher singlets to $S_1$ take picoseconds or less`,
        R`Fluorescence lifetimes are typically nanoseconds`, R`Phosphorescence can last milliseconds to seconds`,
        R`Absorption of the photon itself takes about a nanosecond`], answer: [0, 1, 2],
      sol: R`Absorption is essentially instantaneous (femtoseconds: one optical cycle is about 2 fs), which is the basis of the Franck-Condon principle. Relaxation to the bottom of $S_1$ is fast (sub-ps to ps), so emission comes from $S_1$ (Kasha's rule). Allowed $S_1\to S_0$ emission takes ns; spin-forbidden $T_1\to S_0$ phosphorescence takes ms to s.`,
      trap: R`The ns time scale belongs to emission, not to absorption.` },
    { id: 'els-r5-10', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'oscillator strength', unit: 'ns',
      q: R`A rough rule relates the natural radiative lifetime of an electronic transition to its oscillator strength: $\tau_0\approx\dfrac{1.5}{\tilde\nu^2f}$ s, with $\tilde\nu$ in cm$^{-1}$. For a band at $40\,000$ cm$^{-1}$ with $f = 0.37$, $\tau_0$ is ______ ns (two decimal places).`,
      answer: 2.53, tol: 0.03, calc: () => 1.5 / (4e4 ** 2 * 0.37) * 1e9,
      sol: R`$\tilde\nu^2 = 1.6\times10^9$ cm$^{-2}$. $\tau_0 = 1.5/(1.6\times10^9\times0.37) = 2.53\times10^{-9}$ s $= 2.53$ ns. Strong, short-wavelength transitions emit fast: $\tau_0\propto1/(\tilde\nu^2f)$.`,
      trap: R`Forgetting to square $\tilde\nu$ gives an absurd lifetime of about 0.1 ms.` },
  ],
  gens: [
    { id: 'els-r5g1', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Beer-Lambert law',
      make(r) {
        const e = choose(r, [500, 2000, 8000, 1.5e4, 3e4, 1e5]), l = choose(r, [0.1, 0.5, 1, 2, 5]);
        const A0 = pick(r, 0.05, 1.5, 0.05), c = A0 / (e * l);
        const cs = +c.toPrecision(2), A = e * cs * l, T = 100 * 10 ** -A, v = round(T, 1);
        return { q: R`A solution of concentration $${+(cs / 10 ** Math.floor(Math.log10(cs))).toFixed(1)}\times10^{${Math.floor(Math.log10(cs))}}$ mol/L has molar absorption coefficient $${e}$ L mol$^{-1}$ cm$^{-1}$ and fills a ${l} cm cell. The percentage of light transmitted is ______ % (one decimal place).`,
          answer: v, tol: Math.max(0.1, round(T * 0.01, 2)), unit: '%', A,
          sol: R`$A = \varepsilon cl = ${e}\times${cs}\times${l} = ${round(A, 4)}$. $T = 10^{-A} = ${round(T / 100, 4)}$, so ${v}% is transmitted.`,
          trap: 'Absorbance is a base-10 logarithm.' };
      },
      verify: (p) => 100 * 10 ** -p.A },
    { id: 'els-r5g2', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'predissociation',
      make(r) {
        const w = choose(r, [0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5]);
        const t = 1 / (2 * Math.PI * 2.99792458e10 * w) * 1e12, v = +t.toPrecision(3);
        return { q: R`Lines of a predissociated band have a natural (Lorentzian) width of $${w}$ cm$^{-1}$. The lifetime of the upper level is ______ ps (three significant figures).`,
          answer: v, tol: +(v * 0.01).toPrecision(2), unit: 'ps', w,
          sol: R`$\tau = \dfrac{1}{2\pi c\Delta\tilde\nu} = \dfrac{1}{2\pi\times2.998\times10^{10}\times${w}}$ s $= ${v}$ ps.`,
          trap: 'Use c in cm/s with a width in cm^-1, and keep the 2 pi.' };
      },
      verify: (p) => 1 / (2 * Math.PI * 2.99792458e10 * p.w) * 1e12 },
    { id: 'els-r5g3', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'free-electron model',
      make(r) {
        const k = int(r, 2, 6), N = 2 * k, d = choose(r, [0.13, 0.135, 0.14, 0.145]), L = round((N - 1) * d + 2 * d, 3);
        const lam = boxNm(N, L), v = Math.round(lam);
        return { q: R`A conjugated chain holds $${N}$ $\pi$ electrons. Model them as free electrons in a one-dimensional box of length $L = ${L}$ nm (filled two per level). The longest-wavelength absorption, from the highest filled to the lowest empty level, is at ______ nm (to the nearest nm).`,
          answer: v, tol: Math.max(1, Math.round(lam * 0.01)), unit: 'nm', N, L,
          sol: R`Highest filled level $n = ${k}$, lowest empty $n = ${k + 1}$: $\Delta E = (2n + 1)\dfrac{h^2}{8mL^2} = ${N + 1}\dfrac{h^2}{8mL^2}$. $\lambda = \dfrac{8mcL^2}{${N + 1}h} = ${v}$ nm.`,
          trap: 'The gap uses (N + 1), where N is the number of pi electrons.' };
      },
      verify: (p) => boxNm(p.N, p.L) },
  ],
};
