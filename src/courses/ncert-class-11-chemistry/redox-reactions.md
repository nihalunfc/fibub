---
title: Redox Reactions
seoTitle: 'Redox Reactions Class 11 notes: oxidation number, balancing'
summary: 'Class 11 Redox Reactions with animations: electron transfer, oxidation numbers, redox types, balancing by two methods, electrode processes, titration.'
minutes: 85
updated: 2026-11-23
quiz:
  - q: 'What is the oxidation number of Cr in K₂Cr₂O₇?'
    choices: ['+6', '+7', '+3', '+12']
    ans: 0
    why: 'K is +1 (2 atoms = +2), O is −2 (7 atoms = −14). For a neutral compound 2 + 2x − 14 = 0, so 2x = 12 and x = +6 for each Cr.'
  - q: 'In Cl₂ + 2OH⁻ → Cl⁻ + ClO⁻ + H₂O, chlorine is:'
    choices: ['both oxidised and reduced', 'only oxidised', 'only reduced', 'neither oxidised nor reduced']
    ans: 0
    why: 'Cl goes from 0 to −1 (reduced) and from 0 to +1 (oxidised). One element going up and down in the same reaction is disproportionation.'
  - q: 'In MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O, the oxidising agent is:'
    choices: ['MnO₄⁻', 'Fe²⁺', 'H⁺', 'H₂O']
    ans: 0
    why: 'Mn goes from +7 to +2, so MnO₄⁻ gains electrons and is reduced. The substance that is reduced is the oxidising agent.'
sources:
  - 'NCERT Class 11 Chemistry, Chapter 7 “Redox Reactions” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Standard electrode potentials at 298 K: CRC Handbook of Chemistry and Physics, 97th edition, “Electrochemical series”'
  - 'IUPAC Gold Book, “oxidation state” and “redox reaction” (definitions)'
---

**Chemistry · Class 11 · Chapter 7 · about 85 minutes.** By the end you will be able to find the oxidation number of any atom, say what is oxidised and what is reduced, name the type of a redox reaction, balance a redox equation by two methods, and use the electrochemical series and a titration.

<div class="bigidea">Rusting iron, a burning match, the battery in your phone, your own breathing: all of them are electrons moving from one substance to another. The substance that gives electrons is <b>oxidised</b>, the one that takes them is <b>reduced</b>, and the two always happen together. Oxidation numbers are a bookkeeping system that lets you follow those electrons even when they are only shared, not fully moved.</div>

## 1. From oxygen to electrons: what oxidation and reduction mean

Long ago, chemists called a reaction **oxidation** when a substance gained oxygen (magnesium burning to MgO) or lost hydrogen, and **reduction** when it lost oxygen or gained hydrogen. That idea works for many reactions but fails for 2Na + Cl₂ → 2NaCl, where no oxygen or hydrogen appears at all. The modern idea is about **electrons**:

- **Oxidation** = loss of electrons (oxidation number goes **up**).
- **Reduction** = gain of electrons (oxidation number goes **down**).
- **Oxidising agent** (oxidant) = the substance that is reduced; it takes electrons from another substance.
- **Reducing agent** (reductant) = the substance that is oxidised; it gives electrons.

Memory aid: **OIL RIG**: Oxidation Is Loss, Reduction Is Gain. Another way: the reducing agent *loses* (it sacrifices itself), the oxidising agent *gains*.

Think of a cricket team handing over a trophy: one captain gives it away and the other receives it. It cannot be given unless someone takes it, so oxidation and reduction are a pair, together called a **redox reaction**.

When zinc is placed in copper sulphate solution, blue colour fades and red copper deposits on the strip. Zn → Zn²⁺ + 2e⁻ (oxidation) and Cu²⁺ + 2e⁻ → Cu (reduction). Try every pair of metals and solutions below: the reaction runs only when the metal is higher in the reactivity series than the one in solution.

<figure class="fig" data-fig="c11c-redox-transfer"><figcaption>Electrons jump from the metal strip to the metal ion in solution. Pick a strip and a solution. Zn into Cu²⁺ works, Cu into Zn²⁺ does not. The ladder shows the standard potentials that decide it.</figcaption></figure>

Each half of the reaction on its own is a **half-reaction**; the two added together (so the electrons cancel) give the **overall redox equation**.

<div class="myth">

