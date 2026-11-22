---
title: Describing Motion Around Us
seoTitle: 'Motion Class 9 notes: graphs and equations of motion'
summary: 'Class 9 Motion with live figures: distance and displacement, speed and velocity, acceleration, motion graphs, the three equations of motion, circular motion.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'A runner completes exactly one lap of a 400 m track in 80 s. Her average velocity for the lap is:'
    choices: ['5 m/s', '0 m/s', '400 m/s', '80 m/s']
    ans: 1
    why: 'Velocity is displacement divided by time. After one full lap she is back at the start, so the displacement is zero and the average velocity is 0. (Her average speed is 400/80 = 5 m/s.)'
  - q: 'In a velocity-time graph, the area between the line and the time axis gives the:'
    choices: ['acceleration', 'displacement', 'time taken', 'force']
    ans: 1
    why: 'Area = velocity × time = displacement. This is why the area under a v-t graph is a distance, for example the area of a trapezium for uniform acceleration.'
  - q: 'A car moving at 20 m/s brakes uniformly at 5 m/s² until it stops. Using v² = u² + 2as, the braking distance is:'
    choices: ['20 m', '40 m', '80 m', '4 m']
    ans: 1
    why: '0 = 20² + 2(−5)s, so s = 400/10 = 40 m. Check with time: it stops in 4 s with average speed 10 m/s, so 40 m.'
sources:
  - 'NCERT Class 9 Science (Exploration), Chapter 4 “Describing Motion Around Us” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Standard acceleration of gravity g = 9.80665 m/s²: 3rd General Conference on Weights and Measures (CGPM), 1901; BIPM SI Brochure, 9th edition (2019)'
---

**Science · Class 9 · Chapter 4 · about 50 minutes.** By the end you will be able to tell distance from displacement and speed from velocity, work out acceleration, draw and read position-time and velocity-time graphs, derive and use the three equations of motion, and explain why motion in a circle is accelerated even at constant speed.

<div class="bigidea">To describe motion you need only three ideas: where you are (position), how fast that is changing (velocity) and how fast that is changing (acceleration). A graph of position against time shows velocity as its slope; a graph of velocity against time shows acceleration as its slope and the distance as its area. The three equations of motion are just those two facts, written out.</div>

## 1. Rest, motion and reference points

Is the passenger sitting in a moving train at rest or moving? To the person next to her, she is at rest. To a child standing on the platform she is moving. **Motion is always described relative to a reference point** (a frame of reference). We say an object moves when its position changes with time compared with that point. Unless told otherwise we use the ground.

Motion in a straight line can be:

- **uniform**: equal distances in equal intervals of time (a car at a steady 60 km/h, the second hand of a clock);
- **non-uniform**: unequal distances in equal intervals (a bus in city traffic, a ball thrown up).

## 2. Distance and displacement

Two quantities describe how far something has gone.

- **Distance** is the **total length of the path** travelled. It is a **scalar**: it has size only, and it never decreases.
- **Displacement** is the **shortest straight-line change of position**, from the start to the finish, with its direction. It is a **vector**: it has size **and** direction, and it can be zero.

Think of an auto-rickshaw going from your house to the market by a winding road: the metre reading is the distance, but the straight line "700 m north-east of home" is the displacement.

<figure class="fig" data-fig="c9-mot-disp"><figcaption>Pick a path and slide the walker along it. The distance walked (the blue path) keeps growing. The green arrow, the displacement, goes from the start to the walker: choose the lap and walk all the way round and the displacement comes back to zero, although you have walked 280 m.</figcaption></figure>

<div class="myth">

**“Displacement is just distance with a direction.”** Not quite: displacement is the straight line between the start and the end, so it ignores the route. A runner who does 5 laps of a 400 m track has gone a distance of 2000 m but her displacement is 0. Distance ≥ displacement always (they are equal only for straight-line motion in one direction).

</div>

Try more journeys in this tool, including ones with an out-and-back leg:

<!--fig:tool distance-displacement-->

<div class="problem" data-problem="c9s-mot-circle"></div>

## 3. Speed and velocity

**Speed** tells how fast the distance is covered. **Velocity** tells how fast the **displacement** changes, so it also has a direction.

