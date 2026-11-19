---
title: Vector databases you can run locally
seoTitle: Local vector database for offline RAG | Offline AI
summary: Store your chunks and their embeddings on your own disk. Build the index with plain Python and SQLite, then learn when Chroma, LanceDB, sqlite-vec or DuckDB are worth adding.
minutes: 30
updated: 2026-11-19
sources:
  - 'SQLite (public domain), https://sqlite.org'
  - 'Chroma, open-source vector database (Apache 2.0), https://docs.trychroma.com'
  - 'LanceDB (Apache 2.0), https://lancedb.github.io/lancedb/'
  - 'sqlite-vec, vector search inside SQLite, https://github.com/asg017/sqlite-vec'
  - 'DuckDB vss extension, https://duckdb.org/docs/extensions/vss'
quiz:
  - q: You have 5,000 chunks. Do you need a special vector database?
    choices: ['Yes, always', 'No, comparing against 5,000 vectors with NumPy takes a few milliseconds', 'Only on Windows']
    ans: 1
    why: Brute-force search over a few hundred thousand vectors is fast enough on any laptop. Databases help with millions of vectors, filters and updates.
  - q: What does an approximate index (such as HNSW) trade away?
    choices: ['Privacy', 'A little accuracy, for much faster search on huge collections', 'The ability to save to disk']
    ans: 1
    why: Approximate nearest-neighbour search checks only a smart subset of vectors, so it may very occasionally miss the true best match.
  - q: Why store the file name and page next to each vector?
    choices: ['So answers can cite exactly where each fact came from', 'Vectors need a name to work', 'To make search faster']
    ans: 0
    why: The vector finds the chunk; the stored file and page let you show the source and let the reader check it.
---

**Module 12 · about 30 minutes · read first: 12.3.** You'll be able to build and save a searchable index of a folder of documents, all offline.

## 1. Why this matters

Embedding a thousand pages takes minutes. You do it once, save the result, and every question afterwards only needs a quick lookup. Where you save it is the "vector database". For personal and small-office use, it can be one file.

## 2. What a vector store keeps

One row per chunk: the **text**, where it came from (**file**, **page**), and its **vector**. Searching means: embed the question, compare it with every stored vector, return the closest rows.

## 3. The index builder

In your `askdocs` folder, make a subfolder called `docs` and put some files in it (`.txt` and `.md` for now; Lesson 12.6 adds PDFs, Word, spreadsheets and email). Then save `readers.py` from Lesson 12.6 (or, for now, a two-line version that reads text files) and this as `index_docs.py`:

```python
import pathlib
import sqlite3

import numpy as np
import ollama

from chunker import chunk_text
from readers import read_any

EMBED = "embeddinggemma"
DOCS = pathlib.Path("docs")

db = sqlite3.connect("index.db")
db.execute("DROP TABLE IF EXISTS chunks")
db.execute("CREATE TABLE chunks (file TEXT, page INTEGER, text TEXT, vec BLOB)")

for path in sorted(DOCS.rglob("*")):
    if not path.is_file():
        continue
    for page, text in read_any(path):
        pieces = chunk_text(text)
        if not pieces:
            continue
        vectors = ollama.embed(model=EMBED, input=pieces)["embeddings"]
        for piece, vec in zip(pieces, vectors):
            db.execute("INSERT INTO chunks VALUES (?, ?, ?, ?)",
                       (str(path), page, piece, np.array(vec, dtype=np.float32).tobytes()))
    print("indexed", path)

db.commit()
print(db.execute("SELECT COUNT(*) FROM chunks").fetchone()[0], "chunks saved to index.db")
```

The two-line stand-in for `readers.py`, until Lesson 12.6:

```python
def read_any(path):
    return [(1, path.read_text(encoding="utf-8", errors="ignore"))] if path.suffix in (".txt", ".md") else []
```

Run `pip install numpy` once, then `python index_docs.py`. SQLite is built into Python, and `index.db` is an ordinary file you can back up, copy or delete. The script rebuilds the whole index each run, which is simplest; for big folders, skip files whose modified time has not changed.

## 4. When to use a real vector database

Plain NumPy compares a question with 100,000 vectors in a few milliseconds. Move up when you need more:

| Tool | Good for | Notes |
|---|---|---|
| **sqlite-vec** | Keep everything in one SQLite file | A small add-on; vector search with SQL |
| **Chroma** | Quick start, metadata filters | Pass your own embeddings so it does not fetch its own model; check its telemetry setting is off |
| **LanceDB** | Millions of vectors on disk, fast | File-based, no server |
| **DuckDB + vss** | Analysts who already use DuckDB | HNSW index inside DuckDB |

All of these are open source and run with no server and no internet.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** exact search compares the question with every vector; approximate search (HNSW, IVF) compares with a smart shortlist.

**Equation:** exact search work ≈ N × d multiply-adds. N = 100,000 chunks, d = 768: about 77 million, a few milliseconds on a laptop. Memory = N × d × 4 bytes ≈ 307 MB.

**Analogy:** finding the nearest café. Exact: measure the distance to every café in the country. Approximate: jump to your city, then your neighbourhood, then check the few cafés nearby. Much faster, and almost always the same answer. Where it breaks: it is worth it only when N is in the millions; below that, the shortcut costs more to build than it saves.

**Try it:** 20,000 chunks × 768 numbers × 4 bytes. How many MB? (About 61 MB.)
</details>

## 5. Worked example

*Made-up numbers.* A two-person law office indexes 9,000 pages into 14,000 chunks: 21 minutes on a 16 GB laptop, once. `index.db` is 52 MB. Search takes 6 ms; the chat model's answer takes 10 seconds. They never needed more than SQLite and NumPy.

## 6. Practice

1. Index a folder of 10 text files and check the chunk count printed at the end.
2. Open `index.db` in any SQLite viewer and look at the `file` and `page` columns.
3. Change the script so it skips a file if it is larger than 50 MB.

<details>
<summary>Answers</summary>

1. Roughly words ÷ 250 per file with the default settings.
2. You will see one row per chunk; `vec` shows as binary data.
3. Add `if path.stat().st_size > 50_000_000: continue` after the `is_file` check.
</details>

**New words:** *vector store* / *vector database* (a store of vectors plus their text), *index* (the saved, searchable collection), *HNSW* (a common fast, approximate search structure).
