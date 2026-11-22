---
title: "Gamow, Alpher and Herman: a hot beginning"
seoTitle: "Who predicted the Big Bang afterglow? Alpher and Herman"
summary: "In 1948 George Gamow and his students Ralph Alpher and Robert Herman asked how the elements were made, and found that the young universe must have been hot. That heat should still glow today at a few kelvin: the first prediction of the cosmic microwave background."
minutes: 14
updated: 2026-11-22
quiz:
  - q: "Why did Gamow's team conclude that the early universe was hot, not just dense?"
    choices: ["To make the right amount of helium, nuclear reactions had to run for only minutes, which needs a fast-expanding, radiation-filled universe","Because Einstein's equations require a temperature","Because hot gas was seen in distant galaxies"]
    ans: 0
    why: "A dense but cold start would have turned almost everything into heavy elements. Plenty of light made the universe expand fast enough to stop the cooking after a few minutes."
  - q: "Alpher and Herman predicted in 1948 that space today should glow at about:"
    choices: ["300 K","5 K","5,000 K"]
    ans: 1
    why: "Their estimate was about 5 K. The glow found in 1965 is 2.7 K: remarkably close for the numbers they had."
  - q: "What could their theory NOT do?"
    choices: ["Build the elements heavier than helium, because no stable nucleus has 5 or 8 particles","Make any helium","Explain why space expands"]
    ans: 0
    why: "Adding one particle at a time stalls at mass 5 and mass 8. The heavier elements were made later, in stars and stellar explosions."
sources:
  - "G. Gamow (1946), Expanding universe and the origin of elements, Physical Review 70, 572 https://doi.org/10.1103/PhysRev.70.572.2"
  - "R. A. Alpher, H. Bethe and G. Gamow (1948), The origin of chemical elements, Physical Review 73, 803 https://doi.org/10.1103/PhysRev.73.803"
  - "R. A. Alpher and R. Herman (1948), Evolution of the universe, Nature 162, 774 https://doi.org/10.1038/162774b0"
  - "C. Hayashi (1950), Proton-neutron concentration ratio in the expanding universe at the stages preceding the formation of the elements, Progress of Theoretical Physics 5, 224 https://doi.org/10.1143/ptp/5.2.224"
  - "E. M. Burbidge, G. R. Burbidge, W. A. Fowler and F. Hoyle (1957), Synthesis of the elements in stars, Reviews of Modern Physics 29, 547 https://doi.org/10.1103/RevModPhys.29.547"
  - "F. Hoyle and R. J. Tayler (1964), The mystery of the cosmic helium abundance, Nature 203, 1108 https://doi.org/10.1038/2031108a0"
  - "H. Kragh (1996), Cosmology and Controversy: The Historical Development of Two Theories of the Universe, Princeton University Press"
---

**Module 6 · about 14 minutes.** Read first: [4.6 Lemaître and the primeval atom](/learn/courses/cosmology/lemaitre/) and [5.5 How matter, radiation and dark energy thin out](/learn/courses/cosmology/matter-radiation-dark-energy/). Lemaître rewound the expansion to a dense beginning. In the 1940s a small team in Washington asked what that beginning would do to atoms, and discovered that it must have been hot. By the end you will be able to follow their argument from helium to a faint glow filling the sky, and work out the glow's temperature yourself.

<div class="bigidea">If the elements were cooked in the first minutes, the universe must have been filled with intense heat. Stretched by 13.8 billion years of expansion, that heat should still be here as a cold glow of a few kelvin, in every direction.</div>

## 1. A kitchen for the elements

Where do the chemical elements come from? In the 1940s nobody knew. Stars could turn hydrogen into helium (Hans Bethe had worked out how in 1938), but they did not seem hot enough to make the rest. The Ukrainian-born physicist **George Gamow**, working in Washington, D.C., had a bold idea in 1946: perhaps the young universe itself was the kitchen. Run the expansion backwards and everything is crushed together, hotter and denser than the inside of any star.

Gamow saw a catch. Nuclear reactions in a dense soup are fast. If the soup lasted long, it would cook everything into heavy elements, yet the universe is mostly hydrogen. So the cooking had to be **brief**, minutes not years. What keeps it brief? A universe filled with intense light expands very fast at first (light's energy adds to gravity's grip and to the speed of the early expansion; see [Lesson 5.5](/learn/courses/cosmology/matter-radiation-dark-energy/)). Fast expansion means fast cooling, and the oven switches itself off.

Think of baking bread in an oven whose door is thrown open after three minutes: the result depends on how hot the oven was and how fast it cooled.

## 2. Alpha, beta, gamma

Gamow's student **Ralph Alpher** did the calculation for his doctoral thesis. He imagined the universe starting as a hot gas of neutrons, which Gamow called *ylem* (an old word for primordial matter). Neutrons decay into protons; protons and neutrons stick together; nuclei grow by grabbing one neutron at a time. The paper, published on 1 April 1948, carried the names Alpher, Bethe and Gamow. Hans Bethe had not worked on it: Gamow, a famous joker, added him so the authors would read like the Greek letters alpha, beta, gamma.

The joke had a cost. Alpher, the young student who had done most of the work, was overshadowed by two famous names, and felt it for the rest of his life.

## 3. A prediction: the sky should glow

Later in 1948 Alpher and his colleague **Robert Herman** took the next step. If the universe was hot when the elements formed, where is that heat now? It cannot escape: there is nowhere outside the universe to go. It simply cools as space stretches. Two facts do the rest:

