---
title: 'The quality gap: where cloud models still lead'
seoTitle: 'Quality gap: open vs cloud AI models | Offline AI'
summary: An honest look at where the best cloud models still beat what you can run at home, where open models have caught up, and how to test the gap on your own work instead of trusting leaderboards.
minutes: 20
updated: 2026-11-22
sources:
  - 'Epoch AI, "How far behind are open models?" (open models trail the best closed models by roughly a year on benchmarks), 2024, https://epoch.ai/blog/open-models-report'
  - 'Morph, "Best Open Source LLMs (November 2026)" (third-party ranking), https://www.morphllm.com/best-open-source-llm'
  - 'LMArena (public, crowd-voted model comparison), https://lmarena.ai'
quiz:
  - q: Where is the gap between frontier cloud models and home-sized open models usually largest?
    choices: ['Long, multi-step reasoning, big coding changes and very long documents', 'Fixing spelling', 'Short summaries']
    ans: 0
    why: Everyday tasks are close; the hardest, longest tasks still favour the biggest models.
  - q: The largest open models are close to the frontier. Why does that not settle it for most people?
    choices: ['They need cluster-sized hardware, not a home machine', 'They are illegal', 'They only speak one language']
    ans: 0
    why: Models such as Kimi K3 or DeepSeek-V4.1 are open but far too big for a home box. What you can run is usually 4B to 120B.
  - q: What is the best way to measure the gap for your work?
    choices: ['Run 10 to 20 of your own real tasks through both and compare blind', 'Read one leaderboard', 'Ask the model which is better']
    ans: 0
    why: Leaderboards test general skills. Your tasks, scored without knowing which model wrote which answer, tell you what matters.
---

**Module 17 · about 20 minutes · read first: 7.3 and 7.4.** You'll be able to say where a local model is good enough for your work and where it is not, with evidence.

<div class="bigidea">Home-sized open models match the cloud on most everyday tasks but still trail on the longest and hardest ones, and the only gap that matters is the one you measure on your own work.</div>

## 1. Why this matters

People go wrong in both directions. Some believe local models are toys; others think they match the best cloud models at everything. Neither is true. Knowing the real gap lets you send each job to the right place (Lesson 16.5).

## 2. Three groups of models

