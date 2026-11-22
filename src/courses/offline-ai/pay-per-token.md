---
title: Pay-per-token APIs explained
summary: How API pricing works (input, output, cached and thinking tokens), what a real workload costs on Claude's API, and how that compares with running the same work on your own machine.
minutes: 25
updated: 2026-11-22
sources:
  - 'Anthropic Claude API pricing: models, prompt caching, batch processing (official page), https://platform.claude.com/docs/en/about-claude/pricing'
  - 'OpenAI API pricing (official page), https://openai.com/api/pricing/'
  - 'Google Gemini API pricing (official page), https://ai.google.dev/pricing'
quiz:
  - q: Why do output tokens cost more than input tokens on most APIs?
    choices: ['Writing is done one token at a time, while the prompt is read in one fast pass', 'Output tokens are longer words', 'It is random']
    ans: 0
    why: Prefill reads the whole prompt in parallel; each output token needs its own pass (Lesson 3.5). So output costs about 5 times more.
  - q: A reasoning model "thinks" 3,000 tokens before a 300-token answer. What are you billed for?
    choices: ['About 3,300 output tokens', '300 output tokens', 'Nothing for the thinking']
    ans: 0
    why: Thinking tokens are billed as output, even when the thinking is hidden from you.
  - q: The same 20,000-token instructions start every request. What lowers the bill most?
    choices: ['Prompt caching, so repeat reads cost about a tenth', 'Writing the instructions in capitals', 'Sending them twice']
    ans: 0
    why: Cached input is billed at a fraction of the normal input price (Lesson 3.8).
---

**Module 16 · about 25 minutes · read first: 3.4 and 3.8.** You'll be able to estimate an API bill and compare it with running locally.

<div class="bigidea">An API charges for every token in and every token out, so the bill grows with your volume, while a local model costs the same electricity whether you send ten jobs or ten thousand.</div>

## 1. Why this matters

Subscriptions are for people chatting. **APIs** (application programming interfaces: a way for a program to talk to the model) are for programs: scripts, agents, document pipelines and apps (Module 11). You pay for exactly the tokens you use, with no monthly fee.

For light use that is very cheap. For heavy automated use it can grow faster than you expect, because a script never gets tired. A local model does the same work for the cost of electricity.

## 2. How the price is built

Think of a taxi meter with two rates: a cheap one for the distance you ask about, and a dearer one for the distance the driver actually drives.

- **Input tokens:** everything you send: instructions, the conversation so far, documents, tool results.
- **Output tokens:** everything the model writes, **including thinking** (Lesson 3.4). Usually about five times the input price, because the model writes one token at a time but reads your prompt in one fast pass (Lesson 3.5).
- **Cached input:** a repeated start of the prompt (Lesson 3.8) is read from a cache at about a tenth of the input price. Writing to the cache costs a little extra the first time, and very short prompts are too small to cache.
- **Batch:** jobs that can wait up to 24 hours run at half price.
- **Tokens differ by model:** the same text can be a different number of tokens on different models (Lesson 3.2), so compare real counts, not words.

Prices are per million tokens, almost always in US$.

<div class="steps" data-fig="pay-per-token-bill">
<div class="step"><p><b>Count the tokens.</b> A summary job runs 2,000 times a month, sending 3,000 tokens and getting 800 back. That is 6 million tokens in and 1.6 million out.</p></div>
<div class="step"><p><b>Price them.</b> At example prices of US$3 in and US$15 out per million: input 6 × 3 = US$18, output 1.6 × 15 = US$24. Output is a quarter of the tokens but more than half the bill. Total US$42.</p></div>
<div class="step"><p><b>Cache the repeated part.</b> 2,000 of the 3,000 input tokens are the same instructions every time. Cached at a tenth: 4 million × US$0.30 = US$1.20, plus 2 million fresh × US$3 = US$6. Input falls to US$7.20; total US$31.20.</p></div>
<div class="step"><p><b>Batch it.</b> The summaries can wait overnight, so batch halves everything: US$15.60. Same work, a bit over a third of the first bill.</p></div>
</div>

Step through a few merges and watch letters become chunks.

<figure class="fig" data-fig="@ai-bpe-merge"><figcaption>A tokeniser is built by repeatedly merging the commonest neighbouring pair. Common chunks become single tokens (cheap), rare words stay in several pieces (costly). This is why token counts differ from word counts.</figcaption></figure>

