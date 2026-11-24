---
title: Polarisation, Jones calculus and ray matrices
seoTitle: Polarisation, wave plates, Jones and ABCD matrices
summary: 'Optical physics for GATE 2027, part two: states of polarisation, Malus''s law, birefringence in uniaxial crystals, quarter- and half-wave plates, Jones vectors and matrices for cascaded elements, and ray-transfer (ABCD) matrices for free space, lenses and interfaces, with imaging and resonator stability conditions.'
minutes: 60
updated: 2026-11-24
quiz:
  - q: 'Unpolarised light of intensity I₀ passes through three ideal polarisers whose axes are at 0°, 45° and 90° to the vertical in that order. What intensity emerges?'
    choices: ['I₀/8', 'I₀/4', '0', 'I₀/16']
    ans: 0
    why: 'The first polariser halves the unpolarised light: I₀/2. The second, at 45°, passes cos²45° = 1/2 of it: I₀/4. The third is at 45° to the new direction, so passes another half: I₀/8. Without the middle polariser the first and third would be crossed and nothing would pass.'
  - q: 'Horizontally polarised light enters a half-wave plate whose fast axis is at 22.5° to the horizontal. How is the light polarised on leaving?'
    choices: ['Linearly, at 45° to the horizontal', 'Linearly, at 22.5° to the horizontal', 'Circularly polarised', 'Unchanged, linearly horizontal']
    ans: 0
    why: 'A half-wave plate reflects the polarisation direction about its fast axis: an angle α becomes 2θ − α. With θ = 22.5° and α = 0 the light leaves at 45°. A quarter-wave plate would be needed to make circular light.'
  - q: 'Two thin lenses of focal lengths 20 cm and 30 cm are separated by 10 cm. What is the effective focal length of the pair?'
    choices: ['15 cm', '12 cm', '25 cm', '50 cm']
    ans: 0
    why: 'The system matrix has C = −1/f_eff, with 1/f_eff = 1/f₁ + 1/f₂ − d/(f₁f₂) = 0.0500 + 0.0333 − 0.0167 = 0.0667 per cm, so f_eff = 15 cm. If the lenses touched, d = 0 would give 12 cm.'
sources:
  - 'E. Hecht, Optics, 5th ed. (2017), chapters 5, 8 and 6'
  - 'M. Born and E. Wolf, Principles of Optics, 7th ed. (1999), chapter 14 on crystal optics'
  - 'R. C. Jones, "A new calculus for the treatment of optical systems", J. Opt. Soc. Am. 31 (1941), 488 to 493'
  - 'A. E. Siegman, Lasers (1986), chapter 15 on ray matrices and stability'
  - 'GATE 2027 Physics (PH) syllabus, section on Optical Physics, https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/PH_GATE2027_Syllabus.pdf (checked 2026-11-24)'
---

**Module 3 · about 60 minutes.** The second half of the GATE 2027 optical-physics section; the first half, coherence, interferometers and diffraction, is [the previous lesson](/learn/courses/gate-physics/interference-diffraction/). By the end you will be able to describe any polarisation state with a Jones vector, push it through polarisers and wave plates with matrices, explain double refraction, and trace a ray through any chain of lenses and interfaces with 2 × 2 ABCD matrices. The JAM-level basics are in [polarisation](/learn/courses/iit-jam-physics/polarisation/) and [geometrical optics](/learn/courses/iit-jam-physics/geometrical-optics/); polarisation by reflection (Brewster angle) is in [lesson 3.7](/learn/courses/gate-physics/fresnel-equations/).

<div class="bigidea">Light is a transverse wave, so its electric field has two independent components. A polariser or a wave plate acts on the pair `$(E_x, E_y)$` as a 2 × 2 matrix, and a ray passing through lenses acts on the pair (height, angle) as another 2 × 2 matrix. In both cases a whole optical system is the product of the matrices of its parts.</div>

## 1. States of polarisation and Malus's law

For a plane wave travelling along `$z$` with time factor `$e^{i(kz - \omega t)}$`, write the field as `$(E_x, E_y)$`, each with its own amplitude and phase. If the two components are in phase (or in antiphase) the tip of the field moves along a line: **linear** polarisation. If they have equal amplitudes and a phase difference of `$\pm\pi/2$` the tip moves on a circle: **circular**. Anything else traces an ellipse: **elliptical**. Natural light is a rapidly changing mixture, called **unpolarised**, and a mixture of polarised and unpolarised parts is partially polarised.

An ideal polariser passes the component along its axis. For linearly polarised light at angle `$\theta$` to the axis, **Malus's law** gives

