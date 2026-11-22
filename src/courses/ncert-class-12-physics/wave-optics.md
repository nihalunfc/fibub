---
title: Wave Optics
seoTitle: 'Wave Optics Class 12 notes: Young’s slits, diffraction'
summary: 'Class 12 Wave Optics with animations: Huygens’ principle, reflection and refraction, interference, Young’s slits, single-slit diffraction, Malus’s law.'
minutes: 80
updated: 2026-11-22
quiz:
  - q: 'In Young’s double-slit experiment the screen is moved to twice the distance and the slit gap is also doubled. The fringe width:'
    choices: ['becomes four times', 'doubles', 'stays the same', 'becomes half']
    ans: 2
    why: 'β = λD/d. Doubling D doubles β; doubling d halves it. The two changes cancel and β stays the same.'
  - q: 'In single-slit diffraction the slit is made narrower. The central bright band:'
    choices: ['becomes narrower', 'becomes wider', 'stays the same width', 'disappears']
    ans: 1
    why: 'The width of the central maximum is 2λD/a. A smaller slit width a gives a larger width: squeezing the light spreads it out.'
  - q: 'Unpolarised light of intensity I₀ falls on two polaroids whose axes are at 60° to each other. The intensity coming out is:'
    choices: ['I₀/2', 'I₀/4', 'I₀/8', 'I₀ cos² 60°']
    ans: 2
    why: 'The first polaroid halves it to I₀/2. Malus’s law for the second: (I₀/2) cos² 60° = (I₀/2)(1/4) = I₀/8.'
sources:
  - 'NCERT Class 12 Physics, Chapter 10 “Wave Optics” (topic list only; all text, figures and questions here are original fibub work)'
  - 'T. Young (1802), “On the Theory of Light and Colours”, Philosophical Transactions of the Royal Society (for the history box)'
  - 'Visible-light wavelengths 400 to 700 nm and the speed of light c = 2.998 × 10⁸ m/s (exact SI value): standard physics references, e.g. E. Hecht, Optics, 5th edition (2016)'
  - 'É.-L. Malus (1809), law of polarisation by a second crystal, Mémoires de la Société d’Arcueil (for the history box)'
---

**Physics · Class 12 · Chapter 10 · about 80 minutes.** By the end you will be able to build a wavefront with Huygens’ principle and use it to prove the laws of reflection and refraction, explain interference and work out the fringes of Young’s experiment, explain single-slit diffraction, and use Malus’s law for polarised light.

<div class="bigidea">Light is a wave. When waves meet they add up crest to crest (bright) or crest to trough (dark), and when they squeeze through a gap about as wide as their own wavelength they spread out. Everything in this chapter (bright and dark fringes, the colours of a soap bubble, the way a polaroid cuts glare) is a consequence of adding waves with the right phase.</div>

## 1. Wavefronts and rays

In Chapter 9 you drew light as straight **rays**. That works for mirrors and lenses much bigger than the wavelength of light. To explain fringes we must remember that light is a wave.

Drop a pebble into still water. A ring of ripples spreads out. All points on one ring are at the same stage of their up-and-down motion: they are in the same **phase**. A surface that joins all points that are in the same phase is a **wavefront**.

- A point source makes **spherical** wavefronts. Far from it, a small piece of a sphere looks flat: a **plane** wavefront. Sunlight at Earth is a good example.
- A long thin source (a tube light) makes **cylindrical** wavefronts.
- A **ray** is the line along which the wave energy travels. It always cuts the wavefront at right angles.

In a medium of refractive index n the speed is v = c/n, where c = 3 × 10⁸ m/s is the speed in vacuum. When light goes from air into glass its **frequency stays the same** (it is fixed by the source) but its speed falls, so its **wavelength** becomes shorter: `$\lambda_n = \lambda/n$`. Think of a line of marching cadets who step from a tar road into thick mud: the steps get shorter, but the number of steps per second stays the same.

<div class="myth">

**“Light changes colour when it enters water.”** Colour is decided by frequency, and the frequency does not change at a boundary. Only the speed and the wavelength change. A red laser pointer still looks red to a fish.

</div>

## 2. Huygens’ principle

In 1678 the Dutch scientist Christiaan Huygens gave a simple rule that tells where a wavefront will be later, if you know where it is now.

<div class="bigidea">Every point on a wavefront acts as a new source of tiny <b>secondary wavelets</b> that spread out in all directions with the speed of the wave. The new wavefront a moment later is the <b>common tangent</b> (envelope) of these wavelets, taken on the forward side.</div>

