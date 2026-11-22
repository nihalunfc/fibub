---
title: Measure tokens and speed on your own machine
seoTitle: Measure token counts and speed locally | Offline AI
summary: Get exact token counts and speeds from your own engine, with one command and a short Python script, so every estimate in this course becomes a measurement.
minutes: 20
updated: 2026-11-22
sources:
  - 'Ollama API documentation on GitHub (response fields and durations in nanoseconds) https://github.com/ollama/ollama/blob/main/docs/api.md'
  - 'Ollama Python library https://github.com/ollama/ollama-python'
  - 'llama.cpp, official repository (llama-bench and per-answer timings) https://github.com/ggml-org/llama.cpp'
  - 'Ollama API response fields (prompt_eval_count, eval_count, eval_duration), https://docs.ollama.com'
quiz:
  - q: In Ollama's reply, what is eval_count?
    choices: ['The number of output tokens written', 'The number of users', 'The model size']
    ans: 0
    why: eval_count is output tokens; prompt_eval_count is input tokens read (excluding any reused from the cache).
  - q: eval_duration is in nanoseconds. How do you get tokens per second?
    choices: ['eval_count ÷ (eval_duration ÷ 1,000,000,000)', 'eval_count × eval_duration', 'eval_duration ÷ eval_count']
    ans: 0
    why: Convert nanoseconds to seconds, then divide tokens by seconds.
  - q: Why measure the same prompt three times?
    choices: ['The first run includes loading the model, and speeds vary a little', 'To use more tokens', 'It is required by the licence']
    ans: 0
    why: The first request loads the model into memory; later runs show the true steady speed.
---

**Module 3 · about 20 minutes · read first: 3.5 and 11.2 (or come back after 11.2).** You'll be able to measure exact token counts and speeds for any prompt on your machine.

<div class="bigidea">Your engine already counts every token and times every answer; read those numbers a few times and every estimate becomes a measurement you can plan with.</div>

## 1. Why this matters

Rules of thumb get you started; measurements let you plan. With real counts you can say "this job is 2.1 million tokens and will take 9 hours", and check that a change actually helped.

## 2. The quick way

```
ollama run gemma4:e4b --verbose
```

Ask something. After the answer you will see lines such as `prompt eval count` (input tokens), `prompt eval rate` (reading speed), `eval count` (output tokens) and `eval rate` (writing speed). llama.cpp prints similar timings after each answer, and LM Studio shows tokens per second under each reply.

It is like the trip computer in a car: it already knows the distance and the time; you just have to look.

## 3. The script way

```python
import ollama

def measure(prompt: str, model: str = "gemma4:e4b") -> None:
    r = ollama.chat(model=model, messages=[{"role": "user", "content": prompt}])
    tin, tout = r["prompt_eval_count"], r["eval_count"]
    secs = r["eval_duration"] / 1e9
    print(f"input {tin} tokens, output {tout} tokens, writing {tout / secs:.1f} tokens per second")

for _ in range(3):
    measure("Explain what a context window is in 80 words.")
```

Run it three times: the first includes loading the model. Swap in your own prompts to measure your real jobs, and log the results (Lesson 9.7).

Here is what the script does with one reply.

<div class="steps">
<div class="step"><p><b>The reply arrives</b> with numbers attached: <code>prompt_eval_count</code> 42, <code>eval_count</code> 96, <code>eval_duration</code> 4,800,000,000.</p></div>
<div class="step"><p><b>Counts.</b> 42 input tokens were read and 96 output tokens written.</p></div>
<div class="step"><p><b>Convert the time.</b> Durations are in nanoseconds (billionths of a second): 4,800,000,000 ÷ 1,000,000,000 = <b>4.8 seconds</b> of writing.</p></div>
<div class="step"><p><b>Speed.</b> 96 ÷ 4.8 = <b>20 tokens per second</b>.</p></div>
<div class="step"><p><b>Repeat and take the middle.</b> Three runs give 14 (model loading), 20 and 21. The median is <b>20</b>: that is your machine's real writing speed for this model.</p></div>
</div>

<div class="problem" data-problem="measure-tokens-rate"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** measure several runs and use the middle value; single runs mislead.

**Equation:** speed = tokens ÷ seconds; job time ≈ items × (input ÷ read speed + output ÷ write speed).

**Analogy:** timing a commute: one day's traffic jam does not tell you the usual time; a week of trips does.

**Try it:** runs of 18, 21 and 20 tokens per second. Which is the middle (median)? (20.)
</details>

<div class="meaning">

<dl>
<dt>items</dt><dd>how many files, emails or questions the job will process</dd>
<dt>input, output</dt><dd>measured tokens read and written for a typical item</dd>
<dt>read speed, write speed</dt><dd>your measured prompt eval rate and eval rate, in tokens per second</dd>
<dt>job time ≈ items × (input ÷ read + output ÷ write)</dt><dd>how long the whole run will take, in seconds</dd>
<dt>Physical meaning</dt><dd>Measure a few typical items and you can say "this job takes 1 hour 50 minutes" before you start it, then check that a change really made it faster rather than guessing.</dd>
</dl>

</div>

<div class="myth">

**"The first answer shows how fast my machine is."** The first request also loads the model from disk into memory, which can take many seconds, so it looks slow. Ignore it, or take the middle of three runs. Speeds also drop a little with very long prompts, so measure with prompts like your real ones.

</div>

## 4. Worked example

*Made-up numbers.* Before a 600-file job, Zoe measures three typical files: about 1,800 input and 110 output tokens each, reading at 450 and writing at 16 tokens per second. Each file takes about 4 + 7 = 11 seconds, so the job needs about 1 hour 50 minutes. She starts it before lunch.

<div class="problem" data-problem="measure-tokens-job"></div>

## 5. Practice

1. Run `--verbose` and note your reading and writing speeds.
2. Run the script on a short and a long prompt. How do the speeds change?
3. Estimate the time for 1,000 items at 1,000 input and 80 output tokens, with your measured speeds.

<details>
<summary>Answers</summary>

1. Keep them in your log; they are your machine's real numbers.
2. Writing usually slows a little as the context grows.
3. Items × (1,000 ÷ read speed + 80 ÷ write speed).
</details>

**New words:** *eval count* (output tokens), *prompt eval count* (input tokens), *median* (the middle value).

<div class="keypoints">

- `ollama run <model> --verbose` prints input and output token counts and both speeds after each answer.
- In code, prompt_eval_count is input tokens, eval_count is output tokens, and durations are in nanoseconds.
- Writing speed = eval_count ÷ (eval_duration ÷ 1,000,000,000).
- Run three times and take the median; the first run includes loading the model.
- Job time ≈ items × (input ÷ read speed + output ÷ write speed).

</div>
