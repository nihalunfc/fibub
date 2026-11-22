---
title: "The context window: a model's working memory"
seoTitle: "The context window explained | Offline AI"
summary: Everything the model can see at once, instructions, chat history, documents and its own answer, has to fit in the context window. What happens when it is full, and how to set it.
minutes: 20
updated: 2026-11-22
sources:
  - 'Ollama FAQ, how to set the context window (num_ctx) https://github.com/ollama/ollama/blob/main/docs/faq.md'
  - 'llama.cpp, official repository (the -c context size option) https://github.com/ggml-org/llama.cpp'
  - 'Liu, N. F. et al. (2023), Lost in the Middle: How Language Models Use Long Contexts https://arxiv.org/abs/2307.03172'
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

<div class="bigidea">The context window is everything the model can see at once; instructions, chat, documents and its own answer must all fit, and whatever falls out is simply gone.</div>

## 1. Why this matters

Most "the model forgot" and "it ignored my document" problems are context problems. Knowing the size of the window, and what is in it, lets you design prompts and scripts that keep the important text where the model can see it.

## 2. What the window holds

For every new token it writes, the model looks at everything in its **context window**:

1. the **system prompt** (standing instructions);
2. the **conversation so far**, your messages and its replies;
3. any **documents** or tool results you added;
4. the **answer it is writing**, so far.

The **context length** is the most tokens that can fit. Current open models are trained for long contexts: Gemma 4 31B for 256K tokens, Qwen3.8-27B for 262K, gpt-oss-120b for 128K (K means thousand). But your engine decides how much it actually uses, and many start with a few thousand tokens to save memory.

Think of a desk. The model can only use the papers spread out on it. A bigger desk holds more, but costs more room in the office (memory).

Watch an 8,192-token window fill up, with the numbers from the box below.

<div class="steps" data-fig="context-window-fill">
<div class="step"><p><b>An empty window</b> of 8,192 tokens.</p></div>
<div class="step"><p><b>Standing instructions.</b> The system prompt takes <b>300</b> tokens.</p></div>
<div class="step"><p><b>The chat so far.</b> Your messages and its replies: <b>2,500</b> tokens.</p></div>
<div class="step"><p><b>Room for the answer.</b> Keep <b>1,000</b> tokens free for the reply it will write. Left for a document: 8,192 − 3,800 = <b>4,392</b> tokens, about 3,300 words.</p></div>
<div class="step"><p><b>Overflow.</b> Paste a 9,000-token contract instead and it cannot all fit. The engine drops the oldest text first: the start of the chat, then the start of the contract. The model never sees them.</p></div>
</div>

Try it: tap the word "it" in the Meaning link head, then switch the mask between causal and full.

<figure class="fig" data-fig="@ai-attention-heads"><figcaption>Each head learns its own pattern of who looks at whom, and a weight row always adds to 100%. In a text generator the causal mask hides later words, because they have not been written yet.</figcaption></figure>

## 3. When it is full

When the conversation grows past the context length, engines drop the oldest text. The model is not being careless; it simply can no longer see it. Two fixes: a longer window (if memory allows), or a short summary of the old conversation at the start of a new one (Lesson 3.7).

Even inside the window, very long contexts have a known weakness: models pay less attention to the middle of long text than to its start and end (Lesson 17.4). Put key instructions at the start or the end.

<div class="myth">

**"My model supports 256K tokens, so my app gives it 256K."** Often it doesn't. The 256K is what the model was trained to handle; the engine sets what it actually uses, and many start at 4K or 8K because every extra token of window needs memory. If a long document seems ignored, check the context length setting first.

</div>

Try it: press Play and watch the oldest messages fall out of the window; compare the three ways of handling a full window.

<figure class="fig" data-fig="@ai-context-slide"><figcaption>The model only sees what fits in the window. Dropping the oldest messages loses early facts like the user's name; pinning the system prompt or summarising keeps what matters at a small cost.</figcaption></figure>

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

<div class="meaning">

<dl>
<dt>system</dt><dd>tokens of standing instructions at the start</dd>
<dt>history</dt><dd>tokens of the conversation so far, both sides</dd>
<dt>documents</dt><dd>tokens of anything pasted or attached, and tool results</dd>
<dt>answer</dt><dd>tokens you keep free for the reply</dd>
<dt>context length</dt><dd>the size of the window the engine is set to, in tokens</dd>
<dt>Physical meaning</dt><dd>The model has no memory outside this window. If the sum is too big, something is cut, usually the oldest text, and the model behaves as if it was never said. Plan the budget like packing a bag with a weight limit.</dd>
</dl>

</div>

<div class="problem" data-problem="context-window-room"></div>

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

<div class="keypoints">

- The context window holds the system prompt, the conversation, any documents and the answer being written.
- system + history + documents + answer ≤ context length.
- When it overflows, the oldest text is dropped and the model can no longer see it.
- Models may support 128K to 262K tokens, but engines often start at a few thousand to save memory; raise it step by step.
- Put key instructions at the start or end: the middle of a long context gets the least attention.

</div>
