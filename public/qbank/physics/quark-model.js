// Isospin, strangeness and the quark model (CSIR NET Part C / GATE level): isospin multiplets and Clebsch-Gordan
// predictions for pion-nucleon and NN reactions, strangeness and hypercharge, the Gell-Mann-Nishijima relation (with
// charm and bottom), associated production, SU(3) flavour multiplets (3 x 3bar = 8 + 1, 3 x 3 x 3 = 10 + 8 + 8 + 1,
// dimensions), the baryon octet and decuplet weight diagrams, the meson nonet and mixing, the Gell-Mann-Okubo mass
// formulas and the Omega minus, colour, quark-model magnetic moments. Original questions for fibub.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
import more from './quark-model.more.gen.js';
import more2 from './quark-model.more2.gen.js';
import r4 from './quark-model.r4.gen.js';

const R = String.raw;
// quark flavour numbers: [charge, I3, B, S, C, Bottom]
const Q = { u: [2 / 3, 0.5, 1 / 3, 0, 0, 0], d: [-1 / 3, -0.5, 1 / 3, 0, 0, 0], s: [-1 / 3, 0, 1 / 3, -1, 0, 0], c: [2 / 3, 0, 1 / 3, 0, 1, 0], b: [-1 / 3, 0, 1 / 3, 0, 0, -1] };
const anti = (q) => Q[q].map((x) => -x);
const sumq = (list) => list.reduce((a, [q, bar]) => a.map((x, i) => x + (bar ? anti(q) : Q[q])[i]), [0, 0, 0, 0, 0, 0]);
const M = { 'π⁺': 139.57, 'π⁻': 139.57, 'π⁰': 134.98, 'K⁺': 493.68, 'K⁻': 493.68, 'K⁰': 497.61, 'K̄⁰': 497.61, p: 938.27, n: 939.57, 'Λ': 1115.68, 'Σ⁺': 1189.37, 'Σ⁰': 1192.64, 'Σ⁻': 1197.45, 'Ξ⁰': 1314.86, 'Ξ⁻': 1321.71, 'Ω⁻': 1672.45, 'η': 547.86 };
// hadrons: name, quarks [[flavour, isAnti]], charge, B, S
const H = [
  ['p', 'uud', 1, 1, 0], ['n', 'udd', 0, 1, 0], ['Λ', 'uds', 0, 1, -1], ['Σ⁺', 'uus', 1, 1, -1], ['Σ⁻', 'dds', -1, 1, -1], ['Ξ⁰', 'uss', 0, 1, -2], ['Ξ⁻', 'dss', -1, 1, -2],
  ['Δ⁺⁺', 'uuu', 2, 1, 0], ['Δ⁻', 'ddd', -1, 1, 0], ['Ω⁻', 'sss', -1, 1, -3], ['Σ*⁺', 'uus', 1, 1, -1],
  ['π⁺', 'ud̄', 1, 0, 0], ['K⁺', 'us̄', 1, 0, 1], ['K⁰', 'ds̄', 0, 0, 1], ['K⁻', 'sū', -1, 0, -1], ['K̄⁰', 'sd̄', 0, 0, -1], ['D⁺', 'cd̄', 1, 0, 0], ['D_s⁺', 'cs̄', 1, 0, 1], ['Λ_c⁺', 'udc', 1, 1, 0], ['B⁺', 'ub̄', 1, 0, 0],
];
const parseQ = (s0) => { const s = s0.normalize('NFD'), out = []; for (let i = 0; i < s.length; i++) { const bar = s[i + 1] === '̄'; out.push([s[i], bar]); if (bar) i++; } return out; };
const fr = (x) => { const v = round(x, 4); if (Number.isInteger(v)) return String(v); const t = round(v * 2, 4); if (Number.isInteger(t)) return `${t}/2`; const h = round(v * 3, 4); return Number.isInteger(h) ? `${h}/3` : String(v); };
const sqrtS = (ma, mb) => ma + mb;
/** Threshold lab kinetic energy (MeV) of beam a on target b at rest making products of total mass Mf. */
const thr = (ma, mb, Mf) => (Mf * Mf - sqrtS(ma, mb) ** 2) / (2 * mb);
const dimSU3 = (p, q) => (p + 1) * (q + 1) * (p + q + 2) / 2;

