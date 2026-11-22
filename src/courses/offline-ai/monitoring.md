---
title: Watching speed, memory and errors
summary: The five numbers to watch on a shared AI machine, the commands that show them, and simple alerts and logs that tell you something is wrong before your users do.
minutes: 20
updated: 2026-11-22
sources:
  - 'NVIDIA System Management Interface (nvidia-smi) documentation (official page), https://developer.nvidia.com/system-management-interface'
  - 'llama.cpp server: /health and /metrics endpoints (official README), https://github.com/ggml-org/llama.cpp/tree/master/tools/server'
  - 'vLLM documentation: production metrics (official page), https://docs.vllm.ai'
  - 'Prometheus and Grafana (official pages), https://prometheus.io and https://grafana.com'
quiz:
  - q: Users say answers are slow to start but fast once they begin. Which number do you check first?
    choices: ['Time to first token and the queue length', 'Disk space', 'Fan colour']
    ans: 0
    why: Slow starts mean waiting in a queue or a long prompt being read (prefill). Writing speed is fine.
  - q: The graphics card's memory is 100% full and some requests fail. What is the likely cause?
    choices: ['Too many parallel slots or too long a context for the memory', 'The keyboard', 'The internet is down']
    ans: 0
    why: Each slot needs KV cache memory. Fewer slots, a shorter context, or a smaller quant frees memory.
  - q: Why should logs on a shared AI server avoid storing the full text of every prompt?
    choices: ['Prompts may contain private data, and logs are often kept longer and seen by more people', 'Text takes no space', 'It is illegal to log anything']
    ans: 0
    why: Log what you need to run the service (times, sizes, errors). Keep content only if you have a reason and have told users.
---

**Module 15 · about 20 minutes · read first: 15.2.** You'll be able to see how your AI server is doing and spot trouble early.

<div class="bigidea">Watch five numbers (time to first token, tokens per second, memory, queue and errors) and you will spot trouble before your users do.</div>

## 1. Why this matters

A shared machine fails quietly: answers get slower, a card overheats and slows itself down, memory fills and requests start failing. If you watch a few numbers, you fix these in minutes. If you don't, users stop trusting the service. It is like the dashboard in a car: you glance at fuel and temperature so you never meet the problem on the motorway.

## 2. The five numbers

| Number | Healthy | What a bad value means |
|---|---|---|
| **Time to first token** | Under 2 to 3 seconds | Queue (Lesson 15.1) or very long prompts |
| **Tokens per second per user** | Close to your Lesson 3.5 measurement | Throttling (Lesson 6.4), too big a batch, or swapping to normal memory |
| **Memory used** (card or unified) | Steady, below about 95% | Context or slots too large; a second model loaded |
| **Queue length / requests waiting** | Usually 0 | Not enough capacity at busy times |
| **Errors** | Near 0 | Out of memory, timeouts, crashes |

Add **temperature** and **power** for the hardware: a card that sits at its temperature limit slows itself down.

Here is the clinic from section 6, solved by reading the numbers in order:

<div class="steps">
<div class="step"><p><b>The complaint.</b> "The AI is slow every afternoon." Mornings are fine.</p></div>
<div class="step"><p><b>Check the start.</b> Time to first token is about 1 second and the queue is 0. So nobody is waiting in line; the problem is elsewhere.</p></div>
<div class="step"><p><b>Check the writing.</b> Tokens per second per user has dropped from 40 in the morning to about 22. Writing has slowed down.</p></div>
<div class="step"><p><b>Check the hardware.</b> <code>nvidia-smi</code> shows the card at 83 °C with its clock speed falling: it is <b>throttling</b>, slowing itself down to stay cool.</p></div>
<div class="step"><p><b>Fix and confirm.</b> The server cupboard door is shut after lunch. A vent brings the card back to 70 °C and 40 tokens a second. No software change at all.</p></div>
</div>

## 3. Where to read them

```bash
# NVIDIA cards: memory, use, temperature and power, every 2 seconds
nvidia-smi -l 2

# Ollama: which models are loaded, how big, on GPU or CPU
ollama ps

# llama.cpp server started with --metrics: health and counters
curl http://localhost:8080/health
curl http://localhost:8080/metrics

# vLLM: the same Prometheus-style counters
curl http://localhost:8000/metrics
```

