---
title: "Santorini-Amorgos 2024-2025 earthquake swarm: relocated catalogue and magma migration"
summary: "A 2025 Seismica fast report relocated about 14,000 earthquakes under Santorini, Kolumbo and Anydros with machine-learning picks. Learn how a location works and try one."
tools: [earthquake-locator, seismogram-viewer]
updated: 2026-11-10
sources:
  - "Fountoulakis I, Evangelidis CP (2025), Seismica 4(1), CC BY 4.0, the paper described here."
  - "S−P distance and Geiger's (1910) least-squares location: standard seismology, as used by the fibub earthquake locator."
  - "The stations, arrival times and event pair in the worked example are made up by fibub; they are not the real Greek network or catalogue."
paper:
  title: "The 2024–2025 seismic sequence in the Santorini-Amorgos region: Insights into volcano-tectonic activity through high-resolution seismic monitoring"
  authors: "Fountoulakis I, Evangelidis CP"
  journal: "Seismica"
  year: 2025
  doi: "10.26443/seismica.v4i1.1663"
  url: "https://seismica.library.mcgill.ca/article/view/1663"
  licence: "CC BY 4.0"
  reviewed: true
---

In early 2025 thousands of small earthquakes shook the sea floor between Santorini and Amorgos in the Aegean. Two seismologists at the National Observatory of Athens built a sharp catalogue of the sequence and published it as a fast report in Seismica in May 2025. Their relocated quakes trace a path from deep under the Kolumbo volcano up toward Anydros island, which they read as fluids or magma pushing through the crust. This page explains the work, and shows how an earthquake is located from P and S times with the [[earthquake-locator]], starting from picks made in the [[seismogram-viewer]].

## What they found

The catalogue runs from 1 June 2024 to 6 March 2025. It began with 20,473 located events, and 13,952 of them (about 68 %) could be relocated precisely against their neighbours. The typical relative error is about 0.7 km across and 0.5 km in depth. The catalogue is complete down to about magnitude 1.5 to 1.7.

- **Santorini first.** Small quakes started under the Santorini caldera in late summer 2024, at about 2 to 9 km depth.
- **Then deep under Kolumbo.** By late January 2025, activity had appeared at about 17 to 22 km under Kolumbo, an undersea volcano north-east of Santorini.
- **Then north-east and shallower.** The swarm moved toward the Anydros plateau, at 10 to 15 km, with a separate cluster shallower than 5 km south-west of Anydros. The busy zone was about 20 km long and 10 km wide.
- **Fast bursts.** At the peak, on 11 to 14 February, the activity front moved at up to about 2.8 km per hour.
- **Opening cracks.** Many of the larger events (magnitude 3.5 and up) did not look like plain fault slip. They had a part that suggests cracks opening, which fits magma or hot fluids forcing their way along.

## Why it matters

Telling a tectonic swarm from a magma intrusion matters for warnings. Moving magma can end in an eruption, and a fault swarm can build to a larger earthquake. Either way, people need fast, trustworthy locations. The authors also describe the day-to-day workflow they used to brief the Greek authorities during the crisis. The catalogue is open, so others can test their reading.

## How they did it

The team used 23 stations within 150 km, from three Greek networks. A machine-learning picker, trained on volcanic earthquakes, marked the P and S arrivals on the continuous records. A separate program sorted the picks into events. Each event was first located on its own in a one-dimensional speed model, with a time correction for each station worked out over five rounds. Then a second program compared the waveforms of nearby events. Where two records matched closely, it used the very precise time difference between them to place the events relative to each other. Events with a poor spread of stations (a gap over 300°), large timing misfits or errors over 5 km were dropped.

## Check it yourself with fibub

The paper's tools are heavy, but the core idea fits in a browser: the S wave lags the P wave, and the lag grows with distance. The numbers below are made up for an imaginary event in the area, recorded by five imaginary stations.

1. If you have SAC or miniSEED files, open them in the [[seismogram-viewer]], filter out the noise, and tap to pick P and S on each trace. Download the picks as CSV.
2. Open the [[earthquake-locator]]. Keep latitude and longitude, set Vp to 6.0 km/s and Vp/Vs to 1.75, and paste one row per station: a name (S1 to S5), latitude, longitude, P time and S time. Our five stations sit at 36.42 N 25.43 E, 36.83 N 25.88 E, 36.40 N 25.95 E, 36.95 N 25.50 E and 36.55 N 26.20 E. Their P and S times, in seconds after a reference time, are 6.06 and 10.51, 4.94 and 8.77, 5.71 and 10.00, 7.20 and 12.57, and 7.58 and 13.21.
3. Look at the S−P column first. The third station's gap of 4.29 s gives a straight-line distance of about 34 km. The fourth station's 5.37 s gives about 43 km.
4. With the depth fixed at 12 km, the tool puts the epicentre at about 36.621 N 25.718 E. The RMS misfit is 0.027 s, and the error is under 0.1 km each way.
5. Now fix the depth at 3 km instead. The epicentre hardly moves, but the origin time shifts by about 0.4 s and the misfit grows about five times, to 0.14 s. Depth and origin time trade off against each other. That is why the authors' depth bands, such as 17 to 22 km under Kolumbo, needed careful work.
6. Tick "Solve for depth too". The tool finds 12.0 km with an error of about 0.5 km, because our stations surround the event. Real island networks often have large gaps toward open sea, and depth gets much looser.
7. Speed of migration is plain division. If two made-up events 15 km apart are 5 hours apart, the front moved 15 ÷ 5 = 3 km per hour. The paper reports bursts of up to about 2.8 km per hour, so that is the scale to expect.

## The fine print

This is a fast report, written while the sequence was still going. The authors stress that their reading of the physics is tentative, and needs ground deformation and rock studies to confirm it. The crack-opening parts of the moment tensors may partly be artefacts of the inversion. Machine-learning pickers can struggle with the low-frequency signals common at volcanoes, though the authors chose one trained for such settings. The fibub locator uses one uniform layer and straight rays, so treat it as a teaching and checking tool, not a replacement for a full catalogue.
