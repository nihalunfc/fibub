---
title: Magnetism and Matter
seoTitle: 'Magnetism and Matter Class 12 notes and examples'
summary: 'Class 12 Magnetism and Matter: bar magnet, dipole field, torque, Gauss’s law, magnetisation, dia, para and ferromagnets, hysteresis, with animations.'
minutes: 70
updated: 2026-11-22
quiz:
  - q: 'A bar magnet is cut in half across its middle. What do you get?'
    choices: ['two complete magnets, each with a north and a south pole', 'a north-pole piece and a south-pole piece', 'two pieces with no magnetism', 'one magnet and one piece of plain iron']
    ans: 0
    why: 'Magnetic poles never come alone. Every piece, however small, has both a north and a south pole, because the magnetism comes from tiny current loops, not from separate “magnetic charges”.'
  - q: 'At the same large distance from a small bar magnet, the field on its axis compared with the field on its equatorial line is:'
    choices: ['twice as strong', 'half as strong', 'equal', 'four times as strong']
    ans: 0
    why: 'B on the axis = μ₀2m/4πr³; B on the equator = μ₀m/4πr³. The axial value is twice the equatorial value (and the two point in opposite directions).'
  - q: 'Which material is best for the core of a transformer?'
    choices: ['soft iron', 'hard steel', 'copper', 'aluminium']
    ans: 0
    why: 'A transformer core is magnetised and demagnetised 50 times a second. Soft iron has a narrow hysteresis loop (low retentivity and coercivity), so little energy is lost as heat.'
sources:
  - 'NCERT Class 12 Physics, Chapter 5 “Magnetism and Matter” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Curie temperatures (iron 1043 K, cobalt 1388 K, nickel 627 K) and susceptibilities: CRC Handbook of Chemistry and Physics, 97th edition (2016), “Magnetic susceptibility of the elements and inorganic compounds” and “Curie temperature”'
  - 'Earth’s field strength about 25 to 65 µT at the surface: NOAA National Centers for Environmental Information, World Magnetic Model'
---

**Physics · Class 12 · Chapter 5 · about 70 minutes.** By the end you will be able to describe a bar magnet's field, treat it as a current loop, calculate its field and the torque on it, state Gauss's law for magnetism, and explain why some materials are strongly magnetic and others are not, using magnetisation, susceptibility and the hysteresis loop.

<div class="bigidea">Every magnet is really made of moving charge: tiny current loops in its atoms. That one idea explains why poles come in pairs, why a magnet behaves like a coil (a magnetic dipole), and why materials respond to a field in three different ways, from the faint repulsion of water to the strong pull of iron.</div>

## 1. The bar magnet and its field lines

You know a bar magnet attracts iron filings and points north when hung freely. Its two ends are the **north pole** (the end that points north) and the **south pole**. Like poles repel and unlike poles attract.

The magnet's field is mapped by **field lines**: the line through a point shows the direction of B there (the way a tiny compass needle's north end points), and lines close together mean a strong field.

<figure class="fig" data-fig="c12p-matter-bar"><figcaption>The field lines of a bar magnet. Drag the compass: its needle lines up with the field line through it. Switch to iron filings to see the same pattern the way you would in a school lab. Then press <b>Cut the magnet</b>: every piece has both a north and a south pole.</figcaption></figure>

The rules for magnetic field lines:

- They leave the north pole, enter the south pole outside the magnet, and carry on **inside** from S to N. Every line is a **closed loop**.
- The tangent to a line is the direction of B. Two lines never cross, because B has only one direction at a point.
- The closer the lines, the stronger the field (they crowd near the poles).

<div class="myth">

**“Cut a magnet and you get a separate north and south.”** You do not. Cut it again and again: each piece is a complete little magnet with two poles. Nobody has ever found a lone magnetic pole (a magnetic monopole). Electric charges can be separated; magnetic poles cannot.

</div>

Map magnetic fields of different magnets yourself:

<!--fig:tool magnetic-field-mapper-->