export default {
  topic: 'quark-model',
  items: [
    // ---------- level 1 ----------
    { id: 'qk-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Gell-Mann-Nishijima',
      q: R`The Gell-Mann-Nishijima relation for hadrons made of u, d and s quarks is`,
      options: [R`$Q = I_3 + B + S$`, R`$Q = I_3 + \dfrac{B + S}2$`, R`$Q = I + \dfrac{B + S}2$`, R`$Q = I_3 - \dfrac{B - S}2$`], answer: 1,
      sol: R`$Q = I_3 + Y/2$ with hypercharge $Y = B + S$. Check: proton $I_3 = +\tfrac12$, $B = 1$, $S = 0$: $Q = \tfrac12 + \tfrac12 = 1$. $\Lambda$: $0 + (1 - 1)/2 = 0$. $K^+$: $\tfrac12 + (0 + 1)/2 = 1$.`,
      trap: 'It is the third component I₃, not the total isospin I, that enters.' },
    { id: 'qk-002', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'quark content',
      q: 'The valence quark content of the neutron is',
      options: ['uud', 'uds', 'udd', 'ddd'], answer: 2,
      sol: R`Charge $\tfrac23 - \tfrac13 - \tfrac13 = 0$, baryon number $3\times\tfrac13 = 1$, strangeness 0. uud is the proton, uds the $\Lambda$ or $\Sigma^0$, ddd the $\Delta^-$.`,
      trap: 'uds has zero charge too, but it carries strangeness −1.' },
    { id: 'qk-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'strangeness',
      q: R`The strangeness of the $\Lambda^0$ hyperon is`,
      options: [R`$+1$`, R`$0$`, R`$-2$`, R`$-1$`], answer: 3,
      sol: R`$\Lambda = uds$, and the s quark carries $S = -1$ by convention. So $S(\Lambda) = -1$, the same as $K^-$ and $\bar K^0$, while $K^+$ and $K^0$ (with an $\bar s$) have $S = +1$.`,
      trap: 'The sign convention gives the s quark strangeness −1, not +1.' },
    { id: 'qk-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'isospin',
      q: R`The pions $\pi^+, \pi^0, \pi^-$ form an isospin multiplet with total isospin`,
      options: [R`$I = 0$`, R`$I = 1/2$`, R`$I = 1$`, R`$I = 3/2$`], answer: 2,
      sol: R`Three nearly degenerate states need $2I + 1 = 3$, so $I = 1$, with $I_3 = +1, 0, -1$. The nucleon doublet (p, n) has $I = \tfrac12$; the $\Delta$ quartet $I = \tfrac32$.`,
      trap: 'Count the members: multiplicity 2I + 1.' },
    { id: 'qk-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'SU(3) multiplets',
      q: R`The lightest baryon decuplet ($\Delta$, $\Sigma^*$, $\Xi^*$, $\Omega^-$) has spin-parity`,
      options: [R`$\tfrac12^+$`, R`$\tfrac32^+$`, R`$\tfrac32^-$`, R`$\tfrac12^-$`], answer: 1,
      sol: R`Three quarks in relative S waves ($L = 0$, parity $+$) with spins all parallel ($S = \tfrac32$). The flavour and spin parts are both symmetric; the octet has $\tfrac12^+$.`,
      trap: R`Ground-state baryons have $L = 0$, so their parity is positive.` },
    { id: 'qk-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'strangeness',
      q: 'Strangeness is conserved by',
      options: ['the strong interaction only', 'the strong and electromagnetic interactions, but not the weak interaction', 'all interactions', 'the weak interaction only'], answer: 1,
      sol: R`Strong and EM interactions cannot change quark flavour, so $S$ is conserved. The weak interaction changes flavour ($s\to u$), with $|\Delta S| = 1$ in strange-particle decays such as $\Lambda\to p\pi^-$. That is why strange particles are produced fast (in pairs) but decay slowly ($10^{-10}$ s).`,
      trap: R`EM decays such as $\Sigma^0\to\Lambda\gamma$ conserve strangeness.` },

    // ---------- level 2 ----------
    { id: 'qk-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'SU(3) multiplets',
      q: R`In flavour SU(3), $3\otimes3\otimes3 = 10\oplus8\oplus8\oplus1$. How many independent flavour states does the fully antisymmetric multiplet contain?`,
      answer: 1, tol: 0, calc: () => 27 - 10 - 8 - 8,
      sol: R`$3^3 = 27$ states. The totally symmetric part is the decuplet (10), the two mixed-symmetry parts are octets (8 + 8), and the totally antisymmetric combination of u, d, s is a single state, the singlet (1): $10 + 8 + 8 + 1 = 27$.`,
      trap: 'The decuplet is the symmetric piece, not the antisymmetric one.' },
    { id: 'qk-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'quark content',
      q: R`The quark content of the $\Xi^-$ baryon is`,
      options: ['dss', 'uss', 'dds', 'sss'], answer: 0,
      sol: R`$\Xi$ has $S = -2$ (two s quarks) and is an isospin doublet: $\Xi^0 = uss$, $\Xi^- = dss$. Charge check: $-\tfrac13 - \tfrac13 - \tfrac13 = -1$.`,
      trap: R`dds is the $\Sigma^-$ ($S = -1$); sss is the $\Omega^-$.` },
    { id: 'qk-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Gell-Mann-Nishijima',
      q: R`The $\Sigma^+$ has $B = 1$ and $S = -1$. By the Gell-Mann-Nishijima relation its isospin component $I_3$ is`,
      options: [R`$+\tfrac12$`, R`$0$`, R`$-1$`, R`$+1$`], answer: 3,
      sol: R`$Y = B + S = 0$, so $I_3 = Q - Y/2 = 1$. With $\Sigma^0$ and $\Sigma^-$ it forms an $I = 1$ triplet.`,
      trap: R`$+\tfrac12$ would need $Y = 1$.` },
    { id: 'qk-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'strangeness',
      q: R`Which of these $\pi^-p$ reactions is forbidden for the strong interaction?`,
      options: [R`$\pi^- + p \to K^0 + \Lambda$`, R`$\pi^- + p \to K^+ + \Sigma^-$`, R`$\pi^- + p \to K^- + \Sigma^+$`, R`$\pi^- + p \to \pi^0 + n$`], answer: 2,
      sol: R`The initial strangeness is 0. $K^0\Lambda$: $+1 - 1 = 0$. $K^+\Sigma^-$: $+1 - 1 = 0$. $K^-\Sigma^+$: $-1 - 1 = -2$, so it violates strangeness by 2 and cannot go strongly (even weakly it would need $|\Delta S| = 2$). Charge and baryon number are fine in all four. Strange particles are made in pairs: associated production.`,
      trap: 'Charge balance alone does not decide; check strangeness of each product.' },
    { id: 'qk-011', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'hypercharge',
      q: R`The $\Omega^-$ (sss) has hypercharge $Y = B + S$ equal to ______.`,
      answer: -2, tol: 0, calc: () => 1 - 3,
      sol: R`$B = 1$, $S = -3$, so $Y = -2$. Then $I_3 = Q - Y/2 = -1 + 1 = 0$: an isospin singlet at the bottom vertex of the decuplet.`,
      trap: 'Hypercharge adds baryon number to strangeness; it is not just S.' },
    { id: 'qk-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'SU(3) multiplets',
      q: R`Mesons are $q\bar q$ states. In flavour SU(3), $3\otimes\bar3$ decomposes as`,
      options: [R`$8\oplus1$`, R`$6\oplus\bar3$`, R`$10\oplus\bar{10}$`, R`$9$, an irreducible nonet`], answer: 0,
      sol: R`Nine $q\bar q$ combinations split into an octet ($\pi$, $K$, $\bar K$, $\eta_8$) and a singlet $\eta_1 = (u\bar u + d\bar d + s\bar s)/\sqrt3$. The physical $\eta$ and $\eta'$ are mixtures of $\eta_8$ and $\eta_1$, so one speaks of a "nonet", but it is reducible.`,
      trap: R`$6\oplus\bar3$ is $3\otimes3$ (two quarks), not quark-antiquark.` },
    { id: 'qk-013', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'SU(3) multiplets', format: 'multi',
      q: R`Which of these belong to the spin-$\tfrac12$ baryon octet?`,
      options: [R`$p$`, R`$\Delta^+$`, R`$\Lambda$`, R`$\Xi^-$`], answer: [0, 2, 3],
      sol: R`The octet: $n, p$ ($S = 0$), $\Sigma^-, \Sigma^0, \Sigma^+, \Lambda$ ($S = -1$), $\Xi^-, \Xi^0$ ($S = -2$). $\Delta^+$ has the same quarks as the proton but spin $\tfrac32$: it is in the decuplet.`,
      trap: 'Same quark content does not mean same multiplet: spin and symmetry differ.' },
    { id: 'qk-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'colour',
      q: R`The $\Delta^{++}$ (uuu) with spin $\tfrac32$ and $L = 0$ has a symmetric space, spin and flavour wavefunction. To satisfy the Pauli principle, quarks must carry`,
      options: ['fractional baryon number', 'a new quantum number (colour) in which the state is antisymmetric', 'orbital angular momentum L = 1', 'opposite electric charges'], answer: 1,
      sol: R`Three identical fermions need an overall antisymmetric state. Space ($L = 0$), spin ($\uparrow\uparrow\uparrow$) and flavour (uuu) are all symmetric, so a fourth label is needed: three colours, combined in the antisymmetric singlet $\varepsilon_{ijk}q_iq_jq_k$. All hadrons are colour singlets.`,
      trap: 'Adding L = 1 would change the parity and the observed spin; it does not solve the problem.' },
    { id: 'qk-015', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Gell-Mann-Nishijima',
      q: R`A hadron has $I_3 = -\tfrac12$, baryon number 1 and strangeness $-2$. Its electric charge (in units of $e$) is ______.`,
      answer: -1, tol: 0, calc: () => -0.5 + (1 - 2) / 2,
      sol: R`$Q = I_3 + (B + S)/2 = -\tfrac12 + (1 - 2)/2 = -1$. This is the $\Xi^-$ (dss).`,
      trap: R`Forgetting to halve $B + S$ gives $-\tfrac32$, which is not a charge any hadron has.` },
    { id: 'qk-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'isospin',
      q: R`The kaons $K^+$ and $K^0$ form`,
      options: [R`an isospin doublet ($I = \tfrac12$) with $S = +1$`, R`an isospin triplet with $S = -1$`, R`two isospin singlets`, R`an isospin doublet with $S = -1$`], answer: 0,
      sol: R`$K^+ = u\bar s$ and $K^0 = d\bar s$: the u and d give $I_3 = \pm\tfrac12$, and the $\bar s$ gives $S = +1$. Their antiparticles $\bar K^0 = s\bar d$, $K^- = s\bar u$ form a separate doublet with $S = -1$. So $K^0$ and $\bar K^0$ are distinct particles (mixed only by the weak interaction).`,
      trap: R`$K^-$ is not the third member of a triplet with $K^+$ and $K^0$.` },

    // ---------- level 3 ----------
    { id: 'qk-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Gell-Mann-Okubo',
      q: R`The decuplet masses obey the equal-spacing rule $M(\Sigma^*) - M(\Delta) = M(\Xi^*) - M(\Sigma^*) = M(\Omega) - M(\Xi^*)$. With $M(\Delta) = 1232$, $M(\Sigma^*) = 1385$ and $M(\Xi^*) = 1533$ MeV, use the average of the two known spacings to predict $M(\Omega^-)$ = ______ MeV (nearest whole number).`,
      answer: 1684, tol: 1, calc: () => 1533 + ((1385 - 1232) + (1533 - 1385)) / 2,
      sol: R`Spacings 153 and 148 MeV, average 150.5 MeV. $M(\Omega) \approx 1533 + 150.5 = 1683.5\approx1684$ MeV, against the measured 1672 MeV. The equal spacing reflects one extra s quark per step, $m_s - m_{u,d}\approx150$ MeV.`,
      trap: 'The rule is linear in mass for the decuplet (it is the octet version that relates four different averages).' },
    { id: 'qk-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Gell-Mann-Okubo', unit: 'MeV',
      q: R`The Gell-Mann-Okubo relation for the baryon octet is $\dfrac{M_N + M_\Xi}2 = \dfrac{3M_\Lambda + M_\Sigma}4$. With $M_N = 939$, $M_\Sigma = 1193$ and $M_\Xi = 1318$ MeV, it predicts $M_\Lambda$ = ______ MeV (nearest whole number).`,
      answer: 1107, tol: 1, calc: () => (2 * (939 + 1318) - 1193) / 3,
      sol: R`$3M_\Lambda = 2(M_N + M_\Xi) - M_\Sigma = 2\times2257 - 1193 = 3321$, so $M_\Lambda = 1107$ MeV. The measured 1116 MeV agrees to 1%.`,
      trap: 'Multiply the left side by 4, then isolate 3MΛ.' },
    { id: 'qk-019', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'isospin amplitudes',
      q: R`At the peak of the $\Delta(1232)$ resonance only the $I = \tfrac32$ amplitude matters. The cross sections $\sigma(\pi^+p\to\pi^+p) : \sigma(\pi^-p\to\pi^-p) : \sigma(\pi^-p\to\pi^0n)$ are then in the ratio`,
      options: ['1 : 1 : 1', '3 : 1 : 2', '9 : 1 : 2', '9 : 2 : 1'], answer: 2,
      sol: R`$\pi^+p = |\tfrac32, \tfrac32\rangle$, pure. $\pi^-p = \sqrt{\tfrac13}|\tfrac32, -\tfrac12\rangle - \sqrt{\tfrac23}|\tfrac12, -\tfrac12\rangle$ and $\pi^0n = \sqrt{\tfrac23}|\tfrac32, -\tfrac12\rangle + \sqrt{\tfrac13}|\tfrac12, -\tfrac12\rangle$. With only $A_{3/2}$: amplitudes $1$, $\tfrac13$, $\tfrac{\sqrt2}3$; squares $1 : \tfrac19 : \tfrac29 = 9 : 1 : 2$. Total $\pi^+p$ is three times total $\pi^-p$, as observed.`,
      trap: 'Square the products of Clebsch-Gordan coefficients, not the coefficients one at a time.' },
    { id: 'qk-020', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'isospin amplitudes',
      q: R`At the $\Delta(1232)$ peak (pure $I = 3/2$), the ratio of the total $\pi^+p$ cross section to the total $\pi^-p$ cross section is ______.`,
      answer: 3, tol: 0, calc: () => 9 / (1 + 2),
      sol: R`From the 9 : 1 : 2 ratio, $\sigma_{tot}(\pi^+p) = 9$ and $\sigma_{tot}(\pi^-p) = 1 + 2 = 3$ (elastic plus charge exchange). Ratio 3, close to the measured 200 mb against 70 mb.`,
      trap: 'Total π⁻p includes the charge-exchange channel π⁰n.' },
    { id: 'qk-021', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Σ and Λ',
      q: R`$\Sigma^0$ and $\Lambda$ have the same quark content (uds). They differ because`,
      options: [R`the $\Lambda$ contains a charm quark`, R`their spins differ: $\Sigma^0$ has spin $\tfrac32$`, R`in $\Sigma^0$ the ud pair has isospin 1 (and spin 1), in $\Lambda$ it has isospin 0 (and spin 0)`, R`the $\Lambda$ is a meson`], answer: 2,
      sol: R`Both have spin $\tfrac12$. In $\Sigma^0$ the light pair is in $I = 1$, so $\Sigma^0$ belongs with $\Sigma^\pm$; in $\Lambda$ it is $I = 0$, an isospin singlet. The ud spin follows the isospin (symmetric flavour-spin for the pair). $\Sigma^0$ is heavier by 77 MeV and decays electromagnetically: $\Sigma^0\to\Lambda\gamma$ ($7\times10^{-20}$ s).`,
      trap: R`$\Sigma^{*0}$ (spin 3/2) is in the decuplet; $\Sigma^0$ itself is spin 1/2.` },
    { id: 'qk-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'magnetic moments',
      q: R`In the non-relativistic quark model with $m_u = m_d$, the ratio of magnetic moments $\mu_p/\mu_n$ is`,
      options: [R`$-2/3$`, R`$-3/2$`, R`$+3/2$`, R`$-1$`], answer: 1,
      sol: R`$\mu_p = \tfrac13(4\mu_u - \mu_d)$, $\mu_n = \tfrac13(4\mu_d - \mu_u)$, and $\mu_d = -\tfrac12\mu_u$ (charge ratio). $\mu_p = \mu_u$, $\mu_n = -\tfrac23\mu_u$, ratio $-\tfrac32$. Measured: $2.793/(-1.913) = -1.46$, a striking success of the quark model.`,
      trap: 'The 4 : 1 weights come from the symmetric spin-flavour wavefunction of the octet.' },
    { id: 'qk-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'magnetic moments', unit: 'μN',
      q: R`Take constituent masses $m_u = m_d = 336$ MeV and $m_pc^2 = 938.3$ MeV, so $\mu_q = (Q_q/e)(m_p/m_q)\,\mu_N$. The quark-model proton moment $\mu_p = \tfrac13(4\mu_u - \mu_d)$ is ______ $\mu_N$ (two decimal places).`,
      answer: 2.79, tol: 0.01, calc: () => { const mu = (2 / 3) * 938.3 / 336, md = (-1 / 3) * 938.3 / 336; return (4 * mu - md) / 3; },
      sol: R`$\mu_u = \tfrac23\times938.3/336 = 1.862\,\mu_N$, $\mu_d = -0.931\,\mu_N$. $\mu_p = (7.447 + 0.931)/3 = 2.79\,\mu_N$, matching the measured $2.793\,\mu_N$ (the constituent mass is in effect fitted to this).`,
      trap: 'The d quark moment is negative, so −μd adds.' },
    { id: 'qk-024', type: 'mcq', level: 3, exams: ['net'], sub: 'SU(3) multiplets',
      q: R`Two quarks (a diquark) in flavour SU(3) decompose as`,
      options: [R`$8\oplus1$`, R`$10\oplus\bar{10}$`, R`$6\oplus\bar3$, the symmetric sextet and the antisymmetric antitriplet`, R`$9$`], answer: 2,
      sol: R`$3\otimes3 = 9$ states: 6 symmetric ($uu, dd, ss$ and the three symmetric mixed pairs) and 3 antisymmetric ($ud - du$, etc.), which transform as $\bar3$. Adding a third quark: $6\otimes3 = 10\oplus8$ and $\bar3\otimes3 = 8\oplus1$.`,
      trap: R`$8\oplus1$ is quark-antiquark.` },
    { id: 'qk-025', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'conservation laws', format: 'multi',
      q: 'Which statements about conservation laws are correct?',
      options: ['The strong interaction conserves total isospin I.', 'The electromagnetic interaction conserves I₃ but not, in general, I.', 'The weak interaction conserves strangeness.', 'The strong interaction conserves strangeness.'], answer: [0, 1, 3],
      sol: R`The strong force is (nearly) blind to the u-d difference, so $I$ and $I_3$ are conserved; it never changes flavour, so $S$ is conserved. EM distinguishes u from d by charge: it conserves $Q$, hence $I_3$ (with $B$, $S$ fixed), but can change $I$ (e.g. $\Sigma^0\to\Lambda\gamma$, $\Delta I = 1$). The weak interaction changes flavour ($|\Delta S| = 1$).`,
      trap: 'EM conserves I₃ automatically via charge conservation, but not I.' },
    { id: 'qk-026', type: 'nat', level: 3, exams: ['net'], sub: 'SU(6)',
      q: R`In SU(6) (flavour SU(3) × spin SU(2)), the ground-state baryons fill the symmetric 56-plet: an octet of spin $\tfrac12$ and a decuplet of spin $\tfrac32$. Counting each spin projection separately, how many states is that?`,
      answer: 56, tol: 0, calc: () => 8 * 2 + 10 * 4,
      sol: R`Octet: $8\times2 = 16$ states; decuplet: $10\times4 = 40$ states. Total $56$. With colour antisymmetric, the space-spin-flavour part must be symmetric, which is exactly the 56: one of the early clues to colour.`,
      trap: 'Each spin-3/2 member has four projections.' },
    { id: 'qk-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'associated production', unit: 'GeV',
      q: R`The $\Omega^-$ was found in $K^- + p \to \Omega^- + K^+ + K^0$. With $m_{K^-} = 493.7$, $m_p = 938.3$, $m_\Omega = 1672.5$, $m_{K^+} = 493.7$ and $m_{K^0} = 497.6$ MeV, the threshold kinetic energy of the $K^-$ on a proton at rest is ______ GeV (two decimal places).`,
      answer: 2.69, tol: 0.01, calc: () => thr(493.7, 938.3, 1672.5 + 493.7 + 497.6) / 1000,
      sol: R`Strangeness: $-1 + 0 = -3 + 1 + 1$, conserved. At threshold, $s = (M_f c^2)^2$ with $M_f = 2663.8$ MeV. $s = m_K^2 + m_p^2 + 2m_p(T + m_K)$ gives $T = \dfrac{M_f^2 - (m_K + m_p)^2}{2m_p} = \dfrac{7095830 - 2050624}{1876.6} = 2689$ MeV $= 2.69$ GeV.`,
      trap: 'Subtracting masses (Q value, 1.23 GeV) ignores the motion of the centre of mass.' },
    { id: 'qk-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Ω minus',
      q: R`The $\Omega^-$ (mass 1672 MeV) lives about $8\times10^{-11}$ s, very long for a particle of that mass. The reason is that`,
      options: ['it has no charge', 'no lighter combination of hadrons has strangeness −3, so strong and EM decays are impossible and it must decay weakly', 'it is a lepton', 'its decay violates energy conservation'], answer: 1,
      sol: R`Strong decays conserve $S$: the lightest $S = -3$ final states ($\Xi\bar K$, 1814 MeV; $\Lambda\bar K\bar K$) are heavier than the $\Omega$. So only weak decays with $\Delta S = 1$ ($\Omega^-\to\Lambda K^-$, $\Xi^0\pi^-$, $\Xi^-\pi^0$) are possible, giving weak-interaction lifetimes. Gell-Mann predicted exactly this.`,
      trap: R`Charged or not, the $\Omega^-$ is a hadron; its stability against strong decay comes from strangeness.` },
    { id: 'qk-029', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'SU(3) multiplets',
      q: R`In the decuplet weight diagram ($I_3$ across, $Y$ up), which particle sits alone at the lowest vertex?`,
      options: [R`$\Delta^{++}$`, R`$\Xi^{*-}$`, R`$\Omega^-$`, R`$\Sigma^{*0}$`], answer: 2,
      sol: R`The decuplet is an inverted triangle: top row $\Delta^-, \Delta^0, \Delta^+, \Delta^{++}$ ($Y = 1$, $I = \tfrac32$), then $\Sigma^*$ ($Y = 0$, $I = 1$), $\Xi^*$ ($Y = -1$, $I = \tfrac12$), and the single $\Omega^-$ ($Y = -2$, $I = 0$) at the bottom vertex.`,
      trap: R`$\Delta^{++}$ and $\Delta^-$ are at the two upper corners.` },

    // ---------- level 4 ----------
    { id: 'qk-030', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'isospin amplitudes',
      q: R`The $\Delta^+$ decays strongly to $p\pi^0$ or $n\pi^+$. Isospin predicts the branching fraction to $p\pi^0$ as ______ (three decimal places).`,
      answer: 0.667, tol: 0.001, calc: () => 2 / 3,
      sol: R`$|\tfrac32, \tfrac12\rangle = \sqrt{\tfrac23}|1, 0\rangle|\tfrac12, \tfrac12\rangle + \sqrt{\tfrac13}|1, 1\rangle|\tfrac12, -\tfrac12\rangle$, i.e. $\sqrt{2/3}\,\pi^0p + \sqrt{1/3}\,\pi^+n$. Branching: $p\pi^0 = 2/3$, $n\pi^+ = 1/3$ (phase space differences are tiny).`,
      trap: R`For an $I = \tfrac12$ resonance $N^{*+}$ the ratio is reversed: $p\pi^0 = 1/3$, $n\pi^+ = 2/3$.` },
    { id: 'qk-031', type: 'mcq', level: 4, exams: ['net'], sub: 'isospin amplitudes',
      q: R`Isospin predicts the ratio $\sigma(pp\to d\pi^+)/\sigma(np\to d\pi^0)$ at the same energy to be`,
      options: ['1', '1/2', '2', '3'], answer: 2,
      sol: R`The final state $d\pi$ has $I = 1$ ($d$: $I = 0$; $\pi$: $I = 1$). $pp = |1, 1\rangle$ is pure $I = 1$; $np = \tfrac1{\sqrt2}(|1, 0\rangle - |0, 0\rangle)$ has only half its weight in $I = 1$. Both final states are $I = 1$ members with unit weight, so $\sigma(pp\to d\pi^+)/\sigma(np\to d\pi^0) = 1/(1/2) = 2$, as measured.`,
      trap: 'The I = 0 part of np cannot reach dπ, which has I = 1.' },
    { id: 'qk-032', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Gell-Mann-Nishijima',
      q: R`With heavy flavours the relation becomes $Q = I_3 + \tfrac12(B + S + C + B' + T)$, where $C$ is charm and $B'$ bottomness. A baryon with $I_3 = -\tfrac12$, $S = -1$, $C = +1$ (quarks dsc) has charge ______.`,
      answer: 0, tol: 0, calc: () => -0.5 + (1 - 1 + 1) / 2,
      sol: R`$Q = -\tfrac12 + \tfrac12(1 - 1 + 1) = 0$. Check with quark charges: $-\tfrac13 - \tfrac13 + \tfrac23 = 0$. This is the $\Xi_c^0$.`,
      trap: 'Charm adds +1 to the generalised hypercharge, strangeness −1.' },
    { id: 'qk-033', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'mesons', format: 'multi',
      q: 'Which statements about the light pseudoscalar mesons are correct?',
      options: [R`They are $q\bar q$ states with $L = 0$ and antiparallel spins, so $J^P = 0^-$.`, R`They carry baryon number $1/3$.`, R`$\eta$ and $\eta'$ are mixtures of the SU(3) octet and singlet isoscalars.`, R`The nonet contains $\pi$, $K$, $\bar K$, $\eta$ and $\eta'$.`], answer: [0, 2, 3],
      sol: R`Quark and antiquark have intrinsic parity product $-1$, so $L = 0$ gives $P = -1$; $S = 0$ gives $J = 0$. Baryon number $\tfrac13 - \tfrac13 = 0$. Of the nine states: $\pi$ (3), $K$ (2), $\bar K$ (2), and two isoscalars that mix ($\eta$ mostly octet, $\eta'$ mostly singlet). In the vector nonet the mixing is nearly ideal: $\phi\approx s\bar s$.`,
      trap: 'Mesons have zero baryon number.' },
    { id: 'qk-034', type: 'nat', level: 4, exams: ['net'], sub: 'Gell-Mann-Okubo', unit: 'MeV',
      q: R`For pseudoscalar mesons the Gell-Mann-Okubo relation is written with squared masses: $4m_K^2 = 3m_{\eta_8}^2 + m_\pi^2$. With $m_K = 493.7$ MeV and $m_\pi = 138.0$ MeV, the predicted octet $\eta_8$ mass is ______ MeV (nearest whole number).`,
      answer: 564, tol: 1, calc: () => Math.sqrt((4 * 493.7 ** 2 - 138 ** 2) / 3),
      sol: R`$3m_{\eta_8}^2 = 4\times243\,740 - 19\,044 = 955\,915$ MeV$^2$, so $m_{\eta_8} = \sqrt{318\,638} = 564$ MeV. The physical $\eta$ (548 MeV) differs because of octet-singlet mixing with the $\eta'$.`,
      trap: 'For mesons the formula uses m², because they enter the Klein-Gordon equation that way.' },
    { id: 'qk-035', type: 'mcq', level: 4, exams: ['net'], sub: 'isospin',
      q: R`Which of these decays is forbidden by the rules of the strong interaction?`,
      options: [R`$\rho^0\to\pi^+\pi^-$`, R`$\rho^0\to\pi^0\pi^0$`, R`$\Delta^{++}\to p\pi^+$`, R`$K^{*+}\to K^0\pi^+$`], answer: 1,
      sol: R`$\rho$ has $J = 1$, so the two pions are in $L = 1$, odd under exchange. Two identical $\pi^0$ must be in an even state (Bose symmetry), so $\rho^0\to\pi^0\pi^0$ is forbidden. In isospin language, $\langle1,0;1,0|1,0\rangle = 0$. The others conserve $I$, $I_3$, $S$ and $J$.`,
      trap: R`$\rho^0\to\pi^+\pi^-$ is the main decay; only the neutral pair is forbidden.` },
    { id: 'qk-036', type: 'nat', level: 4, exams: ['net'], sub: 'SU(3) multiplets',
      q: R`The dimension of the SU(3) irreducible representation labelled $(p, q)$ is $\tfrac12(p+1)(q+1)(p+q+2)$. The representation $(2, 2)$, which appears in $8\otimes8$, has dimension ______.`,
      answer: 27, tol: 0, calc: () => dimSU3(2, 2),
      sol: R`$\tfrac12\times3\times3\times6 = 27$. Checks: $(1,0) = 3$, $(1,1) = 8$, $(3,0) = 10$. And $8\otimes8 = 27\oplus10\oplus\bar{10}\oplus8\oplus8\oplus1$: $27 + 10 + 10 + 8 + 8 + 1 = 64$.`,
      trap: R`$(p, q)$ and $(q, p)$ have the same dimension (conjugates), so $(2,2)$ is self-conjugate.` },
    { id: 'qk-037', type: 'mcq', level: 4, exams: ['net'], sub: 'isospin amplitudes',
      q: R`An $I = \tfrac32$ resonance $\Delta^0$ decays to $p\pi^-$ or $n\pi^0$. Isospin predicts $\Gamma(p\pi^-) : \Gamma(n\pi^0)$ =`,
      options: ['1 : 2', '2 : 1', '1 : 1', '1 : 3'], answer: 0,
      sol: R`$|\tfrac32, -\tfrac12\rangle = \sqrt{\tfrac13}|1, -1\rangle|\tfrac12, \tfrac12\rangle + \sqrt{\tfrac23}|1, 0\rangle|\tfrac12, -\tfrac12\rangle = \sqrt{1/3}\,\pi^-p + \sqrt{2/3}\,\pi^0n$. Ratio $1 : 2$, the mirror of $\Delta^+$.`,
      trap: 'The Δ⁰ prefers the neutral pion, just as the Δ⁺ does.' },
    { id: 'qk-038', type: 'mcq', level: 4, exams: ['net'], sub: 'isospin',
      q: R`The reaction $d + d \to {}^4\text{He} + \pi^0$ is found to be extremely rare compared with what phase space allows. The reason is that`,
      options: ['it violates charge conservation', 'it violates baryon number', 'the initial state has I = 0 and the final state I = 1, so it violates isospin and can proceed only through the electromagnetic interaction', 'it violates energy conservation'], answer: 2,
      sol: R`$d$ and $^4$He are isoscalars ($I = 0$), so $dd$ has $I = 0$. The final state $^4\text{He}\,\pi^0$ has $I = 1$. The strong interaction conserves $I$, so the reaction is forbidden for it; the tiny observed rate (measured at the level of picobarns) comes from isospin breaking by the EM interaction and the u-d mass difference.`,
      trap: 'Charge and baryon number are both conserved; only isospin forbids it.' },

    // ---------- level 5 ----------
    { id: 'qk-039', type: 'nat', level: 5, exams: ['net'], sub: 'isospin amplitudes',
      q: R`Suppose at some energy $\pi N$ scattering goes only through the $I = \tfrac12$ channel. Then $\sigma(\pi^-p\to\pi^0n)/\sigma(\pi^-p\to\pi^-p)$ equals ______ (two decimal places).`,
      answer: 0.5, tol: 0.01, calc: () => (Math.sqrt(2) / 3) ** 2 / (2 / 3) ** 2,
      sol: R`Decompose: $\pi^-p = \sqrt{\tfrac13}|\tfrac32, -\tfrac12\rangle - \sqrt{\tfrac23}|\tfrac12, -\tfrac12\rangle$ and $\pi^0n = \sqrt{\tfrac23}|\tfrac32, -\tfrac12\rangle + \sqrt{\tfrac13}|\tfrac12, -\tfrac12\rangle$. With only $A_{1/2}$: elastic amplitude $(-\sqrt{2/3})^2A_{1/2} = \tfrac23A_{1/2}$; charge exchange $(\sqrt{1/3})(-\sqrt{2/3})A_{1/2} = -\tfrac{\sqrt2}3A_{1/2}$. Ratio of squares $= (2/9)/(4/9) = 0.50$. (In the pure $I = \tfrac32$ case the same ratio is 2.) Measuring it near a resonance tells its isospin: the $N(1520)$ and $N(1680)$ follow the $I = \tfrac12$ pattern.`,
      trap: 'The ratio is reversed between the two channels: 2 for I = 3/2, 1/2 for I = 1/2.' },
    { id: 'qk-040', type: 'nat', level: 5, exams: ['net'], sub: 'magnetic moments', unit: 'μN',
      q: R`In the quark model the $\Lambda$ moment is carried entirely by its s quark (the ud pair has spin 0): $\mu_\Lambda = \mu_s = -\tfrac13(m_p/m_s)\,\mu_N$. With $m_s = 510$ MeV and $m_p = 938.3$ MeV, $\mu_\Lambda$ = ______ $\mu_N$ (three decimal places).`,
      answer: -0.613, tol: 0.002, calc: () => -(1 / 3) * 938.3 / 510,
      sol: R`$\mu_s = -\tfrac13\times938.3/510 = -0.613\,\mu_N$, in good agreement with the measured $-0.613\,\mu_N$ (the s mass is chosen this way, then other hyperon moments are predicted).`,
      trap: 'The ud pair in Λ has spin 0 and contributes nothing.' },
    { id: 'qk-041', type: 'mcq', level: 5, exams: ['net'], sub: 'SU(3) multiplets',
      q: R`In the spin-$\tfrac12$ baryon octet, how many particles have $I_3 = 0$ and $Y = 0$, and what are they?`,
      options: [R`one: $\Lambda$`, R`three: $\Sigma^+, \Sigma^0, \Sigma^-$`, R`none`, R`two: $\Sigma^0$ ($I = 1$) and $\Lambda$ ($I = 0$)`], answer: 3,
      sol: R`The octet hexagon has a doubly occupied centre ($I_3 = 0$, $Y = 0$): $\Sigma^0$ from the $I = 1$ triplet and $\Lambda$ as an isosinglet. The other six sit on the vertices: $n, p$ ($Y = 1$), $\Sigma^-, \Sigma^+$ ($Y = 0$), $\Xi^-, \Xi^0$ ($Y = -1$).`,
      trap: 'An SU(3) octet always has two states at its centre.' },
    { id: 'qk-042', type: 'msq', level: 5, exams: ['net'], sub: 'SU(3) multiplets', format: 'multi',
      q: 'Which statements about flavour SU(3) and the baryon multiplets are correct?',
      options: [R`$3\otimes3\otimes3$ contains one decuplet, two octets and one singlet.`, R`The decuplet is totally symmetric in flavour.`, R`The ground-state octet baryons have $J = \tfrac32$.`, R`SU(3) flavour symmetry is broken mainly because the s quark is heavier than u and d.`], answer: [0, 1, 3],
      sol: R`$27 = 10 + 8 + 8 + 1$; the 10 is symmetric (uuu, ..., sss), which, with symmetric spin $\tfrac32$, fits colour antisymmetry; the octet has $J = \tfrac12$. Mass splittings within multiplets (about 150 MeV per s quark) come from $m_s - m_{u,d}$, giving the Gell-Mann-Okubo formulas.`,
      trap: 'The spin-3/2 baryons are the decuplet, not the octet.' },
    ...more2,
    ...r4.items,
  ],
  gens: [
    { id: 'qk-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Gell-Mann-Nishijima',
      make(r) {
        const [name, qs] = choose(r, H.map((h) => [h[0], h[1]])), f = sumq(parseQ(qs));
        const ask = choose(r, ['Q', 'I3', 'Y']), val = ask === 'Q' ? f[0] : ask === 'I3' ? f[1] : f[2] + f[3] + f[4] + f[5];
        const given = ask === 'Q' ? R`$I_3 = ${fr(f[1])}$, $B = ${fr(f[2])}$, $S = ${f[3]}$${f[4] ? R`, $C = ${f[4]}$` : ''}${f[5] ? R`, $B' = ${f[5]}$` : ''}` : ask === 'I3' ? R`charge $${f[0]}$, $B = ${fr(f[2])}$, $S = ${f[3]}$${f[4] ? R`, $C = ${f[4]}$` : ''}${f[5] ? R`, $B' = ${f[5]}$` : ''}` : R`quark content ${qs}`;
        const what = ask === 'Q' ? 'electric charge (in units of e)' : ask === 'I3' ? R`isospin component $I_3$` : R`generalised hypercharge $Y = B + S + C + B'$`;
        return { q: R`A hadron has ${given}. Using $Q = I_3 + \tfrac12(B + S + C + B')$, its ${what} is ______ (give fractions as decimals).`,
          answer: round(val, 2), tol: 0.01, f, ask,
          sol: R`${ask === 'Y' ? R`Add the flavour numbers of the quarks (${qs}): $B = ${fr(f[2])}$, $S = ${f[3]}$, $C = ${f[4]}$, $B' = ${f[5]}$, so $Y = ${fr(val)}$.` : ask === 'Q' ? R`$Q = ${fr(f[1])} + \tfrac12(${fr(f[2] + f[3] + f[4] + f[5])}) = ${fr(val)}$.` : R`$I_3 = Q - \tfrac12(B + S + C + B') = ${f[0]} - \tfrac12(${fr(f[2] + f[3] + f[4] + f[5])}) = ${fr(val)}$.`} The particle is the ${name} (${qs}).`,
          trap: 'Hypercharge is halved in the formula.' };
      },
      verify: (p) => (p.ask === 'Q' ? p.f[0] : p.ask === 'I3' ? p.f[1] : p.f[2] + p.f[3] + p.f[4] + p.f[5]) },
    { id: 'qk-g02', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'quark content',
      make(r) {
        const pool = H.filter((h) => !['Σ*⁺', 'Λ'].includes(h[0])), h = choose(r, pool);
        const same = pool.filter((x) => x[3] === h[3] && x[1] !== h[1]).map((x) => x[1]), o = mcqOptions(r, h[1], [choose(r, same), ...same]);
        const fq = sumq(parseQ(h[1]));
        return { q: `Which quark content describes the ${h[0]} (charge ${h[2] > 0 ? '+' : ''}${h[2]}, baryon number ${h[3]}, strangeness ${h[4]}, charm ${round(fq[4], 2)}, bottomness ${round(fq[5], 2)})?`, ...o,
          sol: R`The quarks must add up to charge ${h[2]}, baryon number ${h[3]} and strangeness ${h[4]} (an s quark carries $S = -1$, an $\bar s$ carries $+1$; a bar marks an antiquark). Only ${h[1]} does.`,
          trap: 'Check all three numbers: charge, baryon number and strangeness (and charm or bottom where present).' };
      } },
    { id: 'qk-g03', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'conservation laws',
      make(r) {
        const RX = [
          ['π⁻ + p → K⁰ + Λ', 'allowed for the strong interaction'], ['π⁺ + p → K⁺ + Σ⁺', 'allowed for the strong interaction'], ['K⁻ + p → Ξ⁻ + K⁺', 'allowed for the strong interaction'], ['p + p → p + Σ⁺ + K⁰', 'allowed for the strong interaction'],
          ['π⁻ + p → K⁻ + Σ⁺', 'forbidden: strangeness changes by 2'], ['π⁻ + p → Λ + K̄⁰', 'forbidden: strangeness changes by 2'], ['p + p → Λ + Λ', 'forbidden: strangeness changes by 2'],
          ['Λ → p + π⁻', 'possible only through the weak interaction (ΔS = 1)'], ['Σ⁺ → n + π⁺', 'possible only through the weak interaction (ΔS = 1)'], ['Ξ⁰ → Λ + π⁰', 'possible only through the weak interaction (ΔS = 1)'],
          ['p + p → p + n + π⁰', 'forbidden: charge is not conserved'], ['π⁻ + p → K⁺ + K⁻ + π⁰', 'forbidden: baryon number is not conserved'], ['n → p + π⁻', 'forbidden: energy is not conserved for a free neutron'],
        ];
        const [rx, ans] = choose(r, RX), labels = ['allowed for the strong interaction', 'forbidden: strangeness changes by 2', 'possible only through the weak interaction (ΔS = 1)', 'forbidden: charge is not conserved', 'forbidden: baryon number is not conserved', 'forbidden: energy is not conserved for a free neutron'];
        const o = mcqOptions(r, ans, labels.filter((x) => x !== ans));
        return { q: `The process ${rx} is`, ...o,
          sol: R`Check in order: charge, baryon number, energy (for a decay, the parent must be heavier than the products), then strangeness: $S$ is $-1$ for each s quark ($\Lambda, \Sigma, K^-, \bar K^0$), $-2$ for $\Xi$, $+1$ for $K^+, K^0$. Strong and EM processes need $\Delta S = 0$; weak decays allow $|\Delta S| = 1$. Here: ${ans}.`,
          trap: 'Strange particles are produced in pairs (associated production) but decay one at a time, weakly.' };
      } },
    { id: 'qk-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Gell-Mann-Okubo', unit: 'MeV',
      make(r) {
        const d = pick(r, 140, 160, 1), D = pick(r, 1220, 1240, 1), m = [D, D + d + pick(r, -3, 3, 1), D + 2 * d + pick(r, -3, 3, 1), D + 3 * d + pick(r, -3, 3, 1)], miss = int(r, 0, 3);
        const names = ['Δ', 'Σ*', 'Ξ*', 'Ω⁻'], known = [0, 1, 2, 3].filter((i) => i !== miss);
        // least-squares straight line through the three known (index, mass) points, evaluated at the missing index
        const xs = known, ys = known.map((i) => m[i]), xm = xs.reduce((a, b) => a + b) / 3, ym = ys.reduce((a, b) => a + b) / 3;
        const sl = xs.reduce((a, x, k) => a + (x - xm) * (ys[k] - ym), 0) / xs.reduce((a, x) => a + (x - xm) ** 2, 0), pred = ym + sl * (miss - xm);
        return { q: R`A decuplet of baryons obeys the equal-spacing rule (each extra s quark adds the same mass). Given ${known.map((i) => `M(${names[i]}) = ${m[i]} MeV`).join(', ')}, fit a straight line in the number of s quarks (least squares) and predict $M$(${names[miss]}) = ______ MeV (one decimal place).`,
          answer: round(pred, 1), tol: 0.3, m, miss,
          sol: R`Put $M = a + bn_s$ with $n_s = 0, 1, 2, 3$ for $\Delta, \Sigma^*, \Xi^*, \Omega$. Through the three known points the best slope is $b = ${round(sl, 3)}$ MeV per s quark, and the line gives $${round(pred, 1)}$ MeV at $n_s = ${miss}$.`,
          trap: 'The rule is linear in the number of strange quarks (equivalently in hypercharge).' };
      },
      verify: (p) => { const known = [0, 1, 2, 3].filter((i) => i !== p.miss), ys = known.map((i) => p.m[i]), xm = known.reduce((a, b) => a + b) / 3, ym = ys.reduce((a, b) => a + b) / 3; const sl = known.reduce((a, x, k) => a + (x - xm) * (ys[k] - ym), 0) / known.reduce((a, x) => a + (x - xm) ** 2, 0); return ym + sl * (p.miss - xm); } },
    { id: 'qk-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Gell-Mann-Okubo', unit: 'MeV',
      make(r) {
        const N = pick(r, 930, 945, 1), L = pick(r, 1100, 1125, 1), S = pick(r, 1180, 1200, 1), X = pick(r, 1310, 1330, 1), miss = choose(r, ['N', 'L', 'S', 'X']);
        const v = { N: (3 * L + S) / 2 - X, X: (3 * L + S) / 2 - N, L: (2 * (N + X) - S) / 3, S: 2 * (N + X) - 3 * L }[miss];
        const nm = { N: R`M_N`, L: R`M_\Lambda`, S: R`M_\Sigma`, X: R`M_\Xi` }, vals = { N, L, S, X };
        const given = ['N', 'L', 'S', 'X'].filter((k) => k !== miss).map((k) => R`$${nm[k]} = ${vals[k]}$`).join(', ');
        return { q: R`Use the octet Gell-Mann-Okubo relation $2(M_N + M_\Xi) = 3M_\Lambda + M_\Sigma$ with ${given} MeV to predict $${nm[miss]}$ = ______ MeV (one decimal place).`,
          answer: round(v, 1), tol: 0.2, N, L, S, X, miss,
          sol: R`Rearranging $2(M_N + M_\Xi) = 3M_\Lambda + M_\Sigma$ for $${nm[miss]}$ and substituting gives $${round(v, 1)}$ MeV.`,
          trap: 'Keep the weights: 2 on N and Ξ, 3 on Λ, 1 on Σ.' };
      },
      verify: (p) => ({ N: (3 * p.L + p.S) / 2 - p.X, X: (3 * p.L + p.S) / 2 - p.N, L: (2 * (p.N + p.X) - p.S) / 3, S: 2 * (p.N + p.X) - 3 * p.L })[p.miss] },
    { id: 'qk-g06', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'isospin amplitudes',
      make(r) {
        const c = choose(r, [
          ['Δ⁺⁺ (I = 3/2)', 'p π⁺', 1], ['Δ⁺ (I = 3/2)', 'p π⁰', 2 / 3], ['Δ⁺ (I = 3/2)', 'n π⁺', 1 / 3], ['Δ⁰ (I = 3/2)', 'p π⁻', 1 / 3], ['Δ⁰ (I = 3/2)', 'n π⁰', 2 / 3],
          ['N*⁺ (I = 1/2)', 'p π⁰', 1 / 3], ['N*⁺ (I = 1/2)', 'n π⁺', 2 / 3], ['N*⁰ (I = 1/2)', 'p π⁻', 2 / 3], ['N*⁰ (I = 1/2)', 'n π⁰', 1 / 3],
          ['Σ*⁺ (I = 1) → Λπ or Σπ', 'Σ⁺ π⁰ (within the Σπ channel)', 1 / 2], ['K*⁺ (I = 1/2)', 'K⁰ π⁺', 2 / 3], ['K*⁺ (I = 1/2)', 'K⁺ π⁰', 1 / 3],
        ]);
        return { q: R`Using isospin Clebsch-Gordan coefficients (and ignoring phase-space differences), the fraction of ${c[0]} decays ${c[1].includes('within') ? 'into Σπ that give ' + c[1].replace(' (within the Σπ channel)', '') : 'to ' + c[1]} is ______ (three decimal places).`,
          answer: round(c[2], 3), tol: 0.001, frac: c[2],
          sol: R`Write the resonance state as a sum of (meson)(baryon) isospin states; the squared Clebsch-Gordan coefficient of the requested charge state is ${fr(c[2])}. (For $I = \tfrac32$: $\Delta^+ = \sqrt{2/3}\,p\pi^0 + \sqrt{1/3}\,n\pi^+$; for $I = \tfrac12$ the weights swap; for $I = 1$ going to two $I = 1$ particles, $|1, 1\rangle = (|1,1\rangle|1,0\rangle - |1,0\rangle|1,1\rangle)/\sqrt2$.) So the fraction is ${round(c[2], 3)}.`,
          trap: 'I = 3/2 resonances favour the neutral pion; I = 1/2 resonances favour the charged one.' };
      },
      verify: (p) => p.frac },
    { id: 'qk-g07', type: 'nat', level: 3, exams: ['net'], sub: 'SU(3) multiplets',
      make(r) {
        const p = int(r, 0, 4), q = int(r, 0, 4), d = dimSU3(p, q);
        return { q: R`The SU(3) irreducible representation with Dynkin labels $(p, q) = (${p}, ${q})$ has dimension $\tfrac12(p+1)(q+1)(p+q+2)$ = ______.`,
          answer: d, tol: 0, pp: p, qq: q,
          sol: R`$\tfrac12\times${p + 1}\times${q + 1}\times${p + q + 2} = ${d}$. Familiar cases: $(0,0) = 1$, $(1,0) = 3$, $(1,1) = 8$, $(3,0) = 10$, $(2,2) = 27$.`,
          trap: 'Conjugate representations (p, q) and (q, p) have equal dimensions.' };
      },
      verify: (x) => dimSU3(x.pp, x.qq) },
    { id: 'qk-g08', type: 'nat', level: 4, exams: ['net'], sub: 'magnetic moments', unit: 'μN',
      make(r) {
        const mud = pick(r, 300, 360, 2), ms = pick(r, 460, 560, 5), mp = 938.3, mu = (2 / 3) * mp / mud, md = (-1 / 3) * mp / mud, mss = (-1 / 3) * mp / ms;
        const B = choose(r, [['p', (4 * mu - md) / 3, '\\tfrac13(4\\mu_u - \\mu_d)'], ['n', (4 * md - mu) / 3, '\\tfrac13(4\\mu_d - \\mu_u)'], ['Σ⁺', (4 * mu - mss) / 3, '\\tfrac13(4\\mu_u - \\mu_s)'], ['Σ⁻', (4 * md - mss) / 3, '\\tfrac13(4\\mu_d - \\mu_s)'], ['Ξ⁰', (4 * mss - mu) / 3, '\\tfrac13(4\\mu_s - \\mu_u)'], ['Ξ⁻', (4 * mss - md) / 3, '\\tfrac13(4\\mu_s - \\mu_d)'], ['Λ', mss, '\\mu_s']]);
        return { q: R`In the quark model take $m_u = m_d = ${mud}$ MeV, $m_s = ${ms}$ MeV and $\mu_q = (Q_q/e)(m_p/m_q)\,\mu_N$ with $m_p = 938.3$ MeV. The magnetic moment of the ${B[0]} is ______ $\mu_N$ (three decimal places).`,
          answer: round(B[1], 3), tol: Math.max(0.002, round(Math.abs(B[1]) * 0.002, 4)), mud, ms, name: B[0],
          sol: R`$\mu_u = ${round(mu, 4)}$, $\mu_d = ${round(md, 4)}$, $\mu_s = ${round(mss, 4)}\,\mu_N$. For the ${B[0]}, $\mu = ${B[2]} = ${round(B[1], 3)}\,\mu_N$.`,
          trap: 'Octet baryons with two identical quarks q and one different quark q′ have μ = (4μ_q − μ_q′)/3; for Λ only the s quark counts.' };
      },
      verify: (p) => { const mp = 938.3, mu = (2 / 3) * mp / p.mud, md = (-1 / 3) * mp / p.mud, mss = (-1 / 3) * mp / p.ms; return { p: (4 * mu - md) / 3, n: (4 * md - mu) / 3, 'Σ⁺': (4 * mu - mss) / 3, 'Σ⁻': (4 * md - mss) / 3, 'Ξ⁰': (4 * mss - mu) / 3, 'Ξ⁻': (4 * mss - md) / 3, 'Λ': mss }[p.name]; } },
    { id: 'qk-g09', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'associated production', unit: 'MeV',
      make(r) {
        const rx = choose(r, [['π⁻', 'p', ['K⁰', 'Λ']], ['π⁻', 'p', ['K⁺', 'Σ⁻']], ['π⁺', 'p', ['K⁺', 'Σ⁺']], ['K⁻', 'p', ['Ξ⁻', 'K⁺']], ['K⁻', 'p', ['Ω⁻', 'K⁺', 'K⁰']], ['p', 'p', ['p', 'Λ', 'K⁺']], ['π⁻', 'p', ['η', 'n']]]);
        const Mf = rx[2].reduce((a, x) => a + M[x], 0), T = thr(M[rx[0]], M[rx[1]], Mf);
        return { q: R`For the reaction ${rx[0]} + ${rx[1]} → ${rx[2].join(' + ')} on a target at rest, the threshold kinetic energy of the beam ${rx[0]} is ______ MeV (nearest whole number). Masses (MeV): ${[rx[0], rx[1], ...rx[2]].filter((x, i, a) => a.indexOf(x) === i).map((x) => `${x} ${M[x]}`).join(', ')}.`,
          answer: Math.round(T), tol: 2, ma: M[rx[0]], mb: M[rx[1]], Mf,
          sol: R`At threshold the products are at rest in the centre-of-mass frame: $\sqrt s = \sum m_f = ${round(Mf, 2)}$ MeV. With $s = m_a^2 + m_b^2 + 2m_bE_a$: $T_a = \dfrac{(\sum m_f)^2 - (m_a + m_b)^2}{2m_b} = ${Math.round(T)}$ MeV.`,
          trap: 'The threshold is larger than the Q-value deficit because the centre of mass keeps moving.' };
      },
      verify: (p) => thr(p.ma, p.mb, p.Mf) },
    { id: 'qk-g10', type: 'mcq', level: 3, exams: ['net'], sub: 'SU(3) multiplets',
      make(r) {
        const c = choose(r, [[R`$3\otimes\bar3$`, R`$8\oplus1$`], [R`$3\otimes3$`, R`$6\oplus\bar3$`], [R`$3\otimes3\otimes3$`, R`$10\oplus8\oplus8\oplus1$`], [R`$8\otimes8$`, R`$27\oplus10\oplus\bar{10}\oplus8\oplus8\oplus1$`], [R`$3\otimes8$`, R`$15\oplus\bar6\oplus3$`], [R`$\bar3\otimes\bar3$`, R`$\bar6\oplus3$`]]);
        const all = [R`$8\oplus1$`, R`$6\oplus\bar3$`, R`$10\oplus8\oplus8\oplus1$`, R`$27\oplus10\oplus\bar{10}\oplus8\oplus8\oplus1$`, R`$15\oplus\bar6\oplus3$`, R`$\bar6\oplus3$`, R`$10\oplus\bar{10}\oplus1$`, R`$9\oplus1$`];
        const o = mcqOptions(r, c[1], all.filter((x) => x !== c[1]));
        return { q: `In flavour SU(3), the product ${c[0]} decomposes into irreducible representations as`, ...o,
          sol: R`Check by counting states: the dimensions on both sides must agree, and the pieces must match the symmetry types (Young diagrams). ${c[0]} $=$ ${c[1]}.`,
          trap: 'Count dimensions first: it eliminates most wrong options.' };
      } },
    { id: 'qk-g11', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'SU(3) multiplets',
      make(r) {
        const c = choose(r, [
          ['baryon octet (spin 1/2)', 'strangeness −1', 4, 'Σ⁺, Σ⁰, Σ⁻ and Λ'], ['baryon octet (spin 1/2)', 'strangeness −2', 2, 'Ξ⁰ and Ξ⁻'], ['baryon octet (spin 1/2)', 'zero charge', 4, 'n, Σ⁰, Λ and Ξ⁰'], ['baryon octet (spin 1/2)', 'charge −1', 2, 'Σ⁻ and Ξ⁻'],
          ['baryon decuplet (spin 3/2)', 'strangeness −1', 3, 'Σ*⁺, Σ*⁰, Σ*⁻'], ['baryon decuplet (spin 3/2)', 'charge −1', 4, 'Δ⁻, Σ*⁻, Ξ*⁻ and Ω⁻'], ['baryon decuplet (spin 3/2)', 'zero charge', 3, 'Δ⁰, Σ*⁰ and Ξ*⁰'], ['baryon decuplet (spin 3/2)', 'isospin multiplets (count the multiplets, not the particles)', 4, 'Δ, Σ*, Ξ*, Ω'],
          ['pseudoscalar meson nonet', 'zero charge and zero strangeness', 3, 'π⁰, η and η′'], ['pseudoscalar meson nonet', 'strangeness +1', 2, 'K⁺ and K⁰'],
        ]);
        return { q: c[1].startsWith('isospin') ? `How many isospin multiplets make up the ${c[0]}?` : `How many members of the ${c[0]} have ${c[1]}?`, answer: c[2], tol: 0, n: c[2],
          sol: `Read them off the weight diagram (I₃ across, hypercharge up): ${c[3]}, so ${c[2]}.`,
          trap: 'Remember the doubly occupied centre of an octet (Σ⁰ and Λ; or π⁰ and η₈ for mesons).' };
      },
      verify: (p) => p.n },
    { id: 'qk-g12', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'isospin amplitudes',
      make(r) {
        const which = choose(r, ['32', '12']), ch = choose(r, ['ratioTot', 'elastic', 'cex']);
        // amplitudes for pi+ p, pi- p elastic, pi- p -> pi0 n with only one isospin channel
        const a = which === '32' ? [1, 1 / 3, Math.sqrt(2) / 3] : [0, 2 / 3, Math.sqrt(2) / 3];
        const s = a.map((x) => x * x);
        let v, txt;
        if (ch === 'ratioTot' && which === '32') { v = s[0] / (s[1] + s[2]); txt = R`$\sigma_{tot}(\pi^+p)/\sigma_{tot}(\pi^-p)$`; }
        else if (ch === 'elastic' || (ch === 'ratioTot' && which === '12')) { v = s[2] / s[1]; txt = R`$\sigma(\pi^-p\to\pi^0n)/\sigma(\pi^-p\to\pi^-p)$`; }
        else { v = s[2] / (s[1] + s[2]); txt = R`the fraction of $\pi^-p$ reactions that give $\pi^0n$`; }
        return { q: R`Suppose $\pi N$ scattering at some energy goes only through the $I = ${which === '32' ? '3/2' : '1/2'}$ channel. Then ${txt} is ______ (three decimal places).`,
          answer: round(v, 3), tol: 0.001, which, ch, v,
          sol: R`$\pi^+p = |\tfrac32, \tfrac32\rangle$; $\pi^-p = \sqrt{\tfrac13}|\tfrac32\rangle - \sqrt{\tfrac23}|\tfrac12\rangle$; $\pi^0n = \sqrt{\tfrac23}|\tfrac32\rangle + \sqrt{\tfrac13}|\tfrac12\rangle$ (all with $I_3 = -\tfrac12$ except $\pi^+p$). With one channel, the amplitudes are $\pi^+p\to\pi^+p$: ${which === '32' ? '1' : '0'}; $\pi^-p\to\pi^-p$: $${which === '32' ? '1/3' : '2/3'}$; $\pi^-p\to\pi^0n$: $${which === '32' ? R`\sqrt2/3` : R`-\sqrt2/3`}$ (times the common amplitude). Squaring and taking the requested ratio gives ${round(v, 3)}.`,
          trap: 'In the I = 1/2 channel, charge exchange is half the elastic π⁻p rate; in the I = 3/2 channel it is twice.' };
      },
      verify: (p) => p.v },
    ...more,
    ...r4.gens,
  ],
};
