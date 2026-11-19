---
title: 'Text in, text out: predicting the next token'
seoTitle: 'How a language model predicts text | Offline AI'
summary: A language model does one thing, over and over, which is to guess the next token. See how that one trick produces answers, code and essays, and what temperature does to it.
minutes: 20
updated: 2026-11-19
quiz:
  - q: What does a language model do at each step?
    choices: ['Looks the answer up in a database', 'Gives every possible next token a probability, then picks one', 'Searches the internet']
    ans: 1
    why: The model scores every token in its vocabulary, turns the scores into probabilities, and one token is chosen. Then it repeats.
  - q: What does temperature 0 do?
    choices: ['Always picks the most likely token, so answers repeat exactly', 'Makes answers random', 'Turns the model off']
    ans: 0
    why: At temperature 0 the top token always wins, which is good for facts, extraction and code.
  - q: How does a model write a 300-token answer?
    choices: ['All at once', 'By predicting one token, adding it to the text, and predicting again, 300 times', 'By copying a stored answer']
    ans: 1
    why: Each new token is added to the context and the model predicts again. This loop is why writing is slower than reading.
---

**Module 2 · about 20 minutes · read first: 3.1.** You'll be able to explain how a model produces text, and what the temperature setting changes.

## 1. Why this matters

Every behaviour you will see, good and bad, follows from one simple loop. Once you see it, settings such as temperature, problems such as made-up facts, and limits such as speed all make sense.

## 2. The loop

1. The model reads all the tokens so far (your prompt, plus anything it has written).
2. It gives **every** token in its vocabulary a score, then turns the scores into **probabilities** that add up to 100%.
3. One token is **chosen** from those probabilities.
4. That token is added to the text, and the loop starts again, until the model writes a special "stop" token or reaches a length limit.

That is all. Answers, poems, code and translations are all this loop, run hundreds of times. The skill is in the scores, which come from patterns learned in training (Lesson 2.3).

<!--fig:next-word-->

## 3. Choosing the token: temperature

**Temperature** controls how the choice is made:

- **0:** always the most likely token. Same input, same output. Best for facts, data extraction and code.
- **about 0.7 to 1:** mostly likely tokens, sometimes others. Natural for writing and chat.
- **above about 1.2:** unlikely tokens appear often. Creative, then rambling, then nonsense.

Lesson 10.1 covers the other dials (top-p, top-k, repeat penalty).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** scores become probabilities through the softmax function, and temperature divides the scores before that.

**Equation:** P(token i) = e^(sᵢ/T) ÷ Σⱼ e^(sⱼ/T), where sᵢ is the score and T the temperature.

**Analogy:** a crowd voting with louder and quieter voices. Low temperature lets the loudest voice win every time; high temperature turns everyone to the same volume.

**Try it:** two tokens with scores 2 and 1 at T = 1? (e² ≈ 7.39, e¹ ≈ 2.72; P = 7.39 ÷ 10.11 ≈ 73% and 27%.)
</details>

## 4. Worked example

*Made-up numbers.* Hana asks a model to pull the invoice number and total from 50 emails. At temperature 0.8 it sometimes rewords the total ("about 300 dollars"). At temperature 0 it copies the exact figures every time. She keeps 0 for extraction and 0.7 for drafting replies.

## 5. Practice

1. In the simulation, set temperature to 0 and pick ten times. Then 1.5. What changes?
2. With scores 3 and 1 at T = 0.5, what is the probability of the first? (Use the box.)
3. Which temperature would you use for a summary of a legal letter?

<details>
<summary>Answers</summary>

1. At 0 you always get the top word; at 1.5 unlikely words appear often.
2. Divide by T: 6 and 2. e⁶ ≈ 403, e² ≈ 7.4, so about 98%.
3. Low, 0 to 0.3: you want faithful, repeatable wording.
</details>

**New words:** *probability distribution* (chances for every possible next token), *softmax* (the formula that turns scores into probabilities), *temperature* (how adventurous the choice is), *stop token*.
