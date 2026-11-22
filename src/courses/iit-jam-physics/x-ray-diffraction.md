---
title: X-ray diffraction and Bragg's law
seoTitle: X-ray diffraction and Bragg's law for IIT JAM Physics
summary: 'Why crystals reflect X-rays only at special angles, Bragg''s law and the Laue condition, the structure factor and why some reflections go missing in bcc, fcc and diamond, and how to index a powder pattern to find the lattice constant.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'A diffractometer shows a peak at 2θ = 40° with λ = 1.54 Å. Which angle goes into Bragg''s law?'
    choices: ['20°', '40°', '80°', '50°']
    ans: 0
    why: 'Diffractometers report the total deflection 2θ. Bragg''s law uses the glancing angle θ, half of it.'
  - q: 'Which reflection is the first (lowest-angle) line of a bcc metal?'
    choices: ['(110)', '(100)', '(111)', '(200)']
    ans: 0
    why: 'In bcc only h + k + l even survives. (100) and (111) are odd and vanish; (110) has the smallest h² + k² + l² among the allowed ones.'
  - q: 'The first powder lines of a cubic crystal have sin²θ in the ratio 3 : 4 : 8 : 11. What is the structure?'
    choices: ['Face-centred cubic', 'Body-centred cubic', 'Simple cubic', 'Diamond cubic']
    ans: 0
    why: '3, 4, 8, 11 are h² + k² + l² for (111), (200), (220), (311): all odd or all even, the fcc rule. Diamond would skip 4.'
sources:
  - 'C. Kittel, Introduction to Solid State Physics, 8th ed. (2005), chapter 2'
  - 'B. D. Cullity and S. R. Stock, Elements of X-Ray Diffraction, 3rd ed. (2014), chapters 3 and 4'
  - 'N. W. Ashcroft and N. D. Mermin, Solid State Physics (1976), chapter 6'
  - 'IIT JAM Physics syllabus (Solid State Physics, Devices and Electronics section), published by the organising IIT each year'
---

**Module 7 · about 45 minutes.** By the end you will be able to use Bragg's law in both directions, explain why a crystal reflects only at certain angles, predict which reflections a structure allows, and turn a list of powder-pattern angles into a crystal structure and a lattice constant. You need Miller indices and `$d_{hkl}$` from [lesson 7.1](/learn/courses/iit-jam-physics/crystal-structure/).

<div class="bigidea">A crystal is a three-dimensional diffraction grating. X-rays bounce off every plane of atoms, and only at angles where all those reflections arrive in step does a bright beam come out.</div>

## 1. Why X-rays?

To see a grating, you need light with a wavelength similar to its spacing. Atomic planes are 1 to 5 Å apart. Visible light, at 4000 to 7000 Å, is a thousand times too long: no angle would work. X-rays from a copper target (`$\lambda = 1.54$` Å) or a molybdenum target (`$0.71$` Å) are just right. Electrons and neutrons work too, because they have de Broglie wavelengths:

```math
\lambda_{\text{electron}} = \frac{h}{\sqrt{2m_e eV}} \approx \frac{12.26}{\sqrt{V}}\ \text{Å}, \qquad \lambda_{\text{neutron}} = \frac{h}{\sqrt{2m_n E}} \approx 1.8\ \text{Å at } 0.025\text{ eV}
```

Electrons are scattered strongly (good for thin films and surfaces); neutrons see light atoms such as hydrogen and the magnetic order of spins.

## 2. Bragg's law

W. L. Bragg pictured the crystal as a stack of partly reflecting mirrors, the atomic planes, a distance `$d$` apart. A ray reflecting from the second plane travels further than one reflecting from the first. The extra distance is `$d\sin\theta$` on the way in plus `$d\sin\theta$` on the way out, where `$\theta$` is the **glancing angle** between the ray and the planes. The reflections add up only when this extra path is a whole number of wavelengths:

```math
2d\sin\theta = n\lambda, \qquad n = 1, 2, 3, \ldots
```

<figure class="fig" data-fig="bragg-reflection"><figcaption>The coloured segment is the extra path 2d sin θ. Slide θ: the graph below shows that a stack of 12 planes reflects strongly only near the Bragg angles, where the extra path is a whole number of wavelengths. More planes make the peaks sharper.</figcaption></figure>

<div class="meaning">

<dl>
<dt>d</dt><dd>the spacing of one family of parallel planes, d<sub>hkl</sub></dd>
<dt>θ</dt><dd>the glancing angle, measured from the planes, not from their normal; the beam is turned through 2θ</dd>
<dt>n</dt><dd>the order of reflection: how many whole wavelengths the extra path holds</dd>
<dt>Physical meaning</dt><dd>Each plane reflects only a tiny fraction of the beam, but thousands of planes reflecting in step build a strong beam. One wavelength off at the thousandth plane, and they cancel. That is why Bragg peaks are sharp.</dd>
</dl>

</div>

Two consequences you must know:

