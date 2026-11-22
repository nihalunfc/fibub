---
title: 'Diffraction: single slit, gratings and resolving power'
seoTitle: Diffraction, gratings and resolving power (IIT JAM)
summary: 'Why light spreads round edges, the single-slit pattern and its intensity formula, double and N-slit patterns with missing orders, the diffraction grating (orders, dispersion, resolving power), the Rayleigh limit of telescopes and eyes, and Fresnel zones and zone plates.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'A single slit is made narrower. What happens to the central bright band of its diffraction pattern?'
    choices: ['It gets wider', 'It gets narrower', 'It stays the same width', 'It splits in two']
    ans: 0
    why: 'The first minima are at sin θ = λ/a, so a smaller slit width a pushes them further out: the narrower the opening, the more the light spreads.'
  - q: 'A grating has slit width a and spacing d = 4a. Which orders are missing?'
    choices: ['4, 8, 12, ...', '2, 4, 6, ...', '1, 2, 3, ...', 'None']
    ans: 0
    why: 'An order m is missing when it lands on a single-slit zero, which happens when m is a multiple of d/a = 4.'
  - q: 'What sets the smallest angle a telescope can resolve?'
    choices: ['The diameter of its objective and the wavelength, through 1.22λ/D', 'The focal length of its eyepiece', 'Its magnification', 'The length of its tube']
    ans: 0
    why: 'Each star makes an Airy disc of angular radius 1.22λ/D. Magnifying the image does not separate discs that already overlap.'
sources:
  - 'E. Hecht, Optics, 5th ed. (2017), chapter 10: diffraction'
  - 'F. A. Jenkins and H. E. White, Fundamentals of Optics, 4th ed. (1976), chapters 15 to 18'
  - 'A. Ghatak, Optics, 7th ed. (2020), chapters 18 to 20'
  - 'IIT JAM Physics syllabus (Oscillations, Waves and Optics section), published by the organising IIT each year'
---

**Module 3 · about 50 minutes.** By the end you will be able to find the minima and the intensity anywhere in a single-slit pattern, explain how a double slit and an N-slit grating build on it, predict missing orders, use the grating equation with its dispersion and resolving power, apply the Rayleigh criterion to telescopes, cameras and eyes, and use Fresnel zones to explain zone plates and the bright spot behind a disc.

<div class="bigidea">Every point of an opening sends out its own wavelet; the light you see in each direction is what is left after all those wavelets interfere, so a narrow opening spreads light wide and many openings send it in sharp beams.</div>

## 1. Interference from inside the opening

