// Round 4 extras for probability-distributions: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round } from '../_util.js';
import { simpson } from './_more.js';
const R = String.raw;

const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));

export default {
  items: [
    { id: 'prd-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate'], sub: 'uniform',
      q: R`A variable is uniformly distributed on the interval $[2, 8]$. Its mean is`,
      options: [R`$4$`, R`$5$`, R`$6$`, R`$3$`], answer: 1,
      sol: R`A uniform density is flat, so the mean is the midpoint: $(2 + 8)/2 = 5$.`,
      trap: R`$6/2 = 3$ is half the width, not the centre.` },
    { id: 'prd-r4-02', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'Poisson',
      q: R`For a Poisson distribution with mean $\lambda = 3.5$, the most probable count is`,
      options: [R`$3$`, R`$4$`, R`$3.5$`, R`$3$ and $4$ equally`], answer: 0,
      sol: R`$\frac{P(n)}{P(n - 1)} = \frac\lambda n$. Going from 3 to 4 the ratio is $3.5/4 < 1$, so $P(4) < P(3)$; going from 2 to 3 it is $3.5/3 > 1$. The peak is at $n = 3$, the integer part of $\lambda$. (Two equal peaks happen only for integer $\lambda$.)`,
      trap: R`A count must be a whole number, so 3.5 cannot be the mode even though it is the mean.` },
    { id: 'prd-r4-03', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'multinomial',
      q: R`A fair die is rolled 6 times. The probability that each face appears exactly once is ______ (four decimal places).`,
      answer: 0.0154, tol: 0.0002, calc: () => fact(6) / 6 ** 6,
      sol: R`Favourable sequences: the six faces in any order, $6! = 720$. All sequences: $6^6 = 46656$. Probability $\frac{720}{46656}\approx0.0154$.`,
      trap: R`Because there are six faces and six rolls, it feels likely; it happens only about once in 65 tries.` },
    { id: 'prd-r4-04', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'change of variables',
      q: R`$X$ is uniform on $(0, 1)$ and $Y = X^2$. The probability density of $Y$ on $(0, 1)$ is`,
      options: [R`$2y$`, R`$\sqrt y$`, R`$\dfrac{1}{2\sqrt y}$`, R`$\dfrac{1}{\sqrt y}$`], answer: 2,
      sol: R`$P(Y\le y) = P(X\le\sqrt y) = \sqrt y$. Differentiating: $p_Y(y) = \frac{1}{2\sqrt y}$, which integrates to 1 on $(0, 1)$ and piles up near 0 (squaring squeezes small values together).`,
      trap: R`$2y$ is what you get by substituting $y$ for $x$ in $dy/dx = 2x$; the Jacobian goes the other way.` },
    { id: 'prd-r4-05', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'Rayleigh distribution',
      q: R`The velocity components $v_x$, $v_y$ of a particle moving in a plane are independent Gaussians with mean 0 and standard deviation $\sigma = 2$ m/s. The mean speed $\langle\sqrt{v_x^2 + v_y^2}\rangle$ is ______ m/s (three decimal places).`,
      answer: 2.507, tol: 0.003, calc: () => 2 * Math.sqrt(Math.PI / 2),
      sol: R`In polar form the speed $v$ has the Rayleigh density $\frac{v}{\sigma^2}e^{-v^2/2\sigma^2}$ (the factor $v$ is the circumference $2\pi v$ from the area element). Its mean is $\int_0^\infty\frac{v^2}{\sigma^2}e^{-v^2/2\sigma^2}dv = \sigma\sqrt{\pi/2}\approx1.2533\sigma = 2.507$ m/s.`,
      trap: R`$\sqrt{\langle v_x^2 + v_y^2\rangle} = \sigma\sqrt2\approx2.83$ is the rms speed, larger than the mean speed.` },
    { id: 'prd-r4-06', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'moments',
      q: R`Which of these distributions have a FINITE variance?`,
      options: [R`Gaussian`, R`Cauchy (Lorentzian), $\dfrac{1}{\pi(1 + x^2)}$`, R`Exponential, $e^{-x}$ for $x > 0$`, R`$p(x) = 2/x^3$ for $x\ge1$`], answer: [0, 2],
      sol: R`Gaussian and exponential tails fall faster than any power, so all moments exist (variances $\sigma^2$ and 1). The Cauchy density falls as $1/x^2$: $\int x^2p\,dx$ diverges (even the mean does not exist). For $2/x^3$ the mean is $\int_1^\infty2/x^2dx = 2$, but $\langle x^2\rangle = \int_1^\infty2/x\,dx$ diverges logarithmically.`,
      trap: R`A finite mean does not guarantee a finite variance (the last case).` },
    { id: 'prd-r4-07', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'exponential', unit: 'years', format: 'integer',
      q: R`Three identical lamps are switched on together; each has an exponentially distributed lifetime with mean 6 years, independently. The expected time until the LAST of them fails is ______ years.`,
      answer: 11, tol: 0, calc: () => 6 / 3 + 6 / 2 + 6 / 1,
      sol: R`While $k$ lamps work, the first failure among them is exponential with rate $k/6$ per year, mean $6/k$ years (memorylessness resets the clock after each failure). So the total is $\frac63 + \frac62 + \frac61 = 2 + 3 + 6 = 11$ years.`,
      trap: R`Answering 6 (the mean of one lamp) or 2 (the wait for the FIRST failure).` },
    { id: 'prd-r4-08', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'exponential',
      q: R`$T = T_1 + \dots + T_N$ is the sum of $N$ independent exponential waiting times, each with density $\lambda e^{-\lambda t}$ ($t > 0$). The density of $T$ is`,
      options: [R`$N\lambda e^{-N\lambda t}$`, R`$\dfrac{\lambda}{N}e^{-\lambda t/N}$`, R`a Gaussian of mean $N/\lambda$ for every $N$`, R`$\dfrac{\lambda^Nt^{N-1}e^{-\lambda t}}{(N - 1)!}$`], answer: 3,
      sol: R`$T$ is the time of the $N$th event of a Poisson process of rate $\lambda$. $P(T > t)$ is the chance of fewer than $N$ events by $t$; differentiating gives the gamma (Erlang) density $\frac{\lambda^Nt^{N-1}e^{-\lambda t}}{(N - 1)!}$ (or convolve the exponentials, or multiply Laplace transforms $\left(\frac{\lambda}{\lambda + s}\right)^N$). It becomes Gaussian only for large $N$. $N\lambda e^{-N\lambda t}$ is the density of the MINIMUM of the $N$ times.`,
      trap: R`Confusing the time of the first of $N$ events (minimum) with the time to wait through all of them (sum).` },
    { id: 'prd-r4-09', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'covariance', format: 'statements',
      q: R`$X$ and $Z$ are independent standard normal variables, and $Y = X + Z$. Which statements are true?`,
      options: [R`$\text{Var}\,Y = 2$`, R`$\text{Cov}(X, Y) = 1$`, R`The correlation coefficient of $X$ and $Y$ is $1/\sqrt2$`, R`$X$ and $Y$ are independent`], answer: [0, 1, 2],
      sol: R`$\text{Var}\,Y = 1 + 1 = 2$. $\text{Cov}(X, X + Z) = \text{Var}X + \text{Cov}(X, Z) = 1$. Correlation $= \frac{1}{\sqrt1\sqrt2} = \frac1{\sqrt2}\approx0.71$. A non-zero covariance rules out independence.`,
      trap: R`Adding independent noise weakens the correlation but does not remove it.` },
    { id: 'prd-r4-10', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'Maxwell distribution',
      q: R`For an ideal gas at temperature $T$, the most probable KINETIC ENERGY of a molecule (the peak of the energy distribution) is`,
      options: [R`$kT$`, R`$\tfrac12kT$`, R`$\tfrac32kT$`, R`$2kT$`], answer: 1,
      sol: R`The energy density is $f(E)\propto\sqrt E\,e^{-E/kT}$ (from $4\pi v^2dv\propto\sqrt E\,dE$). Setting $\frac{d}{dE}\ln f = \frac{1}{2E} - \frac1{kT} = 0$ gives $E = \tfrac12kT$. The most probable SPEED gives $\tfrac12mv_p^2 = kT$, a different number, because changing variables reshapes the density. The mean energy is $\tfrac32kT$.`,
      trap: R`The peak of a density does not transform like the variable: $E(v_p)\ne E_p$.` },
    { id: 'prd-r4-11', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'uniform',
      q: R`$U_1$, $U_2$, $U_3$ are independent and uniform on $(0, 1)$. The probability that $U_1 + U_2 + U_3\le1$ is ______ (four decimal places).`,
      answer: 0.1667, tol: 0.0002, calc: () => 1 / 6,
      sol: R`The point $(U_1, U_2, U_3)$ is uniform in the unit cube (volume 1). The region $u_1 + u_2 + u_3\le1$ with all $u_i\ge0$ is a corner tetrahedron of volume $\frac13\cdot\frac12\cdot1 = \frac16$. So the probability is $\frac16\approx0.1667$ (for $n$ variables it is $1/n!$).`,
      trap: R`Using $(1/2)^3$ treats the condition as three separate halves.` },
    { id: 'prd-r4-12', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'entropy',
      q: R`The Shannon entropy $H = -\sum_ip_i\log_2p_i$ of a single roll of a fair six-sided die is ______ bits (three decimal places).`,
      answer: 2.585, tol: 0.002, calc: () => Math.log2(6),
      sol: R`All six outcomes have $p = 1/6$: $H = -6\cdot\frac16\log_2\frac16 = \log_26\approx2.585$ bits. Equal probabilities give the largest entropy for a given number of outcomes, the same principle that makes the microcanonical ensemble have $S = k\ln\Omega$.`,
      trap: R`Using the natural log gives $\ln6\approx1.792$ (nats, not bits).` },
  ],
  gens: [
    { id: 'prd-r4g1', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'multinomial',
      make(r) {
        const n = int(r, 4, 6), a = int(r, 1, 2), b = int(r, 1, n - a);
        const c = n - a - b, v = (fact(n) / (fact(a) * fact(b) * fact(c))) * (1 / 6) ** a * (1 / 6) ** b * (4 / 6) ** c;
        return { q: R`A fair die is rolled ${n} times. The probability of getting exactly ${a} six${a > 1 ? 'es' : ''} and exactly ${b} one${b > 1 ? 's' : ''} is ______ (four decimal places).`,
          answer: round(v, 4), tol: 0.0002, n, a, b,
          sol: R`Three categories per roll: six ($\tfrac16$), one ($\tfrac16$), anything else ($\tfrac46$). The multinomial probability is $\frac{${n}!}{${a}!\,${b}!\,${c}!}\left(\tfrac16\right)^{${a}}\left(\tfrac16\right)^{${b}}\left(\tfrac46\right)^{${c}} = ${fact(n) / (fact(a) * fact(b) * fact(c))}\times${round((1 / 6) ** (a + b) * (4 / 6) ** c, 6)}\approx${round(v, 4)}$.`,
          trap: 'Forgetting the third category ("neither"), or leaving out the multinomial coefficient that counts the orders.' };
      },
      verify: (p) => {
        let hit = 0, tot = 0;
        const go = (k, s6, s1) => { if (k === p.n) { tot++; if (s6 === p.a && s1 === p.b) hit++; return; } for (let f = 1; f <= 6; f++) go(k + 1, s6 + (f === 6), s1 + (f === 1)); };
        go(0, 0, 0); return hit / tot;
      } },
    { id: 'prd-r4g2', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'exponential',
      make(r) {
        const k = int(r, 2, 5), tau = choose(r, [2, 3, 4, 6, 10, 12]), which = choose(r, ['first', 'last']);
        let H = 0; for (let i = 1; i <= k; i++) H += 1 / i;
        const v = which === 'first' ? tau / k : tau * H;
        return { q: R`${k} identical components start working together; each lasts an exponentially distributed time with mean ${tau} hours, independently. The expected time until the ${which} of them fails is ______ hours (three decimal places).`,
          answer: round(v, 3), tol: 0.002, k, tau, which,
          sol: which === 'first'
            ? R`The first failure is the minimum of ${k} exponentials. Rates add: the minimum is exponential with rate $${k}/${tau}$ per hour, so its mean is $${tau}/${k} = ${round(v, 3)}$ hours.`
            : R`After each failure the survivors start afresh (memorylessness). While $j$ components work, the next failure takes on average $${tau}/j$ hours. Total: $${tau}\left(1 + \tfrac12 + \dots + \tfrac1{${k}}\right) = ${tau}\times${round(H, 4)}\approx${round(v, 3)}$ hours.`,
          trap: which === 'first' ? 'The minimum of several lifetimes is shorter than any one mean; divide, do not multiply.' : 'The last failure takes longer than one mean lifetime, but not $k$ times as long.' };
      },
      verify: (p) => {
        const T = p.tau * 60;
        return p.which === 'first' ? simpson((t) => Math.exp((-p.k * t) / p.tau), 0, T, 6000) : simpson((t) => 1 - (1 - Math.exp(-t / p.tau)) ** p.k, 0, T, 6000);
      } },
    { id: 'prd-r4g3', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'change of variables',
      make(r) {
        const n = choose(r, [2, 3, 4]), kind = choose(r, ['power', 'root']);
        const pw = (e) => (e === 1 ? 'y' : `y^{${e}}`);
        const fr = (num, den) => (den === 1 ? `${num}` : `${num}/${den}`);
        let correct, wrongs, expr;
        if (kind === 'power') {
          expr = `X^{${n}}`;
          correct = `$\\dfrac{1}{${n}}\\,y^{-${fr(n - 1, n)}}$`;
          wrongs = [`$${n}\\,${pw(n - 1)}$`, `$y^{1/${n}}$`, `$\\dfrac{1}{${n}}\\,y^{1/${n}}$`];
        } else {
          expr = `X^{1/${n}}`;
          correct = `$${n}\\,${pw(n - 1)}$`;
          wrongs = [`$\\dfrac{1}{${n}}\\,y^{-${fr(n - 1, n)}}$`, `$y^{${n}}$`, `$${n}\\,${pw(n)}$`];
        }
        const m = mcqOptions(r, correct, wrongs, (s) => s);
        return { q: R`$X$ is uniform on $(0, 1)$ and $Y = ${expr}$. The probability density of $Y$ on $(0, 1)$ is`, ...m,
          sol: kind === 'power'
            ? R`$P(Y\le y) = P(X\le y^{1/${n}}) = y^{1/${n}}$. Differentiate: $p_Y = \frac1{${n}}y^{1/${n} - 1} = \frac1{${n}}y^{-${fr(n - 1, n)}}$. It is large near $y = 0$: raising to a power crowds values towards 0.`
            : R`$P(Y\le y) = P(X\le y^{${n}}) = y^{${n}}$. Differentiate: $p_Y = ${n}${pw(n - 1)}$, which integrates to 1 on $(0, 1)$. Taking a root pushes values towards 1.`,
          trap: 'Always go through the cumulative distribution (or use $p_Y = p_X\\,|dx/dy|$); substituting into $dy/dx$ gives the inverse Jacobian.' };
      } },
  ],
};
