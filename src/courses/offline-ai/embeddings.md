---
title: 'Embeddings: turning meaning into coordinates'
seoTitle: 'Embeddings explained: meaning as coordinates | Offline AI'
summary: An embedding model turns a sentence into a list of numbers, so sentences with similar meaning land close together. See it on a map, run one locally with Ollama and measure similarity yourself.
minutes: 30
updated: 2026-11-22
sources:
  - 'EmbeddingGemma model card (Google), https://ai.google.dev/gemma/docs/embeddinggemma/model_card'
  - 'Ollama embedding models and the embed API, https://ollama.com/blog/embedding-models'
  - 'MTEB, the Massive Text Embedding Benchmark leaderboard, https://huggingface.co/spaces/mteb/leaderboard'
quiz:
  - q: Two sentences have a cosine similarity of 0.92. What does that suggest?
    choices: ['They share no words', 'Their meanings are close', 'One is a translation error']
    ans: 1
    why: Cosine similarity near 1 means the two arrows point almost the same way, which for a good embedding model means similar meaning, even with different words.
  - q: Why must the question and the documents use the same embedding model?
    choices: ['Each model draws its own map; coordinates from two maps cannot be compared', 'It is a licence rule', 'Different models are slower']
    ans: 0
    why: Each model places meanings on its own map. Comparing a point from one map with a point from another is meaningless.
  - q: Is an embedding model the same as a chat model?
    choices: ['Yes, any chat model works', 'No, it is a small model trained only to output vectors', 'No, it needs the internet']
    ans: 1
    why: Embedding models are small (often 100 to 600 million parameters) and output a vector, not text. They run fast on a laptop CPU.
---

**Module 12 · about 30 minutes · read first: 12.1.** You'll be able to explain an embedding, run an embedding model offline, and measure how close two sentences are in meaning.

<div class="bigidea">An embedding model turns a piece of text into a list of numbers, like a place on a map, so that texts with similar meanings land close together.</div>

## 1. Why this matters

Ordinary search matches words: "annual leave" will not find "vacation days". Embeddings match **meaning**, which is why RAG finds the right paragraph even when your question uses different words from the document.

## 2. Meaning as a place on a map

An **embedding model** reads a piece of text and outputs a fixed list of numbers, for example 768 of them. Think of those numbers as coordinates. The model was trained so that texts with similar meaning get nearby coordinates, and unrelated texts land far apart.

A real map has 768 directions, which nobody can draw, so the figure below uses a hand-drawn 2-D toy map. Pick a question and watch which sentences light up.

<!--fig:embedding-map-->

## 3. Run one on your machine

Ollama runs embedding models too. **EmbeddingGemma** (Google, about 300 million parameters, 768 numbers per text, over 100 languages) is small enough for any laptop:

```
ollama pull embeddinggemma
```

```python
import numpy as np
import ollama

sentences = [
    "Staff get 20 days of paid vacation a year.",
    "How much annual leave do employees have?",
    "The printer on floor 2 is out of toner.",
]
vecs = np.array(ollama.embed(model="embeddinggemma", input=sentences)["embeddings"])
vecs /= np.linalg.norm(vecs, axis=1, keepdims=True)   # make every arrow length 1

print(len(vecs[0]), "numbers per sentence")
print(np.round(vecs @ vecs.T, 2))   # similarity of every pair
```

Expect the first two to score clearly higher with each other than either does with the printer sentence, even though they share almost no words. Other good local choices: `nomic-embed-text` (English) and `qwen3-embedding` (strong on many languages and code; bigger). Check the MTEB leaderboard for your language before choosing.

## 4. Measuring "close": cosine similarity

Treat each embedding as an arrow from the starting point (the origin). Two arrows pointing the same way mean the same thing; at right angles, unrelated. **Cosine similarity** measures the angle between them: 1 is the same direction, 0 is unrelated. Most search tools first scale every arrow to length 1, after which cosine similarity is a plain **dot product** (multiply matching numbers and add up), which a computer can do millions of times a second.

