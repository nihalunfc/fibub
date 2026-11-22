---
title: Multipole expansion
seoTitle: Multipole expansion and quadrupole tensor | GATE Physics
summary: 'The Legendre expansion of 1/|r − r′|, monopole, dipole and quadrupole moments, the traceless quadrupole tensor, origin dependence, dipole fields and the hidden delta term, energies, forces and torques in external fields, interactions between multipoles, molecular dipoles, nuclear quadrupoles and magnetic dipoles.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: A charge distribution has zero total charge and zero dipole moment. Far away, its electric field falls off as
    choices: ['1/r⁴', '1/r³', '1/r²', '1/r⁵']
    ans: 0
    why: "The leading term is then the quadrupole, whose potential goes as 1/r³; the field, one derivative more, goes as 1/r⁴."
  - q: When is the dipole moment of a charge distribution independent of the choice of origin?
    choices: ['When the total charge is zero', 'When the distribution is spherical', 'When the quadrupole moment is zero', 'Always']
    ans: 0
    why: "Shifting the origin by a changes p to p − Qa. Only for Q = 0 is it the same for every shift. In general the lowest non-zero moment is origin independent."
  - q: Two equal dipoles are a fixed distance apart. Which arrangement has the lowest energy?
    choices: ['Head to tail on one line', 'Side by side, antiparallel', 'Side by side, parallel', 'Perpendicular']
    ans: 0
    why: "U = k[p1·p2 − 3(p1·r̂)(p2·r̂)]/r³ gives −2kp²/r³ head to tail, −kp²/r³ antiparallel side by side, +kp²/r³ parallel side by side and 0 for one along r̂ with the other across."
sources:
  - 'J. D. Jackson, Classical Electrodynamics, 3rd ed. (1999), sections 4.1 to 4.2 and 5.6'
  - 'D. J. Griffiths, Introduction to Electrodynamics, 4th ed. (2017), sections 3.4 and 5.4'
  - 'L. D. Landau and E. M. Lifshitz, The Classical Theory of Fields, 4th ed. (1975), sections 40 to 42'
  - 'K. S. Krane, Introductory Nuclear Physics (1988), section 3.5 (nuclear quadrupole moments)'
  - 'GATE Physics (PH) syllabus, Electromagnetic theory section, published by the organising institute each year'
---

**Module 3 · about 55 minutes.** Seen from far away, every charge distribution looks like a point charge; if it is neutral, like a dipole; if that cancels too, like a quadrupole. The multipole expansion makes this exact and tells you which few numbers describe a distribution's far field and how it couples to outside fields. That is the language of molecules, nuclei, antennas and gravitational waves. Point dipole basics (field, torque) are in the IIT JAM lessons on [electric fields](/learn/courses/iit-jam-physics/electrostatics-gauss/) and [potential and energy](/learn/courses/iit-jam-physics/potential-energy/).

<div class="bigidea">Expand the distance between a source point and a far field point in powers of (source size)/(distance). Each power comes with one number set by the source: total charge, then dipole moment, then quadrupole moment. Far away only the first non-zero one matters, and it falls off one power of r faster than the one before.</div>

## 1. Expanding 1/|r − r′|

For a field point at `$\vec r$` and a source point at `$\vec r\,'$` with `$r' < r$`, and `$\gamma$` the angle between them,

```math
\frac{1}{|\vec r - \vec r\,'|} = \frac1r\left(1 - 2\frac{r'}{r}\cos\gamma + \frac{r'^2}{r^2}\right)^{-1/2} = \sum_{l=0}^{\infty}\frac{r'^{\,l}}{r^{l+1}}P_l(\cos\gamma)
```

because `$(1 - 2tx + t^2)^{-1/2} = \sum t^lP_l(x)$` is the generating function of the Legendre polynomials. Putting this inside `$V = \dfrac{1}{4\pi\epsilon_0}\displaystyle\int\dfrac{\rho(\vec r\,')}{|\vec r - \vec r\,'|}d\tau'$`:

```math
V(\vec r) = \frac{1}{4\pi\epsilon_0}\left[\frac{Q}{r} + \frac{\vec p\cdot\hat r}{r^2} + \frac{1}{2}\sum_{ij}\frac{Q_{ij}\hat r_i\hat r_j}{r^3} + \dots\right]
```

with

```math
Q = \int\rho\,d\tau, \qquad \vec p = \int\rho\,\vec r\,'\,d\tau, \qquad Q_{ij} = \int\rho\,(3x_i'x_j' - r'^2\delta_{ij})\,d\tau
```

The `$l$`-th term falls as `$1/r^{l+1}$` and has the angular shape of `$P_l$`.

<figure class="fig" data-fig="multipole-falloff"><figcaption>Left: field lines of a point charge, a dipole and two kinds of quadrupole. Right: the potential along the dashed ray on log-log axes. The exact curve (solid) joins the leading multipole term (dashed, slope −1, −2 or −3) once you are a few charge spacings away.</figcaption></figure>

Choose a set of charges, then raise l one step at a time. Move r closer and see how many terms you need.

<figure class="fig" data-fig="@em-multipole-angles"><figcaption>Each extra multipole term improves the match; far from the charges only the first non-zero terms matter.</figcaption></figure>

## 2. The quadrupole tensor

`$Q_{ij}$` is symmetric and **traceless** (`$Q_{xx} + Q_{yy} + Q_{zz} = 0$`): the `$-r'^2\delta_{ij}$` is there exactly to remove the trace, which would only contribute `$\nabla^2(1/r) = 0$` outside. So it has `$9 - 3 - 1 = 5$` independent components, matching the `$2l + 1 = 5$` spherical moments of `$l = 2$`.

**Worked example: the linear quadrupole.** Charges `$+q$`, `$-2q$`, `$+q$` at `$z = -a, 0, +a$`. `$Q = 0$`, `$\vec p = 0$`, and

```math
Q_{zz} = 2q(3a^2 - a^2) = 4qa^2, \quad Q_{xx} = Q_{yy} = -2qa^2, \quad V = \frac{1}{4\pi\epsilon_0}\frac{qa^2(3\cos^2\theta - 1)}{r^3}
```

Positive along the axis, negative (and half as big) round the equator. Check on the axis directly: `$\dfrac{q}{z - a} + \dfrac{q}{z + a} - \dfrac{2q}{z} \approx \dfrac{2qa^2}{z^3}$`. ✓

**Worked example: the square quadrupole.** `$+q$` at `$(a, a)$` and `$(-a, -a)$`, `$-q$` at `$(a, -a)$` and `$(-a, a)$`. Every diagonal component vanishes (each charge has `$3x^2 - r^2 = a^2$` and the charges sum to zero) and `$Q_{xy} = 3\sum qxy = 12qa^2$`. The potential `$\dfrac{12kqa^2\,xy}{r^5}$` has four lobes, positive along `$y = x$`.

**Shapes and signs.** For a uniformly charged spheroid with semi-axes `$a, a, c$`, `$Q_{zz} = \tfrac25Q(c^2 - a^2)$`: positive for a cigar (prolate), negative for a disc (oblate). Nuclear physicists quote `$eQ = \int\rho(3z^2 - r^2)d\tau$` the same way: deformed rare-earth nuclei have large positive `$Q$`. A nucleus of spin 0 or ½ shows no quadrupole moment at all, because a rank-2 tensor needs at least spin 1.

## 3. Which moments depend on the origin

Shift the origin by `$\vec a$`. Then

```math
\vec p\,' = \vec p - Q\vec a, \qquad Q'_{ij} = Q_{ij} - 3(p_ia_j + p_ja_i) + 2(\vec p\cdot\vec a)\delta_{ij} + Q(3a_ia_j - a^2\delta_{ij})
```

Each moment mixes only with lower ones. So **the lowest non-vanishing moment never depends on the origin**: the dipole moment of a neutral system, the quadrupole of a system with no charge and no dipole. For a charged body you can always kill the dipole by putting the origin at the centre of charge `$\vec p/Q$` (that is how nuclear moments are defined), but not the quadrupole.

