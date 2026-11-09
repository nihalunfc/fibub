---
name: Path planning visualiser
num: 640
shelf: science
section: control-and-robotics
title: "Path planning visualiser: A*, Dijkstra and RRT on a grid you draw"
summary: "Draw walls on a grid with a tap or a drag, then watch A* or Dijkstra (4 or 8 directions) find the shortest path and which cells they search, or grow a seeded RRT tree through open space. Shows path length, cells expanded and tree size, and downloads the path as CSV."
status: live
ads: true
order: 640
icon: target
works: offline
updated: 2026-11-09
related: [kalman-filter-playground, inverse-kinematics, dh-kinematics, algorithm-visualiser, vehicle-routing, pid-simulator]
sources:
  - "A* search (Hart, Nilsson and Raphael 1968) with the Manhattan and octile distance heuristics, and Dijkstra's algorithm (1959): standard algorithms, written by fibub."
  - "Rapidly-exploring random tree (RRT, LaValle 1998) with goal bias and greedy shortcut smoothing: standard motion-planning practice, written by fibub."
  - "The example map is made up by fibub; random maps come from fibub's own seeded generator."
flow:
  - { icon: pencil, label: "Draw walls" }
  - { icon: target, label: "Start, goal" }
  - { icon: search, label: "Search" }
  - { icon: ruler, label: "Path" }
---

## What it does

Robots, games and delivery apps all have to find a way from A to B around obstacles. This page lets you draw a map and compare three classic planners:

- **Dijkstra** spreads out from the start in rings of equal distance until it reaches the goal. It always finds the shortest path, but it searches in every direction.
- **A\*** does the same, but always looks next at the cell with the smallest *distance so far plus a guess of the distance left*. The guess never overestimates (straight-line Manhattan distance for 4 directions, octile distance for 8), so A* still finds the shortest path while expanding far fewer cells.
- **RRT** (rapidly-exploring random tree) works in continuous space instead of on the grid. It picks random points, grows the tree a fixed step towards each one, and stops when a branch gets close to the goal. It handles big, open spaces well, but its path is not the shortest, and every random seed grows a different tree. Optional **shortcuts** straighten the path afterwards.

Turn the waypoints into arm joint angles with the [[inverse-kinematics|inverse kinematics solver]], and for delivery rounds between many stops try [[vehicle-routing]].

## How to use it

1. Pick **Walls** and tap or drag on the map to block cells. **Erase** clears them; **Start** and **Goal** move the two ends. **Random walls** fills the map with a share of walls from a seed; **Example map** brings back the starting map.
2. Choose the **method**. For the grid methods, choose **4 or 8 directions**: diagonal moves cost √2 and are not allowed to squeeze between two blocked corners.
3. For **RRT**, set the step size, the most iterations, the goal bias (how often it aims straight at the goal), how close counts as reaching the goal, and the seed.
4. Read the path length, the cells expanded or tree nodes, and download the path as CSV, or the map as an image, PDF or Word file.

## Worked example

On the example 24 × 16 map, with 8 directions, **A\*** shows **length 26.73 cells, 97 cells expanded**. Switch to **Dijkstra** and the length is the same, but it expands 330 cells. With 4 directions the shortest path is 32 cells. **RRT** with seed 1, step 1.5 and 5 % goal bias reaches the goal after 177 iterations with 80 tree nodes; its first path is 30.16 cells, and the shortcuts bring it down to 24.59 cells. That is shorter than the grid path, because it can move at any angle.

## Good to know

- The shaded cells show exactly what the grid search looked at, in the order it searched.
- A* is only as good as its guess: with a guess of zero it becomes Dijkstra.
- RRT can fail in narrow passages. More iterations, a smaller step or a different seed usually help.

## FAQ

**Why is the RRT path sometimes shorter than A\*?** A* is limited to grid moves in 4 or 8 directions; RRT moves in straight lines at any angle. Without shortcuts its path is usually longer and wobblier.

**Is anything sent or saved?** No. The map lives only on this page and is gone when you leave.
