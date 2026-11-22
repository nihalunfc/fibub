---
title: "Getting around: Hohmann transfers and the rocket equation"
seoTitle: "Hohmann transfer orbits and the rocket equation | Astronomy"
summary: "To go from Earth to Mars you don't aim at Mars: you speed up into an ellipse that touches both orbits, then speed up again on arrival. The rocket equation says how much fuel each change of speed costs."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "A Hohmann transfer from Earth to Mars starts by:"
    choices: ["Pointing straight at Mars", "Speeding up along Earth's direction of motion", "Slowing down"]
    ans: 1
    why: "A burn forwards raises the far side of the orbit out to Mars's distance."
  - q: "In the rocket equation, doubling the exhaust speed:"
    choices: ["Halves the Δv", "Doubles the Δv for the same mass ratio", "Makes no difference"]
    ans: 1
    why: "Δv = v_e ln(m₀/m_f), so Δv is proportional to v_e."
  - q: "Why are launch windows to Mars about 26 months apart?"
    choices: ["Mars must be in the right place when you arrive, and the planets line up that way every synodic period", "Rockets need two years to build", "The Sun blocks Mars otherwise"]
    ans: 0
    why: "The Earth-Mars arrangement repeats every synodic period, about 780 days."
sources: []
---

**Module 2 · about 25 minutes · square roots and logarithms.** You'll be able to describe a Hohmann transfer, work out its two burns and flight time, and use the rocket equation to find how much of a rocket must be fuel.

## 1. Why this matters

Every mission to the Moon and planets is planned with these ideas. They explain why spacecraft take months to reach Mars, why launches wait for "windows", and why rockets are mostly fuel. They are also the start of real mission design, which you can explore with fibub's orbit tools.

## 2. Speed up to go out

In orbit, things work backwards from intuition. To reach a higher orbit you speed up, which lifts the far side of your orbit. The cheapest way between two circular orbits is the **Hohmann transfer** (Walter Hohmann, 1925): one burn to enter an ellipse that just touches both orbits, half an orbit of coasting, and a second burn to match the new circle.

<!--fig:hohmann-->

Things to notice:

- For Mars (1.52 AU) the flight takes about 260 days, half the period of the transfer ellipse.
- Going further costs more, but not without limit: very distant orbits need less extra speed than you might guess, and the flight time grows long.
- A faster exhaust shrinks the mass ratio a lot: the fuel cost grows exponentially with Δv.

<details class="maths" open>
<summary>Maths and principle</summary>

**Vis-viva equation:** the speed anywhere on an orbit of size `$a$`, at distance `$r$`:

```math
v = \sqrt{GM\left(\frac{2}{r} - \frac{1}{a}\right)}
```

**Hohmann transfer** from `$r_1$` to `$r_2$`: the ellipse has `$a_t = (r_1 + r_2)/2$`.

```math
\Delta v_1 = v_t(r_1) - v_\text{circ}(r_1), \qquad \Delta v_2 = v_\text{circ}(r_2) - v_t(r_2), \qquad t = \pi\sqrt{\frac{a_t^3}{GM}}
```

**Rocket equation** (Tsiolkovsky, 1903): with exhaust speed `$v_e$`, start mass `$m_0$` and end mass `$m_f$`:

```math
\Delta v = v_e \ln\frac{m_0}{m_f} \qquad\Leftrightarrow\qquad \frac{m_0}{m_f} = e^{\Delta v / v_e}
```

**Try it:** Earth to Mars around the Sun: `$\Delta v_1 = 2.95$` km/s, `$\Delta v_2 = 2.65$` km/s, flight 259 days.
</details>

## 3. What it means physically

A rocket pushes itself forward by throwing mass backwards, so each extra km/s means carrying fuel, and the fuel to carry that fuel, and so on. That is why the mass ratio grows exponentially. The Hohmann transfer is cheap because it uses the Sun's gravity to do the coasting; the price is time, and the need for Mars to arrive at the meeting point exactly when you do.

## 4. Worked example

*A probe with a chemical engine (v_e = 3.5 km/s) makes both Earth-to-Mars burns, 5.6 km/s in total. What fraction of its starting mass must be fuel?*

```math
\frac{m_0}{m_f} = e^{5.6/3.5} = e^{1.6} = 4.95
```

Only `$1/4.95 = 20\%$` of the starting mass is left at the end: 80% was fuel. And that ignores the much bigger cost of climbing out of Earth's gravity in the first place (about 9.4 km/s to low orbit, including losses).

## 5. Practice

1. For a Hohmann transfer from 1 AU to 4 AU, what is the transfer ellipse's `$a_t$`, and how long is the flight?
2. An ion engine has `$v_e$` = 30 km/s. What mass ratio does it need for 5.6 km/s?
3. Why does a transfer to Venus (0.72 AU) start with a burn backwards?

<details>
<summary>Answers</summary>

1. `$a_t = 2.5$` AU; flight = half its period = `$2.5^{1.5}/2 = 1.98$` years.
2. `$e^{5.6/30} = e^{0.187} = 1.21$`: only 17% fuel. Ion engines push very gently, though, so they take months to deliver it.
3. To fall inwards you must slow down, lowering the near side of the orbit to Venus's distance.
</details>

**Try it with real numbers:** plan transfers with the [[orbit-transfer-calculator]], find launch windows on a [[porkchop-plot]], and size a rocket with the [[rocket-equation]] tool.

**New words:** *Hohmann transfer*, *delta-v*, *vis-viva equation*, *rocket equation*, *exhaust speed*, *mass ratio*, *launch window*.
