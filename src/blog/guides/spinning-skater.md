---
title: "Angular momentum: why a spinning skater speeds up"
summary: "Understand conservation of angular momentum, moment of inertia and rotational energy with a skater who pulls her arms in, and a worked example."
tools: [spinning-skater, centre-of-mass, rolling-race]
updated: 2026-11-10
sources:
  - "Angular momentum L = Iω, moment of inertia I = Σmr² and rotational kinetic energy ½Iω²: standard physics, worked out fresh for this guide."
  - "The skater model (a body of 1 kg m² holding two equal weights) is the tool's own teaching model; the numbers in the example are made up."
---

The spinning skater tool shows why a figure skater turns faster when she pulls her arms in, and why that is not magic: a quantity called angular momentum has to stay the same. It suits students in Class 11 and anyone curious about rotation. To find the point a body balances on, see [[centre-of-mass]]. To see rotation mixed with rolling, try the [[rolling-race]].

## What it is

Pushing a trolley needs force and gives it **momentum**. Turning something needs a twist and gives it **angular momentum**. For a body spinning about a fixed line (its axis):

L = I × ω

- **L** is the angular momentum, in kg m²/s.
- **I** is the **moment of inertia**, in kg m². It tells you how hard the body is to spin.
- **ω** (omega) is the spin speed, in radians per second (rad/s). One full turn is about 6.28 rad.

Moment of inertia depends on where the mass is. For small weights, I = Σ m r², where m is each mass and r is its distance from the axis. Because r is squared, mass far out counts a lot more than mass near the middle.

If no outside twist acts on the body, L stays the same. So when the skater pulls her arms in, r gets smaller, I gets smaller, and ω must get bigger to keep L the same.

The energy of the spin is E = ½ I ω², which can also be written E = L² ÷ (2I). With L fixed, a smaller I means more energy. The extra energy is the work her muscles do pulling the arms in.

## How to use it

1. Set the **weight in each hand**, from 0 to 4 kg. Heavier weights give a bigger change when the arms move.
2. Set the **spin with arms out ω₀**, the speed when the hands are 1 m from the axis.
3. Press **Pull arms in**, or drag the **r** slider, which runs from 0.2 m to 1 m.
4. Watch ω, I, L and the kinetic energy. L stays put while the others change.
5. Press **Arms out** to go back, and **Pause** to freeze the picture.

## A worked example

Pick our own numbers: 1.5 kg in each hand and a starting spin of 3 rad/s. The model body alone has I = 1 kg m², and the two weights add 2 × m × r².

**Arms out, r = 1 m.**
- I = 1 + 2 × 1.5 × 1² = 4 kg m²
- L = 4 × 3 = 12 kg m²/s
- E = ½ × 4 × 3² = 18 J

**Arms in, r = 0.4 m.**
- I = 1 + 2 × 1.5 × 0.4² = 1.48 kg m²
- L is still 12 kg m²/s, so ω = 12 ÷ 1.48 = 8.1 rad/s
- E = ½ × 1.48 × 8.108² = 48.6 J

The spin is 2.7 times faster, and the energy has gone from 18 J to 48.6 J. That is a gain of 30.6 J, which the skater supplied by pulling.

## Where it is used

- **Sport.** Divers tuck to spin faster and open out to slow down before they enter the water. Gymnasts do the same.
- **Space.** Satellites use spinning wheels. Changing a wheel's speed turns the satellite the other way, with no fuel.
- **Astronomy.** A collapsing cloud of gas spins faster as it shrinks. This is part of why young stars and the discs around them rotate.
- **Everyday.** Swivel chairs let you feel it: sit, hold weights out, get a spin, then pull them in.

## Common mistakes

- **Saying energy is conserved too.** In this case it is not. The skater does work, so the energy rises. Only L is fixed.
- **Forgetting the square.** Halving r makes the weights' share of I four times smaller, not two times.
- **Mixing units.** Use kg, m and rad/s. If a spin is given in turns per minute, change it to rad/s first.
- **Ignoring the body.** The body adds its own I. Treating the arms as the only mass gives the wrong ω.

## Questions people ask

**Why does the skater slow down when she opens her arms?**
I goes up, L stays the same, so ω must fall.

**What happens on a real ice rink?**
Ice has very little friction, so L stays nearly constant and the model works well. On rough ground the floor would twist her and L would change.

**Does a heavier skater spin faster?**
Not by itself. What changes the spin is how much I changes when she moves her arms.
