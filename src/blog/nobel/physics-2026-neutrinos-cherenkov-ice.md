---
title: "Neutrinos and Cherenkov light: the road to the 2026 Physics Nobel"
seoTitle: "Neutrinos and Cherenkov light: 2026 Physics Nobel, part 1"
summary: "Why physicists invented an invisible particle, how they finally caught it, and why a cubic kilometre of Antarctic ice became a telescope for it. With animations you can play and numbers you can check yourself."
tools: [relativistic-kinematics, counting-statistics, em-spectrum]
updated: 2026-11-19
sources:
  - "Nobel Prize in Physics 2026, announced 6 October 2026: Francis Halzen, University of Wisconsin–Madison, 'for decisive contributions to the IceCube Neutrino Observatory and the discovery of high-energy neutrinos of astrophysical origin'. NobelPrize.org (nobelprize.org/prizes/physics/2026/) and the Royal Swedish Academy of Sciences press release (kva.se)."
  - "Physics World (2026), 'Francis Halzen wins Nobel Prize in Physics': timeline of AMANDA and IceCube."
  - "Pauli W (1930), open letter to the Tübingen meeting ('Dear radioactive ladies and gentlemen'), 4 December 1930."
  - "Fermi E (1934), Zeitschrift für Physik 88: 161 (theory of beta decay)."
  - "Cowan CL, Reines F, Harrison FB, Kruse HW, McGuire AD (1956), Science 124: 103 ('Detection of the free neutrino: a confirmation')."
  - "Cherenkov PA (1934), Doklady Akad. Nauk SSSR 2: 451; Frank IM, Tamm IE (1937), Doklady 14: 109. Nobel Prize in Physics 1958."
  - "Markov MA (1960), Proc. 10th Int. Conf. on High-Energy Physics, Rochester (deep underwater or underground neutrino detection)."
  - "Halzen F, Learned JG (1988), 'High energy neutrino detection in deep polar ice', Proc. 5th Int. Symp. on Very High Energy Cosmic Ray Interactions, Łódź."
  - "Particle masses: Particle Data Group, Review of Particle Physics (2024), rounded. Solar luminosity 3.828 × 10²⁶ W (IAU 2015 nominal value)."
---

In October 2026 the Nobel Prize in Physics went to **Francis Halzen** for IceCube, a telescope built from a cubic kilometre of ice at the South Pole, and for its discovery of neutrinos coming from far outside our solar system. This first part of the series covers the ninety years of ideas that made such a strange telescope sensible: a particle invented to save the law of energy conservation, the 26 years it took to catch one, and the faint blue light that lets ice "see" it. You can test each step yourself with the [[relativistic-kinematics]], the [[counting-statistics|Counting statistics helper]] and the [[em-spectrum|EM spectrum explorer]].

<div class="nb-short">

**In short**
- A **neutrino** is a tiny, neutral particle that hardly ever hits anything: about 65 billion from the Sun pass through each square centimetre of you every second.
- It was **invented on paper in 1930** to explain missing energy, and **caught in 1956** next to a nuclear reactor.
- When a neutrino does hit something in water or ice, it can make a fast charged particle that glows with **Cherenkov light**. In 1988 Halzen and John Learned proposed using the clear, deep ice under the South Pole to catch that glow.

</div>

## A crisis in 1930: energy goes missing

Some atomic nuclei change by spitting out an electron. This is **beta decay**. In the 1920s careful measurements showed something shocking: the electrons came out with *any* energy from zero up to a maximum, not with one fixed energy.

Why is that shocking? If a nucleus at rest breaks into just two pieces, the laws of energy and momentum fix exactly how the energy is shared, so every electron should leave with the same energy. Some physicists, Niels Bohr among them, were ready to give up exact energy conservation.

Wolfgang Pauli did not want to. In a famous letter of December 1930 to a physics meeting he proposed a "desperate remedy": a third particle, neutral and very light, that leaves the nucleus too and takes the missing share of the energy. Nobody could see it, so the electron seemed to lose energy at random. In 1934 Enrico Fermi built a full theory of beta decay around it and gave it its name, the **neutrino** ("little neutral one").

