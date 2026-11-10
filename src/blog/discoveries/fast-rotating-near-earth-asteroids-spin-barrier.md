---
title: "Fast-rotating near-Earth asteroids: 156 small NEAs spin under 2.2 hours"
summary: "A 2026 open-access survey of 249 small near-Earth asteroids found most spin in minutes, one in 5.4 seconds. See how a periodogram finds such spins with fibub."
tools: [period-finder, impact-crater-calculator]
updated: 2026-11-10
sources:
  - "Alarcon, M. R., Licandro, J. and Serra-Ricart, M. (2026), A dedicated survey of fast-rotating near-Earth asteroids with the Two-meter Twin Telescope - I. Observational strategy and first results, Astronomy & Astrophysics 707, A262, published online 17 March 2026. Open access under the Creative Commons Attribution License (CC BY 4.0), checked on the publisher's page, 2026-11-10."
  - "Asteroid diameter from absolute magnitude and albedo, D (km) = 1329 ÷ √albedo × 10^(−H/5): the standard relation used in asteroid photometry."
paper:
  title: "A dedicated survey of fast-rotating near-Earth asteroids with the Two-meter Twin Telescope - I. Observational strategy and first results"
  authors: "Alarcon MR, Licandro J, Serra-Ricart M"
  journal: "Astronomy & Astrophysics"
  year: 2026
  doi: "10.1051/0004-6361/202558528"
  url: "https://www.aanda.org/articles/aa/full_html/2026/03/aa58528-25/aa58528-25.html"
  licence: "CC BY 4.0"
  reviewed: true
---

Small asteroids that pass near the Earth turn out to be spinning tops. A March 2026 paper in *Astronomy & Astrophysics*, open access under CC BY 4.0, reports light curves for 249 small near-Earth asteroids (NEAs) taken with telescopes in the Canary Islands. Of the 161 with a reliable period, 156 spin once in less than 2.2 hours, and the quickest turns in about 5.4 seconds. The [[period-finder]] uses the same core method, a Lomb-Scargle periodogram, so you can see how a spin is pulled out of a wobbling brightness record, and the [[impact-crater-calculator]] puts the size of these bodies in context.

## What they found

The team picked faint, small targets: objects of absolute magnitude H above 22, which means smaller than about 140 metres across (assuming a typical reflectivity). For 161 of them they found a clear rotation period. All but five spin faster than 2.2 hours, and 87 spin in under 10 minutes, the group often called super-fast rotators. The record holder, 2025 WR7, is a body probably only a few metres across that turns in 5.44 ± 0.22 seconds.

The smaller the asteroid, the more likely it is to be a fast spinner. Among the smallest group (H above 26), the authors estimate that 94% to 96% rotate faster than 2.2 hours. At least 35 of the fast rotators also seem to be tumbling, turning about more than one axis.

## Why it matters

Many asteroids are thought to be rubble piles, loose heaps of rock held together mainly by their own weak gravity. A rubble pile that spins faster than about once every 2.2 hours would fling off its own surface. This limit is known as the spin barrier, and large asteroids respect it. Small ones that break it must be held together by something else: some internal strength, or cohesion between grains. The paper finds that 98 of its targets would need at least a small amount of cohesion, and 22 spin so fast they would need the strength of solid rock.

Spin and strength also matter for planetary defence. How a small asteroid would respond to an impactor, or break up in the air, depends on whether it is a solid piece or a loose heap.

## How they did it

Each night software chose suitable NEAs and the telescopes (two 0.8-metre units and a 2-metre one) followed them for 40 minutes to 2 hours with fast cameras. The brightness of each target was measured against catalogue stars in the same field. To find the period, the team first ran a Lomb-Scargle periodogram, which tests a long list of trial periods against unevenly spaced data, then refined the best one with a second method and fitted a smooth curve to the folded data.

An asteroid's brightness changes because it is elongated: we see more surface, then less, twice per turn. So a light curve usually has two peaks per rotation. The size of the swing in magnitudes, A, gives a lower limit on how stretched the body is: its long axis is at least 10^(0.4A) times its short axis.

## Check it yourself with fibub

Make your own light curve and find the spin, using times in minutes.

**Step 1.** In a spreadsheet, make a **made-up** asteroid that turns once every 6 minutes. List times from 0 to 40 minutes every 0.25 minutes (161 points). For each time t, set the magnitude to 20 + 0.2 × cos(4πt/6), which gives two peaks per turn, add a small one-peak term such as 0.04 × cos(2πt/6 + 1) so the two halves differ, and add random noise of about 0.03 mag. Put 0.03 in a third column as the error.

**Step 2.** Paste the three columns into the [[period-finder]]. Leave **Values are magnitudes** and **Weight by the errors** ticked. Type 1 as the **shortest period** and 20 as the **longest period**; these are in minutes, because the times are.

**Step 3.** Read the peaks. In our run the strongest peak was at **3.00 minutes**, with power 0.91 and a false alarm probability of effectively zero. That is half the true spin.

**Step 4.** Set **Fold at** to "twice the peak period". The folded curve at 6.00 minutes shows two humps of slightly different height: one full turn of an elongated body. Folded at 3 minutes, the two halves lie on top of each other and the difference is lost.

**Step 5.** Turn the swing into a shape. Without the noise, our curve swings by about 0.45 mag from faintest to brightest, so the long axis is at least 10^(0.4 × 0.45) = **1.51** times the short one.

**Step 6.** Put a size on it. With H = 25 and an assumed reflectivity of 0.15, the diameter is 1329 ÷ √0.15 × 10^(−5) km, about **34 metres**. In the [[impact-crater-calculator]], choose the Moon (no air to slow it), dense rock, a 35 m body at 18 km/s and 45°. It gives about 2.6 megatons and a crater roughly 1.5 km wide on the default sedimentary ground.

## The fine print

- Diameters rest on an **assumed reflectivity of 0.15**. If most of these bodies are darker, they are about 1.7 times bigger, and the strength needed to hold them together rises.
- Runs of 40 to 120 minutes can **miss slow rotators**, and faint targets with small swings can hide fast ones, so the fractions come as ranges.
- The paper gives **87 super-fast rotators in one place and 91 in another**.
- Tumblers' periods will come in a later paper.
- The spin limits assume a bulk density of 3 g/cm³ and are upper bounds. Our light curve and numbers are made up; read the paper for the measured periods and their uncertainties.
