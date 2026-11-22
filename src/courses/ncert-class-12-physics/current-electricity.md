---
title: Current Electricity
seoTitle: 'Current Electricity Class 12 notes, derivations, Kirchhoff'
summary: 'Class 12 Current Electricity with animations: drift velocity, Ohm''s law, resistivity, internal resistance, Kirchhoff''s rules and the Wheatstone bridge.'
minutes: 85
updated: 2026-11-22
quiz:
  - q: 'A cell of emf 6 V and internal resistance 1 Ω is connected to a 2 Ω resistor. The terminal voltage is:'
    choices: ['6 V', '4 V', '2 V', '3 V']
    ans: 1
    why: 'I = E/(R + r) = 6/3 = 2 A. The terminal voltage is V = E − Ir = 6 − 2 × 1 = 4 V, which is also IR = 2 × 2.'
  - q: 'When the temperature of a pure metal wire rises, its resistivity:'
    choices: ['decreases', 'increases', 'stays the same', 'first falls then rises']
    ans: 1
    why: 'The positive ions vibrate more, so the electrons collide more often and the relaxation time τ falls. Since ρ = m/(ne²τ), resistivity increases.'
  - q: 'In a balanced Wheatstone bridge P = 10 Ω, Q = 20 Ω, R = 30 Ω in the other pair of arms with S unknown (P/Q = R/S). S is:'
    choices: ['15 Ω', '60 Ω', '5 Ω', '20 Ω']
    ans: 1
    why: 'P/Q = R/S gives S = QR/P = 20 × 30 / 10 = 60 Ω.'
sources:
  - 'NCERT Class 12 Physics, Chapter 3 “Current Electricity” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Resistivity and temperature coefficients: CRC Handbook of Chemistry and Physics, 97th edition, “Electrical resistivity of pure metals” and “Resistivity of selected alloys”'
  - 'Carrier density of copper (8.5 × 10²⁸ per m³): Kittel, Introduction to Solid State Physics, 8th edition, Table 6.1'
  - 'Kirchhoff, G. (1845), “Ueber den Durchgang eines elektrischen Stromes durch eine Ebene”, Annalen der Physik 140 (for the history box)'
---

**Physics · Class 12 · Chapter 3 · about 85 minutes.** By the end you will be able to explain current and drift velocity, derive Ohm’s law and the formula for resistivity, handle resistors and cells in combination, use internal resistance and maximum power, and solve circuits with Kirchhoff’s rules and the Wheatstone bridge.

<div class="bigidea">A battery sets up an electric field along a wire; the free electrons are pushed by it and bumped by the metal’s ions all the time, so they drift slowly. The result, current proportional to voltage, is Ohm’s law, and the “bumping” is resistance. Every circuit then obeys just two ideas: charge does not pile up at junctions, and energy is conserved round a loop.</div>

## 1. Electric current and drift velocity

**Current** is the charge crossing a section of a conductor per second: `$I = \dfrac{dQ}{dt}$`, in amperes. By convention it points in the direction positive charge would move, opposite to the electrons.

In a metal wire the free electrons move at random with large speeds (about 10⁵ m/s) in all directions. This random motion gives no net current. When a field E is applied, each electron feels a force −eE, so on top of the random motion there is a slow **drift** along the wire. See it in the animation: individual electrons wander, but the whole crowd creeps forward.

<figure class="fig" data-fig="@em-drift"><figcaption>Electrons in a wire: fast random motion plus a slow drift. The drift speed shown for copper is under a millimetre per second, yet the effect (the bulb lighting) travels almost instantly, as the push spreads along the wire at close to the speed of light.</figcaption></figure>

### Derivation of the drift velocity

