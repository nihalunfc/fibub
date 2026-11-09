---
name: Shift scheduler
num: 174
shelf: everyday
title: "Free shift scheduler for small and large teams: weekly or monthly rota as Excel, Word, PDF or image"
summary: "Make a weekly or monthly staff rota for a team of 5 or 500. List your staff, set your shifts, press Fill and adjust by tapping. Download it as an editable Excel or Word file, a PDF or an image with the columns you choose. No sign-up, nothing uploaded."
status: live
ads: false
order: 4
icon: calendar
works: offline
updated: 2026-11-09
related: [planner, time-zone-planner, gantt-chart, equipment-booking]
sources:
  - "Scheduling rules and the fill method are fibub's own: fewest hours first, no work on days off, weekly hour limits and an 11-hour rest between shifts. 11 hours is a common default, not the law where you are; check the official source for your area."
  - "Example teams are made up: invented first names, departments and hours."
flow:
  - { icon: pencil, label: "List staff" }
  - { icon: clock, label: "Set shifts" }
  - { icon: calendar, label: "Fill a week" }
  - { icon: download, label: "Download" }
---

## How to make a schedule

1. **Pick your team size.** *Under 20 staff* keeps everyone on one schedule. *20 to 100* adds departments, each filled and counted on its own. *Over 100* shows one department at a time and downloads every department as its own page or sheet. The page starts with a made-up example for each size, so you can see how it works before typing anything.
2. **List your staff**, one person per line. Only the name is needed. After it you can add, in any order and separated by commas, a department, the most hours someone works a week and their days off: `Ava, Kitchen, 32, Sat Sun`. For a big team, press **Open a staff list** and pick a CSV or Excel file with the same columns.
3. **Set your shifts.** Each shift has a name, a short code for the grid, a start and end time, and how many people it needs each day. A shift can run past midnight (23:00 to 07:00). With departments, the number is for every department; type `2, Kitchen 3, Security 1` when some need a different number, or `Kitchen 3` for a shift only one department uses.
4. **Choose a week or a month** and a start date. Weeks start on Monday unless you pick Sunday.
5. **Press Fill empty days.** The page puts people on shifts so each one has enough people, then you change anything by tapping a cell.
6. **Download** it as an image, a PDF, an editable Excel workbook or an editable Word document.

For your own week and month rather than a team's, use the [[planner|weekly and monthly planner]].

## What Fill does

Fill only touches empty cells, so anything you set by hand stays. For each day, department and shift it picks the free person with the fewest hours so far, which shares the work out. It never puts someone on a day off, never goes over their hours for the week, never gives anyone two shifts on one day, and always leaves at least 11 hours between the end of one shift and the start of the next. When nobody is free, the cell stays empty and a note under the schedule says which day and shift is short, so you can call someone in or change a limit. Eleven hours of rest is a common default, but labour rules differ by country, province and state, so check the official source for your area.

## Choosing what the download shows

Under **Download** you choose the columns: department, hours, number of shifts, an extra empty column such as *Signature*, and the "people per shift" rows at the bottom that show coverage. Untick days you're closed to drop them. Cells can show the shift name, its code or its times, with or without colours. The preview updates as you change these, and every download matches it. The Excel file has a sheet per department with names and days frozen in place, so you can keep editing it; the Word file and PDF are landscape A4 with a page per department.

## Worked example

A café has 8 staff, open every day with a Morning shift (07:00 to 15:00) and an Evening shift (15:00 to 23:00), two people on each. That is 28 shifts of 8 hours, or 224 hours a week. Ava is off on Sundays, Dev can only do 24 hours. Pressing Fill gives every shift its two people, with most people on 3 or 4 shifts (24 or 32 hours), nobody working an Evening followed by the next day's Morning (only 8 hours' rest), and both bottom rows showing 2 every day.

## FAQ

**Is my staff list uploaded?** No. Everything runs in your browser and nothing is sent anywhere. If you tick *Remember my schedule on this device*, it is kept in this browser only, and *Clear saved data* removes it.

**Can I change a person's hours for one week?** Change the number in the staff list; it applies to every week shown.

**Does a monthly schedule check weekly hours?** Yes, it checks each week inside the month separately.
