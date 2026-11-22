// Round 4 extras for photons: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;
const J = ['jam'], JG = ['jam', 'gate'];

export default {
  items: [
    { id: 'pho-r4-01', type: 'mcq', level: 1, exams: J, sub: 'photon energy',
      q: R`A microwave oven works at $2.45$ GHz. With $h = 4.136\times10^{-15}$ eV s, the energy of one of its photons is about`,
      options: [R`$1.6\times10^{-24}$ eV`, R`$1.0\times10^{-2}$ eV`, R`$1.0\times10^{-5}$ eV`, R`$10$ eV`], answer: 2,
      sol: R`$E = h\nu = 4.136\times10^{-15}\times2.45\times10^{9} = 1.0\times10^{-5}$ eV. Breaking a chemical bond or ionising a molecule takes a few eV, about $10^5$ times more, so microwaves heat food by making molecules jiggle, not by breaking them apart.`,
      trap: R`$1.6\times10^{-24}$ is the energy in joules; writing it with eV mixes the units.` },
    { id: 'pho-r4-02', type: 'mcq', level: 2, exams: J, sub: 'stopping potential',
      q: R`A lamp gives light of two wavelengths, $400$ nm and $600$ nm, together. It falls on a metal of work function $2.0$ eV. With $hc = 1240$ eV nm, the stopping potential is`,
      options: [R`$0.07$ V`, R`$0.58$ V`, R`$1.1$ V`, R`$1.17$ V`], answer: 2,
      sol: R`Photon energies: $1240/400 = 3.10$ eV and $1240/600 = 2.07$ eV. Each photon acts alone, so the fastest electrons come from the $400$ nm photons: $K_{\max} = 3.10 - 2.0 = 1.10$ eV. The stopping potential must stop these, so $V_0 = 1.1$ V. The $600$ nm photons give slower electrons ($0.07$ eV), already stopped.`,
      trap: R`Averaging the two wavelengths or adding the two energies: photons do not pool their energy.` },
    { id: 'pho-r4-03', type: 'nat', level: 2, exams: J, sub: 'photon flux', unit: '×10⁶ /s',
      q: R`A $1.0$ W lamp sends out light of wavelength $550$ nm equally in all directions. An eye $1.0$ km away has a pupil of radius $2.0$ mm. With $h = 6.626\times10^{-34}$ J s and $c = 3.00\times10^8$ m/s, the number of photons entering the eye each second is ______ $\times10^6$ (to two decimal places).`,
      answer: 2.77, tol: 0.03, calc: () => (1 * 550e-9 / (6.626e-34 * 3e8)) * (2e-3) ** 2 / (4 * 1e3 ** 2) / 1e6,
      sol: R`Energy per photon $= hc/\lambda = 6.626\times10^{-34}\times3.00\times10^8/550\times10^{-9} = 3.61\times10^{-19}$ J, so the lamp emits $1.0/3.61\times10^{-19} = 2.77\times10^{18}$ photons/s. The pupil catches the fraction $\pi r^2/4\pi d^2 = r^2/4d^2 = (2\times10^{-3})^2/(4\times10^6) = 1.0\times10^{-12}$. Photons into the eye: $2.77\times10^{6}$ per second, plenty to see the lamp.`,
      trap: R`The light spreads over a sphere of area $4\pi d^2$, not a circle of area $\pi d^2$.` },
    { id: 'pho-r4-04', type: 'mcq', level: 3, exams: JG, sub: 'compton',
      q: R`An X-ray photon is Compton-scattered through $90^\circ$ by a free electron at rest and then through $90^\circ$ again by a second free electron. Another photon of the same starting wavelength is scattered once through $180^\circ$. Comparing the final wavelengths,`,
      options: [R`the two $90^\circ$ scatterings give the larger shift`, R`the single $180^\circ$ scattering gives the larger shift`, R`which one is larger depends on the starting wavelength`, R`both photons end with the same wavelength`], answer: 3,
      sol: R`The Compton shift $\Delta\lambda = \lambda_C(1 - \cos\theta)$ does not depend on the wavelength before scattering. Two $90^\circ$ scatterings give $\lambda_C + \lambda_C = 2\lambda_C$; one $180^\circ$ scattering gives $\lambda_C(1 + 1) = 2\lambda_C$. The final wavelengths are equal for any starting wavelength.`,
      trap: R`Shifts in wavelength simply add; it is the energies that change in a way that depends on the starting value.` },
    { id: 'pho-r4-05', type: 'nat', level: 3, exams: JG, sub: 'compton electron', unit: 'keV',
      q: R`X-rays of wavelength $20.0$ pm are scattered through $90^\circ$ by free electrons at rest. With $h/m_ec = 2.426$ pm and $hc = 1240$ keV pm, the kinetic energy of a recoil electron is ______ keV (to two decimal places).`,
      answer: 6.71, tol: 0.03, calc: () => 1240 * (1 / 20 - 1 / 22.426),
      sol: R`At $90^\circ$ the shift is $\lambda_C = 2.426$ pm, so $\lambda' = 22.426$ pm. Energy conservation gives the electron the difference: $K = hc\left(\dfrac1\lambda - \dfrac1{\lambda'}\right) = 1240\left(\dfrac1{20.0} - \dfrac1{22.426}\right) = 1240\times0.005409 = 6.71$ keV.`,
      trap: R`Using $hc/\Delta\lambda$ gives the energy of a photon of wavelength $2.426$ pm (511 keV), not the energy difference.` },
    { id: 'pho-r4-06', type: 'nat', level: 3, exams: JG, sub: 'radiation pressure', unit: 'μPa',
      q: R`Sunlight of intensity $1360$ W/m$^2$ falls on a flat, perfectly reflecting sail at $60^\circ$ to the sail's normal. With $c = 3.00\times10^8$ m/s, the radiation pressure on the sail (force per unit area of sail, along the normal) is ______ $\mu$Pa (to two decimal places).`,
      answer: 2.27, tol: 0.02, calc: () => 2 * 1360 * Math.cos(Math.PI / 3) ** 2 / 3e8 * 1e6,
      sol: R`Two factors of $\cos\theta$ appear. First, a sail area $A$ intercepts only the beam area $A\cos\theta$, so the photon momentum arriving per second is $IA\cos\theta/c$. Second, reflection reverses only the normal part of each photon's momentum, a change of $2p\cos\theta$. So $P = 2I\cos^2\theta/c = 2\times1360\times0.25/3.00\times10^8 = 2.27\times10^{-6}$ Pa.`,
      trap: R`Keeping only one factor of $\cos\theta$ gives $4.53\ \mu$Pa.` },
    { id: 'pho-r4-07', type: 'mcq', level: 4, exams: JG, sub: 'contact potential',
      q: R`In a photocell the emitter has work function $2.0$ eV and the collector, a different metal, has work function $4.5$ eV. Light of photon energy $5.0$ eV falls on the emitter. The retarding voltage that must be applied between the two terminals to stop the current just is`,
      options: [R`$3.0$ V`, R`$0.5$ V`, R`$2.5$ V`, R`$5.5$ V`], answer: 1,
      sol: R`The fastest electrons leave the emitter with $5.0 - 2.0 = 3.0$ eV. But when the two metals are wired together their Fermi levels line up, and the vacuum level just outside the collector is $4.5 - 2.0 = 2.5$ eV above that outside the emitter (the contact potential). An electron therefore already climbs $2.5$ eV with no applied voltage, and the applied voltage only has to supply the remaining $3.0 - 2.5 = 0.5$ eV. In general $eV_{\rm stop} = h\nu - \phi_{\rm collector}$: the measured stopping voltage depends on the collector's work function, not the emitter's.`,
      trap: R`$h\nu - \phi_{\rm emitter} = 3.0$ eV is the electrons' energy, but the contact potential between unlike metals does part of the stopping.` },
    { id: 'pho-r4-08', type: 'msq', level: 2, exams: J, sub: 'stopping potential', format: 'statements',
      q: R`Light above the threshold frequency falls on a photocell. Which of these changes leave the stopping potential unchanged?`,
      options: [R`Doubling the intensity of the light, at the same frequency.`, R`Moving the lamp farther from the cell.`, R`Rotating the plane of polarisation of the light.`, R`Changing to light of shorter wavelength.`], answer: [0, 1, 2],
      sol: R`The stopping potential measures the largest kinetic energy of one electron, $eV_0 = h\nu - \phi$, which depends only on the photon energy and the metals. Intensity, distance and polarisation change how many photons arrive (and so the current), not the energy of each photon. Shorter wavelength means larger $h\nu$, so $V_0$ rises.`,
      trap: R`A brighter or closer lamp gives a larger photocurrent, not faster electrons.` },
    { id: 'pho-r4-09', type: 'mcq', level: 5, exams: JG, sub: 'photon momentum',
      q: R`Light of frequency $\nu$ falls normally on a mirror that is moving straight away from the source at a small speed $v$. Treating the reflection as photons bouncing elastically off a heavy mirror, the frequency of the reflected light is, to first order in $v/c$,`,
      options: [R`$\nu(1 - 2v/c)$`, R`$\nu(1 - v/c)$`, R`$\nu$, since the mirror is much heavier than a photon`, R`$\nu(1 + 2v/c)$`], answer: 0,
      sol: R`In the mirror's frame the photon bounces back with unchanged energy. Going back to the lab frame, the reflected photon loses energy: its momentum change is $2p = 2h\nu/c$, and the mirror moving at $v$ takes work $2pv$ per photon. So $h\nu' = h\nu - 2h\nu v/c$, giving $\nu' = \nu(1 - 2v/c)$. The exact result is $\nu(1 - v/c)/(1 + v/c)$, the Doppler shift applied twice. The mirror's mass is irrelevant: what matters is that it moves.`,
      trap: R`A heavy mirror at rest returns the same frequency, but a moving one does work on (or receives work from) each photon.` },
    { id: 'pho-r4-10', type: 'nat', level: 4, exams: JG, sub: 'compton',
      q: R`A $1000$ keV gamma photon is back-scattered ($\theta = 180^\circ$) by a free electron at rest, then the scattered photon is back-scattered by another free electron, and so on. With $m_ec^2 = 511$ keV, the smallest number of back-scatterings after which its energy is below $50$ keV is ______.`,
      answer: 5, tol: 0, calc: () => Math.ceil((1 / 50 - 1 / 1000) * 511 / 2),
      sol: R`For one scattering, $\dfrac1{E'} = \dfrac1E + \dfrac{1 - \cos\theta}{m_ec^2}$, so each back-scattering adds $2/511$ keV$^{-1}$ to $1/E$. After $n$ of them, $\dfrac1{E_n} = \dfrac1{1000} + \dfrac{2n}{511}$. We need $1/E_n > 1/50 = 0.0200$: $2n/511 > 0.0190$, so $n > 4.85$. Check: $n = 4$ gives $E_4 = 60.0$ keV, $n = 5$ gives $E_5 = 48.6$ keV. Answer: $5$.`,
      trap: R`Working with energies directly instead of their reciprocals: it is $1/E$ that rises by a fixed step.` },
  ],
  gens: [
    { id: 'pho-r4g1', type: 'nat', level: 2, exams: J, sub: 'photon flux',
      make(r) {
        const P = pick(r, 0.5, 5, 0.5), lam = choose(r, [450, 500, 550, 600, 650]), d = choose(r, [0.5, 1, 2, 5, 10]), rad = pick(r, 1, 4, 0.5);
        const N = P * lam * 1e-9 / (6.626e-34 * 3e8) * (rad * 1e-3) ** 2 / (4 * (d * 1e3) ** 2), e = Math.floor(Math.log10(N)), m = N / 10 ** e;
        return { q: `A $${P}$ W lamp sends out light of wavelength $${lam}$ nm equally in all directions. An eye $${d}$ km away has a pupil of radius $${rad}$ mm. With $h = 6.626\\times10^{-34}$ J s and $c = 3.00\\times10^8$ m/s, the number of photons entering the eye each second is ______ $\\times10^{${e}}$ (to two decimal places).`,
          answer: round(m, 2), tol: 0.02, P, lam, d, rad, e,
          sol: `Photon energy $hc/\\lambda = ${round(6.626e-34 * 3e8 / (lam * 1e-9) * 1e19, 3)}\\times10^{-19}$ J, so the lamp emits $${round(P * lam * 1e-9 / (6.626e-34 * 3e8) / 1e18, 3)}\\times10^{18}$ photons/s. The pupil catches $r^2/4d^2 = (${rad}\\times10^{-3})^2/(4\\times(${d}\\times10^3)^2)$ of them, giving $${round(m, 2)}\\times10^{${e}}$ per second.`,
          trap: 'The light spreads over a sphere of area $4\\pi d^2$.' };
      },
      verify: (p) => p.P * p.lam * 1e-9 / (6.626e-34 * 3e8) * (p.rad * 1e-3) ** 2 / (4 * (p.d * 1e3) ** 2) / 10 ** p.e },
    { id: 'pho-r4g2', type: 'nat', level: 4, exams: JG, sub: 'contact potential', unit: 'V',
      make(r) {
        const lam = choose(r, [200, 210, 220, 230, 240, 250]), E = 1240 / lam, phiE = pick(r, 2.0, 3.0, 0.1), phiC = round(phiE + pick(r, 0.5, 1.5, 0.1), 1);
        return { q: `A photocell has an emitter of work function $${phiE}$ eV and a collector of a different metal with work function $${phiC}$ eV. Ultraviolet light of wavelength $${lam}$ nm falls on the emitter. With $hc = 1240$ eV nm, the retarding voltage that must be applied between the terminals to stop the photocurrent just is ______ V (to two decimal places).`,
          answer: round(E - phiC, 2), tol: 0.01, lam, phiC,
          sol: `Photon energy $1240/${lam} = ${round(E, 3)}$ eV; the fastest electrons leave with $${round(E - phiE, 3)}$ eV. Joined metals share a Fermi level, so the vacuum level outside the collector sits $${phiC} - ${phiE} = ${round(phiC - phiE, 1)}$ eV higher than outside the emitter, and that contact potential already slows the electrons. The applied voltage supplies the rest: $eV = h\\nu - \\phi_{\\rm collector} = ${round(E, 3)} - ${phiC} = ${round(E - phiC, 2)}$ eV.`,
          trap: `$h\\nu - \\phi_{\\rm emitter} = ${round(E - phiE, 2)}$ eV ignores the contact potential between the unlike metals.` };
      },
      verify: (p) => 1240 / p.lam - p.phiC },
    { id: 'pho-r4g3', type: 'nat', level: 4, exams: JG, sub: 'compton', unit: 'keV',
      make(r) {
        const E = choose(r, [200, 300, 511, 662, 1000, 1332]), n = int(r, 2, 4), ang = choose(r, [90, 180]), step = ang === 90 ? 1 : 2;
        const En = 1 / (1 / E + n * step / 511);
        return { q: `A $${E}$ keV gamma photon is Compton-scattered through $${ang}^\\circ$ by a free electron at rest, and the scattered photon is scattered through $${ang}^\\circ$ again by another free electron, ${n} scatterings in all. With $m_ec^2 = 511$ keV, the final photon energy is ______ keV (to one decimal place).`,
          answer: round(En, 1), tol: 0.3, E, n, step,
          sol: `Each scattering adds $(1 - \\cos\\theta)/m_ec^2 = ${step}/511$ keV$^{-1}$ to $1/E$. After ${n}: $1/E_${n} = 1/${E} + ${n * step}/511 = ${round(1 / En, 6)}$ keV$^{-1}$, so $E_${n} = ${round(En, 1)}$ keV.`,
          trap: 'The reciprocal energy rises by a fixed step each time; the energy itself does not fall by a fixed amount.' };
      },
      verify: (p) => 1 / (1 / p.E + p.n * p.step / 511) },
  ],
};
