---
title: 'Virtual Bumblebees Artificial Life Simulation'
tags:
  - Langton ant
  - artificial life
  - cellular automata
  - agent-based modelling
  - Javascript
  - CSS
authors:
 - name: James P. Howard, II
   orcid: 0000-0003-4530-1547
   affiliation: 1
affiliations:
 - name: University of Maryland University College
   index: 1
date: 6 March 2017
bibliography: paper.bib
---

# Summary

In the 1980, Christopher Langton created the virtual ant or sometimes
"vant" [@langton:1986]. The Langton ant is a cellular automaton such
that a cell is occupied by the "ant." If the cell is black, the ant
turns 90 degrees to the right and advances a single cell. If the cell is
green, the ant turns 90 degrees to the left and advances a single
cell. After exiting the cell, the ant flips the color of the cell. This
leads to a variety of amazing interactions among multiple ants that
effectively replicates eusocial behavior in a number of organisms.

In a popular book on artificial life, Levy describes the virtual ants
slightly differently [@levy:1992]:

> The vant itself was a V-shaped construct that moved in the direction
> of its point. If the lead cell moved into a blank square on the
> imaginary grid, the vant continued moving in that direction. If the
> square was blue, the vant turned right and changed the color of that
> cell to yellow. If the square was yellow, the vant turned left and
> changed the color of the square to blue.

Using Scrivner's implementation of the Langton Ant as a base
[@scrivner:2012], this software package implements the construction
described by Levy in Javascript.  This can be used to model eusocial
behavior, network traffic, and other nonlinear problems.

# References
