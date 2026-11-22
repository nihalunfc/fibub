---
title: 'Testing answers: did it find the right page?'
seoTitle: Test RAG retrieval with a question set | Offline AI
summary: Write 20 test questions with known answers, measure how often search finds the right page, and use the score to choose settings. Then finish mini project 2, Ask my documents.
minutes: 35
updated: 2026-11-22
sources:
  - 'Manning, Raghavan and Schütze, Introduction to Information Retrieval, chapter 8 (evaluation), https://nlp.stanford.edu/IR-book/'
  - 'Ragas, open-source RAG evaluation (Apache 2.0), https://docs.ragas.io'
quiz:
  - q: Search found the right page for 17 of 20 test questions in the top 5. What is the hit rate at 5?
    choices: ['17%', '85%', '5%']
    ans: 1
    why: 17 ÷ 20 = 0.85, so 85%.
  - q: The answer is wrong but the right page was in the sources. Where is the problem?
    choices: ['Retrieval', 'Generation: the chat model misread or ignored the source', 'The index file']
    ans: 1
    why: Retrieval did its job. Try a bigger chat model, fewer but better chunks, or a clearer instruction.
  - q: Why write the test questions before tuning settings?
    choices: ['So you can measure each change instead of guessing', 'Tests are required by Ollama', 'To make the index smaller']
    ans: 0
    why: Without a fixed test set, every change "feels" better. A score tells you whether it really is.
---

**Module 12 · about 35 minutes · read first: 12.5.** You'll be able to measure retrieval quality with a test set and decide which setting to change. This lesson completes **mini project 2: Ask my documents**.

<div class="bigidea">A fixed set of questions with known answers turns "it seems fine" into a score, so you can tell whether each change really helps and which part to fix.</div>

## 1. Why this matters

A RAG system that looks right on three demo questions can fail on the fourth. A small test set turns "seems fine" into a number you can show a manager, and tells you exactly which part to fix.

## 2. Two places it can go wrong

1. **Retrieval:** the right passage was not in the top-k sources. Fix with chunking, hybrid search, a better embedding model or a re-ranker.
2. **Generation:** the right passage was there, but the answer is wrong, incomplete or uncited. Fix with a bigger chat model, a clearer prompt or fewer, better sources.

Always test retrieval first: if the right page never reaches the model, nothing downstream can help.

It is like a delivery service. First check the parcel reached the right house (retrieval). Only then ask whether the person who opened it understood it (generation).

Try it: drag the star, change k, then switch to Approximate and search only 1 cell.

<figure class="fig" data-fig="@ai-vector-search"><figcaption>A vector database finds the nearest points to the question. Approximate search compares far fewer points but can miss a neighbour across a cell edge; searching more cells trades speed for recall.</figcaption></figure>

## 3. Write a test set

Make `tests.csv` with 20 or more real questions and where the answer lives. Leave `page` empty when any page of the file is fine.

```
question,file,page
How many days of leave do new staff get?,handbook.pdf,12
Where do we meet in a fire?,fire-plan.md,
What is the printer budget for March?,budget-march.eml,
```

Mix easy and hard questions: different wording from the document, exact codes, questions whose answer is in a table.

Step through the pipeline from a pile of text to a cited answer.

<figure class="fig" data-fig="@ai-rag-pipeline"><figcaption>Retrieval-augmented generation does not teach the model anything new: it finds the few relevant chunks, pastes them into the prompt, and asks the model to answer from them.</figcaption></figure>

## 4. Score retrieval

Save as `test_retrieval.py`:

```python
import csv

from ask import search

total = found = 0
rr = 0.0
with open("tests.csv", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        total += 1
        for rank, (file, page, _, _) in enumerate(search(row["question"], k=5), 1):
            if row["file"] in file and (not row["page"] or int(row["page"]) == page):
                found += 1
                rr += 1 / rank
                break
        else:
            print("MISSED:", row["question"])

print(f"Found in top 5: {found}/{total} ({found / total:.0%})   MRR: {rr / total:.2f}")
```

<div class="steps">
<div class="step"><p><b>Five test questions.</b> For each, the script searches and notes where the right page appears in the top 5: question 1 at rank 1, question 2 at rank 3, question 3 not at all, question 4 at rank 2, question 5 at rank 1.</p></div>
<div class="step"><p><b>Hit rate at 5.</b> The right page was somewhere in the top 5 for 4 of the 5 questions: 4 ÷ 5 = <b>80%</b>.</p></div>
<div class="step"><p><b>Reciprocal ranks.</b> Each rank becomes 1 ÷ rank: 1, 1/3, 0 (a miss), 1/2, 1. First place is worth a whole point; third place only a third.</p></div>
<div class="step"><p><b>MRR.</b> Add them and divide by 5: (1 + 0.333 + 0 + 0.5 + 1) ÷ 5 ≈ <b>0.57</b>. Closer to 1 means the right page tends to come first.</p></div>
<div class="step"><p><b>Change one thing.</b> Turn on hybrid search, rebuild, run the same five questions. If question 3 is now found at rank 2, hit rate becomes 100% and MRR ≈ 0.67: keep the change.</p></div>
</div>

It prints every miss, then two scores. **Hit rate at 5**: the share of questions where the right page was anywhere in the top 5. **MRR** (mean reciprocal rank): 1 if the right page is always first, 0.5 if always second, and so on. Change one setting, rebuild the index, run again, keep the change only if the score goes up.

