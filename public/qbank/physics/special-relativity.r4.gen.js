// Round 4 extras for special-relativity: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;

// Speed (in units of c) at which the classical kinetic energy is a fraction f of the true one.
const classicalBeta = (f) => { let lo = 1e-4, hi = 0.999; for (let i = 0; i < 80; i++) { const b = (lo + hi) / 2, gm = 1 / Math.sqrt(1 - b * b); if ((0.5 * b * b) / (gm - 1) > f) lo = b; else hi = b; } return (lo + hi) / 2; };

export default {
  items: [
    { id: 'srl-r4-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'energy and momentum',
      q: R`For a given particle, which of these has the same value in every inertial frame?`,
      options: ['its total energy $E$', 'its momentum $p$', 'its kinetic energy', R`$E^2 - p^2c^2$`], answer: 3,
      sol: R`$E$ and $p$ are parts of the energy-momentum four-vector and change from frame to frame (in the particle's rest frame $p = 0$ and $E = mc^2$; elsewhere both are larger). The combination $E^2 - p^2c^2 = m^2c^4$ is the four-vector's "length", the same in every frame. The kinetic energy $E - mc^2$ changes along with $E$.`,
      trap: R`Energy is conserved in each frame, but that does not make it the same in different frames.` },
    { id: 'srl-r4-02', type: 'nat', level: 2, exams: ['jam'], sub: 'length contraction',
      q: R`A space station is 360 m long in its own frame. A ship flies along it at $0.6c$. Measured with the ship's clocks, the station takes ______ μs to pass the ship (take $c = 3\times10^8$ m/s).`,
      answer: 1.6, tol: 0.01, unit: 'μs', calc: () => (360 * 0.8) / (0.6 * 3e8) * 1e6,
      sol: R`In the ship's frame the station is the moving object, so it is contracted: $L = 360\sqrt{1 - 0.36} = 288$ m. It moves past at $0.6c = 1.8\times10^8$ m/s, taking $288/1.8\times10^8 = 1.6\times10^{-6}$ s $= 1.6$ μs. (Station clocks give $360/1.8\times10^8 = 2.0$ μs; the ship's single clock records the proper time, shorter by $\gamma = 1.25$.)`,
      trap: R`Dividing the station's own length by the speed gives the time on the station's clocks, not the ship's.` },
    { id: 'srl-r4-03', type: 'mcq', level: 3, exams: ['jam'], sub: 'velocity addition',
      q: R`Water (refractive index $n$) flows along a tube at speed $v \ll c$. Light travels along the tube in the direction of the flow. To first order in $v$, its speed measured in the laboratory is`,
      options: [R`$c/n + v$`, R`$c/n + v\left(1 - \dfrac{1}{n^2}\right)$`, R`$c$, by the second postulate`, R`$c/n$, unaffected by the flow`], answer: 1,
      sol: R`In the water's frame the light moves at $c/n$. Relativistic velocity addition: $u = \dfrac{c/n + v}{1 + v/(nc)} \approx \left(\dfrac cn + v\right)\left(1 - \dfrac{v}{nc}\right) \approx \dfrac cn + v - \dfrac{v}{n^2}$. The water "drags" the light only partly, by the fraction $1 - 1/n^2$ of its speed, as Fizeau measured in 1851.`,
      trap: R`The second postulate is about light in vacuum; light in a moving medium does not travel at $c$.` },
    { id: 'srl-r4-04', type: 'nat', level: 3, exams: ['jam'], sub: 'doppler effect',
      q: R`Laser light of wavelength 500 nm is sent to a mirror that moves directly away from the laser at $0.2c$, and is reflected straight back. The wavelength of the reflected light, measured at the laser, is ______ nm.`,
      answer: 750, tol: 0.5, unit: 'nm', calc: () => (500 * 1.2) / 0.8,
      sol: R`Two Doppler shifts. The receding mirror receives $\lambda_1 = \lambda\sqrt{\dfrac{1 + \beta}{1 - \beta}}$. It then re-emits that light as a source receding at $\beta$, so the laser receives $\lambda_2 = \lambda_1\sqrt{\dfrac{1 + \beta}{1 - \beta}} = \lambda\dfrac{1 + \beta}{1 - \beta} = 500\times\dfrac{1.2}{0.8} = 750$ nm.`,
      trap: R`One Doppler factor (612 nm) forgets that the mirror both receives and re-sends the light while moving.` },
    { id: 'srl-r4-05', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'energy and momentum', format: 'statements',
      q: R`Which statements about energy and momentum in special relativity are correct?`,
      options: [R`For a single particle, $E^2 - p^2c^2$ has the same value in every inertial frame`, 'In any collision, the sum of the rest masses of the particles is conserved', 'In any collision, the total energy and the total momentum are both conserved', 'The invariant mass of a system of particles always equals the sum of their rest masses'], answer: [0, 2],
      sol: R`$E^2 - p^2c^2 = m^2c^4$ is invariant. Total energy and momentum are conserved in every collision (in every frame). Rest mass is not additive: the invariant mass of a system, $\sqrt{(\sum E)^2 - (\sum\vec pc)^2}/c^2$, includes the kinetic energy in the centre-of-momentum frame, so it is larger than the sum of rest masses when the parts move relative to each other, and in an inelastic collision the sum of rest masses changes.`,
      trap: R`Energy conservation includes rest energy; rest mass alone is not conserved.` },
    { id: 'srl-r4-06', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'energy and momentum',
      q: R`At what speed is the classical kinetic energy $\tfrac12mv^2$ exactly 1% smaller than the true relativistic kinetic energy? Give $v/c$ to three decimal places.`,
      answer: 0.115, tol: 0.001, calc: () => classicalBeta(0.99),
      sol: R`We need $\dfrac{\tfrac12\beta^2}{\gamma - 1} = 0.99$. Expanding, $\gamma - 1 = \tfrac12\beta^2 + \tfrac38\beta^4 + \dots$, so the ratio is about $1 - \tfrac34\beta^2 = 0.99$, giving $\beta^2 = 0.0133$ and $\beta \approx 0.115$. Solving exactly confirms 0.115: Newtonian kinetic energy is good to 1% up to about 35 000 km/s.`,
      trap: R`Setting $\tfrac12\beta^2 = 0.01$ compares the kinetic energy with the rest energy, a different question.` },
    { id: 'srl-r4-07', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'aberration',
      q: R`A lamp moving at speed $\beta c$ along $+x$ sends out light equally in all directions in its own frame. In the laboratory, the half of the light sent into the forward hemisphere (in the lamp's frame) lies inside a cone about $+x$ of half-angle $\theta$, where`,
      options: [R`$\sin\theta = \beta$`, R`$\tan\theta = \beta$`, R`$\cos\theta = \beta$`, R`$\theta = 90^\circ$ for every speed`], answer: 2,
      sol: R`The aberration formula is $\cos\theta = \dfrac{\cos\theta' + \beta}{1 + \beta\cos\theta'}$. The edge of the forward hemisphere in the lamp's frame is $\theta' = 90^\circ$, which goes to $\cos\theta = \beta$. At $\beta = 0.8$ the forward half of the light is squeezed into a cone of half-angle $36.9^\circ$: the "headlight effect" of fast sources such as synchrotron electrons.`,
      trap: R`A photon sent sideways in the lamp's frame is tipped forward in the lab, so $90^\circ$ does not stay $90^\circ$.` },
    { id: 'srl-r4-08', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'decays',
      q: R`A free deuteron at rest (rest energy 1875.6 MeV) absorbs a 10.0 MeV photon. The kinetic energy of the resulting excited system is ______ keV (one decimal place).`,
      answer: 26.5, tol: 0.1, unit: 'keV', calc: () => { const m = 1875.6, E = 10; return (E + m - Math.sqrt(m * m + 2 * E * m)) * 1000; },
      sol: R`Invariant mass after absorption: $M^2c^4 = (E + mc^2)^2 - (pc)^2 = m^2c^4 + 2Emc^2$ (since $pc = E$ for the photon). $Mc^2 = \sqrt{1875.6^2 + 2\times10\times1875.6} = 1885.5735$ MeV. Kinetic energy $= (E + mc^2) - Mc^2 = 1885.6 - 1885.5735$ MeV $= 0.0265$ MeV $= 26.5$ keV. Check: $p^2/(2M) = 10^2/(2\times1885.6)$ MeV $= 26.5$ keV.`,
      trap: R`Not all of the photon's energy goes into internal (rest) energy: some must become kinetic energy to carry the photon's momentum.` },
    { id: 'srl-r4-09', type: 'msq', level: 2, exams: ['jam'], sub: 'time dilation', format: 'statements',
      q: R`Muons (mean life at rest 2.2 μs) circulate in a storage ring with Lorentz factor $\gamma = 30$, with a centripetal acceleration of about $10^{18}g$. Which statements are correct?`,
      options: ['Their mean life measured in the laboratory is about 66 μs', 'The huge acceleration changes their decay rate beyond the time-dilation factor', 'In a frame moving momentarily with a muon, its mean life is 2.2 μs', 'Time dilation does not apply, because the muons are not in uniform motion'], answer: [0, 2],
      sol: R`The lab is inertial, and a moving clock in it ticks slow by $\gamma$ at every instant, whatever the direction of its velocity: lab mean life $= 30\times2.2 = 66$ μs. Experiments of this kind confirm that acceleration itself does not change the rate of a good clock (the "clock hypothesis"): only the speed matters. In a momentary rest frame the muon decays with its proper mean life, 2.2 μs.`,
      trap: R`Special relativity handles accelerated clocks fine, as long as the observer's frame is inertial.` },
    { id: 'srl-r4-10', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'decays',
      q: R`A muon at rest ($m_\mu c^2 = 105.658$ MeV) decays as $\mu^- \to e^- + \bar\nu_e + \nu_\mu$, with massless neutrinos. Taking $m_ec^2 = 0.511$ MeV, the largest possible total energy of the electron is ______ MeV (two decimal places).`,
      answer: 52.83, tol: 0.02, unit: 'MeV', calc: () => (105.658 ** 2 + 0.511 ** 2) / (2 * 105.658),
      sol: R`The electron's energy is largest when the two neutrinos fly off together, opposite to it, so they act like one massless body (smallest possible invariant mass of the pair, zero). Then it is a two-body decay: $E_e = \dfrac{m_\mu^2 + m_e^2}{2m_\mu}c^2 = \dfrac{105.658^2 + 0.511^2}{2\times105.658} = 52.83$ MeV, just above half the muon's rest energy.`,
      trap: R`Letting the electron take all the energy (105.66 MeV) breaks momentum conservation.` },
  ],
  gens: [
    { id: 'srl-r4g1', type: 'nat', level: 3, exams: ['jam'], sub: 'doppler effect',
      make(r) {
        const b = choose(r, [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5]), lam = pick(r, 400, 700, 10), away = r() < 0.5;
        const f = away ? (1 + b) / (1 - b) : (1 - b) / (1 + b), answer = round(lam * f, 1);
        return { q: R`Light of wavelength ${lam} nm is sent to a mirror moving directly ${away ? 'away from' : 'towards'} the source at $${b}c$ and reflected straight back. Find the wavelength (nm) of the reflected light measured at the source.`,
          answer, tol: Math.max(0.2, answer * 0.002), unit: 'nm', lam, b, away: away ? 1 : 0,
          sol: R`The mirror receives one Doppler shift and re-emits as a moving source, adding a second: $\lambda' = \lambda\dfrac{1 ${away ? '+' : '-'} \beta}{1 ${away ? '-' : '+'} \beta} = ${lam}\times${round(f, 4)} = ${answer}$ nm.`,
          trap: 'Reflection from a moving mirror gives the Doppler factor twice.' };
      },
      verify: (p) => p.lam * (p.away ? (1 + p.b) / (1 - p.b) : (1 - p.b) / (1 + p.b)) },
    { id: 'srl-r4g2', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'decays',
      make(r) {
        const M = pick(r, 200, 2000, 50), m = pick(r, 10, Math.round(M * 0.4 / 10) * 10, 10);
        const answer = round((M * M + m * m) / (2 * M), 2);
        return { q: R`A particle of rest energy ${M} MeV, at rest, decays into a particle of rest energy ${m} MeV and two massless particles. Find the largest possible total energy (MeV) of the massive product.`,
          answer, tol: Math.max(0.02, answer * 0.001), unit: 'MeV', M, m,
          sol: R`The massive product gets the most energy when the two massless particles move together opposite to it, acting as one massless body. Then $E = \dfrac{M^2 + m^2}{2M} = \dfrac{${M}^2 + ${m}^2}{2\times${M}} = ${answer}$ MeV.`,
          trap: 'It cannot take all the energy: the massless pair must carry its opposite momentum.' };
      },
      verify: (p) => (p.M * p.M + p.m * p.m) / (2 * p.M) },
    { id: 'srl-r4g3', type: 'nat', level: 2, exams: ['jam'], sub: 'length contraction',
      make(r) {
        const L = pick(r, 100, 900, 20), b = choose(r, [0.28, 0.6, 0.8, 0.96, 0.5, 0.9]);
        const gm = 1 / Math.sqrt(1 - b * b), answer = round((L / gm / (b * 3e8)) * 1e6, 3);
        return { q: R`A space station ${L} m long (in its own frame) is passed by a ship moving along it at $${b}c$. How long (in μs) does the station take to pass the ship, measured by the ship's clock? (Take $c = 3\times10^8$ m/s.)`,
          answer, tol: Math.max(0.002, answer * 0.005), unit: 'μs', L, b,
          sol: R`In the ship's frame the station is contracted to $${L}\sqrt{1 - ${b}^2} = ${round(L / gm, 2)}$ m and moves at $${b}c$: $t = ${round(L / gm, 2)}/(${b}\times3\times10^8) = ${answer}$ μs.`,
          trap: 'The ship measures proper time, shorter than the station-frame time by the factor gamma.' };
      },
      verify: (p) => (p.L * Math.sqrt(1 - p.b * p.b)) / (p.b * 3e8) * 1e6 },
  ],
};
