---
title: 'Text as numbers: bag of words and TF-IDF'
seoTitle: 'Bag of words and TF-IDF explained, with a live example'
summary: 'Models need numbers, so text must be turned into numbers first. Count the words, weight the rare ones up with TF-IDF, and compare documents by the angle between their rows. See it on four short reviews.'
minutes: 20
updated: 2026-11-22
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
sources:
  - 'Jurafsky, D. and Martin, J. H., Speech and Language Processing, 3rd edition draft, chapter 6 (vector semantics, TF-IDF, cosine) https://web.stanford.edu/~jurafsky/slp3/'
  - 'Manning, C. D., Raghavan, P. and Schütze, H. (2008), Introduction to Information Retrieval, Cambridge University Press, chapter 6 https://nlp.stanford.edu/IR-book/'
  - 'scikit-learn user guide: text feature extraction (CountVectorizer, TfidfVectorizer) https://scikit-learn.org/stable/modules/feature_extraction.html'
---

**Module 10 · about 20 minutes · read first: 1.4, 4.8.** You'll be able to turn a set of documents into a table of numbers, work out TF-IDF by hand, and compare documents with cosine similarity.

<div class="bigidea">A computer can't read, but it can count: turn each document into a row of word counts, give rare words more weight, and similar documents become rows that point the same way.</div>

## 1. Why this matters

Reviews, support tickets, emails, contracts and survey comments are all text, and most of the world's data is text. A model only understands numbers, so text has to become numbers first.

The simple methods in this lesson still run search boxes, spam filters and ticket routing. They are the honest baseline a language model has to beat. They are also the first step on the road to embeddings (Lesson 10.2) and LLMs.

## 2. Bag of words

First make a **vocabulary**: a sorted list of every different word in the collection. Each document then becomes a row with one column per vocabulary word. Each cell holds how many times that word appears in the document.

Word order is thrown away, as if you tipped the words into a bag and shook it. So "dog bites man" and "man bites dog" get exactly the same row. Naive Bayes (Lesson 4.8) worked like this.

Most cleaning happens before counting:

- make everything lower case, so "Great" and "great" are one word;
- split on spaces and punctuation;
- sometimes drop very common **stop words** ("the", "and");
- sometimes cut words to their **stem** ("charging" → "charg"), so "charge" and "charging" count together.

**Everyday picture:** a shopping receipt. It lists how many of each item you bought, but not the order you picked them off the shelves.

Step through a few merges and watch letters become chunks.

<figure class="fig" data-fig="@ai-bpe-merge"><figcaption>A tokeniser is built by repeatedly merging the commonest neighbouring pair. Common chunks become single tokens (cheap), rare words stay in several pieces (costly). This is why token counts differ from word counts.</figcaption></figure>

## 3. TF-IDF: weight the words that tell documents apart

Raw counts favour words like "the", which are everywhere and tell you nothing. **TF-IDF** (term frequency times inverse document frequency) multiplies each count by a weight. The weight is large for rare words and zero for words found in every document.

- **TF** (term frequency): how often the word appears in this document.
- **IDF** (inverse document frequency): `$\ln(N / \text{df})$`. Here `$N$` is the number of documents, df is how many of them contain the word, and ln is the natural logarithm.

Watch it happen for the word "great" in the first of four reviews:

<div class="steps">
<div class="step"><p><b>Count it.</b> Review 1 is "the battery is great and the screen is great". "great" appears <b>2</b> times. That is its TF.</p></div>
<div class="step"><p><b>How many reviews use it?</b> Of the 4 reviews, only review 1 contains "great", so df = <b>1</b>.</p></div>
<div class="step"><p><b>Rarity weight.</b> IDF = ln(4 ÷ 1) = ln 4 = <b>1.386</b>. A word in only one review gets a big weight.</p></div>
<div class="step"><p><b>Multiply.</b> TF-IDF = 2 × 1.386 = <b>2.77</b>. "great" is the word that tells this review apart.</p></div>
<div class="step"><p><b>Compare with "the".</b> "the" appears 2 times too, but it is in all 4 reviews: IDF = ln(4 ÷ 4) = 0, so its TF-IDF is <b>0</b>. Common words vanish.</p></div>
</div>

