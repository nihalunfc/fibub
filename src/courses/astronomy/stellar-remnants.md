---
title: "How stars die: white dwarfs, neutron stars and black holes"
seoTitle: "White dwarfs, neutron stars and black holes | Astronomy"
summary: "When fusion stops, a star's core collapses until something holds it up. Light cores become Earth-sized white dwarfs; heavier ones become city-sized neutron stars after a supernova; the heaviest become black holes."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "What will the Sun become at the end of its life?"
    choices: ["A black hole", "A neutron star", "A white dwarf"]
    ans: 2
    why: "The Sun's core will be well under 1.4 solar masses, so it ends as a white dwarf."
  - q: "The Schwarzschild radius of a black hole with 10 solar masses is about:"
    choices: ["3 km", "30 km", "300 km"]
    ans: 1
    why: "About 3 km per solar mass, so about 30 km."
  - q: "A neutron star is held up by:"
    choices: ["Gas pressure from fusion", "Neutrons resisting being packed closer", "Its fast spin"]
    ans: 1
    why: "Quantum rules stop neutrons from being squeezed into the same state: neutron degeneracy pressure."
sources:
  - "Chandrasekhar, S. (1931), ApJ 74, 81 (white dwarf mass limit)"
---

**Module 3 · about 25 minutes · read first: [3.3 How stars shine and age](/learn/courses/astronomy/how-stars-shine/), [2.2 Newton's gravity and orbital speed](/learn/courses/astronomy/newtons-gravity/) · maths: density and the Schwarzschild radius.** You'll be able to tell the three kinds of dead star apart, explain which star ends up as which, and work out their sizes and densities.

<div class="bigidea">When fusion stops, a star's core collapses until something can hold it up: light cores become Earth-sized white dwarfs, heavier ones city-sized neutron stars after a supernova, and the heaviest black holes.</div>

## 1. Why this matters

Dead stars are some of the strangest objects in nature, and natural laboratories for physics we can't test on Earth. They also matter for us: supernovae spread the heavy elements that make planets and people, white dwarf explosions measure the expansion of the universe (in the [cosmology course](/learn/courses/cosmology/)), and colliding neutron stars make gold and send out gravitational waves.

## 2. Three endings

When a star's core runs out of fuel, nothing holds up its weight and it shrinks until a new kind of pressure stops it.

- **White dwarf**: for cores below about 1.4 Suns (the **Chandrasekhar limit**). Squeezed electrons hold it up. About the size of Earth. Stars up to about 8 Suns end this way, puffing their outer layers off as a glowing **planetary nebula**.
- **Neutron star**: heavier cores collapse in a fraction of a second. Electrons are pushed into protons to make neutrons, and the rebound blasts the star apart as a **supernova**. What is left is about 20 km across. Spinning ones we see as **pulsars**.
- **Black hole**: above about 2 to 3 Suns, nothing can stop the collapse. Gravity becomes so strong that not even light escapes from inside the **event horizon**.

<!--fig:remnants-->

Things to notice:

- Heavier white dwarfs are smaller: adding mass squeezes them more.
- Jumping from white dwarf to neutron star shrinks the size by about 500 times.
- A black hole's horizon grows in step with its mass.

Follow three cores as their fuel runs out:

<div class="steps">
<div class="step"><b>Fusion ends.</b> Without its heat, gravity wins and the core starts to shrink.</div>
<div class="step"><b>Sun-like star.</b> The core stops at about Earth's size, held up by electrons that refuse to be squeezed closer (degeneracy pressure). A white dwarf: a teaspoon weighs tonnes.</div>
<div class="step"><b>Heavier core, over 1.4 Suns.</b> Electrons cannot hold it. In a split second electrons and protons merge into neutrons. The collapse stops at about 20 km wide and the rebound blows the star apart: a supernova.</div>
<div class="step"><b>A neutron star.</b> More mass than the Sun in a ball the size of a city, often spinning many times a second: a pulsar.</div>
<div class="step"><b>The heaviest cores.</b> Nothing can stop the collapse. A black hole forms, with an event horizon of radius 2GM/c², about 3 km per solar mass.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Density** from mass and radius (Lesson 2.5): `$\rho = M / (\tfrac{4}{3}\pi R^3)$`.

**Schwarzschild radius**, the size of a black hole's event horizon:

```math
R_s = \frac{2GM}{c^2} \approx 2.95\ \text{km}\times\frac{M}{M_\odot}
```

It comes from asking where the escape speed `$\sqrt{2GM/r}$` (Lesson 2.2) reaches the speed of light.

**Try it:** a 1 solar-mass white dwarf of radius 5,800 km: `$\rho = 1.99\times10^{30}/(\tfrac{4}{3}\pi\times(5.8\times10^{6})^3) = 2.4\times10^{9}$` kg/m³, so a teaspoon (5 mL) weighs 12 tonnes.
</details>

Pick a mass and press Play or slide the stage. The dot follows the star's track across the HR diagram.

<figure class="fig" data-fig="@astro-hr-evolve"><figcaption>A star spends most of its life on the main sequence, then swells into a giant as hydrogen runs out. The 20 solar-mass star lives about a million times faster than a red dwarf, and its end is a supernova; the 1 and 5 solar-mass stars end as white dwarfs. Tracks are schematic.</figcaption></figure>

## 3. What it means physically

The pressure that holds up white dwarfs and neutron stars is not heat but a quantum rule: two electrons (or two neutrons) can't occupy the same state, so packing them closer forces them to move faster, which pushes back. This pressure has a limit. Past it, the particles would need to move faster than light, so gravity wins. A black hole isn't a cosmic vacuum cleaner; from far away its gravity is the same as any object of the same mass. Only very close does it become a point of no return.


<div class="meaning">

<dl>
<dt>M<sub>Ch</sub> ≈ 1.4 M☉</dt><dd>Chandrasekhar limit: the heaviest a white dwarf can be.</dd>
<dt>ρ = M / (4/3 πR³)</dt><dd>Density of the remnant.</dd>
<dt>R<sub>s</sub> = 2GM/c²</dt><dd>Event-horizon radius: where the escape speed reaches the speed of light.</dd>
<dt>Physical meaning</dt><dd>Each remnant is gravity fighting a different wall. For white dwarfs the wall is electrons crowding together; for neutron stars it is neutrons crowding; for black holes no wall is strong enough. The event horizon is not a surface, just the distance inside which not even light can climb out.</dd>
</dl>

</div>

<div class="myth">

**"Black holes suck everything in like a vacuum cleaner."** From far away a black hole pulls exactly like any star of the same mass. If the Sun became a black hole of the same mass, Earth would keep orbiting just as it does now (though it would be very dark and cold).

</div>

Slide the impact parameter b, switch between one ray and a fan, and set the radius for the escape speed readout.

<figure class="fig" data-fig="@astro-black-hole-rays"><figcaption>Light is bent more the closer it passes: far away it is bent a little, near 3 GM/c² it can go round the photon sphere, and below b ≈ 5.2 GM/c² it is captured. The escape speed equals the speed of light at the event horizon, r = 2 GM/c².</figcaption></figure>

## 4. Worked example

*A neutron star has 1.4 solar masses and a radius of 12 km. How dense is it, and how big would the same mass be as a black hole?*

```math
\rho = \frac{1.4\times1.99\times10^{30}}{\tfrac{4}{3}\pi\times(1.2\times10^{4})^3} = \frac{2.79\times10^{30}}{7.24\times10^{12}} = 3.8\times10^{17}\ \text{kg/m}^3
```

A teaspoon would weigh about 2 billion tonnes, like the nucleus of an atom scaled up to a city. As a black hole: `$R_s = 2.95\times1.4 = 4.1$` km, only three times smaller than the neutron star. Neutron stars are close to the edge.

## 5. Practice

<div class="problem" data-problem="schwarzschild-radius"></div>

**More practice** (answers below):

1. What is the Schwarzschild radius of Earth (`$6\times10^{24}$` kg)?
2. The black hole at the centre of the Milky Way has about 4 million solar masses. How big is its event horizon, compared with Mercury's orbit (58 million km)?
3. Why does the Sun not become a neutron star?

<details>
<summary>Answers</summary>

1. `$2\times6.674\times10^{-11}\times6\times10^{24}/(3\times10^8)^2 = 8.9$` mm, the size of a marble.
2. `$2.95\times4\times10^6 = 1.2\times10^7$` km, about a fifth of Mercury's orbit.
3. Its leftover core will be only about 0.5 to 0.6 solar masses, well under the Chandrasekhar limit, so electron pressure can hold it up as a white dwarf.
</details>

<div class="keypoints">

- White dwarfs: Earth-sized, held up by electrons, at most about 1.4 M☉.
- Neutron stars: about 20 km wide, born in supernovae; many are pulsars.
- Black holes form when no pressure can stop collapse; R<sub>s</sub> ≈ 2.95 km × M/M☉.
- Supernovae spread heavy elements into space for new stars and planets.

</div>

**Try it with real numbers:** follow a star's life on the [[hr-diagram]], and see how gravity from a heavy star bends spacecraft paths with the [[orbit-transfer-calculator]].

**New words:** *white dwarf*, *Chandrasekhar limit*, *planetary nebula*, *supernova*, *neutron star*, *pulsar*, *black hole*, *event horizon*, *Schwarzschild radius*.
