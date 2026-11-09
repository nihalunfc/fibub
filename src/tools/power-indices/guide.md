---
name: Voting power indices
num: 752
shelf: science
section: political-science
title: "Shapley-Shubik and Banzhaf power index calculator for weighted voting (free)"
summary: "Measure who really holds power in a weighted vote [q; w1, …, wn]: exact Shapley-Shubik and Banzhaf indices for up to 60 players, swing and pivot counts, veto players and dummies, plus Deegan-Packel, Holler and Johnston for up to 20."
status: live
ads: true
order: 752
icon: sigma
works: offline
updated: 2026-11-09
related: [sample-size, plot-maker, uncertainty-calculator, voting-systems, polling-average, nash-equilibrium-solver, combinatorics-calculator]
sources:
  - "Formulas only: Shapley and Shubik (1954), Banzhaf (1965), Deegan and Packel (1978), Holler (1982), Johnston (1978); exact counting by generating functions (Brams and Affuso 1976). Example weights are made up."
flow:
  - { icon: table, label: "Weights" }
  - { icon: target, label: "Quota" }
  - { icon: sigma, label: "Indices" }
  - { icon: download, label: "Report" }
---

## What it does

In a council, shareholder meeting or coalition where members cast blocks of votes, power is not the same as weight. A party with 6 % of the seats can have exactly as much say as one with 12 %, and a party with 3 % can have none at all. This tool takes a **weighted voting game** — a list of players with weights and a **quota** that a coalition must reach to win — and works out the standard **power indices**:

- **Shapley-Shubik:** imagine players joining a coalition one at a time in every possible order. A player's index is the share of orders in which they are the one who tips the coalition over the quota (they are *pivotal*).
- **Banzhaf:** count each player's **swings**, the winning coalitions that would lose if that player left. The normalised index is the player's share of all swings; the **absolute** index is swings ÷ 2ⁿ⁻¹, the chance their vote decides the outcome when every coalition is equally likely.
- **Deegan-Packel** and **Holler (public good)** look only at *minimal* winning coalitions, where every member is needed. **Johnston** splits each winning coalition equally among its swing players.

Shapley-Shubik and Banzhaf are counted **exactly**, not sampled: the tool builds the generating function that counts coalitions by size and total weight, then removes each player in turn, so a 50-player game takes a fraction of a second. The three minimal-coalition indices list all 2ⁿ coalitions, so they appear for up to 20 players.

Count the ballots that elect the members with [[voting-systems|voting systems compared]], and explore strategic choices with the [[nash-equilibrium-solver]].

## How to use it

1. Type one player per line with a name and weight, or just the weights on one line.
2. Type the **quota**, as a number of votes or as a percentage of all weight (switching converts the number).
3. Read the table, the chart of power against weight (the dashed line is where power equals weight), and the list of minimal winning coalitions. Download the indices as CSV, or the full report as an image, PDF or Word file.

## Worked example

The made-up council has six parties with 34, 27, 18, 12, 6 and 3 seats, and a simple majority quota of 51 out of 100. Harbour (34 %) gets a Shapley-Shubik index of 0.4000: it is pivotal in 288 of the 720 orders. Valley and Ridge have quite different weights (27 and 18) but **the same power**, 0.2333, because each can make exactly the same majorities. Coast (12) and Forest (6) also tie at 0.0667, and Lake (3) is a **dummy** with zero power: no coalition ever needs it. The Banzhaf indices tell the same story (swings 20, 12, 12, 4, 4, 0; normalised 0.3846, 0.2308, 0.2308, 0.0769, 0.0769, 0). There are five minimal winning coalitions, such as Harbour + Valley.

## Frequently asked questions

**Which index should I report?** Shapley-Shubik suits questions about dividing a fixed prize among a coalition; Banzhaf suits the chance of being decisive in a single vote. They often agree on the ranking but not the size. Report the one your field uses, and say which.

**What is a veto player?** One without whom no coalition can win: the total of all the others is below the quota. With a quota at or under half the total the game is not "proper", and two separate coalitions could both win.

**Can I use decimals?** Yes. Weights and quota are scaled by a power of ten to whole numbers, which keeps the count exact.
