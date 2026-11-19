---
title: 'Saving tokens 1: short, clear prompts'
seoTitle: 'Write prompts that use fewer tokens | Offline AI'
summary: The cheapest token is the one you never send or receive. How to write prompts that are short, clear and get short answers, without losing quality.
minutes: 20
updated: 2026-11-19
quiz:
  - q: Which saves the most tokens on a typical job?
    choices: ['Removing "please" from prompts', 'Asking for a shorter, structured answer', 'Using capital letters']
    ans: 1
    why: Output tokens are the slow and expensive ones. Asking for "3 bullet points, max 15 words each" saves far more than trimming polite words.
  - q: You send the same long instructions with every request. What helps?
    choices: ['Put them in a system prompt once and keep them short, or cache them (Lesson 3.8)', 'Repeat them twice for emphasis', 'Translate them']
    ans: 0
    why: Standing instructions belong in the system prompt, written tightly, and engines can reuse them without re-reading.
  - q: When is a worked example in the prompt worth its tokens?
    choices: ['Never', 'When the output format is unusual and the model keeps getting it wrong', 'Always, three or more']
    ans: 1
    why: One good example often fixes format problems; add more only if it helps on your tests.
---

**Module 3 · about 20 minutes · read first: 3.4.** You'll be able to cut a prompt's tokens and its answer's tokens without hurting the result.

## 1. Why this matters

On a subscription, saved tokens mean you hit limits later. On an API, they are money. On your own machine, they are time: a job that writes half as many tokens finishes in about half the time.

## 2. Ask for less output

Output costs most (Lesson 3.4). Say exactly what shape you want:

- "Summarise in **3 bullet points, at most 15 words each**."
- "Reply with **only** the JSON, no explanation."
- "Answer **yes or no**, then one sentence why."
- Set a **maximum tokens** limit in the request as a safety net (Lesson 3.8).

## 3. Send less input

- **Cut the padding:** "I was wondering if you could possibly help me to..." adds nothing; "Summarise:" works.
- **Say it once:** standing instructions go in the system prompt, not every message.
- **Send only what is needed:** the relevant section, not the whole document (Lesson 3.7).
- **Prefer plain text** to pasted formatting, HTML or long tables when they are not needed.

## 4. Keep quality

Short is not vague. Keep what the model needs: the task, the audience, the format, and any rule it must follow. One example of the exact output format is often worth its tokens when the format is unusual.

| Before (about 70 tokens) | After (about 25 tokens) |
|---|---|
| "Hi! I hope you're well. I have an email below from a customer and I'd really appreciate it if you could read it carefully and tell me what they want, and maybe how urgent it seems, thanks so much!" | "Customer email below. Reply with: Request (one line), Urgency (low/medium/high)." |

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** time and cost scale with tokens, and output tokens weigh more.

**Equation:** cost ≈ input × price_in + output × price_out; local time ≈ input ÷ read speed + output ÷ write speed.

**Analogy:** a taxi with a cheap flag-fall and an expensive meter: the shortest route saves most on the meter.

**Try it:** a job writes 400 tokens at 15 per second. You cut the answer to 120 tokens. Time saved? (400 ÷ 15 − 120 ÷ 15 ≈ 26.7 − 8 ≈ 19 seconds per job.)
</details>

## 5. Worked example

*Made-up numbers.* A recruiter screens 300 CVs a week with a local model. The old prompt asked for "a detailed assessment"; answers averaged 450 tokens. The new one asks for "Fit: yes/maybe/no; 3 reasons, 10 words each" and averages 60 tokens. At 12 tokens per second, the weekly run falls from about 3 hours to about 25 minutes.

## 6. Practice

1. Rewrite one of your own prompts to half its length. Compare answers.
2. Add an exact output format to a prompt that currently gets long answers.
3. Using the box, how much time do 1,000 jobs save if each answer drops from 300 to 100 tokens at 20 tokens per second?

<details>
<summary>Answers</summary>

1. If quality dropped, add back the one instruction that mattered, not the padding.
2. Formats like "3 bullets, 15 words max" are followed well by most instruct models.
3. 200 ÷ 20 = 10 s per job, 10,000 s in all: about 2 hours 47 minutes.
</details>

**New words:** *output format*, *max tokens* (a hard cap on answer length), *padding* (words that add tokens but no meaning).
