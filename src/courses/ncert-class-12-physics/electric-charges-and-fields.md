---
title: Electric Charges and Fields
seoTitle: 'Electric Charges and Fields Class 12 notes and derivations'
summary: 'Class 12 Electric Charges and Fields with animations: Coulomb''s law, field lines, flux, dipoles and Gauss''s law, with every derivation step by step.'
minutes: 75
updated: 2026-11-22
quiz:
  - q: 'The distance between two point charges is doubled and one charge is also doubled. The force between them becomes:'
    choices: ['twice as large', 'half as large', 'four times as large', 'one quarter']
    ans: 1
    why: 'F ∝ q₁q₂/r². Doubling one charge doubles F, doubling the distance divides F by 4, so the force becomes 2 × 1/4 = 1/2 of its value.'
  - q: 'A charge q sits at the centre of a cube. The electric flux through one face is:'
    choices: ['q/ε₀', 'q/(6ε₀)', 'q/(4ε₀)', 'zero']
    ans: 1
    why: 'Gauss’s law gives a total flux q/ε₀ through the closed cube. The six faces are identical by symmetry, so each gets one sixth.'
  - q: 'The electric field of an infinite plane sheet of charge, at a distance r from it, is proportional to:'
    choices: ['1/r²', '1/r', 'r', 'r⁰ (it does not depend on r)']
    ans: 3
    why: 'A pillbox through the sheet gives E = σ/2ε₀, which does not contain r. The field lines are parallel, so they never thin out.'
sources:
  - 'NCERT Class 12 Physics, Chapter 1 “Electric Charges and Fields” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Constants: CODATA 2018 recommended values (e = 1.602 176 634 × 10⁻¹⁹ C exactly; ε₀ = 8.854 × 10⁻¹² C² N⁻¹ m⁻²), NIST'
  - 'Coulomb, C.-A. (1785), “Premier mémoire sur l’électricité et le magnétisme”, Histoire de l’Académie Royale des Sciences (for the history box)'
---

**Physics · Class 12 · Chapter 1 · about 75 minutes.** By the end you will be able to use Coulomb’s law and superposition, draw and read field lines, find the field and torque of a dipole, work out electric flux, and use Gauss’s law for a long wire, a plane sheet and a spherical shell, with every derivation the board asks for.

<div class="bigidea">Charges push and pull on each other across empty space. We describe this with a <b>field</b>: every charge fills the space around it with an electric field, and any other charge placed there simply feels the field at its own spot. Gauss’s law then says something very neat: the total field “flowing” out of any closed surface depends only on the charge inside.</div>

## 1. Electric charge and how bodies get charged

Comb your dry hair on a winter morning and the comb picks up tiny bits of paper. Rub a glass rod with silk and it picks up scraps too. In both cases the rubbing has given the object an **electric charge**.

There are only **two kinds** of charge. Benjamin Franklin called them positive and negative. **Like charges repel, unlike charges attract.** A glass rod rubbed with silk becomes positive, a plastic comb rubbed with hair becomes negative.

Everything is made of atoms: a tiny nucleus with positive **protons**, surrounded by negative **electrons**. A neutral object has equal numbers of both. When you rub two objects, the protons stay locked in their nuclei, but some **electrons are rubbed off** one object and stick to the other. The one that loses electrons ends up positive, the one that gains them ends up negative.

<figure class="fig" data-fig="c12p-field-charging"><figcaption>Press “Rub” to move electrons one at a time from the rod to the cloth. The rod’s charge goes up by one e each time, the cloth’s goes down by exactly the same, and the total stays zero. Charge is only ever moved, never made or destroyed.</figcaption></figure>

**Conductors and insulators.** In a metal some electrons are free to wander through the whole piece: it is a **conductor** (copper, silver, your body, the Earth). In an **insulator** (glass, plastic, dry wood, rubber) the electrons stay bound to their atoms, so charge put on one spot stays there. That is why you can charge a plastic comb but, holding a copper rod in your bare hand, any charge leaks away through you to the ground.

