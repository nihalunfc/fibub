---
title: 'Nuclei and radioactivity: question types and traps'
seoTitle: 'Nuclei and radioactivity questions for JEE and NEET'
summary: 'Every way entrance exams ask about nuclei: size and density, mass defect and binding energy, Q-values and energy sharing in decays, balancing decays and counting alphas and betas, half-life, mean life and activity, dating, parallel and successive decay, fission, reactors and fusion, each with a method and its trap.'
minutes: 26
updated: 2026-11-22
quiz:
  - q: '²³⁸U decays to ²⁰⁶Pb through a series of α and β⁻ decays. The numbers of α and β⁻ particles emitted are:'
    choices: ['8 α, 6 β', '6 α, 8 β', '8 α, 8 β', '10 α, 2 β']
    ans: 0
    why: 'Mass falls by 32, so 8 alphas. These lower Z by 16 (92 to 76), but lead has Z = 82, so 6 β⁻ decays raise Z by 6.'
  - q: 'The radii of ²⁷Al and ⁶⁴Cu nuclei are in the ratio:'
    choices: ['27 : 64', '3 : 4', '9 : 16', '1 : 1']
    ans: 1
    why: 'R ∝ A^(1/3): 27^(1/3) : 64^(1/3) = 3 : 4.'
  - q: 'A sample''s activity falls from 800 Bq to 100 Bq in 30 minutes. Its half-life is:'
    choices: ['10 min', '15 min', '3.75 min', '30 min']
    ans: 0
    why: '800 to 100 is a factor of 8 = 2³, three half-lives in 30 minutes: 10 minutes each.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Atoms and nuclei; question patterns studied from the exams'' published papers (no questions copied)'
---

**Physics · Class 12 · about 26 minutes.** Read the lesson [Nuclei and radioactivity](/learn/courses/engineering-entrance/nuclei/) first. Here you meet every question type, with the method and the trap, then practise.

<div class="bigidea">Nuclear questions are bookkeeping of three things: nucleon number and charge (to balance decays), mass (to find energy), and the exponential law (for time). Keep each ledger separate and the chapter is straightforward.</div>

## The nine question types

<div class="steps" data-ms="9000">
<div class="step"><b>1. Size and density.</b> R = R₀A^(1/3); density constant. <i>Trap:</i> radius ratio from A directly instead of its cube root.</div>
<div class="step"><b>2. Mass defect and binding energy.</b> Δm × 931.5 MeV; B/A; separation energy of one neutron = B(parent) − B(daughter). <i>Trap:</i> mixing atomic and nuclear masses (electrons not cancelling).</div>
<div class="step"><b>3. Q-values.</b> Q = (mass before − after) × 931.5 = ΣB(after) − ΣB(before). Positive: energy released. <i>Trap:</i> for β⁺ with atomic masses, subtract 2m_e (1.022 MeV).</div>
<div class="step"><b>4. Energy sharing.</b> Two-body decay at rest: equal and opposite momenta, K ∝ 1/m; K_α = Q(A − 4)/A. Gamma recoil E²/(2Mc²). <i>Trap:</i> giving all of Q to the alpha.</div>
<div class="step"><b>5. Balancing decays.</b> Count alphas from the change in A (÷ 4), then betas from the charge balance. <i>Trap:</i> forgetting that β⁻ raises Z.</div>
<div class="step"><b>6. Decay law.</b> N = N₀(½)^(t/T); activity A = λN; mass from activity m = A M/(λN_A). <i>Trap:</i> "decayed" versus "left".</div>
<div class="step"><b>7. Dating.</b> Carbon: t = (T/ln 2) ln(A₀/A). Rocks: daughter-to-parent ratio, N_D/N_P = e^(λt) − 1. <i>Trap:</i> using the daughter count as the remaining amount.</div>
<div class="step"><b>8. Parallel, successive and produced decays.</b> λ = λ₁ + λ₂; secular equilibrium λ_AN_A = λ_BN_B; N → R/λ. <i>Trap:</i> adding half-lives instead of decay constants.</div>
<div class="step"><b>9. Fission, reactors and fusion.</b> Energy per fission (≈ 200 MeV), fissions per second from power, fuel used per day; moderator, control rods, k; fusion temperature from kT ≈ Coulomb barrier. <i>Trap:</i> confusing the moderator (slows neutrons) with control rods (absorb them).</div>
</div>

## Worked examples

**Example 1 (level 3, reactor fuel).** A reactor produces 300 MW of electrical power at 30% efficiency, with 200 MeV per fission of ²³⁵U. How much uranium does it use per day?

*Solution.* Thermal power = 1000 MW. Fissions per second = 10⁹/(200 × 1.6 × 10⁻¹³) = 3.125 × 10¹⁹. Per day: × 86 400 = 2.7 × 10²⁴ nuclei = 4.48 mol = **about 1.05 kg**.

**Example 2 (level 4, parallel decay).** A nucleus decays by α with half-life 6 h and by β with half-life 3 h. Find the effective half-life.

*Solution.* 1/T = 1/6 + 1/3 = 1/2, so **T = 2 h**. *Trap:* 4.5 h (the average) or 9 h (the sum).

**Example 3 (level 4, recoil in alpha decay).** A nucleus of mass number 230 at rest emits an alpha with 4.8 MeV. Find Q.

*Solution.* Daughter mass number 226. Momenta equal: K_daughter = K_α × 4/226 = 0.085 MeV. **Q ≈ 4.885 MeV**. Or directly Q = K_α × A/(A − 4) = 4.8 × 230/226.

**Example 4 (level 5, rock dating).** A rock has 3 atoms of a stable daughter for every atom of a parent with half-life 1.3 × 10⁹ years (no daughter at the start). Its age?

*Solution.* Total original = 4 parent atoms, 1 left: two half-lives. **Age = 2.6 × 10⁹ years**. In general, t = T log₂(1 + N_D/N_P).

<div class="myth">

**"Heating or compressing a radioactive substance changes its half-life."** Decay happens inside the nucleus, far from the influence of temperature, pressure or chemical bonds. Half-lives stay the same in any ordinary conditions (electron capture shows only tiny changes).

</div>

<div class="meaning">
<dl>
<dt>Decay counting</dt><dd>alphas = ΔA/4; betas = 2 × alphas − ΔZ</dd>
<dt>Two-body sharing</dt><dd>K₁/K₂ = m₂/m₁ for a decay at rest</dd>
<dt>Physical meaning</dt><dd>The decay law is pure chance repeated over billions of nuclei: each one decays with the same probability per second, and the exponential curve is the average.</dd>
</dl>
</div>

## Practise

The set climbs from level 1 to level 5 and includes numericals, assertion-reason, statements, matching lists, multi-correct and passage questions. Templates give new numbers each time.

<div class="qbank" data-bank="entrance-physics" data-topics="nuclei" data-mode="practice"></div>

<div class="keypoints">

- Nine types: size, binding energy, Q-values, sharing, balancing, decay law, dating, parallel and chain decays, fission and fusion.
- Radii as cube roots of A; density constant.
- alphas = ΔA/4, then balance Z with betas.
- K_α = Q(A − 4)/A.
- Parallel decay: add decay constants.
- Rock age t = T log₂(1 + N_D/N_P).

</div>
