---
name: Big-O plotter
num: 574
shelf: science
code: T402
section: computer-science
title: "Big-O plotter"
summary: "Draw how each complexity class grows, add your own formulas in n, and see how long each takes at any input size. Paste measured run times (or open a file, or time built-in algorithms in your browser) and a least-squares fit picks the best Big-O class."
status: live
ads: true
order: 574
icon: curve
works: offline
updated: 2026-11-09
related: [algorithm-visualiser, plot-maker, trend-analyser, cache-simulator, curve-fitter, regression-workbench, function-grapher]
sources:
  - "Complexity classes and their growth functions are standard computer science; n! is computed from the log-gamma function so very large n never overflows."
  - "Checked against numpy: for 8 timing sets (synthetic data of every class with noise, plus one hand-made set), every class's a, b, residual sum of squares and R² match np.linalg.lstsq, the best class matches, and the log-log slope matches np.polyfit. 1000! = 4.02 × 10^2567 checked with scipy.special.gammaln."
  - "The example timings are made up for this tool."
flow:
  - { icon: curve, label: "Curves" }
  - { icon: table, label: "Timings" }
  - { icon: target, label: "Best fit" }
---

## What it does

Big-O notation says how the work an algorithm does grows as its input grows. The difference between classes is easy to state and hard to feel: at n = 1,000, an O(n²) method takes a million steps, while an O(2ⁿ) one would take longer than the age of the universe many times over. This tool makes that visible and lets you test your own code against it.

- **Growth curves:** O(1), O(log n), O(n), O(n log n), O(n²), O(n³), O(2ⁿ) and O(n!) on one chart, plus up to four formulas of your own in n (such as n(n − 1)/2 or 3n² + 10n).
- **How long at one size:** the number of steps for each class at any n, written out even when it is astronomically large, and the time it would take at a chosen speed per step.
- **Fit your timings:** paste input sizes and measured times (or open a CSV or Excel file). Each class is fitted by least squares and the best one is picked.
- **Time an algorithm in this browser:** run one of eight small built-in algorithms (a loop, binary search, the built-in sort, merge sort, insertion sort, a pair loop, matrix multiplication, every subset) at several sizes, and the timings go straight into the fit.

Watch the algorithms themselves step by step in the [[algorithm-visualiser]], and see why memory access can matter more than the step count in the [[cache-simulator]].

## How to use it

1. Tick the classes to draw and, if you like, type formulas using n. Set how far n goes. The log scale (on by default) lets very different curves share one chart; untick it to see how quickly the steep ones take off, and use **Cut the y axis at** to stop them filling the chart.
2. Under **How long at one size**, type an n and the time one step takes. The default, 1 ns, is very roughly one simple operation on a modern computer.
3. In **Fit your timings**, paste two columns: n and the time it took. Any time unit works; a header such as "time (ms)" labels the chart.
4. Or choose an algorithm under **Time an algorithm in this browser** and press **Run timings**.
5. Save the fit table or the size table as CSV, or everything as an image, PDF or Word file.

## How the fit works

For each class with growth function g(n), the tool finds the a and b that make time = a + b × g(n) closest to your points by least squares. The constant a soaks up fixed start-up costs. The fit with the smallest residual sum of squares (the leftover after the fit) wins, as long as b is positive: a time that falls as n grows is not that class. Classes whose g(n) is astronomically large at your n (2ⁿ and n! for n above about 500 and 100) are left out. The log-log slope is a second, class-free check: the slope of log time against log n is about 1 for O(n), 2 for O(n²) and 3 for O(n³), and a little above 1 for O(n log n).

## Worked example

The example timings are made up: n = 1,000, 2,000, 4,000, 8,000 and 16,000 took 0.8, 1.7, 3.1, 6.9 and 13.2 ms. The page shows **Best fit: O(n)** with time = −0.01250 + 8.310e-4 × n and R² = 0.9988. The next best, O(n log n), leaves a residual 2.38 times larger, and the log-log slope is 1.01. O(n²) fits clearly worse (R² 0.941).

In the size table at n = 1,000 with 1 ns per step: O(n) is 1,000 steps (1 µs), O(n²) is 1,000,000 steps (1 ms), O(n³) is 1,000,000,000 steps (1 s), O(2ⁿ) is 1.07 × 10^301 steps (3.40 × 10^284 years) and O(n!) is 4.02 × 10^2,567 steps.

## Tips

- Use sizes that double each time, over at least a factor of 10. O(n) and O(n log n) differ by only a slowly growing factor, so a narrow range cannot tell them apart.
- Time each size several times and use the middle value; one slow run can pull a fit off.
- Small n is dominated by fixed costs. The constant a in the fit absorbs some of that, but start from sizes where a run takes at least a millisecond.
- Browser timers are rounded for security, so the timing section repeats each run for at least 40 ms.

## What it does not do

It fits one class at a time, so it cannot tell you that a program is "n² for small n, then n log n". It does not analyse source code. Times measured in a browser depend on the JavaScript engine, the device and what else is running, so treat them as a demonstration, not a benchmark.

## FAQ

**Why does the best fit change when I add one more point?** When two classes fit almost equally well (look at "Next best"), small noise decides between them. More sizes over a wider range settle it.

**Is my data sent anywhere?** No. The fit and the timings run in your browser and the page keeps working offline once it has loaded.
