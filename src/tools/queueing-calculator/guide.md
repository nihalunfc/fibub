---
name: Queueing calculator
num: 584
shelf: science
section: operations-research
title: "Queueing calculator: M/M/1, M/M/c (Erlang C), Erlang B, M/M/c/K, M/G/1, staffing and simulation"
summary: "Average waits, queue lengths, utilisation and the chance of waiting for the standard queue models, how many servers or agents you need for a target wait, and a discrete-event simulation that checks the formulas. Runs in your browser."
status: live
ads: true
order: 584
icon: clock
works: offline
updated: 2026-11-09
related: [lp-solver, sample-size, plot-maker, shift-scheduler, distribution-explorer, agent-based-models]
sources:
  - "Formulas: the standard results of queueing theory (Erlang B and C, the M/M/c/K balance equations, Pollaczek-Khinchine), as in operations research textbooks."
  - "Checked against exact rational arithmetic in Python (fractions) for 60 random models of all six kinds, to 1 part in a billion; the simulation was checked against the formulas."
  - "The call centre example is made up."
flow:
  - { icon: pencil, label: "Rates" }
  - { icon: clock, label: "Waits" }
  - { icon: target, label: "Staffing" }
  - { icon: chart, label: "Simulate" }
---

## What it does

Queues are everywhere: calls waiting for an agent, patients at a clinic, jobs on a machine, cars at a toll booth. Queueing theory turns two numbers, how often people arrive and how long each one takes, into the things you care about: how long people wait, how many are waiting, and how busy the servers are. This calculator covers six classic models:

- **M/M/1**: one server, random arrivals, exponential service times.
- **M/M/c (Erlang C)**: several servers sharing one queue, such as a call centre or a bank.
- **M/M/c/K**: limited room; anyone arriving when K people are already there is turned away.
- **Erlang B (M/M/c/c)**: no waiting at all; a call that finds every line busy is lost.
- **M/M/∞**: nobody ever waits, such as shoppers browsing.
- **M/G/1**: one server with any service time spread, given its mean and standard deviation (the Pollaczek-Khinchine formula).

It also works out **staffing**, the fewest servers that meet a target such as "80 % of calls answered within 20 seconds" or "lose at most 1 % of calls", and runs a **simulation** of the same queue to compare with the formulas.

Turn the number of staff you need into a rota with the [[shift-scheduler|shift scheduler]], and explore arrival and service time distributions with the [[distribution-explorer|distribution explorer]].

## How to use it

1. Choose the model.
2. Type the arrival rate (for example 100 per hour) and the average service time (for example 3 minutes). The two units can differ; all results are given in the service time unit.
3. Type the number of servers c, and K or the service time standard deviation where the model needs them.
4. Set the staffing target, and the size and seed of the simulation.

## What the results mean

- **Utilisation ρ**: the share of time servers are busy. It must stay below 100 % or the queue grows for ever.
- **L and Lq**: the average number in the system, and the average number waiting.
- **W and Wq**: the average time in the system, and the average time waiting before service starts.
- **Chance of waiting**: the share of arrivals who find every server busy (Erlang C for M/M/c).
- **Offered load**: arrival rate × service time, in erlangs. You need more servers than this.

## Worked example

A help desk gets 100 calls an hour, each taking 3 minutes on average, with 6 agents. The offered load is 5 erlangs and utilisation is 83.33 %. The calculator gives a **58.75 %** chance of waiting, an average wait of **1.763 minutes**, 2.938 calls waiting on average and 7.938 in the system. For 80 % of calls answered within 20 seconds, 6 agents reach only 47.43 %, 7 reach 74.04 % and **8 agents** reach 88.01 %. The simulation of 100,000 calls lands close to the formulas, and its chart of the number in the system follows the formula's distribution.

## Things to know

The formulas describe the long-run average when the rates stay the same. Real arrivals change through the day, so work out each hour separately. Exponential service times are an assumption; M/G/1 shows how much a more even service time (a smaller standard deviation) cuts the wait. People who hang up while waiting (abandonment) are not modelled.

## Frequently asked questions

**Why is the wait so long at 95 % utilisation?** Waits grow very fast as utilisation nears 100 %: a little spare capacity buys a lot of waiting time.

**Is anything sent anywhere?** No. All the sums and the simulation run in your browser.
