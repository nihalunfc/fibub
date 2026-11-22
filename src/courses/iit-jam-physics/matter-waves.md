---
title: Matter waves and the uncertainty principle
seoTitle: Matter waves and uncertainty for IIT JAM Physics
summary: 'De Broglie wavelengths for electrons, neutrons and fast particles, the experiments that prove matter diffracts, phase and group velocity, how a wave packet is built, and how to use the uncertainty principle for quick, reliable estimates.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: 'An electron and a proton move with the same speed. Which has the longer de Broglie wavelength?'
    choices: ['The electron, because its momentum is smaller', 'The proton, because it is heavier', 'Both the same, because the speeds are equal', 'It depends on their charges']
    ans: 0
    why: 'λ = h/p = h/mv. At the same speed the lighter electron has about 1836 times less momentum, so a wavelength about 1836 times longer.'
  - q: 'The voltage accelerating an electron beam is multiplied by 9 (non-relativistic). What happens to the de Broglie wavelength?'
    choices: ['It becomes one third', 'It becomes one ninth', 'It triples', 'It is unchanged']
    ans: 0
    why: 'λ = h/√(2meV) ∝ 1/√V, and 1/√9 = 1/3.'
  - q: 'Why does the uncertainty principle not stop us predicting the path of a cricket ball?'
    choices: ['Because ħ is so small that the limits are far below anything we could measure for a heavy object', 'Because it applies only to charged particles', 'Because the ball is not moving fast enough', 'Because it only applies inside atoms']
    ans: 0
    why: 'Δx·Δv ≥ ħ/2m. For a 0.16 kg ball ħ/2m is about 3 × 10⁻³⁴ m²/s, so fixing the position to a nanometre leaves a speed uncertainty of about 10⁻²⁵ m/s.'
sources:
  - 'A. Beiser, Concepts of Modern Physics, 6th ed. (2003), chapter 3: wave properties of particles'
  - 'K. S. Krane, Modern Physics, 3rd ed. (2012), chapter 4: the wavelike properties of particles'
  - 'D. J. Griffiths and D. F. Schroeter, Introduction to Quantum Mechanics, 3rd ed. (2018), sections 1.6 and 2.4'
  - 'IIT JAM Physics syllabus (Modern Physics section), published by the organising IIT each year'
---

**Module 6 · about 40 minutes.** By the end you will be able to find the de Broglie wavelength of any particle (slow, thermal or relativistic) without unit slips, explain electron and neutron diffraction, tell phase velocity from group velocity, see why a wave packet has an uncertainty built in, and use `$\Delta x\,\Delta p \ge \hbar/2$` and `$\Delta E\,\Delta t \gtrsim \hbar/2$` for fast estimates.

<div class="bigidea">Every moving particle has a wavelength h/p. A particle that is somewhere definite must be a short packet of waves, and a short packet needs many wavelengths, so position and momentum can never both be sharp.</div>

## 1. De Broglie's guess

[Lesson 6.1](/learn/courses/iit-jam-physics/photons/) showed that light, a wave, also comes in particles with `$p = h/\lambda$`. In 1924 de Broglie turned this round: a particle of momentum `$p$` should have a wave with

```math
\lambda = \frac{h}{p}
```

For everyday objects the wavelength is absurdly small (a 0.1 kg ball at 10 m/s: `$6.6\times10^{-34}$` m), so nothing can diffract them. For an electron it is about the size of an atom, which is exactly where we see quantum behaviour.

Pick n = 1 to 6 and count the wavelengths round the orbit, then switch to 'Any wavelength' and drag to a fraction.

<figure class="fig" data-fig="@qm-bohr-standing"><figcaption>Only a whole number of wavelengths closes up on itself, which is the same as L = nħ. Between the whole numbers the wave cancels itself and no orbit survives.</figcaption></figure>

How you get `$p$` depends on what you are told:

| You know | Momentum | Handy form |
|---|---|---|
| speed `$v$` (slow) | `$p = mv$` | |
| kinetic energy `$K$` (slow) | `$p = \sqrt{2mK}$` | electron: `$\lambda \approx 1.23/\sqrt{K/\text{eV}}$` nm |
| accelerating voltage `$V$`, charge `$q$` | `$p = \sqrt{2mqV}$` | electron: `$\lambda \approx 1.23/\sqrt{V}$` nm |
| temperature `$T$` (thermal) | `$p = \sqrt{2m\cdot\tfrac32k_BT}$` (or `$k_BT$`: read the question) | neutron: `$\lambda \approx 0.0286/\sqrt{K/\text{eV}}$` nm |
| `$K$` comparable to `$mc^2$` | `$pc = \sqrt{K^2 + 2Kmc^2}$` | `$\lambda = hc/pc$`, `$hc = 1240$` MeV fm |

<div class="meaning">

<dl>
<dt>λ = h/p</dt><dd>bigger momentum, shorter wave; the wave is what decides where the particle is likely to be found</dd>
<dt>√(2mK)</dt><dd>the momentum of a slow particle with kinetic energy K</dd>
<dt>1.23/√V nm</dt><dd>an electron accelerated through V volts: 0.123 nm at 100 V, comparable to atomic spacings</dd>
<dt>Physical meaning</dt><dd>a particle is guided by a wave whose intensity |ψ|² gives the probability of finding it at each place. The wave is not a ripple in any material.</dd>
</dl>

