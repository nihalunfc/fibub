---
title: 'Ionic equilibrium: acids, bases, pH and buffers'
seoTitle: 'Ionic equilibrium, pH and buffers: JEE and NEET chemistry'
summary: 'Arrhenius, Brønsted-Lowry and Lewis acids, the ionic product of water and pH, strong and weak acids and bases, Ostwald''s dilution law, polyprotic acids, the common ion effect, salt hydrolysis, buffers and the Henderson equation, titration curves and indicators, and solubility product with precipitation.'
minutes: 38
updated: 2026-11-22
quiz:
  - q: 'The pH of 10⁻⁸ M HCl at 25 °C is:'
    choices: ['8', 'About 6.98', '7', '6']
    ans: 1
    why: 'An acid cannot make water basic. Water''s own H⁺ (about 10⁻⁷ M) is now bigger than the acid''s. Solving x(x − 10⁻⁸) = 10⁻¹⁴ gives [H⁺] = 1.05 × 10⁻⁷ M, pH 6.98.'
  - q: 'An aqueous solution of sodium acetate is:'
    choices: ['Acidic', 'Neutral', 'Basic', 'Acidic or basic depending on concentration']
    ans: 2
    why: 'Acetate is the conjugate base of a weak acid, so it takes H⁺ from water and leaves OH⁻: CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻.'
  - q: 'The solubility of AgCl in 0.1 M NaCl compared with pure water is:'
    choices: ['Higher', 'Lower', 'The same', 'Zero']
    ans: 1
    why: 'Common ion effect: the Cl⁻ already present means far less AgCl can dissolve before [Ag⁺][Cl⁻] reaches Ksp.'
sources:
  - 'IUPAC Gold Book: pH, ionic product of water, solubility product https://goldbook.iupac.org'
  - 'Acid dissociation constants and solubility products: CRC Handbook of Chemistry and Physics, Dissociation constants of organic acids and bases; Solubility product constants'
  - 'NEET (UG) and JEE Main / JEE Advanced 2026 syllabi: Equilibrium (ionic equilibrium part)'
---

**Chemistry · Class 11 · about 38 minutes.** By the end you will be able to find the pH of any acid, base, salt or buffer solution, choose an indicator for a titration, and decide from Ksp whether a precipitate forms.

<div class="bigidea">Acids give H⁺ and bases take it. Water itself always keeps [H⁺][OH⁻] = 10⁻¹⁴ at 25 °C, so knowing one tells you the other. Weak acids, salts, buffers and sparingly soluble solids are all equilibria, so the same K-expression method from chemical equilibrium solves every one of them.</div>

## 1. Three ideas of acids and bases

- **Arrhenius**: an acid gives H⁺ in water, a base gives OH⁻. Works only in water.
- **Brønsted-Lowry**: an acid **donates a proton**, a base **accepts** one. Every acid has a **conjugate base** (HCl and Cl⁻; NH₄⁺ and NH₃). The stronger the acid, the weaker its conjugate base. **Amphiprotic** species can do both: H₂O, HCO₃⁻, HSO₄⁻.
- **Lewis**: an acid **accepts an electron pair**, a base **donates** one. BF₃, AlCl₃ and metal ions like Fe³⁺ are Lewis acids; NH₃ and OH⁻ are Lewis bases.

## 2. Water, pH and strong acids

Water ionises slightly: H₂O ⇌ H⁺ + OH⁻, with **K<sub>w</sub> = [H⁺][OH⁻] = 1.0 × 10⁻¹⁴** at 25 °C. **pH = −log[H⁺]**, pOH = −log[OH⁻], and **pH + pOH = 14** at 25 °C. K<sub>w</sub> rises with temperature (the ionisation is endothermic), so pure water at 60 °C has a pH below 7 yet is still neutral, because [H⁺] = [OH⁻].

A **strong acid** ionises completely: [H⁺] = C × (number of H⁺ per molecule). 0.01 M HCl has pH 2; 0.005 M H₂SO₄ also pH 2. For very dilute acids (below about 10⁻⁶ M), add water's own H⁺: solve x(x − C) = K<sub>w</sub>.

