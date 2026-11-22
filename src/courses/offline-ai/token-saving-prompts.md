---
title: 'Saving tokens 1: short, clear prompts'
seoTitle: 'Write prompts that use fewer tokens | Offline AI'
summary: The cheapest token is the one you never send or receive. How to write prompts that are short, clear and get short answers, without losing quality.
minutes: 20
updated: 2026-11-22
sources:
  - 'Ollama API documentation (num_predict caps the answer length; format requests structured output) https://github.com/ollama/ollama/blob/main/docs/api.md'
  - 'Brown, T. et al. (2020), Language Models are Few-Shot Learners (examples in the prompt) https://arxiv.org/abs/2005.14165'
  - 'Anthropic, Prompt engineering overview (official documentation) https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview'
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

<div class="bigidea">The cheapest token is one you never send or receive, and the biggest saving is asking for a short, exact answer.</div>

## 1. Why this matters

On a subscription, saved tokens mean you hit limits later. On an API, they are money. On your own machine, they are time: a job that writes half as many tokens finishes in about half the time.

## 2. Ask for less output

Output costs most (Lesson 3.4). Say exactly what shape you want, the way you would brief a busy colleague: "Just the total and the due date, please":

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

<div class="meaning">

<dl>
<dt>input, output</dt><dd>tokens sent and tokens written for one job</dd>
<dt>price_in, price_out</dt><dd>cloud prices per token; output is usually several times dearer</dd>
<dt>read speed, write speed</dt><dd>tokens per second on your own machine; writing is much slower</dd>
<dt>Physical meaning</dt><dd>Each word the model writes costs time locally and money in the cloud, and writing costs far more than reading. Trimming a long answer to the part you will actually use is the fastest way to make a job cheaper, without changing the model or the hardware.</dd>
</dl>

</div>

<div class="myth">

**"Cutting 'please' and 'thank you' is how you save tokens."** Polite words cost a handful of input tokens, which are read in a blink. The real cost is a long answer. One instruction such as "3 bullets, 15 words each" can save hundreds of output tokens per request. Keep your manners; trim the answer.

</div>

## 5. Worked example

*Made-up numbers.* A recruiter screens 300 CVs a week with a local model. Step through the change.

<div class="steps">
<div class="step"><p><b>Old prompt:</b> "Give a detailed assessment." Answers average <b>450 tokens</b>.</p></div>
<div class="step"><p><b>Old weekly time.</b> 300 × 450 = 135,000 tokens. At 12 tokens per second: 135,000 ÷ 12 = 11,250 seconds, about <b>3 hours 8 minutes</b> of writing.</p></div>
<div class="step"><p><b>New prompt:</b> "Fit: yes/maybe/no; 3 reasons, 10 words each." Answers average <b>60 tokens</b>.</p></div>
<div class="step"><p><b>New weekly time.</b> 300 × 60 = 18,000 tokens ÷ 12 = 1,500 seconds: <b>25 minutes</b>. Same CVs, same model, same decisions.</p></div>
</div>

<div class="problem" data-problem="token-saving-prompts-time"></div>

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

<div class="keypoints">

- Output tokens are the slow, expensive ones: ask for an exact, short shape ("3 bullets, 15 words each", "only the JSON").
- Set a max tokens limit as a safety net.
- Send less input: cut padding, put standing instructions in the system prompt once, send only the relevant part.
- Short is not vague: keep the task, audience, format and rules; one example helps with unusual formats.
- Time ≈ input ÷ read speed + output ÷ write speed, so halving the answer roughly halves the job.

</div>
