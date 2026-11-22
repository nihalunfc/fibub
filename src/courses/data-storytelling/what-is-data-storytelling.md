---
title: What data storytelling is, and why analysts need it
seoTitle: 'What is data storytelling? A plain guide for analysts'
summary: Data storytelling is turning numbers into a clear message that someone acts on. What it is, what it is not, and why it decides whether your analysis gets used.
minutes: 10
updated: 2026-11-22
quiz:
  - q: What is the goal of data storytelling?
    choices: ['To make charts look attractive', 'To help a specific person understand a finding and act on it', 'To show every number you have']
    ans: 1
    why: The story exists for a decision. Beauty helps only when it makes the message easier to get.
  - q: Which three parts does a data story need?
    choices: ['Data, a message, and a picture that shows it', 'A logo, a title and a table', 'Three charts of the same size']
    ans: 0
    why: 'Data gives the evidence, the message says what it means, and the visual makes it quick to see.'
  - q: A manager opens your dashboard and closes it after 10 seconds without acting. What most likely went wrong?
    choices: ['The data was wrong', 'Nothing told them what mattered or what to do', 'The colours were too dull']
    ans: 1
    why: Without a clear point, readers have to dig for one. Most don't have time.
---

**Module 1 · about 10 minutes · no prerequisites.** You'll know what data storytelling is, and see the same numbers shown as a data dump and as a story.

## 1. Why this matters

Analysis that nobody acts on is wasted work. Managers get dozens of reports a week and give each one seconds. The analyst who can say "here is what happened, here is why it matters, here is what I suggest", with a chart that proves it at a glance, gets listened to, and gets hired. Job ads for data analysts and BI developers list "communicating insights to non-technical stakeholders" almost as often as SQL.

## 2. The idea in one picture

Below is a chart a reporting tool makes by default. Press **Next step** to turn it, one change at a time, into a chart with a message. The data never changes.

<!--fig:declutter bars-->

The first chart shows data. The last one tells you something: the new store is already close to its target. That difference is data storytelling.

## 3. What it is (and isn't)

**Data storytelling** is the skill of turning analysis into a message that a particular audience understands and acts on. It has three parts that work together:

1. **Data:** correct, relevant numbers. Without them, it's opinion.
2. **Narrative:** the message in words: what happened, why it matters, what to do.
3. **Visuals:** charts that make the message quick to see.

Data plus visuals without a narrative is a dashboard nobody understands. Narrative without data is a guess. Data plus narrative without visuals is a dense report nobody finishes.

It is **not** decoration, making numbers say what someone wants, or hiding the inconvenient parts. A good story includes the bad news, clearly.

<details class="maths" open><summary>Principle</summary>

**Principle:** every chart and slide should answer "so what?" for one audience. If you can't say the point in one sentence, the reader won't find it either.

**Analogy:** a tour guide, not a map. A map shows everything; a guide takes you to the three places worth seeing, in an order that makes sense, and tells you why they matter.

**Physical meaning:** a reader's attention is limited, like a budget. Each line, colour and label spends some of it. Spend it on the message.
</details>

## 4. Worked example

*Northbay Goods, a made-up shop with five stores, asks: "How did 2025 go?"*

- **Data dump:** a table of 24 monthly totals, five store totals, four category totals. Correct, and useless at a glance.
- **Story:** "2025 sales were $262k, up 29 % on 2024. Most of that came from the new Forks Market store: the four older stores grew 14 %. February was the only weak month. We suggest reporting like-for-like growth each month so the new store doesn't hide a slowdown."

Same numbers. The second version tells the manager what happened, what's behind it, and what to do next. You'll build that exact story in the capstone (Lesson 6.3).

## 5. Practice

1. Think of a report or dashboard you've seen at work or school. Could you say its main point in one sentence?
2. Which part (data, narrative or visuals) is weakest in most reports you've seen?
3. Rewrite this as a one-line message: "Sales by month, 2024-2025 (table attached)."

<details><summary>Answers</summary>

1. If not, it's showing data rather than telling a story. That's very common.
2. Usually the narrative: charts with titles like "Sales by Month" and no sentence saying what they show.
3. For example: "Sales grew in every month of 2025 except February, ending the year 29 % up."
</details>

Next, Lesson 1.2: who you're telling the story to. If you build reports in Power BI, the [Power BI and DAX course](/learn/courses/power-bi/) uses the same Northbay data.
