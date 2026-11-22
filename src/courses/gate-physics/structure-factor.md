---
title: Diffraction and the structure factor
summary: 'The Laue condition and Ewald sphere, the structure factor as a Fourier coefficient of the electron density, extinction rules for hcp, fluorite, perovskite and ordered alloys, the atomic form factor, Debye-Waller attenuation, powder intensities, Friedel''s law, magnetic neutron peaks and the phase problem.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'For hcp of identical atoms, which reflection is absent?'
    choices: ['(001)', '(100)', '(002)', '(101)']
    ans: 0
    why: 'F = f[1 + exp(2πi((h+2k)/3 + l/2))] vanishes when h + 2k is a multiple of 3 and l is odd. (001) qualifies; the basal reflection first appears as (002).'
  - q: 'Ordered Cu₃Au shows extra (superlattice) lines with mixed indices. Their structure factor is'
    choices: ['f_Au − f_Cu', 'f_Au + 3f_Cu', 'zero', '4f_Cu']
    ans: 0
    why: 'For mixed indices one face-centre Cu has phase +1 and two have −1, so F = f_Au + f_Cu − 2f_Cu = f_Au − f_Cu. When the sites are disordered these lines vanish.'
  - q: 'The Debye-Waller factor makes Bragg peaks'
    choices: ['weaker but still sharp, most strongly at high angles', 'broader but no weaker', 'shift to lower angles', 'vanish above the Debye temperature']
    ans: 0
    why: 'I = I₀ exp(−G²⟨u²⟩/3): the peak keeps its width, loses height (more at large G), and the lost intensity appears as diffuse background.'
sources:
  - 'N. W. Ashcroft and N. D. Mermin, Solid State Physics (1976), chapters 6 and 24'
  - 'B. D. Cullity and S. R. Stock, Elements of X-Ray Diffraction, 3rd ed. (2001), chapters 4 and 13'
  - 'C. Kittel, Introduction to Solid State Physics, 8th ed. (2005), chapter 2'
  - 'G. L. Squires, Introduction to the Theory of Thermal Neutron Scattering (1978), chapters 3 and 7'
---

**Module 7 · about 50 minutes.** Bragg's law, powder indexing and the basic cubic extinction rules are in the [JAM X-ray diffraction lesson](/learn/courses/iit-jam-physics/x-ray-diffraction/). Here we derive diffraction from the [reciprocal lattice](/learn/courses/gate-physics/reciprocal-lattice/), treat the structure factor as what it really is (a Fourier coefficient), and work the structures and effects GATE and NET like to test: hcp, fluorite, perovskite, ordered alloys, thermal vibration, form factors and magnetic order.

<div class="bigidea">A crystal diffracts only at reciprocal lattice vectors: that is where the peaks are. How strong each peak is depends on the Fourier component of the electron density at that vector: that is the structure factor. Lattice gives positions, basis gives intensities.</div>

## 1. The Laue condition and the Ewald sphere

Let a plane wave `$\vec k$` scatter elastically into `$\vec k\,'$`. Two scatterers a lattice vector `$\vec R$` apart contribute with relative phase `$e^{-i\Delta\vec k\cdot\vec R}$`, where `$\Delta\vec k = \vec k\,' - \vec k$`. Summed over `$N$` cells this is large only when every phase is 1:

```math
\Delta\vec k = \vec G \qquad\Longleftrightarrow\qquad \vec a_i\cdot\Delta\vec k = 2\pi h_i \ \ (i = 1, 2, 3)
```

These are the three **Laue equations**. Each alone puts `$\vec k\,'$` on a cone around `$\vec a_i$`; all three together need luck. With `$|\Delta\vec k| = 2k\sin\theta = 4\pi\sin\theta/\lambda$` and `$|\vec G| = 2\pi n/d$` the Laue condition becomes Bragg's law `$2d\sin\theta = n\lambda$`; the Laue reflection `$(220)$` is Bragg's second order from `$(110)$`.

