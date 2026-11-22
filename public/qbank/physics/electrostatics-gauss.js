// Electric fields and Gauss's law: Coulomb's law, superposition, field lines, flux, Gauss's law for spheres,
// cylinders and planes, non-uniform charge densities, the differential form div E = rho/eps0, dipole fields.
// Original questions for IIT JAM, GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round, fmt, C } from '../_util.js';

const K = 1 / (4 * Math.PI * C.eps0); // Coulomb constant, 8.988e9 N m^2 C^-2

export default {
  topic: 'electrostatics-gauss',
  items: [
    // ---------- level 1 ----------
    { id: 'esg-001', type: 'mcq', level: 1, exams: ['jam'], sub: 'coulomb and superposition',
      q: 'Point charges $+2\\,\\mu\\text{C}$ and $+8\\,\\mu\\text{C}$ are fixed 30 cm apart. The electric field is zero at a point',
      options: ['between them, 10 cm from the $2\\,\\mu$C charge', 'between them, 20 cm from the $2\\,\\mu$C charge', 'outside them, 10 cm beyond the $2\\,\\mu$C charge', 'nowhere at a finite distance'], answer: 0,
      sol: 'Between two like charges the fields point opposite ways, so they can cancel there. At distance $x$ from the smaller charge: $\\dfrac{2}{x^2} = \\dfrac{8}{(0.3 - x)^2}$, so $\\dfrac{0.3 - x}{x} = 2$ and $x = 0.1$ m. The zero is nearer the smaller charge, as it must be.',
      trap: 'Putting the null point nearer the bigger charge (20 cm). The weaker charge needs the shorter distance to match the stronger one.' },
    { id: 'esg-002', type: 'nat', level: 1, exams: ['jam'], sub: 'coulomb and superposition', unit: 'kV/m',
      q: 'The magnitude of the electric field 3.0 cm from a point charge of 1.0 nC, in kV/m, is ______ (to two decimal places).',
      answer: 9.99, tol: 0.1, calc: () => K * 1e-9 / 0.03 ** 2 / 1000,
      sol: '$E = \\dfrac{q}{4\\pi\\epsilon_0 r^2} = \\dfrac{(8.99\\times10^9)(1.0\\times10^{-9})}{(0.03)^2} = \\dfrac{8.99}{9\\times10^{-4}} \\approx 9.99\\times10^3$ N/C $= 9.99$ kV/m.',
      trap: 'Using 3 instead of 0.03 m, or forgetting to square $r$.' },
    { id: 'esg-003', type: 'mcq', level: 1, exams: ['jam', 'gate'], sub: 'gauss law',
      q: 'A closed surface encloses charges of $+3$ nC and $-5$ nC. A charge of $+7$ nC sits just outside the surface. The net electric flux out of the surface is',
      options: ['$+5\\text{ nC}/\\epsilon_0$', '$-2\\text{ nC}\\times\\epsilon_0$', '$-2\\text{ nC}/\\epsilon_0$', 'zero, because field lines from the outside charge pass through'], answer: 2,
      sol: 'Gauss\'s law: $\\oint\\vec E\\cdot d\\vec a = Q_{\\text{enc}}/\\epsilon_0$. Only enclosed charge counts: $Q_{\\text{enc}} = 3 - 5 = -2$ nC. The outside charge changes the field on the surface but every line it sends in also leaves, so its net flux is zero.',
      trap: 'Adding the outside charge (giving $+5$), or multiplying by $\\epsilon_0$ instead of dividing.' },
    { id: 'esg-004', type: 'mcq', level: 1, exams: ['jam'], sub: 'flux',
      q: 'The SI unit of electric flux is',
      options: ['N/C', 'C/m$^2$', 'N m/C', 'V m'], answer: 3,
      sol: 'Flux is field times area: (N/C)(m$^2$) = N m$^2$/C. Since 1 N/C = 1 V/m, this is also (V/m)(m$^2$) = V m.',
      trap: 'C/m$^2$ is the unit of surface charge density (and of $\\epsilon_0 E$), not of flux.' },
    { id: 'esg-005', type: 'msq', level: 1, exams: ['jam'], sub: 'field lines',
      q: 'Which of these statements about electrostatic field lines are correct?',
      options: ['They begin on positive charges and end on negative charges (or go to infinity).', 'Two field lines can cross at a point where the field is not zero.', 'Where the lines are closer together, the field is stronger.', 'A positive charge released from rest always moves along the field line through its starting point.'], answer: [0, 2],
      sol: 'A and C are the basic rules of field-line pictures. B is false: at a crossing the field would have two directions at once. D is false in general: a released charge starts along the field line, but once it has velocity its inertia carries it off a curved line (it only follows straight lines exactly).',
      trap: 'D sounds natural. Field lines show the direction of force (acceleration), not of velocity.' },
    { id: 'esg-006', type: 'nat', level: 1, exams: ['jam'], sub: 'flux', unit: '$10^4$ N m$^2$/C',
      q: 'A point charge of $3.0\\,\\mu$C sits at the centre of a cube. The electric flux through one face of the cube, in units of $10^4$ N m$^2$/C, is ______ (to two decimal places).',
      answer: 5.65, tol: 0.05, calc: () => 3e-6 / (6 * C.eps0) / 1e4,
      sol: 'Total flux through the closed cube is $q/\\epsilon_0$. By symmetry the six faces share it equally: $\\dfrac{q}{6\\epsilon_0} = \\dfrac{3.0\\times10^{-6}}{6\\times8.854\\times10^{-12}} = 5.65\\times10^4$ N m$^2$/C.' },

    // ---------- level 2 ----------
    { id: 'esg-007', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'gauss law: cylinders',
      q: 'The electric field at distance $s$ from a very long straight wire carrying charge $\\lambda$ per unit length is',
      options: ['$\\dfrac{\\lambda}{4\\pi\\epsilon_0 s^2}$', '$\\dfrac{\\lambda}{2\\pi\\epsilon_0 s}$', '$\\dfrac{\\lambda}{2\\epsilon_0}$', '$\\dfrac{\\lambda}{\\pi\\epsilon_0 s}$'], answer: 1,
      sol: 'Use a coaxial cylinder of radius $s$ and length $L$. The field is radial, so only the curved side has flux: $E(2\\pi sL) = \\lambda L/\\epsilon_0$, giving $E = \\lambda/(2\\pi\\epsilon_0 s)$.',
      trap: 'The $1/s^2$ law belongs to point charges; a line charge falls off only as $1/s$.' },
    { id: 'esg-008', type: 'nat', level: 2, exams: ['jam'], sub: 'gauss law: planes', unit: '$10^5$ N/C',
      q: 'A very large flat sheet carries a uniform charge of $4.0\\,\\mu$C/m$^2$. The field magnitude 2 cm from the sheet, in units of $10^5$ N/C, is ______ (to two decimal places).',
      answer: 2.26, tol: 0.02, calc: () => 4e-6 / (2 * C.eps0) / 1e5,
      sol: 'A pillbox straddling the sheet has flux $2EA$ (both faces) and encloses $\\sigma A$: $E = \\dfrac{\\sigma}{2\\epsilon_0} = \\dfrac{4.0\\times10^{-6}}{2\\times8.854\\times10^{-12}} = 2.26\\times10^5$ N/C. The 2 cm does not matter: the field of an infinite sheet does not depend on distance.',
      trap: '$\\sigma/\\epsilon_0$ (twice too big) is the field just outside a conductor, where all the flux leaves on one side.' },
    { id: 'esg-009', type: 'mcq', level: 2, exams: ['jam'], sub: 'gauss law: spheres',
      q: 'A non-conducting sphere of radius $R$ is uniformly charged through its volume. The field at $r = R/2$ is what fraction of the field at the surface?',
      options: ['$1/4$', '$1/8$', '$1/2$', '$2$'], answer: 2,
      sol: 'Inside, $Q_{\\text{enc}} = Q r^3/R^3$, so $E = \\dfrac{Q r}{4\\pi\\epsilon_0R^3}$, which grows linearly with $r$. At $R/2$ it is half the surface value.',
      trap: 'Using $1/r^2$ inside ($4\\times$) or the enclosed-charge fraction ($1/8$) without dividing by the smaller area.' },
    { id: 'esg-010', type: 'mcq', level: 2, exams: ['jam'], sub: 'gauss law: spheres',
      q: 'A thin spherical shell of radius $R$ carries charge $Q$ spread uniformly. Which description of the field magnitude $E(r)$ is correct?',
      options: ['It rises linearly from zero at the centre to $Q/(4\\pi\\epsilon_0R^2)$ at $r = R$, then falls as $1/r^2$.', 'It is zero for $r < R$, jumps to $Q/(4\\pi\\epsilon_0R^2)$ just outside, then falls as $1/r^2$.', 'It is constant at $Q/(4\\pi\\epsilon_0R^2)$ inside and falls as $1/r^2$ outside.', 'It falls as $1/r^2$ everywhere, as if all the charge were at the centre.'], answer: 1,
      sol: 'A Gaussian sphere inside the shell encloses no charge, and by symmetry $E$ is the same all over it, so $E = 0$. Outside, the shell acts as a point charge at the centre. The jump at $r = R$ equals $\\sigma/\\epsilon_0$, the jump across any surface charge.',
      trap: 'Option A is the uniformly charged solid sphere, not the shell.' },
    { id: 'esg-011', type: 'nat', level: 2, exams: ['jam'], sub: 'coulomb and superposition', unit: 'N/C',
      q: 'Charges of $+1.0$ nC each are fixed at $(-1\\text{ m}, 0)$ and $(+1\\text{ m}, 0)$. The magnitude of the electric field at $(0, 1\\text{ m})$ is ______ N/C (to two decimal places).',
      answer: 6.36, tol: 0.06, calc: () => K * 1e-9 / 2 * Math.SQRT1_2 * 2,
      sol: 'Each charge is $\\sqrt2$ m away, so each gives $\\dfrac{kq}{2} = 4.49$ N/C, at $45^\\circ$ to the $y$-axis. The $x$-components cancel; the $y$-components add: $E = 2\\times4.49\\times\\cos45^\\circ = \\dfrac{kq}{\\sqrt2} \\approx 6.36$ N/C, along $+y$.',
      trap: 'Adding the magnitudes ($8.99$) without resolving into components.' },
    { id: 'esg-012', type: 'msq', level: 2, exams: ['jam', 'gate'], sub: 'gauss law',
      q: 'Which statements about Gauss\'s law $\\oint\\vec E\\cdot d\\vec a = Q_{\\text{enc}}/\\epsilon_0$ are correct?',
      options: ['It holds for every closed surface, whatever its shape.', 'The $\\vec E$ in it is the field produced by the enclosed charges only.', 'The total flux depends only on the charge inside.', 'With it alone one can find $\\vec E$ for any charge distribution.'], answer: [0, 2],
      sol: 'A and C are the content of the law. B is false: $\\vec E$ is the total field from all charges, inside and outside; the outside charges just contribute zero net flux. D is false: Gauss\'s law gives one number (the flux); it determines $\\vec E$ only when symmetry tells you $E$ is constant on a suitable surface.',
      trap: 'B is the most common misreading of Gauss\'s law.' },
    { id: 'esg-013', type: 'mcq', level: 2, exams: ['jam'], sub: 'flux',
      q: 'A closed cylinder of radius $R$ sits in a uniform field $E$ parallel to its axis. The net outward flux, and the outward flux through the end face where the field enters, are',
      options: ['$0$ and $-\\pi R^2E$', '$0$ and $+\\pi R^2E$', '$2\\pi R^2E$ and $\\pi R^2E$', '$0$ and $0$'], answer: 0,
      sol: 'There is no charge inside, so the net flux is zero. On the entry face the outward normal points against $\\vec E$: flux $= -E\\pi R^2$. The exit face gives $+E\\pi R^2$, and the curved side gives zero because $\\vec E$ is parallel to it.',
      trap: 'Outward flux through the face where lines go in is negative.' },
    { id: 'esg-014', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'dipole', unit: '$10^8$ N/C',
      q: 'A molecule has a dipole moment $p = 1.0\\times10^{-29}$ C m. The field it produces 1.0 nm away along its axis is ______ $\\times10^8$ N/C (to two decimal places; use the far-field formula).',
      answer: 1.80, tol: 0.02, calc: () => 2 * K * 1e-29 / 1e-27 / 1e8,
      sol: 'On the axis, $E = \\dfrac{2p}{4\\pi\\epsilon_0 r^3} = \\dfrac{2(8.99\\times10^9)(10^{-29})}{(10^{-9})^3} = 1.80\\times10^8$ N/C.',
      trap: 'Using the equatorial formula $p/(4\\pi\\epsilon_0 r^3)$, which is half as big.' },
    { id: 'esg-015', type: 'mcq', level: 2, exams: ['jam'], sub: 'dipole',
      q: 'At the same large distance $r$ from a small dipole $\\vec p$, compare the field on the axis with the field on the perpendicular bisector (equatorial line).',
      options: ['Axial field is twice the equatorial; the axial field is along $\\vec p$, the equatorial field opposite to $\\vec p$.', 'They are equal in size and both along $\\vec p$.', 'Axial field is twice the equatorial; both point along $\\vec p$.', 'Equatorial field is twice the axial; both point opposite to $\\vec p$.'], answer: 0,
      sol: '$E_{\\text{axis}} = \\dfrac{2p}{4\\pi\\epsilon_0r^3}$ along $\\vec p$; $E_{\\text{eq}} = \\dfrac{p}{4\\pi\\epsilon_0r^3}$ opposite to $\\vec p$. On the bisector the two charges\' fields have equal size, and their sum points from the $+$ end\'s side towards the $-$ end\'s side, which is $-\\vec p$.' },
    { id: 'esg-016', type: 'nat', level: 2, exams: ['jam'], sub: 'charge density',
      q: 'A sphere of radius $R$ has charge density $\\rho = \\rho_0\\,r/R$. Its total charge is $k\\pi\\rho_0R^3$. Find $k$.',
      answer: 1, tol: 0,
      sol: '$Q = \\int_0^R \\rho_0\\frac{r}{R}\\,4\\pi r^2\\,dr = \\frac{4\\pi\\rho_0}{R}\\cdot\\frac{R^4}{4} = \\pi\\rho_0R^3$, so $k = 1$.',
      trap: 'Multiplying $\\rho$ by the whole volume $\\tfrac43\\pi R^3$; the density varies, so you must integrate shell by shell.' },

    // ---------- level 3 ----------
    { id: 'esg-017', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'charge density', unit: 'N/C',
      q: 'A sphere of radius $R = 0.10$ m has charge density $\\rho = \\rho_0 r/R$ with $\\rho_0 = 2.0\\,\\mu$C/m$^3$. The field magnitude at $r = 5.0$ cm is ______ N/C (to the nearest whole number).',
      answer: 1412, tol: 15, calc: () => 2e-6 * 0.05 ** 2 / (4 * C.eps0 * 0.1),
      sol: 'Charge inside radius $r$: $Q(r) = \\int_0^r\\rho_0\\frac{r\'}{R}4\\pi r\'^2dr\' = \\pi\\rho_0 r^4/R$. Gauss: $E\\,4\\pi r^2 = Q(r)/\\epsilon_0$, so $E = \\dfrac{\\rho_0r^2}{4\\epsilon_0R} = \\dfrac{(2\\times10^{-6})(0.05)^2}{4(8.854\\times10^{-12})(0.1)} \\approx 1412$ N/C.',
      trap: 'Using the uniform-sphere result $\\rho r/(3\\epsilon_0)$ with the local density.' },
    { id: 'esg-018', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'gauss law: planes',
      q: 'An infinite slab occupies $-d \\le x \\le d$ with uniform charge density $\\rho$. The field magnitude at a point inside, at distance $x$ from the mid-plane, and outside the slab are',
      options: ['$\\rho x/\\epsilon_0$ inside, $\\rho d/\\epsilon_0$ outside', '$\\rho x/(2\\epsilon_0)$ inside, $\\rho d/(2\\epsilon_0)$ outside', '$\\rho d/\\epsilon_0$ inside and outside', '$\\rho x/\\epsilon_0$ inside, $\\rho d/(\\epsilon_0 x)$ outside'], answer: 0,
      sol: 'By symmetry $E = 0$ on the mid-plane and points away from it. A pillbox from $-x$ to $+x$ has flux $2EA$ and encloses $\\rho(2x)A$, so $E = \\rho x/\\epsilon_0$. Outside, the enclosed charge stops growing at $\\rho(2d)A$, so $E = \\rho d/\\epsilon_0$, constant like a sheet with $\\sigma = 2\\rho d$.',
      trap: 'Halving twice: the pillbox has two faces, but it also encloses charge from both sides of the mid-plane.' },
    { id: 'esg-019', type: 'mcq', level: 3, exams: ['jam'], sub: 'gauss law: cylinders',
      q: 'A long wire of radius $a$ with charge $+\\lambda$ per length is surrounded by a coaxial thin cylindrical shell of radius $b$ with charge $-\\lambda$ per length. Which is correct?',
      options: ['$E = \\lambda/(2\\pi\\epsilon_0 s)$ for $a<s<b$, and $E = 0$ for $s > b$', '$E = 0$ for $a<s<b$, and $E = \\lambda/(2\\pi\\epsilon_0 s)$ for $s>b$', '$E = \\lambda/(2\\pi\\epsilon_0 s)$ everywhere outside the wire', '$E = \\lambda/(\\pi\\epsilon_0 s)$ for $s > b$'], answer: 0,
      sol: 'A Gaussian cylinder between the conductors encloses $+\\lambda L$, giving the usual line-charge field. Outside both, the enclosed charge is $\\lambda L - \\lambda L = 0$, and by symmetry $E = 0$. This is why a coaxial cable keeps its field inside.' },
    { id: 'esg-020', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'conductors',
      q: 'A neutral conducting sphere has an off-centre cavity containing a point charge $q$. Which are correct?',
      options: ['The total induced charge on the cavity wall is $-q$.', 'A charge $+q$ appears on the outer surface, spread uniformly.', 'The field inside the conducting material is zero.', 'The field outside the sphere depends on where $q$ sits in the cavity.'], answer: [0, 1, 2],
      sol: 'C: the field in a conductor in equilibrium vanishes. A: a Gaussian surface inside the metal surrounding the cavity has zero flux, so it encloses zero charge: the wall carries $-q$. B: the sphere is neutral, so $+q$ goes to the outer surface; the metal shields the outer surface from the cavity, so this charge spreads uniformly over the sphere. D is false: outside, the field is that of $q$ at the centre, whatever the position inside.',
      trap: 'D: the cavity wall\'s charge is lopsided, but the outer surface\'s is not.' },
    { id: 'esg-021', type: 'nat', level: 3, exams: ['jam'], sub: 'flux', unit: '$10^4$ N m$^2$/C',
      q: 'A square plate of side $a$ is placed a distance $a/2$ from a point charge $q = 1.0\\,\\mu$C, with the charge on the perpendicular through the plate\'s centre. The flux through the plate is ______ $\\times10^4$ N m$^2$/C (to two decimal places).',
      answer: 1.88, tol: 0.02, calc: () => 1e-6 / (6 * C.eps0) / 1e4,
      sol: 'Imagine five more such plates making a cube of side $a$ with $q$ at the centre. The plate is one face, so it gets $q/(6\\epsilon_0) = \\dfrac{10^{-6}}{6(8.854\\times10^{-12})} = 1.88\\times10^4$ N m$^2$/C. No integral needed.',
      trap: 'Trying $E\\times$area with $E$ at the centre of the plate: the field varies over the plate.' },
    { id: 'esg-022', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'flux',
      q: 'A point charge $q$ sits at one corner of a cube. The flux through one face of the cube that does not touch the charge is',
      options: ['$q/(6\\epsilon_0)$', '$q/(8\\epsilon_0)$', '$q/(24\\epsilon_0)$', '$0$'], answer: 2,
      sol: 'Eight such cubes around the corner make a big cube with $q$ at its centre, so one small cube gets $q/(8\\epsilon_0)$. The three faces that meet at the charge have the field lying in them: zero flux. The other three share $q/(8\\epsilon_0)$ equally: $q/(24\\epsilon_0)$ each.',
      trap: '$q/(8\\epsilon_0)$ is for the whole cube, not one face.' },
    { id: 'esg-023', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'differential form', unit: 'pC',
      q: 'In a region the electric field is $\\vec E = a x\\,\\hat i$ with $a = 200$ N C$^{-1}$ m$^{-1}$. The charge inside the cube $0 \\le x, y, z \\le 0.5$ m is ______ pC (to one decimal place).',
      answer: 221.4, tol: 2, calc: () => C.eps0 * 200 * 0.125 * 1e12,
      sol: 'Flux: on the face $x = 0.5$, $E = 100$ N/C outward, area 0.25 m$^2$: 25 N m$^2$/C. On $x = 0$, $E = 0$. Other faces: $\\vec E$ parallel to them. So $Q = \\epsilon_0\\times25 = 2.214\\times10^{-10}$ C $= 221.4$ pC. (Or: $\\rho = \\epsilon_0\\nabla\\cdot\\vec E = \\epsilon_0 a$, times volume 0.125 m$^3$.)' },
    { id: 'esg-024', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'differential form',
      q: 'The field in a region is $\\vec E = c\\,r^3\\,\\hat r$ (spherical coordinates, $c$ constant). The charge density there is',
      options: ['$3\\epsilon_0 c r^2$', '$5\\epsilon_0 c r^2$', '$\\epsilon_0 c r^2$', '$6\\epsilon_0cr^2$'], answer: 1,
      sol: '$\\rho = \\epsilon_0\\nabla\\cdot\\vec E = \\epsilon_0\\dfrac{1}{r^2}\\dfrac{d}{dr}(r^2\\cdot cr^3) = \\epsilon_0\\dfrac{5cr^4}{r^2} = 5\\epsilon_0cr^2$.',
      trap: 'Taking $dE_r/dr = 3cr^2$ and forgetting the $1/r^2\\,d(r^2\\cdot)/dr$ form of the spherical divergence.' },
    { id: 'esg-025', type: 'nat', level: 3, exams: ['jam'], sub: 'gauss law: planes', unit: '$10^5$ N/C',
      q: 'Two large parallel sheets carry uniform charges $+3.0\\,\\mu$C/m$^2$ and $-1.0\\,\\mu$C/m$^2$. The field magnitude in the region outside both sheets is ______ $\\times10^5$ N/C (to two decimal places).',
      answer: 1.13, tol: 0.02, calc: () => 2e-6 / (2 * C.eps0) / 1e5,
      sol: 'Each sheet gives $\\sigma/(2\\epsilon_0)$, pointing away from a positive sheet and towards a negative one. Outside (on either side) the two fields point opposite ways: $E = \\dfrac{3 - 1}{2\\epsilon_0}\\times10^{-6} = \\dfrac{2\\times10^{-6}}{2(8.854\\times10^{-12})} = 1.13\\times10^5$ N/C. Between the sheets they add: $(3 + 1)/(2\\epsilon_0)\\times10^{-6} = 2.26\\times10^5$ N/C.',
      trap: 'Remembering only the capacitor result (zero outside), which holds for equal and opposite charges.' },
    { id: 'esg-026', type: 'mcq', level: 3, exams: ['jam'], sub: 'continuous distributions',
      q: 'A ring of radius $R$ carries charge $Q$ uniformly. Along its axis, the field is largest at a distance from the centre of',
      options: ['$R$', '$R/2$', '$R/\\sqrt2$', '$\\sqrt2\\,R$'], answer: 2,
      sol: 'On the axis $E(z) = \\dfrac{Qz}{4\\pi\\epsilon_0(R^2+z^2)^{3/2}}$. Setting $dE/dz = 0$: $(R^2+z^2) - 3z^2 = 0$, so $z = R/\\sqrt2$. The field is zero at the centre (by symmetry) and at infinity, so this is the maximum.' },
    { id: 'esg-027', type: 'nat', level: 3, exams: ['jam'], sub: 'continuous distributions', unit: 'N/C',
      q: 'A ring of radius 0.30 m carries 10 nC uniformly. The field on its axis 0.40 m from the centre is ______ N/C (to the nearest whole number).',
      answer: 288, tol: 3, calc: () => K * 1e-8 * 0.4 / (0.3 ** 2 + 0.4 ** 2) ** 1.5,
      sol: 'Only the axial components survive: $E = \\dfrac{kQz}{(R^2+z^2)^{3/2}} = \\dfrac{(8.99\\times10^9)(10^{-8})(0.4)}{(0.25)^{3/2}} = \\dfrac{35.95}{0.125} \\approx 288$ N/C.',
      trap: 'Using $kQ/(R^2+z^2)$ without the factor $z/\\sqrt{R^2+z^2}$ that picks the axial component (gives 360).' },
    { id: 'esg-028', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'gauss law',
      q: 'For which of these charge distributions can the electric field be found from Gauss\'s law alone?',
      options: ['An infinitely long, uniformly charged straight line', 'A uniformly charged rod of finite length', 'A sphere whose density depends only on $r$, $\\rho(r)$', 'A uniformly charged solid cube'], answer: [0, 2],
      sol: 'Gauss\'s law fixes the field only when symmetry makes $|\\vec E|$ constant over a closed surface and fixes its direction: cylindrical symmetry (infinite line) and spherical symmetry (any $\\rho(r)$). A finite rod and a cube have no such surface; Gauss\'s law is still true for them but you need Coulomb\'s law to get $\\vec E$.' },

    // ---------- level 4 ----------
    { id: 'esg-029', type: 'mcq', level: 4, exams: ['jam', 'gate', 'net'], sub: 'superposition tricks',
      q: 'A uniformly charged sphere (density $\\rho$) has a spherical cavity cut out of it. The cavity\'s centre is displaced by $\\vec d$ from the sphere\'s centre. The field inside the cavity is',
      options: ['zero', '$\\dfrac{\\rho\\,\\vec d}{3\\epsilon_0}$, the same everywhere in the cavity', '$\\dfrac{\\rho\\,\\vec r}{3\\epsilon_0}$ where $\\vec r$ is measured from the sphere\'s centre', '$\\dfrac{\\rho\\,\\vec d}{\\epsilon_0}$, the same everywhere in the cavity'], answer: 1,
      sol: 'Treat the cavity as the full sphere ($+\\rho$) plus a small sphere of $-\\rho$. At a point with position $\\vec r$ from the big centre and $\\vec r\\,\' = \\vec r - \\vec d$ from the cavity centre: $\\vec E = \\dfrac{\\rho\\vec r}{3\\epsilon_0} - \\dfrac{\\rho\\vec r\\,\'}{3\\epsilon_0} = \\dfrac{\\rho\\vec d}{3\\epsilon_0}$, uniform.',
      trap: 'Answering zero by analogy with a shell; the cavity is not concentric and the charge is not on a thin shell.' },
    { id: 'esg-030', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'superposition tricks', unit: 'N/C',
      q: 'For the sphere with an off-centre cavity (previous idea), $\\rho = 1.0\\,\\mu$C/m$^3$ and the centres are 5.0 cm apart. The field in the cavity is ______ N/C (to the nearest whole number).',
      answer: 1882, tol: 19, calc: () => 1e-6 * 0.05 / (3 * C.eps0),
      sol: '$E = \\dfrac{\\rho d}{3\\epsilon_0} = \\dfrac{(10^{-6})(0.05)}{3(8.854\\times10^{-12})} \\approx 1882$ N/C, pointing along the line from the sphere\'s centre to the cavity\'s centre.' },
    { id: 'esg-031', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'differential form',
      q: 'Which of these could be an electrostatic field ($c$ is a non-zero constant)?',
      options: ['$c\\,(y\\,\\hat i - x\\,\\hat j)$', '$c\\,(x^2\\,\\hat i + xy\\,\\hat j)$', '$c\\,(y\\,\\hat i + x\\,\\hat j)$', '$c\\,(z\\,\\hat i + x\\,\\hat j)$'], answer: 2,
      sol: 'An electrostatic field must have zero curl. Curl of $c(y, x, 0)$: $z$-component $\\partial_x(x) - \\partial_y(y) = 0$, others zero; it is $-\\nabla(-cxy)$. The others: $c(y,-x,0)$ has curl $-2c\\,\\hat k$; $c(x^2, xy, 0)$ has curl $cy\\,\\hat k$; $c(z, x, 0)$ has curl $c(0, 1, 1)$.',
      trap: 'Checking the divergence instead: divergence tells you the charge density, curl tells you whether the field can be electrostatic at all.' },
    { id: 'esg-032', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'differential form', unit: 'nC/m$^3$',
      q: 'The electrostatic field in a region is $\\vec E = \\alpha\\,(x\\,\\hat i + 2y\\,\\hat j - z\\,\\hat k)$ with $\\alpha = 100$ V/m$^2$. The charge density is ______ nC/m$^3$ (to two decimal places).',
      answer: 1.77, tol: 0.02, calc: () => 2 * C.eps0 * 100 * 1e9,
      sol: '$\\nabla\\cdot\\vec E = \\alpha(1 + 2 - 1) = 2\\alpha$. So $\\rho = 2\\epsilon_0\\alpha = 2(8.854\\times10^{-12})(100) = 1.77\\times10^{-9}$ C/m$^3$. (The curl is zero, so this is a valid electrostatic field.)',
      trap: 'Missing the minus sign on the $z$ term gives $4\\alpha$.' },
    { id: 'esg-033', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'charge density',
      q: 'A sphere of radius $R$ has charge density $\\rho = A/r$ ($A$ a positive constant). Which are correct?',
      options: ['The field inside has the same magnitude $A/(2\\epsilon_0)$ at every radius.', 'The total charge is $2\\pi AR^2$.', 'Outside, the field falls as $1/r^2$.', 'The field at the centre is infinite, because $\\rho$ is.'], answer: [0, 1, 2],
      sol: '$Q(r) = \\int_0^r\\frac{A}{r\'}4\\pi r\'^2dr\' = 2\\pi Ar^2$. Gauss: $E = \\dfrac{2\\pi Ar^2}{4\\pi\\epsilon_0r^2} = \\dfrac{A}{2\\epsilon_0}$, constant. Total $Q = 2\\pi AR^2$ and outside it acts as a point charge. D is false: although $\\rho\\to\\infty$, the charge near the centre is tiny ($\\propto r^2$), and the field stays finite.',
      trap: 'An infinite density at a point does not mean an infinite field.' },
    { id: 'esg-034', type: 'mcq', level: 4, exams: ['jam'], sub: 'gauss law: cylinders',
      q: 'An infinite straight line carries charge $\\lambda$ per length. The flux through a sphere of radius $R$ whose centre lies on the line is',
      options: ['$\\lambda R/\\epsilon_0$', '$2\\lambda R/\\epsilon_0$', '$\\pi\\lambda R/\\epsilon_0$', '$0$, because the line enters and leaves'], answer: 1,
      sol: 'The sphere encloses a length $2R$ of the line (a diameter), carrying $2\\lambda R$. By Gauss\'s law the flux is $2\\lambda R/\\epsilon_0$, even though the field is not constant on the sphere.' },
    { id: 'esg-035', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'flux',
      q: 'A point charge $q$ is on the axis of a flat disc of radius $R$, at distance $h = R$ from its centre. The flux through the disc is $f\\,q/\\epsilon_0$. Find $f$ (to three decimal places).',
      answer: 0.146, tol: 0.002, calc: () => (1 - Math.SQRT1_2) / 2,
      sol: 'Flux = $q/\\epsilon_0$ times the fraction of the full solid angle $4\\pi$ that the disc covers. A cone of half-angle $\\theta$ covers $2\\pi(1-\\cos\\theta)$, so $f = \\tfrac12(1 - \\cos\\theta)$ with $\\cos\\theta = h/\\sqrt{h^2+R^2} = 1/\\sqrt2$: $f = \\tfrac12(1 - 0.7071) = 0.146$.',
      trap: 'Using the solid angle of a flat disc as area$/h^2$; that is only right for a tiny disc.' },
    { id: 'esg-036', type: 'mcq', level: 4, exams: ['jam'], sub: 'gauss law: cylinders',
      q: 'A very long solid cylinder of radius $R$ has uniform charge density $\\rho$. The field magnitude at distance $s$ from its axis is',
      options: ['$\\rho s/(2\\epsilon_0)$ inside and $\\rho R^2/(2\\epsilon_0s)$ outside', '$\\rho s/(3\\epsilon_0)$ inside and $\\rho R^3/(3\\epsilon_0s^2)$ outside', '$\\rho s/\\epsilon_0$ inside and $\\rho R/\\epsilon_0$ outside', '$\\rho R/(2\\epsilon_0)$ inside and $\\rho R^2/(2\\epsilon_0s)$ outside'], answer: 0,
      sol: 'Cylinder of radius $s$, length $L$: flux $E\\,2\\pi sL$. Inside it encloses $\\rho\\pi s^2L$, giving $E = \\rho s/(2\\epsilon_0)$; outside it encloses $\\rho\\pi R^2L$, giving $E = \\rho R^2/(2\\epsilon_0 s)$. The two agree at $s = R$.',
      trap: 'Option B is the sphere; cylinders give 2 where spheres give 3.' },
    { id: 'esg-037', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'limiting cases',
      q: 'A rod of length $L$ carries charge $Q$ uniformly. Without integrating, decide which expression gives the field at distance $d$ from the rod on its perpendicular bisector.',
      options: ['$\\dfrac{Q}{4\\pi\\epsilon_0(d^2 + L^2/4)}$', '$\\dfrac{Q}{2\\pi\\epsilon_0dL}$', '$\\dfrac{Qd}{4\\pi\\epsilon_0(d^2 + L^2/4)^{3/2}}$', '$\\dfrac{Q}{4\\pi\\epsilon_0d\\sqrt{d^2 + L^2/4}}$'], answer: 3,
      sol: 'Check two limits. Far away ($d\\gg L$) it must look like a point charge, $Q/(4\\pi\\epsilon_0d^2)$. Very close ($d\\ll L$) it must look like an infinite line with $\\lambda = Q/L$: $\\lambda/(2\\pi\\epsilon_0d) = Q/(2\\pi\\epsilon_0dL)$. Only D passes both. A tends to a constant near the rod, B fails far away, C tends to zero near the rod.',
      trap: 'C is the ring-axis form; it passes the far test but not the near one.' },

    // ---------- level 5 ----------
    { id: 'esg-038', type: 'nat', level: 5, exams: ['jam', 'gate', 'net'], sub: 'charge density',
      q: 'A sphere of radius $R$ has charge density $\\rho = \\rho_0(1 - r/R)$. The field magnitude is largest at $r = \\beta R$. Find $\\beta$ (to three decimal places).',
      answer: 0.667, tol: 0.005, calc: () => 2 / 3,
      sol: '$Q(r) = 4\\pi\\rho_0\\int_0^r(r\'^2 - r\'^3/R)dr\' = 4\\pi\\rho_0\\left(\\frac{r^3}{3} - \\frac{r^4}{4R}\\right)$. So $E = \\dfrac{\\rho_0}{\\epsilon_0}\\left(\\dfrac r3 - \\dfrac{r^2}{4R}\\right)$ inside. $dE/dr = \\tfrac13 - \\tfrac{r}{2R} = 0$ gives $r = 2R/3$. Outside, $E$ falls as $1/r^2$, so this inside maximum is the overall maximum.',
      trap: 'Assuming the maximum is at the surface, as it is for a uniform sphere.' },
    { id: 'esg-039', type: 'mcq', level: 5, exams: ['jam', 'gate', 'net'], sub: 'charge density',
      q: 'For the sphere with $\\rho = \\rho_0(1 - r/R)$, the ratio of the maximum field (inside) to the field at the surface is',
      options: ['$3/4$', '$4/3$', '$1$', '$9/8$'], answer: 1,
      sol: 'With $E = \\dfrac{\\rho_0}{\\epsilon_0}\\left(\\dfrac r3 - \\dfrac{r^2}{4R}\\right)$: at $r = 2R/3$, $E = \\dfrac{\\rho_0R}{\\epsilon_0}\\left(\\dfrac29 - \\dfrac19\\right) = \\dfrac{\\rho_0R}{9\\epsilon_0}$. At $r = R$, $E = \\dfrac{\\rho_0R}{\\epsilon_0}\\left(\\dfrac13 - \\dfrac14\\right) = \\dfrac{\\rho_0R}{12\\epsilon_0}$. Ratio $= 12/9 = 4/3$.' },
    { id: 'esg-040', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'differential form',
      q: 'In all space the field is $\\vec E = \\dfrac{A}{r}\\,\\hat r$ for $r > 0$ ($A$ a positive constant, spherical coordinates). Which are correct?',
      options: ['The charge density is $\\epsilon_0A/r^2$.', 'The charge inside a sphere of radius $r$ is $4\\pi\\epsilon_0Ar$.', 'The total charge in all space is finite.', 'The flux through a sphere of radius $r$ grows linearly with $r$.'], answer: [0, 1, 3],
      sol: 'A: $\\rho = \\epsilon_0\\dfrac{1}{r^2}\\dfrac{d}{dr}\\left(r^2\\dfrac Ar\\right) = \\dfrac{\\epsilon_0A}{r^2}$. B and D: flux $= E\\cdot4\\pi r^2 = 4\\pi Ar$, so $Q(r) = 4\\pi\\epsilon_0Ar$ (check: $\\int_0^r\\frac{\\epsilon_0A}{r\'^2}4\\pi r\'^2dr\' = 4\\pi\\epsilon_0Ar$, so there is no point charge at the origin). C is false: $Q(r)$ grows without limit.' },
    { id: 'esg-041', type: 'nat', level: 5, exams: ['jam', 'gate', 'net'], sub: 'superposition tricks',
      q: 'A point charge $q$ sits at the centre of a sphere of radius $R$ that is uniformly charged with density $\\rho > 0$. The field vanishes at $r = R/2$ if $q = -k\\,\\pi\\rho R^3$. Find $k$ (to three decimal places).',
      answer: 0.167, tol: 0.002, calc: () => 1 / 6,
      sol: 'The field at $r$ is zero when the enclosed charge is zero: $q + \\rho\\cdot\\tfrac43\\pi(R/2)^3 = 0$, so $q = -\\tfrac43\\pi\\rho\\dfrac{R^3}{8} = -\\dfrac{\\pi\\rho R^3}{6}$, $k = 1/6 \\approx 0.167$.',
      trap: 'Using the whole sphere\'s charge $\\tfrac43\\pi R^3\\rho$ instead of the part inside $R/2$.' },
  ],
  gens: [
    { id: 'esg-g01', type: 'nat', level: 1, exams: ['jam'], sub: 'coulomb and superposition', unit: 'N/C',
      make(r) {
        const q = int(r, 1, 9), d = int(r, 2, 20); // nC, cm
        const E = K * q * 1e-9 / (d / 100) ** 2;
        return { q: `The field magnitude ${d} cm from a point charge of ${q} nC is ______ N/C (to three significant figures).`,
          answer: +E.toPrecision(3), tol: Math.max(+E.toPrecision(3) * 0.01, 0.01), qq: q, d,
          sol: `$E = \\dfrac{kq}{r^2} = \\dfrac{(8.99\\times10^9)(${q}\\times10^{-9})}{(${d / 100})^2} \\approx ${fmt(E, 3)}$ N/C.`,
          trap: 'Convert cm to m and nC to C before using $k = 8.99\\times10^9$.' };
      },
      verify: (p) => K * p.qq * 1e-9 / (p.d / 100) ** 2 },
    { id: 'esg-g02', type: 'nat', level: 2, exams: ['jam'], sub: 'gauss law', unit: 'N m$^2$/C',
      make(r) {
        const ins = [int(r, 1, 9), -int(r, 1, 9), int(r, -5, 5) || 2], out = int(r, 1, 9) * (r() < 0.5 ? 1 : -1);
        const Q = ins.reduce((a, b) => a + b, 0);
        const ans = Q * 1e-9 / C.eps0;
        const list = ins.map((x) => `${x > 0 ? '+' : '-'}${Math.abs(x)}`).join(', ');
        return { q: `A closed surface contains point charges of ${list} nC. A charge of ${out > 0 ? '+' : '-'}${Math.abs(out)} nC lies outside it. The net outward electric flux through the surface is ______ N m$^2$/C (to one decimal place).`,
          answer: round(ans, 1), tol: Math.max(Math.abs(ans) * 0.01, 0.2), Q,
          sol: `Only enclosed charge counts: $Q_{\\text{enc}} = ${ins.join(' + ').replace(/\+ -/g, '- ')} = ${Q}$ nC. Flux $= Q_{\\text{enc}}/\\epsilon_0 = \\dfrac{${Q}\\times10^{-9}}{8.854\\times10^{-12}} \\approx ${round(ans, 1)}$ N m$^2$/C.`,
          trap: 'The outside charge contributes zero net flux, however close it is.' };
      },
      verify: (p) => p.Q * 1e-9 / C.eps0 },
    { id: 'esg-g03', type: 'nat', level: 3, exams: ['jam'], sub: 'gauss law: planes', unit: 'kN/C',
      make(r) {
        const s1 = int(r, 1, 6), s2 = int(r, 1, 6) * (r() < 0.5 ? 1 : -1), where = choose(r, ['between', 'outside']);
        const net = where === 'between' ? Math.abs(s1 - s2) : Math.abs(s1 + s2);
        const E = net * 1e-6 / (2 * C.eps0) / 1000;
        return { q: `Two large parallel sheets carry uniform charges $${s1}\\,\\mu$C/m$^2$ and $${s2}\\,\\mu$C/m$^2$. The field magnitude ${where === 'between' ? 'between the sheets' : 'outside both sheets'} is ______ kN/C (to one decimal place).`,
          answer: round(E, 1), tol: Math.max(E * 0.01, 0.1), net,
          sol: `Each sheet gives $\\sigma/(2\\epsilon_0)$, away from it if positive, towards it if negative. ${where === 'between' ? 'Between the sheets the two fields point opposite ways for like signs and the same way for unlike signs, so $E = |\\sigma_1 - \\sigma_2|/(2\\epsilon_0)$' : 'Outside both sheets the fields point the same way for like signs and opposite ways for unlike signs, so $E = |\\sigma_1 + \\sigma_2|/(2\\epsilon_0)$'} $= \\dfrac{${net}\\times10^{-6}}{2(8.854\\times10^{-12})} \\approx ${round(E, 1)}$ kN/C.`,
          trap: 'Keep the signs: a negative sheet pulls the field towards itself.' };
      },
      verify: (p) => p.net * 1e-6 / (2 * C.eps0) / 1000 },
    { id: 'esg-g04', type: 'nat', level: 2, exams: ['jam'], sub: 'gauss law: cylinders', unit: 'N/C',
      make(r) {
        const lam = int(r, 1, 20), s = int(r, 2, 30); // nC/m, cm
        const E = 2 * K * lam * 1e-9 / (s / 100);
        return { q: `A long straight wire carries ${lam} nC per metre. The field ${s} cm from it is ______ N/C (to three significant figures).`,
          answer: +E.toPrecision(3), tol: Math.max(E * 0.01, 0.01), lam, s,
          sol: `$E = \\dfrac{\\lambda}{2\\pi\\epsilon_0 s} = \\dfrac{2k\\lambda}{s} = \\dfrac{2(8.99\\times10^9)(${lam}\\times10^{-9})}{${s / 100}} \\approx ${fmt(E, 3)}$ N/C.`,
          trap: 'A line charge falls as $1/s$, not $1/s^2$.' };
      },
      verify: (p) => 2 * K * p.lam * 1e-9 / (p.s / 100) },
    { id: 'esg-g05', type: 'nat', level: 3, exams: ['jam'], sub: 'gauss law: spheres', unit: 'kN/C',
      make(r) {
        const Q = int(r, 1, 9), R = int(r, 5, 20), rr = choose(r, [Math.round(R / 4), Math.round(R / 2), Math.round(3 * R / 4), 2 * R, 3 * R]);
        const inside = rr < R;
        const E = (inside ? K * Q * 1e-9 * (rr / 100) / (R / 100) ** 3 : K * Q * 1e-9 / (rr / 100) ** 2) / 1000;
        return { q: `A non-conducting sphere of radius ${R} cm holds ${Q} nC spread uniformly through its volume. The field ${rr} cm from its centre is ______ kN/C (to two decimal places).`,
          answer: round(E, 2), tol: Math.max(E * 0.01, 0.01), Q, R, rr,
          sol: inside
            ? `The point is inside, so only the fraction $(r/R)^3$ of the charge is enclosed: $E = \\dfrac{kQr}{R^3} = \\dfrac{(8.99\\times10^9)(${Q}\\times10^{-9})(${rr / 100})}{(${R / 100})^3} \\approx ${round(E, 2)}$ kN/C.`
            : `The point is outside, so the sphere acts as a point charge: $E = \\dfrac{kQ}{r^2} = \\dfrac{(8.99\\times10^9)(${Q}\\times10^{-9})}{(${rr / 100})^2} \\approx ${round(E, 2)}$ kN/C.`,
          trap: 'Inside a uniform sphere the field grows as $r$; outside it falls as $1/r^2$.' };
      },
      verify: (p) => (p.rr < p.R ? K * p.Q * 1e-9 * (p.rr / 100) / (p.R / 100) ** 3 : K * p.Q * 1e-9 / (p.rr / 100) ** 2) / 1000 },
    { id: 'esg-g06', type: 'mcq', level: 2, exams: ['jam'], sub: 'gauss law: spheres',
      make(r) {
        const shape = choose(r, ['solid sphere', 'solid cylinder']);
        const a = int(r, 1, 3), b = a + int(r, 1, 3), n = shape === 'solid sphere' ? 3 : 2; // r1 = aR/4 inside, r2 = bR outside
        // inside E ~ r; outside sphere ~ 1/r^2, cylinder ~ 1/r. ratio E(aR/4)/E(bR)
        const ratio = shape === 'solid sphere' ? (a / 4) * b * b : (a / 4) * b;
        const wrong = shape === 'solid sphere' ? [(a / 4) * b, (a / 4) / (b * b), 4 * b * b / a] : [(a / 4) * b * b, (a / 4) / b, 4 * b / a];
        const o = mcqOptions(r, round(ratio, 4), wrong.map((x) => round(x, 4)), (v) => `$${v}$`);
        const A = a === 1 ? '' : a;
        return { q: `A uniformly charged ${shape === 'solid sphere' ? 'solid sphere' : 'very long solid cylinder'} has radius $R$. What is the ratio of the field at distance $${A}R/4$ from the ${shape === 'solid sphere' ? 'centre' : 'axis'} to the field at distance $${b}R$?`, ...o,
          sol: `Inside, $E \\propto r$, so $E(${A}R/4) =\\tfrac{${a}}{4}E(R)$. Outside, a ${shape === 'solid sphere' ? 'sphere gives $E \\propto 1/r^2$, so $E(' + b + 'R) = E(R)/' + b * b + '$' : 'cylinder gives $E \\propto 1/s$, so $E(' + b + 'R) = E(R)/' + b + '$'}. Ratio $= \\tfrac{${a}}{4}\\times${shape === 'solid sphere' ? b * b : b} = ${round(ratio, 4)}$.`,
          trap: `Using the sphere's $1/r^2$ fall-off for a cylinder (or the cylinder's $1/s$ for a sphere). Here the ${n === 3 ? 'sphere' : 'cylinder'} rule applies.` };
      } },
    { id: 'esg-g07', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'flux', unit: 'N m$^2$/C',
      make(r) {
        const q = int(r, 1, 9);
        const [where, div] = choose(r, [['at the centre of the cube', 1], ['at the centre of one face (on the surface)', 2], ['at the midpoint of one edge', 4], ['at one corner', 8]]);
        const ans = q * 1e-9 / C.eps0 / div;
        return { q: `A point charge of ${q} nC sits ${where}. The total flux out through the whole surface of the cube is ______ N m$^2$/C (to one decimal place).`,
          answer: round(ans, 1), tol: Math.max(ans * 0.01, 0.1), qq: q, div,
          sol: `Fit identical cubes around the charge until it is fully surrounded: ${div === 1 ? 'it already is' : `${div} cubes are needed`}. Each cube then takes $1/${div}$ of $q/\\epsilon_0$: flux $= \\dfrac{${q}\\times10^{-9}}{${div}(8.854\\times10^{-12})} \\approx ${round(ans, 1)}$ N m$^2$/C.`,
          trap: 'A charge on the surface is not wholly enclosed; count how many cubes share it.' };
      },
      verify: (p) => p.qq * 1e-9 / C.eps0 / p.div },
    { id: 'esg-g08', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'differential form', unit: 'pC/m$^3$',
      make(r) {
        const a = int(r, -9, 9) || 4, b = int(r, -9, 9) || 3, c = int(r, 1, 9);
        const rho = C.eps0 * (a + b + c) * 1e12;
        const t = (first, v) => `${v < 0 ? (first ? '-' : ' - ') : first ? '' : ' + '}${Math.abs(v) === 1 ? '' : Math.abs(v)}`;
        return { q: `The electrostatic field in a region is $\\vec E = ${t(true, a)}x\\,\\hat i${t(false, b)}y\\,\\hat j${t(false, c)}z\\,\\hat k$ (coefficients in V/m$^2$, with $x, y, z$ in metres). The charge density is ______ pC/m$^3$ (to one decimal place).`,
          answer: round(rho, 1), tol: Math.max(Math.abs(rho) * 0.01, 0.1), a, b, c,
          sol: `$\\rho = \\epsilon_0\\nabla\\cdot\\vec E = \\epsilon_0(${a} + (${b}) + ${c}) = ${a + b + c}\\,\\epsilon_0 = ${a + b + c}\\times8.854\\times10^{-12}$ C/m$^3$ $\\approx ${round(rho, 1)}$ pC/m$^3$. (The curl is zero, so the field is electrostatic.)`,
          trap: 'Each component is differentiated only by its own coordinate.' };
      },
      verify: (p) => C.eps0 * (p.a + p.b + p.c) * 1e12 },
  ],
};