<div class="steps" data-fig="c12p-curr-sawtooth">
<div class="step">With no field, an electron moves in straight stretches with random velocities, changing direction at each collision with an ion. Averaged over all electrons the velocity is zero.</div>
<div class="step">Switch on a field E. Each electron now feels a constant force −eE, so it has a constant acceleration a = eE/m (opposite to E).</div>
<div class="step">Between two collisions the velocity grows steadily: v = u + at, where u is the random velocity it started with after the last collision.</div>
<div class="step">At each collision the electron forgets its direction and starts again with a new random u. The random parts u cancel when averaged over many electrons, so only the increase caused by the field is left over.</div>
<div class="step">If τ is the average time between collisions (the relaxation time), the average velocity is the drift velocity v_d = aτ = eEτ/m, directed opposite to E.</div>
<div class="step">Now count the charge. In a wire of area A with n free electrons per unit volume, the charge crossing a section each second is n A v_d e, so I = nAe·v_d. Putting v_d in: I = (n e² τ A/m) E.</div>
</div>

```math
v_d = \frac{eE\tau}{m}, \qquad I = nAe\,v_d, \qquad J = \frac{I}{A} = ne\,v_d
```

<div class="meaning">

<dl>
<dt>v<sub>d</sub></dt><dd>drift velocity, the average velocity gained from the field (m/s)</dd>
<dt>τ</dt><dd>relaxation time: average time between collisions, about 10⁻¹⁴ s in copper</dd>
<dt>n</dt><dd>number of free electrons per cubic metre (8.5 × 10²⁸ in copper)</dd>
<dt>J</dt><dd>current density, current per unit area (A/m²)</dd>
<dt>Physical meaning</dt><dd>The drift speed is tiny because so many electrons share the current. Like a long queue of people shuffling: each moves slowly, yet if the people at the front step forward, the gap travels back at once.</dd>
</dl>

</div>

<div class="problem" data-problem="c12p-curr-drift"></div>

The tool below lets you change the field, the relaxation time and the number of carriers:

[Drift velocity tool](/learn/drift-velocity/)

<div class="myth">

**“Electrons travel from the battery to the bulb in a flash.”** The electrons themselves crawl at less than a millimetre per second. What moves quickly is the electric field, which sets every electron in the wire drifting at almost the same moment.

</div>

## 2. Ohm’s law, resistance and resistivity

From the last step, `$I = \dfrac{ne^2\tau A}{m}E$`. A uniform wire of length l has voltage V = El across it, so `$I = \dfrac{ne^2\tau A}{ml}V$`. The current is proportional to the voltage: **Ohm’s law**

```math
V = IR, \qquad R = \frac{ml}{ne^2\tau A} = \rho\,\frac{l}{A}, \qquad \rho = \frac{m}{ne^2\tau}
```

R is the **resistance** in ohms (1 Ω = 1 V/A). It depends on the wire’s length, area and material. The **resistivity** ρ (Ω m) depends only on the material and temperature. The reciprocal 1/ρ = σ is the **conductivity**. In vector form: `$\vec J = \sigma\vec E$`.

<figure class="fig" data-fig="c12p-curr-resist"><figcaption>Change the material, length and thickness. Resistance grows with length and falls with area. Use the stretch slider: pulling a wire to s times its length makes it thinner too, so R grows as s².</figcaption></figure>

<div class="problem" data-problem="c12p-curr-stretch"></div>

### V–I characteristics: when Ohm’s law holds and when it does not

A conductor is **ohmic** if its V–I graph is a straight line through the origin. Metals at constant temperature are ohmic. A lamp filament is not (it heats up and its resistance rises), and a diode is strongly non-ohmic.

<figure class="fig" data-fig="c12p-curr-ohm"><figcaption>Pick a component and slide the voltage. For the resistor, V/I and the slope are the same everywhere. For the lamp and the diode they differ, and the curve is not a straight line.</figcaption></figure>

Verify Ohm’s law yourself, plotting V against I for a real set of readings:

<!--fig:tool ohms-law-lab-->

### Temperature dependence of resistance

Because ρ = m/(ne²τ), a change in τ changes ρ.

