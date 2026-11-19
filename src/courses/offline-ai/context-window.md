---
title: "The context window: a model's working memory"
seoTitle: "The context window explained | Offline AI"
summary: Everything the model can see at once, instructions, chat history, documents and its own answer, has to fit in the context window. What happens when it is full, and how to set it.
minutes: 20
updated: 2026-11-18
sources:
  - 'Context lengths of current open models (Gemma 4 31B 256K, Qwen3.8-27B 262K, gpt-oss-120b 128K): Morph, November 2026, https://www.morphllm.com/best-open-source-llm'
quiz:
  - q: What counts towards the context window?
    choices: ['Only your latest question', 'Instructions, the whole conversation so far, any pasted documents, and the answer being written', 'Only the answer']
    ans: 1
    why: The model re-reads everything in the window for each new token, including its own answer so far.
  - q: Your chat passes the context length. What usually happens?
    choices: ['The computer crashes', 'The oldest messages are dropped, so the model forgets the start', 'The model gets smarter']
    ans: 1
    why: Engines cut the oldest text to make room. The model then cannot see what was said at the start.
  - q: A model supports 256K tokens. Why might your engine still be set to 8K?
    choices: ['A longer context needs much more memory, so engines start small', 'The licence forbids it', '256K is only for the cloud']
    ans: 0
    why: Memory for the conversation grows with context length (Lesson 8.4). Engines start with a small window and let you raise it.
---

**Module 3 · about 20 minutes · read first: 3.1.** You'll be able to say what fills the context window, what happens when it overflows, and how to set its size.

## 1. Why this matters

Most "the model forgot" and "it ignored my document" problems are context problems. Knowing the size of the window, and what is in it, lets you design prompts and scripts that keep the important text where the model can see it.

## 2. What the window holds

For every new token it writes, the model looks at everything in its **context window**:

1. the **system prompt** (standing instructions);
2. the **conversation so far**, your messages and its replies;
3. any **documents** or tool results you added;
4. the **answer it is writing**, so far.

The **context length** is the most tokens that can fit. Current open models are trained for long contexts: Gemma 4 31B for 256K tokens, Qwen3.8-27B for 262K, gpt-oss-120b for 128K. But your engine decides how much it actually uses, and many start with a few thousand tokens to save memory.

## 3. When it is full

When the conversation grows past the context length, engines drop the oldest text. The model is not being careless; it simply can no longer see it. Two fixes: a longer window (if memory allows), or a short summary of the old conversation at the start of a new one (Lesson 3.7).

Even inside the window, very long contexts have a known weakness: models pay less attention to the middle of long text than to its start and end (Lesson 17.4). Put key instructions at the start or the end.

## 4. Setting it

- **Apps:** a "context length" setting when you load the model.
- **Ollama:** in a chat, `/set parameter num_ctx 16384`; in code, `options={"num_ctx": 16384}`.
- **llama.cpp:** `-c 16384`.

Raise it step by step and watch memory (Lesson 8.4 explains why it grows).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the window is a fixed-size buffer; what goes in must sum to less than its size.

**Equation:** system + history + documents + answer ≤ context length.

**Analogy:** a whiteboard. You can only work with what is written on it; when it is full, you rub out the oldest part to keep writing.

**Try it:** an 8,192 context with a 300-token system prompt, 2,500 tokens of history and a 1,000-token answer. How big can a document be? (8,192 − 3,800 = 4,392 tokens, about 3,300 words.)
</details>

## 5. Worked example

*Made-up numbers.* Omar pastes a 9,000-token contract into a chat set to 8,192 tokens. The model summarises only the last part, because the start was cut. He raises the context to 16,384; memory use grows by about 1 GB and the summary now covers the whole contract.

## 6. Practice

1. Find the context-length setting in your app or engine.
2. With a 4,096 window, a 200-token system prompt and a 500-token answer, how big can the rest be?
3. Why put the main instruction after a long document as well as before it?

<details>
<summary>Answers</summary>

1. Write down the default; you will compare it with your memory in Lesson 8.4.
2. 4,096 − 700 = 3,396 tokens.
3. Text near the end of a long context gets more attention, and the instruction is less likely to be lost.
</details>

**New words:** *context window* or *context length* (how many tokens the model can see at once), *system prompt* (standing instructions at the start), *truncation* (dropping the oldest text).
