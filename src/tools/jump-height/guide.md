---
name: Jump height
num: 489
shelf: science
code: T340
section: exercise-and-sport-science
title: "Jump height"
summary: "Work out vertical jump height from flight time (h = g t²/8), typed in or marked frame by frame on a video opened on your device. Add ground contact time for the reactive strength index. Table, chart and CSV; nothing is uploaded."
status: live
ads: false
order: 29
icon: ruler
works: offline
updated: 2026-11-09
related: [vo2max-estimator, heart-rate-zones, uncertainty-calculator, plot-maker, training-load, gait-cadence, video-motion-tracker, projectile-drag]
sources:
  - "Bosco C, Luhtanen P, Komi PV (1983). A simple method for measurement of mechanical power in jumping. Eur J Appl Physiol 50: 273–282 (jump height from flight time)."
  - "Young W (1995). Laboratory strength assessment of athletes. New Stud Athlet 10: 89–96 (reactive strength index)."
  - "Flanagan EP, Comyns TM (2008). The use of contact time and the reactive strength index to optimize fast stretch-shortening cycle training. Strength Cond J 30: 32–38."
  - "Projectile motion under constant gravity (general physics)."
flow:
  - { icon: camera, label: "Video" }
  - { icon: clock, label: "Flight time" }
  - { icon: ruler, label: "Height" }
  - { icon: download, label: "CSV" }
---

## What it does

Jump mats, force plates and phone apps all measure a vertical jump the same way: they time how long the feet are off the ground and turn that **flight time** into a height. This page does the same sum, for free and in your browser. Type flight times you already have, or open a slow-motion video of the jump on your own device and mark the take-off and landing frames. Add the **ground contact time** of a drop jump or a rebound jump and you also get the **reactive strength index (RSI)**.

Track the whole jump frame by frame with the [[video-motion-tracker]], and log the training around it with the [[training-load|training load tracker]].

## How to use it

1. **With a video:** film the jump side-on, with the feet in view, at the highest frame rate your phone offers (120 or 240 frames/s slow motion is best). Press **Open a video**, set the **frame rate**, step with **− 1 frame** and **+ 1 frame**, and press **Take-off** on the first frame with both feet in the air and **Landing** on the first frame a foot touches down. For a drop jump, also press **Contact starts** on the first frame on the ground after the drop. Then **Add to the list**.
2. **Without a video:** type the frame numbers by hand, or type flight times straight into the list.
3. In the list, give one jump per line: flight time, contact time (optional) and a name (optional). Choose **milliseconds or seconds**.
4. **Gravity** is 9.81 m/s². Change it only for teaching (try the Moon, 1.62).
5. Download the table as CSV, or the page as an image, PDF or Word file.

## The physics

After take-off the body is a projectile. It rises for half the flight and falls for the other half, so the take-off speed is v = g t / 2 and the height of the rise is **h = g t² / 8** (Bosco, Luhtanen and Komi, European Journal of Applied Physiology, 1983). The **reactive strength index** is jump height divided by ground contact time, in m/s (Young, 1995; Flanagan and Comyns, Strength and Conditioning Journal, 2008). The page also exports the flight-to-contact time ratio, which some coaches use instead.

A video has a frame-sized blind spot: at 30 frames/s each mark can be up to 33 ms out. The table shows the height range if a mark is one frame early or late, and the chart draws it as error bars.

## Worked example

The page opens with take-off at frame 100 and landing at frame 115 of a 30 frames/s video: 15 frames = 500 ms, so h = 9.81 × 0.5² / 8 = **30.7 cm**, but anywhere from 26.7 to 34.9 cm if a mark is one frame out. The example list has three countermovement jumps of 500, 520 and 480 ms (30.7, 33.2 and 28.3 cm) and two drop jumps. The best jump is 33.2 cm (CMJ 2), the mean of all five is 27.7 cm with an SD of 4.5 cm, and drop jump 2 (430 ms flight, 190 ms contact) has the best RSI, 22.7 cm / 0.19 s = 1.19 m/s.

## Tips

- Land the way you took off: straight legs, toes first. Tucking the knees lengthens the flight and inflates the height.
- Use the highest frame rate you can: at 240 frames/s the ± 1 frame range shrinks to about ± 2 cm.
- Keep the arms the same each time (on the hips or free) so jumps are comparable.

## Frequently asked questions

**Is my video uploaded?** No. It is opened from your device into this page and never leaves it. Nothing is stored.

**Why does my video not open?** The browser must be able to play the format. Most phone videos (MP4 or MOV with H.264) work. If not, count frames in any video player and type the frame numbers.

**Why is my jump mat number different?** Mats start and stop the clock when the feet break contact, so they agree with careful frame counting to within a frame or two.