- **Metals:** the number of free electrons n barely changes with temperature, but hotter ions vibrate more, so τ falls and ρ **rises**: `$\rho_T = \rho_0[1+\alpha(T-T_0)]$`. For copper α ≈ 0.004 per °C.
- **Alloys** (constantan, manganin, nichrome) have much larger ρ and a very small α, so they are used in standard resistors and heating coils.
- **Semiconductors** (silicon, germanium): heating frees many more carriers (n rises a lot) which wins over the smaller τ, so ρ **falls** with temperature. Thermistors use this.

<figure class="fig" data-fig="c12p-curr-temp"><figcaption>Resistance relative to its value at 20 °C. The metal line climbs gently, the alloy hardly moves, the semiconductor plunges. Slide the temperature to read all three.</figcaption></figure>

<div class="problem" data-problem="c12p-curr-temp"></div>

### Colour code of resistors

Carbon resistors have coloured bands: two digits, a multiplier, and a tolerance band (gold ±5 %, silver ±10 %, none ±20 %).

<figure class="fig" data-fig="c12p-curr-colour"><figcaption>Set the bands with the sliders and read the value. Black 0, brown 1, red 2, orange 3, yellow 4, green 5, blue 6, violet 7, grey 8, white 9.</figcaption></figure>

<div class="problem" data-problem="c12p-curr-colour"></div>

## 3. Electrical energy and power

A charge Q falling through a potential difference V loses energy QV. In time t, Q = It, so the energy delivered to the part of the circuit is `$W = VIt$`. The **power** is the rate:

```math
P = VI = I^2R = \frac{V^2}{R}
```

For a resistor the energy appears as heat: `$H = I^2Rt$` (Joule heating). The unit of power is the watt; the unit of energy on your bill is the kilowatt hour, 1 kWh = 3.6 × 10⁶ J. Heating is a collision effect: the energy the electrons pick up from the field is passed to the ions at each collision, increasing their vibration.

**Why power lines use high voltage.** To send power P through lines of resistance R at voltage V, the current is I = P/V and the loss is I²R = P²R/V². Raising V by 10 reduces the loss 100 times.

## 4. Combination of resistors

**Series.** The same current passes through each; the voltages add, so `$R = R_1 + R_2 + \cdots$`.

**Parallel.** The same voltage is across each; the currents add, so `$\dfrac1R = \dfrac1{R_1}+\dfrac1{R_2}+\cdots$` (the total is less than the smallest).

<div class="problem" data-problem="c12p-curr-network"></div>

Build and test any network of resistors in the circuit simulator: [Circuit simulator](/science/circuit-simulator/).

## 5. Cells, emf and internal resistance

A cell keeps a potential difference across its terminals by chemical (or other) action. Its **emf** E is the work done by the cell per unit charge in carrying it through the cell, which equals the terminal voltage when **no current** flows. The chemicals and plates inside also resist the current: the **internal resistance** r.

With a load R connected, the current is `$I = \dfrac{E}{R+r}$`. The **terminal voltage** (what the load actually gets) is

```math
V = E - Ir = IR
```

So V is less than E when the cell delivers current: the “lost volts” Ir are dropped inside. If the cell is short-circuited (R = 0) the current is E/r, which can be large enough to damage it.

<div class="meaning">

<dl>
<dt>E</dt><dd>emf of the cell: terminal voltage with no current, in volts</dd>
<dt>r</dt><dd>internal resistance, in ohms (small for a car battery, large for an old dry cell)</dd>
<dt>V</dt><dd>terminal voltage: the potential difference across the cell while it delivers current</dd>
<dt>Physical meaning</dt><dd>Think of the cell as an ideal “pump” (emf E) in series with a small resistor r. The pump lifts every coulomb by E, but part of that is lost in the pump’s own friction before it reaches the load.</dd>
</dl>

</div>

<figure class="fig" data-fig="c12p-curr-cell"><figcaption>The bar splits E into the voltage you get and the voltage lost inside. The graph is a straight line from E (no current) down to zero at the short-circuit current E/r; its slope is −r. Slide the load R to move the dot.</figcaption></figure>

<div class="problem" data-problem="c12p-curr-terminal"></div>

Measure the internal resistance of a real cell, with the lines drawn for you:

<!--fig:tool internal-resistance-->

