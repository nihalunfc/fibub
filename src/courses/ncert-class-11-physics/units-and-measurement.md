---
title: Units and Measurement
seoTitle: 'Units and Measurement Class 11 notes, SI, errors, dimensions'
summary: 'Class 11 Physics Units and Measurement with animations: SI units, vernier and screw gauge, errors, significant figures and dimensional analysis.'
minutes: 80
updated: 2026-11-23
quiz:
  - q: 'A vernier caliper has 20 vernier divisions equal to 19 main-scale divisions of 1 mm each. Its least count is:'
    choices: ['0.1 mm', '0.05 mm', '0.01 mm', '0.5 mm']
    ans: 1
    why: 'Least count = 1 main division − 1 vernier division = 1 − 19/20 = 1/20 = 0.05 mm.'
  - q: 'The edge of a cube is measured with a 1 % error. The percentage error in its volume is:'
    choices: ['1 %', '2 %', '3 %', '6 %']
    ans: 2
    why: 'V = a³, so ΔV/V = 3 Δa/a = 3 × 1 % = 3 %.'
  - q: 'Which equation is dimensionally impossible? (s is distance, u and v are speeds, a is acceleration, t is time)'
    choices: ['s = ut + ½at²', 'v = u + at', 'v² = u² + 2as', 'v = u + at²']
    ans: 3
    why: 'In v = u + at² the term at² has dimension L, while v and u are L T⁻¹. Terms that are added must have the same dimensions.'
sources:
  - 'NCERT Class 11 Physics, Chapter 1 “Units and Measurement” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Bureau International des Poids et Mesures, The International System of Units (SI Brochure), 9th edition, 2019 (base units, prefixes and the 2019 redefinition)'
  - 'JCGM 100:2008, Evaluation of measurement data: Guide to the expression of uncertainty in measurement (error and uncertainty vocabulary)'
  - 'Sizes in the powers-of-ten ruler: Particle Data Group (proton radius, about 0.84 fm); NASA Earth fact sheet (radius 6371 km); IAU 2012 resolution (astronomical unit 149 597 870 700 m)'
---

**Physics · Class 11 · Chapter 1 · about 80 minutes.** By the end you will be able to name the SI units and prefixes, read a vernier caliper and a screw gauge, find the errors in a result, round answers to the right number of significant figures, and use dimensions to check an equation, convert units and work out how one quantity depends on others.

<div class="bigidea">Physics begins by turning “how much?” into a number with a unit. A number alone means nothing (“the room is 5 wide”), and a number with no sense of its error is dangerous (“the bridge takes 5 tonnes, give or take what?”). This chapter gives you the three habits of every careful scientist: say the unit, say how sure you are, and check that the equation makes sense before you trust it.</div>

## 1. Why we measure, and the SI system

To measure is to compare with an agreed standard, called a **unit**. Two things are always written together: a **number** and a **unit**. “The auto fare is 150” is incomplete; 150 rupees makes sense.

Every country once had its own units (the guz, the seer, the maund, the cubit). Trade and science suffered, so in 1960 the world agreed on one system, the **International System (SI)**. Every quantity in physics can be built from a few **base quantities**; each has its own **base unit**.

| Base quantity | SI unit | Symbol |
|---|---|---|
| length | metre | m |
| mass | kilogram | kg |
| time | second | s |
| electric current | ampere | A |
| temperature | kelvin | K |
| amount of substance | mole | mol |
| luminous intensity | candela | cd |

Every other quantity is **derived**: speed is length ÷ time, so its unit is m/s; force is mass × acceleration, so the newton is kg m s⁻²; energy is force × distance, so the joule is kg m² s⁻². Some derived units have their own names (newton, joule, watt, pascal, hertz) to save writing.

Since 2019 all seven base units are defined by fixing the exact value of a constant of nature. For example, the second is fixed by the frequency of a caesium atom clock, and the metre by the speed of light, `$c = 299\,792\,458$` m/s exactly. The kilogram is fixed by Planck’s constant `$h$`. The advantage: a standard can be rebuilt in any lab, with no metal block to guard.

<div class="meaning">

<dl>
<dt>Base quantity</dt><dd>one chosen as the starting point; it is not defined through others</dd>
<dt>Derived quantity</dt><dd>built from base quantities by a formula (speed, force, pressure)</dd>
<dt>Physical meaning</dt><dd>A unit system is like a recipe book: seven basic ingredients, and every other quantity is a recipe using them.</dd>
</dl>

</div>

### Prefixes: from the tiny to the huge