Try the decay below. Each press records one electron's energy. In the real world the bars pile up into a broad hump; switch to "if no neutrino existed" and every electron lands in the last bar.

<div data-nx="beta-spectrum"><p class="nx-noscript">Interactive animation: beta decay electron energies (needs JavaScript).</p></div>

<details class="deeper"><summary>Why the hump has that shape</summary>

The shape comes from counting the ways the energy can be shared. For an "allowed" decay the number of electrons with kinetic energy T goes as p·E·(Q − T)², where p and E are the electron's momentum and total energy and Q is the decay energy. The (Q − T)² factor is the room left for the neutrino. Near T = Q that room vanishes, so the spectrum falls smoothly to zero there. If the neutrino has a small mass m, the end point moves down by m and the very last part of the curve changes shape: that is exactly how the KATRIN experiment in Germany has been squeezing the neutrino mass below 0.5 eV. A small Coulomb correction (the Fermi function) bends the low-energy end; the animation leaves it out.
</details>

## How do you catch a ghost? (1956)

Fermi's theory also predicted how rarely a neutrino would interact. The numbers were sobering: a typical neutrino from a reactor could pass through light-years of lead without stopping. Pauli is said to have worried that he had invented a particle that could never be detected.

The way out is **numbers**. A nuclear reactor makes an enormous flood of antineutrinos (about 10²⁰ per second for a large one). In 1956 Clyde Cowan and Frederick Reines put tanks of water with dissolved cadmium chloride next to the Savannah River reactor in South Carolina. Once in a while an antineutrino hit a proton in the water and turned it into a neutron and a positron:

ν̄ₑ + p → n + e⁺

The positron annihilated at once, giving a flash; a few microseconds later the neutron was captured by cadmium, giving a second flash. That **delayed pair of flashes** was the fingerprint. They counted a few such events per hour more when the reactor was on than when it was off, and sent Pauli a telegram. Reines shared the 1995 Nobel Prize for it.

This reaction needs a minimum neutrino energy, because a neutron and a positron weigh more than a proton. With the [[relativistic-kinematics]] you can work it out: the threshold is **1.806 MeV**. Reactor antineutrinos below that energy pass unseen.

## Neutrinos everywhere

After 1956 neutrinos turned up wherever physicists looked:

- **The Sun.** Fusion in the Sun's core turns hydrogen into helium and releases two neutrinos each time. From the Sun's power alone you can estimate the flux at Earth (we do it below): about **6.5 × 10¹⁰ per square centimetre per second**. Ray Davis's chlorine tank in a South Dakota gold mine caught them from the late 1960s, and found only about a third of the expected number: the "solar neutrino problem".
- **A supernova.** On 23 February 1987 detectors in Japan, the USA and Russia caught about two dozen neutrinos from a star that exploded in the Large Magellanic Cloud, 160,000 light-years away. Davis and Masatoshi Koshiba shared the 2002 Nobel Prize for opening neutrino astronomy with the Sun and this supernova.
- **The atmosphere.** Cosmic rays smashing into air make showers of pions and muons, which decay into neutrinos. In 1998 the Super-Kamiokande detector showed these change type ("oscillate") on the way through the Earth, which means neutrinos have mass. That, and the solution of the solar puzzle at the SNO detector, won the 2015 Nobel Prize.
- **Three kinds.** There are electron, muon and tau neutrinos, each paired with its charged partner. The muon neutrino was found in 1962 (Nobel Prize 1988), the tau neutrino in 2000.

By the 1980s one big source was still missing: the most violent objects in the universe. Cosmic rays, mostly protons, reach Earth with energies up to a hundred million times what the Large Hadron Collider can give. Something out there accelerates them, and nobody knew what. When such protons hit gas or light near their source they must make pions, and pions decay into neutrinos. So a **neutrino telescope** could find the accelerators. The catch: such high-energy neutrinos are rare, so the detector would have to be about a cubic kilometre in size.

## Blue light faster than light

How do you watch a cubic kilometre? The answer is a kind of light discovered in 1934 by Pavel Cherenkov in Moscow.