### Power given to the load, and the maximum power theorem

The power in the load is `$P = I^2R = \dfrac{E^2R}{(R+r)^2}$`. For R very small, P is small (no voltage across the load); for R very large P is small (no current). In between there is a peak. Setting `$dP/dR = 0$` gives `$(R+r)^2 - 2R(R+r) = 0$`, so **R = r**, where

```math
P_{max} = \frac{E^2}{4r}
```

but then the efficiency is only 50 %, because as much power is lost in r as is delivered to R.

<figure class="fig" data-fig="c12p-curr-maxpower"><figcaption>Power in the load against load resistance. The peak sits exactly at R = r (move the internal-resistance slider and it follows). The readout also shows the efficiency R/(R + r).</figcaption></figure>

<div class="problem" data-problem="c12p-curr-maxpower"></div>

### Cells in series and parallel

- **Series** (n cells): E<sub>eq</sub> = nE, r<sub>eq</sub> = nr. Good when the load resistance is large.
- **Parallel** (m identical cells): E<sub>eq</sub> = E, r<sub>eq</sub> = r/m. Good when the load resistance is small, to supply a bigger current for longer.
- **Mixed grid** of m rows with n cells in each: `$E_{eq}=nE$`, `$r_{eq}=nr/m$`, and the current in a load R is `$I = \dfrac{nE}{R+nr/m}$`. For a fixed number of cells the current is greatest when `$R = nr/m$`.

<figure class="fig" data-fig="c12p-curr-cellcombo"><figcaption>Twelve cells arranged in every possible grid. The bars show the current in the load; try a tiny R (parallel rows win) and a big R (long series chains win).</figcaption></figure>

<div class="problem" data-problem="c12p-curr-cells"></div>

## 6. Kirchhoff’s rules

Many circuits cannot be reduced by series and parallel rules (two cells in different branches, for instance). Kirchhoff’s two rules always work.

1. **Junction rule** (conservation of charge): the sum of currents entering a junction equals the sum leaving: `$\sum I = 0$`.
2. **Loop rule** (conservation of energy): going once round any closed loop, the algebraic sum of the potential changes is zero: `$\sum E = \sum IR$`.

**Sign convention.** Go round the loop in a chosen direction. A resistor traversed along the current gives a drop −IR (+IR if you go against the current). A cell traversed from − to + gives a rise +E (−E from + to −).

<div class="steps" data-fig="c12p-curr-loopsteps">
<div class="step">A circuit with two cells (12 V and 6 V) and three resistors. Assign a current to every branch with an arrow: I₁ up the left branch, I₂ down the middle one, I₃ up the right one. If an answer comes out negative, the real direction is opposite to the arrow.</div>
<div class="step">At the top node A, I₁ and I₃ flow in and I₂ flows out, so I₁ + I₃ = I₂.</div>
<div class="step">Walk once round the left loop: up through the 12 V cell (+12), through R₁ along I₁ (−2I₁), down through R₂ along I₂ (−4I₂), back to start. The sum is zero: 12 − 2I₁ − 4I₂ = 0.</div>
<div class="step">Walk round the right loop in the same way: 6 − 1·I₃ − 4I₂ = 0.</div>
<div class="step">Substitute I₂ = I₁ + I₃ into both: 6I₁ + 4I₃ = 12 and 4I₁ + 5I₃ = 6. Solving: I₁ = 18/7 = 2.57 A, I₃ = −6/7 = −0.86 A, and I₂ = 12/7 = 1.71 A. The negative I₃ means the 6 V cell is being charged by the 12 V cell.</div>
<div class="step">Check with energy: the 12 V cell gives 30.9 W; 25.7 W becomes heat in the resistors and 5.1 W goes into charging the 6 V cell. 30.9 = 25.7 + 5.1.</div>
</div>

Now walk the loop yourself and watch the potential rise and fall, as in a hill diagram:

<figure class="fig" data-fig="@em-kirchhoff"><figcaption>A walker goes round a loop of a two-battery circuit. The graph shows the potential after each element; it returns to its starting value, which is the loop rule.</figcaption></figure>

