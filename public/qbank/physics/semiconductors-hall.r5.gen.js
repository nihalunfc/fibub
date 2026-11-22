// Round 5 extras for semiconductors-hall: original questions, written 2026-11-22.
import { pick, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
const JG = ['jam', 'gate', 'net'];
const KT = (T) => 8.617333e-5 * T; // eV
const diffL = (mu, T, tau) => Math.sqrt(mu * KT(T) * tau * 1e-6) * 1e4; // um, mu in cm^2/Vs, tau in us

export default {
  items: [
    { id: 'shl-r5-01', type: 'mcq', level: 1, exams: JG, sub: 'carrier statistics',
      q: R`Silicon at 300 K ($n_i = 1.0\times10^{10}$ cm$^{-3}$) is doped with $1.0\times10^{16}$ donors per cm$^3$, all ionised. The hole density is`,
      options: [R`$1.0\times10^{10}$ cm$^{-3}$`, R`$1.0\times10^{4}$ cm$^{-3}$`, R`$1.0\times10^{16}$ cm$^{-3}$`, R`$1.0\times10^{6}$ cm$^{-3}$`], answer: 1,
      sol: R`In equilibrium $np = n_i^2$ (mass-action law). With $n\approx N_d = 10^{16}$ cm$^{-3}$, $p = n_i^2/n = 10^{20}/10^{16} = 10^4$ cm$^{-3}$. Doping raises the majority density and suppresses the minority density by the same factor.`,
      trap: R`Holes are not left at $n_i$: extra electrons recombine with them until $np = n_i^2$.` },
    { id: 'shl-r5-02', type: 'nat', level: 2, exams: JG, sub: 'drift and diffusion',
      q: R`Holes in germanium have mobility $1900$ cm$^2$/V s at $300$ K. From the Einstein relation, their diffusion coefficient is ______ cm$^2$/s (to one decimal place). Take $k_BT/e = 25.85$ mV.`,
      answer: 49.1, tol: 0.1, calc: () => 1900 * 0.02585,
      sol: R`$D = \mu k_BT/e = 1900\times0.02585 = 49.1$ cm$^2$/s. The same random thermal motion that resists drift (setting $\mu$) also drives diffusion, so the two are tied by the thermal voltage.`,
      trap: R`Using $k_BT$ in joules with $\mu$ in cm$^2$/V s, or dividing instead of multiplying.` },
    { id: 'shl-r5-03', type: 'mcq', level: 2, exams: JG, sub: 'Fermi level',
      q: R`An n-type silicon sample at $300$ K has $n = 1.0\times10^{17}$ cm$^{-3}$ and conduction-band effective density of states $N_c = 2.8\times10^{19}$ cm$^{-3}$ (non-degenerate). The Fermi level lies below the conduction-band edge by about`,
      options: [R`$0.56$ eV`, R`$0.063$ eV`, R`$0.40$ eV`, R`$0.146$ eV`], answer: 3,
      sol: R`$n = N_ce^{-(E_c - E_F)/k_BT}$, so $E_c - E_F = k_BT\ln(N_c/n) = 0.02585\ln280 = 0.02585\times5.635 = 0.146$ eV.`,
      trap: R`$0.063$ eV comes from $\log_{10}$; $0.56$ eV is mid-gap, the intrinsic position.` },
    { id: 'shl-r5-04', type: 'nat', level: 3, exams: JG, sub: 'drift and diffusion',
      q: R`Minority electrons in a p-type region have diffusion coefficient $12$ cm$^2$/s and lifetime $1.0\ \mu$s. Their diffusion length $\sqrt{D\tau}$ is ______ $\mu$m (to one decimal place).`,
      answer: 34.6, tol: 0.1, calc: () => Math.sqrt(12 * 1e-6) * 1e4,
      sol: R`$D\tau = 12\times1.0\times10^{-6} = 1.2\times10^{-5}$ cm$^2$, so $L = 3.46\times10^{-3}$ cm $= 34.6\ \mu$m. It is the typical distance an injected carrier wanders before it recombines.`,
      trap: R`Remember the unit: $\sqrt{\text{cm}^2}$ gives cm, and $1$ cm $= 10^4\ \mu$m.` },
    { id: 'shl-r5-05', type: 'msq', level: 3, exams: G, sub: 'quasi-Fermi levels', format: 'statements',
      q: R`An n-type semiconductor is steadily illuminated, creating extra electron-hole pairs (low-level injection). Which statements are correct?`,
      options: [R`The product $np$ is now larger than $n_i^2$.`, R`The splitting of the quasi-Fermi levels is $E_{Fn} - E_{Fp} = k_BT\ln(np/n_i^2)$.`, R`The electron quasi-Fermi level hardly moves, while the hole quasi-Fermi level moves a lot.`, R`A single Fermi level still describes both electrons and holes.`], answer: [0, 1, 2],
      sol: R`Generation pushes the system out of equilibrium, so $np > n_i^2$. Writing $n = n_ie^{(E_{Fn} - E_i)/k_BT}$ and $p = n_ie^{(E_i - E_{Fp})/k_BT}$ gives the splitting formula. With low-level injection the extra electrons are a tiny fraction of the many majority electrons, so $E_{Fn}$ barely shifts, while the hole density may rise by orders of magnitude, moving $E_{Fp}$ strongly. Only in equilibrium do the two levels coincide.`,
      trap: R`The quasi-Fermi level splitting is what sets a solar cell's open-circuit voltage.` },
    { id: 'shl-r5-06', type: 'nat', level: 4, exams: JG, sub: 'Hall measurements',
      q: R`A single-carrier semiconductor film $0.50$ mm thick carries $1.0$ mA in a field of $0.50$ T and shows a Hall voltage of $6.24$ mV. Its resistivity is $0.050\ \Omega$ m. The Hall mobility is ______ cm$^2$/V s (to the nearest 10).`,
      answer: 1250, tol: 10, calc: () => 6.24e-3 * 5e-4 / (1e-3 * 0.5) / 0.05 * 1e4,
      sol: R`$|R_H| = V_Ht/(IB) = 6.24\times10^{-3}\times5.0\times10^{-4}/(1.0\times10^{-3}\times0.50) = 6.24\times10^{-3}$ m$^3$/C (so $n = 1/|R_H|e = 1.0\times10^{21}$ m$^{-3}$). Mobility $\mu = |R_H|/\rho = 6.24\times10^{-3}/0.050 = 0.125$ m$^2$/V s $= 1250$ cm$^2$/V s.`,
      trap: R`$1$ m$^2$/V s $= 10^4$ cm$^2$/V s; and the thickness that matters is the one along $B$.` },
    { id: 'shl-r5-07', type: 'mcq', level: 3, exams: JG, sub: 'compensation',
      q: R`A silicon sample contains $5\times10^{16}$ donors and $2\times10^{16}$ acceptors per cm$^3$, all ionised. Compared with a sample doped with $3\times10^{16}$ donors only,`,
      options: [R`it has the same electron density but lower mobility`, R`it has the same electron density and the same mobility`, R`it has more electrons, since it has more donors`, R`it is p-type`], answer: 0,
      sol: R`Acceptors take electrons from donors, so $n = N_d - N_a = 3\times10^{16}$ cm$^{-3}$, the same as the other sample. But all $7\times10^{16}$ ionised impurities scatter carriers, against $3\times10^{16}$ in the other, so ionised-impurity scattering is stronger and the mobility is lower.`,
      trap: R`Compensation cancels charge carriers but not scattering centres.` },
    { id: 'shl-r5-08', type: 'msq', level: 4, exams: G, sub: 'carrier density against temperature', format: 'statements',
      q: R`A plot of $\ln n$ against $1/T$ for an n-type semiconductor (donor level $E_d$ below $E_c$, no acceptors) is examined. Which statements are correct?`,
      options: [R`At low temperature (freeze-out) the slope is $-E_d/2k_B$.`, R`Over a middle range of temperature $n\approx N_d$ (saturation).`, R`The intrinsic region starts at a higher temperature in a wider-gap material at the same doping.`, R`In the intrinsic region the slope is $-E_d/k_B$.`], answer: [0, 1, 2],
      sol: R`Uncompensated freeze-out gives $n\approx\sqrt{N_cN_d/2}\,e^{-E_d/2k_BT}$, so the slope is $-E_d/2k_B$. Once all donors are ionised $n = N_d$ until $n_i$ catches up. Since $n_i\propto e^{-E_g/2k_BT}$, a larger gap needs a higher temperature to reach $N_d$. In the intrinsic region the slope is $-E_g/2k_B$, set by the gap, not by the donors.`,
      trap: R`The intrinsic slope involves $E_g$; the freeze-out slope involves $E_d$, both with a factor $\tfrac12$ here.` },
    { id: 'shl-r5-09', type: 'nat', level: 5, exams: JG, sub: 'drift and diffusion',
      q: R`Light absorbed at the surface of an n-type wafer injects holes, which diffuse inward and recombine. The holes have mobility $480$ cm$^2$/V s and lifetime $2.0\ \mu$s at $300$ K ($k_BT/e = 25.85$ mV). The excess hole density falls to $10\%$ of its surface value at a depth of ______ $\mu$m (to the nearest $\mu$m).`,
      answer: 115, tol: 1, calc: () => diffL(480, 300, 2) * Math.log(10),
      sol: R`$D = 480\times0.02585 = 12.41$ cm$^2$/s. $L = \sqrt{D\tau} = \sqrt{12.41\times2.0\times10^{-6}} = 4.98\times10^{-3}$ cm $= 49.8\ \mu$m. In a thick wafer $\Delta p(x) = \Delta p(0)e^{-x/L}$, so the depth for $10\%$ is $L\ln10 = 49.8\times2.303 = 115\ \mu$m.`,
      trap: R`Answering $L$ itself gives the $1/e$ (37%) depth, not the 10% depth.` },
    { id: 'shl-r5-10', type: 'mcq', level: 4, exams: G, sub: 'carrier statistics',
      q: R`An n-type sample is doped so heavily that $n$ approaches and exceeds $N_c$. Which statement best describes what happens?`,
      options: [R`$n = N_ce^{-(E_c - E_F)/k_BT}$ still holds exactly, with $E_F$ above $E_c$`, R`the mass-action law $np = n_i^2$ becomes more accurate`, R`$E_F$ moves into the conduction band, the Boltzmann approximation fails and the full Fermi-Dirac integral is needed; the sample behaves like a poor metal`, R`the donors freeze out completely, so $n$ falls to zero`], answer: 2,
      sol: R`The simple exponential relies on $E_c - E_F\gg k_BT$, so that $f\approx e^{-(E - E_F)/k_BT}$. When $n\gtrsim N_c$ the Fermi level reaches or enters the band and the occupation of low-lying states approaches 1; the Fermi-Dirac integral $F_{1/2}$ is needed, $np$ is less than the Boltzmann prediction, and the sample conducts even at very low temperature (degenerate semiconductor). In addition, the donor levels merge into a band (the Mott transition), so freeze-out does not occur.`,
      trap: R`The Boltzmann formula would let $n$ grow without limit as $E_F$ rises; Pauli exclusion stops that.` },
  ],
  gens: [
    { id: 'shl-r5g1', type: 'nat', level: 2, exams: JG, sub: 'drift and diffusion',
      make(r) {
        const T = choose(r, [77, 200, 250, 300, 350, 400]), mu = pick(r, 100, 8000, 50), ask = choose(r, ['D', 'mu']);
        const D = mu * KT(T);
        return { q: ask === 'D'
            ? R`Carriers with mobility $${mu}$ cm$^2$/V s at $${T}$ K have diffusion coefficient ______ cm$^2$/s (to two decimal places), from the Einstein relation.`
            : R`Carriers at $${T}$ K have diffusion coefficient $${round(D, 3)}$ cm$^2$/s. From the Einstein relation their mobility is ______ cm$^2$/V s (to the nearest whole number).`,
          answer: ask === 'D' ? round(D, 2) : Math.round(round(D, 3) / KT(T)), tol: ask === 'D' ? Math.max(0.01, round(D * 0.002, 2)) : Math.max(1, Math.round(mu * 0.002)), T, mu, ask, D3: round(D, 3),
          sol: ask === 'D' ? R`$k_BT/e = ${round(KT(T) * 1000, 3)}$ mV, so $D = \mu k_BT/e = ${mu}\times${round(KT(T), 5)} = ${round(D, 2)}$ cm$^2$/s.` : R`$\mu = D/(k_BT/e) = ${round(D, 3)}/${round(KT(T), 5)} = ${Math.round(round(D, 3) / KT(T))}$ cm$^2$/V s.`,
          trap: 'The thermal voltage changes with temperature: $k_BT/e = 8.617\\times10^{-5}T$ V.' };
      },
      verify: (p) => (p.ask === 'D' ? p.mu * KT(p.T) : p.D3 / KT(p.T)) },
    { id: 'shl-r5g2', type: 'nat', level: 3, exams: JG, sub: 'Fermi level',
      make(r) {
        const [mat, Nc] = choose(r, [['silicon', 2.8e19], ['germanium', 1.04e19], ['gallium arsenide', 4.7e17]]);
        const e = choose(r, [14, 15, 16]), m = choose(r, [1, 2, 5]), n = m * 10 ** e, E = KT(300) * Math.log(Nc / n);
        return { q: R`n-type ${mat} at $300$ K has $n = ${m}\times10^{${e}}$ cm$^{-3}$ and $N_c = ${+(Nc / 10 ** Math.floor(Math.log10(Nc))).toPrecision(3)}\times10^{${Math.floor(Math.log10(Nc))}}$ cm$^{-3}$. The Fermi level lies ______ eV below the conduction-band edge (to three decimal places).`,
          answer: round(E, 3), tol: 0.002, Nc, n,
          sol: R`$E_c - E_F = k_BT\ln(N_c/n) = 0.02585\times\ln${round(Nc / n, 2)} = ${round(E, 3)}$ eV.`,
          trap: 'Use the natural logarithm, and $N_c$ in the same units as $n$.' };
      },
      verify: (p) => KT(300) * Math.log(p.Nc / p.n) },
    { id: 'shl-r5g3', type: 'mcq', level: 4, exams: JG, sub: 'drift and diffusion',
      make(r) {
        const mu = pick(r, 200, 1500, 50), tau = choose(r, [0.1, 0.5, 1, 2, 5, 10]), frac = choose(r, [50, 10, 1]);
        const L = diffL(mu, 300, tau), x = L * Math.log(100 / frac);
        const sh = (v) => `$${+v.toPrecision(3)}\\ \\mu$m`;
        const o = mcqOptions(r, x, [L, L * Math.log10(100 / frac), x * x / L, L / (frac / 100)], sh);
        return { q: R`Minority carriers injected at a surface have mobility $${mu}$ cm$^2$/V s and lifetime $${tau}\ \mu$s at $300$ K. In a thick sample their excess density falls to $${frac}\%$ of the surface value at a depth of about`, ...o,
          sol: R`$D = \mu k_BT/e = ${round(mu * KT(300), 2)}$ cm$^2$/s, $L = \sqrt{D\tau} = ${+L.toPrecision(3)}\ \mu$m. The profile is $e^{-x/L}$, so $x = L\ln(100/${frac}) = ${+x.toPrecision(3)}\ \mu$m.`,
          trap: 'The diffusion length is the $1/e$ depth; other fractions need the logarithm.' };
      } },
  ],
};
