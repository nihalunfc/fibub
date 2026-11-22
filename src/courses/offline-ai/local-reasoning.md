---
title: Reasoning models at home
summary: How "thinking" models work locally, how to turn thinking on, off or down in Ollama and LM Studio, and when the extra time is worth it.
minutes: 15
updated: 2026-11-22
sources:
  - 'Ollama thinking support (think parameter; levels for gpt-oss), official documentation, https://docs.ollama.com/capabilities/thinking'
  - 'gpt-oss model card: reasoning effort low, medium and high (OpenAI, official page), https://huggingface.co/openai/gpt-oss-120b'
  - 'Wei, J. et al. (2022), Chain-of-Thought Prompting Elicits Reasoning in Large Language Models, https://arxiv.org/abs/2201.11903'
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

<div class="bigidea">A reasoning model writes out its working before the answer, which helps on hard problems but costs you seconds for every thinking token your machine has to write.</div>

## 1. Why this matters

Many 2026 models can "think" before answering: they write a working-out, then the answer. This helps on maths, code, logic and planning. On your own machine, every thinking token costs your time, so switching it well matters more than in the cloud.

## 2. How it works

The model writes **thinking tokens** first (Lesson 3.4), often between tags such as `<think>` and `</think>`, then the final answer. Engines can hide the thinking or show it in a fold-out box. More thinking usually means better answers on hard problems, but each extra bit helps less than the last.

It is like a student doing rough work on scrap paper before writing the final answer. On a hard sum it saves marks. On "what is your name?" it just wastes time.

<div class="steps">
<div class="step"><p><b>The question arrives.</b> "A shop sells pens at 3 for $2. How much do 12 pens cost?" The prompt is 40 tokens; the laptop reads it in a fraction of a second.</p></div>
<div class="step"><p><b>Thinking starts.</b> Inside <code>&lt;think&gt;</code> the model writes: "12 pens is 12 ÷ 3 = 4 groups. Each group costs $2. 4 × 2 = 8." That is about 30 tokens; at 20 tokens a second, 1.5 seconds.</p></div>
<div class="step"><p><b>On a hard question it thinks much longer.</b> A tricky tax question might take 1,200 thinking tokens. At 20 tokens a second that is 60 seconds of silence before the answer begins.</p></div>
<div class="step"><p><b>The answer.</b> After <code>&lt;/think&gt;</code> comes the short reply: "12 pens cost $8." The engine shows only this part, or puts the thinking in a fold-out box.</p></div>
</div>

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

<div class="myth">

**"The thinking text shows exactly how the model got its answer."** It is more working-out text written by the same next-token process, not a window into the machine. It often helps, but it can contain mistakes, and the final answer does not always follow from it. Check the answer, not just the reasoning.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** thinking trades time for accuracy, and on your own machine time is the cost you pay.

**Equation:**

```math
\text{wait before the answer} \approx \frac{\text{prompt tokens}}{\text{reading speed}} + \frac{\text{thinking tokens}}{\text{writing speed}}
```

**Analogy:** a student who works on rough paper before writing the answer: better on hard exam questions, a waste of time on "what is your name?".

**Try it:** 1,200 thinking tokens at 25 tokens per second? (1,200 ÷ 25 = 48 seconds before the answer starts.)
</details>

<div class="meaning">

<dl>
<dt>thinking tokens</dt><dd>the working-out the model writes before its answer, usually hidden or folded away</dd>
<dt>reading speed</dt><dd>how fast your machine takes in the prompt (prefill), often hundreds of tokens a second</dd>
<dt>writing speed</dt><dd>how fast it writes new tokens, often 10 to 60 a second on home hardware; thinking is written at this speed</dd>
<dt>reasoning effort</dt><dd>a setting (low, medium, high) that tells some models roughly how much to think</dd>
<dt>Physical meaning</dt><dd>Every thinking token is a word you are waiting for but never read. A thousand of them on a laptop is close to a minute of waiting, so save thinking for the questions where a wrong answer costs more than that minute.</dd>
</dl>

</div>

<div class="problem" data-problem="local-reasoning-wait"></div>

## 5. Worked example

*Made-up numbers.* Tariq uses gpt-oss-20b on his laptop. At high effort a tax question takes 90 seconds but gets the steps right; at low effort his email replies arrive in 8 seconds. He sets low as the default and switches to high for numbers.

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

<div class="keypoints">

- Reasoning models write thinking tokens (a working-out) before the final answer.
- Thinking helps most on maths, logic, tricky code and planning; it adds little to rewriting or extraction.
- Wait before the answer ≈ prompt tokens ÷ reading speed + thinking tokens ÷ writing speed.
- Ollama: `--think=false`, `think=False` in code, or a level for gpt-oss; LM Studio has a toggle or effort setting.
- Set thinking off or low by default and turn it up for hard questions.

</div>
