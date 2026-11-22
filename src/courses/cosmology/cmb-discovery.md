---
title: "Penzias and Wilson hear the Big Bang"
seoTitle: "Who discovered the cosmic microwave background?"
summary: "In 1964 two radio engineers could not get rid of a faint hiss coming from every direction in the sky. It was the cooled light of the hot young universe, 3 degrees above absolute zero. How they found it, and why it settled the Big Bang argument."
minutes: 14
updated: 2026-11-22
quiz:
  - q: "What did Penzias and Wilson actually measure?"
    choices: ["About 3.5 K more radio noise than they could explain, the same in every direction","A picture of the early universe","A radio signal from a distant galaxy"]
    ans: 0
    why: "At 7.35 cm wavelength their horn measured 6.7 K of noise looking straight up; the air, the antenna and the ground explained only about 3.2 K. The 3.5 K left over came from every direction, day and night."
  - q: "Why was the CMB a blow to the Steady State theory?"
    choices: ["It showed that stars are older than the universe","A universe that never changes has no hot, dense past to leave a glow filling all of space","It proved that the universe has an edge"]
    ans: 1
    why: "A sea of cool radiation, the same everywhere, is just what a hot dense beginning leaves behind after expansion stretches it. A steady, unchanging universe gives no natural way to make it."
  - q: "The CMB set off at about 3,000 K and is 2.7 K today. By how much has the universe stretched since?"
    choices: ["About 30 times","About 1,100 times","About 1 million times"]
    ans: 1
    why: "Temperature falls as 1/a, so 1 + z = 3,000 ÷ 2.7255 ≈ 1,100. Every wavelength has been stretched by the same factor."
sources:
  - "A. A. Penzias and R. W. Wilson (1965), A measurement of excess antenna temperature at 4080 Mc/s, ApJ 142, 419 https://doi.org/10.1086/148307"
  - "R. H. Dicke, P. J. E. Peebles, P. G. Roll and D. T. Wilkinson (1965), Cosmic black-body radiation, ApJ 142, 414 https://doi.org/10.1086/148306"
  - "R. A. Alpher and R. C. Herman (1948), Evolution of the universe, Nature 162, 774 https://doi.org/10.1038/162774b0"
  - "P. G. Roll and D. T. Wilkinson (1966), Cosmic background radiation at 3.2 cm: support for cosmic black-body radiation, Physical Review Letters 16, 405 https://doi.org/10.1103/PhysRevLett.16.405"
  - "R. W. Wilson (1978), The cosmic microwave background radiation, Nobel lecture https://www.nobelprize.org/prizes/physics/1978/wilson/lecture/"
---

**Module 7 · about 14 minutes.** Read first: [6.9 Recombination](/learn/courses/cosmology/recombination/). About 380,000 years after the start, the universe became transparent and its light set off across space. This module is about that light, the cosmic microwave background (CMB). Here is how it was found, by accident, in 1964. By the end you will be able to explain what Penzias and Wilson measured and why it changed cosmology.

<div class="bigidea">The whole sky glows faintly with microwaves at 2.7 degrees above absolute zero: the stretched, cooled light of the hot young universe, found by two engineers trying to get rid of noise.</div>

## 1. A hiss that would not go away

In 1964 Arno Penzias and Robert Wilson, radio astronomers at Bell Telephone Laboratories, took over a strange-looking antenna at Holmdel, New Jersey. It was a horn 15 metres long with a 6-metre opening, built in 1959 to talk to the Echo communication satellites, and it was the quietest radio receiver in the world. They wanted to use it to measure faint radio glow from the Milky Way. First they had to know exactly how much noise the equipment itself made.

Every radio receiver hears some noise, like the hiss of a radio between stations. Engineers measure it as a temperature: a warm object gives off more radio noise than a cold one. Penzias and Wilson compared the sky with a reference load cooled by liquid helium, and added up every source of noise they knew. It did not add up.

<div class="steps" data-fig="cmb-discovery">
<div class="step">Pointed straight up at a wavelength of 7.35 cm (4,080 MHz), the horn measured a noise temperature of about 6.7 K.</div>
<div class="step">The air above gives off radio noise too. Measured by tilting the antenna, it added about 2.3 K straight up.</div>
<div class="step">Losses in the antenna and its wiring added about 0.8 K, and the warm ground, leaking in from behind, less than 0.1 K. Expected total: about 3.2 K.</div>
<div class="step">About 3.5 K was left over. It was the same in every direction, day and night, through the seasons. It was not the Milky Way, not New York City, not the Sun.</div>
<div class="step">They even cleaned out the pigeons nesting in the horn and their droppings. The 3.5 K stayed. It was coming from the universe itself.</div>
</div>

<div class="problem" data-problem="cmb-discovery-excess"></div>

## 2. A phone call to Princeton

