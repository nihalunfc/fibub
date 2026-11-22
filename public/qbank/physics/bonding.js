// Bonding in solids (GATE / CSIR NET level): ionic crystals (Madelung constant and sums, Born-Lande and Born-Mayer
// energies, Born-Haber cycle, bulk modulus and the Born exponent, radius ratios), van der Waals solids and the
// Lennard-Jones potential (pair and lattice sums, equilibrium spacing, cohesive energy, force constant, bulk modulus,
// zero-point effects), covalent, metallic and hydrogen bonds. Original questions for fibub.
import { pick, int, choose, mcqOptions, round, C } from '../_util.js';
import more from './bonding.more.gen.js';
import more2 from './bonding.more2.gen.js';
import r4 from './bonding.r4.gen.js';

const KE = C.e / (4 * Math.PI * C.eps0) * 1e10;        // e^2/(4 pi eps0) in eV Å (14.40)
const KEJ = C.e ** 2 / (4 * Math.PI * C.eps0);          // in J m
const NAKJ = KE * C.e * C.NA / 1000;                     // N_A e^2/(4 pi eps0) in kJ Å / mol (1389)
const A12 = 12.13, A6 = 14.45;                           // fcc lattice sums for the Lennard-Jones solid
const MAD = { 'rock salt (NaCl)': 1.7476, 'caesium chloride (CsCl)': 1.7627, 'zinc blende (ZnS)': 1.6381, 'wurtzite (ZnO type)': 1.6413 };

