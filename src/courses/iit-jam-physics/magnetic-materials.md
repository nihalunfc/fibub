---
title: 'Magnetic materials: B, H and M'
seoTitle: Magnetic materials, B, H and M for IIT JAM Physics
summary: 'Magnetisation and bound currents, the H field and Ampère''s law for free current, B = μ0(H + M), susceptibility and permeability, dia-, para- and ferromagnetism, the Curie and Curie-Weiss laws, hysteresis, boundary conditions, magnetised spheres and rods, and magnetic circuits with air gaps.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: A long rod is uniformly magnetised along its length, with no free current anywhere. Far from its ends, what are B and H inside?
    choices: ['B = μ0M, H = 0', 'B = 0, H = M', 'B = μ0M, H = M', 'B = 0, H = 0']
    ans: 0
    why: The rod is a solenoid of bound surface current K = M, so B = μ0M inside. Then H = B/μ0 − M = 0. No free current does not mean no B.
  - q: A paramagnet obeys Curie's law. Its absolute temperature is doubled. What happens to its susceptibility?
    choices: ['It halves', 'It doubles', 'It stays the same', 'It falls to a quarter']
    ans: 0
    why: χ = C/T. Hotter moments are scrambled more by thermal motion, so they line up less and χ falls in proportion to 1/T.
  - q: An iron electromagnet has a 1 mm air gap. Which part sets the current needed for a given gap field?
    choices: ['Mostly the air gap', 'Mostly the iron path', 'Iron and gap equally', 'Neither: only the number of turns']
    ans: 0
    why: Reluctances add in series. The iron's is divided by μr (around a thousand), so a millimetre of air outweighs most of a metre of iron.
sources:
  - 'D. J. Griffiths, Introduction to Electrodynamics, 4th ed. (2017), chapter 6: magnetic fields in matter'
  - 'E. M. Purcell and D. J. Morin, Electricity and Magnetism, 3rd ed. (2013), chapter 11'
  - 'C. Kittel, Introduction to Solid State Physics, 8th ed. (2005), chapters 11 and 12 (para- and ferromagnetism)'
  - 'IIT JAM Physics syllabus (Electricity and Magnetism section), published by the organising IIT each year'
---

**Module 4 · about 45 minutes.** By the end you will be able to turn a magnetisation into bound currents, use `$\vec H$` and Ampère's law with free current only, tell dia-, para- and ferromagnets apart by their susceptibility, read a hysteresis loop, apply the boundary conditions, and design an electromagnet with an air gap.

<div class="bigidea">Every atom is a tiny current loop; when a field lines them up, their currents cancel inside the material but not at its surface, and that surface current is what makes iron multiply a magnetic field a thousand times.</div>

## 1. Magnetisation and bound currents

Electrons orbiting and spinning give atoms magnetic moments. In a field they line up (or, in diamagnets, an opposing moment is induced). The **magnetisation** `$\vec M$` is the magnetic moment per unit volume, in A/m.

A magnetised material acts like two sets of current:

```math
\vec J_b = \nabla\times\vec M \ \ (\text{inside}), \qquad \vec K_b = \vec M\times\hat n \ \ (\text{on the surface})
```

Picture uniform `$\vec M$` as a grid of identical little loops: neighbouring loops carry opposite currents along their shared edges and cancel, leaving only the current round the outside edge. A rod magnetised along its axis is therefore a solenoid with `$nI = M$`: `$B = \mu_0M$` inside. With `$M = 8\times10^5$` A/m (typical iron), that is 1 T, and a 10 cm rod carries a bound current of 80 kA round its side. No wire could do that without melting; this is why permanent magnets are so convenient.

**Worked example.** `$\vec M = ks\,\hat\phi$` in a long cylinder: `$\vec J_b = \dfrac1s\dfrac{d}{ds}(ks^2)\hat z = 2k\hat z$`, and on the surface `$\vec K_b = \vec M\times\hat s = -kR\hat z$`. The two exactly cancel in total, as bound currents must across any cross-section.

## 2. The H field

The magnetic field comes from all currents, free and bound. Define

```math
\vec H = \frac{\vec B}{\mu_0} - \vec M, \qquad \nabla\times\vec H = \vec J_f, \qquad \oint\vec H\cdot d\vec l = I_{f,\text{enc}}
```

so Ampère's law for `$\vec H$` needs only the free current in the wires. In a **linear** material `$\vec M = \chi_m\vec H$`, so `$\vec B = \mu_0(1 + \chi_m)\vec H = \mu\vec H$` with `$\mu_r = 1 + \chi_m$`.

**Worked example.** A solenoid with 1000 turns/m carrying 2.0 A: `$H = nI = 2000$` A/m whatever the core. With soft iron of `$\mu_r = 500$`, `$B = \mu_0\mu_rH = 1.26$` T, five hundred times the empty value.

