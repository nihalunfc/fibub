---
name: Compiler stage visualiser
num: 577
shelf: science
section: computer-science
title: "Compiler stage visualiser: see tokens, the syntax tree, stack bytecode and a step-by-step virtual machine for a tiny language"
summary: "Write a short program in a tiny language (variables, whole-number arithmetic, if, while, print) and watch each stage of a compiler: the lexer's tokens, the parser's syntax tree drawn as a picture, the stack-machine bytecode, and a virtual machine you can step through one instruction at a time."
status: live
ads: true
order: 577
icon: book
works: offline
updated: 2026-11-09
related: [algorithm-visualiser, float-inspector, cache-simulator]
sources:
  - "Lexing, recursive-descent parsing, stack-machine code generation and interpretation are standard compiler techniques (general computer science). The language was made up for this tool."
  - "Checked by running 10 test programs (sums, a 26-digit factorial, Fibonacci, Euclid's algorithm, primes, Collatz, rounding-down division and remainder of negative numbers, logic and precedence, 2^100, nested loops) and comparing every printed line with hand-written Python equivalents; plus exact tokens, bytecode, step counts, tree shapes and error positions for small programs."
flow:
  - { icon: pencil, label: "Program" }
  - { icon: scissors, label: "Tokens" }
  - { icon: link, label: "Tree" }
  - { icon: clock, label: "Run" }
---

## What it does

A compiler turns the text of a program into something a machine can run, in stages. This page shows every stage for a tiny language, so you can see what each one does:

1. **Tokens.** The lexer reads the text and cuts it into words: numbers, names, keywords (if, else, while, print, and, or, not), operators and punctuation. Spaces and comments disappear. Hover over a token to see its line and column.
2. **Syntax tree.** The parser (a recursive-descent parser) checks the tokens against the grammar and builds a tree. Statements are shaded; each operator sits above the values it combines, so the tree shows which part of a sum is worked out first.
3. **Bytecode.** The code generator walks the tree and writes instructions for a stack machine: PUSH a number, LOAD and STORE a variable, ADD, MUL, compare, PRINT, and JUMP or JUMP_IF_ZERO for if and while.
4. **Run it.** A virtual machine runs the bytecode one instruction at a time. You see the instruction about to run, the stack, the variables and the output.

## The language

- `x = 5;` gives a variable a value. `print x * 2;` shows a value.
- `if x > 3 { ... } else { ... }` chooses; `else if` works too. `while x > 0 { ... }` repeats.
- `+ - * / %` with the usual order (`*`, `/` and `%` before `+` and `-`), brackets, and minus in front of a value. Division and remainder round down, like Python's `//` and `%`: −7 / 2 is −4 and −7 % 2 is 1.
- `== != < <= > >=` give 1 for true and 0 for false; `and`, `or` and `not` treat any value other than 0 as true. Both sides of `and` and `or` are always worked out.
- Numbers are whole numbers of any size: 25! has 26 digits and is exact. `#` starts a comment.

## How to use it

1. Pick an example or type your own program. Every stage updates as you type.
2. If something is wrong, the error names the stage, the line and the column, with a ^ under the spot.
3. Under **Run it**, press **Step ▶** to run one instruction, **Run** to play (Pause stops), **⏭** to run to the end and **⏮** to start again. The highlighted row in the bytecode is the next instruction.
4. Save the bytecode or the tokens as CSV, or all stages as an image, PDF or Word file.

## Worked example

The first example adds up 1 to 10 and then prints 1 if the total is even, 0 if odd. The lexer finds 47 tokens; the tree has 32 nodes; the code generator writes 31 instructions. The while loop becomes:

`4 LOAD i, 5 PUSH 10, 6 LE, 7 JUMP_IF_ZERO 17, ... 16 JUMP 4`

so the condition is tested at 4 to 7, the body runs at 8 to 15, and 16 jumps back. Running it takes 149 steps and prints 55 and then 0. The factorial example multiplies its way to 15511210043330985984000000 in 323 steps.

## Tips

- Type `x = 2 + 3 * 4;` and look at the tree: `*` is below `+`, and the bytecode does MUL before ADD.
- Using a variable before giving it a value, or dividing by zero, stops the machine with the line number.
- Programs stop after 200,000 steps, so a loop that never ends cannot freeze the page.

## What it does not do

There are no functions, arrays, strings, decimals or input. There is no optimisation stage (such as working out 2 + 3 before running) and no machine code: the bytecode is run by an interpreter, as in Python or early Java. Your program is never run with JavaScript's own eval; the page's own machine runs it.

## FAQ

**Why a stack machine?** It is the simplest target for a compiler: an expression's tree turns straight into "push the operands, then apply the operator", which is how the Java and Python virtual machines work.

**Is my program sent anywhere?** No. Every stage runs in your browser, and the page keeps working offline.