## 2. The bar magnet as a magnetic dipole

**A solenoid in disguise.** In Chapter 4 you found that a solenoid (a coil carrying current) has a field outside that looks just like a bar magnet's. That is not a coincidence.

<div class="steps" data-fig="c12p-matter-equiv">
<div class="step">A bar magnet and its field: lines go from the north pole round to the south pole outside.</div>
<div class="step">A solenoid carrying a current has the same pattern of lines outside, with its two ends acting like a north and a south pole.</div>
<div class="step">Put the two side by side: the pictures match. The solenoid is a magnet that you can switch on and off.</div>
<div class="step">Why? A magnet is full of atoms, and each atom has electrons orbiting and spinning: each is a tiny current loop, with its own magnetic moment.</div>
<div class="step">In an iron bar the loops all line up. Inside the bar the currents of neighbouring loops run opposite ways and cancel. Only the current round the surface is left, like the current in one big solenoid.</div>
<div class="step">So a bar magnet has a magnetic dipole moment `$m = NIA$`, along its axis from south to north: the same formula as for a coil.</div>
</div>

The magnetic dipole moment `$\vec m$` (unit A m²) is the one number that tells you how strong a magnet is. For a current loop `$m = NIA$`. For a bar magnet with poles of strength `$\pm q_m$` separated by `$2l$`, `$m = q_m\cdot 2l$`.

**The field of a short bar magnet.** Replace the magnet by its two poles and add their fields, just as you add the fields of two electric charges.

<div class="steps" data-fig="c12p-matter-axial">
<div class="step">Two poles, `$+q_m$` at N and `$-q_m$` at S, are `$2l$` apart. We want B at a point P on the axis, a distance r from the centre.</div>
<div class="step">The north pole is at a distance `$r-l$` from P. It pushes P away: `$B_N = \dfrac{\mu_0}{4\pi}\dfrac{q_m}{(r-l)^2}$`.</div>
<div class="step">The south pole is at a distance `$r+l$`. It pulls P in: `$B_S = \dfrac{\mu_0}{4\pi}\dfrac{q_m}{(r+l)^2}$`, smaller than `$B_N$`.</div>
<div class="step">The two fields point opposite ways along the axis, so the resultant is the difference `$B = B_N - B_S$`, pointing away from N (along `$\vec m$`).</div>
<div class="step">Combine the fractions: `$B = \dfrac{\mu_0 q_m}{4\pi}\cdot\dfrac{4rl}{(r^2-l^2)^2} = \dfrac{\mu_0}{4\pi}\dfrac{2mr}{(r^2-l^2)^2}$`, using `$m = q_m\cdot 2l$`.</div>
<div class="step">For a short magnet (`$r\gg l$`): `$B_{\text{axial}} = \dfrac{\mu_0}{4\pi}\dfrac{2m}{r^3}$`. On the equatorial line the same working gives `$B_{\text{eq}} = \dfrac{\mu_0}{4\pi}\dfrac{m}{r^3}$`, pointing opposite to `$\vec m$`. The axial field is twice the equatorial one.</div>
</div>

```math
B_{\text{axial}} = \frac{\mu_0}{4\pi}\,\frac{2m}{r^3}\qquad B_{\text{equatorial}} = \frac{\mu_0}{4\pi}\,\frac{m}{r^3}
```

<div class="meaning">
<dl>
<dt>m</dt><dd>magnetic dipole moment, in A m² (= J/T)</dd>
<dt>r</dt><dd>distance from the centre of the magnet, much larger than its length</dd>
<dt>μ₀/4π</dt><dd>`$10^{-7}$` T m/A</dd>
<dt>Physical meaning</dt><dd>A dipole's field falls as `$1/r^3$`, much faster than the `$1/r$` of a long wire or the `$1/r^2$` of a single point charge, because the north and south poles almost cancel each other's field far away. It is stronger along the axis than on the side.</dd>
</dl>
</div>

