// Round 4 extras for waveguides: original questions, written 2026-11-22.
import { choose, round, C } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
const c = C.c;
const beta = (f, fc) => (2 * Math.PI / c) * Math.sqrt(f * f - fc * fc);

export default {
  items: [
    { id: 'wvg-r4-01', type: 'mcq', level: 1, exams: G, sub: 'cutoff',
      q: R`As a filter for signals, a hollow metal waveguide behaves as a`,
      options: [R`low-pass filter`, R`band-stop filter`, R`high-pass filter`, R`all-pass filter (every frequency gets through)`],
      answer: 2,
      sol: R`Every mode of a hollow guide has a cutoff frequency; below the lowest cutoff (that of the dominant mode) nothing propagates and fields die away exponentially. Above it signals pass. So the guide passes high frequencies and blocks low ones. (Higher modes join in at higher frequencies, which limits the useful single-mode band, but they do not block anything.)`,
      trap: R`A hollow pipe cannot carry a TEM wave, so unlike a coaxial cable it carries nothing at low frequency, not even dc.` },
    { id: 'wvg-r4-02', type: 'nat', level: 2, exams: G, sub: 'parallel-plate guide', unit: 'GHz',
      q: R`Two wide parallel metal plates $1.0$ cm apart have the space between them filled with a lossless dielectric of $\epsilon_r = 4.0$. The cutoff frequency of their TE$_1$ mode is ______ GHz (to two decimal places).`,
      answer: 7.49, tol: 0.03, calc: () => c / (2 * 0.01 * 2) / 1e9,
      sol: R`For plates a distance $d$ apart, mode $n$ needs $n$ half-wavelengths across the gap: $f_c = \dfrac{nv}{2d}$ with $v = c/\sqrt{\epsilon_r}$ in the filling. $f_c = \dfrac{3.00\times10^8}{2\times0.010\times\sqrt{4.0}} = 7.49$ GHz, half the air-filled value. The TEM mode still has no cutoff.`,
      trap: R`Forgetting that the filling slows the wave, or dividing by $\epsilon_r$ instead of $\sqrt{\epsilon_r}$.` },
    { id: 'wvg-r4-03', type: 'mcq', level: 2, exams: G, sub: 'transmission lines',
      q: R`A lossless transmission line of characteristic impedance $Z_0$ is terminated in a resistor equal to $Z_0$. Its input impedance is`,
      options: [R`$Z_0$, whatever the length of the line`, R`zero when the line is a quarter wavelength long`, R`infinite when the line is half a wavelength long`, R`$Z_0$ only when the length is a whole number of half wavelengths`],
      answer: 0,
      sol: R`A matched load absorbs the incident wave completely, so the reflection coefficient is $\Gamma = \dfrac{Z_L - Z_0}{Z_L + Z_0} = 0$. With no reflected wave, $V/I = Z_0$ at every point on the line, so the input impedance is $Z_0$ at any length. The standing-wave ratio is 1.`,
      trap: R`The "half-wavelength repeats the load" rule is true, but with a matched load every length repeats it.` },
    { id: 'wvg-r4-04', type: 'nat', level: 3, exams: G, sub: 'optical fibres', unit: 'degrees',
      q: R`A step-index fibre has numerical aperture $0.20$ (as measured in air). Its end is dipped in water ($n = 1.33$). The largest angle from the fibre axis at which light in the water can enter and still be guided is ______ degrees (to two decimal places).`,
      answer: 8.65, tol: 0.05, calc: () => Math.asin(0.2 / 1.33) * 180 / Math.PI,
      sol: R`The acceptance condition is $n_0\sin\theta_{\max} = \sqrt{n_1^2 - n_2^2} = \text{NA}$, where $n_0$ is the outside medium (Snell's law at the end face carries $n_0\sin\theta$ into the core). In air $\sin\theta = 0.20$ ($11.5^\circ$); in water $\sin\theta_{\max} = 0.20/1.33 = 0.150$, so $\theta_{\max} = 8.65^\circ$. The cone narrows, but the same rays (inside the core) are accepted.`,
      trap: R`Treating NA as a fixed angle: it fixes $n_0\sin\theta$, so the angle depends on the outside medium.` },
    { id: 'wvg-r4-05', type: 'msq', level: 3, exams: G, sub: 'evanescent modes', format: 'statements',
      q: R`A mode of a lossless hollow guide is driven below its cutoff frequency. Which statements are correct?`,
      options: [R`Its fields decay along the guide without any change of phase with distance.`, R`In a long guide it carries no time-averaged power along the guide.`, R`Its decay constant grows as the frequency is raised towards cutoff.`, R`Its decay constant is zero at zero frequency.`],
      answer: [0, 1],
      sol: R`Below cutoff $\beta^2 = k^2 - k_c^2 < 0$, so $\gamma = \alpha = \sqrt{k_c^2 - k^2}$ is real: pure decay $e^{-\alpha z}$, no phase change. The transverse $\vec E$ and $\vec H$ are then $90^\circ$ out of phase (reactive wave impedance), so the time-averaged Poynting flux is zero: the energy is stored, not carried. $\alpha$ is largest, $k_c = m\pi/a$, at $f = 0$ and falls to zero at cutoff.`,
      trap: R`Expecting the attenuation to be strongest just below cutoff: it is weakest there, which is why below-cutoff attenuators are designed well below cutoff.` },
    { id: 'wvg-r4-06', type: 'mcq', level: 3, exams: G, sub: 'circular guides',
      q: R`In a circular copper waveguide, which mode has wall losses that keep falling as the frequency is raised far above its cutoff (making it attractive for long, low-loss runs)?`,
      options: [R`TE$_{11}$`, R`TM$_{01}$`, R`TM$_{11}$`, R`TE$_{01}$`],
      answer: 3,
      sol: R`The TE$_{01}$ mode has circular electric field lines and only a longitudinal magnetic field at the wall. Its wall current runs round the circumference, and its size falls as $f_c/f$ as frequency rises, faster than the surface resistance grows ($\propto\sqrt f$), so the attenuation keeps dropping. The other modes have an axial or transverse wall current that does not fall off, so their loss reaches a minimum and then rises.`,
      trap: R`Choosing the dominant TE$_{11}$ mode: it is the easiest to use but not the lowest-loss at high frequency.` },
    { id: 'wvg-r4-07', type: 'nat', level: 3, exams: G, sub: 'group velocity',
      q: R`A rectangular guide with broad side $a = 2.0$ cm is completely filled with polyethylene ($\epsilon_r = 2.25$). For the TE$_{10}$ mode at $6.0$ GHz, the group velocity as a fraction of $c$ is ______ (to three decimal places).`,
      answer: 0.369, tol: 0.003, calc: () => { const fc = c / (0.04 * 1.5); return Math.sqrt(1 - (fc / 6e9) ** 2) / 1.5; },
      sol: R`In the filling the plane-wave speed is $v = c/1.5$. The cutoff is $f_c = \dfrac{v}{2a} = \dfrac{3.00\times10^8}{1.5\times0.040} = 5.00$ GHz. The group velocity is $v_g = v\sqrt{1 - (f_c/f)^2} = \dfrac c{1.5}\sqrt{1 - (5.00/6.0)^2} = \dfrac c{1.5}\times0.553 = 0.369c$.`,
      trap: R`Using the air-filled cutoff ($7.5$ GHz, so no propagation at all) or $c$ in place of $c/\sqrt{\epsilon_r}$.` },
    { id: 'wvg-r4-08', type: 'mcq', level: 4, exams: G, sub: 'guide wavelength',
      q: R`For any propagating mode of a uniformly filled hollow guide, with $\lambda$ the wavelength in the unbounded filling, $\lambda_g$ the guide wavelength and $\lambda_c$ the cutoff wavelength, which relation holds?`,
      options: [R`$\lambda^2 = \lambda_g^2 + \lambda_c^2$`, R`$\dfrac1{\lambda^2} = \dfrac1{\lambda_g^2} + \dfrac1{\lambda_c^2}$`, R`$\lambda_g = \dfrac{\lambda\lambda_c}{\lambda_c - \lambda}$`, R`$\dfrac1{\lambda_g} = \dfrac1\lambda + \dfrac1{\lambda_c}$`],
      answer: 1,
      sol: R`The wave equation in the guide gives $k^2 = \beta^2 + k_c^2$. With $k = 2\pi/\lambda$, $\beta = 2\pi/\lambda_g$ and $k_c = 2\pi/\lambda_c$, dividing by $4\pi^2$ gives $\dfrac1{\lambda^2} = \dfrac1{\lambda_g^2} + \dfrac1{\lambda_c^2}$. So $\lambda_g > \lambda$ always, and $\lambda_g\to\infty$ at cutoff.`,
      trap: R`Adding wavelengths instead of wave numbers; the squares of wave numbers add like the sides of a right triangle.` },
    { id: 'wvg-r4-09', type: 'msq', level: 4, exams: G, sub: 'optical fibres', format: 'statements',
      q: R`For a step-index fibre with core radius $a$, core index $n_1$ and cladding index $n_2$, the normalised frequency is $V = \dfrac{2\pi a}{\lambda}\sqrt{n_1^2 - n_2^2}$. Which statements are correct?`,
      options: [R`At fixed $a$ and indices, a shorter wavelength allows more modes.`, R`The numerical aperture depends on $n_1$ and $n_2$ but not on $a$.`, R`$V$ does not depend on the wavelength.`, R`It is single-mode when $V < 2.405$.`],
      answer: [0, 1, 3],
      sol: R`The second-lowest mode (LP$_{11}$) is cut off when $V$ falls below the first zero of $J_0$, $2.405$, leaving only LP$_{01}$. $V\propto1/\lambda$, so shorter wavelengths raise $V$ and admit more modes (roughly $V^2/2$ for large $V$). $\text{NA} = \sqrt{n_1^2 - n_2^2}$ is set by the indices alone.`,
      trap: R`A fibre is single-mode only above its cut-off wavelength; the same fibre is multimode for blue light.` },
    { id: 'wvg-r4-10', type: 'nat', level: 5, exams: G, sub: 'mode interference', unit: 'cm',
      q: R`An air-filled rectangular guide of $2.5$ cm by $1.0$ cm carries both the TE$_{10}$ and TE$_{20}$ modes at $14$ GHz. The pattern they make together repeats along the guide with the beat length $2\pi/(\beta_{10} - \beta_{20})$, which is ______ cm (to two decimal places).`,
      answer: 5.52, tol: 0.03, calc: () => 2 * Math.PI / (beta(14e9, c / 0.05) - beta(14e9, c / 0.025)) * 100,
      sol: R`$\beta = \dfrac{2\pi}{c}\sqrt{f^2 - f_c^2}$. Cutoffs: TE$_{10}$: $c/2a = 6.00$ GHz; TE$_{20}$: $c/a = 12.0$ GHz (TE$_{01}$ at 15.0 GHz does not propagate). $\beta_{10} = \dfrac{2\pi}{c}\sqrt{14^2 - 6^2}\times10^9 = 265.1$ rad/m; $\beta_{20} = \dfrac{2\pi}{c}\sqrt{14^2 - 12^2}\times10^9 = 151.1$ rad/m. Beat length $= \dfrac{2\pi}{114.0} = 0.0552$ m $= 5.52$ cm. Mode filters and couplers are designed with lengths set by such beats.`,
      trap: R`Subtracting guide wavelengths ($\lambda_{g20} - \lambda_{g10}$) instead of wave numbers.` },
  ],
  gens: [
    { id: 'wvg-r4g1', type: 'nat', level: 4, exams: G, sub: 'modal dispersion',
      make(r) {
        const a = choose(r, [2, 2.286, 2.5, 3, 4]), k = choose(r, [1.1, 1.2, 1.25, 1.3, 1.4]), L = choose(r, [1, 2, 5, 10]);
        const f1 = c / (2 * a / 100), f2 = 2 * f1, f = k * f2;
        const dt = L / c * (1 / Math.sqrt(1 - (f2 / f) ** 2) - 1 / Math.sqrt(1 - (f1 / f) ** 2)) * 1e9;
        return { q: R`A short pulse at $${round(f / 1e9, 3)}$ GHz is launched into $${L}$ m of air-filled rectangular guide with broad side $${a}$ cm, exciting both TE$_{10}$ and TE$_{20}$ (no other mode propagates). The TE$_{20}$ part arrives later by ______ ns (to two decimal places).`,
          answer: round(dt, 2), tol: Math.max(0.01, round(dt * 0.01, 2)), unit: 'ns', a, k, L,
          sol: R`Cutoffs: TE$_{10}$ $${round(f1 / 1e9, 3)}$ GHz, TE$_{20}$ $${round(f2 / 1e9, 3)}$ GHz. Group velocities $v_g = c\sqrt{1 - (f_c/f)^2}$: $${round(Math.sqrt(1 - (f1 / f) ** 2), 4)}c$ and $${round(Math.sqrt(1 - (f2 / f) ** 2), 4)}c$. $\Delta t = \dfrac Lc\left(\dfrac1{${round(Math.sqrt(1 - (f2 / f) ** 2), 4)}} - \dfrac1{${round(Math.sqrt(1 - (f1 / f) ** 2), 4)}}\right) = ${round(dt, 2)}$ ns.`,
          trap: 'Energy travels at the group velocity, which is lower for the mode closer to its cutoff.' };
      },
      verify: (p) => { const f1 = c / (2 * p.a / 100), f2 = 2 * f1, f = p.k * f2; return p.L / c * (1 / Math.sqrt(1 - (f2 / f) ** 2) - 1 / Math.sqrt(1 - (f1 / f) ** 2)) * 1e9; } },
    { id: 'wvg-r4g2', type: 'nat', level: 5, exams: G, sub: 'mode interference',
      make(r) {
        const a = choose(r, [2, 2.286, 2.5, 3, 4]), k = choose(r, [1.05, 1.1, 1.2, 1.3, 1.4]);
        const f1 = c / (2 * a / 100), f2 = 2 * f1, f = k * f2;
        const Lb = 2 * Math.PI / (beta(f, f1) - beta(f, f2)) * 100;
        return { q: R`An air-filled rectangular guide with broad side $${a}$ cm carries TE$_{10}$ and TE$_{20}$ together at $${round(f / 1e9, 3)}$ GHz (the narrow side is small enough that no other mode propagates). The beat length $2\pi/(\beta_{10} - \beta_{20})$ is ______ cm (to two decimal places).`,
          answer: round(Lb, 2), tol: Math.max(0.01, round(Lb * 0.005, 2)), unit: 'cm', a, k,
          sol: R`$f_{c10} = ${round(f1 / 1e9, 3)}$ GHz, $f_{c20} = ${round(f2 / 1e9, 3)}$ GHz. $\beta = \dfrac{2\pi}{c}\sqrt{f^2 - f_c^2}$: $\beta_{10} = ${round(beta(f, f1), 1)}$ rad/m, $\beta_{20} = ${round(beta(f, f2), 1)}$ rad/m. Beat length $= 2\pi/${round(beta(f, f1) - beta(f, f2), 2)} = ${round(Lb, 2)}$ cm.`,
          trap: 'Beat lengths come from the difference of wave numbers, not of wavelengths.' };
      },
      verify: (p) => { const f1 = c / (2 * p.a / 100), f2 = 2 * f1, f = p.k * f2; return 2 * Math.PI / (beta(f, f1) - beta(f, f2)) * 100; } },
    { id: 'wvg-r4g3', type: 'nat', level: 3, exams: G, sub: 'optical fibres',
      make(r) {
        const n1 = choose(r, [1.46, 1.48, 1.5, 1.52]), dn = choose(r, [0.005, 0.01, 0.015, 0.02, 0.03]), n2 = round(n1 - dn, 3);
        const [mname, n0] = choose(r, [['air', 1], ['water', 1.33], ['an index-matching oil of index 1.40', 1.4]]);
        const NA = Math.sqrt(n1 * n1 - n2 * n2), th = Math.asin(NA / n0) * 180 / Math.PI;
        return { q: R`A step-index fibre has core index $${n1}$ and cladding index $${n2}$. Its end face is in ${mname}. The largest angle from the axis at which incoming light is still guided is ______ degrees (to two decimal places).`,
          answer: round(th, 2), tol: Math.max(0.02, round(th * 0.005, 2)), unit: 'degrees', n1, n2, n0,
          sol: R`$\text{NA} = \sqrt{n_1^2 - n_2^2} = \sqrt{${n1}^2 - ${n2}^2} = ${round(NA, 4)}$. Then $n_0\sin\theta_{\max} = \text{NA}$ with $n_0 = ${n0}$: $\theta_{\max} = \arcsin(${round(NA / n0, 4)}) = ${round(th, 2)}^\circ$.`,
          trap: 'The acceptance angle depends on the medium outside the fibre.' };
      },
      verify: (p) => Math.asin(Math.sqrt(p.n1 * p.n1 - p.n2 * p.n2) / p.n0) * 180 / Math.PI },
  ],
};
