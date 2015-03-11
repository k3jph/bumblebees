var util = util || {}

util.fps = {
    frametimes: [],
    add: function() {
        if (this.frametimes.length > 30) this.frametimes.splice(0, 1);
        var currTime = new Date()
            .getTime();
        this.frametimes.push(currTime);
        return Math.round(1000 / ((currTime - this.frametimes[0]) / (
            this.frametimes.length - 1)));
    }
}

// return a random number in the range x, y with decimat points to floatVal
util.random = function(minVal, maxVal, floatVal) {
    var randVal = minVal + (Math.random() * (maxVal - minVal));
    return typeof floatVal == 'undefined' ? Math.round(randVal) : randVal.toFixed(
        floatVal);
}

var ant = function(x, y, r, t) {
    return {
        currX: x,
        currY: y,
        currR: r,
        type: t
    }
}
var anim = {

    interval: false,

    tick: function() {

        // detect any clicks
        if (this.clicks.length > 0) {
            for (var i in this.clicks) {

                var x = Math.floor(this.clicks[i][0] / this.cellsize);
                var y = Math.floor(this.clicks[i][1] / this.cellsize);

                if (this.clicks[i][2] == 'ant') {
                    this.putNewAnt(x, y, util.random(0, 3));
                }

                if (this.clicks[i][2] == 'block') {
                    this.putBlock(x, y, 1);
                }

                if (this.clicks[i][2] == 'pat1') {
                    this.pattern([x, y], 1);
                }
                if (this.clicks[i][2] == 'pat2') {
                    this.pattern([x, y], 2);
                }
                if (this.clicks[i][2] == 'pat3') {
                    this.pattern([x, y], 3);
                }
                if (this.clicks[i][2] == 'pat4') {
                    this.pattern([x, y], 4);
                }

            }
            this.clicks = [];
        }

        // save the current board so all ants act on same basis

        var board = this.board.slice();
        for (var i in this.ants) {
            this.update(board, this.ants[i]);
        }

        this.draw();

        this.counter++;
    },



    draw: function() {

        for (var i in this.todraw) {

            var colour = false;

            if (this.todraw[i][2] == 0) { // empty
                colour = "black";
            } else if (this.todraw[i][2] == 1) { // block
                colour = "green";
            } else if (this.todraw[i][2] == 2) { // red
                colour = "red";
            }

            this.canvas.fillStyle = colour;
            this.canvas.fillRect((this.todraw[i][0] * this.cellsize), (
                    this.todraw[i][1] * this.cellsize), this.cellsize,
                this.cellsize);
        }

        this.todraw = [];

        //var fps = util.fps.add();
        //document.title = fps + ' fps';
    },

    putBlock: function(x, y, c) {

        this.board[y][x] = c;
        this.todraw.push([x, y, c]);
    },

    putNewAnt: function(x, y, d) {

        this.ants.push(ant(x, y, d));

        this.todraw.push([x, y, 2]);

    },


    update: function(board, ant) {

        if (!this.running) return;

        /*
		At a black square, turn 90° right, flip the color of the square, move forward one unit
		At a green square, turn 90° left, flip the color of the square, move forward one unit
		*/

        // what colour cell am i on?
        if (board[ant.currY][ant.currX] == 0) {

            // new square is off, turn 90 right
            ant.currR = (ant.currR == 3) ? 0 : (ant.currR + 1);

            // flip cell colour
            this.putBlock(ant.currX, ant.currY, 1);

        } else {

            // new square is off, turn 90 right
            ant.currR = (ant.currR == 0) ? 3 : (ant.currR - 1);

            // flip cell colour
            this.putBlock(ant.currX, ant.currY, 0);
        }

        // 2 advance in the direction i should move
        if (ant.currR == 0) {
            ant.currY--;
        }
        if (ant.currR == 1) {
            ant.currX++;
        }
        if (ant.currR == 2) {
            ant.currY++;
        }
        if (ant.currR == 3) {
            ant.currX--;
        }

        // constrian to the board by wrapping around
        if (ant.currX >= this.cols) {
            ant.currX = 0;
        }
        if (ant.currX < 0) {
            ant.currX = (this.cols - 1);
        }
        if (ant.currY >= this.rows) {
            ant.currY = 0;
        }
        if (ant.currY < 0) {
            ant.currY = (this.rows - 1);
        }


        // draw ant
        this.todraw.push([ant.currX, ant.currY, 2]);

    },

    reset: function() {

        this.fps = $('#c_speed')
            .val();
        this.cellsize = $('#c_cellsize')
            .val();

        $('#c_speed_indicator')
            .html($('#c_speed')
                .val());
        $('#c_cellsize_indicator')
            .html($('#c_cellsize')
                .val());

        this.counter = 0;

        // hold clicks somewhere
        this.clicks = [];

        // hold to-draw items in buffer
        this.todraw = [];

        // ants
        this.ants = [];

        // work out canvas size
        this.canvas_width = parseInt(window.innerWidth / this.cellsize) *
            this.cellsize;
        this.canvas_height = parseInt(window.innerHeight / this.cellsize) *
            this.cellsize;

        // set canvas properties
        var canvasElement = $("#canvas");
        canvasElement.attr('width', this.canvas_width);
        canvasElement.attr('height', this.canvas_height);
        this.canvas = document.getElementById('canvas')
            .getContext("2d");

        // create cell matrix
        this.board = [];
        this.cols = Math.floor(this.canvas_width / this.cellsize);
        this.rows = Math.floor(this.canvas_height / this.cellsize);

        for (var i = 0; i < this.rows; i++) {
            this.board[i] = [];
            for (var j = 0; j < this.cols; j++) {
                this.board[i][j] = 0;
            }
        }


    },

    start: function() {

        this.running = true;

        this.stop();
        this.interval = setInterval(function() {
            anim.tick();
        }, 1000 / this.fps);

    },

    stop: function() {
        clearInterval(this.interval);
    },


    stopRunning: function() {
        this.running = false;
    },

    pattern: function(cells, num) {

        if (num == 1) {

            // phaser

            this.putNewAnt(cells[0], cells[1], 1);
            this.putNewAnt(cells[0], cells[1] + 1, 3);
        }

        if (num == 2) {

            // growing square

            this.putNewAnt(cells[0], cells[1], 0);
            this.putNewAnt(cells[0], cells[1] + 1, 2);
        }

        if (num == 3) {

            // in a line

            this.putBlock(cells[0], cells[1], 1);
            this.putBlock(cells[0] + 1, cells[1], 1);
            this.putBlock(cells[0] + 2, cells[1], 1);
            this.putBlock(cells[0] + 3, cells[1], 1);
            this.putBlock(cells[0] + 4, cells[1], 1);
            this.putBlock(cells[0] + 5, cells[1], 1);
            this.putBlock(cells[0] + 6, cells[1], 1);
            this.putBlock(cells[0] + 7, cells[1], 1);
            this.putBlock(cells[0] + 8, cells[1], 1);
            this.putBlock(cells[0] + 9, cells[1], 1);
            this.putBlock(cells[0] + 10, cells[1], 1);
            this.putBlock(cells[0] + 11, cells[1], 1);
            this.putBlock(cells[0] + 12, cells[1], 1);

            this.putNewAnt(cells[0] + 12, cells[1], 3);

        }

        if (num == 4) {

            // walkies
            //this.putBlock(cells[0], 	cells[1]-1, 1);

            this.putBlock(cells[0] + 1, cells[1], 1);

            this.putBlock(cells[0], cells[1] + 1, 1);
            this.putBlock(cells[0] + 1, cells[1] + 1, 1);

            this.putNewAnt(cells[0], cells[1] - 1, 1);
            this.putNewAnt(cells[0], cells[1] - 1, 2);
        }

        if (num == 5) {

            // phaser 2
            this.putBlock(cells[0] + 1, cells[1], 1);

            this.putBlock(cells[0], cells[1] + 1, 1);
            this.putBlock(cells[0] + 1, cells[1] + 1, 1);

            this.putNewAnt(cells[0], cells[1], 3);
            this.putNewAnt(cells[0] + 1, cells[1] - 1, 0);
        }

    }

}

