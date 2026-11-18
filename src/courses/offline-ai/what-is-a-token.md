---
title: What a token is
summary: Models read and write in tokens, pieces of words. See text split into tokens, learn the rule of thumb for counting them, and why everything in AI is measured in them.
minutes: 20
updated: 2026-11-18
quiz:
  - q: Roughly how many tokens is a 750-word English article?
    choices: ['About 100', 'About 1,000', 'About 10,000']
    ans: 1
    why: The rule of thumb is about 0.75 English words per token, so 750 words is about 1,000 tokens.
  - q: Why do models use tokens instead of whole words?
    choices: ['To make text shorter', 'A fixed list of pieces can spell any word, including new ones and typos', 'Because words are copyrighted']
    ans: 1
    why: With word pieces and single-character fallbacks, the model can read and write anything with a vocabulary of a fixed size.
  - q: Which is usually split into more tokens?
    choices: ['"the"', '"unbelievably"', '"and"']
    ans: 1
    why: Common short words are one token. Longer or rarer words are built from several pieces.
---

**Module 3 · about 20 minutes · read first: Module 1.** You'll be able to explain what a token is and estimate the tokens in any text.

## 1. Why this matters

Context windows, speed, subscription limits and API prices are all counted in tokens. If you can estimate tokens, you can predict whether a document fits, how long a job takes, and what it would cost in the cloud.

## 2. Pieces of words

A model does not see letters or words. Before it reads anything, a **tokenizer** cuts the text into pieces from a fixed list called the **vocabulary**, and each piece becomes a number. Common words ("the", "model") are one piece. Rare or long words are built from parts ("un" + "believ" + "ably"). Anything unknown falls back to single characters or bytes, so any text at all can be written down.

Try it below. This is a toy with a few hundred pieces; real tokenizers learn 100,000 to 260,000 pieces from huge amounts of text, so they split words less.

<!--fig:toy-tokenizer-->

## 3. The rule of thumb

For ordinary English with a modern tokenizer:

- 1 token ≈ 4 characters
- 1 token ≈ 0.75 words, so 100 words ≈ 130 tokens
- one page of text (about 500 words) ≈ 650 tokens

Code, numbers, tables and many non-English languages use more tokens for the same content (Lesson 3.2). For an exact count, Lesson 3.10 shows how to ask your own engine.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a tokenizer turns text into a sequence of whole numbers taken from a fixed vocabulary.

**Equation:** tokens ≈ words ÷ 0.75 ≈ characters ÷ 4 (English).

**Analogy:** Lego. A fixed set of brick shapes can build any model; common shapes come as big bricks, unusual ones from many small bricks. It breaks down because, unlike Lego, the brick set is learned from data and differs between model families.

**Try it:** a 3,000-word report? (3,000 ÷ 0.75 = 4,000 tokens.)
</details>

## 4. Worked example

*Made-up numbers.* Nadia wants a model to summarise 40 customer reviews of about 120 words each. That is 4,800 words, about 6,400 tokens, plus about 100 tokens of instructions. Her model's context is set to 8,192 tokens, so it all fits in one request with room for a 500-token summary.

## 5. Practice

1. Paste a paragraph of your own into the toy tokenizer. How many tokens per word?
2. Estimate the tokens in a 20-page report of 500 words per page.
3. Which would you expect to need more tokens: "2026-11-18" or "today"?

<details>
<summary>Answers</summary>

1. The toy gives more than a real tokenizer; real English is about 1.3 tokens per word.
2. 10,000 words ÷ 0.75 ≈ 13,300 tokens.
3. The date: digits and dashes are split into several pieces; "today" is one.
</details>

**New words:** *token* (a piece of text the model reads or writes), *tokenizer* (the program that cuts text into tokens), *vocabulary* (the fixed list of pieces).
