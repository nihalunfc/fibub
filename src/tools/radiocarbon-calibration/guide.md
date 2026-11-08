---
name: Radiocarbon calibration
num: 37
shelf: science
section: dating-methods
title: "Radiocarbon calibration with IntCal20: calendar date ranges and probability plot (free)"
summary: "Turn a radiocarbon age (years BP ± error) into calendar dates with the IntCal20 curve. Get the 68.3 % and 95.4 % ranges in BC/AD or cal BP, the median, and plots of the probability and the curve."
status: live
ads: true
order: 10
icon: clock
works: offline
updated: 2026-11-08
related: [uncertainty-calculator, plot-maker, stereonet]
flow:
  - { icon: table, label: "¹⁴C age" }
  - { icon: curve, label: "IntCal20" }
  - { icon: calendar, label: "Date range" }
---

## What it does

A radiocarbon lab reports an age such as 3000 ± 30 BP. It is not a calendar date, because the amount of carbon-14 in the air has changed over time. Calibration converts it to calendar years using a curve built from tree rings, corals, cave formations and lake sediments. This tool uses IntCal20, the internationally agreed curve for the Northern Hemisphere (Reimer et al. 2020). It gives the same kind of result as OxCal and the R package rintcal: the probability of every calendar year, and the ranges that hold 68.3 % and 95.4 % of it.

## How to use it

1. Type one date per line: an optional name, the radiocarbon age in years BP, and its ± error. For example `Hearth charcoal: 3000 30`.
2. Choose how to show the dates: **BC / AD**, **BCE / CE**, or **cal BP** (years before 1950).
3. Read the table: the 68.3 % (1σ) and 95.4 % (2σ) ranges, each with its own probability, and the median.
4. Pick a date to plot. The top chart shows its probability over calendar years. The bottom chart shows where the measured age, as a horizontal line, crosses the calibration curve.
5. Download a report as an image, PDF or Word file.

## Why are there several ranges?

The calibration curve has wiggles and flat stretches (plateaus). A measured age can cross the curve in more than one place, so the probability can split into several ranges. The ranges here are highest posterior density: the shortest set of years that holds the stated probability. Quote the 95.4 % ranges and the curve used.

## The method

For every calendar year θ, the probability is proportional to exp(−(r − μ(θ))² / 2(σ² + s(θ)²)) / √(σ² + s(θ)²). Here r ± σ is your age, and μ(θ) ± s(θ) is the IntCal20 curve, interpolated to single years. This is the standard calibration used by OxCal, Calib and rintcal.

## Worked example

Charcoal dated 3000 ± 30 BP calibrates at 95.4 % to 1380 to 1345 BC (9 %) and 1304 to 1125 BC (86 %), with a median of 1239 BC. A bone at 2450 ± 25 BP falls on the "Hallstatt plateau", a famous flat part of the curve, so its 95.4 % ranges spread in four pieces from 751 to 414 BC, with a median of 565 BC. Radiocarbon cannot give a precise date in that period.

## Frequently asked questions

**Southern Hemisphere or marine samples?** They need SHCal20 or Marine20 with a reservoir correction, which this page does not include yet.

**Is my data sent anywhere?** No. The curve is part of the page, and everything is calculated in your browser.

IntCal20 data: Reimer et al. (2020), Radiocarbon 62(4): 725–757, CC BY 4.0.
