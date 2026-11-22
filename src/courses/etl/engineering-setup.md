---
title: An engineering setup that survives a real job
summary: 'Set up a Python data project the way working teams do: uv and a lock file, settings outside the code, secrets out of git, logs you can debug from, and tests.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: Where should the mailbox password for a production pipeline live?
    choices: ['In config.py with a comment saying "change me"', 'In an environment variable or a vault, given to the job when it runs', 'In a committed .env file in a private repository']
    ans: 1
    why: Private repositories get cloned, forked and leaked. Secrets come from the environment or a vault, never from the code.
  - q: Why commit the uv.lock file?
    choices: ['So every laptop and the server install exactly the same versions', 'Because uv refuses to run without it', 'It stores your secrets in encrypted form']
    ans: 0
    why: A lock file pins every package, including the packages your packages need. That is half of being able to reproduce a run.
  - q: Which log line helps most at 6 a.m.?
    choices: ['"Error!"', '{"msg":"load failed","source":"qsr","file":"pos_Q207.csv","rows_read":0,"error":"UnicodeDecodeError"}', 'A full stack trace with no context']
    ans: 1
    why: It names the step, the input, the row count and the kind of error, so you can act on it straight away.
sources:
  - 'uv documentation (Astral) https://docs.astral.sh/uv/'
  - 'The Twelve-Factor App: III. Config https://12factor.net/config'
  - 'Python documentation: Logging HOWTO https://docs.python.org/3/howto/logging.html'
  - 'GitHub Docs: Removing sensitive data from a repository https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository'
---

**Module 1 · about 35 minutes · read first: 1.1.** You'll be able to start a Python data project with a lock file, keep passwords out of git, read settings from the environment, write log lines you can search, and run tests and a linter with one command.

<div class="bigidea">A pipeline that only works on your laptop is not a pipeline: pin the versions, keep settings and secrets outside the code, and make every log line say what happened to which file.</div>

## 1. Why this matters

Most "the pipeline broke" mornings are not clever bugs. They are a package that only exists on one laptop, a password typed into the code, a folder path that only exists on one machine, or a log that says `Error` and nothing else. Experienced engineers set these things up on the first day, so you will too.

Think of a good workshop. Every tool has a labelled place (the project layout), the measurements are written down (the lock file), the keys to the van are in a key safe, not taped to the dashboard (secrets), and the job sheet says who did what and when (logs). A new person can walk in and pick up the work.

## 2. A project layout you will reuse

```text
retail-ingest/
├── pyproject.toml        # dependencies and tool settings, in one file
├── uv.lock               # exact versions, committed
├── .env.example          # names of the settings, no values
├── .gitignore            # .env, data/, .venv/
├── README.md
├── src/retail_ingest/
│   ├── __init__.py
│   ├── config.py         # reads settings once, with types
│   ├── log.py            # structured logging
│   └── sources/          # one module per source
├── tests/
└── data/                 # ignored by git: raw/, staging/
```

**uv** is a fast Python project tool from Astral. It creates the virtual environment (a private set of packages for this project), works out which versions fit together, and writes a **lock file** listing the exact version of every package. Plain `pip` with a `requirements.txt` still works; the lock file is the part that matters.

```bash
pip install uv                       # or use the installer at docs.astral.sh/uv
uv init --package retail-ingest && cd retail-ingest
uv add pandas polars duckdb openpyxl pydantic-settings
uv add --dev pytest ruff
uv run pytest
```

Commands and flags change between versions, so if one fails, check the uv docs for the current form.

## 3. Settings and secrets

The rule: **code reads settings; settings live outside the code.** On your laptop that means a `.env` file that git ignores. In production it means environment variables set by the scheduler, or a secrets vault such as Azure Key Vault (Module 4).

```python
# src/retail_ingest/config.py
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_prefix="P2D_")
    data_dir: Path = Path("./data")
    landing_dir: Path = Path("./data/landing")
    imap_host: str = "imap.example.com"
    imap_user: str = ""
    imap_password: str = ""          # never logged, never committed

settings = Settings()
```

`P2D_DATA_DIR=/srv/data` in the environment now changes `settings.data_dir` without touching code. `.env.example` lists the names (`P2D_IMAP_USER=`) with no values, so a teammate knows what to fill in.

## 4. Logs you can debug from

A good log line answers five questions: **which step, on which input, what happened, how many rows, how long.** Write it as JSON (or key=value pairs) so you can search and count it later.

```python
# src/retail_ingest/log.py
import json, logging, sys, time

class JsonFormatter(logging.Formatter):
    def format(self, r):
        base = {"ts": time.strftime("%Y-%m-%dT%H:%M:%S"), "level": r.levelname, "msg": r.getMessage()}
        base.update(getattr(r, "ctx", {}))
        return json.dumps(base)

def get_logger(name="p2d"):
    log = logging.getLogger(name)
    if not log.handlers:
        h = logging.StreamHandler(sys.stdout)
        h.setFormatter(JsonFormatter())
        log.addHandler(h)
        log.setLevel(logging.INFO)
    return log

log = get_logger()
log.info("file landed", extra={"ctx": {"source": "email", "file": "sales_R104.csv", "rows": 812, "sha256": "ab12…"}})
```

