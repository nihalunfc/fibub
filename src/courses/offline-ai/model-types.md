---
title: Base, instruct, reasoning and multimodal models
summary: The same family often comes in several versions. What base, instruct (chat), reasoning (thinking) and multimodal models are, and which one to download.
minutes: 20
updated: 2026-11-22
sources:
  - 'Ouyang, L. et al. (2022), Training language models to follow instructions with human feedback (how base models become instruct models) https://arxiv.org/abs/2203.02155'
  - 'Wei, J. et al. (2022), Chain-of-Thought Prompting Elicits Reasoning in Large Language Models https://arxiv.org/abs/2201.11903'
  - 'Hugging Face Hub documentation, model cards https://huggingface.co/docs/hub/model-cards'
quiz:
  - q: You want a model to chat and follow instructions. Which version do you download?
    choices: ['Base', 'Instruct (also called chat or it)', 'Embedding']
    ans: 1
    why: Instruct models are trained to follow instructions and hold a conversation. Base models only continue text.
  - q: What is a reasoning model good at?
    choices: ['Hard maths, logic and multi-step problems, by writing out its thinking first', 'Being fast on simple questions', 'Making images']
    ans: 0
    why: Thinking first helps with hard problems, at the cost of time and tokens (Lesson 3.4).
  - q: What does multimodal mean?
    choices: ['It speaks many languages', 'It can take images (and sometimes audio) as input, not only text', 'It runs on many devices']
    ans: 1
    why: Multimodal models read other kinds of input, for example a photo of a receipt.
---

**Module 2 · about 20 minutes · read first: 2.3.** You'll be able to pick the right version of a model from a list of downloads.

<div class="bigidea">One family of models comes in versions trained for different jobs, and a few letters in the file name tell you which one you are getting.</div>

## 1. Why this matters

Search for a model and you will see names ending in -base, -it, -instruct, -thinking, -vision. Download the wrong one and it will ramble, ignore instructions or refuse your image.

## 2. The versions

| Version | Names often include | What it does | Use it for |
|---|---|---|---|
| **Base** (pre-trained) | base, pt | Continues text; does not follow instructions well | Fine-tuning (Module 14), research |
| **Instruct / chat** | it, instruct, chat | Follows instructions, holds a conversation | Almost everything |
| **Reasoning / thinking** | thinking, reasoning, or a switch | Writes its working before answering | Maths, logic, planning, tricky code |
| **Multimodal** | vision, vl, omni | Takes images, sometimes audio | Photos, scans, screenshots, voice |
| **Embedding** | embed | Turns text into numbers for search | Document search (Module 12) |

Many recent models combine these: Gemma 4 instruct models take images, and several families let you switch thinking on or off per request (Lesson 10.4).

Here is how to read a typical download name, piece by piece. The pattern is common on Hugging Face, though every publisher varies it a little.

<div class="steps">
<div class="step"><p>The file is called <code>gemma-4-12b-it-Q4_K_M.gguf</code>. Read it left to right.</p></div>
<div class="step"><p><b>gemma-4</b> is the family and generation: who made it and which release.</p></div>
<div class="step"><p><b>12b</b> is the size: 12 billion parameters (Lesson 2.2).</p></div>
<div class="step"><p><b>it</b> means instruction-tuned: the chat version, the one most people want. If it said <b>pt</b> (pre-trained) it would be the base model.</p></div>
<div class="step"><p><b>Q4_K_M</b> is how tightly the numbers are squeezed, about 4 to 5 bits each (Module 8), and <b>.gguf</b> is the file format (Lesson 7.5). So: a chat model, about 7 GB, ready for llama.cpp, Ollama or LM Studio.</p></div>
</div>

<div class="meaning">

