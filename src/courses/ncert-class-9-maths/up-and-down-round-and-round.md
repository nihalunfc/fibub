---
title: 'I’m Up and Down, and Round and Round'
seoTitle: 'Angles and Rotation Class 9 notes: clocks, Ferris wheel'
summary: 'Class 9 rotation with animations: angles, turns, clock-hand angles, periodic motion and the height graph of a Ferris wheel, with live problems.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'What angle does the minute hand of a clock turn through in 10 minutes?'
    choices: ['60°', '30°', '10°', '100°']
    ans: 0
    why: 'The minute hand turns 6° every minute, so in 10 minutes it turns 10 × 6 = 60°. (That is one sixth of a full turn.)'
  - q: 'An arm turned through −50° ends in the same position as an arm turned anticlockwise through:'
    choices: ['310°', '50°', '130°', '230°']
    ans: 0
    why: 'Adding a full turn changes nothing: −50° + 360° = 310°.'
  - q: 'A Ferris wheel takes 8 seconds for one turn. How often does the graph of a rider’s height repeat?'
    choices: ['every 8 s', 'every 4 s', 'every 16 s', 'every 1 s']
    ans: 0
    why: 'After one full turn the rider is back at the same height and moving the same way, so the pattern repeats every 8 s. This time is the period.'
sources:
  - 'NCERT Class 9 Mathematics (Ganita Manjari), Chapter 5 “I’m Up and Down, and Round and Round” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Pendulum period T = 2π√(L/g): standard school physics result for small swings, g = 9.8 m/s². Clock-hand rates (6° and 0.5° per minute) follow from 360° in 60 min and 12 h.'
  - 'Tide period about 12 h 25 min and Moon phase cycle about 29.5 days: standard values from published tide and lunar tables.'
---

**Maths · Class 9 · Chapter 5 · about 50 minutes.** By the end you will be able to measure turns in degrees and as fractions, find the angle between the hands of a clock at any time, say what a period is, and draw the repeating height graph of a point on a turning wheel. This is the first step towards trigonometry in Class 10.

<div class="bigidea">Things that turn come back to where they started: a clock hand, a wheel, a fan. An angle measures how much they have turned. Because a full turn is 360°, everything about turning repeats every 360°, and the height of a point on a turning wheel draws a wave that repeats again and again.</div>

## 1. Angles: how much has it turned?

Look at a ceiling fan. One blade starts pointing to the right. As the fan turns, the blade sweeps round. We measure how much it has turned with an **angle**, in **degrees (°)**. The turn is measured from a fixed **start line**, and it is counted **anticlockwise** (the opposite way to clock hands) when we say it is positive.

A full turn brings the blade back to the start. That is **360°**. Everything else is a fraction of it. Drag the angle, or press the turn buttons, and watch the fraction of a turn change.

<figure class="fig" data-fig="c9-rot-arm"><figcaption>The shaded part shows how much the arm has turned. The readout gives the angle in degrees and as a fraction of a full turn. Go past 360° and you start the second turn.</figcaption></figure>

Why 360? The old Babylonians liked numbers that divide easily: 360 can be halved, thirds, quarters, sixths, eighths, tenths and twelfths without a remainder. That is handy for turns.

<div class="steps" data-fig="c9-rot-turnsteps">
<div class="step">Start with the arm on the start line: no turn, 0°.</div>
<div class="step">A quarter turn: 360 ÷ 4 = 90°. This is a right angle, the corner of your notebook.</div>
<div class="step">A half turn: 360 ÷ 2 = 180°. The arm now points exactly opposite, so the two arms make a straight line.</div>
<div class="step">Three quarters of a turn: 3 × 90 = 270°.</div>
<div class="step">One full turn: 360°. The arm is back at the start.</div>
<div class="step">A fraction that is not a quarter: half of a quarter is ⅛ of a turn, and 360 ÷ 8 = 45°.</div>
</div>

<div class="meaning">
<dl>
<dt>Angle</dt><dd>how much something has turned, measured in degrees from the start line.</dd>
<dt>Fraction of a turn</dt><dd>angle ÷ 360. So `$\tfrac{3}{8}$` of a turn is `$\tfrac{3}{8} \times 360 = 135^\circ$`.</dd>
<dt>Physical meaning</dt><dd>if the arm is a wheel spoke, the angle tells you how far round the rim the wheel has gone: more angle means more rim passed.</dd>
</dl>
</div>

<div class="problem" data-problem="c9m-rot-turn"></div>

A wheel with equally spaced spokes divides its full turn equally. With `$n$` spokes the angle between two neighbours is `$360^\circ \div n$`. The Ashoka Chakra on the national flag has 24 spokes, so its spokes are `$360 \div 24 = 15^\circ$` apart. A cycle wheel with 36 spokes has them 10° apart.

<figure class="fig" data-fig="c9-rot-spokes"><figcaption>Change the number of spokes. The shaded wedge is the angle between two neighbours. Notice that if you turn the wheel by exactly one wedge it looks the same as before: that is why a wheel with many spokes looks smooth when it spins.</figcaption></figure>

