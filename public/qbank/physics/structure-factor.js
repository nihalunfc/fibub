// Diffraction and the structure factor (GATE / CSIR NET level): Laue equations and the Ewald sphere in vector form,
// the structure factor as a Fourier coefficient, hcp, fluorite, perovskite, Cu3Au and partly ordered alloys, the atomic
// form factor (hydrogen 1s), Debye-Waller attenuation, multiplicity and Lorentz-polarisation factors, screw axes,
// Friedel's law and anomalous scattering, magnetic neutron peaks, LEED and electron diffraction, Fourier synthesis.
// Original questions for fibub. Bragg's law, indexing and the basic cubic rules are in x-ray-diffraction.
import { pick, int, choose, shuffle, mcqOptions, round } from '../_util.js';
import more from './structure-factor.more.gen.js';
import more2 from './structure-factor.more2.gen.js';

const PI = Math.PI, D = PI / 180;
const bar = (n) => (n < 0 ? `\\bar{${-n}}` : `${n}`);
const hkl = (t) => `(${t.map(bar).join('')})`;
const FCC = [[0, 0, 0], [0, 0.5, 0.5], [0.5, 0, 0.5], [0.5, 0.5, 0]];
const add = (p, s) => [p[0] + s[0], p[1] + s[1], p[2] + s[2]];
// structures: list of [label, position] in the conventional cubic cell
const STR = {
  'rock salt (NaCl type)': { A: 'cation', B: 'anion', sites: [...FCC.map((p) => ['A', p]), ...FCC.map((p) => ['B', add(p, [0.5, 0.5, 0.5])])] },
  'caesium chloride (CsCl type)': { A: 'corner ion', B: 'body-centre ion', sites: [['A', [0, 0, 0]], ['B', [0.5, 0.5, 0.5]]] },
  'zinc blende (ZnS type)': { A: 'atom on the fcc sites', B: 'atom at the quarter positions', sites: [...FCC.map((p) => ['A', p]), ...FCC.map((p) => ['B', add(p, [0.25, 0.25, 0.25])])] },
  'fluorite (CaF$_2$ type)': { A: 'cation', B: 'anion', sites: [...FCC.map((p) => ['A', p]), ...FCC.map((p) => ['B', add(p, [0.25, 0.25, 0.25])]), ...FCC.map((p) => ['B', add(p, [0.75, 0.75, 0.75])])] },
  'Cu$_3$Au (ordered L1$_2$)': { A: 'Au (corner)', B: 'Cu (face centres)', sites: [['A', [0, 0, 0]], ['B', [0, 0.5, 0.5]], ['B', [0.5, 0, 0.5]], ['B', [0.5, 0.5, 0]]] },
};
const Fof = (st, t, fA, fB) => { let re = 0, im = 0; for (const [s, p] of st.sites) { const f = s === 'A' ? fA : fB, ph = 2 * PI * (t[0] * p[0] + t[1] * p[1] + t[2] * p[2]); re += f * Math.cos(ph); im += f * Math.sin(ph); } return [re, im]; };
const F2 = (st, t, fA, fB) => { const [re, im] = Fof(st, t, fA, fB); const v = re * re + im * im; return Math.abs(v) < 1e-9 ? 0 : v; };
// hcp: atoms at (0,0,0) and (1/3,2/3,1/2): |F|^2/f^2 = 2 + 2 cos(2 pi ((h+2k)/3 + l/2))
const hcpF2 = (h, k, l) => { const v = 2 + 2 * Math.cos(2 * PI * ((h + 2 * k) / 3 + l / 2)); return Math.abs(v) < 1e-9 ? 0 : v; };
const mult = (t) => { const s = new Set(); const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]]; for (const p of perms) for (const sx of [1, -1]) for (const sy of [1, -1]) for (const sz of [1, -1]) s.add([t[p[0]] * sx, t[p[1]] * sy, t[p[2]] * sz].join(',')); return s.size; };

