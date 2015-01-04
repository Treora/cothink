CoThink = {};

CoThink.force = null;

CoThink.initiateCollision = function(visibleItems) {
    if (CoThink.force) {
      CoThink.force.stop();
    }

    var anchors = [];
    $('.item').each(function(i, el) {
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

    CoThink.force = d3.layout.force()
        .nodes(anchors)
        .size([$(window).width(), $(window).height()])
        .gravity(0)
        .charge(0)
        .on('tick', tick)
        .start();

    var nodes = d3.selectAll('.item')
        .data(anchors, function(a) { return a.id; })
        .call(CoThink.force.drag);

    function tick(e) {
        nodes
            .each(collide(.5))
            .style('top', function(a) { return (a.y - a.h / 2) + 'px'; })
            .style('left', function(a) { return (a.x - a.w / 2) + 'px'; });
    }

    function collide(alpha) {
      var quadtree = d3.geom.quadtree(anchors);
      return function(a) {
        nx1 = a.x - a.w / 2,
        nx2 = a.x + a.w / 2,
        ny1 = a.y - a.h / 2,
        ny2 = a.y + a.h / 2;
        quadtree.visit(function(quad, x1, y1, x2, y2) {
          if (quad.point && (quad.point !== a)) {
            var x = a.x - quad.point.x,
                y = a.y - quad.point.y;
            if (Math.abs(x) < a.w && Math.abs(y) < a.h) {
              x *= alpha / a.w;
              y *= alpha / a.h;
              a.x += x / 2;
              a.y += y / 2;
              quad.point.x -= x / 2;
              quad.point.y -= y / 2;
            }
          }
          return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
      };
    }
};
