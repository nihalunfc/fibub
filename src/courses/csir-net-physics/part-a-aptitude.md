---
title: 'Part A: numerical, graphical and logical reasoning'
seoTitle: CSIR NET Part A aptitude, methods and practice
summary: 'The methods behind CSIR NET Part A: number series, percentages and ratios, averages and rates, data described in tables and charts, simple geometry, logical puzzles, graph reading and estimation, each with a worked example, the usual traps, and a bank of original practice questions.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: 'A price rises by 25% and then falls by 20%. The final price is'
    choices: ['the same as the original', '5% higher', '5% lower', '1% lower']
    ans: 0
    why: '1.25 × 0.80 = 1.00. Percentage changes multiply; they do not add.'
  - q: 'A train covers equal distances at 40 km/h and 60 km/h. Its average speed is'
    choices: ['48 km/h', '50 km/h', '52 km/h', '45 km/h']
    ans: 0
    why: 'For equal distances the average speed is the harmonic mean 2uv/(u + v) = 4800/100 = 48 km/h. More time is spent at the slower speed.'
  - q: 'On a log–log plot a straight line falls by 3 decades of y while x rises by 1 decade. The relation is'
    choices: ['y ∝ x⁻³', 'y ∝ x³', 'y ∝ e⁻³ˣ', 'y ∝ x^(−1/3)']
    ans: 0
    why: 'A straight line on log–log axes is a power law y ∝ xⁿ with n equal to the slope, here −3/1.'
sources:
  - 'CSIR-UGC NET scheme of examination: Part A (general aptitude) common to all science subjects, CSIR HRDG / National Testing Agency, checked 2026-11-22'
  - 'G. Pólya, How to Solve It, 2nd ed. (Princeton, 1957)'
  - 'S. Mahajan, Street-Fighting Mathematics (MIT Press, 2010; free under CC BY-NC-SA)'
  - 'L. Weinstein and J. A. Adam, Guesstimation (Princeton, 2008), on order-of-magnitude estimates'
---

**Module 1 · about 40 minutes.** By the end you will have a short method for each kind of Part A question, know the traps that catch most candidates, and be able to answer 15 questions in about 25 minutes. Part A is worth 30 marks: you answer 15 of the 20 questions shown, 2 marks each, with 0.5 lost for a wrong answer (see [lesson 1.1](/learn/courses/csir-net-physics/net-exam-pattern/)).

<div class="bigidea">Part A tests clear thinking with numbers, not physics. Turn every percentage into a multiplier, every rate into "amount per unit time", every chart into a few numbers you write down, and every puzzle into a small table. Then most questions take under two minutes.</div>

## 1. Number and letter series

Work through these checks in order. Most series give way by the second or third.

1. **Differences.** Write the gaps between terms. If they are constant, the series is linear; if the gaps themselves grow steadily (second differences constant), it is quadratic.
2. **Ratios.** If the terms grow fast, divide: constant ratio means geometric; ratios 2, 3, 4, ... mean factorials.
3. **"Times k plus c".** Terms like 3, 7, 15, 31 follow `$t_{n+1} = 2t_n + 1$`.
4. **Known families.** Squares, cubes, primes, `$n^2 \pm 1$`, `$n^3 - n$`, `$n^n$`, Fibonacci-type sums.
5. **Two interleaved series.** If the gaps jump up and down, split odd and even positions.
6. **Letters.** Convert to positions (A = 1, ..., Z = 26) and use the same checks.

**Worked example.** 5, 6, 14, 41, 105, ? Differences: 1, 8, 27, 64. These are `$1^3, 2^3, 3^3, 4^3$`, so the next difference is `$5^3 = 125$` and the next term is `$105 + 125 = 230$`.

## 2. Percentages, ratios and averages

**Percentages as multipliers.** A rise of `$x\%$` multiplies by `$1 + x/100$`; a fall multiplies by `$1 - x/100$`. Successive changes multiply:

```math
(1 + a)(1 + b) = 1 + a + b + ab
```

so `$+a\%$` then `$+b\%$` is a total change of `$a + b + ab/100$` percent.

- **The base changes.** If `$A$` is 25% more than `$B$`, then `$B$` is `$25/125 = 20\%$` less than `$A$`. In general `$\frac{x}{100 + x}\times100\%$`.
- **Percentage versus percentage points.** A pass rate falling from 15% to 12% is a fall of 3 percentage points, which is a 20% fall in the rate.
- **Ratios.** To join `$A:B$` and `$B:C$`, scale both so `$B$` is the same number. For mixtures, keep the part that does not change fixed (adding water does not change the milk).
- **Weighted average.** Two groups of sizes `$n_1, n_2$` with averages `$a_1, a_2$` average to `$\frac{n_1a_1 + n_2a_2}{n_1 + n_2}$`, which lies closer to the bigger group.
- **Correcting an average.** Fix the sum, then divide again. Average 20 over 10 numbers is a sum of 200; replace the wrong value with the right one.

