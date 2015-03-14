var CLCELL = 0x00;
var REDDOT = 0x10;
var BLUDOT = 0x11;

var UPBEE = 0x20;
var RTBEE = 0x21;
var DNBEE = 0x22;
var LTBEE = 0x23;

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

var bee = function(x, y, r, t) {
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

                if (this.clicks[i][2] == 'upbee')
                    this.putNewbee(x, y, UPBEE);
                if (this.clicks[i][2] == 'rtbee')
                    this.putNewbee(x, y, RTBEE);
                if (this.clicks[i][2] == 'dnbee')
                    this.putNewbee(x, y, DNBEE);
                if (this.clicks[i][2] == 'ltbee')
                    this.putNewbee(x, y, LTBEE);
                if (this.clicks[i][2] == 'reddot')
                    this.putBlock(x, y, REDDOT);
                if (this.clicks[i][2] == 'bludot')
                    this.putBlock(x, y, BLUDOT);
                if (this.clicks[i][2] == 'clcell')
                    this.putBlock(x, y, CLCELL);
            }
            this.clicks = [];
        }

        // save the current board so all bees act on same basis
        var board = this.board.slice();
        for (var i in this.bees) {
            this.update(board, this.bees[i]);
        }

        this.draw();
        this.counter++;
    },

    drawDot: function(i, c) {
        this.canvas.beginPath();
        this.canvas.arc(this.todraw[i][0] * this.cellsize + this.cellsize / 2,
            this.todraw[i][1] * this.cellsize + this.cellsize / 2,
            this.cellsize * 1 / 4, 0, 2 * Math.PI, false);
        this.canvas.fillStyle = c;
        this.canvas.fill();
        this.canvas.lineWidth = 0;
        this.canvas.strokeStyle = c;
        this.canvas.stroke();
    },

    draw: function() {
        for (var i in this.todraw) {
            this.canvas.fillStyle = "black";
            this.canvas.fillRect(this.todraw[i][0] * this.cellsize,
                this.todraw[i][1] * this.cellsize,
                this.cellsize, this.cellsize);

            if (this.todraw[i][2] == REDDOT)
                this.drawDot(i, "red");
            if (this.todraw[i][2] == BLUDOT)
                this.drawDot(i, "blue");

            if (this.todraw[i][2] >= UPBEE)
                this.drawDot(i, "yellow");
        }

        this.todraw = [];

        //var fps = util.fps.add();
        //document.title = fps + ' fps';
    },

    putBlock: function(x, y, c) {
        this.board[y][x] = c;
        this.todraw.push([x, y, c]);
    },

    putNewbee: function(x, y, d) {
        this.bees.push(bee(x, y, d));
        this.todraw.push([x, y, 2]);
    },

    update: function(board, bee) {
        if (!this.running) return;

        //  On a red dot, turn right.  On a blue dot, turn left.
        if (board[bee.currY][bee.currX] == REDDOT) {
            bee.currR = (bee.currR == LTBEE) ? UPBEE : (bee.currR + 1);
            this.putBlock(bee.currX, bee.currY, BLUDOT);
        } else if (board[bee.currY][bee.currX] == BLUDOT) {
            bee.currR = (bee.currR == UPBEE) ? LTBEE : (bee.currR - 1);
            this.putBlock(bee.currX, bee.currY, REDDOT);
        } else {
            this.putBlock(bee.currX, bee.currY, CLCELL);
        }

        // 2 advance in the direction i should move
        if (bee.currR == UPBEE) {
            bee.currY--;
        }
        if (bee.currR == RTBEE) {
            bee.currX++;
        }
        if (bee.currR == DNBEE) {
            bee.currY++;
        }
        if (bee.currR == LTBEE) {
            bee.currX--;
        }

        // constrian to the board by wrapping around
        if (bee.currX >= this.cols) {
            bee.currX = 0;
        }
        if (bee.currX < 0) {
            bee.currX = (this.cols - 1);
        }
        if (bee.currY >= this.rows) {
            bee.currY = 0;
        }
        if (bee.currY < 0) {
            bee.currY = (this.rows - 1);
        }

        // draw bee
        this.todraw.push([bee.currX, bee.currY, bee.currR]);
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

        // bees
        this.bees = [];

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
    }
}
