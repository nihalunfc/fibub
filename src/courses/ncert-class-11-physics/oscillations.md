---
title: Oscillations
seoTitle: 'Oscillations Class 11 notes: SHM, pendulum, resonance'
summary: 'Class 11 Oscillations with animations: SHM and the circle, velocity, acceleration, energy, spring and pendulum, damped and forced oscillations and resonance.'
minutes: 80
updated: 2026-11-23
quiz:
  - q: 'A block of mass m on a spring of stiffness k has time period T. If the mass is made 4m, the new time period is:'
    choices: ['T/2', 'T', '2T', '4T']
    ans: 2
    why: 'T = 2π√(m/k) is proportional to √m, so 4 times the mass doubles the period.'
  - q: 'A particle in SHM of amplitude A has a speed equal to half its maximum speed. Its displacement is:'
    choices: ['A/2', '√3 A/2', 'A/√2', 'A']
    ans: 1
    why: 'v = ω√(A² − x²) = ωA/2 gives A² − x² = A²/4, so x = (√3/2)A.'
  - q: 'A simple pendulum is taken to the Moon, where g is about one sixth of its value on Earth. Its time period:'
    choices: ['becomes 6 times', 'becomes √6 times', 'is the same', 'becomes 1/6 times']
    ans: 1
    why: 'T = 2π√(L/g) is proportional to 1/√g, so a g six times smaller makes T √6 times longer.'
sources:
  - 'NCERT Class 11 Physics, Chapter 13 “Oscillations” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Large-angle pendulum period series: Abramowitz and Stegun, Handbook of Mathematical Functions, section 17.3 (complete elliptic integral)'
  - 'Resonance of the Tacoma Narrows bridge (1940): Billah and Scanlan (1991), American Journal of Physics 59(2), 118-124 (history box)'
---

**Physics · Class 11 · Chapter 13 · about 80 minutes.** By the end you will be able to describe any oscillation by its amplitude, period and phase, write and use the equations of simple harmonic motion, find the period of a spring and a pendulum, follow the exchange of energy, and explain damping and resonance.

<div class="bigidea">Many things go back and forth: a swing, a guitar string, an atom in a crystal, the pistons of a car. The simplest and most important kind is simple harmonic motion (SHM), where the force that pulls the object back is proportional to how far it has been pushed away. Then the motion is a smooth sine curve, its period depends only on the object and its spring, not on how big the swing is, and everything else follows from that one rule: restoring force ∝ displacement.</div>

## 1. Periodic and oscillatory motion

A motion that repeats itself after equal intervals of time is **periodic**: the Earth going round the Sun, the hands of a clock, the beating of your heart. If the object also moves to and fro about a fixed centre (the **mean position**), it is an **oscillation** or vibration: a child on a swing, a tabla skin after a strike, a mass on a spring.

Words to know, with the swing as the example:

- **Displacement x**: distance of the object from the mean position, with a sign (positive to the right, negative to the left).
- **Amplitude A**: the largest displacement. Pull the swing back farther and A is bigger.
- **Time period T**: the time for one complete oscillation, from the right end, to the left end and back again. **Frequency** `$f = 1/T$`, the number of oscillations per second, in hertz (Hz).
- **Angular frequency** `$\omega = 2\pi f = 2\pi/T$` in radians per second.
- **Phase**: the number (ωt + φ) that tells where in its cycle the oscillation is; **φ** is the phase constant fixed by where the motion starts.

<figure class="fig" data-fig="c11p-osc-phase"><figcaption>The blue wave is x = cos(πt) (A = 1, T = 2 s). Change the amplitude, period and phase of the orange one. A positive φ means the orange peaks come earlier (it leads); φ = 180° puts it exactly opposite.</figcaption></figure>

## 2. Simple harmonic motion

An oscillation is **simple harmonic** when the restoring force is proportional to the displacement and always points back to the mean position:

```math
F = -kx \quad\Longrightarrow\quad a = -\omega^2x, \qquad \omega^2 = \frac km
```

<div class="meaning">

