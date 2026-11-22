// Round 4 extras for dielectric-optical: original questions, written 2026-11-22.
import { pick, choose, round } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'], JG = ['jam', 'gate', 'net'];
const E = 1.602e-19, EPS0 = 8.854e-12, ME = 9.109e-31, HBAR_EV = 6.582e-16;
const plasmon = (n) => HBAR_EV * Math.sqrt(n * E * E / (EPS0 * ME)); // eV, n in m^-3

export default {
  items: [
    { id: 'diel-r4-01', type: 'mcq', level: 1, exams: JG, sub: 'optical constants',
      q: R`A transparent, non-magnetic crystal has relative permittivity $\varepsilon_r = 2.25$ at the frequency of visible light. Its refractive index is`,
      options: [R`$2.25$`, R`$1.50$`, R`$5.06$`, R`$1.12$`], answer: 1,
      sol: R`For a non-magnetic medium ($\mu_r = 1$), $n = \sqrt{\varepsilon_r\mu_r} = \sqrt{2.25} = 1.50$. The $\varepsilon_r$ here must be the value at optical frequency; static values can be much larger (for water, $80$ against $n^2 = 1.78$).`,
      trap: R`$n$ is the square root of $\varepsilon_r$, not equal to it.` },
    { id: 'diel-r4-02', type: 'nat', level: 3, exams: G, sub: 'Drude model', unit: 'eV',
      q: R`Aluminium has $6.02\times10^{28}$ atoms per m$^3$, each giving $3$ free electrons. With $e = 1.602\times10^{-19}$ C, $\varepsilon_0 = 8.854\times10^{-12}$ F/m, $m_e = 9.109\times10^{-31}$ kg and $\hbar = 6.582\times10^{-16}$ eV s, the bulk plasmon energy $\hbar\omega_p$ is ______ eV (to one decimal place).`,
      answer: 15.8, tol: 0.1, calc: () => plasmon(3 * 6.02e28),
      sol: R`$n = 3\times6.02\times10^{28} = 1.806\times10^{29}$ m$^{-3}$. $\omega_p^2 = \dfrac{ne^2}{\varepsilon_0m_e} = \dfrac{1.806\times10^{29}\times2.566\times10^{-38}}{8.854\times10^{-12}\times9.109\times10^{-31}} = 5.75\times10^{32}$ s$^{-2}$, $\omega_p = 2.40\times10^{16}$ s$^{-1}$, $\hbar\omega_p = 15.8$ eV. Electron energy-loss spectra of aluminium show a sharp peak at about $15$ eV, close to this.`,
      trap: R`Using one electron per atom gives $9.1$ eV; aluminium is trivalent.` },
    { id: 'diel-r4-03', type: 'mcq', level: 3, exams: G, sub: 'plasmons',
      q: R`A small sphere of a free-electron metal ($\varepsilon(\omega) = 1 - \omega_p^2/\omega^2$), much smaller than the wavelength, sits in vacuum. Its dipolar (surface plasmon) resonance occurs where $\varepsilon(\omega) = -2$, at`,
      options: [R`$\omega_p$`, R`$\omega_p/\sqrt2$`, R`$\omega_p/\sqrt3$`, R`$\sqrt3\,\omega_p$`], answer: 2,
      sol: R`A sphere in a uniform field has internal field $\dfrac{3}{\varepsilon + 2}E_0$, which blows up when $\varepsilon = -2$. Then $1 - \omega_p^2/\omega^2 = -2$, so $\omega^2 = \omega_p^2/3$ and $\omega = \omega_p/\sqrt3$. A flat surface resonates where $\varepsilon = -1$ ($\omega_p/\sqrt2$); the bulk plasmon is at $\varepsilon = 0$ ($\omega_p$). Gold and silver nanoparticles get their colours from this resonance.`,
      trap: R`$\omega_p/\sqrt2$ is the flat-surface plasmon; a sphere's geometry changes the condition to $\varepsilon = -2$.` },
    { id: 'diel-r4-04', type: 'nat', level: 4, exams: G, sub: 'orientational polarisation', unit: 'D',
      q: R`Measurements on a dilute polar gas at $300$ K give an orientational polarisability per molecule $\alpha_{\rm or} = p^2/3k_BT = 2.0\times10^{-39}$ C m$^2$/V. With $k_B = 1.381\times10^{-23}$ J/K and $1$ debye $= 3.336\times10^{-30}$ C m, the permanent dipole moment $p$ is ______ D (to two decimal places).`,
      answer: 1.49, tol: 0.02, calc: () => Math.sqrt(3 * 1.381e-23 * 300 * 2e-39) / 3.336e-30,
      sol: R`$p^2 = 3k_BT\alpha_{\rm or} = 3\times1.381\times10^{-23}\times300\times2.0\times10^{-39} = 2.49\times10^{-59}$ C$^2$ m$^2$, $p = 4.99\times10^{-30}$ C m $= 1.49$ D, similar to ammonia's. In practice $p$ is found from the slope of total polarisability against $1/T$, which separates it from the temperature-independent electronic part.`,
      trap: R`The orientational term falls as $1/T$; the electronic term does not, so only the slope gives $p$.` },
    { id: 'diel-r4-05', type: 'mcq', level: 3, exams: G, sub: 'excitons',
      q: R`In a semiconductor with $\varepsilon_r = 12.5$ and electron-hole reduced mass $0.060\,m_e$, the radius of the 1s Wannier exciton in the hydrogen model ($a_0 = 0.0529$ nm) is about`,
      options: [R`$0.66$ nm`, R`$0.071$ nm`, R`$11$ nm`, R`$138$ nm`], answer: 2,
      sol: R`The hydrogen radius scales as $\varepsilon_r$ (screening weakens the attraction) and inversely with mass: $a^* = a_0\varepsilon_r(m_e/\mu) = 0.0529\times12.5/0.060 = 11$ nm. That spans dozens of lattice spacings, which justifies the continuum (effective-mass) model.`,
      trap: R`$0.66$ nm keeps the free electron mass; the light reduced mass makes the exciton much larger.` },
    { id: 'diel-r4-06', type: 'mcq', level: 4, exams: G, sub: 'absorption edge',
      q: R`A direct-gap semiconductor is doped heavily n-type, so that the bottom of its conduction band is filled with electrons up to a Fermi level inside the band. Its optical absorption edge`,
      options: [R`moves to higher photon energy, because transitions into the filled states are blocked`, R`moves to lower photon energy, because the gap closes completely`, R`stays exactly at $E_g$`, R`disappears, because the material becomes a metal`], answer: 0,
      sol: R`A photon can lift an electron only into an empty state. With the bottom of the conduction band occupied, vertical transitions must reach states above $E_F$, which requires larger photon energy (the Burstein-Moss shift). This is why heavily doped In$_2$O$_3$:Sn (ITO) is more transparent than the undoped gap would suggest. Band-gap narrowing from many-body effects pushes the other way, but the blocking usually wins.`,
      trap: R`Doping fills states; filled states cannot accept the excited electron.` },
    { id: 'diel-r4-07', type: 'msq', level: 4, exams: G, sub: 'crystal symmetry', format: 'statements',
      q: R`Which statements about crystals that have a centre of inversion are correct?`,
      options: [R`They cannot generate a second harmonic (frequency doubling) through the bulk $\chi^{(2)}$ term.`, R`They cannot be piezoelectric.`, R`They still have an ordinary (linear) refractive index.`, R`They can be pyroelectric if their point group is polar.`], answer: [0, 1, 2],
      sol: R`Under inversion $\vec E\to-\vec E$ and $\vec P\to-\vec P$; a term $P\propto\chi^{(2)}EE$ would not change sign, so $\chi^{(2)} = 0$. Piezoelectricity, $P\propto$ strain (which is even under inversion), vanishes the same way. Linear response $P = \varepsilon_0\chi E$ is allowed in every crystal. Pyroelectricity needs a polar point group, and no polar group contains inversion.`,
      trap: R`Polar groups never contain inversion, so a centrosymmetric crystal cannot be pyroelectric.` },
    { id: 'diel-r4-08', type: 'nat', level: 4, exams: G, sub: 'optics of metals', unit: 'nm',
      q: R`A collisionless free-electron metal has $\hbar\omega_p = 15.8$ eV. Light with $\omega\ll\omega_p$ penetrates as $e^{-z/\delta}$ with $\delta = c/\sqrt{\omega_p^2 - \omega^2}\approx c/\omega_p$. With $\hbar = 6.582\times10^{-16}$ eV s and $c = 3.00\times10^8$ m/s, $\delta$ is ______ nm (to one decimal place).`,
      answer: 12.5, tol: 0.1, calc: () => 3e8 / (15.8 / 6.582e-16) * 1e9,
      sol: R`$\omega_p = 15.8/6.582\times10^{-16} = 2.40\times10^{16}$ s$^{-1}$. $\delta = c/\omega_p = 3.00\times10^8/2.40\times10^{16} = 1.25\times10^{-8}$ m $= 12.5$ nm. This "plasma penetration depth" is why a metal film tens of nanometres thick already acts as a good mirror for visible light.`,
      trap: R`For $\omega < \omega_p$ the wave vector is imaginary: the field decays, it does not oscillate inside.` },
    { id: 'diel-r4-09', type: 'nat', level: 5, exams: G, sub: 'Kramers-Kronig',
      q: R`An insulator's $\varepsilon''(\omega)$ consists of a single narrow absorption line at $\hbar\omega_0 = 5.0$ eV with area $\int\varepsilon''\,d(\hbar\omega) = 9.42$ eV. Using the Kramers-Kronig result $\varepsilon'(0) = 1 + \dfrac2\pi\int_0^\infty\dfrac{\varepsilon''(\omega)}{\omega}\,d\omega$, the static dielectric constant (electronic part) is ______ (to two decimal places).`,
      answer: 2.2, tol: 0.01, calc: () => 1 + (2 / Math.PI) * 9.42 / 5.0,
      sol: R`For a narrow line, $1/\omega$ is constant across it: $\int\dfrac{\varepsilon''}{\omega}d\omega = \dfrac1{\omega_0}\int\varepsilon''\,d\omega = \dfrac{9.42}{5.0} = 1.884$ (the $\hbar$s cancel). $\varepsilon'(0) = 1 + 0.6366\times1.884 = 2.20$, giving $n = 1.48$ well below the line. Absorption at any frequency raises the low-frequency permittivity, more so the lower the absorption frequency.`,
      trap: R`The weighting $1/\omega$ is the line's own frequency, not the frequency of measurement.` },
    { id: 'diel-r4-10', type: 'msq', level: 2, exams: JG, sub: 'optical constants', format: 'statements',
      q: R`A material has complex refractive index $\tilde n = n + i\kappa$ and is studied with light of vacuum wavelength $\lambda$. Which statements are correct?`,
      options: [R`The reflectance at normal incidence from vacuum is $\dfrac{(n - 1)^2 + \kappa^2}{(n + 1)^2 + \kappa^2}$.`, R`The intensity absorption coefficient is $4\pi\kappa/\lambda$.`, R`$\varepsilon' = n^2 - \kappa^2$ and $\varepsilon'' = 2n\kappa$.`, R`A material with $\kappa = 0$ reflects no light at all.`], answer: [0, 1, 2],
      sol: R`The Fresnel formula with complex $\tilde n$ gives the first expression. The field decays as $e^{-2\pi\kappa z/\lambda}$, so the intensity as $e^{-4\pi\kappa z/\lambda}$. Squaring $\tilde n$ gives $\varepsilon = n^2 - \kappa^2 + 2in\kappa$. With $\kappa = 0$ there is no absorption, but there is still reflection whenever $n\ne1$: glass with $n = 1.5$ reflects $4\%$.`,
      trap: R`Transparent does not mean non-reflecting; reflection comes from the index step.` },
  ],
  gens: [
    { id: 'diel-r4g1', type: 'nat', level: 3, exams: G, sub: 'Drude model',
      make(r) {
        const [m, v, na] = choose(r, [['sodium', 1, 2.65], ['potassium', 1, 1.40], ['copper', 1, 8.47], ['silver', 1, 5.86], ['magnesium', 2, 4.30], ['zinc', 2, 6.57], ['beryllium', 2, 12.3], ['aluminium', 3, 6.02], ['indium', 3, 3.83]]), ask = choose(r, ['E', 'lam']);
        const Ep = plasmon(v * na * 1e28), lam = 1239.84 / Ep, val = ask === 'E' ? Ep : lam;
        return { q: `${m[0].toUpperCase() + m.slice(1)} has $${na}\\times10^{28}$ atoms per m$^3$ and valence ${v}. Treating the valence electrons as free (with $e = 1.602\\times10^{-19}$ C, $\\varepsilon_0 = 8.854\\times10^{-12}$ F/m, $m_e = 9.109\\times10^{-31}$ kg, $\\hbar = 6.582\\times10^{-16}$ eV s${ask === 'lam' ? ', $hc = 1239.84$ eV nm' : ''}), ${ask === 'E' ? 'the plasmon energy $\\hbar\\omega_p$ is ______ eV (to two decimal places).' : 'the vacuum wavelength below which it becomes transparent is ______ nm (to one decimal place).'}`,
          answer: ask === 'E' ? round(val, 2) : round(val, 1), tol: ask === 'E' ? Math.max(0.02, round(val * 0.003, 2)) : Math.max(0.2, round(val * 0.003, 1)), v, na, ask, unit: ask === 'E' ? 'eV' : 'nm',
          sol: `$n = ${v}\\times${na}\\times10^{28}$ m$^{-3}$; $\\omega_p = \\sqrt{ne^2/\\varepsilon_0m_e} = ${round(Ep / HBAR_EV / 1e16, 4)}\\times10^{16}$ s$^{-1}$, so $\\hbar\\omega_p = ${round(Ep, 2)}$ eV.${ask === 'lam' ? ` Light is transmitted for $\\omega > \\omega_p$, i.e. $\\lambda < hc/\\hbar\\omega_p = 1239.84/${round(Ep, 3)} = ${round(lam, 1)}$ nm.` : ''}`,
          trap: 'Count all the valence electrons per atom, not just one.' };
      },
      verify: (p) => { const Ep = plasmon(p.v * p.na * 1e28); return p.ask === 'E' ? Ep : 1239.84 / Ep; } },
    { id: 'diel-r4g2', type: 'nat', level: 3, exams: G, sub: 'excitons', unit: 'nm',
      make(r) {
        const eps = pick(r, 5, 16, 0.1), mu = pick(r, 0.02, 0.4, 0.005), a = 0.0529 * eps / mu;
        return { q: `In a semiconductor with $\\varepsilon_r = ${eps}$ and electron-hole reduced mass $${mu}\\,m_e$, the radius of the 1s Wannier exciton in the hydrogen model ($a_0 = 0.0529$ nm) is ______ nm (to two decimal places).`,
          answer: round(a, 2), tol: Math.max(0.01, round(a * 0.003, 2)), eps, mu,
          sol: `$a^* = a_0\\varepsilon_r(m_e/\\mu) = 0.0529\\times${eps}/${mu} = ${round(a, 2)}$ nm. The binding energy goes the other way: $13.6\\,\\mu/(m_e\\varepsilon_r^2) = ${round(13.6 * mu / (eps * eps) * 1000, 1)}$ meV.`,
          trap: 'The radius grows with $\\varepsilon_r$ and shrinks with $\\mu$; the binding energy does the opposite, with $\\varepsilon_r^2$.' };
      },
      verify: (p) => 0.0529 * p.eps / p.mu },
    { id: 'diel-r4g3', type: 'nat', level: 5, exams: G, sub: 'Kramers-Kronig',
      make(r) {
        const w1 = pick(r, 3, 15, 0.5), A1 = pick(r, 2, 30, 0.5), two = choose(r, [true, false]), w2 = round(w1 + pick(r, 2, 10, 0.5), 1), A2 = pick(r, 2, 30, 0.5);
        const e0 = 1 + (2 / Math.PI) * (A1 / w1 + (two ? A2 / w2 : 0));
        return { q: `An insulator's $\\varepsilon''$ consists of ${two ? `two narrow lines: one at $${w1}$ eV with area $\\int\\varepsilon''\\,d(\\hbar\\omega) = ${A1}$ eV, and one at $${w2}$ eV with area $${A2}$ eV` : `one narrow line at $${w1}$ eV with area $\\int\\varepsilon''\\,d(\\hbar\\omega) = ${A1}$ eV`}. Using $\\varepsilon'(0) = 1 + \\dfrac2\\pi\\int_0^\\infty\\dfrac{\\varepsilon''(\\omega)}{\\omega}d\\omega$, the static electronic dielectric constant is ______ (to two decimal places).`,
          answer: round(e0, 2), tol: 0.01, w1, A1, w2, A2, two,
          sol: `Each narrow line contributes (area)/(its frequency): $${round(A1 / w1, 4)}${two ? ` + ${round(A2 / w2, 4)}` : ''}$. $\\varepsilon'(0) = 1 + \\tfrac2\\pi\\times${round(A1 / w1 + (two ? A2 / w2 : 0), 4)} = ${round(e0, 2)}$.`,
          trap: 'Low-frequency lines count for more because of the $1/\\omega$ weight.' };
      },
      verify: (p) => 1 + (2 / Math.PI) * (p.A1 / p.w1 + (p.two ? p.A2 / p.w2 : 0)) },
  ],
};