If the wave speed is v, then after a time t each wavelet has a radius vt. The figure shows how this works for a plane front and for a spherical front. Slide the time and notice the envelope.

<figure class="fig" data-fig="c12p-wave-huygens"><figcaption>Dots on the old front (blue) are the sources of wavelets (thin arcs) of radius vt. The envelope (green) is the new front. A plane front moves ahead as a plane; a spherical front grows into a bigger sphere, of radius r₀ + vt.</figcaption></figure>

Huygens’ idea has an awkward feature: why is there no wave going backward? His wavelets are drawn only on the forward side, and a full explanation needs more advanced theory. For this course the rule works and is all you need.

You can play with wavelets of your own in [Huygens wavelets](/learn/huygens-wavelets/): draw a line of sources, add a slit, and watch the new front form.

## 3. Reflection and refraction by Huygens’ principle

Huygens’ construction explains both laws of geometrical optics, which you only accepted as experimental facts in Chapter 9. Watch the proof being built, step by step.

### 3.1 Refraction (Snell’s law)

<div class="steps" data-fig="c12p-wave-refract">
<div class="step">A plane wavefront AB travels in air (speed v₁) towards a glass surface. Rays are perpendicular to the front. Point A touches the surface first. The angle i between the front and the surface equals the angle of incidence.</div>
<div class="step">While A’s wavelet starts to grow in glass, point B of the front is still travelling in air. In a time t it reaches the surface at C, so BC = v₁t.</div>
<div class="step">In the same time t the wavelet from A, now inside the glass, has grown to a circle of radius AE = v₂t. It is smaller, because light is slower in glass (v₂ = v₁/n).</div>
<div class="step">Wavelets from points between A and C started later, so they are smaller. All of them touch one straight line: the tangent from C to the circle. CE is the refracted wavefront, and the refracted ray is AE (perpendicular to CE).</div>
<div class="step">Look at two right-angled triangles with the same hypotenuse AC. In triangle ABC, the angle at A is i, so sin i = BC/AC. In triangle AEC, the angle at C is r, the angle of refraction, so sin r = AE/AC.</div>
<div class="step">Divide: sin i / sin r = BC/AE = v₁t / v₂t = v₁/v₂. This is a constant for the two media, and it is called the refractive index n. This is <b>Snell’s law</b>: sin i / sin r = v₁/v₂ = n.</div>
</div>

```math
\frac{\sin i}{\sin r} = \frac{v_1}{v_2} = \frac{n_2}{n_1}
```

<div class="meaning">
<dl>
<dt>i, r</dt><dd>angle of incidence and of refraction, each measured from the normal to the surface</dd>
<dt>v₁, v₂</dt><dd>speed of light in the first and second medium</dd>
<dt>n₁, n₂</dt><dd>refractive indices; n = c/v</dd>
<dt>Physical meaning</dt><dd>The side of the front that enters the slower medium first slows down first, so the front swings round, like a marching column turning when one end gets stuck in mud. Light bends towards the normal when it enters a slower (denser) medium.</dd>
</dl>
</div>

A bonus result: the proof shows that light travels <b>slower</b> in glass (v₂ &lt; v₁ when r &lt; i). In the 17th century Newton’s particle picture predicted the opposite, that light speeds up in glass. When Foucault measured the speed of light in water in 1850, it was slower, and the wave picture won.

<div class="problem" data-problem="c12p-wave-speed"></div>

### 3.2 Reflection

<div class="steps" data-fig="c12p-wave-reflect">
<div class="step">A plane wavefront AB falls on a plane mirror. A touches the mirror first. The rays are perpendicular to AB, so the angle BAC between the front and the mirror equals the angle of incidence i.</div>
<div class="step">While B travels to the mirror at C, it covers BC = vt, because the wave stays in the same medium at the same speed.</div>
<div class="step">In the same time the wavelet from A, which goes back into the same medium, grows to radius AE = vt. So AE = BC.</div>
<div class="step">The tangent from C to this wavelet is CE: the reflected front. The reflected ray is AE.</div>
<div class="step">Triangles ABC and AEC are both right-angled, share the hypotenuse AC, and have BC = AE. So they are congruent, and the angle BAC equals the angle ECA: <b>i = r</b>. The incident ray, the reflected ray and the normal lie in one plane. That is the law of reflection.</div>
</div>