```math
I = I_0\cos^2\theta
```

and unpolarised light loses half its intensity at the first polariser.

**Worked example.** Unpolarised light, intensity `$I_0$`, goes through polarisers at 0° and 90°. Nothing emerges. Now insert a polariser at 45° between them: the first gives `$I_0/2$`; the 45° one gives `$\tfrac{I_0}{2}\cos^2 45^\circ = I_0/4$`; the last sees light at 45° to its axis and gives `$\tfrac{I_0}{4}\cos^245^\circ = I_0/8$`. Adding an element made more light emerge, because the middle polariser turned the polarisation direction.

## 2. Birefringence and wave plates

In a **uniaxial crystal** (calcite, quartz, rutile) the index depends on the direction of the field relative to the **optic axis**. Light polarised perpendicular to the axis (the **ordinary**, o, wave) sees `$n_o$` in every direction. Light polarised along the axis (the **extraordinary**, e, wave) sees `$n_e$`, and for other directions of travel an index between the two. A crystal is **negative** if `$n_e < n_o$` (calcite: `$n_o = 1.658$`, `$n_e = 1.486$`) and **positive** if `$n_e > n_o$` (quartz: 1.544 and 1.553). A ray entering at an angle splits into two rays with perpendicular polarisations, the **double refraction** that makes a calcite crystal show two images of a dot. Prisms built from this effect (Nicol, Glan, Wollaston) make polarisers and beam splitters.

If light travels perpendicular to the axis, the o and e components keep the same direction but move at different speeds. After a plate of thickness `$d$` they differ in phase by the **retardation**

```math
\Gamma = \frac{2\pi}{\lambda}\,|n_e - n_o|\,d
```

- **Quarter-wave plate** (QWP): `$\Gamma = \pi/2$`, thickness `$d = (m + \tfrac14)\lambda/|\Delta n|$`. With the polarisation at 45° to the axes it turns linear light into circular light, and the reverse.
- **Half-wave plate** (HWP): `$\Gamma = \pi$`. It turns linear polarisation at angle `$\alpha$` into `$2\theta - \alpha$`, where `$\theta$` is the angle of the fast axis, and reverses the handedness of circular light.

<div class="meaning">

<dl>
<dt>optic axis</dt><dd>the one direction in a uniaxial crystal along which both polarisations travel at the same speed</dd>
<dt>fast and slow axes</dt><dd>the two directions in a wave plate; the polarisation component along the lower-index axis runs ahead</dd>
<dt>retardation Γ</dt><dd>the extra phase the slow component picks up, 2πΔn·d/λ; it depends on wavelength, so a plate is exact for one colour only</dd>
<dt>Jones vector and matrix</dt><dd>the pair of complex field amplitudes (Eₓ, E_y), and the 2 × 2 matrix that an element applies to it</dd>
</dl>

</div>

**Worked example.** A zero-order quartz quarter-wave plate for sodium light at 589 nm, with `$|\Delta n| \approx 0.0092$`: `$d = 589\ \text{nm}/(4\times0.0092) = 16.0\ \mu$m`. That is thinner than a hair and fragile, so real plates are "multiple order" (`$m$` larger) or two plates cemented with crossed axes. For calcite `$d = 589/(4\times0.172) = 0.86\ \mu$m` is hopeless: its large `$\Delta n$` suits polarising prisms rather than wave plates.

## 3. Jones calculus

A fully polarised beam is written as a column of complex amplitudes, the **Jones vector**, normally with unit length:

| state | Jones vector |
|---|---|
| horizontal | `$\begin{pmatrix}1\\0\end{pmatrix}$` |
| vertical | `$\begin{pmatrix}0\\1\end{pmatrix}$` |
| linear at 45° | `$\tfrac1{\sqrt2}\begin{pmatrix}1\\1\end{pmatrix}$` |
| right circular | `$\tfrac1{\sqrt2}\begin{pmatrix}1\\-i\end{pmatrix}$` |
| left circular | `$\tfrac1{\sqrt2}\begin{pmatrix}1\\i\end{pmatrix}$` |

Handedness depends on convention; the table follows the time factor `$e^{i(kz-\omega t)}$` and the "looking towards the source" convention of Hecht. Always check the book's convention. Each element is a **Jones matrix**, and a train of elements multiplies from right to left (the first element is the rightmost):

```math
\text{horizontal polariser: } \begin{pmatrix}1&0\\0&0\end{pmatrix}, \quad \text{QWP, fast axis horizontal: } \begin{pmatrix}1&0\\0&i\end{pmatrix}, \quad \text{HWP: } \begin{pmatrix}1&0\\0&-1\end{pmatrix}
```

