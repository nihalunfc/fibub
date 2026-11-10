---
name: Inverse kinematics
num: 637
shelf: science
code: T434
section: control-and-robotics
title: "Inverse kinematics"
summary: "Find the joint angles that put a planar 2-link arm's tip, or a 3-link arm's tool at a given angle, on a target point. Both elbow-up and elbow-down solutions, a reach check that says why a point is out of reach, optional joint limits, a drawing of the arm and its workspace, and a batch of targets to CSV."
status: live
ads: true
order: 637
icon: compass
works: offline
updated: 2026-11-09
related: [mass-balance-solver, uncertainty-calculator, plot-maker, dh-kinematics, path-planner, pid-simulator, numerical-methods]
sources:
  - "Closed-form inverse kinematics of the planar two-link arm (law of cosines and atan2) and the three-link arm with a wrist point: standard robotics, for example Craig, Introduction to Robotics: Mechanics and Control, and Spong, Hutchinson and Vidyasagar, Robot Modeling and Control (methods only)."
  - "The example arm and targets are made up."
  - "Checked by forward-kinematics round trips and against an independent SciPy least-squares solve written for the tests."
flow:
  - { icon: ruler, label: "Links" }
  - { icon: target, label: "Target" }
  - { icon: compass, label: "Angles" }
  - { icon: table, label: "CSV" }
---

## What it does

**Forward kinematics** is easy: given the joint angles, add up the links to find where the tip is. **Inverse kinematics** is the reverse, and it is what a robot controller has to do: given where the tip should be, find the joint angles.

For a planar arm with two links the answer comes in closed form. The elbow angle follows from the law of cosines,

cos θ2 = (x² + y² − L1² − L2²) / (2 L1 L2),

and the shoulder angle from θ1 = atan2(y, x) − atan2(L2 sin θ2, L1 + L2 cos θ2). There are usually **two solutions**, elbow up and elbow down, and this tool gives both. For a **three-link arm** you also give the tool angle φ. The tool then works back from the target along the last link to the wrist point, solves the first two links for that point, and sets θ3 = φ − θ1 − θ2.

It also:

- checks the **reach**: the first two links can only reach points between |L1 − L2| and L1 + L2 from the base, and the tool tells you how far out of reach a point is;
- flags **singular** poses, where the arm is fully stretched or folded and the two solutions merge;
- checks optional **joint limits** and shows which solution, if any, the joints can reach;
- draws the arm, the other solution and the reachable area;
- solves a whole list of targets, for example a path, and downloads the joint angles as CSV.

Check the angles by running them forward in [[dh-kinematics|D-H forward kinematics]], and plan the route between targets with the [[path-planner|path planning visualiser]].

## How to use it

1. Choose 2 or 3 links and give their lengths, in any unit, the same for everything.
2. Tick Joint limits if your joints cannot turn all the way round, and give each joint's range. Each angle is measured from the previous link, counter-clockwise positive.
3. Give the target x and y, and for 3 links the tool angle φ from the +x axis. Choose which solution to draw.
4. For a path, paste or open a list of targets under Many targets and download the CSV.

## Worked example

A made-up arm with L1 = 1 and L2 = 0.8 reaching for (1.2, 0.6), 1.342 from the base and well inside its reach of 0.2 to 1.8. **Elbow up: θ1 = 62.956°, θ2 = −84.261°. Elbow down: θ1 = −9.826°, θ2 = 84.261°.** With the example joint limits (joint 2 from −150° to 0°) only elbow up is allowed. Add a 0.3-long tool held at 30° and the wrist moves to (0.940, 0.350): elbow up gives 67.494°, −113.326° and 75.832°.

## Tips

- The two elbow angles are always equal and opposite. That is a quick check on any hand calculation.
- Near full stretch the arm is singular: small moves of the target need large joint moves. Keep paths away from the outer edge.
- For 3 links, a target can be in reach for one tool angle and not for another. Only the wrist point has to be in the annulus.

## FAQ

**What about arms that move in 3D?** This tool is planar. Many arms are planar in their main joints after a base rotation: work out the base angle with atan2 and use this tool in the arm's vertical plane.

**Why does the check error show tiny numbers?** It is the distance between the target and the tip computed back from the angles, so it shows round-off only.