**“Oxidation always means adding oxygen.”** That was the old idea. In H₂ + Cl₂ → 2HCl no oxygen is involved, yet H is oxidised (0 → +1) and Cl is reduced (0 → −1). Always check electrons, or oxidation numbers.

</div>

## 2. Oxidation number

Electrons are not always cleanly handed over: in HCl they are shared, only unequally. The **oxidation number** (oxidation state) of an atom is the charge it would have if every bond were broken and both shared electrons given to the more electronegative atom. It is a bookkeeping device, not a measured charge.

**The rules, in order of priority:**

1. An atom in its **free (uncombined) form** is 0 (Na, O₂, P₄, S₈, Cu).
2. A **simple ion** has an oxidation number equal to its charge (Na⁺ = +1, Cl⁻ = −1, Fe³⁺ = +3).
3. **Fluorine is always −1** in compounds.
4. **Oxygen is −2** in most compounds, but −1 in peroxides (H₂O₂, Na₂O₂), −½ in superoxides (KO₂) and +2 in OF₂.
5. **Hydrogen is +1** with non-metals and **−1** in metal hydrides (NaH, CaH₂).
6. **Group 1 metals are +1, group 2 metals are +2**; aluminium is +3.
7. The **sum** of all oxidation numbers equals the charge on the species: 0 for a neutral molecule, the ion’s charge for an ion.

```math
\sum (\text{oxidation numbers}) = \text{charge on the species}
```

<figure class="fig" data-fig="c11c-redox-oxnum"><figcaption>Each atom’s total oxidation number is a bar. Right is positive, left is negative. The bars always add up to the charge on the species. Try Fe₃O₄ and S₄O₆²⁻: their answers are averages, not whole numbers.</figcaption></figure>

<div class="meaning">

<dl>
<dt>Oxidation number</dt><dd>charge an atom would have if the shared electrons went to the more electronegative atom</dd>
<dt>Fractional values</dt><dd>an average. In Fe₃O₄ the real states are two Fe³⁺ and one Fe²⁺ (average +8/3). In S₄O₆²⁻ two S are 0 and two are +5 (average +2.5)</dd>
<dt>Oxidation number ≠ valency</dt><dd>valency counts bonds and is never negative or fractional; carbon is +4, 0, −4 and so on across organic compounds but always has valency 4</dd>
<dt>Physical meaning</dt><dd>a running score of the electrons. If the score of an atom rises, it has lost electron share; if it falls, it has gained</dd>
</dl>

</div>

Worked example: oxidation number of S in H₂SO₄. H is +1 (two atoms = +2), O is −2 (four atoms = −8). `$2 + x - 8 = 0$` so `$x = +6$`.

<div class="problem" data-problem="c11c-redox-oxnum"></div>

The tool below finds the oxidation numbers of any formula you type and shows the working:

<!--fig:tool oxidation-number-->

<div class="myth">

**“Oxidation number is the real charge on the atom.”** Only for simple ions. In CO₂ carbon is +4, but the molecule is neutral and carbon does not carry a charge of +4. The number is a counting rule, so fractional numbers such as +8/3 are allowed.

</div>

### How many electrons move?

If an atom changes from oxidation number a to b, it transfers `$|b-a|$` electrons per atom. A dichromate ion Cr₂O₇²⁻ has two Cr atoms, each going +6 → +3, so it takes `$2 \times 3 = 6$` electrons.

<div class="problem" data-problem="c11c-redox-electrons"></div>

## 3. Types of redox reactions

The ladder below shows how high or low an oxidation number can go for an element. The top rung can only be reduced, the bottom rung only oxidised, and a rung in the middle can go either way.

<figure class="fig" data-fig="c11c-redox-ladder"><figcaption>Oxidation states of chlorine, sulphur, nitrogen and manganese. Tap a rung. The arrows show whether that species can lose electrons (up), gain them (down), or both. Species in the middle, like Cl₂ and Mn²⁺ in a mixed case, can disproportionate.</figcaption></figure>

The four types in NCERT:

1. **Combination:** A + B → AB. Redox if at least one is an element: 2Mg + O₂ → 2MgO; C + O₂ → CO₂.
2. **Decomposition:** AB → A + B. Redox if one product is an element: 2HgO → 2Hg + O₂. (CaCO₃ → CaO + CO₂ is **not** redox.)
3. **Displacement:** X + YZ → XZ + Y. Metal displacement (Zn + CuSO₄) and non-metal displacement (Cl₂ + 2KBr → 2KCl + Br₂: chlorine, higher in the halogen series, takes electrons from Br⁻).
4. **Disproportionation:** one element in one oxidation state is both oxidised and reduced: 2H₂O₂ → 2H₂O + O₂ (O: −1 → −2 and 0); Cl₂ + 2OH⁻ → Cl⁻ + ClO⁻ + H₂O. It needs an element in an *intermediate* oxidation state.

