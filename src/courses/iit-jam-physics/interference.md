---
title: 'Interference: Young, thin films, Newton''s rings and Michelson'
seoTitle: Interference of light for IIT JAM Physics
summary: 'When two light waves add to make bright and dark fringes: coherence, the two-beam intensity formula, Young''s double slit, thin films and the phase change on reflection, wedges, Newton''s rings, the Michelson interferometer and coherence length.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'In Young''s experiment the whole apparatus is moved from air into water (n = 1.33). What happens to the fringe width?'
    choices: ['It shrinks by a factor 1.33', 'It grows by a factor 1.33', 'It stays the same', 'The fringes vanish']
    ans: 0
    why: 'In water the wavelength is λ/n, and the fringe width λD/d shrinks by the same factor n.'
  - q: 'Why does a very thin soap film look black in reflected light?'
    choices: ['One of the two reflections gains a half-wave phase shift, so they cancel when the path difference is nearly zero', 'No light reaches it', 'It absorbs all colours', 'The two reflections travel exactly one wavelength apart']
    ans: 0
    why: 'Reflection off the front (air to soap) gains a phase of π; off the back (soap to air) it does not. With almost no extra path, the reflections cancel for every colour.'
  - q: 'A Michelson mirror is moved by 0.1 mm and 316 fringes cross the centre. What is the wavelength?'
    choices: ['About 633 nm', 'About 316 nm', 'About 1266 nm', 'About 158 nm']
    ans: 0
    why: 'The light goes to the mirror and back, so 2d = Nλ, giving λ = 2(0.1 mm)/316 = 633 nm.'
sources:
  - 'E. Hecht, Optics, 5th ed. (2017), chapter 9: interference'
  - 'F. A. Jenkins and H. E. White, Fundamentals of Optics, 4th ed. (1976), chapters 13 and 14'
  - 'A. Ghatak, Optics, 7th ed. (2020), chapters 14 to 17'
  - 'IIT JAM Physics syllabus (Oscillations, Waves and Optics section), published by the organising IIT each year'
---

**Module 3 · about 50 minutes.** By the end you will be able to say when two beams can interfere at all, find the intensity anywhere in a two-beam pattern, solve every standard Young's double-slit variant (shifted, immersed, two colours, white light), get thin-film colours right by tracking the phase change on reflection, and use Newton's rings and the Michelson interferometer to measure lengths a thousand times smaller than a millimetre.

<div class="bigidea">Light added to light can make darkness: where two waves arrive half a wavelength out of step they cancel, and the pattern of bright and dark tells you the path difference to a fraction of a wavelength.</div>

## 1. Adding two waves

Two waves of the same frequency meet at a point. What adds is the **field** (the amplitude), not the brightness. If their amplitudes are `$a_1$` and `$a_2$` and they differ in phase by `$\delta$`, the intensity (which goes as amplitude squared) is

```math
I = I_1 + I_2 + 2\sqrt{I_1I_2}\cos\delta
```

The last term is the **interference term**. It makes the total bigger than `$I_1 + I_2$` where `$\cos\delta > 0$` and smaller where `$\cos\delta < 0$`. Averaged over many fringes it is zero, so no energy is created or destroyed; it is only moved from the dark places to the bright ones.

- Phase and path are linked by `$\delta = \dfrac{2\pi}{\lambda}\times(\text{path difference})$`.
- Bright where the path difference is `$m\lambda$`; dark where it is `$(m + \tfrac12)\lambda$`.
- For equal beams (`$I_1 = I_2 = I_0$`): `$I = 4I_0\cos^2(\delta/2)$`, from `$0$` to `$4I_0$`.
- For unequal beams: `$I_{\max}/I_{\min} = \left(\dfrac{\sqrt{I_1} + \sqrt{I_2}}{\sqrt{I_1} - \sqrt{I_2}}\right)^2$`.

