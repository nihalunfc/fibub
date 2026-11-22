---
title: 'Semiconductor electronics'
seoTitle: 'Semiconductor electronics: JEE and NEET physics'
summary: 'Energy bands in conductors, insulators and semiconductors, intrinsic and extrinsic semiconductors with carrier concentrations and conductivity, the p-n junction and its depletion layer, diode characteristics and circuits, half-wave and full-wave rectifiers with filters, Zener regulators, LEDs, photodiodes and solar cells, and logic gates with Boolean algebra.'
minutes: 32
updated: 2026-11-22
quiz:
  - q: 'Adding a small amount of a pentavalent impurity (like phosphorus) to silicon makes it:'
    choices: ['p-type, with holes as majority carriers', 'n-type, with electrons as majority carriers', 'an insulator', 'intrinsic']
    ans: 1
    why: 'Phosphorus has five outer electrons; four bond with silicon and the fifth is nearly free. The donor atoms make electrons the majority carriers. The crystal stays electrically neutral.'
  - q: 'The resistance of a semiconductor as its temperature rises:'
    choices: ['rises', 'falls', 'stays the same', 'first rises then falls always']
    ans: 1
    why: 'More electrons gain enough energy to jump the band gap, so the number of carriers grows quickly and the resistance falls (negative temperature coefficient).'
  - q: 'Which gate gives output 1 only when both inputs are 0?'
    choices: ['AND', 'OR', 'NOR', 'NAND']
    ans: 2
    why: 'NOR is NOT-OR: OR gives 0 only for inputs 0, 0, so NOR gives 1 only then.'
sources:
  - 'National Medical Commission NEET (UG) syllabus and JEE Main / JEE Advanced 2026 syllabi: Electronic devices'
  - 'Band gaps (silicon 1.1 eV, germanium 0.7 eV) and intrinsic carrier concentration of silicon: Ioffe Institute semiconductor database https://www.ioffe.ru/SVA/NSM/Semicond/'
---

**Physics · Class 12 · about 32 minutes.** By the end you will be able to explain why semiconductors conduct, find carrier concentrations and conductivity, solve diode, rectifier and Zener circuits, choose the right special diode, and simplify logic gate circuits.

<div class="bigidea">A semiconductor is an insulator with a small enough energy gap that heat, light or a sprinkle of impurity atoms can free a few charge carriers. Put p-type and n-type material together and the junction lets current through one way only. Every chip, LED and solar panel starts from that.</div>

## 1. Energy bands

In a solid, the energy levels of the atoms spread into **bands**. The highest filled band is the **valence band**, the next empty one the **conduction band**, and between them lies the **band gap** E_g.

| Material | Band gap | Conducts? |
|---|---|---|
| Metal | bands overlap, no gap | yes, very well |
| Semiconductor | small, about 1 eV (Si 1.1 eV, Ge 0.7 eV) | a little, more when hot or doped |
| Insulator | large, over 3 eV (diamond about 5.5 eV) | hardly at all |

When an electron jumps to the conduction band, it leaves behind a **hole**, an empty place in a bond that behaves like a positive charge. In a field, neighbouring electrons hop into the hole, so the hole drifts along with the field.

## 2. Intrinsic and extrinsic semiconductors

In pure (**intrinsic**) silicon, every freed electron leaves a hole: n_e = n_h = n_i. At 300 K, n_i for silicon is about 1.5 × 10¹⁶ m⁻³, tiny compared with about 5 × 10²⁸ atoms per m³.

**Doping** adds impurity atoms, a few per million:

- **n-type:** pentavalent donors (P, As, Sb) give spare electrons. Electrons are the majority carriers.
- **p-type:** trivalent acceptors (B, Al, Ga, In) leave holes. Holes are the majority carriers.

Doped crystals stay **electrically neutral**. In equilibrium the **law of mass action** holds: `$n_e\,n_h = n_i^2$`. More donors mean fewer holes. Conductivity:

```math
\sigma = e\,(n_e\mu_e + n_h\mu_h)
```

<div class="meaning">
<dl>
<dt>n_e, n_h</dt><dd>number of free electrons and holes per m³</dd>
<dt>n_i</dt><dd>intrinsic carrier concentration, set by the material and temperature</dd>
<dt>μ_e, μ_h</dt><dd>mobilities (m²/(V s)); electrons are more mobile than holes</dd>
<dt>E_g</dt><dd>band gap: the least energy to free an electron from a bond</dd>
<dt>Physical meaning</dt><dd>Doping adds carriers of one sign and, by the law of mass action, takes away carriers of the other, so one type dominates the current.</dd>
</dl>
</div>

