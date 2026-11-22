---
title: Layout, themes and accessibility
seoTitle: 'Power BI report layout, themes and accessibility tips'
summary: Arrange a page so the eye finds the answer first, use a theme for consistent colours and fonts, and make reports usable with a keyboard, a screen reader and colour-blind eyes.
minutes: 14
updated: 2026-11-22
sources:
  - 'Microsoft Learn, Design Power BI reports for accessibility: https://learn.microsoft.com/power-bi/create-reports/desktop-accessibility-creating-reports'
quiz:
  - q: Where should the most important number go on a report page?
    choices: ['Bottom right', 'Top left, where people start reading', 'Anywhere']
    ans: 1
    why: People scan from the top left (in left-to-right languages). Put the headline cards there, details lower down.
  - q: Why not show good/bad with red and green only?
    choices: ['They are ugly', 'About 1 in 12 men has a red-green colour vision deficiency; add a symbol, label or a second cue', 'Power BI doesn''t allow it']
    ans: 1
    why: Colour should never be the only signal. Add arrows, + and − signs or labels.
  - q: What does alt text on a visual do?
    choices: ['Changes its colour', 'Gives screen reader users a description of what the visual shows', 'Exports it']
    ans: 1
    why: Alt text (Format > General > Alt text) is read aloud by screen readers. It can be dynamic, using a measure.
---

**Module 7 · about 14 minutes.** You'll be able to lay out a clean page, apply a theme and check accessibility.

## 1. Why this matters

People decide in seconds whether a report is trustworthy. A tidy, consistent page reads as reliable; a cluttered one doesn't. Accessibility is also a legal and practical requirement in Canadian, UK and US public bodies and many companies.

## 2. Layout

- **Top left to bottom right:** headline cards on top, the main trend next, detail at the bottom.
- **A grid:** turn on View > Gridlines and Snap to grid; align edges; keep equal gaps.
- **Five or six visuals per page** at most. More is a second page or a drill through.
- **One message per visual,** stated in its title: "Sales are 29 % ahead of last year" beats "Sales by Month".
- **Consistent page size** (16:9 for screens) and a mobile layout (View > Mobile layout) for phones.

## 3. Themes

**View > Themes** applies colours, fonts and visual defaults to the whole report. Customise the current theme or import a JSON theme file so every report from your team looks the same. Pick: one neutral colour for most data, one accent colour for what matters, red/amber/green only for status, and a readable font size (at least 10 pt in visuals, 12 pt in tables).

## 4. Accessibility checklist

1. **Alt text** on every visual (Format > General > Alt text), dynamic where useful.
2. **Tab order** (View > Selection > Tab order) follows reading order; hide decorative shapes from it.
3. **Contrast:** text at least 4.5:1 against its background.
4. **Not colour alone:** add markers, labels, or + and − signs to good/bad colours.
5. **Titles and labels** that make sense when read aloud.
6. Test with the keyboard (Ctrl+F6 moves between panes, Tab between visuals) and with **Show as a table** (Alt+Shift+F11).

<details class="maths" open>
<summary>Principle</summary>

**Principle:** design for the reader's attention. Each element either helps answer the page's question or competes with it. Remove what competes, emphasise what answers, and make every answer reachable without a mouse or perfect colour vision.

**Try it:** look at a report you use. What is the one question each page answers? If you can't say it in one sentence, the page is doing too much.
</details>

## 5. Worked example

*Tidying the Northbay overview.* Before: 11 visuals, three fonts, a 3D pie, rainbow colours. After: four cards across the top, one line chart (this year in the accent colour, last year in grey), one sorted bar chart of categories, one matrix; a theme with the company's blue as accent; titles that state the finding; alt text on each visual. Same data, read in ten seconds instead of a minute.

## 6. Practice

1. Rewrite the title "Sales by Store" as a message.
2. Give two ways to show "below target" that don't rely on colour.
3. Where do you set the order in which a keyboard user moves through visuals?

<details>
<summary>Answers</summary>

1. For example: "Queen Street sells the most; Forks Market is still building up".
2. A ▼ arrow or − sign; a "Below target" label; a target line on the bar.
3. View > Selection pane > Tab order.
</details>
