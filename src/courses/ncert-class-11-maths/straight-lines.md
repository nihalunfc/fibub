---
title: Straight Lines
seoTitle: 'Straight Lines Class 11 notes and examples'
summary: 'Class 11 Straight Lines with animations: slope, angle between lines, collinear points, forms of the equation and distance from a point or between parallels.'
minutes: 90
updated: 2026-11-23
quiz:
  - q: 'The slope of the line through (1, 2) and (4, 8) is:'
    choices: ['2', '1/2', '3', '6']
    ans: 0
    why: 'm = (8 − 2)/(4 − 1) = 6/3 = 2.'
  - q: 'The distance of the point (1, 1) from the line 3x + 4y − 12 = 0 is:'
    choices: ['1', '5', '7/5', '12/5']
    ans: 0
    why: '|3 + 4 − 12| / √(9 + 16) = 5/5 = 1.'
  - q: 'Two lines with slopes 2 and −1/2 are:'
    choices: ['perpendicular', 'parallel', 'the same line', 'neither']
    ans: 0
    why: 'The product of slopes is 2 × (−1/2) = −1, which is the condition for perpendicular lines.'
sources:
  - 'NCERT Class 11 Mathematics, Chapter 9 “Straight Lines” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Standard coordinate geometry of the line (see e.g. Coxeter, H. S. M., Introduction to Geometry, 2nd ed., chapter 14); every worked example was recomputed in code.'
---

**Maths · Class 11 · Chapter 9 · about 90 minutes.** By the end you will be able to find the slope of a line, the angle between two lines, test for parallel, perpendicular and collinear, write the equation of a line in each standard form, and find the distance of a point from a line and between two parallel lines.

<div class="bigidea">A straight line is the simplest curve, and one number, its slope, tells you how steep it is. Everything in this chapter grows from two facts: a line is fixed by a point and a slope (or by two points), and the equation <em>Ax + By + C = 0</em> holds for exactly the points on it. With a little algebra you can then measure angles and distances without drawing anything.</div>

## 1. Slope of a line

The **slope** (gradient) tells how many units the line rises for each unit it moves to the right. A road that gains 5 m of height over 100 m of horizontal distance has slope `$5/100 = 0.05$`. For a line through `$A(x_1, y_1)$` and `$B(x_2, y_2)$` with `$x_1 \ne x_2$`:

```math
m = \frac{y_2 - y_1}{x_2 - x_1} = \frac{\text{rise}}{\text{run}} = \tan\theta
```

where `$\theta$` is the angle from the positive x-axis to the line, measured anticlockwise (`$0^\circ \le \theta < 180^\circ$`). Drag the two points and watch the rise, the run and the angle.

<figure class="fig" data-fig="c11m-lines-slope"><figcaption>Slope = rise / run = tan θ. Flat line: slope 0. Leaning left: negative slope. Vertical: the run is 0, so the slope is not defined.</figcaption></figure>

<div class="meaning">
<dl>
<dt>`$m > 0$`</dt><dd>the line rises as you move right (`$0^\circ < \theta < 90^\circ$`).</dd>
<dt>`$m < 0$`</dt><dd>the line falls as you move right (`$90^\circ < \theta < 180^\circ$`).</dd>
<dt>`$m = 0$`</dt><dd>horizontal line, parallel to the x-axis.</dd>
<dt>undefined</dt><dd>vertical line, parallel to the y-axis (`$\theta = 90^\circ$`).</dd>
</dl>
</div>

<div class="problem" data-problem="c11m-lines-slope"></div>

### 1.1 Parallel, perpendicular and collinear

- **Parallel** lines have equal slopes: `$m_1 = m_2$`.
- **Perpendicular** lines have slopes whose product is `$-1$`: `$m_1 m_2 = -1$`. (Turn a line through 90° and the rise and run swap, and one of them changes sign.)
- Three points are **collinear** (on one line) when the slope of `$AB$` equals the slope of `$BC$`, because both segments share the point `$B$`.

<figure class="fig" data-fig="c11m-lines-collinear"><figcaption>Drag A, B, C. When the slope of AB equals the slope of BC, the two lines drawn through them coincide: the points are collinear.</figcaption></figure>

<div class="myth">

**"A vertical line has slope ∞, a horizontal line has slope 1."** A horizontal line has slope **0** (no rise) and a vertical line has **no slope**, because its run is zero and you cannot divide by zero. Also note that "slope of the x-axis" is 0, but the *equation* of the x-axis is `$y = 0$`.

</div>

## 2. Angle between two lines

If the lines have slopes `$m_1$` and `$m_2$`, the angle `$\theta$` between them satisfies

```math
\tan\theta = \left|\frac{m_1 - m_2}{1 + m_1 m_2}\right| \quad (m_1 m_2 \ne -1)
```