Here is what happens when a secret slips into a commit, and why the order of the fix matters:

<div class="steps">
<div class="step"><b>The slip.</b> You commit <code>config.py</code> with <code>imap_password = "Winter2026!"</code> and push it to a shared repository.</div>
<div class="step"><b>Deleting the line is not enough.</b> You remove it in a new commit, but the old commit still holds the password. Anyone can run <code>git log -p</code> and read it.</div>
<div class="step"><b>Rotate first.</b> Change the password at the mailbox right away. Now the leaked one is useless, whatever happens to the history.</div>
<div class="step"><b>Then clean the history</b> with a history-rewriting tool, and tell everyone with a clone to fetch it again. Turn on secret scanning (GitHub push protection, or <code>gitleaks</code> as a pre-commit hook) so the next slip is blocked before it leaves your laptop.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a run can be reproduced only if everything it depends on is written down.

**Equation:**

```math
\text{output} = f(\text{commit}, \text{lock file}, \text{inputs}, \text{config})
```

Leave any one of the four out of your records and the output is no longer fixed: two runs can differ and you will not know why.

**Analogy:** a lab notebook records the equipment, the calibration and the room temperature, not only the result. Where it breaks: hidden inputs such as the clock (`date.today()`) or "yesterday's data" from an API. Make them explicit parameters.

**Try it:** a job loads "yesterday's file" using `date.today() - 1`. What is the hidden input, and the fix? *(The wall clock. Pass the business date in as a parameter; Module 3's partitions do exactly this.)*
</details>

Logs cost space. How much?

<div class="problem" data-problem="engineering-setup-log-size"></div>

<div class="meaning">

<dl>
<dt>Lock file</dt><dd>A list of the exact version of every package, so every machine installs the same thing.</dd>
<dt>Environment variable</dt><dd>A named setting given to a program by the system that runs it, outside the code.</dd>
<dt>Secret</dt><dd>Anything that grants access: passwords, API keys, tokens, private keys.</dd>
<dt>Structured log</dt><dd>A log line with named fields (step, file, rows, error) that a computer can search.</dd>
<dt>Physical meaning</dt><dd>On a team, "it works on my machine" costs hours. A lock file, a <code>.env.example</code>, a one-command setup and a README "first run in five minutes" section are what make other people trust you with production. Reviewers who have run teams notice these files before they read your code.</dd>
</dl>

</div>

<div class="myth">

**"A private repository is a safe place for passwords."** Private repositories get cloned onto laptops, forked, shared with contractors and sometimes made public by mistake. And git never forgets: a password in any old commit is still there. Keep secrets in the environment or a vault, and rotate any that touched git.

</div>

## 5. An AI pair programmer, safely

You can use an AI coding assistant such as Claude Code throughout this course. Give it a short rules file in the repository (Claude Code reads `CLAUDE.md`). The rules that matter most: never print secrets, propose before changing anything shared, and save the evidence (the query and its output) for every claim. Ask it to explain any code it writes, and reject code you cannot explain back. Lesson 2.4 goes deeper, and the [Offline AI course](/learn/courses/offline-ai/) shows how to run models on your own machine.

## 6. Try it

1. Create `retail-ingest` with uv as above. In `pyproject.toml`, set ruff's `line-length = 100` and rules `E, F, I, B, UP` (see the ruff docs for the exact table names).
2. Write `config.py` and `log.py`. Create `.env` and `.env.example`. Check git ignores `.env`: `git check-ignore .env` should print `.env`.
3. Write `tests/test_config.py`: use pytest's `monkeypatch.setenv("P2D_DATA_DIR", "/tmp/x")` and assert `Settings().data_dir` changes.
4. Add a `justfile` or `Makefile` with `setup`, `lint` (`ruff check . && ruff format --check .`) and `test`.
5. Install `pre-commit` with ruff and gitleaks hooks. Try committing a fake key that looks like an AWS key and watch it get blocked.
6. Ask your AI assistant: "Read this repo and list anything that would fail on a fresh machine." Fix what it finds.

Commit locally: `chore: project skeleton with config, logging, tests, pre-commit`.

**What to check:** clone the repository into a new folder, run your `setup` command and then `test`. If anything fails, a teammate would hit it too.

## 7. Practice

1. Your job reads `C:\Users\you\Desktop\exports`. What goes wrong when the server runs it, and what is the fix?
2. A log says `ERROR load failed`. List three fields you would add.
3. A teammate's run gives different numbers from yours on the same input file. Name two things to compare first.

<details>
<summary>Answers</summary>

1. That folder does not exist on the server, and the job runs as a different user. Make the path a setting (`P2D_LANDING_DIR`) and set it per machine.
2. Any three of: source, file name, rows read, error type, run id, business date, how long it took.
3. The commit and the lock file (package versions), then the config. One of the four inputs differs.
</details>

**New words:** *virtual environment*, *lock file*, *environment variable*, *secret*, *rotate*, *structured log*, *linter*, *pre-commit hook*.

<div class="keypoints">

- Use a project tool (uv) and commit the lock file, so every machine installs the same versions.
- Code reads settings; settings and secrets live in the environment or a vault, never in git.
- If a secret is committed, rotate it first, then clean the history.
- Every log line should say which step, which input, what happened, how many rows and how long.

</div>
