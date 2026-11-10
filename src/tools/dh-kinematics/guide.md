---
name: D-H forward kinematics
num: 635
shelf: science
code: T432
section: control-and-robotics
title: "D-H forward kinematics calculator: Denavit-Hartenberg table to end-effector pose, with a 3D arm view"
summary: "Type a robot arm's Denavit-Hartenberg table (standard or modified convention), move the joints with sliders and get every link transform, the end-effector position and orientation (roll, pitch, yaw, quaternion), the Jacobian and a 3D picture you can turn. Nothing is uploaded."
status: live
ads: true
order: 635
icon: compass
works: offline
updated: 2026-11-09
related: [traverse-calculator, stereonet, plot-maker, inverse-kinematics, path-planner, pid-simulator, matrix-calculator]
sources:
  - "Denavit-Hartenberg transforms in the standard (distal) form Rz·Tz·Tx·Rx and the modified (proximal, Craig) form Rx·Tx·Rz·Tz, the geometric Jacobian, and roll-pitch-yaw and quaternion formulas are standard robotics textbook material, written out by fibub."
  - "Checked against an independent numpy implementation (products of the four elementary transforms in both conventions), scipy's Rotation class (ZYX Euler angles and quaternions) and a finite-difference Jacobian, on the 4 example arms and 24 random tables."
  - "The example arms are made up for this tool; they are not the published table of any real robot."
flow:
  - { icon: table, label: "D-H table" }
  - { icon: sliders, label: "Joints" }
  - { icon: calculator, label: "Transforms" }
  - { icon: target, label: "Pose" }
---

## What it does

A Denavit-Hartenberg (D-H) table describes a serial robot arm with four numbers per joint: θ, d, a and α. This tool multiplies the link transforms for you and shows:

- **The end-effector pose**: where the tool point is (x, y, z) and how it is turned, as roll, pitch and yaw, as a quaternion, and as one axis and angle.
- **Every transform**: the link transform Aᵢ of any joint and the running product ⁰Tᵢ from the base to that joint's frame, plus the full base-to-tool transform ⁰Tₙ.
- **The Jacobian**: how fast the tool point moves and turns when each joint moves, and its rank, so you can see when the arm is in a singular pose (for example fully stretched out).
- **A 3D view** of the arm with each joint's frame (x red, y green, z blue) over a ground grid. Drag it sideways to turn it, or use the turn and tilt sliders.

To find the joint angles for a target position, use the [[inverse-kinematics|inverse kinematics solver]], and plan a collision-free route with the [[path-planner|path planning visualiser]].

## How to use it

1. Pick an example arm, or edit the table. Each row is one joint. **R** is a revolute joint: its slider value is added to θ. **P** is a prismatic joint: its value is added to d. **F** is a fixed row with no joint, handy for a tool offset or a base offset.
2. Choose the **convention**. *Standard* (distal) uses Aᵢ = Rz(θᵢ) · Tz(dᵢ) · Tx(aᵢ) · Rx(αᵢ), and joint i moves about the z axis of frame i−1. *Modified* (proximal, as in Craig's book) uses Aᵢ = Rx(αᵢ₋₁) · Tx(aᵢ₋₁) · Rz(θᵢ) · Tz(dᵢ), and joint i moves about the z axis of frame i. Changing the menu reads the same numbers the other way. **Convert to the other convention** instead rewrites the table so the arm, and its pose, stay the same.
3. Move the **joint sliders**, or type a value in the box next to each. Low and High in the table set each slider's range; leave them empty for −180° to 180° (revolute) or 0 to 1 (prismatic).
4. Download every transform as a CSV, or a report as an image, PDF or Word file.

Angles are in degrees. Lengths are in whatever unit you type; the unit menu only changes the labels.

## Worked example

The first example is a made-up 6-axis arm with a spherical wrist (the last three joint axes meet at one point). Its rows, in the standard convention, are θ, d, a, α = (0°, 0.4, 0.05, 90°), (90°, 0, 0.45, 0°), (0°, 0, 0.05, 90°), (0°, 0.42, 0, −90°), (0°, 0, 0, 90°) and (0°, 0.08, 0, 0°), in metres. With the joints at 30°, −20°, 40°, 0°, 45° and 0°, the page shows the tool point at **x 0.5329, y 0.3076, z 1.0860 m**, with roll 0.00°, pitch −25.00° and yaw −150.00°, and the quaternion (0.2527, −0.2091, −0.0560, −0.9430). The Jacobian has rank 6 of 6, so the arm can move and turn the tool in every direction from here.

Press **Convert to the other convention**: the table changes (each a and α moves down one row, and a fixed row is not needed because the last a and α are 0), but the pose stays exactly the same. Choose the planar 2-link arm and set q2 to 0: the arm is stretched out, and the rank note says the tool point can move in only 1 direction.

## Tips

- Check a new table one joint at a time: set all joints to 0 with the button, then move each slider and watch which way the arm turns in the 3D view.
- The intermediate frames show where each D-H frame sits. Under the standard convention a joint turns about the z axis of the frame before it.
- Roll, pitch and yaw use fixed base axes, R = Rz(yaw) · Ry(pitch) · Rx(roll). At a pitch of ±90° roll and yaw are not unique; the page says so and sets yaw to 0.

## FAQ

**Why does my textbook arm look different?** Books mix the two conventions and sometimes add θ offsets (like the 90° on joint 2 of the example). Make sure the convention menu matches your book.

**Can I put in a tool length?** Yes: add an F row with d set to the tool length, or include it in the last row.

**Is anything sent anywhere?** No. The sums run in your browser and keep working offline.