```math
\text{speed} = \frac{\text{distance}}{\text{time}}, \qquad \text{velocity} = \frac{\text{displacement}}{\text{time}}
```

The SI unit of both is **metre per second (m/s)**. Vehicles use km/h, and 1 km/h = 1/3.6 m/s. A walking person goes about 1.4 m/s; a good sprinter about 10 m/s (36 km/h); sound travels at about 340 m/s.

**Average speed** is the **total distance divided by the total time** for the whole journey. If a bus goes 60 km at 30 km/h and then 60 km at 60 km/h, the average speed is not 45 km/h. The times are 2 h and 1 h, so average speed = 120 km ÷ 3 h = 40 km/h. The slow part lasts longer, so it counts for more.

<div class="problem" data-problem="c9s-mot-avgspeed"></div>

<div class="meaning">
<dl>
<dt>s (or d)</dt><dd>distance travelled, in metres</dd>
<dt>x or displacement</dt><dd>change of position in a straight line, with a sign (+ one way, − the other)</dd>
<dt>v</dt><dd>velocity: displacement per second, in m/s</dd>
<dt>Physical meaning</dt><dd>Velocity answers two questions together: how fast, and which way. Two cars both doing 60 km/h in opposite directions have different velocities but the same speed.</dd>
</dl>
</div>

## 4. Watching motion: dots on a tape

Before you draw a graph, **see** the motion. Imagine a car that drops a dot on the road every second, like the ticker tape in a school laboratory. Equal gaps mean steady speed. Growing gaps mean speeding up. Shrinking gaps mean slowing down. Pick a motion, press Play and watch the two graphs grow from the same dots.

<figure class="fig" data-fig="c9-mot-ticker"><figcaption>The car leaves a dot each second. Left: position against time. Right: speed against time. Steady speed gives a straight position line and a flat speed line. Speeding up bends the position graph upwards and makes the speed line rise. Slowing down does the opposite.</figcaption></figure>

## 5. Acceleration

When the velocity changes (speeds up, slows down or changes direction), the body **accelerates**. Acceleration is the **rate of change of velocity**:

```math
a = \frac{v - u}{t}
```

where u is the **initial** velocity, v the **final** velocity and t the time. The unit is **m/s²**: the velocity changes by that many m/s every second.

- If the speed **rises**, a is positive (in the direction of motion).
- If the speed **falls**, a is negative. People call this **retardation** or deceleration.
- If velocity does not change, a = 0.
- If a stays the same all the time, the motion is **uniformly accelerated**. Example: a stone dropped from a height has a ≈ 9.8 m/s² downward.

A car going from 0 to 100 km/h (about 28 m/s) in 7 s has a = 28/7 = 4 m/s². A cheetah can do about 0 to 100 km/h in 3 s.

<div class="problem" data-problem="c9s-mot-accel"></div>

## 6. Position-time graphs

Plot **time on the x-axis** and **position (distance) on the y-axis**. What the line looks like tells you the story.

| Shape of the x-t graph | Motion |
|---|---|
| horizontal line | at rest |
| straight sloping line | uniform velocity |
| curve getting steeper | speeding up (acceleration) |
| curve getting flatter | slowing down |
| line sloping downwards | moving back towards the start (negative velocity) |

**The slope of an x-t graph is the velocity**: slope = rise ÷ run = change in position ÷ change in time. A steeper line means faster motion.

<figure class="fig" data-fig="c9-mot-slope"><figcaption>Choose a journey and move the time slider. The orange tangent line touches the graph at the current instant, and its slope is the velocity then. On Speeding up the slope grows: acceleration. On Go, stop, go the line goes flat in the middle: at rest. On Out and back it slopes downwards: negative velocity.</figcaption></figure>

Draw your own position-time graphs and read off the speed from them:

<!--fig:tool motion-graphs-->

<div class="myth">

**“A graph shows the path the object took.”** A position-time graph shows position against **time**, not the shape of the road. A car going up and down a hill at steady speed can have a perfectly straight line. And a flat line means at rest, not moving along a flat road.

</div>

## 7. Velocity-time graphs

Now plot **velocity against time**. For a straight-line journey:

