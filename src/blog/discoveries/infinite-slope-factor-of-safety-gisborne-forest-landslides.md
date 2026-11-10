---
title: "Infinite slope factor of safety for forest landslides in Gisborne, New Zealand"
summary: "A 2026 study ran an infinite slope model over 42,000 points in storm-hit plantation forest and found saturation drove the factor of safety most. Here is how to try the same sum."
tools: [infinite-slope, dem-terrain, slope-stability]
updated: 2026-11-10
sources:
  - "Hashemi M and Visser R (2026), New Zealand Journal of Forestry Science 56, CC BY 4.0, the paper described here. Title, authors, volume and licence checked on the publisher's page, 2026-11-10."
  - "Infinite slope factor of safety with seepage parallel to the slope: Skempton AW and DeLory FA (1957), Proceedings of the 4th International Conference on Soil Mechanics and Foundation Engineering 2: 378-381."
paper:
  title: "Estimating a geotechnical factor of safety: A Python-based workflow for regional landslide susceptibility assessment"
  authors: "Hashemi M, Visser R"
  journal: "New Zealand Journal of Forestry Science"
  year: 2026
  doi: "10.33494/nzjfs562026x528x"
  url: "https://nzjforestryscience.nz/index.php/nzjfs/article/view/528"
  licence: "CC BY 4.0"
  reviewed: true
---

Storms on the east coast of New Zealand's North Island have set off thousands of shallow landslides in plantation forests, many of them after harvest. A 2026 paper in the *New Zealand Journal of Forestry Science* asks whether a simple physical model can sort the risky ground from the safe ground across a whole region. The authors built a Python workflow that runs the infinite slope model for tens of thousands of points around Gisborne. They found that how wet the soil is controls the factor of safety far more than any other input. The [[infinite-slope]] tool does the same calculation for one slope at a time, so you can see why. Get the slope angle from an elevation model with [[dem-terrain]], and for deeper, curved slides try [[slope-stability]].

## What they found

Across the full set of points, the median factor of safety (FS) was about 1.3. An FS above 1 means the soil's strength exceeds the pull of gravity along the slope; below 1, the model slope fails. About 28 % of all points had FS below 1.

The model did separate real landslides from stable ground, but only partly. Of the points inside mapped landslides, 37 % had FS below 1, against 18 % of the points outside them. A sensitivity analysis showed FS responds strongly to the saturation ratio (how high the water table rises in the soil) and moderately to soil depth.

## Why it matters

Forest managers need to know which slopes to keep in trees, harvest with care, or replant fast. Statistical susceptibility maps learn from past landslides, but they cannot say why a slope fails. A factor of safety brings in the physics: soil strength, root strength, depth and water. Doing it with open code and national datasets means other regions can repeat the work. The modest hit rate is also a useful finding: it shows how much the answer depends on soil properties that are rarely measured at every point.

## How they did it

1. The study used about 22,000 mapped shallow landslides (some 4,400 hectares) in plantation forest near Gisborne, and drew 42,000 sample points inside and outside them.
2. Each point took a slope angle from terrain data, and shear-strength values assigned from the geology and soil units, based on national datasets and earlier studies.
3. The infinite slope model was run in Python for a range of soil depths and saturation ratios.
4. The FS values were compared between landslide and non-landslide points, and each input was varied to see how much it moved the result.

## Check it yourself with fibub

The infinite slope model treats the slide as a long slab of soil, parallel to the surface, much thinner than it is long. Here is an example with **made-up, rounded soil values**, not the paper's inputs.

1. Type a slope angle β of 32°, a slip surface depth of 1.2 m measured vertically, and effective cohesion c′ of 2 kPa.
2. Set root cohesion c<sub>r</sub> to 4 kPa, for a slope with a living root mat.
3. Set the friction angle φ′ to 30°, unit weight γ to 17 kN/m³ and saturated unit weight to 19.5 kN/m³. Leave water at 9.81 kN/m³.
4. Choose **Partly saturated** and a water table ratio m of 0.5 (the water table halfway up the soil).

With these numbers the tool gives FS = 1.29. Dry (m = 0) it is 1.58, and saturated to the surface (m = 1) it is 1.03: still just standing. Now set root cohesion to 0, as after harvest when the old roots have rotted. FS drops to 1.14 dry, 0.88 at m = 0.5 and 0.65 saturated. The tool's critical water table ratio is now 0.261, so the slope fails once the water table rises about a quarter of the way up the soil.

Depth matters through cohesion. Still without roots, at m = 0.5 the critical depth is about 0.75 m: deeper soil than that fails. With 4 kPa of root cohesion it is about 2.26 m. Look at the plot of FS against m: the line falls steadily as the soil fills with water, which is the strong sensitivity the paper reports. Download the FS table as CSV to compare cases side by side.

## The fine print

The infinite slope model ignores the ends and sides of a slide and assumes water flows parallel to the slope. It works best for shallow, long slides, which is what was mapped here. Across a region, the weak point is the inputs: cohesion, friction angle and soil depth come from maps of geology and soils, not from tests at each point, and root strength changes over a forest's life. That is the likely reason only about a third of landslide points scored FS below 1. The paper is a workflow for susceptibility maps, not a design method, and the same goes for the tool: a real slope needs a site investigation and a qualified engineer.
