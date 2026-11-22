---
title: 'Physics: atoms and nuclei'
seoTitle: 'Atoms, Bohr model and nuclei for CUET Physics'
summary: 'Rutherford''s scattering, Bohr''s hydrogen atom and its spectral series, nuclear size and binding energy, radioactive decay and half-life, fission and fusion, with a live decay animation and problem.'
minutes: 22
updated: 2026-11-22
quiz:
  - q: 'The energy of a hydrogen electron in the n = 2 level is:'
    choices: ['−3.4 eV', '−13.6 eV', '−6.8 eV']
    ans: 0
    why: 'E_n = −13.6/n² eV, so E₂ = −13.6/4 = −3.4 eV.'
  - q: 'After three half-lives, the fraction of a radioactive sample left is:'
    choices: ['1/8', '1/3', '1/6']
    ans: 0
    why: 'Each half-life halves what is left: ½ × ½ × ½ = 1/8.'
  - q: 'Energy is released in both fission of uranium and fusion of hydrogen because:'
    choices: ['the products have higher binding energy per nucleon', 'mass is created', 'electrons are lost']
    ans: 0
    why: 'Binding energy per nucleon peaks near iron. Moving towards the peak from either side releases energy as a small mass defect.'
sources:
  - 'NCERT, Physics Part II (Class 12), Atoms; Nuclei'
  - 'National Testing Agency, CUET (UG) Physics syllabus https://cuet.nta.nic.in/ (checked 2026-11-22)'
  - 'Questions: original fibub writing for this course'
---

**Module 6 · about 22 minutes.** By the end you will use Bohr's energy levels, binding energy and half-life. Read first: [dual nature](/learn/courses/cuet/physics-dual-nature/).

<div class="bigidea">An atom is almost all empty space with a tiny, heavy nucleus. Electrons sit only on certain energy levels, and jumping between them gives each element its own colours. Nuclei hold together with a binding energy that also powers stars and reactors.</div>

**Everyday picture:** a ladder with rungs. You can stand on a rung but not between them. An electron climbing or dropping a rung absorbs or gives out a photon carrying exactly the energy difference.

## 1. Rutherford and Bohr

Most alpha particles went straight through gold foil; a very few bounced back. So the positive charge and mass sit in a nucleus about 10⁻¹⁴ m across, inside an atom about 10⁻¹⁰ m across. Bohr then added three rules: electrons move in fixed orbits without radiating, angular momentum is nh/2π, and a jump between levels gives out or absorbs one photon.

```math
E_n = -\frac{13.6}{n^2}\ \text{eV} \qquad r_n = 0.529\,n^2\ \text{Å} \qquad h f = E_{n_2} - E_{n_1}
```

<div class="steps" data-title="The hydrogen spectral series">
<div class="step"><b>Lyman</b>: jumps down to n = 1. Ultraviolet.</div>
<div class="step"><b>Balmer</b>: down to n = 2. Visible (the red 656 nm line is 3 → 2).</div>
<div class="step"><b>Paschen</b>: down to n = 3. Infrared.</div>
<div class="step"><b>Brackett and Pfund</b>: down to n = 4 and 5. Farther infrared.</div>
</div>

## 2. The nucleus

| Idea | Fact |
|---|---|
| Size | R = R₀A^(1/3), R₀ ≈ 1.2 fm, so all nuclei have about the same density (~2 × 10¹⁷ kg/m³) |
| Mass defect | Δm = (mass of separate nucleons) − (mass of nucleus) |
| Binding energy | E_b = Δm c²; 1 u = 931.5 MeV |
| Nuclear force | strongest force, very short range (a few fm), the same between n-n, p-p and n-p |
| Fission | heavy nucleus splits (U-235 + n), ~200 MeV each, chain reaction in reactors |
| Fusion | light nuclei join (hydrogen to helium in the Sun), needs millions of degrees |

## 3. Radioactive decay

<figure class="fig" data-fig="decay-curve"><figcaption>Each half-life, half of what is left decays. The curve never quite reaches zero.</figcaption></figure>

N = N₀e^(−λt), half-life T½ = 0.693/λ, mean life τ = 1/λ. Alpha decay drops A by 4 and Z by 2; beta-minus raises Z by 1 (a neutron becomes a proton); gamma changes neither.

<div class="problem" data-problem="half-life"></div>

<div class="myth">

**"After two half-lives, all of it is gone."** After one half-life, half is left; after two, a quarter; after ten, about a thousandth. Decay is random for each nucleus, so a sample shrinks by the same fraction in each equal time.

</div>

**Try it:** Switch the target and watch the scattering.

<figure class="fig" data-fig="@mech-rutherford"><figcaption>Most pass straight; a few bounce back from a small dense centre.</figcaption></figure>

## See it move

Play with these before you practise. Each one runs in your browser; move the sliders and press the buttons.

<figure class="fig" data-fig="@qm-bohr-standing"><figcaption>A de Broglie standing wave round a Bohr orbit (n = 1 to 6) and why fractional wavelength counts cancel; step player over n.</figcaption></figure>

<figure class="fig" data-fig="@qm-decay-atoms"><figcaption>A grid of nuclei decaying at random against N(t), with an optional parent-daughter chain and equilibrium.</figcaption></figure>

<figure class="fig" data-fig="@qm-rutherford"><figcaption>Α trajectories past a nucleus (target, energy, impact parameter) and the 1/sin⁴(θ/2) counts.</figcaption></figure>

## 4. Practice

<div class="qbank" data-bank="entrance-physics" data-topics="atoms,nuclei" data-exam="cuet" data-n="10" data-mode="practice" data-type="mcq"></div>

<div class="keypoints">

- E_n = −13.6/n² eV; r_n ∝ n²; Lyman UV, Balmer visible, Paschen IR.
- R = R₀A^(1/3): nuclear density is the same for all nuclei.
- E_b = Δm c², 1 u = 931.5 MeV; BE per nucleon peaks near iron.
- N = N₀e^(−λt), T½ = 0.693/λ.

</div>
