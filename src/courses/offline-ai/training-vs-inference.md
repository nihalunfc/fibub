---
title: 'Training and inference: learning versus using'
seoTitle: 'Training vs inference explained | Offline AI'
summary: Training a model takes months on thousands of chips; using it takes seconds on your laptop. Why the two are so different, and why you only ever do the second at home.
minutes: 20
updated: 2026-11-22
sources:
  - 'Kaplan, J. et al. (2020), Scaling Laws for Neural Language Models (source of the 6 × parameters × tokens rule) https://arxiv.org/abs/2001.08361'
  - 'Ouyang, L. et al. (2022), Training language models to follow instructions with human feedback https://arxiv.org/abs/2203.02155'
  - 'Jurafsky, D. and Martin, J. H., Speech and Language Processing, 3rd edition draft, chapter on large language models https://web.stanford.edu/~jurafsky/slp3/'
quiz:
  - q: What happens during training?
    choices: ['The model answers questions for users', 'The parameters are adjusted, again and again, to predict the next token in huge amounts of text better', 'The model is downloaded']
    ans: 1
    why: Training nudges billions of numbers to reduce prediction error over trillions of tokens.
  - q: Does a local model learn from your chats?
    choices: ['Yes, after every message', 'No, its parameters stay fixed; it only sees what is in the context window', 'Only on weekends']
    ans: 1
    why: Inference never changes the weights. To make it know your material, give it the material (Module 12) or fine-tune it (Module 14).
  - q: Why is training so much more expensive than inference?
    choices: ['It is done over trillions of tokens, with extra work to adjust every weight', 'Training uses older chips', 'Inference is subsidised']
    ans: 0
    why: Training reads the whole training set (often several times) and, for each token, works out how every weight should change.
---

**Module 2 · about 20 minutes · read first: 2.1 and 2.2.** You'll be able to explain why running a model is cheap and making one is not.

<div class="bigidea">Training sets the model's numbers once, at huge cost; inference only uses those numbers, so it is cheap and never changes what the model knows.</div>

## 1. Why this matters

People often expect a local model to "learn" their business by chatting with it. It will not. Knowing the difference between training and inference tells you which tool gives the model what it needs: context, document search or fine-tuning.

## 2. Training: making the model

A model starts as random numbers. Training shows it text and asks it to predict each next token. It measures how wrong the guess was and nudges every parameter a tiny bit to be less wrong. Repeat over trillions of tokens and the numbers come to hold grammar, facts, reasoning patterns and styles.

It is like learning to throw darts. Each throw, you see how far you missed and adjust your arm a little. After millions of throws your arm "knows" the board.

<div class="steps">
<div class="step"><p><b>Show a sentence.</b> The training text says "The cat sat on the mat". The model sees "The cat sat on the" and must guess the next token.</p></div>
<div class="step"><p><b>It guesses.</b> Early in training it gives " mat" only <b>20%</b>. Its favourite is " table" at 30%.</p></div>
<div class="step"><p><b>Measure the miss.</b> The right answer was " mat". The error is measured as −ln(0.20) = <b>1.61</b> (a perfect guess of 100% would score 0).</p></div>
<div class="step"><p><b>Nudge every knob.</b> The training program works out which way each of the billions of parameters should move to raise " mat", and moves each one a tiny bit. Next time " mat" gets <b>25%</b>; the error falls to 1.39.</p></div>
<div class="step"><p><b>Repeat trillions of times,</b> on every token of every sentence. Then training stops and the numbers are frozen. From now on, using the model (inference) reads them but never moves them.</p></div>
</div>

This takes data centres with thousands of specialised chips running for weeks or months. Afterwards, **post-training** teaches the model to follow instructions, chat and refuse harmful requests, using examples and feedback.

Try it: slide the rank from 1 up to 12 and watch the rebuilt grid catch up with the original.

<figure class="fig" data-fig="@ai-lowrank"><figcaption>A big table of numbers can often be rebuilt from a few stripes, each a column times a row. That is exactly why a small LoRA adapter can change a big model: it stores r times (rows + columns) numbers instead of rows times columns.</figcaption></figure>

## 3. Inference: using the model

**Inference** is running the finished model: read the input, predict tokens, done. The weights do not change. It takes one machine and seconds. This is all you do at home (and all a cloud chatbot does when you use it).

<div class="myth">

**"If I chat with my local model every day, it will learn my business."** It won't. Its parameters are frozen; chatting is inference, and inference never changes them. Within one chat it can use what you told it, because that text is in its context window (Lesson 3.3). Start a new chat and it is gone. Some apps add a "memory" feature, but that just saves notes and pastes them back into the context.

</div>

Try it: press Generate from noise, then raise Guess error and generate again.

