---
title: Conservation laws and symmetries
summary: 'Which processes happen and through which force: Noether''s theorem, additive quantum numbers (charge, baryon and lepton numbers, strangeness and the other flavours), the table of what each interaction conserves, isospin and Clebsch-Gordan branching ratios, parity, charge conjugation, G-parity and J^PC, parity violation and helicity, neutral kaons, CP violation and the CPT theorem.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'The decay Ξ⁻ → n + π⁻ conserves charge, baryon number and energy but is not observed. Why?'
    choices: ['strangeness would change by 2, and weak decays change it by at most one unit', 'lepton number is violated', 'parity forbids it', 'angular momentum forbids it']
    ans: 0
    why: 'Ξ⁻ (dss) has S = −2; n and π⁻ have S = 0. Each weak vertex changes one quark flavour, so |ΔS| ≤ 1 per decay. The Ξ⁻ goes in two steps instead: Ξ⁻ → Λπ⁻, then Λ → pπ⁻.'
  - q: 'Orthopositronium (³S₁) must annihilate into at least three photons because'
    choices: ['its C = (−1)^(L+S) = −1, and n photons have C = (−1)^n', 'its parity is negative', 'two photons cannot carry its energy', 'it has zero angular momentum']
    ans: 0
    why: 'Electromagnetism conserves C. With L = 0, S = 1, C = −1, so an odd number of photons is needed, and one photon cannot conserve momentum: three. Parapositronium (¹S₀, C = +1) goes to two.'
  - q: 'The long-lived neutral kaon K_L decays occasionally to π⁺π⁻. This is evidence for'
    choices: ['CP violation', 'CPT violation', 'strangeness conservation in weak decays', 'lepton number violation']
    ans: 0
    why: 'Two pions from a spin-0 particle have CP = +1, while K_L is mostly the CP = −1 combination. The small π⁺π⁻ rate (about 2 × 10⁻³ of K_L decays) means CP is not an exact symmetry of the weak interaction. CPT remains exact.'
sources:
  - 'D. Griffiths, Introduction to Elementary Particles, 2nd ed. (2008), chapter 4'
  - 'D. H. Perkins, Introduction to High Energy Physics, 4th ed. (2000), chapters 3 and 7'
  - 'J. H. Christenson, J. W. Cronin, V. L. Fitch and R. Turlay, Evidence for the 2π decay of the K₂⁰ meson, Physical Review Letters 13, 138 (1964)'
  - 'C. S. Wu et al., Experimental test of parity conservation in beta decay, Physical Review 105, 1413 (1957)'
  - 'GATE Physics (PH) syllabus, Nuclear and Particle Physics section, published by the organising IIT each year'
---

**Module 8 · about 55 minutes.** [Lesson 8.6](/learn/courses/gate-physics/particles-quarks/) introduced the particles. Now the rules: which reactions and decays are allowed, which are forbidden, and which force is responsible. Most GATE questions on particles come down to checking a list of conserved quantities, so this lesson ends with a checker you can try on real and impossible decays.

<div class="bigidea">Every conservation law comes from a symmetry. Some quantities (energy, momentum, angular momentum, charge, baryon number, lepton numbers) are conserved by every interaction known. Others hold only for some forces: the strong force conserves isospin and strangeness, electromagnetism conserves strangeness but not isospin, and the weak force breaks flavour, parity and charge conjugation, and even CP by a little. A decay goes by the strongest force that allows it, and the lifetime tells you which force that was.</div>

## 1. Symmetries and conservation laws

**Noether's theorem**: each continuous symmetry of the action gives a conserved quantity.

| Symmetry | Conserved |
|---|---|
| translation in time | energy |
| translation in space | linear momentum |
| rotation | angular momentum |
| global phase `$\psi \to e^{i\alpha}\psi$` of a charged field | electric charge |
| global phases for quarks and leptons | baryon number, lepton numbers |

Discrete symmetries (parity P, charge conjugation C, time reversal T) give multiplicative quantum numbers (`$\pm1$`) and selection rules instead of additive charges. Additive quantum numbers add over the particles in a state; antiparticles carry the opposite values.

Try each setup and look at which strips stay flat.

<figure class="fig" data-fig="@mech-noether"><figcaption>Each symmetry gives its own conserved quantity: rotation gives L, shifts in x or y give p_x or p_y, and no change with time gives E.</figcaption></figure>

## 2. What each interaction conserves