**Coherence.** The interference term only survives if `$\delta$` stays fixed long enough to see. Two separate lamps emit in random, ever-changing phases, so their interference term averages to zero in a billionth of a second. To get fringes you split light from **one** source into two parts, by dividing the wavefront (two slits, Lloyd's mirror, a biprism) or by dividing the amplitude (a thin film, a half-silvered mirror).

## 2. Young's double slit

Light from one narrow slit falls on two slits a distance `$d$` apart, and a screen is a distance `$D \gg d$` away. At height `$y$` on the screen the two paths differ by `$d\sin\theta \approx yd/D$`. Bright fringes are where this equals `$m\lambda$`:

```math
y_m = \frac{m\lambda D}{d}, \qquad \beta = \frac{\lambda D}{d}\quad\text{(fringe width)}
```

Play with the numbers below. Notice what changes the spacing and what does not.

<figure class="fig" data-fig="two-slit"><figcaption>The strip shows the screen in the light's own colour; the graph shows the intensity. Give the slits a width and a single-slit envelope appears, and some fringes go missing (lesson 3.8).</figcaption></figure>

<div class="meaning">

<dl>
<dt>λ</dt><dd>the wavelength: longer (redder) light gives wider fringes</dd>
<dt>D</dt><dd>slit-to-screen distance: further away, wider fringes</dd>
<dt>d</dt><dd>slit separation: slits closer together give wider fringes</dd>
<dt>β = λD/d</dt><dd>distance between neighbouring bright (or dark) fringes</dd>
<dt>Physical meaning</dt><dd>The pattern magnifies a wavelength (half a micrometre) up to millimetres by the large ratio D/d. That is how Young measured the wavelength of light in 1801 with a candle and a card.</dd>
</dl>

</div>

**Worked example.** Light of 550 nm, slits 0.25 mm apart, screen 1.2 m away: `$\beta = (550\times10^{-9})(1.2)/(0.25\times10^{-3}) = 2.64\times10^{-3}$` m `$= 2.64$` mm.

<div class="problem" data-problem="fringe-width"></div>

### The variants examiners use

| Change | Effect |
|---|---|
| Whole set-up in a liquid of index `$n$` | `$\lambda \to \lambda/n$`, so `$\beta \to \beta/n$` |
| Thin sheet (index `$n$`, thickness `$t$`) over one slit | extra path `$(n - 1)t$`; pattern shifts by `$(n-1)t/\lambda$` fringes **towards** the covered slit; `$\beta$` unchanged |
| Source slit moved up | central fringe moves down; `$\beta$` unchanged |
| Two wavelengths | bright fringes coincide where `$m_1\lambda_1 = m_2\lambda_2$` (lowest common multiple) |
| White light | central fringe white, then coloured fringes (violet inside, red outside), then a washed-out grey |
| Unequal slits | minima are no longer black; visibility `$V = 2\sqrt{I_1I_2}/(I_1 + I_2)$` |

**Worked example.** A sheet of index 1.6 and thickness 6 μm covers one slit, with `$\lambda = 600$` nm. Extra path `$= 0.6\times6 = 3.6\ \mu$`m `$= 6\lambda$`, so the whole pattern slides 6 fringe widths towards that slit. The trap is `$nt$` instead of `$(n - 1)t$`: the sheet *replaces* a layer of air that was already there.

**Lloyd's mirror and the biprism** are two more ways to make two coherent sources from one. In Lloyd's mirror the second source is the slit's reflection in a glass plate at grazing incidence; the fringe at zero path difference is **dark**, which proves that reflection off a denser medium adds a phase of `$\pi$`. A Fresnel biprism of angle `$\alpha$` and index `$n$`, a distance `$a$` from the slit, makes two virtual sources `$d = 2a(n-1)\alpha$` apart. The [Double slit](/learn/double-slit/) tool lets you explore all of these interactively.

## 3. Thin films: the phase change rule

Light hitting a thin film reflects off both its surfaces. The two reflected beams interfere. You need two ingredients:

1. **Extra path.** The beam from the back surface travels `$2nt\cos r$` further (thickness `$t$`, index `$n$`, `$r$` the angle inside the film; `$2nt$` at normal incidence).
2. **Phase change on reflection.** Reflection going **from a lower index into a higher one** adds a phase of `$\pi$` (half a wavelength). Reflection from higher to lower adds nothing.

Count the `$\pi$` shifts and pick the condition:

| `$\pi$` shifts | Reflection bright | Reflection dark | Example |
|---|---|---|---|
| one (soap film in air, oil on water) | `$2nt = (m + \tfrac12)\lambda$` | `$2nt = m\lambda$` | very thin film looks black |
| zero or two (coating on glass, `$n_1 < n_2 < n_3$`) | `$2nt = m\lambda$` | `$2nt = (m + \tfrac12)\lambda$` | anti-reflection coating |

Transmitted light is always the opposite of reflected light: energy that does not reflect goes through.

**Worked example.** A soap film (`$n = 1.33$`) 300 nm thick is lit by white light. One `$\pi$` shift, so reflection is strongest when `$2nt = 798\text{ nm} = (m + \tfrac12)\lambda$`: `$\lambda = 1596, 532, 319$` nm. Only 532 nm is visible: the film looks green.

**Anti-reflection coatings.** A layer of MgF₂ (`$n = 1.38$`) on glass (`$n = 1.5$`) has two `$\pi$` shifts, which cancel. Destructive interference needs `$2nt = \lambda/2$`, so `$t = \lambda/(4n) = 550/5.52 \approx 100$` nm for green light: a "quarter-wave" layer. The cancellation is perfect only if `$n_{\text{coat}} = \sqrt{n_{\text{glass}}}$`. The [Thin-film coating simulator](/science/thin-film-coating/) shows the full reflectance curve, and the [Thin film](/science/thin-film-thickness/) tool works backwards from measured colours to the thickness.

**Wedges.** Two flat plates touching at one edge with a small angle `$\theta$` between them make a wedge of air. The thickness grows linearly, so the fringes are straight, equally spaced lines, `$\lambda/(2n\theta)$` apart. Counting fringes measures the thickness of a hair or a sheet of paper placed at the open end.

<div class="myth">

**"Zero thickness means zero path difference, so it must be bright."** Only if both reflections behave the same. In a soap film or Newton's rings with air, one reflection gains `$\pi$` and the other does not, so the zero-thickness point is *dark*. In the exam, never write a bright or dark condition until you have counted the `$\pi$` shifts. Put a liquid of index 1.6 between glass of 1.5 and 1.7 and both reflections gain `$\pi$`: now the centre is bright.

</div>

## 4. Newton's rings

A lens of large radius of curvature `$R$` rests on a flat glass plate. The air gap at distance `$r$` from the contact point is `$t \approx r^2/(2R)$`, so the fringes are circles. With one `$\pi$` shift (air gap), dark rings need `$2t = n\lambda$`:

```math
r_n^2 = n\lambda R \quad\text{(dark rings, reflected light; centre dark)}, \qquad D_{n+p}^2 - D_n^2 = 4p\lambda R
```

The radius grows as `$\sqrt n$`, so the rings crowd together as you go out. Measuring a *difference* of squared diameters removes the error from dust at the contact point. With a liquid of index `$\mu$` in the gap, `$r_n^2 = n\lambda R/\mu$`: every ring shrinks by `$\sqrt\mu$`.

**Worked example.** With `$R = 2$` m and `$\lambda = 546$` nm, the 4th dark ring has `$r = \sqrt{4\times546\times10^{-9}\times2} = 2.09$` mm.

## 5. The Michelson interferometer

A half-silvered mirror splits a beam into two arms; mirrors at the ends send the beams back to recombine. If one mirror moves by `$d$`, its beam's path changes by `$2d$` (there and back), and one fringe passes for every wavelength:

```math
2d = N\lambda
```

**Worked example.** With a 633 nm laser, counting 200 fringes means the mirror moved `$200\times633/2 = 63\,300$` nm `$= 63.3\ \mu$`m. Uses that come up in JAM:

- **Refractive index of a gas.** A cell of length `$L$` in one arm, slowly emptied: `$2(n - 1)L = N\lambda$`.
- **Close doublets.** With the sodium lines, fringes fade and return each time the mirror moves `$\lambda_1\lambda_2/(2\Delta\lambda) \approx 0.29$` mm.
- **Circular fringes.** The rings satisfy `$2d\cos\theta = m\lambda$`; as `$d \to 0$` they collapse into the centre and the field becomes uniform.
- **Compensating plate.** It gives both beams the same thickness of glass, which you need to see white-light fringes and so find exact zero path difference.

## 6. Coherence length and visibility

No source is perfectly monochromatic. Light with spread `$\Delta\lambda$` stays in step only over the **coherence length**

```math
l_c \approx \frac{\lambda^2}{\Delta\lambda}
```

Beyond that path difference, fringes fade. White light (`$\Delta\lambda \approx 300$` nm) has `$l_c \approx 1\ \mu$`m, which is why thin-film colours are seen only in very thin films; a good laser has `$l_c$` of metres. The **visibility** `$V = (I_{\max} - I_{\min})/(I_{\max} + I_{\min})$` measures the contrast; for a single spectral line, its fall-off with path difference is the Fourier transform of the line's shape. A source of finite *size* limits the slit separation that still gives fringes (spatial coherence), which Michelson used to measure the angular diameters of stars.

<div class="keypoints">

- Amplitudes add, not intensities: `$I = I_1 + I_2 + 2\sqrt{I_1I_2}\cos\delta$`, with `$\delta = 2\pi\times$` path difference `$/\lambda$`. Equal beams: `$4I_0\cos^2(\delta/2)$`.
- Only coherent beams (split from one source) interfere. Division of wavefront: slits, Lloyd's mirror, biprism. Division of amplitude: films, beam splitters.
- Young: `$\beta = \lambda D/d$`. In a liquid `$\beta/n$`; a sheet shifts the pattern by `$(n - 1)t/\lambda$` fringes towards it.
- Thin films: count the `$\pi$` shifts (low to high index) before writing `$2nt = m\lambda$` or `$(m + \tfrac12)\lambda$`. Quarter-wave coating `$t = \lambda/4n$`.
- Newton's rings: `$r_n^2 = n\lambda R/\mu$` for dark rings; use `$D_{n+p}^2 - D_n^2 = 4p\lambda R/\mu$`.
- Michelson: `$2d = N\lambda$`; gas cell `$2(n-1)L = N\lambda$`; coherence length `$\lambda^2/\Delta\lambda$`.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. More on the [interference practice page](/learn/courses/iit-jam-physics/practice/interference/).

<div class="qbank" data-bank="physics" data-topics="interference" data-exam="jam" data-n="10"></div>

**Next:** [lesson 3.8](/learn/courses/iit-jam-physics/diffraction/) explains what happens inside each slit (diffraction) and how many slits together make a grating. The thin-film rules return in [lesson 3.9](/learn/courses/iit-jam-physics/polarisation/) on polarisation and in X-ray diffraction ([lesson 7.2](/learn/courses/iit-jam-physics/x-ray-diffraction/)).

**Go deeper:** GATE Physics works out the reflection phases behind thin films exactly in [the Fresnel equations](/learn/courses/gate-physics/fresnel-equations/), and the coherence of laser light in [Einstein coefficients and lasers](/learn/courses/gate-physics/lasers/).
