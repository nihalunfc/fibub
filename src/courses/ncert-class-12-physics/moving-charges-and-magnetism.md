---
title: Moving Charges and Magnetism
seoTitle: 'Moving Charges and Magnetism Class 12 notes'
summary: 'Class 12 Moving Charges and Magnetism: Lorentz force, circular motion, Biot–Savart, Ampère’s law, solenoid, parallel wires, torque, galvanometer. Animated.'
minutes: 90
updated: 2026-11-22
quiz:
  - q: 'A proton and an electron enter the same uniform magnetic field at right angles with the same speed. Which one moves in the bigger circle?'
    choices: ['the proton', 'the electron', 'both move in circles of the same size', 'neither: the field does not affect them']
    ans: 0
    why: 'r = mv/qB. Both have the same charge size and speed, but the proton is about 1836 times heavier, so its circle is about 1836 times larger.'
  - q: 'The magnetic field inside a long solenoid of n turns per metre carrying current I is:'
    choices: ['μ₀nI, the same everywhere inside', 'μ₀nI/2, the same everywhere inside', 'μ₀I/2πr, falling with distance', 'zero, because the fields cancel']
    ans: 0
    why: 'Ampère’s law round a rectangle with one side inside gives B h = μ₀ n h I, so B = μ₀nI. It does not depend on the radius or on the position inside.'
  - q: 'A galvanometer is turned into an ammeter by joining a:'
    choices: ['small resistance in parallel', 'small resistance in series', 'large resistance in series', 'large resistance in parallel']
    ans: 0
    why: 'The shunt takes almost all of the current, so the coil sees only its safe full-scale current, and the ammeter as a whole has a very low resistance.'
sources:
  - 'NCERT Class 12 Physics, Chapter 4 “Moving Charges and Magnetism” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Fundamental constants (proton and electron mass, elementary charge, μ0): CODATA 2018 recommended values, NIST, physics.nist.gov/constants'
  - 'The ampere and the force between parallel currents: The International System of Units (SI), 9th edition, BIPM, 2019'
---

**Physics · Class 12 · Chapter 4 · about 90 minutes.** By the end you will be able to find the force on a moving charge and on a current, follow a particle round a circle or a helix, calculate the field of a wire, a coil and a solenoid, find the force between two wires, and explain how a galvanometer, an ammeter and a voltmeter work.

<div class="bigidea">Moving charge is the source of magnetism, and moving charge is what magnetism acts on. A field pushes a moving charge sideways (never along its path), so it turns it but cannot speed it up. And a current, being lots of moving charges, both makes a field (Biot–Savart, Ampère) and feels one (force and torque on a wire or a coil).</div>

## 1. The force on a moving charge

A charge sitting still in a magnetic field feels nothing. Set it moving and a force appears, which depends on how fast it moves, how strong the field is, and the angle between them. This is the **magnetic force**:

```math
\vec F = q\,\vec v \times \vec B \qquad F = q v B \sin\theta
```

The force is at right angles to **both** the velocity and the field. The rule for its direction: put the fingers of your right hand along `$\vec v$`, curl them towards `$\vec B$`, and your thumb points along `$\vec F$` for a positive charge (for a negative charge, the opposite way).

<div class="meaning">
<dl>
<dt>q</dt><dd>charge of the particle, in coulombs (with its sign)</dd>
<dt>v</dt><dd>velocity of the particle, in m/s</dd>
<dt>B</dt><dd>magnetic field (magnetic flux density), in tesla (T): 1 T = 1 N per (A m)</dd>
<dt>θ</dt><dd>the angle between `$\vec v$` and `$\vec B$`</dd>
<dt>Physical meaning</dt><dd>Only the part of the velocity <i>across</i> the field, `$v\sin\theta$`, is pushed sideways. The part along the field, `$v\cos\theta$`, feels nothing. So the force is zero when the charge moves along the field (θ = 0°) and largest when it moves straight across it (θ = 90°).</dd>
</dl>
</div>

<figure class="fig" data-fig="c12p-mag-force"><figcaption>Choose the direction of the velocity, the sign of the charge and whether B goes into or out of the page. The force is always 90° from v, so the charge swings round in a circle at constant speed. Reverse the charge or the field and the force flips.</figcaption></figure>

