---
name: Vertical circle
num: 1338
shelf: learn
code: L187
section: school-physics
title: "Vertical circle"
summary: "Whirl a stone on a string and see its centripetal acceleration v²/r and the pull it needs; let go and watch it fly off along the tangent. Then swing a mass in a vertical circle: the speed and tension all the way round, the least speed to loop, and where the string goes slack if it is too slow."
status: live
ads: false
order: 1338
icon: orbit
works: offline
updated: 2026-11-09
related: [banked-curve, energy-track, shm-circle, river-crossing]
sources:
  - "Uniform circular motion (a = v²/r = ω²r towards the centre), and motion in a vertical circle from energy conservation (v² = u² − 2gh) and the radial force T = mv²/r + mg cos θ, with the least speeds √(gr) at the top and √(5gr) at the bottom: standard school physics found in any textbook. g = 9.8 m/s² (rounded)."
  - "Checked against hand-worked cases and against an independent fourth-order Runge-Kutta integration of the string pendulum for the speed along the way and the angle where the string goes slack."
flow:
  - { icon: orbit, label: "Whirl" }
  - { icon: sliders, label: "Speed, r" }
  - { icon: pointer, label: "Tension" }
  - { icon: check, label: "Loop?" }
---

## What it does

Something moving round a circle at a steady speed is still **accelerating**, because its direction keeps changing. The acceleration points to the centre and has size **v²/r**, so a force towards the centre, **m v²/r**, is needed to keep it on the circle. For a stone on a string, the string supplies it; for a car on a bend, friction does; for the Moon, gravity.

**Stone on a string** shows the circle from above with the velocity (along the tangent) and the acceleration (towards the centre) as arrows. Change the mass, radius and speed and see the acceleration, the pull of the string, the angular speed and the time for a turn. Press **Let go** and the stone flies off in a straight line along the tangent, because nothing is pushing it any more.

**Vertical circle** swings a mass on a string round a circle that stands upright, starting from the bottom at the speed you choose. Gravity slows it on the way up and speeds it on the way down, so the string tension changes all the way round; a graph shows it from bottom to top. The page finds the **least speed at the bottom** that takes it all the way round, √(5gr), the speed and tension at the top, and, if it is too slow, the angle at which the **string goes slack** and the mass falls inside the circle.

It follows Class 11 Physics, motion in a plane (uniform circular motion, centripetal acceleration) and work, energy and power (motion in a vertical circle). Friction supplies the centripetal force on a [[banked-curve]]; energy changes on a loop the same way as on the [[energy-track]]; and the shadow of steady circular motion is [[shm-circle|simple harmonic motion]].

## How to use it

1. Pick **Stone on a string** or **Vertical circle**.
2. Set the **mass**, the **radius** and the **speed** (for the vertical circle, the speed at the bottom).
3. Stone: press **Let go** to release it; **Start again** puts it back on the string.
4. Vertical circle: watch it go round, or swing, or fall when the string goes slack; read the tension graph (red where the string would be slack).

## Worked example

Open the page: a **0.5 kg** stone on a **1 m** string at **5 m/s**. Its acceleration is 5² ÷ 1 = **25 m/s²** towards the centre, so the string pulls with 0.5 × 25 = **12.5 N**, and one turn takes 2π × 1 ÷ 5 = 1.257 s.

Switch to the **vertical circle** with the same mass and string at **8 m/s** at the bottom. The least speed to loop is √(5 × 9.8 × 1) = **7 m/s**, so it goes round. At the top v² = 64 − 4 × 9.8 = 24.8, v = **4.98 m/s**, and the tension is 0.5 × 24.8 − 4.9 = **7.5 N**. At the bottom the string pulls hardest: 4.9 + 0.5 × 64 = **36.9 N**.

## Tips

- There is no outward "centrifugal" force on the stone. It feels like being flung out only because your body wants to keep going straight.
- Doubling the speed needs four times the force; doubling the radius at the same speed needs half.
- A mass on a rigid rod (not a string) can go over the top at almost zero speed, because a rod can push as well as pull.

## FAQ

**Why √(5gr)?** At the top the string can at most go slack, so gravity alone gives the centripetal force: mg = mv²/r, v_top = √(gr). Climbing 2r loses 4gr from v², so u² = gr + 4gr = 5gr.

**Why does the string go slack above the side and not below?** Below the side, the weight pulls the mass away from the centre, so the string must be tight. Above it, the weight pulls towards the centre and can supply all the centripetal force by itself.

**Is anything stored?** No. Everything is worked out in your browser and nothing is saved or sent.