<div class="problem" data-problem="apt-chain-percent"></div>

**Worked example.** Sales of 80 units grow 25% one year and fall 25% the next. Final: `$80\times1.25\times0.75 = 75$`, a net fall of 6.25%, not zero.

## 3. Rates: speed, work and pipes

Rates add; times do not.

- **Work.** A job done in `$a$` days is a rate of `$1/a$` job per day. Together: `$\frac1a + \frac1b$`, so the time is `$\frac{ab}{a + b}$`.
- **Pipes and leaks.** Filling rates are positive, emptying rates negative; add them.
- **Average speed** is total distance over total time. For two equal distances at `$u$` and `$v$` it is the harmonic mean `$\frac{2uv}{u + v}$`, always less than `$\frac{u + v}{2}$`.
- **Relative speed.** Two objects moving towards each other close at `$u + v$`; in the same direction at `$|u - v|$`.
- **Clocks.** The minute hand turns `$6°$` per minute, the hour hand `$0.5°$` per minute. The angle at `$h{:}m$` is `$|30h - 5.5m|$` (take `$360°$` minus it if over `$180°$`). The hands meet 11 times every 12 hours.

**Worked example.** Pipe P fills a tank in 3 h and pipe Q in 6 h, and a leak empties it in 4 h. Net rate `$= \frac13 + \frac16 - \frac14 = \frac{4 + 2 - 3}{12} = \frac14$` tank per hour: 4 hours.

<div class="problem" data-problem="apt-pipes"></div>

<div class="meaning">

<dl>
<dt>Multiplier</dt><dd>1 + x/100 for a rise of x%, 1 − x/100 for a fall; chains of changes multiply</dd>
<dt>Rate</dt><dd>amount per unit time (jobs per day, tanks per hour, km per hour); rates add, times do not</dd>
<dt>Harmonic mean</dt><dd>2uv/(u + v), the average speed over two equal distances</dd>
<dt>Power law on log–log axes</dt><dd>a straight line whose slope is the exponent</dd>
<dt>Physical meaning</dt><dd>Most Part A traps come from adding things that should be multiplied (percentages) or averaging things that should be added (rates).</dd>
</dl>

</div>

## 4. Data described in tables and charts

Part A gives tables, bar charts, pie charts or line graphs, then asks for a share, a change or a comparison.

1. **Write down the few numbers you need** before computing. Note the units (thousands, tonnes, per cent).
2. **"Percentage change" always divides by the starting value.** From 150 to 90 is `$60/150 = 40\%$` down.
3. **Pie charts:** a share of `$s\%$` is a sector of `$3.6s$` degrees.
4. **Numbers versus rates.** A falling percentage of a growing total can leave the number unchanged or even higher. Compute both before choosing.
5. **Approximate when options are far apart.** If the options are 18%, 25%, 33% and 40%, one significant figure is enough.

**Worked example.** A lab spent 2.4 lakh rupees on equipment, 1.2 lakh on chemicals and 0.4 lakh on travel. On a pie chart, chemicals take `$1.2/4.0 = 30\%$` of the budget, a sector of `$108°$`.

**Sets.** For two overlapping groups, `$n(A \cup B) = n(A) + n(B) - n(A \cap B)$`; those in neither are the total minus that. Draw two circles and fill in the overlap first.

## 5. Simple geometry and mensuration

- **Pythagorean triples** save time: 3-4-5, 5-12-13, 8-15-17, 7-24-25, and their multiples.
- **Scaling.** Multiply every length by `$k$`: areas go up by `$k^2$`, volumes by `$k^3$`. The midpoint triangle has a quarter of the area.
- **Polygons.** Interior angles add to `$(n - 2)\times180°$`; a regular `$n$`-gon has `$n(n - 3)/2$` diagonals. A regular hexagon is six equilateral triangles.
- **Circles and solids.** Circle `$\pi r^2$`, sphere `$\frac43\pi r^3$` and `$4\pi r^2$`, cylinder `$\pi r^2h$`. A sphere in its snug cylinder has 2/3 of the cylinder's volume.
- **Coordinates.** Distance `$\sqrt{\Delta x^2 + \Delta y^2}$`; area of a triangle from vertices `$\tfrac12|x_1(y_2 - y_3) + x_2(y_3 - y_1) + x_3(y_1 - y_2)|$`.

