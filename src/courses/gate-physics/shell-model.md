---
title: The nuclear shell model
summary: 'Evidence for magic numbers, the mean-field potential from the oscillator to the Woods-Saxon well, the strong spin-orbit force that gives 2, 8, 20, 28, 50, 82 and 126, ground-state spin and parity of odd-A and odd-odd nuclei, Schmidt magnetic moments, islands of isomerism, and where the model gives way to collective vibrations and rotations.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'In the shell model, the ground state of ¹⁷O (8 protons, 9 neutrons) is'
    choices: ['5/2⁺', '1/2⁺', '3/2⁺', '1/2⁻']
    ans: 0
    why: 'Eight protons and eight neutrons fill closed shells (0⁺). The ninth neutron goes into the next orbit, 1d5/2: j = 5/2, l = 2, parity (−1)² = +.'
  - q: 'In nuclei, the spin-orbit term'
    choices: ['puts the j = l + ½ level below j = l − ½, with a splitting that grows with l', 'puts j = l − ½ lowest, as in atoms', 'is too small to change the magic numbers', 'acts only on protons']
    ans: 0
    why: 'The nuclear spin-orbit force is strong and attractive for spin parallel to orbit. The splitting is proportional to 2l + 1, so for l = 3, 4, 5, 6 the j = l + ½ level drops into the shell below and creates the magic numbers 28, 50, 82 and 126.'
  - q: 'The first excited states of a deformed even-even nucleus at 45, 149 and 307 keV with spins 2⁺, 4⁺, 6⁺ are best described as'
    choices: ['a rotational band with E ∝ J(J + 1)', 'single-particle excitations across a magic gap', 'vibrational phonons with equal spacing', 'isomeric states']
    ans: 0
    why: 'E(4⁺)/E(2⁺) = 149/45 = 3.3, the rotor value 20/6. A vibrator would give about 2, and single-particle excitations in an even-even nucleus cost MeV, not tens of keV.'
sources:
  - 'K. S. Krane, Introductory Nuclear Physics (1988), chapter 5'
  - 'M. G. Mayer and J. H. D. Jensen, Elementary Theory of Nuclear Shell Structure (1955)'
  - 'A. Bohr and B. R. Mottelson, Nuclear Structure, vol. 1 (1969), chapter 3'
  - 'GATE Physics (PH) syllabus, Nuclear and Particle Physics section, published by the organising IIT each year'
---

**Module 8 · about 50 minutes.** The [liquid drop](/learn/courses/gate-physics/binding-energy-semf/) explains the smooth trends of nuclear masses. It cannot explain why nuclei with 2, 8, 20, 28, 50, 82 or 126 protons or neutrons are special. The shell model does, by treating each nucleon as moving independently in the average potential made by all the others, much as electrons move in an atom. You will need the [angular momentum lesson](/learn/courses/gate-physics/angular-momentum/) for adding `$l$` and `$s$`, and the [harmonic oscillator](/learn/courses/gate-physics/harmonic-oscillator/) for the first approximation to the well.

<div class="bigidea">Nucleons fill single-particle orbits labelled n l j in a mean-field well. A strong spin-orbit force splits each l level into j = l ± ½ and pushes the high-j levels down into the shell below, which turns the oscillator's magic numbers 2, 8, 20, 40, 70 into the observed 2, 8, 20, 28, 50, 82, 126. Paired nucleons couple to zero, so an odd-A nucleus takes the spin, parity and roughly the magnetic moment of its last nucleon.</div>

## 1. The evidence for magic numbers

- **Separation energies** fall sharply just after a magic number: `$S_n$` drops from 15.7 MeV in `$^{16}$`O to 4.1 MeV in `$^{17}$`O, and from 7.4 MeV in `$^{208}$`Pb to 3.9 MeV in `$^{209}$`Pb.
- **Excitation energies** of the first `$2^+$` state in even-even nuclei are high at closed shells (`$^{208}$`Pb: its first excited state is a `$3^-$` at 2.6 MeV) and low in between.
- **Abundance and stability**: tin (Z = 50) has ten stable isotopes, the most of any element; N = 82 has seven stable isotones. Doubly magic `$^{4}$`He, `$^{16}$`O, `$^{40}$`Ca and `$^{208}$`Pb are unusually tightly bound.
- **Neutron capture cross-sections** are tiny for magic-N nuclei, and electric quadrupole moments are near zero at magic numbers (spherical nuclei) and large between them.

## 2. Building the potential

A nucleon in the interior feels roughly constant attraction, falling to zero over the nuclear skin: a Woods-Saxon well following the density of [lesson 8.1](/learn/courses/gate-physics/nuclear-properties/). A three-dimensional harmonic oscillator is a good first guess, because it is solvable:

```math
E_N = \hbar\omega\left(N + \tfrac32\right), \qquad N = 2(n-1) + l, \qquad \hbar\omega \approx 41A^{-1/3}\ \text{MeV}
```

