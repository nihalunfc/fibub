---
title: Statistics
seoTitle: 'Statistics Class 10 notes: mean, median, mode'
summary: 'Class 10 Statistics with animations: mean of grouped data by three methods, mode and median of grouped data, with live problems and practice.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'The class mark of the class 40–60 is:'
    choices: ['50', '20', '100', '40']
    ans: 0
    why: 'The class mark is the middle of the class: (40 + 60) ÷ 2 = 50.'
  - q: 'In a grouped table Σf = 50 and Σfx = 2400. The mean is:'
    choices: ['48', '24', '120000', '52']
    ans: 0
    why: 'Mean = Σfx ÷ Σf = 2400 ÷ 50 = 48.'
  - q: 'For grouped data the median class is the class where:'
    choices: ['the cumulative frequency first reaches n/2', 'the frequency is highest', 'the class mark is largest', 'the class width is smallest']
    ans: 0
    why: 'The middle observation is number n/2. The first class whose cumulative frequency is at least n/2 contains it. The highest frequency picks the modal class instead.'
sources:
  - 'NCERT Class 10 Mathematics, Chapter 13 “Statistics” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Standard school statistics: grouped frequency tables, the mean (direct, assumed mean and step-deviation), mode and median formulas. Written for fibub; every worked example was recomputed by a second method.'
---

**Maths · Class 10 · Chapter 13 · about 55 minutes.** By the end you will be able to put raw numbers into a frequency table, find the mean of grouped data by three methods, find the modal class and the mode, find the median class and the median, and say which average suits which job.

<div class="bigidea">When there are hundreds of numbers we group them into classes and let one number stand for each class. Three “averages” then sum the data up: the mean (the balance point), the median (the middle one) and the mode (the most popular). Each has a short formula that works on a table.</div>

## 1. Grouped data: frequency tables and class marks

Suppose 40 batters in a school tournament scored these runs: 3, 87, 45, 52, ... forty numbers in all. Nobody can read that. So we sort the numbers into **classes** (also called class intervals) such as 0–20, 20–40, 40–60, and count how many fall in each. That count is the **frequency** `$f$`. The result is a **frequency distribution table**.

Think of the scorecard board outside a stadium: it does not list every ball, it groups the information. Watch the numbers drop into their classes and build a **histogram**, a bar graph with no gaps between the bars because the classes touch.

<figure class="fig" data-fig="c10-stat-hist"><figcaption>Press Play: each observation falls into its class and the bar grows. The bar's height is the frequency f. Switch on the class marks to see the middle value x of each class. Try the three data sets.</figcaption></figure>

<div class="meaning">
<dl>
<dt>Class interval</dt><dd>a range of values such as 20–40. In this chapter classes are written lower–upper, and a value equal to the upper limit goes into the next class, so 40 belongs to 40–60, not 20–40.</dd>
<dt>Class width h</dt><dd>upper limit minus lower limit (here 20). In a table with equal classes, h is the same everywhere.</dd>
<dt>Frequency f</dt><dd>how many observations fall in the class.</dd>
<dt>Class mark x</dt><dd>the middle of the class: x = (lower limit + upper limit) ÷ 2. We pretend every observation in the class equals x. This is the one approximation made in grouped data.</dd>
<dt>n or Σf</dt><dd>the total number of observations. The symbol Σ (sigma) just means “add up”.</dd>
</dl>
</div>

<div class="myth">

**“Grouping loses nothing.”** It does lose detail. Once we group, we no longer know the exact scores inside a class, so the mean, median and mode we find are good estimates, not exact values.

</div>

Now try reading a class mark yourself:

<div class="problem" data-problem="c10m-stat-mean"></div>

## 2. The mean of grouped data

For a plain list of numbers, mean = sum ÷ count. For a table the same idea needs one change: a class with frequency `$f$` and class mark `$x$` contributes `$f$` copies of `$x$`, so it adds `$f \times x$` to the total.

```math
\bar{x} = \frac{\sum f x}{\sum f}
```

This is the **direct method**. Why is the mean called a balance point? Put a block of weight `$f$` at each class mark on a beam and the beam balances exactly at the mean. Slide the fulcrum yourself:

<figure class="fig" data-fig="c10-stat-balance"><figcaption>Blocks sit at the class marks; taller stacks are bigger frequencies. The beam tips towards the heavier side and is level only when the fulcrum is at the mean. Try the data with a long tail: the mean is pulled towards the tail.</figcaption></figure>