<div class="meaning">

<dl>
<dt>M</dt><dd>how strongly the material is magnetised: magnetic moment per cubic metre (A/m)</dd>
<dt>J_b, K_b</dt><dd>the leftover edges of all the atomic current loops; real currents, but bound to atoms</dd>
<dt>H</dt><dd>a field whose curl is the free current only; set by the wires you wind, in A/m</dd>
<dt>B = μ₀(H + M)</dt><dd>the actual field, which exerts forces and whose flux induces EMFs</dd>
<dt>Physical meaning</dt><dd>H is what you apply with your coils; M is how the material answers; B is the sum of both and is what a compass or a moving charge feels.</dd>
</dl>

</div>

<div class="myth">

**"H points the same way as B, just smaller."** Inside a permanent magnet it does not. With no free current `$\oint\vec H\cdot d\vec l = 0$`: outside, `$\vec H$` runs from N to S, so inside it must run N to S as well, *against* `$\vec M$`. `$\vec B$` makes closed loops and runs S to N inside. `$\vec H$` lines start and end on the poles, like electric field lines on charges.

</div>

## 3. Three kinds of magnetism

| Kind | `$\chi_m$` | Temperature | Origin |
|---|---|---|---|
| Diamagnetic (Cu, water, Bi) | about `$-10^{-5}$` | nearly none | orbits respond to the field by Lenz's law; present in all matter |
| Paramagnetic (Al, O₂, salts) | `$+10^{-5}$` to `$10^{-3}$` | Curie: `$\chi = C/T$` | permanent moments partly aligned against thermal agitation |
| Ferromagnetic (Fe, Co, Ni) | up to `$10^5$`, not constant | ordered below `$T_c$`, Curie-Weiss above | exchange forces align neighbours into domains |
| Superconductor (Meissner) | exactly `$-1$` | below `$T_c$` | surface supercurrents expel `$\vec B$` |

Diamagnets are pushed out of strong fields, paramagnets pulled in. **Curie's law** comes from moments `$\mu$` in field `$B$`: alignment needs `$\mu B$` to compete with `$k_BT$`, giving `$\chi = \dfrac{\mu_0N\mu^2}{3k_BT}$` for moments free to point anywhere. For spin-½ moments of one Bohr magneton in 1 T at 300 K, the excess pointing along the field is `$\tanh(\mu_BB/k_BT) \approx 2\times10^{-3}$`: only two in a thousand.

**Ferromagnets.** Weiss's idea: each moment feels an extra field `$\lambda M$` from its neighbours. Then `$M = (C/T)(H + \lambda M)$` gives the **Curie-Weiss law** `$\chi = \dfrac{C}{T - T_c}$` with `$T_c = \lambda C$`; below `$T_c$` the material magnetises spontaneously in domains. Iron fully aligned has `$M_s = N\cdot2.2\mu_B \approx 1.7\times10^6$` A/m, so `$\mu_0M_s \approx 2.2$` T.

Choose each material, then raise B and lower T. Watch the atomic arrows line up (or not) and read M.

<figure class="fig" data-fig="@em-mag-types"><figcaption>Diamagnets oppose the field weakly; paramagnets line up a little more when cold; ferromagnets below T_c have domains that grow when B is applied.</figcaption></figure>

## 4. Hysteresis

Drive a ferromagnet with a coil and sweep `$H$` up and down. Domains grow and shrink with friction, so `$B$` does not retrace its path:

<figure class="fig" data-fig="hysteresis-loop"><figcaption>A B-H loop traced as H sweeps back and forth. Slide the coercivity from soft (thin loop, transformer cores) to hard (wide loop, permanent magnets). The shaded area is the energy lost as heat in every cycle.</figcaption></figure>

- **Remanence** `$B_r$`: the field left when `$H$` returns to zero.
- **Coercivity** `$H_c$`: the reverse `$H$` needed to bring `$B$` to zero.
- **Loop area** `$\oint H\,dB$`: energy turned to heat per unit volume per cycle. A core with loop area 300 J/m³ and volume 1 litre, run at 50 Hz, wastes 15 W.

Soft materials (small `$H_c$`, thin loops) suit transformers and electromagnets; hard materials (large `$H_c$`) make permanent magnets, which must resist their own demagnetising field.

## 5. Boundary conditions and shapes

At a boundary with no free surface current:

```math
B_{1\perp} = B_{2\perp}, \qquad H_{1\parallel} = H_{2\parallel}
```

(the magnetic mirror of the dielectric rules, with `$\vec B$` as `$\vec D$` and `$\vec H$` as `$\vec E$`). Lines bend as `$\dfrac{\tan\theta_2}{\tan\theta_1} = \dfrac{\mu_2}{\mu_1}$`: entering iron with `$\mu_r = 1000$` at `$45^\circ$`, they run almost along the surface, and leaving iron they come out almost perpendicular to it.