</div>

**Worked example.** Find the de Broglie wavelength of (a) an electron accelerated through 400 V, (b) an alpha particle accelerated through the same voltage.

1. Electron: `$\lambda = 1.23/\sqrt{400} = 1.23/20 = 0.0614$` nm.
2. Alpha: charge `$2e$`, mass `$4m_p = 7344m_e$`. `$\lambda \propto 1/\sqrt{mq}$`, so `$\lambda_\alpha = 0.0614/\sqrt{7344\times2} = 0.0614/121.2 = 5.1\times10^{-4}$` nm.
3. Equal voltage does not mean equal wavelength: the heavier, doubly charged particle gains more momentum.

<div class="problem" data-problem="de-broglie-electron"></div>

**Fast particles.** Once `$K$` is more than about 2% of `$mc^2$` (about 20 keV for electrons), the slow-particle formula is off by more than 1%. Electron microscopes run at 100 to 300 kV and must use `$pc = \sqrt{K^2 + 2Kmc^2}$`. Example: at `$K = 1$` MeV, `$pc = \sqrt{1 + 1.022} = 1.42$` MeV and `$\lambda = 1240/1.42 = 872$` fm `$= 0.87$` pm, against 1.23 pm from the slow formula.

## 2. Matter really diffracts

- **Davisson and Germer (1927)** fired slow electrons at a nickel crystal. The scattered electrons came out strongly at particular angles, as X-rays do from a crystal, with a wavelength exactly `$h/p$`. G. P. Thomson saw rings when fast electrons passed through thin foils.
- **Neutron diffraction.** Thermal neutrons from a reactor have `$\lambda \approx 0.1$`-`$0.2$` nm and diffract from crystals; because they are neutral and have a magnetic moment, they reveal light atoms and magnetic order that X-rays miss.
- **Two slits, one electron at a time.** With a very weak beam each electron lands as one dot; after thousands of dots, interference fringes appear with spacing `$\lambda D/d$`, as for light. Even large molecules such as C₆₀ show fringes.

Bragg's law `$2d\sin\theta = n\lambda$` and the grating rule `$d\sin\theta = n\lambda$` work for matter waves unchanged; only the wavelength is worked out differently.

Press Play and watch electrons arrive one at a time, then change the slit gap and wavelength and switch on 'Watch which slit'.

<figure class="fig" data-fig="@qm-double-slit"><figcaption>Each electron makes one dot, yet the pile of dots draws fringes of spacing λL/d. Looking at which slit it used washes the fringes out.</figcaption></figure>

**Worked example.** Electrons accelerated through 150 V hit a crystal surface with rows 0.25 nm apart. At what angle is the first-order beam? `$\lambda = 1.23/\sqrt{150} = 0.100$` nm, `$\sin\varphi = 0.100/0.25 = 0.40$`, `$\varphi = 23.6^\circ$`.

## 3. Phase velocity and group velocity

A single wave `$e^{i(kx - \omega t)}$` with `$p = \hbar k$` and `$E = \hbar\omega$` has crests that move at the **phase velocity** `$v_p = \omega/k$`. A localised particle is a **packet**, a sum of many such waves, and the packet (the bump of probability) moves at the **group velocity** `$v_g = d\omega/dk$`.

```math
v_g = \frac{d\omega}{dk} = \frac{dE}{dp} = v \quad\text{(always the particle speed)}
```

The phase velocity depends on what you call the energy:

- with `$E = p^2/2m$`: `$v_p = v/2$`;
- with the full relativistic `$E = \gamma mc^2$`: `$v_p = c^2/v > c$`, so `$v_pv_g = c^2$`.

Neither is a problem: the phase carries no signal. What you can detect, the packet, moves at `$v_g = v$`, as it must.

## 4. Building a packet: where uncertainty comes from

Add waves with wave numbers spread over a range `$\Delta k$` around `$k_0$`. Near `$x = 0$` they are all in step and add up; further away they drift out of step and cancel. The result is a packet of length about `$1/\Delta k$`.

<figure class="fig" data-fig="packet-build"><figcaption>A packet made of plane waves with a Gaussian spread of wave numbers. Make Δk smaller and the packet grows longer; switch to "some parts" to see the individual waves in step only near the centre.</figcaption></figure>

For the best possible (Gaussian) shape, `$\Delta x\,\Delta k = 1/2$` exactly, and any other shape does worse. Multiply by `$\hbar$` and use `$p = \hbar k$`:

```math
\Delta x\,\Delta p_x \ge \frac{\hbar}{2}
```

This is **Heisenberg's uncertainty principle**. Here `$\Delta$` means the standard deviation of the results over many identically prepared particles. It is a property of the wave itself, not of clumsy instruments. It links each coordinate only with its own momentum: `$\Delta x$` and `$\Delta p_y$` can both be small.

