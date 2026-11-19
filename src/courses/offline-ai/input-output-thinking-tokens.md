---
title: Input, output and thinking tokens
summary: Tokens you send, tokens the model writes, and the hidden "thinking" tokens reasoning models add. Why they are counted separately and what each costs in time and money.
minutes: 20
updated: 2026-11-18
quiz:
  - q: Which is usually slower to process per token on your own machine?
    choices: ['Input tokens (reading)', 'Output tokens (writing)', 'They are the same']
    ans: 1
    why: Input is read in one fast batch; output is written one token at a time, and each one needs a full pass over the model.
  - q: What are thinking tokens?
    choices: ['Tokens the model writes to work a problem through before its final answer', 'Tokens in your question', 'Tokens that are free in the cloud']
    ans: 0
    why: Reasoning models write a chain of working first. It improves hard answers but adds output tokens and time.
  - q: Why do cloud APIs often charge more for output tokens than input tokens?
    choices: ['Output is written one token at a time, so it uses more hardware time per token', 'Output tokens are longer', 'It is a tax']
    ans: 0
    why: Each output token needs its own pass through the model, while input is processed in parallel.
---

**Module 3 · about 20 minutes · read first: 3.1 and 3.3.** You'll be able to tell input, output and thinking tokens apart and estimate the time each adds.

## 1. Why this matters

When a local job feels slow, or a cloud plan runs out early, the cause is usually one kind of token: long outputs, or a reasoning model thinking at length. Knowing which lets you fix the right thing.

## 2. Three kinds

- **Input tokens:** everything you send, the system prompt, history, documents and your question. Read in one fast batch.
- **Output tokens:** the answer, written one token at a time.
- **Thinking (reasoning) tokens:** some models write out their working first, often hidden or folded in the interface, then the final answer. They count as output: they take writing time and, in the cloud, are usually billed as output.

## 3. Why the difference matters

On your machine, input is cheap in time and output is expensive. In the cloud, output tokens usually cost several times more than input tokens, and plan limits drain fastest with long answers and heavy thinking. Either way, the biggest savings come from **shorter outputs** and **thinking only when needed** (Lessons 3.6 and 10.4).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** total time is reading time plus writing time, and writing is usually the bigger part.

**Equation:** time ≈ input ÷ reading speed + (thinking + output) ÷ writing speed.

**Analogy:** a student in an exam: reading the question is quick, writing the essay is slow, and rough working in the margin adds writing time even though it is not marked.

**Try it:** 2,000 input tokens at 500 per second, 1,500 thinking and 300 answer tokens at 15 per second? (4 s + 120 s = about 2 minutes. Without thinking: 4 + 20 = 24 s.)
</details>

## 4. Worked example

*Made-up numbers.* A reasoning model takes 90 seconds to answer "Is 17 a prime number?" because it writes 1,200 thinking tokens first. Faisal switches thinking off for simple questions and on for maths problems. Simple questions now take 3 seconds.

## 5. Practice

1. Ask your model for a 50-word and then a 500-word answer. Time both.
2. Using the box, how long do 1,000 output tokens take at 20 per second?
3. You hit a cloud plan's limit every afternoon. Name two changes that save tokens.

<details>
<summary>Answers</summary>

1. The 500-word answer takes about ten times as long; reading time hardly changes.
2. 50 seconds.
3. Ask for shorter answers; switch thinking off for easy questions; start new chats instead of very long ones; send only the relevant part of documents.
</details>

**New words:** *input tokens*, *output tokens*, *thinking* or *reasoning tokens* (working written before the final answer).
