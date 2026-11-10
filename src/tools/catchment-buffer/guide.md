---
name: Catchment buffers
num: 760
shelf: science
code: T528
section: human-geography-and-urban-studies
title: "Catchment and buffer calculator: share of people within X m of a facility, nearest-facility distances and walkability (straight line, free)"
summary: "Open your own facilities, population points or areas (CSV or GeoJSON) and amenities. See what share of people live within a chosen straight-line distance of a facility, nearest-facility distances, each facility's catchment population and a simple walkability score. Runs in your browser; nothing is uploaded."
status: live
ads: false
order: 760
icon: compass
works: offline
updated: 2026-11-09
related: [gps-track-analyser, plot-maker, data-cleaner, hotspot-density, gravity-model, vector-map-viewer, utm-converter, location-quotient-shift-share]
sources:
  - "Great-circle distance by the haversine formula on a sphere of mean Earth radius 6,371,008.8 m; polygon centroids by the shoelace formula on a local flat projection. Methods only; no data or tables are copied."
  - "Written by fibub and checked in the tests against an independent Python implementation (own haversine and a brute-force NumPy distance matrix)."
  - "The example town, its clinics, blocks, populations and amenities are made up."
flow:
  - { icon: table, label: "Places" }
  - { icon: compass, label: "Distances" }
  - { icon: target, label: "Catchments" }
---

## What it does

Planners, health researchers and geographers often ask: how many people live within 1 km of a clinic, a school, a park or a bus stop? This tool answers that from your own files. Give it the **facilities**, the places where **people** live (points with a population, or areas such as census blocks) and, if you like, **amenities** of several types. It measures every distance and reports:

- the share of people within each distance you choose,
- the population-weighted mean, median and 90th percentile distance to the nearest facility,
- for each facility, the people within the catchment distance and the people for whom it is the nearest,
- a simple **walkability score** from the amenity types within reach.

**These are straight-line distances**, as the crow flies along the Earth's surface, not along roads or paths. Real walking routes are longer, often by a quarter to a half, and rivers, motorways or rail lines can make them much longer. Use this for a first look or to compare places on equal terms; use a network analysis tool for travel times.

Check your points on a map with the [[vector-map-viewer]], and estimate how many people travel between places with the [[gravity-model]].

## How to use it

1. **Facilities:** paste or open rows of name, latitude, longitude (a header row with *lat* and *lon* helps), or GeoJSON points.
2. **People:** rows of name, latitude, longitude, population. GeoJSON points or polygons work too, with a property such as *population* or *pop*. Polygons are counted at their centre (area-weighted centroid), so a large area counts as wholly in or out of a circle: use small areas.
3. **Amenities (optional):** rows of type, latitude, longitude, such as grocery, school, park. Tick the types to count.
4. Set the **catchment distance** (the circles on the map and the facility table), any extra distances to report, and the **walkability distance**.
5. Download the people table (nearest facility, distance and walk score for every place), the facility table, or the report as PNG, PDF or Word.

## The measures

- **Distance** is the haversine great-circle distance on a sphere of radius 6,371 km, accurate to about 0.5 % against the true ellipsoid.
- **Within X m** adds up the population of places whose nearest facility is at most X m away.
- **People within** a facility counts everyone inside its circle, so people near two facilities count twice. **Nearest for** assigns each place to one facility and adds up to the total.
- **Walkability score** of a place = 100 × (number of ticked amenity types with at least one within the walkability distance) ÷ (number of ticked types). The headline is its population-weighted average. It is a simple count, not any branded index.

## Worked example

The made-up town has 4 clinics, 70 blocks with 14,120 people and 45 amenities of 5 types. With a 1,000 m catchment, **41.3 % of people live within 1,000 m of a clinic** (5,826 people). The population-weighted mean distance to the nearest clinic is 1,307 m, the median 1,211 m, and 90 % of people live within 2,415 m. Clinic North has 2,040 people within 1 km, and is the nearest clinic for 4,317.

## Frequently asked questions

**Is my data uploaded?** No. Files are read in your browser and the page works offline.

**Which coordinate system?** Latitude and longitude in decimal degrees (WGS 84, as GPS and most web maps use). GeoJSON is longitude first, as the standard says.

**How big can the files be?** Up to 50,000 places per box and 20 MB per file; very large people × facility pairs may take a few seconds.