**Wavefronts after a lens or a prism.** A plane wavefront reaching a thin convex lens is delayed more at the thick centre than at the thin edge, because light is slower in glass. The emerging front is curved inwards, a piece of a sphere centred on the focus: that is how a lens focuses. A prism delays the end that passes through its thicker part, so the front tilts and the ray bends towards the base. The ray picture of Chapter 9 is the same story told with arrows.

## 4. Coherent and incoherent addition of waves

Two water waves that meet at a point add up: the displacement is the sum (the **principle of superposition**). What if the waves are light?

Take two waves of the same frequency and amplitude a at one point, with a phase difference φ between them:

```math
y_1 = a\cos\omega t, \qquad y_2 = a\cos(\omega t + \varphi)
```

Their sum is another wave with amplitude `$2a\cos(\varphi/2)$`. The intensity of a wave goes as the **square of its amplitude**, so (with I₀ the intensity of one wave):

```math
I = 4I_0\cos^2\frac{\varphi}{2}
```

For waves of different intensities I₁ and I₂ the general result is `$I = I_1 + I_2 + 2\sqrt{I_1 I_2}\cos\varphi$`.

- **Constructive interference** (φ = 0, 2π, 4π, …, so path difference Δ = nλ): the intensity is the largest, `$I_{max} = (\sqrt{I_1}+\sqrt{I_2})^2$`. For equal waves it is 4I₀, four times one wave, not two!
- **Destructive interference** (φ = π, 3π, …, so Δ = (n + ½)λ): the intensity is the smallest, `$I_{min} = (\sqrt{I_1}-\sqrt{I_2})^2$`. For equal waves it is zero.

Where did the energy go? Nowhere is lost: where there is a dark patch, the missing energy has gone to the bright patches. Averaged over the whole pattern the intensity is 2I₀, exactly the sum I₁ + I₂.

Everything above needs φ to stay **fixed** while we look. Sources that keep a constant phase difference are called **coherent**. Light from two ordinary bulbs is **incoherent**: each atom emits a short burst for about 10⁻⁸ s, then another burst with a new random phase. The phase difference between two bulbs changes billions of times a second. Our eyes then see only the average intensity, `$I = I_1 + I_2$`, a plain overlap with no fringes. Switch between the two cases:

<figure class="fig" data-fig="c12p-wave-superpose"><figcaption>Two equal waves and their sum. In the coherent case, slide the phase difference φ: the sum is largest at 0° (4I₀), vanishes at 180°, and the bar follows 4I₀cos²(φ/2). In the incoherent case the phase jumps about at random; the bar flickers and its average sits at 2I₀, so you see no fringes.</figcaption></figure>

<div class="problem" data-problem="c12p-wave-ratio"></div>

<div class="myth">

**“Dark fringes mean energy is destroyed.”** Energy is conserved. Interference only moves energy from the dark places to the bright ones. The total over the whole pattern is the same as if the waves had not interfered.

</div>

## 5. Interference of light waves and Young’s experiment

Why do we not see fringes from two torch beams crossing? Because they are incoherent. In 1801 Thomas Young found a clever way to make coherent sources: take light from **one** source and split it in two. Wherever a random jump of phase occurs, it occurs in both halves, so the phase difference between them stays fixed.

**The set-up.** Light from a narrow slit S falls on two very narrow, close slits S₁ and S₂ a distance d apart, which act as two coherent sources. A screen is a distance D away (D is much bigger than d). Where the waves from the two slits meet on the screen, bright and dark bands called **fringes** appear.

### 5.1 The fringe width

Let P be a point on the screen at a height y above the centre O. The wave from S₂ travels a longer way to P than the wave from S₁. Follow the geometry:

<div class="steps" data-fig="c12p-wave-ysteps">
<div class="step">The slits S₁ and S₂ are a distance d apart. The screen is a distance D away. O is the point on the screen exactly opposite the middle of the slits, and P is a point at height y above O. (The picture is not to scale: in the real experiment D is thousands of times larger than d.)</div>
<div class="step">Light reaches P along two paths, S₁P and S₂P. They are almost parallel, but S₂P is a little longer, and that small extra length is what matters.</div>
<div class="step">Mark the point N on S₂P so that PN = PS₁. Then the extra length is exactly the piece S₂N.</div>
<div class="step">Because D is huge compared with d, the angle at N is almost 90°, and S₂N = d sin θ, where θ is the angle of P above the axis. For small θ, sin θ ≈ tan θ = y/D. So the <b>path difference</b> is Δ = S₂P − S₁P ≈ dy/D.</div>
<div class="step">At a bright fringe the waves arrive in step: Δ = nλ. So dy/D = nλ, and the n-th bright fringe is at <b>yₙ = nλD/d</b>, with n = 0, 1, 2, … The central fringe (n = 0) is bright: the paths are equal.</div>
<div class="step">At a dark fringe Δ = (n + ½)λ, so yₙ = (n + ½)λD/d. The distance between two neighbouring bright fringes (or two neighbouring dark ones) is the <b>fringe width</b>: β = λD/d.</div>
</div>

