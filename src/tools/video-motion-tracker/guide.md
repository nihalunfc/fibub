---
name: Video motion tracker
num: 906
shelf: science
section: classical-mechanics
title: "Video motion tracker: click a moving object frame by frame and get position, velocity and acceleration (video analysis for physics)"
summary: "Open a phone video, set the scale with a ruler in the shot, click the object in each frame and get x(t), y(t), velocity and acceleration, with straight-line and parabola fits (g from a thrown ball). The video is played in your browser and never uploaded."
status: live
ads: false
order: 6
icon: camera
works: offline
updated: 2026-11-09
related: [projectile-drag, pendulum-analyser, collision-calculator, graph-digitizer, plot-maker, curve-fitter, uncertainty-calculator, jump-height]
sources:
  - "Finite differences on uneven time steps (second-order central differences, as in numpy.gradient) and least-squares polynomial fits with standard errors: standard numerical methods."
  - "Checked against numpy.gradient and numpy.polyfit(cov=True), and in the browser against a generated test video of a ball moving at 1.2 m/s sideways and falling at 9.81 m/s²."
  - "The example points are made up."
flow:
  - { icon: camera, label: "Video" }
  - { icon: ruler, label: "Scale" }
  - { icon: pointer, label: "Click it" }
  - { icon: chart, label: "x, v, a" }
---

## What it does

Video analysis is one of the best ways to see the physics in everyday motion: a ball thrown across a room, a toy car rolling down a ramp, a swinging pendulum, a jumping friend. This tool lets you do it with any phone video, **entirely in your browser**: the video file is opened on your device and never uploaded anywhere.

You **step through the video frame by frame** and **click the object** in each frame. The tool records the time and position of every click, converts pixels to metres with a **scale** you set from something of known length in the shot, and works out:

- **position** x(t) and y(t), with y measured upwards,
- **velocity** and **acceleration** at every point, from differences between neighbouring points,
- a **straight-line fit** to the horizontal motion (constant speed) and a **parabola fit** to the vertical motion (constant acceleration), with uncertainties. For a thrown ball the vertical acceleration should come out close to −9.81 m/s².

It draws position, velocity and acceleration against time, shows a table, and downloads everything as CSV or as a report.

Fit your positions to a model with the [[curve-fitter]], and compare a thrown object's path with the [[projectile-drag|projectile and drag simulator]].

## How to use it

1. **Open a video** (MP4 or WebM). Film side-on with the phone held still, and include a ruler, a metre stick or an object of known length in the same plane as the motion.
2. Type the video's **frames per second** (usually 30 or 60; for slow motion, the rate it was filmed at).
3. Press **Set the scale** and click both ends of the ruler, then type its real **length in metres**.
4. Optionally press **Set the origin** and click the point that should be (0, 0).
5. Go to the first frame you want and **click the centre of the object**. The video moves on by the chosen number of frames; keep clicking. **Undo last point** and the frame buttons and slider help you fix mistakes; clicking a frame again replaces its point.
6. Read the results, or download them.

The points list is ordinary text (time, x and y in pixels), so you can also edit it, paste points from another tracker, or open a points file.

## Worked example

Press **Try a made-up example** to load eight clicks of a ball thrown sideways, 1/30 s apart with one frame skipped, and a scale of 200 pixels for 1 m. The page shows a horizontal speed of **1.4989 ± 0.0062 m/s** from the straight-line fit and a **vertical acceleration of −9.829 ± 0.050 m/s²** from the parabola fit, within half a per cent of free fall. The horizontal acceleration is −0.02 ± 0.20 m/s², zero within its uncertainty, as it should be with little air drag. Over the 0.2667 s the ball moves 0.401 m across and 0.347 m down. The point-by-point accelerations scatter much more (from about −10 down to −5 at the ends), which is why the fits are the numbers to quote.

## Tips

- Higher frame rates and a **fast shutter** (bright light) give sharper positions. Motion blur is the main source of click error.
- Keep the camera **square on** to the plane of motion and far enough away that perspective does not change the scale across the frame.
- Clicking every frame gives the most points, but every second or third frame spreads the same click error over a longer time, which steadies the velocities.

## FAQ

**Is my video uploaded?** No. It is opened with a local link inside your browser and played there. Nothing about it, or the points, leaves your device.

**Why is acceleration so noisy point by point?** Taking a difference of a difference doubles the effect of every small click error. The parabola fit uses all points together and is far more reliable.

**My video will not open.** Browsers play MP4 (H.264) and WebM; some phone formats (HEVC) only play in some browsers. Convert the clip, or record in a "most compatible" setting. The tool is for study and planning, not a substitute for professional judgement.
