// Defects and dislocations (CSIR NET Part C / GATE level): point defects (vacancies, interstitials, Schottky and
// Frenkel defects, equilibrium concentrations from the free energy, formation entropy, quenching, Simmons-Balluffi),
// colour centres, diffusion, line defects (edge, screw and mixed dislocations, Burgers vectors, glide, climb,
// cross-slip, slip systems, Schmid's law, Peach-Koehler force, strain energy, Frank's rule, partials and stacking
// faults, Taylor hardening, Orowan's equation, Frank-Read sources), planar defects (tilt boundaries, Hall-Petch).
// Original questions for fibub.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
import more from './defects-dislocations.more.gen.js';
import more2 from './defects-dislocations.more2.gen.js';
import r4 from './defects-dislocations.r4.gen.js';

const R = String.raw;
const KB = 8.617333e-5; // eV/K
const sci = (v, d = 3) => { const [m, e] = v.toExponential(d).split('e'); return (+m === 1 ? '' : m + R`\times`) + `10^{${+e}}`; };

export default {
  topic: 'defects-dislocations',
  items: [
    // ---------- level 1 ----------
    { id: 'def-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'point defects',
      q: 'A Schottky defect in an ionic crystal such as NaCl is',
      options: ['a cation that has left its site for an interstitial position', 'a pair of vacant sites, one cation and one anion, so the crystal stays neutral', 'a foreign ion sitting on a regular lattice site', 'an extra half-plane of atoms inside the crystal'], answer: 1,
      sol: 'In a Schottky defect the missing ions have gone to the surface. In an ionic crystal they must go in neutral sets: one cation vacancy and one anion vacancy for NaCl. The density falls slightly because volume is added with no extra mass.',
      trap: 'An ion moved to an interstitial site leaving a vacancy behind is a Frenkel defect; the density does not change.' },
    { id: 'def-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'dislocations',
      q: R`For a pure edge dislocation, the Burgers vector $\vec b$ and the dislocation line direction $\hat\xi$ are`,
      options: ['parallel', 'antiparallel', 'perpendicular', 'at 45° to each other'], answer: 2,
      sol: R`Close a Burgers circuit around the extra half-plane: the closure failure $\vec b$ points across the half-plane edge, at right angles to the line. Edge: $\vec b\perp\hat\xi$. Screw: $\vec b\parallel\hat\xi$. Mixed: anything in between, with constant $\vec b$ but changing line direction.`,
      trap: 'Parallel (or antiparallel) is the screw dislocation.' },
    { id: 'def-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'classification',
      q: 'Which of these is a planar (two-dimensional) defect?',
      options: ['A vacancy', 'A screw dislocation', 'An F centre', 'A stacking fault'], answer: 3,
      sol: 'Defects are sorted by dimension: point (vacancy, interstitial, substitutional atom, F centre), line (edge, screw, mixed dislocations), planar (grain boundaries, twin boundaries, stacking faults, surfaces) and volume (voids, precipitates). A stacking fault is a plane on which the stacking sequence is wrong, e.g. ABCAB|ABC in fcc.',
      trap: 'A dislocation is a line, not a plane, even though it moves on a slip plane.' },
    { id: 'def-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'colour centres',
      q: 'An F centre in an alkali halide is',
      options: ['an electron trapped at an anion vacancy', 'a hole trapped at a cation vacancy', 'an anion pushed into an interstitial site', 'a pair of neighbouring cation vacancies'], answer: 0,
      sol: 'An anion vacancy looks positive to an electron (a negative ion is missing). An electron bound there has discrete levels like a particle in a box; transitions between them absorb visible light and colour the crystal (KCl violet, NaCl yellow-brown). F is from the German Farbe, colour.',
      trap: 'A hole at a cation vacancy is a V centre, the "anti" of the F centre.' },
    { id: 'def-005', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'vacancy concentration', unit: '× 10⁻⁶',
      q: R`The vacancy formation energy in a metal is $1.00$ eV. The equilibrium fraction of vacant sites $n/N$ at $1000$ K is ______ $\times10^{-6}$ (to two decimal places). Use $k_B = 8.617\times10^{-5}$ eV/K.`,
      answer: 9.12, tol: 0.03, calc: () => Math.exp(-1 / (KB * 1000)) * 1e6,
      sol: R`$n/N = e^{-E_v/k_BT}$ with $E_v/k_BT = 1.00/(8.617\times10^{-5}\times1000) = 11.605$. So $n/N = e^{-11.605} = 9.12\times10^{-6}$: about one site in a hundred thousand.`,
      trap: 'Writing exp(−E/2kT): the factor 2 belongs to Schottky pairs and Frenkel defects, not to single vacancies in a metal.' },
    { id: 'def-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'vacancy concentration',
      q: 'Every crystal above absolute zero contains some vacancies in equilibrium because',
      options: ['vacancies lower the internal energy of the crystal', 'the entropy of mixing vacancies among sites lowers the free energy $F = U - TS$ at small concentration', 'the Pauli principle forbids filling every site', 'impurities always push atoms out of their sites'], answer: 1,
      sol: R`Each vacancy costs energy $E_v$, but placing $n$ vacancies among $N$ sites can be done in $N!/[n!(N-n)!]$ ways. The entropy term $-k_BT\ln W$ falls faster than linearly at small $n$, so $F$ always has a minimum at some $n > 0$: $n/N \approx e^{-E_v/k_BT}$.`,
      trap: 'Vacancies cost energy; they exist despite the energy, because of entropy.' },

    // ---------- level 2 ----------
    { id: 'def-007', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Frenkel defects',
      q: R`A crystal has $N$ lattice sites and $N_i$ interstitial sites. If $E_F$ is the energy to move one atom from a lattice site to an interstitial site, the equilibrium number of Frenkel defects ($n \ll N, N_i$) is`,
      options: [R`$N e^{-E_F/k_BT}$`, R`$\sqrt{NN_i}\,e^{-E_F/k_BT}$`, R`$N_i e^{-E_F/2k_BT}$`, R`$\sqrt{NN_i}\,e^{-E_F/2k_BT}$`], answer: 3,
      sol: R`Choose $n$ vacant lattice sites and, independently, $n$ occupied interstitial sites: $W = \binom Nn\binom{N_i}n$. Minimising $F = nE_F - k_BT\ln W$ with Stirling gives $n^2/[(N-n)(N_i-n)] = e^{-E_F/k_BT}$, so $n \approx \sqrt{NN_i}\,e^{-E_F/2k_BT}$.`,
      trap: 'The factor 2 in the exponent comes from creating two point defects (a vacancy and an interstitial) for one energy cost.' },
    { id: 'def-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'vacancy concentration',
      q: R`In a metal with vacancy formation energy $0.90$ eV, the equilibrium vacancy concentration at $900$ K is how many times that at $600$ K? (Nearest whole number; $k_B = 8.617\times10^{-5}$ eV/K.)`,
      answer: 331, tol: 3, calc: () => Math.exp(0.9 / KB * (1 / 600 - 1 / 900)),
      sol: R`$\dfrac{n_{900}}{n_{600}} = \exp\left[\dfrac{E_v}{k_B}\left(\dfrac1{600} - \dfrac1{900}\right)\right]$. $E_v/k_B = 10444$ K and $1/600 - 1/900 = 5.556\times10^{-4}$ K$^{-1}$, product $5.80$. $e^{5.80} \approx 331$.`,
      trap: 'Taking the ratio of the temperatures (1.5) or of the exponents, instead of the exponential of the difference.' },
    { id: 'def-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Burgers vector',
      q: R`The Burgers vector of a perfect (unit) dislocation in an fcc metal of cubic lattice constant $a$ has magnitude`,
      options: [R`$a$`, R`$a\sqrt3/2$`, R`$a/\sqrt2$`, R`$a/2$`], answer: 2,
      sol: R`A perfect dislocation's Burgers vector is the shortest lattice translation. In fcc that joins a corner to a face centre: $\tfrac a2\langle110\rangle$, length $\tfrac a2\sqrt2 = a/\sqrt2$, the nearest-neighbour distance.`,
      trap: R`$a\sqrt3/2$ is the bcc Burgers vector $\tfrac a2\langle111\rangle$; $a$ is simple cubic.` },
    { id: 'def-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'cross-slip',
      q: 'Which kind of dislocation can change its slip plane by cross-slip, moving by glide alone?',
      options: ['A pure edge dislocation', 'A pure screw dislocation', 'Both, equally easily', 'Neither: changing plane always needs diffusion'], answer: 1,
      sol: R`The slip plane must contain both $\vec b$ and the line. For an edge dislocation these are perpendicular and fix one plane. For a screw they are parallel, so any plane containing the line is a possible slip plane, and the screw can glide off onto another one: cross-slip.`,
      trap: 'An edge dislocation leaves its plane only by climb, which needs vacancies or interstitials to arrive or leave (diffusion).' },
    { id: 'def-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'climb',
      q: 'Climb of an edge dislocation (motion perpendicular to its slip plane)',
      options: ['needs atoms or vacancies to diffuse to or from the edge of the extra half-plane, so it is thermally activated', 'happens at any temperature under a shear stress alone', 'is the same as cross-slip', 'conserves the number of atoms in the extra half-plane'], answer: 0,
      sol: 'To move up or down, the extra half-plane must lose or gain atoms along its edge. That happens by absorbing vacancies (or emitting them), so climb is non-conservative and needs diffusion: it matters at high temperature (creep, recovery, polygonisation).',
      trap: 'Glide is conservative (no atoms added or removed); climb is not.' },
    { id: 'def-012', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Schmid law', unit: 'MPa',
      q: R`A single crystal is pulled with a tensile stress of $100$ MPa. The normal to the active slip plane makes $60^\circ$ with the tensile axis and the slip direction makes $35^\circ$ with it. The resolved shear stress on this slip system is ______ MPa (one decimal place).`,
      answer: 41.0, tol: 0.2, calc: () => 100 * Math.cos(Math.PI / 3) * Math.cos(35 * Math.PI / 180),
      sol: R`Schmid's law: $\tau_R = \sigma\cos\phi\cos\lambda = 100\times\cos60^\circ\times\cos35^\circ = 100\times0.5\times0.8192 = 41.0$ MPa.`,
      trap: R`Using $\sin$ for either angle; and note $\phi + \lambda \ge 90^\circ$ always (here $95^\circ$), so the Schmid factor never exceeds 0.5.` },
    { id: 'def-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'slip systems',
      q: 'How many independent slip systems of the type {111}⟨110⟩ does an fcc crystal have (counting a direction and its reverse once)?',
      options: ['3', '6', '8', '12'], answer: 3,
      sol: R`There are 4 distinct {111} planes (the faces of an octahedron), and each contains 3 close-packed $\langle110\rangle$ directions: $4\times3 = 12$ slip systems. This large number is why fcc metals (Cu, Al, Au) are so ductile.`,
      trap: 'Counting 8 octahedral faces double-counts parallel planes.' },
    { id: 'def-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Burgers vector',
      q: 'In a bcc metal the Burgers vector of a perfect dislocation is',
      options: [R`$a\langle100\rangle$`, R`$\tfrac a2\langle110\rangle$`, R`$\tfrac a2\langle111\rangle$`, R`$\tfrac a6\langle112\rangle$`], answer: 2,
      sol: R`The shortest lattice vector of bcc joins a corner to the body centre: $\tfrac a2\langle111\rangle$, length $a\sqrt3/2$. Slip runs along these close-packed body diagonals, mostly on {110} planes.`,
      trap: R`$\tfrac a6\langle112\rangle$ is a Shockley partial in fcc, not a lattice vector at all.` },
    { id: 'def-015', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'vacancy concentration', format: 'multi',
      q: 'Which statements about vacancies in a pure metal are correct?',
      options: ['Their equilibrium concentration rises exponentially with temperature.', 'Rapid quenching from near the melting point can freeze in an excess of vacancies.', 'Typical formation energies are of order 1 eV.', 'Their equilibrium concentration is independent of the formation energy.'], answer: [0, 1, 2],
      sol: R`$n/N = e^{S_v/k_B}e^{-E_v/k_BT}$: Arrhenius in $T$ and very sensitive to $E_v$ (about 1 eV: Cu 1.3, Al 0.7). Vacancies need diffusion to reach sinks (surfaces, dislocations), so a fast quench leaves the high-temperature population behind, measurable as extra electrical resistivity.`,
      trap: 'The concentration depends exponentially on the formation energy; that is the whole point of the Boltzmann factor.' },
    { id: 'def-016', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'vacancy concentration', unit: 'eV',
      q: R`Near its melting point of $1300$ K a metal has an equilibrium vacancy fraction of $1.0\times10^{-4}$. Ignoring the formation entropy, its vacancy formation energy is ______ eV (two decimal places).`,
      answer: 1.03, tol: 0.01, calc: () => -KB * 1300 * Math.log(1e-4),
      sol: R`$E_v = -k_BT\ln(n/N) = 8.617\times10^{-5}\times1300\times\ln(10^4) = 0.11202\times9.2103 = 1.03$ eV.`,
      trap: 'Using log base 10: ln(10⁴) = 9.21, not 4.' },
    { id: 'def-017', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Frenkel defects',
      q: 'In which of these crystals are Frenkel defects (rather than Schottky defects) dominant?',
      options: ['NaCl', 'KCl', 'AgBr', 'CsCl'], answer: 2,
      sol: R`Frenkel defects need a small ion that fits in an interstitial site. In the silver halides the Ag$^+$ ion is small and polarisable and moves easily into interstitial sites, so cation Frenkel pairs dominate (and make AgBr an ionic conductor and photographic material). The alkali halides have Schottky pairs.`,
      trap: 'Both kinds exist everywhere; the question is which costs less energy.' },

    // ---------- level 3 ----------
    { id: 'def-018', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Schottky defects',
      q: R`In an ionic crystal MX with $N$ ion pairs, the energy to form one Schottky pair (one M vacancy plus one X vacancy) is $E_p$. The equilibrium number of Schottky pairs is approximately`,
      options: [R`$N e^{-E_p/k_BT}$`, R`$N e^{-E_p/2k_BT}$`, R`$2N e^{-E_p/k_BT}$`, R`$N e^{-2E_p/k_BT}$`], answer: 1,
      sol: R`The $n$ cation vacancies and $n$ anion vacancies are placed independently: $W = \binom Nn^2$. Minimising $F = nE_p - 2k_BT\ln\binom Nn$ gives $n^2/(N - n)^2 = e^{-E_p/k_BT}$, so $n \approx N e^{-E_p/2k_BT}$.`,
      trap: 'The pair is one energy cost but two independent entropies; that halves the exponent.' },
    { id: 'def-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Frenkel defects', unit: '× 10⁻⁵',
      q: R`In AgBr, take the number of interstitial sites equal to the number of Ag sites and the Frenkel formation energy as $1.10$ eV. The fraction of Ag ions on interstitial sites at $600$ K is ______ $\times10^{-5}$ (two decimal places; $k_B = 8.617\times10^{-5}$ eV/K).`,
      answer: 2.40, tol: 0.02, calc: () => Math.exp(-1.1 / (2 * KB * 600)) * 1e5,
      sol: R`With $N_i = N$: $n/N = e^{-E_F/2k_BT}$. $2k_BT = 0.10341$ eV, so the exponent is $1.10/0.10341 = 10.637$ and $n/N = e^{-10.637} = 2.40\times10^{-5}$.`,
      trap: R`Dropping the 2 gives $5.8\times10^{-10}$, five orders of magnitude too small.` },
    { id: 'def-020', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'strain energy', unit: 'eV',
      q: R`Estimate the elastic energy of a dislocation as $\tfrac12Gb^2$ per unit length. For copper, $G = 45$ GPa and $b = 0.256$ nm. The energy per atomic length $b$ of dislocation line is ______ eV (two decimal places).`,
      answer: 2.36, tol: 0.02, calc: () => 0.5 * 45e9 * (0.256e-9) ** 2 * 0.256e-9 / 1.602176634e-19,
      sol: R`Energy per length $= \tfrac12\times45\times10^9\times(0.256\times10^{-9})^2 = 1.475\times10^{-9}$ J/m. Times $b$: $3.775\times10^{-19}$ J $= 2.36$ eV. Several eV per atom plane is far more than $k_BT$, so dislocations are not equilibrium defects: entropy can never pay for them.`,
      trap: 'Forgetting to multiply by b to get energy per atom along the line.' },
    { id: 'def-021', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: "Frank's rule",
      q: R`In an fcc metal a perfect dislocation splits into two Shockley partials: $\tfrac a2[\bar110] \to \tfrac a6[\bar211] + \tfrac a6[\bar12\bar1]$. By Frank's $b^2$ rule, the elastic energy after splitting is what fraction of that before (ignoring the stacking fault and the interaction)?`,
      options: ['1/3', '1/2', '2/3', 'It is larger: 4/3'], answer: 2,
      sol: R`Check the vectors add: $\tfrac a6(-2-1, 1+2, 1-1) = \tfrac a6(-3,3,0) = \tfrac a2(-1,1,0)$. Energies go as $b^2$: before $a^2/2$; each partial $\tfrac{a^2}{36}(4+1+1) = a^2/6$, two give $a^2/3$. Ratio $(a^2/3)/(a^2/2) = 2/3 < 1$, so splitting lowers the energy; the partials repel until the stacking-fault energy between them balances.`,
      trap: 'Adding lengths |b| instead of b² would make the split look unfavourable.' },
    { id: 'def-022', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'work hardening', unit: 'MPa',
      q: R`Taylor's relation for work hardening is $\tau = \alpha Gb\sqrt\rho$. For aluminium, $G = 26$ GPa, $b = 0.286$ nm, $\alpha = 0.3$ and a dislocation density $\rho = 10^{14}$ m$^{-2}$. The flow stress is ______ MPa (one decimal place).`,
      answer: 22.3, tol: 0.1, calc: () => 0.3 * 26e9 * 0.286e-9 * 1e7 / 1e6,
      sol: R`$\sqrt\rho = 10^7$ m$^{-1}$. $\tau = 0.3\times26\times10^9\times0.286\times10^{-9}\times10^7 = 2.23\times10^7$ Pa $= 22.3$ MPa. Doubling the stress needs four times the dislocation density.`,
      trap: 'Using ρ instead of √ρ.' },
    { id: 'def-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: "Orowan's equation", unit: 's⁻¹',
      q: R`In a crystal with $10^{12}$ m$^{-2}$ mobile dislocations of Burgers vector $0.25$ nm moving at an average $1.0$ mm/s, the plastic shear strain rate is ______ s$^{-1}$ (two decimal places).`,
      answer: 0.25, tol: 0.005, calc: () => 1e12 * 0.25e-9 * 1e-3,
      sol: R`Orowan: $\dot\gamma = \rho_m b\bar v = 10^{12}\times2.5\times10^{-10}\times10^{-3} = 0.25$ s$^{-1}$. Each dislocation crossing a crystal of height $h$ shears it by $b/h$, which is where the formula comes from.`,
      trap: 'Mixing mm/s with m/s gives an answer 1000 times too big.' },
    { id: 'def-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'ideal strength',
      q: R`Frenkel's estimate of the shear stress needed to slide one perfect atomic plane rigidly over another is about $G/2\pi$. Real annealed metal crystals start to slip at $10^{-4}$ to $10^{-5}$ of $G$ because`,
      options: ['real crystals have a much smaller shear modulus than measured', 'dislocations let the slip happen one line of atoms at a time, which needs only a small stress', 'thermal vibrations melt the slip plane', 'the slip planes in real crystals are not close packed'], answer: 1,
      sol: R`A dislocation is the boundary between slipped and unslipped regions. Moving it by one $b$ shifts each atom near the core by a small amount, never breaking all bonds across the plane at once. The Peierls stress needed is tiny in close-packed metals, so the yield stress is set by obstacles to dislocations, not by bond strength.`,
      trap: 'G is measured from small elastic strains and is correct; it is the rigid-slip picture that is wrong.' },
    { id: 'def-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'grain boundaries', unit: 'nm',
      q: R`A symmetric low-angle tilt boundary of misorientation $0.50^\circ$ is a wall of edge dislocations with $b = 0.25$ nm. Their spacing is ______ nm (one decimal place).`,
      answer: 28.6, tol: 0.1, calc: () => 0.25 / (0.5 * Math.PI / 180),
      sol: R`For small angles, $\theta = b/D$ (in radians), so $D = b/\theta = 0.25/(0.5\times\pi/180) = 0.25/0.008727 = 28.6$ nm.`,
      trap: 'Using θ in degrees gives 0.5 nm, which would be one dislocation every two atoms.' },
    { id: 'def-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'strain energy',
      q: R`The elastic energy per unit length of a straight screw dislocation in a cylinder of radius $R$ is $\dfrac{Gb^2}{4\pi}\ln\dfrac R{r_0}$. As $R\to\infty$ this energy`,
      options: [R`diverges logarithmically, so it must be cut off at the crystal size or at the distance to other dislocations`, R`tends to a finite value $Gb^2/4\pi$`, R`falls to zero as $1/R$`, R`grows as $R^2$`], answer: 0,
      sol: R`The shear strain around a screw falls as $b/2\pi r$, so the energy density $\tfrac12G\gamma^2\propto1/r^2$; integrating over $2\pi r\,dr$ gives $\int dr/r = \ln(R/r_0)$. In a real crystal $R$ is roughly the spacing between dislocations, whose fields cancel beyond that, giving the usual estimate of about $Gb^2/2$ per length.`,
      trap: 'A 1/r² energy density does not give a convergent integral in two dimensions.' },
    { id: 'def-027', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'dislocations', format: 'multi',
      q: 'Which statements comparing edge and screw dislocations are correct?',
      options: ['An edge dislocation has a hydrostatic stress (compression above the slip plane on the side of the extra half-plane, tension below).', 'A screw dislocation in an isotropic crystal has a pure shear stress field and no hydrostatic part.', 'An edge dislocation glides in the direction of its Burgers vector.', 'A screw dislocation glides parallel to its Burgers vector.'], answer: [0, 1, 2],
      sol: R`The extra half-plane squeezes the region where it sits and leaves the region below stretched: the edge field has $\sigma_{xx},\sigma_{yy}$ and pressure, which attracts large solutes below and small ones above (Cottrell atmospheres). The screw field is only $\sigma_{\theta z} = Gb/2\pi r$. An edge line moves along $\vec b$; a screw line moves perpendicular to $\vec b$ (and to itself), though either way the crystal is sheared by $\vec b$.`,
      trap: 'For a screw the line and b are parallel, so the line must move sideways, at right angles to b.' },
    { id: 'def-028', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'diffusion',
      q: R`Self-diffusion by vacancies has activation energy $Q = 2.0$ eV (formation plus migration). The diffusion coefficient at $1200$ K is how many times that at $1000$ K? (One decimal place.)`,
      answer: 47.9, tol: 0.3, calc: () => Math.exp(2.0 / KB * (1 / 1000 - 1 / 1200)),
      sol: R`$D = D_0e^{-Q/k_BT}$, so $D_{1200}/D_{1000} = \exp[(Q/k_B)(1/1000 - 1/1200)] = \exp(23209\times1.667\times10^{-4}) = e^{3.868} = 47.9$.`,
      trap: 'Using only the migration energy: the vacancy must first exist (formation) and then jump (migration), so both appear in Q.' },
    { id: 'def-029', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'grain boundaries',
      q: R`By the Hall-Petch relation $\sigma_y = \sigma_0 + kd^{-1/2}$, reducing the grain size $d$ by a factor of 4 changes the grain-boundary contribution to the yield stress by a factor of`,
      options: ['1/2', '4', '16', '2'], answer: 3,
      sol: R`$d^{-1/2}\to(d/4)^{-1/2} = 2d^{-1/2}$: the term $kd^{-1/2}$ doubles. Grain boundaries stop dislocation pile-ups; smaller grains mean shorter pile-ups with less stress concentration, so a larger applied stress is needed.`,
      trap: 'The exponent is −1/2, not −1.' },
    { id: 'def-030', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'slip systems',
      q: 'An hcp metal that slips only on its basal plane {0001} along close-packed ⟨11̄20⟩ directions has how many slip systems?',
      options: ['3', '12', '6', '1'], answer: 0,
      sol: 'There is one basal plane orientation and it holds 3 distinct close-packed directions: 1 × 3 = 3 slip systems. That is fewer than the 5 independent systems the von Mises criterion needs for general shape changes, which is why basal-slip hcp metals such as Zn and Mg are less ductile than fcc metals.',
      trap: 'Counting 6 directions double-counts each direction with its reverse.' },

    // ---------- level 4 ----------
    { id: 'def-031', type: 'nat', level: 4, exams: ['net'], sub: 'Simmons-Balluffi', unit: '× 10⁻⁴',
      q: R`On heating a metal from low temperature to near its melting point, the length of a bar grows by $\Delta L/L = 2.00\times10^{-3}$ while X-rays show the lattice parameter grows by $\Delta a/a = 1.90\times10^{-3}$. The vacancy fraction at the high temperature is ______ $\times10^{-4}$ (one decimal place).`,
      answer: 3.0, tol: 0.05, calc: () => 3 * (2.0e-3 - 1.9e-3) * 1e4,
      sol: R`Each vacancy adds one atomic volume (the atom went to the surface) without changing the lattice parameter much. Volume: $\Delta V/V = 3\Delta L/L$ for the bar, $3\Delta a/a$ for the lattice. The difference is the fraction of new sites: $n/N = 3(\Delta L/L - \Delta a/a) = 3\times1.0\times10^{-4} = 3.0\times10^{-4}$.`,
      trap: 'Forgetting the factor 3 between linear and volume strain.' },
    { id: 'def-032', type: 'nat', level: 4, exams: ['net'], sub: 'formation entropy',
      q: R`The measured vacancy fraction in a metal at $1000$ K is $5.0\times10^{-5}$ and its formation energy is $1.00$ eV. Writing $n/N = e^{S_v/k_B}e^{-E_v/k_BT}$, the formation entropy $S_v/k_B$ is ______ (two decimal places).`,
      answer: 1.70, tol: 0.01, calc: () => Math.log(5e-5) + 1 / (KB * 1000),
      sol: R`$S_v/k_B = \ln(n/N) + E_v/k_BT = \ln(5.0\times10^{-5}) + 11.605 = -9.903 + 11.605 = 1.70$. The entropy comes mostly from the softened vibrations of the atoms next to the vacancy; values of 1 to 3 are typical.`,
      trap: R`A positive $S_v$ raises the concentration (factor $e^{1.7}\approx5.5$).` },
    { id: 'def-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'vacancy concentration', unit: 'K',
      q: R`A metal has vacancy formation energy $0.70$ eV. At what temperature does the equilibrium vacancy fraction reach $1.0\times10^{-3}$? Answer to the nearest 5 K (neglect formation entropy).`,
      answer: 1176, tol: 5, calc: () => 0.7 / (KB * Math.log(1000)),
      sol: R`$T = \dfrac{E_v}{k_B\ln(N/n)} = \dfrac{0.70}{8.617\times10^{-5}\times6.908} = 1176$ K.`,
      trap: R`Solving with $\ln(10^{-3})$ and dropping the sign gives a negative temperature.` },
    { id: 'def-034', type: 'nat', level: 4, exams: ['net'], sub: 'dislocation interactions', unit: 'mN/m',
      q: R`Two parallel straight screw dislocations of the same sign, $b = 0.25$ nm, lie $50$ nm apart in a crystal with $G = 40$ GPa. The force per unit length between them has magnitude ______ mN/m (two decimal places).`,
      answer: 7.96, tol: 0.03, calc: () => 40e9 * (0.25e-9) ** 2 / (2 * Math.PI * 50e-9) * 1e3,
      sol: R`The first screw's stress at distance $r$ is $\tau = Gb/2\pi r$; the Peach-Koehler force on the second is $\tau b$: $F/L = \dfrac{Gb^2}{2\pi r} = \dfrac{40\times10^9\times6.25\times10^{-20}}{2\pi\times5\times10^{-8}} = 7.96\times10^{-3}$ N/m. Like signs repel, opposite signs attract and annihilate.`,
      trap: 'Using the edge formula with (1 − ν) in the denominator; for screws there is no Poisson factor.' },
    { id: 'def-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Frank-Read source', unit: 'MPa',
      q: R`A Frank-Read source is a dislocation segment pinned at both ends, $L = 1.0\ \mu$m apart. With $G = 30$ GPa and $b = 0.25$ nm, the shear stress needed to bow it into a semicircle and make it multiply is about $Gb/L$ = ______ MPa (one decimal place).`,
      answer: 7.5, tol: 0.05, calc: () => 30e9 * 0.25e-9 / 1e-6 / 1e6,
      sol: R`The line tension is about $T\approx Gb^2/2$ and a bowed segment of radius $r$ feels $\tau b = T/r$. The critical shape is the semicircle, $r = L/2$: $\tau = 2T/(bL) \approx Gb/L = 30\times10^9\times0.25\times10^{-9}/10^{-6} = 7.5\times10^6$ Pa $= 7.5$ MPa. Past that, the loop expands on its own and pinches off new loops.`,
      trap: 'Longer segments operate at lower stress; the stress is inversely proportional to L.' },
    { id: 'def-036', type: 'mcq', level: 4, exams: ['net'], sub: 'Peach-Koehler force',
      q: R`A screw dislocation lies along $\hat z$ with $\vec b = b\hat z$. The only non-zero applied stress is $\sigma_{yz} = \sigma_{zy} = \tau$. By the Peach-Koehler formula $\vec F/L = (\boldsymbol\sigma\cdot\vec b)\times\hat\xi$, the force per unit length on it is`,
      options: [R`$\tau b\,\hat z$`, R`$\tau b\,\hat y$`, R`zero`, R`$\tau b\,\hat x$`], answer: 3,
      sol: R`$\boldsymbol\sigma\cdot\vec b = (\sigma_{xz}, \sigma_{yz}, \sigma_{zz})b = (0, \tau b, 0)$. Cross with $\hat\xi = \hat z$: $(0, \tau b, 0)\times(0,0,1) = (\tau b, 0, 0)$. The force is perpendicular to the line, so the screw glides along $x$ on the $xz$ plane, and the crystal is sheared along $z$, the direction of $\vec b$.`,
      trap: 'The force is never along the line itself; moving a line along itself does nothing.' },
    { id: 'def-037', type: 'msq', level: 4, exams: ['net'], sub: 'colour centres', format: 'multi',
      q: 'Which statements about F centres in alkali halides are correct?',
      options: ['Within a family of alkali halides, the F-band absorption energy falls as the lattice constant grows.', 'They can be made by heating the crystal in the vapour of its own alkali metal.', 'A crystal containing F centres is paramagnetic, because of the unpaired trapped electrons.', 'An F centre is a hole trapped at a cation vacancy.'], answer: [0, 1, 2],
      sol: R`The trapped electron behaves like a particle in a box of size about $a$, so the level spacing goes roughly as $a^{-2}$ (the Mollwo-Ivey rule, observed $\approx a^{-1.8}$). Heating in alkali vapour adds alkali atoms at the surface; the matching anion vacancies diffuse in and capture the released electrons (stoichiometric excess). Each centre has one unpaired electron, seen in ESR. A hole at a cation vacancy is a V centre.`,
      trap: 'Larger box, smaller level spacing: the absorption moves to the red, not the blue.' },
    { id: 'def-038', type: 'nat', level: 4, exams: ['net'], sub: 'colour centres', unit: 'eV',
      q: R`Model an F centre in KCl as an electron in a cubical box of side equal to the lattice constant, $L = 0.63$ nm. The energy of the lowest absorption ($E_{111}\to E_{211}$) in this model is ______ eV (two decimal places).`,
      answer: 2.84, tol: 0.02, calc: () => 3 * (6.62607015e-34) ** 2 / (8 * 9.1093837015e-31 * (0.63e-9) ** 2) / 1.602176634e-19,
      sol: R`$E = \dfrac{h^2}{8mL^2}(n_x^2+n_y^2+n_z^2)$, so $\Delta E = 3\,h^2/8mL^2$. $h^2/8mL^2 = (6.626\times10^{-34})^2/(8\times9.109\times10^{-31}\times3.969\times10^{-19}) = 1.517\times10^{-19}$ J $= 0.947$ eV. $\Delta E = 2.84$ eV, the right order of magnitude (measured 2.3 eV): the colour is set by the box size.`,
      trap: R`Taking $\Delta E = h^2/8mL^2$ forgets that $(2^2+1+1) - 3 = 3$.` },

    // ---------- level 5 ----------
    { id: 'def-039', type: 'nat', level: 5, exams: ['net'], sub: 'Schottky and Frenkel',
      q: R`An ionic crystal can form Schottky pairs (energy $2.0$ eV per pair) or cation Frenkel defects (energy $1.6$ eV, with as many interstitial sites as cation sites). At $800$ K, the ratio of the number of Schottky pairs to the number of Frenkel defects is ______ (three decimal places).`,
      answer: 0.055, tol: 0.001, calc: () => Math.exp(-0.4 / (2 * KB * 800)),
      sol: R`Schottky: $n_S = Ne^{-E_S/2k_BT}$. Frenkel with $N_i = N$: $n_F = Ne^{-E_F/2k_BT}$. Ratio $= e^{-(E_S - E_F)/2k_BT} = e^{-0.4/(2\times0.06894)} = e^{-2.901} = 0.055$. Both exponents carry the factor 2, so only the energy difference matters.`,
      trap: 'Putting the factor 2 in only one of the two concentrations.' },
    { id: 'def-040', type: 'nat', level: 5, exams: ['net'], sub: 'quenching',
      q: R`A metal with $E_v = 1.10$ eV is quenched from $1100$ K to $300$ K so fast that all vacancies are retained. The retained vacancy concentration exceeds the equilibrium value at $300$ K by a factor $10^x$. Find $x$ (two decimal places).`,
      answer: 13.44, tol: 0.02, calc: () => 1.1 / KB * (1 / 300 - 1 / 1100) / Math.LN10,
      sol: R`Ratio $= \exp[(E_v/k_B)(1/300 - 1/1100)] = \exp(12765\times2.4242\times10^{-3}) = e^{30.95}$. $x = 30.95/\ln10 = 13.44$. This huge supersaturation drives quenched vacancies to cluster into voids and dislocation loops on annealing.`,
      trap: 'Forgetting to convert from the natural exponent to a power of ten.' },
    { id: 'def-041', type: 'nat', level: 5, exams: ['net'], sub: 'partial dislocations', unit: 'nm',
      q: R`A perfect dislocation in an fcc metal ($a = 0.36$ nm, $G = 30$ GPa) splits into two Shockley partials of length $a/\sqrt6$ that bound a stacking fault of energy $\gamma = 0.045$ J/m$^2$. Using the simple balance $d = Gb_p^2/(2\pi\gamma)$, the equilibrium width of the fault is ______ nm (two decimal places).`,
      answer: 2.29, tol: 0.02, calc: () => 30e9 * (0.36e-9) ** 2 / 6 / (2 * Math.PI * 0.045) * 1e9,
      sol: R`$b_p^2 = a^2/6 = 2.16\times10^{-20}$ m$^2$. The partials repel with force per length $\approx Gb_p^2/2\pi d$; the fault pulls them together with $\gamma$. Balance: $d = Gb_p^2/2\pi\gamma = 30\times10^9\times2.16\times10^{-20}/(2\pi\times0.045) = 2.29\times10^{-9}$ m. Low stacking-fault energy means wide faults, harder cross-slip (the partials must recombine first) and stronger work hardening.`,
      trap: R`Using the perfect Burgers vector $a/\sqrt2$ instead of the partial $a/\sqrt6$ triples the width.` },
    { id: 'def-042', type: 'msq', level: 5, exams: ['net'], sub: 'dislocations', format: 'multi',
      q: 'Which statements about dislocations are correct?',
      options: ['A dislocation line cannot end inside a perfect crystal; it ends at a surface, a grain boundary or a node, or closes into a loop.', 'The Burgers vector is the same at every point along one dislocation line.', 'A pure screw dislocation has a unique slip plane.', 'Climb is a conservative motion that needs no diffusion.'], answer: [0, 1],
      sol: R`The Burgers circuit around a line gives the same closure failure wherever it is drawn, so $\vec b$ is constant, and a line ending inside perfect crystal would let a circuit slip off it to give zero: impossible. At a node the vectors add up ($\sum\vec b_i = 0$ for lines pointing out). A screw has $\vec b\parallel\hat\xi$, so every plane containing the line is a slip plane; climb adds or removes atoms and needs diffusion.`,
      trap: 'Along a curved loop the character (edge, screw, mixed) changes, but b does not.' },
    ...more2,
    ...r4.items,
  ],
  gens: [
    { id: 'def-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'vacancy concentration',
      make(r) {
        const E = pick(r, 0.6, 1.6, 0.05), T = pick(r, 600, 1500, 50), f = Math.exp(-E / (KB * T));
        const e = Math.floor(Math.log10(f)), m = f / 10 ** e;
        return { q: R`A metal has vacancy formation energy $${E}$ eV. At $${T}$ K, the equilibrium vacancy fraction is $n/N = x\times10^{${e}}$. Find $x$ (three significant figures; $k_B = 8.617\times10^{-5}$ eV/K).`,
          answer: +m.toPrecision(3), tol: +(m * 0.01).toPrecision(2), E, T, e,
          sol: R`$E_v/k_BT = ${E}/(8.617\times10^{-5}\times${T}) = ${round(E / (KB * T), 3)}$, so $n/N = e^{-${round(E / (KB * T), 3)}} = ${m.toPrecision(3)}\times10^{${e}}$.`,
          trap: 'The single-vacancy exponent has no factor 2.' };
      },
      verify: (p) => Math.exp(-p.E / (KB * p.T)) / 10 ** p.e },
    { id: 'def-g02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'vacancy concentration', unit: 'K',
      make(r) {
        const E = pick(r, 0.5, 1.5, 0.05), k = int(r, 4, 7), T = E / (KB * k * Math.LN10);
        return { q: R`A metal has vacancy formation energy $${E}$ eV. Neglecting the formation entropy, at what temperature is one lattice site in $10^{${k}}$ vacant? (Nearest kelvin.)`,
          answer: Math.round(T), tol: Math.max(2, Math.round(T * 0.005)), E, k,
          sol: R`$e^{-E_v/k_BT} = 10^{-${k}}$ gives $T = \dfrac{E_v}{k_B\,${k}\ln10} = \dfrac{${E}}{8.617\times10^{-5}\times${round(k * Math.LN10, 3)}} = ${Math.round(T)}$ K.`,
          trap: 'Using log₁₀ in place of ln: the Boltzmann factor is a natural exponential.' };
      },
      verify: (p) => p.E / (KB * p.k * Math.LN10) },
    { id: 'def-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'vacancy concentration',
      make(r) {
        const E = pick(r, 0.6, 1.4, 0.05), T1 = pick(r, 400, 800, 50), T2 = T1 + pick(r, 100, 500, 50), x = E / KB * (1 / T1 - 1 / T2);
        const ans = x / Math.LN10;
        return { q: R`For a metal with vacancy formation energy $${E}$ eV, the equilibrium vacancy concentration at $${T2}$ K is $10^{y}$ times that at $${T1}$ K. Find $y$ (two decimal places).`,
          answer: round(ans, 2), tol: 0.02, E, T1, T2,
          sol: R`Ratio $= \exp\left[\dfrac{E_v}{k_B}\left(\dfrac1{${T1}} - \dfrac1{${T2}}\right)\right] = e^{${round(x, 3)}}$. So $y = ${round(x, 3)}/\ln10 = ${round(ans, 2)}$.`,
          trap: 'The temperatures enter as reciprocals, not as a ratio.' };
      },
      verify: (p) => p.E / KB * (1 / p.T1 - 1 / p.T2) / Math.LN10 },
    { id: 'def-g04', type: 'nat', level: 4, exams: ['net'], sub: 'Arrhenius analysis', unit: 'eV',
      make(r) {
        const E = pick(r, 0.6, 1.5, 0.01), T1 = pick(r, 700, 1000, 50), T2 = T1 + pick(r, 100, 400, 50);
        const c1 = Math.exp(-E / (KB * T1)), c2 = Math.exp(-E / (KB * T2));
        const s1 = +c1.toPrecision(3), s2 = +c2.toPrecision(3), Ecalc = KB * Math.log(s2 / s1) / (1 / T1 - 1 / T2);
        const sh = (v) => { const e = Math.floor(Math.log10(v)); return R`${+(v / 10 ** e).toPrecision(3)}\times10^{${e}}`; };
        return { q: R`Quenching experiments give vacancy fractions of $${sh(s1)}$ at $${T1}$ K and $${sh(s2)}$ at $${T2}$ K. Assuming $n/N = Ae^{-E_v/k_BT}$ with constant $A$, the formation energy is ______ eV (two decimal places).`,
          answer: round(Ecalc, 2), tol: 0.01, s1, s2, T1, T2,
          sol: R`Divide the two: $\ln(c_2/c_1) = \dfrac{E_v}{k_B}\left(\dfrac1{T_1} - \dfrac1{T_2}\right)$, and $A$ cancels. $\ln(c_2/c_1) = ${round(Math.log(s2 / s1), 4)}$ and $1/${T1} - 1/${T2} = ${sci(1 / T1 - 1 / T2, 4)}$ K$^{-1}$, so $E_v = 8.617\times10^{-5}\times${round(Math.log(s2 / s1), 4)}/${sci(1 / T1 - 1 / T2, 4)} = ${round(Ecalc, 2)}$ eV.`,
          trap: 'Using one measurement alone needs A (the entropy factor); the ratio removes it.' };
      },
      verify: (p) => KB * Math.log(p.s2 / p.s1) / (1 / p.T1 - 1 / p.T2) },
    { id: 'def-g05', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Burgers vector',
      make(r) {
        const a = pick(r, 0.28, 0.60, 0.01), [name, f, vec] = choose(r, [['fcc', Math.SQRT1_2, R`\tfrac a2\langle110\rangle`], ['bcc', Math.sqrt(3) / 2, R`\tfrac a2\langle111\rangle`], ['simple cubic', 1, R`a\langle100\rangle`]]);
        const b = a * f, sh = (v) => R`$${round(v, 3)}$ nm`;
        const o = mcqOptions(r, round(b, 3), [round(a * Math.SQRT1_2, 3), round(a * Math.sqrt(3) / 2, 3), round(a, 3), round(a / 2, 3), round(a * Math.sqrt(3), 3), round(a * Math.SQRT2, 3)].filter((v) => v !== round(b, 3)), sh);
        return { q: R`A${name === 'fcc' ? 'n' : ''} ${name} crystal has cubic lattice constant $a = ${a}$ nm. The magnitude of the Burgers vector of a perfect dislocation is`, ...o,
          sol: R`A perfect dislocation has the shortest lattice translation as its Burgers vector. For ${name} that is $${vec}$, of length $${round(f, 4)}a = ${round(b, 3)}$ nm.`,
          trap: 'fcc: a/√2 (face diagonal half); bcc: a√3/2 (body diagonal half); simple cubic: a.' };
      } },
    { id: 'def-g06', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Schmid law', unit: 'MPa',
      make(r) {
        const s = pick(r, 20, 300, 10), phi = pick(r, 30, 70, 5), lam = pick(r, Math.max(20, 95 - phi), 80, 5);
        const t = s * Math.cos(phi * Math.PI / 180) * Math.cos(lam * Math.PI / 180);
        return { q: R`A tensile stress of $${s}$ MPa acts on a single crystal. The slip-plane normal is at $${phi}^\circ$ and the slip direction at $${lam}^\circ$ to the tensile axis. The resolved shear stress on the slip system is ______ MPa (one decimal place).`,
          answer: round(t, 1), tol: Math.max(0.1, round(t * 0.005, 2)), unit: 'MPa', s, phi, lam,
          sol: R`$\tau_R = \sigma\cos\phi\cos\lambda = ${s}\times${round(Math.cos(phi * Math.PI / 180), 4)}\times${round(Math.cos(lam * Math.PI / 180), 4)} = ${round(t, 1)}$ MPa. The Schmid factor here is ${round(Math.cos(phi * Math.PI / 180) * Math.cos(lam * Math.PI / 180), 3)}, below the maximum 0.5.`,
          trap: 'Both angles are measured from the tensile axis and both enter as cosines.' };
      },
      verify: (p) => p.s * Math.cos(p.phi * Math.PI / 180) * Math.cos(p.lam * Math.PI / 180) },
    { id: 'def-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'work hardening',
      make(r) {
        const G = pick(r, 20, 80, 2), b = pick(r, 0.22, 0.30, 0.01), al = choose(r, [0.2, 0.3, 0.4, 0.5]), rho1 = choose(r, [1e12, 1e13, 1e14]), m = choose(r, [4, 9, 16, 25, 100]);
        const t1 = al * G * 1e9 * b * 1e-9 * Math.sqrt(rho1) / 1e6, t2 = t1 * Math.sqrt(m), mode = choose(r, ['stress', 'rise']);
        const ans = mode === 'stress' ? t2 : t2 - t1;
        return { q: R`Using Taylor's relation $\tau = \alpha Gb\sqrt\rho$ with $\alpha = ${al}$, $G = ${G}$ GPa and $b = ${b}$ nm: cold work raises the dislocation density from $${sci(rho1, 0)}$ m$^{-2}$ by a factor of ${m}. ${mode === 'stress' ? 'The new flow stress' : 'The increase in flow stress'} is ______ MPa (one decimal place).`,
          answer: round(ans, 1), tol: Math.max(0.1, round(ans * 0.005, 2)), unit: 'MPa', G, b, al, rho1, m, mode,
          sol: R`Before: $\tau_1 = ${al}\times${G}\times10^9\times${b}\times10^{-9}\times\sqrt{${sci(rho1, 0)}} = ${round(t1, 2)}$ MPa. The stress scales as $\sqrt\rho$, so after: $\tau_2 = \sqrt{${m}}\,\tau_1 = ${round(t2, 2)}$ MPa. ${mode === 'stress' ? '' : R`Increase: $${round(t2, 2)} - ${round(t1, 2)} = ${round(ans, 1)}$ MPa.`}`,
          trap: R`The stress goes as the square root of the density: ${m} times more dislocations give ${Math.sqrt(m)} times the stress.` };
      },
      verify: (p) => { const t1 = p.al * p.G * p.b * Math.sqrt(p.rho1) / 1e6; return p.mode === 'stress' ? t1 * Math.sqrt(p.m) : t1 * (Math.sqrt(p.m) - 1); } },
    { id: 'def-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'grain boundaries',
      make(r) {
        const b = pick(r, 0.2, 0.35, 0.01), mode = choose(r, ['D', 'theta']);
        if (mode === 'D') {
          const th = pick(r, 0.2, 3, 0.1), D = b / (th * Math.PI / 180);
          return { q: R`A symmetric tilt boundary of angle $${th}^\circ$ is made of edge dislocations with $b = ${b}$ nm. Their spacing is ______ nm (one decimal place).`,
            answer: round(D, 1), tol: Math.max(0.1, round(D * 0.005, 2)), unit: 'nm', b, th, mode,
            sol: R`$D = b/\theta$ with $\theta$ in radians: $${th}^\circ = ${round(th * Math.PI / 180, 5)}$ rad, so $D = ${b}/${round(th * Math.PI / 180, 5)} = ${round(D, 1)}$ nm.`,
            trap: 'Convert the angle to radians first.' };
        }
        const D = pick(r, 5, 100, 1), th = b / D * 180 / Math.PI;
        return { q: R`Electron microscopy shows a low-angle tilt boundary as a row of edge dislocations ($b = ${b}$ nm) spaced $${D}$ nm apart. The misorientation across the boundary is ______ degrees (three decimal places).`,
          answer: round(th, 3), tol: Math.max(0.001, round(th * 0.005, 4)), unit: '°', b, D, mode,
          sol: R`$\theta = b/D = ${b}/${D} = ${round(b / D, 5)}$ rad $= ${round(th, 3)}^\circ$.`,
          trap: 'b/D is in radians.' };
      },
      verify: (p) => (p.mode === 'D' ? p.b / (p.th * Math.PI / 180) : p.b / p.D * 180 / Math.PI) },
    { id: 'def-g09', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Frank-Read source',
      make(r) {
        const G = pick(r, 20, 80, 1), b = pick(r, 0.22, 0.30, 0.01), mode = choose(r, ['tau', 'L']);
        if (mode === 'tau') {
          const L = pick(r, 0.2, 5, 0.1), t = G * 1e9 * b * 1e-9 / (L * 1e-6) / 1e6;
          return { q: R`A Frank-Read source has its pinning points $${L}\ \mu$m apart. With $G = ${G}$ GPa and $b = ${b}$ nm, the stress $\tau \approx Gb/L$ needed to operate it is ______ MPa (one decimal place).`,
            answer: round(t, 1), tol: Math.max(0.1, round(t * 0.005, 2)), unit: 'MPa', G, b, L, mode,
            sol: R`$\tau = Gb/L = ${G}\times10^9\times${b}\times10^{-9}/(${L}\times10^{-6}) = ${round(t, 2)}$ MPa.`,
            trap: 'Convert μm to m and GPa to Pa before dividing.' };
        }
        const t = pick(r, 2, 60, 1), L = G * 1e9 * b * 1e-9 / (t * 1e6) / 1e-6;
        return { q: R`In a crystal with $G = ${G}$ GPa and $b = ${b}$ nm, a shear stress of $${t}$ MPa just operates Frank-Read sources. Using $\tau \approx Gb/L$, the length of the pinned segments is ______ $\mu$m (two decimal places).`,
          answer: round(L, 2), tol: Math.max(0.01, round(L * 0.005, 3)), unit: 'μm', G, b, t, mode,
          sol: R`$L = Gb/\tau = ${G}\times10^9\times${b}\times10^{-9}/(${t}\times10^6) = ${round(L, 3)}\ \mu$m.`,
          trap: 'The segment length and the operating stress are inversely proportional.' };
      },
      verify: (p) => (p.mode === 'tau' ? p.G * p.b / p.L : p.G * p.b / p.t) },
    { id: 'def-g10', type: 'mcq', level: 4, exams: ['net'], sub: "Frank's rule",
      make(r) {
        const RX = [
          { t: R`\tfrac a2[110] \to \tfrac a6[211] + \tfrac a6[12\bar1]`, before: 1 / 2, after: 1 / 3 },
          { t: R`\tfrac a2[110] + \tfrac a2[0\bar11] \to \tfrac a2[101]`, before: 1, after: 1 / 2 },
          { t: R`\tfrac a2[111] + \tfrac a2[1\bar1\bar1] \to a[100]`, before: 3 / 2, after: 1 },
          { t: R`a[100] \to \tfrac a2[111] + \tfrac a2[1\bar1\bar1]`, before: 1, after: 3 / 2 },
          { t: R`\tfrac a2[110] + \tfrac a2[1\bar10] \to a[100]`, before: 1, after: 1 },
          { t: R`\tfrac a6[211] + \tfrac a6[\bar2\bar1\bar1] \to 0`, before: 1 / 3, after: 0 },
        ];
        const x = choose(r, RX), d = x.after - x.before;
        const verdict = d < -1e-9 ? 'favourable' : d > 1e-9 ? 'unfavourable' : 'neutral';
        const fr = (v) => ({ '0': '0', '0.5': '1/2', '-0.5': '−1/2', '1': '1', '1.5': '3/2', '0.33333': '1/3', '-0.33333': '−1/3', '-0.16667': '−1/6' })[String(round(v, 5))] ?? String(round(v, 3));
        const opts = { favourable: R`energetically favourable: $\sum b^2$ falls`, unfavourable: R`energetically unfavourable: $\sum b^2$ rises`, neutral: R`neither favoured nor opposed by Frank's rule: $\sum b^2$ is unchanged` };
        const wrong = [...Object.entries(opts).filter(([k]) => k !== verdict).map(([, v]) => v), R`favourable, because the number of dislocations increases`, R`unfavourable, because $\sum|\vec b|$ must always fall`];
        const o = mcqOptions(r, opts[verdict], wrong);
        return { q: R`By Frank's $b^2$ criterion (elastic energy $\propto b^2$, interactions ignored), the reaction $${x.t}$ is`, ...o,
          sol: R`Sum of $b^2$ before $= ${fr(x.before)}\,a^2$, after $= ${fr(x.after)}\,a^2$ (for $\tfrac a2[110]$, $b^2 = a^2/2$; $\tfrac a2[111]$, $3a^2/4$; $a[100]$, $a^2$; $\tfrac a6[211]$, $a^2/6$). The change is $${fr(d)}\,a^2$, so the reaction is ${verdict}.`,
          trap: 'Compare sums of squared lengths, not sums of lengths; also check the vectors add up.' };
      } },
    { id: 'def-g11', type: 'nat', level: 4, exams: ['net'], sub: 'Schottky and Frenkel',
      make(r) {
        const ES = pick(r, 1.6, 2.6, 0.1), EF = pick(r, 1.0, 2.4, 0.1), T = pick(r, 500, 1000, 50), x = (ES - EF) / (2 * KB * T);
        const ans = x / Math.LN10;
        return { q: R`An ionic crystal has Schottky pair energy $${ES}$ eV and cation Frenkel energy $${EF}$ eV (as many interstitial as cation sites). At $${T}$ K, $\log_{10}(n_F/n_S)$, the base-10 log of the ratio of Frenkel defects to Schottky pairs, is ______ (two decimal places).`,
          answer: round(ans, 2), tol: 0.02, ES, EF, T,
          sol: R`$n_S = Ne^{-E_S/2k_BT}$ and $n_F = Ne^{-E_F/2k_BT}$, so $\ln(n_F/n_S) = (E_S - E_F)/2k_BT = ${round(ES - EF, 2)}/(2\times8.617\times10^{-5}\times${T}) = ${round(x, 3)}$, and $\log_{10} = ${round(x, 3)}/2.3026 = ${round(ans, 2)}$. ${ans > 0 ? 'Frenkel defects dominate.' : ans < 0 ? 'Schottky pairs dominate.' : 'They are equally common.'}`,
          trap: 'Both defects carry the factor 2 in the exponent.' };
      },
      verify: (p) => (p.ES - p.EF) / (2 * KB * p.T) / Math.LN10 },
    { id: 'def-g12', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'classification',
      make(r) {
        const D = [
          ['an electron bound at an anion vacancy in KCl', 'point defect (colour centre)'],
          ['a missing Na⁺ and a missing Cl⁻ in NaCl', 'point defect (Schottky pair)'],
          ['an Ag⁺ ion moved into an interstitial site in AgBr', 'point defect (Frenkel pair)'],
          ['the boundary line of an extra half-plane of atoms', 'line defect (edge dislocation)'],
          ['a line around which the lattice planes form a helical ramp', 'line defect (screw dislocation)'],
          ['a plane where the fcc stacking ABCABC becomes ABCBCABC', 'planar defect (stacking fault)'],
          ['a wall of edge dislocations separating two slightly tilted grains', 'planar defect (low-angle grain boundary)'],
          ['a cluster of vacancies collapsed into an empty cavity', 'volume defect (void)'],
        ];
        const [desc, ans] = choose(r, D), all = D.map((d) => d[1]);
        const cat = (a) => a.split(' ')[0], o = mcqOptions(r, ans, ['point', 'line', 'planar', 'volume'].filter((c) => c !== cat(ans)).map((c) => choose(r, all.filter((a) => cat(a) === c))));
        return { q: `Classify this imperfection: ${desc}.`, ...o,
          sol: `Defects are sorted by how many dimensions they extend in: point (0D), line (1D), planar (2D) and volume (3D). ${desc[0].toUpperCase() + desc.slice(1)} is a ${ans}.`,
          trap: 'A dislocation is a line, even though it bounds a slipped area; a wall of dislocations is a boundary (planar).' };
      } },
    ...more,
    ...r4.gens,
  ],
};
