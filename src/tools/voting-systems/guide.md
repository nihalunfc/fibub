---
name: Voting systems compared
num: 751
shelf: science
code: T519
section: political-science
title: "Voting systems calculator: plurality, instant-runoff, Borda, Condorcet, Schulze, STV and D'Hondt (free)"
summary: "Count one set of ranked ballots by plurality, two-round, instant-runoff, Borda, Condorcet, Schulze and approval, run a multi-seat STV count, or share list seats by D'Hondt, Sainte-Laguë or largest remainder, with every round shown."
status: live
ads: true
order: 751
icon: check
works: offline
updated: 2026-11-09
related: [sample-size, plot-maker, data-cleaner, power-indices, polling-average, nash-equilibrium-solver]
sources:
  - "Formulas and counting rules only: Borda (1781), Condorcet (1785), Droop (1881), Gregory transfer method, Schulze (2011), D'Hondt (1878), Sainte-Laguë (1910), Gallagher (1991). Example ballots and vote counts are made up."
flow:
  - { icon: pencil, label: "Ballots" }
  - { icon: calculator, label: "Count" }
  - { icon: table, label: "Rounds" }
  - { icon: download, label: "Report" }
---

## What it does

The same voters can elect different winners depending on how the votes are counted. Type in ranked ballots once and this tool counts them by seven single-winner methods side by side: **plurality** (first past the post), the **two-round system**, **instant-runoff** (the alternative vote), the **Borda count**, the **Condorcet** head-to-head test, the **Schulze** beatpath method and **approval** voting. It also runs a **single transferable vote (STV)** count for several seats, and in the second tab shares out seats among **party lists** by D'Hondt, Sainte-Laguë (plain or modified) and largest remainder with a Hare or Droop quota, with a vote threshold. Every round and every transfer is shown in a table, so you can follow the count by hand. Nothing leaves your browser.

Measure how much each party's seats count in a coalition with [[power-indices|voting power indices]], and follow the polls before the vote with the [[polling-average]].

## How to use it

1. **Ranked ballots:** write one line per group of identical ballots: the number of voters, a colon, then names in order with ">" between them, for example `31: Ash > Dune > Elm`. Voters may rank only some of the names. Put a `|` after the last name a voter approves of, for approval voting; lines without one approve their first choices (the "Approve first choices" box). The optional `candidates:` line fixes the list order.
2. Set **Seats to fill** for the STV count.
3. **Party lists:** one party per line with its votes, the number of seats and the threshold as a percentage of all valid votes. Pick which method's seat-by-seat table to show; the summary table always shows all five.
4. Download the tables as CSV, or the whole report as an image, PDF or Word file.

## Exact rules used

- **Two-round:** a candidate with more than half the voters wins in round 1. Otherwise the top two meet, and each ballot counts for whichever of the two it ranks higher.
- **Instant-runoff:** drop the last-placed candidate each round until someone has more than half of the ballots still counting (exhausted ballots, with no names left, stop counting).
- **Borda:** with n candidates, 1st place scores n − 1, 2nd n − 2 and so on to 0; unranked names score 0.
- **Condorcet and Schulze:** a ranked name beats every unranked one; two unranked names are not compared. Schulze uses winning votes.
- **STV:** Droop quota = floor(valid ballots ÷ (seats + 1)) + 1. Surpluses move by the **weighted inclusive Gregory** method: every ballot the elected candidate holds moves on at its current value × surplus ÷ the candidate's total, and the share on exhausted ballots is lost. One surplus (the largest) moves per stage; otherwise the lowest candidate is excluded and their ballots move on at their current value. Values are not rounded.
- **Ties** are broken by the totals in the previous round (then earlier rounds), then by list order, and every broken tie is reported. Real election laws often use lots instead.

## Worked example

The made-up example has 100 voters and five candidates. **Ash** wins by plurality with 31 first preferences, but no one has a majority. The two-round run-off is Ash 38 v **Birch** 53, and instant-runoff also elects Birch after dropping Dune, then Cedar, then Elm. **Elm** is the Condorcet winner (beating everyone head to head, for example 69 to 31 against Ash) and also wins the Borda count with 247 points and the Schulze count. Approval goes to **Cedar** with 53 approvals. The two-seat STV count has a quota of 34 and elects Birch and Elm: Birch's surplus of 7 moves on at 7 ÷ 41 ≈ 0.171 of each ballot's value.

In the party tab, 10 seats with a 5 % threshold leave out Teal (3.4 %). D'Hondt gives Green 5, Blue 4, Red 1; Sainte-Laguë and Hare give Green 4, Blue 3, Red 2, Gold 1.

## Frequently asked questions

**Which method is best?** None is best in every way: Arrow's theorem shows that no ranked method meets every fairness test at once. The tables let you see how much the choice matters for your ballots.

**Why does D'Hondt favour big parties?** Its divisors grow slowly (1, 2, 3…), so a large party's later seats still have big quotients. Sainte-Laguë's divisors (1, 3, 5…) are fairer to small parties.

**Is this an official count?** No. Real elections have their own rules for ties, rounding of transfer values and spoiled ballots, so check the official rules. Use it for teaching, clubs and research.
