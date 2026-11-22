---
title: Letting a local model use tools safely
seoTitle: Safe tool calling with local AI models | Offline AI
summary: Give your agent tools that change things, such as writing files, querying a database or running code, with a yes or no from you before each risky step. Design tools a small model uses well.
minutes: 30
updated: 2026-11-22
sources:
  - 'ollama Python library, tool calling, https://github.com/ollama/ollama-python'
  - 'Python sqlite3, read-only connections with URI mode, https://docs.python.org/3/library/sqlite3.html'
  - 'OWASP Top 10 for LLM Applications (excessive agency), https://genai.owasp.org/llm-top-10/'
quiz:
  - q: Which tool is safest to give an agent?
    choices: ['run_shell(command)', 'query_sales(sql) on a read-only database connection', 'delete_file(path)']
    ans: 1
    why: A read-only connection cannot change anything, whatever SQL the model writes. Shell and delete tools can do damage.
  - q: Why are small, specific tools better than one general tool for small models?
    choices: ['Fewer, clearer choices mean fewer wrong calls', 'General tools are illegal', 'They use less disk']
    ans: 0
    why: A tool called "add_expense(date, amount, note)" is hard to misuse. "run_python(code)" asks a small model to write correct code every time.
  - q: Where should the yes or no check for a risky tool go?
    choices: ['In the prompt, asking the model to be careful', 'In your Python code, before the action runs', 'Nowhere, models are careful']
    ans: 1
    why: Prompts can be ignored or overridden. A check in your code always runs, whatever the model says.
---

**Module 13 · about 30 minutes · read first: 13.1.** You'll be able to add tools that change things, behind an approval step, and design tools a small model rarely misuses.

<div class="bigidea">What an agent can break is set by the tools your code hands it and the checks your code runs, not by what the prompt asks it to do.</div>

## 1. Why this matters

Reading a file is harmless. Writing, deleting, sending and running code are not. A useful agent and a dangerous one can use the same model; the difference is the set of tools you hand it and the checks in your code.

## 2. Three kinds of tools

| Kind | Examples | Rule |
|---|---|---|
| **Read** | list files, read a file, search your index (Module 12), read-only SQL | Allow freely, inside a folder you choose |
| **Write** | save a file, add a row, move a file | Ask a human first, or only allow new files in an output folder |
| **Run or send** | shell commands, running code, sending email | Avoid. If you must, ask every time and run in a sandbox (Lesson 13.8) |

Try it: set temperature to 0.3, then 1.8, then cut the list with top-k and top-p, and press Draw 200 each time.

<figure class="fig" data-fig="@ai-sampling-topp"><figcaption>Temperature reshapes the odds; top-k and top-p remove the unlikely tail before choosing. Low settings give safe, repeatable text; high settings give variety and more risk of nonsense.</figcaption></figure>

## 3. A write tool with approval

Add this to `agent.py` from Lesson 13.1 and include it in `TOOLS`:

```python
def write_file(path: str, text: str) -> str:
    """Save text to a new file in the workspace. The user must approve.

    Args:
      path: new file path inside the workspace
      text: the full text to save
    """
    p = inside(path)
    if p.exists():
        return "refused: that file already exists; choose a new name"
    print(f"\n--- The agent wants to create {p.name} ---\n{text[:500]}\n---")
    if input("Allow? [y/N] ").strip().lower() != "y":
        return "refused by the user"
    p.write_text(text, encoding="utf-8")
    return f"saved {p.name}"
```

The model never touches the disk itself. Your code checks the path, refuses to overwrite, shows you the text, and only then writes. Here is one request travelling through it:

<div class="steps">
<div class="step"><p><b>The model asks.</b> It replies with a tool call: <code>write_file("summary.md", "Three clients have December deadlines...")</code>. Nothing has happened yet; this is just text.</p></div>
<div class="step"><p><b>Fence check.</b> <code>inside("summary.md")</code> makes sure the path is in the workspace. A path like <code>../notes.txt</code> stops here with an error.</p></div>
<div class="step"><p><b>No overwriting.</b> If <code>summary.md</code> already exists, the tool returns "refused: that file already exists; choose a new name" and the model can pick another name.</p></div>
<div class="step"><p><b>You decide.</b> The first 500 characters are printed and the script waits for you. Anything except "y" means no.</p></div>
<div class="step"><p><b>The result goes back.</b> "saved summary.md" or "refused by the user" is added to the conversation, and the model plans its next turn from there.</p></div>
</div>

## 4. A database tool that cannot do harm