- the number of atoms in each cubic metre falls as 1/a³ as the universe grows by a factor a;
- the temperature of the light falls as 1/a, because each wave is stretched ([Lesson 4.5](/learn/courses/cosmology/cosmological-redshift/)).

So the temperature of the light goes as the cube root of the density of atoms. Know both at the time of element-making, measure the density of atoms today, and you can predict today's temperature:

```math
T_0 = T_\text{nuc}\left(\frac{n_0}{n_\text{nuc}}\right)^{1/3}
```

<div class="meaning">

<dl>
<dt>T<sub>nuc</sub></dt><dd>the temperature when the elements were made: about 10<sup>9</sup> K (one billion kelvin), a few minutes after the start</dd>
<dt>n<sub>nuc</sub></dt><dd>how many atoms (protons and neutrons) were packed in each cubic metre then: set by how much helium we want to make</dd>
<dt>n<sub>0</sub></dt><dd>atoms per cubic metre today, averaged over all space: about 0.25</dd>
<dt>T<sub>0</sub></dt><dd>the temperature of the leftover light today</dd>
<dt>Physical meaning</dt><dd>Atoms and light thin out together as space grows, so the ratio "atoms per photon" never changes. Fix it with nuclear physics in the first minutes, and the leftover light today is fixed too.</dd>
</dl>

</div>

<figure class="fig" data-fig="gamow-alpher-herman"><figcaption>The thermometer argument. Temperature and atom density slide down one straight line (slope 1/3 on log scales) as the universe grows. The line is pinned at element-making with today's measured numbers; slide today's density of atoms and read off the glow it implies. With 0.25 atoms per cubic metre, the answer is 2.7 K.</figcaption></figure>

Alpher and Herman's numbers gave about **5 K**. Wien's law ([Astronomy: blackbody radiation](/learn/courses/astronomy/blackbody-radiation/)) says such a glow shines brightest at wavelengths around half a millimetre to a millimetre: microwaves, invisible to optical telescopes.

<div class="problem" data-problem="gamow-alpher-herman-glow"></div>

<div class="problem" data-problem="gamow-alpher-herman-peak"></div>

## 4. What went wrong, and what went right

**The dead ends.** Building nuclei one particle at a time works up to helium-4 (2 protons, 2 neutrons). Then it stops: there is no stable nucleus with 5 particles, and none with 8. Enrico Fermi and Anthony Turkevich checked the reactions around 1949 and found no way across the gaps. The Big Bang could not make carbon, oxygen or iron. In 1957 Margaret and Geoffrey Burbidge, William Fowler and Fred Hoyle showed in a famous paper (known as B²FH) how stars make those, and Alastair Cameron did so independently.

**The wrong start.** In 1950 the Japanese physicist **Chushiro Hayashi** pointed out that the universe could not have started as pure neutrons. Early on it was so hot that neutrons and protons were constantly turned into each other by collisions with electrons, positrons and neutrinos, so their mix was set by the temperature, not by a guess. Alpher, Herman and James Follin did that calculation properly in 1953, and it is the basis of [Lesson 6.4](/learn/courses/cosmology/first-second/).

**What survived.** The helium. Stars cannot explain why about a quarter of the mass of the oldest stars and gas is helium: in 1964 Hoyle and Roger Tayler showed that stars could not have made so much. The hot early universe makes exactly that (Lesson 6.6). And the glow was there all along.

<div class="history">

**A prediction nobody chased.** Alpher and Herman's estimate appeared in *Nature* in 1948 and was largely forgotten; few radio astronomers knew of it, and many physicists thought such a faint glow could never be picked out. In fact a hint had been seen even earlier: in 1941 Andrew McKellar found that cyanogen (CN) molecules in space were slightly excited, as if bathed in radiation at about 2.3 K, but no one connected it to cosmology. The glow was found by accident in 1965, the story of [Lesson 7.1](/learn/courses/cosmology/cmb-discovery/).

<ul class="timeline">
<li><b>1946</b> Gamow: the elements were made in a hot, dense, fast-expanding early universe.</li>
<li><b>1948</b> Alpher, Bethe and Gamow, "The origin of chemical elements" (1 April).</li>
<li><b>1948</b> Alpher and Herman predict a leftover glow of about 5 K.</li>
<li><b>1950</b> Hayashi: neutrons and protons start in thermal balance.</li>
<li><b>1957</b> B²FH and Cameron: heavier elements come from stars.</li>
<li><b>1964</b> Hoyle and Tayler: there is too much helium for stars to have made.</li>
<li><b>1965</b> The glow is found, at 2.7 K.</li>
</ul>

</div>

<div class="myth">

**"The Big Bang made all the chemical elements."** It made almost only hydrogen and helium, with a pinch of lithium. Everything else, the carbon in your cells, the oxygen you breathe, the iron in your blood, was made later inside stars and in their explosions and collisions.

</div>

<div class="keypoints">

- Gamow (1946) proposed that the elements were cooked in the first minutes; to stop the cooking in time, the young universe had to be hot and expanding fast.
- Alpher, Bethe and Gamow (1948): the "αβγ" paper. Bethe's name was a pun; Alpher did most of the work.
- Alpher and Herman (1948): the leftover heat should glow today at about 5 K, in microwaves. Measured in 1965: 2.7 K.
- The argument: atoms and light thin out together (1/a³ and 1/a), so T<sub>0</sub> = T<sub>nuc</sub>(n<sub>0</sub>/n<sub>nuc</sub>)<sup>1/3</sup>.
- The idea failed for heavy elements (no stable nuclei of mass 5 or 8); stars make those. It succeeded for helium.

</div>
