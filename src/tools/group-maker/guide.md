---
name: Group maker
num: 2045
shelf: everyday
code: T928
section: classroom
title: "Random group maker and name picker for classes and teams"
summary: "Paste a list of names to split them into random, balanced groups by number of groups or people per group, or pick names one at a time with no repeats. Copy or print the groups."
status: live
ads: false
order: 2045
icon: table
works: offline
updated: 2026-11-10
related: [planner, rubric-grade-calculator, study-timer, classroom-timer]
sources:
  - "Fisher–Yates shuffle using the browser's crypto.getRandomValues; balanced group sizes. fibub's own working."
flow:
  - { icon: pencil, label: "Names" }
  - { icon: sliders, label: "Group size" }
  - { icon: table, label: "Groups" }
---

## What it does

Teachers, coaches and team leads often need fair, random groups or a random name for the next question. Paste your list of names and this page shuffles them into groups that are as even as possible, or picks one name at a time. It uses your browser's secure random numbers, so every order is equally likely.

Names stay on this page unless you choose to remember them. To plan the lesson around it, use the [[planner|weekly planner]], and to mark the group work afterwards, try the [[rubric-grade-calculator]].

## How to use it

1. Type or paste the names, one per line or separated by commas. An example class of 10 is filled in.
2. In **Make groups**, choose how to split them and type the number. The groups appear straight away.
3. Press **Shuffle again** for a new mix, then **Copy groups** or **Print**.
4. In **Pick a name**, press **Pick a name** each time you need someone.

## What each setting does

- **Number of groups**: makes exactly that many groups. Sizes differ by at most one, and the bigger groups come first.
- **People per group**: makes as many groups as needed so no group has more than that number (names ÷ size, rounded up), then evens out the sizes.
- **Remove picked names**: ticked, nobody is picked twice until you press **Put everyone back**. Unticked, anyone can come up again.
- **Remember this list**: off by default. Ticked, the list is kept in this browser only, for next time. **Forget saved list** deletes it.
- **Print** prints only the groups.

## Worked example

Ten names into 3 groups: 10 ÷ 3 is 3 with 1 left over, so one group gets 4 and two get 3 (4, 3, 3). With **People per group** set to 4, 10 ÷ 4 rounded up is 3 groups, and evening them out gives 4, 3, 3 again rather than 4, 4, 2. Picking names with **Remove picked names** ticked gives all 10 names once each, then says everyone has been picked.

## FAQs

**Is it really random?** Yes. Each shuffle uses crypto.getRandomValues, the same source browsers use for security.

**Can I keep two people apart?** Not yet. Press **Shuffle again** until you are happy with the mix.

**Are duplicate names merged?** No. Each line counts as one person, so add a surname initial to tell two people apart.
