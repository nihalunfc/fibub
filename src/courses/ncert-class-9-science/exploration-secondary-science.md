---
title: 'Exploration: Entering the World of Secondary Science'
seoTitle: 'Class 9 Science Chapter 1: method, units, graphs'
summary: 'Class 9 Science Chapter 1: the scientific method, SI units, significant figures, errors and uncertainty, and graphs, with live figures and practice.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: 'A length is recorded as 0.0420 m. How many significant figures does it have?'
    choices: ['5', '4', '3', '2']
    ans: 2
    why: 'The zeros before the 4 are only place holders. The digits 4, 2 and the final 0 count, because that last zero comes after a decimal point and was measured. So there are 3 significant figures.'
  - q: 'A student reads a metre rule with her eye to one side of the pointer. This causes:'
    choices: ['a zero error', 'a parallax error', 'a calculation mistake', 'no error at all']
    ans: 1
    why: 'Looking from the side makes the pointer seem to be at a different mark on the scale than it truly is. This is parallax error, a human reading error, and it is cured by looking straight down on the mark.'
  - q: 'On a graph of stretch against load for a spring, the slope of the best-fit line tells you:'
    choices: ['the stretch for each newton of load', 'the largest load the spring can take', 'the length of the spring', 'the mass of the spring']
    ans: 0
    why: 'Slope = rise ÷ run = change in stretch ÷ change in load, so it is the stretch produced by each newton. Its unit is cm per N.'
sources:
  - 'NCERT Class 9 Science (Exploration), Chapter 1 “Exploration: Entering the World of Secondary Science” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Bureau International des Poids et Mesures (BIPM), The International System of Units (SI Brochure), 9th edition, 2019 (base units, prefixes, the 2019 redefinition)'
  - 'JCGM 100:2008, Evaluation of measurement data: Guide to the expression of uncertainty in measurement (ideas of random and systematic error)'
---

**Science · Class 9 · Chapter 1 · about 40 minutes.** By the end you will be able to describe how scientists ask and test questions, use SI units and prefixes, write measurements with the right significant figures, explain and reduce measurement errors, and draw and read a straight-line graph.

<div class="bigidea">Science is a way of finding out that you can check. You ask a question, make a guess that could be proved wrong, test it fairly with careful measurements, look at the pattern in the numbers (a graph is the best way), and trust only what repeats. Every later chapter of science is this method at work.</div>

## 1. How scientists find things out

Why does a ceiling fan keep spinning for a few seconds after you switch it off? Why does a cricket ball swing? You can argue about it for hours, or you can **test** it. The steps scientists follow are called the **scientific method**. It is not a strict recipe, it is a loop.

1. **Observe.** Notice something and write down exactly what you saw.
2. **Ask a question** that can be answered by measuring.
3. **Make a hypothesis**: a clear guess that a test could prove wrong. "A longer pendulum swings slower" is a hypothesis. "Pendulums are interesting" is not.
4. **Test it fairly.** Change one thing only (the **independent variable**), measure what happens (the **dependent variable**) and keep everything else the same (the **controlled variables**).
5. **Analyse** the numbers, usually with a table and a graph.
6. **Conclude**, share the result, and let others repeat it. A good answer almost always leads to a new question.

<div class="steps" data-fig="c9-sci-method">
<div class="step">Observe: you sit on a swing at the park and notice that long-chain swings feel slower than short-chain ones.</div>
<div class="step">Ask a question that numbers can answer: does the length of a pendulum change the time for one swing?</div>
<div class="step">Hypothesis: a longer string gives a longer time. It is useful because a test can show it to be wrong.</div>
<div class="step">Test fairly: only the length changes (25, 50, 100 cm). The bob, the starting angle and the stopwatch stay the same.</div>
<div class="step">Analyse: time 20 swings for each length (this cuts the timing error), divide by 20, and plot time against length.</div>
<div class="step">Conclude: a longer string does give a longer time, but 4 times the length gives only 2 times the time. That fact asks a new question, and the loop goes round again.</div>
</div>

<div class="myth">

**“A hypothesis is a fact that just needs checking.”** A hypothesis is only a guess until the evidence supports it. A hypothesis that cannot be tested is not scientific. And a good scientist is happy when a test proves a guess wrong, because that is also learning.

</div>

**Fair test.** Imagine Meera says that fertiliser A grows taller plants than B. If she gives A to plants in the sun and B to plants in the shade, the test is not fair: sunlight is also changing. Only the fertiliser may differ. Whenever a test seems to give a surprising answer, first check what else changed.

