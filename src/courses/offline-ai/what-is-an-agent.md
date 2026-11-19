---
title: What an agent is
seoTitle: What an AI agent is, with a local model | Offline AI
summary: An agent is a model that uses tools in a loop until a job is done. Watch the loop, then build a small agent in Python that reads files on your own machine with Gemma 4.
minutes: 30
updated: 2026-11-19
sources:
  - 'Yao et al. (2022), ReAct: Synergizing Reasoning and Acting in Language Models, https://arxiv.org/abs/2210.03629'
  - 'ollama Python library, tool calling, https://github.com/ollama/ollama-python'
quiz:
  - q: What turns a chat model into an agent?
    choices: ['A bigger model', 'A loop where the model can call tools, see the results and decide the next step', 'An internet connection']
    ans: 1
    why: The loop is the agent. The model picks a tool, your code runs it, the result goes back, and the model decides again until it is done.
  - q: Why does the agent loop have a step limit?
    choices: ['To stop a confused model from looping forever', 'Ollama only allows 8 steps', 'To save disk space']
    ans: 0
    why: Small models sometimes repeat the same call. A step limit guarantees the script ends.
  - q: A tool raises an error. What does the script do?
    choices: ['Crashes', 'Sends the error text back to the model so it can try something else', 'Deletes the file']
    ans: 1
    why: Returning the error as the tool result lets the model correct itself, for example by trying a different file name.
---

**Module 13 · about 30 minutes · read first: 11.3.** You'll be able to explain the agent loop and run a small file-reading agent on your own machine.

## 1. Why this matters

Chat answers one question. Agents do jobs: "go through this folder and tell me which invoices are overdue". The same pattern powers coding assistants, research helpers and report bots. With a local model it runs on your files, with no usage limit and nothing uploaded.

## 2. The loop

An **agent** is a model plus tools plus a loop:

1. **Think:** the model reads the task and everything so far.
2. **Act:** it asks for a tool, with arguments (`read_file("invoices/march.txt")`).
3. **Observe:** your code runs the tool and puts the result into the conversation.
4. **Repeat** until the model replies with plain text instead of a tool call: that is the final answer.

<!--fig:agent-loop-->

You met one round of this in Lesson 11.3. An agent simply keeps going.

## 3. A small agent in Python

Make a folder `agent`, and inside it a folder `workspace` with a few text files. Save as `agent.py`:

```python
import pathlib

import ollama

MODEL = "gemma4:12b"
ROOT = pathlib.Path("workspace").resolve()  # the only folder the agent may touch


def inside(path):
    p = (ROOT / path).resolve()
    if not p.is_relative_to(ROOT):
        raise ValueError("that path is outside the workspace")
    return p


def list_files(folder: str = ".") -> str:
    """List the files in a folder of the workspace.

    Args:
      folder: folder path inside the workspace, "." for the top
    """
    return "\n".join(sorted(x.name for x in inside(folder).iterdir())) or "(empty)"


def read_file(path: str) -> str:
    """Read a text file in the workspace (first 4,000 characters).

    Args:
      path: file path inside the workspace
    """
    return inside(path).read_text(encoding="utf-8", errors="ignore")[:4000]


TOOLS = {f.__name__: f for f in (list_files, read_file)}


def run(task, max_steps=8):
    messages = [
        {"role": "system", "content": "You are a careful assistant. Use the tools to do the task. "
                                      "When you are done, reply with a short report."},
        {"role": "user", "content": task},
    ]
    for step in range(1, max_steps + 1):
        reply = ollama.chat(model=MODEL, messages=messages, tools=list(TOOLS.values()),
                            options={"temperature": 0})
        messages.append(reply["message"])
        calls = reply["message"].get("tool_calls") or []
        if not calls:                      # no tool asked for: this is the final answer
            return reply["message"]["content"]
        for call in calls:
            name, args = call["function"]["name"], call["function"]["arguments"]
            print(f"step {step}: {name}({args})")
            try:
                result = TOOLS[name](**args) if name in TOOLS else f"there is no tool called {name}"
            except Exception as err:       # tell the model what went wrong instead of crashing
                result = f"error: {err}"
            messages.append({"role": "tool", "content": str(result), "tool_name": name})
    return "Stopped after the step limit."


if __name__ == "__main__":
    print(run(input("Task: ")))
```

Run `python agent.py` and type a task such as "Which files mention a deadline? Give the dates." You will see each step printed, then the report. The `inside` check means even a confused model cannot read files outside `workspace` (Lesson 13.8 adds more guard rails).

**Which model?** Tool use needs a model trained for it. Gemma 4 12B and up, Qwen3.8-27B and gpt-oss handle multi-step tool use well; E2B and E4B work for one or two steps but lose track on longer jobs.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** an agent repeats think, act, observe; every step adds tokens to the context, so long jobs get slower and can overflow it.

**Equation:** context after n steps ≈ task + Σ (model's call + tool result). With 4,000-character file reads (about 1,000 tokens each), 6 steps ≈ 6,000+ tokens.

**Analogy:** a detective with a notebook. Each clue (tool result) is written in; each decision reads the whole notebook again. Where it breaks: the notebook has a fixed number of pages (the context window). Long jobs need tools that return short results, or a step that summarises the notebook.

**Try it:** your context is 8,192 tokens and each step adds about 1,200. How many steps fit after a 500-token task? ((8,192 − 500) ÷ 1,200 ≈ 6.)
</details>

## 4. Worked example

*Made-up numbers.* A freelance designer has 40 client briefs in `workspace`. Task: "List clients whose brief mentions a deadline in December." Gemma 4 12B on a 16 GB graphics card takes 9 steps (one list, eight reads; it reads only files whose names look like briefs) and 70 seconds, and returns five names with dates. A cloud agent would have needed every brief uploaded.

## 5. Practice

1. Run the agent with the task "How many files are in the workspace?". How many steps does it take?
2. Ask it to read `../secret.txt`. What happens, and why?
3. Add a tool `count_words(path)` and ask "Which file is longest?".

<details>
<summary>Answers</summary>

1. One tool call (`list_files`) and then the answer: two rounds of the loop.
2. `inside` raises an error, the model sees "that path is outside the workspace", and usually reports it cannot read the file.
3. Write it like `read_file` with a docstring, return `len(inside(path).read_text(...).split())`, and add it to the tuple in `TOOLS`.
</details>

**New words:** *agent* (a model using tools in a loop), *tool* (a function the model may ask to run), *step limit* (the most rounds the loop may run), *ReAct* (the reason-then-act pattern most agents follow).
