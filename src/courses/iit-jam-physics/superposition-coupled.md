---
title: Superposition, Lissajous figures and coupled oscillators
seoTitle: Lissajous figures and coupled oscillators for IIT JAM
summary: 'How oscillations add: phasors for SHMs along one line, beats, perpendicular SHMs and Lissajous figures (and reading a frequency ratio off an oscilloscope), then coupled pendulums and spring chains, normal modes, normal coordinates and the slow swapping of energy.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'Two identical pendulums are joined by a spring. In which normal mode does the spring play no part?'
    choices: ['The mode where both swing in step with equal amplitudes', 'The mode where they swing in opposite directions', 'Both modes', 'Neither: the spring always matters']
    ans: 0
    why: 'When the bobs move together the spring keeps its natural length, so each pendulum swings at √(g/L) as if alone. In the opposite mode the spring is stretched by twice each displacement.'
  - q: 'A Lissajous figure touches the top of its box 3 times and a side 2 times. What is f_y : f_x?'
    choices: ['3 : 2', '2 : 3', '6 : 1', '1 : 1']
    ans: 0
    why: 'The vertical signal reaches the top once per cycle and the horizontal one reaches a side once per cycle, in the same time: f_y : f_x = top touches : side touches.'
  - q: 'Two coupled pendulums have normal-mode frequencies 1.00 Hz and 1.02 Hz. One is set swinging, the other at rest. When is the first one still for the first time?'
    choices: ['After 25 s', 'After 50 s', 'After 12.5 s', 'Never: it keeps all its energy']
    ans: 0
    why: 'Energy has fully crossed over after half a beat period: t = 1/(2Δf) = 1/(2 × 0.02) = 25 s.'
sources:
  - 'A. P. French, Vibrations and Waves, MIT Introductory Physics Series (1971), chapters 2 and 5'
  - 'H. J. Pain and P. Rankin, Introduction to Vibrations and Waves (2015), chapters 1 and 4'
  - 'H. Goldstein, C. Poole and J. Safko, Classical Mechanics, 3rd ed. (2002), chapter 6: small oscillations'
  - 'IIT JAM Physics syllabus (Oscillations, Waves and Optics section), published by the organising IIT each year'
---

**Module 3 · about 45 minutes.** By the end you will be able to add any number of SHMs along a line in one step, explain beats, recognise every standard Lissajous figure and read a frequency ratio off an oscilloscope, find the normal modes of coupled pendulums and spring chains, and say exactly when energy swaps from one oscillator to another.

<div class="bigidea">When oscillations meet, their displacements simply add. That one rule explains beats, the patterns on an oscilloscope and the strange way two linked pendulums take turns to swing: every motion of a coupled system is a sum of a few simple "normal modes".</div>

## 1. The superposition principle

For the oscillators in this course the equation of motion is **linear**: `$\ddot x + \omega^2x = 0$`, or with damping `$\ddot x + 2\gamma\dot x + \omega_0^2x = 0$`. If `$x_1(t)$` and `$x_2(t)$` are solutions, so is `$x_1 + x_2$`. This is the superposition principle, and everything in this lesson rests on it.

It fails when the equation is not linear (a pendulum at large angles, `$\ddot\theta + \omega^2\sin\theta = 0$`) and, in a different way, when it is not homogeneous: two solutions of the driven equation `$\ddot x + \omega^2x = F_0\cos\Omega t$` add up to a motion driven by `$2F_0$`.

## 2. Adding SHMs along one line: phasors

Picture each SHM `$A_i\sin(\omega t + \phi_i)$` as an arrow of length `$A_i$` at angle `$\phi_i$`, all turning together at `$\omega$`. If the frequencies are equal, the arrows keep their angles to each other, so you add them once, like vectors:

```math
A^2 = A_1^2 + A_2^2 + 2A_1A_2\cos(\phi_2 - \phi_1), \qquad \tan\phi = \frac{A_1\sin\phi_1 + A_2\sin\phi_2}{A_1\cos\phi_1 + A_2\cos\phi_2}
```

<div class="meaning">

<dl>
<dt>A₁, A₂</dt><dd>the amplitudes of the two motions being added</dd>
<dt>φ₂ − φ₁</dt><dd>their phase difference: 0 means in step, π means exactly opposite</dd>
<dt>A</dt><dd>the amplitude of the single SHM that results; it has the same frequency</dd>
<dt>Physical meaning</dt><dd>Amplitudes add like arrows. In step they add (A₁ + A₂), opposite they subtract (|A₁ − A₂|), and a quarter cycle apart they add like the sides of a right triangle.</dd>
</dl>

