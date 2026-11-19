---
title: Pay-per-token APIs explained
summary: How API pricing works (input, output, cached and thinking tokens), what a real workload costs on Claude's API, and how that compares with running the same work on your own machine.
minutes: 25
updated: 2026-11-19
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

## 1. Why this matters

Subscriptions are for people chatting. APIs are for programs: scripts, agents, document pipelines and apps (Module 11). You pay for exactly the tokens you use, with no monthly fee. For light use that is very cheap; for heavy automated use it can grow faster than you expect. Local models are the same work at a cost of electricity.

## 2. How the price is built

- **Input tokens:** everything you send: instructions, the conversation so far, documents, tool results.
- **Output tokens:** everything the model writes, **including thinking** (Lesson 3.4). About five times the input price.
- **Cached input:** a repeated start of the prompt (Lesson 3.8) is read from cache at about a tenth of the input price. Writing to the cache costs a little extra the first time, and very short prompts are too small to cache.
- **Batch:** jobs that can wait up to 24 hours run at half price.
- **Tokens differ by model:** the same text can be a different number of tokens on different models (Lesson 3.2), so compare real counts, not words.

Prices are per million tokens, almost always in US$.

## 3. Work out your own bill

The defaults are a document-summary job: 2,000 jobs a month, 3,000 tokens in, 800 out.

<!--fig:api-bill-->

Two things stand out. The smallest model costs a fraction of the largest for the same job, so match the model to the task. And caching plus batch can cut a steady pipeline's bill by more than half.

## 4. The same work at home

The electricity per million tokens from Lesson 3.9 is often a few cents to a few tens of cents. A 12B local model writes 800 tokens in about 20 to 40 seconds on a starter machine, so 2,000 jobs is roughly 10 to 20 hours of machine time a month. On money alone, local wins for steady high-volume work once the hardware is paid for. The API wins when you need the strongest model, very long documents, or more speed than one box gives, and when volume is small.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** API cost scales with tokens; local cost scales with hours.

**Equation:** API cost per month = jobs × (input tokens × input price + output tokens × output price) ÷ 1,000,000.

**Analogy:** a taxi meter against your own car's fuel. The meter runs for every kilometre; the car costs you up front, then only fuel.

**Try it:** 500 jobs, 10,000 tokens in, 1,000 out, at US$2 in and US$10 out per million? (500 × (0.02 + 0.01) = US$15 a month.)
</details>

## 5. Worked example

*Made-up workload, real list prices.* A small online shop classifies 30,000 customer emails a month into 8 categories. Each email is about 400 tokens, with 2,000 tokens of fixed instructions and examples in front, and the answer is 5 tokens. On Claude Haiku 5.5 with the instructions cached: input ≈ 30,000 × (400 × 0.10 + 2,000 × 0.01) ÷ 10⁶ ≈ US$1.80, output ≈ 30,000 × 5 × 0.50 ÷ 10⁶ ≈ US$0.08. Under US$2 a month: not worth buying hardware for. A law firm summarising 2,000 long contracts a month on the largest model, by contrast, can reach hundreds of dollars, and the contracts may not be allowed to leave anyway: a clear case for local.

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
