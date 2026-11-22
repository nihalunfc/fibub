---
title: Nuclei
seoTitle: 'Nuclei Class 12 notes: binding energy and decay'
summary: 'Class 12 Nuclei with animations: nuclear size, mass defect, binding energy curve, nuclear force, alpha, beta and gamma decay, half-life, fission and fusion.'
minutes: 80
updated: 2026-11-22
quiz:
  - q: 'The nuclear radius of a nucleus with mass number 64 compared with one of mass number 8 is:'
    choices: ['8 times as large', '4 times as large', '2 times as large', 'the same']
    ans: 2
    why: 'R = R₀A^(1/3), so the ratio is (64/8)^(1/3) = 8^(1/3) = 2. The volume is 8 times larger, the radius only 2 times.'
  - q: 'A sample has a half-life of 6 hours. The fraction left after 18 hours is:'
    choices: ['1/2', '1/3', '1/6', '1/8']
    ans: 3
    why: '18 h is 3 half-lives, and (1/2)³ = 1/8.'
  - q: 'Energy is released when:'
    choices: ['two heavy nuclei fuse', 'a uranium nucleus splits into two medium nuclei', 'iron splits into two halves', 'two iron nuclei fuse']
    ans: 1
    why: 'Splitting a heavy nucleus moves its products up the right side of the binding energy curve, to more tightly bound nuclei, so energy is released. Iron sits at the top of the curve: neither splitting nor fusing it releases energy.'
sources:
  - 'NCERT Class 12 Physics, Chapter 13 “Nuclei” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Binding energies and atomic masses: AME2020 atomic mass evaluation, IAEA Nuclear Data Services, https://www-nds.iaea.org/amdc/'
  - 'Half-lives: NuDat 3.0, National Nuclear Data Center, Brookhaven National Laboratory, https://www.nndc.bnl.gov/nudat3/'
  - 'Energy of the proton-proton chain: Bahcall, J. N., Neutrino Astrophysics (Cambridge University Press, 1989), chapter 3'
  - 'Nuclear radius constant R₀ = 1.2 fm and nuclear density: Krane, K. S., Introductory Nuclear Physics (Wiley, 1988), chapter 3'
---

**Physics · Class 12 · Chapter 13 · about 80 minutes.** By the end you will be able to describe the size and make-up of a nucleus, work out mass defect and binding energy, read the binding energy curve, explain the nuclear force, use the law of radioactive decay with half-life and mean life, and explain fission, fusion and how a reactor is controlled.

<div class="bigidea">A nucleus weighs a little less than its separate protons and neutrons. The missing mass left as energy when it formed, and the same energy would have to be put back to break it apart. Nuclei in the middle of the periodic table are the most tightly bound, so energy comes out when very heavy nuclei split or very light ones join. Unstable nuclei decay at random, yet a big crowd of them follows a precise exponential law.</div>

## 1. Atomic masses and the composition of the nucleus

The nucleus is a tiny cluster at the centre of the atom made of **protons** (charge +e) and **neutrons** (no charge). Together they are called **nucleons**. The atom is mostly empty space: a cricket ball at the centre of a stadium would be about the right picture of nucleus to atom, and nearly all the mass is in the ball.

- **Z**, the atomic number: the number of protons.
- **N**, the neutron number.
- **A = Z + N**, the mass number: the number of nucleons.

A nuclide is written `$^{A}_{Z}\mathrm{X}$`, for example `$^{12}_{6}\mathrm{C}$` or `$^{235}_{92}\mathrm{U}$`.

Atomic masses are given in **atomic mass units**: 1 u is one twelfth of the mass of a carbon-12 atom, 1.66 × 10⁻²⁷ kg. A proton is 1.00728 u, a neutron 1.00866 u, an electron 0.00055 u. Every nucleus has a mass close to a whole number of u, which is why A is called the mass number.

<div class="problem" data-problem="c12p-nuc-decay"></div>

### Isotopes, isobars and isotones

- **Isotopes** have the same Z and different N (same element): hydrogen ¹H, deuterium ²H, tritium ³H. They have the same chemistry because chemistry depends on the electrons.
- **Isobars** have the same A and different Z: ¹⁴C and ¹⁴N.
- **Isotones** have the same N and different Z: ³⁷Cl and ³⁹K (both 20 neutrons).