export default {
  topic: 'structure-factor',
  items: [
    // ---------- level 1 ----------
    { id: 'sf-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'structure factor',
      q: 'The structure factor $F_{hkl}$ of a crystal depends on',
      options: ['only the lattice constant', 'the kinds of atoms in the basis and their positions in the cell', 'only the X-ray wavelength', 'the number of unit cells in the crystal'], answer: 1,
      sol: '$F_{hkl} = \\sum_j f_j\\,e^{2\\pi i(hx_j + ky_j + lz_j)}$, a sum over the atoms of one cell: their form factors $f_j$ (which kind of atom) and their fractional positions $(x_j, y_j, z_j)$. The lattice fixes where the peaks are; $F$ fixes how strong each is. The number of cells changes the overall height and sharpness of the peaks, not $F$.',
      trap: 'The wavelength enters only indirectly, through the fall of $f_j$ with $\\sin\\theta/\\lambda$.' },
    { id: 'sf-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'phase problem',
      q: 'A diffraction experiment measures the integrated intensity of each reflection. This gives directly',
      options: ['$|F_{hkl}|^2$, but not the phase of $F_{hkl}$', 'the full complex $F_{hkl}$, phase included', 'only the sign of $F_{hkl}$', 'the electron density at each atom directly'], answer: 0,
      sol: 'The intensity is proportional to $F F^* = |F_{hkl}|^2$, so the phase of $F$ is lost. Since the electron density is the Fourier sum $\\rho(\\vec r) = \\tfrac1V\\sum F_{hkl}e^{-2\\pi i(hx+ky+lz)}$, it cannot be rebuilt from intensities alone: this is the phase problem of crystallography, solved by direct methods, heavy atoms or anomalous scattering.',
      trap: 'Detectors count photons (energy), never field amplitudes with their phase.' },
    { id: 'sf-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'form factor',
      q: 'The X-ray atomic form factor of a K$^+$ ion ($Z = 19$) in the forward direction ($\\theta = 0$) is',
      options: ['19', '20', '9.5', '18'], answer: 3,
      sol: 'X-rays scatter from electrons. At $\\theta = 0$ all the electrons scatter in phase, so $f(0)$ equals the number of electrons. K$^+$ has lost one electron: $f(0) = 19 - 1 = 18$. (This is why K$^+$ and Cl$^-$, both with 18 electrons, scatter almost alike.)',
      trap: 'Using $Z = 19$ ignores the charge of the ion.' },
    { id: 'sf-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Laue equations',
      q: 'With $\\Delta\\vec k = \\vec k\\,\' - \\vec k$ the change of wave vector on scattering, which of these is one of the three Laue equations?',
      options: ['$\\vec a_1\\times\\Delta\\vec k = 2\\pi h$', '$|\\Delta\\vec k| = 2\\pi/|\\vec a_1|$', '$\\vec a_1\\cdot\\Delta\\vec k = 2\\pi h$, with $h$ an integer', '$\\vec a_1\\cdot\\vec k = 2\\pi h$'], answer: 2,
      sol: 'Waves scattered from points one lattice vector apart differ in phase by $\\Delta\\vec k\\cdot\\vec a_i$. All cells scatter in phase when $\\vec a_i\\cdot\\Delta\\vec k = 2\\pi\\times$ integer for $i = 1, 2, 3$. Together the three equations say $\\Delta\\vec k = \\vec G_{hkl}$.',
      trap: 'The condition is on the change $\\Delta\\vec k$, not on the incident $\\vec k$ itself.' },
    { id: 'sf-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Ewald sphere',
      q: 'In the Ewald construction for elastic scattering of wavelength $\\lambda$, the sphere',
      options: ['has radius $2\\pi/\\lambda$ and passes through the origin of the reciprocal lattice', 'has radius $\\lambda$ and is centred on the origin', 'has radius $4\\pi/\\lambda$ and is centred on the origin', 'has radius $2\\pi/d_{hkl}$ for the strongest reflection'], answer: 0,
      sol: 'Draw the incident $\\vec k$ (length $2\\pi/\\lambda$) so that it ends at the reciprocal-lattice origin. A sphere of radius $|\\vec k|$ about its starting point passes through the origin. Every reciprocal lattice point on this sphere gives $\\vec k\\,\' = \\vec k + \\vec G$ with $|\\vec k\\,\'| = |\\vec k|$: a diffracted beam.',
      trap: 'The radius $4\\pi/\\lambda$ belongs to the limiting sphere (all orientations), centred on the origin.' },
    { id: 'sf-006', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'Ewald sphere', unit: 'Å⁻¹',
      q: 'The radius of the Ewald sphere for Cu K$\\alpha$ X-rays ($\\lambda = 1.54$ Å) is ______ Å$^{-1}$ (to three decimal places).',
      answer: 4.080, tol: 0.004, calc: () => 2 * PI / 1.54,
      sol: '$|\\vec k| = 2\\pi/\\lambda = 6.2832/1.54 = 4.080$ Å$^{-1}$.',
      trap: 'Using $1/\\lambda = 0.649$ Å$^{-1}$ mixes the crystallographers\' convention with the $2\\pi$ convention for $\\vec G$.' },

    // ---------- level 2 ----------
    { id: 'sf-007', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'form factor',
      q: 'The X-ray atomic form factor $f(\\vec q)$ of an atom is, apart from constants,',
      options: ['the square of the electron density at the nucleus', 'the Fourier transform of the electron density $\\rho(\\vec r)$ of the atom', 'the Laplace transform of the potential energy of the atom', 'the number of electrons divided by $\\sin\\theta$'], answer: 1,
      sol: 'Each volume element $\\rho(\\vec r)d^3r$ scatters with a phase factor $e^{i\\vec q\\cdot\\vec r}$, so $f(\\vec q) = \\int\\rho(\\vec r)e^{i\\vec q\\cdot\\vec r}d^3r$ with $q = 4\\pi\\sin\\theta/\\lambda$. At $q = 0$ it is the number of electrons; it falls as $q$ grows because the cloud has a finite size. The structure factor is the same idea applied to a whole cell.',
      trap: 'The fall with angle is not $1/\\sin\\theta$; it is set by the size of the cloud (a wider cloud falls faster).' },
    { id: 'sf-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'equal form factors',
      q: 'KCl has the rock-salt structure, yet its X-ray powder pattern looks like that of a simple cubic crystal of lattice constant $a/2$. The reason is that',
      options: ['KCl really has a simple cubic Bravais lattice', 'its lattice constant is too large for the odd reflections to fit', 'K$^+$ and Cl$^-$ both have 18 electrons, so their form factors are nearly equal and the all-odd reflections almost cancel', 'the Cl$^-$ ions do not scatter X-rays'], answer: 2,
      sol: 'For rock salt, all-odd reflections have $F = 4(f_+ - f_-)$ and all-even ones $F = 4(f_+ + f_-)$. K$^+$ and Cl$^-$ are isoelectronic, so $f_+ \\approx f_-$ and the all-odd lines nearly vanish. What remains (all even) is what an sc crystal of identical atoms with spacing $a/2$ would give. The lattice is still fcc.',
      trap: 'Missing lines here are a near-accident of form factors, not a change of Bravais lattice. In NaCl ($f_+ \\ne f_-$) the odd lines are clearly seen.' },
    { id: 'sf-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'diamond',
      q: 'For the diamond structure of identical atoms (form factor $f$ taken the same for both reflections), the ratio $|F_{111}|^2/|F_{220}|^2$ is',
      options: ['$1$', '$2$', '$0$', '$1/2$'], answer: 3,
      sol: 'Diamond is fcc with a basis at $0$ and $(\\tfrac14,\\tfrac14,\\tfrac14)$, so for unmixed indices $F = 4f[1 + e^{i\\pi(h+k+l)/2}]$. $(111)$: $1 + e^{3\\pi i/2} = 1 - i$, $|F|^2 = 16f^2\\cdot2 = 32f^2$. $(220)$: $1 + e^{2\\pi i} = 2$, $|F|^2 = 64f^2$. Ratio $= 1/2$.',
      trap: 'Forgetting that $1 - i$ has modulus $\\sqrt2$, not 1 or 0.' },
    { id: 'sf-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Friedel law',
      q: 'Friedel\'s law $|F_{hkl}| = |F_{\\bar h\\bar k\\bar l}|$ (no anomalous scattering) means that a diffraction pattern',
      options: ['shows a centre of symmetry even when the crystal has none', 'always has 4-fold symmetry', 'can tell left- and right-handed crystals apart', 'contains only even orders of reflection'], answer: 0,
      sol: 'With real form factors, $F_{\\bar h\\bar k\\bar l} = \\sum f_j e^{-2\\pi i(\\dots)} = F_{hkl}^*$, so the two intensities are equal. The pattern therefore always looks centrosymmetric, whether or not the crystal is. Only anomalous scattering near an absorption edge (complex $f$) breaks this and reveals handedness.',
      trap: 'Concluding the crystal must have an inversion centre because its pattern does.' },
    { id: 'sf-011', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'neutrons', format: 'multi',
      q: 'Which statements comparing thermal-neutron and X-ray diffraction are correct?',
      options: ['Neutron scattering lengths do not grow steadily with atomic number.', 'Neutrons locate hydrogen (or deuterium) atoms far better than X-rays.', 'The nuclear scattering length of an atom falls off with angle as strongly as an X-ray form factor.', 'Neutrons can reveal the ordering of atomic magnetic moments.'], answer: [0, 1, 3],
      sol: 'Neutrons scatter from nuclei through the strong force, with lengths $b$ that vary irregularly from isotope to isotope (even negative, as for H). Light atoms such as H/D are therefore visible next to heavy ones. The nucleus is tiny compared with the wavelength, so $b$ does not fall with angle (unlike $f$, which reflects the size of the electron cloud). The neutron\'s magnetic moment also scatters from unpaired electron spins, which shows magnetic order.',
      trap: 'The magnetic part of neutron scattering does fall with angle (it comes from the electron cloud); the nuclear part does not.' },
    { id: 'sf-012', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Debye-Waller',
      q: 'Atoms in a crystal vibrate with a mean-square displacement $\\langle u^2\\rangle = 0.010$ Å$^2$ (all three directions together). Using $I = I_0\\exp(-G^2\\langle u^2\\rangle/3)$, the fraction of the static intensity left in the reflection from planes of spacing $1.0$ Å is ______ (to three decimal places).',
      answer: 0.877, tol: 0.003, calc: () => Math.exp(-((2 * PI) ** 2) * 0.01 / 3),
      sol: '$G = 2\\pi/d = 6.283$ Å$^{-1}$, $G^2 = 39.48$ Å$^{-2}$. Exponent $= 39.48\\times0.010/3 = 0.1316$. $I/I_0 = e^{-0.1316} = 0.877$. The peak keeps its sharpness; 12% of its intensity moves into a diffuse background.',
      trap: 'Using $\\langle u^2\\rangle$ without the $1/3$ (that form needs the one-direction value $\\langle u_x^2\\rangle$).' },
    { id: 'sf-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'scattering vector',
      q: 'For elastic scattering through an angle $2\\theta$ with wavelength $\\lambda$, the magnitude of the scattering vector $\\Delta\\vec k$ is',
      options: ['$2\\pi\\sin\\theta/\\lambda$', '$4\\pi\\cos\\theta/\\lambda$', '$4\\pi\\sin2\\theta/\\lambda$', '$4\\pi\\sin\\theta/\\lambda$'], answer: 3,
      sol: '$\\vec k$ and $\\vec k\\,\'$ both have length $k = 2\\pi/\\lambda$ and make an angle $2\\theta$. Their difference is the base of an isosceles triangle: $|\\Delta\\vec k| = 2k\\sin\\theta = 4\\pi\\sin\\theta/\\lambda$. Setting it equal to $|\\vec G| = 2\\pi n/d$ gives Bragg\'s law $2d\\sin\\theta = n\\lambda$.',
      trap: 'Using the full scattering angle $2\\theta$ inside the sine.' },
    { id: 'sf-014', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Laue equations', unit: 'degree',
      q: 'A beam of wavelength $1.5$ Å falls perpendicular to a long row of identical atoms spaced $5.0$ Å apart. The first-order diffracted beams lie on a cone whose half-angle, measured from the row, is ______ degrees (to one decimal place).',
      answer: 72.5, tol: 0.1, calc: () => Math.acos(1.5 / 5) / D,
      sol: 'For a single row only one Laue equation applies: $a(\\cos\\alpha - \\cos\\alpha_0) = h\\lambda$, with $\\alpha$ the angle to the row. At normal incidence $\\cos\\alpha_0 = 0$, so $\\cos\\alpha = \\lambda/a = 0.30$ and $\\alpha = 72.5^\\circ$. Every direction at that angle to the row works: a cone. A 3D crystal needs three such cones to meet, which is why a fixed crystal in a monochromatic beam rarely diffracts.',
      trap: 'Taking the angle from the normal ($17.5^\\circ$) instead of from the row.' },
    { id: 'sf-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'powder intensities',
      q: 'In a powder pattern the multiplicity factor $p_{hkl}$ multiplies the intensity of a line because',
      options: ['higher orders of reflection are stronger', 'all planes of the form $\\{hkl\\}$ have the same spacing and diffract into the same ring', 'the Lorentz factor is larger at low angles', 'each crystallite reflects $p$ times before the beam leaves'], answer: 1,
      sol: 'In a cubic crystal, for example, the 6 orientations $(100), (010), \\dots, (00\\bar1)$ all have spacing $a$ and so all add to the same cone of angle $2\\theta$. Randomly oriented grains put each of them in reflecting position equally often, so the ring is $p$ times stronger: $p = 6$ for $\\{100\\}$, 12 for $\\{110\\}$, 8 for $\\{111\\}$.',
      trap: 'Multiplicity counts symmetry-equivalent planes, not orders of reflection.' },
    { id: 'sf-016', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'structure factor', format: 'multi',
      q: 'Which statements about the structure factor $F_{hkl}$ are correct?',
      options: ['$F_{hkl}$ is in general a complex number.', '$F_{hkl}$ is (up to the cell volume) the Fourier coefficient of the electron density for $\\vec G_{hkl}$.', 'Moving the origin of the cell changes $|F_{hkl}|$.', '$F_{hkl} = 0$ means the lattice has no planes with those indices.'], answer: [0, 1],
      sol: '(1) True: a sum of phase factors is complex unless the cell is centrosymmetric about the origin. (2) True: $\\rho(\\vec r) = \\tfrac1{V}\\sum_{\\vec G}F_{\\vec G}e^{-i\\vec G\\cdot\\vec r}$. (3) False: shifting the origin by $\\vec r_0$ multiplies $F$ by $e^{-i\\vec G\\cdot\\vec r_0}$, changing only its phase. (4) False: the planes exist; the waves from the different basis atoms cancel.',
      trap: 'Statement 4 is the classic slip: "absent reflection" means destructive interference within the basis, not missing planes.' },
    { id: 'sf-046', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'Ewald sphere', format: 'multi',
      q: 'Which statements about the Ewald sphere construction are correct?',
      options: ['Its radius is $2\\pi/\\lambda$.', 'A reflection occurs whenever a reciprocal lattice point lies on the sphere.', 'For a fixed crystal in a monochromatic beam, usually few or no points lie on it.', 'Shorter wavelengths give a smaller sphere.'], answer: [0, 1, 2],
      sol: 'The radius is $|\\vec k| = 2\\pi/\\lambda$, so a shorter wavelength gives a <em>larger</em> sphere (statement 4 false). A point on the sphere means $|\\vec k + \\vec G| = |\\vec k|$: the Laue condition. Reciprocal lattice points are a discrete set, so a sphere through the origin in a general orientation misses them almost always. That is why experiments rotate the crystal, use a powder, or use white radiation (a range of spheres: the Laue method).',
      trap: 'Inverse relation: $\\lambda$ small, sphere big.' },

    // ---------- level 3 ----------
    { id: 'sf-017', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'hcp',
      q: 'An hcp crystal of identical atoms has atoms at $(0,0,0)$ and $(\\tfrac13,\\tfrac23,\\tfrac12)$ in the hexagonal cell. Which reflection is absent?',
      options: ['$(100)$', '$(001)$', '$(101)$', '$(002)$'], answer: 1,
      sol: '$F = f[1 + e^{2\\pi i((h+2k)/3 + l/2)}]$. It vanishes when the phase is an odd multiple of $\\pi$: $h + 2k = 3n$ and $l$ odd. $(001)$: $h + 2k = 0$, $l = 1$: $F = f(1 + e^{i\\pi}) = 0$. The others: $(100)$ phase $2\\pi/3$ ($|F|^2 = f^2$), $(101)$ phase $5\\pi/3$ ($3f^2$), $(002)$ phase $2\\pi$ ($4f^2$).',
      trap: 'Physically, the B-layer half way up scatters exactly out of phase with the A-layers for $(001)$, so the basal reflection appears first as $(002)$.' },
    { id: 'sf-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'hcp',
      q: 'For the hcp structure of identical atoms (atoms at $(0,0,0)$ and $(\\tfrac13,\\tfrac23,\\tfrac12)$), $|F_{101}|^2$ in units of $f^2$ is ______.',
      answer: 3, tol: 0, calc: () => 2 + 2 * Math.cos(2 * PI * (1 / 3 + 1 / 2)),
      sol: 'Phase of the second atom: $2\\pi(\\tfrac13 + \\tfrac12) = \\tfrac{5\\pi}{3}$. $|1 + e^{i\\phi}|^2 = 2 + 2\\cos\\phi = 2 + 2\\cos300^\\circ = 2 + 1 = 3$.',
      trap: 'Squaring the real part only, or using $h + k$ instead of $h + 2k$ (the second atom is at $\\tfrac13, \\tfrac23$).' },
    { id: 'sf-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'ordered alloys',
      q: 'Ordered Cu$_3$Au has Au at the cube corners and Cu at the face centres. Taking $f_{Au} = 79$ and $f_{Cu} = 29$ for both lines (forward values, a rough approximation), the ratio of a superlattice to a fundamental structure-factor intensity, $|F_{100}|^2/|F_{111}|^2$, is ______ (to three decimal places).',
      answer: 0.091, tol: 0.002, calc: () => (79 - 29) ** 2 / (79 + 3 * 29) ** 2,
      sol: 'Sites $(0,0,0)$ Au and $(0,\\tfrac12,\\tfrac12), (\\tfrac12,0,\\tfrac12), (\\tfrac12,\\tfrac12,0)$ Cu. Unmixed $(111)$: all phases $1$, $F = f_{Au} + 3f_{Cu} = 166$. Mixed $(100)$: the phase factor is $e^{2\\pi ix}$, which is $+1$ for Au and for the Cu at $(0,\\tfrac12,\\tfrac12)$, and $-1$ for the other two Cu. So $F = f_{Au} + f_{Cu} - 2f_{Cu} = f_{Au} - f_{Cu} = 50$. Ratio $= 2500/27556 = 0.091$.',
      trap: 'Expecting $(100)$ to be absent as in fcc: it is absent only when all four sites hold the same (or the same average) atom.' },
    { id: 'sf-020', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'ordered alloys',
      q: 'Cu$_3$Au is heated above its order-disorder temperature, where Au and Cu occupy the four fcc sites at random. Its powder pattern then',
      options: ['loses the mixed-index (superlattice) lines and shows only the fcc lines', 'gains extra lines at half-integer indices', 'keeps every line with unchanged intensity', 'loses the unmixed-index lines and keeps the mixed ones'], answer: 0,
      sol: 'With random occupation each site scatters like an average atom $\\bar f = \\tfrac14 f_{Au} + \\tfrac34 f_{Cu}$. All four sites are then equivalent: an fcc lattice of identical (average) atoms, for which mixed indices give $F = 0$. The fundamental lines remain with $F = 4\\bar f = f_{Au} + 3f_{Cu}$, unchanged.',
      trap: 'Disorder does not wipe out the fcc lines; it only removes the extra lines that order created.' },
    { id: 'sf-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'fluorite',
      q: 'In fluorite CaF$_2$, Ca sits on the fcc sites and F at $(\\tfrac14,\\tfrac14,\\tfrac14)$ and $(\\tfrac34,\\tfrac34,\\tfrac34)$ from each. Taking forward values $f_{Ca} = 18$ (Ca$^{2+}$) and $f_F = 10$ (F$^-$), the magnitude $|F_{200}|$ is ______.',
      answer: 8, tol: 0, calc: () => Math.abs(4 * (18 + 10 * (Math.cos(PI) + Math.cos(3 * PI)))),
      sol: 'For unmixed indices the fcc sum gives a factor 4: $F = 4[f_{Ca} + f_F(e^{i\\pi(h+k+l)/2} + e^{3i\\pi(h+k+l)/2})]$. For $(200)$, $h + k + l = 2$: $e^{i\\pi} + e^{3i\\pi} = -2$. $F = 4(18 - 20) = -8$, so $|F_{200}| = 8$. The two F ions sit half way between Ca planes for this reflection and almost cancel the Ca.',
      trap: 'Adding the F contributions with a plus sign gives $4(18 + 20) = 152$, which is the $(400)$ or $(220)$ value.' },
    { id: 'sf-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'perovskite',
      q: 'Cubic perovskite SrTiO$_3$ has Sr at $(0,0,0)$, Ti at $(\\tfrac12,\\tfrac12,\\tfrac12)$ and O at $(\\tfrac12,\\tfrac12,0)$, $(\\tfrac12,0,\\tfrac12)$, $(0,\\tfrac12,\\tfrac12)$. The structure factor $F_{110}$ is',
      options: ['$f_{Sr} - f_{Ti} - f_O$', '$f_{Sr} - f_{Ti} + 3f_O$', '$f_{Sr} + f_{Ti} + 3f_O$', '$f_{Sr} + f_{Ti} - f_O$'], answer: 3,
      sol: 'Phases $e^{2\\pi i(x + y)}$ for $(110)$: Sr $e^0 = 1$; Ti $e^{2\\pi i} = 1$; O at $(\\tfrac12,\\tfrac12,0)$: $e^{2\\pi i} = 1$; O at $(\\tfrac12,0,\\tfrac12)$: $e^{i\\pi} = -1$; O at $(0,\\tfrac12,\\tfrac12)$: $e^{i\\pi} = -1$. Sum: $f_{Sr} + f_{Ti} + f_O - 2f_O = f_{Sr} + f_{Ti} - f_O$.',
      trap: 'The other options are $F_{100}$, $F_{111}$ and $F_{200}$ in turn: each oxygen must be phased separately.' },
    { id: 'sf-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'scattering vector', unit: 'Å⁻¹',
      q: 'X-rays of wavelength $1.54$ Å are scattered elastically through $2\\theta = 90^\\circ$. The magnitude of the scattering vector is ______ Å$^{-1}$ (to two decimal places).',
      answer: 5.77, tol: 0.01, calc: () => 4 * PI * Math.sin(45 * D) / 1.54,
      sol: '$q = 4\\pi\\sin\\theta/\\lambda = 12.566\\times\\sin45^\\circ/1.54 = 12.566\\times0.7071/1.54 = 5.77$ Å$^{-1}$. A Bragg peak there would mean a reciprocal vector of this length, i.e. $d = 2\\pi/q = 1.089$ Å.',
      trap: 'Putting $\\sin90^\\circ$ (the full scattering angle) into the formula gives 8.16 Å$^{-1}$.' },
    { id: 'sf-024', type: 'msq', level: 3, exams: ['gate', 'net'], sub: '1D basis', format: 'multi',
      q: 'A 1D crystal of period $a$ has atom A at $x = 0$ and atom B at $x = a/2$ in each cell. Which statements about its reflections $h$ (with $G = 2\\pi h/a$) are correct?',
      options: ['Odd $h$ have $|F_h| = |f_A - f_B|$.', 'If $f_A = f_B$, odd $h$ vanish, because the true period is then $a/2$.', 'Even $h$ have intensity proportional to $f_A^2 + f_B^2$.', 'The positions of the peaks depend on the ratio $f_A/f_B$.'], answer: [0, 1],
      sol: '$F_h = f_A + f_B e^{i\\pi h} = f_A + (-1)^h f_B$. Odd: $f_A - f_B$; even: $f_A + f_B$, so the even intensity is $(f_A + f_B)^2$, not $f_A^2 + f_B^2$. If the atoms are identical, the chain repeats every $a/2$ and its reciprocal lattice has spacing $4\\pi/a$: the odd $h$ were never true reciprocal vectors. Peak positions come from the lattice only; the basis sets their heights.',
      trap: 'Adding intensities ($f_A^2 + f_B^2$) instead of amplitudes: the atoms scatter coherently.' },
    { id: 'sf-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'powder intensities',
      q: 'For an unpolarised X-ray beam, the polarisation factor of a reflection is $(1 + \\cos^2 2\\theta)/2$. Its value at a scattering angle $2\\theta = 60^\\circ$ is ______ (to three decimal places).',
      answer: 0.625, tol: 0.002, calc: () => (1 + Math.cos(60 * D) ** 2) / 2,
      sol: 'The incident field splits into a component perpendicular to the scattering plane (scattered fully) and one in the plane (scattered with factor $\\cos2\\theta$ in amplitude). Averaging the intensities: $(1 + \\cos^2 2\\theta)/2 = (1 + 0.25)/2 = 0.625$. At $2\\theta = 90^\\circ$ the factor falls to 0.5.',
      trap: 'Using $\\theta$ instead of $2\\theta$: the scattering angle between the beams is $2\\theta$.' },
    { id: 'sf-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'electron diffraction',
      q: 'In a transmission electron microscope at 200 kV ($\\lambda \\approx 0.025$ Å), a thin single crystal shows a whole grid of diffraction spots at once, without being rotated. The main reason is that',
      options: ['electrons are scattered more weakly than X-rays', 'the Ewald sphere is then so large that near the origin it is almost a plane, cutting a whole layer of reciprocal lattice points', 'electrons have no wave properties at that energy', 'the crystal contains many grains in every orientation'], answer: 1,
      sol: 'The Ewald radius $2\\pi/\\lambda \\approx 250$ Å$^{-1}$ is about a hundred times the reciprocal lattice spacing ($\\sim 2$ Å$^{-1}$), so near the origin the sphere is nearly flat. A thin specimen also stretches each reciprocal point into a rod along the beam. Together they let the flat sphere cross a whole plane of points: the spot pattern is a picture of a reciprocal-lattice section.',
      trap: 'Electrons actually scatter far more strongly than X-rays (which is why samples must be thin).' },
    { id: 'sf-027', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'magnetic scattering',
      q: 'A crystal orders antiferromagnetically so that the magnetic cell is twice the chemical cell along each axis. Below the Néel temperature its neutron diffraction pattern shows',
      options: ['no change, because neutrons do not see magnetic moments', 'only a uniform rise in background', 'a shift of all nuclear peaks to lower angles', 'extra peaks at positions that are half-integer in the chemical-cell indices'], answer: 3,
      sol: 'Doubling the real-space period halves the reciprocal-lattice spacing for the magnetic scattering, so new reciprocal points appear half way between the chemical ones: peaks at $(\\tfrac12\\tfrac12\\tfrac12)$ and similar in chemical units (as in MnO). X-rays, which barely see spin, show no such peaks. Their intensity grows as the sublattice magnetisation squared below $T_N$.',
      trap: 'Ferromagnetic order (same period) adds intensity on top of existing peaks; antiferromagnetic order adds new peaks.' },
    { id: 'sf-028', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'powder intensities',
      q: 'A bcc metal has form factors $f = 20$ at the $(110)$ line and $f = 17$ at the $(200)$ line. Ignoring Lorentz-polarisation and thermal factors, the intensity ratio $I_{110}/I_{200} = p_{110}|F_{110}|^2/(p_{200}|F_{200}|^2)$ is ______ (to two decimal places).',
      answer: 2.77, tol: 0.01, calc: () => (12 * 40 ** 2) / (6 * 34 ** 2),
      sol: 'bcc allowed lines have $F = 2f$: $F_{110} = 40$, $F_{200} = 34$. Multiplicities in a cubic crystal: $\\{110\\}$ has 12 members, $\\{200\\}$ has 6. Ratio $= \\dfrac{12\\times1600}{6\\times1156} = \\dfrac{19200}{6936} = 2.77$.',
      trap: 'Leaving out the multiplicities gives 1.38; using $p = 6$ for both is the same slip.' },
    { id: 'sf-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'form factor',
      q: 'The electron density of a hydrogen atom in its ground state is $\\rho(r) = e^{-2r/a_0}/(\\pi a_0^3)$, which gives the form factor $f(q) = [1 + (qa_0/2)^2]^{-2}$. The value of $f$ at $q = 2/a_0$ is ______ (to two decimal places).',
      answer: 0.25, tol: 0.005, calc: () => 1 / (1 + 1) ** 2,
      sol: '$qa_0/2 = 1$, so $f = (1 + 1)^{-2} = 1/4 = 0.25$. Check the limits: $f(0) = 1$ (one electron) and $f \\to 16/(qa_0)^4 \\to 0$ at large $q$, because the cloud of size $a_0$ cannot scatter in phase when $q \\gg 1/a_0$.',
      trap: 'Forgetting the square: $[1 + 1]^{-1} = 0.5$.' },
    { id: 'sf-030', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'systematic absences', format: 'multi',
      q: 'Systematic absences (reflections that vanish by symmetry for every choice of atoms) in a single-crystal pattern reveal',
      options: ['the centring of the Bravais lattice (P, I, F, C)', 'the presence of screw axes and glide planes', 'which chemical elements are in the crystal', 'the absolute size of the atoms'], answer: [0, 1],
      sol: 'Centring adds a translation that cancels whole classes of $(hkl)$ (e.g. I: $h + k + l$ odd). Screw axes and glide planes, which combine a rotation or reflection with a fractional translation, cancel reflections on particular lines or planes of reciprocal space. Absences depend only on symmetry, so they cannot identify elements or atom sizes; those come from the measured intensities.',
      trap: 'Weak reflections caused by similar form factors (KCl) are not systematic absences.' },
    { id: 'sf-031', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Laue equations', unit: 'degree',
      q: 'In a LEED experiment, electrons of wavelength $1.0$ Å fall normally on a crystal surface whose atoms form a square net of side $3.5$ Å. The $(10)$ diffracted beam leaves at an angle from the surface normal of ______ degrees (to one decimal place).',
      answer: 16.6, tol: 0.1, calc: () => Math.asin(1 / 3.5) / D,
      sol: 'Low-energy electrons probe only the top layers, so only the two in-plane Laue conditions apply: $a\\sin\\phi = h\\lambda$ for normal incidence. $\\sin\\phi = 1.0/3.5 = 0.2857$, $\\phi = 16.6^\\circ$. With no third condition, beams exist at any wavelength (shorter than $a$); they just move closer to the normal as $\\lambda$ falls.',
      trap: 'Applying Bragg\'s law $2d\\sin\\theta = \\lambda$ as if for planes parallel to the surface.' },
    { id: 'sf-047', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Laue equations', format: 'multi',
      q: 'Which statements about the three Laue equations $\\vec a_i\\cdot\\Delta\\vec k = 2\\pi h_i$ are correct?',
      options: ['Together they are equivalent to $\\Delta\\vec k = h_1\\vec b_1 + h_2\\vec b_2 + h_3\\vec b_3$.', 'Each one alone confines the diffracted direction to a cone about the axis $\\vec a_i$.', 'For a 3D crystal, a monochromatic beam in a general direction satisfies all three.', 'They apply only when the incident beam is along a crystal axis.'], answer: [0, 1],
      sol: 'Writing $\\Delta\\vec k$ in the reciprocal basis, $\\vec a_i\\cdot\\Delta\\vec k = 2\\pi h_i$ fixes its components: $\\Delta\\vec k = \\vec G$. One equation fixes the angle between $\\vec k\\,\'$ and $\\vec a_i$: a cone. Three cones (with $|\\vec k\\,\'| = |\\vec k|$) meet only for special directions or wavelengths, so a general monochromatic beam gives nothing. The beam direction is arbitrary.',
      trap: 'Statement 3 is why a fixed crystal must be rotated (or white X-rays used).' },

    // ---------- level 4 ----------
    { id: 'sf-032', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'systematic absences',
      q: 'A crystal has a $2_1$ screw axis along $c$ (rotate by $180^\\circ$ about $c$, then translate by $c/2$) and no other symmetry causing absences. The systematic absences are',
      options: ['all $(hkl)$ with $l$ odd', '$(h00)$ with $h$ odd', 'all $(hkl)$ with $h + k + l$ odd', '$(00l)$ with $l$ odd'], answer: 3,
      sol: 'Each atom at $(x, y, z)$ has a partner at $(-x, -y, z + \\tfrac12)$. For $(00l)$ the phase depends only on $z$: $F_{00l} = \\sum f[e^{2\\pi ilz} + e^{2\\pi il(z + 1/2)}] = \\sum f e^{2\\pi ilz}[1 + (-1)^l]$, zero for odd $l$. For general $(hkl)$ the $x, y$ phases differ between partners and nothing cancels. Projected on the $c$ axis, the structure repeats every $c/2$.',
      trap: 'A screw axis gives absences only along one row of reciprocal space; a whole class like $h + k + l$ odd needs a centring.' },
    { id: 'sf-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Debye-Waller',
      q: 'Above the Debye temperature $\\langle u^2\\rangle \\propto T$. A crystal has $\\langle u^2\\rangle = 0.006$ Å$^2$ (three directions together) at 300 K. Using $I \\propto \\exp(-G^2\\langle u^2\\rangle/3)$, the ratio $I(600\\text{ K})/I(300\\text{ K})$ for the reflection from planes of spacing $0.80$ Å is ______ (to three decimal places).',
      answer: 0.884, tol: 0.003, calc: () => Math.exp(-((2 * PI / 0.8) ** 2) * 0.006 / 3),
      sol: 'At 600 K $\\langle u^2\\rangle = 0.012$ Å$^2$, an increase of 0.006 Å$^2$. $G = 2\\pi/0.80 = 7.854$ Å$^{-1}$, $G^2 = 61.69$ Å$^{-2}$. Ratio $= \\exp(-61.69\\times0.006/3) = e^{-0.1234} = 0.884$. High-angle (large $G$) lines fade fastest with temperature.',
      trap: 'Using $e^{-G^2\\langle u^2\\rangle/3}$ at 600 K alone gives the ratio to the static lattice (0.782), not to 300 K.' },
    { id: 'sf-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'structure factor',
      q: 'If the origin of the unit cell is moved so that every atom\'s fractional position changes by $-(x_0, y_0, z_0)$, the structure factor becomes',
      options: ['$F_{hkl}\\,e^{-2\\pi i(hx_0 + ky_0 + lz_0)}$', '$F_{hkl}$, unchanged in phase and magnitude', '$F_{hkl} + (x_0 + y_0 + z_0)$', '$|F_{hkl}|\\,e^{2\\pi i(x_0 + y_0 + z_0)}$, with the indices dropped'], answer: 0,
      sol: '$F\' = \\sum_j f_j e^{2\\pi i[h(x_j - x_0) + k(y_j - y_0) + l(z_j - z_0)]} = F\\,e^{-2\\pi i(hx_0 + ky_0 + lz_0)}$. The magnitude, and so every intensity, is unchanged; only the phases depend on the arbitrary origin. This is why a centrosymmetric structure is usually described with the origin on an inversion centre, where all $F$ are real.',
      trap: 'Thinking the change is "nothing": the phases do change, which matters when rebuilding the density.' },
    { id: 'sf-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'ordered alloys',
      q: 'In a CsCl-type alloy AB the long-range order parameter $S$ is defined so that the corner sites hold A with probability $(1 + S)/2$ and the body-centre sites hold A with probability $(1 - S)/2$. The superlattice intensity of a partly ordered sample is $25\\%$ of that of the fully ordered alloy. Then $S$ is ______ (to two decimal places).',
      answer: 0.5, tol: 0.01, calc: () => Math.sqrt(0.25),
      sol: 'Average form factors: corner $\\bar f_1 = \\tfrac{1+S}2f_A + \\tfrac{1-S}2f_B$, centre $\\bar f_2 = \\tfrac{1-S}2f_A + \\tfrac{1+S}2f_B$. A superlattice line ($h + k + l$ odd) has $F = \\bar f_1 - \\bar f_2 = S(f_A - f_B)$, so its intensity goes as $S^2$. $S^2 = 0.25$ gives $S = 0.50$.',
      trap: 'Taking the intensity proportional to $S$ gives 0.25.' },
    { id: 'sf-036', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'hcp', format: 'multi',
      q: 'For hcp metal of identical atoms (atoms at $(0,0,0)$ and $(\\tfrac13,\\tfrac23,\\tfrac12)$), which of these reflections are absent?',
      options: ['$(001)$', '$(002)$', '$(111)$', '$(110)$'], answer: [0, 2],
      sol: 'Absent when $h + 2k$ is a multiple of 3 <em>and</em> $l$ is odd. $(001)$: $0$, odd: absent. $(002)$: $l$ even: present ($4f^2$). $(111)$: $h + 2k = 3$, $l = 1$: phase $2\\pi(1 + \\tfrac12)$, absent. $(110)$: $h + 2k = 3$ but $l = 0$: phase $2\\pi$, present with $4f^2$.',
      trap: 'Checking only $l$ odd (that would wrongly remove $(101)$ too) or only $h + 2k = 3n$.' },
    { id: 'sf-037', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'hcp',
      q: 'For hcp of identical atoms with $f$ taken the same for both lines, the ratio $|F_{002}|^2/|F_{101}|^2$ is ______ (to two decimal places).',
      answer: 1.33, tol: 0.01, calc: () => hcpF2(0, 0, 2) / hcpF2(1, 0, 1),
      sol: '$|F|^2/f^2 = 2 + 2\\cos[2\\pi((h + 2k)/3 + l/2)]$. $(002)$: phase $2\\pi$, $|F|^2 = 4f^2$. $(101)$: phase $5\\pi/3$, $|F|^2 = 3f^2$. Ratio $= 4/3 = 1.33$.',
      trap: 'Thinking all allowed hcp reflections have $|F|^2 = 4f^2$: those with $h + 2k \\ne 3n$ have $f^2$ or $3f^2$.' },
    { id: 'sf-038', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'finite crystals', format: 'multi',
      q: 'A crystallite has $N$ reflecting planes along the diffraction direction. Which statements about one of its Bragg peaks are correct?',
      options: ['The peak height grows as $N^2$.', 'The angular width falls as $1/N$.', 'The integrated intensity grows as $N$.', 'The peak position moves as $1/N$.'], answer: [0, 1, 2],
      sol: 'The sum of $N$ phasors gives $I \\propto \\sin^2(N\\phi/2)/\\sin^2(\\phi/2)$: at the peak $N^2$, with width in $\\phi$ (and so in angle) $\\propto 1/N$. Height times width $\\propto N$, the number of scatterers, as energy conservation needs. The peak stays at the Bragg angle; the Scherrer formula uses the width, not a shift.',
      trap: 'Peak height $\\propto N^2$ does not mean a big crystal scatters $N^2$ times more energy; the narrowing compensates.' },
    { id: 'sf-039', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Laue vs Bragg',
      q: 'In a simple cubic crystal, the reflection labelled $220$ in the Laue description ($\\Delta\\vec k = \\vec G_{220}$) corresponds in Bragg\'s description to',
      options: ['a reflection that is forbidden in simple cubic', 'first order from the $(110)$ planes', 'second order from the $(110)$ planes, or equally first order from imaginary planes of spacing $d_{110}/2$', 'fourth order from the $(110)$ planes'], answer: 2,
      sol: '$\\vec G_{220} = 2\\vec G_{110}$. In Bragg\'s law $2d\\sin\\theta = n\\lambda$ this is $n = 2$ with $d = d_{110} = a/\\sqrt2$, or $n = 1$ with $d = a/\\sqrt8$, planes that need not all contain atoms. Laue indices $(hkl)$ with a common factor $n$ simply absorb the order.',
      trap: 'Treating $(220)$ as a separate set of real lattice planes with its own physical meaning.' },
    { id: 'sf-041', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'perovskite',
      q: 'For cubic perovskite SrTiO$_3$ (Sr at $(0,0,0)$, Ti at $(\\tfrac12,\\tfrac12,\\tfrac12)$, O at the face centres), take forward values $f_{Sr} = 36$, $f_{Ti} = 18$, $f_O = 10$. The magnitude $|F_{100}|$ is ______.',
      answer: 8, tol: 0, calc: () => Math.abs(36 - 18 - 10),
      sol: 'Phases $e^{2\\pi ix}$ for $(100)$: Sr $1$; Ti $e^{i\\pi} = -1$; O at $(\\tfrac12,\\tfrac12,0)$ and $(\\tfrac12,0,\\tfrac12)$: $-1$ each; O at $(0,\\tfrac12,\\tfrac12)$: $+1$. $F = 36 - 18 - 10 - 10 + 10 = 8$.',
      trap: 'Giving every O the same phase. Two of the three oxygens lie on a $(100)$ mid-plane, one does not.' },

    // ---------- level 5 ----------
    { id: 'sf-040', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'diamond',
      q: 'For silicon (diamond structure) the $(222)$ reflection is "forbidden" in the simple model, yet a weak $(222)$ peak is measured. The main physical reason is that',
      options: ['the X-ray wavelength is too short for the model', 'the covalent bonding charge piles up between atoms, so the atoms are not identical spherical scatterers', 'silicon is really simple cubic', 'the Debye-Waller factor makes forbidden reflections allowed'], answer: 1,
      sol: 'The rule $F_{222} = 4f(1 + e^{3\\pi i}) = 0$ assumes each atom is a spherical scatterer identical to its partner. In Si the bond charge sits along the tetrahedral bonds, giving an aspherical, antisymmetric part of the density that does not cancel for $(222)$. Its weak intensity is a direct measurement of the bond charge (multiple, or Renninger, scattering can also feed it and is checked by rotating about the scattering vector).',
      trap: 'Thermal motion only multiplies $F$ by a factor; it cannot turn an exact zero into a non-zero value (anharmonic terms aside).' },
    { id: 'sf-042', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'anomalous scattering', format: 'multi',
      q: 'Near an absorption edge the form factor becomes complex, $f = f_0 + f\' + if\'\'$. Which statements are correct?',
      options: ['Friedel\'s law can then fail: $|F_{hkl}| \\ne |F_{\\bar h\\bar k\\bar l}|$ in a non-centrosymmetric crystal.', 'The difference between Friedel pairs can fix the absolute structure (handedness) of a chiral crystal.', '$|F_{hkl}| = |F_{\\bar h\\bar k\\bar l}|$ still holds exactly for every crystal.', 'Measuring at several wavelengths near the edge helps solve the phase problem (MAD phasing).'], answer: [0, 1, 3],
      sol: 'With complex $f_j$, $F_{\\bar h\\bar k\\bar l} \\ne F_{hkl}^*$, because conjugating the sum would also conjugate the $if\'\'$ term. In a crystal without an inversion centre the Friedel intensities then differ (Bijvoet differences), which distinguishes a structure from its mirror image. Varying $\\lambda$ across the edge changes $f\'$ and $f\'\'$ of known atoms in a controlled way, giving the phase information used in MAD (multi-wavelength anomalous diffraction).',
      trap: 'In a centrosymmetric crystal Friedel pairs stay equal even with anomalous scattering.' },
    { id: 'sf-043', type: 'nat', level: 5, exams: ['gate', 'net'], sub: '1D basis',
      q: 'A 1D crystal of period $a$ has atom A ($f_A = 2$) at $x = 0$ and atom B ($f_B = 1$) at $x = a/4$. Ignoring the fall of $f$ with angle, the ratio $|F_2|^2/|F_1|^2$ of the second to the first reflection is ______ (to two decimal places).',
      answer: 0.2, tol: 0.005, calc: () => (4 + 1 + 4 * Math.cos(PI)) / (4 + 1 + 4 * Math.cos(PI / 2)),
      sol: '$|F_h|^2 = f_A^2 + f_B^2 + 2f_Af_B\\cos(2\\pi h\\cdot\\tfrac14)$. $h = 1$: $4 + 1 + 4\\cos90^\\circ = 5$. $h = 2$: $4 + 1 + 4\\cos180^\\circ = 1$. Ratio $= 0.20$.',
      trap: 'Using $\\cos(\\pi h x/a)$ (missing the factor 2 in the phase) swaps which order is weak.' },
    { id: 'sf-044', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'magnetic scattering', unit: 'degree',
      q: 'A bcc metal with $a = 2.88$ Å orders antiferromagnetically: the moment at the body centre points opposite to the moments at the corners. Neutrons of wavelength $1.20$ Å are used. The lowest-angle purely magnetic peak appears at a scattering angle $2\\theta$ of ______ degrees (to one decimal place).',
      answer: 24.0, tol: 0.1, calc: () => 2 * Math.asin(1.2 / (2 * 2.88)) / D,
      sol: 'For nuclear scattering the two sites are identical: bcc, only $h + k + l$ even. For magnetic scattering the corner and centre moments are opposite, so the magnetic structure factor is $\\propto 1 - (-1)^{h+k+l}$: only $h + k + l$ odd, exactly the reflections the nuclear pattern lacks. The first is $(100)$ with $d = a = 2.88$ Å: $\\sin\\theta = 1.20/5.76 = 0.2083$, $\\theta = 12.02^\\circ$, $2\\theta = 24.0^\\circ$.',
      trap: 'Choosing $(110)$, the first nuclear peak (at $2\\theta = 34.3^\\circ$).' },
    { id: 'sf-045', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'Fourier synthesis',
      q: 'A centrosymmetric 1D crystal of period $a$ has real structure factors $F_0 = 10$, $F_{\\pm1} = -3$, $F_{\\pm2} = 2$ and all others negligible. Using $\\rho(x) = \\tfrac1a\\sum_h F_h e^{-2\\pi ihx/a}$, the value of $a\\,\\rho$ at $x = a/2$ is ______.',
      answer: 20, tol: 0, calc: () => 10 + 2 * (-3 * Math.cos(PI) + 2 * Math.cos(2 * PI)),
      sol: 'Pairing $\\pm h$: $a\\rho(x) = F_0 + 2\\sum_{h>0}F_h\\cos(2\\pi hx/a)$. At $x = a/2$: $\\cos\\pi = -1$, $\\cos2\\pi = 1$, so $a\\rho = 10 + 2(3 + 2) = 20$. At $x = 0$ it is $10 + 2(-3 + 2) = 8$. The atom sits at the cell centre; the signs (phases) of $F$ decide where, which intensities alone could not tell.',
      trap: 'Forgetting the factor 2 from the $\\pm h$ pairs gives 15.' },
    ...more2,
  ],

  gens: [
    { id: 'sf-g01', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'structure factor',
      make(r) {
        const name = choose(r, Object.keys(STR)), st = STR[name];
        const pool = [[1, 1, 1], [2, 0, 0], [2, 2, 0], [3, 1, 1], [2, 2, 2], [4, 0, 0], [1, 0, 0], [1, 1, 0]];
        const t = choose(r, name.startsWith('caes') || name.startsWith('Cu') ? pool : pool.slice(0, 6));
        const fA = int(r, 10, 60), fB = int(r, 6, 40);
        const v = F2(st, t, fA, fB), [re, im] = Fof(st, t, fA, fB);
        return { q: `A crystal has the ${name} structure. Taking form factors $f_A = ${fA}$ (${st.A}) and $f_B = ${fB}$ (${st.B}) at this angle, $|F_{${t.join('')}}|^2$ is ______.`,
          answer: round(v, 0), tol: 0, name, t, fA, fB,
          sol: `$F = \\sum_j f_j e^{2\\pi i(hx_j + ky_j + lz_j)}$ over the ${st.sites.length} atoms of the conventional cell: ${st.sites.map(([s, p]) => `${s} at $(${p.map((x) => +x.toFixed(2)).join(',')})$`).join(', ')}. For $${hkl(t)}$ this gives $F = ${round(re, 2)}${Math.abs(im) > 1e-9 ? ` ${im < 0 ? '-' : '+'} ${round(Math.abs(im), 2)}i` : ''}$, so $|F|^2 = ${round(v, 0)}$.`,
          trap: 'Adding intensities of the atoms instead of their amplitudes with phases, or dropping the factor from the fcc translations.' };
      },
      verify: (p) => F2(STR[p.name], p.t, p.fA, p.fB) },
    { id: 'sf-g02', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'hcp',
      make(r) {
        const absent = [[0, 0, 1], [0, 0, 3], [1, 1, 1], [1, 1, 3], [0, 0, 5], [3, 0, 1], [2, 2, 1], [1, 1, 5]];
        const present = [[1, 0, 0], [0, 0, 2], [1, 0, 1], [1, 1, 0], [1, 0, 2], [1, 0, 3], [2, 0, 1], [1, 1, 2], [2, 0, 0], [0, 0, 4], [2, 1, 1], [1, 0, 5]];
        const right = choose(r, absent), wr = shuffle(r, present).slice(0, 3);
        const o = mcqOptions(r, hkl(right), wr.map(hkl), (s) => `$${s}$`);
        return { q: 'For an hcp crystal of identical atoms (at $(0,0,0)$ and $(\\tfrac13,\\tfrac23,\\tfrac12)$ in the hexagonal cell), which of these reflections has zero structure factor?', ...o,
          sol: `$|F|^2 = f^2\\{2 + 2\\cos[2\\pi((h+2k)/3 + l/2)]\\}$, zero only when $h + 2k$ is a multiple of 3 and $l$ is odd. $${hkl(right)}$: $h + 2k = ${right[0] + 2 * right[1]}$, $l = ${right[2]}$: absent. The others: ${wr.map((t) => `$${hkl(t)}$ gives $${round(hcpF2(...t), 2)}f^2$`).join(', ')}.`,
          trap: 'Using the fcc or bcc rule; or checking $l$ odd alone.' };
      } },
    { id: 'sf-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'scattering vector',
      make(r) {
        const lam = choose(r, [0.71, 1.0, 1.2, 1.54, 1.79, 2.29]), G = pick(r, 1.2, 0.97 * 4 * PI / lam, 0.01);
        const th = Math.asin(G * lam / (4 * PI)) / D;
        return { q: `A reciprocal lattice vector has length $|\\vec G| = ${G}$ Å$^{-1}$. With radiation of wavelength $${lam}$ Å, the corresponding Bragg peak appears at a scattering angle $2\\theta$ of ______ degrees (to two decimal places).`,
          answer: round(2 * th, 2), tol: 0.03, unit: 'degree', G, lam,
          sol: `Elastic scattering needs $|\\Delta\\vec k| = 2k\\sin\\theta = \\dfrac{4\\pi\\sin\\theta}{\\lambda} = |\\vec G|$. So $\\sin\\theta = \\dfrac{${G}\\times${lam}}{4\\pi} = ${round(G * lam / (4 * PI), 4)}$, $\\theta = ${round(th, 3)}^\\circ$ and $2\\theta = ${round(2 * th, 2)}^\\circ$.`,
          trap: 'Using $2\\pi\\sin\\theta/\\lambda$ (forgetting $|\\vec k\\,\' - \\vec k| = 2k\\sin\\theta$), or reporting $\\theta$.' };
      },
      verify: (p) => 2 * Math.asin(p.G * p.lam / (4 * Math.PI)) * 180 / Math.PI },
    { id: 'sf-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Debye-Waller',
      make(r) {
        const u2 = pick(r, 0.004, 0.03, 0.001), d = pick(r, 0.7, 2.5, 0.05), G = 2 * PI / d, x = G * G * u2 / 3;
        return { q: `The atoms of a crystal have mean-square displacement $\\langle u^2\\rangle = ${u2}$ Å$^2$ (all directions together). Using $I = I_0e^{-G^2\\langle u^2\\rangle/3}$, the fraction of the static intensity left in the reflection from planes of spacing $${d}$ Å is ______ (to three decimal places).`,
          answer: round(Math.exp(-x), 3), tol: 0.002, u2, d,
          sol: `$G = 2\\pi/d = ${round(G, 4)}$ Å$^{-1}$, so $G^2\\langle u^2\\rangle/3 = ${round(G * G, 3)}\\times${u2}/3 = ${round(x, 4)}$ and $I/I_0 = e^{-${round(x, 4)}} = ${round(Math.exp(-x), 3)}$.`,
          trap: 'Leaving out the 1/3, which belongs with the three-direction $\\langle u^2\\rangle$.' };
      },
      verify: (p) => Math.exp(-((2 * Math.PI / p.d) ** 2) * p.u2 / 3) },
    { id: 'sf-g05', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'powder intensities',
      make(r) {
        const t = choose(r, [[1, 0, 0], [1, 1, 0], [1, 1, 1], [2, 1, 0], [2, 1, 1], [2, 2, 1], [3, 1, 0], [3, 2, 1], [2, 2, 0], [3, 1, 1], [4, 2, 1], [3, 3, 1]]);
        const p = mult(t);
        return { q: `In the powder pattern of a cubic crystal, the multiplicity factor of the $\\{${t.join('')}\\}$ reflection (the number of planes $(hkl)$ of this form, counting $(hkl)$ and $(\\bar h\\bar k\\bar l)$ separately) is ______.`,
          answer: p, tol: 0, t,
          sol: `Count the distinct sign changes and permutations of $(${t.join(',')})$: ${t.filter((x) => x !== 0).length} non-zero indices give $2^{${t.filter((x) => x !== 0).length}}$ sign choices, and the permutations of ${new Set(t).size === 3 ? 'three different numbers give 6' : new Set(t).size === 2 ? 'two equal numbers and one different give 3' : 'three equal numbers give 1'}. Total $p = ${p}$.`,
          trap: 'Forgetting the negative-index planes (halving $p$), or permuting zeros among themselves.' };
      },
      verify: (p) => mult(p.t) },
    { id: 'sf-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'ordered alloys',
      make(r) {
        const A = choose(r, [['Au', 'Cu'], ['Pt', 'Fe'], ['Pt', 'Ni'], ['Al', 'Ni']]), fA = int(r, 20, 75), fB = int(r, 10, fA - 6);
        const ratio = (fA - fB) ** 2 / (fA + 3 * fB) ** 2;
        return { q: `An ordered A$B_3$ alloy of the Cu$_3$Au type has ${A[0]} (A) at the cube corners and ${A[1]} (B) at the face centres. With $f_A = ${fA}$ and $f_B = ${fB}$ taken equal at both angles, the ratio of the superlattice to the fundamental structure-factor intensity, $|F_{110}|^2/|F_{200}|^2$, is ______ (to four decimal places).`,
          answer: round(ratio, 4), tol: 0.0005, fA, fB,
          sol: `Mixed indices such as $(110)$: of the three face centres, one has phase $+1$ and two have $-1$, so $F = f_A + f_B - 2f_B = f_A - f_B = ${fA - fB}$. Unmixed $(200)$: all phases $+1$, $F = f_A + 3f_B = ${fA + 3 * fB}$. Ratio $= ${(fA - fB) ** 2}/${(fA + 3 * fB) ** 2} = ${round(ratio, 4)}$.`,
          trap: 'Treating $(110)$ as absent, as in fcc; it is absent only when the sites are disordered.' };
      },
      verify: (p) => (p.fA - p.fB) ** 2 / (p.fA + 3 * p.fB) ** 2 },
    { id: 'sf-g07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'magnetic scattering',
      make(r) {
        const kind = choose(r, ['fcc', 'bcc']);
        const a = kind === 'fcc' ? pick(r, 4.1, 5.2, 0.01) : pick(r, 2.8, 3.4, 0.01), lam = choose(r, [1.0, 1.2, 1.5, 2.0, 2.4]);
        const d = kind === 'fcc' ? 2 * a / Math.sqrt(3) : a;
        const tt = 2 * Math.asin(lam / (2 * d)) / D;
        const desc = kind === 'fcc' ? `The magnetic ions form an fcc lattice with $a = ${a}$ Å and order antiferromagnetically in ferromagnetic $(111)$ sheets that alternate in direction (the MnO type), so the magnetic cell has edge $2a$.` : `The magnetic ions form a bcc lattice with $a = ${a}$ Å; the body-centre moment points opposite to the corner moments.`;
        return { q: `${desc} With neutrons of wavelength $${lam}$ Å, the first purely magnetic peak appears at a scattering angle $2\\theta$ of ______ degrees (to two decimal places).`,
          answer: round(tt, 2), tol: 0.03, unit: 'degree', lam, d,
          sol: kind === 'fcc' ? `In the magnetic cell (edge $2a$) the first magnetic reflection is $(111)_m$, i.e. $(\\tfrac12\\tfrac12\\tfrac12)$ in chemical units: $d = 2a/\\sqrt3 = ${round(d, 4)}$ Å. $\\sin\\theta = \\lambda/2d = ${round(lam / (2 * d), 4)}$, so $2\\theta = ${round(tt, 2)}^\\circ$.` : `The magnetic structure factor is $\\propto 1 - (-1)^{h+k+l}$, non-zero only for $h + k + l$ odd (forbidden for the nuclear bcc pattern). The first is $(100)$ with $d = a = ${a}$ Å: $\\sin\\theta = ${round(lam / (2 * d), 4)}$, $2\\theta = ${round(tt, 2)}^\\circ$.`,
          trap: 'Picking the first nuclear peak, or forgetting that the magnetic cell is larger than the chemical one.' };
      },
      verify: (p) => 2 * Math.asin(p.lam / (2 * p.d)) * 180 / Math.PI },
    { id: 'sf-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: '1D basis',
      make(r) {
        const fA = int(r, 2, 12), fB = int(r, 1, 10), x = choose(r, [0.1, 0.2, 0.25, 0.3, 0.4, 1 / 3]), h = int(r, 1, 4);
        const xs = Math.abs(x - 1 / 3) < 1e-9 ? '1/3' : String(x);
        const v = fA * fA + fB * fB + 2 * fA * fB * Math.cos(2 * PI * h * x);
        return { q: `A 1D crystal of period $a$ has atom A ($f_A = ${fA}$) at $x = 0$ and atom B ($f_B = ${fB}$) at $x = ${xs}\\,a$. Taking $f$ constant, $|F_{${h}}|^2$ for the reflection with $G = 2\\pi\\cdot${h}/a$ is ______ (to two decimal places).`,
          answer: round(v, 2), tol: 0.02, fA, fB, x, h,
          sol: `$F_h = f_A + f_Be^{2\\pi ihx/a}$, so $|F_h|^2 = f_A^2 + f_B^2 + 2f_Af_B\\cos(2\\pi hx/a) = ${fA * fA} + ${fB * fB} + ${2 * fA * fB}\\cos(${round(360 * h * x, 2)}^\\circ) = ${round(v, 2)}$.`,
          trap: 'Adding $f_A^2 + f_B^2$ (intensities) without the interference term.' };
      },
      verify: (p) => p.fA ** 2 + p.fB ** 2 + 2 * p.fA * p.fB * Math.cos(2 * Math.PI * p.h * p.x) },
    { id: 'sf-g09', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'systematic absences', format: 'multi',
      make(r) {
        const cases = [[[0.5, 0.5, 0], 'h + k', 'C (base-centred on the $ab$ faces)'], [[0.5, 0, 0.5], 'h + l', 'B (centred on the $ac$ faces)'], [[0, 0.5, 0.5], 'k + l', 'A (centred on the $bc$ faces)'], [[0.5, 0.5, 0.5], 'h + k + l', 'I (body-centred)']];
        const [s, rule, name] = choose(r, cases);
        const absent = (t) => Math.round(2 * (t[0] * s[0] + t[1] * s[1] + t[2] * s[2])) % 2 === 1;
        const pool = [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 0], [1, 0, 1], [0, 1, 1], [1, 1, 1], [2, 1, 0], [2, 0, 1], [1, 2, 1], [1, 1, 2], [2, 1, 1], [3, 1, 0], [0, 2, 1]];
        const ab = pool.filter(absent), pr = pool.filter((t) => !absent(t));
        const four = shuffle(r, [choose(r, ab), ...shuffle(r, [...ab, ...pr]).slice(0, 6)].filter((t, i, arr) => arr.indexOf(t) === i).slice(0, 4));
        const answer = four.map((t, i) => (absent(t) ? i : -1)).filter((i) => i >= 0);
        return { q: `An orthorhombic crystal has identical atoms at $(0,0,0)$ and $(${s.join(', ')})$ in each conventional cell and nothing else. Which of these reflections have zero structure factor?`,
          options: four.map((t) => `$${hkl(t)}$`), answer,
          sol: `$F = f[1 + e^{i\\pi(${rule})}]$, zero when $${rule}$ is odd: this is the ${name} lattice. ${four.map((t) => `$${hkl(t)}$: ${absent(t) ? 'odd, absent' : 'even, present'}`).join('; ')}.`,
          trap: 'Applying the body-centred rule $h + k + l$ to a base-centred cell (or the reverse).' };
      } },
    { id: 'sf-g10', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'powder intensities',
      make(r) {
        const key = choose(r, ['bcc', 'fcc']);
        const lines = key === 'bcc' ? [[[1, 1, 0], 12], [[2, 0, 0], 6], [[2, 1, 1], 24], [[2, 2, 0], 12]] : [[[1, 1, 1], 8], [[2, 0, 0], 6], [[2, 2, 0], 12], [[3, 1, 1], 24]];
        const i = int(r, 0, 2), L1 = lines[i], L2 = lines[i + 1], n = key === 'bcc' ? 2 : 4;
        const f1 = int(r, 18, 40), f2 = f1 - int(r, 1, 6);
        const ratio = L1[1] * (n * f1) ** 2 / (L2[1] * (n * f2) ** 2);
        return { q: `A ${key === 'bcc' ? 'body' : 'face'}-centred cubic metal has $f = ${f1}$ at the $(${L1[0].join('')})$ line and $f = ${f2}$ at the $(${L2[0].join('')})$ line. Ignoring Lorentz-polarisation, absorption and thermal factors, the powder intensity ratio $I_{${L1[0].join('')}}/I_{${L2[0].join('')}}$ is ______ (to two decimal places).`,
          answer: round(ratio, 2), tol: 0.01, p1: L1[1], p2: L2[1], f1, f2,
          sol: `Allowed ${key} lines have $F = ${n}f$. Multiplicities: $p_{${L1[0].join('')}} = ${L1[1]}$, $p_{${L2[0].join('')}} = ${L2[1]}$. $I \\propto p|F|^2$: ratio $= \\dfrac{${L1[1]}\\times${f1}^2}{${L2[1]}\\times${f2}^2} = ${round(ratio, 2)}$.`,
          trap: 'Leaving out the multiplicity factors.' };
      },
      verify: (p) => p.p1 * p.f1 ** 2 / (p.p2 * p.f2 ** 2) },
    { id: 'sf-g11', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Laue equations',
      make(r) {
        const kind = choose(r, ['row', 'leed']), a = pick(r, 2.5, 6.0, 0.1), lam = pick(r, 0.6, Math.min(2.0, 0.9 * a), 0.05), h = choose(r, [1, 1, 2]);
        const s = h * lam / a, ok = s < 1, hh = ok ? h : 1, ss = hh * lam / a;
        const ang = kind === 'row' ? Math.acos(ss) / D : Math.asin(ss) / D;
        return { q: kind === 'row' ? `A beam of wavelength $${lam}$ Å falls perpendicular to a row of identical atoms spaced $${a}$ Å apart. The order-${hh} diffracted beams lie on a cone whose half-angle, measured from the row, is ______ degrees (to one decimal place).` : `Electrons of wavelength $${lam}$ Å fall normally on a surface whose atoms form a square net of side $${a}$ Å. The $(${hh}0)$ LEED beam leaves at an angle from the surface normal of ______ degrees (to one decimal place).`,
          answer: round(ang, 1), tol: 0.15, unit: 'degree', kind, ss,
          sol: kind === 'row' ? `One Laue equation: $a(\\cos\\alpha - \\cos\\alpha_0) = h\\lambda$ with $\\alpha_0 = 90^\\circ$. $\\cos\\alpha = ${hh}\\times${lam}/${a} = ${round(ss, 4)}$, $\\alpha = ${round(ang, 1)}^\\circ$.` : `Only the two in-plane Laue conditions apply: $a\\sin\\phi = h\\lambda$. $\\sin\\phi = ${hh}\\times${lam}/${a} = ${round(ss, 4)}$, $\\phi = ${round(ang, 1)}^\\circ$.`,
          trap: kind === 'row' ? 'Measuring the angle from the normal instead of from the row.' : 'Using Bragg\'s law with a factor 2 as if for planes parallel to the surface.' };
      },
      verify: (p) => (p.kind === 'row' ? Math.acos(p.ss) : Math.asin(p.ss)) * 180 / Math.PI },
    { id: 'sf-g12', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Fourier synthesis',
      make(r) {
        const F0 = int(r, 8, 20), F1 = int(r, -4, 4), F2v = int(r, -3, 3), x = choose(r, [[0, '0'], [0.5, 'a/2'], [0.25, 'a/4']]);
        const v = F0 + 2 * (F1 * Math.cos(2 * PI * x[0]) + F2v * Math.cos(4 * PI * x[0]));
        return { q: `A centrosymmetric 1D crystal of period $a$ has real structure factors $F_0 = ${F0}$, $F_{\\pm1} = ${F1}$, $F_{\\pm2} = ${F2v}$ and no others. With $\\rho(x) = \\tfrac1a\\sum_h F_he^{-2\\pi ihx/a}$, the value of $a\\,\\rho$ at $x = ${x[1]}$ is ______ (to two decimal places).`,
          answer: round(v, 2), tol: 0.01, F0, F1, F2v, x0: x[0],
          sol: `Pairing $\\pm h$: $a\\rho(x) = F_0 + 2F_1\\cos(2\\pi x/a) + 2F_2\\cos(4\\pi x/a)$. At $x = ${x[1]}$: $\\cos(2\\pi x/a) = ${round(Math.cos(2 * PI * x[0]), 3)}$, $\\cos(4\\pi x/a) = ${round(Math.cos(4 * PI * x[0]), 3)}$, so $a\\rho = ${F0} + 2(${F1})(${round(Math.cos(2 * PI * x[0]), 3)}) + 2(${F2v})(${round(Math.cos(4 * PI * x[0]), 3)}) = ${round(v, 2)}$.`,
          trap: 'Forgetting the factor 2 from the $+h$ and $-h$ terms.' };
      },
      verify: (p) => p.F0 + 2 * (p.F1 * Math.cos(2 * Math.PI * p.x0) + p.F2v * Math.cos(4 * Math.PI * p.x0)) },
    ...more,
  ],
};
