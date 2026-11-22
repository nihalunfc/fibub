---
title: 'Attention: each word looks at the others'
seoTitle: 'Attention in transformers explained: queries, keys, values'
summary: 'In "the cat sat on the mat because it was tired", what is "it"? Attention lets each word score every other word, softmax the scores and mix in what it needs. Explore a live attention map and work the maths.'
minutes: 30
updated: 2026-11-22
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
sources:
  - 'Vaswani, A. et al. (2017), Attention Is All You Need, Advances in Neural Information Processing Systems 30 https://arxiv.org/abs/1706.03762'
  - 'Bahdanau, D., Cho, K. and Bengio, Y. (2014), Neural Machine Translation by Jointly Learning to Align and Translate https://arxiv.org/abs/1409.0473'
  - 'Jurafsky, D. and Martin, J. H., Speech and Language Processing, 3rd edition draft, chapter on transformers and large language models https://web.stanford.edu/~jurafsky/slp3/'
---

**Module 10 · about 30 minutes · read first: 1.4, 10.2, 10.3.** You'll be able to explain queries, keys and values, work out an attention output by hand, and say why attention made large language models possible.

<div class="bigidea">Attention lets every word ask the other words "are you what I need?", then take a blend of the answers, most from the best match.</div>

## 1. Why this matters

Attention is the idea behind the transformer ("Attention is all you need", Vaswani and colleagues, Google, 2017), and so behind every modern LLM. It also powers models for images, speech and proteins.

It fixed the forgetting problem of recurrent networks (Lesson 9.7). Any word can reach any other word in one step, and all positions are worked out at the same time on a graphics card, which makes training on huge amounts of text practical.

## 2. The idea

In "the cat sat on the mat because it was tired", the word "it" means nothing on its own. To understand it, the model must find the word it refers to. Attention lets every word ask a question of every other word, using three lists of numbers:

- **Query** `$\mathbf{q}$`: what this word is looking for ("an animal or person I might refer to").
- **Key** `$\mathbf{k}$`: what each word offers, like a label on a box ("I am an animal").
- **Value** `$\mathbf{v}$`: what is inside the box, passed on if chosen.

A word's score for another word is the dot product of its query with that word's key (multiply place by place and add). It is high when the two point the same way (Lesson 1.4). **Softmax** turns one word's scores into weights that are all positive and add up to 1. The word's new vector is the weighted average of the values.

**Everyday picture:** you walk into a party wanting someone to talk football with (your query). Everyone wears a name badge listing their interests (their keys). You spend most of your time with the best match, a bit with the next, and come away with a mix of what they told you (their values).

<!--fig:attention-map-->

Queries, keys and values are made from each word's embedding by three learned weight tables, so the model learns what to look for. Real models run several **heads** side by side, each with its own tables, so one head can track grammar while another tracks who "it" is.

Try it: drag the score bars, press Add 2 to all, and move the temperature.

<figure class="fig" data-fig="@ai-softmax-lab"><figcaption>Softmax turns any scores into probabilities that are positive and add to 100%. Adding the same number to every score changes nothing; a low temperature makes the leader win nearly everything and a high one flattens the odds.</figcaption></figure>

## 3. One row, step by step

Here is one word's attention worked out in full, with tiny numbers. Its query is (1, 0). Three words offer keys (2, 0), (0, 2) and (1, 1), with values (1, 0), (0, 1) and (1, 1). Each key has d = 2 numbers.

