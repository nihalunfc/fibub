---
title: Electricity
seoTitle: 'Electricity Class 10 notes: Ohm’s law, circuits, power'
summary: 'Class 10 Electricity with animations: current, potential difference, Ohm’s law, resistivity, series and parallel, heating effect, power and kWh.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'Two resistors of 6 Ω each are joined in parallel. What is their total resistance?'
    choices: ['12 Ω', '6 Ω', '3 Ω', '36 Ω']
    ans: 2
    why: '1/R = 1/6 + 1/6 = 2/6, so R = 3 Ω. Joining resistors side by side gives the charge more paths, so the total is less than either one.'
  - q: 'The length of a wire is halved and nothing else changes. Its resistance:'
    choices: ['doubles', 'halves', 'stays the same', 'becomes four times']
    ans: 1
    why: 'R = ρL/A. Resistance is proportional to length, so half the length means half the resistance.'
  - q: 'A 1000 W heater runs for 3 hours. How many units (kWh) of electrical energy does it use?'
    choices: ['3000 units', '3 units', '0.3 units', '30 units']
    ans: 1
    why: 'Energy in kWh = power in kW × time in hours = 1 kW × 3 h = 3 kWh, which is 3 units on the electricity bill.'
sources:
  - 'NCERT Class 10 Science, Chapter 11 “Electricity” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Resistivity values at 20 °C: CRC Handbook of Chemistry and Physics, 97th edition (2016), table “Electrical resistivity of pure metals” and alloy tables'
  - 'Bureau of Indian Standards, IS 732: Code of practice for electrical wiring installations (domestic wiring, earthing and fuses), for the safety notes'
---

**Science · Class 10 · Chapter 11 · about 45 minutes.** By the end you will be able to explain what current and potential difference are, use Ohm’s law, work out the resistance of a wire and of resistors in series and parallel, and calculate heat, power and your electricity bill.

<div class="bigidea">A cell pushes charge round a closed loop. How much charge flows each second is the current; how much energy each coulomb carries is the potential difference; and how hard the path is to get through is the resistance. Ohm’s law, V = IR, ties the three together.</div>

## 1. Electric current: charge on the move

Everything around you is made of atoms with **electrons** in them. In a metal wire, some electrons are free to wander. When you connect the wire to a cell, these free electrons drift along the wire, all in the same direction. That flow of charge is an **electric current**.

Think of a busy railway platform gate. If you count how many people pass the gate each second, you know how “strong” the flow is. Current is exactly that, but for charge:

```math
I = \frac{Q}{t}
```

Charge Q is measured in **coulombs (C)** and time in seconds, so current is in **coulombs per second**, called **amperes (A)**. One coulomb is the charge of about 6.25 × 10¹⁸ electrons, because each electron carries only 1.6 × 10⁻¹⁹ C.

<figure class="fig" data-fig="c10-charge-flow"><figcaption>Electrons drift from the − end of the cell round to the + end. The gate counts the coulombs that pass in a set time; divide by the time to get the current. The arrow for <b>conventional current</b> points the other way, from + to −, because current was defined before anyone knew electrons existed.</figcaption></figure>

<div class="myth">

**“Electrons rush through the wire at the speed of light.”** The electrons themselves drift very slowly, often less than a millimetre per second. A bulb lights at once because the wire is already full of free electrons: the push travels along the whole wire almost instantly, like water coming out of a hose that is already full.

</div>

A current is measured with an **ammeter**, joined **in series** so that the current passes through it.

<div class="problem" data-problem="c10s-elec-current"></div>

<div class="problem" data-problem="c10s-elec-electrons"></div>

## 2. Potential difference: the push behind the current

Water flows from a higher tank to a lower one. Charge flows when there is a difference in electrical “level” between two points: a **potential difference**. A cell keeps one terminal at a higher potential than the other, using the energy of the chemicals inside it.

The potential difference between two points is the **work done (energy given) per unit charge** that moves between them:

```math
V = \frac{W}{Q}
```

It is measured in **volts (V)**: 1 volt = 1 joule per coulomb. A 1.5 V cell gives every coulomb that passes through it 1.5 J of energy. A **voltmeter** measures it and is joined **in parallel**, across the part you are interested in.

<div class="steps" data-fig="c10-potential-hill">
<div class="step">Water first: a pump lifts water to a high tank, and as it falls back it turns a wheel. The pump gives energy; the wheel takes it.</div>
<div class="step">In a circuit the cell is the pump. Every coulomb that passes through a 6 V cell is lifted 6 volts: it gains 6 joules of energy.</div>
<div class="step">In the connecting wire the charge loses almost nothing. In the resistor (or bulb) it falls all the way down, giving its 6 J to the resistor as heat and light.</div>
<div class="step">With two resistors in a row, the fall is shared. Here 4 V is used up in the first and 2 V in the second: 4 + 2 = 6 V, the whole lift.</div>
<div class="step">A voltmeter connected across one part shows the size of the drop across just that part: here 4 V across R₁.</div>
</div>

<div class="problem" data-problem="c10s-elec-work"></div>

