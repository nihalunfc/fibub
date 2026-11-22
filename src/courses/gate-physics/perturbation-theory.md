---
title: 'Time-independent perturbation theory'
summary: 'Perturbation theory from first principles: the first-order energy as an average, the first-order state, second-order shifts and why the ground state always moves down, degenerate levels and the good basis, two-level systems and avoided crossings, perturbed wells and oscillators checked against exact answers, and the linear and quadratic Stark effects.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'An oscillator is perturbed by H′ = λx. What is the first-order energy shift of every level?'
    choices: ['0', 'λ√(ħ/2mω)', '−λ²/2mω²', 'λ(n + ½)']
    ans: 0
    why: 'Every |ψ_n|² is even and x is odd, so ⟨n|x|n⟩ = 0. The exact shift −λ²/2mω² appears at second order.'
  - q: 'A degenerate pair is perturbed by H′ = [[0, V], [V, 0]]. What are the first-order shifts?'
    choices: ['±V', '0 and 0', 'V and 0', '±V²']
    ans: 0
    why: 'Diagonalise H′ inside the degenerate level: eigenvalues ±V, for the states (|1⟩ ± |2⟩)/√2. Zero diagonal elements do not mean zero shifts.'
  - q: 'Why does the hydrogen ground state show no linear Stark effect?'
    choices: ['⟨100|z|100⟩ = 0 by parity and the level is not degenerate', 'The field is screened by the proton', 'The electron spin cancels it', 'The ground state has l = 0, so it cannot be polarised']
    ans: 0
    why: 'With no degenerate partner of opposite parity there is no first-order shift. It can still be polarised: the shift starts at second order, −½αℰ².'
sources:
  - 'D. J. Griffiths and D. F. Schroeter, Introduction to Quantum Mechanics, 3rd ed. (2018), chapter 7: time-independent perturbation theory'
  - 'J. J. Sakurai and J. Napolitano, Modern Quantum Mechanics, 3rd ed. (2021), section 5.1 and 5.2: non-degenerate and degenerate perturbation theory'
  - 'L. D. Landau and E. M. Lifshitz, Quantum Mechanics (Non-relativistic Theory), 3rd ed. (1977), sections 38 to 39 and 76'
  - 'GATE Physics (PH) syllabus, quantum mechanics section, published by the organising institute each year'
---

**Module 4 · about 55 minutes.** By the end you will be able to compute first- and second-order energy shifts and first-order states, decide when a level is degenerate and handle it properly, solve two-level problems exactly and compare with the series, and apply all of this to wells, oscillators and hydrogen in a field. You need matrix elements of `$x$` from [lesson 4.4](/learn/courses/gate-physics/harmonic-oscillator/), Hermitian matrices from [lesson 1.2](/learn/courses/gate-physics/matrices-eigenvalues/), and the hydrogen states of [lesson 4.6](/learn/courses/gate-physics/hydrogen-atom/).

<div class="bigidea">When a small term H′ is added to a problem you can solve, the energy first moves by the average of H′ in the old state; at the next order every other level pushes it away, more strongly the closer it is. When levels are degenerate, H′ first chooses the right combinations, and then splits them.</div>

## 1. The perturbation series

Write `$H = H_0 + \lambda H'$`, with known `$H_0|n^{(0)}\rangle = E_n^{(0)}|n^{(0)}\rangle$`, and expand `$E_n = E_n^{(0)} + \lambda E_n^{(1)} + \lambda^2E_n^{(2)} + \dots$`, `$|n\rangle = |n^{(0)}\rangle + \lambda|n^{(1)}\rangle + \dots$`. Match powers of `$\lambda$`.

<div class="steps">
<div class="step">

Pick a bump or a tilt, raise λ slowly, and compare the exact answer with first and second order for n = 1, 2, 3.

<figure class="fig" data-fig="@qm-perturbed-well"><figcaption>First order is the average of the perturbation in the unperturbed state, and second order mends most of the rest until λV is comparable with the level spacing.</figcaption></figure>

**First order.** `$(H_0 - E_n^{(0)})|n^{(1)}\rangle = (E_n^{(1)} - H')|n^{(0)}\rangle$`. Project on `$\langle n^{(0)}|$`: the left side vanishes because `$H_0$` is Hermitian, so `$E_n^{(1)} = \langle n^{(0)}|H'|n^{(0)}\rangle = H'_{nn}$`.

</div>
<div class="step">

**The state.** Project on `$\langle m^{(0)}|$` with `$m \ne n$`: `$(E_m - E_n)\langle m|n^{(1)}\rangle = -H'_{mn}$`. So `$|n^{(1)}\rangle = \sum_{m\ne n}\dfrac{H'_{mn}}{E_n^{(0)} - E_m^{(0)}}|m^{(0)}\rangle$` (the component along `$|n^{(0)}\rangle$` can be set to zero).