### Three basic properties of charge

1. **Additive.** Charges add like ordinary numbers, with their signs. Two bodies with +5 µC and −2 µC together have +3 µC.
2. **Conserved.** In any process the total charge of an isolated system never changes. Charge can move from one body to another, or a positive and negative pair can be created or destroyed together, but the algebraic sum stays the same.
3. **Quantised.** Any charge is a whole number of the electron’s charge: `$q = ne$`, with `$e = 1.6\times10^{-19}$` C. You can have 3 e or 10¹³ e, never 2.5 e. For everyday charges (µC) the steps are so tiny that charge looks smooth, like sand from a distance.

<div class="problem" data-problem="c12p-field-electrons"></div>

### Charging by induction (no touching)

Rubbing needs contact. There is a cleverer way: bring a charged rod **near** a metal sphere without touching, and the sphere’s free electrons move in response. Follow the steps and notice that the order matters.

<div class="steps" data-fig="c12p-field-induct">
<div class="step">A neutral metal sphere stands on an insulating stand. It has equal numbers of + (fixed) and free − (electrons) charges spread evenly.</div>
<div class="step">A positive rod comes close. The free electrons are attracted to the near side, which becomes negative. The far side is left short of electrons, so it is positive. The sphere as a whole is still neutral.</div>
<div class="step">Touch the far side to the earth with a wire. Electrons flow from the huge Earth into the sphere to cancel the positive charge on the far side. The rod must stay in place.</div>
<div class="step">Remove the earth wire first. The sphere now has a few extra electrons that are held in place by the attraction of the rod, and they cannot escape.</div>
<div class="step">Now take the rod away. The extra electrons are free to spread out over the whole surface.</div>
<div class="step">The sphere carries a net negative charge, the opposite of the rod. The rod lost nothing: it did not touch the sphere.</div>
</div>

<div class="myth">

**“The sphere gets charged because the rod gives it some of its charge.”** In induction the rod gives nothing away. If the earth wire were removed after the rod, the electrons would flow back out and the sphere would end neutral. Order: earth on, earth off, rod away.

</div>

## 2. Coulomb’s law

In 1785 Charles-Augustin de Coulomb measured the force between small charged spheres with a delicate twisting balance. He found that for two **point charges** (charged bodies much smaller than the distance between them):

```math
F = k\,\frac{q_1 q_2}{r^2}, \qquad k = \frac{1}{4\pi\varepsilon_0} = 9\times10^{9}\ \text{N m}^2\text{C}^{-2}
```

The force is along the line joining the charges, **attractive for unlike** and **repulsive for like** charges, and the two forces on the pair are **equal and opposite** (Newton’s third law). The quantity ε₀ = 8.854 × 10⁻¹² C²N⁻¹m⁻² is the **permittivity of free space**.

<div class="meaning">

<dl>
<dt>F</dt><dd>the force between the charges, in newtons (N)</dd>
<dt>q₁, q₂</dt><dd>the charges in coulombs, with their signs</dd>
<dt>r</dt><dd>the distance between the charges in metres</dd>
<dt>k, ε₀</dt><dd>constants of the electric force; in a medium ε₀ is replaced by ε₀ε<sub>r</sub> and the force falls by the factor ε<sub>r</sub> (the relative permittivity: 1 for air, about 80 for water)</dd>
<dt>Physical meaning</dt><dd>The force gets 4 times weaker when you double the distance (the “inverse square” rule). Because k is so big, 1 C is an enormous charge: two 1 C charges 1 m apart would push each other with 9 × 10⁹ N, the weight of about a million tonnes.</dd>
</dl>

</div>

Play with it. Notice that doubling r divides F by 4 and that reversing one sign turns repulsion into attraction:

<figure class="fig" data-fig="c12p-field-coulomb"><figcaption>Two charges you can change. The arrows are the equal and opposite forces; their length follows the size of F on a log scale, the exact value is in the readout.</figcaption></figure>

