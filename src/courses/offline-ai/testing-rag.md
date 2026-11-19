---
title: 'Testing answers: did it find the right page?'
seoTitle: Test RAG retrieval with a question set | Offline AI
summary: Write 20 test questions with known answers, measure how often search finds the right page, and use the score to choose settings. Then finish mini project 2, Ask my documents.
minutes: 35
updated: 2026-11-19
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

## 1. Why this matters

A RAG system that looks right on three demo questions can fail on the fourth. A small test set turns "seems fine" into a number you can show a manager, and tells you exactly which part to fix.

## 2. Two places it can go wrong

1. **Retrieval:** the right passage was not in the top-k sources. Fix with chunking, hybrid search, a better embedding model or a re-ranker.
2. **Generation:** the right passage was there, but the answer is wrong, incomplete or uncited. Fix with a bigger chat model, a clearer prompt or fewer, better sources.

Always test retrieval first: if the right page never reaches the model, nothing downstream can help.

## 3. Write a test set

Make `tests.csv` with 20 or more real questions and where the answer lives. Leave `page` empty when any page of the file is fine.

```
question,file,page
How many days of leave do new staff get?,handbook.pdf,12
Where do we meet in a fire?,fire-plan.md,
What is the printer budget for March?,budget-march.eml,
```

Mix easy and hard questions: different wording from the document, exact codes, questions whose answer is in a table.

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

It prints every miss, then two scores. **Hit rate at 5**: the share of questions where the right page was anywhere in the top 5. **MRR** (mean reciprocal rank): 1 if the right page is always first, 0.5 if always second, and so on. Change one setting, rebuild the index, run again, keep the change only if the score goes up.

## 5. Check the answers too

For generation, read the answers to your 20 questions and mark each: correct and cited, correct but uncited, wrong, or "could not find" when it should have. Twenty answers take ten minutes to read. Tools such as Ragas can score this automatically using a model as judge, which also runs locally but is less trustworthy than your own reading.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** measure retrieval with a fixed question set so every change is compared on the same ground.

**Equation:** hit rate@k = (questions with the right source in top k) ÷ (all questions). MRR = (1/N) Σ 1/rankᵢ, counting 0 for a miss.

**Analogy:** a sports team's practice drills. You do not judge a new training method by one good match; you run the same drill every week and compare times. Where it breaks: 20 questions is a small sample; a change from 17 to 18 hits may be luck. Bigger changes (17 to 20) or a larger set are more convincing.

**Try it:** three questions, right page at rank 1, rank 2, and missed. MRR? ((1 + 0.5 + 0) ÷ 3 = 0.5.)
</details>

## 6. Worked example

*Made-up numbers.* A teacher builds a question set of 30 from the school's policy folder. Start: 21/30 (70%), MRR 0.52. Adding paragraph-aware chunking: 24/30. Adding hybrid search: 27/30, MRR 0.71. The three misses are all in one scanned PDF that had no OCR; after OCRmyPDF: 30/30. Reading the answers, 28 of 30 are correct and cited; the two wrong ones go away when switching from Gemma 4 E4B to 12B.

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
