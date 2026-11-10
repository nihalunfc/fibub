---
name: UUID generator
num: 2006
shelf: everyday
code: T854
section: dev-text
title: "UUID generator: make random v4 and time-ordered v7 UUIDs, and check one"
summary: "Make 1 to 500 UUIDs at once, random (version 4) or time-ordered (version 7), in upper or lower case, with or without hyphens. Copy or download them, or paste a UUID to see if it is valid and which version it is."
status: live
ads: false
order: 2006
icon: copy
works: offline
updated: 2026-11-10
related: [timestamp-converter, regex-tester]
sources:
  - "UUID layout, versions and variant: IETF RFC 9562 (2024), which replaced RFC 4122. fibub's own working."
flow:
  - { icon: sliders, label: "Version" }
  - { icon: copy, label: "Generate" }
  - { icon: download, label: "Copy" }
---

## What it does

A UUID (universally unique identifier, also called a GUID) is a 128-bit label written as 32 hex digits in five groups, like `f47ac10b-58cc-4372-a567-0e02b2c3d479`. Programs use them as IDs because anyone can make one without a central list, and two will almost never match.

This page makes them with your browser's secure random number generator and checks UUIDs you paste in. Nothing is sent or stored. A version 7 UUID carries the time it was made; read such times with the [[timestamp-converter]], and pull UUIDs out of a log with the [[regex-tester]].

## How to use it

1. Pick a version and how many you want (1 to 500). A list appears at once.
2. Tick UPPER CASE or No hyphens if the place you paste them into needs that.
3. Press **Copy all** or **Download .txt** (one UUID per line). **Generate new** makes a new list; **Clear** empties it.
4. To check one, paste it under "Check a UUID".

## What each setting does

- **v4: random**: 122 random bits. The usual choice.
- **v7: time-ordered**: starts with the time in milliseconds since 1970, then random bits, so a list sorts in the order it was made.
- **UPPER CASE**: changes a-f to A-F. Both mean the same.
- **No hyphens**: writes the 32 digits without dashes.
- **Check a UUID**: accepts hyphens, no hyphens, braces `{...}` or `urn:uuid:`. It reads the version digit (the first digit of the third group) and the variant digit (the first of the fourth group, which must be 8, 9, a or b). For a version 7 UUID it also shows when it was made, in UTC.

## Worked example

Make 10 v4 UUIDs: all 10 are different, each has 4 as the first digit of its third group and 8, 9, a or b as the first digit of its fourth. Switch to v7: the third group now starts with 7 and the list is already in sorted order. Paste `f47ac10b-58cc-4372-a567-0e02b2c3d479` into the checker: it says "Valid: version 4 (random)".

## FAQs

**Can two UUIDs ever be the same?** In theory yes; in practice no. You would need to make billions of v4 UUIDs before a repeat became even slightly likely.

**Is a UUID a password?** No. A v7 UUID shows when it was made, so do not use UUIDs as secret tokens.
