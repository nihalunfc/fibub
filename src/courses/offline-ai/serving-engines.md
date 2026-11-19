---
title: Serving engines built for many users
summary: Ollama, LM Studio, llama.cpp's server, vLLM and SGLang compared, with what each is good at and a starting command for each.
minutes: 25
updated: 2026-11-19
sources:
  - 'vLLM documentation: OpenAI-compatible server and supported hardware (official page), https://docs.vllm.ai'
  - 'SGLang documentation (official page), https://docs.sglang.ai'
  - 'llama.cpp server README: --parallel, --cont-batching, --metrics (official page), https://github.com/ggml-org/llama.cpp/tree/master/tools/server'
  - 'Ollama FAQ: concurrency settings (official page), https://docs.ollama.com/faq'
quiz:
  - q: You have one Mac mini and five colleagues. Which engine is the sensible first choice?
    choices: ['Ollama or LM Studio, with a few parallel requests', 'vLLM on a cluster', 'Training your own model']
    ans: 0
    why: For a handful of people on a Mac, the simple engines are enough. vLLM shines on NVIDIA servers with many users.
  - q: What do all these engines have in common that makes switching between them easy?
    choices: ['They all speak the OpenAI-style API', 'They all use the same file format', 'They all need the internet']
    ans: 0
    why: Your scripts and chat front end (Lesson 11.1) keep working; only the address and model name change.
  - q: Which file format does vLLM usually load?
    choices: ['Hugging Face safetensors folders (and quantised versions such as AWQ or GPTQ)', 'Only GGUF', 'MP3']
    ans: 0
    why: vLLM is built around Hugging Face model folders; GGUF support exists but is not its main path. llama.cpp and Ollama use GGUF.
---

**Module 15 · about 25 minutes · read first: 15.1 and 7.5.** You'll be able to choose a serving engine for your group and start it with one command.

## 1. Why this matters

The engine is the program that loads the model and answers requests. On a laptop, any engine will do. With many users, the engine decides how many people you can serve on the same hardware, sometimes by a factor of five or more.

## 2. The five engines, side by side

| Engine | Best for | Runs on | Model files | Batching |
|---|---|---|---|---|
| **LM Studio** | One person, or a few, with a friendly app | Windows, Mac, Linux | GGUF, MLX on Mac | Basic |
| **Ollama** | Simple shared server, small teams | Windows, Mac, Linux | GGUF (its own library) | A few parallel requests |
| **llama.cpp `llama-server`** | Full control, any hardware, small to medium teams | Almost anything, including CPU only | GGUF | Continuous, set slots with `-np` |
| **vLLM** | Many users on NVIDIA (and some AMD) cards | Linux servers | Hugging Face folders, AWQ, GPTQ, FP8 | Continuous, PagedAttention |
| **SGLang** | Many users, agents and chat with shared prompts | Linux servers | Hugging Face folders | Continuous, shares repeated prompt starts |

All five offer the OpenAI-style API from Lesson 11.1, so you can start simple and move up without rewriting anything.

## 3. Starting each one

The model names below are examples; use the ones you picked in Module 7.

```bash
# Ollama: allow 4 requests at once, listen on the network
OLLAMA_NUM_PARALLEL=4 OLLAMA_HOST=0.0.0.0 ollama serve

# llama.cpp: 4 slots sharing a 32,768-token context, metrics on
llama-server -m gemma-4-12b-Q4_K_M.gguf -c 32768 -np 4 --host 0.0.0.0 --port 8080 --metrics

# vLLM (Linux, NVIDIA): the model's name exactly as on its Hugging Face page, or a local folder
vllm serve <model-name-or-folder> --max-model-len 16384

# SGLang (Linux, NVIDIA)
python -m sglang.launch_server --model-path <model-name-or-folder> --port 30000
```

Each prints the address it is listening on. Point Open WebUI (Lesson 9.5) or your scripts at it.

## 4. Choosing

- **Up to about 10 light users, or a Mac:** Ollama or LM Studio. Least setup, good enough.
- **10 to 50 users, or agents that send many requests, on any hardware:** `llama-server` with 4 to 16 slots.
- **50 or more users, or heavy agents, on NVIDIA Linux servers:** vLLM or SGLang. They are harder to set up (drivers, Python environments, matching CUDA versions) but serve several times more people from the same card.

The memory rule from Module 4 still holds: the model plus every user's KV cache must fit. vLLM grabs most of the card's memory at start (about 90% by default) and hands it out as KV cache pages; that is normal.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** memory left after the weights decides how many conversations fit at once.

**Equation:** conversations at once ≈ (card memory − weights − working space) ÷ (KV cache per token × tokens per conversation).

**Analogy:** a restaurant: the kitchen is the model, the tables are KV cache. A bigger kitchen does not seat more guests; more floor space does.

**Try it:** 32 GB card, 8 GB weights, 2 GB working space, 0.125 MB per token (Lesson 8.4's 8B example), 8,192 tokens per chat? (22 GB ÷ (0.125 MB × 8,192 = 1 GB) = 22 conversations at full length.)
</details>

## 5. Worked example

*Made-up numbers.* A college computer lab has a Linux server with two 32 GB cards and 60 students. They first try Ollama: at the start of class, answers take a minute to begin. They switch to vLLM with the same 12B model and see the first token in under 2 seconds for most students, because vLLM keeps 30 or more conversations in one batch.

## 6. Practice

1. Which engine would you pick for a 3-person office with a Mac Studio, and why?
2. What does `-np 4` with `-c 16384` give each user in `llama-server`?
3. Why can you change engines without changing your Python scripts?

<details>
<summary>Answers</summary>

1. Ollama or LM Studio: few users, a Mac (vLLM targets Linux GPU servers), least setup.
2. Four slots of 4,096 tokens each.
3. They all serve the same OpenAI-style API; only the base address and the model name change (Lesson 11.4).
</details>

**New words:** *serving engine*, *slot*, *PagedAttention*, *safetensors*, *AWQ and GPTQ* (quantised formats used by vLLM).
