---
title: System prompts and chat templates
summary: How a system prompt sets a local model's role and rules, what a chat template is, and why the wrong template makes a good model talk nonsense.
minutes: 15
updated: 2026-11-22
sources:
  - 'Ollama Modelfile: SYSTEM and TEMPLATE instructions, official documentation, https://docs.ollama.com/modelfile'
  - 'Hugging Face, Chat templates (official page), https://huggingface.co/docs/transformers/main/en/chat_templating'
  - 'llama.cpp server: chat templates and the --jinja option, project documentation, https://github.com/ggml-org/llama.cpp/tree/master/tools/server'
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

<div class="bigidea">A system prompt is the standing brief the model reads before every request, and the chat template is the hidden script layout that tells it who said what.</div>

## 1. Why this matters

A good system prompt turns a general model into a focused assistant: a tutor, a summariser, a support agent. And when a model "goes weird", the cause is often a template problem, not a bad model.

## 2. System prompts

A conversation has three kinds of message:

- **system:** standing instructions, like a job brief pinned above the desk;
- **user:** what you type;
- **assistant:** what the model answered before.

A good system prompt is short and concrete:

```
You summarise meeting notes for a small accounting firm.
Write in plain English. Use at most 5 bullet points.
List action items with the person's name. If something is unclear, say so.
```

Set it in LM Studio's system prompt box, in Ollama with `/set system ...` or a Modelfile `SYSTEM` line, or as the first message with `"role": "system"` in code (Lesson 11.2). It is sent again with every request, so it costs tokens every time. Keep it lean (Lesson 3.6).

## 3. Chat templates

The model never sees a neat list of messages. Under the hood, the engine joins them into one long text with special markers between turns, for example `<start_of_turn>user ... <end_of_turn>`. Each model family learned its own markers in training. The **chat template** is the recipe that adds them. It ships inside modern GGUF files and is applied automatically.

It is like the speaker names in a play script. Take the names away and the actor starts reading everyone's lines.

<div class="steps">
<div class="step"><p><b>The messages.</b> Your app holds three items: system "Answer in one sentence.", user "What is RAM?", and an empty assistant turn waiting to be filled.</p></div>
<div class="step"><p><b>The template adds markers.</b> For a Gemma-style model the text becomes: <code>&lt;start_of_turn&gt;user</code> Answer in one sentence. What is RAM? <code>&lt;end_of_turn&gt;</code> <code>&lt;start_of_turn&gt;model</code>. (Many Gemma versions put the system text inside the first user turn; other families have their own system marker.)</p></div>
<div class="step"><p><b>One stream of tokens.</b> That whole text is cut into tokens, about 25 here, and the model reads them all in one go.</p></div>
<div class="step"><p><b>The model writes its line.</b> Because the text ends with "model's turn", it writes the answer: "RAM is the fast, short-term memory a computer uses while it works."</p></div>
<div class="step"><p><b>It stops at the end marker.</b> The model writes <code>&lt;end_of_turn&gt;</code>, the engine stops and hides the marker. With the wrong template it would never see its stop sign, so it keeps going and writes your next line too.</p></div>
</div>

Signs of a wrong template: the model talks to itself, writes the other side's lines, prints marker text, never stops, or ignores the system prompt. The fix: use the official or a well-known GGUF, update the engine, or choose the right template in LM Studio's settings.

<div class="myth">

**"The model is broken; it keeps writing my side of the chat."** The model is usually fine. It is missing its stop sign because the template does not match the family it was trained on. The same weights in a file with the right template behave normally.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the model only ever sees one stream of tokens; the template marks who said what.

**Equation:** tokens per request = system prompt + all earlier turns + new message (Lesson 3.3). Over a month:

```math
\text{system tokens per month} = S \times R \times D
```

for a system prompt of `$S$` tokens, `$R$` requests a day and `$D$` days.

**Analogy:** a play script, with speaker names before each line. Remove them and the actor reads everyone's lines.

**Try it:** a 300-token system prompt and 40 requests a day. Tokens spent on it per day? (300 × 40 = 12,000, which is why short system prompts pay off; prompt caching (Lesson 3.8) helps too.)
</details>

<div class="meaning">

<dl>
<dt>system prompt</dt><dd>standing instructions (role, format, rules) sent in front of every request</dd>
<dt>chat template</dt><dd>the recipe that turns a list of messages into one text with the markers this model family was trained on</dd>
<dt>S × R × D</dt><dd>system prompt size × requests a day × days: the tokens the model spends re-reading its brief</dd>
<dt>Physical meaning</dt><dd>The system prompt is the brief a new employee re-reads before every task, so a short, clear brief saves time all day. The template is the layout of the script: get it wrong and even a good actor muddles the parts.</dd>
</dl>

</div>

<div class="problem" data-problem="system-prompts-monthly-tokens"></div>

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

<div class="keypoints">

- Messages come in three roles: system (standing instructions), user and assistant.
- A good system prompt is short and concrete: role, format and one rule for when it is unsure.
- The system prompt is re-sent with every request, so its size is paid again each time (S × R × D tokens a month).
- The chat template turns messages into one token stream with the markers the model family was trained on; modern GGUF files carry it.
- A model that talks to itself, prints markers or never stops usually has the wrong template, not bad weights.

</div>