**Circuit diagrams.** Engineers draw circuits with standard symbols: a long and a short line for a cell (the long line is +), several cells for a battery, a rectangle (or zigzag) for a resistor, an arrow through it for a variable resistor (rheostat), a circle with A or V for the meters, and a gap with a lever for an open switch (key). Build any circuit you like and watch the meters in the circuit builder later in this lesson.

## 3. Ohm’s law

In 1827 Georg Simon Ohm found that for a metal wire kept at the same temperature, the current through it is **proportional** to the potential difference across it. Double the voltage, and the current doubles.

```math
V \propto I \quad\Longrightarrow\quad V = IR
```

The constant R is the **resistance** of the wire, measured in **ohms (Ω)**. A wire has a resistance of 1 Ω if a potential difference of 1 V drives a current of 1 A through it.

<div class="meaning">
<dl>
<dt>V</dt><dd>potential difference across the part, in volts (energy per coulomb)</dd>
<dt>I</dt><dd>current through the part, in amperes (coulombs per second)</dd>
<dt>R</dt><dd>resistance, in ohms: how many volts you need for each ampere</dd>
<dt>Physical meaning</dt><dd>Resistance is the opposition the part gives to charge flowing through it. The moving electrons keep bumping into the vibrating atoms of the metal; the more bumps, the more push (voltage) is needed for the same current.</dd>
</dl>
</div>

Drag the voltage slider and collect readings. For a resistor they fall on a straight line through the origin; for a bulb, they do not.

<figure class="fig" data-fig="c10-ohm-graph"><figcaption>The V–I graph. For a resistor at a fixed temperature, V/I is the same at every reading, so the line is straight and its slope is R. A bulb’s filament heats up as the current grows, its resistance rises, and the line bends: a bulb does not obey Ohm’s law.</figcaption></figure>

Now take real measurements in a virtual lab: change the battery and the resistor, read the ammeter and voltmeter, and plot your own graph.

<!--fig:tool ohms-law-lab-->

<div class="problem" data-problem="c10s-elec-ohm"></div>

<div class="myth">

**“Resistance is caused by the current.”** Resistance belongs to the part itself: its material, length, thickness and temperature. The current depends on the resistance, not the other way round. If no current flows, the wire still has the same resistance.

</div>

## 4. What decides a wire’s resistance

Experiments with wires show three things:

- A **longer** wire has more resistance: R ∝ L. The electrons have further to go and more atoms to bump into.
- A **thicker** wire has less resistance: R ∝ 1/A, where A is the area of cross-section. More lanes side by side, like a wider road.
- The **material** matters. Copper lets charge through easily; nichrome does not.

Putting these together:

```math
R = \rho\,\frac{L}{A}
```

The constant ρ (rho) is the **resistivity** of the material, in **ohm metre (Ω m)**. It does not depend on the wire’s size, only on what it is made of and its temperature.

| Material | Resistivity at 20 °C (Ω m) | Used for |
|---|---|---|
| Silver | 1.6 × 10⁻⁸ | best conductor, too costly for wiring |
| Copper | 1.7 × 10⁻⁸ | house wiring, cables |
| Aluminium | 2.7 × 10⁻⁸ | overhead power lines (light and cheap) |
| Tungsten | 5.6 × 10⁻⁸ | bulb filaments (melts at 3422 °C) |
| Nichrome (alloy) | about 1.1 × 10⁻⁶ | heater, iron and toaster coils |
| Glass, rubber | 10¹⁰ to 10¹⁷ | insulators |

Alloys have a much higher resistivity than the pure metals they are made from and do not oxidise (burn) easily when hot, which is why heating coils are made of alloys like nichrome.

<figure class="fig" data-fig="c10-resistivity"><figcaption>Change the length, the thickness and the material. The dots are electrons pushing through: they get through slower in a long, thin or high-resistivity wire. Doubling the diameter makes the area four times as big, so the resistance falls to a quarter.</figcaption></figure>

<div class="problem" data-problem="c10s-elec-resistivity"></div>

## 5. Resistors in series and in parallel

Real circuits have many parts. They can be joined in two basic ways.

**Series:** one after another, in a single path. The **same current** flows through each. The voltages across them **add up** to the cell’s voltage, so V = V₁ + V₂ + V₃. Since each V = IR,

```math
R_s = R_1 + R_2 + R_3
```

**Parallel:** side by side, between the same two points. Each resistor gets the **same voltage**. The currents in the branches **add up**: I = I₁ + I₂ + I₃. Since each I = V/R,

```math
\frac{1}{R_p} = \frac{1}{R_1} + \frac{1}{R_2} + \frac{1}{R_3}
```

The total resistance in parallel is always **less than the smallest** resistor, because every extra branch is an extra path for the charge. For just two resistors, R<sub>p</sub> = R₁R₂/(R₁ + R₂): “product over sum”.

