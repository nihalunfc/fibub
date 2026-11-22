---
title: 'Current electricity and circuits'
seoTitle: 'Current electricity: JEE and NEET physics'
summary: 'Current, drift velocity and mobility, Ohm''s law and resistivity, temperature effects, series and parallel resistors, cells with internal resistance and maximum power, Kirchhoff''s laws, the Wheatstone bridge, metre bridge and potentiometer, meters, and heating, up to symmetric networks for JEE Advanced.'
minutes: 34
updated: 2026-11-22
quiz:
  - q: 'A wire is stretched to twice its length, keeping its volume the same. Its resistance becomes:'
    choices: ['2 times', '4 times', 'half', 'the same']
    ans: 1
    why: 'Length doubles and area halves (volume fixed), so R = ρL/A rises 2 × 2 = 4 times. Resistivity does not change.'
  - q: 'A cell of emf E and internal resistance r gives the most power to a load when the load is:'
    choices: ['zero', 'equal to r', 'very large', 'equal to 2r']
    ans: 1
    why: 'P = E²R/(R + r)² is largest at R = r, where it equals E²/4r. Half the energy is then wasted inside the cell.'
  - q: 'Two bulbs, 100 W and 60 W (both for 220 V), are joined in series across 220 V. Which glows brighter?'
    choices: ['100 W', '60 W', 'equal', 'neither glows']
    ans: 1
    why: 'The 60 W bulb has the larger resistance (R = V²/P). In series the current is the same, so P = I²R is larger in the 60 W bulb.'
sources:
  - 'National Medical Commission NEET (UG) syllabus and JEE Main / JEE Advanced 2026 syllabi: Current electricity'
  - 'Free electron density of copper about 8.5 × 10²⁸ m⁻³ (from its density, molar mass and one free electron per atom); elementary charge from CODATA 2022 via NIST https://physics.nist.gov/cuu/Constants/'
---

**Physics · Class 12 · about 34 minutes.** By the end you will be able to solve any DC circuit with Ohm's and Kirchhoff's laws, choose a load for maximum power, use bridges and potentiometers, and convert meters.

<div class="bigidea">A battery is a charge pump that lifts charge to a higher potential; resistors are the slopes where it rolls back down and turns its energy into heat. Kirchhoff's two laws say only two things: charge is not lost at a junction, and going round any loop you come back to the same height.</div>

## 1. Current and drift velocity

Current is the rate of flow of charge, `$I = \dfrac{dq}{dt}$`, in amperes. In a metal, free electrons dash about at around 10⁵ m/s in random directions. An electric field adds a slow, steady **drift** against the field, at a speed `$v_d = \dfrac{eE\tau}{m}$`, where τ is the average time between collisions (relaxation time).

```math
I = neAv_d, \qquad j = \frac{I}{A} = nev_d = \sigma E
```

Mobility `$\mu = v_d/E = e\tau/m$` is drift speed per unit field. Drift speeds are only about a millimetre per second, yet a bulb lights at once, because the field travels along the wire at nearly the speed of light and pushes all electrons together.

<div class="problem" data-problem="ce-drift"></div>

## 2. Ohm's law, resistance and resistivity

For metals at a fixed temperature, V = IR. Resistance depends on shape and material: `$R = \dfrac{\rho L}{A}$`, where the resistivity `$\rho = \dfrac{m}{ne^2\tau}$` belongs to the material alone.

- **Stretching** a wire n times (same volume): R becomes n² times. In terms of the radius, a stretched wire has R ∝ 1/r⁴.
- **Temperature:** for metals `$R_T = R_0(1 + \alpha\,\Delta T)$`, rising with heat as collisions become more frequent. Semiconductors and insulators have negative α. Alloys like nichrome and manganin barely change, so they are used for standard resistors.
- **Non-ohmic** devices (diode, filament lamp, electrolyte) have curved V-I graphs.

<div class="myth">

**"Electrons are used up in a resistor."** Current is the same at every point of a series circuit. The electrons are not used up; their **energy** is. Potential drops across the resistor, current does not.

</div>

## 3. Resistors in series and parallel

Series: `$R = R_1 + R_2 + \dots$`, same current, voltages add. Parallel: `$\dfrac1R = \dfrac1{R_1} + \dfrac1{R_2} + \dots$`, same voltage, currents add, and the result is less than the smallest. n equal resistors: nR in series, R/n in parallel.

