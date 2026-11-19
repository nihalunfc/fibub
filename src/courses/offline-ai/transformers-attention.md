---
title: 'Transformers and attention, explained with a classroom'
seoTitle: 'Transformers and attention explained | Offline AI'
summary: The transformer is the design inside almost every language model. Attention lets each word look back at the words that matter to it. A plain-words picture, then the maths.
minutes: 25
updated: 2026-11-19
quiz:
  - q: What does attention let a token do?
    choices: ['Look back at earlier tokens and weigh how much each matters to it', 'Search the internet', 'Delete old tokens']
    ans: 0
    why: Each token compares itself with earlier tokens and takes a weighted mix of their information.
  - q: Why does a longer context make each new token slower?
    choices: ['Attention compares the new token with every earlier token', 'The screen gets fuller', 'The model gets tired']
    ans: 0
    why: More earlier tokens means more comparisons and more stored keys and values to read (the KV cache).
  - q: What is a layer?
    choices: ['One step of attention plus a small calculation, repeated many times in a stack', 'A file on disk', 'A chat message']
    ans: 0
    why: Models stack dozens of identical-shaped layers; each refines what every token means in context.
---

**Module 2 · about 25 minutes · read first: 2.1 and 2.2.** You'll be able to describe what happens inside a model in plain words, and why long context costs memory and time.

## 1. Why this matters

You do not need the maths to run models, but this picture explains three practical things: why context costs memory (the KV cache), why long documents slow down, and why models lose track of the middle of very long texts.

## 2. The classroom picture

Imagine each token is a student in a row, holding a card with its word. To understand "it" in "The cat sat on the mat because it was tired", the student holding "it" needs to know who "it" is.

- Every student writes a **question** ("I'm a pronoun, who am I about?"), a **label** ("I'm an animal, a noun") and some **notes** to share.
- The "it" student compares its question with every earlier student's label. "cat" matches best, "mat" a little, "the" hardly at all.
- It then takes a mix of everyone's notes, mostly from "cat". Now "it" carries the meaning "the cat".

That is **attention**. In model terms the question, label and notes are the **query**, **key** and **value**. Each token can only look back, never forward.

## 3. The stack

A **transformer** stacks this, layer upon layer (often 30 to 90 layers). After each attention step, a small calculation (the **feed-forward** part, where most parameters live) works on each token. Early layers handle grammar, later ones meaning and reasoning. At the top, the last token's result becomes the scores for the next token (Lesson 2.1).

## 4. What it means for you

- **KV cache:** to avoid recomputing, the engine stores every earlier token's keys and values. That is the conversation memory that grows with context (Lesson 8.4).
- **Longer context, slower tokens:** each new token compares with every stored key.
- **Lost in the middle:** with very long inputs, attention spreads thin, and middle parts get less weight (Lesson 17.4).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** attention is a weighted average of earlier tokens' values, with weights from how well their keys match the current query.

**Equation:** Attention(Q, K, V) = softmax(Q Kᵀ ÷ √d) V, where d is the length of each key.

**Analogy:** a search engine inside the sentence: the query is matched against every key, and results are blended by how well they match.

**Try it:** a query matches three keys with scores 2, 0 and 0. With softmax, how much weight goes to the first? (e² ÷ (e² + 1 + 1) ≈ 7.39 ÷ 9.39 ≈ 79%.)
</details>

## 5. Worked example

*Made-up numbers.* A model reads a 40-page contract. The answer to Gita's question is on page 21. The model misses it. She moves the question to the end of the prompt and asks it to quote the clause first; it now finds it. Attention at the start and end of long texts is stronger than in the middle.

## 6. Practice

1. In "The trophy did not fit in the suitcase because it was too big", what should "it" attend to most?
2. Why can't a token attend to tokens after it?
3. Why does doubling the context roughly double the KV cache?

<details>
<summary>Answers</summary>

1. "trophy". (Change "big" to "small" and it becomes "suitcase", a classic test of understanding.)
2. The model writes left to right, so later tokens do not exist yet when it predicts.
3. The cache stores keys and values for every token, so twice the tokens means twice the storage.
</details>

**New words:** *transformer*, *attention*, *query, key, value*, *layer*, *feed-forward*, *KV cache*.
