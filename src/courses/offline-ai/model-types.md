---
title: Base, instruct, reasoning and multimodal models
summary: The same family often comes in several versions. What base, instruct (chat), reasoning (thinking) and multimodal models are, and which one to download.
minutes: 20
updated: 2026-11-19
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

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the same pre-trained weights are specialised by different post-training.

**Equation:** instruct model = base model + training on (instruction, good answer) pairs + feedback.

**Analogy:** a medical graduate (base) becomes a GP, a surgeon or a researcher depending on the residency (post-training). Same education underneath, different job.

**Try it:** you need to read text from photographed receipts and return JSON. Which two properties do you need? (Instruct and multimodal.)
</details>

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
