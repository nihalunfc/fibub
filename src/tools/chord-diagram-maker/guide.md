---
name: Tab maker
num: 3052
shelf: everyday
code: T1046
section: music-theory
title: "Tab maker: guitar chord diagrams and text tab"
seoTitle: "Guitar chord diagram and tab maker, free online"
summary: "Press frets on a fretboard to build a guitar, ukulele or bass chord diagram, see the chord name worked out from the notes, add it to a printable chord sheet, and write text tab in several tunings."
status: live
ads: false
order: 3052
icon: sliders
works: offline
updated: 2026-11-18
related: [chord-transposer, chord-scale-helper, instrument-tuner]
sources:
  - "Tunings are the usual ones: guitar E A D G B E, ukulele G C E A, bass E A D G, with Drop D, DADGAD and Open G also in common use. The chord shapes are standard open and barre shapes in standard tuning; there are often other fingerings. Chord names are worked out from the notes by fibub's own code (checked 2026-11-18)."
flow:
  - { icon: pencil, label: "Press frets" }
  - { icon: check, label: "Name" }
  - { icon: sliders, label: "Sheet" }
  - { icon: download, label: "Save" }
---

## What it does

A chord diagram is a small picture of the fretboard that shows where the fingers go. Here you build one by tapping the grid: each column is a string, each row a fret, and the tool works out the name of the chord from the notes you pressed. You can start from a common open chord, or from an empty board and try your own shape. Muted strings are marked with a cross and open strings with a circle.

Below the diagram is a tab editor, where you type fret numbers on a grid of strings and steps and get plain text tab you can paste into an email or message. To move a song's chords to an easier key first, use the [[chord-transposer]], and to see the chords in a key, use the [[chord-scale-helper]].

## How to use it

1. Choose the instrument and tuning, then pick a common chord or tap the grid.
2. Read the name under the diagram. Use + and − to move the frets shown.
3. Press Add to chord sheet to collect diagrams, then Print sheet. Or download one as SVG or PNG.
4. In the tab editor, type frets, or press "Put the chord above into the tab" to add the shape as the next step.

## What each setting does

- **Tuning**: Drop D, DADGAD, Open G and others change the notes, so the detected name changes too.
- **Name to show** (More options): replaces the detected name, for example a slash chord or your own label.
- **Fingers** (More options): Auto numbers the fingers and treats a barre as finger 1. Choose a number to override it.
- **Steps**: the number of columns in the tab.

## Worked example

Pick Guitar and the C chord shape: x32010. The notes are C E G C E, and the name is C. With the F shape 133211 the tool draws a barre across fret 1 and names the chord F. In Drop D tuning the shape 022000 sounds D B E G B E, named Em7/D.

## FAQs

**Why does the name sometimes say "not a chord name"?** Only common chord types are recognised. Unusual stacks of notes are listed by note name instead.

**Is my work saved?** No. Nothing is stored or sent. Print or download before you close the page.

**Are these the only fingerings?** No. Most chords can be played several ways; these are the usual open and barre shapes.