export default {
  topic: 'bonding',
  items: [
    // ---------- level 1 ----------
    { id: 'bd-001', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'bond types',
      q: 'Which type of bond is strongly directional and saturable (each atom forms a fixed number of bonds at fixed angles)?',
      options: ['metallic', 'ionic', 'covalent', 'van der Waals'], answer: 2,
      sol: 'A covalent bond is a pair of electrons shared in overlapping orbitals between two particular atoms. Orbital shapes fix the angles (the $sp^3$ tetrahedron in Si), and once the valence orbitals are used no more bonds form. Ionic, metallic and van der Waals bonds act between all neighbours and do not care about direction, so those solids pack densely.',
      trap: 'Ionic bonds are strong, but strength is not direction: the Coulomb force is central.' },
    { id: 'bd-002', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'van der Waals',
      q: 'The attractive van der Waals (London) potential energy between two neutral, non-polar atoms a distance $r$ apart varies as',
      options: ['$-1/r$', '$-1/r^3$', '$-1/r^{12}$', '$-1/r^6$'], answer: 3,
      sol: 'A momentary dipole $p$ on one atom makes a field $\\propto p/r^3$ at the other, which induces a dipole $\\alpha p/r^3$. The energy of that induced dipole in the field is $\\propto -\\alpha p^2/r^6$. Averaged over the fluctuations, the attraction goes as $-1/r^6$.',
      trap: '$1/r^3$ is the field of a dipole (and the energy between two fixed dipoles); $1/r^{12}$ is the conventional repulsion.' },
    { id: 'bd-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Lennard-Jones',
      q: 'For the Lennard-Jones potential $U(r) = 4\\varepsilon[(\\sigma/r)^{12} - (\\sigma/r)^6]$, the minimum lies at',
      options: ['$r = 2^{1/6}\\sigma$', '$r = \\sigma$', '$r = 2\\sigma$', '$r = \\sigma/2^{1/6}$'], answer: 0,
      sol: '$dU/dr = 4\\varepsilon[-12\\sigma^{12}/r^{13} + 6\\sigma^6/r^7] = 0$ gives $r^6 = 2\\sigma^6$, so $r_0 = 2^{1/6}\\sigma = 1.122\\sigma$. There $U = 4\\varepsilon[\\tfrac14 - \\tfrac12] = -\\varepsilon$.',
      trap: 'At $r = \\sigma$ the potential is zero, not minimum.' },
    { id: 'bd-004', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'Lennard-Jones', unit: 'Å',
      q: 'For argon, the Lennard-Jones parameter $\\sigma$ is $3.40$ Å. The separation at which the pair potential is lowest is ______ Å (to two decimal places).',
      answer: 3.82, tol: 0.01, calc: () => 2 ** (1 / 6) * 3.4,
      sol: '$r_0 = 2^{1/6}\\sigma = 1.1225\\times3.40 = 3.82$ Å.',
      trap: 'Answering $\\sigma$ itself (where $U = 0$).' },
    { id: 'bd-005', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'Madelung constant',
      q: 'The Madelung constant of the NaCl structure, referred to the nearest-neighbour distance, is closest to',
      options: ['1.000', '1.386', '1.748', '6.000'], answer: 2,
      sol: 'Summing $\\pm1/(\\text{distance}/r_0)$ over all ions around one ion (6 opposite at $r_0$, 12 like at $\\sqrt2r_0$, 8 opposite at $\\sqrt3r_0$, ...) converges, with care, to $\\alpha = 1.7476$. 1.386 ($= 2\\ln2$) is the value for a 1D alternating chain; 6 is just the first shell.',
      trap: 'Keeping only the nearest neighbours (6) hugely overestimates the binding: the next shell repels.' },
    { id: 'bd-006', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'bond types',
      q: 'Solid argon is held together by',
      options: ['ionic bonds', 'van der Waals forces between fluctuating dipoles', 'metallic bonding by free electrons', 'covalent bonds between atoms'], answer: 1,
      sol: 'Argon atoms have closed shells: no electrons to share or give away. The only attraction is the London dispersion force between correlated fluctuating dipoles, which is weak (about 0.08 eV per atom), so argon melts at 84 K.',
      trap: 'Closed-shell atoms cannot form covalent bonds; there is nothing to pair.' },

    // ---------- level 2 ----------
    { id: 'bd-007', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Madelung constant',
      q: 'The Madelung constant of an infinite 1D chain of alternating $+e$ and $-e$ ions with spacing $r$ is',
      options: ['$1$', '$\\ln2$', '$\\pi^2/6$', '$2\\ln2$'], answer: 3,
      sol: 'For one ion, the neighbours on both sides give $\\alpha = 2\\left(1 - \\tfrac12 + \\tfrac13 - \\tfrac14 + \\dots\\right) = 2\\ln2 = 1.386$, using $\\ln(1 + x) = x - x^2/2 + x^3/3 - \\dots$ at $x = 1$.',
      trap: 'Counting one side only gives $\\ln2$.' },
    { id: 'bd-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Madelung energy', unit: 'eV',
      q: 'In NaCl ($\\alpha = 1.7476$) the nearest-neighbour distance is $2.82$ Å. The Madelung (electrostatic) energy per ion pair has magnitude ______ eV (to two decimal places). Use $e^2/4\\pi\\varepsilon_0 = 14.40$ eV Å.',
      answer: 8.92, tol: 0.02, calc: () => 1.7476 * 14.40 / 2.82,
      sol: '$|U_M| = \\alpha e^2/(4\\pi\\varepsilon_0r_0) = 1.7476\\times14.40/2.82 = 8.92$ eV per ion pair. The short-range repulsion then reduces this by roughly 10%.',
      trap: 'Dividing by 2 for "each ion": the Madelung energy of the crystal, shared out, is this value per <em>pair</em>.' },
    { id: 'bd-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Born-Lande',
      q: 'In the Born-Landé model the energy per ion pair is $U(r) = -\\alpha ke^2/r + B/r^n$. At the equilibrium separation $r_0$, the total energy equals the Madelung energy multiplied by',
      options: ['$1/n$', '$(1 + 1/n)$', '$(1 - 1/n)$', '$n/(n - 1)$'], answer: 2,
      sol: '$dU/dr = 0$ at $r_0$: $\\alpha ke^2/r_0^2 = nB/r_0^{n+1}$, so $B/r_0^n = \\alpha ke^2/(nr_0)$. Then $U(r_0) = -\\dfrac{\\alpha ke^2}{r_0}\\left(1 - \\dfrac1n\\right)$. With $n \\approx 8$ to 10 the repulsion removes 10 to 12% of the Madelung energy.',
      trap: 'Adding the repulsion as if it increased the binding.' },
    { id: 'bd-010', type: 'msq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'ionic crystals', format: 'multi',
      q: 'Which properties are typical of ionic crystals such as NaCl?',
      options: ['high melting point; hard but brittle', 'good electrical conduction in the solid state', 'electrical conduction when molten or dissolved', 'strong infrared absorption at the transverse optical phonon frequency'], answer: [0, 2, 3],
      sol: 'Strong, non-directional Coulomb binding gives high melting points; shifting one layer by half a cell brings like ions face to face, so the crystal cleaves rather than bends (brittle). All electrons are tightly bound to the ions, so the solid is an insulator, but the ions themselves carry current once they can move (melt or solution). The oppositely charged sublattices vibrating against each other form an oscillating dipole that absorbs infrared strongly near $\\omega_{TO}$ (the reststrahlen band).',
      trap: 'Ions conduct only when mobile; in the solid they are locked in place.' },
    { id: 'bd-011', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Lennard-Jones',
      q: 'For the Lennard-Jones potential $U(r) = 4\\varepsilon[(\\sigma/r)^{12} - (\\sigma/r)^6]$, the value of $U(2\\sigma)/\\varepsilon$ is ______ (to four decimal places).',
      answer: -0.0615, tol: 0.0002, calc: () => 4 * (2 ** -12 - 2 ** -6),
      sol: '$(\\sigma/r)^6 = 1/64 = 0.015625$ and $(\\sigma/r)^{12} = 1/4096 = 0.000244$. $U/\\varepsilon = 4(0.000244 - 0.015625) = -0.0615$. At twice $\\sigma$ the well is only 6% as deep as at the minimum: van der Waals forces are short-ranged.',
      trap: 'Dropping the factor 4.' },
    { id: 'bd-012', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'covalent bonds',
      q: 'The angle between two bonds from one carbon atom in diamond is',
      options: ['$90^\\circ$', '$120^\\circ$', '$109.47^\\circ$', '$104.5^\\circ$'], answer: 2,
      sol: 'Each atom bonds to four neighbours at the corners of a regular tetrahedron, along $(1,1,1)$, $(1,-1,-1)$, $(-1,1,-1)$, $(-1,-1,1)$. The angle between two of these: $\\cos\\theta = (1 - 1 - 1)/3 = -1/3$, $\\theta = 109.47^\\circ$ ($sp^3$ hybrids).',
      trap: '$120^\\circ$ is $sp^2$ (graphite, graphene); $104.5^\\circ$ is the water molecule.' },
    { id: 'bd-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'cohesive energy',
      q: 'Which list puts these solids in order of increasing cohesive energy per atom?',
      options: ['Na < Ar < Si < W', 'Si < Na < Ar < W', 'Ar < Na < Si < W', 'Ar < Si < Na < W'], answer: 2,
      sol: 'Typical values: Ar (van der Waals) about 0.08 eV/atom; Na (metallic, one s electron) about 1.1 eV; Si (covalent) about 4.6 eV; W (metallic with strong $d$-band bonding) about 8.9 eV, among the highest of all elements, which is why tungsten melts at 3695 K.',
      trap: 'Thinking all metals bind weakly because the alkalis do: transition metals with partly filled $d$ bands bind very strongly.' },
    { id: 'bd-014', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'metallic bonds',
      q: 'The ductility of most metals is best explained by',
      options: ['the directional nature of metallic bonds', 'the non-directional bonding by a sea of shared conduction electrons', 'the large Madelung constant of metals', 'hydrogen bonds between neighbouring atoms'], answer: 1,
      sol: 'In a metal the valence electrons are shared by the whole crystal. The energy depends mainly on the density, not on bond angles, so planes of ions can slide past each other (by dislocation motion) without breaking specific bonds.',
      trap: 'Directional bonds (covalent) make solids hard and brittle, the opposite of ductile.' },
    { id: 'bd-015', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Born-Haber cycle', unit: 'eV',
      q: 'The lattice energy of NaCl (to separate the crystal into Na$^+$ and Cl$^-$ ions) is $7.90$ eV per ion pair. The ionisation energy of Na is $5.14$ eV and the electron affinity of Cl is $3.61$ eV. The cohesive energy relative to neutral Na and Cl atoms is ______ eV per pair (to two decimal places).',
      answer: 6.37, tol: 0.01, calc: () => 7.90 - 5.14 + 3.61,
      sol: 'Go from crystal to atoms in two steps: crystal $\\to$ ions costs 7.90 eV; then Na$^+$ + Cl$^-$ $\\to$ Na + Cl releases $5.14$ eV (Na$^+$ takes back an electron) and costs $3.61$ eV (pulling the electron off Cl$^-$). Net: $7.90 - 5.14 + 3.61 = 6.37$ eV.',
      trap: 'Getting the signs of the ionisation energy and electron affinity the wrong way round.' },
    { id: 'bd-016', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'hydrogen bonds',
      q: 'The open, low-density crystal structure of ordinary ice (less dense than water) is due to',
      options: ['ionic bonds between H$^+$ and O$^{2-}$', 'metallic bonding', 'van der Waals forces alone', 'hydrogen bonds that hold each molecule to four neighbours tetrahedrally'], answer: 3,
      sol: 'Each H$_2$O molecule donates two hydrogen bonds and accepts two, so every oxygen sits at the centre of a tetrahedron of oxygens. Like the diamond structure, this is a very open arrangement. On melting some hydrogen bonds break, the network collapses partly, and the liquid is denser.',
      trap: 'Van der Waals forces are present but weak and non-directional; they would favour close packing.' },
    { id: 'bd-017', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'van der Waals', format: 'multi',
      q: 'Which statements about the London (dispersion) interaction are correct?',
      options: ['It comes from correlated quantum fluctuations of the electron clouds.', 'It acts between all atoms and molecules, including noble-gas atoms.', 'The attractive energy falls off as $1/r^3$.', 'It is directional and saturable, like a covalent bond.'], answer: [0, 1],
      sol: 'Even a closed-shell atom has an instantaneous dipole; the dipole it induces in a neighbour is correlated with it, and the average energy is $-C/r^6$ (not $1/r^3$). Every atom has electrons that fluctuate, so the force is universal. It depends only on distance (and polarisabilities), so it is neither directional nor saturable.',
      trap: '$1/r^3$ is the dipole field; the energy of a fluctuating induced pair goes as its square, $1/r^6$.' },
    { id: 'bd-046', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'metallic bonds', format: 'multi',
      q: 'Which statements about metallic bonding are correct?',
      options: ['It is non-directional, which allows close-packed structures (fcc, hcp, bcc).', 'The valence electrons are shared by all the ions of the crystal.', 'Transition metals generally have lower cohesive energies than alkali metals.', 'Metals are typically brittle because their bonds are directional.'], answer: [0, 1],
      sol: 'Delocalised electrons bind the ion cores as a whole, with no preferred bond angles, so metals take dense structures and are ductile (statements 1, 2 true; 4 false). Transition metals bind much more strongly than alkalis (W about 8.9 eV/atom versus Na about 1.1 eV), because their partly filled $d$ bands add strong bonding (statement 3 false).',
      trap: 'Mixing up metals (ductile, non-directional) with covalent solids (brittle, directional).' },

    // ---------- level 3 ----------
    { id: 'bd-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'force constant', unit: 'eV/Å²',
      q: 'For argon take $\\varepsilon = 0.0104$ eV and $\\sigma = 3.40$ Å in the Lennard-Jones pair potential. The force constant $k = U\'\'(r_0)$ at the minimum is ______ eV/Å$^2$ (to four decimal places).',
      answer: 0.0514, tol: 0.0003, calc: () => 72 * 0.0104 / (2 ** (1 / 3) * 3.4 ** 2),
      sol: '$U\'\' = 4\\varepsilon[156\\sigma^{12}/r^{14} - 42\\sigma^6/r^8]$. At $r_0$, $(\\sigma/r_0)^6 = \\tfrac12$, so $U\'\'(r_0) = \\dfrac{4\\varepsilon}{r_0^2}[156\\cdot\\tfrac14 - 42\\cdot\\tfrac12] = \\dfrac{72\\varepsilon}{r_0^2} = \\dfrac{72\\varepsilon}{2^{1/3}\\sigma^2}$. Numbers: $72\\times0.0104/(1.2599\\times11.56) = 0.0514$ eV/Å$^2$ ($\\approx 0.82$ N/m, tiny next to about 500 N/m for a covalent bond).',
      trap: 'Using $r = \\sigma$ instead of $r_0 = 2^{1/6}\\sigma$ in the curvature.' },
    { id: 'bd-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Born-Lande', unit: 'kJ/mol',
      q: 'Using the Born-Landé equation with $\\alpha = 1.7476$, $r_0 = 2.814$ Å and Born exponent $n = 8$, the lattice energy of NaCl is ______ kJ/mol (to the nearest whole number). Use $N_Ae^2/4\\pi\\varepsilon_0 = 1389.4$ kJ Å/mol.',
      answer: 755, tol: 2, calc: () => 1389.4 * 1.7476 / 2.814 * (1 - 1 / 8),
      sol: '$U = \\dfrac{N_A\\alpha e^2}{4\\pi\\varepsilon_0r_0}\\left(1 - \\dfrac1n\\right) = \\dfrac{1389.4\\times1.7476}{2.814}\\times0.875 = 862.9\\times0.875 = 755$ kJ/mol. The Born-Haber cycle gives about 787 kJ/mol; the gap reflects the crude repulsion and the neglected van der Waals and zero-point terms.',
      trap: 'Forgetting $N_A$ (giving eV per pair) or using $(1 + 1/n)$.' },
    { id: 'bd-020', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Madelung constant',
      q: 'Arrange the Madelung constants (referred to the nearest-neighbour distance) of the zinc blende, rock-salt and caesium chloride structures in increasing order.',
      options: ['CsCl < NaCl < ZnS', 'NaCl < ZnS < CsCl', 'ZnS < NaCl < CsCl', 'all three are equal'], answer: 2,
      sol: 'Values: ZnS 1.638 (4 neighbours), NaCl 1.748 (6), CsCl 1.763 (8). More opposite-charge neighbours at the same distance give a larger constant, but the increase is small because the next shells also come closer.',
      trap: 'Expecting the constant to scale with the coordination number (4 : 6 : 8). It rises only by about 7% overall.' },
    { id: 'bd-021', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'general potential',
      q: 'A pair energy $U(r) = -A/r^m + B/r^n$ ($n > m$) has its minimum at $r_0$. The ratio of the total energy $U(r_0)$ to the attractive part $-A/r_0^m$ is',
      options: ['$m/n$', '$n/m$', '$1 + m/n$', '$1 - m/n$'], answer: 3,
      sol: '$dU/dr = 0$: $mA/r_0^{m+1} = nB/r_0^{n+1}$, so $B/r_0^n = (m/n)A/r_0^m$. Then $U(r_0) = -\\dfrac{A}{r_0^m}\\left(1 - \\dfrac mn\\right)$. For Lennard-Jones ($m = 6$, $n = 12$) half the attraction survives; for an ionic crystal ($m = 1$, $n \\approx 9$) about 89%.',
      trap: 'The ratio $m/n$ is the fraction cancelled by repulsion, not what remains.' },
    { id: 'bd-022', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'bulk modulus',
      q: 'For the NaCl structure, the Born-Landé model gives the bulk modulus $B = \\dfrac{(n - 1)\\alpha e^2}{72\\pi\\varepsilon_0r_0^4}$. For NaCl, $B = 24.0$ GPa, $r_0 = 2.82$ Å and $\\alpha = 1.7476$. The Born exponent $n$ is ______ (to one decimal place).',
      answer: 7.8, tol: 0.1, calc: () => 1 + 72 * Math.PI * C.eps0 * 24e9 * (2.82e-10) ** 4 / (1.7476 * C.e ** 2),
      sol: 'Rearrange: $n - 1 = \\dfrac{72\\pi\\varepsilon_0Br_0^4}{\\alpha e^2}$. Numbers: $r_0^4 = (2.82\\times10^{-10})^4 = 6.324\\times10^{-39}$ m$^4$, numerator $= 72\\pi\\times8.854\\times10^{-12}\\times24\\times10^9\\times6.324\\times10^{-39} = 3.040\\times10^{-37}$; denominator $1.7476\\times(1.602\\times10^{-19})^2 = 4.486\\times10^{-38}$. So $n - 1 = 6.78$, $n = 7.8$. Compressibility measures the steepness of the repulsion: this is how Born exponents are found.',
      trap: 'Using $r_0$ in Å inside SI formulas, or the cube instead of the fourth power.' },
    { id: 'bd-023', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'covalent bonds', format: 'multi',
      q: 'Which statements about covalent crystals such as diamond, Si and Ge are correct?',
      options: ['Each atom has four nearest neighbours.', 'Their packing fraction (about 0.34) is far below close packing.', 'They are good electrical conductors at room temperature because the bonds are shared.', 'The bonding electron density piles up between neighbouring atoms.'], answer: [0, 1, 3],
      sol: 'The $sp^3$ bonds give 4 neighbours in a tetrahedron, a very open structure (packing fraction $\\sqrt3\\pi/16 = 0.34$). The bonding electrons sit in localised bonds between atoms (seen in X-ray charge-density maps), and a band gap separates them from conducting states: diamond is an insulator, Si and Ge are semiconductors with low intrinsic conductivity.',
      trap: '"Shared electrons" in a covalent bond are shared by two atoms, not by the whole crystal as in a metal.' },
    { id: 'bd-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Born-Lande',
      q: 'For $U(r) = -A/r + B/r^n$, the equilibrium separation is',
      options: ['$r_0 = (nB/A)^{1/(n-1)}$', '$r_0 = (B/A)^{1/n}$', '$r_0 = (A/nB)^{1/(n-1)}$', '$r_0 = (nB/A)^{1/n}$'], answer: 0,
      sol: '$dU/dr = A/r^2 - nB/r^{n+1} = 0 \\Rightarrow r^{n-1} = nB/A \\Rightarrow r_0 = (nB/A)^{1/(n-1)}$. Check dimensions: $B/A$ has units of length$^{n-1}$, so the exponent must be $1/(n - 1)$.',
      trap: 'A dimension check alone rules out the options with exponent $1/n$.' },
    { id: 'bd-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Lennard-Jones solid', unit: 'Å',
      q: 'For an fcc Lennard-Jones solid, the lattice sums are $A_{12} = 12.13$ and $A_6 = 14.45$, so the total energy is $U = 2N\\varepsilon[A_{12}(\\sigma/R)^{12} - A_6(\\sigma/R)^6]$ with $R$ the nearest-neighbour distance. For argon ($\\sigma = 3.40$ Å) the equilibrium $R_0$ is ______ Å (to two decimal places).',
      answer: 3.71, tol: 0.01, calc: () => (2 * A12 / A6) ** (1 / 6) * 3.4,
      sol: '$dU/dR = 0$: $(\\sigma/R_0)^6 = A_6/(2A_{12})$, so $R_0 = (2A_{12}/A_6)^{1/6}\\sigma = (1.679)^{1/6}\\times3.40 = 1.090\\times3.40 = 3.71$ Å. The measured value is 3.76 Å; the difference is mostly zero-point motion.',
      trap: 'Using the pair result $2^{1/6}\\sigma = 3.82$ Å, which ignores the attraction of farther neighbours.' },
    { id: 'bd-026', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Lennard-Jones solid', unit: 'meV',
      q: 'With the same fcc lattice sums ($A_{12} = 12.13$, $A_6 = 14.45$), the cohesive energy per atom of a Lennard-Jones solid is $\\varepsilon A_6^2/(2A_{12})$. For neon, $\\varepsilon = 3.1$ meV. The cohesive energy per atom is ______ meV (to one decimal place).',
      answer: 26.7, tol: 0.1, calc: () => 3.1 * A6 ** 2 / (2 * A12),
      sol: 'At $R_0$, $U/N = 2\\varepsilon[A_{12}x^2 - A_6x]$ with $x = A_6/(2A_{12})$: $= 2\\varepsilon[-A_6^2/(4A_{12})] = -\\varepsilon A_6^2/(2A_{12}) = -8.61\\varepsilon$. So $8.61\\times3.1 = 26.7$ meV. The measured value is about 20 meV: for light neon the zero-point energy takes a sizeable share.',
      trap: 'Using $6\\varepsilon$ (12 neighbours each sharing a bond of depth $\\varepsilon$) ignores both the farther neighbours and the shift of $R_0$.' },
    { id: 'bd-027', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'zero-point energy',
      q: 'Helium stays liquid down to absolute zero at atmospheric pressure. The main reason is that',
      options: ['helium atoms repel each other at all distances', 'the zero-point kinetic energy of the light atoms is comparable to or larger than the shallow van der Waals well', 'helium forms covalent He$_2$ molecules', 'helium atoms carry a permanent dipole moment'], answer: 1,
      sol: 'Confining a light atom (mass 4 u) to a cage of size $\\Delta x$ costs $\\sim\\hbar^2/(2m\\Delta x^2)$, of the same order as the He-He well depth of only about 1 meV. The localised solid therefore does not win at zero pressure; about 25 bar are needed to solidify He-4.',
      trap: 'Thinking classical: at $T = 0$ a classical liquid would always freeze; quantum zero-point motion is what keeps helium liquid.' },
    { id: 'bd-028', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Madelung energy', unit: 'eV',
      q: 'Four point ions, charges $+e, -e, +e, -e$ in turn, sit at the corners of a square of side $2.50$ Å. Their total electrostatic energy is ______ eV (to two decimal places, with sign). Use $e^2/4\\pi\\varepsilon_0 = 14.40$ eV Å.',
      answer: -14.89, tol: 0.02, calc: () => (-4 + 2 / Math.SQRT2) * 14.40 / 2.5,
      sol: 'Six pairs: 4 sides (opposite charges, $-ke^2/a$ each) and 2 diagonals (like charges, $+ke^2/(\\sqrt2a)$ each). $U = \\dfrac{ke^2}{a}(-4 + \\sqrt2) = 5.76\\times(-2.586) = -14.89$ eV.',
      trap: 'Forgetting the repulsive diagonal pairs, which give $-23.04$ eV.' },
    { id: 'bd-029', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'bond types',
      q: 'All four of these crystals have tetrahedral or octahedral coordination. Which has bonding closest to purely covalent?',
      options: ['Ge', 'GaAs', 'ZnSe', 'NaCl'], answer: 0,
      sol: 'Covalent character is highest when the two atoms have equal electronegativity. In Ge both atoms are the same, so the bond is purely covalent. Moving outward from group IV (III-V GaAs, II-VI ZnSe, I-VII NaCl) the electronegativity difference grows and the bonding becomes more ionic.',
      trap: 'GaAs has the same zinc blende structure as Ge has diamond, but its Ga-As bond is partly ionic.' },
    { id: 'bd-030', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'hydrogen bonds', format: 'multi',
      q: 'Which statements about hydrogen bonds are correct?',
      options: ['A hydrogen atom bonded to one strongly electronegative atom (O, N, F) is attracted to another.', 'Typical energies (about 0.1 to 0.5 eV) lie between van der Waals and covalent bond energies.', 'The hydrogen atom forms two full covalent bonds at once.', 'They are responsible for the tetrahedral network of ice.'], answer: [0, 1, 3],
      sol: 'The proton, nearly stripped of its electron by the electronegative partner, attracts the lone pair of a second electronegative atom: largely an electrostatic bond. It is weaker than a covalent bond but stronger than van der Waals. Hydrogen has only one 1s orbital, so it cannot form two full covalent bonds. In ice each molecule makes four hydrogen bonds in a tetrahedron.',
      trap: 'A hydrogen bond is mainly electrostatic, not a second covalent bond.' },
    { id: 'bd-047', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Madelung constant', format: 'multi',
      q: 'Which statements about Madelung constants are correct?',
      options: ['They depend only on the geometry of the structure, not on its lattice constant.', 'For an alternating 1D chain the value is $2\\ln2$.', 'The Madelung series converges absolutely, so the order of summation never matters.', 'All cubic AB structures share the same Madelung constant.'], answer: [0, 1],
      sol: 'Distances are measured in units of $r_0$, so the constant is a pure number set by the geometry. The 1D chain gives $2(1 - \\tfrac12 + \\tfrac13 - \\dots) = 2\\ln2$. The 3D series is only conditionally convergent: summing shell by shell jumps about wildly, and neutral groupings (Evjen) or Ewald\'s method are needed. Values differ between structures: NaCl 1.748, CsCl 1.763, ZnS 1.638.',
      trap: 'The alternating harmonic series itself is conditionally convergent; rearranging it changes the sum.' },

    // ---------- level 4 ----------
    { id: 'bd-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Born-Mayer', unit: 'eV',
      q: 'In the Born-Mayer model the energy per ion pair is $U(r) = -\\alpha ke^2/r + \\lambda\' e^{-r/\\rho}$. For NaCl take $\\alpha = 1.7476$, $r_0 = 2.82$ Å and $\\rho = 0.321$ Å. The binding energy per pair, $-U(r_0)$, is ______ eV (to two decimal places). Use $ke^2 = 14.40$ eV Å.',
      answer: 7.91, tol: 0.02, calc: () => 1.7476 * 14.40 / 2.82 * (1 - 0.321 / 2.82),
      sol: 'At equilibrium, $\\alpha ke^2/r_0^2 = (\\lambda\'/\\rho)e^{-r_0/\\rho}$, so the repulsive energy is $\\lambda\'e^{-r_0/\\rho} = \\alpha ke^2\\rho/r_0^2$. Then $U(r_0) = -\\dfrac{\\alpha ke^2}{r_0}\\left(1 - \\dfrac{\\rho}{r_0}\\right) = -8.924\\times(1 - 0.1138) = -7.91$ eV. The exponential form plays the role of $n = r_0/\\rho \\approx 8.8$.',
      trap: 'Using $(1 - 1/n)$ with $n$ guessed instead of deriving the factor $(1 - \\rho/r_0)$.' },
    { id: 'bd-032', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Madelung sums',
      q: 'Summing the NaCl Madelung series shell by shell around one ion: 6 opposite ions at distance $r_0$, 12 like ions at $\\sqrt2r_0$, 8 opposite ions at $\\sqrt3r_0$. The partial sum $\\alpha_3$ after these three shells is ______ (to three decimal places).',
      answer: 2.134, tol: 0.003, calc: () => 6 - 12 / Math.SQRT2 + 8 / Math.sqrt(3),
      sol: '$\\alpha_3 = 6 - \\dfrac{12}{\\sqrt2} + \\dfrac{8}{\\sqrt3} = 6 - 8.485 + 4.619 = 2.134$. Adding the next shell (6 like ions at $2r_0$) gives $-0.866$, and the shell sums keep swinging. The true value 1.7476 needs a method that keeps every group neutral (Evjen cubes or the Ewald sum).',
      trap: 'Believing that more shells always bring the sum closer: this series is only conditionally convergent.' },
    { id: 'bd-033', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'general potential',
      q: 'A pair potential $U(r) = -A/r^m + B/r^n$ with $A, B > 0$ has a stable minimum (a bound solid) only if',
      options: ['$n > m$', '$n < m$', '$n = m$', '$m > 1$, whatever $n$ is'], answer: 0,
      sol: 'At small $r$ the repulsion must win (so $n > m$), and at large $r$ the attraction must win (again $n > m$). Formally $U\'\'(r_0) = \\dfrac{mA}{r_0^{m+2}}(n - m)$, positive only for $n > m$. If $n < m$ the extremum is a maximum and the atoms either collapse or fly apart.',
      trap: 'Thinking any combination of an attraction and a repulsion gives a well.' },
    { id: 'bd-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Madelung energy',
      q: 'An isolated NaCl molecule has a bond length of $2.36$ Å; in the crystal the Na-Cl distance is $2.82$ Å and $\\alpha = 1.7476$. The ratio of the Coulomb energy per ion pair in the crystal to that in the molecule is ______ (to two decimal places).',
      answer: 1.46, tol: 0.01, calc: () => 1.7476 * 2.36 / 2.82,
      sol: 'Molecule: $ke^2/2.36$. Crystal: $\\alpha ke^2/2.82$. Ratio $= 1.7476\\times2.36/2.82 = 1.46$. Even though each ion is farther from any one neighbour in the crystal, it has six of them (and the Madelung sum of all others): the crystal is 46% more stable electrostatically.',
      trap: 'Comparing at the same distance (ratio 1.75) ignores the longer bond in the crystal.' },
    { id: 'bd-035', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Lennard-Jones', format: 'multi',
      q: 'For the Lennard-Jones pair potential $U = 4\\varepsilon[(\\sigma/r)^{12} - (\\sigma/r)^6]$, which statements are correct?',
      options: ['$U(\\sigma) = 0$.', 'The well depth is $\\varepsilon$, at $r = 2^{1/6}\\sigma$.', 'The force between the atoms is zero at $r = \\sigma$.', 'The $r^{-6}$ term has a physical origin; the $r^{-12}$ term is mainly a convenient choice.'], answer: [0, 1, 3],
      sol: '$U(\\sigma) = 4\\varepsilon(1 - 1) = 0$, and the minimum $-\\varepsilon$ is at $2^{1/6}\\sigma$. The force $-dU/dr$ vanishes at the minimum, not at $\\sigma$ (there the force is strongly repulsive, $24\\varepsilon/\\sigma$). The $-1/r^6$ follows from London\'s theory; Pauli repulsion is closer to exponential, and the 12th power is used because it is the square of the 6th power and fits reasonably.',
      trap: 'Mixing "potential zero" (at $\\sigma$) with "force zero" (at $r_0$).' },
    { id: 'bd-036', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'force constant', unit: 'THz',
      q: 'Model an Ar$_2$ dimer with the Lennard-Jones potential ($\\varepsilon = 0.0104$ eV, $\\sigma = 3.40$ Å; atomic mass 39.95 u). The small-oscillation vibration frequency $\\nu$ of the dimer is ______ THz (to two decimal places). Use $1$ u $= 1.6605\\times10^{-27}$ kg.',
      answer: 0.79, tol: 0.01, calc: () => { const k = 72 * 0.0104 * C.e / (2 ** (1 / 3) * (3.4e-10) ** 2); const mu = 39.95 / 2 * C.u; return Math.sqrt(k / mu) / (2 * Math.PI) / 1e12; },
      sol: '$k = 72\\varepsilon/(2^{1/3}\\sigma^2) = 0.0514$ eV/Å$^2 = 0.0514\\times16.02 = 0.824$ N/m. Reduced mass $\\mu = m/2 = 19.98$ u $= 3.317\\times10^{-26}$ kg. $\\omega = \\sqrt{k/\\mu} = \\sqrt{2.48\\times10^{25}} = 4.98\\times10^{12}$ rad/s, so $\\nu = \\omega/2\\pi = 0.79$ THz (about 26 cm$^{-1}$). Phonons in solid argon have frequencies of this order.',
      trap: 'Using the full atomic mass instead of the reduced mass $m/2$ lowers $\\nu$ by $\\sqrt2$.' },
    { id: 'bd-037', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Born-Lande',
      q: 'In an alkali halide with Born exponent $n \\approx 9$, roughly what fraction of the Madelung energy is cancelled by the repulsive energy at equilibrium?',
      options: ['about 1%', 'about 50%', 'about 89%', 'about 11%'], answer: 3,
      sol: 'At $r_0$, repulsive energy $= \\alpha ke^2/(nr_0)$, i.e. a fraction $1/n \\approx 1/9 = 11\\%$ of the Madelung energy. The remaining 89% is the binding. Ionic cohesion is dominated by electrostatics; the repulsion mainly fixes where the minimum lies.',
      trap: '89% is what remains, not what is cancelled.' },
    { id: 'bd-038', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Born-Haber cycle', unit: 'Å',
      q: 'Transferring an electron from a free Na atom (ionisation energy $5.14$ eV) to a free Cl atom (electron affinity $3.61$ eV) costs energy. Counting only the Coulomb attraction of the resulting ion pair, the separation below which the transfer becomes energetically favourable is ______ Å (to two decimal places). Use $ke^2 = 14.40$ eV Å.',
      answer: 9.41, tol: 0.03, calc: () => 14.40 / (5.14 - 3.61),
      sol: 'Net cost at infinite separation: $5.14 - 3.61 = 1.53$ eV. The pair gains $ke^2/r$ when brought to distance $r$. Break-even: $ke^2/r = 1.53$ eV, so $r = 14.40/1.53 = 9.41$ Å. Closer than this, the ionic configuration has lower energy: the "harpoon" picture of alkali-halogen reactions.',
      trap: 'Adding the ionisation energy and electron affinity instead of subtracting.' },
    { id: 'bd-039', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'covalent bonds',
      q: 'In the Heitler-London description of the H$_2$ molecule, the bonding state has',
      options: ['a symmetric spatial wavefunction and a spin triplet', 'an antisymmetric spatial wavefunction and a spin singlet', 'an antisymmetric spatial wavefunction and a spin triplet', 'a symmetric spatial wavefunction and a spin singlet'], answer: 3,
      sol: 'The total wavefunction of two electrons must be antisymmetric. The symmetric spatial combination puts extra charge between the protons, where both are attracted to it, and lowers the energy: this requires an antisymmetric spin part, the singlet $S = 0$. The triplet goes with the antisymmetric spatial function, which has a node between the nuclei and is repulsive. Covalent bonds thus pair spins.',
      trap: 'Remembering only "triplet is lower" (Hund\'s rule for one atom) and applying it to the bond.' },
    { id: 'bd-040', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'general potential', unit: 'meV',
      q: 'Two atoms interact through $U(r) = -A/r^6 + B/r^{12}$ with $A = 1.0\\times10^{-77}$ J m$^6$ and $B = 1.0\\times10^{-134}$ J m$^{12}$. The depth of the potential well is ______ meV (to one decimal place).',
      answer: 15.6, tol: 0.1, calc: () => (1e-77) ** 2 / (4 * 1e-134) / C.e * 1000,
      sol: 'Minimum: $6A/r^7 = 12B/r^{13}$, so $r_0^6 = 2B/A = 2\\times10^{-57}$ m$^6$ ($r_0 = 3.55$ Å). Depth: $-U(r_0) = A/r_0^6 - B/r_0^{12} = \\dfrac{A^2}{2B} - \\dfrac{A^2}{4B} = \\dfrac{A^2}{4B} = \\dfrac{10^{-154}}{4\\times10^{-134}} = 2.5\\times10^{-21}$ J $= 15.6$ meV. (In Lennard-Jones form, $A = 4\\varepsilon\\sigma^6$, $B = 4\\varepsilon\\sigma^{12}$, so $\\varepsilon = A^2/4B$.)',
      trap: 'Taking $A^2/2B$ (the attractive part alone at $r_0$).' },

    // ---------- level 5 ----------
    { id: 'bd-041', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'radius ratio',
      q: 'In the CsCl structure each cation sits at the centre of a cube of 8 anions. Treating ions as hard spheres, the smallest cation-to-anion radius ratio $r_+/r_-$ for which the cation still touches all 8 anions while the anions do not overlap is ______ (to three decimal places).',
      answer: 0.732, tol: 0.002, calc: () => Math.sqrt(3) - 1,
      sol: 'At the limit the anions touch along the cube edge: $a = 2r_-$. Cation and anion touch along the body diagonal: $\\sqrt3a = 2(r_+ + r_-)$. So $\\sqrt3\\cdot2r_- = 2r_+ + 2r_-$, giving $r_+/r_- = \\sqrt3 - 1 = 0.732$. A smaller cation would rattle in its cage; the 6-coordinated rock-salt structure then wins.',
      trap: 'Using the face diagonal gives $\\sqrt2 - 1 = 0.414$, the limit for octahedral (NaCl) coordination.' },
    { id: 'bd-042', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'radius ratio', format: 'multi',
      q: 'For simple AB ionic crystals in the hard-sphere picture, which statements are correct?',
      options: ['The CsCl structure (coordination 8) needs $r_+/r_- \\ge 0.732$.', 'The rock-salt structure (coordination 6) is favoured for $0.414 \\le r_+/r_- < 0.732$.', 'Tetrahedral coordination (zinc blende) is favoured below 0.414, down to about 0.225.', 'Higher coordination always wins, because its Madelung constant is larger at the same nearest-neighbour distance.'], answer: [0, 1, 2],
      sol: 'The limits come from cation-anion contact with anions just touching: $\\sqrt3 - 1 = 0.732$ (cube), $\\sqrt2 - 1 = 0.414$ (octahedron), $\\sqrt{3/2} - 1 = 0.225$ (tetrahedron). The Madelung gain from 6 to 8 neighbours is under 1%, so if the small cation cannot touch all eight anions, the crystal expands and loses more than it gains; higher coordination does not always win. (Real crystals follow these rules only roughly; many alkali halides are rock salt despite large ratios.)',
      trap: 'Statement 4 is tempting because $\\alpha_{CsCl} > \\alpha_{NaCl}$, but the difference is tiny next to the effect of the larger $r_0$.' },
    { id: 'bd-043', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'Lennard-Jones solid', unit: 'GPa',
      q: 'An fcc Lennard-Jones solid (lattice sums $A_{12} = 12.13$, $A_6 = 14.45$) has bulk modulus $B = 4\\varepsilon A_6^{5/2}/(A_{12}^{3/2}\\sigma^3) \\approx 75\\varepsilon/\\sigma^3$ at $T = 0$. For argon ($\\varepsilon = 0.0104$ eV, $\\sigma = 3.40$ Å) this gives $B$ = ______ GPa (to two decimal places).',
      answer: 3.18, tol: 0.03, calc: () => 4 * A6 ** 2.5 / A12 ** 1.5 * 0.0104 * C.e / (3.4e-10) ** 3 / 1e9,
      sol: 'The coefficient: $4\\times14.45^{2.5}/12.13^{1.5} = 4\\times793.7/42.25 = 75.1$. $\\varepsilon/\\sigma^3 = 0.0104\\times1.602\\times10^{-19}/(3.40\\times10^{-10})^3 = 1.666\\times10^{-21}/3.930\\times10^{-29} = 4.24\\times10^7$ Pa. $B = 75.1\\times4.24\\times10^7 = 3.18\\times10^9$ Pa. (Derivation: $B = V\\,d^2U/dV^2$ with $V = NR^3/\\sqrt2$ at $R_0$.) Measured: about 2.7 GPa.',
      trap: 'Forgetting to convert eV to J or Å$^3$ to m$^3$ gives an answer off by many powers of ten.' },
    { id: 'bd-044', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'elastic constants',
      q: 'For a cubic crystal held together only by central two-body forces, with every atom at a centre of inversion and no initial stress, the elastic constants obey',
      options: ['$C_{11} = C_{12}$', '$C_{12} = C_{44}$', '$C_{11} = 2C_{44}$', '$C_{12} = 0$'], answer: 1,
      sol: 'This is the Cauchy relation $C_{12} = C_{44}$. Pair forces that depend only on distance give an energy whose second derivatives with respect to strain are symmetric in all four indices, which forces $C_{12} = C_{44}$. Rare-gas solids nearly obey it; metals violate it badly (e.g. Cu, $C_{12} \\approx 1.6C_{44}$) because the electron gas adds a volume-dependent, non-pairwise energy.',
      trap: 'Thinking any elastic relation would hold for metals; their many-body (electron gas) energy breaks it.' },
    { id: 'bd-045', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'Lennard-Jones solid',
      q: 'Estimating the cohesive energy of an fcc Lennard-Jones solid with nearest neighbours only gives $6\\varepsilon$ per atom (12 bonds per atom, each shared by two, each $\\varepsilon$ deep at $R = 2^{1/6}\\sigma$). The full lattice sums ($A_{12} = 12.13$, $A_6 = 14.45$) give $\\varepsilon A_6^2/(2A_{12})$. The ratio of the full result to the nearest-neighbour estimate is ______ (to two decimal places).',
      answer: 1.43, tol: 0.01, calc: () => A6 ** 2 / (2 * A12) / 6,
      sol: 'Full: $14.45^2/24.26 = 208.8/24.26 = 8.61\\varepsilon$. Ratio $= 8.61/6 = 1.43$. The farther neighbours (6 at $\\sqrt2R$, 24 at $\\sqrt3R$, ...) add attraction through the slowly decaying $r^{-6}$ tail, and also pull the crystal slightly tighter ($R_0 = 1.09\\sigma$ instead of $1.12\\sigma$). The $r^{-12}$ sum is almost all nearest neighbours ($A_{12} = 12.13 \\approx 12$).',
      trap: 'Expecting the farther neighbours to matter little: $A_6 = 14.45$ is 20% above 12.' },
    ...more2,
    ...r4.items,
  ],

  gens: [
    { id: 'bd-g01', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'Lennard-Jones',
      make(r) {
        const sig = pick(r, 2.5, 4.2, 0.01), ask = choose(r, ['r0', 'sigma']);
        const r0 = 2 ** (1 / 6) * sig;
        return ask === 'r0'
          ? { q: `A Lennard-Jones pair potential has $\\sigma = ${sig}$ Å. The separation at the potential minimum is ______ Å (to three decimal places).`, answer: round(r0, 3), tol: 0.003, unit: 'Å', v: sig, ask,
            sol: `$dU/dr = 0$ gives $r_0^6 = 2\\sigma^6$, so $r_0 = 2^{1/6}\\sigma = 1.1225\\times${sig} = ${round(r0, 3)}$ Å.`, trap: 'Giving $\\sigma$, where $U = 0$.' }
          : { q: `A Lennard-Jones pair potential has its minimum at $r_0 = ${round(r0, 3)}$ Å. The separation at which the potential is zero is ______ Å (to three decimal places).`, answer: round(round(r0, 3) / 2 ** (1 / 6), 3), tol: 0.003, unit: 'Å', v: round(r0, 3), ask,
            sol: `$U = 0$ at $r = \\sigma = r_0/2^{1/6} = ${round(r0, 3)}/1.1225 = ${round(round(r0, 3) / 2 ** (1 / 6), 3)}$ Å.`, trap: 'Multiplying by $2^{1/6}$ instead of dividing.' };
      },
      verify: (p) => (p.ask === 'r0' ? 2 ** (1 / 6) * p.v : p.v / 2 ** (1 / 6)) },
    { id: 'bd-g02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'force constant',
      make(r) {
        const eps = pick(r, 3, 25, 0.1), sig = pick(r, 2.6, 4.2, 0.01), k = 72 * eps / 1000 / (2 ** (1 / 3) * sig * sig), kN = k * C.e * 1e20;
        return { q: `A Lennard-Jones pair potential has $\\varepsilon = ${eps}$ meV and $\\sigma = ${sig}$ Å. The force constant $U\'\'(r_0)$ at the minimum is ______ N/m (to three decimal places).`,
          answer: round(kN, 3), tol: Math.max(0.002, round(kN * 0.005, 3)), unit: 'N/m', eps, sig,
          sol: `At $r_0 = 2^{1/6}\\sigma$, $(\\sigma/r_0)^6 = \\tfrac12$ and $U\'\' = \\dfrac{4\\varepsilon}{r_0^2}(156\\cdot\\tfrac14 - 42\\cdot\\tfrac12) = \\dfrac{72\\varepsilon}{2^{1/3}\\sigma^2} = \\dfrac{72\\times${eps}\\times10^{-3}}{1.2599\\times${round(sig * sig, 4)}} = ${round(k, 5)}$ eV/Å$^2$. Since 1 eV/Å$^2$ = 16.02 N/m, $k = ${round(kN, 3)}$ N/m.`,
          trap: 'Evaluating the curvature at $\\sigma$ instead of $2^{1/6}\\sigma$, or skipping the unit conversion.' };
      },
      verify: (p) => 72 * p.eps / 1000 / (2 ** (1 / 3) * p.sig ** 2) * C.e * 1e20 },
    { id: 'bd-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Born-Lande',
      make(r) {
        const s = choose(r, Object.keys(MAD)), al = MAD[s], r0 = pick(r, 2.0, 3.7, 0.01), n = choose(r, [5, 6, 7, 8, 9, 10, 11, 12]), Z = choose(r, [1, 1, 1, 2]);
        const U = NAKJ * al * Z * Z / r0 * (1 - 1 / n);
        return { q: `A crystal with the ${s} structure (Madelung constant $${al}$) has ions of charge $\\pm ${Z === 1 ? '' : Z}e$, nearest-neighbour distance $${r0}$ Å and Born exponent $n = ${n}$. Its Born-Landé lattice energy is ______ kJ/mol (to the nearest whole number). Use $N_Ae^2/4\\pi\\varepsilon_0 = ${round(NAKJ, 1)}$ kJ Å/mol.`,
          answer: Math.round(U), tol: Math.max(2, Math.round(U * 0.003)), unit: 'kJ/mol', al, Z, r0, n,
          sol: `$U = \\dfrac{N_A\\alpha Z^2e^2}{4\\pi\\varepsilon_0r_0}\\left(1 - \\dfrac1n\\right) = \\dfrac{${round(NAKJ, 1)}\\times${al}\\times${Z * Z}}{${r0}}\\times${round(1 - 1 / n, 4)} = ${Math.round(U)}$ kJ/mol.`,
          trap: Z > 1 ? 'Forgetting the $Z^2 = 4$ for doubly charged ions.' : 'Using $(1 + 1/n)$, or leaving out $N_A$.' };
      },
      verify: (p) => NAKJ * p.al * p.Z ** 2 / p.r0 * (1 - 1 / p.n) },
    { id: 'bd-g04', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Madelung energy',
      make(r) {
        const s = choose(r, Object.keys(MAD)), al = MAD[s], r0 = pick(r, 1.9, 3.8, 0.01), E = al * KE / r0;
        return { q: `A crystal with the ${s} structure ($\\alpha = ${al}$) has nearest-neighbour distance $${r0}$ Å. The magnitude of its Madelung energy per ion pair (singly charged ions) is ______ eV (to two decimal places). Use $e^2/4\\pi\\varepsilon_0 = ${round(KE, 2)}$ eV Å.`,
          answer: round(E, 2), tol: 0.02, unit: 'eV', al, r0,
          sol: `$|U_M| = \\alpha e^2/(4\\pi\\varepsilon_0r_0) = ${al}\\times${round(KE, 2)}/${r0} = ${round(E, 2)}$ eV per pair.`,
          trap: 'Leaving out the Madelung constant (that is a single ion pair, not a crystal).' };
      },
      verify: (p) => p.al * KE / p.r0 },
    { id: 'bd-g05', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'bulk modulus',
      make(r) {
        const r0 = pick(r, 2.3, 3.5, 0.01), n = choose(r, [6, 7, 8, 9, 10, 11]);
        const B = (n - 1) * 1.7476 * KEJ / (18 * (r0 * 1e-10) ** 4) / 1e9;
        return { q: `An alkali halide with the rock-salt structure ($\\alpha = 1.7476$) has $r_0 = ${r0}$ Å and Born exponent $n = ${n}$. In the Born-Landé model its bulk modulus $B = \\dfrac{(n-1)\\alpha e^2}{72\\pi\\varepsilon_0r_0^4}$ is ______ GPa (to one decimal place).`,
          answer: round(B, 1), tol: Math.max(0.1, round(B * 0.005, 1)), unit: 'GPa', r0, n,
          sol: `$\\dfrac{e^2}{4\\pi\\varepsilon_0} = 2.307\\times10^{-28}$ J m, so $B = \\dfrac{(n-1)\\alpha}{18r_0^4}\\cdot\\dfrac{e^2}{4\\pi\\varepsilon_0} = \\dfrac{${n - 1}\\times1.7476\\times2.307\\times10^{-28}}{18\\times(${r0}\\times10^{-10})^4} = ${round(B, 1)}$ GPa. (From $B = V\\,d^2U/dV^2$ with $V = 2r^3$ per ion pair.)`,
          trap: 'Mixing Å with SI units, or using $r_0^3$.' };
      },
      verify: (p) => (p.n - 1) * 1.7476 * KEJ / (18 * (p.r0 * 1e-10) ** 4) / 1e9 },
    { id: 'bd-g06', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Born-Haber cycle',
      make(r) {
        const salt = choose(r, [['LiF', 5.39, 3.40], ['NaF', 5.14, 3.40], ['KCl', 4.34, 3.61], ['NaBr', 5.14, 3.36], ['KBr', 4.34, 3.36], ['RbCl', 4.18, 3.61], ['NaI', 5.14, 3.06], ['KI', 4.34, 3.06]]);
        const L = pick(r, 6.2, 10.6, 0.01), dir = choose(r, ['coh', 'lat']);
        const coh = round(L - salt[1] + salt[2], 2);
        return dir === 'coh'
          ? { q: `For ${salt[0]}, the lattice energy (crystal to free ions) is $${L}$ eV per ion pair, the ionisation energy of the metal is $${salt[1]}$ eV and the electron affinity of the halogen is $${salt[2]}$ eV. The cohesive energy relative to free neutral atoms is ______ eV per pair (to two decimal places).`,
            answer: coh, tol: 0.01, unit: 'eV', L, I: salt[1], A: salt[2], dir,
            sol: `Crystal $\\to$ ions: $+${L}$ eV. Ions $\\to$ atoms: the cation takes back its electron ($-${salt[1]}$ eV) and the anion gives one up ($+${salt[2]}$ eV). Cohesive energy $= ${L} - ${salt[1]} + ${salt[2]} = ${coh}$ eV.`, trap: 'Swapping the signs of the ionisation energy and electron affinity.' }
          : { q: `For ${salt[0]}, the cohesive energy relative to free neutral atoms is $${coh}$ eV per pair, the ionisation energy of the metal is $${salt[1]}$ eV and the electron affinity of the halogen is $${salt[2]}$ eV. The lattice energy (crystal to free ions) is ______ eV per pair (to two decimal places).`,
            answer: round(coh + salt[1] - salt[2], 2), tol: 0.01, unit: 'eV', L: coh, I: salt[1], A: salt[2], dir,
            sol: `Lattice energy $=$ cohesive energy $+$ ionisation energy $-$ electron affinity $= ${coh} + ${salt[1]} - ${salt[2]} = ${round(coh + salt[1] - salt[2], 2)}$ eV.`, trap: 'Swapping the signs of the ionisation energy and electron affinity.' };
      },
      verify: (p) => (p.dir === 'coh' ? p.L - p.I + p.A : p.L + p.I - p.A) },
    { id: 'bd-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Madelung energy',
      make(r) {
        const N = int(r, 3, 8), a = pick(r, 2.0, 3.5, 0.05);
        let s = 0; for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) s += ((j - i) % 2 ? -1 : 1) / (j - i);
        const U = s * KE / a;
        return { q: `${N} point ions with alternating charges $+e, -e, +e, \\dots$ sit on a straight line, $${a}$ Å apart. The total electrostatic energy of the group is ______ eV (to two decimal places, with sign). Use $e^2/4\\pi\\varepsilon_0 = ${round(KE, 2)}$ eV Å.`,
          answer: round(U, 2), tol: 0.02, unit: 'eV', N, a,
          sol: `Sum over all $\\binom{${N}}{2} = ${N * (N - 1) / 2}$ pairs: a pair $m$ spacings apart contributes $(-1)^m ke^2/(ma)$, and there are $${N} - m$ such pairs. $\\sum = ${round(s, 4)}$, so $U = ${round(s, 4)}\\times${round(KE, 2)}/${a} = ${round(U, 2)}$ eV. As $N$ grows, the energy per ion approaches $-\\ln2\\,ke^2/a$ (Madelung constant $2\\ln2$ per pair).`,
          trap: 'Counting only nearest-neighbour pairs, or each pair twice.' };
      },
      verify: (p) => { let s = 0; for (let i = 0; i < p.N; i++) for (let j = i + 1; j < p.N; j++) s += ((j - i) % 2 ? -1 : 1) / (j - i); return s * KE / p.a; } },
    { id: 'bd-g08', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'bond types',
      make(r) {
        const m = choose(r, [['NaCl', 'ionic'], ['MgO', 'ionic'], ['KBr', 'ionic'], ['LiF', 'ionic'], ['diamond', 'covalent'], ['silicon', 'covalent'], ['germanium', 'covalent'], ['solid argon', 'van der Waals'], ['solid neon', 'van der Waals'], ['solid methane', 'van der Waals'], ['solid xenon', 'van der Waals'], ['copper', 'metallic'], ['sodium', 'metallic'], ['aluminium', 'metallic'], ['ice', 'hydrogen'], ['solid HF', 'hydrogen']]);
        const all = ['ionic', 'covalent', 'van der Waals', 'metallic', 'hydrogen'];
        const o = mcqOptions(r, m[1], all.filter((x) => x !== m[1]), (s) => `${s} bonding`);
        const why = { ionic: 'one atom gives up electrons to the other and the ions attract by Coulomb forces', covalent: 'neighbouring atoms share electron pairs in directional bonds', 'van der Waals': 'closed-shell atoms or molecules attract only through fluctuating dipoles', metallic: 'the valence electrons are shared by all the ion cores', hydrogen: 'a hydrogen atom between two electronegative atoms links neighbouring molecules' };
        return { q: `The main type of bonding in ${m[0]} is`, ...o, sol: `In ${m[0]}, ${why[m[1]]}: ${m[1]} bonding.`, trap: 'Judging by hardness alone: strong bonds of several kinds give hard solids.' };
      } },
    { id: 'bd-g09', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'general potential',
      make(r) {
        const [m, n] = choose(r, [[1, 9], [1, 8], [1, 10], [6, 12], [6, 9], [1, 12], [2, 8]]);
        const r0 = pick(r, 2.0, 4.0, 0.05), A = pick(r, 2, 20, 0.5);
        const U0 = -A / r0 ** m * (1 - m / n);
        return { q: `Two atoms interact through $U(r) = -A/r^{${m}} + B/r^{${n}}$, with $A = ${A}$ eV Å$^{${m}}$ and $B$ chosen so that the minimum lies at $r_0 = ${r0}$ Å. The energy at the minimum is ______ eV (to three decimal places, with sign).`,
          answer: round(U0, 3), tol: Math.max(0.001, round(Math.abs(U0) * 0.003, 3)), unit: 'eV', m, n, r0, A,
          sol: `$dU/dr = 0$ at $r_0$: $${m}A/r_0^{${m + 1}} = ${n}B/r_0^{${n + 1}}$, so $B/r_0^{${n}} = \\tfrac{${m}}{${n}}A/r_0^{${m}}$. Then $U(r_0) = -\\dfrac{A}{r_0^{${m}}}\\left(1 - \\dfrac{${m}}{${n}}\\right) = -${round(A / r0 ** m, 4)}\\times${round(1 - m / n, 4)} = ${round(U0, 3)}$ eV. No need to find $B$ itself.`,
          trap: 'Forgetting that the repulsion cancels a fraction $m/n$ of the attraction at the minimum.' };
      },
      verify: (p) => -p.A / p.r0 ** p.m * (1 - p.m / p.n) },
    { id: 'bd-g10', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Lennard-Jones solid',
      make(r) {
        const gas = choose(r, [['Ne', 3.1, 2.74], ['Ar', 10.4, 3.40], ['Kr', 14.0, 3.65], ['Xe', 20.0, 3.98]]), ask = choose(r, ['R0', 'U']);
        const R0 = (2 * A12 / A6) ** (1 / 6) * gas[2], U = gas[1] * A6 ** 2 / (2 * A12);
        return ask === 'R0'
          ? { q: `Solid ${gas[0]} is fcc. With Lennard-Jones $\\sigma = ${gas[2]}$ Å and the fcc lattice sums $A_{12} = 12.13$, $A_6 = 14.45$, the equilibrium nearest-neighbour distance is ______ Å (to two decimal places).`, answer: round(R0, 2), tol: 0.01, unit: 'Å', s: gas[2], e: gas[1], ask,
            sol: `$U = 2N\\varepsilon[A_{12}(\\sigma/R)^{12} - A_6(\\sigma/R)^6]$ is lowest at $(\\sigma/R_0)^6 = A_6/(2A_{12})$, so $R_0 = (2A_{12}/A_6)^{1/6}\\sigma = 1.090\\times${gas[2]} = ${round(R0, 2)}$ Å.`, trap: 'Using the isolated-pair minimum $2^{1/6}\\sigma$.' }
          : { q: `Solid ${gas[0]} is fcc. With Lennard-Jones $\\varepsilon = ${gas[1]}$ meV and the fcc lattice sums $A_{12} = 12.13$, $A_6 = 14.45$, the static-lattice cohesive energy per atom is ______ meV (to one decimal place).`, answer: round(U, 1), tol: 0.1, unit: 'meV', s: gas[2], e: gas[1], ask,
            sol: `At $R_0$, $U/N = -\\varepsilon A_6^2/(2A_{12}) = -8.61\\varepsilon = -8.61\\times${gas[1]} = -${round(U, 1)}$ meV, so the cohesive energy is ${round(U, 1)} meV per atom (zero-point motion lowers the real value, most for Ne).`, trap: 'Using $6\\varepsilon$ from nearest neighbours only.' };
      },
      verify: (p) => (p.ask === 'R0' ? (2 * A12 / A6) ** (1 / 6) * p.s : p.e * A6 ** 2 / (2 * A12)) },
    { id: 'bd-g11', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Born-Mayer',
      make(r) {
        const s = choose(r, Object.keys(MAD)), al = MAD[s], r0 = pick(r, 2.0, 3.6, 0.01), rho = pick(r, 0.28, 0.36, 0.005);
        const E = al * KE / r0 * (1 - rho / r0);
        return { q: `A ${s} crystal ($\\alpha = ${al}$) has repulsion of Born-Mayer form $\\lambda e^{-r/\\rho}$ with $\\rho = ${rho}$ Å, and $r_0 = ${r0}$ Å. Its binding energy per ion pair is ______ eV (to two decimal places). Use $ke^2 = ${round(KE, 2)}$ eV Å.`,
          answer: round(E, 2), tol: 0.02, unit: 'eV', al, r0, rho,
          sol: `Equilibrium gives repulsive energy $= \\alpha ke^2\\rho/r_0^2$, so $-U(r_0) = \\dfrac{\\alpha ke^2}{r_0}\\left(1 - \\dfrac\\rho{r_0}\\right) = ${round(al * KE / r0, 3)}\\times${round(1 - rho / r0, 4)} = ${round(E, 2)}$ eV.`,
          trap: 'Taking the repulsion as zero at $r_0$, or as $\\lambda$ itself.' };
      },
      verify: (p) => p.al * KE / p.r0 * (1 - p.rho / p.r0) },
    { id: 'bd-g12', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'force constant',
      make(r) {
        const gas = choose(r, [['Ne', 3.1, 2.74, 20.18], ['Ar', 10.4, 3.40, 39.95], ['Kr', 14.0, 3.65, 83.80], ['Xe', 20.0, 3.98, 131.29]]);
        const k = 72 * gas[1] / 1000 * C.e / (2 ** (1 / 3) * (gas[2] * 1e-10) ** 2), mu = gas[3] / 2 * C.u;
        const nu = Math.sqrt(k / mu) / (2 * Math.PI) / 1e12;
        return { q: `Model a ${gas[0]}$_2$ dimer with a Lennard-Jones potential ($\\varepsilon = ${gas[1]}$ meV, $\\sigma = ${gas[2]}$ Å, atomic mass ${gas[3]} u). Its small-oscillation frequency $\\nu$ is ______ THz (to three decimal places).`,
          answer: round(nu, 3), tol: 0.003, unit: 'THz', e: gas[1], s: gas[2], M: gas[3],
          sol: `$k = U\'\'(r_0) = 72\\varepsilon/(2^{1/3}\\sigma^2) = ${round(k, 4)}$ N/m. Reduced mass $\\mu = m/2 = ${round(gas[3] / 2, 3)}$ u $= ${round(mu * 1e27, 3)}\\times10^{-27}$ kg. $\\nu = \\dfrac1{2\\pi}\\sqrt{k/\\mu} = ${round(nu, 3)}$ THz.`,
          trap: 'Using the atomic mass instead of the reduced mass $m/2$.' };
      },
      verify: (p) => Math.sqrt(72 * p.e / 1000 * C.e / (2 ** (1 / 3) * (p.s * 1e-10) ** 2) / (p.M / 2 * C.u)) / (2 * Math.PI) / 1e12 },
    ...more,
    ...r4.gens,
  ],
};
