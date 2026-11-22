// Round 4 extras for errors-data-fitting: original questions, written 2026-11-22.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
const A = ['jam', 'gate', 'net'];

export default {
  items: [
    { id: 'edf-r4-01', type: 'mcq', level: 1, exams: A, sub: 'significant figures',
      q: R`How many significant figures does the reading $0.004050$ m have?`,
      options: [R`$3$`, R`$4$`, R`$6$`, R`$7$`], answer: 1,
      sol: R`Leading zeros only place the decimal point, so they are not significant. The digits 4, 0, 5 and the final 0 are: the zero between 4 and 5 is enclosed, and a trailing zero after the decimal point records that the reading was made to that place. So 4 significant figures ($4.050\times10^{-3}$ m).`,
      trap: R`Dropping the final zero treats a measured digit as decoration.` },
    { id: 'edf-r4-02', type: 'mcq', level: 2, exams: G, sub: 'binomial errors',
      q: R`A detector registers $80$ of $100$ particles sent through it. Its efficiency, with its standard uncertainty, is`,
      options: [R`$0.80\pm0.04$`, R`$0.80\pm0.09$`, R`$0.80\pm0.08$`, R`$0.80\pm0.004$`], answer: 0,
      sol: R`The number detected out of a fixed $n$ is binomial, with variance $np(1 - p)$. So $\sigma_p = \sqrt{p(1 - p)/n} = \sqrt{0.8\times0.2/100} = 0.04$. Using Poisson errors ($\sqrt{80}/100 = 0.09$) overstates it, and would wrongly give a non-zero error even at $p = 1$.`,
      trap: R`$\sqrt N$ errors belong to counts with no fixed total; an efficiency is a fraction of a fixed number of trials.` },
    { id: 'edf-r4-03', type: 'nat', level: 2, exams: A, sub: 'error propagation',
      q: R`A resistance is found from $V = 12.0\pm0.1$ V and $I = 2.00\pm0.02$ A (independent errors) as $R = V/I$. The standard uncertainty of $R$ is ______ $\Omega$ (to three decimal places).`,
      answer: 0.078, tol: 0.001, calc: () => 6 * Math.hypot(0.1 / 12, 0.02 / 2),
      sol: R`$R = 6.00\ \Omega$. For a quotient the relative errors add in quadrature: $\sqrt{(0.1/12.0)^2 + (0.02/2.00)^2} = \sqrt{6.94\times10^{-5} + 1.00\times10^{-4}} = 0.0130$. So $\sigma_R = 0.0130\times6.00 = 0.078\ \Omega$.`,
      trap: R`Adding the relative errors linearly ($1.83\%$) gives $0.11\ \Omega$, the worst case, not the standard uncertainty.` },
    { id: 'edf-r4-04', type: 'nat', level: 3, exams: A, sub: 'counting',
      q: R`A source gives about $50$ counts per second, with negligible background. To measure its rate to a relative standard uncertainty of $1\%$, it must be counted for ______ s.`,
      answer: 200, tol: 1, calc: () => 1 / 0.01 ** 2 / 50,
      sol: R`For $N$ Poisson counts the relative uncertainty is $1/\sqrt N$. $1/\sqrt N = 0.01$ needs $N = 10^4$ counts, which at $50$ s$^{-1}$ takes $200$ s. Halving the uncertainty would take four times as long.`,
      trap: R`Taking $N = 100$ (as if the relative error were $1/N$) gives only 2 s.` },
    { id: 'edf-r4-05', type: 'mcq', level: 2, exams: A, sub: 'error propagation',
      q: R`A quantity is measured as $x = 200\pm10$. The value of $\ln x$ with its standard uncertainty is`,
      options: [R`$5.30\pm2.30$`, R`$5.30\pm10$`, R`$5.30\pm0.69$`, R`$5.30\pm0.05$`], answer: 3,
      sol: R`$\ln200 = 5.30$ and $d(\ln x)/dx = 1/x$, so $\sigma_{\ln x} = \sigma_x/x = 10/200 = 0.05$. The absolute error of a logarithm equals the relative error of its argument, which is why log plots show equal relative errors as equal bars.`,
      trap: R`Taking the logarithm of the error ($\ln10 = 2.30$) is not error propagation.` },
    { id: 'edf-r4-06', type: 'mcq', level: 4, exams: G, sub: 'maximum likelihood',
      q: R`The decay times of $100$ unstable particles are recorded, and their mean is $2.20\ \mu$s. Assuming an exponential distribution $p(t) = e^{-t/\tau}/\tau$, the maximum-likelihood lifetime and its standard uncertainty are`,
      options: [R`$2.20\pm0.022\ \mu$s`, R`$2.20\pm1.52\ \mu$s`, R`$2.20\pm0.22\ \mu$s`, R`$1.52\pm0.22\ \mu$s`], answer: 2,
      sol: R`$\ln L = -N\ln\tau - \sum t_i/\tau$; $d\ln L/d\tau = -N/\tau + \sum t_i/\tau^2 = 0$ gives $\hat\tau = \bar t = 2.20\ \mu$s. An exponential distribution has standard deviation $\tau$, so the mean of $N$ times has uncertainty $\tau/\sqrt N = 2.20/10 = 0.22\ \mu$s (the same as from $-d^2\ln L/d\tau^2 = N/\tau^2$).`,
      trap: R`$1.52 = 2.20\ln2$ is the median decay time, not the lifetime.` },
    { id: 'edf-r4-07', type: 'msq', level: 3, exams: G, sub: 'least squares', format: 'statements',
      q: R`For straight-line fits $y = a + bx$, which statements are correct?`,
      options: [R`If both $x$ and $y$ have errors, a common approach weights each point by $1/\sigma_{eff}^2$ with $\sigma_{eff}^2 = \sigma_y^2 + b^2\sigma_x^2$.`, R`Errors in $x$ can be ignored when $b\sigma_x\ll\sigma_y$ for every point.`, R`An unweighted fit of $x$ against $y$ always gives exactly the reciprocal of the slope found by fitting $y$ against $x$.`, R`The unweighted least-squares line passes through the point $(\bar x, \bar y)$.`], answer: [0, 1, 3],
      sol: R`An error $\sigma_x$ in $x$ moves the point vertically by $b\sigma_x$ relative to the line, so it adds in quadrature to $\sigma_y$ (effective variance); if it is small compared with $\sigma_y$ it can be dropped. Minimising vertical residuals is not the same as minimising horizontal ones: the two slopes are $b_{y|x} = r\,s_y/s_x$ and $1/b_{x|y} = s_y/(r\,s_x)$, which agree only when $|r| = 1$. The normal equation for $a$ gives $\bar y = a + b\bar x$.`,
      trap: R`Swapping the axes changes which residuals are minimised, and so the fitted line.` },
    { id: 'edf-r4-08', type: 'msq', level: 4, exams: G, sub: 'correlated errors', format: 'statements',
      q: R`Two measured quantities $x$ and $y$ have positively correlated errors (covariance $\sigma_{xy} > 0$). Which statements are correct?`,
      options: [R`$\sigma^2_{x - y} = \sigma_x^2 + \sigma_y^2 - 2\sigma_{xy}$.`, R`The relative uncertainty of the ratio $x/y$ is smaller than it would be with uncorrelated errors of the same size.`, R`The uncertainty of $x + y$ is larger than it would be with uncorrelated errors of the same size.`, R`For uncorrelated errors, adding them in quadrature always gives a larger total than adding them linearly.`], answer: [0, 1, 2],
      sol: R`In general $\sigma_f^2 = (\partial_xf)^2\sigma_x^2 + (\partial_yf)^2\sigma_y^2 + 2\partial_xf\,\partial_yf\,\sigma_{xy}$. For $x - y$ the cross term is $-2\sigma_{xy}$; for $x + y$ it is $+2\sigma_{xy}$. For $x/y$, $(\sigma_f/f)^2 = (\sigma_x/x)^2 + (\sigma_y/y)^2 - 2\sigma_{xy}/(xy)$: smaller. This is why ratios to a reference measured the same way cancel common errors. Quadrature always gives the smaller total: $\sqrt{a^2 + b^2}\le a + b$.`,
      trap: R`Positive correlation helps in differences and ratios but hurts in sums and products.` },
    { id: 'edf-r4-09', type: 'mcq', level: 4, exams: G, sub: 'least squares',
      q: R`You can take 10 readings of $y$ (each with the same error) at any $x$ in a fixed range, and want the smallest possible uncertainty on the slope of a straight line that you are sure is correct. You should`,
      options: [R`spread the points evenly over the range`, R`put half the points at each end of the range`, R`cluster all the points near the middle`, R`put all the points at the top end of the range`], answer: 1,
      sol: R`For equal errors $\sigma_b^2 = \sigma^2/\sum(x_i - \bar x)^2$, so the slope is best fixed by making the spread of $x$ as large as possible: half at each end. All at one end gives zero spread and no slope at all. In practice some middle points are kept anyway, because the end-only design cannot reveal curvature.`,
      trap: R`Even spacing is good for checking linearity, but it is not the best design for the slope alone.` },
    { id: 'edf-r4-10', type: 'nat', level: 4, exams: A, sub: 'error propagation',
      q: R`$g$ is found from a free fall of height $h = 1.000\pm0.001$ m taking $t = 0.4515\pm0.0010$ s, with $g = 2h/t^2$ (independent errors). The standard uncertainty of $g$ is ______ m s$^{-2}$ (to three decimal places).`,
      answer: 0.045, tol: 0.001, calc: () => (2 / 0.4515 ** 2) * Math.hypot(0.001, 2 * 0.001 / 0.4515),
      sol: R`$g = 2\times1.000/0.4515^2 = 9.811$ m s$^{-2}$. Relative errors: $h$ gives $0.001$; $t^{-2}$ gives $2\times0.0010/0.4515 = 0.00443$. In quadrature: $\sqrt{0.001^2 + 0.00443^2} = 0.00454$, so $\sigma_g = 0.00454\times9.811 = 0.045$ m s$^{-2}$. The timing dominates.`,
      trap: R`Forgetting the factor 2 from the square of $t$ gives $0.024$.` },
    { id: 'edf-r4-11', type: 'mcq', level: 5, exams: G, sub: 'counting',
      q: R`A search for a rare decay records zero events in a run with negligible background. Treating the count as Poisson, the 95% confidence upper limit on the expected number of events is about`,
      options: [R`$0$`, R`$1.0$`, R`$4.6$`, R`$3.0$`], answer: 3,
      sol: R`The upper limit $\mu_{up}$ is the mean for which seeing zero events would happen only 5% of the time: $P(0\mid\mu) = e^{-\mu} = 0.05$, so $\mu_{up} = \ln20 = 3.0$. Zero observed events does not mean a zero rate. ($4.6 = \ln100$ is the 99% limit.)`,
      trap: R`Quoting $0\pm\sqrt0$ treats the $\sqrt N$ rule as valid for $N = 0$, where it fails.` },
    { id: 'edf-r4-12', type: 'nat', level: 5, exams: G, sub: 'counting',
      q: R`A narrow beam gives $N_0 = 10\,000$ counts with no absorber and $N = 2500$ counts (same time) through an absorber of thickness $2.00$ cm (thickness exact, background negligible). The attenuation coefficient $\mu = \ln(N_0/N)/x$ has a standard uncertainty of ______ cm$^{-1}$ (to four decimal places).`,
      answer: 0.0112, tol: 0.0002, calc: () => Math.sqrt(1 / 10000 + 1 / 2500) / 2,
      sol: R`$\mu = \ln4/2.00 = 0.693$ cm$^{-1}$. For a Poisson count, $\sigma_{\ln N} = \sigma_N/N = 1/\sqrt N$. The two counts are independent, so $\sigma_\mu = \dfrac1x\sqrt{\dfrac1{N_0} + \dfrac1N} = 0.5\sqrt{10^{-4} + 4\times10^{-4}} = 0.5\times0.0224 = 0.0112$ cm$^{-1}$.`,
      trap: R`Using only the absorber count's error, or adding $\sqrt{N_0}$ and $\sqrt N$ before taking ratios.` },
  ],
  gens: [
    { id: 'edf-r4g1', type: 'nat', level: 2, exams: G, sub: 'binomial errors',
      make(r) {
        const n = choose(r, [50, 100, 200, 250, 400, 500, 1000]), k = int(r, Math.ceil(n * 0.1), Math.floor(n * 0.98));
        const p = k / n, s = Math.sqrt(p * (1 - p) / n);
        return { q: `In a test, $${k}$ of $${n}$ trials succeed. The standard uncertainty of the success fraction is ______ (to four decimal places).`,
          answer: round(s, 4), tol: 0.0001, k, n,
          sol: `$p = ${k}/${n} = ${round(p, 4)}$. Successes out of a fixed number of trials are binomial: $\\sigma_p = \\sqrt{p(1 - p)/n} = \\sqrt{${round(p, 4)}\\times${round(1 - p, 4)}/${n}} = ${round(s, 4)}$.`,
          trap: 'Using $\\sqrt k/n$ (Poisson) overstates the error, badly so when $p$ is close to 1.' };
      },
      verify: (p) => { const q = p.k / p.n; return Math.sqrt(q * (1 - q) / p.n); } },
    { id: 'edf-r4g2', type: 'nat', level: 3, exams: G, sub: 'counting',
      make(r) {
        const B = pick(r, 2, 20, 1), S = B + pick(r, 5, 80, 1), pct = choose(r, [1, 2, 3, 5]);
        const t = (S + B) / ((pct / 100) ** 2 * (S - B) ** 2);
        return { q: `A source plus background gives about $${S}$ counts/s and the background alone about $${B}$ counts/s. Both are counted for the same time $t$. For the net source rate to have a relative standard uncertainty of $${pct}\\%$, $t$ must be ______ s (to one decimal place).`,
          answer: round(t, 1), tol: Math.max(0.1, round(t * 0.002, 1)), S, B, pct,
          sol: `Net rate $= S - B = ${S - B}$ s$^{-1}$, and its variance is $(S + B)/t$ (each count is Poisson). Require $\\sqrt{(S + B)/t} = ${pct / 100}\\times${S - B}$: $t = \\dfrac{S + B}{(${pct / 100}\\times${S - B})^2} = \\dfrac{${S + B}}{${round((pct / 100 * (S - B)) ** 2, 6)}} = ${round(t, 1)}$ s.`,
          trap: 'Forgetting that subtracting the background adds its variance, rather than removing it.' };
      },
      verify: (p) => (p.S + p.B) / ((p.pct / 100) ** 2 * (p.S - p.B) ** 2) },
    { id: 'edf-r4g3', type: 'mcq', level: 4, exams: G, sub: 'counting',
      make(r) {
        const [cl, name] = choose(r, [[0.683, '68.3%'], [0.9, '90%'], [0.95, '95%'], [0.99, '99%']]), zero = r() < 0.6;
        const mu = -Math.log(1 - cl);
        const o = mcqOptions(r, round(mu, 2), [round(-Math.log10(1 - cl), 2), round(mu / 2, 2), round(Math.sqrt(mu), 2) === round(mu, 2) ? 0.5 : round(Math.sqrt(mu), 2), round(1 / (1 - cl), 2)], (v) => `$${v.toFixed(2)}$`);
        return { q: `An experiment ${zero ? 'observes zero events' : 'sees no candidate events at all'} in a counting run with negligible background. The ${name} confidence upper limit on the Poisson mean number of events is`, ...o,
          sol: `Require $P(0\\mid\\mu) = e^{-\\mu} = 1 - ${cl}$, so $\\mu_{up} = -\\ln(${round(1 - cl, 3)}) = ${round(mu, 2)}$.`,
          trap: 'Using $\\log_{10}$ instead of $\\ln$, or treating zero counts as having zero uncertainty.' };
      } },
  ],
};
