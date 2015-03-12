var CLCELL = 0x00;
var REDDOT = 0x10;
var BLUDOT = 0x11;

var UPANT = 0x20;
var RTANT = 0x21;
var DNANT = 0x22;
var LTANT = 0x23;

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

                if (this.clicks[i][2] == 'upant')
                    this.putNewAnt(x, y, UPANT);
				if (this.clicks[i][2] == 'rtant')
                    this.putNewAnt(x, y, RTANT);
				if (this.clicks[i][2] == 'dnant')
                    this.putNewAnt(x, y, DNANT);
                if (this.clicks[i][2] == 'ltant')
                    this.putNewAnt(x, y, LTANT);
                if (this.clicks[i][2] == 'reddot')
                    this.putBlock(x, y, REDDOT);
				if (this.clicks[i][2] == 'bludot')
                    this.putBlock(x, y, BLUDOT);
				if (this.clicks[i][2] == 'clcell')
                    this.putBlock(x, y, CLCELL);
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

	drawDot: function(i, c) {
		this.canvas.beginPath();
		this.canvas.arc(this.todraw[i][0] * this.cellsize + this.cellsize / 2,
						this.todraw[i][1] * this.cellsize + this.cellsize / 2,
						this.cellsize * 1/4, 0, 2 * Math.PI, false);
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

			if(this.todraw[i][2] == REDDOT)
				this.drawDot(i, "red");
			if(this.todraw[i][2] == BLUDOT)
				this.drawDot(i, "blue");

			if(this.todraw[i][2] >= UPANT)
				this.drawDot(i, "white");
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

		//  On a red dot, turn right.  On a blue dot, turn left.
        if (board[ant.currY][ant.currX] == REDDOT) {
            ant.currR = (ant.currR == LTANT) ? UPANT : (ant.currR + 1);
            this.putBlock(ant.currX, ant.currY, BLUDOT);
        } else if (board[ant.currY][ant.currX] == BLUDOT) {
            ant.currR = (ant.currR == UPANT) ? LTANT : (ant.currR - 1);
            this.putBlock(ant.currX, ant.currY, REDDOT);
        } else {
			this.putBlock(ant.currX, ant.currY, CLCELL);
		}

        // 2 advance in the direction i should move
        if (ant.currR == UPANT) {
            ant.currY--;
        }
        if (ant.currR == RTANT) {
            ant.currX++;
        }
        if (ant.currR == DNANT) {
            ant.currY++;
        }
        if (ant.currR == LTANT) {
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
        this.todraw.push([ant.currX, ant.currY, ant.currR]);

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
    }
}

