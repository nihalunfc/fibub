// Round 5 extras for zeeman-stark: original questions, written 2026-11-22.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;

const MUB_H = 13.996245; // mu_B/h in GHz/T
const EA0 = 5.29177210903e-11; // e a0 in eV per (V/m)
const hf = (x) => (Number.isInteger(x) ? String(x) : `${Math.round(2 * x)}/2`);
const lande = (S, L, J) => 1 + (J * (J + 1) + S * S + S - L * (L + 1)) / (2 * J * (J + 1));
const LL = 'SPDF';
/** [S, L, J] levels used in templates. */
const LEVELS = [[0.5, 0, 0.5], [0.5, 1, 0.5], [0.5, 1, 1.5], [0.5, 2, 1.5], [0.5, 2, 2.5], [1, 0, 1], [1, 1, 1], [1, 1, 2], [0, 1, 1], [0, 2, 2], [1, 2, 1], [1, 2, 2], [1, 2, 3]];
const sym = ([S, L, J]) => `^${2 * S + 1}${LL[L]}_{${hf(J)}}`;
const PAIRS = LEVELS.flatMap((u) => LEVELS.filter((l) => u[0] === l[0] && Math.abs(u[1] - l[1]) === 1 && Math.abs(u[2] - l[2]) <= 1).map((l) => [u, l]));
/** Spread (max - min) of weak-field line shifts, in units of mu_B B. */
function spread(u, l) {
  const gu = lande(...u), gl = lande(...l); const xs = [];
  for (let Mu = -u[2]; Mu <= u[2] + 1e-9; Mu++) for (const d of [-1, 0, 1]) {
    const Ml = Mu + d; if (Math.abs(Ml) > l[2] + 1e-9) continue;
    if (d === 0 && Mu === 0 && u[2] === l[2]) continue;
    xs.push(gu * Mu - gl * Ml);
  }
  return Math.max(...xs) - Math.min(...xs);
}

