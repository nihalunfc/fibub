---
title: 'Training and inference: learning versus using'
seoTitle: 'Training vs inference explained | Offline AI'
summary: Training a model takes months on thousands of chips; using it takes seconds on your laptop. Why the two are so different, and why you only ever do the second at home.
minutes: 20
updated: 2026-11-19
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

## 1. Why this matters

People often expect a local model to "learn" their business by chatting with it. It will not. Knowing the difference between training and inference tells you which tool (context, document search or fine-tuning) gives the model what it needs.

## 2. Training: making the model

A model starts as random numbers. Training shows it text, asks it to predict each next token, measures how wrong it was, and nudges every parameter a tiny bit to be less wrong. Repeat over trillions of tokens and the numbers come to hold grammar, facts, reasoning patterns and styles.

This takes data centres with thousands of specialised chips running for weeks or months. Afterwards, **post-training** teaches the model to follow instructions, chat and refuse harmful requests, using examples and feedback.

## 3. Inference: using the model

**Inference** is running the finished model: read the input, predict tokens, done. The weights do not change. It takes one machine and seconds. This is all you do at home (and all a cloud chatbot does when you use it).

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
