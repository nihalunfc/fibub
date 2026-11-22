---
title: 'Text in, text out: predicting the next token'
seoTitle: 'How a language model predicts text | Offline AI'
summary: A language model does one thing, over and over, which is to guess the next token. See how that one trick produces answers, code and essays, and what temperature does to it.
minutes: 20
updated: 2026-11-22
sources:
  - 'Jurafsky, D. and Martin, J. H., Speech and Language Processing, 3rd edition draft, chapters on language models and large language models https://web.stanford.edu/~jurafsky/slp3/'
  - 'Holtzman, A. et al. (2019), The Curious Case of Neural Text Degeneration (on sampling and temperature) https://arxiv.org/abs/1904.09751'
  - 'Brown, T. et al. (2020), Language Models are Few-Shot Learners https://arxiv.org/abs/2005.14165'
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

<div class="bigidea">A language model does one thing over and over: it gives every possible next token a chance, picks one, adds it to the text, and goes again.</div>

## 1. Why this matters

Every behaviour you will see, good and bad, follows from one simple loop. Once you see it, a lot makes sense: settings such as temperature, problems such as made-up facts, and limits such as speed.

Think of the phone keyboard that suggests your next word. A language model is that idea grown enormous: it has read far more text, so its suggestions can carry on a whole essay.

## 2. The loop

1. The model reads all the tokens so far (your prompt, plus anything it has written).
2. It gives **every** token in its vocabulary a score, then turns the scores into **probabilities** that add up to 100%.
3. One token is **chosen** from those probabilities.
4. That token is added to the text, and the loop starts again, until the model writes a special "stop" token or reaches a length limit.

That is all. Answers, poems, code and translations are all this loop, run hundreds of times. The skill is in the scores, which come from patterns learned in training (Lesson 2.3).

Watch one turn of the loop. The text so far is "The cat sat on the", and to keep it small we look at only four of the many thousands of possible tokens.

<div class="steps" data-fig="next-token-prediction-pick">
<div class="step"><p><b>Read.</b> The model reads every token so far: "The", " cat", " sat", " on", " the".</p></div>
<div class="step"><p><b>Score.</b> It gives each possible next token a score: " mat" <b>3</b>, " sofa" <b>2</b>, " roof" <b>1</b>, " moon" <b>0</b>. Higher means "fits better here".</p></div>
<div class="step"><p><b>Turn scores into chances.</b> Softmax: e<sup>3</sup> = 20.1, e<sup>2</sup> = 7.4, e<sup>1</sup> = 2.7, e<sup>0</sup> = 1, total 31.2. Divide each by the total: <b>64%, 24%, 9%, 3%</b>. They add up to 100%.</p></div>
<div class="step"><p><b>Pick.</b> At temperature 1 the model draws from these chances, like a weighted lucky dip: " mat" most times, " sofa" now and then. At temperature 0 it always takes " mat".</p></div>
<div class="step"><p><b>Add and repeat.</b> " mat" joins the text: "The cat sat on the mat". The model reads it all again and scores the next token, perhaps "." or " and".</p></div>
</div>

<!--fig:next-word-->

Try it: set temperature to 0.3, then 1.8, then cut the list with top-k and top-p, and press Draw 200 each time.

<figure class="fig" data-fig="@ai-sampling-topp"><figcaption>Temperature reshapes the odds; top-k and top-p remove the unlikely tail before choosing. Low settings give safe, repeatable text; high settings give variety and more risk of nonsense.</figcaption></figure>

## 3. Choosing the token: temperature

**Temperature** controls how the choice is made. Think of it as a "boldness" dial:

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

<div class="meaning">

<dl>
<dt>s<sub>i</sub></dt><dd>the score the model gives token i: how well it fits next</dd>
<dt>T</dt><dd>temperature: the boldness dial. Small T sharpens the gap between scores, large T flattens it</dd>
<dt>e<sup>s/T</sup></dt><dd>"e to the power": makes every score positive and stretches bigger scores further ahead</dd>
<dt>P(token i)</dt><dd>its share of the total: the chance it is picked. All the chances add up to 1 (100%)</dd>
<dt>Physical meaning</dt><dd>The model never "knows" the next word; it only has chances. At temperature 0 you always get the favourite, so the same question gives the same answer. Turn the dial up and the less likely words get a real chance, which reads as creativity, then as nonsense.</dd>
</dl>

</div>

At temperature 0.5 the same scores become 6, 4, 2 and 0, and the chances become about 86%, 12%, 2% and 0.2%: " mat" wins far more often. Try one yourself.

<div class="problem" data-problem="next-token-prediction-softmax"></div>

Try it: drag the score bars, press Add 2 to all, and move the temperature.

<figure class="fig" data-fig="@ai-softmax-lab"><figcaption>Softmax turns any scores into probabilities that are positive and add to 100%. Adding the same number to every score changes nothing; a low temperature makes the leader win nearly everything and a high one flattens the odds.</figcaption></figure>

Try it: press Generate 20 with 1 word of memory, then with 2 words.

<figure class="fig" data-fig="@ai-bigram-gen"><figcaption>A language model is a table of what tends to come next. More memory gives more sensible text but copies the source, because there is only one continuation. Real models do this with billions of numbers instead of a table.</figcaption></figure>

## 4. Worked example

*Made-up numbers.* Hana asks a model to pull the invoice number and total from 50 emails. At temperature 0.8 it sometimes rewords the total ("about 300 dollars"). At temperature 0 it copies the exact figures every time. She keeps 0 for extraction and 0.7 for drafting replies.

<div class="myth">

**"The model thinks up the whole answer first, then types it out slowly."** It doesn't keep a hidden finished draft. Each token is chosen in turn, using everything written so far, and once a token is written it shapes everything after it. That is why a wrong early word can send an answer off track, and why asking the model to plan or reason step by step first often helps: the plan becomes part of the text it reads.

</div>

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

<div class="keypoints">

- A language model repeats one loop: read all tokens so far, score every possible next token, pick one, add it, repeat.
- Softmax turns scores into chances: P(i) = e^(sᵢ/T) ÷ the sum of e^(sⱼ/T) over all tokens.
- Temperature 0 always takes the most likely token (repeatable; best for facts and code); about 0.7 to 1 suits writing.
- A 300-token answer means 300 turns of the loop, which is why writing is slower than reading.
- All the skill is in the scores, which come from patterns learned in training.

</div>