```math
\beta = \frac{\lambda D}{d}, \qquad y_n = n\beta \ \text{(bright)}, \qquad y_n = \left(n+\tfrac12\right)\beta \ \text{(dark)}
```

<div class="meaning">
<dl>
<dt>β</dt><dd>fringe width: the distance between two consecutive bright (or dark) fringes</dd>
<dt>λ</dt><dd>wavelength of the light</dd>
<dt>D</dt><dd>distance from the slits to the screen</dd>
<dt>d</dt><dd>distance between the two slits (centre to centre)</dd>
<dt>Physical meaning</dt><dd>The fringes are evenly spaced. Closer slits (smaller d), a farther screen (bigger D) or longer wavelength (red rather than blue) all make the pattern more spread out. That is why you need very close slits, about a fraction of a millimetre, to see fringes at all.</dd>
</dl>
</div>

Slide the controls in the figure below. Watch the fringe width follow λD/d, and move the point P to check the path difference at a bright and at a dark fringe.

<figure class="fig" data-fig="c12p-wave-young"><figcaption>Young’s experiment. The picture at the top is not to scale. Below it, the fringes and the intensity I = I<sub>max</sub> cos²(πdy/λD). Narrow the gap or move the screen back and the fringes spread. Switch to white light: every colour makes its own fringes, the central one stays white, and the others turn into short coloured spectra.</figcaption></figure>

<!--fig:tool double-slit-->

<div class="problem" data-problem="c12p-wave-fringe"></div>

<div class="problem" data-problem="c12p-wave-nth"></div>

**Things worth knowing about the pattern**

1. All the fringes have almost the same brightness and width (when the slits are very narrow). The central fringe is bright, not dark.
2. **Dipping the whole set-up in a liquid** of refractive index μ shortens the wavelength to λ/μ, so the fringe width becomes β/μ. In water (μ = 4/3) the fringes squeeze to three quarters.
3. In **white light** the fringes of different colours have different widths (red is widest, violet narrowest), so only the central fringe is white and the neighbours are coloured and soon blur.
4. If one slit is covered, or the two slits are replaced by two torch bulbs, the fringes disappear: the sources must be coherent.
5. The source slit S must be narrow. A wide S is really many sources side by side, each making its own fringes in a slightly different place, and the overlap washes the pattern out.

<div class="problem" data-problem="c12p-wave-water"></div>

## 6. Diffraction

You can hear someone talking around a corner, but cannot see them. Sound bends round the corner much more than light does. Yet light also bends: when it passes through a very narrow slit or past a thin hair, it spreads into the “shadow” and makes bright and dark bands. This bending of waves round edges and through small gaps is called **diffraction**. It is noticeable when the size of the opening is comparable to the wavelength. Sound waves (λ about 1 m) bend round doors; light (λ about 0.0005 mm) needs a slit of a fraction of a millimetre.

### 6.1 Single-slit diffraction

Light of wavelength λ passes through a slit of width a and falls on a screen at a distance D. We get a wide, bright **central maximum** with dim bright bands and dark bands on each side.

Why dark? Think of the slit as a row of many tiny sources, all in step. In a direction θ the waves from all of them reach the screen with different path differences. At some angles they cancel exactly:

<div class="steps" data-fig="c12p-wave-slitsteps">
<div class="step">A plane wave fills a slit of width a. By Huygens’ principle every point of the slit is a source of wavelets, and all of them are in step.</div>
<div class="step">Look at the light going in one direction, at an angle θ to the straight-ahead direction. It travels along parallel rays to a far screen.</div>
<div class="step">The ray from the bottom edge of the slit travels farther than the ray from the top edge by a sin θ. This is the path difference between the two edges.</div>
<div class="step">Now split the slit into two equal halves. Pair each point of the top half with the point exactly a/2 below it. The two rays of every pair differ in path by (a/2) sin θ.</div>
<div class="step">Suppose a sin θ = λ. Then every pair differs by λ/2, so the two waves cancel. Every point of the slit is in some pair, so the total is zero: a dark fringe at a sin θ = λ.</div>
<div class="step">Split into 4, 6, 8, … parts in the same way and you find darkness when a sin θ = 2λ, 3λ, …: the minima are at a sin θ = nλ, n = ±1, ±2, ±3 … Between the minima are weak bright fringes. The central maximum lies between the two first minima, at θ = ±λ/a.</div>
</div>

