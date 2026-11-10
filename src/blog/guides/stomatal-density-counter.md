---
title: "Stomatal density and stomatal index: how to count stomata from a photo"
summary: "What stomatal density and stomatal index measure, how to find the field area from a scale bar or the microscope, and a worked example over three fields with mean and spread."
tools: [stomatal-density-counter, leaf-area-analyser, photosynthesis-curve-fitter, hemocytometer]
updated: 2026-11-10
sources:
  - "Salisbury, E. J. (1928), Philosophical Transactions of the Royal Society B 216: 1-65 (the definition of stomatal index)."
  - "Field of view diameter = field number ÷ (objective × extra magnification): the standard microscope relation."
  - "All counts and settings in the example are made up for this guide."
---

The stomatal density counter turns a microscope photo of a leaf surface into two numbers: how many stomata there are per square millimetre, and what share of the surface cells are stomata. You tap each stoma on the photo (or let the page suggest them), tell it the size of the area you counted, and it does the sums, field by field, with a mean and spread at the end. It is for biology classes and anyone comparing leaves grown in different conditions. Measure the whole leaf in the [[leaf-area-analyser]], link stomata to gas exchange with the [[photosynthesis-curve-fitter]] and, for cells in a counting grid, the same count ÷ area idea in the [[hemocytometer]].

## What it is

**Stomata** (one is a stoma) are pores in a leaf's skin, each framed by two **guard cells**; CO₂ comes in and water vapour goes out. The ordinary cells between them are **epidermal cells**.

**Stomatal density** is a count per area:

density = S ÷ A

where S is the number of stomata you counted and A is the area of the field in mm².

**Stomatal index** compares stomata with all the cells around them:

index = S ÷ (S + E) × 100

where E is the number of ordinary epidermal cells in the same field, and each stoma counts as one cell. It changes less than density when cells grow bigger, so it is often better for comparing conditions.

**Field area** can come from three places:

- From a **scale line** on the photo. If a 100 µm scale bar is 250 px long, the photo has 2.5 px per µm, and a 1,200 × 900 px photo covers 480 × 360 µm = 0.1728 mm².
- From the **microscope**. The round field you see has a diameter d = field number ÷ (objective × extra magnification), in mm, and an area π d² ÷ 4.
- **Typed** by you, for example from a stage micrometer.

## How to use it

1. Press **Open a photo** (or **Use the example** to practise). The photo stays in your browser.
2. With **A tap adds** set to **Stoma**, tap every stoma. Switch to **Epidermal cell** and tap the ordinary cells if you want the index. **Remove** deletes the mark nearest your tap; **Undo** and **Clear all marks** do what they say.
3. Optional: under **Automatic suggestion**, say whether stomata look darker or lighter, set the **Threshold** (blank for automatic) and the **Smallest** and **Largest stoma (px)**, then press **Suggest stomata**. Fix any mistakes by tapping.
4. Under **Field of view**, choose how the **Area counted** is known: the whole photo with a scale line (press **Draw the scale line** and tap both ends of the bar), a round field from **Field number**, **Objective** and **Extra magnification**, or a typed area.
5. Read the density and index, then press **Add this field to the list**. Repeat with each new photo.
6. Download the fields or marks as CSV, or a report as an image, PDF or Word file.

## A worked example

A student counts the lower surface of one leaf through an eyepiece with **field number 20 mm** and a **40× objective**, with no extra magnifier, so the round field option is used.

**Field size.** d = 20 ÷ (40 × 1) = **0.5 mm**. Area = π × 0.5² ÷ 4 = **0.196 mm²**.

**Three fields**, counting only inside the circle:

| Field | Stomata | Epidermal cells | Density (per mm²) | Index (%) |
|---|---|---|---|---|
| 1 | 52 | 180 | 52 ÷ 0.196 = 265 | 52 ÷ 232 × 100 = 22.4 |
| 2 | 47 | 171 | 47 ÷ 0.196 = 239 | 47 ÷ 218 × 100 = 21.6 |
| 3 | 58 | 196 | 58 ÷ 0.196 = 295 | 58 ÷ 254 × 100 = 22.8 |

(The densities use the unrounded area, 0.19635 mm².)

**Mean and spread.** The list shows a mean density of **267 ± 28 per mm²** (sample standard deviation) and a stomatal index of **22.3 ± 0.65 %**.

Notice how the two compare: the density's spread is about 10 % of its mean (28 ÷ 267), while the index's is only about 3 % (0.65 ÷ 22.3). Field 3 simply had smaller, more tightly packed cells; the share of stomata hardly changed.

**A trap.** Had the student typed a 10× objective by mistake, the field would be taken as 20 ÷ 10 = 2 mm across, an area of 3.14 mm², and field 1 would read 52 ÷ 3.14 = **17 per mm²**, sixteen times too low. Always check the objective matches the one you counted with.

## Where it is used

- **Plant ecology and school practicals.** Leaves in shade or drought grow different numbers of stomata, and nail-varnish impressions make this a cheap class experiment.
- **Crop breeding.** Breeders compare lines for water use, and stomatal density is one of the traits that affects it.
- **Climate history.** Fossil and herbarium leaves record past CO₂, because many plants make fewer stomata when CO₂ is high. The index is the usual measure here.
- **Other counts per area.** The same method works for leaf hairs or pollen on a slide.

## Common mistakes

- **Counting stomata outside the round field.** With the microscope option, only stomata inside the circle count. A photo usually shows more.
- **Counting guard cells as epidermal cells.** Tap each stoma once, and only ordinary cells as epidermal cells.
- **Mixing leaf surfaces.** Upper and lower surfaces often differ a lot. Use the same side, age and position on every leaf.
- **Trusting the suggestion without looking.** Dirt, air bubbles and touching guard cells fool a simple threshold. Check every mark.

## Questions people ask

**What do I do with stomata cut by the photo edge?** Pick a rule and keep it, such as counting those on the top and left edges but not the bottom and right. The automatic suggestion leaves edge patches out, so add them by hand if your rule includes them.

**Do I need the epidermal cells?** Only for the index. The density needs stomata and area alone.