<figure class="fig" data-fig="c12p-mag-cross"><figcaption>Tilt the velocity relative to B. The force follows `$\sin\theta$`: nothing when v is along B (θ = 0° or 180°), the maximum when it is across it. Compare a proton with an electron: the force flips from out of the page to into the page.</figcaption></figure>

<div class="problem" data-problem="c12p-mag-force"></div>

When an electric field is present as well, the total force on the charge is the **Lorentz force**:

```math
\vec F = q\,(\vec E + \vec v \times \vec B)
```

<div class="myth">

**“A magnetic field can speed a charge up.”** It cannot. The force is always at right angles to the velocity, so `$\vec F\cdot\vec v = 0$`: the field does no work and the speed (and the kinetic energy) never change. Only the direction does. An electric field is what can speed a charge up.

</div>

## 2. Motion in a uniform magnetic field

**Across the field.** Shoot a charge at right angles to a uniform field. The force is always sideways to its velocity and has a constant size, so it plays the role of the string when you whirl a stone round your head. The magnetic force supplies the centripetal force, and the path is a circle.

<div class="steps" data-fig="c12p-mag-circle">
<div class="step">A charge q of mass m moves at speed v into a uniform field B that points into the page, at right angles to its velocity.</div>
<div class="step">The force qvB is always at right angles to v, so it changes the direction but not the speed. It always points to the same centre.</div>
<div class="step">The magnetic force is the centripetal force: `$qvB = \dfrac{mv^2}{r}$`.</div>
<div class="step">Cancel one v and solve for r: `$r = \dfrac{mv}{qB}$`. A faster particle makes a bigger circle; a heavier one too; a stronger field makes it tighter.</div>
<div class="step">The time for one lap is `$T = \dfrac{2\pi r}{v} = \dfrac{2\pi m}{qB}$`. The v has cancelled: a fast particle on a big circle and a slow one on a small circle come round together. The frequency is `$f = \dfrac{qB}{2\pi m}$`.</div>
<div class="step">Since `$mv = p$` is the momentum, `$r = p/qB$`, and with kinetic energy K, `$r = \sqrt{2mK}/qB$`. Two particles with the same momentum make the same circle.</div>
</div>

```math
r = \frac{mv}{qB}\qquad T = \frac{2\pi m}{qB}\qquad f = \frac{qB}{2\pi m}
```

Think of runners on a circular track in Chennai who all complete a lap in exactly four minutes: the fast runners just take the outside lane. That is a charged particle in a magnetic field.

<div class="problem" data-problem="c12p-mag-radius"></div>

<div class="problem" data-problem="c12p-mag-period"></div>

**At an angle to the field.** Now let the velocity make an angle θ with B. Split it in two. The part across the field, `$v\sin\theta$`, makes the circle of radius `$r = mv\sin\theta/qB$`. The part along the field, `$v\cos\theta$`, is untouched. Together they give a **helix** (a spring shape) whose axis is along B and whose pitch (the advance in one turn) is `$p = v\cos\theta \times T$`.

<figure class="fig" data-fig="c12p-mag-helix"><figcaption>Change the angle, the speed and the field, for a proton or an electron. At 90° you get a circle; at 0° a straight line. Notice that one turn always takes the same time T, whatever v and θ you choose; only the radius and the pitch change.</figcaption></figure>

This is how the charged particles from the Sun are trapped by the Earth's field and spiral along its lines towards the poles. When they strike the air there, they make the auroras.

Experiment with a particle in a field of your own design:

<!--fig:tool lorentz-motion-->

