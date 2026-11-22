// Round 5 extras for central-force-scattering: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;
const D = 180 / Math.PI;
const labAngle = (m1, m2, th) => { const t = th / D; return Math.atan2(Math.sin(t), Math.cos(t) + m1 / m2) * D; };

export default {
  items: [
    { id: 'cfs-r5-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'central forces',
      q: R`For a particle moving under any central force (not only inverse-square), which statement always holds?`,
      options: [R`The orbit is an ellipse`, R`The speed is constant`, R`The radius vector sweeps equal areas in equal times`, R`The orbit is closed`], answer: 2,
      sol: R`A central force exerts no torque about the centre, so $\mathbf L = \mu\mathbf r\times\dot{\mathbf r}$ is constant. The motion stays in a plane and the areal rate $dA/dt = L/2\mu$ is constant: Kepler's second law holds for every central force. Ellipses and closed orbits are special to the $1/r$ and $r^2$ potentials; the speed changes whenever $r$ does.`,
      trap: R`Kepler's first and third laws need the inverse-square force; only the second law is general.` },
    { id: 'cfs-r5-02', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'circular orbits',
      q: R`A particle moves in the attractive potential $U = Cr^4$ ($C > 0$). For circular orbits of different radii, the period scales as`,
      options: [R`$r^{-1}$`, R`$r^{3/2}$`, R`$r^{0}$ (independent of $r$)`, R`$r^{2}$`], answer: 0,
      sol: R`The force is $-dU/dr = -4Cr^3$. For a circle, $\mu v^2/r = 4Cr^3$, so $v \propto r^2$. The period $2\pi r/v \propto r/r^2 = r^{-1}$: bigger circles are faster to go round. In general for $U \propto r^n$, $T \propto r^{1 - n/2}$.`,
      trap: R`$r^{3/2}$ is Kepler's third law for $U \propto -1/r$; $r^0$ is the harmonic oscillator, $n = 2$.` },
    { id: 'cfs-r5-03', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Rutherford scattering',
      q: R`In Rutherford scattering by a fixed nucleus with $k/2E = 15$ fm, the impact parameter for a scattering angle of $60^\circ$ is ______ fm.`,
      answer: 25.98, tol: 0.26, calc: () => 15 / Math.tan(30 / D), unit: 'fm',
      sol: R`For the Coulomb potential $b = \dfrac{k}{2E}\cot\dfrac\Theta2$. With $\Theta = 60^\circ$: $b = 15\cot30^\circ = 15\times1.732 = 25.98$ fm. Smaller angles need larger impact parameters.`,
      trap: R`Using $\cot\Theta$ instead of $\cot(\Theta/2)$ gives 8.66 fm.` },
    { id: 'cfs-r5-04', type: 'msq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'effective potential',
      q: R`A body moves in $U = -k/r$ ($k > 0$) with angular momentum $\ell \ne 0$, so $U_{\rm eff} = -\dfrac kr + \dfrac{\ell^2}{2\mu r^2}$. Which statements are true?`,
      options: [R`Every orbit with $E < 0$ stays between two radii`, R`The body can reach $r = 0$ if $E$ is large enough`, R`A circular orbit sits at the minimum of $U_{\rm eff}$`, R`Orbits with $E > 0$ are ellipses`], answer: [0, 2],
      sol: R`$U_{\rm eff}$ rises to $+\infty$ as $r \to 0$ (the centrifugal term wins) and tends to 0 from below at large $r$, with one minimum. For $E < 0$ the body is trapped between two turning points; at the minimum, $\dot r = 0$ always: a circle. The centrifugal barrier stops it reaching $r = 0$ at any energy. $E > 0$ orbits are hyperbolas ($E = 0$ a parabola).`,
      trap: R`Forgetting the centrifugal barrier: only $\ell = 0$ allows a fall into the centre in a $1/r$ potential.` },
    { id: 'cfs-r5-05', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'lab and CM frames',
      q: R`A deuteron (2 u) scatters elastically off a proton (1 u) at rest. The largest possible angle between the deuteron's final and initial directions in the lab is`,
      options: [R`$90^\circ$`, R`$60^\circ$`, R`$180^\circ$`, R`$30^\circ$`], answer: 3,
      sol: R`A heavier projectile cannot turn far. In the CM frame the deuteron's speed is $v_{cm}' = v\,m_2/(m_1 + m_2)$, while the CM moves at $V = v\,m_1/(m_1 + m_2)$. Its lab velocity is $\mathbf V + \mathbf v'$, and the angle is largest when $\mathbf v'$ is tangent to the circle of radius $v'$ about the tip of $\mathbf V$: $\sin\theta_{\max} = v'/V = m_2/m_1 = 1/2$, so $\theta_{\max} = 30^\circ$.`,
      trap: R`$90^\circ$ is the limit for equal masses; $180^\circ$ needs a lighter projectile.` },
    { id: 'cfs-r5-06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'apsidal angle',
      q: R`A body moves on a nearly circular orbit in the attractive potential $U = -C/\sqrt r$ ($C > 0$). The apsidal angle (the angle swept from one closest approach to the next farthest point) is ______ degrees.`,
      answer: 146.97, tol: 1.5, calc: () => 180 / Math.sqrt(1.5), unit: '°',
      sol: R`For a power law $U \propto r^{m}$ (attractive, $m > -2$), small radial oscillations about a circle have $\omega_r^2/\omega_\theta^2 = m + 2$, so the apsidal angle is $\pi/\sqrt{m + 2}$. Here $m = -\tfrac12$: $\pi/\sqrt{1.5} = 0.8165\pi$ rad $= 146.97^\circ$. Less than $180^\circ$ means the orbit's long axis turns backwards each lap (regression).`,
      trap: R`Using the exponent of the force ($-\tfrac32$) instead of the potential ($-\tfrac12$) in $\pi/\sqrt{m + 2}$.` },
    { id: 'cfs-r5-07', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'orbit equation',
      q: R`A particle (reduced mass $\mu$, angular momentum $\ell$) comes in from far away under only the attractive force $F = -c/r^3$, with $\mu c/\ell^2 = 3/4$. Using the orbit equation $u'' + u = -\dfrac{\mu}{\ell^2u^2}F(1/u)$, $u = 1/r$, the particle finally leaves`,
      options: [R`undeflected`, R`moving back opposite to its incoming direction (deflected by $180^\circ$)`, R`deflected by $90^\circ$`, R`spiralling into the centre`], answer: 1,
      sol: R`With $F = -cu^3$, the right side is $\mu cu/\ell^2$, so $u'' + (1 - \tfrac34)u = 0$: $u = A\cos(\beta\theta)$ with $\beta = \tfrac12$. The particle is at infinity ($u = 0$) when $\beta\theta = \pm\pi/2$, that is $\theta = \pm\pi$. It sweeps $2\pi$ in all: it comes in from the direction $\theta = -\pi$ and leaves towards $\theta = +\pi$, the same direction. So it goes back the way it came (on a parallel line), a $180^\circ$ deflection. A spiral needs $\mu c/\ell^2 > 1$.`,
      trap: R`Expecting capture whenever the force is attractive: with $\mu c < \ell^2$ the centrifugal term still wins at small $r$.` },
    { id: 'cfs-r5-08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'lab and CM frames',
      q: R`A proton (1 u) scatters elastically off a helium-3 nucleus (3 u) at rest. In the CM frame the scattering angle is $120^\circ$. The proton's scattering angle in the lab is ______ degrees.`,
      answer: 100.89, tol: 1, calc: () => labAngle(1, 3, 120), unit: '°',
      sol: R`$\tan\theta_{\rm lab} = \dfrac{\sin\Theta}{\cos\Theta + m_1/m_2} = \dfrac{0.8660}{-0.5 + 0.3333} = -5.196$. The denominator is negative, so the angle lies between $90^\circ$ and $180^\circ$: $\theta_{\rm lab} = 180^\circ - 79.11^\circ = 100.89^\circ$.`,
      trap: R`Taking the calculator's $\arctan(-5.196) = -79.1^\circ$ at face value: check the quadrant from the sign of the denominator.` },
    { id: 'cfs-r5-09', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Kepler orbits', format: 'statements',
      q: R`For a bound orbit of energy $E < 0$ in $U = -k/r$, averaged over one period, which statements are true?`,
      options: [R`$\langle U\rangle = 2E$`, R`$\langle T\rangle = -E$`, R`The period depends on the eccentricity at fixed $E$`, R`$\langle 1/r\rangle = 1/a$, where $a$ is the semi-major axis`], answer: [0, 1, 3],
      sol: R`The virial theorem for $U \propto r^{-1}$ gives $2\langle T\rangle = -\langle U\rangle$, so with $E = \langle T\rangle + \langle U\rangle$: $\langle U\rangle = 2E$ and $\langle T\rangle = -E$. Since $E = -k/2a$, $\langle U\rangle = -k\langle1/r\rangle = -k/a$, so $\langle1/r\rangle = 1/a$. The period $2\pi\sqrt{\mu a^3/k}$ depends only on $a$, hence only on $E$.`,
      trap: R`Expecting $\langle r\rangle = a$ too: in fact $\langle r\rangle = a(1 + e^2/2)$; it is $\langle1/r\rangle$ that equals $1/a$.` },
    { id: 'cfs-r5-10', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'orbital manoeuvres',
      q: R`A satellite moves on a circular orbit at 7.00 km/s. The smallest single boost along its velocity that lets it escape the planet completely is ______ km/s.`,
      answer: 2.9, tol: 0.03, calc: () => 7 * (Math.SQRT2 - 1), unit: 'km/s',
      sol: R`On a circle $v_c = \sqrt{GM/r}$ and the escape speed at the same radius is $\sqrt{2GM/r} = \sqrt2\,v_c$. A tangential boost uses the full change in kinetic energy, so the boost is $(\sqrt2 - 1)v_c = 0.414\times7.00 = 2.90$ km/s.`,
      trap: R`Answering 9.90 km/s (the escape speed itself) instead of the extra speed needed.` },
  ],
  gens: [
    { id: 'cfs-r5g1', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Rutherford scattering',
      make(r) {
        const a = int(r, 5, 40), th = choose(r, [20, 30, 40, 60, 90, 120, 150]);
        const answer = round(a / Math.tan(th / 2 / D), 3);
        return { q: R`In Rutherford scattering by a fixed nucleus with $k/2E = ${a}$ fm, find the impact parameter (fm) that gives a scattering angle of $${th}^\circ$.`,
          answer, tol: Math.max(0.01, answer * 0.01), unit: 'fm', a, th,
          sol: R`$b = \dfrac{k}{2E}\cot\dfrac\Theta2 = ${a}\cot${th / 2}^\circ = ${answer}$ fm.`,
          trap: 'The half-angle enters, not the full angle.' };
      },
      verify: (p) => p.a / Math.tan(p.th / 2 / D) },
    { id: 'cfs-r5g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'lab and CM frames',
      make(r) {
        const P = choose(r, [['A proton', 1], ['A neutron', 1], ['An alpha particle', 4], ['A deuteron', 2]]);
        const T = choose(r, [['carbon-12', 12], ['helium-4', 4], ['oxygen-16', 16], ['lithium-7', 7]]);
        const th = choose(r, [45, 60, 90, 120, 135, 150]);
        const answer = round(labAngle(P[1], T[1], th), 2);
        return { q: R`${P[0]} (${P[1]} u) scatters elastically off a ${T[0]} nucleus (${T[1]} u) at rest, with CM scattering angle $${th}^\circ$. Find the projectile's lab scattering angle in degrees.`,
          answer, tol: Math.max(0.2, answer * 0.01), unit: '°', m1: P[1], m2: T[1], th,
          sol: R`$\tan\theta_{\rm lab} = \dfrac{\sin\Theta}{\cos\Theta + m_1/m_2} = \dfrac{\sin${th}^\circ}{\cos${th}^\circ + ${round(P[1] / T[1], 4)}}$, taking the quadrant from the sign of the denominator: $\theta_{\rm lab} = ${answer}^\circ$.`,
          trap: 'When the denominator is negative the lab angle is above $90^\\circ$.' };
      },
      verify: (p) => labAngle(p.m1, p.m2, p.th) },
    { id: 'cfs-r5g3', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'apsidal angle',
      make(r) {
        const M = choose(r, [[-1.5, R`-C/r^{3/2}`], [-0.5, R`-C/\sqrt r`], [0.5, R`C\sqrt r`], [1, R`Cr`], [3, R`Cr^3`], [4, R`Cr^4`]]);
        const answer = round(180 / Math.sqrt(M[0] + 2), 2);
        return { q: R`A body moves on a nearly circular orbit in the attractive potential $U = ${M[1]}$ ($C > 0$). Find the apsidal angle in degrees.`,
          answer, tol: Math.max(0.2, answer * 0.01), unit: '°', m: M[0],
          sol: R`For $U \propto r^m$ the apsidal angle is $\pi/\sqrt{m + 2}$. Here $m = ${M[0]}$: $180^\circ/\sqrt{${M[0] + 2}} = ${answer}^\circ$.`,
          trap: 'Use the exponent of the potential, not of the force.' };
      },
      verify: (p) => 180 / Math.sqrt(p.m + 2) },
  ],
};
