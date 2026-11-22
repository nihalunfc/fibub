---
title: 'Scheduled jobs: summaries and reports overnight'
seoTitle: Run local AI jobs overnight on a schedule | Offline AI
summary: Write a script that summarises the day's new files into a dated report, then have Windows Task Scheduler, cron or launchd run it every night. Includes logging, wake-up and failure checks.
minutes: 30
updated: 2026-11-22
sources:
  - 'Microsoft, schtasks create, https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/schtasks-create'
  - 'crontab(5) manual page, https://man7.org/linux/man-pages/man5/crontab.5.html'
  - 'Apple, Creating launchd jobs, https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPSystemStartup/Chapters/CreatingLaunchdJobs.html'
quiz:
  - q: Why run AI batch jobs at night on your own machine?
    choices: ['The computer is idle, there is no usage limit, and you wake up to the results', 'Models are smarter at night', 'Electricity is always free at night']
    ans: 0
    why: Long jobs do not block your day, and a local model has no daily cap. Some tariffs are also cheaper at night (Lesson 6.2).
  - q: The 6 AM job did not run. What is the most common cause?
    choices: ['The computer was asleep', 'The model expired', 'Cron only runs on weekends']
    ans: 0
    why: Schedulers cannot run jobs on a sleeping machine unless it is set to wake. Check power settings first.
  - q: Why does the script write a log file?
    choices: ['Nobody is watching at 6 AM, so the log is how you find out what went wrong', 'Ollama needs it', 'To make the report longer']
    ans: 0
    why: Unattended jobs fail silently. Redirecting output to a log keeps the error messages for you to read later.
---

**Module 13 · about 30 minutes · read first: 11.3.** You'll be able to run a local AI job every night and find a report waiting each morning. This lesson is **mini project 5: Nightly report bot**.

<div class="bigidea">A scheduled job is a script your computer starts by itself at a set time, so a local model can work through the night and leave a report for the morning.</div>

## 1. Why this matters

The best automation is the kind you forget about. A local model can read yesterday's notes, emails or logs every night, with no usage cap and nothing uploaded, and have a summary ready before you sit down. It is like a night-shift worker who never asks for overtime: you just have to leave the door unlocked (the computer awake) and the instructions on the desk (the script).

## 2. The nightly script

Make a folder `nightly` with a subfolder `inbox` (or point `INBOX` at a folder you already use). Save as `nightly.py`:

```python
import datetime as dt
import pathlib
import time

import ollama
from pydantic import BaseModel

INBOX = pathlib.Path("inbox")
OUT = pathlib.Path("reports")
MODEL = "gemma4:e4b"


class Item(BaseModel):
    summary: str
    action_needed: bool
    deadline: str


OUT.mkdir(exist_ok=True)
since = time.time() - 24 * 3600
lines = []
for f in sorted(INBOX.glob("*.txt")):
    if f.stat().st_mtime < since:
        continue                                  # only files changed in the last 24 hours
    text = f.read_text(encoding="utf-8", errors="ignore")[:12000]
    reply = ollama.chat(
        model=MODEL,
        messages=[{"role": "user", "content": "Summarise this in one sentence, say whether action "
                   "is needed, and give any deadline as YYYY-MM-DD or 'none'.\n\n" + text}],
        format=Item.model_json_schema(),
        options={"temperature": 0},
    )
    item = Item.model_validate_json(reply["message"]["content"])
    flag = "**Action** " if item.action_needed else ""
    lines.append(f"- {flag}{f.name}: {item.summary} (deadline: {item.deadline})")

today = dt.date.today().isoformat()
report = OUT / f"{today}.md"
report.write_text(f"# Overnight report, {today}\n\n" + ("\n".join(lines) or "Nothing new today.") + "\n",
                  encoding="utf-8")
print("wrote", report)
```

Test it by hand first: `python nightly.py`. To read PDFs, Word files and emails too, import `read_any` from Lesson 12.6 and loop over all files instead of `*.txt`.

What happens at 6 AM, with made-up but typical numbers:

<div class="steps">
<div class="step"><p><b>06:00, the scheduler fires.</b> Task Scheduler, cron or launchd starts <code>nightly.py</code> with the Python from your virtual environment. Nobody is watching.</p></div>
<div class="step"><p><b>Pick the files.</b> The script skips anything older than 24 hours. Today 45 new emails are waiting in <code>inbox</code>.</p></div>
<div class="step"><p><b>One file.</b> About 3,000 tokens to read at 300 tokens a second (10 s), then about 60 tokens of JSON to write at 20 a second (3 s): 13 seconds.</p></div>
<div class="step"><p><b>All files.</b> 45 × 13 s = 585 seconds, just under 10 minutes. The job is done by 06:10.</p></div>
<div class="step"><p><b>Report and log.</b> <code>reports/2026-11-20.md</code> is written, and anything the script printed (including errors) is added to <code>nightly.log</code>, so you can see what happened while you slept.</p></div>
</div>

Try it: pick the gaming GPU, then slide the users from 1 to 128 and find where the curves bend.

