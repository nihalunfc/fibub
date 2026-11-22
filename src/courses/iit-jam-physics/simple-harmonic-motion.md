---
title: Simple harmonic motion
seoTitle: Simple harmonic motion for IIT JAM Physics
summary: 'What makes a motion simple harmonic, how displacement, velocity, acceleration and energy are linked, why every small oscillation is SHM, and how to get the period of springs, pendulums and odd systems in one line.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: 'A particle in SHM has amplitude 10 cm. Where is its kinetic energy equal to its potential energy?'
    choices: ['At about 7.1 cm from the mean position', 'At 5 cm from the mean position', 'At the mean position', 'At the extreme position']
    ans: 0
    why: 'Potential energy is (x/A)² of the total. It equals half the total when x = A/√2 = 7.1 cm. At 5 cm the potential energy is only a quarter of the total.'
  - q: 'A pendulum clock is taken from sea level to the top of a high mountain, where g is smaller. What happens?'
    choices: ['It runs slow, because T = 2π√(L/g) grows', 'It runs fast, because the period shrinks', 'Nothing, because the period does not depend on g', 'It stops, because the restoring force is gone']
    ans: 0
    why: 'A smaller g makes the period longer, so the clock ticks fewer times per real day and falls behind.'
  - q: 'For a particle moving in the potential U(x), what sets the angular frequency of small oscillations about a minimum at x₀?'
    choices: ['The curvature U″(x₀), through ω = √(U″(x₀)/m)', 'The depth of the minimum U(x₀)', 'The slope U′(x₀), which is zero there', 'The amplitude of the motion']
    ans: 0
    why: 'Near the minimum U ≈ U(x₀) + ½U″(x₀)(x − x₀)², which is a spring with k = U″(x₀). The depth only shifts the energy; the slope is zero at a minimum.'
sources:
  - 'D. Kleppner and R. Kolenkow, An Introduction to Mechanics, 2nd ed. (2014), chapter 6: oscillations'
  - 'A. P. French, Vibrations and Waves, MIT Introductory Physics Series (1971), chapters 1 to 3'
  - 'H. J. Pain and P. Rankin, Introduction to Vibrations and Waves (2015), chapter 1'
  - 'IIT JAM Physics syllabus (Oscillations, Waves and Optics section), published by the organising IIT each year'
---

**Module 3 · about 40 minutes.** By the end you will be able to recognise SHM from its equation, move freely between displacement, velocity, acceleration and energy, find the frequency of any small oscillation from its potential energy, and write down the period of springs, pendulums and the unusual oscillators JAM likes to invent.

<div class="bigidea">Whenever a push back is proportional to how far you are from home, you oscillate in a perfect sine wave, and the period does not depend on how far you went.</div>

## 1. The one equation behind it all

Pull a block on a spring a distance `$x$` from where the spring is relaxed. The spring pulls back with a force `$F = -kx$`: twice the stretch, twice the pull, always towards the middle. Newton's second law gives

```math
m\ddot x = -kx \qquad\Longrightarrow\qquad \ddot x = -\omega^2 x, \qquad \omega = \sqrt{\frac{k}{m}}
```

This is **the** equation of simple harmonic motion (SHM): *acceleration proportional to displacement, and opposite to it*. Any system whose equation can be put in this form is an SHM, whatever it is made of, and `$\omega$` is read straight off as the square root of the number in front of `$x$`.

Its general solution has two constants, set by how you start the motion:

```math
x(t) = A\cos(\omega t + \phi)
```

| Symbol | Name | Set by |
|---|---|---|
| `$A$` | amplitude (largest displacement) | the start |
| `$\phi$` | initial phase | the start |
| `$\omega$` | angular frequency (rad/s) | the system only |
| `$T = 2\pi/\omega$` | period | the system only |
| `$f = 1/T$` | frequency (Hz) | the system only |

The period depends only on `$m$` and `$k$`, never on `$A$`. This is called **isochronism**, and it is why pendulums and quartz crystals keep time.

## 2. Watch it: the reference circle

