# Virtual Bumblebees

This project provides a simple environment for modeling an artificial
life construct called the _Virtual Bumblebees_.  The _Virtual
Bumblebees_ is a two-dimensional cellular automaton where the full board
updates each time step based on the prior board state and a limited list
of rules.

## Motivation

Artificial life uses information concepts and computer modeling to study
life in general, and terrestrial life in particular.  It aims to explain
particular vital phenomena, ranging from the origin of biochemical
metabolisms to the coevolution of behavioral strategies, and also the
abstract properties of life as such (“life as it could be”).  In the
case of the _Virtual Bumblebees_, it is a cellular automaton, the most
famous of which is Conway's "Game of Life," first made popular by
Gardner[1].

The _Virtual Bumblebees_ is derived from an ambiguous phrasing by
Levy[2] describing Langton's virtual ant (or vant):

> The vant itself was a V-shaped construct that moved in the direction
  of its point. If the lead cell moved into a blank square on the
  imaginary grid, the vant continued moving in that direction. If the
  square was blue, the vant turned right and changed the color of that
  cell to yellow. If the square was yellow, the vant turned left and
  changed the color of the square to blue.

Originally, Langton intended a different ruleset for the virtual ant[3]:

> Vants reside in an environment that consists of uniformly spaced,
  fixed cells that are in one of two states (either blue or yellow in
  the following figures). A vant travels in a straight line in empty
  space. If it encounters a blue cell, it turns right and leaves the
  cell colored yellow. If it encounters a yellow cell, it turns left and
  leaves the cell colored blue.

This project implement's a different ruleset, derived from Levy, to
understand the implications and differences from the Langton Ant.

### _Virtual Bumblebees_ Ruleset, Defined

1. At a red dot, turn 90 degrees to the right, turn the dot blue, and
   move forward one cell;   
2. At a blue dot, turn 90 degrees to left, turn the dot red, and move
   forward one cell; and
3. At an empty square, move forward one cell.

## Usage

### The Simulator

The simulator starts running, but with a blank state.  Clicking anywhere
in the simulation field, the black area, creates a "bee."  Each bee has
a two part state.  The first part is its location.  The location set to
the click's location.  The second part of the state is a direction
vector, one of up, down, left, or right.  Unless changed, the initial
direction is up.  Note that as soon as a bee is created, it starts
moving as the simulation is already running.

On the left-hand side of the screen is a collapsable menu.  There are
seven radio buttons that control what is placed when the user click's in
the simulation field:

1.  *an up bee*: A bee with an initial direction of upwards,
2.  *a right bee*: A bee with an initial direction of rightwards,
3.  *a down bee*: A bee with an initial direction of downwards,
4.  *a left bee*: A bee with an initial direction of leftwards,
5.  *a red dot*: Changes the cell's color from it's current state to
    red,
6.  *a blue dot*: Changes the cell's color from it's current state to
    blue, and
7.  *clear the cell*: Clears the cell of any state or bee.

Changing the radio button immediately changes what is placed in the
simulation field with the next click.

### Addition Controls

Beyond the basic controls, there are additional controls to support the
user's exploration of the environment.

1.  *Speed*: Controls the speed of the simulation on a scale from 1 to 100
    The initial value is 10.
2.  *Size*: Controls the size of each cell.  Larger cells fit fewer in the
    simulation field and the simulation field is limited to the window
    size.  The sizes range from 1 to 50 with an initial value of 40.
    The simulator must be reset before a size change takes effect.
3.  *Reset*: Resets the simulator.  However, the settings are not
    changed.
4.  *Stop*: Stops the simulation.  All objects' states are frozen.
5.  *Clear*: Clears all objects from the simulation field.
6.  *Start*: Starts the simulation.  

### Installation

The _Virtual Bumblebees_ program runs as a set of CSS and Javascript
files.  While they can be served from a webserver, it is not necessary
and no special installation is necessary.  Loading the ``index.html``
file in a browser is sufficient to start the application.

## Contribution guidelines

* The central repository for _Virtual Bumblebees_ is [located on
  GitHub](https://github.com/howardjp/bumblebees/issues)
* Use [GitFlow](http://nvie.com/posts/a-successful-git-branching-model/),
  Vincent Driessen's Git branching model
    * The ``master`` branch is automatically deployed to a Heroku
      instance located at
      [http://bumblebees.jameshoward.us](http://bumblebees.jameshoward.us)
	* Technical support and problem reports should both be addressed
      through the [GitHub repository](https://github.com/howardjp/bumblebees/issues)
  

### Basic Architecture

Internally, the implementation is a simple HTML file that establishes
the board.  The majority of the application's implementation is handled
through associated Javascript and CSS files.  The simulation field is
stored as an _m_ × _n_ array with three potential values:

1. *0x00*: A clear cell,
2. *0x10*: A red cell, and
3. *0x11*: A blue cell.

Bees are kept in a separate array of _k_ elements listing the bee's
state.  The location is stored as the _x_ and _y_ coordinates of the
bee.  The bee's direction vector is one of four states:

1. *0x20*: Upwards,
2. *0x21*: Rightwards,
3. *0x22*: Downwards, and
4. *0x23*: Leftwards.

### Architectural Implications

There are two critical implications to this architecture. First, two
bees may coexist simultaneously the same cell.  This simplifies the
update step significantly if the bees do not bump into each other and
simply move along together.

Second, the simulation state does not update atomically.  The simulation
state is updated for each bee, sequentially.  This is largely a nonissue
as a cell's state does not change unless a bee force's it to change.  It
also solves the semantic problem of two bees reaching the same colored
cell in the same time step.  When that happens, the first bee will flip
the color and departs the cell.  When the second bee is processed, it
flips the color back and departs the cell.

### Additional Implementation Notes

The implementation of _Virtual Bumblebees_ is based on Ross Scrivener's
implementation of the Langton Ant[4], available in Javascript from
Scrivener's website.  The existing implemented is revised and
generalized to implement the _Virtual Bumblebees_.

There is a ``.htaccess`` file that directs a Heroku-based PHP server to
direct the server to treat ``index.html`` as the preferred index file.
Finally, the empty ``index.php`` file triggers a PHP-based environment
on Heroku.

## References

1. M. Gardner, Mathematical games: The fantastic combinations of John
   Conway’s new solitaire game “Life”. _Sci. Am._ 223, 120-123 (1970).
2. S. Levy, _Artificial Life: A Report from the Frontier Where Computers
   Meet Biology_ (Pantheon Books, New York, 1992), pp. 104.
3. C. G. Langton, Studying artificial life with cellular
   automata. _Physica D._ 22, 120-149 (1986).
4. R. Scrivener, Langton's Ants - in Javascript. (2012).
