---
title: Semiconductor Electronics
seoTitle: 'Semiconductor Electronics Class 12 notes: p-n junction'
summary: 'Class 12 Semiconductor Electronics with animations: energy bands, intrinsic and doped semiconductors, p-n junction, diode V-I curve and rectifiers.'
minutes: 85
updated: 2026-11-22
quiz:
  - q: 'When a pure silicon crystal is doped with a little phosphorus, it becomes:'
    choices: ['p-type with holes as the majority carriers', 'n-type with electrons as the majority carriers', 'an insulator', 'negatively charged overall']
    ans: 1
    why: 'Phosphorus has five valence electrons. Four make bonds with neighbours and the fifth is free: electrons become the majority carriers. The donor ion is positive, so the crystal as a whole stays neutral.'
  - q: 'A silicon diode (0.7 V drop) is forward biased in series with a 430 Ω resistor and a 5 V battery. The current is about:'
    choices: ['1.2 mA', '10 mA', '11.6 mA', '5 mA']
    ans: 1
    why: 'The resistor has 5 − 0.7 = 4.3 V across it, so I = 4.3/430 = 0.010 A = 10 mA.'
  - q: 'A full-wave rectifier is fed from 50 Hz mains. The ripple frequency of its output is:'
    choices: ['25 Hz', '50 Hz', '100 Hz', '200 Hz']
    ans: 2
    why: 'Both half-cycles of the input give an output pulse, so there are two pulses per input cycle: 100 per second.'
sources:
  - 'NCERT Class 12 Physics, Chapter 14 “Semiconductor Electronics: Materials, Devices and Simple Circuits” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Band gaps of silicon (1.12 eV), germanium (0.66 eV) and diamond (5.47 eV) at 300 K, and the intrinsic carrier density of silicon (about 1.0 × 10¹⁶ per m³): Sze, S. M. and Ng, K. K., Physics of Semiconductor Devices, 3rd edition (Wiley, 2007), appendices. The text uses the rounded school values 1.1 eV, 0.67 eV, 5.5 eV and 1.5 × 10¹⁶ m⁻³.'
  - 'Resistivity ranges of metals, semiconductors and insulators: Kittel, C., Introduction to Solid State Physics, 8th edition (Wiley, 2005), chapter 8'
  - 'Rectifier formulas (V_dc = V_m/π and 2V_m/π): Horowitz, P. and Hill, W., The Art of Electronics, 3rd edition (Cambridge University Press, 2015), chapter 1'
---

**Physics · Class 12 · Chapter 14 · about 85 minutes.** By the end you will be able to explain why metals, semiconductors and insulators differ using energy bands, describe intrinsic and doped (n-type and p-type) semiconductors, explain how a p-n junction forms and what forward and reverse bias do, read a diode’s V–I curve, and explain half-wave, full-wave and bridge rectifiers with a filter.

<div class="bigidea">A semiconductor sits between metal and insulator: pure, it conducts only a little, but a pinch of the right impurity and a bit of heat change that by a huge factor. Join a p-type and an n-type piece and carriers cross the join and leave a barrier that works as a one-way gate. That gate, the diode, turns alternating current into direct current, and the same idea sits inside every phone charger.</div>

## 1. Metals, insulators and semiconductors: energy bands

By how well they carry current, solids fall into three groups. The resistivity ρ (ohm metre) at room temperature is about:

- **Metals:** 10⁻² to 10⁻⁸ Ω m (copper, aluminium, silver).
- **Semiconductors:** from about 10⁻⁵ to 10⁶ Ω m (silicon, germanium, gallium arsenide).
- **Insulators:** above about 10⁸ Ω m (glass, diamond, rubber).

### Why: energy bands

In a lone atom the electrons can only have certain energy levels. Bring N atoms together in a crystal and every level splits into N closely spaced levels, which merge into a **band**. The bands that matter are:

- the **valence band**, the highest band normally full of electrons (the electrons holding the crystal together), and
- the **conduction band** above it, where electrons are free to move through the crystal.

