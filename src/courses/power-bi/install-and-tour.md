---
title: Install Power BI Desktop and find your way around
seoTitle: 'Install Power BI Desktop and tour the window'
summary: Get the free Power BI Desktop app, learn what to do on a Mac, and find the ribbon, views, canvas and panes you'll use in every lesson.
minutes: 10
updated: 2026-11-22
sources:
  - 'Microsoft Learn, Get Power BI Desktop: https://learn.microsoft.com/power-bi/fundamentals/desktop-get-the-desktop'
quiz:
  - q: Which view shows your tables and relationships as boxes and lines?
    choices: ['Report view', 'Model view', 'Table view']
    ans: 1
    why: Model view is where you create and check relationships. Report view is the canvas; Table view shows the rows of a table.
  - q: Where do you choose a chart type and drop fields into it?
    choices: ['The Visualizations pane', 'The Filters pane', 'Power Query']
    ans: 0
    why: Visualizations holds the chart types, the Build wells (axis, values, legend) and Format options.
  - q: You use a Mac. What is the simplest way to follow the hands-on parts?
    choices: ['Power BI Desktop for Mac', 'A Windows virtual machine or cloud PC, or the practice editors here', 'You cannot learn Power BI on a Mac']
    ans: 1
    why: Power BI Desktop is Windows only. A Windows virtual machine or a cloud PC works, and every DAX exercise in this course also runs in the browser.
---

**Module 1 · about 10 minutes.** You'll have Power BI Desktop installed and know the name of every part of its window.

## 1. Why this matters

Interview tasks and on-the-job work happen in Power BI Desktop. Knowing where things are saves you from hunting for buttons while someone watches.

## 2. Install it

1. On Windows 10 or 11, open the **Microsoft Store**, search "Power BI Desktop" and install it. The Store version updates itself every month. (You can also download the installer from Microsoft's Power BI website.)
2. Open it. You can close the sign-in box: Desktop works without an account. You only sign in to publish.
3. **On a Mac:** Power BI Desktop does not run on macOS. Use a Windows virtual machine (for example Parallels on Apple silicon, which runs Windows 11 for Arm), a cloud PC, or a computer at a library or campus lab. Every DAX exercise in this course also runs right here in the browser.

## 3. The window

<!--fig:desktop-tour-->

The views on the left are the ones you'll switch between most:

- **Report**: the canvas where you build pages of visuals.
- **Table**: shows the rows of any table, and is where you check a calculated column.
- **Model**: boxes and lines for tables and relationships (Module 3).
- **DAX query**: write `EVALUATE` queries and test measures (Lesson 5.7). The editor in this course works the same way.
- **TMDL**: the model as code, for advanced users and version control.

**Transform data** on the Home ribbon opens the **Power Query Editor**, a separate window for cleaning data (Module 2).

<details class="maths" open>
<summary>Principle</summary>

**Principle:** Power BI keeps three things apart: *shaping* data (Power Query), *storing and relating* it (model and Table views) and *showing* it (Report view). When something looks wrong, first ask which of the three it belongs to.

**Try it:** a chart shows "Falls Centre" and "falls centre" as two bars. Which of the three places fixes it? (Shaping: Power Query, Lesson 2.2.)
</details>

## 4. Settings worth changing on day one

- **File > Options and settings > Options > Global > Data Load:** turn off **Auto date/time for new files** (and under Current File for a file already open). It quietly adds a hidden date table for every date column, which bloats the model; you'll build one proper date table in Lesson 3.3.
- **Regional settings:** check the locale matches your data, so 03/01/2025 is read as 3 January (Canada, UK) or March 1 (US) correctly.
- Save early: a Power BI file is a `.pbix` (or the newer folder format `.pbip`, which works with Git).

## 5. Practice

1. Open each view once and say aloud what it is for.
2. Find the Options setting for Auto date/time and switch it off.
3. Which window do you open with **Transform data**?

<details>
<summary>Answers</summary>

1. Report: build visuals. Table: see rows. Model: relationships. DAX query: test DAX. TMDL: model as code.
2. File > Options and settings > Options. Under Global > Data Load untick "Auto date/time for new files"; under Current File > Data Load untick "Auto date/time" for the file you have open.
3. The Power Query Editor.
</details>