In [lesson 3.7](/learn/courses/iit-jam-physics/interference/) the slits were so narrow that each acted as a single point source. Real openings have a width, and **every point across the opening is a source** of wavelets (Huygens' principle). Diffraction is just interference between all of them.

Two set-ups are used:

- **Fraunhofer** (far field): source and screen effectively at infinity, so the wavefronts at the aperture are plane. In practice, lenses do this. The pattern keeps its shape and only grows with distance. JAM is mostly about this case.
- **Fresnel** (near field): source or screen at a finite distance, so the curvature of the waves matters. The pattern changes shape as you move the screen.

## 2. The single slit

A slit of width `$a$`, plane wave at normal incidence. Look in a direction `$\theta$`: the wavelet from one edge travels `$a\sin\theta$` further than the wavelet from the other edge.

**Where are the dark fringes?** Cut the slit into two halves. If `$a\sin\theta = \lambda$`, every point in the top half has a partner exactly `$a/2$` lower whose path is `$\lambda/2$` longer, and the pairs cancel. Cutting into 4, 6, ... strips gives the rest:

```math
a\sin\theta = m\lambda, \qquad m = \pm1, \pm2, \dots \quad\text{(minima)}
```

The central bright band runs from the first minimum on one side to the first on the other, so it is **twice as wide** as every other band. The first worked numbers: with `$\lambda = 633$` nm, `$a = 0.1$` mm and a screen 1.5 m away, the central band is `$2\lambda D/a = 2(633\times10^{-9})(1.5)/(10^{-4}) = 19.0$` mm wide.

**How bright is it in between?** Step through the phasor picture:

<div class="steps">
<div class="step"><p><b>Many small arrows.</b> Split the slit into many equal strips. Each sends a wave of the same small amplitude; draw each as a short arrow (phasor).</p></div>
<div class="step"><p><b>Straight ahead.</b> At θ = 0 all strips are in phase. The arrows line up in a straight line of length A₀: the central maximum.</p></div>
<div class="step"><p><b>At an angle.</b> Each strip is a little further behind the one before. The arrows bend into an arc of a circle. The total phase from edge to edge is 2β, with β = πa sin θ / λ.</p></div>
<div class="step"><p><b>Arc to chord.</b> The arc still has length A₀ and turns through 2β, so its radius is A₀/(2β). The resultant is the chord: A = 2 × A₀/(2β) × sin β = A₀ sin β / β.</p></div>
<div class="step"><p><b>Square it.</b> I = I₀ (sin β / β)². When the arc closes into full circles (β = mπ) the chord is zero: the minima again.</p></div>
</div>

```math
I(\theta) = I_0\left(\frac{\sin\beta}{\beta}\right)^2, \qquad \beta = \frac{\pi a\sin\theta}{\lambda}
```

The secondary maxima satisfy `$\tan\beta = \beta$`, at `$\beta = 1.43\pi, 2.46\pi, \dots$` (slightly inside the midpoints between minima), with intensities about **4.7%, 1.6%, 0.8%** of the centre.

<div class="meaning">

<dl>
<dt>a sin θ</dt><dd>how much further the wavelet from one edge travels than the wavelet from the other</dd>
<dt>β</dt><dd>half the phase difference between the two edges</dd>
<dt>(sin β / β)²</dt><dd>the fraction of the straight-ahead brightness that survives at angle θ</dd>
<dt>λ/a</dt><dd>the angular half-width of the central band: how much the light spreads</dd>
<dt>Physical meaning</dt><dd>Squeezing light through a narrower gap makes it spread more. You cannot confine a wave to a width a without giving it a spread of directions of about λ/a, the optical cousin of the uncertainty principle.</dd>
</dl>

</div>

**Oblique incidence.** If the light arrives at angle `$i$`, the minima become `$a(\sin\theta - \sin i) = m\lambda$` and the central maximum moves to `$\theta = i$`.

## 3. From two slits to a grating

Two slits of width `$a$` and spacing `$d$`: each slit gives the single-slit pattern, and the two interfere as in Young's experiment. The result is the product

```math
I = I_0\left(\frac{\sin\beta}{\beta}\right)^2\cos^2\gamma, \qquad \gamma = \frac{\pi d\sin\theta}{\lambda}
```

Fast fringes (spacing set by `$d$`) inside a slow envelope (width set by `$a$`). Where an interference maximum `$d\sin\theta = m\lambda$` lands on an envelope zero `$a\sin\theta = p\lambda$`, it is **missing**: orders `$m = p\,(d/a)$`. With `$d = 4a$`, orders 4, 8, ... vanish and the central envelope holds 7 bright fringes (orders −3 to 3).

With `$N$` slits the interference factor becomes

```math
\left(\frac{\sin N\gamma}{N\sin\gamma}\right)^2
```

Use the sliders: go from one slit to twelve and watch the bright peaks sharpen while their positions stay put.

<figure class="fig" data-fig="grating-pattern"><figcaption>Principal maxima stay at d sin θ = mλ whatever N is; more slits make them narrower and brighter, with N − 1 zeros and N − 2 weak maxima between neighbours. The dashed curve is the single-slit envelope.</figcaption></figure>

| Feature of the N-slit pattern | Value |
|---|---|
| Principal maxima | `$d\sin\theta = m\lambda$`, peak intensity `$\propto N^2$` |
| Between two principal maxima | `$N - 1$` zeros and `$N - 2$` secondary maxima |
| Angular half-width of a principal maximum | `$\lambda/(Nd\cos\theta)$` |
| Missing orders | multiples of `$d/a$` (when it is a whole number) |

## 4. The diffraction grating

A grating is a plate with thousands of equally spaced lines. Its principal maxima obey the **grating equation**:

```math
d\sin\theta = m\lambda \quad(\text{normal incidence}), \qquad d(\sin\theta - \sin i) = m\lambda \quad(\text{incidence at } i)
```

**Worked example.** A grating with 4000 lines per cm (`$d = 2.5\ \mu$`m) is lit by sodium light, `$\lambda = 589$` nm.

1. First order: `$\sin\theta = 0.589/2.5 = 0.2356$`, `$\theta = 13.63^\circ$`. Second order: `$\sin\theta = 0.4712$`, `$\theta = 28.11^\circ$` (not double the first angle: the *sines* go up in steps).
2. Highest order: `$m < d/\lambda = 4.24$`, so 4.

<div class="problem" data-problem="grating-angle"></div>

**Dispersion and overlap.** Differentiating gives `$d\theta/d\lambda = m/(d\cos\theta)$`: higher orders spread colours more. Red is bent **more** than violet (the opposite of a prism), and orders overlap: the second-order red (`$2\times700 = 1400$` nm) lies beyond the third-order violet (`$3\times400 = 1200$` nm).

**Resolving power.** Two wavelengths are just resolved when the peak of one falls on the first zero beside the other. Since that zero is `$\lambda/(Nd\cos\theta)$` from the peak and the dispersion is `$m/(d\cos\theta)$`:

```math
\frac{\lambda}{\Delta\lambda} = mN
```

**Worked example.** The mercury yellow lines at 577.0 and 579.1 nm need `$N \ge 578/2.1 = 275$` lines in the first order: a tiny grating is enough. The sodium D lines (0.6 nm apart) need 983 lines. The [Diffraction pattern generator](/science/diffraction-patterns/) draws these patterns for slits, gratings and apertures, and the [Spectrometer calibration](/science/spectrometer-calibration/) tool turns grating measurements into a wavelength scale.

<div class="myth">

**"More slits means the bright lines move."** They do not. The positions of the principal maxima depend only on the spacing `$d$`: `$d\sin\theta = m\lambda$`. Adding slits makes each line **sharper** (half-width `$\propto 1/N$`) and brighter (`$\propto N^2$`), which is exactly why a grating with thousands of lines can separate wavelengths a fraction of a nanometre apart while two slits cannot.

</div>

## 5. Circular apertures and resolving power

A circular hole (a lens, a telescope mirror, the pupil of your eye) gives a bright **Airy disc** surrounded by faint rings. Its first dark ring is at

```math
\sin\theta = 1.22\,\frac{\lambda}{D}
```

**Rayleigh's criterion:** two point sources are just resolved when the centre of one Airy disc falls on the first dark ring of the other, so the limit of resolution is `$\theta_{\min} = 1.22\lambda/D$`. The factor 1.22 comes from the circular shape (it is 1 for a slit).

**Worked example.** A space telescope with a 2.4 m mirror at 500 nm: `$\theta_{\min} = 1.22\times500\times10^{-9}/2.4 = 2.5\times10^{-7}$` rad, about 0.05 arcseconds. In a camera, the Airy disc on the sensor has radius `$1.22\lambda f/D$`, which depends only on the f-number `$f/D$`.

A bigger aperture or a shorter wavelength improves resolution; more magnification does not.

## 6. Fresnel zones and the zone plate

Look at a point `$P$` a distance `$b$` behind an opening lit by a plane wave. Divide the wavefront into rings whose distances from `$P$` grow by `$\lambda/2$` each: the **Fresnel half-period zones**, of radii

```math
r_n = \sqrt{n\lambda b}
```

All zones have the same area, and neighbouring zones arrive out of phase, so they nearly cancel in pairs. The whole unobstructed wave gives about **half** the amplitude of the first zone alone. Consequences:

- A hole showing exactly one zone gives **four times** the intensity at `$P$` of no screen at all; a hole showing two zones gives nearly darkness.
- Behind a small opaque disc the zones outside still add up, so there is a bright spot in the middle of the shadow (the Poisson or Arago spot).
- A **zone plate** blocks every other zone, so the rest add in phase: it focuses like a lens with focal length `$f = r_1^2/\lambda$`, plus weaker foci at `$f/3, f/5, \dots$`. With `$r_1 = 1$` mm and `$\lambda = 600$` nm, `$f = 10^{-6}/(6\times10^{-7}) = 1.67$` m.

**Babinet's principle.** Two complementary screens (a slit and a wire of the same width) give the same Fraunhofer pattern everywhere except the central spot. That is how a laser can measure the thickness of a hair.

<div class="keypoints">

- Diffraction is interference between wavelets from every point of an opening. Fraunhofer: plane waves, far field; Fresnel: near field.
- Single slit: minima `$a\sin\theta = m\lambda$` (`$m \ne 0$`), `$I = I_0(\sin\beta/\beta)^2$` with `$\beta = \pi a\sin\theta/\lambda$`; central band twice as wide; first side maximum 4.7%.
- Double and N slits: envelope × interference factor; missing orders at multiples of `$d/a$`; `$N - 1$` zeros and `$N - 2$` side maxima between principal maxima.
- Grating: `$d\sin\theta = m\lambda$`, highest order `$< d/\lambda$`, dispersion `$m/(d\cos\theta)$`, half-width `$\lambda/(Nd\cos\theta)$`, resolving power `$mN$`.
- Circular aperture: first zero at `$1.22\lambda/D$`; Rayleigh limit `$1.22\lambda/D$`.
- Fresnel zones `$r_n = \sqrt{n\lambda b}$`; zone plate `$f = r_1^2/\lambda$`, extra foci at `$f/3, f/5, \dots$`

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. More on the [diffraction practice page](/learn/courses/iit-jam-physics/practice/diffraction/).

<div class="qbank" data-bank="physics" data-topics="diffraction" data-exam="jam" data-n="10"></div>

**Next:** [lesson 3.9](/learn/courses/iit-jam-physics/polarisation/) turns to polarisation. Diffraction by the regular rows of atoms in a crystal is the subject of [lesson 7.2](/learn/courses/iit-jam-physics/x-ray-diffraction/) (X-ray diffraction and Bragg's law), and the [GATE Physics course](/learn/courses/gate-physics/) extends it to the structure factor. For telescopes in practice, see the [astronomy course](/learn/courses/astronomy/).