**Symmetry tricks.** Points at the same potential can be joined or a wire between them removed. Twelve equal resistors on a cube edge: across a body diagonal 5R/6, across a face diagonal 3R/4, across one edge 7R/12. An infinite ladder: write R_total in terms of itself and solve the quadratic.

## 4. Cells, internal resistance and maximum power

A real cell has emf E and internal resistance r. Current `$I = \dfrac{E}{R + r}$`, terminal voltage `$V = E - Ir$`. While **charging**, V = E + Ir. Play with the load below.

<figure class="fig" data-fig="cell-power-curve"><figcaption>Power delivered to a load R by a cell of emf E and internal resistance r. It is zero at a short circuit (R = 0) and for a very large R, and peaks at R = r, where the efficiency is only 50%.</figcaption></figure>

<div class="problem" data-problem="ce-load-power"></div>

**Combining cells.** n cells in series: emf nE, resistance nr. m cells in parallel: emf E, resistance r/m. In a mixed grid (n cells in series in each of m parallel rows), the current is largest when the grid's internal resistance nr/m equals R.

## 5. Kirchhoff's laws

- **Junction law** (charge conservation): current in = current out at every junction.
- **Loop law** (energy conservation): the sum of potential changes round any closed loop is zero. Crossing a resistor along the current: −IR. Crossing a cell from − to +: +E.

Method: mark unknown currents with arrows (guess directions; a negative answer just means the other way), use the junction law to reduce unknowns, then write one loop equation per remaining unknown.

## 6. Bridges and the potentiometer

A **Wheatstone bridge** P, Q, R, S is balanced (no current through the galvanometer) when `$\dfrac PQ = \dfrac RS$`. The **metre bridge** uses a 100 cm wire for two arms: with X in the left gap, S in the right and balance at l cm, `$X = S\,\dfrac{l}{100 - l}$`. Swapping X and S and averaging removes end errors; balance near the middle gives the least error.

<div class="problem" data-problem="ce-metre-bridge"></div>

A **potentiometer** is a long uniform wire carrying a steady current, so potential falls evenly along it (potential gradient k volts per cm). At balance no current flows from the cell being tested, so it measures the **emf** itself: `$\dfrac{E_1}{E_2} = \dfrac{l_1}{l_2}$`. Internal resistance: `$r = R\left(\dfrac{l_1}{l_2} - 1\right)$`, with l₁ the open-circuit and l₂ the shunted balance length.

## 7. Meters, power and heating

A galvanometer G with full-scale current I_g becomes an **ammeter** with a small shunt in parallel, `$S = \dfrac{I_gG}{I - I_g}$`, and a **voltmeter** with a large resistance in series, `$R = \dfrac{V}{I_g} - G$`. An ideal ammeter has zero resistance, an ideal voltmeter infinite.

Power `$P = VI = I^2R = V^2/R$`. Heat (Joule's law) `$H = I^2Rt$`. Use I²R in series (same I) and V²/R in parallel (same V). Bulbs rated at the same voltage: the lower wattage bulb has the higher resistance. Energy bills use the kilowatt hour: 1 kWh = 3.6 × 10⁶ J.

<div class="meaning">
<dl>
<dt>E, r</dt><dd>emf (energy given per coulomb) and internal resistance of a cell</dd>
<dt>V</dt><dd>terminal voltage, what a voltmeter across the cell reads</dd>
<dt>ρ, α</dt><dd>resistivity (Ω m) and temperature coefficient of resistance (per °C)</dd>
<dt>n, τ</dt><dd>free electrons per m³ and mean time between collisions</dd>
<dt>Physical meaning</dt><dd>Emf is what the cell offers; the terminal voltage is what reaches the outside after the cell's own resistance takes its share Ir.</dd>
</dl>
</div>

<div class="keypoints">

- I = neAv_d; v_d = eEτ/m, about 1 mm/s; j = σE.
- R = ρL/A; stretched n times, R × n²; metals: R rises with temperature.
- Series adds R; parallel adds 1/R. Use symmetry for networks; infinite ladders by self-similarity.
- I = E/(R + r), V = E − Ir (discharging), E + Ir (charging). Maximum power E²/4r at R = r.
- Kirchhoff: junction (charge), loop (energy).
- Balanced bridge P/Q = R/S; metre bridge X = S l/(100 − l); potentiometer compares emfs, r = R(l₁/l₂ − 1).
- Shunt S = I_gG/(I − I_g); series resistance V/I_g − G.

</div>
