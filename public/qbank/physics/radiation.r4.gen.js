// Round 4 extras for radiation: original questions, written 2026-11-22.
import { choose, round } from '../_util.js';
const R = String.raw;
const A = ['jam', 'gate', 'net'];
const G = ['gate', 'net'];
const ETA = 376.73;
const F = (t) => 2 / 3 - Math.cos(t) + Math.cos(t) ** 3 / 3; // integral of sin^3 from 0 to t

export default {
  items: [
    { id: 'rdn-r4-01', type: 'mcq', level: 1, exams: A, sub: 'dipole radiation',
      q: R`An electric dipole oscillates along the $z$ axis. Far away on the $x$ axis, the electric field of its radiation points along`,
      options: [R`$\pm x$, towards and away from the dipole`, R`$\pm y$`, R`$\pm z$`, R`nowhere: there is no radiation in that direction`],
      answer: 2,
      sol: R`The radiation field is $\vec E\propto\dfrac{\sin\theta}{r}\hat\theta$: it lies in the plane containing the dipole and the line of sight, at right angles to the line of sight. On the $x$ axis ($\theta = 90^\circ$), $\hat\theta = -\hat z$, so $\vec E$ is parallel to the dipole and the radiation is strongest there. The magnetic field points along $\pm y$.`,
      trap: R`Radiation fields are transverse, so a field along the line of sight ($\pm x$) is impossible far away; $\pm y$ is the direction of $\vec B$.` },
    { id: 'rdn-r4-02', type: 'nat', level: 3, exams: A, sub: 'dipole radiation', unit: '%',
      q: R`An oscillating electric dipole points along $z$. The percentage of its radiated power that goes out between $\theta = 60^\circ$ and $\theta = 120^\circ$ (a band $30^\circ$ either side of the equatorial plane) is ______ (to two decimal places).`,
      answer: 68.75, tol: 0.1, calc: () => 100 * (F(2 * Math.PI / 3) - F(Math.PI / 3)) / (4 / 3),
      sol: R`$dP/d\Omega\propto\sin^2\theta$, so the power in a band is $\propto\displaystyle\int\sin^2\theta\cdot2\pi\sin\theta\,d\theta$. With $\int\sin^3\theta\,d\theta = -\cos\theta + \tfrac13\cos^3\theta$: from $60^\circ$ to $120^\circ$ this gives $2\left(\tfrac12 - \tfrac1{24}\right) = \tfrac{11}{12}$, out of $\tfrac43$ for the whole sphere. Fraction $= \dfrac{11/12}{4/3} = \dfrac{11}{16} = 68.75\%$, though the band covers only half of the solid angle.`,
      trap: R`Taking the fraction of solid angle (50%) and forgetting that the $\sin^2\theta$ pattern favours the equator.` },
    { id: 'rdn-r4-03', type: 'mcq', level: 2, exams: A, sub: 'antennas',
      q: R`A medium-wave broadcast antenna is often much shorter than a quarter wavelength, and it is fed through a large "loading" coil. The main reason for the coil is that a very short antenna`,
      options: [R`has a tiny radiation resistance and a large capacitive reactance, which the coil's inductive reactance cancels`, R`has a radiation resistance far above $73\ \Omega$, which the coil lowers`, R`radiates at twice the drive frequency unless a coil is added`, R`radiates mostly straight up, and the coil tilts the beam towards the ground`],
      answer: 0,
      sol: R`A short dipole-like antenna has radiation resistance $\propto(l/\lambda)^2$, a fraction of an ohm, and looks like a small capacitor. Without help the transmitter would see a large reactance and push little real power into the tiny radiation resistance. A series coil resonates with that capacitance so the feed sees a mainly resistive load; the antenna still has low efficiency if its ohmic losses are comparable to its radiation resistance.`,
      trap: R`A coil does not change where the antenna radiates or at what frequency; it only matches the feed.` },
    { id: 'rdn-r4-04', type: 'nat', level: 3, exams: A, sub: 'antennas', unit: '%',
      q: R`A short antenna of length $\lambda/50$ carries (thanks to top loading) a nearly uniform current, so its radiation resistance is $R_{\rm rad} = 80\pi^2(l/\lambda)^2$. Its wires and ground system add a loss resistance of $1.0\ \Omega$ in series. Its radiation efficiency is ______ % (to one decimal place).`,
      answer: 24.0, tol: 0.2, calc: () => { const Rr = 80 * Math.PI ** 2 / 2500; return 100 * Rr / (Rr + 1); },
      sol: R`$R_{\rm rad} = 80\pi^2/50^2 = 789.6/2500 = 0.316\ \Omega$. The same current flows through both resistances, so the fraction of power radiated is $\dfrac{R_{\rm rad}}{R_{\rm rad} + R_{\rm loss}} = \dfrac{0.316}{1.316} = 24.0\%$. Most of the transmitter power heats the ground system, which is why short antennas need very good earths.`,
      trap: R`Using $R_{\rm rad}/R_{\rm loss}$ (32%) instead of the share of the total.` },
    { id: 'rdn-r4-05', type: 'msq', level: 3, exams: A, sub: 'larmor formula', format: 'statements',
      q: R`A charge $q$ moving slowly ($v\ll c$) has acceleration $\vec a$. Which statements about the radiation it emits are correct?`,
      options: [R`A charge $-q$ with the same acceleration radiates the same total power.`, R`At a given acceleration, the power depends on whether the velocity is parallel or perpendicular to $\vec a$.`, R`No radiation goes out along the direction of $\vec a$.`, R`The total power is proportional to $q^2a^2$.`],
      answer: [0, 2, 3],
      sol: R`Larmor: $P = \dfrac{q^2a^2}{6\pi\epsilon_0c^3}$, quadratic in both $q$ and $a$, so the sign of $q$ does not matter, and for $v\ll c$ the velocity does not appear at all (its effects are of order $v/c$). The pattern is $dP/d\Omega\propto\sin^2\Theta$, with $\Theta$ measured from $\vec a$, so it is zero along $\pm\vec a$.`,
      trap: R`The direction of $\vec v$ relative to $\vec a$ matters only at relativistic speeds (the $\gamma^6$ versus $\gamma^4$ results).` },
    { id: 'rdn-r4-06', type: 'mcq', level: 3, exams: G, sub: 'polarisation',
      q: R`A dipole of fixed size rotates steadily in the $xy$ plane, $\vec p = p_0(\cos\omega t\,\hat x + \sin\omega t\,\hat y)$. The radiation it sends out is`,
      options: [R`linearly polarised along the $z$ axis and circularly polarised in the $xy$ plane`, R`circularly polarised in every direction`, R`linearly polarised in every direction`, R`circularly polarised along the $z$ axis and linearly polarised in the $xy$ plane`],
      answer: 3,
      sol: R`The radiation field is the part of $\ddot{\vec p}$ perpendicular to the line of sight. Looking down the $z$ axis, both $\hat x$ and $\hat y$ parts are seen, a quarter period apart with equal size: circular polarisation. Looking along a direction in the $xy$ plane, say $\hat x$, only the $\hat y$ part is transverse: linear polarisation along $y$. In between the light is elliptical.`,
      trap: R`Assuming the polarisation is the same in every direction just because the source rotates.` },
    { id: 'rdn-r4-07', type: 'nat', level: 4, exams: G, sub: 'antennas', unit: 'mV/m',
      q: R`A half-wave dipole (directivity $1.64$) radiates $100$ W. Ignoring the ground, the rms electric field $10$ km away, broadside to the antenna, is ______ mV/m (to two decimal places). Take the impedance of free space as $377\ \Omega$.`,
      answer: 7.01, tol: 0.05, calc: () => Math.sqrt(1.64 * 100 / (4 * Math.PI * 1e8) * ETA) * 1e3,
      sol: R`Broadside the intensity is $D$ times the average: $I = \dfrac{DP}{4\pi r^2} = \dfrac{1.64\times100}{4\pi(10^4)^2} = 1.31\times10^{-7}$ W/m$^2$. With $I = E_{\rm rms}^2/377$: $E_{\rm rms} = \sqrt{377\times1.31\times10^{-7}} = 7.01\times10^{-3}$ V/m. (Short cut: $E_{\rm rms} = \sqrt{30DP}/r$.)`,
      trap: R`Using $I = E^2/(2\times377)$, which is the formula for the peak amplitude, gives $9.92$ mV/m: that is the peak, $\sqrt2$ times the rms value.` },
    { id: 'rdn-r4-08', type: 'mcq', level: 4, exams: A, sub: 'radiation zone',
      q: R`Which statement about the radiation-zone field ($r\gg\lambda$) of an oscillating electric dipole is <b>NOT</b> true?`,
      options: [R`The electric field falls as $1/r$.`, R`It has a radial component that also falls as $1/r$.`, R`The electric field is perpendicular to the direction from the source.`, R`$\vec E$ and $\vec B$ oscillate in phase with $|\vec E| = c|\vec B|$.`],
      answer: 1,
      sol: R`The radial electric field of a dipole falls as $1/r^2$ and $1/r^3$; only the transverse $\hat\theta$ part has a $1/r$ term. That is what makes radiation transverse: far away, $\vec E$, $\vec B$ and $\hat r$ form a right-handed set, in phase, with $E = cB$, so the energy flux $\propto 1/r^2$ and the power through a large sphere is constant.`,
      trap: R`Remembering that the near field has a strong radial part and assuming it survives far away.` },
    { id: 'rdn-r4-09', type: 'msq', level: 4, exams: A, sub: 'scattering', format: 'statements',
      q: R`Unpolarised sunlight is scattered by air molecules (much smaller than the wavelength). Which statements are correct?`,
      options: [R`Light scattered at $90^\circ$ to the beam is almost completely linearly polarised.`, R`The scattered intensity varies as $1 + \cos^2\theta$ ($\theta$ from the beam), so as much goes backward as forward.`, R`The scattering cross-section grows as $\omega^2$.`, R`The same frequency law holds for water droplets much larger than the wavelength.`],
      answer: [0, 1],
      sol: R`Each molecule is a small induced dipole driven by the incoming field. Unpolarised light is two perpendicular polarisations; at $90^\circ$ one of them drives the dipole along the line of sight, which sends nothing that way, so only one polarisation remains. Adding the two $\sin^2$ patterns gives $1 + \cos^2\theta$, symmetric front to back. Dipole radiation scales as $\omega^4$ (Rayleigh), not $\omega^2$. Droplets much larger than $\lambda$ scatter almost independently of colour (Mie regime), which is why clouds are white.`,
      trap: R`Mixing up the $\omega^4$ of the scattering cross-section with the $\omega^2$ of the acceleration.` },
    { id: 'rdn-r4-10', type: 'nat', level: 5, exams: G, sub: 'radiation reaction', unit: R`$\times10^{-5}$ nm`,
      q: R`A classical electron bound by a spring and losing energy only by radiation has energy decay rate $\gamma = \omega_0^2\tau$ with $\tau = \dfrac{2r_e}{3c}$ ($r_e = 2.818\times10^{-15}$ m). The full width of its emission line, expressed as a wavelength, is ______ $\times10^{-5}$ nm (to two decimal places).`,
      answer: 1.18, tol: 0.01, calc: () => 4 * Math.PI * 2.8179403262e-15 / 3 * 1e14,
      sol: R`The energy decays as $e^{-\gamma t}$, so the line is a Lorentzian of full width $\Delta\omega = \gamma = \omega_0^2\tau$. In wavelength, $\Delta\lambda = \dfrac{\lambda^2}{2\pi c}\Delta\omega = \dfrac{\lambda^2}{2\pi c}\cdot\dfrac{4\pi^2c^2}{\lambda^2}\tau = 2\pi c\tau = \dfrac{4\pi}{3}r_e = 1.18\times10^{-14}$ m $= 1.18\times10^{-5}$ nm. The wavelength cancels: every classical line has the same width in nm, whatever its colour.`,
      trap: R`Expecting the width to depend on the line's wavelength; in frequency it does ($\propto\omega_0^2$), in wavelength it does not.` },
  ],
  gens: [
    { id: 'rdn-r4g1', type: 'nat', level: 3, exams: A, sub: 'dipole radiation',
      make(r) {
        const band = r() < 0.5, d = choose(r, [10, 15, 20, 30, 40, 45, 60]);
        const t = d * Math.PI / 180;
        const frac = band ? 100 * (2 * (F(Math.PI / 2) - F(Math.PI / 2 - t))) / (4 / 3) : 100 * (2 * F(t)) / (4 / 3);
        return { q: band
            ? R`An electric dipole oscillates along $z$. The percentage of its radiated power that goes out within $${d}^\circ$ of the equatorial plane (from $\theta = ${90 - d}^\circ$ to $${90 + d}^\circ$) is ______ (to two decimal places).`
            : R`An electric dipole oscillates along $z$. The percentage of its radiated power that goes out within $${d}^\circ$ of its axis (both cones, $\theta < ${d}^\circ$ and $\theta > ${180 - d}^\circ$) is ______ (to two decimal places).`,
          answer: round(frac, 2), tol: Math.max(0.02, round(frac * 0.005, 2)), unit: '%', band, d,
          sol: R`Power per solid angle $\propto\sin^2\theta$, so power per $d\theta$ $\propto\sin^3\theta$, whose integral is $G(\theta) = \tfrac23 - \cos\theta + \tfrac13\cos^3\theta$ from $0$; the whole sphere gives $\tfrac43$. ${band ? R`The band gives $2[G(90^\circ) - G(${90 - d}^\circ)] = ${round(2 * (F(Math.PI / 2) - F(Math.PI / 2 - t)), 4)}$` : R`The two cones give $2G(${d}^\circ) = ${round(2 * F(t), 4)}$`}, so the share is $${round(frac / 100, 4)}$, i.e. $${round(frac, 2)}\%$.`,
          trap: 'The dipole pattern is weighted towards the equator, so solid-angle fractions are not power fractions.' };
      },
      verify: (p) => { const t = p.d * Math.PI / 180; return p.band ? 100 * (2 * (F(Math.PI / 2) - F(Math.PI / 2 - t))) / (4 / 3) : 100 * (2 * F(t)) / (4 / 3); } },
    { id: 'rdn-r4g2', type: 'nat', level: 3, exams: A, sub: 'antennas',
      make(r) {
        const k = choose(r, [10, 15, 20, 25, 30, 40, 50, 100]), Rl = choose(r, [0.2, 0.5, 1, 1.5, 2, 3, 5]);
        const Rr = 80 * Math.PI ** 2 / (k * k), eff = 100 * Rr / (Rr + Rl);
        return { q: R`A short antenna of length $\lambda/${k}$ carries a nearly uniform current, so $R_{\rm rad} = 80\pi^2(l/\lambda)^2$. Its ohmic loss resistance is $${Rl}\ \Omega$. Its radiation efficiency is ______ % (to one decimal place).`,
          answer: round(eff, 1), tol: Math.max(0.1, round(eff * 0.005, 1)), unit: '%', k, Rl,
          sol: R`$R_{\rm rad} = 80\pi^2/${k}^2 = ${round(Rr, 4)}\ \Omega$. Efficiency $= \dfrac{R_{\rm rad}}{R_{\rm rad} + R_{\rm loss}} = \dfrac{${round(Rr, 4)}}{${round(Rr + Rl, 4)}} = ${round(eff, 1)}\%$.`,
          trap: 'The current is shared, so the powers split in the ratio of the resistances.' };
      },
      verify: (p) => { const Rr = 80 * Math.PI ** 2 / (p.k * p.k); return 100 * Rr / (Rr + p.Rl); } },
    { id: 'rdn-r4g3', type: 'nat', level: 3, exams: G, sub: 'antennas',
      make(r) {
        const P = choose(r, [10, 50, 100, 250, 500, 1000]), rk = choose(r, [1, 2, 5, 10, 20, 50]);
        const E = Math.sqrt(1.64 * P / (4 * Math.PI * (rk * 1e3) ** 2) * ETA) * 1e3;
        return { q: R`A half-wave dipole (directivity $1.64$) radiates $${P}$ W in free space. The rms electric field $${rk}$ km away, broadside, is ______ mV/m (to two decimal places). Take $377\ \Omega$ for free space.`,
          answer: round(E, 2), tol: Math.max(0.01, round(E * 0.01, 2)), unit: 'mV/m', P, rk,
          sol: R`$I = \dfrac{1.64P}{4\pi r^2} = \dfrac{1.64\times${P}}{4\pi(${rk * 1e3})^2}$ W/m$^2$ and $E_{\rm rms} = \sqrt{377I} = \dfrac{\sqrt{30\times1.64\times${P}}}{${rk * 1e3}} = ${round(E, 2)}$ mV/m.`,
          trap: 'Rms fields use I = E²/377; peak fields use I = E²/(2·377).' };
      },
      verify: (p) => Math.sqrt(1.64 * p.P / (4 * Math.PI * (p.rk * 1e3) ** 2) * ETA) * 1e3 },
  ],
};