<div class="steps" data-fig="attention-row">
<div class="step"><p><b>Score each word.</b> Dot the query with each key: (1, 0)·(2, 0) = <b>2</b>, (1, 0)·(0, 2) = <b>0</b>, (1, 0)·(1, 1) = <b>1</b>. Word 1 matches best.</p></div>
<div class="step"><p><b>Scale.</b> Divide by √d = √2 = 1.414: scores <b>1.414, 0, 0.707</b>. This stops long vectors from giving huge scores.</p></div>
<div class="step"><p><b>Make them positive.</b> Take e to each score: <b>4.11, 1.00, 2.03</b>. Their total is 7.14.</p></div>
<div class="step"><p><b>Turn into weights.</b> Divide each by the total: <b>0.576, 0.140, 0.284</b>. They add up to 1, like slices of a pie.</p></div>
<div class="step"><p><b>Blend the values.</b> 0.576 × (1, 0) + 0.140 × (0, 1) + 0.284 × (1, 1) = <b>(0.860, 0.424)</b>. The word takes mostly what word 1 offers, plus a little of the rest.</p></div>
</div>

<div class="meaning">

<dl>
<dt><b>q</b><sub>i</sub></dt><dd>word i's query: what it is looking for</dd>
<dt><b>k</b><sub>j</sub></dt><dd>word j's key: the label saying what it offers</dd>
<dt><b>v</b><sub>j</sub></dt><dd>word j's value: the information it hands over if chosen</dd>
<dt>s<sub>ij</sub> = <b>q</b><sub>i</sub>·<b>k</b><sub>j</sub> / √d</dt><dd>how well word j matches what word i wants, scaled by the length d of the vectors</dd>
<dt>a<sub>ij</sub></dt><dd>the attention weight: softmax of word i's scores, all positive, adding up to 1</dd>
<dt>Physical meaning</dt><dd>Attention is each word deciding whom to listen to. "it" puts most of its weight on "cat", so after attention the vector for "it" carries the cat's information, and the model "knows" what "it" means in this sentence.</dd>
</dl>

</div>

<div class="problem" data-problem="attention-weight"></div>

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

Try it: tap the word "it" in the Meaning link head, then switch the mask between causal and full.

<figure class="fig" data-fig="@ai-attention-heads"><figcaption>Each head learns its own pattern of who looks at whom, and a weight row always adds to 100%. In a text generator the causal mask hides later words, because they have not been written yet.</figcaption></figure>

## 4. Worked example

One query `$\mathbf{q} = (1, 0)$`, three words with keys `$\mathbf{k}_1 = (2, 0)$`, `$\mathbf{k}_2 = (0, 2)$`, `$\mathbf{k}_3 = (1, 1)$` and values `$\mathbf{v}_1 = (1, 0)$`, `$\mathbf{v}_2 = (0, 1)$`, `$\mathbf{v}_3 = (1, 1)$`. Here `$d = 2$`, so divide by `$\sqrt 2 = 1.414$`.

| word | q · k | score | e^score | weight |
|---|---|---|---|---|
| 1 | 2 | 1.414 | 4.11 | 0.576 |
| 2 | 0 | 0 | 1.00 | 0.140 |
| 3 | 1 | 0.707 | 2.03 | 0.284 |

Output = 0.576 × (1, 0) + 0.140 × (0, 1) + 0.284 × (1, 1) = **(0.860, 0.424)**. The word takes mostly what word 1 offers, because word 1's key matches its query best, but it still blends in some of the others.

**The price of looking at everything.** Each of `$n$` tokens scores all `$n$` tokens, so the work grows with `$n^2$`. That is why long contexts are expensive.

<div class="problem" data-problem="attention-cost"></div>

<div class="myth">

**"Attention means the model understands, like a person paying attention."** It is arithmetic: dot products, a softmax and a weighted average. The weights often line up with what a person would look at ("it" → "cat"), but they are learned patterns, not awareness, and they are not always a reliable explanation of why the model answered as it did.

</div>

## 5. Practice

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

<div class="keypoints">

- Each word makes a query (what it wants), a key (what it offers) and a value (what it passes on).
- Score = query · key ÷ √d; softmax turns one word's scores into weights that add up to 1.
- A word's new vector is the weighted average of the values, so "it" can take on the meaning of "cat".
- When writing, a causal mask stops each word from seeing words that come after it.
- Every token scores every token, so the work grows with the square of the context length.

</div>
