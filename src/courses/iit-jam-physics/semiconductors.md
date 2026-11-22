---
title: Semiconductors and the Fermi level
seoTitle: Semiconductors and the Fermi level for IIT JAM Physics
summary: 'Why some solids conduct and others do not, bands and gaps, electrons and holes, doping with donors and acceptors, the Fermi-Dirac function and where the Fermi level sits, the mass action law, conductivity, mobility, the Hall effect and how it all changes with temperature.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'Silicon with nᵢ = 10¹⁰ cm⁻³ is doped with 10¹⁶ donors per cm³. What is the hole density?'
    choices: ['10⁴ cm⁻³', '10¹⁰ cm⁻³', '10¹⁶ cm⁻³', '10⁶ cm⁻³']
    ans: 0
    why: 'Electrons n ≈ 10¹⁶ cm⁻³, and the mass action law np = nᵢ² gives p = 10²⁰/10¹⁶ = 10⁴ cm⁻³. Doping lowers the minority carriers far below nᵢ.'
  - q: 'What is the probability that a state exactly at the Fermi level is occupied, at room temperature?'
    choices: ['One half', 'One', 'Zero', 'It depends on the band gap']
    ans: 0
    why: 'f(E) = 1/(e^((E − E_F)/kT) + 1). At E = E_F the exponential is 1, so f = 1/2 at every temperature above zero.'
  - q: 'An n-type silicon sample is heated from 300 K to 700 K. What happens to its Fermi level?'
    choices: ['It moves towards the middle of the gap', 'It moves into the conduction band', 'It stays where it is', 'It moves to the valence band edge']
    ans: 0
    why: 'Heating makes many electron-hole pairs across the gap. When nᵢ becomes comparable to the donor density the sample behaves as intrinsic, with E_F near mid-gap.'
sources:
  - 'C. Kittel, Introduction to Solid State Physics, 8th ed. (2005), chapters 7 and 8'
  - 'S. M. Sze and K. K. Ng, Physics of Semiconductor Devices, 3rd ed. (2007), chapter 1'
  - 'B. G. Streetman and S. K. Banerjee, Solid State Electronic Devices, 7th ed. (2015), chapters 3 and 4'
  - 'IIT JAM Physics syllabus (Solid State Physics, Devices and Electronics section), published by the organising IIT each year'
---

**Module 7 · about 50 minutes.** By the end you will be able to explain conductors, insulators and semiconductors with bands, work with electrons and holes, find carrier densities and the Fermi level of doped material, and compute conductivity, mobility and Hall coefficients. It all rests on one function, the Fermi-Dirac occupancy.

<div class="bigidea">In a semiconductor almost every electron is locked in bonds. The few that break free, and the holes they leave behind, carry all the current, and their number can be set a million times over by adding one impurity atom in a million.</div>

## 1. Bands and the gap

An isolated atom has sharp energy levels. Bring `$N$` atoms together into a crystal and each level spreads into a **band** of `$N$` closely spaced states, because neighbouring electron waves overlap. Between bands there can be **gaps** with no states at all ([lesson 7.2](/learn/courses/iit-jam-physics/x-ray-diffraction/) hinted why: electron waves with `$2d\sin\theta = n\lambda$` are Bragg-reflected by the lattice and cannot travel).

What matters is how the highest bands are filled at `$T = 0$`:

- **Metal:** the top band is partly filled. Electrons can move into empty states just above them, so even a tiny field drives a current.
- **Insulator:** the top filled band (the **valence band**) is full and the next (the **conduction band**) is empty, separated by a large gap `$E_g$` (diamond 5.5 eV). A full band carries no current.
- **Semiconductor:** the same picture with a small gap (Si 1.12 eV, Ge 0.66 eV, GaAs 1.42 eV), small enough that heat lifts a few electrons across.

When an electron jumps into the conduction band it leaves an empty state in the valence band. The remaining electrons move into it one after another, and the empty state drifts the opposite way, like a bubble in water. We call it a **hole** and treat it as a particle with charge `$+e$` and its own effective mass.

