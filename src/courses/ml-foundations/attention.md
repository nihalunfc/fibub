---
title: 'Attention: each word looks at the others'
seoTitle: 'Attention in transformers explained: queries, keys, values'
summary: 'In "the cat sat on the mat because it was tired", what is "it"? Attention lets each word score every other word, softmax the scores and mix in what it needs. Explore a live attention map and work the maths.'
minutes: 30
updated: 2026-11-21
quiz:
  - q: 'In attention, the weights in one word''s row:'
    choices: ['Add up to 1, because they come from a softmax', 'Are always 0 or 1', 'Are the word''s embedding']
    ans: 0
    why: Softmax turns any scores into positive numbers that add up to 1, so the output is a weighted average of the values.
  - q: Why divide the scores by √d?
    choices: ['Dot products of long vectors are large, which would make the softmax nearly all-or-nothing', 'To make them negative', 'To save memory']
    ans: 0
    why: Scaling keeps the scores in a range where softmax still spreads its weight and gradients flow.
  - q: 'When a model writes text, a word may attend to:'
    choices: ['Itself and the words before it', 'Only the next word', 'Every word, including ones not yet written']
    ans: 0
    why: The causal mask hides the future, since those words don't exist yet when the model is choosing the next one.
---

**Module 10 · about 30 minutes · read first: 1.4, 10.2, 10.3.** You'll be able to explain queries, keys and values, compute an attention output by hand, and say why attention made large language models possible.

## 1. Why this matters

Attention is the idea behind the transformer ("Attention is all you need", Vaswani and colleagues, Google, 2017) and so behind every modern LLM, as well as models for images, speech and proteins. It solves the forgetting problem of recurrent networks (Lesson 9.7): any word can reach any other word in one step, and all positions are computed at once on a graphics card.

## 2. The idea

In "the cat sat on the mat because it was tired", the word "it" is ambiguous on its own. To understand it, the model must find the word it refers to. Attention lets every word ask a question of every other word:

- **Query** `$\mathbf{q}$`: what this word is looking for ("an animal or person I might refer to").
- **Key** `$\mathbf{k}$`: what each word offers ("I am an animal").
- **Value** `$\mathbf{v}$`: what each word passes on if chosen.

A word's score for another word is the dot product of its query with that word's key: high when they point the same way (Lesson 1.4). Softmax turns one word's scores into weights that add up to 1, and the word's new vector is the weighted average of the values.

<!--fig:attention-map-->

Queries, keys and values are made from each word's embedding by three learned weight matrices, so the model learns what to look for. Real models run several **heads** side by side, each with its own matrices, so one head can track grammar while another tracks who "it" is.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** score every pair, softmax the scores, average the values.

For word embeddings `$\mathbf{x}_j$` and learned matrices `$\mathbf{W}_Q, \mathbf{W}_K, \mathbf{W}_V$`: `$\mathbf{q}_i = \mathbf{W}_Q\mathbf{x}_i$`, `$\mathbf{k}_j = \mathbf{W}_K\mathbf{x}_j$`, `$\mathbf{v}_j = \mathbf{W}_V\mathbf{x}_j$`. With `$d$` numbers per key,

```math
s_{ij} = \frac{\mathbf{q}_i \cdot \mathbf{k}_j}{\sqrt{d}}
```

```math
a_{ij} = \frac{e^{s_{ij}}}{\sum_m e^{s_{im}}}, \qquad \mathbf{out}_i = \sum_j a_{ij} \, \mathbf{v}_j
```

In matrix form, for all words at once: `$\operatorname{softmax}(\mathbf{Q}\mathbf{K}^\top / \sqrt{d})\,\mathbf{V}$`.

**Causal mask:** when writing text, set `$s_{ij} = -\infty$` for `$j > i$`, so `$e^{s_{ij}} = 0$` and no word sees the future.

**Cost:** every word scores every word, so `$n$` tokens take about `$n^2$` scores. Doubling the context quadruples this part of the work.

**Analogy:** a library search. Your query is the question; each book's key is its catalogue entry; the value is what's inside. You read a blend of the best-matching books, most from the closest match.

**Try it:** scores 2, 0 and 0 for three words. Weights? (`$e^2 = 7.39$`; total `$7.39 + 1 + 1 = 9.39$`; weights 0.79, 0.11, 0.11.)
</details>

## 3. Worked example

One query `$\mathbf{q} = (1, 0)$`, three words with keys `$\mathbf{k}_1 = (2, 0)$`, `$\mathbf{k}_2 = (0, 2)$`, `$\mathbf{k}_3 = (1, 1)$` and values `$\mathbf{v}_1 = (1, 0)$`, `$\mathbf{v}_2 = (0, 1)$`, `$\mathbf{v}_3 = (1, 1)$`. Here `$d = 2$`, so divide by `$\sqrt 2 = 1.414$`.

| word | q · k | score | e^score | weight |
|---|---|---|---|---|
| 1 | 2 | 1.414 | 4.11 | 0.576 |
| 2 | 0 | 0 | 1.00 | 0.140 |
| 3 | 1 | 0.707 | 2.03 | 0.284 |

Output = 0.576 × (1, 0) + 0.140 × (0, 1) + 0.284 × (1, 1) = **(0.860, 0.424)**. The word takes mostly what word 1 offers, because word 1's key matches its query best, but it still blends in some of the others.

## 4. Practice

1. In the simulation, which word does "sat" look at most, and why might a verb care about it?
2. Tick "Only look back". Why does the row for "the" (the first word) become a single 1?
3. A model's context grows from 4,000 to 32,000 tokens. Roughly how much more attention work is that?

<details>
<summary>Answers</summary>

1. "cat": a verb needs its subject (who sat), and the verb's query asks for an animal.
2. The first word can see only itself, so all its weight goes there.
3. 8 times the tokens, so about 64 times the scores (8²).
</details>

**Try it on your own data:** the [[embedding-visualiser]] shows which of your items point the same way, which is exactly what a query and a key measure.

**New words:** *attention*, *self-attention*, *query*, *key*, *value*, *attention weights*, *attention head*, *causal mask*, *transformer*.