A free packet also **spreads**: its components move at different speeds. A narrow packet has a wide spread of momenta, so it spreads fast: an electron packet 0.1 nm wide doubles in width in about `$3\times10^{-16}$` s. Its momentum spread, however, never changes. The [Wave packet tunnelling](/science/wave-packet/) tool shows a packet moving and spreading in real time.

<div class="problem" data-problem="uncertainty-speed"></div>

## 5. The energy-time relation

A state that lasts only a time `$\tau$` cannot have a perfectly sharp energy:

```math
\Delta E\,\tau \gtrsim \frac{\hbar}{2}
```

This is why spectral lines have a **natural width**. An atomic level living 10 ns has `$\Delta E \sim \hbar/\tau \approx 7\times10^{-8}$` eV, a frequency width `$\Delta\nu = \Delta E/h$` of roughly 10 MHz. Short-lived particles in nuclear physics have widths of MeV for the same reason. (Time is not an operator, so this relation means "lifetime times energy spread", not a measurement of time.)

Drag the time slider (or press Play) for the electron, then choose the dust grain and compare the time unit τ.

<figure class="fig" data-fig="@qm-wavepacket-spread"><figcaption>The packet widens but its momentum spread stays fixed, so Δx·Δp starts at its minimum ħ/2 and only grows. A heavy grain spreads so slowly we never notice.</figcaption></figure>

## 6. Estimating with the uncertainty principle

Exam questions often say "estimate". The trick: if a particle is confined to a region of size `$a$`, its momentum is at least of order `$\hbar/a$`, so its kinetic energy is at least of order `$\hbar^2/2ma^2$` (slow) or `$\hbar c/a$` (ultra-relativistic).

**Worked example: the size of the hydrogen atom.** Put the electron at distance `$r$` with `$p \sim \hbar/r$`:

```math
E(r) = \frac{\hbar^2}{2mr^2} - \frac{e^2}{4\pi\varepsilon_0 r}
```

1. Squeezing in (small `$r$`) raises the kinetic term; moving out weakens the attraction. The minimum is the compromise.
2. `$dE/dr = 0$` gives `$r = 4\pi\varepsilon_0\hbar^2/(me^2) = a_0 = 0.053$` nm.
3. Putting it back: `$E = -13.6$` eV. The estimate happens to give the exact answer; it explains why atoms do not collapse.

**Worked example: no electrons in nuclei.** Confine an electron to 10 fm: `$pc \sim \hbar c/\Delta x = 197\text{ MeV fm}/10\text{ fm} \approx 20$` MeV. That is far above the electron's rest energy, so `$K \approx 20$` MeV, much more than the few MeV of beta decay. Electrons cannot live in nuclei; they are created at the moment of decay.

<div class="myth">

**"The uncertainty principle means our instruments disturb the particle."** Heisenberg's microscope story (a photon kicking the electron) is only an illustration. The real reason is that a quantum state is a wave, and no wave is both short (sharp `$x$`) and of a single wavelength (sharp `$p$`). Even with no measurement at all, the spreads obey `$\Delta x\,\Delta p \ge \hbar/2$`.

**"Equal kinetic energy means equal wavelength."** No: `$\lambda = h/\sqrt{2mK}$` depends on the mass. Equal *momentum* means equal wavelength. A photon and an electron of the same energy have very different wavelengths (`$hc/E$` against `$h/\sqrt{2mE}$`).

</div>

<div class="keypoints">

- `$\lambda = h/p$`; slow particles `$p = \sqrt{2mK} = \sqrt{2mqV}$`; electron `$\lambda \approx 1.23/\sqrt V$` nm; relativistic `$pc = \sqrt{K^2 + 2Kmc^2}$`.
- Electron, neutron and molecule diffraction use the optical formulas with `$\lambda = h/p$`.
- Group velocity `$d\omega/dk = dE/dp$` = particle speed; phase velocity `$v/2$` (non-relativistic) or `$c^2/v$` (with rest energy).
- A packet of length `$\Delta x$` needs `$\Delta k \gtrsim 1/(2\Delta x)$`: `$\Delta x\,\Delta p_x \ge \hbar/2$` (Gaussian: equality). Free packets spread; their momentum spread does not change.
- Lifetime and energy width: `$\Delta E \sim \hbar/\tau$`; frequency width `$\Delta\nu = 1/(4\pi\tau)$` at the minimum.
- Confinement to size `$a$` means `$K \gtrsim \hbar^2/2ma^2$` (slow) or `$\hbar c/a$` (fast): atom sizes, zero-point energies, no electrons in nuclei.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. There are more on the [matter waves practice page](/learn/courses/iit-jam-physics/practice/matter-waves/).

<div class="qbank" data-bank="physics" data-topics="matter-waves" data-exam="jam" data-n="10"></div>

**Next:** [lesson 6.3](/learn/courses/iit-jam-physics/schrodinger-equation/) writes down the equation these waves obey and solves it for wells, steps and barriers. The GATE Physics course derives [the general uncertainty relation from commutators](/learn/courses/gate-physics/commutators-uncertainty/).