Near a band edge, `$E(k)$` is a parabola, and the electron behaves as a free particle with **effective mass** `$m^* = \hbar^2/(d^2E/dk^2)$`: a sharply curved band means light, fast carriers. If the top of the valence band and the bottom of the conduction band are at the same `$k$` the gap is **direct** (GaAs: good LEDs and lasers); if not, it is **indirect** (Si, Ge), and a photon alone cannot carry the electron across because a photon has almost no momentum on the scale of the Brillouin zone.

## 2. Who fills the states: Fermi-Dirac

Electrons obey the Pauli principle: one per state. At temperature `$T$` the probability that a state of energy `$E$` is occupied is the **Fermi-Dirac function**

```math
f(E) = \frac{1}{e^{(E - E_F)/kT} + 1}
```

<div class="meaning">

<dl>
<dt>E<sub>F</sub></dt><dd>the Fermi level: the energy at which f = 1/2 (it can lie in the gap, where there are no states)</dd>
<dt>kT</dt><dd>the thermal energy, 25.85 meV at 300 K: the width of the region where f drops from nearly 1 to nearly 0</dd>
<dt>1 − f(E)</dt><dd>the probability the state is empty, i.e. holds a hole</dd>
<dt>Physical meaning</dt><dd>At T = 0 every state below E<sub>F</sub> is full and every state above is empty. Heat blurs the edge over a few kT. A gap of 1 eV is 40 kT at room temperature, so only the far tail of f reaches the conduction band, which is why carrier numbers are small and very sensitive to temperature.</dd>
</dl>

</div>

Far above `$E_F$` (more than about `$3kT$`), the `$+1$` is negligible and `$f \approx e^{-(E - E_F)/kT}$`, the Boltzmann tail. Adding up the states in the conduction band with this tail gives the electron density, and the same for holes:

```math
n = N_c\,e^{-(E_c - E_F)/kT}, \qquad p = N_v\,e^{-(E_F - E_v)/kT}
```

`$N_c$` and `$N_v$` are the **effective densities of states**, `$N_c = 2(2\pi m_e^*kT/h^2)^{3/2}$`: for Si about `$2.8\times10^{19}$` and `$1.04\times10^{19}$` cm⁻³ at 300 K. Multiply the two and `$E_F$` drops out:

```math
np = N_cN_v\,e^{-E_g/kT} = n_i^2
```

This is the **mass action law**. It holds for doped material too, as long as `$E_F$` stays a few `$kT$` inside the gap.

## 3. Intrinsic semiconductors

Pure material has `$n = p = n_i$`, with

```math
n_i = \sqrt{N_cN_v}\,e^{-E_g/2kT} \propto T^{3/2}e^{-E_g/2kT}
```

For Si at 300 K, `$n_i \approx 10^{10}$` cm⁻³, out of `$5\times10^{22}$` atoms per cm³: one free electron per five trillion atoms. Note the **2** in `$E_g/2kT$`: every pair needs `$E_g$`, but `$n_i$` is the square root of the pair density product.

Setting `$n = p$` puts the intrinsic Fermi level near mid-gap:

```math
E_i = \frac{E_c + E_v}{2} + \frac34kT\ln\frac{m_h^*}{m_e^*}
```

slightly above the middle when holes are heavier.

**Worked example.** How much does `$n_i$` of Si (`$E_g = 1.12$` eV) grow from 300 K to 310 K?

1. `$E_g/2k = 1.12/(2\times8.617\times10^{-5}) = 6499$` K.
2. The exponential factor: `$\exp[6499(1/300 - 1/310)] = e^{0.699} = 2.01$`.
3. The `$T^{3/2}$` factor: `$(310/300)^{1.5} = 1.05$`. Total: `$n_i$` grows 2.1 times for a 10 K rise.

## 4. Doping: donors and acceptors

Replace one Si atom (4 valence electrons) by phosphorus (5): four electrons bond, the fifth is held only by a weak, screened attraction. In the hydrogen model with the electron's effective mass and the crystal's permittivity,

```math
E_d = 13.6\ \text{eV}\times\frac{m^*/m_e}{\varepsilon_r^2} \approx 20\text{–}50\ \text{meV}
```

