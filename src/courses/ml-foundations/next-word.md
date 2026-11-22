---
title: 'Predicting the next word'
seoTitle: 'How language models predict the next word: n-grams to LLMs'
summary: 'A language model gives a probability to every possible next word. Build one by counting word pairs, write sentences with it, see what temperature does, and learn the loss every LLM is trained on.'
minutes: 25
updated: 2026-11-22
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
sources:
  - 'Jurafsky, D. and Martin, J. H., Speech and Language Processing, 3rd edition draft, chapter 3 (n-gram language models, perplexity) https://web.stanford.edu/~jurafsky/slp3/'
  - 'Bengio, Y., Ducharme, R., Vincent, P. and Jauvin, C. (2003), A Neural Probabilistic Language Model, Journal of Machine Learning Research 3, 1137-1155'
  - 'Goodfellow, I., Bengio, Y. and Courville, A. (2016), Deep Learning, MIT Press, section 12.4 (n-grams and neural language models) https://www.deeplearningbook.org/'
---

**Module 10 · about 25 minutes · read first: 1.6, 4.3.** You'll be able to build a bigram model by counting, work out the probability of a sentence, explain temperature, and read a model's loss and perplexity.

<div class="bigidea">A language model is a very good guesser of the next word. Guess, write the word down, and guess again: that loop is all an LLM does.</div>

## 1. Why this matters

Every LLM, from a phone keyboard to a chatbot, does one thing. Given the text so far, it gives a probability to each possible next **token** (a word or a piece of a word), picks one, and repeats. Answering questions, writing emails and writing code all come out of that loop.

Seeing the loop on a tiny model explains two things at once: why LLMs sound so fluent, and why they can be confidently wrong.

## 2. Counting: n-gram models

The simplest language model just counts. A **bigram** model ("bi" = two) counts which word follows which in some training text. If "the" is followed by "cat" 4 times out of 20, then `$P(\text{cat} \mid \text{the}) = 4/20 = 0.2$`. Read the bar "|" as "given": the chance of "cat", given that the last word was "the". A **trigram** model looks at the two words before, and so on.

**Everyday picture:** the word suggestions above your phone keyboard. After "see you", it offers "soon", "tomorrow" and "later", because those are what usually come next.

<!--fig:next-word-->

To write, start from the start-of-sentence marker, pick a next word, and repeat. Always taking the single most likely word gives dull loops. Drawing at random by the probabilities gives variety. **Temperature** reshapes the odds first: below 1, likely words get likelier; above 1, the odds even out and surprises creep in.

A sentence's probability is each word's probability multiplied together. Watch the bigram model score "the cat sat":

<div class="steps" data-fig="next-word-bars">
<div class="step"><p><b>First word.</b> 12 of the 14 training sentences start with "the", so P(the | start) = 12/14 = <b>0.857</b>.</p></div>
<div class="step"><p><b>Second word.</b> "the" appears 20 times and is followed by "cat" 4 times: P(cat | the) = 4/20 = <b>0.2</b>.</p></div>
<div class="step"><p><b>Third word.</b> "cat" appears 5 times and is followed by "sat" once: P(sat | cat) = 1/5 = <b>0.2</b>.</p></div>
<div class="step"><p><b>Multiply.</b> P(the cat sat) = 0.857 × 0.2 × 0.2 = <b>0.034</b>. Each extra word can only shrink the total.</p></div>
<div class="step"><p><b>An unseen pair.</b> "flew" never follows "cat" in the training text, so P(flew | cat) = 0, and "the cat flew" gets probability <b>0</b>, however natural it sounds.</p></div>
</div>

<div class="problem" data-problem="next-word-bigram"></div>

## 3. From counts to neural language models

Counting breaks down fast. With a vocabulary of 50,000 words there are 125 trillion possible three-word sequences, and most never appear in any text, so most counts are zero.

A **neural language model** swaps the count table for a network:

1. embed the previous words (Lesson 10.2);
2. pass them through layers;
3. output one score per vocabulary word, turned into probabilities by **softmax** (which makes the scores positive and adds them up to 1).

Because similar words have similar embeddings, similar contexts give similar guesses, even for word sequences the model has never seen.

Early neural language models read only the last few words, or used recurrent networks (Lesson 9.7) that forgot. Transformers (Lessons 10.4 and 10.5) can use thousands of earlier tokens.

## 4. Scoring a model: loss and perplexity

How do we know a model guesses well? Show it real text, and at each position look at the probability it gave the word that really came next. The **loss** for that word is `$-\ln p$`: 0 if it was sure and right (p = 1), large if it gave the true word a tiny chance.

<div class="meaning">

<dl>
<dt>p</dt><dd>the probability the model gave the word that really came next</dd>
<dt>−ln p</dt><dd>the loss for that word (cross-entropy): 0 for a sure, right guess; it grows fast as p gets small</dd>
<dt>L</dt><dd>the average loss over every position in the text</dd>
<dt>perplexity = e<sup>L</sup></dt><dd>how many words the model is, in effect, choosing between at each step</dd>
<dt>Physical meaning</dt><dd>Perplexity is the model's "number of equally likely options". A perplexity of 20 means it is as unsure as if it picked fairly from 20 words each time. A better model has a lower number, and a model with perplexity 1 would know every next word for certain.</dd>
</dl>

</div>

<div class="problem" data-problem="next-word-perplexity"></div>

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

## 5. Worked example

From the 14 training sentences in the simulation: a sentence starts with "the" 12 times out of 14; "the" is followed by "cat" 4 times out of 20; "cat" by "sat" once out of 5.

```math
P(\text{the cat sat}) = \tfrac{12}{14} \times \tfrac{4}{20} \times \tfrac{1}{5} = 0.857 \times 0.2 \times 0.2 = 0.034
```

"the cat flew" gets probability 0: "flew" never follows "cat" in the training text. A neural model would give it a small, sensible probability, since "flew" behaves like other verbs it has seen.

<div class="myth">

**"Temperature 0 makes the model correct."** Low temperature only makes it pick its top word every time. If the top word is wrong, it is now wrong every time, just more consistently. Temperature controls variety, not truth.

</div>

## 6. Practice

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

<div class="keypoints">

- A language model gives a probability to every possible next token; writing is guessing, adding the word and guessing again.
- A bigram model counts pairs: P(next | last) = count of the pair ÷ count of the last word.
- A sentence's probability is the product of its words' probabilities, so one unseen pair gives a count model 0.
- Temperature reshapes the odds: low is safe and repetitive, high is varied and riskier; it never makes an answer true.
- The training loss is −ln p of the true next word; perplexity = e<sup>loss</sup> is the number of words the model is, in effect, choosing between.

</div>
