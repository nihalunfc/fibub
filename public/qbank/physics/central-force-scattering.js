// Central forces and scattering (GATE / CSIR NET level): the orbit (Binet) equation and inverse problems, the
// Laplace-Runge-Lenz vector and precession, stability of circular orbits, impact parameter and differential cross-
// section, hard-sphere, Rutherford and 1/r^2 scattering, capture, and lab/centre-of-mass conversion.
// Kepler's laws, vis-viva and basic orbits are in the JAM topic central-forces. Original questions for fibub.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
import more from './central-force-scattering.more.gen.js';
import more2 from './central-force-scattering.more2.gen.js';
import r4 from './central-force-scattering.r4.gen.js';
import r5 from './central-force-scattering.r5.gen.js';

const KE = 1.44; // e^2/(4 pi eps0) in MeV fm
const DEG = Math.PI / 180;

export default {
  topic: 'central-force-scattering',
  items: [
    // ---------- level 1 ----------
    { id: 'cfs-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'cross-sections',
      q: 'In classical mechanics, point particles scatter elastically off a fixed hard sphere of radius $a$. The total scattering cross-section is',
      options: ['$\\pi a^2$', '$4\\pi a^2$', '$\\pi a^2/4$', '$2\\pi a^2$'], answer: 0,
      sol: 'A particle is deflected only if its impact parameter is less than $a$. So the total cross-section is the geometric area the sphere blocks, $\\pi a^2$.',
      trap: '$4\\pi a^2$ is the sphere\'s surface area, and also the low-energy quantum answer; classically it is $\\pi a^2$.' },
    { id: 'cfs-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'orbit equation',
      q: 'For a particle of reduced mass $\\mu$ and angular momentum $\\ell$ moving under a central force $F(r)$ (positive outward), the orbit equation in terms of $u = 1/r$ is',
      options: ['$\\dfrac{d^2u}{d\\theta^2} - u = -\\dfrac{\\mu}{\\ell^2u^2}F(1/u)$', '$\\dfrac{d^2u}{d\\theta^2} + u = -\\dfrac{\\mu}{\\ell^2u^2}F(1/u)$', '$\\dfrac{d^2u}{d\\theta^2} + u = \\dfrac{\\mu}{\\ell^2}F(1/u)$', '$\\dfrac{d^2u}{d\\theta^2} + u = -\\dfrac{\\ell^2}{\\mu u^2}F(1/u)$'], answer: 1,
      sol: 'Use $\\dot\\theta = \\ell u^2/\\mu$ to turn time derivatives into $\\theta$ derivatives: $\\dot r = -(\\ell/\\mu)\\,du/d\\theta$ and $\\ddot r = -(\\ell^2u^2/\\mu^2)\\,d^2u/d\\theta^2$. The radial equation $\\mu(\\ddot r - r\\dot\\theta^2) = F$ becomes $u\'\' + u = -\\mu F/(\\ell^2u^2)$ (Binet\'s equation). For gravity $F = -ku^2$ the right side is the constant $\\mu k/\\ell^2$, giving conic sections.' },
    { id: 'cfs-003', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'cross-sections',
      q: 'Classical point particles scatter off a hard sphere of radius 2 fm. The total cross-section is ______ fm².',
      answer: 12.566, tol: 0.05, unit: 'fm²', calc: () => Math.PI * 4,
      sol: '$\\sigma = \\pi a^2 = \\pi\\times4 = 12.57$ fm² (0.126 barn, since 1 b = 100 fm²).' },
    { id: 'cfs-004', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'Rutherford scattering',
      q: 'In Rutherford scattering, the differential cross-section depends on the scattering angle $\\Theta$ as',
      options: ['$1/\\sin^2(\\Theta/2)$', '$1/\\sin^4\\Theta$', '$1/\\sin^4(\\Theta/2)$', '$\\cos^2(\\Theta/2)$'], answer: 2,
      sol: '$\\dfrac{d\\sigma}{d\\Omega} = \\left(\\dfrac{k}{4E}\\right)^2\\dfrac{1}{\\sin^4(\\Theta/2)}$, with $k = zZe^2/4\\pi\\varepsilon_0$. It is huge at small angles and smallest (but not zero) for backscattering.' },
    { id: 'cfs-005', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'lab and CM frames',
      q: 'A particle scatters elastically off an identical particle initially at rest. The largest possible scattering angle of the projectile in the lab frame is',
      options: ['$180^\\circ$', '$45^\\circ$', '$60^\\circ$', '$90^\\circ$'], answer: 3,
      sol: 'For equal masses the lab angle is half the centre-of-mass angle, $\\theta_L = \\Theta/2$. As $\\Theta$ runs from 0 to $180^\\circ$, $\\theta_L$ runs from 0 to $90^\\circ$ (at $90^\\circ$ the projectile is left at rest, a head-on hit).' },
    { id: 'cfs-006', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'virial theorem',
      q: 'A particle moves on a bound orbit in the potential $U = kr^4$ ($k > 0$). By the virial theorem, the ratio of the time-averaged kinetic energy to the time-averaged potential energy, $\\langle T\\rangle/\\langle U\\rangle$, is ______.',
      answer: 2, tol: 0, calc: () => 4 / 2,
      sol: 'For $U \\propto r^n$ the virial theorem gives $2\\langle T\\rangle = n\\langle U\\rangle$. With $n = 4$: $\\langle T\\rangle/\\langle U\\rangle = 2$. (Gravity, $n = -1$, gives the familiar $\\langle T\\rangle = -\\tfrac12\\langle U\\rangle$.)' },

    // ---------- level 2 ----------
    { id: 'cfs-007', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'cross-sections',
      q: 'If the impact parameter $b$ and scattering angle $\\Theta$ are related by a single-valued function $b(\\Theta)$, the differential cross-section is',
      options: ['$\\dfrac{b}{\\sin\\Theta}\\left|\\dfrac{db}{d\\Theta}\\right|$', '$b\\left|\\dfrac{db}{d\\Theta}\\right|$', '$\\dfrac{\\sin\\Theta}{b}\\left|\\dfrac{db}{d\\Theta}\\right|$', '$2\\pi b\\left|\\dfrac{d\\Theta}{db}\\right|$'], answer: 0,
      sol: 'Particles through the ring of area $2\\pi b\\,db$ go into the solid angle $2\\pi\\sin\\Theta\\,d\\Theta$. So $\\dfrac{d\\sigma}{d\\Omega} = \\dfrac{2\\pi b\\,|db|}{2\\pi\\sin\\Theta\\,|d\\Theta|} = \\dfrac{b}{\\sin\\Theta}\\left|\\dfrac{db}{d\\Theta}\\right|$.',
      trap: 'Leaving out $\\sin\\Theta$ gives the cross-section per unit angle, not per unit solid angle.' },
    { id: 'cfs-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Rutherford scattering',
      q: 'A 5 MeV alpha particle ($z = 2$) scatters off a gold nucleus ($Z = 79$), treated as fixed. Taking $e^2/4\\pi\\varepsilon_0 = 1.44$ MeV fm, the impact parameter that gives a $90^\\circ$ deflection is ______ fm.',
      answer: 22.75, tol: 0.2, unit: 'fm', calc: () => 2 * 79 * 1.44 / (2 * 5) / Math.tan(45 * Math.PI / 180),
      sol: 'Rutherford: $b = \\dfrac{k}{2E}\\cot\\dfrac{\\Theta}{2}$ with $k = zZ\\times1.44 = 227.5$ MeV fm. At $90^\\circ$, $\\cot45^\\circ = 1$, so $b = 227.5/10 = 22.75$ fm.' },
    { id: 'cfs-009', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'cross-sections',
      q: 'For classical elastic scattering of point particles off a fixed hard sphere of radius $a$, which statements are correct?',
      options: ['$d\\sigma/d\\Omega = a^2/4$, the same in every direction', 'The impact parameter and angle are related by $b = a\\cos(\\Theta/2)$', 'The total cross-section is $\\pi a^2$', 'The total cross-section is $4\\pi a^2$'], answer: [0, 1, 2],
      sol: 'Reflection at the surface: the angle of incidence $\\alpha$ satisfies $b = a\\sin\\alpha$ and $\\Theta = \\pi - 2\\alpha$, so $b = a\\cos(\\Theta/2)$. Then $\\dfrac{d\\sigma}{d\\Omega} = \\dfrac{b}{\\sin\\Theta}\\cdot\\dfrac a2\\sin\\dfrac\\Theta2 = \\dfrac{a^2}{4}$. Integrating over $4\\pi$ gives $\\pi a^2$.',
      trap: 'Isotropic scattering does not mean the total is $4\\pi a^2$: the constant is $a^2/4$, not $a^2$.' },
    { id: 'cfs-010', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Rutherford scattering',
      q: 'A particle of energy $E$ moves head-on towards a fixed repulsive centre with $U = k/r$. Its distance of closest approach is',
      options: ['$k/2E$', '$k/E$', '$2k/E$', '$\\sqrt{k/E}$'], answer: 1,
      sol: 'Head-on means zero angular momentum, so all the kinetic energy turns into potential energy at the turning point: $k/r_{\\min} = E$, $r_{\\min} = k/E$.',
      trap: '$k/2E$ is the length scale in the Rutherford formula ($b = (k/2E)\\cot(\\Theta/2)$), not the closest approach.' },
    { id: 'cfs-011', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Rutherford scattering',
      q: 'In Rutherford scattering with $k/2E = 20$ fm, the distance of closest approach for a particle deflected through $90^\\circ$ is ______ fm.',
      answer: 48.28, tol: 0.3, unit: 'fm', calc: () => 20 * (1 + 1 / Math.sin(45 * Math.PI / 180)),
      sol: 'On the hyperbola, $r_{\\min} = \\dfrac{k}{2E}\\left(1 + \\dfrac{1}{\\sin(\\Theta/2)}\\right)$ (since $e = 1/\\sin(\\Theta/2)$ and $r_{\\min} = a(e + 1)$ with $a = k/2E$). At $90^\\circ$: $20(1 + \\sqrt2) = 48.28$ fm. Head-on ($\\Theta = 180^\\circ$) gives $40$ fm $= k/E$, as it should.' },
    { id: 'cfs-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'orbit equation',
      q: 'A particle moves under a central force on the logarithmic spiral $r = r_0e^{\\theta}$. The force law is',
      options: ['$F \\propto -1/r^2$', '$F \\propto -1/r^5$', '$F \\propto -1/r^3$', '$F \\propto r$'], answer: 2,
      sol: '$u = e^{-\\theta}/r_0$, so $u\'\' = u$ and $u\'\' + u = 2u$. Binet: $2u = -\\mu F/(\\ell^2u^2)$, so $F = -2\\ell^2u^3/\\mu \\propto -1/r^3$ (attractive).' },
    { id: 'cfs-013', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'lab and CM frames',
      q: 'A projectile of mass $m_1$ scatters elastically off a target of mass $m_2$ at rest. Which statements are correct?',
      options: ['If $m_1 > m_2$, the lab scattering angle cannot exceed $\\sin^{-1}(m_2/m_1)$', 'If $m_1 < m_2$, every lab angle up to $180^\\circ$ is possible', 'If $m_1 = m_2$, the lab angle is half the centre-of-mass angle', 'The differential cross-section is the same in the lab and centre-of-mass frames'], answer: [0, 1, 2],
      sol: 'From $\\tan\\theta_L = \\dfrac{\\sin\\Theta}{\\cos\\Theta + m_1/m_2}$: for $m_1 > m_2$ the maximum is at $\\sin\\theta_L = m_2/m_1$; for $m_1 < m_2$ the denominator can go negative, giving backscattering; for $m_1 = m_2$, $\\tan\\theta_L = \\tan(\\Theta/2)$. The number of particles is the same in both frames, but the solid angles differ, so $d\\sigma/d\\Omega$ changes (the total cross-section does not).' },
    { id: 'cfs-014', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'cross-sections',
      q: 'A beam of $10^8$ particles per second strikes a thin target with $10^{22}$ nuclei per cm². A detector subtends 0.01 sr at an angle where $d\\sigma/d\\Omega = 1$ mb/sr. The expected count rate is ______ per second (1 b $= 10^{-24}$ cm²).',
      answer: 10, tol: 0.1, unit: '/s', calc: () => 1e8 * 1e22 * 1e-27 * 0.01,
      sol: 'Rate $= I\\,n\\,\\dfrac{d\\sigma}{d\\Omega}\\,\\Delta\\Omega = 10^8\\times10^{22}\\times10^{-27}\\times0.01 = 10$ per second.',
      trap: '1 mb $= 10^{-27}$ cm², not $10^{-24}$.' },
    { id: 'cfs-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'capture',
      q: 'Small bodies approach a planet of mass $M$ and radius $R$ with speed $v$ far away. Including gravitational focusing, the cross-section for hitting the planet is',
      options: ['$\\pi R^2$', '$\\pi R^2\\left(1 - \\dfrac{2GM}{Rv^2}\\right)$', '$\\pi R^2\\left(1 + \\dfrac{GM}{Rv^2}\\right)$', '$\\pi R^2\\left(1 + \\dfrac{2GM}{Rv^2}\\right)$'], answer: 3,
      sol: 'A grazing orbit touches the surface at speed $v_R$. Angular momentum: $bv = Rv_R$. Energy: $v_R^2 = v^2 + 2GM/R$. So $b_{\\max}^2 = R^2(1 + 2GM/Rv^2)$ and $\\sigma = \\pi b_{\\max}^2$. Gravity widens the target, a lot for slow bodies.' },
    { id: 'cfs-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Rutherford scattering',
      q: 'The total classical cross-section for Rutherford scattering is infinite because',
      options: ['the Coulomb force has infinite range, so every impact parameter, however large, gives some deflection', 'the nucleus is treated as a point', 'backscattering is very likely', 'the formula ignores the recoil of the nucleus'], answer: 0,
      sol: 'Integrating $(k/4E)^2/\\sin^4(\\Theta/2)$ over solid angle diverges at $\\Theta \\to 0$, i.e. at large $b$. Any force that never quite vanishes deflects every particle a little. In real atoms the electrons screen the nucleus, cutting the range off.' },
    { id: 'cfs-041', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Rutherford scattering',
      q: 'A particle follows a hyperbolic orbit of eccentricity $e$ around a repulsive $k/r$ centre. Its total deflection $\\Theta$ satisfies',
      options: ['$\\sin(\\Theta/2) = 1/e$', '$\\cos(\\Theta/2) = 1/e$', '$\\tan(\\Theta/2) = e$', '$\\Theta = \\pi/e$'], answer: 0,
      sol: 'The asymptotes of the hyperbola make angle $\\cos^{-1}(1/e)$ with its axis, so the deflection is $\\Theta = \\pi - 2\\cos^{-1}(1/e)$, i.e. $\\sin(\\Theta/2) = 1/e$. With $e^2 = 1 + (2Eb/k)^2$ this reproduces $\\cot(\\Theta/2) = 2Eb/k$.',
      trap: 'Large $e$ (fast or distant passes) means small deflection.' },

    // ---------- level 3 ----------
    { id: 'cfs-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'cross-sections',
      q: 'Particles of energy $E$ scatter off the repulsive potential $U = k/r^2$. The deflection is $\\Theta = \\pi\\left(1 - \\dfrac{b}{\\sqrt{b^2 + k/E}}\\right)$. For impact parameter $b = \\sqrt{k/3E}$, the deflection is ______ degrees.',
      answer: 90, tol: 0.1, unit: '°', calc: () => 180 * (1 - 1 / Math.sqrt(1 + 3)),
      sol: 'With $b^2 = k/3E$: $b^2 + k/E = 4b^2$, so $b/\\sqrt{b^2 + k/E} = 1/2$ and $\\Theta = \\pi/2 = 90^\\circ$.<br>Where the formula comes from: $U = k/r^2$ just adds to the centrifugal term, as if $b^2$ were replaced by $B^2 = b^2 + k/E$. The orbit is then a straight line in an angle variable scaled by $b/B$, sweeping a total angle $\\pi b/B$ instead of $\\pi$.' },
    { id: 'cfs-018', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'orbit equation',
      q: 'A particle of mass $\\mu$ and angular momentum $\\ell$ moves on the Archimedean spiral $r = a\\theta$ under a central force. The force is',
      options: ['$F = -\\dfrac{\\ell^2}{\\mu}\\dfrac{1}{r^3}$', '$F = -\\dfrac{\\ell^2}{\\mu}\\left(\\dfrac{2a^2}{r^5} + \\dfrac{1}{r^3}\\right)$', '$F = -\\dfrac{\\ell^2}{\\mu}\\dfrac{2a^2}{r^5}$', '$F = +\\dfrac{\\ell^2}{\\mu}\\left(\\dfrac{2a^2}{r^5} - \\dfrac{1}{r^3}\\right)$'], answer: 1,
      sol: '$u = 1/(a\\theta)$, $u\' = -1/(a\\theta^2)$, $u\'\' = 2/(a\\theta^3) = 2a^2u^3$. Binet: $F = -\\dfrac{\\ell^2u^2}{\\mu}(u\'\' + u) = -\\dfrac{\\ell^2}{\\mu}(2a^2u^5 + u^3)$.' },
    { id: 'cfs-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'lab and CM frames',
      q: 'A projectile scatters elastically off a target twice as heavy, initially at rest. The centre-of-mass scattering angle is $60^\\circ$. The lab scattering angle of the projectile is ______ degrees.',
      answer: 40.89, tol: 0.2, unit: '°', calc: () => Math.atan(Math.sin(60 * Math.PI / 180) / (Math.cos(60 * Math.PI / 180) + 0.5)) * 180 / Math.PI,
      sol: '$\\tan\\theta_L = \\dfrac{\\sin\\Theta}{\\cos\\Theta + m_1/m_2} = \\dfrac{0.866}{0.5 + 0.5} = 0.866$, so $\\theta_L = 40.9^\\circ$.',
      trap: 'The ratio is projectile over target, $m_1/m_2 = 1/2$, not 2.' },
    { id: 'cfs-020', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Rutherford scattering',
      q: 'Which statements about the Rutherford cross-section $\\dfrac{d\\sigma}{d\\Omega} = \\left(\\dfrac{zZe^2}{16\\pi\\varepsilon_0E}\\right)^2\\dfrac{1}{\\sin^4(\\Theta/2)}$ are correct?',
      options: ['It is proportional to $Z^2$', 'It falls as $1/E^2$', 'It is the same for attractive and repulsive Coulomb forces', 'The impact parameter grows as the scattering angle grows'], answer: [0, 1, 2],
      sol: 'A and B read off the formula. C: the formula depends on $k^2$, so the sign of the charge product drops out (the orbits differ, the cross-section does not). D: $b = (k/2E)\\cot(\\Theta/2)$ decreases as $\\Theta$ grows; close passes deflect most.' },
    { id: 'cfs-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Rutherford scattering',
      q: 'Alpha particles with $k/2E = 22.75$ fm hit a gold foil containing $10^{23}$ nuclei per m². The fraction scattered through more than $90^\\circ$ is $f\\times10^{-4}$. The value of $f$ is ______.',
      answer: 1.626, tol: 0.02, calc: () => Math.PI * 22.75 ** 2 * 1e-30 * 1e23 * 1e4,
      sol: 'Deflections above $90^\\circ$ need $b < b(90^\\circ) = (k/2E)\\cot45^\\circ = 22.75$ fm. Cross-section: $\\pi b^2 = \\pi(22.75\\times10^{-15})^2 = 1.626\\times10^{-27}$ m². Fraction $= n\\sigma = 10^{23}\\times1.626\\times10^{-27} = 1.626\\times10^{-4}$.' },
    { id: 'cfs-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'precession',
      q: 'A particle moves in $U = -\\dfrac kr + \\dfrac{h}{r^2}$ with small $h > 0$. The bound orbits are $r = \\dfrac{p}{1 + e\\cos\\gamma\\theta}$ with',
      options: ['$\\gamma = 1$, a closed ellipse', '$\\gamma = \\sqrt{1 - 2\\mu h/\\ell^2}$, perihelion advancing', '$\\gamma = \\sqrt{1 + 2\\mu h/\\ell^2}$, perihelion moving backwards', '$\\gamma = 1 + h/k$, perihelion advancing'], answer: 2,
      sol: 'The $h/r^2$ term adds to the centrifugal term: $\\ell^2/2\\mu r^2 + h/r^2 = \\ell\'^2/2\\mu r^2$ with $\\ell\'^2 = \\ell^2 + 2\\mu h$. Binet becomes $u\'\' + \\gamma^2u = \\mu k/\\ell^2$ with $\\gamma^2 = 1 + 2\\mu h/\\ell^2 > 1$. Successive perihelia are $2\\pi/\\gamma < 2\\pi$ apart: the perihelion regresses by about $2\\pi\\mu h/\\ell^2$ per orbit.' },
    { id: 'cfs-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Rutherford scattering',
      q: 'A charged particle approaches a fixed repulsive Coulomb centre with $2Eb/k = \\sqrt3$. Its deflection is ______ degrees.',
      answer: 60, tol: 0.1, unit: '°', calc: () => 2 * Math.atan(1 / Math.sqrt(3)) * 180 / Math.PI,
      sol: '$\\cot(\\Theta/2) = 2Eb/k = \\sqrt3$ gives $\\Theta/2 = 30^\\circ$, $\\Theta = 60^\\circ$. Equivalently $e = \\sqrt{1 + 3} = 2$ and $\\sin(\\Theta/2) = 1/e$.' },
    { id: 'cfs-024', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'lab and CM frames',
      q: 'For elastic scattering of equal masses (target at rest), the ratio of the lab differential cross-section to the centre-of-mass one, $(d\\sigma/d\\Omega)_L/(d\\sigma/d\\Omega)_{CM}$, for a projectile observed at $\\theta_L = 60^\\circ$ is ______.',
      answer: 2, tol: 0.01, calc: () => 4 * Math.cos(60 * Math.PI / 180),
      sol: 'With $\\Theta = 2\\theta_L$: $d\\Omega_{CM}/d\\Omega_L = \\dfrac{\\sin\\Theta\\,d\\Theta}{\\sin\\theta_L\\,d\\theta_L} = \\dfrac{2\\sin\\theta_L\\cos\\theta_L\\cdot2}{\\sin\\theta_L} = 4\\cos\\theta_L$. The same particles fill a smaller lab solid angle, so $(d\\sigma/d\\Omega)_L = 4\\cos\\theta_L\\,(d\\sigma/d\\Omega)_{CM} = 2(d\\sigma/d\\Omega)_{CM}$ at $60^\\circ$.' },
    { id: 'cfs-025', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'lab and CM frames',
      q: 'In the centre-of-mass frame, an elastic collision of two particles',
      options: ['changes both speeds but keeps the directions', 'reduces the speed of the lighter particle', 'leaves the relative velocity unchanged in direction', 'only rotates the velocities, leaving each particle\'s speed unchanged'], answer: 3,
      sol: 'In the CM frame the momenta are equal and opposite before and after, $\\vec p_1 = -\\vec p_2$. Kinetic energy conservation, $p^2/2m_1 + p^2/2m_2$, then fixes $|\\vec p|$. So each speed is unchanged and only the common direction turns, by the CM angle $\\Theta$.' },
    { id: 'cfs-026', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Runge-Lenz vector',
      q: 'For the Kepler problem $U = -k/r$, the Laplace-Runge-Lenz vector is $\\vec A = \\vec p\\times\\vec L - \\mu k\\hat r$. Which statements are correct?',
      options: ['It points from the force centre towards the pericentre', 'Its magnitude is $\\mu ke$, where $e$ is the eccentricity', 'It lies in the plane of the orbit', 'It is conserved for every central force'], answer: [0, 1, 2],
      sol: 'Dotting with $\\vec r$: $\\vec A\\cdot\\vec r = \\ell^2 - \\mu kr$, i.e. $Ar\\cos\\theta = \\ell^2 - \\mu kr$, which is the conic $r = (\\ell^2/\\mu k)/(1 + (A/\\mu k)\\cos\\theta)$ with $\\theta$ measured from $\\vec A$. So $e = A/\\mu k$ and $r$ is least at $\\theta = 0$. $\\vec A \\perp \\vec L$, so it lies in the orbital plane. Its conservation needs exactly $1/r$; any other force makes it rotate (precession).' },
    { id: 'cfs-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'capture',
      q: 'Bodies approach the Earth at 5.6 km/s (far away). The Earth\'s escape speed is 11.2 km/s. Gravitational focusing makes the capture cross-section larger than $\\pi R^2$ by a factor of ______.',
      answer: 5, tol: 0.01, calc: () => 1 + (11.2 / 5.6) ** 2,
      sol: '$\\sigma = \\pi R^2(1 + 2GM/Rv^2) = \\pi R^2(1 + v_{\\rm esc}^2/v^2) = \\pi R^2(1 + 4) = 5\\pi R^2$.' },
    { id: 'cfs-039', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Rutherford scattering',
      q: 'In a Rutherford scattering experiment, a detector at $60^\\circ$ records 1000 counts per minute. Moved to $120^\\circ$ (same solid angle), it should record about ______ counts per minute.',
      answer: 111.1, tol: 1, unit: '/min', calc: () => 1000 * Math.sin(30 * Math.PI / 180) ** 4 / Math.sin(60 * Math.PI / 180) ** 4,
      sol: 'Counts $\\propto 1/\\sin^4(\\Theta/2)$: ratio $= \\sin^4 30^\\circ/\\sin^4 60^\\circ = 0.0625/0.5625 = 1/9$. So about $1000/9 = 111$ per minute.' },
    { id: 'cfs-042', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'orbit equation',
      q: 'A particle moves under a central force on the hyperbolic spiral $r = a/\\theta$. The force is',
      options: ['zero', '$-\\dfrac{\\ell^2}{\\mu r^3}$', '$-\\dfrac{\\ell^2}{\\mu a r^2}$', '$+\\dfrac{\\ell^2}{\\mu r^3}$'], answer: 1,
      sol: '$u = \\theta/a$ so $u\'\' = 0$ and $u\'\' + u = u$. Binet: $F = -\\dfrac{\\ell^2u^2}{\\mu}\\cdot u = -\\dfrac{\\ell^2}{\\mu r^3}$, an attractive inverse cube force. (The force exactly cancels the centrifugal term, so $\\ddot r$ follows from the free radial motion in $u$.)' },

    // ---------- level 4 ----------
    { id: 'cfs-028', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'lab and CM frames',
      q: 'Hard spheres of radius $a/2$ collide elastically with identical spheres at rest (so the centre-to-centre impact distance is $a$, and the CM cross-section is isotropic, $a^2/4$). The lab differential cross-section of the projectile at lab angle $\\theta_L$ is',
      options: ['$a^2\\cos\\theta_L$', '$\\tfrac14 a^2$', '$a^2\\cos^2\\theta_L$', '$\\tfrac14 a^2\\cos\\theta_L$'], answer: 0,
      sol: 'For equal masses $(d\\sigma/d\\Omega)_L = 4\\cos\\theta_L\\,(d\\sigma/d\\Omega)_{CM} = 4\\cos\\theta_L\\cdot a^2/4 = a^2\\cos\\theta_L$ for $0 \\le \\theta_L \\le 90^\\circ$. Check: $\\int_0^{\\pi/2} a^2\\cos\\theta_L\\,2\\pi\\sin\\theta_L\\,d\\theta_L = \\pi a^2$, the same total.' },
    { id: 'cfs-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'cross-sections',
      q: 'For the repulsive potential $U = k/r^2$ with $k/E = 1$ fm², the impact parameter that gives a $60^\\circ$ deflection is ______ fm. (Use $\\Theta = \\pi(1 - b/\\sqrt{b^2 + k/E})$.)',
      answer: 0.8944, tol: 0.005, unit: 'fm', calc: () => Math.sqrt(0.8),
      sol: '$60^\\circ = \\pi/3$, so $b/\\sqrt{b^2 + 1} = 2/3$. Squaring: $9b^2 = 4b^2 + 4$, $b^2 = 0.8$, $b = 0.894$ fm.' },
    { id: 'cfs-030', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'small-angle scattering',
      q: 'A fast particle of kinetic energy $E$ passes a fixed Coulomb centre ($U = k/r$) at a large impact parameter $b$. Using the impulse approximation (straight-line path), its small deflection is',
      options: ['$\\dfrac{k}{2Eb}$', '$\\dfrac{k}{Eb}$', '$\\dfrac{2k}{Eb}$', '$\\dfrac{k}{Eb^2}$'], answer: 1,
      sol: 'The sideways impulse is $\\Delta p = \\displaystyle\\int F_\\perp\\,dt = \\int_{-\\infty}^{\\infty}\\dfrac{kb}{(b^2 + v^2t^2)^{3/2}}dt = \\dfrac{2k}{bv}$. So $\\Theta \\approx \\Delta p/p = \\dfrac{2k}{bmv^2} = \\dfrac{k}{Eb}$, matching the small-angle limit of $\\tan(\\Theta/2) = k/2Eb$.' },
    { id: 'cfs-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'small-angle scattering',
      q: 'For a potential $U = C/r^n$, small deflections scale as $\\Theta \\propto b^{-n}$. Then at small angles $d\\sigma/d\\Omega \\propto \\Theta^{s}$. For $n = 4$, the exponent $s$ is ______.',
      answer: -2.5, tol: 0.01, calc: () => -2 - 2 / 4,
      sol: '$b \\propto \\Theta^{-1/n}$, $|db/d\\Theta| \\propto \\Theta^{-1/n - 1}$, and $\\sin\\Theta \\approx \\Theta$. So $\\dfrac{d\\sigma}{d\\Omega} = \\dfrac{b}{\\Theta}\\left|\\dfrac{db}{d\\Theta}\\right| \\propto \\Theta^{-2/n - 2}$. For $n = 4$: $s = -2.5$. Check: $n = 1$ gives $\\Theta^{-4}$, the small-angle Rutherford law.' },
    { id: 'cfs-032', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'capture',
      q: 'Particles approach a fixed attractive centre. Which statements about falling into the centre (capture) are correct?',
      options: ['For $U = -k/r^2$, a particle falls in if $\\ell^2 < 2\\mu k$, whatever its energy', 'For $U = -k/r^n$ with $n > 2$, there is a finite capture cross-section that depends on the energy', 'For $U = -k/r$, a particle with $\\ell \\neq 0$ never reaches the centre', 'For $U = -k/r^4$ the capture cross-section is the same at all energies'], answer: [0, 1, 2],
      sol: 'The effective potential is $\\ell^2/2\\mu r^2 + U$. A: with $-k/r^2$ the net $1/r^2$ coefficient is $(\\ell^2 - 2\\mu k)/2\\mu$; if negative, nothing stops the fall. B: for $n > 2$, $U$ wins at small $r$, and the barrier height depends on $\\ell$ and $E$. C: for $n = 1$ the centrifugal term always wins at small $r$. D: for $n = 4$ the barrier top is $\\ell^4/(16\\mu^2k)$; capture when it is below $E$ gives $b^4 < 4k/E$, so $\\sigma = 2\\pi\\sqrt{k/E}$, which falls with energy.' },
    { id: 'cfs-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'capture',
      q: 'For the attractive potential $U = -k/r^4$, particles are captured when $b^4 < 4k/E$. For $k/E = 4$ fm⁴, the capture cross-section is ______ fm².',
      answer: 12.566, tol: 0.05, unit: 'fm²', calc: () => Math.PI * Math.sqrt(4 * 4),
      sol: '$b_{\\max}^2 = \\sqrt{4k/E} = \\sqrt{16} = 4$ fm², so $\\sigma = \\pi b_{\\max}^2 = 4\\pi = 12.57$ fm².<br>Origin of the condition: $U_{\\rm eff}/E = b^2x - (k/E)x^2$ with $x = 1/r^2$ has its maximum $b^4E/4k$; capture needs this below 1.' },
    { id: 'cfs-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'lab and CM frames',
      q: 'Alpha particles (mass 4 u) scatter elastically off hydrogen nuclei (mass 1 u) at rest. The largest angle through which an alpha particle can be deflected in the lab is ______ degrees.',
      answer: 14.48, tol: 0.1, unit: '°', calc: () => Math.asin(1 / 4) * 180 / Math.PI,
      sol: 'For $m_1 > m_2$, $\\sin\\theta_{\\max} = m_2/m_1 = 1/4$, so $\\theta_{\\max} = 14.5^\\circ$. In velocity space the projectile\'s final velocity lies on a circle (radius $v_{\\rm cm}m_2/m_1$ about the CM velocity) that does not enclose the origin; the tangent from the origin gives the maximum angle.' },
    { id: 'cfs-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'orbit equation',
      q: 'A particle moves under the attractive force $F = -c/r^3$ on a logarithmic spiral $r = r_0e^{-\\alpha\\theta}$. Its total energy is',
      options: ['$-\\dfrac{c}{2r_0^2}$', 'positive', '$0$', 'negative and growing in size as it spirals in'], answer: 2,
      sol: 'Binet with $F = -cu^3$: $u\'\' = (\\mu c/\\ell^2 - 1)u$, so the spiral needs $\\alpha^2 = \\mu c/\\ell^2 - 1$. Energy: $E = \\dfrac{\\ell^2}{2\\mu}(u\'^2 + u^2) - \\dfrac c2u^2 = \\dfrac{u^2}{2\\mu}\\left(\\ell^2\\alpha^2 + \\ell^2 - \\mu c\\right) = 0$. Exactly zero, which is why these spirals separate orbits that escape from orbits that fall in.' },

    // ---------- level 5 ----------
    { id: 'cfs-034', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'precession',
      q: 'A small extra term is added to the Kepler potential: $U = -\\dfrac kr - \\dfrac{\\epsilon}{r^3}$. For a nearly circular orbit of angular momentum $\\ell$ (reduced mass $\\mu$), to first order in $\\epsilon$ the pericentre advances per orbit by',
      options: ['$\\dfrac{2\\pi\\mu^2k\\epsilon}{\\ell^4}$', '$-\\dfrac{6\\pi\\mu^2k\\epsilon}{\\ell^4}$', '$\\dfrac{3\\pi\\mu k\\epsilon}{\\ell^2}$', '$\\dfrac{6\\pi\\mu^2k\\epsilon}{\\ell^4}$'], answer: 3,
      sol: 'The force is $F = -ku^2 - 3\\epsilon u^4$, so Binet gives $u\'\' + u = \\dfrac{\\mu k}{\\ell^2} + \\dfrac{3\\mu\\epsilon}{\\ell^2}u^2$. Linearising about the circle $u_0 \\approx \\mu k/\\ell^2$: $\\delta u\'\' + \\left(1 - \\dfrac{6\\mu\\epsilon u_0}{\\ell^2}\\right)\\delta u = 0$. The radial wobble has angular period $2\\pi/\\gamma$ with $\\gamma \\approx 1 - 3\\mu\\epsilon u_0/\\ell^2$, so each orbit the pericentre moves forward by $2\\pi(1/\\gamma - 1) \\approx 6\\pi\\mu\\epsilon u_0/\\ell^2 = 6\\pi\\mu^2k\\epsilon/\\ell^4$. General relativity adds just such a term, giving Mercury\'s 43 arcseconds per century.' },
    { id: 'cfs-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'stability of orbits',
      q: 'A particle moves in the attractive Yukawa potential $U = -\\dfrac{k}{r}e^{-r/a}$. Circular orbits are stable only for $r < r_c$. The ratio $r_c/a$ is ______.',
      answer: 1.618, tol: 0.005, calc: () => (1 + Math.sqrt(5)) / 2,
      sol: 'The attractive force magnitude is $f = \\dfrac{dU}{dr} = ke^{-r/a}\\left(\\dfrac{1}{r^2} + \\dfrac{1}{ar}\\right)$. A circular orbit is stable when $\\dfrac{d}{dr}(r^3f) > 0$. Here $r^3f = ke^{-r/a}(r + r^2/a)$, whose derivative is $ke^{-r/a}\\left(1 + \\dfrac ra - \\dfrac{r^2}{a^2}\\right)$. This is positive while $x^2 - x - 1 < 0$ with $x = r/a$, i.e. $x < (1 + \\sqrt5)/2 = 1.618$.',
      trap: 'The condition $d(r^3f)/dr > 0$ is the general form of "$n > -3$" for power laws.' },
    { id: 'cfs-038', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'cross-sections',
      q: 'Particles scatter off the repulsive potential $U = k/r^2$ with $k/E = 3$ fm². The cross-section for scattering through more than $90^\\circ$ is ______ fm².',
      answer: 3.1416, tol: 0.02, unit: 'fm²', calc: () => Math.PI * 3 / 3,
      sol: '$\\Theta = \\pi(1 - b/\\sqrt{b^2 + k/E}) > \\pi/2$ needs $b/\\sqrt{b^2 + k/E} < 1/2$, i.e. $b^2 < k/3E = 1$ fm². So $\\sigma = \\pi b_{\\max}^2 = \\pi$ fm² $= 3.14$ fm².' },
    { id: 'cfs-040', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'cross-sections',
      q: 'Which statements about classical differential cross-sections are correct?',
      options: ['Where $d\\Theta/db = 0$ at a non-zero angle (a rainbow angle), $d\\sigma/d\\Omega$ becomes infinite', 'Where $\\sin\\Theta = 0$ for a non-zero impact parameter (a glory), $d\\sigma/d\\Omega$ becomes infinite', 'For a potential that is exactly zero beyond a finite range, the total cross-section is finite', 'For the Yukawa potential, whose range is set by $e^{-r/a}$, the classical total cross-section is finite'], answer: [0, 1, 2],
      sol: 'A and B: $d\\sigma/d\\Omega = \\dfrac{b}{\\sin\\Theta}|db/d\\Theta|$ blows up when $|db/d\\Theta| \\to \\infty$ (rainbow) or when $\\sin\\Theta \\to 0$ with $b \\neq 0$ (glory), though the integrals stay finite. C: beyond the range nothing is deflected, so $\\sigma \\le \\pi R^2$. D: the Yukawa force is never exactly zero, so classically every $b$ gives some deflection and the total diverges (quantum mechanics makes it finite).' },
    ...more2,
    ...r4.items,
    ...r5.items,
  ],
  gens: [
    { id: 'cfs-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Rutherford scattering',
      make(r) {
        const [name, Z] = choose(r, [['gold', 79], ['silver', 47], ['copper', 29], ['aluminium', 13], ['lead', 82], ['platinum', 78]]);
        const E = pick(r, 3, 9, 0.5), th = choose(r, [30, 45, 60, 90, 120, 150]);
        const k = 2 * Z * KE, answer = round(k / (2 * E) / Math.tan(th * DEG / 2), 3);
        return { q: `An alpha particle ($z = 2$) of kinetic energy ${E} MeV scatters off a ${name} nucleus ($Z = ${Z}$), treated as fixed. Taking $e^2/4\\pi\\varepsilon_0 = 1.44$ MeV fm, find the impact parameter (fm) that gives a deflection of ${th}°.`,
          answer, tol: Math.max(0.01, answer * 0.01), unit: 'fm', Z, E, th,
          sol: `$k = zZ\\times1.44 = ${round(k, 2)}$ MeV fm. $b = \\dfrac{k}{2E}\\cot\\dfrac\\Theta2 = \\dfrac{${round(k, 2)}}{${2 * E}}\\cot ${th / 2}^\\circ = ${answer}$ fm.`,
          trap: 'Use half the scattering angle in the cotangent.' };
      },
      verify: (p) => 2 * p.Z * KE / (2 * p.E) / Math.tan(p.th * DEG / 2) },
    { id: 'cfs-g02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Rutherford scattering',
      make(r) {
        const a = int(r, 5, 40), th = choose(r, [30, 60, 90, 120, 180]);
        const answer = round(a * (1 + 1 / Math.sin(th * DEG / 2)), 3);
        return { q: `In Rutherford scattering with $k/2E = ${a}$ fm, find the distance of closest approach (fm) for a particle deflected through ${th}°.`,
          answer, tol: Math.max(0.05, answer * 0.005), unit: 'fm', a, th,
          sol: `$r_{\\min} = \\dfrac{k}{2E}\\left(1 + \\dfrac{1}{\\sin(\\Theta/2)}\\right) = ${a}\\left(1 + \\dfrac{1}{\\sin ${th / 2}^\\circ}\\right) = ${answer}$ fm.${th === 180 ? ' (Head-on: this equals $k/E$.)' : ''}` };
      },
      verify: (p) => p.a * (1 + 1 / Math.sin(p.th * DEG / 2)) },
    { id: 'cfs-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Rutherford scattering',
      make(r) {
        const t1 = choose(r, [20, 30, 40, 60]), t2 = choose(r, [90, 120, 150, 180]), N = choose(r, [500, 1000, 2000, 5000, 10000]);
        const answer = round(N * Math.sin(t1 * DEG / 2) ** 4 / Math.sin(t2 * DEG / 2) ** 4, 2);
        return { q: `A Rutherford scattering detector at ${t1}° counts ${N} alpha particles per hour. How many per hour should it count at ${t2}° (same solid angle and beam)?`,
          answer, tol: Math.max(0.05, answer * 0.01), unit: '/h', t1, t2, N,
          sol: `Counts $\\propto 1/\\sin^4(\\Theta/2)$, so the new rate is $${N}\\times\\dfrac{\\sin^4 ${t1 / 2}^\\circ}{\\sin^4 ${t2 / 2}^\\circ} = ${answer}$ per hour.`,
          trap: 'Raise the sine of half the angle to the fourth power, not the second.' };
      },
      verify: (p) => p.N * Math.sin(p.t1 * DEG / 2) ** 4 / Math.sin(p.t2 * DEG / 2) ** 4 },
    { id: 'cfs-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'lab and CM frames',
      make(r) {
        const [m1, m2] = choose(r, [[1, 2], [1, 3], [1, 4], [2, 3], [1, 12], [4, 12], [2, 1], [3, 1], [1, 1]]);
        const T = choose(r, [30, 45, 60, 90, 120]);
        const x = Math.cos(T * DEG) + m1 / m2, y = Math.sin(T * DEG);
        const answer = round(Math.atan2(y, x) / DEG, 2);
        return { q: `A projectile of mass ${m1} u scatters elastically off a target of mass ${m2} u at rest. The centre-of-mass scattering angle is ${T}°. Find the projectile's lab scattering angle in degrees.`,
          answer, tol: 0.2, unit: '°', m1, m2, T,
          sol: `$\\tan\\theta_L = \\dfrac{\\sin\\Theta}{\\cos\\Theta + m_1/m_2} = \\dfrac{${round(y, 4)}}{${round(Math.cos(T * DEG), 4)} + ${round(m1 / m2, 4)}}$, giving $\\theta_L = ${answer}^\\circ$${x < 0 ? ' (the denominator is negative, so the angle is beyond 90°)' : ''}.`,
          trap: 'The mass ratio is projectile over target.' };
      },
      verify: (p) => Math.atan2(Math.sin(p.T * DEG), Math.cos(p.T * DEG) + p.m1 / p.m2) / DEG },
    { id: 'cfs-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'lab and CM frames',
      make(r) {
        const [n1, m1, n2, m2] = choose(r, [['an alpha particle', 4, 'a proton', 1], ['a deuteron', 2, 'a proton', 1], ['a carbon-12 ion', 12, 'an alpha particle', 4], ['an oxygen-16 ion', 16, 'a deuteron', 2], ['a muon (taken as 0.113 u)', 0.113, 'an electron (0.000549 u)', 0.000549], ['an alpha particle', 4, 'a deuteron', 2]]);
        const answer = round(Math.asin(m2 / m1) / DEG, 3);
        return { q: `In an elastic collision, ${n1} (${m1} u) strikes ${n2} (${m2} u) at rest. What is the largest angle (degrees) through which the projectile can be deflected in the lab?`,
          answer, tol: Math.max(0.01, answer * 0.005), unit: '°', m1, m2,
          sol: `For a heavier projectile, $\\sin\\theta_{\\max} = m_2/m_1 = ${round(m2 / m1, 5)}$, so $\\theta_{\\max} = ${answer}^\\circ$.` };
      },
      verify: (p) => Math.asin(p.m2 / p.m1) / DEG },
    { id: 'cfs-g06', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'cross-sections',
      make(r) {
        const a = pick(r, 1, 5, 0.5), ask = choose(r, ['b', 'theta']);
        if (ask === 'b') {
          const th = choose(r, [30, 60, 90, 120, 150]); const answer = round(a * Math.cos(th * DEG / 2), 3);
          return { q: `Point particles bounce elastically off a fixed hard sphere of radius ${a} fm. Find the impact parameter (fm) for a deflection of ${th}°.`,
            answer, tol: Math.max(0.005, answer * 0.005), unit: 'fm', a, ask, th, bb: 0,
            sol: `Specular reflection gives $b = a\\cos(\\Theta/2) = ${a}\\cos ${th / 2}^\\circ = ${answer}$ fm.` };
        }
        const bb = round(a * pick(r, 0.1, 0.9, 0.1), 3); const answer = round(2 * Math.acos(bb / a) / DEG, 2);
        return { q: `Point particles bounce elastically off a fixed hard sphere of radius ${a} fm. Find the deflection (degrees) of a particle with impact parameter ${bb} fm.`,
          answer, tol: 0.1, unit: '°', a, ask, th: 0, bb,
          sol: `$b = a\\cos(\\Theta/2)$, so $\\Theta = 2\\cos^{-1}(${bb}/${a}) = ${answer}^\\circ$.` };
      },
      verify: (p) => (p.ask === 'b' ? p.a * Math.cos(p.th * DEG / 2) : 2 * Math.acos(p.bb / p.a) / DEG) },
    { id: 'cfs-g07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'cross-sections',
      make(r) {
        const kE = pick(r, 0.5, 4, 0.5), b = pick(r, 0.2, 3, 0.1);
        const answer = round(180 * (1 - b / Math.sqrt(b * b + kE)), 2);
        return { q: `Particles of energy $E$ scatter off the repulsive potential $U = k/r^2$ with $k/E = ${kE}$ fm². Using $\\Theta = \\pi(1 - b/\\sqrt{b^2 + k/E})$, find the deflection (degrees) for impact parameter ${b} fm.`,
          answer, tol: 0.2, unit: '°', kE, b,
          sol: `$b/\\sqrt{b^2 + k/E} = ${b}/\\sqrt{${round(b * b, 3)} + ${kE}} = ${round(b / Math.sqrt(b * b + kE), 4)}$, so $\\Theta = 180^\\circ(1 - ${round(b / Math.sqrt(b * b + kE), 4)}) = ${answer}^\\circ$.` };
      },
      verify: (p) => 180 * (1 - p.b / Math.sqrt(p.b * p.b + p.kE)) },
    { id: 'cfs-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'capture',
      make(r) {
        const [name, ve] = choose(r, [['the Earth', 11.2], ['the Moon', 2.38], ['Mars', 5.03], ['Jupiter', 59.5], ['the Sun', 617.5]]);
        const v = pick(r, 1, 40, 1);
        const answer = round(1 + (ve / v) ** 2, 3);
        return { q: `Small bodies approach ${name} (escape speed ${ve} km/s) at ${v} km/s far away. By what factor does gravitational focusing enlarge the capture cross-section over $\\pi R^2$?`,
          answer, tol: Math.max(0.005, answer * 0.005), ve, v,
          sol: `$\\sigma = \\pi R^2(1 + v_{\\rm esc}^2/v^2)$, so the factor is $1 + (${ve}/${v})^2 = ${answer}$.`,
          trap: 'The factor uses the square of the speed ratio.' };
      },
      verify: (p) => 1 + (p.ve / p.v) ** 2 },
    { id: 'cfs-g09', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'orbit equation',
      make(r) {
        const cases = [
          ['the logarithmic spiral $r = r_0e^{\\alpha\\theta}$', '$F \\propto -1/r^3$', 'u\'\' = \\alpha^2u, so u\'\' + u = (1 + \\alpha^2)u and F = -\\ell^2(1 + \\alpha^2)u^3/\\mu'],
          ['the hyperbolic spiral $r = a/\\theta$', '$F \\propto -1/r^3$', 'u = \\theta/a, u\'\' = 0, so u\'\' + u = u and F = -\\ell^2u^3/\\mu'],
          ['the conic $r = p/(1 + e\\cos\\theta)$', '$F \\propto -1/r^2$', 'u\'\' + u = 1/p, a constant, so F = -\\ell^2u^2/(\\mu p)'],
          ['the straight line $r = a\\sec\\theta$ (not through the centre)', '$F = 0$', 'u = \\cos\\theta/a, u\'\' + u = 0, so F = 0'],
          ['the circle $r = 2a\\cos\\theta$ through the force centre', '$F \\propto -1/r^5$', 'u\'\' + u = 8a^2u^3, so F = -8a^2\\ell^2u^5/\\mu'],
        ];
        const [orbit, law, why] = choose(r, cases);
        const all = ['$F \\propto -1/r^3$', '$F \\propto -1/r^2$', '$F = 0$', '$F \\propto -1/r^5$', '$F \\propto -r$'];
        const o = mcqOptions(r, law, all.filter((x) => x !== law), (v) => v);
        return { q: `A particle moves under a central force (centre at the origin) on ${orbit}. The force law is`, ...o,
          sol: `Use Binet's equation $F = -\\dfrac{\\ell^2u^2}{\\mu}(u'' + u)$ with $u = 1/r$: $${why}$. So ${law}.` };
      } },
    { id: 'cfs-g10', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'cross-sections',
      make(r) {
        const I = choose(r, [1e6, 1e7, 1e8, 1e9]), n = choose(r, [1e20, 1e21, 1e22, 1e23]), ds = choose(r, [1, 2, 5, 10, 20, 50]), dO = choose(r, [0.001, 0.002, 0.005, 0.01]);
        const answer = round(I * n * ds * 1e-27 * dO, 6);
        const ex = (v) => `10^{${Math.round(Math.log10(v))}}`;
        return { q: `A beam of $${ex(I)}$ particles/s hits a thin target with $${ex(n)}$ nuclei per cm². At the detector angle $d\\sigma/d\\Omega = ${ds}$ mb/sr, and the detector subtends ${dO} sr. Find the count rate per second (1 mb $= 10^{-27}$ cm²).`,
          answer, tol: Math.max(1e-6, answer * 0.005), unit: '/s', I, n, ds, dO,
          sol: `Rate $= I\\,n\\,\\dfrac{d\\sigma}{d\\Omega}\\,\\Delta\\Omega = ${ex(I)}\\times${ex(n)}\\times${ds}\\times10^{-27}\\times${dO} = ${answer}$ per second.` };
      },
      verify: (p) => p.I * p.n * p.ds * 1e-27 * p.dO },
    { id: 'cfs-g11', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Rutherford scattering',
      make(r) {
        const a = int(r, 5, 30), th = choose(r, [30, 60, 90, 120, 150]);
        const answer = round(Math.PI * a * a / Math.tan(th * DEG / 2) ** 2 / 100, 4);
        return { q: `In Rutherford scattering with $k/2E = ${a}$ fm, find the cross-section (in barns, 1 b $= 100$ fm²) for deflection through more than ${th}°.`,
          answer, tol: Math.max(0.0005, answer * 0.01), unit: 'b', a, th,
          sol: `Deflection above $\\Theta_0$ means $b < (k/2E)\\cot(\\Theta_0/2)$, so $\\sigma = \\pi(k/2E)^2\\cot^2(\\Theta_0/2) = \\pi(${a})^2\\cot^2 ${th / 2}^\\circ$ fm² $= ${round(answer * 100, 2)}$ fm² $= ${answer}$ b.`,
          trap: 'Integrating $d\\sigma/d\\Omega$ from $\\Theta_0$ to $\\pi$ gives the same result; the impact parameter route is quicker.' };
      },
      verify: (p) => Math.PI * p.a * p.a / Math.tan(p.th * DEG / 2) ** 2 / 100 },
    { id: 'cfs-g12', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'small-angle scattering',
      make(r) {
        const n = choose(r, [1, 2, 3, 4, 6]);
        const fr = (num, den) => { const gg = (a, b) => (b ? gg(b, a % b) : a); const d = gg(num, den); return den / d === 1 ? `${num / d}` : `${num / d}/${den / d}`; };
        const s = (k) => `$\\Theta^{-${fr(2 * k + 2, k)}}$`;
        const right = s(n);
        const o = mcqOptions(r, right, [1, 2, 3, 4, 6].filter((x) => x !== n).map(s), (v) => v);
        return { q: `At small angles, the classical differential cross-section for the potential $U = C/r^{${n}}$ varies as`, ...o,
          sol: `In the impulse approximation $\\Theta \\propto b^{-${n}}$, so $b \\propto \\Theta^{-1/${n}}$ and $\\dfrac{d\\sigma}{d\\Omega} \\approx \\dfrac{b}{\\Theta}\\left|\\dfrac{db}{d\\Theta}\\right| \\propto \\Theta^{-2 - 2/${n}}$, i.e. ${right}.${n === 1 ? ' This is the small-angle Rutherford law.' : ''}` };
      } },
    { id: 'cfs-g13', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'lab and CM frames',
      make(r) {
        const tl = choose(r, [10, 20, 30, 40, 45, 50, 60, 70, 80]);
        const answer = round(4 * Math.cos(tl * DEG), 4);
        return { q: `For elastic scattering of equal masses (target at rest), find the ratio $(d\\sigma/d\\Omega)_L/(d\\sigma/d\\Omega)_{CM}$ for the projectile seen at lab angle ${tl}°.`,
          answer, tol: Math.max(0.002, answer * 0.005), tl,
          sol: `$\\Theta = 2\\theta_L$, so $d\\Omega_{CM}/d\\Omega_L = 4\\cos\\theta_L$ and the ratio is $4\\cos ${tl}^\\circ = ${answer}$.` };
      },
      verify: (p) => 4 * Math.cos(p.tl * DEG) },
    ...more,
    ...r4.gens,
    ...r5.gens,
  ],
};
