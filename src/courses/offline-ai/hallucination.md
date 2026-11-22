---
title: Why models make things up
summary: Models predict likely text, not true text, so they sometimes produce confident errors. Why it happens, when it is most likely, and the habits that reduce it.
minutes: 20
updated: 2026-11-22
sources:
  - 'Ji, Z. et al. (2023), Survey of Hallucination in Natural Language Generation, ACM Computing Surveys 55(12) https://doi.org/10.1145/3571730'
  - 'Kalai, A. T. et al. (2025), Why Language Models Hallucinate https://arxiv.org/abs/2509.04664'
  - 'Lewis, P. et al. (2020), Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks https://arxiv.org/abs/2005.11401'
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

<div class="bigidea">A model picks likely-sounding words, not checked facts, so when it does not know something it can still produce a fluent, confident answer that is wrong.</div>

## 1. Why this matters

A wrong figure in a report or a made-up legal reference can cost far more than the time the model saved. Every serious workflow needs a plan for errors.

## 2. Why it happens

The loop in Lesson 2.1 picks likely text, not checked facts. When the model has learned a fact well, likely and true are the same. When it has not (rare names, recent events, exact numbers, references), the most fluent continuation can be a confident invention. This is called **hallucination**.

Think of a student in an exam who never learned the answer but must write something. A well-practised student writes a smooth, convincing paragraph anyway. The model is always that student: it must pick some next token.

<div class="steps">
<div class="step"><p><b>A question it can't know.</b> "Which library won the 2019 regional award for small branches?" The model never read the answer.</p></div>
<div class="step"><p><b>No clear favourite.</b> For the first word of the name, many tokens score about the same: "Maple" 12%, "River" 10%, "Oak" 9%, and so on. None is strong.</p></div>
<div class="step"><p><b>It still picks one.</b> The loop must choose. Say it picks "Maple".</p></div>
<div class="step"><p><b>Then everything flows.</b> After "Maple", "Grove" is very likely (80%), then "Library" (90%). Each word fits the words before it, so the whole answer reads confidently, though only the first choice was a guess.</p></div>
<div class="step"><p><b>Give it the source.</b> Paste the award page into the prompt and the right name scores 95%: it is right there to copy. This is why grounding works.</p></div>
</div>

It is most likely with:

- exact numbers, dates, quotes and references;
- things after the model's **knowledge cut-off**;
- niche topics, small models, and high temperature;
- questions that assume something false ("Why did X win in 2025?").

Try it: set temperature to 0.3, then 1.8, then cut the list with top-k and top-p, and press Draw 200 each time.

<figure class="fig" data-fig="@ai-sampling-topp"><figcaption>Temperature reshapes the odds; top-k and top-p remove the unlikely tail before choosing. Low settings give safe, repeatable text; high settings give variety and more risk of nonsense.</figcaption></figure>

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

<div class="meaning">

<dl>
<dt>p</dt><dd>the chance that one claim in the answer is right, for example 0.98 (98%)</dd>
<dt>n</dt><dd>how many separate facts the answer states</dd>
<dt>pⁿ</dt><dd>p multiplied by itself n times: the chance every single claim is right</dd>
<dt>Physical meaning</dt><dd>Small error rates add up. A model that is right 98% of the time per fact still gives a long report with at least one mistake about a third of the time. Long, fact-heavy answers need checking; short answers grounded in a source you supplied need much less.</dd>
</dl>

</div>

<div class="problem" data-problem="hallucination-chain"></div>

Try it: set a 3-point gap, then slide the number of questions from 20 to 5000 and press Run 100 tests.

<figure class="fig" data-fig="@ai-bench-noise"><figcaption>A benchmark score is a measurement with error. With few questions a small lead is often just luck; with thousands the better model reliably ranks first. Always ask how many questions.</figcaption></figure>

Try it: press Generate 20 with 1 word of memory, then with 2 words.

<figure class="fig" data-fig="@ai-bigram-gen"><figcaption>A language model is a table of what tends to come next. More memory gives more sensible text but copies the source, because there is only one continuation. Real models do this with billions of numbers instead of a table.</figcaption></figure>

Try it: slide the style from honest to over-confident and watch the bars drop below the diagonal.

<figure class="fig" data-fig="@ai-calibration"><figcaption>A calibrated model's confidence can be trusted. An over-confident model sounds sure when it should not, which is how confident wrong answers, called hallucinations, appear.</figcaption></figure>

## 4. Worked example

*Made-up numbers.* A small charity asks a local model for "five grants for literacy projects in Ontario with deadlines". It lists five, two of which do not exist. Next time they paste the funders' pages and ask "list grants mentioned in this text, quoting the deadline line". Every answer now comes with a quote they can check.

<div class="myth">

**"If the model sounds sure, it's probably right."** Tone tells you nothing. The words "definitely" and "according to" are just likely tokens like any others. A made-up reference reads exactly as smoothly as a real one. Judge an answer by whether you can check it against a source, not by how confident it sounds.

</div>

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

<div class="keypoints">

- Models pick likely text, not checked facts; when they never learned a fact, a fluent guess can still win.
- Errors are most likely with exact numbers, dates, quotes, references, recent events, niche topics and small models.
- If each claim is right with chance p, an answer with n claims is all right with chance pⁿ (0.98²⁰ ≈ 0.67).
- Ground answers in text you supply, ask for quotes, allow "not stated", and use low temperature for facts.
- Check numbers with a calculator or spreadsheet, not the model, and never judge by how confident it sounds.

</div>
