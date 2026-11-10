---
name: Vehicle routing
num: 586
shelf: science
code: T414
section: operations-research
title: "Vehicle routing"
summary: "Plan delivery routes from one depot: give the customers as map coordinates or a distance table, their demands, the vehicle capacity and the number of vehicles. Clarke-Wright savings with 2-opt and or-opt improvement, the exact shortest plan for up to 12 customers, a route map and a stop-by-stop table. Checked against brute force and an integer program."
status: live
ads: true
order: 586
icon: compass
works: offline
updated: 2026-11-09
related: [transportation-assignment, graph-algorithms, lp-solver, utm-converter, gps-track-analyser, catchment-buffer]
sources:
  - "Standard methods, written by fibub: Clarke and Wright's savings algorithm (1964), 2-opt and or-opt local search, Held-Karp dynamic programming for the shortest tour, subset dynamic programming for the exact capacitated plan, classical multidimensional scaling for the picture."
  - "Checked against brute force over every stop order, and against an integer program solved with scipy.optimize.milp (HiGHS, BSD licence) on 41 instances including the example: exact totals equal."
  - "The depot, shops and crate numbers in the example are made up for this tool."
flow:
  - { icon: pointer, label: "Places" }
  - { icon: sliders, label: "Capacity" }
  - { icon: compass, label: "Routes" }
  - { icon: table, label: "Stops" }
---

## What it does

The vehicle routing problem asks how a few vehicles, each starting and ending at one depot, should visit every customer so the total distance is as short as possible, without any vehicle carrying more than its capacity. It is the everyday problem of a delivery round, a school bus run or a service engineer's week, and a standard topic in operations research courses.

This tool solves small instances in your browser:

- **Clarke-Wright savings**: start with one vehicle per customer, then join routes in order of the distance saved, d(depot, i) + d(depot, j) − d(i, j), while the load still fits.
- **2-opt**: reverse a stretch of a route when that makes it shorter (it removes crossings).
- **Or-opt**: move one to three neighbouring stops to a better place, in the same route or another vehicle with room.
- **Exact order**: every route of up to 12 stops is put in its shortest possible order by Held-Karp dynamic programming.
- **Exact plan**: with **12 customers or fewer**, it also finds the shortest possible plan of all, within the number of vehicles you allow, and tells you how far the heuristic was from it.

Assign whole loads from several depots with the [[transportation-assignment|transportation and assignment solver]], and turn latitude and longitude into map coordinates with the [[utm-converter|UTM converter]].

## How to use it

1. Choose **Coordinates** and give one place per line: name, x, y, demand. The first line is the depot. Or choose **Distance table** and paste a square table of road distances or travel times (the first row and column are the depot), then the customers' demands.
2. Set the **vehicle capacity** (in the same unit as the demands: crates, kg, passengers) and the **vehicles available** (0 for as many as needed).
3. Read the routes on the map and in the table: each route's stops in order, its load and its length. Download the stop-by-stop list as CSV, or the map and table as an image, PDF or Word file.

## Worked example

The example has a depot in the middle of a 100 × 100 km grid and 10 shops wanting 37 crates in all. With vans of capacity 15 and 3 vans, the shortest possible plan is **3 routes, total distance 404.1 km**: Depot → Shop 8 → Shop 9 → Shop 1 → Shop 2 → Depot (14 crates, 161.1 km), Depot → Shop 10 → Shop 3 → Shop 4 → Depot (10 crates, 101.9 km) and Depot → Shop 7 → Shop 6 → Shop 5 → Depot (13 crates, 141.1 km). Here the savings method already finds this optimum. Set the vans to 2 and the tool explains that 37 crates cannot fit in two vans of 15.

## Limits

- Up to 200 customers. The exact plan is for 12 customers or fewer; above that the answer is a good plan, not a proven best one, and if it needs more vehicles than you have, the tool says so.
- One depot, one vehicle type, and a customer's demand is never split between vehicles. Time windows, driving-hour limits and pick-ups are not modelled.
- With coordinates, distances are straight lines. For real roads, paste a distance table.

## Frequently asked questions

**Why are the map positions odd for a distance table?** Without coordinates, the picture is drawn from the distances (multidimensional scaling), so it is approximate. The route lengths in the table are exact.

**What if my distance table is not symmetric?** Each pair uses the average of its two directions, and the page says so.

**Is my data stored?** No. Everything runs in your browser and nothing is stored or sent anywhere.