**Vector form.** To handle direction, write the force on charge 1 due to charge 2 as `$\vec F_{12} = k\,\dfrac{q_1q_2}{r^2}\,\hat r_{21}$`, where `$\hat r_{21}$` is a unit vector pointing from charge 2 to charge 1. A positive product q₁q₂ gives a force along that unit vector (away from 2: repulsion). And `$\vec F_{21} = -\vec F_{12}$`.

<div class="problem" data-problem="c12p-field-coulomb"></div>

<div class="problem" data-problem="c12p-field-scale"></div>

**Electric versus gravitational.** Newton’s gravity law has the same 1/r² shape, but electric forces are far stronger. For two protons the ratio is `$\dfrac{ke^2}{Gm_p^2} \approx 10^{36}$`: gravity is hopelessly weak at the scale of atoms, and it only wins in planets and stars because they are electrically neutral.

### Forces between many charges: superposition

When there are more than two charges, the force of each one on a chosen charge is not changed by the presence of the others. So the **net force is the vector sum** of the forces from each charge taken alone. This is the **principle of superposition**.

<div class="steps" data-fig="c12p-field-superpose">
<div class="step">Two charges of +4 µC lie 60 cm apart. A test charge of +1 µC is 40 cm above the midpoint, so it is 0.5 m from each (a 3-4-5 triangle).</div>
<div class="step">Charge A alone pushes the test charge away from A with F = kq₁q₂/r² = 9×10⁹ × 4×10⁻⁶ × 1×10⁻⁶ ÷ 0.5² = 0.144 N, along the line from A.</div>
<div class="step">Charge B does the same from the other side: also 0.144 N, along the line from B.</div>
<div class="step">Forces are vectors, so add them with the parallelogram rule. The diagonal of the parallelogram is the net force.</div>
<div class="step">To get a number, split each force into a horizontal and a vertical part. The vertical part of each is 0.144 × (0.4/0.5) = 0.115 N, pointing up. The horizontal part of each is 0.144 × (0.3/0.5) = 0.086 N, one to the left and one to the right.</div>
<div class="step">The horizontal parts cancel. The vertical parts add: F = 2 × 0.144 × (0.4/0.5) = 0.23 N, straight up, away from the line AB.</div>
</div>

## 3. The electric field

How does charge 1 “know” that charge 2 is there? We say charge 2 fills the space around it with an **electric field**, and charge 1 responds to the field at its own position. The field is defined using a tiny **test charge** q₀ (small enough not to disturb the others):

```math
\vec E = \frac{\vec F}{q_0}
```

Its unit is newton per coulomb (N/C), the same as volt per metre. For a point charge Q the field at distance r is

```math
E = \frac{1}{4\pi\varepsilon_0}\frac{Q}{r^2}, \quad \text{directed away from } Q \text{ if } Q>0, \text{ toward it if } Q<0
```

A charge q placed in a field E feels a force `$\vec F = q\vec E$`: along E for a positive charge, opposite to E for a negative one. For several charges the fields add as vectors, just as the forces did.

<div class="meaning">

<dl>
<dt>E</dt><dd>the electric field at a point: force per unit positive charge, in N/C</dd>
<dt>q₀</dt><dd>a small positive test charge, used only to define E; the field exists without it</dd>
<dt>Q, r</dt><dd>the source charge and the distance from it</dd>
<dt>Physical meaning</dt><dd>E is a property of the <b>point in space</b>, set by the source charges. Put any charge q there and the force is qE. The field also carries energy and momentum, and it is the thing that makes electromagnetic waves possible.</dd>
</dl>

</div>

<div class="problem" data-problem="c12p-field-efield"></div>

### Electric field lines

A field line is a picture of the field: a curve whose **tangent at each point gives the direction of E**, and whose **closeness shows the strength**. The rules:

