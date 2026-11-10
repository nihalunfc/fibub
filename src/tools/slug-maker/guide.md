---
name: Slug maker
num: 2029
shelf: everyday
code: T877
section: dev-text
title: "Slug maker: turn a title into a clean URL slug or safe file name"
summary: "Turn titles into URL slugs and safe file names: lower case, accents removed, hyphens or underscores, an optional length limit and many lines at once."
status: live
ads: false
order: 2029
icon: link
works: offline
updated: 2026-11-10
related: [link-cleaner, text-cleaner]
sources:
  - "Unicode NFKD normalisation (Unicode Standard Annex #15) to split accents from letters; the rest is fibub's own working."
flow:
  - { icon: pencil, label: "Title" }
  - { icon: sliders, label: "Options" }
  - { icon: link, label: "Slug" }
---

## What it does

A slug is the readable end of a web address, like `/blog/hello-world-10-tips`. It should hold only plain letters, numbers and one separator. This page turns any title into a slug, or into a file name that is safe on Windows, Mac and Linux.

Everything runs in your browser. To tidy messy pasted text before you start, use the [[text-cleaner]]; to strip tracking codes from a full web address, use the [[link-cleaner]].

## How to use it

1. Type or paste titles into the top box, one per line.
2. Choose URL slug or File name, and the separator.
3. Set a maximum length if your site or system has one.
4. Copy the result or download it as a text file. Clear empties the box.

## What each setting does

- **Make**: "URL slug" uses the whole line. "File name" keeps an extension at the end (such as `.pdf`, up to 5 letters) and cleans only the part before it.
- **Separator**: hyphens are usual for web addresses; underscores suit some file systems.
- **Max length**: cuts at the last whole word that fits, so you never get half a word. A single word longer than the limit is cut inside the word. 0 means no limit.
- **Lower case**: on by default. Untick it to keep capital letters.
- **Drop little words**: removes short English words such as a, an, the, and, of, to, in, for and with. If a line has nothing but little words, they are kept.

## The rules

Accents are split off and dropped (é becomes e, ö becomes o), using Unicode NFKD. A few letters with no accent form are spelled out: ß becomes ss, æ becomes ae, ø becomes o. Apostrophes vanish, so "don't" becomes "dont". Every other run of spaces or symbols, including &, becomes one separator.

## Worked example

`Héllo Wörld: 10 Tips & Tricks!` becomes `hello-world-10-tips-tricks`. With underscores it is `hello_world_10_tips_tricks`. With a maximum of 20 it becomes `hello-world-10-tips` (19 characters), because adding "-tricks" would go over. As a file name, `Report Q3 Final.PDF` becomes `report-q3-final.pdf`.

## FAQs

**Why not keep the accents?** They are sent as codes like %C3%A9, which look broken when copied.

**Does it change other alphabets?** Letters outside A to Z, such as Arabic or Hindi, are removed, so a line written only in them gives nothing and the page says so.