- **Frontier cloud models** (Anthropic's Claude, OpenAI's GPT, Google's Gemini top tiers): the strongest available. They run on data-centre clusters and cannot be downloaded.
- **Frontier open models** (for example Kimi K3, DeepSeek-V4.1, GLM-5.3 in late 2026): downloadable and close to the frontier on many tests, but hundreds of billions to trillions of parameters. Possible on a cluster, not at home.
- **Home-sized open models** (Gemma 4, Qwen3.8-27B, gpt-oss-120b and similar): what this course runs. Very good, and behind the first group on the hardest work.

Research groups that track **benchmarks** (standard tests given to every model) have found that open models tend to reach a given score several months to about a year after the best closed models. The home-sized ones sit a little further back.

Try it: lower the bits to 3 or 2, then compare one scale for everything against one per block of 32.

<figure class="fig" data-fig="@ai-quant-grid"><figcaption>Fewer bits means fewer levels, so every weight is rounded more. One outlier stretches a shared scale and crushes the small weights, which is why formats give each small block its own scale.</figcaption></figure>

## 3. Where the gap is small

Summaries, drafting and rewriting, translation between major languages, sorting and pulling facts out of text, answering from your own documents with search (Module 12), everyday coding help, and chat. For these, a good 12B to 30B model is often hard to tell apart from a cloud model in a blind test.

Try it: set a 3-point gap, then slide the number of questions from 20 to 5000 and press Run 100 tests.

<figure class="fig" data-fig="@ai-bench-noise"><figcaption>A benchmark score is a measurement with error. With few questions a small lead is often just luck; with thousands the better model reliably ranks first. Always ask how many questions.</figcaption></figure>

## 4. Where the gap is large

- Long chains of reasoning (hard maths, tricky planning, legal or scientific argument).
- Large coding changes across many files, and long agent runs (Module 13) where small mistakes add up.
- Very long documents: home machines run out of memory before they reach the long contexts cloud models handle (Lesson 17.3).
- Up-to-date knowledge, unless you add search or documents.
- Less common languages, and specialist knowledge the small model never saw enough of.

## 5. Test it yourself

1. Collect 10 to 20 real tasks from your work with a good answer for each.
2. Run each through your local model and a cloud model.
3. Hide which answer came from where and score them (or ask a colleague to). This is a **blind test**: like a taste test with the labels covered.
4. Count wins, ties and losses, and note the kinds of task where local lost.

<div class="steps">
<div class="step"><p><b>Collect.</b> A marketing agency picks 15 real tasks from last month: social posts, product descriptions, translations, two strategy reports and two market summaries.</p></div>
<div class="step"><p><b>Run both.</b> Each task goes to a local 27B model and to a cloud model. The answers are shuffled and labelled A and B.</p></div>
<div class="step"><p><b>Score blind.</b> Two staff score each pair without knowing which is which. Local ties or wins on <b>11 of 15</b>.</p></div>
<div class="step"><p><b>Look at the losses.</b> All 4 losses share a pattern: two long strategy reports and two pieces needing current market facts.</p></div>
<div class="step"><p><b>Decide.</b> The 11 kinds of task move to local. One cloud seat stays for strategy and research.</p></div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a model is good enough when it passes your test often enough for the cost of a mistake.

**Equation:** expected cost of errors = jobs × error rate × cost per error. Compare that with the savings from going local.

**Analogy:** a junior colleague. Fine for most letters; you still ask the senior partner about the big case.

**Try it:** 1,000 jobs a month, local model wrong 3% of the time, each mistake costs 10 minutes to catch and fix? (30 mistakes × 10 = 300 minutes, 5 hours a month. Worth it if local saves more than that.)
</details>

```math
\text{error cost} = J \times e \times k
```

<div class="meaning">

<dl>
<dt>J</dt><dd>jobs a month the model handles</dd>
<dt>e</dt><dd>error rate: the share of jobs it gets wrong in your blind test</dd>
<dt>k</dt><dd>cost of one mistake: minutes to catch and fix it, or money if it slips through</dd>
<dt>Physical meaning</dt><dd>"Good enough" is not a feeling; it is a trade. A model that is wrong 3% of the time is fine for social posts where a slip costs a minute, and not fine for dosages where one slip can hurt someone. The same error rate can be cheap or unacceptable depending on k.</dd>
</dl>

</div>

<div class="problem" data-problem="quality-gap-error-hours"></div>

<div class="myth">

**"Open models have caught up, so local is as good as the cloud."** The largest open models are close to the frontier, but they need cluster-sized hardware. What fits at home (4B to 120B) is excellent at everyday work and still behind on long reasoning, big code changes and very long documents. Test on your own tasks rather than reading a leaderboard.

</div>

## 6. Worked example

*Made-up test.* A marketing agency tests 15 real tasks. A local 27B model ties or wins on 11: social posts, product descriptions, translations into French and Hindi. It loses on 4: two long strategy reports and two pieces needing current market facts. The agency moves the 11 kinds of task to local and keeps one cloud seat for strategy and research.

## 7. Practice

1. Pick five tasks from your work for a blind test.
2. Why should you hide which model wrote which answer?
3. Name one task in your work where a 3% error rate would be unacceptable.

<details>
<summary>Answers</summary>

1. Your answer; keep the task and a good answer side by side.
2. Knowing the source changes how you judge it, in either direction.
3. For example: dosages, legal deadlines, figures in a financial filing. These need a human check whatever the model.
</details>

**New words:** *frontier model*, *blind test*, *benchmark lag*.

<div class="keypoints">

- Three groups: frontier cloud models, frontier open models (too big for home) and home-sized open models.
- The gap is small on summaries, drafting, translation of major languages, extraction and everyday code.
- The gap is large on long reasoning, big code changes, long agent runs, very long documents and current facts.
- Measure it with a blind test of 10 to 20 of your own tasks.
- Expected error cost = jobs × error rate × cost per error: the same rate can be fine or unacceptable.

</div>
