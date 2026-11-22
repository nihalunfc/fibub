---
title: 'Prompting, RAG or fine-tuning: which one you need'
seoTitle: Prompting vs RAG vs fine-tuning, explained | Offline AI
summary: Three ways to make a model fit your work. Prompting changes the instructions, RAG gives it your facts, fine-tuning changes its habits. Learn which problem each one solves, in which order to try them, and what each costs.
minutes: 20
updated: 2026-11-22
sources:
  - 'Lewis et al. (2020), Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks, https://arxiv.org/abs/2005.11401'
  - 'Ovadia et al. (2023), Fine-Tuning or Retrieval? Comparing Knowledge Injection in LLMs, https://arxiv.org/abs/2312.05934'
  - 'Hu et al. (2021), LoRA: Low-Rank Adaptation of Large Language Models, https://arxiv.org/abs/2106.09685'
quiz:
  - q: Your model must answer questions about this month's price list, which changes every month. Best fit?
    choices: ['Fine-tuning every month', 'RAG: index the price list and re-index when it changes', 'A longer system prompt with last year''s prices']
    ans: 1
    why: Facts that change belong in RAG. Re-indexing takes minutes; retraining for every change is slow and the model may still mix up old and new prices.
  - q: You want every answer in your firm's exact report format and tone, and the format is too long to explain in each prompt. Best fit?
    choices: ['Fine-tuning on examples of the format', 'RAG', 'A bigger context window']
    ans: 0
    why: Style, format and habits are what fine-tuning teaches well. A few hundred good examples can do it.
  - q: In which order should you usually try the three?
    choices: ['Fine-tuning, RAG, prompting', 'Prompting, then RAG, then fine-tuning', 'All at once']
    ans: 1
    why: Prompting is free and instant, RAG takes an afternoon, fine-tuning takes data and training time. Move on only when the cheaper step falls short.
---

**Module 14 · about 20 minutes · read first: 12.1.** You'll be able to decide whether a problem needs better prompts, RAG or fine-tuning.

<div class="bigidea">Facts go in RAG, habits go in fine-tuning, and you always try a better prompt first because it costs nothing.</div>

## 1. Why this matters

"Can we train it on our data?" is often the first thing people ask, and usually the wrong first step. Fine-tuning is powerful but slow to get right, and it is poor at the job most people want: knowing their facts. Picking the right tool saves weeks.

Think of a new employee. **Prompting** is a sticky note with today's instructions. **RAG** is the filing cabinet they can look things up in. **Fine-tuning** is a month of training until your way of working becomes habit.

## 2. Three tools, three jobs

| | Changes | Good for | Poor for | Effort |
|---|---|---|---|---|
| **Prompting** (Lessons 10.2, 10.5) | The instructions | Tone, format, steps, a few examples | Long rules, many facts | Minutes |
| **RAG** (Module 12) | What it can look up | Your facts, documents that change, citations | Style and habits | An afternoon |
| **Fine-tuning** (this module) | The model's weights | Style, format, house vocabulary, a narrow task done the same way every time, making a small model do one job like a big one | Facts that change; facts you need cited | Days: data, training, testing |

A good rule: **facts go in RAG, habits go in fine-tuning.** Fine-tuning can teach facts, but the model then states them from memory, without a source, and may blend them with what it knew before.

## 3. Try them in order

1. **Prompt first.** Write a clear system prompt with two or three examples. If that fixes it, stop.
2. **Add RAG** when the problem is missing knowledge.
3. **Fine-tune** when the model knows enough but still will not behave the way you need, or when the prompt has grown so long that it slows every request.

They combine well: many working systems use a fine-tuned small model with RAG and a short prompt.

Here is the order in action, for one team (the full story is in section 4):

