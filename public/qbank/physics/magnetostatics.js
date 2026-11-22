// Magnetic fields: Lorentz force and charged-particle motion, Biot-Savart law (wires, loops, arcs, polygons, discs),
// Ampère's law (thick wires, solenoids, toroids, sheets, coaxial cables), magnetic dipoles, vector potential.
// Original questions for IIT JAM, GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { int, choose, mcqOptions, round, fmt, C } from '../_util.js';

const MU = C.mu0;
const ALPHA_M = 6.6446573357e-27, DEUT_M = 3.3435837724e-27;

export default {
  topic: 'magnetostatics',
  items: [
    // ---------- level 1 ----------
    { id: 'mag-001', type: 'nat', level: 1, exams: ['jam'], sub: 'biot-savart: wires', unit: '$\\mu$T',
      q: 'A long straight wire carries 10 A. The magnetic field 5.0 cm from it is ______ $\\mu$T (to one decimal place).',
      answer: 40.0, tol: 0.4, calc: () => MU * 10 / (2 * Math.PI * 0.05) * 1e6,
      sol: '$B = \\dfrac{\\mu_0I}{2\\pi s} = \\dfrac{(4\\pi\\times10^{-7})(10)}{2\\pi(0.05)} = 4.0\\times10^{-5}$ T $= 40.0\\,\\mu$T, about the strength of the Earth\'s field.' },
    { id: 'mag-002', type: 'mcq', level: 1, exams: ['jam'], sub: 'lorentz force',
      q: 'A proton moves exactly parallel to a uniform magnetic field. The magnetic force on it is',
      options: ['$qvB$, along $\\vec v$', 'zero', '$qvB$, perpendicular to $\\vec v$', '$qvB/2$'], answer: 1,
      sol: '$\\vec F = q\\vec v\\times\\vec B$ and the cross product of parallel vectors is zero. The proton keeps moving in a straight line at constant speed.' },
    { id: 'mag-003', type: 'mcq', level: 1, exams: ['jam'], sub: 'biot-savart: loops',
      q: 'The magnetic field at the centre of a circular loop of radius $R$ carrying current $I$ is',
      options: ['$\\dfrac{\\mu_0I}{2\\pi R}$', '$\\dfrac{\\mu_0I}{4R}$', '$\\dfrac{\\mu_0I}{2R}$', '$\\dfrac{\\mu_0IR}{2}$'], answer: 2,
      sol: 'Every element $d\\vec l$ is at distance $R$ and perpendicular to the line to the centre, so $dB = \\dfrac{\\mu_0I\\,dl}{4\\pi R^2}$, all in the same direction. Adding $\\oint dl = 2\\pi R$ gives $B = \\dfrac{\\mu_0I}{2R}$.',
      trap: '$\\mu_0I/(2\\pi R)$ is the field of a straight wire at distance $R$.' },
    { id: 'mag-004', type: 'nat', level: 1, exams: ['jam'], sub: 'ampere: solenoids', unit: 'mT',
      q: 'A long solenoid has 1000 turns per metre and carries 2.0 A. The field inside is ______ mT (to two decimal places).',
      answer: 2.51, tol: 0.03, calc: () => MU * 1000 * 2 * 1000,
      sol: '$B = \\mu_0nI = (4\\pi\\times10^{-7})(1000)(2.0) = 2.51\\times10^{-3}$ T.' },
    { id: 'mag-005', type: 'mcq', level: 1, exams: ['jam'], sub: 'biot-savart: wires',
      q: 'A long wire along the $z$-axis carries current in the $+z$ direction. At a point on the positive $x$-axis, the magnetic field points along',
      options: ['$+\\hat x$', '$-\\hat y$', '$+\\hat z$', '$+\\hat y$'], answer: 3,
      sol: 'Right-hand rule: thumb along $+z$, fingers curl anticlockwise seen from above. At $+x$ that is the $+y$ direction. Formally $\\vec B \\propto \\hat z\\times\\hat x = \\hat y$.' },
    { id: 'mag-006', type: 'msq', level: 1, exams: ['jam'], sub: 'basics',
      q: 'Which statements are correct for static magnetic fields?',
      options: ['$\\nabla\\cdot\\vec B = 0$ everywhere.', 'The magnetic force on a moving charge does no work.', 'Magnetic field lines start and end on magnetic charges.', '$\\oint\\vec B\\cdot d\\vec l = \\mu_0I_{\\text{enc}}$ for any closed loop.'], answer: [0, 1, 3],
      sol: 'A: there are no magnetic monopoles. B: $\\vec F = q\\vec v\\times\\vec B$ is always perpendicular to $\\vec v$, so $\\vec F\\cdot\\vec v = 0$. D is Ampère\'s law for steady currents. C is false: $\\nabla\\cdot\\vec B = 0$ means field lines have no ends; they close on themselves or go to infinity.' },

    // ---------- level 2 ----------
    { id: 'mag-007', type: 'nat', level: 2, exams: ['jam'], sub: 'charged particle motion', unit: 'cm',
      q: 'A proton moving at $1.0\\times10^6$ m/s enters a uniform field of 0.50 T at right angles. The radius of its circular path is ______ cm (to two decimal places).',
      answer: 2.09, tol: 0.02, calc: () => C.mp * 1e6 / (C.e * 0.5) * 100,
      sol: 'The magnetic force supplies the centripetal force: $qvB = mv^2/r$, so $r = \\dfrac{mv}{qB} = \\dfrac{(1.673\\times10^{-27})(10^6)}{(1.602\\times10^{-19})(0.50)} = 0.0209$ m.' },
    { id: 'mag-008', type: 'mcq', level: 2, exams: ['jam'], sub: 'forces on currents',
      q: 'Two long parallel wires a distance $d$ apart carry currents $I_1$ and $I_2$ in the same direction. The force per unit length between them is',
      options: ['$\\dfrac{\\mu_0I_1I_2}{2\\pi d}$, attractive', '$\\dfrac{\\mu_0I_1I_2}{2\\pi d}$, repulsive', '$\\dfrac{\\mu_0I_1I_2}{4\\pi d^2}$, attractive', '$\\dfrac{\\mu_0I_1I_2}{2\\pi d^2}$, repulsive'], answer: 0,
      sol: 'Wire 1 makes $B_1 = \\mu_0I_1/(2\\pi d)$ at wire 2, so the force per length on wire 2 is $I_2B_1$. The right-hand rule shows it points towards wire 1: parallel currents attract (the opposite of like charges).',
      trap: 'Thinking "like attracts like is wrong", by analogy with charges; for currents, parallel attract.' },
    { id: 'mag-009', type: 'nat', level: 2, exams: ['jam'], sub: 'forces on currents', unit: 'mN/m',
      q: 'Two long parallel wires 2.0 cm apart carry 5.0 A and 8.0 A. The force per metre on each is ______ mN/m (to three decimal places).',
      answer: 0.4, tol: 0.004, calc: () => MU * 5 * 8 / (2 * Math.PI * 0.02) * 1000,
      sol: '$\\dfrac{F}{L} = \\dfrac{\\mu_0I_1I_2}{2\\pi d} = \\dfrac{(2\\times10^{-7})(5)(8)}{0.02} = 4.0\\times10^{-4}$ N/m $= 0.400$ mN/m. Newton\'s third law: both wires feel the same force.',
      trap: 'Thinking the bigger current feels a smaller force: the forces are equal and opposite.' },
    { id: 'mag-010', type: 'mcq', level: 2, exams: ['jam'], sub: 'ampere: wires',
      q: 'A long straight wire of radius $R$ carries current $I$ spread uniformly over its cross-section. The field at distance $s < R$ from the axis is',
      options: ['$\\dfrac{\\mu_0Is}{2\\pi R^2}$', '$\\dfrac{\\mu_0I}{2\\pi s}$', 'zero', '$\\dfrac{\\mu_0Is^2}{2\\pi R^3}$'], answer: 0,
      sol: 'An Amperian circle of radius $s$ encloses $I s^2/R^2$. $B(2\\pi s) = \\mu_0Is^2/R^2$, so $B = \\dfrac{\\mu_0Is}{2\\pi R^2}$, rising linearly to the surface value $\\mu_0I/(2\\pi R)$.',
      trap: 'Zero is right for a hollow tube, not a solid wire.' },
    { id: 'mag-011', type: 'nat', level: 2, exams: ['jam'], sub: 'ampere: solenoids', unit: 'mT',
      q: 'A toroid has 500 turns and carries 3.0 A. The field inside the core, 10 cm from the toroid\'s central axis, is ______ mT (to two decimal places).',
      answer: 3.00, tol: 0.03, calc: () => MU * 500 * 3 / (2 * Math.PI * 0.1) * 1000,
      sol: 'An Amperian circle of radius $s$ inside the core links the current $NI$: $B = \\dfrac{\\mu_0NI}{2\\pi s} = \\dfrac{(2\\times10^{-7})(1500)}{0.10} = 3.00\\times10^{-3}$ T. Outside the toroid, $B = 0$.' },
    { id: 'mag-012', type: 'mcq', level: 2, exams: ['jam'], sub: 'biot-savart: loops',
      q: 'The field on the axis of a circular loop (radius $R$, current $I$) at distance $z$ from its centre is',
      options: ['$\\dfrac{\\mu_0I}{2(R^2 + z^2)^{1/2}}$', '$\\dfrac{\\mu_0IR^2}{2(R^2 + z^2)^{3/2}}$', '$\\dfrac{\\mu_0IR}{2(R^2 + z^2)}$', '$\\dfrac{\\mu_0IR^2}{4\\pi(R^2+z^2)^{3/2}}$'], answer: 1,
      sol: 'Each element is $\\sqrt{R^2+z^2}$ away and contributes $dB = \\dfrac{\\mu_0I\\,dl}{4\\pi(R^2+z^2)}$; only the axial part, a fraction $R/\\sqrt{R^2+z^2}$, survives. Summing $\\oint dl = 2\\pi R$: $B = \\dfrac{\\mu_0IR^2}{2(R^2+z^2)^{3/2}}$. Check: $z = 0$ gives $\\mu_0I/(2R)$.' },
    { id: 'mag-013', type: 'nat', level: 2, exams: ['jam'], sub: 'magnetic dipole', unit: '$10^{-2}$ A m$^2$',
      q: 'A circular loop of radius 5.0 cm carries 2.0 A. Its magnetic dipole moment is ______ $\\times10^{-2}$ A m$^2$ (to two decimal places).',
      answer: 1.57, tol: 0.02, calc: () => 2 * Math.PI * 0.05 ** 2 * 100,
      sol: '$m = IA = 2.0\\times\\pi(0.05)^2 = 1.57\\times10^{-2}$ A m$^2$.' },
    { id: 'mag-014', type: 'msq', level: 2, exams: ['jam'], sub: 'charged particle motion',
      q: 'A non-relativistic charged particle moves in a plane perpendicular to a uniform magnetic field. Which are correct?',
      options: ['Its period of revolution does not depend on its speed.', 'The radius of its orbit is proportional to its speed.', 'Its kinetic energy increases steadily.', 'Its angular frequency is $qB/m$.'], answer: [0, 1, 3],
      sol: '$r = mv/(qB) \\propto v$ and $T = 2\\pi r/v = 2\\pi m/(qB)$, independent of $v$; $\\omega = qB/m$ (the cyclotron frequency). C is false: the magnetic force does no work, so the speed is constant.' },
    { id: 'mag-015', type: 'mcq', level: 2, exams: ['jam'], sub: 'biot-savart: wires',
      q: 'A very long straight wire ends at point $O$ (current flows towards $O$ and away along a return path far away). At a point $P$ a distance $d$ from $O$, on the line through $O$ perpendicular to the wire, the field due to this semi-infinite wire is',
      options: ['$\\dfrac{\\mu_0I}{2\\pi d}$', '$\\dfrac{\\mu_0I}{4\\pi d}$', '$\\dfrac{\\mu_0I}{4d}$', 'zero'], answer: 1,
      sol: 'For a straight segment, $B = \\dfrac{\\mu_0I}{4\\pi d}(\\sin\\alpha_2 - \\sin\\alpha_1)$ with angles measured from the perpendicular. Here one end is at the foot of the perpendicular ($\\alpha = 0$) and the other at infinity ($90^\\circ$): $B = \\dfrac{\\mu_0I}{4\\pi d}$, half the infinite-wire value.' },
    { id: 'mag-016', type: 'nat', level: 2, exams: ['jam'], sub: 'biot-savart: wires', unit: '$\\mu$T',
      q: 'A square loop of side 20 cm carries 5.0 A. The field at its centre is ______ $\\mu$T (to one decimal place).',
      answer: 28.3, tol: 0.3, calc: () => 2 * Math.SQRT2 * MU * 5 / (Math.PI * 0.2) * 1e6,
      sol: 'Each side is a segment at distance $a/2$ seen under $\\pm45^\\circ$: $B_{\\text{side}} = \\dfrac{\\mu_0I}{4\\pi(a/2)}(2\\sin45^\\circ) = \\dfrac{\\sqrt2\\mu_0I}{2\\pi a}$. All four add: $B = \\dfrac{2\\sqrt2\\mu_0I}{\\pi a} = \\dfrac{2\\sqrt2(4\\pi\\times10^{-7})(5)}{\\pi(0.2)} \\approx 28.3\\,\\mu$T.',
      trap: 'Using the infinite-wire formula for each side (gives 40 $\\mu$T).' },

    // ---------- level 3 ----------
    { id: 'mag-017', type: 'nat', level: 3, exams: ['jam'], sub: 'biot-savart: wires', unit: '$\\mu$T',
      q: 'A hairpin-shaped wire is a semicircle of radius 5.0 cm joined to two long straight parallel legs that run off tangentially in the same direction. It carries 10 A. The field at the centre of the semicircle is ______ $\\mu$T (to one decimal place).',
      answer: 102.8, tol: 1, calc: () => MU * 10 / (4 * 0.05) * (1 + 2 / Math.PI) * 1e6,
      sol: 'Semicircle: half a loop, $\\dfrac{\\mu_0I}{4R}$. Each leg is a semi-infinite wire whose end is at the foot of the perpendicular from the centre (distance $R$): $\\dfrac{\\mu_0I}{4\\pi R}$ each. All three point the same way (current goes in along one leg and out along the other, round the arc). Total $\\dfrac{\\mu_0I}{4R}\\left(1 + \\dfrac2\\pi\\right) = (6.28\\times10^{-5})(1.637) \\approx 1.028\\times10^{-4}$ T.',
      trap: 'Letting the two legs cancel because their currents are opposite; they are on opposite sides of the centre, so their fields add.' },
    { id: 'mag-018', type: 'mcq', level: 3, exams: ['jam'], sub: 'ampere: wires',
      q: 'A coaxial cable carries current $I$ along the inner conductor and back along the outer sheath. The field magnitude between the conductors and outside the cable is',
      options: ['$\\dfrac{\\mu_0I}{2\\pi s}$ between and zero outside', 'zero between and $\\dfrac{\\mu_0I}{2\\pi s}$ outside', '$\\dfrac{\\mu_0I}{2\\pi s}$ both between and outside', '$\\dfrac{\\mu_0I}{\\pi s}$ outside'], answer: 0,
      sol: 'Amperian circles: between the conductors they enclose $I$; outside they enclose $I - I = 0$. By symmetry $B$ is constant around each circle, so $B = \\mu_0I/(2\\pi s)$ between and $0$ outside.' },
    { id: 'mag-019', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'vector potential',
      q: 'Which statements about the magnetic vector potential $\\vec A$ (with $\\vec B = \\nabla\\times\\vec A$) are correct?',
      options: ['$\\nabla\\cdot\\vec B = 0$ follows automatically.', '$\\vec A$ is uniquely fixed by $\\vec B$.', 'One may always choose $\\nabla\\cdot\\vec A = 0$ (Coulomb gauge).', 'In the Coulomb gauge, $\\nabla^2\\vec A = -\\mu_0\\vec J$ for static currents.'], answer: [0, 2, 3],
      sol: 'A: the divergence of a curl is zero. B is false: adding $\\nabla\\lambda$ to $\\vec A$ changes nothing, since $\\nabla\\times\\nabla\\lambda = 0$. C: that freedom lets us make $\\nabla\\cdot\\vec A = 0$. D: $\\nabla\\times(\\nabla\\times\\vec A) = \\nabla(\\nabla\\cdot\\vec A) - \\nabla^2\\vec A = \\mu_0\\vec J$ becomes $\\nabla^2\\vec A = -\\mu_0\\vec J$, three Poisson equations.' },
    { id: 'mag-020', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'biot-savart: loops', unit: 'mT',
      q: 'A Helmholtz pair has two coaxial coils of 100 turns each, radius 10 cm, a distance 10 cm apart, each carrying 1.0 A in the same sense. The field midway between them is ______ mT (to three decimal places).',
      answer: 0.899, tol: 0.009, calc: () => 2 * MU * 100 * 1 * 0.1 ** 2 / (2 * (0.1 ** 2 + 0.05 ** 2) ** 1.5) * 1000,
      sol: 'Each coil is $z = R/2$ from the midpoint: $B_1 = \\dfrac{\\mu_0NIR^2}{2(R^2 + R^2/4)^{3/2}} = \\dfrac{\\mu_0NI}{2R}\\left(\\dfrac45\\right)^{3/2}$. Two coils: $B = \\left(\\dfrac45\\right)^{3/2}\\dfrac{\\mu_0NI}{R} = 0.7155\\times\\dfrac{(4\\pi\\times10^{-7})(100)}{0.10} \\approx 8.99\\times10^{-4}$ T. Try the [coil field designer](/science/coil-field-designer/) to see how uniform it is.' },
    { id: 'mag-021', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'ampere: sheets',
      q: 'An infinite flat sheet carries a uniform surface current density $K$ (A/m). The magnetic field near it is',
      options: ['$\\mu_0K$, perpendicular to the sheet', '$\\mu_0K/2$, parallel to the sheet and perpendicular to $\\vec K$, opposite on the two sides', '$\\mu_0K/2$, parallel to $\\vec K$', '$\\mu_0K/(2\\pi d)$, falling with distance $d$'], answer: 1,
      sol: 'A rectangular Amperian loop straddling the sheet, of length $l$ along the sheet perpendicular to $\\vec K$, gives $2Bl = \\mu_0Kl$, so $B = \\mu_0K/2$, independent of distance. Its direction (right-hand rule) is parallel to the sheet, perpendicular to $\\vec K$, and reverses across the sheet. Compare the sheet of charge, $\\sigma/(2\\epsilon_0)$.' },
    { id: 'mag-022', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'ampere: wires',
      q: 'A long wire of radius $R$ carries a current density $J = J_0s/R$ that grows with distance $s$ from the axis. The ratio $B(R/2)/B(R)$ is ______ (to two decimal places).',
      answer: 0.25, tol: 0.01, calc: () => 0.5 ** 2,
      sol: 'Enclosed current: $I(s) = \\int_0^sJ_0\\dfrac{s\'}{R}2\\pi s\'ds\' = \\dfrac{2\\pi J_0s^3}{3R}$. Ampère: $B = \\dfrac{\\mu_0I(s)}{2\\pi s} = \\dfrac{\\mu_0J_0s^2}{3R}$, so $B\\propto s^2$ inside and the ratio is $1/4$.',
      trap: 'Using the uniform-current result $B\\propto s$ (giving 0.5).' },
    { id: 'mag-023', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'magnetic dipole',
      q: 'Far from a small current loop of moment $m$, how does the field on its axis compare with the field at the same distance in its plane?',
      options: ['The axial field is twice as large; it points along $\\vec m$, while the in-plane field points opposite to $\\vec m$.', 'They are equal and both along $\\vec m$.', 'The in-plane field is twice as large.', 'The axial field falls as $1/r^2$, the in-plane field as $1/r^3$.'], answer: 0,
      sol: 'A small loop is a magnetic dipole with the same far-field shape as an electric dipole: $B_{\\text{axis}} = \\dfrac{\\mu_0}{4\\pi}\\dfrac{2m}{r^3}$ along $\\vec m$ and $B_{\\text{plane}} = \\dfrac{\\mu_0}{4\\pi}\\dfrac{m}{r^3}$ opposite to $\\vec m$. Check: on the axis of a loop at large $z$, $\\dfrac{\\mu_0IR^2}{2z^3} = \\dfrac{\\mu_0}{4\\pi}\\dfrac{2(I\\pi R^2)}{z^3}$.' },
    { id: 'mag-024', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'biot-savart: loops', unit: 'T',
      q: 'In the Bohr model, the electron in hydrogen\'s ground state circles at $a_0 = 5.29\\times10^{-11}$ m with speed $2.19\\times10^6$ m/s. The magnetic field this orbiting charge makes at the proton is about ______ T (to one decimal place).',
      answer: 12.5, tol: 0.15, calc: () => { const v = 1 / (4 * Math.PI * C.eps0) * C.e ** 2 / C.hbar, I = C.e * v / (2 * Math.PI * C.a0); return MU * I / (2 * C.a0); },
      sol: 'The orbit is a current loop with $I = \\dfrac{e}{T} = \\dfrac{ev}{2\\pi a_0} = \\dfrac{(1.602\\times10^{-19})(2.19\\times10^6)}{2\\pi(5.29\\times10^{-11})} \\approx 1.05$ mA. At the centre, $B = \\dfrac{\\mu_0I}{2a_0} = \\dfrac{(4\\pi\\times10^{-7})(1.05\\times10^{-3})}{2(5.29\\times10^{-11})} \\approx 12.5$ T, a strong field, which is why fine structure exists.' },
    { id: 'mag-025', type: 'mcq', level: 3, exams: ['jam'], sub: 'charged particle motion',
      q: 'In a velocity selector, crossed fields $E$ and $B$ act on a beam containing protons, electrons and alpha particles of many speeds. Which particles pass straight through?',
      options: ['Only protons with $v = E/B$', 'All particles with $v = E/B$, whatever their charge or mass', 'All particles with $v = B/E$', 'Only particles with $qE = mv^2$'], answer: 1,
      sol: 'Undeflected means $qE = qvB$, so $v = E/B$. The charge cancels (both forces flip sign together) and the mass never enters.' },
    { id: 'mag-026', type: 'nat', level: 3, exams: ['jam'], sub: 'charged particle motion', unit: 'cm',
      q: 'A proton moving at $2.0\\times10^5$ m/s enters a uniform 0.10 T field with its velocity at $60^\\circ$ to the field. The pitch of its helical path is ______ cm (to two decimal places).',
      answer: 6.56, tol: 0.07, calc: () => 2 * Math.PI * C.mp * 2e5 * 0.5 / (C.e * 0.1) * 100,
      sol: 'The period is $T = 2\\pi m/(qB)$, set by the motion perpendicular to $\\vec B$. Along $\\vec B$ the proton moves uniformly at $v\\cos60^\\circ = 1.0\\times10^5$ m/s. Pitch $= v_\\parallel T = \\dfrac{2\\pi m v\\cos60^\\circ}{qB} = \\dfrac{2\\pi(1.673\\times10^{-27})(10^5)}{(1.602\\times10^{-19})(0.10)} \\approx 0.0656$ m.',
      trap: 'Using $v\\sin60^\\circ$ (the perpendicular part) for the advance along the field.' },
    { id: 'mag-027', type: 'mcq', level: 3, exams: ['jam'], sub: 'magnetic dipole',
      q: 'A current loop of moment $\\vec m$ is free to turn in a uniform field $\\vec B$. Which is correct?',
      options: ['The torque is $\\vec m\\cdot\\vec B$ and the loop is stable with $\\vec m$ perpendicular to $\\vec B$.', 'The torque is $\\vec m\\times\\vec B$, the energy is $-\\vec m\\cdot\\vec B$, and the loop is stable with $\\vec m$ along $\\vec B$.', 'There is a net force but no torque.', 'The torque is $\\vec m\\times\\vec B$ and the loop is stable with $\\vec m$ opposite to $\\vec B$.'], answer: 1,
      sol: 'In a uniform field the net force on a closed loop is zero, but there is a torque $\\vec\\tau = \\vec m\\times\\vec B$. With $U = -\\vec m\\cdot\\vec B$, the energy is lowest (stable) when $\\vec m$ is along $\\vec B$; anti-parallel is an unstable balance.' },
    { id: 'mag-028', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'ampere',
      q: 'For which current distributions does Ampère\'s law alone give $\\vec B$?',
      options: ['An infinitely long straight wire', 'A short straight segment of wire', 'An ideal infinitely long solenoid', 'A single circular loop'], answer: [0, 2],
      sol: 'Ampère\'s law gives $\\vec B$ only when symmetry lets $B$ come out of the integral: cylindrical symmetry (infinite wire), and the solenoid (with a rectangular loop and $B = 0$ outside). A segment cannot carry a steady current by itself, and a loop has no such symmetry: use Biot-Savart.' },
    { id: 'mag-029', type: 'nat', level: 3, exams: ['jam'], sub: 'forces on currents', unit: '$\\mu$N',
      q: 'A square loop of side 10 cm, carrying 2.0 A, lies in the plane of a long straight wire carrying 10 A, with its nearest side parallel to the wire and 5.0 cm from it. The net force on the loop is ______ $\\mu$N (to two decimal places).',
      answer: 5.33, tol: 0.05, calc: () => MU * 10 * 2 * 0.1 / (2 * Math.PI) * (1 / 0.05 - 1 / 0.15) * 1e6,
      sol: 'The two sides perpendicular to the wire feel equal and opposite forces. The near and far sides carry opposite currents: $F = \\dfrac{\\mu_0I_1I_2a}{2\\pi}\\left(\\dfrac1d - \\dfrac1{d+a}\\right) = (2\\times10^{-7})(10)(2)(0.1)\\left(20 - 6.67\\right) \\approx 5.33\\times10^{-6}$ N. The near side wins, so the net force is attractive if its current is parallel to the wire\'s.',
      trap: 'Forgetting the far side, or using $d + a = 0.10$ m instead of 0.15 m.' },

    // ---------- level 4 ----------
    { id: 'mag-030', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'biot-savart: loops', unit: 'mT',
      q: 'A solenoid 20 cm long and 5.0 cm in radius has 2000 turns per metre and carries 1.0 A. The field at the centre of its axis is ______ mT (to two decimal places).',
      answer: 2.25, tol: 0.02, calc: () => MU * 2000 * (0.1 / Math.hypot(0.1, 0.05)) * 1000,
      sol: 'Adding loop fields along the axis gives $B = \\dfrac{\\mu_0nI}{2}(\\cos\\theta_1 + \\cos\\theta_2)$, where the $\\theta$s are the half-angles to the ends. At the centre, $\\cos\\theta = \\dfrac{L/2}{\\sqrt{(L/2)^2 + R^2}} = \\dfrac{0.1}{0.1118} = 0.894$. $B = \\mu_0nI\\times0.894 = 2.51\\times0.894 \\approx 2.25$ mT.',
      trap: 'Quoting the ideal value 2.51 mT; this solenoid is only 2 diameters long.' },
    { id: 'mag-031', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'rotating charges',
      q: 'A thin disc of radius $R$ with uniform surface charge $\\sigma$ spins at angular speed $\\omega$ about its axis. The field at its centre is',
      options: ['$\\mu_0\\sigma\\omega R$', '$\\dfrac{\\mu_0\\sigma\\omega R^2}{2}$', '$\\dfrac{\\mu_0\\sigma\\omega R}{2}$', '$\\dfrac{\\mu_0\\sigma\\omega R}{4}$'], answer: 2,
      sol: 'A ring of radius $s$ and width $ds$ carries $dI = \\sigma(2\\pi s\\,ds)\\dfrac{\\omega}{2\\pi} = \\sigma\\omega s\\,ds$. Its field at the centre: $dB = \\dfrac{\\mu_0\\,dI}{2s} = \\dfrac{\\mu_0\\sigma\\omega}{2}ds$. Integrate from 0 to $R$: $B = \\mu_0\\sigma\\omega R/2$.',
      trap: 'B fails a dimension check: it has an extra length.' },
    { id: 'mag-032', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'rotating charges', unit: '$10^{-7}$ A m$^2$',
      q: 'A thin spherical shell of radius 10 cm carries $1.0\\,\\mu$C spread uniformly and spins at 100 rad/s. Its magnetic dipole moment is ______ $\\times10^{-7}$ A m$^2$ (to two decimal places).',
      answer: 3.33, tol: 0.03, calc: () => 1e-6 * 100 * 0.01 / 3 * 1e7,
      sol: 'A band at polar angle $\\theta$ has charge $\\sigma(2\\pi R\\sin\\theta)(R\\,d\\theta)$, current (charge)$\\times\\omega/2\\pi$, and area $\\pi R^2\\sin^2\\theta$. So $m = \\int_0^\\pi\\sigma\\omega R^4\\pi\\sin^3\\theta\\,d\\theta = \\dfrac43\\pi\\sigma\\omega R^4 = \\dfrac{Q\\omega R^2}{3} = \\dfrac{(10^{-6})(100)(0.01)}{3} = 3.33\\times10^{-7}$ A m$^2$.' },
    { id: 'mag-033', type: 'msq', level: 4, exams: ['gate', 'net', 'jam'], sub: 'vector potential',
      q: 'Which of these vector potentials give the uniform field $\\vec B = B_0\\hat z$?',
      options: ['$\\vec A = \\tfrac12B_0(-y,\\ x,\\ 0)$', '$\\vec A = B_0(0,\\ x,\\ 0)$', '$\\vec A = B_0(-y,\\ 0,\\ 0)$', '$\\vec A = B_0(x,\\ y,\\ 0)$'], answer: [0, 1, 2],
      sol: '$B_z = \\partial_xA_y - \\partial_yA_x$. A: $\\tfrac12B_0 + \\tfrac12B_0 = B_0$. B: $B_0 - 0 = B_0$. C: $0 - (-B_0) = B_0$. D: $0 - 0 = 0$ (it is a gradient). A, B and C differ by gradients: this is gauge freedom.',
      trap: 'Thinking only the symmetric form A is allowed.' },
    { id: 'mag-034', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'ampere: differential form', unit: '$10^4$ A/m$^2$',
      q: 'In a region the static field is $\\vec B = B_0\\dfrac{x}{a}\\,\\hat y$ with $B_0 = 0.010$ T and $a = 0.10$ m. The current density there is ______ $\\times10^4$ A/m$^2$ (to two decimal places).',
      answer: 7.96, tol: 0.08, calc: () => 0.01 / 0.1 / MU / 1e4,
      sol: '$\\nabla\\times\\vec B = \\mu_0\\vec J$. The only non-zero derivative is $\\partial_xB_y = B_0/a$, which is the $z$-component of the curl. So $J_z = \\dfrac{B_0}{\\mu_0a} = \\dfrac{0.010}{(4\\pi\\times10^{-7})(0.10)} \\approx 7.96\\times10^4$ A/m$^2$. (Also $\\nabla\\cdot\\vec B = \\partial_yB_y = 0$, as it must be.)' },
    { id: 'mag-035', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'charged particle motion',
      q: 'A charged particle starts from rest in uniform crossed fields $\\vec E\\perp\\vec B$. Which are correct?',
      options: ['On average it drifts with velocity $\\vec E\\times\\vec B/B^2$.', 'The drift direction is the same for positive and negative charges.', 'Its path is a cycloid.', 'Its kinetic energy grows steadily without limit.'], answer: [0, 1, 2],
      sol: 'In the frame moving at $\\vec v_d = \\vec E\\times\\vec B/B^2$ the electric field vanishes and the particle just circles; in the lab this is a rolling-wheel path, a cycloid, starting from rest. $\\vec v_d$ contains no $q$ or $m$, so both signs drift the same way. D is false: the speed rises and falls back to zero each cycle (at the cusps).' },
    { id: 'mag-036', type: 'mcq', level: 4, exams: ['jam'], sub: 'biot-savart: wires',
      q: 'Two long parallel wires at $(\\pm a, 0)$ carry equal currents $I$ in opposite directions. The field magnitude at the point $(0, d)$ is',
      options: ['$\\dfrac{\\mu_0Ia}{\\pi(a^2 + d^2)}$', '$\\dfrac{\\mu_0Id}{\\pi(a^2 + d^2)}$', 'zero', '$\\dfrac{\\mu_0I}{\\pi\\sqrt{a^2+d^2}}$'], answer: 0,
      sol: 'Each wire gives $\\dfrac{\\mu_0I}{2\\pi\\rho}$ with $\\rho = \\sqrt{a^2 + d^2}$, perpendicular to the line from that wire. With opposite currents the components along $x$ cancel and those along $y$ add, each being a fraction $a/\\rho$ of the whole: $B = 2\\cdot\\dfrac{\\mu_0I}{2\\pi\\rho}\\cdot\\dfrac a\\rho = \\dfrac{\\mu_0Ia}{\\pi(a^2+d^2)}$. Check: at $d = 0$ it gives $\\mu_0I/(\\pi a)$, twice one wire.',
      trap: 'Picking the component fraction $d/\\rho$ instead of $a/\\rho$.' },
    { id: 'mag-037', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'rotating charges', unit: 'pT',
      q: 'A disc of radius 10 cm with surface charge $1.0\\,\\mu$C/m$^2$ spins at 1000 rad/s. The field at its centre is ______ pT (to one decimal place).',
      answer: 62.8, tol: 0.7, calc: () => MU * 1e-6 * 1000 * 0.1 / 2 * 1e12,
      sol: '$B = \\dfrac{\\mu_0\\sigma\\omega R}{2} = \\dfrac{(4\\pi\\times10^{-7})(10^{-6})(1000)(0.10)}{2} = 6.28\\times10^{-11}$ T $= 62.8$ pT: tiny, which is why spinning charged objects are poor magnets.' },

    // ---------- level 5 ----------
    { id: 'mag-038', type: 'nat', level: 5, exams: ['gate', 'net', 'jam'], sub: 'rotating charges',
      q: 'A uniformly charged solid sphere and a uniformly charged thin spherical shell have the same radius and total charge, and spin at the same rate. The ratio of their magnetic moments, solid to shell, is ______ (to two decimal places).',
      answer: 0.6, tol: 0.005, calc: () => (1 / 5) / (1 / 3),
      sol: 'Shell: $m = Q\\omega R^2/3$. Solid sphere: build it from shells of radius $r$, charge $dQ = Q\\dfrac{3r^2dr}{R^3}$, each giving $dQ\\,\\omega r^2/3$: $m = \\dfrac{Q\\omega}{R^3}\\int_0^Rr^4dr = \\dfrac{Q\\omega R^2}{5}$. Ratio $= (1/5)/(1/3) = 0.6$, because more of the solid sphere\'s charge circles at small radius.' },
    { id: 'mag-039', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'magnetic dipole',
      q: 'Consider the ratio of magnetic moment to angular momentum, $\\gamma = m/L$, for rotating bodies. Which are correct?',
      options: ['For any rigid body whose charge is distributed exactly like its mass, spinning about a symmetry axis, $\\gamma = Q/(2M)$.', 'For a ring of charge $Q$ and mass $M$, $\\gamma = Q/(2M)$.', 'For the electron\'s spin, $\\gamma \\approx e/m_e$, about twice the classical value.', 'For a spinning body, $\\gamma$ grows with the angular velocity.'], answer: [0, 1, 2],
      sol: 'Each small piece $dq$ circling at radius $s$ gives $dm = \\tfrac12dq\\,\\omega s^2$ and $dL = dM\\,\\omega s^2$. If $dq/dM = Q/M$ everywhere, every piece has $dm/dL = Q/(2M)$, so the whole body does (A, and B as a special case). C: the spin $g$-factor is about 2, so $\\gamma \\approx 2\\times e/(2m_e)$. D is false: $m$ and $L$ are both proportional to $\\omega$.' },
    { id: 'mag-040', type: 'mcq', level: 5, exams: ['gate', 'net', 'jam'], sub: 'superposition tricks',
      q: 'A long cylindrical conductor carries a uniform current density $\\vec J$ along its axis. A cylindrical hole runs parallel to the axis, with its own axis displaced by $\\vec d$ from the conductor\'s axis. The field inside the hole is',
      options: ['zero', '$\\dfrac{\\mu_0}{2}\\vec J\\times\\vec d$, uniform', '$\\dfrac{\\mu_0}{2}\\vec J\\times\\vec s$, growing with distance $s$ from the conductor\'s axis', '$\\mu_0\\vec J\\times\\vec d$, uniform'], answer: 1,
      sol: 'Superpose a full cylinder with $+\\vec J$ and a hole-sized cylinder with $-\\vec J$. Inside a solid cylinder, Ampère gives $\\vec B = \\dfrac{\\mu_0}{2}\\vec J\\times\\vec s$. In the hole: $\\dfrac{\\mu_0}{2}\\vec J\\times\\vec s - \\dfrac{\\mu_0}{2}\\vec J\\times(\\vec s - \\vec d) = \\dfrac{\\mu_0}{2}\\vec J\\times\\vec d$, uniform. The magnetic twin of the off-centre cavity in a charged sphere.' },
    { id: 'mag-041', type: 'nat', level: 5, exams: ['gate', 'net', 'jam'], sub: 'superposition tricks', unit: 'mT',
      q: 'For the conductor with an off-axis hole (previous idea), $J = 1.0\\times10^6$ A/m$^2$ and the axes are 2.0 mm apart. The field in the hole is ______ mT (to two decimal places).',
      answer: 1.26, tol: 0.013, calc: () => MU * 1e6 * 0.002 / 2 * 1000,
      sol: '$B = \\dfrac{\\mu_0Jd}{2} = \\dfrac{(4\\pi\\times10^{-7})(10^6)(0.002)}{2} \\approx 1.26\\times10^{-3}$ T, the same everywhere in the hole, perpendicular to both $\\vec J$ and $\\vec d$.' },
  ],
  gens: [
    { id: 'mag-g01', type: 'nat', level: 1, exams: ['jam'], sub: 'biot-savart: wires', unit: '$\\mu$T',
      make(r) {
        const I = int(r, 1, 30), s = int(r, 1, 25);
        const B = MU * I / (2 * Math.PI * s / 100) * 1e6;
        return { q: `A long straight wire carries ${I} A. The magnetic field ${s} cm from it is ______ $\\mu$T (to two decimal places).`,
          answer: round(B, 2), tol: Math.max(B * 0.01, 0.01), I, s,
          sol: `$B = \\dfrac{\\mu_0I}{2\\pi s} = \\dfrac{(2\\times10^{-7})(${I})}{${s / 100}} \\approx ${round(B, 2)}\\,\\mu$T.`,
          trap: 'Use $\\mu_0/2\\pi = 2\\times10^{-7}$ T m/A and the distance in metres.' };
      },
      verify: (p) => MU * p.I / (2 * Math.PI * p.s / 100) * 1e6 },
    { id: 'mag-g02', type: 'nat', level: 2, exams: ['jam'], sub: 'biot-savart: loops', unit: '$\\mu$T',
      make(r) {
        const frac = choose(r, [1, 0.5, 0.25]), N = frac === 1 ? choose(r, [1, 10, 20, 50, 100]) : 1, I = int(r, 1, 10), R = int(r, 2, 20);
        const B = frac * MU * N * I / (2 * R / 100) * 1e6;
        const what = frac === 1 ? (N === 1 ? 'a circular loop' : `a flat circular coil of ${N} turns`) : frac === 0.5 ? 'a semicircular arc' : 'a quarter-circle arc';
        return { q: `Find the magnetic field at the centre of ${what} of radius ${R} cm carrying ${I} A${frac < 1 ? ' (ignore the straight leads, which point at the centre)' : ''}, in $\\mu$T, to two decimal places.`,
          answer: round(B, 2), tol: Math.max(B * 0.01, 0.01), N, I, R, frac,
          sol: `A full loop gives $\\mu_0I/(2R)$ at its centre${frac === 1 && N > 1 ? `, and ${N} turns give ${N} times that` : ''}${frac < 1 ? `; an arc gives the same fraction (${frac}) of it` : ''}. $B = ${frac === 1 ? '' : frac + '\\times'}\\dfrac{${N > 1 ? N + '\\,' : ''}\\mu_0I}{2R} = ${frac === 1 ? '' : frac + '\\times'}\\dfrac{${N > 1 ? N + '\\times' : ''}(4\\pi\\times10^{-7})(${I})}{2(${R / 100})} = ${round(B, 2)}\\,\\mu$T. ${frac < 1 ? 'Straight leads aimed at the centre add nothing ($d\\vec l\\parallel\\hat r$).' : ''}`,
          trap: 'Straight wires that point at the centre give zero field there; arcs give their fraction of $\\mu_0I/2R$.' };
      },
      verify: (p) => p.frac * MU * p.N * p.I / (2 * p.R / 100) * 1e6 },
    { id: 'mag-g03', type: 'nat', level: 1, exams: ['jam'], sub: 'ampere: solenoids', unit: 'mT',
      make(r) {
        const N = int(r, 2, 20) * 100, L = int(r, 2, 10) * 10, I = int(r, 1, 5);
        const B = MU * (N / (L / 100)) * I * 1000;
        return { q: `A long solenoid ${L} cm long has ${N} turns and carries ${I} A. The field well inside it is ______ mT (to two decimal places).`,
          answer: round(B, 2), tol: Math.max(B * 0.01, 0.01), N, L, I,
          sol: `Turns per metre $n = ${N}/${L / 100} = ${round(N / (L / 100), 1)}$ m$^{-1}$. $B = \\mu_0nI = (4\\pi\\times10^{-7})(${round(N / (L / 100), 1)})(${I}) \\approx ${round(B, 2)}$ mT.`,
          trap: 'Use turns per metre, not the total number of turns.' };
      },
      verify: (p) => MU * (p.N / (p.L / 100)) * p.I * 1000 },
    { id: 'mag-g04', type: 'nat', level: 2, exams: ['jam'], sub: 'charged particle motion', unit: 'cm',
      make(r) {
        const [name, m, z] = choose(r, [['A proton', C.mp, 1], ['An alpha particle', ALPHA_M, 2], ['A deuteron', DEUT_M, 1], ['An electron', C.me, 1]]);
        const v = int(r, 1, 9), B = int(r, 1, 10) / 10;
        const vv = name === 'An electron' ? v * 1e6 : v * 1e5;
        const rad = m * vv / (z * C.e * B) * 100;
        return { q: `${name} moves at $${v}\\times10^{${name === 'An electron' ? 6 : 5}}$ m/s perpendicular to a uniform ${B} T field. The radius of its path is ______ cm (to three significant figures).`,
          answer: +rad.toPrecision(3), tol: rad * 0.01, m, z, vv, B,
          sol: `$r = \\dfrac{mv}{|q|B} = \\dfrac{(${fmt(m, 4)})(${fmt(vv, 2)})}{(${z === 2 ? '2\\times' : ''}1.602\\times10^{-19})(${B})} \\approx ${fmt(rad, 3)}$ cm.`,
          trap: z === 2 ? 'The alpha particle has charge $2e$.' : 'Convert the radius to centimetres at the end.' };
      },
      verify: (p) => p.m * p.vv / (p.z * C.e * p.B) * 100 },
    { id: 'mag-g05', type: 'nat', level: 2, exams: ['jam'], sub: 'forces on currents', unit: '$\\mu$N/m',
      make(r) {
        const I1 = int(r, 1, 20), I2 = int(r, 1, 20), d = int(r, 1, 20);
        const F = MU * I1 * I2 / (2 * Math.PI * d / 100) * 1e6;
        const same = r() < 0.5;
        return { q: `Two long parallel wires ${d} cm apart carry ${I1} A and ${I2} A in ${same ? 'the same direction' : 'opposite directions'}. The magnitude of the force per metre on either wire is ______ $\\mu$N/m (to one decimal place).`,
          answer: round(F, 1), tol: Math.max(F * 0.01, 0.1), I1, I2, d,
          sol: `$\\dfrac FL = \\dfrac{\\mu_0I_1I_2}{2\\pi d} = \\dfrac{(2\\times10^{-7})(${I1})(${I2})}{${d / 100}} \\approx ${round(F, 1)}\\,\\mu$N/m, ${same ? 'attractive (parallel currents attract)' : 'repulsive (antiparallel currents repel)'}.`,
          trap: 'The direction affects only attraction or repulsion, not the size.' };
      },
      verify: (p) => MU * p.I1 * p.I2 / (2 * Math.PI * p.d / 100) * 1e6 },
    { id: 'mag-g06', type: 'mcq', level: 1, exams: ['jam'], sub: 'lorentz force',
      make(r) {
        const ax = ['x', 'y', 'z'];
        const i = int(r, 0, 2), j = (i + 1 + int(r, 0, 1)) % 3;
        const sv = r() < 0.5 ? 1 : -1, sb = r() < 0.5 ? 1 : -1, [pname, sq] = choose(r, [['proton', 1], ['electron', -1]]);
        const k = 3 - i - j, cyc = (j - i + 3) % 3 === 1 ? 1 : -1; // e_i x e_j = cyc e_k
        const sign = sv * sb * sq * cyc;
        const lab = (s, a) => `$${s > 0 ? '+' : '-'}${a}$`;
        const correct = lab(sign, ax[k]);
        const o = mcqOptions(r, correct, [lab(-sign, ax[k]), lab(sv, ax[i]), lab(sb, ax[j]), lab(-sv, ax[i])]);
        return { q: `${pname === 'electron' ? 'An electron' : 'A proton'} moves in the ${lab(sv, ax[i])} direction through a magnetic field pointing in the ${lab(sb, ax[j])} direction. The magnetic force on it points along`, ...o,
          sol: `$\\vec F = q\\vec v\\times\\vec B$. $\\hat ${ax[i]}\\times\\hat ${ax[j]} = ${cyc > 0 ? '+' : '-'}\\hat ${ax[k]}$. With the signs of $\\vec v$ (${sv > 0 ? '+' : '−'}), $\\vec B$ (${sb > 0 ? '+' : '−'}) and the charge (${sq > 0 ? '+' : '−'}), the force is along ${correct}.`,
          trap: 'For an electron, reverse the direction given by the right-hand rule.' };
      } },
    { id: 'mag-g07', type: 'nat', level: 3, exams: ['jam'], sub: 'ampere: wires', unit: '$\\mu$T',
      make(r) {
        const I = int(r, 5, 50), R = int(r, 2, 10), s = choose(r, [Math.round(R / 2), R - 1, R + 2, 2 * R, 3 * R]) || 1; // mm
        const B = (s < R ? MU * I * (s / 1000) / (2 * Math.PI * (R / 1000) ** 2) : MU * I / (2 * Math.PI * s / 1000)) * 1e6;
        return { q: `A long straight conductor of radius ${R} mm carries ${I} A spread uniformly over its cross-section. The field ${s} mm from its axis is ______ $\\mu$T (to one decimal place).`,
          answer: round(B, 1), tol: Math.max(B * 0.01, 0.1), I, R, s,
          sol: s < R
            ? `Inside, the Amperian circle encloses $I(s/R)^2$: $B = \\dfrac{\\mu_0Is}{2\\pi R^2} = \\dfrac{(2\\times10^{-7})(${I})(${s / 1000})}{(${R / 1000})^2} \\approx ${round(B, 1)}\\,\\mu$T.`
            : `Outside, all the current is enclosed: $B = \\dfrac{\\mu_0I}{2\\pi s} = \\dfrac{(2\\times10^{-7})(${I})}{${s / 1000}} \\approx ${round(B, 1)}\\,\\mu$T.`,
          trap: 'Inside a uniform wire $B$ grows as $s$; outside it falls as $1/s$.' };
      },
      verify: (p) => (p.s < p.R ? MU * p.I * (p.s / 1000) / (2 * Math.PI * (p.R / 1000) ** 2) : MU * p.I / (2 * Math.PI * p.s / 1000)) * 1e6 },
    { id: 'mag-g08', type: 'nat', level: 3, exams: ['jam'], sub: 'biot-savart: loops', unit: '$\\mu$T',
      make(r) {
        const [R, z, h] = choose(r, [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [9, 12, 15]]), I = int(r, 1, 10), N = choose(r, [1, 10, 50]);
        const B = MU * N * I * (R / 100) ** 2 / (2 * (h / 100) ** 3) * 1e6;
        return { q: `A flat circular coil of ${N} turn${N > 1 ? 's' : ''}, radius ${R} cm, carries ${I} A. The field on its axis ${z} cm from its centre is ______ $\\mu$T (to two decimal places).`,
          answer: round(B, 2), tol: Math.max(B * 0.01, 0.01), N, I, R, h,
          sol: `$B = \\dfrac{\\mu_0NIR^2}{2(R^2 + z^2)^{3/2}}$ with $\\sqrt{R^2+z^2} = ${h}$ cm: $B = \\dfrac{(4\\pi\\times10^{-7})(${N})(${I})(${R / 100})^2}{2(${h / 100})^3} \\approx ${round(B, 2)}\\,\\mu$T.`,
          trap: 'The exponent is 3/2 on $(R^2+z^2)$, and $R^2$ (not $R$) is on top.' };
      },
      verify: (p) => MU * p.N * p.I * (p.R / 100) ** 2 / (2 * (p.h / 100) ** 3) * 1e6 },
  ],
};
