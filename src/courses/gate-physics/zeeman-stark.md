---
title: Zeeman and Stark effects
seoTitle: Zeeman, Paschen-Back and Stark effects for GATE Physics
summary: 'Atoms in fields: the magnetic moment and the Bohr magneton, the normal Zeeman triplet, the Landé g factor and the anomalous Zeeman patterns of the sodium D lines, polarisation of π and σ components, the Paschen-Back effect, electron spin resonance, and the linear and quadratic Stark effects.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'What is the Landé g factor of a ²P₁/₂ level?'
    choices: ['2/3', '4/3', '2', '1']
    ans: 0
    why: 'g = 1 + [J(J+1) + S(S+1) − L(L+1)]/[2J(J+1)] = 1 + (3/4 + 3/4 − 2)/(3/2) = 1 − 1/3 = 2/3.'
  - q: 'A Zeeman pattern is viewed along the direction of the magnetic field. What is seen?'
    choices: ['Only the σ components, circularly polarised', 'Only the π components, linearly polarised', 'All components, unpolarised', 'Only the undisplaced line']
    ans: 0
    why: 'The π (ΔM = 0) light comes from a dipole oscillating along B and sends nothing along B. The σ (ΔM = ±1) light comes from dipoles rotating about B and appears circularly polarised when viewed along it.'
  - q: 'Which atom shows a Stark shift linear in the electric field in its first excited level?'
    choices: ['Hydrogen', 'Sodium', 'Helium', 'Every atom equally']
    ans: 0
    why: 'A linear shift needs degenerate states of opposite parity for the field to mix. Only hydrogen has 2s and 2p at (nearly) the same energy; other atoms show the quadratic Stark effect.'
sources:
  - 'C. J. Foot, Atomic Physics (2005), chapters 5 and 6'
  - 'B. H. Bransden and C. J. Joachain, Physics of Atoms and Molecules, 2nd ed. (2003), chapters 6 and 8'
  - 'H. Haken and H. C. Wolf, The Physics of Atoms and Quanta, 7th ed. (2005), chapters 12 to 15'
  - 'H. E. White, Introduction to Atomic Spectra (1934), chapter 10'
  - 'GATE Physics syllabus (Atomic and Molecular Physics), published by the organising IIT each year'
---

**Module 6 · about 50 minutes.** By the end you will be able to compute the Landé g factor of any LS level, draw the Zeeman pattern of a transition and say which components are polarised how, recognise when a field is strong enough for the Paschen-Back regime, use the resonance condition of ESR, and estimate linear and quadratic Stark shifts.

<div class="bigidea">A field picks out a direction, so the 2J + 1 states of a level, labelled by M_J, stop being equal. The spacing of the split is the magnetic moment (for B) or the induced dipole (for E) times the field.</div>

## 1. The magnetic moment of an atom

An electron orbit with angular momentum `$\mathbf L$` is a current loop with moment `$-\mu_B\mathbf L/\hbar$`. The spin has twice the moment per unit angular momentum, `$-g_s\mu_B\mathbf S/\hbar$` with `$g_s = 2.0023$` (2 for most work). The unit is the Bohr magneton:

```math
\mu_B = \frac{e\hbar}{2m_e} = 9.274\times10^{-24}\ \text{J T}^{-1} = 5.788\times10^{-5}\ \text{eV T}^{-1}
```

Useful forms: `$\mu_B/h = 13.996$` GHz T⁻¹ and `$\mu_B/hc = 0.4669$` cm⁻¹ T⁻¹. In a field of 1 T the Zeeman energy is about 0.5 cm⁻¹, comparable with fine structure in light atoms. Because `$g_s \ne g_l$`, the total moment is not parallel to `$\mathbf J$`. In a weak field `$\mathbf L$` and `$\mathbf S$` precess rapidly about `$\mathbf J$`, and only the component of the moment along `$\mathbf J$` survives the average.

## 2. The normal Zeeman effect

If the level has `$S = 0$`, the moment is purely orbital and `$J = L$`:

```math
\Delta E = \mu_B B\,M_L, \qquad M_L = -L, \dots, L
```

Every level splits into equally spaced states with the same spacing `$\mu_BB$`, whatever `$L$` is. The selection rule `$\Delta M = 0, \pm1$` gives just three lines: the original frequency and two shifted by `$\pm\mu_BB/h$`.

```math
\Delta\tilde\nu = 0.4669\,B\ \text{cm}^{-1}, \qquad \Delta\lambda = \lambda^2\,\Delta\tilde\nu
```

**Worked example.** The cadmium red line at 643.8 nm (¹D₂ → ¹P₁) in a 1.0 T field.

1. `$\Delta\tilde\nu = 0.467$` cm⁻¹.
2. `$\lambda = 6.438\times10^{-5}$` cm, so `$\Delta\lambda = (6.438\times10^{-5})^2\times0.467 = 1.94\times10^{-9}$` cm = 0.019 nm.
3. Three lines 0.019 nm apart: needs a Fabry-Perot or a large grating to resolve. Measuring this is how `$e/m_e$` was first found from spectra.

