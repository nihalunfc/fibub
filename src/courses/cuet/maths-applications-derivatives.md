---
title: 'Maths: applications of derivatives'
seoTitle: 'Applications of derivatives for CUET Maths: maxima, minima'
summary: 'Rate of change, increasing and decreasing functions, and finding maxima and minima with the first and second derivative tests, including word problems, with a live optimisation problem.'
minutes: 22
updated: 2026-11-22
quiz:
  - q: 'f(x) = x³ − 3x is decreasing on:'
    choices: ['(−1, 1)', '(1, ∞)', '(−∞, −1)']
    ans: 0
    why: 'f′(x) = 3x² − 3 = 3(x − 1)(x + 1), negative between −1 and 1.'
  - q: 'At a critical point f′(c) = 0 and f″(c) > 0. Then c is a:'
    choices: ['local minimum', 'local maximum', 'point of inflection']
    ans: 0
    why: 'f″ > 0 means the graph curves upward (a cup), so the flat point is a bottom.'
  - q: 'The radius of a circle grows at 2 cm/s. When r = 5 cm, the area grows at:'
    choices: ['20π cm²/s', '10π cm²/s', '4π cm²/s']
    ans: 0
    why: 'dA/dt = 2πr dr/dt = 2π × 5 × 2 = 20π.'
sources:
  - 'NCERT, Mathematics Part I (Class 12), Application of Derivatives'
  - 'National Testing Agency, CUET (UG) Mathematics syllabus https://cuet.nta.nic.in/ (checked 2026-11-22)'
  - 'Questions: original fibub writing for this course'
---

**Module 8 · about 22 minutes.** By the end you will find where functions rise and fall and solve maximum and minimum word problems. Read first: [continuity and differentiability](/learn/courses/cuet/maths-continuity/).

<div class="bigidea">The derivative tells you which way the graph is heading. Where it is zero the graph is momentarily flat, and those flat spots are where the peaks and valleys hide.</div>

**Everyday picture:** walking over a hill in fog. You cannot see the top, but you know you have reached it when the ground stops rising and starts falling. f′ changing from + to − is exactly that.

## 1. Rates and monotonicity

Related rates: if two quantities are linked, differentiate the link with respect to time (dA/dt = 2πr dr/dt). A function is increasing where f′ &gt; 0 and decreasing where f′ &lt; 0; find where f′ = 0, split the number line there, and test the sign in each piece.

## 2. Maxima and minima

<div class="steps" data-title="The recipe for any optimisation problem">
<div class="step"><b>Name the quantity</b> to maximise or minimise and write it in terms of one variable (use the constraint to get rid of the others).</div>
<div class="step"><b>Differentiate</b> and solve f′(x) = 0 for critical points.</div>
<div class="step"><b>Test:</b> f″(x) &lt; 0 maximum, f″(x) &gt; 0 minimum. If f″ = 0, check the sign change of f′ (first derivative test).</div>
<div class="step"><b>On a closed interval,</b> also check the end points; the absolute max or min may sit there.</div>
<div class="step"><b>Answer the question asked:</b> the area, the cost, or the dimensions.</div>
</div>

<div class="problem" data-problem="max-fence"></div>

| Classic result | Answer |
|---|---|
| Rectangle with fixed perimeter, max area | a square |
| Open box from a square sheet a, cutting squares x | x = a/6 |
| Closed cylinder, fixed volume, least surface | height = diameter |
| Two numbers with fixed sum, max product | equal numbers |

<div class="myth">

**"f′(c) = 0 always means a maximum or a minimum."** f(x) = x³ has f′(0) = 0 but keeps rising through 0: a point of inflection. Always check the sign change or f″.

</div>

## 3. Practice

<div class="qbank" data-bank="entrance-maths" data-topics="applications-derivatives" data-exam="cuet" data-n="10" data-mode="practice" data-type="mcq"></div>

<div class="keypoints">

- Related rates: differentiate the link with respect to time.
- f′ &gt; 0 increasing, f′ &lt; 0 decreasing.
- f′ = 0 and f″ &lt; 0: max; f″ &gt; 0: min.
- Closed interval: compare critical points and end points.

</div>
