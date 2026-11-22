---
title: GPU, CPU, NPU and unified memory
summary: What each kind of chip does for local AI, why graphics cards lead, what the NPU in new laptops can and cannot do, and why unified memory changed the game.
minutes: 20
updated: 2026-11-22
sources:
  - 'llama.cpp supported back ends (CUDA, Metal, Vulkan, CPU), project README (official page), https://github.com/ggml-org/llama.cpp'
  - 'Ollama hardware support page (official page), https://docs.ollama.com/gpu'
  - 'MLX, Apple''s array framework for machine learning on Apple Silicon unified memory, documentation (official page), https://ml-explore.github.io/mlx/'
quiz:
  - q: Which chip runs most local language models fastest on a Windows PC?
    choices: ['The processor (CPU)', 'A graphics card (GPU) with enough memory', 'The NPU']
    ans: 1
    why: Graphics cards have fast memory and thousands of maths units, and every main engine supports them.
  - q: What is the NPU in most 2026 laptops best at today?
    choices: ['Running 30B chat models', 'Small, steady jobs like live captions and background blur at low power', 'Training models']
    ans: 1
    why: NPUs are frugal but small and share slow laptop memory. Most chat engines still use the GPU or CPU.
  - q: What does unified memory mean?
    choices: ['Memory soldered next to the chip that the processor and graphics share', 'Two memory sticks of the same size', 'Memory in the cloud']
    ans: 0
    why: One pool serves both, so the graphics side can use most of a large pool for the model.
---

**Module 4 · about 20 minutes · read first: 4.1 and 4.2.** You'll be able to read a laptop or PC spec sheet and know which part will run the model.

<div class="bigidea">The chip that holds the model in the fastest memory does the work; if the model has to be split, the slow part sets the pace.</div>

## 1. Why this matters

Every laptop in 2026 is sold as an "AI PC". The label hides very different machines. Knowing which chip actually does the work tells you whether a model will write at 3 or at 30 tokens per second.

## 2. Three kinds of chip

Think of an office. The CPU is the manager: clever, does everything, but only a few of them. The GPU is a big team of clerks who each do one simple sum, all at the same time. The NPU is a small, thrifty helper for routine jobs.