(An overall phase is dropped.) The slow axis gets the extra phase. For an element whose axis is at angle `$\theta$`, use `$M(\theta) = R(\theta)\,M\,R(-\theta)$` with `$R(\theta) = \begin{pmatrix}\cos\theta&-\sin\theta\\ \sin\theta&\cos\theta\end{pmatrix}$`. A linear polariser at `$\theta$` becomes `$\begin{pmatrix}\cos^2\theta&\sin\theta\cos\theta\\ \sin\theta\cos\theta&\sin^2\theta\end{pmatrix}$`. The intensity is `$|{\bf E}|^2$`, so Malus's law is `$|\cos\theta|^2$`.

**Worked example.** Light linearly polarised at 45° meets a QWP with its fast axis horizontal, then a second identical QWP.

<div class="steps">
<div class="step"><p><b>Start.</b> `$\tfrac1{\sqrt2}\begin{pmatrix}1\\1\end{pmatrix}$`.</p></div>
<div class="step"><p><b>After the first QWP.</b> `$\tfrac1{\sqrt2}\begin{pmatrix}1\\ i\end{pmatrix}$`: left circular. The plate converted linear to circular light.</p></div>
<div class="step"><p><b>After the second QWP.</b> `$\tfrac1{\sqrt2}\begin{pmatrix}1\\ i\cdot i\end{pmatrix} = \tfrac1{\sqrt2}\begin{pmatrix}1\\-1\end{pmatrix}$`: linear at −45°.</p></div>
<div class="step"><p><b>Check.</b> Two QWPs make a half-wave plate, which sends 45° to `$2(0) - 45^\circ = -45^\circ$` (fast axis at 0°). The matrix product `$\mathrm{diag}(1, i)^2 = \mathrm{diag}(1, -1)$` agrees.</p></div>
</div>

A circular polariser (a linear polariser followed by a QWP at 45° to it) is the kind used in 3D cinema glasses and camera filters. Jones calculus handles only fully polarised light; partial polarisation needs Stokes vectors and Mueller matrices.

## 4. Ray-transfer (ABCD) matrices

In the paraxial approximation a ray at a given plane is described by its height `$y$` above the axis and its angle `$\theta$` to it (small, in radians). Any lens, gap or interface changes these linearly:

```math
\begin{pmatrix}y_2\\ \theta_2\end{pmatrix} = \begin{pmatrix}A&B\\ C&D\end{pmatrix}\begin{pmatrix}y_1\\ \theta_1\end{pmatrix}, \qquad AD - BC = \frac{n_1}{n_2}
```

| element | matrix |
|---|---|
| free space, distance `$d$` | `$\begin{pmatrix}1&d\\0&1\end{pmatrix}$` |
| thin lens, focal length `$f$` | `$\begin{pmatrix}1&0\\-1/f&1\end{pmatrix}$` |
| flat interface, `$n_1 \to n_2$` | `$\begin{pmatrix}1&0\\0&n_1/n_2\end{pmatrix}$` |
| spherical interface, radius `$R$` (positive if the centre lies beyond it) | `$\begin{pmatrix}1&0\\ \dfrac{n_1 - n_2}{n_2R}&\dfrac{n_1}{n_2}\end{pmatrix}$` |

Multiply from right to left again: the first element met by the light is the rightmost matrix. The entries have a meaning:

- `$B = 0$`: every ray from a point on the input plane lands on a single point, so the planes are **conjugate** (an image), and `$A$` is the magnification.
- `$C = -1/f_{\text{eff}}$`: the effective focal length of the whole system.
- `$A = 0$`: parallel rays come to a focus on the output plane.

**Worked example (imaging).** A lens of `$f = 10$` cm, an object 30 cm before it, and a screen `$d_2$` after it. With `$f$` in cm, the product is

```math
\begin{pmatrix}1&d_2\\0&1\end{pmatrix}\begin{pmatrix}1&0\\-0.1&1\end{pmatrix}\begin{pmatrix}1&30\\0&1\end{pmatrix} = \begin{pmatrix}1 - 0.1d_2&30 - 2d_2\\-0.1&-2\end{pmatrix}
```

`$B = 0$` gives `$d_2 = 15$` cm, and then `$A = 1 - 1.5 = -0.5$`: a real, inverted image at half size. This is the lens equation `$1/30 + 1/15 = 1/10$` with `$m = -v/u$`, now obtained in one line. The determinant is `$(-0.5)(-2) = 1$`, as it must be in air.

**Worked example (two lenses).** Lenses of 20 cm and 30 cm, 10 cm apart. The system matrix is the lens-2 matrix times free space times the lens-1 matrix:

```math
\begin{pmatrix}1&0\\-\tfrac1{30}&1\end{pmatrix}\begin{pmatrix}1&10\\0&1\end{pmatrix}\begin{pmatrix}1&0\\-\tfrac1{20}&1\end{pmatrix} = \begin{pmatrix}0.5&10\\-0.0667&0.667\end{pmatrix}
```

So `$C = -0.0667$ cm⁻¹` and `$f_{\text{eff}} = 15$` cm, the general rule `$1/f = 1/f_1 + 1/f_2 - d/f_1f_2$`. The determinant is `$0.5(0.667) + 10(0.0667) = 1$`. Parallel rays focus at a back focal distance `$-A/C = 0.5/0.0667 = 7.5$` cm behind the second lens. The rear principal plane therefore lies `$15 - 7.5 = 7.5$` cm in front of the second lens, and `$f_{\text{eff}}$` is measured from it.

**Resonator stability.** A ray in a laser cavity makes a round trip through the same matrix over and over. It stays inside only if the eigenvalues are complex numbers of unit modulus, which requires

```math
-1 \le \frac{A + D}{2} \le 1 \quad\Longleftrightarrow\quad 0 \le g_1g_2 \le 1, \qquad g_i = 1 - \frac{L}{R_i}
```

for a two-mirror cavity of length `$L$` and mirror radii `$R_i$`. For two mirrors with `$R = 1$` m, a length `$L = 0.5$` m gives `$g = 0.5$` each and `$g_1g_2 = 0.25$`: stable (the half trace is `$2g_1g_2 - 1 = -0.5$`). At `$L = 3$` m, `$g = -2$` and `$g_1g_2 = 4$`: unstable; the half trace is 7.

<div class="myth">

**"A quarter-wave plate always makes circular light."** Only if the incoming linear polarisation is at 45° to the plate's axes. At other angles the output is elliptical, and at 0° or 90° it stays linear.

**"Polarisers just absorb half the light."** Only for unpolarised light. For already polarised light the loss follows Malus's law, and a polariser placed between two crossed ones lets light through.

**"The ABCD matrix of two elements is the first matrix times the second."** Order matters: the ray meets the first element first, so its matrix stands on the right.

</div>

<div class="keypoints">

- Malus: `$I = I_0\cos^2\theta$`; unpolarised light loses half at the first polariser. Three polarisers at 0°, 45°, 90° pass `$I_0/8$`.
- Uniaxial crystals: o ray `$n_o$`, e ray `$n_e$`; retardation `$\Gamma = 2\pi|\Delta n|d/\lambda$`; QWP `$\pi/2$`, HWP `$\pi$`.
- QWP at 45° converts linear and circular. HWP at `$\theta$` turns angle `$\alpha$` into `$2\theta - \alpha$`.
- Jones: horizontal `$(1,0)$`, 45° `$(1,1)/\sqrt2$`, circular `$(1,\mp i)/\sqrt2$`. QWP `$\mathrm{diag}(1, i)$`, HWP `$\mathrm{diag}(1,-1)$`, polariser `$\mathrm{diag}(1,0)$`; rotate with `$R(\theta)MR(-\theta)$`.
- ABCD: free space `$\begin{pmatrix}1&d\\0&1\end{pmatrix}$`, lens `$\begin{pmatrix}1&0\\-1/f&1\end{pmatrix}$`; first element rightmost; `$AD - BC = n_1/n_2$`.
- `$B = 0$` imaging with magnification `$A$`; `$C = -1/f_{\text{eff}}$`; two lenses `$1/f = 1/f_1 + 1/f_2 - d/f_1f_2$`.
- Resonator stable if `$0 \le g_1g_2 \le 1$`, `$g = 1 - L/R$`.

</div>

## Practise: exam questions on this lesson

From definitions up to GATE top-rank level, with full solutions. More on the [polarisation practice page](/learn/courses/gate-physics/practice/polarisation/) and the [geometrical optics practice page](/learn/courses/gate-physics/practice/geometrical-optics/).

<div class="qbank" data-bank="physics" data-topics="polarisation,geometrical-optics" data-exam="gate" data-n="10"></div>

**Before this:** [lesson 3.11, interference and diffraction](/learn/courses/gate-physics/interference-diffraction/). **Next:** [lesson 4.1](/learn/courses/gate-physics/postulates-operators/) begins the quantum mechanics of Part C; the stability condition above returns when [lesson 6.7](/learn/courses/gate-physics/lasers/) builds laser cavities. Back to the [GATE Physics course](/learn/courses/gate-physics/).