- Lines start on positive charges and end on negative charges (or go off to infinity).
- Two lines never cross, because E has only one direction at a point.
- Lines are close together where the field is strong and far apart where it is weak.
- Lines never form closed loops in electrostatics, and they leave and meet a conductor’s surface at right angles.

Drag the charges below and watch how the lines rearrange. Add a second positive charge and see the empty “neutral point” between them where the fields cancel.

<figure class="fig" data-fig="c12p-field-draglines"><figcaption>Field lines you can reshape. Try “+ and −” (a dipole), “+ and +” (the lines bend away from each other), and “two rows” (nearly parallel lines between them, like a capacitor). Add a +2 charge and see it send out twice as many lines.</figcaption></figure>

The tool below plots the field of any set of charges you place on a grid, and shows the field vector at any point:

<!--fig:tool field-line-plotter-->

## 4. Electric flux

To count how much field goes through a surface, we define the **electric flux**. For a flat area A in a uniform field E,

```math
\Phi = \vec E\cdot\vec A = EA\cos\theta
```

where θ is the angle between E and the **normal** to the surface (the area vector A points along the outward normal). Think of rain falling on a tilted tray: the amount of rain that lands depends on the tray’s area as seen from above, `$A\cos\theta$`. Flux is the number of field lines going through. Its unit is N m²/C.

<figure class="fig" data-fig="c12p-field-flux"><figcaption>Turn the surface. The highlighted lines are the ones that pass through it; their number follows cos θ. At 90° no line goes through; beyond 90° the lines enter from the other side and the flux is negative.</figcaption></figure>

For a **closed surface** the normal points outward everywhere, so flux going out is positive and flux coming in is negative. For a non-uniform field or a curved surface we add up small pieces: `$\Phi = \oint \vec E\cdot d\vec A$`.

<div class="problem" data-problem="c12p-field-flux"></div>

## 5. Electric dipole

An **electric dipole** is a pair of equal and opposite charges +q and −q a small distance 2a apart. A water molecule is an everyday example: its oxygen end is slightly negative and its hydrogen end slightly positive. Its **dipole moment** is

```math
\vec p = q\,(2\vec a), \qquad p = 2qa
```

in coulomb metres, a vector pointing **from −q to +q**. The total charge of a dipole is zero, yet it has a field, because the two charges are at slightly different places.

### Field on the axis (end-on) of a dipole

Take a point P on the line through both charges, at distance r from the centre (r bigger than a). The +q charge is at distance r − a, the −q at r + a. The two fields point in opposite directions and the nearer positive charge wins.

<div class="steps" data-fig="c12p-field-dipolesteps">
<div class="step">Put the dipole on the horizontal axis with −q at x = −a and +q at x = +a. Choose a point P on the axis, at distance r from the centre. The distances to the charges are r − a (to +q) and r + a (to −q).</div>
<div class="step">The field of +q at P points away from +q (to the right), size E₊ = kq/(r − a)². The field of −q points toward −q (to the left), size E₋ = kq/(r + a)². E₊ is bigger because +q is nearer.</div>
<div class="step">Subtract: E = kq[1/(r − a)² − 1/(r + a)²] = kq · 4ar / (r² − a²)² = 2kp·r/(r² − a²)². For a short dipole (r much bigger than a) we drop a² next to r²: E = 2kp/r³, in the direction of p.</div>
<div class="step">Now the equatorial point: P on the perpendicular bisector, distance r from the centre. Both charges are at the same distance √(r² + a²), so both fields have the same size kq/(r² + a²).</div>
<div class="step">E₊ points away from +q, E₋ toward −q. Split each into a part along the bisector and a part parallel to the dipole axis. The parts along the bisector are equal and opposite: they cancel. The parts parallel to the axis both point the same way (from +q side to −q side) and add.</div>
<div class="step">Each parallel part is E₊ cos θ with cos θ = a/√(r² + a²). So E = 2 × kq/(r² + a²) × a/√(r² + a²) = kp/(r² + a²)^{3/2}, which is kp/r³ for r much bigger than a, pointing opposite to p.</div>
</div>

