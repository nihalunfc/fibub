---
title: 'Limits in theory: knowledge cut-off, reasoning, long context'
seoTitle: 'Limits of language models in theory | Offline AI'
summary: The limits every language model has, local or cloud, because of how it works. Made-up facts, a fixed knowledge date, shallow reasoning on hard problems, and losing track of the middle of long texts, with what helps each.
minutes: 25
updated: 2026-11-19
sources:
  - 'Liu et al., "Lost in the Middle: How Language Models Use Long Contexts", TACL 2024, https://arxiv.org/abs/2307.03172'
  - 'Kalai et al., "Why Language Models Hallucinate" (OpenAI), 2025, https://arxiv.org/abs/2509.04664'
  - 'Hsieh et al., "RULER: What''s the Real Context Size of Your Long-Context Language Models?", 2024, https://arxiv.org/abs/2404.06654'
quiz:
  - q: Your local model insists a 2027 event has not happened. Why?
    choices: ['Its knowledge stops at its training cut-off; it knows nothing after unless you give it text', 'It is broken', 'It is lying on purpose']
    ans: 0
    why: A model only knows what was in its training data, which ends at a date. Documents or search fill the gap.
  - q: A fact sits in the middle of a 60-page document you pasted in, and the model misses it. What effect is this?
    choices: ['"Lost in the middle": models use the start and end of long contexts better than the middle', 'The KV cache is full', 'Spelling errors']
    ans: 0
    why: Research found accuracy dips for information in the middle. Put key facts at the start or end, or retrieve only the relevant parts.
  - q: Does a bigger context window mean the model uses all of it well?
    choices: ['No: the usable length is often shorter than the advertised maximum', 'Yes, always', 'Only on Tuesdays']
    ans: 0
    why: Tests such as RULER found many models degrade well before their stated limit.
---

**Module 17 · about 25 minutes · read first: 2.7 and 3.3.** You'll be able to name the built-in limits of language models and design around them.

## 1. Why this matters

Some problems are not about your hardware at all: the biggest cloud model has them too. Knowing them stops you from blaming your setup for things no setup can fix, and points you to the fixes that work.

## 2. Made-up facts

A language model predicts likely text (Lesson 2.1). When it does not know, a confident guess often scores as "likely", so it may invent a name, number or reference. Researchers have argued that training and testing reward guessing over saying "I don't know". Smaller models do this more, because they hold fewer facts.

**What helps:** give it the source text (Module 12), ask for quotes or page numbers, tell it that "not found" is a good answer, and check anything that matters.

## 3. Knowledge cut-off

Training data stops at a date. The model knows nothing after it, and often knows less about the last months before it. A local file never updates itself: a model you downloaded in 2026 still thinks it is 2026 in 2030.

**What helps:** paste or retrieve current documents, add a local search tool, and put today's date in the system prompt (Lesson 10.2).

## 4. Reasoning depth

Models can follow many steps, especially reasoning models that write their thinking first (Lesson 10.4). But each step can go wrong and errors add up, so long chains fail more often, and small models fail sooner.

**What helps:** break big tasks into checked steps, let the model use tools such as a calculator or code (Lesson 13.2), and verify the answer, not just the explanation.

## 5. Long context: lost in the middle

A model with a 128,000-token window does not use all 128,000 equally well. Studies found that accuracy is best for information near the start and end of a long input and dips for the middle, and that many models perform well only on a fraction of their advertised length.

**What helps:** send only the relevant parts (retrieval), put the question and key facts at the start or end, and test with your own long documents (Lesson 12.7).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** if each step is right with probability p, a chain of n independent steps is right with probability pⁿ.

**Equation:** P(all correct) = pⁿ.

**Analogy:** a relay race. Each runner rarely drops the baton, but with enough runners somebody will.

**Try it:** 98% per step, 30 steps? (0.98³⁰ ≈ 0.55: only a 55% chance the whole chain is right. That is why checks between steps matter.)
</details>

## 6. Worked example

*Made-up case.* An HR officer asks a local model to "list every leave rule in this 90-page handbook". It finds the rules in the first and last chapters but misses three in the middle. Switching to document search (one chapter at a time, then a final merge) finds all of them, and adding "say 'none found' if a chapter has no leave rules" stops it inventing one for the IT chapter.

## 7. Practice

1. Write a system prompt line that gives the model today's date.
2. Why does breaking a task into steps help, using the pⁿ rule?
3. Where in a long prompt should you put the question?

<details>
<summary>Answers</summary>

1. For example: "Today's date is 19 November 2026. Your training data may be older; say so if a question needs newer facts."
2. Each step can be checked and fixed before errors pile up, so you are not betting on pⁿ for a long n.
3. At the start and repeated at the end, with the documents in between.
</details>

**New words:** *hallucination*, *knowledge cut-off*, *lost in the middle*, *effective context length*.
