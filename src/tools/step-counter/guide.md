---
name: Step Counter
num: 3097
shelf: everyday
code: T1078
section: running
title: "Step counter: a free online pedometer that counts steps with your phone"
summary: "A live pedometer in your browser: counts steps from your phone's motion sensor, with steps a minute, distance from your height, active time and a goal bar. Nothing is recorded or sent."
seoTitle: "Step counter online: free pedometer for your phone"
status: live
ads: false
order: 3097
icon: pointer
works: offline
updated: 2026-11-23
related: [steps-to-distance, pace-calculator, live-trackers, gait-cadence, ergometer-link]
sources:
  - "Readings come from the browser's DeviceMotionEvent (accelerationIncludingGravity, m/s²). iPhone and iPad need a tap to grant motion access."
  - "Steps are peaks in the size of the acceleration, smoothed over 0.04 s, that rise more than a threshold (1.2 m/s² by default) above a 1.5 s running mean and come at least 250 ms apart: the same idea as Zijlstra W, Hof AL (2003), Gait Posture 18: 1–10, written by fibub from first principles. Checked on a made-up 2-steps-a-second walk in tests/device.mjs."
  - "Step length 0.414 × height walking and 0.65 × running is a common rule of thumb (as in the steps to distance tool); it is an estimate, not a measurement."
flow:
  - { icon: pointer, label: "Start" }
  - { icon: target, label: "Walk" }
  - { icon: chart, label: "Steps" }
---

## What it does

Step Counter is a pedometer that runs in your browser. Press Start, carry your phone in your hand or a front pocket, and it counts each step from the bounce in the phone's motion sensor. It also shows your cadence (steps a minute), the distance from your height, your active time, and how far you are towards a step goal.

It is useful for a quick count on a walk, checking a treadmill, a step challenge at work, or seeing your cadence while running, without installing an app or signing up. To turn an old count into distance or calories, use [[steps-to-distance]]; for running pace, the [[pace-calculator]]; and for a deeper look at your walking rhythm, [[gait-cadence]].

## How to use it

1. Type your height and, if you like, a goal.
2. Press **Start counting** (allow motion on iPhone or iPad).
3. Walk with the phone in your hand or a front trouser pocket, page open and screen on.
4. Press **Pause** to stop and **Carry on counting** to go on. **Reset** sets everything back to 0.

## What each setting does

- **Your height**: sets the step length used for distance (0.41 × height walking, 0.65 × height running).
- **Goal**: the step count the bar fills towards; 10,000 is the usual target.
- **Moving by**: Walking or Running changes the step length.
- **Sensitivity**: how big a bounce counts as a step. Low ignores small jolts (phone in a bag), High catches slow, gentle steps. Change it if the count runs away while you stand still or misses steps.

## Worked example

You are 175 cm tall and walk at 2 steps a second for 20 seconds. The page counts about **40 steps**, and the cadence reads **120 a minute**, a normal brisk walk. Each step is 0.414 × 1.75 = 0.72 m, so the distance is 40 × 0.72 ≈ **29 m**. A 10,000-step day at that length is about 7.2 km. The page's own test feeds it exactly this made-up walk and checks the count and cadence.

## FAQs

**Why does it stop counting when my screen locks?** Browsers stop sending motion to a page that is hidden or locked, to save battery and protect privacy. Keep the page open; your phone's built-in health app counts in the background.

**How accurate is it?** On a steady walk with the phone in hand or pocket, usually within a few percent. Very slow shuffling, pushing a pram and phones in loose bags can miss steps; shaking the phone can add some.

**Is my count saved?** No. Nothing is stored or sent. Write it down or screenshot it if you want to keep it.

**Can it count steps on a laptop?** No: laptops have no motion sensor. Use a phone.
