---
title: 'Scattering: Born approximation and partial waves'
seoTitle: Born approximation and partial waves | CSIR NET Physics
summary: 'Quantum scattering for CSIR NET: the scattering amplitude and cross-section, the first Born approximation for Yukawa, Coulomb, square-well and Gaussian potentials, partial waves and phase shifts, the optical theorem and unitarity, scattering length, hard spheres, resonances, Levinson and Ramsauer, and identical particles.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: In the first Born approximation, the scattering amplitude is proportional to what?
    choices: ['The potential at the origin', 'The Fourier transform of the potential at the momentum transfer q = 2k sin(θ/2)', 'The square of the potential integrated over all space', 'The s-wave phase shift']
    ans: 1
    why: "f_B(θ) = −(m/2πħ²)∫e^(−iq·r)V(r)d³r, the Fourier transform of V evaluated at the momentum transfer q = k − k′. Short-range structure shows up at large q, that is at large angles and high energies."
  - q: Hard spheres of radius a scatter slow particles (ka ≪ 1). What is the total cross-section?
    choices: ['πa²', '2πa²', '4πa²', '(4/3)πa³']
    ans: 2
    why: "Only the s wave matters, with δ₀ = −ka, so σ = (4π/k²) sin²(ka) → 4πa²: four times the geometric area, because low-energy waves diffract around the whole sphere."
  - q: What does the optical theorem relate?
    choices: ['The phase shift to the scattering length', 'The forward amplitude to the backward amplitude', 'The differential cross-section at 90° to the total cross-section', 'The total cross-section to the imaginary part of the forward amplitude']
    ans: 3
    why: "σ_tot = (4π/k) Im f(0). Flux scattered out of the beam must be missing from the forward direction, and that shadow comes from interference of the forward scattered wave with the incident wave."
sources:
  - 'J. J. Sakurai and J. Napolitano, Modern Quantum Mechanics, 2nd ed. (2011), chapter 6'
  - 'D. J. Griffiths and D. F. Schroeter, Introduction to Quantum Mechanics, 3rd ed. (2018), chapter 10'
  - 'L. D. Landau and E. M. Lifshitz, Quantum Mechanics: Non-relativistic Theory, 3rd ed. (1977), chapter XVII'
  - 'CSIR-UGC NET Physical Sciences syllabus, Quantum Mechanics unit, published by the National Testing Agency'
---

**Module 5 · about 55 minutes.** Almost everything we know about forces between particles came from scattering one thing off another and counting where it went. CSIR NET asks two kinds of scattering question: the Born approximation (a Fourier transform, then an angular integral) and partial waves (phase shifts, low-energy limits, unitarity). Both are here, with the limits that the exam loves. The classical side (impact parameter, Rutherford) is in the GATE lesson on [central forces and scattering](/learn/courses/gate-physics/central-force-scattering/); the spherical harmonics and Legendre polynomials used below are in [angular momentum](/learn/courses/gate-physics/angular-momentum/).

<div class="bigidea">Far from the target, the wave is the incident plane wave plus an outgoing spherical wave of strength f(θ), and |f|² is the cross-section. Two ways to get f: for a weak potential, f is the Fourier transform of V at the momentum transfer (Born); at low energy, only a few angular momenta reach the target, and each is fully described by one phase shift δ_l (partial waves).</div>

## 1. Amplitude and cross-section

A beam `$e^{ikz}$` with energy `$E = \hbar^2k^2/2m$` hits a potential of finite range. Far away,

```math
\psi(\vec r) \longrightarrow e^{ikz} + f(\theta, \phi)\frac{e^{ikr}}{r}, \qquad \frac{d\sigma}{d\Omega} = |f(\theta, \phi)|^2, \qquad \sigma = \int|f|^2\,d\Omega
```

`$f$` has dimensions of length; `$d\sigma/d\Omega$` is the number scattered into `$d\Omega$` per second divided by the incident flux. Nuclear cross-sections come in barns (1 b = 10⁻²⁸ m² = 100 fm²).

Move the impact parameter, then switch on the whole beam and change the target and the energy.

<figure class="fig" data-fig="@qm-rutherford"><figcaption>A small impact parameter means a large deflection, and only an almost head-on α comes straight back. The counts fall as 1/sin⁴(θ/2).</figcaption></figure>

## 2. The first Born approximation

The integral form of the Schrödinger equation, with the outgoing Green's function, is

```math
\psi(\vec r) = e^{i\vec k\cdot\vec r} - \frac{m}{2\pi\hbar^2}\int\frac{e^{ik|\vec r - \vec r\,'|}}{|\vec r - \vec r\,'|}V(\vec r\,')\psi(\vec r\,')\,d^3r'
```