<figure class="fig" data-fig="c12p-nuc-nuclides"><figcaption>Pick a reference nuclide and build your own with the proton and neutron sliders. The figure names the relation: same Z is isotopes, same A is isobars, same N is isotones.</figcaption></figure>

The neutron was found by James Chadwick in 1932, when the strange neutral radiation from beryllium hit by alpha particles turned out to knock protons out of paraffin wax with an energy that needed a neutral particle of nearly the proton’s mass.

See the whole chart of nuclides, coloured by how each one decays. Stable nuclei lie along a narrow band; light ones have N ≈ Z, heavy ones need more neutrons than protons to dilute the proton repulsion.

<figure class="fig" data-fig="@qm-nuclide-chart"><figcaption>A chart of nuclides: protons up, neutrons across. The stable ones hug the diagonal at first and then bend toward more neutrons. Click a nuclide to see how it decays.</figcaption></figure>

## 2. Size of the nucleus

Rutherford’s scattering showed that the nucleus is about 10⁻¹⁵ m across, one hundred thousand times smaller than the atom. The unit used is the **fermi**: 1 fm = 10⁻¹⁵ m. Measurements show that the radius grows with the mass number as

```math
R = R_0\,A^{1/3}, \qquad R_0 \approx 1.2\ \text{fm}
```

<div class="meaning">

<dl>
<dt>R</dt><dd>radius of the nucleus (fm)</dd>
<dt>R₀</dt><dd>a constant for all nuclei, about 1.2 fm</dd>
<dt>A</dt><dd>mass number (number of nucleons)</dd>
<dt>Physical meaning</dt><dd>The volume `$\tfrac43\pi R^3$` is proportional to A: each nucleon takes up about the same room, like marbles packed in a bag. Twice as many marbles need twice the volume, but only 1.26 times the radius.</dd>
</dl>

</div>

**Nuclear density.** The mass of a nucleus is about A u and its volume is `$\tfrac43\pi R_0^3A$`, so A cancels:

```math
\rho = \frac{A\,(1.66\times10^{-27}\ \text{kg})}{\tfrac43\pi(1.2\times10^{-15})^3A} \approx 2.3\times10^{17}\ \text{kg m}^{-3}
```

The density is the same for every nucleus and about 10¹⁴ times that of water. A teaspoon (5 cm³) of nuclear matter would weigh over a billion tonnes, many times the combined mass of all Indians.

<figure class="fig" data-fig="c12p-nuc-size"><figcaption>Slide the mass number. The circle is drawn to the nucleus’s true relative size (dashed: uranium-238) and the graph shows R = 1.2A^(1/3). The density readout does not change: nuclear matter has one density.</figcaption></figure>

<div class="problem" data-problem="c12p-nuc-radius"></div>

<div class="myth">

**“A nucleus with twice the nucleons is twice as wide.”** Twice the nucleons means twice the **volume**, so the radius grows only by the cube root of two, 1.26. Always take the cube root of A.

</div>

## 3. Mass-energy and nuclear binding energy

Einstein’s special relativity says mass and energy are two forms of the same thing:

```math
E = mc^2
```

A mass of 1 u is worth 931.5 MeV of energy (1 MeV = 1.6 × 10⁻¹³ J). When you measure the masses carefully you find that **a nucleus is lighter than its separate nucleons**. The difference is the **mass defect**:

```math
\Delta m = Z\,m_p + (A-Z)\,m_n - m_{nucleus}
```

The energy equivalent of the missing mass, `$E_b = \Delta m\,c^2$`, is the **binding energy**: the work needed to pull the nucleus apart into free nucleons, or equally the energy given out when they came together. The **binding energy per nucleon**, `$E_b/A$`, tells how tightly bound the average nucleon is.

<div class="steps" data-fig="c12p-nuc-massdefect">
<div class="step">Put two hydrogen atoms (a proton and an electron each) and two neutrons on one pan of a balance. Their total mass is 2 × 1.007825 + 2 × 1.008665 = 4.032980 u. (Atomic masses are used so the electrons cancel with those of the helium atom.)</div>
<div class="step">Put a helium-4 atom on the other pan. Its mass is 4.002603 u: the pan with the helium is lighter.</div>
<div class="step">The missing mass is the mass defect, Δm = 4.032980 − 4.002603 = 0.030377 u. It did not vanish: it was carried off as energy when the nucleus formed.</div>
<div class="step">Convert with E = Δm c² and 1 u = 931.5 MeV: E = 0.030377 × 931.5 = 28.3 MeV. That is the binding energy of helium-4.</div>
<div class="step">Divide by the number of nucleons: 28.3 ÷ 4 = 7.07 MeV per nucleon. This much energy has to be supplied for each nucleon to pull ⁴He apart.</div>
</div>