A reaction in which two species of the same element in different oxidation states form a single state is **comproportionation** (the reverse), for example 2H₂S + SO₂ → 3S + 2H₂O.

<figure class="fig" data-fig="c11c-redox-types"><figcaption>Arrows on an oxidation-number line. Up is oxidation, down is reduction. Disproportionation has one arrow up and one down from the same starting point. A double decomposition such as AgNO₃ + NaCl has no arrows at all.</figcaption></figure>

Sort your own reactions here:

<!--fig:tool reaction-type-sorter-->

<div class="problem" data-problem="c11c-redox-agent"></div>

## 4. Balancing redox equations

Atoms and charge must be equal on both sides, and electrons lost must equal electrons gained. NCERT teaches two methods.

### The oxidation number method

<div class="steps" data-fig="c11c-redox-oxsteps">
<div class="step">Write the skeleton equation and put an oxidation number on every atom that changes: Cu 0 → +2 and N +5 → +2.</div>
<div class="step">Find the increase (Cu: 2 per atom) and the decrease (N: 3 per atom).</div>
<div class="step">Multiply so total increase equals total decrease: 3 Cu atoms give 6, and 2 N atoms give 6.</div>
<div class="step">Balance charge with H⁺ in acid (or OH⁻ in base): left −2, right +6, so add 8H⁺ to the left.</div>
<div class="step">Balance hydrogen with water: 8 H on the left means 4H₂O on the right.</div>
<div class="step">Check oxygen (6 = 6) and charge (+6 = +6). Done: 3Cu + 2NO₃⁻ + 8H⁺ → 3Cu²⁺ + 2NO + 4H₂O.</div>
</div>

### The half-reaction (ion-electron) method

Here each half is balanced separately and then the two are joined. Below it is done in **basic** solution, where you use OH⁻ and H₂O instead of H⁺.

<div class="steps" data-fig="c11c-redox-halfsteps">
<div class="step">Skeleton and oxidation numbers: Mn +7 → +4, I −1 → 0.</div>
<div class="step">Split into the oxidation half (I⁻ → I₂) and the reduction half (MnO₄⁻ → MnO₂).</div>
<div class="step">Balance the atoms other than O and H: 2I⁻ → I₂.</div>
<div class="step">Add electrons for charge: 2I⁻ → I₂ + 2e⁻. For the other half, left is −1 − 3 = −4, right 0.</div>
<div class="step">In base, add OH⁻ on the right to match charge and H₂O on the left to balance O and H: MnO₄⁻ + 3e⁻ + 2H₂O → MnO₂ + 4OH⁻.</div>
<div class="step">Make the electrons equal by multiplying (×3 and ×2, six electrons each).</div>
<div class="step">Add the halves and cancel the electrons: 2MnO₄⁻ + 6I⁻ + 4H₂O → 2MnO₂ + 3I₂ + 8OH⁻.</div>
</div>

In acid solution the rule is the same, except that you add **H₂O to balance O, then H⁺ to balance H**. This shared player does it for permanganate and iron(II):

<figure class="fig" data-fig="@chem-redox-steps"><figcaption>Balancing MnO₄⁻ with Fe²⁺ in acid, with a ledger of atoms and charge that updates at every step.</figcaption></figure>

Now balance the equations yourself. Use + and − on each species and watch the ledger turn green row by row:

<figure class="fig" data-fig="c11c-redox-tally"><figcaption>Three redox equations to balance. A row turns green when that atom (or the charge) matches on both sides. “Show a balanced answer” gives the standard coefficients. Hint: fix the electrons first, then H₂O, then H⁺.</figcaption></figure>

Check yourself against an automatic balancer:

<!--fig:tool equation-balancer-->

<div class="problem" data-problem="c11c-redox-moles"></div>

<div class="myth">

**“Balance the atoms and you are finished.”** For a redox equation the **charge** must balance too. 3Cu + 2NO₃⁻ + 8H⁺ has net charge +6 on the left and 3Cu²⁺ has +6 on the right: the check that matters. A wrong coefficient can balance atoms and still break charge.

</div>

## 5. Redox reactions and electrode processes

