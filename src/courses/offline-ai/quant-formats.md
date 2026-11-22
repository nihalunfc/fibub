---
title: 'Common formats: Q4_K_M, AWQ, MLX and FP4'
summary: Decode the quantisation names you see on model pages, from GGUF k-quants and i-quants to AWQ, GPTQ, MLX 4-bit and the new FP8 and FP4 formats.
minutes: 20
updated: 2026-11-22
sources:
  - 'llama.cpp quantisation types, project documentation (official page), https://github.com/ggml-org/llama.cpp/tree/master/tools/quantize'
  - 'gpt-oss model card: weights released in MXFP4 (OpenAI, official page), https://huggingface.co/openai/gpt-oss-120b'
  - 'vLLM supported quantisation methods (official page), https://docs.vllm.ai'
  - 'Frantar, E. et al. (2022), GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers https://arxiv.org/abs/2210.17323'
  - 'Lin, J. et al. (2023), AWQ: Activation-aware Weight Quantization for LLM Compression and Acceleration https://arxiv.org/abs/2306.00978'
quiz:
  - q: In Q4_K_M, what does the 4 tell you?
    choices: ['Roughly 4 bits per weight for most weights', 'Version 4 of the model', '4 GB in size']
    ans: 0
    why: Q4 means about 4 bits; K is the k-quant method; M means medium (some important parts kept at higher bits).
  - q: Which formats are mainly for NVIDIA graphics cards with Python serving engines?
    choices: ['AWQ and GPTQ', 'GGUF Q4_K_M', 'MLX 4-bit']
    ans: 0
    why: AWQ and GPTQ are popular with vLLM and similar engines on NVIDIA cards.
  - q: gpt-oss was released in MXFP4. What is that?
    choices: ['A 4-bit floating-point format with shared scales, used for its expert weights', 'A video format', 'A licence']
    ans: 0
    why: MXFP4 stores small floating-point numbers with a scale per block, so the model ships small from day one.
---

**Module 8 · about 20 minutes · read first: 8.1 and 8.2.** You'll be able to read any quant name and know whether it suits your machine.

<div class="bigidea">Every quant name is a recipe for the same idea, small numbers per weight plus a scale per block; the name tells you roughly how many bits, which method, and which engine can read it.</div>

## 1. Why this matters

Model pages list names like Q4_K_M, IQ3_XS, AWQ, GPTQ-Int4, MLX-4bit and FP8. They are different ways of shrinking the same model. Each engine reads only some of them, so reading the name saves a wasted download.

## 2. GGUF names (llama.cpp, Ollama, LM Studio)

- **Q8_0, Q6_K, Q5_K_M, Q4_K_M, Q3_K_M, Q2_K:** the number is the rough bits; **K** means the "k-quant" method, which stores blocks of weights with their own scales; **S, M, L** (small, medium, large) say how many important layers keep extra bits.
- **IQ4_XS, IQ3_M, IQ2_XS:** "i-quants", which pack weights more cleverly. Better quality at very low bits, a little slower on some machines.
- **imatrix:** an importance matrix made from sample text, so the quantiser keeps the most-used weights more precise. Good for 3 bits and below.

### Watch it happen: decoding Q4_K_M

<div class="steps">
<div class="step"><p><b>Q4.</b> "Q" for quantised, "4" for about 4 bits per weight for most of the weights.</p></div>
<div class="step"><p><b>K.</b> The k-quant method: weights go in small blocks and every block keeps its own scale, so a block of tiny weights and a block of big ones are both rounded finely.</p></div>
<div class="step"><p><b>The scale's cost.</b> A block of 32 four-bit weights takes 32 × 4 = 128 bits, plus a 16-bit scale: 144 bits ÷ 32 weights = <b>4.5 bits per weight</b>.</p></div>
<div class="step"><p><b>M.</b> Medium: a few sensitive parts of the model keep 5 or 6 bits. That lifts the average to <b>about 4.8 bits</b>, which is why a 12B Q4_K_M file is about 12 × 4.8 ÷ 8 = 7.2 GB.</p></div>
<div class="step"><p><b>Who reads it.</b> It is a GGUF name, so llama.cpp, Ollama and LM Studio. A vLLM server on an NVIDIA card would want AWQ or GPTQ instead.</p></div>
</div>

Try it: lower the bits to 3 or 2, then compare one scale for everything against one per block of 32.

