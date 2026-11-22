---
title: 'Electric potential and capacitors: question types and traps'
seoTitle: 'Potential and capacitor questions for JEE and NEET'
summary: 'Every way entrance exams ask about potential and capacitors: potential of charge groups and bodies, work and energy, E from V, connected spheres, capacitor networks and bridges, dielectric slabs, battery on or off, charge sharing and energy loss, plate forces and RC circuits, each with a method and its trap.'
minutes: 28
updated: 2026-11-22
quiz:
  - q: 'Two spheres of radii 1 cm and 3 cm, far apart, are joined by a thin wire and share a charge. The ratio of their surface charge densities (small : large) is:'
    choices: ['1 : 3', '3 : 1', '1 : 9', '9 : 1']
    ans: 1
    why: 'Equal potentials give q/r equal, so σ = q/(4πr²) goes as 1/r. The small sphere has 3 times the density.'
  - q: 'In a balanced capacitor bridge, the capacitor across the middle:'
    choices: ['carries the most charge', 'has no charge and can be removed', 'doubles the total capacitance', 'is in parallel with all others']
    ans: 1
    why: 'When C₁/C₂ = C₃/C₄ the two middle points are at the same potential, so the bridge capacitor holds no charge.'
  - q: 'A capacitor in a DC circuit, long after the switch is closed, behaves like:'
    choices: ['a plain wire', 'a broken (open) wire', 'a resistor of value RC', 'a battery of emf zero']
    ans: 1
    why: 'Once fully charged no current flows through its branch, so it acts as an open gap. Just after switching on, an uncharged capacitor acts like a wire.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Electrostatic potential and capacitance; question patterns studied from the exams'' published papers (no questions copied)'
---

**Physics · Class 12 · about 28 minutes.** Read the lesson [Electric potential and capacitors](/learn/courses/engineering-entrance/potential-capacitance/) first. Here you meet every question type, with the method and the trap, then practise.

<div class="bigidea">Two facts settle most capacitor questions: write down what stays fixed (V with the battery on, Q with it off, total charge on an isolated island), and remember that potential is a scalar you can simply add.</div>

## The ten question types

<div class="steps" data-ms="9000">
<div class="step"><b>1. Potential of a group of charges.</b> Add kq/r with signs. <i>Trap:</i> using vector addition, or forgetting that a negative charge gives negative V.</div>
<div class="step"><b>2. Work and potential energy.</b> W = q(V_B − V_A); system energy = sum over pairs. Square of 4 charges has 6 pairs. <i>Trap:</i> counting a pair twice.</div>
<div class="step"><b>3. E from V and V from E.</b> E = −dV/dx; V = −∫E dx. Equipotentials are perpendicular to E. <i>Trap:</i> the sign; E points from high V to low V.</div>
<div class="step"><b>4. Shells, spheres and connected conductors.</b> Shell: kQ/R inside. Joined spheres: equal V, so q ∝ r and σ ∝ 1/r. Concentric shells: add each shell's potential at the point. <i>Trap:</i> an earthed shell has V = 0, not q = 0.</div>
<div class="step"><b>5. Capacitor networks.</b> Series and parallel, then symmetry. Balanced bridge: drop the middle. <i>Trap:</i> in series the charge is the same, not the voltage.</div>
<div class="step"><b>6. Dielectric slabs.</b> Layered: series; side by side: parallel; formula ε₀A/(d − t + t/K). <i>Trap:</i> a metal slab is K = ∞, and its position in the gap does not matter.</div>
<div class="step"><b>7. Battery on or off.</b> Make a table of C, Q, V, E, U before and after. <i>Trap:</i> with the battery on, inserting a slab raises U; with it off, U falls.</div>
<div class="step"><b>8. Charge sharing and energy loss.</b> Conserve charge on each isolated island, equalise V. Loss C₁C₂(V₁ − V₂)²/[2(C₁ + C₂)]. <i>Trap:</i> joining opposite plates: use V₁ + V₂ in place of V₁ − V₂.</div>
<div class="step"><b>9. Forces and energy density.</b> Plate force Q²/(2ε₀A); u = ½ε₀E²; slab pulled in with force (ε₀b(K − 1)V²)/(2d) at fixed V. <i>Trap:</i> using QE for the plate force; it is ½QE.</div>
<div class="step"><b>10. RC circuits.</b> Just after switching: uncharged C is a wire. Long after: C is a gap. In between, exponential with τ = R_eq C, where R_eq is the resistance seen by the capacitor. <i>Trap:</i> using the wrong R in τ.</div>
</div>

