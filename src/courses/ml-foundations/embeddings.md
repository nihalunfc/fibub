---
title: 'Embeddings: meaning as distance'
seoTitle: 'Word embeddings explained: meaning as distance, with a demo'
summary: 'An embedding gives every word a list of numbers, learned so that words used in similar places sit close together. See king − man + woman land on queen, and how LLMs and search use the same idea.'
minutes: 25
updated: 2026-11-21
quiz:
  - q: 'In a good embedding, "cheap" and "inexpensive" are:'
    choices: ['Close together', 'Far apart, since they share no letters', 'The same point exactly']
    ans: 0
    why: They are used in the same kinds of sentences, so training places them near each other, though not on top of each other.
  - q: 'Word embeddings are learned by:'
    choices: ['Predicting words from their neighbours in lots of text', 'Asking people to place each word', 'Counting letters']
    ans: 0
    why: Word2vec and similar methods train a small network to predict nearby words; the network's first-layer weights become the embedding.
  - q: 'Looking up a word''s embedding is the same as:'
    choices: ['Multiplying a one-hot row by the embedding matrix', 'Running k-means', 'Taking a logarithm']
    ans: 0
    why: A one-hot row has a single 1, so the product picks out exactly that word's row of the matrix.
---

**Module 10 · about 25 minutes · read first: 1.4, 10.1.** You'll be able to explain what an embedding is, how it is learned, why similar words end up close, and how word arithmetic works.

## 1. Why this matters

TF-IDF (Lesson 10.1) sees "cheap" and "inexpensive" as unrelated columns. **Embeddings** fix that, and they are everywhere: the first layer of every language model, "semantic" search that finds documents by meaning, recommendation systems (products and films get embeddings too), and retrieval for chatbots that answer from your own files.

## 2. Words as points

An embedding gives each word a short list of numbers: a point in a space of, say, 300 dimensions. Training places words that appear in similar contexts close together. Nobody chooses the meaning of each number; directions in the space end up meaning something anyway, such as male to female, singular to plural, or country to capital.

<!--fig:embedding-map-->

Because relations are directions, arithmetic works: `$\text{king} - \text{man} + \text{woman}$` lands near queen. This was the famous result of **word2vec** (Mikolov and colleagues at Google, 2013). Real spaces are messier than the picture, and analogies work only some of the time.

## 3. How embeddings are learned

"You shall know a word by the company it keeps" (J. R. Firth, 1957). Word2vec trains a tiny network on billions of words of text with one job: given a word, predict the words around it (or the reverse).

1. Start every word at a random point.
2. For each word in the text, nudge it towards the words that actually appear near it, and away from random other words.
3. Repeat over the whole text. Words that share neighbours ("cheap" and "inexpensive" both sit near "price", "very", "quite") end up close.

The point table is just the network's first weight matrix. An LLM learns its own embedding table the same way, as part of predicting the next word (Lesson 10.3), and then refines each word's numbers by context, so "bank" by a river and "bank" with money get different vectors.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** meaning is position; similar use gives similar position.

**Lookup:** with a vocabulary of `$V$` words and `$d$` numbers per word, the embedding matrix `$\mathbf{E}$` is `$V \times d$`. Word `$i$` as a one-hot row `$\mathbf{o}_i$` (all 0 except a 1 at place `$i$`) has embedding

```math
\mathbf{e}_i = \mathbf{o}_i \mathbf{E}
```

which is row `$i$` of `$\mathbf{E}$`. So an embedding layer is a linear layer with one-hot input, done as a fast lookup.

**Similarity:** cosine similarity (Lesson 10.1), `$\cos\theta = \mathbf{a}\cdot\mathbf{b} / (\lVert\mathbf{a}\rVert\,\lVert\mathbf{b}\rVert)$`.

**Analogy:** a city map where similar shops cluster: bakeries near bakeries. Walking from "bakery" to "café" is the same short step anywhere in town.

**Try it:** `$\mathbf{a} = (1, 2, 2)$` and `$\mathbf{b} = (2, 1, 2)$`. Cosine? (`$\mathbf{a}\cdot\mathbf{b} = 2 + 2 + 4 = 8$`; both lengths are 3; `$8/9 = 0.89$`, very similar.)
</details>

## 4. Worked example

The made-up map in the simulation: king (1, 2.8), man (1, 1.4), woman (2.2, 1.4), queen (2.2, 2.8).

- king − man = (0, 1.4): the "royal" step.
- (0, 1.4) + woman = (2.2, 2.8) = queen exactly.

Search works the same way. To answer "phones with a long-lasting battery", embed the query and every review, then return the reviews whose vectors have the highest cosine with the query. A review saying "lasts two days on one charge" scores high, though it shares almost no words with the query: TF-IDF would miss it.

## 5. Practice

1. In the simulation, what does Paris − France + Italy give, and why?
2. Why is an embedding of 300 numbers better than a one-hot row of 50,000?
3. Why does "bank" need context to get the right meaning, and which part of an LLM supplies it?

<details>
<summary>Answers</summary>

1. Rome: France to Paris is the same "capital of" arrow as Italy to Rome.
2. It is far shorter, and similar words share numbers, so what a model learns about one word carries over to its neighbours. One-hot rows are all equally far apart.
3. One fixed point can't be near both "river" and "money". Attention (Lesson 10.4) mixes in the surrounding words, giving each use of "bank" its own vector.
</details>

**Try it on your own data:** the [[embedding-visualiser]] plots high-dimensional rows in 2D, so you can see which of your items sit together.

**New words:** *embedding*, *one-hot*, *embedding matrix*, *word2vec*, *context*, *semantic search*, *contextual embedding*.