Try it: set a 3-point gap, then slide the number of questions from 20 to 5000 and press Run 100 tests.

<figure class="fig" data-fig="@ai-bench-noise"><figcaption>A benchmark score is a measurement with error. With few questions a small lead is often just luck; with thousands the better model reliably ranks first. Always ask how many questions.</figcaption></figure>

## 5. Check the answers too

For generation, read the answers to your 20 questions and mark each: correct and cited, correct but uncited, wrong, or "could not find" when it should have. Twenty answers take ten minutes to read. Tools such as Ragas can score this automatically using a model as judge, which also runs locally but is less trustworthy than your own reading.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** measure retrieval with a fixed question set so every change is compared on the same ground.

**Equation:**

```math
\text{hit rate@}k = \frac{\text{questions with the right source in the top } k}{\text{all questions}}, \qquad \text{MRR} = \frac{1}{N} \sum_{i=1}^{N} \frac{1}{\text{rank}_i}
```

counting 0 for a miss.

**Analogy:** a sports team's practice drills. You do not judge a new training method by one good match; you run the same drill every week and compare times. Where it breaks: 20 questions is a small sample; a change from 17 to 18 hits may be luck. Bigger changes (17 to 20) or a larger set are more convincing.

**Try it:** three questions, right page at rank 1, rank 2, and missed. MRR? ((1 + 0.5 + 0) ÷ 3 = 0.5.)
</details>

<div class="meaning">

<dl>
<dt>N</dt><dd>the number of test questions</dd>
<dt>k</dt><dd>how many search results you look at (5 here, the same number you send to the model)</dd>
<dt>rank<sub>i</sub></dt><dd>where the right page appeared for question i: 1 for first place</dd>
<dt>hit rate@k</dt><dd>the share of questions where the right page made the top k at all</dd>
<dt>MRR</dt><dd>the average of 1 ÷ rank: 1 if the right page always comes first, 0.5 if always second</dd>
<dt>Physical meaning</dt><dd>The test set is your weekly practice drill. Hit rate says how often the right page reached the model at all; MRR says how near the top it was. Run the same drill after every change and keep only the changes that raise the score.</dd>
</dl>

</div>

<div class="problem" data-problem="testing-rag-mrr"></div>

<div class="myth">

**"It answered my three demo questions well, so it works."** Three hand-picked questions prove little; the fourth may fail. Twenty or more real questions, including different wording, exact codes and table answers, give a score you can trust, and a change from 17 to 18 hits may still be luck.

</div>

Try it: slide the style from honest to over-confident and watch the bars drop below the diagonal.

<figure class="fig" data-fig="@ai-calibration"><figcaption>A calibrated model's confidence can be trusted. An over-confident model sounds sure when it should not, which is how confident wrong answers, called hallucinations, appear.</figcaption></figure>

## 6. Worked example

*Made-up numbers.* A teacher builds a question set of 30 from the school's policy folder. Start: 21/30 (70%), MRR 0.52. Adding paragraph-aware chunking: 24/30. Adding hybrid search: 27/30, MRR 0.71. The three misses are all in one scanned PDF that had no OCR; after OCRmyPDF: 30/30. Reading the answers, 28 of 30 are correct and cited; the two wrong ones go away when switching from Gemma 4 E4B to 12B.

Try it: slide the share of positives down to 1% while watching the two curves and the counts.

<figure class="fig" data-fig="@ai-pr-curve"><figcaption>The ROC curve does not move when positives become rare, but the precision-recall curve collapses: a small false-positive rate applied to a huge pile of negatives swamps the few true positives. For rare events, read precision.</figcaption></figure>

## 7. Mini project 2: Ask my documents

Your `askdocs` folder now holds `chunker.py`, `readers.py`, `index_docs.py`, `ask.py`, `hybrid.py` and `test_retrieval.py`. To finish:

1. Put 20 to 100 of your own files (or public documents such as your city's bylaws) in `docs`.
2. Build the index, then write 20 test questions in `tests.csv`.
3. Record the starting score, try one change at a time (chunk size, overlap, hybrid, embedding model), and keep a small table of scores.
4. Pull the network cable or turn off Wi-Fi, and ask five questions. Everything should still work.

## 8. Practice

1. Run `test_retrieval.py` with `k=1` and with `k=10`. How do the scores change, and why?
2. A question is missed every time. Name three things to check.
3. Your hit rate at 5 is 95% but answers are often wrong. What do you change first?

<details>
<summary>Answers</summary>

1. k=1 is stricter, so the score drops; k=10 is looser, so it rises, but the prompt gets twice as long.
2. Whether the file was read at all (print `read_any`), whether the wording is very different from the document (try hybrid search), and whether the answer is split across two chunks (try more overlap).
3. Generation: a bigger chat model, or fewer sources (k=3) so the right one is not lost in the middle.
</details>

**New words:** *test set* or *evaluation set* (fixed questions with known answers), *hit rate at k* / *recall at k*, *MRR* or *mean reciprocal rank*.

<div class="keypoints">

- RAG can fail in two places: retrieval (the right page was not found) or generation (it was found but misused). Test retrieval first.
- Write 20 or more real questions with the file and page of each answer before tuning anything.
- Hit rate@k is the share of questions with the right page in the top k; MRR averages 1 ÷ rank.
- Change one setting at a time, rebuild, re-run, and keep the change only if the score goes up.
- Read the answers too: correct and cited, correct but uncited, wrong, or a wrong "could not find".

</div>