The block below moves as `$x = A\cos\omega t$`. Under it, a dot goes round a circle at a steady angular speed `$\omega$`. Its shadow on the horizontal line is *exactly* the block's position. That is all SHM is: one coordinate of uniform circular motion.

<figure class="fig" data-fig="shm-oscillator"><figcaption>Change the mass and spring constant and the period changes; change the amplitude and it does not. The bars show kinetic and potential energy swapping while their sum stays fixed.</figcaption></figure>

Try it: double the amplitude and watch the readout. The period stays the same, because the block has twice as far to go but is pushed twice as hard all the way.

## 3. Velocity and acceleration

Differentiate `$x = A\cos(\omega t + \phi)$` twice:

```math
v = -A\omega\sin(\omega t + \phi), \qquad a = -A\omega^2\cos(\omega t + \phi) = -\omega^2 x
```

- The velocity is **a quarter cycle (`$\pi/2$`) ahead** of the displacement. The acceleration is **half a cycle (`$\pi$`) ahead**: always opposite to `$x$`.
- Largest speed `$A\omega$` at the middle; largest acceleration `$A\omega^2$` at the ends, where the block stops for an instant.
- Eliminating time gives the most useful single formula in this lesson:

```math
v = \omega\sqrt{A^2 - x^2}
```

<div class="meaning">

<dl>
<dt>A</dt><dd>how far the motion reaches from the middle</dd>
<dt>ω</dt><dd>how fast the reference dot turns, in radians per second: √(stiffness ÷ inertia)</dd>
<dt>ωt + φ</dt><dd>the phase: where in its cycle the motion is</dd>
<dt>v = ω√(A² − x²)</dt><dd>speed at any position, without needing the time</dd>
<dt>Physical meaning</dt><dd>A stiff spring (large k) pulls back hard and makes quick oscillations; a heavy mass (large m) resists changes of speed and makes slow ones. The size of the swing does not matter.</dd>
</dl>

</div>

**Worked example.** A particle moves as `$x = 0.05\cos(10t + \pi/4)$` m. Find its period, its greatest speed and acceleration, and its speed at `$x = 3$` cm.

1. Read off `$A = 0.05$` m and `$\omega = 10$` rad/s, so `$T = 2\pi/10 = 0.628$` s.
2. Greatest speed `$A\omega = 0.5$` m/s; greatest acceleration `$A\omega^2 = 5$` m/s².
3. At `$x = 0.03$` m: `$v = 10\sqrt{0.0025 - 0.0009} = 10\times0.04 = 0.4$` m/s.

The phase `$\pi/4$` played no part: it only decides *when* these things happen.

**Timing trick.** Because the reference dot turns at a steady rate, "how long from here to there" is just "what angle does the dot sweep". From the middle to `$A/2$` the dot turns `$30^\circ$`, which is `$T/12$`; from the end to `$A/2$` it turns `$60^\circ$`, which is `$T/6$`. Students who assume constant speed get `$T/8$` for both.

<div class="problem" data-problem="shm-speed"></div>

## 4. Energy

The spring stores potential energy `$\tfrac12kx^2$`; the block carries kinetic energy `$\tfrac12mv^2 = \tfrac12m\omega^2(A^2 - x^2) = \tfrac12k(A^2 - x^2)$`. Add them:

```math
E = \tfrac12kx^2 + \tfrac12k(A^2 - x^2) = \tfrac12kA^2 = \tfrac12m\omega^2A^2
```

The total is constant and grows as the **square** of the amplitude. Averaged over a cycle, kinetic and potential energy are equal: each is `$E/2$`.

**Worked example.** A 0.25 kg block on a spring with `$k = 100$` N/m oscillates with amplitude 4 cm. What fraction of its energy is kinetic at `$x = 2$` cm?

1. `$E = \tfrac12(100)(0.04)^2 = 0.08$` J.
2. Potential energy at 2 cm: `$\tfrac12(100)(0.02)^2 = 0.02$` J, a quarter of the total, because `$(x/A)^2 = 1/4$`.
3. So the kinetic energy is `$0.06$` J, three quarters of the total. The mass was not needed.

