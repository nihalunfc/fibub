---
name: Gantt chart
num: 823
shelf: science
code: T559
section: ethics-and-planning
title: "Gantt chart"
summary: "Type or open your project's tasks with starts, durations and dependencies, and get a Gantt chart with work packages, milestones, float and the critical path worked out for you. Download it as SVG, PNG, PDF or Word, and the schedule as CSV."
status: live
ads: false
order: 823
icon: calendar
works: offline
updated: 2026-11-09
related: [grant-budget, data-management-plan, plate-layout, project-scheduler, planner, equipment-booking]
sources:
  - "The forward and backward passes (critical path method) are written by fibub and checked in the tests against networkx 3.7 on 400 random task networks with lags, leads, fixed starts and milestones."
  - "The example project is made up."
flow:
  - { icon: table, label: "Tasks" }
  - { icon: link, label: "Links" }
  - { icon: target, label: "Critical" }
  - { icon: download, label: "Chart" }
---

## What it does

A Gantt chart shows a project's tasks as bars on a timeline. Grant applications often ask for one, by work package, with milestones. This page draws it from a plain list and also does the planning arithmetic, the **critical path method**:

- **Earliest start and finish** of every task, from its own start (if you give one) and the tasks it waits for.
- **Float** (slack): how many periods a task can slip without delaying the end of the project. The dashed line after a bar shows it.
- The **critical path**: the chain of tasks with no float. Any delay on it delays the whole project, so those bars are orange.
- **Milestones** (duration 0) are diamonds; **work packages** get a heading row with a bracket from their first start to their last finish.

Book the instruments the project needs with the [[equipment-booking|equipment booking planner]], and cost each work package in the [[grant-budget|grant budget builder]].

## How to use it

1. **Tasks.** One task per line: `ID, task, work package, start, duration, depends on`. For example `E, Main data collection, WP2 Data collection, , 8, M1` is an 8-period task that starts when milestone M1 is reached. You can open a CSV or Excel file with the same columns; a first line of column names is skipped.
2. **Start** is a period number (1 is the first period) or, once you set a **project start date**, a date such as 2027-03-01. Leave it empty to start as soon as possible. Instead of a duration you can give an **end** in a seventh column.
3. **Links.** List the IDs a task waits for, separated by spaces. Every link is finish-to-start. Add a lag after an ID: `F+2` waits 2 periods after F finishes; `E-1` may start 1 period before E finishes.
4. Choose **months, weeks or days**. Days count every calendar day.
5. Read the chart, the critical path and the table. *Download SVG* gives a vector chart for slides and papers; *Image*, *PDF* and *Word* make a report with the table; *Download CSV* saves the schedule with early and late starts and finishes, float and dates, and it can be opened here again.

## Worked example

The example is a made-up 2-year study in months with four work packages. Ethics approval (A, 3 months) and recruiting staff (B, 4 months) start in month 1; the survey tool (C) waits for B, and the pilot (D) waits for A and C. Data collection (E) runs 8 months after the pilot milestone; cleaning (F) starts one month before E ends (E-1); data sharing (I) waits 2 months after F (F+2).

The project lasts **28 months**. The critical path is **B → C → D → M1 → E → F → G → H → M2**. Ethics approval has **4 months of float**: it could take up to 7 months without delaying anything, while each extra month of recruiting moves the final report. Sharing the data has 5 months of float.

## Tips

- Keep IDs short (A, T1, 2.3) and give tasks plain names; the chart shortens long names.
- Put the tasks of a work package next to each other in your list; the chart groups them by work package anyway, in the order each first appears.
- A fixed start acts as "not before": a task still waits for the tasks it depends on.
- Use the float to plan: tasks with float are where people can move to help a critical task.

## FAQ

**What does "the tasks wait for each other in a loop" mean?** Two or more tasks depend on each other in a circle, so none can start. Remove one of the links.

**Can a task start when another starts (start-to-start)?** Not directly. Use a lead: `X-3` lets a task start 3 periods before X finishes.

**Are working days or holidays left out?** No: periods are calendar days, weeks or months. For a working-day plan, use weeks or count working days yourself.
