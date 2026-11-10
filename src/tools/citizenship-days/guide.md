---
name: Citizenship days
num: 2049
shelf: everyday
code: T932
section: immigration
title: "Citizenship days: Canada physical presence calculator for 1,095 days"
summary: "Count your days in Canada for citizenship: 1,095 days in the last 5 years, half-day credit for time before PR, trips subtracted, and the earliest date you can apply."
status: live
ads: false
order: 2049
icon: calendar
works: offline
updated: 2026-11-10
related: [crs-calculator, tax-residency-days]
sources:
  - "IRCC, Check if you are eligible to apply for citizenship, https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-citizenship/adult-minor/who/check-adult-eligibility.html (modified 2025-09-11, checked 2026-11-10): 1,095 days in the 5 years before applying; temporary resident or protected person days before PR count as half days, up to 365."
  - "IRCC, Physical presence calculator form CIT 0407, https://www.canada.ca/content/dam/ircc/documents/pdf/english/kits/forms/cit0407/01-05-2019/cit0407e.pdf (checked 2026-11-10): only full days outside Canada are absences; the signing date is not counted. fibub is not affiliated with IRCC: check the official source."
flow:
  - { icon: calendar, label: "PR date" }
  - { icon: pencil, label: "Add trips" }
  - { icon: calculator, label: "Count days" }
  - { icon: check, label: "Apply date" }
---

## What it does

To apply for Canadian citizenship as an adult you need at least 1,095 days of physical presence in Canada in the five years before you apply. Days as a permanent resident count in full. Days you spent in Canada as a temporary resident (visitor, student or worker) or protected person before becoming a PR count as half days, up to 365 days of credit. This tool counts them, takes off your trips and shows the earliest date to apply.

Rules from IRCC's eligibility page and paper calculator (form CIT 0407), checked 10 November 2026. fibub is not affiliated with IRCC; you must use IRCC's own calculator when you apply, so check the official source. For tax years use [[tax-residency-days]]; if you are not a PR yet, start with the [[crs-calculator]].

## How to use it

1. Enter the date you became a permanent resident.
2. If you lived in Canada with temporary status before that, enter the date it started.
3. Add each trip outside Canada, including planned ones.
4. Read the earliest date, or set "Count my days on" to check another date.

## What each setting does

- **PR date**: from here on, each day in Canada counts in full.
- **Temporary resident from**: days from this date to the day before your PR date count as half days, up to 365.
- **Count my days on**: the date you would sign. Only the five years before it count, and that day itself does not.
- **Trips**: only full days away count; the day you left and the day you came back count as days in Canada.

## Worked example

You became a PR on 1 January 2023, have no time before that and no trips. The earliest date to apply is **31 December 2025**: from 1 January 2023 to 30 December 2025 is exactly 1,095 days. Add 400 days in Canada as a student before PR and they give 200 days of credit, so you could apply on 14 June 2025. A trip from 1 to 6 July 2024 is 4 full days away and moves the first case to 4 January 2026.

## FAQs

**Is physical presence the only rule?** No. IRCC's eligibility page lists the other requirements, such as tax filing and language.

**Does it ask for my UCI or passport number?** No, only dates, which stay on your device.