<div class="problem" data-problem="c12p-curr-kirchhoff"></div>

Enter any network and the solver writes out the equations and solves them:

<!--fig:tool kirchhoff-solver-->

## 7. Wheatstone bridge

Four resistors P, Q, R, S form a diamond with a cell across one diagonal and a galvanometer G across the other. When the points B and D are at the same potential, **no current flows through G**: the bridge is **balanced**.

**Condition.** At balance, P and Q carry the same current I₁ and R and S the same current I₂ (no current leaves at B and D). The potentials at B and D are equal, so the voltage across P equals the voltage across R, and that across Q equals that across S:

```math
I_1P = I_2R, \quad I_1Q = I_2S \;\Rightarrow\; \frac{P}{Q} = \frac{R}{S}
```

So if three resistances are known, the fourth is found without needing to know the cell’s emf: it measures a resistance by balance, a *null* method.

<figure class="fig" data-fig="@em-bridge"><figcaption>Adjust one arm until the galvanometer needle sits at zero and the two node potentials are equal. At that moment P/Q = R/S.</figcaption></figure>

<div class="problem" data-problem="c12p-curr-wheatstone"></div>

Try the full bridge here: [Wheatstone bridge tool](/learn/wheatstone-bridge/).

<div class="history">

<ul class="timeline">
<li><b>1800</b> Alessandro Volta builds the voltaic pile: the first source of steady current.</li>
<li><b>1827</b> Georg Ohm publishes the law that bears his name, after careful experiments with wires of different lengths.</li>
<li><b>1845</b> Gustav Kirchhoff, then a student of 21, states the junction and loop rules.</li>
<li><b>1843</b> Charles Wheatstone popularises the bridge circuit invented by Samuel Hunter Christie (1833) for measuring resistance accurately.</li>
<li><b>1900</b> Paul Drude explains Ohm’s law with free electrons colliding with ions: the picture used in this chapter.</li>
</ul>

</div>

<div class="myth">

**“A battery gives a constant current.”** An ideal battery keeps a constant <b>voltage</b>, and the current depends on the load (I = V/R). The terminal voltage of a real cell also falls as the current rises, because of its internal resistance.

</div>

<div class="history">

**Beyond the syllabus (not examined in Class 12 boards).** The metre bridge (a slide-wire form of the Wheatstone bridge) and the potentiometer (comparing emfs and measuring internal resistance with a null method that draws no current from the cell) have been removed from the Class 12 book. They still appear in entrance exams, and you can try the potentiometer here: [Potentiometer](/learn/potentiometer/).

</div>

<div class="keypoints">

- I = dQ/dt; drift velocity v_d = eEτ/m; I = nAe v_d; J = ne v_d. Drift speed is tiny (about mm/s).
- Ohm’s law V = IR for ohmic conductors; R = ρl/A; ρ = m/(ne²τ); J = σE. Stretching at constant volume: R → s²R.
- Metals: ρ rises with T (α ≈ 0.004/°C for copper); alloys: almost constant; semiconductors: ρ falls with T.
- P = VI = I²R = V²/R; H = I²Rt; 1 kWh = 3.6 × 10⁶ J.
- Series: R adds, same I. Parallel: 1/R adds, same V.
- Cell: I = E/(R + r), V = E − Ir; short-circuit current E/r. Maximum power in the load at R = r: E²/4r (50 % efficient).
- Cells: series E_eq = nE, r_eq = nr; parallel r_eq = r/m; mixed r_eq = nr/m.
- Kirchhoff: junction ΣI = 0 (charge); loop ΣE = ΣIR (energy). Negative current means the assumed direction was wrong.
- Wheatstone bridge balanced when P/Q = R/S; no current in the galvanometer.

</div>

Going further for JEE/NEET: the exam-level problems (symmetric networks, metre bridge, potentiometer, ammeter and voltmeter errors) are in [Current electricity (JEE)](/learn/courses/engineering-entrance/current-electricity/).