Nothing beats the speed of light in a vacuum. But light slows down inside a material: in ice it travels at c/n, where n ≈ 1.31 is the refractive index, so about 229,000 km/s. A charged particle with a lot of energy can go *faster than light in ice*. When it does, it leaves behind a cone of faint blue light, much as a boat faster than its own waves leaves a V-shaped wake, or a jet faster than sound leaves a sonic boom. Ilya Frank and Igor Tamm explained it in 1937, and the three shared the 1958 Nobel Prize.

Play with it. Set the particle's speed and the material: below the threshold, the light rings never overlap; above it, they pile up into a bright cone.

<div data-nx="cherenkov"><p class="nx-noscript">Interactive animation: Cherenkov light cone (needs JavaScript).</p></div>

The cone's angle obeys a simple rule:

cos θ = 1 / (n β)

where β is the particle's speed as a fraction of c. For a muon at nearly the speed of light in ice, θ ≈ 40°. Because the angle is fixed, measuring *when* the light reaches many sensors tells you the direction of the particle. And since a muon made by a neutrino flies almost in the neutrino's direction, you learn where in the sky the neutrino came from.

<details class="deeper"><summary>How much light, and what colour</summary>

The Frank–Tamm formula gives the number of photons per unit length per unit wavelength as proportional to (1 − 1/(n²β²))/λ². The 1/λ² factor makes Cherenkov light strongest at short wavelengths, which is why it looks blue (and why the sensors are tuned to blue and near-ultraviolet). A relativistic muon makes roughly 250 photons per centimetre in the 300 to 500 nm band in ice. The [[em-spectrum|EM spectrum explorer]] gives each photon's energy: about 3 eV at 400 nm.
</details>

## Water, then ice: the idea Halzen pushed

In 1960 Moisey Markov suggested putting detectors deep in a lake or the sea, where the water above blocks most of the cosmic-ray muons raining down from the sky. The American **DUMAND** project tried this off Hawaii from the late 1970s; the ocean proved brutal on cables and electronics and the project ended in 1995. The **Baikal** telescope in Siberia, in the deep clear water of Lake Baikal, ran from the 1990s and is still growing today.

In 1988 Francis Halzen and John Learned proposed a different medium: the **Antarctic ice sheet**. Deep polar ice is about three kilometres thick at the South Pole, extremely clear, perfectly dark, free of the light glowing from radioactive potassium and from sea creatures in seawater, and it does not move around. Holes can be melted with hot water and sensors frozen in for good. The US science base at the Pole already had the flights, power and people.

The first tests began in the early 1990s as **AMANDA** (Antarctic Muon And Neutrino Detector Array). They revealed a surprise: at shallow depths the ice was full of tiny air bubbles that scattered the light hopelessly. Deeper, below about 1.4 km, the pressure had squeezed the bubbles into crystals and the ice turned glass-clear. AMANDA moved deeper and was complete by 2000. It saw atmospheric neutrinos and proved the method worked, but at about 1/50 of a cubic kilometre it was far too small to find cosmic sources. The next step had to be fifty times bigger. That is part 2.

## Checked with the tools

We checked three of the numbers in this story with the maths behind fibub's own tools. Everything below is our own recomputation or simulation; nothing is copied from a paper.

**1. The reaction Cowan and Reines used needs 1.806 MeV.** In the Reaction threshold part of the [[relativistic-kinematics]], a massless beam on a proton at rest making a neutron (939.565 MeV) and a positron (0.511 MeV) needs a beam energy of **1.806 MeV**. That matches the textbook value.

**2. The solar neutrino flux follows from the Sun's power.** Each fusion of four protons into helium releases 26.73 MeV and two neutrinos; about 0.6 MeV of that leaves with the neutrinos, so about 26.1 MeV heats the Sun. With the Sun's luminosity (3.828 × 10²⁶ W) spread over a sphere one astronomical unit across:

Φ = 2 L ÷ (26.1 MeV × 4π d²) ≈ **6.5 × 10¹⁰ neutrinos per cm² per second**

