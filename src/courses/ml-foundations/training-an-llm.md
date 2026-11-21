---
title: 'How an LLM is trained'
seoTitle: 'How LLMs are trained: pretraining, fine-tuning, RLHF'
summary: 'An LLM is trained in stages: next-word prediction on trillions of words, then example conversations, then people''s preferences. See the same question answered after each stage, and estimate the cost of training.'
minutes: 25
updated: 2026-11-21
quiz:
  - q: 'During pretraining, the "label" for each position is:'
    choices: ['The next token in the text itself', 'A score given by a person', 'The topic of the document']
    ans: 0
    why: Text supplies its own answers, so pretraining needs no labelling and can use trillions of tokens. This is called self-supervised learning.
  - q: 'Instruction tuning teaches a model mainly:'
    choices: ['To answer requests in the form of a helpful reply', 'Most of its facts', 'How to read']
    ans: 0
    why: The knowledge comes from pretraining; instruction tuning shows it what a good answer to a request looks like.
  - q: 'Feedback tuning (such as RLHF) learns from:'
    choices: ['People choosing the better of two answers', 'A bigger web crawl', 'Random noise']
    ans: 0
    why: Comparisons are easier and more reliable to collect than perfect answers, and they steer the model towards what people prefer.
---

**Module 10 · about 25 minutes · read first: 3.3, 10.3, 10.5.** You'll be able to name the three stages of LLM training, say what data and goal each one uses, compute a model's loss and perplexity, and estimate the computing cost of pretraining.

## 1. Why this matters

Knowing how a model was trained explains its habits: why a base model rambles, why chat models are polite and sometimes over-cautious, why they know things up to a date and nothing after, and why "fine-tuning on your own data" is a much smaller job than training from scratch. It also explains why only a handful of companies pretrain large models, while anyone can adapt one.

## 2. Three stages

1. **Pretraining.** Predict the next token (Lesson 10.3) over a huge mix of public web pages, books, code and papers: trillions of tokens. The text supplies its own answers, so no labelling is needed (**self-supervised learning**). The result, a **base model**, has absorbed grammar, facts, styles and reasoning patterns, but it continues text rather than answering it.
2. **Instruction tuning** (supervised fine-tuning). Train on example conversations: a request and a good reply, many written by people. Same next-token loss, counted only on the replies. The model learns the shape of a helpful answer.
3. **Feedback tuning.** Show people (or a judging model) two answers to the same prompt and record which is better. Methods such as **RLHF** (reinforcement learning from human feedback) and **DPO** shift the model towards preferred answers: clearer, more correct, safer, more honest about doubt.

<!--fig:llm-stages-->

All three run the same network with gradient descent (Lesson 3.3) and backpropagation (Lesson 9.4); only the data and the target change. Later, smaller fine-tunes (such as LoRA, in the Offline AI course) adapt a finished model to one company's style or task with a few thousand examples.

## 3. What the numbers mean

- **Loss and perplexity** (Lesson 10.3) are watched throughout pretraining on held-out text, exactly like validation loss in Lesson 9.5.
- **Scaling:** loss falls smoothly and predictably as models, data and computing grow together. Labs use this to plan a run before spending on it.
- **Knowledge cut-off:** the model knows only what was in its training text. Events after it are unknown unless supplied in the prompt or found by a search tool.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** one loss, next-token cross-entropy, applied to different data at each stage.

**Pretraining loss** over `$n$` positions of text:

```math
L = -\frac{1}{n} \sum_{t=1}^{n} \ln p_\theta(w_t \mid w_1, \dots, w_{t-1}), \qquad \text{perplexity} = e^{L}
```

**Compute rule of thumb:** training a model with `$N$` parameters on `$D$` tokens takes about

```math
C \approx 6 N D \text{ arithmetic operations}
```

(2 per weight per token for the forward pass, 4 for the backward pass).

**Analogy:** a doctor's training. Years of reading everything (pretraining), then supervised practice on real cases (instruction tuning), then feedback from senior colleagues on which of two approaches was better (feedback tuning).

**Try it:** a model gives the true next tokens probabilities 0.5, 0.25, 0.1 and 0.8. Mean loss and perplexity? (Losses 0.693, 1.386, 2.303, 0.223; mean 1.151; perplexity `$e^{1.151} = 3.16$`: as unsure as choosing among about 3 tokens.)
</details>

## 4. Worked example

How much computing does a mid-sized open model need? Take `$N = 8$` billion parameters and `$D = 15$` trillion tokens:

```math
C \approx 6 \times (8 \times 10^{9}) \times (15 \times 10^{12}) = 7.2 \times 10^{23}
```

A modern data-centre graphics card might sustain about `$4 \times 10^{14}$` operations a second in practice. That gives `$1.8 \times 10^{9}$` card-seconds: about 500,000 card-hours, or roughly 10 days on 2,000 cards, before any failed runs or experiments. Instruction and feedback tuning add only a small fraction of this. Fine-tuning a finished model with LoRA can run on one good computer.

## 5. Practice

1. In the simulation, why does the pretrained model answer a question with more questions?
2. Why is pretraining called self-supervised, and why does that matter for its scale?
3. Training loss on held-out text drops from 2.3 to 2.0. What happens to perplexity?

<details>
<summary>Answers</summary>

1. It continues text. On the web, a question is often followed by similar questions (FAQ pages, forums), so that is a likely continuation.
2. The next token is the label, so any text can be used without anyone labelling it. That is why it can use trillions of tokens.
3. It falls from `$e^{2.3} \approx 10$` to `$e^{2.0} \approx 7.4$`: the model is less unsure.
</details>

**Try it on your own data:** the [[prompt-pruner]] turns your own PDFs and web pages into lean text that uses fewer tokens, the units every number in this lesson is counted in.

**New words:** *pretraining*, *self-supervised learning*, *base model*, *instruction tuning*, *supervised fine-tuning*, *RLHF*, *DPO*, *knowledge cut-off*, *scaling law*, *LoRA*.
