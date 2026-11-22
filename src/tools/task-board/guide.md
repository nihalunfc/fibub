---
name: Daily task board
num: 3090
shelf: money
code: T1071
section: small-business
title: "Daily task board: share today's tasks fairly between the people on shift"
summary: "Splits a day's tasks fairly across the people on shift, keeps each person in one area, puts urgent and due-soon tasks first, and tracks each one until it is done."
status: live
ads: false
order: 3090
icon: sliders
works: offline
updated: 2026-11-22
related: [labour-productivity, shift-scheduler, daily-close, demand-forecaster]
sources:
  - "Fibub's own simple rules: the person who is free first takes the task that suits best, weighing urgency and due time, the area they know and are already in, and whether it fits their shift. It is a fair first plan, not a mathematical optimum."
  - "The example tasks and names are made up."
flow:
  - { icon: table, label: "Tasks" }
  - { icon: sliders, label: "People" }
  - { icon: curve, label: "Board" }
  - { icon: check, label: "Tick off" }
---

## What it does

Every supervisor has the same morning problem: a list of jobs, a team on shift, and no time to work out who should do what. This board does it for you. Enter the day's tasks with their minutes, area and any due time, enter who is working and when, and it gives each person an ordered list with a start and finish time. Urgent and due-soon tasks come first, each person stays in one area where possible so they are not walking between floors or aisles, and the work is spread so nobody is overloaded while someone else waits.

It suits hotel housekeeping, shop restocking, cleaning rounds, maintenance work orders, deliveries and any team that gets a list each day. The board shows the load on each person, flags tasks that would finish after their due time or after the shift ends, and lets you tick tasks off as they are done. If the day changes, press Reassign and the tasks left are rebuilt from the time you choose. To work out how many people you need in the first place, use the [[labour-productivity]] tool, and to plan the rota for the week the [[shift-scheduler]]; the [[daily-close]] helper then wraps up the day.

## How to use it

1. **Step 1:** pick an example or type, paste or open your own tasks: name, area, minutes, urgent, due by.
2. **Step 2:** add the people on shift with their start and end times and the areas they know best. Set the minutes to move between areas and the length of the break.
3. **Read the board.** Each person has a card with the order to work in. Tick tasks as they are done.
4. **If the day changes,** edit the people or tasks, choose the time, and press Reassign what is left. Download the board as a CSV or print it.

## What each setting does

- **Minutes to move between areas**: added when a person changes area; it also makes the board prefer to keep people where they are.
- **Break**: taken in the middle of each shift.
- **Urgent**: the task is given out earlier. **Due by**: the board flags it as late if it would finish after this time.
- **Remember my tasks and people**: off by default. When ticked, they stay in this browser only; there is a Clear button.

## Worked example

Two people work 08:00 to 12:00 with no break. There are four tasks of 30 minutes in the same area. The first free person takes the first task, then the second person the next, so each gets two tasks: one from 08:00 to 08:30 and one from 08:30 to 09:00. Each is busy for 60 of 240 minutes, a load of 25%, and the gap between the busiest and lightest person is zero.

## FAQs

**Is the plan the best possible?** No. It is a fair first plan from simple rules. Use your own judgment for special cases, and change anything by editing the lists.

**Can someone work a night shift?** Shifts must end after they start on the same day.

**What does late mean?** The task would finish after its due time. Move it, add a person or shorten it.

**Are my tasks uploaded?** No. Everything runs on your device, and nothing is saved unless you tick the box.

**What if nobody knows an area?** Leave the areas blank for any person, or add the area to someone's list.
