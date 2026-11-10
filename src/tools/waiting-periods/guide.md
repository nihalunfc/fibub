---
name: Health insurance waiting period timeline
num: 2102
shelf: money
code: T879
section: health-insurance
title: "Health insurance waiting period timeline: when does cover start?"
summary: "Type your policy start date and waiting periods to see on a timeline when each condition is covered, with a box for months already served on an older policy."
status: live
ads: false
order: 2102
icon: calendar
works: offline
updated: 2026-11-10
related: [policy-fine-print, insurance-terms, room-rent-cap, super-top-up]
sources:
  - "India: IRDAI (Protection of Policyholders' Interests) health insurance master circular, 2024. Waiting periods for pre-existing and specific diseases are capped at 36 months, the initial waiting period at 30 days (not for accidents), and after 60 months of continuous cover a claim cannot be contested except for fraud (the moratorium). Months already served on a policy you port count towards waiting periods, up to the old sum insured. Maternity waiting periods are each insurer's own. Checked 2026-11-10, check the official source (irdai.gov.in)."
  - "US and Canada dental: plans set their own waiting periods for basic and major work, so you type the months from your plan booklet."
flow:
  - { icon: calendar, label: "Start date" }
  - { icon: sliders, label: "Waits" }
  - { icon: chart, label: "Timeline" }
  - { icon: check, label: "Covered?" }
---

## What it does

A new health policy often does not pay for everything from day one. Some conditions have a waiting period, and a claim made before it ends can be refused. This tool puts your waiting periods on one timeline, starting from the policy start date, and tells you for each one whether you are covered now, from which date, or in how many days.

It also marks the moratorium, the point after 60 months of continuous cover when an insurer can no longer contest a claim except for fraud. If you moved from an older policy, tick the box and say how many months you had already served. To read the other terms in your policy, see [[policy-fine-print]] and [[insurance-terms]].

## How to use it

1. Choose India health or US and Canada dental.
2. Enter the policy start date. Change the waiting times to the ones in your policy: the numbers shown are example numbers, change them to yours.
3. If you ported from an older policy, tick the box and type the months already served.
4. Read the timeline and the list under it.

## What each setting does

- **Waiting time**: a number of days or months from the start date.
- **Ported from an older policy**: months already served count towards each waiting period, up to the old sum insured. The extra cover above the old sum insured starts its waits afresh.
- **Moratorium**: the date after which claims cannot be contested except for fraud.
- **Maternity**: every insurer sets its own wait, so type yours.

## Worked example

Start 2026-01-01. A 30-day wait ends 2026-01-31. A 36-month wait ends 2029-01-01. If you ported with 12 months served, the 36-month wait ends 2028-01-01.

## FAQs

**Do waits apply to accidents?** The initial 30-day wait does not apply to accidents.

**Is the date exact?** It counts calendar months from your start date. Your insurer's wording rules.

**Is my date saved?** No, nothing leaves this page.

How it's worked out: end date = start date plus the waiting time, minus the months you already served if ported (never before the start date).