so at room temperature it is free. Phosphorus, arsenic and antimony are **donors** (n-type). Boron, aluminium, gallium and indium have 3 electrons and grab one from the valence band, leaving a hole: **acceptors** (p-type). An ionised donor is a fixed positive ion, an ionised acceptor a fixed negative ion, so the crystal stays neutral.

With all dopants ionised, charge neutrality reads `$n + N_a = p + N_d$`. Together with `$np = n_i^2$`:

```math
n = \frac{N_d - N_a}{2} + \sqrt{\left(\frac{N_d - N_a}{2}\right)^2 + n_i^2}
```

When the net doping is much larger than `$n_i$`, simply `$n \approx N_d - N_a$` and `$p = n_i^2/n$`. The Fermi level then moves towards the majority band:

```math
E_F - E_i = kT\ln\frac{n}{n_i} \quad (\text{n-type}), \qquad E_i - E_F = kT\ln\frac{p}{n_i} \quad (\text{p-type})
```

**Worked example.** Si with `$N_d = 10^{17}$` cm⁻³ at 300 K (`$n_i = 10^{10}$`).

1. `$n = 10^{17}$` cm⁻³, `$p = 10^{20}/10^{17} = 10^3$` cm⁻³.
2. `$E_F - E_i = 0.02585\ln10^7 = 0.417$` eV above the intrinsic level, about 0.14 eV below `$E_c$`.

Change the doping and temperature below. Watch the occupancy curve slide with `$E_F$`, and watch what heating does to a doped sample.

<figure class="fig" data-fig="fermi-level"><figcaption>The black curve is f(E), with energy up the page. Donors push E<sub>F</sub> up towards the conduction band, acceptors down. Heat a doped sample and n<sub>i</sub> catches up with the doping: E<sub>F</sub> slides back to mid-gap and the sample becomes intrinsic.</figcaption></figure>

<div class="problem" data-problem="fermi-shift"></div>

<div class="myth">

**"An n-type semiconductor is negatively charged."** No. Every free electron came from a donor atom that is now a fixed positive ion, so the crystal is exactly neutral. "n" names the sign of the majority carrier, not of the crystal. A second classic slip goes with it: doping with donors does not just add electrons, it *removes* holes, because `$np = n_i^2$`. An n-type sample has far fewer holes than pure silicon.

</div>

## 5. Carriers in motion: conductivity, mobility, diffusion

In a field `$E$` each carrier picks up an average drift velocity `$v = \mu E$`, where the **mobility** `$\mu$` measures how freely it moves between collisions (Si: electrons 1350, holes 480 cm²/V s). Both carriers add to the current:

```math
\sigma = e(n\mu_n + p\mu_p), \qquad \rho = 1/\sigma
```

**Worked example.** n-type Si with `$N_d = 10^{16}$` cm⁻³ and `$\mu_n = 1200$` cm²/V s: `$\rho = 1/(1.602\times10^{-19}\times10^{16}\times1200) = 0.52$` Ω cm. Pure Si is about `$3\times10^5$` Ω cm: one donor per five million atoms cut the resistivity nearly a million times.

Carriers also spread from crowded to empty regions by **diffusion**, with current `$eD\,dn/dx$`. Drift and diffusion are linked by the **Einstein relation** `$D/\mu = kT/e$` (25.85 mV at 300 K). Extra minority carriers recombine with lifetime `$\tau$` and spread a **diffusion length** `$L = \sqrt{D\tau}$` before they do; these two numbers control every p-n junction in [lesson 7.4](/learn/courses/iit-jam-physics/diodes/).

A surprise for strong students: intrinsic material is not the most resistive. Since `$\mu_n > \mu_p$`, adding a few acceptors removes fast electrons and adds slow holes; the minimum conductivity, `$2en_i\sqrt{\mu_n\mu_p}$`, is reached in slightly p-type material.

## 6. The Hall effect: counting carriers and their sign

Send a current along a bar in a magnetic field `$B$` perpendicular to it. The magnetic force pushes the carriers to one side until the charge piled up there makes a transverse field that balances it. That side voltage is the **Hall voltage**:

```math
V_H = \frac{IB}{nqt}, \qquad R_H = \frac{1}{nq}
```