If `$V$` is weak, replace `$\psi$` inside the integral by the plane wave. Far away this gives

```math
f_B(\theta) = -\frac{m}{2\pi\hbar^2}\int e^{-i\vec q\cdot\vec r}\,V(\vec r)\,d^3r = -\frac{2m}{\hbar^2q}\int_0^\infty rV(r)\sin(qr)\,dr, \qquad q = 2k\sin\frac\theta2
```

the second form for a central potential. `$\hbar\vec q$` is the momentum transfer. The Born amplitude is real, depends on `$\theta$` and `$k$` only through `$q$`, and does not care about the sign of `$V$`.

Drag the exchanged mass up to the pion value (140 MeV) and move the nucleon separation across the range R.

<figure class="fig" data-fig="@qm-yukawa"><figcaption>A heavier exchanged particle lives for a shorter time, so the force reaches less far: Yukawa's e^(−r/R)/r collapses where Coulomb's 1/r only fades.</figcaption></figure>

| Potential | Born amplitude `$f_B(q)$` | Remarks |
|---|---|---|
| Yukawa `$V_0e^{-\mu r}/r$` | `$-\dfrac{2mV_0}{\hbar^2}\dfrac{1}{\mu^2 + q^2}$` | `$\mu \to 0$` gives Rutherford |
| square well `$-V_0$`, `$r < a$` | `$\dfrac{2mV_0}{\hbar^2q^3}(\sin qa - qa\cos qa)$` | `$\to 2mV_0a^3/3\hbar^2$` at low `$q$`; zeros at `$\tan qa = qa$` |
| Gaussian `$V_0e^{-r^2/b^2}$` | `$-\dfrac{\sqrt\pi\,mV_0b^3}{2\hbar^2}e^{-q^2b^2/4}$` | falls off fastest at large angles |
| exponential `$V_0e^{-r/a}$` | `$-\dfrac{4mV_0a^3}{\hbar^2(1 + q^2a^2)^2}$` | like a form factor |

**Coulomb.** With `$V_0 = Z_1Z_2e^2/4\pi\epsilon_0$` and `$\mu \to 0$`, `$d\sigma/d\Omega = (Z_1Z_2e^2/16\pi\epsilon_0E)^2/\sin^4(\theta/2)$`, exactly Rutherford's classical result; by a coincidence of the Coulomb potential the exact quantum result agrees too (apart from a phase in `$f$`). The total cross-section diverges, because the force has infinite range.

**When is Born good?** The scattered wave must be small near the target compared with the incident one. For a potential of strength `$V_0$` and range `$a$` this means

```math
\frac{2m|V_0|a^2}{\hbar^2} \ll 1 \ \ (\text{low energy}) \qquad\text{or}\qquad \frac{m|V_0|a}{\hbar^2k} \ll 1 \ \ (\text{high energy})
```

So Born improves at high energy, and it fails for any potential strong enough to bind a state.

### Worked example: total Yukawa cross-section

<div class="steps">
<div class="step"><p><b>Change variable.</b> q² = 2k²(1 − cos θ), so dΩ = 2π sin θ dθ = (π/k²) d(q²), with q² running from 0 to 4k².</p></div>
<div class="step"><p><b>Integrate.</b> With A = 2mV₀/ħ², σ = (πA²/k²)∫₀<sup>4k²</sup> dx/(μ² + x)² = (πA²/k²)[1/μ² − 1/(μ² + 4k²)].</p></div>
<div class="step"><p><b>Simplify.</b> σ = 4πA²/[μ²(μ² + 4k²)].</p></div>
<div class="step"><p><b>Limits.</b> At low energy (k ≪ μ), σ → 4πA²/μ⁴, isotropic. At high energy σ ≈ πA²/(μ²k²) falls as 1/E, and the scattering crowds into a forward cone of angle about μ/k. As μ → 0 it diverges, the Coulomb catastrophe.</p></div>
</div>

<figure class="fig" data-fig="born-phase-shifts"><figcaption>Left view: the Born cross-section of a Yukawa potential against angle (log scale). Raise k/μ and the scattering piles up forward, approaching the Rutherford shape. Right view: the exact s-wave phase shift of an attractive square well. Turn the well strength K₀a past π/2 and a bound state appears, sending sin²δ₀ to 1 at low energy.</figcaption></figure>

## 3. Partial waves

For a central potential, expand in Legendre polynomials. Outside the range of `$V$`, each angular momentum `$l$` is a free radial wave shifted by a phase `$\delta_l$`:

```math
u_l(r) \to \sin\left(kr - \frac{l\pi}{2} + \delta_l\right), \qquad f(\theta) = \frac1k\sum_{l=0}^\infty(2l + 1)\,e^{i\delta_l}\sin\delta_l\,P_l(\cos\theta)
```

The cross-section and the optical theorem follow:

```math
\sigma = \frac{4\pi}{k^2}\sum_l(2l + 1)\sin^2\delta_l, \qquad \sigma = \frac{4\pi}{k}\,\text{Im}\,f(0)
```

Each partial wave can contribute at most `$\sigma_l^{\max} = 4\pi(2l + 1)/k^2$` (**unitarity limit**, reached at `$\delta_l = \pi/2$`). A particle with angular momentum `$\hbar l$` passes at impact parameter `$b \approx l/k$`, so only `$l \lesssim ka$` feel a potential of range `$a$`. At low energy (`$ka \ll 1$`) the s wave dominates and the scattering is isotropic; higher waves are suppressed as `$\delta_l \propto k^{2l+1}$`.

When the target can absorb (inelastic channels), write `$e^{2i\delta_l} \to \eta_le^{2i\delta_l}$` with `$0 \le \eta_l \le 1$`. Then `$\sigma_{\rm el} = \tfrac{\pi}{k^2}\sum(2l + 1)|1 - \eta_le^{2i\delta_l}|^2$` and `$\sigma_{\rm inel} = \tfrac{\pi}{k^2}\sum(2l + 1)(1 - \eta_l^2)$`. A totally absorbing black disc of radius `$a$` (`$\eta_l = 0$` for `$l < ka$`) has `$\sigma_{\rm el} = \sigma_{\rm inel} = \pi a^2$`: the elastic half is the diffraction shadow.

<div class="problem" data-problem="partial-wave-sigma"></div>

## 4. Low energy: scattering length

As `$k \to 0$` the s-wave phase shift goes as `$\delta_0 \approx -ka_s$`, which defines the **scattering length** `$a_s$`; then

```math
\sigma \to 4\pi a_s^2, \qquad k\cot\delta_0 = -\frac{1}{a_s} + \frac12r_0k^2 + \dots
```

the second form being the effective-range expansion. Geometrically, `$a_s$` is where the zero-energy wavefunction outside the potential, extended as a straight line, crosses zero.

**Hard sphere** (radius `$a$`): `$u_0 = 0$` at `$r = a$` gives `$\delta_0 = -ka$` exactly, so `$a_s = a$` and `$\sigma \to 4\pi a^2$`, four times the geometric area. At high energy, `$\sigma \to 2\pi a^2$`: `$\pi a^2$` for the particles that hit, plus `$\pi a^2$` of diffraction.

**Attractive square well** (depth `$V_0$`, `$K_0^2 = 2mV_0/\hbar^2$`, `$K^2 = k^2 + K_0^2$`): matching at `$r = a$` gives

```math
\tan(ka + \delta_0) = \frac kK\tan(Ka), \qquad a_s = a\left(1 - \frac{\tan K_0a}{K_0a}\right)
```

- For a weak well `$a_s$` is small and negative (attractive, no bound state).
- As `$K_0a \to \pi/2$` a bound state is about to appear, and `$|a_s| \to \infty$`: the cross-section is enormous at low energy (a zero-energy resonance). With `$K_0a = 1.4$`, `$a_s = -3.14a$` and `$\sigma = 124a^2$`, ten times the hard-sphere value.
- Past `$\pi/2$`, `$a_s$` is large and positive, with a shallow bound state of energy `$\approx -\hbar^2/2ma_s^2$`. The deuteron (`$a_s = 5.4$` fm in the triplet state) is this case.
- Where `$\tan Ka = (K/k)\tan ka$` makes `$\delta_0 = \pi$` the s wave does not scatter at all: the **Ramsauer-Townsend** transparency of argon and xenon to electrons near 1 eV.

**Levinson's theorem.** `$\delta_l(0) - \delta_l(\infty) = N_l\pi$`, with `$N_l$` the number of bound states of angular momentum `$l$` (for the s wave, a zero-energy state adds one half). Phase shifts count bound states.

**Resonances.** If `$\delta_l$` rises quickly through `$\pi/2$` at `$E_R$`, then near it

```math
\sigma_l = \frac{4\pi(2l + 1)}{k^2}\frac{(\Gamma/2)^2}{(E - E_R)^2 + (\Gamma/2)^2}
```

(Breit-Wigner), a quasi-bound state of lifetime `$\hbar/\Gamma$` trapped behind the centrifugal barrier.

<div class="meaning">