Written out as results:

```math
E_{\text{axial}} = \frac{2kp}{r^3}\ \ (\text{along } \vec p), \qquad E_{\text{equatorial}} = \frac{kp}{r^3}\ \ (\text{opposite to } \vec p)
```

<figure class="fig" data-fig="c12p-field-dipolefield"><figcaption>Field against distance on a log-log graph, so each power law is a straight line. A single charge falls as 1/r²; a dipole falls as 1/r³, which is faster because its two charges nearly cancel. The axial line sits at twice the equatorial one. Change the separation: the lines are exact formulas, and for large r they join the 1/r³ rule.</figcaption></figure>

<div class="meaning">

<dl>
<dt>p = 2qa</dt><dd>dipole moment (C m), from −q to +q</dd>
<dt>r</dt><dd>distance from the centre of the dipole; the formulas hold for r much bigger than a</dd>
<dt>Physical meaning</dt><dd>A dipole is “almost neutral”, so far away its field dies off faster (1/r³) than a single charge’s (1/r²). At the axis it is twice as strong as at the same distance on the equator.</dd>
</dl>

</div>

<div class="problem" data-problem="c12p-field-axial"></div>

### A dipole in a uniform electric field

Place a dipole in a uniform field E at an angle θ to it. The force on +q is qE along E, on −q it is qE opposite to E. The forces are equal and opposite, so **there is no net force**, but they act at different points, so they make a **torque**:

```math
\tau = qE\times 2a\sin\theta = pE\sin\theta, \qquad \vec\tau = \vec p\times\vec E
```

The torque turns the dipole so that p lines up with E. The potential energy is `$U = -pE\cos\theta$`: smallest (−pE) when p is along E, largest (+pE) when opposite.

<figure class="fig" data-fig="c12p-field-torque"><figcaption>Set the angle, then press Release. The dipole swings through the aligned position and settles there (with a little friction). Equilibrium at 0° is stable; at 180° it is unstable, and the torque pushes it away from there.</figcaption></figure>

In a **non-uniform** field the forces on the two charges are also unequal, so there is a net force as well as a torque. That is why a charged comb picks up neutral bits of paper: the comb’s field polarises the paper into tiny dipoles, and the nearer, stronger end wins.

<div class="problem" data-problem="c12p-field-torque"></div>

Try the dipole torque tool, with the energy and the oscillation, here: [Dipole torque](/learn/dipole-torque/). For more complicated arrangements of charges use the [Electrostatics solver](/science/electrostatics-solver/).

## 6. Continuous charge distributions

Real charged objects (a wire, a sheet, a sphere) have so many charges that we treat the charge as smooth. We use three densities:

- **Linear charge density** `$\lambda = \dfrac{\Delta q}{\Delta l}$` (C/m) for a wire,
- **Surface charge density** `$\sigma = \dfrac{\Delta q}{\Delta S}$` (C/m²) for a sheet or a surface,
- **Volume charge density** `$\rho = \dfrac{\Delta q}{\Delta V}$` (C/m³) for a solid.

To find the field we cut the object into tiny pieces dq, treat each as a point charge, and add their fields (an integral). For a symmetrical object this is long, so we use Gauss’s law instead.

## 7. Gauss’s law

The total flux through any closed surface equals the net charge inside divided by ε₀:

```math
\oint \vec E\cdot d\vec A = \frac{q_{\text{enclosed}}}{\varepsilon_0}
```

Try the idea in the figure below before you read the explanation: move a charge in and out of a sphere and watch the total flux. The program adds up the tiny contributions E·dA over the whole surface by brute force.

<figure class="fig" data-fig="c12p-field-gauss"><figcaption>Green arrows leave the surface, orange arrows enter. With the charge inside, the flux is exactly q/ε₀ (1.000 in the readout) wherever it sits. With the charge outside, every line that goes in comes out again: zero. Change the charge and the number scales with it.</figcaption></figure>