Between them there may be an **energy gap** E<sub>g</sub> where no electron can have an energy. An electron can carry current only if it has empty states to move into (a full band cannot carry a current: no electron can speed up when there is nowhere to go).

- **Conductor:** the conduction band is partly filled or overlaps the valence band: electrons are free at any temperature.
- **Insulator:** a large gap, more than about 3 eV (diamond about 5.5 eV): at room temperature (thermal energy kT ≈ 0.026 eV) almost no electron crosses.
- **Semiconductor:** a small gap, about 1 eV (silicon 1.1 eV, germanium 0.67 eV). At 0 K it is an insulator, but at room temperature a few electrons have enough energy to cross, and a lot more cross when it is heated.

<figure class="fig" data-fig="c12p-semi-bands"><figcaption>Choose a material and slide the temperature. For copper the bands overlap. For silicon and germanium, heat lifts more and more electrons across the gap (the dots show relative numbers on a log scale). Diamond’s gap is so wide that none cross, even at 700 K.</figcaption></figure>

Compare more materials, with a gap you can change and photons you can shine on it:

<figure class="fig" data-fig="@sx-band-fill"><figcaption>Metal, semiconductor and insulator: change the gap and the temperature, watch thermal electrons and holes appear (log scale), and let photons lift electrons across.</figcaption></figure>

<div class="problem" data-problem="c12p-semi-wavelength"></div>

<div class="myth">

**“A semiconductor is a poor metal, so heating it makes it worse.”** The opposite happens. In a metal heat adds collisions and raises the resistance, but in a semiconductor heat frees many new carriers, so the resistance **falls** (a thermistor uses this). The number of carriers changes much faster with temperature than their collision rate does.

</div>

## 2. Intrinsic semiconductors

A **pure** semiconductor is called intrinsic. Silicon and germanium have four valence electrons; each atom shares them with four neighbours in covalent bonds in a diamond-like crystal.

At 0 K every bond is complete and nothing can conduct. When heated, a bond now and then breaks: its electron goes to the conduction band and leaves a vacancy, a **hole**, in the valence band. So electrons and holes are always made **in pairs**:

```math
n_e = n_h = n_i
```

(n<sub>i</sub> is the intrinsic carrier density, about 1.5 × 10¹⁶ per m³ for silicon at room temperature: only one atom in a million million has lost an electron.)

### The hole

A hole acts like a positive charge. Picture a full compartment of a Mumbai local with one empty seat. A passenger from the next seat moves into it, leaving a new empty seat behind him, and the next one moves in, and so on. The people move one way, yet the empty seat moves the **opposite** way, one step at a time. In the crystal, bound electrons jump into the hole in one direction and the hole drifts the other way, like a particle of charge +e.

With an applied field, electrons drift one way and holes the other, but both add to the current:

```math
I = I_e + I_h, \qquad \sigma = e\,(n_e\mu_e + n_h\mu_h)
```

where μ is the mobility, the drift speed per unit field. Pure semiconductors are poor conductors, so we **dope** them.

## 3. Extrinsic semiconductors: doping

Adding a very small amount of a chosen impurity (one atom in about 10⁷ to 10⁸) can raise the conductivity a thousandfold or more.

- **n-type:** replace a few Si atoms with a **pentavalent** atom (phosphorus, arsenic, antimony, five valence electrons). Four electrons make the bonds and the fifth is nearly free. Such an atom is a **donor**. Electrons are the **majority carriers** and holes are the **minority carriers**.
- **p-type:** replace a few Si atoms with a **trivalent** atom (boron, aluminium, indium, three valence electrons). One bond has a missing electron, a hole. Such an atom is an **acceptor**. Holes are the majority carriers and electrons the minority carriers.

<figure class="fig" data-fig="c12p-semi-doping"><figcaption>Choose pure, n-type or p-type silicon and the number of dopant atoms. Then switch on an electric field: electrons drift against it and holes drift with it. Each crystal stays neutral, because every free carrier is balanced by a fixed ion.</figcaption></figure>