<div class="problem" data-problem="c12p-nuc-binding"></div>

### The binding energy curve

Plot the binding energy per nucleon against A and you get one of the most useful graphs in physics.

- It rises steeply for the lightest nuclei: ²H is only 1.1 MeV per nucleon but ⁴He is 7.1 MeV.
- It is nearly flat at about 8 MeV for A between 30 and 170.
- It reaches a **peak of about 8.8 MeV near iron-56 (and nickel-62)**: the most tightly bound nuclei.
- It then falls slowly, to 7.6 MeV for uranium-238.

<figure class="fig" data-fig="c12p-nuc-bec"><figcaption>Hover (or tap, or use the slider) to read any nuclide. The shaded regions show where energy can be released: light nuclei by joining (fusion), heavy nuclei by splitting (fission).</figcaption></figure>

Because the curve is almost flat in the middle, a nucleus gives its nucleons about the same bond whichever way they are grouped. Joining two light nuclei moves them **up** the steep left slope, so the result is more tightly bound and the difference comes out as energy. Splitting a heavy nucleus moves the pieces **up** the gentle right slope, again releasing energy: less per nucleon, but there are so many nucleons that it adds up to about 200 MeV per uranium nucleus.

Try your own numbers in the tool:

<!--fig:tool binding-energy-->

## 4. Nuclear force

Protons repel each other by the Coulomb force, yet nuclei hold together, so some other strong attraction must act between nucleons. It is called the **nuclear force**, and what we know about it from experiments is:

1. It is the **strongest** of the forces, much stronger than the electric force between two protons at the same separation.
2. It has a **short range**: it is felt only up to a few fermi, then drops to almost nothing. That is why a big nucleus is not held together by every nucleon pulling on every other: each pulls only on its neighbours.
3. It is **charge independent**: p-p, n-n and p-n attract about equally.
4. It is **attractive** beyond about 0.8 fm, but becomes **strongly repulsive** if the nucleons get closer than that, which keeps them from collapsing into each other.
5. It is **not a central force** in a simple sense (it depends on the spins as well) and it is not given by a simple formula like 1/r².

<figure class="fig" data-fig="c12p-nuc-force"><figcaption>Potential energy of two nucleons. Slide the separation: below about 0.8 fm the force pushes them apart, beyond it the force pulls them together, and past about 3 fm it hardly acts at all. Switch on the proton Coulomb repulsion to see that it is much weaker but reaches further.</figcaption></figure>

Because the nuclear force has a short range and the Coulomb force does not, adding protons makes a heavy nucleus harder to hold together. Heavy nuclei need more neutrons than protons (the neutrons add attraction without adding repulsion), and beyond lead no nucleus is completely stable.

## 5. Radioactivity

Some nuclei are unstable and change into other nuclei by sending out particles or radiation. This is **radioactivity**, found by Becquerel in 1896 (uranium salts fogging a photographic plate) and studied by Marie and Pierre Curie. The process is **spontaneous** and random: no heat, pressure or chemical change affects it.

There are three kinds of emission.

- **Alpha decay.** The nucleus emits an alpha particle, a helium nucleus `$^4_2\mathrm{He}$`. A falls by 4 and Z by 2:

  `$^{238}_{92}\mathrm{U} \to {}^{234}_{90}\mathrm{Th} + {}^{4}_{2}\mathrm{He}$`

- **Beta decay.** In β⁻ decay a neutron turns into a proton, an electron (the beta particle) and an antineutrino; A stays the same and Z rises by 1:

  `$^{14}_{6}\mathrm{C} \to {}^{14}_{7}\mathrm{N} + e^- + \bar\nu$`

  In β⁺ decay a proton turns into a neutron, a positron and a neutrino; Z falls by 1:

  `$^{22}_{11}\mathrm{Na} \to {}^{22}_{10}\mathrm{Ne} + e^+ + \nu$`

  The electron is **made** at the moment of decay; it was not sitting in the nucleus. The tiny neutral neutrino was proposed by Pauli to save energy and momentum conservation: the electron energies form a spread, not a single value.