<dl>
<dt>F = −kx</dt><dd>the minus sign says the force points opposite to the displacement</dd>
<dt>k</dt><dd>force constant (stiffness): force per metre of displacement, N/m</dd>
<dt>ω</dt><dd>angular frequency, ω = √(k/m); a stiffer or lighter system oscillates faster</dd>
<dt>Physical meaning</dt><dd>The farther you pull, the harder it pulls back, like stretching a rubber band. Because the pull-back grows with distance, the time for a swing does not depend on how far you pulled (for SHM).</dd>
</dl>

</div>

Solving `$a = -\omega^2 x$` gives displacement as a sine or cosine curve:

```math
x(t) = A\cos(\omega t + \varphi)
```

Look at one full cycle of a block on a spring to see how force, velocity and acceleration change from end to end:

<div class="steps" data-fig="c11p-osc-cycle">
<div class="step">At the right end x = +A the block stops for an instant: v = 0. The spring is most stretched, so the force and acceleration are largest and point left.</div>
<div class="step">At the middle x = 0 the spring is relaxed: F = 0 and a = 0. The block is moving fastest, to the left.</div>
<div class="step">At the left end x = −A it stops again: v = 0. The spring is most compressed, so force and acceleration are largest and point right.</div>
<div class="step">At the middle again, moving right with the maximum speed, and then back to the right end. That completes one oscillation, taking one period T.</div>
<div class="step">Run the whole cycle. The acceleration always points opposite to x, and its size is ω²|x|: that is the definition of SHM.</div>
</div>

<div class="myth">

**“At the end of the swing the velocity and the acceleration are both zero.”** At an end point the velocity is zero, but the acceleration is at its biggest (ω²A), because the restoring force is greatest there. At the middle it is the other way round: the speed is greatest and the acceleration is zero.

</div>

Not every back-and-forth motion is SHM. A ball bouncing on the floor is periodic but not SHM (the force is not proportional to displacement). The key test is: is a = −(positive constant) × x?

## 3. SHM and uniform circular motion

Imagine a point P moving round a circle of radius A at constant angular speed ω. Shine a light from the side and look at the shadow of P on a vertical wall: the shadow goes up and down in exactly the manner of SHM. This **reference circle** gives the equations of SHM in a few lines.

<div class="steps" data-fig="c11p-osc-circle">
<div class="step">P moves on a circle of radius A with constant angular speed ω. After time t it has turned through the angle (ωt + φ). One turn takes T = 2π/ω.</div>
<div class="step">The shadow (projection) of P on the vertical line has height x = A sin(ωt + φ): this is SHM (a cosine is the same curve shifted by a quarter turn). The graph on the right is x against time.</div>
<div class="step">P moves with speed Aω along the tangent. The vertical part of this velocity is the velocity of the shadow: v = Aω cos(ωt + φ) = ω√(A² − x²).</div>
<div class="step">P has an acceleration Aω² pointing to the centre. Its vertical part is the shadow’s acceleration: a = −Aω² sin(ωt + φ) = −ω²x.</div>
<div class="step">The shadow’s acceleration is proportional to its displacement and opposite to it: the shadow performs SHM, with the time period T = 2π/ω.</div>
</div>

Taking x = A cos(ωt + φ) the three results are:

```math
x = A\cos(\omega t+\varphi), \qquad v = -\omega A\sin(\omega t+\varphi) = \pm\omega\sqrt{A^2-x^2}, \qquad a = -\omega^2 x
```

So the maximum speed is `$v_{\max} = \omega A$` (at the middle) and the maximum acceleration is `$a_{\max} = \omega^2 A$` (at the ends). The speed in terms of position: v = ω√(A² − x²).

<div class="problem" data-problem="c11p-osc-vmax"></div>

<div class="problem" data-problem="c11p-osc-x"></div>

The tool below lets you move the reference point round the circle and see the three curves at once:

<!--fig:tool shm-circle-->

<figure class="fig" data-fig="@wt-shm-graphs"><figcaption>A block on a spring with its x, v and a curves, and a bar showing kinetic and potential energy. The velocity curve runs a quarter cycle ahead of x, and a is the mirror image of x.</figcaption></figure>

## 4. Energy in simple harmonic motion