## 3. Weak acids and bases

A **weak acid** ionises only partly: HA ⇌ H⁺ + A⁻ with K<sub>a</sub> = [H⁺][A⁻]/[HA]. If C is the concentration and α the fraction ionised, K<sub>a</sub> = Cα²/(1 − α) ≈ Cα² when α is small. So:

```math
\alpha = \sqrt{\frac{K_a}{C}} \qquad [\mathrm{H^+}] = \sqrt{K_a C} \qquad \mathrm{pH} = \tfrac12(\mathrm{p}K_a - \log C)
```

This is **Ostwald's dilution law**: dilute a weak acid and it ionises more (α grows), though [H⁺] still falls. Weak bases work the same way with K<sub>b</sub> and [OH⁻]. For a conjugate pair, **K<sub>a</sub> × K<sub>b</sub> = K<sub>w</sub>** (pK<sub>a</sub> + pK<sub>b</sub> = 14).

<div class="meaning">
<dl>
<dt>K<sub>a</sub>, K<sub>b</sub></dt><dd>ionisation constants of a weak acid and a weak base; pK = −log K, so a smaller pK<sub>a</sub> means a stronger acid</dd>
<dt>C, α</dt><dd>concentration (mol/L) and degree of ionisation</dd>
<dt>K<sub>w</sub></dt><dd>ionic product of water, 1.0 × 10⁻¹⁴ at 25 °C</dd>
<dt>K<sub>sp</sub>, s</dt><dd>solubility product and molar solubility of a sparingly soluble salt</dd>
<dt>Physical meaning</dt><dd>pH is a count of powers of ten: each step of 1 is a tenfold change in [H⁺]. Lemon juice (pH 2) has 100 000 times more H⁺ than pure water.</dd>
</dl>
</div>

<div class="problem" data-problem="ie-weak-acid-ph"></div>

**Polyprotic acids** (H₂S, H₂CO₃, H₃PO₄) lose protons one at a time, with K<sub>a1</sub> much bigger than K<sub>a2</sub>. The pH comes almost entirely from the first step, and for H₂A the concentration of A²⁻ is about K<sub>a2</sub>.

## 4. The common ion effect

Adding an ion that is already part of an equilibrium pushes it back (Le Chatelier). Sodium acetate added to acetic acid lowers its ionisation: [H⁺] = K<sub>a</sub> × [acid]/[salt]. The same effect lowers the solubility of salts (section 8) and is used in group analysis: H₂S in acid gives so little S²⁻ that only the least soluble sulfides precipitate.

## 5. Salt hydrolysis

The ions of a salt can react with water. The ion from a strong acid or strong base does nothing; the ion from a weak partner does.

| Salt from | Example | Solution | pH at 25 °C |
|---|---|---|---|
| Strong acid + strong base | NaCl | neutral | 7 |
| Weak acid + strong base | CH₃COONa | basic | 7 + ½pK<sub>a</sub> + ½log C |
| Strong acid + weak base | NH₄Cl | acidic | 7 − ½pK<sub>b</sub> − ½log C |
| Weak acid + weak base | CH₃COONH₄ | depends on K<sub>a</sub> and K<sub>b</sub> | 7 + ½pK<sub>a</sub> − ½pK<sub>b</sub> (no C) |

## 6. Buffers

A **buffer** resists change in pH when a little acid or base is added. It is a weak acid with its salt (acetic acid + sodium acetate) or a weak base with its salt (NH₃ + NH₄Cl). Added H⁺ is eaten by the conjugate base; added OH⁻ by the weak acid. The **Henderson equation**:

```math
\mathrm{pH} = \mathrm{p}K_a + \log\frac{[\text{salt}]}{[\text{acid}]} \qquad \mathrm{pOH} = \mathrm{p}K_b + \log\frac{[\text{salt}]}{[\text{base}]}
```

A buffer works best (highest **buffer capacity**) when salt and acid are equal (pH = pK<sub>a</sub>), and usefully within pK<sub>a</sub> ± 1. Blood is buffered near pH 7.4 by H₂CO₃ and HCO₃⁻.