<div class="myth">

**“Bigger circle, bigger angle.”** The angle does not depend on the size of the circle. A quarter turn of a small clock and a quarter turn of a huge Ferris wheel are both 90°. The angle only says what fraction of the turn has been made.

</div>

## 2. Turning the other way, and turning more than once

Clocks turn **clockwise**, the way a screw tightens. Mathematicians count the other way, **anticlockwise**, as positive. A clockwise turn is given a minus sign. So a quarter turn clockwise is −90°.

You can also turn more than once. Two full turns is 720°. After 400° the arm has made one full turn and is 40° past the start line. It points exactly where an arm turned by 40° points. Slide the angle, including the negative values, and see which angles end in the same place.

<figure class="fig" data-fig="c9-rot-sign"><figcaption>Anticlockwise is positive, clockwise is negative. The rings show each full turn. The readout tells you the angle between 0° and 360° where the arm ends up.</figcaption></figure>

The rule is simple: **adding or subtracting 360° (a whole turn) does not change where the arm points.** So −30° and 330° and 690° all give the same position. To find the equivalent angle between 0° and 360°, keep adding or taking away 360° until you land in the range.

<div class="problem" data-problem="c9m-rot-coterm"></div>

<div class="myth">

**“A negative angle is smaller than zero, so it does not exist.”** A negative angle is just a turn in the other direction. −90° is a perfectly good angle: a quarter turn clockwise, ending at the same place as 270°.

</div>

## 3. Angles on a clock

A clock is two arms turning at steady speeds, so it is a perfect place to practise angles.

- The **minute hand** goes round once (360°) in 60 minutes, so it turns **6° every minute**.
- The **hour hand** goes round once in 12 hours, so it turns 360 ÷ 12 = **30° every hour**, which is **0.5° every minute**.

Both are measured from the 12, clockwise. The angle between the hands is the difference of the two positions. If it is more than 180°, take 360° minus it, because the smaller angle is the one we call the angle between them. Move the time slider, or press Play, and watch the hands.

<figure class="fig" data-fig="c9-rot-clock"><figcaption>Both hands are measured from the 12. The shaded wedge is the smaller angle between them. At 6:00 the hands make a straight line (180°). At 12:00 they lie on top of each other (0°). Press Play and notice how the minute hand races past the hour hand.</figcaption></figure>

Here is a worked example: the angle between the hands at 4:20.

<div class="steps" data-fig="c9-rot-clocksteps">
<div class="step">A clock showing 4:20. We measure both hands from the 12, going clockwise.</div>
<div class="step">The minute hand has gone 20 minutes: 20 × 6 = 120°. It points at the 4.</div>
<div class="step">At exactly 4:00 the hour hand would be at 4 × 30 = 120°.</div>
<div class="step">But it is 4:20, so the hour hand has moved on 20 × 0.5 = 10° past the 4: it is at 130°.</div>
<div class="step">The angle between the hands is 130° − 120° = 10°. The hands are very close: the minute hand has just caught up with the 4 and the hour hand has just passed it.</div>
</div>

<div class="myth">

**“The hour hand stays on the hour mark until the next hour.”** It does not jump. It creeps along all the time, 0.5° each minute. At 6:30 it is halfway between the 6 and the 7, at 195°, not on the 6.

</div>

Now play with the clock tool: it shows the hands and the angle for any time you set, and lets you find the times when the hands are at a given angle.

<!--fig:tool clock-angles-->

<div class="problem" data-problem="c9m-rot-clock"></div>

A shortcut: the angle between the hands at `$h$` hours and `$m$` minutes is `$|30h - 5.5m|$` degrees (or 360 minus that, if it is bigger than 180). It comes from 30h + 0.5m for the hour hand and 6m for the minute hand, which differ by 30h − 5.5m.

## 4. Repeating motion: the period

Some motions go on and on in the same pattern. A swing goes forward, back, forward, back. The Earth turns round once every day. A heart beats and rests, beats and rests. A motion that repeats exactly after a fixed time is **periodic**. The time for one complete repeat is the **period**.

Take the pendulum of a wall clock. The bob swings to the right, back through the middle, to the left, and back again. One full swing is one cycle. Look at the graph of its position against time: a smooth wave that repeats.

<figure class="fig" data-fig="c9-rot-pendulum"><figcaption>The bob swings and the graph draws its sideways position against time. The orange bar shows one period. Make the string longer: each swing takes longer. Change the swing angle: the period hardly changes at all. That surprised Galileo, who is said to have timed the swinging lamps in a church by counting his pulse.</figcaption></figure>

<div class="meaning">
<dl>
<dt>Cycle</dt><dd>one complete repeat of the pattern: out, back and home again.</dd>
<dt>Period (T)</dt><dd>the time for one cycle, in seconds, hours, days, whatever suits.</dd>
<dt>How to find it</dt><dd>`$T = \dfrac{\text{total time}}{\text{number of cycles}}$`. A pendulum that makes 30 swings in 60 s has a period of 2 s.</dd>
<dt>Physical meaning</dt><dd>a short period means fast repeating, like a buzzing bee’s wings; a long period means slow repeating, like the seasons.</dd>
</dl>
</div>