The kinetic energy at displacement x is `$K = \tfrac12mv^2 = \tfrac12m\omega^2(A^2-x^2) = \tfrac12k(A^2-x^2)$`, using ω² = k/m. The potential energy stored in the spring is `$U = \tfrac12kx^2$`. Their sum is constant:

```math
E = K + U = \tfrac12kA^2 = \tfrac12m\omega^2A^2
```

At the middle all the energy is kinetic, at the ends all potential. The kinetic and potential energies each swing between 0 and E, twice per oscillation period, and each averages E/2. Double the amplitude and the energy becomes four times.

<figure class="fig" data-fig="c11p-osc-energy"><figcaption>The ball rolls in the parabola U = ½kx². The vertical bar splits the constant total energy E into U (lower, orange) and K (upper, green). Change the amplitude to see E change as A².</figcaption></figure>

<div class="problem" data-problem="c11p-osc-ke"></div>

## 5. Some systems executing SHM

### The spring-mass system

A block of mass m on a smooth surface is joined to a spring of stiffness k. If you pull it a distance x the spring pulls back with F = −kx, so a = −(k/m)x, which is SHM with ω² = k/m:

```math
T = 2\pi\sqrt{\frac mk}
```

A bigger mass is slower; a stiffer spring is faster. The period does not depend on the amplitude. A hanging spring (mass vertical) has the same T, only its mean position shifts down by mg/k. Two identical springs of stiffness k joined **in series** behave as one weaker spring `$k_{\text{eff}} = k/2$` (each stretches by the same force, so the total stretch doubles). **In parallel** they share the load, `$k_{\text{eff}} = 2k$`. In general, series: `$1/k_{\text{eff}} = 1/k_1 + 1/k_2$`; parallel: `$k_{\text{eff}} = k_1 + k_2$`.

<figure class="fig" data-fig="c11p-osc-spring"><figcaption>Choose one spring, two in series or two in parallel, and change the mass and stiffness. The animation runs at the real period.</figcaption></figure>

<div class="problem" data-problem="c11p-osc-period"></div>

<div class="problem" data-problem="c11p-osc-series"></div>

Try a vertical spring, change the mass and look at the energy: [Spring-mass tool](/learn/spring-mass/). The bobbing of a bus on its springs, and the shock absorbers of a bike, are real examples.

### The simple pendulum

A small heavy bob on a light string of length L is pulled aside by an angle θ and let go. The weight mg has a component mg sin θ along the arc, always towards the lowest point:

```math
F = -mg\sin\theta \approx -mg\theta = -\frac{mg}{L}\,x \quad(\text{small }\theta,\ x = L\theta)
```

This has the form F = −kx with `$k = mg/L$`, so `$\omega^2 = k/m = g/L$` and

```math
T = 2\pi\sqrt{\frac Lg}
```

The mass of the bob does not appear (a heavier bob has a larger pull and also a larger inertia, which cancel). The period grows as √L and falls as √g. The approximation sin θ ≈ θ is good below about 10° to 15°; for 90° the true period is 18 % longer. Use the figure to see this; change the place, from Earth to the Moon or Jupiter.

<figure class="fig" data-fig="c11p-osc-pendulum"><figcaption>Choose a place and change the length and the amplitude. The readout shows the small-angle formula and the slightly longer true period for large swings.</figcaption></figure>

<div class="problem" data-problem="c11p-osc-pendulum"></div>

<div class="problem" data-problem="c11p-osc-g"></div>

Run your own swing experiment with real readings in the pendulum lab:

<!--fig:tool pendulum-lab-->

A “seconds pendulum” has T = 2 s, which on Earth needs a length of about 1 m. Also see the [Pendulum analyser](/science/pendulum-analyser/) for large swings and a dependence on the angle, and [Coupled oscillators](/science/coupled-oscillators/) for two pendulums joined by a spring that pass the energy back and forth.

## 6. Damped simple harmonic motion

In real life a swing slows down and stops, because of air drag and friction. A resistive force `$F_d = -bv$` (proportional to the speed) takes energy away, and the amplitude falls with time. For light damping:

```math
x(t) = Ae^{-bt/2m}\cos(\omega' t + \varphi), \qquad \omega' = \sqrt{\frac km-\frac{b^2}{4m^2}}
```

