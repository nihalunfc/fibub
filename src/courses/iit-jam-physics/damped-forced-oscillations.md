---
title: Damped and forced oscillations, resonance
seoTitle: Damped and forced oscillations, resonance (IIT JAM)
summary: 'How friction makes oscillations die away, what the logarithmic decrement and the quality factor Q measure, and how a driven oscillator responds: steady-state amplitude and phase, amplitude and power resonance, bandwidth and the LCR analogy.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'An oscillator is driven exactly at its natural frequency ω₀. What is the phase of its displacement relative to the driving force?'
    choices: ['It lags by 90°', 'It is in phase', 'It lags by 180°', 'It leads by 90°']
    ans: 0
    why: 'tan φ = 2βω/(ω₀² − ω²) is infinite at ω = ω₀, so φ = 90°. It is the velocity that is in phase with the force there, which is why the power absorbed is largest.'
  - q: 'Two successive maxima of a damped oscillation are 10 mm and 9 mm. What happens to the ratio of the next two?'
    choices: ['It is again 10 : 9', 'The difference is again 1 mm', 'It gets closer to 1 : 1', 'It depends on the starting amplitude']
    ans: 0
    why: 'With viscous damping the amplitude falls by the same factor e^(−βT) every cycle, so successive ratios are all equal. A constant difference is the signature of dry (Coulomb) friction instead.'
  - q: 'What does a quality factor Q = 100 tell you about an oscillator?'
    choices: ['It loses about 2π/100 of its energy per cycle and resonates in a band about f₀/100 wide', 'It oscillates 100 times per second', 'Its amplitude at resonance is 100 times smaller than the static stretch', 'It is overdamped']
    ans: 0
    why: 'Q = 2π × (energy stored)/(energy lost per cycle) = ω₀/(2β) = f₀/Δf. A high Q means light damping, a sharp resonance and a large amplitude at resonance (Q times the static stretch).'
sources:
  - 'A. P. French, Vibrations and Waves, MIT Introductory Physics Series (1971), chapters 3 and 4'
  - 'H. J. Pain and P. Rankin, Introduction to Vibrations and Waves (2015), chapters 2 and 3'
  - 'D. Kleppner and R. Kolenkow, An Introduction to Mechanics, 2nd ed. (2014), chapter 6'
  - 'IIT JAM Physics syllabus (Oscillations, Waves and Optics section), published by the organising IIT each year'
---

**Module 3 · about 45 minutes.** By the end you will be able to tell under-, critical and over-damping apart from the equation, use the logarithmic decrement and Q to describe energy loss, write down the steady-state amplitude and phase of a driven oscillator, and explain why displacement resonance, velocity resonance and the half-power width are three slightly different things.

<div class="bigidea">Friction makes an oscillator forget how it started; a periodic push then decides everything, and the response is huge only when the push keeps time with the oscillator's own rhythm.</div>

## 1. Adding friction

Real oscillators lose energy. The simplest model, good for motion through air or oil at low speed, is a drag force proportional to velocity, `$-b\dot x$`. Adding it to the spring of [lesson 3.1](/learn/courses/iit-jam-physics/simple-harmonic-motion/):

```math
m\ddot x + b\dot x + kx = 0 \qquad\Longleftrightarrow\qquad \ddot x + 2\beta\dot x + \omega_0^2x = 0, \qquad \beta = \frac{b}{2m},\ \ \omega_0 = \sqrt{\frac km}
```

We will use `$\beta$` (units s⁻¹) as the damping rate throughout. Some books write `$\gamma = b/m = 2\beta$`; always check which one a question uses, because examiners exploit the factor 2.

Try `$x = e^{st}$`: `$s^2 + 2\beta s + \omega_0^2 = 0$`, so `$s = -\beta \pm \sqrt{\beta^2 - \omega_0^2}$`. Everything depends on which is bigger, `$\beta$` or `$\omega_0$`:

