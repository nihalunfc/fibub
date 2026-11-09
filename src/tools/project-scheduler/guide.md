---
name: "Project scheduling: CPM, PERT and Gantt"
num: 585
shelf: science
section: operations-research
title: "Project scheduler: critical path (CPM), float, PERT chance of finishing on time and a Gantt chart"
summary: "List your tasks, durations and predecessors (finish-to-start, start-to-start, finish-to-finish, with lags) and get the critical path, earliest and latest dates, float, a Gantt chart, and with three-point estimates the PERT chance of finishing by a date, checked by simulation. Runs in your browser."
status: live
ads: true
order: 585
icon: calendar
works: offline
updated: 2026-11-09
related: [lp-solver, queueing-calculator, plot-maker]
sources:
  - "Methods: the critical path method, PERT three-point estimates and the beta-PERT distribution, as in project management and operations research textbooks."
  - "Checked against a longest-path calculation in Python (networkx Bellman-Ford on the start and finish events) for 1,200 random projects, half with SS, FF and SF links and lags, and the PERT figures against SciPy's normal distribution and a NumPy beta-PERT simulation."
  - "The example project is made up."
flow:
  - { icon: table, label: "Tasks" }
  - { icon: link, label: "Links" }
  - { icon: target, label: "Critical" }
  - { icon: chart, label: "Gantt" }
---

## What it does

Every project has a chain of tasks that sets its length: the **critical path**. Delay any task on it and the whole project slips; tasks off it have **float**, time they can slip without harm. This tool works it out from a simple table of tasks:

- a **forward pass** (earliest start and finish) and a **backward pass** (latest start and finish);
- **total float** and **free float** for every task, and the critical path;
- links of all four kinds, **finish-to-start**, **start-to-start**, **finish-to-finish** and **start-to-finish**, each with a **lag** (or a lead, a negative lag);
- a **Gantt chart**, with optional calendar dates that skip weekends;
- with three-point estimates, **PERT**: the expected duration, its standard deviation and the **chance of finishing by a date**, plus a **Monte Carlo simulation** that checks it.

## How to use it

1. Type or paste one row per task, or open a CSV or Excel file. A header row names the columns: **ID**, **Task**, **Duration** and **Predecessors**. For PERT, use **Optimistic**, **Most likely** and **Pessimistic** instead of Duration.
2. Write predecessors as IDs with spaces between them: `B C`. `A+2` waits 2 days after A finishes; `A SS` starts when A starts; `A FF+1` finishes at least 1 day after A finishes; `A SF` finishes after A starts.
3. Choose the time unit, and a start date if you want calendar dates.
4. For PERT, type the time you must finish within.

## Worked example

The first example is a small building project with three-point times. Each task's PERT duration is (o + 4m + p) / 6; for "Draw the plans" (4, 6, 10 days) that is 6.333 days, with a standard deviation of (10 − 4) / 6 = 1 day. The schedule takes **30.5 days**, along the critical path **A → C → E → G → H → I**. "Survey the site" (B) and "Prepare the site" (F) have 4.833 days of float, and "Order materials" (D) 3.833.

The variances along the critical path add up to 5.75, a standard deviation of 2.398 days. The chance of finishing within 32 days is therefore Φ((32 − 30.5) / 2.398) = **73.4 %**, and you can be 90 % sure of finishing within 33.57 days. The simulation of 5,000 projects gives 73.5 % and 33.81 days: a little later at the 90 % mark, as simulation usually is, because near-critical paths sometimes take over.

The second example uses single durations with a start-to-start lag (E starts 2 days after C starts) and a finish-to-finish lag (H finishes at least 1 day after G); the project then takes 22 days.

## Things to know

- Tasks are scheduled as early as possible, from day 0, with unlimited resources. Resource levelling is not done.
- With a start date and working days only, day 0 is the first working day on or after the start date; finish dates are the last working day of each task.
- Up to 2,000 tasks. The Gantt chart shows the first 150 by start.

## Frequently asked questions

**What if my predecessors form a loop?** The tool names the loop, such as B → D → B, so you can remove a link.

**Is my plan uploaded?** No. Everything is worked out in your browser and nothing is stored.