<dl>
<dt>base (pt)</dt><dd>the model straight after its main training: it continues text but does not follow instructions well</dd>
<dt>instruct (it, chat)</dt><dd>the base model after extra training on instructions and good answers, plus feedback</dd>
<dt>thinking</dt><dd>trained to write out its working before the answer; slower, better at hard problems</dd>
<dt>vision, vl, omni</dt><dd>can read images (and sometimes audio) as well as text</dd>
<dt>Physical meaning</dt><dd>It is one education with different job training on top. Pick by the job: instruct for nearly everything, thinking for hard multi-step problems, vision for photos and scans, base only if you plan to train it further yourself.</dd>
</dl>

</div>

<div class="myth">

**"The base model is the pure, smarter version, and instruct is a watered-down copy."** They know about the same; the instruct version has extra training that teaches it to understand a request and answer it. Ask a base model to summarise an email and it may just write more emails, because "continue the text" is all it was trained to do.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the same pre-trained weights are specialised by different post-training.

**Equation:** instruct model = base model + training on (instruction, good answer) pairs + feedback.

**Analogy:** a medical graduate (base) becomes a GP, a surgeon or a researcher depending on the residency (post-training). Same education underneath, different job.

**Try it:** you need to read text from photographed receipts and return JSON. Which two properties do you need? (Instruct and multimodal.)
</details>

Thinking has a price in time. A reasoning model writes its working as tokens before the answer, at the same speed as the answer itself.

<div class="problem" data-problem="model-types-thinking-time"></div>

Try it: tap the word "it" in the Meaning link head, then switch the mask between causal and full.

<figure class="fig" data-fig="@ai-attention-heads"><figcaption>Each head learns its own pattern of who looks at whom, and a weight row always adds to 100%. In a text generator the causal mask hides later words, because they have not been written yet.</figcaption></figure>

Try it: press Generate from noise, then raise Guess error and generate again.

<figure class="fig" data-fig="@ai-diffusion-denoise"><figcaption>An image model starts from pure noise and repeatedly guesses and removes noise. Better guesses and more steps give a cleaner picture; poor guesses leave artefacts.</figcaption></figure>

Try it: pick a filter, then step the stage from Convolve to ReLU to Max-pool while the window slides.

<figure class="fig" data-fig="@ai-conv-pool"><figcaption>A filter lights up where its pattern appears. ReLU keeps only the matches, and max-pooling shrinks the map while keeping the strongest responses, so a small shift of the picture barely changes the result.</figcaption></figure>

Try it: move the two inputs, tap a line or neuron and change its weight or bias with the slider, and switch the activation.

<figure class="fig" data-fig="@ai-forward-pass"><figcaption>Every neuron does the same small job: add up weight times input over its lines, add its bias, apply the activation. A network is just many of these. Learning means moving the weights and biases until the output is right.</figcaption></figure>

## 3. Worked example

*Made-up numbers.* Arjun downloads a "-pt" file and asks it to summarise an email. It writes three more emails instead. He switches to the "-it" version of the same model and gets a summary first time.

## 4. Practice

1. In the Ollama library or on Hugging Face, find a model with both base and instruct versions.
2. Which version for a chatbot that answers questions about your documents?
3. When would you turn thinking off?

<details>
<summary>Answers</summary>

1. Most families publish both; Ollama's default tags are usually instruct.
2. Instruct, plus an embedding model for the search part.
3. For quick, simple tasks where speed matters more: summaries, rewrites, short answers.
</details>

**New words:** *base model*, *instruct model*, *reasoning model*, *multimodal*, *embedding model*.

<div class="keypoints">

- Base (pt) models continue text; instruct (it, chat) models follow instructions and hold a conversation.
- Reasoning (thinking) models write out their working first: better on hard problems, slower and more tokens.
- Multimodal (vision, vl, omni) models take images and sometimes audio; embedding models turn text into numbers for search.
- Read the file name: family, size, version tag (it or pt), squeeze level (Q4_K_M) and format (.gguf).
- For almost every job, download the instruct version.

</div>
