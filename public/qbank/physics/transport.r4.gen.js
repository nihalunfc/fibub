// Round 4 extras for transport: original questions, written 2026-11-22.
import { pick, choose, round, C } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'nettr-r4-01', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'diffusion',
      q: R`A particle diffuses in three dimensions with diffusion coefficient $D$, starting from the origin. Its mean square distance from the origin after time $t$ is`,
      options: [R`$2Dt$`, R`$4Dt$`, R`$6Dt$`, R`$Dt$`], answer: 2,
      sol: R`Each Cartesian direction diffuses independently with $\langle x^2\rangle = 2Dt$. So $\langle r^2\rangle = \langle x^2\rangle + \langle y^2\rangle + \langle z^2\rangle = 6Dt$. (In two dimensions it would be $4Dt$.)`,
      trap: R`$2Dt$ is for one coordinate; the three directions add.` },
    { id: 'nettr-r4-02', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'diffusion',
      q: R`Fick's law $\mathbf J = -D\nabla n$ together with conservation of particles gives, for constant $D$,`,
      options: [R`$\dfrac{\partial n}{\partial t} = D\nabla^2n$`, R`$\dfrac{\partial n}{\partial t} = -D\nabla^2n$`, R`$\dfrac{\partial^2n}{\partial t^2} = D\nabla^2n$`, R`$\dfrac{\partial n}{\partial t} = D\nabla n$`], answer: 0,
      sol: R`Conservation: $\dfrac{\partial n}{\partial t} + \nabla\cdot\mathbf J = 0$. Substituting $\mathbf J = -D\nabla n$: $\dfrac{\partial n}{\partial t} = D\nabla^2n$, the diffusion equation. The plus sign makes peaks ($\nabla^2n < 0$) fall and hollows fill in; the minus sign would make bumps grow without limit.`,
      trap: R`A second time derivative gives the wave equation, which describes propagation, not spreading.` },
    { id: 'nettr-r4-03', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'random walks',
      q: R`A molecule makes a random walk with steps of 100 nm in random directions. Roughly how many steps does it need to reach a root-mean-square distance of 1 mm from its start?`,
      options: [R`$10^4$`, R`$10^{12}$`, R`$10^6$`, R`$10^8$`], answer: 3,
      sol: R`For $N$ independent random steps of length $\lambda$, the cross terms average to zero and $\langle R^2\rangle = N\lambda^2$. So $N = (R/\lambda)^2 = (10^{-3}/10^{-7})^2 = (10^4)^2 = 10^8$.`,
      trap: R`$10^4$ steps would be enough only for a straight walk; a random walk needs the square of that.` },
    { id: 'nettr-r4-04', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'diffusion', format: 'numeric',
      q: R`A gas diffuses with $D = 2.0\times10^{-5}$ m²/s in still air. The time for it to spread a root-mean-square distance of 1.0 m along one direction ($\langle x^2\rangle = 2Dt$) is ______ hours (to two decimal places).`,
      answer: 6.94, tol: 0.03, calc: () => 1 / (2 * 2e-5) / 3600, unit: 'h',
      sol: R`$t = \dfrac{x^2}{2D} = \dfrac{1.0}{4.0\times10^{-5}} = 2.5\times10^4$ s $= 6.94$ hours. Smells cross a room in seconds because of air currents (convection), not diffusion.`,
      trap: R`Diffusion time grows as the square of the distance; it is not distance divided by a speed.` },
    { id: 'nettr-r4-05', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'diffusion',
      q: R`A small amount of dye is released at a point in a large still liquid and spreads by diffusion in three dimensions. At the release point, the concentration falls with time as`,
      options: [R`$t^{-1/2}$`, R`$t^{-3/2}$`, R`$t^{-1}$`, R`$e^{-t/\tau}$ for some fixed $\tau$`], answer: 1,
      sol: R`The solution of $\partial n/\partial t = D\nabla^2n$ from a point is a Gaussian, $n = \dfrac{N}{(4\pi Dt)^{3/2}}e^{-r^2/4Dt}$. At $r = 0$ it falls as $t^{-3/2}$: the same amount is spread over a volume that grows as $(\sqrt{Dt})^3$. In one dimension it would be $t^{-1/2}$.`,
      trap: R`Diffusion gives power laws, not exponential decay; and the power depends on the number of dimensions.` },
    { id: 'nettr-r4-06', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'effusion',
      q: R`Uranium hexafluoride molecules $^{235}$UF$_6$ (349 u) and $^{238}$UF$_6$ (352 u) effuse through a porous barrier. The ideal enrichment factor (ratio of $^{235}$U to $^{238}$U in the gas that passes, compared with the feed) for one stage is about`,
      options: ['1.0086', '1.0064', '1.0043', '1.0128'], answer: 2,
      sol: R`The effusion rate through a hole is $\tfrac14n\bar vA$ with $\bar v \propto 1/\sqrt m$ (Graham's law). So each stage enriches by $\sqrt{352/349} = \sqrt{1.0086} = 1.0043$. Because the factor is so small, enrichment plants need over a thousand stages in cascade.`,
      trap: R`The square root of the mass ratio, not the ratio itself (1.0086); and the molecule masses, not the uranium masses (which would give 1.0064).` },
    { id: 'nettr-r4-07', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Brownian motion', format: 'statements',
      q: R`For a small sphere of radius $a$ in a liquid of viscosity $\eta$ at temperature $T$, which statements follow from the Stokes-Einstein relation?`,
      options: [R`$D = \dfrac{kT}{6\pi\eta a}$`, R`At fixed viscosity, $D$ is proportional to $T$`, 'A sphere of twice the radius diffuses with half the diffusion coefficient', R`$D$ is proportional to $a^2$`], answer: [0, 1, 2],
      sol: R`Einstein's relation $D = \mu kT$ links diffusion to the mobility $\mu$ (velocity per unit force). Stokes drag gives $F = 6\pi\eta av$, so $\mu = 1/6\pi\eta a$ and $D = kT/6\pi\eta a$. Hence $D \propto T/\eta$ and $D \propto 1/a$: doubling the radius halves $D$. (In practice $\eta$ itself falls as a liquid warms, so $D$ rises faster than $T$.)`,
      trap: R`Bigger particles are slower: $D$ falls as $1/a$, it does not grow.` },
    { id: 'nettr-r4-08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Brownian motion', format: 'numeric',
      q: R`A sphere of diameter 1.0 μm is suspended in water ($\eta = 1.0\times10^{-3}$ Pa s) at 293 K. Using the Stokes-Einstein relation, its root-mean-square displacement along one direction in 60 s is ______ μm (to two decimal places).`,
      answer: 7.18, tol: 0.03, calc: () => Math.sqrt(2 * C.kB * 293 / (6 * Math.PI * 1e-3 * 0.5e-6) * 60) * 1e6, unit: 'μm',
      sol: R`$D = \dfrac{kT}{6\pi\eta a} = \dfrac{1.381\times10^{-23}\times293}{6\pi\times10^{-3}\times0.5\times10^{-6}} = 4.29\times10^{-13}$ m²/s (radius 0.5 μm). Then $x_{\rm rms} = \sqrt{2Dt} = \sqrt{2\times4.29\times10^{-13}\times60} = 7.18\times10^{-6}$ m $= 7.18$ μm. Measurements like this gave Perrin his value of Avogadro's number.`,
      trap: R`Stokes' law uses the radius; putting in the diameter makes $D$ too small by 2 and $x_{\rm rms}$ by $\sqrt2$.` },
    { id: 'nettr-r4-09', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'pressure dependence', format: 'statements',
      q: R`For a dilute gas of hard spheres at a fixed temperature, which of these do not depend on the pressure?`,
      options: [R`The viscosity $\eta$`, R`The thermal conductivity $\kappa$`, R`The self-diffusion coefficient $D$`, R`The product $\rho D$ of mass density and self-diffusion coefficient`], answer: [0, 1, 3],
      sol: R`Elementary theory: $\eta \approx \tfrac13\rho\bar v\lambda$, $\kappa \approx \tfrac13\rho c_v\bar v\lambda$, $D \approx \tfrac13\bar v\lambda$, with $\lambda \propto 1/n$ and $\rho \propto n$. In $\eta$ and $\kappa$ the density cancels against $\lambda$, so they are independent of pressure (Maxwell's surprise). $D \propto \lambda \propto 1/p$ alone, so it falls as pressure rises; the product $\rho D$ is again independent of pressure.`,
      trap: R`Momentum and heat transport carry a factor of density that cancels the mean free path; particle diffusion does not.` },
    { id: 'nettr-r4-10', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Drude model', format: 'numeric',
      q: R`Sodium has $2.65\times10^{28}$ free electrons per m³. In the free-electron (Drude) model it reflects light below the plasma frequency $\omega_p = \sqrt{ne^2/\varepsilon_0m_e}$ and becomes transparent above it. The corresponding vacuum wavelength $2\pi c/\omega_p$ is ______ nm (to the nearest nm).`,
      answer: 205, tol: 2, calc: () => 2 * Math.PI * C.c / Math.sqrt(2.65e28 * C.e ** 2 / (C.eps0 * C.me)) * 1e9, unit: 'nm',
      sol: R`$\omega_p^2 = \dfrac{2.65\times10^{28}\times(1.602\times10^{-19})^2}{8.854\times10^{-12}\times9.109\times10^{-31}} = 8.43\times10^{31}$ s⁻², so $\omega_p = 9.18\times10^{15}$ rad/s and $\lambda_p = 2\pi c/\omega_p = 205$ nm. Sodium is a mirror for visible light but transparent in the ultraviolet below about 205 nm, close to what is measured (about 210 nm).`,
      trap: R`Using $\omega_p$ as if it were a frequency in hertz gives a wavelength $2\pi$ times too short.` },
    { id: 'nettr-r4-11', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'effusion', format: 'numeric',
      q: R`A 1.0 L vessel holds helium (4.00 u) at 300 K at low pressure. It leaks into vacuum by effusion through a hole of area 1.0 mm², much smaller than the mean free path. The time for its pressure to fall by a factor $e$ is ______ s (to two decimal places).`,
      answer: 3.18, tol: 0.03, calc: () => 4 * 1e-3 / (1e-6 * Math.sqrt(8 * C.kB * 300 / (Math.PI * 4.0026 * C.u))), unit: 's',
      sol: R`The effusion rate is $\tfrac14n\bar vA$, so $\dfrac{d(nV)}{dt} = -\tfrac14n\bar vA$ and $n \propto e^{-t/\tau}$ with $\tau = \dfrac{4V}{\bar vA}$. Here $\bar v = \sqrt{8kT/\pi m} = 1260$ m/s, so $\tau = \dfrac{4\times10^{-3}}{1260\times10^{-6}} = 3.18$ s.`,
      trap: R`The flux through a hole is $\tfrac14n\bar v$, not $n\bar v$; the factor 4 comes from averaging over directions.` },
    { id: 'nettr-r4-12', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'Green-Kubo relations',
      q: R`In three dimensions the diffusion coefficient is $D = \tfrac13\displaystyle\int_0^\infty\langle\mathbf v(0)\cdot\mathbf v(t)\rangle\,dt$. For a particle of mass $m$ in equilibrium at temperature $T$ whose velocity correlation decays as $\langle\mathbf v(0)\cdot\mathbf v(t)\rangle = \langle v^2\rangle e^{-t/\tau}$, $D$ equals`,
      options: [R`$kT\tau/3m$`, R`$kT\tau/m$`, R`$3kT\tau/m$`, R`$\tau\sqrt{kT/m}$`], answer: 1,
      sol: R`Equipartition gives $\langle v^2\rangle = 3kT/m$. Then $D = \tfrac13\cdot\dfrac{3kT}{m}\int_0^\infty e^{-t/\tau}dt = \dfrac{kT\tau}{m}$. This agrees with Einstein's relation $D = \mu kT$ with mobility $\mu = \tau/m$ (a particle with drag force $-mv/\tau$), as it must.`,
      trap: R`The $\tfrac13$ is cancelled by the three components in $\langle v^2\rangle$; keeping only one of them gives $kT\tau/3m$.` },
  ],
  gens: [
    { id: 'nettr-r4g1', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Brownian motion',
      make(r) {
        const d = pick(r, 0.2, 3, 0.2), T = choose(r, [283, 293, 300, 310]), eta = choose(r, [0.8e-3, 1.0e-3, 1.3e-3]), t = choose(r, [10, 30, 60, 120]), dim = choose(r, [1, 3]);
        const D = C.kB * T / (6 * Math.PI * eta * d * 0.5e-6), answer = round(Math.sqrt(2 * dim * D * t) * 1e6, 3);
        return { q: R`A sphere of diameter ${d} μm is suspended in a liquid of viscosity $${round(eta * 1000, 2)}\times10^{-3}$ Pa s at ${T} K. Using the Stokes-Einstein relation, find its root-mean-square displacement ${dim === 1 ? 'along one direction' : 'in three dimensions'} after ${t} s, in μm.`,
          answer, tol: Math.max(0.01, answer * 0.01), unit: 'μm', d, T, eta, t, dim,
          sol: R`$D = \dfrac{kT}{6\pi\eta a}$ with $a = ${round(d / 2, 3)}$ μm: $D = ${round(D * 1e13, 4)}\times10^{-13}$ m²/s. Then $\sqrt{\langle ${dim === 1 ? 'x' : 'r'}^2\rangle} = \sqrt{${2 * dim}Dt} = ${answer}$ μm.`,
          trap: 'Stokes\' law uses the radius; and in three dimensions the mean square distance is $6Dt$.' };
      },
      verify: (p) => Math.sqrt(2 * p.dim * C.kB * p.T / (6 * Math.PI * p.eta * p.d * 0.5e-6) * p.t) * 1e6 },
    { id: 'nettr-r4g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'effusion',
      make(r) {
        const [gas, M] = choose(r, [['helium', 4.0026], ['neon', 20.18], ['nitrogen', 28.01], ['argon', 39.95], ['carbon dioxide', 44.01]]);
        const V = choose(r, [0.5, 1, 2, 5]), A = choose(r, [0.1, 0.5, 1, 2]), T = choose(r, [250, 300, 350, 400]);
        const vb = Math.sqrt(8 * C.kB * T / (Math.PI * M * C.u)), answer = round(4 * V * 1e-3 / (vb * A * 1e-6), 3);
        return { q: R`A ${V} L vessel of ${gas} (${M} u) at ${T} K leaks into vacuum by effusion through a hole of area ${A} mm². Find the time (s) for the pressure to fall by a factor $e$.`,
          answer, tol: Math.max(0.01, answer * 0.01), unit: 's', M, V, A, T,
          sol: R`$\bar v = \sqrt{8kT/\pi m} = ${round(vb, 1)}$ m/s. Effusion: $\dfrac{dN}{dt} = -\tfrac14n\bar vA$, so the pressure decays with $\tau = \dfrac{4V}{\bar vA} = \dfrac{4\times${V}\times10^{-3}}{${round(vb, 1)}\times${A}\times10^{-6}} = ${answer}$ s.`,
          trap: 'The effusive flux is a quarter of $n\\bar v$.' };
      },
      verify: (p) => 4 * p.V * 1e-3 / (Math.sqrt(8 * C.kB * p.T / (Math.PI * p.M * C.u)) * p.A * 1e-6) },
    { id: 'nettr-r4g3', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Drude model',
      make(r) {
        const [metal, n] = choose(r, [['lithium', 4.70e28], ['sodium', 2.65e28], ['potassium', 1.40e28], ['rubidium', 1.15e28], ['caesium', 0.91e28]]);
        const wp = Math.sqrt(n * C.e ** 2 / (C.eps0 * C.me)), answer = round(2 * Math.PI * C.c / wp * 1e9, 1);
        return { q: R`${metal[0].toUpperCase() + metal.slice(1)} has $${round(n / 1e28, 2)}\times10^{28}$ conduction electrons per m³. In the free-electron model, find the vacuum wavelength (nm) below which it becomes transparent, $\lambda_p = 2\pi c/\omega_p$ with $\omega_p = \sqrt{ne^2/\varepsilon_0m_e}$.`,
          answer, tol: Math.max(1, answer * 0.01), unit: 'nm', n,
          sol: R`$\omega_p = \sqrt{\dfrac{ne^2}{\varepsilon_0m_e}} = ${round(wp / 1e15, 3)}\times10^{15}$ rad/s, so $\lambda_p = 2\pi c/\omega_p = ${answer}$ nm. Fewer electrons mean a lower plasma frequency and a longer cut-off wavelength.`,
          trap: '$\\omega_p$ is an angular frequency: use $2\\pi c/\\omega_p$ for the wavelength.' };
      },
      verify: (p) => 2 * Math.PI * C.c / Math.sqrt(p.n * C.e ** 2 / (C.eps0 * C.me)) * 1e9 },
  ],
};
