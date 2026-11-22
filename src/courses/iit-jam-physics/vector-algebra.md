---
title: 'Vector algebra: dot, cross and triple products'
seoTitle: Dot, cross and triple products for IIT JAM Physics
summary: 'Components, unit vectors and direction cosines, the dot product (angles, projections, work), the cross product (areas, torque, angular momentum, magnetic force), the scalar triple product as a volume, BAC minus CAB, lines and planes, reciprocal vectors, and index notation.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: 'What is ĵ × k̂ for right-handed unit vectors?'
    choices: ['î', '−î', 'k̂', '0']
    ans: 0
    why: 'Going round the cycle î → ĵ → k̂ → î in order gives a plus sign: ĵ × k̂ = î. Against the cycle (k̂ × ĵ) gives −î.'
  - q: 'What does the scalar triple product a · (b × c) measure?'
    choices: ['The signed volume of the box with edges a, b and c', 'The area of the parallelogram on a and b', 'The angle between a and b × c', 'The length of a × (b × c)']
    ans: 0
    why: '|b × c| is the base area and the component of a along b × c is the height, so the product is the volume. It is zero exactly when the three vectors lie in one plane.'
  - q: 'What is a × (b × c)?'
    choices: ['b(a · c) − c(a · b)', 'c(a · b) − b(a · c)', '(a × b) × c', 'a(b · c) − c(a · b)']
    ans: 0
    why: '"BAC minus CAB". The answer lies in the plane of b and c. The cross product is not associative, so (a × b) × c is different.'
sources:
  - 'D. J. Griffiths, Introduction to Electrodynamics, 4th ed. (2017), section 1.1: vector algebra'
  - 'M. L. Boas, Mathematical Methods in the Physical Sciences, 3rd ed. (2006), chapter 3, sections 4 and 5'
  - 'C. Kittel, Introduction to Solid State Physics, 8th ed. (2005), chapter 2 (reciprocal lattice vectors)'
  - 'IIT JAM Physics syllabus (Mathematical Methods section), published by the organising IIT each year'
---

**Module 1 · about 40 minutes.** By the end you will be able to compute dot, cross and triple products quickly and know what each one means, find angles, projections, areas and volumes, test for perpendicular, parallel and coplanar vectors, simplify any product of three vectors with BAC minus CAB, and work with lines, planes and reciprocal vectors.

<div class="bigidea">Two vectors can be multiplied in two ways: the dot product asks how much they point the same way; the cross product asks how much area they sweep out, and which way that area faces.</div>

## 1. Components and unit vectors

A vector has a size and a direction. In a right-handed Cartesian frame write it as `$\vec A = A_x\hat i + A_y\hat j + A_z\hat k$`, with

```math
|\vec A| = \sqrt{A_x^2 + A_y^2 + A_z^2}, \qquad \hat A = \frac{\vec A}{|\vec A|}
```

The components of `$\hat A$` are the **direction cosines** `$(\cos\alpha, \cos\beta, \cos\gamma)$`, the cosines of the angles with the three axes; their squares add to 1. For `$2\hat i - \hat j + 2\hat k$`: length 3, direction cosines `$(2/3, -1/3, 2/3)$`. Add vectors head to tail in the [vector adder](/learn/vector-adder/) and turn them in 3D in the [3D vector lab](/learn/vector-lab-3d/).

## 2. The dot product: how much along

```math
\vec A\cdot\vec B = A_xB_x + A_yB_y + A_zB_z = AB\cos\theta
```

The two forms are the same number, which gives you the angle between any two vectors. Its uses:

- **Angle:** `$\cos\theta = \vec A\cdot\vec B/(AB)$`. Zero dot product means perpendicular.
- **Projection:** the component of `$\vec A$` along `$\vec B$` is `$\vec A\cdot\hat B = \vec A\cdot\vec B/B$`.
- **Work:** `$W = \vec F\cdot\vec d$`. A force at right angles to the motion does no work.

**Worked example.** The component of `$\vec A = (2, 3, 6)$` along `$\vec B = (1, 2, 2)$` is `$(2 + 6 + 12)/3 = 20/3$`. Dividing by `$|\vec A| = 7$` instead would give the component of `$\vec B$` along `$\vec A$`, a classic wrong option.

## 3. The cross product: area with a direction

```math
\vec A\times\vec B = \begin{vmatrix} \hat i & \hat j & \hat k \\ A_x & A_y & A_z \\ B_x & B_y & B_z \end{vmatrix}, \qquad |\vec A\times\vec B| = AB\sin\theta
```