## Worked examples

**Example 1 (level 3, concentric shells).** Shell A (radius a) has charge q and shell B (radius b > a) has charge Q. Find the potential of A.

*Solution.* At radius a, A contributes kq/a; B is outside, so its potential there is its surface value kQ/b. **V_A = kq/a + kQ/b.** Now earth A: V_A = 0 gives `$q' = -Qa/b$`. *Trap:* earthing does not make the charge zero; it makes the potential zero.

**Example 2 (level 4, battery off, then gap doubled).** A 10 µF capacitor is charged to 50 V and isolated. The gap is doubled. Find the new voltage and the work done.

*Solution.* Q = 500 µC stays. C becomes 5 µF, so V = 100 V. Energy rises from Q²/2C = 12.5 mJ to 25 mJ, so the work done pulling the plates apart is **12.5 mJ**. *Check:* plate force Q²/(2ε₀A) is constant, and force × distance gives the same answer.

**Example 3 (level 4, network with a bridge).** Capacitors 2 µF and 4 µF form one arm, 1 µF and 2 µF the other, with 5 µF across the middle. Is the 5 µF charged?

*Solution.* Balance needs 2/4 = 1/2: yes, it balances. Middle points are at the same potential, so the **5 µF has no charge**. Equivalent: (2 series 4) + (1 series 2) = 4/3 + 2/3 = **2 µF**.

**Example 4 (level 5, RC with two resistors).** A capacitor C is charged by a battery V through R₁, with R₂ connected directly across C. Find the final charge and the time constant.

*Solution.* Finally no current goes into C, so a current V/(R₁ + R₂) flows through R₁ and R₂, and the voltage across C is VR₂/(R₁ + R₂). Final charge `$CVR_2/(R_1 + R_2)$`. Seen from C (battery shorted), R₁ and R₂ are in parallel: `$\tau = \dfrac{R_1R_2}{R_1 + R_2}C$`. *Trap:* using τ = R₁C.

<div class="myth">

**"A dielectric always lowers the energy stored."** Only with the battery removed. With the battery connected, Q rises K times and U = ½CV² rises K times; the battery supplies 2ΔU and half goes into pulling the slab in.

</div>

<div class="meaning">
<dl>
<dt>Fixed quantity</dt><dd>battery on: V; battery off: Q; isolated plate group: its total charge</dd>
<dt>R_eq in τ</dt><dd>the resistance between the capacitor's terminals with every battery replaced by a wire</dd>
<dt>Physical meaning</dt><dd>Every capacitor answer is a bookkeeping exercise: track charge, which cannot vanish, and potential, which must be single-valued at every point.</dd>
</dl>
</div>

## Practise

The set climbs from level 1 to level 5 and includes numericals, assertion-reason, statements, matching lists, multi-correct and passage questions. Templates give new numbers each time.

<div class="qbank" data-bank="entrance-physics" data-topics="potential-capacitance" data-mode="practice"></div>

<div class="keypoints">

- Ten types: potential of charges, work and energy, E from V, spheres and shells, networks, slabs, battery on or off, sharing, forces, RC.
- Potential is a scalar: add with signs.
- Earthed means V = 0, not q = 0.
- Make a before and after table of C, Q, V, E, U for every change.
- Plate force is ½QE = Q²/(2ε₀A).
- τ uses the resistance seen from the capacitor's terminals.

</div>