</div>

**Worked example.** Add `$x_1 = 4\sin\omega t$`, `$x_2 = 3\sin(\omega t + \pi/2)$` and `$x_3 = 2\sin(\omega t + \pi)$` (cm). Arrows: 4 along 0°, 3 along 90°, 2 along 180°. The horizontal ones combine to `$4 - 2 = 2$`; with the vertical 3, `$A = \sqrt{4 + 9} = 3.61$` cm.

<div class="problem" data-problem="shm-add"></div>

For **equal amplitudes** the formula shortens to `$A = 2A_1\cos(\Delta\phi/2)$`. A favourite trap: two equal SHMs give a resultant equal to either one when `$\cos(\Delta\phi/2) = \tfrac12$`, i.e. `$\Delta\phi = 2\pi/3$`, not `$\pi/3$`.

## 3. Different frequencies: beats

If the frequencies differ a little, the arrows slowly turn relative to each other. For equal amplitudes the sum is

```math
A\cos\omega_1t + A\cos\omega_2t = \underbrace{2A\cos\left(\frac{\omega_1 - \omega_2}{2}t\right)}_{\text{slow envelope}}\ \cos\left(\frac{\omega_1 + \omega_2}{2}t\right)
```

You hear the average pitch, swelling and fading. The envelope cosine has frequency `$|f_1 - f_2|/2$`, but loudness depends on the size of the envelope, not its sign, so it peaks twice per envelope cycle: the **beat frequency is `$|f_1 - f_2|$`**.

**Worked example.** `$x = a\sin(100\pi t) + a\sin(104\pi t)$`: frequencies 50 Hz and 52 Hz, so 2 beats per second, 20 beats in 10 s. Musicians tune by turning a peg until the beats slow down and stop. The [Beats lab](/learn/beats-lab/) lets you hear this, and [lesson 3.5](/learn/courses/iit-jam-physics/sound-doppler/) uses beats to find unknown frequencies.

Bring two close frequencies together and watch the envelope slow down.

<figure class="fig" data-fig="@wt-beats"><figcaption>sin 2πf₁t + sin 2πf₂t = 2 cos(π Δf t) sin(2π f̄ t). Notice that the envelope has frequency Δf/2 but the loudness peaks Δf times a second, because both signs of the cosine sound alike.</figcaption></figure>


## 4. Perpendicular SHMs: Lissajous figures

Now let one SHM move a point along `$x$` and another along `$y$`: `$x = A\sin\omega_xt$`, `$y = B\sin(\omega_yt + \phi)$`. The point traces a **Lissajous figure**. For equal frequencies, eliminating `$t$` gives

```math
\frac{x^2}{A^2} + \frac{y^2}{B^2} - \frac{2xy}{AB}\cos\phi = \sin^2\phi
```

| Phase `$\phi$` | Path (equal frequencies, `$A = B$`) |
|---|---|
| `$0$` | straight line `$y = x$` |
| between `$0$` and `$\pi/2$` | ellipse along `$y = x$` |
| `$\pi/2$` | circle (an ellipse with axes along `$x$`, `$y$` if `$A \ne B$`) |
| between `$\pi/2$` and `$\pi$` | ellipse along `$y = -x$` |
| `$\pi$` | straight line `$y = -x$` |

The enclosed area is `$\pi AB\sin\phi$`, so it measures the phase difference. The sense of rotation depends on the sign of `$\sin\phi$`: check where the point is at `$t = 0$` and which way it moves next.

<figure class="fig" data-fig="lissajous"><figcaption>Pick a frequency ratio and slide the phase. For 1 : 1 the figure runs line, ellipse, circle, ellipse, line. For other ratios count the touches: the top edge is touched once per vertical cycle, a side once per horizontal cycle.</figcaption></figure>

**Reading a frequency off an oscilloscope.** Feed a known signal to one pair of plates and the unknown to the other. When the figure stands still,

```math
\frac{f_y}{f_x} = \frac{\text{number of times the figure touches the top (or bottom) edge}}{\text{number of times it touches a side edge}}
```

