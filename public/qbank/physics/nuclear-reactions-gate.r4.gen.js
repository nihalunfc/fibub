// Round 4 extras for nuclear-reactions-gate: original questions, written 2026-11-22.
import { choose, round } from '../_util.js';
const R = String.raw;
const HC = 197.327, MN = 939.565, NA = 6.022e23;
const sig3 = (x) => +x.toPrecision(3);
const MAT = [['graphite', 1.7, 12.01, 4.7, 'scattering'], ['lead', 11.35, 207.2, 11.3, 'total'], ['iron', 7.87, 55.85, 14.1, 'total'], ['aluminium', 2.70, 26.98, 1.7, 'total'], ['boron-10 (pure)', 2.3, 10.01, 3840, 'absorption']];
const nDen = (rho, M) => rho / M * NA;
const kOf = (T, A) => Math.sqrt(2 * MN * T) * A / (A + 1) / HC;

export default {
  items: [
    { id: 'nrg-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate'], sub: 'notation',
      q: R`Which reaction is the inverse of $^{14}\text{N}(n, p){}^{14}\text{C}$?`,
      options: [R`$^{14}\text{C}(n, p){}^{14}\text{N}$`, R`$^{14}\text{N}(p, n){}^{14}\text{C}$`, R`$^{14}\text{C}(p, \gamma){}^{15}\text{N}$`, R`$^{14}\text{C}(p, n){}^{14}\text{N}$`], answer: 3,
      sol: R`$X(a, b)Y$ means $a + X \to b + Y$. Here $n + {}^{14}\text{N} \to p + {}^{14}\text{C}$. The inverse runs the other way, $p + {}^{14}\text{C} \to n + {}^{14}\text{N}$, written $^{14}\text{C}(p, n){}^{14}\text{N}$. Its $Q$ value is minus that of the forward reaction ($-0.626$ MeV instead of $+0.626$ MeV).`,
      trap: R`Swapping only the target and product, or only the two light particles, instead of both.` },
    { id: 'nrg-r4-02', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'threshold',
      q: R`For an endoergic reaction ($Q < 0$) with the target at rest, the threshold kinetic energy of the projectile is larger than $|Q|$ because`,
      options: [R`some energy is always lost as gamma radiation`, R`the Coulomb barrier must also be overcome, even for neutrons`, R`the products are always formed in excited states`, R`momentum is conserved, so the products must still move together with the centre of mass and that motion takes kinetic energy`], answer: 3,
      sol: R`Only the kinetic energy in the centre-of-mass frame can be turned into mass. At threshold the products are at rest in the CM frame, i.e. they move together with the CM velocity in the lab, carrying kinetic energy $T_a\,m_a/(m_a + m_X)$ (non-relativistically). Setting the CM energy $T_a\,m_X/(m_a + m_X)$ equal to $|Q|$ gives $T_{th} = |Q|(1 + m_a/m_X)$.`,
      trap: R`Blaming the Coulomb barrier; the threshold formula holds for neutrons too, which feel no barrier.` },
    { id: 'nrg-r4-03', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'cross-section',
      q: R`Graphite has density $1.70$ g cm$^{-3}$ (carbon molar mass $12.0$ g/mol). With a neutron scattering cross-section of $4.70$ b ($1$ b $= 10^{-24}$ cm$^2$) and $N_A = 6.022\times10^{23}$ mol$^{-1}$, the mean free path of neutrons between collisions is ______ cm (two decimal places).`,
      answer: 2.49, tol: 0.02, unit: 'cm', calc: () => 1 / (1.7 / 12 * 6.022e23 * 4.7e-24),
      sol: R`Number density $n = \dfrac{1.70}{12.0}\times6.022\times10^{23} = 8.53\times10^{22}$ cm$^{-3}$. Macroscopic cross-section $\Sigma = n\sigma = 8.53\times10^{22}\times4.70\times10^{-24} = 0.401$ cm$^{-1}$. Mean free path $\lambda = 1/\Sigma = 2.49$ cm.`,
      trap: R`Forgetting the $10^{-24}$ in the barn, which gives an absurd length.` },
    { id: 'nrg-r4-04', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'attenuation',
      q: R`Cadmium (density $8.65$ g cm$^{-3}$, molar mass $112.4$ g/mol) has a thermal-neutron absorption cross-section of about $2520$ b. The fraction of a thermal neutron beam that passes straight through a $0.50$ mm cadmium sheet is about`,
      options: [R`$0.3\%$`, R`$3\%$`, R`$30\%$`, R`$0.003\%$`], answer: 0,
      sol: R`$n = \dfrac{8.65}{112.4}\times6.022\times10^{23} = 4.63\times10^{22}$ cm$^{-3}$, so $\Sigma = n\sigma = 4.63\times10^{22}\times2.52\times10^{-21} = 117$ cm$^{-1}$. For $x = 0.050$ cm, $\Sigma x = 5.83$ and the transmission is $e^{-5.83} = 2.9\times10^{-3}$, about $0.3\%$. That is why thin cadmium sheets serve as thermal-neutron shutters and control elements.`,
      trap: R`Using millimetres with a cross-section per centimetre, which gives $e^{-58}$.` },
    { id: 'nrg-r4-05', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'direct reactions', format: 'statements',
      q: R`About direct reactions such as $(d, p)$ stripping at about $15$ MeV, which statements are correct?`,
      options: [R`The angular distribution is forward-peaked, and its first maximum moves to larger angles as the transferred orbital angular momentum $\ell$ increases`, R`Comparing measured and calculated cross-sections gives spectroscopic factors that test shell-model wavefunctions`, R`They take about the time the projectile needs to cross the nucleus, around $10^{-22}$ s`, R`They proceed through a long-lived intermediate state that forgets how it was formed`], answer: [0, 1, 2],
      sol: R`In stripping the neutron is dropped into an orbit in a single step at the nuclear surface; the momentum it brings in must match $\ell$, so the peak sits near $qR \approx \ell$ and moves out with $\ell$. The size of the cross-section relative to a single-particle calculation is the spectroscopic factor. The whole process lasts roughly the transit time ($\sim10^{-22}$ s). The last statement describes the compound-nucleus mechanism, not a direct one.`,
      trap: R`Mixing up the two mechanisms: "memory loss" belongs to compound-nucleus reactions.` },
    { id: 'nrg-r4-06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'resonances',
      q: R`An isolated resonance follows the Breit-Wigner shape $\sigma(E) = \sigma_0\dfrac{(\Gamma/2)^2}{(E - E_R)^2 + (\Gamma/2)^2}$ with $\Gamma = 0.20$ eV. The cross-section falls to one tenth of its peak value at a distance $|E - E_R| = $ ______ eV from the resonance (two decimal places).`,
      answer: 0.3, tol: 0.005, unit: 'eV', calc: () => 0.1 * Math.sqrt(9),
      sol: R`$\dfrac{\sigma}{\sigma_0} = \dfrac{1}{1 + [2(E - E_R)/\Gamma]^2} = \dfrac1{10}$ gives $[2(E - E_R)/\Gamma]^2 = 9$, so $|E - E_R| = \tfrac32\Gamma = 0.30$ eV. At $|E - E_R| = \Gamma/2$ the value is one half, which is why $\Gamma$ is called the full width at half maximum.`,
      trap: R`Answering $\Gamma/2$ or $\Gamma$ (the half-maximum points) for a one-tenth level.` },
    { id: 'nrg-r4-07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'optical model',
      q: R`In the optical model a $40$ MeV nucleon moves through nuclear matter in a potential with imaginary part $W = 10$ MeV. Treating the nucleon non-relativistically ($mc^2 = 939.6$ MeV, $\hbar c = 197.3$ MeV fm), its mean free path before being absorbed is ______ fm (two decimal places).`,
      answer: 2.88, tol: 0.03, unit: 'fm', calc: () => 197.3 * Math.sqrt(2 * 40 / 939.6) / 20,
      sol: R`With $V - iW$ the probability density decays as $e^{-2Wt/\hbar}$, so the mean free path is $\lambda = \dfrac{\hbar v}{2W}$. Here $v/c = \sqrt{2T/mc^2} = \sqrt{80/939.6} = 0.292$, so $\lambda = \dfrac{197.3\times0.292}{2\times10} = 2.88$ fm. This is smaller than a heavy nucleus, so much of the incoming flux is absorbed (the nucleus is "grey" to "black").`,
      trap: R`Using $\hbar v/W$ (forgetting that the density decays twice as fast as the amplitude).` },
    { id: 'nrg-r4-08', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'identical particles',
      q: R`Alpha particles (spin-0 bosons) scatter elastically from $^4$He. Let $f(\theta)$ be the CM scattering amplitude. At $\theta_{\rm cm} = 90^\circ$ the measured cross-section, compared with the value $|f(\theta)|^2 + |f(\pi - \theta)|^2$ expected if the two nuclei could be told apart, is`,
      options: [R`the same`, R`twice as large`, R`four times as large`, R`zero`], answer: 1,
      sol: R`For identical bosons the amplitudes for "projectile at $\theta$" and "target at $\theta$" add: $\sigma = |f(\theta) + f(\pi - \theta)|^2$. At $90^\circ$ the two amplitudes are equal, so $\sigma = |2f|^2 = 4|f|^2$, while the distinguishable value is $2|f|^2$. The ratio is 2. For identical spin-$\tfrac12$ fermions in a spin singlet the same holds, and in a triplet the $90^\circ$ cross-section vanishes.`,
      trap: R`Comparing with the single term $|f|^2$ (giving 4), or thinking interference must cancel (giving 0).` },
    { id: 'nrg-r4-09', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'partial waves',
      q: R`A $1.00$ MeV neutron hits a heavy nucleus (take the reduced mass equal to $m_nc^2 = 939.6$ MeV, $\hbar c = 197.3$ MeV fm). Unitarity limits the reaction (absorption) cross-section in a single partial wave $\ell$ to $\pi(2\ell + 1)/k^2$. For $\ell = 1$ this limit is ______ b (two decimal places).`,
      answer: 1.95, tol: 0.02, unit: 'b', calc: () => { const k = Math.sqrt(2 * 939.6) / 197.3; return 3 * Math.PI / k ** 2 / 100; },
      sol: R`$k = \dfrac{\sqrt{2mc^2T}}{\hbar c} = \dfrac{\sqrt{2\times939.6\times1.00}}{197.3} = 0.2197$ fm$^{-1}$, so $k^2 = 0.04827$ fm$^{-2}$. The limit is $\dfrac{3\pi}{0.04827} = 195$ fm$^2 = 1.95$ b ($1$ b $= 100$ fm$^2$). The elastic cross-section in the same wave can reach four times this, $4\pi(2\ell + 1)/k^2$, when there is no absorption.`,
      trap: R`Using the elastic limit $4\pi(2\ell + 1)/k^2$, or converting fm$^2$ to barns with the wrong power of ten.` },
    { id: 'nrg-r4-10', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'balancing reactions',
      q: R`Which of these reactions produce $^{14}$C?`,
      options: [R`$^{14}\text{N}(n, p)$`, R`$^{13}\text{C}(p, \gamma)$`, R`$^{11}\text{B}(\alpha, p)$`, R`$^{14}\text{N}(p, n)$`], answer: [0, 2],
      sol: R`Balance $A$ and $Z$. $n + {}^{14}_7\text{N} \to p + X$: $A = 14$, $Z = 6$, carbon-14 (this is how cosmic-ray neutrons make it in the air). $p + {}^{13}_6\text{C}\to\gamma + X$: $A = 14$, $Z = 7$, nitrogen-14. $\alpha + {}^{11}_5\text{B} \to p + X$: $A = 14$, $Z = 6$, carbon-14. $p + {}^{14}_7\text{N} \to n + X$: $A = 14$, $Z = 8$, oxygen-14.`,
      trap: R`Balancing only mass numbers: every option gives $A = 14$; the charge decides.` },
  ],
  gens: [
    { id: 'nrg-r4g1', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'attenuation',
      make(r) {
        const [nm, rho, M, sg, kind] = choose(r, MAT), n = nDen(rho, M), Sig = n * sg * 1e-24, ask = choose(r, ['mfp', 'T']);
        const x = sg > 100 ? choose(r, [0.01, 0.02, 0.05]) : choose(r, [1, 2, 5, 10]);
        const ans = ask === 'mfp' ? 1 / Sig : 100 * Math.exp(-Sig * x);
        return { q: R`For neutrons in ${nm} (density $${rho}$ g cm$^{-3}$, molar mass $${M}$ g/mol) the ${kind} cross-section is $${sg}$ b. With $N_A = 6.022\times10^{23}$ mol$^{-1}$, ${ask === 'mfp' ? 'the mean free path is ______ cm' : `the percentage of a narrow beam that crosses a $${x}$ cm slab without any such interaction is ______ %`} (three significant figures).`,
          answer: sig3(ans), tol: sig3(ans * 0.01), rho, M, sg, x, ask,
          sol: R`$n = \dfrac{${rho}}{${M}}\times6.022\times10^{23} = ${sig3(n / 1e22)}\times10^{22}$ cm$^{-3}$; $\Sigma = n\sigma = ${sig3(Sig)}$ cm$^{-1}$. ${ask === 'mfp' ? R`Mean free path $1/\Sigma = ${sig3(ans)}$ cm.` : R`Transmission $e^{-\Sigma x} = e^{-${sig3(Sig * x)}} = ${sig3(ans)}\%$.`}`,
          trap: R`Dropping the $10^{-24}$ cm$^2$ per barn.` };
      },
      verify: (p) => { const S = nDen(p.rho, p.M) * p.sg * 1e-24; return p.ask === 'mfp' ? 1 / S : 100 * Math.exp(-S * p.x); } },
    { id: 'nrg-r4g2', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'resonances',
      make(r) {
        const G = choose(r, [0.05, 0.1, 0.12, 0.2, 0.5, 1.0]), [f, ft] = choose(r, [[0.5, 'one half'], [0.2, 'one fifth'], [0.1, 'one tenth'], [0.05, 'one twentieth'], [0.01, 'one hundredth']]);
        const ans = G / 2 * Math.sqrt(1 / f - 1);
        return { q: R`A Breit-Wigner resonance $\sigma = \sigma_0\dfrac{(\Gamma/2)^2}{(E - E_R)^2 + (\Gamma/2)^2}$ has $\Gamma = ${G}$ eV. The cross-section is ${ft} of its peak value at $|E - E_R| = $ ______ eV (three significant figures).`,
          answer: sig3(ans), tol: sig3(ans * 0.005), G, f,
          sol: R`$1 + [2(E - E_R)/\Gamma]^2 = 1/${f}$, so $|E - E_R| = \dfrac\Gamma2\sqrt{1/${f} - 1} = ${G / 2}\times${round(Math.sqrt(1 / f - 1), 4)} = ${sig3(ans)}$ eV.`,
          trap: R`Forgetting the factor $\tfrac12$ on $\Gamma$: the width is the FULL width at half maximum.` };
      },
      verify: (p) => p.G / 2 * Math.sqrt(1 / p.f - 1) },
    { id: 'nrg-r4g3', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'partial waves',
      make(r) {
        const T = choose(r, [0.1, 0.5, 1, 2, 5]), A = choose(r, [12, 27, 56, 100, 208]), l = choose(r, [0, 1, 2, 3]), el = choose(r, [true, false]);
        const k = kOf(T, A), ans = (el ? 4 : 1) * Math.PI * (2 * l + 1) / k ** 2 / 100;
        return { q: R`A neutron of lab kinetic energy $${T}$ MeV hits a nucleus with $A = ${A}$ at rest. Using the reduced mass $\mu = m_n\dfrac{A}{A + 1}$ ($m_nc^2 = 939.565$ MeV) and the CM energy $T\dfrac{A}{A + 1}$ ($\hbar c = 197.327$ MeV fm), the largest possible ${el ? 'elastic' : 'reaction'} cross-section in the partial wave $\ell = ${l}$ is ______ b (three significant figures).`,
          answer: sig3(ans), tol: sig3(ans * 0.01), T, A, l, el,
          sol: R`$p^2c^2 = 2\mu c^2E_{\rm cm} = 2m_nc^2\dfrac{A}{A + 1}\cdot T\dfrac{A}{A + 1}$, so $k = \dfrac{A}{A + 1}\dfrac{\sqrt{2m_nc^2T}}{\hbar c} = ${round(k, 4)}$ fm$^{-1}$. The limit is $${el ? 4 : ''}\pi(2\ell + 1)/k^2 = ${sig3(ans * 100)}$ fm$^2 = ${sig3(ans)}$ b.`,
          trap: R`Mixing the elastic limit $4\pi(2\ell + 1)/k^2$ with the reaction limit $\pi(2\ell + 1)/k^2$.` };
      },
      verify: (p) => (p.el ? 4 : 1) * Math.PI * (2 * p.l + 1) / kOf(p.T, p.A) ** 2 / 100 },
  ],
};