<figure class="fig" data-fig="@ai-quant-grid"><figcaption>Fewer bits means fewer levels, so every weight is rounded more. One outlier stretches a shared scale and crushes the small weights, which is why formats give each small block its own scale.</figcaption></figure>

## 3. Graphics card formats (vLLM and similar)

- **AWQ** and **GPTQ:** 4-bit methods that use sample data to protect the important weights. Common for serving on NVIDIA cards (Module 15).
- **FP8:** 8-bit floating point; supported by recent NVIDIA cards; near-original quality.
- **FP4 (MXFP4, NVFP4):** 4-bit floating point with shared scales; recent NVIDIA cards run it natively. gpt-oss shipped its expert weights in MXFP4.

**Floating point** means each number stores a tiny exponent as well as its digits, like writing 3 × 10⁻² instead of 0.03. It handles very small and very large weights in the same block better than plain whole numbers do.

## 4. Mac formats

**MLX 4-bit, 6-bit, 8-bit:** quantised for MLX (Lesson 9.4), usually under the `mlx-community` name. LM Studio on a Mac offers them next to GGUF.

| You see | Rough bits | Engine |
|---|---|---|
| Q4_K_M, Q5_K_M, IQ3_M | 4.8, 5.7, 3.7 | llama.cpp, Ollama, LM Studio |
| AWQ, GPTQ-Int4 | about 4 | vLLM and similar, NVIDIA |
| FP8, MXFP4, NVFP4 | 8, about 4 | recent NVIDIA cards |
| MLX 4bit, 8bit | about 4.5, 8.5 | MLX, LM Studio on a Mac |

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** store small numbers per weight plus one scale per block of weights; the scale brings them back to roughly the right size.

**Equation:** bits per weight = bits per number + (bits of the scale ÷ weights per block). A block of 32 four-bit weights with a 16-bit scale: 4 + 16 ÷ 32 = 4.5 bits.

```math
b_{\text{eff}} = b + \frac{s}{k}
```

**Analogy:** a recipe written for 4 people with one line at the top saying "times 3". Short numbers plus one multiplier.

**Try it:** 8-bit numbers in blocks of 32 with a 16-bit scale? (8 + 16 ÷ 32 = 8.5 bits, which is Q8_0.)
</details>

<div class="meaning">

<dl>
<dt>b</dt><dd>bits for each stored number (4 in a 4-bit format)</dd>
<dt>s</dt><dd>bits used by the block's scale, often 16</dd>
<dt>k</dt><dd>how many weights share one scale (the block size), often 32</dd>
<dt>b<sub>eff</sub></dt><dd>the real average bits per weight, the number that sets the file size</dd>
<dt>Physical meaning</dt><dd>The scale is a small overhead (half a bit per weight for blocks of 32) that buys a lot of accuracy, because each block is rounded on its own ruler instead of one ruler for the whole model.</dd>
</dl>

</div>

<div class="problem" data-problem="quant-formats-bpw"></div>

<div class="myth">

**"Q4 means the file is 4 GB" or "version 4 of the model."** The number is bits per weight. A Q4_K_M file of a 31B model is about 19 GB; of a 4B model, about 2.5 GB. The model version is in the model's own name, not the quant name.

</div>

## 5. Worked example

*Made-up numbers.* Sofia wants Qwen3.8-27B on an RTX 3090 (24 GB). For Ollama she picks Q4_K_M GGUF. Later, to serve her team with vLLM, she uses an AWQ 4-bit copy of the same model. Same model, two formats, each for its engine.

## 6. Practice

1. What do the parts of Q5_K_M mean?
2. You need 3-bit to fit. Which GGUF option should you look for?
3. Which formats can LM Studio on a Mac use?

<details>
<summary>Answers</summary>

1. About 5 bits, k-quant method, medium size of extra-precision parts.
2. An i-quant made with an imatrix, such as IQ3_M.
3. MLX and GGUF.
</details>

**New words:** *k-quant*, *i-quant*, *imatrix*, *AWQ*, *GPTQ*, *FP8*, *MXFP4*, *floating point*.

<div class="keypoints">

- In GGUF names the number is rough bits; K is the block method; S, M, L say how much is kept at higher bits.
- i-quants with an imatrix are the best choice at 3 bits and below.
- AWQ, GPTQ, FP8 and FP4 are for graphics-card servers such as vLLM; MLX formats are for Macs.
- Real bits per weight = bits per number + scale bits ÷ block size (4 + 16 ÷ 32 = 4.5).

</div>
