---
title: "MyJump 2 app vs contact mat: vertical jump validity in youth soccer"
summary: "A 2025 study filmed 21 young soccer players at 240 frames per second and found the MyJump 2 phone app read about 1 cm higher than a contact mat. Here is how flight time becomes jump height, and how to check it."
tools: [jump-height, bland-altman]
updated: 2026-11-10
sources:
  - "Stafylidis A, Michailidis Y, Mandroukas A et al. (2025), Validity and Reliability of the MyJump 2 Application for Measuring Vertical Jump in Youth Soccer Players Across Age Groups, Applied Sciences 15(11): 6253. Open access under a CC BY licence, as linked on the publisher's article page, checked 2026-11-10."
  - "Bosco C, Luhtanen P and Komi PV (1983), European Journal of Applied Physiology 50: 273-282 (jump height from flight time on a contact mat)."
  - "Bland JM and Altman DG (1986), The Lancet 327: 307-310 (limits of agreement)."
paper:
  title: "Validity and Reliability of the MyJump 2 Application for Measuring Vertical Jump in Youth Soccer Players Across Age Groups"
  authors: "Stafylidis A, Michailidis Y, Mandroukas A et al."
  journal: "Applied Sciences"
  year: 2025
  doi: "10.3390/app15116253"
  url: "https://www.mdpi.com/2076-3417/15/11/6253"
  licence: "CC BY"
  reviewed: true
---

Can a phone video measure a vertical jump as well as a lab mat? A 2025 study in *Applied Sciences* tested the MyJump 2 app on young soccer players and found it tracked a contact mat closely, reading a little under 1 cm high on average. Both devices time how long the feet are off the ground and turn that flight time into a height. You can do the same sum, and mark the frames of your own slow-motion video, with the [[jump-height]] tool, then compare two methods side by side with [[bland-altman]].

## What they found

Twenty-one male players from one elite club, aged from under-14 to under-19, did countermovement jumps (a quick dip, then jump) and squat jumps (start from a held squat, no dip). Each jump was recorded at the same time by a Chronojump contact mat and by MyJump 2 running on a phone filming at 240 frames per second.

The authors report that for countermovement jumps the app read on average about 0.94 cm higher than the mat, with 95% limits of agreement of roughly −1.4 to +3.2 cm. Squat jumps showed a similar bias of about 1.0 cm. The correlation between the two devices was 0.97 for countermovement jumps. When the same researcher re-scored the videos a week later, the intraclass correlation was 0.97, and the smallest change they could call real (the minimal detectable change) was about 2.3 cm for the countermovement jump.

## Why it matters

Coaches and school sports staff rarely have a contact mat or force plate. If a phone gives nearly the same number, jump tests can be run on any pitch, and changes over a season can be tracked cheaply. The small, steady bias matters too: it means app and mat results should not be mixed in one record without allowing for it.

## How they did it

The phone sat on a tripod 30 cm off the floor and 1.5 m from the player. Each player did three of each jump with two minutes' rest, and the best one was kept. In the app, a rater picks the frame where the feet leave the ground and the frame where they touch down. The number of frames divided by the frame rate is the flight time *t*.

Height then follows from simple physics. If the body leaves and returns to the ground in the same position, it rises for half the flight and falls for the other half, so

*h* = *g* × *t*² / 8

where *h* is the rise of the body's centre of mass in metres and *g* is gravity, 9.81 m/s². Agreement was judged with Bland-Altman plots, correlations and intraclass correlations.

## Check it yourself with fibub

The numbers below are **our own made-up example**, not the paper's data.

1. Open the Jump height tool. In *Mark a video*, set the frame rate to **240** frames/s, the rate the study used.
2. Suppose you film a countermovement jump and the feet leave the ground on frame **1210** and land on frame **1342**. Type those in as take-off and landing (or open your own video and use the frame buttons to mark them).
3. The tool reports a flight of 132 frames, which is **550 ms**, and a height of **37.1 cm**. It also shows the range if either mark is one frame out: **36.5 to 37.7 cm**.
4. Now change the frame rate to **30** frames/s, a normal phone video, and imagine the same jump spans 17 frames (151 to 168). The height is 39.4 cm, but the one-frame range swells to **34.9 to 44.1 cm**. That is why the study filmed at 240 frames per second.
5. Press *Add to the list*, or type a set of flight times straight into the *Jumps* box, for example 550, 563 and 542 ms for three countermovement jumps. With the frame rate still on 240 they give 37.1, 38.9 and 36.0 cm: a best of 38.9 cm and a mean of 37.3 cm (SD 1.4 cm).

A handy rule falls out of the formula. Near 550 ms of flight, every extra 7.4 ms adds about 1 cm of height. At 240 frames per second, one frame lasts 4.2 ms, so the paper's 0.94 cm bias is less than two frames of flight. A small habit in where the rater marks take-off or landing, or a slight knee bend on landing that stretches the flight, would be enough to explain it.

To test an app against a mat in your own group, paste the paired heights into the Bland-Altman tool (app as method A, mat as method B, unit `cm`). It gives the bias, the limits of agreement with their confidence intervals, and a line that shows whether the gap grows for higher jumpers.

## The fine print

- The reference was a contact mat, which also uses flight time. It shares the same landing-posture error, so it is not a true gold standard; a force plate would be stronger.
- The sample was small (21 players), all male and from one club, tested indoors.
- Only one rater scored the videos, so the study says nothing about how two different people would agree.
- Jumps were always done in the same order, countermovement first, so tiredness or practice could play a part.
- Heights from flight time assume take-off and landing in the same body position. Read the paper for its full methods and tables.
