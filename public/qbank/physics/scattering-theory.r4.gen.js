// Round 4 extras for scattering-theory: original questions, written 2026-11-22.
import { choose, round } from '../_util.js';
const R = String.raw;
const E2 = 1.44; // e^2 / 4 pi eps0 in MeV fm
const deg = Math.PI / 180;

export default {
  items: [
    { id: 'netsc-r4-01', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'cross-section',
      q: R`In a scattering experiment the incident beam flux is doubled while everything else stays the same. The differential cross-section $d\sigma/d\Omega$`,
      options: [R`is unchanged, while the counting rate doubles`, R`doubles`, R`halves`, R`is unchanged, and so is the counting rate`], answer: 0,
      sol: R`By definition, counts per second into $d\Omega$ $=$ (incident flux) $\times\,\dfrac{d\sigma}{d\Omega}\,d\Omega$ (per target particle). $d\sigma/d\Omega$ is a property of the projectile-target interaction alone; doubling the flux doubles the counts.`,
      trap: R`Treating the cross-section as a measured rate rather than a rate per unit flux.` },
    { id: 'netsc-r4-02', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'Coulomb scattering',
      q: R`For Rutherford scattering at a fixed angle, the differential cross-section depends on the kinetic energy $E$ of the projectile as`,
      options: [R`$\propto E$`, R`$\propto 1/E$`, R`$\propto 1/E^2$`, R`independent of $E$`], answer: 2,
      sol: R`$\dfrac{d\sigma}{d\Omega} = \left(\dfrac{zZe^2}{16\pi\varepsilon_0E}\right)^2\dfrac{1}{\sin^4(\theta/2)}$: the length scale is the distance of closest approach $\propto 1/E$, and the cross-section is its square. Faster particles are deflected less.`,
      trap: R`Remembering the $\sin^{-4}$ but forgetting that the prefactor is squared.` },
    { id: 'netsc-r4-03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'kinematics',
      q: R`A proton scatters elastically from a carbon-12 nucleus at rest (mass ratio $1/12$). If its centre-of-mass scattering angle is $90^\circ$, its laboratory scattering angle is ______ degrees (one decimal place).`,
      answer: 85.2, tol: 0.2, unit: 'degrees', calc: () => Math.atan2(1, 1 / 12) / deg,
      sol: R`$\tan\theta_{\rm lab} = \dfrac{\sin\theta_{\rm cm}}{\cos\theta_{\rm cm} + m_1/m_2} = \dfrac{1}{0 + 1/12} = 12$, so $\theta_{\rm lab} = 85.2^\circ$. A light projectile on a heavy target sees almost the same angle in both frames; for equal masses $\theta_{\rm lab} = \theta_{\rm cm}/2 = 45^\circ$.`,
      trap: R`Using the equal-mass rule $\theta_{\rm cm}/2$ for unequal masses.` },
    { id: 'netsc-r4-04', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'Coulomb scattering',
      q: R`A $5.0$ MeV alpha particle heads straight for a gold nucleus ($Z = 79$). Ignoring the recoil of the nucleus, its distance of closest approach is ______ fm (one decimal place). Use $e^2/4\pi\varepsilon_0 = 1.44$ MeV fm.`,
      answer: 45.5, tol: 0.3, unit: 'fm', calc: () => 2 * 79 * E2 / 5,
      sol: R`At the turning point all kinetic energy is Coulomb energy: $E = \dfrac{zZe^2}{4\pi\varepsilon_0d}$, so $d = \dfrac{2\times79\times1.44}{5.0} = 45.5$ fm. This is far outside the gold nucleus (radius about 7 fm), which is why Rutherford's formula worked: the alpha never touched the nuclear force.`,
      trap: R`Forgetting the alpha's charge $z = 2$ halves the answer.` },
    { id: 'netsc-r4-05', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'scattering length', format: 'statements',
      q: R`Neutrons of very low energy scatter from a short-range potential. Which statements are correct?`,
      options: [R`$\sigma_{\rm tot} \to 4\pi a^2$, where $a$ is the scattering length`, R`The angular distribution is isotropic`, R`The cross-section becomes independent of energy`, R`The sign of $a$ can be read off from $\sigma_{\rm tot}$`], answer: [0, 1, 2],
      sol: R`As $k \to 0$ only $l = 0$ survives (higher waves go as $k^{2l}$), with $\delta_0 \approx -ka$. Then $f = -a$, isotropic, and $\sigma = 4\pi a^2$, a constant. Since $\sigma$ depends on $a^2$, its sign (attractive with a bound state versus without, for example) needs interference, such as coherent scattering from crystals or molecules.`,
      trap: R`$4\pi a^2$ cannot tell $+a$ from $-a$.` },
    { id: 'netsc-r4-06', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Born approximation',
      q: R`For the potential $V = \beta/r^2$, the first Born approximation gives $d\sigma/d\Omega$ proportional to`,
      options: [R`$1/\sin^4(\theta/2)$`, R`$1/\sin^2(\theta/2)$`, R`a constant (isotropic)`, R`$e^{-\sin^2(\theta/2)}$`], answer: 1,
      sol: R`For a central potential $f_B = -\dfrac{2m}{\hbar^2q}\int_0^\infty rV(r)\sin(qr)\,dr$. With $V = \beta/r^2$: $\int_0^\infty\dfrac{\sin qr}{r}dr = \dfrac\pi2$, so $f_B = -\dfrac{\pi m\beta}{\hbar^2q}$ and $\dfrac{d\sigma}{d\Omega} \propto \dfrac{1}{q^2} = \dfrac{1}{4k^2\sin^2(\theta/2)}$. Each extra power of $1/r$ in $V$ (for these power laws) adds two powers of $1/q$; Coulomb's $1/r$ gives $1/q^4$.`,
      trap: R`Copying the Rutherford $\sin^{-4}$ law, which belongs to $1/r$.` },
    { id: 'netsc-r4-07', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'partial waves', format: 'statements',
      q: R`Which statements about the partial-wave expansion are correct?`,
      options: [R`$e^{ikz} = \sum_l i^l(2l + 1)j_l(kr)P_l(\cos\theta)$`, R`For a central potential each partial wave scatters independently ($l$ is conserved)`, R`For a potential of range $R$, partial waves with $l \gg kR$ are hardly affected`, R`With only the $s$ wave present, $d\sigma/d\Omega$ is largest in the forward direction`], answer: [0, 1, 2],
      sol: R`The first is the Rayleigh expansion. A central potential commutes with $\vec L$, so it cannot change $l$; each wave only gets a phase shift $\delta_l$. Semiclassically $l\hbar \approx pb$, so waves with $l \gg kR$ pass at impact parameters beyond the range ($j_l(kr)$ is tiny for $kr < l$). With only $l = 0$, $f = e^{i\delta_0}\sin\delta_0/k$ has no angle dependence: isotropic.`,
      trap: R`Forward peaking needs several partial waves interfering.` },
    { id: 'netsc-r4-08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Coulomb scattering',
      q: R`$5.0$ MeV alpha particles scatter from gold nuclei ($Z = 79$, recoil ignored; $e^2/4\pi\varepsilon_0 = 1.44$ MeV fm). The cross-section for scattering through more than $90^\circ$ is ______ barn (one decimal place; $1$ b $= 100$ fm$^2$).`,
      answer: 16.3, tol: 0.15, unit: 'b', calc: () => Math.PI * (2 * 79 * E2 / 5 / 2) ** 2 / 100,
      sol: R`Classically $b = \dfrac d2\cot\dfrac\theta2$ with $d = 45.5$ fm (head-on distance of closest approach). Every alpha with impact parameter below $b_{90} = \tfrac d2\cot45^\circ = 22.75$ fm is deflected by more than $90^\circ$, so $\sigma = \pi b_{90}^2 = \pi(22.75)^2 = 1626$ fm$^2 = 16.3$ b. A gold foil $1\ \mu$m thick ($5.9\times10^{28}$ atoms per m$^3$) therefore turns back about $5.9\times10^{22}\times1.6\times10^{-26} \approx 10^{-3}$ of the alphas: rare, but far more than a diffuse "plum pudding" atom allows.`,
      trap: R`Using $b = d\cot(\theta/2)$ without the factor $\tfrac12$ quadruples the area.` },
    { id: 'netsc-r4-09', type: 'mcq', level: 4, exams: ['net', 'gate'], sub: 'resonances',
      q: R`The Wigner time delay is $\Delta t = 2\hbar\,d\delta_l/dE$. For an isolated resonance with $\tan\delta_l = \dfrac{\Gamma/2}{E_R - E}$, at $E = E_R$ it equals`,
      options: [R`$\hbar/\Gamma$`, R`$2\hbar/\Gamma$`, R`$\hbar/2\Gamma$`, R`$4\hbar/\Gamma$`], answer: 3,
      sol: R`$\dfrac{d\delta}{dE} = \dfrac{\Gamma/2}{(E_R - E)^2 + \Gamma^2/4}$, which is $2/\Gamma$ at $E = E_R$. So $\Delta t = 2\hbar\times2/\Gamma = 4\hbar/\Gamma$: the projectile is held for a time set by the inverse width, as expected for a quasi-bound state with lifetime $\hbar/\Gamma$.`,
      trap: R`Dropping the factor 2 in the definition gives $2\hbar/\Gamma$.` },
    { id: 'netsc-r4-10', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'square well',
      q: R`An attractive square well of radius $R$ has $K_0R = \sqrt{2mV_0}\,R/\hbar = 1.0$. With the convention $\delta_0 \approx -ka$, its scattering length is $a = R\left(1 - \dfrac{\tan K_0R}{K_0R}\right)$. The ratio $a/R$ is ______ (three decimal places).`,
      answer: -0.557, tol: 0.003, calc: () => 1 - Math.tan(1) / 1,
      sol: R`$\tan1.0 = 1.557$, so $a/R = 1 - 1.557 = -0.557$. Negative $a$ (in this convention) means an attractive well too weak to bind: a bound state appears only when $K_0R$ passes $\pi/2$, where $a \to -\infty$ and then jumps to $+\infty$. Low-energy cross-section: $4\pi a^2 = 1.24\pi R^2$.`,
      trap: R`Using degrees in $\tan1.0$.` },
    { id: 'netsc-r4-11', type: 'mcq', level: 5, exams: ['net', 'gate'], sub: 'optical theorem',
      q: R`For a real potential the first Born amplitude $f_B(\theta)$ is real, yet the total cross-section is positive. Why is there no conflict with the optical theorem $\sigma_{\rm tot} = \dfrac{4\pi}{k}\mathrm{Im}\,f(0)$?`,
      options: [R`The optical theorem fails for weak potentials`, R`$\mathrm{Im}\,f(0)$ first appears at second order in $V$, the same order as $\sigma_{\rm tot} \propto |f_B|^2$`, R`The first Born amplitude is purely imaginary in the forward direction`, R`The optical theorem holds only for Coulomb scattering`], answer: 1,
      sol: R`$\sigma_{\rm tot}$ from $|f_B|^2$ is of order $V^2$. The optical theorem then needs $\mathrm{Im}\,f(0)$ of order $V^2$, which comes from the second Born term. Unitarity is satisfied order by order: the first Born approximation is consistent at its own order, but cannot give $\mathrm{Im}\,f$.`,
      trap: R`Concluding that the Born series breaks unitarity; it only does so if truncated inconsistently.` },
    { id: 'netsc-r4-12', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'momentum transfer',
      q: R`To resolve structure about $1$ fm in size by elastic scattering, the momentum transfer $\hbar q$ must be about ($\hbar c = 197$ MeV fm)`,
      options: [R`2 keV/$c$`, R`2 MeV/$c$`, R`200 MeV/$c$`, R`20 GeV/$c$`], answer: 2,
      sol: R`The amplitude is a Fourier transform in $\vec q$, so detail of size $\Delta r$ shows up at $q \sim 1/\Delta r$. For $1$ fm, $q \sim 1$ fm$^{-1}$, i.e. $\hbar q \sim 197$ MeV$/c$. This is why nuclear sizes were mapped with electrons of a few hundred MeV.`,
      trap: R`Confusing MeV/$c$ (momentum) with MeV (energy) scales from atomic physics.` },
  ],
  gens: [
    { id: 'netsc-r4g1', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'Coulomb scattering',
      make(r) {
        const [pn, z] = choose(r, [['An alpha particle', 2], ['A proton', 1]]);
        const [tn, Z] = choose(r, [['gold', 79], ['silver', 47], ['lead', 82], ['platinum', 78]]);
        const E = choose(r, [2, 4, 5, 7.7]), ask = choose(r, ['d', 'b']), th = choose(r, [30, 60, 90, 120, 150]);
        const d = z * Z * E2 / E, b = d / 2 / Math.tan(th * deg / 2), ans = ask === 'd' ? d : b;
        return { q: R`${pn} of kinetic energy $${E}$ MeV approaches a ${tn} nucleus ($Z = ${Z}$; ignore recoil; $e^2/4\pi\varepsilon_0 = 1.44$ MeV fm). The energy is below the Coulomb barrier, so only the Coulomb force acts. ${ask === 'd' ? 'For a head-on approach, the distance of closest approach is' : `The impact parameter that gives a Rutherford scattering angle of $${th}^\\circ$ is`} ______ fm (three significant figures).`,
          answer: +ans.toPrecision(3), tol: +(ans * 0.005).toPrecision(2), z, Z, E, ask, th,
          sol: R`Head-on: $d = \dfrac{zZe^2}{4\pi\varepsilon_0E} = \dfrac{${z}\times${Z}\times1.44}{${E}} = ${+d.toPrecision(4)}$ fm.${ask === 'b' ? ` Rutherford orbits give $b = \\dfrac d2\\cot\\dfrac\\theta2 = ${+(d / 2).toPrecision(4)}\\cot${th / 2}^\\circ = ${+b.toPrecision(3)}$ fm.` : ''}`,
          trap: R`${ask === 'd' ? 'Forgetting the projectile charge $z$.' : 'Missing the factor $\\tfrac12$ in $b = \\tfrac d2\\cot(\\theta/2)$.'}` };
      },
      verify: (p) => { const d = p.z * p.Z * E2 / p.E; return p.ask === 'd' ? d : d / 2 / Math.tan(p.th * deg / 2); } },
    { id: 'netsc-r4g2', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'kinematics',
      make(r) {
        const [txt, g, gt] = choose(r, [['a proton scatters from carbon-12', 1 / 12, '1/12'], ['an alpha particle scatters from gold-197', 4 / 197, '4/197'], ['a neutron scatters from helium-4', 1 / 4, '1/4'], ['a deuteron scatters from carbon-12', 1 / 6, '1/6'], ['a proton scatters from a proton', 1, '1'], ['a neutron scatters from a deuteron', 1 / 2, '1/2']]);
        const th = choose(r, [30, 60, 90, 120, 150]);
        const ans = Math.atan2(Math.sin(th * deg), Math.cos(th * deg) + g) / deg;
        return { q: R`In an elastic collision, ${txt} at rest (mass ratio $m_1/m_2 = ${gt}$). For a centre-of-mass scattering angle of $${th}^\circ$, the laboratory scattering angle of the projectile is ______ degrees (one decimal place).`,
          answer: round(ans, 1), tol: 0.2, g, th,
          sol: R`$\tan\theta_{\rm lab} = \dfrac{\sin\theta_{\rm cm}}{\cos\theta_{\rm cm} + m_1/m_2} = \dfrac{${round(Math.sin(th * deg), 4)}}{${round(Math.cos(th * deg), 4)} + ${round(g, 4)}}$, taking the angle in the correct quadrant (beyond $90^\circ$ when the denominator is negative): $\theta_{\rm lab} = ${round(ans, 1)}^\circ$.`,
          trap: R`When $\cos\theta_{\rm cm} + m_1/m_2 < 0$ the lab angle is above $90^\circ$; a calculator's arctan gives the wrong quadrant.` };
      },
      verify: (p) => Math.atan2(Math.sin(p.th * deg), Math.cos(p.th * deg) + p.g) / deg },
    { id: 'netsc-r4g3', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'square well',
      make(r) {
        const g = choose(r, [0.3, 0.5, 0.8, 1.0, 1.2, 1.4, 1.8, 2.0, 2.5, 3.0, 4.0]);
        const ans = 1 - Math.tan(g) / g, nb = Math.floor(g / Math.PI + 0.5);
        return { q: R`An attractive square well of radius $R$ has $K_0R = \sqrt{2mV_0}\,R/\hbar = ${g}$. Using $a = R\left(1 - \dfrac{\tan K_0R}{K_0R}\right)$ (convention $\delta_0 \approx -ka$), the ratio $a/R$ is ______ (three decimal places).`,
          answer: round(ans, 3), tol: Math.max(0.003, round(Math.abs(ans) * 0.005, 3)), g,
          sol: R`$\tan${g} = ${round(Math.tan(g), 4)}$ (radians), so $a/R = 1 - ${round(Math.tan(g), 4)}/${g} = ${round(ans, 3)}$. This well holds ${nb} $s$-wave bound state${nb === 1 ? '' : 's'} (one appears each time $K_0R$ passes $\pi/2, 3\pi/2, \dots$, where $a$ jumps from $-\infty$ to $+\infty$).`,
          trap: R`Evaluating the tangent in degrees.` };
      },
      verify: (p) => 1 - Math.tan(p.g) / p.g },
  ],
};
