
Template.canvas.rendered = function () {

};


Template.canvas.helpers({
    focussedItem: function () {
        return uiCore.state.get('focussedItem');
    },
    visibleItems: function () {
        return layout.getVisibleItems();
    },
});
