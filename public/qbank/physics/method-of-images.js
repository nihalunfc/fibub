// The method of images at MSc level: spherical cavities, spheres at a fixed potential or with charge, line charges
// and cylinders (two-wire lines), dipoles near planes, plates and reciprocity, the hemispherical boss, image series
// for a sphere near a plane. Original questions (fibub) for GATE and CSIR NET. The plane and simple sphere basics
// are in conductors-images (IIT JAM).
import { pick, int, choose, mcqOptions, round, shuffle } from '../_util.js';
import more from './method-of-images.more.gen.js';
import more2 from './method-of-images.more2.gen.js';

const EPS0 = 8.8541878128e-12, K = 8.9875517923e9, PI = Math.PI;

export default {
  topic: 'method-of-images',
  items: [
    // ---------- level 1 ----------
    { id: 'gim-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'spherical cavity',
      q: 'A point charge $q$ sits inside a grounded spherical cavity of radius $R$, at distance $d < R$ from its centre. The image charge that makes the wall an equipotential is',
      options: ['$-q$, at distance $2R - d$ from the centre', '$-qR/d$, outside the cavity at $R^2/d$ from the centre', '$-qd/R$, inside the cavity at $d^2/R$ from the centre', '$+qR/d$, outside the cavity at $R^2/d$ from the centre'], answer: 1,
      sol: 'The pair $q$ at $d$ and $q\' = -qR/d$ at $b = R^2/d$ (on the same ray) gives zero potential on the whole sphere of radius $R$, whichever side of it the real charge is on. With $d < R$, $b > R$: the image lies outside, in the metal, where it is allowed, and $|q\'| > |q|$.',
      trap: 'The same formula serves both cases; only the roles of inside and outside swap.' },
    { id: 'gim-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'principle',
      q: 'The method of images gives the correct field in the physical region because',
      options: ['image charges are real charges induced inside the conductor', 'the field of the images is zero in the physical region', 'it only works for conductors of zero net charge', 'the trial potential obeys Poisson\'s equation in the region and the boundary conditions, and that solution is unique'], answer: 3,
      sol: 'Images are placed outside the physical region, so inside it Poisson\'s equation (with only the real charges) is unchanged. If the boundary values (or the conductor charges) also match, the uniqueness theorem guarantees this is the solution. The images are fictitious; the real charges are spread on the conductor surface.' },
    { id: 'gim-003', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'line charges',
      q: 'A long straight wire with charge $10$ nC/m runs parallel to a large grounded metal plate, 5.0 cm above it. The magnitude of the surface charge density on the plate directly below the wire is ______ nC/m$^2$ (to one decimal place).',
      answer: 63.7, tol: 0.3, calc: () => 10e-9 / (PI * 0.05) * 1e9,
      sol: 'Image: $-\\lambda$ at 5.0 cm below the plate. Right under the wire both lines give a downward field $\\lambda/2\\pi\\epsilon_0h$, so $E = \\lambda/\\pi\\epsilon_0h$ and $|\\sigma| = \\epsilon_0E = \\lambda/\\pi h = \\dfrac{10\\times10^{-9}}{\\pi\\times0.05} = 6.37\\times10^{-8}$ C/m$^2$ $= 63.7$ nC/m$^2$.',
      trap: 'Forgetting the image doubles nothing: you get half the field, $\\lambda/2\\pi h$.' },
    { id: 'gim-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'cylinders',
      q: 'A line charge $\\lambda$ runs parallel to the axis of a long conducting cylinder of radius $R$, at distance $d > R$ from the axis. The cylinder surface is made an equipotential by an image line charge',
      options: ['$-\\lambda$ at distance $R^2/d$ from the axis', '$-\\lambda R/d$ at distance $R^2/d$ from the axis', '$-\\lambda$ on the axis', '$-\\lambda d/R$ at distance $R^2/d$ from the axis'], answer: 0,
      sol: 'For two opposite line charges the potential is $\\dfrac{\\lambda}{2\\pi\\epsilon_0}\\ln\\dfrac{r_2}{r_1}$, constant wherever $r_2/r_1$ is constant: circles of Apollonius. With $-\\lambda$ at $b = R^2/d$, every point of the circle of radius $R$ has $r_2/r_1 = R/d$. Unlike the sphere, the image line has the same magnitude $\\lambda$.',
      trap: 'Copying the sphere result $-qR/d$ is the classic mistake: logarithmic potentials need equal and opposite lines.' },
    { id: 'gim-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'dipoles',
      q: 'An electric dipole sits above a grounded conducting plane with its moment pointing straight up, away from the plane. Its image dipole points',
      options: ['straight down, towards the plane', 'parallel to the plane', 'straight up, the same way as the real dipole', 'nowhere: a dipole has no image'], answer: 2,
      sol: 'Image each charge: $+q$ at height $d + a/2$ becomes $-q$ at depth $d + a/2$; $-q$ at $d - a/2$ becomes $+q$ at depth $d - a/2$. The image dipole runs from its $-q$ (deeper) to its $+q$ (shallower): upward. A perpendicular dipole keeps its direction; a parallel component is reversed.',
      trap: 'A mirror image would point down; a charge image (with the sign flip) points up.' },
    { id: 'gim-006', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'spherical cavity',
      q: 'A charge of $+4.0$ nC sits 5.0 cm from the centre of a grounded spherical cavity of radius 10 cm. The image charge is ______ nC.',
      answer: -8, tol: 0.01, calc: () => -4 * 10 / 5,
      sol: '$q\' = -qR/d = -4.0\\times10/5.0 = -8.0$ nC, placed at $R^2/d = 20$ cm from the centre (outside the cavity). The total charge induced on the wall is still exactly $-4.0$ nC: every field line from the charge ends on the wall.',
      trap: 'The image ($-8$ nC) is not the induced charge ($-4$ nC); outside the metal the image picture does not apply.' },

    // ---------- level 2 ----------
    { id: 'gim-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'spherical cavity',
      q: 'A charge of $4.0$ nC sits 5.0 cm from the centre of a grounded spherical cavity of radius 10 cm. The magnitude of the force on it is ______ $\\mu$N (to one decimal place).',
      answer: 12.8, tol: 0.15, calc: () => K * 16e-18 * 0.1 * 0.05 / (0.01 - 0.0025) ** 2 * 1e6,
      sol: 'Image $q\' = -qR/d$ at $b = R^2/d$, so the separation is $b - d = (R^2 - d^2)/d$ and $F = \\dfrac{kq^2(R/d)}{(R^2 - d^2)^2/d^2} = \\dfrac{kq^2Rd}{(R^2 - d^2)^2} = \\dfrac{8.99\\times10^9\\times16\\times10^{-18}\\times0.10\\times0.05}{(0.0075)^2} = 1.28\\times10^{-5}$ N. It pulls the charge towards the nearest part of the wall.',
      trap: 'The formula looks like the outside case with $d^2 - R^2$ replaced by $R^2 - d^2$; the squared bracket hides the swap.' },
    { id: 'gim-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'line charges',
      q: 'A thin wire of radius $a$ runs parallel to a grounded plane, its axis at height $h$ above it. The exact capacitance per unit length between wire and plane is',
      options: ['$\\dfrac{2\\pi\\epsilon_0}{\\ln(h/a)}$', '$\\dfrac{\\pi\\epsilon_0}{\\cosh^{-1}(h/a)}$', '$\\dfrac{2\\pi\\epsilon_0}{\\ln(2h/a)}$', '$\\dfrac{2\\pi\\epsilon_0}{\\cosh^{-1}(h/a)}$'], answer: 3,
      sol: 'Replace the wire by a line charge $\\lambda$ at height $c$ and its image $-\\lambda$ at $-c$. The wire surface is an Apollonius circle of radius $a$ centred at $h$, which requires $c^2 = h^2 - a^2$. The wire potential is then $\\dfrac{\\lambda}{2\\pi\\epsilon_0}\\ln\\dfrac{h + c}{a} = \\dfrac{\\lambda}{2\\pi\\epsilon_0}\\cosh^{-1}\\dfrac ha$, so $C\' = \\dfrac{2\\pi\\epsilon_0}{\\cosh^{-1}(h/a)}$. For $h \\gg a$ this becomes $2\\pi\\epsilon_0/\\ln(2h/a)$.',
      trap: 'The $\\ln(2h/a)$ form is only the thin-wire limit; the equivalent line sits slightly below the wire\'s axis.' },
    { id: 'gim-009', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'line charges',
      q: 'A wire of radius 1.0 mm runs parallel to a grounded plane with its axis 10 cm above it. The capacitance per metre between wire and plane is ______ pF/m (to one decimal place).',
      answer: 10.5, tol: 0.1, calc: () => 2 * PI * EPS0 / Math.acosh(100) * 1e12,
      sol: '$C\' = \\dfrac{2\\pi\\epsilon_0}{\\cosh^{-1}(h/a)}$ with $h/a = 100$: $\\cosh^{-1}100 = \\ln(100 + \\sqrt{9999}) = 5.298$. $C\' = \\dfrac{5.563\\times10^{-11}}{5.298} = 1.05\\times10^{-11}$ F/m $= 10.5$ pF/m.' },
    { id: 'gim-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'cylinders',
      q: 'Two long parallel conducting cylinders, each of radius $a$, have their axes a distance $D$ apart. The capacitance per unit length between them is',
      options: ['$\\dfrac{2\\pi\\epsilon_0}{\\cosh^{-1}(D/2a)}$', '$\\dfrac{\\pi\\epsilon_0}{\\cosh^{-1}(D/2a)}$', '$\\dfrac{\\pi\\epsilon_0}{\\ln(D/a)}$ exactly', '$\\dfrac{\\pi\\epsilon_0}{\\cosh^{-1}(D/a)}$'], answer: 1,
      sol: 'By symmetry the midplane is an equipotential, so each cylinder sees the other as an image in that plane at distance $h = D/2$. Each cylinder to the midplane is $2\\pi\\epsilon_0/\\cosh^{-1}(D/2a)$, and the two are in series, giving $\\pi\\epsilon_0/\\cosh^{-1}(D/2a)$. For $D \\gg a$ this is $\\pi\\epsilon_0/\\ln(D/a)$.',
      trap: 'Two equal capacitors in series halve the capacitance; forgetting this gives the wire-to-plane formula.' },
    { id: 'gim-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'spheres',
      q: 'A conducting sphere of radius $R$ is held at potential $V_0$ (by a battery, relative to infinity) while a point charge $q$ sits at distance $d$ from its centre. A correct image system is',
      options: ['$-qR/d$ at $R^2/d$, plus $4\\pi\\epsilon_0RV_0$ at the centre', '$-qR/d$ at $R^2/d$ only', '$-q$ at $R^2/d$, plus $4\\pi\\epsilon_0RV_0$ at the centre', '$+qR/d$ at the centre, plus $4\\pi\\epsilon_0RV_0$ at $R^2/d$'], answer: 0,
      sol: 'The grounded-sphere image $-qR/d$ at $R^2/d$ makes the surface $V = 0$. A point charge $Q_0$ at the centre adds $Q_0/4\\pi\\epsilon_0R$ uniformly on the surface, so $Q_0 = 4\\pi\\epsilon_0RV_0$ brings it to $V_0$. The sphere\'s total charge is $4\\pi\\epsilon_0RV_0 - qR/d$.' },
    { id: 'gim-012', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'spherical cavity',
      q: 'A point charge $q > 0$ sits off-centre inside a grounded spherical cavity in a large metal block. Which statements are correct?',
      options: ['The image charge lies outside the cavity, in the metal.', 'The total charge induced on the cavity wall is $-q$, wherever $q$ is placed.', 'The image charge is larger in magnitude than $q$.', 'The force on $q$ pushes it towards the centre of the cavity.'], answer: [0, 1, 2],
      sol: 'Image $-qR/d$ at $R^2/d > R$: outside and larger than $q$ because $R/d > 1$. All field lines from $q$ end on the wall (the metal has $E = 0$), so the wall carries exactly $-q$; the image is not that charge. The image is on the same side as $q$, so $q$ is pulled outward, towards the nearest wall: the centre is an unstable equilibrium.',
      trap: 'The image magnitude $qR/d$ and the induced charge $q$ are different numbers.' },
    { id: 'gim-013', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'reciprocity',
      q: 'Two large parallel grounded plates are a distance $L$ apart. A point charge $q$ is placed between them at distance $L/4$ from plate 1. The charge induced on plate 1 is $-\\kappa q$. The value of $\\kappa$ is ______ (to two decimal places).',
      answer: 0.75, tol: 0.005, calc: () => 1 - 0.25,
      sol: 'Green reciprocity: the induced charge depends only on the distance from each plate, so smear $q$ into a uniform sheet at $x = L/4$. Its field splits so both plates stay at 0: the potential is linear on each side with a kink at the sheet, and the plate on the near side takes the larger share. Result: $Q_1 = -q(L - x)/L = -\\tfrac34q$, $Q_2 = -qx/L = -\\tfrac14q$. (The infinite image series gives the same, much more slowly.)',
      trap: 'The nearer plate gets more, in proportion to the distance to the other plate.' },
    { id: 'gim-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'parallel plates',
      q: 'How many image charges are needed for a point charge between two infinite, parallel, grounded conducting plates?',
      options: ['1', '3', 'infinitely many', '2'], answer: 2,
      sol: 'Imaging $q$ in plate 1 gives $-q$; that image must itself be imaged in plate 2, giving $+q$, and so on forever. The images form an infinite row along the normal with period $2L$: $-q$ at $-x + 2nL$ and $+q$ at $x + 2nL$ ($n \\ne 0$). The series converges because the alternating charges nearly cancel far away.' },
    { id: 'gim-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'spheres',
      q: 'A charge $q$ sits a small height $h$ above the surface of a grounded sphere of radius $R$ ($d = R + h$, $h \\ll R$). The force on it is close to',
      options: ['$kq^2/h^2$', '$kq^2R/h^3$', '$kq^2/R^2$', '$kq^2/4h^2$'], answer: 3,
      sol: 'Exact: $F = \\dfrac{kq^2Rd}{(d^2 - R^2)^2} = \\dfrac{kq^2R(R + h)}{h^2(2R + h)^2} \\to \\dfrac{kq^2R^2}{4R^2h^2} = \\dfrac{kq^2}{4h^2}$. Close up, the sphere looks like a plane and the image $-qR/d \\approx -q$ sits about $h$ inside.' },
    { id: 'gim-016', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'reciprocity',
      q: 'A charge of 6.0 nC is placed midway between two large parallel grounded plates. The charge induced on one plate is ______ nC.',
      answer: -3, tol: 0.01, calc: () => -6 / 2,
      sol: 'By symmetry the two plates share equally, and together they carry $-q$ (all field lines end on them). So each carries $-3.0$ nC.' },

    // ---------- level 3 ----------
    { id: 'gim-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'spheres',
      q: 'A charge of $1.0$ nC is 10 cm from the centre of a grounded metal sphere of radius 5.0 cm. The magnitude of the surface charge density at the point of the sphere nearest the charge is ______ nC/m$^2$ (to one decimal place).',
      answer: 95.5, tol: 0.5, calc: () => 1e-9 * 0.15 / (4 * PI * 0.05 * 0.0025) * 1e9,
      sol: 'With the image $-qR/d$ at $R^2/d$, the field at the surface gives $\\sigma(\\theta) = -\\dfrac{q}{4\\pi R}\\dfrac{d^2 - R^2}{(R^2 + d^2 - 2Rd\\cos\\theta)^{3/2}}$. At $\\theta = 0$ the bracket is $(d - R)^3$: $\\sigma = -\\dfrac{q(d + R)}{4\\pi R(d - R)^2} = -\\dfrac{10^{-9}\\times0.15}{4\\pi\\times0.05\\times0.0025} = -95.5$ nC/m$^2$.',
      trap: 'Using the plane formula $q/2\\pi h^2$ with $h = 5$ cm gives 63.7; the curved sphere concentrates more charge near the source.' },
    { id: 'gim-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'cylinders',
      q: 'A line charge of 10 nC/m runs parallel to a long conducting cylinder of radius 2.0 cm, 5.0 cm from its axis. The cylinder carries a charge $-10$ nC/m. The force per metre on the line charge is ______ $\\mu$N/m (to one decimal place).',
      answer: 42.8, tol: 0.3, calc: () => 1e-16 * 0.05 / (2 * PI * EPS0 * (0.0025 - 0.0004)) * 1e6,
      sol: 'The image $-\\lambda$ at $b = R^2/d = 0.8$ cm makes the cylinder an equipotential carrying $-\\lambda$ per metre, as required. Separation $d - b = 4.2$ cm. $F\' = \\dfrac{\\lambda^2}{2\\pi\\epsilon_0(d - b)} = \\dfrac{10^{-16}}{5.563\\times10^{-11}\\times0.042} = 4.28\\times10^{-5}$ N/m, attractive.',
      trap: 'Measuring to the axis (5 cm) instead of to the image line (4.2 cm) gives 36 $\\mu$N/m.' },
    { id: 'gim-019', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'images in curved conductors',
      q: 'A grounded conducting plane has a hemispherical boss of radius $R$ on it, centred at the origin. A charge $q$ is on the axis at height $d > R$. A correct image system is',
      options: ['$-qR/d$ at height $R^2/d$ only', '$-q$ at $-d$ only', '$-qR/d$ at $R^2/d$, $-q$ at $-d$ and $+qR/d$ at $-R^2/d$', '$-qR/d$ at $R^2/d$ and $-q$ at $-d$'], answer: 2,
      sol: 'Treat the boss and plane as a whole sphere plus plane. $q$ and $-q$ at $-d$ make the plane zero. The sphere needs images of both: $q$ gives $-qR/d$ at $R^2/d$; $-q$ at $-d$ gives $+qR/d$ at $-R^2/d$. The last two are mirror images of each other in the plane with opposite signs, so the plane stays at zero. All four together vanish on plane and boss.',
      trap: 'Three images, not two: the plane must also see the sphere\'s image mirrored.' },
    { id: 'gim-020', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'line charges',
      q: 'Two infinite parallel line charges $+\\lambda$ and $-\\lambda$ are a distance $2c$ apart. Which statements are correct about the field in the plane perpendicular to them?',
      options: ['The equipotentials are circles (circles of Apollonius).', 'The field lines are circular arcs through the two line charges.', 'The midplane is an equipotential.', 'The equipotential circles are all centred on the midpoint between the lines.'], answer: [0, 1, 2],
      sol: '$V \\propto \\ln(r_2/r_1)$ is constant where $r_2/r_1$ is constant: Apollonius circles, whose centres lie on the line through the charges but outside the segment, shifting with the potential (not concentric). The field lines are the orthogonal family: circles through both lines. The midplane has $r_1 = r_2$, so $V = 0$ there. This is why one line charge models a wire above a plane, two cylinders, or an off-axis wire in a tube.',
      trap: 'Equipotential circles are nested but not concentric; the centre moves away as the circle shrinks around a line.' },
    { id: 'gim-021', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'dipoles',
      q: 'A point dipole $p$ points away from a grounded conducting plane, perpendicular to it, at height $d$. The force on it is',
      options: ['$\\dfrac{3p^2}{8(4\\pi\\epsilon_0)d^4}$, towards the plane', '$\\dfrac{3p^2}{16(4\\pi\\epsilon_0)d^4}$, towards the plane', '$\\dfrac{6p^2}{(4\\pi\\epsilon_0)d^4}$, away from the plane', 'zero'], answer: 0,
      sol: 'The image is an equal dipole pointing the same way, at depth $d$, so the two are coaxial and head to tail, $r = 2d$ apart. Coaxial parallel dipoles attract with $F = \\dfrac{6p^2}{4\\pi\\epsilon_0r^4}$ (from $U = -2p^2/4\\pi\\epsilon_0r^3$). With $r = 2d$: $F = \\dfrac{6p^2}{16(4\\pi\\epsilon_0)d^4} = \\dfrac{3p^2}{8(4\\pi\\epsilon_0)d^4}$, attractive.',
      trap: 'The force on the real dipole is the full image-pair force; only the energy carries a factor $\\tfrac12$.' },
    { id: 'gim-022', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'cylinders',
      q: 'A two-wire line has wires of radius 1.0 mm with axes 1.0 cm apart. Its capacitance per metre is ______ pF/m (to one decimal place).',
      answer: 12.1, tol: 0.1, calc: () => PI * EPS0 / Math.acosh(5) * 1e12,
      sol: '$C\' = \\dfrac{\\pi\\epsilon_0}{\\cosh^{-1}(D/2a)}$ with $D/2a = 5$: $\\cosh^{-1}5 = \\ln(5 + \\sqrt{24}) = 2.292$. $C\' = \\dfrac{2.782\\times10^{-11}}{2.292} = 1.21\\times10^{-11}$ F/m $= 12.1$ pF/m. (The thin-wire formula $\\pi\\epsilon_0/\\ln(D/a)$ gives 12.08: close, since $D \\gg a$.)' },
    { id: 'gim-023', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'wedges',
      q: 'Two grounded conducting half-planes meet along a line. For which opening angles does a FINITE set of point images solve the problem for a charge placed anywhere between them?',
      options: ['$60^\\circ$', '$72^\\circ$', '$90^\\circ$', '$120^\\circ$'], answer: [0, 2],
      sol: 'Reflecting repeatedly in the two planes generates images at angles spaced by $2\\alpha$; the set closes consistently (the last image lands back with the right sign) only if $360^\\circ/\\alpha$ is an even integer. $60^\\circ$: 6 (5 images). $90^\\circ$: 4 (3 images). $72^\\circ$: 5 and $120^\\circ$: 3 are odd, so an image would have to sit inside the physical region with the wrong sign: the method fails.',
      trap: '$360/\\alpha$ being an integer is not enough; it must be even.' },
    { id: 'gim-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'spherical cavity',
      q: 'A point charge $q$ sits at the centre of a grounded spherical cavity of radius $R$. The potential inside the cavity at distance $r$ from the centre is',
      options: ['$\\dfrac{q}{4\\pi\\epsilon_0r}$', '$\\dfrac{q}{4\\pi\\epsilon_0}\\left(\\dfrac1R - \\dfrac1r\\right)$', '$\\dfrac{q}{4\\pi\\epsilon_0}\\left(\\dfrac1r - \\dfrac1R\\right)$', 'zero'], answer: 2,
      sol: 'With $d \\to 0$ the image $-qR/d$ runs off to infinity at $R^2/d$; its potential near the cavity tends to the constant $-q/4\\pi\\epsilon_0R$. So $V = \\dfrac{q}{4\\pi\\epsilon_0}\\left(\\dfrac1r - \\dfrac1R\\right)$, zero on the wall. The field is just Coulomb\'s, $q/4\\pi\\epsilon_0r^2$.' },
    { id: 'gim-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'line charges',
      q: 'A line charge $\\lambda$ runs parallel to a grounded plane at height $h$. The fraction of the total induced charge that lies within the strip $|x| < h$ directly beneath it is ______ (to two decimal places).',
      answer: 0.5, tol: 0.005, calc: () => (2 / PI) * Math.atan(1),
      sol: 'With the image $-\\lambda$ at $-h$: $\\sigma(x) = -\\dfrac{\\lambda h}{\\pi(x^2 + h^2)}$. Integrating, $\\displaystyle\\int_{-a}^{a}\\sigma\\,dx = -\\dfrac{2\\lambda}{\\pi}\\tan^{-1}\\dfrac ah$, and the whole plane gives $-\\lambda$. For $a = h$: fraction $= \\dfrac2\\pi\\cdot\\dfrac\\pi4 = 0.5$.',
      trap: 'For a point charge the half-charge radius is $\\sqrt3\\,d$; for a line charge the half-width is $h$.' },
    { id: 'gim-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'spheres',
      q: 'A neutral isolated conducting sphere of radius $R$ is placed in a uniform field. Modelling the field by $+Q$ at $z = -D$ and $-Q$ at $z = +D$ with $D \\gg R$ (so $E_0 = 2Q/4\\pi\\epsilon_0D^2$), the images form a dipole of moment',
      options: ['$2QR^3/D^2$, equal to $4\\pi\\epsilon_0R^3E_0$', '$QR^3/D^2$, equal to $2\\pi\\epsilon_0R^3E_0$', '$2QR^2/D$, independent of $E_0$', '$QR/D$, equal to $4\\pi\\epsilon_0RE_0$'], answer: 0,
      sol: 'The charge $+Q$ at $-D$ has image $-QR/D$ at $-R^2/D$; $-Q$ at $+D$ has image $+QR/D$ at $+R^2/D$. These form a dipole $p = (QR/D)(2R^2/D) = 2QR^3/D^2$ along $+z$ (the images add to zero, so the sphere stays neutral). Using $Q = 2\\pi\\epsilon_0D^2E_0$: $p = 4\\pi\\epsilon_0R^3E_0$, the separation-of-variables answer.' },
    { id: 'gim-027', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'dipoles',
      q: 'A point dipole is held at height $d$ above a grounded plane with its moment making angle $\\alpha$ with the upward normal. Its image dipole (at depth $d$) makes, with the upward normal, the angle',
      options: ['$\\alpha$, the same direction as the real dipole', '$\\pi - \\alpha$', '$\\pi + \\alpha$', '$-\\alpha$, i.e. the component along the plane is reversed'], answer: 3,
      sol: 'Components: the perpendicular part keeps its direction (see the up-pointing dipole), the parallel part reverses (the image of a sideways $+q$ to $-q$ pair is a sideways $-q$ to $+q$ pair). So $(p\\sin\\alpha, p\\cos\\alpha) \\to (-p\\sin\\alpha, p\\cos\\alpha)$: angle $-\\alpha$ from the upward normal.',
      trap: 'A mirror reflection gives $\\pi - \\alpha$; the charge-sign flip then reverses the whole vector.' },
    { id: 'gim-028', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'spheres',
      q: 'A conducting sphere of radius 5.0 cm is held at $+300$ V by a battery. A point charge of $+1.0$ nC is brought to 15 cm from its centre. The net charge on the sphere is then ______ nC (to two decimal places).',
      answer: 1.34, tol: 0.01, calc: () => (4 * PI * EPS0 * 0.05 * 300) * 1e9 - 1 * 5 / 15,
      sol: 'Image system: $-qR/d$ at $R^2/d$ (keeps $V = 0$) plus $4\\pi\\epsilon_0RV_0$ at the centre (raises it to $V_0$). Total $= 4\\pi\\epsilon_0RV_0 - qR/d = 1.668 - 0.333 = 1.34$ nC. The battery has pulled $0.33$ nC off the sphere as the charge approached.' },

    // ---------- level 4 ----------
    { id: 'gim-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'images in curved conductors',
      q: 'A grounded plane carries a hemispherical boss of radius $R$. A charge $q$ is on the axis at height $d = 2R$. The magnitude of the force on it is $\\kappa\\,kq^2/R^2$ (with $k = 1/4\\pi\\epsilon_0$). The value of $\\kappa$ is ______ (to three decimal places).',
      answer: 0.205, tol: 0.002, calc: () => 0.5 / 2.25 + 1 / 16 - 0.5 / 6.25,
      sol: 'Images: $-q/2$ at $R/2$, $-q$ at $-2R$, $+q/2$ at $-R/2$. Distances from $q$ (at $2R$): $1.5R$, $4R$, $2.5R$. Force along the axis (towards the plane taken positive): $\\dfrac{kq^2}{R^2}\\left[\\dfrac{0.5}{1.5^2} + \\dfrac{1}{4^2} - \\dfrac{0.5}{2.5^2}\\right] = \\dfrac{kq^2}{R^2}[0.2222 + 0.0625 - 0.08] = 0.205\\,kq^2/R^2$, attractive.',
      trap: 'The far positive image pushes the charge away, so it reduces the pull.' },
    { id: 'gim-030', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'dipoles',
      q: 'A point dipole of moment $p$ lies parallel to a grounded conducting plane at height $d$. The magnitude of the force on it is $\\kappa\\,p^2/(4\\pi\\epsilon_0d^4)$. The value of $\\kappa$ is ______ (to four decimal places).',
      answer: 0.1875, tol: 0.0005, calc: () => 3 / 16,
      sol: 'The image is antiparallel, directly below at separation $r = 2d$. For side-by-side dipoles, $U = \\dfrac{\\vec p_1\\cdot\\vec p_2 - 3(\\vec p_1\\cdot\\hat r)(\\vec p_2\\cdot\\hat r)}{4\\pi\\epsilon_0r^3} = -\\dfrac{p^2}{4\\pi\\epsilon_0r^3}$, so $F = |dU/dr| = \\dfrac{3p^2}{4\\pi\\epsilon_0r^4} = \\dfrac{3p^2}{16(4\\pi\\epsilon_0)d^4}$, attractive. $\\kappa = 3/16$.',
      trap: 'Half the force of the perpendicular case: antiparallel side by side binds half as strongly as head to tail.' },
    { id: 'gim-031', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'cylinders',
      q: 'A thin wire with charge $\\lambda$ per length runs parallel to the axis inside a grounded conducting tube of radius $R$, at distance $d$ from the axis. The force per unit length on the wire is',
      options: ['$\\dfrac{\\lambda^2d}{2\\pi\\epsilon_0(R^2 - d^2)}$, away from the axis', '$\\dfrac{\\lambda^2d}{2\\pi\\epsilon_0(R^2 - d^2)}$, towards the axis', '$\\dfrac{\\lambda^2R}{2\\pi\\epsilon_0(R^2 - d^2)}$, away from the axis', 'zero, by symmetry'], answer: 0,
      sol: 'Image $-\\lambda$ at $b = R^2/d$ outside the tube, on the same side. Separation $b - d = (R^2 - d^2)/d$. Force per length $\\dfrac{\\lambda^2}{2\\pi\\epsilon_0(b - d)} = \\dfrac{\\lambda^2d}{2\\pi\\epsilon_0(R^2 - d^2)}$, pulling the wire towards the nearer wall, i.e. away from the axis. Only on the axis is it zero, and that equilibrium is unstable.' },
    { id: 'gim-032', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'spheres',
      q: 'A charge $q > 0$ approaches an isolated conducting sphere carrying a positive charge $Q$. Which statements are correct?',
      options: ['Far away the force is repulsive.', 'Close enough to the surface the force becomes attractive.', 'The image system is $-qR/d$ at $R^2/d$ and $Q + qR/d$ at the centre.', 'The force is repulsive at every distance because both charges are positive.'], answer: [0, 1, 2],
      sol: 'Keeping the total charge $Q$ requires $Q - q\' = Q + qR/d$ at the centre. Force (repulsion positive): $kq\\left[\\dfrac{Q + qR/d}{d^2} - \\dfrac{qRd}{(d^2 - R^2)^2}\\right]$. The second term grows without limit as $d \\to R$, so near the surface attraction wins; far away the first term ($\\approx kqQ/d^2$) dominates. That is why even a like-charged conductor grabs a charge that comes close, the root of the work function barrier.',
      trap: 'Like charges always repel only for point charges; a conductor rearranges its charge.' },
    { id: 'gim-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'spheres',
      q: 'A grounded sphere of radius $R$ has a charge $q$ at distance $d$ from its centre. What fraction of the induced charge lies on the hemisphere facing the charge, when $d = 2R$? Give the fraction (to three decimal places).',
      answer: 0.829, tol: 0.003, calc: () => { const d = 2, R = 1; const near = (d * d - R * R) / (2 * d) * (1 / (d - R) - 1 / Math.sqrt(R * R + d * d)); return near / (R / d); },
      sol: 'With $\\sigma(\\theta) = -\\dfrac{q(d^2 - R^2)}{4\\pi R(R^2 + d^2 - 2Rd\\cos\\theta)^{3/2}}$, put $u = R^2 + d^2 - 2Rd\\cos\\theta$ ($du = 2Rd\\sin\\theta\\,d\\theta$). The charge on the cap $0 \\le \\theta \\le \\theta_0$ is $-\\dfrac{q(d^2 - R^2)}{2d}\\left[\\dfrac{1}{d - R} - \\dfrac{1}{\\sqrt{R^2 + d^2 - 2Rd\\cos\\theta_0}}\\right]$; for $\\theta_0 = \\pi$ this gives the total $-qR/d$, as it should. Near hemisphere ($\\theta_0 = 90^\\circ$) with $d = 2R$: $-\\dfrac{3q}{4}\\left(1 - \\dfrac{1}{\\sqrt5}\\right) = -0.4146q$. Total $-0.5q$. Fraction $= 0.4146/0.5 = 0.829$.',
      trap: 'The charge is not split evenly between the hemispheres: the near side holds over 80% here.' },
    { id: 'gim-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'energy',
      q: 'A charge $q$ is at distance $d$ from the centre of a grounded sphere of radius $R$. The work needed to remove it to infinity is',
      options: ['$\\dfrac{kq^2R}{d^2 - R^2}$', '$\\dfrac{kq^2R}{2(d^2 - R^2)}$', '$\\dfrac{kq^2R}{2d^2}$', '$\\dfrac{kq^2Rd}{(d^2 - R^2)^2}$'], answer: 1,
      sol: 'Integrate the force: $W = \\displaystyle\\int_d^\\infty\\dfrac{kq^2Rx}{(x^2 - R^2)^2}dx = \\dfrac{kq^2R}{2(d^2 - R^2)}$. It is half of $q$ times the image potential at $q$, $\\tfrac12\\cdot q\\cdot\\dfrac{kqR/d}{d - R^2/d}$, because the image moves and changes as $q$ moves.',
      trap: 'Taking the full $qV_{image}$ gives twice the answer; the last option is the force, not the work.' },
    { id: 'gim-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'parallel plates',
      q: 'A charge $q$ lies midway between two grounded parallel plates a distance $L$ apart. Summing the image series, the potential at a point on the midplane far from the charge falls off exponentially as $e^{-\\gamma\\rho}$ with distance $\\rho$ along the midplane. The value of $\\gamma L$ is ______ (to two decimal places).',
      answer: 3.14, tol: 0.01, calc: () => PI,
      sol: 'Between grounded plates at $z = 0$ and $z = L$, the potential must vanish at both, so it is built from $\\sin(n\\pi z/L)$ times radial functions $K_0(n\\pi\\rho/L)$ (modified Bessel functions, which decay as $e^{-n\\pi\\rho/L}$). With the charge at mid-height the $n = 1$ term survives far away: $V \\propto K_0(\\pi\\rho/L)\\sin(\\pi z/L) \\sim e^{-\\pi\\rho/L}$. So $\\gamma L = \\pi$. The infinite alternating image row screens the charge completely at large distances.',
      trap: 'The images do not give a power law: their alternating signs cancel all multipoles, leaving exponential screening.' },
    { id: 'gim-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Kelvin inversion',
      q: 'Kelvin inversion in a sphere of radius $R$ centred at the origin maps $\\vec r \\to \\vec r\\,\' = R^2\\vec r/r^2$. If $V(\\vec r)$ is harmonic, which function is also harmonic (where defined)?',
      options: ['$V(R^2\\vec r/r^2)$', '$\\dfrac{R}{r}\\,V(R^2\\vec r/r^2)$', '$\\dfrac{r}{R}\\,V(R^2\\vec r/r^2)$', '$\\dfrac{R^2}{r^2}\\,V(R^2\\vec r/r^2)$'], answer: 1,
      sol: 'In three dimensions the Kelvin transform $\\tilde V(\\vec r) = \\dfrac Rr V(R^2\\vec r/r^2)$ is harmonic whenever $V$ is. Check with $V = 1$: $\\tilde V = R/r$, harmonic. A point charge at $\\vec r_0$ maps to a charge $qR/r_0$ at $R^2\\vec r_0/r_0^2$: exactly the sphere image (with the sign set by grounding). In 2D no prefactor is needed.' },

    // ---------- level 5 ----------
    { id: 'gim-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'spheres',
      q: 'An isolated conducting sphere of radius $R$ carries charge $Q$. A point charge $q = Q$ approaches it. The force on the point charge vanishes at a distance $d$ from the centre; $d/R$ is ______ (to three decimal places).',
      answer: 1.618, tol: 0.002, calc: () => { const f = (d) => (1 + 1 / d) / d ** 2 - d / (d * d - 1) ** 2; let lo = 1.001, hi = 5; for (let i = 0; i < 100; i++) { const m = (lo + hi) / 2; if (f(m) > 0) hi = m; else lo = m; } return lo; },
      sol: 'With $u = d/R$ and $q = Q$: $F \\propto \\dfrac{1 + 1/u}{u^2} - \\dfrac{u}{(u^2 - 1)^2}$. Setting it to zero: $(u + 1)(u^2 - 1)^2 = u^4$, i.e. $(u + 1)^3(u - 1)^2 = u^4$. Try $u^2 = u + 1$: then $(u + 1)^3 = u^6$ and $u(u - 1) = 1$, so $(u - 1)^2 = 1/u^2$ and the left side is $u^6/u^2 = u^4$. It works: $u = (1 + \\sqrt5)/2 = 1.618$, the golden ratio. Closer than this the charge is attracted.',
      trap: 'Ignoring the induced charge gives pure repulsion at every distance.' },
    { id: 'gim-038', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'image series',
      q: 'A conducting sphere of radius $a$ has its centre at height $h = 2a$ above a grounded plane. Its capacitance (to the plane) is $\\kappa\\times4\\pi\\epsilon_0a$. Using an infinite series of images, $\\kappa$ is ______ (to two decimal places).',
      answer: 1.34, tol: 0.01, calc: () => { const al = Math.acosh(2); let s = 0; for (let n = 1; n < 200; n++) s += 1 / Math.sinh(n * al); return Math.sinh(al) * s; },
      sol: 'Start with $q_0 = 4\\pi\\epsilon_0aV$ at the centre (sphere at $V$). Image it in the plane ($-q_0$ at $-h$), image that in the sphere (a charge inside the sphere), image that in the plane, and so on. With $\\cosh\\alpha = h/a$ the charges inside the sphere form the series $q_n = q_0\\sinh\\alpha/\\sinh(n\\alpha)$, and $C = \\sum q_n/V = 4\\pi\\epsilon_0a\\sinh\\alpha\\sum_{n\\ge1}\\dfrac{1}{\\sinh n\\alpha}$. Here $\\alpha = \\cosh^{-1}2 = 1.317$, $\\sinh\\alpha = \\sqrt3$: terms $0.5774 + 0.1443 + 0.0385 + 0.0103 + 0.0028 + \\dots = 0.774$, so $\\kappa = 1.732\\times0.774 = 1.34$. (Second image check: $q_1 = q_0\\cdot\\dfrac{a}{2h} = 0.25q_0$, matching $\\sinh\\alpha/\\sinh2\\alpha = 1/(2\\cosh\\alpha) = 0.25$.)',
      trap: 'The plane raises the capacitance above the isolated value $4\\pi\\epsilon_0a$ ($\\kappa = 1$).' },
    { id: 'gim-039', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'Kelvin inversion',
      q: 'A charge $q$ sits at distance $d$ from the centre of an isolated neutral conducting sphere of radius $R$. As $d$ becomes large, the force on the charge falls off as',
      options: ['$1/d^2$', '$1/d^3$', '$1/d^4$', '$1/d^5$'], answer: 3,
      sol: 'The image pair ($-qR/d$ at $R^2/d$ and $+qR/d$ at the centre) is a dipole of moment $p = (qR/d)(R^2/d) = qR^3/d^2$, induced by the field $kq/d^2$. The force of a dipole on a charge goes as $2kpq/d^3 = 2kq^2R^3/d^5$. Each step of induction costs powers of $d$: polarisability $\\times$ field squared gradient gives $1/d^5$.',
      trap: 'The grounded sphere falls off as $1/d^3$ (it keeps a net image charge $-qR/d$); the neutral sphere is weaker.' },
    { id: 'gim-040', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'principle',
      q: 'Which of these problems can be solved exactly with a finite number of point (or line) images?',
      options: ['A point charge near a grounded sphere', 'A point charge inside a grounded right-angled wedge (90°)', 'A point charge between two grounded parallel plates', 'A line charge near a grounded conducting cylinder'], answer: [0, 1, 3],
      sol: 'Sphere: one image. Right-angled wedge: three. Cylinder and line: one equal and opposite line. Parallel plates need an infinite image row (images of images bounce between the plates forever); the series converges but is not finite.' },
    { id: 'gim-041', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'cylinders',
      q: 'Two long parallel cylinders of radius $a$, axes a distance $D$ apart, carry $\\pm\\lambda$ per unit length. The equivalent line charges sit at distance $c$ from the midplane, where',
      options: ['$c = D/2$', '$c = \\sqrt{D^2/4 - a^2}$', '$c = D/2 - a$', '$c = \\sqrt{D^2/4 + a^2}$'], answer: 1,
      sol: 'Each cylinder must be an Apollonius circle of the pair $\\pm\\lambda$ at $\\pm c$. A circle of radius $a$ centred at $h$ is such a circle when $h^2 - a^2 = c^2$ (the two lines are inverse points in the circle). With $h = D/2$: $c = \\sqrt{D^2/4 - a^2}$, a little nearer the midplane than the axes.',
      trap: 'Putting the line charges on the axes is only right for thin wires.' },
    { id: 'gim-042', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'spherical cavity',
      q: 'A charge of $+2.0$ nC sits 4.0 cm from the centre of a grounded spherical cavity of radius 8.0 cm. The image charge sits at ______ cm from the centre of the cavity.',
      answer: 16, tol: 0.01, calc: () => 64 / 4,
      sol: '$b = R^2/d = 64/4 = 16$ cm, on the same ray as the charge, with image charge $-qR/d = -4.0$ nC.' },
    ...more2,
  ],

  gens: [
    { id: 'gim-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'spheres',
      make(r) {
        const R = choose(r, [2, 4, 5, 10]), f = choose(r, [1.5, 2, 2.5, 3, 4]), q = choose(r, [1, 2, 3, 5]);
        const d = R * f, F = K * (q * 1e-9) ** 2 * (R / 100) * (d / 100) / ((d / 100) ** 2 - (R / 100) ** 2) ** 2 * 1e6;
        return { q: `A charge of ${q} nC is ${d} cm from the centre of a grounded metal sphere of radius ${R} cm. The magnitude of the force on it is ______ $\\mu$N (to three significant figures).`,
          answer: +F.toPrecision(3), tol: F * 0.01, unit: 'μN', R, d, qc: q,
          sol: `Image $q' = -qR/d$ at $b = R^2/d$. $F = \\dfrac{kq\\,|q'|}{(d - b)^2} = \\dfrac{kq^2Rd}{(d^2 - R^2)^2} = \\dfrac{8.99\\times10^9\\times(${q}\\times10^{-9})^2\\times${R / 100}\\times${d / 100}}{(${round((d / 100) ** 2 - (R / 100) ** 2, 6)})^2} = ${F.toPrecision(4)}$ $\\mu$N, attractive.`,
          trap: 'The distance to the image is $d - R^2/d$, not $d - R$ or $d$.' };
      },
      verify: (p) => K * (p.qc * 1e-9) ** 2 * (p.R / 100) * (p.d / 100) / ((p.d / 100) ** 2 - (p.R / 100) ** 2) ** 2 * 1e6 },
    { id: 'gim-g02', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'spherical cavity',
      make(r) {
        const R = choose(r, [6, 8, 10, 12, 15]), d = choose(r, [2, 3, 4, 5]), q = choose(r, [1, 2, 3, 4]), ask = choose(r, ['pos', 'mag']);
        const val = ask === 'pos' ? R * R / d : -q * R / d;
        return { q: `A charge of $+${q}$ nC sits ${d} cm from the centre of a grounded spherical cavity of radius ${R} cm in a block of metal. ${ask === 'pos' ? 'Its image sits at ______ cm from the centre (to two decimal places).' : 'The image charge is ______ nC (to two decimal places, with sign).'}`,
          answer: round(val, 2), tol: Math.max(0.01, Math.abs(val) * 0.005), unit: ask === 'pos' ? 'cm' : 'nC', R, d, qc: q, ask,
          sol: `Image: $q' = -qR/d = -${q}\\times${R}/${d} = ${round(-q * R / d, 3)}$ nC at $b = R^2/d = ${R * R}/${d} = ${round(R * R / d, 3)}$ cm, outside the cavity on the same ray. (The wall itself carries exactly $-${q}$ nC.)`,
          trap: 'Inside a cavity the image is bigger than the charge and lies outside.' };
      },
      verify: (p) => (p.ask === 'pos' ? p.R * p.R / p.d : -p.qc * p.R / p.d) },
    { id: 'gim-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'cylinders',
      make(r) {
        const kind = choose(r, ['plane', 'pair']), a = choose(r, [0.5, 1, 2]), x = choose(r, [3, 5, 8, 10, 20]);
        const C = kind === 'plane' ? 2 * PI * EPS0 / Math.acosh(x) : PI * EPS0 / Math.acosh(x);
        const val = C * 1e12;
        return { q: kind === 'plane' ? `A wire of radius ${a} mm runs parallel to a grounded plane with its axis ${round(a * x, 2)} mm above the plane. Its capacitance per metre to the plane is ______ pF/m (to two decimal places).` : `A two-wire line has wires of radius ${a} mm with their axes ${round(2 * a * x, 2)} mm apart. Its capacitance per metre is ______ pF/m (to two decimal places).`,
          answer: round(val, 2), tol: val * 0.01, unit: 'pF/m', kind, x,
          sol: kind === 'plane' ? `Exact image result: $C' = \\dfrac{2\\pi\\epsilon_0}{\\cosh^{-1}(h/a)}$ with $h/a = ${x}$, $\\cosh^{-1}${x} = ${round(Math.acosh(x), 4)}$. $C' = \\dfrac{5.563\\times10^{-11}}{${round(Math.acosh(x), 4)}} = ${round(val, 3)}$ pF/m.` : `$C' = \\dfrac{\\pi\\epsilon_0}{\\cosh^{-1}(D/2a)}$ (each wire to the midplane, two in series) with $D/2a = ${x}$, $\\cosh^{-1}${x} = ${round(Math.acosh(x), 4)}$. $C' = \\dfrac{2.782\\times10^{-11}}{${round(Math.acosh(x), 4)}} = ${round(val, 3)}$ pF/m.`,
          trap: kind === 'plane' ? 'Wire to plane uses $2\\pi\\epsilon_0$ and $h/a$.' : 'Wire to wire uses $\\pi\\epsilon_0$ and $D/2a$.' };
      },
      verify: (p) => (p.kind === 'plane' ? 2 : 1) * PI * EPS0 / Math.acosh(p.x) * 1e12 },
    { id: 'gim-g04', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'reciprocity',
      make(r) {
        const L = choose(r, [4, 5, 8, 10, 12]), x = int(r, 1, L - 1), q = choose(r, [2, 4, 6, 10]), which = choose(r, [1, 2]);
        const val = which === 1 ? -q * (L - x) / L : -q * x / L;
        return { q: `Two large parallel grounded plates are ${L} cm apart. A point charge of $+${q}$ nC is placed between them, ${x} cm from plate 1. The total charge induced on plate ${which} is ______ nC (to two decimal places, with sign).`,
          answer: round(val, 2), tol: Math.max(0.01, Math.abs(val) * 0.005), unit: 'nC', L, x, qc: q, which,
          sol: `Green reciprocity (or smearing $q$ into a sheet at the same position, which cannot change the totals): $Q_1 = -q\\dfrac{L - x}{L}$, $Q_2 = -q\\dfrac{x}{L}$. Plate ${which}: ${which === 1 ? `$-${q}\\times${L - x}/${L}$` : `$-${q}\\times${x}/${L}$`} $= ${round(val, 3)}$ nC. The two add to $-${q}$ nC.`,
          trap: 'The nearer plate takes the larger share, proportional to the distance to the far plate.' };
      },
      verify: (p) => (p.which === 1 ? -p.qc * (p.L - p.x) / p.L : -p.qc * p.x / p.L) },
    { id: 'gim-g05', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'dipoles',
      make(r) {
        const a = choose(r, [0, 30, 45, 60, 90, 120, 135, 150, 180]);
        const img = ((360 - a) % 360);
        const show = (v) => `${v}$^\\circ$`;
        const cands = [a, 180 - a, 180 + a, a + 90, 270 - a, a + 270].map((v) => ((v % 360) + 360) % 360);
        const wr = [...new Set(cands)].filter((v) => v !== img).slice(0, 3);
        const o = mcqOptions(r, img, wr, show);
        return { q: `A point dipole sits above a grounded conducting plane. Its moment makes an angle of ${a}$^\\circ$ with the upward normal, measured towards $+x$ (so 0° points straight up and 90° points along $+x$). The image dipole's moment makes, measured the same way from the upward normal, the angle`, ...o,
          sol: `Image each charge: the component perpendicular to the plane keeps its direction and the component along the plane reverses. So $(p_x, p_z) = (p\\sin${a}^\\circ, p\\cos${a}^\\circ) \\to (-p\\sin${a}^\\circ, p\\cos${a}^\\circ)$, an angle of $-${a}^\\circ \\equiv ${img}^\\circ$.`,
          trap: 'A mirror reflection (as in optics) would reverse the perpendicular part instead; the sign change of the image charges undoes that.' };
      } },
    { id: 'gim-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'spheres',
      make(r) {
        const inside = r() < 0.4, R = choose(r, [5, 10]), q = choose(r, [1, 2, 5]);
        const d = inside ? R * choose(r, [0.25, 0.5, 0.6]) : R * choose(r, [1.5, 2, 3]);
        const Rm = R / 100, dm = d / 100, sig = q * 1e-9 * Math.abs(dm * dm - Rm * Rm) / (4 * PI * Rm * Math.abs(dm - Rm) ** 3) * 1e9;
        return { q: `A charge of $+${q}$ nC is ${d} cm from the centre of ${inside ? 'a grounded spherical cavity' : 'a grounded metal sphere'} of radius ${R} cm. The magnitude of the induced surface charge density at the point of the ${inside ? 'cavity wall' : 'sphere'} nearest the charge is ______ nC/m$^2$ (to three significant figures).`,
          answer: +sig.toPrecision(3), tol: sig * 0.01, unit: 'nC/m²', Rm, dm, qc: q,
          sol: `From the image $-qR/d$ at $R^2/d$: $|\\sigma(\\theta)| = \\dfrac{q\\,|d^2 - R^2|}{4\\pi R(R^2 + d^2 - 2Rd\\cos\\theta)^{3/2}}$, which at the nearest point ($\\theta = 0$) is $\\dfrac{q(d + R)}{4\\pi R\\,|d - R|^2}$. Numbers: $\\dfrac{${q}\\times10^{-9}\\times${round(dm + Rm, 4)}}{4\\pi\\times${Rm}\\times${round((dm - Rm) ** 2, 6)}} = ${sig.toPrecision(4)}$ nC/m$^2$.`,
          trap: 'The same formula holds inside and outside a sphere: only $|d - R|$ matters at the nearest point.' };
      },
      verify: (p) => p.qc * 1e-9 * Math.abs(p.dm ** 2 - p.Rm ** 2) / (4 * PI * p.Rm * Math.abs(p.dm - p.Rm) ** 3) * 1e9 },
    { id: 'gim-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'line charges',
      make(r) {
        const h = choose(r, [2, 3, 4, 5, 10]), a = choose(r, [1, 2, 3, 5, 10, 20]);
        const val = (2 / PI) * Math.atan(a / h) * 100;
        return { q: `A long line charge runs parallel to a grounded plane at height ${h} cm. What percentage of the total induced charge lies in the strip of the plane within ${a} cm on either side of the point directly beneath it? Answer to one decimal place.`,
          answer: round(val, 1), tol: Math.max(0.1, val * 0.005), unit: '%', h, a,
          sol: `$\\sigma(x) = -\\dfrac{\\lambda h}{\\pi(x^2 + h^2)}$ from the line and its image. $\\displaystyle\\int_{-a}^{a}\\sigma\\,dx = -\\dfrac{2\\lambda}{\\pi}\\tan^{-1}\\dfrac ah$ and the whole plane carries $-\\lambda$. Fraction: $\\dfrac2\\pi\\tan^{-1}\\dfrac{${a}}{${h}} = ${round(val / 100, 4)}$, i.e. ${round(val, 2)}%.`,
          trap: 'A line spreads its induced charge more widely than a point charge: it decays as $1/x^2$, not $1/\\rho^3$.' };
      },
      verify: (p) => (2 / PI) * Math.atan(p.a / p.h) * 100 },
    { id: 'gim-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'cylinders',
      make(r) {
        const lam = choose(r, [5, 10, 20]), R = choose(r, [1, 2, 3]), d = R * choose(r, [1.5, 2, 3]), inside = r() < 0.3;
        const dd = inside ? R * choose(r, [0.3, 0.5]) : d;
        const sep = Math.abs(R * R / dd - dd) / 100, F = (lam * 1e-9) ** 2 / (2 * PI * EPS0 * sep) * 1e6;
        return { q: `A line charge of ${lam} nC/m runs parallel to the axis of a long conducting ${inside ? 'tube' : 'cylinder'} of radius ${R} cm, ${round(dd, 2)} cm from the axis (${inside ? 'inside the tube' : 'outside the cylinder'}), and the ${inside ? 'tube' : 'cylinder'} carries $-${lam}$ nC/m. The magnitude of the force per metre on the line charge is ______ $\\mu$N/m (to three significant figures).`,
          answer: +F.toPrecision(3), tol: F * 0.01, unit: 'μN/m', lam, R, dd,
          sol: `Image: $-\\lambda$ at $b = R^2/d = ${round(R * R / dd, 3)}$ cm from the axis, same side. Separation $|b - d| = ${round(sep * 100, 4)}$ cm. $F' = \\dfrac{\\lambda^2}{2\\pi\\epsilon_0|b - d|} = \\dfrac{(${lam}\\times10^{-9})^2}{5.563\\times10^{-11}\\times${round(sep, 6)}} = ${F.toPrecision(4)}$ $\\mu$N/m, towards the nearest wall.`,
          trap: 'The image line has the full strength $-\\lambda$, unlike a sphere\'s image.' };
      },
      verify: (p) => (p.lam * 1e-9) ** 2 / (2 * PI * EPS0 * Math.abs(p.R * p.R / p.dd - p.dd) / 100) * 1e6 },
    { id: 'gim-g09', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'spheres',
      make(r) {
        const R = choose(r, [2, 5, 10]), f = choose(r, [1.2, 1.5, 2, 3]), q = choose(r, [1, 2]), Q = choose(r, [-4, -1, 0, 1, 2, 5, 10]);
        const Rm = R / 100, dm = R * f / 100;
        const F = K * q * 1e-9 * ((Q * 1e-9 + q * 1e-9 * Rm / dm) / dm ** 2 - q * 1e-9 * Rm * dm / (dm * dm - Rm * Rm) ** 2) * 1e6;
        return { q: `An isolated conducting sphere of radius ${R} cm carries charge ${Q} nC. A point charge of $+${q}$ nC is ${round(R * f, 2)} cm from its centre. Find the radial force on the point charge in $\\mu$N, positive if repulsive and negative if attractive (to three significant figures).`,
          answer: +F.toPrecision(3), tol: Math.max(Math.abs(F) * 0.01, 1e-4), unit: 'μN', Rm, dm, qc: q, Q,
          sol: `Images: $-qR/d$ at $R^2/d$ (grounds the sphere) and $Q + qR/d$ at the centre (restores the total charge $Q$). $F = kq\\left[\\dfrac{Q + qR/d}{d^2} - \\dfrac{qRd}{(d^2 - R^2)^2}\\right]$. Here $qR/d = ${round(q * Rm / dm, 4)}$ nC: $F = 8.99\\times10^9\\times${q}\\times10^{-9}\\left[\\dfrac{${round(Q + q * Rm / dm, 4)}\\times10^{-9}}{${round(dm * dm, 6)}} - \\dfrac{${round(q * Rm * dm, 6)}\\times10^{-9}}{${round((dm * dm - Rm * Rm) ** 2, 9)}}\\right] = ${F.toPrecision(4)}$ $\\mu$N.`,
          trap: 'Close to the surface the attraction to the image beats the repulsion from the sphere\'s own charge.' };
      },
      verify: (p) => K * p.qc * 1e-9 * ((p.Q * 1e-9 + p.qc * 1e-9 * p.Rm / p.dm) / p.dm ** 2 - p.qc * 1e-9 * p.Rm * p.dm / (p.dm ** 2 - p.Rm ** 2) ** 2) * 1e6 },
    { id: 'gim-g10', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'dipoles',
      make(r) {
        const orient = choose(r, ['perpendicular', 'parallel']), p = choose(r, [0.5, 1, 2, 4]), d = choose(r, [0.5, 1, 2]);
        const c = orient === 'perpendicular' ? 3 / 8 : 3 / 16;
        const F = c * K * (p * 1e-12) ** 2 / (d / 100) ** 4 * 1e6;
        return { q: `A small electric dipole of moment ${p}$\\times10^{-12}$ C m is held ${d} cm above a large grounded metal plate, ${orient} to the plate. The magnitude of the force on it is ______ $\\mu$N (to three significant figures).`,
          answer: +F.toPrecision(3), tol: F * 0.01, unit: 'μN', c, p, d,
          sol: `${orient === 'perpendicular' ? 'The image is an equal dipole pointing the same way at depth $d$: coaxial, head to tail, $r = 2d$. $F = \\dfrac{6kp^2}{r^4} = \\dfrac{3kp^2}{8d^4}$.' : 'The image is antiparallel, directly below: side by side at $r = 2d$, $U = -kp^2/r^3$, so $F = \\dfrac{3kp^2}{r^4} = \\dfrac{3kp^2}{16d^4}$.'} Numbers: $${round(c, 4)}\\times8.99\\times10^9\\times(${p}\\times10^{-12})^2/(${d / 100})^4 = ${F.toPrecision(4)}$ $\\mu$N, attractive.`,
          trap: 'Perpendicular dipoles are pulled twice as hard as parallel ones at the same height.' };
      },
      verify: (p) => p.c * K * (p.p * 1e-12) ** 2 / (p.d / 100) ** 4 * 1e6 },
    { id: 'gim-g11', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'images in curved conductors',
      make(r) {
        const f = choose(r, [1.5, 2, 2.5, 3, 4]);
        // q at f R; images: -q/f at 1/f, -q at -f, +q/f at -1/f (units R). Force toward plane positive.
        const k = (1 / f) / (f - 1 / f) ** 2 + 1 / (2 * f) ** 2 - (1 / f) / (f + 1 / f) ** 2;
        return { q: `A grounded plane has a hemispherical boss of radius $R$ on it. A point charge $q$ is on the axis of the boss at height ${f}$R$. The magnitude of the force on it is $\\kappa\\,kq^2/R^2$. Find $\\kappa$ (to three decimal places).`,
          answer: round(k, 3), tol: Math.max(0.001, k * 0.005), f,
          sol: `Images (heights in units of $R$): $-q/${f}$ at $${round(1 / f, 4)}$, $-q$ at $-${f}$, $+q/${f}$ at $-${round(1 / f, 4)}$. Distances from $q$: $${round(f - 1 / f, 4)}$, $${2 * f}$, $${round(f + 1 / f, 4)}$. Pull towards the plane: $\\kappa = \\dfrac{1/${f}}{${round(f - 1 / f, 4)}^2} + \\dfrac{1}{${2 * f}^2} - \\dfrac{1/${f}}{${round(f + 1 / f, 4)}^2} = ${round(k, 4)}$.`,
          trap: 'Leaving out the positive image below the plane overestimates the pull.' };
      },
      verify: (p) => (1 / p.f) / (p.f - 1 / p.f) ** 2 + 1 / (2 * p.f) ** 2 - (1 / p.f) / (p.f + 1 / p.f) ** 2 },
    { id: 'gim-g12', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'image series',
      make(r) {
        const ha = choose(r, [1.2, 1.5, 2, 3, 5]);
        const al = Math.acosh(ha); let s = 0; for (let n = 1; n < 400; n++) s += 1 / Math.sinh(n * al);
        const k = Math.sinh(al) * s;
        return { q: `A conducting sphere of radius $a$ has its centre at height $h = ${ha}a$ above a large grounded plane. Its capacitance is $\\kappa\\times4\\pi\\epsilon_0a$. Find $\\kappa$ (to two decimal places).`,
          answer: round(k, 2), tol: Math.max(0.01, k * 0.005), ha,
          sol: `Successive images between sphere and plane give charges $q_n = q_0\\sinh\\alpha/\\sinh n\\alpha$ inside the sphere, with $\\cosh\\alpha = h/a = ${ha}$, so $\\alpha = ${round(al, 4)}$ and $\\sinh\\alpha = ${round(Math.sinh(al), 4)}$. $\\kappa = \\sinh\\alpha\\sum_{n\\ge1}1/\\sinh n\\alpha$: first terms ${[1, 2, 3].map((n) => round(1 / Math.sinh(n * al), 4)).join(', ')}, ...; the sum is ${round(s, 4)}, so $\\kappa = ${round(k, 3)}$.`,
          trap: 'The nearer the plane, the more image terms matter and the larger the capacitance.' };
      },
      verify: (p) => { const al = Math.acosh(p.ha); let s = 0; for (let n = 1; n < 400; n++) s += 1 / Math.sinh(n * al); return Math.sinh(al) * s; } },
    ...more,
  ],
};