**The Ewald sphere** makes this geometric. Draw `$\vec k$` ending at the reciprocal-lattice origin and a sphere of radius `$2\pi/\lambda$` about its tail. Every reciprocal lattice point on the sphere gives a diffracted beam. A fixed crystal in a monochromatic beam usually has none on it; rotating the crystal (rotating-crystal method), using many grains (powder) or using a range of wavelengths (Laue method) brings points onto it. Rotating through all orientations reaches every `$\vec G$` with `$|\vec G| \le 4\pi/\lambda$` (the limiting sphere), so the finest spacing that can ever be measured is `$d_{\min} = \lambda/2$`.

Two variants matter in practice. For **LEED** (low-energy electrons that see only the surface layers) only the two in-plane Laue equations apply, so beams exist at every wavelength: `$a\sin\phi = h\lambda$` for normal incidence. For **TEM** (`$\lambda \approx 0.025$` Å) the Ewald sphere is enormous and almost flat near the origin, so a thin crystal shows a whole plane of reciprocal lattice points at once.

**Worked example.** Cu Kα (`$\lambda = 1.54$` Å) scattered through `$2\theta = 90^\circ$` has `$|\Delta\vec k| = 4\pi\sin45^\circ/1.54 = 5.77$` Å⁻¹, so it can only come from planes with `$d = 2\pi/5.77 = 1.09$` Å.

## 2. The structure factor

With a basis of atoms at `$\vec r_j = x_j\vec a_1 + y_j\vec a_2 + z_j\vec a_3$`, the amplitude at `$\Delta\vec k = \vec G_{hkl}$` is proportional to

```math
F_{hkl} = \sum_j f_j(\vec G)\,e^{i\vec G\cdot\vec r_j} = \sum_j f_j\,e^{2\pi i(hx_j + ky_j + lz_j)}, \qquad I_{hkl} \propto |F_{hkl}|^2
```

and the electron density is its Fourier series, `$\rho(\vec r) = \frac1V\sum_{hkl}F_{hkl}\,e^{-2\pi i(hx + ky + lz)}$`.

<div class="meaning">

<dl>
<dt>`$f_j$`</dt><dd>atomic form factor: the Fourier transform of one atom's electron cloud, `$f(q) = \int\rho_{\text{atom}}e^{i\vec q\cdot\vec r}d^3r$`; equal to the number of electrons at `$q = 0$`, falling as `$q = 4\pi\sin\theta/\lambda$` grows</dd>
<dt>`$F_{hkl}$`</dt><dd>complex in general; changing the origin by `$\vec r_0$` multiplies it by `$e^{-i\vec G\cdot\vec r_0}$`, which leaves `$|F|$` alone</dd>
<dt>`$F = 0$`</dt><dd>destructive interference inside the basis; the planes still exist</dd>
<dt>Physical meaning</dt><dd>`$F_{hkl}$` asks: if I lay a density wave with wave vector `$\vec G_{hkl}$` over the cell, how much of the cell's electrons sit on its crests rather than its troughs?</dd>
</dl>

</div>

