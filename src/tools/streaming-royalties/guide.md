---
name: Royalty estimator
num: 3022
shelf: everyday
code: T1048
section: music-business
title: "Royalty estimator: what your streams might earn after the cuts"
summary: "Estimate music streaming payouts from your own per-stream rates, take off distributor and label shares, split the rest between collaborators, work out streams needed for a target, and download a CSV."
status: live
ads: false
order: 3022
icon: coin
works: offline
updated: 2026-11-18
related: [split-sheet-maker, release-checklist, gig-fee-calculator]
sources:
  - "Streaming services pay from a pooled share of revenue split pro-rata by streams, so they publish no fixed per-stream rate; this tool ships no real rates. Example numbers on the page are made-up round numbers. Terms differ by service, distributor and contract: check the official source for each. Checked 2026-11-18."
flow:
  - { icon: table, label: "Streams" }
  - { icon: percent, label: "Cuts" }
  - { icon: download, label: "CSV" }
---

## What it does

This tool turns streams into an estimate of money. For each service you enter the number of streams and the rate per stream from your own statements. It adds them up, takes off your distributor's fee and any label share, and splits what is left between everyone who worked on the track. It can also run backwards and tell you how many streams you need to earn a target amount.

It ships no rates. Services do not pay a fixed amount per stream: they pay each rights holder a share of a monthly pool, in proportion to that rights holder's share of all streams, so the rate changes. Use the figures on your own statements. Compare it with live income using the [[gig-fee-calculator]].

## How to use it

1. Type each service's name, streams and rate per stream. **Add a service** for more rows, or **Fill an example** to see how it works.
2. Enter the distributor fee and label share if they apply.
3. List the collaborators with their percentage shares. They must total 100%.
4. Read the table, then press **Download CSV** to keep it.
5. For a target, open **More options**, type an amount and choose who earns it.

## What each option does

- **Distributor fee**: taken from the total first.
- **Label share**: taken from what is left after the distributor.
- **Splits**: each person's percentage of the amount left to split. If they do not total 100%, a message says how far off they are.
- **Streams needed**: the target divided by your average per stream after the cuts.

## Worked example

With the example button: 100,000 streams at 0.004 gives 400, and 50,000 at 0.002 gives 100, so 500 in total. With a 15% distributor fee (75) and a 20% label share (85), 340 is left. Split 60/40, that is 204 and 136. The average is 340 / 150,000 = 0.002267 per stream, so to earn 100 as the 60% person you would need about 73,530 streams.

## FAQs

**Why is there no rate per stream?** Because the real figure changes each month and by service. Use the rates on your statements.

**Does this cover songwriting royalties?** No, only the recording side you receive through a distributor.

**Is anything saved?** No. It stays on your device, and nothing is stored.
