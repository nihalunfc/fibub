---
title: Software and data teams
summary: Developers and data analysts use local models as a private coding assistant, SQL helper and log reader, keeping source code and company data in-house. Includes mini project 8, a local SQL helper.
minutes: 25
updated: 2026-11-22
sources:
  - 'Continue (open-source coding assistant for VS Code and JetBrains that works with Ollama), https://docs.continue.dev'
  - 'Ollama OpenAI-compatible API (official page), https://docs.ollama.com/openai'
  - 'Python sqlite3 module (official documentation), https://docs.python.org/3/library/sqlite3.html'
quiz:
  - q: Why do many companies prefer a local coding assistant?
    choices: ['Source code and data stay inside the company', 'Local models always write better code', 'It removes the need for tests']
    ans: 0
    why: Many policies forbid sending code or customer data to outside services.
  - q: In the SQL helper, why is the database opened read-only?
    choices: ['So a wrong or malicious query can never change or delete data', 'It is faster', 'SQL needs it']
    ans: 0
    why: 'Least power: the model can read, never write (Lesson 13.8).'
  - q: Where does a local model help most in a data team?
    choices: ['Drafting queries, explaining code and summarising logs, checked by a person', 'Running production unattended', 'Replacing the database']
    ans: 0
    why: Drafts and explanations save time; people stay in charge of what runs.
---

**Module 18 · about 25 minutes · read first: 11.2, 13.2 and 13.3.** You'll be able to set up a private coding and data assistant for your team. This includes mini project 8.

<div class="bigidea">A local model can help developers and analysts write code and SQL while the source code and the data itself never leave the company, because the model only needs to see the shape of the data, not the rows.</div>

## 1. Why this sector

Developers and analysts use AI more than almost anyone, and they work with the most sensitive things a company has: its code and its data. Local models give them help without a policy fight, and run as many queries as they like.

## 2. Top uses

1. **Coding assistant** in the editor: autocomplete and chat with a local coder model (Lesson 13.3).
2. **SQL helper:** plain English to SQL against your own **schema** (the list of tables and their columns), explained.
3. **Log and error reading:** paste a stack trace (the list of function calls an error came through) or a log section, get a likely cause.
4. **Documentation:** docstrings, READMEs and change notes from code.
5. **Data cleaning scripts** drafted for a person to review.

## 3. Mini project 8: a local SQL helper

This script sends only the table layout and the question to your local model, then runs the query read-only.

```python
import sqlite3
from openai import OpenAI

client = OpenAI(base_url="http://localhost:11434/v1", api_key="local")
DB = "sales.db"

def schema(db: str) -> str:
    con = sqlite3.connect(f"file:{db}?mode=ro", uri=True)
    rows = con.execute("SELECT sql FROM sqlite_master WHERE type='table'").fetchall()
    con.close()
    return "\n".join(r[0] for r in rows)

def to_sql(question: str) -> str:
    prompt = f"SQLite tables:\n{schema(DB)}\n\nWrite one SQLite SELECT query for: {question}\nReply with the SQL only."
    reply = client.chat.completions.create(model="gemma4:12b", messages=[{"role": "user", "content": prompt}])
    sql = reply.choices[0].message.content.strip().strip("`")
    return sql.removeprefix("sql").strip()

def run(sql: str):
    if not sql.lower().lstrip().startswith(("select", "with")):
        raise ValueError("Only SELECT queries are allowed")
    con = sqlite3.connect(f"file:{DB}?mode=ro", uri=True)   # read-only
    rows = con.execute(sql).fetchmany(50)
    con.close()
    return rows

sql = to_sql("Total sales by region in 2026, largest first")
print(sql)
print(run(sql))
```

Steps: make a small `sales.db` (or use the one from Lesson 13.2), run the script, read the SQL before trusting the numbers, then try five questions of your own and note which ones it gets wrong.

Here is what happens inside one run:

<div class="steps">
<div class="step"><p><b>The question.</b> "Total sales by region in 2026, largest first."</p></div>
<div class="step"><p><b>Only the shape goes in.</b> <code>schema()</code> reads the <code>CREATE TABLE</code> lines: table and column names such as <code>sales(region, amount, sold_on)</code>. Not one customer row is sent to the model.</p></div>
<div class="step"><p><b>The model writes SQL.</b> For example <code>SELECT region, SUM(amount) FROM sales WHERE sold_on LIKE '2026%' GROUP BY region ORDER BY 2 DESC</code>.</p></div>
<div class="step"><p><b>Two locks.</b> <code>run()</code> refuses anything that does not start with SELECT or WITH, and opens the database read-only, so even a bad query cannot change or delete data.</p></div>
<div class="step"><p><b>A person reads it.</b> The SQL is printed before the numbers. You check it does what you asked (the right year, the right total) before you trust the result.</p></div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** send the model the shape of the data, not the data.

**Equation:** tokens sent = schema size + question; rows never leave the database.

**Analogy:** asking a colleague to write a query by showing them the table headings, not the customer list.

**Try it:** a schema of 40 columns is about 600 tokens. What does that mean for privacy? (No customer rows are in the prompt at all; only names of tables and columns.)
</details>

<div class="meaning">

<dl>
<dt>schema</dt><dd>the table and column names: the headings of your spreadsheets, not their contents</dd>
<dt>tokens sent</dt><dd>schema + instructions + question; it grows with the number of columns, never with the number of rows</dd>
<dt>read-only</dt><dd>the database is opened so nothing can be written, changed or deleted</dd>
<dt>Physical meaning</dt><dd>A table with ten rows and a table with ten million rows send the same prompt, because only the headings travel. Privacy and cost both stay flat however big the data grows.</dd>
</dl>

</div>

<div class="problem" data-problem="software-and-data-tokens"></div>

<div class="myth">

**"If the AI's SQL runs without an error, the answer is right."** A query can run perfectly and still answer the wrong question: the wrong year, a missing filter, a join that counts rows twice. Read the SQL before trusting the numbers, and test the helper on questions whose answers you already know.

</div>

## 4. Worked scenario

*Made-up team.* A logistics company's 6-person data team runs a coder model on a shared 24 GB card. Analysts use the SQL helper for first drafts and the editor assistant for Python. Their policy forbids pasting customer data into outside tools, so before this they had no AI help at all; now drafting time on routine reports is down by about a third.

## 5. Practice

1. Run mini project 8 and record which questions it got wrong.
2. Why check that the query starts with SELECT, when the database is already read-only?
3. What could you add so the model sees example rows safely?

<details>
<summary>Answers</summary>

1. Your answer; joins and date handling are common weak spots.
2. Two locks are better than one: if someone later opens the database read-write, the check still stops edits.
3. A few made-up or masked example rows, never real customer data.
</details>

**New words:** *schema*, *read-only*, *coder model*, *stack trace*.

<div class="keypoints">

- Local coding assistants and SQL helpers keep source code and company data inside the company.
- The SQL helper sends only the schema and the question: the prompt grows with columns, never with rows.
- Two locks: allow only SELECT queries, and open the database read-only.
- A query that runs can still be wrong; read the SQL and test on questions you know the answer to.

</div>
