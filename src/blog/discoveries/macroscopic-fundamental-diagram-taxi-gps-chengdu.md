---
title: "Macroscopic fundamental diagram from taxi GPS trajectories: Chengdu"
summary: "A 2026 PLOS ONE study built a city network's speed, density and flow curves from taxi GPS alone and found a cubic fit beat Greenshields. Try the fits yourself."
tools: [traffic-flow, regression-workbench, queueing-calculator]
updated: 2026-11-10
sources:
  - "Lu X, Zhang J, He Q, Zheng S, Su J (2026), PLOS ONE 21(2): e0342070, the paper described here."
  - "Greenshields (1935) linear speed-density model; Underwood (1961) exponential model; the identity q = k·v: standard traffic flow theory."
  - "The 12 network observations in the worked example are made up by fibub, not taken from the paper."
paper:
  title: "Data-driven derivation of macroscopisc fundamental diagram from floating car trajectories"
  authors: "Lu X, Zhang J, He Q, Zheng S, Su J"
  journal: "PLOS ONE"
  year: 2026
  doi: "10.1371/journal.pone.0342070"
  url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0342070"
  licence: "CC BY 4.0"
  reviewed: true
---

Traffic engineers like to describe a whole district with one curve: how many vehicles the street network moves per hour as it fills up. That curve, the **macroscopic fundamental diagram** (MFD), normally needs loop detectors buried in the road. A team in Chengdu, China, built one from taxi GPS traces alone, in a paper in PLOS ONE in February 2026 (the title keeps the journal's own spelling, "macroscopisc"). They found that a cubic curve described their network better than the classic Greenshields straight line. This page explains the study and shows how to run the same kind of comparison with the [[traffic-flow]] calculator and the [[regression-workbench|regression calculator]].

## What they found

Working on 129 road segments and 78 signalised junctions, about 36 km of road inside Chengdu's ring roads, the authors turned taxi positions into estimates of how many vehicles of every kind were on each street. From those they drew speed against density, flow against density and speed against flow for the whole area. Simple quadratic and cubic curves were fitted to each pair; the cubic won every time on an F-test, with an R² of up to about 0.92, and also beat the Greenshields, Underwood and Daganzo (triangular) shapes on R², error and information criteria. Checked against a VISSIM traffic simulation, their method's error in the network's maximum flow fell from about −17.5 % for a plain average-speed approach to about −3.5 %. Queue lengths at junctions came out with a typical error of about 23 m.

## Why it matters

An MFD tells a city when its network is nearing gridlock, so signals can hold traffic back at the edge before the centre jams. Many cities have patchy detector coverage, yet nearly all have ride-hailing or taxi fleets reporting GPS every few seconds. If a usable MFD can be built from those traces, cities without dense sensor networks can still manage congestion at the district level.

## How they did it

Only about 1 vehicle in 10 on the road was a reporting taxi (about 15 % in the centre, about 3 % at the edge), so the main trick was scaling up. First the GPS points were matched to streets with a combined hidden Markov and conditional random field method, which cut position errors by about 29 % compared with a hidden Markov model alone. Slow taxis bunched near junctions marked the stop lines. The last queued taxi, plus an arrival rate for the red time left, gave each queue's length, and a speed-based model turned queues into vehicle counts. The ratio of all vehicles to taxis in queues then scaled the taxi count to a total. Density is vehicles per kilometre of road, and flow comes from density times a weighted average speed, with expressways weighted most. The trajectories come from November 2016.

## Check it yourself with fibub

The paper's own fitted coefficients sit in its tables, so here we use **12 made-up network observations** that bend the way city data often do: density k from 5 to 80 veh/km per lane, with average speeds of 44, 41, 37, 34, 31, 28, 25, 22, 17, 13, 10 and 7 km/h at k = 5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 70 and 80.

1. **Fit the classic models.** In the traffic flow calculator choose **Metric**, columns **Density, speed**, and paste the pairs. Greenshields fits best on speed (R² speed 0.980, RMSE 1.65 km/h): free-flow speed 44.2 km/h, jam density 87.8 veh/km, capacity **971 veh/h** at 43.9 veh/km. Underwood is close behind (R² speed 0.979) with a capacity of 830 veh/h; Greenberg trails (0.931, 906 veh/h).
2. **Look at the flow-density diagram.** The flows implied by q = k·v peak at 880 veh/h near 40 veh/km. Greenshields overshoots that peak by about 10 %, because a straight speed line forces a symmetric parabola for flow. That is the same weakness the paper points to.
3. **Fit polynomials.** Make a two-column table, density and flow (220, 410, 555, 680, 775, 840, 875, 880, 850, 780, 700, 560 veh/h), and open it in the regression calculator. Type **Polynomial**, y = flow, x = density. Degree 2 gives R² 0.963 and AIC 127.4; degree 3 gives R² 0.998 and AIC 92.5, with a cubic term whose p-value is about 0.000001. The cubic is clearly better, as in the paper.
4. **Read capacity off the cubic.** Setting the slope of the cubic to zero gives a peak of about **886 veh/h at 41.5 veh/km**, much closer to the observed top than Greenshields.
5. **Operating points.** Back in the traffic flow calculator, give a flow of 500 veh/h: Greenshields says it can run at 13.3 veh/km (free-moving) or 74.5 veh/km (congested). Two states for one flow is why density, not flow, is the safer signal for control.
6. **Queues at one junction.** To see how a queue builds when arrivals outrun service, try the [[queueing-calculator]].

## The fine print

- The taxi data are from 2016 and cover one part of one city, so newer fleets and other cities may behave differently.
- Taxis are not spread evenly; the authors note density is likely overestimated in the centre and underestimated at the edge.
- The method rests on assumptions: steady arrivals during red, uniform braking, unsaturated signals and fixed road-class weights.
- Validation used a simulation rather than full field counts of every vehicle.
- A cubic fits better inside the observed range but can misbehave beyond it; it has no physical meaning at jam density.
- For a real road scheme, follow your local design manual and a qualified traffic engineer.
