---
title: Prompts that work well on smaller models
summary: Small local models need clearer prompts than big cloud ones. Seven habits that make 4B to 30B models give reliable answers.
minutes: 20
updated: 2026-11-19
sources:
  - 'Ollama structured outputs (format with a JSON schema), official documentation, https://docs.ollama.com/capabilities/structured-outputs'
quiz:
  - q: Which prompt suits a small model best?
    choices: ['One clear task, the text to work on, and an example of the output', 'Five tasks in one long paragraph', 'A vague request with no text']
    ans: 0
    why: Small models follow one explicit task with an example much better than a tangle of requests.
  - q: Why give the model the facts instead of asking it to remember them?
    choices: ['Small models know less and make up more; working from given text is far more reliable', 'It is faster to type', 'Models cannot read questions']
    ans: 0
    why: Small models hold less knowledge. Give them the source (Module 12 automates this).
  - q: How do you make sure a small model returns valid JSON every time?
    choices: ['Pass a JSON schema as the format, and use a low temperature', 'Ask nicely', 'Use a high temperature']
    ans: 0
    why: Engines can force output to follow a schema (Lesson 11.3).
---

**Module 10 · about 20 minutes · read first: 10.1 and 10.2.** You'll be able to get reliable results from small local models.

## 1. Why this matters

Big cloud models forgive messy prompts. A 4B or 12B model on your laptop does not: it misses buried instructions and fills gaps with guesses. A few habits close much of the gap.

## 2. Seven habits

1. **One task per prompt.** Split "summarise, translate and list actions" into three calls (Module 13 chains them).
2. **Instructions first, then the text,** marked clearly:
   ```
   Summarise the email below in 3 bullet points.
   EMAIL:
   """
   ...
   """
   ```
3. **Show an example** of the output you want (one or two "shots").
4. **Give the facts.** Paste the source; ask the model to answer only from it and to say "not in the text" otherwise.
5. **Force the format** with a JSON schema for anything a program will read (Lesson 11.3).
6. **Use the right settings:** low temperature for exact jobs (Lesson 10.1), thinking only when needed (Lesson 10.4).
7. **Check and retry:** have code check the result (a number is a number, required fields exist) and retry once if not.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** reduce what the model must guess. Every unclear part is a chance to go wrong, and small models go wrong more often.

**Equation:** chance a chain of n steps is all right ≈ p^n. At 95% per step, 3 steps: 0.95³ ≈ 86%; 10 steps: about 60%.

**Analogy:** instructions for a new trainee: one job at a time, a worked example, and the files they need, rather than "sort out the accounts".

**Try it:** a single prompt asks for 5 things, each done right 90% of the time. Chance all 5 are right? (0.9⁵ ≈ 59%. Split into 5 checked calls and you can retry the ones that fail.)
</details>

## 3. Worked example

*Made-up numbers.* Hollybrook Clinic asks Gemma 4 E4B: "Read these notes and tell me everything important and also draft a letter." Results are patchy. They split it: call 1 extracts symptoms, medicines and next steps as JSON with a schema; call 2 drafts the letter from that JSON with an example letter. Both become reliable.

## 4. Practice

1. Take a prompt you use and split it into single tasks.
2. Add one example output to the most important one.
3. Add "If the answer is not in the text, say: not in the text."

<details>
<summary>Answers</summary>

1. Each new prompt should have one verb: summarise, extract, translate, draft.
2. Short examples work best; one or two is enough.
3. This cuts made-up answers sharply when the model works from given text.
</details>

**New words:** *few-shot example*, *delimiter* (marks like """ around the text), *schema*, *chaining*.
