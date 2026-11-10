---
name: Timestamp converter
num: 2007
shelf: everyday
code: T855
section: dev-text
title: "Timestamp converter: Unix epoch time to date and back, in any time zone"
summary: "Turn a Unix timestamp in seconds or milliseconds into a readable date in UTC, your own time and any time zone, with ISO 8601 and RFC 2822 forms and how long ago it was. Or turn a date back into a timestamp."
status: live
ads: false
order: 2007
icon: clock
works: offline
updated: 2026-11-10
related: [time-zone-planner, uuid-generator, jwt-decoder]
sources:
  - "Unix time as in POSIX (IEEE Std 1003.1); date formats from ISO 8601 and IETF RFC 2822; time zone rules from the IANA tz database built into your browser. fibub's own working."
flow:
  - { icon: pencil, label: "Timestamp" }
  - { icon: convert, label: "Convert" }
  - { icon: calendar, label: "Date" }
---

## What it does

A Unix timestamp counts the seconds since midnight UTC on 1 January 1970. Logs, databases and APIs store dates this way: one number, no time zone. This page turns that number into dates people can read, and turns a date back into a number.

It uses your device's clock and the time zone rules built into your browser, and sends nothing anywhere. Version 7 IDs from the [[uuid-generator]] carry a millisecond timestamp you can read here.

## How to use it

1. Type or paste a timestamp in the top box, or press **Now** for the current time.
2. Pick a time zone under **Also show in** to add that zone's time to the table.
3. To go the other way, pick a date and time under **Date to timestamp** and say which zone that time is in.

**Clear** empties both boxes.

## What each setting does

- **Unit**: **Auto** reads 11 digits or fewer as seconds and 12 or more as milliseconds (today's times are 10 digits in seconds, 13 in milliseconds). Choose **Seconds** or **Milliseconds** to override it. Spaces and commas are ignored; negative numbers are before 1970.
- **Also show in**: any IANA time zone your browser knows, such as Asia/Kolkata or America/Toronto. The table shows the wall time there and its offset from UTC, including daylight saving.
- **This time is in**: whether the date you picked is UTC, your own zone, or the zone chosen above.

The table gives Unix seconds and milliseconds, ISO 8601 in UTC, RFC 2822 (the email date format), the time in UTC, in your zone and in the chosen zone, and a relative time such as "3 days ago". Months in the relative time count as 30.4 days.

## Worked example

Type 1700000000. It is read as seconds (10 digits) and shows ISO 8601 `2023-11-14T22:13:20Z` and RFC 2822 `Tue, 14 Nov 2023 22:13:20 +0000`. In Asia/Kolkata (UTC+05:30) that is 03:43:20 on 15 November.

Type 1700000000000 instead: Auto sees 13 digits, reads it as milliseconds, and shows the same moment.

Going back, 2023-11-14 22:13:20 in UTC gives 1700000000. The same wall time in Asia/Kolkata gives 1699980200, which is 19,800 seconds (5 hours 30 minutes) earlier.

## FAQs

**Does it count leap seconds?** No. Unix time skips them, as computers do.

**What about the year 2038 problem?** It affects programs that store seconds in 32 bits. This page does not, so dates past 2038 work.