<div class="myth">

**“An n-type crystal is negatively charged.”** It has the same number of electrons as protons. The extra free electron comes with an extra proton in the donor nucleus: the crystal as a whole is neutral. It is only that the electrons are free to move.

</div>

### Law of mass action

In a doped crystal the electron and hole densities obey, at a given temperature,

```math
n_e\,n_h = n_i^2
```

Doping adds a very large number of one kind of carrier, and the carriers of the other kind recombine with them until the product is back to n<sub>i</sub>². In n-type silicon with N<sub>d</sub> donors, n<sub>e</sub> ≈ N<sub>d</sub> and n<sub>h</sub> = n<sub>i</sub>²/N<sub>d</sub>.

**Example.** Silicon with n<sub>i</sub> = 1.5 × 10¹⁶ m⁻³ is doped with 5 × 10²² m⁻³ donors. Then n<sub>e</sub> ≈ 5 × 10²² m⁻³ and n<sub>h</sub> = (1.5 × 10¹⁶)²/(5 × 10²²) = 4.5 × 10⁹ m⁻³. The electrons now outnumber the holes by a factor of ten trillion, yet the holes never vanish entirely.

<figure class="fig" data-fig="c12p-semi-conc"><figcaption>Slide the doping level (log scale). The electron and hole bars move in opposite directions and their product stays at nᵢ², so the majority carrier rises exactly as fast as the minority carrier falls.</figcaption></figure>

<div class="problem" data-problem="c12p-semi-holes"></div>

The band picture of doping and the effect of temperature, in a tool:

<!--fig:tool energy-bands-->

## 4. The p-n junction

Join a p-type and an n-type piece of the same crystal (made as one crystal with the doping changing across a plane). A **p-n junction** forms, and it is the heart of the diode.

<div class="steps" data-fig="c12p-semi-pnsteps">
<div class="step">Before joining: the p side has many holes and few electrons; the n side has many electrons and few holes. Each piece is neutral.</div>
<div class="step">Join them. There are far more holes on the p side than on the n side, so holes **diffuse** into the n side; likewise electrons diffuse into the p side. The movement is from high concentration to low, like the scent of incense spreading across a room.</div>
<div class="step">Near the junction, a hole crossing into the n side meets an electron and they cancel (recombination); the same happens to an electron crossing into the p side. Both kinds of free carrier near the junction disappear.</div>
<div class="step">What is left behind are fixed ions: negative acceptor ions on the p side of the junction and positive donor ions on the n side. This region, with almost no free carriers, is the **depletion layer**, about a micrometre thick. The ions set up an electric field E pointing from n to p.</div>
<div class="step">The field pushes electrons back to the n side and holes back to the p side: a **drift current** opposing the diffusion current. As more carriers diffuse, the layer and the field grow and the drift grows.</div>
<div class="step">Soon the diffusion current and the drift current are equal and opposite, so no net current flows. The p side sits at a lower potential than the n side by the **barrier potential** V₀, about 0.7 V for silicon and 0.3 V for germanium. Carriers that would cross have to climb this potential hill.</div>
</div>

### Forward and reverse bias

Connect a battery across the junction. The depletion layer is a poor conductor (it has no carriers), so nearly all the battery voltage appears across it.

- **Forward bias:** the p side to the **positive** terminal, n side to the negative. The applied voltage opposes the built-in barrier, lowering it to V₀ − V. The depletion layer becomes narrow, more majority carriers cross, and a large current flows (milliamperes) once V is about 0.6 to 0.7 V in silicon.
- **Reverse bias:** the p side to the **negative** terminal. The applied voltage adds to the barrier, V₀ + V. The depletion layer becomes wider, and majority carriers cannot cross. A tiny reverse current flows (microamperes or less) because the minority carriers are swept across by the field.

