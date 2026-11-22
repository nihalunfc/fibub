---
title: 'Saving tokens 3: caching, limits and structured output'
seoTitle: 'Prompt caching, limits and JSON output | Offline AI'
summary: Reuse the work a model already did on the same opening text, cap answer length, stop at the right moment, and ask for structured output so nothing is wasted.
minutes: 20
updated: 2026-11-22
sources:
  - 'Kwon, W. et al. (2023), Efficient Memory Management for Large Language Model Serving with PagedAttention (KV cache reuse) https://arxiv.org/abs/2309.06180'
  - 'Ollama API documentation (keep_alive, num_predict, stop and format options) https://github.com/ollama/ollama/blob/main/docs/api.md'
  - 'Anthropic, Prompt caching (official documentation) https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching'
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

<div class="bigidea">If many requests start with the same text, the engine can read that part once and reuse it, and caps, stops and structured output stop answers from wasting tokens.</div>

## 1. Why this matters

Batch jobs send nearly the same prompt hundreds of times. Without caching, the model re-reads the same instructions every time. Without limits, a few answers run on far too long. Both waste the slow, expensive part of the work.

## 2. Prompt caching

When a new request begins with exactly the same tokens as the last one, an engine can reuse the stored keys and values for that shared beginning (the KV cache from Lesson 2.4) instead of reading it again. The shared beginning is called the **prefix**.

It is like a bookmark. If you always start from the same chapter, you don't reread the book from page one each time; you open it at the bookmark.

<div class="steps">
<div class="step"><p><b>The job.</b> 500 support emails. Every request starts with the same <b>2,000-token</b> instructions, then <b>300</b> tokens of that email.</p></div>
<div class="step"><p><b>No caching.</b> Each request reads 2,000 + 300 = 2,300 tokens. 500 × 2,300 = <b>1,150,000</b> tokens read.</p></div>
<div class="step"><p><b>Request 1 with caching.</b> The engine reads all 2,300 and keeps the keys and values for the first 2,000.</p></div>
<div class="step"><p><b>Requests 2 to 500.</b> The first 2,000 tokens match exactly, so they are reused. Only each email's 300 new tokens are read.</p></div>
<div class="step"><p><b>Total.</b> 2,000 + 500 × 300 = <b>152,000</b> tokens read: about 7.5 times fewer. Change one word near the start and the match breaks, so keep the fixed part first.</p></div>
</div>

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

<div class="meaning">

<dl>
<dt>prefix</dt><dd>the identical opening tokens every request shares: fixed instructions, a reference document</dd>
<dt>new part</dt><dd>the tokens that change each time: this email, this question</dd>
<dt>n</dt><dd>how many requests the job sends</dd>
<dt>prefix + n × new part</dt><dd>tokens read with caching: the prefix once, then only the new parts</dd>
<dt>Physical meaning</dt><dd>Caching turns "read the rule book before every question" into "read it once in the morning". The longer the shared opening and the more requests, the bigger the saving, but only if the opening is exactly the same each time.</dd>
</dl>

</div>

<div class="problem" data-problem="token-saving-caching-reads"></div>

<div class="myth">

**"Prompt caching stores old answers and hands them back."** It doesn't reuse answers at all. It reuses the work of reading an identical opening (the stored keys and values). Every request still gets a fresh answer, written for its own question.

</div>

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

<div class="keypoints">

- Prompt caching reuses the work of reading an identical opening; it never reuses answers.
- Put the fixed instructions and documents first and the changing part last; keep the model loaded.
- Tokens read with caching ≈ prefix + n × new part, instead of n × (prefix + new part).
- Max tokens caps each answer; stop sequences end it at a chosen string; switch thinking off for easy tasks.
- JSON with a schema removes chatty extras and gives your code fields it can use directly.

</div>
