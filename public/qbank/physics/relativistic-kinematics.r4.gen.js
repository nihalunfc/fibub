// Round 4 extras for relativistic-kinematics: original questions, written 2026-11-22.
import { pick, choose, round } from '../_util.js';
const R = String.raw;
const me = 0.51100;

export default {
  items: [
    { id: 'rk-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'time dilation',
      q: R`A particle moves at $0.6c$. Its Lorentz factor $\gamma$ is`,
      options: ['0.8', '1.6', '1.25', '1.67'], answer: 2,
      sol: R`$\gamma = \dfrac{1}{\sqrt{1 - \beta^2}} = \dfrac{1}{\sqrt{1 - 0.36}} = \dfrac{1}{0.8} = 1.25$.`,
      trap: R`$\sqrt{1 - \beta^2} = 0.8$ is $1/\gamma$; $\gamma$ is never below 1.` },
    { id: 'rk-r4-02', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'energy and momentum',
      q: R`A particle of mass 4 GeV/$c^2$ has momentum 3 GeV/$c$. Its kinetic energy is ______ GeV.`,
      answer: 1, tol: 0, calc: () => Math.sqrt(9 + 16) - 4, unit: 'GeV',
      sol: R`$E = \sqrt{(pc)^2 + (mc^2)^2} = \sqrt{9 + 16} = 5$ GeV. Kinetic energy $= E - mc^2 = 5 - 4 = 1$ GeV.`,
      trap: R`$p^2/2m = 9/8$ GeV is the Newtonian estimate, wrong at these speeds ($\beta = 0.6$).` },
    { id: 'rk-r4-03', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'energy and momentum',
      q: R`A particle's kinetic energy equals its rest energy. Its speed is`,
      options: [R`$\tfrac{\sqrt3}{2}c \approx 0.866c$`, R`$c/\sqrt2 \approx 0.707c$`, R`$0.5c$`, R`$\sqrt{2/3}\,c \approx 0.816c$`], answer: 0,
      sol: R`$(\gamma - 1)mc^2 = mc^2$ gives $\gamma = 2$, so $1 - \beta^2 = \tfrac14$ and $\beta = \sqrt3/2 \approx 0.866$.`,
      trap: R`The Newtonian $\tfrac12mv^2 = mc^2$ gives $v = \sqrt2\,c$, faster than light.` },
    { id: 'rk-r4-04', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'invariant mass',
      q: R`Two photons with energies $E_1$ and $E_2$ travel at an angle $\theta$ to each other. The square of their invariant mass energy, $(Mc^2)^2$, is`,
      options: [R`$2E_1E_2(1 + \cos\theta)$`, R`$(E_1 + E_2)^2$`, R`$E_1E_2\sin^2\theta$`, R`$2E_1E_2(1 - \cos\theta)$`], answer: 3,
      sol: R`$(Mc^2)^2 = (E_1 + E_2)^2 - |\mathbf p_1 + \mathbf p_2|^2c^2$ with $p_ic = E_i$: $= E_1^2 + 2E_1E_2 + E_2^2 - (E_1^2 + E_2^2 + 2E_1E_2\cos\theta) = 2E_1E_2(1 - \cos\theta)$. Check: parallel photons ($\theta = 0$) have zero mass; back-to-back ($\theta = \pi$) give $Mc^2 = 2\sqrt{E_1E_2}$.`,
      trap: R`The sign: parallel photons must give zero, which picks $1 - \cos\theta$.` },
    { id: 'rk-r4-05', type: 'msq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'simultaneity', format: 'statements',
      q: R`Which statements about the order of events in special relativity are correct?`,
      options: ['Two events that are simultaneous in a frame S but at different $x$ are not simultaneous in a frame moving along $x$', 'For two events with a timelike separation, all inertial observers agree which came first', 'Two events at the same place in S happen at the same place in every inertial frame', 'For two events with a spacelike separation, some inertial frame sees them in the opposite order'], answer: [0, 1, 3],
      sol: R`$\Delta t' = \gamma(\Delta t - v\Delta x/c^2)$. With $\Delta t = 0$ and $\Delta x \ne 0$, $\Delta t' \ne 0$. For timelike separation $|\Delta x| < c|\Delta t|$, so $v\Delta x/c^2$ can never outweigh $\Delta t$ (as $v < c$): the order is kept. For spacelike separation, any $v$ with $c^2\Delta t/\Delta x < v < c$ flips the sign. Events at the same place in S (e.g. two ticks of a clock at rest there) are at different places in a moving frame, $\Delta x' = -\gamma v\Delta t$.`,
      trap: R`"Same place" is as frame-dependent as "same time", unless the events also coincide in time.` },
    { id: 'rk-r4-06', type: 'msq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'two-body decays', format: 'statements',
      q: R`A particle of mass $M$ at rest decays into two particles of unequal masses $m_1 < m_2$. Which statements are correct?`,
      options: ['The two daughters move off with equal and opposite momenta', 'The energy of each daughter is fixed by the three masses alone', 'The heavier daughter carries more kinetic energy', 'The lighter daughter moves faster'], answer: [0, 1, 3],
      sol: R`Momentum conservation from rest: $\mathbf p_1 = -\mathbf p_2$. Energy: $E_1 + E_2 = Mc^2$ with $E_i^2 = p^2c^2 + m_i^2c^4$ fixes $E_1 = \dfrac{M^2 + m_1^2 - m_2^2}{2M}c^2$ (a two-body decay gives sharp energies). With the same $p$, the lighter particle has the larger kinetic energy $\sqrt{p^2c^2 + m^2c^4} - mc^2$ and the larger speed $v = pc^2/E$. Example: in $\pi \to \mu\nu$ the massless neutrino takes most of the kinetic energy.`,
      trap: R`Equal momenta, not equal energies: the light partner wins the kinetic energy.` },
    { id: 'rk-r4-07', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'time dilation', format: 'numeric',
      q: R`A traveller flies to a star 6 light-years away (in the Earth frame) at $0.6c$ and comes straight back at $0.8c$; ignore the time spent turning round. When she returns, she is younger than her stay-at-home twin by ______ years.`,
      answer: 5, tol: 0.05, calc: () => (6 / 0.6 + 6 / 0.8) - (6 / 0.6 * 0.8 + 6 / 0.8 * 0.6), unit: 'years',
      sol: R`Earth time: out $6/0.6 = 10$ y, back $6/0.8 = 7.5$ y, total 17.5 y. Traveller's proper time: $10/\gamma_1 + 7.5/\gamma_2 = 10\times0.8 + 7.5\times0.6 = 8 + 4.5 = 12.5$ y. Difference: 5.0 years. (The traveller is the one who changes inertial frame, so her clock reads less.)`,
      trap: R`Each leg has its own $\gamma$: $1/\gamma = 0.8$ at $0.6c$ but $0.6$ at $0.8c$.` },
    { id: 'rk-r4-08', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Lorentz transformations',
      q: R`Frame S′ moves at speed $u$ along $x$ relative to S, and frame S″ moves at speed $v$ along the $y'$ axis of S′. The transformation that takes S coordinates to S″ coordinates is`,
      options: ['a pure boost along the direction of the combined velocity', 'a boost combined with a rotation of the spatial axes', 'a pure rotation', 'not a Lorentz transformation at all'], answer: 1,
      sol: R`Lorentz transformations form a group, so the product is a Lorentz transformation. But two boosts in different directions do not combine into a pure boost: the product equals a boost along the relative velocity of S and S″ followed by a rotation (the Wigner rotation). This rotation is the origin of Thomas precession of a spinning particle moving on a curved path. Collinear boosts, in contrast, do combine into a pure boost (rapidities add).`,
      trap: R`Velocities "add" relativistically, but the axes of S and S″ end up rotated relative to each other.` },
    { id: 'rk-r4-09', type: 'mcq', level: 4, exams: ['jam', 'gate', 'net'], sub: 'length contraction',
      q: R`A rod at rest in frame S′ makes an angle $\theta_0$ with the $x'$ axis. S′ moves along $x$ at speed $v$ (Lorentz factor $\gamma$) relative to S. In S the rod makes an angle $\theta$ with the $x$ axis given by`,
      options: [R`$\tan\theta = \tan\theta_0/\gamma$`, R`$\theta = \theta_0$`, R`$\tan\theta = \gamma\tan\theta_0$`, R`$\sin\theta = \gamma\sin\theta_0$`], answer: 2,
      sol: R`Only lengths along the motion contract: $\Delta x = \Delta x'/\gamma$ while $\Delta y = \Delta y'$ (measuring both ends at the same S time). So $\tan\theta = \dfrac{\Delta y}{\Delta x} = \gamma\dfrac{\Delta y'}{\Delta x'} = \gamma\tan\theta_0$: the moving rod looks steeper (more nearly perpendicular to the motion), and shorter.`,
      trap: R`Dividing by $\gamma$ contracts the wrong component; the transverse length is unchanged.` },
    { id: 'rk-r4-10', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'velocity addition', format: 'numeric',
      q: R`In the lab, one particle moves at $0.6c$ along $x$ and another at $0.6c$ along $y$. The speed of either particle as measured in the rest frame of the other is ______ $c$ (to three decimal places).`,
      answer: 0.768, tol: 0.003, calc: () => Math.sqrt(1 - 1 / 1.5625 ** 2),
      sol: R`Use the invariant $U_1\cdot U_2 = \gamma_{\rm rel}c^2$. In the lab, $U_1\cdot U_2 = \gamma_1\gamma_2c^2(1 - \boldsymbol\beta_1\cdot\boldsymbol\beta_2) = 1.25^2\times(1 - 0) = 1.5625$ (in units of $c^2$). So $\gamma_{\rm rel} = 1.5625$ and $\beta_{\rm rel} = \sqrt{1 - 1/1.5625^2} = \sqrt{0.5904} = 0.768$.`,
      trap: R`The Newtonian $\sqrt{0.6^2 + 0.6^2} = 0.849$ overestimates; relativistic velocities do not add as vectors.` },
    { id: 'rk-r4-11', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'decays in flight',
      q: R`A neutral pion moving at speed $\beta c$ decays into two photons. Over all possible decay orientations, the ratio of the largest to the smallest photon energy that can be seen in the lab is`,
      options: [R`$\dfrac{1 + \beta}{1 - \beta}$`, R`$\gamma^2$`, R`$\sqrt{\dfrac{1 + \beta}{1 - \beta}}$`, R`$1 + \beta$`], answer: 0,
      sol: R`In the pion rest frame each photon has energy $mc^2/2$. Boosting, a photon emitted at angle $\theta^*$ to the motion has lab energy $E = \gamma\tfrac{mc^2}{2}(1 + \beta\cos\theta^*)$. The largest is at $\theta^* = 0$, $\gamma\tfrac{mc^2}2(1 + \beta)$, the smallest at $\theta^* = \pi$, $\gamma\tfrac{mc^2}2(1 - \beta)$. Ratio $\dfrac{1 + \beta}{1 - \beta}$. (Photon energies are spread evenly between these limits.)`,
      trap: R`$\sqrt{(1 + \beta)/(1 - \beta)}$ is the Doppler factor for one photon compared with the rest frame; the ratio of the forward to the backward photon is its square.` },
    { id: 'rk-r4-12', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'annihilation', format: 'numeric',
      q: R`A positron with kinetic energy 1.000 MeV annihilates with an electron at rest ($m_ec^2 = 0.511$ MeV), giving two photons that travel along the positron's original line of motion. The energy of the forward-going photon is ______ MeV (to three decimal places).`,
      answer: 1.722, tol: 0.003, calc: () => { const E = 1 + 2 * 0.511, p = Math.sqrt(1.511 ** 2 - 0.511 ** 2); return (E + p) / 2; }, unit: 'MeV',
      sol: R`Total energy $E = 1.000 + 2\times0.511 = 2.022$ MeV. The positron's $pc = \sqrt{1.511^2 - 0.511^2} = \sqrt{2.022} = 1.422$ MeV. Photons along the line: $E_f + E_b = 2.022$ and $E_f - E_b = 1.422$ (momentum, the backward photon counting negative). So $E_f = (2.022 + 1.422)/2 = 1.722$ MeV and $E_b = 0.300$ MeV.`,
      trap: R`Assuming equal photon energies (1.011 MeV each) works only when the pair is at rest.` },
  ],
  gens: [
    { id: 'rk-r4g1', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'velocity addition',
      make(r) {
        const b1 = pick(r, 0.3, 0.9, 0.1), b2 = pick(r, 0.3, 0.9, 0.1), th = choose(r, [60, 90, 120, 180]);
        const g1 = 1 / Math.sqrt(1 - b1 * b1), g2 = 1 / Math.sqrt(1 - b2 * b2), grel = g1 * g2 * (1 - b1 * b2 * Math.cos(th * Math.PI / 180));
        const answer = round(Math.sqrt(1 - 1 / (grel * grel)), 4);
        return { q: R`In the lab, particle A moves at $${b1}c$ and particle B at $${b2}c$, their velocities making an angle of ${th}°. Find the speed of B in the rest frame of A, as a fraction of $c$.`,
          answer, tol: Math.max(0.002, answer * 0.005), b1, b2, th,
          sol: R`$\gamma_{\rm rel} = \dfrac{U_A\cdot U_B}{c^2} = \gamma_A\gamma_B(1 - \beta_A\beta_B\cos\theta) = ${round(g1, 4)}\times${round(g2, 4)}\times(1 - ${b1}\times${b2}\times${round(Math.cos(th * Math.PI / 180), 4)}) = ${round(grel, 4)}$. So $\beta_{\rm rel} = \sqrt{1 - 1/\gamma_{\rm rel}^2} = ${answer}$.`,
          trap: 'The product of four-velocities is the same in every frame; in the rest frame of A it is just $\\gamma_{\\rm rel}c^2$.' };
      },
      verify: (p) => { const g1 = 1 / Math.sqrt(1 - p.b1 * p.b1), g2 = 1 / Math.sqrt(1 - p.b2 * p.b2), gr = g1 * g2 * (1 - p.b1 * p.b2 * Math.cos(p.th * Math.PI / 180)); return Math.sqrt(1 - 1 / (gr * gr)); } },
    { id: 'rk-r4g2', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'time dilation',
      make(r) {
        const D = choose(r, [3, 4, 6, 8, 10, 12]), b1 = choose(r, [0.6, 0.8, 0.28, 0.96]), b2 = choose(r, [0.6, 0.8, 0.28, 0.96]);
        const inv = (b) => Math.sqrt(1 - b * b), t1 = D / b1, t2 = D / b2, answer = round(t1 + t2 - t1 * inv(b1) - t2 * inv(b2), 3);
        return { q: R`A traveller flies to a star ${D} light-years away (Earth frame) at $${b1}c$ and returns at $${b2}c$, turning round instantly. By how many years is she younger than her twin who stayed on Earth?`,
          answer, tol: Math.max(0.02, answer * 0.005), unit: 'years', D, b1, b2,
          sol: R`Earth time: $${D}/${b1} + ${D}/${b2} = ${round(t1 + t2, 3)}$ y. Traveller's time: $${round(t1, 3)}\times${round(inv(b1), 4)} + ${round(t2, 3)}\times${round(inv(b2), 4)} = ${round(t1 * inv(b1) + t2 * inv(b2), 3)}$ y. Difference: ${answer} years.`,
          trap: 'Use $1/\\gamma$ of each leg separately.' };
      },
      verify: (p) => { const i = (b) => Math.sqrt(1 - b * b), t1 = p.D / p.b1, t2 = p.D / p.b2; return t1 + t2 - t1 * i(p.b1) - t2 * i(p.b2); } },
    { id: 'rk-r4g3', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'annihilation',
      make(r) {
        const T = pick(r, 0.2, 5, 0.1), fwd = choose(r, [true, false]);
        const E = T + 2 * me, pc = Math.sqrt((T + me) ** 2 - me * me), answer = round((E + (fwd ? pc : -pc)) / 2, 4);
        return { q: R`A positron with kinetic energy ${T} MeV annihilates with an electron at rest ($m_ec^2 = 0.511$ MeV) into two photons that move along the positron's line of motion. Find the energy (MeV) of the ${fwd ? 'forward' : 'backward'}-going photon.`,
          answer, tol: Math.max(0.002, answer * 0.003), unit: 'MeV', T, fwd,
          sol: R`Total energy $E = ${T} + 2\times0.511 = ${round(E, 4)}$ MeV; positron $pc = \sqrt{${round(T + me, 4)}^2 - 0.511^2} = ${round(pc, 4)}$ MeV. Then $E_f + E_b = ${round(E, 4)}$ and $E_f - E_b = ${round(pc, 4)}$, so $E_f = ${round((E + pc) / 2, 4)}$ MeV and $E_b = ${round((E - pc) / 2, 4)}$ MeV.`,
          trap: 'The photons share energy equally only when the pair is at rest.' };
      },
      verify: (p) => { const E = p.T + 2 * me, pc = Math.sqrt((p.T + me) ** 2 - me * me); return (E + (p.fwd ? pc : -pc)) / 2; } },
  ],
};
