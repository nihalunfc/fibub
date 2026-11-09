---
name: Breeding calendar
num: 398
shelf: science
section: animal-science
title: "Breeding calendar: due date, pregnancy check and next heat dates for cows, ewes, goats, sows, mares, dogs, cats and rabbits"
summary: "Type a mating date and get the expected due date with its window, the day for a pregnancy check and the dates to watch for heat if she does not hold. Paste a list of matings for a whole herd or flock and download it as a table (CSV) or calendar events (.ics). Nothing is uploaded."
status: live
ads: true
order: 398
icon: calendar
works: offline
updated: 2026-11-09
related: [feed-ration-balancer, planner, bill-calendar]
sources:
  - "Gestation and oestrous cycle lengths are general husbandry facts, rounded by fibub (for example cow about 283 days, ewe 147, sow 114, mare 340, goat 150, dog 63, cat 65, rabbit 31; a 21-day cycle in cattle, pigs, horses and goats and 17 days in sheep). They are editable."
  - "Calendar files follow the iCalendar standard, RFC 5545 (all-day events, lines folded at 75 octets)."
  - "Dates checked against Python datetime arithmetic, including leap days and year ends; the .ics file was read back with the Python icalendar library. The example animals and dates are made up."
flow:
  - { icon: pointer, label: "Species" }
  - { icon: calendar, label: "Mating date" }
  - { icon: clock, label: "Due date" }
  - { icon: download, label: "Calendar" }
---

## What it does

When an animal is mated or inseminated, a few dates follow from it: when to check whether she is pregnant, when she would come back into heat if she did not hold, and when she is due. This calendar works them out for one animal or a whole list, for cows, ewes, goats, sows, mares, dogs, cats and rabbits, or any species you set up yourself.

For each mating you get:

- **Expected due date**: the mating date plus the typical gestation length, with a **due window** either side, because births are rarely on the exact day.
- **Pregnancy check**: the day after mating you choose for a scan, palpation or test.
- **Heat dates**: the dates one, two or three cycles after mating, to watch for a return to heat if she is not pregnant.

Feed the animals through pregnancy with the [[feed-ration-balancer]], and follow the young with the [[growth-curve-tracker|growth curve tracker]].

## How to use it

1. Pick the species. Its typical, rounded figures fill the boxes: gestation, the window either side of the due date, the length of the heat cycle and the day for the pregnancy check. Change any of them to suit your breed or your vet's advice; **Back to the typical figures** undoes your changes.
2. For one animal, pick the mating date. The due date, window, check and heat dates appear straight away, with the day of the week.
3. For a herd or flock, paste or type one mating per line: the animal's name or tag, the date (2026-03-14 or 14 Mar 2026), and if you like the species. **Open a file** reads a CSV or Excel sheet with those columns.
4. Read the table (sorted by due date) and the list of every date in order, then download the table as CSV or the dates as an **.ics** file that any calendar app can import.

## Worked example

Press **Use the example**. It loads four made-up matings: two cows, a ewe and a sow. The calendar says "4 matings, first due Thu 22 Oct 2026".

Daisy 214, a cow mated on 2026-01-12, is checked on 2026-02-16 (day 35), should be watched for heat on 2026-02-02 and 2026-02-23 (days 21 and 42), and is due on **2026-10-22**, in a window from 2026-10-12 to 2026-11-01 (283 days ± 10). Ewe 18, mated on 2026-09-20, is due on 2027-02-14 after 147 days, with heat dates 17 days apart. Sow 7, mated on 2026-10-01, is due on 2027-01-23: the old "3 months, 3 weeks and 3 days" rule.

## Tips

- Dogs come into heat about every 6 months, so their "cycle" is set to 180 days. Rabbits ovulate when mated and have no regular cycle, so no heat dates are given for them.
- For a mare, many owners count 340 days but foals often come between 320 and 360 days, hence the wide window.
- If you inseminated twice, use the last date, or add both lines.

## FAQ

**Are these figures exact?** No. They are typical, rounded figures; breed, litter size, season and the individual all matter. This tool is for study and planning, not a substitute for professional judgement: ask your vet.

**Does the calendar file keep my animals' names anywhere?** Only in the file you download. Nothing is uploaded; everything runs in your browser and works offline.