The result is perpendicular to both `$\vec A$` and `$\vec B$` (right-hand rule: fingers from `$\vec A$` to `$\vec B$`, thumb along the product), and its length is the **area of the parallelogram** they span. It is antisymmetric: `$\vec B\times\vec A = -\vec A\times\vec B$`, so `$\vec A\times\vec A = \vec 0$`. For the unit vectors, the cycle `$\hat i\to\hat j\to\hat k\to\hat i$` gives `$+$` and the reverse gives `$-$`.

Dot and cross products are linked by **Lagrange's identity**, which is just `$\sin^2 + \cos^2 = 1$`:

```math
|\vec A\times\vec B|^2 + (\vec A\cdot\vec B)^2 = A^2B^2
```

Physics uses the cross product wherever something turns: torque `$\vec\tau = \vec r\times\vec F$`, angular momentum `$\vec L = \vec r\times\vec p$`, velocity in a rotating body `$\vec v = \vec\omega\times\vec r$`, and the magnetic force `$\vec F = q\vec v\times\vec B$`.

**Worked example.** The triangle with corners `$(0,0,0)$`, `$(2,0,0)$`, `$(0,3,4)$`: edges `$\vec a = (2, 0, 0)$` and `$\vec b = (0, 3, 4)$`, `$\vec a\times\vec b = (0, -8, 6)$` of length 10, so the area is half of that, 5.

<div class="meaning">

<dl>
<dt>A · B</dt><dd>a number: A times the part of B that lies along A</dd>
<dt>A × B</dt><dd>a vector at right angles to both, as long as the parallelogram on A and B is big</dd>
<dt>A · (B × C)</dt><dd>a number: the volume of the box on A, B, C, with a sign for handedness</dd>
<dt>Physical meaning</dt><dd>Work and power are dot products: only the part of a force along the motion counts. Torque and angular momentum are cross products: only the part of a force at right angles to the lever arm turns things.</dd>
</dl>

</div>

## 4. The scalar triple product: volume

Take `$\vec b$` and `$\vec c$` as the base of a box. `$|\vec b\times\vec c|$` is the base area, and `$\vec a$`'s component along `$\vec b\times\vec c$` is the height. So

```math
[\vec a\ \vec b\ \vec c] = \vec a\cdot(\vec b\times\vec c) = \begin{vmatrix} a_x & a_y & a_z \\ b_x & b_y & b_z \\ c_x & c_y & c_z \end{vmatrix} = \pm\,\text{volume}
```

Slide the third edge sideways below: the box leans, but the volume does not change, because only the height counts. Push it through the base and the sign flips.

<figure class="fig" data-fig="triple-box"><figcaption>Volume = base area × height. The triple product is positive when a, b, c form a right-handed set, negative when left-handed, and zero when the three vectors lie in one plane.</figcaption></figure>

Properties that save time: a cyclic shift leaves it unchanged, `$[\vec a\,\vec b\,\vec c] = [\vec b\,\vec c\,\vec a] = [\vec c\,\vec a\,\vec b]$`; swapping two vectors flips the sign; any repeated vector makes it zero. So dot and cross can swap places: `$\vec a\cdot(\vec b\times\vec c) = (\vec a\times\vec b)\cdot\vec c$`. **Three vectors are coplanar exactly when their triple product is zero.** A tetrahedron on the same three edges has one sixth of the box's volume.

**Worked example.** When are `$(1, 2, 3)$`, `$(2, k, 1)$`, `$(1, 1, 1)$` coplanar? The determinant is `$1(k - 1) - 2(2 - 1) + 3(2 - k) = 3 - 2k$`, zero for `$k = 3/2$`.

<div class="problem" data-problem="box-volume"></div>

## 5. The vector triple product: BAC minus CAB

```math
\vec A\times(\vec B\times\vec C) = \vec B(\vec A\cdot\vec C) - \vec C(\vec A\cdot\vec B)
```

Why must it look like that? `$\vec B\times\vec C$` is perpendicular to the plane of `$\vec B$` and `$\vec C$`; crossing it with anything brings you back into that plane, so the answer is some mix of `$\vec B$` and `$\vec C$`. From it come two more identities you can then derive in a line rather than memorise:

```math
(\vec A\times\vec B)\cdot(\vec C\times\vec D) = (\vec A\cdot\vec C)(\vec B\cdot\vec D) - (\vec A\cdot\vec D)(\vec B\cdot\vec C)
```

and the Jacobi identity `$\vec A\times(\vec B\times\vec C) + \vec B\times(\vec C\times\vec A) + \vec C\times(\vec A\times\vec B) = \vec 0$`.

<div class="myth">