Experiments measure `$|F|^2$`, not its phase. That is the **phase problem**: the density cannot be rebuilt from intensities alone. A 1D example shows why phases matter: with `$F_0 = 10$`, `$F_{\pm1} = -3$`, `$F_{\pm2} = 2$`, the density `$a\rho(x) = F_0 + 2F_1\cos(2\pi x/a) + 2F_2\cos(4\pi x/a)$` is 8 at `$x = 0$` and 20 at `$x = a/2$`: the atom is at the centre. Flip the sign of `$F_1$` and it moves to the corner, with identical intensities. Since `$F_{\bar h\bar k\bar l} = F_{hkl}^*$` for real `$f$` (**Friedel's law**), the pattern always looks centrosymmetric; anomalous scattering near an absorption edge breaks this and is used both to find absolute structure and to solve phases (MAD).

## 3. Extinction rules beyond the cubic basics

Recall the cubic rules (derived in the JAM lesson): bcc needs `$h + k + l$` even; fcc needs unmixed indices; diamond also kills all-even with `$h + k + l = 4n + 2$`. Here are the others.

**hcp** (atoms at `$(0,0,0)$` and `$(\tfrac13,\tfrac23,\tfrac12)$`):

```math
|F_{hkl}|^2 = f^2\left\{2 + 2\cos\left[2\pi\left(\frac{h + 2k}{3} + \frac l2\right)\right]\right\}
```

It is `$4f^2$` when `$h + 2k = 3n$` and `$l$` even, **zero when `$h + 2k = 3n$` and `$l$` odd** (`$(001)$`, `$(003)$`, `$(111)$`, ...), `$f^2$` when `$h + 2k = 3n\pm1$` with `$l$` even, and `$3f^2$` when `$h + 2k = 3n\pm1$` with `$l$` odd. So `$|F_{002}|^2 : |F_{101}|^2 : |F_{100}|^2 = 4 : 3 : 1$`.

**Fluorite CaF₂** (Ca on fcc sites, F at `$\pm(\tfrac14,\tfrac14,\tfrac14)$`): for unmixed indices `$F = 4[f_{Ca} + 2f_F\cos(\pi(h + k + l)/2)]$`. So `$h + k + l$` odd gives `$4f_{Ca}$`, `$= 4n$` gives `$4(f_{Ca} + 2f_F)$` and `$= 4n + 2$` gives `$4(f_{Ca} - 2f_F)$`, which nearly vanishes because `$f_{Ca^{2+}} = 18 \approx 2f_{F^-} = 20$`.

**Perovskite ABO₃** (A corner, B body centre, O face centres): `$F_{100} = f_A - f_B - f_O$`, `$F_{110} = f_A + f_B - f_O$`, `$F_{111} = f_A - f_B + 3f_O$`, `$F_{200} = f_A + f_B + 3f_O$`. Each oxygen must be phased separately: two lie on a `$(100)$` mid-plane, one does not.

**Screw axes and glide planes** give absences on lines or planes of reciprocal space only: a `$2_1$` axis along `$c$` removes `$(00l)$` with `$l$` odd and nothing else. Lattice centring removes whole classes (`$h + k + l$` odd for I). Absences reveal symmetry, never which atoms are present.

Pick a structure and set the form factors in the figure: equal ions in rock salt reproduce KCl (looks simple cubic of half the size), equal ions in CsCl turn it into bcc.

<figure class="fig" data-fig="allowed-reflections"><figcaption>Top: two layers of the reciprocal lattice in simple cubic indexing, each spot with area proportional to |F|² (rings: F = 0; colours: h+k+l even or odd). Bottom: the powder stick pattern with multiplicities.</figcaption></figure>

<div class="problem" data-problem="structure-factor-ab"></div>

## 4. Order and disorder

Ordered Cu₃Au (Au corners, Cu face centres) gives `$F = f_{Au} + 3f_{Cu}$` for unmixed indices and `$F = f_{Au} - f_{Cu}$` for mixed ones: **superlattice lines**. Above the ordering temperature each site holds the average atom `$\tfrac14f_{Au} + \tfrac34f_{Cu}$`, the structure is fcc of identical scatterers, and the mixed lines vanish while the fundamentals stay unchanged.

For a CsCl-type alloy AB with long-range order parameter `$S$` (corner holds A with probability `$\tfrac{1+S}2$`), the superlattice amplitude is `$F = S(f_A - f_B)$`, so its intensity goes as `$S^2$`: a line at 25% of its fully ordered strength means `$S = 0.5$`. When `$f_A \approx f_B$` for X-rays (Cu and Zn), neutrons, with very different scattering lengths, see the order instead.

**Magnetic order** works the same way for neutrons, whose magnetic moment scatters from unpaired spins. If the moment at the bcc body centre points opposite to the corner moments, the magnetic structure factor is `$\propto 1 - (-1)^{h+k+l}$`: magnetic peaks appear exactly where nuclear bcc peaks are forbidden, first at `$(100)$`. In MnO (fcc, moments alternating in `$(111)$` sheets) the magnetic cell has edge `$2a$` and the first magnetic peak is at `$(\tfrac12\tfrac12\tfrac12)$` in chemical units.

## 5. What else sets the intensity

The measured powder intensity of a line is

```math
I \propto p_{hkl}\,|F_{hkl}|^2\,\underbrace{\frac{1 + \cos^2 2\theta}{\sin^2\theta\cos\theta}}_{\text{Lorentz-polarisation}}\,e^{-2W}
```

- **Multiplicity** `$p$`: the number of planes `$(hkl)$` with the same spacing, counting signs. In cubic crystals `$\{100\}$` 6, `$\{110\}$` 12, `$\{111\}$` 8, `$\{210\}$` 24, `$\{321\}$` 48.
- **Polarisation** `$(1 + \cos^22\theta)/2$` for an unpolarised beam: 0.625 at `$2\theta = 60^\circ$`, 0.5 at `$90^\circ$`.
- **Form factor**: for hydrogen 1s, `$f(q) = [1 + (qa_0/2)^2]^{-2}$`, which is already 0.25 at `$q = 2/a_0$`.
- **Debye-Waller factor** `$e^{-2W} = \exp(-G^2\langle u^2\rangle/3)$` with `$\langle u^2\rangle$` the full mean-square displacement. Thermal motion smears the density, so the peaks lose height (more at high angle and high temperature) but keep their width; the lost intensity becomes diffuse background.

**Worked example (thermal attenuation).** With `$\langle u^2\rangle = 0.010$` Å² and `$d = 1.0$` Å: `$G^2 = 39.5$` Å⁻², exponent `$0.132$`, `$I/I_0 = 0.877$`. Doubling the temperature (above `$\theta_D$`, `$\langle u^2\rangle\propto T$`) multiplies this line by another 0.877.

<div class="problem" data-problem="debye-waller-loss"></div>

A crystallite of `$N$` planes gives peaks of height `$\propto N^2$` and width `$\propto 1/N$`, so the integrated intensity `$\propto N$`: the basis of the Scherrer size formula you can apply with the [XRD peak calculator](/science/xrd-peak-calculator/). For electron patterns use the [electron diffraction indexer](/science/electron-diffraction-indexer/), and open real structures in the [CIF viewer](/science/cif-viewer/).

<div class="myth">

**"A forbidden reflection is exactly zero, always."** Only in the model of identical, spherical, point-like scatterers. Silicon's "forbidden" `$(222)$` is weakly seen because covalent bond charge between the atoms is not spherical; ordered alloys show "forbidden" lines that disorder removes; KCl's odd lines are tiny, not zero. Systematic absences from lattice centring and screw axes are exact; absences from equal form factors are approximate. Ask which kind you are dealing with.

</div>

<div class="keypoints">

- Laue: `$\Delta\vec k = \vec G$`, i.e. `$\vec a_i\cdot\Delta\vec k = 2\pi h_i$`; `$|\Delta\vec k| = 4\pi\sin\theta/\lambda$`. Ewald radius `$2\pi/\lambda$`, limiting sphere `$4\pi/\lambda$`, `$d_{\min} = \lambda/2$`.
- `$F_{hkl} = \sum f_je^{2\pi i(hx_j + ky_j + lz_j)}$`, `$I\propto|F|^2$`; origin shifts change only the phase; Friedel `$|F_{hkl}| = |F_{\bar h\bar k\bar l}|$` unless scattering is anomalous.
- hcp: absent for `$h + 2k = 3n$`, `$l$` odd; `$|F|^2 = 4, 3, 1\ (\times f^2)$` otherwise. Fluorite: `$4(f_{Ca} - 2f_F)$` for `$h + k + l = 4n + 2$`.
- Superlattice lines `$\propto (f_A - f_B)^2S^2$` vanish on disorder; antiferromagnets add neutron peaks where nuclear ones are forbidden or at half-integer indices.
- Powder intensity `$\propto p|F|^2\times$` LP `$\times e^{-G^2\langle u^2\rangle/3}$`. Debye-Waller weakens peaks without broadening them.

</div>

## Practise: exam questions on this lesson

<div class="qbank" data-bank="physics" data-topics="structure-factor" data-exam="gate" data-n="10"></div>

**Next:** [lesson 7.3](/learn/courses/gate-physics/bonding/) asks what holds these atoms in place: ionic, covalent, metallic and van der Waals bonding.
