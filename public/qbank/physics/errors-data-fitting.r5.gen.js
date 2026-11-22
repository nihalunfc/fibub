// Round 5 extras for errors-data-fitting: original questions, written 2026-11-22.
import { pick, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const A = ['jam', 'gate', 'net'];
const T95 = { 2: 4.303, 3: 3.182, 4: 2.776, 5: 2.571, 7: 2.365, 9: 2.262 };
const pendG = () => { const L1 = 1.2, L2 = 0.8, T1 = 2.198, T2 = 1.795, sL = 0.001, sT = 0.002, D = T1 * T1 - T2 * T2, g = 4 * Math.PI ** 2 * (L1 - L2) / D;
  return g * Math.sqrt((Math.SQRT2 * sL / (L1 - L2)) ** 2 + ((2 * T1 * sT) ** 2 + (2 * T2 * sT) ** 2) / D ** 2); };

export default {
  items: [
    { id: 'edf-r5-01', type: 'mcq', level: 1, exams: A, sub: 'significant figures',
      q: R`A calculation gives $0.0045627$ with a standard uncertainty of $0.00012$ (same units). The result is best reported as`,
      options: [R`$(4.5627\pm0.00012)\times10^{-3}$`, R`$(4.6\pm0.1)\times10^{-2}$`, R`$(4.56\pm0.12)\times10^{-3}$`, R`$0.0045627\pm0.00012$`], answer: 2,
      sol: R`Quote the uncertainty to one or two significant figures ($0.12\times10^{-3}$), then round the value to the same decimal place: $4.56\times10^{-3}$. Writing both with the same power of ten makes them easy to compare. Extra digits in the value beyond the uncertainty carry no information.`,
      trap: R`Mixing a scaled value with an unscaled uncertainty (first option) or slipping a power of ten.` },
    { id: 'edf-r5-02', type: 'nat', level: 2, exams: A, sub: 'error propagation',
      q: R`The density of a cylinder is found from $\rho = m/(\pi r^2h)$. The independent relative uncertainties are $2.0\%$ in $m$, $1.0\%$ in $r$ and $1.5\%$ in $h$. The relative uncertainty in $\rho$ is ______ % (to two decimal places).`,
      answer: 3.2, tol: 0.02, calc: () => Math.sqrt(2 ** 2 + (2 * 1) ** 2 + 1.5 ** 2),
      sol: R`For a product of powers, relative uncertainties add in quadrature, each multiplied by its power: $\dfrac{\sigma_\rho}{\rho} = \sqrt{(2.0)^2 + (2\times1.0)^2 + (1.5)^2}\,\% = \sqrt{4 + 4 + 2.25}\,\% = \sqrt{10.25}\,\% = 3.20\%$. The radius counts twice because it is squared.`,
      trap: R`Forgetting the power 2 on $r$ gives $2.69\%$; adding linearly gives $5.5\%$, the worst case, not the standard uncertainty.` },
    { id: 'edf-r5-03', type: 'mcq', level: 2, exams: A, sub: 'least squares',
      q: R`An unweighted least-squares straight line is fitted to the points $(1, 3)$, $(2, 5)$, $(3, 4)$ and $(4, 8)$. Without finding the slope, which point is certain to lie on the fitted line?`,
      options: [R`$(1, 3)$`, R`$(2.5, 4.5)$`, R`$(4, 8)$`, R`$(2.5, 5.0)$`], answer: 3,
      sol: R`Setting $\partial S/\partial a = 0$ for $S = \sum(y_i - a - bx_i)^2$ gives $\sum(y_i - a - bx_i) = 0$, i.e. $\bar y = a + b\bar x$: the line passes through the centroid. Here $\bar x = 10/4 = 2.5$ and $\bar y = 20/4 = 5.0$.`,
      trap: R`$4.5$ is the median of the $y$ values, not the mean; the fit need not pass through any data point.` },
    { id: 'edf-r5-04', type: 'nat', level: 3, exams: A, sub: 'correlated errors',
      q: R`Two quantities have $\sigma_x = 0.30$ and $\sigma_y = 0.40$ with correlation coefficient $\rho = +0.50$. The standard uncertainty of $f = x - y$ is ______ (to three decimal places).`,
      answer: 0.361, tol: 0.002, calc: () => Math.sqrt(0.09 + 0.16 - 2 * 0.5 * 0.3 * 0.4),
      sol: R`$\sigma_f^2 = \sigma_x^2 + \sigma_y^2 - 2\rho\sigma_x\sigma_y = 0.09 + 0.16 - 2\times0.5\times0.12 = 0.13$, so $\sigma_f = 0.361$. Positive correlation helps a difference: shared errors cancel. For a sum it would make things worse ($\sqrt{0.37} = 0.608$).`,
      trap: R`Ignoring the correlation gives $0.500$; using a plus sign for the covariance term gives $0.608$.` },
    { id: 'edf-r5-05', type: 'msq', level: 3, exams: A, sub: 'least squares', format: 'statements',
      q: R`Which statements about least-squares straight-line fitting are correct?`,
      options: [R`If the $y$ errors are Gaussian with equal $\sigma$ and the $x$ values are exact, the unweighted fit gives the maximum-likelihood line.`, R`Fitting $\ln y$ against $x$ for exponential data with equal absolute errors in $y$ gives too much weight to the small-$y$ points unless each point is weighted by about $y_i^2$.`, R`The fitted slope and intercept are generally correlated unless the $x$ values are centred so that $\bar x = 0$.`, R`The fit minimises the sum of squared perpendicular distances from the points to the line.`], answer: [0, 1, 2],
      sol: R`Maximising a product of Gaussians is minimising $\sum(y_i - a - bx_i)^2/\sigma^2$. After a log transform, $\sigma_{\ln y} = \sigma_y/y$, so small $y$ values get large errors and must get weights $1/\sigma_{\ln y}^2\propto y^2$. The covariance of $a$ and $b$ is proportional to $-\bar x$, so it vanishes only for centred $x$. Least squares measures vertical distances in $y$, not perpendicular ones (that is orthogonal regression).`,
      trap: R`Ordinary least squares uses vertical residuals because only $y$ is assumed uncertain.` },
    { id: 'edf-r5-06', type: 'nat', level: 4, exams: A, sub: 'least squares',
      q: R`Seven points at $x = 0, 2, 4, 6, 8, 10, 12$ each have $\sigma_y = 0.50$. The standard uncertainty of the slope of the unweighted least-squares line is ______ (to four decimal places).`,
      answer: 0.0472, tol: 0.0005, calc: () => 0.5 / Math.sqrt(112),
      sol: R`$\sigma_b = \sigma_y/\sqrt{\sum(x_i - \bar x)^2}$. With $\bar x = 6$, the deviations are $-6, -4, -2, 0, 2, 4, 6$, and their squares sum to $2(36 + 16 + 4) = 112$. So $\sigma_b = 0.50/\sqrt{112} = 0.50/10.58 = 0.0472$. Spreading the $x$ values wider is the cheapest way to pin the slope down.`,
      trap: R`Dividing by $\sqrt N$ or by the range instead of by $\sqrt{\sum(x_i - \bar x)^2}$.` },
    { id: 'edf-r5-07', type: 'mcq', level: 4, exams: A, sub: 'confidence intervals',
      q: R`Four readings have mean $10.0$ and sample standard deviation $s = 0.40$. The $95\%$ confidence interval for the true mean, using Student's $t$ distribution ($t = 3.18$ for 3 degrees of freedom), is about`,
      options: [R`$10.0\pm0.39$`, R`$10.0\pm0.64$`, R`$10.0\pm0.80$`, R`$10.0\pm1.27$`], answer: 1,
      sol: R`Standard error $s/\sqrt N = 0.40/2 = 0.20$. With only 3 degrees of freedom, $s$ itself is uncertain, so the Gaussian factor $1.96$ is replaced by $t = 3.18$: half-width $3.18\times0.20 = 0.64$.`,
      trap: R`$1.96\times0.20 = 0.39$ trusts $s$ as if it were the true $\sigma$; $3.18\times0.40 = 1.27$ uses $s$ instead of the standard error.` },
    { id: 'edf-r5-08', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'maximum likelihood', format: 'statements',
      q: R`Which statements about maximum-likelihood (ML) estimates are correct?`,
      options: [R`For independent Poisson counts in equal intervals, the ML estimate of the mean is the average count.`, R`For Gaussian data, the ML estimate of the variance divides the sum of squares by $N$, and is slightly biased.`, R`For Gaussian results with known, different $\sigma_i$, the ML estimate of the common value is the weighted mean with weights $1/\sigma_i^2$.`, R`ML estimates are always unbiased.`], answer: [0, 1, 2],
      sol: R`Poisson: $\ln L = \sum(n_i\ln\mu - \mu) + $ const, so $d\ln L/d\mu = 0$ gives $\mu = \bar n$. Gaussian: maximising over $\sigma^2$ gives $\sum(x_i - \bar x)^2/N$, whose expectation is $\tfrac{N - 1}{N}\sigma^2$ (biased; the $N - 1$ form corrects this). Gaussian with known $\sigma_i$: minimising $\sum(x_i - \mu)^2/\sigma_i^2$ gives the weighted mean. The variance example shows ML can be biased.`,
      trap: R`The $N$ versus $N - 1$ variance is the standard counterexample to "ML is unbiased".` },
    { id: 'edf-r5-09', type: 'nat', level: 5, exams: A, sub: 'error propagation',
      q: R`To cancel the unknown pivot position, $g$ is found from two lengths of the same pendulum: $g = 4\pi^2(L_1 - L_2)/(T_1^2 - T_2^2)$. The data are $L_1 = 1.200$ m and $L_2 = 0.800$ m (each $\pm0.001$ m, independent) and $T_1 = 2.198$ s and $T_2 = 1.795$ s (each $\pm0.002$ s, independent). The standard uncertainty of $g$ is ______ m s$^{-2}$ (to three decimal places).`,
      answer: 0.077, tol: 0.002, calc: () => pendG(),
      sol: R`$L_1 - L_2 = 0.400$ m with uncertainty $\sqrt2\times0.001 = 0.00141$ m: $0.354\%$. $D = T_1^2 - T_2^2 = 4.8312 - 3.2220 = 1.6092$ s$^2$; $\sigma_D = \sqrt{(2T_1\sigma_T)^2 + (2T_2\sigma_T)^2} = \sqrt{0.008792^2 + 0.00718^2} = 0.01135$ s$^2$: $0.705\%$. So $g = 4\pi^2\times0.400/1.6092 = 9.813$ m s$^{-2}$ with relative uncertainty $\sqrt{0.354^2 + 0.705^2}\,\% = 0.789\%$, i.e. $\sigma_g = 0.077$ m s$^{-2}$.`,
      trap: R`A difference of squares is far less precise than either square: $0.2\%$ timing errors grow to $0.7\%$ in $D$.` },
    { id: 'edf-r5-10', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'weighted fits',
      q: R`In a straight-line fit with slope near $b = 3.0$, a point has $\sigma_x = 0.10$ and $\sigma_y = 0.20$. Using the effective-variance method, the uncertainty to assign to that point's $y$ is about`,
      options: [R`$0.36$`, R`$0.50$`, R`$0.26$`, R`$0.22$`], answer: 0,
      sol: R`An error $\delta x$ moves the point off the line by $b\,\delta x$ in the $y$ direction, so $\sigma_{eff}^2 = \sigma_y^2 + b^2\sigma_x^2 = 0.04 + 9\times0.01 = 0.13$, and $\sigma_{eff} = 0.36$. Steep lines make $x$ errors matter more.`,
      trap: R`$0.50$ adds the errors linearly; $0.26$ uses $b\sigma_x^2$ instead of $b^2\sigma_x^2$; $0.22$ forgets the slope.` },
  ],
  gens: [
    { id: 'edf-r5g1', type: 'nat', level: 4, exams: A, sub: 'confidence intervals',
      make(r) {
        const N = choose(r, [3, 4, 5, 6, 8, 10]), s = pick(r, 0.1, 2, 0.05), t = T95[N - 1], hw = t * s / Math.sqrt(N);
        return { q: R`${N} readings have sample standard deviation $s = ${s}$. Using Student's $t$ ($t_{95} = ${t}$ for ${N - 1} degrees of freedom), the half-width of the $95\%$ confidence interval for the mean is ______ (to three decimal places).`,
          answer: round(hw, 3), tol: Math.max(0.001, round(hw * 0.003, 3)), N, s, t,
          sol: R`Standard error $s/\sqrt N = ${s}/\sqrt{${N}} = ${round(s / Math.sqrt(N), 4)}$. Half-width $= ${t}\times${round(s / Math.sqrt(N), 4)} = ${round(hw, 3)}$.`,
          trap: 'With few readings the factor is $t$, not 1.96, and it multiplies the standard error, not $s$.' };
      },
      verify: (p) => p.t * p.s / Math.sqrt(p.N) },
    { id: 'edf-r5g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'weighted fits',
      make(r) {
        const b = pick(r, 0.5, 5, 0.5), sx = pick(r, 0.02, 0.3, 0.02), sy = pick(r, 0.05, 0.5, 0.05);
        const se = Math.sqrt(sy * sy + b * b * sx * sx);
        return { q: R`In a straight-line fit with slope about $${b}$, a point has $\sigma_x = ${sx}$ and $\sigma_y = ${sy}$. Its effective $y$ uncertainty $\sqrt{\sigma_y^2 + b^2\sigma_x^2}$ is ______ (to three decimal places).`,
          answer: round(se, 3), tol: Math.max(0.001, round(se * 0.003, 3)), b, sx, sy,
          sol: R`$\sigma_{eff} = \sqrt{${sy}^2 + (${b}\times${sx})^2} = \sqrt{${round(sy * sy, 5)} + ${round((b * sx) ** 2, 5)}} = ${round(se, 3)}$.`,
          trap: 'The $x$ error is scaled by the slope before adding in quadrature.' };
      },
      verify: (p) => Math.sqrt(p.sy ** 2 + p.b ** 2 * p.sx ** 2) },
    { id: 'edf-r5g3', type: 'mcq', level: 3, exams: A, sub: 'least squares',
      make(r) {
        const N = choose(r, [4, 5, 6, 7, 8, 9]), h = choose(r, [0.5, 1, 2, 5]), sy = pick(r, 0.1, 1, 0.1);
        const Sxx = h * h * N * (N * N - 1) / 12, sb = sy / Math.sqrt(Sxx);
        const xs = Array.from({ length: N }, (_, i) => round(i * h, 2)).join(', ');
        const sh = (v) => `$${+v.toPrecision(3)}$`;
        const o = mcqOptions(r, sb, [sy / Math.sqrt(N), sy / ((N - 1) * h), sy / Sxx, sy / Math.sqrt(Sxx / N)], sh);
        return { q: R`Points at $x = ${xs}$ each have $\sigma_y = ${sy}$. The standard uncertainty of the least-squares slope is`, ...o,
          sol: R`$\sigma_b = \sigma_y/\sqrt{\sum(x_i - \bar x)^2}$. For $N = ${N}$ points spaced $${h}$, $\sum(x_i - \bar x)^2 = h^2N(N^2 - 1)/12 = ${round(Sxx, 4)}$, so $\sigma_b = ${sy}/${round(Math.sqrt(Sxx), 4)} = ${+sb.toPrecision(3)}$.`,
          trap: 'The slope error depends on the spread of the $x$ values, not just on $N$.' };
      } },
  ],
};
