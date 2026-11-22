---
title: "Meteor showers and the ZHR"
summary: "Meteor showers happen when Earth crosses a stream of comet dust. Meteors seem to fan out from a radiant. The zenithal hourly rate turns your own count into a number anyone can compare."
minutes: 20
updated: 2026-11-22
quiz:
  - q: "What causes a meteor shower?"
    choices: ["Stars falling", "Earth passing through dust left along a comet's orbit", "Satellites burning up"]
    ans: 1
    why: "Grains of comet dust hit the upper atmosphere at tens of km per second and burn up."
  - q: "Why do shower meteors seem to come from one point, the radiant?"
    choices: ["Perspective: parallel paths seem to spread from a vanishing point", "They all come from one star", "Earth's magnetic field focuses them"]
    ans: 0
    why: "Like railway tracks meeting in the distance, parallel meteor paths appear to diverge from a point."
  - q: "You count 30 meteors in an hour with the radiant at 30° altitude and a perfect sky. What is the ZHR?"
    choices: ["15", "30", "60"]
    ans: 2
    why: "Correct for radiant height: 30 ÷ sin(30°) = 60."
sources:
  - "International Meteor Organization (IMO), imo.net: ZHR method and shower calendar"
---

**Module 5 · about 20 minutes · logarithms and sines.** You'll be able to explain meteor showers and radiants, plan a session, and turn a count into a zenithal hourly rate.

## 1. Why this matters

A meteor shower needs no equipment and gives real data: the International Meteor Organization combines counts from observers worldwide to measure shower activity, which tests models of comet dust streams. And it is one of the best ways to show anyone that the sky is alive.

## 2. Where meteors come from

Comets shed dust as they near the Sun. Over many orbits the dust spreads along the comet's path. When Earth crosses that stream each year, grains hit the atmosphere at 11 to 72 km/s and heat the air into a glowing streak about 80 to 120 km up. Most are smaller than a grain of sand.

Because the grains travel in parallel, perspective makes them seem to fan out from one point: the **radiant**. Each shower is named after the constellation of its radiant: Perseids (Perseus) in August, Geminids (Gemini) in December.

## 3. Watching

- Lie back and look about 40° to 60° up, some 30° to 50° away from the radiant: meteors there have longer trails.
- No telescope or binoculars: they show too little sky.
- Showers are usually best after midnight, when your side of Earth faces forward along its orbit and sweeps up more dust.
- Moonlight hides faint meteors; check the phase (Lesson 1.4).

## 4. Making counts comparable

Your hourly count depends on your sky, the radiant's height and cloud. The **zenithal hourly rate (ZHR)** corrects for all three: it is what one observer would see under a perfect sky (limiting magnitude 6.5) with the radiant overhead.

<!--fig:zhr-calc-->

Things to notice:

- A radiant at 30° doubles the correction; at 10° it is nearly 6 times, and unreliable.
- A city sky (limiting magnitude 5) multiplies the count by about 4 for a typical shower.

<details class="maths" open>
<summary>Maths and principle</summary>

**IMO formula:**

```math
\text{ZHR} = \frac{N}{T_\text{eff}} \times \frac{1}{1-k} \times r^{\,6.5 - \text{lm}} \times \frac{1}{\sin h_R}
```

- `$N$` meteors seen in `$T_\text{eff}$` hours of actual watching,
- `$k$` the fraction of your field hidden by cloud or obstacles,
- `$\text{lm}$` your limiting magnitude,
- `$h_R$` the radiant's altitude,
- `$r$` the **population index**: how many times more meteors there are for each magnitude fainter (about 2 to 3; 2.5 is a common default).

**Try it:** 40 meteors in 1 hour, lm 5.8, radiant 45°, no cloud: `$40 \times 2.5^{0.7} \times 1/\sin 45^\circ = 40 \times 1.90 \times 1.414 = 107$`.
</details>

## 5. Worked example

*Comparing two observers.* A counts 25 per hour from a city (lm 5.0) with the radiant at 40°; B counts 60 from a dark site (lm 6.5) with the radiant at 60°.

- A: `$25 \times 2.5^{1.5} / \sin 40^\circ = 25 \times 3.95 / 0.643 = 154$`.
- B: `$60 \times 1 / \sin 60^\circ = 60 / 0.866 = 69$`.

Very different results: the ZHR is sensitive to the limiting magnitude and to `$r$`, so a city observer's ZHR has large uncertainty. That is why the IMO asks each observer to measure lm carefully, by counting stars in set areas.

## 6. Practice

1. 20 meteors in 2 hours, lm 6.5, radiant overhead, no cloud: ZHR?
2. Why are meteors from a radiant near the horizon long and slow-looking?
3. Name the shower peaking in mid-August.

<details>
<summary>Answers</summary>

1. 10.
2. They skim the atmosphere at a shallow angle, so they travel far across the sky before burning out.
3. The Perseids, from Comet 109P/Swift-Tuttle.
</details>

**Try it on the real sky:** see this year's showers with Moon conditions and best hours for your town with the [[meteor-shower-planner]].

**New words:** *meteor*, *meteoroid*, *radiant*, *zenithal hourly rate*, *population index*, *limiting magnitude*.
