
Template.canvas.rendered = function () {

};


Template.canvas.helpers({
    visibleItems: function () {
        return layout.getVisibleItems();
    },
});