export default {
  items: [
    { id: 'zst-r5-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'Bohr magneton',
      q: R`The Bohr magneton $\mu_B = e\hbar/2m_e$, expressed in eV per tesla, is closest to`,
      options: [R`$3.15\times10^{-8}$ eV/T`, R`$9.27\times10^{-24}$ eV/T`, R`$1.76\times10^{11}$ eV/T`, R`$5.79\times10^{-5}$ eV/T`], answer: 3,
      sol: R`$\mu_B = 9.274\times10^{-24}$ J/T. Dividing by $e = 1.602\times10^{-19}$ J/eV gives $5.79\times10^{-5}$ eV/T. So even a 1 T field shifts atomic levels by only about $60\ \mu$eV, tiny next to eV-sized level spacings. $3.15\times10^{-8}$ eV/T is the nuclear magneton.`,
      trap: R`$9.27\times10^{-24}$ is the value in J/T; changing units changes the number.` },
    { id: 'zst-r5-02', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Landé g factor',
      q: R`The Landé factor $g_J$ of a $^3D_2$ level (take $g_s = 2$) is ______ (two decimal places).`,
      answer: 1.17, tol: 0.01, calc: () => 1 + (6 + 2 - 6) / 12,
      sol: R`$S = 1$, $L = 2$, $J = 2$: $g_J = 1 + \dfrac{J(J + 1) + S(S + 1) - L(L + 1)}{2J(J + 1)} = 1 + \dfrac{6 + 2 - 6}{12} = \dfrac76 = 1.17$.`,
      trap: R`Swapping the signs of the $S$ and $L$ terms gives $0.83$.` },
    { id: 'zst-r5-03', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Landé g factor',
      q: R`The Landé factor of a $^2F_{7/2}$ level (with $g_s = 2$) is`,
      options: [R`$\dfrac87$`, R`$\dfrac67$`, R`$\dfrac43$`, R`$\dfrac{10}{7}$`], answer: 0,
      sol: R`$J(J + 1) = \tfrac{63}{4}$, $S(S + 1) = \tfrac34$, $L(L + 1) = 12$. $g_J = 1 + \dfrac{63/4 + 3/4 - 12}{2\cdot63/4} = 1 + \dfrac{4.5}{31.5} = 1 + \dfrac17 = \dfrac87$. For a single electron with $j = l + \tfrac12$ this is the general $1 + \tfrac{1}{2l + 1}$.`,
      trap: R`$\tfrac67$ is the value for $^2F_{5/2}$ ($j = l - \tfrac12$).` },
    { id: 'zst-r5-04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'hyperfine Zeeman', unit: 'MHz',
      q: R`The $F = 1$ hyperfine level of ground-state hydrogen has $g_F = 1$. In the Earth's field of $50\ \mu$T, the frequency separation between its $M_F = +1$ and $M_F = -1$ sublevels is ______ MHz (two decimal places; $\mu_B/h = 13.996$ GHz/T).`,
      answer: 1.4, tol: 0.01, calc: () => 2 * 13.996e3 * 50e-6,
      sol: R`Weak-field shifts are $g_FM_F\mu_BB$. From $M_F = -1$ to $+1$ is $2g_F\mu_BB$: $\nu = 2\times1\times13.996\ \text{GHz/T}\times50\times10^{-6}\ \text{T} = 1.40$ MHz. (Check $g_F$: $g_F = g_J\dfrac{F(F + 1) + J(J + 1) - I(I + 1)}{2F(F + 1)} = 2\times\dfrac{2}{4} = 1$, ignoring the tiny nuclear term.) This splitting is why 21-cm masers and hydrogen clocks need magnetic shielding.`,
      trap: R`Using $g_J = 2$ instead of $g_F = 1$ doubles the answer; the electron spin shares the angular momentum with the proton.` },
    { id: 'zst-r5-05', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'anomalous Zeeman pattern',
      q: R`The intercombination line $^3P_1\to{}^1S_0$ (for example the 253.7 nm mercury line) is observed in a weak magnetic field. Its Zeeman pattern is`,
      options: [R`a normal triplet with spacing $\mu_BB$`, R`six lines, because $^3P_1$ has an anomalous $g$ factor`,
        R`three lines with spacing $\tfrac32\mu_BB$`, R`a single unshifted line, because $^1S_0$ cannot split`], answer: 2,
      sol: R`The lower level has $J = 0$ (one sublevel, no shift), so each line shift is just that of the upper sublevel: $g(^3P_1)M_J\mu_BB$ with $M_J = -1, 0, 1$ and $g(^3P_1) = 1 + \tfrac{2 + 2 - 2}{4} = \tfrac32$. Three lines, but $1.5$ times wider than the normal triplet. A line can show an "anomalous" splitting while still looking like a triplet.`,
      trap: R`Three lines do not prove the normal Zeeman effect; check the spacing.` },
    { id: 'zst-r5-06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Zeeman shifts', unit: 'cm⁻¹',
      q: R`A $^2D_{5/2}$ level is placed in a weak field of $2.5$ T. The shift of its $M_J = +\tfrac52$ sublevel is ______ cm$^{-1}$ (two decimal places; $\mu_B/hc = 0.4669$ cm$^{-1}$/T).`,
      answer: 3.5, tol: 0.02, calc: () => 1.2 * 2.5 * 0.4669 * 2.5,
      sol: R`$g_J = 1 + \dfrac{35/4 + 3/4 - 6}{35/2} = 1 + \dfrac{3.5}{17.5} = \dfrac65$. Shift $= g_JM_J\mu_BB = \tfrac65\times\tfrac52\times0.4669\times2.5 = 3\times1.167 = 3.50$ cm$^{-1}$.`,
      trap: R`Leaving out $g_J$ (using $M_J\mu_BB$) gives $2.92$ cm$^{-1}$.` },
    { id: 'zst-r5-07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'linear Stark effect',
      q: R`In a uniform field $E$, the linear Stark shifts of hydrogen are $\Delta E = \tfrac32n(n_1 - n_2)\,ea_0E$ in parabolic quantum numbers. For the $n = 4$ level the largest upward shift is $k\,ea_0E$ with $k = $ ______.`,
      answer: 18, tol: 0, calc: () => 1.5 * 4 * 3,
      sol: R`$n_1 + n_2 + |m| + 1 = n$, so $n_1 - n_2$ is largest ($= n - 1 = 3$) when $n_1 = 3$, $n_2 = 0$, $m = 0$. Then $\Delta E = \tfrac32\times4\times3\,ea_0E = 18\,ea_0E$. The $n = 4$ level fans out into 7 equally spaced energies from $-18$ to $+18$ in steps of 6.`,
      trap: R`$n_1 - n_2$ can reach $n - 1$, not $n$.` },
    { id: 'zst-r5-08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'linear Stark effect', unit: 'kV/m',
      q: R`In hydrogen, $2s_{1/2}$ lies $1058$ MHz above $2p_{1/2}$ (Lamb shift). The linear Stark shift of the $n = 2$ level is $3ea_0E$. The field at which this shift equals the Lamb-shift energy is ______ kV/m (one decimal place; $h = 4.1357\times10^{-15}$ eV s, $a_0 = 5.292\times10^{-11}$ m).`,
      answer: 27.6, tol: 0.2, calc: () => 4.1357e-15 * 1058e6 / (3 * 5.292e-11) / 1e3,
      sol: R`Lamb energy $= h\nu = 4.1357\times10^{-15}\times1.058\times10^9 = 4.375\times10^{-6}$ eV. Setting $3ea_0E = 4.375\times10^{-6}$ eV: $E = \dfrac{4.375\times10^{-6}\ \text{V}}{3\times5.292\times10^{-11}\ \text{m}} = 2.76\times10^4$ V/m $= 27.6$ kV/m. Far below this field the $2s$-$2p$ mixing is weak and the shift is quadratic; far above it the shift is linear.`,
      trap: R`Forgetting the factor 3 gives 82.7 kV/m.` },
    { id: 'zst-r5-09', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'linear vs quadratic Stark', format: 'statements',
      q: R`Which statements about the Stark effect are correct?`,
      options: [R`The sodium $3s$ ground state shows only a quadratic shift in ordinary laboratory fields`,
        R`For hydrogen $n = 2$, the shift is quadratic in fields much weaker than the one that matches the Lamb shift and linear in much stronger fields`,
        R`A linear shift needs degenerate (or nearly degenerate) states of opposite parity that the field can mix`,
        R`An atom in a stationary state of definite parity can have a permanent electric dipole moment`], answer: [0, 1, 2],
      sol: R`First-order shift $= -\langle\psi|\vec d|\psi\rangle\cdot\vec E$, which vanishes for any state of definite parity (the dipole operator is odd). A linear effect appears only when the field mixes degenerate opposite-parity states (hydrogen's $2s$ and $2p$), giving an effective dipole. In sodium the $3s$-$3p$ gap is 2.1 eV, so the shift is second order. In hydrogen $n = 2$ the Lamb shift removes the exact degeneracy, so the shift is quadratic until $3ea_0E$ exceeds the Lamb energy.`,
      trap: R`"Hydrogen shows a linear Stark effect" needs the qualifier: only once the field beats the Lamb shift (and never for $1s$).` },
    { id: 'zst-r5-10', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'anomalous Zeeman pattern', format: 'not',
      q: R`Which statement about Zeeman patterns in a weak field is NOT correct?`,
      options: [R`Viewed along the field, only the $\sigma$ ($\Delta M_J = \pm1$) components are seen, circularly polarised`,
        R`The $\pi$ components always form the same pattern of spacings, whatever the $g$ factors of the two levels`,
        R`For a line with $\Delta J = 0$, the $\pi$ component $M_J = 0\to M_J = 0$ is missing`,
        R`The shift of a sublevel is $g_JM_J\mu_BB$`], answer: 1,
      sol: R`A $\pi$ line ($\Delta M_J = 0$) is shifted by $(g_u - g_l)M_J\mu_BB$, so its spacing depends on the DIFFERENCE of the two $g$ factors: zero spread when $g_u = g_l$, wide when they differ. The other three are standard: along the field only $\sigma$ light (circular), the $0\to0$ component vanishes when $\Delta J = 0$ (its Clebsch-Gordan coefficient is zero), and the weak-field shift is $g_JM_J\mu_BB$.`,
      trap: R`Only in the normal Zeeman effect ($g_u = g_l = 1$) do all $\pi$ components sit on top of each other.` },
  ],
  gens: [
    { id: 'zst-r5g1', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Zeeman shifts',
      make(r) {
        const lv = choose(r, LEVELS), g = lande(...lv), J = lv[2];
        const Ms = []; for (let M = -J; M <= J + 1e-9; M++) if (Math.abs(M) > 1e-9) Ms.push(M);
        const M = choose(r, Ms), B = pick(r, 5, 500, 5);
        const ans = g * M * MUB_H * B; // MHz (GHz/T * mT)
        const v = round(ans, 1);
        return { q: R`A $${sym(lv)}$ level (take $g_s = 2$) sits in a weak field of ${B} mT. The frequency shift of its $M_J = ${M < 0 ? '-' : ''}${hf(Math.abs(M))}$ sublevel is ______ MHz (one decimal place, with sign; $\mu_B/h = 13.996$ GHz/T).`,
          answer: v, tol: Math.max(0.1, round(Math.abs(ans) * 0.005, 2)), unit: 'MHz', g, M, B,
          sol: R`$g_J = ${round(g, 4)}$ from the Landé formula. $\Delta\nu = g_JM_J(\mu_B/h)B = ${round(g, 4)}\times(${M})\times13.996\ \text{GHz/T}\times${B}\times10^{-3}\ \text{T} = ${v}$ MHz.`,
          trap: 'Keep the sign of M_J, and convert mT to T.' };
      },
      verify: (p) => p.g * p.M * MUB_H * p.B },
    { id: 'zst-r5g2', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'linear Stark effect',
      make(r) {
        const n = int(r, 2, 6), d = pick(r, 10, 500, 10); // shift in micro-eV
        const kmax = 1.5 * n * (n - 1);
        const E = d * 1e-6 / (kmax * EA0) / 1e3; // kV/m
        const v = +E.toPrecision(3);
        return { q: R`Hydrogen atoms in the $n = ${n}$ level are put in a uniform electric field. Using the linear Stark formula $\Delta E = \tfrac32n(n_1 - n_2)\,ea_0E$, the field at which the most strongly shifted component moves by ${d} $\mu$eV is ______ kV/m (three significant figures; $a_0 = 5.292\times10^{-11}$ m).`,
          answer: v, tol: +(v * 0.01).toPrecision(2), unit: 'kV/m', n, d,
          sol: R`The largest $|n_1 - n_2|$ is $n - 1 = ${n - 1}$, so the largest shift is $\tfrac32\times${n}\times${n - 1}\,ea_0E = ${kmax}\,ea_0E$. Then $E = \dfrac{${d}\times10^{-6}\ \text{V}}{${kmax}\times5.292\times10^{-11}\ \text{m}} = ${v}$ kV/m.`,
          trap: 'Higher n levels respond far more strongly: the largest coefficient grows as n(n - 1).' };
      },
      verify: (p) => p.d * 1e-6 / (1.5 * p.n * (p.n - 1) * EA0) / 1e3 },
    { id: 'zst-r5g3', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'anomalous Zeeman pattern',
      make(r) {
        const [u, l] = choose(r, PAIRS);
        const s = spread(u, l), gu = lande(...u), gl = lande(...l);
        const show = (x) => `$${round(x, 3)}\\,\\mu_BB$`;
        const o = mcqOptions(r, s, [2 * Math.max(gu, gl), 2, gu + gl, 2 * Math.abs(gu - gl) + 2, s / 2], show);
        return { q: R`The line $${sym(u)}\to{}${sym(l)}$ is observed in a weak magnetic field $B$. The energy separation between its two outermost Zeeman components is`, ...o,
          sol: R`$g(${sym(u)}) = ${round(gu, 4)}$, $g(${sym(l)}) = ${round(gl, 4)}$. Each component is shifted by $(g_uM_u - g_lM_l)\mu_BB$ with $M_l = M_u$ or $M_u\pm1$. Running over all allowed pairs, the largest and smallest shifts are $\pm${round(s / 2, 3)}\,\mu_BB$, so the outermost components are $${round(s, 3)}\,\mu_BB$ apart.`,
          trap: 'The outermost lines are sigma components from the largest |M| sublevels; both g factors enter.' };
      } },
  ],
};