<!--fig:tfidf-table-->

<div class="meaning">

<dl>
<dt>count(w, d)</dt><dd>how many times word w appears in document d (the TF)</dd>
<dt>N</dt><dd>how many documents there are in the whole collection</dd>
<dt>df(w)</dt><dd>how many documents contain word w at least once</dd>
<dt>ln(N / df)</dt><dd>the rarity weight (IDF): 0 for a word in every document, bigger the rarer the word is</dd>
<dt>Physical meaning</dt><dd>TF-IDF is a highlighter pen. It marks the words that make one ticket, review or email different from the rest, and leaves the filler words blank. A search box uses it to rank the documents where your search words stand out.</dd>
</dl>

</div>

<div class="problem" data-problem="text-as-numbers-tfidf"></div>

Two documents are compared by the angle between their rows: **cosine similarity** (Lesson 1.4). A long review and a short review with the same mix of words point the same way, so length does not matter. Cosine runs from 0 (no weighted words in common) to 1 (the same mix).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a word matters to a document if it is frequent there and rare elsewhere.

**TF-IDF** of word `$w$` in document `$d$`, with `$N$` documents of which `$\text{df}(w)$` contain `$w$`:

```math
\text{tfidf}(w, d) = \text{count}(w, d) \times \ln \frac{N}{\text{df}(w)}
```

**Cosine similarity** of rows `$\mathbf{a}$` and `$\mathbf{b}$`: the dot product (multiply place by place and add), divided by the two lengths.

```math
\cos \theta = \frac{\mathbf{a} \cdot \mathbf{b}}{\lVert \mathbf{a} \rVert \, \lVert \mathbf{b} \rVert}
```

Libraries add small tweaks (adding 1 inside the logarithm, dividing each row by its length), but the idea is the same.

**Analogy:** in a library, "the" is printed in every book and tells you nothing; "photosynthesis" points straight at the biology shelf.

**Try it:** 10 documents; "refund" is in 2 of them and appears 3 times in one. Its TF-IDF there? (`$3 \times \ln(10/2) = 3 \times 1.609 = 4.83$`.)
</details>

Try it: choose an analogy, then drag one word and watch the answer move.

<figure class="fig" data-fig="@ai-embedding-analogy"><figcaption>Directions in an embedding space carry meaning: the step from man to king is much like the step from woman to queen. Words are points; meaning is geometry, so nearness and arrows can be measured.</figcaption></figure>

## 4. Worked example

The four reviews in the simulation. Review 1 is "the battery is great and the screen is great".

| word | count | in reviews | IDF = ln(4/df) | TF-IDF |
|---|---|---|---|---|
| great | 2 | 1 | 1.386 | 2.77 |
| screen | 1 | 2 | 0.693 | 0.69 |
| battery | 1 | 3 | 0.288 | 0.29 |
| the, is, and | 2, 2, 1 | 4 | 0 | 0 |

"great" carries the review; "the", "is" and "and" vanish. With plain counts, review 1 looks most like review 3 (cosine 0.72), mostly because both are full of "the" and "is". With TF-IDF the similarity drops to 0.07: the only weighted word they share is "screen".

<div class="problem" data-problem="text-as-numbers-cosine"></div>

<div class="myth">

**"Bag of words understands what the text means."** It only counts. "not good" and "good" share the word "good", so they look alike. "cheap" and "inexpensive" share no letters, so they look unrelated. Word order and meaning are both lost. Embeddings (Lesson 10.2) fix the second problem, and attention (Lesson 10.4) the first.

</div>

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

<div class="keypoints">

- Bag of words turns each document into a row of word counts, one column per vocabulary word; word order is lost.
- TF-IDF multiplies each count by ln(N / df), so rare words get weight and words in every document get 0.
- Cosine similarity compares two rows by their angle, from 0 (nothing shared) to 1 (same mix), whatever their length.
- These counts can't see meaning or order: "cheap" and "inexpensive" look unrelated, which embeddings fix.

</div>