<div class="steps">
<div class="step"><p><b>The problem.</b> An insurance team wants every claim letter in the same structure and tone. The base model writes good letters, but in its own shape.</p></div>
<div class="step"><p><b>Try 1: prompt.</b> A system prompt with two example letters (1,800 tokens) gets the structure right in <b>70 of 100</b> letters. Better, not good enough.</p></div>
<div class="step"><p><b>Try 2: RAG?</b> Ask: is any fact missing? No. The model knows how to write a letter; it just does not follow the house shape. Looking things up will not fix a habit, so skip it for this problem.</p></div>
<div class="step"><p><b>Try 3: fine-tune.</b> Train on 400 approved letters. Now <b>96 of 100</b> are right, and the 1,800-token example prompt can go, so every request is faster.</p></div>
<div class="step"><p><b>Combine.</b> Policy facts still change, so they come from RAG over the policy documents, with citations. Habits from training, facts from the cabinet.</p></div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** prompting and RAG change the input x; fine-tuning changes the function f itself.

**Equation:** answer = f_θ(prompt + retrieved text + question). Prompting and RAG change what goes inside the brackets; fine-tuning changes θ (the weights), so f behaves differently for every input.

**Analogy:** a new employee. Prompting is a sticky note with today's instructions. RAG is giving them the filing cabinet. Fine-tuning is a month of training until your way of working becomes habit. You would not train someone for a month to remember this week's prices. Where it breaks: a very small model may lack the basic skill altogether; no prompt, cabinet or training month will turn it into an expert.

**Try it:** a system prompt of 1,500 tokens is sent with each of 10,000 requests a day. How many tokens of prefill a day does it cost, which fine-tuning could remove? (15 million.)
</details>

<div class="meaning">

<dl>
<dt>f</dt><dd>the model: a function that turns the text you send into an answer</dd>
<dt>θ (theta)</dt><dd>the model's weights, the billions of numbers learned in training</dd>
<dt>prompt + retrieved text + question</dt><dd>everything you send: prompting changes the instructions, RAG adds looked-up passages</dd>
<dt>fine-tuning</dt><dd>changing θ itself with your own examples, so the model behaves differently for every input</dd>
<dt>Physical meaning</dt><dd>Prompting and RAG change what you hand the worker; fine-tuning changes the worker. You would not retrain someone for a month to remember this week's prices, and you would not hand them a new sticky note every morning to explain a habit you want for years.</dd>
</dl>

</div>

<div class="problem" data-problem="prompt-rag-or-finetune-prefill"></div>

<div class="myth">

**"Fine-tune it on our documents and it will know our facts."** It may pick some up, but it then states them from memory with no source, can blend them with older knowledge, and has to be retrained whenever they change. For facts, RAG is cheaper, easier to update and can cite the page.

</div>

## 4. Worked example

*Made-up numbers.* An insurance team wants claim letters in a set structure and tone. A prompt with two examples gets the structure right 70% of the time. RAG does not help: no facts are missing. They fine-tune Gemma 4 12B on 400 approved letters: the structure is right in 96 of 100 test letters, and the 1,800-token example prompt is no longer needed. Policy facts still come from RAG over the policy documents, with citations.

## 5. Practice

Which would you try first, and why?

1. A chatbot for a school that must know this term's timetable.
2. A model that must always answer in a fixed JSON layout.
3. A model that should write product descriptions in your shop's playful voice.

<details>
<summary>Answers</summary>

1. RAG: facts that change each term.
2. Prompting with a JSON schema (Lesson 11.3), which forces the layout without any training.
3. Prompting with examples first; if the voice is still off after many tries, fine-tuning on 200 to 500 of your best descriptions.
</details>

**New words:** *fine-tuning* (further training a model on your own examples), *weights* / *parameters* / *θ* (the numbers training changes), *knowledge injection* (trying to add facts to a model).

<div class="keypoints">

- Prompting changes the instructions, RAG changes what the model can look up, fine-tuning changes the model's weights.
- Facts go in RAG (they change and need sources); habits such as style, format and tone go in fine-tuning.
- Try them in order: prompt (minutes), then RAG (an afternoon), then fine-tuning (days).
- A fine-tune can replace a long example prompt, which saves reading time on every request.
- Many working systems combine all three: a tuned small model, RAG for facts and a short prompt.

</div>