<div class="steps" data-fig="c10-series-parallel">
<div class="step">Series: a 2 Ω and a 4 Ω resistor in one loop with a 6 V cell. There is only one path, so every charge goes through both.</div>
<div class="step">The current is the same everywhere: 1 A. The voltages add: 2 V across the 2 Ω and 4 V across the 4 Ω, and 2 + 4 = 6 V.</div>
<div class="step">So the two together act like one 6 Ω resistor: R = R₁ + R₂.</div>
<div class="step">Parallel: now each resistor is connected straight across the cell, so each has the full 6 V.</div>
<div class="step">The currents are 6/2 = 3 A and 6/4 = 1.5 A, so the cell sends out 4.5 A. The pair acts like 6/4.5 = 1.33 Ω, less than either.</div>
<div class="step">This is how your home is wired: every appliance is in parallel, gets the full mains voltage, and has its own switch.</div>
</div>

Try series and parallel for yourself with any values, and see how the current and voltage split:

<!--fig:tool series-parallel-->

<div class="problem" data-problem="c10s-elec-combination"></div>

**Why not series at home?** In series, the appliances would share the 220 V, so none would get what it needs; one bulb burning out would break the only path and switch everything off; and different appliances need different currents, which series cannot give.

## 6. The heating effect of current

When current flows through a resistor, the electrons keep handing energy to the atoms they bump into, and the resistor warms up. The cell supplies energy VIt in time t, and in a resistor it all becomes heat:

```math
H = VIt = I^2Rt = \frac{V^2}{R}\,t
```

This is **Joule’s law of heating**: the heat produced is proportional to the square of the current, to the resistance, and to the time.

<figure class="fig" data-fig="c10-heating"><figcaption>Raise the current and the wire heats up, glows red, then yellow-white. The bars show that the heat each second goes as I²: twice the current gives four times the heat. Switch to the fuse to see it melt when the current passes its rating.</figcaption></figure>

**Useful heating:** electric irons, toasters, kettles, room heaters and geysers use coils of high-resistivity alloy. A filament bulb uses tungsten, which glows white-hot at about 2500 °C without melting; the bulb is filled with nitrogen or argon so the filament does not burn. Most of the energy still comes out as heat, which is why LED lamps, which waste far less, have replaced them.

**Protection:** a **fuse** is a short piece of wire with a low melting point, placed in series with the circuit. If too much current flows (because of a short circuit or overloading), the fuse wire heats up, melts and breaks the circuit before the house wiring can overheat and start a fire. Fuses are rated 1 A, 2 A, 3 A, 5 A, 10 A and so on; modern homes use **MCBs** (miniature circuit breakers), switches that trip open on their own and can simply be switched back on.

The fuse tool below lets you choose a fuse for real appliances:

<!--fig:tool fuse-heating-->

<div class="problem" data-problem="c10s-elec-heat"></div>

## 7. Electric power and your electricity bill

**Power** is the rate of using (or supplying) energy: energy per second. For an electrical part,

```math
P = VI = I^2R = \frac{V^2}{R}
```

The unit is the **watt (W)**: 1 W = 1 J/s = 1 V × 1 A. A bulb marked “60 W, 220 V” uses 60 J every second when connected to 220 V. Its resistance follows from R = V²/P = 220²/60 ≈ 807 Ω.

The watt is small for a whole house, and the second is short, so the electricity board measures energy in **kilowatt hours (kWh)**, called **units**:

```math
1\ \text{kWh} = 1000\ \text{W} \times 3600\ \text{s} = 3.6\times10^{6}\ \text{J}
```

Energy in kWh = power in kW × time in hours. A 2 kW geyser running for half an hour uses 2 × 0.5 = 1 unit.

<div class="problem" data-problem="c10s-elec-bill"></div>

Work out the real cost of every appliance in your home, with your own state’s tariff:

<!--fig:tool power-bill-->

<div class="history">

<ul class="timeline">
<li><b>1800</b> Alessandro Volta stacks zinc and copper discs with brine-soaked card: the first battery, giving a steady current for the first time.</li>
<li><b>1827</b> Georg Simon Ohm publishes the law V ∝ I. Many scientists ignore it for years; the unit of resistance is later named after him.</li>
<li><b>1841</b> James Prescott Joule measures the heat made by a current and finds it grows as I²R.</li>
<li><b>1879-1882</b> Practical light bulbs and the first power stations; electricity reaches homes.</li>
</ul>

</div>

<div class="keypoints">

- Current I = Q/t, in amperes (1 A = 1 C/s); measured with an ammeter in series. Conventional current flows from + to −, electrons the other way.
- Potential difference V = W/Q, in volts (1 V = 1 J/C); measured with a voltmeter in parallel.
- Ohm’s law: V = IR at a constant temperature; the V–I graph is a straight line through the origin with slope R.
- R = ρL/A: resistance grows with length, falls with area; ρ (Ω m) depends only on the material and temperature. Alloys have high ρ.
- Series: same current, voltages add, R<sub>s</sub> = R₁ + R₂ + …
- Parallel: same voltage, currents add, 1/R<sub>p</sub> = 1/R₁ + 1/R₂ + …; total is less than the smallest. Homes are wired in parallel.
- Heating: H = I²Rt; used in heaters, bulbs and fuses. A fuse melts and breaks the circuit when the current is too high.
- Power P = VI = I²R = V²/R, in watts. 1 kWh (1 unit) = 3.6 × 10⁶ J.

</div>
