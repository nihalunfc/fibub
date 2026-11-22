---
title: 'The transformer block'
seoTitle: 'The transformer block explained step by step, with sizes'
summary: 'A transformer is the same block stacked many times: attention, add and normalise, a small feed-forward network, add and normalise. Step through one from words to next-word probabilities and count its parameters.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'The output of a transformer block has:'
    choices: ['The same shape as its input, so blocks can be stacked', 'One number per token', 'Twice as many numbers as its input']
    ans: 0
    why: Each token goes in and comes out as d numbers; that is why the same kind of block can be repeated dozens of times.
  - q: 'A residual connection:'
    choices: ['Adds a layer''s input to its output', 'Removes outliers', 'Splits the data into folds']
    ans: 0
    why: x + layer(x) lets information and gradients skip straight past a layer, which keeps very deep networks trainable.
  - q: With d = 512 numbers per token, roughly how many weights are in one block?
    choices: ['About 3 million (12 × 512²)', 'About 512', 'About 50,000']
    ans: 0
    why: Attention has 4 matrices of d × d, the feed-forward part 2 of d × 4d, so 12d² ≈ 3.1 million.
sources:
  - 'Vaswani, A. et al. (2017), Attention Is All You Need, Advances in Neural Information Processing Systems 30 https://arxiv.org/abs/1706.03762'
  - 'Ba, J. L., Kiros, J. R. and Hinton, G. E. (2016), Layer Normalization https://arxiv.org/abs/1607.06450'
  - 'He, K., Zhang, X., Ren, S. and Sun, J. (2016), Deep Residual Learning for Image Recognition, CVPR https://doi.org/10.1109/CVPR.2016.90'
  - 'Radford, A. et al. (2019), Language Models are Unsupervised Multitask Learners (GPT-2), OpenAI technical report'
---

**Module 10 · about 25 minutes · read first: 9.3, 10.4.** You'll be able to name the parts of a transformer block in order, say what each one does to the numbers, and estimate a model's size from its settings.

<div class="bigidea">A transformer is one simple block copied many times: each token listens to the others, then thinks on its own, and keeps its old notes so nothing gets lost.</div>

## 1. Why this matters

Every well-known LLM (GPT, Gemini, Claude, Llama, Gemma, Mistral) is a stack of transformer blocks. When you read that a model has "32 layers, model width 4,096 and 8 billion parameters", this lesson tells you what those numbers mean. From them you can guess how much memory it needs and how fast it can run (the Offline AI course uses exactly this).

## 2. One block

Every token enters as a list of `$d$` numbers: its embedding plus a signal for its position. `$d$` is called the **model width**. One block does four things:

1. **Attention** (Lesson 10.4): each token mixes in information from the earlier tokens it needs, using several heads.
2. **Add and normalise:** add the block's input back on (a **residual connection**), then rescale each token's list to average 0 and spread 1 (**layer normalisation**).
3. **Feed-forward network:** a small two-layer network (Lesson 9.3) that works on each token on its own: widen to about `$4d$` numbers, bend, shrink back to `$d$`.
4. **Add and normalise** again.

<!--fig:transformer-block-->

Attention moves information *between* tokens. The feed-forward part works on each token's information *alone*. Stack the block `$N$` times, each copy with its own weights. Finally, score every vocabulary word from the last token's numbers, and softmax the scores into next-word probabilities.

Follow one token, "sat", through a block. Real models use thousands of numbers per token; here we use 4.

<div class="steps">
<div class="step"><p><b>In.</b> "sat" arrives as 4 numbers: its embedding plus a position signal saying it is the third word.</p></div>
<div class="step"><p><b>Listen (attention).</b> "sat" looks back at "the" and "cat" and mixes in mostly "cat": who did the sitting. Out comes a change to add.</p></div>
<div class="step"><p><b>Add and normalise.</b> Input plus change gives, say, (1, 2, 3, 6). Mean 3, standard deviation 1.871, so it becomes <b>(−1.07, −0.53, 0, 1.60)</b>: same pattern, steady size.</p></div>
<div class="step"><p><b>Think alone (feed-forward).</b> Widen the 4 numbers to 16, set the negative ones to 0 (the bend, ReLU), and shrink back to 4. This is where much of the model's stored knowledge acts.</p></div>
<div class="step"><p><b>Add and normalise again.</b> Out come 4 numbers, the same shape as went in, ready for the next block.</p></div>
<div class="step"><p><b>After the last block.</b> The final token's numbers give one score per vocabulary word, and softmax turns the scores into next-word probabilities.</p></div>
</div>

<div class="problem" data-problem="transformer-block-layernorm"></div>

Try it: drag the score bars, press Add 2 to all, and move the temperature.

<figure class="fig" data-fig="@ai-softmax-lab"><figcaption>Softmax turns any scores into probabilities that are positive and add to 100%. Adding the same number to every score changes nothing; a low temperature makes the leader win nearly everything and a high one flattens the odds.</figcaption></figure>

## 3. Why the extra parts