Instead of writing zeros we attach a **prefix**: kilo (10³), mega (10⁶), giga (10⁹), tera (10¹²) and milli (10⁻³), micro (10⁻⁶), nano (10⁻⁹), pico (10⁻¹²), femto (10⁻¹⁵). A 5G tower may offer 1 Gbps; the wire in an earphone is 0.3 mm thick; a virus is about 100 nm. Slide the marker below from a proton to the whole universe and watch the prefixes change.

<figure class="fig" data-fig="c11p-units-scale"><figcaption>The powers-of-ten ruler. Each step is a factor of ten. Everything we can measure, from a proton (10⁻¹⁵ m) to the observable universe (10²⁶ m), spans about 41 steps.</figcaption></figure>

<div class="problem" data-problem="c11p-units-convert"></div>

Some units outside the SI are still used with it: the litre, the tonne, the astronomical unit (the Earth–Sun distance, 1.5 × 10¹¹ m) and the light-year (9.46 × 10¹⁵ m, a **distance**). Convert any of them here: [Unit converter](/learn/si-unit-converter/), and look up constants in [Physical constants](/science/physical-constants/).

## 2. Measuring length, mass and time

**Length.** A metre rule reads to 1 mm; to measure a pencil’s thickness we need something finer. Two instruments are in every Class 11 laboratory.

- **Vernier caliper.** A sliding second scale (the vernier) has 10 divisions that fit exactly into 9 mm of the main scale. Each vernier division is therefore 0.9 mm, 0.1 mm shorter than a main division. The smallest length the instrument can read is its **least count**, here 0.1 mm.
- **Screw gauge.** A screw of pitch 0.5 mm (it advances 0.5 mm per full turn) has a thimble with 50 divisions, so the least count is 0.5 ÷ 50 = 0.01 mm.

```math
\text{least count (vernier)} = 1\ \text{main division} - 1\ \text{vernier division}, \qquad \text{least count (screw gauge)} = \frac{\text{pitch}}{\text{number of divisions}}
```

Reading = main scale reading + (coinciding division) × least count. Try it yourself in the figure: set an opening, read it, and only then press Check.

<figure class="fig" data-fig="c11p-units-gauge"><figcaption>Slide the jaws of a vernier caliper or screw gauge. Find the main-scale mark, then the vernier or thimble line that lines up, and add. Press “Check my reading” to see the working.</figcaption></figure>

<div class="problem" data-problem="c11p-units-vernier"></div>

**Zero error.** If the jaws read 0.04 mm when closed, every reading is 0.04 mm too big, so subtract it (a negative zero error is added). Hold your eye straight above a scale: looking from the side causes **parallax**, a false reading, which you can explore in [Parallax reading](/learn/parallax-reading/).

**Mass.** A common balance compares masses; atomic masses use the unified atomic mass unit, 1 u = 1.66 × 10⁻²⁷ kg.

**Time.** From a swinging pendulum to quartz watches to atomic clocks: the mobile phone in your pocket gets its time from a hierarchy of such clocks. Timing by hand has about 0.2 s reaction-time error, so we time 20 swings and divide.

<div class="myth">

**“A more precise instrument always gives the true value.”** An instrument with a tiny least count can still give a wrong value if it has a zero error or you read it badly. Precision is about the spread of the readings; accuracy is about closeness to the true value.

</div>

## 3. Accuracy, precision and errors in measurement

**Accuracy** is how close a result is to the true value; **precision** is how close repeated readings are to each other. Think of a cricketer’s bowling: all balls landing on the same spot but a metre off the stumps is precise but not accurate.

The **error** is the difference between the measured and the true value. There are two families.

- **Systematic errors** push every reading the same way: a zero error, a stopwatch that starts late, a ruler that has shrunk. Averaging cannot remove them; you must find and correct them.
- **Random errors** are unpredictable, up and down, from small changes in conditions and in your reading. Averaging many readings shrinks them.

<figure class="fig" data-fig="c11p-units-error"><figcaption>Timing a pendulum whose true period is 2.00 s. Add readings with the slider: the mean settles. Then switch to the stopwatch that starts late and see that a tight cluster can sit in the wrong place.</figcaption></figure>

### Absolute, relative and percentage error

If the readings are a₁, a₂, ... aₙ, the best value is the mean `$\bar a$`.

```math
\bar a = \frac{a_1 + \cdots + a_n}{n}, \qquad \Delta a_i = |\bar a - a_i|, \qquad \overline{\Delta a} = \frac{\sum \Delta a_i}{n}
```

The **mean absolute error** is `$\overline{\Delta a}$`; the **relative error** is `$\overline{\Delta a}/\bar a$`; the **percentage error** is that multiplied by 100. The result is written `$a = \bar a \pm \overline{\Delta a}$`.

<div class="meaning">