**Worked example.** With 500 Hz on the horizontal plates, the figure touches the top twice and a side five times: `$f_y = 500\times2/5 = 200$` Hz. The figure closes only if the ratio is rational; for `$\sqrt2 : 1$` it never repeats and slowly fills the rectangle. With two nearly equal frequencies it "breathes": line, ellipse, circle, ellipse, other line, once per beat period.

Two curves to remember: `$x = A\sin\omega t$`, `$y = A\cos2\omega t$` is the parabola `$y = A(1 - 2x^2/A^2)$`, and `$y = A\sin2\omega t$` is a figure of eight.

## 5. Coupled oscillators and normal modes

Join two identical pendulums (length `$L$`, mass `$m$`) by a light spring `$k$` between the bobs. For small swings, with `$x_1$`, `$x_2$` the sideways displacements:

```math
m\ddot x_1 = -\frac{mg}{L}x_1 - k(x_1 - x_2), \qquad m\ddot x_2 = -\frac{mg}{L}x_2 - k(x_2 - x_1)
```

Each equation contains the other coordinate: the motions are **coupled**. The trick is to find combinations that are not.

<div class="steps">
<div class="step"><p><b>Add the equations.</b> With q₁ = x₁ + x₂ the spring terms cancel: q̈₁ = −(g/L)q₁. So q₁ oscillates at ω₁ = √(g/L).</p></div>
<div class="step"><p><b>Subtract them.</b> With q₂ = x₁ − x₂ the spring terms double: q̈₂ = −(g/L + 2k/m)q₂. So q₂ oscillates at ω₂ = √(g/L + 2k/m).</p></div>
<div class="step"><p><b>These are normal coordinates.</b> Each obeys its own SHM equation, with no trace of the other. q₁ and q₂ are the normal coordinates; ω₁ and ω₂ the normal frequencies.</p></div>
<div class="step"><p><b>Read off the modes.</b> Only q₁ moving (q₂ = 0) means x₁ = x₂: both in step, spring unstretched. Only q₂ moving means x₁ = −x₂: opposite swings, spring working hard, higher frequency.</p></div>
<div class="step"><p><b>Any motion is a mix.</b> x₁ = (q₁ + q₂)/2 and x₂ = (q₁ − q₂)/2. The starting positions and velocities decide how much of each mode is present.</p></div>
</div>

A **normal mode** is a motion in which every part oscillates at the same frequency and passes through equilibrium at the same instant. A system with `$N$` degrees of freedom has `$N$` normal modes; some may have zero frequency if the system can slide or turn freely as a whole.

**Worked example.** `$L = 1.0$` m, `$m = 0.20$` kg, `$k = 0.49$` N/m, `$g = 9.8$` m/s²: `$\omega_1 = \sqrt{9.8} = 3.13$` rad/s and `$\omega_2 = \sqrt{9.8 + 4.9} = 3.83$` rad/s. The trap is `$k/m$` instead of `$2k/m$`: in the opposite mode the spring is stretched by `$2x$`.

### Energy swapping: beats between oscillators

Pull pendulum 1 aside by `$a$` and release both from rest. Both modes are present equally, and

```math
x_1 = a\cos\left(\frac{\omega_2 - \omega_1}{2}t\right)\cos\bar\omega t, \qquad x_2 = a\sin\left(\frac{\omega_2 - \omega_1}{2}t\right)\sin\bar\omega t
```

Pendulum 1's swing dies away while pendulum 2's grows. After `$t = \pi/(\omega_2 - \omega_1)$` all the energy is in pendulum 2; after twice that it is back. Weak coupling means close frequencies and a slow swap.

<figure class="fig" data-fig="coupled-pendulums"><figcaption>Start in step or opposite and each pendulum keeps its own energy for ever (a single mode). Pull only the left one and the energy swaps across and back. Weaken the spring and the swap slows down.</figcaption></figure>

<div class="problem" data-problem="coupled-transfer"></div>

<div class="myth">

**"Energy flowing back and forth between the pendulums is a normal mode."** It is the opposite. In a normal mode nothing changes except the common oscillation: each pendulum keeps its own share of energy. The slow swapping is what you see when **two** modes with slightly different frequencies run together and beat. Start the pendulums in the exact shape of one mode (equal and opposite, say) and they never exchange energy.

</div>

## 6. More masses: chains, molecules and rings