Other tools to try: the [Particle drift simulator](/science/particle-drifts/) and the [Fleming's rule trainer](/learn/fleming-rule/).

## 3. Crossed electric and magnetic fields: the velocity selector

Put an electric field and a magnetic field at right angles to each other, and send a charged particle through at right angles to both. The electric force qE pushes one way and the magnetic force qvB pushes the other way. They cancel only for one special speed:

```math
qE = qvB \quad\Longrightarrow\quad v = \frac{E}{B}
```

Faster particles are pushed one way by the magnetic force, slower ones the other way. A slit at the far end lets through only the particles with exactly the right speed, whatever their mass or charge. Mass spectrometers use a selector like this to feed a beam of equal-speed ions into a magnetic field, where they split by mass, since `$r = mv/qB$` is then proportional to m/q.

<figure class="fig" data-fig="c12p-mag-selector"><figcaption>A proton goes through crossed fields (E downward, B into the page). The chosen speed E/B is calculated for you. Make the proton faster or slower than it and watch which way it bends and whether it still reaches the slit.</figcaption></figure>

<div class="history">

<ul class="timeline">
<li><b>1820</b> Hans Christian Ørsted notices a compass needle swing near a wire carrying a current: electricity and magnetism are connected.</li>
<li><b>1820</b> André-Marie Ampère works out the force between two currents within weeks; Biot and Savart measure the field of a wire.</li>
<li><b>1895</b> Hendrik Lorentz writes the force on a moving charge in an electric and a magnetic field.</li>
<li><b>1897</b> J. J. Thomson uses crossed E and B fields on cathode rays to measure the ratio e/m of the electron.</li>
</ul>

</div>

## 4. The force on a current-carrying wire

A current is a stream of moving charges, so a field pushes on a wire that carries one. Take a straight piece of wire of length L and cross-section A, with n free charges per unit volume, each of charge q drifting at speed `$v_d$`. There are `$nAL$` charges in the piece, and the force on each is `$qv_dB\sin\theta$`. The current is `$I = nqv_dA$`, so the total force is

```math
\vec F = I\,\vec L \times \vec B \qquad F = I L B \sin\theta
```

where `$\vec L$` points along the current. The direction is given by the same right-hand rule, or **Fleming's left-hand rule**: forefinger along the field, middle finger along the current, thumb gives the force. Try it with the trainer: [Fleming's rule](/learn/fleming-rule/). This is the force that spins every electric motor, fan and mixer grinder in the house.

For a wire that is not straight, or a field that changes, add up `$I\,d\vec L \times \vec B$` over each small piece.

## 5. Magnetic field of a current: the Biot–Savart law

Now the other half: a current **makes** a field. Cut a wire into tiny pieces, each of length `$dl$`. Biot and Savart found that each piece contributes

```math
d\vec B = \frac{\mu_0}{4\pi}\,\frac{I\,d\vec l \times \hat r}{r^2}\qquad dB = \frac{\mu_0}{4\pi}\,\frac{I\,dl\,\sin\theta}{r^2}
```

