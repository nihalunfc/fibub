// Round 4 extras for blackbody-radiation: original questions, written 2026-11-22.
import { choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const A_RAD = 7.566e-16, SIGMA = 5.67e-8, C2 = 14388; // J m^-3 K^-4, W m^-2 K^-4, um K
const sig3 = (x) => +x.toPrecision(3);
// fraction of blackbody power at wavelengths below lambda, with x = hc / (lambda k T)
const below = (x) => { let s = 0; for (let n = 1; n < 200; n++) s += Math.exp(-n * x) * (x ** 3 / n + 3 * x * x / n ** 2 + 6 * x / n ** 3 + 6 / n ** 4); return 15 / Math.PI ** 4 * s; };

export default {
  items: [
    { id: 'bbr-r4-01', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'Wien law',
      q: R`Per unit frequency, Planck's spectrum peaks at $h\nu_{\max} = 2.821\,kT$, i.e. $\nu_{\max} = 5.879\times10^{10}$ Hz/K $\times\,T$. For a body at $300$ K, $\nu_{\max}$ is ______ THz (one decimal place).`,
      answer: 17.6, tol: 0.2, unit: 'THz', calc: () => 5.879e10 * 300 / 1e12,
      sol: R`$\nu_{\max} = 5.879\times10^{10}\times300 = 1.76\times10^{13}$ Hz $= 17.6$ THz, a wavelength $c/\nu = 17$ μm. Per unit wavelength the peak is at $b/T = 9.7$ μm instead: the two peaks are not related by $c = \lambda\nu$, because $d\nu$ and $d\lambda$ intervals differ.`,
      trap: R`Converting the per-wavelength peak (9.7 μm) to frequency gives 31 THz, which is not the per-frequency peak.` },
    { id: 'bbr-r4-02', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'Planck spectrum',
      q: R`What fraction of a blackbody's total radiated power lies at wavelengths shorter than its (per-wavelength) peak $\lambda_{\max}$?`,
      options: [R`about 25%`, R`about 50%`, R`about 10%`, R`about 75%`], answer: 0,
      sol: R`The spectrum is lopsided: it falls steeply (exponentially) on the short-wavelength side and slowly (as $\lambda^{-4}$) on the long side. Integrating Planck's law from $0$ to $\lambda_{\max}$ (with $x = hc/\lambda kT$ from $4.965$ to $\infty$) gives $0.250$ of the total, for every temperature. So three quarters of the power is at wavelengths longer than the peak.`,
      trap: R`Assuming the peak splits the power in half, as for a symmetric curve.` },
    { id: 'bbr-r4-03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'photon gas',
      q: R`A cavity of volume $1.0$ L holds blackbody radiation at $1000$ K. Its entropy is $S = y\times10^{-9}$ J/K; find $y$ (two decimal places). Use $a = 7.566\times10^{-16}$ J m$^{-3}$ K$^{-4}$.`,
      answer: 1.01, tol: 0.01, calc: () => 4 / 3 * A_RAD * 1e9 * 1e-3 / 1e-9,
      sol: R`For a photon gas $U = aT^4V$ and $P = U/3V$, so $F = -\tfrac13aT^4V$ and $S = -\partial F/\partial T = \tfrac43aT^3V$. Numbers: $\tfrac43\times7.566\times10^{-16}\times10^9\times10^{-3} = 1.01\times10^{-9}$ J/K. Equivalently $S = (U + PV)/T$ since the chemical potential is zero.`,
      trap: R`Using $S = U/T$ (missing the $PV$ term) gives $0.76\times10^{-9}$ J/K.` },
    { id: 'bbr-r4-04', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'photon gas',
      q: R`The heat capacity at constant volume of blackbody radiation in a cavity is proportional to`,
      options: [R`$T^4$`, R`$T$`, R`$T^3$`, R`a constant, independent of $T$`], answer: 2,
      sol: R`$U = aT^4V$, so $C_V = \partial U/\partial T = 4aT^3V$. The $T^3$ law is the same as for phonons in a solid at low temperature (Debye), for the same reason: massless linear-dispersion modes in three dimensions.`,
      trap: R`Confusing $U \propto T^4$ with its derivative.` },
    { id: 'bbr-r4-05', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'planets',
      q: R`A planet with no atmosphere would have a radiative equilibrium temperature of $255$ K. Add a thin atmospheric layer that is transparent to sunlight but absorbs all of the planet's infrared and radiates as a blackbody from both faces. In equilibrium the surface temperature is ______ K (nearest whole number).`,
      answer: 303, tol: 1, unit: 'K', calc: () => 2 ** 0.25 * 255,
      sol: R`Top of the atmosphere: the layer must send out what the planet absorbs, $\sigma T_a^4 = \sigma T_e^4$, so $T_a = 255$ K. Layer balance: it absorbs $\sigma T_s^4$ from the ground and emits $2\sigma T_a^4$ (up and down), so $T_s^4 = 2T_a^4$. Then $T_s = 2^{1/4}\times255 = 303$ K. A perfectly absorbing single layer overshoots Earth's real 288 K, because the real atmosphere lets some infrared escape.`,
      trap: R`Adding the back-radiation to the sunlight and forgetting that the layer radiates both ways.` },
    { id: 'bbr-r4-06', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'photon gas',
      q: R`Blackbody radiation at $5800$ K has photon number density $n = 2.03\times10^7\,T^3$ m$^{-3}$. The number of photons leaving each square metre of a black surface at this temperature per second is about`,
      options: [R`$1.19\times10^{27}$`, R`$3.96\times10^{18}$`, R`$5.94\times10^{26}$`, R`$2.97\times10^{26}$`], answer: 3,
      sol: R`$n = 2.03\times10^7\times5800^3 = 3.96\times10^{18}$ m$^{-3}$. For isotropic particles moving at $c$, the flux through a surface (one side) is $nc/4$, the same geometric factor as in $\sigma T^4 = uc/4$. So $3.96\times10^{18}\times3.0\times10^8/4 = 2.97\times10^{26}$ m$^{-2}$ s$^{-1}$. Dividing $\sigma T^4 = 6.4\times10^7$ W/m$^2$ by this gives a mean emitted photon energy near $1.3$ eV.`,
      trap: R`Using $nc$ ignores that photons move in all directions; $nc/2$ counts only the hemisphere but forgets the $\cos\theta$ factor.` },
    { id: 'bbr-r4-07', type: 'msq', level: 4, exams: ['jam', 'gate', 'net'], sub: 'Planck spectrum', format: 'statements',
      q: R`About Planck's spectrum $u_\nu(T)$, which statements are correct?`,
      options: [R`At low frequencies $u_\nu \propto \nu^2T$`, R`The peak frequency is proportional to $T$`, R`The mean energy of a photon is about $2.7\,kT$`, R`At some frequency a cooler blackbody gives more radiation than a hotter one`], answer: [0, 1, 2],
      sol: R`For $h\nu \ll kT$, $\dfrac{h\nu}{e^{h\nu/kT} - 1} \approx kT$, giving the Rayleigh-Jeans form $\dfrac{8\pi\nu^2}{c^3}kT$. The peak sits at $h\nu = 2.82kT$. $U/N = \dfrac{\pi^4}{30\zeta(3)}kT = 2.70kT$. Finally $u_\nu$ increases with $T$ at every fixed $\nu$ (the occupation $1/(e^{h\nu/kT} - 1)$ grows with $T$), so Planck curves for different temperatures never cross.`,
      trap: R`Curves drawn with shifted peaks look as if they might cross; they are nested.` },
    { id: 'bbr-r4-08', type: 'mcq', level: 5, exams: ['net', 'gate'], sub: 'cavity radiation',
      q: R`A cavity is completely filled with a transparent, non-dispersive medium of refractive index $n$ and held at temperature $T$. Compared with an empty cavity, the equilibrium radiation energy density is multiplied by`,
      options: [R`$n$`, R`$n^3$`, R`$n^2$`, R`1 (it is unchanged)`], answer: 1,
      sol: R`Light in the medium moves at $c/n$, so a mode of frequency $\nu$ has wavenumber $2\pi n\nu/c$. The number of modes per volume per $d\nu$ is $\dfrac{8\pi n^3\nu^2}{c^3}$, each with the same Planck mean energy. So $u = n^3aT^4$. (The flux crossing a surface inside the medium is $u(c/n)/4 = n^2\sigma T^4$.)`,
      trap: R`Assuming each mode's energy changes; it is the mode count that changes, through the wavelength.` },
  ],
  gens: [
    { id: 'bbr-r4g1', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'Wien law',
      make(r) {
        const T = choose(r, [3, 300, 1000, 3000, 5800, 10000, 30000]), ans = 5.879e10 * T / 1e12;
        return { q: R`Per unit frequency, Planck's spectrum peaks at $\nu_{\max} = 5.879\times10^{10}$ Hz/K $\times\,T$. For a blackbody at $${T}$ K, $\nu_{\max}$ is ______ THz (three significant figures).`,
          answer: sig3(ans), tol: sig3(ans * 0.01), T,
          sol: R`$\nu_{\max} = 5.879\times10^{10}\times${T}$ Hz $= ${sig3(ans)}$ THz (from $h\nu_{\max} = 2.821kT$). The per-wavelength peak, $\lambda = 2898/T$ μm, corresponds to a different frequency.`,
          trap: R`Converting Wien's per-wavelength peak with $\nu = c/\lambda$ gives a frequency 1.76 times too high.` };
      },
      verify: (p) => 5.879e10 * p.T / 1e12 },
    { id: 'bbr-r4g2', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'planets',
      make(r) {
        const Te = choose(r, [200, 230, 255, 280]), N = choose(r, [1, 2, 3]), ans = (N + 1) ** 0.25 * Te;
        return { q: R`A planet's bare radiative equilibrium temperature is $${Te}$ K. It gets ${N} thin stacked atmospheric layer${N > 1 ? 's' : ''}, each transparent to sunlight but fully absorbing in the infrared, radiating as a blackbody from both faces. The equilibrium surface temperature is ______ K (one decimal place).`,
          answer: round(ans, 1), tol: Math.max(0.5, round(ans * 0.003, 1)), Te, N,
          sol: R`The top layer radiates at $T_e$. Working down, each layer's balance adds one more $\sigma T_e^4$, so the $k$-th layer from the top has $T^4 = kT_e^4$ and the ground $T_s^4 = (N + 1)T_e^4$. $T_s = ${N + 1}^{1/4}\times${Te} = ${round(ans, 1)}$ K.`,
          trap: R`Assuming each layer adds a fixed number of kelvins; it is $T^4$ that goes up in equal steps.` };
      },
      verify: (p) => (p.N + 1) ** 0.25 * p.Te },
    { id: 'bbr-r4g3', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'photon gas',
      make(r) {
        const T = choose(r, [300, 1000, 3000, 10000]), [V, Vt] = choose(r, [[1e-3, '1.0 L'], [1, '1.0 m$^3$'], [10, '10 m$^3$']]);
        const [what, f, unit] = choose(r, [['entropy', (t) => 4 / 3 * A_RAD * t ** 3 * V, 'J/K'], ['heat capacity at constant volume', (t) => 4 * A_RAD * t ** 3 * V, 'J/K'], ['energy', (t) => A_RAD * t ** 4 * V, 'J']]);
        const val = f(T), e = Math.floor(Math.log10(val)), y = val / 10 ** e;
        return { q: R`A cavity of ${Vt} holds blackbody radiation at $${T}$ K. Its ${what} is $y\times10^{${e}}$ ${unit}; find $y$ (three significant figures). Use $a = 7.566\times10^{-16}$ J m$^{-3}$ K$^{-4}$.`,
          answer: sig3(y), tol: sig3(Math.max(y * 0.01, 0.01)), T, V, what, e,
          sol: R`Photon gas: $U = aT^4V$, $C_V = 4aT^3V$, $S = \tfrac43aT^3V$. The ${what} is $${sig3(y)}\times10^{${e}}$ ${unit}.`,
          trap: R`Mixing up $S = \tfrac43aT^3V$ with $C_V = 4aT^3V$ (a factor 3).` };
      },
      verify: (p) => { const f = { entropy: 4 / 3 * A_RAD * p.T ** 3 * p.V, 'heat capacity at constant volume': 4 * A_RAD * p.T ** 3 * p.V, energy: A_RAD * p.T ** 4 * p.V }[p.what]; return f / 10 ** p.e; } },
    { id: 'bbr-r4g4', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Planck spectrum',
      make(r) {
        const lt = choose(r, [1500, 2000, 2898, 3000, 4000, 5000, 8000, 10000]), T = choose(r, [1000, 2000, 5800]);
        const lam = round(lt / T, 3), x = C2 / (lam * T), ans = below(x);
        return { q: R`A blackbody is at $${T}$ K. The fraction of its total power emitted at wavelengths shorter than $${lam}$ μm is ______ (three significant figures). Use $hc/k = 14388$ μm K and $F = \dfrac{15}{\pi^4}\sum_{n\ge1}e^{-nx}\left(\dfrac{x^3}{n} + \dfrac{3x^2}{n^2} + \dfrac{6x}{n^3} + \dfrac{6}{n^4}\right)$ with $x = hc/\lambda kT$.`,
          answer: sig3(ans), tol: sig3(Math.max(ans * 0.01, 0.001)), x,
          sol: R`$\lambda T = ${round(lam * T, 0)}$ μm K, so $x = 14388/${round(lam * T, 0)} = ${round(x, 3)}$. Short wavelengths are high frequencies, $x' > x$, and the sum (it converges fast; a few terms are enough) gives $F = ${sig3(ans)}$. The answer depends only on $\lambda T$: at $\lambda T = 2898$ μm K it is $0.250$.`,
          trap: R`The integral from $0$ to $\lambda$ in wavelength runs from $x$ to $\infty$ in $x$; using $0$ to $x$ gives one minus the answer.` };
      },
      verify: (p) => below(p.x) },
    { id: 'bbr-r4g5', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'net exchange',
      make(r) {
        const T1 = choose(r, [400, 500, 600, 800, 1000]), T2 = choose(r, [300, 77, 4]), N = choose(r, [1, 2, 3, 4]), ask = choose(r, ['flux', 'Ts']);
        const flux = SIGMA * (T1 ** 4 - T2 ** 4) / (N + 1), Ts = ((T1 ** 4 + T2 ** 4) / 2) ** 0.25;
        const ans = ask === 'flux' ? flux : Ts;
        return { q: R`Two large parallel black plates are at $${T1}$ K and $${T2}$ K in vacuum. ${ask === 'flux' ? `${N} thin black radiation shield${N > 1 ? 's are' : ' is'} placed between them. In steady state the net heat flux between the plates is ______ W/m$^2$` : 'One thin black radiation shield is placed between them. In steady state its temperature is ______ K'} (three significant figures). Use $\sigma = 5.67\times10^{-8}$ W m$^{-2}$ K$^{-4}$.`,
          answer: sig3(ans), tol: sig3(ans * 0.01), T1, T2, N, ask,
          sol: ask === 'flux' ? R`In steady state the same flux $q$ crosses each of the $${N + 1}$ gaps, $q = \sigma(T_i^4 - T_{i+1}^4)$; adding the gaps gives $(N + 1)q = \sigma(T_1^4 - T_2^4)$. So $q = \dfrac{5.67\times10^{-8}(${T1}^4 - ${T2}^4)}{${N + 1}} = ${sig3(flux)}$ W/m$^2$.` : R`The shield receives $\sigma T_1^4 + \sigma T_2^4$ and emits $2\sigma T_s^4$, so $T_s = \left(\dfrac{T_1^4 + T_2^4}{2}\right)^{1/4} = ${sig3(Ts)}$ K, much closer to the hot plate than the average temperature.`,
          trap: R`Averaging temperatures instead of fourth powers.` };
      },
      verify: (p) => (p.ask === 'flux' ? SIGMA * (p.T1 ** 4 - p.T2 ** 4) / (p.N + 1) : ((p.T1 ** 4 + p.T2 ** 4) / 2) ** 0.25) },
    { id: 'bbr-r4g6', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'scaling',
      make(r) {
        const [qty, p] = choose(r, [['the wavelength of peak emission (per unit wavelength)', -1], ['the frequency of peak emission (per unit frequency)', 1], ['the radiation energy density', 4], ['the photon number density', 3], ['the mean photon energy', 1], ['the entropy per unit volume', 3], ['the radiation pressure', 4], ['the heat capacity per unit volume', 3]]);
        const k = choose(r, [2, 3, 4]);
        const show = (q) => (q < 0 ? `$\\tfrac{1}{${k ** -q}}$` : `$${k ** q}$`);
        const o = mcqOptions(r, p, [-1, 1, 2, 3, 4, -4].filter((q) => q !== p), show);
        return { q: R`The temperature of blackbody radiation is multiplied by ${k}. By what factor does ${qty} change?`, ...o,
          sol: R`Scalings: $\lambda_{\max} \propto T^{-1}$, $\nu_{\max} \propto T$, mean photon energy $\propto T$, $n \propto T^3$, entropy and heat capacity per volume $\propto T^3$, $u$ and $P = u/3 \propto T^4$. Here the power is $${p}$, so the factor is ${show(p)}.`,
          trap: R`Applying the $T^4$ law to every quantity.` };
      } },
  ],
};
