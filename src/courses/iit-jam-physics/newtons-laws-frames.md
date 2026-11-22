---
title: Newton's laws, inertial and non-inertial frames
seoTitle: Newton's laws and non-inertial frames for IIT JAM Physics
summary: 'Newton''s three laws stated carefully, a fail-safe method for pulleys, wedges and friction, and how to do mechanics from a lift, a car or the spinning Earth with pseudo, centrifugal and Coriolis forces.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: A lift moves downwards and is slowing down. Compared with your normal weight, a scale in the lift reads
    choices: ['More than your weight', 'Less than your weight', 'Exactly your weight', 'Zero']
    ans: 0
    why: Slowing down while moving down means the acceleration points up. Then N − mg = ma with a upward, so N = m(g + a) is more than mg. The direction of motion does not matter; the direction of the acceleration does.
  - q: Which of these is a real force (exerted by another body), not a pseudo force?
    choices: ['The friction that keeps a coffee cup in place on a turning train table', 'The centrifugal force on a passenger in a turning car', 'The Coriolis force on wind in a weather system', 'The backward push you feel when a bus speeds up']
    ans: 0
    why: Friction is exerted by the table and has a third-law partner (the cup pushes the table). The other three appear only because the observer's frame accelerates or rotates; no body exerts them.
  - q: 'In a frame rotating with angular velocity ω, which fictitious force acts only on a particle that moves relative to the frame?'
    choices: ['The Coriolis force', 'The centrifugal force', 'Both of them', 'Neither of them']
    ans: 0
    why: The Coriolis force −2m ω × v′ depends on the velocity v′ relative to the rotating frame, so it vanishes for a particle at rest in that frame. The centrifugal force −m ω × (ω × r) depends only on position.
sources:
  - 'D. Kleppner and R. Kolenkow, An Introduction to Mechanics, 2nd ed. (2014), chapters 2, 3 and 9'
  - 'K. R. Symon, Mechanics, 3rd ed. (1971), chapter 7: moving coordinate systems'
  - 'J. R. Taylor, Classical Mechanics (2005), chapters 1 and 9'
  - 'IIT JAM Physics syllabus (Mechanics and General Properties of Matter), published by the organising IIT each year'
---

**Module 2 · about 40 minutes.** By the end you will be able to solve any pulley, wedge or friction problem with one reliable method, decide whether a frame is inertial, and do mechanics from inside a lift, a car or the rotating Earth using pseudo forces, the centrifugal force and the Coriolis force.

<div class="bigidea">Newton's laws hold exactly only in inertial frames; in an accelerating or rotating frame they still work if you add the right fictitious forces.</div>

## 1. The three laws, said carefully

You met Newton's laws in Class 11. JAM tests whether you know exactly what each one says, so here they are in their precise form.

| Law | Precise statement | What it really does |
|---|---|---|
| First | A body with no net force on it keeps a constant velocity. | It **defines inertial frames**: frames in which this is true. |
| Second | `$\vec F_{\rm net} = \dfrac{d\vec p}{dt}$`, which is `$m\vec a$` for constant mass. | It tells you how forces change motion, in an inertial frame. |
| Third | If A pushes B with `$\vec F$`, then B pushes A with `$-\vec F$`. | Forces come in pairs, acting on **different** bodies. |

The first law is not just a special case of the second. It tells you *where* the second law may be used: only in frames where free bodies move in straight lines at constant speed.

**The third-law test.** A third-law pair (1) acts on two different bodies, (2) is the same kind of force, and (3) comes from the same interaction. A book on a table feels its weight (the Earth pulls it) and the normal force (the table pushes it). These are equal and opposite, but they act on the *same* body, so they are not a pair; they balance because of the second law. The partner of the weight is the book pulling the Earth upward.

## 2. A method that never fails: free bodies and constraints

Almost every JAM mechanics problem falls to the same four steps:

1. **Isolate** each body and draw every force on it (weight, normal forces, tensions, friction, springs).
2. **Choose axes** for each body, usually along and across its motion.
3. **Write** `$\sum F = ma$` for each body along each axis.
4. **Add constraints**: strings that do not stretch, surfaces that stay in contact. They link the accelerations.

**Worked example (Atwood machine).** Masses of 3 kg and 5 kg hang over a light, smooth pulley.

1. 5 kg block (moving down): `$5g - T = 5a$`. 3 kg block (moving up): `$T - 3g = 3a$`.
2. Constraint: one string, so both have the same size of acceleration.
3. Add the equations: `$2g = 8a$`, so `$a = g/4 = 2.45$` m/s². Then `$T = 3(g + a) = 36.75$` N.

The tension lies between the two weights (29.4 N and 49 N), which is a good sanity check.