<div class="problem" data-problem="c9m-rot-period"></div>

The world is full of repeating patterns. Pick one below and see how the same wave shape appears again and again, but with very different periods.

<figure class="fig" data-fig="c9-rot-cycles"><figcaption>Five repeating patterns, each drawn as a wave. The label under the axis shows the time. The seconds hand repeats every 60 s, the sea tide about every 12.4 hours, daylight every year, the Moon every 29.5 days.</figcaption></figure>

<div class="problem" data-problem="c9m-rot-speed"></div>

## 5. The Ferris wheel: height against time

Now the best picture of all. You board a Ferris wheel at the bottom, at ground level. As the wheel turns, you rise to the top, come down the other side and are back at the bottom. Keep going round and your height goes up and down, again and again, in a pattern that repeats exactly once per turn.

Press Play. The wheel turns and draws the height graph.

<figure class="fig" data-fig="c9-rot-ferris"><figcaption>The rider is lowest (0 m) at the start, reaches the middle height after a quarter turn, the top (twice the radius) after a half turn, and is back at the middle after three quarters. Switch Marks on to see the middle line and one period. A bigger wheel makes a taller wave; a faster wheel makes a narrower one.</figcaption></figure>

Check these facts on the graph:

- The **lowest** height is 0 m and the **highest** is `$2R$`, where `$R$` is the radius, because the top is a whole diameter above the bottom.
- The **middle line** is at height `$R$`, the level of the centre of the wheel.
- The pattern repeats every **period**: the time for one turn.

The same wheel in a real tool: change the speed and the size, and read the height at any time.

<!--fig:tool ferris-wheel-->

<div class="problem" data-problem="c9m-rot-ferris"></div>

## 6. The height of a turning point and the idea of sine

Now forget the Ferris wheel and think of any point going round a circle of radius R. Measure its height above the **centre** (above is positive, below is negative) and plot that against the angle turned. We start at the right-hand end.

<div class="steps" data-fig="c9-rot-heightsteps">
<div class="step">Start at the right-hand end of the wheel: angle 0°. The point is level with the centre, so its height is 0.</div>
<div class="step">After a quarter turn (90°) the point is at the very top. Height = +R, the greatest possible.</div>
<div class="step">After a half turn (180°) it is level with the centre again, at the left-hand end. Height 0.</div>
<div class="step">After three quarters of a turn (270°) it is at the very bottom. Height = −R.</div>
<div class="step">After a full turn (360°) it is back at the start, and the height is 0 once more.</div>
<div class="step">Join the five dots with a smooth curve. This is the height wave. Going round again repeats it, so it repeats every 360°.</div>
</div>

Try any angle yourself. The tall number we plot is the height divided by the radius. It goes from 0 up to 1, down to −1 and back to 0. In Class 10 you will meet this number as the **sine** of the angle. You do not need any formula yet: the wave is the idea. You can also measure the sideways distance from the centre instead; the wave has the same shape, just starting from its top. That one is the **cosine**.

<figure class="fig" data-fig="c9-rot-height"><figcaption>Drag the angle and the point moves round the circle while the dot moves along the graph. Switch between height and sideways distance. The values 0.5 at 30° and 0.87 at 60° are worth remembering for later.</figcaption></figure>

<div class="myth">

**“The graph goes up in a straight line because the wheel turns steadily.”** The wheel turns steadily but the height does not change steadily. Near the bottom and the top the rider is moving mostly sideways, so the height changes slowly; near the middle the rider moves mostly up or down, so the height changes quickly. That is why the graph is a wave, not a straight line.

</div>

Meet the same idea on the unit circle, where the radius is 1 so the height is exactly the number we plot.

<!--fig:tool unit-circle-->

<div class="keypoints">

- An angle measures a turn in degrees; one full turn is 360°, a half turn 180° and a quarter turn 90°. A fraction p/q of a turn is p/q × 360°.
- Anticlockwise turns are positive and clockwise turns are negative. Adding or subtracting 360° leaves the final position unchanged.
- With n equal spokes the angle between neighbours is 360° ÷ n.
- Minute hand: 6° per minute. Hour hand: 30° per hour, 0.5° per minute. The angle between the hands is the difference of their positions (the smaller one, at most 180°).
- A periodic motion repeats exactly; the period is the time for one cycle, T = total time ÷ number of cycles.
- The height of a point on a turning wheel draws a wave: lowest 0 and highest 2R for a Ferris wheel from the ground, or +R and −R above the centre. It repeats every full turn. This wave is the idea behind sine.

</div>

Other tools that go with this chapter: the [Unit circle](/learn/unit-circle/), [Ferris wheel](/learn/ferris-wheel/) and [Clock angles](/learn/clock-angles/) pages work with the same ideas on their own. Ready for exam-style questions? Go to [I’m Up and Down, and Round and Round: practice questions](/learn/courses/ncert-class-9-maths/up-and-down-round-and-round-practice/).