<dl>
<dt>Δa</dt><dd>absolute error: the size of the uncertainty, in the same unit as a</dd>
<dt>Δa / a</dt><dd>relative error: a pure number; the best way to compare the quality of two measurements</dd>
<dt>Least count error</dt><dd>even a single reading is uncertain by about one least count</dd>
<dt>Physical meaning</dt><dd>Error 1 cm is nothing on a 100 m cricket pitch and a disaster on a 2 cm coin: the relative error says which.</dd>
</dl>

</div>

### Combining errors

When a result is calculated from measurements, the errors travel with it. Worst-case rules:

```math
Z = A + B \text{ or } A - B:\ \Delta Z = \Delta A + \Delta B \qquad Z = A\,B \text{ or } \frac{A}{B}:\ \frac{\Delta Z}{Z} = \frac{\Delta A}{A} + \frac{\Delta B}{B} \qquad Z = A^{n}:\ \frac{\Delta Z}{Z} = n\,\frac{\Delta A}{A}
```

Notice: **absolute** errors add for a sum or difference (even when you subtract!), and **relative** errors add for products, quotients and powers. A power multiplies the relative error: a measurement of a sphere’s radius with 2 % error gives a volume with 6 % error.

<figure class="fig" data-fig="@mech-error-prop"><figcaption>Two measurements with error bars combined by +, −, ×, ÷ or squaring. Compare the rule with the worst case.</figcaption></figure>

<div class="problem" data-problem="c11p-units-error"></div>

Combine your own measurements and see the error bars here:

<!--fig:tool uncertainty-calculator-->

## 4. Significant figures

The **significant figures** of a number are the digits that tell you something real: all the sure digits and the first doubtful one. Writing 3.80 cm says the length is known to the nearest 0.01 cm; writing 3.8 cm says only to the nearest 0.1 cm. They are different claims.

**The rules**

1. All non-zero digits count: 2.34 has 3.
2. Zeros between digits count: 1.005 has 4.
3. Leading zeros never count (they only place the decimal point): 0.00305 has 3.
4. Trailing zeros count only after a decimal point: 4.560 has 4, but 2500 may have 2, 3 or 4. Write 2.5 × 10³ or 2.500 × 10³ to be clear.
5. Changing units must not change the count: 4.20 cm = 0.0420 m = 4.20 × 10⁻² m.

<figure class="fig" data-fig="c11p-units-sigfig"><figcaption>Choose a number to see which digits are counted. Slide “round to” to round it to that many figures.</figcaption></figure>

**Rounding.** Keep the digits you need; if the first dropped digit is more than 5, round up; less than 5, keep; if it is exactly 5, many books round to the even digit (2.45 → 2.4, 2.35 → 2.4).

**Using them in calculations**

- **Multiplication and division:** the answer has as many significant figures as the number with the fewest. 2.50 × 1.2 = 3.0, not 3.000.
- **Addition and subtraction:** the answer has as many **decimal places** as the number with the fewest. 12.11 + 0.9 + 5.346 = 18.4.
- Exact numbers (a count of 5 students, or the 2 in 2πr) have unlimited figures.
- Do not round in the middle of a long calculation; round once, at the end.

<div class="problem" data-problem="c11p-units-sigfig"></div>

Check any number and any sum here:

<!--fig:tool sig-fig-checker-->

<div class="myth">

**“More digits on the calculator means a better answer.”** A calculator shows 8 digits whether or not they mean anything. If your length was measured to 3 figures, your area is good to 3 figures, however long the display is.

</div>

## 5. Dimensions and dimensional analysis

The **dimension** of a quantity shows how it is built from the base quantities: mass M, length L, time T (and current A, temperature K...). We write it in square brackets: speed `$[v] = [L T^{-1}]$`, force `$[F] = [M L T^{-2}]$`, energy `$[E] = [M L^2 T^{-2}]$`.

| Quantity | Formula | Dimensions | SI unit |
|---|---|---|---|
| area | length × length | L² | m² |
| density | mass ÷ volume | M L⁻³ | kg m⁻³ |
| velocity | length ÷ time | L T⁻¹ | m s⁻¹ |
| acceleration | velocity ÷ time | L T⁻² | m s⁻² |
| force | mass × acceleration | M L T⁻² | N |
| work, energy | force × distance | M L² T⁻² | J |
| power | work ÷ time | M L² T⁻³ | W |
| pressure | force ÷ area | M L⁻¹ T⁻² | Pa |
| momentum | mass × velocity | M L T⁻¹ | kg m s⁻¹ |
| frequency | 1 ÷ time | T⁻¹ | Hz |

Pure numbers, angles and ratios (π, sin θ, refractive index) have **no dimensions**.

### Use 1: checking an equation (principle of homogeneity)

You can add or equate only quantities of the same kind: 5 metres + 3 seconds is nonsense. So in a correct equation **every term has the same dimensions**.