<figure class="fig" data-fig="@ai-batch-throughput"><figcaption>One token costs one read of the whole model, shared by every user in the batch, so total speed climbs almost for free while each person's speed barely drops. Once arithmetic is the limit, extra users slow everybody.</figcaption></figure>

## 3. Run it every night

Use the full path to the Python inside your virtual environment, so the job finds the libraries.

**Windows (Task Scheduler)**, in Command Prompt:

```
schtasks /create /tn "Nightly AI report" /sc daily /st 06:00 /tr "cmd /c cd /d C:\Users\you\nightly && .venv\Scripts\python.exe nightly.py >> nightly.log 2>&1"
```

In Task Scheduler you can also tick "Wake the computer to run this task" on the Conditions tab.

**Linux and Mac (cron)**: run `crontab -e` and add:

```
0 6 * * * cd $HOME/nightly && .venv/bin/python nightly.py >> nightly.log 2>&1
```

On a Mac, cron skips jobs while asleep; Apple's own scheduler, **launchd**, runs a missed job when the Mac wakes. For a first try, cron with "prevent sleep" set in Energy settings is fine.

Ollama must be running: the desktop app starts it at login on Windows and Mac, and the Linux installer sets it up as a background service.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a scheduled job must finish inside its window; size the batch by measured time per item.

**Equation:** job time ≈ items × (prompt tokens ÷ prefill speed + output tokens ÷ decode speed). Fits if job time < window.

**Analogy:** a night-shift baker. The ovens bake a fixed number of trays an hour; if orders double, either start earlier, buy a bigger oven (a faster GPU or smaller model) or bake fewer trays (summarise only new files). Where it breaks: one huge file can take as long as fifty small ones; cap each file's length, as the `[:12000]` does.

**Try it:** 60 files, each 3,000 prompt tokens at 300 tok/s plus 60 output tokens at 20 tok/s. Total? (60 × (10 + 3) = 780 s, 13 minutes.)
</details>

<div class="meaning">

<dl>
<dt>items</dt><dd>how many files the job handles tonight</dd>
<dt>prompt tokens ÷ prefill speed</dt><dd>seconds the model spends reading one file</dd>
<dt>output tokens ÷ decode speed</dt><dd>seconds it spends writing the summary for that file</dd>
<dt>window</dt><dd>the time between the job starting and when you need the report</dd>
<dt>Physical meaning</dt><dd>A night-shift baker whose oven bakes a fixed number of trays an hour. If orders double, start earlier, use a faster oven (a faster card or smaller model), or bake fewer trays (only new files, each cut to a maximum length).</dd>
</dl>

</div>

<div class="problem" data-problem="scheduled-jobs-window"></div>

<div class="myth">

**"Once it is scheduled, it will run."** A scheduler cannot start a job on a computer that is asleep, switched off or out of battery, and it may start in a different folder from the one you tested in. Set the machine to stay awake or wake for the task, use full paths, and read the log after the first few nights.

</div>

## 4. Worked example

*Made-up numbers.* A property manager saves tenant emails as text files into `inbox` during the day, about 45 a day. At 6 AM the laptop wakes, `nightly.py` runs Gemma 4 E4B for 9 minutes, and `reports/2026-11-20.md` lists 7 items marked **Action** with deadlines at the top of her morning. The log shows one failure in a month: the laptop was unplugged and the battery was flat.

## 5. Mini project 5: Nightly report bot

1. Put five text files in `inbox`, run `nightly.py` by hand and read the report.
2. Schedule it for 10 minutes from now, wait, and check that the report and `nightly.log` appear.
3. Change the schedule to the time you want, and add a second section to the report: "Deadlines this week", sorted by date.

## 6. Practice

1. Write the cron line for 11:30 PM every weekday.
2. The report is empty every morning, though files arrive. What do you check?
3. Make the script put action items first.

<details>
<summary>Answers</summary>

1. `30 23 * * 1-5 cd $HOME/nightly && .venv/bin/python nightly.py >> nightly.log 2>&1`
2. The log first; then whether files are saved as `.txt` and really changed in the last 24 hours (copying sometimes keeps the old date), and that `INBOX` points to the right folder (the job may start in a different working folder).
3. Sort before writing: `lines.sort(key=lambda s: not s.startswith("- **Action**"))`.
</details>

**New words:** *scheduled job* / *cron job* / *scheduled task* (a program the computer starts at set times), *batch job* (work done on many items at once, unattended), *log file* (where a program writes what it did and any errors).

<div class="keypoints">

- Write the job as a script, test it by hand, then let Task Scheduler (Windows), cron (Linux, Mac) or launchd (Mac) start it.
- Use the full path to your virtual environment's Python, and send all output to a log file.
- Job time ≈ items × (prompt tokens ÷ prefill speed + output tokens ÷ decode speed); it must fit in the night's window.
- Sleep is the most common reason a job did not run: set the computer to stay awake or wake for the task.
- Cap each file's length so one huge file cannot eat the whole night.

</div>
