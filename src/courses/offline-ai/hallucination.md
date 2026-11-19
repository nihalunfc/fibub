---
title: Why models make things up
summary: Models predict likely text, not true text, so they sometimes produce confident errors. Why it happens, when it is most likely, and the habits that reduce it.
minutes: 20
updated: 2026-11-19
quiz:
  - q: Why do language models sometimes state false facts confidently?
    choices: ['They are designed to lie', 'They predict likely-sounding text, and a plausible wrong answer can score highly', 'Their internet is slow']
    ans: 1
    why: The loop picks probable tokens. If the model never learned the fact well, a fluent guess can still be the most likely text.
  - q: Which helps most to reduce made-up facts in answers about your documents?
    choices: ['A higher temperature', 'Giving it the source text and asking it to quote where the answer comes from', 'A longer system prompt about honesty']
    ans: 1
    why: Grounding the answer in supplied text and asking for quotes makes errors easy to spot and less likely.
  - q: Are local models more or less prone to this than cloud models?
    choices: ['Never prone', 'Smaller models usually make up more, so checking matters more locally', 'Exactly the same always']
    ans: 1
    why: Smaller models know fewer facts. The same habits (grounding, checking, low temperature) work for both.
---

**Module 2 · about 20 minutes · read first: 2.1.** You'll be able to predict when a model is likely to make things up and set up your work to catch it.

## 1. Why this matters

A wrong figure in a report or a made-up legal reference can cost far more than the time the model saved. Every serious workflow needs a plan for errors.

## 2. Why it happens

The loop in Lesson 2.1 picks likely text, not checked facts. When the model has learned a fact well, likely and true are the same. When it has not (rare names, recent events, exact numbers, references), the most fluent continuation can be a confident invention. This is called **hallucination**.

It is most likely with:

- exact numbers, dates, quotes and references;
- things after the model's **knowledge cut-off**;
- niche topics, small models, and high temperature;
- questions that assume something false ("Why did X win in 2025?").

## 3. Habits that reduce it

1. **Give it the source** (paste, or document search in Module 12) and say "answer only from this text".
2. **Ask for quotes or page numbers** for each claim, so you can check.
3. **Allow "I don't know"**: say so in the system prompt.
4. **Use low temperature** for facts.
5. **Check numbers with tools**, not the model (a calculator, a spreadsheet, or tool calling in Lesson 11.3).
6. **A second pass:** ask the model (or another one) to check each claim against the source.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** if each claim is right with probability p, a long answer with n independent claims is fully right with probability pⁿ.

**Equation:** P(all correct) = pⁿ.

**Analogy:** a chain of stepping stones: each is probably solid, but cross enough of them and the chance that one wobbles grows fast.

**Try it:** 20 claims each 98% likely to be right? (0.98²⁰ ≈ 0.67: one answer in three has at least one error. That is why checking matters.)
</details>

## 4. Worked example

*Made-up numbers.* A small charity asks a local model for "five grants for literacy projects in Ontario with deadlines". It lists five, two of which do not exist. Next time they paste the funders' pages and ask "list grants mentioned in this text, quoting the deadline line". Every answer now comes with a quote they can check.

## 5. Practice

1. Ask your model about a small local business or person it cannot know. What does it say?
2. Add "If the text does not say, answer 'not stated'" to a prompt. Does the answer change?
3. Using the box, 10 claims at 95% each?

<details>
<summary>Answers</summary>

1. Small models often invent plausible details; this is the behaviour to design around.
2. Usually it starts admitting gaps instead of guessing.
3. 0.95¹⁰ ≈ 0.60.
</details>

**New words:** *hallucination* (confident, made-up content), *grounding* (answering from supplied sources), *knowledge cut-off*.