## 3. Work out your own bill

The defaults are a document-summary job: 2,000 jobs a month, 3,000 tokens in, 800 out.

<!--fig:api-bill-->

Two things stand out. The smallest model costs a fraction of the largest for the same job, so match the model to the task. And caching plus batch can cut a steady pipeline's bill by more than half.

```math
\text{cost} = \frac{J \times (t_\text{in} \times p_\text{in} + t_\text{out} \times p_\text{out})}{1{,}000{,}000}
```

<div class="meaning">

<dl>
<dt>J</dt><dd>jobs (requests) in a month</dd>
<dt>t<sub>in</sub>, t<sub>out</sub></dt><dd>tokens sent and tokens written back in one job; thinking tokens count as output</dd>
<dt>p<sub>in</sub>, p<sub>out</sub></dt><dd>the price per million input and output tokens; output is usually about five times input</dd>
<dt>÷ 1,000,000</dt><dd>prices are quoted per million tokens</dd>
<dt>Physical meaning</dt><dd>Every token is a slice of a data-centre chip's time that you rent. Writing costs more than reading because the chip must take one full pass per written token. Double the jobs and the bill doubles; a machine you own costs the same however busy it is.</dd>
</dl>

</div>

<div class="problem" data-problem="pay-per-token-bill"></div>

## 4. The same work at home

The electricity per million tokens from Lesson 3.9 is often a few cents to a few tens of cents. A 12B local model writes 800 tokens in about 20 to 40 seconds on a starter machine, so 2,000 jobs is roughly 10 to 20 hours of machine time a month.

On money alone, local wins for steady high-volume work once the hardware is paid for. The API wins when you need the strongest model, very long documents, or more speed than one box gives, and when volume is small.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** API cost scales with tokens; local cost scales with hours.

**Equation:** API cost per month = jobs × (input tokens × input price + output tokens × output price) ÷ 1,000,000.

**Analogy:** a taxi meter against your own car's fuel. The meter runs for every kilometre; the car costs you up front, then only fuel.

**Try it:** 500 jobs, 10,000 tokens in, 1,000 out, at US$2 in and US$10 out per million? (500 × (0.02 + 0.01) = US$15 a month.)
</details>

<div class="myth">

**"Thinking is free, because I never see it."** Reasoning models are billed for their thinking as output tokens, at the higher price, even when the app hides the thinking. A 300-token answer after 3,000 tokens of thinking is billed as about 3,300 output tokens. Turn thinking down for easy jobs.

</div>

## 5. Worked example

*Made-up workload, real list prices.* A small online shop classifies 30,000 customer emails a month into 8 categories. Each email is about 400 tokens, with 2,000 tokens of fixed instructions and examples in front, and the answer is 5 tokens. On Claude Haiku 5.5 with the instructions cached: input ≈ 30,000 × (400 × 0.10 + 2,000 × 0.01) ÷ 10⁶ ≈ US$1.80, output ≈ 30,000 × 5 × 0.50 ÷ 10⁶ ≈ US$0.08. Under US$2 a month: not worth buying hardware for.

A law firm summarising 2,000 long contracts a month on the largest model, by contrast, can reach hundreds of dollars, and the contracts may not be allowed to leave anyway: a clear case for local.

<div class="problem" data-problem="pay-per-token-cache"></div>

## 6. Practice

1. Estimate your monthly tokens for one script you run or plan to run.
2. Why must a budget include thinking tokens?
3. When is the cheapest API model a better deal than buying hardware?

<details>
<summary>Answers</summary>

1. Jobs × (tokens in + tokens out); measure a few real runs (Lesson 3.10).
2. They are billed as output, at the higher price, and can be many times longer than the answer.
3. When volume is small or bursty and the data is allowed to leave: the bill stays tiny and there is nothing to buy or maintain.
</details>

**New words:** *API*, *input and output price*, *cached input*, *batch processing*, *per million tokens*.

<div class="keypoints">

- APIs bill per million tokens: input, output (including hidden thinking, about 5 times dearer), cached input (about a tenth) and batch (half price).
- Monthly cost = jobs × (tokens in × input price + tokens out × output price) ÷ 1,000,000.
- Caching repeated instructions and batching jobs that can wait can cut a steady pipeline's bill by more than half.
- Small or bursty volume: the API is cheap and simple. Steady high volume or data that must stay in: local wins after break-even.

</div>