$(document)
    .ready(function() {
        anim.reset();

        // starter ants
        anim.ants.push(ant(util.random(0, (anim.cols - 1)), util.random(0, (
            anim.rows - 1)), util.random(0, 3)));
        anim.ants.push(ant(util.random(0, (anim.cols - 1)), util.random(0, (
            anim.rows - 1)), util.random(0, 3)));

        anim.start();

        $("#controls")
            .click(function(e) {
                $("#controls")
                    .toggleClass('active');
            });

        $("#canvas")
            .click(function(e) {
                var x = e.pageX - $("#canvas")
                    .offset()
                    .left;
                var y = e.pageY - $("#canvas")
                    .offset()
                    .top;

                var type = $('input:radio[name=c_clicking]:checked')
                    .val();

                anim.clicks.push([x, y, type]);
            });

        $('#c_stop')
            .click(function(e) {
                anim.stopRunning();
            });
        $('#c_reset')
            .click(function(e) {
                anim.reset();
            });
        $('#c_start')
            .click(function(e) {
                anim.start();
            });
        $('#c_restart')
            .click(function(e) {
                anim.stop();
                anim.reset();

                // starter ants
                anim.ants.push(ant(util.random(0, (anim.cols - 1)),
                    util.random(0, (anim.rows - 1)), util.random(
                        0, 3)));
                anim.ants.push(ant(util.random(0, (anim.cols - 1)),
                    util.random(0, (anim.rows - 1)), util.random(
                        0, 3)));

                anim.start();
            });

        $('#c_speed')
            .change(function() {
                anim.stop();
                anim.fps = $('#c_speed')
                    .val();
                anim.start();

                $('#c_speed_indicator')
                    .html($('#c_speed')
                        .val());
            });

        $('#c_cellsize')
            .change(function() {
                $('#c_cellsize_indicator')
                    .html($('#c_cellsize')
                        .val());
            });
    });