<div class="problem" data-problem="atwood-machine"></div>

**Constraints with movable pulleys.** Write the string length in terms of the positions and differentiate twice. If a string goes from the ceiling, under a movable pulley carrying block B, over a fixed pulley and down to block A, then `$y_A + 2y_B$` = constant, so `$a_A = -2a_B$`: the free end moves twice as fast as the pulley, and the pulley feels a pull of `$2T$`.

## 3. Friction: check first, then calculate

Friction opposes the *relative sliding* (or the tendency to slide) of two surfaces.

```math
f_s \le \mu_s N \quad \text{(static: only as large as needed)}, \qquad f_k = \mu_k N \quad \text{(kinetic: while sliding)}
```

**Worked example.** A 4 kg block on a floor with `$\mu_s = 0.5$`, `$\mu_k = 0.4$` is pushed with 15 N.

1. The most static friction can do is `$\mu_s mg = 19.6$` N.
2. The push (15 N) is smaller, so the block does not move.
3. Friction is therefore exactly 15 N, not 19.6 N and not `$\mu_k mg = 15.7$` N.

Two facts that examiners love: friction can do positive work (it drags a crate forward on an accelerating truck), and the friction direction is set by relative motion between the surfaces, not by motion relative to the ground.

## 4. Inertial frames and Galilean transformations

Let frame `$S'$` move with constant velocity `$\vec V$` relative to `$S$`, with clocks agreeing. Then

```math
\vec r\,' = \vec r - \vec V t, \qquad \vec v\,' = \vec v - \vec V, \qquad \vec a\,' = \vec a, \qquad t' = t
```

Accelerations are the same in both frames, and forces (which depend on separations) are the same, so `$\vec F = m\vec a$` holds in both. **Every frame moving uniformly relative to an inertial frame is itself inertial.** Velocities, momenta and kinetic energies do change from frame to frame, and so does the work done by a force; energy conservation still holds in each frame separately.

## 5. Accelerating frames: the pseudo force

Now let the frame accelerate with `$\vec a_0$` (a car speeding up, a lift). The acceleration you measure inside is `$\vec a\,' = \vec a - \vec a_0$`, so

```math
m\vec a\,' = \vec F_{\rm real} - m\vec a_0
```

The extra term `$-m\vec a_0$` behaves like a force pointing **opposite** to the frame's acceleration. Nothing exerts it: it has no third-law partner.

<div class="meaning">

<dl>
<dt>−m a₀</dt><dd>the pseudo force in a frame that accelerates at a₀ (no body exerts it)</dd>
<dt>g + a (lift going up faster)</dt><dd>the effective gravity felt in an upward-accelerating lift</dd>
<dt>tan θ = a/g</dt><dd>the tilt of a hanging bob in a car accelerating at a</dd>
<dt>Physical meaning</dt><dd>Inside an accelerating box, every object feels an extra "gravity" −a₀ added to the real one. That is why you are pushed back in your seat, and why a block slides faster down an incline in a lift that accelerates upward.</dd>
</dl>

</div>

**Worked example.** A block slides on a smooth `$30^\circ$` incline inside a lift accelerating upward at `$g/2$`. In the lift frame the effective gravity is `$g + g/2 = 1.5g$` downward, so the block's acceleration along the incline is `$1.5g\sin30^\circ = 7.35$` m/s². Solving this in the ground frame is possible but much longer.

## 6. Rotating frames: centrifugal and Coriolis forces

A frame that rotates with angular velocity `$\vec\omega$` is not inertial even if `$\omega$` is constant, because every point in it accelerates towards the axis. Watch what a frictionless puck does on a turntable, first from the ground and then from the turntable itself.

<figure class="fig" data-fig="rotating-frame"><figcaption>The same motion in two frames. From the ground the puck goes straight; from the turntable it curves, and a rider needs fictitious forces to explain the curve. Raise the spin to make the curve tighter.</figcaption></figure>

Here is where the fictitious forces come from. Step through it:

<div class="steps">
<div class="step"><p><b>One rule for every vector.</b> For any vector <b>A</b>, its rate of change seen from the ground equals its rate of change seen in the rotating frame plus <b>ω</b> × <b>A</b> (the rotation carries <b>A</b> round).</p></div>
<div class="step"><p><b>Velocity.</b> Apply the rule to the position <b>r</b>: <b>v</b><sub>ground</sub> = <b>v′</b> + <b>ω</b> × <b>r</b>.</p></div>
<div class="step"><p><b>Acceleration.</b> Apply the rule again to <b>v</b><sub>ground</sub>: <b>a</b><sub>ground</sub> = <b>a′</b> + 2<b>ω</b> × <b>v′</b> + <b>ω</b> × (<b>ω</b> × <b>r</b>) + <b>ω̇</b> × <b>r</b>. The factor 2 comes from two equal terms, one from each step.</p></div>
<div class="step"><p><b>Newton in the ground frame.</b> <b>F</b> = m<b>a</b><sub>ground</sub>. Move everything except m<b>a′</b> to the right-hand side.</p></div>
<div class="step"><p><b>Result.</b> m<b>a′</b> = <b>F</b> − 2m <b>ω</b> × <b>v′</b> − m <b>ω</b> × (<b>ω</b> × <b>r</b>) − m <b>ω̇</b> × <b>r</b>: Coriolis, centrifugal and Euler forces.</p></div>
</div>