<figure class="fig" data-fig="c12p-matter-dipole"><figcaption>The two fields against distance, on a log scale: both fall along straight lines (a 1/r³ law) and the axial line always sits exactly twice as high. Change the moment m or the distance r.</figcaption></figure>

<div class="problem" data-problem="c12p-matter-axial"></div>

<div class="problem" data-problem="c12p-matter-equatorial"></div>

## 3. A magnet in a uniform magnetic field

Hang a bar magnet in a uniform field B. Each pole feels a force of the same size and opposite direction (`$\pm q_mB$`), so there is **no net force**, but the two forces make a couple, and the magnet turns until it lines up with the field. This is how a compass works.

```math
\vec\tau = \vec m\times\vec B \qquad \tau = mB\sin\theta
```

The torque is largest when the magnet is across the field (θ = 90°) and zero when it is along it (θ = 0° or 180°). To turn the magnet against the torque takes work, stored as potential energy:

```math
U = -\vec m\cdot\vec B = -mB\cos\theta
```

The energy is lowest (`$-mB$`) when `$\vec m$` points along B: **stable** equilibrium. It is highest (`$+mB$`) when `$\vec m$` points against B: **unstable** equilibrium, like a pencil balanced on its tip.

<figure class="fig" data-fig="c12p-matter-torque"><figcaption>The magnet swings like a pendulum. Move the angle slider to choose where to start, press Release, and watch the ball roll in the energy well U = −mB cos θ. Make B stronger and the swing gets faster, as T = 2π√(J/mB).</figcaption></figure>

<div class="problem" data-problem="c12p-matter-torque"></div>

<div class="problem" data-problem="c12p-matter-work"></div>

For small swings, `$\tau = -mB\theta$` is like a spring's restoring force, so the oscillation is simple harmonic with period `$T = 2\pi\sqrt{J/mB}$`, where J is the moment of inertia. Measuring T for a magnet in the Earth's field is a classic way to compare field strengths.

<div class="problem" data-problem="c12p-matter-period"></div>

## 4. Magnetism and Gauss's law

The electric field has Gauss's law: the net flux through a closed surface equals the enclosed charge divided by ε₀. The magnetic version is simple:

```math
\oint \vec B\cdot d\vec A = 0
```

The net magnetic flux through **any** closed surface is zero. Every field line that goes out of the surface must come back in somewhere else, because lines are closed loops with no beginning or end. This is the same as saying there are no magnetic monopoles to act as a "source" or a "sink" of lines.

<figure class="fig" data-fig="c12p-matter-gauss"><figcaption>Move the source across the dashed closed surface and count the lines going out and coming in. For a bar magnet the two counts are always equal. Switch to an electric charge: with the charge inside, every line goes out and the net is not zero.</figcaption></figure>

## 5. Magnetisation and magnetic intensity

Put a material in a solenoid. The current makes a field, but the atoms in the material respond too, and add their own.

<div class="steps" data-fig="c12p-matter-hdef">
<div class="step">An empty solenoid with n turns per metre and current I has `$B_0 = \mu_0 n I$`.</div>
<div class="step">Fill it with a material. Its atoms are tiny magnets, pointing every which way, so at first the net moment is zero.</div>
<div class="step">The field turns the atomic magnets towards its own direction. The net moment per unit volume is the <b>magnetisation</b> M (unit A/m).</div>
<div class="step">The aligned atoms make a field of their own, `$\mu_0 M$`, which adds to the field of the current: `$B = B_0 + \mu_0 M$`.</div>
<div class="step">Call the part due to the current alone the <b>magnetic intensity</b> `$H = nI$` (unit A/m), so `$B_0 = \mu_0 H$`, and `$B = \mu_0(H + M)$`.</div>
<div class="step">For many materials M is proportional to H: `$M = \chi H$`. The constant χ is the <b>magnetic susceptibility</b>, so `$B = \mu_0(1+\chi)H = \mu_0\mu_r H = \mu H$`, with the <b>relative permeability</b> `$\mu_r = 1+\chi$`.</div>
</div>