Shell N contains `$l = N, N-2, \ldots, 1$` or `$0$`, and holds `$(N+1)(N+2)$` nucleons of each kind (counting spin). The running totals are 2, 8, 20, 40, 70, 112, 168: right for 2, 8 and 20, wrong above. Flattening the bottom of the well (towards Woods-Saxon) lowers the high-`$l$` states within each shell, but cannot fix the numbers.

**The spin-orbit term** (Mayer and Jensen, 1949, Nobel prize 1963) does. Add `$V_{so}(r)\,\vec l\cdot\vec s$` with `$V_{so}$` negative and large:

```math
\langle\vec l\cdot\vec s\rangle = \frac{\hbar^2}2\left[j(j+1) - l(l+1) - \tfrac34\right] = \begin{cases}\ \ \tfrac l2\hbar^2 & j = l + \tfrac12\\[2pt] -\tfrac{l+1}2\hbar^2 & j = l - \tfrac12\end{cases}, \qquad \Delta E_{so} \propto \frac{2l + 1}2
```

The level with spin parallel to orbit (`$j = l + \tfrac12$`) goes down, the opposite of atoms, and the splitting grows with `$l$`. For `$1f$` (l = 3) the `$1f_{7/2}$` drops below the rest of its shell: 20 + 8 = **28**. For `$1g$` (l = 4) the `$1g_{9/2}$` joins the shell below: 40 + 10 = **50**. Likewise `$1h_{11/2}$` gives **82** and `$1i_{13/2}$` gives **126**. Each orbit holds `$2j + 1$` nucleons of one kind.

<figure class="fig" data-fig="shell-levels"><figcaption>Single-particle levels. Slide the spin-orbit strength from zero (oscillator plus l² term: magic numbers 2, 8, 20, 40, 70, 112) to full (2, 8, 20, 28, 50, 82, 126). Choose a nucleon number to fill the levels: the readout gives the last orbit and, for an odd number, the ground-state spin and parity.</figcaption></figure>

The filling order to remember (each kind of nucleon separately):

```math
1s_{1/2}\,|\,1p_{3/2}\ 1p_{1/2}\,|\,1d_{5/2}\ 2s_{1/2}\ 1d_{3/2}\,|\,1f_{7/2}\,|\,2p_{3/2}\ 1f_{5/2}\ 2p_{1/2}\ 1g_{9/2}\,|\,1g_{7/2}\ 2d_{5/2}\ 2d_{3/2}\ 3s_{1/2}\ 1h_{11/2}\,|
```

(The order within a shell varies a little from nucleus to nucleus; the gaps do not.)

## 3. Spins, parities and moments of odd-A nuclei

Nucleons in the same `$j$` orbit pair to total angular momentum 0 (the short-range attraction favours the spatially overlapping `$m, -m$` pairs). So in the **extreme single-particle model**, an odd-A nucleus has the `$j$` of its unpaired nucleon and parity `$(-1)^l$`. A nucleus one nucleon short of a closed orbit (a **hole**) has the `$j^\pi$` of that orbit too.

**Worked example.** `$^{41}$`Ca (20 protons, 21 neutrons): the 21st neutron enters `$1f_{7/2}$`, so `$7/2^-$`. `$^{39}$`K (19 protons): one proton hole in `$1d_{3/2}$`, so `$3/2^+$`. `$^{207}$`Pb (125 neutrons): a hole in `$3p_{1/2}$`, so `$1/2^-$`. All three agree with experiment. The simple model fails where levels are close and pairing prefers a different orbit, for example `$^{23}$`Na (11 protons) is `$3/2^+$`, not the `$5/2^+$` of `$1d_{5/2}$`; such nuclei are deformed.

**Magnetic moments.** With all other nucleons paired, the moment comes from the odd one. Projecting `$g_l\vec l + g_s\vec s$` onto `$\vec j$` gives the **Schmidt values**:

```math
j = l + \tfrac12:\ \ \mu = \left(j - \tfrac12\right)g_l + \tfrac12g_s, \qquad j = l - \tfrac12:\ \ \mu = \frac{j}{j+1}\left[\left(j + \tfrac32\right)g_l - \tfrac12g_s\right]
```

<div class="meaning">

<dl>
<dt>`$g_l$`</dt><dd>1 for a proton, 0 for a neutron: only a charged nucleon in orbit makes a current loop</dd>
<dt>`$g_s$`</dt><dd>5.586 for a proton, −3.826 for a neutron (free values, in nuclear magnetons)</dd>
<dt>Schmidt lines</dt><dd>plotted against `$j$`, the two formulas give two lines for protons and two for neutrons; measured moments of odd-A nuclei fall between each pair</dd>
</dl>

</div>