| Quantity | Strong | EM | Weak |
|---|---|---|---|
| `$Q$`, `$B$`, `$L_e$`, `$L_\mu$`, `$L_\tau$` | yes | yes | yes |
| strangeness, charm, bottomness | yes | yes | no (`$\Delta S = 0, \pm1$`) |
| isospin `$I$` | yes | no | no |
| `$I_3$` | yes | yes | no |
| P, C | yes | yes | no (maximally broken) |
| CP | yes | yes | no (broken at `$10^{-3}$`) |
| CPT | yes | yes | yes |
| G-parity | yes | no | no |

(The separate lepton numbers are broken by neutrino oscillations, but in decays like `$\mu \to e\gamma$` the violation is far too small to see.)

**Typical lifetimes:** strong `$10^{-24}$` to `$10^{-20}$` s; electromagnetic `$10^{-20}$` to `$10^{-16}$` s; weak `$10^{-13}$` s to minutes. A photon in the final state signals electromagnetism, a neutrino or a change of flavour signals the weak force.

**Worked example.** `$\Sigma^0$` (1192.6 MeV) and `$\Lambda$` (1115.7 MeV) have the same quark content (uds) and strangeness. The strong decay `$\Sigma^0 \to \Lambda\pi^0$` would need 135 MeV but only 77 MeV is available, so the `$\Sigma^0$` decays electromagnetically, `$\Sigma^0 \to \Lambda\gamma$`, in `$7.4\times10^{-20}$` s. The `$\Lambda$`, the lightest strange baryon, can only decay weakly (`$\Lambda \to p\pi^-$`, `$2.6\times10^{-10}$` s), changing strangeness by one.

<figure class="fig" data-fig="decay-checker"><figcaption>Pick a process: the table adds up charge, baryon number, the three lepton numbers and strangeness on both sides, checks the masses for decays, and gives the verdict and the force. Try the forbidden ones to see which law each breaks.</figcaption></figure>

## 3. Isospin at work

The strong force conserves total isospin, so strong decay rates and reaction cross-sections follow Clebsch-Gordan coefficients (the same ones used to add [angular momenta](/learn/courses/gate-physics/angular-momentum/)).

**Worked example.** `$\Delta^+$` is `$|\tfrac32, \tfrac12\rangle$`. Coupling a pion (`$I = 1$`) and a nucleon (`$I = \tfrac12$`):

```math
|\tfrac32, \tfrac12\rangle = \sqrt{\tfrac23}\,|\pi^0p\rangle + \sqrt{\tfrac13}\,|\pi^+n\rangle \quad\Rightarrow\quad \frac{\Gamma(\Delta^+ \to p\pi^0)}{\Gamma(\Delta^+ \to n\pi^+)} = 2
```

Likewise the deuteron has `$I = 0$`, so `$d\pi$` is pure `$I = 1$`; `$pp$` is all `$I = 1$` but `$np$` only half, which predicts `$\sigma(pp \to d\pi^+)/\sigma(np \to d\pi^0) = 2$`, as measured. A process like `$d + d \to {}^4\text{He} + \pi^0$` (`$I = 0 \to I = 1$`) is forbidden by isospin and is seen only at the tiny rate allowed by electromagnetic isospin breaking.

## 4. Parity, charge conjugation and G-parity

**Parity** reverses all coordinates. A state of particles with relative orbital angular momentum `$L$` has `$P = P_1P_2(-1)^L$`. By convention nucleons have `$P = +1$`; the photon has `$P = -1$`. A fermion and its antifermion have opposite intrinsic parities, so a `$q\bar q$` meson has `$P = (-1)^{L+1}$`.

**Worked example: the pion's parity.** A slow `$\pi^-$` is captured from an s orbit by a deuteron (`$1^+$`) and gives `$\pi^-d \to nn$`. The initial `$J = 1$`. Two identical neutrons need an antisymmetric state, which allows `$^1S_0$`, `$^3P_J$`, `$^1D_2$`...; only `$^3P_1$` has `$J = 1$`. Its parity is `$(-1)^1 = -1$`, so `$P_\pi P_d = -1$` and `$P_\pi = -1$`. The pion is a pseudoscalar, `$0^-$`.

**Charge conjugation** turns particles into antiparticles. Only neutral states that are their own antiparticle are C eigenstates. The photon has `$C = -1$` (the field changes sign with the charges), so `$n$` photons have `$C = (-1)^n$`. A fermion-antifermion pair has `$C = (-1)^{L+S}$`:

