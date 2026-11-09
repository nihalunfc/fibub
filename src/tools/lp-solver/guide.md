---
name: Linear and integer programming solver
num: 582
shelf: science
section: operations-research
title: "Linear and integer programming solver: simplex, branch and bound, shadow prices and a graph of the feasible region"
summary: "Type a linear or integer program as plain text (maximize or minimize, constraints, bounds, whole-number and yes/no variables) and get the optimal solution, shadow prices, reduced costs, the simplex tableaux step by step, and a picture for two variables. Runs in your browser."
status: live
ads: true
order: 582
icon: target
works: offline
updated: 2026-11-09
related: [transportation-assignment, vehicle-routing, project-scheduler, plot-maker, sql-playground, queueing-calculator, matrix-calculator, nash-equilibrium-solver]
sources:
  - "Methods: the two-phase simplex method with Bland's anti-cycling rule and branch and bound, as described in standard operations research textbooks; the solver was written for fibub."
  - "Checked against SciPy's linprog and milp (HiGHS) on 1,800 random models (optimal, infeasible and unbounded; free, shifted and upper-bounded variables), against brute-force search for small integer models, and the shadow prices and reduced costs against the optimality (KKT) conditions and HiGHS's marginals."
  - "The examples are made up for this tool."
flow:
  - { icon: pencil, label: "Write model" }
  - { icon: calculator, label: "Simplex" }
  - { icon: target, label: "Optimum" }
  - { icon: chart, label: "Sensitivity" }
---

## What it does

Linear programming finds the best value of a linear objective, such as profit or cost, when the choices are limited by linear constraints: hours, materials, budgets, demand. Integer programming adds the rule that some choices must be whole numbers, or yes/no. This solver takes a model typed as plain text and gives:

- the **optimal solution**, or a clear message that the model is **infeasible** (no point meets every constraint) or **unbounded** (the objective improves for ever);
- for linear programs, the **shadow price** of every constraint and the **reduced cost** of every variable;
- **branch and bound** for `int` (whole number) and `bin` (0 or 1) variables;
- a **picture of the feasible region** when the model has two variables, with the constraint lines, the objective line through the optimum and, for integer models, the allowed whole-number points;
- the **simplex tableaux, step by step**, for small linear models, which is useful for checking homework done by hand.

For shipping and job-matching problems the [[transportation-assignment|transportation and assignment solver]] is quicker, and delivery rounds go in the [[vehicle-routing|vehicle routing planner]].

## How to write a model

```
maximize profit: 40 tables + 30 chairs
subject to
  wood:   4 tables + 2 chairs <= 60
  labour: 2 tables + 3 chairs <= 54
  demand: tables <= 12
```

- Start with `maximize` or `minimize`, an optional name and a colon, then the objective.
- Write one constraint per line with `<=`, `>=` or `=`. Variables and numbers may be on both sides, and `2 <= x + y <= 8` is split into two constraints. A name in front (`wood:`) labels the constraint in the results; otherwise they are called c1, c2 and so on.
- Every variable is **0 or more** unless you say otherwise under `bounds`: `x <= 10`, `-5 <= y <= 5`, `z >= -3` or `z free`.
- `int x, y` makes variables whole numbers; `bin a, b` makes them 0 or 1.
- `#` starts a comment.

## What the numbers mean

**Shadow price**: how much the best objective changes if a constraint's right-hand side goes up by one unit. In the workshop example the wood constraint has a shadow price of 7.5: one more board metre of wood would add 7.5 to the best profit, so it is worth paying up to 7.5 for it. A constraint with slack left over has a shadow price of 0. Shadow prices hold for small changes; a large change can move the optimum to a different corner.

**Reduced cost**: how much the objective changes for each unit a variable is pushed up from the bound where it sits. It is 0 for variables between their bounds. A negative reduced cost in a maximisation tells you how much the variable's objective coefficient would have to rise before it is worth using.

**Slack**: how far the left side is from the right side. A slack of 0 means the constraint is binding.

## Worked example

Choose the first example. The solver answers **Maximum profit = 720** with 9 tables and 12 chairs. Wood (60 of 60) and labour (54 of 54) are binding, with shadow prices 7.5 and 5; the demand limit of 12 tables has 3 to spare and a shadow price of 0. The picture shows the shaded feasible region, and the dashed profit line touches it at the corner (9, 12).

The second example has whole items only and slightly different limits. Branch and bound needs 9 nodes and finds a profit of 700 at 10 tables and 10 chairs, while the linear relaxation promises a little more.

## The method

Linear models are solved by the **two-phase simplex method** on a full tableau: phase 1 finds a feasible corner by minimising the sum of artificial variables (or proves there is none), and phase 2 moves from corner to corner improving the objective. The default pivot rule picks the largest improvement and switches to **Bland's rule** if many steps in a row make no progress, which rules out cycling; you can also choose Bland's rule from the start. Variables with lower bounds are shifted, variables with only an upper bound are measured down from it, and free variables are split into two parts. Integer models use **branch and bound**, depth first, on the most fractional variable, and stop after 20,000 nodes.

## What it does not do

It is made for teaching and for small and medium models (up to 300 variables and 300 constraints). It uses a dense tableau, not the sparse factorisations of industrial solvers, so very large or badly scaled models may be slow or lose accuracy. It does not give ranging (how far a coefficient can move before the basis changes), and it does not read MPS files.

## Frequently asked questions

**Why does my model say infeasible?** Check the signs and right-hand sides, and remember the default lower bound of 0. Deleting constraints one at a time shows which ones clash.

**Is my model sent anywhere?** No. Everything is worked out in your browser and nothing is stored.
