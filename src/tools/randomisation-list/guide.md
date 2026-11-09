---
name: Randomisation list generator
num: 470
shelf: science
section: biostatistics
title: "Randomisation list generator: permuted blocks, stratified randomisation and sealed envelopes"
summary: "Make a reproducible allocation list for a trial: simple or permuted-block randomisation with fixed or random block sizes, strata, ratios such as 2:1, a seed anyone can reuse, CSV and printable sealed-envelope labels."
status: live
ads: false
order: 10
icon: table
works: offline
updated: 2026-11-09
related: [bland-altman, sample-size, plate-layout, field-sampling-planner, experiment-design, survival-analysis, sample-label-maker]
sources:
  - "Permuted blocks and stratified randomisation: Altman DG and Bland JM (1999), BMJ 318:1209; Schulz KF and Grimes DA (2002), The Lancet 359:515-519."
  - "Generator: xoshiro128** by Blackman D and Vigna S (2018, public domain reference code), seeded by SplitMix32 from a 32-bit FNV-1a hash of the seed text."
  - "Shuffle: Fisher RA and Yates F (1938); Durstenfeld R (1964), Communications of the ACM 7:420."
flow:
  - { icon: pencil, label: "Design" }
  - { icon: lock, label: "Seed" }
  - { icon: table, label: "List" }
  - { icon: download, label: "Envelopes" }
---
## What it does

Random allocation is what makes a clinical trial fair: neither the researcher nor the patient chooses who gets which treatment. This tool makes the allocation list before the trial starts, in your browser. It supports **simple randomisation**, **permuted blocks** with one block size or with block sizes chosen at random, **stratified randomisation** (a separate list for each combination of factors such as site and age group), any **allocation ratio** such as 2:1 or 1:1:1, and a **seed** so the same list can be made again by anyone, for example an auditor or a statistician checking your work. Download the full list as CSV, a report as PDF, Word or an image, or print **sealed-envelope labels**.

Work out how many patients you need with the [[sample-size|sample size calculator]] first, and print labels for the coded packs with the [[sample-label-maker]].

## How to use it

1. Type the arm (group) names separated by commas, and the ratio, one whole number per arm.
2. Pick the method and, for blocks, the block sizes. Every block size must be a multiple of the ratio's total (for 2:1, sizes 3, 6, 9 and so on).
3. Type how many participants each stratum needs. For strata, write one factor per line as "Name: level, level". Leave the box empty for one list.
4. Type a seed or press **New random seed**. Write the seed down and keep it away from the people who enrol participants.
5. Check the balance table, then download the CSV or print the envelopes.

## The options

- **Simple** allocates each participant independently, like a weighted coin. It is completely unpredictable, but small trials can end up unbalanced (with 20 people, a 13 to 7 split is not unusual).
- **Permuted blocks, one size** shuffles each block so it holds the arms in the exact ratio. Groups never drift apart by more than half a block, but with a known block size the last allocation of each block can be guessed.
- **Permuted blocks, random sizes** picks the size of each block at random from your list, which makes guessing much harder. This is the usual choice.
- **Strata** give each combination of levels its own list, so each site or age group is balanced on its own. Keep strata few: many small strata with half-filled blocks lose the benefit.
- **Show the arms on screen** can be turned off when others can see your screen; the downloads still hold the arms.
- **ID prefix** starts each allocation ID, for example P001.

## How the list is made

The seed text is hashed with 32-bit FNV-1a; four outputs of SplitMix32 started from that hash fill the state of the xoshiro128** generator (Blackman and Vigna 2018). A whole number below n is drawn without bias by rejection (draws at or above the largest multiple of n below 2³² are thrown away), simple allocation draws a number below the ratio's total, and each block is shuffled with the Fisher-Yates algorithm. Each stratum has its own generator, seeded with "seed/stratum name", so changing the size of one stratum never changes another. The page states the method so the list can be reproduced in any language.

## Worked example

The page opens with arms Treatment and Control, ratio 1:1, random block sizes 4 and 6, 40 participants per stratum, strata Site (Clinic 1, Clinic 2) by Age (under 65, 65 or over) and the seed my-trial-2026. That gives 160 allocations in 4 strata: 80 Treatment, 80 Control. In the stratum "Site: Clinic 1, Age: under 65" the list starts Treatment, Control, Treatment, Treatment, Control, Control. "Site: Clinic 2, Age: under 65" fills exactly 7 blocks and is never more than 1 participant off balance; in the other three strata the last block is cut short at 40, which the table points out. An independent Python version of the same algorithm makes exactly the same lists, and the generator matches Vigna's reference C code.

## Tips

- Prepare the list before the first participant, and let someone not involved in recruitment hold it or prepare the envelopes.
- Use opaque, sequentially numbered, sealed envelopes and open them in order, only after consent and enrolment.
- Make the list a little longer than the planned sample size, so there are spare allocations.
- Report the method, block sizes (after the trial), strata and seed, as CONSORT asks.

## FAQ

**Is this random enough for a real trial?** The generator passes standard statistical test suites and the list is unpredictable without the seed. For a regulated trial, follow your sponsor's procedures, which often require a validated system.

**Does the seed leave my computer?** No. Nothing is uploaded; the page works offline.