**Why it works for a point charge.** For a point charge at the centre of a sphere of radius r, E is the same everywhere on the surface and points outward, so `$\Phi = E\times 4\pi r^2 = \dfrac{q}{4\pi\varepsilon_0 r^2}\times4\pi r^2 = \dfrac{q}{\varepsilon_0}$`. The r² cancels, because the field falls as 1/r² and the area grows as r². That cancellation is why Gauss’s law is exactly true: it is the 1/r² rule in disguise. The same count of lines goes out through a sphere of any size, or any odd shape round the charge.

<div class="myth">

**“Gauss’s law gives the field only inside the surface,” or “zero flux means zero field.”** The surface can be any imaginary shape. The flux depends only on the charge **inside**, but the field **on** the surface comes from all charges, inside and outside. Zero flux just means as many lines enter as leave.

</div>

<figure class="fig" data-fig="@em-gauss-surface"><figcaption>A second view of the same law: resize the sphere and drag the charges. The flux through the surface is added up numerically and compared with Q<sub>enclosed</sub>/ε₀.</figcaption></figure>

<!--fig:tool gauss-law-->

**How to use it.** The law is always true, but it only *calculates* a field easily when the symmetry lets us choose a surface on which E is constant and perpendicular (or parallel) to the surface. Three cases:

### (a) A long straight wire, charge λ per unit length

By symmetry E points straight away from the wire and has the same size at the same distance r. Choose a coaxial cylinder of radius r and length l as the Gaussian surface. No flux passes through the flat ends (E is parallel to them). Through the curved side the flux is E × 2πrl.

```math
E\,(2\pi r l) = \frac{\lambda l}{\varepsilon_0} \;\Rightarrow\; E = \frac{\lambda}{2\pi\varepsilon_0 r}
```

The field falls as 1/r.

<div class="problem" data-problem="c12p-field-wire"></div>

### (b) An infinite plane sheet, charge σ per unit area

<div class="steps" data-fig="c12p-field-pillbox">
<div class="step">A large flat sheet with uniform surface charge σ, drawn edge-on.</div>
<div class="step">By symmetry E must be perpendicular to the sheet and have the same size at equal distances on both sides, pointing away if σ is positive.</div>
<div class="step">Take a cylinder (a “pillbox”) with its axis perpendicular to the sheet, with the sheet through its middle, each flat end of area A.</div>
<div class="step">On the curved wall E is parallel to the surface, so E·dA = 0 there: no flux through the wall.</div>
<div class="step">At each flat end E is perpendicular to the surface and outward, so the flux is E·A. The two ends together give 2EA.</div>
<div class="step">The charge inside the pillbox is σA. Gauss’s law: 2EA = σA/ε₀, so E = σ/2ε₀, independent of distance from the sheet.</div>
<div class="step">Put two opposite sheets (+σ and −σ) side by side. Between them both fields point the same way and add to σ/ε₀. Outside they point opposite ways and cancel to zero. This is the parallel-plate capacitor of the next chapter.</div>
</div>

```math
E = \frac{\sigma}{2\varepsilon_0}\quad(\text{each side}); \qquad \text{two opposite sheets: } E = \frac{\sigma}{\varepsilon_0}\ \text{between, } 0 \text{ outside}
```

<div class="problem" data-problem="c12p-field-sheet"></div>

### (c) A thin spherical shell, total charge Q and radius R

By symmetry E points radially and depends only on the distance r from the centre. Use a concentric sphere as the Gaussian surface.

- **Outside (r > R):** the sphere encloses all of Q. `$E\,(4\pi r^2) = Q/\varepsilon_0$`, so `$E = \dfrac{Q}{4\pi\varepsilon_0 r^2}$`: the same as a point charge Q at the centre.
- **On the surface (r = R):** `$E = \dfrac{Q}{4\pi\varepsilon_0R^2} = \dfrac{\sigma}{\varepsilon_0}$`.
- **Inside (r < R):** the sphere encloses no charge, so E = 0.