<figure class="fig" data-fig="@ai-diffusion-denoise"><figcaption>An image model starts from pure noise and repeatedly guesses and removes noise. Better guesses and more steps give a cleaner picture; poor guesses leave artefacts.</figcaption></figure>

## 4. So how does it "know" my stuff?

- **In the context:** paste or attach it (Lesson 3.3). Simple, limited by window size.
- **Document search (RAG):** find the relevant parts of your files and add them automatically (Module 12).
- **Fine-tuning:** a small extra round of training on your examples (Module 14), for style and format more than facts.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** training adjusts weights to reduce prediction error; inference only uses them.

**Equation:** rough compute for training ≈ 6 × parameters × training tokens; for inference ≈ 2 × parameters per token generated.

**Analogy:** writing a textbook versus reading it. Writing takes years and a team; reading a page takes a minute, and reading never changes the book.

**Try it:** with these rules, how many times more compute does training a 10B model on 10 trillion tokens take than generating 1,000 tokens? (6 × 10¹⁰ × 10¹³ ÷ (2 × 10¹⁰ × 10³) = 3 × 10¹⁰: thirty billion times.)
</details>

<div class="meaning">

<dl>
<dt>P</dt><dd>parameters: how many numbers the model has</dd>
<dt>D</dt><dd>training tokens: how much text the model read while learning, often trillions</dd>
<dt>6 × P × D</dt><dd>rough number of calculations to train: about 2 per parameter per token to predict, and about 4 more to work out the nudges</dd>
<dt>2 × P per token</dt><dd>rough number of calculations to write one token at home: only the predicting part</dd>
<dt>Physical meaning</dt><dd>Training is writing the textbook; inference is reading a page. A company spends months and fortunes once, and then anyone with the file can use the result for the cost of electricity. That is why you can run a model you could never afford to make.</dd>
</dl>

</div>

<div class="problem" data-problem="training-vs-inference-compute"></div>

Try it: press Generate 20 with 1 word of memory, then with 2 words.

<figure class="fig" data-fig="@ai-bigram-gen"><figcaption>A language model is a table of what tends to come next. More memory gives more sensible text but copies the source, because there is only one continuation. Real models do this with billions of numbers instead of a table.</figcaption></figure>

Try it: press Play on the long valley, then raise the learning rate until it zig-zags and finally flies off; add momentum to calm the zig-zag. Click the picture to choose another start.

<figure class="fig" data-fig="@ai-sgd-landscape"><figcaption>A small learning rate crawls, a big one overshoots and diverges, and momentum smooths the zig-zag in a narrow valley. On the two-valley surface the start point decides which minimum you reach: gradient descent finds a nearby low point, not necessarily the lowest.</figcaption></figure>

Try it: move the two inputs, tap a line or neuron and change its weight or bias with the slider, and switch the activation.

<figure class="fig" data-fig="@ai-forward-pass"><figcaption>Every neuron does the same small job: add up weight times input over its lines, add its bias, apply the activation. A network is just many of these. Learning means moving the weights and biases until the output is right.</figcaption></figure>

Step through one training step of the smallest possible network, forward first, then backwards.

<figure class="fig" data-fig="@ai-backprop-player"><figcaption>The forward pass makes the prediction and the loss. The backward pass multiplies slopes link by link (the chain rule) so every weight learns how it should change. Then each weight takes a small step against its slope.</figcaption></figure>

## 5. Worked example

*Made-up numbers.* A hotel manager chats with a local model for a week about their room rates, then asks "What is our weekend rate?". The model guesses wrong: nothing from earlier chats changed it. They add the rate card as a document to search (Module 12) and the model answers correctly every time.

## 6. Practice

1. Tell your model a made-up fact, start a new chat and ask about it. What happens?
2. Which of the three ways would you use for your company's 200-page policy manual?
3. Why is it fine to run a model with no internet?

<details>
<summary>Answers</summary>

1. It does not know: new chats start with an empty context, and weights never change.
2. Document search (RAG): too long for one context, and facts are better found than trained in.
3. Inference only needs the weights on your machine.
</details>

**New words:** *training*, *post-training* (teaching a trained model to follow instructions), *inference*, *fine-tuning* (a small extra training run on your own examples).

<div class="keypoints">

- Training nudges every parameter, over trillions of tokens, to predict the next token better; it takes thousands of chips for weeks or months.
- Inference uses the frozen parameters to answer; it takes one machine and seconds, and never changes the model.
- Compute: training ≈ 6 × parameters × training tokens; inference ≈ 2 × parameters per token written.
- A local model does not learn from your chats; it only sees what is in its context window.
- To give it your knowledge: put it in the context, use document search (RAG), or fine-tune for style and format.

</div>