**Worked example.** A single charge `$q$` at `$(0, 0, d)$` has, about the origin, `$\vec p = qd\hat z$` and `$Q_{zz} = 2qd^2$`. A displaced point charge has every multipole; that is just the expansion of `$q/|\vec r - d\hat z|$`.

## 4. Dipole fields, and the term everyone forgets

From `$V = \dfrac{\vec p\cdot\hat r}{4\pi\epsilon_0r^2}$`:

```math
\vec E = \frac{1}{4\pi\epsilon_0}\frac{3(\vec p\cdot\hat r)\hat r - \vec p}{r^3} - \frac{\vec p}{3\epsilon_0}\delta^3(\vec r)
```

In components, `$E_r = 2kp\cos\theta/r^3$` and `$E_\theta = kp\sin\theta/r^3$`; the field lines are `$r = C\sin^2\theta$`, and the field is perpendicular to the axis on the cone `$\cos\theta = 1/\sqrt3$` (54.7°, the "magic angle" of NMR).

The delta term is invisible away from the origin, but it carries the whole volume average: **the average field over a sphere of radius `$R$` due to any charges inside it is `$-\vec p/4\pi\epsilon_0R^3$`**, wherever they sit, while charges outside give an average equal to their field at the centre. This is what links microscopic fields to the macroscopic field in matter, and its magnetic twin (`$+\tfrac23\mu_0\vec m\,\delta^3$`) gives the hyperfine splitting of hydrogen's 21 cm line.

<div class="problem" data-problem="dipole-field-angle"></div>

## 5. Multipoles in an external field

Expand the external potential about the centre of the distribution:

```math
W = QV(0) - \vec p\cdot\vec E(0) - \frac16\sum_{ij}Q_{ij}\frac{\partial E_j}{\partial x_i}(0) + \dots
```

The factor `$\tfrac16$` is the Taylor `$\tfrac12$` times the `$\tfrac13$` in the definition of `$Q_{ij}$` (allowed because `$\nabla\cdot\vec E = 0$` for external sources). Charge feels the potential, the dipole feels the field, the quadrupole feels the field **gradient**: a uniform field exerts no force on a dipole and no torque on a quadrupole.

- **Dipole:** torque `$\vec p\times\vec E$`, force `$\nabla(\vec p\cdot\vec E)$`. A dipole pointing away from a charge `$Q$` is pulled in with `$2kQp/r^3$`.
- **Linear quadrupole along `$\hat n$`** in an axially symmetric gradient `$\partial E_z/\partial z = G$`: `$W = -qa^2G\,P_2(\cos\beta)$`. This is how a nuclear quadrupole moment splits NMR and Mössbauer lines.

**Interactions** follow by letting one multipole sit in the field of the other: a `$2^l$`-pole and a `$2^{l'}$`-pole interact as `$1/r^{l + l' + 1}$`. Dipole-dipole:

```math
U = \frac{1}{4\pi\epsilon_0r^3}\left[\vec p_1\cdot\vec p_2 - 3(\vec p_1\cdot\hat r)(\vec p_2\cdot\hat r)\right]
```

which is `$-2kp^2/r^3$` head to tail, `$-kp^2/r^3$` side by side antiparallel, and `$+kp^2/r^3$` side by side parallel. Two 1 D molecules head to tail 0.5 nm apart bind with only 10 meV, less than `$k_BT$` at room temperature, which is why dipolar liquids are liquids.

**Worked example: a molecule.** Two bond moments of 1.50 D at 104.5° add to `$2\times1.50\cos52.25^\circ = 1.84$` D (water). HCl, with 1.08 D and a 127 pm bond, has `$1.08\times3.336\times10^{-30}/(1.602\times10^{-19}\times1.27\times10^{-10}) = 17.7\%$` ionic character.

<div class="problem" data-problem="quadrupole-component"></div>

## 6. Magnetic multipoles

For a closed current loop the same expansion of `$1/|\vec r - \vec r\,'|$` inside `$\vec A = \dfrac{\mu_0I}{4\pi}\oint\dfrac{d\vec l\,'}{|\vec r - \vec r\,'|}$` gives **no monopole term** (`$\oint d\vec l\,' = 0$`) and a leading dipole

