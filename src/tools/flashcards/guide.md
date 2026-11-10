---
name: Flashcards
num: 824
shelf: science
code: T560
section: teaching-and-outreach
title: "Flashcards"
summary: "Make decks of flashcards or import them from a CSV, a spreadsheet or an Anki plain-text export, then study them with the SM-2 spaced-repetition schedule. See what is due, how well you remember, and export back to Anki. Everything stays in your browser."
status: live
ads: false
order: 824
icon: book
works: offline
updated: 2026-11-09
related: [protocol-timer, practice-problems, lab-report-template, periodic-table, physical-constants, item-analysis]
sources:
  - "SM-2 spaced-repetition algorithm: P. A. Wozniak (1990), as published on supermemo.com. Written here by fibub and checked in the tests against an exact Python port of that description on 2,000 random grade sequences, and against the supermemo2 package on PyPI."
  - "Anki's plain-text export format (tab-separated, with #separator, #html and #tags column header lines) as described in the Anki manual; no Anki code is used."
  - "The example deck is made up of general science facts. Your decks are saved only in this browser (localStorage) only if you tick the box, and never uploaded."
flow:
  - { icon: pencil, label: "Cards" }
  - { icon: book, label: "Study" }
  - { icon: calendar, label: "Schedule" }
  - { icon: chart, label: "Stats" }
---

## What it does

Spaced repetition shows you each card just before you are likely to forget it. Cards you know well come back after weeks or months; cards you struggle with come back tomorrow. You spend your time on what you do not know yet. This page is a complete flashcard app in the browser:

- **Decks.** Keep as many decks as you like: a course, a lab's safety rules, the amino acids, a language.
- **SM-2 scheduling.** The classic algorithm behind SuperMemo 2 and early Anki. After you see the answer, grade yourself from 0 to 5. A card answered right (3 or more) waits 1 day, then 6 days, then each interval is multiplied by the card's *easiness*, which starts at 2.5 and goes up by 0.1 for an easy answer and down for a hard one (never below 1.3). A forgotten card (0 to 2) starts again at 1 day.
- **Same-day repeats.** As SM-2 asks, any card graded below 4 comes back later in the same session until you know it well. Only your first answer of the day changes the schedule.
- **Import.** Paste or open a list with the front in one column and the back in the next (tags in a third, optional): CSV, TSV, Excel, or an Anki "Notes in Plain Text" export. Anki's HTML is turned into plain text.
- **Statistics.** Cards that are new, learning, young and mature, your answers over the last 30 days with the share you got right, and how many cards fall due each day for the next two weeks.

Practise with numbers too in the [[practice-problems|practice problem generator]], and learn the elements with the [[periodic-table]].

## How to use it

1. **Get cards.** Type them in *Add a card*, or paste a list into *Import cards* (or tap *Open a file*). Tick *Swap front and back* to study the other way round. Duplicates already in the deck are skipped.
2. **Set a pace.** *New cards per day* (20 by default) limits how many unseen cards each session adds, so reviews do not pile up.
3. **Study.** Tap *Study now*. Read the front, try to recall the answer, then *Show answer* (or press Space). Grade yourself; each button shows when the card would come back. Keys 0 to 5 grade from the keyboard.
4. **Come back daily.** The box at the top shows how many cards are due. A few minutes a day works better than an hour once a week.

The grades: **5 Easy** right straight away; **4 Good** right after a little thought; **3 Hard** right with serious effort; **2 Almost** wrong, but it seemed easy once seen; **1 Wrong** but familiar; **0 Blank** no idea.

## Worked example

Grade a new card 5 every time and its intervals are **1, 6, 17, 48 and 140 days**: after the second review the easiness is 2.7, so the third interval is 6 × 2.7 = 16.2, rounded up to 17; then 17 × 2.8 = 47.6 → 48, and 48 × 2.9 = 139.2 → 140. Grade it 4 every time and the easiness stays 2.5: 1, 6, 15, 38, 95 days. Forget it after three good reviews (grade 2) and it comes back tomorrow, then in 6 days, with its easiness lowered from 2.8 to 2.48 so it returns more often from then on.

The page opens with a made-up example deck of ten science facts. Set *New cards per day* to 4 and tap *Study now (4 cards)* to try it.

## Your data

Nothing is saved until you tick *Remember my decks and progress in this browser*. Ticked, decks and progress stay in this browser on this device (untick it to remove the saved copy) and are never sent anywhere; the page works offline. Clearing browser data removes them, so use *Download backup (JSON)* now and then, which also moves everything to another device. *Deck for Anki (.txt)* writes a file Anki imports (File, Import), and *Deck with schedule (CSV)* lists each card with its reviews, lapses, easiness and next review date.

## FAQ

**Is this the same as Anki's scheduler?** No. Anki started from SM-2 and has changed it a lot since (and newer versions use FSRS). This page uses SM-2 as published, so intervals differ from Anki's. Your Anki review history is not imported, only the cards.

**What day does a card fall due?** Days change at midnight on your device's clock.

**Can I add pictures?** Not yet: cards are plain text. Pictures in an Anki export are left out and the page tells you which rows had them.