```math
q\bar q\ \text{or}\ e^+e^-:\quad P = (-1)^{L+1}, \qquad C = (-1)^{L+S}
```

<div class="meaning">

<dl>
<dt>`$\pi^0$`, `$\eta$`</dt><dd>`$L = 0$`, `$S = 0$`: `$J^{PC} = 0^{-+}$`, so they decay to `$\gamma\gamma$`, never to `$3\gamma$`</dd>
<dt>`$\rho^0$`, `$\omega$`, `$\phi$`, `$J/\psi$`</dt><dd>`$L = 0$`, `$S = 1$`: `$1^{--}$`, the quantum numbers of a photon, so they are made directly in `$e^+e^-$` collisions</dd>
<dt>Positronium</dt><dd>para (`$^1S_0$`, `$C = +1$`) goes to `$2\gamma$` in 125 ps; ortho (`$^3S_1$`, `$C = -1$`) to `$3\gamma$` in 142 ns</dd>
<dt>Exotic `$J^{PC}$`</dt><dd>`$0^{--}$`, `$0^{+-}$`, `$1^{-+}$`, `$2^{+-}$` cannot be made from `$q\bar q$`; a state with them must contain gluons or more quarks</dd>
</dl>

</div>

**G-parity** extends C to charged pions: `$G = C\,e^{i\pi I_2}$` (charge conjugation followed by a 180° rotation in isospin space). Each pion has `$G = -1$`, so `$n$` pions have `$G = (-1)^n$`, and strong decays conserve G. The `$\rho$` (`$G = +1$`) decays to two pions, the `$\omega$` (`$G = -1$`) to three. (The `$\eta$`, with `$G = +1$`, decays to three pions only by breaking G electromagnetically, which is why it is so narrow, 1.3 keV.) That is why the `$\omega$` (782 MeV) prefers `$\pi^+\pi^-\pi^0$` even though `$\pi^+\pi^-$` has more phase space.

## 5. Parity violation and helicity

In 1956 the "`$\tau$`-`$\theta$` puzzle" (one particle, the `$K^+$`, decaying to final states of both parities) led Lee and Yang to ask whether the weak force conserves parity. Wu's `$^{60}$`Co experiment (1957) answered no: electrons came out preferentially opposite to the nuclear spin, a correlation `$\langle\vec J\rangle\cdot\vec p_e$` that changes sign under P. The weak charged current couples only to left-handed particles and right-handed antiparticles (the V − A form). Neutrinos have helicity `$-\tfrac12$` and antineutrinos `$+\tfrac12$` (Goldhaber, 1958). P and C are each broken maximally; their product CP survives almost exactly.

**Worked example: helicity suppression.** In `$\pi^+ \to \ell^+\nu_\ell$` the pion has spin 0, so the lepton and the neutrino, flying apart back to back, must have opposite spin projections along their common line, which gives the antilepton the same handedness as the neutrino: left-handed. V − A wants a right-handed antilepton, and the left-handed component is suppressed by a factor `$\propto m_\ell^2$`:

```math
\frac{\Gamma(\pi^+ \to e^+\nu_e)}{\Gamma(\pi^+ \to \mu^+\nu_\mu)} = \left(\frac{m_e}{m_\mu}\right)^2\left(\frac{m_\pi^2 - m_e^2}{m_\pi^2 - m_\mu^2}\right)^2 = 1.28\times10^{-4}
```

Measured: `$1.23\times10^{-4}$` (radiative corrections bring the prediction into agreement). Phase space alone would have favoured the electron mode; helicity reverses the verdict by four orders of magnitude.

## 6. Neutral kaons, CP and CPT

`$K^0$` (`$d\bar s$`) and `$\bar K^0$` (`$s\bar d$`) have opposite strangeness, but the weak force connects them (through second-order W exchange), so they mix. With `$CP|K^0\rangle = |\bar K^0\rangle$` (a phase convention), the CP eigenstates are

```math
K_1 = \frac{K^0 + \bar K^0}{\sqrt2}\ (CP = +1 \to \pi\pi), \qquad K_2 = \frac{K^0 - \bar K^0}{\sqrt2}\ (CP = -1 \to \pi\pi\pi)
```