where `$t$` is the thickness along `$B$`. Electrons and holes are pushed to the *same* side (opposite charge, opposite velocity), so the sign of `$V_H$` reveals the sign of the carriers: `$R_H < 0$` for n-type, `$R_H > 0$` for p-type. With the conductivity it also gives the mobility, `$\mu = |R_H|\sigma$`. Fewer carriers mean a larger Hall voltage, which is why Hall sensors use lightly doped semiconductors rather than metals.

**Worked example.** `$R_H = -5.0\times10^{-4}$` m³/C: electrons, with `$n = 1/(e|R_H|) = 1.25\times10^{22}$` m⁻³ `$= 1.25\times10^{16}$` cm⁻³.

## 7. Temperature: three regimes

Plot `$\ln n$` against `$1/T$` for a doped sample and you see three regions:

1. **Freeze-out** (low `$T$`): electrons are still bound to donors; `$n$` rises with `$T$`, with a slope set by the donor energy `$E_d$`, not the gap.
2. **Extrinsic** (around room temperature): all donors ionised, `$n \approx N_d$`, almost flat. Devices are designed to work here.
3. **Intrinsic** (high `$T$`): `$n_i$` overtakes `$N_d$`; the slope gives `$-E_g/2k$`, and the Fermi level returns to mid-gap.

**Worked example.** An intrinsic sample's resistance falls from 100 Ω at 300 K to 20 Ω at 350 K. With `$\sigma \propto e^{-E_g/2kT}$`: `$E_g = 2k\ln5/(1/300 - 1/350) = 0.58$` eV.

Very heavy doping breaks the simple formulas: when `$E_F$` comes within a few `$kT$` of a band edge or enters it, the material is **degenerate**, the Boltzmann tail fails and it conducts like a poor metal.

To explore further, the [Energy bands](/learn/energy-bands/) tool shows bands of real materials filling as they heat, the [Carrier concentration](/science/carrier-concentration/) calculator solves for `$n$`, `$p$` and `$E_F$` at any doping and temperature, the [Quantum statistics plotter](/science/quantum-statistics/) draws Fermi-Dirac next to Bose-Einstein and Maxwell-Boltzmann, the [Hall effect](/science/hall-effect/) tool turns real Hall measurements into carrier density and mobility, and the [Band structure explorer](/science/band-structure/) shows how gaps open in simple lattice models. To measure a gap from an optical spectrum, use the [Tauc plot](/science/tauc-plot/).

<div class="keypoints">

- Bands from overlapping atomic levels; semiconductors have a small gap (Si 1.12 eV). Holes are missing electrons acting as `$+e$` carriers.
- `$f(E) = 1/(e^{(E-E_F)/kT} + 1)$`, `$f(E_F) = 1/2$`; Boltzmann tail when `$E - E_F \gg kT$`.
- `$n = N_ce^{-(E_c - E_F)/kT}$`, `$p = N_ve^{-(E_F - E_v)/kT}$`, `$np = n_i^2$`, `$n_i \propto T^{3/2}e^{-E_g/2kT}$`.
- Donors (group 15) give n-type, acceptors (group 13) p-type; `$n \approx N_d - N_a$`, `$E_F - E_i = kT\ln(n/n_i)$`.
- `$\sigma = e(n\mu_n + p\mu_p)$`; Einstein `$D = \mu kT/e$`; diffusion length `$\sqrt{D\tau}$`.
- Hall: `$R_H = 1/(nq)$`, sign gives carrier type, `$\mu = |R_H|\sigma$`.
- Heating a doped sample: freeze-out, extrinsic plateau, intrinsic; `$E_F$` returns to mid-gap.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. There are more on the [semiconductors practice page](/learn/courses/iit-jam-physics/practice/semiconductors/).

<div class="qbank" data-bank="physics" data-topics="semiconductors" data-exam="jam" data-n="10"></div>

**Next:** [lesson 7.4](/learn/courses/iit-jam-physics/diodes/) joins p-type and n-type material into a junction, the heart of diodes, LEDs and solar cells. The [GATE Physics course](/learn/courses/gate-physics/) derives the density of states and band structure behind these results.
