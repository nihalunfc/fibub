---
title: Reasoning models at home
summary: How "thinking" models work locally, how to turn thinking on, off or down in Ollama and LM Studio, and when the extra time is worth it.
minutes: 15
updated: 2026-11-19
sources:
  - 'Ollama thinking support (think parameter; levels for gpt-oss), official documentation, https://docs.ollama.com/capabilities/thinking'
  - 'gpt-oss model card: reasoning effort low, medium and high (OpenAI, official page), https://huggingface.co/openai/gpt-oss-120b'
quiz:
  - q: What does a reasoning model do before answering?
    choices: ['Writes out thinking tokens, working through the problem step by step', 'Searches the internet', 'Nothing different']
    ans: 0
    why: It generates a hidden or visible chain of reasoning first, then the final answer.
  - q: Why can thinking make a local model feel slow?
    choices: ['Every thinking token must be written at the machine''s writing speed', 'It uses the internet', 'It needs a bigger disk']
    ans: 0
    why: 1,500 thinking tokens at 20 tokens per second is 75 seconds before the answer starts.
  - q: When should you turn thinking off or down?
    choices: ['For quick, simple jobs like rewriting or extraction', 'For hard maths', 'Never']
    ans: 0
    why: Simple jobs gain little from thinking and lose a lot of time.
---

**Module 10 · about 15 minutes · read first: 3.4 and 3.5.** You'll be able to decide when to let a local model think and how to control it.

## 1. Why this matters

Many 2026 models can "think" before answering: they write a working-out, then the answer. This helps on maths, code, logic and planning. Locally, every thinking token costs your time, so switching it well matters more than in the cloud.

## 2. How it works

The model writes **thinking tokens** first (Lesson 3.4), often between tags such as `<think>` and `</think>`, then the final answer. Engines can hide the thinking or show it in a fold-out box. More thinking usually means better answers on hard problems, with diminishing returns.

## 3. Controlling it

- **Ollama:** `ollama run <model> --think=false` (or `/set nothink` in the chat); in code, `think=False`. For gpt-oss, choose a level: `think="low"`, `"medium"` or `"high"`.
- **LM Studio:** a thinking or reasoning toggle or effort setting appears for models that support it.
- **Some models** take instructions in the prompt, such as `/no_think` for some Qwen versions. Check the model card.

## 4. When it is worth it

| Job | Thinking |
|---|---|
| Rewrite, translate, extract, classify | off |
| Summarise, email replies | off or low |
| Maths, logic puzzles, tricky code, planning | on (medium or high) |

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** thinking trades time for accuracy, and locally time is the cost you pay.

**Equation:** wait before the answer ≈ prompt reading time + thinking tokens ÷ tokens per second.

**Analogy:** a student who works on rough paper before writing the answer: better on hard exam questions, a waste of time on "what is your name?".

**Try it:** 1,200 thinking tokens at 25 tokens per second? (1,200 ÷ 25 = 48 seconds before the answer starts.)
</details>

## 5. Worked example

*Made-up numbers.* Tariq uses gpt-oss-20b on his laptop. At high effort a tax question takes 90 seconds but gets the steps right; at low effort his email replies arrive in 8 seconds. He sets low as default and switches to high for numbers.

## 6. Practice

1. Ask your model a short logic puzzle with thinking on, then off. Compare time and answer.
2. Find how your engine shows or hides the thinking.
3. Set your default for everyday jobs.

<details>
<summary>Answers</summary>

1. Thinking is usually slower and more often right on puzzles.
2. A fold-out "Thinking" box in LM Studio and Open WebUI; `--hidethinking` in recent Ollama versions hides it in the terminal.
3. Off or low for everyday; on for hard problems.
</details>

**New words:** *reasoning model*, *thinking tokens*, *reasoning effort*.