| Case | Condition | Motion |
|---|---|---|
| Underdamped | `$\beta < \omega_0$` | `$x = Ae^{-\beta t}\cos(\omega_dt + \phi)$` with `$\omega_d = \sqrt{\omega_0^2 - \beta^2}$`: oscillates inside a shrinking envelope |
| Critically damped | `$\beta = \omega_0$` (`$b^2 = 4mk$`) | `$x = (C_1 + C_2t)e^{-\omega_0t}$`: fastest return without overshoot |
| Overdamped | `$\beta > \omega_0$` | sum of two decaying exponentials: creeps back, crosses zero at most once |

Note that `$\omega_d < \omega_0$`: damping makes each swing take **longer**.

**Worked example.** A 0.2 kg mass on a spring with `$k = 80$` N/m has `$b = 0.8$` kg/s. Then `$\omega_0 = \sqrt{400} = 20$` rad/s and `$\beta = 0.8/0.4 = 2$` s⁻¹. Since `$\beta < \omega_0$` it is underdamped, with `$\omega_d = \sqrt{400 - 4} = 19.90$` rad/s, barely below `$\omega_0$`. Light damping hardly changes the frequency; it mainly makes the amplitude decay.

## 2. Measuring damping: decrement, relaxation time and Q

For the underdamped case, successive maxima on the same side are one period `$T_d$` apart, so their ratio is always the same:

```math
\frac{x_n}{x_{n+1}} = e^{\beta T_d}, \qquad \delta = \ln\frac{x_n}{x_{n+1}} = \beta T_d \quad\text{(logarithmic decrement)}
```

Energy goes as amplitude squared, so it decays as `$e^{-2\beta t}$`: the energy falls by `$e$` in the **relaxation time** `$\tau = 1/(2\beta) = m/b$`, twice as fast as the amplitude.

The **quality factor** packs all this into one number:

```math
Q = \frac{\omega_0}{2\beta} = \frac{\sqrt{mk}}{b} \approx 2\pi\,\frac{\text{energy stored}}{\text{energy lost per cycle}}
```

<div class="meaning">

<dl>
<dt>β = b/2m</dt><dd>how fast the amplitude dies away: it falls by a factor e in 1/β seconds</dd>
<dt>δ = βT</dt><dd>the natural log of the ratio of one peak to the next</dd>
<dt>τ = m/b</dt><dd>the time for the stored energy to fall by a factor e</dd>
<dt>Q = ω₀/2β</dt><dd>roughly π times the number of swings before the amplitude falls by e</dd>
<dt>Physical meaning</dt><dd>A tuning fork (Q of thousands) rings for many seconds; a car's shock absorber (Q below 1) stops the bounce at once. Q is the one number that says which kind of oscillator you have.</dd>
</dl>

</div>

**Worked example.** A pendulum's amplitude falls from 6.0 cm to 4.5 cm in 5 complete swings. Then `$\delta = \ln(6/4.5)/5 = 0.2877/5 = 0.0575$` per swing. Since `$\delta = \beta T \approx \pi/Q$` for light damping, `$Q \approx \pi/0.0575 \approx 55$`. Its energy halves when the amplitude reaches `$6/\sqrt2 = 4.24$` cm, not 3 cm.

## 3. Driving it: the steady state

Now push the oscillator with a periodic force `$F_0\cos\omega t$`:

```math
\ddot x + 2\beta\dot x + \omega_0^2x = \frac{F_0}{m}\cos\omega t
```

The full solution is a **transient** (the free damped motion, which dies away as `$e^{-\beta t}$` and carries all memory of how you started) plus a **steady state** at the driving frequency. Here is the quickest way to the steady state:

<div class="steps">
<div class="step"><p><b>Go complex.</b> Replace cos ωt by e<sup>iωt</sup> and look for x = Ã e<sup>iωt</sup>, with Ã a complex number. Take the real part at the end.</p></div>
<div class="step"><p><b>Derivatives become multiplications.</b> d/dt gives a factor iω, so the equation becomes (ω₀² − ω² + 2iβω) Ã = F₀/m.</p></div>
<div class="step"><p><b>Solve for Ã.</b> Ã = (F₀/m) / (ω₀² − ω² + 2iβω): a complex number with a size and an angle.</p></div>
<div class="step"><p><b>The size is the amplitude.</b> A = (F₀/m) / √((ω₀² − ω²)² + 4β²ω²).</p></div>
<div class="step"><p><b>The angle is the lag.</b> x = A cos(ωt − φ) with tan φ = 2βω/(ω₀² − ω²), between 0 and π: the response always lags the force.</p></div>
</div>

