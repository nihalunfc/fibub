---
title: "How will the universe end?"
seoTitle: "How will the universe end? Big Freeze, Big Rip, Big Crunch"
summary: "Dark energy decides the far future: a Big Freeze if it stays constant, a Big Rip if it grows, a Big Crunch if it decays. What each means and what data favour."
minutes: 16
updated: 2026-11-22
quiz:
  - q: "If dark energy is a cosmological constant, how does the universe end?"
    choices: ["A Big Freeze: it expands for ever, and stars burn out until everything is cold and dark","A Big Crunch in 20 billion years","A Big Rip"]
    ans: 0
    why: "Λ never thins, so expansion continues exponentially for ever. Not a sudden end, but a slow fading called heat death."
  - q: "What kind of dark energy would cause a Big Rip?"
    choices: ["Any dark energy with w = −1","Phantom dark energy, with w below −1, which grows denser as space grows","Dark matter"]
    ans: 1
    why: "Its density and the expansion rate climb without limit, reaching infinite size in a finite time and tearing apart galaxies, then stars, planets and atoms."
  - q: "Could the universe still end in a Big Crunch?"
    choices: ["Yes, it certainly will","No, never under any physics","Only if dark energy decays and turns negative, or something like it; nothing measured points that way now"]
    ans: 2
    why: "Our flat universe with positive dark energy keeps growing. A crunch needs the push to turn into a pull, which a few speculative models allow."
sources:
  - "R. R. Caldwell, M. Kamionkowski and N. N. Weinberg (2003), Phantom energy: dark energy with w < −1 causes a cosmic doomsday, Physical Review Letters 91, 071301 https://doi.org/10.1103/PhysRevLett.91.071301"
  - "F. C. Adams and G. Laughlin (1997), A dying universe: the long-term fate and evolution of astrophysical objects, Reviews of Modern Physics 69, 337 https://doi.org/10.1103/RevModPhys.69.337"
  - "L. M. Krauss and R. J. Scherrer (2007), The return of a static universe and the end of cosmology, General Relativity and Gravitation 39, 1545 https://doi.org/10.1007/s10714-007-0472-9"
  - "Planck Collaboration (2020), Planck 2018 results. VI. Cosmological parameters, A&A 641, A6 https://doi.org/10.1051/0004-6361/201833910"
---

**Module 9 · about 16 minutes.** Read first: [9.4 The equation of state w](/learn/courses/cosmology/equation-of-state/), [5.7 The classic universes](/learn/courses/cosmology/classic-models/) and [5.9 Horizons](/learn/courses/cosmology/cosmic-horizons/). Before 1998, the fate of the universe was a question about matter: enough to stop the expansion, or not? Now it is a question about dark energy, and in particular about its w. By the end you will be able to describe the three possible endings and work out when a Big Rip would happen.

<div class="bigidea">The far future hangs on one number. Dark energy that stays constant gives a slow, cold fade. Dark energy that grows tears the universe apart in finite time. Dark energy that dies away could let gravity win after all.</div>

## 1. Three endings

<div class="steps" data-fig="fate-of-universe">
<div class="step">w = −1, a cosmological constant. Matter thins out and dark energy takes over completely: the size grows exponentially, doubling about every 12 billion years, for ever. This is the Big Freeze.</div>
<div class="step">w = −1.5, phantom dark energy. Its density grows as space grows, so the expansion rate climbs faster and faster, and the size reaches infinity in a finite time: about 23 billion years from now. This is the Big Rip.</div>
<div class="step">A toy model where dark energy fades away and then turns negative. The push becomes a pull; the universe stops growing, turns round and falls back into a Big Crunch. This shows what it would take, not what is expected.</div>
<div class="step">w = −0.85, dark energy that thins slowly. Still a Big Freeze, with gentler growth. Every w between −1 and −1/3 ends the same way: endless, ever colder expansion.</div>
</div>

Shape no longer decides fate. Lesson 5.7 showed that with dark energy even a closed universe can expand for ever; only what dark energy does next really matters.

## 2. The Big Freeze

If w = −1, the expansion rate settles to a constant, H = H<sub>0</sub>√Ω<sub>Λ</sub> ≈ 56 km/s/Mpc, and the future goes roughly like this:

<ul class="timeline">
<li><b>Next few billion years:</b> the Milky Way and Andromeda probably merge; the Local Group becomes one big galaxy.</li>
<li><b>About 100 billion years and more:</b> every other galaxy has crossed the cosmic event horizon (<a href="/learn/courses/cosmology/cosmic-horizons/">Lesson 5.9</a>) and faded from view. Astronomers then could not see that the universe is expanding at all.</li>
<li><b>About 100 trillion years (10<sup>14</sup>):</b> the gas runs out, new stars stop forming, and the last red dwarfs burn out.</li>
<li><b>About 10<sup>67</sup> to 10<sup>100</sup> years:</b> even black holes evaporate by Hawking radiation, the biggest last.</li>
</ul>