<div class="problem" data-problem="zeeman-normal"></div>

## 3. The anomalous Zeeman effect and the Landé g factor

When `$S \ne 0$`, project the moment onto `$\mathbf J$` (the projection theorem):

```math
\Delta E = g_J\,\mu_B B\,M_J, \qquad g_J = 1 + \frac{J(J+1) + S(S+1) - L(L+1)}{2J(J+1)}
```

Checks: `$S = 0$` gives `$g = 1$`, pure orbit; `$L = 0$` gives `$g = 2$`, pure spin. Different levels now have different spacings, so a transition breaks into more than three lines.

<div class="meaning">

<dl>
<dt>μ_B</dt><dd>the Bohr magneton, the natural unit of atomic magnetic moment; μ_B B is the splitting scale</dd>
<dt>g_J</dt><dd>the Landé factor: how much magnetic moment per unit of J the level has; 1 for pure orbit, 2 for pure spin, and for some levels zero or even negative</dd>
<dt>M_J</dt><dd>the component of J along B; 2J + 1 values, equally spaced by g_J μ_B B</dd>
<dt>π and σ</dt><dd>components with ΔM = 0 and ΔM = ±1; they differ in polarisation and direction</dd>
<dt>weak field</dt><dd>μ_B B much smaller than the fine-structure splitting, so J stays a good quantum number</dd>
</dl>

</div>

**Worked example: the sodium D lines.** Lower level ²S₁/₂ (`$g = 2$`), upper ²P₁/₂ (`$g = \tfrac23$`) and ²P₃/₂ (`$g = \tfrac43$`). The shift of a line, in units of `$\mu_BB$`, is `$g'M' - gM$`.

<div class="steps">
<div class="step"><p><b>D₁ (²P₁/₂ → ²S₁/₂).</b> Upper sublevels at ±1/3, lower at ±1. ΔM = 0 gives ±2/3 (π); ΔM = ±1 gives ±4/3 (σ). Four lines.</p></div>
<div class="step"><p><b>D₂ (²P₃/₂ → ²S₁/₂).</b> Upper sublevels at ±2 and ±2/3. ΔM = 0 gives ±1/3 (π); ΔM = ±1 gives ±1 and ±5/3 (σ). Six lines.</p></div>
<div class="step"><p><b>No line at zero shift.</b> Both patterns are symmetric with no central line: the signature of the anomalous effect.</p></div>
</div>

<figure class="fig" data-fig="zeeman-pattern"><figcaption>Zeeman sublevels and allowed transitions for four cases, with the resulting stick spectrum underneath. The normal case gives three equally spaced lines; the sodium D lines give the four and six lines of the anomalous effect. Drag B to see the pattern grow linearly with the field.</figcaption></figure>

<div class="problem" data-problem="lande-g"></div>

**Polarisation.** A `$\Delta M = 0$` transition is a dipole oscillating along `$\mathbf B$`: seen across the field (transverse) it is linearly polarised parallel to `$\mathbf B$`, and along the field it is absent. A `$\Delta M = \pm1$` transition is a dipole rotating about `$\mathbf B$`: transverse it appears linearly polarised perpendicular to `$\mathbf B$`, longitudinal it is circularly polarised, with opposite senses for the two. So viewed along the field the normal triplet shows only two lines. Astronomers use this to measure magnetic fields in sunspots.

## 4. The Paschen-Back effect

If `$\mu_BB$` is larger than the fine-structure splitting, the field uncouples `$\mathbf L$` and `$\mathbf S$` and each precesses about `$\mathbf B$` on its own. `$J$` is no longer good; `$m_l$` and `$m_s$` are:

```math
\Delta E = \mu_B B\,(m_l + 2m_s) + a\,m_l m_s
```

The small second term is what remains of spin-orbit coupling. E1 transitions keep `$\Delta m_s = 0$` and `$\Delta m_l = 0, \pm1$`, so the `$2m_s$` part cancels and the pattern goes back to a normal triplet (each line a close doublet from the `$a\,m_lm_s$` term).

How strong is strong? Compare `$\mu_BB$` with the splitting. Sodium 3p: 17.2 cm⁻¹ / 0.467 cm⁻¹ T⁻¹ ≈ 37 T, beyond ordinary magnets. Hydrogen 2p: 0.365/0.467 ≈ 0.8 T, easily reached. Lithium 2p (0.34 cm⁻¹) is the classic laboratory case.

## 5. Magnetic resonance

Inside one level, photons of energy `$g\mu_BB$` flip the moment (`$\Delta M = \pm1$`, a magnetic dipole transition). For a free electron spin, **electron spin resonance** (ESR or EPR):

```math
h\nu = g\,\mu_B B
```

