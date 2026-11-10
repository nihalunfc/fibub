---
title: "How to convert rpm to g (RCF) for your centrifuge"
summary: "Relative centrifugal force depends on speed and rotor radius: RCF = 1.118 × 10⁻⁵ × r (cm) × rpm². How to measure the radius, and two worked examples in both directions."
tools: [centrifuge-calculator, hemocytometer, solution-calculator]
updated: 2026-11-10
sources:
  - "RCF = ω²r / g with standard gravity g = 9.80665 m/s² (exact by definition): standard physics of circular motion."
  - "Rotor radii in the examples: made up for this article; read your own from the rotor manual or measure them."
---

To turn a spin speed in rpm into force in × g, multiply 1.118 × 10⁻⁵ by the rotor radius in centimetres and by the speed squared. To go the other way, divide the force you need by (1.118 × 10⁻⁵ × radius) and take the square root. The [[centrifuge-calculator]] does both, for a radius in cm, mm or inches.

## What you need

- **The speed or the force.** Protocols should give × g (also written RCF, relative centrifugal force), because that is what the sample feels. Older ones often give rpm for a rotor you may not have.
- **The rotor radius**: the distance from the centre of the spindle to the point in the tube you care about. For pelleting, that is the bottom of the tube at full swing, the maximum radius. The rotor manual or the lid often prints it.
- **A ruler**, if you cannot find the radius. For a swing-out rotor, measure with the buckets swung out flat, as they are during the run.

## Step by step

A sample spinning in a circle is pushed outward with an acceleration of ω²r, where ω is the angular speed in radians per second and r the radius. Dividing by standard gravity (9.80665 m/s²) gives the force as a multiple of g. Put rpm and centimetres into that and the constants combine to:

**RCF = 1.118 × 10⁻⁵ × r (cm) × rpm²**

**rpm = √( RCF ÷ (1.118 × 10⁻⁵ × r) )**

Because speed is squared, doubling the rpm gives four times the force. Radius counts only once, so a rotor twice as large gives twice the force at the same speed.

With the tool (the first card, **rpm and × g**):

1. Type the rotor's radius in **Radius** and pick its unit (cm, mm or inches).
2. To get the force, type the speed in **Speed (rpm)**. To get the speed, type the force in **Or force (× g)** instead. The other box fills itself in.
3. Read the line in large type, for example "4,287 rpm = 3,000 × g at 14.6 cm".
4. The facts underneath show the rpm that gives the same force on a 7 cm rotor (a typical microcentrifuge) and on a 15 cm rotor (a typical benchtop swing-out), plus how fast the tube bottom is travelling.

The two cards further down handle a different question: how long particles take to pellet in a rotor (its k-factor), and how to adjust a run time when you move to another rotor.

## A worked example

**From × g to rpm.** A cell-harvest protocol says "3,000 × g for 10 minutes". Your benchtop centrifuge has a swing-out rotor with a maximum radius of 14.6 cm, and its dial only shows rpm.

rpm = √(3,000 ÷ (1.118 × 10⁻⁵ × 14.6)) = √(3,000 ÷ 0.000163) ≈ **4,287 rpm**

Type 14.6 in Radius and 3000 in the force box, and the page gives the same 4,287 rpm. It also shows that a 7 cm rotor would need 6,191 rpm and a 15 cm rotor 4,229 rpm for the same force. Set the dial to the nearest step it allows, here 4,300 rpm, which gives about 3,019 × g, close enough for pelleting cells.

**From rpm to × g.** An old miniprep protocol says "spin at 12,000 rpm" and was written for a microcentrifuge with an 8.4 cm rotor. Type 8.4 and 12000:

RCF = 1.118 × 10⁻⁵ × 8.4 × 12,000² ≈ 13,523 × g

The page gives **13,526 × g** (it uses the exact constant, 1.1182 × 10⁻⁵, rather than the rounded one). Write that force into your notes, so the step can be repeated on any machine.

## Check your answer

- **Order of magnitude.** Benchtop swing-out rotors usually run in the hundreds to a few thousand × g. Microcentrifuges reach roughly 10,000 to 20,000 × g. Ultracentrifuges go past 100,000 × g. An answer far outside the range for your machine usually means the radius was entered in mm but read as cm.
- **Doubling test.** Halve the rpm and the force should drop to a quarter. 6,000 rpm on the 8.4 cm rotor gives about 3,380 × g, a quarter of 13,526.
- **Never exceed the rotor's limits.** Whatever the maths says, stay within the maximum speed and force printed for the rotor and the tubes, and always balance the rotor.

Once the cells are down, resuspend them and count them with the [[hemocytometer]], then dilute to your seeding density with the [[solution-calculator|dilution calculator]].

## Questions people ask

**Which radius do I use: minimum, average or maximum?** For a pellet, the maximum, because that is where the pellet forms. Some protocols quote the average radius; if so, use the same one so the numbers match.

**Is "× g" the same as RCF?** Yes. Both mean the force as a multiple of Earth's gravity. You may also see it written as "g-force" or simply "g".

**Why does my centrifuge show a different × g from my calculation?** It may use a different radius (often the maximum of its own rotor), or round the number. A difference of a few per cent makes no practical difference to most spins.
