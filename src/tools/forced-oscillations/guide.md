---
name: Forced oscillations
num: 1353
shelf: learn
code: L215
section: school-physics
title: "Forced oscillations"
summary: "Let a block on a spring go and watch friction make its swings die away, or push it in rhythm and watch the swings build up to a steady size. Slide the push rate through resonance, see the resonance curve for more and less damping, and get the amplitude, phase lag and Q with your numbers."
status: live
ads: false
order: 1353
icon: curve
works: offline
updated: 2026-11-09
related: [shm-circle, spring-mass, pendulum-lab, coupled-oscillators]
sources:
  - "Damped, driven oscillator m x″ + b x′ + k x = F₀ cos ωt: ω₀ = √(k/m), damping ratio ζ = b/(2√(km)), decay e^(−bt/2m), ω′ = ω₀√(1 − ζ²), steady amplitude F₀/√((k − mω²)² + (bω)²), phase lag atan(bω/(k − mω²)), peak at ω₀√(1 − 2ζ²), Q = 1/(2ζ): standard mechanics."
  - "The motion shown is the equation solved step by step (Runge–Kutta)."
  - "Checked against an independent Python calculation and a separate step-by-step run to steady state."
flow:
  - { icon: sliders, label: "Set damping" }
  - { icon: curve, label: "Watch x(t)" }
  - { icon: chart, label: "Resonance" }
  - { icon: check, label: "Check" }
---

## What it does

A real spring does not bob for ever: air and friction take a little energy every swing and the swings **die away**. Push the same spring in rhythm, though, and the swings **build up** until the energy you put in each swing matches what friction takes out. If your pushes match the spring's own natural rhythm the swings become very large: that is **resonance**, the reason a child on a swing goes higher with small, well-timed pushes, and why some bridges and buildings have to be damped.

This page runs a block on a spring with adjustable damping. In **Let go** mode it starts 10 cm from the middle and the graph shows the swings shrinking inside the curve A₀e^(−bt/2m). In **Driven** mode a steady push F₀ cos ωt starts it from rest; the graph shows the start-up wobble settle into steady swings, and a second graph, the **resonance curve**, shows the steady amplitude for every push rate, for your damping and for half and double it.

This goes a little beyond the school book: it extends Class 11 Physics, Oscillations (damped simple harmonic motion, forced oscillations and resonance, which the book describes in words) and links to Class 12 Physics, Alternating Current (resonance in an LCR circuit follows the same equation). Start from [[shm-circle]] for undamped motion and [[spring-mass]] for the spring constant, and compare with [[pendulum-lab]].

## How to use it

1. Choose **Let go (damped)** or **Driven**.
2. **Mass m** and **spring constant k** set the natural frequency ω₀ = √(k/m).
3. **Damping b** sets how strongly friction resists motion (force = −b × velocity). 0 means no friction.
4. In Driven mode, **push rate ω ÷ ω₀** sets how fast you push compared with the natural rhythm, and **push strength F₀** how hard.
5. Every change starts the run again from the beginning so you can watch the start-up. **Pause** and **Start again** are under the graph.

## Worked example

As the page opens: m = 1 kg, k = 40 N/m, b = 0.5 kg/s, pushed with F₀ = 1 N at ω = ω₀.

ω₀ = √(40/1) = **6.325 rad/s** (1.007 Hz) and ζ = 0.5 / (2√40) = 0.0395, so Q = 1/(2ζ) = **12.6**. At ω₀ the spring and mass terms cancel and the steady amplitude is A = F₀ / (bω₀) = 1 / (0.5 × 6.325) = **31.62 cm**, lagging the push by 90°. Push at half the rate and A = **3.329 cm**; at twice the rate, **0.832 cm**, almost opposite to the push (177° behind). The largest amplitude comes at ω = 6.315 rad/s, just below ω₀.

Let go with the same spring and damping: the swings fall to 1/e in τ = 2m/b = **4 s** and **halve every 2.773 s**.

## Check yourself

Five fresh questions: the natural frequency, the time for swings to halve, the amplitude at resonance, the amplitude off resonance, and what damping does to the peak. Answers are checked on the page and the working is shown. Nothing is saved.

## Tips

- Damping hardly changes how fast the block swings (ω′ is very close to ω₀ for light damping); it changes how long the swings last.
- At resonance the push is in step with the **velocity**, so every push adds energy; that is why the displacement lags the push by 90°.
- Halve the damping and the resonance peak doubles in height.

## FAQ

**What does Q mean?** The quality factor: roughly how many swings it takes for the energy to fall by a large fraction, and how sharp the resonance peak is. A tuning fork has a very high Q; a car's shock absorber a very low one.

**Why does the graph wobble at first?** At the start the block's own natural swing and the forced swing add together. The natural part dies away with the damping, leaving only the forced, steady motion.

**What is critical damping?** ζ = 1: the block returns to the middle as fast as possible without overshooting. Door closers and measuring meters are tuned close to it.