```math
\vec A = \frac{\mu_0}{4\pi}\frac{\vec m\times\hat r}{r^2}, \qquad \vec B = \frac{\mu_0}{4\pi}\frac{3(\vec m\cdot\hat r)\hat r - \vec m}{r^3} + \frac{2\mu_0}{3}\vec m\,\delta^3(\vec r)
```

with `$\vec m = I\vec a$`. Far away it looks exactly like the electric dipole; at the origin the contact term has the opposite sense (inside a current loop the field points along `$\vec m$`), a difference that matters for spins. Interactive versions: the [dipole torque](/learn/dipole-torque/) explorer and the [magnetic field mapper](/learn/magnetic-field-mapper/).

<div class="meaning">

<dl>
<dt>Monopole Q</dt><dd>the total charge: how strongly the distribution looks like a point charge</dd>
<dt>Dipole p</dt><dd>charge times displacement, Σqr: how far the positive and negative "centres" are apart</dd>
<dt>Quadrupole Q<sub>ij</sub></dt><dd>Σq(3x<sub>i</sub>x<sub>j</sub> − r²δ<sub>ij</sub>): how the charge is stretched along some axes and squashed along others, beyond any dipole</dd>
<dt>Leading moment</dt><dd>the first non-zero one; it fixes the far field and never depends on where you put the origin</dd>
<dt>Physical meaning</dt><dd>Each extra layer of cancellation in a charge distribution costs one power of distance: neutral atoms are felt as 1/r² (induced dipoles), symmetric molecules like CO₂ only as 1/r³ quadrupoles.</dd>
</dl>

</div>

<div class="myth">

**"A point charge has no dipole or quadrupole moment."** Only about its own position. Put the origin anywhere else and a single charge `$q$` at `$\vec d$` has `$\vec p = q\vec d$` and `$Q_{zz} = 2qd^2$` (for `$\vec d$` along `$z$`), and so on to every order. Multipole moments describe a distribution *relative to an origin*; only the leading non-zero one is origin free.

</div>

<div class="keypoints">

- `$1/|\vec r - \vec r\,'| = \sum r'^{\,l}P_l(\cos\gamma)/r^{l+1}$`. Term `$l$` falls as `$1/r^{l+1}$` (field `$1/r^{l+2}$`).
- `$V = k[Q/r + \vec p\cdot\hat r/r^2 + \tfrac12\sum Q_{ij}\hat r_i\hat r_j/r^3]$`, `$Q_{ij} = \sum q(3x_ix_j - r^2\delta_{ij})$`: symmetric, traceless, 5 components.
- Linear quadrupole `$Q_{zz} = 4qa^2$`, `$V = kqa^2(3\cos^2\theta - 1)/r^3$`. Spheroid `$\tfrac25Q(c^2 - a^2)$`: prolate positive.
- `$\vec p\,' = \vec p - Q\vec a$`; the lowest non-zero moment is origin independent.
- Dipole field `$k[3(\vec p\cdot\hat r)\hat r - \vec p]/r^3 - \vec p\,\delta^3/3\epsilon_0$`; average over a sphere of interior charges `$-\vec p/4\pi\epsilon_0R^3$`.
- Energy `$QV - \vec p\cdot\vec E - \tfrac16\sum Q_{ij}\partial_iE_j$`. Dipole-dipole `$U = k[\vec p_1\cdot\vec p_2 - 3(\vec p_1\cdot\hat r)(\vec p_2\cdot\hat r)]/r^3$`; `$2^l$`-pole with `$2^{l'}$`-pole `$\propto 1/r^{l+l'+1}$`.
- Magnetic: no monopole; `$\vec A = \mu_0\vec m\times\hat r/4\pi r^2$`.

</div>

## Practise: exam questions on this lesson

Warm-up to top-rank, each with a worked solution. More on the [GATE Physics practice page](/learn/courses/gate-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="multipoles" data-exam="gate" data-n="10"></div>

**Next:** [fields in matter](/learn/courses/gate-physics/fields-in-matter/) fills space with dipoles and asks what field they make on average. The Legendre machinery behind this lesson is in [boundary value problems](/learn/courses/gate-physics/boundary-value-problems/).
