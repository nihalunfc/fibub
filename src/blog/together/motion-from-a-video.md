---
title: "Measure real motion from a phone video: position, speed and acceleration"
summary: "Film a ball rolling down a ramp, track it frame by frame, read its graphs, check the result with the equations of motion and make a clean figure. All in your browser."
tools: [video-motion-tracker, motion-graphs, equations-of-motion, plot-maker]
updated: 2026-11-10
sources:
  - "Acceleration of a solid ball rolling without slipping down a slope, a = (5/7) g sin θ, and the equations of motion for steady acceleration: standard school and first-year university physics."
  - "The ramp, the times and the positions in the example are made up by fibub and rounded for easy checking."
---

A phone camera is a surprisingly good physics instrument. It takes 30 or 60 pictures every second, each with an exact time, so if you can see where an object is in each picture you can measure how fast it moves and how quickly it speeds up. This article walks through one complete job: film a ball rolling down a ramp, turn the video into numbers with the [[video-motion-tracker]], make sense of the graphs with [[motion-graphs]], check the answer with [[equations-of-motion]] and finish with a figure from the [[plot-maker]]. Nothing is uploaded.

## Why these tools fit together

Each tool does one part of the job well. The tracker turns pictures into a table of times and positions and works out velocity and acceleration. Motion graphs teaches you what those graphs should look like, so you can tell a good measurement from a messy one before you trust it. The equations of motion tool checks your numbers against the physics: if the acceleration is steady, the speed at the bottom and the time taken must agree with it. The plot maker then draws the result as a tidy figure for a lab report or a poster.

## Step by step

### 1. Track the ball with the video motion tracker

Film the ramp side-on with the phone held still, and put a metre stick in the shot, in the same plane as the ball. Open the clip in the tracker and type its frame rate. Press **Set the scale**, click both ends of the metre stick and type 1.00 m. Press **Set the origin** and click the ball's starting point. Switch back to **Click the object**, then click the centre of the ball in each frame. Setting **Move on by this many frames** to 15 on a 30 frames per second video gives one point every 0.5 s, which is plenty for a slow ramp. When you are done, press **Download table (CSV)**.

The tracker also fits a straight line to the sideways motion, which assumes a constant speed. A rolling ball speeds up, so for this job read the positions and velocities in the table rather than that line.

### 2. Read the shape with motion graphs

Before trusting the numbers, open motion graphs and choose the **Speeding up** story. Its position-time graph curves upwards and its velocity-time graph is a straight sloping line. Switch the **Level** to Class 11 and its acceleration-time graph appears, flat. Your ramp graphs should look the same. If your velocity points zigzag, the problem is usually click error, not physics.

### 3. Check with equations of motion

In **Solve a problem**, type three values you trust (start speed, acceleration and distance) and let the tool find the time and the final speed. Compare them with what the video showed.

### 4. Draw it with the plot maker

Paste two columns, time and position, with a header row. Choose **Points only** for measured data, type the axis labels with units, and download an SVG or a 300 dpi PNG. Make a second figure of time against velocity.

## A worked example

A 1.20 m ramp has one end raised by 6.0 cm, so the slope's sine is 6.0 ÷ 120 = 0.05. Physics predicts that a solid ball rolling without slipping speeds up at a = (5/7) × g × sin θ = (5/7) × 9.81 m/s² × 0.05 ≈ **0.35 m/s²**. (A sliding block with no friction would reach g sin θ; a rolling ball is slower because some of the energy goes into spinning.)

Suppose the tracker gives these positions along the ramp, every 0.5 s from rest: 0 m, 0.04 m, 0.16 m, 0.36 m, 0.64 m and 1.00 m at 0, 0.5, 1.0, 1.5, 2.0 and 2.5 s. The slope is gentle, so the sideways distance in the video is within 0.2 % of the distance along the ramp.

- **Velocity** from neighbouring points: at 1.0 s it is (0.36 m − 0.04 m) ÷ 1.0 s = 0.32 m/s; at 1.5 s, (0.64 − 0.16) ÷ 1.0 = 0.48 m/s; at 2.0 s, (1.00 − 0.36) ÷ 1.0 = 0.64 m/s.
- **Acceleration** is the slope of that velocity line: it rises 0.16 m/s every 0.5 s, so a = **0.32 m/s²**. A fit of x = ½at² through all six points, for example with the [[curve-fitter]], gives the same value.
- **Check**: in equations of motion, u = 0 m/s, a = 0.32 m/s² and s = 1.00 m give t = 2.5 s and v = 0.8 m/s. Both match: v = at = 0.32 × 2.5 = 0.8 m/s, and the video reached 1.00 m at 2.5 s.

The measured 0.32 m/s² is about 9 % below the predicted 0.35 m/s². Rolling resistance and a little air drag explain the gap. To say whether 9 % is more than your measuring error, put the ramp height and length, with their uncertainties, into the [[uncertainty-calculator]].

## Tips

- Use bright light. A fast shutter gives a sharp ball, and blur is the main cause of click error.
- Keep the phone square on and a couple of metres back, so the scale is the same across the whole frame.
- Click every second or third frame on slow motions; the speeds come out steadier.
- Trust a fit through all the points (or the slope of the whole velocity line) over single-point accelerations, which jump about.
- Film three runs and compare them.
