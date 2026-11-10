---
name: Expiry reminders
num: 2051
shelf: everyday
code: T934
section: reminders-travel
title: "Expiry reminders: passport, permit and licence expiry dates with calendar alerts"
summary: "List your passport, permits, licence, cards and insurance with their expiry dates, see days left and what to renew now, and download one calendar file with a reminder for each."
status: live
ads: false
order: 2051
icon: calendar
works: offline
updated: 2026-11-10
related: [date-calculator, bill-calendar, citizenship-days]
sources:
  - "Calendar file: iCalendar format, RFC 5545 (IETF), with one VEVENT and one VALARM per document."
  - "Suggested reminder times are fibub's own: many countries ask for a passport valid for 6 months after you arrive, and renewals often take weeks. Check the official source for each document."
flow:
  - { icon: pencil, label: "List" }
  - { icon: calendar, label: "Expiry" }
  - { icon: clock, label: "Days left" }
  - { icon: download, label: "Calendar" }
---

## What it does

Passports, permits, licences, cards and insurance policies all run out, often at a bad moment. This page keeps them in one list, sorted with the soonest expiry first, and shows the days left, the date to start renewing and a status: **OK**, **Renew now** (the reminder date has passed) or **Expired**.

You never type a document number: only the kind of document, a name of your own and the expiry date. One button makes a calendar file with an alarm for every document. Everything runs in your browser. To count the days to any date, use [[date-calculator]]; for monthly payments, try [[bill-calendar]].

## How to use it

1. Change the two example rows, or press **Clear the list** and start again.
2. Press **Add a document** for each one you want to track, and pick its expiry date.
3. Check the reminder time for each row.
4. Press **Download reminders (.ics)** and open the file in your calendar app.

## What each setting does

- **Kind**: picks a suggested reminder time: passport 6 months, visa or permit 4 months, ID or health card 3 months, driving licence 2 months, insurance and other 1 month.
- **Name**: your own label, such as "Ana's passport". Leave it empty to use the kind.
- **Remind me**: from 1 week to 12 months before the expiry date.
- **Remember my list in this browser**: off by default. When ticked, the list is kept in this browser only. **Delete saved list** removes it.

## Worked example

A passport expires on 1 March 2027 with a 6-month reminder: the page sets the reminder for **1 September 2026**. Seen on 10 November 2026, that date is past, so the passport shows 111 days left and **Renew now**. Car insurance ending on 15 January 2027 with a 1-month reminder gets 15 December 2026 and shows OK. The calendar file holds two events, each with its own alarm.

## FAQs

**Why 6 months for a passport?** Many countries will not let you in on a passport with less than 6 months left. Check the rules for where you are going.

**What does the calendar file add?** One all-day event on each expiry date, with an alarm at 09:00 on the reminder date.

**Is my list sent anywhere?** No. It is only saved, in this browser, if you tick the box.
