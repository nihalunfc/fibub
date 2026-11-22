---
title: Vector databases you can run locally
seoTitle: Local vector database for offline RAG | Offline AI
summary: Store your chunks and their embeddings on your own disk. Build the index with plain Python and SQLite, then learn when Chroma, LanceDB, sqlite-vec or DuckDB are worth adding.
minutes: 30
updated: 2026-11-22
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

<div class="bigidea">A vector database is just a saved table of chunks, where they came from, and their numbers, so each question needs a quick lookup instead of re-reading every file.</div>

## 1. Why this matters

Embedding a thousand pages takes minutes. You do it once, save the result, and every question afterwards only needs a quick lookup. Where you save it is the "vector database". For personal and small-office use, it can be one file.

## 2. What a vector store keeps

One row per chunk: the **text**, where it came from (**file**, **page**), and its **vector** (the list of numbers from Lesson 12.2). Searching means: embed the question, compare it with every stored vector, return the closest rows.

It is like a library card catalogue. Making the cards takes an afternoon. After that, finding a book takes seconds, and each card says which shelf it is on.

<div class="steps">
<div class="step"><p><b>Read a file.</b> The builder opens <code>docs/handbook.pdf</code>. The reader gives back pages: page 12 says "Staff get 20 days of paid vacation a year..."</p></div>
<div class="step"><p><b>Cut and embed.</b> Page 12 is cut into 2 chunks of up to 300 words. EmbeddingGemma turns each chunk into 768 numbers.</p></div>
<div class="step"><p><b>Save the rows.</b> Each chunk becomes one row: file <code>docs/handbook.pdf</code>, page 12, the text, and its 768 numbers packed into 768 × 4 = 3,072 bytes.</p></div>
<div class="step"><p><b>Repeat for every file.</b> A folder of 10,000 chunks makes a table of 10,000 rows; the vectors take 10,000 × 3,072 bytes ≈ 31 MB, in one file, <code>index.db</code>.</p></div>
<div class="step"><p><b>Search later.</b> A question is embedded once and compared with all 10,000 vectors: 10,000 × 768 ≈ 7.7 million multiply-adds, about a millisecond on a laptop. The closest rows, with their file and page, come back.</p></div>
</div>

Try it: choose an analogy, then drag one word and watch the answer move.

<figure class="fig" data-fig="@ai-embedding-analogy"><figcaption>Directions in an embedding space carry meaning: the step from man to king is much like the step from woman to queen. Words are points; meaning is geometry, so nearness and arrows can be measured.</figcaption></figure>

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

Try it: drag the star, change k, then switch to Approximate and search only 1 cell.

<figure class="fig" data-fig="@ai-vector-search"><figcaption>A vector database finds the nearest points to the question. Approximate search compares far fewer points but can miss a neighbour across a cell edge; searching more cells trades speed for recall.</figcaption></figure>

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

**Equation:** for `$N$` chunks with `$d$` numbers each,

```math
\text{search work} \approx N \times d \ \text{multiply-adds}, \qquad \text{memory} = N \times d \times 4 \ \text{bytes}
```

N = 100,000 chunks, d = 768: about 77 million multiply-adds, a few milliseconds on a laptop. Memory ≈ 307 MB.

**Analogy:** finding the nearest café. Exact: measure the distance to every café in the country. Approximate: jump to your city, then your neighbourhood, then check the few cafés nearby. Much faster, and almost always the same answer. Where it breaks: it is worth it only when N is in the millions; below that, the shortcut costs more to build than it saves.

**Try it:** 20,000 chunks × 768 numbers × 4 bytes. How many MB? (About 61 MB.)
</details>

<div class="meaning">

<dl>
<dt>N</dt><dd>the number of chunks stored, one row each</dd>
<dt>d</dt><dd>how many numbers are in each vector (768 for EmbeddingGemma)</dd>
<dt>4 bytes</dt><dd>the space one 32-bit number takes on disk and in memory</dd>
<dt>exact vs approximate search</dt><dd>exact compares the question with every row; approximate (HNSW) checks a smart shortlist and very occasionally misses the best match</dd>
<dt>Physical meaning</dt><dd>The index is a card catalogue for your files. Tens of thousands of cards fit in a file smaller than a few photos, and checking every card takes less time than a blink, so most homes and small offices never need anything fancier.</dd>
</dl>

</div>

<div class="problem" data-problem="vector-databases-size"></div>

<div class="myth">

**"RAG needs a special vector database server."** For personal and small-office use, a SQLite file and NumPy are plenty: they compare against 100,000 vectors in milliseconds, with no server and no internet. Add Chroma, LanceDB, sqlite-vec or DuckDB when you reach millions of chunks or need filters and frequent updates.

</div>

Step through the pipeline from a pile of text to a cited answer.

<figure class="fig" data-fig="@ai-rag-pipeline"><figcaption>Retrieval-augmented generation does not teach the model anything new: it finds the few relevant chunks, pastes them into the prompt, and asks the model to answer from them.</figcaption></figure>

Try it: slide the number of features from 2 up to 1000 and watch the histogram squeeze.

<figure class="fig" data-fig="@ai-dim-curse"><figcaption>With many features all points become about equally far apart, so nearest-neighbour ideas lose meaning. The cure is fewer, better features or far more data.</figcaption></figure>

Try it: press New start a few times with random starts, then with k-means++, then Run 30 starts for each.

<figure class="fig" data-fig="@ai-kmeans-init"><figcaption>k-means only finds a nearby good answer, so a bad start can strand two centres in one blob. Spreading the starting centres out (k-means++) and trying several starts both help.</figcaption></figure>

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

<div class="keypoints">

- A vector store keeps one row per chunk: text, file, page and vector.
- Build the index once, save it (one SQLite file is enough), and every question after that is a quick lookup.
- Memory = N × d × 4 bytes: 10,000 chunks of 768 numbers is about 31 MB.
- Exact search over a few hundred thousand vectors takes milliseconds; approximate indexes (HNSW) pay off only at millions.
- Storing file and page next to each vector is what makes citations possible.

</div>
