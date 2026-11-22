// Round 4 extras for semiconductors-hall: original questions, written 2026-11-22.
import { pick, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
const A = ['jam', 'gate', 'net'];
const KB = 8.617333e-5; // eV/K

// Sheet resistance from the van der Pauw equation exp(-pi RA/Rs) + exp(-pi RB/Rs) = 1 (bisection, fixed steps).
const vdp = (RA, RB) => {
  let lo = 0.1 * Math.min(RA, RB), hi = 10 * Math.max(RA, RB);
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (Math.exp(-Math.PI * RA / m) + Math.exp(-Math.PI * RB / m) < 1) lo = m; else hi = m; }
  return (lo + hi) / 2;
};
const onsetT = () => {
  const ni = (T) => 1e16 * (T / 300) ** 1.5 * Math.exp(-(1.12 / (2 * KB)) * (1 / T - 1 / 300));
  let lo = 300, hi = 1500;
  for (let i = 0; i < 100; i++) { const m = (lo + hi) / 2; if (ni(m) < 1e21) lo = m; else hi = m; }
  return lo;
};

export default {
  items: [
    { id: 'shl-r4-01', type: 'mcq', level: 1, exams: A, sub: 'Hall effect',
      q: R`An n-type semiconductor bar (all donors ionised, intrinsic carriers negligible) shows a Hall voltage $V_H$ at a given current and magnetic field. An otherwise identical bar with twice the donor density, at the same current and field, shows`,
      options: [R`$2V_H$`, R`$V_H/2$`, R`the same $V_H$`, R`$V_H/4$`], answer: 1,
      sol: R`$V_H = IB/(nqt)$ for a bar of thickness $t$. With twice the carriers, each moves half as fast for the same current, so the magnetic force and the Hall field are halved: $V_H/2$. This is why Hall sensors use lightly doped semiconductors rather than metals.`,
      trap: R`More carriers do not mean more Hall voltage; the Hall voltage measures the drift speed, which falls.` },
    { id: 'shl-r4-02', type: 'mcq', level: 2, exams: G, sub: 'van der Pauw',
      q: R`A thin, uniform film of arbitrary shape has four small contacts on its edge. Both van der Pauw resistances (current through two adjacent contacts, voltage across the other two) are $10.0\ \Omega$. Its sheet resistance is`,
      options: [R`$10.0\ \Omega$ per square`, R`$31.4\ \Omega$ per square`, R`$45.3\ \Omega$ per square`, R`$6.93\ \Omega$ per square`], answer: 2,
      sol: R`Van der Pauw's theorem: $e^{-\pi R_A/R_s} + e^{-\pi R_B/R_s} = 1$. With $R_A = R_B = R$, $e^{-\pi R/R_s} = \tfrac12$, so $R_s = \pi R/\ln2 = 4.53R = 45.3\ \Omega$ per square. The film's shape does not matter, as long as it is uniform, has no holes and the contacts are small and on the edge.`,
      trap: R`$\pi R$ forgets the $\ln2$; the measured four-point resistance is much smaller than the sheet resistance.` },
    { id: 'shl-r4-03', type: 'nat', level: 2, exams: A, sub: 'Hall effect',
      q: R`An n-type sample has Hall coefficient $R_H = -2.5\times10^{-3}$ m$^3$/C and conductivity $100$ S/m (single carrier type, Hall factor 1). The electron mobility is ______ m$^2$/V s (to two decimal places).`,
      answer: 0.25, tol: 0.005, calc: () => 2.5e-3 * 100,
      sol: R`$|R_H| = 1/(ne)$ and $\sigma = ne\mu$, so $\mu = |R_H|\sigma = 2.5\times10^{-3}\times100 = 0.25$ m$^2$/V s. The carrier density is $1/(e|R_H|) = 2.5\times10^{21}$ m$^{-3}$.`,
      trap: R`Dividing $\sigma$ by $R_H$ instead of multiplying; check the units: (m$^3$/C)(S/m) = m$^2$/V s.` },
    { id: 'shl-r4-04', type: 'nat', level: 3, exams: A, sub: 'Fermi level',
      q: R`Silicon at $300$ K ($k_BT = 25.85$ meV, effective density of states $N_c = 2.8\times10^{25}$ m$^{-3}$) is doped with $1.0\times10^{22}$ m$^{-3}$ fully ionised donors. The Fermi level lies ______ eV below the conduction band edge (to three decimal places).`,
      answer: 0.205, tol: 0.002, calc: () => 0.02585 * Math.log(2.8e25 / 1e22),
      sol: R`For a non-degenerate semiconductor $n = N_ce^{-(E_c - E_F)/k_BT}$, and here $n = N_d$. So $E_c - E_F = k_BT\ln(N_c/N_d) = 0.02585\ln2800 = 0.02585\times7.937 = 0.205$ eV. Ten times more doping moves $E_F$ up by $k_BT\ln10 = 60$ meV.`,
      trap: R`Using $\log_{10}$ gives $0.089$ eV.` },
    { id: 'shl-r4-05', type: 'mcq', level: 3, exams: G, sub: 'Hall effect',
      q: R`In a Hall measurement the two Hall contacts are not exactly opposite each other, so part of the longitudinal voltage drop appears between them. The usual way to remove this offset is to`,
      options: [R`raise the current until the offset is negligible`, R`cool the sample`, R`use a thinner sample`, R`average readings taken with the magnetic field reversed, since the Hall voltage changes sign and the offset does not`], answer: 3,
      sol: R`The misalignment voltage is $IR$ for a small longitudinal resistance $R$: it is proportional to $I$ but even in $B$. The Hall voltage is odd in $B$. Half the difference of readings at $+B$ and $-B$ keeps the Hall part and cancels the offset. Reversing the current does not help, because both parts change sign with $I$.`,
      trap: R`Raising the current scales both voltages together; only reversing the field separates them.` },
    { id: 'shl-r4-06', type: 'mcq', level: 4, exams: G, sub: 'quasi-Fermi levels',
      q: R`Silicon with $n_0 = 1.0\times10^{22}$ m$^{-3}$ electrons ($n_i = 1.0\times10^{16}$ m$^{-3}$) is steadily illuminated, creating $1.0\times10^{19}$ m$^{-3}$ extra electron-hole pairs. Which describes the quasi-Fermi levels?`,
      options: [R`The hole quasi-Fermi level moves far towards the valence band while the electron one hardly moves`, R`Both move by the same amount, in opposite directions`, R`The electron quasi-Fermi level moves far towards the conduction band while the hole one hardly moves`, R`Neither moves, because the extra density is small`], answer: 0,
      sol: R`In the dark $p_0 = n_i^2/n_0 = 10^{10}$ m$^{-3}$. Light makes $p\approx10^{19}$ m$^{-3}$, $10^9$ times more, so $F_p$ moves by $k_BT\ln10^9\approx0.54$ eV towards the valence band. The electrons grow by only $0.1\%$, so $F_n$ moves by $k_BT\times0.001\approx26\ \mu$eV. Under low injection, it is the minority carriers whose quasi-Fermi level shows the light.`,
      trap: R`Equal numbers of extra carriers are not equal relative changes: the minorities change enormously.` },
    { id: 'shl-r4-07', type: 'msq', level: 2, exams: A, sub: 'Hall effect', format: 'statements',
      q: R`For a Hall measurement on a bar with one type of carrier, which statements are correct?`,
      options: [R`$R_H = 1/(qn)$ with $q$ the carrier charge, so n-type samples give a negative Hall coefficient.`, R`At fixed current and field, a thinner bar gives a larger Hall voltage.`, R`The Hall voltage is proportional to the product of the current and the magnetic field.`, R`A more heavily doped bar gives a larger Hall voltage.`], answer: [0, 1, 2],
      sol: R`Balancing $qE_H = qvB$ with $I = nqvwt$ gives $E_H = IB/(nqwt)$ and $V_H = E_Hw = IB/(nqt)$. So $V_H\propto IB/(nt)$: thinner is larger, more carriers smaller. $R_H = E_H/(JB) = 1/(nq)$ takes the sign of the carrier charge.`,
      trap: R`A thin bar has a smaller cross-section, so the carriers move faster for the same current: larger Hall voltage.` },
    { id: 'shl-r4-08', type: 'msq', level: 4, exams: G, sub: 'drift and diffusion', format: 'statements',
      q: R`In the Haynes-Shockley experiment a short pulse of minority carriers is injected into a bar with a steady drift field and detected some distance downstream. Which statements are correct?`,
      options: [R`The pulse moves at $\mu E$, so its arrival time gives the minority-carrier drift mobility.`, R`The pulse spreads as it travels, its width growing as $\sqrt{Dt}$, which gives the diffusion constant.`, R`The area of the detected pulse falls as $e^{-t/\tau}$, which gives the minority-carrier lifetime.`, R`The experiment measures the majority-carrier mobility.`], answer: [0, 1, 2],
      sol: R`The injected excess obeys $\partial p/\partial t = D\partial^2p/\partial x^2 - \mu E\partial p/\partial x - p/\tau$: a Gaussian whose centre drifts at $\mu E$, whose width grows by diffusion ($\sigma = \sqrt{2Dt}$) and whose area decays by recombination. All three properties belong to the minority carriers, which is what makes the experiment special; the majority carriers simply keep the bar neutral.`,
      trap: R`The majority carriers neutralise the pulse but do not travel with it; the pulse moves with the minority-carrier mobility.` },
    { id: 'shl-r4-09', type: 'nat', level: 4, exams: G, sub: 'drift and diffusion',
      q: R`In a Haynes-Shockley experiment at $300$ K ($k_BT/e = 25.85$ mV), a pulse of holes takes $250\ \mu$s to drift $1.0$ cm in a field of $200$ V/m. Using the Einstein relation, the hole diffusion constant is ______ cm$^2$/s (to one decimal place).`,
      answer: 51.7, tol: 0.2, calc: () => (0.01 / 250e-6 / 200) * 0.02585 * 1e4,
      sol: R`Drift speed $= 0.010/250\times10^{-6} = 40$ m/s, so $\mu = 40/200 = 0.20$ m$^2$/V s. Einstein: $D = \mu k_BT/e = 0.20\times0.02585 = 5.17\times10^{-3}$ m$^2$/s $= 51.7$ cm$^2$/s (these are typical of holes in germanium).`,
      trap: R`Converting m$^2$/s to cm$^2$/s multiplies by $10^4$, not $10^2$.` },
    { id: 'shl-r4-10', type: 'nat', level: 5, exams: G, sub: 'carrier density against temperature',
      q: R`Silicon has $n_i = 1.0\times10^{16}$ m$^{-3}$ at $300$ K, with $n_i\propto T^{3/2}e^{-E_g/2k_BT}$ and $E_g = 1.12$ eV (take it constant). A sample doped with $1.0\times10^{21}$ m$^{-3}$ donors enters its intrinsic regime roughly where $n_i$ equals the donor density. That temperature is ______ K (to the nearest kelvin).`,
      answer: 583, tol: 2, calc: onsetT,
      sol: R`Require $\left(\dfrac{T}{300}\right)^{3/2}\exp\left[-\dfrac{E_g}{2k_B}\left(\dfrac1T - \dfrac1{300}\right)\right] = 10^5$, with $E_g/2k_B = 6499$ K. Ignoring the power first: $6499(1/300 - 1/T) = \ln10^5 = 11.51$ gives $T = 640$ K. At that temperature $(T/300)^{3/2}\approx3.1$, which lowers the target to $\ln(10^5/3.1) = 10.38$ and gives $T\approx576$ K; there the factor is $2.66$, and one more round settles at $T\approx583$ K. Above this the donors no longer control the conductivity.`,
      trap: R`Dropping the $T^{3/2}$ factor overestimates the temperature by almost 60 K.` },
    { id: 'shl-r4-11', type: 'mcq', level: 5, exams: G, sub: 'Hall factor',
      q: R`In a non-degenerate semiconductor dominated by ionised-impurity scattering, the relaxation time varies as $\tau\propto E^{3/2}$. The Hall factor $r_H = \langle\tau^2\rangle/\langle\tau\rangle^2$ (averages over the Maxwell-Boltzmann distribution, weighted as in transport) is about`,
      options: [R`$1.93$`, R`$1.18$`, R`$1.00$`, R`$0.85$`], answer: 0,
      sol: R`For $\tau\propto E^s$, $r_H = \dfrac{\Gamma(5/2)\Gamma(5/2 + 2s)}{\Gamma(5/2 + s)^2}$. With $s = 3/2$: $\dfrac{\Gamma(5/2)\Gamma(11/2)}{\Gamma(4)^2} = \dfrac{1.329\times52.34}{36} = 1.93$ $(= 315\pi/512)$. So a Hall measurement read as $1/(ne)$ underestimates $n$ by almost a factor of 2. For acoustic-phonon scattering ($s = -\tfrac12$) the factor is $3\pi/8 = 1.18$.`,
      trap: R`$1.18$ is the acoustic-phonon value; the faster energy dependence of impurity scattering spreads $\tau$ more and raises $r_H$.` },
    { id: 'shl-r4-12', type: 'mcq', level: 3, exams: A, sub: 'compensation',
      q: R`A silicon sample contains $5.0\times10^{22}$ m$^{-3}$ donors and $2.0\times10^{22}$ m$^{-3}$ acceptors, all ionised, and its electron mobility is $0.12$ m$^2$/V s (holes negligible). Its conductivity is about`,
      options: [R`$1346$ S/m`, R`$577$ S/m`, R`$961$ S/m`, R`$384$ S/m`], answer: 1,
      sol: R`The acceptors capture electrons from donors, so $n = N_d - N_a = 3.0\times10^{22}$ m$^{-3}$. $\sigma = ne\mu = 3.0\times10^{22}\times1.602\times10^{-19}\times0.12 = 577$ S/m. (All $7\times10^{22}$ ionised centres still scatter the electrons, which is already in the quoted mobility.)`,
      trap: R`Adding the dopant densities counts acceptors as if they gave electrons.` },
  ],
  gens: [
    { id: 'shl-r4g1', type: 'nat', level: 3, exams: A, sub: 'Fermi level',
      make(r) {
        const [mat, Nc300, Nv300] = choose(r, [['silicon', 2.8e25, 1.04e25], ['germanium', 1.04e25, 6.0e24], ['gallium arsenide', 4.7e23, 7.0e24]]);
        const type = choose(r, ['n', 'p']), T = choose(r, [200, 250, 300, 350, 400]), N0 = type === 'n' ? Nc300 : Nv300;
        const Neff = N0 * (T / 300) ** 1.5, m = choose(r, [1, 2, 5]), ex = choose(r, [20, 21, 22]), Nd = m * 10 ** ex;
        const kT = KB * T, val = kT * Math.log(Neff / Nd);
        return { q: `${mat[0].toUpperCase() + mat.slice(1)} at $${T}$ K has effective density of states $N_{${type === 'n' ? 'c' : 'v'}} = ${+(N0 / 10 ** Math.floor(Math.log10(N0))).toFixed(2)}\\times10^{${Math.floor(Math.log10(N0))}}$ m$^{-3}$ at 300 K (scaling as $T^{3/2}$). It is doped with $${m}\\times10^{${ex}}$ m$^{-3}$ fully ionised ${type === 'n' ? 'donors' : 'acceptors'}. The Fermi level lies ______ eV ${type === 'n' ? 'below the conduction band edge' : 'above the valence band edge'} (to three decimal places).`,
          answer: round(val, 3), tol: 0.002, N0, T, Nd,
          sol: `$N_{eff} = N(300)\\times(${T}/300)^{3/2} = ${Neff.toExponential(3).replace(/e\+?(-?\d+)/, '\\times10^{$1}')}$ m$^{-3}$ and $k_BT = ${round(kT * 1000, 2)}$ meV. Non-degenerate statistics: ${type === 'n' ? '$E_c - E_F$' : '$E_F - E_v$'} $= k_BT\\ln(N_{eff}/N) = ${round(kT, 5)}\\times\\ln(${round(Neff / Nd, 1)}) = ${round(val, 3)}$ eV.`,
          trap: 'Forgetting to scale the effective density of states with $T^{3/2}$, or using $\\log_{10}$.' };
      },
      verify: (p) => KB * p.T * Math.log(p.N0 * (p.T / 300) ** 1.5 / p.Nd) },
    { id: 'shl-r4g2', type: 'nat', level: 3, exams: G, sub: 'van der Pauw',
      make(r) {
        const RA = pick(r, 1, 100, 0.5), RB = choose(r, [1, 1, 1.5, 2, 3]) * RA, ask = choose(r, ['Rs', 'rho']), t = pick(r, 0.2, 5, 0.1);
        const Rs = vdp(RA, round(RB, 2)), val = ask === 'Rs' ? Rs : Rs * t * 1e-4; // rho in ohm cm from t in micrometres
        return { q: `A uniform film${ask === 'rho' ? ` $${t}\\ \\mu$m thick` : ''} gives van der Pauw resistances $R_A = ${RA}\\ \\Omega$ and $R_B = ${round(RB, 2)}\\ \\Omega$. ${ask === 'Rs' ? 'Its sheet resistance is ______ $\\Omega$ per square' : 'Its resistivity is ______ $\\Omega$ cm'} (to ${ask === 'Rs' ? 'two decimal places' : 'four significant figures'}). Use $e^{-\\pi R_A/R_s} + e^{-\\pi R_B/R_s} = 1$.`,
          answer: ask === 'Rs' ? round(val, 2) : +val.toPrecision(4), tol: ask === 'Rs' ? Math.max(0.01, round(val * 0.002, 2)) : val * 0.003, RA, RB: round(RB, 2), t, ask,
          sol: `${RA === round(RB, 2) ? `With equal resistances, $R_s = \\pi R/\\ln2 = 4.532\\times${RA}$.` : `Solve $e^{-\\pi\\cdot${RA}/R_s} + e^{-\\pi\\cdot${round(RB, 2)}/R_s} = 1$ numerically (for example by bisection between ${RA} and ${round(10 * RB, 1)}).`} $R_s = ${round(Rs, 2)}\\ \\Omega$ per square.${ask === 'rho' ? ` Resistivity $\\rho = R_st = ${round(Rs, 2)}\\times${t}\\times10^{-4}$ cm $= ${+val.toPrecision(4)}\\ \\Omega$ cm.` : ''}`,
          trap: 'Taking the measured resistance itself as the sheet resistance; the van der Pauw factor is about 4.5.' };
      },
      verify: (p) => { const Rs = vdp(p.RA, p.RB); return p.ask === 'Rs' ? Rs : Rs * p.t * 1e-4; } },
    { id: 'shl-r4g3', type: 'mcq', level: 3, exams: G, sub: 'drift and diffusion',
      make(r) {
        const d = pick(r, 0.5, 2.0, 0.1), Ef = choose(r, [100, 150, 200, 250, 300, 400]), tt = pick(r, 50, 500, 10), T = choose(r, [77, 300]), ask = choose(r, ['mu', 'D']);
        const mu = (d / 100) / (tt * 1e-6) / Ef, D = mu * KB * T * 1e4; // m^2/Vs, cm^2/s
        const val = ask === 'mu' ? mu * 1e4 : D; // both in cm units
        const o = mcqOptions(r, +val.toPrecision(3), ask === 'mu' ? [+(val / 100).toPrecision(3), +((d / 100) / (tt * 1e-6)).toPrecision(3), +(val * 2).toPrecision(3), +(val / 2).toPrecision(3)] : [+(D / 100).toPrecision(3), +(mu * 1e4).toPrecision(3), +(D * 300 / T === D ? D * 2 : D * 300 / T).toPrecision(3), +(D * 2).toPrecision(3)], (v) => `$${v}$ ${ask === 'mu' ? 'cm$^2$/V s' : 'cm$^2$/s'}`);
        return { q: `In a Haynes-Shockley experiment at $${T}$ K, an injected pulse of minority carriers takes $${tt}\\ \\mu$s to drift $${d}$ cm in a field of $${Ef}$ V/m. ${ask === 'mu' ? 'Their drift mobility is' : 'Using the Einstein relation, their diffusion constant is'}`, ...o,
          sol: `Drift speed $= ${round(d / 100, 4)}\\text{ m}/${tt}\\ \\mu\\text{s} = ${round((d / 100) / (tt * 1e-6), 2)}$ m/s, so $\\mu = v/E = ${+(mu).toPrecision(4)}$ m$^2$/V s $= ${+(mu * 1e4).toPrecision(4)}$ cm$^2$/V s.${ask === 'D' ? ` $D = \\mu k_BT/e = ${+(mu * 1e4).toPrecision(4)}\\times${round(KB * T, 5)} = ${+D.toPrecision(3)}$ cm$^2$/s.` : ''}`,
          trap: 'Quoting the drift speed as the mobility, or slipping a factor of 100 between metres and centimetres.' };
      } },
  ],
};