Two pions have much more phase space than three, so `$K_1$` decays fast and `$K_2$` slowly. These are, to a very good approximation, the observed `$K_S$` (`$\tau = 0.0895$` ns) and `$K_L$` (`$\tau = 51.2$` ns). A beam made as pure `$K^0$` (in `$\pi^-p \to K^0\Lambda$`) is half `$K_S$` and half `$K_L$`; after a few nanoseconds only `$K_L$` remains, and since `$K_L$` is half `$\bar K^0$`, it can now make hyperons that need `$S = -1$`. The mass difference `$\Delta m\,c^2 = 3.48\times10^{-12}$` MeV makes strangeness oscillate with a period of 1.19 ns.

**Worked example.** At 10 GeV/c (`$\beta\gamma = 20.1$`), the mean decay lengths are `$20.1\times2.68$` cm = 54 cm for `$K_S$` and `$20.1\times15.3$` m = 308 m for `$K_L$`. A detector 10 m downstream sees essentially a pure `$K_L$` beam.

<div class="problem" data-problem="survival-flight"></div>

**CP violation.** In 1964 Christenson, Cronin, Fitch and Turlay saw `$K_L \to \pi^+\pi^-$` in about 2 decays per thousand. Since `$\pi\pi$` has `$CP = +1$`, the long-lived kaon is not a pure CP eigenstate: `$|\eta_{+-}| = |A(K_L \to \pi^+\pi^-)/A(K_S \to \pi^+\pi^-)| = 2.23\times10^{-3}$`. CP violation is built into the Standard Model through a complex phase in the quark mixing matrix (which needs at least three generations, one reason Kobayashi and Maskawa predicted the third generation in 1973). It is also one of the ingredients needed to explain why the universe has more matter than antimatter.

**The CPT theorem.** Any local, Lorentz-invariant quantum field theory is invariant under the combined CPT. Consequences: particles and antiparticles have exactly equal masses and total lifetimes, and equal and opposite charges and magnetic moments. The best test: the `$K^0$`-`$\bar K^0$` mass difference is less than `$10^{-18}$` of the kaon mass. Since CPT holds and CP is broken, T must be broken too; a permanent electric dipole moment of the neutron would break both P and T, and searches have pushed it below `$2\times10^{-26}\,e$` cm.

<div class="myth">

**"If a process breaks no conservation law I can think of, it must happen often, and a forbidden process is impossible."** Allowed processes can still be strongly suppressed (by small phase space, a high angular momentum barrier, helicity, or the OZI rule), and some laws are approximate: isospin is broken by electromagnetism, CP by the weak force, separate lepton numbers by neutrino mixing. Always ask which force acts and how good its symmetry is.

</div>

<div class="keypoints">

- Noether: time, space, rotation and phase symmetries give energy, momentum, angular momentum and charge; B and the L's are conserved in all observed decays.
- Strong conserves everything in the table; EM breaks isospin and G; weak breaks flavour (`$|\Delta S| \le 1$`), P, C and slightly CP. CPT is exact.
- Lifetimes: strong `$\sim10^{-23}$` s, EM `$10^{-20}$`–`$10^{-16}$` s, weak `$\ge10^{-13}$` s.
- Isospin ratios from Clebsch-Gordan: `$\Delta^+ \to p\pi^0 : n\pi^+ = 2 : 1$`; `$pp \to d\pi^+ : np \to d\pi^0 = 2 : 1$`.
- `$P = P_1P_2(-1)^L$`; pion `$0^-$`; `$q\bar q$` and `$e^+e^-$`: `$P = (-1)^{L+1}$`, `$C = (-1)^{L+S}$`; photon `$C = -1$`; `$G = (-1)^n$` for `$n$` pions.
- Neutrinos left-handed; `$\Gamma(\pi \to e\nu)/\Gamma(\pi \to \mu\nu) = 1.28\times10^{-4}$`.
- `$K_S \approx K_1$` (`$CP = +1$`, 0.09 ns), `$K_L \approx K_2$` (`$CP = -1$`, 51 ns); `$K_L \to \pi\pi$` shows CP violation, `$|\eta_{+-}| = 2.2\times10^{-3}$`.

</div>

## Practise: exam questions on this lesson

<div class="qbank" data-bank="physics" data-topics="conservation-laws" data-exam="gate" data-n="10"></div>

**Next:** this is the last lesson of Module 8. Mix all seven topics in a timed set on the [practice page](/learn/courses/gate-physics/practice/), return to the GATE Physics course for [Module 9](/learn/courses/gate-physics/semiconductor-devices/), or go back to [lesson 8.1](/learn/courses/gate-physics/nuclear-properties/) to revise from the start.
