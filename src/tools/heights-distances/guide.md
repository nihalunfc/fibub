---
name: Heights and distances
num: 1154
shelf: learn
code: L71
section: school-maths
title: "Heights and distances: angle of elevation and depression problems solved with steps"
summary: "A tower, one or two observers and their lines of sight. Drag the person, set the angles, and get the height, the distance or the angle of elevation with every step of the trigonometry shown."
status: live
ads: false
order: 1154
icon: mountain
works: offline
updated: 2026-11-16
related: [trig-ratios, pythagoras-proofs, tree-height-basal-area]
sources:
  - "Standard right-triangle trigonometry (tan θ = opposite / adjacent) applied to heights and distances. Problems and pictures written for fibub."
  - "Checked against hand-worked exact answers such as h = 10√3 m for two observers 20 m apart at 60° and 30°, and by putting every answer back into the angles."
flow:
  - { icon: pointer, label: "Set scene" }
  - { icon: compass, label: "Angles" }
  - { icon: calculator, label: "Solve" }
  - { icon: check, label: "Practise" }
---

## What it does

How tall is a tower you cannot climb? Stand some way off, measure the angle up to its top, and a right triangle does the rest. This page draws that triangle for you: the tower, the person, the line of sight and the angle, and then solves the problem step by step with tan θ = opposite / adjacent.

It covers the Class 10 topic *some applications of trigonometry* (heights and distances): the angle of elevation, the angle of depression, and the classic two-observer problems.

Learn the ratios first with the [[trig-ratios]] explorer and the theorem behind them in [[pythagoras-proofs]]. For measuring real trees in the field, see [[tree-height-basal-area]].

## The four kinds of problem

- **One observer**: a person stands d metres from the foot of a tower and sees the top at angle θ. Choose what to find: the **height**, the **distance** or the **angle**. The value being found is greyed out and filled in for you.
- **Two, same side**: two people in a line with the tower, s metres apart, see the top at θ (the nearer one) and φ (the farther one). The page finds the height and how far each person stands.
- **Two, opposite sides**: the tower stands between two people s metres apart.
- **Looking down**: someone at the top of a tower or cliff of height h sees an object on the ground at an angle of depression θ. The page finds how far away it is.

## What each setting does

- **d**: distance along the ground from the person to the foot of the tower, in metres.
- **h**: height of the tower.
- **θ** and **φ**: angles in degrees, measured from the level line.
- **s**: the gap between the two people.
- **e**: eye height. Many textbook problems say the observer is, say, 1.5 m tall; the triangle starts at the eye, so e is added to the answer at the end.

## A worked example

The page starts with one observer 30 m from a tower who sees the top at 60°.

1. tan 60° = h / 30.
2. h = 30 × tan 60° = 30 × 1.7321 ≈ 51.96 m.

Switch to **Two, same side**. The nearer person sees the top at 60°, the farther one at 30°, and they are 20 m apart. With x the nearer distance: h = x tan 60° = (x + 20) tan 30°, so x = 10 m and h = 10√3 ≈ 17.32 m. The farther person is 30 m away.

**Looking down** starts with a 75 m cliff and a boat seen at 30° below the level line. The angle of elevation from the boat is also 30° (alternate angles), so the distance is 75 / tan 30° ≈ 129.9 m.

## Tips

- Always draw the picture first and mark the right angle. The page's picture shows where it is.
- The angle of depression is measured **down from the level line**, not from the vertical.
- In two-observer problems, write two equations for the same h and solve them together.

## Examples, units and the new building problem

The first card now has a row of **Examples** (a tower 40 m away at 30°, finding the distance to a 24 m tower, finding an angle, a 1.6 m tall observer, two people on the same side, and a tower on a building). Each one fills in the mode and the numbers so you can compare with your own working.

**Tower on a building** is the extra problem type many exam papers use. You stand d away on level ground; the top of the tower is seen at θ and the top of the building at φ. The building is d × tan φ, the tower and building together are d × tan θ, and the tower alone is the difference. The picture shows both sight lines.

The **Length unit** select (metres, feet, kilometres, centimetres) changes the labels in the answer, the working and the picture; the sums are the same in every unit, so keep all your lengths in one unit. The answer line stays at the top of the "Solve it" card and is read out by screen readers when it changes.

The **Common mistakes** list covers measuring the angle of depression from the vertical, leaving out the eye height, picking sin or cos instead of tan, and mixing units. If the eye height is above the tower, or the angles are impossible for two observers, you get a plain message instead of a number.

## Check yourself

Four fresh questions each time, using the special angles 30°, 45° and 60°. Use √3 ≈ 1.732. Type the answer, press **Check**, and open the worked answer if you need it. Nothing is saved.

## FAQ

**Why does the picture change scale?** It zooms so the whole scene always fits your screen; while you drag, it stays still.

**Is this from the NCERT book?** It covers the same topic with fibub's own problems and pictures. fibub is not part of NCERT.

**How do I find the height of a tower from the angle of elevation?** Height = distance × tan θ (plus your eye height), so a tower seen at 30° from 40 m away is 40 × tan 30° ≈ 23.09 m tall.