## 5. Every small oscillation is SHM

Here is why SHM is everywhere. Take *any* smooth potential energy `$U(x)$` with a minimum at `$x_0$`. Step through what happens close to the bottom:

<div class="steps">
<div class="step"><p><b>Zoom in.</b> Near x₀ write x = x₀ + s, with s small, and expand U in a Taylor series: U = U(x₀) + U′(x₀)s + ½U″(x₀)s² + ...</p></div>
<div class="step"><p><b>The slope is zero.</b> At a minimum U′(x₀) = 0, so the linear term drops out.</p></div>
<div class="step"><p><b>Keep the first surviving term.</b> For small s the s² term beats every higher power: U ≈ U(x₀) + ½U″(x₀)s².</p></div>
<div class="step"><p><b>That is a spring.</b> Compare with ½ks²: the effective spring constant is k = U″(x₀). The force is −U″(x₀)s, proportional to −s.</p></div>
<div class="step"><p><b>Read off ω.</b> ω = √(U″(x₀)/m). A minimum (U″ > 0) oscillates; a maximum (U″ < 0) is unstable and the particle runs away.</p></div>
</div>

```math
\omega = \sqrt{\frac{U''(x_0)}{m}}
```

**Worked example.** A simple model of the bond in a molecule uses `$U(x) = a/x^2 - b/x$` with `$a, b > 0$`. Find the equilibrium separation and the frequency of small vibrations of a particle of mass `$m$`.

1. `$U'(x) = -2a/x^3 + b/x^2 = 0$` gives `$x_0 = 2a/b$`.
2. `$U''(x) = 6a/x^4 - 2b/x^3$`. At `$x_0$`: `$U'' = (6a - 2bx_0)/x_0^4 = 2a/x_0^4 = b^4/(8a^3)$`.
3. So `$\omega = \sqrt{b^4/(8a^3m)}$`.

The trap in exams: reading `$k$` from the coefficient of `$x^2$` in a potential like `$U = 3x^2$`. Remember `$U = \tfrac12kx^2$`, so here `$k = 6$`, not 3.

## 6. Springs and pendulums

The recipe never changes: find the restoring force (or torque) for a small displacement, write it as "constant × displacement", and divide by the inertia.

| System | `$\omega^2$` | Remember |
|---|---|---|
| Springs in parallel / in series | `$(k_1 + k_2)/m$` / `$k_1k_2/[(k_1+k_2)m]$` | opposite to resistors |
| Spring cut to a fraction `$f$` of its length | `$k/(fm)$` | a shorter spring is stiffer |
| Vertical spring with static stretch `$\delta$` | `$g/\delta$` | gravity shifts the centre, not `$\omega$` |
| Simple pendulum | `$g/L$` | mass does not matter |
| Physical pendulum (pivot `$d$` from centre of mass) | `$mgd/I$` | use the parallel-axis theorem for `$I$` |
| Pendulum in a lift with acceleration `$a$` up | `$(g + a)/L$` | use the effective gravity |
| Two masses joined by a spring | `$k/\mu$`, `$\mu = m_1m_2/(m_1+m_2)$` | reduced mass |
| Liquid in a U-tube, column length `$L$` | `$2g/L$` | the level difference is twice the shift |

**Worked example.** A thin ring of radius 25 cm hangs on a nail and swings in its own plane. Find its period (`$g = 9.8$` m/s²).

1. About its centre a ring has `$I = mR^2$`; about a point on the rim (parallel axes) `$I = 2mR^2$`.
2. The centre of mass is `$d = R$` from the nail, so `$\omega^2 = mgR/(2mR^2) = g/(2R)$`.
3. `$T = 2\pi\sqrt{2R/g} = 2\pi\sqrt{0.5/9.8} = 1.42$` s: the same as a simple pendulum of length `$2R$`.

For hands-on practice with real numbers, the [Pendulum lab](/learn/pendulum-lab/) lets you change length, gravity and amplitude, the [Spring combinations](/learn/spring-mass/) tool works out series and parallel springs, and the [SHM circle](/learn/shm-circle/) shows the reference circle in slow motion. If you have measured a real pendulum, the [Pendulum lab analyser](/science/pendulum-analyser/) turns your timings into `$g$` with an uncertainty.

