---
name: Equipment booking planner
num: 812
shelf: science
section: lab-management
title: "Equipment booking planner: your instrument bookings in a week view, with clash check and .ics export"
summary: "Plan your own bookings on shared lab instruments in a week calendar. Repeat a booking every day, weekday, week, fortnight or month, see clashes at once, and export to your calendar app (.ics) or a spreadsheet (CSV). Your bookings stay in your browser."
status: live
ads: false
order: 812
icon: calendar
works: offline
updated: 2026-11-09
related: [reagent-inventory, plate-layout, shift-scheduler]
sources:
  - "Repeats, clash finding, the week layout and the .ics writer are written by fibub. The tests check the repeats against Python's icalendar and recurring_ical_events libraries reading the .ics file this page writes (150 random bookings, 3,023 occurrences, all the same), and the clashes against a brute-force pair check."
  - "iCalendar format: RFC 5545 (IETF), the open standard calendar apps read."
  - "The example week is made up. Your bookings are saved only in this browser (localStorage) and never uploaded."
flow:
  - { icon: pencil, label: "Book" }
  - { icon: calendar, label: "Week" }
  - { icon: check, label: "Clashes" }
  - { icon: download, label: ".ics, CSV" }
---

## What it does

If you use several shared instruments (a confocal on Monday morning, the flow cytometer every Tuesday, the plate reader most days) it is easy to book two things at once or forget a slot. This page is your own planner for those bookings:

- **Week view.** Your bookings for one week, Monday to Sunday, laid out by the hour. Overlapping bookings sit side by side. Overnight runs are drawn on both days.
- **Repeats.** Every day, every weekday (Monday to Friday), every week, every 2 weeks or every month on the same date. End a repeat after a number of times or on a date, and cancel single dates (a holiday, a service visit) without touching the rest.
- **Clash check.** A red booking means the same instrument is booked twice at the same time. An amber booking means you have two different instruments at once: fine for an unattended overnight run, worth a look otherwise. Back-to-back bookings (one ends at 10:00, the next starts at 10:00) are not clashes.
- **Export.** A .ics file for Google Calendar, Outlook or Apple Calendar, with the repeats and cancelled dates kept as calendar rules, and a CSV with one row per booking and a clash column.

It is a personal planner, not a shared booking system: nobody else sees your bookings. Use it to plan, then book the slots in your facility's own system, or send the .ics file to the instrument's owner.

## How to use it

1. Tap **Book an instrument**. Type the instrument (names you have used before are offered), what it is for, the date and the times. A *To* time before the *From* time means the booking runs overnight into the next day.
2. To repeat it, pick a repeat and either the number of times in all or a last date. Monthly repeats on the 29th, 30th or 31st skip months that do not have that date, as calendar apps do.
3. Move between weeks with the arrows, or pick any date to jump to its week. *This week* comes back to today.
4. Tap a booking (in the grid or the day-by-day list) to change it. For a repeat, *Cancel … only* drops just that date; *Delete* removes the whole series.
5. The **Clashes** box lists each clash in words. Download the .ics or CSV when you are happy, or the week as an image, PDF or Word file to pin up.

## Worked example

Tap *Load an example week*. It sets up six made-up bookings around the current week:

- Confocal microscope, Monday 09:00–12:00, every week, 4 times, and a one-off confocal booking on Monday 11:00–13:00. These clash from **11:00 to 12:00**, so both turn red and the Clashes box says "Confocal microscope is booked twice on Mon …, 11:00–12:00".
- Flow cytometer, Tuesday 14:00–16:00 every week, and a plate-reader endpoint read on Tuesday 15:30–16:00: an amber overlap of two different instruments.
- Plate reader every weekday 10:00–10:30 for 3 days from Wednesday (Wednesday, Thursday, Friday), plus a 08:30–09:45 run on Thursday that ends before the 10:00 slot: no clash.
- A qPCR run from Thursday 17:00 to Friday 09:00, drawn on both days, 16 hours.

The summary reads **9 bookings, 26.25 h booked, 1 instrument clash, 1 overlap**. Move the one-off confocal booking to 12:00–14:00 and the clash goes away.

## Your data

Bookings are saved automatically in this browser on this device and are never sent anywhere; the page works offline. Clearing browser data removes them, so use *Download backup (JSON)* now and then. *Open a backup* restores it (or moves it to another device), and *Clear all* removes everything from this browser.

## FAQ

**Which time zone are the times in?** Your own clock times. The .ics file uses "floating" times, so a 09:00 booking shows at 09:00 in any calendar, and repeats stay at 09:00 across daylight-saving changes.

**Can my whole group see my bookings?** No. Everything stays in your browser. Share the .ics or CSV file if others need it.

**Why not just use my calendar app?** You can, and the .ics export puts everything there. This page adds the clash check by instrument and a week that shows only your instrument time.
