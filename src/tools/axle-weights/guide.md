---
name: Axle weights
num: 1815
shelf: money
code: T904
section: trucking
title: "Axle weight calculator: load on each axle and the bridge formula"
seoTitle: "Axle weight and bridge formula calculator"
summary: "See how a load on a semi-trailer splits between the steer, drive and trailer axles, check each group against US federal limits and the bridge formula, or against Canadian and Indian limits you can edit."
status: live
ads: true
order: 1815
icon: scale
works: offline
updated: 2026-11-10
related: [unit-converter, vehicle-routing, centre-of-mass]
sources:
  - "US: FHWA Bridge Formula Weights (W = 500 (LN/(N-1) + 12N + 36), nearest 500 lb; 20,000 lb single, 34,000 lb tandem, 80,000 lb gross; two tandems 36 ft or more apart may carry 34,000 lb each), https://ops.fhwa.dot.gov/freight/publications/brdg_frm_wghts/, checked 2026-11-10."
  - "Canada (Ontario) and India limits are estimates, not confirmed on an official page: Ontario steer 9,000, single 10,000, tandem 19,100, tridem 24,000, gross 63,500 kg; India as reported from MoRTH S.O. 3467(E) (2018): single tyre 7,000, dual tyre 11,500, tandem 21,000, tridem 24,000 kg. Every limit is editable. Check the official source."
  - "Load split: the lever rule (moments about the kingpin and the fifth wheel). Drawings are fibub's own."
flow:
  - { icon: ruler, label: "Axles" }
  - { icon: scale, label: "Load" }
  - { icon: sliders, label: "Limits" }
  - { icon: check, label: "Check" }
---

## What it does

A truck can be under its gross limit and still be overweight on one axle group, which is what scales and bridges care about. This tool takes a tractor-semitrailer's axle positions, its empty weights and the load with the position of its centre, and works out the weight on the steer axle, the drive group and the trailer group by the lever rule.

It then checks each group and the gross against limits you pick: US federal limits and the bridge formula, or Ontario and India figures given as estimates you should check and can edit. A small side view shows the truck and the weight on each group, with any group over its limit in red. Convert feet, metres, pounds and kilograms with [[unit-converter]], and plan the route with [[vehicle-routing]]; [[centre-of-mass]] helps find the centre of an uneven load.

## How to use it

1. Pick the rules and units, and the number of drive and trailer axles.
2. Type the spacing within a group, the wheelbase (steer axle to the middle of the drive group), the fifth-wheel position and the kingpin to the middle of the trailer group.
3. Type the empty weight on each group (from a scale), the load and how far its centre is behind the kingpin.
4. Read the checks. Slide the fifth wheel or the trailer tandem, or move the load, and watch the weights shift.

## What each setting does

- **Steer axle to fifth wheel**: moving the fifth wheel forward puts more of the kingpin weight on the steer axle.
- **Kingpin to centre of the load**: a load further back puts more on the trailer group.
- **Limits**: filled in from the rules you pick; change them to your state, province or permit.
- **Bridge formula box**: the most any group of N axles may carry over L feet between its outer axles.

## Worked example

US rules, tandem drive and tandem trailer. Empty weights 10,500 / 12,500 / 7,000 lb. A 40,000 lb load sits 20 ft behind the kingpin, with the trailer group 40 ft back: half (20,000 lb) goes to the trailer group and half to the kingpin. With the fifth wheel 19 ft from the steer axle and a 20 ft wheelbase, 19,000 lb of that goes on the drive group and 1,000 lb on the steer. Totals: 11,500, 31,500 and 27,000 lb, 70,000 lb gross, all within limits. Move the load to 30 ft and the trailer group carries 37,000 lb, over its 34,000 lb limit. For the bridge formula, 5 axles over 51 ft gives 500 × (51 × 5 ÷ 4 + 60 + 36) = 79,875, rounded to 80,000 lb.

## FAQs

**Why is the steer limit 20,000 lb?** That is the federal single-axle limit. Many states and most tyre ratings hold a steer axle to about 12,000 lb, so change it if yours does.

**Is this as good as a scale?** No. It is for planning; the scale ticket is what counts.