- **Gamma decay.** After an α or β decay the daughter nucleus is often left excited. It drops to a lower level and emits a photon of very high energy (about 0.1 to several MeV). A and Z do not change.

<figure class="fig" data-fig="c12p-nuc-modes"><figcaption>Choose a decay. The particle flies out and the figure writes the daughter nuclide and checks that A and Z balance. In every decay charge, nucleon number, energy and momentum are conserved.</figcaption></figure>

Alpha particles are stopped by a sheet of paper, beta particles by a few millimetres of aluminium and gamma rays need thick lead or concrete.

### Law of radioactive decay

Watch popcorn in a hot pan. You cannot say which kernel pops next, but you can say that about the same fraction will pop in each second. Radioactive nuclei are the same: each nucleus has the same chance **λ per second** of decaying (the **decay constant**), whatever its age. So in a short time dt, the number that decay is proportional to the number N present:

```math
-\frac{dN}{dt} = \lambda N
```

<div class="steps" data-fig="c12p-nuc-decaylaw">
<div class="step">Every nucleus has the same small chance λ per second of decaying. We cannot say which nucleus goes next, but the crowd as a whole is predictable. The dot moves along the curve we are about to build.</div>
<div class="step">So the number decaying per second is proportional to the number left: −dN/dt = λN. The slope (tangent) of the curve is steep when N is large and flat when N is small.</div>
<div class="step">Separate the variables: dN/N = −λ dt. Integrate: ln N = −λt + C. At t = 0 we have N = N₀, so C = ln N₀, which gives N = N₀ e^(−λt).</div>
<div class="step">The graph is an exponential decay: it falls steeply at first and then ever more slowly, and never quite reaches zero.</div>
<div class="step">Half-life T: the time for N to fall to N₀/2. Put N = N₀/2: e^(−λT) = ½, so T = ln 2/λ = 0.693/λ. Each further half-life halves what is left: N₀/2, N₀/4, N₀/8, ...</div>
<div class="step">Mean life τ is the average life of a nucleus, τ = 1/λ = T/0.693 = 1.44 T; at t = τ the number left is N₀/e (37 %). The activity R = −dN/dt = λN = R₀e^(−λt) is measured in becquerel (1 Bq = 1 decay per second).</div>
</div>

```math
N = N_0\,e^{-\lambda t}, \qquad T = \frac{0.693}{\lambda}, \qquad \tau = \frac{1}{\lambda}, \qquad N = N_0\left(\tfrac12\right)^{t/T}
```

<div class="meaning">

<dl>
<dt>λ</dt><dd>decay constant: the probability per second that one nucleus decays (s⁻¹)</dd>
<dt>T (or T<sub>½</sub>)</dt><dd>half-life: the time in which half of the nuclei decay; it is fixed for each nuclide and no outside condition changes it</dd>
<dt>τ</dt><dd>mean life, 1/λ, longer than T by the factor 1.44</dd>
<dt>R = λN</dt><dd>activity, decays per second (Bq); the older unit is the curie, 1 Ci = 3.7 × 10¹⁰ Bq</dd>
<dt>Physical meaning</dt><dd>A nucleus has no memory: an old one is exactly as likely to decay in the next second as a new one. That is why the pattern is an exponential, with a half-life that stays the same however long you wait.</dd>
</dl>

</div>

The simulation shows 400 nuclei, each deciding by chance on every tick. The dashed curve is the law; the solid line is what actually happens, wobbling around it.

<figure class="fig" data-fig="c12p-nuc-halflife"><figcaption>Press Play. Each tick every surviving nucleus has a chance of decaying set by the half-life. The count falls in a ragged way around the smooth exponential. Change T and restart: nothing about the pattern depends on which nuclei decay.</figcaption></figure>

<div class="problem" data-problem="c12p-nuc-halflife"></div>

<div class="problem" data-problem="c12p-nuc-activity"></div>

Throw real dice yourself (every six is a “decayed” nucleus) and compare with the law:

<!--fig:tool decay-dice-->

