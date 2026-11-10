---
title: "EV charging station planning with an M/M/c queue for fast and slow chargers"
summary: "A 2025 study sized charging stations in Changchun with a queue model that treats fast and slow chargers apart. See the idea, and test charger counts for your own hub."
tools: [queueing-calculator, distribution-explorer, lp-solver]
updated: 2026-11-10
sources:
  - "Wang Z, Zou J, Tu J, Li X, Liu J, Wu H (2025), World Electric Vehicle Journal 16(11): 600, the paper described here."
  - "Erlang C formula and Little's law for the M/M/c queue: standard queueing theory."
  - "The charging hub in the worked example (arrival rate, charging time, charger count) is made up by fibub."
paper:
  title: "Towards Sustainable EV Infrastructure: Site Selection and Capacity Planning with Charger Type Differentiation and Queuing-Theoretic Modeling"
  authors: "Wang Z, Zou J, Tu J, Li X, Liu J, Wu H"
  journal: "World Electric Vehicle Journal"
  year: 2025
  doi: "10.3390/wevj16110600"
  url: "https://www.mdpi.com/2032-6653/16/11/600"
  licence: "CC BY"
  reviewed: true
---

How many chargers does a public charging station need? Too few and drivers queue; too many and costly hardware sits idle. A team in China tackled this for the centre of Changchun, published in the World Electric Vehicle Journal in October 2025. Their twist was to model the waiting line at each station as a multi-server queue in which fast and slow chargers are counted separately, rather than lumping them together. This page explains the study in plain words and shows how to test charger counts for a hub of your own with the [[queueing-calculator]], after checking the arrival and charging-time assumptions in the [[distribution-explorer]].

## What they found

The model picked 15 station sites with 110 fast chargers and 40 slow ones, about 11,544 kVA of connected capacity, at a yearly cost the authors put at about 38.3 million yuan. Compared with a plan that ignores the difference between charger types and simplifies queueing, they report a total cost about 4.3 % lower, made up of about 5.3 % less investment and about 3 % less cost to drivers. Of three search methods they tried, simulated annealing gave the cheapest plan, ahead of a genetic algorithm and ant colony optimisation.

## Why it matters

Charging is slow compared with filling a tank, so a queue of only two or three cars can mean half an hour of waiting. Planners trade the price of chargers and grid connections against the time drivers lose, and the queue model is what turns "how many cars come, and how long they stay" into "how long people wait". Treating fast and slow chargers as one pool hides the fact that they serve cars at very different speeds. A few per cent of a city's charging budget is a real sum, and the same reasoning applies to depot charging for buses, taxis and delivery vans.

## How they did it

The team split the city's road network into demand points weighted by population and the share of trips that need charging. Arrivals at each candidate station were assumed to be random (a Poisson process), and charging times to be exponential, which is what the "M/M" in M/M/c means; c is the number of chargers. Each charger type got its own service rate and its own chance of standing idle, and the two were combined into station-wide waiting figures. The cost to drivers (travel plus waiting) and the operator's cost (building and running stations) were weighted half and half, and the search methods hunted for the cheapest mix of sites and charger numbers. Case-study inputs such as arrival rates and charging times are in the paper's parameter table.

## Check it yourself with fibub

The queueing calculator handles one pool of identical servers at a time, so it fits the paper's idea best when you look at one charger type at one station. The hub below is **made up** for illustration: 10 cars an hour arrive at a group of fast chargers, and each one stays 40 minutes on average.

1. **Pick the model.** Choose **M/M/c: several servers (Erlang C)**.
2. **Type the rates.** Arrivals 10 per hour; average service time 40 minutes; servers c = 8. The offered load is 10 × 40 / 60 ≈ **6.67 erlangs**, so at least 7 chargers are needed just to keep up.
3. **Read the results.** With 8 chargers the chargers are busy **83.33 %** of the time. About **53.27 %** of drivers find every bay full, and the average wait in the queue is **15.98 minutes**. Those who do wait spend 30 minutes on average. On average 2.66 cars are queueing and 9.33 are on site.
4. **Set a target.** In the Staffing card, choose **Share served within a time**, 80 %, within 600 seconds (10 minutes). Eight chargers start only 61.83 % of drivers within 10 minutes; **9 chargers** reach 82.52 %, and 10 reach 92.41 %. With 9, the average wait falls to 5.37 minutes.
5. **Test pooling.** Now imagine the same demand split over two separate sites with 4 chargers each: type 5 arrivals per hour and c = 4. The busy share is the same 83.33 %, but the average wait jumps to **39.46 minutes** and 65.77 % of drivers wait. One shared queue beats two small ones, which is one reason charger mix and siting must be solved together, as the paper does.
6. **Check against a simulation.** With 8 chargers, 100,000 customers and seed 1, the simulation gives an average wait of about 14.7 ± 2.0 minutes, close to the formula.

To model a station with both charger types, run each type as its own M/M/c pool with its own arrival share and charging time, then add the costs. If you want to pick sites and charger numbers that minimise a cost under limits, a small version of the problem can be set up in the [[lp-solver]].

## The fine print

- Exponential charging times are a convenient assumption. Real sessions cluster around typical lengths, and a less spread-out service time gives shorter waits than M/M/c predicts.
- Arrival rates change through the day; a steady-state queue describes one busy hour at a time, not a whole day.
- Drivers who give up and leave, or who choose a fast or slow charger depending on the queue, are not part of a basic M/M/c model.
- The case study covers one city's core with demand estimated from population, not from measured charging sessions.
- The cost results depend on the paper's equal weighting of operator and driver costs; another weighting gives another plan.
- Real station design must follow local grid rules and planning guidance; check the official source.