```math
A(\omega) = \frac{F_0/m}{\sqrt{(\omega_0^2 - \omega^2)^2 + 4\beta^2\omega^2}}, \qquad \tan\phi = \frac{2\beta\omega}{\omega_0^2 - \omega^2}
```

Check the limits, which examiners love to ask:

- `$\omega \to 0$`: `$A \to F_0/k$` (the static stretch), `$\phi \to 0$`. The spring dominates.
- `$\omega = \omega_0$`: `$A = F_0/(2m\beta\omega_0) = Q\,F_0/k$`, `$\phi = \pi/2$`. The damper dominates.
- `$\omega \gg \omega_0$`: `$A \approx F_0/(m\omega^2)$`, `$\phi \to \pi$`. The mass dominates; it moves against the force.

**Worked example.** A 0.5 kg mass, `$k = 200$` N/m (`$\omega_0 = 20$` rad/s), `$b = 2$` kg/s (`$\beta = 2$` s⁻¹), driven by `$4\cos16t$` N.

1. `$F_0/m = 8$` m/s²; `$\omega_0^2 - \omega^2 = 400 - 256 = 144$`; `$2\beta\omega = 64$`.
2. `$A = 8/\sqrt{144^2 + 64^2} = 8/157.6 = 0.051$` m.
3. `$\tan\phi = 64/144 = 0.444$`, so the displacement lags by `$24.0^\circ$`.

<div class="problem" data-problem="steady-amplitude"></div>

## 4. Resonance: three peaks that are almost the same

Move the sliders below. The amplitude curve rises to a peak and the phase swings from 0 to 180°; the sharper the peak, the higher the Q.

<figure class="fig" data-fig="resonance-curve"><figcaption>Top: amplitude (solid) and absorbed power (dashed, scaled to the same height at ω₀). Bottom: how far the displacement lags the force. Low Q: no peak at all. High Q: a tall, narrow spike at ω₀.</figcaption></figure>

There are three "resonances", and JAM asks you to keep them apart:

| What is largest | Where | Value |
|---|---|---|
| Displacement amplitude | `$\omega_r = \sqrt{\omega_0^2 - 2\beta^2}$` (exists only if `$Q > 1/\sqrt2$`) | `$F_0/(2m\beta\sqrt{\omega_0^2 - \beta^2})$` |
| Velocity amplitude and absorbed power | exactly `$\omega_0$`, for any damping | `$v_0 = F_0/b$`, `$\langle P\rangle = F_0^2/(2b)$` |
| Free oscillation frequency (not a resonance) | `$\omega_d = \sqrt{\omega_0^2 - \beta^2}$` | |

So `$\omega_r < \omega_d < \omega_0$`. For light damping all three are almost equal, which is why textbooks often blur them; at `$Q \approx 1$` they are clearly different.

**Bandwidth.** The power curve falls to half its peak at two frequencies whose difference is exactly `$\Delta\omega = 2\beta$`. Hence

```math
Q = \frac{\omega_0}{\Delta\omega} = \frac{f_0}{\Delta f}
```

At those half-power points the phase lag is exactly `$45^\circ$` and `$135^\circ$`.

**Worked example.** For the oscillator above (`$\omega_0 = 20$`, `$\beta = 2$`, `$F_0 = 4$` N, `$b = 2$` kg/s): `$Q = 20/4 = 5$`; the half-power band is `$\Delta\omega = 4$` rad/s wide; the power at resonance is `$F_0^2/(2b) = 16/4 = 4$` W; the amplitude peaks at `$\sqrt{400 - 8} = 19.80$` rad/s with height `$8/(4\sqrt{396}) = 0.1005$` m, a hair above the `$0.1000$` m reached at `$\omega_0$`.

<div class="myth">

**"At resonance the displacement is in phase with the force."** It is not: at `$\omega = \omega_0$` the displacement lags by exactly `$90^\circ$`. It is the *velocity* that is in phase with the force, which is exactly the condition for the force to do the most work. Think of pushing a child on a swing: you push hardest as the swing passes the bottom moving away from you (fastest), not when it is furthest away.