The same method works for any number of masses: write `$m\ddot{\mathbf x} = -K\mathbf x$`, try `$\mathbf x = \mathbf a\cos\omega t$`, and solve `$\det(K - m\omega^2I) = 0$`. The eigenvalues give `$\omega^2$`, the eigenvectors the mode shapes. Results worth knowing:

| System | Normal frequencies |
|---|---|
| wall-k-m-k-m-k-wall | `$\sqrt{k/m}$`, `$\sqrt{3k/m}$` (outer springs `$k$`, middle `$k'$`: `$\sqrt{(k + 2k')/m}$`) |
| two masses and one spring, free | `$0$`, `$\sqrt{k/\mu}$` with `$\mu = m_1m_2/(m_1 + m_2)$` |
| linear molecule m-M-m (like CO₂) | `$0$`, `$\sqrt{k/m}$`, `$\sqrt{(k/m)(1 + 2m/M)}$` |
| `$N$` beads on a string, fixed ends | `$\omega_n = 2\omega_0\sin\dfrac{n\pi}{2(N + 1)}$` |
| `$N$` masses in a closed ring | `$\omega_n = 2\omega_0\lvert\sin(n\pi/N)\rvert$`, including `$0$` and repeated values |

**Worked example.** Three equal masses between walls on four springs: the matrix `$\omega_0^2\begin{pmatrix}2&-1&0\\-1&2&-1\\0&-1&2\end{pmatrix}$` has eigenvalues `$(2 - \sqrt2)\omega_0^2$`, `$2\omega_0^2$`, `$(2 + \sqrt2)\omega_0^2$`. The middle mode, `$(1, 0, -1)$`, keeps the centre mass still. As `$N$` grows, the chain's modes become the standing waves of a continuous string: that is the bridge to [lesson 3.4](/learn/courses/iit-jam-physics/waves/). The GATE Physics course treats [general small oscillations](/learn/courses/gate-physics/normal-modes/) with [the Lagrangian method](/learn/courses/gate-physics/lagrangian-mechanics/).

The same mathematics appears in electric circuits: two LC loops sharing a capacitor `$C_c$` have modes at `$1/\sqrt{LC}$` and `$\sqrt{1/LC + 2/LC_c}$`, with `$1/C_c$` playing the role of the spring.

<div class="keypoints">

- Linear, homogeneous equations obey superposition: solutions add.
- Same-frequency SHMs add like arrows: `$A^2 = A_1^2 + A_2^2 + 2A_1A_2\cos\Delta\phi$`; equal amplitudes give `$2A_1\cos(\Delta\phi/2)$`.
- Close frequencies give beats at `$|f_1 - f_2|$` (not half of it), with the fast oscillation at the average.
- Perpendicular SHMs make Lissajous figures: line, ellipse, circle for 1 : 1 as the phase grows; `$f_y : f_x$` = top touches : side touches; closed only for rational ratios.
- Coupled pendulums: in step at `$\sqrt{g/L}$`, opposite at `$\sqrt{g/L + 2k/m}$`. Normal coordinates `$x_1 \pm x_2$` decouple the equations.
- Energy swaps between oscillators when two modes beat: full transfer after `$\pi/(\omega_2 - \omega_1)$`. A single mode never swaps energy.
- `$N$` degrees of freedom give `$N$` modes, found from `$\det(K - m\omega^2) = 0$`; free systems have zero modes.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. More on the [superposition and coupled oscillators practice page](/learn/courses/iit-jam-physics/practice/superposition-coupled/).

<div class="qbank" data-bank="physics" data-topics="superposition-coupled" data-exam="jam" data-n="10"></div>

**Next:** [lesson 3.4](/learn/courses/iit-jam-physics/waves/) lets the number of coupled masses grow without limit, which turns normal modes into waves on a string. Before that, revisit [simple harmonic motion](/learn/courses/iit-jam-physics/simple-harmonic-motion/) if phasors felt new, and [damped and forced oscillations](/learn/courses/iit-jam-physics/damped-forced-oscillations/) for what friction does to each mode.

**Go deeper:** GATE's [small oscillations and normal modes](/learn/courses/gate-physics/normal-modes/) does the general linear case, and CSIR NET's [nonlinear dynamics and chaos](/learn/courses/csir-net-physics/nonlinear-dynamics-chaos/) picks up when amplitudes are no longer small.
