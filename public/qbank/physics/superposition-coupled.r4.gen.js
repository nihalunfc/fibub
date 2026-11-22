// Round 4 extras for superposition-coupled: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'spc-r4-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'adding SHMs',
      q: R`Two SHMs along the same line have equal amplitude $A$ and equal frequency, and differ in phase by $2\pi/3$. The amplitude of the resultant motion is`,
      options: [R`$A$`, R`$2A$`, R`$\sqrt3A$`, R`$0$`], answer: 0,
      sol: R`$A_R^2 = A^2 + A^2 + 2A^2\cos(2\pi/3) = 2A^2 - A^2 = A^2$, so $A_R = A$. With phasors: two arrows of length $A$ at $120^\circ$ add to an arrow of length $A$ (they form two sides of an equilateral triangle).`,
      trap: R`$\sqrt3A$ comes from using $\cos(\pi/3)$, a phase difference of $60^\circ$ instead of $120^\circ$.` },
    { id: 'spc-r4-02', type: 'mcq', level: 2, exams: ['jam'], sub: 'coupled pendulums',
      q: R`Two identical pendulums are joined by a light spring between their bobs. They are pulled aside by equal amounts in opposite directions and released together. What happens?`,
      options: ['Energy passes back and forth between them at the beat frequency', 'They swing at the uncoupled frequency $\\sqrt{g/l}$ for ever', 'They keep swinging in antiphase with equal amplitudes, at the higher normal-mode frequency, with no exchange of energy', 'The motion dies out quickly because the spring absorbs the energy'], answer: 2,
      sol: R`Equal and opposite displacements are exactly the antisymmetric normal mode, in which the spring is stretched and compressed every swing, adding to the restoring force: $\omega = \sqrt{g/l + 2k/m}$. A single normal mode keeps its shape for ever, so no energy is exchanged. Energy exchange (beats) happens only when both modes are excited, as when one pendulum alone is pulled aside.`,
      trap: R`Coupled systems exchange energy only when more than one mode is present.` },
    { id: 'spc-r4-03', type: 'msq', level: 2, exams: ['jam'], sub: 'adding SHMs', format: 'statements',
      q: R`Which of these displacements describe simple harmonic motion (about some fixed point)?`,
      options: [R`$x = 3\sin\omega t + 4\cos\omega t$`, R`$x = \sin^2\omega t$`, R`$x = \sin\omega t + \sin2\omega t$`, R`$x = \sin\omega t\cos\omega t$`], answer: [0, 1, 3],
      sol: R`$3\sin\omega t + 4\cos\omega t = 5\sin(\omega t + \phi)$: SHM of amplitude 5. $\sin^2\omega t = \tfrac12 - \tfrac12\cos2\omega t$: SHM about $x = \tfrac12$ with amplitude $\tfrac12$ and angular frequency $2\omega$. $\sin\omega t\cos\omega t = \tfrac12\sin2\omega t$: SHM at $2\omega$. But $\sin\omega t + \sin2\omega t$ contains two different frequencies; it is periodic (period $2\pi/\omega$) but not simple harmonic, since $\ddot x \ne -(\text{const})\,x$.`,
      trap: R`Squares and products of sines can still be SHM at twice the frequency; sums of different frequencies never are.` },
    { id: 'spc-r4-04', type: 'nat', level: 2, exams: ['jam'], sub: 'periodic motion',
      q: R`A displacement is $x = 2\sin(3\pi t) + 3\cos(5\pi t)$ with $t$ in seconds. Its period is ______ s.`,
      answer: 2, tol: 0, calc: () => 1 / 0.5, unit: 's',
      sol: R`The two terms have frequencies $3\pi/2\pi = 1.5$ Hz and $5\pi/2\pi = 2.5$ Hz, periods $\tfrac23$ s and $\tfrac25$ s. The sum repeats after the least common multiple of the periods, which is the reciprocal of the highest common factor of the frequencies: HCF$(1.5, 2.5) = 0.5$ Hz, so the period is 2 s (3 cycles of the first term and 5 of the second).`,
      trap: R`Taking the longer of the two periods ($\tfrac23$ s) ignores that the second term must also complete whole cycles.` },
    { id: 'spc-r4-05', type: 'mcq', level: 3, exams: ['jam'], sub: 'energy',
      q: R`A particle is moved by two SHMs along one line, $x_1 = A\sin\omega t$ and $x_2 = B\sin(\omega t + \phi)$. The energy of the combined motion equals the sum of the energies the two motions would have separately when`,
      options: [R`$\phi = 0$`, R`$\phi = \pi$`, R`for every $\phi$, since energy always adds`, R`$\phi = \pi/2$ (or $3\pi/2$)`], answer: 3,
      sol: R`The energy is proportional to the square of the resultant amplitude: $A_R^2 = A^2 + B^2 + 2AB\cos\phi$. It equals $A^2 + B^2$ only when $\cos\phi = 0$. In phase the energy is larger than the sum (constructive), in antiphase smaller (destructive). Displacements add; energies add only for "orthogonal" (quadrature) motions.`,
      trap: R`Superposition adds displacements, not energies.` },
    { id: 'spc-r4-06', type: 'mcq', level: 3, exams: ['jam'], sub: 'circular and linear motion',
      q: R`Can the linear SHM $\mathbf r = A\cos\omega t\,\hat x$ be written as a superposition of uniform circular motions?`,
      options: ['No: circular motion is made from SHMs, but not the other way round', 'Yes: it is the sum of two circular motions of radius $A/2$, at angular speed $\\omega$, turning in opposite senses', 'Yes: it is the sum of two circular motions of radius $A$ turning in the same sense', 'Only in the limit $\\omega \\to 0$'], answer: 1,
      sol: R`$\tfrac A2(\cos\omega t, \sin\omega t)$ turns anticlockwise and $\tfrac A2(\cos\omega t, -\sin\omega t)$ clockwise. Their sum is $(A\cos\omega t, 0)$: the $y$ parts cancel and the $x$ parts add. The same idea writes linearly polarised light as the sum of two circularly polarised waves.`,
      trap: R`Two motions turning the same way add to a bigger circle, not a line.` },
    { id: 'spc-r4-07', type: 'nat', level: 3, exams: ['jam'], sub: 'adding SHMs', format: 'numeric',
      q: R`Four SHMs along one line, each of amplitude 2 cm and the same frequency, have phases $0, \pi/3, 2\pi/3$ and $\pi$. The amplitude of the resultant motion is ______ cm (to two decimal places).`,
      answer: 3.46, tol: 0.02, calc: () => 2 * Math.sin(2 * Math.PI / 3) / Math.sin(Math.PI / 6), unit: 'cm',
      sol: R`Phasors of equal length $a$ with successive phase step $\delta$ add to $a\dfrac{\sin(N\delta/2)}{\sin(\delta/2)}$. Here $N = 4$, $\delta = \pi/3$: $2\times\dfrac{\sin(2\pi/3)}{\sin(\pi/6)} = 2\times\dfrac{0.866}{0.5} = 3.46$ cm. Check by pairs: phases $0$ and $\pi$ cancel; $\pi/3$ and $2\pi/3$ add to $2\times2\cos(\pi/6) = 3.46$ cm.`,
      trap: R`Adding the amplitudes (8 cm) ignores the phases; two of the four motions cancel each other completely.` },
    { id: 'spc-r4-08', type: 'nat', level: 3, exams: ['jam'], sub: 'two-body oscillations', format: 'numeric',
      q: R`Two 1 kg blocks rest on a smooth floor, joined by a light spring of stiffness 200 N/m at its natural length. One block is suddenly given a speed of 2 m/s along the spring, towards the other. The largest compression of the spring is ______ cm.`,
      answer: 10, tol: 0.1, calc: () => 100 * 2 * Math.sqrt(0.5 / 200), unit: 'cm',
      sol: R`Momentum is conserved, so the centre of mass keeps moving at 1 m/s, carrying $\tfrac12(2)(1)^2 = 1$ J that the spring cannot take. The rest, $\tfrac12\mu v_0^2$ with reduced mass $\mu = 0.5$ kg, is $\tfrac12(0.5)(2)^2 = 1$ J. At maximum compression both blocks move together at 1 m/s, so $\tfrac12kx^2 = 1$ J and $x = \sqrt{2/200} = 0.1$ m $= 10$ cm.`,
      trap: R`Putting all 2 J into the spring gives 14.1 cm; the motion of the centre of mass keeps half the energy.` },
    { id: 'spc-r4-09', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'coupled pendulums',
      q: R`Three identical pendulums hang in a row; neighbours are joined by identical weak springs. The normal modes have amplitude patterns $(1, 1, 1)$, $(1, 0, -1)$ and $(1, -2, 1)$. If only the middle pendulum is pulled aside and released, which modes are excited?`,
      options: ['all three modes', 'only $(1, 1, 1)$ and $(1, -2, 1)$', 'only $(1, 0, -1)$', 'only $(1, -2, 1)$'], answer: 1,
      sol: R`Write the start $(0, 1, 0)$ as a sum of the modes: $(0, 1, 0) = \tfrac13(1, 1, 1) - \tfrac16(1, -2, 1)$ (check: middle $\tfrac13 + \tfrac13 = 1$; ends $\tfrac13 - \tfrac16 - \tfrac16 = 0$). The mode $(1, 0, -1)$ has zero overlap with $(0, 1, 0)$, so it is never excited. As a result the two outer pendulums always move identically, as the left-right symmetry of the start requires.`,
      trap: R`A symmetric start cannot excite an antisymmetric mode.` },
    { id: 'spc-r4-10', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'beats', format: 'statements',
      q: R`Two SHMs $A\cos\omega_1t$ and $A\cos\omega_2t$ with $\omega_1$ close to $\omega_2$ are added (as for two tuning forks, $f = \omega/2\pi$). Which statements are correct?`,
      options: [R`The sum equals $2A\cos\left(\tfrac{\omega_1 - \omega_2}{2}t\right)\cos\left(\tfrac{\omega_1 + \omega_2}{2}t\right)$`, R`The loudness rises and falls $|f_1 - f_2|$ times per second`, R`Instants of zero amplitude are $2\pi/|\omega_1 - \omega_2|$ apart`, R`The loudness rises and falls $|f_1 - f_2|/2$ times per second`], answer: [0, 1, 2],
      sol: R`The identity $\cos a + \cos b = 2\cos\tfrac{a - b}{2}\cos\tfrac{a + b}{2}$ gives the first form: a fast oscillation at the mean frequency inside a slow envelope $2A\cos(\Delta\omega\,t/2)$. The loudness follows the size of the envelope, $|\cos(\Delta\omega\,t/2)|$, which repeats every $2\pi/\Delta\omega$: that is $|f_1 - f_2|$ maxima per second, and the zeros are $2\pi/\Delta\omega$ apart.`,
      trap: R`The envelope's cosine has frequency $|f_1 - f_2|/2$, but its magnitude peaks twice per cycle, so the beat frequency is $|f_1 - f_2|$.` },
    { id: 'spc-r4-11', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'perpendicular SHMs', format: 'numeric',
      q: R`A point moves with $x = A\cos\omega t$ and $y = A\cos(\omega t + \pi/3)$. Its path is an ellipse; the ratio of its major axis to its minor axis is ______ (to two decimal places).`,
      answer: 1.73, tol: 0.01, calc: () => 1 / Math.tan(Math.PI / 6),
      sol: R`Rotate the axes by $45^\circ$: $u = (x + y)/\sqrt2 = \sqrt2A\cos(\phi/2)\cos(\omega t + \phi/2)$ and $v = (x - y)/\sqrt2 = \sqrt2A\sin(\phi/2)\sin(\omega t + \phi/2)$. These are SHMs in quadrature along perpendicular axes, so the ellipse has semi-axes $\sqrt2A\cos(\phi/2)$ and $\sqrt2A\sin(\phi/2)$, along the lines $y = \pm x$. Ratio $= \cot(\phi/2) = \cot30^\circ = 1.73$.`,
      trap: R`The axes of the ellipse lie along $y = \pm x$, not along $x$ and $y$; the semi-axes are not $A$.` },
    { id: 'spc-r4-12', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'coupled pendulums', format: 'numeric',
      q: R`Two identical pendulums, each 1.00 m long, are joined by a weak spring between the bobs. When one is set swinging, it comes to rest (all its energy in the other) every 20.0 s. Taking $g = 9.8$ m/s², the coupling $k/m$ is ______ s⁻² (to two decimal places).`,
      answer: 1.03, tol: 0.01, calc: () => ((Math.sqrt(9.8) + 2 * Math.PI / 20) ** 2 - 9.8) / 2, unit: 's⁻²',
      sol: R`The motion of the first pendulum is $A\cos(\tfrac12\Delta\omega\,t)\cos(\bar\omega t)$; its envelope vanishes every $2\pi/\Delta\omega$. So $\Delta\omega = 2\pi/20 = 0.3142$ rad/s. The modes are $\omega_1 = \sqrt{g/l} = 3.1305$ rad/s and $\omega_2 = \sqrt{g/l + 2k/m} = 3.4447$ rad/s. Then $2k/m = 3.4447^2 - 9.8 = 2.066$, so $k/m = 1.03$ s⁻².`,
      trap: R`Treating 20 s as half the exchange cycle doubles $\Delta\omega$; the pendulum stops once per $2\pi/\Delta\omega$.` },
  ],
  gens: [
    { id: 'spc-r4g1', type: 'nat', level: 3, exams: ['jam'], sub: 'adding SHMs',
      make(r) {
        const N = int(r, 3, 6), [dTex, d] = choose(r, [['\\pi/6', Math.PI / 6], ['\\pi/4', Math.PI / 4], ['\\pi/3', Math.PI / 3], ['\\pi/2', Math.PI / 2]]), a = pick(r, 1, 5, 0.5);
        const v = Math.abs(a * Math.sin(N * d / 2) / Math.sin(d / 2)), answer = round(v < 1e-9 ? 0 : v, 3);
        return { q: R`${N} SHMs along one line, each of amplitude ${a} cm and the same frequency, have phases $0, ${dTex}, 2(${dTex}), \dots$ (each ahead of the last by $${dTex}$). Find the amplitude of the resultant motion in cm.`,
          answer, tol: Math.max(0.01, answer * 0.01), unit: 'cm', N, d, a,
          sol: R`Equal phasors with a constant step $\delta$ add to $a\left|\dfrac{\sin(N\delta/2)}{\sin(\delta/2)}\right| = ${a}\times\left|\dfrac{\sin(${N}\times${dTex}/2)}{\sin(${dTex}/2)}\right| = ${answer}$ cm. (The phasors form part of a regular polygon.)`,
          trap: 'Adding the amplitudes directly ignores the phase steps.' };
      },
      verify: (p) => Math.abs(p.a * Math.sin(p.N * p.d / 2) / Math.sin(p.d / 2)) },
    { id: 'spc-r4g2', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'perpendicular SHMs',
      make(r) {
        const deg = choose(r, [30, 45, 60, 120, 135, 150]), A = pick(r, 2, 6, 1), want = choose(r, ['major', 'minor']);
        const h = deg * Math.PI / 360, s1 = Math.SQRT2 * A * Math.cos(h), s2 = Math.SQRT2 * A * Math.sin(h);
        const answer = round(want === 'major' ? Math.max(s1, s2) : Math.min(s1, s2), 3);
        return { q: R`A point moves with $x = ${A}\cos\omega t$ and $y = ${A}\cos(\omega t + ${deg}^\circ)$ (cm). Find the length of the ${want} semi-axis of its elliptical path (cm).`,
          answer, tol: Math.max(0.01, answer * 0.01), unit: 'cm', deg, A, want,
          sol: R`Along the diagonals: $u = (x + y)/\sqrt2$ has amplitude $\sqrt2A\cos(\phi/2) = ${round(s1, 3)}$ cm and $v = (x - y)/\sqrt2$ has amplitude $\sqrt2A\sin(\phi/2) = ${round(s2, 3)}$ cm, a quarter cycle out of step, so these are the semi-axes. The ${want} one is ${answer} cm.`,
          trap: 'The ellipse is tilted at $45^\\circ$; its semi-axes are not the amplitudes $A$ along $x$ and $y$.' };
      },
      verify: (p) => { const h = p.deg * Math.PI / 360, a = Math.SQRT2 * p.A * Math.cos(h), b = Math.SQRT2 * p.A * Math.sin(h); return p.want === 'major' ? Math.max(a, b) : Math.min(a, b); } },
    { id: 'spc-r4g3', type: 'nat', level: 3, exams: ['jam'], sub: 'two-body oscillations',
      make(r) {
        const m1 = pick(r, 0.5, 3, 0.5), m2 = pick(r, 0.5, 3, 0.5), k = int(r, 2, 20) * 50, v = pick(r, 0.5, 4, 0.5);
        const mu = m1 * m2 / (m1 + m2), answer = round(100 * v * Math.sqrt(mu / k), 3);
        return { q: R`Blocks of ${m1} kg and ${m2} kg rest on a smooth floor, joined by a light spring (${k} N/m) at its natural length. The first (${m1} kg) block is suddenly given ${v} m/s towards the other. Find the largest compression of the spring in cm.`,
          answer, tol: Math.max(0.05, answer * 0.01), unit: 'cm', m1, m2, k, v,
          sol: R`The centre of mass keeps its kinetic energy; only the relative-motion energy $\tfrac12\mu v^2$ with $\mu = \dfrac{m_1m_2}{m_1 + m_2} = ${round(mu, 4)}$ kg can go into the spring. At maximum compression the blocks move together, so $\tfrac12kx^2 = \tfrac12\mu v^2$ and $x = v\sqrt{\mu/k} = ${answer}$ cm.`,
          trap: 'At maximum compression the blocks still move (together); their kinetic energy is not zero.' };
      },
      verify: (p) => { const mu = p.m1 * p.m2 / (p.m1 + p.m2); return 100 * p.v * Math.sqrt(mu / p.k); } },
  ],
};
