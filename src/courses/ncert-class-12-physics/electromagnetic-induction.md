---
title: Electromagnetic Induction
seoTitle: 'Electromagnetic Induction Class 12 notes'
summary: 'Class 12 Electromagnetic Induction: Faraday and Lenz, motional emf, eddy currents, self and mutual inductance, the AC generator, with animations.'
minutes: 90
updated: 2026-11-22
quiz:
  - q: 'The flux through a coil of 100 turns changes from 0.05 Wb to 0.02 Wb in 0.3 s. The magnitude of the induced emf is:'
    choices: ['10 V', '1 V', '0.1 V', '100 V']
    ans: 0
    why: 'ε = N ΔΦ/Δt = 100 × 0.03 ÷ 0.3 = 10 V.'
  - q: 'A magnet is pushed towards a closed ring with its north pole first. The ring will:'
    choices: ['repel the magnet, because its near face becomes a north pole', 'attract the magnet, because its near face becomes a south pole', 'have no effect on the magnet', 'attract the magnet, because its near face becomes a north pole']
    ans: 0
    why: 'By Lenz’s law the induced current opposes the approach of the magnet, so the near face of the ring acts as a north pole and repels it.'
  - q: 'A coil rotates in a uniform field. At the instant the plane of the coil is perpendicular to the field, the induced emf is:'
    choices: ['zero', 'maximum', 'half of the maximum', 'equal to NBA']
    ans: 0
    why: 'The flux is at its maximum there, where it is momentarily not changing (dΦ/dt = 0), so the emf is zero. The emf is greatest when the plane is parallel to the field.'
sources:
  - 'NCERT Class 12 Physics, Chapter 6 “Electromagnetic Induction” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Faraday’s law and Lenz’s law, inductance of a solenoid: standard results; SI definitions of the weber, henry and tesla, The International System of Units (SI), 9th edition, BIPM, 2019'
---

**Physics · Class 12 · Chapter 6 · about 90 minutes.** By the end you will be able to find an induced emf from Faraday's law, predict its direction with Lenz's law, work out the emf of a moving rod and of a rotating coil, explain eddy currents, and calculate self and mutual inductance and the energy in an inductor.

<div class="bigidea">A changing magnetic flux through a loop makes an emf in it: ε = −dΦ/dt. Nature adds a rule, Lenz's law: the induced current always flows so as to oppose the change that caused it. That minus sign is conservation of energy. Everything in this chapter, from the dynamo to the transformer to the induction cooker, is one law applied in different ways.</div>

## 1. Faraday's experiments

In 1831 Michael Faraday (and Joseph Henry in America, at about the same time) found that a magnet can make a current, with no battery. Connect a coil to a sensitive galvanometer and:

<div class="steps" data-fig="c12p-emi-faraday">
<div class="step">A bar magnet at rest near the coil: the galvanometer shows nothing.</div>
<div class="step">Push the magnet towards the coil: the needle kicks one way while the magnet moves.</div>
<div class="step">Keep the magnet still inside the coil: the needle returns to zero, though the field through the coil is strong.</div>
<div class="step">Pull the magnet out: the needle kicks the other way.</div>
<div class="step">Move the magnet faster: the kick is bigger. Use a stronger magnet or more turns: the kick is bigger again.</div>
<div class="step">Keep the magnet fixed and move the coil instead: exactly the same. (A second coil whose current is switched on and off gives the same result.) Only the relative change matters.</div>
</div>

What is common? In every case the **magnetic flux through the coil was changing**. A strong steady field gives nothing; a changing field gives an emf and, in a closed circuit, a current.

Reproduce Faraday's experiment on the screen:

<!--fig:tool faraday-induction-->

## 2. Magnetic flux

Think of the field lines as streams of water and the coil as a hoop dipped into it. The **magnetic flux** is how much "stream" passes through the hoop. For a flat area A in a uniform field B, with the normal to the area at an angle θ to B:

```math
\Phi = \vec B\cdot\vec A = B A\cos\theta
```

The unit is the **weber (Wb)**: 1 Wb = 1 T m². For a curved surface or a non-uniform field, add up $\vec B\cdot d\vec A$ over small pieces.

<div class="meaning">
<dl>
<dt>B</dt><dd>magnetic field, in tesla</dd>
<dt>A</dt><dd>area of the loop, in m², with the direction of the area vector along its normal</dd>
<dt>θ</dt><dd>angle between B and the normal to the loop</dd>
<dt>Physical meaning</dt><dd>Φ counts how many field lines thread the loop. Face the loop square-on to the field (θ = 0) and it catches the most; turn it edge-on (θ = 90°) and it catches none. Flux can be changed three ways: change B, change A, or change θ.</dd>
</dl>
</div>

