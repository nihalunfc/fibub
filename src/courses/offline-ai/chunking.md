---
title: Cutting documents into chunks
seoTitle: Chunk size and overlap for RAG | Offline AI
summary: Cut long documents into pieces small enough to search and big enough to make sense. Choose chunk size and overlap with a calculator, and write a 10-line chunker in Python.
minutes: 25
updated: 2026-11-22
sources:
  - 'LangChain text splitters, a common reference implementation, https://python.langchain.com/docs/concepts/text_splitters/'
  - 'Pinecone, Chunking Strategies for LLM Applications, https://www.pinecone.io/learn/chunking-strategies/'
quiz:
  - q: Your chunks are 3,000 tokens each. What is the likely problem?
    choices: ['Each chunk covers many topics, so its embedding is blurry and search matches badly', 'They are too small to embed', 'Nothing']
    ans: 0
    why: One vector has to summarise the whole chunk. Mix ten topics into it and it matches none of them well; it also fills the prompt fast.
  - q: Why let neighbouring chunks overlap a little?
    choices: ['So a sentence cut at the edge still appears whole in one chunk', 'To make the index bigger', 'Overlap speeds up search']
    ans: 0
    why: A fact that straddles a cut would be split in half. Overlap repeats the edge so it appears whole in at least one chunk.
  - q: Top-5 chunks of 400 tokens. Roughly how many tokens of sources go into each prompt?
    choices: ['400', '2,000', '20,000']
    ans: 1
    why: 5 × 400 = 2,000 tokens of sources, plus the instructions and the question.
---

**Module 12 · about 25 minutes · read first: 12.2.** You'll be able to choose a chunk size and overlap, and cut any text into chunks with Python.

<div class="bigidea">Cut each document into pieces small enough to be about one thing but big enough to make sense alone, with a little overlap so no fact is sliced in half.</div>

## 1. Why this matters

Chunking is the most underrated setting in RAG. The same model and the same files can give good or poor answers just from how the documents were cut. It is also the setting you can tune for free.

## 2. Too small, too big, just right

- **Too small** (one sentence): each chunk is precise but loses its context. "It must be signed within 30 days" no longer says what *it* is.
- **Too big** (whole chapters): each vector blurs many topics together, search gets vague, and five of them may not fit in your context window.
- **Just right:** usually 200 to 500 words (about 250 to 650 tokens), one idea or a few paragraphs, with 10 to 20% overlap.

Think of cutting a long photo strip into frames for an album index. Tiny frames show sharp details but no scene. Huge frames show the whole party, but the index card can only say "a party".

Better still, cut along the document's own seams: headings, then paragraphs, and only then by length. Keep each chunk's file name and page number beside it: you need them for citations.

<!--fig:chunk-size-->

## 3. A chunker in ten lines

Save this as `chunker.py` in a new folder called `askdocs`. The next lessons build the rest of the project beside it.

```python
def chunk_text(text, size=300, overlap=50):
    """Cut text into pieces of about `size` words; each piece repeats the last `overlap` words of the one before."""
    words = text.split()
    step = size - overlap
    pieces = []
    for start in range(0, max(len(words) - overlap, 1), step):
        piece = " ".join(words[start:start + size])
        if piece:
            pieces.append(piece)
    return pieces
```

It counts words, not tokens, because that needs no tokenizer; 300 English words is roughly 400 tokens. Test it: `print([len(p.split()) for p in chunk_text(" ".join(["w"] * 700))])` gives `[300, 300, 200]`.