| Shape of the v-t graph | Motion |
|---|---|
| horizontal line | constant velocity (a = 0) |
| straight line rising | uniform acceleration |
| straight line falling | uniform retardation |
| curve | non-uniform acceleration |

Two facts make this graph the most useful one in the chapter.

1. **Slope = acceleration.** Slope = change in v ÷ change in t = a.
2. **Area under the graph = displacement.** Area = velocity × time = displacement. For a rectangle it is v × t; for a triangle ½ × base × height; for a trapezium ½ × (sum of parallel sides) × width.

Drag the big dot at the end of the line to change the final speed and the time, and slide the start speed. The shaded area splits into a rectangle (ut) and a triangle (½at²), which is where the second equation of motion will come from:

<figure class="fig" data-fig="c9-mot-vt"><figcaption>The line is v against t. The rectangle (u × t) is the distance you would cover if you never sped up. The triangle (½ × t × at) is the extra distance gained by speeding up. Their total is the whole area, the displacement.</figcaption></figure>

Read a real journey now: a train that speeds up, cruises, slows and stops. Slide the time and watch the speed, the slope and the area so far:

<figure class="fig" data-fig="c9-mot-journey"><figcaption>The slope of each segment is its acceleration (+2, 0, −1 and −2 m/s²). The shaded area up to the red line is the distance covered so far, and when the train stops, the total area is the whole journey: 575 m.</figcaption></figure>

<div class="problem" data-problem="c9s-mot-vtarea"></div>

## 8. The three equations of motion

For **uniform acceleration in a straight line**, three equations connect five quantities: u (initial velocity), v (final velocity), a, t and s (displacement). They come straight from one velocity-time graph. Step through the proof with a worked example (u = 2 m/s, v = 10 m/s, t = 4 s):

<div class="steps" data-fig="c9-mot-eq">
<div class="step">A body starts with speed u = 2 m/s at t = 0 and reaches v = 10 m/s at t = 4 s. Because the acceleration is uniform, the v-t graph is a straight line.</div>
<div class="step">The slope of the line is the acceleration: a = (v − u)/t. Rearrange: <b>v = u + at</b>. Check: 2 + 2 × 4 = 10. (First equation.)</div>
<div class="step">The area under the line is the displacement. It is a trapezium: s = ½ × (u + v) × t. With the numbers: ½ × 12 × 4 = 24 m.</div>
<div class="step">Put v = u + at in that area: s = ½(u + u + at)t, so <b>s = ut + ½at²</b>. In the picture it is the rectangle u × t = 8 plus the triangle ½at² = 16: total 24 m. (Second equation.)</div>
<div class="step">Take t = (v − u)/a and put it in s = ½(u + v)t. You get 2as = v² − u², so <b>v² = u² + 2as</b>. Check: 100 = 4 + 2 × 2 × 24 = 100. (Third equation.)</div>
<div class="step">Which one to use? Pick the equation that leaves out the quantity you neither know nor want: no s in the first, no v in the second, no t in the third.</div>
</div>

```math
v = u + at, \qquad s = ut + \tfrac12 at^2, \qquad v^2 = u^2 + 2as
```

<div class="meaning">
<dl>
<dt>u, v</dt><dd>starting and final velocity, in m/s</dd>
<dt>a</dt><dd>acceleration, in m/s² (negative when the body slows)</dd>
<dt>t</dt><dd>time taken, in s</dd>
<dt>s</dt><dd>displacement in that time, in m</dd>
<dt>Physical meaning</dt><dd>They describe a body whose velocity changes by the <i>same amount every second</i>. They do not work when the acceleration itself keeps changing.</dd>
</dl>
</div>

**How to solve a problem:** (1) list the known and unknown quantities with signs; (2) decide which equation has all the knowns and the unknown; (3) calculate and check the unit. For a body that starts from rest u = 0; for one that stops, v = 0; for a ball thrown up, take upward as positive and a = −9.8 m/s².

<div class="problem" data-problem="c9s-mot-v-eq"></div>

<div class="problem" data-problem="c9s-mot-s-eq"></div>

**Braking distance.** A car going at 72 km/h (20 m/s) needs 40 m to stop if the brakes give 5 m/s². But at 144 km/h (40 m/s), the braking distance is 160 m: doubling the speed multiplies the stopping distance by **four**, because s ∝ u² in v² = u² + 2as. This is why speed limits matter near schools.

