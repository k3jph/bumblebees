$(document)
    .ready(function() {
        anim.reset();
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