<dl>
<dt>f(θ)</dt><dd>scattering amplitude, a length; dσ/dΩ = |f|²</dd>
<dt>ħq</dt><dd>momentum transfer, q = 2k sin(θ/2)</dd>
<dt>δ<sub>l</sub></dt><dd>phase shift of partial wave l: how far the potential pulls (δ &gt; 0) or pushes (δ &lt; 0) the radial wave</dd>
<dt>a<sub>s</sub></dt><dd>scattering length, −lim δ₀/k; σ → 4πa<sub>s</sub>²</dd>
<dt>Physical meaning</dt><dd>Born sees the potential through its Fourier transform, good when V is weak. Partial waves see it through a handful of phases, good when the energy is low. Exam questions usually sit in one of these two limits.</dd>
</dl>

</div>

## 5. Identical particles

When the two particles are identical, a detector at `$\theta$` cannot tell a particle scattered by `$\theta$` from one scattered by `$\pi - \theta$` in the centre-of-mass frame. Amplitudes add:

- spin-0 bosons: `$d\sigma/d\Omega = |f(\theta) + f(\pi - \theta)|^2$`. At 90° this is four times `$|f|^2$`, double the classical sum.
- spin-½ fermions, unpolarised: singlet (weight ¼) uses `$f(\theta) + f(\pi - \theta)$`, triplet (weight ¾) uses `$f(\theta) - f(\pi - \theta)$`, so `$d\sigma/d\Omega = |f(\theta)|^2 + |f(\pi - \theta)|^2 - \text{Re}[f^*(\theta)f(\pi - \theta)]$`. At 90° this is half the classical value.

Identical bosons scatter only in even partial waves and identical fermions in the triplet state only in odd ones, so at low energy (s wave only) spin-polarised fermions do not scatter at all, a fact used to make ultracold Fermi gases.

<div class="myth">

**"A hard sphere of radius a has cross-section πa², the area it blocks."** Classically yes, but waves diffract. At low energy the cross-section is `$4\pi a^2$`, because the s wave is scattered in all directions by the whole sphere. At high energy it is `$2\pi a^2$`, not `$\pi a^2$`: the extra `$\pi a^2$` is the forward diffraction peak that fills in the shadow, needed so that the optical theorem holds. Classical `$\pi a^2$` is never the quantum answer.

</div>

<div class="keypoints">

- `$\psi \to e^{ikz} + f e^{ikr}/r$`, `$d\sigma/d\Omega = |f|^2$`.
- Born: `$f_B = -\tfrac{m}{2\pi\hbar^2}\tilde V(\vec q)$`, `$q = 2k\sin(\theta/2)$`; central `$f_B = -\tfrac{2m}{\hbar^2q}\int rV\sin qr\,dr$`.
- Yukawa `$f_B = -\tfrac{2mV_0}{\hbar^2(\mu^2 + q^2)}$`, `$\sigma = 4\pi A^2/\mu^2(\mu^2 + 4k^2)$`; Coulomb gives Rutherford.
- `$f = \tfrac1k\sum(2l + 1)e^{i\delta_l}\sin\delta_l P_l$`, `$\sigma = \tfrac{4\pi}{k^2}\sum(2l + 1)\sin^2\delta_l = \tfrac{4\pi}{k}\text{Im}f(0)$`; unitarity limit `$4\pi(2l + 1)/k^2$`; `$l_{\max} \approx ka$`.
- `$\delta_0 \to -ka_s$`, `$\sigma \to 4\pi a_s^2$`. Hard sphere `$4\pi a^2$` (low), `$2\pi a^2$` (high). Square well `$a_s = a(1 - \tan K_0a/K_0a)$`, diverges at `$K_0a = \pi/2$`.
- Levinson `$\delta_l(0) - \delta_l(\infty) = N_l\pi$`; Ramsauer `$\delta_0 = \pi$`; Breit-Wigner peaks reach the unitarity limit.
- Identical bosons `$|f(\theta) + f(\pi - \theta)|^2$`; unpolarised fermions `$|f|^2 + |f'|^2 - \text{Re}f^*f'$`.

</div>

## Practise: exam questions on this lesson

NET Part C style, each with a full solution. More on the [CSIR NET Physics practice page](/learn/courses/csir-net-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="scattering-theory" data-exam="net" data-n="10"></div>

**Next:** [the Klein-Gordon and Dirac equations](/learn/courses/csir-net-physics/relativistic-quantum/), where the Yukawa potential reappears as the field of a massive particle. For bound and scattering states in one dimension, see [one-dimensional potentials](/learn/courses/gate-physics/one-dimensional-potentials/).
