---
title: "Declutter: remove everything that doesn't help"
seoTitle: 'How to declutter a chart: step by step'
summary: Borders, gridlines, legends, slanted labels and rainbow colours all cost the reader attention. A step-by-step method for decluttering any chart, with an interactive before and after.
minutes: 12
updated: 2026-11-22
quiz:
  - q: What is chart clutter?
    choices: ['Any data point', 'Visual elements that take up attention without helping understanding', 'Too few colours']
    ans: 1
    why: Clutter is anything the reader must process that doesn't carry the message.
  - q: Why replace a legend with labels at the end of lines?
    choices: ['It looks modern', 'Readers no longer have to look back and forth to match colours', 'Legends are not allowed']
    ans: 1
    why: Direct labels put the name where the eye already is.
  - q: Should you remove the value axis when bars have data labels?
    choices: ['Yes, usually: the labels give the values, so the axis repeats them', 'Never', 'Only on line charts']
    ans: 0
    why: Showing the same information twice is clutter. Keep one.
---

**Module 3 · about 12 minutes · read first: 2.2.** You'll be able to strip any chart down to what helps, in six steps.

## 1. Why this matters

Every line, box and colour on a chart asks the reader to work out what it means. When most of them mean nothing, the message gets buried. Decluttering is the fastest way to make any chart better; it costs nothing and needs no design talent.

## 2. The idea in one picture

<!--fig:declutter bars-->

Tick "Show the first version" at any time to compare.

## 3. The six steps

1. **Remove borders and backgrounds.** White space separates things on its own.
2. **Remove or lighten gridlines.** If you label the data, you rarely need them; if you keep them, make them light grey.
3. **Remove the legend** when labels can go on the data itself (bar names, line ends).
4. **Straighten text.** No slanted labels: turn bar charts sideways. Shorten names ("Q1" not "Quarter 1").
5. **One colour by default.** Colours that mean nothing make people search for a meaning.
6. **Label directly, then drop what's repeated.** If bars show their values, the axis repeats them.

Then add back only what helps: a highlight colour and an action title (next lessons).

<details class="maths" open><summary>Principle</summary>

**Principle:** Edward Tufte's data-ink ratio: the share of a chart's ink that shows data. Raise it by removing non-data ink that doesn't help. Psychologists call the mental effort a reader spends "cognitive load"; clutter adds load without adding understanding.

**Analogy:** a cluttered desk. Everything on it might be useful, but finding the one paper you need takes longer with every extra item.
</details>

## 4. Worked example

*Northbay's default "Sum of Amount by Store" column chart* has: a border, 5 gridlines, a 5-colour legend, slanted store names, an axis from 0 to 80k, and the title "Sum of Amount by Store".

After the six steps: horizontal bars sorted from Queen Street ($78k) to Forks Market ($30k), one colour, values at the bar ends, no axis, no gridlines, no legend. Then one bar highlighted and a title that says the point. The data is identical; the reading time drops from "study it" to "glance at it".

## 5. Practice

1. A line chart has a legend box under the chart, dots on every point, and a dark grey background. What do you change?
2. Is a light grey gridline always clutter?
3. Which clutter does Power BI add by default to a new column chart?

<details><summary>Answers</summary>

1. Labels at line ends instead of the legend, remove the dots (unless points matter), white background.
2. No: on a chart without data labels, light gridlines help readers estimate values. Remove them only when they don't help.
3. Typically: axis titles that repeat the field names, gridlines, a generic title ("Sum of Amount by Store"), and sometimes a legend. In Power BI, turn these off in the Format pane.
</details>

Next, Lesson 3.2: using colour on purpose.
