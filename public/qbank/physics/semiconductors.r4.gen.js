// Round 4 extras for semiconductors: original questions, written 2026-11-22.
import { choose, round, C } from '../_util.js';
const R = String.raw;
const A = ['jam', 'gate', 'net'];
const G = ['gate', 'net'];

export default {
  items: [
    { id: 'sem-r4-01', type: 'mcq', level: 1, exams: A, sub: 'basics',
      q: R`Perfectly pure silicon at absolute zero temperature is`,
      options: [R`a good conductor, because silicon has four valence electrons`, R`an insulator`, R`a superconductor`, R`n-type, because electrons are lighter than holes`],
      answer: 1,
      sol: R`At $0$ K every valence-band state is full and every conduction-band state is empty; with a gap of about $1.17$ eV and no thermal energy, no electron can be excited. A full band carries no current, so the crystal insulates. Conduction appears only when temperature, light or impurities supply carriers.`,
      trap: R`A semiconductor is not "half a conductor" at all temperatures: its conductivity comes entirely from excited or added carriers.` },
    { id: 'sem-r4-02', type: 'nat', level: 2, exams: A, sub: 'mobility', unit: 'ps',
      q: R`Electrons in a semiconductor have mobility $1400$ cm$^2$/V s and conductivity effective mass $0.26\,m_e$. Their mean time between scattering events is ______ ps (to three decimal places).`,
      answer: 0.207, tol: 0.003, calc: () => 0.14 * 0.26 * C.me / C.e * 1e12,
      sol: R`From the Drude picture $\mu = e\tau/m^*$, so $\tau = \dfrac{\mu m^*}{e} = \dfrac{(0.140\ \text{m}^2/\text{V s})(0.26\times9.11\times10^{-31}\ \text{kg})}{1.60\times10^{-19}\ \text{C}} = 2.07\times10^{-13}$ s $= 0.207$ ps.`,
      trap: R`Leaving the mobility in cm$^2$/V s gives an answer $10^4$ times too big; use $1\ \text{cm}^2 = 10^{-4}\ \text{m}^2$.` },
    { id: 'sem-r4-03', type: 'mcq', level: 2, exams: A, sub: 'fermi level',
      q: R`In a non-degenerate n-type semiconductor at $300$ K, the donor density (all ionised, much larger than $n_i$) is multiplied by $10$. The Fermi level`,
      options: [R`moves down by about $60$ meV`, R`moves up by about $26$ meV`, R`moves up by about $0.6$ eV`, R`moves up by about $60$ meV`],
      answer: 3,
      sol: R`$n = N_c e^{-(E_c - E_F)/kT}\approx N_d$, so $E_c - E_F = kT\ln(N_c/N_d)$. Multiplying $N_d$ by 10 lowers $E_c - E_F$ by $kT\ln10 = 0.02585\times2.303 = 0.0595$ eV: the Fermi level rises about $60$ meV towards the conduction band.`,
      trap: R`Using $kT$ itself ($26$ meV): a factor $e$, not 10, moves it by $kT$.` },
    { id: 'sem-r4-04', type: 'nat', level: 3, exams: A, sub: 'drift', unit: 'kV/cm',
      q: R`Electrons in silicon at $300$ K have conductivity mass $0.26\,m_e$ and low-field mobility $1400$ cm$^2$/V s. Taking their thermal speed as $\sqrt{3k_BT/m^*}$, the electric field at which the (low-field) drift speed would reach $10\%$ of the thermal speed is ______ kV/cm (to two decimal places).`,
      answer: 1.64, tol: 0.02, calc: () => 0.1 * Math.sqrt(3 * C.kB * 300 / (0.26 * C.me)) / 0.14 / 1e5,
      sol: R`$v_{\rm th} = \sqrt{\dfrac{3(1.381\times10^{-23})(300)}{0.26\times9.11\times10^{-31}}} = 2.29\times10^5$ m/s. Drift speed $v_d = \mu E$, so $E = \dfrac{0.1v_{\rm th}}{\mu} = \dfrac{2.29\times10^4}{0.140} = 1.64\times10^5$ V/m $= 1.64$ kV/cm. Beyond fields of this order the simple $v_d = \mu E$ fails and the drift speed saturates near $10^5$ m/s.`,
      trap: R`Converting V/m to kV/cm: $1$ kV/cm $= 10^5$ V/m, not $10^3$.` },
    { id: 'sem-r4-05', type: 'msq', level: 3, exams: A, sub: 'hall effect', format: 'statements',
      q: R`Which statements about the Hall effect in semiconductors are correct?`,
      options: [R`An intrinsic semiconductor whose electrons are more mobile than its holes has a negative Hall coefficient.`, R`A p-type sample can show a Hall coefficient that changes sign as it is heated into the intrinsic range.`, R`At the same current and field, a thicker sample (along $\vec B$) gives a larger Hall voltage.`, R`For a single carrier type, $|R_H|\sigma$ gives the carrier mobility.`],
      answer: [0, 1, 3],
      sol: R`With both carriers $R_H = \dfrac{p\mu_p^2 - n\mu_n^2}{e(p\mu_p + n\mu_n)^2}$. Intrinsic ($n = p$) with $\mu_n > \mu_p$ gives $R_H < 0$. In a p-type sample $R_H > 0$ at first, but once heating makes $n\approx p$ the more mobile electrons win and $R_H$ turns negative. The Hall voltage is $V_H = \dfrac{IB}{net}$, smaller for a thicker sample $t$. For one carrier, $R_H = 1/ne$ and $\sigma = ne\mu$, so $|R_H|\sigma = \mu$ (the Hall mobility).`,
      trap: R`Assuming the sign of $R_H$ is fixed by the doping: it is set by $p\mu_p^2 - n\mu_n^2$, which temperature can flip.` },
    { id: 'sem-r4-06', type: 'mcq', level: 3, exams: A, sub: 'band gap',
      q: R`As the temperature of silicon rises from near $0$ K to $300$ K, its band gap`,
      options: [R`decreases slightly, from about $1.17$ eV to $1.12$ eV`, R`stays exactly constant, since it is a property of the crystal`, R`increases from $1.12$ eV to about $1.4$ eV`, R`falls to zero, which is why the conductivity rises`],
      answer: 0,
      sol: R`Thermal expansion and electron-phonon interaction shift the band edges so that the gap shrinks a little with temperature (an empirical fit is the Varshni formula). For silicon the change from $0$ to $300$ K is only about $0.05$ eV. The large rise in intrinsic conductivity comes from the factor $e^{-E_g/2kT}$, not from the small change in $E_g$.`,
      trap: R`Blaming the conductivity rise on a closing gap: the Boltzmann factor does almost all the work.` },
    { id: 'sem-r4-07', type: 'nat', level: 4, exams: G, sub: 'screening', unit: 'nm',
      q: R`n-type silicon ($\varepsilon_r = 11.7$) has $10^{16}$ cm$^{-3}$ ionised donors at $300$ K. Its extrinsic Debye length $L_D = \sqrt{\dfrac{\varepsilon k_BT}{e^2N_d}}$ is ______ nm (to one decimal place).`,
      answer: 40.9, tol: 0.4, calc: () => Math.sqrt(11.7 * C.eps0 * C.kB * 300 / (C.e ** 2 * 1e22)) * 1e9,
      sol: R`$N_d = 10^{16}$ cm$^{-3} = 10^{22}$ m$^{-3}$. $\dfrac{\varepsilon k_BT}{e^2N_d} = \dfrac{(11.7)(8.854\times10^{-12})(0.02585\ \text{V})}{(1.602\times10^{-19})(10^{22})} = 1.67\times10^{-15}$ m$^2$ (using $k_BT/e = 0.02585$ V), so $L_D = 4.09\times10^{-8}$ m $= 40.9$ nm. Charge imbalances smaller than this are smeared out; it also sets how sharply a depletion edge fades.`,
      trap: R`Forgetting the cm$^{-3}$ to m$^{-3}$ conversion (factor $10^6$) changes $L_D$ by a factor $10^3$.` },
    { id: 'sem-r4-08', type: 'mcq', level: 4, exams: G, sub: 'relaxation',
      q: R`n-type silicon with $N_d = 10^{16}$ cm$^{-3}$, $\mu_n = 1350$ cm$^2$/V s and $\varepsilon_r = 11.7$ has some excess majority charge put into it. The time over which this space charge disappears (the dielectric relaxation time) is about`,
      options: [R`$0.5\ \mu$s`, R`$1$ ns`, R`$0.5$ ps`, R`$5$ fs`],
      answer: 2,
      sol: R`Gauss's law plus Ohm's law give $\partial\rho/\partial t = -(\sigma/\varepsilon)\rho$, so $\tau_d = \varepsilon/\sigma$. $\sigma = eN_d\mu_n = (1.602\times10^{-19})(10^{22})(0.135) = 216$ S/m, and $\varepsilon = 11.7\times8.854\times10^{-12} = 1.04\times10^{-10}$ F/m. $\tau_d = 4.8\times10^{-13}$ s $\approx0.5$ ps. Majority carriers neutralise charge almost instantly; minority carriers, which must recombine, live for microseconds.`,
      trap: R`Confusing dielectric relaxation (majority carriers, picoseconds) with minority-carrier lifetime (recombination, often microseconds).` },
    { id: 'sem-r4-09', type: 'msq', level: 4, exams: G, sub: 'recombination', format: 'statements',
      q: R`Which statements about recombination in semiconductors are correct?`,
      options: [R`Shockley-Read-Hall recombination through traps is most effective for trap levels near the middle of the gap.`, R`Auger recombination grows rapidly with carrier density and dominates in very heavily doped or strongly injected material.`, R`For radiative recombination at low-level injection, the minority lifetime does not depend on the majority carrier density.`, R`In direct-gap materials such as GaAs, radiative band-to-band recombination is important.`],
      answer: [0, 1, 3],
      sol: R`In a direct gap an electron and hole can recombine and emit a photon without a phonon, so radiative recombination is fast (hence LEDs and lasers). SRH capture is most efficient when the trap is equally easy to fill from either band, i.e. near midgap. Auger involves three carriers, rate $\propto n^2p$ or $np^2$, so it rises steeply at high density. Radiative rate $= B(np - n_i^2)$; for holes in n-type, $\tau_p = 1/(Bn_0)$, which falls as the doping rises.`,
      trap: R`Treating lifetime as a fixed material constant: it depends on doping, trap density and injection level.` },
    { id: 'sem-r4-10', type: 'nat', level: 5, exams: G, sub: 'effective mass', unit: R`$m_e$`,
      q: R`Silicon's conduction band has $6$ equivalent ellipsoidal valleys, each with longitudinal mass $m_l = 0.98\,m_e$ and transverse mass $m_t = 0.19\,m_e$. Its density-of-states effective mass (which sets $N_c$) is ______ $m_e$ (to two decimal places).`,
      answer: 1.08, tol: 0.01, calc: () => 6 ** (2 / 3) * Math.cbrt(0.98 * 0.19 * 0.19),
      sol: R`One ellipsoidal valley has the same density of states as a sphere with mass $(m_lm_t^2)^{1/3} = (0.98\times0.0361)^{1/3} = 0.328\,m_e$. The density of states goes as $m^{3/2}$, and six valleys multiply it by 6, so $m_{\rm dos}^{3/2} = 6\,(m_lm_t^2)^{1/2}$, giving $m_{\rm dos} = 6^{2/3}(m_lm_t^2)^{1/3} = 3.30\times0.328 = 1.08\,m_e$.`,
      trap: R`Using the conductivity mass $3/(1/m_l + 2/m_t) = 0.26\,m_e$, or multiplying the single-valley mass by 6 instead of $6^{2/3}$.` },
  ],
  gens: [
    { id: 'sem-r4g1', type: 'nat', level: 2, exams: A, sub: 'mobility',
      make(r) {
        const [name, mu, m] = choose(r, [['electrons in silicon', 1400, 0.26], ['holes in silicon', 450, 0.39], ['electrons in GaAs', 8500, 0.067], ['electrons in germanium', 3900, 0.12], ['holes in germanium', 1900, 0.21]]);
        const tau = mu * 1e-4 * m * C.me / C.e * 1e12;
        return { q: R`For ${name}, the mobility is $${mu}$ cm$^2$/V s and the conductivity effective mass is $${m}\,m_e$. Their mean time between collisions is ______ ps (to three decimal places).`,
          answer: round(tau, 3), tol: Math.max(0.002, round(tau * 0.01, 3)), unit: 'ps', mu, m,
          sol: R`$\tau = \dfrac{\mu m^*}{e} = \dfrac{(${round(mu * 1e-4, 4)})(${m}\times9.11\times10^{-31})}{1.60\times10^{-19}} = ${round(tau, 3)}$ ps.`,
          trap: 'Convert cm²/V s to m²/V s (×10⁻⁴) first.' };
      },
      verify: (p) => p.mu * 1e-4 * p.m * C.me / C.e * 1e12 },
    { id: 'sem-r4g2', type: 'nat', level: 3, exams: G, sub: 'screening',
      make(r) {
        const [mat, er] = choose(r, [['silicon', 11.7], ['germanium', 16], ['GaAs', 12.9]]), e = choose(r, [14, 15, 16, 17, 18]), m = choose(r, [1, 2, 5]), T = choose(r, [77, 300, 400]);
        const N = m * 10 ** e * 1e6, LD = Math.sqrt(er * C.eps0 * C.kB * T / (C.e ** 2 * N)) * 1e9;
        return { q: R`${mat[0].toUpperCase() + mat.slice(1)} ($\varepsilon_r = ${er}$) at $${T}$ K has $${m === 1 ? '' : `${m}\\times`}10^{${e}}$ cm$^{-3}$ ionised donors. Its Debye length $\sqrt{\varepsilon k_BT/e^2N_d}$ is ______ nm (to two decimal places).`,
          answer: round(LD, 2), tol: Math.max(0.01, round(LD * 0.005, 2)), unit: 'nm', er, N, T,
          sol: R`$N_d = ${m === 1 ? '' : `${m}\\times`}10^{${e + 6}}$ m$^{-3}$, $k_BT/e = ${round(C.kB * T / C.e, 5)}$ V. $L_D = \sqrt{\dfrac{${er}\times8.854\times10^{-12}\times${round(C.kB * T / C.e, 5)}}{1.602\times10^{-19}\times N_d}} = ${round(LD, 2)}$ nm.`,
          trap: 'L_D falls as 1/√N: 100 times the doping gives a tenth of the length.' };
      },
      verify: (p) => Math.sqrt(p.er * C.eps0 * C.kB * p.T / (C.e ** 2 * p.N)) * 1e9 },
    { id: 'sem-r4g3', type: 'nat', level: 3, exams: G, sub: 'relaxation',
      make(r) {
        const e = choose(r, [14, 15, 16, 17]), m = choose(r, [1, 2, 5]), mu = choose(r, [400, 800, 1000, 1350]), er = choose(r, [11.7, 12.9, 16]);
        const N = m * 10 ** e * 1e6, sig = C.e * N * mu * 1e-4, tau = er * C.eps0 / sig * 1e12;
        return { q: R`A doped semiconductor ($\varepsilon_r = ${er}$) has $${m === 1 ? '' : `${m}\\times`}10^{${e}}$ cm$^{-3}$ majority carriers of mobility $${mu}$ cm$^2$/V s. Its dielectric relaxation time $\varepsilon/\sigma$ is ______ ps (to three significant figures).`,
          answer: +tau.toPrecision(3), tol: +(tau * 0.01).toPrecision(2), unit: 'ps', er, N, mu,
          sol: R`$\sigma = eN\mu = (1.602\times10^{-19})(${m === 1 ? '' : `${m}\\times`}10^{${e + 6}})(${round(mu * 1e-4, 4)}) = ${+sig.toPrecision(3)}$ S/m. $\tau_d = \dfrac{${er}\times8.854\times10^{-12}}{${+sig.toPrecision(3)}} = ${+tau.toPrecision(3)}$ ps.`,
          trap: 'Dielectric relaxation is set by the majority carriers and is very fast; it is not the minority lifetime.' };
      },
      verify: (p) => p.er * C.eps0 / (C.e * p.N * p.mu * 1e-4) * 1e12 },
  ],
};
