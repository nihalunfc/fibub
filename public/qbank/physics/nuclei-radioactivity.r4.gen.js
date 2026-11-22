// Round 4 extras for nuclei-radioactivity: original questions, written 2026-11-22.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const YR = 3.156e7, NA = 6.022e23;
const sig3 = (x) => +x.toPrecision(3);
const NATURAL = [
  ['potassium', 'K-40', 39.1, 1.17e-4, 1.25e9],
  ['rubidium', 'Rb-87', 85.47, 0.2783, 4.97e10],
  ['uranium', 'U-238', 238.03, 0.9927, 4.468e9],
  ['thorium', 'Th-232', 232.04, 1.0, 1.405e10],
];
const sci = (x) => { const e = Math.floor(Math.log10(x)); return `${(x / 10 ** e).toFixed(3)}\\times10^{${e}}`; };
const natAct = (M, ab, T, m) => m / M * NA * ab * Math.LN2 / (T * YR);

export default {
  items: [
    { id: 'nbr-r4-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'half-life',
      q: R`The activity of a pure radioactive sample falls to one eighth of its starting value in $24$ hours. Its half-life is`,
      options: [R`$3$ h`, R`$8$ h`, R`$12$ h`, R`$4$ h`], answer: 1,
      sol: R`One eighth is $(\tfrac12)^3$, so three half-lives pass in $24$ h and $T_{1/2} = 24/3 = 8$ h.`,
      trap: R`Dividing 24 h by 8 (the factor) instead of by the number of halvings.` },
    { id: 'nbr-r4-02', type: 'msq', level: 1, exams: ['jam'], sub: 'activity',
      q: R`Which statements about units of radioactivity are correct?`,
      options: [R`$1$ becquerel is one decay per second`, R`$1$ curie equals $3.7\times10^{10}$ Bq`, R`The curie was chosen to be close to the activity of $1$ g of radium-226`, R`The gray is the SI unit of activity`], answer: [0, 1, 2],
      sol: R`The becquerel is the SI unit of activity: one decay per second. The older curie is $3.7\times10^{10}$ Bq, originally the activity of one gram of radium-226 (about $3.66\times10^{10}$ Bq by modern data). The gray (J/kg) measures absorbed radiation dose, not how many nuclei decay.`,
      trap: R`Mixing up units of activity (Bq, Ci) with units of dose (Gy, Sv).` },
    { id: 'nbr-r4-03', type: 'nat', level: 2, exams: ['jam'], sub: 'half-life',
      q: R`What is the smallest whole number of half-lives after which the activity of a pure sample is below $1\%$ of its starting value?`,
      answer: 7, tol: 0, calc: () => Math.ceil(Math.log2(100)),
      sol: R`After $n$ half-lives the activity is $2^{-n}$ of the start. $2^6 = 64$ gives $1.56\%$, still above $1\%$; $2^7 = 128$ gives $0.78\%$. So $n = 7$ (exactly, $n = \log_2100 = 6.64$, rounded up).`,
      trap: R`Answering 6 by rounding $6.64$ down; after 6 half-lives more than $1\%$ is left.` },
    { id: 'nbr-r4-04', type: 'mcq', level: 2, exams: ['jam'], sub: 'decay modes',
      q: R`$^{22}_{11}$Na decays by positron ($\beta^+$) emission. The daughter nucleus is`,
      options: [R`$^{22}_{12}$Mg`, R`$^{21}_{10}$Ne`, R`$^{22}_{11}$Na in an excited state`, R`$^{22}_{10}$Ne`], answer: 3,
      sol: R`In $\beta^+$ decay a proton turns into a neutron inside the nucleus ($p \to n + e^+ + \nu_e$), so $Z$ falls by one and $A$ stays the same: $^{22}_{11}$Na $\to$ $^{22}_{10}$Ne $+ e^+ + \nu_e$.`,
      trap: R`Raising $Z$ as in $\beta^-$ decay, or lowering $A$ as if a nucleon left the nucleus.` },
    { id: 'nbr-r4-05', type: 'nat', level: 3, exams: ['jam'], sub: 'decay law',
      q: R`Two samples start with equal numbers of nuclei. Nuclide P has a half-life of $2$ h and nuclide Q a half-life of $3$ h. After ______ hours the number of P nuclei left is half the number of Q nuclei left.`,
      answer: 6, tol: 0.01, unit: 'h', calc: () => Math.LN2 / (Math.LN2 / 2 - Math.LN2 / 3),
      sol: R`$\dfrac{N_P}{N_Q} = \dfrac{e^{-\lambda_Pt}}{e^{-\lambda_Qt}} = e^{-(\lambda_P - \lambda_Q)t} = \tfrac12$, so $t = \dfrac{\ln2}{\lambda_P - \lambda_Q} = \dfrac{\ln2}{\ln2(\tfrac12 - \tfrac13)} = 6$ h. Check: after 6 h, P has gone through 3 half-lives ($\tfrac18$ left) and Q through 2 ($\tfrac14$ left), and $\tfrac18 = \tfrac12\times\tfrac14$.`,
      trap: R`Using the difference of half-lives, $1$ h, as if it were a half-life of the ratio.` },
    { id: 'nbr-r4-06', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'mean life',
      q: R`For a radionuclide with half-life $T_{1/2}$ and mean life $\tau$, which statements are correct?`,
      options: [R`After one mean life the activity is $1/e$ of its starting value`, R`$\tau = T_{1/2}/\ln2 \approx 1.44\,T_{1/2}$`, R`Exactly half of the nuclei decay during one mean life`, R`The mean life is longer than the half-life`], answer: [0, 1, 3],
      sol: R`$A(t) = A_0e^{-t/\tau}$, so at $t = \tau$ the activity is $A_0/e \approx 0.37A_0$. Setting $e^{-T_{1/2}/\tau} = \tfrac12$ gives $T_{1/2} = \tau\ln2$, so $\tau = 1.44\,T_{1/2}$, longer than the half-life. During one mean life the fraction that decays is $1 - 1/e = 63\%$, not one half.`,
      trap: R`Treating "mean life" and "half-life" as the same time.` },
    { id: 'nbr-r4-07', type: 'mcq', level: 3, exams: ['jam'], sub: 'graphs',
      q: R`A pure radioactive parent decays to a STABLE daughter, with no daughter at the start. Described in words, the graph of the number of daughter nuclei against time`,
      options: [R`rises linearly for ever`, R`rises, reaches a maximum and then falls`, R`starts at zero with slope $\lambda N_0$, curves over and approaches $N_0$`, R`is a falling exponential that approaches zero`], answer: 2,
      sol: R`Every parent nucleus that decays becomes a daughter that never decays, so $N_D = N_0 - N_P = N_0(1 - e^{-\lambda t})$. At $t = 0$ its slope is $\lambda N_0$ (the starting activity); it bends over as the parent runs out and approaches $N_0$. A maximum followed by a fall happens only when the daughter is itself radioactive.`,
      trap: R`Copying the curve of a radioactive daughter, which rises and then falls.` },
    { id: 'nbr-r4-08', type: 'nat', level: 4, exams: ['jam'], sub: 'activity',
      q: R`An adult body contains about $140$ g of potassium (molar mass $39.1$ g/mol), of which $0.0117\%$ of the atoms are $^{40}$K, with half-life $1.25\times10^9$ years. Taking $1$ year $= 3.156\times10^7$ s and $N_A = 6.022\times10^{23}$ mol$^{-1}$, the $^{40}$K activity of the body is ______ Bq (three significant figures).`,
      answer: 4430, tol: 50, unit: 'Bq', calc: () => 140 / 39.1 * 6.022e23 * 1.17e-4 * Math.LN2 / (1.25e9 * 3.156e7),
      sol: R`Number of $^{40}$K atoms: $N = \dfrac{140}{39.1}\times6.022\times10^{23}\times1.17\times10^{-4} = 2.52\times10^{20}$. Decay constant: $\lambda = \dfrac{0.693}{1.25\times10^9\times3.156\times10^7\text{ s}} = 1.76\times10^{-17}$ s$^{-1}$. Activity: $\lambda N = 4.43\times10^3$ Bq, about $4400$ decays every second inside a person, from a nuclide made in stars before the Sun formed.`,
      trap: R`Forgetting the tiny isotopic abundance, which gives a value about ten thousand times too big.` },
    { id: 'nbr-r4-09', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'production and decay',
      q: R`A target is irradiated so that a radionuclide is made at a constant rate, starting with none. After an irradiation lasting two half-lives of that nuclide, its activity is what fraction of the largest (saturation) activity it could ever reach?`,
      options: [R`$50\%$`, R`$75\%$`, R`$87.5\%$`, R`$100\%$`], answer: 1,
      sol: R`With production rate $P$, $\dfrac{dN}{dt} = P - \lambda N$ gives $N = \dfrac P\lambda(1 - e^{-\lambda t})$, so the activity $\lambda N = P(1 - e^{-\lambda t})$ approaches $P$. After two half-lives $e^{-\lambda t} = \tfrac14$, so the activity is $\tfrac34$ of saturation. Irradiating much longer than a few half-lives gains little.`,
      trap: R`Using the decay fraction $\tfrac14$ itself, or thinking the activity grows linearly for ever.` },
    { id: 'nbr-r4-10', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'decay chains',
      q: R`A pure parent decays to a radioactive daughter, and BOTH have the same half-life of $5.0$ h. Starting with no daughter, the number of daughter nuclei is largest at $t = $ ______ h (two decimal places).`,
      answer: 7.21, tol: 0.02, unit: 'h', calc: () => 5 / Math.LN2,
      sol: R`With $\lambda_P = \lambda_D = \lambda$, the daughter equation $\dfrac{dN_D}{dt} = \lambda N_0e^{-\lambda t} - \lambda N_D$ has the solution $N_D = \lambda N_0\,t\,e^{-\lambda t}$ (the usual two-exponential formula fails because $\lambda_D - \lambda_P = 0$). Its derivative $\lambda N_0e^{-\lambda t}(1 - \lambda t)$ vanishes at $t = 1/\lambda = \tau = \dfrac{5.0}{\ln2} = 7.21$ h. At that moment the daughter number is $N_0/e$.`,
      trap: R`Plugging equal constants into $\dfrac{\ln(\lambda_D/\lambda_P)}{\lambda_D - \lambda_P}$, which is $0/0$; the limit is the mean life.` },
  ],
  gens: [
    { id: 'nbr-r4g1', type: 'nat', level: 3, exams: ['jam'], sub: 'decay law',
      make(r) {
        const T1 = choose(r, [1, 2, 3, 4]), T2 = T1 * choose(r, [1.5, 2, 3, 4]), r0 = choose(r, [2, 3, 4, 5, 8, 10]);
        const l1 = Math.LN2 / T1, l2 = Math.LN2 / T2, ans = Math.log(r0) / (l1 - l2);
        return { q: R`A source holds two unrelated radionuclides. At $t = 0$ there are ${r0} times as many nuclei of P (half-life $${T1}$ h) as of Q (half-life $${round(T2, 2)}$ h). The two numbers become equal after ______ h (two decimal places).`,
          answer: round(ans, 2), tol: round(Math.max(0.02, ans * 0.005), 2), T1, T2, r0,
          sol: R`$${r0}N_Qe^{-\lambda_Pt} = N_Qe^{-\lambda_Qt}$ gives $t = \dfrac{\ln${r0}}{\lambda_P - \lambda_Q}$ with $\lambda_P = \ln2/${T1} = ${round(l1, 4)}$ h$^{-1}$ and $\lambda_Q = \ln2/${round(T2, 2)} = ${round(l2, 4)}$ h$^{-1}$: $t = ${round(Math.log(r0), 4)}/${round(l1 - l2, 4)} = ${round(ans, 2)}$ h.`,
          trap: R`Using half-lives where decay constants belong, or forgetting that only the faster-decaying nuclide can catch up.` };
      },
      verify: (p) => Math.log(p.r0) / (Math.LN2 / p.T1 - Math.LN2 / p.T2) },
    { id: 'nbr-r4g2', type: 'nat', level: 4, exams: ['jam'], sub: 'activity',
      make(r) {
        const [el, iso, M, ab, T] = choose(r, NATURAL), m = choose(r, [1, 10, 50, 100, 250]), ans = natAct(M, ab, T, m);
        return { q: R`A sample contains $${m}$ g of natural ${el} (molar mass $${M}$ g/mol). The isotope ${iso} makes up $${round(ab * 100, 4)}\%$ of the atoms and has half-life $${sci(T)}$ years. Taking $1$ year $= 3.156\times10^7$ s and $N_A = 6.022\times10^{23}$ mol$^{-1}$, the ${iso} activity is ______ Bq (three significant figures).`,
          answer: sig3(ans), tol: sig3(ans * 0.01), M, ab, T, m,
          sol: R`$N = \dfrac{${m}}{${M}}\times6.022\times10^{23}\times${ab} = ${sci(m / M * NA * ab)}$ nuclei; $\lambda = \dfrac{\ln2}{${sci(T)}\times3.156\times10^7\text{ s}} = ${sci(Math.LN2 / (T * YR))}$ s$^{-1}$; activity $\lambda N = ${sig3(ans)}$ Bq.`,
          trap: R`Leaving out the isotopic abundance or the conversion of years to seconds.` };
      },
      verify: (p) => natAct(p.M, p.ab, p.T, p.m) },
    { id: 'nbr-r4g3', type: 'mcq', level: 1, exams: ['jam'], sub: 'half-life',
      make(r) {
        const n = int(r, 2, 5), T = choose(r, [2, 3, 5, 6, 8, 10, 12]), t = n * T, f = 2 ** n;
        const o = mcqOptions(r, T, [round(t / f, 2), round(t / (n + 1), 2), round(t / (n - 1), 2), round(t * Math.LN2 / n, 2)], (v) => `$${v}$ h`);
        return { q: R`The activity of a pure radionuclide falls to $1/${f}$ of its starting value in $${t}$ hours. Its half-life is`, ...o, n, T,
          sol: R`$1/${f} = (\tfrac12)^{${n}}$, so ${n} half-lives fit into $${t}$ h and $T_{1/2} = ${t}/${n} = ${T}$ h.`,
          trap: R`Dividing the time by the factor $${f}$ instead of by the number of halvings, $\log_2${f} = ${n}$.` };
      } },
  ],
};