<div class="steps" data-fig="c11p-units-dimcheck">
<div class="step">Take the equation `$s = ut + \tfrac12 at^2$`. Is it dimensionally possible?</div>
<div class="step">Write the dimensions of each symbol: [s] = L, [u] = L T⁻¹, [a] = L T⁻², [t] = T.</div>
<div class="step">Work out each term: [ut] = L T⁻¹ × T = L and [½at²] = L T⁻² × T² = L (the ½ is a pure number).</div>
<div class="step">Every term is a length, so the equation passes the test. (It does not prove the equation is right, only that it can be.)</div>
<div class="step">Now try the wrong equation `$s = ut + at$`.</div>
<div class="step">[at] = L T⁻², then × T gives L T⁻¹, a velocity, while s is a length. They cannot be added, so this equation is wrong.</div>
</div>

### Use 2: converting units

Dimensions tell you how a unit changes. Since density is M L⁻³, 1 g cm⁻³ = 10⁻³ kg ÷ 10⁻⁶ m³ = 10³ kg m⁻³. Pressure 1 atm ≈ 1.01 × 10⁵ Pa (1 Pa = 1 N m⁻²) and 1 kWh = 3.6 × 10⁶ J come the same way.

### Use 3: finding how one quantity depends on others

Suppose the time period T of a pendulum could depend on its mass m, length l and the acceleration g. Write `$T = k\,m^a l^b g^c$` and match the dimensions on both sides.

<div class="steps" data-fig="c11p-units-pend">
<div class="step">Assume T = k · mᵃ · lᵇ · gᶜ, where k is a pure number and a, b, c are the unknown powers.</div>
<div class="step">Dimensions: [T] = T, [m] = M, [l] = L, [g] = L T⁻².</div>
<div class="step">Substitute into the right side: Mᵃ · Lᵇ · (L T⁻²)ᶜ = Mᵃ L^(b+c) T^(−2c).</div>
<div class="step">The left side is T¹ M⁰ L⁰. Match the powers: mass a = 0; length b + c = 0; time −2c = 1.</div>
<div class="step">Solve: c = −½, then b = ½, a = 0. The mass does not matter.</div>
<div class="step">So `$T = k\sqrt{l/g}$`. Dimensions cannot tell us k; experiment or calculus gives k = 2π.</div>
</div>

Practise with a dimension question of your own:

<div class="problem" data-problem="c11p-units-dim"></div>

Try any formula in the tool, which shows the dimensions of every term:

<!--fig:tool dimensional-analysis-->

### Limits of dimensional analysis

- It cannot give pure numbers such as ½, 2π or sin θ.
- It cannot handle formulas with a sum of two terms (like s = ut + ½at²) to find the form, only to check them.
- If a quantity depends on more than three others in this simple way, the method gives several unknowns for three equations.
- An equation can pass the test and still be wrong: v = u + 2at is homogeneous but false.

<div class="history">

<ul class="timeline">
<li><b>1791</b> The French Academy defines the metre as one ten-millionth of the distance from the pole to the equator.</li>
<li><b>1875</b> Seventeen nations sign the Metre Convention; the metric system begins to spread.</li>
<li><b>1960</b> The International System of Units (SI) is adopted.</li>
<li><b>1983</b> The metre is redefined through the speed of light.</li>
<li><b>2019</b> All seven base units are tied to constants of nature; the kilogram no longer depends on a metal cylinder in Paris.</li>
</ul>

</div>

<div class="keypoints">

- A measurement is a number plus a unit. SI has 7 base units: m, kg, s, A, K, mol, cd. Others are derived.
- Prefixes: kilo 10³, mega 10⁶, giga 10⁹, milli 10⁻³, micro 10⁻⁶, nano 10⁻⁹, pico 10⁻¹².
- Vernier least count = 1 main division − 1 vernier division; screw gauge least count = pitch ÷ number of divisions. Reading = main + coinciding division × least count. Correct for zero error.
- Systematic errors shift all readings (cannot be averaged away); random errors scatter (averaging helps).
- Mean absolute error = mean of |mean − reading|; relative error = Δa/a. Sum or difference: absolute errors add. Product or quotient: relative errors add. Power n: relative error × n.
- Significant figures: leading zeros do not count; trailing zeros count only after a decimal point. Multiplication: fewest significant figures. Addition: fewest decimal places.
- Dimensions: [force] = M L T⁻², [energy] = M L² T⁻². Every term of a correct equation has the same dimensions. Dimensional analysis checks equations, converts units and finds dependences, but cannot give pure numbers.

</div>

Going further for JEE/NEET: error combinations with fractional powers, least-count tricks and dimensional-analysis problem sets are in [Units and measurements (JEE)](/learn/courses/engineering-entrance/units-measurements/).
