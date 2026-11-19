---
title: Finding, re-ranking and citing sources
seoTitle: Retrieval, re-ranking and citations in RAG | Offline AI
summary: Ask questions of your own documents and get answers with numbered sources. Add keyword search for names and codes, and an optional re-ranker for sharper results, all offline.
minutes: 35
updated: 2026-11-19
sources:
  - 'Cormack, Clarke and Büttcher (2009), Reciprocal rank fusion outperforms Condorcet and individual rank learning methods, https://dl.acm.org/doi/10.1145/1571941.1572114'
  - 'SQLite FTS5 full-text search, https://sqlite.org/fts5.html'
  - 'Sentence Transformers CrossEncoder (re-rankers), https://sbert.net/docs/cross_encoder/usage/usage.html'
quiz:
  - q: Someone asks about invoice "INV-20931". Why can pure embedding search miss it?
    choices: ['Embeddings capture meaning, not exact codes, so a chunk with that exact code may not rank high', 'Numbers cannot be embedded', 'Ollama blocks codes']
    ans: 0
    why: Exact names, codes and numbers are where keyword search shines. Combining both (hybrid search) catches them.
  - q: What does a re-ranker do?
    choices: ['Reads the question and each candidate chunk together and scores how well the chunk answers it', 'Re-embeds all files', 'Sorts files by date']
    ans: 0
    why: A re-ranker (cross-encoder) looks at question and chunk side by side, which is more accurate than comparing two separate vectors, but slower, so it only re-scores the top 20 or so.
  - q: Why tell the model to say "I could not find that" when the sources lack the answer?
    choices: ['To reduce made-up answers from its general training', 'To save tokens', 'Because Ollama requires it']
    ans: 0
    why: Without that instruction, the model may fill gaps from memory and present guesses as if they came from your documents.
---

**Module 12 · about 35 minutes · read first: 12.4.** You'll be able to ask questions of your indexed documents and get answers with numbered, checkable sources.

## 1. Why this matters

An answer you cannot check is a liability at work. Citations turn the model into a fast research assistant: it points at the page, and you (or your manager) can verify in ten seconds.

## 2. Ask your documents

Save as `ask.py` in `askdocs`, next to `index.db`:

```python
import sqlite3
import sys

import numpy as np
import ollama

EMBED, CHAT, TOP_K = "embeddinggemma", "gemma4:e4b", 5

db = sqlite3.connect("index.db")
rows = db.execute("SELECT file, page, text, vec FROM chunks").fetchall()
matrix = np.array([np.frombuffer(r[3], dtype=np.float32) for r in rows])
matrix /= np.linalg.norm(matrix, axis=1, keepdims=True)  # make every arrow length 1


def search(question, k=TOP_K):
    q = np.array(ollama.embed(model=EMBED, input=question)["embeddings"][0], dtype=np.float32)
    scores = matrix @ (q / np.linalg.norm(q))  # cosine similarity with every chunk at once
    best = np.argsort(-scores)[:k]
    return [(rows[i][0], rows[i][1], rows[i][2], float(scores[i])) for i in best]


def answer(question):
    hits = search(question)
    sources = "\n\n".join(f"[{n}] ({file}, page {page})\n{text}"
                          for n, (file, page, text, _) in enumerate(hits, 1))
    prompt = ("Answer the question using only the sources below. After each fact, put the source "
              "number in brackets, like [2]. If the sources do not contain the answer, say "
              "'I could not find that in your documents.'\n\n"
              f"Sources:\n{sources}\n\nQuestion: {question}")
    reply = ollama.chat(model=CHAT, messages=[{"role": "user", "content": prompt}],
                        options={"temperature": 0})
    return reply["message"]["content"], hits


if __name__ == "__main__":
    text, hits = answer(" ".join(sys.argv[1:]))
    print(text, "\n")
    for n, (file, page, _, score) in enumerate(hits, 1):
        print(f"[{n}] {file}, page {page} (score {score:.2f})")
```

Run `python ask.py How many days of leave do new staff get?`. The answer comes first, then the list of sources with their similarity scores. Temperature 0 keeps answers steady (Lesson 10.1).

## 3. Add keyword search (hybrid)