- **CPU (processor):** a few strong cores that do everything. It can run small models (llama.cpp is very good at this), but it is the slowest choice, because normal memory is slow (Lesson 4.2).
- **GPU (graphics chip):** thousands of small maths units and, on a graphics card, its own very fast memory (VRAM). This is where local AI is fastest. NVIDIA cards (using NVIDIA's software layer, CUDA) have the widest support. AMD and Intel cards work with Vulkan or ROCm in llama.cpp, Ollama and LM Studio, with a little more setup.
- **NPU (neural processing unit):** a small, low-power block in recent Intel, AMD, Qualcomm and Apple chips. Great for live captions, voice and photo tricks without draining the battery. For chat models, most engines still use the GPU or CPU; NPU support is growing but limited to certain apps and model formats.

<div class="myth">

**"A laptop with a big TOPS number runs chat models fast."** TOPS (trillions of operations per second) measures sums, not memory. The NPU shares the laptop's ordinary, slowish memory, and most chat engines do not use it yet. For chat, look at the memory size and GB/s instead.

</div>

## 3. Unified memory

On Apple Silicon Macs and the new AI boxes, the CPU, GPU and NPU share one large, fairly fast memory pool. A 64 GB Mac can give the graphics side about 48 GB, which no consumer graphics card offers. The trade: bandwidth is lower than a top graphics card, and reading prompts is slower. Lesson 4.5 compares the machine types.

## 4. What happens when it does not fit

If a model is bigger than the graphics card's memory, engines split it: some layers on the GPU, the rest on the CPU (the `-ngl` setting in llama.cpp, Lesson 9.3). This is called **offloading**. It works, but the slow part sets the pace. Every layer moved off the card costs speed.

Here is one token on a split model, a 16 GB model on a card with 12 GB to spare:

<div class="steps" data-fig="gpu-cpu-npu-split">
<div class="step"><b>The dream.</b> If all 16 GB fitted on a 448 GB/s card, one token would take 16 ÷ 448 ≈ 0.036 s (36 ms): about 28 tokens per second.</div>
<div class="step"><b>The card part.</b> Only 12 GB fits on the card. Reading it takes 12 ÷ 448 ≈ 27 ms.</div>
<div class="step"><b>The main-memory part.</b> The other 4 GB sits in main memory at 60 GB/s: 4 ÷ 60 ≈ 67 ms. A quarter of the model takes more than twice as long as the rest.</div>
<div class="step"><b>Add them up.</b> 27 + 67 ≈ 94 ms per token, about 10.7 tokens per second. The slow quarter takes about 71% of the time. Each token waits for both parts, one after the other.</div>
</div>

With `$G$` GB on the card read at `$B_\text{GPU}$` and `$C$` GB in main memory read at `$B_\text{CPU}$`:

```math
\text{time per token} \approx \frac{G}{B_\text{GPU}} + \frac{C}{B_\text{CPU}}
```

<div class="problem" data-problem="gpu-cpu-npu-split"></div>

<div class="meaning">

<dl>
<dt>G, C</dt><dd>How many GB of the model sit on the graphics card (G) and in main memory (C).</dd>
<dt>B<sub>GPU</sub>, B<sub>CPU</sub></dt><dd>How fast each memory can be read, in GB per second.</dd>
<dt>Offloading</dt><dd>Putting some layers of the model in main memory because the card is full.</dd>
<dt>Physical meaning</dt><dd>Like a relay race between a sprinter and a walker: the walker's short leg still decides the finish time. A small slice of a model in slow memory can halve or third the speed of the whole thing.</dd>
</dl>

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the chip that holds the weights in the fastest memory does the work; the slowest part of a split sets the pace.

**Equation:** time per token ≈ (GB on GPU ÷ GPU bandwidth) + (GB on CPU ÷ CPU bandwidth).

**Analogy:** a relay race. A sprinter and a walker share the distance; the walker's leg decides the finish time.

**Try it:** 12 GB on a 448 GB/s card plus 4 GB on 60 GB/s main memory? (12 ÷ 448 ≈ 0.027 s + 4 ÷ 60 ≈ 0.067 s = 0.094 s, about 10 tokens per second, against about 28 if all 16 GB fitted on the card at 448 GB/s.)
</details>

## 5. Worked example

*Made-up numbers.* Zara's laptop advert says "45 TOPS NPU, 16 GB RAM, integrated graphics". She learns that LM Studio will run Gemma 4 12B on the integrated graphics using shared memory at about 100 GB/s: about 7 to 10 tokens per second. The NPU powers her video call blur. Good enough for drafting; she skips the costlier model.

## 6. Practice

1. Find your machine's graphics chip and memory (Task Manager > Performance on Windows, About This Mac on a Mac).
2. Why is a third of a model on the CPU much worse than a third slower?
3. Name one job an NPU is good for today.

<details>
<summary>Answers</summary>

1. Write them down; you will use them in Module 5.
2. Main memory is several times slower, so that third takes most of the time (see the Try it above).
3. Live captions, noise removal, background blur, small on-device helpers.
</details>

**New words:** *CPU*, *GPU*, *NPU*, *VRAM*, *CUDA* (NVIDIA's software layer), *offloading* (splitting layers between GPU and CPU).

<div class="keypoints">

- The GPU on a graphics card, with its own fast memory, runs local models fastest; the CPU works but is slowest.
- Most chat engines do not use the NPU yet; it suits small, steady jobs like captions and blur.
- Unified memory lets a Mac or AI box give a very large pool to the model, at medium bandwidth.
- When a model is split, time per token = card part ÷ card speed + main-memory part ÷ main-memory speed, so a small slow part costs a lot.

</div>
