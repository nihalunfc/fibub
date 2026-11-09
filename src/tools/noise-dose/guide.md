---
name: Noise dose calculator
num: 944
shelf: science
section: acoustics-and-wave-physics
title: "Noise dose calculator: daily noise exposure from levels and durations, % dose, 8-hour TWA and LEX,8h (3 dB and 5 dB exchange rates)"
summary: "List the noise levels a person is exposed to and for how long, and get the daily noise dose in per cent, the 8-hour time-weighted average, LEX,8h, the allowed time at each level and the time left at the loudest task, for a criterion level, exchange rate and threshold you choose (presets follow NIOSH, US OSHA and the EU and UK rules)."
status: live
ads: false
order: 7
icon: clock
works: offline
updated: 2026-11-09
related: [decibel-distance, audio-spectrum-analyser, noise-barrier, room-acoustics, audiogram, exposure-twa]
sources:
  - "Dose D = 100·Σ C/T with T = 8 / 2^((L − Lc)/q), and TWA = Lc + (q/lg 2)·lg(D/100): US OSHA 29 CFR 1910.95 and its Appendix A (US government work, public domain; the Appendix A worked example is used in the tests). Checked 2026-11-09."
  - "NIOSH (1998), Criteria for a Recommended Standard: Occupational Noise Exposure, DHHS (NIOSH) Publication No. 98-126: 85 dB(A), 3 dB exchange rate. Checked 2026-11-09."
  - "LEX,8h and the 80, 85 and 87 dB(A) values: Directive 2003/10/EC (EU) and the UK Control of Noise at Work Regulations 2005. Checked 2026-11-09. Rules differ by country, province and state: check your local rules and the official source."
  - "Checked against an independent NumPy implementation. The example day is made up."
flow:
  - { icon: sliders, label: "Rules" }
  - { icon: table, label: "Exposures" }
  - { icon: percent, label: "Dose" }
  - { icon: clock, label: "Time left" }
---

## What it does

Loud noise damages hearing according to how loud it is **and** how long it lasts. Workplace rules turn this into a **daily noise dose**: 100 % is the most a worker should get in a day, for example 85 dB(A) for 8 hours. Every few decibels louder halves the time allowed: **3 dB** under the equal-energy rule (NIOSH, the EU, the UK and many others), **5 dB** under the US OSHA rules.

This calculator takes a list of tasks with their **A-weighted level** and **duration**, and works out:

- the **allowed time** at each level and each task's share of the **dose**;
- the total **dose** in per cent, and the **8-hour time-weighted average (TWA)** that gives the same dose;
- **LEX,8h**, the energy average normalised to 8 hours used in the EU and UK;
- the **time left** at the loudest task before the dose reaches 100 %.

Work out the level at each place from a source's distance with the [[decibel-distance|decibel distance calculator]], and keep track of hearing over time with the [[audiogram|audiogram plotter]].

## How to use it

1. Pick a **preset** or type your own **criterion level**, **exchange rate**, **threshold** (levels below it are not counted; leave empty for none) and **criterion duration**.
2. List the day's tasks, one per line: an optional name, the level in dB(A) and the time. Choose **minutes** or **hours**; h:mm also works. You can also open a CSV or Excel file, such as a dosimeter log.
3. Read the dose, TWA and LEX,8h, the chart of allowed time against level, and the table. Download the table as CSV, or the report as an image, PDF or Word file.

## Worked example

The made-up day is 60 minutes of grinding at 95 dB(A), 300 minutes on an assembly line at 85, an hour in a break room at 70 and an hour on a forklift at 90. Under the **NIOSH** preset (85 dB(A), 3 dB, threshold 80) the page shows **Daily dose 228 % (TWA 88.6 dB(A))**, flagged as over the criterion. Grinding alone is allowed only 48 minutes at 95 dB(A), so its hour is 126 % of the dose; the break room is below the threshold and counts as nothing. LEX,8h is also 88.6 dB(A).

Switch to the **US OSHA PEL** preset (90 dB(A), 5 dB, threshold 90) and the same day is a **38 %** dose (TWA 82.9 dB(A)), because the 85 dB(A) work no longer counts and each 5 dB only halves the time. With the **OSHA action level** preset the dose is 138 % (TWA 87.3 dB(A)). The same day can pass one rule and fail another, which is why you must use the rule that applies where you work.

The tests also reproduce the worked example in OSHA's Appendix A: 110 dB(A) for 15 minutes, 100 for 30 minutes and 90 for 90 minutes give a dose of 93.75 %, which the rule rounds to 94 %.

## Tips

- Use LAeq values for each task, not the loudest reading.
- Halving the time at the loudest task often does more than any other change.
- Hearing protection is not included; its real-world protection is often much less than the label says.

## FAQ

**Which preset should I use?** The one in the rules that apply to your workplace. Rules differ between countries, provinces and states, and change; check your local rules and the official source.

**Is this a noise assessment?** No. It does arithmetic on the levels you type. For study and planning, not a substitute for professional judgement or a proper noise assessment.
