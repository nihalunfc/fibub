---
name: Mix planner
num: 3021
shelf: everyday
code: T1024
section: dj-mixing
title: "Mix planner: harmonic mixing order for a DJ set by key and BPM"
seoTitle: "Harmonic mixing planner: order a DJ set by key and BPM"
summary: "Type or import a track list with BPM and key, pick a start track and an energy shape, and get a running order where each mix blends in key and the tempo moves in small steps, with the path on the key wheel. Nothing is uploaded."
status: live
ads: false
order: 3021
icon: compass
works: offline
updated: 2026-11-18
related: [track-analyser, bpm-key-finder, dj-set-planner, bpm-shifter]
sources:
  - "Key moves follow the widely published circle-of-fifths mixing wheel (8A = A minor, 8B = C major); fibub is not affiliated with the owners of the Camelot or Open Key names. The scores, the BPM penalty and the energy shapes are fibub's own, set out on this page."
flow:
  - { icon: pencil, label: "Tracks" }
  - { icon: sliders, label: "Shape" }
  - { icon: compass, label: "Order" }
  - { icon: download, label: "CSV or M3U" }
---

## What it does

Harmonic mixing means playing songs in an order where each one is in a key that sounds good against the one before. This planner takes your track list (title, BPM and key) and finds a running order that keeps every mix in a friendly key, keeps tempo jumps small and, if you like, builds the energy up or peaks in the middle. It shows the kind of each mix and draws the path round the key wheel.

Get the BPM and key of your files first with the [[track-analyser]] and import its CSV, or check one song with the [[bpm-key-finder]].

## How to use it

1. Type one track per line as **title, BPM, key**, or press **Import a CSV**.
2. Choose the **Start with** track and an **Energy shape**.
3. Read the order, the label on each mix and the wheel path.
4. Download the order as a CSV or an M3U8 playlist.

## What each setting does

- **Energy shape**: Steady looks only at keys and tempo. Build up places calmer tracks first; Peak in the middle puts the strongest in the middle. It uses the energy column when every track has one, otherwise the BPM.
- **Largest BPM jump** (More options): bigger jumps are used only when nothing else fits, and are marked risky.
- **Allow moving a track one semitone**: lets a track be played a semitone up or down to fit.

Each mix scores: same key 100; one step on the wheel or relative major or minor 90 (perfect); diagonal step 75 and +2 energy boost 70 (good); +7 or −7 (a semitone up or down) 55 and 50 (mood change); anything else up to 40 (risky). Each BPM of jump takes off 3 points.

## Worked example

The sample list, starting from Opening Pad (122 BPM, 8A) on Steady, plays 8A → 10A → 9A → 9B → 8B → 3B: 3 perfect mixes, 1 energy boost and 1 mood change. Tick the semitone box and Deep Roller (3B) moves down to 8B, so all five mixes are perfect.

## FAQs

**Does it find the best possible order?** It searches many orders at once (a beam search), which finds a very good one quickly, though not always the single best.

**What if a key is missing?** The track is still placed by its BPM, and its mixes are marked "unknown key".
