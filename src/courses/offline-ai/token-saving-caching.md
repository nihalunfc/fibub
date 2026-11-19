---
title: 'Saving tokens 3: caching, limits and structured output'
seoTitle: 'Prompt caching, limits and JSON output | Offline AI'
summary: Reuse the work a model already did on the same opening text, cap answer length, stop at the right moment, and ask for structured output so nothing is wasted.
minutes: 20
updated: 2026-11-19
quiz:
  - q: What does prompt caching reuse?
    choices: ['Previous answers', 'The work already done reading an identical start of the prompt', 'Your password']
    ans: 1
    why: If a new request starts with exactly the same tokens as an earlier one, the engine can reuse the stored keys and values instead of reading them again.
  - q: How should you order a prompt to get the most from caching?
    choices: ['Changing parts first, fixed instructions last', 'Fixed instructions and documents first, the changing question last', 'Random order']
    ans: 1
    why: Caching works on the identical beginning. Keep the stable part first.
  - q: What does a stop sequence do?
    choices: ['Ends the answer as soon as a chosen piece of text appears', 'Stops the computer', 'Blocks bad words']
    ans: 0
    why: For example, stopping at a blank line or a closing bracket saves the tokens the model would waste after the useful part.
---

**Module 3 · about 20 minutes · read first: 3.6 and 3.7.** You'll be able to make repeated jobs faster with caching and stop answers from running long.

## 1. Why this matters

Batch jobs send nearly the same prompt hundreds of times. Without caching, the model re-reads the same instructions every time; without limits, a few answers run on far too long. Both waste the slow, expensive part of the work.

## 2. Prompt caching

When a new request begins with exactly the same tokens as the last one, an engine can reuse the stored keys and values for that shared beginning (the KV cache from Lesson 2.4) instead of reading it again.

- **Locally:** llama.cpp's server and Ollama reuse a shared beginning while the model stays loaded. Keep the model loaded between requests (Ollama's `keep_alive` option) and keep the start identical.
- **In the cloud:** several providers offer cheaper "cached input" for repeated beginnings; check each provider's pricing page.
- **Order matters:** fixed system prompt and reference document first; the changing part (this email, this question) last.

## 3. Caps and stops

- **Max tokens** (`num_predict` in Ollama, `max_tokens` in OpenAI-style calls, `-n` in llama.cpp): a hard ceiling per answer.
- **Stop sequences:** end the answer when a chosen string appears, such as a blank line or `###`.
- **Thinking off** for easy tasks (Lesson 10.4).

## 4. Structured output

JSON with a schema (Lesson 11.3) removes the chatty extras ("Sure! Here is...") and gives fields your code can use directly. It is usually both shorter and more reliable than free text.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** with caching, the shared prefix is read once; each request only reads its new part.

**Equation:** input tokens read ≈ prefix + n × new part (cached) instead of n × (prefix + new part).

**Analogy:** a teacher who reads the class rules aloud once in the morning, not before every question.

**Try it:** 500 requests, a 2,000-token prefix and 300 new tokens each? (Without caching 1,150,000 tokens read; with caching 2,000 + 150,000 = 152,000, about 7.5 times fewer.)
</details>

## 5. Worked example

*Made-up numbers.* A support team classifies 1,000 tickets overnight with a 1,500-token instruction block. With the instructions first and the ticket last, the engine reuses the instructions; each ticket's reading time falls from 4 seconds to under 1. With a 40-token cap and JSON output, the whole run drops from 3 hours to 50 minutes.

## 6. Practice

1. Reorder one of your batch prompts so the fixed part comes first.
2. Add a max-tokens cap to the folder script in 11.2 (`options={"num_predict": 120}`).
3. Using the box: 200 requests, 3,000-token prefix, 200 new tokens. How many tokens are read with and without caching?

<details>
<summary>Answers</summary>

1. Anything that changes per request (names, dates, the document) goes last.
2. Answers that hit the cap end mid-sentence; ask for a shorter format so they finish naturally.
3. Without: 640,000. With: 3,000 + 40,000 = 43,000.
</details>

**New words:** *prompt caching* or *prefix caching*, *max tokens*, *stop sequence*, *keep_alive* (how long Ollama keeps a model loaded).
