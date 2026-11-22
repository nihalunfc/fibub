// Round 4 extras for probability: original questions, written 2026-11-22.
import { int, choose, round } from '../_util.js';
const R = String.raw;

const comb = (n, k) => { if (k < 0 || k > n) return 0; let c = 1; for (let i = 1; i <= k; i++) c = (c * (n - k + i)) / i; return c; };

export default {
  items: [
    { id: 'prb-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate'], sub: 'rules of probability',
      q: R`A fair die is rolled twice. The probability of getting at least one six is`,
      options: [R`$\tfrac13$`, R`$\tfrac{11}{36}$`, R`$\tfrac16$`, R`$\tfrac{25}{36}$`], answer: 1,
      sol: R`Use the complement: the chance of no six in both rolls is $\left(\tfrac56\right)^2 = \tfrac{25}{36}$, so at least one six has probability $1 - \tfrac{25}{36} = \tfrac{11}{36}$.`,
      trap: R`Adding $\tfrac16 + \tfrac16 = \tfrac13$ counts the double six twice.` },
    { id: 'prb-r4-02', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'conditional probability',
      q: R`A family has two children, each equally likely to be a boy or a girl, independently. Given that at least one is a boy, the probability that both are boys is`,
      options: [R`$\tfrac12$`, R`$\tfrac14$`, R`$\tfrac13$`, R`$\tfrac23$`], answer: 2,
      sol: R`The equally likely cases are BB, BG, GB, GG. "At least one boy" leaves BB, BG, GB, of which one is BB: $\tfrac13$.`,
      trap: R`Answering $\tfrac12$ treats the condition as "the elder child is a boy", which is different information.` },
    { id: 'prb-r4-03', type: 'nat', level: 2, exams: ['jam'], sub: 'expectation',
      q: R`Three fair six-sided dice are thrown. The expected value of their total is ______ (one decimal place).`,
      answer: 10.5, tol: 0.01, calc: () => 3 * 3.5,
      sol: R`Expectation is additive (independence is not even needed): each die has mean $\frac{1 + 2 + \dots + 6}{6} = 3.5$, so the total has mean $3\times3.5 = 10.5$.`,
      trap: R`Listing all 216 outcomes is unnecessary; linearity of expectation does it in one line.` },
    { id: 'prb-r4-04', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'counting',
      q: R`Four people are each equally likely to be born in any of the 12 months, independently. The probability that all four have different birth months is closest to`,
      options: [R`$0.573$`, R`$0.427$`, R`$0.667$`, R`$0.250$`], answer: 0,
      sol: R`The second person must avoid 1 month, the third 2, the fourth 3: $\frac{12\cdot11\cdot10\cdot9}{12^4} = \frac{11880}{20736}\approx0.573$. So there is a 43% chance that at least two share a month, even with only four people.`,
      trap: R`0.427 is the chance of a shared month, the complement.` },
    { id: 'prb-r4-05', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'variance',
      q: R`$X$ and $Y$ are independent with standard deviations $\sigma_X = 1$ and $\sigma_Y = 2$. The standard deviation of $2X - 3Y$ is ______ (two decimal places).`,
      answer: 6.32, tol: 0.01, calc: () => Math.sqrt(4 * 1 + 9 * 4),
      sol: R`For independent variables, $\text{Var}(aX + bY) = a^2\text{Var}X + b^2\text{Var}Y$. Here $4\cdot1 + 9\cdot4 = 40$, so the standard deviation is $\sqrt{40}\approx6.32$. The minus sign does not reduce the spread: $(-3)^2 = 9$.`,
      trap: R`Subtracting the variances (because of the minus sign), or adding standard deviations ($2 + 6 = 8$).` },
    { id: 'prb-r4-06', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'inequalities', format: 'statements',
      q: R`Which statements are true?`,
      options: [R`For ANY distribution with mean $\mu$ and standard deviation $\sigma$, $P(|X - \mu|\ge2\sigma)\le\tfrac14$`, R`If $X\ge0$ has mean 5, then $P(X\ge20)\le\tfrac14$`, R`For a Gaussian, $P(|X - \mu|\ge2\sigma)\approx0.046$`, R`For ANY distribution, $P(|X - \mu|\ge2\sigma)\le0.05$`], answer: [0, 1, 2],
      sol: R`Chebyshev: $P(|X - \mu|\ge k\sigma)\le1/k^2$, so $\le\tfrac14$ for $k = 2$. Markov: for $X\ge0$, $P(X\ge a)\le\langle X\rangle/a = 5/20$. For a Gaussian the two-sided $2\sigma$ tail is $1 - 0.9545\approx0.046$. But 0.05 is a Gaussian figure, not a bound for every distribution: e.g. $X = \pm1$ with probability $\tfrac18$ each and 0 otherwise has $\sigma = \tfrac12$ and $P(|X|\ge2\sigma) = \tfrac14$.`,
      trap: R`Applying Gaussian tail numbers to distributions that are not Gaussian.` },
    { id: 'prb-r4-07', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'expectation', format: 'integer',
      q: R`A fair coin is tossed until two heads appear in a row. The expected number of tosses is ______.`,
      answer: 6, tol: 0, calc: () => 2 + 4,
      sol: R`Let $E$ be the expected number from the start and $E_1$ the expected number still needed just after a head. From the start: $E = 1 + \tfrac12E_1 + \tfrac12E$ (a tail sends us back). After a head: $E_1 = 1 + \tfrac12\cdot0 + \tfrac12E$. Then $E = 2 + E_1$ and $E_1 = 1 + E/2$, so $E = 3 + E/2$, giving $E = 6$.`,
      trap: R`Guessing $2\times2 = 4$ (the mean wait for a head, twice) ignores that a tail after a head resets the run.` },
    { id: 'prb-r4-08', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'error propagation',
      q: R`An angle is measured as $\theta = 30^\circ\pm1^\circ$. The standard uncertainty in $\sin\theta$ is closest to`,
      options: [R`$0.0087$`, R`$0.0175$`, R`$0.866$`, R`$0.0151$`], answer: 3,
      sol: R`$\sigma_{\sin\theta} = |\cos\theta|\,\sigma_\theta$ with $\sigma_\theta$ IN RADIANS: $1^\circ = \pi/180 = 0.01745$ rad. So $\sigma = 0.866\times0.01745\approx0.0151$.`,
      trap: R`Using $\sigma_\theta = 1$ (degrees) gives 0.866; using $\sin$ instead of $\cos$ gives 0.0087.` },
    { id: 'prb-r4-09', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'independence', format: 'statements',
      q: R`Two fair dice are thrown. $A$: the first die is even. $B$: the second die is even. $C$: the total is even. Which statements are true?`,
      options: [R`$A$, $B$ and $C$ are pairwise independent`, R`$A$, $B$ and $C$ are mutually independent`, R`$P(A\cap B\cap C) = \tfrac14$`, R`$P(C\,|\,A\cap B) = 1$`], answer: [0, 2, 3],
      sol: R`Each event has probability $\tfrac12$. $A\cap B$: both even, $\tfrac14 = P(A)P(B)$. $A\cap C$: first even and total even means second even too, $\tfrac14 = P(A)P(C)$; likewise $B\cap C$. So they are pairwise independent. But $A\cap B$ forces $C$, so $P(A\cap B\cap C) = \tfrac14\ne\tfrac18 = P(A)P(B)P(C)$: not mutually independent, and $P(C|A\cap B) = 1$.`,
      trap: R`Pairwise independence does not imply independence of all three together.` },
    { id: 'prb-r4-10', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'random walk',
      q: R`A simple symmetric random walk on the integer lattice $\mathbb Z^d$ (each step to one of the $2d$ neighbours with equal chance) starts at the origin. It returns to the origin with probability 1 in`,
      options: [R`$d = 1$ only`, R`$d = 1$ and $d = 2$, but not $d = 3$`, R`every dimension`, R`no dimension`], answer: 1,
      sol: R`The chance of being back at the origin after $2n$ steps falls like $n^{-d/2}$. The expected number of returns is $\sum n^{-d/2}$, which diverges for $d = 1, 2$ (so returns are certain, and happen infinitely often) and converges for $d\ge3$ (so the walk may escape for good; in 3D the return probability is about 0.34). This is Pólya's theorem.`,
      trap: R`Thinking a walk in 2D can get lost like one in 3D: 2D is the borderline case, and the harmonic series still diverges.` },
    { id: 'prb-r4-11', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'expectation',
      q: R`A fair die is rolled until every face from 1 to 6 has appeared at least once. The expected number of rolls is ______ (one decimal place).`,
      answer: 14.7, tol: 0.05, calc: () => 6 * (1 + 1 / 2 + 1 / 3 + 1 / 4 + 1 / 5 + 1 / 6),
      sol: R`After $k$ different faces have appeared, each roll shows a new face with probability $\frac{6 - k}{6}$, so the wait for the next new face has mean $\frac{6}{6 - k}$ (geometric). Adding the six stages: $\frac66 + \frac65 + \frac64 + \frac63 + \frac62 + \frac61 = 6\left(1 + \tfrac12 + \dots + \tfrac16\right) = 6\times2.45 = 14.7$.`,
      trap: R`Answering 6 assumes no face repeats; the last new face alone takes 6 rolls on average.` },
    { id: 'prb-r4-12', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'expectation',
      q: R`Two fair dice are thrown. The expected value of the LARGER of the two numbers is ______ (two decimal places).`,
      answer: 4.47, tol: 0.01, calc: () => [1, 2, 3, 4, 5, 6].reduce((s, m) => s + m * (2 * m - 1), 0) / 36,
      sol: R`$P(\max\le m) = (m/6)^2$, so $P(\max = m) = \frac{m^2 - (m - 1)^2}{36} = \frac{2m - 1}{36}$. Then $\langle\max\rangle = \frac{1\cdot1 + 2\cdot3 + 3\cdot5 + 4\cdot7 + 5\cdot9 + 6\cdot11}{36} = \frac{161}{36}\approx4.47$.`,
      trap: R`3.5 is the mean of one die; the larger of two is pushed upwards.` },
  ],
  gens: [
    { id: 'prb-r4g1', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'counting',
      make(r) {
        const n = choose(r, [2, 3]), s = n === 2 ? int(r, 3, 11) : int(r, 4, 14);
        let ways = 0;
        if (n === 2) ways = 6 - Math.abs(s - 7);
        else for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) { const c = s - a - b; if (c >= 1 && c <= 6) ways++; }
        const tot = 6 ** n, v = ways / tot;
        return { q: R`${n === 2 ? 'Two' : 'Three'} fair dice are thrown. The probability that the total is ${s} is ______ (four decimal places).`,
          answer: round(v, 4), tol: 0.0002, n, s,
          sol: n === 2
            ? R`Of the 36 equally likely ordered pairs, the totals of ${s} are those $(a, ${s} - a)$ with both numbers from 1 to 6: ${ways} pairs. Probability $\frac{${ways}}{36}\approx${round(v, 4)}$.`
            : R`Of the 216 equally likely ordered triples, count those adding to ${s}: for each first die $a$, the other two must total $${s} - a$, which two dice do in $6 - |${s} - a - 7|$ ways when that total is between 2 and 12. Altogether ${ways} triples, so the probability is $\frac{${ways}}{216}\approx${round(v, 4)}$.`,
          trap: 'Counting unordered outcomes (like {1, 6}) as equally likely; the ordered outcomes are.' };
      },
      verify: (p) => { let c = 0, t = 0; const go = (k, sum) => { if (k === p.n) { t++; if (sum === p.s) c++; return; } for (let f = 1; f <= 6; f++) go(k + 1, sum + f); }; go(0, 0); return c / t; } },
    { id: 'prb-r4g2', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'counting',
      make(r) {
        const Rd = int(r, 3, 7), B = int(r, 3, 7), n = int(r, 2, 4), k = int(r, 0, n);
        const v = (comb(Rd, k) * comb(B, n - k)) / comb(Rd + B, n);
        return { q: R`A box holds ${Rd} red and ${B} blue balls. ${n} balls are drawn at random without replacement. The probability that exactly ${k} of them are red is ______ (four decimal places).`,
          answer: round(v, 4), tol: 0.0002, Rd, B, n, k,
          sol: R`Every set of ${n} balls is equally likely: $\binom{${Rd + B}}{${n}} = ${comb(Rd + B, n)}$ sets. Those with exactly ${k} red: $\binom{${Rd}}{${k}}\binom{${B}}{${n - k}} = ${comb(Rd, k)}\times${comb(B, n - k)} = ${comb(Rd, k) * comb(B, n - k)}$. Probability $\frac{${comb(Rd, k) * comb(B, n - k)}}{${comb(Rd + B, n)}}\approx${round(v, 4)}$ (hypergeometric).`,
          trap: 'Using the binomial formula with $p = R/(R + B)$ assumes replacement; without it the draws are not independent.' };
      },
      verify: (p) => {
        // sum over all orders of drawing: probability of one particular order times the number of orders
        let pr = 1, red = p.Rd, blue = p.B;
        for (let i = 0; i < p.k; i++) { pr *= red / (red + blue); red--; }
        for (let i = 0; i < p.n - p.k; i++) { pr *= blue / (red + blue); blue--; }
        return pr * comb(p.n, p.k);
      } },
    { id: 'prb-r4g3', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'geometric distribution',
      make(r) {
        const p = choose(r, [0.1, 0.2, 0.25, 0.4, 0.5]), rr = int(r, 1, 3), ask = choose(r, ['mean', 'var']);
        const v = ask === 'mean' ? rr / p : (rr * (1 - p)) / (p * p);
        return { q: R`Independent trials each succeed with probability ${p}. Let $N$ be the number of trials needed to get ${rr === 1 ? 'the first success' : `${rr} successes`}. The ${ask === 'mean' ? 'mean' : 'variance'} of $N$ is ______ (two decimal places).`,
          answer: round(v, 2), tol: 0.01, p, rr, ask,
          sol: R`${rr === 1 ? 'The wait for one success is geometric' : `$N$ is a sum of ${rr} independent geometric waits (one per success)`}: each has mean $1/p$ and variance $(1 - p)/p^2$. ${ask === 'mean' ? `So $\\langle N\\rangle = ${rr}/${p} = ${round(v, 2)}$.` : `Variances of independent parts add: $\\text{Var}\\,N = ${rr}\\times\\frac{1 - ${p}}{${p}^2} = ${round(v, 2)}$.`}`,
          trap: 'The geometric variance is $(1 - p)/p^2$, not $p(1 - p)$ (that is a single trial).' };
      },
      verify: (p) => {
        // negative binomial series: P(N = n) = C(n-1, r-1) p^r (1-p)^(n-r)
        let m1 = 0, m2 = 0;
        for (let n = p.rr; n < 4000; n++) { const pn = comb(n - 1, p.rr - 1) * p.p ** p.rr * (1 - p.p) ** (n - p.rr); m1 += n * pn; m2 += n * n * pn; }
        return p.ask === 'mean' ? m1 : m2 - m1 * m1;
      } },
  ],
};
