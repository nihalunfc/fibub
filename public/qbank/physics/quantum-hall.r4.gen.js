// Round 4 extras for quantum-hall: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
const RK = 25812.807; // h/e^2 in ohms

export default {
  items: [
    { id: 'qhe-r4-01', type: 'mcq', level: 1, exams: G, sub: 'conductance quantum',
      q: R`The conductance quantum $e^2/h$ is about`,
      options: [R`$25.8$ k$\Omega$`, R`$38.7\ \mu$S`, R`$77.5\ \mu$S`, R`$12.9$ k$\Omega$`], answer: 1,
      sol: R`$e^2/h = (1.602\times10^{-19})^2/6.626\times10^{-34} = 3.87\times10^{-5}$ S $= 38.7\ \mu$S. Its inverse, $h/e^2 = 25.8$ k$\Omega$, is a resistance. With spin degeneracy, $2e^2/h = 77.5\ \mu$S is the conductance of one open channel in a quantum point contact.`,
      trap: R`$25.8$ k$\Omega$ is $h/e^2$, a resistance, not a conductance.` },
    { id: 'qhe-r4-02', type: 'nat', level: 2, exams: G, sub: 'cyclotron resonance', unit: 'μm',
      q: R`Electrons in GaAs ($m^* = 0.067\,m_e$, $m_e = 9.109\times10^{-31}$ kg) are in a field of $5.0$ T. The free-space wavelength of radiation that drives their cyclotron resonance is ______ $\mu$m (to one decimal place). Use $e = 1.602\times10^{-19}$ C and $c = 3.00\times10^8$ m/s.`,
      answer: 143.6, tol: 0.5, calc: () => 3e8 / (1.602e-19 * 5 / (2 * Math.PI * 0.067 * 9.109e-31)) * 1e6,
      sol: R`$f_c = \dfrac{eB}{2\pi m^*} = \dfrac{1.602\times10^{-19}\times5.0}{2\pi\times0.067\times9.109\times10^{-31}} = 2.09\times10^{12}$ Hz. $\lambda = c/f_c = 3.00\times10^8/2.09\times10^{12} = 1.436\times10^{-4}$ m $= 143.6\ \mu$m, in the far infrared. Measuring it gives $m^*$ directly.`,
      trap: R`$eB/m^*$ is the angular frequency; divide by $2\pi$ before finding the wavelength.` },
    { id: 'qhe-r4-03', type: 'mcq', level: 3, exams: G, sub: 'edge states',
      q: R`A Hall bar sits on the $\nu$-th integer quantum Hall plateau, with ideal contacts. The two-terminal resistance measured between the source and drain contacts (which includes the contacts) is`,
      options: [R`zero, since $\rho_{xx} = 0$`, R`infinite, since $\sigma_{xx} = 0$`, R`$h/\nu e^2$, the same as the Hall resistance`, R`$h/2\nu e^2$`], answer: 2,
      sol: R`In the edge-state picture, the $\nu$ channels on one edge leave the source at its potential and arrive at the drain unchanged; those on the other edge carry the drain potential back. The net current is $I = \nu\dfrac{e^2}h(V_S - V_D)$, so $R_{2t} = h/\nu e^2$. Along each edge no voltage drops ($R_{xx} = 0$); the whole drop occurs at the "hot spots" where the current enters and leaves.`,
      trap: R`Zero longitudinal resistance does not make the whole device resistance zero; the contact resistance is quantised.` },
    { id: 'qhe-r4-04', type: 'mcq', level: 3, exams: G, sub: 'Landau levels',
      q: R`A 2D electron gas has constant density of states $g = m^*/\pi\hbar^2$ per unit area (spin included) at $B = 0$. In a field $B$ the states condense into Landau levels $\hbar\omega_c$ apart. One spin-degenerate Landau level holds`,
      options: [R`exactly the zero-field states lying in an energy range $\hbar\omega_c$, i.e. $2eB/h$ per unit area`, R`half of those states`, R`a number of states independent of $B$`, R`all the states below the Fermi level`], answer: 0,
      sol: R`$g\,\hbar\omega_c = \dfrac{m^*}{\pi\hbar^2}\cdot\dfrac{\hbar eB}{m^*} = \dfrac{eB}{\pi\hbar} = \dfrac{2eB}h$. States are not created or lost by the field: each slice of width $\hbar\omega_c$ of the zero-field continuum collapses into one Landau level, which holds $eB/h$ per spin per unit area, one state per flux quantum.`,
      trap: R`The degeneracy grows in proportion to $B$; it is the number of flux quanta through the sample.` },
    { id: 'qhe-r4-05', type: 'nat', level: 4, exams: G, sub: 'composite fermions', unit: 'T',
      q: R`In the composite-fermion picture, each electron binds two flux quanta, so composite fermions feel an effective field $B^* = B - 2n_s\Phi_0$ (with $\Phi_0 = h/e$), i.e. $B^* = B(1 - 2\nu)$. A 2D electron gas shows the $\nu = 2/5$ fractional state at $B = 10.0$ T. The effective field felt by the composite fermions is ______ T (to one decimal place).`,
      answer: 2, tol: 0.05, calc: () => 10 * (1 - 2 * 0.4),
      sol: R`$B^* = 10.0\times(1 - 2\times\tfrac25) = 10.0\times\tfrac15 = 2.0$ T. The composite fermions then fill $p = 2$ of their own Landau levels: $\nu = p/(2p + 1) = 2/5$. The fractional state of electrons is an integer state of composite fermions.`,
      trap: R`The attached flux points against the field, so it reduces $B$; it does not add to it.` },
    { id: 'qhe-r4-06', type: 'msq', level: 4, exams: G, sub: 'composite fermions', format: 'statements',
      q: R`Which statements about composite fermions (electrons bound to two flux quanta) are correct?`,
      options: [R`At $\nu = 1/2$ they feel zero effective field and form a Fermi sea.`, R`The Jain states $\nu = p/(2p + 1)$ are integer quantum Hall states of composite fermions.`, R`The effective field is $B^* = B - 2n_s h/e$.`, R`At $\nu = 1/2$ the Hall resistance shows a well-quantised plateau at $2h/e^2$.`], answer: [0, 1, 2],
      sol: R`At $\nu = 1/2$ there are exactly two flux quanta per electron, all absorbed, so $B^* = 0$ and the composite fermions form a metal-like Fermi sea; $\rho_{xy}$ passes $2h/e^2$ smoothly with no plateau and $\rho_{xx}$ stays finite. Away from $1/2$, $B^*\ne0$ and the composite fermions fill $p$ Landau levels, giving the Jain series $2/5$, $3/7$, ... (and $2/3$, $3/5$, ... on the other side).`,
      trap: R`Even-denominator fractions in the lowest Landau level do not give plateaus; $\nu = 1/2$ is a compressible Fermi liquid.` },
    { id: 'qhe-r4-07', type: 'nat', level: 5, exams: G, sub: 'Landauer-Büttiker', unit: 'Ω',
      q: R`A Hall bar is on the $\nu = 4$ plateau, except that a top gate across its full width lowers the density locally so that the gated strip is at $\nu = 2$. The longitudinal resistance measured between two contacts on the same edge, one on each side of the gated strip, is $R = \dfrac h{e^2}\left(\dfrac1{\nu_g} - \dfrac1\nu\right)$. With $h/e^2 = 25\,812.8\ \Omega$, $R$ is ______ $\Omega$ (to the nearest ohm).`,
      answer: 6453, tol: 1, calc: () => RK * (1 / 2 - 1 / 4),
      sol: R`Only $2$ of the $4$ edge channels pass through the gated strip; the other $2$ are reflected along the gate edge. Equilibrating the channels at the contacts with the Landauer-Büttiker formula gives a voltage drop along the edge of $\dfrac h{e^2}\left(\dfrac12 - \dfrac14\right)I$. $R = 25\,812.8\times0.25 = 6453\ \Omega$. Such quantised fractions of $h/e^2$ confirm that current flows in edge channels.`,
      trap: R`The gated strip's own Hall resistance, $h/2e^2$, is not what a same-edge pair of contacts measures.` },
    { id: 'qhe-r4-08', type: 'msq', level: 3, exams: G, sub: 'integer QHE', format: 'statements',
      q: R`A 2D electron gas is on the centre of an integer quantum Hall plateau. Which statements are correct?`,
      options: [R`$\rho_{xx} = 0$ and $\sigma_{xx} = 0$ at the same time.`, R`$\sigma_{xy} = \nu e^2/h$.`, R`$\rho_{xx} = 0$ means the 2D gas has become a superconductor.`, R`Most of the power is dissipated near the corners where current enters and leaves the sample.`], answer: [0, 1, 3],
      sol: R`Inverting the resistivity tensor, $\sigma_{xx} = \rho_{xx}/(\rho_{xx}^2 + \rho_{xy}^2)$, which vanishes with $\rho_{xx}$ because $\rho_{xy}\ne0$. Then $\sigma_{xy} = 1/\rho_{xy} = \nu e^2/h$. Nothing is superconducting: there is a voltage across the sample ($V_H$), and the current flows at right angles to the field with no scattering. The dissipation $IV_H$ appears at the two hot spots at opposite corners of the current contacts.`,
      trap: R`Zero longitudinal resistivity with zero longitudinal conductivity is possible only because $\rho_{xy}$ is finite.` },
    { id: 'qhe-r4-09', type: 'nat', level: 3, exams: G, sub: 'edge states', unit: '×10⁵ m/s',
      q: R`Near the edge of a quantum Hall sample the confining electric field is $1.0\times10^6$ V/m, perpendicular to the edge, and $B = 5.0$ T. The drift speed $E/B$ of electrons in the edge states is ______ $\times10^5$ m/s (to one decimal place).`,
      answer: 2, tol: 0.05, calc: () => 1e6 / 5 / 1e5,
      sol: R`Crossed fields make guiding centres drift along the equipotentials at $v = E/B = 1.0\times10^6/5.0 = 2.0\times10^5$ m/s, along the edge. Electrons on opposite edges feel opposite edge fields and drift in opposite directions: the chiral edge channels.`,
      trap: R`The drift speed does not depend on the charge or mass of the carriers.` },
    { id: 'qhe-r4-10', type: 'mcq', level: 2, exams: G, sub: 'metrology',
      q: R`Since the 2019 revision of the SI, the von Klitzing constant $R_K = h/e^2$ is`,
      options: [R`measured more precisely each year with better Hall bars`, R`exact, because $h$ and $e$ themselves now have fixed values`, R`defined to be exactly $25\,000\ \Omega$`, R`no longer used, since resistance standards are made from wire`], answer: 1,
      sol: R`The 2019 SI fixes $h = 6.626\,070\,15\times10^{-34}$ J s and $e = 1.602\,176\,634\times10^{-19}$ C exactly, so $h/e^2 = 25\,812.807\dots\ \Omega$ is exact. A quantum Hall device on a plateau now realises the ohm directly; its value is the same in every sample (GaAs, graphene) to parts in $10^{10}$.`,
      trap: R`The Hall plateaus are not tuned to round numbers; their value follows from the fixed constants.` },
  ],
  gens: [
    { id: 'qhe-r4g1', type: 'nat', level: 4, exams: G, sub: 'composite fermions', unit: 'T',
      make(r) {
        const side = choose(r, [1, -1]), p = side > 0 ? int(r, 1, 4) : int(r, 2, 4), nu = p / (2 * p + side), B = pick(r, 4, 30, 0.5), Bs = Math.abs(B * (1 - 2 * nu));
        return { q: `A 2D electron gas shows the fractional state $\\nu = ${p}/${2 * p + side}$ at $B = ${B}$ T. Composite fermions (each electron bound to two flux quanta) feel $B^* = B(1 - 2\\nu)$. The magnitude of the effective field is ______ T (to two decimal places).`,
          answer: round(Bs, 2), tol: Math.max(0.01, round(Bs * 0.002, 2)), p, side, B,
          sol: `$1 - 2\\nu = 1 - ${2 * p}/${2 * p + side} = ${side}/${2 * p + side}$, so $|B^*| = ${B}/${2 * p + side} = ${round(Bs, 2)}$ T. The composite fermions fill $${p}$ Landau levels in this field${side < 0 ? ' (pointing against $B$)' : ''}.`,
          trap: 'The two attached flux quanta per electron cancel part of the applied field.' };
      },
      verify: (p) => Math.abs(p.B * (1 - 2 * p.p / (2 * p.p + p.side))) },
    { id: 'qhe-r4g2', type: 'nat', level: 5, exams: G, sub: 'Landauer-Büttiker', unit: 'Ω',
      make(r) {
        const nu = int(r, 2, 8), ng = int(r, 1, nu - 1), Rv = RK * (1 / ng - 1 / nu);
        return { q: `A Hall bar is on the $\\nu = ${nu}$ plateau, but a gate across its full width brings a strip to $\\nu_g = ${ng}$. Two contacts on the same edge, either side of the strip, measure $R = \\dfrac h{e^2}\\left(\\dfrac1{\\nu_g} - \\dfrac1\\nu\\right)$. With $h/e^2 = 25\\,812.8\\ \\Omega$, $R$ is ______ $\\Omega$ (to the nearest ohm).`,
          answer: Math.round(Rv), tol: 1, nu, ng,
          sol: `$R = 25\\,812.8\\times(1/${ng} - 1/${nu}) = 25\\,812.8\\times${round(1 / ng - 1 / nu, 5)} = ${Math.round(Rv)}\\ \\Omega$. Only ${ng} of the ${nu} edge channels pass the gated strip.`,
          trap: 'Subtract the reciprocals of the filling factors, not the filling factors themselves.' };
      },
      verify: (p) => RK * (1 / p.ng - 1 / p.nu) },
    { id: 'qhe-r4g3', type: 'nat', level: 2, exams: G, sub: 'cyclotron resonance', unit: 'μm',
      make(r) {
        const [mat, m] = choose(r, [['GaAs', 0.067], ['InSb', 0.014], ['InAs', 0.023], ['silicon (in-plane mass)', 0.19], ['ZnO', 0.29], ['GaN', 0.20]]), B = pick(r, 1, 15, 0.5);
        const f = 1.602e-19 * B / (2 * Math.PI * m * 9.109e-31), lam = 3e8 / f * 1e6;
        return { q: `Electrons in ${mat} ($m^* = ${m}\\,m_e$, $m_e = 9.109\\times10^{-31}$ kg) are in a field of $${B}$ T. The free-space wavelength that drives their cyclotron resonance is ______ $\\mu$m (to one decimal place). Use $e = 1.602\\times10^{-19}$ C and $c = 3.00\\times10^8$ m/s.`,
          answer: round(lam, 1), tol: Math.max(0.1, round(lam * 0.003, 1)), m, B,
          sol: `$f_c = eB/2\\pi m^* = ${round(f / 1e12, 4)}\\times10^{12}$ Hz, so $\\lambda = c/f_c = ${round(lam, 1)}\\ \\mu$m.`,
          trap: 'Divide the angular frequency $eB/m^*$ by $2\\pi$.' };
      },
      verify: (p) => 3e8 / (1.602e-19 * p.B / (2 * Math.PI * p.m * 9.109e-31)) * 1e6 },
  ],
};
