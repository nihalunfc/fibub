---
title: Kinetic theory of gases
seoTitle: 'Kinetic theory of gases: JEE and NEET physics'
summary: 'The ideal gas equation and gas laws, Dalton''s law and mixtures, the kinetic theory assumptions, pressure from molecular motion, temperature as average kinetic energy, rms, average and most probable speeds, the Maxwell distribution, degrees of freedom and equipartition, specific heats, mean free path and real gases.'
minutes: 32
updated: 2026-11-22
quiz:
  - q: 'Hydrogen and oxygen are at the same temperature. Compared with oxygen molecules, hydrogen molecules have:'
    choices: ['the same rms speed', 'the same average kinetic energy and 4 times the rms speed', '16 times the kinetic energy', 'a quarter of the rms speed']
    ans: 1
    why: 'Average translational kinetic energy (3/2)kT depends only on temperature. v_rms ∝ 1/√M, and M(O₂)/M(H₂) = 16, so hydrogen is 4 times faster.'
  - q: 'At what temperature does the rms speed of a gas become double its value at 27 °C?'
    choices: ['54 °C', '108 °C', '927 °C', '1200 °C']
    ans: 2
    why: 'v_rms ∝ √T. Doubling it needs 4 × 300 K = 1200 K, which is 927 °C.'
  - q: 'The mean free path of molecules in a gas at fixed temperature, when the pressure is halved:'
    choices: ['halves', 'doubles', 'stays the same', 'becomes four times']
    ans: 1
    why: 'λ = kT/(√2 π d² P). Halving P halves the number of molecules per volume, so a molecule travels twice as far between collisions.'
sources:
  - 'National Medical Commission NEET (UG) syllabus and JEE Main / JEE Advanced 2026 syllabi: Kinetic theory of gases'
  - 'Boltzmann constant k = 1.380 649 × 10⁻²³ J/K and Avogadro constant N_A = 6.022 140 76 × 10²³ mol⁻¹ (both exact in the 2019 SI), BIPM SI Brochure, 9th edition https://www.bipm.org/en/publications/si-brochure'
---

**Physics · Class 11 · about 32 minutes.** By the end you will be able to use the gas equation and Dalton's law, explain pressure and temperature from molecular motion, calculate molecular speeds and energies, use equipartition to get specific heats, and find the mean free path.

<div class="bigidea">A gas is a crowd of tiny molecules flying in straight lines and bouncing off each other and the walls. Pressure is the push of those bounces, and temperature is a measure of how much kinetic energy each molecule carries on average. Everything about an ideal gas follows from that picture.</div>

## 1. The ideal gas equation and the gas laws

```math
PV = nRT = Nk_BT
```

