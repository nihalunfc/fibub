---
name: Stereotaxic coordinate helper
num: 349
shelf: science
section: neuroscience
title: "Stereotaxic coordinate calculator: bregma-lambda scaling, angled approach and skull-flat check"
summary: "Scale atlas coordinates to your animal by its measured bregma-lambda distance, work out the skull entry point and the distance to lower for an angled arm, and check the skull is flat from DV readings at bregma, lambda, left and right. For study and teaching, not for clinical use."
status: live
ads: true
order: 349
icon: target
works: offline
updated: 2026-11-09
related: [uncertainty-calculator, plate-layout, hemocytometer, spike-train-analyser, calcium-imaging-dff, protocol-timer, anaesthesia-monitoring-log]
sources:
  - "Geometry only: proportional scaling by the bregma-lambda distance and right-angle trigonometry for tilted tracks and skull tilt, as described in stereotaxic surgery methods texts. No atlas coordinates or reference distances are included; you type your atlas's values."
  - "Checked in the tests against SciPy's Rotation class (rotate a vertical track and intersect it with the skull plane) and NumPy arctan2 for the tilt angles. The example target and distances are made up."
flow:
  - { icon: book, label: "Atlas point" }
  - { icon: ruler, label: "Scale" }
  - { icon: compass, label: "Angle" }
  - { icon: target, label: "Entry, depth" }
---

## What it does

Brain atlases give coordinates for a reference animal of a set size. Your animal's skull may be a little smaller or larger, its arm may need to be tilted to miss a blood vessel, and its head must be level in the frame. This helper does the three small calculations behind that:

1. **Scaling.** The distance between bregma and lambda is a common measure of skull size. The target is multiplied by measured ÷ reference.
2. **Angled approach.** With the arm tilted from vertical, the track enters the skull at a different point and is longer. The tool gives the entry point and the distance to lower along the arm.
3. **Skull-flat check.** From DV readings at bregma and lambda (and optionally left and right) it gives the height difference and the tilt angle.

For study and teaching, not for clinical use. Always confirm placements histologically.

Keep a record of the animal during surgery in the [[anaesthesia-monitoring-log]], and analyse what you record from the site with the [[spike-train-analyser]].

## How to use it

1. Type the **target** from your atlas: AP from bregma (positive in front), ML from the midline and depth below the skull at bregma.
2. Type the **reference bregma–lambda distance** of your atlas (the 4.0 mm filled in is only an example) and the distance you **measured** on the animal. Choose to scale AP only (common), all three axes, or nothing.
3. For an **angled approach**, type the arm angle, the plane it tilts in, and which way the tip points. "Toward the midline" means the tip moves medially as it goes down, so the entry is lateral of the target.
4. For the **flat check**, type the frame's DV readings when the needle touches bregma and lambda, and say whether the reading grows as the arm goes down or up.

## Worked example

The made-up example: target AP −2.0, ML 1.5, depth 1.8 mm; reference bregma–lambda 4.0 mm, measured 3.8 mm; AP scaled only; 10° tilt in the coronal plane with the tip toward the midline.

- Scale factor 0.95, so the target becomes **AP −1.90 mm, ML 1.50 mm, depth 1.80 mm**.
- The track enters the skull at **AP −1.90 mm, ML 1.82 mm** and you lower **1.83 mm** along the arm (0.0278 mm more than vertical). The entry is 0.32 mm lateral of the target.
- Flat check: bregma 4.50 and lambda 4.62 mm, readings growing downwards: lambda is 0.12 mm lower (1.81°), outside the example tolerance of 0.1 mm, so lower the incisor bar.

## Tips

- Measure bregma–lambda with the skull already flat, or the AP distance is foreshortened.
- Depth from the dura instead of the skull is common for deep targets; keep to one convention, the same as your atlas.
- Small angles change the entry by depth × tan(angle): at 10° that is about 0.18 mm per mm of depth.

## FAQ

**Why is no atlas built in?** Atlas coordinates belong to their publishers, and you should use the atlas for your species, strain and age.

**Does anything leave my device?** No. Everything is worked out in your browser.