What is left is a cold, dark, almost empty space, ever closer to a uniform temperature: the "heat death". Nothing explodes; there is simply nothing left that can change.

## 3. The Big Rip

If w < −1, dark energy gets **denser** as space grows (Lesson 9.4), the expansion rate H rises without limit, and the size reaches infinity at a definite time. Robert Caldwell, Marc Kamionkowski and Nevin Weinberg worked it out in 2003:

```math
t_{\text{rip}} - t_0 \approx \frac{2}{3}\,\frac{1}{|1+w|}\,\frac{1}{H_0}\,\frac{1}{\sqrt{1-\Omega_m}}
```

<div class="meaning">

<dl>
<dt>|1 + w|</dt><dd>how far below −1 the dark energy is. The smaller, the later the rip; at exactly w = −1 the time is infinite: no rip</dd>
<dt>1/H<sub>0</sub></dt><dd>the Hubble time, about 14.4 billion years for H<sub>0</sub> = 67.7</dd>
<dt>√(1 − Ω<sub>m</sub>)</dt><dd>today's share of dark energy (in a flat universe), under a square root: more dark energy, sooner rip</dd>
<dt>Physical meaning</dt><dd>For w = −1.5 the rip comes about 23 billion years from now. The formula ignores matter's small pull in the future, which is why the simulation's exact answer differs a little.</dd>
</dl>

</div>

<div class="problem" data-problem="fate-of-universe-rip"></div>

Because the expansion rate grows without limit, eventually even bound things cannot hold together. A system is torn apart roughly when the time left before the rip shrinks to a fraction of its own orbital period. For w = −1.5: galaxy clusters go first, the Milky Way about 60 million years before the end, the Earth leaves the Sun a few months before, the Earth itself explodes in the last half hour, and atoms are torn apart in the final 10<sup>−19</sup> seconds.

<div class="problem" data-problem="fate-of-universe-torn"></div>

## 4. The Big Crunch

Our flat universe with positive dark energy cannot recollapse. A crunch needs something new: dark energy that **decays** and drops below zero, or a negative cosmological constant hidden under a positive field that eventually rolls away. Some particle physics models allow this, and some fits to recent data (Lesson 9.6) leave room for dark energy that is weakening. Even then, a crunch would be tens of billions of years away at least.

**Which is it?** The data say w is within a few per cent of −1 today (Lesson 9.4). That points to the Big Freeze, or something very close to it. A Big Rip, if any, would be far off (for w = −1.03 roughly 400 billion years away), and a crunch is not required by anything we measure. But the far future depends on physics we do not understand yet, so treat every ending as a forecast, not a fact.

<div class="history">

**From crunch to freeze.**

<ul class="timeline">
<li><b>1922</b> Alexander Friedmann finds universes that expand and then recollapse.</li>
<li><b>1930s-1990s</b> "Is Ω above or below 1?" is the question of fate: crunch or endless coasting.</li>
<li><b>1997</b> Fred Adams and Greg Laughlin chart the far future of a freezing universe, up to 10<sup>100</sup> years and beyond.</li>
<li><b>1998</b> Dark energy found: fate now depends on it, not on Ω<sub>m</sub>.</li>
<li><b>2003</b> Caldwell, Kamionkowski and Weinberg describe the Big Rip.</li>
<li><b>2007</b> Lawrence Krauss and Robert Scherrer describe the lonely far future when other galaxies have vanished from view.</li>
</ul>

</div>

<div class="myth">

**"Heat death means the universe burns up."** It means the opposite. "Heat death" is the end of all differences in temperature, so no engine, star or living thing can run on them. The universe would be cold and nearly uniform, approaching a floor of about 10<sup>−30</sup> kelvin set by the faint glow of the cosmic event horizon itself.

</div>

<div class="keypoints">

- Dark energy, not matter, now decides the fate of the universe.
- w = −1 (or a little above): the Big Freeze. Exponential growth, galaxies vanish over the horizon, stars die, black holes evaporate: heat death.
- w &lt; −1 (phantom): the Big Rip, at t<sub>rip</sub> − t<sub>0</sub> ≈ (2/3)|1 + w|<sup>−1</sup> H<sub>0</sub><sup>−1</sup> (1 − Ω<sub>m</sub>)<sup>−1/2</sup>; about 23 billion years for w = −1.5. Bound systems are torn apart a fraction of their orbital period before the end, biggest first.
- A Big Crunch needs dark energy to decay and turn negative; nothing measured requires it.
- The data point to the Big Freeze, but the future depends on physics we do not yet know.

</div>