**Worked example.** An X-band spectrometer works at 9.50 GHz. Where is the free-electron resonance?

1. `$B = h\nu/(g\mu_B) = 9.50/(2.0023\times13.996) = 0.339$` T.
2. Radicals and transition-metal ions show `$g$` values shifted from 2.0023 by their orbital moments; that shift is what chemists measure.

NMR is the same idea with the nuclear magneton, 1836 times smaller: protons resonate at 42.58 MHz per tesla.

## 6. The Stark effect

An electric field acts on the electric dipole, `$H' = e\mathcal E z$`. Atomic states of definite parity have no permanent dipole, so `$\langle z\rangle = 0$` and the first-order shift vanishes, unless degenerate states of opposite parity can be mixed.

**Linear Stark effect (hydrogen).** In `$n = 2$`, the field mixes 2s and 2p (`$m = 0$`): `$\langle 2s|z|2p_0\rangle = -3a_0$`. Diagonalising the 2×2 block gives

```math
\Delta E = \pm 3\,e\,a_0\,\mathcal E, \qquad 2p_{\pm1} \text{ unshifted}
```

The `$n = 2$` level splits into three: two shifted, one (doubly degenerate) left in place.

**Worked example.** `$\mathcal E = 1.0\times10^7$` V/m on hydrogen `$n = 2$`.

1. `$3ea_0\mathcal E = 3\times(0.0529\times10^{-9}\ \text{m})\times(10^7\ \text{V/m})\ e = 1.59\times10^{-3}$` eV.
2. That is 12.8 cm⁻¹, much larger than the fine structure, so the linear treatment is fine. Below about 10⁴ V/m fine structure dominates and the shift becomes quadratic again.

**Quadratic Stark effect (every other case).** Second-order perturbation: the field induces a dipole `$\mathbf d = \alpha\boldsymbol{\mathcal E}$` and the energy drops by

```math
\Delta E = -\tfrac12\,\alpha\,\mathcal E^2
```

For the hydrogen ground state `$\alpha = \tfrac92(4\pi\varepsilon_0)a_0^3$`. Shifts depend on `$|M_J|$` but not its sign, so a level splits into `$J + \tfrac12$` or `$J + 1$` sublevels rather than `$2J+1$`. Stark shifts of laser-cooled atoms are what optical tweezers and lattices use, and very strong fields ionise the atom by tunnelling.

<div class="myth">

**"The anomalous Zeeman effect is a strange exception."** It is the usual case: any level with spin shows it. The normal triplet needs `$S = 0$` on both levels (singlets) or a field strong enough for Paschen-Back.

**"A J = 0 level splits into one sublevel shifted by the field."** It has only `$M_J = 0$` and no moment along `$\mathbf B$`: it does not move at all.

</div>

<div class="keypoints">

- `$\mu_B = 5.788\times10^{-5}$` eV/T; `$\mu_B/h = 14.0$` GHz/T; `$\mu_B/hc = 0.467$` cm⁻¹/T.
- Normal (`$S = 0$`): `$\Delta E = \mu_BBM_L$`; three lines, `$\Delta\tilde\nu = 0.467B$` cm⁻¹, `$\Delta\lambda = \lambda^2\Delta\tilde\nu$`.
- Anomalous: `$\Delta E = g_J\mu_BBM_J$`, `$g_J = 1 + [J(J+1)+S(S+1)-L(L+1)]/[2J(J+1)]$`. Na D₁: 4 lines (±2/3, ±4/3); D₂: 6 lines (±1/3, ±1, ±5/3).
- π (`$\Delta M = 0$`): linear along B, absent along B. σ (`$\Delta M = \pm1$`): circular along B.
- Paschen-Back when `$\mu_BB \gg$` fine structure: `$\Delta E = \mu_BB(m_l + 2m_s)$`, normal triplet returns.
- ESR: `$h\nu = g\mu_BB$`; 9.5 GHz at 0.34 T.
- Stark: linear only for degenerate opposite-parity states (H `$n = 2$`: `$\pm3ea_0\mathcal E$`); otherwise `$-\tfrac12\alpha\mathcal E^2$`, depending on `$|M_J|$`.

</div>

## Practise: exam questions on this lesson

They start at the definitions and climb to GATE top-rank level. Check each answer, then read the full solution. There are more on the [Zeeman and Stark practice page](/learn/courses/gate-physics/practice/zeeman-stark/).

<div class="qbank" data-bank="physics" data-topics="zeeman-stark" data-exam="gate" data-n="10"></div>

**Next:** [lesson 6.4](/learn/courses/gate-physics/rotational-spectra/) leaves atoms for molecules, starting with the slowest motion, rotation. The g factors here use the terms from [lesson 6.2](/learn/courses/gate-physics/ls-jj-coupling/).

**Going on to CSIR NET?** [Magnetic resonance: ESR and NMR](/learn/courses/csir-net-physics/esr-nmr/) drives transitions between these Zeeman levels.