<figure class="fig" data-fig="c12p-emi-flux"><figcaption>Tilt the coil and see how many field lines pass through it (the coloured ones). The graph shows Φ = BA cos θ. Press Spin: the flux curve is a cosine, and the emf, which is its slope with a minus sign, is a sine curve a quarter-turn ahead.</figcaption></figure>

<div class="problem" data-problem="c12p-emi-flux"></div>

## 3. Faraday's law of induction

The emf induced in a coil equals the negative of the rate of change of the flux linked with it:

```math
\varepsilon = -\,N\,\frac{d\Phi}{dt}
```

where N is the number of turns (each turn sees the same flux, so the emfs add). If the circuit has resistance R, the induced current is $I = \varepsilon/R$, and the charge that flows in a time Δt is $\Delta q = I\Delta t = N\Delta\Phi/R$, **independent of how fast** the flux changed.

<figure class="fig" data-fig="c12p-emi-coil"><figcaption>A magnet swinging through a coil. The top graph is the flux Φ(t); the lower one is the emf, which is the (negative) slope of the top graph. The emf is zero when the flux is at its peak, and biggest where the flux changes fastest. More turns, bigger emf.</figcaption></figure>

<div class="problem" data-problem="c12p-emi-faraday"></div>

<div class="myth">

**“A strong magnetic field through a coil induces a large emf.”** It is not the size of the flux but how fast it changes. A huge steady flux gives zero emf; a tiny flux that changes very quickly can give a large one.

</div>

## 4. Lenz's law and conservation of energy

The minus sign in Faraday's law carries the direction rule found by Heinrich Lenz: **the induced current flows in the direction that opposes the change in flux that produces it.**

<div class="steps" data-fig="@em-lenz-steps">
<div class="step">A magnet far above a coil: no change in flux, no current.</div>
<div class="step">As the magnet approaches, the flux through the coil is growing.</div>
<div class="step">The coil opposes the growth: its current makes a field pointing the other way inside the coil, here up.</div>
<div class="step">That field makes the top face of the coil a north pole, which repels the approaching magnet. You must do work against this push, and that work becomes the energy of the current.</div>
<div class="step">When the magnet leaves, the flux falls, so the current reverses: the coil now tries to keep the flux up and pulls the magnet back.</div>
</div>

Why must it be so? Suppose the induced current helped the change instead. Pushing a magnet towards a coil would produce a current whose field pulls the magnet in faster, which makes more current: free energy from nothing, ever growing. That cannot happen, so the induced current has to oppose. **Lenz's law is conservation of energy.** You can use it like this:

1. Decide whether the flux through the loop is growing or shrinking, and in which direction it points.
2. The induced current's own field opposes the **change**: it points against a growing flux and along a shrinking one.
3. Use the right-hand rule on that field to find the direction of the current.

<figure class="fig" data-fig="@em-lenz-fall"><figcaption>A magnet dropped through a closed coil falls more slowly than one that falls through an open (cut) coil, because the induced current pushes back. The graph shows the emf.</figcaption></figure>

## 5. Motional emf

Slide a straight conducting rod of length l at speed v across a uniform field B (with B, the rod and v at right angles). The free charges in the rod move with it, so the magnetic force on each is $qvB$ along the rod. They drift to one end, leaving the other end charged oppositely, until an electric field balances the magnetic force. The rod has become a battery.