<div class="meaning">
<dl>
<dt>I dl</dt><dd>a small piece of current, "current times length", pointing along the current</dd>
<dt>r</dt><dd>the distance from the piece to the point where you want the field</dd>
<dt>θ</dt><dd>the angle between the piece and the line joining it to the point</dd>
<dt>μ₀</dt><dd>permeability of free space, `$4\pi\times10^{-7}$` T m/A, so `$\mu_0/4\pi = 10^{-7}$` in SI units</dd>
<dt>Physical meaning</dt><dd>Every bit of current adds a little field that falls as `$1/r^2$` (like Coulomb's law), is strongest sideways and zero straight ahead, and curls round the current (right-hand rule). The total field is the sum (an integral) of all the little contributions.</dd>
</dl>
</div>

<figure class="fig" data-fig="c12p-mag-element"><figcaption>Drag the point P around the current element. The field is out of the page above the element and into it below. The small marks on the ring show how the field at one distance changes with angle: biggest at the sides, nothing along the wire. Move P further out and the field falls as 1/r².</figcaption></figure>

### The field on the axis of a circular loop

This is the board's favourite derivation. A loop of radius a carries current I. Find B at a point P on the axis, a distance x from the centre.

<div class="steps" data-fig="c12p-mag-loop">
<div class="step">The loop has radius a and current I; P lies on its axis at distance x from the centre.</div>
<div class="step">Take a tiny piece `$dl$` of the loop. Its distance from P is `$r = \sqrt{a^2+x^2}$`, and `$dl$` is at right angles to r, so `$dB = \dfrac{\mu_0}{4\pi}\dfrac{I\,dl}{r^2}$`. The direction of `$dB$` is at right angles to r.</div>
<div class="step">The piece on the opposite side of the loop gives an equal `$dB$` tilted the other way. The parts of `$dB$` across the axis cancel in every such pair.</div>
<div class="step">Only the components along the axis survive: `$dB\sin\alpha$`, where `$\sin\alpha = a/r$`. Add up round the loop: `$\int dl = 2\pi a$`, so `$B = \dfrac{\mu_0 I}{4\pi r^2}\cdot\dfrac{a}{r}\cdot 2\pi a$`.</div>
<div class="step">Simplify: `$B = \dfrac{\mu_0 I a^2}{2(a^2+x^2)^{3/2}}$`. At the centre (x = 0) it is `$B = \dfrac{\mu_0 I}{2a}$` (for N turns, `$\dfrac{\mu_0 N I}{2a}$`). Far away (x ≫ a): `$B \approx \dfrac{\mu_0 I a^2}{2x^3}$`.</div>
<div class="step">The direction is given by the right-hand rule: curl the fingers of your right hand the way the current goes round, and the thumb points along B.</div>
</div>

```math
B_{\text{axis}} = \frac{\mu_0 I a^2}{2\,(a^2+x^2)^{3/2}}\qquad B_{\text{centre}} = \frac{\mu_0 N I}{2a}
```

Far from the loop, `$B \approx \dfrac{\mu_0}{4\pi}\dfrac{2(I\pi a^2)}{x^3}$`: this is exactly the field of a small bar magnet of moment `$m = IA$` (Chapter 5). A current loop **is** a magnetic dipole.

<figure class="fig" data-fig="c12p-mag-axis"><figcaption>The field along the axis of one coil, as you change its radius, turns and current. Choose "Pair, d = a" to add a second coil one radius away: the field between the two stays almost flat (Helmholtz coils, used when a lab needs a uniform field). If the coils are too far apart the field dips in the middle.</figcaption></figure>

<div class="problem" data-problem="c12p-mag-loop"></div>

Build the field of any wire shape with the Biot–Savart tool: add the contributions of each piece and read B at any point.

<!--fig:tool biot-savart-->

There are more field pictures in the [Magnetic field mapper](/learn/magnetic-field-mapper/) and the [Coil field designer](/science/coil-field-designer/).

<figure class="fig" data-fig="@em-biot-savart"><figcaption>Compass-needle maps of the field of a straight wire, a loop and a solenoid, computed by adding up the Biot–Savart pieces. Tap anywhere to read B.</figcaption></figure>

## 6. Ampère's circuital law

For fields with a lot of symmetry there is a quicker way than adding pieces. **Ampère's circuital law** says: go round any closed loop in the field, add up `$\vec B\cdot d\vec l$` all the way round, and the total is `$\mu_0$` times the current that passes through the loop:

```math
\oint \vec B\cdot d\vec l = \mu_0\, I_{\text{enclosed}}
```

It does for magnetism what Gauss's law does for electric fields: choose a path where B is constant and along the path, and B comes straight out.

**A long straight wire.** By symmetry the field lines are circles round the wire, with the same B everywhere on a circle of radius r. Go round that circle: `$B\cdot 2\pi r = \mu_0 I$`, so

```math
B = \frac{\mu_0 I}{2\pi r}
```

<figure class="fig" data-fig="c12p-mag-wire"><figcaption>Change the current and the radius of your Ampèrian loop (the dashed circle). The compass arrows lie along the circle, and the graph shows B falling as 1/r. Flip the current direction and the field goes round the other way.</figcaption></figure>

<div class="problem" data-problem="c12p-mag-wire"></div>

**The solenoid.** A solenoid is a long coil wound on a tube: when you wind a wire tightly, the fields of the turns add up inside and nearly cancel outside.

<div class="steps" data-fig="c12p-mag-solsteps">
<div class="step">A long solenoid has n turns per metre and carries current I. Inside, the field is along the axis and uniform; outside, a long solenoid has a field so weak we take it as zero.</div>
<div class="step">Choose a rectangle abcd for Ampère's law: side ab (length h) inside, parallel to the axis; side cd outside; sides bc and da across the windings.</div>
<div class="step">Add `$\vec B\cdot d\vec l$` along the four sides. ab gives `$Bh$`. The sides bc and da give zero (B is at right angles to them inside, and zero outside). cd is outside, so zero. Total: `$\oint \vec B\cdot d\vec l = Bh$`.</div>
<div class="step">The rectangle encloses `$nh$` turns, each carrying I: `$I_{\text{enclosed}} = nhI$`.</div>
<div class="step">Ampère's law: `$Bh = \mu_0 n h I$`, so `$B = \mu_0 n I$`. The h has cancelled, so B is the same everywhere inside, whatever the radius.</div>
<div class="step">Bend the solenoid into a ring (a <b>toroid</b>) of N turns and the field is confined inside the ring: `$B = \dfrac{\mu_0 N I}{2\pi r}$` at radius r, and zero outside.</div>
</div>

```math
B_{\text{solenoid}} = \mu_0 n I \qquad B_{\text{toroid}} = \frac{\mu_0 N I}{2\pi r}
```

At the open end of a long solenoid the field is half this value, `$\mu_0 nI/2$`, because only half of the turns are on one side of the point.

<figure class="fig" data-fig="c12p-mag-solplot"><figcaption>The field along the axis of a real, finite solenoid. In a long one the middle is flat at μ₀nI and the ends drop to half. A short, fat coil never gets a flat part: the idealisation needs length much greater than radius.</figcaption></figure>

<div class="problem" data-problem="c12p-mag-solenoid"></div>

<div class="myth">

**“Ampère's law finds B only from the current inside the loop.”** The law says the *sum* round the loop equals μ₀ times the enclosed current, but the field B at each point comes from **all** the currents, inside and outside. Outside currents just contribute nothing to the total round the loop. When there is lots of symmetry you can pull B out of the integral and the law gives it directly.

</div>

## 7. The force between two parallel currents and the ampere

Wire 1 carries `$I_1$`. At a distance d its field is `$B_1 = \mu_0I_1/2\pi d$`. Wire 2, carrying `$I_2$` alongside, is in that field, so a length L of it feels a force `$F = I_2LB_1$`. Divide by L:

```math
\frac{F}{L} = \frac{\mu_0 I_1 I_2}{2\pi d}
```

If the currents flow the same way the wires **attract**; if opposite, they **repel**. By Newton's third law the two forces are equal and opposite.

<figure class="fig" data-fig="c12p-mag-parallel"><figcaption>Set the two currents, the gap, and whether I₂ flows the same way or the opposite way. The force arrows show attraction or repulsion; the number gives the force on each metre. One ampere in each of two wires one metre apart gives 2×10⁻⁷ N per metre.</figcaption></figure>

<div class="problem" data-problem="c12p-mag-parallel"></div>

This was the old *definition* of the ampere: the steady current that, in two long parallel wires 1 m apart in vacuum, gives a force of `$2\times10^{-7}$` N per metre. (Since 2019 the ampere is fixed by the value of the elementary charge instead, but the result above still holds to a very good approximation.)

## 8. Torque on a current loop; the magnetic dipole

Put a rectangular loop (sides a and b, N turns) in a uniform field B. The forces on the two sides of length b are equal, opposite and not in the same line: a **couple**. The forces on the other two sides pass through the axis and give no torque. If the normal to the loop makes an angle θ with B, the torque is

```math
\tau = N I A B\sin\theta \qquad \vec\tau = \vec m\times\vec B \quad\text{with}\quad \vec m = N I A\,\hat n
```

The quantity `$\vec m$` is the **magnetic dipole moment** of the loop, with unit A m². Its direction is along the normal, given by the right-hand rule (fingers curl with the current, thumb along `$\vec m$`). The torque turns `$\vec m$` towards `$\vec B$`, and it is zero when they are lined up. The formula holds for a loop of any shape.

<figure class="fig" data-fig="c12p-mag-torque"><figcaption>An edge-on view of the loop. Dots and crosses show current coming out and going in. The two forces make a couple that turns m towards B. Change the angle, press Release and watch it swing; change N, I or B and see the torque follow τ = NIAB sin θ.</figcaption></figure>

<figure class="fig" data-fig="@em-loop-torque"><figcaption>A 3D loop between magnet poles. A split-ring commutator reverses the current every half turn so the torque keeps pushing the same way: that is a DC motor.</figcaption></figure>

<div class="problem" data-problem="c12p-mag-torque"></div>

The circular loop is a dipole of moment `$m = IA$`; the atoms and electrons inside a magnet are tiny current loops like this, which is the link to the next chapter.

## 9. The moving coil galvanometer

A **galvanometer** detects and measures small currents. A coil of N turns, free to rotate, hangs between curved pole pieces round a soft iron core. The field is then **radial**, so the plane of the coil is always parallel to B and the torque `$NIAB$` has the same value at every angle. A spring resists with a torque `$k\varphi$`. In balance:

```math
NIAB = k\varphi \quad\Longrightarrow\quad \varphi = \left(\frac{NAB}{k}\right) I
```

The deflection φ is proportional to the current, so the scale is evenly spaced. The **current sensitivity** is `$\varphi/I = NAB/k$`; the **voltage sensitivity** is `$\varphi/V = NAB/(kR)$` with R the resistance of the coil. Adding more turns increases the current sensitivity, but also the resistance, so the voltage sensitivity does not necessarily improve.

<figure class="fig" data-fig="c12p-mag-galvo"><figcaption>Turn the dial through its range with the slider. Then switch the meter to an ammeter or a voltmeter and see the extra resistance appear in the circuit, with its value worked out for the range you choose.</figcaption></figure>

**To make an ammeter** (to measure large currents): connect a small **shunt** resistance S in **parallel** with the galvanometer (resistance G, full-scale current `$I_g$`). At full scale the total current is I, and the coil and shunt have the same voltage:

```math
I_g G = (I - I_g)\,S \quad\Longrightarrow\quad S = \frac{I_g G}{I - I_g}
```

The ammeter's own resistance is tiny, so it hardly changes the current it measures; and it is connected in **series**.

**To make a voltmeter** (to measure voltage): connect a large resistance R in **series** with the galvanometer, so that the full voltage V sends only `$I_g$` through:

```math
V = I_g (G + R) \quad\Longrightarrow\quad R = \frac{V}{I_g} - G
```

The voltmeter has a very high resistance, so it takes almost no current from the circuit; it is connected in **parallel** across the part to be measured.

<div class="problem" data-problem="c12p-mag-shunt"></div>

<div class="problem" data-problem="c12p-mag-voltmeter"></div>

Try different ranges in the conversion tool and see how S and R change:

<!--fig:tool galvanometer-conversion-->

<div class="history">

**Beyond the syllabus (not in the 2023 rationalised NCERT book).** The **cyclotron** accelerates charged particles in a gap between two D-shaped boxes. Because `$f = qB/2\pi m$` does not depend on speed, an alternating voltage of that one frequency pushes the particle each time it crosses the gap, and it spirals outwards on bigger and bigger circles. The maximum speed is limited by the radius R of the machine: `$v_{\max} = qBR/m$`. Not examined for the board exam, but see the entrance lesson below.

</div>

<div class="keypoints">

- Magnetic force on a moving charge: `$\vec F = q\vec v\times\vec B$`, `$F = qvB\sin\theta$`. It is perpendicular to v and B, does no work, and changes direction, not speed. Zero if the charge is at rest or moves along B.
- Lorentz force: `$\vec F = q(\vec E + \vec v\times\vec B)$`. In crossed fields a particle goes straight only if `$v = E/B$` (velocity selector).
- In a uniform B, across the field a charge goes in a circle: `$r = mv/qB$`, `$T = 2\pi m/qB$` (independent of speed). At an angle it goes in a helix, with pitch `$v\cos\theta\,T$`.
- Force on a wire: `$\vec F = I\vec L\times\vec B$`. Biot–Savart: `$dB = \frac{\mu_0}{4\pi}\frac{I\,dl\sin\theta}{r^2}$`.
- Loop: `$B_{\text{centre}} = \mu_0NI/2a$`; on the axis `$B = \mu_0Ia^2/2(a^2+x^2)^{3/2}$`.
- Ampère's law: `$\oint\vec B\cdot d\vec l = \mu_0I_{\text{enc}}$`. Long wire: `$B = \mu_0I/2\pi r$`. Solenoid: `$B = \mu_0nI$` inside, ≈ 0 outside. Toroid: `$B = \mu_0NI/2\pi r$`.
- Parallel currents: same direction attract, opposite repel; `$F/L = \mu_0I_1I_2/2\pi d$`. This defines the ampere.
- Loop in a field: `$\tau = NIAB\sin\theta = mB\sin\theta$`, `$m = NIA$`.
- Galvanometer: `$\varphi\propto I$` (radial field). Ammeter: small shunt in parallel, `$S = I_gG/(I-I_g)$`. Voltmeter: large resistance in series, `$R = V/I_g - G$`.

</div>

Going further for JEE/NEET: [Moving charges and magnetic fields](/learn/courses/engineering-entrance/moving-charges-magnetism/), with the cyclotron, arcs and exam-level problems.