<figure class="fig" data-fig="c12p-semi-bias"><figcaption>Choose the direction of the battery and slide its voltage. The depletion layer narrows and the barrier shrinks in forward bias (carriers stream across above about 0.6 V); in reverse bias the layer widens and the barrier grows, and almost no current flows.</figcaption></figure>

The junction diode is drawn as an arrow (the p side, the anode) pointing at a bar (the n side, the cathode), the direction of easy conventional current.

Open the junction and try both biases yourself:

<!--fig:tool pn-junction-->

### The V–I characteristic

Measure the current for different voltages and plot the graph.

- **Forward:** almost no current below the **knee** (cut-in) voltage (about 0.7 V for silicon, 0.3 V for germanium), then the current rises steeply. Above the knee a small change in voltage produces a large change in current, so the diode behaves like a small resistance (tens of ohms).
- **Reverse:** a very small, nearly constant reverse saturation current (about a microamp or less) until, at a high enough reverse voltage, the **breakdown** voltage, the current rises suddenly and the diode can be destroyed.

The diode is **non-ohmic**: its V–I graph is not a straight line.

<figure class="fig" data-fig="c12p-semi-iv"><figcaption>Switch between forward and reverse and between silicon and germanium. Slide the voltage and watch the point travel on the curve. The readout gives the static resistance V/I and the dynamic resistance dV/dI.</figcaption></figure>

<div class="meaning">

<dl>
<dt>Knee voltage V<sub>k</sub></dt><dd>the forward voltage above which the current grows rapidly (about 0.7 V Si, 0.3 V Ge)</dd>
<dt>Dynamic (ac) resistance r<sub>d</sub> = ΔV/ΔI</dt><dd>the slope’s reciprocal at a point of the curve: large below the knee, a few ohms to tens of ohms above it</dd>
<dt>Reverse saturation current</dt><dd>the tiny current from minority carriers in reverse bias</dd>
<dt>Physical meaning</dt><dd>The diode is a gate that opens in one direction only. Like a Metro turnstile it lets people through one way, and below the knee voltage the gate is still jammed.</dd>
</dl>

</div>

<div class="problem" data-problem="c12p-semi-current"></div>

## 5. The diode as a rectifier

Mains electricity is **alternating** current, but a phone or a laptop needs **direct** current. A **rectifier** converts ac to dc using the diode’s one-way property.

### Half-wave rectifier

An ac source (the secondary of a transformer) in series with a diode and a load resistor R<sub>L</sub>. In the half cycle when the p side is positive, the diode is forward biased and conducts; in the other half the diode is reverse biased and no current flows. Only the positive half-cycles reach the load: the output is a series of pulses at the same frequency as the input (50 Hz). With an input of peak V<sub>m</sub>, the average (dc) output is

```math
V_{dc} = \frac{V_m}{\pi}
```

### Full-wave rectifier

Two diodes with a centre-tapped transformer (or four diodes in a **bridge**) use both halves of the cycle. Each half cycle gives a pulse, so the output frequency is **twice** the input (100 Hz) and the average is double that of half-wave:

```math
V_{dc} = \frac{2V_m}{\pi}, \qquad V_m = \sqrt2\,V_{rms}
```

<div class="steps" data-fig="c12p-semi-bridgesteps">
<div class="step">The bridge uses four diodes in a diamond. The ac comes in at the top and bottom corners. The load is between the right corner (output plus) and the left corner (output minus).</div>
<div class="step">When the top terminal is positive, diodes D1 and D4 are forward biased. Current goes from the top through D1, down the load, and back through D4 to the bottom. D2 and D3 are reverse biased and block.</div>
<div class="step">When the bottom terminal is positive, D2 and D3 conduct. Current goes from the bottom through D2, down the load (the same way as before), and back through D3 to the top.</div>
<div class="step">In both half-cycles the current passes down through the load in the same direction. The output is a series of pulses of one polarity: pulsating dc, at twice the input frequency.</div>
<div class="step">A capacitor across the load charges to the peak while the diodes conduct and discharges into the load in between. The output is lifted and smoothed: a good filter leaves only a small ripple.</div>
</div>

### Filtering