On a Mac, Activity Monitor's Memory tab shows memory pressure (keep it green) and Window > GPU History shows the graphics load. On Windows, Task Manager > Performance shows the card's memory and use.

## 4. Simple to serious

- **One person in charge, small team:** a weekly look at `nvidia-smi` or Activity Monitor, and the engine's log after any complaint.
- **Growing team:** a tiny script every five minutes that asks the server a fixed question, times the answer and writes one line to a file. If it fails twice, email yourself.
- **Many users:** collect `/metrics` with Prometheus and draw dashboards in Grafana, both free and able to run on the same office network, with alerts for queue length, errors and temperature.

## 5. Logs and privacy

Logs are for running the service: time, user name or ID, model, tokens in and out, how long it took, errors. Full prompts and answers are personal data in many places; log them only with a reason, tell users, and delete them on a schedule. Lesson 17.6 goes further.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** total time for an answer = waiting + reading the prompt (prefill) + writing.

**Equation:** answer time ≈ queue wait + prompt tokens ÷ prefill speed + answer tokens ÷ writing speed.

**Analogy:** a takeaway order: the queue at the counter, the cook reading the ticket, then the cooking.

**Try it:** 0 s wait, 6,000-token prompt at 1,500 tokens/s prefill, 400-token answer at 30 tokens/s? (0 + 4 + 13.3 ≈ 17 seconds, first word after about 4 seconds.)
</details>

<div class="meaning">

<dl>
<dt>queue wait</dt><dd>time a request waits before the engine starts on it; high means not enough capacity at busy times</dd>
<dt>prompt tokens ÷ prefill speed</dt><dd>time spent reading the prompt; queue wait plus this is the time to first token</dd>
<dt>answer tokens ÷ writing speed</dt><dd>time spent writing; slow writing points at heat, too big a batch, or memory spilling over</dd>
<dt>Physical meaning</dt><dd>A takeaway order: the queue at the counter, the cook reading the ticket, then the cooking. If customers complain, you ask which of the three got slow, and each one points to a different fix.</dd>
</dl>

</div>

<div class="problem" data-problem="monitoring-answer-time"></div>

<div class="myth">

**"If the server has not crashed, it is fine."** AI servers rarely fall over; they get slower. A hot card throttles, a second model loads and pushes the first onto the CPU, the queue grows at lunchtime. Users notice long before anything crashes, so watch the numbers, not just whether it is on.

</div>

## 6. Worked example

*Made-up numbers.* A clinic's AI server becomes slow every afternoon. `nvidia-smi` shows the card at 83 °C and its clock dropping. The server cupboard has no airflow after the door is shut at lunch. A vent in the door brings it back to 70 °C and full speed. No software change needed: the numbers pointed straight at it.

## 7. Practice

1. Which two commands would you run first on an NVIDIA server that feels slow?
2. What should your five-minute check script record?
3. Write one sentence for staff saying what the AI server logs and for how long.

<details>
<summary>Answers</summary>

1. `nvidia-smi` (memory, heat, load) and the engine's own status (`ollama ps` or `/metrics`).
2. Time, whether it answered, time to first token, total time.
3. For example: "The AI server records who used it, when and how long answers took, not what you typed; records are deleted after 30 days."
</details>

**New words:** *time to first token*, *prefill*, *throttling*, *metrics*, *Prometheus and Grafana*, *alert*.

<div class="keypoints">

- Watch time to first token, tokens per second per user, memory used, queue length and errors, plus temperature and power.
- Slow starts point to the queue or long prompts; slow writing points to heat, batch size or memory spilling over.
- `nvidia-smi`, `ollama ps` and the engine's `/metrics` endpoint show these numbers; Activity Monitor and Task Manager do on Mac and Windows.
- Start simple (a timed test question every five minutes) and grow to Prometheus and Grafana for many users.
- Log times, sizes and errors, not the full text of prompts, unless you have a reason and have told users.

</div>