**"The cross product is associative, like ordinary multiplication."** Wrong. `$\vec A\times(\vec B\times\vec C)$` lies in the plane of `$\vec B$` and `$\vec C$`, while `$(\vec A\times\vec B)\times\vec C$` lies in the plane of `$\vec A$` and `$\vec B$`. Test with `$\hat i\times(\hat i\times\hat j) = \hat i\times\hat k = -\hat j$`, but `$(\hat i\times\hat i)\times\hat j = \vec 0$`.

</div>

**Index notation.** With the Kronecker delta `$\delta_{ij}$` and the Levi-Civita symbol `$\epsilon_{ijk}$` (`$+1$` for even permutations of 123, `$-1$` for odd, `$0$` with a repeat), `$(\vec A\times\vec B)_i = \epsilon_{ijk}A_jB_k$`, and BAC minus CAB is the identity `$\epsilon_{ijk}\epsilon_{imn} = \delta_{jm}\delta_{kn} - \delta_{jn}\delta_{km}$`. GATE and CSIR NET use this heavily; JAM occasionally.

## 6. Lines, planes and reciprocal vectors

- **Plane** with normal `$\vec n$` through `$\vec r_0$`: `$\vec n\cdot(\vec r - \vec r_0) = 0$`, or `$ax + by + cz = d$` with `$\vec n = (a, b, c)$`. The distance of a point `$\vec P$` from it is `$|\vec n\cdot\vec P - d|/|\vec n|$`.
- **Shortest distance between skew lines** `$\vec r = \vec P_1 + t\vec d_1$` and `$\vec r = \vec P_2 + s\vec d_2$`: project the joining vector on the common perpendicular, `$|(\vec P_2 - \vec P_1)\cdot(\vec d_1\times\vec d_2)|/|\vec d_1\times\vec d_2|$`.
- **Reciprocal vectors** of `$\vec a, \vec b, \vec c$`: `$\vec a^* = (\vec b\times\vec c)/[\vec a\,\vec b\,\vec c]$` and cyclically. They satisfy `$\vec a^*\cdot\vec a = 1$` and `$\vec a^*\cdot\vec b = \vec a^*\cdot\vec c = 0$`. Times `$2\pi$`, they are the reciprocal lattice of crystallography, which you will meet in X-ray diffraction.

**Polar and axial vectors.** Under inversion `$\vec r\to-\vec r$`, ordinary (polar) vectors such as `$\vec r$`, `$\vec p$`, `$\vec E$` flip sign. A cross product of two polar vectors does not flip, so `$\vec L$`, `$\vec\tau$` and `$\vec B$` are axial (pseudo) vectors, and the triple product of three polar vectors is a pseudoscalar.

<div class="keypoints">

- `$\vec A\cdot\vec B = AB\cos\theta$`: angles, projections (divide by the length you project onto), work. Zero means perpendicular.
- `$|\vec A\times\vec B| = AB\sin\theta$` is the parallelogram area; the direction follows the right-hand rule; order matters.
- `$|\vec A\times\vec B|^2 + (\vec A\cdot\vec B)^2 = A^2B^2$`.
- `$\vec a\cdot(\vec b\times\vec c)$` = signed volume = determinant; zero means coplanar; cyclic shifts leave it unchanged; a tetrahedron is one sixth.
- `$\vec A\times(\vec B\times\vec C) = \vec B(\vec A\cdot\vec C) - \vec C(\vec A\cdot\vec B)$`; the cross product is not associative.
- Point to plane `$|\vec n\cdot\vec P - d|/|\vec n|$`; skew lines via `$\vec d_1\times\vec d_2$`; reciprocal vectors `$\vec a^* = \vec b\times\vec c/[\vec a\,\vec b\,\vec c]$`.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [vector algebra practice page](/learn/courses/iit-jam-physics/practice/vector-algebra/).

<div class="qbank" data-bank="physics" data-topics="vector-algebra" data-exam="jam" data-n="10"></div>

**Before this:** [lesson 1.3, multiple integrals](/learn/courses/iit-jam-physics/multiple-integrals/). **Next:** lesson 1.5, [gradient, divergence and curl](/learn/courses/iit-jam-physics/vector-calculus/), where the del operator behaves like a vector in exactly these products. Cross products drive [central forces and angular momentum](/learn/courses/iit-jam-physics/central-forces/) and [the magnetic force](/learn/courses/iit-jam-physics/magnetostatics/).

**Go deeper:** index notation grows into [tensors](/learn/courses/gate-physics/tensors/) in GATE Physics, and vectors in general into [linear vector spaces and Dirac notation](/learn/courses/gate-physics/linear-vector-spaces/).
