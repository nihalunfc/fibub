---
title: "OSIRIS4CubeSat: a 395 g laser communication terminal for CubeSats, and its link budget"
summary: "A 2025 Aerospace paper describes a laser terminal one third of a CubeSat unit in size that sent 100 Mbit/s to the ground from orbit. Rework its free-space loss and power with fibub."
tools: [link-budget-calculator, cubesat-power-budget, satellite-tracker]
updated: 2026-11-10
sources:
  - "Rödiger B, Roubal C, Rein F, Rüddenklau R, Morab Vishwanath A, Schmidt C (2025), OSIRIS4CubeSat—The World's Smallest Commercially Available Laser Communication Terminal, Aerospace 12, 655. Open access, CC BY, as shown on the article, checked 2026-11-10."
  - "Free-space path loss 20 log10(4πd/λ) and the slant range to a satellite over a spherical Earth: standard link budget relations."
paper:
  title: "OSIRIS4CubeSat—The World's Smallest Commercially Available Laser Communication Terminal"
  authors: "Rödiger B, Roubal C, Rein F, Rüddenklau R, Morab Vishwanath A, Schmidt C"
  journal: "Aerospace"
  year: 2025
  doi: "10.3390/aerospace12080655"
  url: "https://doi.org/10.3390/aerospace12080655"
  licence: "CC BY"
  reviewed: true
---

Small satellites can take far more pictures than their radios can send home. A laser link can carry much more data than a radio of the same size, because light has a far shorter wavelength and so can be squeezed into a very narrow beam. A July 2025 paper in *Aerospace* describes OSIRIS4CubeSat, a laser terminal built by the German Aerospace Center (DLR) with an industry partner, that fits in about a third of a CubeSat unit, weighs 395 g and flew on the 3U satellite PIXL-1. You can rework the geometry and the free-space loss of a laser downlink with the [[link-budget-calculator]], fit the terminal's power draw into a satellite's budget with the [[cubesat-power-budget]], and see when a satellite passes over a station with the [[satellite-tracker]].

## What they found

The terminal sends data at 2 to 100 Mbit/s on a 1550 nm downlink and listens for a 1590 nm beacon from the ground, which it uses to aim. It draws at most 8.5 W. In orbit, one reported contact lasted 116 seconds and moved 1.17 GB, or 4,731 pictures, of which 2,699 decoded without errors. Links held from 5° above the horizon. The signal even saturated the ground receiver, so the laser now runs at 60 mW.

Their link budget (at 10° elevation) shows positive margins against a required minimum of 3 dB; see the paper's budget table for the values.

## Why it matters

Bigger satellites have carried laser terminals for years, but they were too big and power-hungry for CubeSats. A terminal this small lets cheap satellites send down large images or science data without the licensing and bandwidth limits of radio.

## How they did it

The authors built the terminal around a high-power laser diode, a 20 mm aperture, a beam that spreads by only about 0.2 milliradians, and a small fast-steering mirror for fine pointing; the circuit board doubles as the optical bench. They followed the CCSDS standard for simple on-off-keyed optical links and protected the data with a Reed-Solomon code, interleaving to ride out fades of a few seconds, and scrambling. For the budget they worked through the transmit power, both telescopes' gains, the free-space loss over the slant range, and losses for the atmosphere and for scintillation, the twinkling that turbulence causes.

## Check it yourself with fibub

The [[link-budget-calculator]] is built for radio, but its geometry and free-space loss work at any frequency, so a laser link can be checked too. The numbers below are our own, rounded for practice, not the paper's budget.

1. Pick **My own** as the example. Turn the wavelength into a frequency: 299,792,458 m/s ÷ 1550 nm ≈ 193.4 THz, so type **193414000** MHz.
2. Keep **A satellite: altitude and elevation**, and type **500** km and **10°**. The tool reports a slant range of about **1,695 km**.
3. Transmitter: **0.05** W (50 mW), antenna gain **90** dB, losses **1** dB. The EIRP row reads about **75.99 dBW**.
4. Receiver: **I know its gain**, **120** dB, losses **2** dB. Path: atmosphere **3** dB (we use this box for scintillation), polarisation mismatch **0** dB (the preset leaves 3 dB in it, so change it), pointing **4** dB.
5. The tool still needs a noise temperature and a data rate; type anything above zero, such as 300 K and 100000000 bit/s. Ignore the Eb/N₀ rows and the headline margin: optical receivers are rated by sensitivity, not noise temperature.
6. Read the free-space path loss, about **262.76 dB**, and the received power, about **−45.77 dBm**.

Now compare by hand with a receiver sensitivity. Say ours needs **−50 dBm**: the margin is −45.77 − (−50) = **4.23 dB**. Raise the elevation to **30°** and the slant range falls to about 909 km, the loss to about 257.35 dB, the received power to about **−40.36 dBm**, and the margin grows to about **9.6 dB**.

Here is a useful check on the paper. Its downlink budget lists a free-space loss of 263.36 dB at a slant range of 1,815.4 km. Type a distance of **1815.4** km with **A distance I know** and the tool gives **263.36 dB**, an exact match. The same range comes out of the tool for an altitude of about **550 km** at 10°, so when you rework the budget, use the altitude that the range was computed for.

For power, add the terminal to the loads in the [[cubesat-power-budget]]. If it ran at 8.5 W for 5 minutes in every 94.5-minute orbit at 500 km, its duty cycle would be about **5.3 %**, or an average of about **0.45 W**; enter it in the operating mode where it is used and see whether the battery keeps up.

## The fine print

- **Budget not verified in detail.** The authors did not measure the optical power arriving at the ground station, so the margins are predictions.
- **Assumed losses.** The atmospheric and scintillation losses come from assumptions and older measurements, not a model of that station.
- **Pointing depends on the host.** Tracking needs an accurate satellite attitude, and stray light made the terminal lock onto its own beam at times until it was recalibrated in orbit.
- **Commercial parts.** Key parts are not radiation-hardened, so lifetime in orbit is still to be shown.
- **Funding.** An industry partner that plans to sell the terminal funded the work.
- Our numbers are rounded examples. For the measured values, read the paper.

## A tool we could build

An optical mode for the link budget: wavelength in nanometres, transmit gain from beam divergence, receive gain from telescope diameter, scintillation and receiver sensitivity in dBm, giving the optical margin directly. It would reuse the same slant-range and free-space loss maths.