The amplitude falls exponentially inside an **envelope** `$Ae^{-bt/2m}$`, and the damped frequency ω′ is slightly smaller than the free frequency ω = √(k/m). If b is larger than the critical value `$2\sqrt{km}$` the system does not oscillate at all (it just creeps back), and at b = 2√(km) it returns fastest without overshoot: **critical damping**, which is what a door closer or a car’s shock absorber is designed to give.

<figure class="fig" data-fig="c11p-osc-damped"><figcaption>Slide the damping constant from 0 (never stops) through light damping (oscillations in a shrinking envelope), critical (about 10 kg/s here) and heavy damping (slow creep).</figcaption></figure>

<div class="problem" data-problem="c11p-osc-damp"></div>

The mechanical energy `$E = \tfrac12kA^2$` falls as the square of the amplitude, `$E(t) = E_0 e^{-bt/m}$`; the lost energy appears as heat in the surroundings.

## 7. Forced oscillations and resonance

If you keep pushing the swing, the child gets a **forced oscillation**: after a short time the system oscillates at the frequency ω<sub>d</sub> of the **driver**, not at its own natural frequency ω₀, and with a steady amplitude. The amplitude is small when the driving frequency is far from ω₀, and it is largest when it is close to it:

```math
\omega_d \approx \omega_0 \;\Longrightarrow\; \text{resonance: a large amplitude}
```

This is **resonance**. Lighter damping makes the peak taller and sharper. Pushing a swing at its own natural rhythm builds up a big swing with small pushes; pushing at a different rhythm cancels itself. Other examples: tuning a radio (the circuit is made resonant with the station frequency), a microwave oven, the sympathetic ringing of a glass to a singer, and the sway of a footbridge or building in an earthquake or wind when the frequencies match. This is why soldiers break step when crossing a bridge.

<figure class="fig" data-fig="@wt-driven-oscillator"><figcaption>A damped oscillator driven from rest: the transient dies out and the steady response appears at the driving frequency. Sweep the drive across the natural frequency to climb the resonance curve; the phase lag swings from 0 to 180°.</figcaption></figure>

Also try the [Forced oscillations tool](/learn/forced-oscillations/).

<div class="history">

<ul class="timeline">
<li><b>1581</b> Galileo (it is said) notices that a swinging lamp in the cathedral at Pisa takes the same time for large and small swings.</li>
<li><b>1656</b> Christiaan Huygens builds the first pendulum clock.</li>
<li><b>1678</b> Robert Hooke states his law: the extension of a spring is proportional to the force.</li>
<li><b>1851</b> Léon Foucault’s long pendulum shows the Earth turning.</li>
<li><b>1940</b> The Tacoma Narrows bridge in the USA twists itself apart in a moderate wind. Engineers later showed that it was a wind-driven vibration feeding on itself, a close cousin of resonance and a famous lesson in design.</li>
</ul>

</div>

<div class="keypoints">

- Period T = 1/f; ω = 2πf = 2π/T. Oscillation about a mean position; amplitude A; phase (ωt + φ).
- SHM: F = −kx, a = −ω²x, x = A cos(ωt + φ), v = ±ω√(A² − x²); v<sub>max</sub> = ωA at the middle, a<sub>max</sub> = ω²A at the ends.
- SHM is the projection of uniform circular motion on a diameter.
- Energy: E = ½kA² = ½mω²A²; K = ½k(A² − x²), U = ½kx²; the average of each is E/2.
- Spring: T = 2π√(m/k); series k/2 (equal springs), parallel 2k. Pendulum: T = 2π√(L/g) (small angles; independent of mass).
- Damped: A e<sup>−bt/2m</sup>, ω′ = √(k/m − b²/4m²); critical damping b = 2√(km).
- Forced oscillations: the system follows the driver’s frequency; resonance when ω<sub>d</sub> ≈ ω₀, with a sharper peak for lighter damping.

</div>

Going further for JEE/NEET: the exam-level problems (springs with several masses, compound and torsional pendulums, combining SHMs, phase from graphs) are in [Oscillations (JEE)](/learn/courses/engineering-entrance/oscillations/).