```math
\vec B = \mu_0(\vec H + \vec M)\qquad \vec M = \chi\vec H \qquad \mu_r = 1+\chi
```

<div class="meaning">
<dl>
<dt>H</dt><dd>magnetic intensity: the field set up by the free (conduction) current, in A/m</dd>
<dt>M</dt><dd>magnetisation: magnetic moment per unit volume of the material, in A/m</dd>
<dt>χ</dt><dd>susceptibility: how readily the material is magnetised by H (a pure number)</dd>
<dt>μr</dt><dd>relative permeability: how many times the material multiplies the field compared with vacuum</dd>
<dt>Physical meaning</dt><dd>H is "what you put in" with the current; M is "what the material adds"; B is the total field you get.</dd>
</dl>
</div>

<div class="problem" data-problem="c12p-matter-chi"></div>

## 6. Diamagnetic, paramagnetic and ferromagnetic materials

Materials fall into three groups, by their susceptibility.

| Kind | χ | μr | Behaviour in a field | Examples |
|---|---|---|---|---|
| **Diamagnetic** | small, negative (about −10⁻⁵) | slightly below 1 | weakly repelled; the field inside is a little weaker | bismuth, copper, silver, water, gold, diamond |
| **Paramagnetic** | small, positive (about 10⁻⁵ to 10⁻³) | slightly above 1 | weakly attracted; the field inside is a little stronger | aluminium, sodium, oxygen, platinum, copper chloride |
| **Ferromagnetic** | large, positive (hundreds to thousands, and changes with H) | much bigger than 1 | strongly attracted; can stay magnetised | iron, cobalt, nickel, and their alloys |