<div class="problem" data-problem="sc-holes"></div>

<div class="problem" data-problem="sc-conductivity"></div>

<div class="myth">

**"An n-type semiconductor is negatively charged."** It is neutral. Each donor atom that gives away an electron becomes a fixed positive ion. The free electrons and the ions balance exactly.

</div>

## 3. The p-n junction

Join p-type and n-type material. Electrons diffuse from n to p and holes from p to n, and recombine near the boundary. This leaves a thin **depletion layer** with no free carriers, fixed positive ions on the n side and negative ions on the p side. Their field sets up a **barrier potential** (about 0.7 V for Si, 0.3 V for Ge) that stops further diffusion.

- **Forward bias** (p to +, n to −): the barrier drops, the depletion layer narrows, and once the applied voltage passes the knee (about 0.7 V for Si) the current rises steeply.
- **Reverse bias:** the barrier rises, the layer widens, and only a tiny current of minority carriers flows (microamperes), until **breakdown** at a large reverse voltage.

In circuits, treat an ideal diode as a closed switch when forward biased and an open switch when reverse biased. Check each diode's direction first.

## 4. Rectifiers

A **half-wave** rectifier (one diode) passes only one half of each cycle: average output `$V_m/\pi$`, ripple frequency equal to the supply's (50 Hz). A **full-wave** rectifier (two diodes with a centre-tapped transformer, or four in a bridge) passes both halves, one flipped: average `$2V_m/\pi$`, ripple frequency 100 Hz. A capacitor across the load smooths the output; the ripple is roughly `$\dfrac{V_m}{fRC}$` for half-wave and half that for full-wave.

<figure class="fig" data-fig="rectifier-wave"><figcaption>Input (dashed) and output (solid) of a rectifier on 50 Hz AC. Half-wave keeps alternate halves; full-wave flips the negative halves up; a capacitor fills in the gaps and leaves a small ripple, smaller for a larger RC.</figcaption></figure>

## 5. Special diodes

- **Zener diode:** heavily doped, designed to work in reverse breakdown, where the voltage stays almost fixed at V_z over a wide range of current. Used as a **voltage regulator**: series resistor R, Zener across the load. Current in R = (V_s − V_z)/R; load takes V_z/R_L; the Zener takes the rest.
- **LED:** forward biased; electrons dropping across the gap give out photons of energy about E_g, so the gap sets the colour (E = 1240/λ). Needs a direct band gap (GaAs, GaN, not Si).
- **Photodiode:** reverse biased; light frees extra carriers, so the reverse current rises with light intensity. Light must have hν > E_g.
- **Solar cell:** no bias; light makes an emf across the junction. Its I-V curve lies in the fourth quadrant. Best band gap about 1.5 eV to match sunlight.

<div class="problem" data-problem="sc-zener"></div>

## 6. Logic gates

| Gate | Output Y | Truth rule |
|---|---|---|
| NOT | `$\bar A$` | flips the input |
| OR | A + B | 1 if any input is 1 |
| AND | A · B | 1 only if all inputs are 1 |
| NAND | `$\overline{A\cdot B}$` | 0 only if all inputs are 1 |
| NOR | `$\overline{A + B}$` | 1 only if all inputs are 0 |
| XOR | `$A\bar B + \bar AB$` | 1 if the inputs differ |

NAND and NOR are **universal gates**: any circuit can be built from either alone. NOT from NAND: join both inputs. AND from NAND: NAND followed by NOT. **De Morgan's theorems** simplify circuits: `$\overline{A + B} = \bar A\cdot\bar B$` and `$\overline{A\cdot B} = \bar A + \bar B$`.

**Worked example (level 3).** Two NOT gates feed a NAND gate, with inputs A and B. Output = `$\overline{\bar A\cdot\bar B} = A + B$` (De Morgan): the circuit is an **OR gate**.

<div class="keypoints">

- Bands: metals overlap; semiconductors about 1 eV gap; insulators over 3 eV.
- Intrinsic n_e = n_h = n_i; mass action n_e n_h = n_i²; σ = e(n_eμ_e + n_hμ_h).
- n-type: pentavalent donors, electrons majority; p-type: trivalent acceptors, holes majority; both neutral.
- Depletion layer and barrier (Si 0.7 V); forward bias conducts, reverse bias blocks until breakdown.
- Half-wave average V_m/π at 50 Hz ripple; full-wave 2V_m/π at 100 Hz; capacitor smooths.
- Zener regulates in reverse breakdown; LED colour from E_g; photodiode reverse biased; solar cell unbiased.
- NAND and NOR are universal; De Morgan turns NOT-inputs into the other gate.

</div>
