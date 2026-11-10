---
name: Race track
num: 1247
shelf: learn
code: L132
section: school-maths
title: "Race track"
summary: "Two runners on a straight track: the same way with a head start, or towards each other. Play or scrub the race, watch both lines on a distance-time graph, and see when and where they meet, worked out with the relative speed. Includes m/s to km/h and fresh practice questions."
status: live
ads: false
order: 1247
icon: clock
works: offline
updated: 2026-11-09
related: [proportion-grapher, motion-graphs, equations-of-motion]
sources:
  - "Distance = speed × time, the change between m/s and km/h, and relative speed for catching up and meeting are standard school mathematics and physics. Wording, pictures and examples are fibub's own."
  - "Checked against hand-worked examples (40 m head start, 8 m/s against 6 m/s: caught after 20 s at 160 m; 600 m apart at 7 and 5 m/s: meet after 50 s)."
flow:
  - { icon: sliders, label: "Speeds" }
  - { icon: clock, label: "Race" }
  - { icon: chart, label: "Graph" }
  - { icon: target, label: "Meet" }
---

## What it does

Distance, speed and time are linked by **distance = speed × time**. For one runner that is a simple sum. The interesting puzzles have two: when does a faster runner catch one with a head start, and where do two people walking towards each other meet? Both are solved with the **relative speed**: how fast the gap between them closes.

This page puts runners A and B on a straight track:

- **Same way, B has a head start:** A gains on B at A's speed minus B's speed, so the catch-up time is head start ÷ (vA − vB).
- **Towards each other:** the gap closes at A's speed plus B's speed, so the meeting time is track length ÷ (vA + vB).

Press **Play** (or drag the time slider) to watch the race. A distance-time graph draws both runners as lines; where the lines cross they are at the same place at the same time, and a red dot marks it.

It fits Class 8 Mathematics, proportional reasoning (time, speed and distance, where distance is in direct proportion to time and time in inverse proportion to speed), and leads into motion in Class 9 Science. Direct and inverse proportion are drawn in the [[proportion-grapher]]; graphs of one moving object are in [[motion-graphs]].

## How to use it

- Choose **Same way** or **Towards each other**, and type the track length in metres.
- Set the speeds of A and B in m/s with the sliders or boxes. The steps show each speed in km/h too.
- For the same-way race, set **h**, B's head start in metres.
- **Play** runs the whole race in about six seconds; **Pause** stops it; the **t** slider moves to any moment. The line under it gives both positions and the gap.

## A worked example

The page starts with a 400 m track, A at 8 m/s, B at 6 m/s with a 40 m head start.

1. 8 m/s = 8 × 3.6 = 28.8 km/h and 6 m/s = 21.6 km/h.
2. A finishes in 400 ÷ 8 = 50 s; B has 360 m to run and takes 60 s.
3. A gains 8 − 6 = 2 m every second, and must close 40 m.
4. They meet after 40 ÷ 2 = 20 s, when A has run 8 × 20 = 160 m.

Towards each other on a 600 m track at 7 and 5 m/s: the gap closes at 12 m/s, so they meet after 600 ÷ 12 = 50 s, 350 m from A's start.

## Check yourself

Four fresh questions each time: a speed from distance and time, km/h to m/s, a catch-up time and a meeting time. Type the answer and press **Check**. Nothing is saved.

## FAQ

**Why multiply by 3.6 to go from m/s to km/h?** 1 m/s is 3600 m in an hour, which is 3.6 km in an hour.

**What if A is not faster?** Then the gap never closes and the two lines on the graph never cross. If A is faster but B reaches the finish first, they do not meet on the track either.

**Is this from the NCERT book?** It covers the same topic with fibub's own pictures and examples. fibub is not part of NCERT.
