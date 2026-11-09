---
name: Habitat connectivity analyser
num: 511
shelf: science
section: conservation-science
title: "Habitat connectivity calculator: least-cost distances, IIC, PC and dPC patch importance on a raster map"
summary: "Paint a small land-cover map or open one (CSV grid, ASCII grid or PNG), give each class a resistance, and find the habitat patches, least-cost distances between them, links under a dispersal distance, components, the IIC and PC connectivity indices, each patch's importance (dIIC, dPC) and the least-cost path between any two patches."
status: live
ads: false
order: 511
icon: compass
works: offline
updated: 2026-11-09
related: [biodiversity-indices, camera-trap-tagger, home-range-analyser, vector-map-viewer, spectral-index-calculator, network-metrics, occupancy-estimator]
sources:
  - "Integral Index of Connectivity (IIC): Pascual-Hortal, L. and Saura, S. (2006), Landscape Ecology 21, 959 to 967. Probability of Connectivity (PC) and patch importance (dI): Saura, S. and Pascual-Hortal, L. (2007), Landscape and Urban Planning 83, 91 to 103. Formulas only; no data copied."
  - "Least-cost distances (Dijkstra on the 8-neighbour grid, each step costing its length times the mean resistance of the two cells) are written by fibub and checked in the tests against scikit-image's MCP_Geometric; patches against scipy.ndimage.label; IIC, PC, dIIC and dPC against networkx."
  - "The example map, its classes and resistances are made up by fibub. A map you open stays on your device."
flow:
  - { icon: pencil, label: "Map" }
  - { icon: sliders, label: "Resistance" }
  - { icon: link, label: "Links" }
  - { icon: chart, label: "Importance" }
---

## What it does

Animals and plants need to move between patches of habitat to find mates, food and new homes. Whether they can depends on how far apart the patches are and what lies between: a woodland bird crosses a hedge-lined field easily, a road or a town much less so. Conservation planners measure this **functional connectivity** with graph indices. This page computes the standard ones on a small map in your browser:

- **Map and resistance.** Paint a grid of land-cover classes or open one. Each class has a **resistance**: the cost of crossing one metre of it, relative to habitat (1).
- **Patches.** Habitat cells that touch (also diagonally) form a patch. Its area comes from the cell size.
- **Least-cost distances.** From every patch, the page finds the cheapest route to every other patch over the grid (Dijkstra's algorithm with 8 neighbours; a step costs its length times the mean resistance of the two cells). The distance is edge to edge, in cost units.
- **Links and components.** Patches closer than the dispersal distance are linked. Groups of linked patches are components: an animal can reach any patch of its component.
- **IIC** (Integral Index of Connectivity) adds up aᵢ·aⱼ / (1 + nlᵢⱼ) over all pairs of patches that are connected, where nl is the number of links on the shortest route, divided by the landscape area squared.
- **PC** (Probability of Connectivity) adds up aᵢ·aⱼ·p*ᵢⱼ, where p*ᵢⱼ is the best chance of getting from i to j through any chain of patches, each step having chance exp(−k·d).
- **Patch importance.** dIIC and dPC: the drop in each index (%) when one patch is removed. High values mark the patches to protect first.
- **Least-cost path.** The cheapest route between any two patches, drawn on the map.

Map land cover for the resistance values with the [[spectral-index-calculator]], and see how far animals actually range with the [[home-range-analyser]].

## How to use it

1. **Map.** Use the example, open a grid of class codes (CSV, Excel, ASCII grid) or a PNG in the class colours, or start a blank map and paint (set *Tapping the map* to *Paints cells*).
2. **Classes.** Edit the class table: code, name, whether it is habitat, resistance and colour.
3. **Dispersal.** Set the dispersal distance in cost units and the chance of reaching that far.
4. **Read.** Tap two patches on the map (or use the lists) to see the least-cost path. Download the patch table, the distances, the map, or the report.

## Worked example

The **made-up** example has 48 × 32 cells of 100 m (1536 ha): eight forest patches in farmland (resistance 10) with grassland strips (5), a river (30), a road (60) and a town (100). Habitat covers 312 ha, 20.3 % of the map.

With a dispersal distance of 5000 cost units (5 km through forest, 500 m through farmland) and p = 0.5 there, the page finds **8 patches, 3 links and 5 components, IIC 0.00939 and PC 0.0152**. Patch 5 (68 ha) is the most important, **dPC 42.95 %**: it is large and linked to patch 6 (least cost 3262.7 over 7 cells, a direct chance of 0.636). The small isolated patch 4 (9 ha) scores only 4.33 %. Raise the dispersal distance and watch the components merge and the importance shift to the patches that act as stepping stones.

## Tips

- Resistances are the weakest part of any connectivity study. Try a few sets of values and see whether the ranking of patches changes.
- The dispersal distance is in cost units, not metres. A species that crosses 2 km of habitat crosses 200 m of resistance-10 farmland.
- Use a cell size fine enough to show roads and rivers as unbroken lines; one-cell gaps let routes slip through.
- The landscape area AL only scales IIC and PC; it does not change the ranking of patches.

## FAQ

**Is this Conefor?** It computes the same IIC and PC formulas from the same published papers, on least-cost distances like those of Graphab or Linkage Mapper, but on a small map in your browser. Use those programs for whole regions.

**Why is my map limited to 200 × 200 cells and 80 patches?** Patch importance recomputes PC once per patch, which grows quickly with the number of patches; the limits keep the page fast on a phone.

**What do the PNG colours need to be?** Each pixel is matched to the nearest class colour in the class table, so a map exported from a GIS with those colours works.

**Is my map uploaded?** No. Everything is worked out on this page and nothing leaves your device.