**Worked example.** A 10 m ladder reaches 8 m up a wall, so its foot is 6 m out (a 6-8-10 triangle). If the top slides down 2 m to 6 m, the foot moves out to 8 m: 2 m further.

## 6. Logical reasoning

- **Seating and ordering.** Draw the seats and place the fixed facts first ("P is at the left end", "R is in the middle"), then the "next to" facts, and the "not next to" facts last.
- **Truth-tellers and liars.** Assume the strongest statement is true and look for a contradiction; if it fails, it is false. Two cases are usually enough.
- **Syllogisms** ("All A are B. Some B are C."). Draw circles and try to break each conclusion. Only a conclusion that survives every drawing follows. Your own knowledge of the real world does not count.
- **Calendars.** Only remainders after whole weeks matter: an ordinary year moves the day by 1, a leap year by 2. Month lengths: 31, 28 or 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31.
- **Counting.** Pairs: `$\binom n2 = n(n - 1)/2$`. Things that must stay together: glue them into one block, count, then multiply by the orders inside the block.
- **Balance puzzles.** Each weighing has three outcomes, so `$w$` weighings can find one odd (known heavier) coin among `$3^w$`.
- **Conditional probability.** Restrict to the outcomes that satisfy the condition, then count.

**Worked example.** Four friends rank first to fourth in a race. A is not first. B is just ahead of C. D is last. Then the order of A, B, C fills places 1 to 3 with B directly before C and A not first: the only arrangement is B, C, A, D.

## 7. Graph reading

- **Slope** of a position–time graph is velocity; of a velocity–time graph, acceleration. **Area** under a velocity–time graph is distance; under a force–displacement graph, work.
- **Semi-log plot** (`$\ln y$` against `$x$`) straight: exponential, `$y = Ae^{bx}$` with `$b$` the slope. A half-life is `$\ln 2/|b|$`.
- **Log–log plot** straight: power law `$y = Ax^n$` with `$n$` the slope in decades per decade.
- **Shapes.** Zeros of a curve are its x-intercepts; a single hump between two zeros is a downward parabola like `$x(a - x)$`.
- **Two straight lines** crossing: set the expressions equal.

**Worked example.** On a semi-log plot `$\ln A$` falls from 6.0 to 4.6 in 2 hours. Slope `$-0.7$` per hour, so the half-life is `$0.693/0.7 \approx 1$` hour.

## 8. Estimation and approximation

- Work in **powers of ten** and keep one or two significant figures.
- Handy facts: a year `$\approx \pi\times10^7$` s; `$2^{10} \approx 10^3$`; `$e \approx 2.7$`; `$(1 + x)^n \approx 1 + nx$` only when `$nx \ll 1$`, and `$(1 + 1/n)^n \approx e$`.
- **Doubling** grows fast: 30 doublings is `$\approx 10^9$`.
- For a "roughly how many" question, choose the option within a factor of 3 of your estimate; options usually differ by factors of 10 or more.

**Worked example.** Roughly how many litres of air do you breathe in a day? About 0.5 L a breath, 15 breaths a minute: `$0.5\times15\times60\times24 \approx 1.1\times10^4$` litres, of order `$10^4$`.

<div class="myth">

**"Part A needs a separate coaching course."** It needs the eight methods above and practice under time. The arithmetic is school level; what costs marks is reading too fast, adding percentages, or averaging speeds.

**"Answer all 20 to be safe."** Only 15 answers count, and only the first 15 (in question order). Pick the 15 you are surest of.

</div>

<div class="keypoints">

- Series: differences, ratios, `$kt + c$`, known families, interleaving, letters as numbers.
- Percentages multiply; the base changes; points are not per cent.
- Rates add, times do not; average speed over equal distances is `$2uv/(u + v)$`.
- Data: write the needed numbers first; percentage change divides by the starting value; compare numbers as well as rates.
- Geometry: triples, scaling `$k^2$` and `$k^3$`, polygon formulas.
- Logic: draw a table or circles; test the strongest claim; only what follows in every case is a conclusion.
- Graphs: slope and area; straight semi-log means exponential, straight log–log means power law.
- Estimation in powers of ten. Answer exactly 15, about 25 minutes in all.

</div>

## Practise: Part A questions

Original Part A style questions, warm-up to hard, with full solutions. Time yourself: about 90 seconds each.

<div class="qbank" data-bank="physics" data-topics="part-a-aptitude" data-exam="net" data-n="15"></div>

**Next:** start the core with the [mathematical methods roadmap](/learn/courses/csir-net-physics/maths-roadmap/).