Embeddings are weak on exact codes, names and numbers. SQLite has a built-in keyword search (FTS5). Save as `hybrid.py` and call `hybrid_search` instead of `search` when your questions often contain codes. It returns `(file, page, text)` without a score, so in `answer` unpack three values instead of four:

```python
import re

from ask import db, rows, search

# Build a keyword index once (SQLite's FTS5 comes with Python on most systems).
db.execute("CREATE VIRTUAL TABLE IF NOT EXISTS words USING fts5(text)")
if db.execute("SELECT COUNT(*) FROM words").fetchone()[0] == 0:
    db.executemany("INSERT INTO words (rowid, text) VALUES (?, ?)",
                   [(i, r[2]) for i, r in enumerate(rows)])
    db.commit()


def keyword_search(question, k=20):
    terms = " OR ".join(f'"{w}"' for w in re.findall(r"\w+", question))
    found = db.execute("SELECT rowid FROM words WHERE words MATCH ? ORDER BY rank LIMIT ?",
                       (terms, k)).fetchall()
    return [rows[i][:3] for (i,) in found]


def hybrid_search(question, k=5):
    """Reciprocal rank fusion: a chunk scores 1/(60 + rank) in each list it appears in."""
    score = {}
    for ranked in (search(question, k=20), keyword_search(question)):
        for rank, hit in enumerate(ranked, 1):
            key = hit[:3]
            score[key] = score.get(key, 0) + 1 / (60 + rank)
    return sorted(score, key=score.get, reverse=True)[:k]
```

If you rebuild the index, delete the `words` table too (`DROP TABLE IF EXISTS words` in `index_docs.py`) so it is rebuilt to match.

## 4. Optional: a re-ranker

A **re-ranker** reads the question and one chunk together and scores the pair. It is more accurate than vector search but too slow to run on everything, so take the top 20 and re-score them:

```python
from sentence_transformers import CrossEncoder   # pip install sentence-transformers

reranker = CrossEncoder("BAAI/bge-reranker-base")  # downloads once (about 1 GB), then works offline
candidates = search(question, k=20)
scores = reranker.predict([(question, text) for _, _, text, _ in candidates])
best = [c for _, c in sorted(zip(scores, candidates), key=lambda p: -p[0])][:5]
```

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** two weak, different rankings fused together beat either alone; rank fusion needs no tuning because it uses positions, not raw scores.

**Equation:** RRF score(chunk) = Σ over lists of 1 ÷ (60 + rank in that list).

**Analogy:** two judges at a cooking contest, one tasting (meaning), one checking the recipe was followed (exact words). A dish both rank in the top three wins over one only a single judge loved. The 60 stops a single first place from dominating. Where it breaks: if one list is junk, fusion drags good results down; check each list on its own first (Lesson 12.7).

**Try it:** chunk A is 1st in vectors and 3rd in keywords; chunk B is 2nd in vectors and absent from keywords. Scores? (A: 1/61 + 1/63 ≈ 0.0323; B: 1/62 ≈ 0.0161. A wins.)
</details>

## 5. Worked example

*Made-up numbers.* A clinic manager asks "What is the cancellation fee in the 2026 price list?". Vector search alone puts the price list 4th, behind three chunks about cancelling appointments in general. Hybrid search lifts it to 1st because "2026" and "fee" match exactly. The answer: "CA$40 if cancelled less than 24 hours ahead [1]", with "[1] policies/price-list-2026.pdf, page 2" underneath.

## 6. Practice

1. Ask a question your documents cannot answer. Does the model admit it?
2. Ask about an exact code or name with `search`, then with `hybrid_search`. Compare the order.
3. Make `ask.py` print only sources whose score is above 0.3.

<details>
<summary>Answers</summary>

1. It should say "I could not find that in your documents". If it invents an answer, try a larger model (Gemma 4 12B) or make the instruction the first line of the prompt.
2. The chunk with the exact code usually moves up.
3. `hits = [h for h in search(question) if h[3] > 0.3]`. The right threshold depends on the embedding model; check it with your test questions.
</details>

**New words:** *hybrid search* (meaning search plus keyword search), *reciprocal rank fusion* (combining rankings by position), *re-ranker* or *cross-encoder* (a model that scores a question and a passage together), *citation* (a pointer to the source of a fact).