Open the database **read-only**, so even a badly written query cannot change it:

```python
import sqlite3

def query_sales(sql: str) -> str:
    """Run one SELECT query on the sales database (table sales: date, product, region, amount).

    Args:
      sql: a single SQLite SELECT statement
    """
    con = sqlite3.connect("file:sales.db?mode=ro", uri=True)
    try:
        rows = con.execute(sql).fetchmany(50)
    finally:
        con.close()
    return "\n".join(map(str, rows)) or "(no rows)"
```

Note the docstring: it names the table and its columns, which saves the model a step and prevents guessed column names. This is how agents answer number questions that RAG cannot (Lesson 12.6).

## 5. Designing tools for small models

- **Few tools:** 3 to 6 per agent. Each extra tool is one more chance to pick wrongly.
- **Specific names and arguments:** `add_expense(date, amount, note)` beats `run_python(code)`.
- **Clear docstrings:** the engine sends them to the model as the tool description.
- **Short results:** cut long outputs (the `[:4000]` and `fetchmany(50)` above) to protect the context window.
- **Helpful errors:** "refused: that file already exists; choose a new name" tells the model what to do next.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the damage an agent can do is bounded by its most powerful tool, not by its instructions.

**Equation:** worst case = max over tools of (what that tool can change) × (chance a check fails). A read-only tool has zero on the first factor; an approval step pushes the second towards zero.

**Analogy:** handing a new temp worker keys. You give the key to the supply cupboard, not the safe, however trustworthy they seem, and you sign off on any purchase. Where it breaks: approvals only help if you actually read them; after fifty "y" presses, people stop reading (Lesson 13.8).

**Try it:** an agent has list_files, read_file and write_file-with-approval. Which tool sets its worst case? (write_file, and only if you approve something you did not read.)
</details>

<div class="meaning">

<dl>
<dt>read tool</dt><dd>a tool that can only look (list, read, search, a read-only database query); the worst it can do is waste time</dd>
<dt>write tool</dt><dd>a tool that changes something; it sits behind a check in your code, such as an approval</dd>
<dt>worst case</dt><dd>the most harmful tool you gave the agent, times the chance that its check fails</dd>
<dt>approval step</dt><dd>your code stops and asks a person before the action runs</dd>
<dt>Physical meaning</dt><dd>Giving an agent tools is like giving a new temp worker keys. The supply cupboard key (read tools) is fine. The safe key (delete, shell, email) is not, however polite they seem. And a signature on every purchase only helps if you read what you sign, so keep approvals few.</dd>
</dl>

</div>

<div class="problem" data-problem="local-tool-calling-approvals"></div>

<div class="myth">

**"I told the model never to delete anything, so it won't."** A prompt is a request, not a lock. Models misread tasks, and text inside a file can talk them out of their instructions (Lesson 13.8). Only your code is sure to run: if there is no delete tool, nothing can be deleted.

</div>

## 6. Worked example

*Made-up numbers.* A shop owner gives an agent `query_sales` (read-only) and `write_file` (approval). Task: "Write a one-page summary of October sales by region." The agent runs three SELECT queries, drafts the summary and asks to create `october-summary.md`. The owner reads the draft, presses y, and has the report in two minutes. The sales database could not have been changed whatever the model wrote.

## 7. Practice

1. Add `write_file` to your agent and ask it to save a summary of the workspace. Refuse the first time and see what it does.
2. Make a tiny `sales.db` with a few rows and try `query_sales` with the task "Which region sold most?".
3. Ask the agent to "delete all the rows in sales". What stops it?

<details>
<summary>Answers</summary>

1. After "refused by the user", a good model asks what to change or reports that it could not save.
2. `sqlite3 sales.db "CREATE TABLE sales(date, product, region, amount); INSERT INTO sales VALUES ('2026-10-01','pen','North',12);"` (add a few rows), then run the agent.
3. The read-only connection: SQLite refuses with "attempt to write a readonly database", and the error goes back to the model.
</details>

**New words:** *read-only* (can look but not change), *approval step* or *human in the loop* (a person confirms before an action), *excessive agency* (giving an AI more power than the job needs).

<div class="keypoints">

- Sort tools into read (allow freely), write (ask first) and run or send (avoid, or sandbox and ask every time).
- The model only asks; your code checks the path, refuses overwrites and waits for a "y" before anything changes.
- A read-only database connection cannot be harmed by any query the model writes.
- Small models do best with 3 to 6 specific tools, clear docstrings, short results and helpful error messages.
- Keep approvals rare so each one is actually read.

</div>
