---
title: 'Saving tokens 2: trimming and summarising context'
seoTitle: 'Trim and summarise context to save tokens | Offline AI'
summary: Long chats and long documents fill the context window. How to summarise history, send only the parts that matter, and split big documents so nothing important falls out.
minutes: 20
updated: 2026-11-19
quiz:
  - q: A chat has gone on for two hours and the model is slow and forgetful. What is the best fix?
    choices: ['Keep going', 'Ask for a short summary of the decisions so far, then start a new chat with that summary', 'Raise the temperature']
    ans: 1
    why: A summary keeps the important points in a few hundred tokens and frees the window.
  - q: A 200-page manual will not fit. What is the usual approach?
    choices: ['Paste it anyway', 'Split it into chunks and send only the chunks relevant to the question (RAG)', 'Delete half the pages at random']
    ans: 1
    why: Searching for relevant chunks keeps each request small and focused (Module 12).
  - q: Summarising each chapter, then summarising the summaries, is called...
    choices: ['Map-reduce summarising', 'Fine-tuning', 'Quantisation']
    ans: 0
    why: Map (summarise each part), then reduce (combine). It handles documents of any length.
---

**Module 3 · about 20 minutes · read first: 3.3.** You'll be able to keep long work inside the context window without losing what matters.

## 1. Why this matters

The context window is the model's whole world. Fill it with old small talk and there is no room for the document that matters; overflow it and the start falls out. Managing it is the biggest lever on quality, speed and cost in long tasks.

## 2. Long chats: summarise and restart

Every message re-sends the whole conversation. After a long chat:

1. Ask: "Summarise our decisions and open questions in 10 bullet points."
2. Start a new chat and paste the summary.

You keep the substance in a few hundred tokens instead of thousands. Try it in the simulation: fill the window, then tick "Summarise old messages".

<!--fig:context-bucket-->

## 3. Long documents: send only what matters

- **Cut by hand** when you know where the answer is: send the section, not the file.
- **Search, then send (RAG):** split the document into chunks, find the chunks most related to the question, and send only those (Module 12).
- **Map-reduce** when you need the whole thing summarised: summarise each part, then summarise the summaries.

## 4. Clean the input

Remove repeated headers and footers, signatures, long email chains already answered, page numbers and boilerplate. A cleaning step in your script (Lesson 11.2) can cut a third of the tokens from typical office documents.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** every turn re-sends the history, so a chat's total input grows roughly with the square of its length.

**Equation:** total input over n turns of t tokens each ≈ t × n(n + 1) ÷ 2.

**Analogy:** reading a whole notebook from page one every time you add a line. Writing a short summary at the top and starting a new notebook keeps each read short.

**Try it:** 30 turns of 200 tokens? (200 × 30 × 31 ÷ 2 = 93,000 input tokens in total, though the last turn alone is only 6,000.)
</details>

## 5. Worked example

*Made-up numbers.* An engineer summarises a 120-page site report. Pasting it fails: about 80,000 tokens against a 16,000 window. Her script splits it into 12 sections, summarises each in 150 words, then summarises the 12 summaries into one page. Each request stays under 10,000 tokens, and the whole run takes 14 minutes on her laptop.

## 6. Practice

1. In the simulation, fill a 4,000-token window with and without summarising. How many messages are lost?
2. Using the box, how many input tokens do 50 turns of 300 tokens send in total?
3. Which approach for "What does section 7.3 say about refunds?" in a 90-page policy?

<details>
<summary>Answers</summary>

1. With summarising, far fewer are lost; the summary keeps their gist.
2. 300 × 50 × 51 ÷ 2 = 382,500 tokens.
3. Cut by hand (send section 7.3) or search for it (RAG). Map-reduce is for whole-document summaries.
</details>

**New words:** *summarise and restart*, *chunk* (a piece of a document), *RAG* (retrieval-augmented generation: search, then send), *map-reduce* (summarise parts, then combine).