```math
m\vec a\,' = \vec F - \underbrace{2m\,\vec\omega\times\vec v\,'}_{\text{Coriolis}} - \underbrace{m\,\vec\omega\times(\vec\omega\times\vec r)}_{\text{centrifugal}} - \underbrace{m\,\dot{\vec\omega}\times\vec r}_{\text{Euler}}
```

- The **centrifugal force** points straight away from the axis, with size `$m\omega^2 s$` (`$s$` = distance from the axis). It acts on everything, moving or not.
- The **Coriolis force** acts only on bodies that move relative to the frame, at right angles to their velocity. On the Earth (northern hemisphere) it pushes moving things to the right.
- The **Euler force** appears only if the rotation speeds up or slows down.

**Worked example (the Earth).** A 1000 kg car drives north at 20 m/s at latitude `$30^\circ$`N, with `$\Omega = 7.29\times10^{-5}$` rad/s. Only the vertical component `$\Omega\sin\lambda$` gives a sideways force on horizontal motion:

1. `$F = 2m\Omega v\sin\lambda = 2\times1000\times7.29\times10^{-5}\times20\times0.5$`.
2. `$F \approx 1.46$` N, to the right (east). Tiny for a car, but over hundreds of kilometres it organises the winds into cyclones.

Other Earth effects you should know: the centrifugal force lowers the effective `$g$` at the equator by `$\Omega^2R \approx 0.034$` m/s²; a dropped stone lands slightly **east** (by `$\tfrac13\Omega g t^3\cos\lambda$`); and a Foucault pendulum's plane turns once every `$24\text{ h}/\sin\lambda$`.

<div class="myth">

**"The centrifugal force is the reaction to the centripetal force."** No. Centripetal force is not a new kind of force: it is the name for whatever real force (tension, friction, gravity) points to the centre. Its third-law partner acts on a *different* body (the stone pulls the string outward). The centrifugal force exists only in the rotating frame, acts on the stone itself, and has no partner at all. Never use both in the same frame.

</div>

## 7. Which frame should you use?

- **Ground (inertial) frame:** always correct. Use it by default, and always for third-law reasoning.
- **Accelerating frame:** saves effort when everything moves together (blocks in a lift, a bob in a car, a block on a moving wedge).
- **Rotating frame:** natural for anything described from the Earth, a merry-go-round or a spinning tube. Remember both fictitious forces once things move.

The frame does not change the physics, only the bookkeeping. If two methods disagree, look for a missing fictitious force.

<div class="keypoints">

- The first law defines inertial frames; `$\vec F = d\vec p/dt$` holds only there. Third-law partners act on different bodies.
- Free-body diagram for each body, `$\sum F = ma$` along chosen axes, then constraints from strings and surfaces.
- Static friction is only as large as needed, up to `$\mu_sN$`; always check whether the body moves first.
- Galilean frames agree on acceleration and force, but not on velocity, kinetic energy or work.
- In a frame accelerating at `$\vec a_0$`, add `$-m\vec a_0$`. In a rotating frame add `$-2m\vec\omega\times\vec v\,'$` (Coriolis) and `$-m\vec\omega\times(\vec\omega\times\vec r)$` (centrifugal).
- On the Earth: horizontal Coriolis force `$2m\Omega v\sin\lambda$`, eastward drift of falling bodies, Foucault period `$24\text{ h}/\sin\lambda$`.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [Newton's laws practice page](/learn/courses/iit-jam-physics/practice/newtons-laws-frames/).

<div class="qbank" data-bank="physics" data-topics="newtons-laws-frames" data-exam="jam" data-n="10"></div>

**Next:** lesson 2.2, [work, energy, momentum and collisions](/learn/courses/iit-jam-physics/work-energy-collisions/), gives you shortcuts that avoid forces altogether. Want to see how air resistance bends a real trajectory? Try the [projectile drag tool](/science/projectile-drag/). Going on to GATE? [Lagrangian mechanics](/learn/courses/gate-physics/lagrangian-mechanics/) handles constraints without drawing a single force.