n is the number of moles, N the number of molecules, R = 8.314 J/mol K, and k_B = R/N_A = 1.38 × 10⁻²³ J/K (Boltzmann's constant). T is always in kelvin. One mole of any ideal gas fills 22.4 L at 0 °C and 1 atm.

| Law | Held constant | Statement |
|---|---|---|
| Boyle | T, n | PV = constant |
| Charles | P, n | V ∝ T |
| Gay-Lussac | V, n | P ∝ T |
| Avogadro | P, T | equal volumes hold equal numbers of molecules |

- **Density form:** `$P = \dfrac{\rho RT}{M}$`, so at fixed P and T, density ∝ molar mass.
- **Dalton's law:** in a mixture, each gas pushes as if it were alone (its **partial pressure**), and the total pressure is the sum: `$P = P_1 + P_2 + \dots$`.
- **Connected vessels:** when a valve opens, the total number of moles is shared; at a common temperature `$P(V_1 + V_2) = P_1V_1 + P_2V_2$`.

## 2. The kinetic theory model

Assumptions: molecules are tiny compared with the gaps between them; they move randomly; their collisions are perfectly elastic; there are no forces between them except during collisions; and collisions last a negligible time.

**Pressure from molecules.** Each bounce off a wall gives it a momentum 2mvₓ. Adding up all the bounces per second per unit area gives

```math
P = \frac13\,\rho\,\overline{v^2} = \frac13\,\frac{N}{V}\,m\,\overline{v^2}
```

Compare with PV = Nk_BT and you get the key link:

```math
\tfrac12 m\overline{v^2} = \tfrac32 k_B T
```

<div class="meaning">
<dl>
<dt>m</dt><dd>mass of one molecule; M = molar mass in kg/mol</dd>
<dt>v̄²</dt><dd>average of the squares of the molecular speeds</dd>
<dt>k_B</dt><dd>Boltzmann's constant, the gas constant per molecule</dd>
<dt>T</dt><dd>absolute temperature in kelvin</dd>
<dt>Physical meaning</dt><dd>Temperature is the average kinetic energy of a molecule in disguise. At the same temperature, a heavy molecule moves slowly and a light one moves fast, but they carry the same energy on average.</dd>
</dl>
</div>

So pressure is `$\tfrac23$` of the translational kinetic energy per unit volume: `$P = \tfrac23 E/V$`.

<div class="myth">

**"At absolute zero, a gas would have zero pressure because its molecules stop."** Real gases liquefy and solidify long before 0 K, and quantum effects mean motion never stops entirely. The ideal gas model simply stops applying near absolute zero.

</div>

## 3. Molecular speeds and the Maxwell distribution

Molecules do not all move at one speed. The Maxwell distribution gives the fraction at each speed. Three typical speeds:

```math
v_p = \sqrt{\frac{2RT}{M}}, \qquad \bar v = \sqrt{\frac{8RT}{\pi M}}, \qquad v_{rms} = \sqrt{\frac{3RT}{M}} = \sqrt{\frac{3P}{\rho}}
```

They are always in the order `$v_p < \bar v < v_{rms}$`, in the ratio 1 : 1.13 : 1.22. Change the gas and temperature below.

<figure class="fig" data-fig="kt-maxwell"><figcaption>The Maxwell speed distribution. Heating the gas or using a lighter gas spreads the curve to higher speeds and flattens it; the area under it stays equal to 1 (all the molecules).</figcaption></figure>

<div class="problem" data-problem="kt-rms-speed"></div>

- v_rms ∝ √(T/M). Light gases at the top of the atmosphere have a fast tail that exceeds escape speed, which is why the Earth has lost almost all its free hydrogen and helium.
- **Graham's law:** gases leak through tiny holes (effuse) at rates ∝ 1/√M. This separated uranium isotopes.
- The speed of sound in a gas, `$\sqrt{\gamma RT/M}$`, is a little less than v_rms: `$v_{sound}/v_{rms} = \sqrt{\gamma/3}$`.

## 4. Degrees of freedom and equipartition

A **degree of freedom** is an independent way a molecule can hold energy. **Equipartition:** in equilibrium, each degree of freedom holds on average `$\tfrac12 k_BT$` per molecule (`$\tfrac12RT$` per mole).

| Molecule | Translational | Rotational | Total f (no vibration) |
|---|---|---|---|
| Monatomic (He, Ne) | 3 | 0 | 3 |
| Diatomic (O₂, N₂) or linear (CO₂) | 3 | 2 | 5 |
| Non-linear (H₂O, CH₄) | 3 | 3 | 6 |

Each vibration mode adds 2 (kinetic and potential), but vibrations wake up only at high temperatures. Internal energy of n moles: `$U = \tfrac f2 nRT$`. Then `$C_v = \tfrac f2R$`, `$C_p = C_v + R$` and `$\gamma = 1 + \tfrac2f$`.

<div class="problem" data-problem="kt-mixture-energy"></div>

## 5. Mean free path

A molecule of diameter d travels on average a distance

```math
\lambda = \frac{1}{\sqrt2\,\pi d^2 n_V} = \frac{k_BT}{\sqrt2\,\pi d^2 P}
```

between collisions, where n_V = N/V is the number of molecules per unit volume. In air at room conditions it is about 70 nm, a few hundred molecule widths. The √2 comes from the motion of the other molecules. Collision frequency = `$\bar v/\lambda$`, a few billion per second.

<div class="problem" data-problem="kt-mean-free-path"></div>

<div class="myth">

**"If molecules move at 500 m/s, a smell should cross a room instantly."** Each molecule collides billions of times a second and changes direction each time. It wanders in a zig-zag, so a smell spreads by slow diffusion (and air currents), not at molecular speed.

</div>

## 6. Real gases

Real gases follow PV = nRT well at low pressure and high temperature. At high pressure the molecules' own volume matters, and at low temperature their attraction matters. The **van der Waals equation** corrects for both:

```math
\left(P + \frac{an^2}{V^2}\right)(V - nb) = nRT
```

a measures attraction (it lowers the pressure on the walls) and b the volume the molecules themselves take up.

<div class="keypoints">

- PV = nRT = Nk_BT; P = ρRT/M; Dalton: total pressure = sum of partial pressures.
- P = ⅓ρv̄² = ⅔ (kinetic energy per volume); ½mv̄² = (3/2)k_BT.
- v_p : v̄ : v_rms = √2 : √(8/π) : √3 = 1 : 1.13 : 1.22; all ∝ √(T/M).
- Same T: same average kinetic energy for every gas; lighter molecules move faster.
- Equipartition: ½k_BT per degree of freedom; f = 3, 5, 6; U = (f/2)nRT; γ = 1 + 2/f.
- Mean free path λ = k_BT/(√2πd²P); halving P doubles λ.
- Real gases: van der Waals (P + an²/V²)(V − nb) = nRT.

</div>
