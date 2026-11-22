---
title: 'Atomic and molecular physics: what NET asks'
seoTitle: CSIR NET Physics atomic and molecular physics roadmap
summary: 'What CSIR NET Part C asks from atomic and molecular physics (helium and alkali spectra, fine and hyperfine structure, LS and jj coupling, Zeeman, Paschen-Back and Stark effects, ESR and NMR, Franck-Condon and Born-Oppenheimer, rotational, vibrational and Raman spectra, lasers), the order to study it, the GATE lessons that teach it, a self-check list and a worked anomalous-Zeeman example.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'In a weak magnetic field, the ²P₃/₂ → ²S₁/₂ line splits into'
    choices: ['6 lines', '3 lines', '4 lines', '10 lines']
    ans: 0
    why: 'g = 4/3 for ²P₃/₂ and 2 for ²S₁/₂. With Δm = 0, ±1 the allowed shifts are ±1/3, ±1 and ±5/3 in units of μ_B B: six distinct lines.'
  - q: 'The pure rotational lines of a rigid diatomic molecule are spaced by'
    choices: ['2B', 'B', '4B', '6B']
    ans: 0
    why: 'Levels are BJ(J + 1); the J → J + 1 line is at 2B(J + 1), so neighbouring lines are 2B apart. Rotational Raman lines (ΔJ = ±2) are spaced by 4B.'
  - q: 'A molecule with no permanent dipole moment, such as N₂,'
    choices: ['has a rotational Raman spectrum but no pure rotational absorption spectrum', 'has a pure rotational absorption spectrum but no Raman spectrum', 'has neither', 'has both']
    ans: 0
    why: 'Microwave absorption needs a permanent dipole; Raman needs an anisotropic polarisability, which every linear molecule has.'
sources:
  - 'CSIR-UGC NET Physical Sciences syllabus: Atomic and Molecular Physics (advanced), CSIR HRDG / National Testing Agency, checked 2026-11-22'
  - 'C. J. Foot, Atomic Physics (Oxford, 2005)'
  - 'C. N. Banwell and E. M. McCash, Fundamentals of Molecular Spectroscopy, 4th ed. (McGraw-Hill, 1994)'
  - 'B. H. Bransden and C. J. Joachain, Physics of Atoms and Molecules, 2nd ed. (Pearson, 2003)'
---

**Module 8 · about 30 minutes to read, 2 weeks to work through.** Atomic and molecular physics appears in Part C only. Its questions are short calculations built on a few formulas (Landé g, term symbols, rotational and vibrational levels, selection rules), which makes it one of the best-paying units per hour of study. This roadmap shows what is asked, the order to study it, where it is taught, a worked example and a checklist.

<div class="bigidea">Spectroscopy is energy levels plus selection rules. Write the levels (term symbols, BJ(J + 1), (v + ½)ω), apply the rule that says which jumps are allowed, and the spectrum (number of lines, spacings, intensities) follows.</div>

## 1. What NET asks

Described from the published syllabus (check the current one). All of it is **Part C**:

- Quantum states of an electron in an atom; electron spin; spectra of helium and the alkali atoms.
- Relativistic corrections to hydrogen levels; hyperfine structure and isotope shift; widths of spectral lines.
- LS and jj coupling.
- The Zeeman, Paschen-Back and Stark effects.
- Electron spin resonance; nuclear magnetic resonance and chemical shift.
- The Franck-Condon principle; the Born-Oppenheimer approximation.
- Electronic, rotational, vibrational and Raman spectra of diatomic molecules, with selection rules.
- Lasers: spontaneous and stimulated emission, Einstein A and B coefficients, optical pumping, population inversion, rate equations, resonator modes and coherence length.

The core quantum unit ([roadmap 5.1](/learn/courses/csir-net-physics/quantum-roadmap/)) supplies the tools: angular momentum addition, perturbation theory and selection rules.

<div class="meaning">

