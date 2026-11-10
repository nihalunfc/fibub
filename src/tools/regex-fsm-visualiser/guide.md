---
name: Regex visualiser
num: 559
shelf: science
section: computer-science
title: "Regex visualiser"
summary: "Turn a regular expression into a Thompson NFA, a DFA (subset construction) and the minimal DFA, drawn as state diagrams with transition tables. Step through a test string state by state, or type your own DFA and minimise it."
status: live
ads: true
order: 559
icon: pointer
works: offline
updated: 2026-11-09
related: [sql-playground, combinatorics-calculator, algorithm-visualiser, toy-compiler, logic-simplifier, graph-algorithms, syntax-tree-drawer]
sources:
  - "Standard automata theory: Kleene's theorem, Thompson's construction (1968), the subset construction (Rabin and Scott, 1959) and Moore's minimisation algorithm (1956)."
  - "Checked by brute force against JavaScript's own RegExp engine: for the textbook example (a|b)*abb, 21 hand-picked and 300 random regexes, every string up to length 6 (or 10) gets the same answer from the NFA, the DFA and the minimal DFA; every minimal DFA was also checked to have no two equivalent states."
flow:
  - { icon: pencil, label: "Regex" }
  - { icon: pointer, label: "NFA" }
  - { icon: shrink, label: "Min DFA" }
  - { icon: check, label: "Test" }
---

## What it does

Every regular expression has a finite state machine that recognises the same strings, and every course on automata or compilers walks through the steps. This tool does them for any regex and draws each machine:

1. **Thompson's construction** turns the regex into an NFA (nondeterministic finite automaton) with ε-moves, the moves taken without reading a symbol.
2. **The subset construction** turns the NFA into a DFA (deterministic finite automaton). Each DFA state is a set of NFA states, listed in the transition table.
3. **Minimisation** merges the states that no string can tell apart, giving the smallest DFA for the language. It is unique apart from the state names.

For each machine you get the **state diagram**, the **transition table** (CSV download) and a **string tester** that steps through a word one symbol at a time, lighting up the current state (or set of states for the NFA). The summary gives the alphabet, the state counts, whether the language is empty, finite or infinite, the shortest matching strings and how many strings of each length match.

You can also **type your own DFA**, as lines such as `q0 a q1`, and see it drawn and minimised. "Edit this as a DFA" copies any DFA from the regex side into the editor.

See how a tokeniser uses the same machines in the [[toy-compiler|compiler stage visualiser]], and simplify Boolean expressions with the [[logic-simplifier]].

## How to use it

1. Type a regex. Supported: symbols, `.` (any symbol), classes `[abc]`, `[a-z]`, `[^ab]`, `\d \w \s`, `|`, `*`, `+`, `?`, repeats `{2}`, `{2,}`, `{2,4}` and brackets. The whole string must match.
2. The alphabet is every symbol the regex names. Add more in the second box when you use `.` or `[^ ]`, so they know what "any other symbol" means.
3. Pick a machine above the diagram. Tick **Show the dead state** to draw the state that missing arrows lead to.
4. Type a test string and press **Step**, **Back** or **Run to end**. Several strings can be tested at once in the box below.

On a phone, wide diagrams scroll sideways inside their box.

## Worked example

The page opens with the textbook example **(a|b)*abb**: strings of a and b that end in abb. Thompson's construction gives an NFA with 14 states, the subset construction a DFA with 5 states (as in the "Dragon book"), and minimising leaves **4 states**. The shortest matches are abb, aabb, babb, …, and there are 1, 2, 4, 8, … matches of length 3, 4, 5, 6. Step through babb and the minimal DFA goes 0 → 0 → 1 → 2 → 3 and accepts. The page then compares the minimal DFA with your browser's own RegExp on all 16 383 strings up to length 13.

In the DFA tab, the example machine accepts binary numbers divisible by 3 (the state is the remainder). It is already minimal (3 states); 110 (six) is accepted, and the shortest accepted strings are ε, 0, 00, 11, 000, 011, 110.

## Frequently asked questions

**Why are there more NFA states than in my textbook?** Books differ in small details of Thompson's construction (some merge states when joining pieces). The language and the minimal DFA are the same.

**What is not supported?** Look-ahead, back-references, word boundaries and anchors inside the regex: these go beyond regular languages or depend on the text around the match. Very large machines (over 600 NFA or 400 DFA states) are refused.

**Is anything sent anywhere?** No. All the machines are built in your browser.