<div class="meaning">
<dl>
<dt>x̄ (x-bar)</dt><dd>the mean.</dd>
<dt>Σfx</dt><dd>add up f × x for every class. It is the “total” of all the data, treating each observation as its class mark.</dd>
<dt>Σf</dt><dd>the number of observations, n.</dd>
<dt>Physical meaning</dt><dd>the mean is the point where the data would balance: the pulls to the left of it exactly cancel the pulls to the right, Σf(x − x̄) = 0.</dd>
</dl>
</div>

Here is the direct method on the 40 batters:

<div class="steps" data-fig="c10-stat-direct">
<div class="step">The table of runs of 40 batters, with classes 0–20 up to 80–100 and their frequencies 5, 9, 14, 8, 4.</div>
<div class="step">Find the class mark x of each class, the middle: for 40–60 it is (40 + 60) ÷ 2 = 50.</div>
<div class="step">Multiply each frequency by its class mark in a new column: 5 × 10 = 50, 9 × 30 = 270, 14 × 50 = 700, 8 × 70 = 560, 4 × 90 = 360.</div>
<div class="step">Add the columns: Σf = 5 + 9 + 14 + 8 + 4 = 40 and Σfx = 50 + 270 + 700 + 560 + 360 = 1940.</div>
<div class="step">Mean = Σfx ÷ Σf = 1940 ÷ 40 = 48.5 runs.</div>
</div>

<div class="myth">

**“The mean of the classes is the mean of the data.”** Do not average the class marks 10, 30, 50, 70, 90 (that gives 50). A class with more batters must count for more, which is exactly what multiplying by f does. The weighted answer is 48.5.

</div>

### The assumed-mean method

When the class marks and frequencies are big, `$f \times x$` becomes heavy arithmetic. The trick: **guess** a mean `$a$` (any class mark near the middle) and work with the small differences `$d = x - a$`. The guess is then corrected at the end:

```math
\bar{x} = a + \frac{\sum f d}{\sum f}
```

Why does it work? Each observation is `$a$` plus its deviation `$d$`. So the average of the data is `$a$` plus the average of the deviations. Compare the same 40 batters with a = 50:

<div class="steps" data-fig="c10-stat-assumed">
<div class="step">The same 40 batters, with the same frequencies.</div>
<div class="step">Class marks x again: 10, 30, 50, 70, 90.</div>
<div class="step">Choose an assumed mean a = 50. Any number would work; a middle class mark keeps the numbers small.</div>
<div class="step">Deviations d = x − a: how far each class mark is from 50. They are −40, −20, 0, 20, 40.</div>
<div class="step">Multiply f × d: 5 × (−40) = −200, 9 × (−20) = −180, 0, 8 × 20 = 160, 4 × 40 = 160. The numbers are smaller and the signs partly cancel.</div>
<div class="step">Σf = 40 and Σfd = −200 − 180 + 0 + 160 + 160 = −60.</div>
<div class="step">Mean = a + Σfd ÷ Σf = 50 + (−60) ÷ 40 = 50 − 1.5 = 48.5. The same answer as the direct method.</div>
</div>

### The step-deviation method

If all deviations share a common factor (usually the class width `$h$`), divide it out: `$u = \dfrac{x - a}{h}$`. Now the numbers are tiny whole numbers like −2, −1, 0, 1, 2.

```math
\bar{x} = a + h \times \frac{\sum f u}{\sum f}
```

<div class="steps" data-fig="c10-stat-stepdev">
<div class="step">The same 40 batters.</div>
<div class="step">Class marks x: 10, 30, 50, 70, 90.</div>
<div class="step">Take a = 50 and h = 20, the class width. Every x − a is a multiple of 20.</div>
<div class="step">u = (x − a) ÷ h = −2, −1, 0, 1, 2: tiny whole numbers.</div>
<div class="step">f × u: 5 × (−2) = −10, 9 × (−1) = −9, 0, 8, 8.</div>
<div class="step">Σf = 40 and Σfu = −10 − 9 + 0 + 8 + 8 = −3.</div>
<div class="step">Mean = a + h × Σfu ÷ Σf = 50 + 20 × (−3) ÷ 40 = 50 − 1.5 = 48.5. The same answer yet again.</div>
</div>

<div class="problem" data-problem="c10m-stat-step"></div>

All three methods must give the same mean. Choose different values of `$a$` and `$h$` below and check; the mean never moves, but the size of the numbers you have to handle shrinks sharply:

<figure class="fig" data-fig="c10-stat-same"><figcaption>The dot is the mean, found by all three methods. The bars show how large the products are: direct method f·x is largest, assumed mean f·d is smaller, step deviation f·u is smallest. A good choice of a (near the middle) makes the work easiest.</figcaption></figure>

**Which method when?** Small, neat numbers: direct. Large class marks: assumed mean. Equal class widths and large numbers: step deviation. You are never wrong to use any of them; they are the same formula in different clothes. Try the live tool, which fills in all three tables for any data you type:

<!--fig:tool grouped-data-stats-->

<div class="problem" data-problem="c10m-stat-missing"></div>

**Finding a missing frequency.** Questions often give the mean and hide one frequency `$p$`. Write `$\sum f x$` and `$\sum f$` with `$p$` in them, put their ratio equal to the mean and solve the linear equation. The problem above is just this.

## 3. The mode of grouped data

The **mode** is the value that occurs most often: think of the most popular shirt size in a shop. For a table, the **modal class** is the class with the highest frequency, and the mode lies inside it. The formula:

```math
\text{Mode} = l + \frac{f_1 - f_0}{2f_1 - f_0 - f_2} \times h
```

<div class="meaning">
<dl>
<dt>l</dt><dd>the lower limit of the modal class.</dd>
<dt>h</dt><dd>the class width.</dd>
<dt>f₁</dt><dd>the frequency of the modal class.</dd>
<dt>f₀</dt><dd>the frequency of the class just before the modal class.</dd>
<dt>f₂</dt><dd>the frequency of the class just after it.</dd>
<dt>Physical meaning</dt><dd>the mode leans towards the busier neighbour. If the class before is fuller than the class after, the mode is pulled to the left of the modal class's middle, and if the class after is fuller it is pulled right. If both neighbours are equal it sits exactly in the middle.</dd>
</dl>
</div>

You can see where the formula comes from. Draw the three bars. Join the top-right corner of the earlier bar to the top-right corner of the modal bar, and the top-left corner of the modal bar to the top-left corner of the next bar. The two lines cross, and the foot of the crossing point is the mode. Change the frequencies and watch it slide:

<figure class="fig" data-fig="c10-stat-mode"><figcaption>The mode is read off where the two lines cross. Make f0 bigger than f2 and the mode moves left; make f2 bigger and it moves right. With f0 = f2 it is exactly the middle of the modal class.</figcaption></figure>

<div class="steps" data-fig="c10-stat-modesteps">
<div class="step">The 40 batters' frequencies for 20–40, 40–60 and 60–80 are 9, 14 and 8. The tallest bar is the modal class.</div>
<div class="step">The highest frequency is 14, so the modal class is 40–60.</div>
<div class="step">Read the symbols: l = 40, h = 20, f₁ = 14, f₀ = 9 (class before), f₂ = 8 (class after).</div>
<div class="step">Mode = 40 + 20 × (14 − 9) ÷ (2 × 14 − 9 − 8) = 40 + 20 × 5 ÷ 11 = 40 + 9.09 = 49.09 runs.</div>
</div>

<div class="problem" data-problem="c10m-stat-mode"></div>

<div class="myth">

**“Mode = the class mark of the modal class.”** That would give 50 here. The formula also uses the neighbouring frequencies, so it gives 49.09. Also take care: f₀ is the frequency of the class *before* the modal class, not the smaller of the two neighbours.

</div>

## 4. The median of grouped data

The **median** is the middle observation when the data is lined up in order: half the observations are below it and half above. A cricket team's median score is the score of the middle batter if we sort everyone by runs.

For a table we cannot sort individual values, so we count. Add up the frequencies from the lowest class upward. This running total is the **cumulative frequency** (`$cf$`). The middle observation is number `$n/2$`, and the class where the running total first reaches `$n/2$` is the **median class**. Line the students up and count them in yourself:

<figure class="fig" data-fig="c10-stat-median"><figcaption>Each square is one student, coloured by class and lined up in order of score. Drag “Students counted” until you pass the middle line n/2: the class you are in when you cross it is the median class. Then read the median from the formula in the line below.</figcaption></figure>

Inside the median class we assume the observations are spread evenly, so the median is found by going from the lower limit of the class a fraction of the way across:

```math
\text{Median} = l + \frac{\dfrac{n}{2} - cf}{f} \times h
```