<dl>
<dt>Term symbol</dt><dd>²ˢ⁺¹L_J; Hund's rules pick the ground term (largest S, then largest L, then J = |L − S| if less than half filled, L + S if more)</dd>
<dt>Landé g</dt><dd>g = 1 + [J(J + 1) + S(S + 1) − L(L + 1)] / [2J(J + 1)]; weak-field shift g m_J μ_B B</dd>
<dt>Rigid rotor</dt><dd>E_J = BJ(J + 1), absorption lines spaced 2B, rotational Raman spaced 4B</dd>
<dt>Anharmonic oscillator</dt><dd>G(v) = ω_e(v + ½) − ω_e x_e(v + ½)²; overtones slightly below multiples of the fundamental</dd>
<dt>Physical meaning</dt><dd>Every line is a difference of two levels, and only jumps that change the right quantum numbers by the right amounts carry intensity.</dd>
</dl>

</div>

## 2. The order to study it

1. **Hydrogen and fine structure**: GATE [hydrogen spectra and fine structure](/learn/courses/gate-physics/fine-structure/). JAM [the Bohr atom, spectra and X-rays](/learn/courses/iit-jam-physics/atoms-x-rays/) for the basics.
2. **Many-electron atoms**: GATE [LS and jj coupling](/learn/courses/gate-physics/ls-jj-coupling/) (term symbols, Hund's rules, helium, alkali spectra).
3. **Atoms in fields**: GATE [Zeeman and Stark effects](/learn/courses/gate-physics/zeeman-stark/).
4. **Molecules**: GATE [rotational spectra](/learn/courses/gate-physics/rotational-spectra/), [vibrational spectra](/learn/courses/gate-physics/vibrational-spectra/) and [Raman spectroscopy](/learn/courses/gate-physics/raman/).
5. **Lasers**: GATE [Einstein coefficients and lasers](/learn/courses/gate-physics/lasers/).
6. **NET extras in this course**: [lesson 8.2](/learn/courses/csir-net-physics/esr-nmr/) (magnetic resonance: ESR and NMR) and [lesson 8.3](/learn/courses/csir-net-physics/electronic-spectra/) (electronic spectra and the Franck-Condon principle).

## 3. Where each topic is taught

| Topic | Learn it from | NET emphasis |
|---|---|---|
| Fine structure, Lamb shift, hyperfine | [GATE 6.1](/learn/courses/gate-physics/fine-structure/) | which levels stay degenerate, 21 cm line |
| Term symbols, LS and jj coupling | [GATE 6.2](/learn/courses/gate-physics/ls-jj-coupling/) | Hund's rules, Landé interval rule, number of states |
| Zeeman, Paschen-Back, Stark | [GATE 6.3](/learn/courses/gate-physics/zeeman-stark/) | Landé g, number of lines, linear Stark effect in hydrogen |
| Rotational spectra | [GATE 6.4](/learn/courses/gate-physics/rotational-spectra/) | B from spacing, bond length, isotope effect, intensities |
| Vibrational spectra | [GATE 6.5](/learn/courses/gate-physics/vibrational-spectra/) | anharmonicity, dissociation energy, P and R branches |
| Raman | [GATE 6.6](/learn/courses/gate-physics/raman/) | Stokes and anti-Stokes, 4B spacing, mutual exclusion |
| Lasers | [GATE 6.7](/learn/courses/gate-physics/lasers/) | A/B ratio ∝ ν³, three- and four-level schemes, mode spacing c/2L |
| ESR, NMR | [lesson 8.2](/learn/courses/csir-net-physics/esr-nmr/) | resonance frequency from g and B, chemical shift in ppm |
| Electronic spectra, Franck-Condon | [lesson 8.3](/learn/courses/csir-net-physics/electronic-spectra/) | vibrational progressions, Born-Oppenheimer separation |

## 4. A worked NET-style example

**Question (Part C style).** The sodium D₂ line comes from the transition `$^2P_{3/2} \to {}^2S_{1/2}$`. In a weak magnetic field `$B$` it splits into

(a) 6 lines, adjacent lines `$\tfrac23\mu_BB$` apart (b) 3 lines, `$\mu_BB$` apart (c) 4 lines, `$\tfrac43\mu_BB$` apart (d) 6 lines, `$\mu_BB$` apart.

**Solution.**

1. Landé factors: for `$^2P_{3/2}$` (`$L = 1$`, `$S = \tfrac12$`, `$J = \tfrac32$`),

```math
g = 1 + \frac{\tfrac{15}{4} + \tfrac34 - 2}{2\cdot\tfrac{15}{4}} = 1 + \frac{2.5}{7.5} = \frac43
```

and for `$^2S_{1/2}$`, `$g = 2$`.
2. Upper shifts `$g m_J$`: `$\pm2, \pm\tfrac23$`. Lower shifts: `$\pm1$`.
3. Allowed jumps have `$\Delta m_J = 0, \pm1$`. The line shifts (upper minus lower, in units of `$\mu_BB$`) are: `$2 - 1 = 1$`; `$\tfrac23 - 1 = -\tfrac13$`; `$\tfrac23 + 1 = \tfrac53$`; `$-\tfrac23 - 1 = -\tfrac53$`; `$-\tfrac23 + 1 = \tfrac13$`; `$-2 + 1 = -1$`.
4. Six lines at `$\pm\tfrac13, \pm1, \pm\tfrac53$`, equally spaced by `$\tfrac23\mu_BB$`: option (a).

**Traps.** Option (b) is the normal Zeeman effect (spin ignored), which applies only to singlet lines. In a strong field (Paschen-Back), spin and orbit decouple and the pattern goes back to three groups.

**A molecular companion.** Rotational line spacings give bond lengths:

<div class="problem" data-problem="net-rot-spacing"></div>

## 5. Self-check before moving on

You are ready for condensed matter when you can, without notes:

- write the ground term of an atom from its configuration with Hund's rules (try carbon, nitrogen, oxygen and iron);
- list the levels of hydrogen `$n = 2$` with fine structure, and say which stay degenerate;
- compute a Landé g and count the lines of a weak-field Zeeman pattern;
- say when the Stark effect is linear (hydrogen, degenerate levels) and when quadratic;
- find a bond length from a rotational line spacing, and the effect of swapping an isotope;
- find `$\omega_e$` and `$\omega_ex_e$` from the fundamental and the first overtone, and estimate the dissociation energy;
- give the selection rules for rotational, vibrational and Raman transitions and the rule of mutual exclusion;
- state the Franck-Condon principle and what it says about the intensities in a vibrational progression;
- find an ESR or NMR resonance frequency from g and B;
- explain why a two-level system cannot lase and find the mode spacing of a cavity.

<div class="myth">

**"Every molecule has a microwave rotational spectrum."** Only molecules with a permanent electric dipole moment do. Homonuclear diatomics (H₂, N₂, O₂) show no pure rotational absorption, but they do show rotational Raman lines.

</div>

<div class="keypoints">

- Part C only: atomic structure and spectra, fine and hyperfine structure, coupling schemes, atoms in fields, magnetic resonance, molecular spectra, lasers.
- Order: hydrogen and fine structure, LS and jj coupling, Zeeman and Stark, rotational, vibrational and Raman spectra, lasers, lessons 8.2 and 8.3.
- Landé g, term symbols, `$BJ(J + 1)$`, anharmonic `$G(v)$` and selection rules answer most questions.

</div>

## Practise: a mixed atomic and molecular set

<div class="qbank" data-bank="physics" data-topics="fine-structure,ls-jj-coupling,zeeman-stark,rotational-spectra,vibrational-spectra,raman,lasers,atoms-x-rays" data-exam="net" data-n="10"></div>

**Next:** [condensed matter roadmap](/learn/courses/csir-net-physics/condensed-roadmap/).