<div class="steps" data-fig="chunking-overlap">
<div class="step"><p><b>The document.</b> 700 words. Settings: <code>size=300</code>, <code>overlap=50</code>, so each new chunk starts 300 − 50 = 250 words after the last.</p></div>
<div class="step"><p><b>Chunk 1.</b> Words 1 to 300.</p></div>
<div class="step"><p><b>Chunk 2.</b> Starts at word 251 and runs to 550. Words 251 to 300 are in both chunks: that is the overlap. A sentence cut at word 300 appears whole in chunk 2.</p></div>
<div class="step"><p><b>Chunk 3.</b> Starts at word 501 and runs to the end, word 700, so it holds 200 words. The loop stops: the next start (751) is past the end.</p></div>
<div class="step"><p><b>The count.</b> (700 − 50) ÷ 250 = 2.6, rounded up to <b>3</b> chunks, matching <code>[300, 300, 200]</code>.</p></div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** chunk size trades precision of each match against context carried by each match; overlap guards the seams.

**Equation:** for a document of `$W$` words, chunk size `$s$` and overlap `$o$`,

```math
\text{number of chunks} = \left\lceil \frac{W - o}{s - o} \right\rceil
```

(⌈ ⌉ means round up). Prompt sources ≈ k × s.

**Analogy:** cutting a long photo strip into frames for an album index. Tiny frames show sharp details but no scene; huge frames show the whole scene but the index card for each can only say "a party". Overlap is printing the edge of each frame on the next, so nobody's face is cut in half. Where it breaks: tables and code do not have word-level meaning; cut them by rows or functions instead.

**Try it:** a 10,000-word report, s = 300, o = 50. About how many chunks? ((10,000 − 50) ÷ 250 ≈ 39.8, so 40.)
</details>

<div class="meaning">

<dl>
<dt>W</dt><dd>the number of words in the document</dd>
<dt>s (chunk size)</dt><dd>the most words in one chunk</dd>
<dt>o (overlap)</dt><dd>how many words each chunk repeats from the end of the one before</dd>
<dt>s − o (step)</dt><dd>how far along the text each new chunk starts</dd>
<dt>Physical meaning</dt><dd>Chunking is cutting a long scroll into index cards. Each card should hold one idea so its label is sharp, and the edges overlap a little so no sentence is torn in half. More overlap means more cards and a bigger index, but fewer facts lost at the seams.</dd>
</dl>

</div>

<div class="problem" data-problem="chunking-count"></div>

<div class="myth">

**"Bigger chunks give the model more context, so they are always better."** One vector has to stand for the whole chunk. Mix ten topics into it and it matches none of them well, and five big chunks may not fit in your context window. Test sizes with your own questions (Lesson 12.7); 200 to 500 words is a good start.

</div>

## 4. Worked example

*Made-up numbers.* An HR team tests three settings on 50 known questions (the method is in Lesson 12.7). 100-word chunks: right passage in the top 5 for 33 of 50 questions. 300 words with 50 overlap: 44 of 50. 1,000 words: 36 of 50, and prompts three times longer. They keep 300/50.

## 5. Practice

1. Chunk a document of 1,000 words with size 300 and overlap 0, then with overlap 100. How many chunks each time?
2. Why might legal contracts like a slightly larger chunk size than chat logs?
3. Change `chunk_text` so it first splits on blank lines (paragraphs) and only cuts paragraphs longer than `size`.

<details>
<summary>Answers</summary>

1. Overlap 0: 4 chunks (300, 300, 300, 100). Overlap 100: 5 chunks (step 200).
2. Clauses are long and refer back within the same section; chat messages are short and self-contained.
3. `for para in text.split("\n\n"):` then `pieces += chunk_text(para, size, overlap) if len(para.split()) > size else [para.strip()]`, skipping empty paragraphs. Very short paragraphs can be joined to the next one.
</details>

**New words:** *chunk size* (how long each piece is), *overlap* (words shared between neighbouring chunks), *top-k* (how many chunks the search returns).

<div class="keypoints">

- Chunk size trades a sharp match (small) against enough context to make sense (big); 200 to 500 words is a good start.
- Overlap of 10 to 20% keeps facts that straddle a cut whole in at least one chunk.
- Cut along headings and paragraphs first, and only then by length; tables and code by rows or functions.
- Number of chunks = ⌈(W − o) ÷ (s − o)⌉; prompt sources ≈ k × s.
- Keep each chunk's file name and page beside it for citations.

</div>