**Diamagnetism** is in all materials. In an atom with all its electron moments cancelling, the applied field induces a tiny opposing moment (Lenz's law again), so the material is pushed away from the strong part of the field. It shows up only when the stronger effects are missing.

**Paramagnetism**: atoms have permanent moments, but pointing randomly. A field lines a few of them up (heat keeps knocking them out of line), so the material is weakly attracted. Hotter means more shaking and weaker response: **Curie's law**, `$\chi = C/T$`.

**Ferromagnetism**: in iron, neighbouring atomic moments lock together in small patches called **domains** (about a micrometre in size), where all moments point the same way. Without a field the domains point in different directions and cancel. A field makes the domains that agree with it grow and the others shrink, until all point one way: saturation.

<figure class="fig" data-fig="c12p-matter-domains"><figcaption>An iron bar as a patchwork of domains. Raise the applied H: more and more domains turn to point along it, and the magnetisation climbs until every domain is aligned (saturation). The curve is not a straight line, so a ferromagnet has no single value of χ.</figcaption></figure>

<figure class="fig" data-fig="@em-mag-types"><figcaption>Atomic moments in a diamagnet, a paramagnet and a ferromagnet, as you change the field and the temperature.</figcaption></figure>

Heat destroys the order. Above its **Curie temperature** a ferromagnet turns paramagnetic: iron at 1043 K (770 °C), nickel at 631 K, cobalt at 1388 K.

<figure class="fig" data-fig="c12p-matter-curie"><figcaption>Heat a paramagnet and its moments shake out of line, so χ falls as 1/T. Switch to iron: below 1043 K its moments stay lined up on their own, the order fading as it warms; above it, iron is just another paramagnet.</figcaption></figure>

<div class="problem" data-problem="c12p-matter-curie"></div>

Compare real materials and their susceptibilities in the tool below:

<!--fig:tool magnetic-materials-->

<div class="myth">

**“A paramagnet and a ferromagnet differ only in how strong they are.”** There is a real difference in kind. In a paramagnet each atom acts alone, and the magnetism vanishes when the field is removed. In a ferromagnet the atoms cooperate in domains, so it can stay magnetised with no field at all, up to the Curie temperature.

</div>

## 7. Hysteresis, permanent magnets and electromagnets

Magnetise a piece of iron by taking H up from zero, then down, then reverse it, then up again. B does not retrace its path: it **lags behind** H. This lag is called **hysteresis** (from a Greek word for "coming late"), and the closed curve of B against H is the **hysteresis loop**.

<figure class="fig" data-fig="c12p-matter-hysteresis"><figcaption>The loop is traced as H cycles up and down. Where H returns to zero, B keeps a value: the <b>retentivity</b> B<sub>r</sub>. A reverse field of size H<sub>c</sub>, the <b>coercivity</b>, is needed to bring B to zero. Switch between soft iron (a narrow loop) and steel (a wide one).</figcaption></figure>

The area inside the loop is the energy lost, as heat, **per unit volume in each cycle** of magnetisation.

- **Retentivity** `$B_r$`: the B left behind when H is brought back to zero.
- **Coercivity** `$H_c$`: the reverse H needed to reduce B to zero.
- The loop area = energy lost per cycle per unit volume.

This decides what a material is good for:

| Use | What it needs | Material |
|---|---|---|
| **Permanent magnet** (loudspeaker, compass, fridge magnet) | high retentivity, high coercivity: strong and hard to demagnetise | steel, alnico, neodymium alloys |
| **Electromagnet** (crane, relay, bell) | high permeability, low retentivity, low coercivity: strong when the current is on and off when it is off | soft iron |
| **Transformer and motor cores** | narrow loop, so little heat each cycle (the field is reversed 100 times a second) | soft iron, silicon steel |

An **electromagnet** is a solenoid with a soft iron core: the core multiplies the field of the coil by `$\mu_r$` (hundreds or thousands), and when the current is switched off, nearly all the magnetism disappears.

A magnetic circuit with an iron path acts like an electric circuit: [Magnetic circuit solver](/science/magnetic-circuit/).

<div class="history">

**Beyond the syllabus (not in the 2023 rationalised NCERT book).** **The Earth as a magnet.** The Earth's field is like that of a huge bar magnet tilted by about 10° to the spin axis (with its south pole near geographic north). At any place it is described by three magnetic elements: the **declination** (angle between magnetic and geographic north), the **dip** (angle the field makes with the horizontal; 0° at the magnetic equator and 90° at the poles) and the **horizontal component** `$B_H$`. The field strength at the surface is 25 to 65 µT.

</div>

<figure class="fig" data-fig="@em-earth-dip"><figcaption>The Earth as a dipole, with a dip needle at different latitudes. Optional: this is beyond the board syllabus.</figcaption></figure>

<div class="keypoints">

- Magnetic poles always come in pairs. Field lines are closed loops (S to N inside the magnet) that never cross; a compass shows their direction.
- A bar magnet is equivalent to a solenoid; magnetic moment `$m = NIA$` (loop) or `$q_m\cdot 2l$` (magnet), unit A m².
- Short magnet: `$B_{\text{axial}} = \frac{\mu_0}{4\pi}\frac{2m}{r^3}$` and `$B_{\text{eq}} = \frac{\mu_0}{4\pi}\frac{m}{r^3}$` (opposite to m); axial = 2 × equatorial.
- In a uniform field: no net force, `$\tau = mB\sin\theta$`, `$U = -mB\cos\theta$`. Stable at θ = 0, unstable at θ = 180°. Small swings: `$T = 2\pi\sqrt{J/mB}$`.
- Gauss's law for magnetism: `$\oint\vec B\cdot d\vec A = 0$`. No monopoles.
- `$B = \mu_0(H+M)$`, `$M = \chi H$`, `$\mu_r = 1+\chi$`.
- Dia: χ small, negative. Para: χ small, positive, `$\chi = C/T$`. Ferro: χ large, positive, domains; becomes paramagnetic above the Curie temperature.
- Hysteresis: retentivity, coercivity, loop area = energy loss per cycle. Permanent magnets: wide loop (steel). Electromagnets and transformer cores: narrow loop (soft iron).

</div>

Going further for JEE/NEET: [Magnetism and matter](/learn/courses/engineering-entrance/magnetism-matter/), with Earth's magnetism and exam-level problems.