<div class="problem" data-problem="ie-buffer-ph"></div>

## 7. Titration curves and indicators

During a titration the pH changes slowly at first, then **jumps** near the equivalence point. For a strong acid with a strong base the jump runs from about pH 4 to 10 and the equivalence pH is 7. For a weak acid with a strong base, the curve starts higher, passes pH = pK<sub>a</sub> at half-neutralisation, and the equivalence pH is above 7 (the salt hydrolyses). An **indicator** is itself a weak acid whose two forms have different colours; it changes over about pK<sub>In</sub> ± 1. Pick one whose range sits inside the jump: **phenolphthalein** (8.3 to 10) for weak acid with strong base, **methyl orange** (3.1 to 4.4) for strong acid with weak base. A weak acid with a weak base has no sharp jump.

<figure class="fig" data-fig="titration-curve"><figcaption>25 mL of 0.1 M acid titrated with 0.1 M NaOH, worked out exactly at every point. Switch between a strong and a weak acid and change pK<sub>a</sub>: watch the start, the half-neutralisation point (pH = pK<sub>a</sub>), the equivalence pH and which indicator band lies on the jump.</figcaption></figure>

## 8. Solubility product and precipitation

A sparingly soluble salt in contact with its saturated solution sets up AₓBᵧ(s) ⇌ xA^(y+) + yB^(x−), with **K<sub>sp</sub> = [A]ˣ[B]ʸ**. If s mol/L dissolves: AgCl K<sub>sp</sub> = s², CaF₂ 4s³, Ag₂CrO₄ 4s³, Al(OH)₃ 27s⁴, Ca₃(PO₄)₂ 108s⁵.

<div class="problem" data-problem="ie-ksp"></div>

- **Precipitation** happens when the ionic product Q<sub>sp</sub> (using current concentrations, after mixing) exceeds K<sub>sp</sub>.
- **Common ion**: in 0.1 M NaCl, the solubility of AgCl falls to K<sub>sp</sub>/0.1.
- **Selective precipitation**: when a reagent is added slowly to a mixture, the salt needing the smaller concentration of reagent to reach its K<sub>sp</sub> comes out first.
- Salts of weak acids (CaCO₃, metal hydroxides, sulfides) dissolve better in acid, because the acid removes the anion.

<div class="myth">

**"A smaller Ksp always means a less soluble salt."** Only for salts of the same type. AgCl (K<sub>sp</sub> 1.8 × 10⁻¹⁰, s = 1.3 × 10⁻⁵ M) is less soluble than Ag₂CrO₄ (K<sub>sp</sub> 1.1 × 10⁻¹², s = 6.5 × 10⁻⁵ M), though its K<sub>sp</sub> is larger. Convert to s before comparing.

</div>

<div class="myth">

**"Diluting a weak acid makes it weaker."** Dilution lowers [H⁺] (pH rises), but the acid ionises a larger fraction (α = √(K<sub>a</sub>/C) grows). K<sub>a</sub>, the true measure of strength, is unchanged.

</div>

<div class="keypoints">

- Brønsted: proton donor and acceptor; strong acid, weak conjugate base. Lewis: electron pair acceptor.
- K<sub>w</sub> = 10⁻¹⁴ at 25 °C; pH + pOH = 14; very dilute acid: include water's H⁺.
- Weak acid: [H⁺] = √(K<sub>a</sub>C), α = √(K<sub>a</sub>/C); K<sub>a</sub>K<sub>b</sub> = K<sub>w</sub>.
- Salt of weak acid + strong base is basic; weak acid + weak base pH does not depend on C.
- Buffer: pH = pK<sub>a</sub> + log(salt/acid); best at pH = pK<sub>a</sub>.
- Indicator range inside the jump: phenolphthalein for weak acid, methyl orange for weak base.
- K<sub>sp</sub> = s², 4s³, 27s⁴, 108s⁵; precipitate when Q<sub>sp</sub> &gt; K<sub>sp</sub>; common ion lowers solubility.

</div>