This is the number quoted by solar models, from nothing more than the Sun's brightness and its distance.

**3. How long you must count.** Cowan and Reines saw about three extra events per hour. With round numbers of that size (3 per hour of signal, 1 per hour of background, the reactor on and off for equal times), the net rate grows clearer like the square root of the counting time:

<!-- fig:reines-count -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 316" role="img" aria-label="The significance of the net counting rate grows like the square root of the counting time, passing 5 sigma after a few hours and 10 sigma after about a day." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Reactor on minus reactor off: how sure after t hours?</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Reactor on minus reactor off: how sure after t hours?</text><line x1="58" x2="546" y1="254" y2="254" style="stroke:var(--line)"/><text x="52" y="258" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="184.6" y2="184.6" style="stroke:var(--line)"/><text x="52" y="188.6" text-anchor="end" style="fill:var(--muted)">5</text><line x1="58" x2="546" y1="115.3" y2="115.3" style="stroke:var(--line)"/><text x="52" y="119.3" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="45.9" y2="45.9" style="stroke:var(--line)"/><text x="52" y="49.9" text-anchor="end" style="fill:var(--muted)">15</text><line x1="136.6" x2="136.6" y1="254" y2="258" style="stroke:var(--muted)"/><text x="136.6" y="271" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="219.3" x2="219.3" y1="254" y2="258" style="stroke:var(--muted)"/><text x="219.3" y="271" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="302" x2="302" y1="254" y2="258" style="stroke:var(--muted)"/><text x="302" y="271" text-anchor="middle" style="fill:var(--muted)">60</text><line x1="384.7" x2="384.7" y1="254" y2="258" style="stroke:var(--muted)"/><text x="384.7" y="271" text-anchor="middle" style="fill:var(--muted)">80</text><line x1="467.4" x2="467.4" y1="254" y2="258" style="stroke:var(--muted)"/><text x="467.4" y="271" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="58" x2="546" y1="254" y2="254" style="stroke:var(--muted)"/><text x="302" y="292" text-anchor="middle" style="fill:var(--ink)">Counting time with the reactor on (and as long off), hours</text><text transform="translate(14 143) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Net rate ÷ its uncertainty (σ)</text><line x1="58" x2="546" y1="184.6" y2="184.6" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="179.6" text-anchor="end" style="fill:var(--muted)">5σ</text><line x1="58" x2="546" y1="212.4" y2="212.4" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="207.4" text-anchor="end" style="fill:var(--muted)">3σ</text><path d="M58 235.4L66.3 221.8L74.5 212.4L82.8 204.7L91.1 198.2L99.4 192.3L107.6 186.8L115.9 181.9L124.2 177.3L132.4 172.8L140.7 168.7L149 164.8L157.3 160.9L165.5 157.3L173.8 153.8L182.1 150.4L190.3 147L198.6 143.8L206.9 140.8L215.2 137.7L223.4 134.8L231.7 131.9L240 129.1L248.2 126.4L256.5 123.7L264.8 121.1L273.1 118.4L281.3 115.9L289.6 113.4L297.9 110.9L306.1 108.6L314.4 106.2L322.7 103.9L330.9 101.7L339.2 99.4L347.5 97.2L355.8 95L364 92.8L372.3 90.7L380.6 88.6L388.8 86.5L397.1 84.4L405.4 82.4L413.7 80.4L421.9 78.3L430.2 76.4L438.5 74.5L446.7 72.5L455 70.7L463.3 68.8L471.6 67L479.8 65L488.1 63.2L496.4 61.4L504.6 59.6L512.9 57.8L521.2 56.1L529.5 54.3L537.7 52.7L546 50.9" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><text class="fibub-mark" x="546" y="310" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Made with the Counting statistics tool's maths (net rate and its uncertainty from gross and background counts). Rates are our own round numbers of the same size as the 1956 experiment's, not its data.</figcaption></figure>
<!-- /fig:reines-count -->

**4. The Cherenkov angle settles near 40° in ice.** From the muon's energy we got its speed with the relativistic maths, then the angle with cos θ = 1/(nβ):

