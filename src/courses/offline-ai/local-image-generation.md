---
title: Making images offline
seoTitle: Make AI images offline with diffusion | Offline AI
summary: How diffusion models turn noise into pictures, which open image models run on home hardware, how much memory they need, and the licence rules to check before using images at work.
minutes: 25
updated: 2026-11-22
sources:
  - 'Ho, Jain and Abbeel (2020), Denoising Diffusion Probabilistic Models, https://arxiv.org/abs/2006.11239'
  - 'Hugging Face diffusers library, https://huggingface.co/docs/diffusers'
  - 'ComfyUI (GPL-3.0), https://github.com/comfyanonymous/ComfyUI'
  - 'FLUX.1 [schnell] model card and licence (Apache 2.0), https://huggingface.co/black-forest-labs/FLUX.1-schnell'
quiz:
  - q: How does a diffusion model make a picture?
    choices: ['It copies a stored image', 'It starts from random noise and removes noise step by step, guided by your text', 'It draws lines one at a time']
    ans: 1
    why: The model learned to predict and remove noise. Starting from pure noise and repeating that, guided by the prompt, a picture appears.
  - q: Why do fewer steps make an image faster?
    choices: ['Each step is one full pass through the model', 'Fewer steps use less disk', 'Steps are only for colour']
    ans: 0
    why: Every step runs the whole network once. 4 steps instead of 30 is roughly 7 times faster, which is what "turbo" and "schnell" models are trained for.
  - q: A model is published under a non-commercial licence. Can you use its images on a client's website?
    choices: ['Yes, images are always free', 'No, not without a commercial licence', 'Only if you edit them']
    ans: 1
    why: The licence covers how you may use the model and its output. Non-commercial means no paid or business use.
---

**Module 13 · about 25 minutes · read first: 7.2.** You'll be able to explain diffusion, choose an image model for your hardware, and check its licence.

<div class="bigidea">An image model starts from random static and cleans a little of it away at each step, steered by your words, so the wait is the number of steps times the time for one step.</div>

## 1. Why this matters

Image tools are useful for slides, mock-ups, product ideas and teaching material. Running them locally means no per-image fees, no queue, and no uploading of the reference photos you work from. It is a different kind of model from the chat models in this course, so this lesson is a short tour, not a full course.

## 2. How diffusion works

Think of an old TV showing pure static, and a restorer who has cleaned millions of fuzzy photos. Show them static and say "a lighthouse at dawn", and they wipe away a little fuzz in a way that looks a bit more like a lighthouse. Repeat, and a picture appears.

That is a **diffusion model**. In training it took millions of pictures, added random noise in stages, and learned to predict the noise so it could be removed. To make a new picture, it starts from pure noise and removes a little at a time, 4 to 50 **steps**, steering each step towards your text prompt. Each step is one full pass through the network, so steps × time per step = waiting time.

<div class="steps" data-fig="local-image-generation-denoise">
<div class="step"><p><b>Step 0: pure noise.</b> A random field of coloured dots, made from the <b>seed</b> number. Same seed, same starting noise.</p></div>
<div class="step"><p><b>Early steps.</b> The model predicts which part of the image is noise and removes some of it, nudged by "a lighthouse at dawn". Only big shapes show: light sky above, dark sea below.</p></div>
<div class="step"><p><b>Middle steps.</b> The sun and the tower appear. Each step is one full pass through the network, about 0.4 seconds on a mid-range graphics card.</p></div>
<div class="step"><p><b>Late steps.</b> Small changes now: edges sharpen and colours settle. More steps here add little.</p></div>
<div class="step"><p><b>Done.</b> 30 steps × 0.4 s = 12 seconds. A "turbo" or "schnell" model trained for 4 steps takes 4 × 0.4 = 1.6 seconds.</p></div>
</div>

## 3. Models and memory

| Model family | Memory (graphics card) | Licence to check |
|---|---|---|
| Stable Diffusion 1.5 | about 4 GB | Open RAIL-M (use rules attached) |
| SDXL and SDXL-Turbo | 8 GB or more | SDXL: Open RAIL++; Turbo: non-commercial |
| FLUX.1 [schnell] | 12 to 24 GB (less when quantised) | Apache 2.0 |
| FLUX.1 [dev] | 12 to 24 GB | Non-commercial |
| Stable Diffusion 3.5 | 10 GB or more | Community licence; free below a revenue limit |

