CoLayout = {};

CoLayout.force = null;

CoLayout.transitions = {};

CoLayout.positionAtAlmostCenter = function (el) {
    el.position({my:'center', at:'center', of:'body'});
    el.offset({top: el.offset().top + Math.random() - .5, left: el.offset().left + Math.random() -.5});
};

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
};

CoLayout.redrawLinks = function (focussedId) {
    var links = Links.find({ids: focussedId});

    jsPlumb.detachEveryConnection();
    links.forEach(function (link) {
        CoLayout.drawLink(link.ids[0], link.ids[1]);
    });
};

CoLayout.drawLink = function (id1, id2) {
    jsPlumb.connect({source: id1, target: id2});
};

CoLayout.initiateCollision = function () {
    if (CoLayout.force) {
        CoLayout.force.stop();
    }

    var anchors = [];
    $('.item').each(function (i, el) {
        var anchor = createAnchor(el);
        anchors.push(anchor);
        el.__data__ = anchor;
    });

    var links = [];
    Links.find({}).fetch().forEach(function (l) {
        var el1 = document.getElementById(l.ids[0]),
            el2 = document.getElementById(l.ids[1]);
        if (el1 && el2) links.push({source: el1.__data__, target: el2.__data__});
    });

    CoLayout.force = d3.layout.force()
        .nodes(anchors)
        .links(links)
        .linkDistance(100)
        .linkStrength(.1)
        .size([$(window).width(), $(window).height()])
        .gravity(0)
        .charge(-80)
        .chargeDistance(100)
        .on('tick', tick)
        .start();

    var nodes = d3.selectAll('.item')
        .data(anchors, function (a) { return a.id; })
        .call(CoLayout.force.drag);

    function createAnchor(el) {
        var item = $(el);
        var anchor = {
            id: el.id,
            x: item.offset().left + item.outerWidth() / 2,
            y: item.offset().top + item.outerHeight() / 2,
            h: function () {return item.outerHeight();},
            w: function () {return item.outerWidth();},
        };
        return anchor;
    }

    function tick(e) {
        nodes
            .each(collide())
            .each(transition(.05))
            .style('left', function (a) { return (a.x - a.w() / 2) + 'px'; })
            .style('top', function (a) { return (a.y - a.h() / 2) + 'px'; });
        jsPlumb.repaintEverything();
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
            nx1 = a.x - a.w() / 2,
            nx2 = a.x + a.w() / 2,
            ny1 = a.y - a.h() / 2,
            ny2 = a.y + a.h() / 2;
            quadtree.visit(function(quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== a)) {
                    var oa = quad.point,
                        dx = a.x - oa.x,
                        dy = a.y - oa.y,
                        dw = a.w() / 2 + oa.w() / 2,
                        dh = a.h() / 2 + oa.h() / 2;
                    if (Math.abs(dx) < dw && Math.abs(dy) < dh) {
                        dx /= 2 * dw;
                        dy /= 2 * dh;
                        a.x += dx;
                        a.y += dy;
                        oa.x -= dx;
                        oa.y -= dy;
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
        };
    }
};