```math
a\sin\theta = n\lambda \ \ (n = \pm1, \pm2, \dots) \ \text{: minima}, \qquad \text{width of central maximum} = \frac{2\lambda D}{a}
```

<div class="meaning">
<dl>
<dt>a</dt><dd>width of the slit</dd>
<dt>θ</dt><dd>angle of the direction of the dark fringe from the straight-ahead direction</dd>
<dt>D</dt><dd>slit-to-screen distance</dd>
<dt>Physical meaning</dt><dd>The first minimum is at θ ≈ λ/a, so the central bright band is about 2λ/a wide in angle. A narrower slit (smaller a) gives a wider spread. Squeezing the light spreads it out, a sign that light is a wave.</dd>
</dl>
</div>

The first dark spot is at y₁ = λD/a on either side of the centre, so the central maximum is `$2\lambda D/a$` wide. The side maxima are much weaker: the first is only about 4.5 % of the central brightness.

<figure class="fig" data-fig="c12p-wave-single"><figcaption>Single-slit pattern for a screen 1 m away. Make the slit narrower and the central band spreads; use red light instead of violet and it spreads too. The dashed lines mark the first minima at y = ±λD/a.</figcaption></figure>

<!--fig:tool diffraction-patterns-->

<div class="problem" data-problem="c12p-wave-slit"></div>

### 6.2 Interference and diffraction side by side

| | Interference (Young’s slits) | Diffraction (single slit) |
|---|---|---|
| What adds up | waves from two separate coherent sources | wavelets from many points of one slit |
| Fringe widths | all equal, β = λD/d | central band twice as wide as the others |
| Brightness | all bright fringes almost equal | fast fall: central brightest, the sides much weaker |
| Dark fringes | completely dark | almost completely dark |
| Formula for minima | dy/D = (n + ½)λ | a sin θ = nλ |

In a real Young’s experiment both effects are present: each slit has a width, and the diffraction pattern of that width acts as an envelope that makes the double-slit fringes fade towards the edges.

<div class="history">

**Beyond the syllabus (resolving power and the Fresnel distance).** The ability of a telescope or microscope to show two close objects as separate is limited by diffraction. For a telescope with a lens of diameter D, the smallest angle it can separate is about `$1.22\lambda/D$`. A bigger aperture gives sharper images, which is why astronomers build large mirrors. The distance `$z_F = a^2/\lambda$` is roughly how far a beam of width a travels before diffraction spreads it noticeably: for a = 4 mm and λ = 500 nm, about 30 m. Use these for entrance exams; the Class 12 board syllabus does not ask for them.

</div>

## 7. Polarisation

Interference and diffraction show that light is a wave, but not what kind. **Polarisation** shows that light is a **transverse** wave: the vibrating quantity (the electric field) is at right angles to the direction of travel.

Shake a rope up and down through a vertical slit in a fence and the wave gets through. Shake it side to side and the slit stops it. Now try a sound wave, which vibrates <i>along</i> its direction of travel: it goes through any slit. So if a slit-like device can block light, light must be a transverse wave.

<figure class="fig" data-fig="c12p-wave-rope"><figcaption>A rope wave through a slit. Turn the slit and the shaking direction: the wave that gets through is the part of the shake along the slit, A cos(angle between them). Switch to a longitudinal wave and the slit makes no difference.</figcaption></figure>

**Unpolarised and polarised light.** In ordinary light (sunlight, a bulb) the electric field vibrates in all directions at right angles to the ray, changing quickly and randomly. This is **unpolarised light**. If the vibrations are in only one direction, the light is **plane-polarised** (or linearly polarised).

**Polaroids.** A **polaroid** is a plastic sheet with long molecules stretched in one direction. It lets through only the electric field along one direction, its **pass axis**, and absorbs the rest. Unpolarised light through a polaroid loses half of its intensity and becomes plane-polarised.

### 7.1 Malus’s law

Send plane-polarised light of intensity I₀ through a second polaroid, the **analyser**, whose axis is at an angle θ to the polarisation of the light. Only the component of the electric field along the axis gets through:

```math
E = E_0\cos\theta \quad\Longrightarrow\quad I = I_0\cos^2\theta
```

