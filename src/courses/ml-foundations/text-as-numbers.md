---
title: 'Text as numbers: bag of words and TF-IDF'
seoTitle: 'Bag of words and TF-IDF explained, with a live example'
summary: 'Models need numbers, so text must be turned into numbers first. Count the words, weight the rare ones up with TF-IDF, and compare documents by the angle between their rows. See it on four short reviews.'
minutes: 20
updated: 2026-11-21
quiz:
  - q: A word appears in every document of a collection. Its IDF is
    choices: ['0', '1', 'Very large']
    ans: 0
    why: IDF = ln(N / df) = ln(N / N) = ln 1 = 0. A word everyone uses tells documents apart not at all.
  - q: 'In a bag-of-words model, each document becomes:'
    choices: ['A row with one number per word in the vocabulary', 'A list of sentences', 'A single number']
    ans: 0
    why: The vocabulary gives the columns; each document's row counts (or weights) its words, and most entries are 0.
  - q: Cosine similarity between two documents' TF-IDF rows is 0. They
    choices: ['Share no weighted words', 'Are identical', 'Are opposites']
    ans: 0
    why: Counts and TF-IDF weights are never negative, so cosine runs from 0 (no shared weighted words) to 1 (same mix of words).
---

**Module 10 · about 20 minutes · read first: 1.4, 4.8.** You'll be able to turn a set of documents into a table of numbers, compute TF-IDF by hand, and compare documents with cosine similarity.

## 1. Why this matters

Reviews, support tickets, emails, contracts and survey comments are text, and most of the world's data is text. Before any model can use them, they must become numbers. The simple methods here still power search boxes, spam filters and ticket routing, and they are the honest baseline that a language model has to beat. They are also the first step on the road to embeddings (Lesson 10.2) and LLMs.

## 2. Bag of words

Make a **vocabulary**: every distinct word in the collection, sorted. Each document becomes a row with one column per vocabulary word, holding how many times that word appears. Order is thrown away, as if the words were shaken in a bag: "dog bites man" and "man bites dog" get the same row. Naive Bayes (Lesson 4.8) worked exactly like this.

Most cleaning happens before counting: lower-case everything, split on spaces and punctuation, and sometimes drop very common words ("the", "and") or cut words to their stem ("charging" → "charg").

## 3. TF-IDF: weight the words that tell documents apart

Raw counts favour words like "the". **TF-IDF** (term frequency × inverse document frequency) multiplies each count by a weight that is large for rare words and zero for words in every document:

- **TF:** how often the word is in this document.
- **IDF:** `$\ln(N / \text{df})$`, where `$N$` is the number of documents and df is how many contain the word.

<!--fig:tfidf-table-->

Two documents are compared by the angle between their rows: **cosine similarity** (Lesson 1.4). Long and short documents with the same mix of words point the same way, so length does not matter.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a word matters to a document if it is frequent there and rare elsewhere.

**TF-IDF** of word `$w$` in document `$d$`, with `$N$` documents of which `$\text{df}(w)$` contain `$w$`:

```math
\text{tfidf}(w, d) = \text{count}(w, d) \times \ln \frac{N}{\text{df}(w)}
```

**Cosine similarity** of rows `$\mathbf{a}$` and `$\mathbf{b}$`:

```math
\cos \theta = \frac{\mathbf{a} \cdot \mathbf{b}}{\lVert \mathbf{a} \rVert \, \lVert \mathbf{b} \rVert}
```

Libraries add small tweaks (adding 1 inside the logarithm, dividing each row by its length), but the idea is the same.

**Analogy:** in a library, "the" is printed in every book and tells you nothing; "photosynthesis" points straight at the biology shelf.

**Try it:** 10 documents; "refund" is in 2 of them and appears 3 times in one. Its TF-IDF there? (`$3 \times \ln(10/2) = 3 \times 1.609 = 4.83$`.)
</details>

## 4. Worked example

The four reviews in the simulation. Review 1 is "the battery is great and the screen is great".

| word | count | in reviews | IDF = ln(4/df) | TF-IDF |
|---|---|---|---|---|
| great | 2 | 1 | 1.386 | 2.77 |
| screen | 1 | 2 | 0.693 | 0.69 |
| battery | 1 | 3 | 0.288 | 0.29 |
| the, is, and | 2, 2, 1 | 4 | 0 | 0 |

"great" carries the review; "the", "is" and "and" vanish. With plain counts, review 1 looks most like review 3 (cosine 0.72), mostly because both are full of "the" and "is". With TF-IDF the similarity drops to 0.07: the only weighted word they share is "screen".

## 5. Practice

1. In the simulation, which review is most similar to review 2, and which word links them?
2. Why do "the", "is" and "and" get TF-IDF 0 here, even though they are the most common words?
3. Name one thing bag of words cannot capture.

<details>
<summary>Answers</summary>

1. Review 4, through "charger", "slow" and "died": the same complaint in a different order.
2. They are in all four reviews, so IDF = ln(4/4) = 0, and 0 times any count is 0.
3. Word order and meaning: "not good" and "good" share a word; "cheap" and "inexpensive" share none. Embeddings (Lesson 10.2) address the second.
</details>

**Try it on your own data:** the [[text-cleaner]] does the cleaning steps (lower case, punctuation, stop words) on your own text, and the [[topic-modeller]] finds themes in many documents from their word counts.

**New words:** *vocabulary*, *bag of words*, *term frequency*, *inverse document frequency*, *TF-IDF*, *stop words*, *stemming*, *cosine similarity*.
