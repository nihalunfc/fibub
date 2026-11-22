---
title: 'The second law, engines and entropy'
seoTitle: Second law, Carnot engines and entropy for IIT JAM
summary: 'Why no engine can turn all its heat into work, the Carnot limit for engines, refrigerators and heat pumps, Otto and Diesel cycles, entropy as a state function, how to compute entropy changes for any process, and the third law.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: An ideal gas expands freely into vacuum and doubles its volume, with no heat exchanged. What is its entropy change?
    choices: ['nR ln 2', 'Zero, because Q = 0', '−nR ln 2', 'It cannot be found, because the process is irreversible']
    ans: 0
    why: Entropy is a state function, so use any reversible path between the same two states, such as an isothermal expansion. That gives nR ln 2. ΔS = Q/T holds only along reversible paths.
  - q: A reversible refrigerator works between 250 K and 300 K. How many joules of heat does it remove from the cold side per joule of work?
    choices: ['5', '6', '1.2', '0.2']
    ans: 0
    why: COP = T_c/(T_h − T_c) = 250/50 = 5. The value 6 is the heat pump COP, which counts the heat delivered to the hot side.
  - q: Two Carnot engines run in series between 900 K and 400 K and do equal work. What is the intermediate temperature?
    choices: ['650 K', '600 K', '500 K', '750 K']
    ans: 0
    why: Equal work means equal temperature drops, so the intermediate temperature is the arithmetic mean, 650 K. Equal efficiencies would need the geometric mean, 600 K.
sources:
  - 'E. Fermi, Thermodynamics (Dover, 1956), chapters III and IV'
  - 'M. W. Zemansky and R. H. Dittman, Heat and Thermodynamics, 7th ed. (McGraw-Hill, 1997), chapters 6 to 8'
  - 'S. J. Blundell and K. M. Blundell, Concepts in Thermal Physics, 2nd ed. (Oxford, 2010), chapters 13, 14 and 18'
  - 'IIT JAM Physics syllabus (Kinetic theory and thermodynamics section), published by the organising IIT each year'
---

**Module 5 · about 45 minutes.** By the end you will be able to state the second law in its two classic forms, find the best possible efficiency of any engine, refrigerator or heat pump, work out Otto and Diesel efficiencies, compute the entropy change of gases, solids, liquids and reservoirs for any process, and decide whether a claimed device is possible.

<div class="bigidea">Heat flows by itself only from hot to cold. Entropy turns this into a number: in an isolated system it never decreases, and that one rule limits every engine ever built.</div>

## 1. Two statements of one law

The first law allows a ship to run by cooling the sea. The second law forbids it.

- **Kelvin–Planck:** no cyclic device can take heat from a single reservoir and turn it all into work. Every engine must dump some heat into something colder.
- **Clausius:** no cyclic device can move heat from a cold body to a hot body with no other effect. Refrigerators need work.

If you could break one, you could break the other: hook a perfect engine to an ordinary refrigerator and the pair would pump heat uphill for free. So they are the same law.

## 2. The Carnot engine: the best you can do

Carnot's engine uses only reversible steps: an isothermal expansion at `$T_h$` (heat `$Q_h$` in), an adiabatic expansion down to `$T_c$`, an isothermal compression at `$T_c$` (heat `$Q_c$` out) and an adiabatic compression back. For an ideal gas the two isothermal steps give `$Q_h/Q_c = T_h/T_c$`, and no engine between the same two reservoirs can beat it:

```math
\eta = \frac{W}{Q_h} = 1 - \frac{Q_c}{Q_h} \le 1 - \frac{T_c}{T_h}
```

<figure class="fig" data-fig="carnot-cycle"><figcaption>The Carnot cycle on log P–log V (isotherms slope −1, adiabats slope −γ) and on T–S, where it is a rectangle: the enclosed area is the work and the area under the top edge is the heat taken in.</figcaption></figure>

<div class="meaning">

<dl>
<dt>η</dt><dd>efficiency: the share of the heat taken in that comes out as work</dd>
<dt>T<sub>h</sub>, T<sub>c</sub></dt><dd>absolute temperatures (kelvin) of the hot and cold reservoirs</dd>
<dt>Q<sub>c</sub>/Q<sub>h</sub> = T<sub>c</sub>/T<sub>h</sub></dt><dd>true for any reversible engine; it defines the absolute temperature scale</dd>
<dt>Physical meaning</dt><dd>The efficiency depends only on the two temperatures, not on the working substance. The only way to approach 100% is a very cold sink.</dd>
</dl>

</div>

Run backwards, it becomes a refrigerator or heat pump. The figure of merit is the **coefficient of performance**:

```math
\mathrm{COP}_{\rm fridge} = \frac{Q_c}{W} = \frac{T_c}{T_h - T_c}, \qquad \mathrm{COP}_{\rm pump} = \frac{Q_h}{W} = \frac{T_h}{T_h - T_c} = \mathrm{COP}_{\rm fridge} + 1
```

**Worked example.** A heat pump keeps a house at 25 °C when it is 5 °C outside. `$\mathrm{COP} = 298.15/20 \approx 14.9$`. Using Celsius, `$25/20$`, is the trap; only temperature *differences* can be taken in Celsius.

**Is a claim possible?** An engine taking 1000 J from 400 K and rejecting heat at 300 K can give at most `$1000(1 - 300/400) = 250$` J. A claim of 300 J breaks the second law (not the first: 700 J still goes somewhere). Check the first law first: more work than heat in breaks the first law.

<div class="problem" data-problem="carnot-fridge"></div>

## 3. Real cycles: Otto and Diesel

Petrol engines approximate the **Otto cycle**: two adiabats and two constant-volume steps. With compression ratio `$r = V_{\max}/V_{\min}$`:

```math
\eta_{\rm Otto} = 1 - \frac{1}{r^{\gamma - 1}}, \qquad \eta_{\rm Diesel} = 1 - \frac{1}{r^{\gamma - 1}}\cdot\frac{\rho^{\gamma} - 1}{\gamma(\rho - 1)}
```

where `$\rho$` is the Diesel cut-off ratio (the volume ratio over which fuel burns at constant pressure). The extra factor is larger than 1, so at the same `$r$` a Diesel is less efficient; it wins in practice because it can use much higher `$r$` without knocking. For `$r = 8$`, `$\gamma = 1.4$`: `$\eta_{\rm Otto} = 1 - 8^{-0.4} \approx 56.5\%$`. They fall short of Carnot because heat enters over a range of temperatures, not all at the top. Try them all in fibub's [heat engine cycles tool](/science/heat-engine-cycles/) and the classroom [Carnot engine](/learn/carnot-engine/).

## 4. Entropy

For any reversible cycle, the Carnot result `$Q_h/T_h = Q_c/T_c$` generalises to `$\oint dQ_{\rm rev}/T = 0$`. So `$dQ_{\rm rev}/T$` is the change of a state function, the **entropy** `$S$`. For any real cycle the **Clausius inequality** `$\oint dQ/T \le 0$` holds, which leads to:

```math
dS = \frac{dQ_{\rm rev}}{T}, \qquad \Delta S_{\rm isolated} \ge 0 \quad(\text{zero only if reversible})
```

**The recipe for any entropy change.** Because `$S$` is a state function, find *any reversible path* between the same two states and add up `$dQ/T$` along it, even if the real process was violent.

| Situation | `$\Delta S$` |
|---|---|
| reservoir at `$T$` receiving `$Q$` | `$Q/T$` |
| phase change at `$T$` with latent heat `$L$` | `$mL/T$` |
| heating mass `$m$`, specific heat `$c$` | `$mc\ln(T_2/T_1)$` |
| ideal gas | `$nC_V\ln\frac{T_2}{T_1} + nR\ln\frac{V_2}{V_1}$` or `$nC_P\ln\frac{T_2}{T_1} - nR\ln\frac{P_2}{P_1}$` |
| mixing different ideal gases | `$-nR\sum x_i\ln x_i$` |

**Worked example.** Two blocks of heat capacity 500 J/K at 400 K and 200 K touch until both reach 300 K. `$\Delta S = 500\ln(300/400) + 500\ln(300/200) = 500\ln1.125 \approx +58.9$` J/K. Heat lost equals heat gained, but the hot block loses less entropy than the cold one gains. If instead a reversible engine is run between them, `$\Delta S = 0$` forces `$T_f = \sqrt{400\times200} = 283$` K and the engine delivers `$500(600 - 566) \approx 17.2$` kJ of work.

<div class="problem" data-problem="entropy-two-blocks"></div>

<div class="myth">

**"No heat was exchanged, so `$\Delta S = 0$`."** In a free expansion `$Q = 0$`, yet the gas gains `$nR\ln(V_2/V_1)$`. The formula `$\Delta S = Q/T$` applies only to reversible paths. For an irreversible one, `$\int dQ/T < \Delta S$`. Likewise mixing two *identical* gases gives `$\Delta S = 0$` (the Gibbs paradox), because nothing measurable changes.

</div>

**Statistical meaning.** Boltzmann's `$S = k\ln W$` counts the microstates `$W$` consistent with what we see. `$N$` free two-state spins have `$W = 2^N$`, so `$S = Nk\ln2$`. Entropy increases because there are vastly more disordered arrangements than ordered ones. Calculate entropy for real substances with fibub's [entropy calculator](/science/entropy-calculator/).

## 5. The third law

As `$T\to0$`, the entropy of a perfect crystal tends to zero (Nernst–Planck). Consequences: heat capacities and expansion coefficients vanish at absolute zero, and absolute zero cannot be reached in a finite number of steps. A crystal obeying the Debye law `$C = aT^3$` has `$S = \int_0^T aT'^2\,dT' = aT^3/3$`. A classical ideal gas with constant `$C_V$` would have `$S \to -\infty$`: one sign that classical physics fails at low temperature.

<div class="keypoints">

- Kelvin–Planck (no perfect engine) and Clausius (no free refrigerator) are equivalent.
- Carnot limit: `$\eta \le 1 - T_c/T_h$`; `$\mathrm{COP}_{\rm fridge} = T_c/(T_h - T_c)$`, `$\mathrm{COP}_{\rm pump} = T_h/(T_h - T_c)$`. Kelvin only.
- Otto: `$1 - r^{1-\gamma}$`. Diesel is lower at the same `$r$`.
- `$dS = dQ_{\rm rev}/T$`. For any process, compute `$\Delta S$` along a reversible path between the same end states.
- An isolated system never loses entropy; irreversible processes (free expansion, heat across a finite `$\Delta T$`, friction) create it.
- Third law: `$S\to0$` as `$T\to0$`; heat capacities vanish there.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [second law practice page](/learn/courses/iit-jam-physics/practice/second-law-entropy/).

<div class="qbank" data-bank="physics" data-topics="second-law-entropy" data-exam="jam" data-n="10"></div>

**Before this:** [lesson 5.2, the first law](/learn/courses/iit-jam-physics/first-law/). **Next:** [lesson 5.4, thermodynamic potentials and Maxwell relations](/learn/courses/iit-jam-physics/thermodynamic-potentials/). Going on to GATE? [Microstates, entropy and the ensembles](/learn/courses/gate-physics/ensembles/) builds entropy from counting states, and fibub's [Ising model playground](/science/ising-model/) shows entropy and order fighting it out in a magnet.
