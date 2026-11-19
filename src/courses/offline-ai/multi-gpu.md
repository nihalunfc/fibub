---
title: Splitting a model across graphics cards or machines
seoTitle: Split a model across GPUs or machines | Offline AI
summary: When a model is too big for one card, it can be split across two or more cards or even several computers. The two ways to split it, what each costs in speed, and the commands to try.
minutes: 25
updated: 2026-11-19
sources:
  - 'llama.cpp: --split-mode, --tensor-split and the RPC backend (official README), https://github.com/ggml-org/llama.cpp'
  - 'vLLM documentation: distributed inference, --tensor-parallel-size and --pipeline-parallel-size (official page), https://docs.vllm.ai'
  - 'Shoeybi et al., "Megatron-LM: Training Multi-Billion Parameter Language Models Using Model Parallelism" (tensor parallelism), 2019, https://arxiv.org/abs/1909.08053'
  - 'exo: run models across several home devices (project page), https://github.com/exo-explore/exo'
quiz:
  - q: A model is split by layers across two cards. While card 1 works on a token, what does card 2 do?
    choices: ['Waits for card 1 to pass on its result', 'Works on the same token at the same time', 'Switches off']
    ans: 0
    why: Layer splitting (pipeline) runs the cards one after the other for each token. It adds memory, not speed, for one user.
  - q: Why does tensor splitting need a fast link between cards?
    choices: ['Every layer the cards swap partial results', 'It downloads the model again', 'It does not need one']
    ans: 0
    why: Both cards work on every layer and must combine results many times per token, so the link speed matters.
  - q: Two machines on ordinary 1 Gb/s office Ethernet share one model. What should you expect?
    choices: ['It works, but tokens per second fall noticeably', 'Twice the speed', 'It cannot work at all']
    ans: 0
    why: Networks are far slower than memory or PCIe. Splitting across machines lets you run a bigger model, at a speed cost.
---

**Module 15 · about 25 minutes · read first: 4.1, 4.2 and 15.2.** You'll be able to run a model that does not fit on one card, and know what it costs in speed.

## 1. Why this matters

Two used 24 GB cards give 48 GB for less than one 48 GB card. Two Macs can hold a model neither holds alone. Splitting is how hobbyists and small labs run 70B-class dense models, or large mixture-of-experts models, without buying a data-centre server.

## 2. Two ways to split

**By layers (pipeline).** Card 1 holds layers 1 to 40, card 2 holds 41 to 80. For each token, card 1 does its half and passes a small bundle of numbers to card 2. Simple, works over slow links, and the default in llama.cpp. For one user it gives memory, not speed: only one card works at a time.

**By pieces of every layer (tensor parallel).** Each card holds half of every layer and both work on every token together, swapping partial results many times per token. It makes one user faster, because both cards' memory speed is used at once, but it needs a fast link (NVLink, or at least a good PCIe slot each) and matching cards. vLLM and SGLang use this; llama.cpp has a row-split mode.

## 3. Commands

```bash
# llama.cpp: split by layers (default), 60% on card 0 and 40% on card 1
llama-server -m big-model-Q4_K_M.gguf --split-mode layer --tensor-split 3,2 -ngl 99

# vLLM: tensor parallel across 2 cards in one machine
vllm serve <model-name-or-folder> --tensor-parallel-size 2
```

The `--tensor-split` numbers are shares, not gigabytes; give the larger share to the card with more free memory.

## 4. Across machines

- **llama.cpp RPC:** run `rpc-server` on the helper machines and add `--rpc host1:50052,host2:50052` on the main one. Layers are spread over the network.
- **exo:** an open-source project that joins phones, laptops and Macs on the same network into one cluster for a model.
- **MLX distributed:** Apple's MLX can split a model across several Macs, best over Thunderbolt cables.
- **vLLM pipeline parallel:** `--pipeline-parallel-size` across servers, normally over fast data-centre networking.

Network speed is the catch. Memory moves hundreds of gigabytes a second, a PCIe slot tens, office Ethernet about one tenth of one. Layer splitting sends little data per token, so it still works over Ethernet, but each token pays a round trip. Expect a big drop in tokens per second compared with one box that holds everything.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** with a layer split, each card reads only its own share of the weights, but they take turns, so the times add up.

**Equation:** time per token ≈ (GB on card 1 ÷ bandwidth 1) + (GB on card 2 ÷ bandwidth 2) + link delay. With a tensor split, the cards read at the same time: ≈ (total GB ÷ 2) ÷ bandwidth + many small link delays.

**Analogy:** two people reading a book. Layer split: one reads the first half, then hands it over. Tensor split: each reads half of every page at the same time, then they compare notes after every page.

**Try it:** 40 GB model, two cards at 936 GB/s, layer split, no link delay? (20 ÷ 936 + 20 ÷ 936 ≈ 0.043 s per token: about 23 tokens per second at best, the same as one huge card.)
</details>

## 5. Worked example

*Made-up numbers.* A hobbyist has two used 24 GB RTX 3090 cards in one PC. A 70B model at 4-bit is about 40 GB. Split by layers with llama.cpp it runs at around 15 tokens per second, close to what one 48 GB card would give. They also try a second PC over Ethernet with a third card for a bigger model: it loads, but drops to a few tokens per second. They keep the two-card setup for daily work.

## 6. Practice

1. Which split helps a single user go faster, and what does it need?
2. Card 0 has 22 GB free and card 1 has 14 GB free. What `--tensor-split` would you start with?
3. Why is splitting across two laptops over Wi-Fi rarely worth it for daily use?

<details>
<summary>Answers</summary>

1. Tensor parallel; it needs similar cards and a fast link between them.
2. About `11,7` (22 : 14), then adjust if one card runs out of memory.
3. Wi-Fi is far slower and less steady than a cable, and each token waits on it. Fine for an experiment, slow for work.
</details>

**New words:** *pipeline (layer) split*, *tensor parallel*, *NVLink*, *RPC* (one program calling another over the network), *cluster*.