**Worked example (radiocarbon dating).** A living tree keeps the ratio of ¹⁴C to ¹²C in the air. After it dies, no new ¹⁴C is added and the existing ¹⁴C decays with T = 5730 years. A wooden beam from an old temple has one quarter of the ¹⁴C of living wood. One quarter is (½)², so two half-lives have passed: age = 2 × 5730 = 11,460 years.

A calculator for any half-life, mean life or activity:

<!--fig:tool decay-calculator-->

<div class="myth">

**“After two half-lives the whole sample has decayed.”** Each half-life halves **what is left**. After one half-life ½ remains, after two ¼, after three ⅛: it never reaches zero.

</div>

## 6. Nuclear energy

### Fission

In 1938 Hahn and Strassmann found that uranium hit by a slow neutron can split into two middle-sized nuclei. A typical reaction is

```math
^{235}_{92}\mathrm{U} + {}^1_0n \to {}^{141}_{56}\mathrm{Ba} + {}^{92}_{36}\mathrm{Kr} + 3\,{}^1_0n + \text{about } 200\ \text{MeV}
```

The energy comes from the binding energy curve: uranium (7.6 MeV per nucleon) turns into pieces of about 8.5 MeV per nucleon, a gain of about 0.9 MeV per nucleon on 236 nucleons. Most of the 200 MeV is the kinetic energy of the two fragments, which heats the material.

<figure class="fig" data-fig="@qm-fission-steps"><figcaption>A liquid-drop picture of fission: the neutron is absorbed, the nucleus wobbles, stretches and splits, and about 200 MeV is released.</figcaption></figure>

**Chain reaction.** The two or three neutrons from each fission can cause further fissions, so the reaction can carry on by itself. The **multiplication factor** k is the average number of neutrons from one fission that cause another fission.

- k < 1: the chain dies out (subcritical).
- k = 1: a steady chain (critical), as in a power reactor.
- k > 1: the rate rises rapidly (supercritical): an atom bomb.

<figure class="fig" data-fig="c12p-nuc-chain"><figcaption>Neutrons in each generation. Slide k below, at and above 1, and push the control rods in to reduce it. Press Play to run the generations.</figcaption></figure>

**Example.** One kilogram of uranium-235 contains 1000/235 × 6.02 × 10²³ = 2.56 × 10²⁴ nuclei. At 200 MeV (3.2 × 10⁻¹¹ J) each, the energy is 8.2 × 10¹³ J, the same as burning about 2800 tonnes of coal.

<div class="problem" data-problem="c12p-nuc-reactor"></div>

### The nuclear reactor

A reactor holds the chain reaction at k = 1 so that heat is made steadily. Its main parts:

- **Fuel:** uranium enriched to a few per cent in ²³⁵U (natural uranium has only 0.7 %).
- **Moderator:** a light material (graphite, heavy water) that slows the fast fission neutrons to thermal speed without absorbing them, because slow neutrons are much more likely to cause fission in ²³⁵U. India’s heavy-water reactors (such as those at Rawatbhata and Kakrapar) use heavy water for this.
- **Control rods:** cadmium or boron rods that absorb neutrons. Pushing them in reduces k, pulling them out raises it, and dropping them all in shuts the reactor down.
- **Coolant:** takes the heat to a heat exchanger that makes steam for a turbine.
- **Shielding:** thick concrete and steel to stop the radiation, plus safe handling of the radioactive waste.

### Fusion

When two light nuclei join to form a heavier one, energy comes out because the product is more tightly bound (the left slope of the curve). For example:

```math
^2_1\mathrm{H} + {}^2_1\mathrm{H} \to {}^3_2\mathrm{He} + n + 3.27\ \text{MeV}, \qquad {}^2_1\mathrm{H} + {}^3_1\mathrm{H} \to {}^4_2\mathrm{He} + n + 17.6\ \text{MeV}
```

Both nuclei are positive and repel each other, so they must be thrown together at huge speed. That needs temperatures of tens of millions of kelvin, which is why fusion is also called a **thermonuclear** reaction.

<figure class="fig" data-fig="@qm-fusion-barrier"><figcaption>The Coulomb barrier between two nuclei, the thermal energy at a given temperature and how fusion becomes possible. Raise the temperature and see more of the thermal crowd reach the barrier.</figcaption></figure>

**Energy in stars.** The Sun and other stars shine by fusing hydrogen. In the Sun’s core (about 15 million K) this happens mainly by the **proton-proton chain**.

