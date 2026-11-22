---
title: MLX on a Mac
summary: Apple's MLX runs models fast on Apple Silicon Macs. Install it with one command, run a model, and start a local server.
minutes: 20
updated: 2026-11-22
sources:
  - 'MLX (Apple, open source), https://github.com/ml-explore/mlx'
  - 'mlx-lm, the language-model tools for MLX, https://github.com/ml-explore/mlx-lm'
  - 'Mac speeds and memory bandwidth (M5 generation), ComputingForGeeks, checked 27 October 2026, https://computingforgeeks.com/best-mac-for-local-llm/'
  - 'MLX documentation: unified memory (official page), https://ml-explore.github.io/mlx/build/html/usage/unified_memory.html'
quiz:
  - q: Why do Macs run local models well for their price?
    choices: ['They have a special AI subscription', 'The processor and graphics share one large pool of fast memory', 'They never get warm']
    ans: 1
    why: Unified memory means a 32 GB Mac can give most of that memory to the model, unlike a PC where the graphics card has its own smaller memory.
  - q: Which command installs the MLX language-model tools?
    choices: ['brew install gemma', 'pip install mlx-lm', 'ollama pull mlx']
    ans: 1
    why: mlx-lm is a Python package. It brings mlx_lm.generate, mlx_lm.chat and mlx_lm.server.
  - q: Does MLX run on a Windows PC?
    choices: ['Yes, on any PC', 'No, it is made for Apple Silicon Macs', 'Only with an NVIDIA card']
    ans: 1
    why: MLX is built for Apple's M-series chips. On a PC, use llama.cpp, Ollama or an app.
---

**Module 9 · about 20 minutes · read first: 9.2. Mac only; on a PC, skip to 9.5.** You'll be able to run a model with MLX and serve it to other programs.

<div class="bigidea">On an Apple Silicon Mac the processor and graphics share one big memory, so about three quarters of it can hold a model, and the memory's read speed sets how fast that model writes.</div>

## 1. Why this matters

On an Apple Silicon Mac (M1 or later), MLX often runs models faster than other engines because it is written for Apple's chips. Desktop apps can use it for you; using it directly lets you script it and pick from thousands of ready-converted models.

## 2. Unified memory in one paragraph

On a PC, the graphics card has its own memory (often 8 to 16 GB) separate from the main memory. On an Apple Silicon Mac, processor and graphics share one pool: **unified memory**. So a 32 GB Mac can put a 19 GB model where the graphics side reaches it at full speed. The catch: macOS keeps some for itself, so plan on using about three quarters of the total.

### Watch it happen: will it fit, and how fast?

<div class="steps">
<div class="step"><p><b>The Mac.</b> 32 GB of unified memory that can be read at 170 GB per second (Apple lists this "memory bandwidth" for each chip).</p></div>
<div class="step"><p><b>Room for models.</b> About three quarters: 0.75 × 32 = <b>24 GB</b>. macOS and your apps keep the rest.</p></div>
<div class="step"><p><b>Pick a model.</b> A 16 GB 4-bit model fits, with 8 GB left for the conversation. A 30 GB one does not.</p></div>
<div class="step"><p><b>Top speed.</b> Each token reads the whole model once: 170 ÷ 16 ≈ <b>10.6 tokens per second</b> at best. Real speed is often 60% to 80% of that.</p></div>
<div class="step"><p><b>Smaller is faster.</b> A 7.7 GB model on the same Mac: 170 ÷ 7.7 ≈ 22 tokens per second. Half the size, about twice the speed.</p></div>
</div>

Try it: lower the bits to 3 or 2, then compare one scale for everything against one per block of 32.

<figure class="fig" data-fig="@ai-quant-grid"><figcaption>Fewer bits means fewer levels, so every weight is rounded more. One outlier stretches a shared scale and crushes the small weights, which is why formats give each small block its own scale.</figcaption></figure>