Fifty kilometres away, at Princeton University, Robert Dicke, Jim Peebles, Peter Roll and David Wilkinson were building a small radiometer to search for exactly this: the leftover glow of a hot early universe. Peebles had worked out that it should be a few kelvin. When Penzias heard about their work, he phoned Dicke. After the call, as the story goes, Dicke turned to his team and said: "Boys, we've been scooped."

The two groups published side by side in the *Astrophysical Journal* in 1965: Penzias and Wilson's modest "measurement of excess antenna temperature", and the Princeton paper explaining what it meant. In 1966 Roll and Wilkinson measured the glow at a second wavelength, 3.2 cm, and found about 3.0 K: the same temperature at two wavelengths, as a blackbody should give (next lesson).

## 3. What they had found

Go back to [Lesson 6.9](/learn/courses/cosmology/recombination/). Before recombination the universe was a glowing fog of hydrogen and helium nuclei, electrons and light, at thousands of degrees. When it cooled to about 3,000 K, the electrons joined the nuclei, the fog cleared, and the light flew free. Look in any direction and, far enough away, you see that moment: a glowing wall all around us, like the inside of a cloud seen from below. It is called the **last-scattering surface**.

Since then space has stretched about 1,100 times, and so has every wavelength of that light ([Lesson 4.5](/learn/courses/cosmology/cosmological-redshift/)). Red and near-infrared light at 3,000 K has become microwaves at 2.7 K:

```math
T(z) = T_0\,(1 + z), \qquad T_0 = 2.7255\ \text{K}
```

<div class="meaning">

<dl>
<dt>T(z)</dt><dd>the temperature of the CMB when the light we see now at redshift z was travelling, in kelvin</dd>
<dt>T<sub>0</sub></dt><dd>its temperature today, 2.7255 K, measured by COBE</dd>
<dt>1 + z</dt><dd>how many times the universe has stretched since then (Lesson 4.5)</dd>
<dt>Physical meaning</dt><dd>Stretching space stretches the light, and stretched light is cooler light. Run the film backwards and the universe gets hotter without limit: the "hot" in hot Big Bang.</dd>
</dl>

</div>

<div class="problem" data-problem="cmb-discovery-stretch"></div>

## 4. Why it settled the argument

In 1965 the Big Bang and the Steady State theory ([Lesson 6.2](/learn/courses/cosmology/big-bang-vs-steady-state/)) were still fighting. The Steady State universe never changes, so it never had a hot, dense past. To make a smooth glow filling all space with the right temperature, its supporters had to suppose starlight was absorbed and re-emitted by some unknown kind of dust. The Big Bang predicted the glow with no extra ideas at all. Most cosmologists changed their minds within a few years. Today the CMB is the single most important source of evidence about the early universe, and the rest of this module shows why.

<div class="history">

**Predicted, then forgotten.** In 1948 Ralph Alpher and Robert Herman, working with George Gamow ([Lesson 6.1](/learn/courses/cosmology/gamow-alpher-herman/)), predicted that the hot beginning should have left radiation at about 5 K. Nobody went looking: radio astronomers did not know about the prediction, and the cosmologists thought it would be impossible to detect. There had even been a clue. In 1941 Andrew McKellar found that cyanogen molecules in interstellar space were slightly warmed, as if bathed in radiation at about 2.3 K, but no one connected it to cosmology.

<ul class="timeline">
<li><b>1941</b> McKellar's interstellar molecules hint at a 2 to 3 K bath</li>
<li><b>1948</b> Alpher and Herman predict about 5 K</li>
<li><b>1964</b> Doroshkevich and Novikov point out that the Bell Labs horn could detect it</li>
<li><b>1964–65</b> Penzias and Wilson find the 3.5 K excess</li>
<li><b>1965</b> Dicke's group explains it; the two papers appear together</li>
<li><b>1978</b> Penzias and Wilson share the Nobel Prize in Physics</li>
</ul>

</div>

<div class="myth">

**"The CMB comes from one spot in the sky, where the Big Bang happened."** It comes equally from every direction, because the Big Bang happened everywhere ([Lesson 4.4](/learn/courses/cosmology/not-an-explosion/)). The light was not made by an explosion at the start, either: it is the glow of the whole universe at 380,000 years old, the moment it became transparent.

</div>

<div class="keypoints">

- In 1964–65 Penzias and Wilson found about 3.5 K of radio noise at 7.35 cm that came equally from every direction.
- Dicke, Peebles, Roll and Wilkinson explained it as the cooled glow of the hot early universe; Alpher and Herman had predicted it in 1948.
- The light left the last-scattering surface at about 3,000 K; space has stretched about 1,100 times since, cooling it to 2.7255 K: T = T<sub>0</sub>(1 + z).
- It was decisive evidence for the hot Big Bang over the Steady State. Nobel Prize 1978.

</div>
