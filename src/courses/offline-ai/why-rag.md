---
title: Why the model cannot read your files by itself
seoTitle: Why AI cannot read your files (RAG explained) | Offline AI
summary: A model only knows what it learned in training and what is in its context window. Learn why that leaves your own files out, and how retrieval (RAG) fixes it without uploading anything.
minutes: 20
updated: 2026-11-19
sources:
  - 'Lewis et al. (2020), Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks, https://arxiv.org/abs/2005.11401'
  - 'Liu et al. (2023), Lost in the Middle: How Language Models Use Long Contexts, https://arxiv.org/abs/2307.03172'
quiz:
  - q: Your laptop model has never seen your company handbook. Where can it get the handbook facts from?
    choices: ['From its training, if you ask nicely', 'Only from text you put into its context window', 'From the internet, automatically']
    ans: 1
    why: A model knows only its training data plus whatever text is in the current conversation. Your handbook must be put into the context.
  - q: Why not paste all 2,000 pages into every question?
    choices: ['It will not fit in the context window, and even if it did, reading it every time would be slow', 'Models refuse long text', 'Pasting is illegal']
    ans: 0
    why: 2,000 pages is about a million tokens. That is far beyond a laptop context window, and prefill time grows with every token.
  - q: In RAG, what does the R (retrieval) step do?
    choices: ['Retrains the model on your files', 'Finds the few passages most likely to answer this question', 'Downloads a bigger model']
    ans: 1
    why: Retrieval searches your files for the handful of passages that match the question and puts only those into the prompt.
---

**Module 12 · about 20 minutes · read first: 3.3 and 11.2.** You'll be able to explain why a model cannot see your files, and what each step of a private document search pipeline does.

## 1. Why this matters

The most common reason people want local AI is private documents: contracts, patient letters, research notes, policies. "Ask my documents" is also the most asked-for feature at work. This module builds it, fully offline, in about 150 lines of Python.

## 2. What a model actually knows

A model knows two things:

1. **What it learned in training.** Frozen on the day training ended (its *knowledge cut-off*). Your files were not in it.
2. **What is in its context window right now** (Lesson 3.3): the system prompt, the chat so far, and anything you paste.

That is all. It cannot open a folder, and it does not remember last week's chat unless the app pastes it back in. So "make the model know my files" really means "get the right text into the context window at the right moment".

## 3. Why not paste everything?

A 300-page policy manual is about 150,000 tokens. On a laptop with an 8,192-token context, it does not fit. Even on a big machine with a 128K window, every question would make the model read the whole manual again (prefill, Lesson 3.5), which can take minutes, and the KV cache (Lesson 8.4) would eat gigabytes. Models also pay less attention to facts buried in the middle of a very long context ("lost in the middle").

## 4. The fix: look it up first (RAG)

**Retrieval-augmented generation** (RAG) works like a good librarian:

1. **Once, ahead of time:** read every file, cut it into short pieces (*chunks*, Lesson 12.3), turn each chunk into a list of numbers that captures its meaning (an *embedding*, Lesson 12.2), and store them (Lesson 12.4).
2. **Each question:** turn the question into numbers the same way, find the 5 or so chunks whose numbers are closest, and paste only those into the prompt with an instruction: "answer from these sources and cite them" (Lesson 12.5).

The model now answers from your text, with page numbers, and the prompt stays small. Every step runs on your machine: the embedding model and the chat model both run in Ollama, and the index is a file on your disk.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** retrieval shrinks the text the model must read from the whole library to the few pieces that matter for this question.

**Equation:** prompt tokens ≈ instructions + k × chunk size + question. With k = 5 chunks of 400 tokens: about 2,000 + 150 tokens, whatever the size of the library.

**Analogy:** an open-book exam. You do not reread the whole book for each question; you use the index to find two pages, then read those carefully. The index costs effort once; every lookup after that is cheap. Where it breaks: if the index points to the wrong pages, the best reader in the world still answers wrongly. Retrieval quality limits answer quality.

**Try it:** a library of 4,000 chunks; you send the top 5. What fraction of the library does the model read per question? (5 ÷ 4,000 = 0.125%.)
</details>

## 5. Worked example

*Made-up numbers.* A small accounting office has 1,200 PDF pages of client letters and tax notes. Pasting it all: about 600,000 tokens, impossible on their 16 GB laptop. With RAG: about 2,400 chunks indexed once (12 minutes overnight on the laptop), then each question sends about 2,300 tokens and gets an answer in 8 to 15 seconds, with "[2] client-letters/2025-03.pdf, page 4" under it. No page ever leaves the office.

## 6. Practice

1. Estimate how many tokens your own largest document has (pages × about 500).
2. Would it fit in your model's context setting from Lesson 10.3?
3. Think of three questions you would ask your own files. Write them down: you will test with them in Lesson 12.7.

<details>
<summary>Answers</summary>

1. A 40-page report is about 20,000 tokens.
2. Not in 8,192; just in 32,768 if your memory allows it (check with the KV cache calculator in 8.4). RAG avoids the problem.
3. Keep them specific ("What notice period does the Smith lease need?"); vague questions are hard for any search.
</details>

**New words:** *RAG* or *retrieval-augmented generation* (look up passages, then answer from them), *chunk* (a short piece of a document), *knowledge cut-off* (the date a model's training data ends).
