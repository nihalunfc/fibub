---
title: 'Many users, one model: batching'
summary: Why one machine can answer several people at once nearly as fast as one, how batching works, and how to tell when a queue is about to form.
minutes: 20
updated: 2026-11-22
sources:
  - 'Kwon et al., "Efficient Memory Management for Large Language Model Serving with PagedAttention" (vLLM), SOSP 2023, https://arxiv.org/abs/2309.06180'
  - 'Yu et al., "Orca: A Distributed Serving System for Transformer-Based Generative Models" (continuous batching), OSDI 2022, https://www.usenix.org/conference/osdi22/presentation/yu'
  - 'Ollama FAQ: OLLAMA_NUM_PARALLEL and OLLAMA_MAX_QUEUE (official page), https://docs.ollama.com/faq'
quiz:
  - q: Why does answering four people at once cost the machine much less than four times the work?
    choices: ['The weights are read from memory once per step and shared by all four answers', 'The model skips words', 'Each person gets a smaller model']
    ans: 0
    why: Writing is limited by reading the weights (Lesson 4.2). One read can feed several answers, so total speed rises.
  - q: What is continuous batching?
    choices: ['Waiting until a full batch of requests arrives', 'Letting new requests join and finished ones leave the batch at every step', 'Running the same prompt over and over']
    ans: 1
    why: Nobody waits for a batch to fill or for the slowest answer to finish; the batch changes every token.
  - q: Twenty people each ask 6 questions an hour and each answer keeps the machine busy for 12 seconds. About how busy is it?
    choices: ['About 40% of the time', 'About 4%', 'Always full']
    ans: 0
    why: 20 × 6 × 12 = 1,440 busy seconds an hour, out of 3,600, which is 40%. Waits start to show above about 70%.
---

**Module 15 · about 20 minutes · read first: 4.2 and 5.5.** You'll be able to explain batching and predict whether one machine can serve your group without a queue.

<div class="bigidea">One read of the model's weights can feed several answers at once, so one machine can serve a group, and queues start when it is busy most of the time, long before it is busy all the time.</div>

## 1. Why this matters

At home, one person talks to one model. In an office, five or fifty people share it. If the machine answers them strictly one by one, the tenth person waits for nine answers first. **Batching** lets it write several answers at the same time, and the trick that makes this possible is the same fact that sets the speed limit in Lesson 4.2.

## 2. The free ride

To write one token, the chip reads every active weight from memory once. Reading is the slow part; the sums are quick. So if four answers are in progress, the chip can read the weights once and do the sums for all four. Each answer gets slightly slower, but the machine as a whole writes nearly four times as many tokens per second.

It is like a bus. Driving the route costs about the same with one passenger or forty, so filling the seats moves far more people for almost the same fuel.

<div class="steps" data-fig="batching-free-ride">
<div class="step"><p><b>One answer at a time.</b> To write each token the chip reads all 8 GB of weights. At 40 reads a second, Ana gets 40 tokens a second. Ben, Chen and Dev wait in the queue.</p></div>
<div class="step"><p><b>Four answers share each read.</b> Same 8 GB read, but now the sums are done for all four. Each person gets about 35 tokens a second; the machine writes about <b>140</b>. (Made-up but typical numbers.)</p></div>
<div class="step"><p><b>Continuous batching.</b> Ben's short answer finishes. At the very next step, Eve's new question takes his seat. Nobody waits for a batch to fill or for the longest answer to end.</p></div>
<div class="step"><p><b>The catch.</b> Each conversation keeps its own KV cache (Lesson 8.4), which takes memory and must be read too. As the batch grows, memory fills and the gain per extra seat shrinks.</p></div>
</div>

The gain shrinks as the batch grows: each answer also has its own KV cache (Lesson 8.4) to read, and at some point the chip's arithmetic, not memory, becomes the bottleneck. Real engines often get 3 to 6 times the total output from a batch of 8, and more from bigger batches on data-centre cards.

## 3. Continuous batching

Old-style batching waited for, say, eight requests, ran them together and made everyone wait for the longest answer. **Continuous batching** (from the Orca paper, now in vLLM, SGLang, llama.cpp's server and others) adds and removes requests at every step. A short answer leaves as soon as it is done and a new question takes its seat. Memory for the KV caches is handed out in small pages (vLLM's PagedAttention) so many conversations fit without waste.

## 4. Try it

Move the sliders. Start with 20 people and batch size 1, then switch to 4 and 8.

<!--fig:queue-counter-->

