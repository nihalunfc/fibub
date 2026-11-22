---
title: Input, output and thinking tokens
summary: Tokens you send, tokens the model writes, and the hidden "thinking" tokens reasoning models add. Why they are counted separately and what each costs in time and money.
minutes: 20
updated: 2026-11-22
sources:
  - 'Wei, J. et al. (2022), Chain-of-Thought Prompting Elicits Reasoning in Large Language Models https://arxiv.org/abs/2201.11903'
  - 'Ollama API documentation (prompt_eval_count and eval_count: input and output tokens per request) https://github.com/ollama/ollama/blob/main/docs/api.md'
  - 'Jurafsky, D. and Martin, J. H., Speech and Language Processing, 3rd edition draft, chapter on large language models https://web.stanford.edu/~jurafsky/slp3/'
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

<div class="bigidea">Tokens you send are read quickly in one go; tokens the model writes, including any hidden thinking, come out one at a time, so they cost the most time and money.</div>

## 1. Why this matters

When a local job feels slow, or a cloud plan runs out early, the cause is usually one kind of token: long outputs, or a reasoning model thinking at length. Knowing which lets you fix the right thing.

## 2. Three kinds

- **Input tokens:** everything you send, the system prompt, history, documents and your question. Read in one fast batch.
- **Output tokens:** the answer, written one token at a time.
- **Thinking (reasoning) tokens:** some models write out their working first, often hidden or folded in the interface, then the final answer. They count as output: they take writing time and, in the cloud, are usually billed as output.

Think of a letter. Reading the letter you received takes a minute; writing your reply by hand takes much longer; and any rough draft you throw away still took writing time.

## 3. Why the difference matters

On your machine, input is cheap in time and output is expensive. In the cloud, output tokens usually cost several times more than input tokens, and plan limits drain fastest with long answers and heavy thinking. Either way, the biggest savings come from **shorter outputs** and **thinking only when needed** (Lessons 3.6 and 10.4).

<div class="myth">

**"Thinking tokens are free, because I never see them."** They are hidden or folded away, but the model still writes every one at normal writing speed, and cloud APIs usually bill them as output. A reasoning model that thinks for 1,500 tokens before a 300-token answer has written six times as much as you read.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** total time is reading time plus writing time, and writing is usually the bigger part.

**Equation:** time ≈ input ÷ reading speed + (thinking + output) ÷ writing speed.

**Analogy:** a student in an exam: reading the question is quick, writing the essay is slow, and rough working in the margin adds writing time even though it is not marked.

**Try it:** 2,000 input tokens at 500 per second, 1,500 thinking and 300 answer tokens at 15 per second? (4 s + 120 s = about 2 minutes. Without thinking: 4 + 20 = 24 s.)
</details>

Here is that request, step by step.

<div class="steps">
<div class="step"><p><b>Read the input.</b> 2,000 tokens (instructions, a document and the question), all at once, at 500 per second: 2,000 ÷ 500 = <b>4 seconds</b>.</p></div>
<div class="step"><p><b>Think.</b> The model writes 1,500 tokens of working, one at a time, at 15 per second: <b>100 seconds</b>. You may see only "Thinking…".</p></div>
<div class="step"><p><b>Answer.</b> 300 tokens at 15 per second: <b>20 seconds</b>.</p></div>
<div class="step"><p><b>Total.</b> 4 + 100 + 20 = <b>124 seconds</b>. Writing took 97% of the time.</p></div>
<div class="step"><p><b>Thinking off.</b> 4 + 20 = <b>24 seconds</b>, five times quicker. Worth it for easy questions; keep thinking on for hard ones.</p></div>
</div>

<div class="meaning">

<dl>
<dt>input</dt><dd>tokens you send: system prompt, history, documents and the question</dd>
<dt>reading speed</dt><dd>how many input tokens per second the machine can process in one batch (prefill, Lesson 3.5)</dd>
<dt>thinking + output</dt><dd>every token the model writes, working and answer together</dd>
<dt>writing speed</dt><dd>how many tokens per second it writes, one at a time (decode)</dd>
<dt>Physical meaning</dt><dd>Writing speed is usually 10 to 100 times slower than reading speed, so the length of what the model writes decides how long you wait. To speed a job up, shorten the answer or switch thinking off before you shorten the input.</dd>
</dl>

</div>

<div class="problem" data-problem="input-output-thinking-time"></div>

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

<div class="keypoints">

- Input tokens are everything you send; they are read in one fast batch.
- Output tokens are written one at a time, so they take most of the time and usually cost more in the cloud.
- Thinking tokens are working a reasoning model writes before its answer; they count as output.
- Time ≈ input ÷ reading speed + (thinking + output) ÷ writing speed.
- The biggest savings: shorter answers and thinking only when the question needs it.

</div>