</div>
<div class="step">

**Second order.** Project the `$\lambda^2$` equation on `$\langle n^{(0)}|$`: `$E_n^{(2)} = \langle n^{(0)}|H'|n^{(1)}\rangle = \sum_{m\ne n}\dfrac{|H'_{mn}|^2}{E_n^{(0)} - E_m^{(0)}}$`.

</div>
<div class="step">

**Signs.** Levels below `$n$` push it up, levels above push it down. For the ground state every denominator is negative, so `$E_0^{(2)} \le 0$`: always down. Also `$E_0^{(0)} + E_0^{(1)} = \langle0|H|0\rangle \ge E_0$` by the variational principle.

</div>
</div>

```math
E_n \approx E_n^{(0)} + H'_{nn} + \sum_{m\ne n}\frac{|H'_{mn}|^2}{E_n^{(0)} - E_m^{(0)}}, \qquad \text{valid while } |H'_{mn}| \ll |E_n^{(0)} - E_m^{(0)}|
```

<div class="meaning">

<dl>
<dt>H′<sub>nn</sub></dt><dd>the perturbation averaged over the unperturbed state: first-order shift</dd>
<dt>H′<sub>mn</sub>/(E<sub>n</sub> − E<sub>m</sub>)</dt><dd>how much of level m the perturbation mixes in; it must be small for the series to work</dd>
<dt>|H′<sub>mn</sub>|²/(E<sub>n</sub> − E<sub>m</sub>)</dt><dd>level repulsion: the shift caused by that mixing, always pushing the two levels apart</dd>
<dt>Physical meaning</dt><dd>At first order the state is frozen and only the energy responds; at second order the state bends towards configurations that lower the energy, so the system always gains from adapting.</dd>
</dl>

</div>

**Worked example (well).** An infinite well `$0 < x < a$` gets an extra `$V_0$` over the middle half. Ground state: `$E_1^{(1)} = V_0\int_{a/4}^{3a/4}\tfrac2a\sin^2\tfrac{\pi x}{a}dx = \left(\tfrac12 + \tfrac1\pi\right)V_0 = 0.82V_0$`, more than half because `$\psi_1$` crowds the middle. A delta `$\alpha\delta(x - a/2)$` shifts level `$n$` by `$\tfrac{2\alpha}{a}\sin^2\tfrac{n\pi}{2}$`: even levels have a node there and do not notice it.

**Worked example (oscillator).** With `$x = \sqrt{\hbar/2m\omega}(a + a^\dagger)$`:

1. `$H' = \lambda x$`: `$H'_{nn} = 0$`; only `$n \pm 1$` connect, so `$E_n^{(2)} = \dfrac{\lambda^2\hbar}{2m\omega}\left[\dfrac{n}{\hbar\omega} - \dfrac{n + 1}{\hbar\omega}\right] = -\dfrac{\lambda^2}{2m\omega^2}$`, exactly the completed-square answer.
2. `$H' = \lambda x^2$`: `$E_n^{(1)} = \lambda(n + \tfrac12)\hbar/m\omega$`. Exact: `$\omega \to \omega\sqrt{1 + 2\lambda/m\omega^2}$`; for `$2\lambda/m\omega^2 = 0.2$`, the ground state shifts by `$0.0477\hbar\omega$` exactly, `$0.05$` at first order, `$0.0475$` at second.
3. `$H' = \lambda x^4$`: `$E_n^{(1)} = 3\lambda(\hbar/2m\omega)^2(2n^2 + 2n + 1)$`, growing with `$n$`: the levels spread apart.

<div class="problem" data-problem="pt-three-level"></div>

## 2. Two levels exactly: avoided crossings

The two-level problem is solvable for any coupling, and it shows where the series works and where it fails:

```math
H = \begin{pmatrix}E_1 & V\\V^* & E_2\end{pmatrix}, \qquad E_\pm = \frac{E_1 + E_2}{2} \pm\sqrt{\left(\frac{E_1 - E_2}{2}\right)^2 + |V|^2}
```

For `$|V| \ll |E_1 - E_2|$`, expanding the root gives back `$E_1 + |V|^2/(E_1 - E_2)$`: second order. At `$E_1 = E_2$` the series blows up, while the exact levels stay `$2|V|$` apart and the states become equal mixtures. As the detuning is swept the levels **avoid crossing**.

<figure class="fig" data-fig="avoided-crossing"><figcaption>Two coupled levels against detuning. Solid: exact eigenvalues, which never cross while V ≠ 0. Dashed: uncoupled levels. Dotted: second-order perturbation theory, excellent far away and divergent near the crossing, where the degenerate treatment (±V) takes over. The readout gives the mixing of the two states.</figcaption></figure>

