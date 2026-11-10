---
name: Collision lab
num: 1335
shelf: learn
code: L197
section: school-physics
title: "Collision simulator: elastic and inelastic collisions in 1D and 2D, coefficient of restitution, momentum and kinetic energy"
summary: "Crash two trolleys on a track, or two balls at a glancing angle, with any masses, speeds and bounciness from sticking together to perfectly elastic. Watch it happen, then see the velocities after, momentum before and after, the kinetic energy lost, and why equal snooker balls part at 90°."
status: live
ads: false
order: 1335
icon: target
works: offline
updated: 2026-11-09
related: [newtons-laws, collision-calculator, variable-force-work, vector-adder]
sources:
  - "Conservation of linear momentum, Newton's rule for the coefficient of restitution (v₂ − v₁ = e(u₁ − u₂)), and oblique impact of smooth spheres (only the velocity along the line of centres changes): standard school physics found in any textbook."
  - "Checked against hand-worked cases, physical invariants (momentum kept, energy never gained, 90° for equal elastic balls) and the separately written collision maths of the collision calculator on 1000 random cases."
flow:
  - { icon: sliders, label: "Mass, speed" }
  - { icon: target, label: "Crash" }
  - { icon: chart, label: "p and KE" }
  - { icon: check, label: "Check" }
---

## What it does

In every collision, whether two trolleys bump, a bat hits a ball or two cars crash, the total **momentum** (mass × velocity) is the same just after as just before, because the two bodies push on each other with equal and opposite forces for the same time. **Kinetic energy** is a different story: some of it can turn into heat, sound and bent metal. How much is kept is set by the **coefficient of restitution** e, the "bounciness": e = 1 is a perfectly elastic collision that loses nothing, e = 0 means the bodies stick together and lose as much as they possibly can.

**In a line**, two trolleys run along a track. Set their masses and velocities (negative means moving left) and the bounciness, press **Play**, and watch them collide. The page gives the velocities after, the momentum and kinetic energy before and after (with bars for the energy), and the impulse each gives the other.

**Glancing (2D)** shows two balls on a table from above. Ball 1 rolls into ball 2 at rest, off-centre by an amount you choose. The page splits ball 1's velocity along and across the line joining the centres, collides the "along" parts as in a straight line, and shows the angles at which both balls leave.

It follows Class 11 Physics, work, energy and power (elastic and inelastic collisions in one and two dimensions) and the laws of motion (conservation of momentum, impulse), and the Class 9 idea of momentum. The forces in a crash are pushes like those in [[newtons-laws]]; for your own lab numbers and to find e from measured speeds, use the [[collision-calculator]]; and to see the 2D velocities as arrows that add, try [[vector-adder]].

## How to use it

1. Choose **In a line** or **Glancing (2D)**.
2. Set the **masses** and the **velocities**. In 2D, ball 2 is at rest and you set how far **off-centre** ball 1 strikes, as a fraction of the two radii added together.
3. Set the **bounciness e**, or press **Elastic** or **Stick together**.
4. Press **Play** to watch the collision. **Reset** puts the bodies back.
5. Read the numbers and the working under **Before and after**.

## Worked example

Open the page: a **2 kg** trolley at **4 m/s** hits a **1 kg** trolley at rest, elastically (e = 1).

- Momentum before: 2 × 4 = **8 kg m/s**.
- Bounce rule: v₂ − v₁ = 1 × (4 − 0) = 4 m/s.
- Solving both: v₁ = (8 − 1 × 4) ÷ 3 = **1.33 m/s** and v₂ = (8 + 2 × 4) ÷ 3 = **5.33 m/s**.
- Kinetic energy before: ½ × 2 × 16 = 16 J; after: 1.78 + 14.22 = **16 J**, none lost.

Now press **Stick together**: both move off at 8 ÷ 3 = 2.67 m/s, and the kinetic energy falls to 10.67 J, so 33.3% is lost.

## Tips

- Momentum is a vector. In 2D the x and y totals are each kept separately.
- When a light body hits a heavy one at rest, the light one bounces back; when a heavy body hits a light one, both carry on forwards.
- In a real game of snooker the balls also spin and roll, so the 90° rule is close but not exact.

## FAQ

**Where does the lost kinetic energy go?** Into heat, sound and the work done squashing the bodies out of shape. Energy as a whole is still conserved.

**Can e be more than 1?** Not for ordinary collisions: that would need energy from somewhere, such as an explosion between the bodies.

**Is anything stored?** No. The questions are made in your browser and nothing is saved or sent.
