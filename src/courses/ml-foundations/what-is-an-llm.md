---
title: 'What an LLM is, and what it is not'
seoTitle: 'What is an LLM? How it works and where it goes wrong'
summary: 'An LLM is a very large next-token predictor: a fixed set of numbers that turns text into probabilities. Ask a made-up model the same question 20 times, see why fluent answers can be wrong, and learn how real systems guard against it.'
minutes: 20
updated: 2026-11-21
quiz:
  - q: 'An LLM answering a question:'
    choices: ['Generates likely text token by token; it does not look the answer up', 'Searches a built-in database of facts', 'Copies the closest web page']
    ans: 0
    why: Unless it is connected to a search tool or your documents, it only has its weights, which store patterns, not a list of facts.
  - q: Why can an LLM give a wrong answer that sounds completely sure?
    choices: ['Wrong but likely-sounding tokens have real probability, and fluency comes from the same process as correctness', 'It is lying on purpose', 'Its battery is low']
    ans: 0
    why: Its writing is fluent by construction. Fluency is not a sign of truth.
  - q: 'Between two separate chats, a plain LLM remembers:'
    choices: ['Nothing, unless the app saves notes and puts them into the next prompt', 'Everything you ever typed', 'Only your name']
    ans: 0
    why: The weights do not change when you chat. Any memory is text the app stores and feeds back in.
---

**Module 10 · about 20 minutes · read first: 10.3, 10.6.** You'll be able to describe an LLM in one accurate sentence, explain context windows, hallucinations and knowledge cut-offs, and say how retrieval and tools make answers more reliable.

## 1. Why this matters

LLMs are now part of most office work, and the people who use them well are the ones who know what they are. A clear picture stops two opposite mistakes: trusting every confident answer, and dismissing a tool that is genuinely useful for drafting, summarising, coding and explaining.

## 2. What it is

**An LLM is a function with billions of fixed numbers (weights) that turns a piece of text into probabilities for the next token.** Everything else is a loop around that function:

1. The app builds a **prompt**: hidden instructions (the system prompt), the conversation so far, any documents, and your message.
2. The model gives probabilities for the next token (Lesson 10.3), one is drawn (with a temperature), and it is added to the text.
3. Repeat until an end token. A 500-word answer is around 700 runs of the network.

The **context window** is how many tokens the model can see at once, prompt and answer together: from a few thousand to over a million. Anything outside it does not exist for the model.

## 3. What it is not

- **Not a database.** Facts are stored only as patterns in the weights. Common facts come out reliably; rare ones (a small company's founding year, a minor court case) may come out wrong but fluent. This is called **hallucination**.
- **Not up to date.** It knows nothing after its training text was collected (its **knowledge cut-off**) unless the app searches the web or your files and puts the results in the prompt.
- **Not learning from your chat.** The weights do not change while you talk. "Memory" features save notes and paste them into later prompts.
- **Not a calculator or a source.** It can do arithmetic and cite papers in the style of doing so; check numbers with a tool and look citations up.

<!--fig:llm-guess-->

The usual fixes add facts from outside: **retrieval-augmented generation** (RAG: find relevant passages with embeddings, Lesson 10.2, and put them in the prompt), **tools** (a calculator, a search, a database query) and asking for sources you can check.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** an answer is a chain of draws, and every draw can go wrong.

**Generating:** with `$p_\theta$` the network,

```math
w_{t+1} \sim p_\theta(\,\cdot \mid w_1, \dots, w_t), \qquad t = 1, 2, \dots
```

**Small error rates add up.** If each stated fact is wrong with probability `$e$`, independently, an answer with `$n$` facts contains at least one error with probability

```math
1 - (1 - e)^{n}
```

**Analogy:** a very well-read friend speaking from memory, without notes. Usually right on common things, sometimes confidently wrong on details, and much better when you hand them the document.

**Try it:** each fact is right 99 % of the time; a report states 50 facts. Chance of at least one error? (`$1 - 0.99^{50} = 0.39$`: about 2 reports in 5.)
</details>

## 4. Worked example

The made-up probabilities in the simulation for the word after "The capital of Australia is": Canberra 0.55, Sydney 0.30, Melbourne 0.08, others 0.07.

- At temperature 1, a wrong city comes out 38 % of the time: about 8 answers in 20.
- At temperature 0.5 the probabilities become `$p^2$`, renormalised: Canberra 0.75, Sydney 0.22. Still wrong almost one time in four.
- At 0.2, Canberra 0.95. Lower temperature helps here only because the top answer happens to be right. If the training text had made "Sydney" the top word, low temperature would give the wrong answer every time.

Putting a sentence from an atlas into the prompt ("Canberra is the capital of Australia") raises the right answer's probability close to 1. That is what RAG does.

## 5. Practice

1. In the simulation, set the temperature to 2.5 and ask 20 times. Why do "a" and "the" start to appear?
2. A colleague says "the model checked its database and found the figure". What is a more accurate description?
3. Name two ways to make an LLM's answer about your company's own policies reliable.

<details>
<summary>Answers</summary>

1. High temperature flattens the probabilities, so unlikely tokens such as "a" (as in "a city …") are drawn more often.
2. It generated likely text from patterns in its weights; unless a search or database tool was connected, nothing was looked up.
3. Put the policy text in the prompt (or use RAG over the policy documents), and ask it to quote the passage it used so a person can check.
</details>

**Try it on your own data:** the free [Offline AI course](/learn/courses/offline-ai/) shows you how to run an LLM on your own computer, with nothing sent anywhere, and the [[prompt-pruner]] prepares your documents for it.

**New words:** *large language model*, *prompt*, *system prompt*, *context window*, *hallucination*, *knowledge cut-off*, *retrieval-augmented generation*, *tool use*.
