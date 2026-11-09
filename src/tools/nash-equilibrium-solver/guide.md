---
name: Nash equilibrium solver
num: 740
shelf: science
section: economics
title: "Nash equilibrium calculator for 2-player games: pure and mixed strategies, dominated strategies, best responses, zero-sum value"
summary: "Type in a two-player game of up to 6 × 6 strategies and get every Nash equilibrium, pure and mixed, with each player's payoff. Best replies are marked in the payoff table, dominated strategies are removed step by step, and zero-sum games get their value and the safest mixes. Matches nashpy."
status: live
ads: true
order: 740
icon: target
works: offline
updated: 2026-11-09
related: [reliability-analysis, uncertainty-calculator, sql-playground]
sources:
  - "Methods: Nash (1950) equilibrium; support and vertex enumeration as in Nisan, Roughgarden, Tardos and Vazirani (eds.), Algorithmic Game Theory (2007), chapter 3; von Neumann's minimax theorem solved as a linear programme. Classic textbook games (prisoner's dilemma, battle of the sexes, chicken, stag hunt, matching pennies, rock-paper-scissors) are common knowledge; no tables copied."
  - "Written by fibub. Checked in the tests against nashpy 0.0.43 (vertex enumeration) on textbook and random games up to 6 × 6, including degenerate ones, and against SciPy linprog for zero-sum values."
  - "The 3 × 3 example game is made up."
flow:
  - { icon: table, label: "Payoffs" }
  - { icon: check, label: "Best replies" }
  - { icon: target, label: "Equilibria" }
  - { icon: download, label: "Report" }
---

## What it does

In game theory a **Nash equilibrium** is a choice of strategies where no player can do better by changing only their own choice. This tool finds every equilibrium of a two-player game in which each player has 2 to 6 strategies (a "bimatrix" game), including the **mixed** ones, where players pick at random with set probabilities. It also:

- marks each player's **best responses** in the payoff table, so pure equilibria stand out;
- removes **dominated strategies** step by step (strategies that are always worse than another one);
- for **zero-sum** games (one player's gain is the other's loss), gives the **value** of the game and each player's safest (maximin) mix, by linear programming.

Everything runs in your browser.

## How to use it

1. Pick a classic game to start from, or set the number of strategies for each player and start from a blank table.
2. In each cell type the **row player's payoff, then the column player's payoff**, such as `3, 2`. Use a dot for decimals. Tick **Zero-sum** to type only the row player's payoff.
3. Rename the strategies in the header cells if you like.
4. Read the list of equilibria: what each player does (probabilities shown as fractions where they are simple) and the expected payoff of each. Download them as CSV, or the whole report as an image, PDF or Word file.

## How it works

For every possible support (the strategies a player uses with positive probability) the tool solves the equations that make the other player indifferent among their best replies, then keeps the solutions that are true probabilities with no better reply outside. Supports of every size are tried, which is the same as enumerating the vertices of the best-response polytopes, so the tool also finds the extreme equilibria of **degenerate** games (where some strategy has two equally good replies). For such games a note explains that mixtures of the listed equilibria can be equilibria too.

## Worked examples

**Battle of the sexes** (Opera 3, 2 / Football 2, 3): two pure equilibria, both at Opera (payoffs 3 and 2) or both at Football (2 and 3), and one mixed one where the row player chooses Opera with probability 3/5 and the column player with probability 2/5, giving each an expected 1.2.

**Prisoner's dilemma:** Quiet is strictly dominated by Confess for both players, so dominance alone solves the game: both confess.

**Rock, paper, scissors:** one equilibrium, each move with probability 1/3; the value is 0.

**Made-up 3 × 3 game:** three equilibria: Top / Right (2, 5), Middle / Centre (5, 4), and a mixed one with the row player on Top 1/3 and Middle 2/3 and the column player on Centre 1/3 and Right 2/3, paying 1.667 and 3.

## FAQ

**Why does the number of equilibria matter?** A non-degenerate game always has an odd number of equilibria. An even count signals a degenerate game.

**Is an equilibrium the best outcome?** No. In the prisoner's dilemma both players would prefer to stay quiet, but that is not an equilibrium.

**How large can the game be?** Up to 6 × 6; the tool checks every support pair, which takes a moment at most.