**Worked example.** `$^{17}$`O (neutron in `$1d_{5/2}$`, `$j = l + \tfrac12$`): `$\mu = 0 + \tfrac12(-3.826) = -1.913\,\mu_N$`; measured `$-1.894$`. `$^{39}$`K (proton hole in `$1d_{3/2}$`, `$j = l - \tfrac12$`): `$\mu = \tfrac{1.5}{2.5}[3\times1 - 2.793] = +0.124\,\mu_N$`; measured `$+0.391$`. Real moments lie between the two Schmidt lines (`$j = l \pm \tfrac12$`) rather than on them: the core is polarised, mesons carry some of the current, and `$g_s$` is effectively quenched inside nuclei.

<div class="problem" data-problem="schmidt-moment"></div>

**Odd-odd nuclei** couple the last proton `$j_p$` and last neutron `$j_n$` to `$|j_p - j_n| \le J \le j_p + j_n$` with parity `$(-1)^{l_p + l_n}$`. Nordheim's rules pick the ground state in many cases, but the model only gives the allowed range reliably. Example: `$^{38}$`Cl (`$d_{3/2}$` proton, `$f_{7/2}$` neutron) has `$J^\pi$` from `$2^-$` to `$5^-$`, and its ground state is `$2^-$`.

**Islands of isomerism.** Just below 50, 82 and 126 the high-`$j$` intruder orbits (`$g_{9/2}$`, `$h_{11/2}$`, `$i_{13/2}$`) sit next to low-`$j$` orbits of opposite parity. A transition between them needs a large change in angular momentum, so the gamma decay is slow ([lesson 8.4](/learn/courses/gate-physics/radioactive-decays/)): long-lived excited states, isomers, cluster there.

## 4. Beyond single particles: collective motion

Between closed shells many valence nucleons act together. Two kinds of collective motion appear in even-even nuclei:

- **Vibrations** of a spherical surface near closed shells: a quadrupole phonon gives a `$2^+$` state, two phonons a nearly degenerate `$0^+, 2^+, 4^+$` triplet at about twice the energy, so `$E(4^+)/E(2^+) \approx 2$`.
- **Rotations** of a deformed nucleus (rare earths, actinides): `$E_J = \dfrac{\hbar^2}{2\mathcal I}J(J+1)$` with `$J = 0, 2, 4, \ldots$`, so `$E(4^+)/E(2^+) = 20/6 = 3.33$`.

**Worked example.** `$^{238}$`U has its `$2^+$` level at 44.9 keV, so `$\hbar^2/2\mathcal I = 7.48$` keV, predicting `$4^+$` at 150 keV and `$6^+$` at 314 keV; measured 148 and 307 keV. The moment of inertia is about half the rigid-body value: the nucleus is part rigid, part superfluid.

The deformed version of the shell model (Nilsson) puts single-particle orbits in a spheroidal well; it explains the spins of odd-A deformed nuclei, which the spherical model gets wrong.

<div class="myth">

**"The shell model says nucleons orbit a centre like planets, so it contradicts the liquid drop."** There is no central body: the well is the average effect of all the nucleons on each one. The two models describe different aspects of the same system: the drop gives the bulk energy, the shells give corrections of a few MeV and decide spins and moments. Strutinsky's method adds shell corrections to the drop and reproduces masses and fission barriers far better than either alone.

</div>

<div class="keypoints">

- Evidence: drops in `$S_n$` after magic numbers, high `$2^+$` energies, many stable isotopes, small capture cross-sections, near-zero `$Q$`.
- Oscillator: `$E = \hbar\omega(N + \tfrac32)$`, `$(N+1)(N+2)$` per shell, totals 2, 8, 20, 40, 70; `$\hbar\omega \approx 41A^{-1/3}$` MeV.
- Strong spin-orbit with `$j = l + \tfrac12$` lower, splitting `$\propto 2l + 1$`: magic 2, 8, 20, 28, 50, 82, 126.
- Odd A: `$J^\pi = j^{(-1)^l}$` of the last nucleon or hole; even-even: `$0^+$`; odd-odd: `$|j_p - j_n|$` to `$j_p + j_n$`, parity `$(-1)^{l_p + l_n}$`.
- Schmidt: `$\mu = (j - \tfrac12)g_l + \tfrac12g_s$` for `$j = l + \tfrac12$`; `$\tfrac{j}{j+1}[(j + \tfrac32)g_l - \tfrac12g_s]$` for `$j = l - \tfrac12$`.
- Rotor `$E \propto J(J+1)$` (ratio 3.33); vibrator ratio about 2.

</div>

## Practise: exam questions on this lesson

<div class="qbank" data-bank="physics" data-topics="shell-model" data-exam="gate" data-n="10"></div>

**Next:** [lesson 8.4](/learn/courses/gate-physics/radioactive-decays/) uses these states and spins to understand alpha, beta and gamma decay and their selection rules.

**Going on to CSIR NET?** [The collective model and nuclear deformation](/learn/courses/csir-net-physics/collective-model/) covers the nuclei, far from magic numbers, where the shell model fails.