**Shape matters.**

- Long rod magnetised along its axis: `$B = \mu_0M$`, `$H = 0$`.
- Uniformly magnetised sphere: `$\vec B_{\text{in}} = \tfrac23\mu_0\vec M$`, `$\vec H_{\text{in}} = -\tfrac13\vec M$`; outside, *exactly* a dipole of moment `$\tfrac43\pi R^3\vec M$`. Just outside, `$B$` is `$\tfrac23\mu_0M$` at the poles (matching `$B_\perp$`) but `$\tfrac13\mu_0M$` (reversed) at the equator.
- Linear sphere in a uniform `$B_0$`: `$B_{\text{in}} = \dfrac{3\mu_r}{\mu_r + 2}B_0$`, so even `$\mu_r\to\infty$` only triples it.
- A wire on the axis of a linear cylinder: `$H = I/2\pi s$` from the free current, `$B = \mu_0(1 + \chi_m)I/2\pi s$` inside the material.

**Worked example.** `$M = 1.0\times10^5$` A/m in a sphere: `$B_{\text{in}} = \tfrac23(1.2566\times10^{-6})(10^5) = 83.8$` mT, and `$H_{\text{in}} = -3.3\times10^4$` A/m.

## 6. Magnetic circuits

Iron guides flux the way copper guides current. Round a core of path `$l$` with a gap `$g$` (same `$B$` in both, neglecting fringing), Ampère's law for `$\vec H$` gives

```math
\frac{B}{\mu_0\mu_r}l + \frac{B}{\mu_0}g = NI \quad\Rightarrow\quad B = \frac{\mu_0NI}{l/\mu_r + g}
```

Each term is a **reluctance** (flux "resistance") in series. With `$\mu_r = 2000$`, `$l = 0.50$` m and a 1.0 mm gap, the iron counts as 0.25 mm of air, so the gap dominates: 200 turns at 1.0 A give `$B = \dfrac{(1.2566\times10^{-6})(200)}{1.25\times10^{-3}} = 0.201$` T. The pull of an electromagnet on an iron plate across a thin gap is `$\dfrac{B^2A}{2\mu_0}$`: the field's energy density acts as a pressure.

<div class="problem" data-problem="gap-electromagnet"></div>

A ring of permanent magnet with fixed `$M$` and a small gap: no free current, so `$H_m(l - g) + H_gg = 0$`, which gives `$B = \mu_0M(l - g)/l$` in the gap, slightly less than `$\mu_0M$`. The [magnetic circuit solver](/science/magnetic-circuit/) works out reluctance, flux and inductance for cores of iron or ferrite with gaps, and the [coil field designer](/science/coil-field-designer/) does air-cored coils.

<div class="keypoints">

- `$\vec J_b = \nabla\times\vec M$`, `$\vec K_b = \vec M\times\hat n$`. Uniformly magnetised rod = solenoid with `$nI = M$`.
- `$\vec H = \vec B/\mu_0 - \vec M$`, `$\oint\vec H\cdot d\vec l = I_f$`; linear: `$\vec B = \mu_0\mu_r\vec H$`, `$\mu_r = 1 + \chi_m$`.
- Dia: `$\chi\approx-10^{-5}$`, `$T$`-independent. Para: `$\chi = C/T$`. Ferro: hysteresis, domains, `$\chi = C/(T - T_c)$` above `$T_c$`. Superconductor: `$\chi = -1$`.
- Hysteresis: remanence at `$H = 0$`, coercivity at `$B = 0$`, loop area = heat per volume per cycle. Soft for transformers, hard for magnets.
- Boundaries: `$B_\perp$`, `$H_\parallel$` continuous. Sphere: `$B_{\text{in}} = \tfrac23\mu_0M$`, `$H_{\text{in}} = -\tfrac13M$`; rod: `$B = \mu_0M$`, `$H = 0$`.
- Magnetic circuit: `$B = \mu_0NI/(l/\mu_r + g)$`; the gap usually dominates. Holding force `$B^2A/2\mu_0$`.

</div>

## Practise: exam questions on this lesson

These start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [magnetic materials practice page](/learn/courses/iit-jam-physics/practice/magnetic-materials/).

<div class="qbank" data-bank="physics" data-topics="magnetic-materials" data-exam="jam" data-n="10"></div>

**Next:** [electromagnetic induction and inductance](/learn/courses/iit-jam-physics/induction/), where iron cores raise inductances by `$\mu_r$`. The electric twin of this lesson is [dielectrics and capacitors](/learn/courses/iit-jam-physics/dielectrics/); the fields of the free currents came from [Biot-Savart and Ampère](/learn/courses/iit-jam-physics/magnetostatics/). For [the quantum theory of magnetism](/learn/courses/gate-physics/magnetism/) at MSc level, see the GATE Physics course.
