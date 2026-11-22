---
title: Data for LLMs and generative AI
summary: 'Embeddings, vector search, retrieval-augmented generation (RAG) as a data pipeline, and the freshness, permission, quality and cost work that AI features need.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: What does an embedding model do?
    choices: ['Compresses files', 'Turns a piece of text or an item into a list of numbers, so similar meanings get nearby numbers', 'Encrypts personal data']
    ans: 1
    why: Embeddings place items in a space where closeness means similar meaning. Vector search then finds the nearest ones to a question.
  - q: In a RAG system, a product price changes. What should the pipeline do?
    choices: ['Rebuild and re-embed the whole index from scratch', 'Re-embed only the chunks from the changed document', 'Nothing: the language model will know']
    ans: 1
    why: Change data capture tells you what changed, so you re-embed only those chunks. That keeps answers fresh and costs low.
  - q: Why combine keyword search with vector search?
    choices: ['Vector search is always wrong', 'Exact codes and names, like "SKU 88231", are matched better by keywords than by meaning', 'Keyword search is cheaper to buy']
    ans: 1
    why: Embeddings capture meaning, not exact strings. Hybrid search uses both, so product codes and rare names still match.
sources:
  - 'Lewis, P. et al. (2020), Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks, Advances in Neural Information Processing Systems 33 https://arxiv.org/abs/2005.11401'
  - 'Malkov, Y. A. and Yashunin, D. A. (2020), Efficient and Robust Approximate Nearest Neighbor Search Using Hierarchical Navigable Small World Graphs, IEEE Transactions on Pattern Analysis and Machine Intelligence 42(4) https://doi.org/10.1109/TPAMI.2018.2889473'
  - 'Google Cloud documentation: BigQuery vector search and embeddings (cloud.google.com/bigquery/docs)'
  - 'Sentence Transformers documentation https://www.sbert.net/'
---

**Module 6 · about 25 minutes · read first: 6.1; helpful: [Embeddings](/learn/courses/ml-foundations/embeddings/).** You'll be able to explain embeddings and vector search in plain words, compute a cosine similarity, describe retrieval-augmented generation as a data pipeline, and list the freshness, permission, quality and cost work it needs.

<div class="bigidea">A language model knows nothing about your business, so an AI assistant works by fetching the right pieces of your own data at question time, and fetching them well is a data pipeline: clean, chunk, embed, index, filter and keep fresh.</div>

## 1. Why this is a data platform topic

Large language models (LLMs) are general. To answer questions about **your** products, policies or data, they need your data at the right moment: cleaned, permission-checked and fresh. Delivering that is pipeline work: ingest, clean, chunk, embed, index, serve, monitor. Job postings that say "data platforms supporting AI/ML" increasingly mean this too.

## 2. Embeddings and vector search

An **embedding model** turns a piece of text (or an image, or a product) into a **vector**: a list of numbers, often a few hundred long. Texts with similar meanings get vectors pointing in similar directions: "waterproof jacket" sits near "rain coat" and far from "jacket potato", even though it shares a word with the potato.

**Vector search** finds the stored vectors closest to a question's vector. Closeness is usually measured by **cosine similarity**: 1 when two vectors point the same way, 0 when they are unrelated. At scale, engines use **approximate nearest-neighbour** indexes (HNSW, ScaNN, IVF) to search millions of vectors in milliseconds by checking only a promising few.

Picture a library arranged by meaning. A normal library shelves books by title, so finding books "like this one" needs a librarian. Now imagine every book standing in a huge room, placed so that books on similar subjects stand close together. To find books like yours, walk to where it would stand and look around. Embeddings give every item its spot in that room; vector search is the walk.

<div class="steps" data-fig="data-for-genai-vectors">
<div class="step"><b>Index the catalogue.</b> Each product description is embedded once. Rain gear clusters together, food clusters elsewhere, summer items somewhere else again.</div>
<div class="step"><b>Embed the question.</b> A shopper asks "something to keep me dry in a storm". The same model turns the question into a vector, which points into the rain-gear cluster.</div>
<div class="step"><b>Find the nearest.</b> Rank items by cosine similarity with the question. Top 3: rain coat, storm poncho, waterproof jacket. Distance from the centre does not matter, only direction.</div>
<div class="step"><b>Filter.</b> The poncho is out of stock at the shopper's store, so a metadata filter removes it and wellington boots move into the top 3. Filters also enforce who may see what.</div>
<div class="step"><b>Generate.</b> The question and the three matching descriptions go into the prompt. The language model writes an answer that cites those products, not ones it imagined.</div>
</div>

<div class="problem" data-problem="data-for-genai-cosine"></div>

Where vectors live: **pgvector** (in PostgreSQL, AlloyDB and Cloud SQL), **BigQuery** vector search, **Vertex AI Vector Search**, **Elasticsearch** and **OpenSearch**, and dedicated stores such as Pinecone, Weaviate, Milvus and Qdrant. Start with the database you already run.

## 3. A RAG pipeline is a data pipeline

**Retrieval-augmented generation (RAG)** means: retrieve relevant pieces of your data, then let the model generate an answer from them. The full flow:

1. **Sources:** product catalogue, policies, reviews, support tickets.
2. **Ingest and clean:** remove duplicates, strip page headers and footers, remove personal data.
3. **Chunk:** split each document into pieces of a few hundred **tokens** (word pieces), with a small overlap so no sentence is cut off from its context.
4. **Embed:** a batch job turns each chunk into a vector.
5. **Index:** store vectors with metadata: source, date, owner, who may read it.
6. **At question time:** embed the question, retrieve the top chunks (with filters), put them in the prompt, answer with citations.
7. **Log and evaluate:** keep questions, retrieved chunks and answers, and score them.

Chunk counts drive the embedding bill and the index size:

<div class="problem" data-problem="data-for-genai-chunks"></div>

The data engineering parts are the hard parts:

- **Freshness:** when a price or policy changes, re-embed only the changed chunks. Change data capture from Lesson 5.3 tells you which.
- **Permissions:** filter retrieved chunks by what this user is allowed to see, before they reach the prompt.
- **Quality:** duplicated, outdated or contradictory documents produce confident wrong answers.
- **Hybrid search:** combine keyword search (BM25, the classic search-engine score from [Elasticsearch](/learn/courses/data-at-scale/elasticsearch/)) with vector search, so product codes and names still match.
- **Evaluation:** a fixed set of test questions with the sources they should find; track retrieval accuracy and answer quality over time.
- **Cost:** embedding millions of chunks and calling large models has a real bill. Cache, batch, and re-embed only what changed.

<div class="meaning">

<dl>
<dt>Embedding</dt><dd>A list of numbers that stands for the meaning of a text or item.</dd>
<dt>Cosine similarity</dt><dd>How closely two embeddings point the same way: 1 = same meaning, 0 = unrelated.</dd>
<dt>Chunk</dt><dd>A piece of a document small enough to embed and to fit in a prompt.</dd>
<dt>RAG</dt><dd>Retrieve your own relevant chunks, then let the model answer from them.</dd>
<dt>Physical meaning</dt><dd>When a supermarket's help assistant correctly says the returns window is 30 days and links the policy page, a pipeline cleaned that policy, cut it into chunks, embedded them overnight, found the right chunk for the question in milliseconds, and checked it was the current version. If the answer is wrong, the cause is usually in that pipeline, not in the model.</dd>
</dl>

</div>

<div class="myth">

**"The language model will just know our latest prices and policies."** It knows only what was in its training data, which is old and general. Your current facts reach it only through what you retrieve and put in the prompt. Stale chunks give stale answers, said confidently.

</div>

## 4. In BigQuery, end to end

BigQuery can create embeddings by calling a Vertex AI model from SQL, store them in a table, build a vector index and search it with `VECTOR_SEARCH`, so a RAG prototype is possible without a separate vector database. Spark and Dataflow do the same steps for very large collections. Check the BigQuery documentation for the current function names and model options. If you would rather run everything on your own laptop with no cloud at all, the [Offline AI](/learn/courses/offline-ai/) course builds a local assistant step by step.

## 5. Tables and AI

AI assistants also query **tables**: "ask a question, get SQL" tools over a warehouse work far better with a **semantic layer** (well-named, documented metrics and dimensions), clear column descriptions and row-level security. Good BI modelling, as in [Pipeline to Dashboard](/learn/courses/etl/metrics-semantic-layer/), is AI readiness.

**Governance is not optional.** May this personal data be sent to a model? Is the model hosted in the right region? Are prompts and answers logged and kept for the right time? Platforms add classification tags, masking, approved model endpoints and audit logs. Mentioning these in an interview marks you as someone who can be trusted with production data.

## 6. Try it (free, about 30 minutes)

```python
# pip install sentence-transformers
from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("all-MiniLM-L6-v2")   # small model, runs on a laptop CPU
products = ["Waterproof hiking jacket with hood", "Lightweight rain coat", "Golf umbrella",
            "Jacket potato with beans", "SPF 50 sun cream", "SKU 88231 cola 2 litre"]   # write 50 of your own
p_vecs = model.encode(products, normalize_embeddings=True)

for q in ["something to keep me dry", "summer holiday essentials", "SKU 88231"]:
    q_vec = model.encode(q, normalize_embeddings=True)
    scores = util.cos_sim(q_vec, p_vecs)[0]
    top = scores.argsort(descending=True)[:3]
    print(q, "->", [(products[i], round(float(scores[i]), 2)) for i in top])
```

**Check:** the rain gear tops the first query; the sun cream tops the second. Then look at the "SKU 88231" query and notice whether the exact code wins clearly or only narrowly: that is why keyword search is still needed.

**New words:** *embedding*, *vector*, *cosine similarity*, *vector search*, *approximate nearest neighbour*, *chunk*, *token*, *RAG*, *hybrid search*, *semantic layer*.

<div class="keypoints">

- Embeddings turn text into vectors where similar meanings point the same way; vector search finds the nearest ones, usually by cosine similarity.
- RAG is a data pipeline: clean, chunk, embed, index with metadata, retrieve with filters, prompt, log and evaluate.
- The hard parts are data parts: freshness (re-embed only what changed), permissions, document quality, hybrid search, evaluation and cost.
- Well-modelled, documented tables and governance (masking, approved models, audit logs) are what make AI on company data safe.

</div>
