---
title: 'Transformers and attention, explained with a classroom'
seoTitle: 'Transformers and attention explained | Offline AI'
summary: The transformer is the design inside almost every language model. Attention lets each word look back at the words that matter to it. A plain-words picture, then the maths.
minutes: 25
updated: 2026-11-22
sources:
  - 'Vaswani, A. et al. (2017), Attention Is All You Need https://arxiv.org/abs/1706.03762'
  - 'Liu, N. F. et al. (2023), Lost in the Middle: How Language Models Use Long Contexts https://arxiv.org/abs/2307.03172'
  - 'Jurafsky, D. and Martin, J. H., Speech and Language Processing, 3rd edition draft, chapter on transformers https://web.stanford.edu/~jurafsky/slp3/'
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

<div class="bigidea">Attention lets each token look back at the earlier tokens, decide which ones matter to it, and borrow their meaning, layer after layer.</div>

## 1. Why this matters

You do not need the maths to run models. But this picture explains three practical things:

- why context costs memory (the KV cache);
- why long documents slow down;
- why models lose track of the middle of very long texts.

## 2. The classroom picture

Imagine each token is a student in a row, holding a card with its word. To understand "it" in "The cat sat on the mat because it was tired", the student holding "it" needs to know who "it" is.

- Every student writes a **question** ("I'm a pronoun, who am I about?"), a **label** ("I'm an animal, a noun") and some **notes** to share.
- The "it" student compares its question with every earlier student's label. "cat" matches best, "mat" a little, "the" hardly at all.
- It then takes a mix of everyone's notes, mostly from "cat". Now "it" carries the meaning "the cat".

That is **attention**. In model terms the question, label and notes are the **query**, **key** and **value**. Each token can only look back, never forward.

Here it is with small made-up numbers. To keep it short, "it" looks at just three earlier words.

<div class="steps" data-fig="transformers-attention-it">
<div class="step"><p><b>Ask.</b> "it" holds up its question: "who am I about?"</p></div>
<div class="step"><p><b>Compare.</b> It checks the question against each earlier label. Match scores: "cat" <b>2</b>, "mat" <b>1</b>, "the" <b>0</b>.</p></div>
<div class="step"><p><b>Turn scores into shares.</b> Softmax: e<sup>2</sup> = 7.39, e<sup>1</sup> = 2.72, e<sup>0</sup> = 1, total 11.11. Shares: "cat" <b>67%</b>, "mat" <b>24%</b>, "the" <b>9%</b>.</p></div>
<div class="step"><p><b>Blend the notes.</b> "it" takes 67% of cat's notes, 24% of mat's and 9% of the's. Its card now mostly says "animal, the one that sat".</p></div>
<div class="step"><p><b>Keep the labels and notes.</b> The engine stores each word's key and value (the <b>KV cache</b>), so the next word can compare against them without working them out again.</p></div>
</div>

Try it: tap the word "it" in the Meaning link head, then switch the mask between causal and full.

<figure class="fig" data-fig="@ai-attention-heads"><figcaption>Each head learns its own pattern of who looks at whom, and a weight row always adds to 100%. In a text generator the causal mask hides later words, because they have not been written yet.</figcaption></figure>

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

<div class="meaning">

<dl>
<dt>Q (query)</dt><dd>what the current token is looking for: the question on its card</dd>
<dt>K (key)</dt><dd>what each earlier token offers: its label</dd>
<dt>V (value)</dt><dd>the information each earlier token passes on if chosen: its notes</dd>
<dt>Q Kᵀ ÷ √d</dt><dd>the match scores, one per earlier token; dividing by √d (d is the length of a key) keeps the scores from getting too big</dd>
<dt>softmax(...) V</dt><dd>turn scores into shares that add up to 1, then blend the values by those shares</dd>
<dt>Physical meaning</dt><dd>Each token decides whom to listen to. After attention, the token for "it" carries the cat's meaning, so the model can use it correctly. Every new token must compare with every stored key, which is why long chats use more memory and get slower.</dd>
</dl>

</div>

<div class="problem" data-problem="transformers-attention-weight"></div>

## 5. Worked example

*Made-up numbers.* A model reads a 40-page contract. The answer to Gita's question is on page 21. The model misses it. She moves the question to the end of the prompt and asks it to quote the clause first; it now finds it. Attention at the start and end of long texts is stronger than in the middle.

<div class="myth">

**"If it fits in the context window, the model reads every part equally carefully."** Not quite. Attention shares are spread over every token, and tests (Liu and colleagues, 2023, in the sources) found models use facts at the start and end of a long input much better than facts in the middle. For long documents, put your question last, ask for quotes, or send only the relevant parts (Module 12).

</div>

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

**Go deeper:** the maths of attention, with a live attention map you can change, is in [Attention: each word looks at the others](/learn/courses/ml-foundations/attention/), part of the free course From a straight line to an LLM.

**New words:** *transformer*, *attention*, *query, key, value*, *layer*, *feed-forward*, *KV cache*.

<div class="keypoints">

- Attention: each token compares its query with earlier tokens' keys, turns the scores into shares with softmax, and blends their values.
- A transformer stacks dozens of layers, each attention plus a feed-forward step where most parameters live.
- Tokens only look back, never forward, because later tokens do not exist yet.
- The KV cache stores every earlier token's keys and values, so it grows with the length of the conversation.
- Long inputs are slower and the middle gets less attention: put the question last and ask for quotes.

</div>
