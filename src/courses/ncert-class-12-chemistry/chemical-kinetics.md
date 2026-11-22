---
title: Chemical Kinetics
seoTitle: 'Chemical Kinetics Class 12 notes: rate law, Arrhenius'
summary: 'Class 12 Chemical Kinetics with animations: rate, order, integrated rate laws, half-life, collision theory, the Arrhenius equation and catalysts.'
minutes: 90
updated: 2026-11-22
quiz:
  - q: 'The rate of a reaction doubles when the concentration of A is doubled, and becomes four times when [B] is doubled. The rate law is:'
    choices: ['rate = k[A][B]²', 'rate = k[A]²[B]', 'rate = k[A][B]', 'rate = k[A]²[B]²']
    ans: 0
    why: 'Doubling [A] doubles the rate, so the order in A is 1 (2¹ = 2). Doubling [B] makes it four times, so the order in B is 2 (2² = 4).'
  - q: 'A first order reaction has a half-life of 20 minutes. What fraction of the reactant is left after 60 minutes?'
    choices: ['1/2', '1/4', '1/8', '1/6']
    ans: 2
    why: '60 minutes is three half-lives, and each half-life halves the amount: (1/2)³ = 1/8.'
  - q: 'A catalyst increases the rate of a reaction because it:'
    choices: ['lowers the activation energy by giving another path', 'raises the temperature of the reactants', 'changes the enthalpy of the reaction', 'increases the equilibrium constant']
    ans: 0
    why: 'A catalyst provides a route with a lower activation energy. It does not change ΔH or the equilibrium constant; it only gets there faster.'
sources:
  - 'NCERT Class 12 Chemistry, Chapter 3 “Chemical Kinetics” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Arrhenius, S. (1889), “Über die Reaktionsgeschwindigkeit bei der Inversion von Rohrzucker durch Säuren”, Zeitschrift für physikalische Chemie 4, 226–248 (for the history box)'
  - 'Gas constant R = 8.314 J K⁻¹ mol⁻¹ and the value of F: CODATA 2018 recommended values (NIST)'
  - 'Radiocarbon half-life 5730 years (Libby convention 5568 years): Godwin, H. (1962), Nature 195, 984'
---

**Chemistry · Class 12 · Chapter 3 · about 90 minutes.** By the end you will be able to express the rate of a reaction, write and use a rate law, find the order from data, use the integrated equations and half-lives of zero and first order reactions, and explain the effect of temperature and catalysts using collision theory and the Arrhenius equation.

<div class="bigidea">Thermodynamics tells you whether a reaction <b>can</b> happen; kinetics tells you <b>how fast</b>. Diamond turns to graphite in principle, and paper “can” burn at room temperature, but neither does on any timescale you notice. Speed depends on how often molecules collide, how hard, and in the right orientation, and chemists learn to control all three.</div>

## 1. Rate of a chemical reaction

The **rate** of a reaction is how fast reactants are used up or products appear. For `$R \to P$`:

```math
\text{average rate}=-\frac{\Delta[R]}{\Delta t}=+\frac{\Delta[P]}{\Delta t},\qquad \text{instantaneous rate}=-\frac{d[R]}{dt}
```

The minus sign makes the rate positive, because [R] falls. The unit is mol L⁻¹ s⁻¹ (or mol L⁻¹ min⁻¹). The **average rate** is the slope of the **chord** between two points on the concentration-time graph. The **instantaneous rate** at one moment is the slope of the **tangent** there. The reaction is fastest at the start and slows because the reactants are used up.

<figure class="fig" data-fig="c12c-kin-rate"><figcaption>A first-order decay of R. The green chord is the average rate between t and t + Δt; the dashed orange tangent is the instantaneous rate at t. Shrink Δt and the chord swings round to match the tangent.</figcaption></figure>

If the equation has coefficients, the rates of different species differ, so we divide each by its coefficient. For `$aA + bB \to cC + dD$`:

```math
\text{rate of reaction}=-\frac1a\frac{d[A]}{dt}=-\frac1b\frac{d[B]}{dt}=+\frac1c\frac{d[C]}{dt}=+\frac1d\frac{d[D]}{dt}
```

For example, in 2N₂O₅ → 4NO₂ + O₂ the NO₂ appears four times as fast as O₂ and twice as fast as N₂O₅ disappears.

<div class="problem" data-problem="c12c-kin-stoich"></div>

## 2. Factors that change the rate