<div class="steps" data-fig="c12p-emi-motional">
<div class="step">A rod of length l slides at speed v on rails in a field B into the page.</div>
<div class="step">The free charges are moving with the rod, so the magnetic force $F = qvB$ acts on each, along the rod.</div>
<div class="step">The work done on a charge q carried a distance l along the rod is $F\,l = qvBl$. The work per unit charge is the emf: $\varepsilon = Blv$.</div>
<div class="step">Joined to a resistor R by the rails, a current $I = Blv/R$ flows (anticlockwise here, by Lenz's law).</div>
<div class="step">The rod is now a current in a field, so it feels a force $F = IlB = \dfrac{B^2l^2v}{R}$, which opposes the motion (Lenz's law again). You must pull with this force to keep it going at constant speed.</div>
<div class="step">The power you supply is $Fv = \dfrac{B^2l^2v^2}{R}$. The power turned to heat in the resistor is $I^2R = \dfrac{B^2l^2v^2}{R}$. They are equal: energy is conserved.</div>
</div>

**The same answer from Faraday's law.** The area of the circuit grows as the rod moves: in a time $dt$ the rod covers $dx = v\,dt$, adding an area $l\,dx$. The flux is $\Phi = Blx$, so $\varepsilon = d\Phi/dt = Bl\,dx/dt = Blv$. The two routes agree.

```math
\varepsilon = Blv\qquad I = \frac{Blv}{R}\qquad F = \frac{B^2l^2v}{R}\qquad P = Fv = I^2R
```

<figure class="fig" data-fig="c12p-emi-rails"><figcaption>Pull the rod along the rails: change the speed, the field, the length of the rod and the resistance. The numbers for emf, current, braking force and power update together. Double v and the power quadruples.</figcaption></figure>

<div class="problem" data-problem="c12p-emi-motional"></div>

<div class="problem" data-problem="c12p-emi-rails"></div>

Move the rod and the field around in the tool, and read the emf:

<!--fig:tool motional-emf-->

Think of a bicycle wheel dynamo: it is this rod, bent into a rotating loop, making the light in front glow.

## 6. Eddy currents

Not every changing flux is in a neat wire loop. When a solid piece of metal sits in a changing magnetic field, or moves through a field, swirling currents are induced in the metal. These are **eddy currents** (like eddies in a river).

By Lenz's law they oppose the change. A metal plate swung between the poles of a magnet is braked by its own eddy currents.

<figure class="fig" data-fig="c12p-emi-eddy"><figcaption>A pendulum with a solid plate passing through a magnetic field: eddy currents appear as it enters and leaves, and it is braked. A plate with slots, which break up the loops, is damped much less.</figcaption></figure>

**Uses.** Electromagnetic brakes (in metro trains and roller coasters, no friction to wear out), induction cookers (the changing field heats the steel pan directly), induction furnaces, and damping in the needles of meters. **Where we want to avoid them:** the cores of transformers and motors, which are built from thin insulated sheets (laminations), so the eddy loops are small and the heat wasted is small.

## 7. Inductance

### Mutual inductance

Two coils placed near each other. A changing current $I_1$ in coil 1 makes a changing flux through coil 2, and so an emf in it:

```math
\varepsilon_2 = -M\,\frac{dI_1}{dt}\qquad \Phi_2 = M I_1
```

The constant M is the **mutual inductance**, in **henry (H)**: 1 H = 1 Wb/A = 1 V s/A. It depends on the shapes, the number of turns, the distance between the coils, and the material between them (an iron core greatly increases it). This is how a transformer works.

<figure class="fig" data-fig="c12p-emi-mutual"><figcaption>A triangle-wave current in coil 1 produces a steady emf in coil 2 during each rise or fall. Pull the coils apart: fewer lines link them, the coupling k falls, and so does M and the emf. Change the rate and the emf follows.</figcaption></figure>

### Self-inductance

A coil does not need a second coil: a changing current in a coil changes the flux through the coil itself, and induces an emf in it, which opposes the change in current (Lenz). This is **self-induction**:

```math
\varepsilon = -L\,\frac{dI}{dt}\qquad \Phi_{\text{linked}} = L I
```

L is the **self-inductance**, also in henry. An inductor acts like inertia for current: it resists any sudden change in current, just as a heavy flywheel resists any change in speed.

<div class="steps" data-fig="c12p-emi-lsteps">
<div class="step">A long solenoid of n turns per metre, cross-section A and length l.</div>
<div class="step">When it carries a current I, the field inside is $B = \mu_0 nI$, so the flux through one turn is $\Phi = BA = \mu_0 nIA$.</div>
<div class="step">The total number of turns is $N = nl$, each linked with this flux, so the flux linkage is $N\Phi = (nl)(\mu_0 nIA) = (\mu_0 n^2 A l)\,I$.</div>
<div class="step">Compare with $N\Phi = LI$: $L = \mu_0 n^2 A\,l = \dfrac{\mu_0 N^2 A}{l}$. It depends only on the shape and the number of turns, not on the current.</div>
<div class="step">Fill the solenoid with a material of relative permeability $\mu_r$: $L = \mu_r\mu_0 n^2 A l$. An iron core multiplies L by hundreds or thousands.</div>
<div class="step">Energy: raising the current from 0 to I against the back emf takes work $dW = |\varepsilon|\,I\,dt = LI\,dI$, so the energy stored is $U = \int_0^I LI\,dI = \tfrac12 LI^2$. It is stored in the magnetic field: $u = B^2/2\mu_0$ per unit volume.</div>
</div>

```math
L = \frac{\mu_0 N^2 A}{l}\qquad U = \tfrac12 L I^2
```

<div class="problem" data-problem="c12p-emi-inductance"></div>

<div class="problem" data-problem="c12p-emi-energy"></div>

**Growth of current in an LR circuit.** Close the switch in a circuit with a battery V, a resistor R and an inductor L. The current cannot jump up at once, because the back emf $L\,dI/dt$ opposes the rise: at the first instant the back emf equals V and I = 0. As I grows, the back emf falls:

```math
I(t) = \frac{V}{R}\left(1-e^{-t/\tau}\right)\qquad \tau = \frac{L}{R}
```

After one time constant τ the current has reached 63% of its final value V/R.

<figure class="fig" data-fig="c12p-emi-selfind"><figcaption>Change L and R and watch the current climb and the back emf fall away. A bigger L, or a smaller R, makes the rise slower. The readout gives the stored energy ½LI² at each moment.</figcaption></figure>

<div class="problem" data-problem="c12p-emi-rl"></div>

Explore inductors and the time constant in the lab:

<!--fig:tool inductance-lab-->

More calculators: [Capacitor and inductor calculator](/science/capacitor-inductor-calculator/).

## 8. The AC generator

A coil of N turns and area A, spun at angular speed ω in a uniform field B, is the heart of every power station. At time t the angle between the normal and the field is $\theta = \omega t$, so the flux is

```math
\Phi = NBA\cos\omega t \qquad \varepsilon = -\frac{d\Phi}{dt} = NBA\omega\sin\omega t = \varepsilon_0\sin\omega t
```

The emf alternates: it changes sign twice per turn, with peak value $\varepsilon_0 = NBA\omega$ and frequency $f = \omega/2\pi$ (50 Hz in India, so the coil turns 50 times a second, or its equivalent in a multi-pole machine). The emf is zero when the coil faces the field (flux greatest) and greatest when the coil's plane is parallel to the field (flux changing fastest). Slip rings carry the current to the outside, and in a power station steam, water or wind turns the coil (or the magnet).

<figure class="fig" data-fig="@em-generator"><figcaption>A 3D generator coil with its flux and emf graphs. Drag to turn it. The emf is a sine curve, a quarter-turn ahead of the flux.</figcaption></figure>

<div class="problem" data-problem="c12p-emi-generator"></div>

<div class="history">

<ul class="timeline">
<li><b>1831</b> Faraday discovers induction with a coil and a magnet, and builds the first disc dynamo that year. Joseph Henry makes the same discovery independently, and also discovers self-induction.</li>
<li><b>1834</b> Heinrich Lenz states his rule for the direction of the induced current.</li>
<li><b>1882</b> Edison's Pearl Street station in New York is the first big power station, using generators like this chapter's coil. (It used direct current; alternating current, helped by the transformer, took over for long-distance supply within a few years.)</li>
<li><b>1855</b> Léon Foucault finds that a copper disc spun between the poles of a magnet is braked and heated by currents in the metal itself: eddy (Foucault) currents.</li>
</ul>

</div>

<div class="keypoints">

- Flux $\Phi = BA\cos\theta$ (unit weber, 1 Wb = 1 T m²). Change B, A or θ to change the flux.
- Faraday's law: $\varepsilon = -N\,d\Phi/dt$. The induced charge $\Delta q = N\Delta\Phi/R$ does not depend on the time taken.
- Lenz's law: the induced current opposes the change in flux. It is conservation of energy.
- Motional emf: $\varepsilon = Blv$. With resistance R: $I = Blv/R$, braking force $F = B^2l^2v/R$, power $P = Fv = I^2R$.
- Eddy currents are induced in solid metal by a changing flux. They brake motion (brakes, cookers, damping) but waste energy in cores, which are laminated.
- Mutual inductance: $\varepsilon_2 = -M\,dI_1/dt$. Self-inductance: $\varepsilon = -L\,dI/dt$, $\Phi = LI$. Unit: henry.
- Solenoid: $L = \mu_0N^2A/l$ (times $\mu_r$ with a core). Energy $U = \tfrac12LI^2$, density $B^2/2\mu_0$.
- LR circuit: $I = (V/R)(1-e^{-t/\tau})$, $\tau = L/R$.
- AC generator: $\varepsilon = NBA\omega\sin\omega t$; peak $NBA\omega$.

</div>

Going further for JEE/NEET: [Electromagnetic induction](/learn/courses/engineering-entrance/electromagnetic-induction/), with exam-level rod, ring and LR problems.