because intensity goes as the square of the amplitude. This is **Malus’s law** (1809). It means:

- θ = 0°: all the light gets through (I = I₀);
- θ = 90° (crossed polaroids): no light gets through (I = 0);
- in between, the intensity changes smoothly with cos²θ.

<figure class="fig" data-fig="c12p-wave-malus"><figcaption>Rotate the analyser (or press Play). The blue arrow is the electric field E₀ leaving the first polaroid, the orange line is the analyser’s axis. The green arrow is E₀ cos θ, the part that gets through. The dot on the graph moves along I/I₀ = cos²θ.</figcaption></figure>

<!--fig:tool polarisation-calculator-->

<div class="problem" data-problem="c12p-wave-malus"></div>

**A puzzle.** Two crossed polaroids block all the light. Slide a third polaroid between them at 45° and light appears! Each sheet only cuts down the component along its own axis, but it also **rotates** the polarisation to its axis. Put the middle sheet at φ: the intensity after it is (I₀/2)cos²φ, and the last (crossed to the first, so at 90° − φ to the middle) passes a further cos²(90° − φ) = sin²φ, giving `$I = \tfrac{I_0}{8}\sin^2 2\varphi$`, which is greatest at 45°: I₀/8.

<figure class="fig" data-fig="c12p-wave-three"><figcaption>Take the middle sheet out and nothing gets through; put it in and light appears. The bar widths show the intensity after each sheet. Try 0°, 30°, 45°, 90°.</figcaption></figure>

**Uses of polarised light.** Polaroid sunglasses cut the glare reflected from roads and water (the reflected light is partly polarised). Photographers put a polarising filter on a camera to darken the sky and remove reflections. 3D cinema glasses have two polaroids with crossed axes, one for each eye. LCD screens (calculators, laptops) work by turning the polarisation of light with an electric field.

<div class="history">

**Beyond the syllabus (polarisation by reflection and scattering).** Light reflected from a glass or water surface is polarised most strongly when it strikes at the **Brewster angle** `$i_B$`, where `$\tan i_B = n$`. Then the reflected and refracted rays are at 90° to each other. For glass (n = 1.5) `$i_B \approx 56°$`. Blue light from the sky is partly polarised because air molecules scatter it. If your board does not ask for these, skip them.

</div>

<div class="history">

<ul class="timeline">
<li><b>1678</b> Christiaan Huygens proposes that light is a wave and gives the principle of secondary wavelets.</li>
<li><b>1801</b> Thomas Young makes light interfere with two slits and measures wavelengths of colours.</li>
<li><b>1809</b> Étienne-Louis Malus discovers polarisation by reflection and the cos² law.</li>
<li><b>1818</b> Augustin Fresnel’s wave theory of diffraction predicts a bright spot in the middle of a round shadow; Arago finds it, and the wave theory wins.</li>
<li><b>1850</b> Léon Foucault measures a slower speed of light in water, as the wave theory predicts.</li>
</ul>

</div>

<div class="keypoints">

- A wavefront joins points of equal phase; rays are perpendicular to it. Frequency does not change in a medium, but v = c/n and λₙ = λ/n.
- Huygens’ principle: every point on a wavefront is a source of secondary wavelets; the new front is their forward envelope.
- Huygens’ construction proves reflection (i = r) and refraction (sin i / sin r = v₁/v₂ = n).
- Superposition: I = I₁ + I₂ + 2√(I₁I₂) cos φ. For equal waves I = 4I₀cos²(φ/2). Constructive: Δ = nλ; destructive: Δ = (n + ½)λ.
- Coherent sources have a constant phase difference; independent sources (two bulbs) do not, and their intensities simply add (2I₀).
- Young’s experiment: path difference dy/D; bright at yₙ = nλD/d, dark at (n + ½)λD/d; fringe width β = λD/d (evenly spaced). In a liquid, β becomes β/μ.
- Single slit: minima at a sin θ = nλ (n ≠ 0); central maximum 2λD/a wide, twice the width of any other fringe; narrower slit means wider pattern.
- Polarisation shows light is transverse. Unpolarised light through a polaroid: half the intensity. Malus’s law: I = I₀cos²θ.

</div>

Going further for JEE/NEET: thin-film colours, shifts of fringes by a thin sheet, resolving power and Brewster’s law are in [Wave optics (JEE)](/learn/courses/engineering-entrance/wave-optics/), with extra questions in [its question set](/learn/courses/engineering-entrance/wave-optics-questions/).
