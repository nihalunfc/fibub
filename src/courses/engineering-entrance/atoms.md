---
title: 'Atoms'
seoTitle: 'Atoms, Bohr model and spectra: JEE and NEET physics'
summary: 'Rutherford''s alpha scattering and the nuclear atom, distance of closest approach and impact parameter, Bohr''s postulates, radius, speed and energy of orbits for hydrogen-like atoms, spectral series and the number of lines, excitation and ionisation, de Broglie''s view of orbits, and X-rays with Moseley''s law.'
minutes: 32
updated: 2026-11-22
quiz:
  - q: 'In the Bohr model, the total energy of the electron in the nth orbit is related to its kinetic energy K by:'
    choices: ['E = K', 'E = −K', 'E = 2K', 'E = −2K']
    ans: 1
    why: 'For an inverse-square attraction, U = −2K, so E = K + U = −K. That is why the ground state energy −13.6 eV means K = +13.6 eV.'
  - q: 'The Balmer series of hydrogen lies mainly in the:'
    choices: ['ultraviolet', 'visible region', 'infrared', 'X-ray region']
    ans: 1
    why: 'Jumps down to n = 2 give photons of 1.9 to 3.4 eV, 656 nm down to 365 nm: mostly visible. Lyman (to n = 1) is ultraviolet; Paschen (to n = 3) infrared.'
  - q: 'An electron in hydrogen falls from n = 5 to the ground state through all possible paths. The number of different spectral lines is:'
    choices: ['4', '5', '10', '15']
    ans: 2
    why: 'Any pair of the five levels can give a line: 5 × 4/2 = 10.'
sources:
  - 'National Medical Commission NEET (UG) syllabus and JEE Main / JEE Advanced 2026 syllabi: Atoms and nuclei'
  - 'Rydberg constant, Bohr radius and hydrogen ionisation energy (13.6 eV), CODATA 2022 via NIST https://physics.nist.gov/cuu/Constants/'
---

**Physics · Class 12 · about 32 minutes.** By the end you will be able to use Rutherford scattering to estimate nuclear size, apply Bohr's model to any hydrogen-like atom, find spectral lines and their number, and work out X-ray wavelengths.

<div class="bigidea">An atom is almost empty: a tiny heavy nucleus with electrons far away. Electrons there can only have certain energies, like the rungs of a ladder. Jumping down a rung gives out one photon whose energy is the height of the jump, which is why every element has its own barcode of spectral lines.</div>

## 1. Rutherford's nuclear atom

Alpha particles fired at thin gold foil mostly went straight through, a few bent a lot, and about 1 in 8000 bounced back. Thomson's spread-out "plum pudding" atom could not turn an alpha particle back. Rutherford concluded that all the positive charge and nearly all the mass sit in a **nucleus** about 10⁻¹⁵ to 10⁻¹⁴ m across, inside an atom about 10⁻¹⁰ m across.

Move the impact parameter, then switch on the whole beam and change the target and the energy.

<figure class="fig" data-fig="@qm-rutherford"><figcaption>A small impact parameter means a large deflection, and only an almost head-on α comes straight back. The counts fall as 1/sin⁴(θ/2).</figcaption></figure>

- **Distance of closest approach** (head-on): all kinetic energy becomes potential energy, `$r_0 = \dfrac{k(2e)(Ze)}{K}$`. With ke² = 1.44 MeV fm, `$r_0 = \dfrac{2.88Z}{K\,(\text{MeV})}$` fm.
- **Impact parameter** b (how far off-centre the alpha aims) sets the scattering angle θ: `$b = \dfrac{kZe^2\cot(\theta/2)}{K}$`. Head-on (b = 0) gives θ = 180°.
- The number scattered at angle θ falls steeply, as `$\dfrac{1}{\sin^4(\theta/2)}$`.

<div class="problem" data-problem="at-closest-approach"></div>

Rutherford's model has a flaw: an orbiting electron accelerates, so by classical physics it should radiate, lose energy and spiral into the nucleus in about 10⁻⁸ s, giving a continuous spectrum. Atoms are stable and give line spectra.

## 2. Bohr's postulates

1. Electrons move in certain **stationary orbits** without radiating.
2. In these orbits the angular momentum is a whole number of h/2π: `$mvr = \dfrac{nh}{2\pi}$`.
3. A photon is emitted or absorbed only in a jump between orbits: `$h\nu = E_{\text{upper}} - E_{\text{lower}}$`.

Combining postulate 2 with the Coulomb force as the centripetal force gives, for a hydrogen-like atom of atomic number Z:

| Quantity | Formula | Hydrogen ground state |
|---|---|---|
| Radius | `$r_n = 0.529\,\dfrac{n^2}{Z}$` Å | 0.529 Å |
| Speed | `$v_n = 2.19\times10^6\,\dfrac{Z}{n}$` m/s | about c/137 |
| Energy | `$E_n = -13.6\,\dfrac{Z^2}{n^2}$` eV | −13.6 eV |
| Time period | `$T_n \propto \dfrac{n^3}{Z^2}$` | 1.5 × 10⁻¹⁶ s |