<!-- fig:cherenkov-angle -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 318" role="img" aria-label="Below about 160 MeV a muon makes no Cherenkov light in ice; above a few hundred MeV the angle settles near 40 degrees in ice and 41 in water." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Cherenkov angle of a muon</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Cherenkov angle of a muon</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--line)"/><text x="52" y="276" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="222.7" y2="222.7" style="stroke:var(--line)"/><text x="52" y="226.7" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="173.3" y2="173.3" style="stroke:var(--line)"/><text x="52" y="177.3" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="124" y2="124" style="stroke:var(--line)"/><text x="52" y="128" text-anchor="end" style="fill:var(--muted)">30</text><line x1="58" x2="546" y1="74.7" y2="74.7" style="stroke:var(--line)"/><text x="52" y="78.7" text-anchor="end" style="fill:var(--muted)">40</text><line x1="83.7" x2="83.7" y1="272" y2="276" style="stroke:var(--muted)"/><text x="83.7" y="289" text-anchor="middle" style="fill:var(--muted)">200</text><line x1="186.4" x2="186.4" y1="272" y2="276" style="stroke:var(--muted)"/><text x="186.4" y="289" text-anchor="middle" style="fill:var(--muted)">400</text><line x1="289.2" x2="289.2" y1="272" y2="276" style="stroke:var(--muted)"/><text x="289.2" y="289" text-anchor="middle" style="fill:var(--muted)">600</text><line x1="391.9" x2="391.9" y1="272" y2="276" style="stroke:var(--muted)"/><text x="391.9" y="289" text-anchor="middle" style="fill:var(--muted)">800</text><line x1="494.6" x2="494.6" y1="272" y2="276" style="stroke:var(--muted)"/><text x="494.6" y="289" text-anchor="middle" style="fill:var(--muted)">1e+3</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--muted)"/><text x="302" y="310" text-anchor="middle" style="fill:var(--ink)">Muon total energy (MeV)</text><text transform="translate(14 161) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Angle to the path (degrees)</text><line x1="58" x2="546" y1="73.7" y2="73.7" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="68.7" text-anchor="end" style="fill:var(--muted)">ice limit 40.2°</text><path d="M67.2 218.1L70.3 192.6L73.4 176L76.5 163.8L79.6 154.1L82.7 146.2L85.7 139.6L88.8 134.1L91.9 129.3L95 125.1L98.1 121.4L101.1 118.2L104.2 115.3L107.3 112.7L110.4 110.3L113.5 108.2L116.6 106.3L119.6 104.5L122.7 102.9L125.8 101.4L128.9 100L132 98.8L135.1 97.6L138.1 96.5L141.2 95.5L144.3 94.5L147.4 93.7L150.5 92.9L153.5 92.1L156.6 91.3L159.7 90.7L162.8 90L165.9 89.4L169 88.8L172 88.3L175.1 87.8L178.2 87.3L181.3 86.9L184.4 86.4L187.4 86L190.5 85.6L193.6 85.2L196.7 84.9L199.8 84.5L202.9 84.2L205.9 83.9L209 83.6L212.1 83.3L215.2 83L218.3 82.8L221.4 82.5L224.4 82.3L227.5 82L230.6 81.8L233.7 81.6L236.8 81.4L239.8 81.2L242.9 81L246 80.8L249.1 80.6L252.2 80.5L255.3 80.3L258.3 80.1L261.4 80L264.5 79.8L267.6 79.7L270.7 79.6L273.7 79.5L276.8 79.3L279.9 79.2L283 79.1L286.1 79L289.2 78.9L292.2 78.8L295.3 78.6L298.4 78.5L301.5 78.4L304.6 78.3L307.7 78.2L310.7 78.2L313.8 78.1L316.9 78L320 77.9L323.1 77.8L326.1 77.7L329.2 77.7L332.3 77.6L335.4 77.5L338.5 77.4L341.6 77.4L344.6 77.3L347.7 77.2L350.8 77.2L353.9 77.1L357 77L360 77L363.1 76.9L366.2 76.9L369.3 76.8L372.4 76.8L375.5 76.7L378.5 76.7L381.6 76.6L384.7 76.6L387.8 76.5L390.9 76.5L393.9 76.4L397 76.4L400.1 76.3L403.2 76.3L406.3 76.2L409.4 76.2L412.4 76.2L415.5 76.1L418.6 76.1L421.7 76L424.8 76L427.9 76L430.9 75.9L434 75.9L437.1 75.9L440.2 75.9L443.3 75.8L446.3 75.8L449.4 75.8L452.5 75.8L455.6 75.7L458.7 75.7L461.8 75.7L464.8 75.6L467.9 75.6L471 75.6L474.1 75.6L477.2 75.5L480.2 75.5L483.3 75.5L486.4 75.5L489.5 75.4L492.6 75.4L495.7 75.4L498.7 75.4L501.8 75.3L504.9 75.3L508 75.3L511.1 75.3L514.2 75.3L517.2 75.2L520.3 75.2L523.4 75.2L526.5 75.2L529.6 75.2L532.6 75.1L535.7 75.1L538.8 75.1L541.9 75.1L545 75.1" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M64.2 235.9L67.2 199.3L70.3 179L73.4 164.7L76.5 153.6L79.6 144.8L82.7 137.6L85.7 131.5L88.8 126.3L91.9 121.8L95 117.8L98.1 114.4L101.1 111.3L104.2 108.6L107.3 106.1L110.4 103.8L113.5 101.8L116.6 100L119.6 98.3L122.7 96.8L125.8 95.3L128.9 94L132 92.8L135.1 91.7L138.1 90.7L141.2 89.7L144.3 88.8L147.4 87.9L150.5 87.1L153.5 86.4L156.6 85.7L159.7 85L162.8 84.4L165.9 83.8L169 83.3L172 82.8L175.1 82.3L178.2 81.8L181.3 81.4L184.4 81L187.4 80.5L190.5 80.2L193.6 79.8L196.7 79.5L199.8 79.2L202.9 78.8L205.9 78.5L209 78.3L212.1 78L215.2 77.7L218.3 77.5L221.4 77.2L224.4 77L227.5 76.7L230.6 76.5L233.7 76.3L236.8 76.1L239.8 75.9L242.9 75.8L246 75.6L249.1 75.4L252.2 75.3L255.3 75.1L258.3 75L261.4 74.8L264.5 74.7L267.6 74.5L270.7 74.4L273.7 74.3L276.8 74.1L279.9 74L283 73.9L286.1 73.8L289.2 73.7L292.2 73.6L295.3 73.5L298.4 73.4L301.5 73.3L304.6 73.2L307.7 73.1L310.7 73L313.8 72.9L316.9 72.8L320 72.7L323.1 72.7L326.1 72.6L329.2 72.5L332.3 72.4L335.4 72.4L338.5 72.3L341.6 72.2L344.6 72.2L347.7 72.2L350.8 72.1L353.9 72L357 72L360 71.9L363.1 71.9L366.2 71.8L369.3 71.8L372.4 71.7L375.5 71.6L378.5 71.6L381.6 71.6L384.7 71.5L387.8 71.5L390.9 71.4L393.9 71.4L397 71.3L400.1 71.3L403.2 71.2L406.3 71.2L409.4 71.2L412.4 71.1L415.5 71.1L418.6 71L421.7 71L424.8 71L427.9 70.9L430.9 70.9L434 70.9L437.1 70.8L440.2 70.8L443.3 70.8L446.3 70.7L449.4 70.7L452.5 70.7L455.6 70.7L458.7 70.6L461.8 70.6L464.8 70.6L467.9 70.5L471 70.5L474.1 70.5L477.2 70.5L480.2 70.4L483.3 70.4L486.4 70.4L489.5 70.4L492.6 70.4L495.7 70.3L498.7 70.3L501.8 70.3L504.9 70.3L508 70.2L511.1 70.2L514.2 70.2L517.2 70.2L520.3 70.2L523.4 70.1L526.5 70.1L529.6 70.1L532.6 70.1L535.7 70.1L538.8 70.1L541.9 70L545 70" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round;stroke-dasharray:5 4"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Ice, n = 1.31</text><line x1="177.6" x2="189.6" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2;stroke-dasharray:5 4"/><text x="193.6" y="40" style="fill:var(--muted)">Water, n = 1.33</text><text class="fibub-mark" x="546" y="310" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Speeds from the Relativistic kinematics tool's maths (muon mass 105.66 MeV), angle from cos θ = 1/(nβ). Real ice and water refractive indices depend on wavelength; 1.31 and 1.33 are round values.</figcaption></figure>
<!-- /fig:cherenkov-angle -->

