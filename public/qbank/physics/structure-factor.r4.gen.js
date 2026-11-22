// Round 4 extras for structure-factor: original questions, written 2026-11-22.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'], JG = ['jam', 'gate', 'net'];

export default {
  items: [
    { id: 'sf-r4-01', type: 'mcq', level: 1, exams: JG, sub: 'structure factor',
      q: R`Sodium chloride has the rock-salt structure (4 Na$^+$ and 4 Cl$^-$ ions in the conventional cube). Na$^+$ has $10$ electrons and Cl$^-$ has $18$. The X-ray structure factor $F_{000}$ of the conventional cell is`,
      options: [R`$28$`, R`$56$`, R`$112$`, R`$224$`], answer: 2,
      sol: R`At $hkl = 000$ every phase factor is $1$ and each form factor equals its number of electrons, so $F_{000} = \sum_jf_j(0) = 4\times10 + 4\times18 = 112$: the number of electrons in the cell.`,
      trap: R`$28$ is one formula unit; the conventional cube holds four.` },
    { id: 'sf-r4-02', type: 'mcq', level: 2, exams: G, sub: 'form factor',
      q: R`The same reflection $(hkl)$ of a crystal is measured first with Cu K$\alpha$ ($1.54$ Å) and then with Mo K$\alpha$ ($0.71$ Å) X-rays. Ignoring absorption edges, the atomic form factors that enter $F_{hkl}$ are`,
      options: [R`larger with Mo, because $\theta$ is smaller`, R`smaller with Mo, because the wavelength is shorter`, R`the same, because $\sin\theta/\lambda = 1/2d_{hkl}$ is fixed by the reflection`, R`the same only if the crystal is cubic`], answer: 2,
      sol: R`$f$ depends on the scattering vector $q = 4\pi\sin\theta/\lambda$. Bragg's law gives $\sin\theta/\lambda = 1/2d_{hkl}$ for every wavelength, so a given reflection always has the same $q$. With Mo the reflection appears at a smaller angle, but $f$, and so $|F_{hkl}|$, is unchanged.`,
      trap: R`$f$ depends on $\sin\theta/\lambda$, not on $\theta$ alone.` },
    { id: 'sf-r4-03', type: 'nat', level: 3, exams: G, sub: '1D basis',
      q: R`A 1D crystal of period $a$ has atom A ($f_A = 20$) at $x = 0$ and atoms B ($f_B = 8$) at $x = a/3$ and $x = 2a/3$. Taking the form factors constant, the intensity ratio $I_1/I_3$ of the first- and third-order reflections is ______ (to three decimal places).`,
      answer: 0.111, tol: 0.002, calc: () => (20 - 8) ** 2 / (20 + 16) ** 2,
      sol: R`$F_h = f_A + f_B(e^{2\pi ih/3} + e^{4\pi ih/3})$. For $h = 3$ both phases are $1$: $F_3 = 20 + 16 = 36$. For $h = 1$, $e^{2\pi i/3} + e^{4\pi i/3} = 2\cos120^\circ = -1$, so $F_1 = 20 - 8 = 12$. $I_1/I_3 = 144/1296 = 0.111$.`,
      trap: R`The two B phases do not cancel completely: their sum is $-1$, not $0$.` },
    { id: 'sf-r4-04', type: 'mcq', level: 4, exams: G, sub: 'phase problem',
      q: R`The Patterson function $P(u, v, w) = \dfrac1V\sum_{hkl}|F_{hkl}|^2\cos[2\pi(hu + kv + lw)]$ (summed over measured reflections) can be computed without knowing any phases. Its peaks lie at`,
      options: [R`the positions of the atoms in the cell`, R`the vectors joining pairs of atoms, with heights roughly proportional to $Z_iZ_j$`, R`the reciprocal-lattice points $\vec G_{hkl}$`, R`the midpoints of the bonds`], answer: 1,
      sol: R`$|F|^2 = FF^*$ is the Fourier transform of the autocorrelation of the electron density, $\int\rho(\vec r)\rho(\vec r + \vec u)\,d^3r$. This is large when both $\vec r$ and $\vec r + \vec u$ sit on atoms, so peaks appear at every interatomic vector, weighted by the product of the two atoms' electron counts. Heavy-atom vectors stand out, which is how a heavy atom's position is found first.`,
      trap: R`The Patterson map shows where atoms are relative to each other, not where they are in the cell.` },
    { id: 'sf-r4-05', type: 'msq', level: 4, exams: G, sub: 'phase problem', format: 'statements',
      q: R`Diffraction measures $|F_{hkl}|$ but not the phases. Which of these are real ways that crystallographers recover the missing phase information?`,
      options: [R`Locating a few heavy atoms from the Patterson map and using their contribution as reference phases.`, R`Comparing a crystal with a version soaked with heavy atoms but otherwise identical (isomorphous replacement).`, R`Using anomalous scattering near an absorption edge, where Friedel pairs $hkl$ and $\bar h\bar k\bar l$ differ.`, R`Measuring each reflection with a brighter source, since the phase appears once the intensity is high enough.`], answer: [0, 1, 2],
      sol: R`Heavy atoms dominate the Patterson map and their known contribution gives approximate phases. Isomorphous replacement uses the change in $|F|$ when a heavy atom is added to compare amplitudes and pin down phases. Anomalous scattering makes $f$ complex, so $|F_{hkl}|\ne|F_{\bar h\bar k\bar l}|$, and the difference carries phase information. Intensity is $|F|^2$ whatever the source brightness: more counts reduce noise but never reveal the phase.`,
      trap: R`The phase is lost in squaring the amplitude; better statistics cannot bring it back.` },
    { id: 'sf-r4-06', type: 'nat', level: 4, exams: G, sub: 'form factor',
      q: R`As a model, $10$ electrons are spread uniformly over a thin spherical shell of radius $R$, giving form factor $f(q) = 10\,\dfrac{\sin qR}{qR}$. At the scattering vector where $qR = \pi/2$, $f$ is ______ (to two decimal places).`,
      answer: 6.37, tol: 0.02, calc: () => 10 * 1 / (Math.PI / 2),
      sol: R`$f = 10\times\dfrac{\sin(\pi/2)}{\pi/2} = 10\times\dfrac{2}{\pi} = 6.37$. The form factor equals the electron count only at $q = 0$; at larger $q$ waves from different parts of the shell are out of step and partly cancel. For this shell $f$ first vanishes at $qR = \pi$.`,
      trap: R`Using $\sin(qR)$ in degrees: $\sin(1.571^\circ)$ is tiny.` },
    { id: 'sf-r4-07', type: 'mcq', level: 4, exams: G, sub: 'neutrons',
      q: R`A rock-salt crystal AB is studied with neutrons. The nuclear scattering lengths are $b_A = +5.0$ fm and $b_B = -3.0$ fm (negative scattering lengths occur, for example for H, Li, Ti and Mn). Ignoring angle-dependent factors, how do the reflections with $h, k, l$ all odd compare with those with $h, k, l$ all even?`,
      options: [R`All-odd reflections are stronger, by a factor of $16$`, R`All-even reflections are stronger, by a factor of $16$`, R`All-odd reflections are absent`, R`Both kinds are equally strong`], answer: 0,
      sol: R`For rock salt, $F = 4(b_A + b_B)$ for all-even and $F = 4(b_A - b_B)$ for all-odd indices. Here $|b_A + b_B| = 2$ fm and $|b_A - b_B| = 8$ fm, so the all-odd lines are $(8/2)^2 = 16$ times stronger. With X-rays all form factors are positive and the all-even lines are always the stronger ones; a negative scattering length turns this round.`,
      trap: R`X-ray intuition (all-even strongest) fails when one scattering length is negative.` },
    { id: 'sf-r4-08', type: 'nat', level: 5, exams: G, sub: 'anomalous scattering',
      q: R`A zinc-blende crystal has atom A ($f_A = 28$) on the fcc sites and atom B at $(\tfrac14,\tfrac14,\tfrac14)$ from each. Near B's absorption edge, B's form factor becomes $f_B = 30 + 4i$ (A's stays real). The intensity ratio $|F_{111}|^2/|F_{\bar1\bar1\bar1}|^2$ is ______ (to three decimal places).`,
      answer: 1.303, tol: 0.004, calc: () => ((28 + 4) ** 2 + 900) / ((28 - 4) ** 2 + 900),
      sol: R`$F_{hkl} = 4[f_A + f_Be^{i\pi(h + k + l)/2}]$. For $111$: $e^{3\pi i/2} = -i$, so $F = 4[28 - i(30 + 4i)] = 4[32 - 30i]$, $|F|^2 = 16(1024 + 900)$. For $\bar1\bar1\bar1$: $e^{-3\pi i/2} = +i$, $F = 4[28 + i(30 + 4i)] = 4[24 + 30i]$, $|F|^2 = 16(576 + 900)$. Ratio $= 1924/1476 = 1.303$. Friedel's law fails, which lets the absolute orientation (polarity) of a non-centrosymmetric crystal be found.`,
      trap: R`With real form factors the two would be equal; the imaginary part adds to one and subtracts from the other.` },
    { id: 'sf-r4-09', type: 'msq', level: 3, exams: G, sub: 'structure factor', format: 'statements',
      q: R`Which of these changes to a crystal leave every $|F_{hkl}|$ unchanged (no anomalous scattering)?`,
      options: [R`Moving every atom by the same vector.`, R`Inverting the whole structure through the origin.`, R`Replacing one kind of atom by a heavier element on the same sites.`, R`Swapping the two kinds of atom in a CsCl-type crystal AB.`], answer: [0, 1, 3],
      sol: R`A common shift multiplies every $F$ by a phase factor $e^{-i\vec G\cdot\vec r_0}$. Inversion replaces $F_{hkl}$ by $F_{\bar h\bar k\bar l} = F^*_{hkl}$ for real $f$ (Friedel's law), with the same modulus. In CsCl, $F = f_A + f_B(-1)^{h + k + l}$; swapping gives $f_B + f_A(-1)^{h + k + l}$, which has the same modulus in both cases. A heavier atom changes $f$ and so the amplitudes.`,
      trap: R`Swapping A and B in CsCl is just a shift of the origin by $(\tfrac12,\tfrac12,\tfrac12)$.` },
    { id: 'sf-r4-10', type: 'mcq', level: 3, exams: G, sub: 'centrosymmetric',
      q: R`A crystal has a centre of symmetry, and the origin is placed on it (no anomalous scattering). Its structure factors $F_{hkl}$ are`,
      options: [R`complex with arbitrary phases`, R`always positive`, R`purely imaginary`, R`real, so each phase is $0$ or $\pi$`], answer: 3,
      sol: R`With the origin at the inversion centre, atoms come in pairs at $\vec r$ and $-\vec r$ with equal $f$: $f(e^{i\vec G\cdot\vec r} + e^{-i\vec G\cdot\vec r}) = 2f\cos(\vec G\cdot\vec r)$. So $F$ is real, only its sign is unknown, and the phase problem shrinks to choosing $+$ or $-$ for each reflection.`,
      trap: R`Real does not mean positive: the cosines can be negative.` },
  ],
  gens: [
    { id: 'sf-r4g1', type: 'nat', level: 3, exams: G, sub: '1D basis',
      make(r) {
        const fA = int(r, 6, 40), fB = int(r, 4, 30), u = choose(r, [[1, 8], [1, 6], [1, 5], [1, 4], [1, 3], [3, 8]]), h = int(r, 1, 4);
        const F = fA + 2 * fB * Math.cos(2 * Math.PI * h * u[0] / u[1]), I = F * F;
        return { q: `A centrosymmetric 1D crystal of period $a$ has atom A ($f_A = ${fA}$) at $x = 0$ and atoms B ($f_B = ${fB}$) at $x = \\pm\\tfrac{${u[0]}}{${u[1]}}a$. Taking the form factors constant, $|F_{${h}}|^2$ for the order-${h} reflection is ______ (to one decimal place).`,
          answer: round(I, 1), tol: Math.max(0.2, round(I * 0.002, 1)), fA, fB, u0: u[0], u1: u[1], h,
          sol: `$F_h = f_A + f_B(e^{2\\pi ihu} + e^{-2\\pi ihu}) = f_A + 2f_B\\cos(2\\pi hu)$. With $hu = ${h}\\times${u[0]}/${u[1]}$: $\\cos = ${round(Math.cos(2 * Math.PI * h * u[0] / u[1]), 4)}$, so $F = ${fA} + ${2 * fB}\\times${round(Math.cos(2 * Math.PI * h * u[0] / u[1]), 4)} = ${round(F, 3)}$ and $|F|^2 = ${round(I, 1)}$.`,
          trap: 'The pair at $\\pm u$ gives a real cosine, which can be negative.' };
      },
      verify: (p) => (p.fA + 2 * p.fB * Math.cos(2 * Math.PI * p.h * p.u0 / p.u1)) ** 2 },
    { id: 'sf-r4g2', type: 'nat', level: 5, exams: G, sub: 'anomalous scattering',
      make(r) {
        const fA = int(r, 20, 40), fB = int(r, 20, 40), fpp = pick(r, 1, 6, 0.5), sgn = choose(r, [1, -1]);
        const big = (fA + fpp) ** 2 + fB ** 2, small = (fA - fpp) ** 2 + fB ** 2, ratio = sgn > 0 ? big / small : small / big;
        return { q: `A zinc-blende crystal has atom A ($f_A = ${fA}$, real) on the fcc sites and atom B at $(\\tfrac14,\\tfrac14,\\tfrac14)$ from each. Near B's absorption edge $f_B = ${fB} + ${fpp}i$. The intensity ratio $|F_{${sgn > 0 ? '111' : '\\bar1\\bar1\\bar1'}}|^2/|F_{${sgn > 0 ? '\\bar1\\bar1\\bar1' : '111'}}|^2$ is ______ (to three decimal places).`,
          answer: round(ratio, 3), tol: 0.003, fA, fB, fpp, sgn,
          sol: `$F_{hkl} = 4[f_A + f_Be^{i\\pi(h + k + l)/2}]$. For $111$ the phase factor is $-i$: $F = 4[(${fA} + ${fpp}) - ${fB}i]$, $|F|^2 = 16(${round(big, 2)})$. For $\\bar1\\bar1\\bar1$ it is $+i$: $F = 4[(${fA} - ${fpp}) + ${fB}i]$, $|F|^2 = 16(${round(small, 2)})$. Ratio $= ${round(ratio, 3)}$.`,
          trap: 'The imaginary part $f\'\'$ adds to the real part in one member of the Friedel pair and subtracts in the other.' };
      },
      verify: (p) => { const b = (p.fA + p.fpp) ** 2 + p.fB ** 2, s = (p.fA - p.fpp) ** 2 + p.fB ** 2; return p.sgn > 0 ? b / s : s / b; } },
    { id: 'sf-r4g3', type: 'mcq', level: 4, exams: G, sub: 'neutrons',
      make(r) {
        const [salt, nA, bA, nB, bB] = choose(r, [['LiH', 'Li', -1.90, 'H', -3.74], ['LiD', 'Li', -1.90, 'D', 6.67], ['LiF', 'Li', -1.90, 'F', 5.65], ['NaD', 'Na', 3.63, 'D', 6.67], ['NaCl', 'Na', 3.63, 'Cl', 9.58], ['MnO', 'Mn', -3.73, 'O', 5.80], ['NiO', 'Ni', 10.3, 'O', 5.80], ['TiO', 'Ti', -3.44, 'O', 5.80], ['KCl', 'K', 3.67, 'Cl', 9.58]]);
        const odd = (bA - bB) ** 2, even = (bA + bB) ** 2, ratio = odd / even;
        const o = mcqOptions(r, round(ratio, 2), [round(even / odd, 2), round(Math.abs(bA - bB) / Math.abs(bA + bB), 2), round(((Math.abs(bA) - Math.abs(bB)) / (Math.abs(bA) + Math.abs(bB))) ** 2, 2)], (v) => `$${v.toFixed(2)}$`);
        return { q: `${salt} has the rock-salt structure. The neutron scattering lengths are $b_{\\rm ${nA}} = ${bA}$ fm and $b_{\\rm ${nB}} = ${bB}$ fm. Ignoring angle-dependent factors, the intensity ratio $I_{111}/I_{200}$ of its first two neutron powder lines (apart from multiplicity) is`, ...o,
          sol: `Rock salt: $F_{111} = 4(b_{\\rm ${nA}} - b_{\\rm ${nB}}) = 4\\times${round(bA - bB, 2)}$ fm and $F_{200} = 4(b_{\\rm ${nA}} + b_{\\rm ${nB}}) = 4\\times${round(bA + bB, 2)}$ fm. $I_{111}/I_{200} = (${round(bA - bB, 2)}/${round(bA + bB, 2)})^2 = ${round(ratio, 2)}$.${bA * bB < 0 ? ' The opposite signs make the all-odd line the stronger one, unlike with X-rays.' : ''}`,
          trap: 'Scattering lengths keep their signs; do not use their sizes alone.' };
      } },
  ],
};