</div>

## 5. Energy in the steady state

In the steady state the driver's work per cycle exactly replaces what the damper burns:

```math
W_{\text{cycle}} = \oint b\dot x^2\,dt = \pi b\omega A^2
```

The time-averaged kinetic energy is `$\tfrac14m\omega^2A^2$` and the potential energy `$\tfrac14kA^2$`: they are equal only at `$\omega = \omega_0$`. Below resonance the spring holds more energy, above it the mass does.

## 6. The same equation everywhere

A series LCR circuit with an AC source obeys `$L\ddot q + R\dot q + q/C = \mathcal E_0\cos\omega t$`. Match term by term: `$m \to L$`, `$b \to R$`, `$k \to 1/C$`, `$F_0 \to \mathcal E_0$`. So `$\omega_0 = 1/\sqrt{LC}$` and `$Q = (1/R)\sqrt{L/C}$`, and current resonance at `$\omega_0$` is the velocity resonance above.

**Worked example.** `$L = 20$` mH, `$C = 2\ \mu$`F, `$R = 5\ \Omega$`: `$\omega_0 = 1/\sqrt{4\times10^{-8}} = 5000$` rad/s and `$Q = \tfrac15\sqrt{10^4} = 20$`.

The [Forced oscillations](/learn/forced-oscillations/) tool lets you watch the transient die and the steady state take over, and [LCR phasors](/learn/lcr-phasors/) shows the electrical version as rotating arrows. When two oscillators are joined, energy sloshes between them: try the [Coupled oscillators](/science/coupled-oscillators/) simulation before lesson 3.3.

**Dry friction is different.** A block sliding on a rough floor feels a force of fixed size `$\mu mg$`. Each half-swing is then SHM about a shifted centre, and the amplitude falls by the same **amount**, `$4\mu mg/k$`, every cycle (linear decay), until a turning point lands where the spring cannot beat static friction. Equal *ratios* mean viscous damping; equal *differences* mean dry friction.

<div class="keypoints">

- `$m\ddot x + b\dot x + kx = 0$`: underdamped if `$b^2 < 4mk$` (`$\beta < \omega_0$`), critical if equal, overdamped if greater. `$\omega_d = \sqrt{\omega_0^2 - \beta^2}$`, a little below `$\omega_0$`.
- Amplitude decays as `$e^{-\beta t}$`, energy as `$e^{-2\beta t}$`. Decrement `$\delta = \beta T_d$`; relaxation time `$\tau = m/b$`.
- `$Q = \omega_0/2\beta = \sqrt{mk}/b = f_0/\Delta f \approx 2\pi E/\Delta E_{\text{cycle}}$`.
- Steady state: `$A = (F_0/m)/\sqrt{(\omega_0^2 - \omega^2)^2 + 4\beta^2\omega^2}$`, `$\tan\phi = 2\beta\omega/(\omega_0^2 - \omega^2)$`; limits `$F_0/k$`, `$QF_0/k$`, `$F_0/m\omega^2$`.
- Velocity and power resonance at exactly `$\omega_0$` (phase `$90^\circ$`); displacement peak at `$\sqrt{\omega_0^2 - 2\beta^2}$`, only if `$Q > 1/\sqrt2$`. Half-power width `$2\beta$`, phases `$45^\circ$` and `$135^\circ$` there.
- LCR: `$m \to L$`, `$b \to R$`, `$k \to 1/C$`. Dry friction gives a linear, not exponential, decay.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. More on the [damped and forced oscillations practice page](/learn/courses/iit-jam-physics/practice/damped-forced-oscillations/).

<div class="qbank" data-bank="physics" data-topics="damped-forced-oscillations" data-exam="jam" data-n="10"></div>

**Next:** lesson 3.3 adds oscillations together (beats, Lissajous figures and coupled oscillators), and lesson 3.4 lets the oscillation travel as a wave. In electronics, resonance reappears in filters and oscillator circuits, which the [GATE Physics course](/learn/courses/gate-physics/) covers in its electronics module.