Notice three things. With batch size 1, the queue jumps once the machine is busy more than about 70% of the time. Batching turns the same machine into one that hardly queues at all. And past a point, adding people grows the queue faster than adding batch slots helps: that is when you need a second machine (Lesson 15.3) or a smaller, faster model.

## 5. What your engine does by default

- **Ollama** handles a few requests to the same model at once; the number is set by the `OLLAMA_NUM_PARALLEL` setting, and extra requests wait in a queue (up to `OLLAMA_MAX_QUEUE`). Each parallel slot needs its own context memory.
- **LM Studio** serves requests one after another by default on most setups; check its server settings for parallel requests in your version.
- **llama.cpp's `llama-server`** takes `--parallel N` (or `-np N`) slots and batches them continuously. The `-c` context is shared among the slots, so `-c 32768 -np 4` gives each person 8,192 tokens.
- **vLLM and SGLang** are built for this from the ground up (Lesson 15.2).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a shared machine starts to queue when it is busy most of the time, long before it is busy all of the time.

**Equation:** utilisation ρ = (people × questions per hour × seconds per answer) ÷ 3,600. In the simplest queue model the average wait grows like ρ ÷ (1 − ρ): at 50% busy the wait is about one answer time, at 80% about four, at 90% about nine.

**Analogy:** a supermarket with one till. At half busy you rarely queue. At 90% busy one slow customer backs up the whole line.

**Try it:** 30 people, 4 questions an hour each, 20 seconds per answer? (30 × 4 × 20 = 2,400 seconds; ρ = 2,400 ÷ 3,600 ≈ 0.67, so waits of about two answer times at busy moments. Batching would help.)
</details>

<div class="meaning">

<dl>
<dt>ρ (rho), utilisation</dt><dd>the share of each hour the machine is busy answering, from 0 (idle) to 1 (always busy)</dd>
<dt>seconds per answer</dt><dd>answer tokens ÷ tokens per second for one person</dd>
<dt>3,600</dt><dd>the seconds in an hour</dd>
<dt>ρ ÷ (1 − ρ)</dt><dd>the average wait in answer times in the simplest queue model: 1 at 50% busy, 4 at 80%, 9 at 90%</dd>
<dt>Physical meaning</dt><dd>A supermarket with one till. At half busy you rarely queue; at 90% busy one slow customer backs up the whole line. Batching is like opening more tills at the same counter: the same machine serves more people before the line forms.</dd>
</dl>

</div>

<div class="problem" data-problem="batching-utilisation"></div>

<div class="myth">

**"The machine is only busy 70% of the time, so nobody waits."** Questions do not arrive evenly. They bunch up after meetings and lunch, and when two arrive together one waits. The average wait climbs steeply long before 100%: in the simple model, about 2.3 answer times at 70% and 9 at 90%. Plan to stay under about 70%, or turn on batching.

</div>

## 6. Worked example

*Made-up numbers.* A 12-person design studio runs Gemma 4 12B on a 16 GB card at 40 tokens per second for one person. Answers average 500 tokens, so 12.5 seconds each. Each person asks about 8 questions an hour: ρ = 12 × 8 × 12.5 ÷ 3,600 ≈ 0.33. Without batching that is fine most of the day. After lunch everybody asks at once and waits climb to a minute. They set Ollama to 4 parallel requests, which needs a little more memory for context, and the after-lunch waits drop to a few seconds.

## 7. Practice

1. Work out ρ for your own group, using your machine's tokens per second from Lesson 3.5.
2. Why does each parallel slot need its own memory?
3. In the simulation, find the smallest batch size that keeps the average wait under 5 seconds for 50 people asking 6 questions an hour.

<details>
<summary>Answers</summary>

1. Below 0.5: one machine without batching is fine. 0.5 to 0.8: turn on batching. Above 0.8: batching plus a bigger or second machine.
2. Each conversation has its own KV cache, which grows with its length (Lesson 8.4).
3. With the default 500-token answers at 40 tokens per second, batch size 8 usually does it on one machine; check what the simulation says.
</details>

**New words:** *batching* (writing several answers in one pass over the weights), *continuous batching*, *utilisation*, *queue*, *parallel slots*.

<div class="keypoints">

- Writing a token means reading all active weights once; batching lets that one read feed several answers.
- Continuous batching adds and removes requests at every step, so nobody waits for a batch to fill.
- Utilisation ρ = people × questions per hour × seconds per answer ÷ 3,600; waits grow like ρ ÷ (1 − ρ).
- Below about 0.5 one machine is fine; 0.5 to 0.8 turn on batching; above 0.8 add capacity.
- Each parallel slot needs its own KV cache memory (`OLLAMA_NUM_PARALLEL`, or `-np` in llama-server).

</div>