<div class="problem" data-problem="c9s-mot-brake"></div>

Use the equations on any numbers and check the answer from a graph:

<!--fig:tool equations-of-motion-->

A ball rolling down a smooth slope is a lovely test of these ideas, because gravity along the slope gives a steady acceleration a = g sin θ. Change the angle, release the ball and watch the dots spread out as it speeds up:

<figure class="fig" data-fig="c9-mot-ramp"><figcaption>The dots are 0.2 s apart. They are further apart as the ball speeds up, and the speed-time graph is a straight line. A steeper ramp means a bigger acceleration, a steeper line and a shorter time down. (Here the ball slides without friction; a rolling ball has a smaller acceleration, but the pattern is the same.) Galileo used ramps like this to slow down falling so he could measure it.</figcaption></figure>

**Free fall.** Drop a stone and a feather in air and they differ because of air resistance. Without air, everything falls with the **same acceleration**, g ≈ 9.8 m/s² near the Earth's surface (the exact standard value is 9.80665 m/s²). A stone dropped from rest falls 4.9 m in the first second, 19.6 m in two seconds and reaches 9.8 m/s after 1 s. Explore free fall in [Free fall](/learn/free-fall/) and track real videos of moving objects with the [Video motion tracker](/science/video-motion-tracker/).

<div class="history">

<ul class="timeline">
<li><b>about 1604</b> Galileo rolls balls down ramps and finds that the distance goes as the square of the time: the first clear description of uniform acceleration.</li>
<li><b>1687</b> Isaac Newton links acceleration to force in his Principia (see the next chapter on forces).</li>
<li><b>1901</b> The international conference on weights and measures fixes the standard value of g as 9.80665 m/s².</li>
</ul>

</div>

## 9. Uniform circular motion

A stone on a string, a car going round a roundabout, the Moon going round the Earth, a ceiling fan blade: all are in motion in a circle. If the **speed** is constant, we call it **uniform circular motion**.

Is it uniform **velocity**? No. The velocity points along the **tangent** to the circle and its direction changes all the time. Since velocity is a vector, a changed direction means the velocity has changed, so **the body is accelerating even at constant speed**.

The **time period T** is the time for one full circle. In one period the body covers the circumference 2πr, so

```math
v = \frac{2\pi r}{T}
```

<figure class="fig" data-fig="c9-mot-circ"><figcaption>Change the speed and radius. The blue arrow (velocity) keeps its length but turns round and round. The green arrow shows the acceleration towards the centre. Press Cut the string: with nothing pulling it inwards, the stone flies off in a straight line along the tangent, at the speed it had.</figcaption></figure>

The cut-string result is exactly why mud flies off a spinning bicycle wheel along a straight line, and why a hammer-thrower lets go at the right instant. **Extension (beyond the exam syllabus):** the acceleration points to the centre and has size a = v²/r.

<div class="problem" data-problem="c9s-mot-circspeed"></div>

<div class="myth">

**“Constant speed means no acceleration.”** Acceleration is a change of **velocity**, and velocity includes direction. A car doing a steady 40 km/h round a bend is accelerating, which is why you are pushed sideways in your seat.

</div>

<div class="keypoints">

- Motion is relative to a reference point. Uniform motion covers equal distances in equal times.
- Distance: path length, scalar, never decreases. Displacement: straight line from start to end with direction, vector, can be zero.
- Speed = distance/time; velocity = displacement/time; average speed = total distance ÷ total time. Unit m/s; km/h ÷ 3.6 = m/s.
- Acceleration a = (v − u)/t in m/s²; negative means slowing (retardation).
- x-t graph: slope = velocity (flat = rest, steeper = faster, downward = coming back).
- v-t graph: slope = acceleration; area under it = displacement.
- Uniform acceleration: v = u + at, s = ut + ½at², v² = u² + 2as (from the v-t graph).
- Free fall near Earth: a = g ≈ 9.8 m/s² downward; braking distance grows as the square of the speed.
- Uniform circular motion: constant speed v = 2πr/T but changing direction, so it is accelerated; cut the string and the body goes off along the tangent.

</div>