<div class="myth">

**"Any motion that repeats itself is simple harmonic."** No. Periodic means it repeats; simple harmonic means the acceleration is exactly `$-\omega^2$` times the displacement from a fixed point, so the motion is a single pure sine wave. A ball bouncing on the floor is periodic but not SHM. `$x = A\sin\omega t + A\sin2\omega t$` is periodic but not SHM. Surprisingly, `$x = A\sin^2\omega t$` **is** SHM: `$\sin^2\omega t = \tfrac12(1 - \cos2\omega t)$`, a pure oscillation at `$2\omega$` about the point `$A/2$`.

</div>

## 7. Adding two SHMs of the same frequency

Two SHMs along the same line with the same `$\omega$` add to a single SHM with that `$\omega$`. Treat each as an arrow (a phasor) of length `$A_i$` at angle `$\phi_i$` and add the arrows:

```math
A^2 = A_1^2 + A_2^2 + 2A_1A_2\cos(\phi_2 - \phi_1)
```

**Worked example.** `$x_1 = 2\sin\omega t$` and `$x_2 = 2\sin(\omega t + 2\pi/3)$`: `$A^2 = 4 + 4 + 8\cos120^\circ = 4$`, so `$A = 2$`. Two equal motions `$120^\circ$` apart add up to one of the same size. (Different frequencies, beats and Lissajous figures come in [lesson 3.3](/learn/courses/iit-jam-physics/superposition-coupled/).)

## 8. When SHM stops being exact

Real oscillators are SHM only for small amplitudes. For a pendulum released from `$90^\circ$`, the restoring torque `$-mgL\sin\theta$` is weaker than `$-mgL\theta$`, and the period is about 18% longer than `$2\pi\sqrt{L/g}$`. In general, a potential `$V \propto |x|^n$` gives a period that changes with energy as `$T \propto E^{1/n - 1/2}$`: only `$n = 2$` keeps the period fixed. GATE and NET also ask about slow changes: if a pendulum's length is shortened very slowly, the quantity `$E/\omega$` stays constant (an adiabatic invariant), which is the classical root of `$E = n\hbar\omega$`.

<div class="keypoints">

- SHM means `$\ddot x = -\omega^2x$`; read `$\omega$` as the square root of the coefficient. Solution `$x = A\cos(\omega t + \phi)$`; the period does not depend on amplitude.
- Velocity leads displacement by `$\pi/2$`, acceleration by `$\pi$`. `$v = \omega\sqrt{A^2 - x^2}$`, `$v_{\max} = A\omega$`, `$a_{\max} = A\omega^2$`.
- `$E = \tfrac12kA^2$`; kinetic equals potential at `$x = A/\sqrt2$`; each averages `$E/2$` over a cycle.
- Small oscillations about any minimum: `$\omega = \sqrt{U''(x_0)/m}$`. Watch the factor `$\tfrac12$` in `$U = \tfrac12kx^2$`.
- Pendulums: `$\omega^2 = g/L$` (simple), `$mgd/I$` (physical), with `$g$` replaced by the effective gravity in an accelerating frame.
- Same-frequency SHMs add like arrows: `$A^2 = A_1^2 + A_2^2 + 2A_1A_2\cos\Delta\phi$`.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. There are more on the [simple harmonic motion practice page](/learn/courses/iit-jam-physics/practice/simple-harmonic-motion/).

<div class="qbank" data-bank="physics" data-topics="simple-harmonic-motion" data-exam="jam" data-n="10"></div>

**Next:** [lesson 3.2](/learn/courses/iit-jam-physics/damped-forced-oscillations/) adds friction and a driving force, which leads to resonance. The same `$\ddot x = -\omega^2x$` reappears in electric circuits and in the quantum harmonic oscillator; the [GATE Physics course](/learn/courses/gate-physics/) takes it further with small oscillations of many coupled bodies and normal modes.