Image models are far more demanding on a graphics card than on a CPU; on a laptop without one, expect minutes per image. Apple Silicon Macs run them well through apps like Draw Things.

## 4. Ways to run them

- **ComfyUI:** a free node-based app that runs on Windows, Mac and Linux, the most flexible choice.
- **Draw Things** (Mac, iPhone, iPad): simple, fully on-device.
- **Python with diffusers**, for scripts:

```python
import torch
from diffusers import AutoPipelineForText2Image   # pip install diffusers transformers accelerate torch

pipe = AutoPipelineForText2Image.from_pretrained(
    "stabilityai/sdxl-turbo", torch_dtype=torch.float16, variant="fp16"
).to("cuda")      # "mps" on a Mac
image = pipe("a watercolour of a lighthouse at dawn", num_inference_steps=1, guidance_scale=0.0).images[0]
image.save("lighthouse.png")
```

The first run downloads the model (several GB); after that it works offline. SDXL-Turbo is non-commercial, so use it for learning and personal work only.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** generation time is steps × time per step; image quality rises with steps up to a point, then flattens.

**Equation:** each step computes xₜ₋₁ = xₜ − (predicted noise at step t), scaled by the noise schedule. Total time ≈ steps × one forward pass.

**Analogy:** a sculptor removing marble. Each pass takes away some stone that is "not the statue". A few big passes give a rough figure; many small passes give detail. Turbo models learned to take a few very confident passes. Where it breaks: too few steps on a model not trained for it gives blurry or broken images.

**Try it:** one step takes 0.4 s. How long do 30 steps take, and 4 steps? (12 s and 1.6 s.)
</details>

<div class="meaning">

<dl>
<dt>xₜ</dt><dd>the picture at step t, still partly noise (t counts down to 0)</dd>
<dt>predicted noise</dt><dd>the model's guess of which part of the picture is static, steered by your prompt</dd>
<dt>steps</dt><dd>how many clean-up passes the model makes; each is one full run of the network</dd>
<dt>seed</dt><dd>the number that fixes the starting noise, so the same seed and settings give the same picture</dd>
<dt>Physical meaning</dt><dd>A sculptor taking away stone that is "not the statue". A few big passes give a rough figure; many small passes give detail, but each pass costs the same time. Turbo models learned to make a few very confident passes, which is why they are so much faster.</dd>
</dl>

</div>

<div class="problem" data-problem="local-image-generation-time"></div>

<div class="myth">

**"The model glues together pictures it has stored."** It keeps no library of images, only learned numbers (weights) that predict noise. Each picture is built fresh from random noise. That said, models can sometimes produce something very close to a famous picture seen many times in training, which is one more reason to check the licence and use care with brands and real people.

</div>

## 5. Worked example

*Made-up numbers.* A teacher makes 40 illustrations for worksheets with FLUX.1 [schnell] (Apache 2.0) in ComfyUI on a 16 GB graphics card, using a quantised version: about 8 seconds per image at 4 steps. Total cost: electricity, about 15 minutes of GPU time. Because the licence allows commercial use, the worksheets can also go in a paid workbook.

## 6. Practice

1. Find the licence for one image model on its model page. Does it allow commercial use?
2. Your card has 8 GB. Which families in the table can you try?
3. Why do the same prompt and settings give a different image each time, and how do you repeat one?

<details>
<summary>Answers</summary>

1. Look for the licence field on the model page, then read the "use" and "output" sections.
2. Stable Diffusion 1.5 and SDXL; FLUX only in a quantised form and slowly.
3. The starting noise is random. Fix the random **seed** (a `generator` with a set seed in diffusers, or the seed box in ComfyUI) to repeat it.
</details>

**New words:** *diffusion model* (makes images by removing noise step by step), *steps* (number of denoising passes), *seed* (the number that fixes the starting noise), *guidance* (how strongly the prompt steers each step).

<div class="keypoints">

- A diffusion model starts from random noise and removes some at each step, steered by your prompt.
- Wait per image ≈ steps × time per step; turbo and schnell models are trained to need only 1 to 4 steps.
- Memory decides what you can run: about 4 GB for Stable Diffusion 1.5, 12 to 24 GB for FLUX (less when quantised).
- ComfyUI, Draw Things and Python with diffusers all run fully offline after the first download.
- Always read the licence: some models (FLUX.1 [schnell]) allow commercial use, others (SDXL-Turbo, FLUX.1 [dev]) do not.

</div>