<div class="steps" data-fig="embeddings-cosine">
<div class="step"><p><b>Three arrows.</b> A toy model with just 2 numbers per sentence gives "vacation days" (1.2, 1.6), "annual leave?" (2.4, 1.8) and "printer toner" (1.6, −1.2).</p></div>
<div class="step"><p><b>Scale to length 1.</b> Divide each arrow by its length (2, 3 and 2). Now they are (0.6, 0.8), (0.8, 0.6) and (0.8, −0.6). Only the direction is left.</p></div>
<div class="step"><p><b>Vacation vs leave.</b> Multiply matching numbers and add: 0.6 × 0.8 + 0.8 × 0.6 = <b>0.96</b>. Almost the same direction: similar meaning, with no shared words.</p></div>
<div class="step"><p><b>Vacation vs printer.</b> 0.6 × 0.8 + 0.8 × (−0.6) = 0.48 − 0.48 = <b>0</b>. At right angles: unrelated.</p></div>
<div class="step"><p><b>The search.</b> The question "annual leave?" scores 0.96 with the vacation rule and 0.28 with the printer note, so the vacation rule comes first. Real models do the same with 768 numbers.</p></div>
</div>

<div class="problem" data-problem="embeddings-cosine"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** similar meaning ≈ small angle between embedding vectors.

**Equation:**

```math
\cos\theta = \frac{\mathbf{a} \cdot \mathbf{b}}{|\mathbf{a}|\,|\mathbf{b}|} = \frac{\sum_i a_i b_i}{\sqrt{\sum_i a_i^2}\,\sqrt{\sum_i b_i^2}}
```

For unit-length vectors, `$\cos\theta = \mathbf{a} \cdot \mathbf{b}$`.

**Analogy:** two compass bearings. 30° and 35° point to almost the same place, whatever the distance walked; 30° and 120° do not. Cosine ignores length and keeps only direction, which is why a long and a short paragraph on the same topic still match. Where it breaks: "the drug is safe" and "the drug is not safe" can sit close, because they are about the same thing. Embeddings measure topic closeness, not truth.

**Try it:** a = (0.6, 0.8), b = (0.8, 0.6). Both have length 1. Cosine similarity? (0.6×0.8 + 0.8×0.6 = 0.96.)
</details>

<div class="meaning">

<dl>
<dt>a, b</dt><dd>the embeddings of two texts: lists of numbers (768 for EmbeddingGemma), drawn as arrows</dd>
<dt>a · b (dot product)</dt><dd>multiply matching numbers and add them all up</dd>
<dt>|a| (length)</dt><dd>how long the arrow is: the square root of the sum of its squared numbers</dd>
<dt>cos θ</dt><dd>how closely the two arrows point the same way: 1 same direction, 0 unrelated, −1 opposite</dd>
<dt>Physical meaning</dt><dd>Every sentence gets an address on a huge map of meanings, and "vacation days" and "annual leave" live on the same street. Cosine similarity is the compass check: it asks whether two addresses lie in the same direction, so a short note and a long paragraph on the same topic still match.</dd>
</dl>

</div>

<div class="myth">

**"A high similarity score means the passage is true or answers the question."** It means the passage is about the same thing. "The drug is safe" and "the drug is not safe" can score very close. Retrieval finds the topic; the chat model still has to read the text carefully (Lesson 12.5).

</div>

## 5. Worked example

*Made-up numbers.* A research student embeds 3,000 paragraph-sized chunks from 40 papers with EmbeddingGemma on a laptop CPU at about 25 chunks a second: two minutes. Each vector is 768 numbers × 4 bytes = 3 KB, so the whole index is 9 MB. The question "which papers measured soil carbon after burning?" finds a paragraph that says "post-fire organic matter in the topsoil", which a word search would have missed.

## 6. Practice

1. Run the script. Add a fourth sentence in another language that you speak, meaning the same as sentence 1, and check its score.
2. Add "Staff do not get paid vacation." How close is it to sentence 1? What does that tell you?
3. How many bytes does one 768-number vector take as 32-bit floats? And 10,000 of them?

<details>
<summary>Answers</summary>

1. A multilingual model like EmbeddingGemma usually scores it high; an English-only model will not.
2. Probably high. Embeddings find the topic; the chat model must still read the text carefully (Lesson 12.5).
3. 768 × 4 = 3,072 bytes; 10,000 × 3 KB ≈ 30 MB.
</details>

**New words:** *embedding* / *vector* / *a point in many-dimensional space*; *embedding model* (a small model that outputs vectors); *cosine similarity* (how closely two vectors point the same way, from -1 to 1).

<div class="keypoints">

- An embedding model turns text into a fixed list of numbers; similar meanings get nearby numbers.
- Embeddings match meaning, not words, so "annual leave" finds "vacation days".
- Cosine similarity measures the angle between two embeddings; with length-1 vectors it is just the dot product.
- Small embedding models such as EmbeddingGemma (`ollama pull embeddinggemma`) run fast on a laptop, fully offline.
- The question and the documents must use the same embedding model, and a high score means same topic, not a true answer.

</div>