## 3. Install and run

You need Python 3 (macOS offers to install it the first time you type `python3`). A **virtual environment** is a private folder of Python packages for one project, so nothing clashes with the rest of your Mac. Then:

```
python3 -m venv ~/mlx-env
source ~/mlx-env/bin/activate
pip install mlx-lm
```

Run a model (it downloads on first use, then works offline):

```
mlx_lm.generate --model mlx-community/<model-name> --prompt "Explain unified memory in two sentences."
```

The **mlx-community** group on Hugging Face publishes converted models; search there for "gemma 4" and pick a 4-bit version that fits, copying its exact name. For a back-and-forth chat use `mlx_lm.chat --model ...`, and for a local server that programs can call (Module 11):

```
mlx_lm.server --model mlx-community/<model-name> --port 8080
```

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** what a Mac can run is set by about three quarters of its memory; how fast is set by its memory bandwidth.

**Equation:** largest model ≈ 0.75 × memory; top speed ≈ bandwidth ÷ model size.

```math
S_{\max} \approx 0.75 \times M, \qquad \text{top speed} \approx \frac{B}{S}
```

**Analogy:** a shared kitchen. Everyone cooks from one big fridge, so nobody waits for food to be carried from another room, but the house still keeps a shelf for itself.

**Try it:** a 32 GB Mac with 170 GB/s and a 16 GB model? (Fits: 0.75 × 32 = 24 GB. Top speed about 170 ÷ 16 ≈ 10 tokens per second, before MoE speed-ups.)
</details>

<div class="meaning">

<dl>
<dt>M</dt><dd>the Mac's unified memory in GB</dd>
<dt>S<sub>max</sub></dt><dd>the largest total (model plus conversation) you should plan for, about three quarters of M</dd>
<dt>S</dt><dd>the model file's size in GB</dd>
<dt>B</dt><dd>memory bandwidth: how many GB per second the chip can read</dd>
<dt>Physical meaning</dt><dd>Memory size decides <i>which</i> models a Mac can run; bandwidth decides <i>how fast</i>. Two Macs with the same memory can differ two or three times in speed if their chips read memory at different rates.</dd>
</dl>

</div>

<div class="problem" data-problem="mlx-on-mac-speed"></div>

<div class="myth">

**"A Mac with 64 GB can run a 64 GB model."** macOS needs memory for itself and your apps, and the conversation needs its cache. Plan on three quarters (48 GB), minus room for the context.

</div>

## 4. Worked example

*Made-up numbers.* Lena has a 24 GB MacBook. Three quarters is 18 GB, so a 19 GB model is out and a 7.7 GB 12B model is easy. With MLX it writes about 20 tokens per second; she starts `mlx_lm.server` each morning and points her writing scripts at it.

## 5. Practice

1. Make the virtual environment and install mlx-lm.
2. Run one 4-bit model with `mlx_lm.generate`, then again with Wi-Fi off.
3. What is the largest model file a 48 GB Mac should run?

<details>
<summary>Answers</summary>

1. If `pip` is not found, make sure the environment is active (your prompt shows `(mlx-env)`).
2. The second run works offline because the model is already downloaded.
3. About 0.75 × 48 = 36 GB, minus room for the conversation: a file of about 30 GB.
</details>

**New words:** *unified memory* (one memory pool shared by processor and graphics), *virtual environment* (a private folder of Python packages for one project), *Apple Silicon* (Apple's M-series chips), *memory bandwidth* (how fast memory can be read).

<div class="keypoints">

- MLX is Apple's engine for M-series Macs; `pip install mlx-lm` brings generate, chat and server commands.
- Unified memory lets the graphics side use most of the Mac's memory; plan on about three quarters.
- Top speed ≈ memory bandwidth ÷ model size: half the size, about twice the speed.
- mlx-community on Hugging Face has ready-converted 4-bit models; once downloaded they run offline.

</div>
