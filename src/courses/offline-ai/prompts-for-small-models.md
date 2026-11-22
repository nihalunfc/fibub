---
title: Prompts that work well on smaller models
summary: Small local models need clearer prompts than big cloud ones. Seven habits that make 4B to 30B models give reliable answers.
minutes: 20
updated: 2026-11-22
sources:
  - 'Ollama structured outputs (format with a JSON schema), official documentation, https://docs.ollama.com/capabilities/structured-outputs'
  - 'Brown, T. et al. (2020), Language Models are Few-Shot Learners, https://arxiv.org/abs/2005.14165'
  - 'Ollama Modelfile (SYSTEM, PARAMETER), official documentation, https://docs.ollama.com/modelfile'
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

<div class="bigidea">Small models do well when you leave them little to guess: one task at a time, the facts in front of them, an example of the answer, and code that checks the result.</div>

## 1. Why this matters

Big cloud models forgive messy prompts. A 4B or 12B model on your laptop does not: it misses instructions buried in the middle and fills gaps with guesses. A few habits close much of the gap.

Think of instructions for a new trainee. "Sort out the accounts" goes badly. "Here is one invoice. Copy the total into this box, like this example" goes well.

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

<div class="steps">
<div class="step"><p><b>The messy prompt.</b> "Read these notes, tell me everything important and draft a letter." Three jobs in one. If each part goes right 90% of the time, all three go right only 0.9 × 0.9 × 0.9 ≈ 73% of the time.</p></div>
<div class="step"><p><b>Split it.</b> Call 1: "Extract symptoms, medicines and next steps as JSON." Call 2: "Draft a letter from this JSON." One verb each.</p></div>
<div class="step"><p><b>Add an example and the facts.</b> Call 2 gets one short example letter and the JSON from call 1, plus "If something is missing, write: not in the notes."</p></div>
<div class="step"><p><b>Check each result.</b> Code checks call 1's JSON has all three fields. If not, it tries once more. A 90% step with one retry now succeeds 1 − 0.1 × 0.1 = 99% of the time.</p></div>
<div class="step"><p><b>The result.</b> Two calls at 99% each: 0.99 × 0.99 ≈ 98% end to end, up from about 73%.</p></div>
</div>

<div class="myth">

**"A longer, more detailed prompt is always better."** For small models, more words often means more for them to lose track of. One clear task, the text, and one example beat a page of instructions. Add detail only where the model actually went wrong.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** reduce what the model must guess. Every unclear part is a chance to go wrong, and small models go wrong more often.

**Equation:** the chance a chain of n steps is all right, if each is right with chance p:

```math
P(\text{all right}) \approx p^{\,n}
```

At 95% per step, 3 steps: 0.95³ ≈ 86%; 10 steps: about 60%. With one checked retry, each step becomes `$1 - (1-p)^2$`.

**Analogy:** instructions for a new trainee: one job at a time, a worked example, and the files they need, rather than "sort out the accounts".

**Try it:** a single prompt asks for 5 things, each done right 90% of the time. Chance all 5 are right? (0.9⁵ ≈ 59%. Split into 5 checked calls and you can retry the ones that fail.)
</details>

<div class="meaning">

<dl>
<dt>p</dt><dd>the chance one step comes out right, for example 0.9 for 90%</dd>
<dt>n</dt><dd>the number of steps that must all be right</dd>
<dt>p<sup>n</sup></dt><dd>the chance every step is right; it shrinks quickly as n grows</dd>
<dt>1 − (1 − p)²</dt><dd>the chance a step ends up right when a failed check gets one more try</dd>
<dt>Physical meaning</dt><dd>Every task you pile into one prompt is another coin the model must not drop. Splitting the job and checking each piece turns a shaky 60% into something close to dependable, the same way a factory checks parts at each station instead of only at the end.</dd>
</dl>

</div>

<div class="problem" data-problem="prompts-for-small-models-retry"></div>

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

<div class="keypoints">

- Small models miss buried instructions and fill gaps with guesses, so leave them less to guess.
- One task per prompt, instructions first, the text clearly marked, and one or two examples of the output.
- Give the facts and ask for "not in the text" when the answer is missing.
- Chance a chain is all right ≈ p<sup>n</sup>; splitting jobs and retrying failed checks raises it sharply.
- Force a JSON schema and a low temperature for anything a program will read.

</div>