<figure class="fig" data-fig="c12p-field-gaussgraph"><figcaption>Pick a shape and slide the distance. The shell is zero inside and then falls as 1/r²; the wire falls as 1/r; the sheet is flat. These three graphs are worth remembering as pictures.</figcaption></figure>

<div class="problem" data-problem="c12p-field-shell"></div>

Another way to see the answer inside the shell: for a point inside, tiny cones of area on opposite sides of the shell give equal and opposite pushes (more area is further away, but the 1/r² cancels it), so the net field is zero anywhere inside.

Before moving on, one more ready-made explorer for the work of this chapter, with every tool for the other topics linked: [Coulomb forces](/learn/coulomb-forces/) lets you place several charges and see the net force on each.

<div class="history">

<ul class="timeline">
<li><b>600 BC</b> Thales of Miletus notices that amber rubbed with fur picks up light objects. The Greek word for amber, <i>elektron</i>, gives us “electricity”.</li>
<li><b>1750</b> Benjamin Franklin names the two kinds of charge positive and negative and proposes that charge is conserved.</li>
<li><b>1785</b> Coulomb measures the inverse-square force law with a torsion balance.</li>
<li><b>1830s</b> Michael Faraday introduces the idea of field lines to describe electric and magnetic forces.</li>
<li><b>1909</b> Robert Millikan’s oil-drop experiment shows that charge comes in whole multiples of e.</li>
</ul>

</div>

<div class="myth">

**“Field lines are real threads in space, and charges move along them.”** Lines are only a drawing. A charge starting from rest does move along a straight field line, but in a curved field its path usually departs from the line, because the line only gives the direction of the force, not of the velocity.

</div>

<div class="history">

**Beyond the syllabus (not examined in Class 12 boards).** The field of a uniformly charged solid sphere inside it grows as `$E = \dfrac{Qr}{4\pi\varepsilon_0R^3}$`; the field of a charged ring on its axis is `$E = \dfrac{kQx}{(x^2+R^2)^{3/2}}$`; and the field of a dipole at an arbitrary angle θ has radial part `$2kp\cos\theta/r^3$` and sideways part `$kp\sin\theta/r^3$`. Use them for entrance exams, not for the school paper.

</div>

<div class="keypoints">

- Two kinds of charge; like repel, unlike attract. Charge is additive, conserved and quantised (q = ne, e = 1.6 × 10⁻¹⁹ C).
- Coulomb’s law: F = kq₁q₂/r², k = 9 × 10⁹ N m²/C²; along the line joining the charges; in a medium divided by ε<sub>r</sub>. Net force on a charge is the vector sum (superposition).
- Electric field E = F/q₀; for a point charge E = kQ/r²; force on a charge q is qE.
- Field lines: tangent gives direction, density gives strength; start on +, end on −, never cross.
- Flux Φ = EA cos θ (N m²/C); for a closed surface the outward flux is positive.
- Dipole moment p = 2qa (from − to +). Axial field 2kp/r³ (along p), equatorial kp/r³ (opposite to p), for r ≫ a.
- Dipole in a uniform field: no net force, torque τ = pE sin θ, energy U = −pE cos θ; θ = 0 is stable.
- Gauss’s law: Φ = q<sub>enclosed</sub>/ε₀ for any closed surface.
- Long wire E = λ/(2πε₀r); infinite sheet E = σ/2ε₀ (two opposite sheets: σ/ε₀ between, 0 outside); thin shell E = kQ/r² outside, 0 inside.

</div>

Going further for JEE/NEET: the exam-level problems, with net force on charges in non-uniform arrangements and Gauss’s law for solid spheres, are in [Electric charges and fields (JEE)](/learn/courses/engineering-entrance/electric-charges-fields/), with extra questions in [its question set](/learn/courses/engineering-entrance/electric-charges-fields-questions/).
