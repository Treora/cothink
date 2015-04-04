
Template.canvas.rendered = function () {

};


Template.canvas.helpers({
    item: function () {
        return uiCore.state.get('focussedItem');
    },
});
