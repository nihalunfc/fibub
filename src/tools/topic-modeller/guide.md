---
name: "Topic modelling (LDA)"
num: 414
shelf: science
section: digital-humanities
title: "Topic modelling with LDA for small text collections, in your browser (seeded, with CSV)"
summary: "Find the topics in a small collection of letters, notes or articles with latent Dirichlet allocation (collapsed Gibbs sampling): top words per topic, the topic mix of every document, and CSV downloads. Seeded, so runs repeat exactly. Nothing is uploaded."
status: live
ads: false
order: 414
icon: book
works: offline
updated: 2026-11-09
related: [stylometry-delta, kmer-counter, correspondence-network, corpus-concordancer, lexical-diversity-readability, qualitative-coding, embedding-visualiser]
sources:
  - "Model: D. Blei, A. Ng and M. Jordan (2003), \"Latent Dirichlet allocation\", Journal of Machine Learning Research 3, 993-1022. Sampler: T. Griffiths and M. Steyvers (2004), \"Finding scientific topics\", PNAS 101 (suppl. 1), 5228-5235."
  - "Checked against a line-by-line Python port of the sampler (same random numbers, identical topic for every word after 30 sweeps) and against scikit-learn's LatentDirichletAllocation on a corpus with 4 planted topics: both recover all 4 and give the same perplexity, 16.5454919306."
  - "The stop-word list was written for fibub. The example notes are made up for this tool."
flow:
  - { icon: file, label: "Documents" }
  - { icon: scissors, label: "Clean words" }
  - { icon: sigma, label: "Sample" }
  - { icon: table, label: "Topics" }
---

## What it does

A topic model reads a collection of documents and finds groups of words that tend to turn up together, such as *harbour, sailors, cargo* or *choir, organ, hymn*. Each group is a **topic**, and every document gets a **mix of topics**. Historians use it to map what a run of letters, sermons, newspapers or minutes talks about, and how that changes.

This tool fits latent Dirichlet allocation (LDA) with **collapsed Gibbs sampling**, the method of Griffiths and Steyvers (2004), in your browser. It is meant for small collections: from a dozen to a couple of thousand short documents. Nothing is uploaded and it works offline.

Compare the authors' styles with [[stylometry-delta|stylometry (Burrows's Delta)]], and see who wrote to whom with the [[correspondence-network|correspondence network]].

## How to use it

1. Paste your documents with a blank line between them, or start each with a line `### name`. **Open text files** adds each file as one document.
2. Choose the number of **Topics**. Try a few values; there is no single right number.
3. Press **Find topics**. The page runs the sweeps in small steps, so it stays usable, and shows its progress.
4. Read the topics, the topic mix of each document and the convergence line, then download the CSVs or the report.

## What the settings do

- **Sweeps**: how many times the sampler revisits every word. 500 is plenty for small sets; more rarely hurts.
- **Seed**: the starting point of the random numbers. The same text, settings and seed always give the same topics, so a result can be repeated and cited. Change it to see whether the topics are stable.
- **Alpha**: how many topics a document may mix. Small (0.1) keeps documents to one or two topics.
- **Beta**: how many words a topic spreads over. Small (0.01) gives sharper topics.
- **Remove common English words**: drops a built-in list of about 230 words such as *the*, *of* and *which*. Add your own (for example names of months, or *chapter*) in the box below it.
- **Shortest word** and **Drop words used fewer than** remove very short and very rare words, which carry little topic information and slow the sampler.

## Worked example

Press **Use the example**. It loads 15 short notes from an imaginary parish archive about farming, shipping and church music. After removing 228 common words and 106 words used only once, 42 distinct words (128 in all) are left. With 3 topics, seed 1, alpha 0.1, beta 0.01 and 500 sweeps, the page finds:

- Topic 1: barley, farmers, hay, harvest, barn, fields, …
- Topic 2: harbour, sailors, captain, quay, cargo, voyage, …
- Topic 3: choir, sang, organist, hymn, church, service, …

The perplexity is 15.69. Most notes are 96 % or more one topic, but Note 12, about the harvest festival in church, is 58 % farming and 41 % church: exactly the kind of mixed document LDA is designed to show.

## Tips and FAQ

**How many documents do I need?** LDA works best with hundreds of documents of at least 50 words. With a handful, topics are unstable. Split long texts into pages or chapters.

**What is perplexity?** How surprised the model is by the words, on average; lower is better. It is shown every 10 sweeps so you can see the sampler settle. Comparing perplexity between different numbers of topics on the same documents favours more topics, so judge the topics by reading them too.

**Why do topic numbers change between seeds?** Topics have no natural order; topic 1 in one run may be topic 3 in another.

**Is my text uploaded?** No. Everything runs on your device.
