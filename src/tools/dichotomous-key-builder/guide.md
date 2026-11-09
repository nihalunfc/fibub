---
name: Dichotomous key builder
num: 321
shelf: science
section: entomology
title: "Dichotomous key maker: build, check and test an identification key (free)"
summary: "Write an identification key as couplets for any group of organisms, check it for loops, dead ends and unreached couplets or taxa, try it step by step, and save it as JSON or printable text. Runs in your browser."
status: live
ads: true
order: 321
icon: book
works: offline
updated: 2026-11-09
related: [tree-viewer, biodiversity-indices, field-sampling-planner, plate-layout]
sources:
  - "Dichotomous key structure (couplets of two contrasting leads): standard taxonomic practice, as in Winston, J. E., Describing Species (Columbia University Press, 1999)."
  - "The example key was written for this page from general knowledge of insect orders; it is simplified and not for identification."
  - "Checks compared with an independent Python check using networkx 3.7 (reachability, simple cycles, all simple paths) on the example and on a deliberately broken key."
flow:
  - { icon: pencil, label: "Write" }
  - { icon: check, label: "Check" }
  - { icon: pointer, label: "Try it" }
  - { icon: download, label: "Save" }
---

## What it does

A dichotomous key identifies an organism by a series of choices between two contrasting statements, called a couplet. Each choice leads either to another couplet or to a name. Keys are easy to start and easy to break: a lead that points to a couplet that does not exist, a loop that sends the reader back where they started, or a species that no path reaches. This tool lets you write a key for any group (insects, leaves, fungi, fish), checks it for those mistakes, lets you try it one step at a time as a reader would, and saves it as JSON (to open again later) or as printable text with dot leaders. Everything happens in your browser.

## How to use it

1. Write one lead per line: the couplet number with **a** or **b**, the description, then **...** and where the lead goes. Where it goes is either another couplet number or the name of a taxon. For example: "1a. Wings present ... 2" and "1b. Wings absent ... Silverfish". You can write 1' instead of 1b, and → or a tab instead of "...". A first line "Title: ..." names the key.
2. **Add a couplet** puts a new numbered pair at the end for you to fill in.
3. Optionally list the **taxa the key should reach**, one per line. The check then tells you which are missing.
4. Read the **Check** panel, fix anything marked as an error, and look at anything marked to check.
5. Use **Try the key** to walk through it as a reader would. **Back** undoes a choice.
6. **Save as JSON** keeps the key to open again with **Open a key**; **Printable text** gives a tidy text file; the Download buttons give the key and the check as an image, PDF or Word file.

## What the check looks for

- **Dead ends**: a lead that goes to a couplet number that does not exist.
- **Loops**: leads that lead back to a couplet already passed, so a reader could go round for ever.
- **Couplets that are never reached** from the first couplet, and **taxa** named only in them.
- Couplets with **one lead** or **more than two**, repeated lead labels, and leads with no description.
- Things to check rather than errors: a couplet reached from more than one lead, both leads going to the same place or saying the same thing, and a taxon that keys out more than once (fine for a variable species).
- The **path to each taxon** and its length. Short, balanced paths make a key quicker to use.

## Worked example

The page opens with a simplified key to seven insect orders, written for this page (not for real identification). It has 6 couplets, all reached, and the check reports no loops, dead ends or unreached parts. The longest path is 4 steps (for example bees, wasps and ants: 1b → 3b → 5b → 6a) and the mean is 3.0 steps. Typing "Mayflies (Ephemeroptera)" in the list of taxa the key should reach gives an error, because no lead ends there. Changing "4b ... True bugs (Hemiptera)" to "4b ... 2" creates a loop between couplets 2 and 4, and the check reports it at once.

## Tips

- Make the two leads of a couplet true opposites, about the same feature, and visible on the specimen in hand.
- Put the easiest and most reliable features first, and avoid features that need a microscope early in the key.
- Test the key on real specimens and with someone who did not write it.

## Frequently asked questions

**Can it handle very large keys?** Yes, hundreds of couplets. The path table lists up to 1,000 paths.

**Can I open a key from another program?** It opens the JSON files it saves. For other keys, paste the text in the form above.

**Is my key uploaded?** No. It stays in your browser, and files you open are read on this device only.