This gives the *acute* angle (the other is `$180^\circ - \theta$`). When `$m_1 = m_2$` the numerator is zero and `$\theta = 0^\circ$` (parallel). When `$m_1 m_2 = -1$` the denominator is zero, which means `$\theta = 90^\circ$` (perpendicular). The formula comes from `$\theta = \theta_1 - \theta_2$` and the tangent of a difference: `$\tan(\theta_1 - \theta_2) = \dfrac{\tan\theta_1 - \tan\theta_2}{1 + \tan\theta_1\tan\theta_2}$`.

<figure class="fig" data-fig="c11m-lines-angle"><figcaption>Two lines through the origin. Change the slopes: equal slopes give 0°, slopes whose product is −1 give 90°.</figcaption></figure>

<div class="problem" data-problem="c11m-lines-angle"></div>

## 3. Equations of a line

### 3.1 Horizontal and vertical lines

The line parallel to the x-axis at height `$b$` is `$y = b$`; the line parallel to the y-axis at distance `$a$` is `$x = a$`. The axes themselves are `$y = 0$` and `$x = 0$`.

### 3.2 Point-slope form

A line through `$(x_1, y_1)$` with slope `$m$`: take any other point `$(x, y)$` on it; its slope to `$(x_1, y_1)$` is again `$m$`:

```math
y - y_1 = m\,(x - x_1)
```

### 3.3 Two-point form

Through `$(x_1, y_1)$` and `$(x_2, y_2)$`: first find `$m = \dfrac{y_2 - y_1}{x_2 - x_1}$`, then use the point-slope form:

```math
y - y_1 = \frac{y_2 - y_1}{x_2 - x_1}\,(x - x_1)
```

<div class="steps" data-fig="c11m-lines-twopoints">
<div class="step">Question: find the equation of the line through P(1, 2) and Q(4, 8).</div>
<div class="step">Slope: m = (8 − 2)/(4 − 1) = 6/3 = 2. The rise is 6 for a run of 3.</div>
<div class="step">Point-slope form using P: y − 2 = 2(x − 1).</div>
<div class="step">Simplify: y − 2 = 2x − 2, so y = 2x. This is the slope-intercept form with c = 0 (the line passes through the origin).</div>
<div class="step">Check Q: 2(4) = 8 ✓. In general form the line is 2x − y = 0.</div>
</div>

### 3.4 Slope-intercept form

A line with slope `$m$` that cuts the y-axis at `$(0, c)$`: `$y = mx + c$`. The number `$c$` is the **y-intercept**. A taxi that charges ₹50 to start plus ₹12 per km has cost `$y = 12x + 50$`: slope 12 (rupees per km), intercept 50 (the fixed charge).

<figure class="fig" data-fig="c11m-lines-slopeint"><figcaption>y = mx + c. The slope tells how y changes when x grows by 1; c is where the line cuts the y-axis. Watch the x-intercept at −c/m.</figcaption></figure>

<div class="problem" data-problem="c11m-lines-yint"></div>

### 3.5 Intercept form

A line that cuts the axes at `$(a, 0)$` and `$(0, b)$` has equation

```math
\frac{x}{a} + \frac{y}{b} = 1
```

Check: put `$(a, 0)$`: `$1 + 0 = 1$` ✓; put `$(0, b)$`: `$0 + 1 = 1$` ✓. It cannot describe a line through the origin or a line parallel to an axis (zero intercepts).

<figure class="fig" data-fig="c11m-lines-intercept"><figcaption>The intercept form x/a + y/b = 1. The line and the axes enclose a triangle of area ½|ab|.</figcaption></figure>

### 3.6 Normal form

Drop a perpendicular of length `$p > 0$` from the origin to the line, making an angle `$\alpha$` with the positive x-axis. Then the line is

```math
x\cos\alpha + y\sin\alpha = p
```

<figure class="fig" data-fig="c11m-lines-normal"><figcaption>The normal form. p is the length of the perpendicular from the origin; α is the angle of that perpendicular. Turn α to rotate the line around the origin.</figcaption></figure>

### 3.7 General form

Every straight line can be written as `$Ax + By + C = 0$` with `$A$` and `$B$` not both zero. To convert it:

- **Slope-intercept:** `$y = -\dfrac AB x - \dfrac CB$`, so slope `$m = -\dfrac AB$` and y-intercept `$c = -\dfrac CB$` (if `$B \ne 0$`).
- **Intercept form:** if `$C \ne 0$`, `$\dfrac{x}{-C/A} + \dfrac{y}{-C/B} = 1$`.
- **Normal form:** divide through by `$\sqrt{A^2 + B^2}$` and move the constant to the right so that it is positive: `$p = \dfrac{|C|}{\sqrt{A^2 + B^2}}$`.

**Example.** Reduce `$3x - 4y + 10 = 0$` to all forms. Slope-intercept: `$y = \tfrac34 x + \tfrac52$` (slope `$3/4$`). Intercept form: `$-3x + 4y = 10$` gives `$\dfrac{x}{-10/3} + \dfrac{y}{5/2} = 1$`. Normal form: `$\sqrt{9 + 16} = 5$`, so `$-\tfrac35 x + \tfrac45 y = 2$` and `$p = 2$`.