| Quantity | Standard value | What the tool maths gives |
|---|---|---|
| Inverse beta decay threshold | 1.806 MeV | 1.806 MeV |
| Solar neutrino flux at Earth | about 6.5 × 10¹⁰ cm⁻² s⁻¹ | 6.5 × 10¹⁰ cm⁻² s⁻¹ |
| Muon Cherenkov threshold in ice (total energy) | about 160 MeV | 164 MeV |
| Largest Cherenkov angle in ice (n = 1.31) | about 40° | 40.2° |

## How we made the graphs

The charts come from one script, `scripts/blog-figures/nobel-physics-2026.mjs`, that imports the same TypeScript the tools run in your browser: `threshold()`, `fourFrom()` and `describe()` from `src/lib/sci/phrel.ts` (the Relativistic kinematics calculator) and `netRate()` from `src/lib/sci/phcount.ts` (the Counting statistics helper). Particle masses are the Particle Data Group's values, rounded. The counting rates are our own round numbers of the same size as the 1956 experiment's, not its data. The animations on this page run small simulations written for this series (the beta spectrum shape and the Cherenkov wavefronts) and draw a fibub.com mark in the corner like every plot here.

## How we test the maths

Every change to the site runs the checks in `tests/sci-tools/relativistic-kinematics.mjs` and `tests/sci-tools/counting-statistics.mjs`. They pin the relativistic maths to textbook results: the antiproton threshold in p + p → p p p p̄ (kinetic energy 6 m_p = 5,629.6 MeV, the number that set the Bevatron's design in the 1950s), π⁰ photoproduction on a proton (144.69 MeV), and the muon's momentum in π⁺ → μ⁺ν (29.79 MeV/c). The counting maths is pinned to Currie's 1968 formulas (L_C = 2.326 √B for a paired blank) and to exact Poisson confidence limits computed with SciPy. If a change broke any of them, the tests would fail and the change would not go live.

## Check it yourself

1. Open the [[relativistic-kinematics|Relativistic kinematics calculator]] and set the unit to **MeV**.
2. In **4. Reaction threshold**, type `nu` (or a mass of 0) as the **Beam particle**, `p` as the **Target particle (at rest)** and `n + e+` as the **Products**. The threshold beam energy should read about **1.806 MeV**.
3. Change the products to `n + mu`. The threshold jumps to about 113 MeV: low-energy reactor antineutrinos can never make a muon.
4. Open the [[counting-statistics|Counting statistics helper]]. In **1. Net counts and detection limit**, enter **Gross counts** 48 in **Gross counting time** 12 (hours), and **Background counts** 12 in 12. The net rate is 3 per hour with an uncertainty of about 0.65 per hour: about 4.7σ after 12 hours, as on the chart.
5. Open the [[em-spectrum|EM spectrum explorer]], type 400 nm and read the photon energy (about 3.1 eV): the colour Cherenkov light is richest in.

## What you can use it for

- **Students:** the threshold and two-body decay sections of the [[relativistic-kinematics]] work through any reaction in a textbook problem, step by step.
- **Lab work:** the [[counting-statistics|Counting statistics helper]] tells you how long to count a weak source against background, or whether a small excess is real.
- **Teaching:** the Cherenkov animation shows why there is a speed threshold and why the angle is fixed, which a static picture rarely gets across.
- **Next in this series:** how a cubic kilometre of sensors was frozen into the ice, and how it found the first neutrinos from beyond our galaxy, in [[blog:nobel/physics-2026-icecube-cosmic-neutrinos|part 2]].
