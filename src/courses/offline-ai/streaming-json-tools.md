---
title: Streaming, JSON output and tool calling
summary: Show answers as they are written, get clean JSON fields your code can use, and let the model call your own Python functions, all on your machine.
minutes: 30
updated: 2026-11-18
sources:
  - 'ollama Python library: streaming, structured outputs and tools, https://github.com/ollama/ollama-python'
  - 'Pydantic (data models for Python), https://docs.pydantic.dev'
quiz:
  - q: Why ask for JSON with a schema instead of asking politely for JSON in the prompt?
    choices: ['It is shorter to type', 'The engine forces the output to match the fields, so your code never has to guess', 'It makes the model faster']
    ans: 1
    why: With a schema, the engine only allows text that fits the structure, so fields come back with the right names and types.
  - q: In tool calling, who actually runs the function?
    choices: ['The model', 'Your Python script', 'The internet']
    ans: 1
    why: The model only asks for a call by name with arguments. Your script decides whether to run it and sends the result back.
  - q: What does streaming change?
    choices: ['The answer quality', 'You see words as they are written instead of waiting for the whole answer', 'The number of tokens']
    ans: 1
    why: Streaming sends each piece as soon as it is ready. The total time and the answer are the same; it just feels faster.
---

**Module 11 · about 30 minutes · read first: 11.2.** You'll be able to stream answers, get structured JSON back, and let the model call your own functions.

## 1. Why this matters

The folder script in 11.2 returns free text. Real workflows need more: a progress display while long answers are written, fields you can put straight into a spreadsheet column, and a model that can ask your code to look something up. These three features are what make a pipeline dependable.

## 2. Streaming

```python
import ollama

for chunk in ollama.chat(
    model="gemma4:e4b",
    messages=[{"role": "user", "content": "Explain what a context window is."}],
    stream=True,
):
    print(chunk["message"]["content"], end="", flush=True)
print()
```

## 3. JSON you can rely on

Describe the fields with **Pydantic** (installed with the ollama library) and pass the schema as `format`. The engine then only produces text that fits it.

```python
from pydantic import BaseModel
import ollama

class Note(BaseModel):
    summary: str
    action_needed: bool
    keywords: list[str]

email = "Hi team, the client moved the launch to 3 March. Please update the plan by Friday. Thanks, Sara"

reply = ollama.chat(
    model="gemma4:e4b",
    messages=[{"role": "user", "content": "Read this email and fill in the fields.\n\n" + email}],
    format=Note.model_json_schema(),
    options={"temperature": 0},
)
note = Note.model_validate_json(reply["message"]["content"])
print(note.summary, note.action_needed, note.keywords)
```

Swap this into the folder script from 11.2 and each field becomes its own spreadsheet column.

## 4. Tool calling

Give the model a list of your functions. When it decides one would help, it replies with the function's name and arguments instead of text. Your script runs it and sends the result back; the model then writes the final answer.

```python
import ollama

def word_count(text: str) -> int:
    """Count the words in a piece of text.

    Args:
      text: the text to count
    """
    return len(text.split())

TOOLS = {"word_count": word_count}
messages = [{"role": "user", "content": "How many words are in: 'one two three'? Use the tool."}]

reply = ollama.chat(model="gemma4:e4b", messages=messages, tools=[word_count])
calls = reply["message"].get("tool_calls") or []
if calls:
    messages.append(reply["message"])
    for call in calls:
        name, args = call["function"]["name"], call["function"]["arguments"]
        result = TOOLS[name](**args) if name in TOOLS else "unknown tool"
        messages.append({"role": "tool", "content": str(result), "tool_name": name})
    reply = ollama.chat(model="gemma4:e4b", messages=messages)
print(reply["message"]["content"])
```

The model never runs anything itself. Your code decides, which is where you put safety checks (Lesson 13.8). Small models sometimes skip a tool or fill arguments badly; larger ones are more reliable, and Module 13 builds on this.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a schema shrinks the set of allowed next tokens to those that keep the output valid.

**Equation:** allowed tokens at each step = all tokens ∩ tokens that keep the text matching the schema.

**Analogy:** filling in a paper form with boxes. You can still write what you like inside a box, but you cannot write outside it or skip a box.

**Try it:** a field allows only `true` or `false`. How many different values can come back? (2. That is why booleans from a schema need no cleaning.)
</details>

## 5. Worked example

*Made-up numbers.* A clinic manager runs the JSON version over 400 appointment emails. Each comes back as `summary`, `action_needed` and `keywords`. She filters `action_needed = true` in the spreadsheet: 37 emails need a reply today. Nothing left the clinic's laptop.

## 6. Practice

1. Run the streaming example and watch the words appear.
2. Add a field `urgency: int` (1 to 5) to `Note` and run it on three emails.
3. Add a second tool, `today()`, that returns today's date, and ask "What is today's date?".

<details>
<summary>Answers</summary>

1. If nothing prints until the end, check `flush=True` is there.
2. Add `urgency: int` to the class. Say "1 to 5" in the prompt too: the schema fixes the type, the prompt gives the meaning.
3. `def today() -> str: return __import__("datetime").date.today().isoformat()` and add it to both `TOOLS` and `tools=[...]`.
</details>

**New words:** *streaming* (sending an answer piece by piece), *schema* (a description of the fields and their types), *tool calling* or *function calling* (the model asks your code to run a function).