<!--fig:tool line-forms-->

<div class="myth">

**Forgetting the sign when finding the slope from Ax + By + C = 0.** The slope is `$-A/B$`, with a minus sign. For `$2x + 3y - 6 = 0$` the slope is `$-2/3$`, not `$2/3$`; a quick sanity check is that the line cuts the axes at (3, 0) and (0, 2), so it falls as it moves right.

</div>

## 4. Distance of a point from a line

The shortest distance from a point `$P(x_0, y_0)$` to the line `$Ax + By + C = 0$` is the length of the perpendicular from `$P$` to the line:

```math
d = \frac{|Ax_0 + By_0 + C|}{\sqrt{A^2 + B^2}}
```

The sign of `$Ax_0 + By_0 + C$` (before taking the absolute value) tells you which side of the line the point is on: two points with the same sign are on the same side. The next picture shows the perpendicular and the foot of the perpendicular.

<figure class="fig" data-fig="c11m-lines-distance"><figcaption>Drag P. The dashed perpendicular is the shortest way to the line and its length matches the formula. The formula's numerator is zero exactly when P is on the line.</figcaption></figure>

<div class="problem" data-problem="c11m-lines-distance"></div>

### 4.1 Distance between parallel lines

Two parallel lines `$Ax + By + C_1 = 0$` and `$Ax + By + C_2 = 0$` are a constant distance apart. Pick any point on the first one, then use the formula above:

```math
d = \frac{|C_1 - C_2|}{\sqrt{A^2 + B^2}}
```

Make sure both equations have exactly the same `$A$` and `$B$` first. For `$3x + 4y - 6 = 0$` and `$6x + 8y + 8 = 0$`, rewrite the second as `$3x + 4y + 4 = 0$` and get `$d = |-6 - 4|/5 = 2$`.

<figure class="fig" data-fig="c11m-lines-parallel"><figcaption>Two parallel lines. Slide C₂: the distance is |C₁ − C₂| divided by √(A² + B²). The dashed segment is perpendicular to both lines.</figcaption></figure>

<div class="problem" data-problem="c11m-lines-parallel"></div>

<!--fig:tool linear-explorer-->

### 4.2 Worked example: the foot of a perpendicular

Find the foot of the perpendicular from `$P(4, 3)$` to the line `$x + y = 1$`, using slopes rather than a formula. The line has slope `$-1$`, so the perpendicular has slope `$1$` and equation `$y - 3 = x - 4$`, i.e. `$y = x - 1$`. Meeting `$x + y = 1$`: `$x + x - 1 = 1$`, so `$x = 1$`, `$y = 0$`. The foot is `$(1, 0)$`, and the distance is `$\sqrt{3^2 + 3^2} = 3\sqrt2$`. Check with the formula: `$|4 + 3 - 1|/\sqrt2 = 6/\sqrt2 = 3\sqrt2$` ✓.

Related points: the midpoint or a dividing point of two points is found with the [Section formula](/learn/section-formula/) tool, and you can draw any line with the [Function grapher](/science/function-grapher/).

<div class="history">

- **c. 1637:** Pierre de Fermat and René Descartes join algebra and geometry; an equation now describes a curve. Lines are the first case.
- **Ancient India:** Aryabhata and Brahmagupta already used coordinates of a kind for positions of planets.
- **Today:** Every map app uses the distance-from-a-line idea, for example to find how far you are from a road.

</div>

<div class="keypoints">

- Slope `$m = \dfrac{y_2 - y_1}{x_2 - x_1} = \tan\theta$`. Horizontal: `$m = 0$`; vertical: no slope.
- Parallel: `$m_1 = m_2$`. Perpendicular: `$m_1 m_2 = -1$`. Collinear points: equal slopes for AB and BC.
- Angle between lines: `$\tan\theta = \left|\dfrac{m_1 - m_2}{1 + m_1 m_2}\right|$`.
- Forms: point-slope `$y - y_1 = m(x - x_1)$`; two-point; slope-intercept `$y = mx + c$`; intercept `$\tfrac xa + \tfrac yb = 1$`; normal `$x\cos\alpha + y\sin\alpha = p$`; general `$Ax + By + C = 0$` with `$m = -A/B$`.
- Distance of `$(x_0, y_0)$` from `$Ax + By + C = 0$`: `$\dfrac{|Ax_0 + By_0 + C|}{\sqrt{A^2 + B^2}}$`.
- Distance between `$Ax + By + C_1 = 0$` and `$Ax + By + C_2 = 0$`: `$\dfrac{|C_1 - C_2|}{\sqrt{A^2 + B^2}}$`.

</div>

Going further for JEE/NEET: [Straight lines](/learn/courses/engineering-entrance/straight-lines/). Related tools: [Line forms](/learn/line-forms/), [Linear explorer](/learn/linear-explorer/) and [Section formula](/learn/section-formula/).