<div class="steps" data-fig="c12p-nuc-ppchain">
<div class="step">The Sun’s core is a hot soup of protons. Moving at huge speeds, they sometimes get close enough for the nuclear force to win over their electric repulsion.</div>
<div class="step">Two protons join. One of them changes into a neutron, sending out a positron and a neutrino, and a deuteron (²H) is left: ¹H + ¹H → ²H + e⁺ + ν. This weak process is so rare that it sets the pace for the whole Sun, which is why it will shine for billions of years.</div>
<div class="step">The deuteron meets another proton and makes helium-3: ²H + ¹H → ³He + γ. This is quick.</div>
<div class="step">Two helium-3 nuclei meet and make helium-4, returning two protons to the pool: ³He + ³He → ⁴He + 2 ¹H.</div>
<div class="step">Adding it up (steps 1 and 2 twice, step 3 once): 4 ¹H → ⁴He + 2e⁺ + 2ν + 26.7 MeV. The Sun converts about 4 million tonnes of mass into energy every second, and it has lost only a tiny fraction of its mass in 4.6 billion years.</div>
</div>

**Controlled thermonuclear fusion.** On Earth, fusion of deuterium and tritium would give clean, abundant energy (the fuel is in sea water), but the 100 million kelvin gas has to be held away from any wall. Magnetic confinement in a doughnut-shaped device (a tokamak) and laser compression are being developed, and India takes part in the ITER project. A power station on this principle does not yet exist.

<div class="history">

<ul class="timeline">
<li><b>1896</b> Henri Becquerel finds that uranium salts blacken a photographic plate in the dark.</li>
<li><b>1911</b> Rutherford’s scattering experiment reveals a small, dense, positive nucleus.</li>
<li><b>1919</b> Rutherford turns nitrogen into oxygen with alpha particles: the first artificial transmutation.</li>
<li><b>1932</b> James Chadwick discovers the neutron.</li>
<li><b>1938</b> Otto Hahn and Fritz Strassmann find nuclear fission; Lise Meitner and Otto Frisch explain it.</li>
<li><b>1942</b> Enrico Fermi’s team starts the first controlled chain reaction in Chicago.</li>
<li><b>1956</b> India’s first reactor, Apsara, starts at Trombay under Homi Bhabha’s plan.</li>
</ul>

</div>

<div class="history">

**Beyond the syllabus (not examined in the Class 12 board paper).** The Q-value of each kind of decay as a mass-difference calculation, electron capture and the nuclear shell model with its magic numbers are university topics. Check the current CBSE syllabus for what is asked this year.

</div>

<div class="keypoints">

- Nucleus: Z protons, N neutrons, A = Z + N. Isotopes: same Z. Isobars: same A. Isotones: same N. 1 u = 1.66 × 10⁻²⁷ kg = 931.5 MeV/c².
- Radius R = R₀A^(1/3), R₀ = 1.2 fm. Volume ∝ A, so nuclear density (2.3 × 10¹⁷ kg/m³) is the same for all nuclei.
- Mass defect Δm = Zm<sub>p</sub> + (A − Z)m<sub>n</sub> − m<sub>nucleus</sub>; binding energy = Δm c²; per nucleon it peaks near Fe-56 (8.8 MeV).
- Nuclear force: strongest, short range (few fm), charge independent, attractive beyond 0.8 fm, repulsive inside.
- α: A − 4, Z − 2. β⁻: Z + 1 (n → p + e⁻ + antineutrino). β⁺: Z − 1. γ: photon from an excited nucleus; A and Z unchanged.
- Decay law: −dN/dt = λN, N = N₀e^(−λt) = N₀(½)^(t/T); T = 0.693/λ, τ = 1/λ = 1.44T; activity R = λN (becquerel).
- Fission of U-235: about 200 MeV; chain reaction needs k = 1 (moderator slows neutrons, control rods absorb them).
- Fusion: light nuclei join and release energy but need very high temperature (Coulomb barrier). Sun: 4 ¹H → ⁴He + 26.7 MeV.

</div>

Going further for JEE/NEET: the exam-level problems (Q-values, successive decays and equilibrium, binding energy from masses, reactor and fusion calculations) are in [Nuclei and radioactivity (JEE/NEET)](/learn/courses/engineering-entrance/nuclei/).
