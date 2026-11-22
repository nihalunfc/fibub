// Round 4 extras for conservation-laws: original questions, written 2026-11-22.
import { choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const MPR = 938.272;
const sig3 = (x) => +x.toPrecision(3);
const ASSOC = [[R`\pi^- + p \to \Lambda^0 + K^0`, R`\pi^-`, 139.570, [1115.683, 497.611]], [R`\pi^- + p \to \Sigma^- + K^+`, R`\pi^-`, 139.570, [1197.449, 493.677]],
  [R`\pi^- + p \to \Sigma^0 + K^0`, R`\pi^-`, 139.570, [1192.642, 497.611]], [R`K^- + p \to \Xi^- + K^+`, R`K^-`, 493.677, [1321.71, 493.677]],
  [R`p + p \to p + \Lambda^0 + K^+`, R`p`, 938.272, [938.272, 1115.683, 493.677]], [R`\gamma + p \to K^+ + \Lambda^0`, R`\gamma`, 0, [493.677, 1115.683]]];
const thr = (mb, fin) => { const S = fin.reduce((a, b) => a + b, 0); return (S * S - (mb + MPR) ** 2) / (2 * MPR); };
const pdk = (kt, tau, yrs) => kt * 1e9 / 18 * 6.022e23 * 10 * yrs / tau;
const JPC = [['0^{++}', 0, 1, 1], ['1^{--}', 1, -1, -1], ['2^{++}', 2, 1, 1], ['3^{--}', 3, -1, -1], ['4^{++}', 4, 1, 1], ['0^{-+}', 0, -1, 1], ['1^{++}', 1, 1, 1], ['1^{+-}', 1, 1, -1], ['2^{-+}', 2, -1, 1], ['2^{--}', 2, -1, -1]];
const PIPI = ['both $\\pi^+\\pi^-$ and $\\pi^0\\pi^0$', '$\\pi^+\\pi^-$ only', '$\\pi^0\\pi^0$ only', 'neither'];
const pipi = (J, P, C) => { const nat = P === (J % 2 ? -1 : 1) && C === P; return !nat ? 3 : J % 2 ? 1 : 0; };

export default {
  items: [
    { id: 'cnl-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'conservation laws',
      q: R`Which of these quantities is conserved in every known interaction (strong, electromagnetic and weak)?`,
      options: [R`electric charge`, R`strangeness`, R`parity`, R`isospin`], answer: 0,
      sol: R`Electric charge is conserved in every process ever observed. Strangeness and parity are conserved by the strong and electromagnetic interactions but violated by the weak interaction; isospin is conserved only by the strong interaction (broken by electromagnetism and the weak force).`,
      trap: R`Choosing parity, which seemed universal until the weak-interaction experiments of 1956-57.` },
    { id: 'cnl-r4-02', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'strangeness',
      q: R`Which reaction can proceed through the strong interaction?`,
      options: [R`$\pi^- + p \to \Lambda^0 + \pi^0$`, R`$\pi^- + p \to \Lambda^0 + K^0$`, R`$\pi^- + p \to \Sigma^+ + K^-$`, R`$\pi^- + p \to n + K^0$`], answer: 1,
      sol: R`Charge is zero on both sides in all four. The strong interaction also conserves strangeness, which is zero initially. $\Lambda^0$ ($S = -1$) $+ K^0$ ($S = +1$, $d\bar s$) gives $0$: allowed ("associated production"). $\Lambda\pi^0$ has $S = -1$, $\Sigma^+K^-$ has $S = -2$ and $nK^0$ has $S = +1$, so those are forbidden for the strong force.`,
      trap: R`Assigning $S = -1$ to the $K^0$; it contains an anti-strange quark and has $S = +1$.` },
    { id: 'cnl-r4-03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'isospin',
      q: R`A $\pi^+$ ($I = 1$) and a proton ($I = \tfrac12$) together have total isospin $I = $ ______ (give a number, e.g. 0.5).`,
      answer: 1.5, tol: 0, calc: () => 1 + 0.5,
      sol: R`Coupling $1$ and $\tfrac12$ gives $I = \tfrac12$ or $\tfrac32$. The third components add: $I_3 = 1 + \tfrac12 = \tfrac32$. A state with $I_3 = \tfrac32$ cannot have $I = \tfrac12$, so the $\pi^+p$ system is pure $I = \tfrac32$. That is why $\pi^+p$ scattering near $1232$ MeV shows only the $\Delta$ resonance.`,
      trap: R`Thinking $\pi^+p$ is a mixture of both isospins, as $\pi^-p$ is.` },
    { id: 'cnl-r4-04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'thresholds',
      q: R`Find the threshold kinetic energy of the pion beam for associated production $\pi^- + p \to \Lambda^0 + K^0$ with the proton at rest (rest energies in MeV: $\pi^-$ $139.570$, $p$ $938.272$, $\Lambda$ $1115.683$, $K^0$ $497.611$). Answer in MeV (nearest whole number).`,
      answer: 768, tol: 2, unit: 'MeV', calc: () => ((1115.683 + 497.611) ** 2 - (139.570 + 938.272) ** 2) / (2 * 938.272),
      sol: R`At threshold $\sqrt s$ equals the total final mass, $M = 1613.29$ MeV. For a beam of mass $m$ and kinetic energy $T$ on a target $m_p$ at rest, $s = (m + m_p)^2 + 2m_pT$, so $T = \dfrac{M^2 - (m + m_p)^2}{2m_p} = \dfrac{1613.29^2 - 1077.84^2}{1876.54} = \dfrac{2\,602\,718 - 1\,161\,739}{1876.54} = 768$ MeV.`,
      trap: R`Taking $T = M - m - m_p = 535$ MeV, which ignores the momentum the products must keep.` },
    { id: 'cnl-r4-05', type: 'msq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'allowed processes',
      q: R`Which of these processes are FORBIDDEN?`,
      options: [R`$p \to n + e^+ + \nu_e$ for a free proton`, R`$\bar\nu_\mu + p \to \mu^+ + n$`, R`$\Lambda^0 \to p + e^-$`, R`$\mu^- \to e^- + \bar\nu_e + \nu_\mu$`], answer: [0, 2],
      sol: R`A free proton is lighter than a neutron, so it cannot turn into one plus a positron: energy conservation forbids it (inside a nucleus the binding energy can pay, giving $\beta^+$ decay). $\bar\nu_\mu p \to \mu^+n$ conserves charge, baryon number and muon number ($-1 = -1$): allowed, it is the inverse-beta reaction for muon antineutrinos. $\Lambda \to pe^-$ creates an electron without an antineutrino, changing $L_e$ by $+1$: forbidden. Muon decay $\mu^- \to e^-\bar\nu_e\nu_\mu$ conserves both $L_\mu$ and $L_e$: allowed.`,
      trap: R`Checking only charge and baryon number; the lepton numbers and energy rule out the first and third.` },
    { id: 'cnl-r4-06', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'C parity',
      q: R`Which decay is forbidden by charge-conjugation invariance of the electromagnetic interaction? ($C = +1$ for $\pi^0$ and $\eta$, $-1$ for $\omega$, $J/\psi$ and the photon.)`,
      options: [R`$\eta \to \pi^0\pi^0\gamma$`, R`$\omega \to \pi^0\gamma$`, R`$\eta \to \gamma\gamma$`, R`$J/\psi \to e^+e^-$ (through one virtual photon)`], answer: 0,
      sol: R`$C$ is multiplicative. $\eta\to\pi^0\pi^0\gamma$: $(+1)(+1)(-1) = -1 \ne +1$, forbidden (none seen). $\omega \to \pi^0\gamma$: $(+1)(-1) = -1$, matching the $\omega$: allowed (8% branch). $\eta \to \gamma\gamma$: $(-1)^2 = +1$: allowed. $J/\psi \to \gamma^* \to e^+e^-$: the virtual photon has $C = -1$ like the $J/\psi$: allowed.`,
      trap: R`Forgetting that each photon brings a factor $-1$.` },
    { id: 'cnl-r4-07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'baryon number',
      q: R`A water detector holds $50$ kilotonnes of $\text{H}_2\text{O}$ (molar mass $18$ g/mol, $10$ protons per molecule counting those in oxygen). If the proton mean life were $1.0\times10^{34}$ years, the expected number of proton decays per year in the whole detector would be ______ (two decimal places).`,
      answer: 1.67, tol: 0.02, calc: () => 5e10 / 18 * 6.022e23 * 10 / 1e34,
      sol: R`Moles of water: $5.0\times10^{10}$ g$/18 = 2.78\times10^9$; molecules: $1.67\times10^{33}$; protons: $1.67\times10^{34}$. With $\lambda = 1/\tau = 10^{-34}$ per year and $\lambda t \ll 1$, the expected decays per year are $N\lambda = 1.67$. Seeing none for years (with tiny backgrounds) is how lower limits of order $10^{34}$ years are set.`,
      trap: R`Counting only the two hydrogen nuclei per molecule; the protons bound in oxygen can decay too.` },
    { id: 'cnl-r4-08', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'conservation laws',
      q: R`Which quantities are conserved by the strong interaction but violated by the weak interaction?`,
      options: [R`strangeness`, R`parity`, R`isospin`, R`baryon number`], answer: [0, 1, 2],
      sol: R`Weak decays change flavour ($\Lambda \to p\pi^-$ changes $S$ by one), violate parity (Wu's $^{60}$Co experiment) and change isospin ($\Delta I = \tfrac12$ in $\Lambda$ decay). All three are respected by the strong interaction. Baryon number is conserved by all three interactions: no proton decay has been seen.`,
      trap: R`Adding baryon number; the weak interaction changes quark flavours, not the number of quarks.` },
    { id: 'cnl-r4-09', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'isospin',
      q: R`The $\Sigma^{*0}(1385)$ has isospin $I = 1$, $I_3 = 0$ and decays strongly, partly into $\Sigma\pi$ (both $I = 1$). Isospin symmetry predicts that the rate $\Gamma(\Sigma^{*0} \to \Sigma^0\pi^0)$ is`,
      options: [R`equal to $\Gamma(\Sigma^{*0} \to \Sigma^+\pi^-)$`, R`zero: the Clebsch-Gordan coefficient $\langle1\,0;1\,0|1\,0\rangle$ vanishes`, R`half of $\Gamma(\Sigma^{*0}\to\Sigma^+\pi^-)$`, R`twice $\Gamma(\Sigma^{*0}\to\Sigma^+\pi^-)$`], answer: 1,
      sol: R`For $1\otimes1 \to 1$ the state is antisymmetric: $|1, 0\rangle = \tfrac1{\sqrt2}\left(|1, 1\rangle|1, -1\rangle - |1, -1\rangle|1, 1\rangle\right)$, with no $|1, 0\rangle|1, 0\rangle$ term. So $\Sigma^{*0}\to\Sigma^0\pi^0$ is forbidden by isospin, while $\Sigma^+\pi^-$ and $\Sigma^-\pi^+$ share the $\Sigma\pi$ rate equally.`,
      trap: R`Assuming every charge combination appears with similar weight, as it does for the $I = 2$ or $I = 0$ couplings.` },
    { id: 'cnl-r4-10', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'C and P',
      q: R`A neutral meson decays strongly or electromagnetically into two $\pi^0$. Using parity, $C$ parity and Bose symmetry, its $J^{PC}$ could be`,
      options: [R`$0^{++}$`, R`$1^{--}$`, R`$1^{++}$`, R`$0^{-+}$`], answer: 0,
      sol: R`Two identical spinless bosons need a symmetric spatial state, so their orbital angular momentum $L$ is even, and $J = L$. Each $\pi^0$ has $P = -1$, so $P = (-1)^2(-1)^L = +1$; each has $C = +1$, so $C = +1$. Hence $J^{PC} = $ even$^{++}$: $0^{++}$ (like the $f_0$) fits; $1^{--}$, $1^{++}$ (odd $J$) and $0^{-+}$ (wrong parity) cannot decay to $\pi^0\pi^0$.`,
      trap: R`Allowing odd $L$ as for $\pi^+\pi^-$ (the $\rho^0 \to \pi^+\pi^-$ is fine, but $\rho^0 \to \pi^0\pi^0$ is not).` },
  ],
  gens: [
    { id: 'cnl-r4g1', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'thresholds',
      make(r) {
        const [t, b, mb, fin] = choose(r, ASSOC), ans = thr(mb, fin), S = fin.reduce((a, c) => a + c, 0);
        return { q: R`Find the threshold kinetic energy of the $${b}$ beam for $${t}$ on protons at rest (rest energies in MeV: beam ${mb}, proton 938.272, products ${fin.join(', ')}). Answer in MeV (three significant figures).`,
          answer: sig3(ans), tol: sig3(ans * 0.005), mb, fin,
          sol: R`At threshold $\sqrt s = \sum m_f = ${round(S, 3)}$ MeV and $s = (m_b + m_p)^2 + 2m_pT$, so $T = \dfrac{${round(S, 3)}^2 - ${round(mb + MPR, 3)}^2}{2\times938.272} = ${sig3(ans)}$ MeV. Strangeness is conserved: the strange baryon is produced together with a kaon.`,
          trap: R`Using the mass difference $\sum m_f - m_b - m_p$, which ignores the motion of the centre of mass.` };
      },
      verify: (p) => thr(p.mb, p.fin) },
    { id: 'cnl-r4g2', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'baryon number',
      make(r) {
        const kt = choose(r, [1, 10, 22.5, 50, 260]), tau = choose(r, [1e33, 5e33, 1e34, 2.4e34, 1e35]), yrs = choose(r, [1, 5, 10]), ans = pdk(kt, tau, yrs);
        const ts = `${+(tau / 10 ** Math.floor(Math.log10(tau))).toPrecision(3)}\\times10^{${Math.floor(Math.log10(tau))}}`;
        return { q: R`A water detector of $${kt}$ kilotonnes ($18$ g/mol, $10$ protons per molecule, $N_A = 6.022\times10^{23}$) runs for $${yrs}$ year${yrs > 1 ? 's' : ''}. If the proton mean life is $${ts}$ years, the expected number of proton decays is ______ (three significant figures).`,
          answer: sig3(ans), tol: sig3(ans * 0.005), kt, tau, yrs,
          sol: R`Protons: $\dfrac{${kt}\times10^9\text{ g}}{18}\times6.022\times10^{23}\times10 = ${sig3(kt * 1e9 / 18 * 6.022e24 / 1e33)}\times10^{33}$. Expected decays $N\,t/\tau = ${sig3(ans)}$ (valid since $t \ll \tau$).`,
          trap: R`Counting only hydrogen nuclei, or using the half-life formula with $\ln2$.` };
      },
      verify: (p) => pdk(p.kt, p.tau, p.yrs) },
    { id: 'cnl-r4g3', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'C and P',
      make(r) {
        const [t, J, P, C] = choose(r, JPC), k = pipi(J, P, C);
        const o = mcqOptions(r, PIPI[k], PIPI.filter((_, i) => i !== k), (v) => v);
        return { q: R`A neutral meson with $J^{PC} = ${t}$ is heavy enough to decay into two pions. Using only parity, $C$ parity and Bose symmetry (ignore isospin), it can decay strongly into`, ...o, J, P, C,
          sol: R`Two pions in relative orbital angular momentum $L$ have $J = L$ and $P = (+1)(-1)^L$ (two $P = -1$ pions). For $\pi^+\pi^-$, swapping the pions gives $C = (-1)^L$; for $\pi^0\pi^0$, Bose symmetry needs even $L$ and $C = +1$. So a two-pion state has $P = C = (-1)^J$. Here $J = ${J}$, $P = ${P > 0 ? '+' : '-'}$, $C = ${C > 0 ? '+' : '-'}$: the answer is ${PIPI[k]}.`,
          trap: R`Forgetting that $\pi^0\pi^0$ needs even $L$, or that the two pions' intrinsic parities multiply to $+1$.` };
      } },
  ],
};