<div class="meaning">
<dl>
<dt>l</dt><dd>the lower limit of the median class.</dd>
<dt>n</dt><dd>the total frequency, Σf.</dd>
<dt>cf</dt><dd>the cumulative frequency of the class just before the median class: how many observations are already counted.</dd>
<dt>f</dt><dd>the frequency of the median class.</dd>
<dt>h</dt><dd>the class width.</dd>
<dt>Physical meaning</dt><dd>(n/2 − cf) is how many more observations we need to count inside the median class to reach the middle one. Dividing by f gives the fraction of the class we cross, and times h turns it into a distance along the number line.</dd>
</dl>
</div>

<div class="steps" data-fig="c10-stat-medsteps">
<div class="step">The 40 batters, with their classes and frequencies.</div>
<div class="step">The total is n = 40, so n ÷ 2 = 20. We need the 20th observation.</div>
<div class="step">Make the cumulative frequency column: 5, then 5 + 9 = 14, then 14 + 14 = 28, then 36, then 40.</div>
<div class="step">The first cumulative frequency that is at least 20 is 28, so the median class is 40–60.</div>
<div class="step">Read the symbols: l = 40, cf (of the class before) = 14, f = 14, h = 20.</div>
<div class="step">Median = 40 + (20 − 14) ÷ 14 × 20 = 40 + 8.57 = 48.57 runs.</div>
</div>

<div class="problem" data-problem="c10m-stat-median"></div>

<div class="myth">

**“cf is the cumulative frequency of the median class.”** It is the one *before* it (here 14, not 28). The median class's own cumulative frequency is only used to find which class is the median class.

</div>

## 5. Mean, median or mode: which one?

Our batters gave a mean of 48.5, a median of 48.57 and a mode of 49.09: all close, because the data is nearly symmetric. When the data is lopsided they separate. The long tail pulls the mean most, the median a little and the mode hardly at all. This gives a handy check, true for moderately skewed data:

```math
\text{Mode} \approx 3\,\text{Median} - 2\,\text{Mean}
```

<div class="myth">

**“The relation always holds.”** It is an **empirical** (found-by-experience) relation, not a theorem. It is a useful check on your arithmetic and an estimate when one of the three is missing; it works best for mildly skewed data and is not exact.

</div>

<figure class="fig" data-fig="c10-stat-empirical"><figcaption>Three shapes of data. Notice how the mean, median and mode spread out when there is a tail, and how 3 × median − 2 × mean lands near the mode.</figcaption></figure>

<div class="problem" data-problem="c10m-stat-empirical"></div>

Which average to use depends on the question:

- **Mean**: when every value should count, such as the average marks of a class or the average rainfall per month.
- **Median**: when a few extreme values would mislead, such as the “average” income of a village or the price of houses.
- **Mode**: when you want the most common choice, such as the shoe size to stock, or the most popular bus timing.

Add one very rich friend to a group of students and see how each average reacts:

<figure class="fig" data-fig="c10-stat-outlier"><figcaption>Nine students' pocket money. Move the last student's amount up: the mean chases it, the median barely moves and the mode does not move at all.</figcaption></figure>

Other tools that go with this chapter: the [Spread explorer](/learn/spread-explorer/) shows how data can differ in spread even when the mean is the same, and the [Probability distribution explorer](/science/distribution-explorer/) draws curves for many kinds of data.

<div class="keypoints">

- Grouped data is sorted into classes; the frequency f counts the observations in each class, and the class mark x = (lower + upper) ÷ 2 stands for the class.
- Direct method: `$\bar{x} = \dfrac{\sum fx}{\sum f}$`. Assumed mean: `$\bar{x} = a + \dfrac{\sum fd}{\sum f}$` with d = x − a. Step deviation: `$\bar{x} = a + h\dfrac{\sum fu}{\sum f}$` with u = (x − a) ÷ h. All three give the same mean.
- Mode = `$l + \dfrac{f_1 - f_0}{2f_1 - f_0 - f_2} \times h$`, where the modal class has the highest frequency and f₀, f₂ are its neighbours.
- Median = `$l + \dfrac{n/2 - cf}{f} \times h$`, where the median class is the first class whose cumulative frequency reaches n/2, and cf is the one before it.
- For moderately skewed data, Mode ≈ 3 Median − 2 Mean (a check, not a rule).
- The mean uses every value but is pulled by extremes; the median is the middle; the mode is the most common.

</div>

Ready for exam-style questions? Go to [Statistics: practice questions](/learn/courses/ncert-class-10-maths/statistics-practice/).