In the Zn + Cu²⁺ reaction, the two half-reactions happen on the same strip, and the electrons jump directly: the energy comes out as heat. If you place Zn and Cu in **separate beakers** and join them with a wire and a **salt bridge**, the electrons must travel through the wire and you can use them. This is the **Daniell cell**, a **galvanic cell** that makes electricity from a redox reaction.

- Zn (anode) is oxidised: Zn → Zn²⁺ + 2e⁻.
- Cu (cathode) is reduced: Cu²⁺ + 2e⁻ → Cu.
- The salt bridge lets ions move so that each beaker stays neutral.

<figure class="fig" data-fig="@chem-galvanic-cell"><figcaption>A working Daniell cell: electrons through the wire, ions through the salt bridge.</figcaption></figure>

Each half-cell has a tendency to gain electrons, its **electrode potential** (measured against the standard hydrogen electrode, which is defined as 0.00 V). Arranging metals by this value gives the **electrochemical series**: Li, K, Ca, Na, Mg, Al, Zn, Fe, Ni, Sn, Pb, **H**, Cu, Ag, Au. Metals above hydrogen displace it from dilute acids (Zn + 2HCl → ZnCl₂ + H₂); those below do not. A metal higher in the series reduces ions of any metal lower down. That is exactly what the first figure showed.

<div class="problem" data-problem="c11c-redox-ecell"></div>

Full treatment of cell voltages, the Nernst equation and electrolysis comes in Class 12 [Electrochemistry](/learn/courses/ncert-class-12-chemistry/electrochemistry/).

## 6. Redox in the lab and in life

**Redox titration.** If you know the concentration of one reactant you can find the other by adding it slowly until it just reacts. Potassium permanganate is purple; as long as Fe²⁺ is present, each drop is decolourised. The first **permanent pink** tells you the reaction is complete (KMnO₄ is its own indicator).

<figure class="fig" data-fig="c11c-redox-titration"><figcaption>KMnO₄ added to 25 mL of Fe²⁺ in acid. Change the unknown Fe²⁺ concentration and the volume added. The flask changes colour at the end point, and the readout shows the mole ratio MnO₄⁻ : Fe²⁺ = 1 : 5.</figcaption></figure>

<div class="problem" data-problem="c11c-redox-titr"></div>

**In daily life:**
- **Rusting:** iron is oxidised, oxygen reduced (4Fe + 3O₂ + xH₂O → 2Fe₂O₃·xH₂O).
- **Bleaching:** the bleaching agent (hypochlorite, ClO⁻) oxidises coloured compounds into colourless ones.
- **Respiration and burning of fuel:** C₆H₁₂O₆ is oxidised to CO₂ while O₂ is reduced to water.
- **Batteries and torch cells:** a spontaneous redox reaction supplies electrons.
- **Photographic and chemical tests:** silver mirror test and Fehling’s test are redox reactions.

<div class="history">

**A short timeline**
- **1770s:** Lavoisier explains burning as combining with oxygen.
- **1800:** Volta’s pile shows that redox reactions can make an electric current.
- **1897:** electrons are discovered, and the electron view of oxidation grows from it.
- **1938:** Latimer’s diagrams collect oxidation states and potentials in one chart.

</div>

<div class="keypoints">

- Oxidation = loss of electrons (oxidation number rises); reduction = gain (oxidation number falls). They always occur together.
- The oxidising agent is reduced; the reducing agent is oxidised.
- Rules for oxidation number: free atoms 0; ions their charge; F −1; O −2 (peroxide −1, OF₂ +2); H +1 (hydrides −1); the sum equals the charge.
- Types: combination, decomposition, displacement, disproportionation (the same element goes up and down).
- Balance by oxidation number change or by half-reactions; balance atoms **and** charge, and make electrons lost equal electrons gained.
- Acid: H₂O then H⁺; base: H₂O and OH⁻.
- A galvanic cell separates the half-reactions so that electrons flow through a wire. A higher metal in the electrochemical series reduces the ion of one below it.
- In a permanganate titration MnO₄⁻ : Fe²⁺ = 1 : 5 and the first permanent pink marks the end point.

</div>

Going further for JEE/NEET: [Redox reactions](/learn/courses/engineering-entrance/redox/) (the entrance lesson, with exam-level problems).

Practice for this chapter: [Redox Reactions: practice questions](/learn/courses/ncert-class-11-chemistry/redox-reactions-practice/).
