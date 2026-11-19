---
title: System prompts and chat templates
summary: How a system prompt sets a local model's role and rules, what a chat template is, and why the wrong template makes a good model talk nonsense.
minutes: 15
updated: 2026-11-19
sources:
  - 'Ollama Modelfile: SYSTEM and TEMPLATE instructions, official documentation, https://docs.ollama.com/modelfile'
  - 'Hugging Face, Chat templates (official page), https://huggingface.co/docs/transformers/main/en/chat_templating'
quiz:
  - q: What is a system prompt?
    choices: ['Standing instructions sent before the conversation that set the role, rules and format', 'The first message the user types', 'An error message']
    ans: 0
    why: It is sent with every request and shapes all answers.
  - q: A model answers with strange tags like <|im_start|> and keeps talking to itself. Likely cause?
    choices: ['The wrong chat template', 'Too little disk space', 'The internet is off']
    ans: 0
    why: Each model family expects its own markers between turns. The wrong ones confuse it.
  - q: Where does a GGUF model usually carry its chat template?
    choices: ['Inside the GGUF file, read by the engine automatically', 'In a separate email', 'Nowhere']
    ans: 0
    why: Modern GGUF files include the template, so Ollama, LM Studio and llama.cpp apply it for you.
---

**Module 10 · about 15 minutes · read first: 9.2 and 10.1.** You'll be able to give a local model a lasting role and fix broken-looking answers.

## 1. Why this matters

A good system prompt turns a general model into a focused assistant: a tutor, a summariser, a support agent. And when a model "goes weird", the cause is often a template problem rather than a bad model.

## 2. System prompts

A conversation has three kinds of message: **system** (standing instructions), **user** and **assistant**. A good system prompt is short and concrete:

```
You summarise meeting notes for a small accounting firm.
Write in plain English. Use at most 5 bullet points.
List action items with the person's name. If something is unclear, say so.
```

Set it in LM Studio's system prompt box, in Ollama with `/set system ...` or a Modelfile `SYSTEM` line, or as the first message with `"role": "system"` in code (Lesson 11.2). It costs tokens on every request, so keep it lean (Lesson 3.6).

## 3. Chat templates

Under the hood, the engine turns the list of messages into one long text with special markers between turns, for example `<start_of_turn>user ... <end_of_turn>`. Each model family has its own markers. The **chat template** is the recipe for this. It ships inside modern GGUF files and is applied automatically.

Signs of a wrong template: the model talks to itself, writes the other side's lines, prints marker text, never stops, or ignores the system prompt. Fix: use the official or well-known GGUF, update the engine, or choose the right template in LM Studio's settings.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the model only ever sees one stream of tokens; the template marks who said what.

**Equation:** tokens per request = system prompt + all earlier turns + new message (Lesson 3.3).

**Analogy:** a play script: speaker names before each line. Remove them and the actor reads everyone's lines.

**Try it:** a 300-token system prompt and 40 requests a day. Tokens spent on it per day? (300 × 40 = 12,000, which is why short system prompts pay off; prompt caching (Lesson 3.8) helps too.)
</details>

## 4. Worked example

*Made-up numbers.* Grace downloads a GGUF from an unknown converter. Answers end with "User: ..." and invented replies. She switches to the official Ollama tag of the same model and the problem disappears: the first file had a missing template.

## 5. Practice

1. Write a three-line system prompt for one job you do every week.
2. Save it in a Modelfile: `FROM gemma4:12b` and `SYSTEM """..."""`, then `ollama create my-helper -f Modelfile`.
3. What would you check first if a model starts writing your lines for you?

<details>
<summary>Answers</summary>

1. Role, format, and one rule for uncertainty work well.
2. `ollama run my-helper` now always starts with your rules.
3. The chat template: use an official file and an up-to-date engine.
</details>

**New words:** *system prompt*, *chat template*, *role*, *Modelfile*.
