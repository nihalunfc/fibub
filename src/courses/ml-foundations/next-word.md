---
title: 'Predicting the next word'
seoTitle: 'How language models predict the next word: n-grams to LLMs'
summary: 'A language model gives a probability to every possible next word. Build one by counting word pairs, write sentences with it, see what temperature does, and learn the loss every LLM is trained on.'
minutes: 25
updated: 2026-11-21
quiz:
  - q: '"the" is followed by "cat" 4 times out of 20 in the training text. A bigram model gives P(cat | the) ='
    choices: ['0.2', '4', '0.04']
    ans: 0
    why: A bigram probability is a count divided by the count of the word before it, 4 / 20.
  - q: Raising the temperature when drawing the next word makes the text
    choices: ['More varied and more surprising', 'Always the same', 'Shorter']
    ans: 0
    why: High temperature flattens the probabilities, so less likely words are drawn more often. Low temperature sharpens them.
  - q: 'A model gives the true next word probability 0.25. Its loss for that word is:'
    choices: ['ln 4 ≈ 1.39', '0.25', '0.75']
    ans: 0
    why: The loss is −ln p = −ln 0.25 = ln 4. A sure, right guess (p = 1) costs 0.
---

**Module 10 · about 25 minutes · read first: 1.6, 4.3.** You'll be able to build a bigram model by counting, compute the probability of a sentence, explain temperature, and read a model's loss and perplexity.

## 1. Why this matters

Every LLM, from a phone keyboard to a chatbot, does one thing: given the text so far, give a probability to each possible next token (word or piece of a word), pick one, and repeat. Everything an LLM appears to do, from answering questions to writing code, comes out of that loop. Understanding it on a tiny model explains both why LLMs are fluent and why they can be confidently wrong.

## 2. Counting: n-gram models

The simplest language model counts. A **bigram** model counts which word follows which in a training text. If "the" is followed by "cat" 4 times out of 20, then `$P(\text{cat} \mid \text{the}) = 0.2$`. A **trigram** model looks at the two words before, and so on.

<!--fig:next-word-->

To write, start from the sentence-start marker, pick a next word, and repeat. Always taking the most likely word gives dull loops. Drawing at random by the probabilities gives variety. **Temperature** reshapes the odds first: below 1, likely words get likelier; above 1, everything evens out.

## 3. From counts to neural language models

Counting breaks down quickly. With a vocabulary of 50,000 words there are 125 trillion possible word triples, and most never appear in any text, so the counts are mostly zero. A **neural language model** replaces the count table with a network: embed the previous words (Lesson 10.2), pass them through layers, and output one score per vocabulary word, turned into probabilities by **softmax**. Similar contexts give similar predictions, even for word sequences never seen before.

Old neural language models read only the last few words, or used recurrent networks (Lesson 9.7) that forgot. Transformers (Lessons 10.4 and 10.5) can use thousands of earlier tokens.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a sentence's probability is the product of each word's probability given what came before.

**Chain rule of probability:**

```math
P(w_1, \dots, w_n) = \prod_{t=1}^{n} P(w_t \mid w_1, \dots, w_{t-1})
```

A bigram model keeps only the last word: `$P(w_t \mid w_{t-1}) = \text{count}(w_{t-1}, w_t) / \text{count}(w_{t-1})$`.

**Softmax with temperature `$T$`:** from scores `$z_i$`,

```math
p_i = \frac{e^{z_i / T}}{\sum_j e^{z_j / T}}
```

**Loss:** the **cross-entropy**, `$-\ln p(\text{true next word})$`, averaged over every position in the training text. Its exponential is the **perplexity**: a perplexity of 20 means the model is as unsure as if it chose fairly among 20 words.

**Analogy:** predictive text on a phone, which suggests the next word from what you usually type after the last one.

**Try it:** a model gives the true next words probabilities 0.5 and 0.125. Mean loss and perplexity? (`$(\ln 2 + \ln 8)/2 = \ln 4 = 1.386$`; perplexity `$e^{1.386} = 4$`.)
</details>

## 4. Worked example

From the 14 training sentences in the simulation: a sentence starts with "the" 12 times out of 14; "the" is followed by "cat" 4 times out of 20; "cat" by "sat" once out of 5.

```math
P(\text{the cat sat}) = \tfrac{12}{14} \times \tfrac{4}{20} \times \tfrac{1}{5} = 0.857 \times 0.2 \times 0.2 = 0.034
```

"the cat flew" gets probability 0: "flew" never follows "cat" in the training text. A neural model would give it a small, sensible probability, since "flew" behaves like other verbs it has seen.

## 5. Practice

1. In the simulation, press "Add the most likely word" until the sentence stops. What goes wrong, and why?
2. Set the temperature to 0.2 and draw at random several times. How is that like choosing the top word?
3. Why does a bigram model give zero probability to many perfectly good sentences?

<details>
<summary>Answers</summary>

1. It loops: "the cat likes the cat likes …", because after "the" the top word is always "cat", and so on round the circle.
2. At low temperature the top word's probability is close to 1, so a random draw almost always picks it.
3. It only knows word pairs it has seen. Any sentence with one unseen pair gets probability 0, however natural.
</details>

**Try it on your own data:** the [[word-counter]] counts the words in your own text, the first step of any n-gram model.

**New words:** *language model*, *token*, *bigram*, *n-gram*, *chain rule of probability*, *softmax*, *temperature*, *cross-entropy*, *perplexity*.
