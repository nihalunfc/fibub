// Round 5 extras for blackbody-radiation: original questions, written 2026-11-22.
import { int, choose, round } from '../_util.js';
const R = String.raw;
const NPH = 2.029e7; // photon number density per T^3, m^-3 K^-3
const C0 = 2.99792458e8, KB = 1.380649e-23;
const flux = (T) => NPH * C0 / 4 * T ** 3; // photons per m^2 per s leaving a black surface

export default {
  items: [
    { id: 'bbr-r5-01', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'photon gas',
      q: R`Blackbody radiation at temperature $T$ holds $n = 2.03\times10^7\,T^3$ photons per m$^3$ ($T$ in K). The number of photons leaving each square metre of a black surface at $1000$ K per second is $k\times10^{24}$, with $k =$ ______ (two decimal places).`,
      answer: 1.52, tol: 0.02, calc: () => flux(1000) / 1e24,
      sol: R`For isotropic radiation moving at speed $c$, the flux through a surface from one side is $\tfrac14nc$, just as the energy flux is $\tfrac14uc = \sigma T^4$. So $\Phi = \tfrac14\times2.03\times10^7\times10^9\times3.00\times10^8 = 1.52\times10^{24}$ m$^{-2}$ s$^{-1}$, so $k = 1.52$.`,
      trap: R`Using $nc$ (all photons crossing in one direction at normal incidence) gives four times too many.` },
    { id: 'bbr-r5-02', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'radiative exchange',
      q: R`Two large parallel black plates at $T_1 > T_2$ exchange heat by radiation in vacuum. A thin black sheet is slid between them, parallel to both. In the steady state the net heat flux from plate 1 to plate 2`,
      options: [R`is unchanged, since the sheet re-emits everything it absorbs`, R`is halved`, R`drops to zero`, R`falls to a quarter`], answer: 1,
      sol: R`In steady state the sheet at $T_s$ gets the same net flux from plate 1 as it passes to plate 2: $\sigma(T_1^4 - T_s^4) = \sigma(T_s^4 - T_2^4)$, so $T_s^4 = \tfrac12(T_1^4 + T_2^4)$. The flux is then $\sigma(T_1^4 - T_s^4) = \tfrac12\sigma(T_1^4 - T_2^4)$, half the original. With $N$ such sheets it falls to $1/(N + 1)$: the idea behind multilayer insulation on spacecraft.`,
      trap: R`Thinking a perfect absorber-emitter is "transparent" to heat flow; it re-emits half of what it absorbs back towards the hot plate.` },
    { id: 'bbr-r5-03', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'thermodynamics of radiation',
      q: R`Blackbody radiation of energy $U = aVT^4$ fills a cavity of volume $V$. Which statements are correct?`,
      options: [R`Its Helmholtz free energy is $F = -U/3$`, R`Its Gibbs free energy $G = U - TS + PV$ is zero`, R`Its entropy is $S = 4U/3T$`, R`Its heat capacity at constant pressure is finite and equal to $4U/T$`], answer: [0, 1, 2],
      sol: R`From $dS = dU/T + P\,dV/T$ with $P = U/3V = aT^4/3$: $S = \tfrac43aVT^3 = 4U/3T$. Then $F = U - TS = U - \tfrac43U = -U/3$, and $G = F + PV = -U/3 + U/3 = 0$, which matches a zero chemical potential. Pressure depends only on $T$, so at constant pressure the temperature cannot change: adding heat just makes more radiation at the same $T$, and $C_P$ is infinite (it has no finite value).`,
      trap: R`Assuming every thermal system has a finite $C_P$; for the photon gas $P$ and $T$ are not independent.` },
    { id: 'bbr-r5-04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'one-dimensional radiation',
      q: R`A resistor at $300$ K, matched to a transmission line, delivers thermal noise power $kT\Delta f$ (the one-dimensional, low-frequency limit of Planck's law). In a bandwidth of $1.0$ MHz this power is ______ fW (two decimal places). Use $k = 1.381\times10^{-23}$ J/K.`,
      answer: 4.14, tol: 0.03, unit: 'fW', calc: () => KB * 300 * 1e6 * 1e15,
      sol: R`A line carries one mode per frequency interval in each direction, and in the classical limit $h\nu \ll kT$ each mode holds energy $kT$. The power flowing one way is $kT$ per unit bandwidth: $P = kT\Delta f = 1.381\times10^{-23}\times300\times10^6 = 4.14\times10^{-15}$ W $= 4.14$ fW. This is Johnson-Nyquist noise, a one-dimensional blackbody.`,
      trap: R`Using the 3D Stefan-Boltzmann law; a single-mode line is a one-dimensional radiator with power proportional to $T$, not $T^4$.` },
    { id: 'bbr-r5-05', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'cosmic background',
      q: R`The Sun moves at $\beta = v/c = 1.23\times10^{-3}$ through the cosmic microwave background ($T = 2.725$ K). Looking straight ahead, the background looks like a blackbody hotter by ______ mK (two decimal places).`,
      answer: 3.35, tol: 0.02, unit: 'mK', calc: () => 2.725 * (Math.sqrt((1 + 1.23e-3) / (1 - 1.23e-3)) - 1) * 1000,
      sol: R`A moving observer sees each photon blueshifted by the Doppler factor $D = \sqrt{\dfrac{1 + \beta}{1 - \beta}}$ in the forward direction. Planck's spectrum keeps its form with $T' = DT$, since $h\nu/kT$ is unchanged when both scale together. For small $\beta$, $T' - T \approx \beta T = 1.23\times10^{-3}\times2.725$ K $= 3.35$ mK. This is the dipole in the background seen by every CMB satellite.`,
      trap: R`Expecting the spectrum to lose its blackbody shape; in any single direction it stays Planckian, just at a shifted temperature.` },
    { id: 'bbr-r5-06', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'cosmic background',
      q: R`The background radiation, now at $2.725$ K, was released when the universe had a redshift of about $z = 1090$. Its temperature then was about`,
      options: [R`$2970$ K`, R`$2.725$ K, because a blackbody keeps its temperature`, R`$3.2\times10^6$ K`, R`$2.5$ mK`], answer: 0,
      sol: R`Expansion stretches every wavelength by $1 + z$, and the blackbody spectrum keeps its shape with $T \propto 1/a$. So $T_{\rm then} = (1 + z)T_{\rm now} = 1091\times2.725 \approx 2970$ K, the temperature at which hydrogen stopped being ionised and the universe became transparent.`,
      trap: R`Scaling with $(1 + z)^2$ or dividing instead of multiplying.` },
    { id: 'bbr-r5-07', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'Wien law',
      q: R`Treating stars as blackbodies, which one emits most strongly (per unit wavelength) in the ultraviolet, below $380$ nm? Use $b = 2.90\times10^{-3}$ m K.`,
      options: [R`A star at $3000$ K`, R`A star at $4500$ K`, R`A star at $5800$ K`, R`A star at $20\,000$ K`], answer: 3,
      sol: R`$\lambda_{\max} = b/T$: $3000$ K gives $967$ nm (infrared), $4500$ K gives $644$ nm (red), $5800$ K gives $500$ nm (green-blue), $20\,000$ K gives $145$ nm (ultraviolet). Only the hottest star peaks in the ultraviolet.`,
      trap: R`Mixing up the direction: hotter bodies peak at SHORTER wavelengths.` },
    { id: 'bbr-r5-08', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'radiative exchange',
      q: R`Two large parallel black plates at $T_1$ and $T_2$ face each other in vacuum. A thin grey sheet with emissivity $\varepsilon$ on both faces (and the same absorptivity) is placed between them. The net flux between the plates becomes`,
      options: [R`$\varepsilon\sigma(T_1^4 - T_2^4)$`, R`$\sigma(T_1^4 - T_2^4)/2$`, R`$\tfrac12\varepsilon\sigma(T_1^4 - T_2^4)$`, R`$\varepsilon^2\sigma(T_1^4 - T_2^4)$`], answer: 2,
      sol: R`For a black plate facing a grey sheet, the net flux is $\varepsilon\sigma(T_1^4 - T_s^4)$: the sheet absorbs a fraction $\varepsilon$ of the plate's emission and emits $\varepsilon\sigma T_s^4$, all of which the black plate absorbs. In steady state $\varepsilon\sigma(T_1^4 - T_s^4) = \varepsilon\sigma(T_s^4 - T_2^4)$, so $T_s^4 = \tfrac12(T_1^4 + T_2^4)$ and the flux is $\tfrac12\varepsilon\sigma(T_1^4 - T_2^4)$. A shiny sheet ($\varepsilon \ll 1$) is a far better shield than a black one.`,
      trap: R`Applying the factor $\varepsilon$ twice (once per face) gives $\varepsilon^2$; each gap carries one factor, and the gaps are in series.` },
    { id: 'bbr-r5-09', type: 'msq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Wien law',
      q: R`Which of these change the wavelength at which an observer sees a blackbody's spectrum peak?`,
      options: [R`Raising the body's temperature`, R`Doubling its surface area`, R`Coating it so its emissivity is $0.5$ at every wavelength (a grey body)`, R`The body moving rapidly away from the observer`], answer: [0, 3],
      sol: R`Wien's law $\lambda_{\max} = b/T$ depends only on temperature, so heating moves the peak. Area changes only the total power. A grey body emits $0.5$ times the black spectrum at every wavelength, so the shape and peak stay put. A receding source is redshifted: every wavelength stretches by the Doppler factor, and the observed peak moves to longer wavelength (the spectrum looks like a cooler blackbody).`,
      trap: R`Thinking a dimmer body peaks elsewhere; a constant emissivity scales the curve without moving its peak.` },
    { id: 'bbr-r5-10', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'cosmic background',
      q: R`The background radiation at $2.725$ K has photon density $n_\gamma = 2.03\times10^7\,T^3$ m$^{-3}$. The mean density of baryons (protons and neutrons) in the universe today is about $0.25$ m$^{-3}$. The number of photons per baryon is $k\times10^9$ with $k =$ ______ (two decimal places).`,
      answer: 1.64, tol: 0.02, calc: () => NPH * 2.725 ** 3 / 0.25 / 1e9,
      sol: R`$n_\gamma = 2.03\times10^7\times2.725^3 = 2.03\times10^7\times20.23 = 4.11\times10^8$ m$^{-3}$ (about 411 per cm$^3$). Dividing by $0.25$ m$^{-3}$ gives $1.64\times10^9$ photons per baryon. Both densities fall as $a^{-3}$ during expansion, so this ratio has stayed the same since the first minutes, which is why it is a key input to big-bang nucleosynthesis.`,
      trap: R`Mixing m$^{-3}$ and cm$^{-3}$; 411 per cm$^3$ is $4.11\times10^8$ per m$^3$.` },
  ],
  gens: [
    { id: 'bbr-r5g1', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'radiative exchange',
      make(r) {
        const T1 = choose(r, [400, 500, 600, 800, 1000, 1200]), T2 = choose(r, [77, 200, 250, 300]);
        const Ts = ((T1 ** 4 + T2 ** 4) / 2) ** 0.25;
        return { q: R`Two large parallel black plates at $${T1}$ K and $${T2}$ K face each other in vacuum. A thin sheet (same emissivity on both faces) is placed between them. In the steady state its temperature is ______ K.`,
          answer: round(Ts, 1), tol: round(Ts * 0.005, 1), T1, T2,
          sol: R`The sheet must pass on as much net flux as it receives. For any equal emissivity on its two faces this gives $T_1^4 - T_s^4 = T_s^4 - T_2^4$, so $T_s = \left(\dfrac{${T1}^4 + ${T2}^4}{2}\right)^{1/4} = ${round(Ts, 1)}$ K. It sits much nearer the hot plate than the average $${(T1 + T2) / 2}$ K because emission grows as $T^4$.`,
          trap: R`Averaging the temperatures instead of their fourth powers.` };
      },
      verify: (p) => ((p.T1 ** 4 + p.T2 ** 4) / 2) ** 0.25 },
    { id: 'bbr-r5g2', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'planetary temperatures',
      make(r) {
        const N = int(r, 1, 4), Te = choose(r, [210, 230, 255, 280]);
        const Ts = (N + 1) ** 0.25 * Te;
        return { q: R`A planet's radiative equilibrium temperature (no atmosphere) is $${Te}$ K. Model its atmosphere as ${N} thin layer${N > 1 ? 's' : ''}, each transparent to sunlight and black to infrared. The ground temperature is ______ K.`,
          answer: round(Ts, 1), tol: round(Ts * 0.005, 1), N, Te,
          sol: R`The top layer must emit the full $\sigma T_e^4$ to space. Working down, each layer emits equally up and down, and the flux balance gives the $j$-th layer from the top $\sigma T_j^4 = j\sigma T_e^4$, and the ground $\sigma T_s^4 = (N + 1)\sigma T_e^4$. So $T_s = (${N + 1})^{1/4}\times${Te} = ${round(Ts, 1)}$ K. Each extra layer acts like one more radiation shield.`,
          trap: R`Multiplying $T_e$ by $N + 1$; the fourth power of the temperature scales with the layer count, not the temperature itself.` };
      },
      verify: (p) => (p.N + 1) ** 0.25 * p.Te },
    { id: 'bbr-r5g3', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'photon gas',
      make(r) {
        const T = choose(r, [300, 500, 1500, 2500, 3000, 5800, 6000]);
        const k = flux(T) / 1e22;
        return { q: R`Blackbody radiation holds $n = 2.03\times10^7\,T^3$ photons per m$^3$. The number of photons leaving one square metre of a black surface at $${T}$ K each second is $k\times10^{22}$, with $k =$ ______.`,
          answer: round(k, k < 100 ? 2 : 0), tol: Math.max(round(k * 0.01, 2), 0.01), T,
          sol: R`The one-sided flux of isotropic particles moving at $c$ is $\tfrac14nc$. So $\Phi = \tfrac14\times2.03\times10^7\times${T}^3\times3.00\times10^8 = ${round(k, 2)}\times10^{22}$ m$^{-2}$ s$^{-1}$. The photon flux grows as $T^3$ while the energy flux grows as $T^4$, since the mean photon energy rises as $T$.`,
          trap: R`Forgetting the factor $\tfrac14$ from averaging over directions.` };
      },
      verify: (p) => flux(p.T) / 1e22 },
  ],
};