## 3. Degenerate levels

If `$E_n^{(0)}$` is `$g$`-fold degenerate, the formulas divide by zero. The cure: first-order theory inside the level is an eigenvalue problem. Form the `$g\times g$` matrix `$W_{ij} = \langle i|H'|j\rangle$` in any basis of the level and diagonalise it. Its eigenvalues are the first-order shifts; its eigenvectors are the **good** zeroth-order states, the ones the perturbation picks out (often fixed by a symmetry that `$H'$` keeps, such as `$L_z$` or parity).

Pick the lower, upper and 2p±1 states of n = 2, raise the field, then switch to n = 1.

<figure class="fig" data-fig="@qm-stark"><figcaption>The n = 2 levels shift in straight lines because 2s and 2p mix into states with permanent dipoles; the ground state bends down as F² (induced dipole).</figcaption></figure>

**Worked example (2D oscillator).** The level `$n_x + n_y = 1$` holds `$|10\rangle, |01\rangle$`. With `$H' = \lambda xy$`, `$W = \dfrac{\lambda\hbar}{2m\omega}\begin{pmatrix}0&1\\1&0\end{pmatrix}$`, so the shifts are `$\pm\lambda\hbar/2m\omega$` for vibrations along the diagonals `$x = \pm y$`.

**Worked example (linear Stark effect).** Hydrogen `$n = 2$` in a field `$\mathcal E\hat z$`, `$H' = e\mathcal Ez$`. The operator `$z$` is odd and has `$\Delta m = 0$`, so within the four states only `$\langle200|z|210\rangle = -3a_0$` survives. The `$2\times2$` block gives `$\pm3e\mathcal Ea_0$` for `$(|200\rangle \mp |210\rangle)/\sqrt2$`; `$2p_{\pm1}$` stay put. For `$10^7$` V/m the outer components move by `$1.6$` meV. A linear effect needs degenerate states of opposite parity, which only hydrogen's accidental degeneracy supplies.

**The ground state in a field** has no partner, so its shift is `$E^{(2)} = -e^2\mathcal E^2\sum_m\dfrac{|\langle m|z|100\rangle|^2}{E_m - E_1} = -\tfrac12\alpha\mathcal E^2$`. Replacing every denominator by the smallest one, `$E_2 - E_1$`, and using closure, `$\sum_m|z_{m1}|^2 = \langle z^2\rangle = a_0^2$`, bounds the polarisability: `$\alpha \le \tfrac{16}{3}(4\pi\epsilon_0)a_0^3$` (exact `$4.5$`).

<div class="myth">

**"The first-order shift is zero, so the level does not move."** In the oscillator with `$\lambda x$` or hydrogen's ground state in a field, the shift is entirely second order, and it is negative.

**"In a degenerate level I can use any basis and read off the diagonal elements of H′."** Only in the good basis. In the 2D oscillator example both diagonal elements are zero, yet the level splits by `$\lambda\hbar/m\omega$`.

</div>

<div class="keypoints">

- `$E^{(1)}_n = H'_{nn}$`; `$|n^{(1)}\rangle = \sum_{m\ne n}\dfrac{H'_{mn}}{E_n - E_m}|m\rangle$`; `$E^{(2)}_n = \sum_{m\ne n}\dfrac{|H'_{mn}|^2}{E_n - E_m}$`.
- Ground-state second-order shift is never positive; levels repel; the series needs `$|H'_{mn}| \ll |E_n - E_m|$`.
- Degenerate level: diagonalise `$H'$` in the level; eigenvalues are the shifts.
- Two levels: `$E_\pm = \bar E \pm\sqrt{\Delta^2/4 + |V|^2}$`, minimum gap `$2|V|$` (avoided crossing).
- Oscillator: `$\lambda x \Rightarrow -\lambda^2/2m\omega^2$` (all levels, second order); `$\langle n|x^4|n\rangle = 3(\hbar/2m\omega)^2(2n^2 + 2n + 1)$`.
- Stark: hydrogen `$n = 2$` splits into `$\pm3e\mathcal Ea_0$` and `$0$` (twice); ground state `$-\tfrac12\alpha\mathcal E^2$`.

</div>

## Practise: GATE questions on this lesson

They start easy and climb to top-rank level. More on the [perturbation theory practice page](/learn/courses/gate-physics/practice/perturbation-theory/) and the [GATE Physics practice page](/learn/courses/gate-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="perturbation-theory" data-exam="gate" data-n="10"></div>

**Next:** [lesson 4.9](/learn/courses/gate-physics/variational-wkb/) gives two methods that work when there is no small parameter: the variational method and WKB. Back to the [GATE Physics course](/learn/courses/gate-physics/).