- **A largest wavelength.** Since `$\sin\theta \le 1$`, reflection needs `$\lambda \le 2d$`, and the highest order is the whole number part of `$2d/\lambda$`.
- **Higher orders are just other planes.** `$2d\sin\theta = 2\lambda$` is the same as `$2(d/2)\sin\theta = \lambda$`, and `$d_{hkl}/2 = d_{2h\,2k\,2l}$`. So the second order from `$(111)$` is written as `$(222)$`, and in cubic crystals we usually set `$n = 1$` and let the indices carry the order:

```math
\sin^2\theta = \frac{\lambda^2}{4a^2}\,(h^2 + k^2 + l^2)
```

**Worked example.** Copper (fcc, `$a = 3.61$` Å) is studied with `$\lambda = 1.54$` Å. Find the angle of the `$(111)$` reflection.

1. `$d_{111} = 3.61/\sqrt3 = 2.084$` Å.
2. `$\sin\theta = 1.54/(2\times2.084) = 0.3694$`, so `$\theta = 21.7^\circ$`.
3. The diffractometer shows the peak at `$2\theta = 43.4^\circ$`. Putting `$43.4^\circ$` into Bragg's law is the most common mistake in this topic.

## 3. The Laue picture and the Ewald sphere

The same condition, seen in reciprocal space ([lesson 7.1](/learn/courses/iit-jam-physics/crystal-structure/), section 6): an incident wave `$\vec k$` scatters elastically into `$\vec k'$` with `$|\vec k'| = |\vec k| = 2\pi/\lambda$`, and the scattered waves from all lattice points add in step only when

```math
\vec k' - \vec k = \vec G \qquad\text{(Laue condition)}
```

where `$\vec G$` is a reciprocal lattice vector. Because `$|\vec G_{hkl}| = 2\pi/d_{hkl}$` and `$|\vec k' - \vec k| = 2k\sin\theta$`, this is exactly Bragg's law. Ewald's construction draws a sphere of radius `$2\pi/\lambda$`: a beam comes out whenever a reciprocal lattice point lies on the sphere. For a fixed crystal and one wavelength that rarely happens, which is why there are three experimental methods:

| Method | Beam | Sample | What varies |
|---|---|---|---|
| Laue | white (all wavelengths) | fixed single crystal | `$\lambda$`: each plane picks its own; used to find orientation and symmetry |
| Rotating crystal | one wavelength | single crystal turned | `$\theta$` |
| Powder (Debye-Scherrer) | one wavelength | fine powder | `$\theta$`: some grain always has the right angle; rings or peaks |

## 4. Why some reflections are missing: the structure factor

Bragg's law says *where* a reflection could be. Whether it actually appears depends on what is inside the cell. Each atom `$j$` at fractional position `$(x_j, y_j, z_j)$` scatters a wave with phase `$2\pi(hx_j + ky_j + lz_j)$`. Adding them gives the **structure factor**:

```math
F_{hkl} = \sum_j f_j\,e^{2\pi i(hx_j + ky_j + lz_j)}, \qquad I_{hkl} \propto |F_{hkl}|^2
```

`$f_j$` is the atomic form factor: equal to the number of electrons `$Z$` in the forward direction, falling at higher angles.

**Worked example (bcc).** Identical atoms at `$(0,0,0)$` and `$(\tfrac12,\tfrac12,\tfrac12)$`:

1. `$F = f\left[1 + e^{i\pi(h + k + l)}\right]$`.
2. If `$h + k + l$` is even, `$e^{i\pi\cdot\text{even}} = 1$` and `$F = 2f$`.
3. If it is odd, `$F = f(1 - 1) = 0$`: the reflection vanishes.

In plain words: for `$(100)$` the body-centre atoms form a plane exactly halfway between the cube faces, and their reflection is half a wavelength out of step. They cancel the face reflection perfectly.

| Structure | Allowed `$(hkl)$` | First lines (`$h^2+k^2+l^2$`) |
|---|---|---|
| Simple cubic | all | 1, 2, 3, 4, 5, 6, 8, 9 (7 is impossible) |
| bcc | `$h + k + l$` even | 2, 4, 6, 8, 10, 12, 14, 16 |
| fcc | all odd or all even | 3, 4, 8, 11, 12, 16, 19, 20 |
| Diamond | all odd, or all even with `$h + k + l = 4m$` | 3, 8, 11, 16, 19, 24 |

With two kinds of atom, lines weaken rather than vanish. In CsCl, `$F = f_{\rm Cs} \pm f_{\rm Cl}$`: all simple cubic lines appear, the odd ones weak. In rock salt, `$F = 4(f_+ + f_-)$` for all even and `$4(f_+ - f_-)$` for all odd. In KCl the two ions both have 18 electrons, the odd lines all but disappear, and the pattern masquerades as simple cubic with half the real cube edge.

<div class="myth">

**"A missing reflection means those planes are not there."** The planes are there; their reflection is cancelled by extra atoms lying between them, exactly out of step. Missing reflections are not a nuisance but a fingerprint: they tell bcc from fcc from diamond, and the strength of the weak lines in CsCl or an ordered alloy measures the difference between the atoms.

</div>

## 5. Indexing a powder pattern

Here is the procedure for a cubic crystal, the most common exam task:

<div class="steps">
<div class="step"><p><b>Halve the angles.</b> Convert each peak position 2θ into θ.</p></div>
<div class="step"><p><b>Square the sines.</b> Work out sin²θ for each line. They are proportional to h² + k² + l².</p></div>
<div class="step"><p><b>Divide by the first.</b> Ratios 1 : 2 : 3 : 4 : 5 : 6 : 8 mean simple cubic; 1 : 2 : 3 : 4 : 5 : 6 : 7 : 8 (that is, 2 : 4 : 6 : ...) mean bcc; 3 : 4 : 8 : 11 means fcc; 3 : 8 : 11 : 16 means diamond.</p></div>
<div class="step"><p><b>Assign indices.</b> Match each line to its allowed (hkl).</p></div>
<div class="step"><p><b>Get the lattice constant.</b> a = λ√(h² + k² + l²) / (2 sin θ), from any line (high-angle lines give the best accuracy).</p></div>
</div>

**Worked example.** A cubic powder with `$\lambda = 1.54$` Å shows its first two lines at `$\theta = 21.68^\circ$` and `$25.25^\circ$`.

1. `$\sin^2\theta = 0.1365$` and `$0.1820$`: ratio `$1.333 = 4/3$`.
2. The first two lines in the ratio `$3 : 4$` are `$(111)$` and `$(200)$`: fcc. (sc and bcc both start `$1 : 2$`.)
3. `$a = 1.54\sqrt3/(2\times0.3694) = 3.61$` Å.

A trap: simple cubic and bcc have the same ratios for the first six lines. Only the seventh decides, because no sum of three squares equals 7.

<div class="problem" data-problem="bragg-lattice"></div>

## 6. What else the peaks tell you

- **Peak shift.** Differentiating Bragg's law, `$\Delta d/d = -\cot\theta\,\Delta\theta$`. Expansion moves peaks to lower angle, and high-angle peaks move most, so precise lattice constants use back-reflection peaks.
- **Peak width.** Small crystallites broaden peaks (Scherrer: `$\tau = K\lambda/(\beta\cos\theta)$`, with `$K \approx 0.9$` and `$\beta$` the width in radians of `$2\theta$`). Strain broadens them too; the Williamson-Hall plot of `$\beta\cos\theta$` against `$\sin\theta$` separates the two (intercept: size, slope: strain).
- **Temperature.** Thermal vibration lowers peak heights by the Debye-Waller factor `$e^{-2W}$`, more at high angles, and adds a diffuse background, but leaves the peaks sharp.

**Worked example (Scherrer).** A peak at `$2\theta = 40^\circ$` with `$\lambda = 0.154$` nm is `$0.50^\circ$` wide. `$\beta = 0.50\times\pi/180 = 8.73\times10^{-3}$` rad, so `$\tau = 0.9\times0.154/(8.73\times10^{-3}\times\cos20^\circ) = 16.9$` nm.

Real patterns are easy to try: the [XRD peak calculator](/science/xrd-peak-calculator/) turns peak positions into d-spacings and crystallite sizes, the [electron diffraction indexer](/science/electron-diffraction-indexer/) does the same for TEM patterns, and the [Lattice FFT](/science/lattice-fft/) shows how a microscope image of a lattice turns into a diffraction-like spot pattern. Diffraction by slits and gratings, the optics behind all of this, is in [lesson 3.8](/learn/courses/iit-jam-physics/diffraction/).

<div class="keypoints">

- Bragg: `$2d\sin\theta = n\lambda$`, with `$\theta$` the glancing angle (half the detector angle `$2\theta$`). Needs `$\lambda \le 2d$`.
- n-th order from `$(hkl)$` = first order from `$(nh\,nk\,nl)$`. Cubic: `$\sin^2\theta \propto h^2 + k^2 + l^2$`.
- Laue condition `$\vec k' - \vec k = \vec G$` is Bragg's law in reciprocal space; methods: Laue (white beam), rotating crystal, powder.
- Structure factor `$F = \sum f_je^{2\pi i(hx_j+ky_j+lz_j)}$`, intensity `$\propto |F|^2$`.
- bcc: `$h+k+l$` even; fcc: unmixed; diamond: fcc rule and no `$h+k+l = 4m + 2$` for all-even.
- Index powder lines by `$\sin^2\theta$` ratios: sc 1:2:3:4:5:6:8, bcc 2:4:6:8, fcc 3:4:8:11, diamond 3:8:11:16.
- Electron `$\lambda \approx 12.26/\sqrt V$` Å; Scherrer `$\tau = K\lambda/(\beta\cos\theta)$`.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. There are more on the [X-ray diffraction practice page](/learn/courses/iit-jam-physics/practice/x-ray-diffraction/).

<div class="qbank" data-bank="physics" data-topics="x-ray-diffraction" data-exam="jam" data-n="10"></div>

**Next:** [lesson 7.3](/learn/courses/iit-jam-physics/semiconductors/) moves from where the atoms are to what their electrons do: bands, gaps and the Fermi level. The [GATE Physics course](/learn/courses/gate-physics/) takes diffraction further, with the full structure factor algebra and neutron scattering.
