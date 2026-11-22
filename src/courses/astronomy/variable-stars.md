---
title: "Variable stars: Cepheids and the cosmic yardstick"
seoTitle: "Variable stars and Cepheids explained | Astronomy"
summary: "Some stars change brightness: pulsating Cepheids, red giants like Mira, and eclipsing pairs. Henrietta Leavitt found that a Cepheid's period gives its true power, which turned these stars into distance markers."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "A Cepheid with a longer period is:"
    choices: ["More luminous", "Less luminous", "The same luminosity"]
    ans: 0
    why: "Leavitt's law: longer pulsation period means a bigger, more luminous star."
  - q: "Why are Cepheids called standard candles?"
    choices: ["Their true brightness is known from their period, so their faintness gives distance", "They all have the same brightness", "They burn like candles"]
    ans: 0
    why: "Knowing M from the period and measuring m gives m − M, hence distance."
  - q: "An eclipsing binary changes brightness because:"
    choices: ["The stars swell and shrink", "One star passes in front of the other", "Dust clouds pass by"]
    ans: 1
    why: "It's geometry: the stars take turns blocking each other's light."
sources:
  - "Leavitt, H. S. and Pickering, E. C. (1912), Harvard College Observatory Circular 173"
  - "Cepheid period-luminosity calibration (V band, rounded): Benedict, G. F. et al. (2007), AJ 133, 1810"
---

**Module 3 · about 25 minutes · logs and the distance modulus.** You'll be able to name the main kinds of variable star, use the period-luminosity rule, and find the distance to a Cepheid.

## 1. Why this matters

In 1912 Henrietta Swan Leavitt, studying photographic plates at Harvard, noticed that brighter Cepheids in the Small Magellanic Cloud pulsed more slowly. That single pattern let Edwin Hubble show in 1924 that the Andromeda "nebula" is a separate galaxy, and Cepheids still anchor today's measurements of the expansion of the universe (in the [cosmology course](/learn/courses/cosmology/)). Amateurs also contribute: tens of thousands of variable stars are watched by volunteers (Lesson 5.9).

## 2. Kinds of variable

- **Pulsating stars**: the star itself swells and shrinks. **Cepheids** (periods of 1 to 100 days, very luminous), **RR Lyrae stars** (half a day, all about the same power), and **long-period variables** like Mira (about a year, red giants).
- **Eclipsing binaries**: two stars take turns blocking each other.
- **Explosive variables**: novae and supernovae flare up suddenly.

A graph of brightness against time is a **light curve**. Finding its period is the first job (Lesson 5.2).

<!--fig:cepheid-pl-->

Things to notice:

- Cepheids brighten quickly and fade slowly, so their light curves look like a saw tooth.
- On the lower panel, a 10-day Cepheid is about 2.4 magnitudes, or 9 times, more powerful than a 1-day one.
- The same period with a fainter measured magnitude means a more distant star.

<details class="maths" open>
<summary>Maths and principle</summary>

**Period-luminosity rule** (Leavitt's law), rounded calibration in visible light, period `$P$` in days:

```math
M_V \approx -2.43\,(\log_{10}P - 1) - 4.05
```

**Distance** from the distance modulus (Lesson 1.5):

```math
d = 10^{(m - M)/5 + 1}\ \text{pc}
```

**Try it:** a 30-day Cepheid: `$M_V = -2.43\times(1.477 - 1) - 4.05 = -5.21$`.
</details>

## 3. What it means physically

A Cepheid pulsates because a layer of helium in it acts like a valve. When the star is squeezed, that helium gets more ionised and more opaque, trapping heat, which pushes the layer out; as it expands it becomes clearer, lets the heat escape and falls back. Bigger stars are fluffier, so they take longer to swing in and out, like a longer pendulum. Bigger also means more luminous, which is why period and power go together.

## 4. Worked example

*A Cepheid in a distant galaxy has a period of 10 days and average apparent magnitude 25.0. How far is the galaxy?*

```math
M_V = -2.43\times(1 - 1) - 4.05 = -4.05, \qquad m - M = 25.0 - (-4.05) = 29.05
```

```math
d = 10^{29.05/5 + 1} = 10^{6.81} = 6.5\times10^{6}\ \text{pc}
```

About 6.5 million parsecs, or 21 million light-years. (Dust would make it look fainter; real work corrects for it.)

## 5. Practice

1. What is `$M_V$` for a 3-day Cepheid?
2. A 10-day Cepheid has m = 15.0. How far away is it?
3. Why are RR Lyrae stars useful even though their period doesn't tell you their power?

<details>
<summary>Answers</summary>

1. `$-2.43\times(0.477 - 1) - 4.05 = -2.78$`.
2. `$m - M = 19.05$`, `$d = 10^{4.81} = 65{,}000$` pc (65 kpc), about as far as the Magellanic Clouds.
3. They all have nearly the same power (`$M_V \approx +0.6$`), so they are standard candles too, though fainter ones.
</details>

**Try it with real numbers:** find periods in light curves with the [[period-finder]], and log your own estimates with the [[variable-star-log]].

**New words:** *variable star*, *Cepheid*, *RR Lyrae*, *light curve*, *period-luminosity relation*, *standard candle*.