- **Position:** attention is a weighted average, and averages ignore order. Adding a position signal to each embedding (or rotating queries and keys by position, as most recent models do) lets "dog bites man" differ from "man bites dog".
- **Residuals:** as with very deep networks (Lesson 9.2), gradients fade as they pass back through many layers. `$\mathbf{x} + f(\mathbf{x})$` gives them a straight road back, so 100-block models still train.
- **Normalisation:** keeps the numbers in a steady range from block to block, so the learning rate that suits one block suits all.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** alternate "talk to other tokens" (attention) and "think on your own" (feed-forward), with a shortcut round each.

**One block**, for the token vectors `$\mathbf{X}$`:

```math
\mathbf{X}' = \operatorname{LN}\big(\mathbf{X} + \operatorname{Attn}(\mathbf{X})\big)
```

```math
\mathbf{Y} = \operatorname{LN}\big(\mathbf{X}' + \operatorname{FFN}(\mathbf{X}')\big)
```

with `$\operatorname{FFN}(\mathbf{x}) = \mathbf{W}_2 \, \operatorname{ReLU}(\mathbf{W}_1 \mathbf{x} + \mathbf{b}_1) + \mathbf{b}_2$`. (Many models normalise before each part instead of after; the idea is the same.)

**Layer normalisation** of one token's vector, with its own mean `$\mu$` and standard deviation `$\sigma$`: `$\operatorname{LN}(x_k) = (x_k - \mu)/\sigma$`, then a learned scale and shift.

**Size:** attention has 4 matrices of `$d \times d$` (queries, keys, values, output); the feed-forward part has `$d \times 4d$` and `$4d \times d$`. So one block holds about

```math
4d^2 + 8d^2 = 12d^2 \text{ weights}
```

**Analogy:** a meeting run in rounds. In each round everyone first listens to whoever is relevant (attention), then thinks alone for a moment (feed-forward), keeping their notes from before (residual).

**Try it:** a model with `$d = 4{,}096$` and 32 blocks. Weights in the blocks? (`$12 \times 4{,}096^2 \approx 201$` million per block; × 32 ≈ 6.4 billion, before the embedding table.)
</details>

<div class="meaning">

<dl>
<dt>d</dt><dd>model width: how many numbers describe each token inside the model</dd>
<dt>N</dt><dd>how many blocks are stacked (the "layers" in a model's description)</dd>
<dt>12d²</dt><dd>weights in one block: 4d² in attention plus 8d² in the feed-forward network</dd>
<dt>V × d</dt><dd>weights in the embedding table, one row of d numbers per vocabulary token</dd>
<dt>Physical meaning</dt><dd>The parameter count is the model's size on disk and in memory. At 2 bytes per weight, an 8-billion-parameter model needs about 16 GB just to load, which is why width and depth decide whether a model fits on your laptop.</dd>
</dl>

</div>

Try it: tap the word "it" in the Meaning link head, then switch the mask between causal and full.

<figure class="fig" data-fig="@ai-attention-heads"><figcaption>Each head learns its own pattern of who looks at whom, and a weight row always adds to 100%. In a text generator the causal mask hides later words, because they have not been written yet.</figcaption></figure>

## 4. Worked example

A small model like the one in the simulation: `$d = 512$`, 12 blocks, vocabulary 50,000.

- One block: `$12 \times 512^2 = 3{,}145{,}728$` weights, about 3.1 million.
- 12 blocks: about 37.7 million.
- Embedding table: `$50{,}000 \times 512 = 25.6$` million (often shared with the final scoring layer).
- Total: about **63 million** parameters, about half the size of the first GPT model (2018).

**Layer normalisation** of one token's vector (1, 2, 3, 6): mean 3, variance (4 + 1 + 0 + 9)/4 = 3.5, standard deviation 1.871, so the result is (−1.07, −0.53, 0, 1.60).

<div class="problem" data-problem="transformer-block-params"></div>

<div class="myth">

**"More layers is always what makes a model bigger."** Width matters more per block: the weights grow with `$d^2$`, so doubling the width (same number of blocks) gives about 4 times the weights, while doubling the blocks only doubles them.

</div>

## 5. Practice

1. In the simulation, at which step does information move between tokens? At which step does each token change alone?
2. Why can the same kind of block be stacked 12 or 100 times?
3. Doubling `$d$` (with the same number of blocks): roughly how many more weights?

<details>
<summary>Answers</summary>

1. Between tokens: attention. Alone: the feed-forward network (and the normalisation).
2. Its output has the same shape as its input (`$d$` numbers per token), and residual connections keep deep stacks trainable.
3. About 4 times, since the count grows with `$d^2$`.
</details>

**Try it on your own data:** the [[neural-network-toys]] lets you build and train tiny networks, the feed-forward part of every block.

**New words:** *transformer block*, *residual connection*, *layer normalisation*, *feed-forward network*, *positional encoding*, *model width*, *parameters*, *logits*.

<div class="keypoints">

- A transformer block does attention, add and normalise, a feed-forward network, add and normalise.
- Attention moves information between tokens; the feed-forward part works on each token alone.
- Residual connections (x + f(x)) and layer normalisation keep deep stacks trainable and steady.
- A block's output has the same shape as its input, so the block is stacked N times.
- One block holds about 12d² weights, so model size grows with the square of the width.

</div>