**Theory and law.** A **law** describes a pattern (for example, Newton's laws describe how things move). A **theory** explains why it happens. Both can change when better evidence arrives, which is why science keeps growing.

## 2. Measuring: SI units

A measurement is a number **and** a unit. "The room is 5" tells you nothing; "the room is 5 m long" does. Early traders used hand spans and strides, but your hand is not the same as mine. The world now agrees on one system: the **Système International d'Unités (SI)**, used in every science exam and every laboratory. India moved to metric units by law in the late 1950s.

There are seven **base units**. In school science we use five most:

| Quantity | SI unit | Symbol |
|---|---|---|
| length | metre | m |
| mass | kilogram | kg |
| time | second | s |
| electric current | ampere | A |
| temperature | kelvin | K |

(The other two are the mole, for amount of substance, and the candela, for brightness of light.) Every other unit is made from these. A speed is metres **per** second, m/s. A force of 1 newton is 1 kg m/s². These are called **derived units**.

**Prefixes.** Instead of writing 0.000 001 m, we change the unit by a power of ten:

| Prefix | Symbol | Meaning | Example |
|---|---|---|---|
| giga | G | 10⁹ | 1 GB of data |
| mega | M | 10⁶ | 1 MW power station |
| kilo | k | 10³ | 1 km, 1 kg |
| centi | c | 10⁻² | 1 cm |
| milli | m | 10⁻³ | 1 mm, 1 mL |
| micro | µ | 10⁻⁶ | 1 µm, a bacterium |
| nano | n | 10⁻⁹ | 1 nm, a DNA strand width is about 2 nm |

Move the slider to see where everyday things sit on a scale of powers of ten:

<figure class="fig" data-fig="c9-sci-scale"><figcaption>One tick is ten times longer than the one before it. Drag from an atom (about 10⁻¹⁰ m) to a long train journey (10⁷ m). On a normal ruler an atom would be far too small to draw, which is why scientists use powers of ten.</figcaption></figure>

**Changing units.** Multiply by the conversion factor, written as a fraction equal to 1, so that the unwanted unit cancels. For a speed of 72 km/h:

```math
72\ \frac{\text{km}}{\text{h}} \times \frac{1000\ \text{m}}{1\ \text{km}} \times \frac{1\ \text{h}}{3600\ \text{s}} = 20\ \frac{\text{m}}{\text{s}}
```

A quick rule: to change km/h to m/s, divide by 3.6.

<div class="meaning">
<dl>
<dt>Base unit</dt><dd>one of the seven fixed units from which all others are built (m, kg, s, A, K, mol, cd)</dd>
<dt>Derived unit</dt><dd>a combination of base units, for example m/s for speed</dd>
<dt>Prefix</dt><dd>a power of ten written in front of a unit, which saves writing many zeros</dd>
<dt>Physical meaning</dt><dd>Using the same units everywhere means a scientist in Chennai and one in Chicago can check each other's results without any conversion mistakes.</dd>
</dl>
</div>

<div class="problem" data-problem="c9s-sci-convert"></div>

Practise the prefixes until they feel natural:

<!--fig:tool si-unit-converter-->

**Check your units.** If you work out a speed and the unit comes out as m·s, something is wrong. The tool [Dimensional analysis checker](/science/dimensional-analysis/) tests whether an equation has the right units on both sides.

<div class="history">

<ul class="timeline">
<li><b>1791</b> The French Academy defines the metre as one ten-millionth of the distance from the North Pole to the equator.</li>
<li><b>1875</b> Seventeen countries sign the Metre Convention. India joins in 1957.</li>
<li><b>1956</b> India passes a law to move to metric weights and measures, phased in over the following years.</li>
<li><b>1960</b> The International System of Units (SI) is given its name.</li>
<li><b>2019</b> All base units are tied to fixed constants of nature (the kilogram stops being a metal cylinder in Paris and is defined using Planck's constant).</li>
</ul>

</div>

## 3. Reading a scale: least count and parallax

Every instrument has a **least count**: the smallest value it can show. A normal school ruler has divisions of 1 mm, so its least count is 1 mm (0.1 cm). You can estimate between marks by eye, but you cannot honestly claim to know more than the nearest half division.

Two reading mistakes are very common.

**Parallax error.** If the pointer is a little above the scale and you look from the side, the pointer seems to be against a different mark. Put your eye straight above the mark and the error disappears. A thin ruler, with the object touching the scale, also reduces it.

<figure class="fig" data-fig="c9-sci-parallax"><figcaption>Move the eye. Straight above (0°) you read the true 5.00 cm. From the side the line of sight reaches the scale at a different place, by gap × tan(angle). Switch to the thin, touching ruler and the same angle gives a much smaller error.</figcaption></figure>

**Zero error.** An instrument that does not read zero when it should (a worn ruler end, a stopwatch started late, a balance that shows 2 g with nothing on it) adds the same error to every reading. You find it first and **subtract** it from every reading.

**Extension: the vernier caliper.** To measure more finely than a ruler, a **vernier caliper** puts a small sliding scale next to the main scale. Ten vernier divisions are made to fit exactly into 9 mm, so each is 0.9 mm. Then the least count is 1 mm − 0.9 mm = 0.1 mm. You read the main scale just before the vernier zero, then find the **one** vernier line that lines up with a main-scale line. (Using the vernier is an extension to this chapter; the idea of least count is the part to learn.)

<figure class="fig" data-fig="c9-sci-vernier"><figcaption>Slide the jaws. The vernier zero sits just past a whole millimetre; the number of the vernier line that matches a main line (shown in green) is the number of tenths of a millimetre. Reading = main + n × 0.1 mm.</figcaption></figure>

<div class="problem" data-problem="c9s-sci-vernier"></div>

<div class="myth">

**“More digits on the screen means a more accurate measurement.”** A digital kitchen scale that shows 125.384 g is not necessarily accurate to 0.001 g. The digits only show what the display can print. The real accuracy depends on the instrument and how it was used.

</div>

## 4. Significant figures

When you measure the length of a pencil with a ruler marked in millimetres and get 15.3 cm, the "3" is a guess between two marks, but it still means something. The digits you can trust, plus the first uncertain one, are the **significant figures**. They show how carefully something was measured. Writing 15.3 cm tells people you measured to the nearest millimetre; writing 15.300 cm claims you measured to a hundredth of a millimetre.

**Rules for counting:**

1. All **non-zero** digits count. (4.52 has 3.)
2. Zeros **between** non-zero digits count. (4005 has 4.)
3. **Leading** zeros never count; they only show where the point is. (0.0045 has 2.)
4. **Trailing** zeros count only if there is a **decimal point**. (3.200 has 4; 1200 has 2; 1200. has 4.)

To remove doubt about trailing zeros, scientists write numbers in **standard form**: 1.2 × 10³ has 2 significant figures, and 1.200 × 10³ has 4.

Play the game below with several numbers before you move on. The colours show which digits count:

<figure class="fig" data-fig="c9-sci-sigfig"><figcaption>Tap the digits you think are significant, then press Check. Green digits count. Try 0.00450, 1200 and 1200. (with the point) and see why the point matters.</figcaption></figure>

<div class="problem" data-problem="c9s-sci-sigfig"></div>

**Calculating with them.**

- **Adding or subtracting:** keep as many **decimal places** as the least precise number. 12.1 + 0.256 = 12.356, which you report as 12.4.
- **Multiplying or dividing:** keep as many **significant figures** as the number that has the fewest. 2.5 m × 3.14 m = 7.85 m², reported as 7.9 m² (2.5 has 2 significant figures).
- **Round only at the end.** Keep an extra digit during the working and round the final answer.

**Rounding:** look at the first digit to be dropped. If it is 5 or more, round up; if it is 4 or less, leave the last kept digit alone.

Check any number or sum in this tool:

<!--fig:tool sig-fig-checker-->

## 5. Errors and uncertainty

No measurement is exactly right. The difference between what you measured and the true value is the **error**. There are two kinds.

- **Random errors** change from reading to reading, sometimes too high, sometimes too low: a slow reaction when you press the stopwatch, a draught moving a balance. **Repeating** the measurement and taking the **mean** (average) reduces their effect.
- **Systematic errors** push every reading the same way: a zero error, a clock that runs fast, a ruler that has shrunk. Repeating does **not** remove them. You must find and correct the cause.

Two words people mix up:

- **Accuracy**: how close a result is to the true value.
- **Precision**: how close repeated readings are to each other.

Think of an archer's arrows. Arrows clustered tightly together but far from the bullseye are precise but not accurate (a systematic error, like a bent sight). Arrows scattered around the bullseye are accurate on average but not precise (random error).

Take timing readings below and watch what the mean does. Then switch on the zero error and watch what averaging cannot fix:

<figure class="fig" data-fig="c9-sci-uncert"><figcaption>Each dot is one stopwatch reading of a pendulum whose true period is 2.00 s. With random errors only, the mean closes in on the true value as you take more readings. With a zero error, the dots are centred on the wrong place however many you take.</figcaption></figure>

**Writing the result.** Report the mean together with its uncertainty, which for a few readings is half the range:

```math
\text{result} = \bar{x} \pm \frac{x_{\max} - x_{\min}}{2}
```

If the readings are 2.04, 1.97, 2.06, 1.95 and 2.02 s, the mean is 2.01 s and half the range is (2.06 − 1.95)/2 ≈ 0.06 s, so T = 2.01 ± 0.06 s.

The **percentage error** compares the error with the true (accepted) value:

```math
\text{percentage error} = \frac{|\text{measured} - \text{true}|}{\text{true}} \times 100\,\%
```

<div class="problem" data-problem="c9s-sci-mean"></div>

**A trick for tiny times.** To time one swing of a pendulum, your reaction time of about 0.2 s is a big part of 2 s. Time **20 swings** instead: the same 0.2 s is now only 0.5 % of 40 s, and you divide by 20 at the end. Measuring many and dividing is a way of making the error smaller.

When a result is made by combining measurements (an area from two lengths, say), the uncertainties combine too. You will learn the rules in higher classes; this tool does it for you:

<!--fig:tool uncertainty-calculator-->

## 6. Drawing and reading graphs

A table of numbers hides the pattern; a graph shows it at a glance. Follow these steps for a good graph.

1. **Choose the axes.** The variable you change (independent) goes on the **x-axis**, the one you measure goes on the **y-axis**.
2. **Label** each axis with the quantity **and its unit**, for example "load (N)".
3. **Choose a scale** that uses most of the page, with a simple number of units per square (1, 2, 5 or 10, never 3 or 7).
4. **Plot** each point with a neat small cross or dot.
5. **Draw the best-fit line**: a single smooth straight line (or curve) that passes as near as possible to all points, with about as many points above as below. **Do not join the dots** zig-zag; the scatter is only measurement error.
6. **Give the graph a title** that says what it shows.

For a straight line, **the slope** (gradient) carries the physics:

```math
\text{slope} = \frac{\text{rise}}{\text{run}} = \frac{y_2 - y_1}{x_2 - x_1}
```

Choose two points **on the line** (not two of your data points) that are far apart, so that the reading errors matter less.

<figure class="fig" data-fig="c9-sci-graph"><figcaption>Eight readings of a spring's stretch. Move the slope and start sliders to place your own line and watch the total of the squared gaps. Press Best fit to see the smallest possible. Switch to Join the dots to see why a zig-zag is not a good description.</figcaption></figure>

<div class="problem" data-problem="c9s-sci-slope"></div>

**What the shape tells you:**

| Graph shape | What it means | Example |
|---|---|---|
| Straight line through the origin | y is **proportional** to x (double x, double y) | distance and time at steady speed |
| Straight line not through the origin | y changes steadily but starts from a non-zero value | cost of a taxi with a fixed charge plus a rate per km |
| Curve bending up | y grows faster and faster | distance fallen under gravity against time |
| Horizontal line | y does not depend on x | speed of a car held at a steady speed |

**Extrapolation and interpolation.** Reading a value between your points (interpolating) is usually safe. Extending the line beyond your data (extrapolating) is a guess: a spring stretches in proportion to the load only up to its limit, and then stops obeying the line.

<div class="keypoints">

- The scientific method is a loop: observe, ask, hypothesise, test fairly (change one variable), analyse, conclude and repeat.
- A hypothesis must be testable; in a fair test only one variable changes.
- Every measurement is a number and a unit. SI base units: metre, kilogram, second, ampere, kelvin, mole, candela. Prefixes are powers of ten (kilo 10³, milli 10⁻³, micro 10⁻⁶).
- Change units by multiplying by a factor equal to 1; km/h ÷ 3.6 = m/s.
- Significant figures: non-zero digits and zeros between them count; leading zeros do not; trailing zeros count only after a decimal point.
- Add or subtract by decimal places; multiply or divide by significant figures; round at the end.
- Random errors are reduced by repeating and averaging; systematic errors (zero error, parallax) must be found and corrected. Accuracy is closeness to the true value, precision is closeness of repeated readings.
- Result = mean ± half the range. Percentage error = |measured − true| ÷ true × 100.
- Graph: independent variable on x, labelled axes with units, sensible scale, best-fit line (do not join the dots). Slope = rise ÷ run.

</div>
