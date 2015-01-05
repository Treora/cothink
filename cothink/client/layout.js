CoLayout = {};

CoLayout.force = null;

CoLayout.transitions = {};

CoLayout.positionAtAlmostCenter = function (el) {
    el.position({my:'center', at:'center', of:'body'});
    el.offset({top: el.offset().top + Math.random() - .5, left: el.offset().left + Math.random() -.5});
}

CoLayout.transitionToCenter = function ($el) {
    var w = $(window).width(),
        h = $(window).height();
    CoLayout.transitions[$el[0].id] = {
        fx: $el.offset().left + $el.width() / 2,
        fy: $el.offset().top + $el.height() / 2,
        tx: w / 2,
        ty: h / 2,
        progress: 0
    };
    CoLayout.force.resume();
}

CoLayout.initiateCollision = function () {
    if (CoLayout.force) {
        CoLayout.force.stop();
    }

    var anchors = [];
    $('.item').each(function (i, el) {
        var item = $(el);
        var anchor = {
            id: el.id,
            x: item.offset().left + item.outerWidth() / 2,
            y: item.offset().top + item.outerHeight() / 2,
            h: item.outerHeight(),
            w: item.outerWidth()
        };
        anchors.push(anchor);
        el.__data__ = anchor;
    });

    CoLayout.force = d3.layout.force()
        .nodes(anchors)
        .size([$(window).width(), $(window).height()])
        .gravity(0)
        .charge(0)
        .on('tick', tick)
        .start();

    var nodes = d3.selectAll('.item')
        .data(anchors, function (a) { return a.id; })
        .call(CoLayout.force.drag);

    function tick(e) {
        nodes
            .each(collide())
            .each(transition(.05))
            .style('left', function (a) { return (a.x - a.w / 2) + 'px'; })
            .style('top', function (a) { return (a.y - a.h / 2) + 'px'; });
    }

    function transition(stepsize) {
        return function (a) {
            if (!(a.id in CoLayout.transitions)) {
                return;
            }
            var t = CoLayout.transitions[a.id];
            t.progress += stepsize;
            if (t.progress > 1) {
                a.x = t.tx;
                a.y = t.ty;
            } else {
                a.x = t.fx + t.progress * (t.tx - t.fx);
                a.y = t.fy + t.progress * (t.ty - t.fy);
            }
            if (t.progress >= 1.3) {
                delete CoLayout.transitions[a.id]
            }
        }
    }

    function collide() {
        var quadtree = d3.geom.quadtree(anchors);
        return function (a) {
            nx1 = a.x - a.w / 2,
            nx2 = a.x + a.w / 2,
            ny1 = a.y - a.h / 2,
            ny2 = a.y + a.h / 2;
            quadtree.visit(function(quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== a)) {
                    var oa = quad.point,
                        x = a.x - oa.x,
                        y = a.y - oa.y,
                        dw = a.w / 2 + oa.w / 2,
                        dh = a.h / 2 + oa.h / 2;
                    if (Math.abs(x) < dw && Math.abs(y) < dh) {
                        x /= 2 * dw;
                        y /= 2 * dh;
                        a.x += x;
                        a.y += y;
                        oa.x -= x;
                        oa.y -= y;
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
        };
    }
};