<div class="meaning">
<dl>
<dt>n</dt><dd>principal quantum number, 1, 2, 3, … (the rung of the ladder)</dd>
<dt>Z</dt><dd>atomic number: 1 for H, 2 for He⁺, 3 for Li²⁺ (only one electron)</dd>
<dt>Eₙ</dt><dd>total energy; negative because the electron is bound; zero means just free</dd>
<dt>K, U</dt><dd>kinetic energy +13.6Z²/n² eV, potential energy −27.2Z²/n² eV</dd>
<dt>Physical meaning</dt><dd>Higher orbits are bigger, slower and less tightly bound. The energy gaps shrink as n grows, so the lines in each series crowd together towards a limit.</dd>
</dl>
</div>

<div class="problem" data-problem="at-orbit-radius"></div>

<div class="myth">

**"An electron in a higher orbit has more kinetic energy."** It has less. Total energy rises (becomes less negative) with n, but kinetic energy, 13.6Z²/n² eV, falls. Only the potential energy rises, by twice as much.

</div>

Bohr's rule L = nħ has a wave meaning. Pick n = 1 to 6 and count the wavelengths round the orbit, then switch to 'Any wavelength' and drag to a fraction.

<figure class="fig" data-fig="@qm-bohr-standing"><figcaption>Only a whole number of wavelengths closes up on itself, which is the same as L = nħ. Between the whole numbers the wave cancels itself and no orbit survives.</figcaption></figure>

## 3. Spectral series

A jump from n₂ down to n₁ emits a photon of wavelength

```math
\frac1\lambda = RZ^2\left(\frac1{n_1^2} - \frac1{n_2^2}\right), \qquad R = 1.097\times10^7\ \text{m}^{-1}
```

Pick a series and a starting level below.

<figure class="fig" data-fig="hydrogen-series"><figcaption>Energy levels of a one-electron atom, drawn to scale. Every downward arrow is one spectral line of the chosen series; the highlighted one is the jump from the level picked on the slider. The levels crowd together towards n = ∞.</figcaption></figure>

| Series | Lower level n₁ | Region (hydrogen) |
|---|---|---|
| Lyman | 1 | ultraviolet (121.6 nm to 91.2 nm) |
| Balmer | 2 | visible (656 nm red Hα down to 365 nm) |
| Paschen | 3 | infrared |
| Brackett, Pfund | 4, 5 | far infrared |

The **first line** of a series (longest λ) comes from n₁ + 1; the **series limit** (shortest λ) from n = ∞. A gas of atoms excited to level n can give `$\dfrac{n(n-1)}{2}$` different lines; a single atom gives at most n − 1. **Absorption** at room temperature shows only the Lyman lines, since nearly all atoms sit in n = 1.

**Excitation and ionisation.** Ionisation energy of hydrogen is 13.6 eV (ionisation potential 13.6 V); first excitation energy 10.2 eV. An electron beam can give part of its energy to an atom; a photon must be absorbed whole, with exactly the right energy (or enough to ionise). A recoiling atom takes a tiny share of the photon's energy, about E²/(2Mc²).

**de Broglie's view.** An orbit is allowed when a whole number of electron waves fit round it: `$2\pi r = n\lambda$`. With λ = h/mv, this is exactly Bohr's mvr = nh/2π.

## 4. X-rays

Electrons accelerated through V volts hit a metal target. Two kinds of X-rays come out:

- **Continuous X-rays** (braking radiation), with a sharp shortest wavelength `$\lambda_{\min} = \dfrac{hc}{eV} = \dfrac{1240}{V}$` nm, set by the voltage alone.
- **Characteristic lines** (Kα, Kβ, …) when an inner electron is knocked out and an outer one falls in. Their energies depend on the target. **Moseley's law:** `$\sqrt\nu \propto (Z - b)$`, with b = 1 for Kα, so `$\nu_{K\alpha} \approx \dfrac34 Rc(Z - 1)^2$`. This put the periodic table in order of Z, not mass.

<div class="problem" data-problem="at-xray-cutoff"></div>

Raising the tube voltage shortens λ_min but leaves the characteristic lines where they are; raising the filament current gives more X-rays (intensity) of the same wavelengths. Only about 1% of the electrons' energy becomes X-rays; the rest heats the target.

**Worked example (level 4).** Which line of He⁺ has the same wavelength as the first Balmer line of hydrogen (3 → 2)? For He⁺, Z² = 4: `$4\left(\dfrac1{n_1^2} - \dfrac1{n_2^2}\right) = \dfrac14 - \dfrac19$` is satisfied by n₁ = 4, n₂ = 6. So **6 → 4 in He⁺**. In general, doubling both n values for He⁺ gives the same lines as hydrogen.

<div class="keypoints">

- Rutherford: tiny dense nucleus; r₀ = 2.88Z/K(MeV) fm; scattering ∝ 1/sin⁴(θ/2).
- Bohr: mvr = nh/2π; hν = E₂ − E₁.
- rₙ = 0.529n²/Z Å, vₙ = 2.19 × 10⁶ Z/n m/s, Eₙ = −13.6Z²/n² eV; E = −K = U/2.
- 1/λ = RZ²(1/n₁² − 1/n₂²); Lyman UV, Balmer visible, Paschen IR.
- Lines from level n: n(n − 1)/2. Ionisation 13.6Z² eV.
- de Broglie: 2πr = nλ gives Bohr's rule.
- X-rays: λ_min = 1240/V nm (voltage only); Moseley √ν ∝ (Z − 1) for Kα.

</div>