The output of a rectifier still varies from zero to V<sub>m</sub> every pulse. A capacitor across the load charges up to the peak while the diode conducts, and when the voltage falls it supplies the load, discharging slowly with time constant R<sub>L</sub>C. The larger R<sub>L</sub>C is compared with the time between pulses, the smaller the **ripple**.

<figure class="fig" data-fig="c12p-semi-rect"><figcaption>Choose half-wave or full-wave and slide the capacitor and the load. Without a capacitor the output follows the pulses. With one, the output is lifted toward the peak and the ripple shrinks as C or R grows. The readout gives the average, the ripple and its frequency.</figcaption></figure>

<div class="problem" data-problem="c12p-semi-vdc"></div>

<div class="problem" data-problem="c12p-semi-ripple"></div>

Build half-wave, full-wave and bridge circuits yourself and see the waveforms:

<!--fig:tool rectifier-lab-->

<div class="myth">

**“A rectifier gives pure dc.”** Without a filter the output is pulsating dc: always one polarity, but rising and falling from zero to the peak. Only a filter (a capacitor, and for better supplies a voltage regulator) makes it nearly steady.

</div>

<div class="history">

<ul class="timeline">
<li><b>1874</b> Ferdinand Braun notices that a metal point on a crystal conducts in one direction only.</li>
<li><b>1904</b> John Ambrose Fleming invents the vacuum-tube diode; for decades radios and early computers used tubes.</li>
<li><b>1930s</b> Rectifiers of copper oxide and selenium appear; the quantum theory of bands is worked out.</li>
<li><b>1947</b> John Bardeen, Walter Brattain and William Shockley make the first transistor at Bell Laboratories.</li>
<li><b>1958</b> Jack Kilby builds the first integrated circuit.</li>
</ul>

</div>

<div class="history">

**Beyond the syllabus (not examined in the Class 12 board paper).** Special-purpose diodes (Zener diode as a voltage regulator, LED, photodiode, solar cell), the transistor as a switch and amplifier, and digital electronics with logic gates were removed from the book in the 2023 rationalisation. Explore them if you are curious: [Solar cell I–V](/science/solar-cell-iv/), [Logic gates](/learn/logic-gates/), [Band structure](/science/band-structure/) and [Carrier concentration](/science/carrier-concentration/). Check the current CBSE syllabus for what is asked this year.

</div>

<div class="keypoints">

- Bands: metal (bands overlap), semiconductor (gap about 1 eV: Si 1.1, Ge 0.67), insulator (gap above about 3 eV). Heating a semiconductor raises its conductivity.
- Intrinsic: n<sub>e</sub> = n<sub>h</sub> = n<sub>i</sub>; a hole acts like a +e carrier moving the opposite way to electrons; I = I<sub>e</sub> + I<sub>h</sub>.
- n-type: pentavalent donors (P, As, Sb), electrons majority. p-type: trivalent acceptors (B, Al, In), holes majority. Both stay neutral. n<sub>e</sub>n<sub>h</sub> = n<sub>i</sub>².
- p-n junction: diffusion, recombination, depletion layer, field from n to p, drift equals diffusion at equilibrium; barrier V₀ about 0.7 V (Si), 0.3 V (Ge).
- Forward bias (p to +): barrier lower, layer narrower, large current above the knee. Reverse bias: barrier higher, layer wider, tiny leakage current (until breakdown).
- Half-wave: V<sub>dc</sub> = V<sub>m</sub>/π, ripple 50 Hz. Full-wave: V<sub>dc</sub> = 2V<sub>m</sub>/π, ripple 100 Hz. V<sub>m</sub> = √2 V<sub>rms</sub>.
- A filter capacitor smooths the output: ripple falls as R<sub>L</sub>C grows.

</div>

Going further for JEE/NEET: the exam-level material (doping calculations, Zener regulators, LEDs and photodiodes, transistors and logic gates) is in [Semiconductors (JEE)](/learn/courses/engineering-entrance/semiconductors/).
