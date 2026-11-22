---
title: 'Embeddings: meaning as distance'
seoTitle: 'Word embeddings explained: meaning as distance, with a demo'
summary: 'An embedding gives every word a list of numbers, learned so that words used in similar places sit close together. See king − man + woman land on queen, and how LLMs and search use the same idea.'
minutes: 25
updated: 2026-11-22
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
sources:
  - 'Mikolov, T., Chen, K., Corrado, G. and Dean, J. (2013), Efficient Estimation of Word Representations in Vector Space https://arxiv.org/abs/1301.3781'
  - 'Jurafsky, D. and Martin, J. H., Speech and Language Processing, 3rd edition draft, chapter 6 (word2vec, embeddings) https://web.stanford.edu/~jurafsky/slp3/'
  - 'Goodfellow, I., Bengio, Y. and Courville, A. (2016), Deep Learning, MIT Press, section 12.4 (natural language processing) https://www.deeplearningbook.org/'
---

**Module 10 · about 25 minutes · read first: 1.4, 10.1.** You'll be able to explain what an embedding is, how it is learned, why similar words end up close, and how word arithmetic works.

<div class="bigidea">Give every word a spot on a map, learned from the company it keeps, and words with similar meanings end up as neighbours.</div>

## 1. Why this matters

TF-IDF (Lesson 10.1) sees "cheap" and "inexpensive" as two unrelated columns. **Embeddings** fix that. They are everywhere:

- the first layer of every language model;
- "semantic" search that finds documents by meaning, not just matching words;
- recommendations (products and films get embeddings too);
- chatbots that answer from your own files.

## 2. Words as points

An embedding gives each word a short list of numbers. You can think of the list as the word's address: a point in a space of, say, 300 dimensions (300 numbers instead of the 2 on a paper map). Training puts words that appear in similar sentences close together.

Nobody decides what each number means. Even so, directions in the space end up meaning something, such as male to female, one to many, or country to capital.

<!--fig:embedding-map-->

Because relations are directions, you can do sums with words. Walk from "man" to "king" and you have taken a "royal" step. Take the same step from "woman" and you land near "queen":

<div class="steps" data-fig="embeddings-arithmetic">
<div class="step"><p><b>Words as points.</b> On a made-up 2-number map: king (1, 2.8), man (1, 1.4), woman (2.2, 1.4), queen (2.2, 2.8). Fruit words sit far away in their own corner.</p></div>
<div class="step"><p><b>The royal step.</b> king − man = (1 − 1, 2.8 − 1.4) = <b>(0, 1.4)</b>: straight up by 1.4.</p></div>
<div class="step"><p><b>Take the same step from woman.</b> woman + (0, 1.4) = (2.2, 1.4 + 1.4) = <b>(2.2, 2.8)</b>.</p></div>
<div class="step"><p><b>Find the nearest word.</b> The closest point to (2.2, 2.8) is <b>queen</b>. In real models the sum lands near queen, not exactly on it, so the nearest word is the answer.</p></div>
<div class="step"><p><b>Relations are directions.</b> man → woman and king → queen are the same arrow. The map has learned a "male to female" direction without anyone telling it.</p></div>
</div>

This was the famous result of **word2vec** (Mikolov and colleagues at Google, 2013). Real spaces are messier than the picture, and analogies work only some of the time.

## 3. How embeddings are learned

"You shall know a word by the company it keeps" (J. R. Firth, 1957). Word2vec trains a tiny network on billions of words of text with one job: given a word, guess the words around it (or the reverse).

1. Start every word at a random point.
2. For each word in the text, nudge it towards the words that really appear near it, and away from random other words.
3. Repeat over the whole text. Words that share neighbours ("cheap" and "inexpensive" both sit near "price", "very", "quite") end up close.

**Everyday picture:** seat people at a wedding by who they chat with. After a few rounds, the cousins are at one table and the work friends at another, though nobody wrote a label on anyone.

The table of points is simply the network's first weight matrix. An LLM learns its own embedding table the same way, as part of guessing the next word (Lesson 10.3). Then it adjusts each word's numbers to the sentence around it, so "bank" by a river and "bank" with money get different vectors.

<div class="meaning">

<dl>
<dt>V</dt><dd>how many words (or tokens) are in the vocabulary</dd>
<dt>d</dt><dd>how many numbers each word gets, such as 300</dd>
<dt><b>E</b></dt><dd>the embedding table: V rows by d columns, one row per word</dd>
<dt><b>o</b><sub>i</sub></dt><dd>a one-hot row: all zeros except a 1 in word i's place</dd>
<dt><b>e</b><sub>i</sub> = <b>o</b><sub>i</sub><b>E</b></dt><dd>word i's embedding: the one-hot row simply picks out row i of the table</dd>
<dt>Physical meaning</dt><dd>An embedding is an address for meaning. Two reviews that say the same thing in different words get nearby addresses, so a search for "battery lasts long" finds "goes two days on one charge". Distance on the map stands for difference in meaning.</dd>
</dl>

</div>

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

<div class="problem" data-problem="embeddings-cosine"></div>

The table itself takes memory. A vocabulary of 50,000 tokens with 4,096 numbers each is about 205 million numbers, before any of the model's other layers.

<div class="problem" data-problem="embeddings-table-size"></div>

<div class="myth">

**"Each number in an embedding stands for one human idea, like 'royalty' or 'colour'."** Usually not. The meaning is spread across many numbers at once, and only some directions line up with ideas we can name. That is why we look at distances and directions, not at single numbers.

</div>

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

<div class="keypoints">

- An embedding gives each word a list of numbers: a point in space where similar words sit close together.
- It is learned by guessing a word's neighbours in lots of text; words with the same company end up near each other.
- Relations become directions, so king − man + woman lands near queen.
- Looking up an embedding is a one-hot row times the table: it just picks out that word's row.
- Search by meaning embeds the query and the documents and ranks them by cosine similarity.

</div>