- **Concentration of reactants.** More molecules per litre means more collisions per second. For gases, more pressure does the same.
- **Temperature.** A 10 K rise often doubles or triples the rate (section 6).
- **Catalyst.** A substance that speeds up a reaction without being used up, by giving a lower-energy path.
- **Surface area.** Powdered solids react faster than lumps (a sugar-cube against powdered sugar in flame).
- **Light** (for photochemical reactions, such as H₂ + Cl₂ in sunlight).

## 3. Rate law, order and molecularity

The relation between rate and the concentrations of reactants, found **by experiment**, is the **rate law**. For `$aA + bB \to$ products`

```math
\text{rate}=k\,[A]^x[B]^y,\qquad \text{order}=x+y
```

<div class="meaning">

<dl>
<dt>k</dt><dd>the rate constant: the rate when every concentration is 1 mol/L. It depends on temperature (and on the catalyst) but <b>not</b> on concentrations.</dd>
<dt>x, y</dt><dd>orders with respect to A and B: they can be 0, 1, 2, fractional or even negative, and they are <b>not</b> in general equal to the coefficients in the balanced equation.</dd>
<dt>Units of k</dt><dd>for overall order n the unit is (mol/L)<sup>1−n</sup> s⁻¹: zero order mol L⁻¹ s⁻¹; first order s⁻¹; second order L mol⁻¹ s⁻¹.</dd>
<dt>Physical meaning</dt><dd>An order of 0 means “the speed does not depend on how much is there”, like a ticket counter that serves a fixed number of people per hour however long the queue. First order means the speed is proportional to the amount left, like a leaking tank whose flow drops as the water level falls.</dd>
</dl>

</div>

**Molecularity** is the number of molecules that collide in one elementary step: 1 (unimolecular), 2 (bimolecular), rarely 3. It is a theoretical idea, always a whole number, and defined only for an **elementary** step. **Order** is experimental and can be a fraction or zero. A complex reaction has several steps; the order of the whole reaction is that of the **slowest step**, the **rate-determining step**.

<figure class="fig" data-fig="c12c-kin-rds"><figcaption>Two steps R → I → P as two gates in a row. Change the speed of each step. The overall rate equals the smaller speed. If step 2 is slow, the intermediate I piles up; if step 1 is slow, step 2 waits for its supply.</figcaption></figure>

### Finding the order: the method of initial rates

Run the reaction several times, changing **one** concentration at a time, and measure the **initial rate**. Compare experiments.

<div class="steps" data-fig="c12c-kin-initsteps">
<div class="step">Three experiments for A + B → products: ([A], [B], rate) = (0.10, 0.10, 2.0×10⁻³), (0.20, 0.10, 4.0×10⁻³), (0.10, 0.20, 8.0×10⁻³). The goal is x, y and k in rate = k[A]ˣ[B]ʸ.</div>
<div class="step">Experiments 1 and 2: only [A] changes (×2), and the rate also doubles (×2). 2ˣ = 2, so x = 1: first order in A.</div>
<div class="step">Experiments 1 and 3: only [B] changes (×2), and the rate becomes four times. 2ʸ = 4, so y = 2: second order in B.</div>
<div class="step">The rate law is rate = k[A][B]². The overall order is 1 + 2 = 3.</div>
<div class="step">Find k from any experiment: k = 2.0×10⁻³/(0.10 × 0.10²) = 2.0 L² mol⁻² s⁻¹. Check with experiment 3: 8.0×10⁻³/(0.10 × 0.20²) = 2.0. ✓.</div>
</div>

<div class="problem" data-problem="c12c-kin-order"></div>

<div class="myth">

**“The order is the sum of the coefficients in the balanced equation.”** Only for a one-step (elementary) reaction. The reaction 2N₂O₅ → 4NO₂ + O₂ has coefficient total 7, but its rate law is rate = k[N₂O₅], first order. The order is found by experiment, never read off the equation.

</div>

## 4. Integrated rate equations

The rate law tells the speed at a moment. Integrating it gives the **concentration at any time**.

**Zero order**, rate = k (does not depend on [R]; for example, reactions on a metal surface that is already saturated, such as NH₃ decomposing on hot platinum):

```math
[R]=[R]_0-kt,\qquad t_{1/2}=\frac{[R]_0}{2k}
```

**First order**, rate = k[R]. The derivation is a standard board question:

<div class="steps" data-fig="c12c-kin-firststeps">
<div class="step">Start from the first order rate law: −d[R]/dt = k[R].</div>
<div class="step">Separate the variables: d[R]/[R] = −k dt.</div>
<div class="step">Integrate both sides: ln[R] = −kt + I, where I is the constant of integration.</div>
<div class="step">At t = 0, [R] = [R]₀, so I = ln[R]₀. This gives ln[R] = −kt + ln[R]₀, and k = (2.303/t) log([R]₀/[R]).</div>
<div class="step">Compare with y = mx + c: a graph of ln[R] against t is a straight line of slope −k and intercept ln[R]₀.</div>
<div class="step">At t = t½, [R] = [R]₀/2. Then k t½ = ln 2, so t½ = 0.693/k: the half-life of a first order reaction does not depend on the starting concentration.</div>
</div>

```math
[R]=[R]_0\,e^{-kt},\qquad k=\frac{2.303}{t}\log\frac{[R]_0}{[R]},\qquad t_{1/2}=\frac{0.693}{k}
```

<div class="problem" data-problem="c12c-kin-first"></div>

<div class="problem" data-problem="c12c-kin-halflife"></div>

<div class="problem" data-problem="c12c-kin-zero"></div>

<figure class="fig" data-fig="c12c-kin-orders"><figcaption>Zero, first and second order reactions. In the concentration-time view the half-life marks tell the story: shrinking for zero order, constant for first order, growing for second order. Switch to the straight-line plot (the graph that identifies the order) or to rate against [R].</figcaption></figure>

Count decaying particles for yourself with the shared simulation:

<figure class="fig" data-fig="@chem-half-life"><figcaption>One hundred particles decaying by zero, first and second order. Measure successive half-lives: only for first order are they equal. The same law governs radioactive decay and the age of a fossil by carbon-14 (half-life 5730 years).</figcaption></figure>

Fit your own data and see which order the graphs favour:

<!--fig:tool order-graphs-->

<!--fig:tool reaction-kinetics-fitter-->

<div class="history">

**Beyond the syllabus (trimmed from the rationalised book; check your board).** *Pseudo first order reactions*: when one reactant is in large excess, its concentration hardly changes, so a second order reaction (the hydrolysis of ethyl ethanoate in a lot of water, or the inversion of cane sugar) looks first order. The integrated law for second order, 1/[R] = 1/[R]₀ + kt, and the half-life 1/(k[R]₀) also lie outside what is usually asked.

</div>

## 5. Collision theory

Why do molecules react only sometimes when they collide? **Collision theory** says a collision gives a reaction only if two conditions are met:

1. **Energy:** the colliding molecules must have at least a minimum energy, the **threshold energy**. The extra energy the average molecule needs to reach it is the **activation energy Ea**.
2. **Orientation:** they must meet in the right way. In CH₃Br + OH⁻ the hydroxide ion must hit the carbon from the side opposite to bromine; a hit on the H atoms does nothing.

```math
\text{rate}=Z\,e^{-E_a/RT}\times P
```

Z is the collision frequency, `$e^{-E_a/RT}$` the fraction of collisions with enough energy, and P the steric (orientation) factor, less than 1.

<figure class="fig" data-fig="c12c-kin-collide"><figcaption>Particles in a box. Each collision is tested for energy and orientation: grey rings bounce, green rings react. Raise the temperature and more collisions clear the energy bar; raise Ea and fewer do. Energies are scaled to make events visible on screen.</figcaption></figure>

**Energy profile.** Plot energy against “progress of reaction”. Reactants climb a hill to the **activated complex** (transition state), then fall to products. The height of the hill from reactants is Ea; the difference between reactants and products is ΔH. The reverse reaction has its own barrier, Ea(reverse) = Ea(forward) − ΔH.

<figure class="fig" data-fig="c12c-kin-profile"><figcaption>An energy hill with a ball rolling over it. Change Ea and ΔH. Switch the catalyst on: the barrier drops for the forward and the reverse reaction alike, the rate rises, and ΔH does not move.</figcaption></figure>

**Catalysts** provide a different mechanism with lower Ea. They do not change ΔH, the equilibrium constant or the final yield: they only reach equilibrium sooner. A catalyst is not used up (though it may take part and be regained, like the iron in the Haber process or the enzymes in your stomach).

## 6. Temperature and the Arrhenius equation

For many reactions, the rate roughly **doubles or triples for a 10 K rise** near room temperature. The reason is not that molecules move faster, which would give only about 2 % more collisions, but that a **much larger fraction** of them have the energy ≥ Ea.

<figure class="fig" data-fig="@chem-arrhenius-tail"><figcaption>The spread of molecular energies at two temperatures on a log scale. The shaded tail above Ea is the fraction that can react: a small rise in temperature stretches the tail a lot. Lower Ea with a catalyst and the shaded part grows even more.</figcaption></figure>

**The Arrhenius equation** (1889) puts this into one formula:

```math
k=A\,e^{-E_a/RT},\qquad \ln k=\ln A-\frac{E_a}{RT},\qquad \log k=\log A-\frac{E_a}{2.303\,RT}
```

<div class="meaning">

<dl>
<dt>A</dt><dd>the Arrhenius (pre-exponential) factor: how often collisions occur in the right orientation; same units as k</dd>
<dt>Ea</dt><dd>activation energy, in J/mol (convert from kJ)</dd>
<dt>R</dt><dd>8.314 J K⁻¹ mol⁻¹; T in kelvin</dd>
<dt>e<sup>−Ea/RT</sup></dt><dd>the fraction of molecules with energy of at least Ea</dd>
<dt>Physical meaning</dt><dd>A bigger Ea means a taller wall to climb, so k is smaller and <i>more sensitive</i> to temperature. Think of a hurdle race: a high hurdle is cleared by far fewer runners, and a bit more speed increases the number clearing it a lot.</dd>
</dl>

</div>

<figure class="fig" data-fig="c12c-kin-arrh"><figcaption>Arrhenius plot. A graph of ln k against 1/T is a straight line of slope −Ea/R. Slide Ea and the two temperatures; the readout recovers Ea from the two points. Switch to k against T for the steep exponential curve.</figcaption></figure>

With two temperatures the unknown A cancels, which is the standard calculation:

<div class="steps" data-fig="c12c-kin-arrhsteps">
<div class="step">Write the Arrhenius equation at T₁ and at T₂: ln k₁ = ln A − Ea/(RT₁) and ln k₂ = ln A − Ea/(RT₂). Data: k doubles (k₂ = 2k₁) from 300 K to 310 K.</div>
<div class="step">Subtract: ln(k₂/k₁) = (Ea/R)(1/T₁ − 1/T₂), which in log form is log(k₂/k₁) = Ea(T₂ − T₁)/(2.303 R T₁T₂). ln A is gone.</div>
<div class="step">Substitute: log 2 = Ea × 10/(2.303 × 8.314 × 300 × 310), that is 0.301 = Ea × 10/(1.777×10⁶).</div>
<div class="step">Solve: Ea = 0.301 × 1.777×10⁶/10 = 5.35×10⁴ J/mol, about 53.6 kJ/mol.</div>
<div class="step">Check on the Arrhenius plot: the line through the two points has slope −Ea/R = −6.45×10³ K. ✓</div>
</div>

<div class="problem" data-problem="c12c-kin-ea"></div>

<div class="problem" data-problem="c12c-kin-arrh"></div>

<div class="history">

<ul class="timeline">
<li><b>1850</b> Ludwig Wilhelmy follows the inversion of cane sugar with a polarimeter: the first quantitative study of a reaction rate, and the first time the rate is seen to be proportional to the amount of sugar left.</li>
<li><b>1884</b> Jacobus van’t Hoff notes that rates rise by a factor of 2 to 3 for every 10 K.</li>
<li><b>1889</b> Svante Arrhenius explains the temperature effect with the idea of an activation energy, and writes the equation named after him.</li>
<li><b>1916–1918</b> Max Trautz and William Lewis build the collision theory.</li>
</ul>

</div>

<div class="keypoints">

- Rate = −d[R]/dt = +d[P]/dt (divide by the coefficients for a general reaction). Average rate is the slope of a chord, instantaneous rate the slope of a tangent.
- Rate law rate = k[A]ˣ[B]ʸ found by experiment. Order = x + y (can be 0, fraction); molecularity is for elementary steps only (1, 2, 3).
- Units of k: (mol/L)^(1−n) s⁻¹. The slowest step decides the overall rate.
- Method of initial rates: change one concentration at a time; compare ratios.
- Zero order: [R] = [R]₀ − kt, t½ = [R]₀/2k. First order: k = (2.303/t) log([R]₀/[R]), t½ = 0.693/k (independent of [R]₀), ln[R] against t is a line of slope −k.
- Collision theory: enough energy (≥ Ea) and the right orientation. Rate = Z e^(−Ea/RT) P.
- Arrhenius: k = A e^(−Ea/RT); log(k₂/k₁) = Ea(T₂ − T₁)/(2.303 R T₁T₂); slope of ln k against 1/T is −Ea/R.
- A catalyst lowers Ea (both directions), speeds the reaction, does not change ΔH, K or yield.

</div>

Going further for JEE: the exam-level problems (consecutive and parallel reactions, pseudo first order, second order half-lives, steady state) are in [Chemical kinetics (JEE)](/learn/courses/engineering-entrance/chemical-kinetics/); NEET asks the same chemistry, so the same lesson serves both.
